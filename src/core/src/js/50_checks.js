/* ================= v2 检查面板：pipeline/task/interface 检查链 + 日志时间线 =================
 * 规则出处《无尽布阵工具改进计划》§4.2；命名后缀匹配（不依赖前缀）。
 * v0.2：宽松 JSONC（注释+尾逗号）、多文件合并图、V2 同名冲突、V3 双文件 diff、
 *       S11~S22/T5~T7 新规则、agent/maafw 日志解析（每关耗时+失败事件）。
 */
"use strict";

/* ---- 宽松 JSONC 解析（字符串感知剥注释 + 剥尾逗号） ---- */
function v2StripJsonc(text){
  var out = [], i = 0, n = text.length, inStr = false, q = '';
  while (i < n){
    var ch = text[i];
    if (inStr){
      out.push(ch);
      if (ch === '\\'){ out.push(text[i + 1] || ''); i += 2; continue; }
      if (ch === q){ inStr = false; }
      i++; continue;
    }
    if (ch === '"' || ch === "'" || ch === '`'){ inStr = true; q = ch; out.push(ch); i++; continue; }
    if (ch === '/' && text[i + 1] === '/'){ while (i < n && text[i] !== '\n') i++; continue; }
    if (ch === '/' && text[i + 1] === '*'){ i += 2; while (i < n && !(text[i] === '*' && text[i + 1] === '/')) i++; i += 2; continue; }
    out.push(ch); i++;
  }
  return out.join('').replace(/,(\s*[}\]])/g, '$1');
}
function v2ParseAnyJson(text){
  try{ return JSON.parse(text); }catch(e){}
  try{ return JSON.parse(v2StripJsonc(String(text))); }catch(e){}
  return null;
}

var V2_CHECK_WL = ['种植物_初始化_', 'wujin_', '卡槽', '种植物_', '通用_', '[JumpBack]', '迷你工具_', '无尽挑战_'];
function v2NxArr(d){ return (d && Array.isArray(d.next)) ? d.next : []; }
function v2Anchors(d){ if (d && d.anchor && typeof d.anchor === 'object') return Object.keys(d.anchor).map(function(k){ return d.anchor[k]; }); return []; }
function v2CheckWhitelisted(ref){
  return V2_CHECK_WL.some(function(w){ return (ref || '').indexOf(w) === 0; }) || /^\[Anchor\]/.test(ref || '');
}

/* ---- 多文件合并 ---- */
function v2MergePipelines(files){
  var merged = {}, collisions = [], parsed = [], notes = [];
  (files || []).forEach(function(f){
    var p = v2ParseAnyJson(f.text);
    if (!p || typeof p !== 'object'){ notes.push('[S0] ' + f.name + ' 解析失败（非法 JSON/JSONC）'); return; }
    parsed.push({ name: f.name, p: p });
    Object.keys(p).forEach(function(k){
      if (Object.prototype.hasOwnProperty.call(merged, k)){
        collisions.push(k + '  ← ' + f.name);
        var i = 2, nk = k + '#' + i;
        while (Object.prototype.hasOwnProperty.call(merged, nk)){ i++; nk = k + '#' + i; }
        merged[nk] = p[k];
      } else merged[k] = p[k];
    });
  });
  return { merged: merged, collisions: collisions, notes: notes, parsed: parsed };
}

/* ---- V3 双文件节点级 diff ---- */
function v2DiffPipelines(pa, pb){
  var out = [];
  var ka = Object.keys(pa), kb = Object.keys(pb);
  var added = kb.filter(function(k){ return !(k in pa); });
  var removed = ka.filter(function(k){ return !(k in pb); });
  var changed = [];
  ka.forEach(function(k){
    if (!(k in pb)) return;
    if (JSON.stringify(pa[k]) !== JSON.stringify(pb[k])){
      var fa = pa[k] || {}, fb = pb[k] || {};
      var fields = [];
      var all = {};
      Object.keys(fa).forEach(function(f){ all[f] = 1; });
      Object.keys(fb).forEach(function(f){ all[f] = 1; });
      Object.keys(all).forEach(function(f){
        if (JSON.stringify(fa[f]) !== JSON.stringify(fb[f])) fields.push(f);
      });
      changed.push(k + '（' + (fields.slice(0, 6).join(', ') || '?') + (fields.length > 6 ? ' 等' : '') + '）');
    }
  });
  if (added.length) out.push('新增节点 ' + added.length + '：' + added.slice(0, 8).join(', ') + (added.length > 8 ? ' …' : ''));
  if (removed.length) out.push('移除节点 ' + removed.length + '：' + removed.slice(0, 8).join(', ') + (removed.length > 8 ? ' …' : ''));
  if (changed.length) out.push('字段改动 ' + changed.length + '：' + changed.slice(0, 12).join('；') + (changed.length > 12 ? ' …' : ''));
  if (!out.length) out.push('两份文件节点完全一致');
  return out;
}

/* ---- 日志解析 ---- */
var V2_AGENT_KEYS = ['start_level', 'route_node', 'route', 'absolute', 'deck1_first', 'front10', 'front30',
  'front30_feed', 'front10_feed', 'd2_tails', 'boss_tails', 'deck2_tail3_first', 'beilei_stop', 'bailuo_from',
  'boss_feed_early', 'boss_feed_late',
  'boss_stack_from', 'boss_stack_entry', 'boss_stack_skip',
  'force', 'enabled', 'increment'];

function v2ParseAgentLog(text){
  var levels = [], resets = [], lastTs = null, firstTs = null;
  var reLine = /^\[(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})\]\s*(.*)$/;
  var reLevel = /第(\d+)关/;
  var reGap = /间隔([\d.]+)s/;
  function toSec(t){
    var p = t.split(':');
    return (+p[0]) * 3600 + (+p[1]) * 60 + (+p[2]);
  }
  var prevTs = null;
  (text || '').split(/\r?\n/).forEach(function(line){
    var m = reLine.exec(line);
    if (!m) return;
    if (!firstTs) firstTs = m[1] + ' ' + m[2];
    lastTs = m[1] + ' ' + m[2];
    var msg = m[3];
    if (/重置|Reset|reset/.test(msg)){ var rm = reLevel.exec(msg); resets.push({ ts: m[2], to: rm ? +rm[1] : null, msg: msg.slice(0, 60) }); prevTs = null; return; }
    var lm = reLevel.exec(msg);
    if (lm){
      var lv = +lm[1];
      var gap = reGap.exec(msg);
      var dur = gap ? +gap[1] : (prevTs != null ? Math.max(0, toSec(m[2]) - prevTs) : null);
      /* 计步 N 的间隔 = 第 N-1 关耗时（fx 显式带间隔；haidao 用时间差兜底） */
      levels.push({ level: lv - 1, dur: dur, msg: msg.slice(0, 80) });
      prevTs = toSec(m[2]);
    }
  });
  var rows = levels.filter(function(x){ return x.dur != null && x.dur > 0 && x.dur < 7200; });
  return { rows: rows, resets: resets, firstTs: firstTs, lastTs: lastTs, count: levels.length };
}

function v2ParseMaafwLog(text){
  var res = { sessions: 0, firstTs: null, lastTs: null, errCount: 0, warnCount: 0, nodeDone: 0,
              issues: [], noise: 0, recoFailTimeout: 0 };
  var reLine = /^\[([^\]]+)\]\[(TRC|DBG|INF|WRN|ERR)\]\[[^\]]*\]\[[^\]]*\]\[([^\]]*)\](.*)$/;
  (text || '').split(/\r?\n/).forEach(function(line){
    if (!line) return;
    var m = reLine.exec(line);
    if (!m){ return; }
    var ts = m[1], lvl = m[2], src = m[3], msg = m[4];
    if (!res.firstTs) res.firstTs = ts;
    res.lastTs = ts;
    if (/MAA Process Start/.test(msg)) res.sessions++;
    if (lvl === 'ERR'){
      res.errCount++;
      if (res.issues.length < 200) res.issues.push({ ts: ts, lvl: 'ERR', msg: (msg.length > 170 ? msg.slice(0, 170) + '…' : msg) });
    } else if (lvl === 'WRN'){
      res.warnCount++;
      if (/Wrong ocr_result/.test(msg) && /OCRer/.test(src)){ res.noise++; return; }
      if (/reco_timeout|Task timeout|max_hit reached|bad next|save_on_error|Recognition/.test(msg)){
        res.recoFailTimeout++;
        if (res.issues.length < 200) res.issues.push({ ts: ts, lvl: 'WRN', msg: (msg.length > 170 ? msg.slice(0, 170) + '…' : msg) });
      }
    }
    if (/PipelineTask node done/.test(msg)) res.nodeDone++;
  });
  return res;
}

function v2LogReport(agentTexts, maafwTexts){
  var L = [];
  /* agent 计步 → 每关耗时 */
  var allRows = [], resets = 0;
  (agentTexts || []).forEach(function(t){
    var r = v2ParseAgentLog(t.text);
    resets += r.resets.length;
    r.rows.forEach(function(x){ allRows.push(x); });
    if (r.firstTs) L.push('agent 日志 ' + t.name + '：' + r.firstTs + ' ~ ' + (r.lastTs || '') + '，计步 ' + r.count + ' 次，重置 ' + r.resets.length + ' 次');
  });
  if (allRows.length){
    var durs = allRows.map(function(x){ return x.dur; }).filter(function(x){ return x > 0 && x < 3600; });
    durs.sort(function(a, b){ return a - b; });
    var sum = durs.reduce(function(a, b){ return a + b; }, 0);
    var avg = durs.length ? sum / durs.length : 0;
    var top = allRows.slice().sort(function(a, b){ return b.dur - a.dur; }).slice(0, 10);
    var fmt = function(sec){
      var h = Math.floor(sec / 3600), mnt = Math.floor(sec % 3600 / 60), s = Math.round(sec % 60);
      return (h ? h + 'h' : '') + (mnt ? mnt + 'm' : '') + s + 's';
    };
    L.push('');
    L.push('【每关耗时（计步间隔口径）】样本 ' + durs.length + ' 关，平均 ' + avg.toFixed(1) + 's，中位 ' +
      (durs.length ? durs[Math.floor(durs.length / 2)].toFixed(1) : '-') + 's，累计 ' + fmt(sum));
    L.push('慢关 Top10：' + top.map(function(x){ return '第' + x.level + '关=' + x.dur.toFixed(0) + 's'; }).join('，'));
    var per10 = {};
    allRows.forEach(function(x){ var b = Math.floor((x.level - 1) / 10) * 10 + 1; per10[b] = (per10[b] || 0) + x.dur; });
    L.push('每 10 关小计：' + Object.keys(per10).sort(function(a, b){ return a - b; }).map(function(k){ return k + '~' + (+k + 9) + '=' + fmt(per10[k]); }).join('，'));
  } else if ((agentTexts || []).length){
    L.push('agent 日志：未解析出「第N关 … (间隔Xs)」行（确认是 fx_counter/haidao_counter 日志）');
  }
  /* maafw 日志 → 失败事件 */
  if ((maafwTexts || []).length){
    (maafwTexts || []).forEach(function(t){
      var r = v2ParseMaafwLog(t.text);
      L.push('');
      L.push('maafw 日志 ' + t.name + '：会话 ' + r.sessions + '，节点完成 ' + r.nodeDone + '，ERR ' + r.errCount +
        '，WRN ' + r.warnCount + '（OCR 抖动噪声 ' + r.noise + '）');
      r.issues.slice(0, 12).forEach(function(x){ L.push('  [' + x.ts + '][' + x.lvl + '] ' + x.msg.replace(/\s+/g, ' ')); });
      if (r.issues.length > 12) L.push('  … 共 ' + r.issues.length + ' 条关键事件');
    });
  }
  if (!L.length) L.push('（未提供日志文件）');
  return L.join('\n');
}

/* ================= 静态检查主入口 ================= */
function v2RunChecksEx(opts){
  opts = opts || {};
  var E = [], W = [], I = [];
  function add(sev, id, msg){ (sev === 'error' ? E : sev === 'warn' ? W : I).push('[' + id + '/' + sev + '] ' + msg); }

  /* 多文件合并 */
  var files = opts.pipeFiles || [];
  if (opts.pipeText && !files.length) files = [{ name: 'pipeline', text: opts.pipeText }];
  var mg = v2MergePipelines(files);
  mg.notes.forEach(function(x){ add('error', 'S0', x.slice(5)); });
  if (mg.collisions.length) add('warn', 'V2', '同名节点冲突（合并图已改名 #2/#3…）：' + mg.collisions.slice(0, 6).join('；') + (mg.collisions.length > 6 ? ' 等 ' + mg.collisions.length + ' 个' : ''));
  var p = mg.merged;
  var names = Object.keys(p);
  if (!names.length){ add('error', 'S0', '空 pipeline（或全部解析失败）'); return { errors: E, warnings: W, infos: I }; }

  var taskObj = opts.taskText ? v2ParseAnyJson(opts.taskText) : null;
  if (opts.taskText && !taskObj) add('error', 'T0', 'task JSON 解析失败');
  var ifaceObj = opts.ifaceText ? v2ParseAnyJson(opts.ifaceText) : null;
  if (opts.ifaceText && !ifaceObj) add('error', 'T7', 'interface JSON 解析失败');

  /* 前缀/世界识别 */
  var pfx = opts.prefix || '';
  if (!pfx){
    var ent = names.filter(function(n){ return /Entry$/.test(n); })[0];
    if (ent) pfx = ent.replace(/[^_]*Entry$/, '');
    var best = null, bestN = 0;
    if (typeof WJP_PRESETS !== 'undefined') Object.keys(WJP_PRESETS).forEach(function(k){
      var pr = WJP_PRESETS[k].prefix, c = names.filter(function(n){ return n.indexOf(pr) === 0; }).length;
      if (c > bestN){ bestN = c; best = pr; }
    });
    if (best && bestN > names.length / 3) pfx = best;
  }
  var world = null;
  if (typeof WJP_PRESETS !== 'undefined') Object.keys(WJP_PRESETS).forEach(function(k){
    if (WJP_PRESETS[k].prefix === pfx) world = k;
  });
  add('info', 'V0', '识别：前缀 ' + (pfx || '(无)') + (world ? '（' + WJP_PRESETS[world].label + '，预设节点数 ' + WJP_PRESETS[world].n_nodes + '，实际 ' + names.length + '）' : '（合并 ' + (opts.pipeFiles || []).length + ' 个文件）'));

  /* task override 目标（含 anchor 值） */
  var ovTargets = {};
  if (taskObj){
    Object.keys(taskObj.option || {}).forEach(function(ok){
      ((taskObj.option[ok] || {}).cases || []).forEach(function(c){
        var ov = c.pipeline_override || {};
        Object.keys(ov).forEach(function(k){
          ovTargets[k] = 1;
          var a = ov[k] && ov[k].anchor;
          if (a) Object.keys(a).forEach(function(ak){ ovTargets[a[ak]] = 1; });
        });
      });
    });
  }

  /* S1 断链 */
  names.forEach(function(n){
    v2NxArr(p[n]).forEach(function(x){
      if (!(x in p) && !v2CheckWhitelisted(x)) add('error', 'S1', n + ' → ' + x + '（断链：目标不存在）');
    });
  });
  /* S2 悬空 / S3 孤岛 */
  var incoming = {};
  names.forEach(function(n){
    var d = p[n] || {};
    v2NxArr(d).forEach(function(x){ if (x in p) incoming[x] = (incoming[x] || 0) + 1; });
    v2Anchors(d).forEach(function(x){ if (x in p) incoming[x] = (incoming[x] || 0) + 1; });
  });
  names.forEach(function(n){
    if (!incoming[n] && !/Entry$/.test(n) && !(p[n] && p[n].anchor) && !ovTargets[n])
      add(files.length > 1 ? 'info' : 'warn', 'S2', n + '（无入边且非入口——补丁遗漏、残留节点或仅被 task/agent 引用' + (files.length > 1 ? '；多文件合并图常见于官方跨文件接线' : '') + '）');
  });
  var startN = names.filter(function(n){ return /Entry$/.test(n); });
  if (startN.length){
    var seeds = startN.slice();
    names.forEach(function(n){ if (/配队2d2$|配队1boss$|给豆|狂点|boss_喂豆/.test(n)) seeds.push(n); });
    Object.keys(ovTargets).forEach(function(k){ if (k in p) seeds.push(k); });
    var reach = {}, queue = seeds.slice();
    while (queue.length){
      var cur = queue.pop();
      if (reach[cur]) continue;
      reach[cur] = 1;
      var outs = v2NxArr(p[cur]).slice();
      v2Anchors(p[cur]).forEach(function(x){ outs.push(x); });
      outs.forEach(function(x){ if (x in p && !reach[x]) queue.push(x); });
    }
    names.forEach(function(n){ if (!reach[n]) add(files.length > 1 ? 'info' : 'warn', 'S3', n + '（入口不可达孤岛——残留/断链，或需 agent/task 接线' + (files.length > 1 ? '；多文件合并图常见于官方跨文件接线' : '') + '）'); });
    /* S11 入口必须走到 初始化完毕 */
    var hasInit = startN.some(function(s){ return reach[s] && JSON.stringify(p[s].next || []).indexOf('初始化完毕') > -1; }) ||
                  Object.keys(reach).some(function(n){ return /初始化完毕$/.test(n); });
    if (!hasInit) add('warn', 'S11', '入口未连通「初始化完毕」（锚点初始化链缺失，Swipe 锚点会报 get_rect_from_node）');
  } else add('warn', 'S3', '未找到 *Entry 入口节点');
  /* S4/S5/S6 */
  var incomingLists = {};
  names.forEach(function(n){ v2NxArr(p[n]).forEach(function(x){ if (x in p) (incomingLists[x] = incomingLists[x] || []).push(n); }); });
  names.forEach(function(n){
    var d = p[n] || {};
    if (d.max_hit !== undefined){
      if (/^识别.+位置$/.test(n)) add('info', 'S5', n + ' 带字段（官方「识别卡槽位置」范式，单任务一次定位属有意设计；自建种植链禁用）');
      else add('error', 'S5', n + ' 带字段（跨关累计不重置，禁用）');
    }
    if (d.recognition && d.recognition !== 'DirectHit' && v2NxArr(d).length === 1 && d.timeout !== -1){
      var parents = incomingLists[n] || [];
      var soleParent = parents.length && parents.every(function(pn){ return v2NxArr(p[pn]).length === 1; });
      if (soleParent) add('warn', 'S6', n + '：识别型单候选且父节点无旁路、非 timeout:-1（默认20s超时无回退）');
    }
    if (d.recognition === 'ColorMatch' && v2NxArr(d).length === 1){
      var parents4 = incomingLists[n] || [];
      var sole4 = parents4.length && parents4.every(function(pn){ return v2NxArr(p[pn]).length === 1; });
      if (sole4) add('info', 'S4', n + '：ColorMatch 单候选且父节点无旁路——若是金卡检测，失败将无回退（父节点 next≥2）');
    }
    /* S20 OCR 完整性 */
    if (d.recognition === 'OCR'){
      if (!d.expected) add('warn', 'S20', n + '：OCR 节点缺 expected（永远匹配不上）');
      if (!d.roi) add('info', 'S20', n + '：OCR 节点缺 roi（全屏慢，建议限定区域）');
    }
    /* S21 Swipe 完整性 */
    if (d.action === 'Swipe' && d.begin === undefined && d.begin !== [])
      add('warn', 'S21', n + '：Swipe 缺 begin（拖卡无起点）');
    if (d.action === 'Swipe' && d.end === undefined && !Array.isArray(d.end))
      add('warn', 'S21', n + '：Swipe 缺 end（拖卡无终点；喂豆占位 end=[] 属有意为之，可忽略）');
    /* S22 延时合理性 */
    if ((d.post_delay || 0) > 5000) add('info', 'S22', n + '：post_delay=' + d.post_delay + '（>5s，确认是否有意）');
    if ((d.pre_delay || 0) > 5000) add('info', 'S22', n + '：pre_delay=' + d.pre_delay + '（>5s，确认是否有意）');
    /* S19 识别boss关 色值完整性 */
    if (/识别boss关$/.test(n) && d.recognition === 'ColorMatch' && (!d.lower || !d.upper || !d.roi))
      add('warn', 'S19', n + '：缺 lower/upper/roi（绿宝石色值不完整会分流失败）');
  });
  /* S8 deck2 隔离 BFS */
  var BOUND = /识别结算$|识别开始战斗$|识别boss关$|过渡$/;
  var d2seeds = names.filter(function(n){ return /配队2d2$/.test(n); });
  if (d2seeds.length){
    var reach2 = {}, q2 = d2seeds.slice();
    while (q2.length){
      var c2 = q2.pop();
      if (reach2[c2]) continue;
      reach2[c2] = 1;
      if (BOUND.test(c2)) continue;
      v2NxArr(p[c2]).forEach(function(x){ if (x in p && !reach2[x]) q2.push(x); });
    }
    var bad = Object.keys(reach2).filter(function(n){ return /(^|_)d1_/.test(n) || /点波[12]$/.test(n); });
    if (bad.length) add('error', 'S8', 'deck2 链内可达 deck1 节点：' + bad.slice(0, 5).join(', ') + (bad.length > 5 ? ' 等 ' + bad.length + ' 个' : ''));
  }
  /* S9/S17 点波四元组 */
  names.filter(function(n){ return /点波5_d2$/.test(n); }).forEach(function(n){
    var nx = v2NxArr(p[n]);
    if (nx.length !== 4 || nx[3] !== n || !/识别结算$/.test(nx[0]) || !/识别开始战斗$/.test(nx[1]) || !/识别boss关$/.test(nx[2]))
      add('warn', 'S9', n + '：next 不是 [识别结算,识别开始战斗,识别boss关,自身] 四元组');
  });
  names.filter(function(n){ return /点波5$/.test(n) && !/点波5_d2/.test(n); }).forEach(function(n){
    var nx = v2NxArr(p[n]);
    var lastOk = nx.length === 4 && (nx[3] === n || /点波[15](_d2)?$/.test(nx[3]));
    if (!lastOk || !/识别结算$/.test(nx[0]) || !/识别开始战斗$/.test(nx[1]) || !/识别boss关$/.test(nx[2]))
      add('warn', 'S17', n + '：点波自循环四元组形态异常（' + JSON.stringify(nx) + '）');
  });
  /* S18 点波家族 target 一致性 */
  (function(){
    var tmap = {};
    names.forEach(function(n){
      var d = p[n] || {};
      if (/点波/.test(n) && d.action === 'Click' && Array.isArray(d.target)) tmap[JSON.stringify(d.target)] = (tmap[JSON.stringify(d.target)] || []).concat(n);
    });
    var keys = Object.keys(tmap);
    if (keys.length > 1) add('info', 'S18', '点波家族 target 不一致：' + keys.map(function(k){ return k + '×' + tmap[k].length; }).join(' vs ') + '（复兴/童话统一 [1235,217]）');
  })();
  /* S10 重置到1 */
  names.filter(function(n){ return /重置到1$/.test(n); }).forEach(function(n){
    var nx = v2NxArr(p[n]);
    if (!nx.length || !/初始化完毕$/.test(nx[0]))
      add('error', 'S10', n + ' 必须直连 初始化完毕（跳过入口链，否则被启动时关卡数覆盖错位一关）');
  });
  /* S12/S14 锚点（合并图内校验；单文件时官方锚点走白名单） */
  (function(){
    var used = {};
    names.forEach(function(n){
      var d = p[n] || {};
      ['begin', 'end'].forEach(function(f){
        if (typeof d[f] === 'string' && d[f]) used[d[f]] = n;
      });
    });
    var missing = Object.keys(used).filter(function(a){ return !(a in p) && !v2CheckWhitelisted(a); });
    missing.slice(0, 6).forEach(function(a){ add('warn', 'S12', used[a] + ' 的 ' + a + '（锚点未定义于本图且不在白名单）'); });
    if (missing.length > 6) add('warn', 'S12', '… 共 ' + missing.length + ' 个未定义锚点');
    var hasD2 = names.some(function(n){ return /(^|_)d2_/.test(n) || /配队2d2$/.test(n); });
    if (hasD2){
      var hasSlotStyle = names.some(function(n){ return /^卡槽[1-8]$/.test(n); });
      var missingAlias = [];
      if (hasSlotStyle){
        for (var s = 9; s <= 16; s++) if (!('卡槽' + s in p)) missingAlias.push('卡槽' + s);
      }
      if (hasSlotStyle && missingAlias.length) add('warn', 'S14', '双卡组但缺卡槽9~16 别名节点：' + missingAlias.join(','));
    }
  })();
  /* S13 坐标越界 */
  names.forEach(function(n){
    var d = p[n] || {};
    ['roi', 'target', 'begin', 'end'].forEach(function(f){
      var v = d[f];
      if (Array.isArray(v) && typeof v[0] === 'number' && (v[0] > 1280 || v[1] > 720))
        add('warn', 'S13', n + '.' + f + ' = [' + v.join(',') + '] 越出 720 短边画面（确认坐标系）');
    });
  });
  /* S15 boss 循环喂豆 */
  names.forEach(function(n){
    var d = p[n] || {};
    var nx = v2NxArr(d);
    if (nx.indexOf(n) > -1 && /喂豆/.test(n)){
      if (!/识别结算$/.test(nx[0])) add('error', 'S15', n + '：自循环喂豆 next[0] 必须是 识别结算（靠结算打断）');
      if (d.timeout !== -1) add('warn', 'S15', n + '：自循环喂豆应 timeout:-1');
    }
  });
  /* S16 wujin 回环配套 */
  var hasWujin = names.some(function(n){ return v2NxArr(p[n]).indexOf('wujin_返回') > -1; });
  if (hasWujin && !names.some(function(n){ return /重置到1$/.test(n); }))
    add('warn', 'S16', '过渡含 wujin_返回 但无「重置到1」节点（wujin_确定4 的 override 无处可指）');
  /* V1 节点数 */
  if (world && names.length !== WJP_PRESETS[world].n_nodes)
    add('warn', 'V1', '节点数 ' + names.length + ' ≠ 预设画像 ' + WJP_PRESETS[world].n_nodes + '（合并图/补丁后属正常）');
  /* T1~T6 */
  if (taskObj){
    var opts2 = (taskObj.option) || {};
    var inputTargets = {};
    Object.keys(opts2).forEach(function(ok){
      var o = opts2[ok] || {};
      (o.cases || []).forEach(function(c){
        var ov = c.pipeline_override || {};
        Object.keys(ov).forEach(function(k){
          if (!(k in p) && !v2CheckWhitelisted(k) && !(k in ovTargets)) add('error', 'T1', '选项「' + ok + '」override 节点 ' + k + ' 不在 pipeline 中');
          if (o.type === 'input'){
            inputTargets[k] = (inputTargets[k] || 0) + 1;
            if (inputTargets[k] > 1) add('error', 'T2', '多个 input 选项覆盖同一 custom 节点 ' + k + '（未填的会用空值污染已填的）');
          }
        });
      });
      (o.inputs || []).forEach(function(inp){
        var rx = inp.verify || '';
        if (/\[\d+-\d{2,}\]/.test(rx)) add('error', 'T3', '选项「' + ok + '」verify 正则踩字符类陷阱：' + rx);
      });
      if (o.type === 'select' && !o.default_case && (o.cases || []).length) add('info', 'T6', '选项「' + ok + '」select 无 default_case');
    });
  }
  /* T4/T5 agent 参数 */
  names.forEach(function(n){
    var cap = (p[n] || {}).custom_action_param;
    if (!cap) return;
    var s = String(cap);
    if (/^\{\\"/.test(s)) add('info', 'T4', n + '：custom_action_param 已是双层编码形态，agent 端需解两层');
    var obj = null;
    try{
      obj = JSON.parse(s);
      if (typeof obj === 'string') obj = JSON.parse(obj);
    }catch(e){ add('warn', 'T4', n + '：custom_action_param 非法 JSON：' + s.slice(0, 60)); return; }
    if (obj && typeof obj === 'object'){
      Object.keys(obj).forEach(function(k){
        if (V2_AGENT_KEYS.indexOf(k) === -1) add('warn', 'T5', n + '：agent 参数 ' + k + ' 不在已知白名单（agent 未读取则无效）');
      });
    }
  });
  /* T7 interface.json */
  if (ifaceObj){
    var resArr = ifaceObj.resource || [];
    var selfRes = resArr.filter(function(r){ return JSON.stringify(r.path || []).indexOf('resource_self') > -1; });
    if (!selfRes.length) add('warn', 'T7', 'interface.resource 无 resource_self 条目（自制资源未挂载）');
    var imports = ifaceObj.import || [];
    var selfImports = imports.filter(function(x){ return String(x).indexOf('resource_self') > -1; });
    add('info', 'T7', 'interface：import 自制 task ' + selfImports.length + ' 个（' + selfImports.slice(0, 3).join(', ') + '）');
    /* agent 块在官方 interface.json 里是对象；兼容数组写法 */
    var agent = ifaceObj.agent;
    var a0 = Array.isArray(agent) ? (agent[0] || {}) : (agent || {});
    if (!a0 || (!a0.child_exec && !a0.identifier)) add('warn', 'T7', 'interface.agent 块缺失（双卡组计数/监控不可用）');
    else if (!a0.child_exec || !a0.child_args || !a0.identifier) add('warn', 'T7', 'interface.agent 缺 child_exec/child_args/identifier');
    else add('info', 'T7', 'interface.agent：' + a0.identifier + ' ← ' + (a0.child_args || []).join(' '));
    var selfTasks = (ifaceObj.task || []).filter(function(t){ return (t.resource || []).indexOf('自制无尽') > -1; });
    add('info', 'T7', 'interface.task：自制无尽任务 ' + selfTasks.length + ' 个');
  }
  return { errors: E, warnings: W, infos: I, prefix: pfx, world: world, merged: p };
}

/* 兼容旧签名 */
function v2RunChecks(rawPipeline, rawTask, prefixHint){
  return v2RunChecksEx({ pipeText: rawPipeline, taskText: rawTask, prefix: prefixHint });
}

/* ---- 面板绑定（v0.2：多文件 + site/interface/日志） ---- */
function v2BindChecks(){
  function bindMulti(id, storeKey, nameId){
    var fin = document.getElementById(id);
    if (!fin) return;
    fin.addEventListener('change', function(){
      var fs = fin.files || [];
      var arr = [];
      var remaining = fs.length;
      if (!remaining){ window[storeKey] = []; return; }
      for (var i = 0; i < fs.length; i++){
        (function(f){
          var rd = new FileReader();
          rd.onload = function(){
            arr.push({ name: f.name, text: rd.result });
            remaining--;
            if (!remaining){
              window[storeKey] = arr;
              var el = document.getElementById(nameId);
              if (el) el.textContent = fs.length === 1 ? fs[0].name : fs.length + ' 个文件';
              if (storeKey === '__v2PipeFiles' || storeKey === '__v2TaskText') v2ChecksGo();
            }
          };
          rd.readAsText(f, 'utf-8');
        })(fs[i]);
      }
    });
  }
  bindMulti('chkPipe', '__v2PipeFiles', 'chkPipeName');
  bindMulti('chkTask', '__v2TaskText', 'chkTaskName');
  bindMulti('chkIface', '__v2IfaceText', 'chkIfaceName');
  bindMulti('chkLogAgent', '__v2LogAgent', 'chkLogAgentName');
  bindMulti('chkLogMaafw', '__v2LogMaafw', 'chkLogMaafwName');
  var pre = document.getElementById('chkPrefix');
  if (pre) pre.addEventListener('change', v2ChecksGo);
  var go = document.getElementById('chkGo');
  if (go) go.addEventListener('click', function(){
    if (!window.__v2PipeFiles || !window.__v2PipeFiles.length){ showToast('请先选择 pipeline JSON'); return; }
    v2ChecksGo();
  });
}
function v2ChecksGo(){
  if (!window.__v2PipeFiles || !window.__v2PipeFiles.length) return;
  var r = v2RunChecksEx({
    pipeFiles: window.__v2PipeFiles,
    taskText: (window.__v2TaskText && window.__v2TaskText[0]) ? window.__v2TaskText[0].text : '',
    ifaceText: (window.__v2IfaceText && window.__v2IfaceText[0]) ? window.__v2IfaceText[0].text : '',
    prefix: (document.getElementById('chkPrefix').value || '').trim()
  });
  var lines = ['== 静态检查 ==', '错误 ' + r.errors.length + ' / 警告 ' + r.warnings.length + ' / 提示 ' + r.infos.length];
  lines = lines.concat(r.infos, r.warnings, r.errors);
  if (window.__v2PipeFiles.length >= 2){
    lines.push('', '== V3 双文件 diff（第1个 vs 第2个） ==');
    v2DiffPipelines(v2ParseAnyJson(window.__v2PipeFiles[0].text), v2ParseAnyJson(window.__v2PipeFiles[1].text)).forEach(function(x){ lines.push(x); });
  }
  lines.push('', '== 日志时间线 ==');
  lines.push(v2LogReport(window.__v2LogAgent || [], window.__v2LogMaafw || []));
  document.getElementById('chkReport').value = lines.join('\n');
  showToast('检查完成：✗' + r.errors.length + ' ⚠' + r.warnings.length);
}
