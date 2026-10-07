/* ===================== أدوات الحصة: استوديو رسالتي · نبض الصف · إدارة الحصة · التعزيز · الدعم المحلي ===================== */
const dl=(name,blob)=>{const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2500)};
const lsGet=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch(_){return d}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};

/* ---------- 1) استوديو رسالتي ---------- */
const STU_MSG=['أقول «لا» وأبقى أنا.','صحتي أولًا، وصديقي الحقيقي يحترم قراري.','أرفض، أشرح، أبتعد، أغادر.','القوة أن تقول «لا».','لن أبيع مستقبلي بقرص.','أحمي نفسي، وأحمي صديقي.','الصديق الحقيقي لا يضغط عليّ.','أخبر شخصًا أثق به، فلست وحدي.','حياتي أغلى من أي تجربة.','وعيي درعي.'];
const STU={m:0,custom:'',theme:'green',fmt:'sq',real:true,from:''};
const stuText=()=>(STU.custom.trim()||STU_MSG[STU.m]).slice(0,110);
function studioView(){
  const pr=(k,v,t)=>`<button type="button" class="pill" data-act="stu" data-k="${k}" data-v="${v}" aria-pressed="${String(STU[k])===String(v)}">${t}</button>`;
  return `<h2>استوديو رسالتي</h2>
  <p class="lead">اصنع بطاقة برسالتك أنت لأصدقائك. الرسالة التي يكتبها الشباب بأنفسهم أقرب إلى أقرانهم من أي محاضرة. حمّل البطاقة وشاركها، أو اطبعها وعلّقها في الدار أو القسم.</p>
  <div class="studio-grid">
   <div class="card">
    <h3 style="margin-top:0">١. اختر رسالة جاهزة</h3>
    <div class="opts" role="group" aria-label="رسائل جاهزة">${STU_MSG.map((m,i)=>`<button type="button" class="opt ${!STU.custom.trim()&&STU.m===i?'pick s2':''}" data-act="stu" data-k="m" data-v="${i}" aria-pressed="${!STU.custom.trim()&&STU.m===i}">${m}</button>`).join('')}</div>
    <h3>٢. أو اكتب رسالتك</h3>
    <div class="field"><textarea id="stuc" data-act="stuc" rows="3" maxlength="110" placeholder="اكتب جملة قصيرة وقوية تقولها لأصدقائك…" aria-describedby="stuCnt">${esc(STU.custom)}</textarea><span class="hint" id="stuCnt">${STU.custom.length} / 110 حرفًا</span></div>
    <div class="field"><label for="stuf">من؟ (اختياري)</label><input id="stuf" data-act="stuf" maxlength="30" value="${esc(STU.from)}" placeholder="مثال: فريق دار الشباب"><span class="hint">اكتب اسم الفريق أو الصف لا اسمك الكامل.</span></div>
    <h3>٣. الشكل</h3>
    <div class="chips" role="group" aria-label="اللون">${pr('theme','green','أخضر')}${pr('theme','cream','كريمي')}${pr('theme','white','أبيض')}</div>
    <div class="chips" role="group" aria-label="القياس" style="margin-top:.5rem">${pr('fmt','sq','مربّع (منشور)')}${pr('fmt','st','عمودي (قصة)')}</div>
    <label class="qo" style="margin-top:.6rem"><input type="checkbox" data-act="stur" ${STU.real?'checked':''}> أضف خطوات الرفض الأربع: ارفض · اشرح · ابتعد · غادر</label>
   </div>
   <div class="studio-side">
    <div class="studio-preview"><canvas id="stuc2" aria-label="معاينة البطاقة" role="img"></canvas></div>
    <div class="acts-col">
      <button type="button" class="btn gold" data-act="studl">${ico('download')}تحميل الصورة</button>
      <button type="button" class="btn" data-act="stupr">${ico('printer')}طباعة البطاقة</button>
      <button type="button" class="btn sec" data-act="stucp">${ico('copy')}نسخ الرسالة</button>
    </div>
    <div class="alert"><svg class="ic" aria-hidden="true"><use href="#i-info"/></svg><div><b>للمنشّط</b><p>اجعل كل فريق يصنع بطاقة ثم تُعرض على الشاشة. انتبه إلى أن الرسالة يجب أن تكون إيجابية (ماذا أفعل) لا تخويفية.</p></div></div>
   </div>
  </div>`;
}
let stuLogo=null,stuTok=0;
function stuReady(){return Promise.all([document.fonts?document.fonts.load('800 60px Cairo').catch(()=>{}):0,new Promise(r=>{if(stuLogo&&stuLogo.complete&&stuLogo.naturalWidth)return r();stuLogo=new Image();stuLogo.onload=r;stuLogo.onerror=r;stuLogo.src=LOGO_HI})])}
async function studioDraw(){
  const cv=$('#stuc2');if(!cv)return;const tok=++stuTok;await stuReady();if(tok!==stuTok||!document.body.contains(cv))return;
  const sq=STU.fmt==='sq',W=1080,H=sq?1080:1920,x=cv.getContext('2d');cv.width=W;cv.height=H;
  const th={green:{bg:'#1a4731',fg:'#ffffff',ac:'#c9993a',sub:'#e4cc9c',chip:'#c9993a',chipt:'#10321f'},cream:{bg:'#F7F4EC',fg:'#1a4731',ac:'#c9993a',sub:'#4e6558',chip:'#1a4731',chipt:'#ffffff'},white:{bg:'#ffffff',fg:'#1a4731',ac:'#c9993a',sub:'#4e6558',chip:'#1a4731',chipt:'#ffffff'}}[STU.theme];
  const F='"Cairo","Segoe UI",Tahoma,sans-serif';
  x.fillStyle=th.bg;x.fillRect(0,0,W,H);
  x.strokeStyle=th.ac;x.lineWidth=7;x.strokeRect(34,34,W-68,H-68);x.lineWidth=2;x.strokeRect(54,54,W-108,H-108);
  const lg=sq?210:280,ly=sq?96:150;
  if(stuLogo&&stuLogo.naturalWidth)x.drawImage(stuLogo,(W-lg)/2,ly,lg,lg);
  x.direction='rtl';x.textAlign='center';x.textBaseline='alphabetic';
  x.fillStyle=th.ac;x.font='800 '+(sq?40:50)+'px '+F;x.fillText('وعيي درعي',W/2,ly+lg+(sq?64:84));
  const txt=stuText(),n=txt.length,fs=sq?(n<=26?96:n<=55?80:66):(n<=26?120:n<=55?100:82),maxW=W-230;
  x.font='800 '+fs+'px '+F;x.fillStyle=th.fg;
  const words=txt.split(/\s+/),lines=[];let cur='';
  words.forEach(w=>{const t=cur?cur+' '+w:w;if(x.measureText(t).width>maxW&&cur){lines.push(cur);cur=w}else cur=t});if(cur)lines.push(cur);
  const lh=fs*1.5,top=sq?ly+lg+150:ly+lg+240,bot=sq?H-300:H-470,blockH=lines.length*lh,y0=top+Math.max(0,(bot-top-blockH)/2)+fs*.9;
  lines.forEach((l,i)=>x.fillText(l,W/2,y0+i*lh));
  const yEnd=y0+(lines.length-1)*lh;
  if(STU.from.trim()){x.font='700 '+(sq?38:46)+'px '+F;x.fillStyle=th.sub;x.fillText('— '+STU.from.trim().slice(0,30),W/2,yEnd+(sq?70:90))}
  if(STU.real){
    const wds=['ارفض','اشرح','ابتعد','غادر'],cw=sq?190:220,ch=sq?64:78,gap=22,tw=wds.length*cw+(wds.length-1)*gap,yy=H-(sq?250:330);
    x.font='800 '+(sq?36:44)+'px '+F;
    wds.forEach((w,i)=>{const cx=W/2+tw/2-cw/2-i*(cw+gap);x.fillStyle=th.chip;x.beginPath();x.roundRect?x.roundRect(cx-cw/2,yy,cw,ch,ch/2):x.rect(cx-cw/2,yy,cw,ch);x.fill();x.fillStyle=th.chipt;x.fillText(w,cx,yy+ch*.7)});
  }
  x.fillStyle=th.sub;x.font='700 '+(sq?30:38)+'px '+F;x.fillText('لنبني صروح الفكر، لا نكن معاول هدم',W/2,H-(sq?136:150));
  x.fillStyle=th.ac;x.font='800 '+(sq?30:38)+'px '+F;x.fillText('ديوان قطاع الشباب والرياضة',W/2,H-(sq?92:96));
}
function stuDownload(){const cv=$('#stuc2');if(!cv)return;try{cv.toBlob(b=>{if(!b){toast('تعذّر حفظ الصورة');return}dl('رسالتي-وعيي-درعي.png',b);toast('تم تحميل البطاقة')},'image/png')}catch(_){toast('تعذّر حفظ الصورة. افتح البرنامج عبر رابطه المنشور.')}}
function stuPrint(){const cv=$('#stuc2');if(!cv)return;try{printKit(`<div class="kpage studio"><img class="stu-img" src="${cv.toDataURL('image/png')}" alt="بطاقة رسالتي"></div>`)}catch(_){toast('تعذّرت الطباعة. افتح البرنامج عبر رابطه المنشور.')}}
function stuCopy(){const t=stuText();if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(()=>toast('تم نسخ الرسالة'),()=>toast('تعذّر النسخ'));else toast('انسخ الرسالة يدويًا')}

/* ---------- 2) نبض الصف ---------- */
const PUK='diwan-drugs-pulse';
const PULSE_Q=[
 {t:'معظم أقراني يؤيدون تجربة الأقراص أو المواد «للتجريب فقط».',pro:'disagree'},
 {t:'من يقول «لا» حين يُعرض عليه شيء يخسر أصدقاءه.',pro:'disagree'},
 {t:'طلب المساعدة من شخص بالغ عند الخطر قوة وليس ضعفًا.',pro:'agree'},
 {t:'يمكنني أن أقول «لا» وأبقى محبوبًا بين أصدقائي.',pro:'agree'},
 {t:'قرص واحد لن يضر.',pro:'disagree'},
 {t:'لو رأيت صديقي في خطر فسأخبر شخصًا بالغًا حتى لو غضب مني.',pro:'agree'},
 {t:'لا بأس أن آخذ دواءً من صديق إن قال إنه سيريحني.',pro:'disagree',aud:'kids'},
 {t:'الأقراص المؤثرة على النفس آمنة ما دام مصدرها «صيدلية» أو شخصًا أعرفه.',pro:'disagree',aud:'youth'}
];
const getPulse=()=>lsGet(PUK,[]);
const PUL={q:0,a:0,b:0,c:0,shown:false};
const pulseQs=()=>PULSE_Q.filter(x=>!x.aud||x.aud===S.aud);
function pulseStats(){const q=pulseQs()[PUL.q]||pulseQs()[0],tot=PUL.a+PUL.b+PUL.c,pro=q.pro==='agree'?PUL.a:PUL.c;return {q,tot,pro,pct:tot?Math.round(pro/tot*100):0}}
function pulseMsg(p){
  if(p>=70)return 'الأغلبية هنا تتبنى الموقف الوقائي. اسأل: هل توقعتم ذلك؟ ولماذا يظن كثيرون أن «الجميع يفعلها» وهو غير صحيح؟';
  if(p>=40)return 'الآراء منقسمة. اسأل: ما الذي يجعلنا نختلف؟ وما الذي يحتاجه من تردد ليشعر بالقوة ويقول «لا»؟';
  return 'كثيرون هنا يميلون إلى الموقف الآخر، فلا تلمهم. اسأل: ما الذي يجعل هذه الفكرة مقنعة؟ وما الذي لا نراه فيها؟ ثم عد إلى المحطة المناسبة.';
}
function pulseView(){
  const qs=pulseQs();if(PUL.q>=qs.length)PUL.q=0;
  const st=pulseStats(),L=[['a','موافق','ok'],['b','متردد','mid'],['c','غير موافق','no']];
  const pct=v=>st.tot?Math.round(v/st.tot*100):0;
  const proKey=st.q.pro==='agree'?'a':'c';
  const hist=getPulse().slice().reverse();
  return `<h2>نبض الصف</h2>
  <p class="lead">كثير من الشباب يظنون أن «الجميع يفعل ذلك»، والواقع داخل الغرفة غالبًا يخالف هذا الظن. اجعل المجموعة تكتشف ذلك بنفسها، دون أسماء ودون إحراج.</p>
  <div class="alert"><svg class="ic" aria-hidden="true"><use href="#i-info"/></svg><div><b>الطريقة</b><p>اقرأ العبارة، واطلب من الجميع إغلاق العيون ثم رفع بطاقة: <b>موافق</b> أو <b>متردد</b> أو <b>غير موافق</b>. عُدّ البطاقات وأدخل الأعداد، ثم اكشف النتيجة وناقشها.</p></div></div>
  <div class="card">
   <div class="field"><label for="pq">١. اختر العبارة</label><select id="pq" data-act="pq">${qs.map((x,i)=>`<option value="${i}" ${i===PUL.q?'selected':''}>${esc(x.t.slice(0,70))}${x.t.length>70?'…':''}</option>`).join('')}</select></div>
   <div class="item" style="margin-top:.2rem"><span class="cnt">العبارة المعروضة</span>${esc(st.q.t)}</div>
   <h3 style="margin-top:.6rem">٢. أدخل عدد من رفع كل بطاقة</h3>
   <div class="pcounts">${L.map(l=>`<div class="pcount ${l[0]===proKey?'pro':''}"><span class="pl">${l[1]}${l[0]===proKey?'<small>الموقف الوقائي</small>':''}</span><div class="pc-in"><button type="button" class="icon-btn" data-act="pc" data-k="${l[0]}" data-d="-1" aria-label="إنقاص ${l[1]}">${ico('minus')}</button><b class="num" aria-live="polite">${PUL[l[0]]}</b><button type="button" class="icon-btn" data-act="pc" data-k="${l[0]}" data-d="1" aria-label="زيادة ${l[1]}">${ico('plus')}</button></div></div>`).join('')}</div>
   <div class="acts" style="margin-top:.8rem;display:flex;gap:.6rem;flex-wrap:wrap"><button type="button" class="btn" data-act="pshow" ${st.tot?'':'disabled'}>${ico('eye')}اكشف النتيجة</button><button type="button" class="btn sec" data-act="preset">صفّر الأعداد</button></div>
   ${PUL.shown&&st.tot?`<div class="pulse-res"><div class="hbars">${L.map(l=>`<div class="hb ${l[0]===proKey?'':'warn'}"><span>${l[1]}</span><div class="pr"><i style="width:${pct(PUL[l[0]])}%;${l[0]===proKey?'':'background:var(--gold-400)'}"></i></div><b>${pct(PUL[l[0]])}%</b></div>`).join('')}</div>
     <div class="stat dark" style="margin:1rem 0"><span class="si">${ico('shield-check')}</span><div><span class="sv num">${st.pct}%</span><span class="sl2">اختاروا الموقف الوقائي من ${st.tot} مشاركًا</span></div></div>
     <div class="alert success"><svg class="ic" aria-hidden="true"><use href="#i-message"/></svg><div><b>سؤال النقاش</b><p>${pulseMsg(st.pct)}</p></div></div>
     <div class="acts" style="display:flex;gap:.6rem;flex-wrap:wrap"><button type="button" class="btn gold" data-act="psave">${ico('check')}احفظ في تقرير الحصة</button><button type="button" class="btn sec" data-act="pnext">عبارة أخرى${ico('arrow-l','sm')}</button></div></div>`:''}
  </div>
  <div class="sec-head"><h2>استطلاعات هذه الحصة</h2></div>
  ${hist.length?`<div class="tblw"><table class="tbl"><thead><tr><th>العبارة</th><th class="num">المشاركون</th><th class="num">الموقف الوقائي</th><th></th></tr></thead><tbody>${hist.map(h=>`<tr><td>${esc(h.q)}</td><td class="num">${h.tot}</td><td class="num"><span class="badge ${h.pct>=70?'':'gold'}">${h.pct}%</span></td><td><button type="button" class="icon-btn" data-act="pdel" data-id="${h.id}" aria-label="حذف">${ico('trash','sm')}</button></td></tr>`).join('')}</tbody></table></div>`:`<div class="empty"><span class="ei">${ico('activity')}</span><h4>لا توجد استطلاعات بعد</h4><p>أدخل الأعداد ثم اضغط «احفظ في تقرير الحصة» لتظهر هنا وفي لوحة المنشّط.</p></div>`}`;
}
function pulseRepHTML(){
  const a=getPulse();if(!a.length)return '';
  return `<h3>نبض الصف</h3><table class="tbl"><thead><tr><th>العبارة</th><th>المشاركون</th><th>الموقف الوقائي</th></tr></thead><tbody>${a.map(h=>`<tr><td>${esc(h.q)}</td><td>${h.tot}</td><td>${h.pct}%</td></tr>`).join('')}</tbody></table>`;
}
function dashPulse(){
  const a=getPulse().slice().reverse();
  if(!a.length)return `<div class="empty"><span class="ei">${ico('activity')}</span><h4>لا توجد استطلاعات</h4><p>استعمل «نبض الصف» أثناء الحصة، وتُحفظ نتائجه هنا تلقائيًا.</p><button class="btn" data-act="mode" data-v="pulse">افتح نبض الصف</button></div>`;
  const avgp=Math.round(a.reduce((s,h)=>s+h.pct,0)/a.length);
  return `<div class="stats"><div class="stat"><span class="si">${ico('activity')}</span><div><span class="sv num">${a.length}</span><span class="sl2">استطلاعات</span></div></div><div class="stat dark"><span class="si">${ico('shield-check')}</span><div><span class="sv num">${avgp}%</span><span class="sl2">متوسط الموقف الوقائي</span></div></div></div>
  <div class="tblw"><table class="tbl"><thead><tr><th>العبارة</th><th class="num">المشاركون</th><th class="num">الموقف الوقائي</th></tr></thead><tbody>${a.map(h=>`<tr><td>${esc(h.q)}</td><td class="num">${h.tot}</td><td class="num"><span class="badge ${h.pct>=70?'':'gold'}">${h.pct}%</span></td></tr>`).join('')}</tbody></table></div>`;
}

/* ---------- 3) إدارة الحصة ---------- */
const QBK='diwan-drugs-qbox';
const LIVE={run:false,ph:'explain',t:{explain:0,practice:0,discuss:0},target:45,tab:'timer',pick:0};
let liveTimer=0;
const mmss=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
const liveTot=()=>LIVE.t.explain+LIVE.t.practice+LIVE.t.discuss;
function liveUpd(){
  const tot=liveTot(),c=$('#lvTot');if(!c)return;
  c.textContent=mmss(tot);
  const bar=$('#lvBar');if(bar)bar.style.width=Math.min(100,Math.round(tot/(LIVE.target*60)*100))+'%';
  const rem=$('#lvRem');if(rem){const r=LIVE.target*60-tot;rem.textContent=r>=0?'المتبقي '+mmss(r):'تجاوزتَ الوقت بـ '+mmss(-r)}
  ['explain','practice','discuss'].forEach(k=>{const e=$('#lv_'+k);if(e)e.textContent=mmss(LIVE.t[k]);const b=$('#lvb_'+k);if(b)b.style.width=(tot?Math.round(LIVE.t[k]/tot*100):0)+'%'});
  const adv=$('#lvAdv');if(adv){const act=LIVE.t.practice+LIVE.t.discuss;if(tot<300)adv.innerHTML='ابدأ الحصة، وستظهر هنا ملاحظة عن توازن الوقت بعد خمس دقائق.';else if(act/tot<0.5)adv.innerHTML=`<div class="alert warning"><svg class="ic" aria-hidden="true"><use href="#i-alert"/></svg><div><b>الحصة تميل إلى الشرح</b><p>برامج الوقاية الفعالة تعتمد على التفاعل والتدرّب. أضف تمثيلًا أو نقاشًا الآن.</p></div></div>`;else adv.innerHTML=`<div class="alert success"><svg class="ic" aria-hidden="true"><use href="#i-check-circle"/></svg><div><b>توازن جيد</b><p>أكثر من نصف الوقت في التدريب والنقاش.</p></div></div>`}
}
function liveStart(){if(LIVE.run)return;LIVE.run=true;liveTimer=setInterval(()=>{LIVE.t[LIVE.ph]++;liveUpd()},1000)}
function livePause(){LIVE.run=false;clearInterval(liveTimer)}
const getQ=()=>lsGet(QBK,[]);
function liveTimerTab(){
  const PH=[['explain','شرح','book'],['practice','تدريب','users'],['discuss','نقاش','message']];
  return `<div class="live-clock card cream"><span class="lbl">الزمن المنقضي</span><b class="num" id="lvTot">${mmss(liveTot())}</b>
   <div class="progress gold"><i id="lvBar" style="width:${Math.min(100,Math.round(liveTot()/(LIVE.target*60)*100))}%"></i></div>
   <div class="lv-row"><span id="lvRem" class="caption"></span><label class="caption">الزمن المخطَّط <select data-act="lvtarget" aria-label="الزمن المخطط">${[30,45,60,90].map(v=>`<option value="${v}" ${v===LIVE.target?'selected':''}>${v} دقيقة</option>`).join('')}</select></label></div>
   <div class="acts" style="display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center"><button type="button" class="btn ${LIVE.run?'sec':'gold'} lg" data-act="lvrun">${ico(LIVE.run?'pause':'play')}${LIVE.run?'إيقاف مؤقت':'ابدأ المؤقت'}</button><button type="button" class="btn sec" data-act="lvreset">${ico('refresh')}تصفير</button></div></div>
  <h3>ماذا نفعل الآن؟ (يُحسب الوقت على الحالة المختارة)</h3>
  <div class="phase-btns" role="group" aria-label="نوع النشاط">${PH.map(p=>`<button type="button" class="phase" data-act="lvph" data-v="${p[0]}" aria-pressed="${LIVE.ph===p[0]}">${ico(p[2])}<b>${p[1]}</b><span class="num" id="lv_${p[0]}">${mmss(LIVE.t[p[0]])}</span><i class="pb"><i id="lvb_${p[0]}" style="width:${liveTot()?Math.round(LIVE.t[p[0]]/liveTot()*100):0}%"></i></i></button>`).join('')}</div>
  <div id="lvAdv" class="warn" style="margin-top:.8rem"></div>`;
}
function liveStationTab(){
  const s=ST[S.i],f=FAC[s.k],ul=a=>`<ul>${a.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
  return `<div class="card accent"><div class="card-head"><div><span class="eyebrow" style="color:var(--green-600)">المحطة الحالية</span><h3 style="margin:.2rem 0 0;color:var(--text-strong)">${ico(s.ic)} ${esc(s.n)}</h3></div>${f?`<span class="badge gold">${ico('clock','sm')} ${f.t} دقائق</span>`:''}</div>
   ${f?`<p><b>الهدف:</b> ${esc(f.goal)}</p><h4>كيف تُدير المحطة</h4>${ul(f.run)}<h4>أسئلة للنقاش</h4>${ul(f.ask)}<div class="alert warning"><svg class="ic" aria-hidden="true"><use href="#i-alert"/></svg><div><b>انتبه</b><p>${esc(f.care)}</p></div></div>`:`<p class="warn">لا توجد توجيهات خاصة لهذه المحطة.</p>`}
   <div class="acts" style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.8rem"><button type="button" class="btn sec" data-act="lvgo" data-d="-1" ${atStart()?'disabled':''}>${ico('chevron-r','sm')}المحطة السابقة</button><button type="button" class="btn" data-act="lvgo" data-d="1" ${atEnd()?'disabled':''}>المحطة التالية${ico('chevron-l','sm')}</button><button type="button" class="btn gold" data-act="mode" data-v="prog">افتح المحطة للعرض</button></div></div>
   <details class="info" style="margin-top:1rem"><summary>${ico('lock')}إذا كشف مشارك عن حالة خاصة</summary><ul>${FAC_SENS.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details>`;
}
function liveQboxTab(){
  const q=getQ(),pend=q.filter(x=>!x.done).length,pk=q.find(x=>x.id===LIVE.pick);
  return `<div class="alert"><svg class="ic" aria-hidden="true"><use href="#i-inbox"/></svg><div><b>صندوق الأسئلة المجهولة</b><p>وزّع أوراقًا صغيرة ليكتب كل مشارك سؤاله دون اسم، ثم اجمعها وأدخلها هنا. الأطفال يسألون ما يخجلون من قوله علنًا، وهذا يكشف ما يشغلهم فعلًا.</p></div></div>
  <div class="card"><div class="field"><label for="qin">أدخل سؤالًا من ورقة</label><textarea id="qin" rows="2" maxlength="240" placeholder="اكتب السؤال كما ورد…"></textarea></div><div class="acts" style="display:flex;gap:.6rem;flex-wrap:wrap"><button type="button" class="btn" data-act="qadd">${ico('plus')}أضف</button><button type="button" class="btn gold" data-act="qpick" ${pend?'':'disabled'}>${ico('shuffle')}اسحب سؤالًا عشوائيًا</button></div></div>
  ${pk?`<div class="item" style="border-color:var(--brand-gold);border-width:2px"><span class="cnt">السؤال المسحوب</span>${esc(pk.t)}</div>`:''}
  <div class="sec-head"><h2>الأسئلة <span class="badge ${pend?'gold':''}">${pend} بانتظار الإجابة</span></h2>${q.length?`<button type="button" class="link" data-act="qclear">${ico('trash','sm')}مسح الصندوق</button>`:''}</div>
  ${q.length?`<ul class="qlist">${q.map(x=>`<li class="${x.done?'done':''}"><label><input type="checkbox" data-act="qdone" data-id="${x.id}" ${x.done?'checked':''}><span>${esc(x.t)}</span></label></li>`).join('')}</ul>`:`<div class="empty"><span class="ei">${ico('inbox')}</span><h4>الصندوق فارغ</h4><p>أضف الأسئلة التي جمعتها من الأوراق.</p></div>`}
  <details class="info" style="margin-top:1rem"><summary>${ico('bulb')}قواعد الإجابة</summary><ul><li>أجب بإيجاز وبلغة بسيطة، ولا تذكر طرق الاستعمال أو الحصول على أي مادة.</li><li>إن لم تعرف: «سؤال جيد، سأتحقق وأعود إليكم».</li><li>إن بدا السؤال كشفًا عن حالة شخصية فلا تسأل عن صاحبه أمام المجموعة، واتبع بروتوكول الكشف.</li><li>اجمع الأسئلة المتكررة لتعالجها في جلسة التعزيز.</li></ul></details>`;
}
function liveView(){
  const tabs=[['timer','المؤقت','clock'],['st','المحطة الحالية','compass'],['qbox','الأسئلة المجهولة','inbox']];
  const body={timer:liveTimerTab,st:liveStationTab,qbox:liveQboxTab}[LIVE.tab]();
  return `<h2>إدارة الحصة</h2><p class="lead">لوحة تحكم أمام المنشّط أثناء العرض: مؤقت يوازن بين الشرح والتدريب، وتوجيهات المحطة الحالية، وصندوق للأسئلة المجهولة.</p>
  <div class="tabs-ui" role="tablist" aria-label="أقسام إدارة الحصة">${tabs.map(t=>`<button type="button" class="tab-ui" role="tab" data-act="lvtab" data-v="${t[0]}" aria-selected="${LIVE.tab===t[0]}">${ico(t[2],'sm')}${t[1]}</button>`).join('')}</div>
  <div role="tabpanel">${body}</div>`;
}

/* ---------- 4) حزمة التعزيز + رسالة الأولياء ---------- */
function boostPlan(){
  const wk=weakStations(3).map(x=>x.k),keys=wk.length===3?wk:['refuse','myth','help'];
  const rp=(RP[S.aud]||RP.kids)[0],recap=[];
  keys.forEach(k=>{const it=(DL[k]&&DL[k][S.aud]||[]).slice(0,2);it.forEach(x=>recap.push({k,t:x.t,a:(DB[k]||['سليم','خاطئ'])[x.c],f:x.f}))});
  return {keys,rp,recap:recap.slice(0,5),data:wk.length===3};
}
function dashBoost(){
  const b=boostPlan(),nm=k=>esc(ST.find(s=>s.k===k).n);
  return `<div class="alert"><svg class="ic" aria-hidden="true"><use href="#i-repeat"/></svg><div><b>لماذا جلسة تعزيز؟</b><p>الأثر الدائم يحتاج إلى تكرار وتدريب لاحق، فحصة واحدة لا تكفي. نظّم جلسة قصيرة بعد أسبوعين أو ثلاثة.</p></div></div>
  <div class="dash-grid"><div class="card"><h3 style="margin-top:0">خطة جلسة التعزيز (15 دقيقة)</h3>
   <ol class="refsteps"><li><b>3 دقائق — نبض سريع:</b> ابدأ بعبارة من «نبض الصف» لمعرفة أين وصل المشاركون.</li>
   <li><b>6 دقائق — مراجعة ${b.data?'المحطات الأضعف':'المحطات الأهم'}:</b> ${b.keys.map(nm).join(' · ')}.</li>
   <li><b>4 دقائق — تدريب على الرفض:</b> مثّلوا الموقف «${esc(b.rp.t)}» بخطوات: ارفض، اشرح، ابتعد، غادر.</li>
   <li><b>2 دقيقة — الالتزام:</b> راجعوا ميثاق الأسرة وأرقام المساعدة.</li></ol>
   ${b.data?'':'<p class="warn">لم تتوفر بيانات كافية عن المحطات الأضعف بعد، فاخترنا المحطات الأهم. تُحدَّد تلقائيًا من نتائج المشاركين متى توفرت.</p>'}</div>
   <div class="card"><h3 style="margin-top:0">أسئلة المراجعة</h3><ol>${b.recap.map(r=>`<li>${esc(r.t)} <span class="badge">${esc(r.a)}</span></li>`).join('')}</ol></div></div>
  <div class="acts" style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem"><button type="button" class="btn" data-act="kitprint" data-v="booster">${ico('printer')}طباعة جلسة التعزيز</button><button type="button" class="btn sec" data-act="kitprint" data-v="parentmsg">${ico('users')}طباعة رسالة الأولياء</button></div>`;
}
function boosterHTML(){
  const b=boostPlan(),nm=k=>esc(ST.find(s=>s.k===k).n);
  return `<div class="kpage boost"><h1 class="kt">جلسة التعزيز — 15 دقيقة</h1><p class="kn">وعيي درعي · ديوان قطاع الشباب والرياضة · التاريخ: <span class="pl"></span></p>
  <table class="tbl"><thead><tr><th style="width:18%">الزمن</th><th>النشاط</th></tr></thead><tbody>
   <tr><td>3 دقائق</td><td><b>نبض سريع:</b> عبارة من «نبض الصف» بالبطاقات، ثم سؤال نقاش.</td></tr>
   <tr><td>6 دقائق</td><td><b>مراجعة:</b> ${b.keys.map(nm).join(' · ')} — اقرأ الأسئلة أدناه وناقش كل إجابة.</td></tr>
   <tr><td>4 دقائق</td><td><b>تدريب:</b> «${esc(b.rp.t)}» — ${esc(b.rp.s)} (الأدوار: ${b.rp.r.map(esc).join('، ')}). استعملوا: ارفض · اشرح · ابتعد · غادر.</td></tr>
   <tr><td>2 دقيقة</td><td><b>الالتزام:</b> مراجعة ميثاق الأسرة وأرقام المساعدة.</td></tr></tbody></table>
  <h2>أسئلة المراجعة</h2><ol>${b.recap.map(r=>`<li>${esc(r.t)}</li>`).join('')}</ol>
  <h2>مفتاح الإجابة للمنشّط</h2><ol>${b.recap.map(r=>`<li><b>${esc(r.a)}.</b> ${esc(r.f)}</li>`).join('')}</ol>
  <div class="pnum"><b>للطوارئ والمساعدة:</b> الرقم الأخضر <b>1111</b> · الشرطة <b>1548</b> · الدرك الوطني <b>1055</b> · الحماية المدنية <b>14</b></div></div>`;
}
function parentMsgHTML(){
  const learned=ST.filter(s=>MAXP[s.k]).slice(0,13).map(s=>esc(s.n));
  return `<div class="kpage parentmsg"><h1 class="kt">رسالة إلى الأولياء</h1><p class="kn">وعيي درعي · ديوان قطاع الشباب والرياضة</p>
  <p>أعزّاءنا الأولياء، شارك أبناؤكم اليوم في حصة تحسيسية للوقاية من المخدرات والمهلوسات. لم نخوّفهم، بل تدرّبنا معهم على فهم المخاطر، وقول «لا»، وطلب المساعدة. وحتى يبقى الأثر، نحتاج إلى مساهمتكم في البيت.</p>
  <h2>ما تعلّمه أبناؤكم</h2><p class="chipsp">${learned.join(' · ')}.</p>
  <h2>ثلاثة أشياء تفعلونها هذا الأسبوع</h2>
  <ol><li><b>اسألوا بفضول لا باتهام:</b> «ماذا تعلّمت اليوم؟ ماذا يقال عن هذا الموضوع بين أصدقائك؟».</li>
  <li><b>قولوا لهم بوضوح:</b> «مهما حدث سأكون سندك، ولن أعاقبك لأنك أخبرتني».</li>
  <li><b>وقّعوا معهم ميثاق الأسرة للوقاية</b> وعلّقوه في مكان ظاهر، وراجعوه بعد شهر.</li></ol>
  <h2>انتبهوا إلى</h2><p>تغيّر مفاجئ في المزاج أو النوم أو الدراسة أو الأصدقاء، فقدان مال أو أشياء، أو وجود أقراص غير مفسَّرة. العلامة الواحدة لا تثبت شيئًا؛ اقتربوا بلطف، واستشيروا الطبيب أو المرشد قبل العقاب. وحافظوا على الأدوية بعيدًا عن متناول الأطفال.</p>
  <div class="pnum"><b>أرقام عند الحاجة:</b> الرقم الأخضر <b>1111</b> · الشرطة <b>1548</b> · الدرك الوطني <b>1055</b> · الحماية المدنية <b>14</b></div>
  <div class="sigs2"><div><hr>المنشّط</div><div><hr>إدارة المؤسسة</div></div></div>`;
}

/* ---------- 5) بطاقة الدعم المحلية ---------- */
const LOCK='diwan-drugs-local';
const LOC_F=[['cons','المرشد أو الأخصائي النفسي في المؤسسة'],['consTel','هاتفه'],['center','أقرب مركز لعلاج الإدمان'],['centerTel','هاتف المركز'],['doc','الطبيب أو المستوصف'],['docTel','هاتفه'],['fac','منشّط الدار'],['facTel','هاتفه']];
const getLoc=()=>lsGet(LOCK,{});
function locForm(){
  const l=getLoc();
  return `<div class="card cream" style="margin:1.2rem 0"><div class="card-head"><h3 style="margin:0">بطاقة الدعم المحلية</h3><button type="button" class="btn sm" data-act="kitprint" data-v="support">${ico('printer','sm')}طباعة البطاقات</button></div>
   <p class="warn">«أخبر شخصًا بالغًا تثق به» أقوى حين تصير اسمًا ورقمًا. املأ ما يخص مؤسستك مرة واحدة، فتُطبع على بطاقات صغيرة توزَّع على المشاركين. تبقى البيانات في هذا الجهاز.</p>
   <div class="loc-grid">${LOC_F.map(f=>`<div class="field"><label for="loc_${f[0]}">${f[1]}</label><input id="loc_${f[0]}" data-act="loc" data-k="${f[0]}" value="${esc(l[f[0]]||'')}" maxlength="60" ${f[0].endsWith('Tel')?'inputmode="tel" dir="ltr" style="text-align:start"':''}></div>`).join('')}</div></div>`;
}
function supportHTML(){
  const l=getLoc(),ln=(lab,v)=>`<div class="sl"><span>${lab}</span><b>${v?esc(v):'<i class="blank"></i>'}</b></div>`;
  const card=`<div class="scard"><div class="sc-h"><img src="${LOGO}" alt=""><div><b>بطاقة المساعدة</b><small>وعيي درعي · ديوان قطاع الشباب والرياضة</small></div></div>
   <div class="sc-n"><span><b>1111</b>الرقم الأخضر</span><span><b>1548</b>الشرطة</span><span><b>1055</b>الدرك</span><span><b>14</b>الحماية المدنية</span></div>
   ${ln('المرشد',(l.cons||'')+(l.consTel?' · '+l.consTel:''))}${ln('مركز العلاج',(l.center||'')+(l.centerTel?' · '+l.centerTel:''))}${ln('الطبيب',(l.doc||'')+(l.docTel?' · '+l.docTel:''))}${ln('المنشّط',(l.fac||'')+(l.facTel?' · '+l.facTel:''))}
   <div class="sc-f">مهما حدث… أخبر شخصًا تثق به. طلب المساعدة قوة.</div></div>`;
  return `<div class="kpage support"><div class="sgrid">${card.repeat(6)}</div></div>`;
}
