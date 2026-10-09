/* ================= v2 路由面板：双卡组计数模拟器（尾数/阶段/无计数） =================
 * 纯逻辑函数无 DOM 依赖（node 可单测）；UI 由 initRoutePanel() 装配。
 * 模拟逻辑逐字对齐 agent/fx_counter.py(_route_by_tail+front参数) 与 haidao_counter.py(_route_phase)。
 */
"use strict";

/* ---- 单关路由（纯函数） ---- */
function v2RouteLevel(rt, level){
  var notes = [];
  if (rt.mode === 'none') return { target: '普', deck: 1, notes: notes };
  var p = rt.params || {};
  if (rt.mode === 'phase'){
    var isBoss = level % 5 === 0;
    var lv = rt.phase.deck2Levels || [];
    if (lv.indexOf(level) > -1) return { target: 'build_deck2', deck: 2, notes: ['指定deck2关卡'] };
    if (isBoss) return { target: level <= (rt.phase.bossEarlyFeed || 0) ? 'boss_direct_feed' : 'boss_dianda_feed',
                         deck: 1, notes: level <= (rt.phase.bossEarlyFeed || 0) ? ['前N关Boss直接喂'] : ['叠电大后喂'] };
    if (level < (rt.phase.farmFrom || 21)) return { target: 'build_deck1', deck: 1, notes: [] };
    return { target: 'farm_post20', deck: 1, notes: ['挂机期'] };
  }
  var tail = level % 10, target;
  var d2t = (rt.tail && rt.tail.d2) || [3, 8];
  var bt = (rt.tail && rt.tail.boss) || [5, 0];
  if (bt.indexOf(tail) > -1){
    target = 'boss';
    notes.push('Boss喂豆→' + ((p.deck1_first > 0 && level <= p.deck1_first)
      ? (p.boss_feed_early || '1-3_d1') : (p.boss_feed_late || '2-3')));
  } else if (d2t.indexOf(tail) > -1){
    if (p.deck1_first > 0 && level <= p.deck1_first){
      target = '普'; notes.push('deck1_first=' + p.deck1_first + '：不切deck2');
    } else if (p.deck2_tail3_first > 0 && level <= p.deck2_tail3_first && tail !== 3){
      target = '普'; notes.push('deck2_tail3_first=' + p.deck2_tail3_first + '：仅×3关切deck2');
    } else target = 'd2';
  } else target = '普';
  if (target !== 'boss'){
    if (p.front30 > 0 && level <= p.front30) notes.push('front30：速刷（给豆+狂点）');
    if (p.front10 > 0 && level <= p.front10) notes.push('front10：等结算循环(未命中拖豆' + (p.front10_feed || '1-3') + ')');
    if (p.beilei_stop > 0 && level > p.beilei_stop) notes.push('beilei_stop=' + p.beilei_stop + '：不补蓓蕾');
    if (target === '普' && p.bailuo_from > 0 && level >= p.bailuo_from) notes.push('bailuo_from=' + p.bailuo_from + '：普关走补白萝卜循环');
  }
  return { target: target, deck: target === 'd2' ? 2 : 1, notes: notes };
}

function v2RouteRange(rt, from, to){
  var rows = [];
  for (var lv = Math.max(1, from); lv <= Math.min(999, to); lv++){
    var r = v2RouteLevel(rt, lv);
    r.level = lv; r.tail = lv % 10;
    rows.push(r);
  }
  return rows;
}

/* ---- 配置一致性 R1~R6（ctx: {slots16, subSlotsOn, bossReady}） ---- */
function v2RouteIssues(rt, ctx){
  var out = [], p = rt.params || {};
  ctx = ctx || {};
  if (rt.mode === 'tail'){
    if ((rt.tail.d2 || []).length && !ctx.subSlotsOn) out.push(['R1', 'error', '尾数会路由到 deck2，但配队2未开启/卡槽9~16为空']);
    else if (ctx.subSlotsOn && ctx.d2Filled === false) out.push(['R1', 'error', 'deck2 被路由使用但卡槽9~16未填植物']);
    if (!(rt.tail.boss || []).length) out.push(['R2', 'error', '尾数分流必须配置 Boss 尾数（默认 5/0）']);
    if (!ctx.bossReady) out.push(['R2', 'error', 'Boss 关被路由使用但 Boss 链为空（请到 Boss 面板编辑）']);
    if (p.deck1_first > 0 && p.deck2_tail3_first > 0) out.push(['R3', 'error', 'deck1_first 与 deck2_tail3_first 语义冲突，只能二选一（复兴用前者，童话用后者）']);
    if (p.front30 > 0 && p.front10 > 0) out.push(['R4', 'info',
      p.front10 >= p.front30
        ? ('front10=' + p.front10 + ' ≥ front30=' + p.front30 + '：前 ' + p.front10 + ' 关小关全部「先等结算」（不触发速刷给豆，境界=等结算循环）')
        : ('front10=' + p.front10 + ' < front30=' + p.front30 + '：前 ' + p.front10 + ' 关等结算，其余到第 ' + p.front30 + ' 关速刷（童话组合用法）')]);
    if (p.start_level > 1 && p.start_level % 10 !== 0 && p.start_level % 10 !== 5){}
    if (p.start_level % 10 === 5 || p.start_level % 10 === 0) out.push(['R5', 'info', '启动关卡尾数为 Boss 关：首关即 Boss，建议配合「boss关选卡界面开始」']);
  }
  if (rt.mode === 'none' && (p.deck1_first > 0 || p.front30 > 0 || p.deck2_tail3_first > 0)) out.push(['R6', 'warn', '单卡组（无计数）模式不需要前N关参数']);
  if (rt.mode === 'none' && p.fast_mode) out.push(['R6', 'warn', '单卡组（无计数）模式没有切卡组动作，激进省时模式无效（请取消勾选）']);
  if (rt.mode === 'none' && !ctx.bossReady) out.push(['R2', 'error', '单卡组同样会遇到 Boss 关（尾数5/0），Boss 链为空会在 Boss 关失败（请到 Boss 面板配置）']);
  if (rt.mode === 'none' && ctx.subSlotsOn) out.push(['R6', 'info', '单卡组模式开启配队2不会产生路由（如需请改尾数分流）']);
  return out;
}

/* ---- 已知脚本测试向量（回归） ---- */
function v2RouteSelfTest(){
  function mk(mode, params){
    return { mode: mode, tail: { d2: [3, 8], boss: [5, 0] },
             phase: { deck2Levels: [2, 12], bossEarlyFeed: 20, farmFrom: 21 }, params: params };
  }
  var fx = mk('tail', { start_level: 1, deck1_first: 10, front30: 30 });
  var th = mk('tail', { start_level: 1, front10: 10, front30: 30, deck2_tail3_first: 20, beilei_stop: 50 });
  var sz = mk('tail', { start_level: 1, deck1_first: 10 });
  var hd = mk('phase', {});
  var cases = [
    ['复兴 L3→普',  v2RouteLevel(fx, 3).target  === '普'],
    ['复兴 L8→普',  v2RouteLevel(fx, 8).target  === '普'],
    ['复兴 L13→d2', v2RouteLevel(fx, 13).target === 'd2'],
    ['复兴 L5→boss 喂1-3_d1', v2RouteLevel(fx, 5).target === 'boss' && v2RouteLevel(fx, 5).notes.join().indexOf('1-3_d1') > -1],
    ['复兴 L10→boss(尾数0)', v2RouteLevel(fx, 10).target === 'boss'],
    ['复兴 L20→boss(尾数0)', v2RouteLevel(fx, 20).target === 'boss'],
    ['复兴 L15 boss 喂2-3',   v2RouteLevel(fx, 15).notes.join().indexOf('2-3') > -1],
    ['复兴 L28 d2 速刷', v2RouteLevel(fx, 28).target === 'd2' && v2RouteLevel(fx, 28).notes.join().indexOf('front30') > -1],
    ['fast_mode→skip_same_deck', v2RouteParamsExtra({ deck1_first: 20, fast_mode: 1 }, 'x_').join(',').indexOf('"skip_same_deck": true') > -1],
    ['fast_mode关→无skip键', v2RouteParamsExtra({ deck1_first: 20 }, 'x_').join(',').indexOf('skip_same_deck') === -1],
    ['桑葚 L8→普(deck1_first)', v2RouteLevel(sz, 8).target === '普'],
    ['桑葚 L13→d2', v2RouteLevel(sz, 13).target === 'd2'],
    ['童话 L13→d2', v2RouteLevel(th, 13).target === 'd2'],
    ['童话 L18→普(tail3_first)', v2RouteLevel(th, 18).target === '普'],
    ['童话 L23→d2', v2RouteLevel(th, 23).target === 'd2'],
    ['童话 L51 不补蓓蕾', v2RouteLevel(th, 51).notes.join().indexOf('beilei_stop') > -1],
    ['海盗 L2→build_deck2', v2RouteLevel(hd, 2).target === 'build_deck2'],
    ['海盗 L7→build_deck1', v2RouteLevel(hd, 7).target === 'build_deck1'],
    ['海盗 L15→boss_direct', v2RouteLevel(hd, 15).target === 'boss_direct_feed'],
    ['海盗 L25→boss_dianda', v2RouteLevel(hd, 25).target === 'boss_dianda_feed'],
    ['海盗 L21→farm_post20', v2RouteLevel(hd, 21).target === 'farm_post20']
  ];
  var fail = cases.filter(function(c){ return !c[1]; });
  return { pass: cases.length - fail.length, total: cases.length, failed: fail.map(function(c){ return c[0]; }) };
}

/* ---- 区间统计 / 关卡清单 / 单关详解 / 耗时估算（v0.2） ---- */
function v2RouteStats(rt, from, to){
  var st = { d1: 0, d2: 0, boss: 0, farm: 0, per10: {}, bossList: [], d2List: [] };
  for (var lv = from; lv <= to; lv++){
    var r = v2RouteLevel(rt, lv);
    if (r.target === 'd2' || r.target === 'build_deck2'){ st.d2++; st.d2List.push(lv); }
    else if (r.target.indexOf('boss') === 0){ st.boss++; st.bossList.push(lv); }
    else { st.d1++; if (r.target === 'farm_post20') st.farm++; }
    var b = Math.floor((lv - from) / 10) * 10 + from;
    st.per10[b] = st.per10[b] || { d1: 0, d2: 0, boss: 0 };
    if (r.target === 'd2' || r.target === 'build_deck2') st.per10[b].d2++;
    else if (r.target.indexOf('boss') === 0) st.per10[b].boss++;
    else st.per10[b].d1++;
  }
  return st;
}
function v2RouteDetail(rt, level){
  var p = rt.params || {}, tail = level % 10;
  var L = ['第 ' + level + ' 关（尾数 ' + tail + '）判定过程：'];
  if (rt.mode === 'none'){ L.push('  模式=无计数（单卡组静态链）：每关同构，走 deck1 补种链'); return L.join('\n'); }
  if (rt.mode === 'phase'){
    L.push('  模式=阶段分流（海盗式）');
    if ((rt.phase.deck2Levels || []).indexOf(level) > -1) L.push('  → ' + level + ' 在 deck2 指定关卡清单 ' + JSON.stringify(rt.phase.deck2Levels) + ' → build_deck2（配队2：瓷砖/钢地刺）');
    else if (level % 5 === 0) L.push('  → Boss 关（5 的倍数）→ ' + (level <= rt.phase.bossEarlyFeed ? '前 ' + rt.phase.bossEarlyFeed + ' 关 → boss_direct_feed（直接喂豆）' : '超过 ' + rt.phase.bossEarlyFeed + ' → boss_dianda_feed（叠电大后喂）'));
    else if (level < rt.phase.farmFrom) L.push('  → 小关且 < 挂机起始关 ' + rt.phase.farmFrom + ' → build_deck1（布阵期）');
    else L.push('  → 小关且 ≥ ' + rt.phase.farmFrom + ' → farm_post20（挂机期：抛花+喂豆+补种+快结算）');
    return L.join('\n');
  }
  L.push('  模式=尾数分流');
  if ((rt.tail.boss || []).indexOf(tail) > -1){
    L.push('  → 尾数 ∈ Boss 尾数 ' + JSON.stringify(rt.tail.boss) + ' → Boss 关');
    L.push('  → 喂豆目标：' + ((p.deck1_first > 0 && level <= p.deck1_first)
      ? '前 deck1_first=' + p.deck1_first + ' 关内 → ' + (p.boss_feed_early || '1-3 电大（复兴约定）')
      : (p.boss_feed_late || '2-3 心叶兰（复兴约定）') + '（循环）'));
  } else if ((rt.tail.d2 || []).indexOf(tail) > -1){
    if (p.deck1_first > 0 && level <= p.deck1_first){
      L.push('  → 尾数 ∈ deck2 尾数 ' + JSON.stringify(rt.tail.d2) + '，但 level ≤ deck1_first=' + p.deck1_first + ' → 不切 deck2，走 deck1（开荒期 deck1 成型优先）');
    } else if (p.deck2_tail3_first > 0 && level <= p.deck2_tail3_first && tail !== 3){
      L.push('  → 尾数 ∈ deck2 尾数，但 level ≤ deck2_tail3_first=' + p.deck2_tail3_first + ' 且尾数≠3 → 走 deck1（前 N 关只在 ×3 关切 deck2）');
    } else L.push('  → 尾数 ∈ deck2 尾数 ' + JSON.stringify(rt.tail.d2) + ' → 配队2（deck2 种植链）');
  } else L.push('  → 尾数 ∉ d2/Boss 尾数 → 配队1 普关（deck1 补种链）');
  if (level % 10 !== 5 && level % 10 !== 0){
    if (p.front30 > 0 && level <= p.front30) L.push('  → 前 front30=' + p.front30 + ' 关 → 点波5 被 override 为 [' + (p.front30_feed || '给豆1_2') + '+狂点5s]（速刷）');
    else if (p.front10 > 0 && level <= p.front10) L.push('  → 前 front10=' + p.front10 + ' 关 → 点波5 override 为等结算循环（先识别结算，未命中才拖豆' + (p.front10_feed || '1-3') + '开大）');
  }
  if (p.beilei_stop > 0 && level > p.beilei_stop && tail !== 5 && tail !== 0) L.push('  → level > beilei_stop=' + p.beilei_stop + ' → 蓓蕾补种入口被 override（不补蓓蕾）');
  if (p.bailuo_from > 0 && level >= p.bailuo_from && tail !== 5 && tail !== 0) L.push('  → level ≥ bailuo_from=' + p.bailuo_from + ' → 点波5 被改写为补白萝卜循环（agent）');
  return L.join('\n');
}
function v2EstimateTime(rt, from, to, avgNormal, avgBoss){
  var st = v2RouteStats(rt, from, to);
  var normal = st.d1 + st.d2;
  var total = normal * avgNormal + st.boss * avgBoss;
  var fmt = function(sec){
    sec = Math.round(sec);
    var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
    return (h ? h + '小时' : '') + m + '分' + s + '秒';
  };
  return '按 小关 ' + avgNormal + 's / Boss ' + avgBoss + 's 估算 ' + from + '~' + to + ' 整轮：' +
    '小关×' + normal + ' + Boss×' + st.boss + ' = ' + fmt(total) +
    '（平均 ' + (total / (normal + st.boss)).toFixed(1) + 's/关）';
}

/* 已验证参数预设（一键填充） */
var V2_ROUTE_PRESETS = [
  { name: '复兴', mode: 'tail', args: { start_level: 1, deck1_first: 10, front30: 30 } },
  { name: '桑葚', mode: 'tail', args: { start_level: 1, deck1_first: 10 } },
  { name: '童话', mode: 'tail', args: { start_level: 1, front10: 10, front30: 30, front30_feed: '1-3', deck2_tail3_first: 20, beilei_stop: 50 } },
  { name: '海盗', mode: 'phase', args: { start_level: 1 }, phase: { deck2Levels: [2, 12], bossEarlyFeed: 20, farmFrom: 21 } },
  { name: '西部/埃及(单卡组)', mode: 'none', args: { start_level: 1 } }
];

/* ---- 面板 UI ---- */
function v2ReadRouteUI(){
  var q = function(id){ var e = document.getElementById(id); return e ? e.value : ''; };
  var ri = function(id){ var e = document.getElementById(id); return e ? (parseInt(e.value) || 0) : 0; };
  var rc = V2.route;
  rc.mode = q('rtMode') || 'tail';
  /* 尾数 0 是合法 Boss/切deck2 尾数（第10/20/30…关），不可用 x>0 过滤（2026-09-08 用户实测踩坑）。
     但必须先剔除空串：''.split(...) 得 ['']，Number('')===0 会过范围过滤 → 输入框清空被误解析成尾数 0
     （Boss 尾数误变 [0] → 第10/20/30…全成 Boss 关；2026-09-14 审查修复）。 */
  var numsOf = function(v, min, max){
    return String(v || '').split(/[,\s，]+/).filter(function(s){ return s !== ''; })
      .map(Number).filter(function(x){ return x >= min && x <= max; });
  };
  rc.tail.d2 = numsOf(q('rtD2Tails'), 0, 9);
  rc.tail.boss = numsOf(q('rtBossTails'), 0, 9);
  rc.phase.deck2Levels = numsOf(q('rtDeck2Lv'), 1, Infinity);
  rc.phase.bossEarlyFeed = ri('rtBossEarly'); rc.phase.farmFrom = ri('rtFarmFrom') || 21;
  p_set('start_level', ri('rtStart') || 1);
  p_set('deck1_first', ri('rtDeck1First'));
  p_set('fast_mode', ((q('rtFastMode') || {}).checked) ? 1 : 0);
  p_set('front10', ri('rtFront10'));
  rc.params.front10_feed = q('rtFront10Feed').trim();   /* 等结算未命中时拖豆的格子(如 2-3) */
  p_set('front30', ri('rtFront30'));
  rc.params.front30_feed = q('rtFront30Feed').trim();
  p_set('deck2_tail3_first', ri('rtTail3First'));
  p_set('beilei_stop', ri('rtBeileiStop'));
  p_set('bailuo_from', ri('rtBailuoFrom'));
  rc.params.wave_mode = (document.getElementById('rtWaveMode') || {}).value || '';
  rc.params.boss_feed_early = q('rtBossFeedEarly').trim();
  rc.params.boss_feed_late = q('rtBossFeedLate').trim();
  /* 小关抛花（西部同构） */
  var V2th = V2.throw = V2.throw || { on: false, slot: 1, cells: [] };
  V2th.on = !!((document.getElementById('rtThrowOn') || {}).checked);
  V2th.slot = ri('rtThrowSlot') || 1;
  V2th.cells = (q('rtThrowCells') || '').split(/[,\s，，]+/).filter(function(x){ return /^[1-9]-[1-5]$/.test(x); }).slice(0, 4);
  function p_set(k, v){ rc.params[k] = v; }
  return rc;
}
function v2WriteRouteUI(){
  var rc = V2.route, q = function(id){ return document.getElementById(id); };
  if (!q('rtMode')) return;
  q('rtMode').value = rc.mode;
  q('rtD2Tails').value = (rc.tail.d2 || []).join(',');
  q('rtBossTails').value = (rc.tail.boss || []).join(',');
  q('rtDeck2Lv').value = (rc.phase.deck2Levels || []).join(',');
  q('rtBossEarly').value = rc.phase.bossEarlyFeed || 20;
  q('rtFarmFrom').value = rc.phase.farmFrom || 21;
  q('rtStart').value = rc.params.start_level || 1;
  q('rtDeck1First').value = rc.params.deck1_first || '';
  if (q('rtFastMode')) q('rtFastMode').checked = !!rc.params.fast_mode;
  q('rtFront10').value = rc.params.front10 || '';
  q('rtFront10Feed').value = rc.params.front10_feed || '';
  q('rtFront30').value = rc.params.front30 || '';
  q('rtFront30Feed').value = rc.params.front30_feed || '';
  q('rtTail3First').value = rc.params.deck2_tail3_first || '';
  q('rtBeileiStop').value = rc.params.beilei_stop || '';
  if (q('rtBailuoFrom')) q('rtBailuoFrom').value = rc.params.bailuo_from || '';
  if (q('rtWaveMode')) q('rtWaveMode').value = rc.params.wave_mode || '';
  var V2th = V2.throw = V2.throw || { on: false, slot: 1, cells: [] };
  if (q('rtThrowOn')) q('rtThrowOn').checked = !!V2th.on;
  if (q('rtThrowSlot')) q('rtThrowSlot').value = V2th.slot || 1;
  if (q('rtThrowCells')) q('rtThrowCells').value = (V2th.cells || []).join(',');
  if (q('rtBossFeedEarly')) q('rtBossFeedEarly').value = rc.params.boss_feed_early || '';
  if (q('rtBossFeedLate')) q('rtBossFeedLate').value = rc.params.boss_feed_late || '';
  v2RouteRender();
  v2RouteModeUI();
}
/* 按当前模式显隐无关字段：phase 专用字段在 tail/none 下藏起来，tail 计数参数在 none 下藏起来，
   避免「填了不生效」的困惑（字段值仍保留在 state 里，切回模式即恢复）。 */
function v2RouteModeUI(){
  var mode = (V2.route && V2.route.mode) || 'tail';
  var els = document.querySelectorAll('[data-rtmode]');
  for (var i = 0; i < els.length; i++){
    var want = els[i].getAttribute('data-rtmode') || 'all';
    els[i].style.display = (want === 'all' || want.split(/\s+/).indexOf(mode) > -1) ? '' : 'none';
  }
}
function v2RouteRender(){
  var box = document.getElementById('rtSimBody');
  var rt = v2ReadRouteUI();
  var from = parseInt((document.getElementById('rtFrom') || {}).value) || V2.route.params.start_level || 1;
  var to = parseInt((document.getElementById('rtTo') || {}).value) || 149;
  var cls = { '普': 'rk-pu', 'd2': 'rk-d2', 'boss': 'rk-boss', 'build_deck1': 'rk-pu', 'build_deck2': 'rk-d2',
              'farm_post20': 'rk-farm', 'boss_direct_feed': 'rk-boss', 'boss_dianda_feed': 'rk-boss' };
  var html = '<table class="v2table"><tr><th>关</th><th>尾</th><th>路由</th><th>卡组</th><th>备注</th></tr>';
  var rows = v2RouteRange(rt, from, Math.min(to, from + 199));
  rows.forEach(function(r){
    html += '<tr' + (r.target.indexOf('boss') === 0 ? ' class="rk-bossrow"' : '') + '><td>' + r.level +
      '</td><td>' + r.tail + '</td><td><span class="' + (cls[r.target] || '') + '">' + r.target + '</span></td><td>' +
      (r.deck === 2 ? 'deck2' : 'deck1') + '</td><td>' + (r.notes || []).join('；') + '</td></tr>';
  });
  html += '</table>';
  if (box) box.innerHTML = html;
  v2RouteStrip(rt, from, Math.min(to, from + 199));
  /* 尾数映射九宫格 */
  var tg = document.getElementById('rtTailMap');
  if (tg){
    var d2t = rt.tail.d2 || [], bt = rt.tail.boss || [];
    tg.innerHTML = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function(t){
      var c = bt.indexOf(t) > -1 ? 'tm-boss' : d2t.indexOf(t) > -1 ? 'tm-d2' : 'tm-pu';
      return '<span class="tmcell ' + c + '">' + t + '</span>';
    }).join('') + '<span class="v2muted">←尾数→路由</span>';
  }
  /* 区间统计 + 关卡清单 + 耗时估算 */
  var stBox = document.getElementById('rtStats');
  if (stBox){
    var st = v2RouteStats(rt, from, Math.min(to, from + 199));
    var per10 = Object.keys(st.per10).sort(function(a, b){ return a - b; }).map(function(k){
      var v = st.per10[k];
      return k + '~' + (+k + 9) + '：普' + v.d1 + ' d2' + v.d2 + ' boss' + v.boss;
    }).join('<br>');
    stBox.innerHTML =
      '<b>区间统计</b>：deck1 普关 ' + st.d1 + '（挂机期 ' + st.farm + '）· deck2 ' + st.d2 + ' · Boss ' + st.boss + '<br>' +
      '<span class="v2muted">' + per10 + '</span>' +
      '<div class="v2muted">Boss 关：' + (st.bossList.join(',') || '无') + '</div>' +
      '<div class="v2muted">deck2 关：' + (st.d2List.join(',') || '无') + '</div>';
    var an = parseFloat((document.getElementById('rtAvgN') || {}).value) || 55;
    var ab = parseFloat((document.getElementById('rtAvgB') || {}).value) || 50;
    document.getElementById('rtEstimate').textContent = v2EstimateTime(rt, from, Math.min(to, from + 199), an, ab);
  }
  /* 单关详解 */
  var det = document.getElementById('rtDetail');
  if (det){
    var lv2 = parseInt((document.getElementById('rtDetailLv') || {}).value) || from;
    det.textContent = v2RouteDetail(rt, lv2);
  }
  /* 配置校验摘要 */
  var ctx = { subSlotsOn: subSlotsOn && (slotNames.slice(8, 16).join('') !== ''), d2Filled: subSlotsOn && slotNames.slice(8, 16).join('') !== '',
              bossReady: (V2.boss.ops || []).length > 0 };
  var issues = v2RouteIssues(rt, ctx);
  var rep = document.getElementById('rtIssues');
  if (rep){
    rep.value = issues.length ? issues.map(function(i){ return '[' + i[0] + '/' + i[1] + '] ' + i[2]; }).join('\n')
                              : '✓ 路由配置无问题（R1~R6）';
  }
  /* 导出参数预览 */
  var prev = document.getElementById('rtPreview');
  if (prev){
    var pr = rt.params;
    var extra = [];
    if (pr.deck1_first) extra.push('"deck1_first": ' + pr.deck1_first);
    if (pr.front30) extra.push('"front30": ' + pr.front30);
    if (pr.front10) extra.push('"front10": ' + pr.front10);
    if (pr.deck2_tail3_first) extra.push('"deck2_tail3_first": ' + pr.deck2_tail3_first);
    if (pr.beilei_stop) extra.push('"beilei_stop": ' + pr.beilei_stop);
    if (pr.bailuo_from) extra.push('"bailuo_from": ' + pr.bailuo_from);
    if (rt.mode === 'tail' && pr.front30 && pr.front30_feed) extra.push('"front30_feed": "' + pr.front30_feed + '"');
    var cap = '{"start_level": {关卡}';
    if (extra.length) cap += ', ' + extra.join(', ');
    cap += '}';
    prev.value =
      '【fx_counter 参数（计步节点 custom_action_param）】\n' + cap +
      '\n\n【input 选项 verify 正则（字符类陷阱：^([1-149])$ 只匹配 1/4/9）】\n' +
      '^([1-9]|[1-9][0-9]|1[0-4][0-9])$' +
      '\n\n【红线】同一 custom 节点只允许一个 input 选项覆盖；input override 后 agent 收到的是双层编码，' +
      'agent 端 _parse_param 必须解两层；双任务共用 agent 勿同时跑。\n' +
      '【语义】route:false=只计数不路由（补给段）；absolute:true=无视当前计数直接设 start（Boss直开）；' +
      'force:true=重置到1强制（无尽刷新）；重置到1 必须直连 初始化完毕。';
  }
}
function v2RouteStrip(rt, from, to){
  var cv = document.getElementById('rtStrip');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var W = cv.width = cv.clientWidth || 760, H = cv.height = 34;
  ctx.clearRect(0, 0, W, H);
  var n = to - from + 1;
  var x = function(lv){ return Math.floor((lv - from) / n * (W - 2)) + 1; };
  for (var lv = from; lv <= to; lv++){
    var r = v2RouteLevel(rt, lv);
    ctx.fillStyle = r.target === 'd2' || r.target === 'build_deck2' ? '#e8964a' :
                    r.target.indexOf('boss') === 0 ? '#d4574e' :
                    r.target === 'farm_post20' ? '#4aa38a' : '#5b87c5';
    ctx.fillRect(x(lv), 4, Math.max(1, Math.floor((W - 2) / n)), H - 12);
  }
  var p = rt.params || {};
  var marks = [];
  if (rt.mode === 'tail'){
    if (p.deck1_first) marks.push([p.deck1_first, 'deck1_first=' + p.deck1_first]);
    if (p.front30) marks.push([p.front30, 'front30=' + p.front30]);
    if (p.deck2_tail3_first) marks.push([p.deck2_tail3_first, 'tail3=' + p.deck2_tail3_first]);
    if (p.beilei_stop) marks.push([p.beilei_stop, 'beilei=' + p.beilei_stop]);
    if (p.bailuo_from) marks.push([p.bailuo_from, 'bailuo=' + p.bailuo_from]);
  }
  ctx.fillStyle = '#333';
  ctx.font = '10px sans-serif';
  marks.forEach(function(m){
    ctx.fillRect(x(m[0]), 0, 1, H);
    ctx.fillText(m[1], Math.min(x(m[0]) + 2, W - 90), H - 2);
  });
  ctx.fillText(from + '→' + to + '（蓝=deck1 橙=deck2 红=Boss 绿=挂机期）', W - 260, 10);
}

function initRoutePanel(){
  ['rtMode', 'rtD2Tails', 'rtBossTails', 'rtDeck2Lv', 'rtBossEarly', 'rtFarmFrom', 'rtStart',
   'rtDeck1First', 'rtFront10', 'rtFront10Feed', 'rtFront30', 'rtFront30Feed', 'rtTail3First', 'rtBeileiStop',
   'rtFrom', 'rtTo', 'rtAvgN', 'rtAvgB', 'rtDetailLv',
   'rtThrowOn', 'rtThrowSlot', 'rtThrowCells', 'rtBossFeedEarly', 'rtBossFeedLate',
   'rtBailuoFrom', 'rtWaveMode'].forEach(function(id){
    var e = document.getElementById(id);
    if (!e) return;
    /* ⚠ 顺序必须是「先读 DOM 进 state，再落盘/渲染」。
       旧写法 save(); v2WriteRouteUI() 会先拿旧 state 回写输入框，
       手动输入在生效前就被覆盖（2026-09-10 实测：只有点预设才生效）。 */
    e.addEventListener('change', function(){ v2ReadRouteUI(); save(); v2RouteRender(); v2RouteModeUI(); });
  });
  var bt = document.getElementById('rtSelfTest');
  if (bt) bt.addEventListener('click', function(){
    var r = v2RouteSelfTest();
    document.getElementById('rtSelfTestOut').value =
      '测试向量 ' + r.pass + '/' + r.total + ' 通过' + (r.failed.length ? '\n✗ 失败: ' + r.failed.join('；') : '\n✓ 全部通过（模拟器与 agent 逻辑一致）');
  });
  /* 已验证参数一键填充 */
  var pb = document.getElementById('rtPresetBar');
  if (pb) pb.addEventListener('click', function(e){
    var b = e.target.closest('button[data-rp]');
    if (!b) return;
    var pre = V2_ROUTE_PRESETS.filter(function(x){ return x.name === b.dataset.rp; })[0];
    if (!pre) return;
    V2.route.mode = pre.mode;
    V2.route.params = Object.assign({ start_level: 1, deck1_first: 0, front10: 0, front10_feed: '', front30: 0, front30_feed: '',
      deck2_tail3_first: 0, beilei_stop: 0, boss_feed_early: '', boss_feed_late: '' }, pre.args || {});
    if (pre.phase) V2.route.phase = v2Clone(pre.phase);
    save();
    v2WriteRouteUI();
    showToast('已填充「' + pre.name + '」已验证参数');
  });
  var dv = document.getElementById('rtDetailBtn');
  if (dv) dv.addEventListener('click', v2RouteRender);
  v2WriteRouteUI();
}
