/* 批 A 验收（A6.3）：现网 none 部署件 ⇄ 新生成器导出 的差异清单
 *
 * 做法：把 deployed/YS_bh2.json（pipeline）+ bh2_wj.json（task 片段）当"画布真相"，
 * 经 45_import 的导入器还原成画布状态（与预设/布阵页同一条逆向链），再用当前生成器
 * 重新导出，逐节点比对。
 *
 * 期望差异（2026-10-10 批 A 唯一允许的差异集）：
 *   + 新增 4 节点：监控开关 / 重置计数 / 重置到1 / 计步
 *   ~ 改动 2 节点：识别开始战斗（next: 判断是否进入关内 → 计步；action 已是 Click）
 *                 计步_补给（DoNothing → Custom fx_counter，Q1 恢复计数供监控窗口）
 *   其余节点必须逐字段一致；任何额外差异 = 生成器没对齐，必须查清。
 *
 * 用法: node tools/none_a6_diff.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.join(__dirname, '..');
const SRC = path.join(REPO, 'src', 'core', 'src', 'js');
const WS = 'E:/app/backup_mpz_scripts/冰河无尽';
const DEP = path.join(WS, 'deployed');

/* ---- DOM/全局桩（同 fast_mode_golden.js） ---- */
function fakeEl(){
  var el = { value: '', checked: false, textContent: '', innerHTML: '', style: {}, dataset: {},
    _ls: {}, classList: { add(){}, remove(){}, toggle(){} },
    addEventListener(t, fn){ (el._ls[t] = el._ls[t] || []).push(fn); },
    fire(t, ev){ (el._ls[t] || []).forEach(function(fn){ fn(ev || { target: el }); }); },
    appendChild(){}, removeChild(){}, getContext(){ return { clearRect(){}, fillRect(){}, fillText(){}, fillStyle: '', font: '' }; },
    clientWidth: 760, width: 760, height: 34, closest(){ return null; },
    querySelector(){ return null; }, remove(){}, cloneNode(){ return fakeEl(); } };
  return el;
}
const cache = {};
global.document = { getElementById(id){ if (id === 'btnResize') return null; if (!cache[id]) cache[id] = fakeEl(); return cache[id]; },
  querySelector(){ return null; }, querySelectorAll(){ return []; }, createElement(){ return fakeEl(); },
  addEventListener(){}, body: { appendChild(){}, removeChild(){} } };
global.localStorage = { _m: {}, getItem(k){ return this._m[k] || null; }, setItem(k, v){ this._m[k] = v; }, removeItem(k){ delete this._m[k]; } };
global.window = global;
global.showToast = function(){}; global.copyText = function(){};
global.confirm = function(){ return true; }; global.prompt = function(){ return ''; };
global.grid = []; global.slotNames = []; global.rows = 5; global.cols = 9;
global.subSlotsOn = false; global.fxOn = true; global.splitOn = false;
global.split = { early: null, late: null }; global.plants = { base: [], vine: [], merge: [], tool: [], ops: [] };
global.selected = null;
global.curGrid = function(){ return global.grid; };
['save', 'renderGrid', 'applyBrush', 'initGrid', 'buildAllChips', 'renderSlots', 'renderSplitUI', 'updateStatus', 'ensurePlant']
  .forEach(function(f){ global[f] = function(){}; });
global.load = function(){ return false; }; global.defaultPlants = function(){ return {}; };
global.exportCompact = function(){ return ''; }; global.splitCompact = function(){ return ''; }; global.exportFull = function(){ return ''; };
/* 简化版 v1 parseImport（与 test_v2.js 同源；画布导入要它把棋盘 compact 解回 grid） */
global.parseImport = function(text){
  const m = String(text || '').match(/^(\d+)x(\d+) 布阵:\s*(.*)$/);
  if (!m) return null;
  const nc = +m[1], nr = +m[2], rowsTxt = m[3].split('|'), g = [];
  for (let r = 0; r < nr; r++){
    const parts = (rowsTxt[r] || '').split(','), row = [];
    for (let c = 0; c < nc; c++){
      const t = (parts[c] || '-').trim();
      const cell = { base: '', merge: '', vine: '', tile: false, ops: [] };
      if (t === '-' || t === '·' || t === '瓷' || t === '瓷砖'){ if (t !== '-') cell.tile = true; row.push(cell); continue; }
      let tt = t;
      if (/[\[【]瓷(?:砖)?[\]】]/.test(tt)){ cell.tile = true; tt = tt.replace(/[\[【]瓷(?:砖)?[\]】]/g, '').trim(); }
      const paren = /^(.+?)[（(](.+?)[)）]$/.exec(tt);
      if (paren){ cell.base = paren[1].trim(); cell.vine = paren[2].trim(); row.push(cell); continue; }
      const pp = tt.split(/\+/);
      if (pp.length >= 2){ cell.base = pp[0]; cell.merge = pp[1]; } else cell.base = tt;
      row.push(cell);
    }
    g.push(row);
  }
  return { cols: nc, rows: nr, grid: g };
};

const files = ['10_state_v2.js','15_route.js','20_order.js','25_boss.js','30_presets_data.js','31_official_data.js','35_presets.js','40_export.js','45_import.js','47_touch.js','48_server.js','48b_deploy.js','49_agent_counter.js','50_checks.js'];
let code = '';
files.forEach(f => { code += fs.readFileSync(path.join(SRC, f), 'utf8') + '\n'; });
vm.runInThisContext(code, { filename: 'none_a6_bundle.js' });

let pass = 0, fail = 0;
function T(name, ok){ if (ok){ pass++; console.log('  ✓ ' + name); } else { fail++; console.log('  ✗ ' + name); } }
/* 规范化序列化（键序无关）：部署件与生成器的键序不同，直比 JSON.stringify 会报假差异 */
function canon(o){
  if (Array.isArray(o)) return '[' + o.map(canon).join(',') + ']';
  if (o && typeof o === 'object'){
    return '{' + Object.keys(o).sort().map(function(k){ return JSON.stringify(k) + ':' + canon(o[k]); }).join(',') + '}';
  }
  return JSON.stringify(o);
}

/* ---- 0) 反膨胀：把部署件里 patchCheckFallbacks 自动补的金卡回退级联还原成画布态 ----
 * 生成器的回退级联只在「父节点 next 恰好 1 项」时补（父节点已有显式 alt 就不动）。
 * 部署件里已是补完的形态，直接喂给导入器 → 会被当"显式 alt"压平，重导出后级联变短。
 * 所以先按同一条规则算出级联 C：若 next 恰好等于 C，说明整条都是自动补的 → 还原成 [next[0]]。 */
function unexpandCascade(nodes){
  function partnerOf(k){
    var nd = nodes[k] || {}, nx = nd.next || [];
    if (nd.recognition !== 'ColorMatch' || nd.action !== 'Swipe' || nx.length !== 1) return null;
    var y = nodes[nx[0]];
    if (!y || y.action !== 'Swipe' || y.end !== nd.end) return null;
    return y;
  }
  function cascadeOf(k){
    var cands = [k], cur = k, guard = 0;
    while (guard++ < 24){
      var y = partnerOf(cur);
      if (!y) break;
      var nxt = (y.next || [])[0];
      if (!nxt || cands.indexOf(nxt) > -1) break;
      cands.push(nxt);
      if (!partnerOf(nxt)) break;
      cur = nxt;
    }
    return cands;
  }
  var out = 0;
  Object.keys(nodes).forEach(function(k){
    var nx = (nodes[k] || {}).next || [];
    if (nx.length < 2) return;
    if (JSON.stringify(nx) === JSON.stringify(cascadeOf(nx[0]))){ nodes[k].next = [nx[0]]; out++; }
  });
  return out;
}

/* ---- 1) 现网部署件 → 画布（导入器逆向） ---- */
const pipeTxt = fs.readFileSync(path.join(DEP, 'YS_bh2.json'), 'utf8');
const taskTxt = fs.readFileSync(path.join(DEP, 'bh2_wj.json'), 'utf8');
const deployedOrig = JSON.parse(pipeTxt);          /* 比较基准：现网件原样 */
const deployed = JSON.parse(pipeTxt);              /* 反膨胀副本：只喂导入器 */
const unexp = unexpandCascade(deployed);
console.log('== 准备：部署件反膨胀（金卡回退级联 → 画布单项） ==');
console.log('  还原 ' + unexp + ' 个节点的自动级联（对照基准仍用现网件原样）');
const A = v2ImportAnalyze([{ name: 'YS_bh2.json', text: JSON.stringify(deployed) }, { name: 'bh2_wj.json', text: taskTxt }], 'bh2_');
console.log('\n== 导入现网部署件 ==');
console.log('  ok=' + A.ok + ' 前缀=' + A.prefix + ' 节点=' + A.nNodes + ' 模式=' + A.route.mode +
  ' deck1=' + A.counts.d1 + '步 boss=' + A.counts.boss + '步');
A.warns.forEach(function(w){ console.log('  ⚠ ' + w); });
T('导入成功且识别为 none 模式', A.ok && A.route.mode === 'none' && A.prefix === 'bh2_');
v2ImportApply(A, 'binghe');
document.getElementById('v2Prefix').value = 'bh2_';

/* 导入器不还原抛花开关（抛花1/2 被走链成普通种植步）→ 按部署件里的抛花节点补回画布设置：
   落格即 V2.throw.cells、begin 槽位即 V2.throw.slot，然后从顺序里摘掉这两步（生成器会重新插） */
(function(){
  var th = Object.keys(deployed).filter(function(k){ return /^bh2_抛花\d+$/.test(k); }).sort();
  if (!th.length) return;
  V2.order.deck1 = V2.order.deck1.filter(function(it){ return !(it.t === 'plant' && /^抛花\d+$/.test(it.name || '')); });
  V2.throw = { on: true, slot: 1, cells: th.map(function(k){
    var m = /格子(\d)_(\d)$/.exec(deployedOrig[k].end || '');
    return m ? m[1] + '-' + m[2] : '7-1';
  }) };
  console.log('  抛花还原：' + th.join('、') + ' → cells=' + V2.throw.cells.join(',') + ' slot=' + V2.throw.slot);
})();

/* ---- 2) 用当前生成器重新导出 ---- */
const built = v2BuildPipeline();
const task = v2BuildTask(built);
const fresh = built.nodes;
const P = 'bh2_';

/* ---- 3) 逐节点比对（基准 = 现网部署件原样，含金卡回退级联） ---- */
const added = [], removed = [], changed = [];
Object.keys(fresh).forEach(function(k){ if (!(k in deployedOrig)) added.push(k); });
Object.keys(deployedOrig).forEach(function(k){ if (!(k in fresh)) removed.push(k); });
Object.keys(fresh).forEach(function(k){
  if (!(k in deployedOrig)) return;
  if (canon(fresh[k]) !== canon(deployedOrig[k])) changed.push(k);
});
console.log('\n== pipeline 差异清单 ==');
console.log('  新增 ' + added.length + '：' + (added.map(function(k){ return k.slice(P.length); }).join('、') || '无'));
console.log('  移除 ' + removed.length + '：' + (removed.map(function(k){ return k.slice(P.length); }).join('、') || '无'));
changed.forEach(function(k){
  console.log('  ~ ' + k.slice(P.length));
  const f = fresh[k], d = deployedOrig[k];
  const keys = {};
  Object.keys(f).concat(Object.keys(d)).forEach(function(x){ keys[x] = 1; });
  Object.keys(keys).sort().forEach(function(x){
    const fv = canon(f[x]), dv = canon(d[x]);
    if (fv !== dv) console.log('      ' + x + '：部署件 ' + dv + ' → 新导出 ' + fv);
  });
});

const EXP_ADDED = ['监控开关', '重置计数', '重置到1', '计步'].map(function(n){ return P + n; }).sort().join(',');
const EXP_CHANGED = ['识别开始战斗', '计步_补给'].map(function(n){ return P + n; }).sort().join(',');
T('新增节点 = {监控开关, 重置计数, 重置到1, 计步}', added.slice().sort().join(',') === EXP_ADDED);
T('无节点被移除', removed.length === 0);
T('改动节点 = {识别开始战斗, 计步_补给}', changed.slice().sort().join(',') === EXP_CHANGED);
T('其余 ' + (Object.keys(deployed).length - 2) + ' 节点逐字段一致（JSON 全等）', added.length === 4 && changed.length === 2);
T('识别开始战斗：部署件(补丁后) next=判断进入关内 → 新导出 next=计步（计步再回判断入关）',
  JSON.stringify(deployedOrig[P + '识别开始战斗'].next) === JSON.stringify([P + '判断是否进入关内']) &&
  JSON.stringify(fresh[P + '识别开始战斗'].next) === JSON.stringify([P + '计步']) &&
  JSON.stringify(fresh[P + '计步'].next) === JSON.stringify([P + '判断是否进入关内']));
T('计步_补给：DoNothing(补丁 P3) → fx_counter(本次 Q1 恢复)',
  deployedOrig[P + '计步_补给'].action === 'DoNothing' && fresh[P + '计步_补给'].action === 'Custom' &&
  fresh[P + '计步_补给'].custom_action === 'fx_counter');

/* ---- 4) task 侧：补丁 T1/T2/T4/P2 语义等价（不需再打） ---- */
console.log('\n== task 侧（P2/T1/T2/T4 是否退化为空操作） ==');
const depTask = JSON.parse(taskTxt.replace(/^\uFEFF/, ''));
const depOpt = depTask.option || {};
const ourOpt = task.option || {};
T('P2 抛花默认档：现网 cases[0]=Yes ↔ 新导出 cases[0]=Yes',
  depOpt[P + '小关是否抛花'].cases[0].name === 'Yes' && ourOpt[P + '小关是否抛花'].cases[0].name === 'Yes');
const ovTargets = [];
Object.keys(ourOpt).forEach(function(ok){
  const o = ourOpt[ok] || {};
  [o.pipeline_override || {}].concat((o.cases || []).map(function(c){ return c.pipeline_override || {}; })).forEach(function(ov){
    Object.keys(ov).forEach(function(k){
      ovTargets.push(k);
      Object.keys(ov[k].anchor || {}).forEach(function(a2){ ovTargets.push(ov[k].anchor[a2]); });
    });
  });
});
const missing = ovTargets.filter(function(n){ return !(n in fresh) && !v2CheckWhitelisted(n); });
T('T1/T2 选项 override 目标全部存在（现网靠删选项/删引用兜的洞，现由生成器自洽；wujin_ 共享节点走白名单）', missing.length === 0);
if (missing.length) console.log('      缺失：' + missing.join('、'));
T('现网 T2 删掉的「监控窗口」选项在新导出里可用（目标 监控开关 存在）',
  !depOpt[P + '监控窗口'] && !!ourOpt[P + '监控窗口'] && !!fresh[P + '监控开关']);
T('新增「无尽全自动循环」选项（现网 none 件没有）：默认 No、Yes 分支接 重置到1',
  !depOpt[P + '无尽全自动循环'] && !!ourOpt[P + '无尽全自动循环'] &&
  ourOpt[P + '无尽全自动循环'].cases[0].name === 'No' &&
  JSON.stringify(ourOpt[P + '无尽全自动循环'].cases[1].pipeline_override['wujin_确定4'].next) === JSON.stringify([P + '重置到1']) &&
  !!fresh[P + '重置到1']);
const desc = task.task[0].description;
T('T4 简介无 配队2/deck1_first（与补丁后现网一致）',
  desc.indexOf('配队2') === -1 && desc.indexOf('deck1_first') === -1);
console.log('  新简介：' + desc);

console.log('\nRESULT: %d pass, %d fail', pass, fail);
process.exit(fail ? 1 : 0);
