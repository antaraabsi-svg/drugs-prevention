import asyncio, http.server, threading, socketserver, os, subprocess, sys
from playwright.async_api import async_playwright
from PIL import Image
import numpy as np
ROOT=sys.argv[1] if len(sys.argv)>1 else '/home/claude/proj'
os.chdir(ROOT)
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
socketserver.TCPServer.allow_reuse_address=True
srv=socketserver.TCPServer(('127.0.0.1',8905),H); threading.Thread(target=srv.serve_forever,daemon=True).start()
U='http://127.0.0.1:8905/index.html'; PD='/home/claude/ptest5/'; os.makedirs(PD,exist_ok=True)
Image.new('RGB',(300,300),(200,30,30)).save(PD+'red.png')
R=[]
def chk(n,c,x=''): R.append(('PASS' if c else 'FAIL',n,x))
async def pdf(pg,name,wait=700):
    await pg.wait_for_timeout(wait); await pg.pdf(path=PD+name,prefer_css_page_size=True,print_background=True)
    await pg.evaluate("()=>document.body.classList.remove('pk','pc','pd')")
    pages=int([l for l in subprocess.run(['pdfinfo',PD+name],capture_output=True,text=True).stdout.split('\n') if l.startswith('Pages')][0].split()[1])
    txt=subprocess.run(['pdftotext','-layout',PD+name,'-'],capture_output=True,text=True).stdout
    return pages,txt
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        ctx=await b.new_context(viewport={'width':1300,'height':900}); await ctx.add_init_script("localStorage.setItem('diwan-drugs-nosplash','1')")
        pg=await ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); await pg.goto(U); await pg.wait_for_timeout(600)
        await pg.evaluate("window.print=()=>{window.__printed=[...document.querySelectorAll('#printkit img, #printcert img')].map(i=>i.complete&&i.naturalWidth>0)}")
        # ---------- الشهادة ----------
        await pg.click('#tProg'); await pg.wait_for_timeout(300); await pg.click('.track .node >> nth=-1'); await pg.wait_for_timeout(500)
        order=await pg.evaluate("()=>[...document.querySelectorAll('.cform input[type=text],.cform input:not([type])')].map(i=>i.id).filter(Boolean)")
        chk('C1 form order: name, directorate, diwan, institution',order[:4]==['nm','dir','dwn','org'],str(order))
        await pg.fill('#nm','أمين بن علي'); await pg.fill('#dir','مديرية الشباب والرياضة لولاية البليدة'); await pg.fill('#dwn','ديوان قطاع الشباب والرياضة'); await pg.fill('#org','دار الشباب الشهيد بن دوحة')
        pv=(await pg.inner_text('#cprev')).split('\n')
        chk('C2 on-screen preview order',[x for x in pv if x.strip()][:3]==['مديرية الشباب والرياضة لولاية البليدة','ديوان قطاع الشباب والرياضة','دار الشباب الشهيد بن دوحة'],str(pv))
        await pg.click('#pr'); n,txt=await pdf(pg,'cert.pdf')
        i1,i2,i3=txt.find('مديرية الشباب'),txt.find('ديوان قطاع'),txt.find('دار الشباب')
        chk('C3 printed letterhead order (directorate > diwan > institution)',0<=i1<i2<i3 and n==1,f'pages={n} idx={i1},{i2},{i3}')
        # ---------- الملصق ----------
        await pg.click('#tKit'); await pg.wait_for_timeout(300)
        chk('P1 poster has bottom-text field + logo controls',await pg.evaluate("()=>!!document.getElementById('kfoot')&&!!document.querySelector('[data-act=plf]')&&!!document.querySelector('[data-act=pld]')&&!!document.querySelector('[data-act=plx]')"))
        await pg.fill('#kfoot','دار الشباب الشهيد بن دوحة · البليدة · 0550 00 00 00'); await pg.fill('#knote','كل سبت 10:00')
        await pg.click('[data-act=kitprint][data-v=poster]'); n,txt=await pdf(pg,'poster_default.pdf')
        chk('P2 footer text printed + 1 page',('البليدة' in txt) and ('0550' in txt) and n==1,f'pages={n}')
        await pg.set_input_files('[data-act=plf]',PD+'red.png'); await pg.wait_for_timeout(700)
        chk('P3 uploaded logo previewed and persisted',await pg.evaluate("()=>{const i=document.querySelector('.plprev');return !i.hidden&&i.src.startsWith('data:image')&&(localStorage.getItem('diwan-drugs-plogo')||'').startsWith('data:image')}"))
        await pg.click('[data-act=kitprint][data-v=poster]'); n,txt=await pdf(pg,'poster_custom.pdf')
        subprocess.run(['pdftoppm','-r','40','-png',PD+'poster_custom.pdf',PD+'pc'])
        a=np.asarray(Image.open(PD+'pc-1.png').convert('RGB')).astype(int); red=((a[:,:,0]>170)&(a[:,:,1]<80)&(a[:,:,2]<80)).mean()
        chk('P4 custom logo appears on the printed poster',red>0.01 and n==1,f'red={red:.3f}')
        await pg.click('[data-act=plx]'); await pg.wait_for_timeout(300)
        await pg.click('[data-act=kitprint][data-v=poster]'); await pg.wait_for_timeout(300)
        chk('P5 "no logo" removes it from the poster',await pg.evaluate("()=>!document.querySelector('#printkit .pbn')"))
        await pg.evaluate("()=>document.body.classList.remove('pk')")
        await pg.click('[data-act=pld]'); await pg.wait_for_timeout(300)
        await pg.click('[data-act=kitprint][data-v=poster]'); await pg.wait_for_timeout(300)
        chk('P6 reset restores the official logo',await pg.evaluate("()=>{const i=document.querySelector('#printkit .pbn');return !!i&&i.src.includes('logo-512')}"))
        await pg.evaluate("()=>document.body.classList.remove('pk')")
        long='نص طويل جدًا لاختبار الحد الأقصى للنص أسفل الملصق دار الشباب العنوان الهاتف مواعيد الحصص الأسبوعية '*3
        await pg.fill('#kfoot',long[:180]); await pg.click('[data-act=kitprint][data-v=poster]'); n,txt=await pdf(pg,'poster_long.pdf')
        chk('P7 longest footer still fits on one page',n==1,f'pages={n}')
        # ---------- بطاقة الاستوديو ----------
        await pg.click('#tStudio'); await pg.wait_for_timeout(900)
        await pg.fill('#stuc','أنا أقول لا'); await pg.wait_for_timeout(600)
        await pg.evaluate("window.__printed=null"); await pg.click('[data-act=stupr]'); await pg.wait_for_timeout(1500)
        chk('T1 print() is called only after the card image is decoded',await pg.evaluate("()=>Array.isArray(window.__printed)&&window.__printed.length===1&&window.__printed[0]===true"),str(await pg.evaluate("()=>window.__printed")))
        n,txt=await pdf(pg,'studio.pdf',200)
        subprocess.run(['pdftoppm','-r','40','-png',PD+'studio.pdf',PD+'st'])
        a=np.asarray(Image.open(PD+'st-1.png').convert('RGB')).astype(int); green=((abs(a[:,:,0]-26)<14)&(abs(a[:,:,1]-71)<14)&(abs(a[:,:,2]-49)<14)).mean()
        chk('T2 printed page contains the card (green field) on 1 page',green>0.3 and n==1,f'green={green:.2f} pages={n}')
        await pg.evaluate("()=>document.body.classList.remove('pk')")
        # الواجهة تعود بعد الطباعة
        await pg.evaluate("()=>window.dispatchEvent(new Event('afterprint'))")
        chk('T3 UI visible again after printing',await pg.evaluate("()=>!document.body.classList.contains('pk')&&getComputedStyle(document.querySelector('.app')).display!=='none'"))
        # ---------- حفظ الإدخال أثناء الكتابة (خلل مكتشف) ----------
        await pg.click('#tCt'); await pg.wait_for_timeout(250)
        await pg.fill('[data-act=ctn] >> nth=0','نسور البليدة'); await pg.fill('[data-act=ctn] >> nth=1','صقور الحراش')
        await pg.click('[data-act=ctstart]'); await pg.wait_for_timeout(250)
        names=await pg.evaluate("()=>[...document.querySelectorAll('.cts .ctn')].map(x=>x.textContent.trim())")
        chk('I1 custom contest team names are kept',names[:2]==['نسور البليدة','صقور الحراش'],str(names))
        await pg.click('[data-act=ctquit]'); await pg.wait_for_timeout(200)
        await pg.click('#tRep'); await pg.click('[data-act=dtab][data-v=info]'); await pg.fill('#rpl','دار الشباب بالأربعاء'); await pg.fill('#rfa','المنشّط أمين'); await pg.wait_for_timeout(200)
        await pg.reload(); await pg.wait_for_timeout(500); await pg.click('#tRep'); await pg.click('[data-act=dtab][data-v=info]'); await pg.wait_for_timeout(200)
        chk('I2 report fields persist after reload',(await pg.input_value('#rpl'))=='دار الشباب بالأربعاء' and (await pg.input_value('#rfa'))=='المنشّط أمين')
        await pg.click('#tKit'); await pg.fill('#kurl','https://example.org/prog/'); await pg.fill('#knote','الأحد 10:00'); await pg.wait_for_timeout(200)
        await pg.reload(); await pg.wait_for_timeout(500); await pg.click('#tKit'); await pg.wait_for_timeout(200)
        chk('I3 poster url/note/footer persist after reload',(await pg.input_value('#kurl'))=='https://example.org/prog/' and (await pg.input_value('#knote'))=='الأحد 10:00' and 'دار الشباب' in (await pg.input_value('#kfoot')))
        await b.close()
        for r in R: print(*r)
        print('FAILS:',sum(1 for r in R if r[0]=='FAIL'),'| js errors:',errs)
asyncio.run(main())
