# -*- coding: utf-8 -*-
"""重拍芦荟 3×3 并放大单格诊断蓝底来源。"""
import asyncio

UI = r"E:\app\backup_mpz_scripts\布阵工具\无尽布阵工具v3beta\ui\index.html"
OUT = r"E:\app\backup_mpz_scripts\布阵工具\无尽布阵工具v3beta\docs\_aloe_preview.png"
CELL = r"E:\app\backup_mpz_scripts\布阵工具\无尽布阵工具v3beta\docs\_aloe_cell.png"
EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

JS = (
    "grid[0][0] = { base: '芦荟', merge: '', vine: '', tile: false, ops: [] };"
    "grid[1][1] = { base: '芦荟', merge: '', vine: '', tile: false, ops: [] };"
    "buildAllChips(); renderGrid();"
)


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
        # 放大单格：路1列2（eff-pool 空格）
        cells = await page.query_selector_all("#grid .cell.eff-pool")
        if len(cells) > 1:
            await cells[1].screenshot(path=CELL)
            print("cell shot ok, pool cells =", len(cells))
        await browser.close()


asyncio.run(main())
