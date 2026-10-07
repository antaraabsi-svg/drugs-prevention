/* ---------- مستمعات أدوات الحصة ---------- */
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act,v=t.dataset.v,k=t.dataset.k;
  switch(a){
   case 'stu':if(k==='m'){STU.m=+v;STU.custom=''}else STU[k]=v;render(false);break;
   case 'studl':stuDownload();break;
   case 'stupr':stuPrint();break;
   case 'stucp':stuCopy();break;
   case 'pc':PUL[k]=Math.max(0,PUL[k]+(+t.dataset.d));PUL.shown=false;render(false);break;
   case 'pshow':PUL.shown=true;render(false);break;
   case 'preset':PUL.a=PUL.b=PUL.c=0;PUL.shown=false;render(false);break;
   case 'pnext':PUL.q=(PUL.q+1)%pulseQs().length;PUL.a=PUL.b=PUL.c=0;PUL.shown=false;render(false);break;
   case 'psave':{const st=pulseStats(),h=getPulse();h.push({id:Date.now(),q:st.q.t,tot:st.tot,pct:st.pct});lsSet(PUK,h.slice(-40));toast('حُفظ الاستطلاع في تقرير الحصة');PUL.a=PUL.b=PUL.c=0;PUL.shown=false;PUL.q=(PUL.q+1)%pulseQs().length;render(false);break}
   case 'pdel':lsSet(PUK,getPulse().filter(x=>String(x.id)!==t.dataset.id));render(false);break;
   case 'lvtab':LIVE.tab=v;render(false);break;
   case 'lvrun':if(LIVE.run)livePause();else liveStart();render(false);break;
   case 'lvreset':livePause();LIVE.t={explain:0,practice:0,discuss:0};render(false);break;
   case 'lvph':LIVE.ph=v;render(false);break;
   case 'lvgo':{const j=stepIdx(S.i,+t.dataset.d);if(j!==S.i){S.i=j;save();render(false)}break}
   case 'qadd':{const f=$('#qin'),x=(f.value||'').trim();if(!x){f.focus();break}const q=getQ();q.push({id:Date.now(),t:x.slice(0,240),done:false});lsSet(QBK,q.slice(-60));render(false);nfUpd();break}
   case 'qpick':{const p=getQ().filter(x=>!x.done);if(p.length){LIVE.pick=p[Math.floor(Math.random()*p.length)].id;render(false)}break}
   case 'qclear':if(window.confirm('مسح كل الأسئلة من الصندوق؟')){lsSet(QBK,[]);LIVE.pick=0;render(false);nfUpd()}break;
  }
});
document.addEventListener('input',e=>{
  const t=e.target,a=t.dataset&&t.dataset.act;if(!a)return;
  if(a==='stuc'){STU.custom=t.value;const c=$('#stuCnt');if(c)c.textContent=t.value.length+' / 110 حرفًا';studioDraw()}
  else if(a==='stuf'){STU.from=t.value;studioDraw()}
  else if(a==='loc'){const l=getLoc();l[t.dataset.k]=t.value;lsSet(LOCK,l)}
});
document.addEventListener('change',e=>{
  const t=e.target,a=t.dataset&&t.dataset.act;if(!a)return;
  if(a==='stur'){STU.real=t.checked;studioDraw()}
  else if(a==='pq'){PUL.q=+t.value;PUL.a=PUL.b=PUL.c=0;PUL.shown=false;render(false)}
  else if(a==='lvtarget'){LIVE.target=+t.value;liveUpd()}
  else if(a==='qdone'){const q=getQ();const x=q.find(y=>String(y.id)===t.dataset.id);if(x){x.done=t.checked;lsSet(QBK,q);render(false);nfUpd()}}
});
