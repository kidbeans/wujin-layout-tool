/* ================= v2 Boss 编辑器（ops 有序操作链 + 校验 B1~B6） =================
 * ops: stack{cell,slot,pre,post} | feed{cell,pre,post,loop} | accel{post} | flower{cell}
 * 范式自呈现：复兴=两轮叠种→花→加速→循环喂豆；童话=喂豆→加速→喂豆→循环；西部=叠→首喂→加速→叠→循环。
 */
"use strict";

function v2RenderBoss(){
  var box = document.getElementById('bossOps');
  if (!box) return;
  var ops = V2.boss.ops || (V2.boss.ops = []);
  var icon = { stack: '叠', feed: '豆', accel: '加', flower: '花' };
  var html = '';
  ops.forEach(function(o, i){
    html += '<div class="ordrow" data-i="' + i + '">' +
      '<span class="ordbadge t-' + (o.t === 'accel' ? 'accel' : o.t) + '">' + (icon[o.t] || '?') + (i + 1) + '</span>';
    if (o.t === 'stack'){
      html += '<input class="ordcell" data-f="cell" data-i="' + i + '" value="' + (o.cell || '') + '" size="4" title="叠到哪格">' +
        '<select class="ordslot" data-f="slot" data-i="' + i + '">' +
        slotNames.slice(0, 8).map(function(n, si){ return '<option value="' + (si + 1) + '"' + (o.slot === si + 1 ? ' selected' : '') + '>' + (si + 1) + ':' + (n || '空') + '</option>'; }).join('') + '</select>' +
        '<input type="number" class="ordpd" data-f="post" data-i="' + i + '" value="' + (o.post == null ? 0 : o.post) + '" title="post ms" size="3">';
    } else if (o.t === 'feed'){
      html += '<label class="ordchk"><input type="checkbox" data-f="loop" data-i="' + i + '"' + (o.loop ? ' checked' : '') + '>循环</label>' +
        '<input class="ordcell" data-f="cell" data-i="' + i + '" value="' + (o.cell || '') + '" size="4" title="喂哪格">' +
        '<input type="number" class="ordpd" data-f="post" data-i="' + i + '" value="' + (o.post == null ? 1500 : o.post) + '" title="post ms" size="3">';
    } else if (o.t === 'flower'){
      html += '<input class="ordcell" data-f="cell" data-i="' + i + '" value="' + (o.cell || '') + '" size="4" title="能量花种哪格">';
    } else {
      html += '<input type="number" class="ordpd" data-f="post" data-i="' + i + '" value="' + (o.post == null ? 300 : o.post) + '" title="post ms" size="3">';
    }
    html += '<span class="ordtxt">' + (o.name ? '（' + o.name.replace(/^[a-z_]+?_/, '') + '）' : '') + '</span>' +
      '<button class="ordmv" data-mv="up" data-i="' + i + '">↑</button>' +
      '<button class="ordmv" data-mv="dn" data-i="' + i + '">↓</button>' +
      '<button class="ordmv" data-mv="del" data-i="' + i + '">✕</button></div>';
  });
  if (!ops.length) html = '<div class="v2hint">（空）用下方按钮添加：叠种→(能量花)→加速→喂豆(末步勾"循环")。四套预设含真实链。</div>';
  box.innerHTML = html;
  var opt = document.getElementById('bossFeedSelect');
  if (opt) opt.checked = !!V2.boss.feedSelect;
  var dbg = document.getElementById('bossDebugCard');
  if (dbg) dbg.checked = V2.debugCardUI !== false;
}

function v2BossBind(){
  var box = document.getElementById('bossOps');
  if (!box) return;
  box.addEventListener('click', function(e){
    var b = e.target.closest('button'); if (!b) return;
    var i = +b.dataset.i, ops = V2.boss.ops;
    if (b.dataset.mv === 'del') ops.splice(i, 1);
    else if (b.dataset.mv === 'up' && i > 0){ var t = ops[i - 1]; ops[i - 1] = ops[i]; ops[i] = t; }
    else if (b.dataset.mv === 'dn' && i < ops.length - 1){ var t2 = ops[i + 1]; ops[i + 1] = ops[i]; ops[i] = t2; }
    else return;
    save(); v2RenderBoss();
  });
  box.addEventListener('change', function(e){
    var el = e.target, f = el.dataset.f; if (!f) return;
    var o = V2.boss.ops[+el.dataset.i]; if (!o) return;
    if (f === 'loop') o.loop = el.checked;
    else if (f === 'slot') o.slot = +el.value;
    else if (f === 'post') o.post = +el.value || 0;
    else if (f === 'cell') o.cell = el.value.trim();
    save(); v2RenderBoss();
  });
  var addBar = document.getElementById('bossAddBar');
  if (addBar) addBar.addEventListener('click', function(e){
    var b = e.target.closest('button'); if (!b) return;
    var ops = V2.boss.ops, k = b.dataset.add;
    if (k === 'stack'){ var c = prompt('叠种格（列-行，如 2-3）', '2-3'); if (c) ops.push({ t: 'stack', cell: c.trim(), slot: 8, pre: 0, post: 0 }); }
    else if (k === 'feed'){ var c2 = prompt('喂豆格（列-行）', V2.boss.feedCell || '2-3'); if (c2) ops.push({ t: 'feed', cell: c2.trim(), pre: 100, post: 1500, loop: false }); }
    else if (k === 'flower'){ var c3 = prompt('能量花格', '6-1'); if (c3) ops.push({ t: 'flower', cell: c3.trim() }); }
    else if (k === 'accel'){ ops.push({ t: 'accel', name: '点加速', post: 300 }); }
    save(); v2RenderBoss();
  });
  var fs = document.getElementById('bossFeedSelect');
  if (fs) fs.addEventListener('change', function(){ V2.boss.feedSelect = fs.checked; save(); });
  var dbg = document.getElementById('bossDebugCard');
  if (dbg) dbg.addEventListener('change', function(){ V2.debugCardUI = dbg.checked; save(); });
  var val = document.getElementById('bossValidate');
  if (val) val.addEventListener('click', function(){
    var rep = v2BossIssues();
    document.getElementById('bossReport').value =
      rep.length ? rep.map(function(r){ return '[' + r[0] + '/' + r[1] + '] ' + r[2]; }).join('\n') : '✓ Boss 链校验通过（B1~B6）';
  });
}

/* ---- 校验 B1~B6 ---- */
function v2BossIssues(){
  var out = [];
  var ops = V2.boss.ops || [];
  if (!ops.length){ out.push(['B0', 'warn', 'Boss 链为空（尾数分流模式下 Boss 关将无流程）']); return out; }
  var stackCells = {};
  ops.forEach(function(o){ if (o.t === 'stack') stackCells[o.cell] = 1; });
  /* B1 目标格有植物（叠种/喂豆） */
  ops.forEach(function(o){
    if (o.t !== 'feed' || !o.cell) return;
    var pc = v2ParseCell(o.cell);
    var cell = (grid[pc.r] || [])[pc.c];
    var has = cell && (cell.base || stackCells[o.cell]);
    if (!has) out.push(['B1', 'error', '喂豆目标 ' + o.cell + ' 在棋盘上无植物（叠种格也计入）']);
  });
  ops.forEach(function(o){
    if (o.t !== 'stack' || !o.cell) return;
    var pc = v2ParseCell(o.cell);
    var cell = (grid[pc.r] || [])[pc.c];
    if (!cell || !cell.base) out.push(['B1', 'warn', '叠种格 ' + o.cell + ' 棋盘无本体植物（叠电大需落在原大/大哥格上）']);
  });
  /* B2 循环喂豆必须在末步且靠识别结算打断 */
  var loops = ops.map(function(o, i){ return o.t === 'feed' && o.loop ? i : -1; }).filter(function(i){ return i >= 0; });
  if (!loops.length) out.push(['B2', 'error', '没有勾选「循环」的喂豆步（Boss 需循环喂豆 + 识别结算打断）']);
  loops.forEach(function(i){
    if (i !== ops.length - 1) out.push(['B2', 'warn', '第 ' + (i + 1) + ' 步循环喂豆后面还有操作（循环步应放链尾）']);
  });
  /* B5 喂豆节奏 */
  ops.forEach(function(o, i){
    if (o.t === 'feed' && o.loop && (o.post || 0) < 800)
      out.push(['B5', 'warn', '第 ' + (i + 1) + ' 步循环喂豆 post=' + o.post + '（经验值≥1500，过短豆子跟不上）']);
  });
  /* B6 血厚教训提醒 */
  var feedCells = [];
  ops.forEach(function(o){ if (o.t === 'feed' && feedCells.indexOf(o.cell) === -1) feedCells.push(o.cell); });
  if (feedCells.length > 1)
    out.push(['B6', 'info', '多目标喂豆（' + feedCells.join('→') + '）：历史教训——不要把主力（如心叶兰）前的豆挪给他格，血厚 Boss 会卡死（童话 boss_unify 教训）']);
  if (ops.some(function(o){ return o.t === 'accel'; }) === false)
    out.push(['B4', 'warn', '没有「点加速」步（进关不加速+中途加速是已验证骨架）']);
  /* B7 Boss 关走配队1（deck1 卡槽1-8），叠种引用卡槽9-16 会摸到本 deck 的其他卡（静默种错） */
  ops.forEach(function(o, i){
    if (o.t !== 'stack' || !o.slot || o.slot <= 8) return;
    out.push(['B7', 'error', '第 ' + (i + 1) + ' 步叠种引用卡槽' + o.slot + '（deck2 区）——Boss 关走配队1，种子栏只有卡槽1-8，该位置会摸到本 deck 的其他卡。修法：把该卡放进 deck1 卡槽 1-8，或改用 1-8 内的同名卡']);
  });
  return out;
}
