import asyncio, http.server, threading, socketserver, os, sys, json
from playwright.async_api import async_playwright
ROOT=sys.argv[1] if len(sys.argv)>1 else '/home/claude/proj'
os.chdir(ROOT)
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
socketserver.TCPServer.allow_reuse_address=True
srv=socketserver.TCPServer(('127.0.0.1',8861),H); threading.Thread(target=srv.serve_forever,daemon=True).start()
OUT='/home/claude/proj/raw/sweep/'; os.makedirs(OUT,exist_ok=True)
MODES=[('home','#tHome'),('prog','#tProg'),('contest','#tCt'),('parents','#tPar'),('fac','#tFac'),('ref','#tRef'),('kit','#tKit'),('report','#tRep')]
SIZES=[('xl',1366,860),('lg',1024,768),('md',768,1024),('sm',390,844)]
LOG=[{"id":1759500000000,"nm":"أمين","aud":"kids","score":30,"total":60,"pre":2,"post":4,"qn":5,"ps":{"what":3,"myth":1,"pills":2},"sv":[2,2,2]},
     {"id":1759510000000,"nm":"سارة","aud":"youth","score":40,"total":60,"pre":3,"post":3,"qn":5,"ps":{"what":2,"myth":6,"pills":0},"sv":[2,1,2]},
     {"id":1759520000000,"nm":"ياسين","aud":"kids","score":20,"total":60,"pre":4,"post":2,"qn":5,"ps":{"what":1,"myth":0,"pills":2},"sv":[1,1,1]}]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); res={}; errs=[]
        for sz,w,h in SIZES:
            ctx=await b.new_context(viewport={'width':w,'height':h},is_mobile=(w<500),has_touch=(w<800))
            await ctx.add_init_script("localStorage.setItem('diwan-drugs-nosplash','1');localStorage.setItem('diwan-drugs-log',%s)"%json.dumps(json.dumps(LOG)))
            pg=await ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto('http://127.0.0.1:8861/index.html'); await pg.wait_for_timeout(900)
            for name,sel in MODES:
                if w<1024:
                    await pg.evaluate("()=>document.getElementById('menuBtn').click()"); await pg.wait_for_timeout(120)
                await pg.evaluate("(s)=>document.querySelector(s).click()",sel); await pg.wait_for_timeout(450)
                ov=await pg.evaluate("()=>document.documentElement.scrollWidth-document.documentElement.clientWidth")
                res[f'{sz}/{name}']=ov
                await pg.screenshot(path=f'{OUT}{sz}_{name}.png')
            await ctx.close()
        print('horizontal overflow (px) per size/mode:',{k:v for k,v in res.items() if v>0} or 'none')
        print('js errors:',errs)
        await b.close()
asyncio.run(main())
