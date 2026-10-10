/* ================= v2 遍历顺序编辑器（deck1/deck2 种植链） =================
 * item 模型：plant{check?}/wave/interleave/sweep/shovel/feed/accel
 * 校验规则 O1~O8；一键草案生成；画笔追加；徽章绘制。
 */
"use strict";

var v2OrderDeck = 'deck1';

function v2OrderItems(deck){ return V2.order[deck || v2OrderDeck] || (V2.order[deck || v2OrderDeck] = []); }

var V2_OP_LABEL = { plant: '种', wave: '波', interleave: '缝', sweep: '扫', shovel: '铲', feed: '豆', accel: '加', slide: '滑' };
/* 抛蕾后滑阳光：阳光蓓蕾/蓓蕾 种完后自动在其左右各一列附近竖滑捡阳光（720 短边坐标）。
 * 与复兴/童话的「蓓蕾滑8列/9列/右侧」同款：x=1114(8列)/1204(9列)/1233(右缘)，y 167→600。 */
var SUN_PK_NAMES = ['阳光蓓蕾', '蓓蕾'];
var SUN_SLIDE_COLS = [['8列', 1114], ['9列', 1204], ['右侧', 1233]];
var SUN_SLIDE_ROUNDS = 3;
function v2SunSlides(){
  var out = [];
  for (var r = 1; r <= SUN_SLIDE_ROUNDS; r++)
    for (var i = 0; i < SUN_SLIDE_COLS.length; i++)
      out.push({ t: 'slide', name: '蓓蕾滑' + SUN_SLIDE_COLS[i][0] + '_' + r,
        begin: [SUN_SLIDE_COLS[i][1], 167], end: [SUN_SLIDE_COLS[i][1], 600], duration: 150, post: 100 });
  return out;
}
function v2ItemLabel(it){
  switch (it.t){
    case 'plant': return (it.check ? '[检]' : '') + v2SlotName(it.slot) + ' → ' + it.cell;
    case 'wave': return it.name;
    case 'interleave': return '识别结算（插缝）';
    case 'sweep': return (it.name || '捡花') + ' ' + (typeof it.begin === 'string' ? it.begin : '(数组)') + '→' +
      (typeof it.end === 'string' ? it.end : '(数组)') + ' ×' + (it.repeat || 1);
    case 'shovel': return '铲除 @ ' + it.cell;
    case 'feed': return '喂豆 @ ' + (it.cell || '选卡格') + (it.loop ? '（循环）' : '');
    case 'accel': return it.name || '点加速';
    case 'slide': return (it.name || '滑阳光') + ' ' +
      (typeof it.begin === 'string' ? it.begin : '[' + (it.begin || []).join(',') + ']') + '→' +
      (typeof it.end === 'string' ? it.end : '[' + (it.end || []).join(',') + ']');
  }
  return '?';
}

/* ---- 列表渲染 ---- */
function v2RenderOrder(){
  var box = document.getElementById('ordList');
  if (!box) return;
  var deckSel = document.getElementById('ordDeck');
  if (deckSel && deckSel.value !== v2OrderDeck){ v2OrderDeck = deckSel.value; }
  var items = v2OrderItems();
  var d2 = v2OrderDeck === 'deck2';
  var html = '';
  items.forEach(function(it, i){
    var editable = it.t === 'plant';
    html += '<div class="ordrow" draggable="true" data-i="' + i + '">' +
      '<span class="ordbadge t-' + it.t + '">' + (V2_OP_LABEL[it.t] || '?') + (i + 1) + '</span>';
    if (editable){
      html += '<label class="ordchk"><input type="checkbox" data-f="check" data-i="' + i + '"' + (it.check ? ' checked' : '') + '>检</label>' +
        '<input class="ordcell" data-f="cell" data-i="' + i + '" value="' + (it.cell || '') + '" title="列-行" size="4">' +
        '<select class="ordslot" data-f="slot" data-i="' + i + '">' +
        slotNames.map(function(n, si){ return '<option value="' + (si + 1) + '"' + (it.slot === si + 1 ? ' selected' : '') + '>' + (si + 1) + ':' + (n || '空') + '</option>'; }).join('') +
        '</select>' +
        '<input type="number" class="ordpd" data-f="pre" data-i="' + i + '" value="' + (it.pre || 0) + '" title="pre ms" size="3">' +
        '<input type="number" class="ordpd" data-f="post" data-i="' + i + '" value="' + (it.post == null ? 100 : it.post) + '" title="post ms" size="3">';
    } else if (it.t === 'sweep'){
      html += '<span class="ordtxt">' + v2ItemLabel(it) + '</span>';
    } else if (it.t === 'feed'){
      html += '<label class="ordchk"><input type="checkbox" data-f="loop" data-i="' + i + '"' + (it.loop ? ' checked' : '') + '>循环</label>' +
        '<input class="ordcell" data-f="cell" data-i="' + i + '" value="' + (it.cell || '') + '" size="4">' +
        '<input type="number" class="ordpd" data-f="post" data-i="' + i + '" value="' + (it.post == null ? 1500 : it.post) + '" title="喂豆循环间隔 ms（=喂豆节点 post_delay）" size="3">';
    } else if (it.t === 'shovel'){
      html += '<input class="ordcell" data-f="cell" data-i="' + i + '" value="' + (it.cell || '') + '" size="4">' +
        '<input type="number" class="ordpd" data-f="post" data-i="' + i + '" value="' + (it.post == null ? 100 : it.post) + '" title="post ms" size="3">';
    } else {
      html += '<span class="ordtxt">' + v2ItemLabel(it) + '</span>';
    }
    html += '<span class="ordalt">' + (it.alt ? '⤷' + it.alt.replace(/^[a-z_]+?_(?=d?[12]_)/, '') : '') + '</span>' +
      '<button class="ordmv" data-mv="up" data-i="' + i + '" title="上移">↑</button>' +
      '<button class="ordmv" data-mv="dn" data-i="' + i + '" title="下移">↓</button>' +
      '<button class="ordmv" data-mv="del" data-i="' + i + '" title="删除">✕</button>' +
      '</div>';
  });
  if (!items.length) html = '<div class="v2hint">（空）点「从棋盘生成草案」生成初稿；或用下方 +种植/+喂豆等手动加步（自动插到链尾点波之前），拖拽/↑↓调位，行内可改格子/卡槽/pre/post。</div>';
  box.innerHTML = html;
  var cnt = document.getElementById('ordCount');
  if (cnt) cnt.textContent = items.length + ' 步';
  /* 面板内撤销/重做按钮：栈空置灰（v2UndoStack/v2RedoStack 在 10_state 定义） */
  var ub = document.getElementById('ordUndo'), rb = document.getElementById('ordRedo');
  if (ub) ub.disabled = !(typeof v2UndoStack !== 'undefined' && v2UndoStack.length);
  if (rb) rb.disabled = !(typeof v2RedoStack !== 'undefined' && v2RedoStack.length);
}

function v2OrderBind(){
  var box = document.getElementById('ordList');
  if (!box) return;
  var dragI = null;
  box.addEventListener('click', function(e){
    var b = e.target.closest('button'); if (!b) return;
    var i = +b.dataset.i, items = v2OrderItems();
    if (b.dataset.mv === 'del'){ items.splice(i, 1); }
    else if (b.dataset.mv === 'up' && i > 0){ var t = items[i - 1]; items[i - 1] = items[i]; items[i] = t; }
    else if (b.dataset.mv === 'dn' && i < items.length - 1){ var t2 = items[i + 1]; items[i + 1] = items[i]; items[i] = t2; }
    else return;
    save(); v2RenderOrder(); renderGrid();
  });
  box.addEventListener('change', function(e){
    var el = e.target, f = el.dataset.f; if (!f) return;
    var it = v2OrderItems()[+el.dataset.i]; if (!it) return;
    if (f === 'check') it.check = el.checked;
    else if (f === 'loop') it.loop = el.checked;
    else if (f === 'slot') it.slot = +el.value;
    else if (f === 'pre' || f === 'post') it[f] = +el.value || 0;
    else if (f === 'cell') it.cell = el.value.trim();
    save(); v2RenderOrder(); renderGrid();
  });
  box.addEventListener('dragstart', function(e){
    var row = e.target.closest('.ordrow'); if (!row) return;
    dragI = +row.dataset.i;
    e.dataTransfer.setData('text/plain', 'ord');
  });
  /* ④ 拖拽实时落点（2026-10-10）：dragover 按光标在目标行上/下半算插入索引，
     .orddrop(上沿蓝线)/.orddropend(末行下沿蓝线) 指示；drop 用该索引，删源后右移修正 */
  var dropI = null;
  function clearMark(){
    var m = box.querySelector('.orddrop,.orddropend');
    if (m) m.classList.remove('orddrop', 'orddropend');
    dropI = null;
  }
  box.addEventListener('dragover', function(e){
    e.preventDefault();
    var row = e.target.closest('.ordrow'); if (!row || dragI === null) return;
    var items = v2OrderItems();
    var rect = row.getBoundingClientRect();
    var to = +row.dataset.i + (e.clientY > rect.top + rect.height / 2 ? 1 : 0);
    if (to === dropI) return;
    clearMark();
    dropI = to;
    var ref = to < items.length ? box.querySelector('.ordrow[data-i="' + to + '"]')
                                : box.querySelector('.ordrow[data-i="' + (items.length - 1) + '"]');
    if (ref) ref.classList.add(to < items.length ? 'orddrop' : 'orddropend');
  });
  box.addEventListener('dragleave', function(e){ if (!box.contains(e.relatedTarget)) clearMark(); });
  box.addEventListener('drop', function(e){
    e.preventDefault();
    if (dragI === null) return;
    var items = v2OrderItems();
    var to = dropI;
    clearMark();
    if (to === null){
      var row = e.target.closest('.ordrow');
      if (!row){ dragI = null; return; }
      to = +row.dataset.i;
    }
    var moved = items.splice(dragI, 1)[0];
    if (to > dragI) to -= 1;
    items.splice(to, 0, moved);
    dragI = null;
    save(); v2RenderOrder(); renderGrid();
  });
  var ub2 = document.getElementById('ordUndo'), rb2 = document.getElementById('ordRedo');
  if (ub2) ub2.addEventListener('click', function(){ v2Undo(); });
  if (rb2) rb2.addEventListener('click', function(){ v2Redo(); });
  var dk = document.getElementById('ordDeck');
  if (dk) dk.addEventListener('change', function(){ v2OrderDeck = dk.value; save(); v2RenderOrder(); renderGrid(); });
  var gen = document.getElementById('ordGen');
  if (gen) gen.addEventListener('click', function(){
    if (!confirm('用当前棋盘重新生成「' + (v2OrderDeck === 'deck2' ? 'deck2' : 'deck1') + '」顺序草案？（覆盖现有清单，可 Ctrl+Z 撤销）')) return;
    var skipped = v2AutoGenOrder(v2OrderDeck === 'deck2' ? 2 : 1) || [];
    save(); v2RenderOrder(); renderGrid();
    if (skipped.length)
      showToast('草案已生成，但 ' + skipped.length + ' 个植物不在卡槽未入链（' + skipped.slice(0, 3).join('、') +
        (skipped.length > 3 ? ' 等' : '') + '）：到卡槽面板登记后再重新生成');
    else showToast('草案已生成，请拖拽微调');
  });
  var chk = document.getElementById('ordValidate');
  if (chk) chk.addEventListener('click', function(){
    var rep = v2OrderIssues(v2OrderDeck === 'deck2' ? 2 : 1);
    var box2 = document.getElementById('ordReport');
    box2.value = rep.length ? rep.map(function(r){ return '[' + r[0] + '/' + r[1] + '] ' + r[2]; }).join('\n') : '✓ 顺序校验通过（O1~O8）';
  });
  var addBar = document.getElementById('ordAddBar');
  if (addBar) addBar.addEventListener('click', function(e){
    var b = e.target.closest('button'); if (!b) return;
    var items = v2OrderItems();
    var k = b.dataset.add;
    if (k === 'plant'){
      var pc = prompt('种植步格子（列-行）', '2-2');
      if (!pc) return;
      var ps = prompt('卡槽序号（1-16，调试可临时借其他槽）', '1');
      if (!ps) return;
      var pn = v2SlotName(+ps) || ('卡槽' + ps);
      v2OrderInsertStep({ t: 'plant', name: pn, cell: pc.trim(), slot: +ps, pre: 0, post: 100 });
      showToast('已在链尾点波前插入种植步：' + pc + ' @ 卡槽' + ps + '（可拖拽/↑↓调位）');
      save(); v2RenderOrder(); renderGrid();
      return;
    }
    if (k === 'wave'){ var n = prompt('点波节点名（点波1/点波2/点波_初始）', '点波2'); if (n) v2OrderInsertStep({ t: 'wave', name: n.trim() }); }
    else if (k === 'interleave'){ v2OrderInsertStep({ t: 'interleave', name: '识别结算' }); }
    else if (k === 'sweep'){
      var s = prompt('捡花步：起格,终格,次数', '7-1,7-4,30');
      if (s){ var pp = s.split(','); v2OrderInsertStep({ t: 'sweep', name: '捡花', begin: pp[0].trim(), end: (pp[1] || pp[0]).trim(), repeat: +pp[2] || 30 }); }
    }
    else if (k === 'shovel'){ var c = prompt('铲除格（列-行）', '6-2'); if (c) v2OrderInsertStep({ t: 'shovel', name: '铲', cell: c.trim(), post: 100 }); }
    else if (k === 'feed'){ var c2 = prompt('喂豆格（列-行）', '6-2'); if (c2) v2OrderInsertStep({ t: 'feed', name: '喂豆', cell: c2.trim(), post: 2500 }); }
    else if (k === 'accel'){ v2OrderInsertStep({ t: 'accel', name: '点加速', post: 300 }); }
    else if (k === 'slide'){
      if (!confirm('插入标准滑阳光（8列/9列/右缘 × 3 轮竖滑，720 坐标，插在链尾点波前）？')) return;
      v2SunSlides().forEach(function(s){ v2OrderInsertStep(s); });
    }
    save(); v2RenderOrder(); renderGrid();
  });
}

/* ---- 插入助手：新步插在链尾点波（点波5/点波5_d2/点波循环）之前 ----
 * 追加到点波之后＝孤儿步：导出时点波5 特例重置 prev，后加步无人链接、永不执行
 * （2026-09-08 用户调试加植物实测踩坑）。 */
function v2OrderInsertStep(it){
  var items = v2OrderItems();
  var at = items.length;
  for (var i = items.length - 1; i >= 0; i--){
    var x = items[i];
    if (x.t === 'wave' && (x.name === '点波5' || x.name === '点波5_d2' || String(x.name).indexOf('点波循环') > -1)) at = i;
    else break;
  }
  items.splice(at, 0, it);
  return at;
}

/* ---- 画笔追加（patch applyBrush 在 90_boot 调用） ---- */
function v2OrderAppendPlant(cellId, baseName){
  var items = v2OrderItems();
  var dup = items.filter(function(x){ return x.t === 'plant' && x.cell === cellId; });
  if (dup.length){ showToast('顺序里已有 ' + cellId + ' 的种植步（未重复追加）'); return; }
  var slot = v2FindSlot(baseName);
  if (!slot){ showToast(baseName + ' 不在任何卡槽，无法追加种植步（请先在卡槽面板登记）'); return; }
  var isMat = ['原豌','电豌','火豌','冰豌','毒豌'].indexOf(baseName) > -1;
  v2OrderInsertStep({ t: 'plant', name: baseName, cell: cellId, slot: slot, pre: isMat ? 200 : 0, post: baseName === '大哥' ? 300 : 100 });
  save(); v2RenderOrder(); renderGrid();
}

/* ---- 画笔追加藤蔓步（叠在主植物外层）----
 * 小守卫菇走守卫菇喂豆/铲除成对流程，不自动追加。其余藤蔓插在链尾点波之前（=末尾）。
 * 2026-09-10 用户要求：藤蔓除小守卫菇外照常种，但放末尾。 */
function v2OrderAppendVine(cellId, name){
  if (name === '小守卫菇'){ showToast('小守卫菇走守卫菇流程，未自动追加'); return; }
  var items = v2OrderItems();
  var dup = items.filter(function(x){ return x.t === 'plant' && x.cell === cellId && x.name === name; });
  if (dup.length){ showToast('顺序里已有 ' + cellId + ' 的 ' + name + ' 步（未重复追加）'); return; }
  var vSlot = v2FindSlot(name);
  if (!vSlot){ showToast(name + ' 不在任何卡槽，无法追加藤蔓步（请先在卡槽面板登记）'); return; }
  v2OrderInsertStep({ t: 'plant', name: name, cell: cellId, slot: vSlot, pre: 0, post: 100 });
  save(); v2RenderOrder(); renderGrid();
}

/* ---- 一键草案 ---- */
function v2AutoGenOrder(deckNo){
  var cells = [], tileCells = [];
  var d2Slots = {};
  slotNames.forEach(function(n, i){ if (i >= 8 && n) d2Slots[n] = i + 1; });
  /* 本配队的瓷砖萝卜卡槽（名字含「瓷砖」，先按配队范围过滤：双配队各有瓷砖卡时互不串）。
     没有则整队不铺萝卜（如 纯火龙 deck1）——旧写法取全 16 槽里第一个瓷砖卡，
     deck1 有瓷砖卡时会误占 tslot 导致 deck2 漏铺（2026-09-13 修）。 */
  var tslot = null;
  slotNames.forEach(function(n, i){
    if (tslot === null && n && n.indexOf('瓷砖') > -1 &&
        ((deckNo === 2 && i + 1 > 8) || (deckNo === 1 && i + 1 <= 8))) tslot = i + 1;
  });
  /* 2026-10-10 用户要求：草案默认先右侧再往左（列优先，右列起，列内自上而下） */
  for (var c = cols - 1; c >= 0; c--){
    for (var r = 0; r < rows; r++){
      var cell = grid[r][c];
      if (!cell) continue;
      var base = cell.base;
      /* 瓷砖格统一记入 tileCells：空砖格与带主植物格都要铺萝卜（base=瓷砖萝卜 的格子
         本身就是萝卜步，不重复）。宿主植物的卡槽归属不影响铺砖——纯火龙 deck2 要给
         deck1 宿主的 3-1/3-3/3-4 铺砖（部署链同款）。 */
      if (cell.tile && base !== '瓷砖萝卜') tileCells.push({ r: r, c: c });
      var slot = base ? v2FindSlot(base) : null;
      var inD2 = slot && slot > 8;
      if (deckNo === 2){
        if (!inD2) continue;
      } else if (inD2) continue;
      if (!base) continue;
      cells.push({ r: r, c: c, base: base, merge: cell.merge || '', tile: !!cell.tile, slot: slot });
    }
  }
  var merges = cells.filter(function(x){ return x.base === '大哥' && x.merge; });
  var others = cells.filter(function(x){ return !(x.base === '大哥' && x.merge); });
  var key = function(x){ return (cols - 1 - x.c) * 100 + x.r; };   /* 右列优先（2026-10-10） */
  merges.sort(function(a, b){ return key(a) - key(b); });
  others.sort(function(a, b){ return key(a) - key(b); });
  /* 按卡槽分组（同槽连种，减少换卡成本），槽号升序 */
  var groups = {}, gorder = [];
  others.forEach(function(x){
    var g = x.slot || 999;
    if (!groups[g]){ groups[g] = []; gorder.push(g); }
    groups[g].push(x);
  });
  gorder.sort(function(a, b){ return a - b; });
  /* 金卡主力行覆盖排序（O9 友好，2026-09-13）：每种金卡第一关只有前 limit 个生效——
     大哥融合块按位置序先占前 limit 行；之后各槽组里的同种主力若超出剩余预算
     （预算 = limit − 本草稿已排该种步数，融合材料也算用量），前 budget 格排成
     「未覆盖行优先」，尽量让第一关每行都有活主力
     （纯火龙实测：暗物质前 3 = 3-4/4-5/3-1，与部署链手工调序一致）。
     追踪类（迫击炮）计入覆盖但不豁免超次；辅助（气流/珊瑚）不参与重排。 */
  var goldSets = (typeof v2SimSets === 'function') ? v2SimSets() : null;
  var coveredRows = {}, usedKind = {};
  function markRows(arr, upTo){
    for (var i = 0; i < arr.length && i < upTo; i++) coveredRows[arr[i].r] = 1;
  }
  function isGoldMain(name){
    if (!goldSets) return false;
    if (name === '大哥') return true;
    return !!(v2IsGoldName(name) &&
      (goldSets.strong.indexOf(name) > -1 || goldSets.tracking.indexOf(name) > -1));
  }
  if (goldSets && merges.length) markRows(merges, goldSets.limit);
  function orderedGroup(arr){
    arr = arr.slice().sort(function(a, b){ return key(a) - key(b); });
    if (!goldSets) return arr;
    var byKind = {}, kinds = [];
    arr.forEach(function(x){
      if (!byKind[x.base]){ byKind[x.base] = []; kinds.push(x.base); }
      byKind[x.base].push(x);
    });
    var out = [];
    kinds.forEach(function(kind){
      var ks = byKind[kind];
      var budget = goldSets.limit - (usedKind[kind] || 0);
      if (isGoldMain(kind) && ks.length > budget && budget > 0){
        var head = [];
        ks.forEach(function(x){
          if (head.length < budget && !coveredRows[x.r]){ head.push(x); coveredRows[x.r] = 1; }
        });
        ks.forEach(function(x){ if (head.length < budget && head.indexOf(x) === -1) head.push(x); });
        out = out.concat(head, ks.filter(function(x){ return head.indexOf(x) === -1; }));
      } else {
        if (isGoldMain(kind) && budget > 0) markRows(ks, Math.min(ks.length, budget));
        out = out.concat(ks);
      }
    });
    return out;
  }
  var items = [{ t: 'wave', name: deckNo === 2 ? '点波_初始_d2' : '点波_初始' }];
  /* 卡槽缺失守卫（2026-09-14 审查修复）：植物不在任何卡槽时 slot 为 null，旧版直接生成
     slot=null 的种植步 → 导出后 begin='种植物_初始化_第undefined个槽位' 坏锚点。现改为跳过该步
     并汇总提示（旧写法还有 `|| (s1 && s1 <= 8 ? null : null)` 恒 null 的死表达式，一并清除）。 */
  var slotSkip = [];
  function pushPlant(x, name, slot, opts){
    if (!slot){ slotSkip.push(name + '@' + v2CellId(x.r, x.c)); return; }
    items.push({ t: 'plant', name: name, cell: v2CellId(x.r, x.c), slot: slot,
      pre: (opts && opts.pre) || 0, post: (opts && opts.post) || 100, check: !!(opts && opts.check),
      alt: (opts && opts.alt) || '' });
  }
  merges.forEach(function(x, idx){
    var s1 = x.slot || v2FindSlot('大哥');
    pushPlant(x, '大哥', s1, { post: 300, check: idx > 0 && merges.length >= 3 });
    if (x.merge) pushPlant(x, x.merge, v2FindSlot(x.merge), { pre: 200 });
    if (goldSets){ usedKind['大哥'] = (usedKind['大哥'] || 0) + 1; if (x.merge) usedKind[x.merge] = (usedKind[x.merge] || 0) + 1; }
  });
  if (merges.length) items.push({ t: 'wave', name: deckNo === 2 ? '点波5_d2' : '点波2' });
  gorder.forEach(function(g, gi){
    orderedGroup(groups[g]).forEach(function(x){
      pushPlant(x, x.base, x.slot, { post: x.tile ? 100 : 100 });
      if (goldSets) usedKind[x.base] = (usedKind[x.base] || 0) + 1;
    });
    if (groups[g].length >= 6) items.push({ t: 'interleave', name: '识别结算' });
  });
  /* 瓷砖萝卜统一铺链尾（主植物之后、藤蔓之前）——部署脚本成熟位置（gf2：珊瑚后、点波5 前）：
     先立住输出阵型，再补地形砖；空砖格与带宿主格一视同仁，按位置排序连种。 */
  if (tslot && tileCells.length){
    tileCells.sort(function(a, b){ return key(a) - key(b); });
    tileCells.forEach(function(x){ pushPlant(x, '瓷砖萝卜', tslot, { post: 100 }); });
  }
  /* 藤蔓层（DEFAULT_VINE = 毒藤/南瓜头/豆藤/小守卫菇，叠在主植物外层）：
     除「小守卫菇」（走守卫菇喂豆/铲除成对流程，不自动生成）外，其余照常生成种植步，
     但统一放到**链尾**（末尾点波5 之前）——先种好底下的主植物，再套藤蔓/包壳。
     按藤蔓自己的卡槽判所属 deck；只在有宿主(base 非空)的格子上生成。 */
  var vines = [];
  for (var vr = 0; vr < rows; vr++){
    for (var vc = 0; vc < cols; vc++){
      var vcell = grid[vr][vc];
      if (!vcell || !vcell.vine || vcell.vine === '小守卫菇' || !vcell.base) continue;
      var vslot = v2FindSlot(vcell.vine);
      if (!vslot) continue;
      if ((deckNo === 2 && vslot <= 8) || (deckNo !== 2 && vslot > 8)) continue;
      vines.push({ r: vr, c: vc, name: vcell.vine, slot: vslot });
    }
  }
  vines.sort(function(a, b){ return key(a) - key(b); });
  vines.forEach(function(x){ pushPlant(x, x.name, x.slot, { post: 100 }); });
  /* 自动识别抛蓓蕾：草案里只要有「阳光蓓蕾/蓓蕾」步，就在**最后一株之后**插入滑阳光
     （8列/9列/右缘 × 3 轮竖滑，720 坐标），捡掉蓓蕾产出的阳光。与复兴/童话同款。 */
  var lastPk = -1;
  items.forEach(function(x, i){ if (x.t === 'plant' && SUN_PK_NAMES.indexOf(x.name) > -1) lastPk = i; });
  if (lastPk > -1) items.splice.apply(items, [lastPk + 1, 0].concat(v2SunSlides()));
  items.push({ t: 'wave', name: deckNo === 2 ? '点波5_d2' : '点波5' });
  if (deckNo === 2 && items.length){
    /* deck2 链尾必须专属点波5_d2：移除中途误插的 deck1 点波标记 */
    items = items.filter(function(it, i){
      if (it.t !== 'wave') return true;
      if (i === 0) return true;
      return it.name === '点波5_d2' || it.name.indexOf('点波_初始') === 0;
    });
    if (items[items.length - 1].name !== '点波5_d2') items.push({ t: 'wave', name: '点波5_d2' });
  }
  V2.order[deckNo === 2 ? 'deck2' : 'deck1'] = items;
  return slotSkip;
}

/* ---- 校验 O1~O8 ---- */
function v2OrderIssues(deckNo){
  var out = [];
  var deck = deckNo === 2 ? 'deck2' : 'deck1';
  var items = V2.order[deck] || [];
  var slotLo = deckNo === 2 ? 9 : 1, slotHi = deckNo === 2 ? 16 : 8;
  /* O1 覆盖完备 */
  var cover = {}, seen = {};
  items.forEach(function(it){
    if (it.t === 'plant' && it.cell){
      var k = it.cell + '#' + it.slot;
      if (seen[k]) out.push(['O1', 'error', '重复种植步：' + it.cell + ' 槽' + it.slot]);
      seen[k] = 1; cover[it.cell] = 1;
    }
  });
  /* O1b 种植/铲/喂步必须有格子坐标（无 end 的 Swipe 运行时无法落点）；plant 还必须有卡槽
     （缺 slot 导出后 begin='种植物_初始化_第undefined个槽位' 坏锚点，2026-09-14 审查修复） */
  items.forEach(function(it, i){
    if ((it.t === 'plant' || it.t === 'shovel' || it.t === 'feed') && !it.cell)
      out.push(['O1', 'error', '第 ' + (i + 1) + ' 步 ' + it.t + ' 缺格子坐标（cell 为空，导出的 Swipe 节点无法落点）']);
    if (it.t === 'plant' && !it.slot)
      out.push(['O1', 'error', '第 ' + (i + 1) + ' 步 ' + (it.name || '种植') + ' @' + (it.cell || '') + ' 缺卡槽（slot 为空，导出锚点会变成「第undefined个槽位」坏节点。修法：在卡槽面板登记该植物后重新生成/重选卡槽）']);
  });
  var expect = {};
  for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++){
    var cell = grid[r][c];
    if (!cell || !cell.base || v2Consumable(cell.base)) continue;
    var s = v2FindSlot(cell.base);
    var isMerge = cell.base === '大哥' && cell.merge;
    var inDeck = deckNo === 2 ? (s && s > 8) : !(s && s > 8);
    if (!inDeck) continue;
    expect[v2CellId(r, c)] = 1;
  }
  Object.keys(expect).forEach(function(cid){
    if (!cover[cid]) out.push(['O1', 'error', '漏种：' + cid + '（棋盘有 ' + (function(){ var pc = v2ParseCell(cid); return grid[pc.r][pc.c].base; })() + '，清单无）']);
  });
  /* O2/O3/O4 融合对（只对「大哥+融合材料」成对判定；瓷砖同格/守卫菇换种/抛花不计） */
  var byCell = {};
  items.forEach(function(it){
    if (it.t === 'plant' && it.cell && !v2Consumable(v2SlotName(it.slot)))
      (byCell[it.cell] = byCell[it.cell] || []).push(it);
  });
  var MATS = ['原豌', '电豌', '火豌', '冰豌', '毒豌'];
  var mergeCells = [];
  Object.keys(byCell).forEach(function(cid){
    var arr = byCell[cid];
    var bi = -1;
    for (var i = 0; i < arr.length; i++) if (v2SlotName(arr[i].slot) === '大哥'){ bi = i; break; }
    if (bi === -1 || bi >= arr.length - 1) return;
    var big = arr[bi], mat = arr[bi + 1];
    var matName = v2SlotName(mat.slot);
    if (MATS.indexOf(matName) === -1) return;   /* 大哥后跟瓷砖/其他 → 非融合对，跳过 */
    mergeCells.push(cid);
    if (!((big.post || 0) >= 300 || (mat.pre || 0) >= 200))
      out.push(['O3', 'warn', cid + '：融合时序偏紧（大哥 post ' + (big.post || 0) + ' / 材料 pre ' + (mat.pre || 0) + '；卡顿环境建议大哥 post≥300，稳妥用 1500/200）']);
  });
  if (mergeCells.length >= 3){
    mergeCells.forEach(function(cid, i){
      var hasCheck = byCell[cid].some(function(x){ return x.check; });
      if (i > 0 && !hasCheck) out.push(['O4', 'warn', cid + '：融合组≥3格，此格缺金卡检测（位置应随顺序落在末 1~2 格附近）']);
      if (i === 0 && hasCheck) out.push(['O4', 'info', cid + '：首格通常直接种，检测一般放第 2 格起']);
    });
  } else if (mergeCells.length){
    out.push(['O4', 'info', '融合格 ' + mergeCells.join(',') + '（<3 格可不做金卡检测）']);
  }
  /* O5 插缝 */
  var seg = 0, segStart = 0, guardFlow = false;
  items.forEach(function(it, i){
    if (it.t === 'plant') seg++;
    if (it.t === 'shovel') guardFlow = true;
    if (it.t === 'interleave'){
      if (guardFlow) out.push(['O5', 'error', '第 ' + (i + 1) + ' 步：守卫菇流程内不插缝（保持成对处理）']);
      if (seg > 8) out.push(['O5', 'info', '第 ' + segStart + '~' + (i + 1) + ' 步共 ' + seg + ' 种无插缝（波短时中段插识别结算可提速）']);
      seg = 0; segStart = i + 1; guardFlow = false;
    }
    if (it.t === 'wave') { seg = 0; segStart = i + 1; guardFlow = false; }
  });
  if (seg > 8) out.push(['O5', 'info', '链尾 ' + seg + ' 种无插缝（可考虑）']);
  /* O6 deck2 专属点波（空列表视为未配置，跳过）；海盗式自循环「点波循环」同样合规 */
  if (deckNo === 2 && items.length){
    var last = items[items.length - 1];
    var lastOk = last && last.t === 'wave' && (last.name === '点波5_d2' || String(last.name).indexOf('点波循环') > -1);
    if (!lastOk)
      out.push(['O6', 'error', 'deck2 链尾必须是「点波5_d2」自循环或专属点波循环（绝不能进 deck1 点波1/2 循环）']);
    items.forEach(function(it, i){
      if (it.t === 'wave' && (it.name === '点波1' || it.name === '点波2') && i > 0 && i < items.length - 1)
        out.push(['O6', 'error', '第 ' + (i + 1) + ' 步：deck2 链中出现 deck1 点波标记 ' + it.name]);
    });
  }
  /* O7 捡花 */
  var hasThrow = false;
  for (var r2 = 0; r2 < rows; r2++) for (var c2 = 0; c2 < cols; c2++){
    var cc = grid[r2][c2];
    if (cc && cc.ops && (cc.ops.indexOf('抛花') > -1 || cc.ops.indexOf('抛蕾') > -1)) hasThrow = true;
    if (cc && (cc.base === '能量花')) hasThrow = true;
  }
  var hasSweep = items.some(function(it){ return it.t === 'sweep'; });
  if (hasThrow && !hasSweep) out.push(['O7', 'info', '棋盘有抛花/能量花但顺序无捡花步（豆子会浪费）']);
  /* O8 post 常规值 */
  items.forEach(function(it){
    if (it.t === 'plant' && it.post != null && [0, 100, 300, 500, 1000, 1500, 2500].indexOf(it.post) === -1)
      out.push(['O8', 'info', it.cell + ' post=' + it.post + '（非常规值，确认是否有意）']);
  });
  /* O10 卡槽归属：进关后种子栏只显示当前配队的 8 卡（官方锚点仅 1~8 号物理槽）。
     deck1 步引用卡槽9-16 / deck2 步引用卡槽1-8 = 物理位置上是本 deck 的卡 → 静默种错（2026-09-06
     通用简单无尽 deck1 火豌@卡槽14 实例：位置6 摸到的是 deck1 卡槽6 暗物质，不是火豌） */
  items.forEach(function(it, i){
    if (it.t !== 'plant' || !it.slot) return;
    var bad = deckNo === 1 ? it.slot > 8 : it.slot <= 8;
    if (!bad) return;
    var nm = v2SlotName(it.slot);
    var alt = -1;
    for (var k = slotLo; k <= slotHi; k++) if (slotNames[k - 1] === nm){ alt = k; break; }
    var zone = deckNo === 1 ? 'deck2 区（卡槽9-16）' : 'deck1 区（卡槽1-8）';
    if (alt > 0)
      out.push(['O10', 'info', '第 ' + (i + 1) + ' 步 ' + nm + '@' + it.cell + ' 引用卡槽' + it.slot + '（' + zone + '）——本 deck 卡槽' + alt + ' 也有同名卡，建议改用卡槽' + alt]);
    else
      out.push(['O10', 'error', '第 ' + (i + 1) + ' 步 ' + nm + '@' + it.cell + ' 引用卡槽' + it.slot + '（' + zone + '）——进 ' + (deckNo === 1 ? 'deck1' : 'deck2') +
        ' 关后种子栏只有本 deck 的 8 卡，该位置会摸到别的卡、静默种错（融合/守阵都会断）。修法：把这组种植步（含同格检步）挪到能出「' + nm + '」的 deck 顺序，或在本 deck 卡槽1-8 腾位放此卡']);
  });
  /* O10b 检的坐标校准范围说明（卡槽3 = 部署脚本实测值；其余槽位按官方探针推算） */
  items.forEach(function(it, i){
    if (it.t === 'plant' && it.check && it.slot){
      var phys = ((it.slot - 1) % 8) + 1;
      if (phys !== 3) out.push(['O10', 'info', '第 ' + (i + 1) + ' 步检在卡槽' + it.slot + '——金卡检测条实测校准的是卡槽3，其余槽位坐标按官方探针推算，首次部署请实测验证']);
    }
  });
  return out;
}
