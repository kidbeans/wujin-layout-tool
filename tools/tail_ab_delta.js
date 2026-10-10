/* 铁律 7（两模式导出比对）之 tail 侧：同一画布态下「改动前 vs 改动后」的导出增量
 *
 * 画布态来源：deployed/YS_bh.json（冰河洋芋 103 节点）+ bh_wj.json 经导入器逆向，
 * 反膨胀金卡回退级联后还原（与 none_a6_diff.js 同一套处理）。
 * 两次运行共用同一状态，只换 40_export.js：
 *   ① 默认 = 当前（改后）
 *   ② --old <file> = 改动前的 40_export.js（git show HEAD:... 导出到临时文件）
 * 用法：
 *   node tools/tail_ab_delta.js --out /tmp/after.json
 *   node tools/tail_ab_delta.js --old /tmp/40_export_head.js --out /tmp/before.json
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.join(__dirname, '..');
const SRC = path.join(REPO, 'src', 'core', 'src', 'js');
const DEP = 'E:/app/backup_mpz_scripts/冰河无尽/deployed';
const argv = process.argv.slice(2);
const argOf = n => { const i = argv.indexOf(n); return i > -1 ? argv[i + 1] : null; };
const OLD = argOf('--old');
const OUT = argOf('--out') || path.join(REPO, 'tools', '_tail_ab_out.json');

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
files.forEach(function(f){
  const p2 = (f === '40_export.js' && OLD) ? OLD : path.join(SRC, f);
  code += '/* ==== ' + p2 + ' ==== */\n' + fs.readFileSync(p2, 'utf8') + '\n';
});
vm.runInThisContext(code, { filename: 'tail_ab_bundle.js' });

function canon(o){
  if (Array.isArray(o)) return '[' + o.map(canon).join(',') + ']';
  if (o && typeof o === 'object') return '{' + Object.keys(o).sort().map(function(k){ return JSON.stringify(k) + ':' + canon(o[k]); }).join(',') + '}';
  return JSON.stringify(o);
}
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
  Object.keys(nodes).forEach(function(k){
    var nx = (nodes[k] || {}).next || [];
    if (nx.length < 2) return;
    if (JSON.stringify(nx) === JSON.stringify(cascadeOf(nx[0]))) nodes[k].next = [nx[0]];
  });
}

const pipeTxt = fs.readFileSync(path.join(DEP, 'YS_bh.json'), 'utf8');
const taskTxt = fs.readFileSync(path.join(DEP, 'bh_wj.json'), 'utf8');
const dep = JSON.parse(pipeTxt);
unexpandCascade(dep);
const A = v2ImportAnalyze([{ name: 'YS_bh.json', text: JSON.stringify(dep) }, { name: 'bh_wj.json', text: taskTxt }], 'bh_');
if (!A.ok) { console.error('导入失败：' + A.warns.join('；')); process.exit(2); }
v2ImportApply(A, 'binghe');
document.getElementById('v2Prefix').value = 'bh_';
/* deployed/bh_wj.json 只含 {option, _register}（task 数组在部署时并进 interface.json），
   任务名固定成现网注册名，保证两次运行一致 */
document.getElementById('v2TaskName').value = '冰河洋芋无尽';
/* 抛花开关还原（导入器不还原 V2.throw，同 none_a6_diff.js） */
(function(){
  var th = Object.keys(dep).filter(function(k){ return /^bh_抛花\d+$/.test(k); }).sort();
  if (!th.length) return;
  V2.order.deck1 = V2.order.deck1.filter(function(it){ return !(it.t === 'plant' && /^抛花\d+$/.test(it.name || '')); });
  var slotM = /第(.+?)个槽位/.exec(dep[th[0]].begin || '');
  var CN = '一二三四五六七八';
  V2.throw = { on: true, slot: slotM ? CN.indexOf(slotM[1]) + 1 : 1, cells: th.map(function(k){
    var m = /格子(\d)_(\d)$/.exec(dep[k].end || '');
    return m ? m[1] + '-' + m[2] : '7-1';
  }) };
})();

const built = v2BuildPipeline();
const task = v2BuildTask(built);
fs.writeFileSync(OUT, JSON.stringify({
  exportJs: OLD || path.join(SRC, '40_export.js'),
  mode: V2.route.mode,
  nodes: built.nodes,
  task: task,
  intro: v2TaskIntro()
}, null, 1), 'utf8');
console.log('模式=' + V2.route.mode + ' 节点=' + Object.keys(built.nodes).length +
  ' option=' + Object.keys(task.option).length + ' → ' + OUT);
console.log('节点哈希=' + require('crypto').createHash('md5').update(canon(built.nodes)).digest('hex') +
  ' task哈希=' + require('crypto').createHash('md5').update(canon(task)).digest('hex'));
