import asyncio, http.server, threading, socketserver, os, json, subprocess, sys
from playwright.async_api import async_playwright
ROOT=sys.argv[1] if len(sys.argv)>1 else '/home/claude/proj'
os.chdir(ROOT)
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
socketserver.TCPServer.allow_reuse_address=True
srv=socketserver.TCPServer(('127.0.0.1',8895),H); threading.Thread(target=srv.serve_forever,daemon=True).start()
U='http://127.0.0.1:8895/index.html'; PD='/home/claude/ptest4/'; os.makedirs(PD,exist_ok=True)
LOGS=[{"id":1759500000000+i*3600000,"nm":f"م{i}","aud":"kids","score":30,"total":60,"pre":2,"post":3+(i%2),"qn":5,"ps":{"refuse":3-(i%3),"myth":i%4,"help":1+(i%2),"what":3,"pills":2},"sv":[2,2,2]} for i in range(6)]
R=[]
def chk(n,c,x=''): R.append(('PASS' if c else 'FAIL',n,x))
async def pdfpages(pg,name):
    await pg.wait_for_timeout(600)
    await pg.pdf(path=PD+name,prefer_css_page_size=True,print_background=True)
    out=subprocess.run(['pdfinfo',PD+name],capture_output=True,text=True).stdout
    await pg.evaluate("()=>document.body.classList.remove('pk','pc','pd')")
    return int([l for l in out.split('\n') if l.startswith('Pages')][0].split()[1])
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        ctx=await b.new_context(viewport={'width':1366,'height':900},accept_downloads=True)
        await ctx.add_init_script("localStorage.setItem('diwan-drugs-nosplash','1');localStorage.setItem('diwan-drugs-log',%s)"%json.dumps(json.dumps(LOGS)))
        pg=await ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); await pg.goto(U); await pg.wait_for_timeout(700)
        await pg.evaluate("window.print=()=>{}")
        # ===== studio
        await pg.click('#tStudio'); await pg.wait_for_timeout(900)
        sig=lambda:pg.evaluate("()=>{const c=document.getElementById('stuc2'),x=c.getContext('2d');const d=x.getImageData(0,0,c.width,c.height).data;let h=0,n=0;const set=new Set();for(let i=0;i<d.length;i+=4*97){set.add((d[i]<<16)|(d[i+1]<<8)|d[i+2]);h=(h*31+d[i]+d[i+1]*3+d[i+2]*7)|0}return {w:c.width,h:c.height,colors:set.size,hash:h}}")
        s1=await sig()
        chk('S1 canvas drawn (1080×1080, many colours incl. logo)',s1['w']==1080 and s1['h']==1080 and s1['colors']>20,str(s1))
        await pg.fill('#stuc','أنا أختار مستقبلي'); await pg.wait_for_timeout(600); s2=await sig()
        chk('S2 typing a custom message redraws the card',s2['hash']!=s1['hash'])
        await pg.click('[data-act=stu][data-k=theme][data-v=cream]'); await pg.wait_for_timeout(600); s3=await sig()
        chk('S3 theme change redraws',s3['hash']!=s2['hash'])
        await pg.click('[data-act=stu][data-k=fmt][data-v=st]'); await pg.wait_for_timeout(700); s4=await sig()
        chk('S4 story format = 1080×1920',s4['h']==1920,str(s4['h']))
        await pg.screenshot(path='/home/claude/proj/raw/shots/studio.png')
        async with pg.expect_download() as d: await pg.click('[data-act=studl]')
        path=await (await d.value).path(); raw=open(path,'rb').read()
        chk('S5 PNG download is a real image',raw[:8]==b'\x89PNG\r\n\x1a\n' and len(raw)>20000,str(len(raw)//1024)+'KB')
        await pg.click('[data-act=stupr]'); n=await pdfpages(pg,'studio.pdf'); chk('S6 print card = 1 page',n==1,str(n))
        await pg.wait_for_timeout(1700)
        # ===== pulse
        await pg.click('#tPulse'); await pg.wait_for_timeout(300)
        for k,times in (('a',2),('b',1),('c',7)):
            for _ in range(times): await pg.click(f'[data-act=pc][data-k={k}][data-d="1"]')
        await pg.click('[data-act=pshow]'); await pg.wait_for_timeout(300)
        txt=await pg.inner_text('.pulse-res')
        chk('P1 reveal shows 3 bars and protective %',await pg.evaluate("()=>document.querySelectorAll('.pulse-res .hb').length===3") and '70%' in txt,txt[:60].replace('\n',' '))
        await pg.click('[data-act=psave]'); await pg.wait_for_timeout(300)
        chk('P2 saved to history table',await pg.evaluate("()=>document.querySelectorAll('.tbl tbody tr').length===1"))
        await pg.click('#tRep'); await pg.click('[data-act=dtab][data-v=pulse]'); await pg.wait_for_timeout(300)
        chk('P3 dashboard pulse tab shows the poll',await pg.evaluate("()=>document.querySelectorAll('.tbl tbody tr').length===1&&document.querySelector('.stat .sv').textContent==='1'"))
        # ===== live
        await pg.click('#tLive'); await pg.wait_for_timeout(300)
        await pg.click('[data-act=lvrun]'); await pg.wait_for_timeout(2300)
        t1=await pg.inner_text('#lvTot'); chk('L1 timer ticks',t1 in ('00:02','00:03'),t1)
        await pg.click('[data-act=lvph][data-v=practice]'); await pg.wait_for_timeout(2200)
        chk('L2 time is charged to the chosen phase',await pg.evaluate("()=>document.getElementById('lv_practice').textContent>='00:02'"))
        await pg.click('[data-act=lvrun]'); await pg.wait_for_timeout(200)
        tt=await pg.inner_text('#lvTot'); await pg.wait_for_timeout(1300); chk('L3 pause stops the clock',(await pg.inner_text('#lvTot'))==tt)
        await pg.click('[data-act=lvreset]'); chk('L4 reset',(await pg.inner_text('#lvTot'))=='00:00')
        await pg.click('[data-act=lvtab][data-v=st]'); await pg.wait_for_timeout(250)
        n0=await pg.inner_text('.card.accent h3'); await pg.click('[data-act=lvgo][data-d="1"]'); await pg.wait_for_timeout(250)
        chk('L5 station tab navigates stations',(await pg.inner_text('.card.accent h3'))!=n0 and await pg.evaluate("()=>document.querySelector('.card.accent').textContent.includes('الهدف')"))
        await pg.click('[data-act=lvtab][data-v=qbox]'); await pg.wait_for_timeout(250)
        for q in ('هل الأقراص المهدئة خطيرة؟','ماذا أفعل إذا عرض عليّ صديق شيئًا؟','هل يعاقب القانون من يطلب العلاج؟'):
            await pg.fill('#qin',q); await pg.click('[data-act=qadd]'); await pg.wait_for_timeout(120)
        chk('L6 questions added',await pg.evaluate("()=>document.querySelectorAll('.qlist li').length===3"))
        await pg.click('[data-act=qpick]'); await pg.wait_for_timeout(200)
        chk('L7 random pick highlights a question',await pg.evaluate("()=>!!document.querySelector('.item[style*=\"border-width\"]')||document.querySelector('.item .cnt')!==null"))
        await pg.click('.qlist li:first-child input'); await pg.wait_for_timeout(200)
        chk('L8 mark answered',await pg.evaluate("()=>document.querySelectorAll('.qlist li.done').length===1"))
        await pg.click('#nfBtn'); chk('L9 notification for pending questions',await pg.evaluate("()=>document.getElementById('nfPanel').textContent.includes('مجهول')"))
        await pg.keyboard.press('Escape')
        # ===== booster + printables
        await pg.click('#tRep'); await pg.click('[data-act=dtab][data-v=boost]'); await pg.wait_for_timeout(300)
        chk('B1 booster plan + 5 recap questions',await pg.evaluate("()=>document.querySelectorAll('.card ol li').length>=5&&document.body.textContent.includes('خطة جلسة التعزيز')"))
        chk('B2 weak stations drive the plan (data-based)',await pg.evaluate("()=>!document.body.textContent.includes('لم تتوفر بيانات كافية')"))
        await pg.click('[data-act=kitprint][data-v=booster]'); n=await pdfpages(pg,'booster.pdf'); chk('B3 booster print = 1 page',n==1,str(n))
        await pg.click('[data-act=kitprint][data-v=parentmsg]'); n=await pdfpages(pg,'parent.pdf'); chk('B4 parents message print = 1 page',n==1,str(n))
        # ===== support card
        await pg.click('#tRef'); await pg.wait_for_timeout(300)
        await pg.fill('#loc_cons','الأستاذة سمية'); await pg.fill('#loc_consTel','0550 00 00 00'); await pg.fill('#loc_center','المركز الوسيط - البليدة')
        await pg.click('[data-act=kitprint][data-v=support]'); n=await pdfpages(pg,'support.pdf'); chk('C1 support cards print = 1 page',n==1,str(n))
        txt=subprocess.run(['pdftotext','-layout',PD+'support.pdf','-'],capture_output=True,text=True).stdout
        chk('C2 local data appears on printed cards',txt.count('سمية')>=6 or 'سمية' in txt,str(txt.count('سمية')))
        await pg.reload(); await pg.wait_for_timeout(500); await pg.click('#tRef'); await pg.wait_for_timeout(200)
        chk('C3 local card persists after reload',(await pg.input_value('#loc_cons'))=='الأستاذة سمية')
        # ===== search + sidebar
        await pg.fill('#gs','استوديو'); await pg.wait_for_timeout(250)
        chk('N1 search finds the new pages',await pg.evaluate("()=>document.getElementById('gsRes').textContent.includes('استوديو رسالتي')"))
        await pg.keyboard.press('Escape')
        chk('N2 sidebar has 11 nav items',await pg.evaluate("()=>document.querySelectorAll('.nav-item').length===11"))
        await ctx.close()
        # ===== mobile overflow on the new pages
        m=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True); await m.add_init_script("localStorage.setItem('diwan-drugs-nosplash','1')")
        mp=await m.new_page(); mp.on('pageerror',lambda e:errs.append(str(e))); await mp.goto(U); await mp.wait_for_timeout(600)
        ov={}
        for mode in ('studio','pulse','live'):
            await mp.evaluate("(m)=>{document.getElementById('menuBtn').click()}",mode); await mp.wait_for_timeout(150)
            await mp.evaluate("(i)=>document.getElementById(i).click()",{'studio':'tStudio','pulse':'tPulse','live':'tLive'}[mode]); await mp.wait_for_timeout(500)
            ov[mode]=await mp.evaluate("()=>document.documentElement.scrollWidth-document.documentElement.clientWidth")
        chk('M1 no horizontal overflow on mobile (studio, pulse, live)',all(v<=0 for v in ov.values()),str(ov))
        await mp.screenshot(path='/home/claude/proj/raw/shots/live_m.png')
        await b.close()
        for r in R: print(*r)
        print('FAILS:',sum(1 for r in R if r[0]=='FAIL'),'| js errors:',errs)
asyncio.run(main())
