# -*- coding: utf-8 -*-
"""重新生成 checksums.sha256（三个发布件：手机/网页版 index.html + 桌面客户端两个 exe）。

改了任何一个发布件都要跑一次，否则 CI 的「核对已发布文件 SHA256」会红。

用法： python tools/gen_checksums.py            # 写到仓库根 checksums.sha256
      python tools/gen_checksums.py --check    # 只校验，不写（CI 用 sha256sum -c 亦可）
"""
import hashlib
import io
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = ['WujinLayoutTool-v4.0.8-portable.exe', 'WujinLayoutTool-v4.0.8-setup.exe', 'index.html']
OUT = os.path.join(ROOT, 'checksums.sha256')


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def main():
    check = '--check' in sys.argv[1:]
    rows, bad = [], []
    for name in FILES:
        p = os.path.join(ROOT, name)
        if not os.path.exists(p):
            print('  缺少 %s（跳过）' % name)
            continue
        digest = sha256(p)
        rows.append('%s  %s' % (digest, name))
        print('  %-38s %s' % (name, digest[:16] + '…'))
    if check:
        old = io.open(OUT, encoding='utf-8').read().split('\n') if os.path.exists(OUT) else []
        old = [l for l in old if l.strip()]
        if old != rows:
            print('  ✗ checksums.sha256 与当前文件不一致（需重新生成）')
            return 1
        print('  ✓ checksums.sha256 与当前文件一致')
        return 0
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write('\n'.join(rows) + '\n')
    print('已写', OUT)
    return 0


if __name__ == '__main__':
    sys.exit(main())
