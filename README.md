# 无尽布阵工具 v4 —— 手机网页版 + Windows 桌面客户端

植物大战僵尸2「无尽」阵型设计工具：9×5 画布排阵（主植物 / 融合 / 藤蔓 / 瓷砖）、配队卡槽与配队2、
种植顺序链、路由尾数分流、Boss 喂豆链、O1~O10 体检 + 金卡推演，并能导出 pipeline 片段、一键部署到 MaaPVZ。

## 两种用法

| 版本 | 入口 | 适合 |
| --- | --- | --- |
| **手机网页版**（单文件） | 直接打开 <https://kidbeans.github.io/wujin-layout-tool/>（或下载 `index.html` 离线用） | 手机上随时看阵/改阵：点植物 → 点格子放置；长按格子清空；双击手输入名字；底部五键开「植物库 / 卡槽 / 工具 / 导出」，🔍放大到 46px 可拖动 |
| **Windows 桌面客户端 v4.0.7** | 见下方下载 | 全功能：Agent 工作台、🚀 一键部署到 MPZ、原生另存为、MPZ 原生直读 |

手机上调好的阵型 → 手机端「📤 导出 → 导出 JSON v2」（或「工具 → 复制全部」）→ 传到电脑 →
桌面版「导入阵型 / 应用粘贴的 JSON v2」继续出脚本。

## 下载（桌面客户端 v4.0.7，2026-09-24 构建）

| 文件 | 大小 | 说明 |
| --- | --- | --- |
| [`WujinLayoutTool-v4.0.7-portable.exe`](https://kidbeans.github.io/wujin-layout-tool/WujinLayoutTool-v4.0.7-portable.exe) | 13.29 MB | **桌面便携版**：单文件、双击即用、免安装（推荐） |
| [`WujinLayoutTool-v4.0.7-setup.exe`](https://kidbeans.github.io/wujin-layout-tool/WujinLayoutTool-v4.0.7-setup.exe) | 4.21 MB | NSIS 安装器：想要开始菜单 / 桌面快捷方式，或便携版提示缺 WebView2 时用它 |

系统要求：Windows 10/11 x64，依赖系统自带 WebView2 运行时（通常已预装）；不需要 Python / Node。
校验值见 [`checksums.sha256`](checksums.sha256)（CI 每次推送自动核对）。

## 目录结构

```
.
├── index.html                    手机/网页版单文件（Pages 首页；由 src/ 构建得到，勿手改）
├── WujinLayoutTool-v4.0.7-*.exe  Windows 桌面客户端（便携版 / 安装器）
├── checksums.sha256              发布件校验值（CI 核对）
├── src/
│   ├── web/无尽布阵工具.html      v4 桌面「单文件网页版」（构建输入，零外部依赖）
│   ├── mobile/mobile_layer.*      手机适配层（CSS + JS：棋盘铺满 / 底部浮层 / 触控手势）
│   ├── core/                      v2 逻辑基座（画布·卡槽·顺序·路由·Boss·导出·部署·帮助，单一事实源）
│   └── desktop/                   v4 桌面应用（Tauri 壳 + v3 前端 + 构建脚本；已剔除 target/ 等产物）
├── tools/
│   ├── build_mobile_html.py       打包器：把手机层注入 v4 单文件 → 单文件手机版（幂等，含静态体检）
│   └── _mobile_check.mjs          CDP 真机仿真回归（Edge/Chrome headless：布局 + 触控交互 25 项）
└── docs/
    ├── 使用说明.md                桌面版 / 单文件网页版产物说明
    ├── 手机版说明.md              手机版设计、手势、验证记录与两个已修 bug 的根因
    └── 布阵工具V4_代码审查与修复计划_20260914.md
```

## 构建与校验

```bash
# 由源码重建手机版单文件（改 mobile_layer.* 或换基座后重跑）
python tools/build_mobile_html.py \
  --src "src/web/无尽布阵工具.html" \
  --css src/mobile/mobile_layer.css \
  --js  src/mobile/mobile_layer.js \
  --out index.html

# 只做静态体检（自包含 / 注入标记 / JS 语法 / 与基座逐字节可逆）
python tools/build_mobile_html.py --check \
  --src "src/web/无尽布阵工具.html" --css src/mobile/mobile_layer.css --js src/mobile/mobile_layer.js

# 核对发布件校验值
sha256sum -c checksums.sha256
```

手机层回归（需本机 Edge/Chrome + 一个静态 http 服务）：

```bash
python -m http.server 8765 --bind 127.0.0.1          # 在仓库根目录起服务
msedge --headless=new --remote-debugging-port=9333 about:blank
node tools/_mobile_check.mjs mobile  http://127.0.0.1:8765/index.html 361 780   # 手机档 25 项
node tools/_mobile_check.mjs desktop http://127.0.0.1:8765/index.html 1280 800  # 桌面档不回归 6 项
```

**发布前自检**：把上面三条命令跑一遍（重建比对 + 校验值）。仓库根的 `index.html` 是**构建产物**，
改源码后必须重跑打包器并提交，否则线上页面会与源码脱节。

## 手机网页版要点

- 棋盘为主舞台，9 列一屏装下；底部 5 键：🪴 植物库 / 🎴 卡槽 / ⚙️ 工具 / 📤 导出 / 🔍 放大
- 长按格子 = 清空；双击格子 = 手输入植物名（输入 `-` 清空）；点浮层外空白处收起
- 左栏（顺序 / 路由 / Boss / 检查 / 存档 / 导入导出 / 帮助 / 设置）以底部浮层打开，右上角 ✕ 收起
- 数据存在**浏览器本地**（localStorage），关掉再开还在；换设备请用「导出 JSON v2」带走阵型
- 浏览器/手机版缺少：Agent 工作台、一键部署到 MPZ、完成通知（控制台若报 `/api/...` 404 属正常）
- 建议「添加到主屏幕」，像小 App 一样点开

## 说明

- 公开仓库；文件内**不含任何密钥或个人信息**
- 阵型数据只存在本机 / 本浏览器，工具本身不联网上传任何内容（Agent 工作台是你自己配的 API，另说）
- 桌面端与手机端界面一致：窄屏自动切手机布局（棋盘铺满、其余收成底部浮层）
- 与 MaaPVZ（MFAAvalonia）自制无尽脚本工作流配套使用
- 个人自用工具，按需取用
