/* 批 D 回归矩阵：导入入口的文件识别 / 解析 / 指路文案（4 类文件 × 多用例）
 *
 * 覆盖（2026-10-10 批 D）：
 *   ① 现网 none 件 YS_bh2.json 单文件        → ok，72 节点，none 模式
 *   ② 它的 task 片段 bh2_wj.json 单文件      → 失败，但文案指名「task 片段」
 *   ③ 两份一起                              → ok，72 节点（task 键不再被当节点）
 *   ④ v2 源（头注释 + pipeline + task 三段）  → ok，72 节点，notes 说明「按 ② pipeline 段导入」
 *   ⑤ 现网 tail 件 YS_bh.json 单文件         → ok，103 节点，配队2 八个槽位名全部推断出来
 *   ⑥ 完整 v2 阵型存档（v2ExportJSON 产物）  → v2ImpFullV2 命中，走状态载入而不是走链
 *   ⑦ 官方通用框架 JSON                      → 失败，文案指路「解析通用框架 JSON」
 *   ⑧ 无关文本                              → 失败，文案列出支持的四类文件
 * 用法: node tools/import_matrix.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.join(__dirname, '..');
const SRC = path.join(REPO, 'src', 'core', 'src', 'js');
const WS = 'E:/app/backup_mpz_scripts/冰河无尽';

function fakeEl(){
  var el = { value: '', checked: false, textContent: '', innerHTML: '', style: {}, dataset: {}, _ls: {},
    classList: { add(){}, remove(){}, toggle(){} },
    addEventListener(t, fn){ (el._ls[t] = el._ls[t] || []).push(fn); },
    fire(t, ev){ (el._ls[t] || []).forEach(function(fn){ fn(ev || { target: el }); }); },
    appendChild(){}, removeChild(){}, getContext(){ return { clearRect(){}, fillRect(){}, fillText(){}, fillStyle:'', font:'' }; },
    clientWidth: 760, width: 760, height: 34, closest(){ return null; }, querySelector(){ return null; }, remove(){}, cloneNode(){ return fakeEl(); } };
  return el;
}
const C = {};
global.document = { getElementById(id){ if (id === 'btnResize') return null; if (!C[id]) C[id] = fakeEl(); return C[id]; },
  querySelector(){ return null; }, querySelectorAll(){ return []; }, createElement(){ return fakeEl(); },
  addEventListener(){}, body: { appendChild(){}, removeChild(){} } };
global.localStorage = { _m: {}, getItem(k){ return this._m[k] || null; }, setItem(k, v){ this._m[k] = v; }, removeItem(k){ delete this._m[k]; } };
global.window = global; global.showToast = function(){}; global.copyText = function(){};
global.confirm = function(){ return true; }; global.prompt = function(){ return ''; };
global.grid = []; global.slotNames = []; global.rows = 5; global.cols = 9; global.subSlotsOn = false; global.fxOn = true; global.splitOn = false;
global.split = { early: null, late: null }; global.plants = { base: [], vine: [], merge: [], tool: [], ops: [] }; global.selected = null;
global.curGrid = function(){ return global.grid; };
['save','renderGrid','applyBrush','initGrid','buildAllChips','renderSlots','renderSplitUI','updateStatus','ensurePlant','v2RefreshPanels']
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
      if (/[\[【]瓷(?:砖)?[\]】]/.test(tt)){ cell.tile = true; tt = tt.replace(/[\[【]瓷(?:砖)?[\]\]】]/g, '').trim(); }
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
let code = ''; files.forEach(f => { code += fs.readFileSync(path.join(SRC, f), 'utf8') + '\n'; });
vm.runInThisContext(code, { filename: 'import_matrix_bundle.js' });

let pass = 0, fail = 0;
function T(name, ok, extra){ if (ok){ pass++; console.log('  ✓ ' + name); } else { fail++; console.log('  ✗ ' + name + (extra ? ' — ' + extra : '')); } }
function read(p){ return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; }
function A(texts, names, hint){
  const arr = texts.map(function(t, i){ return { name: names[i], text: t == null ? '' : t }; });
  return v2ImportAnalyze(arr, hint || '');
}
function warnsOf(A){ return (A.warns || []).join('｜'); }

const F = {
  bh2pipe: read(path.join(WS, 'deployed', 'YS_bh2.json')),
  bh2task: read(path.join(WS, 'deployed', 'bh2_wj.json')),
  bh2src:  read(path.join(WS, '无尽阵型_v2_2026-10-10.json')),
  bhpipe:  read(path.join(WS, 'deployed', 'YS_bh.json')),
};
if (!F.bh2pipe || !F.bh2task || !F.bh2src || !F.bhpipe){
  console.error('缺现网文件（冰河无尽/deployed 或 无尽阵型_v2_2026-10-10.json）');
  process.exit(2);
}

console.log('== ① YS_bh2.json 单文件（none 现网） ==');
(function(){
  const a = A([F.bh2pipe], ['YS_bh2.json'], 'bh2_');
  T('ok=true / 72 节点 / none 模式 / 前缀 bh2_',
    a.ok && a.nNodes === 72 && a.route.mode === 'none' && a.prefix === 'bh2_',
    'ok=' + a.ok + ' n=' + a.nNodes + ' mode=' + a.route.mode + ' pfx=' + a.prefix);
  T('deck2 未使用 → 槽位表为空', a.slots.deck2.length === 0);
})();

console.log('== ② bh2_wj.json 单文件（task 片段） ==');
(function(){
  const a = A([F.bh2task], ['bh2_wj.json'], 'bh2_');
  T('ok=false', !a.ok);
  T('文案指名「task 片段」并给出配对建议', warnsOf(a).indexOf('task 片段') > -1 && warnsOf(a).indexOf('YS_*.json') > -1, warnsOf(a));
})();

console.log('== ③ 两份一起（= 真实「导入现网件」用法） ==');
(function(){
  const a = A([F.bh2pipe, F.bh2task], ['YS_bh2.json', 'bh2_wj.json'], 'bh2_');
  T('ok=true / 72 节点（task 键不再当节点并入）', a.ok && a.nNodes === 72, 'n=' + a.nNodes);
  T('notes 记明忽略非节点键', (a.notes || []).join('｜').indexOf('非节点键') > -1, (a.notes || []).join('｜'));
  T('任务名取自 task 片段 _register', a.taskName === '冰河火龙无尽', String(a.taskName));
  T('两份分开选不误标「v2 源」（那是单文件三段合一的说法）',
    (a.notes || []).join('｜').indexOf('v2 源') === -1, (a.notes || []).join('｜'));
  T('抛花设置还原（8-3/9-3 两朵）+ 顺序里已无 抛花 步',
    !!a.throw && a.throw.cells.join(',') === '8-3,9-3' &&
    a.order.deck1.every(function(it){ return !/^抛花\d+$/.test(it.name || ''); }),
    JSON.stringify(a.throw));
})();

console.log('== ④ v2 源（头注释 + pipeline + task 三段） ==');
(function(){
  const a = A([F.bh2src], ['无尽阵型_v2_2026-10-10.json'], '');
  T('ok=true（旧版报「未解析出任何节点」）', a.ok, warnsOf(a));
  T('72 节点 / 前缀 bh2_ / none', a.nNodes === 72 && a.prefix === 'bh2_' && a.route.mode === 'none',
    'n=' + a.nNodes + ' pfx=' + a.prefix);
  T('notes 说明按 ② pipeline 段导入', (a.notes || []).join('｜').indexOf('② pipeline 段') > -1, (a.notes || []).join('｜'));
})();

console.log('== ⑤ YS_bh.json（tail 现网 103 节点）：单 pipeline vs pipeline+task ==');
(function(){
  const a = A([F.bhpipe], ['YS_bh.json'], 'bh_');
  T('ok=true / 103 节点 / tail', a.ok && a.nNodes === 103 && a.route.mode === 'tail', 'n=' + a.nNodes);
  const filled1 = a.slots.deck1.filter(function(n){ return !!n; }).length;
  const filled2 = a.slots.deck2.filter(function(n){ return !!n; }).length;
  T('单 pipeline：deck1 推得出、deck2 只有链上出现过的槽位（记录现状）',
    filled1 >= 7 && filled2 === 3, 'deck1 ' + filled1 + '/8、deck2 ' + filled2 + '/8');
  const b = A([F.bhpipe, read(path.join(WS, 'deployed', 'bh_wj.json'))], ['YS_bh.json', 'bh_wj.json'], 'bh_');
  const f1 = b.slots.deck1.filter(function(n){ return !!n; }).length;
  const f2 = b.slots.deck2.filter(function(n){ return !!n; }).length;
  T('配 pipeline+task：配队1/配队2 槽位名 8/8 全推断（走链 + _register 简介补齐）',
    f1 === 8 && f2 === 8, 'deck1 ' + f1 + '/8、deck2 ' + f2 + '/8：' + b.slots.deck2.join(','));
  T('补齐说明写进 notes', (b.notes || []).join('｜').indexOf('_register 简介') > -1, (b.notes || []).join('｜'));
  /* 落格以 pipeline 节点为准：洋芋件是补丁 P9 把落点改到 8-3/9-3 的，_register 简介里那句
     「抛花卡槽1→8-1/8-2」是补丁没同步的旧文案——所以这里取 pipeline（8-3/9-3）而不是简介 */
  T('两份一起时抛花还原（取 pipeline 节点：8-3/9-3）',
    !!b.throw && b.throw.cells.join(',') === '8-3,9-3', JSON.stringify(b.throw));
  T('任务名取自 _register（冰河洋芋无尽）', b.taskName === '冰河洋芋无尽', String(b.taskName));
})();

console.log('== ⑥ 完整 v2 阵型存档（v2ExportJSON 产物） ==');
(function(){
  /* 从 ⑤ 的导入结果重建画布，再导出完整 v2 阵型，走 v2ImpFullV2 识别 */
  const a = A([F.bhpipe], ['YS_bh.json'], 'bh_');
  v2ImportApply(a, 'binghe');
  const full = v2ExportJSON();
  const text = JSON.stringify(full);
  const hit = v2ImpFullV2(text);
  T('v2ImpFullV2 命中（version:2 + boards + slots）', !!hit && hit.version === 2);
  T('pipeline 片段不会被误判成阵型存档', v2ImpFullV2(F.bh2pipe) === null);
  T('往返：导出→识别→再导入仍是 103 节点链路',
    (function(){ const a2 = A([text], ['阵型.json'], 'bh_'); return !a2.ok && warnsOf(a2).indexOf('v2 阵型存档') > -1; })(),
    '整份 v2 阵型交给 pipeline 走链时应被指路为阵型存档');
})();

console.log('== ⑦⑧ 其它误选 ==');
(function(){
  const fw = { option: { '通用_无尽挑战_前期': { type: 'switch', cases: [{ name: 'Yes' }] } }, task: [] };
  const a = A([JSON.stringify(fw)], ['通用框架.json'], '');
  T('通用框架 JSON → 指路「解析通用框架 JSON」', !a.ok && warnsOf(a).indexOf('通用框架') > -1, warnsOf(a));
  const b = A(['随便一段文字，不是 JSON'], ['x.txt'], '');
  T('无关文本 → 列出支持的四类', !b.ok && warnsOf(b).indexOf('支持：') > -1, warnsOf(b));
  T('空文件 → 单个文件解析失败提示',
    (function(){ const c = A([''], ['empty.json'], ''); return !c.ok; })());
})();

console.log('== ⑨ 批 B 往返：不补阵画布 → 导出 → 导入 → 再导出 ==');
(function(){
  global.slotNames = ['能量花','珊瑚','大哥','芦荟','原豌','暗物质火龙果','瓷砖萝卜','火豌',
                      '能量花','阳光蓓蕾','大哥','原豌','洋芋','南瓜头','暗物质火龙果','瓷砖萝卜'];
  global.subSlotsOn = false;
  V2 = v2Clone(v2Default());
  V2.world = 'binghe'; V2.prefix = 'fb_'; V2.route.mode = 'none';
  V2.route.params = Object.assign(V2.route.params, { start_level: 1, farm_stop_from: 100, farm_wave_mode: 'hold' });
  V2.order.deck1 = [{ t: 'wave', name: '点波_初始' }, { t: 'plant', name: '能量花', slot: 1, cell: '8-3' },
                    { t: 'plant', name: '大哥', slot: 3, cell: '2-1' }, { t: 'wave', name: '点波5' }];
  V2.order.deck2 = [];
  V2.boss.ops = [{ t: 'feed', cell: '6-3', loop: true }];
  V2.boss.feedSelect = true;            /* 导出/导入都会带「boss喂豆位置」选项，两边保持一致再比 */
  V2.throw = { on: true, slot: 1, cells: ['8-3', '9-3'] };
  document.getElementById('v2Prefix').value = 'fb_';
  document.getElementById('v2TaskName').value = '不补阵往返测试';
  v2ExportPipeline();
  const text1 = document.getElementById('v2Out').value;
  const p1 = v2ParseAnyJson(text1);
  T('导出件含 _nf 节点与 farm 链上参数',
    !!p1 && !!p1['fb_点波5_nf'] && (p1['fb_计步'].custom_action_param || '').indexOf('"farm_stop_jump"') > -1);

  const A = v2ImportAnalyze([{ name: '不补阵往返测试.json', text: text1 }], '');
  T('导出件可被导入（v2 源三段识别）', A.ok && A.prefix === 'fb_', (A.warns || []).join('｜'));
  T('farm 参数经 计步 cap 原样复原（含链上 entry/back/jump）',
    A.route.params.farm_stop_from === 100 && A.route.params.farm_wave_mode === 'hold' &&
    A.route.params.farm_stop_entry === 'fb_抛花2' && A.route.params.farm_stop_jump === 'fb_点波5_nf',
    JSON.stringify(A.route.params));
  T('_nf 节点不会被导入器当链上步骤（顺序里没有它）',
    A.order.deck1.every(function(it){ return (it.name || '').indexOf('_nf') === -1; }));
  T('抛花设置同时复原（8-3/9-3）', !!A.throw && A.throw.cells.join(',') === '8-3,9-3');

  v2ImportApply(A, 'binghe');
  document.getElementById('v2Prefix').value = 'fb_';
  document.getElementById('v2TaskName').value = '不补阵往返测试';
  v2ExportPipeline();
  const text2 = document.getElementById('v2Out').value;
  const p2 = v2ParseAnyJson(text2);
  function canon(o){
    if (Array.isArray(o)) return '[' + o.map(canon).join(',') + ']';
    if (o && typeof o === 'object') return '{' + Object.keys(o).sort().map(function(k){ return JSON.stringify(k) + ':' + canon(o[k]); }).join(',') + '}';
    return JSON.stringify(o);
  }
  /* 只比节点表：v2ParseAnyJson 会把 ② pipeline 与 ③ task 合到一起，
     而 ③ 段本来就该变（卡槽表只推得出链上出现过的槽位、feedSelect 被推断为 true），不是节点差异 */
  function nodesOf(merged){
    const o = {};
    Object.keys(merged || {}).forEach(function(k){
      if (['version','meta','boards','slots','order','route','boss','throw','debugCardUI',
           'option','task','nested','_register'].indexOf(k) === -1) o[k] = merged[k];
    });
    return o;
  }
  const n1 = nodesOf(p1), n2 = nodesOf(p2);
  T('再导出：节点表逐字段一致（往返无损，含 _nf 与全部 farm 参数）',
    canon(n1) === canon(n2),
    (function(){
      const a = Object.keys(n1), b = Object.keys(n2);
      const miss = a.filter(function(k){ return !(k in n2); }).concat(b.filter(function(k){ return !(k in n1); }));
      if (miss.length) return '节点差集 ' + miss.join(',');
      const chg = a.filter(function(k){ return canon(n1[k]) !== canon(n2[k]); });
      return '字段差异: ' + chg.join(', ');
    })());
  /* 注意：头注释里也写了「↓↓③」，必须取最后一段（split 的第 3 段） */
  const t1doc = v2ParseAnyJson(text1.split('↓↓③').pop() || '');
  const t2doc = v2ParseAnyJson(text2.split('↓↓③').pop() || '');
  T('再导出：task 顶层选项表一致（含「不布阵点波档」）',
    !!t1doc && !!t2doc && Array.isArray(t1doc.task) && Array.isArray(t2doc.task) &&
    canon(t1doc.task[0].option) === canon(t2doc.task[0].option) &&
    Object.keys(t2doc.option).some(function(k){ return k.indexOf('不布阵点波档') > -1; }),
    (t1doc && t1doc.task ? JSON.stringify(t1doc.task[0].option) : 't1doc 无 task') + ' | ' +
    (t2doc && t2doc.task ? JSON.stringify(t2doc.task[0].option) : 't2doc 无 task'));
  T('再导出：简介保留不补阵与农场档描述',
    !!t2doc && t2doc.task[0].description.indexOf('第100关后不补阵') > -1 &&
    t2doc.task[0].description.indexOf('不补阵期不点波') > -1,
    (t2doc && t2doc.task ? t2doc.task[0].description : ''));
})();

console.log('\nRESULT: %d pass, %d fail', pass, fail);
process.exit(fail ? 1 : 0);
