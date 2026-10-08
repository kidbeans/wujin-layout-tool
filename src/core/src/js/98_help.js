/* ================= 98_help.js —— 帮助 / 文档：挂载 + TOC 联动（F1 开关） =================
 * v3：#helpBody 移入 #v3view-help（与「设置」同级的独立视图，rail 点击切页）；
 * v2：#helpBody 移入 #v2p-help（固定左栏面板）。TOC 由 h2/h3 生成，滚动高亮当前小节。
 */
"use strict";

(function v2HelpInit(){
  var helpBody = document.getElementById('helpBody');
  if (!helpBody) return;
  var v3view = document.getElementById('v3view-help');

  /* ---- 挂载 ---- */
  var toc, body;
  if (v3view){
    body = v3view.querySelector('.v2help-wrap');
    toc = document.getElementById('v3helpToc');
    body.appendChild(helpBody);
  } else {
    var panel = document.getElementById('v2p-help');
    if (!panel) return;
    var wrap = document.createElement('div');
    wrap.className = 'v2help-wrap';
    toc = document.createElement('div');
    toc.className = 'v2help-toc';
    toc.id = 'v2helpToc';
    wrap.appendChild(toc);
    wrap.appendChild(helpBody);
    panel.appendChild(wrap);
  }

  /* ---- TOC（h2/h3）+ 滚动高亮 ---- */
  var heads = helpBody.querySelectorAll('h2, h3');
  var html = '';
  heads.forEach(function(h, i){
    if (!h.id) h.id = 'h-auto-' + i;
    html += '<a class="toc-' + h.tagName.toLowerCase() + '" data-to="' + h.id + '">' +
      (h.tagName === 'H3' ? '└ ' : '') + h.textContent.replace(/^[^\w\s\u4e00-\u9fff]+/, '') + '</a>';
  });
  toc.innerHTML = html;
  toc.addEventListener('click', function(e){
    var a = e.target.closest('a');
    if (!a) return;
    var h = document.getElementById(a.dataset.to);
    if (h) h.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  helpBody.addEventListener('scroll', function(){
    var top = helpBody.getBoundingClientRect().top;
    var cur = heads[0], off = 1 / 0;
    heads.forEach(function(h){
      var d = Math.abs(h.getBoundingClientRect().top - top - 24);
      if (d < off){ off = d; cur = h; }
    });
    toc.querySelectorAll('a').forEach(function(a){
      a.classList.toggle('on', a.dataset.to === cur.id);
    });
  }, { passive: true });

  /* ---- 开关：F1；v2 侧栏 data-act=help；v3 rail data-view=help 由 96 代理 ---- */
  function isOpen(){
    if (v3view) return v3view.classList.contains('on');
    return typeof v2ActivePanel !== 'undefined' && v2ActivePanel === 'help';
  }
  function clickRail(sel){
    var b = document.querySelector(sel);
    if (b) b.click();
  }
  function toggle(){
    if (v3view){
      clickRail(isOpen() ? '#v3rail .v3ni[data-view="formation"]' : '#v3rail .v3ni[data-view="help"]');
      return;
    }
    if (typeof v2OpenPanel !== 'function') return;
    if (v2ActivePanel === 'help') v2ClosePanels();
    else v2OpenPanel('help');
  }
  document.querySelectorAll('#v2side .vsi[data-act="help"]').forEach(function(b){
    b.addEventListener('click', toggle);
  });
  var tb = document.getElementById('v2b-help');
  if (tb) tb.addEventListener('click', toggle);
  document.addEventListener('keydown', function(e){
    if (e.key === 'F1'){ e.preventDefault(); toggle(); }
  });
})();
