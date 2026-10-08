# 无尽布阵工具 v3 工程

> 在 v2 基础上的桌面化重构版：**UI 全面重构**（参照 [dsh_desktop](https://github.com/myYangyunfan/dsh_desktop) 的
> 「深色玻璃无边框 + 左侧导航 + 会话式 Agent 工作台 + 右侧工具坞 + 底部状态栏」设计语言），
> **桌面壳从 pywebview 迁移到 Tauri 2（Rust）**——单文件 13.6MB（对比 v2 pywebview 壳 39MB），
> **Agent 一键接入**：zcode / Claude Code / Codex 等 CLI 与 DeepSeek API / Ollama 等 OpenAI 兼容端点，
> 把当前布阵交给智能体做个性化/针对性检查与设计。
> **v2 的全部布阵能力原样保留**（六套预设 / 顺序 / 路由 / Boss / 检查链 / 存档 / 导入导出 / 触控 / 图鉴图标），
> v2 基座以「单一事实源」方式被 v3 构建直接复用，v2 的修复自动流入 v3。

## v0.4 增补（2026-09-05 ~ 09-06）：主题引擎 / 金卡推演 / 通用框架兼容 / 修复历程全记录

> 本段为两天迭代的完整修复与功能历程。v3beta 为优化试验线（标识符独立，可与 v3 并存安装），
> 基座（无尽布阵工具v2/src）保持只读共享，差异化走构建期覆写（tools/patch_v1.py）。

### A. 布阵核心新功能

1. **金卡推演（O9，2026-09-06 语义修正）**：金卡（橙色）初始每种 3 次——推演链里只种每种前 3 个时，
   第一关每行是否有守阵主力（气流/珊瑚等辅助不计；军炮/苹果迫击炮/暗物质火龙果等追踪直接视为安全）。
   **分级**：① 融合格（大哥+材料）超次大哥步**未开金卡检测（检）→ error「融合断点」**——纯静态即可查出
   "大哥超次盲种失败→材料落单断融合"这一关键风险，修法=顺序面板勾「检」（不靠 AI）；② 第一关行无守阵
   主力 → error，报文带**三选一修法**（提前到同种前3步内 / 换非金卡主力 / 接受追踪覆盖）；③ 其余超次步
   → **info「通用性预留」非错误**（超 3 次写链是为后续关卡留的通用位）。可视化徽章不变。
   白名单可经导出 JSON 的 `goldSim` 字段调整。测试 30 项（test/test_gold_sim.js）。
2. **官方通用框架（custom 前期 + fw 后期）单 JSON 兼容**：逆向 MaaPvz「可视化无尽通用框架」的导出格式
   （MaaFramework 选项集：卡N种植→第i次→坐标 input + 官方 pipeline_override），生成器
   `tools/gen_frame_templates.py` 从官方资源提取 445 选项模板；画布⇄选项树双向转换
   （融合=同格双卡、守卫菇/铲子/喂豆/后期补卡2~8 全映射；未用分支保留官方 No 缺省保路由正确）。
   入口：导出 v2 面板 + 官方画像「通用框架」卡片。**官方模板守卫**：资源文件全默认 1-1 不误判为布阵。
   测试 32 项（test/test_frame_io.js）。
3. **植物品质统计**：默认库 58 种全量品质（橙36/紫10/蓝6/绿4/白2），
   `docs/植物品质统计.md` + 生成器 `tools/gen_quality_doc.py`（加植物后重跑）。

### B. 主题引擎（重构）与修复

4. **浅色为默认主题**——修复历史缺陷：v2/v3 此前两套主题其实都是深色（body 背景硬编码），
   "浅色"从未真正存在。现 :root 浅色调色 + 深色由 body.maa 显式接管。
5. **11 款预设**：浅色（默认）· DSH 纸白 · 深色 · 毛玻璃 · 极光渐变 · 暮霞渐变 ·
   DSH 品牌蓝 · Success 翠绿 · Danger 绯红 · Diff 墨青 · 自定义。
   暗色系为完整调色（背景/卡片/边框/外壳随色相），配色语义参考 dsh 插件设计令牌（brand/success/danger/diff）。
6. **弥散光壁纸层（参考 dsh-dream-skin 架构）**：壁纸层 fixed + z-index:-1 + 46s 漂移动画
   （prefers-reduced-motion 自适应），主画布/侧栏/标题栏半透明化让渐变真正可见——
   修复"渐变没有真正渐变"（根因：body.v3 的 --v3-bg 平色盖住了 body 渐变 + 主题只改强调色）。
7. **背景图片壁纸**（自定义主题）：文件选择器 / URL / 本地路径三通道（Tauri convertFileSrc 自动转换），
   透明度/模糊滑条实时生效；**侧栏/标题栏跟随背景（毛玻璃）**为全局开关（所有主题生效）。
8. **主题弹窗误关闭修复**：点击主题项后重建弹窗 innerHTML，原点击目标游离、被"点击外部关闭"误判——补 stopPropagation。
9. **帮助手册**：16 节用户手册内嵌（src/help_user.html），v3 为独立"帮助"视图（F1 / 左 rail 📖），
   v2 为固定左栏面板；TOC 自动生成 + 滚动高亮。**修复漏建 #v2p-help 容器导致文档裸露页顶且无法关闭**
   （该 bug 暴露了"字符串测试≠渲染正确"，由此建立 Playwright 无头渲染冒烟 test/smoke_v3_ui.py）。

### C. 桌面壳 / 服务面板 / 导出 IO

10. **服务面板桌面原生直读（免 webui）**：新增 Rust `srv_scan` 命令镜像 webui 的目录扫描协议
    （pipeline/task/iface/logs 四分组），桌面模式自动走原生分支——免服务、免端口、免 Python；
    浏览器模式仍走 webui。**修复探测写死 8765 端口**（用户实际 8767）——改为 多端口扫描 + 可用地址记忆 + 手动服务地址输入。
11. **导出全链原生（不依赖 web）**：`v2Download` 在桌面包装为 原生另存为 + Rust 写盘；
    **修复「导出 txt」绕过该包装**（Blob anchor 在 WebView2 不可靠）；取消保存对话框不再误触发浏览器下载；
    剪贴板复制增加成功/失败提示。
12. **tools/build_app.py 三连修**：npx 在 Windows 需解析 `npx.CMD` 全路径（WinError 2）；
    安装包文件名写死 3.0.0 导致新包不归位（改按 mtime 取最新）；目标 exe 被占用时容错提示而非中断。

### D. v3beta 优化线（子代理审计 + 自审双线）

13. **agentHttp 订阅泄漏修复**（done/error 后退订、invoke 先失败也清理）+ **web 流 AbortController 可取消**；
14. 死代码清理：emitLocal 本地监听机制、winDrag/pickFiles/readText/download（0 调用）、`cli&&isFollowUp` 死分支等（70_bridge -38 行）；
15. `findRun(id)` 合并 5 处线性查找（顺带修 copyPack/openWs 的 thisArg 隐患）；renderClients tip HTML 转义；
16. **renderGrid rAF 合帧**：16ms 内多次失效只重建一次；**命名分支合并**（cellDisplayName，构建期覆写不动基座）；
17. **测试统一入口** `node test/run_all.js`：v2 回归 83 + 金卡推演 24 + 通用框架 32 + v3beta 86 + 渲染冒烟 24 = **249 断言一键回归**。

### E. 过程教训（记录给后来者）

- **字符串/结构断言不能代替真实渲染**：帮助页裸露、主题弹窗误关两个 bug 都是 Playwright 无头渲染冒烟才拦住的；
- **shell heredoc 会塌缩反斜杠**：Rust `'\\'` 字面量几经损坏（E0762/E0599），改用 Write 工具写脚本 + chr(92) 构造才稳定；
- **tauri-build 资源缓存**：仅换 icons/ 不触发重编译（v3.1.0 图标教训），版本号/配置变更才强制重编；
- **基座只读共享 + 构建期覆写**是双工程并行不漂移的关键，任何 v2 修复自动流入 v3/v3beta。

## v0.4.1 增补（2026-09-06）：Agent HTTP 端点容错（/chat/completions 自动补全）

18. **故障案例**：HTTP 客户端端点只填了 OpenAI 网关**基础地址**（如 `https://opencode.ai/zen/go/v1`），
    工具按完整 POST 地址直连 → 命中网站页面路由返回 HTML 404 页（报错正文是一整段 `<!DOCTYPE html>`）。
19. **三层容错（同逻辑幂等）**：① `60_agent.js` 新增纯函数 `v3AgentNormalizeChatEndpoint(url, fmt)`，
    发送前归一化并在对话流提示「端点自动补全」；② `70_bridge.js agentHttp` 统一入口兜底
    （Tauri invoke 与 web fetch 两条路径都过）；③ Rust `agent.rs agent_http` 侧最终归一（防旧前端配新后端）。
    规则：openai 协议且不含 `chat/completions`、非 `/messages` 端点 → 去尾斜杠后补 `/chat/completions`；
    完整端点仅尾斜杠归一；anthropic 协议/`/messages` 端点/非 http(s) 串原样保留。
20. **测试**：JS 断言 8 条（test_v3.js，78→86）+ Rust 单测 `openai_endpoint_tolerance`（cargo test --lib）。

## v0.4.2 增补（2026-09-06）：推理模型思考流 / 对话删除 / 运行日志

21. **故障案例**：HTTP 客户端选 `omen-alpha` 等推理模型后「发消息几分钟无回复」——实测该类模型
    先流式输出整段 `delta.reasoning_content`（思考过程）再出正文，而 SSE 解析只认 `delta.content`，
    思考阶段界面空白形似卡死（curl 直连复现：正文前有几十秒 reasoning 流）。
22. **思考流可见**：SSE 解析三层（Rust agent.rs / 70_bridge.js web fetch / anthropic thinking 块）
    新增 `reason` 事件（openai 读 `reasoning_content`/`reasoning`，anthropic 读 `delta.thinking`）；
    前端思考期灰显「🤔 思考中… Ns + 思考尾部」，正文一旦开始即让位；等待期显示已等待秒数；
    结束时若无正文只有思考过程，则以思考过程作为输出兜底展示。
23. **对话管理**：任务列表每条悬浮出现 ✕ 删除（运行中的先取消）；侧栏「任务」标题栏加「清空」
    （confirm 后清空全部）；删除当前查看的会话自动回到新任务视图。
24. **运行日志**：新增 Rust 命令 `agent_log`，每次任务 START（客户端/端点/模型/技能/上下文长度，
    含端点自动补全后的最终 endpoint）/ END（状态/耗时/输出与思考长度/错误摘要）逐行追加到
    `%APPDATA%/com.mpz.wujinbz.v3*/agent_run.log`；浏览器模式降级 console。
25. **LinguaGacha 式模型参数（v0.117.3 对齐）**：HTTP 客户端设置新增「思考强度」（openai 协议传
    `reasoning_effort`：low/medium/high/max）与「额外参数 JSON」（逐键合并进请求体，如 `{"top_p":0.95}`），
    Rust `agent_http` 与 web fetch 双路径同步支持，START 日志记录 effort。
    **实测**：omen-alpha 属"强制思考"模型（禁用报错 1210，只接受 low/high/max），简单测试不加参数
    思考波动 6s→171s+，`reasoning_effort:"low"` 后稳定 4~8s；deepseek-v4-flash 约 2s。
26. **对话页重构（观感/真实性修复）**：① 思考气泡显示「思考字数」真实进度（不只秒数），计时器拆出
    「空闲 Ns」——数据停了看得见；**空闲 ≥180s 无任何新数据自动停止**（防网关假死后计时器空转成
    "伪计时"）；思考超 45s 提示调低思考强度。② 用户气泡里的整段上下文 JSON 改为 `<details>` 折叠块
    （显示段数，展开只读、转义、限长 60k），请求体与「复制任务包」仍带完整上下文。
    ③ 输入区「附带上下文」勾选行默认收起（▸ 点击展开，勾选状态保留）。
27. **输出丢失修复（关键 bug）**：原实现任务完成时 `done()` 直接 `typing.remove()`——流式输出的
    回复在结束瞬间从对话页消失。改为有正文定格完整渲染、无内容才移除；done 幂等守卫（终态后忽略
    迟到的 done/error，修复 web 模式手动停止被 AbortError 的 done 覆盖成 ok）；stop/删除/清空统一
    清理计时器并补 END 日志（手动停止此前不留痕）。
28. **OpenCode Zen 存档迁移**：加载时对 opencode.ai 端点且未设置过思考强度的客户端自动补
    `effort:'low'`（网关推理模型强制思考、时长波动 6s~470s+，实测 low 后 4~8s）——免手动配置。
    参照 LinguaGacha 的 thinking.level + extra_body 设计：各家私有开关（GLM `{"thinking":{"type":"disabled"}}`、
    Qwen `{"enable_thinking":false}` 等）走「额外参数 JSON」，不做硬编码映射。
29. **续聊修复（上下文不再丢）**：原设计只有 `status==='ok'` 的 HTTP 任务能续聊——网关假死/手动停止
    的任务（err）一输入就静默新建任务，多轮上下文全丢。现在 **err 任务同样可续聊**（messages 历史保留，
    异常终止时把已流出的部分回复也存入历史）；空闲看门狗 180s→**90s**（实测网关假死形态：吐 3 个思考字
    后长时间挂起）；手动停止/看门狗的提示明确「直接输入可继续本对话」；续聊的用户消息上屏
    （原实现续聊发出后界面上看不到自己说的话）。
30. **思考流掐断修复（关键 bug，v3beta）**：事件退订条件写成 `kind !== 'chunk'`——第一个 `reason`
    事件（思考流第一个块）到达就触发退订，思考流与正文从此再也收不到。实测现象完全吻合：三轮请求
    均停在首个思考块（"The"/3 字/4 字）后空闲假死。改为仅 done/error 终态退订；并把事件监听注册
    提前到 invoke 之前（响应快于监听就绪会丢最早事件）。

31. **非流式响应兜底**：实测本地代理（127.0.0.1:8045 gemini 反代）忽略 `stream:true`，最后一次性回
    自定义 JSON（`{"thinking":…,"content":…,"usage":…}`），SSE 解析器一个 `data:` 行都收不到，界面干等
    到看门狗介入（响应其实 30s 就到了）。现按 `content-type` 判别：非 `text/event-stream` 时整段 JSON
    解析，兼容 OpenAI 标准（choices[0].message.content / reasoning_content）与自定义 thinking/content/
    response 结构，一次性发 reason/chunk/done；Rust 与浏览器路径同步。另：400
    "User location is not supported" 为代理上游 Gemini 的地区限制，工具如实透传，非工具问题。
32. **📥 应用到布阵（Agent 改动一键回写画布）**：任务头部新增按钮，按优先级取候选源：
    ① CLI 工作目录的 `阵型.json` / `pipeline_片段.json`（bridge 补回 readText，失败返回 null 不打断）；
    ② 回复中的 ```json 代码块（按序提取）。逐个按形状路由到既有导入：v2 阵型 JSON→`v2ImportJSON`
    （画布/顺序/路由/Boss 全量）、官方通用框架选项集→`v2ImportFrameJSON`、pipeline 片段（裸节点表或
    ctx 包 `{pipeline,…}`）→`v2ImportAnalyze+Apply`；全程写撤销栈（Ctrl+Z 可回退），尝试过程记入
    agent_run.log。另：对话流 CSS 强制 `user-select:text`，输出可正常选中复制。
33. **碎片化输出应用修复（真实失败案例）**：agent 回复的"JSON"实为三类不可直接解析的碎片——
    节点片段缺外层 `{}`（`"fx_钢地刺": {…},`）、链中截断片段（`"DirectHit", "next": […] },`，不可恢复）、
    末块围栏未闭合导致 deck2 顺序数组没被提取。修复：① `v3AgentLooseParse` 宽松解析（补外壳/去尾逗号，
    不可恢复片段明确拒绝）；② 围栏正则 `(?:```|\s*$)` 支持未闭合末块；③ 应用逻辑重构为**分类合并**：
    完整文档（v2/框架/全链 pipeline/ctx 包）作基础，节点片段并入基础 pipeline 后解析，顺序数组/对象
    按 `_d2` 波次名自动识别 deck 并整体替换（无基础文档时先压撤销栈）；每候选的分类结果记入
    agent_run.log；只有片段缺全链时提示让 Agent 写回 工作目录/阵型.json。
34. **无围栏输出扫描（r12 案例收尾）**：实测 agent 输出会整段丢 ``` 围栏（只剩裸 `json` 行），
    基于围栏的提取抓不到 `"deck2": […]`，应用仍失败。新增 `v3AgentScanJSON` 字符串感知扫描器：
    全文配平提取 `{…}/[…]`，并把紧邻的 `"key":` 一并带上（节点名/字段名不丢）；扫描结果与围栏块
    去重后并入候选。至此"deck2 顺序替换 + 节点片段"类回复无论有无围栏均可应用。
35. **续聊第二轮必卡修复 + 上下文自动压缩**：① 续聊轮次未重置 `run.status`（停留 'ok'），done 幂等守卫
    把结束事件（含 90s 看门狗）全部吞掉——请求在 90s 被杀但 UI 永久 busy（实测 "•••1299s" 卡死）。
    续聊现在重置 status/ts/ms/思考提示位；② 异常终止回存改为**本轮输出起点标记**（`_turnOutStart`），
    只回存本轮新增内容，不再把"用户（续）"标记误当助手回复；③ **上下文容量检测与自动压缩**
    （`v3AgentCompressMessages`）：请求前统计字符数，>80k 先截断首条上下文段（30k→12k，用户要求保留），
    再丢最旧轮次（保最新用户消息），最后合并同角色相邻消息（anthropic 交替要求）；处理说明上屏入日志，
    START 日志新增 `ctx_len`；④ 看门狗空闲阈值自适应（上下文 >30k 字 90s→180s，防大 prompt 首字慢被误杀）。
36. **应用取向修正（多轮对话）**：`应用到布阵` 扫描的是整段累积对话输出，原先完整文档取**第一个**
    （最早轮次的旧状态）——多轮后点应用会套用陈旧阵型，导出页看起来"没区别"。改为**倒序取最后一次
    出现的完整文档**（最新回复优先，提示语标"取最新完整文档"）；顺序覆盖仍按时间序应用（后写者胜）；
37. **「下载 .json」弹「打开」对话框修复**：Rust `pick_save` 用了 `blocking_pick_file()`（打开文件对话框），
    实测弹出的对话框确认按钮是「打开(O)」、无另存语义（GUI 实测复现）。改为 `blocking_save_file()`
    （另存为对话框，标题"保存 xxx"、按钮"保存(S)"），GUI 复测通过。涉及 导出面板下载/通用框架 JSON/txt 导出
    等全部走 `v2Download` 原生另存为包装的入口。
38. **服务面板 MPZ 根路径连环坑修复**：① 默认根写成 JS 字面量 `'E:pp\MaaPVZ-win-x86_64'`——``/`\M`
    无效转义求值后反斜杠消失，报"MPZ 根不存在：E:appMaaPVZ-win-x86_64"（默认值自己就是坏的）；
    ② placeholder 里混入 0x07 响铃字符（同源转义事故，肉眼不可见）；③ 历史存档的坏路径无法自动恢复。
    修复：默认根/placeholder 改正斜杠 `E:/app/MaaPVZ-win-x86_64`；新增 `v2SrvCleanPath` 清洗（控制字符/引号/
    斜杠归一）应用于读取与提交；原生扫描失败自动回退默认根重试一次并自愈存档；新增「📁 浏览…」按钮
    （Rust `pick_dir` = blocking_pick_folder + bridge `pickDir`），原生目录选择器彻底告别手打路径。

39. **重复种植唯一命名（同名节点覆盖丢步）+ O9 头部去重 + 任务名自定义**：`v2BuildPipeline` 用步骤 `name`
    当节点名，同种植物多次种植（大哥×5/洋芋×5…）与双铲（铲_6-3/铲掉_6-3）会互相覆盖节点——同名只留最后一格、
    中间步全丢、尾部点波改写 next 后守卫菇五连整段悬空（2026-09-06 通用简单无尽首次踩穿：35+19 步只出 65 节点，
    融合前期 6 步/蓓蕾×4/瓷砖×4 全消失、火豌成孤儿）。修复：链内新增 `mkName` 唯一命名——首例保留原名
    （alt/外部引用兼容），重名优先追加格子后缀（如 `fx_大哥5_2`），仍冲突则 `_2/_3` 递增；铲/喂步优先用自带
    name（`-`→`_`），无名回落旧命名；导入端本就剥尾部「数字_数字」解析植物名、铲/喂按锚点识别，往返安全。
    22_gold_sim 的 O9 并入补丁原来按 deck 各拼一遍金卡推演（导出头 10 条含重复），改为仅 deck1 拼接（8 条）。
    任务名不再写死「世界无尽(v2生成)」：导出面板新增「任务名」输入（localStorage 持久化，留空回落默认），
    写入 interface.json task[0].name。测试 +9（重复种植不覆盖/守卫菇五连成链/task 名），v2 92、金卡 30、
    v3beta 106、v3 105 全过；通用简单无尽用同路径重出 98 节点，链 walk 35+19 步全数在链（tools 同源校验）。

40. **基本型逻辑补漏（检 roi 逐槽 / boss 同名碰撞 / O10 跨 deck 卡槽 / 缺格子）**：① 检步金卡检条 roi 原写死
    [115,250,7,45]（卡槽3 专属）——检在其他卡槽会检测错位置；种子栏为竖排同列，x 恒 115，y 改按官方槽位探针
    （resource/pipeline/General_action/Plant_planting_Initialize_slot_General_Swipe.json，y=[114,196,267,338,399,482,
    539,613]）−17 推算：卡槽3 与全部部署脚本实测值逐位吻合，其余槽位首次部署建议实测（O10b info 提示）。
    ② boss 链同名节点 `+'_2'` 只挡一次——同格三喂/双点加速第 3 个起仍互相覆盖，改 N2 递增（stack/feed/accel/flower 全走）。
    ③ 新增 O10 跨 deck 卡槽归属校验（slotLo/slotHi 原为死变量）：进关后种子栏只有当前配队的 8 卡（官方锚点仅
    1~8 物理槽），deck1 步引用卡槽9-16 / deck2 步引用卡槽1-8 = 物理位置摸到本 deck 的卡、静默种错（通用简单
    无尽 deck1 火豌@卡槽14 实例：实际摸到卡槽6 暗物质，火豌融合必断）；本 deck 有同名卡→info 建议改槽，
    无→error 给挪 deck 修法；B7 对 boss 叠种同规则。④ O1b 种植/铲/喂步缺格子坐标报 error。
    测试 +7（3c 段），v2 99、金卡 30、v3beta 106、v3 105 全过。

41. **配队卡槽带图**：卡槽行新增与棋盘同源的植物头像（`PLANT_ICON`，无图植物回落首字徽章），
    输入/拖放/点击选卡/右键清空即时刷新头像；「配队2（卡槽1~8）」标签订正为「卡槽9~16」，
    副卡槽开关文案统一为「配队2」。另：本日配套交付《通用简单无尽》任务包
    （布阵工具 v2 生成的 ty_ 双卡组脚本 + MPZ 部署/还原/verify 一体化），
    详见 E:/app/backup_mpz_scripts/通用简单无尽/files_ty_v1/README.md 。

42. **帮助手册重构（重点分层 + 导入导出全流程）**：`help_user.html` 整篇重排——新增「📥📤 导入导出全流程」
    重点章（5.1 三种文件格式辨识表：v2 阵型 JSON / 存档槽位整包 / pipeline 片段，混用即失败的入口对照；
    5.2 四种导入途径逐步；5.3 画布→能跑的 MPZ 脚本七步照抄清单：配齐五件套→存 v2 源底稿→前缀/任务名→
    生成三段式片段→拆开部署→重启切「自制无尽」资源→首跑清单；5.4 部署两条路：files_ty_v1 一键模板 /
    interface.json 手动三处拆装；5.5 六条常见坑警示框；5.6 旧文本导入归为附录）；全页加重点样式：
    `.imp` 重要框 / `.warn` 警示框 / `ol.steps` 圆号步骤 / `.path` 路径字 / `.btnref` 按钮牌 /
    h2 右侧章节标签，目录（h2/h3）自动联动。快速上手改为三步出阵并链接全流程章。

43. **一键部署到 MPZ（内置 deploy_ty_v1 能力）+ 片段分界标记**：①「生成 pipeline 片段」产物改为
    显式分段——头注释加「文件结构」说明行，②pipeline 节点 JSON 与 ③task 片段之间以「↓↓②」「↓↓③」注释标记
    分界（测试断言 ② 段单独可解析），解决"看不出 ②③ 在哪里分开"的问题。②导入导出面板新增
    「🚀 部署到 MPZ」（v3 桌面版）：实时生成 → 体检 error 门（未清零拦下列清单）→ 写
    resource_self/pipeline/Endless/YS_前缀.json + resource_self/task/前缀_wj.json → interface.json
    幂等注册（resource[自制无尽] / import[片段] / task[本入口，重跑不重复]）→ agent/main.py 的
    fx_counter import 检查修补 + fx_counter.py 在位检查；被覆盖文件先备份 *.bak.时间戳；逐步报告写入导出框。
    纯函数 v2DeployParts / v2DeployInterface 走单测（3d 段 +8），v2 107、金卡 30、v3beta 106、v3 105 全过；
    MPZ 根沿用「🌐 服务」面板设置。帮助手册 5.3/5.4 同步改写：删除工具目录外路径引用，只讲内置按钮，
    手动拆装保留为原理说明；回滚 = 同目录 *.bak.时间戳 改回文件名。

44. **一键部署跨机加固（审查：换电脑使用）**：① 校验前置——先读并试解析 interface.json，失败则一个文件
    都不写并给「去服务面板核对/📁浏览重设根目录」指引（旧版先写 pipeline 会留半成品）；根目录优先取
    服务面板已验证的 V2_SRV.mpz。② fx_counter.py 内置进工具（49_agent_counter.js，源自
    童话世界/files_v0.4.2 权威副本，10.5KB）——目标机缺失时由内置源码直接写入 agent/，不再依赖备份区外部文件。
    ③ agent/main.py 补 import 多级锚点：import actions → 首个顶层 import 区尾 → if __name__/def main/
    AgentServer 前；main.py 缺失只告警不崩。④ interface.json 兼容 JSONC（v2ParseAnyJson），写回严格 JSON。
    部署块拆为独立 48b_deploy.js（48_server 剥离内嵌版），v2 114、金卡 30、v3beta 106、v3 105 全过
    （新增锚点幂等/兜底/JSONC/内置源码 7 断言）；帮助 5.3 同步补自愈与校验前置说明。

## v0.4.5 增补（2026-09-09）：弃用 opencode 伪装，改为按实测报文「伪装 ZCode 客户端」

51. **改判**：用本地明文转发器（`logproxy.py`）实测抓到 ZCode→网关的真实请求头，发现 ZCode 靠
    `user-agent: ZCode/3.11.2 ai-sdk/provider-utils/4.0.39 runtime/node.js/24` + 稳定 `x-session-id`（UUID）
    绑定对话；OpenCode Go 文档亦称"能识别 ZCode 原生会话请求头"。于是**弃用** v0.4.4 的 `opencode/1.0.0` 伪装，
    改为**伪装 ZCode**：`zcodeGo` 开关（老 `opencodeGo` 自动迁移），会话 ID 用 UUID（`v3AgentUuid`），
    桌面版 Rust `zcode_headers` 下发整套 `x-session-id` + `x-zcode-*` + `http-referer` + ZCode UA，
    web 侧 `v3AgentZcodeHeaders` 过滤掉 UA（浏览器禁用）只发 `x-*`。UA 框仍留（可覆盖）。端点含 `opencode`/`z.ai` 自动开启。
    版本 4.0.4→4.0.5。

## v0.4.4 增补（2026-09-09）：Agent 接 OpenCode Go 会话头（x-opencode-session）

49. **OpenCode Go 特化选项**：OpenCode Go 是中转商，同一会话不同请求被路由到不同供应商会清空提示词缓存，
    官方要求为每段对话发送稳定的 `x-opencode-session` 会话头（09/06 起缺该头可能被拒）。新增 HTTP 客户端开关
    「发送会话头」：勾选后每新建任务生成稳定会话 ID（`v3AgentNewSessionId`，随 run 持久化、续聊复用、新任务另起），
    每次请求带 `x-opencode-session` + `x-opencode-client: cli`；桌面版 Rust `agent_http` 另带专属
    `User-Agent: mpz-wujin-bz/<package_info 版本>`（浏览器 fetch 禁用 UA，故 UA 仅桌面版）。端点含 `opencode`
    的旧配置在 `load()` 迁移时自动开启（与既有 effort=low 迁移并列）。双路径（Rust invoke / web fetch）同步；
    纯函数 `v3AgentOpencodeHeaders` + Rust `opencode_session_headers_shape` 单测 + 迁移/发送断言覆盖。版本 4.0.2→4.0.3。

50. **OpenCode Go 客户端身份可伪装（v0.4.4）**：初版桌面 UA 用自报的 `mpz-wujin-bz/<版本>`，属「不知名客户端」，
    易被 OpenCode Go 滥用监控挑出。改为 HTTP 客户端新增可编辑「User-Agent」框：OpenCode Go 模式留空时默认伪装成
    已验证客户端 `opencode/1.0.0`，也可改成任意自身/别的客户端标识；非 opencode 客户端填了 UA 也照发。`agent_http`
    加 `user_agent` 参数、`opencode_headers(sid, client_id, user_agent)` 组装，UA 仅桌面版生效（浏览器 fetch 禁用）。版本 4.0.3→4.0.4。

## v0.4.3 增补（2026-09-08）：v4 独立包审查修复（浏览器 CLI 卡死 / 悬挂注释 / 版本与品牌统一）

45. **浏览器模式 CLI 客户端发送后界面卡死（P1，仅 HTML 交付物触发）**：`60_agent.js send()` 的 web/CLI 分支
    先 `run.status='manual'` 再调 `done('manual',…)`，而 `done()` 幂等守卫 `if(run.status!=='run') return`
    把这次调用整个吞掉——`busy` 不清零、等待计时器 `tick` 空转、typing 气泡残留，且 `stop()` 因同样判 `status==='run'`
    也点不动；默认客户端 `zcode` 即 CLI 型，双击 `无尽布阵工具.html` 进 Agent 发一条就踩死（exe 走 tauri 分支不受影响）。
    修复：不再提前改状态，交 `done('manual')` 统一置态并做完整清理；test_v3.js 补 `busy===false` 回归断言。
46. **悬挂注释隐患清理**：`48_server.js` 拆分 48b 部署块后末尾残留一行未闭合 `/* …`（仅因 build.py 拼接时
    被下一文件头注释的 `*/` 意外闭合才不崩），单跑 `node --check 48_server.js` 直接 `SyntaxError`。改为自包含闭合注释。
47. **版本 / 品牌统一到 v4**：`Cargo.toml` 4.0.0 与 `tauri.conf.json` 4.0.1 不一致 → 统一升到 **4.0.2**
    （exe 文件属性版本、关于页、安装包名三者一致）；修用户可见「v3」泄漏——标题栏徽章 `v3tb-ver`、HTML `<title>`、
    桌面通知标题、帮助手册 8 处「v3 桌面版」措辞统一为 v4（内部标识符 `V3Bridge`/`v3Agent*`/数据目录 `com.mpz.wujinbz.v3beta` 刻意保留不动）。
48. **打包自动化**：`tools/build_app.py` 现在一条命令把三交付物（`无尽布阵工具.html` / 便携 exe / NSIS 安装包）
    自动改名归位到 v4 包根，覆盖前打 `*.bak.时间戳`，目标被占用只告警不中断；`--fast` 仅刷新包根网页。

## v0.3 增补（2026-09-05 夜）：本机 CLI 摸底 + agy 接入 + ZCode 内核/反代 + 大哥图标

> 需求：添加 Antigravity CLI、继续搜寻本机 agent CLI、删除 Ollama、图标换「大哥」、并找到 zcode 客户端的反代/接入方法。

1. **本机 CLI 摸底结果**（扫描 PATH / npm 全局 / `AppData/Local/Programs` / npm registry）：
   - `claude`（npm @anthropic-ai/claude-code 2.1.195）✅ 已接入
   - **`agy` = Google Antigravity CLI v1.1.21**（`%LOCALAPPDATA%/agy/bin/agy.exe`，`-p/--print`、`--output-format`、`--continue`、`--effort`）→ 新增默认客户端 ✅
   - **ZCode 桌面端（智谱）自带 Node 内核** `%LOCALAPPDATA%/Programs/ZCode/resources/glm/zcode.cjs`（12.6MB，claude-code 式 CLI：`-p/--print/--output-format/--resume/--continue` 全支持）→ zcode 客户端探测到内核后自动以 `node zcode.cjs -p` 启动 ✅
   - Codex++（GUI 壳，未带 codex CLI）、CC Switch、DSH Desktop 在装但无 print-mode CLI；`codex` CLI 未装（保留预设位）
2. **ZCode 反代/接入方法（双通道）**：
   - 通道一 CLI：上文的 `node zcode.cjs -p`（stdin 喂任务包，profile.probe 自动探测内核路径，`which_client` 现在支持直接路径探测）
   - 通道二 HTTP 反代：ZCode 桌面端内置 **model-providers 目录**（`models_catalog_china_llm_zcode_*.json`，智谱维护的中国 LLM 接入表）——
     build.py 自动转换成 `ui/agent_model/zcode_catalog.json`（10 providers → 15 条预设：Kimi/MiniMax/DeepSeek-V4/通义 Qwen3.5/小米 MiMo/智谱 GLM-5.3，
     每家提供 **anthropic 端点**（`<base>/anthropic/v1/messages`）与 OpenAI 兼容端点两种），设置页「从预设添加…」分两组展示，一键填充。
3. **Ollama 移除**：默认客户端、内置预设全部删除；存量 localStorage 迁移时自动剔除（active 回退到首个有效客户端）。
   默认客户端现为：zcode（内核探测）/ agy / claude / codex / DeepSeek API。迁移同时把默认客户端的新字段（probe/note）并入同名老配置，
   老配置的 `args` 若仍等于旧默认 `['-p']` 则升级为新默认。
4. **CLI 参数风格实测修正（v0.3.2）**：`zcode 0.16.5` 与 `agy` 的 `-p` 都是「prompt 附参」风格（`-p` 的值就是 prompt，不读 stdin，
   `-p --output-format xx` 会报 ambiguous）——这两个客户端改为固定短指令「读 任务包.md」（上下文已随任务写入工作目录，不受 32K 命令行限制），
   存量迁移自动升级旧参数。`claude` 保持 stdin 喂长 prompt。
5. **确认各 CLI 实际接入的模型（实测方法）**：
   - `claude -p --output-format json "..."` → 返回 JSON 的 **`modelUsage` 字段**（实测本机经 CC Switch 路由到 deepseek-v4-flash——
     配置的"claude"≠实际模型，以这个字段为准）；TUI 内 `/model` 查看/切换。
   - `agy models` 列可用模型（Gemini 系），`--model` 指定；`--output-format json` 的返回不回显模型名。
   - zcode：桌面端 TUI 内 `/model`；headless `-p` 需 `~/.zcode/cli/config.json` 显式配置 model provider
     （缺省报 `Model config is missing`；桌面端自身会话不受影响）；`--json` 为机器可读输出。
   - HTTP 客户端：请求的 `model` 字段即所配模型（端点返回 JSON 也会回显 model）。
6. **图标换「大哥」**：`tools/gen_icons.py` 图标源优先级改为 `--src 指定 > v2 图鉴头像 超级机枪射手.jpg（大哥）> v2 logo.ico`；
   120px 头像 LANCZOS 4× 放大后产出 32/128/256/512 png + 多尺寸 ico，exe/NSIS 已重打。
5. **测试 75/75**（新增 agy/无 ollama/zcode 探测路径/目录预设断言 + 存量迁移剔除 ollama 断言）；Rust 0 警告；
   真机 exe 核验：标题栏图标=大哥头像、设置页 claude/agy 绿点（PATH 探测）、双组预设下拉（内置 9 + ZCode 目录 15）。

> 已知取舍：exe 内嵌 ui 以 cargo 编译时刻的 ui/ 为准——改前端后需重跑 `npx tauri build`（或 `python tools/build_app.py`）才会进 exe；
> 仅改前端想快速预览用 `python webui.py`。
>
> **图标缓存坑（v0.3.1 修复）**：`tauri-build` 的资源编译有缓存——只换 `icons/` 不动 `tauri.conf.json` 时，build 脚本不会重跑，
> exe 里会一直嵌旧图标（v0.3 的图标替换实际没进 exe，PE 提取比对实锤）。v0.3.1 起：① 版本升到 3.1.0（conf 变更强制资源重编译，
> 新安装包文件名 `无尽布阵工具v3_3.1.0_x64-setup.exe` 与旧 3.0.0 包可区分）；② NSIS 配置补 `installerIcon/uninstallerIcon`
> （此前安装器本身一直是 NSIS 默认蓝箭头图标）。`tools/pe_icon.py` 可对任意 exe 权威提取内嵌图标做验证。
> 安装 3.1.0 后若任务栏/快捷方式仍显示旧图，是 Windows 图标缓存：`ie4uinit.exe -show` 或重启资源管理器即可。

## v0.3.3 增补：ZCode Weekend Build glm-5.3f 免费额度接入（zcode2api 路线）

**推荐路线：本地反代 zcode2api（liu5269/zcode2api，master 分支）**——它把 ZCode Coding Plan 额度
（含 Weekend Build 活动额度）转成本地 **Anthropic Messages API**，V3 的 HTTP 客户端原生支持该协议：

1. 部署 zcode2api（二选一）：
   - `pip install -r requirements.txt && cd captcha_node && npm install && python main.py serve`（默认 127.0.0.1:3000）
   - `docker compose up -d --build`（或 GHCR 镜像 `ghcr.io/yuanhhs/zcode2api:latest`）
2. 拿 Coding Plan JWT（3 段点分）进「账号池」：浏览器登录 zcode.z.ai 后 F12 抓 token；或终端 `zcode login`
   （Z.AI OAuth）后读 CLI 凭据文件里的 token。后台 `http://localhost:3000/admin`（默认密码 `zcode`）可看实时额度/轮询状态。
3. V3 → 设置 ⚙️ → Agent 客户端 → **从预设添加… → 「zcode2api（本机反代·Coding Plan 额度）」**（已内置：
   端点 `http://127.0.0.1:3000/v1/messages`、协议 Anthropic、模型 `glm-5.3f`）→ 网关设置了 API Key 就填上 → 保存即可在
   Agent 工作台烧 Weekend 额度。

**为什么不是直连 headless 内核**：逆向了 zcode.cjs 0.16.5 的模型配置（`config.json` 的 `model` 必须是
`"provider/model"` 字符串引用 + `provider.<id>.options` 注册表），但 headless 还要 Z.AI OAuth 凭据 + 阿里云
无痕验证参数（`X-Aliyun-Captcha-Verify-Param`）——后者正是 zcode2api 内置 jsdom 方案解决的；桌面端凭据也不会
共享给 CLI。因此 Weekend 额度走反代最省事；试验用的 config.json 改动已回滚（备份保留在
`~/.zcode/cli/config.json.v3backup-*`）。

若活动另发了 bigmodel API Key：直接用内置「智谱 GLM」预设改模型为 `glm-5.3f`、协议选 Anthropic
（端点 `https://open.bigmodel.cn/anthropic`）即可，无需 zcode2api。

## v0.2 增补（2026-09-05 晚）：Agent 技能化（参照 LinguaGacha 的 agent 体系）

> 参照 `E:\app\LinguaGacha_v0.117.3_Windows_x64` 的 agent 实现移植了四件套：**技能包 / 系统宪章 / 模型预设 / 多轮会话**。
> 只借鉴其结构与机制，宪章与技能内容全部按 MPZ 领域重写；LinguaGacha 的 workspace_apply 工具循环与人格化设定未引入
> （v3 靠 CLI agent 自带的工具循环 + 工作目录文件获得同等能力）。

1. **技能包（resource/agent_skill/）**：每个技能 = `SKILL.md`（YAML frontmatter：name/description）+ `ui.json`
   （visible/order/label/defaults）。build.py 生成 `ui/agent_skill/manifest.json`，任务下拉动态渲染，技能正文按需 fetch。
   内置 8 个：`charter`（任务宪章：输出契约/视觉组织/证据规则）与 `mpz-redlines`（15 条 MPZ/MaaFramework 硬约束红线）
   为**不可见常驻技能**（始终注入 system，红线可被上下文勾选关闭）；可见 6 个：
   🔍体检 formation-check（P0/P1/P2 工作流）/ 🔢顺序 order-review（O1~O8）/ 🧭路由 route-review（R1~R6）/
   👑Boss boss-review（B1~B6）/ 🎨设计 formation-design（可导入文本交付）/ 💬自由 free-chat。
   **用户自建技能**：照抄目录结构放进 `resource/agent_skill/<新id>/` 再跑 build.py 即出现在任务下拉。
2. **宪章分层与渐进披露**：system = charter → redlines → 所选技能 → @引用附加技能（顺序固定）；
   CLI 型任务把全部技能正文写入工作目录 `skills/<id>/SKILL.md`，prompt 附 `<available_skills>` 名称+描述清单——
   zcode/claude 类 agent 可自行读文件（LinguaGacha 的 read_skill 同款机制）。
3. **@引用**：输入 `@顺序/@阵型/@检查/@红线…` → 自动勾选对应上下文；`@技能名`（如 `@order-review`）→ 附加技能正文；
   解析结果以系统消息回显，@token 从用户文本剥离。
4. **模型预设（resource/agent_model/preset_models.json）**：10 家 provider（DeepSeek/智谱/百炼/Kimi/硅基流动/火山方舟/
   OpenAI/Anthropic/Gemini/Ollama），字段结构参照 LinguaGacha 的 preset_model_*.json（api_format/api_url/model_id/温度）。
   设置页「从预设添加…」一键填充。
5. **HTTP 双协议 + 多轮续聊**：`agent_http` 支持 `openai`（/v1/chat/completions）与 `anthropic`（/v1/messages，
   x-api-key + content_block_delta/message_stop）两种 SSE；messages 数组随轮次增长（run 级延续），
   续聊沿用任务创建时的客户端；CLI 型仍为单轮（提示新建任务）。
6. **服务路由**：webui.py 增补 `/agent_skill/*`、`/agent_model/*` 静态路由（带穿越防护）；Tauri 版由 asset 协议内嵌。
7. 测试更新：**node 62/62**（技能解析/manifest/宪章组装/@引用/多轮 messages 断言 + v2 回归 83/83 + 拼包编译）；
   Rust `agent_http` 双协议单测随包；浏览器核验：技能 8/8 加载、任务下拉 6 项、@引用剥离与系统消息、预设下拉 10 项、
   设置页（协议/温度字段）截图通过，页面零报错；NSIS/exe 重新打包并刷新 dist_shell。

## 快速使用

| 形态 | 方法 |
|---|---|
| **桌面版（推荐）** | 双击 `src-tauri/target/release/wujin-bz-v3.exe`（免安装绿色单文件）；或安装 NSIS 包 `src-tauri/target/release/bundle/nsis/无尽布阵工具v3_*-setup.exe`（currentUser 免管理员） |
| 浏览器版（无 Rust 环境回退） | `python build.py && python webui.py` → http://127.0.0.1:8767/ |
| 开发 | `python build.py` 后 `cargo tauri dev` 或直接改 src/ 重打 |

> 桌面版依赖 WebView2 运行时（Win10/11 一般自带；缺省时 NSIS 包内嵌引导器）。

## 工程结构

```
无尽布阵工具v3/
├── README.md                 ← 本文件
├── build.py                  ← 打包：v2 基座 + v3 chrome → ui/index.html（单文件三用：Tauri/webui/file://）
│                                并拷贝 resource/ → ui/（agent_skill 生成 manifest.json；agent_model 预设）
│                                --snapshot 可把 v2 src 冻结到 src_v2/（独立分发用）
├── webui.py                  ← 可选：浏览器回退服务（127.0.0.1:8767，/api/* 与 v2 同源同安全约束）
├── ui/index.html             ← 构建产物（Tauri frontendDist 直接内嵌进 exe；含 agent_skill/ agent_model/）
├── resource/
│   ├── agent_skill/          ← Agent 技能包（LinguaGacha 式：SKILL.md frontmatter + ui.json；8 个内置，用户可加）
│   └── agent_model/          ← 模型预设（10 家 provider，含 anthropic 协议与温度）
├── src/
│   ├── v3_chrome.html        ← v3 外壳 DOM：标题栏 / 图标导航 / 三视图 / 右工具坞 / 状态栏 / Agent 工作台
│   ├── v3_chrome.css         ← 深色玻璃主题（body.v3 变量层，DeepSeek 蓝 #4d6bfe 点缀）+ 浅色镜像
│   └── js/
│       ├── 60_agent.js       ← Agent 工作台：默认客户端表 / MPZ 规范红线 / 上下文收集 / prompt 构建 /
│       │                        任务模板（体检·顺序·路由·Boss·设计·自由）/ 迷你 MD 渲染 / 会话历史（纯函数可 node 测）
│       ├── 70_bridge.js      ← V3Bridge：Tauri（invoke/事件流）与浏览器（fetch/手动任务包）双形态桥
│       └── 96_v3_boot.js     ← 布局重构：v2 DOM 重排进 v3 外壳、面板停靠化、视图切换、
│                                状态栏接线（自动存档/撤销计数/检查结果）、Ctrl+K/Ctrl+1/2/3、原生另存为
├── src-tauri/                ← Tauri 2 壳（Rust）
│   ├── tauri.conf.json       ← decorations:false 无边框、dragDropEnabled:false（保留 v2 HTML5 拖拽）、withGlobalTauri
│   ├── tauri.macos.conf.json ← macOS 叠加标题栏（红绿灯保留）
│   ├── capabilities/default.json
│   ├── icons/                ← tools/gen_icons.py 从 v2 logo.ico 生成
│   └── src/
│       ├── main.rs / lib.rs  ← 入口 + 装配根（只接线）
│       ├── cmds.rs           ← 薄命令：窗口控制/文件对话框/读写/open_path/which/通知/app_info
│       └── agent.rs          ← Agent 桥：agent_spawn（CLI 子进程 stdin 喂 prompt + 行流事件 + taskkill /T 连树杀）
│                                + agent_http（OpenAI 兼容 SSE 流式，桌面侧无 CORS）
├── test/
│   ├── test_v3.js            ← 67 断言：v2 基座回归（子进程跑 v2 的 83 断言）+ 拼包 vm 编译 + Agent 纯逻辑 + web 冒烟
│   └── （v2 的 test_v2.js / real_data_check.py 留在 v2 工程，v3 构建直接复用其源码）
└── tools/gen_icons.py        ← 图标生成（Pillow）
```

v2 基座模块（00~90 共 15 个 js + 3 css + 2 body html）不复制进 v3，构建时从
`../无尽布阵工具v2/src` 读取；**95_maa.js（v2 的 pywebview 伪标题栏/侧栏皮肤运行时）被 v3 chrome 取代，不再拼入**。

## UI 重构点（相对 v2）

| v2 | v3 |
|---|---|
| pywebview 无边框 + 自绘缩放热区 | **Tauri 2** 无边框 + `data-tauri-drag-region` 原生拖拽/双击最大化；macOS 叠加红绿灯 |
| 左 60px 图标栏（95_maa 代理） | 左导航栏（同代机制零重写：直接调 v2OpenPanel/v2ClosePanels）+ **三个中央视图**（布阵 / Agent / 设置，Ctrl+1/2/3） |
| 右侧浮动抽屉（.v2panel overlay） | **右工具坞停靠化**（#v2Drawer 重排进 #v3dock，Esc 收起，面包屑联动） |
| 无 | **底部状态栏**：自动存档时间 / 撤销重做计数 / 检查结果（✗·⚠ 实时）/ Agent 状态 / 运行形态 |
| 浏览器下载文件 | Tauri 下「另存为」原生对话框（v2Download 补丁） |
| 无 Agent | **Agent 工作台**（见下） |

主题：默认深色（MAA 海军蓝调色板为底 + 玻璃质感），标题栏 ☀/🌙 或 设置→外观 切浅色；与布阵主界面共用同一主题开关。

## Agent 一键接入

工作台结构（对齐 dsh 会话式交互）：左侧 任务历史 + 客户端状态点；中部消息流（Markdown 渲染 + 流式打字）；底部输入区（客户端 + 任务模板 + 上下文勾选 + 发送）。

**客户端**（设置 ⚙️ 可增删改、一键探测 PATH）：
- CLI 型：`zcode`、`claude`（Claude Code）、`codex` 等——prompt 默认走 **stdin**（避开 Windows 命令行长度上限），也支持 `args` 里写 `{prompt}` 占位
- HTTP 型：DeepSeek API、Ollama 本机（`http://127.0.0.1:11434/v1/chat/completions`）、任意 OpenAI 兼容端点——流式 SSE，桌面侧走 Rust 无 CORS

**运行模型（CLI 型，dsh 式「把活交给 agent」）**：每次任务在
`%APPDATA%/com.mpz.wujinbz.v3/agent_ws/任务-<时间戳>/` 写入 **任务包.md + 阵型.json + pipeline_片段.json**（含 task/option），
以该目录为工作目录启动 CLI——agent 能直接读文件，做**针对性**检查而非空谈。

**任务模板**：🔍 AI 体检（P0/P1/P2 分级 + 依据/风险/修改建议）、🔢 顺序审查（O1~O8）、🧭 路由审查（R1~R6）、
👑 Boss 审查（B1~B6）、🎨 个性化设计（输出可导入阵型文本）、💬 自由对话。
**上下文勾选**：阵型 JSON / pipeline 片段 / 种植顺序 / 路由参数 / Boss 链 / 检查报告 / **MPZ 规范红线**
（13 条硬约束内嵌进 system：max_hit、ColorMatch next≥2、timeout:-1、双层编码、卡槽 9~16 别名、720 坐标系、interface 只追加、配队双击、重置到1 直连、喂豆回环、尾数分流等）。

**浏览器模式降级**：CLI 不可自动驱动 → 任务自动转「手动任务包」（复制任务包按钮），HTTP 走 fetch（受 CORS 限制）。

## 构建

```bash
python build.py                 # v2 基座 + v3 chrome → ui/index.html（需同级有无尽布阵工具v2，或 --snapshot 冻结）
node test/test_v3.js            # 自检：v2 回归 83 + v3 67 全绿 + 拼包 vm 编译
python webui.py                 # 浏览器版（127.0.0.1:8767）

# 桌面版（前置：rustup msvc 工具链；VS 2022 Community 自带链接器）
python tools/gen_icons.py       # 一次性：v2 logo → src-tauri/icons/
cd src-tauri && cargo build --release   # → target/release/wujin-bz-v3.exe（13.6MB 单文件，资源已内嵌）
npx --yes @tauri-apps/cli@2 build       # → + bundle/nsis/无尽布阵工具v3_3.0.0_x64-setup.exe
```

macOS：`cargo tauri build` 产 .app/.dmg（tauri.macos.conf.json 已配叠加标题栏；未签名按 dsh 惯例右键打开）。

## 自检记录（2026-09-05 v0.1）

- node 测试 **67/67**（A：v2 回归 ALL PASS 83；B：拼包 vm.Script 编译通过、确认不含 95_maa；C/D：Agent 纯逻辑与 web 冒烟）。
- 浏览器实测（8767 服务）：装配状态全绿（棋盘入视图、抽屉入坞、旧壳移除、状态栏接线），四视图 + 深浅主题截图核验，
  发送流程 E2E（web → manual 任务包），**页面零 JS 报错**。
- Rust：`cargo build --release` 0 warning（首轮 29 个 `__cmd__*` 宏冲突 → 命令层模块化 cmds.rs/agent.rs 解决）；
  真机冒烟：exe 启动 → 原生窗口渲染完整 v3 界面（状态栏显示 Tauri 桌面版）→ taskkill 退出。
- 图标：v2 logo.ico → 32/128/256/512 png + 多尺寸 ico。

## 已知边界（下一版）

- 双击 file:// 打开时浏览器禁止相对 fetch——技能库自动降级为内置精简集（体检/自由对话 + JS 内置红线）；桌面版（asset 内嵌）与 webui 版技能库完整。

- agent 计数 / agent_ws 历史只保 30 条、输出 400KB 截断（防 localStorage 爆仓）。
- CLI Agent 的工具权限未收敛（zcode/claude 默认权限运行）；如需全自动改文件请自行加 `--dangerously-skip-permissions` 类参数（自担风险）。
- HTTP 流式按 OpenAI SSE 形状解析（DeepSeek/Ollama/vLLM 网关兼容）；非 OpenAI 形状的端点需再写适配。
- 单实例 / 自更新 / 托盘常驻未做（dsh 有而 v3 暂无）；可后续接 tauri-plugin-single-instance / updater。
- 触控垫片等 v2 已知边界照旧继承（见 v2 README「已知边界」）。

> 设计参照：dsh_desktop（Tauri 2 架构与界面语言）；v3 未复制其任何代码，全部自实现。

## v0.4.6 增补（2026-09-13）：导出携卡槽简介 / 火龙 v2 补丁转正 / 测试定位修复

> 背景：功夫纯火龙 v2（gf2_）上线后，`regen_gf2.js` 里积累了三处「工具不生成、regen 手工注入」的补丁
> （关内点波、计步_补给 override、补白萝卜循环），且任务简介（interface.json description）靠部署时手抄，
> 阵型一改就忘同步。本轮把这三件收进工具本体，并让导出直接携带现网风格的卡槽简介。

1. **任务简介自动生成 `v2TaskIntro()`（40_export.js）**：按现网五套脚本同款
   「卡槽 配队1[1能量花 … 8××] 配队2[…]｜尾数…；前N关…；Boss…；抛花…；注意…」一段式文案生成，
   配队2 按界面可见 1~8 编号（内部槽位 9~16）。接入三处：③ task `description`（AI/人工部署时原样
   抄进 interface.json）、JSON v2 源 `meta.intro`、pipeline 片段头注释（卡槽表行同步改为 1~8 编号）。
2. **补白萝卜循环参数化（bailuo_from）**：路由面板/JSON 新增 `bailuo_from`（火龙v2=60，留空关闭），
   `v2BuildPipeline` 自动生成 补白1..N+补白等待 agent 孤岛（落格/槽位取自 deck1 白萝卜步）、
   计步参数与「启动时关卡数」override 自动下发；`front30=0` 时也能单独补出 `点波1`。
   模拟器备注/单关详解/时间条标记/R7 目标检查/agent 参数白名单（T5）全链认得该参数。
3. **关内点波选项（wave_mode）**：路由参数 `hold|cycle|burst` → task 生成三档 select（默认=所选档），
   override 只指向实际存在的点波节点（点波5_d2 仅双卡组、点波1 仅 front30/bailuo、前10_点波 仅 front10）；
   留空=不生成，旧行为不变。火龙 v2 的 `无尽阵型_v2_源_纯火龙.json` 已带 `bailuo_from:60, wave_mode:"hold"`，
   regen_gf2.js 的三处注入块降级为幂等兜底（工具已带上时自动跳过，修 override 重复追加键）。
4. **修「启动时关卡数」override 漏 `计步_补给`**（40_export.js）：此前只覆盖 计步/计步_boss_start/重置计数，
   「初始化」=否且首关恰是 Boss 关时 计步_补给 从 1 重起计数、尾数分流错位一关（gf2 实测）。
5. **测试定位修复（test_v3.js / run_all.js）**：v4 布局下 V2ROOT 仍指旧布局 `source/无尽布阵工具v2`
   → 子进程 ENOENT 假失败；改多候选探测（旧布局/v4 布局/快照布局）。
6. **测试**：test_v2.js 新增 14 条（简介三段、补白孤岛形态、计步三 override、关内点波生成与收窄、
   R7/T5 认新参数、wave_mode 留空不生成、meta.intro）；`node test/run_all.js` 五套件全过
   （v2 回归 175 / 金卡 30 / 通用框架 32 / v3 全量 114 / 渲染冒烟 24）。
   火龙侧 `verify_gf2.js` 与 `python gf2_tool.py verify` ALL PASS，regen 产物与现网部署语义逐项一致（无需重部署）。
