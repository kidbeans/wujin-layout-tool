// run_all.js —— v3beta 统一测试入口：node test/run_all.js
// 串行跑 v2 回归 / 金卡推演 / 通用框架IO / v3 全量 / 渲染冒烟，任一失败即非零退出。
// 2026-09-14 增补：①--src <dir> 可指定 v2 基座 src 目录（默认自动定位）；
//                  ②副本一致性检查：v4 core/src ⇄ 无尽布阵工具v2/src 快速 diff（不一致即 FAIL）。
"use strict";
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
/* v2 基座定位（多候选，2026-09-13）：v4 布局下取 布阵工具/无尽布阵工具v2；旧布局路径保留 */
const V2ROOT = (function(){
  const cands = [
    path.resolve(ROOT, '..', '无尽布阵工具v2'),                 // 旧布局：source/无尽布阵工具v2
    path.resolve(ROOT, '..', '..', '..', '无尽布阵工具v2')      // v4 布局：布阵工具/无尽布阵工具v2
  ];
  for (let i = 0; i < cands.length; i++)
    if (fs.existsSync(path.join(cands[i], 'test', 'test_v2.js'))) return cands[i];
  return cands[0];
})();
/* --src <dir>：把 v2 基座源码目录重定向到 <dir>（如 v4 source/core/src）——
   测试子进程经环境变量 V2_TEST_SRC 读取「<dir>/js」（test_v2/test_gold_sim/test_frame_io 均支持）。
   用途：直接对 v4 core 源跑回归，不依赖 v2 副本；默认 null = 用 v2 副本自身 src。 */
const SRC_ARG = (function(){
  const i = process.argv.indexOf('--src');
  return i > -1 && process.argv[i + 1] ? path.resolve(process.argv[i + 1]) : null;
})();
if (SRC_ARG){
  const jsDir = path.join(SRC_ARG, 'js');
  if (!fs.existsSync(jsDir)){ console.error('--src 目录无效（缺 js/）：' + SRC_ARG); process.exit(2); }
  process.env.V2_TEST_SRC = jsDir;
  console.log('[--src] v2 基座源码重定向：' + jsDir);
}
const PY = process.env.PYTHON || 'python';
const results = [];
let failed = 0;

function step(name, cmd, opts){
  try {
    const out = execFileSync(cmd[0], cmd.slice(1), Object.assign({
      encoding: 'utf-8', timeout: 300000, cwd: ROOT
    }, opts || {}));
    results.push(['PASS', name, '']);
  } catch (e) {
    failed++;
    results.push(['FAIL', name, String(e.stdout || '').slice(-500) || String(e.message).slice(-300)]);
  }
}
function stepPy(name, script){
  // smoke（playwright）需要 python
  step(name, [PY, script]);
}
/* 副本一致性检查：core ⇄ v2 副本 shared 文件 diff（注释级差异白名单：48_server/48b_deploy） */
function stepSyncCheck(){
  const core = path.resolve(ROOT, '..', 'core', 'src');
  const copy = path.join(V2ROOT, 'src');
  if (!fs.existsSync(core)){ results.push(['SKIP', '副本一致性（core/src 不存在）', '']); return; }
  const WL = /48(b?_deploy|_server)\.js$/;   // 已知注释级差异白名单
  const diffs = [];
  function walk(rel){
    const a = path.join(core, rel), b = path.join(copy, rel);
    if (fs.statSync(a).isDirectory()){
      fs.readdirSync(a).forEach(function(n){ walk(rel ? rel + '/' + n : n); });
      return;
    }
    if (!fs.existsSync(b)){ diffs.push(rel + '（副本缺失）'); return; }
    const ba = fs.readFileSync(a), bb = fs.readFileSync(b);
    if (!ba.equals(bb) && !WL.test(rel)) diffs.push(rel + '（内容不一致）');
  }
  fs.readdirSync(core).forEach(function(n){ walk(n); });
  if (diffs.length){ failed++; results.push(['FAIL', 'core ⇄ v2 副本一致性', diffs.join('；')]); }
  else results.push(['PASS', 'core ⇄ v2 副本一致性', '']);
}

if (!fs.existsSync(path.join(V2ROOT, 'test', 'test_v2.js'))) {
  console.error('找不到 v2 基座：' + V2ROOT);
  process.exit(2);
}

step('v2 回归（83）', [process.execPath, path.join(V2ROOT, 'test', 'test_v2.js')], { cwd: V2ROOT });
step('金卡推演 O9（24）', [process.execPath, path.join(V2ROOT, 'test', 'test_gold_sim.js')], { cwd: V2ROOT });
step('通用框架 IO（29）', [process.execPath, path.join(V2ROOT, 'test', 'test_frame_io.js')], { cwd: V2ROOT });
step('v3beta 全量（78）', [process.execPath, path.join(ROOT, 'test', 'test_v3.js')]);
step('渲染冒烟（24）', [PY, path.join(ROOT, 'test', 'smoke_v3_ui.py')]);
step('棋盘交互（14）', [PY, path.join(ROOT, 'test', 'interact_grid_check.py')]);
stepSyncCheck();

console.log('\n===== v3beta 测试汇总 =====');
results.forEach(([st, n, err]) => console.log(st.padEnd(4), n, err ? '\n     ' + err.replace(/\n/g, '\n     ') : ''));
if (failed) { console.log('\nFAILED: ' + failed); process.exit(1); }
console.log('\nALL SUITES PASS');
