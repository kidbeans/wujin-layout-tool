// ================= cmds.rs —— 薄命令层（窗口 / 文件 / 系统 / 通知） =================
// 与 agent.rs 同构：命令不放 crate 根（tauri::command 在根模块与多 crate-type 组合下
// 会产生 __cmd__* 宏重定义冲突；模块化是已验证可编译的形态，也符合"装配根只接线"）。
use tauri::{AppHandle, Manager};

pub type CmdResult<T> = Result<T, String>;

fn main_window(app: &AppHandle) -> CmdResult<tauri::WebviewWindow> {
    app.get_webview_window("main").ok_or_else(|| "主窗口不存在".into())
}

/* ---------------- 窗口控制 ---------------- */

#[tauri::command]
pub fn win_min(app: AppHandle) -> CmdResult<()> {
    main_window(&app)?.minimize().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn win_toggle_max(app: AppHandle) -> CmdResult<bool> {
    let w = main_window(&app)?;
    if w.is_maximized().map_err(|e| e.to_string())? {
        w.unmaximize().map_err(|e| e.to_string())?;
    } else {
        w.maximize().map_err(|e| e.to_string())?;
    }
    w.is_maximized().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn win_close(app: AppHandle) -> CmdResult<()> {
    main_window(&app)?.close().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn win_drag(app: AppHandle) -> CmdResult<()> {
    main_window(&app)?.start_dragging().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn win_is_max(app: AppHandle) -> CmdResult<bool> {
    main_window(&app)?.is_maximized().map_err(|e| e.to_string())
}

/* ---------------- 文件 / 目录 / 系统 ---------------- */

#[derive(serde::Deserialize)]
pub struct FileFilter {
    pub name: String,
    #[serde(default)]
    pub exts: Vec<String>,
}

#[tauri::command]
pub fn pick_files(app: AppHandle, title: String, filters: Vec<FileFilter>) -> CmdResult<Option<Vec<String>>> {
    use tauri_plugin_dialog::DialogExt;
    let mut dlg = app.dialog().file().set_title(&title);
    for f in &filters {
        let ext_refs: Vec<&str> = f.exts.iter().map(|s| s.as_str()).collect();
        dlg = dlg.add_filter(f.name.clone(), &ext_refs);
    }
    let picked = dlg.blocking_pick_files();
    Ok(picked.map(|list| list.iter().map(|fp| fp.to_string()).collect::<Vec<String>>()))
}

#[tauri::command]
pub fn pick_save(app: AppHandle, title: String, default_name: String, filters: Vec<FileFilter>) -> CmdResult<Option<String>> {
    use tauri_plugin_dialog::DialogExt;
    let mut dlg = app
        .dialog()
        .file()
        .set_title(&title)
        .set_file_name(&default_name);
    for f in &filters {
        let ext_refs: Vec<&str> = f.exts.iter().map(|s| s.as_str()).collect();
        dlg = dlg.add_filter(f.name.clone(), &ext_refs);
    }
    /* 必须用 save 变体：blocking_pick_file 会弹出「打开(O)」式对话框（实测下载 .json 变成打开） */
    Ok(dlg.blocking_save_file().map(|fp| fp.to_string()))
}

/* 目录选择器（服务面板 MPZ 根目录浏览用） */
#[tauri::command]
pub fn pick_dir(app: AppHandle, title: String) -> CmdResult<Option<String>> {
    use tauri_plugin_dialog::DialogExt;
    let dlg = app.dialog().file().set_title(&title);
    Ok(dlg.blocking_pick_folder().map(|fp| fp.to_string()))
}

#[tauri::command]
pub fn read_text(path: String) -> CmdResult<String> {
    let bytes = std::fs::read(&path).map_err(|e| format!("读取失败 {}：{}", path, e))?;
    Ok(String::from_utf8_lossy(&bytes).to_string())
}

#[tauri::command]
pub fn write_text(path: String, content: String) -> CmdResult<()> {
    if let Some(parent) = std::path::Path::new(&path).parent() {
        std::fs::create_dir_all(parent).map_err(|e| format!("建目录失败：{}", e))?;
    }
    std::fs::write(&path, content.as_bytes()).map_err(|e| format!("写入失败 {}：{}", path, e))
}

#[tauri::command]
pub fn ensure_dir(path: String) -> CmdResult<()> {
    std::fs::create_dir_all(&path).map_err(|e| format!("建目录失败 {}：{}", path, e))
}

#[tauri::command]
pub fn open_path(path: String) -> CmdResult<()> {
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        std::process::Command::new("cmd")
            .args(["/C", "start", "", &path])
            .creation_flags(0x0800_0000)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open").arg(&path).spawn().map_err(|e| e.to_string())?;
    }
    #[cfg(all(unix, not(target_os = "macos")))]
    {
        std::process::Command::new("xdg-open").arg(&path).spawn().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub fn which_client(name: String) -> Option<String> {
    // 含路径分隔符 → 按文件路径探测（如 zcode 内核 zcode.cjs / 手填的绝对路径）
    if name.contains('\\') || name.contains('/') {
        let p = std::path::PathBuf::from(&name);
        return if p.is_file() { Some(p.to_string_lossy().to_string()) } else { None };
    }
    #[cfg(target_os = "windows")]
    let mut cmd = {
        let mut c = std::process::Command::new("where");
        c.arg(&name);
        c
    };
    #[cfg(not(target_os = "windows"))]
    let mut cmd = {
        let mut c = std::process::Command::new("which");
        c.arg(&name);
        c
    };
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x0800_0000);
    }
    let out = cmd.output().ok()?;
    if !out.status.success() {
        return None;
    }
    let text = String::from_utf8_lossy(&out.stdout);
    text.lines()
        .map(|l| l.trim())
        .find(|l| !l.is_empty())
        .map(|s| s.to_string())
}

#[tauri::command]
pub fn notify(app: AppHandle, title: String, body: String) -> CmdResult<()> {
    use tauri_plugin_notification::NotificationExt;
    app.notification()
        .builder()
        .title(title)
        .body(body)
        .show()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn app_info(app: AppHandle) -> serde_json::Value {
    let version = app.package_info().version.to_string();
    let ws_root = app
        .path()
        .app_data_dir()
        .ok()
        .map(|p| {
            let ws = p.join("agent_ws");
            let _ = std::fs::create_dir_all(&ws);
            ws.to_string_lossy().to_string()
        })
        .unwrap_or_default();
    serde_json::json!({ "version": version, "wsRoot": ws_root })
}

/* Agent 运行日志：前端每次任务 START/END 追加一行到 appdata/agent_run.log，便于排障回查 */
#[tauri::command]
pub fn agent_log(app: AppHandle, line: String) -> CmdResult<()> {
    use std::io::Write;
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let path = dir.join("agent_run.log");
    let mut f = std::fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&path)
        .map_err(|e| format!("打开日志失败 {}：{}", path.display(), e))?;
    f.write_all(line.as_bytes())
        .and_then(|_| f.write_all(b"\n"))
        .map_err(|e| format!("写日志失败：{}", e))
}


/* ---------------- 服务面板：原生目录扫描（免 webui 服务，桌面直读 MPZ） ---------------- */

#[derive(serde::Serialize, Clone)]
pub struct SrvFile {
    pub path: String,   /* mpz:相对路径（与 webui 协议一致） */
    pub name: String,
    pub size: u64,
    pub mtime: i64,
}

fn srv_walk(root: &str, sub: &str, exts: &[&str], out: &mut Vec<SrvFile>, depth: usize) {
    if depth > 4 || out.len() > 4000 {
        return;
    }
    let dir = std::path::Path::new(root).join(sub);
    let rd = match std::fs::read_dir(&dir) {
        Ok(r) => r,
        Err(_) => return,
    };
    for e in rd.flatten() {
        let p = e.path();
        if p.is_dir() {
            srv_walk(root, &p.to_string_lossy(), exts, out, depth + 1);
            continue;
        }
        let ext = p.extension().map(|x| x.to_string_lossy().to_lowercase()).unwrap_or_default();
        if !exts.contains(&ext.as_str()) {
            continue;
        }
        let md = match e.metadata() {
            Ok(m) => m,
            Err(_) => continue,
        };
        let rel = p.strip_prefix(root).unwrap_or(&p).to_string_lossy().replace('\\', "/");
        let mtime = md
            .modified()
            .ok()
            .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
            .map(|d| d.as_secs() as i64)
            .unwrap_or(0);
        out.push(SrvFile {
            path: format!("mpz:{}", rel),
            name: p.file_name().map(|x| x.to_string_lossy().to_string()).unwrap_or_default(),
            size: md.len(),
            mtime,
        });
    }
}

#[tauri::command]
pub fn srv_scan(root: String) -> CmdResult<serde_json::Value> {
    let root = root.trim().trim_end_matches(['/', '\\']).to_string();
    if root.is_empty() {
        return Err("MPZ 根目录为空".into());
    }
    if !std::path::Path::new(&root).is_dir() {
        return Err(format!("MPZ 根不存在：{}", root));
    }
    let mut pipe = Vec::new();
    srv_walk(&root, "resource_self/pipeline", &["json"], &mut pipe, 0);
    srv_walk(&root, "resource/pipeline/Endless", &["json"], &mut pipe, 0);
    let mut task = Vec::new();
    srv_walk(&root, "resource_self/task", &["json"], &mut task, 0);
    srv_walk(&root, "resource/task/Endless", &["json"], &mut task, 0);
    let mut logs = Vec::new();
    srv_walk(&root, "debug", &["log", "txt"], &mut logs, 0);
    let mut iface = Vec::new();
    for c in ["interface.json", "resource_self/interface.json"] {
        let p = std::path::Path::new(&root).join(c);
        if let Ok(md) = std::fs::metadata(&p) {
            let mtime = md
                .modified()
                .ok()
                .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
                .map(|d| d.as_secs() as i64)
                .unwrap_or(0);
            iface.push(SrvFile {
                path: format!("mpz:{}", c),
                name: c.rsplit('/').next().unwrap_or(c).to_string(),
                size: md.len(),
                mtime,
            });
        }
    }
    pipe.sort_by(|a, b| a.path.cmp(&b.path));
    task.sort_by(|a, b| a.path.cmp(&b.path));
    logs.sort_by(|a, b| a.path.cmp(&b.path));
    Ok(serde_json::json!({
        "groups": { "pipe": pipe, "task": task, "iface": iface, "logs": logs },
        "root": root
    }))
}
