# -*- coding: utf-8 -*-
"""可读性验证：复现用户场景（钢地刺+小守卫菇、气流水仙花等）并截棋盘。"""
import asyncio

UI = r"E:\app\backup_mpz_scripts\布阵工具\无尽布阵工具v3beta\ui\index.html"
OUT = r"E:\app\backup_mpz_scripts\布阵工具\无尽布阵工具v3beta\docs\_txt_preview.png"
EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

JS = """
(function(){
function mk(base, vine){ return { base: base, merge: '', vine: vine || '', tile: false, ops: [] }; }
grid[4][2] = mk('钢地刺', '小守卫菇');   /* 5-3 */
grid[0][0] = mk('气流水仙花');
grid[1][1] = mk('大哥', '电豌');
grid[3][5] = mk('仙桃', '小守卫菇');
grid[2][3] = mk('洋芋');
buildAllChips(); renderGrid();
})()
"""


async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path=EXE, headless=True,
                                           args=["--no-first-run", "--no-sandbox"])
        page = await browser.new_page(viewport={"width": 1500, "height": 960})
        await page.goto("file:///" + UI.replace("\\", "/"), wait_until="load")
        await page.wait_for_timeout(500)
        await page.evaluate(JS)
        await page.wait_for_timeout(700)
        el = await page.query_selector("#grid")
        await el.screenshot(path=OUT)
        print("shot ok")
        await browser.close()


asyncio.run(main())
