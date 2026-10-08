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

<details>
<summary>SHA256 校验值</summary>

```
WujinLayoutTool-v4.0.7-portable.exe  1b3c8f18a132412fd983f74f9a5385f4f326420a4f30aac9ac6a61ce3ac7a32d
WujinLayoutTool-v4.0.7-setup.exe     25caed98f67e796db8b313c4e2b58c9ae6aeb5629b2e9d2b482ff7e42427d130
index.html                           e406cb4afb9cbbfa6b56a7623a095c2ee1f9609fdbd780653c494bdee2ca84fd
```

</details>

## 手机网页版要点

- 棋盘为主舞台，9 列一屏装下；底部 5 键：🪴 植物库 / 🎴 卡槽 / ⚙️ 工具 / 📤 导出 / 🔍 放大
- 长按格子 = 清空；双击格子 = 手输入植物名（输入 `-` 清空）；点浮层外空白处收起
- 左栏（顺序 / 路由 / Boss / 检查 / 存档 / 导入导出 / 帮助 / 设置）以底部浮层打开，右上角 ✕ 收起
- 数据存在**浏览器本地**（localStorage），关掉再开还在；换设备请用「导出 JSON v2」带走阵型
- 浏览器/手机版缺少：Agent 工作台、一键部署到 MPZ、完成通知（控制台若报 `/api/...` 404 属正常）
- 建议「添加到主屏幕」，像小 App 一样点开

## 仓库内容

| 文件 | 说明 |
| --- | --- |
| `index.html` | 手机/浏览器版单文件工具（同时是 GitHub Pages 首页；样式、脚本、植物图标全部内联，零外部依赖） |
| `WujinLayoutTool-v4.0.7-portable.exe` | Windows 桌面客户端 · 便携版 |
| `WujinLayoutTool-v4.0.7-setup.exe` | Windows 桌面客户端 · 安装器 |
| `.nojekyll` | 关闭 Jekyll 处理，保证静态页按原样发布 |

## 说明

- 公开仓库；文件内**不含任何密钥或个人信息**
- 阵型数据只存在本机 / 本浏览器，工具本身不联网上传任何内容（Agent 工作台是你自己配的 API，另说）
- 桌面端与手机端界面一致：窄屏自动切手机布局（棋盘铺满、其余收成底部浮层）
- 与 MaaPVZ（MFAAvalonia）自制无尽脚本工作流配套使用
- 个人自用工具，按需取用
