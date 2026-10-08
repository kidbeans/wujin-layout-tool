# 无尽布阵工具

PvZ2 无尽用的布阵工具：9×5 画布摆阵（主植物、融合、藤蔓、瓷砖），配队卡槽、种植顺序链、
路由尾数分流、Boss 喂豆链，带 O1~O10 体检和金卡推演，能导出 pipeline 片段，也能一键部署到 MaaPVZ。

两个版本，同一套界面：

- **手机网页版**：打开 https://kidbeans.github.io/wujin-layout-tool/ 直接用；也可以把 `index.html`
  存到手机里离线用。浏览器里顺手「添加到主屏幕」，点开跟小 App 差不多。
- **Windows 桌面版**（v4.0.7，2026-09-24 构建）：比网页版多了 Agent 工作台、一键部署到 MPZ、原生另存为。
  下载 [便携版](https://kidbeans.github.io/wujin-layout-tool/WujinLayoutTool-v4.0.7-portable.exe)（13.29 MB，双击就跑）
  或 [安装器](https://kidbeans.github.io/wujin-layout-tool/WujinLayoutTool-v4.0.7-setup.exe)（4.21 MB，想要开始菜单/桌面快捷方式时用）。
  系统要求 Windows 10/11 x64，依赖系统自带的 WebView2（一般都有）；不用装 Python 和 Node。

文件校验值都写在 `checksums.sha256` 里。

## 手机上怎么用

底部五个键：植物库、卡槽、工具、导出、放大。点开是浮层，点浮层外面就收起。

- 点植物，再点格子就放下了；连着点几个格子等于连续粘同一个组合
- 长按格子 = 清空，双击格子 = 手动改植物名（填 `-` 是清空）
- 左边一列图标（顺序、路由、Boss、检查、存档、导入导出、帮助、设置）也是浮层，右上角 ✕ 收起来
- 「放大」把格子放到 46px，棋盘可以拖着看
- 棋盘按屏幕宽度铺满，9 列一屏能看全

阵型存在浏览器本地（localStorage），关掉再开还在。

手机/网页版没有的功能：Agent 工作台、一键部署到 MPZ、完成通知。控制台偶尔报 `/api/...` 404 是正常的，
那几个接口只有桌面版才有。

## 手机和电脑之间搬阵型

手机上调好之后，「导出 → 导出 JSON v2」存一份 json（或者「工具 → 复制全部」拿文本），
传到电脑，桌面版「导入阵型 / 应用粘贴的 JSON v2」接着弄。反方向一样。

## 仓库里都是什么

```
index.html                    手机/网页版，也是 Pages 的首页（构建产物）
WujinLayoutTool-v4.0.7-*.exe  Windows 桌面版
checksums.sha256              上面三个文件的校验值
src/web/                      桌面版的单文件网页版，手机版就是拿它构建的
src/mobile/                   手机适配层（CSS + JS）
src/core/                     工具本体：画布、卡槽、顺序、路由、Boss、导出、部署、帮助
src/desktop/                  v4 桌面应用（Tauri 壳 + v3 前端 + 构建脚本）
tools/                        打包器，和那个用 CDP 跑手机端回归的脚本
docs/                         使用说明、手机版说明
```

## 改了源码以后

```bash
python tools/build_mobile_html.py \
  --src "src/web/无尽布阵工具.html" \
  --css src/mobile/mobile_layer.css \
  --js  src/mobile/mobile_layer.js \
  --out index.html
```

根目录的 `index.html` 是构建产物，动了源码就得重跑这条命令再提交。CI 会拿源码重新构建一次逐字节比对，
再核一遍 `checksums.sha256`，对不上直接红。只想体检不写文件就在后面加 `--check`。

## 说明

仓库是公开的，文件里没有密钥，也没有我的个人信息。

阵型数据只存在你自己的设备上：手机版在浏览器里，桌面版在应用数据目录。工具不会往上传任何东西。
Agent 工作台算例外，它走的是你自己填的 API。

桌面版和手机版是同一套界面，窗口窄了就自动切成手机布局：棋盘占满，其他都收进底部浮窗。

这工具是配 MaaPVZ 的自制无尽脚本用的，自己顺手放上来，需要就拿去。
