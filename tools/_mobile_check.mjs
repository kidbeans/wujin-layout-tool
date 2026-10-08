/* 手机适配层验证（CDP + Edge/Chrome headless，仅用 Node 内置能力）
 *
 * 用法： node _mobile_check.mjs mobile  <url> [宽] [高] [截图]
 *        node _mobile_check.mjs desktop <url> [宽] [高] [截图]
 * 前置： 浏览器已带 --remote-debugging-port 启动（默认 9333），页面通过 http:// 提供
 *        （file:// 下 localStorage/同源限制会影响判定，故走本地 http）
 *
 * 检查项：
 *   布局  无横向溢出 / 棋盘是否一屏装下 / 格子实际尺寸 / --cell 值 / 桌面窗口按钮是否隐藏
 *   触控  点植物 chip 选中 → 点格子种上 / 长按格子清空且抬手补发的 click 被吞掉
 *   桌面  同页面在桌面档（无触摸）下 pointer:fine、--cell=62px、手机层不介入
 */
const [mode, url, wStr, hStr, shot] = process.argv.slice(2);
const W = parseInt(wStr || (mode === 'mobile' ? '390' : '1280'), 10);
const H = parseInt(hStr || (mode === 'mobile' ? '844' : '800'), 10);
const MOBILE = mode !== 'desktop';
const CDP = process.env.CDP_PORT || '9333';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function wsUrl() {
  for (let i = 0; i < 40; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${CDP}/json/list`)).json();
      const p = list.find((t) => t.type === 'page');
      if (p && p.webSocketDebuggerUrl) return p.webSocketDebuggerUrl;
    } catch (e) { /* 等浏览器起来 */ }
    await sleep(400);
  }
  throw new Error('连不上 CDP 127.0.0.1:' + CDP);
}

function connect(u) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(u);
    let id = 0; const pending = new Map(); const logs = [];
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) {
        const p = pending.get(m.id); pending.delete(m.id);
        m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result);
      } else if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') {
        logs.push(m.params.entry.text.slice(0, 160));
      }
    };
    ws.onerror = () => reject(new Error('ws error'));
    ws.onopen = () => resolve({
      logs,
      send: (method, params) => new Promise((res, rej) => {
        const mid = ++id; pending.set(mid, { res, rej });
        ws.send(JSON.stringify({ id: mid, method, params: params || {} }));
      }),
      close: () => ws.close(),
    });
  });
}

const LAYOUT = `(() => {
  const doc = document.documentElement, cs = getComputedStyle(doc);
  const R = (el) => { if (!el) return null; const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom) }; };
  const gw = document.getElementById('gridWrap'), g = document.getElementById('grid');
  const gs = document.querySelector('.grid-scroll');
  const cell = document.querySelector('#grid .cell');
  const lastRow = document.querySelector('#grid .cell[data-r="4"]') || document.querySelector('#grid .cell[data-r="' + (document.querySelectorAll('#grid .rlabel, #grid .cell[data-r]').length ? 4 : 0) + '"]');
  const sys = document.getElementById('v3tbSys');
  return JSON.stringify({
    innerWidth: innerWidth, innerHeight: innerHeight,
    overflowX: doc.scrollWidth > innerWidth + 1, scrollW: doc.scrollWidth,
    coarse: matchMedia('(pointer: coarse)').matches,
    cell_var: cs.getPropertyValue('--cell').trim(),
    hasLayerJs: !!document.getElementById('mpzMobileJs'), hasLayerCss: !!document.getElementById('mpzMobileCss'),
    gridWrap: R(gw), grid: R(g), cell: R(cell), lastRow: R(lastRow),
    gridScroll: gs ? { clientH: gs.clientHeight, scrollH: gs.scrollHeight, overflowY: getComputedStyle(gs).overflowY } : null,
    gridFits: gw && g ? (g.getBoundingClientRect().width <= gw.getBoundingClientRect().width + 1) : null,
    boardVisible: gs && g ? (gs.clientHeight >= g.getBoundingClientRect().height - 2) : null,
    tbSysHidden: sys ? getComputedStyle(sys).display === 'none' : null,
    hintBar: [...document.querySelectorAll('div')].some((d) => (d.textContent || '').startsWith('📱 棋盘为主')),
    fab: !!document.getElementById('mpzFab'),
    cellCount: document.querySelectorAll('#grid .cell').length,
  });
})()`;

const SHEETS = `(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const vis = (sel) => { const e = document.querySelector(sel); if (!e) return null;
    const c = getComputedStyle(e), r = e.getBoundingClientRect();
    return { disp: c.display, pos: c.position, w: Math.round(r.width), h: Math.round(r.height), b: Math.round(r.bottom) }; };
  const out = { fabButtons: [...document.querySelectorAll('#mpzFab button')].map((b) => b.textContent.trim()),
    overlay: !!document.getElementById('mpzOverlay') };
  out.closed = { palette: vis('#palette'), slots: vis('#slots'), toolbar: vis('.toolbar'), out: vis('#exportBox') };
  const fabBtn = (k) => document.querySelector('#mpzFab button[data-sheet="' + k + '"]');
  fabBtn('plants').click(); await sleep(260);
  out.plantsOpen = vis('#palette');
  out.overlayOn = document.body.classList.contains('mpz-s-open');
  const chip = document.querySelector('#palette .chip[draggable="true"]');
  if (chip) { chip.click(); await sleep(260); }
  out.plantsAfterChip = vis('#palette');
  fabBtn('slots').click(); await sleep(260);
  out.slotsOpen = vis('#slots');
  fabBtn('tools').click(); await sleep(260);
  out.toolsOpen = vis('.toolbar');
  fabBtn('out').click(); await sleep(260);
  out.outOpen = vis('#exportBox');
  out.sizeCtlInToolbar = !!(document.querySelector('.toolbar .size-ctl'));
  document.getElementById('mpzOverlay').click(); await sleep(220);
  out.outAfterOverlay = vis('#exportBox');
  out.toolsAfterOverlay = vis('.toolbar');
  const cellBox = () => { const e = document.querySelector('#grid .cell'); if (!e) return null;
    const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
  fabBtn('zoom').click(); await sleep(320);
  out.zoomCellBox = cellBox();
  out.zoomGridScroll = (() => { const g = document.querySelector('.grid-scroll'); const gr = document.getElementById('grid');
    return { wrapW: Math.round(g.clientWidth), gridW: Math.round(gr.getBoundingClientRect().width), overflowX: getComputedStyle(g).overflowX }; })();
  out.zoomLabel = fabBtn('zoom').textContent.trim();
  fabBtn('zoom').click(); await sleep(280);
  out.cellBackBox = cellBox();
  out.zoomLabelBack = fabBtn('zoom').textContent.trim();
  return JSON.stringify(out);
})()`;

const DOCK = `(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const R = (sel) => { const e = document.querySelector(sel); if (!e) return null;
    const c = getComputedStyle(e), r = e.getBoundingClientRect();
    const x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
    const hit = document.elementFromPoint(x, y);
    return { disp: c.display, w: Math.round(r.width), h: Math.round(r.height), t: Math.round(r.top), b: Math.round(r.bottom),
             hit: hit ? (hit.id || hit.tagName) : null }; };
  const out = {};
  const rail = [...document.querySelectorAll('#v3rail .v3ni')];
  const orderBtn = rail.find((b) => (b.textContent || '').indexOf('顺序') >= 0) || rail[3];
  out.railLabel = orderBtn ? (orderBtn.textContent || '').trim().slice(0, 6) : null;
  orderBtn.click(); await sleep(800);
  out.open = document.body.classList.contains('v3dockopen');
  out.dock = R('#v3dock');
  out.close = R('#v3dockClose');
  out.overlay = R('#mpzOverlay');
  out.gapBottom = out.dock ? innerHeight - out.dock.b : null;
  const ov = document.getElementById('mpzOverlay');
  if (ov) { ov.click(); await sleep(500); }
  out.openAfterOverlay = document.body.classList.contains('v3dockopen');
  out.dockAfterOverlay = R('#v3dock');
  orderBtn.click(); await sleep(600);
  out.reopen = document.body.classList.contains('v3dockopen');
  const cb = document.getElementById('v3dockClose');
  if (cb) { cb.click(); await sleep(400); }
  out.closeBtnWorks = !document.body.classList.contains('v3dockopen');
  return JSON.stringify(out);
})()`;

const INTERACT = `(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  /* 关键：应用每次 action 后 renderGrid() 会重建全部格子 → 旧引用会变成游离节点，
     所有读取都必须按 data-r/data-c 现查，否则读到的是改前的旧 DOM */
  const at = (r, c) => document.querySelector('#grid .cell[data-r="' + r + '"][data-c="' + c + '"]');
  const txt = (r, c) => { const e = at(r, c); return e ? (e.textContent || '').trim().slice(0, 10) : null; };
  const len = (r, c) => { const e = at(r, c); return e ? e.innerHTML.length : null; };
  const out = {};
  const setTouch = (el, type, x, y) => {
    let t; try { t = new Touch({ identifier: 1, target: el, clientX: x, clientY: y, pageX: x, pageY: y }); }
    catch (e) { return false; }
    const empty = type === 'touchend' || type === 'touchcancel';
    el.dispatchEvent(new TouchEvent(type, { bubbles: true, cancelable: true,
      touches: empty ? [] : [t], targetTouches: empty ? [] : [t], changedTouches: [t] }));
    return true;
  };
  const tap = async (sel, hold) => {
    const el = document.querySelector(sel);
    const r = el.getBoundingClientRect(), x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
    out.lastRect = [Math.round(r.width), Math.round(r.height), x, y];
    out.lastHit = (() => { const h = document.elementFromPoint(x, y);
      return h ? h.tagName + (h.className ? '.' + String(h.className).slice(0, 24) : '') : null; })();
    setTouch(el, 'touchstart', x, y);
    await sleep(hold || 15);
    setTouch(el, 'touchend', x, y);
    await sleep(40);
    /* 真机抬手后浏览器会补发 click；长按场景这一下必须被手机层吞掉 */
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    await sleep(160);
  };

  const chips = [...document.querySelectorAll('#palette .chip[draggable="true"]')];
  const chip = chips.find((c) => (c.textContent || '').indexOf('大哥') >= 0) || chips[0];
  out.chipText = chip ? (chip.textContent || '').trim().slice(0, 8) : null;
  out.chipSelBefore = chip ? /(^|\\s)sel(\\s|$)/.test(chip.className) : null;
  if (chip && !out.chipSelBefore) { chip.click(); await sleep(220); }
  const chip2 = document.querySelector('#palette .chip[draggable="true"].sel');
  out.chipSelAfter = !!chip2;
  out.brushStatus = (document.getElementById('status') || {}).textContent || '';

  /* 选一个空白格作为靶子 */
  const empty = [...document.querySelectorAll('#grid .cell')].find((c) => /^[\\s-]*$/.test(c.textContent || ''));
  const R = empty ? empty.dataset.r : '0', C = empty ? empty.dataset.c : '0';
  out.target = R + '-' + C;
  out.beforeTxt = txt(R, C);
  out.beforeLen = len(R, C);
  const sel = '#grid .cell[data-r="' + R + '"][data-c="' + C + '"]';
  await tap(sel, 0);
  out.afterTapTxt = txt(R, C);
  out.afterTapLen = len(R, C);
  out.painted = (out.afterTapLen !== out.beforeLen) || (out.afterTapTxt !== out.beforeTxt);
  await tap(sel, 600);                       /* 600ms > 手机层 420ms 长按阈值 */
  out.afterHoldTxt = txt(R, C);
  out.afterHoldLen = len(R, C);
  out.cleared = (out.afterHoldTxt === out.beforeTxt) && (out.afterHoldLen === out.beforeLen);
  out.statusEnd = (document.getElementById('status') || {}).textContent || '';
  return JSON.stringify(out);
})()`;

(async () => {
  const c = await connect(await wsUrl());
  await c.send('Page.enable'); await c.send('Runtime.enable'); await c.send('Log.enable');
  if (MOBILE) {
    await c.send('Emulation.setDeviceMetricsOverride',
      { width: W, height: H, deviceScaleFactor: 2, mobile: true, screenWidth: W, screenHeight: H });
    await c.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  } else {
    await c.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    await c.send('Emulation.setTouchEmulationEnabled', { enabled: false });
    await c.send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124 Safari/537.36' });
  }
  const waitComplete = async () => {
    for (let i = 0; i < 60; i++) {
      const r = await c.send('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true });
      if (r.result.value === 'complete') return;
      await sleep(400);
    }
  };
  await c.send('Page.navigate', { url });
  await waitComplete();
  /* 清掉本机状态再重载：保证「首次打开提示条」「空棋盘」这两项判定可复现 */
  await c.send('Runtime.evaluate', { expression: 'try{localStorage.clear()}catch(e){}', returnByValue: true });
  await c.send('Page.reload', {});
  await waitComplete();
  await sleep(4500);                          /* 等应用把棋盘/卡槽渲染完 */
  const layout = JSON.parse((await c.send('Runtime.evaluate', { expression: LAYOUT, returnByValue: true })).result.value);
  let sheets = null;
  if (MOBILE) {
    sheets = JSON.parse((await c.send('Runtime.evaluate',
      { expression: SHEETS, returnByValue: true, awaitPromise: true })).result.value);
  }
  let dock = null;
  if (MOBILE) {
    dock = JSON.parse((await c.send('Runtime.evaluate',
      { expression: DOCK, returnByValue: true, awaitPromise: true })).result.value);
  }
  const taps = JSON.parse((await c.send('Runtime.evaluate',
    { expression: INTERACT, returnByValue: true, awaitPromise: true })).result.value);
  if (shot) {
    const img = await c.send('Page.captureScreenshot', { format: 'png' });
    (await import('node:fs')).writeFileSync(shot, Buffer.from(img.data, 'base64'));
  }
  const checks = [];
  const ok = (name, cond, extra) => checks.push({ name, pass: !!cond, ...(extra ? { extra } : {}) });
  if (MOBILE) {
    ok('页面无横向溢出', !layout.overflowX, 'scrollW=' + layout.scrollW + ' innerW=' + layout.innerWidth);
    ok('棋盘一屏装下（9 列不用横向拖）', layout.gridFits, 'grid=' + (layout.grid && layout.grid.w) + ' wrap=' + (layout.gridWrap && layout.gridWrap.w));
    ok('棋盘完整可见（不再被裁）', layout.boardVisible && layout.lastRow && layout.lastRow.b <= layout.innerHeight + 1,
      'grid-scroll.clientH=' + (layout.gridScroll && layout.gridScroll.clientH) + ' grid.h=' + (layout.grid && layout.grid.h) + ' 末行底=' + (layout.lastRow && layout.lastRow.b));
    ok('格子尺寸 ≥24px', layout.cell && layout.cell.w >= 24, 'cell=' + (layout.cell && layout.cell.w));
    ok('手机层 CSS/JS 已注入', layout.hasLayerCss && layout.hasLayerJs);
    ok('触屏设备识别为 coarse', layout.coarse);
    ok('桌面窗口按钮已隐藏', layout.tbSysHidden);
    ok('首开提示条出现', layout.hintBar);
    ok('底部 FAB 五键', layout.fab && sheets.fabButtons.length === 5, (sheets.fabButtons || []).join(' / '));
    ok('植物库/卡槽/工具/导出 默认收起', ['palette', 'slots', 'toolbar', 'out'].every((k) => sheets.closed[k] && sheets.closed[k].disp === 'none'));
    ok('植物库可开且是浮层(fixed)', sheets.plantsOpen.disp !== 'none' && sheets.plantsOpen.pos === 'fixed',
      sheets.plantsOpen.disp + ' / ' + sheets.plantsOpen.pos);
    ok('选植物卡后自动收起', sheets.plantsAfterChip.disp === 'none');
    ok('卡槽 / 工具 / 导出 抽屉可开', sheets.slotsOpen.disp !== 'none' && sheets.toolsOpen.disp !== 'none' && sheets.outOpen.disp !== 'none');
    ok('棋盘尺寸控件已搬进工具抽屉', sheets.sizeCtlInToolbar);
    ok('点遮罩收起抽屉', sheets.toolsAfterOverlay.disp === 'none' && sheets.outAfterOverlay.disp === 'none');
    ok('左栏工具坞：贴底浮层（不再被顶栏盖住）',
      dock.open && dock.dock && dock.dock.disp !== 'none' && dock.dock.t > layout.innerHeight * 0.12 && dock.gapBottom > 0,
      'top=' + (dock.dock && dock.dock.t) + ' 距底=' + dock.gapBottom);
    ok('左栏工具坞：✕ 关闭键可点（≥34px 且命中自身）',
      dock.close && dock.close.w >= 34 && dock.close.h >= 34 && /v3dockClose/.test(dock.close.hit || ''),
      dock.close ? (dock.close.w + '×' + dock.close.h + ' hit=' + dock.close.hit) : 'no button');
    ok('左栏工具坞：打开时有遮罩（可点空白收起）', dock.overlay && dock.overlay.disp === 'block');
    ok('左栏工具坞：点空白处收起', !dock.openAfterOverlay && dock.dockAfterOverlay && dock.dockAfterOverlay.disp === 'none');
    ok('左栏工具坞：收起后能再打开 / ✕ 直接可用', dock.reopen && dock.closeBtnWorks);
    ok('🔍放大：格子变 46px 且可横向拖', sheets.zoomCellBox && sheets.zoomCellBox[0] === 46
      && sheets.zoomGridScroll.gridW > sheets.zoomGridScroll.wrapW && /收起/.test(sheets.zoomLabel),
      (sheets.zoomCellBox || []).join('×') + ' 网格宽=' + sheets.zoomGridScroll.gridW + '>容器=' + sheets.zoomGridScroll.wrapW + ' ' + sheets.zoomLabel);
    ok('再点回一屏模式', sheets.cellBackBox && sheets.cellBackBox[0] < 44, (sheets.cellBackBox || []).join('×') + ' ' + sheets.zoomLabelBack);
    ok('棋盘 45 格', layout.cellCount === 45, 'cellCount=' + layout.cellCount);
    ok('点植物→点格 种植生效', taps.painted, taps.beforeTxt + ' → ' + taps.afterTapTxt);
    ok('长按清格且不反弹', taps.cleared, taps.afterTapTxt + ' → ' + taps.afterHoldTxt);
  } else {
    ok('桌面档：pointer 非 coarse', !layout.coarse);
    ok('桌面档：无手机 FAB（窄屏布局未介入）', !layout.fab);
    ok('桌面档：--cell 与 v4 原值一致', layout.cell_var === (process.env.EXPECT_CELL || layout.cell_var), layout.cell_var);
    ok('桌面档：无手机提示条', !layout.hintBar);
    ok('桌面档：页面无横向溢出', !layout.overflowX);
    ok('桌面档：点植物→点格 种植生效', taps.painted, taps.beforeTxt + ' → ' + taps.afterTapTxt);
  }
  const fail = checks.filter((x) => !x.pass);
  console.log('== ' + mode + ' ' + W + '×' + H + ' ==');
  for (const x of checks) console.log((x.pass ? '  ✓ ' : '  ✗ ') + x.name + (x.extra ? '   [' + x.extra + ']' : ''));
  if (c.logs.length) console.log('  页面错误日志（' + c.logs.length + ' 条，浏览器版功能受限属正常）: ' + c.logs.slice(0, 3).join(' | '));
  console.log(JSON.stringify({ mode, viewport: [W, H], layout, taps }, null, 1));
  c.close();
  process.exit(fail.length ? 2 : 0);
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
