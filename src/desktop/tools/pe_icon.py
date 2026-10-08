# -*- coding: utf-8 -*-
"""从 PE 文件（exe）提取第一图标组并保存为 png（权威验证内嵌图标，不依赖 GDI）。
用法：python tools/pe_icon.py <exe> <out.png>"""
import os
import struct
import sys

import PIL.Image


def read_resource_dir(data, res_base, offset):
    """遍历资源目录（offset/res_base 均为文件偏移），叶子为 (data_rva, size)。"""
    _, _, _, _, named, ided = struct.unpack_from('<IIHHHH', data, offset)
    out = {}
    for i in range(named + ided):
        name_id, val_off = struct.unpack_from('<II', data, offset + 16 + i * 8)
        if val_off & 0x80000000:
            out[name_id] = read_resource_dir(data, res_base, res_base + (val_off & 0x7FFFFFFF))
        else:
            doff = res_base + val_off
            out[name_id] = struct.unpack_from('<II', data, doff)   # data_rva, size
    return out


def rva_to_offset(data, rva, sections):
    for sva, sraw, ssz, srawptr in sections:
        if sva <= rva < sva + max(ssz, sraw):
            return srawptr + (rva - sva)
    return None


def extract_first_icon_group(path):
    data = open(path, 'rb').read()
    e_lfanew = struct.unpack_from('<I', data, 0x3C)[0]
    assert data[e_lfanew:e_lfanew + 4] == b'PE\0\0', 'not PE'
    coff = e_lfanew + 4
    nsec, _, _, _, opt_size, _ = struct.unpack_from('<HIIIHH', data, coff + 2)
    opt = coff + 20
    magic = struct.unpack_from('<H', data, opt)[0]
    dd_off = opt + 112 if magic == 0x20b else opt + 96   # PE32+ / PE32 数据目录起点
    res_rva, res_size = struct.unpack_from('<II', data, dd_off + 2 * 8)  # dir[2] = resources
    secs = []
    sec_off = opt + opt_size
    for i in range(nsec):
        name = data[sec_off:sec_off + 8].rstrip(b'\0')
        ssz, sva, sraw, srawptr = struct.unpack_from('<IIII', data, sec_off + 8)
        secs.append((sva, sraw, ssz, srawptr))
        sec_off += 40
    res_off = rva_to_offset(data, res_rva, secs)
    tree = read_resource_dir(data, res_off, res_off)
    # RT_ICON=3, RT_GROUP_ICON=14
    groups = tree.get(14) or tree.get(3)
    if groups is None:
        return None
    gid = sorted(groups.keys())[0]
    leaves = groups[gid]
    icon_id = sorted(leaves.keys())[0]
    rva, size = leaves[icon_id]
    grp = data[rva_to_offset(data, rva, secs): rva_to_offset(data, rva, secs) + size]
    # ICONDIRENTRY: reserved(2) type(2) count(2) then entries of 14 bytes (id-based)
    _, _, cnt = struct.unpack_from('<HHH', grp, 0)
    entries = []
    blobs = []
    for i in range(cnt):
        w, h, colors, _, planes, bpp, sz, rid = struct.unpack_from('<BBBBHHIH', grp, 6 + i * 14)
        rt = tree[3][rid]
        rva2, size2 = sorted(rt.values())[0]
        off2 = rva_to_offset(data, rva2, secs)
        blobs.append(data[off2:off2 + size2])
        entries.append((w or 256, h or 256, colors, planes, bpp, size2))
    out = struct.pack('<HHH', 0, 1, cnt)
    body_off = 6 + cnt * 16
    parts = []
    for (w, h, colors, planes, bpp, sz), blob in zip(entries, blobs):
        out += struct.pack('<BBBBHHII', w % 256, h % 256, colors, 0, planes, bpp, sz, body_off)
        body_off += sz
    for blob in blobs:
        out += blob
    return out


def main():
    exe, out_png = sys.argv[1], sys.argv[2]
    ico = extract_first_icon_group(exe)
    if not ico:
        sys.exit('no icon group')
    tmp = out_png + '.ico'
    with open(tmp, 'wb') as f:
        f.write(ico)
    im = PIL.Image.open(tmp).convert('RGBA')
    im.save(out_png)
    print('%s -> %s (%sx%s)' % (os.path.basename(exe), out_png, im.size[0], im.size[1]))
    os.remove(tmp)
    return 0


if __name__ == '__main__':
    sys.exit(main())
