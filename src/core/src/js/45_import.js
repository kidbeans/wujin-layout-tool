/* ================= v2 MPZ pipeline 导入器（45_import.js） =================
 * 走链规则与 tools/gen_presets.py 同源：判定节点 → 布阵链 → 植物/金卡检测/扫动/喂豆/铲除/点波/加速。
 * 纯逻辑函数（v2ImportAnalyze / v2ImportApply）无 DOM 依赖，node 可单测；UI 由 v2ImportBind 装配。
 */
"use strict";

var V2_IMP_CN = '一二三四五六七八九十';
var V2_IMP_MERGE = ['原豌', '电豌', '火豌', '冰豌', '毒豌'];
var V2_IMP_VINE = ['毒藤'];

function v2ImpBase(n, p){ return (n && p && n.indexOf(p) === 0) ? n.slice(p.length) : (n || ''); }
function v2ImpCell(end){ var m = /格子(\d)_(\d)$/.exec(String(end || '')); return m ? m[1] + '-' + m[2] : null; }
function v2ImpSlot(begin){
  var m = /第(.+?)个槽位/.exec(String(begin || ''));
  if (!m) return null;
  var i = V2_IMP_CN.indexOf(m[1]);
  return i > -1 ? i + 1 : null;
}
function v2ImpPlantName(b){
  var nm = String(b || '').replace(/\d+_\d+$/, '').replace(/^d[12]_/, '');
  if (/^Deck\d*种植/.test(nm)) return '';
  if (nm.indexOf('Deck2') === 0) nm = nm.slice(5);
  if (/^抛花\d*$/.test(nm)) nm = '能量花';
  if (nm === '坚果') nm = '全息坚果';
  if (nm === '气流' || nm === '气流水仙' || nm === '水仙') nm = '气流水仙花';
  if (nm === '洋芋地雷') nm = '洋芋';
  if (nm === '大哥2') nm = '大哥';
  if (nm === '蓓蕾') nm = '阳光蓓蕾';
  if (nm === '守卫菇') nm = '大守卫菇';
  return nm;
}
function v2ImpIsMach(b){
  if (/^(识别开始战斗|识别boss关|识别结算|过渡|判断是否进入关内|判断进入关内_deck2|判断进入关内_boss|判断进入关内_后期|计步|计步_补给|计步_boss_start|计步分流|尾数路由|重置计数|重置到1|监控开关|初始化完毕|重置关卡计数|关卡自增|boss_识别开始|boss_识别结算|boss_补给等选卡|boss_判断是否进入关内|补给|提示|给豆1_2|狂点5s|捡花2_1)$/.test(b)) return true;
  if (/^神器补给_/.test(b) || /^确定[1-4]$/.test(b) || /^wujin_/.test(b)) return true;
  if (/^配队[12]/.test(b) || /^开始游戏/.test(b)) return true;
  if (/^haidao_/.test(b) || /^路由_/.test(b)) return true;
  if (/^重试配队/.test(b) || /^boss_分支/.test(b)) return true;
  return false;
}

/* 沿 next 走链产出生顺序 item；next[0]==识别结算 时记插缝并走 next[1]（与 gen_presets.walk_chain 一致） */
function v2ImpWalkChain(p, start, pfx, deck, stopNames, slotmap){
  var items = [], seen = {}, cur = start;
  while (cur && !seen[cur]){
    seen[cur] = true;
    var d = p[cur] || {};
    var b = v2ImpBase(cur, pfx);
    var act = d.action || '', rec = d.recognition || '';
    var begin = d.begin || '', end = d.end || '';
    var pre = d.pre_delay || 0, post = d.post_delay || 0;
    var nxt = Array.isArray(d.next) ? d.next : [];
    var it = null, s = v2ImpSlot(begin);
    if (b.indexOf('点波') === 0 || b.indexOf('点波循环') > -1){
      it = { t: 'wave', name: b };
      if (stopNames.indexOf(b) > -1){ items.push(it); return items; }
    } else if (rec === 'ColorMatch' && act === 'Swipe' && v2ImpCell(end)){
      it = { t: 'plant', name: b, cell: v2ImpCell(end),
             slot: (deck === 1) ? s : (s > 8 ? s : (s || 0) + 8), pre: pre, post: post, check: true };
    } else if (act === 'Swipe' && String(begin).indexOf('能量豆') > -1){
      it = { t: 'feed', name: b, cell: v2ImpCell(end), pre: pre, post: post, loop: nxt.indexOf(cur) > -1 };
    } else if (act === 'Swipe' && String(begin).indexOf('铲子') > -1){
      it = { t: 'shovel', name: b, cell: v2ImpCell(end), post: post };
    } else if (act === 'Swipe' && s){
      it = { t: 'plant', name: b, cell: v2ImpCell(end),
             slot: (deck === 1) ? s : (s > 8 ? s : s + 8), pre: pre, post: post };
    } else if (act === 'Swipe' && (v2ImpCell(begin) || Array.isArray(begin)) && (v2ImpCell(end) || Array.isArray(end))){
      it = { t: 'sweep', name: b,
             begin: typeof begin === 'string' ? v2ImpCell(begin) : begin,
             end: typeof end === 'string' ? v2ImpCell(end) : end,
             repeat: d.repeat || 1 };
    } else if (act === 'Click' && b.indexOf('加速') > -1){
      it = { t: 'accel', name: b, post: post };
    } else if (rec === 'OCR' && act === 'Click' && String(d.expected || '').indexOf('继续') > -1){
      it = { t: 'interleave', name: '识别结算' };
    }
    /* item.name 保留原始节点名（构建器依赖唯一性）；植物名在棋盘构建时再解析 */
    if (it) items.push(it);
    if (!nxt.length) return items;
    var b0 = v2ImpBase(nxt[0], pfx);
    if (v2ImpIsMach(b0) && stopNames.indexOf(b0) === -1){
      if (b0 === '识别结算' && nxt.length > 1){
        items.push({ t: 'interleave', name: '识别结算' });
        cur = nxt[1]; continue;
      }
      return items;
    }
    if (nxt.length > 1 && items.length && it) it.alt = nxt[1];
    cur = nxt[0];
  }
  return items;
}

/* Boss 链走链（与 gen_presets.walk_boss 一致；喂豆回环/交替识别） */
function v2ImpWalkBoss(p, pfx, start){
  var b0 = start || (pfx + '识别boss关');
  if (!p[b0]) return [];
  var ops = [], seen = {}, cur = b0;
  while (cur && !seen[cur]){
    seen[cur] = true;
    var d = p[cur] || {}, b = v2ImpBase(cur, pfx);
    var nxt = Array.isArray(d.next) ? d.next : [];
    if (b === 'boss_判断是否进入关内'){ cur = nxt[0] || null; continue; }
    if (/^神器补给_/.test(b) || /^补给/.test(b) || /^确定[1-4]$/.test(b) ||
        b === '提示' || b === 'boss_补给等选卡' || b === 'boss_识别开始' || b === '计步_补给'){
      cur = nxt[0] || null; continue;
    }
    if (b.indexOf('boss_分支') === 0){ cur = nxt[0] || null; continue; }
    var act = d.action || '', begin = d.begin || '', end = d.end || '';
    var pre = d.pre_delay || 0, post = d.post_delay || 0;
    if (b.indexOf('加速') > -1 && act === 'Click'){
      ops.push({ t: 'accel', name: b, post: post });
    } else if (act === 'Swipe' && String(begin).indexOf('能量豆') > -1){
      var cyc = nxt.indexOf(cur) > -1 || nxt.some(function(x){ return String(v2ImpBase(x, pfx)).indexOf('喂豆') > -1 && seen[x]; });
      ops.push({ t: 'feed', name: b, cell: v2ImpCell(end) || '', pre: pre, post: post, loop: cyc });
      if (cyc) return ops;
      if (nxt.length > 1 && String(v2ImpBase(nxt[1], pfx)).indexOf('喂豆') > -1){ cur = nxt[1]; continue; }
    } else if (act === 'Swipe' && v2ImpSlot(begin) && v2ImpCell(end)){
      if (b.indexOf('能量花') > -1) ops.push({ t: 'flower', name: b, cell: v2ImpCell(end) });
      else ops.push({ t: 'stack', name: b, cell: v2ImpCell(end), slot: v2ImpSlot(begin), pre: pre, post: post });
    } else if (act === 'Swipe' && (v2ImpCell(begin) || Array.isArray(begin)) && (v2ImpCell(end) || Array.isArray(end))){
      ops.push({ t: 'sweep', name: b,
                 begin: typeof begin === 'string' ? v2ImpCell(begin) : begin,
                 end: typeof end === 'string' ? v2ImpCell(end) : end,
                 repeat: d.repeat || 1 });
    } else if (d.recognition === 'OCR' && String(d.expected || '').indexOf('继续') > -1){
      return ops;
    }
    cur = nxt[0] || null;
  }
  return ops;
}

function v2ImpDeckStart(p, pfx, judgeSuffix){
  var judgeKey = Object.keys(p).filter(function(k){ return k === pfx + judgeSuffix || k === judgeSuffix; })[0];
  if (!judgeKey) return null;
  var cur = (p[judgeKey].next || [null])[0];
  for (var i = 0; i < 10 && cur; i++){
    var b = v2ImpBase(cur, pfx);
    if (!v2ImpIsMach(b)) return cur;
    cur = (p[cur] && p[cur].next && p[cur].next[0]) || null;
  }
  return null;
}

/* 棋盘构建（与 gen_presets.build_board 一致：融合/藤蔓/瓷砖；同名重种保留藤蔓）
 * 无名种植步（Deck2种植_N）→ 槽N植物 占位（deck2 相对槽位）。 */
function v2ImpBuildBoard(d1, d2){
  var grid = [], txt = [];
  for (var r = 0; r < 5; r++){
    grid.push([]);
    for (var c = 0; c < 9; c++) grid[r].push({ base: '', merge: '', vine: '', tile: false });
  }
  (d1.concat(d2)).forEach(function(it){
    if (!it || it.t !== 'plant' || !it.cell) return;
    var pr = it.cell.split('-');
    var col = parseInt(pr[0], 10), row = parseInt(pr[1], 10);
    if (!(col >= 1 && col <= 9 && row >= 1 && row <= 5)) return;
    var g = grid[row - 1][col - 1];
    var plant = v2ImpPlantName(it.name);
    if (!plant && it.slot && it.slot > 8) plant = '槽' + (it.slot - 8) + '植物';
    if (!plant) plant = it.name;
    if (!plant) return;
    if (V2_IMP_VINE.indexOf(plant) > -1){
      if (g.base) g.vine = plant; else g.base = plant;
      return;
    }
    if (plant.indexOf('瓷砖') > -1){ g.tile = true; return; }
    if (plant === '大哥'){ g.base = '大哥'; return; }
    if (V2_IMP_MERGE.indexOf(plant) > -1 && g.base === '大哥'){ g.merge = plant; return; }
    if (V2_IMP_MERGE.indexOf(plant) > -1 && V2_IMP_MERGE.indexOf(g.base) > -1){ g.base = '大哥'; g.merge = plant; return; }
    var same = g.base === plant;
    g.base = plant; g.merge = '';
    if (!same) g.vine = '';
  });
  for (var rr = 0; rr < 5; rr++){
    var rowtxt = [];
    for (var cc = 0; cc < 9; cc++){
      var g2 = grid[rr][cc], s = g2.base;
      if (g2.vine) s = s ? s + '(' + g2.vine + ')' : g2.vine;
      if (g2.merge) s += '+' + g2.merge;
      if (g2.tile) s = s ? s + '[瓷]' : '瓷';
      rowtxt.push(s || '-');
    }
    txt.push(rowtxt.join(','));
  }
  return { compact: '9x5 布阵: ' + txt.join('|'), rows: txt };
}

/* 主入口：files=[{name,text}] → 画像 A（含报告字段）；不落 DOM */
function v2ImportAnalyze(files, prefixHint){
  var A = { ok: false, warns: [], notes: [], unknown: [] };
  if (!files || !files.length){ A.warns.push('未选择文件'); return A; }
  var mp = (typeof v2MergePipelines === 'function') ? v2MergePipelines(files)
    : (function(){ var m = {}; files.forEach(function(f){ var o = v2ParseAnyJson(f.text); if (o) for (var k in o) m[k] = o[k]; }); return { merged: m, collisions: [], notes: [] }; })();
  var p = mp.merged;
  (mp.notes || []).forEach(function(n){ A.notes.push(n); });
  (mp.collisions || []).forEach(function(c){ A.warns.push('同名节点冲突（V2）: ' + c); });
  A.nNodes = Object.keys(p).length;
  if (!A.nNodes){ A.warns.push('未解析出任何节点'); return A; }

  /* 前缀：找 判断是否进入关内 判定节点（后缀精确），多候选时列出 */
  var S_D1 = '判断是否进入关内', S_D2 = '判断进入关内_deck2', S_BOSS = '判断进入关内_boss', S_FARM = '判断进入关内_后期';
  var cands = Object.keys(p).filter(function(k){ var n = String(k); return n === S_D1 || n.slice(-S_D1.length) === S_D1; });
  if (!cands.length){ A.warns.push('未找到「判断是否进入关内」判定节点（可能不是无尽布阵脚本）'); return A; }
  var pfx = '';
  var d1Judge = cands[0];
  if (cands.length > 1){
    var hit = cands.filter(function(k){ return !prefixHint || k.indexOf(prefixHint) === 0; });
    d1Judge = hit[0] || cands[0];
    A.warns.push('多套判定节点候选：' + cands.join('、') + '；已选 ' + d1Judge + '（可用前缀输入框指定）');
  }
  pfx = d1Judge === S_D1 ? '' : d1Judge.slice(0, d1Judge.length - S_D1.length);
  A.prefix = pfx;
  A.entry = Object.keys(p).filter(function(k){ return /(_Entry|_无尽)$/.test(k); })[0] || d1Judge;

  /* 判定节点 → 走链 */
  var s1 = v2ImpDeckStart(p, pfx, S_D1), s2 = v2ImpDeckStart(p, pfx, S_D2);
  var sf = v2ImpDeckStart(p, pfx, S_FARM), sb = v2ImpDeckStart(p, pfx, S_BOSS);
  if (!s1){ A.warns.push('deck1 链首未找到'); return A; }
  var d1 = v2ImpWalkChain(p, s1, pfx, 1, ['点波5', '快速点波循环'], null);
  var d2 = s2 ? v2ImpWalkChain(p, s2, pfx, 2, ['点波5_d2', '快速点波循环'], null) : [];
  var farm = sf ? v2ImpWalkChain(p, sf, pfx, 1, ['快速点波循环'], null) : [];
  var boss = v2ImpWalkBoss(p, pfx, null);
  var dianda = null, branchKey = Object.keys(p).filter(function(k){ return k.indexOf(pfx + 'boss_分支_boss_dianda_feed') === 0; })[0];
  if (branchKey) dianda = v2ImpWalkBoss(p, pfx, branchKey);
  if (dianda && dianda.length > boss.length) boss = dianda;   /* 海盗式：叠电豌分支信息更全 */

  A.order = { deck1: d1, deck2: d2 };
  if (farm.length) A.order.farm = farm;
  A.counts = { d1: d1.length, d2: d2.length, farm: farm.length, boss: boss.length };

  /* 槽位推断：植物步的槽号 → 首个植物名 */
  function inferSlots(items){
    var m = {};
    items.forEach(function(it){
      if (it.t !== 'plant' || !it.slot || it.slot < 1 || it.slot > 8) return;
      var nm = v2ImpPlantName(it.name);
      if (nm && !m[it.slot]) m[it.slot] = nm;
    });
    var arr = [];
    for (var i = 1; i <= 8; i++) arr.push(m[i] || '');
    return arr;
  }
  A.slots = { deck1: inferSlots(d1), deck2: d2.length ? inferSlots(d2) : [] };

  /* 路由参数：计步 custom_action_param（双层解码） */
  var params = {};
  var cap = (p[pfx + '计步'] || {}).custom_action_param || '';
  try{
    params = JSON.parse(cap);
    if (typeof params === 'string') params = JSON.parse(params);
  }catch(e){ params = {}; }
  delete params.route_node; delete params.increment;
  var isPhase = Object.keys(p).some(function(k){ return /^haidao_/.test(k) || String(k).indexOf('计步分流') > -1; }) ||
    /haidao_step_route/.test(String((p[pfx + '计步'] || {}).custom_action || ''));
  A.route = { params: params, mode: isPhase ? 'phase' : (d2.length ? 'tail' : 'none') };
  if (isPhase) A.route.phase = { deck2Levels: [2, 12], bossEarlyFeed: 20, farmFrom: 21 };
  A.boss = { ops: boss, feedSelect: boss.some(function(o){ return o.t === 'feed'; }),
             feedCell: (boss.length && boss[boss.length - 1].t === 'feed' && boss[boss.length - 1].cell) || '2-3' };

  /* 棋盘 + 未知名 */
  var bb = v2ImpBuildBoard(d1, d2);
  A.board = { compact: bb.compact, rows: bb.rows, cols: 9, rowsN: 5 };
  var KNOWN = ['大哥','洋芋','桑葚','药师','气流水仙花','珊瑚','能量花','芦荟','心叶兰','水仙花','杜英','暗豌','冰西瓜投手',
    '茄子忍者','军炮','豌豆迫击炮','小黄梨','魔音','甜菜','橄榄坑','金蝉花','食人花豌豆','冰刺','白萝卜','钢地刺',
    '苹果迫击炮','斯巴达竹','喇叭花','弹簧豆','电离红掌花','吹风荚兰','潜伏芹菜','全息坚果','天使星星果','蜜蜂铃兰',
    '火鸡投手','塔黄','曼德拉','牛蒡','毁灭菇','蛇草','球果','鸭梨大弟','电鳗香蕉','大守卫菇','太极木槿','地锯草',
    '祥云飞莲','胆小菇','阳光蓓蕾','瓷砖萝卜','冰瓜','聚能山竹','火豌豆','原豌','电豌','冰豌','毒豌','凤凰木花车'];
  (d1.concat(d2, farm)).forEach(function(it){
    if (!it || it.t !== 'plant') return;
    var nm = v2ImpPlantName(it.name);
    if (nm && nm.indexOf('槽') !== 0 && KNOWN.indexOf(nm) === -1 && V2_IMP_VINE.indexOf(nm) === -1 && A.unknown.indexOf(nm) === -1) A.unknown.push(nm);
  });
  if (A.unknown.length) A.warns.push('未知植物名（将自动补进植物库，可双击格子改名）: ' + A.unknown.join('、'));
  var emptySlots = [];
  A.slots.deck1.forEach(function(n, i){ if (!n) emptySlots.push('配队1槽' + (i + 1)); });
  A.slots.deck2.forEach(function(n, i){ if (!n) emptySlots.push('配队2槽' + (i + 1)); });
  if (emptySlots.length) A.warns.push('以下槽位未在链中出现（载入后留空，请人工补名）: ' + emptySlots.join('、'));
  if (isPhase) A.notes.push('检测到相位路由（haidao 计步分流）：deck2=[2,12]、Boss 前20直喂/后叠电豌、21 关起挂机链，均按海盗默认填充');
  if (farm.length) A.notes.push('farm 挂机链 ' + farm.length + ' 步（21 关后小关用），已存入顺序数据 farm 段');
  A.ok = true;
  return A;
}

/* 应用到画布（可撤销）：棋盘/卡槽/顺序/路由/Boss 全量覆盖 */
function v2ImportApply(A, worldKey){
  if (!A || !A.ok){ showToast('请先解析出有效画像'); return false; }
  v2UndoStack.push(v2SerializeAll());
  var res = parseImport(A.board.compact);
  if (!res){ showToast('导入棋盘解析失败'); return false; }
  cols = res.cols; rows = res.rows; grid = res.grid;
  slotNames = (A.slots.deck1 || []).concat(A.slots.deck2 || []).slice(0, 16);
  while (slotNames.length < 16) slotNames.push('');
  subSlotsOn = (A.slots.deck2 || []).length > 0;
  slotNames.forEach(function(n){
    if (!n) return;
    if (V2_IMP_VINE.indexOf(n) > -1){ ensurePlant('vine', n); return; }
    ensurePlant('base', n);
  });
  V2_IMP_MERGE.forEach(function(n){ ensurePlant('merge', n); });
  V2 = v2Clone(v2Default());
  V2.world = worldKey || 'custom';
  V2.prefix = A.prefix || 'wj_';
  var pf = document.getElementById('v2Prefix');
  if (pf){ pf.value = V2.prefix; delete pf.dataset.touched; }
  V2.order = v2Clone(A.order || { deck1: [], deck2: [] });
  var rp = v2Clone((A.route && A.route.params) || {});
  V2.route.params = v2DeepMerge(v2Clone(v2Default().route.params), rp);
  V2.route.mode = (A.route && A.route.mode) || 'tail';
  if (V2.route.mode === 'phase' && A.route.phase) V2.route.phase = v2Clone(A.route.phase);
  V2.boss.ops = v2Clone((A.boss && A.boss.ops) || []);
  V2.boss.feedSelect = !!(A.boss && A.boss.feedSelect);
  V2.boss.feedCell = (A.boss && A.boss.feedCell) || '2-3';
  V2.debugCardUI = true;
  save();
  buildAllChips(); renderSlots(); renderGrid(); updateStatus();
  var bs = document.getElementById('btnSubSlots');
  if (bs){ bs.textContent = '配队2：' + (subSlotsOn ? '开' : '关'); bs.classList.toggle('on', subSlotsOn); }
  if (typeof v2RefreshPanels === 'function') v2RefreshPanels();
  return true;
}

function v2ImportReportText(A, fileNames){
  if (!A) return '';
  var L = [];
  L.push('【导入识别报告】' + (fileNames || []).join(' + '));
  if (!A.ok){
    (A.warns || []).forEach(function(w){ L.push('✗ ' + w); });
    return L.join('\n');
  }
  L.push('前缀 ' + (A.prefix || '（无前缀）') + ' · 入口 ' + (A.entry || '?') + ' · ' + A.nNodes + ' 节点');
  L.push('顺序：deck1 ' + A.counts.d1 + ' 步 / deck2 ' + A.counts.d2 + ' 步' +
    (A.counts.farm ? ' / farm ' + A.counts.farm + ' 步' : '') + ' · Boss ' + A.counts.boss + ' 步');
  L.push('路由：' + A.route.mode + ' 模式 · 参数 ' + JSON.stringify(A.route.params));
  if (A.route.phase) L.push('相位默认：deck2=' + JSON.stringify(A.route.phase.deck2Levels) +
    ' boss直喂<' + A.route.phase.bossEarlyFeed + ' farmFrom=' + A.route.phase.farmFrom);
  L.push('卡槽（推断）：deck1=' + A.slots.deck1.map(function(n, i){ return (i + 1) + ':' + (n || '—'); }).join(' ') +
    (A.slots.deck2.length ? ' | deck2=' + A.slots.deck2.map(function(n, i){ return (i + 9) + ':' + (n || '—'); }).join(' ') : ''));
  L.push('Boss ops：' + A.boss.ops.map(function(o){ return o.t + '@' + (o.cell || '-') + (o.loop ? '(循环)' : ''); }).join(' → '));
  L.push('');
  A.board.rows.forEach(function(r, i){ L.push('路' + (i + 1) + ': ' + r); });
  if (A.notes.length){ L.push(''); A.notes.forEach(function(n){ L.push('· ' + n); }); }
  if (A.warns.length){ L.push(''); A.warns.forEach(function(w){ L.push('⚠ ' + w); }); }
  L.push('');
  L.push('—— 确认无误后点「应用到画布」（可 Ctrl+Z 撤销）');
  return L.join('\n');
}

/* UI 装配 */
function v2ImportBind(){
  var inp = document.getElementById('impPipe');
  if (!inp) return;
  inp.addEventListener('change', function(){
    var fs = Array.prototype.slice.call(inp.files || []);
    if (!fs.length) return;
    var names = fs.map(function(f){ return f.name; });
    document.getElementById('impPipeName').textContent = names.join(', ');
    Promise.all(fs.map(function(f){
      return new Promise(function(res){ var rd = new FileReader(); rd.onload = function(){ res({ name: f.name, text: String(rd.result) }); rd.readAsText(f, 'utf-8'); }; });
    })).then(function(files){
      window.__v2ImpFiles = files;
      var A = v2ImportAnalyze(files, (document.getElementById('v2Prefix') || {}).value);
      window.__v2ImpResult = A;
      document.getElementById('impReport').value = v2ImportReportText(A, names);
      document.getElementById('impApply').disabled = !A.ok;
    });
  });
  var an = document.getElementById('impAnalyze');
  if (an) an.addEventListener('click', function(){
    if (!window.__v2ImpFiles){ showToast('先选择 pipeline JSON'); return; }
    var A = v2ImportAnalyze(window.__v2ImpFiles, (document.getElementById('v2Prefix') || {}).value);
    window.__v2ImpResult = A;
    document.getElementById('impReport').value = v2ImportReportText(A, window.__v2ImpFiles.map(function(f){ return f.name; }));
    document.getElementById('impApply').disabled = !A.ok;
  });
  var ap = document.getElementById('impApply');
  if (ap) ap.addEventListener('click', function(){
    if (v2ImportApply(window.__v2ImpResult)) showToast('导入完成：' + (window.__v2ImpResult.prefix || '（无前缀）') + ' 画像已应用');
  });
}
