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
  if(e.key==='Escape'){closeDrawer();nfClose();if(gsRes)gsRes.hidden=true}
  if(inGs&&gsRes&&!gsRes.hidden){
    const b=[...gsRes.querySelectorAll('button')],on=b.findIndex(x=>x.classList.contains('on'));
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(b.length){b.forEach(x=>x.classList.remove('on'));b[(on+(e.key==='ArrowDown'?1:-1)+b.length)%b.length].classList.add('on')}}
    if(e.key==='Enter'){e.preventDefault();const c=b[on>=0?on:0];if(c)gsGo(+c.dataset.i)}
  }else if(e.key==='/'&&!/^(input|textarea|select)$/i.test((e.target.tagName||''))&&!e.ctrlKey&&!e.metaKey){const f=$('#gs');if(f){e.preventDefault();f.focus()}}
});
