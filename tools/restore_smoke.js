/* v4.1.0 更新还原冒烟：V3Bridge 桩（读真盘 MPZ、写内存），断言合并/去重结果。
 * 用法: node tools/restore_smoke.js   （只读 MPZ 目录，不写任何真实文件） */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const SRC = path.join(__dirname, '..', 'src', 'core', 'src', 'js');
const APP = 'E:/app/MaaPVZ-win-x86_64';

function fakeEl(){ return { value:'', checked:false, textContent:'', innerHTML:'', style:{}, dataset:{},
  classList:{ add(){}, remove(){}, toggle(){} }, addEventListener(){}, appendChild(){}, removeChild(){},
  getContext(){ return {}; }, clientWidth:760, width:760, height:34, closest(){ return null; },
  querySelector(){ return null; }, remove(){}, cloneNode(){ return fakeEl(); } }; }
const cache = {};
global.document = { getElementById(id){ if (id === 'btnResize') return null; if (!cache[id]) cache[id] = fakeEl(); return cache[id]; },
  querySelector(){ return null; }, querySelectorAll(){ return []; }, createElement(){ return fakeEl(); },
  addEventListener(){}, body: { appendChild(){} } };
global.localStorage = { _m:{}, getItem(k){ return this._m[k] || null; }, setItem(k,v){ this._m[k]=v; }, removeItem(k){ delete this._m[k]; } };
global.window = global;
global.showToast = m => console.log('[toast]', m);
global.copyText = () => {}; global.confirm = () => true; global.prompt = () => '';
global.grid = []; global.slotNames = []; global.rows = 5; global.cols = 9;
global.subSlotsOn = false; global.fxOn = true; global.splitOn = false;
global.split = { early:null, late:null };
global.plants = { base:[], vine:[], merge:[], tool:[], ops:[] }; global.selected = null;
global.curGrid = () => global.grid; global.save = () => {}; global.renderGrid = () => {};
global.applyBrush = () => {}; global.load = () => false; global.defaultPlants = () => ({});
global.initGrid = () => {}; global.buildAllChips = () => {}; global.renderSlots = () => {};
global.renderSplitUI = () => {}; global.updateStatus = () => {};
global.exportCompact = () => ''; global.splitCompact = () => ''; global.exportFull = () => '';
global.ensurePlant = () => {};

const files = ['10_state_v2.js','15_route.js','20_order.js','25_boss.js','30_presets_data.js',
  '31_official_data.js','35_presets.js','40_export.js','45_import.js','47_touch.js','48_server.js',
  '48b_deploy.js','48c_restore.js','49_agent_counter.js','50_checks.js'];
vm.runInThisContext(files.map(f => fs.readFileSync(path.join(SRC, f), 'utf8')).join('\n'), { filename: 'bundle.js' });

const written = {};
global.V3Bridge = { mode: 'tauri',
  readText(p){ const f = p.replace(/[\/\\]/g, path.sep); return Promise.resolve(fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null); },
  writeText(p, c){ written[p] = c; return Promise.resolve(); } };
V2_SRV.mpz = APP;

let pass = 0, fail = 0;
function T(name, ok){ if (ok){ pass++; console.log('  ✓ ' + name); } else { fail++; console.log('  ✗ ' + name); } }

v2RestoreAfterUpdate();
setTimeout(() => {
  const rs = APP.replace(/\\/g, '/');
  const fm = written[rs + '/agent/fx_main.py'] || '';
  const cnt = (s, re) => (s.match(re) || []).length;
  console.log('== 更新还原冒烟（写内存桩，未动真盘）==');
  T('fx_main 含 import main 派生的官方 handler(custom_select_plant)', /^import custom_select_plant$/m.test(fm));
  T('fx_counter import 恰 1 次（去重）', cnt(fm, /^import fx_counter$/m) === 1);
  T('fx_monitor import 恰 1 次', cnt(fm, /^import fx_monitor$/m) === 1);
  T('haidao_counter import 恰 1 次', cnt(fm, /^import haidao_counter$/m) === 1);
  const ifKey = Object.keys(written).find(k => /\/interface\.json$/.test(k));
  T('interface.json 被重写', !!ifKey);
  if (ifKey){
    const d = JSON.parse(written[ifKey]);
    const custom = d.task.filter(t => (t.resource || []).includes('自制无尽'));
    const official = d.task.filter(t => !(t.resource || []).includes('自制无尽'));
    T('自制任务 16 个', custom.length === 16);
    T('官方任务保留 17 个', official.length === 17);
    T('resource_self imports 16 条', d.import.filter(i => i.includes('resource_self/task/')).length === 16);
    T('resource 含自制无尽', d.resource.some(r => r.name === '自制无尽'));
    const bh = custom.find(t => t.entry === 'bh_Entry');
    T('冰河条目完整(option 8 + 简介)', !!bh && bh.option.length === 8 && (bh.description || '').includes('卡槽'));
    T('无 resource 标签任务=0（官方任务已归一化）', d.task.filter(t => !t.resource || !t.resource.length).length === 0);
  }
  const bak = Object.keys(written).some(k => /\.bak$/.test(k));
  T('interface 写前留了备份桩', bak);
  console.log('\nRESULT: %d pass, %d fail', pass, fail);
  process.exit(fail ? 1 : 0);
}, 900);
