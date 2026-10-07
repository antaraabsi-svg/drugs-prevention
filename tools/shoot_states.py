import asyncio, http.server, threading, socketserver, os, json, shutil
from playwright.async_api import async_playwright
STUB='/tmp/webm_stub.mp4'
os.chdir('/home/claude/proj')
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
socketserver.TCPServer.allow_reuse_address=True
srv=socketserver.TCPServer(('127.0.0.1',8871),H); threading.Thread(target=srv.serve_forever,daemon=True).start()
U='http://127.0.0.1:8871/index.html'; O='/home/claude/proj/raw/states/'; os.makedirs(O,exist_ok=True)
LOGS=[{"id":1759500000000+i*3600000,"nm":f"مشارك {i+1}","aud":"kids" if i%2==0 else "youth","score":20+i,"total":60,"pre":2+(i%3),"post":3+(i%3)-(1 if i%5==0 else 0),"qn":5,"ps":{"what":3-(i%3),"myth":i%7,"pills":i%3},"sv":[2,2,2]} for i in range(12)]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        ctx=await b.new_context(viewport={'width':1280,'height':820})
        await ctx.add_init_script("localStorage.setItem('diwan-drugs-log',%s)"%json.dumps(json.dumps(LOGS)))
        pg=await ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(U); await pg.wait_for_timeout(1500)
        if await pg.evaluate("()=>!vintro.hidden"): await pg.click('#vskip'); await pg.wait_for_timeout(800)
        await pg.screenshot(path=O+'splash.png')
        await pg.click('#spGo'); await pg.wait_for_timeout(300)
        await pg.click('[data-act=hpopen] >> nth=0'); await pg.wait_for_timeout(500); await pg.screenshot(path=O+'help.png'); await pg.click('#hpX'); await pg.wait_for_timeout(300)
        # station with quiz + feedback: go to "what"
        await pg.click('#tProg'); await pg.click('.track .node >> nth=2'); await pg.wait_for_timeout(500)
        opts=pg.locator('.opts .opt, .row .opt')
        if await opts.count(): await opts.first.click(); await pg.wait_for_timeout(400)
        await pg.screenshot(path=O+'station.png')
        # end station (certificate form)
        await pg.click('.track .node >> nth=-1'); await pg.wait_for_timeout(500); await pg.screenshot(path=O+'end.png')
        # contest play
        await pg.click('#tCt'); await pg.select_option('[data-act=ctr]','5'); await pg.click('[data-act=ctstart]'); await pg.wait_for_timeout(300); await pg.click('[data-act=ctshow]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path=O+'contest.png')
        # dashboard people
        await pg.click('#tRep'); await pg.click('[data-act=dtab][data-v=people]'); await pg.wait_for_timeout(400); await pg.screenshot(path=O+'people.png')
        await pg.click('[data-act=dtab][data-v=over]'); await pg.wait_for_timeout(400); await pg.screenshot(path=O+'over.png')
        print('errors',errs); await b.close()
asyncio.run(main())
