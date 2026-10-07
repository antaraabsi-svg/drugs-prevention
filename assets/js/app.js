(function(){
const LOGO="assets/img/logo-256.webp",LOGO_HI="assets/img/logo-512.webp";
const $=s=>document.querySelector(s);
const app=$('#app');
const KEY='diwan-drugs-v1';

const ST=[
 {k:'intro',n:'البداية',ic:'star'},
 {k:'pre',n:'اختبار قبلي',ic:'clipboard-check'},
 {k:'what',n:'ما هي؟',ic:'bulb'},
 {k:'myth',n:'خرافة أم حقيقة',ic:'swap'},
 {k:'why',n:'لماذا يجرّب البعض',ic:'help-circle'},
 {k:'pills',n:'الأقراص',ic:'pill'},
 {k:'halluc',n:'المهلوسات',ic:'asterisk'},
 {k:'refuse',n:'كيف أقول لا',ic:'ban'},
 {k:'pressure',n:'الضغط',ic:'mountain'},
 {k:'online',n:'الإنترنت',ic:'smartphone'},
 {k:'signs',n:'العلامات',ic:'eye'},
 {k:'help',n:'من يساعدني',ic:'heart'},
 {k:'law',n:'القانون',ic:'scale'},
 {k:'life',n:'بدائل صحية',ic:'activity'},
 {k:'emerg',n:'الطوارئ',ic:'medical'},
 {k:'post',n:'اختبار بعدي',ic:'check-circle'},
 {k:'end',n:'الميثاق',ic:'award'}
];
const MAXP={what:5,myth:6,why:5,pills:5,halluc:5,refuse:2,pressure:2,online:2,signs:5,help:2,law:5,life:5,emerg:5};
const TOTAL=Object.values(MAXP).reduce((a,b)=>a+b,0);
const NSTATIONS=Object.keys(MAXP).length;

const KEEP=['dz','snd','shuf','fnotes','hc','org','nm','stage','fs','path','pathN','dir','dwn','kitUrl','kitNote','rep'];
function base(){return {aud:'kids',i:0,mode:'home',pts:{},ans:{},q:{},cor:{},ord:{},visited:{0:true},pledge:{},cardOpen:{},bal:{sleep:8,study:6,sport:1,screen:3},pre:{},post:{},dz:false,snd:false,shuf:true,fnotes:false,hc:false,org:'',nm:'',stage:false,fs:0,path:null,pathN:'',dir:'',dwn:'',sv:{},logId:0,kitUrl:'',kitNote:'',rep:{date:'',place:'',inst:'',fac:'',n:'',notes:''}}}
const FSK='diwan-drugs-fs';
function loadFs(){try{const v=parseInt(localStorage.getItem(FSK)||'0',10);return Math.max(-1,Math.min(4,isNaN(v)?0:v))}catch(_){return 0}}
let S=base(),SAVED=null,curKey='intro',CLOGO='';
S.fs=loadFs();
try{CLOGO=localStorage.getItem('diwan-drugs-logo')||''}catch(_){}
try{const r=localStorage.getItem(KEY);if(r)SAVED=JSON.parse(r)}catch(_){}
function fresh(keep){const old=S;S=base();if(keep&&old)KEEP.forEach(k=>S[k]=old[k])}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(_){}}
function hasProg(o){return !!(o&&((o.pts&&Object.keys(o.pts).length)||(o.pre&&Object.keys(o.pre).length)||o.i>0))}

const sum=()=>Object.values(S.pts).reduce((a,b)=>a+b,0);
const K=()=>S.aud==='kids';

/* ---------- sequences ---------- */
const SEQ={};Object.keys(DL).forEach(k=>{SEQ[k]={items:()=>DL[k][S.aud],btns:DB[k]}});
const SC=DS;

/* ---------- helpers ---------- */
function shuffled(n){const a=[...Array(n).keys()];for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function ordr(key,n){if(!S.ord[key]||S.ord[key].length!==n)S.ord[key]=S.shuf?shuffled(n):[...Array(n).keys()];return S.ord[key]}
function clearOrd(prefix){Object.keys(S.ord).forEach(k=>{if(k.indexOf(prefix)===0)delete S.ord[k]})}
function award(key,v){const was=earned(key);S.pts[key]=v;updScore();save();if(!was&&earned(key)){toast('شارة جديدة: '+BADGES[key]);sfx('win')}}
function updScore(){const e=$('#sc');if(e)e.textContent=sum();const b=$('#bgc');if(b)b.textContent=nBadges()}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rule=(t,b)=>`<div class="rule">${ico('bulb')}<div><b>${b}</b> ${t}</div></div>`;

/* sound */
let AC=null;
function tone(f,d,delay,type,v){
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+(delay||0);
    o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(v||.08,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d);
  }catch(_){}
}
function sfx(k){
  if(!S.snd)return;
  if(k==='ok'){tone(523,.14,0);tone(784,.22,.12)}
  else if(k==='mid'){tone(440,.2,0)}
  else if(k==='bad'){tone(220,.25,0,'triangle');tone(165,.3,.15,'triangle')}
  else if(k==='win'){[523,659,784,1047].forEach((f,i)=>tone(f,.2,i*.12))}
}

/* guide character */
function guide(mood,sz){
  const brow=mood==='sad'?'<path d="M34 50 L52 56 M86 50 L68 56" stroke="#10321f" stroke-width="4" stroke-linecap="round"/>':'<path d="M34 51 Q43 45 52 51 M68 51 Q77 45 86 51" stroke="#10321f" stroke-width="4" fill="none" stroke-linecap="round"/>';
  const mouth=mood==='sad'?'<path d="M46 92 Q60 80 74 92" stroke="#10321f" stroke-width="4.5" fill="none" stroke-linecap="round"/>':mood==='mid'?'<path d="M48 88 H72" stroke="#10321f" stroke-width="4.5" stroke-linecap="round"/>':'<path d="M44 84 Q60 100 76 84" stroke="#10321f" stroke-width="4.5" fill="none" stroke-linecap="round"/>';
  const cheeks=mood==='happy'?'<circle cx="36" cy="80" r="6" fill="#d6b26b" opacity=".55"/><circle cx="84" cy="80" r="6" fill="#d6b26b" opacity=".55"/>':'';
  const px=mood==='sad'?0:0;
  return `<svg class="gsvg" width="${sz}" height="${Math.round(sz*1.08)}" viewBox="0 0 120 130" role="img" aria-label="سند، رفيق الوعي"><path d="M60 6 L108 22 V62 C108 92 86 114 60 124 C34 114 12 92 12 62 V22 Z" fill="#1a4731" stroke="#c9993a" stroke-width="5"/><path d="M60 14 L100 27 V62 C100 87 82 106 60 116 C38 106 20 87 20 62 V27 Z" fill="#315946"/><polygon points="60,18 63.5,26 72,26.5 65.5,32 67.5,40 60,35.5 52.5,40 54.5,32 48,26.5 56.5,26" fill="#c9993a"/><circle cx="44" cy="64" r="9" fill="#fff"/><circle cx="76" cy="64" r="9" fill="#fff"/><circle cx="${44+px}" cy="65" r="4.5" fill="#10321f"/><circle cx="${76+px}" cy="65" r="4.5" fill="#10321f"/>${brow}${cheeks}${mouth}<path d="M20 104 Q60 122 100 104 L96 116 Q60 132 24 116 Z" fill="#486c5a"/><path d="M60 116 Q78 112 100 104 L98 110 Q80 118 62 122 Z" fill="#fff"/></svg>`;
}
function gsay(key){
  const t=GUIDE[key]&&GUIDE[key][S.aud];
  return t?`<div class="gd">${guide('happy',70)}<div class="gb">${t}</div></div>`:'';
}
const moodOf=s=>s===2?'happy':s===1?'mid':'sad';

/* cards */
function card(key){
  const c=CARDS[key],p=c[S.aud],open=S.cardOpen[key]!==false;
  return `<details class="info" data-card="${key}" ${open?'open':''}><summary>${ico('book')}بطاقة توعوية: ${c.t}</summary><div class="cols">${p.map((x,i)=>`<div class="pr"><b>${L[i]}</b><p>${x}</p></div>`).join('')}</div></details>`;
}
function fnote(key){
  const f=FAC[key];
  if(!S.fnotes||!f)return '';
  return `<details class="fnote" open><summary>${ico('clipboard')}ملاحظة للمنشّط (${f.t} دقائق تقريبًا)</summary><p><b>الهدف:</b> ${f.goal}</p><p><b>كيف تديرها:</b></p><ul>${f.run.map(x=>`<li>${x}</li>`).join('')}</ul><p><b>سؤال للنقاش:</b> ${f.ask.join(' · ')}</p><p class="care"><b>انتبه:</b> ${f.care}</p></details>`;
}

/* scenarios */
function scen(key,d){
  const a=S.ans[key];
  const best=d.opts.find(o=>o.s===2);
  const oi=ordr('o_'+key,d.opts.length);
  const msg=(S.dz&&d.dz)?d.dz:d.msg;
  let h=`<p class="ctx">${d.ctx}</p><div class="bubble">${msg}</div><div class="opts">`;
  oi.forEach(i=>{
    const o=d.opts[i];
    h+=`<button class="opt ${a!==undefined?(i===a?'pick s'+o.s:'dim'):''}" data-act="pick" data-key="${key}" data-i="${i}" ${a!==undefined?'disabled':''}>${o.t}</button>`;
  });
  h+='</div>';
  if(a!==undefined){
    const o=d.opts[a];
    h+=`<div class="fb s${o.s}"><span class="fav">${guide(moodOf(o.s),46)}</span><div><b class="fb-t">${ico(['alert','info','check-circle'][o.s])}${['انتبه','قريب من الصواب','أحسنت'][o.s]}</b><p>${o.f}</p>${o.s<2?`<p class="best">التصرف الأمثل: ${best.t}</p>`:''}</div></div>`;
    h+=`<button class="btn sec" data-act="retry" data-key="${key}">جرّب خيارًا آخر</button>`;
  }
  return h;
}
function seq(key){
  const items=SEQ[key].items(),btns=SEQ[key].btns;
  const q=S.q[key]||0,n=items.length,c=S.cor[key]||0;
  if(q>=n){
    const msg=c===n?'ممتاز! لم تخطئ ولا مرة.':c>=n-1?'رائع! أنت قريب من الإتقان.':'بداية جيدة. أعد المحاولة لتحسّن نتيجتك.';
    return `<div class="sum"><div class="gcenter">${guide(c>=n-1?'happy':'mid',80)}</div><div class="big">${c} / ${n}</div><p>${msg}</p><button class="btn sec" data-act="redo" data-key="${key}">أعد المحاولة</button></div>`;
  }
  const oi=ordr('q_'+key,n);
  const it=items[oi[q]],a=S.ans[key+q];
  let h=`<div class="item"><span class="cnt">السؤال ${q+1} من ${n}</span>${(S.dz&&it.d)?it.d:it.t}</div><div class="row">`;
  btns.forEach((b,i)=>{
    let cls='';
    if(a!==undefined){cls=i===it.c?'right':(i===a?'wrong':'dim')}
    h+=`<button class="opt ${cls}" data-act="sans" data-key="${key}" data-b="${i}" ${a!==undefined?'disabled':''}>${b.t}</button>`;
  });
  h+='</div>';
  if(a!==undefined){
    const ok=a===it.c;
    h+=`<div class="fb ${ok?'s2':'s0'}"><span class="fav">${guide(ok?'happy':'sad',46)}</span><div><b class="fb-t">${ico(ok?'check-circle':'alert')}${ok?'إجابة صحيحة':'ليس تمامًا'}</b><p>${it.f}</p></div></div><button class="btn" data-act="snext" data-key="${key}">${q+1<n?'التالي':'عرض النتيجة'}</button>`;
  }
  return h;
}
function quiz(key){
  const items=PRETEST[S.aud],qo=ordr('t_'+key,items.length),ans=S[key];
  let h='<div class="quiz">';
  qo.forEach((qi,pos)=>{
    const it=items[qi],oo=ordr('to_'+key+qi,it.o.length);
    h+=`<fieldset class="qz"><legend>${pos+1}. ${it.q}</legend>`;
    oo.forEach(oj=>{
      h+=`<label class="qo"><input type="radio" name="${key}_${qi}" data-act="qz" data-k="${key}" data-q="${qi}" data-o="${oj}" ${ans[qi]===oj?'checked':''}> <span>${it.o[oj]}</span></label>`;
    });
    h+='</fieldset>';
  });
  h+=`</div><p class="ctx" id="qzp">${qzProgress(key)}</p>`;
  return h;
}
function qzProgress(key){const n=Object.keys(S[key]).length;return n>=PRETEST[S.aud].length?'أجبت عن كل الأسئلة. يمكنك المتابعة.':`أجبت عن ${n} من ${PRETEST[S.aud].length}`}
function qzScore(key){const items=PRETEST[S.aud];return items.reduce((a,it,i)=>a+(S[key][i]===it.c?1:0),0)}
const ORD=['الأولى','الثانية','الثالثة','الرابعة','الخامسة','السادسة','السابعة','الثامنة','التاسعة','العاشرة','الحادية عشرة','الثانية عشرة','الثالثة عشرة','الرابعة عشرة','الخامسة عشرة','السادسة عشرة'];
const stNum=k=>{const i=ST.filter(s=>MAXP[s.k]).findIndex(s=>s.k===k);return i<0?null:'المحطة '+ORD[i]};
const H=(n,t,l)=>`<h2>${stNum(curKey)||n}: ${t}</h2><p class="lead">${l}</p>${gsay(curKey)}${fnote(curKey)}`;

/* ---------- stations ---------- */
const VIEW={
 intro(){
  const res=(SAVED&&hasProg(SAVED))?`<div class="resume"><b>وُجدت جلسة سابقة على هذا الجهاز.</b><div class="rrow"><button class="btn" data-act="resume">استئناف</button><button class="btn sec" data-act="newsess">جلسة جديدة</button></div></div>`:'';
  return `<div class="hero">
   <div class="seal"><img src="${LOGO}" alt="شعار ديوان قطاع الشباب والرياضة"></div>
   <div>
    <h2>وعيي درعي</h2>
    <p class="lead">رحلة من ${NSTATIONS} محطة بين اختبار قبلي وبعدي للوقاية من المخدرات والمهلوسات: بطاقة توعوية في كل محطة، ثم أسئلة ومواقف من واقعنا في الجزائر. يرافقك «سند».</p>
    ${res}
    <p class="ctx">من يشارك اليوم؟</p>
    <div class="aud">
      <button data-act="aud" data-v="kids" aria-pressed="${K()}"><b>الأطفال</b><span>مواقف وأسئلة بلغة بسيطة</span></button>
      <button data-act="aud" data-v="youth" aria-pressed="${!K()}"><b>الشباب</b><span>ضغط الرفاق، الأقراص، الإنترنت</span></button>
    </div>
    <div class="chips"><span class="chip">${ico('bulb','sm')}المعرفة</span><span class="chip">${ico('swap','sm')}الخرافات</span><span class="chip">${ico('pill','sm')}الأقراص</span><span class="chip">${ico('asterisk','sm')}المهلوسات</span><span class="chip">${ico('ban','sm')}الرفض</span><span class="chip">${ico('smartphone','sm')}الإنترنت</span><span class="chip">${ico('eye','sm')}العلامات</span><span class="chip">${ico('heart','sm')}المساعدة</span><span class="chip">${ico('scale','sm')}القانون</span><span class="chip">${ico('activity','sm')}البدائل</span><span class="chip">${ico('medical','sm')}الطوارئ</span></div>
    <div class="help" style="margin-top:1rem;max-width:520px"><b>لست وحدك:</b> الرقم الأخضر <b>1111</b> · الشرطة <b>1548</b> · الدرك <b>1055</b> · الحماية المدنية <b>14</b></div>
   </div>
  </div>${fnote('intro')}`;
 },
 pre(){return H('نقطة البداية','الاختبار القبلي','أجب عن الأسئلة الخمسة كما تعرف الآن، دون تصحيح. سنقارن النتيجة مع الاختبار البعدي في النهاية.')+quiz('pre')},
 post(){return H('قبل الختام','الاختبار البعدي','أجب عن الأسئلة نفسها الآن، ولنرَ ما تغيّر بعد الرحلة.')+quiz('post')},
 end(){
  const p=sum(),pct=Math.round(p/ptot()*100);
  const left=ST.filter(s=>MAXP[s.k]&&S.pts[s.k]===undefined);
  const lvl=lvlOf(pct);
  const hasPre=Object.keys(S.pre).length>=PRETEST[S.aud].length,hasPost=Object.keys(S.post).length>=PRETEST[S.aud].length;
  let cmp='';
  if(hasPre||hasPost){
    const a=hasPre?qzScore('pre'):null,b=hasPost?qzScore('post'):null,n=PRETEST[S.aud].length;
    cmp=`<div class="cmp"><div><span>قبل</span><b>${a===null?'—':a+' / '+n}</b></div><div class="arr" aria-hidden="true">${ico('arrow-l','lg')}</div><div><span>بعد</span><b>${b===null?'—':b+' / '+n}</b></div>${(a!==null&&b!==null)?`<p>${b>a?'تحسّنت نتيجتك بـ '+(b-a)+' نقطة. أحسنت!':b===a?'ثبتت نتيجتك. راجع البطاقات التي أخطأت فيها.':'انخفضت نتيجتك قليلًا، وهذا يحدث أحيانًا؛ أعد قراءة البطاقات.'}</p>`:''}</div>`;
  }
  return `<h2>الميثاق والنتيجة</h2>${gsay('end')}${fnote('end')}
  <p class="lead">نتيجة المحطات: <b style="color:var(--orange);font-size:1.4rem">${p} / ${ptot()}</b> — المستوى: <b>${lvl}</b></p>
  ${cmp}
  ${left.length?`<p>لم تكمل بعد: ${left.map(s=>`<button class="chip" data-act="go" data-i="${ST.indexOf(s)}">${ico(s.ic,'sm')} ${s.n}</button>`).join(' ')}</p>`:''}
  <p class="ctx">ميثاقي — ضع علامة على ما تلتزم به:</p>
  <ul class="pledge">${PLEDGE.map((t,i)=>`<li><label><input type="checkbox" data-act="pl" data-i="${i}" ${S.pledge[i]?'checked':''}> ${t}</label></li>`).join('')}</ul>
  ${endExtras()}
  <div class="certbox">
    <h3>شهادتي</h3>
    <div class="cgrid">
      <div class="cform">
        <p class="crow"><label>اسم المشارك: <input id="nm" placeholder="اكتب الاسم" maxlength="40" value="${esc(S.nm)}"></label></p>
        <p class="warn">رأسية الشهادة (اختيارية): اكتب ما تريد أن يظهر أعلى الشهادة.</p>
        <p class="crow"><label>الديوان/الهيئة: <input id="dwn" placeholder="يكتبه المستخدم" maxlength="70" value="${esc(S.dwn)}"></label></p>
        <p class="crow"><label>المديرية: <input id="dir" placeholder="يكتبها المستخدم" maxlength="70" value="${esc(S.dir)}"></label></p>
        <p class="crow"><label>المؤسسة/الدار: <input id="org" placeholder="يكتبها المستخدم" maxlength="70" value="${esc(S.org)}"></label></p>
        <div class="crow lgrow"><span>الشعار:</span>
          <label class="btn sec fl">رفع شعار<input type="file" id="lgf" accept="image/*" class="vh"></label>
          <button class="btn sec" id="lgd" type="button">استعمال شعار البرنامج</button>
          <button class="btn sec" id="lgx" type="button">إزالة الشعار</button></div>
      </div>
      <div class="cprev" id="cprev" aria-label="معاينة رأسية الشهادة"></div>
    </div>
    <div class="crow"><button class="btn" id="pr">طباعة الشهادة</button> <button class="btn sec" id="cp">نسخ نتيجتي</button> <button class="btn sec" id="dl">تنزيل CSV</button></div>
    <p class="warn" id="cpm" aria-live="polite"></p>
  </div>
  <div class="help"><b>أين أبلّغ وممن أطلب المساعدة؟</b> تحدث فورًا إلى شخص بالغ تثق به (أحد الوالدين، معلم، مرشد، مربٍّ أو مسؤول دار الشباب).
   <ul><li>الرقم الأخضر <b>1111</b> (الهيئة الوطنية لحماية وترقية الطفولة، واعتمدته وزارة التربية للتبليغ عن حالات المخدرات والمؤثرات العقلية في الوسط التربوي)</li><li>الشرطة: <b>1548</b> · الدرك الوطني: <b>1055</b></li><li>الحالات الطارئة (فقدان وعي، صعوبة تنفس): الحماية المدنية <b>14</b></li></ul></div>
  <div class="refs"><b>مراجع الإلهام:</b> محتوى البطاقات والأسئلة مستوحى من الإرشادات والتصريحات العلنية للجهات الرسمية الجزائرية. راجع صفحاتها الرسمية للاطلاع على آخر المستجدات.
   <ul><li>وزارة التربية الوطنية: اعتماد الرقم الأخضر 1111 للتبليغ عن حالات المخدرات والمؤثرات العقلية في الوسط التربوي، والقافلة الوطنية للتحسيس في الوسط المدرسي</li><li>الهيئة الوطنية لحماية وترقية الطفولة: الخط الأخضر 1111</li><li>الديوان الوطني لمكافحة المخدرات وإدمانها: استراتيجية الوقاية والعلاج والردع</li><li>القانون 04-18 المتعلق بالوقاية من المخدرات والمؤثرات العقلية وقمع الاستعمال والاتجار غير المشروعين بها وتعديله</li><li>تصريحات وزير التربية الوطنية حول العلاج بدل المتابعة القضائية للتلاميذ المتعاطين داخل المؤسسات</li></ul></div>`;
 }
};

const GENK=Object.keys(TITLES);
GENK.forEach(k=>{
  VIEW[k]=()=>{
    const t=TITLES[k],body=DS[k]?scen(k,DS[k][S.aud]):seq(k),r=RULES[k];
    return H('',t[0],t[1])+card(k)+body+(r?rule(r[0],r[1]):'');
  };
});

function lvlOf(pct){return pct>=85?'سفير الوعي':pct>=60?'حارس واعٍ':pct>=35?'مستكشف حذر':'متدرّب في بداية الطريق'}

/* documents */
function facView(){
  const rows=ST.filter(s=>FAC[s.k]).map(s=>{const f=FAC[s.k];return `<tr><td>${ico(s.ic,'sm')} ${s.n}</td><td>${f.t} د</td><td>${f.goal}</td><td><ul>${f.run.map(x=>`<li>${x}</li>`).join('')}</ul></td><td>${f.ask.join('<br>')}</td><td>${f.care}</td></tr>`}).join('');
  const tot=ST.reduce((a,s)=>a+(FAC[s.k]?FAC[s.k].t:0),0);
  return `<h2>ورقة المنشّط</h2><p class="lead">دليل مختصر لإدارة الحصة: التحضير، صيغ الحصة، وتوجيهات كل محطة. الزمن الكلي المقترح للنسخة الكاملة نحو ${tot} دقيقة.</p>
  <p class="noprint"><button class="btn" data-act="printdoc">طباعة الورقة</button></p>
  <h3>قبل الحصة</h3><ul>${FAC_PREP.map(x=>`<li>${x}</li>`).join('')}</ul>
  <h3>صيغ مقترحة للحصة</h3>${FAC_PLANS.map((p,i)=>{const b=(v,t)=>`<button class="pill noprint" data-act="${v==='full'?'pathclear':'pathset'}" data-v="${v}" aria-pressed="${v==='full'?!(S.path&&S.path.length):S.pathN===PATHS[v].n}">${t}</button>`;const bt=[b('short','طبّق على البرنامج'),b('full','كل المحطات'),b('ws1','طبّق الجلسة 1')+' '+b('ws2','طبّق الجلسة 2')][i]||'';return `<p><b>${p.n}:</b> ${p.l.join(' · ')}<br>${bt}</p>`}).join('')}
  <h3>توجيهات المحطات</h3><div class="tblw"><table class="tbl"><thead><tr><th>المحطة</th><th>الزمن</th><th>الهدف</th><th>كيف تديرها</th><th>سؤال للنقاش</th><th>انتبه</th></tr></thead><tbody>${rows}</tbody></table></div>
  ${facExtra()}<h3>عند كشف حالة حساسة</h3><ul>${FAC_SENS.map(x=>`<li>${x}</li>`).join('')}</ul>
  <div class="help"><b>أرقام مهمة:</b><ul><li>الرقم الأخضر للطفولة: <b>1111</b></li><li>الشرطة: <b>1548</b> · الدرك الوطني: <b>1055</b></li></ul></div>`;
}
/* ---------- المساعدة والقانون (مرجع) ---------- */
const REF_LAW=[
 ['الإطار القانوني','القانون 04-18 (25 ديسمبر 2004) المتعلق بالوقاية من المخدرات والمؤثرات العقلية وقمع الاستعمال والاتجار غير المشروعين بها.','الجريدة الرسمية؛ موقع الديوان الوطني لمكافحة المخدرات وإدمانها'],
 ['المتعاطي والمروّج','يفرّق القانون بين المتعاطي الذي يحتاج إلى علاج، والمروّج الذي يعاقَب بشدة. ويشدد العقوبات خصوصًا على الترويج في أوساط الأحداث والمؤسسات التعليمية والتكوينية.','القانون 04-18؛ موقع الديوان الوطني'],
 ['العلاج قبل العقاب','يتيح القانون للقاضي أن يأمر بالعلاج المزيل للتسمم، ويعفي من المتابعة القضائية من يقبل الخضوع للعلاج وفق الشروط التي ينص عليها.','القانون 04-18؛ موقع الديوان الوطني'],
 ['التعديل الأخير','القانون 25-03 (أول يوليو 2025، الجريدة الرسمية العدد 43) عدّل القانون 04-18: شدّد العقوبات بحسب خطورة الأفعال، واشترط تحليلًا سلبيًا للمخدرات في ملفات التوظيف بالهيئات والمؤسسات العمومية، وأتاح للجهة القضائية وضع المعني تحت مراقبة طبية لمدة لا تتجاوز سنة بعد العلاج.','الجريدة الرسمية العدد 43؛ تغطية صحفية للقانون']
];
function refView(){
  const T=(h,id)=>`<h2 class="refsec" id="${id}">${h}</h2>`;
  const li=a=>a.map(x=>`<li>${x}</li>`).join('');
  return `<h2>المساعدة والقانون</h2>
  <p class="lead">مرجع للمنشّط والمشاركين والأولياء: أين نطلب المساعدة لنا أو لصديق، وما يقوله القانون عن المخدرات، وماذا نفعل أمام العروض والضغط والحالات الطارئة.</p>
  <p class="noprint refnav"><a class="pill" href="#r-help">أين أطلب المساعدة؟</a> <a class="pill" href="#r-law">القانون والمخدرات</a> <a class="pill" href="#r-no">عندما يُعرض عليّ شيء</a> <a class="pill" href="#r-friend">كيف أساعد صديقًا؟</a> <a class="pill" href="#r-em">الطوارئ</a> <button class="btn" data-act="printdoc">طباعة</button></p>

  ${T('أين أطلب المساعدة؟','r-help')}
  <p>طلب المساعدة شجاعة وليس ضعفًا، وهو أسرع طريق لحماية نفسك أو صديقك. ابدأ بشخص بالغ تثق به.</p>
  <div class="tblw"><table class="tbl"><thead><tr><th>الجهة</th><th>متى وكيف</th></tr></thead><tbody>
   <tr><td><b>شخص بالغ تثق به</b></td><td>والد أو والدة، أو مرشد المؤسسة أو أخصائيها النفسي، أو طبيب العائلة، أو منشّط دار الشباب. هذه أول خطوة دائمًا.</td></tr>
   <tr><td><b>مراكز علاج الإدمان</b></td><td>أعلنت وزارة الصحة عن شبكة مراكز وسيطة لعلاج الإدمان تغطي تقريبًا كل ولاية (46 مركزًا وقت الإعلان)، وتوفر علاجًا خارجيًا دون إقامة، إضافة إلى مصالح استشفائية. اسأل الطبيب أو مديرية الصحة في ولايتك عن أقرب مركز.</td></tr>
   <tr><td><b>الرقم الأخضر 1111</b></td><td>للتبليغ والمساعدة، وهو الرقم الذي اعتمدته وزارة التربية الوطنية للتبليغ عن المخدرات في الوسط المدرسي.</td></tr>
   <tr><td><b>الشرطة 1548 · الدرك 1055</b></td><td>للتبليغ عن ترويج أو تهديد أو ضغط. وللدرك الوطني شكوى مسبقة عبر الإنترنت على ppgn.mdn.dz، والموقع الرسمي للأمن الوطني algeriepolice.dz.</td></tr>
   <tr><td><b>الحماية المدنية 14</b></td><td>للحالات الطارئة فقط (فقدان وعي، صعوبة تنفس، ارتباك شديد).</td></tr></tbody></table></div>
  <div class="refs">المصادر: وزارة الصحة (بيان نشرته صحيفة البلاد عن المراكز الوسيطة)؛ موقع الديوان الوطني لمكافحة المخدرات وإدمانها؛ موقعا الدرك الوطني والأمن الوطني؛ الرقم 1111 كما اعتمدته وزارة التربية الوطنية.</div>

  ${T('القانون والمخدرات','r-law')}
  <p>هذا تبسيط تعليمي وليس استشارة قانونية. تغيّرت بعض العقوبات بالتعديل الأخير، فراجع نص القانون كما عُدّل أو استشر مختصًا قبل الاستشهاد بأي رقم.</p>
  <div class="tblw"><table class="tbl"><thead><tr><th>الموضوع</th><th>ما يقرره القانون</th><th>المرجع</th></tr></thead><tbody>${REF_LAW.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table></div>
  <p class="warn">فكرة للنقاش: لماذا يفرّق القانون بين من يحتاج إلى علاج ومن يروّج، ولماذا يشدد على الترويج قرب المدارس؟</p>
  <div class="refs">المصادر: القانون 04-18 كما ورد في موقع الديوان الوطني لمكافحة المخدرات وإدمانها (وزارة العدل) وقاعدة بيانات الأمم المتحدة للتشريعات؛ القانون 25-03 كما نشرته الجريدة الرسمية العدد 43 (13 جويلية 2025) وتغطية صحيفة المجاهد له.</div>

  ${T('عندما يُعرض عليّ شيء أو يُضغط عليّ','r-no')}
  <ol class="refsteps">
   <li><b>قل «لا» بوضوح</b> وبصوت هادئ، ولا تقدّم أعذارًا طويلة.</li>
   <li><b>قدّم بديلًا:</b> «لنذهب إلى الملعب» أو «سأعود إلى البيت».</li>
   <li><b>غادر</b> فورًا ولا تبقَ لتبرّر موقفك.</li>
   <li><b>أخبر شخصًا موثوقًا</b> بما حدث، ولا تحتفظ بالأمر لنفسك.</li></ol>
  <h3>عبر الإنترنت</h3>
  <ul>${li(['لا تردّ على الحسابات التي تعرض أقراصًا أو مواد، ولا تسأل عن السعر.','لا تقبل لقاءً ولا هدية ولا توصيلًا من شخص لا تعرفه.','صوّر العرض واسم الحساب، ثم احظره وبلّغ المنصة.','أخبر بالغًا، وبلّغ الشرطة (1548) أو الدرك (1055) إن كان هناك ترويج أو تهديد.'])}</ul>
  <h3>عندما يستمر الإلحاح أو التهديد</h3>
  <ul>${li(['كرّر الرفض بهدوء ولا تغيّر موقفك.','لا تذهب إلى لقاء ولو وعدوك بأنه «مرة واحدة».','وثّق الرسائل ولا تحذفها، وأخبر بالغًا موثوقًا فورًا.'])}</ul>

  ${T('كيف أساعد صديقًا؟','r-friend')}
  <ul>${li(['<b>استمع</b> إليه بهدوء ودون أحكام أو سخرية.','<b>لا تعده بكتمان</b> ما يعرّضه للخطر، فالأمان أهم من السر.','<b>أشرك راشدًا أو مختصًا</b> (مرشد، طبيب، أخصائي نفسي) وساعده على الوصول إلى العلاج.','<b>ابقَ إلى جانبه</b> ولا تقاطعه، فالعزلة تزيد الأمر سوءًا.','إن كان الخطر عاجلًا فاتصل بالحماية المدنية 14.'])}</ul>
  <p class="warn">تذكّر: العلامة الواحدة لا تثبت شيئًا. لا تتهم أحدًا ولا تشخّصه، واقترب منه بلطف.</p>

  ${T('الحالات الطارئة','r-em')}
  <ol class="refsteps">
   <li><b>اتصل فورًا بالحماية المدنية 14</b> أو الإسعاف، وأعطِ المكان بدقة.</li>
   <li><b>ابقَ مع الشخص</b> ولا تتركه وحده لينام.</li>
   <li>إن كان لا يستجيب لكنه يتنفس فضعه على جانبه ريثما يصل الإسعاف.</li>
   <li><b>لا تعطه شيئًا</b> يأكله أو يشربه، <b>ولا تجبره على القيء.</b></li>
   <li>أخبر المسعفين بما تعرفه عمّا تناوله ومتى.</li></ol>
  <div class="refs">المصدر: خطوات الطوارئ كما وردت في هذا البرنامج، وهي إرشادات الإسعاف الأولي العامة؛ الأرقام: الحماية المدنية 14.</div>`;
}
function parView(){
  return `<h2>دليل الأولياء والمربين</h2><p class="lead">كيف نرافق أبناءنا على الإنترنت بحوار وثقة، ونحميهم بخطوات عملية بسيطة.</p>
  <p class="noprint"><button class="btn" data-act="printdoc">طباعة الدليل</button> <button class="btn sec" data-act="kitprint" data-v="pact">طباعة ميثاق الأسرة للوقاية</button></p>
  ${PAR.map(s=>`<section class="psec"><h3>${s.h}</h3>${s.p?`<p>${s.p}</p>`:''}${s.ul?`<ul>${s.ul.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}</section>`).join('')}
  <div class="refs">دليل عام مبني على الإرشادات المعلنة للجهات الجزائرية المعنية بحماية الطفولة والأمن، وعلى ممارسات شائعة في حماية الأطفال على الإنترنت. لا يغني عن استشارة مختص عند الحاجة.</div>`;
}

/* ---------- rendering ---------- */
function drawTrack(){
  $('#track').innerHTML=ST.map((s,i)=>{
    const cls=i===S.i?'cur':(S.pts[s.k]!==undefined||(s.k==='pre'&&Object.keys(S.pre).length)||(s.k==='post'&&Object.keys(S.post).length)||(i<S.i&&S.visited[i]))?'done':'';
    return `<button class="node ${cls}${inPath(s.k)?'':' skip'}" data-act="go" data-i="${i}" aria-label="${s.n}" ${i===S.i?'aria-current="step"':''}><span class="dot">${ico(s.ic)}</span><span>${s.n}</span></button>`;
  }).join('');
  const c=document.querySelector('.node.cur');
  if(c&&c.scrollIntoView)c.scrollIntoView({inline:'center',block:'nearest'});
}
function syncBar(){
  const tw=document.querySelector('.track-wrap');if(tw)tw.hidden=S.mode!=='prog';
  const map={home:'#tHome',prog:'#tProg',contest:'#tCt',parents:'#tPar',fac:'#tFac',ref:'#tRef',kit:'#tKit',report:'#tRep'};
  Object.keys(map).forEach(m=>{const e=$(map[m]);if(e)e.setAttribute('aria-pressed',S.mode===m)});
  [['dz','#bDz'],['snd','#bSnd'],['shuf','#bShuf'],['hc','#bHc'],['fnotes','#bFn'],['stage','#bStage']].forEach(([k,id])=>{const e=$(id);if(e)e.setAttribute('aria-pressed',!!S[k])});
  const de=document.documentElement;
  if(de.classList){de.classList.toggle('stage',!!S.stage);de.classList.toggle('hc',!!S.hc)}
  const fs=Math.max(-1,Math.min(4,S.fs||0));de.style.fontSize=fs?((S.stage?125:100)+10*fs)+'%':'';
  const fm=$('#bFsm'),fp=$('#bFsp');if(fm)fm.disabled=fs<=-1;if(fp)fp.disabled=fs>=4;
  const st=$('#bStage');if(st)st.textContent=S.stage?'إنهاء وضع العرض':'وضع العرض';
}
/* ---------- الغلاف: مسار التنقل، الدرج الجانبي، البحث، الإشعارات ---------- */
const crumbs=$('#crumbs'),menuBtn=$('#menuBtn'),gsRes=$('#gsRes'),nfPanel=$('#nfPanel');
const MODE_LABEL={home:'الرئيسية',prog:'الرحلة التعليمية',contest:'المسابقة',parents:'دليل الأولياء',fac:'ورقة المنشّط',ref:'المساعدة والقانون',kit:'المطبوعات',report:'لوحة المنشّط'};
function shellSync(){
  const m=S.mode,parts=[];
  if(m==='home')parts.push({t:MODE_LABEL.home,cur:true});
  else{
    parts.push({t:MODE_LABEL.home,act:'home'});
    if(m==='prog'){
      parts.push({t:MODE_LABEL.prog,act:'prog0',mid:true});
      const st=ST[S.i],nth=ST.filter((x,ix)=>ix<=S.i&&MAXP[x.k]).length;
      parts.push({t:(MAXP[st.k]?'المحطة '+nth+': ':'')+st.n,cur:true});
    }else parts.push({t:MODE_LABEL[m],cur:true});
  }
  crumbs.innerHTML=parts.map((p,i)=>(i?`<span class="sep" aria-hidden="true">${ico('chevron-l','sm')}</span>`:'')+(p.cur?`<span aria-current="page">${esc(p.t)}</span>`:`<button type="button" data-act="crumb" data-v="${p.act}" class="${p.mid?'crumb-mid':''}">${esc(p.t)}</button>`)).join('');
  document.title=(m==='prog'?ST[S.i].n+' — ':m==='home'?'':MODE_LABEL[m]+' — ')+'وعيي درعي';
  closeDrawer();nfUpd();
}
function closeDrawer(){document.body.classList.remove('drawer-open');if(menuBtn)menuBtn.setAttribute('aria-expanded','false')}
function toggleDrawer(){const o=document.body.classList.toggle('drawer-open');menuBtn.setAttribute('aria-expanded',o?'true':'false')}

/* بحث شامل (أقسام + محطات + مراجع) */
const arNorm=s=>String(s||'').replace(/[\u064B-\u0652\u0640]/g,'').replace(/[إأآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').toLowerCase();
function searchIndex(){
  const out=[];
  Object.keys(MODE_LABEL).forEach(m=>out.push({t:MODE_LABEL[m],s:'قسم',ic:{home:'home',prog:'compass',contest:'trophy',parents:'users',fac:'clipboard',ref:'life-buoy',kit:'printer',report:'chart'}[m],k:MODE_LABEL[m],run:()=>{S.mode=m;render(true)}}));
  ST.forEach((s,i)=>out.push({t:s.n,s:'محطة',ic:s.ic,k:s.n,run:()=>go(i)}));
  [['أين أطلب المساعدة؟','r-help','مركز علاج الإدمان الرقم الأخضر 1111 الشرطة 1548 الدرك 1055 الحماية المدنية 14 تبليغ'],['القانون والمخدرات','r-law','القانون 04-18 25-03 عقوبة علاج متعاطي مروج توظيف تحليل'],['عندما يُعرض عليّ شيء أو يُضغط عليّ','r-no','رفض ضغط قل لا إنترنت'],['كيف أساعد صديقًا؟','r-friend','صديق مساعدة استماع'],['الحالات الطارئة','r-em','طوارئ إسعاف وضعية الإفاقة غيبوبة']].forEach(([t,id,k])=>out.push({t,s:'المساعدة والقانون',ic:'life-buoy',k:t+' '+k,run:()=>{S.mode='ref';render(true);setTimeout(()=>{const e=document.getElementById(id);if(e)e.scrollIntoView({behavior:'smooth',block:'start'})},140)}}));
  [['حقيبة المطبوعات: الشهادات والبطاقات والملصق','kit'],['ميثاق الأسرة للوقاية','kit']].forEach(([t,m])=>out.push({t,s:'المطبوعات',ic:'printer',k:t+' طباعة',run:()=>{S.mode=m;render(true)}}));
  return out;
}
let gsIdx=null;
function gsRender(q){
  const n=arNorm(q).trim();
  if(!n){gsRes.hidden=true;return}
  gsIdx=gsIdx||searchIndex();
  const hits=gsIdx.filter(x=>arNorm(x.k).includes(n)).slice(0,8);
  gsRes.hidden=false;
  gsRes.innerHTML=hits.length?hits.map((h,i)=>`<button type="button" class="${i===0?'on':''}" data-act="gsgo" data-i="${gsIdx.indexOf(h)}">${ico(h.ic,'sm')}<span>${esc(h.t)}</span><span class="st">${h.s}</span></button>`).join(''):`<div class="none">لا توجد نتائج لـ «${esc(q)}»</div>`;
}
function gsGo(i){const h=gsIdx&&gsIdx[i];if(!h)return;gsRes.hidden=true;const f=$('#gs');if(f)f.value='';h.run()}

/* الإشعارات: تُحسب من حالة البرنامج الحالية */
const PREPK='diwan-drugs-prep';
function getPrep(){try{return JSON.parse(localStorage.getItem(PREPK)||'{}')}catch(_){return {}}}
function setPrep(o){try{localStorage.setItem(PREPK,JSON.stringify(o))}catch(_){}}
const prepCount=()=>{const o=getPrep();return FAC_PREP.filter((_,i)=>o['p'+i]).length};
function nfItems(){
  const a=[],log=getLog(),r=S.rep||{};
  if(!log.length)a.push({ic:'info',t:'لا توجد نتائج مسجّلة بعد',d:'تظهر هنا نتائج المشاركين بعد أن يحفظ كل منهم نتيجته في نهاية الرحلة.',b:'افتح الرحلة',m:'prog'});
  const np=log.filter(e=>e.post==null).length;
  if(log.length&&np)a.push({ic:'alert',t:np+(np>1?' مشاركين لم يكملوا':' مشارك لم يكمل')+' الاختبار البعدي',d:'من دونه لا يظهر تحسّن المعرفة في اللوحة.',b:'لوحة المنشّط',m:'report',tab:'people'});
  if(!r.place||!r.fac)a.push({ic:'clipboard',t:'بيانات الحصة غير مكتملة',d:'أضف المكان واسم المنشّط قبل طباعة التقرير.',b:'أكملها',m:'report',tab:'info'});
  const pc=prepCount();if(pc<FAC_PREP.length)a.push({ic:'check-circle',t:'تحضير الحصة: '+pc+' من '+FAC_PREP.length,d:'راجع قائمة التحضير قبل بدء الحصة.',b:'القائمة',m:'report',tab:'over'});
  if(S.path&&S.path.length)a.push({ic:'map-pin',t:'مسار مخصّص مفعّل',d:S.pathN+' — '+S.path.length+' محطة.',b:'ورقة المنشّط',m:'fac'});
  return a;
}
function nfUpd(){const d=$('#nfDot');if(!d)return;const n=nfItems().length;d.hidden=!n;d.textContent=n}
function nfRender(){
  const it=nfItems();
  nfPanel.innerHTML='<h4>الإشعارات</h4>'+(it.length?it.map(x=>`<div class="nf-item">${ico(x.ic)}<div><b>${x.t}</b>${x.d}${x.b?`<br><button type="button" class="btn sec sm" data-act="nfgo" data-m="${x.m}" data-tab="${x.tab||''}">${x.b}</button>`:''}</div></div>`).join(''):`<div class="nf-empty">${ico('check-circle','xl')}<br>لا توجد تنبيهات. كل شيء على ما يرام.</div>`);
}
function nfClose(){if(nfPanel&&!nfPanel.hidden){nfPanel.hidden=true;$('#nfBtn').setAttribute('aria-expanded','false')}}

/* ---------- الصفحة الرئيسية ---------- */
function homeView(){
  const log=getLog(),cts=getCtLog();
  const svc=[['prog','compass','الرحلة التعليمية','ثلاث عشرة محطة مع اختبار قبلي وبعدي وشارات وشهادة.'],['contest','trophy','المسابقة','مسابقة بين الفرق على جهاز واحد مع لوحة ترتيب وسؤال فاصل.'],['parents','users','دليل الأولياء','كيف نحاور أبناءنا ونحميهم ونتصرف عند الخطر.'],['ref','life-buoy','المساعدة والقانون','أين نطلب المساعدة، وما يقوله القانون، وماذا نفعل عند الضغط.'],['fac','clipboard','ورقة المنشّط','توجيهات كل محطة ومسارات جاهزة بالوقت.'],['kit','printer','المطبوعات','بطاقات وملصق QR وميثاق الأسرة والشهادات.']];
  const act=[];
  log.slice(-4).forEach(e=>act.push({id:e.id,ic:'user',t:'نتيجة مشارك: '+(e.nm||'دون اسم'),d:e.score+' من '+e.total+' نقطة',b:(e.pre!=null&&e.post!=null)?(e.post>e.pre?['gold','تحسّن']:e.post<e.pre?['red','تراجع']:['muted','ثبات']):null}));
  cts.slice(-3).forEach(e=>{const m=Math.max(...e.teams.map(t=>t.s)),w=e.teams.filter(t=>t.s===m);act.push({id:e.id,ic:'trophy',t:'مسابقة بين '+e.teams.length+' فرق',d:m>0?(w.length>1?'انتهت بتعادل':'الفائز: '+e.teams.find(t=>t.s===m).n):'لم يُسجَّل فائز',gold:1,b:null})});
  act.sort((a,b)=>b.id-a.id);
  const fmt=id=>{try{return new Date(id).toLocaleDateString('ar-DZ',{day:'numeric',month:'long'})}catch(_){return ''}};
  return `<section class="hero-home" aria-labelledby="hh">
    <div>
      <span class="eyebrow">ديوان قطاع الشباب والرياضة</span>
      <h1 id="hh">وعيي درعي</h1>
      <p>برنامج تحسيسي تفاعلي للوقاية من المخدرات والمهلوسات. نتعلّم كيف نفهم المخاطر، وكيف نقول «لا»، وأين نجد المساعدة، بمواقف وأسئلة من واقعنا في الجزائر.</p>
      <div class="acts">
        <button class="btn gold lg" data-act="mode" data-v="prog">${SAVED?'ابدأ الرحلة':'ابدأ الرحلة'}${ico('arrow-l')}</button>
        ${SAVED?'<button class="btn sec lg" data-act="resume">استئناف رحلتي</button>':'<button class="btn sec lg" data-act="spopen">تعرّف على البرنامج</button>'}
      </div>
      <div class="chips"><span class="chip">${ico('users','sm')}للأطفال والشباب</span><span class="chip">${ico('lock','sm')}لا يجمع أي بيانات</span><span class="chip">${ico('shield-check','sm')}وقائي بلا تفاصيل خطرة</span></div>
    </div>
    <div class="hero-logo"><img src="assets/img/logo-512.webp" width="290" height="290" alt="شعار ديوان قطاع الشباب والرياضة"></div>
  </section>

  <div class="stats">
    <div class="stat"><span class="si">${ico('compass')}</span><div><span class="sv num">${NSTATIONS}</span><span class="sl2">محطة تعليمية</span></div></div>
    <div class="stat"><span class="si">${ico('users')}</span><div><span class="sv num">2</span><span class="sl2">فئتان: أطفال وشباب</span></div></div>
    <div class="stat"><span class="si">${ico('clipboard-check')}</span><div><span class="sv num">${log.length}</span><span class="sl2">مشارك مسجَّل</span></div></div>
    <div class="stat"><span class="si">${ico('trophy')}</span><div><span class="sv num">${cts.length}</span><span class="sl2">مسابقة منفَّذة</span></div></div>
  </div>

  <div class="sec-head"><h2>الوصول السريع</h2></div>
  <div class="svc-grid">${svc.map(s=>`<button type="button" class="card hover svc" data-act="mode" data-v="${s[0]}"><span class="si">${ico(s[1])}</span><h3>${s[2]}</h3><p>${s[3]}</p><span class="go">افتح${ico('arrow-l','sm')}</span></button>`).join('')}</div>

  <div class="sec-head"><h2>آخر الأنشطة</h2><button type="button" class="link" data-act="mode" data-v="report">لوحة المنشّط${ico('arrow-l','sm')}</button></div>
  <div class="card">${act.length?`<ul class="act-list">${act.slice(0,5).map(x=>`<li class="act"><span class="ai ${x.gold?'gold':''}">${ico(x.ic)}</span><div><b>${esc(x.t)}</b><small>${esc(x.d)} · ${fmt(x.id)}</small></div>${x.b?`<span class="badge ${x.b[0]}">${x.b[1]}</span>`:''}</li>`).join('')}</ul>`:`<div class="empty"><span class="ei">${ico('sparkle')}</span><h4>لا توجد أنشطة بعد</h4><p>ابدأ حصة جديدة، وستظهر هنا نتائج المشاركين والمسابقات تلقائيًا.</p><button class="btn" data-act="mode" data-v="prog">ابدأ الرحلة</button></div>`}</div>

  <div class="sec-head"><h2>لست وحدك</h2></div>
  <div class="band">
    <div><h3>المساعدة متاحة دائمًا</h3><p>إن أخافك شيء أو عُرض عليك ما يؤذيك، فاطلب المساعدة فورًا. طلب المساعدة قوة.</p></div>
    <div class="bnums">
      <a class="bnum" href="tel:1111"><b>1111</b><span>الرقم الأخضر</span></a>
      <a class="bnum" href="tel:1548"><b>1548</b><span>الشرطة</span></a>
      <a class="bnum" href="tel:1055"><b>1055</b><span>الدرك الوطني</span></a>
      <a class="bnum" href="tel:14"><b>14</b><span>الحماية المدنية</span></a>
    </div>
  </div>`;
}

/* ---------- لوحة المنشّط (التقرير) ---------- */
const DASH={tab:'over',q:'',page:1,per:8};
function weakStations(n){
  const a=getLog();
  return Object.keys(MAXP).map(k=>{const v=a.filter(e=>e.ps&&e.ps[k]!==undefined).map(e=>e.ps[k]/MAXP[k]);return {k,n:v.length,r:v.length?avg(v):null}}).filter(x=>x.n>=2&&x.r!=null).sort((x,y)=>x.r-y.r).slice(0,n);
}
function dashAlerts(){
  const log=getLog(),r=S.rep,out=[];
  if(!log.length)out.push(`<div class="alert"><svg class="ic" aria-hidden="true"><use href="#i-info"/></svg><div><b>لا توجد نتائج مسجّلة بعد</b><p>يضغط كل مشارك «حفظ نتيجتي في سجل الجلسة» في نهاية الرحلة، فتظهر نتيجته هنا.</p></div></div>`);
  const np=log.filter(e=>e.post==null).length;
  if(log.length&&np)out.push(`<div class="alert warning"><svg class="ic" aria-hidden="true"><use href="#i-alert"/></svg><div><b>${np} ${np>1?'مشاركين لم يكملوا':'مشارك لم يكمل'} الاختبار البعدي</b><p>من دونه لا يظهر تحسّن المعرفة لهؤلاء المشاركين.</p></div></div>`);
  if(!r.place||!r.fac)out.push(`<div class="alert warning"><svg class="ic" aria-hidden="true"><use href="#i-clipboard"/></svg><div><b>بيانات الحصة غير مكتملة</b><p>أضف المكان واسم المنشّط في تبويب «بيانات الحصة» قبل طباعة التقرير.</p></div></div>`);
  return out.join('');
}
function dashOver(){
  const st=stats(),m=repSum(),log=getLog(),nb=m.both.length,qn=st.qn;
  const gain=nb?Math.round(m.up/nb*100):null;
  const hasPP=st.pre!=null&&st.post!=null;
  const col=(v,cls)=>`<div class="col"><b class="num">${f1(v)}</b><div class="bar ${cls}" style="height:${Math.max(3,Math.round(v/qn*100))}%"></div></div>`;
  const wk=weakStations(5),pc=prepCount(),o=getPrep();
  return `<div class="stats">
    <div class="stat"><span class="si">${ico('users')}</span><div><span class="sv num">${st.n}</span><span class="sl2">المشاركون المسجَّلون</span></div></div>
    <div class="stat"><span class="si">${ico('compass')}</span><div><span class="sv num">${st.sc==null?'—':Math.round(st.sc)+'%'}</span><span class="sl2">متوسط إنجاز المحطات</span></div></div>
    <div class="stat"><span class="si">${ico('clipboard-check')}</span><div><span class="sv num">${hasPP?f1(st.pre)+' ← '+f1(st.post):'—'}</span><span class="sl2">القبلي ← البعدي (من ${qn})</span></div></div>
    <div class="stat dark"><span class="si">${ico('award')}</span><div><span class="sv num">${gain==null?'—':gain+'%'}</span><span class="sl2">نسبة من تحسّنوا</span></div></div>
  </div>
  <div class="dash-grid">
    <div>
      <div class="chart"><h4>معرفة المشاركين: قبل الحصة وبعدها</h4>
        ${hasPP?`<div class="cols-chart">${col(st.pre,'o')}${col(st.post,'g')}</div><div class="col-lab"><span>الاختبار القبلي</span><span>الاختبار البعدي</span></div>
        <div class="legend"><span><i class="i-gold"></i>القبلي</span><span><i class="i-green"></i>البعدي</span></div>`:`<div class="empty"><span class="ei">${ico('chart')}</span><h4>لا توجد بيانات كافية</h4><p>يظهر الرسم حين يُكمل مشارك واحد على الأقل الاختبارين القبلي والبعدي.</p></div>`}
      </div>
      <div class="chart" style="margin-top:1rem"><h4>المحطات الأكثر تعثرًا</h4>
        ${wk.length?`<div class="hbars">${wk.map((x,i)=>`<div class="hb ${i===0?'warn':''}"><span>${esc(ST.find(s=>s.k===x.k).n)}</span><div class="pr"><i style="width:${Math.round(x.r*100)}%"></i></div><b>${Math.round(x.r*100)}%</b></div>`).join('')}</div><p class="caption" style="margin-top:.6rem">نسبة الإجابات الصحيحة. الأقل نسبةً أولًا، وتستحق مراجعة في الحصة القادمة.</p>`:`<div class="empty"><span class="ei">${ico('activity')}</span><h4>لا توجد بيانات كافية</h4><p>تظهر المحطات بعد تسجيل مشاركَين على الأقل.</p></div>`}
      </div>
    </div>
    <div>
      <div class="card"><div class="card-head"><h3>اختصارات</h3></div>
        <div class="shortcuts">
          <button type="button" class="sc" data-act="repprint">${ico('printer')}طباعة التقرير</button>
          <button type="button" class="sc" data-act="mode" data-v="contest">${ico('trophy')}فتح المسابقة</button>
          <button type="button" class="sc" data-act="mode" data-v="kit">${ico('file')}المطبوعات</button>
          <button type="button" class="sc" data-act="mode" data-v="fac">${ico('clipboard')}ورقة المنشّط</button>
        </div></div>
      <div class="card" style="margin-top:1rem"><div class="card-head"><h3>تحضير الحصة</h3><span class="badge ${pc===FAC_PREP.length?'':'gold'}" id="prepc">${pc} / ${FAC_PREP.length}</span></div>
        <div class="progress ${pc===FAC_PREP.length?'':'gold'}" style="margin-bottom:.8rem"><i style="width:${Math.round(pc/FAC_PREP.length*100)}%"></i></div>
        <ul class="prep">${FAC_PREP.map((x,i)=>`<li><label><input type="checkbox" data-act="prep" data-k="p${i}" ${o['p'+i]?'checked':''}><span>${x}</span></label></li>`).join('')}</ul></div>
    </div>
  </div>`;
}
function dashRows(){
  const q=arNorm(DASH.q).trim();
  return getLog().map((e,i)=>({...e,_i:i+1})).filter(e=>!q||arNorm(e.nm||'دون اسم').includes(q)||arNorm(e.aud==='kids'?'أطفال':'شباب').includes(q)).reverse();
}
function dashTable(){
  const rows=dashRows(),n=rows.length,pages=Math.max(1,Math.ceil(n/DASH.per));
  if(DASH.page>pages)DASH.page=pages;
  if(!getLog().length)return `<div class="empty"><span class="ei">${ico('users')}</span><h4>السجل فارغ</h4><p>لم يُحفظ أي مشارك بعد. ابدأ الرحلة، وفي نهايتها يحفظ المشارك نتيجته.</p><button class="btn" data-act="mode" data-v="prog">ابدأ الرحلة</button></div>`;
  if(!n)return `<div class="empty"><span class="ei">${ico('search')}</span><h4>لا توجد نتائج مطابقة</h4><p>جرّب كلمة أخرى للبحث.</p></div>`;
  const from=(DASH.page-1)*DASH.per,part=rows.slice(from,from+DASH.per);
  const chg=e=>e.pre==null||e.post==null?'<span class="badge muted">—</span>':e.post>e.pre?`<span class="badge gold">+${e.post-e.pre}</span>`:e.post<e.pre?`<span class="badge red">${e.post-e.pre}</span>`:'<span class="badge muted">ثبات</span>';
  const nums=[];for(let p=Math.max(1,DASH.page-2);p<=Math.min(pages,DASH.page+2);p++)nums.push(p);
  return `<div class="tblw"><table class="tbl"><thead><tr><th>#</th><th>الاسم</th><th>الفئة</th><th>المحطات</th><th class="num">قبلي</th><th class="num">بعدي</th><th>التغيّر</th></tr></thead><tbody>${part.map(e=>`<tr><td class="num">${e._i}</td><td><b>${esc(e.nm||'دون اسم')}</b></td><td><span class="badge ${e.aud==='kids'?'':'solid'}">${e.aud==='kids'?'أطفال':'شباب'}</span></td><td><div class="progress" style="min-width:90px"><i style="width:${Math.round(e.score/e.total*100)}%"></i></div><small class="num">${e.score}/${e.total}</small></td><td class="num">${e.pre==null?'—':e.pre+'/'+e.qn}</td><td class="num">${e.post==null?'—':e.post+'/'+e.qn}</td><td>${chg(e)}</td></tr>`).join('')}</tbody></table></div>
  <div class="pager"><span>عرض ${from+1}–${from+part.length} من ${n}</span>${pages>1?`<nav aria-label="ترقيم الصفحات"><button type="button" data-act="dpg" data-p="${DASH.page-1}" ${DASH.page===1?'disabled':''} aria-label="السابقة">${ico('chevron-r','sm')}</button>${nums.map(p=>`<button type="button" data-act="dpg" data-p="${p}" ${p===DASH.page?'aria-current="page"':''}>${p}</button>`).join('')}<button type="button" data-act="dpg" data-p="${DASH.page+1}" ${DASH.page===pages?'disabled':''} aria-label="التالية">${ico('chevron-l','sm')}</button></nav>`:''}</div>`;
}
function dashPeople(){
  return `<div class="tbar"><div class="search"><svg class="ic" aria-hidden="true"><use href="#i-search"/></svg><input type="search" data-act="dq" value="${esc(DASH.q)}" placeholder="ابحث بالاسم أو الفئة…" aria-label="بحث في المشاركين"></div></div><div id="dtable">${dashTable()}</div>`;
}
function dashContests(){
  const a=getCtLog().slice().reverse();
  if(!a.length)return `<div class="empty"><span class="ei">${ico('trophy')}</span><h4>لا توجد مسابقات بعد</h4><p>تُحفظ نتيجة كل مسابقة تلقائيًا عند انتهائها.</p><button class="btn" data-act="mode" data-v="contest">افتح المسابقة</button></div>`;
  return `<div class="tblw"><table class="tbl"><thead><tr><th>التاريخ</th><th>الأسئلة</th><th>الفرق والنقاط</th><th>الفائز</th></tr></thead><tbody>${a.map(e=>{const m=Math.max(...e.teams.map(t=>t.s)),w=e.teams.filter(t=>t.s===m);return `<tr><td class="num">${esc(e.d)}</td><td class="num">${e.n}</td><td>${e.teams.map(t=>esc(t.n)+' <b class="num">('+t.s+')</b>').join(' · ')}</td><td>${m>0?(w.length>1?'<span class="badge muted">تعادل</span>':'<span class="badge gold">'+esc(w[0].n)+'</span>'):'—'}</td></tr>`}).join('')}</tbody></table></div>`;
}
function dashInfo(){
  const r=S.rep,st=stats();
  return `<div class="cgrid"><div class="cform">
   <div class="field"><label for="rd">التاريخ</label><input id="rd" type="date" data-act="rp" data-k="date" value="${esc(r.date)}"></div>
   <div class="field"><label for="rpl">المكان</label><input id="rpl" data-act="rp" data-k="place" value="${esc(r.place)}" maxlength="80"></div>
   <div class="field"><label for="rin">المؤسسة / الدار</label><input id="rin" data-act="rp" data-k="inst" value="${esc(r.inst)}" maxlength="80" placeholder="${esc(S.org)}"></div>
   <div class="field"><label for="rfa">المنشّط</label><input id="rfa" data-act="rp" data-k="fac" value="${esc(r.fac)}" maxlength="60"></div>
   <div class="field"><label for="rn">عدد المشاركين</label><input id="rn" data-act="rp" data-k="n" value="${esc(r.n)}" maxlength="6" placeholder="${st.n||''}" style="width:110px"><span class="hint">اتركه فارغًا ليُحسب من السجل</span></div>
   <div class="field"><label for="rno">ملاحظات</label><textarea id="rno" data-act="rp" data-k="notes" rows="4" maxlength="800">${esc(r.notes)}</textarea></div></div>
  <div class="cprev" style="text-align:start;align-items:stretch"><b>ملخص السجل</b>
   <span>المشاركون المسجّلون: <b>${st.n}</b></span>
   <span>متوسط المحطات: <b>${f1(st.sc)}${st.sc==null?'':'%'}</b></span>
   <span>متوسط القبلي/البعدي: <b>${f1(st.pre)} ← ${f1(st.post)}</b></span>
   <span>«نعم» في رضا المشاركين: <b>${st.sv.map(v=>v.n?Math.round(v.yes/v.n*100)+'%':'—').join(' · ')}</b></span></div></div>`;
}
function repView(){
  const r=S.rep;if(!r.date)r.date=new Date().toISOString().slice(0,10);
  const tabs=[['over','نظرة عامة','chart'],['people','المشاركون','users'],['cont','المسابقات','trophy'],['info','بيانات الحصة','clipboard']];
  const body={over:dashOver,people:dashPeople,cont:dashContests,info:dashInfo}[DASH.tab]();
  return `<div class="dash-head"><div><h2>لوحة المنشّط</h2><p class="lead">نتائج الحصة كما حُفظت في هذا الجهاز: كل مشارك يضغط «حفظ نتيجتي في سجل الجلسة» في نهاية الرحلة.</p></div>
   <div class="acts"><button class="btn" data-act="repprint">${ico('printer')}طباعة التقرير</button><button class="btn sec" data-act="repcsv">${ico('download')}CSV</button><button class="btn sec" data-act="repjson">${ico('download')}JSON</button><button class="btn sec" data-act="repclear">${ico('refresh')}مسح السجل</button></div></div>
   <p class="warn" id="rpm" aria-live="polite"></p>
   ${dashAlerts()}
   <div class="tabs-ui" role="tablist" aria-label="أقسام اللوحة">${tabs.map(t=>`<button type="button" class="tab-ui" role="tab" data-act="dtab" data-v="${t[0]}" aria-selected="${DASH.tab===t[0]}">${ico(t[2],'sm')}${t[1]}</button>`).join('')}</div>
   <div role="tabpanel">${body}</div>
   ${DASH.tab==='over'?repSummaryHTML().replace(/<h3>ملخص الحصة بالأرقام<\/h3>/,'<h3>ملخص نصي للتقرير</h3>'):''}`;
}

/* ---------- مستمعات الغلاف (نقر، إدخال، لوحة المفاتيح) ---------- */
document.addEventListener('click',e=>{
  if(!e.target.closest('#gsWrap')&&gsRes)gsRes.hidden=true;
  if(!e.target.closest('.nf-wrap'))nfClose();
  const t=e.target.closest('[data-act]');if(!t)return;
  const a=t.dataset.act;
  if(t.tagName==='A'&&t.getAttribute('href')==='#')e.preventDefault();
  if(a==='drawer'){toggleDrawer()}
  else if(a==='gstoggle'){const w=$('#gsWrap'),o=w.classList.toggle('open');t.setAttribute('aria-expanded',o?'true':'false');if(o){const f=$('#gs');if(f)f.focus()}else gsRes.hidden=true}
  else if(a==='nf'){const o=nfPanel.hidden;if(o){nfRender();nfPanel.hidden=false}else nfPanel.hidden=true;t.setAttribute('aria-expanded',o?'true':'false')}
  else if(a==='nfgo'){nfClose();S.mode=t.dataset.m;if(t.dataset.tab)DASH.tab=t.dataset.tab;render(true)}
  else if(a==='crumb'){if(t.dataset.v==='home'){S.mode='home';render(true)}else go(0)}
  else if(a==='gsgo'){gsGo(+t.dataset.i)}
  else if(a==='dtab'){DASH.tab=t.dataset.v;render(false)}
  else if(a==='dpg'){DASH.page=Math.max(1,+t.dataset.p);const c=$('#dtable');if(c)c.innerHTML=dashTable()}
});
document.addEventListener('input',e=>{
  const t=e.target,a=t.dataset&&t.dataset.act;
  if(a==='gsq')gsRender(t.value);
  else if(a==='dq'){DASH.q=t.value;DASH.page=1;const c=$('#dtable');if(c)c.innerHTML=dashTable()}
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.dataset&&t.dataset.act==='prep'){const o=getPrep();o[t.dataset.k]=t.checked;setPrep(o);nfUpd();render(false)}
});
document.addEventListener('keydown',e=>{
  const inGs=e.target&&e.target.id==='gs';
  if(e.key==='Escape'){closeDrawer();nfClose();if(gsRes)gsRes.hidden=true;const w=$('#gsWrap');if(w)w.classList.remove('open')}
  if(inGs&&gsRes&&!gsRes.hidden){
    const b=[...gsRes.querySelectorAll('button')],on=b.findIndex(x=>x.classList.contains('on'));
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(b.length){b.forEach(x=>x.classList.remove('on'));b[(on+(e.key==='ArrowDown'?1:-1)+b.length)%b.length].classList.add('on')}}
    if(e.key==='Enter'){e.preventDefault();const c=b[on>=0?on:0];if(c)gsGo(+c.dataset.i)}
  }else if(e.key==='/'&&!/^(input|textarea|select)$/i.test((e.target.tagName||''))&&!e.ctrlKey&&!e.metaKey){const f=$('#gs');if(f){e.preventDefault();f.focus()}}
});

function render(top){
  syncBar();shellSync();fnavUpd();ctBoardUpd();
  if(S.mode!=='contest')ctStop();
  if(S.mode==='home'){app.innerHTML=homeView();if(top)window.scrollTo({top:0,behavior:'smooth'});return}
  if(S.mode==='contest'){app.innerHTML=ctView();if(top)window.scrollTo({top:0,behavior:'smooth'});return}
  if(S.mode==='kit'){app.innerHTML=kitView();if(top)window.scrollTo({top:0,behavior:'smooth'});return}
  if(S.mode==='report'){app.innerHTML=repView();if(top)window.scrollTo({top:0,behavior:'smooth'});return}
  if(S.mode==='parents'){app.innerHTML=parView();if(top)window.scrollTo({top:0,behavior:'smooth'});return}
  if(S.mode==='fac'){app.innerHTML=facView();if(top)window.scrollTo({top:0,behavior:'smooth'});return}
  if(S.mode==='ref'){app.innerHTML=refView();if(top)window.scrollTo({top:0,behavior:'smooth'});return}
  S.visited[S.i]=true;
  const k=ST[S.i].k;
  curKey=k;
  app.innerHTML=pathBar()+VIEW[k]()+`<div class="nav">
    <button class="btn sec" data-act="prev" ${atStart()?'disabled':''}>السابق</button>
    <span class="score">النقاط: <b id="sc">${sum()}</b> / ${ptot()} · ${ico('award','sm')} <b id="bgc">${nBadges()}</b></span>
    <button class="btn" data-act="next" ${atEnd()?'disabled':''}>${S.i===0?'ابدأ الرحلة':'التالي'}</button></div>`;
  drawTrack();
  if(k==='pass')initPass();
  if(k==='bal')drawBal();
  if(k==='end')initEnd();
  save();
  if(top)window.scrollTo({top:0,behavior:'smooth'});
}
function go(i){S.mode='prog';S.i=Math.max(0,Math.min(ST.length-1,i));render(true)}

function initPass(){
  const pw=$('#pw');
  const crit=[
   ['10 أحرف أو أكثر',v=>v.length>=10],
   ['تحتوي على أرقام',v=>/\d/.test(v)],
   ['تحتوي على رموز مثل ! _ - @',v=>/[^\p{L}\p{N}\s]/u.test(v)],
   ['أحرف كبيرة وصغيرة',v=>/[a-z]/.test(v)&&/[A-Z]/.test(v)],
   ['ليست كلمة شائعة (اسم فريق، 1962، 123456…)',v=>v.length>0&&!COMMON.some(c=>v.toLowerCase().includes(c))]
  ];
  function upd(){
    const v=pw.value;
    const r=crit.map(c=>c[1](v));
    const n=v?r.filter(Boolean).length:0;
    const strong=n>=4&&v.length>=10;
    $('#cr').innerHTML=crit.map((c,i)=>`<li class="${v&&r[i]?'ok':''}">${c[0]}</li>`).join('');
    const mi=$('#mi');
    mi.style.width=(n/5*100)+'%';
    mi.style.background=n<=1?'var(--red)':n<=3?'var(--orange)':'var(--green)';
    $('#mt').setAttribute('aria-valuenow',n);
    $('#ml').textContent=!v?'ابدأ بالكتابة…':strong?'قوية جدًا! هكذا تكون كلمة السر الجيدة.':n>=3?'جيدة، لكن يمكن أن تكون أقوى.':'ضعيفة: يسهل تخمينها.';
    if(v){const before=S.pts.pass;const np=strong?3:n>=3?2:n>=1?1:0;award('pass',np);if(np===3&&before!==3)sfx('ok')}
  }
  pw.addEventListener('input',upd);
  $('#pwShow').addEventListener('click',e=>{
    const t=pw.type==='text';pw.type=t?'password':'text';
    e.target.textContent=t?'إظهار':'إخفاء';e.target.setAttribute('aria-pressed',t);
  });
  upd();
}

const BAL=[['sleep','النوم','#1a4731',0,12],['study','الدراسة/العمل','#6c897b',0,12],['sport','الرياضة والنشاط','#c9993a',0,5],['screen','الشاشات للترفيه','#6d531f',0,10]];
function drawBal(){
  const fid=document.activeElement&&document.activeElement.id;
  const b=S.bal,used=b.sleep+b.study+b.sport+b.screen,rest=24-used;
  const minSleep=K()?9:8,maxScreen=K()?2:4;
  let h=BAL.map(x=>`<div class="sl"><label for="s_${x[0]}">${x[1]}</label><input type="range" id="s_${x[0]}" data-act="sl" data-k="${x[0]}" min="${x[3]}" max="${x[4]}" step="0.5" value="${b[x[0]]}"><b>${b[x[0]]} س</b></div>`).join('');
  h+=`<div class="bar" aria-hidden="true">${BAL.map(x=>`<div style="flex:${Math.max(b[x[0]],0.001)};background:${x[2]}">${b[x[0]]>=1.5?x[1].split('/')[0]:''}</div>`).join('')}<div style="flex:${Math.max(rest,0.001)};background:#677b70">${rest>=2?'الباقي':''}</div></div>`;
  h+=`<div class="legend">${BAL.map(x=>`<span><i style="background:${x[2]}"></i>${x[1]}</span>`).join('')}<span><i style="background:#677b70"></i>الباقي: ${Math.max(rest,0)} س (أكل، أهل، أصدقاء، راحة)</span></div>`;
  const chk=[
   [b.sleep>=minSleep,`النوم كاف (لا يقل عن ${minSleep} ساعات)`,`النوم قليل، الأفضل ${minSleep} ساعات على الأقل`],
   [b.sport>=1,'حركة يومية جيدة','حاول أن تمنح جسمك ساعة نشاط على الأقل'],
   [b.screen<=maxScreen,`الشاشات في حدود معقولة (حتى ${maxScreen} ساعات ترفيه)`,`وقت الشاشات كبير، حاول ألا يتجاوز ${maxScreen} ساعات`],
   [rest>=4&&used<=24,'وقت كاف للأهل والأصدقاء والأكل','لا يبقى وقت كاف للأهل والأصدقاء والراحة (الأقل 4 ساعات)']
  ];
  award('bal',chk.filter(c=>c[0]).length);
  h+=`<ul class="crit">${chk.map(c=>`<li class="${c[0]?'ok':''}">${c[0]?c[1]:c[2]}</li>`).join('')}</ul>`;
  h+=rule('هذه توصيات عامة للنقاش وليست وصفة طبية. الفكرة: الشاشة جزء من يومك وليست كل يومك.','ملاحظة:');
  $('#bl').innerHTML=h;
  updScore();
  if(fid){const e=document.getElementById(fid);if(e)e.focus()}
}

/* certificate & results */
function summaryText(){
  const p=sum(),pct=Math.round(p/ptot()*100),n=PRETEST[S.aud].length;
  const a=Object.keys(S.pre).length>=n?qzScore('pre')+'/'+n:'-',b=Object.keys(S.post).length>=n?qzScore('post')+'/'+n:'-';
  return `الاسم: ${S.nm||'-'}\nالمؤسسة: ${S.org||'-'}\nالفئة: ${K()?'أطفال':'شباب'}\nنتيجة المحطات: ${p}/${ptot()}\nالمستوى: ${lvlOf(pct)}\nالاختبار القبلي: ${a}\nالاختبار البعدي: ${b}`;
}
function certHead(){
  const l=[S.dwn,S.dir,S.org].map(x=>(x||'').trim()).filter(Boolean);
  if(!CLOGO&&!l.length)return '';
  return `<div class="ch">${CLOGO?`<img src="${CLOGO}" alt="">`:''}${l.map((x,i)=>`<div class="l${i?2:1}">${esc(x)}</div>`).join('')}</div>`;
}
function initEnd(){
  const pr=$('#pr'),cp=$('#cp'),dl=$('#dl'),msg=$('#cpm');
  const prev=()=>{$('#cprev').innerHTML=certHead()||'<span class="warn">ستظهر الرأسية هنا: الشعار، ثم الديوان، ثم المديرية، ثم المؤسسة.</span>'};
  [['nm','nm'],['dwn','dwn'],['dir','dir'],['org','org']].forEach(([id,k])=>{const e=$('#'+id);e.addEventListener('input',()=>{S[k]=e.value;save();prev()})});
  function setLogo(v){CLOGO=v;try{if(v)localStorage.setItem('diwan-drugs-logo',v);else localStorage.removeItem('diwan-drugs-logo')}catch(_){}prev()}
  prev();
  $('#lgf').addEventListener('change',e=>{
    const f=e.target.files&&e.target.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=()=>{
      const im=new Image();
      im.onload=()=>{
        try{
          const mx=320,sc=Math.min(1,mx/Math.max(im.width,im.height));
          const c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*sc));c.height=Math.max(1,Math.round(im.height*sc));
          c.getContext('2d').drawImage(im,0,0,c.width,c.height);setLogo(c.toDataURL('image/png'));
        }catch(_){setLogo(r.result)}
      };
      im.onerror=()=>{msg.textContent='تعذّرت قراءة الصورة. جرّب صورة PNG أو JPG.'};
      im.src=r.result;
    };
    r.readAsDataURL(f);
  });
  $('#lgd').addEventListener('click',()=>setLogo(LOGO));
  $('#lgx').addEventListener('click',()=>setLogo(''));
  pr.addEventListener('click',()=>{
    const p=sum(),pct=Math.round(p/ptot()*100);
    const d=new Date().toLocaleDateString('ar-DZ');
    $('#printcert').innerHTML=`<div class="pc-in">${certHead()}<div class="pt">شهادة سفير الوعي</div>
      <p>تُمنح هذه الشهادة إلى</p><div class="nm">${esc((S.nm||'').trim()||'...........................')}</div>
      <p>تقديرًا للمشاركة الفعّالة في الحصة التحسيسية «وعيي درعي» وتحقيق المستوى:</p><div class="lv">${lvlOf(pct)}</div>
      <p>النتيجة: ${p} / ${ptot()}</p>
      <div class="sigs"><div><hr>توقيع المنشّط</div><div class="stamp">ختم المؤسسة</div><div><hr>التاريخ: ${d}</div></div></div>`;
    sfx('win');printWith('pc');
  });
  cp.addEventListener('click',()=>{
    const t=summaryText();
    const ok=()=>{msg.textContent='تم النسخ.'};
    try{navigator.clipboard.writeText(t).then(ok,()=>{msg.textContent='تعذّر النسخ تلقائيًا.'})}catch(_){msg.textContent='تعذّر النسخ تلقائيًا.'}
  });
  dl.addEventListener('click',()=>{
    try{
      const p=sum(),n=PRETEST[S.aud].length;
      const csv='\ufeffالاسم,المؤسسة,الفئة,نتيجة المحطات,من,القبلي,البعدي\n'+[S.nm,S.org,K()?'أطفال':'شباب',p,ptot(),Object.keys(S.pre).length>=n?qzScore('pre'):'',Object.keys(S.post).length>=n?qzScore('post'):''].map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',');
      const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='result.csv';document.body.appendChild(a);a.click();a.remove();
      msg.textContent='إذا لم يبدأ التنزيل فاستعمل «نسخ نتيجتي».';
    }catch(_){msg.textContent='التنزيل غير متاح هنا؛ استعمل «نسخ نتيجتي».'}
  });
}
function printWith(cls){
  document.body.classList.add(cls);
  /* حجم الصفحة يُحقن وقت الطباعة فقط، فيعمل في كل المتصفحات (الشهادة أفقية، والبقية عمودية) */
  const pg=document.createElement('style');
  pg.textContent=cls==='pc'?'@page{size:A4 landscape;margin:8mm}':'@page{size:A4 portrait;margin:'+(cls==='pk'?'10mm':'12mm')+'}';
  document.head.appendChild(pg);
  const off=()=>{document.body.classList.remove(cls);if(pg.parentNode)pg.parentNode.removeChild(pg);window.removeEventListener('afterprint',off)};
  window.addEventListener('afterprint',off);
  window.print();
  setTimeout(off,1500);
}

/* ---------- badges & toast ---------- */
const need=k=>Math.ceil(MAXP[k]*.75);
const earned=k=>(S.pts[k]||0)>=need(k);
const nBadges=()=>Object.keys(MAXP).filter(earned).length;
let tt=null;
function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>{t.hidden=true},2800)}
function shelf(){
  return `<div class="shelf">${ST.filter(s=>MAXP[s.k]).map(s=>{const e=earned(s.k);return `<div class="bdg ${e?'on':''}"><span class="bi" aria-hidden="true">${e?ico(s.ic):ico('lock')}</span><span>${BADGES[s.k]}</span></div>`}).join('')}</div>`;
}

/* ---------- session log ---------- */
const LOGK='diwan-drugs-log';
function getLog(){try{return JSON.parse(localStorage.getItem(LOGK)||'[]')}catch(_){return []}}
function setLog(a){try{localStorage.setItem(LOGK,JSON.stringify(a))}catch(_){}}
function logEntry(){
  const n=PRETEST[S.aud].length;
  if(!S.logId)S.logId=Date.now();
  return {id:S.logId,nm:S.nm||'',aud:S.aud,score:sum(),total:ptot(),pre:Object.keys(S.pre).length>=n?qzScore('pre'):null,post:Object.keys(S.post).length>=n?qzScore('post'):null,qn:n,ps:Object.assign({},S.pts),sv:[0,1,2].map(i=>S.sv&&S.sv[i]!==undefined?S.sv[i]:null)};
}
function addLog(){const a=getLog(),e=logEntry(),i=a.findIndex(x=>x.id===e.id);if(i>=0)a[i]=e;else a.push(e);setLog(a);save();return a.length}
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
const f1=x=>x==null?'—':String(Math.round(x*10)/10).replace('.',',');
function stats(){
  const a=getLog(),both=a.filter(e=>e.pre!=null&&e.post!=null);
  return {n:a.length,sc:avg(a.map(e=>e.score/e.total*100)),pre:avg(both.map(e=>e.pre)),post:avg(both.map(e=>e.post)),nb:both.length,qn:a[0]?a[0].qn:5,
    sv:[0,1,2].map(i=>{const v=a.map(e=>e.sv&&e.sv[i]).filter(x=>x!=null&&x!==undefined);return {n:v.length,yes:v.filter(x=>x===2).length,mid:v.filter(x=>x===1).length,no:v.filter(x=>x===0).length}})};
}
function endExtras(){
  const s=S.sv||{};
  return `<h3>شاراتي (${nBadges()} / ${Object.keys(MAXP).length})</h3>${shelf()}
  <h3>رأيك في الحصة</h3>
  <div class="survey">${SURVEY.map((q,i)=>`<fieldset class="qz"><legend>${q}</legend><div class="svrow">${[2,1,0].map(o=>`<label class="qo"><input type="radio" name="sv${i}" data-act="sv" data-q="${i}" data-o="${o}" ${s[i]===o?'checked':''}> <span>${SURVEY_O[2-o]}</span></label>`).join('')}</div></fieldset>`).join('')}</div>
  <p class="crow"><button class="btn" data-act="logadd">حفظ نتيجتي في سجل الجلسة</button> <span class="warn" id="lgm" aria-live="polite"></span></p>`;
}

/* ---------- help dialog ---------- */
const hp=$('#helpdlg');let hpFocus=null;
function openHelp(){hpFocus=document.activeElement;hp.hidden=false;document.body.classList.add('nosc');const b=$('#hpX');if(b&&b.focus)b.focus({preventScroll:true})}
function closeHelp(){hp.hidden=true;document.body.classList.remove('nosc');if(hpFocus&&hpFocus.focus)hpFocus.focus()}

/* ---------- contest ---------- */
const CTK=['what','myth','why','pills','halluc','signs','law','life','emerg'];
let CT={phase:'setup',teams:[{n:'الفريق الأول',s:0},{n:'الفريق الثاني',s:0}],rounds:10,secs:20,keys:CTK.slice(),pool:[],i:0,shown:false,given:false,left:20,run:false,beep:true,board:false,tb:false,tied:null,rest:[],sid:0};
let ctTid=null;
const ctElig=()=>CT.tb&&CT.tied?CT.tied:CT.teams.map((_,i)=>i);
function ctTop(){const m=Math.max(...CT.teams.map(t=>t.s));return {max:m,idx:CT.teams.map((t,i)=>t.s===m?i:-1).filter(i=>i>=0)}}
function ctBeep(k){
  if(!CT.beep)return;
  if(k==='tick')tone(880,.09,0,'square',.05);
  else{tone(660,.18,0,'square',.06);tone(520,.18,.2,'square',.06);tone(392,.45,.4,'square',.07)}
}
function ctBoardUpd(){
  const b=$('#ctboard');if(!b)return;
  const on=S.mode==='contest'&&CT.board&&CT.phase==='play';
  b.hidden=!on;if(!on)return;
  const r=CT.teams.map((t,i)=>({n:t.n,s:t.s})).sort((a,c)=>c.s-a.s),mx=Math.max(1,r[0].s);
  b.innerHTML=`<h2>الترتيب المباشر</h2><div class="cbs">${CT.tb?'سؤال فاصل':'السؤال '+(CT.i+1)+' من '+CT.pool.length}</div>
  <div class="cbrows">${r.map((x,i)=>`<div class="cbr"><span class="cbm" aria-hidden="true"><span class="medal ${x.s>0&&i<3?'m'+(i+1):''}">${i+1}</span></span><span class="cbn">${esc(x.n)}</span><span class="cbv">${x.s}</span><span class="cbb"><i style="width:${Math.round(x.s/mx*100)}%"></i></span></div>`).join('')}</div>
  <button class="cbx" data-act="ctboard">${ico('x')}إغلاق</button>`;
}
const CTLK='diwan-drugs-ct';
function getCtLog(){try{return JSON.parse(localStorage.getItem(CTLK)||'[]')}catch(_){return []}}
function setCtLog(a){try{localStorage.setItem(CTLK,JSON.stringify(a))}catch(_){}}
function ctSave(){
  if(CT.i<1)return;
  if(!CT.sid)CT.sid=Date.now();
  const a=getCtLog(),e={id:CT.sid,d:new Date().toISOString().slice(0,10),n:CT.i,teams:CT.teams.map(t=>({n:t.n,s:t.s})),aud:S.aud},k=a.findIndex(x=>x.id===e.id);
  if(k>=0)a[k]=e;else a.push(e);
  setCtLog(a.slice(-50));
}
function ctRepHTML(){
  const a=getCtLog().slice(-5);if(!a.length)return '';
  const rows=a.map(e=>{const m=Math.max(...e.teams.map(t=>t.s)),w=e.teams.filter(t=>t.s===m);return `<tr><td>${esc(e.d)}</td><td>${e.n}</td><td>${e.teams.map(t=>esc(t.n)+' ('+t.s+')').join(' · ')}</td><td>${m>0?(w.length>1?'تعادل':esc(w[0].n)):'—'}</td></tr>`}).join('');
  return `<h3>المسابقة بين الفرق</h3><table class="tbl"><thead><tr><th>التاريخ</th><th>الأسئلة</th><th>النقاط</th><th>الفائز</th></tr></thead><tbody>${rows}</tbody></table>`;
}
function ctStop(){if(ctTid){clearInterval(ctTid);ctTid=null}CT.run=false}
const stName=k=>{const s=ST.find(x=>x.k===k);return s?s.n:k};
function ctView(){
  if(CT.phase==='play')return ctPlay();
  if(CT.phase==='end')return ctEnd();
  return `<h2>وضع المسابقة</h2><p class="lead">مسابقة بين فريقين إلى أربعة فرق على جهاز واحد. يقرأ المنشّط السؤال، وتتناقش الفرق، ثم تُكشف الإجابة ويختار المنشّط الفرق التي أصابت فتنال كل منها نقطة. لا يحتاج إلى اتصال بالخادم.</p>
  <details class="ctguide" open><summary>كيف تُلعب المسابقة؟</summary><ol>
   <li>اكتب أسماء الفرق (من 2 إلى 4)، واختر عدد الأسئلة والزمن والمحاور، ثم اضغط «ابدأ المسابقة».</li>
   <li>يقرأ المنشّط السؤال بصوت عالٍ ويضغط «ابدأ المؤقت». يتناقش كل فريق ويتفق على إجابة واحدة.</li>
   <li>عند انتهاء الوقت يعلن كل فريق إجابته (يُستحسن في الوقت نفسه برفع بطاقة أو بإشارة من ممثله) حتى لا يقلّد أحدٌ أحدًا.</li>
   <li>يضغط المنشّط «أظهر الإجابة»، فتظهر الإجابة الصحيحة مع تفسيرها.</li>
   <li>البرنامج لا يصحّح الإجابات بنفسه: يضغط المنشّط على اسم كل فريق أصاب. يمكن اختيار فريق أو أكثر، أو «الجميع»، أو «لا أحد»، وتُضاف نقطة لكل فريق مختار تلقائيًا. ولتصحيح اختيار خاطئ يُضغط عليه مرة ثانية.</li>
   <li>يضغط «السؤال التالي»، وفي النهاية تظهر النتيجة وترتيب الفرق.</li></ol>
   <p class="warn">زرّا «+» و«−» بجانب نقاط كل فريق للتعديل اليدوي عند الحاجة، كنقطة إضافية للفريق الأسرع. زر «عرض الترتيب» يعرض النقاط بحجم كبير للحاضرين، وعند التعادل في النهاية يظهر زر «سؤال فاصل» بين الفرق المتعادلة. تُحفظ نتيجة كل مسابقة تلقائيًا في «تقرير الحصة».</p></details>
  <div class="ctbox"><h3>الفرق</h3>
  ${CT.teams.map((t,i)=>`<div class="ctrow"><input data-act="ctn" data-i="${i}" value="${esc(t.n)}" maxlength="24" aria-label="اسم الفريق ${i+1}">${CT.teams.length>2?`<button class="pill" data-act="ctdel" data-i="${i}">حذف</button>`:''}</div>`).join('')}
  ${CT.teams.length<4?`<button class="pill" data-act="ctadd">+ إضافة فريق</button>`:''}
  <h3>الإعدادات</h3>
  <p class="crow"><label>عدد الأسئلة: <select data-act="ctr">${[5,10,15,20].map(n=>`<option value="${n}" ${CT.rounds===n?'selected':''}>${n}</option>`).join('')}</select></label>
  <label>الزمن لكل سؤال: <select data-act="cts">${[15,20,30,45].map(n=>`<option value="${n}" ${CT.secs===n?'selected':''}>${n} ثانية</option>`).join('')}</select></label></p>
  <p class="crow"><label class="qo"><input type="checkbox" data-act="ctbeep" ${CT.beep?'checked':''}> <span>تنبيه صوتي في آخر 5 ثوانٍ وعند انتهاء الوقت</span></label></p>
  <h3>المحاور</h3>
  <div class="ctks">${CTK.map(k=>`<label class="qo"><input type="checkbox" data-act="ctk" data-k="${k}" ${CT.keys.includes(k)?'checked':''}> <span>${stName(k)}</span></label>`).join('')}</div>
  <p class="warn">الأسئلة تُؤخذ بحسب الفئة المختارة حاليًا (${K()?'الأطفال':'الشباب'}).</p>
  <p><button class="btn" data-act="ctstart" ${CT.keys.length?'':'disabled'}>ابدأ المسابقة</button></p></div>`;
}
function ctScore(){
  return `<div class="ctsb">${CT.teams.map((t,i)=>`<div class="cts"><span class="ctn">${esc(t.n)}</span><b>${t.s}</b><span class="ctb"><button class="pill" data-act="ctpt" data-i="${i}" data-d="1" aria-label="زيادة نقطة">+</button><button class="pill" data-act="ctpt" data-i="${i}" data-d="-1" aria-label="إنقاص نقطة">−</button></span></div>`).join('')}</div>`;
}
function ctPlay(){
  const q=CT.pool[CT.i],it=q.it,txt=(S.dz&&it.d)?it.d:it.t,n=CT.pool.length;
  let h=`<h2>المسابقة</h2>${ctScore()}${CT.tb&&CT.tied?`<p class="tbn">${ico('zap','sm')} سؤال فاصل بين: ${CT.tied.map(i=>esc(CT.teams[i].n)).join(' و ')}</p>`:`<p class="ctx">السؤال ${CT.i+1} من ${n} — ${stName(q.k)}</p>`}<div class="item ctq">${txt}</div>
  <div class="cttrow"><div class="cttimer ${CT.left<=0?'end':''}" id="ctt" aria-live="off">${CT.left}</div><button class="btn sec" data-act="cttimer">${CT.run?'إيقاف المؤقت':'ابدأ المؤقت'}</button></div>
  <div class="row">${q.btns.map((b,i)=>`<span class="opt ${CT.shown?(i===it.c?'right':'dim'):''}">${b.t}</span>`).join('')}</div>`;
  if(!CT.shown)h+=`<p><button class="btn" data-act="ctshow">أظهر الإجابة</button></p>`;
  else{
    h+=`<div class="fb s2"><span class="fav">${guide('happy',46)}</span><div><b>الإجابة الصحيحة: ${q.btns[it.c].t}</b><p>${it.f}</p></div></div>`;
    const got=CT.got||[],el=ctElig(),allOn=el.length>1&&el.every(i=>got.includes(i));
    h+=`<p class="ctx">من أجاب صحيحًا؟ <span class="warn">(يمكن اختيار أكثر من فريق)</span></p><div class="row">${el.map(i=>{const t=CT.teams[i],on=got.includes(i);return `<button class="btn ${on?'':'sec'}" data-act="ctaward" data-i="${i}" aria-pressed="${on}">${on?ico('check','sm'):''}${esc(t.n)}</button>`}).join('')}${el.length>1?`<button class="btn ${allOn?'':'sec'}" data-act="ctall" aria-pressed="${allOn}">${allOn?ico('check','sm'):''}الجميع</button>`:''}<button class="btn ${CT.none?'':'sec'}" data-act="ctnone" aria-pressed="${!!CT.none}">لا أحد</button></div>`;
    h+=`<p><button class="btn" data-act="ctnext" ${CT.given?'':'disabled'}>${CT.i+1<n?'السؤال التالي':'النتيجة النهائية'}</button></p>`;
  }
  return h+`<p><button class="pill" data-act="ctboard">${ico('chart','sm')}عرض الترتيب</button> <button class="pill" data-act="ctquit">إنهاء المسابقة</button></p>`;
}
function ctEnd(){
  const r=CT.teams.map(t=>({n:t.n,s:t.s})).sort((a,b)=>b.s-a.s),top=r.filter(x=>x.s===r[0].s),tie=top.length>1&&r[0].s>0,win=!tie&&r[0].s>0;
  const conf=win?`<div class="confetti" aria-hidden="true">${Array.from({length:36},(_,i)=>`<i style="left:${(i*29+7)%100}%;animation-delay:${(i%12)*0.18}s;background:${['#c9993a','#1a4731','#e4cc9c','#486c5a','#c3cfc9'][i%5]};width:${6+(i%4)*3}px;height:${10+(i%3)*5}px"></i>`).join('')}</div>`:'';
  return `${conf}<h2>نتيجة المسابقة</h2><div class="gcenter">${win?'<div class="trophy" aria-hidden="true">'+ico('trophy')+'</div>':guide('happy',96)}</div>
  <p class="lead" style="text-align:center;font-size:1.3rem">${tie?'تعادل بين: '+top.map(x=>esc(x.n)).join(' و '):r[0].s===0?'لم يسجّل أحد نقطة!':'الفائز: <b class="winner">'+esc(top[0].n)+'</b>'}</p>
  <div class="ctrank">${r.map((x,i)=>`<div class="cts"><span class="ctn"><span class="medal ${x.s>0&&i<3?'m'+(i+1):''}">${i+1}</span>${esc(x.n)}</span><b>${x.s}</b></div>`).join('')}</div>
  ${tie?`<p style="text-align:center"><button class="btn" data-act="cttb">${ico('zap','sm')}سؤال فاصل بين المتعادلين</button></p>`:''}
  <p><button class="btn" data-act="ctagain">مسابقة جديدة</button> <button class="btn sec" data-act="ctsetup">تعديل الإعدادات</button></p>`;
}
function ctBegin(){
  let pool=[];
  CT.keys.forEach(k=>{const items=SEQ[k].items(),btns=SEQ[k].btns;items.forEach(it=>pool.push({k,it,btns}))});
  pool=shuffled(pool.length).map(i=>pool[i]);const nq=Math.min(CT.rounds,pool.length);CT.rest=pool.slice(nq);pool=pool.slice(0,nq);
  CT.tb=false;CT.tied=null;CT.board=false;CT.sid=0;CT.pool=pool;CT.i=0;CT.shown=false;CT.given=false;CT.got=[];CT.none=false;CT.left=CT.secs;CT.teams.forEach(t=>t.s=0);CT.phase='play';ctStop();
}

/* ---------- printables ---------- */
function imgSrc(sel){const e=document.querySelector(sel);return (e&&e.src)||''}
function printKit(html){$('#printkit').innerHTML=html;printWith('pk')}
const FBURL='https://www.facebook.com/groups/www.diwan.js1236';
function autoUrl(){try{if(/^https?:$/.test(location.protocol))return location.origin+location.pathname.replace(/index\.html$/,'')}catch(_){}return ''}
const progUrl=()=>(S.kitUrl||'').trim()||autoUrl();
function pactHTML(){
  const L='<span class="pl"></span>';
  return `${certHead()}<div class="kpage pact"><h1 class="kt">ميثاق الأسرة للوقاية</h1>
  <p class="pn">اتفاق بسيط بيننا نراجعه معًا بعد شهر. نكتب بأنفسنا ونوقّع جميعًا.</p>
  <div class="pnames"><span>اسم الابن/الابنة: ${L}</span><span>وليّ الأمر: ${L}</span><span>التاريخ: ${L}</span></div>
  <h2>أنا أتعهّد بأن:</h2>
  <ul class="pck">
   <li>لا آخذ قرصًا ولا لفافة ولا مشروبًا ولا أي مادة من أي شخص، ولا أتناول دواءً إلا بإشراف أهلي أو طبيبي.</li>
   <li>أقول «لا» بوضوح وأغادر، حتى لو سخروا مني أو ألحّوا.</li>
   <li><b>أُخبر وليّي فورًا إن عُرض عليّ شيء أو ضغط عليّ أحد. ولن أُعاقَب لأنني أخبرت.</b></li>
   <li>أُعلم وليّي أين أكون ومع من، وأعود في الموعد المتفق عليه: ${L}</li>
   <li>أتحدث مع من أثق به حين أحزن أو أتوتر، ولا أهرب من مشاكلي.</li>
   <li>أشغل وقتي بنشاط أحبه: ${L}</li>
  </ul>
  <h2>ووليّ الأمر يتعهّد بأن:</h2>
  <ul class="pck">
   <li>يستمع إليّ أولًا قبل أن يحاسبني أو يغضب.</li>
   <li>لا يعاقبني ولا يسخر مني إن أخبرته بمشكلة أو طلبتُ مساعدته.</li>
   <li>يعرف أصدقائي وأماكن وجودي، ويحفظ الأدوية بعيدًا عن متناول الأطفال ويعيد المتبقي للصيدلية.</li>
   <li>يخصّص وقتًا للحديث واللعب معي مرة كل أسبوع: ${L}</li>
   <li>يلجأ إلى الطبيب أو المرشد، لا إلى العقاب، إن لاحظ علامات مقلقة.</li>
  </ul>
  <div class="pnum"><b>أرقام عند الحاجة:</b> الرقم الأخضر <b>1111</b> · الشرطة <b>1548</b> · الدرك الوطني <b>1055</b> · الحماية المدنية <b>14</b></div>
  <div class="sigs2"><div><hr>توقيع الابن/الابنة</div><div><hr>توقيع وليّ الأمر</div></div>
  <p class="pn">موعد المراجعة القادمة: ${L}</p></div>`;
}
function voteHTML(){
  const c=(cl,t,s)=>`<div class="vc ${cl}"><div class="vt">${t}</div><div class="vs">${s}</div></div>`;
  return `<div class="kpage"><h1 class="kt">بطاقات التصويت: حقيقة أم خرافة؟</h1><div class="vcol">${c('g','حقيقة','معلومة صحيحة')}${c('r','خرافة','فكرة غير صحيحة')}${c('o','لست متأكدًا','أسأل مختصًا')}</div></div>
  <div class="kpage"><h1 class="kt">بطاقات التصويت: الحكم على التصرفات</h1><div class="vgrid">${c('g','تصرف سليم','')}${c('r','تصرف خاطئ','')}${c('o','علامة تستدعي الانتباه','')}${c('g','سلوك عادي','')}${c('g','أرفض وأغادر','')}${c('o','أخبر بالغًا','')}</div></div>`;
}
function rpHTML(){
  const list=RP[S.aud];
  return `<div class="kpage rpp"><h1 class="kt">بطاقات لعب الأدوار — ${K()?'الأطفال':'الشباب'}</h1><p class="kn">قصّ البطاقات، ووزّعوا الأدوار بين أفراد المجموعة، وتدرّبوا على الموقف ثم ناقشوا الأسئلة.</p><div class="rpg">${list.map((c,i)=>`<div class="rpc"><div class="rpn">${i+1}</div><h2>${c.t}</h2><p>${c.s}</p><p><b>الأدوار:</b> ${c.r.join(' · ')}</p><ul>${c.q.map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('')}</div></div>`;
}
function posterHTML(){
  const u=progUrl();
  return `<div class="kpage poster"><img class="pbn" src="${LOGO_HI}" alt="">
   <h1 class="pth">وعيي درعي</h1><p class="psub">برنامج تحسيسي تفاعلي للوقاية من المخدرات والمهلوسات</p>
   <div class="pqs">${u?`<div class="pq">${QR.svg(u,{label:'رمز البرنامج'})}<b>افتح البرنامج</b></div>`:''}<div class="pq">${QR.svg(FBURL,{label:'رمز مجموعة فيسبوك'})}<b>انضم إلى مجموعة الديوان على فيسبوك</b></div></div>
   ${S.kitNote?`<p class="pnote">${esc(S.kitNote)}</p>`:''}
   <div class="pnum"><b>لست وحدك:</b> الرقم الأخضر 1111 · الشرطة 1548 · الدرك الوطني 1055 · الحماية المدنية 14</div>
   <div class="psig"><span>إعداد وتصميم</span><img src="${imgSrc('.sigsm')}" alt=""></div></div>`;
}
function kitView(){
  let qrp='',err='';
  try{qrp=QR.svg(progUrl()||FBURL,{border:2})}catch(_){err='الرابط طويل جدًا لرمز QR.'}
  return `<h2>حقيبة المطبوعات</h2><p class="lead">مطبوعات جاهزة للحصة، تُطبع من المتصفح على ورق A4.</p>
  <div class="kitg">
   <div class="kit"><h3>${ico('check-circle')}بطاقات التصويت</h3><p>إشارة المرور (أخضر، برتقالي، أحمر) وبطاقات «موثوق/مشكوك» و«سليم/خاطئ» و«سليمة/احتيال» للتصويت دون أجهزة.</p><button class="btn" data-act="kitprint" data-v="vote">طباعة</button></div>
   <div class="kit"><h3>${ico('users')}بطاقات لعب الأدوار</h3><p>ثماني بطاقات مواقف بأدوار وأسئلة، بحسب الفئة المختارة (${K()?'الأطفال':'الشباب'}).</p><button class="btn" data-act="kitprint" data-v="rp">طباعة</button></div>
   <div class="kit"><h3>${ico('heart')}ميثاق الأسرة للوقاية</h3><p>ورقة اتفاق بين الطفل ووليّه (الرفض، والإخبار دون عقاب، والتواصل)، تُطبع وتُوقَّع وتُؤخذ إلى البيت.</p><button class="btn" data-act="kitprint" data-v="pact">طباعة</button></div>
   <div class="kit wide"><h3>${ico('file')}ملصق QR</h3><p>ملصق يعلَّق في الدار، يحمل رمزين: رابط البرنامج ومجموعة الديوان على فيسبوك.</p>
    <p class="crow"><label>رابط البرنامج: <input id="kurl" dir="ltr" value="${esc(S.kitUrl)}" placeholder="${esc(autoUrl()||'https://…')}" style="width:min(100%,420px)"></label></p>
    <p class="crow"><label>سطر اختياري (المكان/الموعد): <input id="knote" value="${esc(S.kitNote)}" maxlength="80" style="width:min(100%,420px)"></label></p>
    <div class="qprev" id="qprev">${qrp}</div>${err?`<p class="warn">${err}</p>`:''}
    <p class="warn">يجب أن يكون الرابط قابلًا للفتح من هواتف الحاضرين (رابط منشور ومشارَك).${!(S.kitUrl||'').trim()&&autoUrl()?' يُستعمل الآن تلقائيًا رابط هذه الصفحة.':''}</p>
    <button class="btn" data-act="kitprint" data-v="poster">طباعة الملصق</button></div>
   <div class="kit"><h3>${ico('award')}الشهادات</h3><p>تُطبع من صفحة الميثاق في نهاية البرنامج، وتُخصَّص رأسيتها هناك.</p><button class="btn sec" data-act="kitgoend">اذهب إلى الميثاق</button></div>
  </div>`;
}

/* ---------- report ---------- */
function repSum(){
  const a=getLog(),both=a.filter(e=>e.pre!=null&&e.post!=null);
  const up=both.filter(e=>e.post>e.pre).length,same=both.filter(e=>e.post===e.pre).length,down=both.filter(e=>e.post<e.pre).length;
  const wk=Object.keys(MAXP).map(k=>{const v=a.filter(e=>e.ps&&e.ps[k]!==undefined).map(e=>e.ps[k]/MAXP[k]);return {k,n:v.length,r:v.length?avg(v):null}}).filter(x=>x.n>=2&&x.r!=null).sort((x,y)=>x.r-y.r).slice(0,3);
  return {a,both,up,same,down,wk};
}
function repSummaryHTML(){
  const st=stats(),m=repSum();if(!m.a.length)return '';
  const bar=(lab,v,cls)=>v==null?'':`<div class="sbar"><span>${lab}</span><div class="sb"><i class="${cls}" style="width:${Math.round(v/st.qn*100)}%"></i></div><b>${f1(v)} / ${st.qn}</b></div>`;
  const nb=m.both.length;
  return `<h3>ملخص الحصة بالأرقام</h3><div class="rsum">
   ${bar('الاختبار القبلي',st.pre,'pre')}${bar('الاختبار البعدي',st.post,'post')}
   ${nb?`<p>تحسّن <b>${m.up}</b> من <b>${nb}</b> مشاركًا (${Math.round(m.up/nb*100)}%)، وثبتت نتيجة <b>${m.same}</b>، وتراجعت نتيجة <b>${m.down}</b>.</p>`:'<p class="warn">يظهر التحسن حين يُكمل مشارك واحد على الأقل القبلي والبعدي.</p>'}
   ${m.wk.length?`<p><b>أكثر المحطات تعثرًا:</b> ${m.wk.map(x=>`${esc(ST.find(s=>s.k===x.k).n)} (${Math.round(x.r*100)}%)`).join(' · ')} — تستحق مراجعة في الحصة القادمة.</p>`:''}</div>`;
}
function repHTML(){
  const r=S.rep,st=stats();
  const svrow=SURVEY.map((q,i)=>{const v=st.sv[i];return `<tr><td>${q}</td><td>${v.yes}</td><td>${v.mid}</td><td>${v.no}</td></tr>`}).join('');
  return `${certHead()}<div class="kpage rep"><h1 class="kt">تقرير حصة تحسيسية: «وعيي درعي»</h1>
  <table class="tbl"><tbody>
   <tr><th>التاريخ</th><td>${esc(r.date||'')}</td><th>المكان</th><td>${esc(r.place||'')}</td></tr>
   <tr><th>المؤسسة/الدار</th><td>${esc(r.inst||S.org||'')}</td><th>المنشّط</th><td>${esc(r.fac||'')}</td></tr>
   <tr><th>الفئة</th><td>${K()?'أطفال':'شباب'}</td><th>عدد المشاركين</th><td>${esc(r.n||st.n||'')}</td></tr></tbody></table>
  <h3>نتائج المشاركين المسجّلين (${st.n})</h3>
  <table class="tbl"><tbody>
   <tr><th>متوسط نتيجة المحطات</th><td>${f1(st.sc)}${st.sc==null?'':'%'}</td></tr>
   <tr><th>متوسط الاختبار القبلي (من ${st.qn})</th><td>${f1(st.pre)}</td></tr>
   <tr><th>متوسط الاختبار البعدي (من ${st.qn})</th><td>${f1(st.post)}</td></tr>
   <tr><th>متوسط التحسن</th><td>${st.pre==null||st.post==null?'—':f1(st.post-st.pre)}</td></tr></tbody></table>
  <h3>رضا المشاركين</h3>
  <table class="tbl"><thead><tr><th>السؤال</th><th>نعم</th><th>إلى حد ما</th><th>لا</th></tr></thead><tbody>${svrow}</tbody></table>
  ${repSummaryHTML()}
  ${ctRepHTML()}
  <h3>ملاحظات المنشّط</h3><p class="rnotes">${esc(r.notes||'').replace(/\n/g,'<br>')||'&nbsp;'}</p>
  <div class="sigs2"><div><hr>توقيع المنشّط</div><div><hr>ختم المؤسسة</div></div></div>`;
}
function logCsv(){
  const rows=getLog().map(e=>[e.nm,e.aud==='kids'?'أطفال':'شباب',e.score,e.total,e.pre==null?'':e.pre,e.post==null?'':e.post,e.sv&&e.sv[0]!=null?e.sv[0]:'',e.sv&&e.sv[1]!=null?e.sv[1]:'',e.sv&&e.sv[2]!=null?e.sv[2]:'']);
  return '\ufeffالاسم,الفئة,نتيجة المحطات,من,القبلي,البعدي,رضا1,رضا2,رضا3\n'+rows.map(r=>r.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\n');
}
function download(name,text,type){
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:type||'text/csv;charset=utf-8'}));a.download=name;document.body.appendChild(a);a.click();a.remove();
}
function facExtra(){
  return `<h3>المسابقة والمطبوعات والتقرير</h3><ul>
   <li><b>المسابقة:</b> من تبويب «المسابقة». اكتب أسماء الفرق (2 إلى 4)، واختر عدد الأسئلة والزمن والمحاور، ثم اقرأ السؤال، وشغّل المؤقت، واكشف الإجابة، ثم اضغط على اسم كل فريق أصاب (يمكن اختيار أكثر من فريق أو «الجميع» أو «لا أحد») فتُضاف النقاط تلقائيًا.</li>
   <li><b>حقيبة المطبوعات:</b> بطاقات تصويت، وبطاقات لعب أدوار، وملصق QR. اطبعها قبل الحصة.</li>
   <li><b>سجل الجلسة والتقرير:</b> اطلب من كل مشارك الضغط على «حفظ نتيجتي في سجل الجلسة» في نهاية البرنامج. يجمع تبويب «تقرير الحصة» المتوسطات ورضا المشاركين في تقرير جاهز للطباعة. السجل محفوظ في متصفح هذا الجهاز فقط، فاستعمل جهازًا واحدًا لكل حصة.</li>
   <li><b>زر «أحتاج مساعدة»:</b> يظهر في كل الصفحات ويعرض خطوات الحماية وأرقام الاستغاثة.</li></ul>`;
}

/* ---------- hooks for new actions ---------- */
function addClick(a,t,e){
  const key=t.dataset.key;
  switch(a){
   case 'hpopen':openHelp();return true;
   case 'pathset':{const pp=PATHS[t.dataset.v];if(!pp)return true;S.path=pp.k.slice();S.pathN=pp.n;S.mode='prog';S.i=0;save();render(true);return true}
   case 'pathclear':S.path=null;S.pathN='';save();render(true);return true;
   case 'repjson':{try{const st=stats();download('session-'+(S.rep.date||'data')+'.json',JSON.stringify({version:1,exported:new Date().toISOString(),report:S.rep,summary:{participants:st.n,avgStations:st.sc,avgPre:st.pre,avgPost:st.post},participants:getLog(),contests:getCtLog()},null,1),'application/json')}catch(_){}return true}
   case 'fs':{S.fs=Math.max(-1,Math.min(4,(S.fs||0)+(+t.dataset.d)));try{localStorage.setItem(FSK,String(S.fs))}catch(_){}save();syncBar();return true}
   case 'ctboard':CT.board=!CT.board;render();return true;
   case 'cttb':{
      const r=ctTop();if(r.idx.length<2)return true;
      const q=CT.rest.length?CT.rest.pop():CT.pool[Math.floor(Math.random()*CT.pool.length)];
      CT.pool.push(q);CT.i=CT.pool.length-1;CT.tb=true;CT.tied=r.idx;CT.shown=false;CT.given=false;CT.got=[];CT.none=false;CT.left=CT.secs;CT.phase='play';ctStop();render(true);return true}
   case 'hpclose':closeHelp();return true;
   case 'ctadd':if(CT.teams.length<4){CT.teams.push({n:'الفريق '+['الأول','الثاني','الثالث','الرابع'][CT.teams.length],s:0});render()}return true;
   case 'ctdel':if(CT.teams.length>2){CT.teams.splice(+t.dataset.i,1);render()}return true;
   case 'ctstart':if(CT.keys.length){ctBegin();render(true)}return true;
   case 'cttimer':
     if(CT.run){ctStop()}
     else if(CT.left>0){
       CT.run=true;
       ctTid=setInterval(()=>{CT.left--;const x=$('#ctt');if(x){x.textContent=CT.left;if(x.classList)x.classList.toggle('low',CT.left>0&&CT.left<=5)}if(CT.left>0&&CT.left<=5)ctBeep('tick');if(CT.left<=0){ctStop();if(CT.beep)ctBeep('time');else sfx('bad');if(x&&x.classList)x.classList.add('end');render()}},1000);
     }
     render();return true;
   case 'ctshow':ctStop();CT.shown=true;render();return true;
    case 'ctaward':{
      CT.got=CT.got||[];const i=+t.dataset.i,tm=CT.teams[i],k=CT.got.indexOf(i);
      if(k<0){CT.got.push(i);tm.s++;sfx('ok')}else{CT.got.splice(k,1);tm.s=Math.max(0,tm.s-1)}
      CT.none=false;CT.given=CT.got.length>0;render();return true}
    case 'ctall':{
      CT.got=CT.got||[];const el=ctElig();
      if(el.every(i=>CT.got.includes(i))){el.forEach(i=>{CT.teams[i].s=Math.max(0,CT.teams[i].s-1)});CT.got=CT.got.filter(i=>!el.includes(i));CT.given=CT.got.length>0}
      else{el.forEach(i=>{if(!CT.got.includes(i)){CT.got.push(i);CT.teams[i].s++}});CT.given=true;sfx('ok')}
      CT.none=false;render();return true}
    case 'ctnone':{
      if(CT.none){CT.none=false;CT.given=false}
      else{(CT.got||[]).forEach(i=>{CT.teams[i].s=Math.max(0,CT.teams[i].s-1)});CT.got=[];CT.none=true;CT.given=true}
      render();return true}
   case 'ctpt':{const tm=CT.teams[+t.dataset.i];tm.s=Math.max(0,tm.s+(+t.dataset.d));render();return true}
   case 'ctnext':
     ctStop();CT.i++;
     if(CT.i>=CT.pool.length){CT.phase='end';CT.tb=false;CT.tied=null;CT.board=false;sfx('win');ctSave()}else{CT.shown=false;CT.given=false;CT.got=[];CT.none=false;CT.left=CT.secs}
     render(true);return true;
   case 'ctquit':ctStop();CT.phase='end';CT.tb=false;CT.tied=null;CT.board=false;ctSave();render(true);return true;
   case 'ctagain':ctBegin();render(true);return true;
   case 'ctsetup':ctStop();CT.phase='setup';render(true);return true;
   case 'kitprint':{const v=t.dataset.v;printKit(v==='vote'?voteHTML():v==='rp'?rpHTML():v==='pact'?pactHTML():posterHTML());return true}
   case 'kitgoend':go(ST.length-1);return true;
   case 'repprint':printKit(repHTML());return true;
   case 'repcsv':try{download('session-log.csv',logCsv());const m=$('#rpm');if(m)m.textContent='إذا لم يبدأ التنزيل فانسخ البيانات من الجدول.'}catch(_){}return true;
   case 'repclear':{
     let ok=true;try{if(typeof window.confirm==='function')ok=window.confirm('مسح سجل الجلسة نهائيًا؟')}catch(_){}
     if(ok){setLog([]);setCtLog([]);render()}return true}
   case 'logadd':{const n=addLog();const m=$('#lgm');if(m)m.textContent='تم الحفظ في سجل الجلسة ('+n+' مشارك).';sfx('ok');return true}
  }
  return false;
}
function addChange(t){
  const a=t.dataset.act;
  if(a==='sv'){if(!S.sv)S.sv={};S.sv[t.dataset.q]=+t.dataset.o;save();return true}
  if(a==='ctbeep'){CT.beep=t.checked;return true}
  if(a==='ctr'){CT.rounds=+t.value;return true}
  if(a==='cts'){CT.secs=+t.value;CT.left=CT.secs;return true}
  if(a==='ctk'){const k=t.dataset.k;CT.keys=CT.keys.filter(x=>x!==k);if(t.checked)CT.keys.push(k);render();return true}
  return false;
}
function addInput(t){
  const a=t.dataset&&t.dataset.act;
  if(a==='ctn'){CT.teams[+t.dataset.i].n=t.value;return true}
  if(a==='rp'){S.rep[t.dataset.k]=t.value;save();return true}
  if(t.id==='kurl'){S.kitUrl=t.value;save();const q=$('#qprev');if(q){try{q.innerHTML=QR.svg(progUrl()||FBURL,{border:2})}catch(_){q.innerHTML='<span class="warn">الرابط طويل جدًا لرمز QR.</span>'}}return true}
  if(t.id==='knote'){S.kitNote=t.value;save();return true}
  return false;
}


/* ---------- splash ---------- */
const SPK='diwan-drugs-nosplash';
const sp=$('#splash');let lastFocus=null;
function spSkipped(){try{return localStorage.getItem(SPK)==='1'}catch(_){return false}}
function openSplash(){
  lastFocus=document.activeElement;
  const c=$('#spNo');if(c)c.checked=spSkipped();
  sp.hidden=false;document.body.classList.add('nosc');
  const cd=sp.querySelector&&sp.querySelector('.sp-card');if(cd)cd.scrollTop=0;const b=$('#spGo');if(b&&b.focus)b.focus({preventScroll:true});
}
function closeSplash(){
  const c=$('#spNo');
  try{if(c&&c.checked)localStorage.setItem(SPK,'1');else localStorage.removeItem(SPK)}catch(_){}
  sp.hidden=true;document.body.classList.remove('nosc');
  if(lastFocus&&lastFocus.focus)lastFocus.focus();
}
/* ---------- مسارات الحصة بالوقت ---------- */
const PATHS={
 short:{n:'حصة قصيرة (45 دقيقة)',k:['pre','what','myth','refuse','help','emerg','post']},
 ws1:{n:'ورشة — الجلسة الأولى',k:['pre','what','myth','why','pills','halluc','refuse','pressure']},
 ws2:{n:'ورشة — الجلسة الثانية',k:['online','signs','help','law','life','emerg','post']}
};
function inPath(k){return k==='intro'||k==='end'||!S.path||!S.path.length||S.path.includes(k)}
function stepIdx(i,d){let j=i+d;while(j>=0&&j<ST.length&&!inPath(ST[j].k))j+=d;return(j<0||j>=ST.length)?i:j}
const atEnd=()=>stepIdx(S.i,1)===S.i,atStart=()=>stepIdx(S.i,-1)===S.i;
function ptot(){return(S.path&&S.path.length)?(S.path.reduce((a,k)=>a+(MAXP[k]||0),0)||TOTAL):TOTAL}
function pathMin(){return(S.path||[]).reduce((a,k)=>a+((FAC[k]&&FAC[k].t)||0),0)}
function pathBar(){
  if(!S.path||!S.path.length)return '';
  return `<div class="pathbar noprint">${ico('map-pin','sm')} المسار المختار: <b>${esc(S.pathN||'مسار مخصص')}</b> · ${S.path.length} محطة ≈ ${pathMin()} دقيقة <button class="pill" data-act="pathclear">إلغاء المسار</button></div>`;
}
/* ---------- شريط السابق/التالي العائم + السحب ---------- */
function fnavUpd(){
  const f=$('#fnav');if(!f)return;
  f.hidden=S.mode!=='prog';if(f.hidden)return;
  $('#fnPrev').disabled=atStart();$('#fnNext').disabled=atEnd();
  const pl=ST.map((_,i)=>i).filter(i=>inPath(ST[i].k)),pos=pl.indexOf(S.i);
  $('#fnPos').textContent=(pos<0?'—':pos+1)+' / '+pl.length;
}
(function(){
  let sx=0,sy=0,t0=0,ok=false;
  const blocked=el=>{
    if(!el||!el.closest)return false;
    if(el.closest('input,textarea,select,.track-wrap,.tblw,.tabs,.optb,.bar2,.ctboard,[contenteditable="true"]'))return true;
    for(let n=el;n&&n!==document.body;n=n.parentElement){if(n.scrollWidth>n.clientWidth+4){const o=getComputedStyle(n).overflowX;if(o==='auto'||o==='scroll')return true}}
    return false;
  };
  document.addEventListener('touchstart',e=>{
    ok=false;
    if(e.touches.length!==1||S.mode!=='prog')return;
    if(!sp.hidden||!hp.hidden||(vi&&!vi.hidden))return;
    if(blocked(e.target))return;
    const t=e.touches[0];sx=t.clientX;sy=t.clientY;t0=Date.now();ok=true;
  },{passive:true});
  document.addEventListener('touchend',e=>{
    if(!ok)return;ok=false;
    const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
    if(Date.now()-t0>700||Math.abs(dx)<90||Math.abs(dx)<Math.abs(dy)*2)return;
    try{if(String(window.getSelection()))return}catch(_){}
    go(stepIdx(S.i,dx>0?1:-1));   /* الاتجاه معكوس لأن الصفحة من اليمين إلى اليسار */
  },{passive:true});
})();
/* ---------- أزرار الانتقال السريع ---------- */
const sbh=()=>(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)?'auto':'smooth';
const sUp=$('#sUp'),sDn=$('#sDn');
function scrUpd(){
  const de=document.documentElement,y=window.scrollY||de.scrollTop,max=de.scrollHeight-window.innerHeight;
  if(sUp)sUp.hidden=y<250;
  if(sDn)sDn.hidden=(max-y)<250;
}
window.addEventListener('scroll',scrUpd,{passive:true});
window.addEventListener('resize',scrUpd);
if(window.ResizeObserver)new ResizeObserver(scrUpd).observe(document.body);
scrUpd();
/* ---------- فيديو المدخل (ملف منفصل بجوار هذه الصفحة) ---------- */
const VIDEO_SRC='intro.mp4';
const vi=$('#vintro'),vv=$('#vvid');
let viDone=false,viTimer=0;
function viBtn(id,on){const b=$(id);if(b)b.hidden=!on}
function endIntro(){
  if(viDone)return;viDone=true;
  clearTimeout(viTimer);
  try{vv.pause()}catch(_){}
  sp.inert=false;
  const g=$('#spGo');if(g&&g.focus)g.focus({preventScroll:true});
  vi.classList.add('out');
  setTimeout(()=>{vi.hidden=true;vi.classList.remove('out');try{vv.removeAttribute('src');vv.load()}catch(_){}},550);
}
if(vv){vv.addEventListener('ended',endIntro);vv.addEventListener('error',endIntro);vv.addEventListener('playing',()=>clearTimeout(viTimer))}
function replayIntro(){
  if(!vi||!vv)return;
  viDone=false;vi.classList.remove('out');viBtn('#vsnd',false);
  sp.inert=true;vi.hidden=false;
  const sk=$('#vskip');if(sk&&sk.focus)sk.focus({preventScroll:true});
  clearTimeout(viTimer);viTimer=setTimeout(endIntro,10000);
  vv.src=VIDEO_SRC;vv.muted=false;
  const p=vv.play();
  if(p&&p.catch)p.catch(()=>{vv.muted=true;const q=vv.play();if(q&&q.then)q.then(()=>viBtn('#vsnd',true)).catch(endIntro)});
}
function startIntro(){
  if(!vi||!vv){openSplash();return}
  let seen=false;try{seen=sessionStorage.getItem('diwan-drugs-intro-seen')==='1'}catch(_){}
  if(seen){openSplash();return}
  try{sessionStorage.setItem('diwan-drugs-intro-seen','1')}catch(_){}
  openSplash();sp.inert=true;   /* الافتتاحية جاهزة تحت الفيديو: لا عمل ثقيل عند الانتقال */
  vi.hidden=false;document.body.classList.add('nosc');
  const sk=$('#vskip');if(sk&&sk.focus)sk.focus({preventScroll:true});
  viTimer=setTimeout(endIntro,10000);
  vv.src=VIDEO_SRC;vv.muted=false;
  const p=vv.play();
  if(p&&p.catch)p.catch(()=>{
    vv.muted=true;
    const q=vv.play();
    if(q&&q.then)q.then(()=>viBtn('#vsnd',true)).catch(endIntro);
  });
}
if(!spSkipped())startIntro();

/* ---------- events ---------- */
document.addEventListener('click',e=>{
  if(e.target&&e.target.id==='splash'){closeSplash();return}
  if(e.target&&e.target.id==='helpdlg'){closeHelp();return}
  const t=e.target.closest('[data-act]');if(!t)return;
  const a=t.dataset.act,key=t.dataset.key;
  if(a==='spclose'){closeSplash();return}
  if(a==='spopen'){openSplash();return}
  if(a==='stop'){window.scrollTo({top:0,behavior:sbh()});return}
  if(a==='sbot'){window.scrollTo({top:document.documentElement.scrollHeight,behavior:sbh()});return}
  if(a==='invopen'){replayIntro();return}
  if(a==='vskip'){endIntro();return}
  if(a==='vsound'){vv.muted=false;viBtn('#vsnd',false);return}

  if(addClick(a,t,e))return;
  if(a==='next')go(stepIdx(S.i,1));
  else if(a==='prev')go(stepIdx(S.i,-1));
  else if(a==='go')go(+t.dataset.i);
  else if(a==='mode'){S.mode=t.dataset.v;render(true)}
  else if(a==='tg'){
    const k=t.dataset.k;S[k]=!S[k];
    if(k==='stage'){try{if(S.stage&&document.documentElement.requestFullscreen)document.documentElement.requestFullscreen();else if(!S.stage&&document.fullscreenElement)document.exitFullscreen()}catch(_){}}
    if(k==='snd'&&S.snd)sfx('ok');
    render(false);
  }
  else if(a==='aud'){const v=t.dataset.v;const pl=S.pledge;fresh(true);S.aud=v;S.pledge=pl;render()}
  else if(a==='resume'){S=Object.assign(base(),SAVED);S.fs=loadFs();S.mode='prog';SAVED=null;render(true)}
  else if(a==='newsess'){SAVED=null;try{localStorage.removeItem(KEY)}catch(_){}fresh(true);render(true)}
  else if(a==='pick'){
    const i=+t.dataset.i;S.ans[key]=i;
    const s=SC[key][S.aud].opts[i].s;award(key,s);sfx(s===2?'ok':s===1?'mid':'bad');
    render();
  }
  else if(a==='retry'){delete S.ans[key];delete S.pts[key];clearOrd('o_'+key);render()}
  else if(a==='sans'){
    const q=S.q[key]||0,items=SEQ[key].items(),oi=ordr('q_'+key,items.length);
    const b=+t.dataset.b;S.ans[key+q]=b;
    const ok=b===items[oi[q]].c;
    if(ok)S.cor[key]=(S.cor[key]||0)+1;
    sfx(ok?'ok':'bad');
    award(key,S.cor[key]||0);render();
  }
  else if(a==='snext'){S.q[key]=(S.q[key]||0)+1;const items=SEQ[key].items();if(S.q[key]>=items.length&&(S.cor[key]||0)>=items.length-1)sfx('win');render()}
  else if(a==='redo'){
    Object.keys(S.ans).forEach(k=>{if(k.startsWith(key)&&k!==key)delete S.ans[k]});
    S.q[key]=0;S.cor[key]=0;clearOrd('q_'+key);award(key,0);render();
  }
  else if(a==='printdoc'){printWith('pd')}
});
document.addEventListener('toggle',e=>{
  const d=e.target;
  if(d&&d.dataset&&d.dataset.card)S.cardOpen[d.dataset.card]=d.open;
},true);
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.dataset&&t.dataset.act==='sl'){}
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(!t.dataset)return;
  if(t.dataset.act==='pl'){S.pledge[t.dataset.i]=t.checked;save()}
  else if(addChange(t)){}
  else if(t.dataset.act==='qz'){
    S[t.dataset.k][t.dataset.q]=+t.dataset.o;save();
    const p=$('#qzp');if(p)p.textContent=qzProgress(t.dataset.k);
  }
});
document.addEventListener('keydown',e=>{
  if(vi&&!vi.hidden){
    if(e.key==='Escape'){endIntro();return}
    if(e.key==='Tab'){
      const f=[...vi.querySelectorAll('button')].filter(x=>!x.hidden);
      if(f.length){const first=f[0],last=f[f.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
    }
    return;
  }
  if(!hp.hidden){
    if(e.key==='Escape'){closeHelp();return}
    if(e.key==='Tab'){const f=[...hp.querySelectorAll('button,a[href]')];if(f.length){const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}
    return;
  }
  if(!sp.hidden){
    if(e.key==='Escape'){closeSplash();return}
    if(e.key==='Tab'){
      const f=[...sp.querySelectorAll('button,input,a[href]')].filter(x=>!x.disabled);
      if(f.length){const first=f[0],last=f[f.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
    }
    return;
  }
  if(S.mode==='contest'&&CT.board&&e.key==='Escape'){CT.board=false;render();return}
  const tag=(e.target.tagName||'').toLowerCase();
  if(tag==='input'||tag==='textarea')return;
  if(S.mode!=='prog')return;
  if(e.key==='ArrowLeft')go(stepIdx(S.i,1));
  if(e.key==='ArrowRight')go(stepIdx(S.i,-1));
});
$('#bReset').addEventListener('click',()=>{fresh(true);S.mode='prog';try{localStorage.removeItem(KEY)}catch(_){}SAVED=null;render(true)});

render(false);
})();