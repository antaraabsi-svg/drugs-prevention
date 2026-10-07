"""ترحيل المحرّك القديم إلى نظام التصميم الجديد (يُشغَّل مرة واحدة من raw/app.js إلى assets/js/app.js)."""
import re
W='/home/claude/proj/'
s=open(W+'raw/app.js',encoding='utf-8').read()
def rep(old,new,cnt=1):
    global s
    assert s.count(old)==cnt,(s.count(old),old[:90]); s=s.replace(old,new)
def regex(pat,new,cnt=1,flags=0):
    global s
    s,n=re.subn(pat,new,s,flags=flags); assert n==cnt,(n,pat[:80])

# ---- 1) logo (الشعار الرسمي بدل الصورة القديمة) ----
regex(r'const LOGO="data:image/jpeg;base64,[A-Za-z0-9+/=]+";','const LOGO="assets/img/logo-256.webp",LOGO_HI="assets/img/logo-512.webp";')

# ---- 2) station icons: emoji -> icon names ----
IC={'intro':'star','pre':'clipboard-check','what':'bulb','myth':'swap','why':'help-circle','pills':'pill','halluc':'asterisk','refuse':'ban','pressure':'mountain','online':'smartphone','signs':'eye','help':'heart','law':'scale','life':'activity','emerg':'medical','post':'check-circle','end':'award'}
for k,v in IC.items():
    regex(r"(\{k:'%s',n:'[^']*',ic:)'[^']*'"%k, r"\1'%s'"%v)
rep("${s.ic} ${s.n}</button>`).join(' ')","${ico(s.ic,'sm')} ${s.n}</button>`).join(' ')")
rep("<td>${s.ic} ${s.n}</td>","<td>${ico(s.ic,'sm')} ${s.n}</td>")
rep('<span class="dot">${s.ic}</span>','<span class="dot">${ico(s.ic)}</span>')
rep("${e?s.ic:'🔒'}","${e?ico(s.ic):ico('lock')}")
rep("return s?s.ic+' '+s.n:k}","return s?s.n:k}")

# ---- 3) emoji in templates -> unified icons ----
rep("toast('🏅 شارة جديدة: '+BADGES[key])","toast('شارة جديدة: '+BADGES[key])")
rep('<span aria-hidden="true">💡</span>',"${ico('bulb')}")
rep('<summary>📖 بطاقة توعوية:',"<summary>${ico('book')}بطاقة توعوية:")
rep('<summary>🧑‍🏫 ملاحظة للمنشّط',"<summary>${ico('clipboard')}ملاحظة للمنشّط")
rep("<b>${['⚠️ انتبه','👍 قريب من الصواب','✅ أحسنت'][o.s]}</b>","<b class=\"fb-t\">${ico(['alert','info','check-circle'][o.s])}${['انتبه','قريب من الصواب','أحسنت'][o.s]}</b>")
rep("<b>${ok?'✅ إجابة صحيحة':'⚠️ ليس تمامًا'}</b>","<b class=\"fb-t\">${ico(ok?'check-circle':'alert')}${ok?'إجابة صحيحة':'ليس تمامًا'}</b>")
rep("'✔ أجبت عن كل الأسئلة. يمكنك المتابعة.'","'أجبت عن كل الأسئلة. يمكنك المتابعة.'")
for emo,name,txt in [('🧠','bulb','المعرفة'),('🧩','swap','الخرافات'),('💊','pill','الأقراص'),('🌀','asterisk','المهلوسات'),('✋','ban','الرفض'),('📱','smartphone','الإنترنت'),('👀','eye','العلامات'),('🤝','heart','المساعدة'),('⚖️','scale','القانون'),('🏃','activity','البدائل'),('🚑','medical','الطوارئ')]:
    rep(f'<span class="chip">{emo} {txt}</span>',f'<span class="chip">${{ico(\'{name}\',\'sm\')}}{txt}</span>')
rep('<div class="arr" aria-hidden="true">←</div>','<div class="arr" aria-hidden="true">${ico(\'arrow-l\',\'lg\')}</div>')
rep("· 🏅 <b id=\"bgc\">","· ${ico('award','sm')} <b id=\"bgc\">")
# medals -> numbered badges
rep("mx=Math.max(1,r[0].s),med=['🥇','🥈','🥉'];","mx=Math.max(1,r[0].s);")
rep('<span class="cbm" aria-hidden="true">${x.s>0&&i<3?med[i]:(i+1)}</span>','<span class="cbm" aria-hidden="true"><span class="medal ${x.s>0&&i<3?\'m\'+(i+1):\'\'}">${i+1}</span></span>')
rep("win=!tie&&r[0].s>0,med=['🥇','🥈','🥉'];","win=!tie&&r[0].s>0;")
rep('<span class="ctn">${x.s>0&&i<3?med[i]+\' \':\'\'}${i+1}. ${esc(x.n)}</span>','<span class="ctn"><span class="medal ${x.s>0&&i<3?\'m\'+(i+1):\'\'}">${i+1}</span>${esc(x.n)}</span>')
rep('data-act="ctboard">✕ إغلاق</button>','data-act="ctboard">${ico(\'x\')}إغلاق</button>')
rep("زر «📊 عرض الترتيب»","زر «عرض الترتيب»")
rep('<p class="tbn">⚡ سؤال فاصل بين:','<p class="tbn">${ico(\'zap\',\'sm\')} سؤال فاصل بين:')
rep('data-act="cttb">⚡ سؤال فاصل بين المتعادلين</button>','data-act="cttb">${ico(\'zap\',\'sm\')}سؤال فاصل بين المتعادلين</button>')
rep("${on?'✔ ':''}${esc(t.n)}","${on?ico('check','sm'):''}${esc(t.n)}")
rep("${allOn?'✔ ':''}الجميع","${allOn?ico('check','sm'):''}الجميع")
rep('data-act="ctboard">📊 عرض الترتيب</button>','data-act="ctboard">${ico(\'chart\',\'sm\')}عرض الترتيب</button>')
rep('<div class="trophy" aria-hidden="true">🏆</div>\'','<div class="trophy" aria-hidden="true">\'+ico(\'trophy\')+\'</div>\'')
rep('<h3>🚦 بطاقات التصويت</h3>',"<h3>${ico('check-circle')}بطاقات التصويت</h3>")
rep('<h3>🎭 بطاقات لعب الأدوار</h3>',"<h3>${ico('users')}بطاقات لعب الأدوار</h3>")
rep('<h3>🤝 ميثاق الأسرة للوقاية</h3>',"<h3>${ico('heart')}ميثاق الأسرة للوقاية</h3>")
rep('<h3>🖼️ ملصق QR</h3>',"<h3>${ico('file')}ملصق QR</h3>")
rep('<h3>🏅 الشهادات</h3>',"<h3>${ico('award')}الشهادات</h3>")
rep('<div class="pathbar noprint">📍 المسار المختار:','<div class="pathbar noprint">${ico(\'map-pin\',\'sm\')} المسار المختار:')

# ---- 4) poster uses the official logo ----
rep("src=\"${imgSrc('.sp-banner img')}\"","src=\"${LOGO_HI}\"")

# ---- 5) shell integration ----
rep("mode:'prog',pts:{}","mode:'home',pts:{}")
rep("const map={prog:'#tProg'","const map={home:'#tHome',prog:'#tProg'")
rep("function render(top){\n  syncBar();fnavUpd();ctBoardUpd();","function render(top){\n  syncBar();shellSync();fnavUpd();ctBoardUpd();")
rep("  if(S.mode==='contest'){app.innerHTML=ctView();","  if(S.mode==='home'){app.innerHTML=homeView();if(top)window.scrollTo({top:0,behavior:'smooth'});return}\n  if(S.mode==='contest'){app.innerHTML=ctView();")
rep("S.fs=loadFs();SAVED=null;render(true)","S.fs=loadFs();S.mode='prog';SAVED=null;render(true)")
rep("fresh(true);try{localStorage.removeItem(KEY)}catch(_){}SAVED=null;render(true)","fresh(true);S.mode='prog';try{localStorage.removeItem(KEY)}catch(_){}SAVED=null;render(true)")
# old report view -> new dashboard (inserted with the other modules)
i=s.index('function repView(){'); j=s.index('function logCsv(){'); s=s[:i]+s[j:]
mods=open(W+'tools/new_modules.js',encoding='utf-8').read()
rep("function render(top){",mods+"\nfunction render(top){")

# ---- 6) colours: mascot, balance chart, confetti -> identity colours ----
for a,b in [('#063B3E','#10321f'),('#F26B3A','#d6b26b'),('#0F7A72','#1a4731'),('#F2A93B','#c9993a'),('#2F5BE0','#315946'),('#3d2b9c','#1a4731'),('#1B6FA8','#6c897b'),('#1B8A5A','#486c5a'),('#6A8A8B','#677b70')]:
    s=s.replace(a,b).replace(a.lower(),b)
rep("['#c9993a','#1a4731','#D6232A','#1E9E4B','#6c897b']","['#c9993a','#1a4731','#e4cc9c','#486c5a','#c3cfc9']") if "['#c9993a','#1a4731','#D6232A','#1E9E4B','#6c897b']" in s else None
s=re.sub(r"\['#c9993a','#1a4731','#D6232A','#1E9E4B','#[0-9a-fA-F]{6}'\]","['#c9993a','#1a4731','#e4cc9c','#486c5a','#c3cfc9']",s)
# BAL: sleep / study / sport / screen
s=re.sub(r"\['sleep','النوم','#[0-9a-fA-F]{6}'","['sleep','النوم','#1a4731'",s)
s=re.sub(r"\['study','الدراسة/العمل','#[0-9a-fA-F]{6}'","['study','الدراسة/العمل','#6c897b'",s)
s=re.sub(r"\['sport','الرياضة والنشاط','#[0-9a-fA-F]{6}'","['sport','الرياضة والنشاط','#c9993a'",s)
s=re.sub(r"\['screen','الشاشات للترفيه','#[0-9a-fA-F]{6}'","['screen','الشاشات للترفيه','#6d531f'",s)

open(W+'assets/js/app.js','w',encoding='utf-8').write(s)
left=sorted(set(re.findall(r'#[0-9A-Fa-f]{6}\b',s)))
print('migrated; remaining hex colours:',left)
emo=re.compile('[\U0001F300-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\u25A0-\u25FF\u2300-\u23FF]')
print('emoji left:',[s[m.start()-20:m.start()+10] for m in emo.finditer(s)][:8])
