// ================= wujin_bz_v3_lib —— Tauri 2 壳装配根 =================
// 装配根只接线不实现：薄命令在 cmds.rs，Agent 桥在 agent.rs。
// 插件仅用 dialog（Rust 侧 API，前端无需额外 ACL）与 notification。
mod agent;
mod cmds;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .manage(agent::AgentState::default())
        .invoke_handler(tauri::generate_handler![
            cmds::win_min,
            cmds::win_toggle_max,
            cmds::win_close,
            cmds::win_drag,
            cmds::win_is_max,
            cmds::pick_files,
            cmds::pick_save,
            cmds::pick_dir,
            cmds::read_text,
            cmds::srv_scan,
            cmds::write_text,
            cmds::ensure_dir,
            cmds::open_path,
            cmds::which_client,
            cmds::notify,
            cmds::app_info,
            cmds::agent_log,
            agent::agent_spawn,
            agent::agent_cancel,
            agent::agent_http
        ])
        .run(tauri::generate_context!())
        .expect("无尽布阵工具 v3beta 启动失败");
}
