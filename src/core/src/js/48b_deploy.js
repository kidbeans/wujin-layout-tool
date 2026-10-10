/* ================= 48b_deploy.js —— 一键部署到 MPZ（v4 桌面版专用） =================
 * 跨机加固（2026-09-08 审查）：
 *   ① 先校验后写入——interface.json 读不到/解析不了就一个文件都不动（旧版先写 pipeline 会留半成品）；
 *   ② 根目录取「🌐 服务」面板已验证的 V2_SRV.mpz，其次 localStorage/默认根，读不到时给可操作指引；
 *   ③ agent/fx_counter.py、agent/fx_monitor.py 缺失时由内置源码（49_agent_counter.js）自愈写入——不再依赖备份区外部文件；
 *   ④ agent/main.py 补 import 多级锚点：import actions → 首个顶层 import 区尾 → if __name__/def main/AgentServer 前；
 *   ⑤ interface.json 兼容 JSONC（注释/尾逗号，走 v2ParseAnyJson），写回统一为严格 JSON。
 * 幂等：被覆盖文件先备份 *.bak.时间戳；interface 只动 resource[自制无尽]/import[本片段]/task[本入口]。
 * 写入位置 = MPZ 根（服务面板设置）下的固定相对路径，文件名由节点前缀派生（YS_前缀.json / 前缀_wj.json）。 */
function v2DeployStamp(){
  var d = new Date();
  function p(n){ return (n < 10 ? '0' : '') + n; }
  return '' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
}
/* 纯函数：从生成结果拆部署部件（文件名/入口/option 键/两段 JSON/用到的自定义动作） */
function v2DeployParts(built, task, taskName){
  var p = (built.prefix || 'wj_');
  var base = p.replace(/_+$/, '') || 'wj';
  /* interface 注册列表 = task[0].option（已剔除仅嵌套引用的位置 input）；
     option 定义仍全量写入 task 片段（嵌套引用靠定义解析，不靠顶层列表） */
  var optionKeys = (task.task && task.task[0] && task.task[0].option) || Object.keys(task.option || {});
  var customActions = {};
  Object.keys(built.nodes).forEach(function(n){
    var ca = built.nodes[n].custom_action;
    if (ca) customActions[ca] = 1;
  });
  return {
    prefix: p,
    fileBase: base,
    pipeName: 'YS_' + base + '.json',
    fragName: base + '_wj.json',
    entry: (task.task && task.task[0] && task.task[0].entry) || (p + 'Entry'),
    taskName: taskName || (task.task && task.task[0] && task.task[0].name) || '自定义无尽',
    optionKeys: optionKeys,
    pipelineJson: JSON.stringify(built.nodes, null, 1),
    optionJson: JSON.stringify({ option: task.option,
      _register: { name: taskName || (task.task && task.task[0] && task.task[0].name) || '自定义无尽',
                   entry: (task.task && task.task[0] && task.task[0].entry) || (p + 'Entry'),
                   option: optionKeys,
                   description: (task.task && task.task[0] && task.task[0].description) || '',
                   resource: ['自制无尽'] } }, null, 1),   /* _register：更新还原的自描述来源（MAA 忽略未知键） */
    customActions: customActions
  };
}
/* 纯函数：interface.json 合并（幂等；只动 resource[自制无尽] / import[本片段] / task[本入口]，其余原样） */
function v2DeployInterface(raw, parts, importPath){
  var d = (typeof v2ParseAnyJson === 'function') ? v2ParseAnyJson(raw) : JSON.parse(raw);
  if (!d || typeof d !== 'object') throw new Error('interface.json 不是可解析的 JSON/JSONC');
  var note = [];
  var res = d.resource || (d.resource = []);
  var want = { name: '自制无尽', path: ['./resource', './resource_self'], option: ['渠道服', '高级设置'] };
  var old = null;
  for (var i = 0; i < res.length; i++) if (res[i] && res[i].name === '自制无尽'){ old = res[i]; break; }
  if (!old){ res.push(JSON.parse(JSON.stringify(want))); note.push('resource +自制无尽'); }
  else {
    if ((old.path || []).slice().sort().join('|') !== want.path.slice().sort().join('|')){
      old.path = want.path.slice(); note.push('resource path 更新');
    }
    if (!old.option || !old.option.length){ old.option = want.option.slice(); note.push('resource option 补齐'); }
  }
  var imp = d.import || (d.import = []);
  if (imp.indexOf(importPath) === -1){ imp.push(importPath); note.push('import +' + importPath.split('/').pop()); }
  var kept = [], removed = 0;
  (d.task || []).forEach(function(t){ if (t && t.entry === parts.entry) removed++; else kept.push(t); });
  if (removed) note.push('task 重注册 ×' + removed);
  kept.push({ name: parts.taskName, entry: parts.entry, option: parts.optionKeys.slice(),
              resource: ['自制无尽'], default_check: false });
  d.task = kept;
  return { text: JSON.stringify(d, null, 2), note: note.join('；') || '无变更' };
}
/* 纯函数：agent/main.py 补 import fx_counter（多级锚点，见头部说明④） */
function v2PatchAgentMain(text){
  if (text == null) return { text: null, note: '未找到 agent/main.py——fx 计数器可能无处理器' };
  if (/^import\s+fx_counter\s*$/m.test(text)) return { text: text, note: '已含 import fx_counter（无需修补）' };
  var lines = text.split('\n');
  var ins = function(arr, idx){
    arr.splice(idx, 0, 'import fx_counter');
    return { text: arr.join('\n'), note: '+import fx_counter（第 ' + (idx + 1) + ' 行处）' };
  };
  var i;
  for (i = 0; i < lines.length; i++)
    if (lines[i].trim() === 'import actions') return ins(lines, i + 1);
  /* 锚点兜底①：首个顶层 import 区尾部（最后一行 import/from，其后不再是 import 行） */
  var lastImp = -1;
  for (i = 0; i < lines.length; i++){
    if (/^\s*(import |from )/.test(lines[i])) lastImp = i;
    else if (lastImp > -1 && lines[i].trim() && !/^\s*(import |from )/.test(lines[i]) && !/^\s*#/.test(lines[i])) break;
  }
  if (lastImp > -1) return ins(lines, lastImp + 1);
  /* 锚点兜底②：if __name__ / def main / AgentServer 调用之前 */
  for (i = 0; i < lines.length; i++){
    if (/^\s*if __name__/.test(lines[i]) || /^def\s+main\b/.test(lines[i]) || /^AgentServer\./.test(lines[i]))
      return ins(lines, i);
  }
  return { text: text, note: '⚠ 无可用锚点，未自动修补——请人工确认 fx_counter 已注册' };
}
/* 主流程（Tauri 桥异步链）：先校验后写入 */
function v2DeployMpz(){
  if (typeof V3Bridge === 'undefined' || V3Bridge.mode !== 'tauri' || !V3Bridge.writeText){
    showToast('一键部署需要 v3/v3beta 桌面版'); return;
  }
  var root = (V2_SRV.mpz || v2SrvMpzRoot() || '').trim();
  root = root.replace(/[\/\\]+$/, '');
  if (!root){ showToast('先在「🌐 服务」面板设置 MPZ 根目录'); return; }
  var built = v2BuildPipeline(), task = v2BuildTask(built);
  var parts = v2DeployParts(built, task);
  /* 体检门：error 未清零拒绝部署 */
  var errs = v2OrderIssues(1).concat((V2.order.deck2 && V2.order.deck2.length) ? v2OrderIssues(2) : [])
    .concat(v2BossIssues()).filter(function(x){ return x[1] === 'error'; });
  try {
    errs = errs.concat(v2RouteIssues(V2.route, {
      subSlotsOn: subSlotsOn && slotNames.slice(8).join('') !== '', d2Filled: true,
      bossReady: (V2.boss.ops || []).length > 0
    }).filter(function(x){ return x[1] === 'error'; }));
    errs = errs.concat(v2CounterIssues(built).filter(function(x){ return x[1] === 'error'; }));
    errs = errs.concat(v2ChainIssues(built).filter(function(x){ return x[1] === 'error'; }));
  } catch (e) {}
  if (errs.length){
    v2OutSet('【未部署】体检有 ' + errs.length + ' 个 error，先修再部署：\n' +
      errs.slice(0, 12).map(function(x){ return '[' + x[0] + '/' + x[1] + '] ' + x[2]; }).join('\n') +
      (errs.length > 12 ? '\n…共 ' + errs.length + ' 个' : ''));
    showToast('体检 error 未清零，已取消部署'); return;
  }
  var rs = root.replace(/\\/g, '/');
  var pipePath = rs + '/resource_self/pipeline/Endless/' + parts.pipeName;
  var fragPath = rs + '/resource_self/task/' + parts.fragName;
  var ifPath = rs + '/interface.json';
  var agentPy = rs + '/agent/main.py';
  var fxPy = rs + '/agent/fx_counter.py';
  var log = ['【部署 ' + parts.taskName + '】→ ' + rs];
  function step(s){ log.push(s); }
  function backup(path){
    return V3Bridge.readText(path).then(function(old){
      if (old == null) return null;
      return V3Bridge.writeText(path + '.' + v2DeployStamp() + '.bak', old).then(function(){ step('· 备份 ' + path.split('/').pop()); });
    });
  }
  var ifRaw = null;
  /* ① 校验前置：interface.json 读不到/解析不了 → 一个文件都不动 */
  V3Bridge.readText(ifPath).then(function(raw){
    ifRaw = raw;
    if (raw == null) throw new Error('读不到 ' + ifPath + '\n· MPZ 根目录不对？去「🌐 服务」面板核对或点「📁 浏览…」重新选择（当前：' + rs + '）');
    try { v2DeployInterface(raw, parts, './resource_self/task/' + parts.fragName); }
    catch (e2){ throw new Error('interface.json 解析失败（' + e2.message + '）——未写入任何文件'); }
    step('✓ 校验通过：interface.json 可解析');
    /* ② 写 pipeline + task 片段 */
    return backup(pipePath);
  }).then(function(){
    return V3Bridge.writeText(pipePath, parts.pipelineJson);
  }).then(function(){
    step('✓ 写入 ' + pipePath);
    return backup(fragPath);
  }).then(function(){
    return V3Bridge.writeText(fragPath, parts.optionJson);
  }).then(function(){
    step('✓ 写入 ' + fragPath);
    /* ③ interface 合并写回 */
    var m = v2DeployInterface(ifRaw, parts, './resource_self/task/' + parts.fragName);
    var p2 = m.note === '无变更' ? Promise.resolve() : backup(ifPath).then(function(){ return V3Bridge.writeText(ifPath, m.text); });
    return p2.then(function(){ step('✓ interface.json（' + m.note + '）'); })
      .then(function(){   /* 注册表：更新还原按此清单重建全部自制注册 */
        var regPath = rs + '/resource_self/task/_wujin_registry.json';
        return V3Bridge.readText(regPath).then(function(rt){
          var reg = null;
          try { reg = (typeof v2ParseAnyJson === 'function') ? v2ParseAnyJson(rt) : JSON.parse(rt); } catch (e) { reg = null; }
          if (!reg || Object.prototype.toString.call(reg.tasks) !== '[object Array]') reg = { tasks: [] };
          reg.tasks = reg.tasks.filter(function(t){ return t.entry !== parts.entry; });
          reg.tasks.push({ wj: parts.fragName, entry: parts.entry });
          return V3Bridge.writeText(regPath, JSON.stringify(reg, null, 1));
        }).then(function(){ step('✓ 注册表 _wujin_registry.json（' + parts.entry + '）'); });
      });
  }).then(function(){
    /* ④ agent：fx 计数器检查/修补/自愈 */
    var ca = parts.customActions;
    if (!(ca.fx_counter || ca.fx_counter_reset || ca.fx_monitor_switch)){ step('— agent：未用 fx 计数器，跳过'); return null; }
    return V3Bridge.readText(agentPy).then(function(mt){
      var r = v2PatchAgentMain(mt);
      if (r.text == null){ step('⚠ ' + r.note); return null; }
      if (r.text === mt){ step('✓ agent/main.py ' + r.note); return null; }
      return backup(agentPy).then(function(){ return V3Bridge.writeText(agentPy, r.text); })
        .then(function(){ step('✓ agent/main.py ' + r.note); });
    }).then(function(){
      return V3Bridge.readText(fxPy).then(function(src){
        if (src != null){ step('✓ agent/fx_counter.py 在位'); return null; }
        if (typeof V2_AGENT_FX_PY !== 'string'){ step('⚠ agent/fx_counter.py 缺失且内置源码未加载'); return null; }
        return V3Bridge.writeText(fxPy, V2_AGENT_FX_PY).then(function(){
          step('✓ agent/fx_counter.py 缺失，已由内置源码写入（重启 MPZ 后生效）');
        });
      });
    }).then(function(){
      /* ④b agent：监控窗口自愈（fx_counter import fx_monitor，缺了窗口就静默消失） */
      var fxMon = rs + '/agent/fx_monitor.py';
      return V3Bridge.readText(fxMon).then(function(src){
        if (src != null){ step('✓ agent/fx_monitor.py 在位'); return null; }
        if (typeof V2_AGENT_FX_MONITOR_PY !== 'string'){ step('⚠ agent/fx_monitor.py 缺失且内置源码未加载'); return null; }
        return V3Bridge.writeText(fxMon, V2_AGENT_FX_MONITOR_PY).then(function(){
          step('✓ agent/fx_monitor.py 缺失，已由内置源码写入（监控窗口重启 MPZ 后生效）');
        });
      });
    });
  }).then(function(){
    /* ④c agent：海盗相位计数器自愈（独立于 fx 分支——海盗任务不用 fx_counter） */
    if (!parts.customActions.haidao_step_route) return null;
    var hdPy = rs + '/agent/haidao_counter.py';
    return V3Bridge.readText(hdPy).then(function(src){
      if (src != null){ step('✓ agent/haidao_counter.py 在位'); return null; }
      if (typeof V2_AGENT_HAIDAO_PY !== 'string'){ step('⚠ agent/haidao_counter.py 缺失且内置源码未加载'); return null; }
      return V3Bridge.writeText(hdPy, V2_AGENT_HAIDAO_PY).then(function(){
        step('✓ agent/haidao_counter.py 缺失，已由内置源码写入');
      });
    });
  }).then(function(){
    log.push('完成。重启 MPZ（MFAAvalonia）后，任务列表资源切「自制无尽」即可看到「' + parts.taskName + '」');
    v2OutSet('/* ===== 🚀 部署报告（' + new Date().toLocaleString() + '）— 本块仅为提示，不属于片段内容 =====\n' +
      log.map(function(l){ return ' * ' + l; }).join('\n') + '\n */');
    showToast('已部署：' + parts.taskName);
  }).catch(function(e){
    v2OutSet('【未部署】' + ((e && e.message) || e) + '\n' + log.map(function(l){ return '· ' + l; }).join('\n'));
    showToast('未部署（原因见导出框）');
  });
}
