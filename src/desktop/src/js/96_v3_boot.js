/* ================= 96_v3_boot.js —— v3 布局重构 + 视图切换 + 原生壳接线 =================
 * 在 90_boot（v2 模块装配完成）之后运行：
 *   1) body.v3 主题（默认深色 = 保留 body.maa；历史 'light' 例外）
 *   2) 移除 v2 旧壳（#v2titlebar/.v2rz/#v2side），隐藏 #v2bar（功能由 #v3rail 代理）
 *   3) .app-container → #v3view-formation；#v2Drawer → #v3dockBody（抽屉停靠化）
 *   4) v2OpenPanel/v2ClosePanels 包裹：联动右坞 + 导航高亮 + 面包屑
 *   5) 标题栏：Tauri（自定义命令）窗口控制；浏览器隐藏系统按钮
 *   6) 状态栏：自动存档时间（包裹 save）、撤销/重做计数、检查结果（包裹 v2RunChecksEx）
 *   7) 快捷键：Esc 收坞；Ctrl+K → Agent 工作台；Ctrl+1/2/3 切视图
 *   8) v2Download 补丁：Tauri 下改走原生「另存为」
 */
'use strict';

(function () {
  /* ---- 1) 主题：默认深色（v3 chrome 自带两套变量，body.maa 有无即深/浅） ---- */
  var themeSaved = null;
  try { themeSaved = localStorage.getItem('v2theme'); } catch (e) {}
  document.body.classList.add('v3');
  if (themeSaved !== 'light') document.body.classList.add('maa');

  function themeDark() { return document.body.classList.contains('maa'); }
  function applyThemeBtn() {
    var b = document.getElementById('v3tbTheme');
    var s = document.getElementById('v3setTheme');
    if (b) { b.textContent = themeDark() ? '🌙' : '☀'; b.title = themeDark() ? '切换到浅色主题' : '切换到深色主题'; }
    if (s) s.value = themeDark() ? 'dark' : 'light';
  }
  function toggleTheme() {
    document.body.classList.toggle('maa');
    try { localStorage.setItem('v2theme', themeDark() ? 'dark' : 'light'); } catch (e) {}
    applyThemeBtn();
  }

  function $(id) { return document.getElementById(id); }

  /* ---- 2) 移除 v2 旧壳 ---- */
  ['v2titlebar', 'v2side'].forEach(function (id) { var el = $(id); if (el) el.remove(); });
  document.querySelectorAll('.v2rz').forEach(function (el) { el.remove(); });
  var v2bar = $('v2bar'); if (v2bar) v2bar.style.display = 'none';

  /* ---- 3) 主体迁移 ---- */
  var app = document.querySelector('.app-container');
  var viewForm = $('v3view-formation');
  if (app && viewForm) viewForm.appendChild(app);
  var drawer = $('v2Drawer');
  var dockBody = $('v3dockBody');
  if (drawer && dockBody) dockBody.appendChild(drawer);

  /* ---- 4) 面板开合联动 ---- */
  var VIEW_TITLES = { formation: '布阵工作台', agent: 'Agent 工作台', settings: '设置', help: '帮助 / 文档', skin: '🎨 换肤中心' };
  var PANEL_TITLES = {
    presets: '📦 世界预设', order: '🔢 遍历顺序', route: '🧭 配队路由', boss: '👑 Boss 链',
    checks: '🔍 检查链', save: '💾 存档', export2: '📤 导出 / 导入', server: '🌐 服务',
    help: '📖 帮助手册'
  };
  var curView = 'formation';

  function setCrumb() {
    var c = $('v3tbCrumb');
    if (!c) return;
    var t = VIEW_TITLES[curView] || '';
    var open = document.querySelector('.v2panel.active');
    if (curView === 'formation' && open) t += ' · ' + (PANEL_TITLES[open.id.replace('v2p-', '')] || '');
    c.textContent = t;
  }

  function syncRail() {
    document.querySelectorAll('#v3rail .v3ni').forEach(function (b) {
      if (b.dataset.view) b.classList.toggle('on', b.dataset.view === curView);
      if (b.dataset.panel) {
        var open = document.querySelector('.v2panel.active');
        var on = open && open.id === 'v2p-' + b.dataset.panel;
        b.classList.toggle('on', !!on);
        b.classList.toggle('dockopen', !!on);
      }
    });
  }

  function switchView(name) {
    curView = name;
    ['formation', 'agent', 'settings', 'help', 'skin'].forEach(function (v) {
      var el = $('v3view-' + v);
      if (el) el.classList.toggle('on', v === name);
    });
    document.body.classList.toggle('v3dockopen', name === 'formation' && !!document.querySelector('.v2panel.active'));
    if (name === 'agent') { var i = $('v3agInput'); if (i) setTimeout(function () { i.focus(); }, 60); }
    setCrumb(); syncRail();
  }

  function dockOpenFor(name) {
    document.body.classList.toggle('v3dockopen', !!name && curView === 'formation');
    var t = $('v3dockTitle');
    if (t) t.textContent = (name && PANEL_TITLES[name]) || '工具面板';
  }

  /* 包裹 v2 面板开合（函数声明为全局 var，可直接重赋值） */
  if (typeof v2OpenPanel === 'function') {
    var _v2OpenPanel = v2OpenPanel;
    v2OpenPanel = function (name) {
      _v2OpenPanel(name);
      dockOpenFor(v2ActivePanel);
      syncRail(); setCrumb();
    };
  }
  if (typeof v2ClosePanels === 'function') {
    var _v2ClosePanels = v2ClosePanels;
    v2ClosePanels = function () {
      _v2ClosePanels();
      dockOpenFor(null);
      syncRail(); setCrumb();
    };
  }

  /* ---- 导航接线 ---- */
  document.querySelectorAll('#v3rail .v3ni').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.view) switchView(b.dataset.view);
      else if (b.dataset.panel) {
        if (curView !== 'formation') switchView('formation');
        if (typeof v2OpenPanel === 'function') v2OpenPanel(b.dataset.panel);
      }
    });
  });
  var dockClose = $('v3dockClose');
  if (dockClose) dockClose.addEventListener('click', function () { if (typeof v2ClosePanels === 'function') v2ClosePanels(); });

  /* ---- 5) 标题栏 ---- */
  var tbtn = $('v3tbTheme');
  if (tbtn) tbtn.addEventListener('click', toggleTheme);
  var setTheme = $('v3setTheme');
  if (setTheme) setTheme.addEventListener('change', function () {
    if ((setTheme.value === 'dark') !== themeDark()) toggleTheme();
  });
  applyThemeBtn();

  var isTauri = (typeof V3Bridge !== 'undefined') && V3Bridge.detect() === 'tauri';
  if (isTauri) {
    document.body.classList.add('v3tauri');
    var bMin = $('v3tbMin'), bMax = $('v3tbMax'), bClose = $('v3tbClose'), drag = $('v3tbDrag');
    function syncMax() {
      V3Bridge.winIsMax().then(function (m) {
        document.body.classList.toggle('maximized', !!m);
        if (bMax) bMax.textContent = m ? '❐' : '□';
      }).catch(function () {});
    }
    if (bMin) bMin.addEventListener('click', function () { V3Bridge.winMin(); });
    if (bMax) bMax.addEventListener('click', function () { V3Bridge.winToggleMax().then(syncMax).catch(function () {}); });
    if (bClose) bClose.addEventListener('click', function () { V3Bridge.winClose(); });
    if (drag) {
      var lastDown = 0;
      drag.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return;
        var now = Date.now();
        if (now - lastDown < 420) { lastDown = 0; V3Bridge.winToggleMax().then(syncMax).catch(function () {}); return; }
        lastDown = now;
      });
    }
    syncMax();
  }

  /* ---- 6) 状态栏 ---- */
  var stSave = $('v3stSave');
  if (typeof save === 'function') {
    var _save = save;
    save = function () {
      var r = _save();
      if (stSave) stSave.textContent = '自动存档：' + new Date().toLocaleTimeString('zh-CN', { hour12: false });
      return r;
    };
  }
  var stUndo = $('v3stUndo');
  function bumpUndo() {
    if (!stUndo) return;
    var u = (typeof v2UndoStack !== 'undefined' && v2UndoStack) ? v2UndoStack.length : 0;
    var r = (typeof v2RedoStack !== 'undefined' && v2RedoStack) ? v2RedoStack.length : 0;
    stUndo.textContent = '↩ ' + u + ' / ↪ ' + r;
    stUndo.title = '撤销 ' + u + ' 步 / 重做 ' + r + ' 步（Ctrl+Z / Ctrl+Y）';
  }
  if (stUndo) { stUndo.style.cursor = 'pointer'; stUndo.addEventListener('click', function () { if (typeof v2Undo === 'function') v2Undo(); }); }
  if (typeof v2Undo === 'function') { var _u = v2Undo; v2Undo = function () { _u(); bumpUndo(); }; }
  if (typeof v2Redo === 'function') { var _r = v2Redo; v2Redo = function () { _r(); bumpUndo(); }; }
  setTimeout(bumpUndo, 0);

  var stCheck = $('v3stCheck');
  if (typeof v2RunChecksEx === 'function' && stCheck) {
    var _rce = v2RunChecksEx;
    v2RunChecksEx = function (opts) {
      var r = _rce(opts);
      try {
        var bad = (r && r.errors ? r.errors.length : 0), warn = (r && r.warnings ? r.warnings.length : 0);
        stCheck.textContent = '检查：✗ ' + bad + ' · ⚠ ' + warn;
        stCheck.style.color = bad ? 'var(--v3-err)' : (warn ? 'var(--v3-warn)' : 'var(--v3-ok)');
      } catch (e) {}
      return r;
    };
  }

  var stMode = $('v3stMode');
  if (stMode) stMode.textContent = isTauri ? 'Tauri 桌面版' : '浏览器模式';

  /* ---- 7) 快捷键 ---- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (document.body.classList.contains('v3dockopen') && typeof v2ClosePanels === 'function') { v2ClosePanels(); return; }
    }
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
      var k = e.key.toLowerCase();
      if (k === 'k') { e.preventDefault(); switchView('agent'); }
      else if (k === '1') { e.preventDefault(); switchView('formation'); }
      else if (k === '2') { e.preventDefault(); switchView('agent'); }
      else if (k === '3') { e.preventDefault(); switchView('settings'); }
    }
  });

  /* ---- 7.5) renderGrid 合帧优化：16ms 内多次失效只重建一次（顺序列表连点/徽章刷新等场景） ---- */
  if (typeof renderGrid === 'function') {
    var _rg = renderGrid, _rgPending = false;
    renderGrid = function () {
      if (_rgPending) return;
      _rgPending = true;
      requestAnimationFrame(function () { _rgPending = false; _rg(); });
    };
  }

  /* ---- 8) v2Download：Tauri 下原生另存为 ---- */
  if (isTauri && typeof v2Download === 'function') {
    var _dl = v2Download;
    v2Download = function (name, text) {
      var ext = (name.split('.').pop() || 'json').toLowerCase();
      V3Bridge.pickSave('保存 ' + name, name, [{ name: ext.toUpperCase(), exts: [ext] }]).then(function (p) {
        if (!p) { if (typeof showToast === 'function') showToast('已取消保存'); return; }
        V3Bridge.writeText(p, text).then(function () {
          if (typeof showToast === 'function') showToast('已保存：' + p);
        }).catch(function () { _dl(name, text); });
      });
    };
  }

  /* ---- Agent 工作台启动 ---- */
  if (typeof V3Agent !== 'undefined' && V3Agent.init) V3Agent.init();

  switchView('formation');
  setCrumb(); syncRail();
})();
