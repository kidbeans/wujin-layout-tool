# -*- coding: utf-8 -*-
"""v3 ui 渲染冒烟：无头 Edge 加载 ui/index.html，验证帮助视图挂载与切页。
2026-09-14 修复：UI 路径原硬编码指向旧 无尽布阵工具v3beta 目录（冒烟从未覆盖 v4 产物）；
现默认取本工程 ui/index.html（可用环境变量 SMOKE_UI 覆盖）。"""
import asyncio
import os
import sys

_DEF_UI = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'ui', 'index.html'))
UI = os.environ.get('SMOKE_UI') or _DEF_UI
EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"


def _pick_ui():
    """优先本工程 ui/index.html；不存在时回退旧 v3beta 布局（历史兼容）。"""
    if os.path.isfile(UI):
        return UI
    legacy = r"E:\app\backup_mpz_scripts\布阵工具\无尽布阵工具v3beta\ui\index.html"
    if os.path.isfile(legacy):
        return legacy
    return UI


async def main():
    from playwright.async_api import async_playwright
    global UI
    UI = _pick_ui()
    print("smoke ui:", UI)
    errors = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path=EXE, headless=True,
                                           args=["--no-first-run", "--no-sandbox"])
        page = await browser.new_page()
        benign = ("Access to fetch", "ERR_FAILED", "CORS", "Failed to load resource")
        page.on("pageerror", lambda e: errors.append("pageerror: " + str(e)))
        page.on("console", lambda m: errors.append("console.error: " + m.text)
                if m.type == "error" and not any(b in m.text for b in benign) else None)
        await page.goto("file:///" + UI.replace("\\", "/"), wait_until="load")
        await page.wait_for_timeout(600)

        r = {}
        r["helpBody 在 v3view-help 内"] = await page.evaluate(
            "!!document.querySelector('#v3view-help #helpBody')")
        r["body 直下无裸露 helpBody"] = await page.evaluate(
            "Array.from(document.body.children).filter(e=>e.id==='helpBody').length === 0")
        r["TOC 已生成"] = await page.evaluate("document.querySelectorAll('#v3helpToc a').length") >= 10
        r["rail 有帮助按钮"] = await page.evaluate(
            "!!document.querySelector('#v3rail .v3ni[data-view=\"help\"]')")

        # 点击 rail 帮助 → 视图切换
        await page.click('#v3rail .v3ni[data-view="help"]')
        await page.wait_for_timeout(200)
        r["点击后帮助视图打开"] = await page.evaluate(
            "document.getElementById('v3view-help').classList.contains('on') && "
            "getComputedStyle(document.getElementById('v3view-help')).display !== 'none'")
        r["布阵视图关闭"] = await page.evaluate(
            "!document.getElementById('v3view-formation').classList.contains('on')")
        h2 = await page.evaluate("document.querySelector('#v3view-help #helpBody h2')")
        r["正文可见(快速上手)"] = bool(h2)

        # F1 关闭回布阵
        await page.keyboard.press("F1")
        await page.wait_for_timeout(200)
        r["F1 后帮助关闭"] = await page.evaluate(
            "!document.getElementById('v3view-help').classList.contains('on')")

        # 主题弹窗
        await page.click("#v3tbTheme")
        await page.wait_for_timeout(150)
        r["主题弹窗打开"] = await page.evaluate(
            "document.getElementById('v2themePop').classList.contains('on')")
        r["弹窗含 11 预设"] = await page.evaluate(
            "document.querySelectorAll('#v2themePop .tp-item').length") == 11
        await page.click("#v2themePop .tp-item[data-t='glass']")
        await page.wait_for_timeout(150)
        r["毛玻璃主题生效"] = await page.evaluate(
            "document.body.classList.contains('t-glass') && document.body.classList.contains('maa')")
        await page.click("#v2themePop .tp-item[data-t='aurora']")
        await page.wait_for_timeout(150)
        r["极光弥散层生效"] = await page.evaluate(
            "document.body.classList.contains('t-aurora') && document.body.classList.contains('t-grad') && "
            "getComputedStyle(document.body,'::before').backgroundImage.includes('radial-gradient')")
        r["预设主题侧栏毛玻璃跟随"] = await page.evaluate(
            "document.body.classList.contains('shell-glass') && "
            "getComputedStyle(document.getElementById('v3rail')).backdropFilter.includes('blur')")
        await page.click("#v2themePop .tp-item[data-t='sunset']")
        await page.wait_for_timeout(150)
        r["暮霞弥散层生效"] = await page.evaluate(
            "document.body.classList.contains('t-sunset') && "
            "getComputedStyle(document.body,'::before').backgroundImage.includes('radial-gradient')")
        await page.click("#v2themePop .tp-item[data-t='brand']")
        await page.wait_for_timeout(150)
        r["DSH 品牌蓝生效(浅色基底)"] = await page.evaluate(
            "document.body.classList.contains('t-brand') && !document.body.classList.contains('maa') && "
            "getComputedStyle(document.body).getPropertyValue('--v3-accent').includes('4d6bfe')")
        await page.click("#v2themePop .tp-item[data-t='success']")
        await page.wait_for_timeout(150)
        r["翠绿浅色基底生效"] = await page.evaluate(
            "!document.body.classList.contains('maa') && "
            "getComputedStyle(document.body).getPropertyValue('--accent-blue').includes('#059669')")
        await page.click("#v2themePop .tp-item[data-t='paper']")
        await page.wait_for_timeout(150)
        r["DSH 纸白生效(浅色系)"] = await page.evaluate(
            "document.body.classList.contains('t-paper') && !document.body.classList.contains('maa')")
        await page.click("#v2themePop .tp-item[data-t='light']")
        await page.wait_for_timeout(150)
        r["切回浅色"] = await page.evaluate(
            "!document.body.classList.contains('maa') && !document.body.classList.contains('t-glass')")

        # 换肤中心视图
        await page.click('#v3rail .v3ni[data-view="skin"]')
        await page.wait_for_timeout(250)
        r["换肤中心卡片=11"] = await page.evaluate(
            "document.getElementById('v3skinGrid') && document.querySelectorAll('#v3skinGrid .v3skin-card').length") == 11
        await page.click("#v3skinGrid .v3skin-card[data-t='sunset']")
        await page.wait_for_timeout(200)
        r["卡片即点即换(暮霞)"] = await page.evaluate(
            "document.body.classList.contains('t-sunset') && "
            "document.querySelector(\"#v3skinGrid .v3skin-card[data-t='sunset']\").classList.contains('on')")

        # 自定义：卡片点击 → 内嵌设置面板显示；壁纸层生效
        await page.click("#v3skinGrid .v3skin-card[data-t='custom']")
        await page.wait_for_timeout(200)
        r["自定义设置面板显示"] = await page.evaluate(
            "document.getElementById('v3skinCustom').style.display === 'block'")
        await page.evaluate(
            "v2Theme.custom.wall = { src: 'https://example.com/bg.jpg', opacity: 0.6, blur: 4 }; "
            "v2Theme.apply('custom')")
        await page.wait_for_timeout(150)
        r["壁纸层挂载并生效"] = await page.evaluate(
            "document.body.classList.contains('wall-on') && document.body.classList.contains('t-grad') && "
            "document.getElementById('v3wall').style.backgroundImage.includes('example.com')")
        r["侧栏/标题栏毛玻璃跟随"] = await page.evaluate(
            "document.body.classList.contains('shell-glass') && "
            "getComputedStyle(document.getElementById('v3rail')).backdropFilter.includes('blur')")
        await page.evaluate("v2Theme.custom.wall = null; v2Theme.apply('custom')")

        # 顺序面板 + 金卡推演按钮存在
        await page.click('#v3rail .v3ni[data-panel="order"]')
        await page.wait_for_timeout(150)
        r["顺序面板含金卡推演按钮"] = await page.evaluate(
            "!!document.getElementById('ordGold') && !!document.getElementById('ordVis')")

        # 官方画像：通用框架卡片有导入/导出入口
        await page.click('#v3rail .v3ni[data-panel="presets"]')
        await page.wait_for_timeout(250)
        r["画像通用框架导入入口"] = await page.evaluate(
            "!!document.getElementById('offFrameImport') && !!document.getElementById('offFrameExport')")

        await browser.close()

    fails = 0
    for k, v in r.items():
        print(("ok   " if v else "FAIL ") + k)
        if not v:
            fails += 1
    if errors:
        print("\n-- 页面错误 --")
        for e in errors[:8]:
            print(" ", e[:200])
        fails += 1
    print("\n" + ("SMOKE FAIL" if fails else "SMOKE ALL PASS"))
    sys.exit(1 if fails else 0)


asyncio.run(main())
