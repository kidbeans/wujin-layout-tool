# -*- coding: utf-8 -*-
"""无尽布阵工具 v3 工程打包。

把 v2 基座（../无尽布阵工具v2/src，逻辑层原样复用，仅替换壳层 95_maa.js）
与 v3 chrome（src/v3_chrome.* + src/js/60~96）拼成单文件 ui/index.html：
  - Tauri 2 桌面壳的 frontendDist（src-tauri/tauri.conf.json 指向 ../ui）
  - python webui.py 的服务根（无 Rust 环境时的浏览器回退）
  - 直接双击 file:// 也能用（Agent 桥自动降级为「手动任务包」模式）

v2 基座默认取同级目录 `../无尽布阵工具v2/src`（单一事实源，v2 的修复自动流入 v3）；
若需要独立分发，可先跑 `python build.py --snapshot` 把 v2 src 冻结到本工程 src_v2/，
之后构建优先用冻结副本。
"""
import io, os, sys, shutil, json, re

ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import patch_v1
SNAP = os.path.join(ROOT, 'src_v2')
SRC = os.path.join(ROOT, 'src')
UI = os.path.join(ROOT, 'ui')

V2_JS = [
    'js/00_v1_app.js',
    'js/05_plant_icons.js',
    'js/10_state_v2.js',
    'js/15_route.js',
    'js/20_order.js',
    'js/22_gold_sim.js',
    'js/25_boss.js',
    'js/30_presets_data.js',
    'js/31_official_data.js',
    'js/32_frame_templates.js',
    'js/35_presets.js',
    'js/40_export.js',
    'js/42_frame_io.js',
    'js/45_import.js',
    'js/47_touch.js',
    'js/48_server.js',
    'js/48b_deploy.js',
    'js/49_agent_counter.js',
    'js/50_checks.js',
    'js/90_boot.js',
    # 注意：95_maa.js（v2 的 pywebview 伪标题栏/侧栏皮肤运行时）被 v3 chrome 取代，不再拼入。
]
V3_JS = [
    'js/60_agent.js',
    'js/70_bridge.js',
    'js/96_v3_boot.js',
]
# v2 的「迟装配」模块：必须在 v3 boot（96_v3_boot）之后再运行（主题引擎要接管 v3 的主题按钮）
V2_JS_LATE = [
    'js/97_theme.js',
    'js/98_help.js',
]
V2_CSS = ['style_base.css', 'style_v2.css', 'style_maa.css', 'style_themes.css']
V3_CSS = ['v3_chrome.css']
V2_BODY = ['body_base.html', 'body_v2.html', 'help_user.html']
V3_BODY = ['v3_chrome.html']


def v2_src():
    if os.path.isdir(SNAP):
        return SNAP
    for guess in (
        os.path.join(os.path.dirname(ROOT), 'core', 'src'),            # v4 整理版布局：source/core/src
        os.path.join(os.path.dirname(ROOT), '无尽布阵工具v2', 'src'),   # 开发布局：兄弟工程
    ):
        if os.path.isdir(guess):
            return guess
    sys.exit('找不到 v2 基座 src：请把 core/src（或 无尽布阵工具v2/src）放在同目录，'
             '或设环境变量 V2_SRC 指向其 src/，或先在本工程执行 `python build.py --snapshot` 冻结一份。')


def read(base, name):
    with io.open(os.path.join(base, name), encoding='utf-8') as f:
        return f.read()


def snapshot():
    src = os.path.join(os.path.dirname(ROOT), '无尽布阵工具v2', 'src')
    if not os.path.isdir(src):
        sys.exit('快照失败：未找到 %s' % src)
    if os.path.isdir(SNAP):
        shutil.rmtree(SNAP)
    shutil.copytree(src, SNAP, ignore=shutil.ignore_patterns('__pycache__'))
    print('snapshot v2 src -> %s' % SNAP)


def build_resources():
    """agent 技能包与模型预设 → ui/agent_skill/、ui/agent_model/，并生成技能 manifest。
    结构参照 LinguaGacha：每个技能 = SKILL.md（YAML frontmatter: name/description）+ ui.json
    （visible/order/label/defaults）；manifest.json 供前端动态渲染任务下拉，SKILL.md 按需 fetch。"""
    src_as = os.path.join(ROOT, 'resource', 'agent_skill')
    dst_as = os.path.join(UI, 'agent_skill')
    skills = []
    if os.path.isdir(src_as):
        for d in sorted(os.listdir(src_as)):
            sdir = os.path.join(src_as, d)
            smd = os.path.join(sdir, 'SKILL.md')
            if not os.path.isfile(smd):
                continue
            dstd = os.path.join(dst_as, d)
            os.makedirs(dstd, exist_ok=True)
            shutil.copy2(smd, os.path.join(dstd, 'SKILL.md'))
            ui = {}
            uip = os.path.join(sdir, 'ui.json')
            if os.path.isfile(uip):
                shutil.copy2(uip, os.path.join(dstd, 'ui.json'))
                try:
                    with io.open(uip, encoding='utf-8') as f:
                        ui = json.load(f)
                except Exception:
                    ui = {}
            with io.open(smd, encoding='utf-8') as f:
                text = f.read()
            meta = {}
            m = re.match(r'\s*---\s*\n(.*?)\n---\s*\n', text, re.S)
            if m:
                for line in m.group(1).splitlines():
                    if ':' in line:
                        k, v = line.split(':', 1)
                        meta[k.strip()] = v.strip()
            skills.append({
                'id': d,
                'name': meta.get('name', d),
                'description': meta.get('description', ''),
                'visible': ui.get('visible', True),
                'order': ui.get('order', 900),
                'label': ui.get('label', meta.get('name', d)),
                'defaults': ui.get('defaults', {}),
            })
        skills.sort(key=lambda s: (s['order'], s['id']))
        with io.open(os.path.join(dst_as, 'manifest.json'), 'w', encoding='utf-8') as f:
            json.dump({'skills': skills}, f, ensure_ascii=False, indent=1)
        print('agent_skill: %d skills -> %s' % (len(skills), dst_as))
    src_am = os.path.join(ROOT, 'resource', 'agent_model')
    if os.path.isdir(src_am):
        dst_am = os.path.join(UI, 'agent_model')
        os.makedirs(dst_am, exist_ok=True)
        for fn in os.listdir(src_am):
            if fn.endswith('.json'):
                shutil.copy2(os.path.join(src_am, fn), os.path.join(dst_am, fn))
        print('agent_model presets copied -> %s' % dst_am)


def build_zcode_catalog():
    """把 ZCode 桌面端内置的 model-providers 目录（智谱维护的中国 LLM 双协议接入表）
    转换成 v3 的 HTTP 预设 ui/agent_model/zcode_catalog.json。
    providers 的 endpoints.paths: 'anthropic' → api_format=anthropic；'openai-compatible' → api_format=openai。
    每家 provider 每种协议出一条预设（默认取目录首个模型），其余模型在编辑框自行替换。"""
    appdata = os.environ.get('LOCALAPPDATA', '')
    mdir = os.path.join(appdata, 'Programs', 'ZCode', 'resources', 'model-providers')
    src = None
    if os.path.isdir(mdir):
        for fn in sorted(os.listdir(mdir)):
            if fn.endswith('.json'):
                src = os.path.join(mdir, fn)
    if not src:
        print('zcode catalog: 未找到（跳过，不影响构建）')
        return
    try:
        with io.open(src, encoding='utf-8') as f:
            cat = json.load(f)
    except Exception as e:
        print('zcode catalog: 解析失败 %s（跳过）' % e)
        return
    presets = []
    for p in cat.get('providers', []):
        ep = p.get('endpoints') or {}
        base = (ep.get('baseURL') or '').rstrip('/')
        paths = ep.get('paths') or {}
        models = [m.get('id') for m in (p.get('models') or []) if m.get('id')]
        for kind, fmt in (('anthropic', 'anthropic'), ('openai-compatible', 'openai')):
            path = paths.get(kind)
            if not base or not path or not models:
                continue
            presets.append({
                'id': 'zc-%s-%s' % (p.get('id', ''), fmt),
                'name': p.get('name', p.get('id', '')),
                'api_format': fmt,
                'api_url': base + '/' + path.lstrip('/'),
                'model_id': models[0],
                'models': models[:6],
                'source': 'ZCode 目录',
            })
    dst = os.path.join(UI, 'agent_model', 'zcode_catalog.json')
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    with io.open(dst, 'w', encoding='utf-8') as f:
        json.dump({'source': os.path.basename(src), 'presets': presets}, f, ensure_ascii=False, indent=1)
    print('zcode catalog: %d providers -> %d 预设（%s）' % (len(cat.get('providers', [])), len(presets), os.path.basename(dst)))


def main():
    if '--snapshot' in sys.argv:
        snapshot()
        if '--only-snapshot' in sys.argv:
            return 0
    base = v2_src()

    css = '\n'.join([read(base, c) for c in V2_CSS] + [read(SRC, c) for c in V3_CSS])
    body = '\n'.join([read(base, b) for b in V2_BODY] + [read(SRC, b) for b in V3_BODY])
    js_parts = []
    for j in V2_JS:
        txt = read(base, j)
        if j.endswith('00_v1_app.js'):
            txt = patch_v1.patch_v1_namespaces(txt)   # v3beta：命名分支合并
        js_parts.append('/* ===== %s ===== */\n' % j + txt)
    for j in V3_JS:
        js_parts.append('/* ===== %s ===== */\n' % j + read(SRC, j))
    for j in V2_JS_LATE:
        js_parts.append('/* ===== %s ===== */\n' % j + read(base, j))
    js = '\n'.join(js_parts)
    js, pruned = patch_v1.prune_plant_icons(js)   # v3beta 构建期优化：未引用图鉴图标 → 1px 占位
    if pruned:
        print('icons pruned (unreferenced -> placeholder):', pruned)

    html = (
        '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        '<title>无尽布阵工具 v4（布阵 + Agent 工作台）</title>\n'
        '<style>\n' + css + '\n</style>\n</head>\n<body>\n' + body + '\n'
        '<script>\n' + js + '\n</script>\n</body>\n</html>\n'
    )
    os.makedirs(UI, exist_ok=True)
    out = os.path.join(UI, 'index.html')
    with io.open(out, 'w', encoding='utf-8', newline='\n') as f:
        f.write(html)
    print('built %s (%d chars, v2 base: %s)' % (out, len(html), base))
    build_resources()
    build_zcode_catalog()
    for a, b in (('{', '}'), ('[', ']'), ('(', ')')):
        ca, cb = js.count(a), js.count(b)
        if ca != cb:
            print('WARN: js 括号 %s%s 数量 %d != %d %s%s（含字符串内字符，仅供参考）' % (a, b, ca, cb, b, a))
    return 0


if __name__ == '__main__':
    sys.exit(main())
