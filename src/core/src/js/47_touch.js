/* ================= v2 触控垫片 + 植物库搜索 + Diff 高亮（47_touch.js） ================= */
"use strict";

/* ---- 触控垫片：把触摸滑动合成为 HTML5 DnD（v1 拖拽用 dragstart/dragover/drop） ----
 * 策略：touchstart 只记录起点；移动超过阈值才判为拖拽意图 → 在源元素派发 dragstart；
 * 移动中 elementFromPoint 派发 dragover；抬手在当前元素派发 drop + 源元素 dragend。
 * 未超过阈值则不拦截（click/dblclick/滚动 照常）。 */
function v2TouchInit(){
  if (!('ontouchstart' in window)) return;   /* 桌面浏览器跳过 */
  if (window.__v2TouchOn) return;
  window.__v2TouchOn = true;
  var dt;
  try{ dt = new DataTransfer(); }
  catch(e){ dt = { setData: function(){}, getData: function(){ return ''; }, effectAllowed: 'all', dropEffect: 'move' }; }
  function fire(type, el, clientX, clientY){
    if (!el) return;
    var ev;
    try{ ev = new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: dt, clientX: clientX, clientY: clientY }); }
    catch(e){
      ev = document.createEvent('HTMLEvents');
      ev.initEvent(type, true, true);
    }
    try{ ev.dataTransfer = dt; }catch(e2){}
    try{ ev.clientX = clientX; ev.clientY = clientY; }catch(e2){}
    el.dispatchEvent(ev);
  }
  var st = null, dragging = false, lastEl = null;
  function draggableSrc(t){
    var el = t && t.closest ? t.closest('[draggable="true"]') : null;
    return el;
  }
  document.addEventListener('touchstart', function(e){
    if (e.touches.length !== 1) return;
    var src = draggableSrc(e.target);
    if (!src) { st = null; return; }
    var t0 = e.touches[0];
    st = { x: t0.clientX, y: t0.clientY, src: src };
    dragging = false;
  }, { passive: true });
  document.addEventListener('touchmove', function(e){
    if (!st || e.touches.length !== 1) return;
    var t0 = e.touches[0];
    var dx = t0.clientX - st.x, dy = t0.clientY - st.y;
    if (!dragging){
      if (dx * dx + dy * dy < 100) return;          /* 10px 阈值内不算拖拽 */
      dragging = true;
      fire('dragstart', st.src, t0.clientX, t0.clientY);
    }
    e.preventDefault();                              /* 拖拽中阻止页面滚动 */
    var el = document.elementFromPoint(t0.clientX, t0.clientY);
    if (el !== lastEl){ fire('dragleave', lastEl, t0.clientX, t0.clientY); }
    fire('dragover', el, t0.clientX, t0.clientY);
    lastEl = el;
  }, { passive: false });
  document.addEventListener('touchend', function(e){
    if (st && dragging){
      var t0 = e.changedTouches[0];
      var el = document.elementFromPoint(t0.clientX, t0.clientY);
      fire('drop', el, t0.clientX, t0.clientY);
      fire('dragend', st.src, t0.clientX, t0.clientY);
      e.preventDefault();
    }
    st = null; dragging = false; lastEl = null;
  }, { passive: false });
}

/* ---- 植物库搜索：在 tab 条上方插一个输入框，子串过滤所有 chip ---- */
function v2PlantSearchInit(){
  var tabs = document.querySelector('.palette-tabs');
  if (!tabs || document.getElementById('v2PlantSearch')) return;
  var wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;gap:6px;align-items:center;margin:2px 0 6px;';
  var inp = document.createElement('input');
  inp.id = 'v2PlantSearch';
  inp.placeholder = '🔍 搜索植物/动作（子串过滤全部 tab）';
  inp.style.cssText = 'flex:1;padding:4px 8px;';
  var cnt = document.createElement('span');
  cnt.className = 'v2muted';
  cnt.style.cssText = 'white-space:nowrap;';
  wrap.appendChild(inp); wrap.appendChild(cnt);
  tabs.parentNode.insertBefore(wrap, tabs);
  function apply(){
    var q = inp.value.trim().toLowerCase();
    var total = 0, hit = 0;
    document.querySelectorAll('.chip').forEach(function(ch){
      if (ch.closest('.v2panel') || ch.closest('#v2bar')) return;   /* 只过滤植物库 */
      total++;
      var ok = !q || (ch.textContent || '').toLowerCase().indexOf(q) > -1;
      ch.style.display = ok ? '' : 'none';
      if (q && ok){
        hit++;
        ch.classList.add('v2chip-hit');
      } else ch.classList.remove('v2chip-hit');
    });
    cnt.textContent = q ? ('命中 ' + hit + '/' + total) : '';
  }
  inp.addEventListener('input', apply);
  /* 植物库重建（预设载入/改名）后重放过滤，保持输入框与显示一致 */
  if (typeof buildAllChips === 'function'){
    var origChips = buildAllChips;
    buildAllChips = function(){ origChips(); try{ apply(); }catch(e2){} };
  }
}

/* ---- 棋盘 Diff 高亮：computeSplitDiff 打补丁记差异 → 总阵型对应格加红框 ---- */
var v2DiffLegend = null;
function v2ClearDiff(){
  window.__v2Diff = null;
  document.querySelectorAll('.v2-diff-cell').forEach(function(d){ d.classList.remove('v2-diff-cell'); });
  if (v2DiffLegend) v2DiffLegend.style.display = 'none';
}
function v2RenderDiff(){
  var probs = window.__v2Diff;
  document.querySelectorAll('.v2-diff-cell').forEach(function(d){ d.classList.remove('v2-diff-cell'); });
  if (!probs || !probs.length){ if (v2DiffLegend) v2DiffLegend.style.display = 'none'; return; }
  probs.forEach(function(p){
    var sel = '#grid .cell[data-r="' + (p.r - 1) + '"][data-c="' + (p.c - 1) + '"]';
    var el = document.querySelector(sel);
    if (el) el.classList.add('v2-diff-cell');
  });
  if (!v2DiffLegend){
    v2DiffLegend = document.createElement('div');
    v2DiffLegend.id = 'v2DiffLegend';
    v2DiffLegend.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:60;padding:6px 10px;border-radius:8px;' +
      'background:#fdecea;border:1px solid #e57368;color:#a33;font-size:12px;display:none;box-shadow:0 2px 8px rgba(0,0,0,.12);';
    document.body.appendChild(v2DiffLegend);
    v2DiffLegend.addEventListener('click', v2ClearDiff);
  }
  v2DiffLegend.style.display = 'block';
  v2DiffLegend.innerHTML = '⚠ 一致性差异 <b>' + probs.length + '</b> 格已红框标出（点击此条清除）';
}
function v2DiffInit(){
  if (typeof computeSplitDiff !== 'function' || window.__v2DiffOn) return;
  window.__v2DiffOn = true;
  var orig = computeSplitDiff;
  computeSplitDiff = function(){
    var probs = orig();
    window.__v2Diff = probs;
    setTimeout(function(){
      try{ v2RenderDiff(); }catch(e){}
    }, 0);
    return probs;
  };
  /* 任何编辑（save 钩子最外层）→ 清除高亮 */
  var origSave = save;
  save = function(){
    if (window.__v2Diff && window.__v2Diff.length) v2ClearDiff();
    return origSave.apply(this, arguments);
  };
}

function v2TouchAllInit(){
  v2TouchInit();
  v2PlantSearchInit();
  v2DiffInit();
}
