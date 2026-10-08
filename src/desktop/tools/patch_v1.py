# -*- coding: utf-8 -*-
"""v3beta 构建期基座覆写（不动 v2 源码）：
1) 合并 棋盘显示名/悬浮提示 的重复命名分支（原大/点。大哥 只维护一处）；
2) 图鉴图标瘦身：未被任何其他源码引用的 PLANT_ICON 条目 → 1px 透明占位
   （dataurl 占总量 87%，结构不动、零语法风险）。
"""
import io
import os
import re

V2_SRC = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '无尽布阵工具v2', 'src'))

PLACEHOLDER = ('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ'
               'AAAADUlEQVR42mNk+M9QDwADhgGAWjRRMVAAAAAElFTkSuQmCC')


def patch_v1_namespaces(text):
    """合并 cellDisplayText / cellTipText 的重复命名分支为共享 cellDisplayName()。"""
    old_disp = (
        "/* 棋盘显示文本：融合大哥简写为 X大（不影响导出） */\n"
        "function cellDisplayText(cell){\n"
        "  if(!cell) return '-';\n"
        "  let s = cell.base || '';\n"
        "  if(cell.base==='大哥' && cell.merge){\n"
        "    if(cell.merge==='电豌') s = '点。大哥';          /* 电大 → 点。大哥 */\n"
        "    else s = cell.merge.charAt(0) + '大';\n"
        "  }\n"
        "  else if(cell.merge) s += '+' + cell.merge;\n"
        "  if(cell.vine) s += '(' + cell.vine + ')';\n"
        "  s += cellOpsChain(cell);\n"
        "  return s || '-';\n"
        "}"
    )
    new_disp = (
        "/* 棋盘显示文本：命名分支共享 cellDisplayName（v3beta 合并，原大/点。大哥只维护一处） */\n"
        "function cellDisplayName(cell){\n"
        "  if(!cell || !cell.base) return '';\n"
        "  if(cell.base==='大哥' && cell.merge)\n"
        "    return (cell.merge==='电豌') ? '点。大哥' : cell.merge.charAt(0) + '大';\n"
        "  return cell.base + (cell.merge ? '+' + cell.merge : '') + (cell.vine ? '(' + cell.vine + ')' : '');\n"
        "}\n"
        "function cellDisplayText(cell){\n"
        "  if(!cell) return '-';\n"
        "  return (cellDisplayName(cell) || '-') + cellOpsChain(cell);\n"
        "}"
    )
    if old_disp in text:
        text = text.replace(old_disp, new_disp)

    old_tip = (
        "function cellTipText(cell){\n"
        "  if(!cell || !cell.base) return '';\n"
        "  const PM = window.PLANT_META || {};\n"
        "  let name, rar;\n"
        "  if(cell.base==='大哥' && cell.merge){\n"
        "    name = (cell.merge==='电豌') ? '点。大哥' : cell.merge.charAt(0) + '大';\n"
        "    rar = '橙色';\n"
        "  } else {\n"
        "    name = cell.base + (cell.merge ? '+' + cell.merge : '') + (cell.vine ? '(' + cell.vine + ')' : '');\n"
        "    const mt = PM[cell.base];\n"
        "    rar = mt && mt.rar;\n"
        "  }\n"
        "  return rar ? (name + ' · ' + rar) : name;\n"
        "}"
    )
    new_tip = (
        "function cellTipText(cell){\n"
        "  if(!cell || !cell.base) return '';\n"
        "  const PM = window.PLANT_META || {};\n"
        "  const name = cellDisplayName(cell);\n"
        "  let rar;\n"
        "  if(cell.base==='大哥' && cell.merge) rar = '橙色';   /* x大 一律金卡 */\n"
        "  else { const mt = PM[cell.base]; rar = mt && mt.rar; }\n"
        "  return rar ? (name + ' · ' + rar) : name;\n"
        "}"
    )
    if old_tip in text:
        text = text.replace(old_tip, new_tip)
    return text


def prune_plant_icons(js_text):
    """未被任何其他源码引用的 PLANT_ICON 条目 → 1px 透明占位。返回 (新文本, 剔除数)。"""
    m = re.search(r'var PLANT_ICON = \{[\s\S]*?\n\};', js_text)
    if not m:
        return js_text, 0
    seg = m.group(0)
    others = js_text.replace(seg, '')
    removed = 0
    for name, dataurl in re.findall(r'"([^"]+)":\s*"(data:image/[^"]+)"', seg):
        if ("'" + name + "'") in others or ('"' + name + '"') in others:
            continue
        new_seg = re.sub(r'("%s":\s*")data:image/[^"]+(")' % re.escape(name),
                         r'\g<1>' + PLACEHOLDER + r'\g<2>', seg, count=1)
        if new_seg != seg:
            seg = new_seg
            removed += 1
    if removed:
        js_text = js_text.replace(m.group(0), seg)
    return js_text, removed


if __name__ == '__main__':
    # 自检：对当前 v2 基座源码做干跑
    v1 = io.open(os.path.join(V2_SRC, 'js', '00_v1_app.js'), encoding='utf-8').read()
    patched = patch_v1_namespaces(v1)
    print('命名分支合并：', '已生效' if patched != v1 else '未匹配（检查锚点）')
