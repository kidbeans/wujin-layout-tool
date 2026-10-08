/* v3 逻辑自检（node）：
 *   A. v2 基座回归：子进程跑 ../无尽布阵工具v2/test/test_v2.js（83 断言，v3 构建复用同一批源码）
 *   B. 整包语法：ui/index.html 的 <script> 用 vm.Script 编译（不执行）——证明 v2+v3 拼包可解析
 *   C. v3 纯逻辑：技能包解析（frontmatter/manifest）/ 宪章组装 / @引用 / prompt 构建 / MD 渲染 / 历史存取
 *   D. v3 冒烟：V3Agent + V3Bridge 在 stub DOM 下 init / 发送（web→manual）无异常
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
/* v2 基座定位（多候选，2026-09-13）：v4 布局下 app 的上两级才是 布阵工具/，
   旧布局（app 与 无尽布阵工具v2 同级）路径也保留——找得到 test/test_v2.js 的候选为准 */
const V2ROOT = (function(){
  const cands = [
    path.join(path.dirname(ROOT), '无尽布阵工具v2'),            // 旧布局：source/无尽布阵工具v2
    path.join(ROOT, '..', '..', '..', '无尽布阵工具v2'),        // v4 布局：布阵工具/无尽布阵工具v2
    path.join(path.dirname(path.dirname(path.dirname(ROOT))), '无尽布阵工具v2')  // 快照布局兜底
  ];
  for (let i = 0; i < cands.length; i++)
    if (fs.existsSync(path.join(cands[i], 'test', 'test_v2.js'))) return cands[i];
  return cands[0];
})();
const SRC = path.join(ROOT, 'src', 'js');

let pass = 0, fail = 0;
const fails = [];
function ok(cond, name) {
  if (cond) { pass++; }
  else { fail++; fails.push(name); console.log('  ✗ ' + name); }
}

/* ---------- stub DOM / storage（v2 test 同款思路） ---------- */
function fakeEl() {
  return {
    value: '', checked: false, textContent: '', innerHTML: '', style: {}, dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {}, appendChild() {}, removeChild() {}, remove() {}, removeAttribute() {},
    querySelector() { return null; }, querySelectorAll() { return []; },
    focus() {}, click() {}, scrollHeight: 0, scrollTop: 0, scrollIntoView() {},
    closest() { return null; }, cloneNode() { return fakeEl(); }
  };
}
const __els = {};
global.document = {
  getElementById(id) { if (!__els[id]) __els[id] = fakeEl(); return __els[id]; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
  createElement() { return fakeEl(); },
  addEventListener() {},
  body: { appendChild() {}, removeChild() {}, classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } } }
};
global.localStorage = {
  _m: {},
  getItem(k) { return this._m[k] === undefined ? null : this._m[k]; },
  setItem(k, v) { this._m[k] = String(v); },
  removeItem(k) { delete this._m[k]; }
};
global.window = global;
global.showToast = function () {};
global.copyText = function () {};
global.alert = function () {};
global.location = { href: 'http://127.0.0.1:8767/' };

/* ---------- A. v2 基座回归 ---------- */
console.log('[A] v2 基座回归（test_v2.js + 金卡推演）');
try {
  const out = execFileSync(process.execPath, [path.join(V2ROOT, 'test', 'test_v2.js')], {
    cwd: V2ROOT, encoding: 'utf-8', timeout: 120000
  });
  const m = out.match(/ALL PASS \((\d+)\)/);
  ok(!!m, 'v2 回归通过并输出 ALL PASS');
  if (m) console.log('  v2: ALL PASS (' + m[1] + ')');
} catch (e) {
  ok(false, 'v2 回归失败：' + String(e.stdout || e.message).slice(-400));
}
try {
  const out2 = execFileSync(process.execPath, [path.join(V2ROOT, 'test', 'test_gold_sim.js')], {
    cwd: V2ROOT, encoding: 'utf-8', timeout: 120000
  });
  const m2 = out2.match(/ALL PASS \((\d+)\)/);
  ok(!!m2, '金卡推演（O9）行为测试通过');
  if (m2) console.log('  goldSim: ALL PASS (' + m2[1] + ')');
} catch (e) {
  ok(false, '金卡推演测试失败：' + String(e.stdout || e.message).slice(-400));
}

/* ---------- B. 整包语法 + 资源产物 ---------- */
console.log('[B] ui/index.html 拼包语法 + agent 资源');
const distPath = path.join(ROOT, 'ui', 'index.html');
if (fs.existsSync(distPath)) {
  const html = fs.readFileSync(distPath, 'utf-8');
  const m = html.match(/<script>\n([\s\S]*)\n<\/script>/);
  ok(!!m, 'ui/index.html 含单一 <script> 拼包');
  if (m) {
    try { new vm.Script(m[1], { filename: 'bundle.js' }); ok(true, '拼包 vm.Script 编译通过'); }
    catch (e) { ok(false, '拼包语法错误：' + e.message); }
  }
  ok(html.includes('v3sePreset') && html.includes('v3seFormat'), '拼包含预设/协议设置字段');
} else {
  console.log('  （ui/index.html 不存在，先 python build.py——跳过 B）');
}
const manifestPath = path.join(ROOT, 'ui', 'agent_skill', 'manifest.json');
let manifestSkills = [];
if (fs.existsSync(manifestPath)) {
  const mf = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  manifestSkills = mf.skills || [];
  ok(manifestSkills.length === 8, '技能 manifest 8 个（实得 ' + manifestSkills.length + '）');
  ok(manifestSkills.filter(s => !s.visible).length === 2, '常驻不可见技能 2 个（charter/mpz-redlines）');
  ok(manifestSkills.some(s => s.id === 'formation-check' && s.visible), '体检技能可见');
  const redline = manifestSkills.find(s => s.id === 'mpz-redlines');
  const body = fs.readFileSync(path.join(ROOT, 'resource', 'agent_skill', 'mpz-redlines', 'SKILL.md'), 'utf-8');
  ok(body.includes('max_hit') && body.includes('timeout: -1'), '红线技能正文含关键条目');
  ok(redline && redline.visible === false, 'mpz-redlines 不可见');
  const presets = JSON.parse(fs.readFileSync(path.join(ROOT, 'resource', 'agent_model', 'preset_models.json'), 'utf-8'));
  ok(presets.presets.length >= 9 && presets.presets.some(p => p.api_format === 'anthropic'), '模型预设 ≥9 且含 anthropic 协议');
  ok(!presets.presets.some(p => /ollama/i.test(p.id + p.name)), 'Ollama 已从预设移除');
  const zcPath = path.join(ROOT, 'ui', 'agent_model', 'zcode_catalog.json');
  if (fs.existsSync(zcPath)) {
    const zc = JSON.parse(fs.readFileSync(zcPath, 'utf-8'));
    ok(zc.presets.length >= 8, 'ZCode 目录转换预设 ≥8（实得 ' + zc.presets.length + '）');
    ok(zc.presets.some(p => p.api_format === 'anthropic' && p.api_url.includes('/anthropic/')), 'ZCode 目录含 anthropic 反代端点');
    ok(zc.presets.every(p => (p.api_url || '').startsWith('https://')), 'ZCode 目录端点均为 https');
  } else {
    console.log('  （zcode_catalog.json 不存在——本机无 ZCode 目录，跳过）');
  }
} else {
  console.log('  （agent_skill manifest 不存在——build.py 未带资源，跳过资源断言）');
}

/* ---------- C/D. 载入 v3 模块 ---------- */
const bridgeSrc = fs.readFileSync(path.join(SRC, '70_bridge.js'), 'utf-8');
const agentSrc = fs.readFileSync(path.join(SRC, '60_agent.js'), 'utf-8');
const boot96Src = fs.readFileSync(path.join(SRC, '96_v3_boot.js'), 'utf-8');
vm.runInThisContext(bridgeSrc, { filename: '70_bridge.js' });
vm.runInThisContext(agentSrc, { filename: '60_agent.js' });
try { new vm.Script(boot96Src, { filename: '96_v3_boot.js' }); ok(true, '96_v3_boot.js 语法编译通过'); }
catch (e) { ok(false, '96_v3_boot.js 语法错误：' + e.message); }

console.log('[C] v3 Agent 纯逻辑（技能化）');
ok(typeof global.V3Skills === 'object' && typeof global.V3Agent === 'object' && typeof global.V3Bridge === 'object', '60/70 模块载入并定义 V3Skills/V3Agent/V3Bridge');
ok(global.V3Bridge.detect() === 'web', '无 __TAURI__ 时桥自动判 web 模式');

const defs = v3AgentDefaultClients();
ok(defs.length === 5, '默认客户端 5 个（实得 ' + defs.length + '）');
ok(new Set(defs.map(c => c.id)).size === 5, '默认客户端 id 唯一');
ok(defs.some(c => c.id === 'zcode') && defs.some(c => c.id === 'deepseek'), '预置 zcode 与 DeepSeek API');
ok(defs.some(c => c.id === 'agy' && c.cmd === 'agy'), '预置 Antigravity CLI（agy）');
ok(!defs.some(c => c.id === 'ollama'), 'Ollama 已从默认客户端移除');
const zcDef = defs.find(c => c.id === 'zcode');
ok(Array.isArray(zcDef.probe) && zcDef.probe.some(p => p.endsWith('zcode.cjs')), 'zcode 内核探测路径（glm/zcode.cjs）');
ok(defs.filter(c => c.kind === 'cli' && (c.id === 'zcode' || c.id === 'agy')).every(c => c.useStdin === false && c.args.join(' ').includes('任务包.md')),
  'zcode/agy 走「读 任务包.md」短指令（-p 附参风格，不受 32K 命令行限制）');
ok(defs.filter(c => c.kind === 'cli' && (c.id === 'claude' || c.id === 'codex')).every(c => c.useStdin === true), 'claude/codex 默认走 stdin');

/* 端点容错（OpenAI 兼容基础地址自动补 /chat/completions，案例 opencode.ai 网关 404 页） */
ok(v3AgentNormalizeChatEndpoint('https://opencode.ai/zen/go/v1', 'openai') === 'https://opencode.ai/zen/go/v1/chat/completions', '基础地址自动补 /chat/completions');
ok(v3AgentNormalizeChatEndpoint('https://opencode.ai/zen/go/v1/', 'openai') === 'https://opencode.ai/zen/go/v1/chat/completions', '尾斜杠基础地址补全');
ok(v3AgentNormalizeChatEndpoint('https://api.deepseek.com/v1/chat/completions', 'openai') === 'https://api.deepseek.com/v1/chat/completions', '完整端点原样保留');
ok(v3AgentNormalizeChatEndpoint('https://api.deepseek.com/v1/chat/completions/', 'openai') === 'https://api.deepseek.com/v1/chat/completions', '完整端点尾斜杠归一');
ok(v3AgentNormalizeChatEndpoint('https://api.anthropic.com/v1/messages', 'openai') === 'https://api.anthropic.com/v1/messages', '/messages 端点不误补');
ok(v3AgentNormalizeChatEndpoint('https://api.anthropic.com/v1/messages', 'anthropic') === 'https://api.anthropic.com/v1/messages', 'anthropic 协议端点原样');
ok(v3AgentNormalizeChatEndpoint('', 'openai') === '' && v3AgentNormalizeChatEndpoint(null) === '', '空端点原样返回');

/* ZCode 伪装头（纯逻辑） */
const sid1 = v3AgentUuid(), sid2 = v3AgentUuid();
ok(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(sid1), '会话 ID 为 UUID v4（实得 ' + sid1 + '）');
ok(sid1 !== sid2, '两次生成的会话 ID 不同');
const zh = v3AgentZcodeHeaders(sid1);
ok(zh && zh['x-session-id'] === sid1 && /^ZCode\//.test(zh['user-agent']) && zh['http-referer'] === 'https://zcode.z.ai', 'ZCode 头含 x-session-id + ZCode UA + referer');
ok(v3AgentZcodeHeaders(null) === null && v3AgentZcodeHeaders('') === null, '无会话 ID 时不产头');
ok(typeof V3Bridge.agentLog === 'function' && typeof V3Agent.deleteRun === 'function' && typeof V3Agent.clearRuns === 'function', 'agentLog/deleteRun/clearRuns 就位');

/* 用户消息上下文拆分/折叠（对话页不再整段铺 JSON） */
const spx = v3AgentSplitContext('【用户要求】\n帮我检查\n\n【当前布阵上下文】\n\n### 阵型\n```json\n{}\n```');
ok(spx.req.indexOf('帮我检查') !== -1 && spx.ctx.indexOf('### 阵型') !== -1, 'v3AgentSplitContext 拆分用户要求与上下文');
ok(v3AgentSplitContext('纯文字没有上下文段').ctx === '', '无上下文标记时 ctx 为空');
ok(v3AgentCtxDetails('### 阵型\njson').indexOf('<details') === 0 && v3AgentCtxDetails('### A\nx').includes('（1 段）'), 'v3AgentCtxDetails 输出折叠块并统计段数');
ok(v3AgentCtxDetails('<script>').indexOf('&lt;script&gt;') !== -1, 'v3AgentCtxDetails 转义 HTML');

/* 一键应用回画布：输出 JSON 块提取 */
const aps = V3Agent.applySources({ output: '前置说明\n```json\n{"version":2,"boards":{}}\n```\n尾部\n```json\n{"a":1}\n```' });
ok(aps.length === 2 && aps[0].label.indexOf('1 个 JSON 块') !== -1 && aps[1].label.indexOf('2 个 JSON 块') !== -1, 'applySources 按序提取输出中的 JSON 块');
const apl = V3Agent.applySources({ cwd: 'C:/ws', output: '无 JSON' });
ok(apl.length === 2 && apl[0].label === '工作目录/阵型.json' && apl[1].label === '工作目录/pipeline_片段.json', 'applySources 含工作目录候选（优先于输出）');
const apu = V3Agent.applySources({ output: '```json\n[{"t":"wave","name":"点波_初始_d2"}]' });   /* 末块无闭合围栏 */
ok(apu.length === 1 && apu[0].text instanceof Promise === false || apu.length === 1, '未闭合围栏也能提取末块');
ok(v3AgentLooseParse('"fx_钢地刺": { "action": "Swipe", "next": ["fx_大守卫菇"] },').ok, '节点片段（缺外层 {}）宽松解析成功');
ok(!v3AgentLooseParse('"DirectHit", "next": ["x"] },').ok, '中间截断片段无法恢复（应拒绝）');
const lpFrag = v3AgentLooseParse('"fx_钢地刺": { "action": "Swipe", "next": ["fx_大守卫菇"] },');
ok(v3AgentIsNodeMap(lpFrag.value) && !v3AgentHasJudge(lpFrag.value), '片段判定为节点表但缺全链（frag）');
const ordD2 = [{ t: 'wave', name: '点波_初始_d2' }, { t: 'plant', name: '仙桃', cell: '6-4', slot: 10 }];
ok(v3AgentIsOrderItems(ordD2) && v3AgentDetectDeck(ordD2) === 'deck2', '顺序数组判定 + _d2 识别 deck2');
ok(v3AgentDetectDeck([{ t: 'wave', name: '点波5' }, { t: 'plant', name: '大哥' }]) === 'deck1', '无 _d2 波次名识别为 deck1');
/* 真实失败案例：agent 输出丢围栏，裸 "deck2": [...] 靠扫描还原 */
const scn = v3AgentScanJSON('json\n"deck2": [\n{ "t": "wave", "name": "点波_初始_d2" }\n]\n尾');
ok(scn.length === 1 && v3AgentIsOrderItems(v3AgentLooseParse(scn[0]).value.deck2), '无围栏 "deck2": [...] 扫描还原');
ok(v3AgentScanJSON('文本 "fx_钢地刺": { "action": "Swipe" }, 尾').some(function (s){ const pv = v3AgentLooseParse(s); return pv.ok && v3AgentIsNodeMap(pv.value); }), '无围栏节点键值对扫描');
const r12s = V3Agent.applySources({ output: '## order.deck2（完整替换）\njson\n"deck2": [\n{ "t": "wave", "name": "点波_初始_d2" }\n]\n' });
ok(r12s.length >= 1, '无围栏输出也能产出应用候选块');
/* 上下文容量检测与自动压缩 */
const cm = v3AgentCompressMessages([
  { role: 'user', content: '【用户要求】测试\n\n【当前布阵上下文】\n\n' + 'x'.repeat(30000) },
  { role: 'assistant', content: '回复A'.repeat(20000) },
  { role: 'user', content: '续' },
  { role: 'assistant', content: '回复B' },
  { role: 'user', content: '最新' }
], 5000);
ok(cm.notes.length >= 1 && cm.msgs[cm.msgs.length - 1].content === '最新', '压缩：超限丢最旧轮次且保留最新用户消息');
ok(cm.msgs.every(function (m, i){ return i === 0 || cm.msgs[i - 1].role !== m.role; }), '压缩后同角色相邻消息已合并（anthropic 交替要求）');
const cm2 = v3AgentCompressMessages([{ role: 'user', content: '【用户要求】体检\n\n【当前布阵上下文】\n\n' + 'y'.repeat(30000) }], 20000);
ok(cm2.msgs.length === 1 && cm2.msgs[0].content.length < 20000 && cm2.notes.length === 1, '首轮超限仅截断上下文段（用户要求保留）');
const cm3 = v3AgentCompressMessages([{ role: 'user', content: '小上下文' }], 80000);
ok(cm3.msgs.length === 1 && cm3.notes.length === 0, '未超限原样透传');
ok(V3Bridge.agentHttp.length === 2, 'agentHttp 签名不变（opts, onEvt）');

/* frontmatter 解析 */
const pm = v3AgentParseFrontmatter('---\nname: demo\ndescription: 测试技能\n---\n\n# 正文\n内容');
ok(pm.meta.name === 'demo' && pm.meta.description === '测试技能', 'frontmatter 解析 name/description');
ok(pm.body.startsWith('# 正文'), 'frontmatter 剥离后保留正文');
const pm2 = v3AgentParseFrontmatter('# 无 frontmatter\n正文');
ok(!pm2.meta.name && pm2.body.includes('无 frontmatter'), '无 frontmatter 时原文透传');

/* manifest 归一化 */
const skills = v3AgentSkillsFromManifest({ skills: [
  { id: 'b', name: 'b', description: 'B', visible: true, order: 200 },
  { id: 'a', name: 'a', description: 'A', visible: false, order: 100 },
  { id: 'c', name: 'c', description: 'C', order: null }
] });
ok(skills.length === 3 && skills[0].id === 'a' && skills[2].order === 900, 'manifest 归一化排序 + 缺省 order=900');

/* @引用解析 */
const refSkills = v3AgentSkillsFromManifest({ skills: [
  { id: 'order-review', name: 'order-review', description: '顺序', visible: true, order: 1 }
] });
const rr = v3AgentResolveRefs('请检查 @顺序 @order-review 的问题', { formation: false }, refSkills);
ok(rr.extra === '请检查 的问题', '@token 解析后从 extra 剥离（实得：' + rr.extra + '）');
ok(rr.ctx.order === true, '@顺序 → 上下文 order 勾选');
ok(rr.extraSkills.indexOf('order-review') !== -1, '@order-review → 附加技能');
ok(rr.resolved.length === 2, '引用清单两条');
const rr2 = v3AgentResolveRefs('普通输入没有引用', null, refSkills);
ok(rr2.extra === '普通输入没有引用' && !rr2.resolved.length, '无引用时原文透传');

/* 宪章组装 */
const bodies = {
  charter: '# 任务宪章\n输出契约',
  'mpz-redlines': '# 红线\nmax_hit=0 禁用',
  'formation-check': '# 体检\nP0/P1/P2'
};
const sys1 = v3AgentComposeSystem(bodies, ['formation-check']);
ok(sys1.skillIds[0] === 'charter' && sys1.skillIds[1] === 'mpz-redlines' && sys1.skillIds[2] === 'formation-check',
  '宪章→红线→任务技能 顺序注入');
ok(sys1.system.indexOf('任务宪章') < sys1.system.indexOf('红线') && sys1.system.indexOf('红线') < sys1.system.indexOf('体检'), 'system 拼接顺序正确');
const sys2 = v3AgentComposeSystem(bodies, ['free-chat'], false);
ok(!sys2.system.includes('红线') && sys2.system.includes('任务宪章'), 'includeRedlines=false 去掉红线保留宪章');
const sys3 = v3AgentComposeSystem({}, ['free-chat']);
ok(sys3.system.includes('max_hit'), '无技能正文时回退内置红线');

/* 上下文收集 */
global.V2 = { world: '复兴', prefix: 'wj_' };
global.v2ExportJSON = function () { return { version: 2, meta: { world: '复兴' } }; };
global.exportFull = function () { return '列1 列2\n路1: 大哥+原豌 桑葚(毒藤)'; };
global.v2BuildPipeline = function () { return { nodes: { a: { next: [] } }, prefix: 'wj_' }; };
global.v2BuildTask = function () { return { option: { o: 1 }, task: { t: 1 } }; };
global.v2SerializeAll = function () {
  return { order: { deck1: [{ cell: '1-1' }] }, route: { mode: 'tail' }, boss: { ops: [{ op: 'stack' }] } };
};
__els['chkReport'] = Object.assign(fakeEl(), { value: '== 静态检查 ==\n错误 0 / 警告 2' });

const ctx = v3AgentCollectContext({ formation: true, pipeline: true, order: true, route: true, boss: true, checks: true });
ok(Object.keys(ctx.sections).length >= 6, '全开时上下文 ≥6 段（实得 ' + Object.keys(ctx.sections).length + '）');
ok(ctx.files.some(f => f.name === '阵型.json') && ctx.files.some(f => f.name === 'pipeline_片段.json'), '生成工作区文件');
const ctxOff = v3AgentCollectContext({ formation: false, pipeline: false, order: false, route: false, boss: false, checks: false });
ok(Object.keys(ctxOff.sections).length === 0 && ctxOff.files.length === 0, '全关时上下文为空');

/* prompt 构建（新签名） */
const bodiesWithList = Object.assign({ __skills: manifestSkills.length ? manifestSkills : refSkills }, bodies);
const p1 = v3AgentBuildPrompt('formation-check', bodiesWithList, ctx, '重点看 deck2', ['order-review'], true);
ok(p1.title.indexOf('体检') !== -1 || p1.title.indexOf('AI') !== -1, '任务标题来自技能 label');
ok(p1.skillIds.indexOf('charter') === 0 && p1.skillIds.indexOf('mpz-redlines') === 1, 'skillIds 前置常驻技能');
ok(p1.skillIds.indexOf('order-review') !== -1, '附加技能进入 skillIds');
ok(p1.system.includes('max_hit=0 禁用') && p1.system.includes('P0/P1/P2'), 'system 含红线与所选技能正文');
ok(p1.user.includes('重点看 deck2') && p1.user.includes('【当前布阵上下文】') && p1.user.includes('结论先行'), 'user 带用户要求/上下文/输出要求');
const pNo = v3AgentBuildPrompt('free-chat', bodiesWithList, { sections: {} }, '', [], true);
ok(!pNo.user.includes('【当前布阵上下文】') && pNo.user.includes('按所选技能的默认工作流'), '空上下文与空要求的兜底文案');
const pOff = v3AgentBuildPrompt('free-chat', bodiesWithList, { sections: {} }, '', [], false);
ok(!pOff.system.includes('max_hit') && pOff.system.includes('任务宪章'), '红线可被 spec=false 关闭');

/* MD 渲染 */
const esc = v3AgentEscapeHTML('<b a="1">&\'');
ok(esc === '&lt;b a=&quot;1&quot;&gt;&amp;&#39;', 'HTML 转义完备');
const md = v3AgentRenderMD([
  '# 标题', '', '- 项目 **加粗** 与 `行内代码`', '',
  '| 列A | 列B |', '| --- | --- |', '| 1 | 2 |', '',
  '```json', '{"x":"<script>"}', '```', '', '<img src=x onerror=alert(1)>'
].join('\n'));
ok(md.includes('<h1>标题</h1>'), 'MD 标题');
ok(md.includes('<b>加粗</b>') && md.includes('<code>行内代码</code>'), 'MD 粗体/行内代码');
ok(md.includes('<table>') && md.includes('<th>列A</th>') && md.includes('<td>1</td>'), 'MD 表格');
ok(md.includes('<pre><code>') && md.includes('&lt;script&gt;'), 'MD 代码块转义');
ok(!md.includes('<img') || md.includes('&lt;img'), 'MD 注入文本被转义');
ok(v3AgentRenderMD('```js\nlet a=1;\n``` 尾随文本').includes('尾随文本'), '代码块占位符正确还原');

ok(v3AgentRelTime(Date.now() - 30000) === '刚刚' && v3AgentRelTime(Date.now() - 120000) === '2 分钟前', '相对时间');

/* 历史存取 + 客户端迁移 */
const A = global.V3Agent;
A.st = null;
A.load();
ok(A.st.clients.length === 5 && A.st.active === 'zcode', '默认状态载入（5 客户端）');
ok(A.st.clients.filter(c => c.kind === 'http').every(c => c.apiFormat === 'openai'), 'HTTP 客户端默认 openai 协议');
/* 迁移：存量 ollama 客户端被移除；zcode 旧参数风格升级 */
A.st.clients.push({ id: 'ollama', name: 'Ollama（本机）', kind: 'http', endpoint: 'http://127.0.0.1:11434/v1/chat/completions' });
A.st.clients.find(c => c.id === 'zcode').args = ['-p', '--output-format', 'text'];
A.st.active = 'ollama';
A.save();
A.st = null; A.load();
ok(!A.st.clients.some(c => c.id === 'ollama'), '载入存量状态时自动移除 ollama');
ok(A.st.active !== 'ollama', 'active 从 ollama 迁移到有效客户端');
ok(A.st.clients.find(c => c.id === 'zcode').args.join(' ').includes('任务包.md'), 'zcode 旧参数风格自动升级为读任务包');
/* 迁移：opencode 端点自动开启 ZCode 伪装 + effort low；老字段 opencodeGo 平滑迁到 zcodeGo */
A.st.clients.push({ id: 'oc', name: 'OpenCode Go', kind: 'http', endpoint: 'https://opencode.ai/zen/go/v1/chat/completions', apiFormat: 'openai', opencodeGo: true });
A.save(); A.st = null; A.load();
const occ = A.st.clients.find(c => c.id === 'oc');
ok(occ && occ.zcodeGo === true && occ.effort === 'low' && occ.opencodeGo === undefined, 'opencode 端点自动 zcodeGo=true + effort=low，老 opencodeGo 已清除');
A.st.runs.push({ id: 'r1', ts: Date.now(), title: 'x', status: 'ok', output: 'y'.repeat(250000), prompt: { user: 'z' } });
A.save();
A.st = null; A.load();
ok(A.st.runs.length === 1 && A.st.runs[0].output.length <= 200200, '历史持久化且超长输出截断');
A.st = null; A.load();
ok(A.st.clients.some(c => c.id === 'claude'), '重新载入自动补回缺失的预置客户端');
ok(A.client('zcode').kind === 'cli' && A.client('nope') === null, 'client() 查找');

console.log('[D] v3 浏览器模式冒烟');
A.st = null; A.load();
let threw = null;
try { A.init(); } catch (e) { threw = e; }
ok(threw === null, 'V3Agent.init() 在 stub DOM 下无异常' + (threw ? '：' + threw.message : ''));
ok(__els['v3agClient'].innerHTML.includes('zcode'), '客户端下拉已渲染');
ok(__els['v3setClients'].innerHTML.includes('DeepSeek API'), '设置表格已渲染');

/* 注入技能库 → 任务下拉渲染 + 默认勾选 */
V3Skills.list = manifestSkills.length ? v3AgentSkillsFromManifest({ skills: manifestSkills })
  : v3AgentSkillsFromManifest({ skills: [{ id: 'formation-check', name: 'formation-check', description: '', visible: true, order: 100, label: '🔍 AI 体检', defaults: { context: ['formation', 'pipeline'] } }, { id: 'free-chat', name: 'free-chat', description: '', visible: true, order: 600, label: '💬 自由对话' }] });
Object.assign(V3Skills.bodies, bodies);
document.getElementById('v3agTask').value = (V3Skills.visible()[0] || {}).id || 'formation-check';
threw = null;
try { A.renderTasks(); } catch (e) { threw = e; }
ok(threw === null, 'renderTasks() 无异常' + (threw ? '：' + threw.message : ''));
ok(__els['v3agTask'].innerHTML.includes('formation-check') || manifestSkills.length === 0, '任务下拉来自技能 manifest');
ok(__els['v3cxFormation'].checked === true, '切换任务套用技能默认上下文勾选');

/* web 模式 + CLI 客户端 → send 转手动任务包 */
['v3cxFormation', 'v3cxPipeline', 'v3cxOrder', 'v3cxRoute', 'v3cxBoss', 'v3cxChecks', 'v3cxSpec']
  .forEach(function (id) { document.getElementById(id).checked = true; });
A.st.runs = [];
A.st.active = 'zcode';
document.getElementById('v3agInput').value = '请体检并 @顺序 @order-review 看看 deck2';
document.getElementById('v3agTask').value = V3Skills.visible()[0] ? V3Skills.visible()[0].id : 'formation-check';
A.busy = false;
try { A.send(); } catch (e) { threw = e; }
ok(threw === null && A.st.runs.length === 1 && A.st.runs[0].status === 'manual', 'web 模式 CLI 任务自动转 manual');
ok(A.busy === false, 'manual 任务后 busy 复位（修复浏览器模式 CLI 客户端发送后界面卡死）');
ok(A.st.runs[0].prompt.user.includes('deck2') && !A.st.runs[0].prompt.user.includes('@顺序'), '@引用解析并从用户文本剥离');
ok(A.st.runs[0].prompt.skillIds.indexOf('order-review') !== -1, '@技能引用已附加');
ok(A.st.runs[0].prompt.system.includes('max_hit') || manifestSkills.length === 0, 'manual 任务包含红线依据');

/* HTTP 多轮：模拟一次已完成 run 的续聊（不发网络——直接断言消息结构） */
A.st.runs[0].status = 'ok';
A.st.runs[0].client = 'deepseek';
A.st.runs[0].clientName = 'DeepSeek API';
A.st.runs[0].clientKind = 'http';
A.st.runs[0].apiFormat = 'openai';
A.st.runs[0].messages = [{ role: 'user', content: '第一轮' }];
A.liveId = A.st.runs[0].id;
/* 走 agentHttp web 分支需要 fetch —— 这里只测消息拼装逻辑：切到假 run 后 send 会进入 HTTP 分支，
   fetch 不存在会 reject；用最小 stub 保证 send 可走完 */
global.fetch = function () { return Promise.reject(new Error('no network in test')); };
document.getElementById('v3agInput').value = '那 deck2 的点波呢？';
A.busy = false;
try { A.send(); } catch (e) { threw = e; }
ok(threw === null, 'HTTP 续聊路径无同步异常');
ok(A.st.runs[0].messages.length === 1 && A.st.runs[0].messages[0].content.includes('第一轮') && A.st.runs[0].messages[0].content.includes('那 deck2 的点波呢？'), '续聊消息并入会话历史（同角色合并，保持 anthropic 交替要求）');
ok(A.st.runs[0].turns === 2, '续聊轮次 +1');

/* send：zcodeGo http 客户端 → 新 run 生成稳定 sessionId（UUID）（fetch 已 stub 为 reject，仅验同步置位） */
A.st.active = 'oc';
if (A.client('oc')) A.client('oc').zcodeGo = true;
A.liveId = null;
A.busy = false;
document.getElementById('v3agInput').value = 'zcode 伪装测试';
document.getElementById('v3agTask').value = (V3Skills.visible()[0] || {}).id || 'free-chat';
let zErr = null;
try { A.send(); } catch (e) { zErr = e; }
const zrun = A.st.runs[A.st.runs.length - 1];
ok(zErr === null && zrun && /^[0-9a-f-]{36}$/.test(zrun.sessionId || ''), 'zcodeGo 发送时生成 UUID 型 run.sessionId');
ok(A.st.runs.some(r => r.id === (zrun && zrun.id)), 'zcode run 已入历史');

/* ---------- 汇总 ---------- */
console.log('');
if (fail === 0) {
  console.log('ALL PASS (' + pass + ')');
  process.exit(0);
} else {
  console.log('FAILED ' + fail + '/' + (pass + fail) + '：' + fails.join('；'));
  process.exit(1);
}
