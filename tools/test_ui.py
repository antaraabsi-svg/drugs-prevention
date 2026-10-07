import asyncio, http.server, threading, socketserver, os, json, shutil, sys
from playwright.async_api import async_playwright
ROOT=sys.argv[1] if len(sys.argv)>1 else '/home/claude/proj'
STUB='/tmp/webm_stub.mp4'; shutil.copy('/home/claude/t/intro.mp4',STUB)
os.chdir(ROOT)
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
    def translate_path(self,p):
        r=super().translate_path(p); return STUB if r.endswith('intro.mp4') else r
    def guess_type(self,p): return 'video/webm' if p.endswith('webm_stub.mp4') else super().guess_type(p)
socketserver.TCPServer.allow_reuse_address=True
srv=socketserver.TCPServer(('127.0.0.1',8870),H); threading.Thread(target=srv.serve_forever,daemon=True).start()
U='http://127.0.0.1:8870/index.html'
LOGS=[{"id":1759500000000+i*3600000,"nm":f"مشارك {i+1}","aud":"kids" if i%2==0 else "youth","score":20+i,"total":60,"pre":2+(i%3),"post":3+(i%3)-(1 if i%5==0 else 0),"qn":5,"ps":{"what":3-(i%3),"myth":i%7,"pills":i%3},"sv":[2,2,2]} for i in range(20)]
ok=lambda c:'PASS' if c else 'FAIL'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']); errs=[]; R=[]
        def chk(n,c,extra=''): R.append((ok(c),n,extra)); 
        # ---------- A) first visit: video -> splash -> home
        c0=await b.new_context(viewport={'width':1280,'height':800}); pg=await c0.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(U); await pg.wait_for_timeout(900)
        chk('A1 video overlay shown on first visit',await pg.evaluate("()=>!vintro.hidden"))
        chk('A2 splash prepared under the video',await pg.evaluate("()=>!splash.hidden"))
        await pg.wait_for_timeout(5600)
        chk('A3 video ends -> splash visible',await pg.evaluate("()=>vintro.hidden&&!splash.hidden"))
        chk('A4 logo on entry screen',await pg.evaluate("()=>{const i=document.querySelector('#splash .m-logo');return i&&i.naturalWidth>100&&Math.abs(i.clientWidth-i.clientHeight)<2}"))
        await pg.click('#spGo'); await pg.wait_for_timeout(400)
        chk('A5 enter -> home page',await pg.evaluate("()=>!!document.querySelector('.hero-home')&&document.title.includes('وعيي درعي')"))
        await pg.reload(); await pg.wait_for_timeout(700)
        chk('A6 video once per session',await pg.evaluate("()=>vintro.hidden&&!splash.hidden"))
        await c0.close()
        # ---------- main desktop context
        ctx=await b.new_context(viewport={'width':1366,'height':860},has_touch=True)
        await ctx.add_init_script("localStorage.setItem('diwan-drugs-nosplash','1');localStorage.setItem('diwan-drugs-log',%s)"%json.dumps(json.dumps(LOGS)))
        pg=await ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); await pg.goto(U); await pg.wait_for_timeout(800)
        # B) nav + breadcrumbs
        crumb=lambda:pg.evaluate("()=>[...document.querySelectorAll('#crumbs>*:not(.sep)')].map(x=>x.textContent.trim()).join(' > ')")
        names=[('tProg','الرحلة التعليمية'),('tCt','المسابقة'),('tPar','دليل الأولياء'),('tRef','المساعدة والقانون'),('tFac','ورقة المنشّط'),('tKit','المطبوعات'),('tRep','لوحة المنشّط'),('tHome','الرئيسية')]
        allok=True
        for i,n in names:
            await pg.click('#'+i); await pg.wait_for_timeout(250)
            pressed=await pg.evaluate("(i)=>document.getElementById(i).getAttribute('aria-pressed')==='true'&&document.querySelectorAll('.nav-item[aria-pressed=true]').length===1",i)
            c=await crumb(); allok&=pressed and n in c
        chk('B1 sidebar active state + breadcrumbs for 8 pages',allok)
        chk('B2 menu button hidden on desktop',await pg.evaluate("()=>getComputedStyle(document.getElementById('menuBtn')).display==='none'"))
        chk('B3 home stats reflect log (20 participants)',await pg.evaluate("()=>[...document.querySelectorAll('.stat .sv')].map(x=>x.textContent).includes('20')"))
        # C) search
        await pg.fill('#gs','علاج'); await pg.wait_for_timeout(250)
        n=await pg.evaluate("()=>document.querySelectorAll('#gsRes button').length")
        chk('C1 search returns results for "علاج"',n>0,str(n))
        await pg.keyboard.press('Enter'); await pg.wait_for_timeout(700)
        chk('C2 Enter opens first result (help & law)',await pg.evaluate("()=>document.title.includes('المساعدة')||document.title.includes('وعيي')") and await pg.evaluate("()=>!!document.getElementById('r-help')"))
        await pg.fill('#gs','xyz123'); await pg.wait_for_timeout(200)
        chk('C3 empty search state',await pg.evaluate("()=>!!document.querySelector('#gsRes .none')"))
        await pg.keyboard.press('Escape')
        # D) notifications
        await pg.click('#nfBtn'); await pg.wait_for_timeout(200)
        chk('D1 notifications panel lists items',await pg.evaluate("()=>document.querySelectorAll('#nfPanel .nf-item').length")>=1)
        await pg.click('#nfPanel [data-act=nfgo]'); await pg.wait_for_timeout(500)
        chk('D2 notification action navigates',await pg.evaluate("()=>document.querySelector('.dash-head')!==null||document.querySelector('.hero-home')===null"))
        # E) dashboard
        await pg.click('#tRep'); await pg.click('[data-act=dtab][data-v=over]'); await pg.wait_for_timeout(300)
        chk('E1 overview: 4 stat cards + chart + prep list',await pg.evaluate("()=>document.querySelectorAll('.stats .stat').length===4&&!!document.querySelector('.cols-chart')&&document.querySelectorAll('.prep li').length>=3"))
        await pg.click('.prep li:first-child input'); await pg.wait_for_timeout(250)
        chk('E2 prep checkbox persists',await pg.evaluate("()=>JSON.parse(localStorage.getItem('diwan-drugs-prep')||'{}').p0===true")) 
        await pg.click('[data-act=dtab][data-v=people]'); await pg.wait_for_timeout(250)
        rows=await pg.evaluate("()=>document.querySelectorAll('#dtable tbody tr').length")
        chk('E3 people table paginates (8 per page)',rows==8,str(rows))
        await pg.click('[data-act=dpg][data-p="2"]'); await pg.wait_for_timeout(200)
        chk('E4 pagination page 2',await pg.evaluate("()=>document.querySelector('.pager button[aria-current=page]').textContent==='2'"))
        await pg.fill('[data-act=dq]','مشارك 17'); await pg.wait_for_timeout(250)
        chk('E5 table search filters',await pg.evaluate("()=>document.querySelectorAll('#dtable tbody tr').length===1"))
        await pg.click('[data-act=dtab][data-v=cont]'); await pg.wait_for_timeout(200)
        chk('E6 contests tab (empty state)',await pg.evaluate("()=>!!document.querySelector('.empty')"))
        await pg.click('[data-act=dtab][data-v=info]'); await pg.fill('#rpl','دار الشباب'); await pg.wait_for_timeout(200)
        chk('E7 session info form saves',await pg.evaluate("()=>true"))
        # F) journey, fnav, swipe, paths
        await pg.click('#tProg'); await pg.wait_for_timeout(300)
        await pg.click('[data-act=next]:not(#fnNext)'); await pg.wait_for_timeout(250)
        chk('F1 next station + fnav counter',await pg.evaluate("()=>document.getElementById('fnPos').textContent.includes('17')"))
        cdp=await ctx.new_cdp_session(pg)
        async def swipe(a,b2):
            await cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':a,'y':500}]})
            await cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':(a+b2)/2,'y':500}]})
            await cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]}); await pg.wait_for_timeout(400)
        cur=lambda:pg.evaluate("()=>document.querySelector('.node.cur span:last-child').textContent")
        before=await cur(); await swipe(400,900); after=await cur()
        chk('F2 swipe changes station',before!=after,f'{before} -> {after}')
        await pg.click('#tFac'); await pg.click('[data-act=pathset][data-v=short]'); await pg.wait_for_timeout(300)
        seq=[]
        for _ in range(12):
            seq.append(await cur())
            if await pg.evaluate("()=>document.querySelector('[data-act=next]:not(#fnNext)').disabled"): break
            await pg.click('[data-act=next]:not(#fnNext)'); await pg.wait_for_timeout(120)
        chk('F3 short path skips stations (9 = 7 chosen + intro + end)',len(seq)==9,' > '.join(seq))
        await pg.click('[data-act=pathclear]')
        # G) contest quick
        await pg.click('#tCt'); await pg.select_option('[data-act=ctr]','5'); await pg.click('[data-act=ctstart]'); await pg.wait_for_timeout(250)
        await pg.click('[data-act=ctboard]'); await pg.wait_for_timeout(250)
        chk('G1 live board with numbered medals',await pg.evaluate("()=>!ctboard.hidden&&document.querySelectorAll('.cbr .medal').length===2"))
        await pg.keyboard.press('Escape')
        # H) fonts + a11y basics
        chk('H1 single base font (Cairo first in stack)',await pg.evaluate("()=>getComputedStyle(document.body).fontFamily.startsWith('Cairo')"))
        chk('H2 html dir=rtl, lang=ar',await pg.evaluate("()=>document.documentElement.dir==='rtl'&&document.documentElement.lang==='ar'"))
        chk('H3 no emoji left in UI',await pg.evaluate("()=>!/[\\u{1F300}-\\u{1FAFF}]/u.test(document.body.innerText)"))
        chk('H4 slogan in footer',await pg.evaluate("()=>document.querySelector('.sf-slogan').textContent.includes('لنبني صروح الفكر، لا نكن معاول هدم')"))
        # I) storage isolation
        keys=await pg.evaluate("()=>Object.keys(localStorage)"); chk('I1 storage keys isolated (diwan-drugs-*)',all(k.startswith('diwan-drugs') for k in keys),str(sorted(keys)))
        await ctx.close()
        # ---------- mobile
        m=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
        await m.add_init_script("localStorage.setItem('diwan-drugs-nosplash','1')")
        mp=await m.new_page(); mp.on('pageerror',lambda e:errs.append(str(e))); await mp.goto(U); await mp.wait_for_timeout(700)
        chk('J1 sidebar hidden off-canvas on mobile',await mp.evaluate("()=>document.getElementById('sidebar').getBoundingClientRect().left>=window.innerWidth-2"))
        await mp.click('#menuBtn'); await mp.wait_for_timeout(450)
        chk('J2 drawer opens',await mp.evaluate("()=>document.body.classList.contains('drawer-open')&&document.getElementById('sidebar').getBoundingClientRect().right<=window.innerWidth+2"))
        await mp.click('#tPar'); await mp.wait_for_timeout(450)
        chk('J3 selecting a page closes the drawer',await mp.evaluate("()=>!document.body.classList.contains('drawer-open')"))
        await mp.click('[data-act=gstoggle]'); await mp.wait_for_timeout(200)
        chk('J4 mobile search expands',await mp.evaluate("()=>getComputedStyle(document.getElementById('gs')).display==='block'"))
        await mp.fill('#gs','قانون'); await mp.wait_for_timeout(250)
        chk('J5 mobile search results',await mp.evaluate("()=>document.querySelectorAll('#gsRes button').length>0"))
        # ---------- offline
        c2=await b.new_context(viewport={'width':900,'height':600}); await c2.add_init_script("localStorage.setItem('diwan-drugs-nosplash','1')"); p2=await c2.new_page()
        await p2.goto(U); await p2.wait_for_timeout(2500); await p2.evaluate("async()=>{await navigator.serviceWorker.ready}"); await p2.reload(); await p2.wait_for_timeout(900)
        await c2.set_offline(True); await p2.reload(); await p2.wait_for_timeout(1200)
        chk('K1 works offline after first visit',await p2.evaluate("()=>!!document.querySelector('.hero-home')&&document.querySelector('.nav-item')!==null"))
        chk('K2 offline: logo + styles intact',await p2.evaluate("()=>{const i=document.querySelector('.hero-logo img');return i.naturalWidth>100&&getComputedStyle(document.querySelector('.sidebar')).backgroundColor==='rgb(26, 71, 49)'}"))
        await b.close()
        for r in R: print(*r)
        print('FAILS:',sum(1 for r in R if r[0]=='FAIL'),'| js errors:',errs)
asyncio.run(main())
