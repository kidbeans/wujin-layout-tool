/* ================= 95_maa.js —— 深色皮肤运行时（MAA 风格配色） =================
 * 1) 主题：默认深色（body.maa；localStorage v2theme 持久化，可切浅色，历史值 'maa' 仍视为深色）；
 * 2) 左侧导航：#v2side 代理现有 #v2b-* 按钮 / v2ClosePanels()，零功能重写；
 * 3) 面板高亮：MutationObserver 监听 .v2panel.active 同步侧栏 active 态；
 * 4) 原生壳（launch.py 无边框窗口）：伪标题栏拖动/缩放/最小化/最大化/关闭接线（浏览器模式不显示）。
 */
(function () {
  'use strict';
  var KEY = 'v2theme';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { saved = null; }
  if (saved !== 'light') document.body.classList.add('maa');   /* 默认深色（历史值 'maa' 同样视为深色） */

  function refreshThemeBtn() {
    var maa = document.body.classList.contains('maa');
    var label = maa ? '☀<i>浅色</i>' : '🌙<i>深色</i>';
    var tip = maa ? '切换到浅色主题' : '切换到深色主题';
    var side = document.getElementById('v2ThemeBtn');
    if (side) { side.innerHTML = label; side.title = tip; }
    var bar = document.getElementById('v2ThemeBar');   /* v2bar 常隐藏，仅作备用入口 */
    if (bar) { bar.innerHTML = maa ? '☀ 浅色' : '🌙 深色'; bar.title = tip; }
  }

  /* ---- 原生壳（launch.py 无边框窗口）：伪标题栏接线；普通浏览器无 pywebview，标题栏不渲染 ---- */
  function callApi(fn, arg) {
    try {
      var a = window.pywebview && window.pywebview.api;
      if (a && a[fn]) {
        var p = arg === undefined ? a[fn]() : a[fn](arg);
        if (p && p.then) p.catch(function () {});
        return p;
      }
    } catch (e) {}
    return null;
  }

  function syncMaxState(p) {
    if (!p || !p.then) return;
    p.then(function (st) {
      var max = st === 'maximized';
      document.body.classList.toggle('maximized', max);
      var b = document.getElementById('v2tbMax');
      if (b) { b.textContent = max ? '❐' : '□'; b.title = max ? '还原' : '最大化'; }
    }).catch(function () {});
  }

  function initTitlebar() {
    document.body.classList.add('native-shell');
    /* 垂直滚动收进标题栏以下：根滚动条贯穿全窗高、正好顶在伪标题栏右端（窗口按钮旁挂一条通天滚动条）。
       把 .app-container 包进 #v2scroll（fixed，top=标题栏高）作滚动容器，body 关根滚动。
       v2scrolled 只在包裹成功后加上——中途失败则保持根滚动，页面不至于锁死。 */
    var app = document.querySelector('.app-container');
    if (app && !document.getElementById('v2scroll')) {
      var sc = document.createElement('div');
      sc.id = 'v2scroll';
      app.parentNode.insertBefore(sc, app);
      sc.appendChild(app);
      document.body.classList.add('v2scrolled');
    }
    var bMin = document.getElementById('v2tbMin');
    var bMax = document.getElementById('v2tbMax');
    var bClose = document.getElementById('v2tbClose');
    if (bMin) bMin.addEventListener('click', function () { callApi('minimize_window'); });
    if (bMax) bMax.addEventListener('click', function () { syncMaxState(callApi('toggle_maximize')); });
    if (bClose) bClose.addEventListener('click', function () { callApi('close_window'); });
    var drag = document.getElementById('v2tbDrag');
    var lastDown = 0;
    if (drag) drag.addEventListener('mousedown', function (e) {
      if (e.button !== 0 || document.body.classList.contains('maximized')) return;
      var now = Date.now();
      if (now - lastDown < 450) { lastDown = 0; syncMaxState(callApi('toggle_maximize')); return; }  /* 双击=最大化/还原 */
      lastDown = now;
      callApi('drag_window');
    });
    Array.prototype.forEach.call(document.querySelectorAll('.v2rz'), function (z) {
      z.addEventListener('mousedown', function (e) {
        if (e.button !== 0 || document.body.classList.contains('maximized')) return;
        e.preventDefault();
        callApi('resize_edge', z.dataset.edge);
      });
    });
    syncMaxState(callApi('window_state'));
  }
  if (window.pywebview && window.pywebview.api) initTitlebar();
  else window.addEventListener('pywebviewready', initTitlebar);

  function toggleTheme() {
    document.body.classList.toggle('maa');
    try { localStorage.setItem(KEY, document.body.classList.contains('maa') ? 'dark' : 'light'); } catch (e) {}
    refreshThemeBtn();
  }

  function initSide() {
    var side = document.getElementById('v2side');
    if (side) {
      side.addEventListener('click', function (ev) {
        var b = ev.target && ev.target.closest ? ev.target.closest('.vsi') : null;
        if (!b || !side.contains(b)) return;
        var act = b.dataset.act;
        if (act === 'theme') {
          toggleTheme();
          return;
        }
        if (act === 'home') {
          if (typeof v2ClosePanels === 'function') v2ClosePanels();
        } else if (act === 'undo' || act === 'redo') {
          var t = document.getElementById('v2b-' + act);
          if (t) t.click();
        } else {
          var btn = document.getElementById('v2b-' + act);
          if (btn) btn.click();
        }
      });
      /* 面板开合 → 侧栏高亮同步 */
      var map = {};
      Array.prototype.forEach.call(side.querySelectorAll('.vsi'), function (b) { map[b.dataset.act] = b; });
      function syncActive() {
        var open = document.querySelector('.v2panel.active');
        var id = open ? open.id.replace('v2p-', '') : 'home';
        Array.prototype.forEach.call(side.querySelectorAll('.vsi'), function (b) {
          b.classList.toggle('active', b.dataset.act === id);
        });
      }
      try {
        var mo = new MutationObserver(syncActive);
        Array.prototype.forEach.call(document.querySelectorAll('.v2panel'), function (p) {
          mo.observe(p, { attributes: true, attributeFilter: ['class'] });
        });
      } catch (e) {}
      syncActive();
    }
    var barBtn = document.getElementById('v2ThemeBar');
    if (barBtn) barBtn.addEventListener('click', toggleTheme);
    refreshThemeBtn();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSide);
  else initSide();
})();
