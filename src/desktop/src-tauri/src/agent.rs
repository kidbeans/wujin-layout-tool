// ================= agent.rs —— Agent 桥（CLI 子进程 + OpenAI 兼容流式 HTTP） =================
// 事件通道：webview 统一监听 "v3agent"，负载 {id, kind, data}，kind ∈ out|err|exit|chunk|reason|done|error。
//   · agent_spawn：CLI Agent（zcode / claude / codex …）。prompt 默认走 stdin（避开 Windows 命令行长度上限
//     与转义问题）；profile 参数含 {prompt} 占位时改走参数。Windows 隐藏控制台窗（CREATE_NO_WINDOW）。
//     取消用 taskkill /T /F 连树杀（node 类 CLI 会派生子进程）。
//   · agent_http：OpenAI 兼容 /v1/chat/completions SSE 流式（DeepSeek / Ollama / 网关），桌面侧请求无 CORS。
use std::collections::HashMap;
use std::io::{BufRead, BufReader, Write};
use std::process::{Command, Stdio};
use std::sync::Mutex;
use std::thread;
use std::time::Duration;

use tauri::{AppHandle, Emitter, Manager, State};

#[derive(Default)]
pub struct AgentState {
    pub pids: Mutex<HashMap<String, u32>>,
    pub http_tasks: Mutex<HashMap<String, tauri::async_runtime::JoinHandle<()>>>,
}

#[derive(Clone, serde::Serialize)]
struct AgentEvt {
    id: String,
    kind: String,
    data: String,
}

fn emit(app: &AppHandle, id: &str, kind: &str, data: impl Into<String>) {
    let _ = app.emit(
        "v3agent",
        AgentEvt { id: id.to_string(), kind: kind.to_string(), data: data.into() },
    );
}

fn spawn_quiet(cmd: &mut Command) -> Result<std::process::Output, String> {
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x0800_0000);
    }
    cmd.output().map_err(|e| e.to_string())
}

/* ---------------- CLI 子进程 ---------------- */

fn default_stdin() -> bool {
    true
}

#[derive(serde::Deserialize)]
pub struct SpawnArgs {
    pub id: String,
    pub program: String,
    #[serde(default)]
    pub args: Vec<String>,
    #[serde(default)]
    pub cwd: Option<String>,
    #[serde(default = "default_stdin")]
    pub use_stdin: bool,
    #[serde(default)]
    pub prompt: String,
}

#[tauri::command]
pub fn agent_spawn(app: AppHandle, st: State<AgentState>, a: SpawnArgs) -> Result<(), String> {
    let mut cmd = Command::new(&a.program);
    cmd.args(&a.args).stdout(Stdio::piped()).stderr(Stdio::piped());
    if a.use_stdin {
        cmd.stdin(Stdio::piped());
    } else {
        cmd.stdin(Stdio::null());
    }
    if let Some(c) = &a.cwd {
        cmd.current_dir(c);
    }
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x0800_0000);
    }
    let mut child = cmd.spawn().map_err(|e| format!("无法启动 {}：{}", a.program, e))?;
    let pid = child.id();
    st.pids.lock().unwrap().insert(a.id.clone(), pid);

    // stdin：写完即关闭（drop），CLI 读到 EOF 开始处理
    if a.use_stdin {
        if let Some(mut si) = child.stdin.take() {
            let prompt = a.prompt.clone();
            thread::spawn(move || {
                let _ = si.write_all(prompt.as_bytes());
                let _ = si.flush();
            });
        }
    }

    let out = child.stdout.take();
    let err = child.stderr.take();
    let app_out = app.clone();
    let id_out = a.id.clone();
    thread::spawn(move || {
        if let Some(o) = out {
            for line in BufReader::new(o).lines() {
                match line {
                    Ok(l) => emit(&app_out, &id_out, "out", l),
                    Err(_) => break,
                }
            }
        }
    });
    let app_err = app.clone();
    let id_err = a.id.clone();
    thread::spawn(move || {
        if let Some(e) = err {
            for line in BufReader::new(e).lines() {
                match line {
                    Ok(l) => emit(&app_err, &id_err, "err", l),
                    Err(_) => break,
                }
            }
        }
    });

    // 退出监听：轮询 try_wait（kill 走 pid 表，不与 wait 抢所有权）
    let app_w = app.clone();
    let id_w = a.id.clone();
    thread::spawn(move || {
        loop {
            match child.try_wait() {
                Ok(Some(status)) => {
                    let code = status.code().unwrap_or(-1);
                    emit(&app_w, &id_w, "exit", code.to_string());
                    if let Some(st2) = app_w.try_state::<AgentState>() {
                        st2.pids.lock().unwrap().remove(&id_w);
                    }
                    break;
                }
                Ok(None) => thread::sleep(Duration::from_millis(150)),
                Err(e) => {
                    emit(&app_w, &id_w, "error", format!("进程等待失败：{}", e));
                    break;
                }
            }
        }
    });
    Ok(())
}

#[tauri::command]
pub fn agent_cancel(_app: AppHandle, st: State<AgentState>, id: String) {
    if let Some(pid) = st.pids.lock().unwrap().remove(&id) {
        #[cfg(windows)]
        {
            let _ = spawn_quiet(
                Command::new("taskkill")
                    .args(["/PID", &pid.to_string(), "/T", "/F"]),
            );
        }
        #[cfg(not(windows))]
        {
            let _ = Command::new("kill").arg(pid.to_string()).output();
        }
    }
    if let Some(h) = st.http_tasks.lock().unwrap().remove(&id) {
        h.abort();
    }
}

/* ---------------- 流式 HTTP（openai / anthropic 两种协议） ---------------- */

#[derive(serde::Deserialize)]
pub struct ChatMsg {
    pub role: String,
    pub content: String,
}

/* OpenAI 兼容端点容错：只填基础地址（如 https://host/v1）时自动补 /chat/completions；
 * 已含 chat/completions、/messages 端点、非 http(s) 串原样保留（仅尾斜杠归一）。
 * 案例：https://opencode.ai/zen/go/v1 是网关基础地址，直连会命中网站页面路由返回 HTML 404。
 * 与前端 60_agent.js v3AgentNormalizeChatEndpoint 同逻辑（前端已归一化时此处幂等）。 */
fn normalize_openai_endpoint(endpoint: &str) -> String {
    let s = endpoint.trim();
    let low = s.to_ascii_lowercase();
    if low.is_empty()
        || (!low.starts_with("http://") && !low.starts_with("https://"))
        || low.ends_with("/messages")
    {
        return s.to_string();
    }
    if low.contains("chat/completions") {
        return s.trim_end_matches('/').to_string();
    }
    format!("{}/chat/completions", s.trim_end_matches('/'))
}

/* 把 extra_body 逐键合并进请求体（LinguaGacha 式 extra_body，覆盖同名默认键） */
fn merge_extra_body(body: &mut serde_json::Value, extra: &Option<serde_json::Value>) {
    if let Some(ex) = extra.as_ref().and_then(|v| v.as_object()) {
        if let Some(tgt) = body.as_object_mut() {
            for (k, v) in ex {
                tgt.insert(k.clone(), v.clone());
            }
        }
    }
}

/* ZCode 伪装身份头（据实测 ZCode→网关报文复刻）。OpenCode Go 文档称其能识别 ZCode 原生会话请求头，
 * 故以稳定 x-session-id 绑定整段对话即可（不必发 x-opencode-session）。User-Agent 由调用方决定
 * （留空则用 ZCode 默认 UA），本函数负责组装其余身份头。桌面版走 Rust 可自由设 User-Agent；
 * 浏览器 fetch 禁用该头，web 侧只下发 x-* 身份头（见 70_bridge.js）。 */
fn zcode_headers(sid: &str, user_agent: &str) -> Vec<(String, String)> {
    vec![
        ("user-agent".to_string(), user_agent.to_string()),
        ("x-session-id".to_string(), sid.to_string()),
        ("x-zcode-app-version".to_string(), "3.11.2".to_string()),
        ("x-zcode-session-type".to_string(), "main".to_string()),
        ("x-title".to_string(), "Z Code@electron".to_string()),
        ("http-referer".to_string(), "https://zcode.z.ai".to_string()),
        ("x-platform".to_string(), "win32-x64".to_string()),
        ("x-os-category".to_string(), "windows".to_string()),
        ("x-os-version".to_string(), "10.0.26100".to_string()),
        ("x-client-language".to_string(), "zh-CN".to_string()),
        ("x-client-timezone".to_string(), "Asia/Shanghai".to_string()),
        ("x-release-channel".to_string(), "production".to_string()),
    ]
}

#[tauri::command]
pub async fn agent_http(
    app: AppHandle,
    st: State<'_, AgentState>,
    id: String,
    endpoint: String,
    model: String,
    key: String,
    api_format: Option<String>,
    messages: Vec<ChatMsg>,
    system: Option<String>,
    temperature: Option<f64>,
    effort: Option<String>,
    extra_body: Option<serde_json::Value>,
    zcode_session: Option<String>,
    user_agent: Option<String>,
) -> Result<(), String> {
    let fmt = api_format.filter(|s| !s.is_empty()).unwrap_or_else(|| "openai".to_string());
    let endpoint = if fmt == "openai" { normalize_openai_endpoint(&endpoint) } else { endpoint };
    let system = system.unwrap_or_default();
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(600))
        .build()
        .map_err(|e| e.to_string())?;

    let msgs_json: Vec<serde_json::Value> = messages
        .iter()
        .map(|m| serde_json::json!({ "role": m.role, "content": m.content }))
        .collect();
    let mut req = if fmt == "anthropic" {
        // Anthropic /v1/messages：system 顶层、max_tokens 必填、鉴权走 x-api-key
        let mut body = serde_json::json!({
            "model": model,
            "stream": true,
            "max_tokens": 8192,
            "system": system,
            "messages": msgs_json,
        });
        if let Some(t) = temperature {
            body["temperature"] = serde_json::json!(t);
        }
        merge_extra_body(&mut body, &extra_body);
        let mut r = client.post(&endpoint).json(&body);
        if !key.is_empty() {
            r = r.header("x-api-key", &key).header("anthropic-version", "2023-06-01");
        }
        r
    } else {
        let mut body = serde_json::json!({ "model": model, "stream": true, "messages": msgs_json });
        if let Some(t) = temperature {
            body["temperature"] = serde_json::json!(t);
        }
        // 思考强度（LinguaGacha 式 thinking level）：low 可让推理模型（omen/DeepSeek-R1 系）大幅提速
        if let Some(e) = effort.as_ref().filter(|s| !s.is_empty()) {
            body["reasoning_effort"] = serde_json::json!(e);
        }
        merge_extra_body(&mut body, &extra_body);
        let mut r = client.post(&endpoint).json(&body);
        if !key.is_empty() {
            r = r.bearer_auth(&key);
        }
        r
    };
    req = req.header("accept", "text/event-stream");
    /* ZCode 伪装：会话 ID 非空时下发整套 ZCode 身份头；User-Agent 留空则用 ZCode 默认 UA，
     * 填了就用自定义的（设置页「User-Agent」框）。非伪装模式若填了 UA 也照发；都没填走 reqwest 默认。 */
    let ua_override = user_agent.as_deref().map(str::trim).filter(|s| !s.is_empty());
    if let Some(sid) = zcode_session.as_ref().map(|s| s.trim()).filter(|s| !s.is_empty()) {
        let default_ua = "ZCode/3.11.2 ai-sdk/provider-utils/4.0.39 runtime/node.js/24".to_string();
        let ua = ua_override.unwrap_or(default_ua.as_str());
        for (k, v) in zcode_headers(sid, ua) {
            req = req.header(k, v);
        }
    } else if let Some(ua) = ua_override {
        req = req.header("user-agent", ua);
    }
    let resp = req.send().await.map_err(|e| format!("请求失败：{}", e))?;
    let status = resp.status();
    if !status.is_success() {
        let t = resp.text().await.unwrap_or_default();
        let head: String = t.chars().take(400).collect();
        return Err(format!("HTTP {}：{}", status, head));
    }
    // 非流式兜底：部分网关忽略 stream:true，直接回整段 JSON（OpenAI 标准结构或自定义 thinking/content 结构）。
    // 此时按整段解析并一次性发出，避免界面干等 SSE 行直到看门狗介入。
    let ct = resp
        .headers()
        .get(reqwest::header::CONTENT_TYPE)
        .and_then(|v| v.to_str().ok())
        .unwrap_or("")
        .to_ascii_lowercase();
    if !ct.contains("text/event-stream") {
        let body = resp.text().await.map_err(|e| format!("读取响应失败：{}", e))?;
        return match serde_json::from_str::<serde_json::Value>(&body) {
            Ok(v) => {
                let msg = &v["choices"][0]["message"];
                let reason = msg["reasoning_content"]
                    .as_str()
                    .or_else(|| msg["reasoning"].as_str())
                    .or_else(|| v["thinking"].as_str());
                if let Some(r) = reason {
                    if !r.is_empty() {
                        emit(&app, &id, "reason", r);
                    }
                }
                let content = msg["content"]
                    .as_str()
                    .or_else(|| v["content"].as_str())
                    .or_else(|| v["response"].as_str());
                match content {
                    Some(c) if !c.is_empty() => {
                        emit(&app, &id, "chunk", c);
                        emit(&app, &id, "done", "");
                        if let Some(st2) = app.try_state::<AgentState>() {
                            st2.http_tasks.lock().unwrap().remove(&id);
                        }
                        Ok(())
                    }
                    _ => {
                        let err = v["error"]["message"]
                            .as_str()
                            .map(|s| s.to_string())
                            .unwrap_or_else(|| body.chars().take(400).collect());
                        Err(format!("HTTP {}：{}", status, err))
                    }
                }
            }
            Err(_) => {
                let head: String = body.chars().take(400).collect();
                Err(format!("HTTP {}（非流式响应解析失败）：{}", status, head))
            }
        };
    }
    let fmt2 = fmt.clone();

    let app2 = app.clone();
    let id2 = id.clone();
    let handle = tauri::async_runtime::spawn(async move {
        use futures_util::StreamExt;
        let mut stream = resp.bytes_stream();
        let mut buf: Vec<u8> = Vec::new();
        let mut finished = false;
        while let Some(chunk) = stream.next().await {
            match chunk {
                Ok(bytes) => {
                    buf.extend_from_slice(&bytes);
                    while let Some(pos) = buf.iter().position(|&b| b == b'\n') {
                        let line: Vec<u8> = buf.drain(..=pos).collect();
                        let s = String::from_utf8_lossy(&line).trim().to_string();
                        if let Some(payload) = s.strip_prefix("data:") {
                            let payload = payload.trim();
                            if payload == "[DONE]" {
                                emit(&app2, &id2, "done", "");
                                finished = true;
                                break;
                            }
                            if let Ok(v) = serde_json::from_str::<serde_json::Value>(payload) {
                                let mut delta: Option<String> = None;
                                let mut stop = false;
                                if fmt2 == "anthropic" {
                                    match v["type"].as_str() {
                                        Some("content_block_delta") => {
                                            delta = v["delta"]["text"].as_str().map(|s| s.to_string());
                                            // anthropic thinking 块：thinking 文本走 reason 事件（思考过程可见）
                                            if delta.is_none() {
                                                if let Some(t) = v["delta"]["thinking"].as_str() {
                                                    if !t.is_empty() {
                                                        emit(&app2, &id2, "reason", t);
                                                    }
                                                }
                                            }
                                        }
                                        Some("message_stop") => stop = true,
                                        _ => {}
                                    }
                                } else {
                                    delta = v["choices"][0]["delta"]["content"].as_str().map(|s| s.to_string());
                                    if delta.as_deref().map(str::is_empty).unwrap_or(true) {
                                        // 推理模型（DeepSeek-R1 系 / omen 等）先输出整段 reasoning_content 才出正文，
                                        // 必须以 reason 事件透传，否则思考阶段界面长时间空白形似卡死
                                        let reason = v["choices"][0]["delta"]["reasoning_content"].as_str()
                                            .or_else(|| v["choices"][0]["delta"]["reasoning"].as_str())
                                            .map(|s| s.to_string());
                                        if let Some(r) = reason {
                                            if !r.is_empty() {
                                                emit(&app2, &id2, "reason", r);
                                            }
                                        }
                                    }
                                    if v["choices"][0]["finish_reason"].as_str() == Some("stop") {
                                        stop = true;
                                    }
                                }
                                if let Some(d) = delta {
                                    if !d.is_empty() {
                                        emit(&app2, &id2, "chunk", d);
                                    }
                                }
                                if stop {
                                    emit(&app2, &id2, "done", "");
                                    finished = true;
                                    break;
                                }
                            }
                        }
                    }
                    if finished {
                        break;
                    }
                }
                Err(e) => {
                    emit(&app2, &id2, "error", format!("流中断：{}", e));
                    if let Some(st2) = app2.try_state::<AgentState>() {
                        st2.http_tasks.lock().unwrap().remove(&id2);
                    }
                    return;
                }
            }
        }
        if !finished {
            emit(&app2, &id2, "done", "");
        }
        if let Some(st2) = app2.try_state::<AgentState>() {
            st2.http_tasks.lock().unwrap().remove(&id2);
        }
    });
    st.http_tasks.lock().unwrap().insert(id, handle);
    Ok(())
}

/* ---------------- 单元测试（cargo test，不依赖 tauri 运行时） ---------------- */

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sse_line_parsing_shape() {
        // 校验我们解析 SSE data 行所依赖的 JSON 形状（openai 与 anthropic 两种协议）
        let openai = r#"{"choices":[{"delta":{"content":"你好"},"finish_reason":null}]}"#;
        let v: serde_json::Value = serde_json::from_str(openai).unwrap();
        assert_eq!(v["choices"][0]["delta"]["content"].as_str(), Some("你好"));
        let done = r#"{"choices":[{"delta":{},"finish_reason":"stop"}]}"#;
        let v2: serde_json::Value = serde_json::from_str(done).unwrap();
        assert_eq!(v2["choices"][0]["finish_reason"].as_str(), Some("stop"));

        let anthropic = r#"{"type":"content_block_delta","delta":{"type":"text_delta","text":"𝔅"}}"#;
        let v3: serde_json::Value = serde_json::from_str(anthropic).unwrap();
        assert_eq!(v3["delta"]["text"].as_str(), Some("𝔅"));
        let mstop = r#"{"type":"message_stop"}"#;
        let v4: serde_json::Value = serde_json::from_str(mstop).unwrap();
        assert_eq!(v4["type"].as_str(), Some("message_stop"));
    }

    #[test]
    fn spawn_args_deserialize_defaults() {
        let raw = r#"{"id":"r1","program":"zcode"}"#;
        let a: SpawnArgs = serde_json::from_str(raw).unwrap();
        assert!(a.use_stdin);
        assert!(a.args.is_empty());
        assert!(a.cwd.is_none());
    }

    #[test]
    fn agent_http_args_deserialize() {
        let raw = r#"{"id":"r1","endpoint":"https://api.anthropic.com/v1/messages","model":"claude-sonnet-4-5",
            "key":"sk","api_format":"anthropic","messages":[{"role":"user","content":"hi"}],
            "system":"sys","temperature":1.0}"#;
        let a: Result<ChatMsg, _> = serde_json::from_str(r#"{"role":"user","content":"hi"}"#);
        assert!(a.is_ok());
        let v: serde_json::Value = serde_json::from_str(raw).unwrap();
        assert_eq!(v["api_format"], "anthropic");
        assert_eq!(v["messages"][0]["role"], "user");
    }

    #[test]
    fn openai_endpoint_tolerance() {
        // 只填基础地址 → 自动补 /chat/completions
        assert_eq!(
            normalize_openai_endpoint("https://opencode.ai/zen/go/v1"),
            "https://opencode.ai/zen/go/v1/chat/completions"
        );
        assert_eq!(
            normalize_openai_endpoint("https://opencode.ai/zen/go/v1/"),
            "https://opencode.ai/zen/go/v1/chat/completions"
        );
        // 完整端点 / 尾斜杠归一 / anthropic 端点 / 非 http(s) 串原样
        assert_eq!(
            normalize_openai_endpoint("https://api.deepseek.com/v1/chat/completions"),
            "https://api.deepseek.com/v1/chat/completions"
        );
        assert_eq!(
            normalize_openai_endpoint("https://api.deepseek.com/v1/chat/completions/"),
            "https://api.deepseek.com/v1/chat/completions"
        );
        assert_eq!(
            normalize_openai_endpoint("http://127.0.0.1:3000/v1/messages"),
            "http://127.0.0.1:3000/v1/messages"
        );
        assert_eq!(normalize_openai_endpoint(""), "");
        assert_eq!(normalize_openai_endpoint("not-a-url"), "not-a-url");
    }

    #[test]
    fn zcode_headers_shape() {
        let hs = zcode_headers("2e13f16a-452e-4180-94ec-04b4d633f8c4", "ZCode/3.11.2 ai-sdk/provider-utils/4.0.39 runtime/node.js/24");
        assert!(hs
            .iter()
            .any(|(k, v)| k == "x-session-id" && v == "2e13f16a-452e-4180-94ec-04b4d633f8c4"));
        assert!(hs
            .iter()
            .any(|(k, v)| k == "user-agent" && v.starts_with("ZCode/")));
        assert!(hs.iter().any(|(k, v)| k == "http-referer" && v == "https://zcode.z.ai"));
        assert!(hs.iter().any(|(k, v)| k == "x-zcode-app-version" && v == "3.11.2"));
    }
}
