/* ================= v2 启动：接线 / 补丁 / 抽屉管理 ================= */
"use strict";

/* ---- 抽屉管理 ---- */
var v2ActivePanel = null;
var V2_PANELS = ['presets', 'order', 'route', 'boss', 'checks', 'save', 'export2', 'server'];
function v2OpenPanel(name){
  if (v2ActivePanel === name){ v2ClosePanels(); return; }
  v2ActivePanel = name;
  document.querySelectorAll('.v2panel').forEach(function(el){ el.classList.remove('active'); });
  var el = document.getElementById('v2p-' + name);
  if (el) el.classList.add('active');
  document.querySelectorAll('#v2bar button').forEach(function(b){ b.classList.remove('on'); });
  var btn = document.getElementById('v2b-' + name);
  if (btn) btn.classList.add('on');
  if (name === 'export2'){
    var pf = document.getElementById('v2Prefix');
    if (pf && !pf.dataset.touched) pf.value = V2.prefix || 'wj_';
  }
  renderGrid();   /* 徽章随面板开关刷新 */
}
function v2ClosePanels(){
  v2ActivePanel = null;
  document.querySelectorAll('.v2panel').forEach(function(el){ el.classList.remove('active'); });
  document.querySelectorAll('#v2bar button').forEach(function(b){ b.classList.remove('on'); });
  renderGrid();
}
function v2RefreshPanels(){
  if (typeof v2WriteRouteUI === 'function') v2WriteRouteUI();
  if (typeof v2RenderOrder === 'function') v2RenderOrder();
  if (typeof v2RenderBoss === 'function') v2RenderBoss();
}

/* ---- renderGrid 补丁：顺序徽章 ---- */
(function v2PatchRenderGrid(){
  var orig = renderGrid;
  renderGrid = function(){
    orig();
    try{ v2DrawBadges(); }catch(e){}
  };
})();
function v2DrawBadges(){
  var deck = v2OrderDeck;
  var show = v2ActivePanel === 'order' && (V2.orderVis !== false);
  var sim = null;
  if (show){
    try { sim = (typeof v2GoldSim === 'function') ? v2GoldSim() : null; } catch (e) { sim = null; }
  }
  /* 行号判定色：绿=有主力 黄=仅追踪安全 红=无主力 */
  document.querySelectorAll('#grid .rlabel').forEach(function(rb){
    rb.classList.remove('rg-ok', 'rg-track', 'rg-bad');
    if (!show || !sim){ rb.removeAttribute('title'); return; }
    var ro = sim.rows[parseInt(rb.dataset.r, 10) - 1];
    if (!ro) return;
    if (ro.verdict === 'strong') rb.classList.add('rg-ok');
    else if (ro.verdict === 'tracking') rb.classList.add('rg-track');
    else rb.classList.add('rg-bad');
    rb.title = '路' + (ro.r + 1) + ' ' + (ro.verdict === 'strong' ? '✓ 有主力：' : ro.verdict === 'tracking' ? '⚠ 追踪安全：' : '✗ 无主力：')
      + ro.strongs.concat(ro.tracks).join('、') + (ro.lost.length ? '（失效：' + ro.lost.map(function(l){ return l.name + '@' + l.cell; }).join('、') + '）' : '');
  });
  var cells = document.querySelectorAll('#grid .cell');
  cells.forEach(function(d){
    var old = d.querySelector('.v2bpos');
    if (old) old.remove();
    d.classList.remove('v2cell-fail');
    var cid = (d.dataset.c != null && d.dataset.r != null) ? (parseInt(d.dataset.c) + 1) + '-' + (parseInt(d.dataset.r) + 1) : null;
    if (!show || !cid) return;
    var sts = (sim && sim.cellSteps[deck] && sim.cellSteps[deck][cid]) || [];
    if (!sts.length) return;
    var anyFail = sts.some(function(s){ return s.fail; });
    var b = document.createElement('span');
    b.className = 'v2bpos' + (anyFail ? ' v2bpos-fail'
      : sts.some(function(s){ return s.name && v2SimSets().tracking.indexOf(s.name) > -1; }) ? ' v2bpos-track'
      : sts.some(function(s){ return s.gold; }) ? ' v2bpos-gold' : '');
    b.textContent = sts.map(function(s){ return s.no; }).join('·');
    b.title = sts.map(function(s){ return '第 ' + s.no + ' 步 ' + s.name + (s.fail ? '（✗ ' + s.reason + '）' : ''); }).join('\n');
    d.appendChild(b);
    if (anyFail) d.classList.add('v2cell-fail');
  });
}

/* ---- applyBrush 补丁：顺序面板打开时点格子追加种植步 ---- */
(function v2PatchBrush(){
  var orig = applyBrush;
  applyBrush = function(r, c){
    var plantName = (selected && selected.t === 'plant' && selected.kind === 'base') ? selected.name : null;
    var vineName = (selected && selected.t === 'plant' && selected.kind === 'vine') ? selected.name : null;
    var orderOn = v2ActivePanel === 'order';
    orig(r, c);
    if (orderOn && plantName){
      var cell = curGrid()[r][c];
      if (cell && cell.base) v2OrderAppendPlant(v2CellId(r, c), cell.base);
    }
    if (orderOn && vineName){                       /* 藤蔓除小守卫菇外照常追加，插在链尾(末尾) */
      var cv = curGrid()[r][c];
      if (cv && cv.vine) v2OrderAppendVine(v2CellId(r, c), cv.vine);
    }
  };
})();

/* ---- 存档面板 ---- */
function v2BindSave(){
  var pick = document.getElementById('svPick');
  function refresh(){
    if (!pick) return;
    var s = v2ListSlots();
    pick.innerHTML = '<option value="">— 选择存档 —</option>' + Object.keys(s).map(function(k){
      return '<option value="' + k + '">' + k + '</option>';
    }).join('');
  }
  var b = function(id){ return document.getElementById(id); };
  if (b('svSave')) b('svSave').addEventListener('click', function(){ v2SaveSlot(b('svName').value.trim()); refresh(); });
  if (b('svLoad')) b('svLoad').addEventListener('click', function(){ if (b('svPick').value) v2LoadSlot(b('svPick').value); });
  if (b('svDel')) b('svDel').addEventListener('click', function(){ if (b('svPick').value){ v2DeleteSlot(b('svPick').value); refresh(); } });
  if (b('svExportAll')) b('svExportAll').addEventListener('click', function(){ b('svIO').value = v2ExportSlots(); });
  if (b('svImportAll')) b('svImportAll').addEventListener('click', function(){ if (b('svIO').value.trim()) v2ImportSlots(b('svIO').value); refresh(); });
  refresh();
}

/* ---- 导出面板 ---- */
function v2BindExport2(){
  var b = function(id){ return document.getElementById(id); };
  var pf = b('v2Prefix');
  if (pf && !pf.value) pf.value = V2.prefix || 'wj_';
  if (pf) pf.addEventListener('change', function(){ pf.dataset.touched = '1'; V2.prefix = pf.value.trim() || 'wj_'; save(); });
  var tn = b('v2TaskName');
  if (tn){ try { tn.value = localStorage.getItem('v2taskname') || ''; } catch (e) {}
    tn.addEventListener('input', function(){ try { localStorage.setItem('v2taskname', tn.value); } catch (e) {} }); }
  if (b('ex2Json')) b('ex2Json').addEventListener('click', function(){ v2ExportJSON(); });
  if (b('ex2Txt')) b('ex2Txt').addEventListener('click', function(){ v2ExportTxt(); });
  if (b('ex2Pipe')) b('ex2Pipe').addEventListener('click', function(){ v2ExportPipeline(); });
  if (b('ex2ImportJson')) b('ex2ImportJson').addEventListener('click', function(){
    var t = b('v2Out').value; if (t.trim()) v2ImportJSON(t);
  });
  if (b('ex2Copy')) b('ex2Copy').addEventListener('click', function(){ copyText(b('v2Out').value); showToast('已复制'); });
  if (b('ex2Download')) b('ex2Download').addEventListener('click', function(){
    var t = b('v2Out').value;
    if (!t.trim()){ showToast('导出区为空'); return; }
    v2Download('无尽阵型_v2_' + new Date().toISOString().slice(0, 10) + '.json', t);
  });
  if (b('ex2Restore')) b('ex2Restore').addEventListener('click', function(){ v2RestoreAfterUpdate(); });
  if (b('ex2Deploy')) b('ex2Deploy').addEventListener('click', function(){
    if (typeof v2DeployMpz === 'function') v2DeployMpz();
    else showToast('部署模块未加载');
  });
}

/* ---- 全局键盘：Ctrl+Z / Ctrl+Y ----
 * 输入框聚焦时放行原生撤销（存档名/前缀/格子坐标等文本框内的 Ctrl+Z 曾被全局拦截成
 * 整个棋盘状态回滚——撤销栈语义没变，只是棋盘级快捷键不抢文本框，2026-09-14 审查）。 */
document.addEventListener('keydown', function(e){
  var t = e.target;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
  if (!(e.ctrlKey || e.metaKey) || e.shiftKey && e.key.toLowerCase() !== 'z') return;
  var k = e.key.toLowerCase();
  if (k === 'z'){ e.preventDefault(); v2Undo(); }
  else if (k === 'y'){ e.preventDefault(); v2Redo(); }
});

/* ---- 启动 ---- */
(function v2Boot(){
  /* v1 启动段（从 00_v1_app.js 迁移至此，保证 v2 模块先完成初始化） */
  if (!load()){
    plants = defaultPlants();
    initGrid();
  }
  buildAllChips();
  renderSlots();
  renderGrid();
  updateStatus();
  document.getElementById('btnFx').textContent = '特效：' + (fxOn ? '开' : '关');
  document.getElementById('btnFx').classList.toggle('on', fxOn);
  document.getElementById('btnSplit').textContent = '分阵型：' + (splitOn ? '开' : '关');
  document.getElementById('btnSplit').classList.toggle('on', splitOn);
  renderSplitUI();

  /* v2 状态恢复 */
  try{
    var saved = localStorage.getItem('wujin_v2_state');
    if (saved) V2 = v2DeepMerge(v2Default(), JSON.parse(saved));
  }catch(e){ V2 = v2Default(); }
  /* 旧版解析器把 Boss尾数 "5,0" 滤成 [5]（丢尾数0）：按已知损坏形态自愈一次 */
  try{
    if (V2.route && V2.route.tail &&
        JSON.stringify(V2.route.tail.boss) === '[5]' &&
        JSON.stringify(V2.route.tail.d2) === '[3,8]'){
      V2.route.tail.boss = [5, 0];
    }
  }catch(e){}
  v2LastSer = v2SerializeAll();

  /* 工具条就位 + 抽屉 */
  var bar = document.getElementById('v2bar');
  if (bar){
    var anchor = document.querySelector('.app-container .toolbar');
    if (anchor) anchor.insertAdjacentElement('afterend', bar);
    V2_PANELS.forEach(function(n){
      var btn = document.getElementById('v2b-' + n);
      if (btn) btn.addEventListener('click', function(){ v2OpenPanel(n); });
    });
    document.querySelectorAll('.v2close').forEach(function(c){
      c.addEventListener('click', v2ClosePanels);
    });
    var u = document.getElementById('v2b-undo'), r2 = document.getElementById('v2b-redo');
    if (u) u.addEventListener('click', v2Undo);
    if (r2) r2.addEventListener('click', v2Redo);
  }

  /* 模块装配 */
  initRoutePanel();
  v2OrderBind();
  v2BossBind();
  v2RenderOrder();
  v2RenderBoss();
  v2RenderPresets();
  v2BindPresets();
  if (typeof v2RenderOfficial === 'function') v2RenderOfficial();
  v2BindSave();
  v2BindExport2();
  v2BindChecks();
  if (typeof v2ImportBind === 'function') v2ImportBind();
  if (typeof v2TouchAllInit === 'function') v2TouchAllInit();
  if (typeof v2ServerInit === 'function') v2ServerInit();
  var pfx = document.getElementById('v2Prefix');
  if (pfx && V2.prefix) pfx.value = V2.prefix;

  /* 模拟器回归（控制台可查） */
  try{
    var st = v2RouteSelfTest();
    console.log('[v2] 路由模拟器自检 ' + st.pass + '/' + st.total + (st.failed.length ? ' 失败: ' + st.failed.join('；') : ' ✓'));
  }catch(e){ console.warn('[v2] 自检异常', e); }
})();

/* ---- 悬停语义速览：带 data-tip 的元素悬停显示说明（fixed 气泡，面板 overflow 不裁切） ---- */
(function v2TipInit(){
  function v2TipReady(){
    var tip = document.getElementById('v2tip');
    if (!tip) return;
    document.addEventListener('mouseover', function(e){
      var el = e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
      if (!el){ tip.style.display = 'none'; return; }
      tip.textContent = el.getAttribute('data-tip');
      tip.style.display = 'block';
      var r = el.getBoundingClientRect();
      tip.style.left = Math.max(4, Math.min(r.left, window.innerWidth - 330)) + 'px';
      /* 默认气泡放元素下方；贴近视口底部时改到上方 */
      if (r.bottom + 90 > window.innerHeight && r.top > 100){
        tip.style.top = Math.max(4, r.top - 8 - tip.offsetHeight) + 'px';
      } else {
        tip.style.top = (r.bottom + 6) + 'px';
      }
    });
    document.addEventListener('mouseout', function(e){
      var el = e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
      if (el) tip.style.display = 'none';
    });
    document.addEventListener('scroll', function(){ tip.style.display = 'none'; }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', v2TipReady);
  else v2TipReady();
})();
