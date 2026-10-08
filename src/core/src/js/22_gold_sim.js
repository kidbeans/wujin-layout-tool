/* ================= 22_gold_sim.js —— 金卡3次推演 + 行覆盖校验（O9）+ 链路联动 =================
 * 规则：金卡（橙色品质）初始每种只有 3 次。推演「链里每种金卡只种前 3 个」后，
 *   第一关开始时每一行是否至少有一个能守住阵型的强力主力（有迫击炮类追踪 → 该行直接视为安全；
 *   气流水仙花/珊瑚这类不算守阵主力）。
 * 因种植顺序导致不合格（某格的主力步排在同种第 4 次之后失效）→ 提出警告。
 * 可视化：顺序面板打开时棋盘叠加步数徽章（金=金卡步 / 绿=追踪 / 红=失效），行号绿✓黄⚠红✗，
 *   列表悬停高亮目标格。白名单可在 V2.goldSim.strong / .tracking 覆盖（设置导出口）。
 */
"use strict";

var V2_GOLD_LIMIT = 3;   /* 金卡初始次数（游戏规则） */

/* 默认白名单（可用 V2.goldSim.strong / .tracking 整表覆盖；覆盖后以 V2 为准） */
var V2_STRONG_DFT = ['大哥', '洋芋', '桑葚', '药师', '暗物质火龙果', '茄子忍者', '食人花豌豆', '大守卫菇',
  '金蝉花', '斯巴达竹', '电鳗香蕉', '塔黄', '曼德拉', '牛蒡', '鸭梨大弟', '蛇草', '球果',
  '太极木槿', '地锯草'];
var V2_TRACK_DFT = ['军炮', '豌豆迫击炮', '苹果迫击炮'];   /* 暗物质火龙果为单行输出 → 计主力（用户修正） */

function v2SimSets(){
  var g = V2.goldSim || {};
  return {
    strong: g.strong && g.strong.length ? g.strong : V2_STRONG_DFT,
    tracking: g.tracking && g.tracking.length ? g.tracking : V2_TRACK_DFT,
    limit: g.limit || V2_GOLD_LIMIT
  };
}
function v2IsGoldName(n){
  var m = (window.PLANT_META || {})[n];
  return !!(m && m.rar === '橙色');
}
/* 一格有效内容的守阵能力：'' 无 / 'strong' 主力 / 'tracking' 追踪安全 */
function v2SimCellKind(base, merge, sets){
  if (!base) return '';
  if (sets.tracking.indexOf(base) > -1 || (merge && sets.tracking.indexOf(merge) > -1)) return 'tracking';
  if (base === '大哥') return 'strong';   /* 含 x大：金卡本体必为主力 */
  if (sets.strong.indexOf(base) > -1) return 'strong';
  return '';
}

/* 推演：deck1 + deck2 两链按各自金卡计数独立模拟，行覆盖取两链并集 */
function v2GoldSim(){
  var sets = v2SimSets();
  /* 融合格登记：board 上 base=大哥 且有材料的格 —— 超次大哥步必须带金卡检测（check），否则盲种失败断融合 */
  var mergeBase = {};
  for (var rr = 0; rr < rows; rr++) for (var cc = 0; cc < cols; cc++){
    var cl = grid[rr][cc];
    if (cl && cl.base === '大哥' && cl.merge) mergeBase[(cc + 1) + '-' + (rr + 1)] = cl.merge;
  }
  var usage = { deck1: {}, deck2: {} };
  var out = { sets: sets, usage: usage, steps: { deck1: [], deck2: [] }, cellSteps: { deck1: {}, deck2: {} },
              rows: [], fails: 0, mergeErrs: 0 };

  function walk(deck){
    var no = 0;
    (V2.order[deck] || []).forEach(function(it){
      if (it.t !== 'plant') return;
      no++;
      var name = it.name || v2SlotName(it.slot);
      var gold = v2IsGoldName(name);
      var used = usage[deck][name] || 0;
      var fail = gold && used >= sets.limit;
      if (!fail) usage[deck][name] = used + 1;
      else out.fails++;
      var isMergeBase = !!(fail && mergeBase[it.cell || ''] && name === '大哥');
      if (isMergeBase && !it.check) out.mergeErrs++;
      var st = { no: no, name: name, cell: it.cell || '', slot: it.slot, gold: gold, fail: fail,
                 check: !!it.check, mergeBase: isMergeBase, mergeName: isMergeBase ? mergeBase[it.cell || ''] : '',
                 reason: fail ? (name + ' 金卡初始仅 ' + sets.limit + ' 次（前 ' + used + ' 次已用完）') : '' };
      out.steps[deck].push(st);
      if (st.cell){
        (out.cellSteps[deck][st.cell] = out.cellSteps[deck][st.cell] || []).push(st);
      }
    });
  }
  walk('deck1');
  walk('deck2');

  /* 行覆盖：棋盘内容为基准，链成功与否决定该格有效内容 */
  for (var r = 0; r < rows; r++){
    var strongs = [], tracks = [], lost = [];   // lost：因失效而缺失的候选主力
    for (var c = 0; c < cols; c++){
      var cell = grid[r][c];
      if (!cell || !cell.base || v2Consumable(cell.base)) continue;
      var cid = v2CellId(r, c);
      var effBase = null, effMerge = null;
      if (cell.base === '大哥' && cell.merge){
        var b1 = v2SimStepFor(out, 'deck1', cid, cell.base), b2 = v2SimStepFor(out, 'deck2', cid, cell.base);
        var m1 = v2SimStepFor(out, 'deck1', cid, cell.merge), m2 = v2SimStepFor(out, 'deck2', cid, cell.merge);
        var bOk = (b1 && !b1.fail) || (b2 && !b2.fail);
        var mOk = (m1 && !m1.fail) || (m2 && !m2.fail);
        if (bOk){ effBase = '大哥'; if (mOk) effMerge = cell.merge; }
        else if (mOk){ effBase = cell.merge; }   /* 大哥没种上，材料落单 */
      } else {
        var s1 = v2SimStepFor(out, 'deck1', cid, cell.base), s2 = v2SimStepFor(out, 'deck2', cid, cell.base);
        if (!s1 && !s2){ effBase = cell.base; effMerge = cell.merge || ''; }   /* 未入链：按棋盘预期算 */
        else if ((s1 && !s1.fail) || (s2 && !s2.fail)){ effBase = cell.base; effMerge = cell.merge || ''; }
        else {
          var f = (s1 && s1.fail) ? s1 : s2;
          if (f) lost.push({ name: cell.base, cell: cid, no: f.no, reason: f.reason, deck: (s1 && s1.fail) ? 'deck1' : 'deck2' });
        }
      }
      if (!effBase) continue;
      var kind = v2SimCellKind(effBase, effMerge, sets);
      var label = effBase + (effMerge ? '+' + effMerge : '');
      if (kind === 'tracking') tracks.push(label + '@' + cid);
      else if (kind === 'strong') strongs.push(label + '@' + cid);
    }
    var verdict = tracks.length ? 'tracking' : (strongs.length ? 'strong' : 'none');
    out.rows.push({ r: r, verdict: verdict, strongs: strongs, tracks: tracks, lost: lost });
  }
  return out;
}
function v2SimStepFor(sim, deck, cid, name){
  var arr = sim.cellSteps[deck][cid];
  if (!arr) return null;
  for (var i = 0; i < arr.length; i++) if (arr[i].name === name) return arr[i];
  return null;
}

/* O9 摘要（拼进 v2OrderIssues 报告）
 * 分级：① 融合格超次大哥缺金卡检测 → error（断融合，必须修）；
 *       ② 第一关行无守阵主力 → error（附具体修法）；
 *       ③ 其余超次步 → info（通用性预留，非错误——超 3 次写链是为后续关卡/铲补留的通用位） */
function v2GoldIssues(){
  var sim = v2GoldSim();
  var out = [];
  if (!(V2.order.deck1 || []).length && !(V2.order.deck2 || []).length) return out;
  ['deck1', 'deck2'].forEach(function(d){
    (sim.steps[d] || []).forEach(function(s){
      if (!s.fail) return;
      if (s.mergeBase && !s.check){
        out.push(['O9', 'error', '第 ' + s.no + ' 步 大哥 @ ' + s.cell + ' 为融合格本体且同种已超初始 ' + sim.sets.limit +
          ' 次，但未开金卡检测（检）——第一关该步盲种必失败，材料 ' + s.mergeName + ' 会落单断融合。' +
          '修法：顺序面板给该步勾选「检」（ColorMatch 金卡检测，失败自动跳过该格本体+材料）。']);
      } else if (!(s.mergeBase && s.check)){
        out.push(['O9', 'info', '第 ' + s.no + ' 步 ' + s.name + ' @ ' + s.cell + ' 超初始 ' + sim.sets.limit +
          ' 次——第一关不生效（通用性预留，非错误；如需第一关生效，把该格提前到同种前 ' + sim.sets.limit + ' 步内）。']);
      }
    });
  });
  sim.rows.forEach(function(ro){
    if (ro.verdict === 'none'){
      if (ro.lost.length){
        out.push(['O9', 'error', '路' + (ro.r + 1) + ' 第一关无守阵主力（气流/珊瑚等辅助不计）；失效主力：' +
          ro.lost.map(function(l){ return l.name + '@' + l.cell + '（第' + l.no + '步，同种超 ' + sim.sets.limit + ' 次）'; }).join('、') +
          '。修法（三选一）：① 把失效格提前到同种前 ' + sim.sets.limit + ' 步内（与前面的同种格对调顺序）；' +
          '② 该格改种非金卡主力；③ 确认可接受由追踪类（迫击炮/暗物质）单独覆盖该行。']);
      } else {
        out.push(['O9', 'error', '路' + (ro.r + 1) + ' 第一关无守阵主力（气流/珊瑚等辅助不计），且该行没有因超次失效的主力——本行确实缺少守阵植物。' +
          '修法：在本行补种主力（洋芋/大哥/暗物质火龙果等）或把辅助（气流/珊瑚）换成主力。']);
      }
    } else if (ro.verdict === 'tracking'){
      out.push(['O9', 'info', '路' + (ro.r + 1) + ' 安全（追踪覆盖）：' + ro.tracks.join('、')]);
    }
  });
  return out;
}
/* O9 自动并入 校验顺序 报告（金卡推演两 deck 一起走，只在 deck1 拼一次防重复） */
(function(){
  if (typeof v2OrderIssues !== 'function') return;
  var orig = v2OrderIssues;
  v2OrderIssues = function(deckNo){
    var out = orig(deckNo);
    if (deckNo !== 1) return out;
    try { out = out.concat(v2GoldIssues()); } catch (e) {}
    return out;
  };
})();

/* 金卡推演完整报告（🥇 按钮 → ordReport） */
function v2GoldReport(){
  var sim = v2GoldSim();
  var L = [];
  var hasChain = (V2.order.deck1 || []).length + (V2.order.deck2 || []).length;
  if (!hasChain) return '（顺序链为空）先「从棋盘生成草案」或用画笔追加种植步，再跑金卡推演。';
  L.push('🥇 金卡推演（金卡初始每种 ' + sim.sets.limit + ' 次）');
  var goldNames = {};
  ['deck1', 'deck2'].forEach(function(d){
    (sim.steps[d] || []).forEach(function(s){ if (s.gold) goldNames[d + '|' + s.name] = 1; });
  });
  var gn = Object.keys(goldNames);
  if (gn.length){
    L.push('── 金卡用量 ──');
    gn.forEach(function(k){
      var dd = k.split('|')[0], nm = k.split('|')[1];
      var used = sim.usage[dd][nm] || 0;
      L.push((used > sim.sets.limit ? '△ ' : '· ') + nm + '（' + (dd === 'deck2' ? '配队2' : '配队1') + '）' + used + '/' + sim.sets.limit +
        (used > sim.sets.limit ? '：第 ' + (sim.sets.limit + 1) + ' 次起第一关不生效（通用性预留，非错误）' : ''));
    });
  } else {
    L.push('链中无金卡种植步。');
  }
  L.push('── 第一关行覆盖 ──');
  sim.rows.forEach(function(ro){
    var mark = ro.verdict === 'tracking' ? '⚠ 追踪安全' : (ro.verdict === 'strong' ? '✓ 有主力' : '✗ 无主力');
    var detail = ro.strongs.concat(ro.tracks).join('、');
    L.push('路' + (ro.r + 1) + '  ' + mark + (detail ? '：' + detail : '') +
      (ro.verdict === 'tracking' ? '（迫击炮类追踪 → 视为安全）' : ''));
  });
  var mergeBad = [], overLim = [];
  ['deck1', 'deck2'].forEach(function(d){
    (sim.steps[d] || []).forEach(function(s){
      if (!s.fail) return;
      (s.mergeBase && !s.check ? mergeBad : overLim).push(
        (d === 'deck2' ? '[配队2] ' : '') + '第 ' + s.no + ' 步 ' + s.name + ' @ ' + s.cell + '：' + s.reason +
        (s.mergeBase && !s.check ? ' → 必须修：顺序面板给该步勾选「检」（金卡检测，失败自动跳过本体+材料），否则材料 ' + s.mergeName + ' 落单断融合。'
                                  : ' → 第一关不生效（通用性预留，非错误）；如需第一关生效，把该格提前到同种前 ' + sim.sets.limit + ' 步内。'));
    });
  });
  if (mergeBad.length){
    L.push('── 融合断点（必须修）──');
    mergeBad.forEach(function(x){ L.push('✗ ' + x); });
  }
  if (overLim.length){
    L.push('── 超初始次数步（通用性预留，非错误）──');
    overLim.forEach(function(x){ L.push('· ' + x); });
  }
  var bad = sim.rows.filter(function(ro){ return ro.verdict === 'none'; }).length;
  L.push('── 结论 ──');
  if (bad || mergeBad.length){
    L.push('✗ ' + (bad ? bad + ' 行无守阵主力；' : '') + (mergeBad.length ? mergeBad.length + ' 个融合断点（大哥超次未开检）。' : '') + '合计修正后重跑即可。');
  } else if (overLim.length){
    L.push('⚠ 行覆盖达标；' + overLim.length + ' 个超次预留步（第一关不生效，属通用性设计，非错误）。');
  } else {
    L.push('✓ 全部行达标，金卡用量未超限。');
  }
  L.push('');
  L.push('说明：气流(水仙花)/珊瑚等辅助不计主力；暗物质火龙果为单行输出计入主力；军炮/豌豆迫击炮/苹果迫击炮等迫击炮类追踪 → 该行直接安全。');
  L.push('白名单可在导出 JSON 的 goldSim 字段调整（strong / tracking / limit）。');
  return L.join('\n');
}

/* ── 顺序面板：🥇按钮 + 可视化开关 + 列表悬停高亮（纯逻辑测试环境无 DOM 时跳过） ── */
(function v2GoldBind(){
  if (typeof document === 'undefined' || !document.getElementById) return;
  var btn = document.getElementById('ordGold');
  if (btn) btn.addEventListener('click', function(){
    var box = document.getElementById('ordReport');
    if (box) box.value = v2GoldReport();
  });
  var vis = document.getElementById('ordVis');
  if (vis){
    vis.checked = V2.orderVis !== false;
    vis.addEventListener('change', function(){
      V2.orderVis = vis.checked; save(); renderGrid();
    });
  }
  var box = document.getElementById('ordList');
  if (!box) return;
  function hl(row, on){
    var it = v2OrderItems()[+row.dataset.i];
    if (!it || !it.cell) return;
    var pc = v2ParseCell(it.cell);
    var d = document.querySelector('#grid .cell[data-r="' + pc.r + '"][data-c="' + pc.c + '"]');
    if (d) d.classList.toggle('v2ord-hl', !!on);
  }
  box.addEventListener('mouseover', function(e){ var row = e.target.closest('.ordrow'); if (row) hl(row, true); });
  box.addEventListener('mouseout', function(e){ var row = e.target.closest('.ordrow'); if (row) hl(row, false); });
})();
