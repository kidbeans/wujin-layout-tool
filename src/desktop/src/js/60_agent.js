/* ================= 60_agent.js —— Agent 工作台（技能化，参照 LinguaGacha 的技能包/宪章/预设体系） =================
 * 技能体系（resource/agent_skill/<id>/SKILL.md + ui.json → build.py 生成 manifest.json）：
 *   · charter / mpz-redlines 为不可见常驻技能（输出契约 + 领域红线，始终注入 system）
 *   · 可见技能（体检/顺序/路由/Boss/设计/自由对话）= 任务下拉，切换时套用 ui.defaults 上下文勾选
 *   · @引用：输入里 @技能名 → 附加技能；@阵型/@检查… → 自动勾选上下文
 *   · CLI 型：技能文件随任务包写入工作目录 skills/，prompt 附 <available_skills> 清单（渐进披露）
 *   · HTTP 型：charter+红线+所选技能全文注入 system；支持多轮续聊（messages 数组延续）
 * 模型预设（resource/agent_model/preset_models.json）：设置页「从预设添加」一键填充（含 anthropic 协议与温度）。
 * 纯逻辑（node 可测）：v3AgentParseFrontmatter / v3AgentSkillsFromManifest / v3AgentResolveRefs /
 *           v3AgentBuildPrompt / v3AgentRenderMD / v3AgentEscapeHTML / v3AgentRunTitle / v3AgentRelTime
 */
'use strict';

/* ---------------- 纯逻辑 ---------------- */

function v3AgentDefaultClients(){
  /* 实测参数风格（2026-09-05，本机）：
   *  · zcode 0.16.5 / agy：`-p` 是"prompt 附参"风格（-p 的值就是 prompt，不读 stdin，另有 --json 机器可读输出）。
   *    大任务包超 Windows 32K 命令行上限 → 固定短指令让 agent 读 cwd 里的 任务包.md（上下文文件已随任务写入）。
   *  · claude：-p 从 stdin 读长 prompt，--output-format json 的 modelUsage 字段可确认实际模型。
   *  · zcode headless 首次使用需 ~/.zcode/cli/config.json 配置 model provider（桌面端不受影响）。 */
  var READ_PACK = '请阅读当前目录下的 任务包.md（技能在 skills/ 子目录，上下文文件在同目录），严格按其中要求执行。';
  return [
    { id: 'zcode', name: 'zcode（ZCode CLI）', kind: 'cli', cmd: 'zcode', args: ['-p', READ_PACK], useStdin: false,
      /* ZCode 桌面端内置 Node 内核（glm/zcode.cjs）；探测到即以 node 运行 */
      probe: [ 'C:/Users/6x0/AppData/Local/Programs/ZCode/resources/glm/zcode.cjs' ],
      note: 'headless 需 ~/.zcode/cli/config.json 配 model provider；TUI 内 /model 查看切换' },
    { id: 'agy', name: 'Antigravity CLI（agy）', kind: 'cli', cmd: 'agy', args: ['-p', READ_PACK], useStdin: false,
      note: 'agy models 列模型，--model 指定；JSON 输出不回显模型' },
    { id: 'claude',   name: 'Claude Code',        kind: 'cli', cmd: 'claude', args: ['-p', '--output-format', 'text'], useStdin: true,
      note: '-p --output-format json 的 modelUsage 字段可确认实际模型' },
    { id: 'codex',    name: 'Codex CLI',          kind: 'cli', cmd: 'codex',  args: ['exec'], useStdin: true },
    { id: 'deepseek', name: 'DeepSeek API',       kind: 'http', endpoint: 'https://api.deepseek.com/v1/chat/completions', apiFormat: 'openai', model: 'deepseek-chat', key: '', temperature: 1.0 }
  ];
}

function v3AgentDefaultState(){
  return { clients: v3AgentDefaultClients(), active: 'zcode', runs: [], seq: 1, wsRoot: '' };
}

/* OpenAI 兼容端点容错：只填了基础地址（如 https://host/v1）时自动补 /chat/completions。
 * 已含 chat/completions、anthropic 协议（fmt=anthropic 或 /messages 端点）、非 http(s) 串 → 原样保留（仅尾斜杠归一）。
 * 典型案例：https://opencode.ai/zen/go/v1 是网关基础地址，直连会被网站当成页面路由返回 HTML 404。 */
function v3AgentNormalizeChatEndpoint(url, fmt){
  var s = String(url == null ? '' : url).trim();
  if (fmt === 'anthropic') return s;
  var low = s.toLowerCase();
  if (!low || (low.indexOf('http://') !== 0 && low.indexOf('https://') !== 0)) return s;
  if (low.indexOf('chat/completions') !== -1) return s.replace(/\/+$/, '');
  if (/\/messages(\?|#|$)/.test(low)) return s;
  return s.replace(/\/+$/, '') + '/chat/completions';
}

/* ZCode 伪装：为「每段对话」生成稳定会话 ID（UUID v4 形状，匹配 ZCode 原生 x-session-id），
 * 同一 run（含续聊）复用、新任务另起。OpenCode Go 文档称其能识别 ZCode 原生会话请求头，
 * 故伪装成 ZCode 时以 x-session-id 绑定对话即可，不必发 x-opencode-session。 */
function v3AgentUuid(){
  if (typeof crypto !== 'undefined' && crypto.randomUUID) { try { return crypto.randomUUID(); } catch (e) {} }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c){
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
/* ZCode 客户端身份头（据实测 ZCode→网关报文复刻）。浏览器 fetch 无法覆写 User-Agent（禁用头），
 * web 侧由 70_bridge 过滤掉 user-agent；桌面版 Rust 侧全量下发（见 agent.rs zcode_headers）。 */
function v3AgentZcodeHeaders(sid){
  if (!sid) return null;
  return {
    'user-agent': 'ZCode/3.11.2 ai-sdk/provider-utils/4.0.39 runtime/node.js/24',
    'x-session-id': String(sid),
    'x-zcode-app-version': '3.11.2',
    'x-zcode-session-type': 'main',
    'x-title': 'Z Code@electron',
    'http-referer': 'https://zcode.z.ai',
    'x-platform': 'win32-x64',
    'x-os-category': 'windows',
    'x-os-version': '10.0.26100',
    'x-client-language': 'zh-CN',
    'x-client-timezone': 'Asia/Shanghai',
    'x-release-channel': 'production'
  };
}

/* 用户消息拆分：【用户要求】…与【当前布阵上下文】…分离（对话流里上下文默认折叠，请求体保持完整） */
function v3AgentSplitContext(userText){
  var s = String(userText == null ? '' : userText);
  var i = s.indexOf('【当前布阵上下文】');
  if (i === -1) return { req: s, ctx: '' };
  return { req: s.slice(0, i).trim(), ctx: s.slice(i + '【当前布阵上下文】'.length).replace(/^\s*/, '') };
}

/* 上下文折叠块：details 默认收起，展开为只读 pre（转义+限长，防整页 JSON 刷屏） */
function v3AgentCtxDetails(ctx){
  var t = String(ctx == null ? '' : ctx);
  if (t.length > 60000) t = t.slice(0, 60000) + '\n…（截断，完整内容见「复制任务包」）';
  var n = (t.match(/^### /gm) || []).length;
  return '<details class="v3ag-ctx"><summary>已附上下文' + (n ? '（' + n + ' 段）' : '') + '——点击展开</summary><pre>'
    + v3AgentEscapeHTML(t) + '</pre></details>';
}

/* 宽松 JSON 解析：修复 LLM 输出常见碎片——节点片段缺外层 {}、尾逗号 */
function v3AgentLooseParse(text){
  var s = String(text == null ? '' : text).trim();
  if (!s) return { ok: false };
  try { return { ok: true, value: JSON.parse(s) }; } catch (e) {}
  var trimmed = s.replace(/,\s*$/, '');
  try { return { ok: true, value: JSON.parse(trimmed) }; } catch (e) {}
  if (s.charAt(0) === '"'){
    try { return { ok: true, value: JSON.parse('{' + trimmed + '}') }; } catch (e) {}
  }
  return { ok: false };
}

/* pipeline 节点表判定（值含 action/recognition/next 之一即视为节点） */
function v3AgentIsNodeMap(v){
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  var ks = Object.keys(v), hits = 0;
  ks.forEach(function (k){
    var n = v[k];
    if (n && typeof n === 'object' && !Array.isArray(n) &&
        (n.action !== undefined || n.recognition !== undefined || n.next !== undefined)) hits++;
  });
  return ks.length > 0 && hits > 0;
}
function v3AgentHasJudge(v){
  return !!(v && typeof v === 'object' && Object.keys(v).some(function (k){
    return /判断是否进入关内$/.test(String(k)) || /(_Entry|_无尽)$/.test(String(k));
  }));
}
/* 顺序步骤数组判定 + deck 识别（波次名含 _d2 → deck2） */
function v3AgentIsOrderItems(v){
  return Array.isArray(v) && v.length > 0 && v.every(function (it){
    return it && typeof it === 'object' && typeof it.t === 'string' && it.t.length <= 12;
  });
}
function v3AgentDetectDeck(items){
  var d2 = false, any = false;
  (items || []).forEach(function (it){
    if (!it || typeof it !== 'object') return;
    any = true;
    if (it.t === 'wave' && /_d2/.test(String(it.name || ''))) d2 = true;
  });
  return (any && d2) ? 'deck2' : 'deck1';
}

/* 无围栏 JSON 扫描：字符串感知地提取 "key": {…}/[…]、裸 {…}/[…]（LLM 输出经常丢 ``` 围栏） */
function v3AgentScanJSON(text){
  var s = String(text == null ? '' : text), out = [], i = 0, n = s.length;
  while (i < n){
    var ch = s.charAt(i);
    if (ch === '"'){   /* 跳过字符串（含转义） */
      i++;
      while (i < n){
        if (s.charAt(i) === '\\') i += 2;
        else if (s.charAt(i) === '"'){ i++; break; }
        else i++;
      }
      continue;
    }
    if (ch === '{' || ch === '['){
      var close = (ch === '{') ? '}' : ']';
      /* keyed 上下文：向前收紧邻的 "key":（含引号），让片段能带回节点名/字段名 */
      var ks = i, j = i - 1;
      while (j >= 0 && /\s/.test(s.charAt(j))) j--;
      if (j >= 0 && s.charAt(j) === ':'){
        j--;
        while (j >= 0 && /\s/.test(s.charAt(j))) j--;
        if (j >= 0 && s.charAt(j) === '"'){
          j--;
          while (j >= 0){
            if (s.charAt(j) === '\\'){ j -= 2; continue; }
            if (s.charAt(j) === '"') break;
            j--;
          }
          if (j >= 0 && s.charAt(j) === '"') ks = j;
        }
      }
      var depth = 0, k = i, inStr = false;
      for (; k < n; k++){
        var c2 = s.charAt(k);
        if (inStr){
          if (c2 === '\\') k++;
          else if (c2 === '"') inStr = false;
        } else if (c2 === '"') inStr = true;
        else if (c2 === ch) depth++;
        else if (c2 === close){ depth--; if (depth === 0){ k++; break; } }
      }
      if (depth === 0 && k > i){
        out.push(s.slice(ks, k).trim());
        i = k;
        continue;
      }
    }
    i++;
  }
  return out;
}

/* 上下文容量检测与自动压缩：超限先截断首条上下文段，再丢最旧轮次（保最新用户消息），最后合并同角色相邻消息 */
function v3AgentCompressMessages(msgs, limit){
  limit = limit || 80000;
  var notes = [];
  msgs = (msgs || []).map(function (m){ return { role: m.role, content: String(m.content == null ? '' : m.content) }; });
  function tot(){ return msgs.reduce(function (a, m){ return a + m.content.length; }, 0); }
  var first = msgs[0];
  if (first && first.role === 'user' && tot() > limit){
    var sp = v3AgentSplitContext(first.content);
    if (sp.ctx.length > 24000){
      var cut = sp.ctx.slice(0, 12000) + '\n…（上下文过长已自动截断，完整内容见「复制任务包」）';
      first.content = (sp.req || '') + '\n\n【当前布阵上下文】\n\n' + cut;
      notes.push('首条上下文 ' + sp.ctx.length + '→12000 字');
    }
  }
  var dropped = 0;
  while (tot() > limit && msgs.length > 2) dropped += msgs.shift().content.length;
  if (dropped){
    msgs.unshift({ role: 'user', content: '【前情已压缩：最早对话省略约 ' + Math.round(dropped / 1000) + 'k 字，结论以最近回复为准】' });
    notes.push('省略最早对话约 ' + Math.round(dropped / 1000) + 'k 字');
  }
  var norm = [];
  msgs.forEach(function (m){
    var last = norm[norm.length - 1];
    if (last && last.role === m.role) last.content += '\n\n' + m.content;
    else norm.push({ role: m.role, content: m.content });
  });
  return { msgs: norm, notes: notes };
}

/* SKILL.md frontmatter 解析：---\nkey: value\n---\n正文 → {meta, body} */
function v3AgentParseFrontmatter(text){
  text = String(text == null ? '' : text);
  var meta = {}, body = text;
  var m = text.match(/^\uFEFF?\s*---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (m){
    m[1].split('\n').forEach(function (line){
      var i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    });
    body = text.slice(m[0].length);
  }
  return { meta: meta, body: body };
}

/* manifest.json（build.py 生成）→ 归一化技能列表 */
function v3AgentSkillsFromManifest(manifest){
  var out = [];
  ((manifest && manifest.skills) || []).forEach(function (s){
    if (!s || !s.id) return;
    out.push({
      id: s.id,
      name: s.name || s.id,
      description: s.description || '',
      visible: s.visible !== false,
      order: (s.order === undefined || s.order === null) ? 900 : s.order,
      label: s.label || s.name || s.id,
      defaults: s.defaults || {}
    });
  });
  out.sort(function (a, b){ return (a.order - b.order) || (a.id < b.id ? -1 : 1); });
  return out;
}

/* file:// 等无法 fetch 技能库时的兜底技能集（正文走 JS 内置红线） */
function v3AgentFallbackSkills(){
  return [
    { id: 'formation-check', name: 'formation-check', description: '体检（技能库未加载，使用内置精简版）', visible: true, order: 100, label: '🔍 AI 体检', defaults: { context: ['formation', 'pipeline', 'order', 'route', 'boss', 'checks'] } },
    { id: 'free-chat', name: 'free-chat', description: '自由对话（技能库未加载，使用内置精简版）', visible: true, order: 600, label: '💬 自由对话', defaults: { context: ['formation', 'checks'] } }
  ];
}

/* 上下文键别名（@引用用） */
var V3_CTX_ALIASES = {
  '阵型': 'formation', 'formation': 'formation', '棋盘': 'formation',
  'pipeline': 'pipeline', '片段': 'pipeline',
  '顺序': 'order', '种植': 'order', 'order': 'order',
  '路由': 'route', 'route': 'route',
  'boss': 'boss', 'Boss': 'boss',
  '检查': 'checks', '报告': 'checks', 'checks': 'checks',
  '规范': 'spec', '红线': 'spec', 'spec': 'spec'
};

/* @引用解析：@技能名 → 附加技能；@上下文别名 → 勾选上下文。返回剥离 @token 后的 extra。 */
function v3AgentResolveRefs(extra, ctxOpts, skills){
  var out = String(extra == null ? '' : extra);
  var usedCtx = {}, extraSkills = [], resolved = [];
  var re = /@([\w\u4e00-\u9fa5-]+)/g, m;
  var byName = {};
  (skills || []).forEach(function (s){ byName[s.name.toLowerCase()] = s; byName[s.id.toLowerCase()] = s; });
  while ((m = re.exec(out)) !== null){
    var tok = m[1], lo = tok.toLowerCase();
    if (byName[lo]){ extraSkills.push(byName[lo].id); resolved.push('@' + tok + '→技能 ' + byName[lo].name); continue; }
    if (V3_CTX_ALIASES[tok] || V3_CTX_ALIASES[lo]){ usedCtx[V3_CTX_ALIASES[tok] || V3_CTX_ALIASES[lo]] = true; resolved.push('@' + tok + '→上下文'); continue; }
  }
  if (extraSkills.length || Object.keys(usedCtx).length){
    out = out.replace(/(^|\s)@[\w\u4e00-\u9fa5-]+/g, '$1').replace(/\s{2,}/g, ' ').trim();
  }
  return { extra: out, ctx: usedCtx, extraSkills: extraSkills, resolved: resolved };
}

/* system 组装：charter（常驻）→ mpz-redlines（可用 includeRedlines 关）→ 任务技能 → 附加技能 */
function v3AgentComposeSystem(bodies, skillIds, includeRedlines){
  var ordered = ['charter'];
  if (includeRedlines !== false) ordered.push('mpz-redlines');
  (skillIds || []).forEach(function (id){
    if (ordered.indexOf(id) === -1) ordered.push(id);
  });
  var parts = [];
  ordered.forEach(function (id){
    if (bodies[id]) parts.push(String(bodies[id]).trim());
  });
  if (!parts.length) parts.push(v3AgentSpecLegacy());
  return { system: parts.join('\n\n---\n\n'), skillIds: ordered };
}

/* file:// 兜底：内置红线精简版（与 resource/agent_skill/mpz-redlines 同源精简） */
function v3AgentSpecLegacy(){
  return [
    '【MPZ / MaaFramework pipeline 红线速查（评审依据）】',
    '1. next 顺序遍历非并行；长等待 timeout:-1。 2. ColorMatch 父 next ≥2。 3. max_hit=0 永久禁用、勿做每关一次。',
    '4. custom_action_param 双层编码。 5. 同一 custom 节点仅一个 input 覆盖。 6. 卡槽9~16=配队2别名（复用1~8坐标）。',
    '7. 坐标系720短边，跨分辨率×2/3+越界自检。 8. interface.json 只追加；自制内容进 resource_self。',
    '9. 配队切换后 post_delay；卡组选项双击(500ms)。 10. 重置到1 直连初始化完毕。',
    '11. 喂豆循环须回环；点波四元组 target 一致。 12. 尾数分流：1/2/4/6/7/9→deck1，3/8→deck2，5/0→Boss。',
    '13. S 系检查：S1断链 S2悬空 S3孤岛 S4检测回退 S5禁max_hit S6长等待 S8deck2隔离 S9/S17点波 S10重置 S11入口 S12锚点 S13越界 S14别名 S15喂豆循环 S16回环 S18点波target S19色值 S20OCR S21Swipe S22延时；T1~T7。'
  ].join('\n');
}

/* 收集当前布阵上下文；返回 { sections: {key: text}, files: [{name, content}] }
 * opts: {formation, pipeline, order, route, boss, checks, spec} 布尔开关（spec 由宪章组装处理，此处仅透传） */
function v3AgentCollectContext(opts){
  opts = opts || {};
  function on(k){ return opts[k] !== false; }
  var sections = {};
  var files = [];

  if (on('formation')){
    try {
      var o = (typeof v2ExportJSON === 'function') ? v2ExportJSON() : null;
      if (o){
        var txt = '';
        try { txt = (typeof exportFull === 'function') ? String(exportFull() || '') : ''; } catch (e) { txt = ''; }
        sections['阵型 JSON v2'] = '```json\n' + JSON.stringify(o, null, 1) + '\n```';
        if (txt) sections['阵型文本（可导入格式）'] = '```\n' + txt + '\n```';
        files.push({ name: '阵型.json', content: JSON.stringify(o, null, 1) });
      }
    } catch (e) { sections['阵型'] = '（收集失败：' + e.message + '）'; }
  }
  if (on('pipeline')){
    try {
      if (typeof v2BuildPipeline === 'function'){
        var built = v2BuildPipeline();
        var pack = { pipeline: built.nodes, prefix: built.prefix };
        try { if (typeof v2BuildTask === 'function'){ var t = v2BuildTask(built); pack.task = t.task; pack.option = t.option; } } catch (e) {}
        sections['pipeline 片段'] = '```json\n' + JSON.stringify(pack, null, 1) + '\n```';
        files.push({ name: 'pipeline_片段.json', content: JSON.stringify(pack, null, 1) });
      }
    } catch (e) {}
  }
  if (on('order') && typeof v2SerializeAll === 'function'){
    try { sections['种植顺序 deck1/deck2'] = '```json\n' + JSON.stringify(v2SerializeAll().order || {}, null, 1) + '\n```'; } catch (e) {}
  }
  if (on('route') && typeof v2SerializeAll === 'function'){
    try { sections['路由参数'] = '```json\n' + JSON.stringify(v2SerializeAll().route || {}, null, 1) + '\n```'; } catch (e) {}
  }
  if (on('boss') && typeof v2SerializeAll === 'function'){
    try {
      var boss = v2SerializeAll().boss || {};
      if (boss.ops && boss.ops.length) sections['Boss 链'] = '```json\n' + JSON.stringify(boss, null, 1) + '\n```';
    } catch (e) {}
  }
  if (on('checks')){
    var el = (typeof document !== 'undefined') ? document.getElementById('chkReport') : null;
    if (el && el.value && el.value.trim()){
      var rep = el.value.trim();
      if (rep.length > 24000) rep = rep.slice(0, 24000) + '\n…（截断）';
      sections['最近检查报告'] = '```\n' + rep + '\n```';
    }
  }
  return { sections: sections, files: files };
}

/* prompt 构建：skillId 为所选任务技能；bodies: {id: 正文, __skills: 列表}；ctx: 收集好的上下文 */
function v3AgentBuildPrompt(skillId, bodies, ctx, extra, extraSkillIds, includeRedlines){
  var skills = (bodies && bodies.__skills) || [];
  var skill = null;
  skills.forEach(function (s){ if (s.id === skillId) skill = s; });
  if (!skill && skills.length) skill = skills[0];
  if (!skill) skill = { id: 'free-chat', name: 'free-chat', label: '💬 自由对话' };
  var title = (skill.label || skill.name) + (extra ? '：' + (extra.trim().replace(/\s+/g, ' ').length > 18 ? extra.trim().replace(/\s+/g, ' ').slice(0, 18) + '…' : extra.trim().replace(/\s+/g, ' ')) : '');
  var ids = [skillId].concat(extraSkillIds || []);
  var sys = v3AgentComposeSystem(bodies, ids.slice(), includeRedlines);
  /* user：任务正文即技能（HTTP 已注入 system）；user 只放 用户要求 + 上下文 + 输出提醒 */
  var parts = [];
  extra = (extra || '').trim();
  if (extra) parts.push('【用户要求】\n' + extra);
  var keys = Object.keys((ctx && ctx.sections) || {});
  if (keys.length){
    var sec = keys.map(function (k){ return '### ' + k + '\n' + ctx.sections[k]; }).join('\n\n');
    parts.push('【当前布阵上下文】\n\n' + sec);
  }
  if (!parts.length) parts.push('（无附加要求，按所选技能的默认工作流处理当前上下文）');
  parts.push('【输出要求】用中文；遵循任务宪章（结论先行/证据规则/视觉组织）。');
  return { title: title, system: sys.system, user: parts.join('\n\n'), skillIds: sys.skillIds };
}

function v3AgentEscapeHTML(s){
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* 迷你 Markdown（代码块/行内代码/标题/粗体/列表/表格行/链接），先转义后渲染，安全无依赖 */
function v3AgentRenderMD(src){
  var text = String(src == null ? '' : src);
  var blocks = [];
  text = text.replace(/```([\w+-]*)\n?([\s\S]*?)```/g, function (m, lang, code){
    blocks.push('<pre><code>' + v3AgentEscapeHTML(code.replace(/\n$/, '')) + '</code></pre>');
    return '\u0000B' + (blocks.length - 1) + '\u0000';
  });
  var lines = text.split('\n');
  var out = [], inUl = false, inTable = false;
  function closeLists(){
    if (inUl){ out.push('</ul>'); inUl = false; }
    if (inTable){ out.push('</tbody></table>'); inTable = false; }
  }
  function inline(s){
    s = v3AgentEscapeHTML(s);
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
    s = s.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return s;
  }
  for (var i = 0; i < lines.length; i++){
    var ln = lines[i];
    var th = ln.match(/^\s*\|(.+)\|\s*$/);
    if (th && ln.indexOf('---') === -1 && lines[i + 1] && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])){
      closeLists();
      out.push('<table><thead><tr>' + th[1].split('|').map(function (c){ return '<th>' + inline(c.trim()) + '</th>'; }).join('') + '</tr></thead><tbody>');
      inTable = true; i++; continue;
    }
    if (inTable && th){
      out.push('<tr>' + th[1].split('|').map(function (c){ return '<td>' + inline(c.trim()) + '</td>'; }).join('') + '</tr>');
      continue;
    }
    if (inTable && !th){ out.push('</tbody></table>'); inTable = false; }
    var h = ln.match(/^(#{1,4})\s+(.*)$/);
    if (h){ closeLists(); out.push('<h' + h[1].length + '>' + inline(h[2]) + '</h' + h[1].length + '>'); continue; }
    var ul = ln.match(/^\s*[-*•]\s+(.*)$/);
    if (ul){ if (!inUl){ closeLists(); out.push('<ul>'); inUl = true; } out.push('<li>' + inline(ul[1]) + '</li>'); continue; }
    var ol = ln.match(/^\s*\d+[.、)]\s+(.*)$/);
    if (ol){ if (!inUl){ closeLists(); out.push('<ul>'); inUl = true; } out.push('<li>' + inline(ol[1]) + '</li>'); continue; }
    if (!ln.trim()){ closeLists(); continue; }
    closeLists();
    out.push('<p>' + inline(ln) + '</p>');
  }
  closeLists();
  var html = out.join('\n');
  html = html.replace(/\u0000B(\d+)\u0000/g, function (m, idx){ return blocks[+idx] || ''; });
  return html;
}

function v3AgentRelTime(ts){
  var d = Date.now() - ts;
  if (d < 60000) return '刚刚';
  if (d < 3600000) return Math.floor(d / 60000) + ' 分钟前';
  if (d < 86400000) return Math.floor(d / 3600000) + ' 小时前';
  return Math.floor(d / 86400000) + ' 天前';
}

/* ---------------- 技能库（运行时，fetch ui/agent_skill/） ---------------- */

var V3Skills = {
  list: [],
  bodies: {},
  loaded: false,

  load: function(){
    var self = this;
    return fetch('agent_skill/manifest.json', { cache: 'no-store' })
      .then(function (r){ if (!r.ok) throw new Error('manifest ' + r.status); return r.json(); })
      .then(function (mf){
        self.list = v3AgentSkillsFromManifest(mf);
        self.loaded = true;
        /* 常驻 + 默认技能正文预取；其余懒加载 */
        var ids = [];
        self.list.forEach(function (s){ if (!s.visible || s.id === 'formation-check') ids.push(s.id); });
        return Promise.all(ids.map(function (id){ return self.fetchBody(id); })).then(function (){ return self.list; });
      })
      .catch(function (){
        self.list = v3AgentFallbackSkills();
        self.loaded = false;
        self.bodies['mpz-redlines'] = v3AgentSpecLegacy();
        return self.list;
      });
  },
  fetchBody: function (id){
    var self = this;
    if (this.bodies[id]) return Promise.resolve(this.bodies[id]);
    return fetch('agent_skill/' + encodeURIComponent(id) + '/SKILL.md', { cache: 'no-store' })
      .then(function (r){ if (!r.ok) throw new Error('skill ' + r.status); return r.text(); })
      .then(function (t){ var p = v3AgentParseFrontmatter(t); self.bodies[id] = p.body; return p.body; })
      .catch(function (){ return null; });
  },
  ensureBodies: function (ids){
    var self = this;
    return Promise.all((ids || []).map(function (id){ return self.fetchBody(id); }));
  },
  visible: function (){ return this.list.filter(function (s){ return s.visible; }); },
  get: function (id){ var r = null; this.list.forEach(function (s){ if (s.id === id) r = s; }); return r; }
};

/* ---------------- UI 接线 ---------------- */

var V3Agent = {
  st: null,
  liveId: null,
  busy: false,
  throttle: null,
  KEY: 'wujin_v3_agent',

  load: function(){
    try {
      var raw = localStorage.getItem(this.KEY);
      if (raw){
        var s = JSON.parse(raw);
        s.clients = s.clients && s.clients.length ? s.clients : v3AgentDefaultClients();
        s.runs = s.runs || [];
        v3AgentDefaultClients().forEach(function (d){
          if (!s.clients.some(function (c){ return c.id === d.id; })) s.clients.push(d);
        });
        /* 迁移：老存档补 apiFormat/temperature；默认客户端的新字段（probe/note/args 升级）并入同名项；移除 ollama */
        s.clients.forEach(function (c){
          var d = null;
          v3AgentDefaultClients().forEach(function (x){ if (x.id === c.id) d = x; });
          if (!d) return;
          ['probe', 'note'].forEach(function (k){ if (d[k] !== undefined) c[k] = d[k]; });
          /* 参数风格修正：zcode/agy 的旧默认（-p 布尔 + output-format）在真机上会报 ambiguous，升级为「读 任务包.md」指令 */
          var oldArgs = JSON.stringify(c.args || []);
          if (d.args && (oldArgs === JSON.stringify(['-p']) || oldArgs === JSON.stringify(['-p', '--output-format', 'text']))){
            c.args = d.args.slice();
            c.useStdin = d.useStdin;
          }
          if (c.useStdin === undefined) c.useStdin = d.useStdin;
          if (c.kind === 'http' && c.apiFormat === undefined) c.apiFormat = d.apiFormat || 'openai';
          if (c.kind === 'http' && c.temperature === undefined && d.temperature !== undefined) c.temperature = d.temperature;
        });
        s.clients = s.clients.filter(function (c){ return c.id !== 'ollama'; });
        /* 迁移：OpenCode Zen/Go 网关——① 推理模型强制思考且时长波动大（实测 6s~470s+），未设过思考强度默认限 low；
         *    ② 伪装 ZCode 客户端（x-session-id + ZCode UA，Go 认 ZCode 原生会话头），端点含 opencode/z.ai 时自动开启；
         *    ③ 老字段 opencodeGo 平滑迁到 zcodeGo。 */
        s.clients.forEach(function (c){
          if (c.kind !== 'http') return;
          if (c.opencodeGo !== undefined){ if (c.opencodeGo && c.zcodeGo === undefined) c.zcodeGo = true; delete c.opencodeGo; }
          if (/opencode|z\.ai/i.test(c.endpoint || '')){
            if (c.effort === undefined) c.effort = 'low';
            if (c.zcodeGo === undefined) c.zcodeGo = true;
          }
        });
        if (!s.clients.some(function (c){ return c.id === s.active; }) && s.clients.length) s.active = s.clients[0].id;
        this.st = s;
        return;
      }
    } catch (e) {}
    this.st = v3AgentDefaultState();
  },
  save: function(){
    try {
      var s = JSON.parse(JSON.stringify(this.st));
      s.runs = (s.runs || []).slice(0, 30);
      s.runs.forEach(function (r){
        if (r.output && r.output.length > 200000) r.output = r.output.slice(0, 200000) + '\n…（超长截断）';
        if (r.reasoning && r.reasoning.length > 100000) r.reasoning = r.reasoning.slice(-100000);   /* 只留思考尾部 */
        if (r.prompt && r.prompt.user && r.prompt.user.length > 200000) r.prompt.user = r.prompt.user.slice(0, 200000);
      });
      localStorage.setItem(this.KEY, JSON.stringify(s));
    } catch (e) {}
  },

  client: function(id){
    var c = null;
    (this.st.clients || []).forEach(function (x){ if (x.id === id) c = x; });
    return c;
  },

  /* 运行日志：桌面版逐行追加到 appdata/agent_run.log（START/END/错误都记），浏览器模式仅 console */
  log: function (msg){
    if (typeof V3Bridge !== 'undefined' && V3Bridge.agentLog){
      var t = new Date().toISOString().replace('T', ' ').slice(0, 19);
      V3Bridge.agentLog('[' + t + '] ' + msg);
    }
  },

  el: function(id){ return document.getElementById(id); },

  /* ---------- 渲染 ---------- */
  renderClients: function(){
    var sel = this.el('v3agClient');
    if (sel){
      sel.innerHTML = this.st.clients.map(function (c){
        return '<option value="' + c.id + '">' + (c.kind === 'cli' ? '⌨ ' : '☁ ') + c.name + '</option>';
      }).join('');
      sel.value = this.st.active;
      if (sel.selectedIndex < 0 && sel.options.length){ sel.selectedIndex = 0; this.st.active = sel.value; }
    }
    var box = this.el('v3agClients');
    if (box){
      box.innerHTML = this.st.clients.map(function (c){
        var found = c._found;
        var dot = c.kind === 'http' ? (c.endpoint ? 'ok' : 'err') : (found ? 'ok' : 'err');
        var tip = c.kind === 'cli' ? (found ? ('已找到：' + found) : '未在 PATH 探测到（仍可手填绝对路径）') : c.endpoint;
        return '<div class="v3ag-cli" title="' + v3AgentEscapeHTML(tip) + '"><span class="dot ' + dot + '"></span>' + c.name + '</div>';
      }).join('');
    }
    this.renderStatus();
  },

  renderTasks: function(){
    var self = this;
    var sel = this.el('v3agTask');
    if (!sel) return;
    var vis = V3Skills.visible();
    if (vis.length){
      sel.innerHTML = vis.map(function (s){
        return '<option value="' + s.id + '" title="' + v3AgentEscapeHTML(s.description) + '">' + s.label + '</option>';
      }).join('');
    } else {
      sel.innerHTML = '<option value="free-chat">💬 自由对话</option>';
    }
    this.applyTaskDefaults(sel.value);
  },

  applyTaskDefaults: function(skillId){
    var s = V3Skills.get(skillId);
    if (!s || !s.defaults || !s.defaults.context) return;
    var map = { formation: 'v3cxFormation', pipeline: 'v3cxPipeline', order: 'v3cxOrder', route: 'v3cxRoute', boss: 'v3cxBoss', checks: 'v3cxChecks' };
    Object.keys(map).forEach(function (k){
      var el = document.getElementById(map[k]);
      if (el && s.defaults.context.indexOf(k) !== -1) el.checked = true;
    });
  },

  renderRuns: function(){
    var self = this;
    var box = this.el('v3agRuns');
    if (!box) return;
    var runs = (this.st.runs || []).slice().reverse();
    box.innerHTML = runs.map(function (r){
      var dot = r.status === 'run' ? 'run' : (r.status === 'err' ? 'err' : (r.status === 'manual' ? '' : 'ok'));
      var turn = r.turns > 1 ? ' <span style="opacity:.6">×' + r.turns + '</span>' : '';
      return '<button class="v3ag-run' + (r.id === self.liveId ? ' on' : '') + '" data-run="' + r.id + '">'
        + '<span class="dot ' + dot + '"></span><span class="t">' + r.title + turn + '</span>'
        + '<span class="ago">' + v3AgentRelTime(r.ts) + '</span>'
        + '<span class="v3ag-del" data-del="' + r.id + '" title="删除此对话">✕</span></button>';
    }).join('') || '<div class="v3side-h" style="padding-left:6px">暂无任务</div>';
    box.querySelectorAll('[data-run]').forEach(function (b){
      b.addEventListener('click', function(){ self.showRun(b.dataset.run); });
      var del = b.querySelector('[data-del]');
      if (del) del.addEventListener('click', function (e){ e.stopPropagation(); self.deleteRun(del.dataset.del); });
    });
  },

  renderStatus: function(){
    var el = this.el('v3stAgent');
    if (!el) return;
    var c = this.client(this.st.active);
    if (!c){ el.textContent = 'Agent：未配置'; el.className = ''; return; }
    var ok = c.kind === 'http' ? !!c.endpoint : !!c._found;
    el.textContent = 'Agent：' + c.name + (this.busy ? '（运行中…）' : (ok ? '' : '（未探测到，需配置）'));
    el.className = this.busy ? 'busy' : (ok ? 'ok' : '');
  },

  msg: function(kind, html){
    var stream = this.el('v3agStream');
    if (!stream) return null;
    var d = document.createElement('div');
    d.className = 'v3msg ' + kind;
    d.innerHTML = '<div class="v3msg-bubble">' + html + '</div>';
    stream.appendChild(d);
    stream.scrollTop = stream.scrollHeight;
    return d;
  },

  showWelcome: function(){
    var w = this.el('v3agWelcome');
    var stream = this.el('v3agStream');
    if (!stream) return;
    stream.innerHTML = '';
    if (w) stream.appendChild(w);
  },

  showRun: function(id){
    var r = this.findRun(id);
    if (!r) return;
    this.liveId = id;
    var stream = this.el('v3agStream');
    stream.innerHTML = '';
    this.el('v3agTitle').textContent = r.title;
    this.el('v3agMeta').textContent = new Date(r.ts).toLocaleString() + ' · ' + (r.clientName || r.client)
      + (r.turns > 1 ? ' · ' + r.turns + ' 轮' : '') + (r.ms ? ' · ' + Math.round(r.ms / 1000) + 's' : '');
    /* 用户侧：只渲染用户要求，整段上下文默认折叠（完整内容仍随请求体与「复制任务包」保留） */
    var self = this;
    var turns = r.messages
      ? r.messages.filter(function (h){ return h.role === 'user'; })
      : [{ role: 'user', content: r.extra || '（无附加要求）' }];
    var userHtml = '<div class="v3md">' + v3AgentRenderMD('**' + (r.prompt && r.prompt.title || '') + '**');
    turns.forEach(function (h, idx){
      var sp = v3AgentSplitContext(h.content);
      var sep = idx ? '\n\n---\n\n' : '\n\n';
      userHtml += v3AgentRenderMD(sep + (sp.req || '（无附加要求，按技能默认工作流执行）'))
        + (sp.ctx ? v3AgentCtxDetails(sp.ctx) : '');
    });
    userHtml += '</div>';
    this.msg('user', userHtml);
    if (r.output) this.msg('agent', '<div class="v3md">' + v3AgentRenderMD(r.output) + '</div>');
    else if (r.status === 'run') this.msg('agent', '<span class="v3typing"><i></i><i></i><i></i></span>');
    else if (r.status === 'manual') this.msg('sys', '该任务在浏览器模式创建：请用「复制任务包」手动粘贴到 Agent 客户端。');
    this.renderRuns();
  },

  /* ---------- 上下文 ---------- */
  ctxOpts: function(){
    function c(id){ var e = document.getElementById(id); return e ? e.checked : true; }
    return {
      formation: c('v3cxFormation'), pipeline: c('v3cxPipeline'), order: c('v3cxOrder'),
      route: c('v3cxRoute'), boss: c('v3cxBoss'), checks: c('v3cxChecks'), spec: c('v3cxSpec')
    };
  },

  /* ---------- 发送 / 续聊 ---------- */
  send: function(){
    var self = this;
    if (this.busy) return;
    var input = this.el('v3agInput');
    var rawExtra = input ? input.value : '';
    if (!rawExtra.trim()) return;
    var taskSel = this.el('v3agTask');
    var skillId = (taskSel && taskSel.value) || 'free-chat';

    /* 续聊：HTTP 任务完成或异常终止都可继续——messages 里已有历史（网关假死/手动停止后直接输入即接着聊，上下文不丢） */
    var live = this.findRun(this.liveId);
    var isFollowUp = !!(live && live.status !== 'run' && live.clientKind === 'http' && live.messages && live.messages.length);
    if (live && live.status === 'ok' && live.clientKind === 'cli'){
      /* CLI 无会话态：转新任务并提示 */
      this.liveId = null;
      if (typeof showToast === 'function') showToast('CLI 客户端每轮独立，已为你新建任务');
    }

    var cli = this.client(this.st.active);
    if (!cli) return;
    /* 续聊沿用该任务创建时的客户端（保持上下文与协议一致） */
    if (isFollowUp && live){
      var rc = this.client(live.client);
      if (rc) cli = rc;
    }

    /* @引用解析 + 技能默认勾选 */
    var refs = v3AgentResolveRefs(rawExtra, null, V3Skills.list);
    var extra = refs.extra;
    var ctxOpts = this.ctxOpts();
    Object.keys(refs.ctx).forEach(function (k){
      if (k === 'spec') ctxOpts.spec = true;
      else ctxOpts[k] = true;
    });
    var ctx = v3AgentCollectContext(ctxOpts);
    var extraSkillIds = (refs.extraSkills || []).slice();
    var prompt = v3AgentBuildPrompt(skillId, Object.assign({ __skills: V3Skills.list }, V3Skills.bodies), ctx, extra, extraSkillIds, ctxOpts.spec !== false);

    var run;
    if (isFollowUp){
      run = live;
      run.turns = (run.turns || 1) + 1;
      run.output += '\n\n---\n\n**用户（续）：** ' + extra + '\n\n';
      run._turnOutStart = run.output.length;   /* 本轮输出起点：异常终止时只回存本轮新增内容 */
      run.status = 'run';            /* 续聊轮次必须重回运行态：否则 done 幂等守卫吞掉结束事件，UI 永久卡死（实测第二轮必卡） */
      run.ts = Date.now();           /* 计时以本轮为起点 */
      run.ms = 0;
      run._tipShown = false;
      this.msg('user', '<div class="v3md">' + v3AgentRenderMD('**用户（续）：**\n\n' + extra) + '</div>');   /* 续聊消息也要上屏 */
    } else {
      var sk = V3Skills.get(skillId);
      run = {
        id: 'r' + this.st.seq, ts: Date.now(), skillId: skillId, skillLabel: (sk && sk.label) || skillId,
        title: prompt.title, client: cli.id, clientName: cli.name, clientKind: cli.kind,
        status: 'run', extra: extra, prompt: prompt, ctxFiles: ctx.files,
        output: '', reasoning: '', ms: 0, cwd: '', turns: 1, _turnOutStart: 0,
        apiFormat: cli.kind === 'http' ? (cli.apiFormat || 'openai') : null,
        messages: cli.kind === 'http' ? [{ role: 'user', content: prompt.user }] : null
      };
      this.st.seq++;
      this.st.runs.push(run);
      this.liveId = run.id;
      var stream0 = this.el('v3agStream');
      stream0.innerHTML = '';
      this.el('v3agTitle').textContent = run.title;
      this.el('v3agMeta').textContent = new Date(run.ts).toLocaleString() + ' · ' + cli.name;
      this.msg('user', '<div class="v3md">' + v3AgentRenderMD((run.prompt && run.prompt.title) + '\n\n' + extra) + '</div>');
    }
    if (input) input.value = '';

    var stream = this.el('v3agStream');
    var typing = this.msg('agent', '<span class="v3typing"><i></i><i></i><i></i></span> <span class="v3ag-elapsed" style="opacity:.55"></span>');
    this.busy = true;
    this.renderRuns(); this.renderStatus();
    this.el('v3agStop').style.display = '';
    if (refs.resolved.length) this.msg('sys', '已解析引用：' + refs.resolved.join('；'));

    /* 等待计时（真实进度）：显示总耗时与「空闲」秒数；reasoning/正文事件会刷新 run._lastEvt。
     * 空闲 ≥180s（连接无任何新数据）自动停止——防网关假死后计时器空转。 */
    /* 空闲阈值自适应：上下文越大，首字（思考前处理）越慢，看门狗越宽容 */
    var idleLimit = 90;
    try {
      var totLen0 = 0;
      (run.messages || []).forEach(function (m){ totLen0 += (m.content || '').length; });
      if (totLen0 > 30000) idleLimit = 180;
    } catch (e) {}
    run._lastEvt = Date.now();
    var stalled = false;
    var tick = setInterval(function(){
      if (!typing.parentNode){ clearInterval(tick); return; }
      var now = Date.now();
      var s = Math.round((now - run.ts) / 1000);
      var idle = Math.round((now - run._lastEvt) / 1000);
      var el = typing.querySelector('.v3ag-elapsed');
      if (el) el.textContent = s + 's' + (idle >= 10 ? ' · 空闲 ' + idle + 's' : '');
      if (!run._tipShown && run.reasoning && s >= 45){
        run._tipShown = true;
        self.msg('sys', '思考较久：推理模型时长波动大。可在 设置 ⚙️ → 编辑该客户端 → 思考强度调「低」，或改用 deepseek-v4-flash 等快速模型。');
      }
      if (idle >= idleLimit && !stalled){
        stalled = true;
        clearInterval(tick);
        if (typeof V3Bridge !== 'undefined'){
          if (V3Bridge.mode === 'tauri') V3Bridge.agentCancel(run.id);
          else if (V3Bridge.agentHttpAbort) V3Bridge.agentHttpAbort(run.id);
        }
        done('err', '连接空闲 ' + idleLimit + ' 秒无任何新数据（网关假死），已自动停止。直接输入可继续本对话（上下文保留），或重新发送。');
      }
    }, 1000);
    self._tick = tick;

    var done = function (status, note){
      if (run.status !== 'run') return;   /* 幂等：手动停止/看门狗已终态时忽略迟到的 done/error */
      run.status = status;
      run.ms = Date.now() - run.ts;
      clearInterval(tick);
      self._tick = null;
      if (self.throttleR){ clearTimeout(self.throttleR); self.throttleR = null; }
      /* 结束时保留已流出的内容：有正文定格完整渲染（原实现直接 remove 会把回复从对话页抹掉） */
      if (typing && typing.parentNode){
        if (run.output){
          var bubble = typing.querySelector('.v3msg-bubble');
          if (bubble) bubble.innerHTML = '<div class="v3md">' + v3AgentRenderMD(run.output.length > 120000
            ? run.output.slice(0, 120000) + '\n…（超长截断，完整内容见「复制任务包」）' : run.output) + '</div>';
        } else {
          typing.remove();
        }
      }
      /* 异常终止也把本轮已流出的部分回复存进会话历史，续聊上下文不丢（不含用户（续）标记等历史段） */
      if (status !== 'ok' && run.output && run.messages && run.messages.length){
        var partial = run.output.slice(run._turnOutStart || 0).trim();
        if (partial){
          var lastMsg = run.messages[run.messages.length - 1];
          if (!lastMsg || lastMsg.role !== 'assistant') run.messages.push({ role: 'assistant', content: partial });
        }
      }
      if (note) self.msg('sys', note);
      self.busy = false;
      self.el('v3agStop').style.display = 'none';
      self.log('END run=' + run.id + ' client=' + (run.clientName || run.client) + ' status=' + status + ' ms=' + run.ms
        + ' out_len=' + (run.output || '').length + ((run.reasoning) ? ' reason_len=' + run.reasoning.length : '')
        + (note ? ' note=' + String(note).replace(/<[^>]*>/g, '').slice(0, 220) : ''));
      self.save(); self.renderRuns(); self.renderStatus();
      if (typeof V3Bridge !== 'undefined' && V3Bridge.notify && status !== 'err'){
        V3Bridge.notify('无尽布阵工具 v4', 'Agent 任务完成：' + run.title);
      }
    };
    var onChunk = function (txt){
      run._lastEvt = Date.now();
      run.output += txt;
      if (run.output.length > 400000) run.output = run.output.slice(0, 400000);
      if (typing && typing.parentNode && !self.throttle){
        self.throttle = setTimeout(function (){
          self.throttle = null;
          if (typing.parentNode){
            var bubble = typing.querySelector('.v3msg-bubble');
            if (bubble){
              bubble.innerHTML = '<div class="v3md">' + v3AgentRenderMD(run.output.slice(-6000)) + '</div>';
              stream.scrollTop = stream.scrollHeight;
            }
          }
        }, 120);
      }
    };
    /* 思考流（推理模型 reasoning_content / anthropic thinking）：灰显尾部，正文一旦开始即让位 */
    var onReason = function (txt){
      run._lastEvt = Date.now();
      run.reasoning = (run.reasoning || '') + txt;
      if (run.reasoning.length > 200000) run.reasoning = run.reasoning.slice(-200000);
      if (typing && typing.parentNode && !run.output && !self.throttleR){
        self.throttleR = setTimeout(function (){
          self.throttleR = null;
          if (typing.parentNode && !run.output){
            var bubble = typing.querySelector('.v3msg-bubble');
            if (bubble){
              var tail = v3AgentEscapeHTML(run.reasoning.slice(-420)).replace(/\n/g, '<br>');
              bubble.innerHTML = '<div class="v3md" style="opacity:.62">🤔 思考中… <span class="v3ag-elapsed"></span> · '
                + run.reasoning.length + ' 字<br>' + tail + '</div>';
              stream.scrollTop = stream.scrollHeight;
            }
          }
        }, 150);
      }
    };

    if (cli.kind === 'cli' && !isFollowUp){
      if (typeof V3Bridge === 'undefined' || V3Bridge.mode !== 'tauri'){
        /* 不要提前把 status 改出手态 'run'——done() 幂等守卫会吞掉它，busy/计时器/气泡残留，界面卡死（浏览器版 CLI 客户端发送即踩）。
         * 交给 done('manual') 内部统一置状态并做完整清理。 */
        done('manual', '桌面版（Tauri）才能直接驱动 CLI。已生成<b>任务包</b>：点上方「复制任务包」后粘贴到 '
          + cli.name + '，或在终端执行 <code>' + cli.cmd + '</code> 并把任务包交给它。');
        return;
      }
      var selfRun = run;
      var sysInfo = v3AgentComposeSystem(Object.assign({ __skills: V3Skills.list }, V3Skills.bodies), [skillId].concat(extraSkillIds));
      var avail = V3Skills.list.map(function (s){ return '- ' + s.name + '：' + s.description; }).join('\n');
      V3Bridge.appInfo().then(function (info){
        var wsRoot = (info && info.wsRoot) || '';
        var dirName = '任务-' + new Date(selfRun.ts).toISOString().slice(0, 19).replace(/[:T]/g, '-');
        var ws = (wsRoot ? wsRoot + '/' : '') + dirName;
        selfRun.cwd = ws;
        /* 任务包：说明 + 可用技能清单 + 用户要求 + 上下文；技能正文落盘 skills/（渐进披露：agent 按名取用） */
        var packMd = '# ' + selfRun.title + '\n\n<available_skills>\n' + avail + '\n</available_skills>\n\n'
          + '## 评审依据（已注入正文）\n\n' + sysInfo.system + '\n\n'
          + '## 用户要求\n\n' + (extra || '（无，按技能默认工作流执行）') + '\n\n'
          + '## 当前布阵上下文\n\n' + (Object.keys((ctx && ctx.sections) || {}).map(function (k){ return '### ' + k + '\n' + ctx.sections[k]; }).join('\n\n') || '（无）') + '\n';
        var skillWrites = V3Skills.list.map(function (s){
          return V3Skills.fetchBody(s.id).then(function (body){
            if (body === null) return;
            var front = '---\nname: ' + s.name + '\ndescription: ' + s.description + '\n---\n\n';
            return V3Bridge.writeText(ws + '/skills/' + s.id + '/SKILL.md', front + body);
          });
        });
        return V3Bridge.ensureDir(ws)
          .then(function(){ return V3Bridge.writeText(ws + '/任务包.md', packMd); })
          .then(function(){ return Promise.all(skillWrites); })
          .then(function(){
            var fileW = (ctx.files || []).map(function (f){ return V3Bridge.writeText(ws + '/' + f.name, f.content); });
            return Promise.all(fileW);
          })
          .then(function (){
            self.msg('sys', '工作目录：<code>' + ws + '</code>（任务包.md + skills/' + V3Skills.list.length + ' 个技能' + (ctx.files.length ? ' + ' + ctx.files.map(function (f){ return f.name; }).join(' + ') : '') + '）');
            /* zcode 等探测到内核文件时走 node <内核> 启动（_resolved 由 detect() 生成） */
            var program = (cli._resolved && cli._resolved.program) || cli.cmd;
            var argv = (cli._resolved && cli._resolved.args) || (cli.args || []);
            var args = argv.map(function (a){ return a.replace('{prompt}', packMd); });
            var useStdin = cli.useStdin !== false && argv.indexOf('{prompt}') === -1;
            self.log('START run=' + selfRun.id + ' kind=cli client=' + cli.name + ' program=' + program + ' cwd=' + ws);
            return V3Bridge.agentSpawn({
              id: selfRun.id, program: program, args: args, cwd: ws, useStdin: useStdin, prompt: packMd
            });
          });
      }).catch(function (e){
        done('err', 'CLI 启动失败：<code>' + v3AgentEscapeHTML(String(e && e.message || e)) + '</code>（检查 设置 ⚙️ 里的命令与路径）');
      });
      return;
    }

    /* HTTP：多轮 —— messages 数组随轮次增长；系统提示只在首条系统消息 */
    var msgs = run.messages || [];
    if (isFollowUp){
      msgs.push({ role: 'user', content: extra });
      run.prompt.skillIds = run.prompt.skillIds.concat(extraSkillIds.filter(function (id){ return run.prompt.skillIds.indexOf(id) === -1; }));
    }
    run.messages = msgs;
    var ep = v3AgentNormalizeChatEndpoint(cli.endpoint, run.apiFormat);
    if (ep !== cli.endpoint) this.msg('sys', '端点自动补全：<code>' + v3AgentEscapeHTML(ep) + '</code>（原配置只填了基础地址，已按 OpenAI 协议补 /chat/completions）');
    /* 上下文容量检测与自动压缩（请求前）：>80k 字时截断首条上下文段 / 丢最旧轮次 */
    var cres = v3AgentCompressMessages(run.messages, 80000);
    run.messages = cres.msgs;
    if (cres.notes.length) this.msg('sys', '上下文容量：' + cres.notes.join('；'));
    var ctxLen = (run.messages || []).reduce(function (a, m){ return a + (m.content || '').length; }, 0);
    /* ZCode 伪装：本会话首次发送时生成稳定会话 ID（UUID）并随 run 持久化，续聊复用（同一 run = 同一对话） */
    var zSid = null;
    if (cli.zcodeGo){
      if (!run.sessionId) run.sessionId = v3AgentUuid();
      zSid = run.sessionId;
    }
    this.log('START run=' + run.id + ' turn=' + run.turns + ' kind=http client=' + cli.name + ' endpoint=' + ep
      + ' model=' + (cli.model || '') + ' skill=' + run.skillId + ' effort=' + (cli.effort || '-')
      + ' zcode_sid=' + (zSid || '-')
      + ' user_len=' + ((run.prompt && run.prompt.user) || '').length + ' sys_len=' + ((run.prompt && run.prompt.system) || '').length
      + ' ctx_len=' + ctxLen);
    V3Bridge.agentHttp({
      id: run.id, endpoint: ep, model: cli.model, key: cli.key,
      effort: cli.effort || null, extraBody: cli.extraBody || null,
      apiFormat: run.apiFormat || 'openai',
      messages: msgs,
      system: run.prompt.system || '',
      zcodeSession: zSid,
      userAgent: cli.userAgent || null,
      temperature: (cli.temperature === undefined || cli.temperature === '') ? null : Number(cli.temperature)
    }, function (evt){
      if (evt.kind === 'reason') onReason(evt.data);
      else if (evt.kind === 'chunk') onChunk(evt.data);
      else if (evt.kind === 'done'){
        if (!run.output) onChunk(run.reasoning ? '🤔（模型只输出了思考过程，没有正式回复）\n\n' + run.reasoning : '（空响应）');
        msgs.push({ role: 'assistant', content: (run.output.split('\n\n---\n\n').pop() || '') });
        run.messages = msgs;
        done('ok');
      }
      else if (evt.kind === 'error'){ done('err', '请求失败：<code>' + v3AgentEscapeHTML(evt.data) + '</code>'); }
    });
  },

  findRun: function(id){
    var run = null;
    (this.st.runs || []).forEach(function (x){ if (x.id === id) run = x; });
    return run;
  },

  /* 删除单个对话（运行中的先取消再删）；删当前查看的会话则回到新任务视图 */
  deleteRun: function (id){
    var wasLive = this.liveId === id;
    var run = this.findRun(id);
    this.st.runs = (this.st.runs || []).filter(function (x){ return x.id !== id; });
    if (wasLive){
      if (this._tick){ clearInterval(this._tick); this._tick = null; }
      if (run && run.status === 'run' && typeof V3Bridge !== 'undefined'){
        if (V3Bridge.mode === 'tauri') V3Bridge.agentCancel(id);
        else if (V3Bridge.agentHttpAbort) V3Bridge.agentHttpAbort(id);
      }
      this.liveId = null;
      this.busy = false;
      this.el('v3agStop').style.display = 'none';
      this.el('v3agTitle').textContent = '新任务';
      this.el('v3agMeta').textContent = '';
      this.showWelcome();
    }
    this.save(); this.renderRuns(); this.renderStatus();
    if (typeof showToast === 'function') showToast('已删除对话');
  },

  /* 清空全部任务记录（运行中的先取消） */
  clearRuns: function (){
    if (this._tick){ clearInterval(this._tick); this._tick = null; }
    if (this.busy && this.liveId && typeof V3Bridge !== 'undefined'){
      if (V3Bridge.mode === 'tauri') V3Bridge.agentCancel(this.liveId);
      else if (V3Bridge.agentHttpAbort) V3Bridge.agentHttpAbort(this.liveId);
    }
    this.liveId = null;
    this.busy = false;
    this.st.runs = [];
    this.el('v3agStop').style.display = 'none';
    this.el('v3agTitle').textContent = '新任务';
    this.el('v3agMeta').textContent = '';
    this.save(); this.showWelcome(); this.renderRuns(); this.renderStatus();
    if (typeof showToast === 'function') showToast('已清空任务记录');
  },

  stop: function(){
    if (!this.busy || !this.liveId) return;
    var self = this;
    var run = this.findRun(this.liveId);
    if (typeof V3Bridge !== 'undefined'){
      if (V3Bridge.mode === 'tauri') V3Bridge.agentCancel(this.liveId);
      else if (V3Bridge.agentHttpAbort) V3Bridge.agentHttpAbort(this.liveId);   /* web 流可取消 */
    }
    if (this._tick){ clearInterval(this._tick); this._tick = null; }   /* 停止后计时器不再空转 */
    if (run && run.status === 'run'){
      run.status = 'err';
      this.log('END run=' + run.id + ' client=' + (run.clientName || run.client) + ' status=stop(手动) ms=' + (Date.now() - run.ts)
        + ' out_len=' + (run.output || '').length + ((run.reasoning) ? ' reason_len=' + run.reasoning.length : ''));
      this.msg('sys', '已手动停止。直接输入可继续本对话（上下文保留），或点「＋ 新任务」另起。');
      this.busy = false;
      this.el('v3agStop').style.display = 'none';
      this.save(); this.renderRuns(); this.renderStatus();
    }
  },

  copyPack: function(){
    var r = this.findRun(this.liveId);
    var text = r && r.prompt ? ('# ' + r.title + '\n\n' + r.prompt.user + '\n\n---\n\n## 评审依据（规范红线/宪章/技能）\n\n' + (r.prompt.system || '')) : '';
    if (!text) return;
    if (typeof copyText === 'function'){ copyText(text); if (typeof showToast === 'function') showToast('任务包已复制（含上下文与技能全文）'); }
  },

  /* ---------- 一键应用回画布 ---------- */
  /* 候选源（按优先级）：CLI 工作目录的 阵型.json / pipeline_片段.json > 聊天输出中的 JSON 块 */
  applySources: function (run){
    var out = [];
    if (run && run.cwd && typeof V3Bridge !== 'undefined' && V3Bridge.readText){
      ['阵型.json', 'pipeline_片段.json'].forEach(function (fn){
        out.push({ label: '工作目录/' + fn, text: function(){ return V3Bridge.readText(run.cwd + '/' + fn); } });
      });
    }
    if (run && run.output){
      var blocks = [];
      /* 末块围栏未闭合也能截取（(?:```|\s*$)） */
      var re = /```(?:json|jsonc)?[^\n]*\n([\s\S]*?)(?:```|\s*$)/g, m;
      while ((m = re.exec(String(run.output))) !== null){
        var b = m[1].trim();
        if (b && blocks.indexOf(b) === -1) blocks.push(b);
      }
      var t = String(run.output).trim();
      if (t.indexOf('{') === 0 && blocks.indexOf(t) === -1) blocks.push(t);
      /* 无围栏扫描：LLM 输出经常丢 ``` 围栏（如裸 "deck2": [...]），字符串感知提取补漏 */
      v3AgentScanJSON(run.output).forEach(function (seg){
        var hit = blocks.some(function (b){ return b === seg || b.indexOf(seg) !== -1 || seg.indexOf(b) !== -1; });
        if (!hit) blocks.push(seg);
      });
      blocks.forEach(function (b, i){
        out.push({ label: '输出中的第 ' + (i + 1) + ' 个 JSON 块', text: function(){ return Promise.resolve(b); } });
      });
    }
    return out;
  },

  /* 合并应用：先分类所有候选；完整文档取「最后一次出现的」（最新回复优先，防止套用陈旧状态），顺序覆盖按时间序后写者胜 */
  applyClassified: function (cands){
    var fragNodes = {}, orderSets = [], base = null;
    var self = this;
    var typed = cands.map(function (c){
      var v = c.value, t = null;
      if (v && v.version === 2 && v.boards) t = 'v2';
      else if (v && typeof v === 'object' && (v.option || Object.keys(v).some(function (k){ return k === '卡1种第1次坐标'; }))) t = 'frame';
      else if (v && typeof v === 'object' && !Array.isArray(v) && v3AgentIsNodeMap(v)) t = v3AgentHasJudge(v) ? 'pipeline' : 'frag';
      else if (v3AgentIsOrderItems(v)) t = 'order';
      else if (v && typeof v === 'object' && !Array.isArray(v) && (v3AgentIsOrderItems(v.deck1) || v3AgentIsOrderItems(v.deck2))) t = 'orderObj';
      else if (v && typeof v === 'object' && v.pipeline && v3AgentIsNodeMap(v.pipeline)) t = 'pack';
      self.log('APPLY 识别 src=' + c.label + ' → ' + (t || 'other（忽略）'));
      return { label: c.label, value: v, type: t };
    });
    for (var i = typed.length - 1; i >= 0; i--){
      var x = typed[i];
      if (x.type === 'v2' || x.type === 'frame' || x.type === 'pipeline' || x.type === 'pack'){ base = x; break; }
    }
    typed.forEach(function (x){
      if (x === base) return;
      if (x.type === 'order') orderSets.push({ deck: v3AgentDetectDeck(x.value), items: x.value, label: x.label });
      else if (x.type === 'orderObj'){
        if (v3AgentIsOrderItems(x.value.deck1)) orderSets.push({ deck: 'deck1', items: x.value.deck1, label: x.label });
        if (v3AgentIsOrderItems(x.value.deck2)) orderSets.push({ deck: 'deck2', items: x.value.deck2, label: x.label });
      } else if (x.type === 'frag') Object.assign(fragNodes, x.value);
    });
    var applied = [];
    /* 基础文档（完整结构优先） */
    if (base && base.type === 'v2'){
      v2ImportJSON(JSON.stringify(base.value));
      applied.push('v2 阵型 JSON（' + base.label + '，取最新完整文档）');
    } else if (base && base.type === 'frame'){
      var fr = v2ImportFrameJSON(JSON.stringify(base.value));
      if (fr.ok) applied.push('官方通用框架 JSON（' + base.label + '，取最新完整文档）');
      else self.log('APPLY 基础失败 frame：' + fr.err);
    } else if (base && (base.type === 'pipeline' || base.type === 'pack')){
      var nodes = base.type === 'pack' ? base.value.pipeline : base.value;
      var merged = Object.assign({}, nodes, fragNodes);   /* 片段覆盖同名节点 */
      var A = v2ImportAnalyze([{ name: 'agent_pipeline.json', text: JSON.stringify(merged) }], null);
      if (A && A.ok && v2ImportApply(A, (typeof V2 !== 'undefined' && V2.world) || 'custom'))
        applied.push('pipeline 全链 ' + A.nNodes + ' 节点（' + base.label + (Object.keys(fragNodes).length ? ' + ' + Object.keys(fragNodes).length + ' 个片段节点' : '') + '）');
      else return { msg: '应用失败：pipeline 解析不通过——' + ((A && A.warns) || []).join('；') };
    } else if (Object.keys(fragNodes).length && v3AgentHasJudge(fragNodes)){
      var A2 = v2ImportAnalyze([{ name: 'agent_pipeline.json', text: JSON.stringify(fragNodes) }], null);
      if (A2 && A2.ok && v2ImportApply(A2, (typeof V2 !== 'undefined' && V2.world) || 'custom')) applied.push('输出片段合并的全链');
    }
    /* 顺序覆盖（deck 替换；无基础文档时先压撤销栈） */
    if (orderSets.length && !applied.length && typeof v2UndoStack !== 'undefined' && typeof v2SerializeAll === 'function')
      v2UndoStack.push(v2SerializeAll());
    orderSets.forEach(function (o){
      if (typeof V2 === 'undefined' || !V2.order) return;
      V2.order[o.deck] = JSON.parse(JSON.stringify(o.items));
      applied.push(o.deck + ' 顺序替换为 ' + o.items.length + ' 步（' + o.label + '）');
    });
    if (orderSets.length && typeof save === 'function'){ save(); if (typeof v2RefreshPanels === 'function') v2RefreshPanels(); }
    if (applied.length) return { msg: '✅ 已应用：' + applied.join('；') + '（可 Ctrl+Z 撤销）' };
    if (Object.keys(fragNodes).length && !base)
      return { msg: '应用失败：输出只有 pipeline 节点片段（缺全链上下文，画布无法反推）。请让 Agent「把完整 pipeline 或修改后的 v2 阵型 JSON 写入 工作目录/阵型.json」后重试。' };
    return { msg: '应用失败：候选里没有可识别的布阵 JSON（详见 agent_run.log）' };
  },

  applyToCanvas: function (){
    var r = this.findRun(this.liveId);
    if (!r){ if (typeof showToast === 'function') showToast('先选择一个任务'); return; }
    var self = this;
    var srcs = this.applySources(r);
    if (!srcs.length){ if (typeof showToast === 'function') showToast('该任务无可应用内容（无工作目录文件，输出里也没有 JSON）'); return; }
    Promise.all(srcs.map(function (s){ return s.text().catch(function(){ return null; }); })).then(function (texts){
      var cands = [];
      texts.forEach(function (t, i){
        if (t == null){ self.log('APPLY 跳过 src=' + srcs[i].label + '：读取失败'); return; }
        var p = v3AgentLooseParse(t);
        if (!p.ok){ self.log('APPLY 跳过 src=' + srcs[i].label + '：不是可解析的 JSON'); return; }
        cands.push({ label: srcs[i].label, value: p.value });
      });
      var res = self.applyClassified(cands);
      if (typeof showToast === 'function') showToast(res.msg);
      self.log('APPLY run=' + r.id + ' → ' + res.msg);
    });
  },

  openWs: function(){
    var r = this.findRun(this.liveId);
    if (!r || !r.cwd){
      if (typeof showToast === 'function') showToast('该任务没有工作目录（HTTP 客户端或浏览器模式）');
      return;
    }
    if (typeof V3Bridge !== 'undefined' && V3Bridge.mode === 'tauri') V3Bridge.openPath(r.cwd);
  },

  /* ---------- 设置：客户端管理 ---------- */
  editId: null,

  renderSettings: function(){
    var self = this;
    var box = this.el('v3setClients');
    if (!box) return;
    box.innerHTML = this.st.clients.map(function (c){
      var detail = c.kind === 'cli' ? (c.cmd + ' ' + (c.args || []).join(' ')) : c.endpoint + ' · ' + (c.model || '');
      var dot = c.kind === 'http' ? (c.endpoint ? 'ok' : 'err') : (c._found ? 'ok' : 'err');
      return '<div class="v3set-cli"><span class="dot ' + dot + '"></span><span>' + c.name + '</span>'
        + '<span class="kind">' + (c.kind === 'cli' ? 'CLI' : (c.apiFormat === 'anthropic' ? 'HTTP·A' : 'HTTP')) + '</span>'
        + '<span class="detail" title="' + detail + '">' + detail + '</span>'
        + '<span class="detail">' + (c.kind === 'cli' ? (c._found || 'PATH 未找到') : (c.key ? '已配 key' : '无 key')) + '</span>'
        + '<span class="ops"><button data-edit="' + c.id + '">编辑</button><button data-del="' + c.id + '">删除</button></span></div>';
    }).join('');
    box.querySelectorAll('[data-edit]').forEach(function (b){
      b.addEventListener('click', function(){ self.editOpen(b.dataset.edit); });
    });
    box.querySelectorAll('[data-del]').forEach(function (b){
      b.addEventListener('click', function(){
        self.st.clients = self.st.clients.filter(function (c){ return c.id !== b.dataset.del; });
        if (self.st.active === b.dataset.del && self.st.clients.length) self.st.active = self.st.clients[0].id;
        self.save(); self.renderSettings(); self.renderClients();
      });
    });
    var wsEl = this.el('v3setWs');
    if (wsEl && this.st.wsRoot) wsEl.textContent = this.st.wsRoot;
    this.renderPresetSelect();
  },

  renderPresetSelect: function(){
    var sel = this.el('v3sePreset');
    if (!sel || !sel.options || sel.options.length > 1 || sel._loading) return;
    sel._loading = true;
    function label(p){
      return p.name + ' · ' + (p.model_id || '') + (p.api_format === 'anthropic' ? '（Anthropic）' : '（OpenAI 兼容）');
    }
    function group(title, list){
      if (!list || !list.length) return '';
      return '<optgroup label="' + title + '">' + list.map(function (p){
        return '<option value="' + p.id + '" title="' + v3AgentEscapeHTML((p.models || []).slice(0, 6).join(', ')) + '">' + label(p) + '</option>';
      }).join('') + '</optgroup>';
    }
    var fetchJson = function (url){
      return fetch(url, { cache: 'no-store' }).then(function (r){ return r.ok ? r.json() : null; }).catch(function (){ return null; });
    };
    Promise.all([fetchJson('agent_model/preset_models.json'), fetchJson('agent_model/zcode_catalog.json')]).then(function (rs){
      var builtin = (rs[0] && rs[0].presets) || [];
      var zc = (rs[1] && rs[1].presets) || [];
      if (!builtin.length && !zc.length) return;
      var html = '<option value="">从预设添加…</option>'
        + group('内置预设', builtin)
        + group('ZCode 目录（智谱维护，双协议端点）', zc);
      sel.innerHTML = html;
      sel._presets = builtin.concat(zc);
    }).finally(function (){ sel._loading = false; });
  },

  editOpen: function(id){
    var self = this;
    this.editId = id || null;
    var box = this.el('v3setEdit');
    if (!box) return;
    box.style.display = '';
    var c = id ? this.client(id) : null;
    this.el('v3seName').value = c ? c.name : '';
    this.el('v3seKind').value = c ? c.kind : 'http';
    this.el('v3seCmd').value = c && c.kind === 'cli' ? c.cmd : '';
    this.el('v3seArgs').value = c && c.kind === 'cli' ? (c.args || []).join(' ') : '';
    this.el('v3seEndpoint').value = c && c.kind === 'http' ? c.endpoint : '';
    this.el('v3seModel').value = c && c.kind === 'http' ? (c.model || '') : '';
    this.el('v3seKey').value = c && c.kind === 'http' ? (c.key || '') : '';
    this.el('v3seFormat').value = c && c.kind === 'http' ? (c.apiFormat || 'openai') : 'openai';
    this.el('v3seTemp').value = c && c.kind === 'http' && c.temperature !== undefined ? c.temperature : '';
    this.el('v3seEffort').value = c && c.kind === 'http' ? (c.effort || '') : '';
    this.el('v3seExtra').value = c && c.kind === 'http' && c.extraBody ? JSON.stringify(c.extraBody) : '';
    this.el('v3seZcode').checked = !!(c && c.kind === 'http' && c.zcodeGo);
    this.el('v3seUserAgent').value = c && c.kind === 'http' ? (c.userAgent || '') : '';
    this.syncKind();
    this.el('v3seKind').onchange = function(){ self.syncKind(); };
    this.el('v3seProbe').onclick = function(){
      var n = self.el('v3seCmd').value.trim();
      if (!n) return;
      V3Bridge.whichClient(n).then(function (p){
        if (typeof showToast === 'function') showToast(p ? ('已找到：' + p) : 'PATH 中未找到 ' + n + '，可填绝对路径');
      });
    };
    var presetSel = this.el('v3sePreset');
    if (presetSel) presetSel.onchange = function(){
      var p = (presetSel._presets || []).filter(function (x){ return x.id === presetSel.value; })[0];
      if (!p) return;
      if (!self.el('v3seName').value.trim()) self.el('v3seName').value = p.name;
      self.el('v3seKind').value = 'http';
      self.el('v3seEndpoint').value = p.api_url || '';
      self.el('v3seModel').value = p.model_id || '';
      self.el('v3seFormat').value = p.api_format || 'openai';
      self.el('v3seTemp').value = (p.generation && p.generation.temperature !== undefined) ? p.generation.temperature : '';
      self.syncKind();
    };
    this.el('v3seSave').onclick = function(){
      var kind = self.el('v3seKind').value;
      var obj = c || { id: 'c' + Date.now() };
      obj.kind = kind;
      obj.name = self.el('v3seName').value.trim() || (kind === 'cli' ? 'CLI 客户端' : 'HTTP 客户端');
      if (kind === 'cli'){
        obj.cmd = self.el('v3seCmd').value.trim();
        obj.args = self.el('v3seArgs').value.trim() ? self.el('v3seArgs').value.trim().split(/\s+/) : [];
        obj.useStdin = (obj.args || []).indexOf('{prompt}') === -1;
        obj._found = null;
      } else {
        obj.endpoint = self.el('v3seEndpoint').value.trim();
        obj.model = self.el('v3seModel').value.trim();
        obj.key = self.el('v3seKey').value.trim();
        obj.apiFormat = self.el('v3seFormat').value || 'openai';
        var t = self.el('v3seTemp').value;
        obj.temperature = t === '' ? undefined : Number(t);
        obj.effort = self.el('v3seEffort').value || undefined;
        var ex = self.el('v3seExtra').value.trim();
        if (ex){
          try { obj.extraBody = JSON.parse(ex); }
          catch (e2){ obj.extraBody = undefined; if (typeof showToast === 'function') showToast('额外参数不是合法 JSON，已忽略'); }
        } else obj.extraBody = undefined;
        obj.zcodeGo = self.el('v3seZcode').checked ? true : undefined;
        obj.userAgent = self.el('v3seUserAgent').value.trim() || undefined;
      }
      if (!self.client(obj.id)) self.st.clients.push(obj);
      self.st.active = obj.id;
      self.editId = null;
      box.style.display = 'none';
      self.save(); self.renderSettings(); self.renderClients(); self.renderStatus();
      self.detect([obj]);
    };
    this.el('v3seCancel').onclick = function(){ box.style.display = 'none'; };
  },

  syncKind: function(){
    var k = this.el('v3seKind').value;
    document.querySelectorAll('#v3setEdit [data-kind]').forEach(function (r){
      r.style.display = (r.dataset.kind === k) ? '' : 'none';
    });
  },

  detect: function(only){
    var self = this;
    if (typeof V3Bridge === 'undefined' || V3Bridge.mode !== 'tauri') return Promise.resolve();
    var list = only || this.st.clients.filter(function (c){ return c.kind === 'cli'; });
    function norm(s){ return String(s || '').toLowerCase().replace(/\\/g, '/'); }
    return Promise.all(list.map(function (c){
      /* 先 PATH（where/which），再探测 profile.probe 里的已知安装路径（如 zcode 内核 zcode.cjs） */
      var chain = V3Bridge.whichClient(c.cmd);
      if (c.probe && c.probe.length){
        chain = c.probe.reduce(function (acc, p){
          return acc.then(function (f){ if (f) return f; return V3Bridge.whichClient(p); });
        }, chain);
      }
      return chain.then(function (f){
        if (f){
          var probed = (c.probe || []).some(function (p){ return norm(p) === norm(f); });
          c._found = f;
          c._resolved = probed ? { program: 'node', args: [f].concat(c.args || []) } : null;
        } else {
          c._found = null;
          c._resolved = null;
        }
      });
    })).then(function (){
      self.save(); self.renderClients(); self.renderSettings();
    });
  },

  init: function(){
    var self = this;
    this.load();
    var send = this.el('v3agSend');
    var input = this.el('v3agInput');
    if (send) send.addEventListener('click', function(){ self.send(); });
    if (input){
      input.addEventListener('keydown', function (e){
        if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); self.send(); }
      });
      input.addEventListener('input', function(){
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 140) + 'px';
      });
      input.placeholder = '给智能体发消息…（Enter 发送，Shift+Enter 换行；支持 @体检 @阵型 @检查 等引用）';
    }
    var stop = this.el('v3agStop');
    if (stop) stop.addEventListener('click', function(){ self.stop(); });
    var cp = this.el('v3agCopy');
    if (cp) cp.addEventListener('click', function(){ self.copyPack(); });
    var ws = this.el('v3agWs');
    if (ws) ws.addEventListener('click', function(){ self.openWs(); });
    var ap = this.el('v3agApply');
    if (ap) ap.addEventListener('click', function(){ self.applyToCanvas(); });
    var nw = this.el('v3agNew');
    if (nw) nw.addEventListener('click', function(){
      self.liveId = null;
      self.el('v3agTitle').textContent = '新任务';
      self.el('v3agMeta').textContent = '';
      self.el('v3agStop').style.display = 'none';
      self.showWelcome(); self.renderRuns();
      if (input) input.focus();
    });
    var clr = this.el('v3agClear');
    if (clr) clr.addEventListener('click', function(){
      if (!self.st.runs.length){ if (typeof showToast === 'function') showToast('暂无任务记录'); return; }
      if (confirm('清空全部任务记录（含输出与思考流）？此操作不可恢复。')) self.clearRuns();
    });
    var ctxT = this.el('v3agCtxToggle');
    var ctxBox = this.el('v3agCtx');
    if (ctxT && ctxBox) ctxT.addEventListener('click', function(){
      var collapsed = ctxBox.classList.toggle('collapsed');
      ctxT.textContent = collapsed ? '附带上下文 ▸' : '附带上下文 ▾';
    });
    var cli = this.el('v3agClient');
    if (cli) cli.addEventListener('change', function(){ self.st.active = cli.value; self.save(); self.renderStatus(); });
    var task = this.el('v3agTask');
    if (task) task.addEventListener('change', function(){ self.applyTaskDefaults(task.value); });

    var sd = this.el('v3setDetect');
    if (sd) sd.addEventListener('click', function(){
      self.detect().then(function(){
        if (typeof showToast === 'function') showToast('探测完成（绿=找到，红=未找到）');
      });
    });
    var sa = this.el('v3setAdd');
    if (sa) sa.addEventListener('click', function(){ self.editOpen(null); });
    var wso = this.el('v3setWsOpen');
    if (wso) wso.addEventListener('click', function(){
      if (self.st.wsRoot && typeof V3Bridge !== 'undefined' && V3Bridge.mode === 'tauri') V3Bridge.openPath(self.st.wsRoot);
    });

    this.renderClients();
    this.renderRuns();
    this.showWelcome();
    this.renderSettings();
    this.detect();
    /* 技能库加载 → 任务下拉动态渲染 */
    V3Skills.load().then(function(){ self.renderTasks(); });
    if (typeof V3Bridge !== 'undefined' && V3Bridge.mode === 'tauri'){
      V3Bridge.appInfo().then(function (info){
        if (info && info.wsRoot){ self.st.wsRoot = info.wsRoot; self.save(); self.renderSettings(); }
        var about = self.el('v3setAbout');
        if (about && info) about.innerHTML = '无尽布阵工具 v4（' + (info.version || '4.2.0') + '）· Tauri 2 桌面壳 · '
          + '技能库：resource/agent_skill/（用户可在 %APPDATA%/com.mpz.wujinbz.v3beta/agent_ws 同级自建技能目录参考）；'
          + '数据存本机 WebView localStorage（不随程序传播）。';
      });
    } else {
      var about2 = this.el('v3setAbout');
      if (about2) about2.innerHTML = '无尽布阵工具 v4 · 浏览器模式（无 Tauri 桌面壳）：布阵功能完整；'
        + 'CLI 型 Agent 不可用（转手动任务包），HTTP 型 Agent 受 CORS 限制。双击 dist_shell 的 exe 或 cargo tauri dev 获得完整能力。';
    }
  }
};
