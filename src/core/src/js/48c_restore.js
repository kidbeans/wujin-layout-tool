/* ================= 48c_restore.js —— 官方 MPZ 更新后一键还原（v4.1.0） =================
 * 官方 zip 原地更新会整体替换 agent/ 与 interface.json（resource_self/ 不动）。
 * 本模块按「注册表 + _register 自描述」重建，全程只追加不覆盖官方文件：
 *   1. agent/fx_counter.py、fx_monitor.py、haidao_counter.py 缺失 → 内置源码自愈写入
 *   2. agent/main.py 追加自制 import（v2PatchAgentMain 幂等锚点）；fx_main.py 存在或接口指向它则重建
 *   3. interface.json：resource[自制无尽] + import[*_wj.json] + task[_register 全量] 合并写回（先备份）
 * 来源：resource_self/task/_wujin_registry.json（由一键部署维护）。缺注册表 → 提示先部署一次。
 */
"use strict";

function v2RestoreAfterUpdate(){
  if (typeof V3Bridge === 'undefined' || V3Bridge.mode !== 'tauri' || !V3Bridge.writeText){
    showToast('更新还原需要桌面版'); return;
  }
  var root = (V2_SRV.mpz || v2SrvMpzRoot() || '').trim();
  root = root.replace(/[\/\\]+$/, '');
  if (!root){ showToast('先在「🌐 服务」面板设置 MPZ 根目录'); return; }
  var rs = root.replace(/\\/g, '/');
  var log = ['【更新还原】→ ' + rs];
  function step(s){ log.push(s); }
  function backup(path){
    return V3Bridge.readText(path).then(function(old){
      if (old == null) return null;
      return V3Bridge.writeText(path + '.' + v2DeployStamp() + '.bak', old).then(function(){ step('· 备份 ' + path.split('/').pop()); });
    });
  }
  function parseAny(t){
    return (typeof v2ParseAnyJson === 'function') ? v2ParseAnyJson(t) : JSON.parse(t);
  }
  var ifPath = rs + '/interface.json';
  var regPath = rs + '/resource_self/task/_wujin_registry.json';
  var ifD = null, regs = [];
  Promise.resolve().then(function(){
    return V3Bridge.readText(ifPath);
  }).then(function(raw){
    if (raw == null) throw new Error('interface.json 读不到');
    ifD = parseAny(raw);
    return V3Bridge.readText(regPath);
  }).then(function(rt){
    if (rt == null) throw new Error('缺 _wujin_registry.json 注册表——请用 v4.1.0 对各任务先「部署到 MPZ」一次');
    var reg = parseAny(rt);
    return (reg && reg.tasks) || [];
  }).then(function(tasks){
    var chain = Promise.resolve();
    tasks.forEach(function(t){
      chain = chain.then(function(){
        return V3Bridge.readText(rs + '/resource_self/task/' + t.wj).then(function(w){
          if (w == null){ step('⚠ 片段缺失跳过 ' + t.wj); return; }
          var j = null;
          try { j = parseAny(w); } catch (e) {}
          if (!j || !j._register){ step('⚠ 无 _register（旧版部署件）跳过 ' + t.wj); return; }
          regs.push({ wj: t.wj, r: j._register });
        });
      });
    });
    return chain;
  }).then(function(){
    if (!regs.length) throw new Error('注册表内无可用 _register 条目');
    /* ① interface 合并 */
    var res = ifD.resource || (ifD.resource = []);
    var hasSelf = false;
    res.forEach(function(r){ if (r.name === '自制无尽') hasSelf = true; });
    if (!hasSelf) res.push({ name: '自制无尽', path: ['./resource', './resource_self'] });
    var imp = ifD.import || (ifD.import = []);
    var tasksArr = ifD.task || (ifD.task = []);
    regs.forEach(function(x){
      var ip = './resource_self/task/' + x.wj;
      if (imp.indexOf(ip) < 0) imp.push(ip);
      var t = { name: x.r.name, entry: x.r.entry, option: x.r.option,
                resource: x.r.resource || ['自制无尽'], default_check: false,
                description: x.r.description || '' };
      var at = -1;
      tasksArr.forEach(function(tt, i){ if (tt.entry === x.r.entry) at = i; });
      if (at >= 0) tasksArr[at] = t; else tasksArr.push(t);
    });
    /* ①b 官方任务归一化（2026-10-10 实测）：0.5.5 起官方任务不带 resource 标签，
       MFAAvalonia 会把无标签任务显示进所有资源组（「自制无尽」里冒出一堆官方任务）。
       还原时统一把无标签任务归属第一个非自制资源组。 */
    var officialRes = null;
    res.forEach(function(r){ if (!officialRes && r.name !== '自制无尽') officialRes = r.name; });
    if (officialRes) tasksArr.forEach(function(t){
      if (!t.resource || !t.resource.length) t.resource = [officialRes];
    });
    return backup(ifPath).then(function(){
      return V3Bridge.writeText(ifPath, JSON.stringify(ifD, null, 2) + '\n');
    }).then(function(){ step('✓ interface.json 重注册 ' + regs.length + ' 个自制任务'); });
  }).then(function(){
    /* ② agent 三件套自愈（内置源码） */
    var files = [['fx_counter.py', 'V2_AGENT_FX_PY'], ['fx_monitor.py', 'V2_AGENT_FX_MONITOR_PY'],
                 ['haidao_counter.py', 'V2_AGENT_HAIDAO_PY']];
    var chain = Promise.resolve();
    files.forEach(function(f){
      chain = chain.then(function(){
        var p = rs + '/agent/' + f[0];
        return V3Bridge.readText(p).then(function(src){
          if (src != null){ step('✓ agent/' + f[0] + ' 在位'); return null; }
          var emb = window[f[1]];
          if (typeof emb !== 'string'){ step('⚠ agent/' + f[0] + ' 缺失且无内置源码'); return null; }
          return V3Bridge.writeText(p, emb).then(function(){ step('✓ agent/' + f[0] + ' 已自愈写入'); });
        });
      });
    });
    return chain;
  }).then(function(){
    /* ③ main.py 追加自制 import（幂等）；fx_main.py 存在或接口指向它则按新 main 重建 */
    var agentPy = rs + '/agent/main.py';
    return V3Bridge.readText(agentPy).then(function(mt){
      if (mt == null){ step('⚠ 未找到 agent/main.py'); return; }
      var r = v2PatchAgentMain(mt);
      var mainText = r.text == null ? mt : r.text;
      var chain = (mainText === mt) ? Promise.resolve()
        : backup(agentPy).then(function(){ return V3Bridge.writeText(agentPy, mainText); })
          .then(function(){ step('✓ agent/main.py ' + r.note); });
      return chain.then(function(){
        var fm = rs + '/agent/fx_main.py';
        var pointsFm = ifD.agent && String((ifD.agent.child_args || []).join()).indexOf('fx_main') > -1;
        return V3Bridge.readText(fm).then(function(cur){
          if (cur == null && !pointsFm) return null;
          var want = mainText;
          ['fx_counter', 'fx_monitor', 'haidao_counter'].forEach(function(m){
            if (!new RegExp('^import ' + m + '$', 'm').test(want)) want += '\nimport ' + m;
          });
          if (!/[\n]$/.test(want)) want += '\n';
          if (cur === want){ step('✓ agent/fx_main.py 在位且最新'); return null; }
          return V3Bridge.writeText(fm, want).then(function(){ step('✓ agent/fx_main.py 重建（官方全量+自制）'); });
        });
      });
    });
  }).then(function(){
    log.push('完成。重启 MPZ 后任务列表资源切「自制无尽」核对任务数（本次还原 ' + regs.length + ' 个）。');
    v2OutSet('/* ===== 🩹 更新还原报告（' + new Date().toLocaleString() + '）=====\n' +
      log.map(function(l){ return ' * ' + l; }).join('\n') + '\n */');
    showToast('还原完成：' + regs.length + ' 个任务');
  }).catch(function(e){
    v2OutSet('【还原失败】' + ((e && e.message) || e) + '\n' + log.map(function(l){ return '· ' + l; }).join('\n'));
    showToast('还原失败（原因见导出框）');
  });
}
