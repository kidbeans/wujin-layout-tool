/* ================= v2 状态层：状态/撤销重做/多存档/缩容拦截（P0） =================
 * 依赖 v1 全局：save/load/renderGrid/renderSlots/buildAllChips/renderSplitUI/
 *               updateStatus/showToast/cols/rows/grid/slotNames/plants/...
 * 本文件在 00_v1_app.js 之后执行；v1 的启动段被移到 90_boot.js。
 */
"use strict";

/* ---- v2 顶层状态 ---- */
function v2Default(){
  return {
    version: 2,
    world: '',
    prefix: 'wj_',
    route: {
      mode: 'tail',                       /* tail | phase | none */
      tail:  { d2: [3, 8], boss: [5, 0] },
      phase: { deck2Levels: [2, 12], bossEarlyFeed: 20, farmFrom: 21 },
      params: { start_level: 1, deck1_first: 0, front10: 0, front10_feed: '', front30: 0, fast_mode: 0,
                front30_feed: '', deck2_tail3_first: 0, beilei_stop: 0,
                boss_feed_early: '', boss_feed_late: '',
                bailuo_from: 0, wave_mode: '',
                /* 第 XX 关后不再补阵（2026-10-10 批 B）：0/空=关闭；
                   farm_wave_mode 是不补阵期的关内点波档，留空=沿用全局 wave_mode */
                farm_stop_from: 0, farm_wave_mode: '' }
    },
    boss: {
      ops: [],                            /* {t:'stack'|'feed'|'accel'|'flower', ...} */
      feedSelect: false,
      feedCell: '2-3'
    },
    throw: { on: false, slot: 1, cells: ['7-1', '7-2'] },   /* 小关抛花: deck1 点波_初始后滑能量花到指定格(西部同构) */
    order: { deck1: [], deck2: [] }
  };
}
var V2 = v2Default();

function v2DeepMerge(dst, src){
  if (!src || typeof src !== 'object') return dst;
  for (var k in src){
    if (!(k in dst)) dst[k] = src[k];
    else if (typeof dst[k] === 'object' && dst[k] && !Array.isArray(dst[k]) &&
             typeof src[k] === 'object' && src[k] && !Array.isArray(src[k])) v2DeepMerge(dst[k], src[k]);
    else dst[k] = src[k];
  }
  return dst;
}
function v2Clone(o){ return JSON.parse(JSON.stringify(o)); }
/* 存档网格落位防护（2026-09-14 审查）：导入/恢复的 boards 尺寸与 meta.cols/rows（或当前 cols/rows）
   不一致时，旧代码直接赋值 → renderGrid 越界读 undefined。统一按目标尺寸裁剪/补齐。
   meta 缺失（旧存档）时以调用方传入的 fallback 尺寸为准。 */
function v2FitBoard(b, nc, nr){
  var out = [];
  for (var r = 0; r < nr; r++){
    var row = [];
    for (var c = 0; c < nc; c++){
      var cell = (b && b[r] && b[r][c]) ? b[r][c] : null;
      if (cell && typeof cell === 'object' && !Array.isArray(cell)){
        row.push({ base: cell.base || '', merge: cell.merge || '', vine: cell.vine || '',
                   tile: !!cell.tile, ops: (cell.ops || []).slice() });
      } else row.push({ base: '', merge: '', vine: '', tile: false, ops: [] });
    }
    out.push(row);
  }
  return out;
}

/* ---- save 钩子：撤销栈 + v2 状态持久化 ---- */
var V2_SAVE_KEY = 'wujin_v2_state';
var v2UndoStack = [], v2RedoStack = [], v2LastSer = null;

function v2SerializeAll(){
  return JSON.stringify({ cols: cols, rows: rows, grid: grid, slotNames: slotNames,
    plants: plants, subSlotsOn: subSlotsOn, fxOn: fxOn, splitOn: splitOn, split: split, v2: V2 });
}

function v2RestoreAll(json){
  var d = JSON.parse(json);
  cols = d.cols || 9; rows = d.rows || 5;
  grid = v2FitBoard(d.grid, cols, rows);          /* 尺寸不匹配时裁剪/补齐（2026-09-14 审查防护） */
  slotNames = d.slotNames || []; plants = d.plants;
  subSlotsOn = !!d.subSlotsOn; fxOn = d.fxOn !== false; splitOn = !!d.splitOn;
  split = d.split || { early: null, late: null };
  if (split.early) split.early = v2FitBoard(split.early, cols, rows);
  if (split.late) split.late = v2FitBoard(split.late, cols, rows);
  V2 = v2Clone(d.v2 || v2Default());
  var c1 = document.getElementById('colN'), r1 = document.getElementById('rowN');
  if (c1) c1.value = cols; if (r1) r1.value = rows;
  buildAllChips(); renderSlots(); renderGrid(); renderSplitUI(); updateStatus();
  if (typeof v2RefreshPanels === 'function') v2RefreshPanels();
}

function v2Undo(){
  if (!v2UndoStack.length){ showToast('没有可撤销的操作'); return; }
  v2RedoStack.push(v2SerializeAll());
  v2RestoreAll(v2UndoStack.pop());
  showToast('已撤销');
}
function v2Redo(){
  if (!v2RedoStack.length){ showToast('没有可重做的操作'); return; }
  v2UndoStack.push(v2SerializeAll());
  v2RestoreAll(v2RedoStack.pop());
  showToast('已重做');
}

var v2FlushSave = null;
(function v2PatchSave(){
  var origSave = save;
  /* 持久化节流（2026-09-14 审查）：连续输入（卡槽名等 input 事件）每击键都全量
     JSON.stringify 双写 localStorage。现改为 150ms debounce 合并写；撤销栈比较
     （v2LastSer/v2UndoStack）保持同步执行——撤销粒度语义不变。
     关闭/刷新前 flush 兜底，防最后一次编辑未落盘。 */
  var saveTimer = null;
  function flushSave(){
    if (saveTimer){ clearTimeout(saveTimer); saveTimer = null; }
    origSave();
    try{ localStorage.setItem(V2_SAVE_KEY, JSON.stringify(V2)); }catch(e){}
  }
  save = function(){
    try{
      var now = v2SerializeAll();
      if (v2LastSer !== null && v2LastSer !== now){
        v2UndoStack.push(v2LastSer);
        if (v2UndoStack.length > 80) v2UndoStack.shift();
        v2RedoStack.length = 0;
      }
      v2LastSer = now;
    }catch(e){}
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function(){ saveTimer = null; origSave(); try{ localStorage.setItem(V2_SAVE_KEY, JSON.stringify(V2)); }catch(e){} }, 150);
  };
  if (typeof window !== 'undefined' && window.addEventListener)
    window.addEventListener('beforeunload', flushSave);
  v2FlushSave = flushSave;   /* 需要立即落盘的场景（测试/交接）可显式调用 */
})();

/* ---- 多存档槽位（整包快照：v1+v2） ---- */
var V2_SLOTS_KEY = 'wujin_v2_slots';
function v2ListSlots(){ try{ return JSON.parse(localStorage.getItem(V2_SLOTS_KEY) || '{}'); }catch(e){ return {}; } }
function v2SaveSlot(name){
  if (!name){ showToast('请先输入存档名'); return; }
  var s = v2ListSlots(); s[name] = JSON.parse(v2SerializeAll());
  try{ localStorage.setItem(V2_SLOTS_KEY, JSON.stringify(s)); showToast('已保存存档：' + name); }
  catch(e){ showToast('保存失败：' + e.message); }
}
function v2LoadSlot(name){
  var s = v2ListSlots();
  if (!s[name]){ showToast('存档不存在：' + name); return; }
  v2UndoStack.push(v2SerializeAll());
  v2RestoreAll(JSON.stringify(s[name]));
  showToast('已载入存档：' + name);
}
function v2DeleteSlot(name){
  var s = v2ListSlots(); delete s[name];
  try{ localStorage.setItem(V2_SLOTS_KEY, JSON.stringify(s)); showToast('已删除存档：' + name); }catch(e){}
}
function v2ExportSlots(){ return JSON.stringify(v2ListSlots(), null, 1); }
function v2ImportSlots(text){
  var s; try{ s = JSON.parse(text); }catch(e){ showToast('JSON 解析失败'); return; }
  var cur = v2ListSlots(), n = 0;
  for (var k in s){ cur[k] = s[k]; n++; }
  try{ localStorage.setItem(V2_SLOTS_KEY, JSON.stringify(cur)); showToast('已导入 ' + n + ' 个存档'); }catch(e){}
}

/* ---- 缩容拦截：替换 btnResize（cloneNode 去旧监听） ---- */
(function v2PatchResize(){
  var old = document.getElementById('btnResize');
  if (!old) return;
  var btn = old.cloneNode(true);
  old.parentNode.replaceChild(btn, old);
  btn.addEventListener('click', function(){
    var nc = Math.max(1, Math.min(9, parseInt(document.getElementById('colN').value) || 9));
    var nr = Math.max(1, Math.min(5, parseInt(document.getElementById('rowN').value) || 5));
    var lost = 0;
    var boards = [grid];
    if (split.early) boards.push(split.early);
    if (split.late) boards.push(split.late);
    boards.forEach(function(b){
      for (var r = 0; r < b.length; r++){
        for (var c = 0; c < (b[r] || []).length; c++){
          if (r >= nr || c >= nc){
            var cell = b[r][c];
            if (cell && (cell.base || cell.merge || cell.vine || (cell.ops && cell.ops.length))) lost++;
          }
        }
      }
    });
    if (lost > 0 && !confirm('缩容将丢弃 ' + lost + ' 个格子的数据（含分棋盘）。确定继续？')) return;
    var arr = grid;
    cols = nc; rows = nr; grid = [];
    for (var r2 = 0; r2 < nr; r2++){
      var row = [];
      for (var c2 = 0; c2 < nc; c2++){
        row.push((arr[r2] && arr[r2][c2]) ? JSON.parse(JSON.stringify(arr[r2][c2]))
                                          : { base: '', merge: '', vine: '', tile: false, ops: [] });
      }
      grid.push(row);
    }
    save(); renderGrid();
    if (lost > 0) showToast('已缩容（丢弃 ' + lost + ' 格，可 Ctrl+Z 撤销）');
  });
})();

/* ---- 棋盘小工具（各模块共用） ---- */
function v2CellId(r, c){ return (c + 1) + '-' + (r + 1); }        /* 列-行 */
function v2ParseCell(id){ var p = (id || '').split('-'); return { c: parseInt(p[0]) - 1, r: parseInt(p[1]) - 1 }; }
function v2SlotName(slot){ return (slotNames && slotNames[slot - 1]) || ('卡槽' + slot); }
function v2FindSlot(name){
  if (!name) return null;
  for (var i = 0; i < slotNames.length; i++) if (slotNames[i] === name) return i + 1;
  return null;
}
function v2Consumable(base){ return base === '能量花' || base === '阳光蓓蕾' || base === '蓓蕾'; }
