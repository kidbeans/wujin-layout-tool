/* ================= 97_theme.js —— 主题引擎：浅色默认 + 深色/毛玻璃/渐变预设 + 自定义 =================
 * 约定：body 无主题类 = 浅色（默认）；body.maa = 深色；t-glass / t-aurora / t-sunset = 深色衍生；
 * t-custom = 自定义（dark 基底 + 强调色 + 玻璃开关，变量内联注入）。
 * 持久化：localStorage 'v2theme'（light/dark/glass/aurora/sunset/custom；历史 'maa' 视为 dark）；
 * 自定义参数存 'v2themeCustom'。按钮：工具栏/侧栏/v3 标题栏的主题键 → 打开选择弹窗。
 */
"use strict";

/* 主题注册表：cls = 需要挂到 body 的类（浅色 = 无类；maa = 深色基底；t-* = 皮肤层）。
   dot = 主题弹窗圆点色（取各主题 CSS accent；custom 用多彩渐变近似色，2026-09-14 修复 V2_THEMES
   无 dot 字段导致弹窗 style="background:undefined" 的悬挂引用）。
   新预设配色语义参考 dsh 插件生态的设计令牌：brand 激活强调 / success 绿 / danger 红 /
   diff 删红增绿改蓝——插件本体不发布固定色值，跟随皮肤体系。 */
var V2_THEMES = [
  { id: 'light',   name: '浅色',         kind: '默认',        cls: [], dot: '#2563eb' },
  { id: 'paper',   name: 'DSH 纸白',     kind: '浅色 · 弥散',  cls: ['t-grad', 't-paper'], dot: '#b45309' },
  { id: 'dark',    name: '深色',         kind: '经典',        cls: ['maa'], dot: '#4d6bfe' },
  { id: 'glass',   name: '毛玻璃',       kind: '深色 · 弥散',  cls: ['maa', 't-grad', 't-glass'], dot: '#4da3ff' },
  { id: 'aurora',  name: '极光渐变',     kind: '深色 · 弥散',  cls: ['maa', 't-grad', 't-aurora'], dot: '#34d399' },
  { id: 'sunset',  name: '暮霞渐变',     kind: '深色 · 弥散',  cls: ['maa', 't-grad', 't-sunset'], dot: '#fb923c' },
  { id: 'brand',   name: 'DSH 品牌蓝',   kind: '浅色 · 弥散',  cls: ['t-grad', 't-brand'], dot: '#4d6bfe' },
  { id: 'success', name: 'Success 翠绿', kind: '浅色 · 弥散',  cls: ['t-grad', 't-success'], dot: '#059669' },
  { id: 'danger',  name: 'Danger 绯红',  kind: '浅色 · 弥散',  cls: ['t-grad', 't-danger'], dot: '#e11d48' },
  { id: 'diff',    name: 'Diff 墨青',    kind: '浅色 · 弥散',  cls: ['t-grad', 't-diff'], dot: '#0284c7' },
  { id: 'custom',  name: '自定义',       kind: '自定义',      cls: ['t-custom'], dot: '#8b5cf6' }
];

var v2Theme = {
  current: 'light',
  shellGlass: true,   /* 侧栏/标题栏跟随背景（毛玻璃）：全局开关，所有主题生效 */
  custom: { dark: true, accent: '#4d6bfe', glass: true, blob: true, wall: null },

  _cls(list, on){ document.body.classList.toggle(list, !!on); },

  apply(id){
    var t = null;
    for (var i = 0; i < V2_THEMES.length; i++) if (V2_THEMES[i].id === id) t = V2_THEMES[i];
    if (!t){ t = V2_THEMES[0]; id = t.id; }
    ['t-glass', 't-aurora', 't-sunset', 't-custom', 'glass-on', 't-grad', 'shell-glass',
     't-paper', 't-brand', 't-success', 't-danger', 't-diff'].forEach(function(c){ this._cls(c, false); }, this);
    if (id === 'custom'){
      var wallOn = !!(this.custom.wall && this.custom.wall.src &&
        (this.custom.wall.opacity == null || this.custom.wall.opacity > 0));
      this._cls('maa', !!this.custom.dark);
      this._cls('t-custom', true);
      this._cls('glass-on', !!this.custom.glass);
      this._cls('shell-glass', this.shellGlass !== false);
      this._cls('t-grad', !!this.custom.blob || wallOn);   /* 弥散光/壁纸都需要透明主画布 */
      this._applyCustomVars();
      this._applyWall();
    } else {
      this._hideWall();
      this._clearCustomVars();
      this._cls('maa', false);
      t.cls.forEach(function(c){ this._cls(c, true); }, this);
      this._cls('shell-glass', this.shellGlass !== false);
    }
    this.current = id;
    try { localStorage.setItem('v2theme', id); } catch (e) {}
    this._syncBtns();
    if (typeof this._gallery !== 'undefined' && this._gallery) this.renderGallery();
  },

  /* 换肤中心（v3 独立视图）：卡片即点即换；选「自定义」时内嵌显示全部设置 */
  renderGallery(){
    var grid = document.getElementById('v3skinGrid');
    if (!grid) return;
    this._gallery = true;
    var self = this;
    grid.innerHTML = V2_THEMES.map(function(t){
      return '<div class="v3skin-card' + (t.id === self.current ? ' on' : '') + '" data-t="' + t.id + '">' +
        '<div class="v3skin-prev skp-' + t.id + '"></div>' +
        '<div class="v3skin-name"><span>' + t.name + '</span>' +
        '<span class="v3skin-tag">' + (t.id === self.current ? '✓ 使用中' : t.kind) + '</span></div></div>';
    }).join('');
    grid.querySelectorAll('.v3skin-card').forEach(function(c){
      c.addEventListener('click', function(){ self.apply(c.dataset.t); self.renderGallery(); });
    });
    var sgTop = document.getElementById('skShellTop');
    if (sgTop) sgTop.checked = this.shellGlass !== false;
    this._syncCustomEditor();
  },

  /* 自定义设置面板（换肤中心内嵌）：显隐 + 控件回填 */
  _syncCustomEditor(){
    var box = document.getElementById('v3skinCustom');
    if (!box) return;
    var isCustom = this.current === 'custom';
    box.style.display = isCustom ? 'block' : 'none';
    if (!isCustom) return;
    var c = this.custom;
    var d = document.getElementById('skDark');   if (d) d.checked = !!c.dark;
    var g = document.getElementById('skGlass');  if (g) g.checked = !!c.glass;
    var b = document.getElementById('skBlob');   if (b) b.checked = c.blob !== false;
    var a = document.getElementById('skAccent'); if (a) a.value = c.accent || '#4d6bfe';
    var w = c.wall || {};
    var op = document.getElementById('skWallOp');
    var bl = document.getElementById('skWallBlur');
    if (op) op.value = Math.round((w.opacity == null ? 0.5 : w.opacity) * 100);
    if (bl) bl.value = (w.blur || 0);
    var u = document.getElementById('skWallUrl');  if (u) u.value = (/^data:/i.test(w.src || '') ? '' : (w.src || ''));
    var v = document.getElementById('skWallVal');
    if (v) v.textContent = '透明度 ' + Math.round((w.opacity == null ? 0.5 : w.opacity) * 100) + '% · 模糊 ' + (w.blur || 0) + 'px';
  },

  /* 自定义设置面板：控件绑定（_rebind 里调用一次） */
  _bindCustomEditor(){
    var self = this;
    var box = document.getElementById('v3skinCustom');
    if (!box || box.dataset.bound) return;
    box.dataset.bound = '1';
    function save(){
      try { localStorage.setItem('v2themeCustom', JSON.stringify(self.custom)); }
      catch (e){ if (typeof showToast === 'function') showToast('设置过大存不进本地（图片太大请改用路径/URL）'); }
    }
    function touch(){ save(); self.apply('custom'); self.renderGallery(); }
    var d = document.getElementById('skDark');
    if (d) d.addEventListener('change', function(){ self.custom.dark = d.checked; touch(); });
    var g = document.getElementById('skGlass');
    if (g) g.addEventListener('change', function(){ self.custom.glass = g.checked; touch(); });
    var b = document.getElementById('skBlob');
    if (b) b.addEventListener('change', function(){ self.custom.blob = b.checked; touch(); });
    /* 侧栏/标题栏跟随背景：全局开关（换肤中心页头），所有主题生效 */
    var sg = document.getElementById('skShellTop');
    if (sg && !sg.dataset.bound){
      sg.dataset.bound = '1';
      sg.addEventListener('change', function(){
        self.shellGlass = sg.checked;
        try { localStorage.setItem('v2themeShellGlass', sg.checked ? '1' : '0'); } catch (e) {}
        self.apply(self.current);
      });
    }
    var a = document.getElementById('skAccent');
    if (a) a.addEventListener('input', function(){ self.custom.accent = a.value; save(); self.apply('custom'); });
    var pick = document.getElementById('skWallPick');
    var file = document.getElementById('skWallFile');
    if (pick && file) pick.addEventListener('click', function(){ file.click(); });
    if (file) file.addEventListener('change', function(){
      var f = file.files && file.files[0];
      if (!f) return;
      var rd = new FileReader();
      rd.onload = function(){
        self.custom.wall = self.custom.wall || {};
        self.custom.wall.src = String(rd.result);
        if (self.custom.wall.opacity == null) self.custom.wall.opacity = 0.5;
        file.value = '';
        touch();
      };
      rd.readAsDataURL(f);
    });
    var applyBtn = document.getElementById('skWallApply');
    var url = document.getElementById('skWallUrl');
    if (applyBtn && url) applyBtn.addEventListener('click', function(){
      var v = url.value.trim();
      if (!v){ if (typeof showToast === 'function') showToast('先填图片 URL 或本地路径'); return; }
      self.custom.wall = self.custom.wall || {};
      self.custom.wall.src = v;
      if (self.custom.wall.opacity == null) self.custom.wall.opacity = 0.5;
      touch();
    });
    var clear = document.getElementById('skWallClear');
    if (clear) clear.addEventListener('click', function(){ self.custom.wall = null; touch(); });
    var op = document.getElementById('skWallOp');
    if (op) op.addEventListener('input', function(){
      self.custom.wall = self.custom.wall || { src: '' };
      if (!self.custom.wall.src) return;
      self.custom.wall.opacity = (+op.value) / 100;
      save(); self.apply('custom'); self._syncCustomEditor();
    });
    var bl = document.getElementById('skWallBlur');
    if (bl) bl.addEventListener('input', function(){
      self.custom.wall = self.custom.wall || { src: '' };
      if (!self.custom.wall.src) return;
      self.custom.wall.blur = +bl.value;
      save(); self.apply('custom'); self._syncCustomEditor();
    });
  },

  /* 背景图片壁纸层（dream-skin 式）：fixed + z-index:-2，位于弥散光之下 */
  _applyWall(){
    var w = this.custom.wall || {};
    var el = document.getElementById('v3wall');
    if (!el){ el = document.createElement('div'); el.id = 'v3wall'; document.body.appendChild(el); }
    var on = !!(w.src && (w.opacity == null || w.opacity > 0));
    this._cls('wall-on', on);
    if (on){
      el.style.backgroundImage = 'url("' + this._wallSrc(w.src) + '")';
      el.style.opacity = (w.opacity == null ? 0.5 : w.opacity);
      el.style.filter = 'blur(' + (w.blur || 0) + 'px)';
    }
  },
  _hideWall(){ this._cls('wall-on', false); },
  _wallSrc(src){
    src = String(src || '').trim();
    if (!src) return '';
    if (/^(https?:|data:|file:)/i.test(src)) return src;
    if (/^[a-zA-Z]:[\\/]/.test(src)){
      if (typeof window !== 'undefined' && window.__TAURI__ && window.__TAURI__.core &&
          window.__TAURI__.core.convertFileSrc){
        try { return window.__TAURI__.core.convertFileSrc(src); } catch (e) {}
      }
      return 'file:///' + src.replace(/\\/g, '/');
    }
    return src;
  },

  _applyCustomVars(){
    var st = document.documentElement.style;
    var c = this.custom.accent || '#4d6bfe';
    st.setProperty('--accent-blue', c);
    st.setProperty('--accent-indigo', c);
    st.setProperty('--border-highlight', this._rgba(c, 0.5));
    st.setProperty('--v3-accent', c);
    st.setProperty('--v3-accent-soft', this._rgba(c, 0.16));
  },
  _clearCustomVars(){
    var st = document.documentElement.style;
    ['--accent-blue', '--accent-indigo', '--border-highlight', '--v3-accent', '--v3-accent-soft']
      .forEach(function(p){ st.removeProperty(p); });
  },
  _rgba(hex, a){
    var h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 10);
    if (isNaN(n)) return 'rgba(77,107,254,' + a + ')';
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  },

  init(){
    var saved = null;
    try { saved = localStorage.getItem('v2theme'); } catch (e) {}
    if (saved === 'maa') saved = 'dark';
    try {
      var cs = localStorage.getItem('v2themeCustom');
      if (cs){
        var o = JSON.parse(cs);
        if (o && typeof o === 'object')
          this.custom = Object.assign({ dark: true, accent: '#4d6bfe', glass: true, blob: true, shellGlass: true, wall: null }, o);
      }
    } catch (e) {}
    try {
      var sg = localStorage.getItem('v2themeShellGlass');
      if (sg !== null) this.shellGlass = sg === '1';
    } catch (e) {}
    this.apply(saved || 'light');   /* 浅色为默认主题 */
    /* 95_maa 的侧栏/工具栏绑定可能在 DOMContentLoaded 才发生 → 重绑必须排在其后 */
    var self = this;
    if (document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', function(){
        setTimeout(function(){ self._rebind(); }, 0);
      });
    } else {
      this._rebind();
    }
  },

  _rebind(){
    var self = this;
    /* 旧的主题按钮（v2 工具栏/侧栏、v3 标题栏）：去掉旧监听，统一改为打开选择弹窗 */
    ['v2ThemeBar', 'v2ThemeBtn', 'v3tbTheme'].forEach(function(id){
      var b = document.getElementById(id);
      if (!b) return;
      var nb = b.cloneNode(true);
      b.parentNode.replaceChild(nb, b);
      nb.addEventListener('click', function(e){
        e.stopPropagation();
        self.openPicker(nb);
      });
    });
    var tb = document.getElementById('v2ThemeBar');
    if (tb){ tb.textContent = '🎨 主题'; tb.title = '选择主题（浅色/深色/毛玻璃/渐变/自定义）'; }
    /* 侧栏主题键：95_maa 在 #v2side 容器上委托 data-act=theme 的旧切换，
       这里改 act 旁路它，再直绑选择弹窗（不 clone，保留容器委托结构） */
    var sb = document.getElementById('v2ThemeBtn');
    if (sb){
      sb.dataset.act = 'themepick';
      sb.innerHTML = '🎨<i>主题</i>';
      sb.title = '选择主题';
      sb.addEventListener('click', function(e){ e.stopPropagation(); self.openPicker(sb); });
    }
    var sel = document.getElementById('v3setTheme');
    if (sel){
      var ns = sel.cloneNode(true);
      sel.parentNode.replaceChild(ns, sel);
      /* 直传 value（当前选项仅 light/dark，与旧折算行为等价；未来扩选项不再被折算，2026-09-14 审查） */
      ns.addEventListener('change', function(){ self.apply(ns.value || 'light'); });
      this._sel = ns;
    }
    document.addEventListener('click', function(e){
      var pop = document.getElementById('v2themePop');
      if (pop && pop.classList.contains('on') && !pop.contains(e.target)) pop.classList.remove('on');
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape'){ var pop = document.getElementById('v2themePop'); if (pop) pop.classList.remove('on'); }
    });
    this.renderGallery();
    this._bindCustomEditor();
  },

  _syncBtns(){
    var dark = document.body.classList.contains('maa');
    var b = document.getElementById('v3tbTheme');
    if (b){ b.textContent = dark ? '🌙' : '☀'; b.title = '当前：' + this._name(this.current) + '（点击选择主题）'; }
    if (this._sel) this._sel.value = dark ? 'dark' : 'light';
  },
  _name(id){
    for (var i = 0; i < V2_THEMES.length; i++) if (V2_THEMES[i].id === id) return V2_THEMES[i].name;
    return id;
  },

  openPicker(anchor){
    var pop = document.getElementById('v2themePop');
    if (!pop){
      pop = document.createElement('div');
      pop.id = 'v2themePop';
      document.body.appendChild(pop);
    }
    var self = this;
    var html = '<div class="tp-h">🎨 主题<button class="v2close" id="tpClose">✕</button></div><div class="tp-grid">';
    V2_THEMES.forEach(function(t){
      html += '<div class="tp-item' + (t.id === self.current ? ' on' : '') + '" data-t="' + t.id + '">' +
        '<span class="tp-dot" style="background:' + t.dot + '"></span>' + t.name + '</div>';
    });
    html += '</div>';
    if (this.current === 'custom'){
      html += '<div class="tp-sec">自定义参数（即时生效）</div>' +
        '<div class="tp-row"><label>暗色基底</label><input type="checkbox" id="tpDark"' + (this.custom.dark ? ' checked' : '') + '></div>' +
        '<div class="tp-row"><label>强调色</label><input type="color" id="tpAccent" value="' + this.custom.accent + '">' +
        '<span class="v2muted">' + this.custom.accent + '</span></div>' +
        '<div class="tp-row"><label>毛玻璃卡片</label><input type="checkbox" id="tpGlass"' + (this.custom.glass ? ' checked' : '') + '></div>';
    } else {
      html += '<div class="tp-sec">选「自定义」后可调：暗色基底 / 强调色 / 毛玻璃卡片</div>';
    }
    if (document.getElementById('v3skinGrid'))
      html += '<div class="tp-sec"><span id="tpGallery" style="cursor:pointer;color:var(--accent-blue,#2563eb);font-weight:600;">打开换肤中心 →</span></div>';
    pop.innerHTML = html;
    pop.classList.add('on');
    var r = anchor.getBoundingClientRect();
    var pw = 272, ph = pop.offsetHeight || 260;
    var x = Math.min(Math.max(8, r.left), window.innerWidth - pw - 8);
    var y = r.bottom + 8;
    if (y + ph > window.innerHeight - 8) y = Math.max(8, r.top - ph - 8);
    pop.style.left = x + 'px';
    pop.style.top = y + 'px';
    pop.querySelectorAll('.tp-item').forEach(function(el){
      el.addEventListener('click', function(e){
        e.stopPropagation();   /* 重建 innerHTML 会使原 target 游离，冒泡到 document 会被误判为外部点击而关弹窗 */
        self.apply(el.dataset.t);
        self.openPicker(anchor);   /* 重绘选中态 / 自定义区 */
      });
    });
    var tc = document.getElementById('tpClose');
    if (tc) tc.addEventListener('click', function(e){ e.stopPropagation(); pop.classList.remove('on'); });
    var tg = document.getElementById('tpGallery');
    if (tg) tg.addEventListener('click', function(e){
      e.stopPropagation();
      pop.classList.remove('on');
      var b = document.querySelector('#v3rail .v3ni[data-view="skin"]');
      if (b) b.click();
    });
    function saveCustom(){
      try { localStorage.setItem('v2themeCustom', JSON.stringify(self.custom)); } catch (e) {}
    }
    var d = document.getElementById('tpDark');
    if (d) d.addEventListener('change', function(){ self.custom.dark = d.checked; saveCustom(); self.apply('custom'); });
    var a = document.getElementById('tpAccent');
    if (a) a.addEventListener('input', function(){
      self.custom.accent = a.value; saveCustom(); self.apply('custom');
      var sp = a.nextElementSibling; if (sp) sp.textContent = a.value;
    });
    var g = document.getElementById('tpGlass');
    if (g) g.addEventListener('change', function(){ self.custom.glass = g.checked; saveCustom(); self.apply('custom'); });
  }
};

v2Theme.init();
