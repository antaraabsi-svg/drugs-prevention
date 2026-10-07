import asyncio, http.server, threading, socketserver, os, sys
from playwright.async_api import async_playwright
ROOT=sys.argv[1] if len(sys.argv)>1 else '/home/claude/proj'
os.chdir(ROOT)
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
socketserver.TCPServer.allow_reuse_address=True
srv=socketserver.TCPServer(('127.0.0.1',8860),H); threading.Thread(target=srv.serve_forever,daemon=True).start()
OUT='/home/claude/proj/raw/shots/'; os.makedirs(OUT,exist_ok=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]; bad=[]
        ctx=await b.new_context(viewport={'width':1366,'height':860})
        await ctx.add_init_script("localStorage.setItem('diwan-drugs-nosplash','1')")
        pg=await ctx.new_page(); pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
        pg.on('console',lambda m: errs.append('CONSOLE '+m.text) if m.type=='error' and 'fonts.g' not in m.text and 'ERR_' not in m.text else None)
        pg.on('requestfailed',lambda r: bad.append(r.url[-60:]) if 'fonts.g' not in r.url else None)
        await pg.goto('http://127.0.0.1:8860/index.html'); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=OUT+'home_d.png')
        await pg.screenshot(path=OUT+'home_full.png',full_page=True)
        await pg.click('#tProg'); await pg.wait_for_timeout(500); await pg.screenshot(path=OUT+'prog_d.png')
        m=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
        await m.add_init_script("localStorage.setItem('diwan-drugs-nosplash','1')")
        mp=await m.new_page(); mp.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
        await mp.goto('http://127.0.0.1:8860/index.html'); await mp.wait_for_timeout(1000); await mp.screenshot(path=OUT+'home_m.png')
        print('errors:',errs); print('failed requests:',bad)
        await b.close()
asyncio.run(main())
