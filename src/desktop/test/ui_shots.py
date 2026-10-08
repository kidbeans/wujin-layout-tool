# -*- coding: utf-8 -*-
"""UI 截图检视：浅色/深色主题 + 预设/顺序等右侧坞面板展开态，用于审美打磨定位。"""
import asyncio
import sys
import os

UI = r"E:\app\backup_mpz_scripts\布阵工具\v4\source\app\ui\index.html"
OUT = r"E:\app\backup_mpz_scripts\布阵工具\v4\ui_shots"
EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"


async def main():
    from playwright.async_api import async_playwright
    os.makedirs(OUT, exist_ok=True)
    errors = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path=EXE, headless=True,
                                           args=["--no-first-run", "--no-sandbox"])
        page = await browser.new_page(viewport={"width": 1600, "height": 900})
        page.on("pageerror", lambda e: errors.append("pageerror: " + str(e)))
        await page.goto("file:///" + UI.replace("\\", "/"), wait_until="load")
        await page.wait_for_timeout(800)

        async def shot(name):
            await page.screenshot(path=os.path.join(OUT, name))
            print("shot:", name)

        # 1 默认（浅色）布阵视图
        await shot("01_light_formation.png")
        # 2 打开预设面板（右坞）
        try:
            await page.click('#v3rail .v3ni[data-panel="presets"]', timeout=3000)
            await page.wait_for_timeout(400)
            await shot("02_light_presets.png")
        except Exception as e:
            print("presets panel fail:", e)
        # 3 顺序面板
        try:
            await page.click('#v3rail .v3ni[data-panel="order"]', timeout=3000)
            await page.wait_for_timeout(400)
            await shot("03_light_order.png")
        except Exception as e:
            print("order panel fail:", e)
        # 4 深色主题（通过主题按钮/弹窗）
        try:
            opened = await page.evaluate("""() => {
                const btns = Array.from(document.querySelectorAll('button, .v3ni, [id*=theme]'))
                  .filter(b => (b.title || b.textContent || '').indexOf('主题') > -1);
                if (btns.length){ btns[0].click(); return btns[0].title || btns[0].textContent; }
                return null;
            }""")
            await page.wait_for_timeout(400)
            print("theme btn:", opened)
            await shot("04_theme_popup.png")
            clicked = await page.evaluate("""() => {
                const items = Array.from(document.querySelectorAll('.v3themeitem, [data-theme], .theme-item, [class*=theme] li, [class*=theme] button'))
                  .filter(e => (e.textContent || '').indexOf('深色') > -1 && e.offsetParent !== null);
                if (items.length){ items[0].click(); return items[0].textContent.trim().slice(0, 20); }
                return null;
            }""")
            await page.wait_for_timeout(600)
            print("dark clicked:", clicked)
            await page.keyboard.press("Escape")
            await page.wait_for_timeout(300)
            await page.click('body', position={"x": 200, "y": 400})
            await page.wait_for_timeout(300)
            await shot("05_dark_presets.png")
        except Exception as e:
            print("dark theme fail:", e)
        await browser.close()
    if errors:
        print("PAGE ERRORS:")
        for e in errors[:10]:
            print(" ", e)


asyncio.run(main())
