/* v4.0.9 fast_mode 金标准：开/关两路导出比对 + 与现网冰河部署件关键节点对齐。
 * 用法: node tools/fast_mode_golden.js  （在仓库根或任意目录均可） */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.join(__dirname, '..');
const SRC = path.join(REPO, 'src', 'core', 'src', 'js');
const MPZ = 'E:/app/MaaPVZ-win-x86_64';

function fakeEl(){
  var el = { value: '', checked: false, textContent: '', innerHTML: '', style: {}, dataset: {},
    _ls: {}, classList: { add(){}, remove(){}, toggle(){} },
    addEventListener(){}, appendChild(){}, removeChild(){}, getContext(){ return {}; },
    clientWidth: 760, width: 760, height: 34, closest(){ return null; },
    querySelector(){ return null; }, remove(){}, cloneNode(){ return fakeEl(); } };
  return el;
}
const cache = {};
global.document = { getElementById(id){ if (id === 'btnResize') return null; if (!cache[id]) cache[id] = fakeEl(); return cache[id]; },
  querySelector(){ return null; }, querySelectorAll(){ return []; }, createElement(){ return fakeEl(); },
  addEventListener(){}, body: { appendChild(){} } };
global.localStorage = { _m: {}, getItem(k){ return this._m[k] || null; }, setItem(k, v){ this._m[k] = v; }, removeItem(k){ delete this._m[k]; } };
global.window = global;
global.showToast = function(){}; global.copyText = function(){};
global.confirm = function(){ return true; }; global.prompt = function(){ return ''; };
global.grid = []; global.slotNames = []; global.rows = 5; global.cols = 9;
global.subSlotsOn = false; global.fxOn = true; global.splitOn = false;
global.split = { early: null, late: null };
global.plants = { base: [], vine: [], merge: [], tool: [], ops: [] };
global.selected = null;
global.curGrid = function(){ return global.grid; };
global.save = function(){}; global.renderGrid = function(){}; global.applyBrush = function(){};
global.load = function(){ return false; }; global.defaultPlants = function(){ return {}; };
global.initGrid = function(){}; global.buildAllChips = function(){}; global.renderSlots = function(){};
global.renderSplitUI = function(){}; global.updateStatus = function(){};
global.exportCompact = function(){ return ''; }; global.splitCompact = function(){ return ''; };
global.exportFull = function(){ return ''; };
global.ensurePlant = function(){};

const files = ['10_state_v2.js','15_route.js','20_order.js','25_boss.js','30_presets_data.js','31_official_data.js','35_presets.js','40_export.js','45_import.js','47_touch.js','48_server.js','48b_deploy.js','49_agent_counter.js','50_checks.js'];
let code = '';
files.forEach(f => { code += fs.readFileSync(path.join(SRC, f), 'utf8') + '\n'; });
vm.runInThisContext(code, { filename: 'fast_mode_golden_bundle.js' });

let pass = 0, fail = 0;
function T(name, ok){ if (ok){ pass++; console.log('  ✓ ' + name); } else { fail++; console.log('  ✗ ' + name); } }

function build(fast, extra){
  V2 = v2Clone(v2Default());
  V2.prefix = 'bh_'; V2.world = '冰河';
  V2.route = { mode: 'tail', tail: { d2: [3], boss: [5, 0] },
    phase: { deck2Levels: [2, 12], bossEarlyFeed: 20, farmFrom: 21 },
    params: Object.assign({ start_level: 1, deck1_first: 20, front10: 0, front10_feed: '', front30: 0,
      front30_feed: '', deck2_tail3_first: 0, beilei_stop: 0,
      boss_feed_early: 'bh_boss_叠种5_1', boss_feed_late: 'bh_boss_叠种5_1',
      bailuo_from: 0, wave_mode: '', fast_mode: fast ? 1 : 0, farm_stop_from: 0, farm_wave_mode: '' }, extra || {}) };
  V2.order = { deck1: [{ t: 'wave', name: '点波_初始' }, { t: 'plant', name: '洋芋', slot: 2, cell: '1-1' }, { t: 'wave', name: '点波5' }],
               deck2: [{ t: 'wave', name: '点波_初始_d2' }, { t: 'plant', name: '阳光蓓蕾', slot: 9, cell: '6-1' }, { t: 'wave', name: '点波5_d2' }] };
  const built = v2BuildPipeline();
  return { nodes: built.nodes, task: v2BuildTask(built) };
}

const on = build(1), off = build(0);
const P = 'bh_';
const cap = n => on.nodes[P + n].custom_action_param;
const capOff = n => off.nodes[P + n].custom_action_param;

console.log('== fast_mode=1 ==');
T('计步 含 skip_same_deck', cap('计步').indexOf('"skip_same_deck": true') > -1);
T('计步 含 boss_feed 防护', cap('计步').indexOf('bh_boss_叠种5_1') > -1);
T('计步_补给 含 route_node+skip', cap('计步_补给').indexOf('"route_node": "' + P + '尾数路由"') > -1 && cap('计步_补给').indexOf('"skip_same_deck": true') > -1);
['开始游戏普', '开始游戏d2', '开始游戏boss'].forEach(n =>
  T(n + ' post_delay=0', on.nodes[P + n].post_delay === 0));
const ov = on.task.option[P + '启动时关卡数'].pipeline_override;
T('input模板 计步 带 skip', ov[P + '计步'].custom_action_param.indexOf('"skip_same_deck": true') > -1);
T('input模板 计步_补给 带 route_node+skip',
  ov[P + '计步_补给'].custom_action_param.indexOf('"route_node": "' + P + '尾数路由"') > -1 &&
  ov[P + '计步_补给'].custom_action_param.indexOf('"skip_same_deck": true') > -1);

console.log('== fast_mode=0 ==');
T('计步 无 skip', capOff('计步').indexOf('skip_same_deck') === -1);
T('计步_补给 无 route_node/skip', capOff('计步_补给').indexOf('skip_same_deck') === -1);
['开始游戏普', '开始游戏d2', '开始游戏boss'].forEach(n =>
  T(n + ' post_delay=1000', off.nodes[P + n].post_delay === 1000));

console.log('== 两路 diff 仅预期节点 ==');
const keys = new Set([...Object.keys(on.nodes), ...Object.keys(off.nodes)]);
const diff = [];
keys.forEach(k => { if (JSON.stringify(on.nodes[k]) !== JSON.stringify(off.nodes[k])) diff.push(k); });
T('pipeline diff 集合 = {计步,计步_补给,开始游戏普/d2/boss}',
  diff.sort().join(',') === [P + '开始游戏boss', P + '开始游戏d2', P + '开始游戏普', P + '计步', P + '计步_补给'].sort().join(','));

console.log('== 对齐现网冰河部署件（P1~P9） ==');
const dep = JSON.parse(fs.readFileSync(path.join(MPZ, 'resource_self', 'pipeline', 'Endless', 'YS_bh.json'), 'utf8'));
const depCap = dep[P + '计步'].custom_action_param;
const norm = s => { const o = JSON.parse(s.replace('{关卡}', '1'));
  const k = Object.keys(o).sort(); const r = {}; k.forEach(x => r[x] = o[x]); return JSON.stringify(r); };
T('计步 cap 语义相等（键序无关）', norm(cap('计步')) === norm(depCap));
T('开始游戏普 post 相等', on.nodes[P + '开始游戏普'].post_delay === dep[P + '开始游戏普'].post_delay);
T('计步_补给 cap 语义相等', norm(cap('计步_补给')) === norm(dep[P + '计步_补给'].custom_action_param));

console.log('== 批 B：第 XX 关后不补阵（farm_stop） ==');
(function(){
  const fa = build(0, { farm_stop_from: 100, farm_wave_mode: 'hold' });
  T('farm_stop_from=0（off 路）不生成 _nf 节点', !off.nodes[P + '点波5_nf'] && !off.nodes[P + '点波5_d2_nf']);
  T('farm_stop_from=100 生成 点波5_nf / 点波5_d2_nf（与全局节点同构）',
    !!fa.nodes[P + '点波5_nf'] && !!fa.nodes[P + '点波5_d2_nf'] &&
    JSON.stringify(fa.nodes[P + '点波5_nf'].next) ===
      JSON.stringify([P + '识别结算', P + '识别开始战斗', P + '识别boss关', P + '点波5_nf']));
  const fcap = JSON.parse(fa.nodes[P + '计步'].custom_action_param);
  const ovc = fa.task.option[P + '启动时关卡数'].pipeline_override[P + '计步'].custom_action_param;
  T('计步 静态 cap 与 input 模板都带 farm 链上参数（entry/back/jump + d2 组）',
    fcap.farm_stop_from === 100 && fcap.farm_stop_entry === P + '点波_初始' &&
    fcap.farm_stop_back === P + '洋芋' && fcap.farm_stop_jump === P + '点波5_nf' &&
    fcap.farm_stop_entry_d2 === P + '点波_初始_d2' && fcap.farm_stop_jump_d2 === P + '点波5_d2_nf' &&
    ovc.indexOf('"farm_stop_entry"') > -1 && ovc.indexOf('"farm_stop_jump_d2"') > -1);
  const fwv = fa.task.option[P + '不布阵点波档'];
  const gwv = fa.task.option[P + '关内点波'];
  T('「不布阵点波档」只覆盖 _nf 节点，全局档不碰 _nf',
    !!fwv && fwv.default_case === '不点波' &&
    Object.keys(fwv.cases[0].pipeline_override).sort().join(',') === [P + '点波5_nf', P + '点波5_d2_nf'].sort().join(',') &&
    (!gwv || !gwv.cases[0].pipeline_override[P + '点波5_nf']));
})();

console.log('\nRESULT: %d pass, %d fail', pass, fail);
process.exit(fail ? 1 : 0);
