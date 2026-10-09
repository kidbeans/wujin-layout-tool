/* ================= v2 世界预设：一键载入四套成品画像 ================= */
"use strict";

function v2ApplyPreset(key){
  var P = (typeof WJP_PRESETS !== 'undefined') && WJP_PRESETS[key];
  if (!P){ showToast('预设不存在：' + key); return; }
  if (!confirm('载入「' + P.label + '」预设将覆盖：棋盘/卡槽/遍历顺序/路由/Boss 链（可 Ctrl+Z 撤销）。继续？')) return;
  /* 棋盘 */
  var res = parseImport(P.board.compact);
  if (res){ cols = res.cols; rows = res.rows; grid = res.grid; }
  else { showToast('预设棋盘解析失败'); return; }
  /* 卡槽 */
  slotNames = (P.slots.deck1 || []).concat(P.slots.deck2 || []).slice(0, 16);
  while (slotNames.length < 16) slotNames.push('');
  subSlotsOn = (P.slots.deck2 || []).length > 0;
  /* 植物库补齐（保证可编辑） */
  slotNames.forEach(function(n){
    if (!n) return;
    if (['大哥','洋芋','桑葚','药师','气流水仙花','珊瑚','能量花','芦荟','心叶兰','水仙花','杜英','暗豌','冰西瓜投手',
         '茄子忍者','军炮','豌豆迫击炮','小黄梨','魔音','甜菜','橄榄坑','金蝉花','食人花豌豆','冰刺','白萝卜','钢地刺',
         '苹果迫击炮','斯巴达竹','喇叭花','弹簧豆','电离红掌花','吹风荚兰','潜伏芹菜','全息坚果','天使星星果',
         '蜜蜂铃兰','火鸡投手','塔黄','曼德拉','牛蒡','毁灭菇','蛇草','球果','鸭梨大弟','电鳗香蕉','大守卫菇',
         '太极木槿','地锯草','祥云飞莲','胆小菇','阳光蓓蕾','瓷砖萝卜','冰瓜','聚能山竹','火豌豆','原豌',
         '毒豌','电豌','凤凰木花车'].indexOf(n) === -1) ensurePlant('base', n);
  });
  ['原豌','电豌','火豌','冰豌','毒豌'].forEach(function(n){ ensurePlant('merge', n); });
  ['毒藤','南瓜头','豆藤','小守卫菇'].forEach(function(n){ ensurePlant('vine', n); });
  /* v2 状态 */
  V2 = v2Clone(v2Default());
  V2.world = key;
  V2.prefix = P.prefix;
  var pf = document.getElementById('v2Prefix');
  if (pf){ pf.value = V2.prefix; delete pf.dataset.touched; }
  V2.order = v2Clone(P.order || { deck1: [], deck2: [] });
  var rp = v2Clone(P.route || {});
  var defp = v2Default().route.params;
  V2.route.params = v2DeepMerge(v2Clone(defp), rp);
  /* 预设 route.params 里携带的尾数表/跳切键映射回 UI 字段（2026-10-09 v4.0.9：
     d2_tails/boss_tails 属 tail 面板、skip_same_deck 属 fast_mode，导出只认这两处） */
  var rp2 = V2.route.params;
  if (rp2.d2_tails){ V2.route.tail.d2 = rp2.d2_tails; delete rp2.d2_tails; }
  if (rp2.boss_tails){ V2.route.tail.boss = rp2.boss_tails; delete rp2.boss_tails; }
  if (rp2.skip_same_deck){ rp2.fast_mode = 1; delete rp2.skip_same_deck; }
  V2.route.mode = P.routeMode || ((P.slots.deck2 || []).length ? 'tail' : 'none');
  if (V2.route.mode === 'phase' && P.routePhase) V2.route.phase = v2Clone(P.routePhase);
  V2.boss.ops = v2Clone((P.boss && P.boss.ops) || []);
  V2.boss.feedSelect = !!(P.boss && P.boss.feedSelect);
  V2.boss.feedCell = (P.boss && P.boss.feedCell) || '2-3';
  /* 小关抛花（西部/埃及/功夫/龙芋/纯火龙v2 等带 抛花N 节点的脚本）：预设携带时还原，
     否则载入预设后导出的 task 丢「小关是否抛花」开关（2026-09-13，预设生成器同步提取 throw） */
  if (P.throw && P.throw.on) V2.throw = v2Clone(P.throw);
  V2.debugCardUI = true;
  save();
  buildAllChips(); renderSlots(); renderGrid(); updateStatus();
  document.getElementById('btnSubSlots').textContent = '配队2：' + (subSlotsOn ? '开' : '关');
  document.getElementById('btnSubSlots').classList.toggle('on', subSlotsOn);
  if (typeof v2RefreshPanels === 'function') v2RefreshPanels();
  showToast('已载入预设：' + P.label + '（' + P.n_nodes + ' 节点成品画像）');
}

function v2RenderPresets(){
  var box = document.getElementById('presetList');
  if (!box) return;
  var html = '';
  Object.keys(typeof WJP_PRESETS !== 'undefined' ? WJP_PRESETS : {}).forEach(function(k){
    var P = WJP_PRESETS[k];
    var modeTxt = { tail: '尾数', phase: '相位', none: '无计数' }[P.routeMode || ((P.slots.deck2 || []).length ? 'tail' : 'none')] || '尾数';
    var farmN = (P.order.farm || []).length;
    html += '<div class="v2card"><div class="v2card-h"><b>' + P.label + '</b><span class="v2muted">' + P.entry +
      ' · ' + P.n_nodes + ' 节点</span></div>' +
      '<div class="v2muted">顺序 deck1 ' + (P.order.deck1 || []).length + ' 步 / deck2 ' + (P.order.deck2 || []).length +
      ' 步' + (farmN ? ' / farm ' + farmN + ' 步' : '') + ' · 路由 ' + modeTxt +
      ' · Boss ' + ((P.boss && P.boss.ops) || []).length + ' 步</div>' +
      '<button class="primary" data-preset="' + k + '">载入该预设</button></div>';
  });
  box.innerHTML = html;
  var fi = document.getElementById('offFrameImport');
  if (fi) fi.addEventListener('click', function(){ if (typeof v2FrameImportPick === 'function') v2FrameImportPick(); });
  var fe = document.getElementById('offFrameExport');
  if (fe) fe.addEventListener('click', function(){
    if (typeof v2ExportFrameJSON !== 'function'){ showToast('通用框架模块未加载'); return; }
    var lv = prompt('前期转后期：第几关布好阵？（1~149，非5的倍数）', '30');
    if (lv === null) return;
    var sec = prompt('前期 Boss关喂豆间隔（秒，1~10）', '3');
    if (sec === null) return;
    var json = v2ExportFrameJSON(parseInt(lv, 10) || 30, parseInt(sec, 10) || 3);
    if (!json) return;
    var text = JSON.stringify(json, null, 1);
    v2Download('通用框架_自定义布阵.json', text);
    var outBox = document.getElementById('v2Out');
    if (outBox) outBox.value = text;
    showToast('已导出官方通用框架单 JSON');
  });
}

function v2BindPresets(){
  var box = document.getElementById('presetList');
  if (!box) return;
  box.addEventListener('click', function(e){
    var b = e.target.closest('button[data-preset]');
    if (b) v2ApplyPreset(b.dataset.preset);
  });
}

/* ---- 官方无尽任务画像（只读） ---- */
function v2RenderOfficial(){
  var box = document.getElementById('officialList');
  if (!box) return;
  if (typeof WJP_OFFICIAL === 'undefined' || !WJP_OFFICIAL){
    box.innerHTML = '<div class="v2hint">（31_official_data.js 未生成：python tools/gen_official.py）</div>';
    return;
  }
  var esc = function(s){ return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var html = '';
  html += '<div class="v2hint">入口 <b>' + esc(WJP_OFFICIAL.entry || '无尽挑战_前置检查') + '</b> · 模式 ' +
    (WJP_OFFICIAL.modes || []).join('/') + ' · 世界 ' + (WJP_OFFICIAL.worlds || []).length + ' 个：' +
    esc((WJP_OFFICIAL.worlds || []).slice(0, 8).join('、')) + ((WJP_OFFICIAL.worlds || []).length > 8 ? '…' : '') + '</div>';
  (WJP_OFFICIAL.presets || []).forEach(function(p){
    html += '<div class="v2card"><div class="v2card-h"><b>[' + esc(p.label) + ']</b><span class="v2muted">选项 ' + p.options.length + ' 个</span></div>' +
      '<div class="v2muted">task: ' + esc((p.taskFiles || []).join(', ')) + '</div>' +
      '<div class="v2muted" style="margin-top:4px;">' + p.options.map(function(o){
        return esc(o.name) + '(' + (o.type || '?') + (o.inputs ? ':' + esc(o.inputs.join('/')) : '') + (o.cases ? ':' + esc(o.cases.slice(0, 3).join('/')) : '') + ')';
      }).join('；') + '</div></div>';
  });
  var plant = (WJP_OFFICIAL.plantConfig || []).map(function(c){ return esc(c.name) + '（' + esc((c.subOptions || []).length) + ' 子选项）'; }).join(' / ');
  html += '<div class="v2card"><div class="v2card-h"><b>植物配置（预设三选一）</b></div><div class="v2muted">' + plant + '</div></div>';
  var fo = WJP_OFFICIAL.framework && WJP_OFFICIAL.framework.options || [];
  var byFile = {};
  fo.forEach(function(o){ (byFile[o.file] = byFile[o.file] || []).push(o); });
  html += '<div class="v2card"><div class="v2card-h"><b>通用框架（custom 前期 + fw 后期）</b><span class="v2muted">选项 ' + fo.length + ' 个</span></div>' +
    '<div class="v2row"><button id="offFrameImport" class="primary">📥 导入布阵（选项集 JSON）</button>' +
    '<button id="offFrameExport">📤 画布 → 通用框架单 JSON</button>' +
    '<span class="v2muted">本画布即该框架的可视化编辑器等价物：布阵后导出给 MaaPvz「导入 JSON」</span></div>' +
    '<input type="file" id="offFrameFile" accept=".json,.jsonc,.txt" style="display:none">';
  Object.keys(byFile).forEach(function(f){
    html += '<div class="v2muted" style="margin-top:4px;"><b>' + esc(f.replace('task/Endless/framework/', '')) + '</b>（' + byFile[f].length + '）: ' +
      byFile[f].map(function(o){ return esc(o.name); }).join('、') + '</div>';
  });
  html += '</div>';
  var ps = WJP_OFFICIAL.pipelineSummary || [];
  html += '<div class="v2card"><div class="v2card-h"><b>官方 pipeline 概览</b><span class="v2muted">' + ps.length + ' 个文件</span></div>' +
    '<div class="v2muted">' + ps.map(function(x){
      return esc(x.file.replace('pipeline/Endless/', '')) + '（' + (x.nodes || '?') + ' 节点' + (x.worldBranches ? '，世界分支×' + x.worldBranches.length : '') + (x.error ? '，解析失败' : '') + '）';
    }).join('<br>') + '</div></div>';
  box.innerHTML = html;
  var fi = document.getElementById('offFrameImport');
  if (fi) fi.addEventListener('click', function(){ if (typeof v2FrameImportPick === 'function') v2FrameImportPick(); });
  var fe = document.getElementById('offFrameExport');
  if (fe) fe.addEventListener('click', function(){
    if (typeof v2ExportFrameJSON !== 'function'){ showToast('通用框架模块未加载'); return; }
    var lv = prompt('前期转后期：第几关布好阵？（1~149，非5的倍数）', '30');
    if (lv === null) return;
    var sec = prompt('前期 Boss关喂豆间隔（秒，1~10）', '3');
    if (sec === null) return;
    var json = v2ExportFrameJSON(parseInt(lv, 10) || 30, parseInt(sec, 10) || 3);
    if (!json) return;
    var text = JSON.stringify(json, null, 1);
    v2Download('通用框架_自定义布阵.json', text);
    var outBox = document.getElementById('v2Out');
    if (outBox) outBox.value = text;
    showToast('已导出官方通用框架单 JSON');
  });
}
