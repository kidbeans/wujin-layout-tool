/* ================= 手机适配层（JS） =================
 * 由 tools/build_mobile_html.py 注入到 v4 单文件 HTML；改动源在这里，别改产物文件。
 *
 * A) 窄屏（≤839px）—— 手机布局：棋盘当主舞台，其它收进底部抽屉
 *    · 建底部 FAB：🪴植物库 / 🎴卡槽 / ⚙️工具 / 🔍放大（再点收起），配一层遮罩，点空白处关抽屉
 *    · 点植物卡后自动收起植物库抽屉，方便立刻点格子落种
 *    · 把棋盘的「列数/行数」尺寸控件搬进工具抽屉，棋盘区只留棋盘
 * B) 触屏（pointer: coarse）—— 触控手势
 *    · 长按格子 → 合成 contextmenu（= 清空该格，与桌面右键同一条路径），并吞掉随之而来的 click
 *    · 长按带 data-tip 的元素 → 合成 mouseover/mouseout，桌面悬浮提示在手机上也能看
 *    · 首次打开给一条可点掉的操作提示
 */
(function () {
  'use strict';

  var PREFIX = 'mpzM_';
  var HOLD_MS = 420;      /* 长按判定 */
  var MOVE_TOL = 12;      /* 移动超过此距离即取消长按（在滚动/拖拽） */

  try { localStorage.setItem(PREFIX + 'layer', '1'); } catch (e) {}

  var narrow = !!(window.matchMedia && window.matchMedia('(max-width: 839px)').matches);
  var coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  var narrowMQ = window.matchMedia ? window.matchMedia('(max-width: 839px)') : null;

  /* ================= A) 手机布局：底部 FAB + 抽屉 ================= */
  var SHEETS = { plants: 'mpz-s-plants', slots: 'mpz-s-slots', tools: 'mpz-s-tools', out: 'mpz-s-out' };
  var FAB = [
    ['plants', '🪴 植物库'],
    ['slots', '🎴 卡槽'],
    ['tools', '⚙️ 工具'],
    ['out', '📤 导出'],
    ['zoom', '🔍 放大'],
  ];

  function sheetOpen() {
    var b = document.body.classList;
    return Object.keys(SHEETS).some(function (k) { return b.contains(SHEETS[k]); });
  }

  function closeSheets() {
    var b = document.body.classList;
    Object.keys(SHEETS).forEach(function (k) { b.remove(SHEETS[k]); });
    b.remove('mpz-s-open');
    syncFab();
  }

  /* 左栏工具坞（#v3dock）单独由 v4 的 v3dockopen 类控制；手机端也让它「点空白收起」。
     走 v4 自己的关闭路径（坞头 ✕ → v2ClosePanels），并留一层兜底撤类。 */
  function closeDock() {
    if (!document.body.classList.contains('v3dockopen')) { return; }
    var x = document.getElementById('v3dockClose');
    if (x) { x.click(); }
    setTimeout(function () {
      if (!document.body.classList.contains('v3dockopen')) { return; }
      document.body.classList.remove('v3dockopen');
      [].forEach.call(document.querySelectorAll('#v3dockBody .v2panel.active'), function (p) {
        p.classList.remove('active');
      });
    }, 80);
  }

  function closeAllPanels() { closeDock(); closeSheets(); }

  function toggleSheet(key) {
    var cls = SHEETS[key];
    var wasOpen = document.body.classList.contains(cls);
    closeSheets();
    if (!wasOpen) {
      document.body.classList.add(cls);
      document.body.classList.add('mpz-s-open');
    }
    syncFab();
  }

  function syncFab() {
    var fab = document.getElementById('mpzFab');
    if (!fab) { return; }
    var b = document.body.classList;
    var map = { plants: SHEETS.plants, slots: SHEETS.slots, tools: SHEETS.tools };
    [].forEach.call(fab.querySelectorAll('button'), function (btn) {
      var k = btn.getAttribute('data-sheet');
      if (k === 'zoom') {
        btn.classList.toggle('on', document.body.classList.contains('mpz-zoom'));
        btn.textContent = document.body.classList.contains('mpz-zoom') ? '🔍 收起' : '🔍 放大';
      } else {
        btn.classList.toggle('on', b.contains(map[k]));
      }
    });
  }

  function buildMobileChrome() {
    if (document.getElementById('mpzFab')) { return; }
    var ov = document.createElement('div');
    ov.id = 'mpzOverlay';
    ov.addEventListener('click', closeAllPanels);
    document.body.appendChild(ov);

    var fab = document.createElement('div');
    fab.id = 'mpzFab';
    FAB.forEach(function (pair) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = pair[1];
      btn.setAttribute('data-sheet', pair[0]);
      btn.addEventListener('click', function () {
        closeDock();                       /* 先收起左栏工具坞，避免两层浮层叠着 */
        if (pair[0] === 'zoom') {
          document.body.classList.toggle('mpz-zoom');
          syncFab();
        } else {
          toggleSheet(pair[0]);
        }
      });
      fab.appendChild(btn);
    });
    document.body.appendChild(fab);

    /* 点植物卡 → 收起植物库抽屉（马上能点格子落种） */
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) { return; }
      if (t.closest('#palette .chip')) { closeSheets(); }
      /* 点棋盘空白处也关抽屉 */
      if (t.closest('#grid')) { closeSheets(); }
    }, false);

    /* 棋盘的「列数/行数 + 应用尺寸」搬进工具抽屉，棋盘区只留棋盘 */
    var sizeCtl = document.querySelector('.size-ctl');
    var toolbar = document.querySelector('.toolbar');
    if (sizeCtl && toolbar && sizeCtl.parentNode !== toolbar) { toolbar.appendChild(sizeCtl); }

    syncFab();
  }

  function layoutTick() {
    if (window.matchMedia && window.matchMedia('(max-width: 839px)').matches) {
      if (document.body) { buildMobileChrome(); }
    } else {
      closeSheets();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', layoutTick);
  } else {
    layoutTick();
  }
  if (narrowMQ && narrowMQ.addEventListener) { narrowMQ.addEventListener('change', layoutTick); }
  window.addEventListener('resize', function () { setTimeout(layoutTick, 200); });

  /* ================= B) 触控手势（仅触屏设备） ================= */
  if (!coarse) { return; }

  var timer = null, startX = 0, startY = 0, holdTarget = null, firedAt = 0;

  function fire(type, el, x, y, opt) {
    var ev;
    try {
      ev = new MouseEvent(type, Object.assign({ bubbles: true, cancelable: true, clientX: x, clientY: y }, opt || {}));
    } catch (e) {
      ev = document.createEvent('MouseEvents');
      ev.initMouseEvent(type, true, true, window, 0, x, y, x, y, false, false, false, false, 0, null);
    }
    el.dispatchEvent(ev);
  }

  function cancelHold() { clearTimeout(timer); timer = null; holdTarget = null; }

  document.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { cancelHold(); return; }
    var t0 = e.touches[0];
    startX = t0.clientX; startY = t0.clientY;
    holdTarget = e.target;
    clearTimeout(timer);
    timer = setTimeout(function () {
      var el = holdTarget; timer = null;
      if (!el || !el.closest) { return; }
      var cell = el.closest('.cell');
      if (cell) {
        firedAt = Date.now();
        fire('contextmenu', cell, startX, startY, { button: 2, buttons: 2 });
        if (navigator.vibrate) { try { navigator.vibrate(12); } catch (e2) {} }
        return;
      }
      var tipEl = el.closest('[data-tip]');
      if (tipEl) {
        firedAt = Date.now();
        fire('mouseover', tipEl, startX, startY);
        setTimeout(function () { fire('mouseout', tipEl, startX, startY); }, 2200);
      }
    }, HOLD_MS);
  }, { passive: true });

  document.addEventListener('touchmove', function (e) {
    if (!timer || !e.touches || !e.touches[0]) { return; }
    var t0 = e.touches[0];
    if (Math.abs(t0.clientX - startX) + Math.abs(t0.clientY - startY) > MOVE_TOL) { cancelHold(); }
  }, { passive: true });

  /* 长按已触发 → 抬手时吞掉这一次 click（否则刚清空的格子会被画笔重新种上） */
  document.addEventListener('touchend', function (e) {
    cancelHold();
    if (firedAt && Date.now() - firedAt < 900) { e.preventDefault(); }
  }, { passive: false });
  document.addEventListener('touchcancel', cancelHold, { passive: true });
  document.addEventListener('click', function (e) {
    if (firedAt && Date.now() - firedAt < 900) {
      firedAt = 0;
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);

  /* ================= 首次打开的一次性提示 ================= */
  try {
    if (!localStorage.getItem(PREFIX + 'hint')) {
      localStorage.setItem(PREFIX + 'hint', '1');
      var bar = document.createElement('div');
      bar.textContent = '📱 棋盘为主：底部按钮开「植物库 / 卡槽 / 工具」；点植物 → 点格子放置；长按格子=清空；双击格子=手输入名字；🔍放大=格子 46px 可拖动';
      bar.style.cssText = 'position:fixed;left:8px;right:8px;'
        + 'bottom:calc(var(--m-fab-h, 40px) + var(--m-foot, 24px) + 18px + env(safe-area-inset-bottom,0px));'
        + 'z-index:1350;background:rgba(56,189,248,.16);border:1px solid rgba(56,189,248,.45);color:#e2f2ff;'
        + 'padding:9px 12px;border-radius:10px;font-size:12px;line-height:1.55;backdrop-filter:blur(6px);'
        + '-webkit-backdrop-filter:blur(6px);box-shadow:0 6px 18px rgba(0,0,0,.35)';
      bar.onclick = function () { if (bar.parentNode) { bar.parentNode.removeChild(bar); } };
      var put = function () { document.body.appendChild(bar); };
      if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', put); } else { put(); }
      setTimeout(function () { if (bar.parentNode) { bar.parentNode.removeChild(bar); } }, 16000);
    }
  } catch (e3) { /* 提示条失败不影响功能 */ }
})();
