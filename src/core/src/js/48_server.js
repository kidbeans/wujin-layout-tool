/* ================= v2 服务模式（48_server.js）：对接 webui.py 本机服务 =================
 * file:// 打开时：探测失败显示引导；http://127.0.0.1:8765（webui.py）或任意端口下激活。
 * webui.py 对 /api/* 开 CORS，所以 file:// 页面也能直连本机服务。 */
"use strict";

var V2_SRV = { base: '', ok: false, root: '', groups: null, picked: {}, native: false, mpz: '' };
function v2SrvNative(){
  return typeof V3Bridge !== 'undefined' && V3Bridge.mode === 'tauri';
}
/* 路径清洗：去控制字符（历史 placeholder 里曾混入 \x07）/引号，反斜杠统一为正斜杠（Windows API 两收） */
function v2SrvCleanPath(s){
  return String(s == null ? '' : s)
    .replace(/["']/g, '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/\\/g, '/')
    .trim();
}
function v2SrvMpzRoot(){
  var r = '';
  try { r = localStorage.getItem('v2srvMpz') || ''; } catch (e) {}
  /* 默认根必须用正斜杠：'E:\app\...' 的 \a/\M 是无效转义，求值后反斜杠消失（历史 bug：报 E:appMaaPVZ...） */
  return v2SrvCleanPath(r) || 'E:/app/MaaPVZ-win-x86_64';
}

function v2SrvUrl(path){ return V2_SRV.base + path; }

function v2SrvBases(){
  var saved = '';
  try { saved = localStorage.getItem('v2srvBase') || ''; } catch (e) {}
  var list = [];
  if (saved) list.push(saved.replace(/\/+$/, ''));
  list.push('');                                    /* 同源（页面由 webui 直接伺服时） */
  [8765, 8766, 8767, 8768].forEach(function(p){
    var u = 'http://127.0.0.1:' + p;
    if (list.indexOf(u) === -1) list.push(u);
  });
  return list;
}
function v2SrvProbe(){
  var bases = v2SrvBases();
  var i = 0;
  function tryNext(){
    if (i >= bases.length) return Promise.resolve(false);
    var base = bases[i++];
    return fetch(base + '/api/ping', { mode: 'cors' }).then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){
        if (j && j.ok){
          V2_SRV.base = base; V2_SRV.ok = true; V2_SRV.root = j.root || '';
          if (base){ try { localStorage.setItem('v2srvBase', base); } catch (e) {} }   /* 记住可用地址 */
          return true;
        }
        return tryNext();
      })
      .catch(function(){ return tryNext(); });
  }
  return tryNext();
}

function v2SrvEsc(s){ return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

function v2SrvRenderList(){
  if (!V2_SRV.groups) return;
  function render(boxId, files, group){
    var box = document.getElementById(boxId);
    if (!box) return;
    box.innerHTML = files.length ? files.map(function(f){
      var on = !!V2_SRV.picked[f.path];
      var kb = f.size > 1024 ? Math.round(f.size / 1024) + 'K' : f.size + 'B';
      return '<label><input type="checkbox" data-srvpath="' + v2SrvEsc(f.path) + '" data-srvgroup="' + group + '"' + (on ? ' checked' : '') + '>' +
        '<span>' + v2SrvEsc(f.name) + '</span><span class="fsz">' + kb + '</span></label>';
    }).join('') : '<div class="v2muted" style="padding:4px;">（无）</div>';
  }
  render('srvPipeList', V2_SRV.groups.pipe || [], 'pipe');
  render('srvTaskList', (V2_SRV.groups.task || []).concat(V2_SRV.groups.iface || []), 'task');
  render('srvLogList', V2_SRV.groups.logs || [], 'log');
}

function v2SrvPicked(group){
  return Object.keys(V2_SRV.picked).filter(function(k){ return V2_SRV.picked[k] === group; });
}

function v2SrvFetchFiles(paths){
  if (V2_SRV.native){
    return Promise.all(paths.map(function(p){
      var rel = p.replace(/^mpz:/, '');
      var abs = V2_SRV.mpz.replace(/[\/]+$/, '') + '/' + rel;
      return V3Bridge.invoke('read_text', { path: abs })
        .then(function(text){ return { name: rel.split('/').pop(), text: text }; })
        .catch(function(){ return null; });
    })).then(function(arr){ return arr.filter(Boolean); });
  }
  return Promise.all(paths.map(function(p){
    return fetch(v2SrvUrl('/api/file?path=' + encodeURIComponent(p)), { mode: 'cors' })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){ return j ? { name: j.name, text: j.text } : null; });
  })).then(function(arr){ return arr.filter(Boolean); });
}

function v2SrvIntoChecks(){
  var pipes = v2SrvPicked('pipe'), tasks = v2SrvPicked('task'), logs = v2SrvPicked('log');
  if (!pipes.length && !tasks.length && !logs.length){ showToast('先勾选文件'); return; }
  v2SrvFetchFiles(pipes).then(function(a){
    if (a.length){
      window.__v2PipeFiles = a;
      var el = document.getElementById('chkPipeName');
      if (el) el.textContent = a.length === 1 ? a[0].name : a.length + ' 个文件';
    }
    return v2SrvFetchFiles(tasks);
  }).then(function(a){
    if (a.length){
      var iface = a.filter(function(f){ return /interface/i.test(f.name); });
      var task = a.filter(function(f){ return !/interface/i.test(f.name); });
      var t = document.getElementById('chkTaskName'), i2 = document.getElementById('chkIfaceName');
      if (iface.length){ window.__v2IfaceText = iface; if (i2) i2.textContent = iface[0].name; }
      if (task.length){ window.__v2TaskText = task; if (t) t.textContent = task.length === 1 ? task[0].name : task.length + ' 个文件'; }
    }
    return v2SrvFetchFiles(logs);
  }).then(function(a){
    if (a.length){
      var ag = [], mf = [];
      a.forEach(function(f){
        (/counter/i.test(f.name) ? ag : mf).push(f);
      });
      if (ag.length){ window.__v2LogAgent = ag; document.getElementById('chkLogAgentName').textContent = ag.length + ' 个'; }
      if (mf.length){ window.__v2LogMaafw = mf; document.getElementById('chkLogMaafwName').textContent = mf.length + ' 个'; }
    }
    if (typeof v2OpenPanel === 'function') v2OpenPanel('checks');
    v2ChecksGo();
  }).catch(function(e){ showToast('载入失败：' + e); });
}

/* 服务面板只负责「列出 MPZ 上的文件并勾选」；解析与报告统一走导入面板（2026-10-10 批 D2）。
   旧版在这里直接 v2ImportAnalyze 并自己写 impReport —— 同一件事两套代码，报告框也不是同一处。 */
function v2SrvIntoImport(){
  var pipes = v2SrvPicked('pipe');
  if (!pipes.length){ showToast('先勾选 pipeline 文件'); return; }
  v2SrvFetchFiles(pipes).then(function(files){
    window.__v2ImpFiles = files;
    var el = document.getElementById('impPipeName');
    if (el) el.textContent = files.length === 1 ? files[0].name : files.length + ' 个文件';
    if (typeof v2ImpAnalyzeClick === 'function') v2ImpAnalyzeClick();
    if (typeof v2OpenPanel === 'function') v2OpenPanel('import');
    showToast('已解析勾选的 pipeline，报告见导入面板');
  }).catch(function(e){ showToast('载入失败：' + e); });
}

function v2SrvConnect(){
  var st = document.getElementById('srvStatus');
  var body = document.getElementById('srvBody');
  if (!st) return Promise.resolve(false);

  /* 桌面原生直读：Rust srv_scan 直接扫 MPZ 目录，无需 webui 服务 */
  if (v2SrvNative()){
    V2_SRV.native = true;
    V2_SRV.mpz = v2SrvMpzRoot();
    V2_SRV.base = 'native'; V2_SRV.ok = true; V2_SRV.root = V2_SRV.mpz;
    st.innerHTML = '✓ 桌面原生直读（免服务）· MPZ 根：<code>' + v2SrvEsc(V2_SRV.mpz) + '</code>';
    if (body) body.style.display = '';
    var mzRow = document.getElementById('srvMpzRow');
    if (mzRow) mzRow.style.display = '';
    var mz = document.getElementById('srvMpz');
    if (mz && !mz.value) mz.value = V2_SRV.mpz;
    var wRow = document.getElementById('srvWebRow');
    if (wRow) wRow.style.display = 'none';
    V3Bridge.invoke('srv_scan', { root: V2_SRV.mpz }).then(function(j){
      V2_SRV.groups = (j && j.groups) || {};
      v2SrvRenderList();
    }).catch(function(e){
      /* 自动回退默认安装根重试一次（历史存档路径可能被转义事故弄坏，如 E:appMaaPVZ...） */
      var dft = 'E:/app/MaaPVZ-win-x86_64';
      if (v2SrvCleanPath(V2_SRV.mpz) && v2SrvCleanPath(V2_SRV.mpz) !== dft){
        V3Bridge.invoke('srv_scan', { root: dft }).then(function (j2){
          V2_SRV.mpz = dft; V2_SRV.root = dft; V2_SRV.groups = (j2 && j2.groups) || {};
          try { localStorage.setItem('v2srvMpz', dft); } catch (e2) {}
          var mz2 = document.getElementById('srvMpz'); if (mz2) mz2.value = dft;
          st.innerHTML = '⚠ 原配置根不可用（' + v2SrvEsc(String(e)).slice(0, 90) + '），已自动回退默认：<code>' + v2SrvEsc(dft) + '</code>';
          v2SrvRenderList();
        }).catch(function(){
          st.innerHTML = '✗ 原生扫描失败：' + v2SrvEsc(String(e)) + '（检查上方 MPZ 根目录，或点「📁 浏览…」选择）';
        });
        return;
      }
      st.innerHTML = '✗ 原生扫描失败：' + v2SrvEsc(String(e)) + '（检查上方 MPZ 根目录，或点「📁 浏览…」选择）';
    });
    return Promise.resolve(true);
  }

  st.innerHTML = '正在探测服务……';
  return v2SrvProbe().then(function(ok){
    if (!ok){
      st.innerHTML = '✗ 未检测到本机服务。启动：<code>python webui.py</code>（或 <code>python launch.py</code> 开原生窗口）后再点「连接/重试」；' +
        '也可在上方手动填写服务地址（端口不对就改）；双击 HTML 直开仍可离线使用全部功能。';
      if (body) body.style.display = 'none';
      return false;
    }
    st.innerHTML = '✓ 服务已连接（' + (V2_SRV.base || '同源') + '）';
    if (body) body.style.display = '';
    var rootEl = document.getElementById('srvRoot');
    if (rootEl) rootEl.textContent = V2_SRV.root || '（未配置）';
    var bi = document.getElementById('srvBase');
    if (bi && V2_SRV.base && !bi.value) bi.value = V2_SRV.base;
    fetch(v2SrvUrl('/api/list'), { mode: 'cors' }).then(function(r){ return r.json(); }).then(function(j){
      V2_SRV.groups = j.groups || {};
      v2SrvRenderList();
    }).catch(function(e){ st.innerHTML += ' · 清单获取失败：' + e; });
    return true;
  });
}

function v2ServerInit(){
  if (window.__v2SrvOn) return;
  window.__v2SrvOn = true;
  var st = document.getElementById('srvStatus');
  if (!st) return;
  try {
    var saved = localStorage.getItem('v2srvBase') || '';
    var bi0 = document.getElementById('srvBase');
    if (bi0 && saved) bi0.value = saved;
  } catch (e) {}
  v2SrvConnect();
  /* 勾选 */
  var sb = document.getElementById('srvBody');
  if (sb) sb.addEventListener('change', function(e){
    var cb = e.target.closest('input[data-srvpath]');
    if (!cb) return;
    if (cb.checked) V2_SRV.picked[cb.dataset.srvpath] = cb.dataset.srvgroup;
    else delete V2_SRV.picked[cb.dataset.srvpath];
  });
  var b = function(id){ return document.getElementById(id); };
  if (b('srvMpzGo')) b('srvMpzGo').addEventListener('click', function(){
    var mz = b('srvMpz');
    var v = v2SrvCleanPath((mz && mz.value) || '');
    if (mz) mz.value = v;
    try { localStorage.setItem('v2srvMpz', v); } catch (e) {}
    v2SrvConnect();
  });
  if (b('srvMpzPick')) b('srvMpzPick').addEventListener('click', function(){
    if (!v2SrvNative() || typeof V3Bridge.pickDir !== 'function'){
      if (typeof showToast === 'function') showToast('浏览器模式请直接粘贴路径（正斜杠/反斜杠均可）');
      return;
    }
    V3Bridge.pickDir('选择 MPZ 根目录（含 resource 的安装根）').then(function (p){
      if (!p) return;
      var mz = b('srvMpz');
      if (mz) mz.value = p;
      try { localStorage.setItem('v2srvMpz', p); } catch (e) {}
      v2SrvConnect();
    });
  });
  if (b('srvBaseGo')) b('srvBaseGo').addEventListener('click', function(){
    var bi = b('srvBase');
    var v = (bi && bi.value || '').trim().replace(/\/+$/, '');
    try { localStorage.setItem('v2srvBase', v); } catch (e) {}   /* 空 = 清除记忆 */
    v2SrvConnect();
  });
  if (b('srvLoadChecks')) b('srvLoadChecks').addEventListener('click', v2SrvIntoChecks);
  if (b('srvImport')) b('srvImport').addEventListener('click', v2SrvIntoImport);
  if (b('srvGenPresets')) b('srvGenPresets').addEventListener('click', function(){
    if (V2_SRV.native){ b('srvGenOut').textContent = '再生成预设需 python——桌面原生模式不支持，请用 python webui.py 的服务模式'; return; }
    b('srvGenOut').textContent = '正在再生成……';
    fetch(v2SrvUrl('/api/genpresets'), { method: 'POST', mode: 'cors' }).then(function(r){ return r.json(); }).then(function(j){
      b('srvGenOut').textContent = j.ok ? ('完成：' + (j.tail || '').split('\n').slice(-2).join(' | ')) : ('失败：' + (j.err || '?'));
      if (j.ok) showToast('预设已再生成，请刷新页面加载新数据');
    }).catch(function(e){ b('srvGenOut').textContent = '失败：' + e; });
  });
}
/* 一键部署到 MPZ 的逻辑已拆分至 48b_deploy.js；此处保留注释并正确闭合，
 * 以免悬挂的 /* ... 使本文件独立语法校验（node --check）失败。 */
