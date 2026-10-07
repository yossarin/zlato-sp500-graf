const RAW=window.GOLD_SP_DATA;
const D=RAW.map(([m,s,g,gn])=>({m,t:+m.slice(0,4)+(+m.slice(5)-1)/12,s,g,gn}));
const IDX=Object.fromEntries(D.map((d,i)=>[d.m,i]));
const MON=['sij','velj','ožu','tra','svi','lip','srp','kol','ruj','lis','stu','pro'];
const fm=m=>MON[+m.slice(5)-1]+' '+m.slice(0,4);
const nf=(v,d=1)=>v.toLocaleString('hr-HR',{minimumFractionDigits:d,maximumFractionDigits:d});
const pct=v=>(v>=0?'+':'−')+nf(Math.abs(v*100))+' %';
const mult=v=>(v>=10?nf(v,0):nf(v,v<1?2:1))+'×';
const yrsBetween=(a,b)=>D[b].t-D[a].t;
const cagr=(a,b,k)=>Math.pow(D[b][k]/D[a][k],1/yrsBetween(a,b))-1;
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
let A=IDX['1980-01'],B=IDX['2010-12'];

function dd(a,b,k){const out=[];let pk=-Infinity;for(let i=a;i<=b;i++){pk=Math.max(pk,D[i][k]);out.push(D[i][k]/pk-1)}return out}
function stats(a,b,k){
  const d=dd(a,b,k);let min=0,mi=a,st=null,best={len:0};
  d.forEach((v,j)=>{const i=a+j;if(v<min){min=v;mi=i}
    if(v<0&&st===null)st=i-1; if(v>=0&&st!==null){const L=i-st;if(L>best.len)best={len:L,s:st,e:i,open:false};st=null}});
  if(st!==null){const L=b-st;if(L>best.len)best={len:L,s:st,e:b,open:true}}
  return{cagr:cagr(a,b,k),mult:D[b][k]/D[a][k],min,mi,best};
}

function ticksLog(lo,hi){const c=[];for(let e=-3;e<=4;e++)for(const f of[1,2,5])c.push(f*10**e);let t=c.filter(v=>v>=lo&&v<=hi);if(t.length>7){t=t.filter(v=>String(v).replace(/0|\./g,'')==='1')}return t}

function draw(){
  document.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',String(IDX[c.dataset.a]===A&&IDX[c.dataset.b]===B)));
  document.getElementById('ya').value=D[A].m.slice(0,4);document.getElementById('yb').value=D[B].m.slice(0,4);
  const p1=document.getElementById('p1'),cs=getComputedStyle(p1);const W=p1.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight), narrow=W<520;
  const L=narrow?38:48,R=narrow?88:104,T=12;
  const sp=css('--sp'),go=css('--gold'),grid=css('--grid'),rule=css('--rule'),fg=css('--fg');
  const xs=i=>L+(D[i].t-D[A].t)/(D[B].t-D[A].t)*(W-L-R);
  const xt=[];const span=D[B].t-D[A].t,step=span>40?10:span>20?5:span>8?2:1;
  for(let y=Math.ceil(D[A].t/step)*step;y<=D[B].t;y+=step)xt.push(y);
  const xsT=t=>L+(t-D[A].t)/(D[B].t-D[A].t)*(W-L-R);

  // chart 1
  const H1=narrow?300:340,B1=H1-24;let lo=Infinity,hi=-Infinity;const rs=[],rg=[];
  for(let i=A;i<=B;i++){const s=D[i].s/D[A].s,g=D[i].g/D[A].g;rs.push(s);rg.push(g);lo=Math.min(lo,s,g);hi=Math.max(hi,s,g)}
  lo=Math.min(lo,1)*0.9;hi=hi*1.1;const ly=v=>T+(Math.log(hi)-Math.log(v))/(Math.log(hi)-Math.log(lo))*(B1-T);
  let s1=`<g>`;ticksLog(lo,hi).forEach(v=>{s1+=`<line x1="${L}" x2="${W-R}" y1="${ly(v)}" y2="${ly(v)}" stroke="${v===1?rule:grid}" stroke-width="${v===1?1.5:1}"/><text x="${L-8}" y="${ly(v)+4}" text-anchor="end">${v<1?nf(v,v<0.1?2:1):nf(v,0)}×</text>`});
  xt.forEach(t=>s1+=`<text x="${xsT(t)}" y="${H1-6}" text-anchor="middle">${t}</text>`);s1+='</g>';
  const path=(arr,f)=>arr.map((v,j)=>(j?'L':'M')+xs(A+j).toFixed(1)+','+f(v).toFixed(1)).join('');
  s1+=`<path d="${path(rg,ly)}" fill="none" stroke="${go}" stroke-width="2" stroke-linejoin="round"/><path d="${path(rs,ly)}" fill="none" stroke="${sp}" stroke-width="2" stroke-linejoin="round"/>`;
  const es=rs.at(-1),eg=rg.at(-1);let ys=ly(es),yg=ly(eg);if(Math.abs(ys-yg)<16){const m=(ys+yg)/2,o=ys<yg?-8:8;ys=m+o;yg=m-o}
  s1+=`<circle cx="${xs(B)}" cy="${ly(es)}" r="4" fill="${sp}" stroke="${css('--panel')}" stroke-width="2"/><circle cx="${xs(B)}" cy="${ly(eg)}" r="4" fill="${go}" stroke="${css('--panel')}" stroke-width="2"/>`;
  s1+=`<text class="end" x="${xs(B)+10}" y="${ys+4}" style="fill:${fg}">${narrow?'S&P':'S&P 500'} ${mult(es)}</text><text class="end" x="${xs(B)+10}" y="${yg+4}" style="fill:${fg}">Zlato ${mult(eg)}</text>`;
  s1+=`<line id="x1" y1="${T}" y2="${B1}" stroke="${fg}" stroke-opacity=".35" visibility="hidden"/><circle id="h1s" r="4" fill="${sp}" visibility="hidden"/><circle id="h1g" r="4" fill="${go}" visibility="hidden"/>`;
  const c1=document.getElementById('c1');c1.setAttribute('viewBox',`0 0 ${W} ${H1}`);c1.innerHTML=s1;
  document.getElementById('sub1').textContent=`1 $ uložen u ${fm(D[A].m)}, vrijednost u ${fm(D[B].m)} nakon inflacije. Crta 1× znači da si samo sačuvao kupovnu moć.`;

  // chart 2
  const H2=narrow?180:210,B2=H2-24;const ds=dd(A,B,'s'),dg=dd(A,B,'g');const mn=Math.min(...ds,...dg);const low=Math.floor(mn*10)/10;
  const dy=v=>T+(0-v)/(0-low)*(B2-T);let s2='';
  for(let v=0;v>=low-1e-9;v-=low<-0.6?0.2:0.1){s2+=`<line x1="${L}" x2="${W-R}" y1="${dy(v)}" y2="${dy(v)}" stroke="${Math.abs(v)<1e-9?rule:grid}"/><text x="${L-8}" y="${dy(v)+4}" text-anchor="end">${Math.round(v*100)}%</text>`}
  xt.forEach(t=>s2+=`<text x="${xsT(t)}" y="${H2-6}" text-anchor="middle">${t}</text>`);
  s2+=`<path d="${path(dg,dy)}" fill="none" stroke="${go}" stroke-width="2"/><path d="${path(ds,dy)}" fill="none" stroke="${sp}" stroke-width="2"/>`;
  s2+=`<line id="x2" y1="${T}" y2="${B2}" stroke="${fg}" stroke-opacity=".35" visibility="hidden"/>`;
  const c2=document.getElementById('c2');c2.setAttribute('viewBox',`0 0 ${W} ${H2}`);c2.innerHTML=s2;

  // hover
  const hover=(svg,tip,which)=>{
    const move=e=>{const r=svg.getBoundingClientRect();const x=(e.clientX-r.left)*W/r.width;
      let j=Math.round((x-L)/(W-L-R)*(B-A));j=Math.max(0,Math.min(B-A,j));const i=A+j,X=xs(i);
      ['x1','x2'].forEach(id=>{const l=document.getElementById(id);l.setAttribute('x1',X);l.setAttribute('x2',X);l.setAttribute('visibility','visible')});
      [['h1s',rs[j]],['h1g',rg[j]]].forEach(([id,v])=>{const c=document.getElementById(id);c.setAttribute('cx',X);c.setAttribute('cy',ly(v));c.setAttribute('visibility','visible')});
      tip.innerHTML=`<div class="d">${fm(D[i].m)}</div>`+(which===1?
        `<div class="r"><span><i style="background:${sp}"></i>S&amp;P 500</span><b>${mult(rs[j])}</b></div><div class="r"><span><i style="background:${go}"></i>Zlato</span><b>${mult(rg[j])}</b></div><div class="r" style="color:var(--muted)"><span>zlato nominalno</span><span>${nf(D[i].gn,0)} $</span></div>`:
        `<div class="r"><span><i style="background:${sp}"></i>S&amp;P 500</span><b>${Math.round(ds[j]*100)} %</b></div><div class="r"><span><i style="background:${go}"></i>Zlato</span><b>${Math.round(dg[j]*100)} %</b></div>`);
      tip.hidden=false;const pr=svg.parentElement.getBoundingClientRect();let left=e.clientX-pr.left+14;if(left+tip.offsetWidth>pr.width-8)left=e.clientX-pr.left-tip.offsetWidth-14;
      tip.style.left=Math.max(8,left)+'px';let top=e.clientY-pr.top-tip.offsetHeight-(e.pointerType==='touch'?40:12);if(top<8)top=e.clientY-pr.top+24;tip.style.top=top+'px'};
    svg.onpointermove=move;svg.onpointerdown=move;
    svg.onpointerleave=e=>{if(e.pointerType==='touch')return;tip.hidden=true;['x1','x2','h1s','h1g'].forEach(id=>document.getElementById(id)?.setAttribute('visibility','hidden'));document.querySelectorAll('.tip').forEach(t=>t.hidden=true)};
  };
  hover(c1,document.getElementById('t1'),1);hover(c2,document.getElementById('t2'),2);

  document.onpointerdown=e=>{if(!e.target.closest('svg')){document.querySelectorAll('.tip').forEach(t=>t.hidden=true);['x1','x2','h1s','h1g'].forEach(id=>document.getElementById(id)?.setAttribute('visibility','hidden'))}};
  // stats
  const card=(k,name,col)=>{const s=stats(A,B,k);const u=s.best.len?`${nf(s.best.len/12)} god.`:'nikad';
    const ud=s.best.len?`${fm(D[s.best.s].m)} – ${s.best.open?(B===D.length-1?'još traje':fm(D[B].m)+', i dalje ispod'):fm(D[s.best.e].m)}`:'';
    return `<div class="stat"><h3><i style="background:${col}"></i>${name}</h3><dl>
      <dt>Realni prinos godišnje</dt><dd class="${s.cagr<0?'neg':''}">${pct(s.cagr)}</dd>
      <dt>1 $ postao (realno)</dt><dd>${nf(s.mult,2)} $</dd>
      <dt>Najveći pad</dt><dd class="neg">${Math.round(s.min*100)} % <span style="color:var(--muted)">${fm(D[s.mi].m)}</span></dd>
      <dt>Najduže ispod vrha</dt><dd>${u}</dd>${ud?`<dt></dt><dd style="color:var(--muted)">${ud}</dd>`:''}</dl></div>`};
  document.getElementById('stats').innerHTML=card('s','S&amp;P 500 ukupni povrat',sp)+card('g','Zlato',go);
}

// table
const PER=[['1971–1980: kraj Bretton Woodsa','1971-01','1980-01'],['1980–2010: razdoblje iz rasprave','1980-01','2010-12'],['1980–2000: Volcker i jake realne kamate','1980-01','2000-12'],['2000–2011: balon dot-com pa kriza','2000-01','2011-08'],['2011–2026','2011-08','2026-09'],['1971–2026: cijelo razdoblje','1971-01','2026-09']];
document.querySelector('#tbl tbody').innerHTML=PER.map(([n,a,b])=>{a=IDX[a];b=IDX[b];const s=cagr(a,b,'s'),g=cagr(a,b,'g');
  const cell=(r,m,win)=>`<td class="${win?'win':''}"><span class="${r<0?'neg':''}">${pct(r)}</span><small>${mult(m)}</small></td>`;
  return `<tr><td>${n}</td>${cell(s,D[b].s/D[a].s,s>g)}${cell(g,D[b].g/D[a].g,g>s)}</tr>`}).join('');

// controls
const years=[...new Set(D.map(d=>d.m.slice(0,4)))];
['ya','yb'].forEach(id=>document.getElementById(id).innerHTML=years.map(y=>`<option>${y}</option>`).join(''));
document.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{A=IDX[c.dataset.a];B=IDX[c.dataset.b];draw()});
document.getElementById('ya').onchange=e=>{const y=e.target.value;A=IDX[y+'-01'];if(A>=B-12)B=D.length-1;draw()};
document.getElementById('yb').onchange=e=>{const y=e.target.value;B=IDX[y+'-12']??D.length-1;if(B<=A+12)A=IDX['1971-01'];draw()};
let rz;new ResizeObserver(()=>{cancelAnimationFrame(rz);rz=requestAnimationFrame(draw)}).observe(document.getElementById('p1'));
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',draw);
draw();
