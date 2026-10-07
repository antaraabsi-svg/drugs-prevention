import asyncio, http.server, threading, socketserver, os, json
from playwright.async_api import async_playwright
os.chdir('/home/claude/proj')
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
socketserver.TCPServer.allow_reuse_address=True
srv=socketserver.TCPServer(('127.0.0.1',8898),H); threading.Thread(target=srv.serve_forever,daemon=True).start()
U='http://127.0.0.1:8898/index.html'; O='/home/claude/proj/raw/new/'; os.makedirs(O,exist_ok=True)
LOGS=[{"id":1759500000000+i*3600000,"nm":f"م{i}","aud":"kids","score":30,"total":60,"pre":2,"post":3+(i%2),"qn":5,"ps":{"refuse":3-(i%3),"myth":i%4,"help":1+(i%2),"what":3,"pills":2},"sv":[2,2,2]} for i in range(6)]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1366,'height':860})
        await ctx.add_init_script("localStorage.setItem('diwan-drugs-nosplash','1');localStorage.setItem('diwan-drugs-log',%s)"%json.dumps(json.dumps(LOGS)))
        pg=await ctx.new_page(); await pg.goto(U); await pg.wait_for_timeout(600)
        await pg.click('#tStudio'); await pg.wait_for_timeout(900); await pg.screenshot(path=O+'studio.png')
        await pg.click('#tPulse')
        for k,t in (('a',3),('b',2),('c',9)):
            for _ in range(t): await pg.click(f'[data-act=pc][data-k={k}][data-d="1"]')
        await pg.click('[data-act=pshow]'); await pg.wait_for_timeout(400); await pg.screenshot(path=O+'pulse.png')
        await pg.click('#tLive'); await pg.click('[data-act=lvrun]'); await pg.wait_for_timeout(2200); await pg.click('[data-act=lvph][data-v=practice]'); await pg.wait_for_timeout(1500); await pg.screenshot(path=O+'live.png')
        await pg.click('#tRep'); await pg.click('[data-act=dtab][data-v=boost]'); await pg.wait_for_timeout(400); await pg.screenshot(path=O+'boost.png')
        m=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True); await m.add_init_script("localStorage.setItem('diwan-drugs-nosplash','1')")
        mp=await m.new_page(); await mp.goto(U); await mp.wait_for_timeout(500)
        await mp.evaluate("document.getElementById('menuBtn').click()"); await mp.wait_for_timeout(200); await mp.evaluate("document.getElementById('tStudio').click()"); await mp.wait_for_timeout(900); await mp.screenshot(path=O+'studio_m.png')
        await b.close()
asyncio.run(main())
