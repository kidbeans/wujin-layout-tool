# -*- coding: utf-8 -*-
"""生成 Tauri 应用图标 → src-tauri/icons/。
图标源优先级：--src 指定 > 大哥（超级机枪射手）图鉴头像（v2 icon_cache） > v2 shell_assets/logo.ico。
产物：icon.ico（多尺寸）、32x32.png、128x128.png、128x128@2x.png、icon.png（512）。
需要 Pillow（v2 工程已用过）。"""
import os
import sys

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V2 = os.path.join(os.path.dirname(ROOT), '无尽布阵工具v2')
SRC_BROTHER = os.path.join(V2, 'tools', 'icon_cache', '超级机枪射手.jpg')   # 大哥=超级机枪射手
SRC_LOGO = os.path.join(V2, 'shell_assets', 'logo.ico')
OUT = os.path.join(ROOT, 'src-tauri', 'icons')


def pick_source(argv):
    for i, a in enumerate(argv):
        if a == '--src' and i + 1 < len(argv):
            return argv[i + 1]
    if os.path.isfile(SRC_BROTHER):
        return SRC_BROTHER
    return SRC_LOGO


def main():
    src = pick_source(sys.argv)
    if not os.path.isfile(src):
        sys.exit('找不到源图标 %s' % src)
    print('icon source: %s' % src)
    im = Image.open(src)
    best = im.convert('RGBA')
    w, h = best.size
    side = max(w, h)
    canvas = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    canvas.paste(best, ((side - w) // 2, (side - h) // 2))
    # 120px 小图放大到 512 时先放大原图再做尺寸缩放，边缘更平滑
    if side < 240:
        canvas = canvas.resize((side * 4, side * 4), Image.LANCZOS)
        side = side * 4

    os.makedirs(OUT, exist_ok=True)
    targets = {
        '32x32.png': 32,
        '128x128.png': 128,
        '128x128@2x.png': 256,
        'icon.png': 512,
    }
    for name, px in targets.items():
        img = canvas.resize((px, px), Image.LANCZOS)
        img.save(os.path.join(OUT, name))
        print('write %s (%dx%d)' % (name, px, px))
    canvas.save(os.path.join(OUT, 'icon.ico'), sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print('write icon.ico (multi-size)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
