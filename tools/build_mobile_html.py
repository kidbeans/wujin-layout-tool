# -*- coding: utf-8 -*-
"""无尽布阵工具 v4 → 手机版单文件 HTML 打包器（幂等）。

输入：v4/无尽布阵工具.html（v4 官方的**单文件网页版**，自身已零外部依赖）
      + v4/mobile/mobile_layer.css / mobile_layer.js（手机适配层，改动源）
输出：v4/无尽布阵工具_手机版.html（一个文件，直接传到手机浏览器打开）

注入内容（不改动 v4 原有 CSS/JS 一个字）：
  1) viewport 升级：width=device-width, initial-scale=1.0, viewport-fit=cover（保留双指缩放）
  2) 三个 meta：theme-color / mobile-web-app-capable / apple-mobile-web-app-capable（可「添加到主屏幕」）
  3) <style id="mpzMobileCss"> 手机版 CSS（板宽 clamp 自适应、触控可点性、safe-area、隐藏桌面窗口按钮）
  4) <script id="mpzMobileJs"> 手机版脚本（长按清格、长按看提示、首开操作提示条）

幂等：产物里带标记注释；重复运行会先剥掉上一次注入再重注入（改 mobile_layer.css/js 后重跑即可）。

用法： python build_mobile_html.py [--check] [--src 基座HTML] [--css 手机层CSS] [--js 手机层JS] [--out 产物]
      --check 只做静态体检（自包含/标记/体积/JS 语法），不写文件。
      默认路径 = 本脚本所在目录的上一级（本地开发布局 v4/）；仓库里用 --src/--css/--js/--out 指到 src/ 与根 index.html。
"""
import io
import os
import re
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
V4 = os.path.dirname(HERE)
SRC = os.path.join(V4, '无尽布阵工具.html')
CSS = os.path.join(V4, 'mobile', 'mobile_layer.css')
JS = os.path.join(V4, 'mobile', 'mobile_layer.js')
OUT = os.path.join(V4, '无尽布阵工具_手机版.html')

BEGIN = '<!-- ===== MPZ MOBILE LAYER BEGIN（由 tools/build_mobile_html.py 注入；勿手改产物） ===== -->'
END = '<!-- ===== MPZ MOBILE LAYER END ===== -->'
LAYER_RE = re.compile(re.escape(BEGIN) + r'.*?' + re.escape(END) + r'\n?', re.S)

VIEWPORT_OLD = '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
VIEWPORT_NEW = '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">'
EXTRA_META = ('<meta name="theme-color" content="#0c121e">\n'
              '<meta name="mobile-web-app-capable" content="yes">\n'
              '<meta name="apple-mobile-web-app-capable" content="yes">\n'
              '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'
              '<meta name="apple-mobile-web-app-title" content="无尽布阵">')


def read(p):
    return io.open(p, encoding='utf-8').read()


def strip_layer(html):
    """剥掉上一次注入（幂等/可升级）——与 patch() 互为逆操作。"""
    n = len(LAYER_RE.findall(html))
    html = LAYER_RE.sub('', html)
    html = html.replace(VIEWPORT_NEW + '\n' + EXTRA_META, VIEWPORT_OLD)   # viewport/meta 还原
    return html, n


def build_layer(css, js):
    return '\n'.join([
        BEGIN,
        '<style id="mpzMobileCss">',
        css.rstrip(),
        '</style>',
        '<script id="mpzMobileJs">',
        js.rstrip(),
        '</script>',
        END,
    ])


def patch(src_html, layer):
    html, stripped = strip_layer(src_html)
    if VIEWPORT_OLD not in html:
        raise SystemExit('找不到原始 viewport 行，v4 结构可能已变：%r' % VIEWPORT_OLD)
    html = html.replace(VIEWPORT_OLD, VIEWPORT_NEW + '\n' + EXTRA_META, 1)
    if '</body>' not in html:
        raise SystemExit('找不到 </body>，无法注入')
    html = html.replace('</body>', layer + '\n</body>', 1)
    return html, stripped


def static_check(html, js_path):
    errs, notes = [], []
    if LAYER_RE.search(html) is None:
        errs.append('注入标记缺失')
    if re.search(r'<script[^>]+src=', html):
        errs.append('出现了外部脚本引用（应保持自包含）')
    if re.search(r'<link[^>]+rel=["\']?stylesheet', html):
        errs.append('出现了外部样式表引用（应保持自包含）')
    if 'viewport-fit=cover' not in html:
        errs.append('viewport 未升级')
    for k in ('theme-color', 'apple-mobile-web-app-capable'):
        if k not in html:
            errs.append('缺少 meta: ' + k)
    # 手机层 JS 语法检查（node 在则跑）
    try:
        r = subprocess.run(['node', '--check', js_path], capture_output=True, text=True, timeout=60)
        if r.returncode != 0:
            errs.append('手机层 JS 语法错误: ' + (r.stderr or '').strip()[:400])
        else:
            notes.append('node --check 手机层 JS：通过')
    except (OSError, subprocess.SubprocessError):
        notes.append('未找到 node，跳过 JS 语法检查')
    return errs, notes


def main():
    global SRC, CSS, JS, OUT
    args = sys.argv[1:]
    do_check = '--check' in args

    def opt(name):
        return args[args.index(name) + 1] if name in args else None

    SRC = opt('--src') or SRC
    CSS = opt('--css') or CSS
    JS = opt('--js') or JS
    OUT = opt('--out') or OUT

    src = read(SRC)
    css, js = read(CSS), read(JS)
    layer = build_layer(css, js)
    html, stripped = patch(src, layer)
    errs, notes = static_check(html, JS)
    # v4 原文未改动检查：把注入层剥掉后必须与源文件逐字节相等
    back, _ = strip_layer(html)
    if back != src:
        errs.append('剥离注入层后与 v4 原文不一致（说明改动越界了）')
    else:
        notes.append('剥离注入层 == v4 原文（原有 CSS/JS 一字未动）')
    info = [
        'v4 源文件: %.2f MB' % (len(src) / 1048576.0),
        '手机适配层: CSS %d 字 / JS %d 字' % (len(css), len(js)),
        '产物: %.2f MB（+%d 字节）' % (len(html) / 1048576.0, len(html) - len(src)),
        '本次剥掉旧注入层: %d 处' % stripped,
    ]
    for m in info:
        print('  ' + m)
    for m in notes:
        print('  ' + m)
    if errs:
        for e in errs:
            print('[FAIL]', e)
        raise SystemExit('静态体检未通过，不写文件')
    if do_check:
        print('--check：仅体检，未写文件')
        return 0
    if os.path.exists(OUT):
        bak = OUT + '.bak.' + time.strftime('%Y%m%d_%H%M%S')
        io.open(bak, 'w', encoding='utf-8', newline='\n').write(read(OUT))
        print('  备份旧产物 →', os.path.basename(bak))
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(html)
    print('OK ->', OUT)
    return 0


if __name__ == '__main__':
    sys.exit(main())
