import re
W='/home/claude/proj/'
p=W+'assets/js/app.js'; s=open(p,encoding='utf-8').read()
def rep(old,new,cnt=1):
    global s
    assert s.count(old)==cnt,(s.count(old),old[:90]); s=s.replace(old,new)
mods=open(W+'tools/new_modules2.js',encoding='utf-8').read()+'\n'+open(W+'tools/new_listeners2.js',encoding='utf-8').read()
rep("/* ---------- مستمعات الغلاف (نقر، إدخال، لوحة المفاتيح) ---------- */",mods+"\n/* ---------- مستمعات الغلاف (نقر، إدخال، لوحة المفاتيح) ---------- */")
# labels, icons, search
rep("const MODE_LABEL={home:'الرئيسية',prog:'الرحلة التعليمية',contest:'المسابقة',parents:'دليل الأولياء',fac:'ورقة المنشّط',ref:'المساعدة والقانون',kit:'المطبوعات',report:'لوحة المنشّط'};",
    "const MODE_LABEL={home:'الرئيسية',prog:'الرحلة التعليمية',contest:'المسابقة',studio:'استوديو رسالتي',parents:'دليل الأولياء',ref:'المساعدة والقانون',fac:'ورقة المنشّط',live:'إدارة الحصة',pulse:'نبض الصف',kit:'المطبوعات',report:'لوحة المنشّط'};")
rep("ic:{home:'home',prog:'compass',contest:'trophy',parents:'users',fac:'clipboard',ref:'life-buoy',kit:'printer',report:'chart'}[m]","ic:{home:'home',prog:'compass',contest:'trophy',studio:'sparkle',parents:'users',fac:'clipboard',live:'clock',pulse:'activity',ref:'life-buoy',kit:'printer',report:'chart'}[m]")
rep("const map={home:'#tHome',prog:'#tProg'","const map={studio:'#tStudio',live:'#tLive',pulse:'#tPulse',home:'#tHome',prog:'#tProg'")
rep("  if(S.mode==='home'){app.innerHTML=homeView();","  if(S.mode==='studio'){app.innerHTML=studioView();studioDraw();if(top)window.scrollTo({top:0,behavior:'smooth'});return}\n  if(S.mode==='pulse'){app.innerHTML=pulseView();if(top)window.scrollTo({top:0,behavior:'smooth'});return}\n  if(S.mode==='live'){app.innerHTML=liveView();liveUpd();if(top)window.scrollTo({top:0,behavior:'smooth'});return}\n  if(S.mode==='home'){app.innerHTML=homeView();")
# kit
rep("v==='pact'?pactHTML():posterHTML()","v==='pact'?pactHTML():v==='booster'?boosterHTML():v==='parentmsg'?parentMsgHTML():v==='support'?supportHTML():posterHTML()")
rep('data-act="kitprint" data-v="pact">طباعة</button></div>','data-act="kitprint" data-v="pact">طباعة</button></div>\n   <div class="kit"><h3>${ico(\'repeat\')}جلسة التعزيز</h3><p>خطة من 15 دقيقة تُبنى من المحطات الأضعف في نتائجكم، بأسئلة مراجعة ومفتاح إجابة.</p><button class="btn" data-act="kitprint" data-v="booster">طباعة</button></div>\n   <div class="kit"><h3>${ico(\'message\')}رسالة إلى الأولياء</h3><p>صفحة ترسلها إلى البيت: ما تعلّمه أبناؤهم، وثلاثة أشياء يفعلونها، والأرقام.</p><button class="btn" data-act="kitprint" data-v="parentmsg">طباعة</button></div>\n   <div class="kit"><h3>${ico(\'life-buoy\')}بطاقة الدعم المحلية</h3><p>ست بطاقات صغيرة بأرقام الطوارئ وأسماء من يلجأ إليهم أطفال مؤسستكم. تُملأ من «المساعدة والقانون».</p><button class="btn" data-act="kitprint" data-v="support">طباعة</button></div>')
# ref page: local support card form
rep('<div class="refs">المصادر: وزارة الصحة','${locForm()}\n  <div class="refs">المصادر: وزارة الصحة')
# dashboard tabs
rep("const tabs=[['over','نظرة عامة','chart'],['people','المشاركون','users'],['cont','المسابقات','trophy'],['info','بيانات الحصة','clipboard']];","const tabs=[['over','نظرة عامة','chart'],['people','المشاركون','users'],['cont','المسابقات','trophy'],['pulse','نبض الصف','activity'],['boost','التعزيز','repeat'],['info','بيانات الحصة','clipboard']];")
rep("{over:dashOver,people:dashPeople,cont:dashContests,info:dashInfo}[DASH.tab]()","{over:dashOver,people:dashPeople,cont:dashContests,pulse:dashPulse,boost:dashBoost,info:dashInfo}[DASH.tab]()")
# print report: pulse polls
i=s.index('function repHTML'); j=s.index('${ctRepHTML()}',i); s=s[:j]+'${ctRepHTML()}\n  ${pulseRepHTML()}'+s[j+len('${ctRepHTML()}'):]
# home cards
rep("['kit','printer','المطبوعات','بطاقات وملصق QR وميثاق الأسرة والشهادات.']];","['studio','sparkle','استوديو رسالتي','اصنع بطاقة برسالتك لأصدقائك وشاركها أو اطبعها.'],['live','clock','إدارة الحصة','مؤقت وتوجيهات المحطة وصندوق الأسئلة المجهولة.'],['pulse','activity','نبض الصف','اكشف ما يظنه الجميع وما هو الواقع داخل الغرفة.'],['kit','printer','المطبوعات','بطاقات وملصق QR وميثاق الأسرة والشهادات.']];")
# notifications
rep("  if(S.path&&S.path.length)a.push({ic:'map-pin'","  const qp=getQ().filter(x=>!x.done).length;if(qp)a.push({ic:'inbox',t:qp+(qp>1?' أسئلة مجهولة':' سؤال مجهول')+' بانتظار الإجابة',d:'أجب عنها في الحصة أو أجّلها إلى جلسة التعزيز.',b:'افتح الصندوق',m:'live',tab:'qbox'});\n  if(S.path&&S.path.length)a.push({ic:'map-pin'")
rep("S.mode=t.dataset.m;if(t.dataset.tab)DASH.tab=t.dataset.tab;render(true)","S.mode=t.dataset.m;if(t.dataset.tab){if(t.dataset.m==='live')LIVE.tab=t.dataset.tab;else DASH.tab=t.dataset.tab}render(true)")
open(p,'w',encoding='utf-8').write(s)

# index.html: sidebar items
p=W+'index.html'; h=open(p,encoding='utf-8').read()
def hrep(old,new):
    global h
    assert h.count(old)==1,old[:70]; h=h.replace(old,new)
nav=lambda i,m,ic,t:f'<button class="nav-item" id="{i}" data-act="mode" data-v="{m}" aria-pressed="false"><svg class="ic" aria-hidden="true"><use href="#i-{ic}"/></svg>{t}</button>'
hrep('<svg class="ic" aria-hidden="true"><use href="#i-trophy"/></svg>المسابقة</button>','<svg class="ic" aria-hidden="true"><use href="#i-trophy"/></svg>المسابقة</button>\n      '+nav('tStudio','studio','sparkle','استوديو رسالتي'))
hrep('<svg class="ic" aria-hidden="true"><use href="#i-clipboard"/></svg>ورقة المنشّط</button>','<svg class="ic" aria-hidden="true"><use href="#i-clipboard"/></svg>ورقة المنشّط</button>\n      '+nav('tLive','live','clock','إدارة الحصة')+'\n      '+nav('tPulse','pulse','activity','نبض الصف'))
open(p,'w',encoding='utf-8').write(h)
print('patched')
