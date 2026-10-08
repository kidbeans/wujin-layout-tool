/* ================= 42_frame_io.js —— MaaPvz 官方通用框架（custom 前期 + fw 后期）单 JSON 导入/导出 =================
 * 格式：MaaFramework 选项集 {"option": {...}}（模板来自 window.FRAME_TPL，由官方资源生成）。
 * 布阵编码：卡N种第i次坐标 = input(列[1-9]/行[1-5]) 的 default 值；守卫菇/铲子/喂豆/补卡同理。
 * 导出：画布(前期主棋盘 + 后期分阵) → 官方选项树（未用分支保留官方 No 缺省，保证路由正确）。
 * 导入：选项树 → 画布（卡N→卡槽N 布阵；守卫菇/铲除/喂豆 → 格子动作；卡槽N_i坐标 → 后期分阵）。
 */
"use strict";

/* ---- 收集画布布阵（官方框架为单卡组：卡槽1~8 + 后期补卡） ---- */
function v2FrameCollect(){
  var slotCells = {}, guardCells = [], shovelCells = [], feedCell = null;
  function scan(g, into){
    var per = {};
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++){
      var cell = g[r][c];
      if (!cell || !cell.base) continue;
      if (cell.base === '大守卫菇' || cell.base === '守卫菇'){
        if (into === 'main' && guardCells.length < 5) guardCells.push({ c: c + 1, r: r + 1 });
        continue;
      }
      var put = function(name){
        var s = v2FindSlot(name);
        if (!s) return;
        if (into === 'main' && s > 8) return;              /* 通用框架只用卡槽1~8 */
        if (into === 'late' && (s < 2 || s > 8)) return;   /* 补卡2~8 */
        (per[s] = per[s] || []).push({ c: c + 1, r: r + 1 });
      };
      put(cell.base);
      if (cell.merge) put(cell.merge);                     /* 融合材料 = 同格另一次种植 */
      if (into === 'main'){
        if (cell.ops && cell.ops.indexOf('铲除') > -1 && shovelCells.length < 10)
          shovelCells.push({ c: c + 1, r: r + 1 });
        if (!feedCell && cell.ops && cell.ops.indexOf('喂豆') > -1) feedCell = { c: c + 1, r: r + 1 };
      }
    }
    Object.keys(per).forEach(function(k){
      per[k].sort(function(a, b){ return (a.r * 100 + a.c) - (b.r * 100 + b.c); });  /* 行优先 */
      (into === 'main' ? slotCells : (into === 'late' ? slotCells : per));           /* 占位避免误用 */
    });
    return per;
  }
  var main = scan(grid, 'main');
  var late = (splitOn && split.late) ? scan(split.late, 'late') : {};
  return { main: main, late: late, guard: guardCells, shovel: shovelCells, feed: feedCell };
}

function _frameClone(o){ return JSON.parse(JSON.stringify(o)); }
function _frameSetCoord(opt, col, row){
  var o = _frameClone(opt);
  if (o.inputs && o.inputs.length >= 2){
    o.inputs[0].default = String(col);
    o.inputs[1].default = String(row);
  }
  return o;
}
/* cases 裁剪：只保留 names 里的 case；Yes.case.option 子列表同步裁剪到 keepSubs */
function _framePrune(opt, keepCaseNames, keepSubs){
  var o = _frameClone(opt);
  if (!o.cases) return o;
  o.cases = o.cases.filter(function(c){ return keepCaseNames.indexOf(c.name) > -1; });
  o.cases.forEach(function(c){
    if (keepSubs && c.option) c.option = c.option.filter(function(n){ return keepSubs.indexOf(n) > -1; });
  });
  return o;
}
function _frameCase(opt, caseName){
  var o = _frameClone(opt);
  o.cases = (o.cases || []).filter(function(c){ return c.name === caseName; });
  return o;
}

/* ---- 导出：画布 → 官方选项树单 JSON ---- */
function v2ExportFrameJSON(phaseLevel, bossFeedSec){
  var T = window.FRAME_TPL;
  if (!T) { showToast('通用框架模板未加载（32_frame_templates.js）'); return null; }
  var data = v2FrameCollect();
  var out = { option: {} };
  ['custom', 'fw', 'patch', 'magic', 'flower'].forEach(function(g){
    Object.keys(T[g] || {}).forEach(function(k){ out.option[k] = _frameClone(T[g][k]); });
  });
  var O = out.option;
  var warns = [];
  var usedCoords = {};   /* 已布阵坐标选项名；末尾删除模板基线里未用的 */

  /* 前期：卡1~8种植（第i次坐标 default = 布阵格） */
  for (var N = 1; N <= 8; N++){
    var cardName = '卡' + N + '种植';
    var cells = data.main[N] || [];
    var tplCard = T.custom[cardName];
    if (!tplCard) continue;
    if (!cells.length){
      O[cardName] = _framePrune(tplCard, ['No']);
      continue;
    }
    if (cells.length > 25) warns.push('卡' + N + ' 超过 25 次种植，只导出前 25');
    var yes = _frameCase(tplCard, 'Yes');
    yes.cases[0].option = [];
    for (var i = 1; i <= 25; i++){
      var nmS = '卡' + N + '种第' + i + '次', nmC = nmS + '坐标';
      if (i <= cells.length && T.custom[nmS] && T.custom[nmC]){
        O[nmS] = _frameClone(T.custom[nmS]);
        O[nmC] = _frameSetCoord(T.custom[nmC], cells[i - 1].c, cells[i - 1].r); usedCoords[nmC] = 1;
        yes.cases[0].option.push(nmS);
      } else if (T.custom[nmS]){
        O[nmS] = _framePrune(T.custom[nmS], ['No']);   /* 未用：仅 No（种植物i DoNothing） */
      }
    }
    O[cardName] = yes;
  }

  /* 守卫菇位置1~5 */
  var gTplSwitch = T.custom['frame_wj_custom_是否种守卫菇'];
  if (data.guard.length && gTplSwitch){
    var gy = _frameCase(gTplSwitch, 'Yes');
    gy.cases[0].option = (gy.cases[0].option || []).slice(0, data.guard.length);
    O['frame_wj_custom_是否种守卫菇'] = gy;
    for (var k = 1; k <= 5; k++){
      var gn = 'frame_wj_custom_种守卫菇位置' + k, gc = gn + '坐标';
      if (!T.custom[gc]) continue;
      if (k <= data.guard.length) { O[gc] = _frameSetCoord(T.custom[gc], data.guard[k - 1].c, data.guard[k - 1].r); usedCoords[gc] = 1; }
      else O[gn] = _framePrune(T.custom[gn] || {}, ['No']);
    }
  } else if (gTplSwitch) {
    O['frame_wj_custom_是否种守卫菇'] = _framePrune(gTplSwitch, ['No']);
  }

  /* 铲子：前5（铲子1）/ 后5（铲子2） */
  [['frame_wj_custom_是否使用铲子1', 0, 5], ['frame_wj_custom_是否使用铲子2', 5, 10]].forEach(function(cfg){
    var sw = cfg[0], lo = cfg[1], hi = cfg[2];
    var tpl = T.custom[sw];
    if (!tpl) return;
    var used = data.shovel.slice(lo, hi);
    if (!used.length){
      O[sw] = _framePrune(tpl, ['No']);
      return;
    }
    var y = _frameCase(tpl, 'Yes');
    y.cases[0].option = (y.cases[0].option || []).slice(0, used.length);
    O[sw] = y;
    for (var i = 0; i < 5; i++){
      var nm = 'frame_wj_custom_使用铲子' + (lo + i + 1), nc = nm + '坐标';
      if (!T.custom[nc]) continue;
      if (i < used.length) { O[nc] = _frameSetCoord(T.custom[nc], used[i].c, used[i].r); usedCoords[nc] = 1; }
      else if (T.custom[nm]) O[nm] = _framePrune(T.custom[nm], ['No']);
    }
  });

  /* 喂豆（前期）：小关喂豆位置 + Boss喂豆位置/间隔 */
  if (data.feed){
    if (T.custom['frame_wj_custom_布完阵是否喂豆'])
      O['frame_wj_custom_布完阵是否喂豆'] = _frameCase(T.custom['frame_wj_custom_布完阵是否喂豆'], 'Yes');
    if (T.custom['frame_wj_custom_喂豆位置坐标']){
      O['frame_wj_custom_喂豆位置坐标'] = _frameSetCoord(T.custom['frame_wj_custom_喂豆位置坐标'], data.feed.c, data.feed.r);
      usedCoords['frame_wj_custom_喂豆位置坐标'] = 1;
    }
    if (T.custom['frame_wj_boss_custom_喂豆间隔'] && bossFeedSec){
      var bi = _frameClone(T.custom['frame_wj_boss_custom_喂豆间隔']);
      if (bi.inputs && bi.inputs[0]) bi.inputs[0].default = String(bossFeedSec);
      O['frame_wj_boss_custom_喂豆间隔'] = bi;
    }
    if (T.custom['frame_wj_boss_custom_喂豆位置'])
      O['frame_wj_boss_custom_喂豆位置'] = _frameCase(T.custom['frame_wj_boss_custom_喂豆位置'], 'Yes');
    if (T.custom['frame_wj_boss_custom_喂豆位置坐标'] && data.feed){
      O['frame_wj_boss_custom_喂豆位置坐标'] = _frameSetCoord(T.custom['frame_wj_boss_custom_喂豆位置坐标'], data.feed.c, data.feed.r);
      usedCoords['frame_wj_boss_custom_喂豆位置坐标'] = 1;
    }
  }

  /* 前期转后期（第几关布好阵） */
  if (phaseLevel && T.custom['frame_wj_custom_回到后期']){
    var rl = _frameClone(T.custom['frame_wj_custom_回到后期']);
    if (rl.inputs && rl.inputs[0]) rl.inputs[0].default = String(phaseLevel);
    O['frame_wj_custom_回到后期'] = rl;
  }

  /* 后期：补植物（卡槽2~8） */
  var lateAny = Object.keys(data.late).some(function(k){ return (data.late[k] || []).length; });
  if (lateAny && T.patch['是否需要补植物'])
    O['是否需要补植物'] = _frameCase(T.patch['是否需要补植物'], 'Yes');
  for (var n2 = 2; n2 <= 8; n2++){
    var lcells = data.late[n2] || [];
    for (var j = 1; j <= 10; j++){
      var sn = '卡槽' + n2 + '_' + j, sc = sn + '坐标';
      if (!T.patch[sc]) continue;
      if (j <= lcells.length){
        O[sn] = _frameCase(T.patch[sn] || {}, 'Yes');
        O[sc] = _frameSetCoord(T.patch[sc], lcells[j - 1].c, lcells[j - 1].r); usedCoords[sc] = 1;
        if (T.patch[sn] && !O[sn]) O[sn] = _frameClone(T.patch[sn]);
      } else if (T.patch[sn]) {
        O[sn] = _framePrune(T.patch[sn], ['No']);
      }
    }
  }

  /* 清理：删除模板基线自带、但本布阵未使用的坐标选项（否则导入方无法区分） */
  Object.keys(O).forEach(function(k){
    if (/^卡\d+种第\d+次坐标$/.test(k) && !usedCoords[k]) delete O[k];
    else if (/^frame_wj_custom_种守卫菇位置\d+坐标$/.test(k) && !usedCoords[k]) delete O[k];
    else if (/^frame_wj_custom_使用铲子\d+坐标$/.test(k) && !usedCoords[k]) delete O[k];
    else if (/^卡槽\d+_\d+坐标$/.test(k) && !usedCoords[k]) delete O[k];
  });
  if (!data.feed){
    delete O['frame_wj_custom_喂豆位置坐标'];
    delete O['frame_wj_boss_custom_喂豆位置坐标'];
  }
  if (warns.length) out.option.__warns = warns;   /* 极少触发；读取方可忽略 */
  return out;
}

/* ---- 导入：官方选项树单 JSON → 画布 ---- */
function v2ImportFrameJSON(text){
  var d;
  try { d = JSON.parse(text); } catch (e){ return { ok: false, err: 'JSON 解析失败：' + e.message }; }
  var O = d && d.option ? d.option : d;
  if (!O || typeof O !== 'object') return { ok: false, err: '不是选项集 JSON（缺 option）' };
  function coord(name){
    var o = O[name];
    if (!o || !o.inputs || o.inputs.length < 2) return null;
    var c = parseInt(o.inputs[0].default, 10), r = parseInt(o.inputs[1].default, 10);
    if (!(c >= 1 && c <= 9) || !(r >= 1 && r <= 5)) return null;
    return { c: c, r: r };
  }
  var mainCells = [], lateCells = [], guards = [], shovels = [], notes = [];
  for (var N = 1; N <= 8; N++){
    for (var i = 1; i <= 25; i++){
      var p = coord('卡' + N + '种第' + i + '次坐标');
      if (p) mainCells.push({ slot: N, c: p.c, r: p.r });
    }
  }
  for (var k = 1; k <= 5; k++){
    var g = coord('frame_wj_custom_种守卫菇位置' + k + '坐标');
    if (g) guards.push(g);
  }
  for (var s2 = 1; s2 <= 10; s2++){
    var sh = coord('frame_wj_custom_使用铲子' + s2 + '坐标');
    if (sh) shovels.push(sh);
  }
  var feed = coord('frame_wj_custom_喂豆位置坐标') || coord('frame_wj_boss_custom_喂豆位置坐标');
  for (var n2 = 2; n2 <= 8; n2++){
    for (var j = 1; j <= 10; j++){
      var lp = coord('卡槽' + n2 + '_' + j + '坐标');
      if (lp) lateCells.push({ slot: n2, c: lp.c, r: lp.r });
    }
  }
  /* 官方原版模板守卫：frame_custom.json 等资源文件所有坐标均为默认 1-1（布阵在 MaaPvz 运行时才配置），
     不做任何放置，只提示用户从可视化编辑器导出含布阵的 JSON */
  function allDefault(arr){ return arr.length > 0 && arr.every(function(p){ return p.c === 1 && p.r === 1; }); }
  var anyCoord = mainCells.length + lateCells.length + guards.length + shovels.length;
  var looksTemplate = anyCoord > 0 &&
    [mainCells, lateCells, guards, shovels].every(function(arr){ return !arr.length || allDefault(arr); });
  if (looksTemplate){
    return { ok: true, main: 0, late: 0, guards: 0, shovels: 0, template: true,
             notes: ['这是官方框架模板（所有坐标均为默认 1-1，未含实际布阵）。',
                     '请在 MaaPvz 可视化编辑器布好阵并「导出 JSON」后，再导入该文件；或直接用本工具画布布阵后「📤 通用框架 JSON」导出。'] };
  }
  if (!mainCells.length && !lateCells.length && !guards.length)
    return { ok: false, err: '未识别到布阵坐标（确认是官方通用框架导出的选项集 JSON）' };

  /* 应用到画布 */
  if (typeof v2UndoStack !== 'undefined' && typeof v2SerializeAll === 'function')
    v2UndoStack.push(v2SerializeAll());
  grid = Array.from({ length: rows }, function(){ return Array.from({ length: cols }, function(){ return null; }); });
  mainCells.forEach(function(m){
    var name = slotNames[m.slot - 1];
    if (!name){ notes.push('卡' + m.slot + ' 未在卡槽配置名称，跳过 ' + m.c + '-' + m.r); return; }
    var ex = grid[m.r - 1][m.c - 1];
    if (!ex) grid[m.r - 1][m.c - 1] = { base: name, merge: '', vine: '', tile: false, ops: [] };
    else if (name === '大哥'){                          /* 大哥永远做融合基底 */
      if (ex.base !== '大哥') ex.merge = ex.base;
      ex.base = '大哥';
    } else ex.merge = name;                             /* 同格第二张卡 = 融合材料 */
  });
  guards.forEach(function(g){
    if (!grid[g.r - 1][g.c - 1]) grid[g.r - 1][g.c - 1] = { base: '大守卫菇', merge: '', vine: '', tile: false, ops: [] };
  });
  shovels.forEach(function(sh){
    var cell = grid[sh.r - 1][sh.c - 1];
    if (cell){ cell.ops = cell.ops || []; if (cell.ops.indexOf('铲除') === -1) cell.ops.push('铲除'); }
  });
  if (feed){
    var fc = grid[feed.r - 1][feed.c - 1];
    if (fc){ fc.ops = fc.ops || []; if (fc.ops.indexOf('喂豆') === -1) fc.ops.push('喂豆'); }
    else notes.push('喂豆位置 ' + feed.c + '-' + feed.r + ' 落在空格（已忽略）');
  }
  if (lateCells.length){
    if (!splitOn){ splitOn = true; split = { early: null, late: null }; }
    if (!split.late) split.late = Array.from({ length: rows }, function(){ return Array.from({ length: cols }, function(){ return null; }); });
    lateCells.forEach(function(m){
      var name = slotNames[m.slot - 1];
      if (!name){ notes.push('补卡' + m.slot + ' 未在卡槽配置名称，跳过 ' + m.c + '-' + m.r); return; }
      split.late[m.r - 1][m.c - 1] = { base: name, merge: '', vine: '', tile: false, ops: [] };
    });
  }
  save(); buildAllChips(); renderSlots(); renderGrid(); updateStatus();
  if (typeof v2RefreshPanels === 'function') v2RefreshPanels();
  var lv = O['frame_wj_custom_回到后期'] && O['frame_wj_custom_回到后期'].inputs;
  if (lv && lv[0] && lv[0].default) notes.push('第几关布好阵：' + lv[0].default + '（可在此调整）');
  return { ok: true, main: mainCells.length, late: lateCells.length, guards: guards.length,
           shovels: shovels.length, notes: notes };
}

/* ---- 文件选择导入（官方画像卡片 / 导出面板复用） ---- */
function v2FrameImportPick(){
  var inp = document.getElementById('frameImportFile');
  if (!inp){
    inp = document.createElement('input');
    inp.id = 'frameImportFile';
    inp.type = 'file';
    inp.accept = '.json,.jsonc,.txt';
    inp.style.display = 'none';
    document.body.appendChild(inp);
  }
  inp.onchange = function(){
    var f = inp.files && inp.files[0];
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function(){
      var r = v2ImportFrameJSON(String(rd.result));
      var msg = !r.ok ? ('❌ ' + r.err)
        : (r.template ? 'ℹ️ ' + r.notes.join(' ')
        : '✅ 已导入：前期布阵 ' + r.main + ' 格 · 守卫菇 ' + r.guards + ' · 铲除 ' + r.shovels +
          ' · 后期补卡 ' + r.late + ' 格' + (r.notes.length ? '；' + r.notes.join('；') : ''));
      if (typeof showToast === 'function') showToast(msg);
      var outBox = document.getElementById('v2Out');
      if (outBox) outBox.value = msg;
      inp.value = '';
    };
    rd.readAsText(f, 'utf-8');
  };
  inp.click();
}

/* ---- 面板接线（导出 v2 面板） ---- */
(function v2FrameIOBind(){
  if (typeof document === 'undefined' || !document.getElementById) return;
  var ex = document.getElementById('ex2Frame');
  if (ex) ex.addEventListener('click', function(){
    var lv = prompt('前期转后期：第几关布好阵？（1~149，非5的倍数）', '30');
    if (lv === null) return;
    var sec = prompt('前期 Boss关喂豆间隔（秒，1~10）', '3');
    if (sec === null) return;
    var json = v2ExportFrameJSON(parseInt(lv, 10) || 30, parseInt(sec, 10) || 3);
    if (!json) return;
    var text = JSON.stringify(json, null, 1);
    var outBox = document.getElementById('v2Out');
    if (outBox) outBox.value = text;
    v2Download('通用框架_自定义布阵.json', text);
    var n = 0; Object.keys(json.option).forEach(function(k){ n++; });
    showToast('已导出官方通用框架单 JSON（' + n + ' 个选项），可从 MaaPvz 可视化编辑器「导入 JSON」');
  });
  var im = document.getElementById('ex2FrameImp');
  if (im) im.addEventListener('click', function(){
    var box = document.getElementById('v2Out');
    var text = box ? box.value : '';
    if (!text.trim()){ v2FrameImportPick(); return; }   /* 空时直接走文件选择 */
    var r = v2ImportFrameJSON(text);
    if (!r.ok){ showToast('解析失败：' + r.err); return; }
    var msg = '已导入：前期布阵 ' + r.main + ' 格 · 守卫菇 ' + r.guards + ' · 铲除 ' + r.shovels +
      ' · 后期补卡 ' + r.late + ' 格' + (r.notes.length ? '；' + r.notes.join('；') : '');
    if (box) box.value = msg;
    showToast('通用框架布阵已应用到画布');
  });
})();
