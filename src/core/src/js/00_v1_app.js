

"use strict";

/* ============ 植物库预设（提取自 pvz2挂机阵攻略_修订版.md + 玩家修正，可右键删除/添加/恢复默认） ============ */
const DEFAULT_BASE = {
  core: ["大哥","洋芋","桑葚","药师","气流水仙花","珊瑚","暗物质火龙果"],
  support: ["能量花","芦荟","心叶兰","水仙花","杜英","暗豌","冰西瓜投手","仙桃"],
  boss: ["茄子忍者","军炮","豌豆迫击炮","小黄梨","魔音","甜菜"],
  world: ["橄榄坑","金蝉花","食人花豌豆","冰刺","白萝卜","钢地刺",
          "苹果迫击炮","斯巴达竹","喇叭花","弹簧豆","电离红掌花","吹风荚兰","潜伏芹菜",
          "全息坚果","天使星星果","蜜蜂铃兰","火鸡投手","磁力菇"],
  speed: ["塔黄","曼德拉","牛蒡","毁灭菇","蛇草","球果","鸭梨大弟","电鳗香蕉",
          "大守卫菇","太极木槿","地锯草","祥云飞莲"]
};
const DEFAULT_VINE = ["毒藤","南瓜头","豆藤","小守卫菇"];   /* 叠在主植物上 */
const DEFAULT_MERGE = ["原豌","电豌","火豌","冰豌","毒豌"];  /* 叠在大哥上：原大/电大/火大/冰大/毒大 */

let cols = 9, rows = 5;
let grid = [];        // rows x cols，元素 {base, merge, vine, tile}
let slotNames = Array(16).fill('');   /* 主卡槽1~8 + 副卡槽9~16（留空不导出） */
let subSlotsOn = false;               /* 配队2开关（原副卡槽） */
let fxOn = true;                      /* 特效总开关：关闭后仅保留瓷砖/芦荟提示性特效 */
let splitOn = false;                  /* 分阵型模式开关 */
let splitView = 'main';               /* 当前棋盘视图：main|early|late */
let split = {early:null, late:null};  /* 分棋盘格数据（未开启/未复制时为 null） */
const OPS = [['抛花','抛花'],['抛蕾','抛蕾'],['喂豆','喂豆'],['铲除','铲除'],['delay','delay']];
let plants = null;    // {base:{core,support,boss,world,speed}, vine:[], merge:[]}
let selected = null;  // 种植画笔（brush）：null=空白(点击格子=复制)；{t:'plant',kind,name} / {t:'clear'} / {t:'remove',layer} / {t:'paste',cell} / {t:'tile'} / {t:'removetile'}
let dragSrc = null;   // 拖拽源 {kind, r, c, name}

function defaultPlants(){
  return {
    base:{core:DEFAULT_BASE.core.slice(), support:DEFAULT_BASE.support.slice(), boss:DEFAULT_BASE.boss.slice(),
          world:DEFAULT_BASE.world.slice(), speed:DEFAULT_BASE.speed.slice()},
    vine:DEFAULT_VINE.slice(),
    merge:DEFAULT_MERGE.slice()
  };
}

const gridEl = document.getElementById('grid');
const slotList = document.getElementById('slotList');
const out = document.getElementById('out');

/* ============ 数据存取 ============ */
const KEY = 'wujin_layout_v3';
function save(){
  try{ localStorage.setItem(KEY, JSON.stringify({cols, rows, grid, slotNames, plants, subSlotsOn, fxOn, splitOn, split})); }catch(e){}
}
function load(){
  try{
    const d = JSON.parse(localStorage.getItem(KEY));
    if(!d) return false;
    cols = d.cols||9; rows = d.rows||5;
    grid = d.grid; slotNames = d.slotNames||Array(8).fill('');
    if(slotNames.length<16) slotNames=slotNames.concat(Array(16-slotNames.length).fill(''));  /* 兼容旧存档补副卡槽 */
    subSlotsOn = !!d.subSlotsOn;
    fxOn = d.fxOn !== false;   /* 默认开 */
    splitOn = !!d.splitOn;
    split = d.split || {early:null, late:null};
    if(d.plants){
      const p=d.plants;
      if(Array.isArray(p.base)){
        /* 兼容旧版：base 是数组 → 归入挂机核心 */
        plants={base:{core:(p.base||[]).slice(), support:[], boss:[], world:[], speed:[]}, vine:p.vine||[], merge:p.merge||[]};
      }else{
        plants={base:{core:p.base.core||[], support:p.base.support||[], boss:p.base.boss||[],
                      world:p.base.world||[], speed:p.base.speed||[]}, vine:p.vine||[], merge:p.merge||[]};
      }
    }else{
      const c = d.custom || {};
      plants = defaultPlants();
      ['base','vine','merge'].forEach(function(k){
        (c[k]||[]).forEach(function(n){
          if(k==='base'){ if(plants.base.core.indexOf(n)===-1) plants.base.core.push(n); }
          else if(plants[k].indexOf(n)===-1) plants[k].push(n);
        });
      });
    }
    grid = grid.map(function(row){
      return row.map(function(c){
        if(typeof c === 'string') return {base:c, merge:'', vine:'', tile:false, ops:[]};
        if(c.tile===undefined) c.tile=false;
        if(c.ops===undefined) c.ops=[];
        return c;
      });
    });
    ['early','late'].forEach(function(k){
      if(split[k]){
        split[k]=split[k].map(function(row){
          return row.map(function(c){
            if(typeof c==='string') return {base:c,merge:'',vine:'',tile:false,ops:[]};
            if(c.ops===undefined) c.ops=[];
            if(c.tile===undefined) c.tile=false;
            return c;
          });
        });
      }
    });
    document.getElementById('colN').value = cols;
    document.getElementById('rowN').value = rows;
    return true;
  }catch(e){ return false; }
}

/* ============ 格子模型（分棋盘：主棋盘 grid + 分棋盘 split.early/late） ============ */
function blankGrid(){
  const g=[];
  for(let r=0;r<rows;r++){ const row=[]; for(let c=0;c<cols;c++) row.push({base:'',merge:'',vine:'',tile:false,ops:[]}); g.push(row); }
  return g;
}
/* 当前视图的棋盘数组（early/late 首次访问自动建空白棋盘） */
function curGrid(){
  if(splitOn && (splitView==='early'||splitView==='late')){
    if(!split[splitView]) split[splitView]=blankGrid();
    return split[splitView];
  }
  return grid;
}
function deepCopyBoard(src){ return src.map(function(row){ return row.map(function(c){ return {base:c.base,merge:c.merge,vine:c.vine,tile:!!c.tile,ops:c.ops?c.ops.slice():[]}; }); }); }
function getCell(r,c){ const g=curGrid(); return g[r][c] || (g[r][c] = {base:'', merge:'', vine:'', tile:false, ops:[]}); }
function setBase(r,c,name){
  const cell = getCell(r,c);
  cell.base = name;
  if(name !== '大哥') cell.merge = '';
  save();
}
function setVine(r,c,name){ getCell(r,c).vine = name; save(); }
function setMerge(r,c,name){
  const cell = getCell(r,c);
  if(cell.base !== '大哥'){ showToast('融合只能叠在“大哥”上'); return; }
  cell.merge = name; save();
}
function clearCell(r,c){ curGrid()[r][c] = {base:'', merge:'', vine:'', tile:false, ops:[]}; save(); }
function setTile(r,c){ getCell(r,c).tile = true; save(); }
function clearTile(r,c){ getCell(r,c).tile = false; save(); }
/* 格子动作链文本（+抛花+喂豆+delay500+铲除+心叶兰） */
function cellOpsChain(cell){
  if(!cell || !cell.ops || !cell.ops.length) return '';
  return '+' + cell.ops.join('+');
}
/* 导出/紧凑格式用完整文本：大哥+电豌(南瓜头)（棋盘显示简写见 cellDisplayText）；含动作链 */
function cellText(cell){
  if(!cell) return '-';
  let s = cell.base || '';
  if(cell.merge) s += '+' + cell.merge;   /* 融合一律展开：大哥+电豌 / 珊瑚+电豌 */
  if(cell.vine) s += '(' + cell.vine + ')';
  return s || '-';
}
/* 含动作链的完整导出文本 */
function cellTextFull(cell){
  return cellText(cell) + cellOpsChain(cell);
}
/* 棋盘显示文本：融合大哥简写为 X大（不影响导出） */
function cellDisplayText(cell){
  if(!cell) return '-';
  let s = cell.base || '';
  if(cell.base==='大哥' && cell.merge){
    if(cell.merge==='电豌') s = '点。大哥';          /* 电大 → 点。大哥 */
    else s = cell.merge.charAt(0) + '大';
  }
  else if(cell.merge) s += '+' + cell.merge;
  if(cell.vine) s += '(' + cell.vine + ')';
  s += cellOpsChain(cell);
  return s || '-';
}

/* 悬浮提示：只留「棋盘显示名 · 品质」。名称与棋盘一致（原大/点。大哥/桑葚(毒藤)…）；
   品质：融合大哥(x大)一律橙色(金卡)，其余取图鉴 rar；无品质数据时只显示名称 */
function cellTipText(cell){
  if(!cell || !cell.base) return '';
  const PM = window.PLANT_META || {};
  let name, rar;
  if(cell.base==='大哥' && cell.merge){
    name = (cell.merge==='电豌') ? '点。大哥' : cell.merge.charAt(0) + '大';
    rar = '橙色';
  } else {
    name = cell.base + (cell.merge ? '+' + cell.merge : '') + (cell.vine ? '(' + cell.vine + ')' : '');
    const mt = PM[cell.base];
    rar = mt && mt.rar;
  }
  return rar ? (name + ' · ' + rar) : name;
}

/* 图鉴头像（05_plant_icons.js 数据）：返回格子应展示的图标植物名，无图标返回 null */
function cellAvaName(cell){
  if(!cell || !cell.base) return null;
  const PI = window.PLANT_ICON || {}, PF = window.PLANT_FUSION || {};
  if(cell.base==='大哥' && cell.merge){
    if(PF[cell.merge] || PF[cell.merge.charAt(0) + '大'] || PI[cell.merge]) return cell.merge;
    return null;
  }
  return PI[cell.base] ? cell.base : null;
}
function cellAvaURL(cell){
  const nm = cellAvaName(cell);
  if(!nm) return null;
  const PF = window.PLANT_FUSION || {}, PI = window.PLANT_ICON || {};
  if(cell.base==='大哥' && cell.merge) return PF[nm] || PF[nm.charAt(0) + '大'] || PI[nm] || null;
  return PI[nm] || null;
}
function cellVineIcon(cell){
  if(!cell || !cell.vine) return null;
  const PI = window.PLANT_ICON || {};
  return PI[cell.vine] ? cell.vine : null;
}
/* 特殊植物特效：返回格子应挂的 eff-* 类名（fxOn 关闭时全部不挂，仅保留瓷砖/芦荟提示） */
function cellEffectClass(cell){
  if(!cell) return '';
  if(!fxOn) return '';
  const cls=[];
  /* 毒藤叠桑葚/药师 → 紫烟缭绕 */
  if(cell.vine==='毒藤' && (cell.base==='桑葚'||cell.base==='药师')) cls.push('eff-vine');
  /* 融合大哥 → 专属特效（含旧别名兼容；无特效的如原大 → 加粗） */
  if(cell.base==='大哥' && cell.merge){
    const map={'电豌':'eff-dian','火豌':'eff-huo','冰豌':'eff-bing','毒豌':'eff-du',
               '冰豆':'eff-bing','火焰植物':'eff-huo'};
    if(map[cell.merge]) cls.push(map[cell.merge]);
    else cls.push('eff-yuan');
  }
  /* 鸭梨大弟 → 雷霆水流 */
  if(cell.base==='鸭梨大弟') cls.push('eff-yali');
  /* 图鉴属性兜底：无专属特效的植物按图鉴属性上色（火焰/寒冰/剧毒/电能/魔法） */
  if(!cls.length){
    const m0=(window.PLANT_META||{})[cell.base];
    if(m0 && m0.attr && m0.attr.length) cls.push('effa-'+m0.attr[0]);
  }
  return cls.join(' ');
}
/* 芦荟 3×3 buff：格子是否处于任意芦荟的 3×3 范围内（当前视图棋盘） */
function inAloeRange(r,c){
  const g=curGrid();
  for(let dr=-1;dr<=1;dr++){
    for(let dc=-1;dc<=1;dc++){
      const rr=r+dr, cc=c+dc;
      if(rr<0||rr>=rows||cc<0||cc>=cols) continue;
      const cell=g[rr][cc];
      if(cell && cell.base==='芦荟') return true;
    }
  }
  return false;
}
/* 导出用文本：含瓷砖标记（[瓷] 后缀；纯瓷砖格为「瓷」）+ 动作链 */
function cellExportText(cell){
  const t = cellTextFull(cell);
  if(!cell || !cell.tile) return t;
  return t === '-' ? '瓷' : t + '[瓷]';
}
function applyToCell(kind, name, r, c){
  const cell = getCell(r,c);
  if(kind==='base') setBase(r,c,name);
  else if(kind==='vine'){
    if(!cell.base){ showToast('请先种主植物，再把藤蔓叠上去'); return; }
    setVine(r,c,name);
  }
  else if(kind==='merge'){
    if(!cell.base || cell.base!=='大哥'){ showToast('融合只能叠在“大哥”上'); return; }
    setMerge(r,c,name);
  }
}
/* 种植画笔：点击格子时的统一处理 */
function applyBrush(r,c){
  const cg=curGrid();
  if(!selected){
    /* 空白画笔 = 复制模式：复制该格组合进画笔，点击空白等效空白 */
    const src = cg[r][c] || {base:'', merge:'', vine:'', ops:[]};
    if(src.base || src.merge || src.vine || (src.ops&&src.ops.length)){
      selected = {t:'paste', cell:{base:src.base, merge:src.merge, vine:src.vine, ops:(src.ops||[]).slice()}};
      showToast('已复制：'+cellTextFull(src)+'，点击其他格连续粘贴');
    }else{
      showToast('该格为空白');
    }
    updateStatus(); return;
  }
  if(selected.t==='plant'){
    const cell=getCell(r,c);
    /* 该格已执行过「铲除」→ 新种植作为动作追加到链尾，不覆盖原链（本格最后=最后种下的植物） */
    if(selected.kind==='base' && cell.ops && cell.ops.indexOf('铲除')>-1){
      if(!cell.ops) cell.ops=[];
      cell.ops.push(selected.name);
      save();
    }else{
      applyToCell(selected.kind, selected.name, r, c);
    }
  }
  else if(selected.t==='clear'){ clearCell(r,c); }
  else if(selected.t==='remove'){
    const cell=getCell(r,c);
    if(selected.layer==='vine') cell.vine=''; else cell.merge='';
    save();
  }
  else if(selected.t==='paste'){
    cg[r][c] = {base:selected.cell.base, merge:selected.cell.merge, vine:selected.cell.vine,
                tile:false, ops:(selected.cell.ops||[]).slice()};
    save();
  }
  else if(selected.t==='tile'){ setTile(r,c); }
  else if(selected.t==='removetile'){ clearTile(r,c); }
  else if(selected.t==='op'){
    const cell=getCell(r,c);
    if(cell.base || (cell.ops&&cell.ops.length)){
      if(!cell.ops) cell.ops=[];
      if(selected.opName==='delay'){
        const t=parseInt(document.getElementById('opsCount').value)||0;
        if(t>0) cell.ops.push('delay'+t);            /* delay 用时间框数值 */
        else showToast('delay 需填写时间(ms)');
      }else{
        cell.ops.push(selected.opName);              /* 其余动作固定追加一次 */
      }
      save();
    }else{
      showToast('空格跳过动作（先种主植物）');
    }
  }
}
/* 种植预览状态栏 */
function updateStatus(){
  const el=document.getElementById('status');
  if(!el) return;
  if(!selected) el.textContent='🧭 空白画笔：点击格子=复制该格组合（再点其他格连续粘贴）；点植物卡开始种植';
  else if(selected.t==='plant'){
    const kt = selected.kind==='base' ? '种植' : selected.kind==='vine' ? '叠种藤蔓' : '融合';
    const rule = selected.kind==='vine' ? '（需主植物）' : selected.kind==='merge' ? '（仅叠大哥）' : '';
    el.textContent='🧭 种植预览：'+kt+'「'+selected.name+'」'+rule;
  }
  else if(selected.t==='clear') el.textContent='🧭 种植预览：清空整格（点击格子整格清空）';
  else if(selected.t==='remove') el.textContent='🧭 种植预览：移除'+(selected.layer==='vine'?'藤蔓':'融合')+'（保留主植物）';
  else if(selected.t==='paste') el.textContent='🧭 种植预览：粘贴「'+cellText(selected.cell)+'」（点击其他格连续粘贴）';
  else if(selected.t==='tile') el.textContent='🧭 种植预览：放置瓷砖（紫色+白色同心圆，不影响该格植物，不可复制）';
  else if(selected.t==='removetile') el.textContent='🧭 种植预览：移除瓷砖（保留该格植物）';
  else if(selected.t==='op'){
    const t=parseInt(document.getElementById('opsCount').value)||0;
    el.textContent= selected.opName==='delay'
      ? '🧭 种植预览：delay '+(t>0?t+'ms':'（需填写时间）')
      : '🧭 种植预览：动作「'+selected.opName+'」（固定追加一次，时间框仅对 delay 生效）';
  }
}
function swapColumns(c1,c2){
  if(c1===c2) return;
  for(let r=0;r<rows;r++){ const t=grid[r][c1]; grid[r][c1]=grid[r][c2]; grid[r][c2]=t; }
  save(); renderGrid();
}
function swapRows(r1,r2){
  if(r1===r2) return;
  const t=grid[r1]; grid[r1]=grid[r2]; grid[r2]=t;
  save(); renderGrid();
}

/* ============ 棋盘（含列头/行号） ============
 * 2026-09-14 审查重构：渲染只建元素（写 dataset/class），事件统一由容器级委托处理
 * （见下方 v1BindGridDelegation）。原实现每次渲染对 45 格×7 + 列/行头逐个 addEventListener
 * （≈315+ 监听器/次），重构后每渲染 0 监听器。行为逐项对齐原实现。 */
function renderGrid(){
  gridEl.style.gridTemplateColumns = 'var(--rlabel) repeat('+cols+', var(--cell))';
  gridEl.innerHTML = '';
  for(let r=0;r<=rows;r++){
    for(let c=0;c<=cols;c++){
      if(r===0 && c===0){
        const sp=document.createElement('div'); sp.className='ghead'; sp.textContent='';
        gridEl.appendChild(sp);
        continue;
      }
      if(r===0){ /* 列头：可拖拽整列互换（事件委托在容器级） */
        const h=document.createElement('div'); h.className='ghead'; h.textContent='列'+c;
        h.draggable=true; h.dataset.c=c;
        gridEl.appendChild(h);
        continue;
      }
      if(c===0){ /* 行号：可拖拽整行互换（事件委托在容器级） */
        const rb=document.createElement('div'); rb.className='rlabel'; rb.textContent='路'+r;
        rb.draggable=true; rb.dataset.r=r;
        gridEl.appendChild(rb);
        continue;
      }
      const rr=r-1, cc=c-1;
      const cg=curGrid();
      const cell = cg[rr][cc] || (cg[rr][cc] = {base:'', merge:'', vine:'', tile:false, ops:[]});
      const d = document.createElement('div');
      const eff=cellEffectClass(cell);
      const pool=inAloeRange(rr,cc);
      const once=(cell.base==='能量花'||cell.base==='阳光蓓蕾')?' pc-once':'';
      d.className = 'cell'+(cell.base?' has':'')+(cell.tile?' tile':'')+(eff?' '+eff:'')+(pool?' eff-pool':'')+once;
      d.draggable = true;
      d.dataset.r = rr; d.dataset.c = cc;
      const fxp=document.createElement('span'); fxp.className='fx fx-pool';
      const fxs=document.createElement('span'); fxs.className='fx fx-self';
      d.appendChild(fxp); d.appendChild(fxs);
      /* 图鉴头像 + 类型徽章 + 悬停提示（标识层，不受 fxOn 影响） */
      const tip=cellTipText(cell);
      if(tip) d.title=tip;
      const ava=cellAvaName(cell);
      const avaURL=cellAvaURL(cell);
      if(avaURL){
        const av=document.createElement('span'); av.className='cellava';
        av.style.backgroundImage='url('+avaURL+')';
        if(cell.base==='大哥' && cell.merge){
          av.classList.add('fu');
          const mf=(window.PLANT_META||{})[cell.merge];
          const at=mf && mf.attr && mf.attr[0];
          if(at) av.classList.add('fua-'+at);
        }
        d.appendChild(av);
        const vi=cellVineIcon(cell);
        if(vi && vi!==ava){
          const vv=document.createElement('span'); vv.className='cellava vine';
          vv.style.backgroundImage='url('+PLANT_ICON[vi]+')';
          d.appendChild(vv);
        } else if(cell.vine && cell.vine!==cell.base && !(window.PLANT_ICON||{})[cell.vine]){
          const vb=document.createElement('i'); vb.className='pbadge pvine';
          vb.textContent=cell.vine.charAt(0); d.appendChild(vb);
        }
      }
      const txt=document.createElement('span');
      txt.className='celltxt';
      txt.textContent = cellDisplayText(cell);
      d.appendChild(txt);

      /* 事件不再逐格绑定：click/contextmenu/dblclick/drag/drop 由容器级委托处理 */
      gridEl.appendChild(d);
    }
  }
}
/* ---- 棋盘容器级事件委托（每次渲染后只需装一次；dominant 行为与原逐格监听对齐） ----
 * click        → applyBrush + 重渲染
 * contextmenu  → clearCell + 重渲染
 * dblclick     → prompt 改主植物
 * dragstart    → 记录 dragSrc（cell/chead/rhead 三类）
 * dragover     → preventDefault + over 高亮
 * dragleave    → 移除 over 高亮
 * drop         → cell↔cell 整格互换 / 头带行列互换 / 画笔或植物卡拖入落种 */
(function v1BindGridDelegation(){
  if(!gridEl) return;
  const closestCell=function(t){ return t && t.closest ? t.closest('.cell') : null; };
  const closestHead=function(t){ return t && t.closest ? t.closest('.ghead') : null; };
  const closestRow=function(t){ return t && t.closest ? t.closest('.rlabel') : null; };
  gridEl.addEventListener('click', function(e){
    const d=closestCell(e.target); if(!d) return;
    const rr=+d.dataset.r, cc=+d.dataset.c;
    applyBrush(rr, cc);
    renderGrid();
  });
  gridEl.addEventListener('contextmenu', function(e){
    const d=closestCell(e.target); if(!d) return;
    e.preventDefault();
    clearCell(+d.dataset.r, +d.dataset.c);
    renderGrid();
  });
  gridEl.addEventListener('dblclick', function(e){
    const d=closestCell(e.target); if(!d) return;
    const rr=+d.dataset.r, cc=+d.dataset.c;
    const cell=curGrid()[rr][cc] || {base:''};
    const v = prompt('主植物名（输入 - 表示清空）', cell.base || '');
    if(v!==null){ setBase(rr,cc, v==='-'?'':v); renderGrid(); }
  });
  gridEl.addEventListener('dragstart', function(e){
    const c=closestCell(e.target);
    if(c){
      dragSrc={kind:'cell', r:+c.dataset.r, c:+c.dataset.c};
      e.dataTransfer.setData('text/src','cell');
      e.dataTransfer.effectAllowed='move';
      return;
    }
    const h=closestHead(e.target);
    if(h && h.dataset.c){
      dragSrc={kind:'chead', c:+h.dataset.c};
      e.dataTransfer.setData('text/src','chead');
      e.dataTransfer.effectAllowed='move';
      return;
    }
    const rb=closestRow(e.target);
    if(rb && rb.dataset.r){
      dragSrc={kind:'rhead', r:+rb.dataset.r};
      e.dataTransfer.setData('text/src','rhead');
      e.dataTransfer.effectAllowed='move';
    }
  });
  gridEl.addEventListener('dragover', function(e){
    const el=closestCell(e.target)||closestHead(e.target)||closestRow(e.target);
    if(!el) return;
    e.preventDefault();
    el.classList.add('over');
  });
  gridEl.addEventListener('dragleave', function(e){
    const el=closestCell(e.target)||closestHead(e.target)||closestRow(e.target);
    if(!el) return;
    /* 拖动到子元素（celltxt/cellava）也会触发 dragleave：related 仍在本元素内则忽略 */
    if(e.relatedTarget && el.contains(e.relatedTarget)) return;
    el.classList.remove('over');
  });
  gridEl.addEventListener('drop', function(e){
    const el=closestCell(e.target)||closestHead(e.target)||closestRow(e.target);
    if(!el) return;
    e.preventDefault();
    el.classList.remove('over');
    const src = e.dataTransfer.getData('text/src');
    const c=closestCell(e.target);
    if(c){
      const tr=+c.dataset.r, tc=+c.dataset.c;
      if(src==='cell'){
        if(dragSrc && dragSrc.kind==='cell'){
          const cg=curGrid();
          const t=cg[tr][tc]; cg[tr][tc]=cg[dragSrc.r][dragSrc.c]; cg[dragSrc.r][dragSrc.c]=t;
          save(); renderGrid();
        }
        dragSrc=null;
      }else if(dragSrc && dragSrc.kind){
        applyToCell(dragSrc.kind, dragSrc.name, tr, tc);
        renderGrid();
        dragSrc=null;
      }
      return;
    }
    const h=closestHead(e.target);
    if(h && h.dataset.c){
      if(dragSrc && dragSrc.kind==='chead') swapColumns(dragSrc.c - 1, +h.dataset.c - 1);  /* 列号→索引(差1) */
      dragSrc=null;
      return;
    }
    const rb=closestRow(e.target);
    if(rb && rb.dataset.r){
      if(dragSrc && dragSrc.kind==='rhead') swapRows(dragSrc.r - 1, +rb.dataset.r - 1);   /* 行号→索引(差1) */
      dragSrc=null;
    }
  });
})();
function initGrid(){
  grid=blankGrid();
  save(); renderGrid();
}

/* ============ 植物库（三栏，右键删除） ============ */
function buildChips(containerId, list, kind, removeLayer){
  const box = document.getElementById(containerId);
  box.innerHTML='';
  if(removeLayer){
    const rm=document.createElement('div');
    rm.className='chip clear'; rm.textContent=removeLayer; rm.dataset.kind=kind; rm.dataset.t='remove';
    rm.addEventListener('click', function(){
      selected = (selected && selected.t==='remove' && selected.layer===kind) ? null : {t:'remove', layer:kind};
      syncSel(); updateStatus();
    });
    box.appendChild(rm);
  }
  list.forEach(function(name){
    const ch=document.createElement('div');
    ch.className='chip'+(kind==='vine'?' v':kind==='merge'?' m':'');
    ch.textContent=name; ch.draggable=true;
    const cic=(window.PLANT_ICON_RAW||{})[name]||(window.PLANT_ICON||{})[name];
    if(cic){ ch.classList.add('chipava'); ch.style.backgroundImage='url('+cic+')'; }
    ch.dataset.kind=kind; ch.dataset.t='plant';
    ch.addEventListener('dragstart', function(e){
      dragSrc={kind:kind, name:name};
      e.dataTransfer.setData('text/src',kind);
      e.dataTransfer.effectAllowed='copy';
    });
    ch.addEventListener('click', function(){
      selected = (selected && selected.t==='plant' && selected.kind===kind && selected.name===name) ? null : {t:'plant', kind:kind, name:name};
      syncSel(); updateStatus();
    });
    ch.addEventListener('contextmenu', function(e){
      e.preventDefault();
      if(confirm('从库中删除「'+name+'」？（不影响棋盘上已摆的植物）')){
        const idx=list.indexOf(name);
        if(idx>-1) list.splice(idx,1);
        if(selected && selected.t==='plant' && selected.kind===kind && selected.name===name) selected=null;
        save(); buildAllChips(); updateStatus();
      }
    });
    box.appendChild(ch);
  });
}
function buildAllChips(){
  buildChips('chipsCore',    plants.base.core,    'base', null);
  buildChips('chipsSupport', plants.base.support, 'base', null);
  buildChips('chipsBoss',    plants.base.boss,    'base', null);
  buildChips('chipsWorld',   plants.base.world,   'base', null);
  buildChips('chipsSpeed',   plants.base.speed,   'base', null);
  buildChips('chipsVine',    plants.vine,  'vine',  '✕移除藤蔓');
  buildChips('chipsMerge',   plants.merge, 'merge', '✕移除融合');
  buildToolChips();
  buildOpsChips();
}
function buildOpsChips(){
  const box=document.getElementById('chipsOps');
  box.innerHTML='';
  OPS.forEach(function(op){
    const cc=document.createElement('div');
    cc.className='chip'; cc.textContent=op[1]; cc.dataset.t='op'; cc.dataset.op=op[0];
    cc.addEventListener('click', function(){
      selected = (selected && selected.t==='op' && selected.opName===op[0]) ? null : {t:'op', opName:op[0]};
      syncSel(); updateStatus();
    });
    box.appendChild(cc);
  });
}
function buildToolChips(){
  const box=document.getElementById('chipsTool');
  box.innerHTML='';
  [['✕清空整格','clear'],['🟪瓷砖','tile'],['✕移除瓷砖','removetile']].forEach(function(pair){
    const cc=document.createElement('div');
    cc.className='chip'+(pair[1]==='tile'?' tilechip':' clear');
    cc.textContent=pair[0]; cc.dataset.t=pair[1];
    cc.addEventListener('click', function(){
      selected = (selected && selected.t===pair[1]) ? null : {t:pair[1]};
      syncSel(); updateStatus();
    });
    box.appendChild(cc);
  });
}
function syncSel(){
  document.querySelectorAll('.chip').forEach(function(ch){ ch.classList.remove('sel'); });
  if(!selected) return;
  document.querySelectorAll('.chip').forEach(function(ch){
    if(selected.t==='plant' && ch.dataset.t==='plant' && ch.dataset.kind===selected.kind && ch.textContent===selected.name){
      ch.classList.add('sel');
    }else if(selected.t==='remove' && ch.dataset.t==='remove' && ch.dataset.kind===selected.layer){
      ch.classList.add('sel');
    }else if(selected.t==='clear' && ch.dataset.t==='clear'){
      ch.classList.add('sel');
    }else if(selected.t==='tile' && ch.dataset.t==='tile'){
      ch.classList.add('sel');
    }else if(selected.t==='removetile' && ch.dataset.t==='removetile'){
      ch.classList.add('sel');
    }else if(selected.t==='op' && ch.dataset.t==='op' && ch.dataset.op===selected.opName){
      ch.classList.add('sel');
    }
  });
}

/* 自定义添加 */
document.querySelectorAll('#palette .custom-add button').forEach(function(btn){
  btn.addEventListener('click', function(){
    const g=btn.dataset.g;
    const inp=document.getElementById(g==='base'?'addBase':g==='vine'?'addVine':'addMerge');
    const v=inp.value.trim();
    if(!v) return;
    if(g==='base'){
      const grp=document.getElementById('addBaseGroup').value;
      if(plants.base[grp].indexOf(v)===-1) plants.base[grp].push(v);
    }else{
      if(plants[g].indexOf(v)===-1) plants[g].push(v);
    }
    inp.value=''; buildAllChips(); save();
  });
});
document.querySelectorAll('#palette .custom-add input').forEach(function(inp){
  inp.addEventListener('keydown', function(e){
    if(e.key==='Enter'){ inp.nextElementSibling.click(); }
  });
});

/* ============ 卡槽（主 1~8 + 副 9~16，留空不导出） ============ */
const subSlotList=document.getElementById('subSlotList');
function buildSlotRow(container, idx){
  const row=document.createElement('div'); row.className='slot';
  const sn=document.createElement('span'); sn.className='sn'; sn.textContent='卡槽'+(idx+1);
  /* 带图头像：与棋盘同源 PLANT_ICON，一眼识别卡槽植物；无图植物回落首字 */
  const ico=document.createElement('span'); ico.className='slotava';
  const inp=document.createElement('input'); inp.maxLength=20; inp.value=slotNames[idx];
  function sync(){
    const nm=slotNames[idx];
    const url=(window.PLANT_ICON||{})[nm];
    if(url){ ico.style.backgroundImage='url('+url+')'; ico.classList.add('has'); }
    else { ico.style.backgroundImage=''; ico.classList.remove('has'); }
    if(nm && !url){ ico.textContent=nm.charAt(0); ico.classList.add('txt'); }
    else { ico.textContent=''; ico.classList.remove('txt'); }
    ico.title=nm||'';
  }
  sync();
  function setSlot(v){
    slotNames[idx]=v;
    inp.value=v; sync(); save();
  }
  inp.addEventListener('input', function(){ slotNames[idx]=inp.value.trim(); sync(); save(); });
  inp.addEventListener('dragover', function(e){ e.preventDefault(); });
  inp.addEventListener('drop', function(e){
    e.preventDefault();
    if(dragSrc && dragSrc.kind && dragSrc.kind!=='cell'){
      setSlot(dragSrc.name);
      dragSrc=null;
    }
  });
  inp.addEventListener('click', function(){
    if(selected && selected.t==='plant'){
      setSlot(selected.name);
    }
  });
  inp.addEventListener('contextmenu', function(e){
    e.preventDefault();
    setSlot('');
  });
  row.appendChild(sn); row.appendChild(ico); row.appendChild(inp);
  container.appendChild(row);
}
function renderSlots(){
  slotList.innerHTML='';
  for(let i=0;i<8;i++) buildSlotRow(slotList, i);
  subSlotList.innerHTML='';
  subSlotList.style.display = subSlotsOn ? 'block' : 'none';   /* 显示/隐藏副卡槽区域 */
  if(subSlotsOn) for(let i=8;i<16;i++) buildSlotRow(subSlotList, i);
  const btn=document.getElementById('btnSubSlots');
  btn.textContent='配队2：'+(subSlotsOn?'开':'关');
  btn.classList.toggle('on', subSlotsOn);
}
document.getElementById('btnSubSlots').addEventListener('click', function(){
  subSlotsOn=!subSlotsOn; renderSlots(); save();
});
document.getElementById('btnFx').addEventListener('click', function(){
  fxOn=!fxOn;
  const btn=document.getElementById('btnFx');
  btn.textContent='特效：'+(fxOn?'开':'关');
  btn.classList.toggle('on', fxOn);
  renderGrid(); save();
});
/* ============ 分阵型模式 ============ */
const splitBar=document.getElementById('splitBar');
function renderSplitUI(){
  splitBar.style.display = splitOn ? 'block' : 'none';
  document.getElementById('btnSplit').textContent='分阵型：'+(splitOn?'开':'关');
  document.getElementById('btnSplit').classList.toggle('on', splitOn);
  document.querySelectorAll('.stab').forEach(function(t){ t.classList.toggle('active', t.dataset.split===splitView); });
  document.getElementById('btnCopyToSplit').style.display = (splitOn && splitView!=='main') ? 'inline-block' : 'none';
  document.getElementById('btnCheckSplit').style.display = splitOn ? 'inline-block' : 'none';
}
document.getElementById('btnSplit').addEventListener('click', function(){
  splitOn=!splitOn;
  if(!splitOn) splitView='main';
  renderSplitUI(); renderGrid(); save();
});
document.querySelectorAll('.stab').forEach(function(t){
  t.addEventListener('click', function(){
    if(!splitOn) return;
    splitView=t.dataset.split;
    renderSplitUI(); renderGrid(); save();
  });
});
document.getElementById('btnCopyToSplit').addEventListener('click', function(){
  if(splitView==='main') return;
  split[splitView]=deepCopyBoard(grid);
  renderGrid(); save();
  showToast('已从总棋盘复制到'+(splitView==='early'?'前期':'后期')+'棋盘');
});
/* 一次性消耗判定：能量花/阳光蓓蕾（或该格执行过抛花/抛蕾）不计入永久植物 */
function isConsumableCell(cell){
  if(!cell) return true;
  if(cell.ops && (cell.ops.indexOf('抛花')>-1 || cell.ops.indexOf('抛蕾')>-1)) return true;
  return cell.base==='能量花' || cell.base==='蓓蕾' || cell.base==='阳光蓓蕾';
}
/* 格子最终形态文本：模拟动作链（铲除→清空、铲除后种植→替换该格植物），一次性消耗忽略 */
function finalCellText(cell){
  if(!cell) return '';
  if(isConsumableCell(cell)) return '';
  const cur={base:cell.base||'', merge:cell.merge||'', vine:cell.vine||''};
  if(!cur.base) return '';
  (cell.ops||[]).forEach(function(op){
    if(op==='铲除'){ cur.base=''; cur.merge=''; cur.vine=''; }
    else if(op==='喂豆'||op==='抛花'||op==='抛蕾'||/^delay\d*$/.test(op)){ /* 不影响植物层 */ }
    else if(op){ cur.base=op; cur.merge=''; cur.vine=''; }  /* 铲除后种植 */
  });
  let s=cur.base;
  if(cur.merge) s+='+'+cur.merge;
  if(cur.vine) s+='('+cur.vine+')';
  return s;
}
/* 大守卫菇/守卫菇 执行过喂豆 → 在自身 3×3 范围（除本格）产生小守卫菇 */
function guardGivesSprout(cell){
  if(!cell) return false;
  return (cell.base==='大守卫菇'||cell.base==='守卫菇') && (cell.ops||[]).indexOf('喂豆')>-1;
}
function hasGuardSprout(board,r,c){
  if(!board) return false;
  for(let dr=-1;dr<=1;dr++){
    for(let dc=-1;dc<=1;dc++){
      if(dr===0&&dc===0) continue;
      const rr=r+dr, cc=c+dc;
      if(rr<0||rr>=rows||cc<0||cc>=cols) continue;
      const nb=(board[rr]&&board[rr][cc])?board[rr][cc]:null;
      if(guardGivesSprout(nb)) return true;
    }
  }
  return false;
}
/* 校验 前期+后期 == 总阵型（逐格合并；一次性消耗忽略；含铲除换种、守卫菇 3×3 藤蔓叠加特例） */
function computeSplitDiff(){
  const problems=[];
  const normTxt=function(s){ return (!s||s==='-')?'':s; };
  function cellFinal(cell){ return normTxt(finalCellText(cell)); }
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const tTxt=cellFinal(grid[r][c]);
      const ec=(split.early&&split.early[r])?split.early[r][c]:null;
      const lc=(split.late&&split.late[r])?split.late[r][c]:null;
      const eTxt=cellFinal(ec);
      const lTxt=cellFinal(lc);
      let sum;
      if(eTxt && lTxt && eTxt!==lTxt) sum=eTxt+'/'+lTxt;   /* 前期后期冲突 */
      else sum=eTxt||lTxt;
      /* 守卫菇 3×3 贡献（任一棋盘）→ 小守卫菇藤蔓叠加到已有植物上 */
      if(hasGuardSprout(split.early,r,c) || hasGuardSprout(split.late,r,c)){
        if(sum && sum.indexOf('(小守卫菇)')===-1) sum+='(小守卫菇)';
        else if(!sum) sum='小守卫菇';
      }
      if(sum!==tTxt) problems.push({r:r+1,c:c+1,total:tTxt||'空',sum:sum||'空'});
    }
  }
  return problems;
}
document.getElementById('btnCheckSplit').addEventListener('click', function(){
  if(!splitOn){ showToast('请先开启分阵型'); return; }
  if(!split.early && !split.late){ showToast('分棋盘为空，请先「从总棋盘复制」'); return; }
  const probs=computeSplitDiff();
  if(!probs.length){ showToast('✓ 前期+后期 = 总阵型，一致'); return; }
  const lines=['【一致性校验】前期+后期 vs 总阵型','差异 '+probs.length+' 格（能量花/蓓蕾不计）:'];
  probs.forEach(function(p){ lines.push('  路'+p.r+' 列'+p.c+': 总='+p.total+'  前期+后期='+p.sum); });
  out.value = (out.value?out.value+'\n\n':'')+lines.join('\n');
  showToast('✗ 差异 '+probs.length+' 格，报告已输出到导出区');
});
document.getElementById('btnOpsUndo').addEventListener('click', function(){
  const g=curGrid();
  let removed=0;
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
    const cell=g[r][c];
    if(cell && cell.ops && cell.ops.length){ cell.ops.pop(); removed++; }
  }
  if(removed) showToast('已撤销所有格子上一步动作');
  else showToast('没有可撤销的动作');
  save(); renderGrid();
});
document.getElementById('btnOpsClear').addEventListener('click', function(){
  const g=curGrid();
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
    const cell=g[r][c];
    if(cell && cell.ops){ cell.ops=[]; }
  }
  showToast('已清空当前棋盘所有动作');
  save(); renderGrid();
});

/* ============ 导出 ============ */
function pad(s,w){ return s.length>=w ? s : s+' '.repeat(w-s.length); }
/* 导出用卡槽列表：主卡槽始终；副卡槽仅开启时，且留空不导出 */
function slotExportList(){
  const mainEnd = subSlotsOn ? 16 : 8;
  return slotNames.slice(0, mainEnd).map(function(n,i){ return n ? (i+1)+':'+n : null; }).filter(Boolean);
}
function exportFull(){
  const texts=grid.map(function(row){ return row.map(cellExportText); });
  const colW=[];
  for(let c=0;c<cols;c++){
    let w=('列'+(c+1)).length;
    for(let r=0;r<rows;r++) w=Math.max(w, texts[r][c].length);
    colW.push(w+2);
  }
  const lines=[];
  let head=' '.repeat(5);
  for(let c=0;c<cols;c++) head+=pad('列'+(c+1), colW[c]);
  lines.push(head.replace(/\s+$/,''));
  for(let r=0;r<rows;r++){
    let s='路'+(r+1)+': ';
    for(let c=0;c<cols;c++) s+=pad(texts[r][c], colW[c]);
    lines.push(s.replace(/\s+$/,''));
  }
  const slotTxt=slotExportList().join(' ');
  lines.push('');
  lines.push(slotTxt ? '（卡槽：'+slotTxt+'）' : '（卡槽：空）');
  return lines.join('\n');
}
function exportCompact(){
  const rowsTxt=grid.map(function(row){ return row.map(cellExportText).join(','); }).join('|');
  const slotTxt=slotExportList().join(' ');
  return cols+'x'+rows+' 布阵: '+rowsTxt+'  卡槽: '+(slotTxt||'无');
}
/* 分棋盘紧凑导出（随原版追加） */
function splitCompact(view){
  const g=split[view];
  if(!g) return '';
  const rowsTxt=g.map(function(row){ return row.map(cellExportText).join(','); }).join('|');
  return cols+'x'+rows+' 布阵: '+rowsTxt;
}

function copyText(txt){
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(function(){
      if(typeof showToast==='function') showToast('已复制到剪贴板');
    }, function(){ fallbackCopy(txt); });
  }else{ fallbackCopy(txt); }
}
function fallbackCopy(txt){
  /* 先建 textarea 并选中，再 execCommand（旧顺序颠倒：未建选区就复制必败，
     且 toast 误报"已复制"——2026-09-14 审查修复） */
  const ta=document.createElement('textarea');
  ta.value=txt; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.focus(); ta.select();
  let ok=false;
  try{ ok=document.execCommand('copy'); }catch(e){ ok=false; }
  document.body.removeChild(ta);
  if(typeof showToast==='function') showToast(ok ? '已复制到剪贴板' : '复制失败，请手动选择文本复制');
}

/* ============ 导入（智能识别） ============ */
function normName(s){
  s=(s||'').trim();
  if(!s) return '';
  const alias={ '原碗':'原豌','原始豌豆':'原豌','能量花':'能量花','香蕉':'电鳗香蕉' };
  return alias[s] || s;
}
function parseCellText(t){
  const out={base:'',merge:'',vine:'',tile:false};
  t=(t||'').trim();
  if(!t || t==='-' || t==='·' || t==='.' ) return out;
  if(t==='瓷' || t==='瓷砖'){ out.tile=true; return out; }
  if(/[\[【]瓷(?:砖)?[\]】]/.test(t)){ out.tile=true; t=t.replace(/[\[【]瓷(?:砖)?[\]】]/g,'').trim(); }
  if(!t) return out;
  /* 拆括号（藤蔓）：形如 X(毒藤) 或 原大(南瓜头) */
  const paren=/^(.+?)[（(](.+?)[)）]$/.exec(t);
  let core=t, vine='';
  if(paren){ core=paren[1].trim(); vine=normName(paren[2]); }
  /* X大 简写 → 大哥+融合材料（原大/电大/火大/冰大/毒大） */
  const da={'原大':'原豌','电大':'电豌','火大':'火豌','冰大':'冰豌','毒大':'毒豌'}[core];
  if(da){
    out.base='大哥'; out.merge=da; out.vine=vine||''; return out;
  }
  /* 拆 +（融合）：形如 大哥+原豌 / 珊瑚+电豌 */
  const p=core.split(/[+＋]/);
  if(p.length>=2){
    out.base=normName(p[0]);
    const rest=p.slice(1).map(normName).filter(Boolean);
    if(out.base==='大哥'){
      out.merge=rest.shift() || '';
      out.vine=vine || rest.join('+') || '';
    }else{
      out.vine=rest.join('+') || vine;
    }
  }else{
    out.base=normName(core);
    out.vine=vine;
  }
  return out;
}
function ensurePlant(kind,name){
  if(!name) return;
  if(kind==='base'){
    /* base 现在按分组存储：查所有分组，无则加入挂机核心 */
    for(const g in plants.base){
      if(plants.base[g].indexOf(name)!==-1) return;
    }
    plants.base.core.push(name);
  }else{
    const list=plants[kind]||(plants[kind]=[]);
    if(list.indexOf(name)===-1) list.push(name);
  }
}
function parseImport(text){
  const lines=text.split(/\r?\n/).map(function(l){ return l.trim(); }).filter(Boolean);
  if(!lines.length) return null;

  /* ① 紧凑格式： NxN 布阵: ... 卡槽: ...（可同行） */
  for(let li=0;li<lines.length;li++){
    const cm=lines[li].match(/^(\d+)\s*[xX×]\s*(\d+)\s*布阵\s*[:：]?\s*(.+)$/);
    if(cm){
      const ncols=Math.min(9, parseInt(cm[1])||1);
      const nrows=Math.min(5, parseInt(cm[2])||1);
      let body=cm[3];
      const slots=[];
      const sm=body.match(/卡槽\s*[:：]\s*(.*)$/);
      if(sm){ parseSlotString(sm[1], slots); body=body.slice(0, sm.index).trim(); }      const rowStr=body.split('|');
      const ng=[];
      for(let r=0;r<nrows;r++){
        const parts=(rowStr[r]||'').split(/[,，]/);
        const row=[];
        for(let c=0;c<ncols;c++) row.push(parseCellText(parts[c]));
        ng.push(row);
      }
      return {cols:ncols, rows:nrows, grid:ng, slots: slots.length ? slots : null};
    }
  }

  /* ② 普通表格/手写文本 */
  const slotLines=[], dataLines=[];
  lines.forEach(function(l){
    if(/卡槽/.test(l)) slotLines.push(l);
    else dataLines.push(l);
  });
  const rowsArr=[];
  dataLines.forEach(function(l){
    l=l.replace(/^[路行]\d+[:：]\s*/,'');
    if(/^列/.test(l)) return;             // 表头跳过
    if(/^布阵\s*[:：]?$/.test(l)) return; // 单独的“布阵:”行跳过
    let cells;
    if(l.indexOf('|')>-1) cells=l.split('|');
    else if(l.indexOf(',')>-1 || l.indexOf('，')>-1) cells=l.split(/[,，]/);
    else cells=l.split(/\s+/);            // 单个或多个空格都行（植物名不含空格）
    cells=cells.map(function(c){ return c.trim(); }).filter(Boolean);
    if(cells.length) rowsArr.push(cells);
  });
  if(!rowsArr.length) return null;
  const ncols=Math.min(9, Math.max.apply(null, rowsArr.map(function(r){ return r.length; })));
  const nrows=Math.min(5, rowsArr.length);
  const ng=[];
  for(let r=0;r<nrows;r++){
    const row=[];
    for(let c=0;c<ncols;c++) row.push(parseCellText(rowsArr[r][c]));
    ng.push(row);
  }
  const slots=[];
  slotLines.forEach(function(l){ parseSlotString(l, slots); });
  return {cols:ncols, rows:nrows, grid:ng, slots: slots.length ? slots : null};
}
function parseSlotString(content, arr){
  content=content.replace(/.*卡槽\s*[:：]?\s*/,'').replace(/[（）()]/g,'');
  const re=/(\d+)\s*[:：]\s*([^\s,，]+)/g;
  let m;
  while((m=re.exec(content))){
    const i=parseInt(m[1])-1;
    const name=normName(m[2]);
    if(i>=0 && i<16 && name && name!=='空' && name!=='无') arr[i]=name;
  }
}
function applyImport(res){
  cols=res.cols; rows=res.rows;
  grid=res.grid;
  document.getElementById('colN').value=cols;
  document.getElementById('rowN').value=rows;
  if(res.slots){
    slotNames=res.slots.slice();
    while(slotNames.length<16) slotNames.push('');
  }   /* 文本未带卡槽时保留现有卡槽 */
  /* 自动把未知植物加入库，保证可再编辑 */
  res.grid.forEach(function(row){
    row.forEach(function(c){
      ensurePlant('base', c.base);
      ensurePlant('vine', c.vine);
      if(c.merge) ensurePlant('merge', c.merge);
    });
  });
  save(); buildAllChips(); renderSlots(); renderGrid();
}

/* ============ 导入对话框 ============ */
const dlg=document.getElementById('dlg');
document.getElementById('btnImport').addEventListener('click', function(){ dlg.showModal(); document.getElementById('dlgIn').focus(); });
document.getElementById('btnDlgCancel').addEventListener('click', function(){ dlg.close(); });
document.getElementById('btnDlgClear').addEventListener('click', function(){
  document.getElementById('dlgIn').value=''; document.getElementById('dlgIn').focus();
});
document.getElementById('btnDlgOk').addEventListener('click', function(){
  const res=parseImport(document.getElementById('dlgIn').value);
  if(!res){ showToast('未能识别内容，请检查文本格式'); return; }
  applyImport(res);
  dlg.close();
  document.getElementById('dlgIn').value='';   // 导入成功后清空，下次打开是干净的
  showToast('导入成功：'+res.rows+'行 '+res.cols+'列');
});
document.getElementById('btnDlgSample').addEventListener('click', function(){
  document.getElementById('dlgIn').value=
    '    列1     列2      列3      列4      列5      列6      列7     列8 列9\n'+
    '路1: 大哥+原豌  桑葚(毒藤) 桑葚(毒藤) 桑葚(毒藤) 桑葚(毒藤) 芦荟   桑葚(毒藤) -  -\n'+
    '路2: 大哥+原豌  桑葚(毒藤) 芦荟    桑葚(毒藤) 桑葚(毒藤) 桑葚(毒藤) 桑葚(毒藤) -  -\n'+
    '路3: 大哥+原豌  桑葚(毒藤) 桑葚(毒藤) 桑葚(毒藤) 桑葚(毒藤) 桑葚(毒藤) 桑葚(毒藤) -  -\n'+
    '路4: 大哥+原豌  桑葚(毒藤) 桑葚(毒藤) 桑葚(毒藤) 桑葚(毒藤) 芦荟   桑葚(毒藤) -  -\n'+
    '路5: 大哥+原豌  桑葚(毒藤) 芦荟    桑葚(毒藤) 桑葚(毒藤) 桑葚(毒藤) 桑葚(毒藤) -  -\n\n'+
    '（卡槽：1:能量花 2:桑葚 3:大哥 4:毒藤 5:原豌 6:芦荟 7:补植物 8:补植物）';
});

/* ============ 导出/工具栏 ============ */
document.getElementById('btnExport').addEventListener('click', function(){
  let v = exportFull() + '\n\n【紧凑格式】\n' + exportCompact();
  /* 分阵型模式：随原版追加 前期/后期 分棋盘（紧凑格式） */
  if(splitOn){
    if(split.early) v += '\n\n【前期/第一关】\n' + splitCompact('early');
    if(split.late)  v += '\n\n【后期/第二关】\n' + splitCompact('late');
  }
  out.value = v;
});
document.getElementById('btnCopy').addEventListener('click', function(){
  out.select();
  copyText(out.value);
  showToast('已复制');
});
document.getElementById('btnClearOut').addEventListener('click', function(){
  out.value=''; showToast('导出区已清空');
});
/* 导出为 txt 文件（Blob 下载） */
document.getElementById('btnExportTxt').addEventListener('click', function(){
  const txt=out.value;
  if(!txt.trim()){ showToast('导出区为空，请先「导出文本」'); return; }
  v2Download('无尽阵型_' + (splitOn&&split.early?'分阵型_':'') + new Date().toISOString().slice(0,10) + '.txt', txt);
});
/* 从 txt 文件读取导入 */
document.getElementById('btnDlgFile').addEventListener('click', function(){
  document.getElementById('fileIn').click();
});
document.getElementById('fileIn').addEventListener('change', function(e){
  const file=(e && e.target && e.target.files) ? e.target.files[0] : null;
  if(!file) return;
  const reader=new FileReader();
  reader.onload=function(){
    document.getElementById('dlgIn').value=reader.result;
    showToast('已读入文件：'+file.name);
  };
  reader.readAsText(file, 'utf-8');
  if(e && e.target) e.target.value='';   /* 允许重复选择同一文件 */
});
document.getElementById('btnClear').addEventListener('click', function(){
  if(!confirm('确定清空整个棋盘？')) return;
  initGrid();
});
document.getElementById('btnClearSlots').addEventListener('click', function(){
  slotNames=Array(16).fill(''); renderSlots(); save();
});
document.getElementById('btnClearBrush').addEventListener('click', function(){
  selected=null; syncSel(); updateStatus();
});
document.getElementById('btnResetPlants').addEventListener('click', function(){
  if(!confirm('恢复植物库为默认预置？（不影响棋盘已摆的植物）')) return;
  plants=defaultPlants();
  save(); buildAllChips();
});
document.getElementById('btnResize').addEventListener('click', function(){
  const nc=Math.max(1,Math.min(9, parseInt(document.getElementById('colN').value)||9));
  const nr=Math.max(1,Math.min(5, parseInt(document.getElementById('rowN').value)||5));
  const old=grid;
  cols=nc; rows=nr;
  grid=[];
  for(let r=0;r<rows;r++){
    const row=[];
    for(let c=0;c<cols;c++) row.push((old[r]&&old[r][c])?{...old[r][c],ops:(old[r][c].ops||[]).slice()}:{base:'',merge:'',vine:'',tile:false,ops:[]});
    grid.push(row);
  }
  save(); renderGrid();
});

/* ============ Toast ============ */
let toastTimer=null;
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){ t.classList.remove('show'); }, 1800);
}

/* ============ 植物库 tab 切换 ============ */
document.querySelectorAll('.palette-tabs .tab').forEach(function(tab){
  tab.addEventListener('click', function(){
    document.querySelectorAll('.palette-tabs .tab').forEach(function(t){ t.classList.remove('active'); });
    document.querySelectorAll('.palette-panel').forEach(function(p){ p.classList.remove('active'); });
    tab.classList.add('active');
    const panel=document.getElementById('panel-'+tab.dataset.tab);
    if(panel) panel.classList.add('active');
  });
});
