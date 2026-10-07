/* مولّد رموز QR (وضع البايتات، الإصدارات 1-10، مستويا تصحيح L وM) */
const QR=(function(){
  const EC={L:{bits:1,ec:[7,10,15,20,26,18,20,24,30,18],nb:[1,1,1,1,1,2,2,2,2,4]},
            M:{bits:0,ec:[10,16,26,18,24,16,18,22,22,26],nb:[1,1,1,2,2,4,4,4,5,5]}};
  function mul(x,y){let z=0;for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11D);z^=((y>>>i)&1)*x}return z&255}
  function rsGen(d){const r=new Array(d).fill(0);r[d-1]=1;let root=1;for(let i=0;i<d;i++){for(let j=0;j<r.length;j++){r[j]=mul(r[j],root);if(j+1<r.length)r[j]^=r[j+1]}root=mul(root,2)}return r}
  function rsRem(data,gen){const r=gen.map(()=>0);for(const b of data){const f=b^r.shift();r.push(0);gen.forEach((c,i)=>{r[i]^=mul(c,f)})}return r}
  function rawMods(v){let r=(16*v+128)*v+64;if(v>=2){const n=Math.floor(v/7)+2;r-=(25*n-10)*n-55;if(v>=7)r-=36}return r}
  function alignPos(v){if(v===1)return [];const n=Math.floor(v/7)+2,size=v*4+17;const step=Math.ceil((v*4+4)/(n*2-2))*2;const r=[6];for(let p=size-7;r.length<n;p-=step)r.splice(1,0,p);return r}
  const bit=(x,i)=>((x>>>i)&1)!==0;
  function make(text,ecl){
    ecl=ecl||'M';const E=EC[ecl];
    const bytes=Array.from(new TextEncoder().encode(text));
    let ver=0,dataCw=0;
    for(let v=1;v<=10;v++){
      const raw=Math.floor(rawMods(v)/8),dc=raw-E.ec[v-1]*E.nb[v-1];
      const need=4+(v<10?8:16)+8*bytes.length;
      if(need<=dc*8){ver=v;dataCw=dc;break}
    }
    if(!ver)throw new Error('النص طويل جدًا لرمز QR');
    const bits=[];const push=(val,len)=>{for(let i=len-1;i>=0;i--)bits.push((val>>>i)&1)};
    push(4,4);push(bytes.length,ver<10?8:16);bytes.forEach(b=>push(b,8));
    push(0,Math.min(4,dataCw*8-bits.length));
    while(bits.length%8)bits.push(0);
    const cw=[];for(let i=0;i<bits.length;i+=8){let b=0;for(let j=0;j<8;j++)b=(b<<1)|bits[i+j];cw.push(b)}
    for(let p=0xEC;cw.length<dataCw;p^=0xEC^0x11)cw.push(p);
    const nb=E.nb[ver-1],ecLen=E.ec[ver-1],raw=Math.floor(rawMods(ver)/8);
    const nShort=nb-raw%nb,shortLen=Math.floor(raw/nb),gen=rsGen(ecLen);
    const blocks=[];let k=0;
    for(let i=0;i<nb;i++){
      const dl=shortLen-ecLen+(i<nShort?0:1);const dat=cw.slice(k,k+dl);k+=dl;
      const ec=rsRem(dat,gen);if(i<nShort)dat.push(0);blocks.push(dat.concat(ec));
    }
    const fin=[];
    for(let i=0;i<blocks[0].length;i++)blocks.forEach((b,j)=>{if(i!==shortLen-ecLen||j>=nShort)fin.push(b[i])});
    const size=ver*4+17;
    const M=Array.from({length:size},()=>new Array(size).fill(false));
    const F=Array.from({length:size},()=>new Array(size).fill(false));
    const set=(x,y,d)=>{M[y][x]=d;F[y][x]=true};
    for(let i=0;i<size;i++){set(6,i,i%2===0);set(i,6,i%2===0)}
    const finder=(x,y)=>{for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const d=Math.max(Math.abs(dx),Math.abs(dy)),xx=x+dx,yy=y+dy;if(xx>=0&&xx<size&&yy>=0&&yy<size)set(xx,yy,d!==2&&d!==4)}};
    finder(3,3);finder(size-4,3);finder(3,size-4);
    const ap=alignPos(ver),n=ap.length;
    for(let i=0;i<n;i++)for(let j=0;j<n;j++){
      if((i===0&&j===0)||(i===0&&j===n-1)||(i===n-1&&j===0))continue;
      for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(ap[i]+dx,ap[j]+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1);
    }
    const fmt=(mask)=>{
      const data=(E.bits<<3)|mask;let rem=data;for(let i=0;i<10;i++)rem=(rem<<1)^((rem>>>9)*0x537);
      const b=((data<<10)|rem)^0x5412;
      for(let i=0;i<=5;i++)set(8,i,bit(b,i));set(8,7,bit(b,6));set(8,8,bit(b,7));set(7,8,bit(b,8));
      for(let i=9;i<15;i++)set(14-i,8,bit(b,i));
      for(let i=0;i<8;i++)set(size-1-i,8,bit(b,i));
      for(let i=8;i<15;i++)set(8,size-15+i,bit(b,i));
      set(8,size-8,true);
    };
    fmt(0);
    if(ver>=7){
      let rem=ver;for(let i=0;i<12;i++)rem=(rem<<1)^((rem>>>11)*0x1F25);
      const b=(ver<<12)|rem;
      for(let i=0;i<18;i++){const c=bit(b,i),a=size-11+i%3,bb=Math.floor(i/3);set(a,bb,c);set(bb,a,c)}
    }
    // data placement
    let idx=0;
    for(let right=size-1;right>=1;right-=2){
      if(right===6)right=5;
      for(let vert=0;vert<size;vert++)for(let j=0;j<2;j++){
        const x=right-j,up=((right+1)&2)===0,y=up?size-1-vert:vert;
        if(!F[y][x]&&idx<fin.length*8){M[y][x]=bit(fin[idx>>>3],7-(idx&7));idx++}
      }
    }
    const maskFn=[(x,y)=>(x+y)%2===0,(x,y)=>y%2===0,(x,y)=>x%3===0,(x,y)=>(x+y)%3===0,(x,y)=>(Math.floor(x/3)+Math.floor(y/2))%2===0,(x,y)=>x*y%2+x*y%3===0,(x,y)=>(x*y%2+x*y%3)%2===0,(x,y)=>((x+y)%2+x*y%3)%2===0];
    const applyMask=m=>{for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(!F[y][x]&&maskFn[m](x,y))M[y][x]=!M[y][x]};
    const penalty=()=>{
      let p=0;
      const line=(get)=>{
        let run=1,prev=get(0),hist=[];
        let s=[];for(let i=0;i<size;i++)s.push(get(i)?1:0);
        for(let i=1;i<size;i++){if(s[i]===s[i-1]){run++;if(run===5)p+=3;else if(run>5)p++}else run=1}
        const pa=[1,0,1,1,1,0,1,0,0,0,0],pb=[0,0,0,0,1,0,1,1,1,0,1];
        for(let i=0;i+11<=size;i++){let a=true,b=true;for(let j=0;j<11;j++){if(s[i+j]!==pa[j])a=false;if(s[i+j]!==pb[j])b=false}if(a)p+=40;if(b)p+=40}
      };
      for(let y=0;y<size;y++)line(i=>M[y][i]);
      for(let x=0;x<size;x++)line(i=>M[i][x]);
      for(let y=0;y<size-1;y++)for(let x=0;x<size-1;x++){const c=M[y][x];if(c===M[y][x+1]&&c===M[y+1][x]&&c===M[y+1][x+1])p+=3}
      let dark=0;M.forEach(r=>r.forEach(c=>{if(c)dark++}));const tot=size*size;
      p+=Math.max(0,Math.ceil(Math.abs(dark*20-tot*10)/tot)-1)*10;
      return p;
    };
    let best=0,bp=Infinity;
    for(let m=0;m<8;m++){applyMask(m);fmt(m);const p=penalty();if(p<bp){bp=p;best=m}applyMask(m)}
    applyMask(best);fmt(best);
    return {size,ver,get:(x,y)=>M[y][x]};
  }
  function svg(text,opt){
    opt=opt||{};const q=make(text,opt.ecl||'M'),b=opt.border==null?4:opt.border,n=q.size+2*b;
    let d='';for(let y=0;y<q.size;y++)for(let x=0;x<q.size;x++)if(q.get(x,y))d+=`M${x+b},${y+b}h1v1h-1z`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" role="img" aria-label="${opt.label||'رمز QR'}"><rect width="${n}" height="${n}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
  }
  return {make,svg};
})();