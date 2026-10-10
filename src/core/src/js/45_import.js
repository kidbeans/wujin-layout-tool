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

/* 槽位推断：植物步的槽号 → 首个植物名（deck1 取 1~8；deck2 的步已被走链归一成内部槽位 9~16，
   折算成相对槽位 1~8）。旧代码在 v2ImportAnalyze 内只认 1~8，配队2 八个槽位永远推断不出来，
   导入任何双卡组脚本都要人工补名（2026-10-10 实测复兴/童话/海盗三个 fixture 全中）。 */
function v2ImpInferSlots(items, deck){
  var m = {};
  items.forEach(function(it){
    if (it.t !== 'plant' || !it.slot) return;
    var rel = (deck === 2) ? (it.slot > 8 ? it.slot - 8 : it.slot) : it.slot;
    if (rel < 1 || rel > 8) return;
    var nm = v2ImpPlantName(it.name);
    if (nm && !m[rel]) m[rel] = nm;
  });
  var arr = [];
  for (var i = 1; i <= 8; i++) arr.push(m[i] || '');
  return arr;
}

/* task 片段的 _register.description 里有「卡槽 配队1[…] 配队2[…]」全量卡槽表（部署时写入，
   gen_presets 逆向预设也用它）。走链只能推出链上出现过的槽位（deck2 尤其少），
   这份文本才是卡槽真相——单选 pipeline 时配队2 只推得出 3/8，配上 task 片段即 8/8。 */
function v2ImpSlotsFromTask(mp){
  var desc = '';
  (mp.parsed || []).forEach(function(x){
    var r = (x.p || {})._register;
    if (!desc && r && typeof r.description === 'string' && r.description.indexOf('卡槽') > -1) desc = r.description;
  });
  if (!desc) return null;
  function parse(seg){
    var out = ['', '', '', '', '', '', '', ''];
    String(seg || '').split(/\s+/).forEach(function(tok){
      var g = /^([1-8])(.*)$/.exec(tok);
      if (!g) return;
      var nm = String(g[2] || '').trim();
      out[+g[1] - 1] = (nm === '空' ? '' : nm);      /* 简介里空槽位写作「3空」 */
    });
    return out;
  }
  var m1 = /配队1\[([^\]]*)\]/.exec(desc), m2 = /配队2\[([^\]]*)\]/.exec(desc);
  if (!m1 && !m2) return null;
  var name = '';
  (mp.parsed || []).forEach(function(x){ var r = (x.p || {})._register; if (!name && r && r.name) name = r.name; });
  return { deck1: parse(m1 && m1[1]), deck2: parse(m2 && m2[1]), desc: desc, taskName: name };
}

/* 抛花还原：task 片段里有「小关是否抛花」选项 ⇒ pipeline 里 点波_初始 之后的 抛花1..N 节点
   是画布 V2.throw 生成的 → 还原成画布抛花设置（落格取节点 end、卡槽取 begin 的第N个槽位），
   并把它们从顺序里摘掉（再导出时生成器按 V2.throw 重新插入，节点完全同构）。
   没有该选项时不还原——避免把硬编码抛花步的脚本改走样。 */
function v2ImpThrowFromPipe(p, pfx, mp){
  var hasOpt = (mp.parsed || []).some(function(x){
    return Object.keys((x.p || {}).option || {}).some(function(k){ return /小关是否抛花$/.test(k); });
  });
  if (!hasOpt) return null;
  var esc = pfx.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  var names = Object.keys(p).filter(function(k){ return new RegExp('^' + esc + '抛花\\d+$').test(k); }).sort();
  if (!names.length) return null;
  var cells = [], slot = 1;
  names.forEach(function(k){
    var m = /格子(\d)_(\d)$/.exec(String(p[k].end || ''));
    if (m) cells.push(m[1] + '-' + m[2]);
    var s = v2ImpSlot(p[k].begin);
    if (s && s !== 1) slot = s;
  });
  if (!cells.length) return null;
  return { on: true, slot: slot, cells: cells, names: names };
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
  /* 选错文件的指路（2026-10-10 批 D3）：以前一律「未解析出任何节点」，用户不知道错在哪 */
  function hasKey(keys){
    return (mp.parsed || []).some(function(x){ return Object.keys(x.p || {}).some(function(k){ return keys.indexOf(k) > -1; }); });
  }
  if (!A.nNodes){
    var oks = [];
    (mp.parsed || []).forEach(function(x){ Object.keys((x.p || {}).option || {}).forEach(function(k){ oks.push(k); }); });
    var toolTask = oks.some(function(k){
      return /(初始化卡槽和草坪位置|监控窗口|启动时关卡数|小关是否抛花|boss喂豆位置|关内点波|无尽全自动循环)$/.test(k);
    });
    if (files.length && /"version"\s*:\s*2/.test(String(files[0].text)) && /"(boards|slots|order)"\s*:/.test(String(files[0].text)))
      A.warns.push('这是布阵工具的 v2 阵型存档（完整状态：棋盘/卡槽/顺序/路由），不是 pipeline 脚本——' +
        '本面板直接点「解析」会识别为阵型并载入画布');
    else if (toolTask || hasKey(['_register']))
      A.warns.push('这是 task 片段（选项定义），不含 pipeline 节点——请与配套的 YS_*.json（pipeline）一起选；' +
        '只想部署的话用导出面板的「🚀 部署到 MPZ」');
    else if (oks.length || hasKey(['option']))
      A.warns.push('这是选项集 JSON（官方通用框架 / task 选项定义），不含无尽布阵链——' +
        '官方通用框架请在「📥 导入」面板点「解析通用框架 JSON」');
    else
      A.warns.push('未识别到 pipeline 节点；支持：v2 源（生成 pipeline 片段得到的三段合一文件）、' +
        'YS_*.json / Endless_*.json（pipeline）、*_wj.json（task 片段，需与 pipeline 一起选）');
    return A;
  }

  /* 前缀：找 判断是否进入关内 判定节点（后缀精确），多候选时列出 */
  var S_D1 = '判断是否进入关内', S_D2 = '判断进入关内_deck2', S_BOSS = '判断进入关内_boss', S_FARM = '判断进入关内_后期';
  var cands = Object.keys(p).filter(function(k){ var n = String(k); return n === S_D1 || n.slice(-S_D1.length) === S_D1; });
  if (!cands.length){
    if (hasKey(['option', 'task']))
      A.warns.push('这是官方通用框架 / 选项集 JSON（只有 option 定义），不含无尽布阵链；' +
        '请在「📥 导入」面板用「解析通用框架 JSON」导入');
    else
      A.warns.push('未找到「判断是否进入关内」判定节点（可能不是无尽布阵脚本，或只选了骨架/片段文件）');
    return A;
  }
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

  A.slots = { deck1: v2ImpInferSlots(d1, 1), deck2: d2.length ? v2ImpInferSlots(d2, 2) : [] };
  /* task 片段在的话，用 _register 简介里的卡槽表补齐（走链推不出的槽位，deck2 尤其多） */
  var slotSrc = v2ImpSlotsFromTask(mp);
  if (slotSrc){
    var filledByTask = 0;
    ['deck1', 'deck2'].forEach(function(dk){
      if (A.slots[dk].length !== 8) return;      /* 该 deck 本就没链（如 none 模式的 deck2）→ 不补，免得凭空造出配队2 */
      slotSrc[dk].forEach(function(nm, i){
        if (nm && !A.slots[dk][i]){ A.slots[dk][i] = nm; filledByTask++; }
      });
    });
    if (filledByTask) A.notes.push('卡槽表补齐 ' + filledByTask + ' 格：取自 task 片段 _register 简介（走链只能推出链上出现过的槽位）');
    if (slotSrc.taskName) A.taskName = slotSrc.taskName;
  }
  /* 抛花设置还原（需 task 片段佐证） */
  var thSrc = v2ImpThrowFromPipe(p, pfx, mp);
  if (thSrc){
    A.throw = { on: true, slot: thSrc.slot, cells: thSrc.cells };
    A.order.deck1 = d1.filter(function(it){ return !(it.t === 'plant' && /^抛花\d+$/.test(it.name || '')); });
    A.notes.push('抛花设置已还原：卡槽' + thSrc.slot + ' → ' + thSrc.cells.join('/') +
      '（' + thSrc.names.length + ' 朵；已从顺序里摘出，导出时按画布抛花设置重新生成）');
  }

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
  /* 「v2 源」只指**单文件**里同时装着节点与 task 片段（三段合一）；
     两份文件分开选（YS_*.json + *_wj.json）不算 v2 源，别说岔了 */
  var isV2Src = (mp.parsed || []).some(function(x){
    var o = x.p || {};
    var hasNode = Object.keys(o).some(function(k){ return !V2_NON_NODE_KEYS[k]; });
    return hasNode && !!(o.option || o.task || o.nested);
  });
  if (isV2Src) A.notes.push('已识别为布阵工具 v2 源：按 ② pipeline 段导入，③ task 片段（选项定义）已忽略——选项由部署/导出时重新生成');
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
  if (A.throw && A.throw.on) V2.throw = v2Clone(A.throw);      /* 抛花设置还原，否则再导出丢「小关是否抛花」选项 */
  V2.debugCardUI = true;
  if (A.taskName){
    var tn2 = document.getElementById('v2TaskName');
    if (tn2){ tn2.value = A.taskName; try{ localStorage.setItem('v2taskname', A.taskName); }catch(e){} }
  }
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

/* ---- 统一入口（2026-10-10 批 D2）：文件选择 / 粘贴框 / 服务面板三条路共用同一套解析与报告框 ----
 * 之前三处各写一份：导出面板里的 pipeline 导入块、导出面板的「应用粘贴的 JSON v2」、
 * 服务面板的「导入勾选 pipeline → 画布」；都能用但入口分散、报告框不统一。 */
function v2ImpReportSet(text){
  var box = document.getElementById('impReport') || document.getElementById('v2Out');
  if (box) box.value = text;
}
/* 完整 v2 阵型存档（version:2 + boards + slots）：不走 pipeline 走链，直接载入画布状态 */
function v2ImpFullV2(text){
  var d = null;
  try{ d = v2ParseAnyJson(text); }catch(e){ return null; }
  if (!d || typeof d !== 'object' || Array.isArray(d) || d.version !== 2) return null;
  if (!d.boards || !d.slots) return null;
  return d;
}
/* 解析（不改画布）：v2 阵型 → 状态画像；其余 → pipeline/task 走链画像。报告写入统一报告框 */
function v2ImpParse(files){
  var state = { kind: '', files: files || [], A: null, text: '' };
  if (!state.files.length) return state;
  state.text = state.files.map(function(f){ return f.text; }).join('\n');
  if (state.files.length === 1){
    var full = v2ImpFullV2(state.text);
    if (full){
      state.kind = 'full';
      var nCells = 0;
      try{ (full.boards.main || []).forEach(function(r){ (r || []).forEach(function(c){ if (c && (c.base || c.merge || c.vine)) nCells++; }); }); }catch(e){}
      v2ImpReportSet('【导入识别报告】' + (state.files[0].name || '粘贴内容') + '\n' +
        '识别为：布阵工具 v2 阵型存档（完整状态）\n' +
        '世界 ' + ((full.meta && full.meta.world) || '（未命名）') + ' · 前缀 ' + ((full.meta && full.meta.prefix) || 'wj_') +
        ' · 棋盘 ' + (full.meta ? (full.meta.cols || 9) + 'x' + (full.meta.rows || 5) : '9x5') + '（有植物 ' + nCells + ' 格）\n' +
        '顺序：deck1 ' + (((full.order || {}).deck1) || []).length + ' 步 / deck2 ' + (((full.order || {}).deck2) || []).length + ' 步' +
        ' · 路由模式 ' + (((full.route || {}).mode) || 'tail') + '\n' +
        (full.meta && full.meta.intro ? '简介：' + full.meta.intro + '\n' : '') +
        '\n—— 点「应用到画布」覆盖棋盘/卡槽/顺序/路由/Boss（可 Ctrl+Z 撤销）');
      return state;
    }
  }
  state.kind = 'frag';
  var A = v2ImportAnalyze(state.files, (document.getElementById('v2Prefix') || {}).value);
  state.A = A;
  v2ImpReportSet(v2ImportReportText(A, state.files.map(function(f){ return f.name; })));
  return state;
}
function v2ImpFilesNow(){
  var files = (window.__v2ImpFiles || []).slice();
  if (!files.length){
    var t = ((document.getElementById('impPaste') || {}).value || '');
    if (t.trim()) files = [{ name: '粘贴内容', text: t }];
  }
  return files;
}
function v2ImpOk(st){ return !!st && (st.kind === 'full' || (st.A && st.A.ok)); }
function v2ImpAnalyzeClick(){
  var files = v2ImpFilesNow();
  if (!files.length){ showToast('先选文件，或把内容粘贴到下面的框'); return; }
  window.__v2ImpState = v2ImpParse(files);
  var ap = document.getElementById('impApply');
  if (ap) ap.disabled = !v2ImpOk(window.__v2ImpState);
  showToast(v2ImpOk(window.__v2ImpState) ? '解析完成，请查看报告后点「应用到画布」' : '解析失败，详见报告');
}
function v2ImpApplyClick(){
  var st = window.__v2ImpState;
  if (!v2ImpOk(st)){ showToast('请先点「解析（先看报告）」'); return; }
  if (st.kind === 'full'){ v2ImportJSON(st.text); return; }
  if (v2ImportApply(st.A)) showToast('导入完成：' + (st.A.prefix || '（无前缀）') + ' 画像已应用');
}

/* UI 装配（导入面板） */
function v2ImportBind(){
  var inp = document.getElementById('impPipe');
  if (!inp) return;
  inp.addEventListener('change', function(){
    var fs = Array.prototype.slice.call(inp.files || []);
    if (!fs.length) return;
    Promise.all(fs.map(function(f){
      return new Promise(function(res){ var rd = new FileReader(); rd.onload = function(){ res({ name: f.name, text: String(rd.result) }); }; rd.readAsText(f, 'utf-8'); });
    })).then(function(files){
      window.__v2ImpFiles = files;
      var el = document.getElementById('impPipeName');
      if (el) el.textContent = files.length === 1 ? files[0].name : files.length + ' 个文件';
      v2ImpAnalyzeClick();            /* 选完即解析，少点一次 */
    });
  });
  var b = function(id){ return document.getElementById(id); };
  if (b('impAnalyze')) b('impAnalyze').addEventListener('click', v2ImpAnalyzeClick);
  if (b('impApply')) b('impApply').addEventListener('click', v2ImpApplyClick);
  if (b('impClear')) b('impClear').addEventListener('click', function(){
    window.__v2ImpFiles = null; window.__v2ImpState = null;
    inp.value = '';
    var el = b('impPipeName'); if (el) el.textContent = '未选择';
    var box = b('impPaste'); if (box) box.value = '';
    var ap = b('impApply'); if (ap) ap.disabled = true;
    v2ImpReportSet('已清空。选择文件（可多选）或粘贴内容后自动解析；解析成功才可「应用到画布」。');
  });
  v2ImpReportSet('选择文件或粘贴内容后点「解析（先看报告）」；解析成功才可「应用到画布」。');
}
