// 无尽布阵工具 v3beta —— 桌面入口（release 下隐藏 Windows 控制台）
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    wujin_bz_v3_lib::run()
}
