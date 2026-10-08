import re
W='/home/claude/proj/'
p=W+'assets/js/app.js'; s=open(p,encoding='utf-8').read()
def rep(old,new,cnt=1):
    global s
    assert s.count(old)==cnt,(s.count(old),old[:90]); s=s.replace(old,new)

# ---------- 1) الشهادة: المديرية ثم الديوان/الهيئة ثم المؤسسة ----------
rep("const l=[S.dwn,S.dir,S.org].map(","const l=[S.dir,S.dwn,S.org].map(")
rep('''        <p class="crow"><label>الديوان/الهيئة: <input id="dwn" placeholder="يكتبه المستخدم" maxlength="70" value="${esc(S.dwn)}"></label></p>
        <p class="crow"><label>المديرية: <input id="dir" placeholder="يكتبها المستخدم" maxlength="70" value="${esc(S.dir)}"></label></p>''',
'''        <p class="crow"><label>المديرية: <input id="dir" placeholder="يكتبها المستخدم" maxlength="70" value="${esc(S.dir)}"></label></p>
        <p class="crow"><label>الديوان/الهيئة: <input id="dwn" placeholder="يكتبه المستخدم" maxlength="70" value="${esc(S.dwn)}"></label></p>''')
rep("ستظهر الرأسية هنا: الشعار، ثم الديوان، ثم المديرية، ثم المؤسسة.","ستظهر الرأسية هنا: الشعار، ثم المديرية، ثم الديوان/الهيئة، ثم المؤسسة.")
rep("[['nm','nm'],['dwn','dwn'],['dir','dir'],['org','org']]","[['nm','nm'],['dir','dir'],['dwn','dwn'],['org','org']]")

# ---------- 2) الملصق: شعار قابل للتغيير + نص أسفل الملصق ----------
rep("kitNote','rep']","kitNote','kitFoot','rep']")
s=re.sub(r"kitNote:''","kitNote:'',kitFoot:''",s,count=1) if "kitNote:''" in s else s
assert "kitFoot:''" in s
poster_state='''/* شعار الملصق: '' = شعار البرنامج الرسمي، 'none' = بلا شعار، وإلا صورة يرفعها المستخدم */
const PLK='diwan-drugs-plogo';
const getPLogo=()=>{try{return localStorage.getItem(PLK)||''}catch(_){return ''}};
const setPLogo=v=>{try{if(v)localStorage.setItem(PLK,v);else localStorage.removeItem(PLK)}catch(_){}};
const posterLogoSrc=()=>{const v=getPLogo();return v==='none'?'':(v||LOGO_HI)};
function fileToLogo(f,max,cb,fail){
  const r=new FileReader();
  r.onload=()=>{const im=new Image();
    im.onload=()=>{try{const sc=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*sc));c.height=Math.max(1,Math.round(im.height*sc));c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/png'))}catch(_){cb(r.result)}};
    im.onerror=fail;im.src=r.result};
  r.onerror=fail;r.readAsDataURL(f);
}
function posterHTML(){'''
rep("function posterHTML(){",poster_state)
rep('''return `<div class="kpage poster"><img class="pbn" src="${LOGO_HI}" alt="">''','''const pl=posterLogoSrc();
  return `<div class="kpage poster">${pl?`<img class="pbn" src="${pl}" alt="">`:''}''')
rep('''<div class="pnum"><b>لست وحدك:</b> الرقم الأخضر 1111 · الشرطة 1548 · الدرك الوطني 1055 · الحماية المدنية 14</div>
   <div class="psig">''','''<div class="pnum"><b>لست وحدك:</b> الرقم الأخضر 1111 · الشرطة 1548 · الدرك الوطني 1055 · الحماية المدنية 14</div>
   ${(S.kitFoot||'').trim()?`<div class="pfoot">${esc(S.kitFoot.trim()).replace(/\\n/g,'<br>')}</div>`:''}
   <div class="psig">''')
rep('''    <div class="qprev" id="qprev">${qrp}</div>''','''    <p class="crow"><label>نص أسفل الملصق (اختياري): <textarea id="kfoot" rows="2" maxlength="180" style="width:min(100%,420px)" placeholder="مثال: دار الشباب الشهيد … · العنوان · الهاتف · مواعيد الحصص">${esc(S.kitFoot||'')}</textarea></label></p>
    <div class="crow lgrow"><span>شعار الملصق:</span>
      <img class="plprev" alt="" ${posterLogoSrc()?`src="${posterLogoSrc()}"`:'hidden'}>
      <label class="btn sec fl">رفع شعار<input type="file" accept="image/*" data-act="plf" class="vh"></label>
      <button class="btn sec" type="button" data-act="pld">شعار البرنامج الرسمي</button>
      <button class="btn sec" type="button" data-act="plx">بلا شعار</button></div>
    <p class="warn" id="plm" aria-live="polite">${getPLogo()==='none'?'الملصق بلا شعار.':getPLogo()?'يُستعمل الشعار الذي رفعتَه.':'يُستعمل شعار الديوان الرسمي.'}</p>
    <div class="qprev" id="qprev">${qrp}</div>''')
rep("  if(t.id==='knote'){S.kitNote=t.value;save();return true}","  if(t.id==='knote'){S.kitNote=t.value;save();return true}\n  if(t.id==='kfoot'){S.kitFoot=t.value;save();return true}")

# ---------- 3) الطباعة: انتظار فك ترميز الصور قبل فتح نافذة الطباعة ----------
i=s.index('function printWith(cls){'); j=s.index('/* ---------- badges & toast ---------- */')
newpw='''async function printWith(cls){
  document.body.classList.add(cls);
  /* حجم الصفحة يُحقن وقت الطباعة فقط، فيعمل في كل المتصفحات (الشهادة أفقية، والبقية عمودية) */
  const pg=document.createElement('style');
  pg.textContent=cls==='pc'?'@page{size:A4 landscape;margin:8mm}':'@page{size:A4 portrait;margin:'+(cls==='pk'?'10mm':'12mm')+'}';
  document.head.appendChild(pg);
  let done=false;
  const off=()=>{if(done)return;done=true;document.body.classList.remove(cls);if(pg.parentNode)pg.parentNode.removeChild(pg);window.removeEventListener('afterprint',off)};
  window.addEventListener('afterprint',off);
  /* انتظر تحميل وفك ترميز كل صور المطبوع (الشعار، بطاقة الاستوديو…) وإلا تخرج الصفحة فارغة في بعض المتصفحات */
  try{
    const box=cls==='pc'?$('#printcert'):cls==='pk'?$('#printkit'):document.body;
    const imgs=[...box.querySelectorAll('img')];
    await Promise.race([Promise.all(imgs.map(i=>(i.decode?i.decode():Promise.resolve()).catch(()=>{}))),new Promise(r=>setTimeout(r,3000))]);
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  }catch(_){}
  window.print();
  setTimeout(off,30000);   /* احتياط إن لم يصدر المتصفح حدث afterprint */
}

'''
s=s[:i]+newpw+s[j:]

# ---------- 4) مستمعات الشعار ----------
listeners='''
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-act]');if(!t)return;
  if(t.dataset.act==='pld'){setPLogo('');render(false)}
  else if(t.dataset.act==='plx'){setPLogo('none');render(false)}
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.dataset&&t.dataset.act==='plf'&&t.files&&t.files[0]){
    fileToLogo(t.files[0],480,v=>{setPLogo(v);render(false)},()=>{const m=$('#plm');if(m)m.textContent='تعذّرت قراءة الصورة. جرّب صورة PNG أو JPG.'});
  }
});
'''
marker="/* ---------- مستمعات الغلاف (نقر، إدخال، لوحة المفاتيح) ---------- */"
rep(marker,listeners+marker)
open(p,'w',encoding='utf-8').write(s)

# CSS
p=W+'assets/css/print.css'; c=open(p,encoding='utf-8').read()
c=c.replace("  .poster{text-align:center;display:flex;flex-direction:column;align-items:center;min-height:270mm}","  .poster{text-align:center;display:flex;flex-direction:column;align-items:center;height:266mm;overflow:hidden}",1)
assert 'height:266mm' in c
c=c.replace("  .psig{display:flex;","  .pfoot{margin:.7rem 0 0;padding:.5rem 1.2rem 0;border-top:2px solid var(--brand-gold);max-width:36em;font-size:1.05rem;font-weight:700;line-height:1.7;color:var(--green-700)}\n  .psig{display:flex;",1)
assert '.pfoot' in c
open(p,'w',encoding='utf-8').write(c)
p=W+'assets/css/pages.css'; c=open(p,encoding='utf-8').read()
c+="\n.plprev{width:56px;height:56px;object-fit:contain;border:var(--bw) solid var(--line);border-radius:var(--r-md);background:#fff;padding:3px}\n"
open(p,'w',encoding='utf-8').write(c)
print('ok')
