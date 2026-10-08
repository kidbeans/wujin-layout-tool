# -*- coding: utf-8 -*-
"""无尽布阵工具 v4 · 本机 WebUI 服务（浏览器回退形态）
====================================================
纯 Python 标准库（http.server），无第三方依赖；只绑定 127.0.0.1，不对外网暴露。

与 v2 webui 的差异：
  - 服务 ui/index.html（build.py 产物，v3 chrome 壳）
  - 默认端口 8766（避免与 v2 服务并存时冲突）
  - 「再生成预设」调用 v2 工程 tools/gen_presets.py + gen_official.py（预设数据同源）

用法：python webui.py [--port 8766] [--mpz E:/app/MaaPVZ-win-x86_64]
"""
import argparse
import json
import os
import subprocess
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs, unquote

if getattr(sys, 'frozen', False):
    HERE = getattr(sys, '_MEIPASS', os.path.dirname(sys.executable))
    EXE_DIR = os.path.dirname(sys.executable)
else:
    HERE = os.path.dirname(os.path.abspath(__file__))
    EXE_DIR = None
PROJ = HERE if not EXE_DIR else EXE_DIR                      # v3 工程根（源码模式）
V2_TOOLS = os.path.join(os.path.dirname(HERE), '无尽布阵工具v2', 'tools')   # v2 生成器目录（源码模式）
DIST_HTML = os.path.join(HERE if not EXE_DIR else HERE, 'ui', 'index.html')
DEFAULT_MPZ = r'E:\app\MaaPVZ-win-x86_64'
VER = '3.0'

MPZ = DEFAULT_MPZ
ROOTS = {}


def setup_roots(mpz):
    global MPZ, ROOTS
    MPZ = os.path.realpath(mpz)
    ROOTS = {
        'mpz': MPZ,
        'proj': os.path.realpath(EXE_DIR if EXE_DIR else os.path.join(HERE, '..')),   # 布阵工具/
    }
    for k, v in ROOTS.items():
        if not os.path.isdir(v):
            print('[warn] 根目录不存在: %s -> %s' % (k, v))


def safe_resolve(keypath):
    if ':' not in keypath:
        return None
    key, rel = keypath.split(':', 1)
    if key not in ROOTS:
        return None
    p = os.path.realpath(os.path.join(ROOTS[key], unquote(rel)))
    root = os.path.realpath(ROOTS[key])
    if p != root and not p.startswith(root + os.sep):
        return None
    return p


def walk_files(base, sub, exts, limit=4000):
    out = []
    root = os.path.join(base, sub)
    if not os.path.isdir(root):
        return out
    for dirpath, _dirs, files in os.walk(root):
        for fn in files:
            if os.path.splitext(fn)[1].lower() in exts:
                full = os.path.join(dirpath, fn)
                rel = os.path.relpath(full, base).replace('\\', '/')
                try:
                    st = os.stat(full)
                    out.append({'path': rel, 'name': fn, 'size': st.st_size, 'mtime': int(st.st_mtime)})
                except OSError:
                    pass
        if len(out) > limit:
            break
    out.sort(key=lambda x: x['path'])
    return out


def keyed(items, k):
    return [dict(x, path=k + ':' + x['path']) for x in items]


def api_list():
    groups = {
        'pipe': (keyed(walk_files(MPZ, 'resource_self/pipeline', {'.json'}), 'mpz') +
                 keyed(walk_files(MPZ, os.path.join('resource', 'pipeline', 'Endless'), {'.json'}), 'mpz')),
        'task': (keyed(walk_files(MPZ, 'resource_self/task', {'.json'}), 'mpz') +
                 keyed(walk_files(MPZ, os.path.join('resource', 'task', 'Endless'), {'.json'}), 'mpz')),
        'iface': [],
        'logs': keyed(walk_files(MPZ, 'debug', {'.log', '.txt'}), 'mpz'),
    }
    for cand in ('interface.json', 'resource_self/interface.json'):
        p = os.path.join(MPZ, cand)
        if os.path.isfile(p):
            st = os.stat(p)
            groups['iface'].append({'path': 'mpz:' + cand.replace('\\', '/'), 'name': os.path.basename(cand),
                                    'size': st.st_size, 'mtime': int(st.st_mtime)})
    return {'groups': groups}


class Handler(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def _send(self, code, body, ctype='application/json; charset=utf-8'):
        data = body if isinstance(body, bytes) else json.dumps(body, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        pass

    def do_OPTIONS(self):
        self._send(204, b'')

    def do_GET(self):
        u = urlparse(self.path)
        qs = parse_qs(u.query)
        if u.path in ('/', '/index.html'):
            if os.path.isfile(DIST_HTML):
                with open(DIST_HTML, 'rb') as f:
                    self._send(200, f.read(), 'text/html; charset=utf-8')
            else:
                self._send(500, {'ok': False, 'err': 'ui/index.html 不存在，先 python build.py'})
            return
        # 静态资源：技能库 / 模型预设（build.py 拷到 ui/ 下；带路径穿越防护）
        if u.path.startswith('/agent_skill/') or u.path.startswith('/agent_model/'):
            base = os.path.realpath(os.path.join(HERE, 'ui'))
            p = os.path.realpath(os.path.join(base, unquote(u.path.lstrip('/'))))
            if not p.startswith(base + os.sep) or not os.path.isfile(p):
                self._send(404, {'ok': False, 'err': '资源不存在'})
                return
            ctype = 'application/json; charset=utf-8' if p.endswith('.json') else 'text/markdown; charset=utf-8'
            with open(p, 'rb') as f:
                self._send(200, f.read(), ctype)
            return
        if u.path == '/api/ping':
            self._send(200, {'ok': True, 'ver': VER, 'root': MPZ, 'roots': sorted(ROOTS.keys())})
            return
        if u.path == '/api/list':
            self._send(200, api_list())
            return
        if u.path == '/api/file':
            p = safe_resolve((qs.get('path') or [''])[0])
            if not p or not os.path.isfile(p):
                self._send(404, {'ok': False, 'err': '路径不在允许根内或不存在'})
                return
            try:
                with open(p, 'r', encoding='utf-8', errors='replace') as f:
                    text = f.read()
                self._send(200, {'ok': True, 'name': os.path.basename(p), 'text': text,
                                 'size': os.path.getsize(p), 'mtime': int(os.path.getmtime(p))})
            except OSError as e:
                self._send(500, {'ok': False, 'err': str(e)})
            return
        if u.path == '/favicon.ico':
            self._send(204, b'')
            return
        self._send(404, {'ok': False, 'err': 'no route: ' + u.path})

    def do_POST(self):
        u = urlparse(self.path)
        if u.path == '/api/genpresets':
            outs = []
            ok = True
            tools_dir = V2_TOOLS if os.path.isdir(V2_TOOLS) else os.path.join(HERE, 'tools')
            for script in ('gen_presets.py', 'gen_official.py'):
                sp = os.path.join(tools_dir, script)
                if not os.path.isfile(sp):
                    outs.append('[skip] %s 不存在' % sp)
                    continue
                try:
                    # 生成器产物写到 v2 工程 src/js/（预设数据同源），v3 构建时直接复用
                    r = subprocess.run([sys.executable, sp], cwd=os.path.dirname(tools_dir), capture_output=True,
                                       text=True, encoding='utf-8', errors='replace', timeout=120)
                    tail = (r.stdout or '') + (('\n[stderr] ' + r.stderr) if r.stderr.strip() else '')
                    outs.append('[%s] exit=%d\n%s' % (script, r.returncode, '\n'.join(tail.strip().splitlines()[-6:])))
                    if r.returncode != 0:
                        ok = False
                except Exception as e:
                    ok = False
                    outs.append('[%s] 异常: %s' % (script, e))
            self._send(200, {'ok': ok, 'tail': '\n'.join(outs)})
            return
        self._send(404, {'ok': False, 'err': 'no route: ' + u.path})


def start_server(port=8766, mpz=DEFAULT_MPZ):
    setup_roots(mpz)
    srv = ThreadingHTTPServer(('127.0.0.1', port), Handler)
    th = threading.Thread(target=srv.serve_forever, daemon=True)
    th.start()
    print('[webui] serving http://127.0.0.1:%d/  (MPZ=%s)' % (port, MPZ))
    return srv


def main():
    ap = argparse.ArgumentParser(description='无尽布阵工具 v4 本机 WebUI')
    ap.add_argument('--port', type=int, default=8766)
    ap.add_argument('--mpz', default=DEFAULT_MPZ, help='MPZ 安装根目录（只读访问）')
    args = ap.parse_args()
    srv = start_server(args.port, args.mpz)
    try:
        import webbrowser
        webbrowser.open('http://127.0.0.1:%d/' % args.port)
    except Exception:
        pass
    print('Ctrl+C 退出')
    try:
        while True:
            time.sleep(3600)
    except KeyboardInterrupt:
        srv.shutdown()
        print('bye')


if __name__ == '__main__':
    main()
