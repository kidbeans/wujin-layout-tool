# -*- coding: utf-8 -*-
"""无尽布阵工具 v4 一键构建：ui → 图标 → cargo release → NSIS 安装包 →
dist_shell/ 汇集产物，并把三交付物（网页 / 便携 exe / NSIS 安装包）刷新到 v4 包根。

用法：
  python tools/build_app.py            # 全流程（前端 + 桌面壳 + 安装包 + 网页交付物）
  python tools/build_app.py --fast     # 只重拼 ui 并刷新包根网页（前端改动，不重编 exe）
前置：rustup msvc 工具链（cargo 在 PATH）；npx（Node 18+）。

覆盖包根既有交付物前先打时间戳备份（*.bak.YYYYMMDD_HHMMSS）；目标被占用（程序正开着）
时只告警、不中断，新产物仍保留在 src-tauri/target/release 与 dist_shell。
"""
import os
import shutil
import subprocess
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))     # source/app
TAURI = os.path.join(ROOT, 'src-tauri')
DIST_SHELL = os.path.join(ROOT, 'dist_shell')
UI = os.path.join(ROOT, 'ui')
PKG = os.path.normpath(os.path.join(ROOT, '..', '..'))                 # v4 包根
HTML_NAME = '无尽布阵工具.html'
EXE_NAME = '无尽布阵工具v4.exe'


def run(cmd, cwd=ROOT, check=True):
    print('[run] %s (cwd=%s)' % (' '.join(cmd), cwd))
    r = subprocess.run(cmd, cwd=cwd)
    if check and r.returncode != 0:
        sys.exit('步骤失败：%s' % ' '.join(cmd))
    return r


def stamp():
    return time.strftime('%Y%m%d_%H%M%S')


def copy_bak(src, dst, tag):
    """把 src 复制到 dst；若 dst 已存在先打时间戳备份。src 缺失则跳过；
    dst 被占用只告警不中断（新产物仍在构建目录）。"""
    if not src or not os.path.isfile(src):
        return False
    if os.path.abspath(src) == os.path.abspath(dst):
        return False
    if os.path.isfile(dst):
        bak = dst + '.bak.' + stamp()
        try:
            shutil.copy2(dst, bak)
            print('[bak] %s -> %s' % (os.path.basename(dst), os.path.basename(bak)))
        except PermissionError:
            print('WARN: %s 被占用，未备份；新产物在 %s' % (dst, src))
            return False
    try:
        shutil.copy2(src, dst)
        print('copy -> %s  [%s]' % (dst, tag))
        return True
    except PermissionError:
        print('WARN: 目标被占用（程序可能正开着），未覆盖 %s；新产物在 %s' % (dst, src))
        return False


def latest(paths):
    exist = [p for p in paths if os.path.isfile(p)]
    return max(exist, key=os.path.getmtime) if exist else ''


def main():
    fast = '--fast' in sys.argv
    run([sys.executable, 'build.py'], cwd=ROOT)

    # 网页交付物：ui/index.html 改名到 v4 包根（纯前端，fast/full 都刷新）
    copy_bak(os.path.join(UI, 'index.html'), os.path.join(PKG, HTML_NAME), '网页')

    exe = setup = ''
    if not fast:
        if not os.path.isfile(os.path.join(TAURI, 'icons', 'icon.ico')):
            run([sys.executable, os.path.join('tools', 'gen_icons.py')], cwd=ROOT)
        run(['cargo', 'build', '--release'], cwd=TAURI)
        npx = shutil.which('npx') or 'npx.cmd'   # Windows 下 npx 是 .cmd，须解析全路径
        run([npx, '--yes', '@tauri-apps/cli@2', 'build'], cwd=ROOT)

        # mainBinaryName 改名后优先取 wujin-bz-v4.exe，回退旧 bin 名 wujin-bz-v3beta.exe
        rel = os.path.join(TAURI, 'target', 'release')
        exe = latest([os.path.join(rel, 'wujin-bz-v4.exe'), os.path.join(rel, 'wujin-bz-v3beta.exe')])
        nsis_dir = os.path.join(rel, 'bundle', 'nsis')
        if os.path.isdir(nsis_dir):
            setups = sorted(
                (os.path.join(nsis_dir, f) for f in os.listdir(nsis_dir) if f.endswith('_x64-setup.exe')),
                key=os.path.getmtime)
            setup = setups[-1] if setups else ''

        # dist_shell 汇集（沿用旧行为）
        if exe or setup:
            os.makedirs(DIST_SHELL, exist_ok=True)
            copy_bak(exe, os.path.join(DIST_SHELL, EXE_NAME), 'dist-shell exe')
            copy_bak(setup, os.path.join(DIST_SHELL, os.path.basename(setup)), 'dist-shell setup')

        # 包根交付物：便携 exe + NSIS 安装包（安装包按版本命名，通常不覆盖旧版）
        copy_bak(exe, os.path.join(PKG, EXE_NAME), '便携 exe')
        copy_bak(setup, os.path.join(PKG, os.path.basename(setup)), '安装包')
    else:
        print('[fast] 仅刷新网页交付物；exe 内嵌 ui 需完整构建（去掉 --fast）才会更新')

    print('done.  包根=%s  网页=%s  exe=%s  setup=%s'
          % (PKG, os.path.isfile(os.path.join(PKG, HTML_NAME)),
             os.path.basename(exe) if exe else '(未重建)',
             os.path.basename(setup) if setup else '(未重建)'))
    return 0


if __name__ == '__main__':
    sys.exit(main())
