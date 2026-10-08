# -*- coding: utf-8 -*-
"""renderGrid 事件委托重构专项验证（2026-09-14）：
在真实 DOM 中逐项验证委托后的交互与原逐格监听行为一致：
点击种植 / 右键清格 / 单元格拖拽互换 / 植物卡拖入种植 / 列头行头拖拽互换 / 双击改名。
运行: python test/interact_grid_check.py [ui/index.html]
"""
import asyncio
import os
import sys

_DEF_UI = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'ui', 'index.html'))
UI = sys.argv[1] if len(sys.argv) > 1 else _DEF_UI
EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"


async def main():
    from playwright.async_api import async_playwright
    r = {}
    errors = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path=EXE, headless=True,
                                           args=["--no-first-run", "--no-sandbox"])
        page = await browser.new_page(viewport={"width": 1600, "height": 900})
        page.on("pageerror", lambda e: errors.append("pageerror: " + str(e)))
        await page.goto("file:///" + UI.replace("\\", "/"), wait_until="load")
        await page.wait_for_timeout(800)

        async def cell(rr, cc):
            return page.locator(f'#grid .cell[data-r="{rr}"][data-c="{cc}"]')

        # 清空棋盘开测（确认对话框自动接受）
        page.on("dialog", lambda d: asyncio.ensure_future(d.accept()))
        await page.click("#btnClear")
        await page.wait_for_timeout(400)

        # 1) 选植物卡（大哥）→ 点击格子 → 种上
        await page.evaluate("""
          (function(){
            var chips = document.querySelectorAll('#chipsCore .chip');
            for (var i = 0; i < chips.length; i++){
              if (chips[i].textContent === '大哥'){ chips[i].click(); return 'clicked'; }
            }
            return 'notfound';
          })()
        """)
        await page.wait_for_timeout(150)
        c00 = await cell(0, 0)
        await c00.click()
        await page.wait_for_timeout(300)
        r["点击种植：1-1 变大哥"] = await page.evaluate(
            "document.querySelector('#grid .cell[data-r=\\'0\\'][data-c=\\'0\\'] .celltxt').textContent") == '大哥'
        r["点击后画笔保持（连续种植）"] = "大哥" in (await page.evaluate(
            "document.querySelector('#status').textContent"))

        # 2) 点击第二格 → 连续种植
        c11 = await cell(1, 1)
        await c11.click()
        await page.wait_for_timeout(300)
        r["连续种植：2-2 也变大哥"] = await page.evaluate(
            "document.querySelector('#grid .cell[data-r=\\'1\\'][data-c=\\'1\\'] .celltxt').textContent") == '大哥'

        # 3) 右键清格
        await c11.click(button="right")
        await page.wait_for_timeout(300)
        r["右键清格：2-2 清空"] = await page.evaluate(
            "document.querySelector('#grid .cell[data-r=\\'1\\'][data-c=\\'1\\'] .celltxt').textContent") == '-'

        # 4) 单元格拖拽互换：1-1(大哥) ↔ 3-3(空)
        await page.evaluate("""
          (function(){
            var src = document.querySelector('#grid .cell[data-r=\\'0\\'][data-c=\\'0\\']');
            var dst = document.querySelector('#grid .cell[data-r=\\'2\\'][data-c=\\'2\\']');
            function fire(el, type, dt){
              var ev = new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: dt });
              el.dispatchEvent(ev);
            }
            var dt = new DataTransfer();
            fire(src, 'dragstart', dt);
            fire(dst, 'dragover', dt);
            fire(dst, 'drop', dt);
            return 'done';
          })()
        """)
        await page.wait_for_timeout(400)
        r["拖拽互换：3-3 变大哥"] = await page.evaluate(
            "document.querySelector('#grid .cell[data-r=\\'2\\'][data-c=\\'2\\'] .celltxt').textContent") == '大哥'
        r["拖拽互换：1-1 变空"] = await page.evaluate(
            "document.querySelector('#grid .cell[data-r=\\'0\\'][data-c=\\'0\\'] .celltxt').textContent") == '-'

        # 5) 植物卡拖入：桑葚卡 → 格 5-5
        await page.evaluate("""
          (function(){
            var chip = null;
            document.querySelectorAll('#chipsSupport .chip, #chipsCore .chip, #chipsBoss .chip, #chipsWorld .chip, #chipsSpeed .chip').forEach(function(ch){
              if (ch.textContent === '桑葚') chip = ch;
            });
            if (!chip) return 'no chip';
            var dst = document.querySelector('#grid .cell[data-r=\\'4\\'][data-c=\\'4\\']');
            var dt = new DataTransfer();
            chip.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: dt }));
            dst.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt }));
            dst.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }));
            return 'done';
          })()
        """)
        await page.wait_for_timeout(400)
        r["植物卡拖入：5-5 变桑葚"] = await page.evaluate(
            "document.querySelector('#grid .cell[data-r=\\'4\\'][data-c=\\'4\\'] .celltxt').textContent") == '桑葚'

        # 6) 列头拖拽互换：列1 ↔ 列3（3-3 大哥应移到 3-1；列5 桑葚不参与交换）
        await page.evaluate("""
          (function(){
            var h1 = document.querySelector('#grid .ghead[data-c=\\'1\\']');
            var h3 = document.querySelector('#grid .ghead[data-c=\\'3\\']');
            var dt = new DataTransfer();
            h1.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: dt }));
            h3.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt }));
            h3.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }));
            return 'done';
          })()
        """)
        await page.wait_for_timeout(400)
        r["列互换：3-3 大哥→3-1"] = await page.evaluate(
            "document.querySelector('#grid .cell[data-r=\\'2\\'][data-c=\\'0\\'] .celltxt').textContent") == '大哥'
        r["列互换：列5 桑葚不受影响(仍 5-5)"] = await page.evaluate(
            "document.querySelector('#grid .cell[data-r=\\'4\\'][data-c=\\'4\\'] .celltxt').textContent") == '桑葚'

        # 7) 行头拖拽互换：路3 ↔ 路5（3-1 大哥→5-1；5-5 桑葚→3-5）
        await page.evaluate("""
          (function(){
            var r3 = document.querySelector('#grid .rlabel[data-r=\\'3\\']');
            var r5 = document.querySelector('#grid .rlabel[data-r=\\'5\\']');
            var dt = new DataTransfer();
            r3.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: dt }));
            r5.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt }));
            r5.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }));
            return 'done';
          })()
        """)
        await page.wait_for_timeout(400)
        r["行互换：3-1 大哥→5-1"] = await page.evaluate(
            "document.querySelector('#grid .cell[data-r=\\'4\\'][data-c=\\'0\\'] .celltxt').textContent") == '大哥'
        r["行互换：5-5 桑葚→3-5"] = await page.evaluate(
            "document.querySelector('#grid .cell[data-r=\\'2\\'][data-c=\\'4\\'] .celltxt').textContent") == '桑葚'

        # 8) 双击改名：5-1 大哥 → 洋芋
        await page.evaluate("window.prompt = function(){ return '洋芋'; }")
        c51 = await cell(4, 0)
        await c51.dblclick()
        await page.wait_for_timeout(300)
        r["双击改名：5-1 大哥→洋芋"] = await page.evaluate(
            "document.querySelector('#grid .cell[data-r=\\'4\\'][data-c=\\'0\\'] .celltxt').textContent") == '洋芋'

        # 9) Ctrl+Z 守卫：输入框聚焦时 Ctrl+Z 不改棋盘（走原生文本撤销）；失焦后 Ctrl+Z 正常
        await page.evaluate("document.getElementById('colN').focus()")
        await page.keyboard.press("Control+z")
        await page.wait_for_timeout(250)
        r["输入框内 Ctrl+Z 不动棋盘（5-1 仍为洋芋）"] = await page.evaluate(
            "document.querySelector('#grid .cell[data-r=\\'4\\'][data-c=\\'0\\'] .celltxt').textContent") == '洋芋'
        await page.evaluate("document.activeElement && document.activeElement.blur()")
        await page.keyboard.press("Control+z")
        await page.wait_for_timeout(350)
        r["失焦后 Ctrl+Z 正常撤销（5-1 回大哥）"] = await page.evaluate(
            "document.querySelector('#grid .cell[data-r=\\'4\\'][data-c=\\'0\\'] .celltxt').textContent") == '大哥'

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
    print("\n" + ("INTERACT FAIL" if fails else "INTERACT ALL PASS"))
    sys.exit(1 if fails else 0)


asyncio.run(main())
