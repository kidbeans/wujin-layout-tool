/* ================= v2 导出：JSON v2 / txt v2 / pipeline 片段 / task 片段 ================= */
"use strict";

function v2Download(name, text){
  var blob = new Blob([text], { type: 'application/json;charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}
function v2OutSet(text){
  var t = document.getElementById('v2Out');
  if (t) t.value = text;
}

/* ---- JSON v2 ---- */
function v2ExportJSON(){
  var o = {
    version: 2,
    meta: { world: V2.world, prefix: V2.prefix, cols: cols, rows: rows, exported: new Date().toISOString().slice(0, 10),
            intro: v2TaskIntro() },
    boards: { main: grid, early: split.early, late: split.late },
    slots: { deck1: slotNames.slice(0, 8), deck2: slotNames.slice(8, 16), subSlotsOn: subSlotsOn },
    order: V2.order, route: V2.route, boss: V2.boss, throw: V2.throw, debugCardUI: V2.debugCardUI !== false
  };
  v2OutSet(JSON.stringify(o, null, 1));
  return o;
}
function v2ImportJSON(text){
  var d; try{ d = JSON.parse(text); }catch(e){ showToast('JSON 解析失败：' + e.message); return; }
  if (!d || d.version !== 2){ showToast('不是 v2 格式（缺 version:2）'); return; }
  v2UndoStack.push(v2SerializeAll());
  cols = d.meta.cols || 9; rows = d.meta.rows || 5;
  /* 网格按声明尺寸落位（2026-09-14 审查）：boards 实际大小与 meta 或当前尺寸不一致时
     旧代码直接赋值 → renderGrid 越界读 undefined。统一裁剪/补齐。 */
  grid = v2FitBoard(d.boards.main, cols, rows);
  split = { early: d.boards.early ? v2FitBoard(d.boards.early, cols, rows) : null,
            late: d.boards.late ? v2FitBoard(d.boards.late, cols, rows) : null };
  slotNames = (d.slots.deck1 || []).concat(d.slots.deck2 || []);
  while (slotNames.length < 16) slotNames.push('');
  subSlotsOn = !!d.slots.subSlotsOn;
  V2 = v2Clone(v2Default());
  V2.world = d.meta.world || ''; V2.prefix = d.meta.prefix || 'wj_';
  V2.order = d.order || V2.order; V2.route = v2DeepMerge(V2.route, d.route || {});
  V2.boss = v2DeepMerge(V2.boss, d.boss || {}); V2.throw = v2DeepMerge(V2.throw, d.throw || {});
  V2.debugCardUI = d.debugCardUI !== false;
  var c1 = document.getElementById('colN'), r1 = document.getElementById('rowN');
  if (c1) c1.value = cols; if (r1) r1.value = rows;
  save(); buildAllChips(); renderSlots(); renderGrid(); updateStatus();
  if (typeof v2RefreshPanels === 'function') v2RefreshPanels();
  showToast('已导入 v2 配置：' + (V2.world || '未命名'));
}

/* ---- txt v2（v1 紧凑格式 + 附加段） ---- */
function v2ExportTxt(){
  var L = [];
  L.push(exportCompact());
  if (splitOn){
    if (split.early) L.push('【前期/第一关】\n' + splitCompact('early'));
    if (split.late) L.push('【后期/第二关】\n' + splitCompact('late'));
  }
  ['deck1', 'deck2'].forEach(function(dk){
    var items = V2.order[dk] || [];
    if (!items.length) return;
    L.push('【顺序' + dk + '】' + items.map(function(it){
      if (it.t === 'plant') return (it.check ? '[检]' : '') + v2SlotName(it.slot) + it.cell + '(p' + (it.pre || 0) + '/o' + (it.post == null ? 100 : it.post) + ')';
      if (it.t === 'wave') return '‖' + it.name + '‖';
      if (it.t === 'interleave') return '‖缝:识别结算‖';
      if (it.t === 'sweep') return '‖捡花:' + (typeof it.begin === 'string' ? it.begin : '数组') + '→' + (typeof it.end === 'string' ? it.end : '数组') + '×' + (it.repeat || 1) + '‖';
      if (it.t === 'slide') return '‖滑:' + (it.name || '滑阳光') + '‖';
      if (it.t === 'shovel') return '‖铲:' + it.cell + '‖';
      if (it.t === 'feed') return '‖豆:' + it.cell + (it.loop ? '(循环)' : '') + '@' + (it.post || 1500) + '‖';
      if (it.t === 'wait') return '‖等:' + (it.ms || 0) + '‖';
      if (it.t === 'accel') return '‖加速‖';
      return '?';
    }).join(' → '));
  });
  var r = V2.route;
  if (r.mode === 'tail'){
    var pp = [];
    if (r.params.deck1_first) pp.push('deck1_first=' + r.params.deck1_first);
    if (r.params.fast_mode) pp.push('激进省时(fast_mode)');
    if (r.params.front10) pp.push('front10=' + r.params.front10 + (r.params.front10_feed ? '(拖豆' + r.params.front10_feed + ')' : ''));
    if (r.params.front30) pp.push('front30=' + r.params.front30 + (r.params.front30_feed ? '(feed ' + r.params.front30_feed + ')' : ''));
    if (r.params.deck2_tail3_first) pp.push('deck2_tail3_first=' + r.params.deck2_tail3_first);
    if (r.params.beilei_stop) pp.push('beilei_stop=' + r.params.beilei_stop);
    L.push('【路由】尾数分流 ' + (r.tail.d2 || []).join('/') + '→d2 ' + (r.tail.boss || []).join('/') + '→boss; ' + pp.join('; ') + '; start=' + r.params.start_level);
  } else if (r.mode === 'phase'){
    L.push('【路由】阶段分流 deck2@[' + (r.phase.deck2Levels || []).join(',') + '] bossEarlyFeed=' + r.phase.bossEarlyFeed + ' farmFrom=' + r.phase.farmFrom + '; start=' + r.params.start_level);
  } else {
    L.push('【路由】无计数（单卡组静态链）');
  }
  if (V2.throw && V2.throw.on && (V2.throw.cells || []).length)
    L.push('【抛花】卡槽' + (V2.throw.slot || 1) + ' → ' + V2.throw.cells.join('/') + '（deck1 点波_初始 后，每小关）');
  var ops = V2.boss.ops || [];
  if (ops.length){
    L.push('【Boss】' + ops.map(function(o){
      if (o.t === 'stack') return '叠' + o.cell + (o.slot ? '(槽' + o.slot + ')' : '');
      if (o.t === 'feed') return '喂' + (o.cell || '选卡格') + (o.loop ? '(循环@' + (o.post || 1500) + ')' : '@' + (o.post || 400));
      if (o.t === 'accel') return '加速';
      if (o.t === 'flower') return '花' + o.cell;
      return '?';
    }).join(' → '));
  }
  v2OutSet(L.join('\n\n'));
}

/* ---- pipeline 片段 ---- */
/* 共用点击坐标（2026-09-14 审查：原为散布 14 处的 [1235,217]/[1171,37] 魔法数）。
   720 短边坐标；数组禁止原地变异（全文件仅作 JSON 序列化输出）。 */
var V2_WAVE_TAP = [1235, 217];   /* 点波（画面中央偏右，点两下推进波次） */
var V2_ACCEL_TAP = [1171, 37];   /* ⏩ 加速按钮（右上角） */
var V2_CN = ['一','二','三','四','五','六','七','八'];
function v2SlotAnchor(slot){ var phys = ((slot - 1) % 8) + 1; return '种植物_初始化_第' + V2_CN[phys - 1] + '个槽位'; }
/* 官方槽位探针 y（resource/pipeline/General_action/Plant_planting_Initialize_slot_General_Swipe.json；
   种子栏竖排左侧 1~8 号物理槽）。金卡检条 y = 探针 y − 17：卡槽3 推算值 [115,250,7,45]
   与全部部署脚本（YS_FuXing/YS_Tonghua/YS_Aiji/…）的实测校准值逐位吻合 */
var V2_SLOT_PROBE_Y = [114, 196, 267, 338, 399, 482, 539, 613];
function v2CellAnchor(cell){
  if (!cell) return undefined;
  var xy = cell.split('-');
  return '种植物_初始化_格子' + xy[0] + '_' + xy[1];
}
/* 路由参数 → fx_counter custom_action_param 增量片段（v2BuildPipeline 与 v2BuildTask 共享；
   2026-09-14 审查去重——两处曾逐字重复维护。注意：bailuo_from 不在此函数内，
   调用方按各自语义追加（pipeline 直接进 extra；task 只进 计步 的 cap）。 */
function v2RouteParamsExtra(pp, p){
  var extra = [];
  if (pp.deck1_first) extra.push('"deck1_first": ' + pp.deck1_first);
  if (pp.fast_mode) extra.push('"skip_same_deck": true');   /* 激进省时(P5)：agent 需 2026-10-09+；旧 agent 忽略此键=安全降级 */
  if (pp.front10) extra.push('"front10": ' + pp.front10);
  if (pp.front30) extra.push('"front30": ' + pp.front30);
  if (pp.deck2_tail3_first) extra.push('"deck2_tail3_first": ' + pp.deck2_tail3_first);
  if (pp.beilei_stop) extra.push('"beilei_stop": ' + pp.beilei_stop);
  /* 尾数分流表下发 agent：界面填的 deck2/Boss 尾数真正生效（缺省 3/8、5/0；旧脚本不传回落默认） */
  var d2t = (V2.route.tail && V2.route.tail.d2) || [];
  var btt = (V2.route.tail && V2.route.tail.boss) || [];
  if (d2t.length) extra.push('"d2_tails": [' + d2t.join(',') + ']');
  if (btt.length) extra.push('"boss_tails": [' + btt.join(',') + ']');
  /* front30_feed 归一：纯格子 '1-3' → 节点名 {p}给豆1_3（agent 把该值当节点名用） */
  var f30f = String(pp.front30_feed || '');
  if (/^[1-9]-[1-5]$/.test(f30f)) f30f = p + '给豆' + f30f.replace('-', '_');
  if (pp.front30 && f30f) extra.push('"front30_feed": "' + f30f + '"');
  if (pp.boss_feed_early) extra.push('"boss_feed_early": "' + pp.boss_feed_early + '"');
  if (pp.boss_feed_late) extra.push('"boss_feed_late": "' + pp.boss_feed_late + '"');
  return extra;
}
function v2NodeNameOf(it, p, tag){
  if (it.name) return p + it.name;
  if (it.t === 'plant') return p + tag + '_' + (v2SlotName(it.slot) || '植物') + it.cell.replace('-', '_');
  return p + tag + '_step';
}

/* 融合式金卡检测的失败回退自动补全（2026-09-10）。
   形如「大哥(ColorMatch) → 原豌」的融合格：大哥卡用完变暗时 ColorMatch 识别失败，
   若父节点 next 只有大哥这一项 → 无回退，MaaFW 重试 20s 后 bad next，布阵链中断
   （功夫实测：种完 3 个原大后不再布阵）。
   规则：ColorMatch 种植节点 X 的唯一 next 是同格融合伙伴 Y 时，把 Y 的下一跳
   接到 X 的父节点作候选 → 失败时跳过「本体+伙伴」，继续后面的步骤。
   已有显式 alt（父节点 next 已 ≥2）或非此结构的，一律不动。 */
function patchCheckFallbacks(nodes){
  var parents = {};
  Object.keys(nodes).forEach(function(k){
    (nodes[k].next || []).forEach(function(n){ (parents[n] = parents[n] || []).push(k); });
  });
  /* 判定 k 是否是"金卡检测步"：ColorMatch 种植，唯一 next 是同格融合伙伴 */
  function partnerOf(k){
    var nd = nodes[k], nx = nd.next || [];
    if (nd.recognition !== 'ColorMatch' || nd.action !== 'Swipe' || nx.length !== 1) return null;
    var y = nodes[nx[0]];
    if (!y || y.action !== 'Swipe' || y.end !== nd.end) return null;
    return y;
  }
  Object.keys(nodes).forEach(function(k){
    if (!partnerOf(k)) return;
    var par = parents[k];
    if (!par || par.length !== 1) return;
    var pn = nodes[par[0]].next || [];
    if (pn.length !== 1) return;                 /* 父节点已有显式 alt → 不动 */
    /* 级联候选：本格检测 → 后一格检测 → … → 最后一个检测的伙伴的下一跳(兜底)。
       只补一格不够：连续两张卡都变暗时，两项列表仍会耗尽 → bad next。 */
    var cands = [k], cur = k, guard = 0;
    while (guard++ < 24){
      var y = partnerOf(cur);
      if (!y) break;
      var nxt = (y.next || [])[0];
      if (!nxt || cands.indexOf(nxt) > -1) break;
      cands.push(nxt);
      if (!partnerOf(nxt)) break;                /* 到非检测步(链尾)即止 */
      cur = nxt;
    }
    if (cands.length < 2) return;
    nodes[par[0]].next = cands;
  });
}

function v2BuildPipeline(){
  var p = (document.getElementById('v2Prefix').value || V2.prefix || 'wj_').trim();
  V2.prefix = p;
  var nodes = {};
  var bossFeedNodes = [];
  var throwInfo = null;   /* 小关抛花: {after: 点波_初始节点名, nodes: [抛花节点名...]} */
  var rt = V2.route;
  function N(n, def){ nodes[n] = def; return n; }
  function N2(base){ if (!nodes[base]) return base; for (var i = 2; ; i++){ var n = base + '_' + i; if (!nodes[n]) return n; } }
  function chain(items, tag){
    var prev = null, pendingIl = false, head = null, prevAlt = null;
    function altNorm(a){
      /* item.name 保留原始节点名（含 d1_/d2_ 段），alt 目标与链上节点同名；
         仅在换前缀导出时剥旧前缀（如 th_wj_ → 当前 p） */
      var base = a.indexOf(p) === 0 ? a.slice(p.length) : a.replace(/^(?:[A-Za-z]{1,4}(?:_wj)?_)/, '');
      return p + base;
    }
    /* 唯一命名：同种植物多次种植（大哥×5）/双铲（铲_6-3、铲掉_6-3）不得互相覆盖节点，
       否则中间步丢失、链接被尾部点波改写后子链整段悬空。
       首次出现保留原名（alt/外部引用兼容），重名时优先追加格子后缀，仍冲突则 _2/_3 递增 */
    function mkName(base, cellKey){
      var stem = base;
      if (nodes[stem] && cellKey && stem.slice(-cellKey.length) !== cellKey) stem = base + cellKey;
      if (!nodes[stem]) return stem;
      for (var i = 2; ; i++){ var n = stem + '_' + i; if (!nodes[n]) return n; }
    }
    items.forEach(function(it){
      if (it.t === 'interleave'){
        if (prev){ nodes[prev].next = [p + '识别结算']; pendingIl = true; }
        return;
      }
      var name, nd;
      if (it.t === 'plant'){
        name = mkName(v2NodeNameOf(it, p, tag), it.cell ? it.cell.replace('-', '_') : '');
        nd = { action: 'Swipe', begin: v2SlotAnchor(it.slot), end: v2CellAnchor(it.cell),
               duration: 100, pre_delay: it.pre || 0, post_delay: it.post == null ? 100 : it.post };
        if (it.check){
          /* 金卡检条：种子栏竖排、各卡同列 → x 固定 115；y = 该槽探针 − 17（卡槽3 与部署脚本实测值吻合，其余槽位为推算） */
          var physChk = ((it.slot - 1) % 8) + 1;
          nd.recognition = 'ColorMatch';
          nd.roi = [115, V2_SLOT_PROBE_Y[physChk - 1] - 17, 7, 45];
          nd.lower = [250, 140, 0]; nd.upper = [255, 167, 18];
        }
        else nd.recognition = 'DirectHit';
      } else if (it.t === 'wave'){
        name = mkName(p + it.name, '');
        if (it.name === '点波5' || it.name === '点波5_d2'){
          nd = { recognition: 'DirectHit', action: 'Click', target: V2_WAVE_TAP, repeat: 2, pre_delay: 0, post_delay: 0,
                 next: [p + '识别结算', p + '识别开始战斗', p + '识别boss关', name] };
          N(name, nd);
          if (prev){
            var nx5 = pendingIl ? [p + '识别结算', name] : [name];
            if (prevAlt){ var af5 = altNorm(prevAlt); if (nx5.indexOf(af5) === -1) nx5.push(af5); }
            nodes[prev].next = nx5;
          }
          prev = null; head = head || name;
          return;
        }
        if (it.name.indexOf('加速') > -1){
          nd = { recognition: 'DirectHit', action: 'Click', target: V2_ACCEL_TAP, post_delay: it.post || 300 };
        } else {
          nd = { recognition: 'DirectHit', action: 'Click', target: V2_WAVE_TAP, repeat: 2, pre_delay: 0, post_delay: 0 };
        }
      } else if (it.t === 'sweep'){
        name = mkName(p + (it.name || '捡花'), '');
        nd = { action: 'Swipe', begin: typeof it.begin === 'string' ? v2CellAnchor(it.begin) : it.begin,
               end: typeof it.end === 'string' ? v2CellAnchor(it.end) : it.end,
               repeat: it.repeat || 30, duration: 20, pre_delay: 0, post_delay: 0 };
      } else if (it.t === 'slide'){
        /* 滑阳光/滑蕾：竖滑捡阳光（begin/end 可用绝对坐标数组），与复兴/童话的 蓓蕾滑8列 同款 */
        name = mkName(p + (it.name || '滑阳光'), '');
        nd = { recognition: 'DirectHit', action: 'Swipe',
               begin: typeof it.begin === 'string' ? v2CellAnchor(it.begin) : it.begin,
               end: typeof it.end === 'string' ? v2CellAnchor(it.end) : it.end,
               duration: it.duration || 150, pre_delay: it.pre || 0,
               post_delay: it.post == null ? 100 : it.post };
      } else if (it.t === 'shovel'){
        /* 铲子名优先用自带 name（铲_6-3 / 铲掉_6-3 是两个不同步骤），无名时回落旧命名 */
        name = mkName(p + tag + '_' + String(it.name || '铲' + it.cell.replace('-', '_')).replace(/-/g, '_'), '');
        nd = { recognition: 'DirectHit', action: 'Swipe', begin: '种植物_初始化_铲子位置', end: v2CellAnchor(it.cell),
               duration: 100, pre_delay: 0, post_delay: it.post == null ? 100 : it.post };
      } else if (it.t === 'feed'){
        name = mkName(p + tag + '_' + String(it.name || '喂' + it.cell.replace('-', '_')).replace(/-/g, '_'), '');
        nd = { recognition: 'DirectHit', action: 'Swipe', begin: '种植物_初始化_能量豆位置', end: v2CellAnchor(it.cell),
               duration: 100, pre_delay: it.pre || 0, post_delay: it.post == null ? 2500 : it.post };
      } else if (it.t === 'wait'){
        /* 等待步：DoNothing + post_delay（agent 常用形态 {t:'wait',ms:N}，用于大招生效等待） */
        name = mkName(v2NodeNameOf(it, p, tag + '_等待'), '');
        nd = { recognition: 'DirectHit', action: 'DoNothing', pre_delay: it.pre || 0, post_delay: it.ms || 0 };
      } else if (it.t === 'accel'){
        name = mkName(p + tag + '_点加速', '');
        nd = { recognition: 'DirectHit', action: 'Click', target: V2_ACCEL_TAP, post_delay: it.post || 300 };
      } else return;
      N(name, nd);
      if (prev){
        var nx = pendingIl ? [p + '识别结算', name] : [name];
        if (prevAlt){
          /* alt = 上一步识别失败时的回退目标（源 pipeline 里上一步 next 的第二分支）；剥前缀与 d1_/d2_ 段对齐本片段命名 */
          var altFull = altNorm(prevAlt);
          if (nx.indexOf(altFull) === -1) nx.push(altFull);   /* 金卡检测失败回退/阳光不足兜底 */
        }
        nodes[prev].next = nx;
      }
      pendingIl = false;
      prev = name; prevAlt = it.alt || null; head = head || name;
      /* 小关抛花（西部同构）：deck1 首个「点波_初始」后插入 抛花1..N（滑花卡槽卡到指定格） */
      if (tag === 'd1' && it.t === 'wave' && it.name === '点波_初始' &&
          V2.throw && V2.throw.on && (V2.throw.cells || []).length && !throwInfo){
        var thSlot = Math.max(1, Math.min(16, parseInt(V2.throw.slot) || 1));
        var thActual = [];
        V2.throw.cells.slice(0, 4).forEach(function(cid, ix){
          var tn = N2(p + '抛花' + (ix + 1));
          N(tn, { recognition: 'DirectHit', action: 'Swipe', begin: v2SlotAnchor(thSlot),
                  end: v2CellAnchor(cid), duration: 100, pre_delay: 100, post_delay: 100 });
          if (prev) nodes[prev].next = [tn];
          prev = tn;
          thActual.push(tn);
        });
        throwInfo = { after: name, nodes: thActual };
      }
    });
    /* 链尾接点波家族 */
    if (prev){
      var tailName = tag === 'd2' ? p + '点波5_d2' : p + '点波5';
      if (!nodes[tailName]){
        N(tailName, { recognition: 'DirectHit', action: 'Click', target: V2_WAVE_TAP, repeat: 2, pre_delay: 0, post_delay: 0,
          next: [p + '识别结算', p + '识别开始战斗', p + '识别boss关', tailName] });
      }
      var nxT = pendingIl ? [p + '识别结算', tailName] : [tailName];
      if (prevAlt){
        var altFull2 = altNorm(prevAlt);
        if (nxT.indexOf(altFull2) === -1) nxT.push(altFull2);
      }
      nodes[prev].next = nxT;
    }
    return head;
  }

  var d1head = chain(V2.order.deck1 || [], 'd1');
  var d2head = chain(V2.order.deck2 || [], 'd2');

  /* ---- Boss 链 ---- */
  var ops = V2.boss.ops || [];
  var bossHead = null, bprev = null;
  ops.forEach(function(o){
    var name, nd;
    if (o.t === 'stack'){
      name = N2(p + 'boss_叠种' + (o.cell || '').replace('-', '_'));
      nd = { recognition: 'DirectHit', action: 'Swipe', begin: v2SlotAnchor(o.slot || 8), end: v2CellAnchor(o.cell),
             duration: 100, pre_delay: o.pre || 0, post_delay: o.post || 0 };
    } else if (o.t === 'feed'){
      /* 同格多喂/同格多叠种不得互相覆盖（原 `+ '_2'` 一次判定，第 3 个起会覆盖 _2） */
      name = N2(p + 'boss_喂豆' + (o.cell ? o.cell.replace('-', '_') : ''));
      nd = { recognition: 'DirectHit', action: 'Swipe', begin: '种植物_初始化_能量豆位置', end: v2CellAnchor(o.cell),
            duration: 100, pre_delay: o.pre == null ? 100 : o.pre, post_delay: o.post == null ? 1500 : o.post };
      if (o.loop){ nd.timeout = -1; nd.next = [p + 'boss_识别结算', name]; }
      bossFeedNodes.push(name);
    } else if (o.t === 'accel'){
      name = N2(p + 'boss_点加速');
      nd = { recognition: 'DirectHit', action: 'Click', target: V2_ACCEL_TAP, post_delay: o.post || 300 };
    } else if (o.t === 'flower'){
      name = N2(p + 'boss_能量花' + (o.cell || '').replace('-', '_'));
      nd = { recognition: 'DirectHit', action: 'Swipe', begin: v2SlotAnchor(1), end: v2CellAnchor(o.cell),
             duration: 100, pre_delay: 0, post_delay: 0 };
    } else return;
    N(name, nd);
    if (bprev) nodes[bprev].next = [name];
    bprev = name; bossHead = bossHead || name;
  });

  /* ---- 机制骨架（识别/补给/配队/计数） ---- */
  N(p + 'Entry', { action: 'DoNothing', next: [p + '过渡'] });
  /* 过渡只等 开始战斗/boss关（与复兴/童话/埃及/西部五套一致）。
     勿加全局 wujin_返回 兜底：某些世界结算过渡会短暂出现「返回」，会被误点而脱离流程
     （2026-09-08 龙芋卡第二关教训：wujin_返回 命中后进入 [开始挑战1,返回] 死胡同子链）。 */
  N(p + '过渡', { action: 'DoNothing', timeout: -1,
    next: [p + '识别开始战斗', p + '识别boss关'] });
  N(p + '识别开始战斗', { recognition: 'OCR', expected: ['开始战斗'], roi: [1060, 647, 201, 59], threshold: 0.75,
    action: 'DoNothing', timeout: -1, next: rt.mode === 'none' ? [d1head || p + '点波5'] : [p + '计步'] });
  N(p + '识别结算', { recognition: 'OCR', expected: '继续挑战', roi: [716, 621, 179, 50], action: 'Click',
    rate_limit: 1000, timeout: -1, next: [p + '过渡'] });
  N(p + '识别boss关', { recognition: 'ColorMatch', lower: [148, 213, 8], upper: [168, 233, 28], roi: [723, 56, 17, 22],
    rate_limit: 10, next: [p + '神器补给_判断是否有神器'] });
  /* target [1171,37] = 进关即点 ⏩ 加速（各成熟脚本同款；漏了就全程 1 倍速——2026-09-08 龙芋教训） */
  N(p + '判断是否进入关内', { recognition: 'ColorMatch', roi: [467, 669, 27, 27], method: 4,
    lower: [148, 213, 8], upper: [168, 233, 28], timeout: -1, action: 'Click', target: V2_ACCEL_TAP,
    next: d1head ? [d1head] : [p + '点波5'] });
  N(p + '初始化完毕', { anchor: { '初始化': p + '过渡' }, next: ['种植物_初始化_植物位置'] });
  N(p + 'boss_识别结算', { recognition: 'OCR', expected: '继续挑战', roi: [716, 621, 179, 50], action: 'Click',
    rate_limit: 500, timeout: -1, next: [p + '过渡'] });
  if (rt.mode !== 'none'){
    var pp = rt.params || {};
    var extra = v2RouteParamsExtra(pp, p);
    if (pp.bailuo_from > 0) extra.push('"bailuo_from": ' + pp.bailuo_from);   /* pipeline 静态 cap 含补白（task 版按节点分流） */
    var cap = '{"start_level": 1, "route_node": "' + p + '尾数路由"' + (extra.length ? ', ' + extra.join(', ') : '') + '}';
    N(p + '监控开关', { action: 'Custom', custom_action: 'fx_monitor_switch', custom_action_param: '{"enabled": true}', next: [p + '重置计数'] });
    N(p + '重置计数', { action: 'Custom', custom_action: 'fx_counter_reset', custom_action_param: '{"start_level": ' + (pp.start_level || 1) + '}', next: [p + '初始化完毕'] });
    N(p + '重置到1', { action: 'Custom', custom_action: 'fx_counter_reset', custom_action_param: '{"start_level": 1, "force": true}', next: [p + '初始化完毕'] });
    N(p + '计步', { action: 'Custom', custom_action: 'fx_counter', custom_action_param: cap, next: [p + '尾数路由'] });
    N(p + '尾数路由', { recognition: 'DirectHit', action: 'DoNothing', timeout: -1, next: [p + '配队1普'] });
    N(p + '计步_boss_start', { action: 'Custom', custom_action: 'fx_counter', custom_action_param: '{"start_level": 1, "route": false, "absolute": true}', next: [p + 'boss_识别开始'] });
    if (d2head) N(p + '判断进入关内_deck2', { recognition: 'ColorMatch', roi: [467, 669, 27, 27], method: 4,
      lower: [148, 213, 8], upper: [168, 233, 28], timeout: -1, action: 'Click', target: V2_ACCEL_TAP, next: [d2head] });
    var fastPost = ((rt.params || {}).fast_mode ? 0 : 1000);   /* 激进省时(P4)：开始游戏 post→0；判断入关本就 ColorMatch timeout:-1 轮询等加载 */
    function lineup(kind, deckTarget, startTarget){
      N(p + '配队1' + kind, { recognition: 'DirectHit', action: 'Click', target: [766, 395], pre_delay: 0, post_delay: 1000, next: [p + '配队1' + kind + '_选卡'] });
      N(p + '配队1' + kind + '_选卡', { recognition: 'DirectHit', action: 'Click', target: [195, 218], pre_delay: 0, post_delay: 500, next: [p + '配队1' + kind + '_选卡_2'] });
      N(p + '配队1' + kind + '_选卡_2', { recognition: 'DirectHit', action: 'Click', target: [195, 218], pre_delay: 0, post_delay: 500, next: [p + '开始游戏' + kind] });
      N(p + '开始游戏' + kind, { recognition: 'DirectHit', action: 'Click', target: [1139, 671], pre_delay: 0, post_delay: fastPost, next: [startTarget] });
    }
    lineup('普', null, p + '判断是否进入关内');
    if (d2head){
      N(p + '配队2d2', { recognition: 'DirectHit', action: 'Click', target: [766, 395], pre_delay: 0, post_delay: 1000, next: [p + '配队2d2_选卡'] });
      N(p + '配队2d2_选卡', { recognition: 'DirectHit', action: 'Click', target: [199, 443], pre_delay: 0, post_delay: 500, next: [p + '配队2d2_选卡_2'] });
      N(p + '配队2d2_选卡_2', { recognition: 'DirectHit', action: 'Click', target: [199, 443], pre_delay: 0, post_delay: 500, next: [p + '开始游戏d2'] });
      N(p + '开始游戏d2', { recognition: 'DirectHit', action: 'Click', target: [1139, 671], pre_delay: 0, post_delay: fastPost, next: [p + '判断进入关内_deck2'] });
    }
    N(p + '配队1boss', { recognition: 'DirectHit', action: 'Click', target: [766, 395], pre_delay: 0, post_delay: 1000, next: [p + '配队1boss_选卡'] });
    N(p + '配队1boss_选卡', { recognition: 'DirectHit', action: 'Click', target: [195, 218], pre_delay: 0, post_delay: 500, next: [p + '配队1boss_选卡_2'] });
    N(p + '配队1boss_选卡_2', { recognition: 'DirectHit', action: 'Click', target: [195, 218], pre_delay: 0, post_delay: 500, next: [p + '开始游戏boss'] });
    N(p + '开始游戏boss', { recognition: 'DirectHit', action: 'Click', target: [1139, 671], pre_delay: 0, post_delay: fastPost, next: [p + 'boss_判断是否进入关内'] });
  }
  /* ---- 计数器 override 支撑节点（fx_counter 按路由参数改写这些节点的 next，目标必须存在；
   *      2026-09-08 龙芋教训：front30 速刷指向不存在的 给豆1_2，第2关 bad next 38ms 失败） ---- */
  if (rt.mode !== 'none'){
    var pp2 = rt.params || {};
    var f30f = String(pp2.front30_feed || '');
    if (/^[1-9]-[1-5]$/.test(f30f)) f30f = p + '给豆' + f30f.replace('-', '_');
    var m30 = (f30f || '').slice(p.length).match(/^给豆([1-9])_([1-5])$/);
    var f30Cell = m30 ? (m30[1] + '-' + m30[2]) : '1-2';
    if (pp2.front30 > 0){
      if (!nodes[f30f || (p + '给豆1_2')])
        N(f30f || (p + '给豆1_2'), { recognition: 'DirectHit', action: 'Swipe',
          begin: '种植物_初始化_能量豆位置', end: v2CellAnchor(f30Cell),
          duration: 100, pre_delay: 100, post_delay: 100, next: [p + '狂点5s'] });
      if (!nodes[p + '狂点5s'])
        N(p + '狂点5s', { recognition: 'DirectHit', action: 'Click', target: V2_WAVE_TAP,
          repeat: 1, repeat_delay: 500, pre_delay: 0, post_delay: 500, timeout: -1,
          next: [p + '识别结算', p + '狂点5s'] });
    }
    /* 点波1：front30 速刷与 补白萝卜循环（补白等待.next）共用，任一开启都必须存在 */
    if ((pp2.front30 > 0 || pp2.bailuo_from > 0) && !nodes[p + '点波1'])
      N(p + '点波1', { recognition: 'DirectHit', action: 'Click', target: V2_WAVE_TAP,
        repeat: 1, pre_delay: 0, post_delay: 500,
        next: [p + '识别结算', p + '识别开始战斗', p + '识别boss关', p + '点波5'] });
    if (pp2.front10 > 0){
      /* 前 N 关小关「先等结算」循环：**最多喂 2 次豆**（拖豆开大），达到上限后改为 点波+等结算。
         防止卡波时每轮都拖豆把能量豆耗光（2026-09-10 用户要求）。结构（按次数展开，不用 max_hit——
         max_hit 跨关累计不重置）：等结算→[识别结算,拖豆1]→等结算2→[识别结算,拖豆2]→点波等结算→[识别结算,点波]→回 */
      var f10cell = v2CellAnchor(pp2.front10_feed || '1-3');
      N(p + '前10_等结算', { recognition: 'DirectHit', action: 'DoNothing', pre_delay: 0, post_delay: 0,
        next: [p + '识别结算', p + '前10_拖豆1'] });
      N(p + '前10_拖豆1', { recognition: 'DirectHit', action: 'Swipe',
        begin: '种植物_初始化_能量豆位置', end: f10cell, duration: 100, pre_delay: 0, post_delay: 100,
        next: [p + '前10_等结算2'] });
      N(p + '前10_等结算2', { recognition: 'DirectHit', action: 'DoNothing', pre_delay: 0, post_delay: 0,
        next: [p + '识别结算', p + '前10_拖豆2'] });
      N(p + '前10_拖豆2', { recognition: 'DirectHit', action: 'Swipe',
        begin: '种植物_初始化_能量豆位置', end: f10cell, duration: 100, pre_delay: 0, post_delay: 100,
        next: [p + '前10_点波等结算'] });
      N(p + '前10_点波等结算', { recognition: 'DirectHit', action: 'DoNothing', pre_delay: 0, post_delay: 0,
        next: [p + '识别结算', p + '前10_点波'] });
      N(p + '前10_点波', { recognition: 'DirectHit', action: 'Click', target: V2_WAVE_TAP,
        repeat: 2, pre_delay: 0, post_delay: 500, next: [p + '前10_点波等结算'] });
    }
    if (pp2.bailuo_from > 0){
      /* 后期补白萝卜循环（火龙 v2 同款孤岛，不接静态链；防禅杖僵尸右吸破阵）：
         agent 在 level≥bailuo_from 的普关把 点波5 的 next 改写为 [补白1]，
         补白1..N 重种 deck1 的白萝卜格 → 补白等待(2.5s) → [识别结算,识别开始战斗,识别boss关,点波1] 回环。
         白萝卜落格/槽位取自 deck1 顺序里的白萝卜步（步名或卡槽名命中均可）；deck2/Boss 关不进循环。
         不传 bailuo_from（0/留空）时整个循环不生成，其他阵型不受影响。 */
      var blSlot = null, blCells = [];
      (V2.order.deck1 || []).forEach(function(it){
        if (it.t !== 'plant') return;
        if (it.name === '白萝卜' || v2SlotName(it.slot) === '白萝卜'){
          if (blSlot == null) blSlot = it.slot;
          if (blCells.indexOf(it.cell) === -1) blCells.push(it.cell);
        }
      });
      if (blCells.length){
        var blWait = p + '补白等待';
        var blNames = blCells.map(function(c, ix){ return p + '补白' + (ix + 1); });
        blCells.forEach(function(cid, ix){
          N(blNames[ix], { recognition: 'DirectHit', action: 'Swipe',
            begin: v2SlotAnchor(blSlot), end: v2CellAnchor(cid),
            duration: 100, pre_delay: 0, post_delay: 500,
            next: [ix + 1 < blNames.length ? blNames[ix + 1] : blWait] });
        });
        N(blWait, { recognition: 'DirectHit', action: 'DoNothing', pre_delay: 0, post_delay: 2500,
          next: [p + '识别结算', p + '识别开始战斗', p + '识别boss关', p + '点波1'] });
      }
    }
    if (pp2.deck1_first > 0){
      /* Boss 喂豆兜底节点：可用 boss_feed_early/boss_feed_late 指定节点名（如龙芋 5-2/5-3）；
         未指定时按复兴约定自动补 1-3(d1)/2-3，其他盘面请按实际改 end 格 */
      var bfE = String(pp2.boss_feed_early || '');
      var bfL = String(pp2.boss_feed_late || '');
      var nmE = bfE ? (bfE.indexOf(p) === 0 ? bfE : p + bfE) : (p + 'boss_喂豆1_3_d1');
      var nmL = bfL ? (bfL.indexOf(p) === 0 ? bfL : p + bfL) : (p + 'boss_喂豆2_3');
      /* 喂豆格优先从节点名推导（boss_喂豆5_2 → 5-2），推导不出再回落 Boss 喂豆格/复兴约定 */
      var bfCellOf = function(nm){
        var m = nm.slice(p.length).match(/^boss_喂豆([1-9])_([1-5])/);
        return m ? (m[1] + '-' + m[2]) : null;
      };
      var cellE = bfCellOf(nmE) || (bfE ? (V2.boss.feedCell || '2-3') : '1-3');
      var cellL = bfCellOf(nmL) || (bfL ? (V2.boss.feedCell || '2-3') : '2-3');
      if (!nodes[nmE])
        N(nmE, { recognition: 'DirectHit', action: 'Swipe',
          begin: '种植物_初始化_能量豆位置', end: v2CellAnchor(cellE),
          duration: 100, pre_delay: 100, post_delay: 3000, timeout: -1,
          next: [p + 'boss_识别结算', nmE] });
      if (!nodes[nmL])
        N(nmL, { recognition: 'DirectHit', action: 'Swipe',
          begin: '种植物_初始化_能量豆位置', end: v2CellAnchor(cellL),
          duration: 100, pre_delay: 100, post_delay: 1000, timeout: -1,
          next: [p + 'boss_识别结算', nmL] });
    }
  }
  /* ---- Boss/补给骨架（无条件生成）：单卡组(none)同样会遇到 Boss 关，
     识别boss关→神器补给→…→boss链 必须闭环（2026-09-08 巡检：none 模式漏生成致 Boss 关必炸）。
     计数模式下 boss_补给等选卡.next=配队1boss；none 模式直接 boss_识别开始（无配队切换）。 ---- */
      /* 神器补给骨架 */
    N(p + '神器补给_判断是否有神器', { action: 'DoNothing', pre_delay: 1000, next: [p + '神器补给_全部植物', p + '神器补给_橙色植物', p + '补给'] });
    N(p + '神器补给_全部植物', { recognition: 'OCR', expected: '全部植物', roi: [194, 237, 909, 80], action: 'Click', pre_delay: 1000, next: [p + '神器补给_确定1'] });
    N(p + '神器补给_橙色植物', { recognition: 'OCR', expected: '橙色植物', roi: [194, 237, 909, 80], action: 'Click', pre_delay: 1000, next: [p + '神器补给_确定1'] });
    N(p + '神器补给_确定1', { action: 'Click', target: [631, 609], pre_delay: 1000, next: [p + '神器补给_确定2'] });
    N(p + '神器补给_确定2', { action: 'Click', target: [631, 609], pre_delay: 2000, next: [p + '神器补给_确定3'] });
    N(p + '神器补给_确定3', { action: 'Click', target: [631, 609], next: [p + '计步_补给'] });
    N(p + '补给', { recognition: 'ColorMatch', lower: [146, 213, 6], upper: [166, 233, 26], roi: [723, 56, 17, 22],
      rate_limit: 10, action: 'Click', target: [261, 375], next: [p + '确定1'] });
    N(p + '确定1', { action: 'Click', target: [633, 614], post_delay: 2000, next: [p + '提示', p + '确定3'] });
    N(p + '提示', { recognition: 'OCR', expected: '提示', roi: [562, 242, 95, 49], action: 'Click', target: [595, 526], next: [p + '确定3'] });
    N(p + '确定3', { action: 'Click', target: [633, 614], pre_delay: 1000, post_delay: 1000, next: [p + '确定4'] });
    N(p + '确定4', { action: 'Click', target: [633, 614], repeat: 3, pre_delay: 1000, post_delay: 1000, next: [p + '计步_补给'] });
  /* 神器页确认后可能直接进关（无「开始战斗」选卡界面），或停在「获得以下能力！」奖励弹窗上
     → 只等选卡会 20s 超时 bad next（2026-09-10 功夫第10/50关实测）。
     回落链：①认奖励弹窗标题「获得以下能力」并点它的确定 → ②选卡界面 → ③已进关(判断入关→点加速) */
  N(p + '神器补给_获得确认', { recognition: 'OCR', expected: ['获得以下能力'], roi: [420, 120, 440, 80],
    threshold: 0.7, action: 'Click', target: [640, 615], post_delay: 500,
    next: [p + 'boss_补给等选卡', p + 'boss_判断是否进入关内'] });
  N(p + '计步_补给', { action: 'Custom', custom_action: 'fx_counter', custom_action_param: '{"start_level": 1, "route": false' + ((rt.params || {}).fast_mode ? ', "route_node": "' + p + '尾数路由", "skip_same_deck": true' : '') + '}',
    next: [p + '神器补给_获得确认', p + 'boss_补给等选卡', p + 'boss_判断是否进入关内'] });
  N(p + 'boss_补给等选卡', { recognition: 'OCR', expected: ['开始战斗'], roi: [1060, 647, 201, 59], threshold: 0.75,
    action: 'DoNothing', timeout: -1, next: rt.mode === 'none' ? [p + 'boss_识别开始'] : [p + '配队1boss'] });
  N(p + 'boss_识别开始', { recognition: 'OCR', expected: ['开始战斗'], roi: [1060, 647, 201, 59], threshold: 0.75,
    action: 'Click', next: [p + 'boss_判断是否进入关内'] });
  N(p + 'boss_判断是否进入关内', { recognition: 'ColorMatch', roi: [467, 669, 27, 27], method: 4,
    lower: [148, 213, 8], upper: [168, 233, 28], timeout: -1, action: 'DoNothing',
    next: bossHead ? [bossHead] : [] });
  patchCheckFallbacks(nodes);
  return { nodes: nodes, bossFeedNodes: bossFeedNodes, prefix: p, throwInfo: throwInfo };
}

/* ---- task 片段 ---- */
function v2BuildTask(built){
  var p = built.prefix, rt = V2.route;
  var tn = '';
  try { tn = String((document.getElementById('v2TaskName') || {}).value || '').trim(); } catch (e) {}
  var option = {};
  var ovYes = {};
  ovYes[p + 'Entry'] = { next: [p + '监控开关'] };
  ovYes[p + '监控开关'] = { next: [p + '重置计数'] };
  ovYes[p + '重置计数'] = { next: [p + '初始化完毕'] };
  ovYes[p + '初始化完毕'] = { anchor: { '初始化': p + '过渡' }, next: ['种植物_初始化_植物位置'] };
  option[p + '初始化卡槽和草坪位置'] = {
    type: 'switch', label: '初始化卡槽和草坪位置', description: '一定要开哦（首次运行/换分辨率校准坐标）',
    cases: [
      { name: 'No', label: '否', pipeline_override: (function(){ var o = v2Clone(ovYes); o[p + 'Entry'] = { next: [p + '过渡'] }; return o; })() },
      { name: 'Yes', label: '是', pipeline_override: ovYes }
    ]
  };
  option[p + '监控窗口'] = {
    type: 'switch', label: '监控窗口(实时显示关卡数)',
    cases: [
      { name: 'No', label: '关闭', pipeline_override: (function(){ var o = {}; o[p + '监控开关'] = { custom_action_param: '{"enabled": false}' }; return o; })() },
      { name: 'Yes', label: '开启(默认)', pipeline_override: (function(){ var o = {}; o[p + '监控开关'] = { custom_action_param: '{"enabled": true}' }; return o; })() }
    ]
  };
  if (rt.mode !== 'none'){
    var pp = rt.params || {};
    var extra = v2RouteParamsExtra(pp, p);   /* 与 v2BuildPipeline 共享（2026-09-14 审查去重） */
    /* route_node 必须随 input 覆盖一起写：input 会整体替换 custom_action_param，
       缺了它 agent 前缀回落 fx_，尾数分流/喂豆 override 全部落空（2026-09-08 龙芋教训） */
    var cap = '{"start_level": {关卡}, "route_node": "' + p + '尾数路由"' + (extra.length ? ', ' + extra.join(', ') : '') + '}';
    /* bailuo_from 只进 计步：计步_boss_start 是 route:false 的绝对计数，与补白循环无关
       （保持与火龙 v2 部署产物一致，避免 override 串漂移） */
    if (pp.bailuo_from > 0) cap = cap.slice(0, -1) + ', "bailuo_from": ' + pp.bailuo_from + '}';
    var ovCount = {};
    ovCount[p + '计步'] = { custom_action_param: cap };
    ovCount[p + '计步_boss_start'] = { custom_action_param: '{"start_level": {关卡}, "route": false, "absolute": true, "route_node": "' + p + '尾数路由"' + (extra.length ? ', ' + extra.join(', ') : '') + '}' };
    ovCount[p + '重置计数'] = { custom_action_param: '{"start_level": {关卡}}' };
    /* Boss 关计数的 计步_补给 也要跟 {关卡} 对齐：只覆盖 计步/计步_boss_start/重置计数 时，
       「初始化卡槽和草坪位置」=否 且首关恰是 Boss 关 → 计步_补给 走 level=None→1 分支，
       计数从 1 重起，之后尾数分流全部错位（火龙 v2 实测教训，原 regen 手工补丁转正） */
    ovCount[p + '计步_补给'] = { custom_action_param: '{"start_level": {关卡}, "route": false' + (pp.fast_mode ? ', "route_node": "' + p + '尾数路由", "skip_same_deck": true' : '') + '}' };
    option[p + '启动时关卡数'] = {
      type: 'input', label: '启动时关卡数',
      description: '计数起点，尾数5/0是Boss关；从第1关开始可留空',
      inputs: [{ name: '关卡', label: '关卡', verify: '^([1-9]|[1-9][0-9]|1[0-4][0-9])$' }],
      pipeline_override: ovCount
    };
    option[p + '无尽全自动循环'] = {
      type: 'switch', label: '无尽全自动循环', description: '打一遍后自动花钻石刷新重新打',
      cases: [
        { name: 'No', label: '否', pipeline_override: {} },
        { name: 'Yes', label: '是', pipeline_override: (function(){
            var o = {};
            o[p + '过渡'] = { next: [p + '识别开始战斗', p + '识别boss关', 'wujin_返回'] };
            o['wujin_确定4'] = { next: [p + '重置到1'] };
            return o; })() }
      ]
    };
    if (V2.debugCardUI !== false){
      option[p + 'boss关选卡界面开始'] = {
        type: 'switch', label: '从boss关选卡界面开始', description: '跳过普关流程直接从boss关开始（调试用），需配合启动时关卡数',
        cases: [
          { name: 'No', label: '否', pipeline_override: {} },
          { name: 'Yes', label: '是', pipeline_override: (function(){
              var o = {}; o[p + '初始化完毕'] = { anchor: { '初始化': p + '计步_boss_start' }, next: ['种植物_初始化_植物位置'] };
              return o; })() }
        ]
      };
    }
  }
  /* 「关内点波」任务选项（火龙 v2 同款）：路由参数 wave_mode 非空时生成，default_case=所选档。
     只收 action/repeat、不动 next（agent 每关会 override 点波 next）；override 目标按
     实际生成的节点收窄——点波5_d2 仅双卡组、点波1 仅 front30/bailuo、前10_点波 仅 front10，
     避免把不存在的节点写进 pipeline_override（T1 断链）。留空=不生成该选项，行为与旧版一致。 */
  (function(){
    var wm = String((V2.route.params || {}).wave_mode || '');
    if (!wm || !built.nodes[p + '点波5']) return;
    var waveNodes = [p + '点波5'];
    if (built.nodes[p + '点波5_d2']) waveNodes.push(p + '点波5_d2');
    if (built.nodes[p + '点波1']) waveNodes.push(p + '点波1');
    if (built.nodes[p + '前10_点波']) waveNodes.push(p + '前10_点波');
    var holdOv = {}, burstOv = {};
    waveNodes.forEach(function(n){ holdOv[n] = { action: 'DoNothing' }; });
    waveNodes.forEach(function(n){
      if (/点波1$/.test(n)) burstOv[n] = { action: 'Click', target: V2_WAVE_TAP, repeat: 4, repeat_delay: 200, post_delay: 300 };
      else burstOv[n] = { action: 'Click', target: V2_WAVE_TAP, repeat: 6, repeat_delay: 200, post_delay: /前10_点波$/.test(n) ? 300 : 0 };
    });
    option[p + '关内点波'] = {
      type: 'select', label: '关内点波',
      description: '关内推进波次方式：不点波=只等结算(最稳，关内偏慢)；默认=点波5/点波1交替(现状)；狂点=突发连点(最快)。开局点波不受影响。',
      default_case: wm === 'hold' ? '不点波' : (wm === 'burst' ? '狂点' : '默认'),
      cases: [
        { name: '不点波', label: '不点波（只等结算）', pipeline_override: holdOv },
        { name: '默认', label: '默认（点波5/点波1）', pipeline_override: {} },
        { name: '狂点', label: '狂点加速', pipeline_override: burstOv }
      ]
    };
  })();
  if (V2.boss.feedSelect && built.bossFeedNodes.length){
    var cells = [];
    for (var c = 1; c <= 9; c++) for (var r = 1; r <= 5; r++) cells.push(c + '-' + r);
    var cases = cells.map(function(cid){
      var o = {};
      built.bossFeedNodes.forEach(function(nm){
        o[nm] = { end: v2CellAnchor(cid) };
      });
      return { name: cid, label: cid, pipeline_override: o };
    });
    /* default_case 必须等于**实际烘焙的喂豆格**，否则该 case 的 override 会把它改到别处
       （ha_ 导出时 6-3 被写成 2-3 回退默认，运行时喂豆打到错格）。格从节点名推导
       （boss_喂豆6_3 → 6-3），与节点 end 同源；多喂豆格时取最后一个（收尾/循环那步
       才是「主」喂豆位，与 wl_ 3-3 同约定），推导不出再回落 feedCell。 */
    var dftCase = (function(){
      var hit = null;
      built.bossFeedNodes.forEach(function(nm){
        var m = nm.slice(p.length).match(/^boss_喂豆([1-9])_([1-5])/);
        if (m) hit = m[1] + '-' + m[2];
      });
      return hit || V2.boss.feedCell || '2-3';
    })();
    option[p + 'boss喂豆位置'] = {
      type: 'select', label: 'Boss喂豆位置', description: '作用于全部喂豆步（含首喂与循环）',
      cases: cases, default_case: dftCase
    };
  }
  /* 小关抛花开关 + 每朵花行列坐标（西部 xb_小关同构；开关默认否=关掉前原行为不变）
     位置 input 只被开关 Yes 分支 option 引用，不进任务顶层 option 列表——
     两处都列会在 MFA 界面重复渲染（官方「创意庭院」嵌套用法同款约定，2026-09-08 龙芋实测教训） */
  var nestedOpts = {};
  if (built.throwInfo && built.throwInfo.nodes && built.throwInfo.nodes.length){
    var lastTh = built.throwInfo.nodes[built.throwInfo.nodes.length - 1];
    var skipTo = (((built.nodes[lastTh] || {}).next) || [])[0] || null;
    var thNo = {};
    thNo[built.throwInfo.after] = { next: skipTo ? [skipTo] : [] };
    option[p + '小关是否抛花'] = {
      type: 'switch', label: '小关是否抛花',
      description: '进关点波后抛能量花产豆（deck1 ' + built.throwInfo.nodes.length + ' 朵）；开启后可自定义每朵花的行列坐标',
      cases: [
        { name: 'No', label: '否', pipeline_override: thNo },
        { name: 'Yes', label: '是', option: built.throwInfo.nodes.map(function(_, ix){ return p + '抛花' + (ix + 1) + '位置'; }) }
      ]
    };
    built.throwInfo.nodes.forEach(function(nm, ix){
      var posName = p + '抛花' + (ix + 1) + '位置';
      nestedOpts[posName] = 1;
      var dft = ((((V2.throw || {}).cells) || [])[ix] || '7-1').split('-');
      var ovr = {};
      ovr[nm] = { end: '种植物_初始化_格子{列}_{行}' };
      option[posName] = {
        type: 'input', label: (ix + 1) + '花行列坐标',
        inputs: [{ name: '列', pipeline_type: 'string', default: String(dft[0] || '').trim(), verify: '^[1-9]$' },
                 { name: '行', pipeline_type: 'string', default: String(dft[1] == null ? '1' : dft[1]).trim() || '1', verify: '^[1-5]$' }],
        pipeline_override: ovr
      };
    });
  }
  var task = [{
    name: tn || (V2.world ? V2.world : '自定义') + '无尽(v2生成)',
    entry: p + 'Entry',
    /* 简介带卡槽/路由摘要（现网五套脚本同款「卡槽 …｜注意 …」文案）：
       部署时原样抄进 interface.json 对应任务的 description，AI/人工都不用再反推卡槽 */
    description: v2TaskIntro(),
    /* 顶层列表 = 全部定义 - 仅嵌套引用的位置 input（重复渲染守卫，见上） */
    option: Object.keys(option).filter(function(k){ return !nestedOpts[k]; })
  }];
  return { option: option, task: task, nested: Object.keys(nestedOpts) };
}

/* ---- R8：生成管线内部断链 ----
 * next/anchor 目标必须存在（或属共享外部节点）；任何悬空引用都会在运行到该节点时
 * bad next 直接失败（2026-09-08 巡检：none 模式漏生成神器补给链，Boss 关必炸）。 */
function v2ChainIssues(built){
  var out = [];
  var ext = /^(wujin_|种植物_初始化|神器_初始化)/;
  Object.keys(built.nodes).forEach(function(k){
    var v = built.nodes[k];
    (v.next || []).forEach(function(n){
      if (!built.nodes[n] && !ext.test(n)) out.push(['R8', 'error', '生成管线断链：' + k + ' → ' + n]);
    });
    Object.keys(v.anchor || {}).forEach(function(a){
      var t = v.anchor[a];
      if (!built.nodes[t] && !ext.test(t)) out.push(['R8', 'error', '生成管线 anchor 断链：' + k + ' → ' + t]);
    });
  });
  return out;
}

/* ---- R7：agent 计数器 override 目标存在性 ----
 * fx_counter 按路由参数改写一批节点的 next，目标不存在 → bad next → 任务直接失败
 * （2026-09-08 龙芋：front30 速刷指向不存在的 给豆1_2，第2关 38ms 失败）。
 * 锚点（被 override 的节点本身）缺失只是 override 无效不炸任务 → warn；
 * 被写进 next 的目标缺失才致命 → error。常规目标已由 v2BuildPipeline 自动补齐，
 * 此项兜底手填参数（如自定义 front30_feed）。 */
function v2CounterIssues(built){
  var p = built.prefix, nodes = built.nodes, rt = V2.route;
  if (rt.mode === 'none') return [];
  var pp = rt.params || {}, out = [];
  var full = function(n){ return n.indexOf(p) === 0 ? n : p + n; };
  var has = function(n){ return !!nodes[full(n)]; };
  var targets = ['识别结算', '识别开始战斗', '识别boss关', '配队1普', '配队1boss'].map(full);
  var anchors = ['尾数路由'];
  if ((rt.tail && rt.tail.d2 || []).length) targets.push(full('配队2d2'));
  if (pp.deck1_first > 0){
    anchors.push('boss_点加速');
    var bfE = String(pp.boss_feed_early || '');
    var bfL = String(pp.boss_feed_late || '');
    targets.push(bfE ? (bfE.indexOf(p) === 0 ? bfE : p + bfE) : full('boss_喂豆1_3_d1'));
    targets.push(bfL ? (bfL.indexOf(p) === 0 ? bfL : p + bfL) : full('boss_喂豆2_3'));
  }
  var f30f = String(pp.front30_feed || '');
  if (/^[1-9]-[1-5]$/.test(f30f)) f30f = p + '给豆' + f30f.replace('-', '_');
  if (pp.front30 > 0){
    anchors.push('点波5');
    targets = targets.concat([f30f || (p + '给豆1_2'), full('点波1'), p + '狂点5s']);
    if ((rt.tail && rt.tail.d2 || []).length) anchors.push('点波5_d2');
  }
  if (pp.front10 > 0) targets = targets.concat(
    ['前10_等结算', '前10_拖豆1', '前10_等结算2', '前10_拖豆2', '前10_点波等结算', '前10_点波'].map(full));
  if (pp.bailuo_from > 0){
    anchors.push('点波5');
    targets = targets.concat([full('补白1'), full('补白等待'), full('点波1')]);
  }
  if (pp.beilei_stop > 0){
    anchors.push('d1_胆小菇5_4');
    targets.push(full('蓓蕾滑8列_1'));
  }
  var seen = {};
  targets.forEach(function(n){
    if (seen[n]) return;
    seen[n] = 1;
    if (!nodes[n]) out.push(['R7', 'error', 'agent 计数器 override 目标不存在：' + n +
      '（fx_counter 会把它写进 next，缺节点=bad next 任务失败。请在顺序/Boss链里补同名步骤，或改路由参数/front30_feed）']);
  });
  anchors.forEach(function(n){
    if (seen[n]) return;
    seen[n] = 1;
    if (!has(n)) out.push(['R7', 'warn', 'agent override 锚点不存在：' + n +
      '（改写无效、沿用静态链，通常无害；若该参数本应生效请补节点）']);
  });
  return out;
}

/* 任务简介（interface.json task[].description 用）。
   现网五套脚本的简介都是「卡槽 配队1[…] 配队2[…]｜注意…」一段式文案，以前靠部署时手写，
   阵型一改就忘同步（skill 自检清单项「任务简介卡槽文案对齐」）。这里从当前状态直接生成
   同款文案：配队2 按界面可见 1~8 编号（内部槽位 9~16 复用坐标），AI/人工部署 ③ task 片段时
   把 description 原样抄进 interface.json 即可，不必再对着管线反推卡槽。 */
function v2TaskIntro(){
  var L = [];
  try {
    if (typeof slotNames !== 'undefined' && slotNames && slotNames.length){
      var fmtDeck = function(arr){
        return arr.map(function(n, i){ return (i + 1) + (n && String(n).trim() ? n : '空'); }).join(' ');
      };
      L.push('卡槽 配队1[' + fmtDeck(slotNames.slice(0, 8)) + ']' +
        (slotNames.slice(8).join('') ? ' 配队2[' + fmtDeck(slotNames.slice(8, 16)) + ']' : ''));
    }
  } catch (e) {}
  var notes = [];
  var r = V2.route, pp = r.params || {};
  var have = function(a){ return a && a.length; };
  if (r.mode === 'tail'){
    var d2t = (r.tail.d2 || []).filter(function(x){ return x >= 0 && x <= 9; });
    var bt = (r.tail.boss || []).filter(function(x){ return x >= 0 && x <= 9; });
    var seg = [];
    if (have(d2t)) seg.push('尾数' + d2t.join('/') + '切deck2');
    if (have(bt)) seg.push('尾数' + bt.join('/') + '走Boss');
    if (seg.length) notes.push(seg.join('、'));
  } else if (r.mode === 'phase'){
    notes.push('阶段分流 deck2@' + JSON.stringify(r.phase.deck2Levels || []));
  }
  if (pp.deck1_first > 0) notes.push('前' + pp.deck1_first + '关不切deck2(deck1_first)');
  if (pp.fast_mode) notes.push('激进省时:前段post0+同卡组跳切');
  if (pp.deck2_tail3_first > 0) notes.push('仅×3关切deck2到第' + pp.deck2_tail3_first + '关');
  if (pp.front10 > 0) notes.push('前' + pp.front10 + '关小关先等结算(未命中拖豆' + (pp.front10_feed || '1-3') + '开大)');
  if (pp.front30 > 0 && pp.front30 > (pp.front10 || 0)) notes.push('前' + pp.front30 + '关速刷(给豆' + (pp.front30_feed || '1-2') + '+狂点)');
  if (pp.beilei_stop > 0) notes.push('第' + pp.beilei_stop + '关后不补蓓蕾');
  if (pp.bailuo_from > 0) notes.push('第' + pp.bailuo_from + '关起补白萝卜(防吸阵)');
  var ops = V2.boss.ops || [];
  for (var i = 0; i < ops.length; i++){
    if (ops[i].t === 'feed'){
      notes.push('Boss' + (ops[i].loop ? '循环喂豆' : '静态喂豆') + (ops[i].cell || V2.boss.feedCell || '') +
        (V2.boss.feedSelect ? '(位置可自定义)' : ''));
      break;
    }
  }
  if (V2.throw && V2.throw.on && have(V2.throw.cells))
    notes.push('抛花卡槽' + (V2.throw.slot || 1) + '→' + V2.throw.cells.join('/'));
  if (pp.wave_mode === 'hold') notes.push('「关内点波」默认不点波(只等结算)');
  else if (pp.wave_mode === 'burst') notes.push('「关内点波」默认狂点');
  notes.push('首次运行/换分辨率必开「初始化卡槽和草坪位置」');
  if (r.mode !== 'none') notes.push('勿与其它自制无尽同时运行(agent 计数器共用)');
  return (L.length ? L.join('') + '｜' : '') + notes.join('；');
}

/* pipeline 片段头注释里的卡槽表。
   pipeline JSON 本身只有种植节点/锚点，不含卡槽名 → 脚本没种到的槽位（如某世界第 8 格）
   导出后就查不到，阵型一览会显示成"空"。把头注释带上，页面/交接就能还原完整 16 格。
   配队2 按界面可见 1~8 编号（内部占 9~16），与任务简介/现网部署文案同款。 */
function v2SlotHeaderLine(){
  try {
    if (typeof slotNames === 'undefined' || !slotNames || !slotNames.length) return '';
    var fmt = function(arr, start){
      return arr.map(function(n, i){ return (start + i) + (n && String(n).trim() ? n : '空'); }).join(' ');
    };
    return ' * 卡槽：配队1[' + fmt(slotNames.slice(0, 8), 1) + '] 配队2[' + fmt(slotNames.slice(8, 16), 1) + ']（配队2 内部槽位 9~16）\n';
  } catch (e) { return ''; }
}

function v2ExportPipeline(){
  var built = v2BuildPipeline();
  var task = v2BuildTask(built);
  /* 生成前先自动体检 */
  var oIssues = v2OrderIssues(1).concat(V2.order.deck2 && V2.order.deck2.length ? v2OrderIssues(2) : []);
  var bIssues = v2BossIssues();
  var rIssues = v2RouteIssues(V2.route, { subSlotsOn: subSlotsOn && slotNames.slice(8).join('') !== '', d2Filled: true, bossReady: (V2.boss.ops || []).length > 0 });
  var cIssues = v2CounterIssues(built).concat(v2ChainIssues(built));
  var all = oIssues.concat(bIssues).map(function(x){ return x[0] + '/' + x[1] + ' ' + x[2]; })
    .concat(rIssues.filter(function(x){ return x[1] === 'error'; }).map(function(x){ return x[0] + '/' + x[1] + ' ' + x[2]; }))
    .concat(cIssues.filter(function(x){ return x[1] === 'error'; }).map(function(x){ return x[0] + '/' + x[1] + ' ' + x[2]; }));
  var out = '/* ===== pipeline 片段：' + built.prefix + ' （节点 ' + Object.keys(built.nodes).length + ' 个） =====\n' +
    (all.length ? ' * 导出前体检提示：\n *   ' + all.slice(0, 10).join('\n *   ') + '\n' : ' * 体检：无 error 级问题\n') +
    ' * 坐标系：720 短边；配队坐标 [766,395]→卡组1[195,218]/卡组2[199,443]（复兴/童话布局，其他布局先实测）\n' +
    v2SlotHeaderLine() +
    ' * 简介：③ task[0].description 已按现网「卡槽…｜注意…」格式生成，部署时原样写入 interface.json 对应任务\n' +
    ' * agent：fx_counter/fx_counter_reset/fx_monitor_switch（interface.json agent 块 + 系统 Python + pip install maafw）\n' +
    ' * 若用 input 覆盖 custom_action_param：agent 收到双层编码，需解两层；同一 custom 节点只允许一个 input 覆盖\n' +
    ' * 文件结构：①本头注释（体检） → ②pipeline 节点 JSON → ③task 片段；分段以下方「↓↓②」「↓↓③」标记为准\n' +
    ' */\n' +
    '/* ↓↓② pipeline 节点 JSON（部署时单独存成 YS_*.json；范围 = 本行起，到「③ task 片段」标记之前）↓↓ */\n' +
    JSON.stringify(built.nodes, null, 1) +
    '\n\n/* ↓↓③ task 片段（option + task）：合并进 resource_self/task/*_wj.json 并在 interface.json 注册用 ↓↓ */\n' +
    JSON.stringify(task, null, 1);
  v2OutSet(out);
  showToast('已生成 pipeline 片段（' + Object.keys(built.nodes).length + ' 节点）');
}
