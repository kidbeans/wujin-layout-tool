/* ================= 70_bridge.js —— v3 桥接层（Tauri 2 / 浏览器双形态） =================
 * 桌面（Tauri，withGlobalTauri 注入 window.__TAURI__）：
 *   invoke 自定义 Rust commands：窗口控制 / 文件对话框 / 读写 / open_path / which / 通知
 *   Agent：agent_spawn（CLI 子进程，stdout/stderr 行流 → 'v3agent' 事件）、agent_http（OpenAI 兼容 SSE 流式）
 * 浏览器（webui / file://）：
 *   无进程与原生对话框能力 —— agent_spawn 不可用（自动转「手动任务包」）；agent_http 用 fetch 直连（受 CORS 限制）。
 * 统一约定：Agent 事件 {id, kind, data}，kind ∈ out|err|chunk|exit|error|done。
 */
'use strict';

var V3Bridge = (function () {
  var api = { mode: 'web' };

  function tauri() {
    return typeof window !== 'undefined' && window.__TAURI__ && window.__TAURI__.core;
  }

  api.detect = function () {
    var t = tauri();
    api.mode = t ? 'tauri' : 'web';
    return api.mode;
  };

  /* ---- 基础 invoke / listen ---- */
  api.invoke = function (cmd, args) {
    if (!tauri()) return Promise.reject(new Error('browser-mode'));
    return window.__TAURI__.core.invoke(cmd, args || {});
  };
  api.listen = function (event, cb) {
    if (!tauri()) return Promise.resolve(function () {});
    return window.__TAURI__.event.listen(event, function (e) { cb(e.payload); });
  };

  /* ---- 窗口控制（v3tauri 模式才显示按钮） ---- */
  api.winMin = function () { return api.invoke('win_min'); };
  api.winToggleMax = function () { return api.invoke('win_toggle_max'); };
  api.winClose = function () { return api.invoke('win_close'); };
  api.winIsMax = function () { return api.invoke('win_is_max').catch(function () { return false; }); };

  /* ---- 文件 / 目录 / 系统 ---- */
  /* filters: [{name:'JSON', exts:['json','jsonc']}] */
  api.pickSave = function (title, defaultName, filters) {
    return api.invoke('pick_save', { title: title || '保存到…', defaultName: defaultName || '未命名.json', filters: filters || [] }).catch(function () { return null; });
  };
  /* 目录选择器（服务面板 MPZ 根目录浏览用）；失败/取消返回 null */
  api.pickDir = function (title) {
    return api.invoke('pick_dir', { title: title || '选择目录' }).catch(function () { return null; });
  };
  api.writeText = function (path, content) { return api.invoke('write_text', { path: path, content: content }); };
  api.ensureDir = function (path) { return api.invoke('ensure_dir', { path: path }); };
  api.openPath = function (path) { return api.invoke('open_path', { path: path }); };
  /* 读任务工作目录文件（一键应用回画布用）；失败返回 null 而非拒绝 */
  api.readText = function (path) { return api.invoke('read_text', { path: path }).catch(function () { return null; }); };
  api.whichClient = function (name) { return api.invoke('which_client', { name: name }).catch(function () { return null; }); };
  api.notify = function (title, body) {
    return api.invoke('notify', { title: title, body: body }).catch(function () {});
  };
  api.appInfo = function () { return api.invoke('app_info').catch(function () { return null; }); };

  /* ---- Agent：CLI 子进程（仅 Tauri） ---- */
  /* opts: {id, program, args:[], cwd, useStdin, prompt} */
  api.agentSpawn = function (opts) {
    if (!tauri()) return Promise.reject(new Error('CLI 模式需要桌面版（Tauri）运行'));
    return api.invoke('agent_spawn', {
      id: opts.id, program: opts.program, args: opts.args || [],
      cwd: opts.cwd || null, useStdin: opts.useStdin !== false, prompt: opts.prompt || ''
    });
  };
  api.agentCancel = function (id) { return api.invoke('agent_cancel', { id: id }).catch(function () {}); };
  /* 端点容错：归一化逻辑在 60_agent.js 的 v3AgentNormalizeChatEndpoint（纯逻辑可测）；
   * 此处兜底引用（该文件未载入时原样返回），保证 Tauri invoke 与 web fetch 两条路径都经过归一化。 */
  function normEndpoint(ep, fmt) {
    if (typeof v3AgentNormalizeChatEndpoint === 'function') return v3AgentNormalizeChatEndpoint(ep, fmt);
    return ep;
  }
  /* Agent 运行日志：桌面版追加到 appdata/agent_run.log；浏览器模式仅 console */
  api.agentLog = function (line) {
    if (tauri()) return api.invoke('agent_log', { line: String(line || '') }).catch(function () {});
    try { console.log('[agent]', line); } catch (e) {}
  };
  api.agentHttpAbort = function (id) {   /* web 模式停止：中止 fetch 流 */
    var c = api._aborts && api._aborts[id];
    if (c) try { c.abort(); } catch (e) {}
  };

  /* ---- Agent：HTTP 流式（openai / anthropic 两种协议，双形态） ----
   * opts: {id, endpoint, model, key, apiFormat:'openai'|'anthropic', messages:[{role,content}], system, temperature}
   *   openai：messages 原样（system 作为首条消息）；SSE choices[0].delta.content
   *   anthropic：system 单独传（Rust 侧拆分）；SSE content_block_delta.delta.text / message_stop
   * onEvt(evt) 收 {id, kind, data}：chunk（增量文本）/ done / error */
  api.agentHttp = function (opts, onEvt) {
    var fmt = opts.apiFormat || 'openai';
    var endpoint = normEndpoint(opts.endpoint, fmt);
    if (tauri()) {
      var un = null, closed = false;
      function off(){ closed = true; if (un) { try { un(); } catch (e) {} un = null; } }
      /* 先注册监听再发起请求：响应可能快于监听就绪，晚了会丢最早的事件 */
      return api.listen('v3agent', function (evt) {
        if (evt && evt.id === opts.id && (evt.kind === 'chunk' || evt.kind === 'reason' || evt.kind === 'done' || evt.kind === 'error')) {
          /* 仅终态退订（泄漏修复）；reason/chunk 是流式数据，退订会掐断思考流与正文 */
          if (evt.kind === 'done' || evt.kind === 'error') off();
          onEvt(evt);
        }
      }).then(function (u) {
        un = u; if (closed) off();
        return api.invoke('agent_http', {
          id: opts.id, endpoint: endpoint, model: opts.model || '', key: opts.key || '',
          apiFormat: fmt, messages: opts.messages || [], system: opts.system || '',
          temperature: (opts.temperature === undefined ? null : opts.temperature),
          effort: opts.effort || null, extraBody: opts.extraBody || null,
          zcodeSession: opts.zcodeSession || null,
          userAgent: opts.userAgent || null
        });
      }).catch(function (e) { off(); onEvt({ id: opts.id, kind: 'error', data: String(e) }); });
    }
    /* web：fetch SSE（需要端点允许跨域；Ollama 需 OLLAMA_ORIGINS 包含页面来源） */
    var body, headers = { 'Content-Type': 'application/json' };
    /* ZCode 伪装：浏览器 fetch 无法覆写 User-Agent（禁用头），web 侧只下发 x-* 身份头；
     * 完整 ZCode 头（含 user-agent）由桌面版 Rust 侧补全（见 agent.rs zcode_headers）。 */
    if (opts.zcodeSession && typeof v3AgentZcodeHeaders === 'function'){
      var zh = v3AgentZcodeHeaders(opts.zcodeSession);
      if (zh) Object.keys(zh).forEach(function (hk){
        if (hk.toLowerCase() !== 'user-agent') headers[hk] = zh[hk];
      });
    }
    if (fmt === 'anthropic') {
      headers['x-api-key'] = opts.key || '';
      headers['anthropic-version'] = '2023-06-01';
      body = {
        model: opts.model || '', stream: true, max_tokens: 8192,
        system: opts.system || '',
        messages: (opts.messages || []).filter(function (m) { return m.role !== 'system'; }),
        temperature: opts.temperature === undefined || opts.temperature === null ? undefined : opts.temperature
      };
    } else {
      if (opts.key) headers.Authorization = 'Bearer ' + opts.key;
      var msgs = (opts.messages || []).slice();
      if (opts.system) msgs = [{ role: 'system', content: opts.system }].concat(msgs);
      body = { model: opts.model || '', stream: true, messages: msgs };
      if (opts.temperature !== undefined && opts.temperature !== null) body.temperature = opts.temperature;
      if (opts.effort) body.reasoning_effort = opts.effort;   /* 推理模型思考强度（low 可大幅提速） */
    }
    if (opts.extraBody && typeof opts.extraBody === 'object') Object.assign(body, opts.extraBody);
    var ctrl = new AbortController();
    api._aborts = api._aborts || {};
    api._aborts[opts.id] = ctrl;
    return fetch(endpoint, { method: 'POST', headers: headers, body: JSON.stringify(body), signal: ctrl.signal }).then(function (resp) {
      if (!resp.ok) return resp.text().then(function (t) { throw new Error('HTTP ' + resp.status + ' ' + t.slice(0, 300)); });
      var ct = (resp.headers && resp.headers.get('content-type') || '').toLowerCase();
      if (ct.indexOf('text/event-stream') === -1){
        /* 非流式兜底：网关忽略 stream:true 直接回整段 JSON（OpenAI 标准或自定义 thinking/content 结构） */
        return resp.json().then(function (v){
          delete api._aborts[opts.id];
          var msg = (v && v.choices && v.choices[0] && v.choices[0].message) || {};
          var reason = msg.reasoning_content || msg.reasoning || v.thinking;
          if (reason) onEvt({ id: opts.id, kind: 'reason', data: String(reason) });
          var content = msg.content || v.content || v.response;
          if (content){
            onEvt({ id: opts.id, kind: 'chunk', data: String(content) });
            onEvt({ id: opts.id, kind: 'done', data: '' });
          } else {
            var err = (v && v.error && (v.error.message || v.error)) || '响应无内容';
            onEvt({ id: opts.id, kind: 'error', data: typeof err === 'string' ? err : JSON.stringify(err) });
          }
        });
      }
      if (!resp.body || !resp.body.getReader) throw new Error('当前环境不支持流式读取');
      var reader = resp.body.getReader();
      var dec = new TextDecoder();
      var buf = '';
      function extract(payload) {
        if (payload === '[DONE]') return 'done';
        try {
          var j = JSON.parse(payload);
          if (fmt === 'anthropic') {
            if (j.type === 'content_block_delta' && j.delta) {
              if (j.delta.text) return { text: j.delta.text };
              if (j.delta.thinking) return { reason: j.delta.thinking };
            }
            if (j.type === 'message_stop') return 'done';
          } else {
            var d = j.choices && j.choices[0] && j.choices[0].delta;
            if (d && d.content) return { text: d.content };
            /* 推理模型（DeepSeek-R1 系 / omen 等）先流 reasoning_content，透传为 reason 事件 */
            if (d && (d.reasoning_content || d.reasoning)) return { reason: d.reasoning_content || d.reasoning };
            if (j.choices && j.choices[0] && j.choices[0].finish_reason === 'stop') return 'done';
          }
        } catch (e) {}
        return null;
      }
      var stopped = false;
      function pump() {
        if (stopped) return;
        return reader.read().then(function (r) {
          if (r.done) { stopped = true; delete api._aborts[opts.id]; onEvt({ id: opts.id, kind: 'done', data: '' }); return; }
          buf += dec.decode(r.value, { stream: true });
          var lines = buf.split('\n');
          buf = lines.pop();
            lines.forEach(function (line) {
              line = line.trim();
              if (line.indexOf('data:') !== 0) return;
              var res = extract(line.slice(5).trim());
              if (res === 'done'){ stopped = true; delete api._aborts[opts.id]; onEvt({ id: opts.id, kind: 'done', data: '' }); }
              else if (res && res.reason) onEvt({ id: opts.id, kind: 'reason', data: res.reason });
              else if (res && res.text) onEvt({ id: opts.id, kind: 'chunk', data: res.text });
            });
          return pump();
        });
      }
      return pump();
    }).catch(function (e) {
      delete api._aborts[opts.id];
      var m = String(e && e.message || e);
      onEvt({ id: opts.id, kind: e.name === 'AbortError' ? 'done' : 'error',
              data: e.name === 'AbortError' ? '' : m + '（浏览器直连受 CORS 限制；桌面版走 Rust 端无此限制）' });
    });
  };

  return api;
})();
