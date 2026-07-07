import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────── */
const T = {
  bg:    "#050c18",
  panel: "#0a1628",
  chrome:"#0f1f38",
  deep:  "#040a14",
  unit:  "#091422",
  glass: "rgba(10,22,40,0.84)",
};

/* ─────────────────────────────────────────────────────────────
   ISO MATH
───────────────────────────────────────────────────────────── */
const iso = (x,y,z)=>({ px:(x-y)*Math.cos(Math.PI/6), py:(x+y)*Math.sin(Math.PI/6)-z });
const fv  = v=>(+v).toFixed(2);
const fpt = ps=>ps.map(p=>`${fv(p.px)},${fv(p.py)}`).join(" ");

/* ─────────────────────────────────────────────────────────────
   SVG PRIMITIVES  (return HTML strings — never JSX)
───────────────────────────────────────────────────────────── */
const isoBox=(cx,cy,w,h,d,fill,stroke,a,op=1,glowA=null)=>{
  const tl=iso(cx-w/2,cy-h/2,d),tr=iso(cx+w/2,cy-h/2,d);
  const br=iso(cx+w/2,cy+h/2,d),bl=iso(cx-w/2,cy+h/2,d);
  const r0=iso(cx+w/2,cy-h/2,d),r1=iso(cx+w/2,cy-h/2,0);
  const r2=iso(cx+w/2,cy+h/2,0),r3=iso(cx+w/2,cy+h/2,d);
  const f0=iso(cx-w/2,cy+h/2,d),f1=iso(cx+w/2,cy+h/2,d);
  const f2=iso(cx+w/2,cy+h/2,0),f3=iso(cx-w/2,cy+h/2,0);
  return `<g opacity="${op}">
${glowA?`<polygon points="${fpt([tl,tr,br,bl])}" fill="${glowA}" opacity="0.13"/>`:``}
<polygon points="${fpt([tl,tr,br,bl])}" fill="${fill}" stroke="${stroke}" stroke-width="0.7" stroke-opacity="0.7"/>
<polygon points="${fpt([r0,r1,r2,r3])}" fill="${a}" fill-opacity="0.09" stroke="${stroke}" stroke-width="0.55" stroke-opacity="0.45"/>
<polygon points="${fpt([f0,f1,f2,f3])}" fill="${a}" fill-opacity="0.055" stroke="${stroke}" stroke-width="0.55" stroke-opacity="0.3"/>
<line x1="${fv(tl.px)}" y1="${fv(tl.py)}" x2="${fv(tr.px)}" y2="${fv(tr.py)}" stroke="${a}" stroke-width="1.2" stroke-opacity="0.5"/>
<line x1="${fv(tl.px)}" y1="${fv(tl.py)}" x2="${fv(bl.px)}" y2="${fv(bl.py)}" stroke="${a}" stroke-width="0.55" stroke-opacity="0.26"/>
</g>`;
};

const isoRing=(cx,cy,w,h,d,stroke,a,op=0.25)=>{
  const tl=iso(cx-w/2,cy-h/2,d),tr=iso(cx+w/2,cy-h/2,d);
  const br=iso(cx+w/2,cy+h/2,d),bl=iso(cx-w/2,cy+h/2,d);
  const r0=iso(cx+w/2,cy-h/2,d),r1=iso(cx+w/2,cy-h/2,0);
  const r2=iso(cx+w/2,cy+h/2,0),r3=iso(cx+w/2,cy+h/2,d);
  const f0=iso(cx-w/2,cy+h/2,d),f1=iso(cx+w/2,cy+h/2,d);
  const f2=iso(cx+w/2,cy+h/2,0),f3=iso(cx-w/2,cy+h/2,0);
  return `<g opacity="${op}">
<polygon points="${fpt([tl,tr,br,bl])}" fill="none" stroke="${a}" stroke-width="${stroke}"/>
<polygon points="${fpt([r0,r1,r2,r3])}" fill="none" stroke="${a}" stroke-width="${stroke}" stroke-opacity="0.6"/>
<polygon points="${fpt([f0,f1,f2,f3])}" fill="none" stroke="${a}" stroke-width="${stroke}" stroke-opacity="0.4"/>
</g>`;
};

const isoPlane=(cx,cy,cols,rows,cellW,cellH,d,a,op=0.12)=>{
  let g=`<g opacity="${op}">`;
  for(let r=0;r<=rows;r++){
    const p1=iso(cx-cols*cellW/2,cy-rows*cellH/2+r*cellH,d);
    const p2=iso(cx+cols*cellW/2,cy-rows*cellH/2+r*cellH,d);
    g+=`<line x1="${fv(p1.px)}" y1="${fv(p1.py)}" x2="${fv(p2.px)}" y2="${fv(p2.py)}" stroke="${a}" stroke-width="0.5"/>`;
  }
  for(let c=0;c<=cols;c++){
    const p1=iso(cx-cols*cellW/2+c*cellW,cy-rows*cellH/2,d);
    const p2=iso(cx-cols*cellW/2+c*cellW,cy+rows*cellH/2,d);
    g+=`<line x1="${fv(p1.px)}" y1="${fv(p1.py)}" x2="${fv(p2.px)}" y2="${fv(p2.py)}" stroke="${a}" stroke-width="0.5"/>`;
  }
  return g+`</g>`;
};

const bgGrid=(a,op=0.052)=>`<g opacity="${op}">
${Array.from({length:6},(_,i)=>`<line x1="0" y1="${i*112}" x2="900" y2="${i*112}" stroke="${a}" stroke-width="0.4"/>`).join("")}
${Array.from({length:9},(_,i)=>`<line x1="${i*112}" y1="0" x2="${i*112}" y2="560" stroke="${a}" stroke-width="0.4"/>`).join("")}
</g>`;

/* ── Chromatic depth glow — two offset ellipses for iridescent depth ── */
const chromaGlow=(cx,cy,rx,ry,a)=>
`<ellipse cx="${cx-9}" cy="${cy+7}" rx="${rx}" ry="${ry}" fill="${a}" fill-opacity="0.09" filter="url(#gf)"/>
<ellipse cx="${cx+7}" cy="${cy-5}" rx="${rx*.75}" ry="${ry*.75}" fill="${a}" fill-opacity="0.11" filter="url(#gf)"/>
<ellipse cx="${cx}" cy="${cy}" rx="${rx*.55}" ry="${ry*.55}" fill="url(#rg)" filter="url(#gf)"/>`;

/* ── Holographic floor — perspective vanishing-point grid ── */
const holoFloor=(a,op=0.06)=>{
  const vx=450,vy=640;
  let g=`<g opacity="${op}">`;
  [-280,-210,-140,-70,0,70,140,210,280].forEach(ox=>{
    g+=`<line x1="${vx}" y1="${vy}" x2="${vx+ox}" y2="560" stroke="${a}" stroke-width="0.5"/>`;
  });
  [500,520,540,560].forEach(y=>{
    const spread=((y-vy)/(560-vy))*560;
    g+=`<line x1="${vx-spread*.6}" y1="${y}" x2="${vx+spread*.6}" y2="${y}" stroke="${a}" stroke-width="0.5"/>`;
  });
  return g+`</g>`;
};

/* ── Holographic badge — iridescent gradient border ── */
const holoBadge=(tx,ty,val,lbl,a)=>`<g transform="translate(${tx},${ty})">
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -10;0 0" dur="4.2s" repeatCount="indefinite" calcMode="ease"/>
<rect x="-1" y="-1" width="162" height="76" rx="11" fill="${a}" fill-opacity="0.22"/>
<rect x="0" y="0" width="160" height="74" rx="10" fill="${T.panel}" stroke="${a}" stroke-width="1.4"/>
<rect x="0" y="0" width="160" height="74" rx="10" fill="${a}" fill-opacity="0.055"/>
<line x1="160" y1="0" x2="122" y2="0" stroke="${a}" stroke-width="2.4" stroke-opacity="0.65"/>
<line x1="160" y1="0" x2="160" y2="24" stroke="${a}" stroke-width="2.4" stroke-opacity="0.65"/>
<line x1="0" y1="74" x2="38" y2="74" stroke="${a}" stroke-width="1" stroke-opacity="0.3"/>
<text x="80" y="42" fill="${a}" font-size="27" font-family="'Sora',sans-serif" font-weight="800" text-anchor="middle">${val}</text>
<text x="80" y="60" fill="#44647e" font-size="7.2" font-family="'Space Mono',monospace" font-weight="700" text-anchor="middle" letter-spacing="1.8">${lbl}</text>
</g>`;

/* ── Standard defs ── */
const defs=(a,extras="")=>`<defs>
<radialGradient id="rg"><stop offset="0%" stop-color="${a}" stop-opacity="0.24"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></radialGradient>
<radialGradient id="rg2"><stop offset="0%" stop-color="${a}" stop-opacity="0.44"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></radialGradient>
<filter id="gf"><feGaussianBlur stdDeviation="22"/></filter>
<filter id="gfs"><feGaussianBlur stdDeviation="5"/></filter>
<filter id="gfm"><feGaussianBlur stdDeviation="11"/></filter>
<filter id="gfl"><feGaussianBlur stdDeviation="32"/></filter>
${extras}
</defs>`;

/* ── Premium corner braces ── */
const braces=(a)=>[[24,24,1,1],[876,24,-1,1],[24,536,1,-1],[876,536,-1,-1]].map(
  ([x,y,fx,fy])=>`
<line x1="${x}" y1="${y}" x2="${x+fx*38}" y2="${y}" stroke="${a}" stroke-width="1.8" stroke-opacity="0.55"/>
<line x1="${x}" y1="${y}" x2="${x}" y2="${y+fy*38}" stroke="${a}" stroke-width="1.8" stroke-opacity="0.55"/>
<circle cx="${x}" cy="${y}" r="2.8" fill="${a}" fill-opacity="0.7"/>
<circle cx="${x}" cy="${y}" r="5" fill="none" stroke="${a}" stroke-width="0.5" stroke-opacity="0.3"/>`
).join("");

/* ── Orbiting particles ── */
const orbitRing=(cx,cy,rx,ry,a,dur,delay=0,op=0.35)=>
`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${a}" stroke-width="0.8" stroke-opacity="${op}" stroke-dasharray="4 3">
<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
</ellipse>`;

const orbitDot=(cx,cy,rx,ry,a,dur,delay=0,r=3)=>
`<circle r="${r}" fill="${a}" fill-opacity="0">
<animateMotion path="M ${cx+rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx+rx-0.01} ${cy}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
<animate attributeName="fill-opacity" values="0;0.95;0.95;0" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
</circle>
<circle r="${r+5}" fill="${a}" fill-opacity="0" filter="url(#gfs)">
<animateMotion path="M ${cx+rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx+rx-0.01} ${cy}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
<animate attributeName="fill-opacity" values="0;0.28;0;0" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
</circle>`;

const cable=(x1,y1,x2,y2,mx,my,a,delay=0,dur=0.8)=>
`<path d="M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}" stroke="${a}" stroke-width="1.1" stroke-opacity="0" fill="none" stroke-linecap="round">
<animate attributeName="stroke-opacity" from="0" to="0.42" dur="${dur}s" begin="${delay}s" fill="freeze"/>
</path>`;

const pulse=(cx,cy,r,a,delay=0,dur=2.5)=>
`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${a}" stroke-width="1" opacity="0">
<animate attributeName="opacity" values="0.55;0" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
<animate attributeName="r" values="${r};${r*2.4}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
</circle>`;

const scanLine=(a,dur=6)=>
`<rect x="0" y="0" width="900" height="2" fill="url(#scanG)">
<animateTransform attributeName="transform" type="translate" values="0 -5;0 565;0 -5" dur="${dur}s" repeatCount="indefinite" calcMode="linear"/>
</rect>`;

const scanVLine=(a,dur=7)=>
`<line x1="0" y1="0" x2="0" y2="560" stroke="${a}" stroke-width="1.8" stroke-opacity="0.08">
<animateTransform attributeName="transform" type="translate" values="-10 0;910 0;-10 0" dur="${dur}s" repeatCount="indefinite" calcMode="linear"/>
</line>`;

/* ── Floating depth particles (mobile + ambient) ── */
const depthParticles=(a,count=14,seed=0)=>{
  let g="";
  for(let i=0;i<count;i++){
    const s=(i+seed)*37.13;
    const x=(s*53.7)%900, y=40+((s*91.3)%480);
    const r=1.2+((s*17)%3.2), dur=3+((s*7)%5), delay=((s*3)%5);
    g+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${a}" fill-opacity="0">
<animate attributeName="fill-opacity" values="0;0.55;0" dur="${dur.toFixed(2)}s" begin="${delay.toFixed(2)}s" repeatCount="indefinite"/>
<animateTransform attributeName="transform" type="translate" values="0 0;${((s*5)%20-10).toFixed(1)} -26;0 0" dur="${(dur*1.5).toFixed(2)}s" begin="${delay.toFixed(2)}s" repeatCount="indefinite" calcMode="ease"/>
</circle>`;
  }
  return `<g>${g}</g>`;
};

/* ── Rotating iso shard cluster ── */
const isoShardCluster=(cx,cy,a,scale=1)=>{
  const s=scale;
  return `<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.7s" begin="0.4s" fill="freeze"/>
<g transform="translate(${cx},${cy})">
<animateTransform attributeName="transform" type="rotate" additive="sum" from="0 0 0" to="360 0 0" dur="${20/s}s" repeatCount="indefinite"/>
${isoBox(0,0,36*s,36*s,26*s,T.chrome,a,a,0.88,a)}
${isoRing(0,0,56*s,56*s,42*s,0.7,a,0.3)}
${isoRing(0,0,76*s,76*s,56*s,0.45,a,0.14)}
</g>
</g>`;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 1 — WEB
═══════════════════════════════════════════════════════════ */
const sceneWeb=(a,mobile=false)=>{
  const wins=[
    {cx:295,cy:210,w:348,h:222,d:22,p:true,fl:0},
    {cx:658,cy:165,w:238,h:158,d:15,p:false,fl:0.2},
    {cx:174,cy:372,w:208,h:146,d:12,p:false,fl:0.44},
  ];
  let s=`<svg viewBox="0 0 900 560" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a,`<linearGradient id="scanG" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${a}" stop-opacity="0"/><stop offset="50%" stop-color="${a}" stop-opacity="0.14"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></linearGradient>`)}
${bgGrid(a)}
${chromaGlow(430,280,345,205,a)}
${braces(a)}
${holoFloor(a)}`;

  s+=isoPlane(430,490,10,4,60,30,0,a,0.1);
  for(let i=0;i<4;i++){
    s+=`<g opacity="0">${isoBox(148+i*162,488,138,26,8,T.chrome,a,a,0.5)}<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${i*0.06}s" fill="freeze"/></g>`;
  }

  wins.forEach((w,wi)=>{
    const {cx,cy,w:ww,h,d}=w, chrH=h*0.115, pad=13;
    const tl=iso(cx-ww/2,cy-h/2,d),tr=iso(cx+ww/2,cy-h/2,d);
    const cB=iso(cx-ww/2,cy-h/2+chrH,d),cBr=iso(cx+ww/2,cy-h/2+chrH,d);
    const sc=[iso(cx-ww/2+pad,cy-h/2+chrH+3,d+.4),iso(cx+ww/2-pad,cy-h/2+chrH+3,d+.4),
              iso(cx+ww/2-pad,cy+h/2-pad,d+.4),iso(cx-ww/2+pad,cy+h/2-pad,d+.4)];
    const sh=iso(cx,cy+h/2+4,0);
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${w.fl*.5}s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" values="0 0;0 -${6+wi*4};0 0" dur="${4.2+wi*.85}s" begin="${w.fl}s" repeatCount="indefinite" calcMode="ease"/>
<ellipse cx="${fv(sh.px)}" cy="${fv(sh.py)}" rx="${ww*.52}" ry="${ww*.1}" fill="${a}" fill-opacity="0.05" filter="url(#gf)"/>
${isoBox(cx,cy,ww,h,d,T.panel,a,a,w.p?1:.78,w.p?a:null)}
<polygon points="${fpt([tl,tr,cBr,cB])}" fill="${T.chrome}"/>
${["#ef4444","#f59e0b","#22c55e"].map((c,di)=>{
  const dp=iso(cx-ww/2+12+di*15,cy-h/2+chrH*.5,d+.5);
  return `<circle cx="${fv(dp.px)}" cy="${fv(dp.py)}" r="${w.p?5.5:3.5}" fill="${c}" fill-opacity="0.94"/>`;
}).join("")}
${w.p?(()=>{
  const ab1=iso(cx-ww/2+56,cy-h/2+chrH*.42,d+.5),ab2=iso(cx+ww/2-14,cy-h/2+chrH*.42,d+.5);
  return `<line x1="${fv(ab1.px)}" y1="${fv(ab1.py)}" x2="${fv(ab2.px)}" y2="${fv(ab2.py)}" stroke="${a}" stroke-width="8" stroke-opacity="0.06" stroke-linecap="round"/>
<line x1="${fv(ab1.px)}" y1="${fv(ab1.py)}" x2="${fv(ab2.px)}" y2="${fv(ab2.py)}" stroke="${a}" stroke-width="0.8" stroke-opacity="0.25" stroke-linecap="round"/>`;
})():""}
<polygon points="${fpt(sc)}" fill="${T.deep}" fill-opacity="0.94"/>
${[0.12,0.27,0.42,0.56,0.70,0.83].map((yr,li)=>{
  const lx=cx-ww*.38+pad,lw=w.p?ww*(.16+(li%4)*.1):ww*(.12+li*.055);
  const p1=iso(lx,cy-h/2+chrH+h*yr,d+.5),p2=iso(lx+lw,cy-h/2+chrH+h*yr,d+.5);
  const isH=li===0&&w.p,isB=li===5&&w.p;
  return `<line x1="${fv(p1.px)}" y1="${fv(p1.py)}" x2="${fv(p2.px)}" y2="${fv(p2.py)}" stroke="${isB?a:isH?"#d8e8f5":a}" stroke-width="${isH?8:isB?11:2.5}" stroke-opacity="${isH?.9:isB?.92:.2}" stroke-linecap="round"/>`;
}).join("")}
</g>`;
  });

  for(let i=0;i<8;i++){
    const bx=160+i*76,by=488;
    const p=iso(bx,by,0),q=iso(bx,by,32+i*8);
    s+=`<line x1="${fv(p.px)}" y1="${fv(p.py)}" x2="${fv(q.px)}" y2="${fv(q.py)}" stroke="${a}" stroke-width="1.2" stroke-opacity="0">
<animate attributeName="stroke-opacity" values="0;0.6;0" dur="${1.2+i*.15}s" begin="${i*.18}s" repeatCount="indefinite"/>
</line>`;
  }

  s+=scanVLine(a,7);
  s+=depthParticles(a,18,2);
  if(mobile) s+=isoShardCluster(790,84,a,0.62);
  else s+=holoBadge(604,42,"99%","LIGHTHOUSE SCORE",a);
  return s+`</svg>`;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 2 — AI
═══════════════════════════════════════════════════════════ */
const sceneAi=(a,mobile=false)=>{
  const layers=[3,5,6,5,3];
  const nodes=[];
  layers.forEach((cnt,li)=>{
    const gY=480/(cnt+1);
    for(let ni=0;ni<cnt;ni++) nodes.push({li,ni,x:95+li*178,y:gY*(ni+1)+26});
  });
  const edges=nodes.flatMap(n=>nodes.filter(b=>b.li===n.li+1).map(b=>({a:n,b})));

  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a,`<linearGradient id="scanG" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${a}" stop-opacity="0"/><stop offset="50%" stop-color="${a}" stop-opacity="0.14"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></linearGradient>`)}
${bgGrid(a)}
${chromaGlow(450,280,380,250,a)}
${braces(a)}
${holoFloor(a)}`;

  layers.forEach((cnt,li)=>{
    const colX=95+li*178, slabH=cnt*90+20;
    s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${li*0.1}s" fill="freeze"/>
${isoBox(colX,280,54,slabH,14,a,a,a,0.045)}
</g>`;
  });

  edges.forEach(({a:na,b},k)=>{
    s+=`<line x1="${na.x}" y1="${na.y}" x2="${b.x}" y2="${b.y}" stroke="${a}" stroke-width="0.65" stroke-opacity="0">
<animate attributeName="stroke-opacity" from="0" to="0.16" dur="0.5s" begin="${.03+k*.004}s" fill="freeze"/>
</line>`;
  });

  edges.slice(0,24).forEach(({a:na,b},k)=>{
    s+=`<circle r="3.8" fill="${a}" fill-opacity="0">
<animateMotion path="M ${na.x} ${na.y} L ${b.x} ${b.y}" dur="1.3s" begin="${k*.12}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;1;1;0" dur="1.3s" begin="${k*.12}s" repeatCount="indefinite"/>
</circle>
<circle r="8" fill="${a}" fill-opacity="0" filter="url(#gfs)">
<animateMotion path="M ${na.x} ${na.y} L ${b.x} ${b.y}" dur="1.3s" begin="${k*.12}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.3;0;0" dur="1.3s" begin="${k*.12}s" repeatCount="indefinite"/>
</circle>`;
  });

  nodes.forEach((n,i)=>{
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${.1+i*.02}s" fill="freeze"/>
${pulse(n.x,n.y,22,a,i*.18,2.8)}
${pulse(n.x,n.y,34,a,i*.18+0.7,2.8)}
<circle cx="${n.x}" cy="${n.y}" r="21" fill="${T.panel}" stroke="${a}" stroke-width="1.5"/>
<circle cx="${n.x}" cy="${n.y}" r="7" fill="${a}">
<animate attributeName="opacity" values="0.6;1;0.6" dur="${2+i*.09}s" begin="${i*.1}s" repeatCount="indefinite"/>
<animate attributeName="r" values="7;9;7" dur="${2+i*.09}s" begin="${i*.1}s" repeatCount="indefinite"/>
</circle>
<circle cx="${n.x}" cy="${n.y}" r="2.8" fill="${T.deep}"/>
</g>`;
  });

  ["INPUT","H1","H2","H3","OUTPUT"].forEach((l,i)=>{
    s+=`<text x="${95+i*178}" y="548" fill="#364d60" font-size="7.5" font-family="'Space Mono',monospace" font-weight="700" text-anchor="middle" opacity="0" letter-spacing="1.5">
${l}<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${1+i*.07}s" fill="freeze"/></text>`;
  });

  s+=orbitRing(762,78,38,15,a,5,0,0.4);
  s+=orbitRing(762,78,54,22,a,8,1,0.2);
  s+=orbitDot(762,78,38,15,a,5,0,3.5);
  s+=depthParticles(a,18,9);

  s+=`<path d="M0 506 C46 490 56 522 112 506 C168 490 178 522 224 506 C280 490 290 522 346 506 C402 490 412 522 468 506 C524 490 534 522 590 506 C646 490 656 522 712 506 C768 490 778 522 834 506 C868 498 900 506 900 506" stroke="${a}" stroke-width="1.6" fill="none" stroke-opacity="0.28" stroke-dasharray="8 4">
<animate attributeName="stroke-dashoffset" from="0" to="-200" dur="2.8s" repeatCount="indefinite"/>
</path>`;

  if(mobile) s+=isoShardCluster(118,470,a,0.55);
  else s+=holoBadge(700,24,"10×","SEARCH ACCURACY","#22c55e");
  return s+`</svg>`;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 3 — CYBER
═══════════════════════════════════════════════════════════ */
const sceneCyber=(a,mobile=false)=>{
  const threats=[{x:108,y:88},{x:782,y:130},{x:88,y:448},{x:798,y:415},{x:450,y:510}];
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a,`<linearGradient id="scanG" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${a}" stop-opacity="0"/><stop offset="50%" stop-color="${a}" stop-opacity="0.14"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></linearGradient>`)}
${bgGrid(a)}
${chromaGlow(450,270,295,222,a)}
${braces(a)}
${holoFloor(a)}`;

  for(let r=1;r<=6;r++){
    s+=`<circle cx="450" cy="270" r="${r*66}" stroke="${a}" stroke-width="0.7" stroke-opacity="${.05+r*.022}" stroke-dasharray="6 5" fill="none" opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.7s" begin="${r*.07}s" fill="freeze"/>
</circle>`;
  }

  s+=`<g>
<line x1="450" y1="270" x2="450" y2="6" stroke="${a}" stroke-width="1.8" stroke-opacity="0.7"/>
<path d="M450 270 L450 6 A264 264 0 0 1 515 15 Z" fill="${a}" fill-opacity="0.09"/>
<animateTransform attributeName="transform" type="rotate" from="0 450 270" to="360 450 270" dur="5s" repeatCount="indefinite"/>
</g>`;

  s+=isoPlane(450,500,8,3,56,28,0,a,0.09);

  [{x:80,y:200},{x:820,y:200},{x:80,y:400},{x:820,y:400}].forEach((pos,i)=>{
    const size=26+i*4;
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="0.65" dur="0.5s" begin="${0.5+i*.1}s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -9;0 0" dur="${3+i*.5}s" begin="${i*.7}s" repeatCount="indefinite" calcMode="ease"/>
${isoBox(pos.x,pos.y,size,size,size*0.7,T.panel,a,a,0.8)}
${isoRing(pos.x,pos.y,size+8,size+8,(size+8)*0.7,0.7,a,0.38)}
</g>`;
  });

  s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.7s" begin="0.28s" fill="freeze"/>
<path d="M460 66 L560 124 L560 256 Q560 392 460 442 Q360 392 360 256 L360 124 Z" fill="${a}" fill-opacity="0.05" transform="translate(8,12)" filter="url(#gfm)"/>
<path d="M450 60 L550 118 L550 250 Q550 386 450 434 Q350 386 350 250 L350 118 Z" fill="${T.panel}" stroke="${a}" stroke-width="2.6" stroke-opacity="0.94"/>
<path d="M450 82 L530 130 L530 248 Q530 358 450 400 Q370 358 370 248 L370 130 Z" fill="${a}" fill-opacity="0.065"/>
${isoPlane(450,350,4,3,28,20,0,a,0.07)}
<rect x="421" y="225" width="58" height="46" rx="6" fill="${a}" fill-opacity="0.9"/>
<path d="M431 225 Q431 194 450 194 Q469 194 469 225" stroke="${a}" stroke-width="7.5" fill="none" stroke-linecap="round"/>
<circle cx="450" cy="250" r="7.5" fill="${T.deep}"/>
<rect x="448" y="250" width="4" height="7" rx="1" fill="${T.deep}"/>
<path d="M450 60 L550 118 L550 250 Q550 386 450 434 Q350 386 350 250 L350 118 Z" fill="none" stroke="${a}" stroke-width="1.8" stroke-opacity="0.4">
<animate attributeName="stroke-opacity" values="0.26;0.95;0.26" dur="2.2s" repeatCount="indefinite"/>
</path>
</g>`;

  threats.forEach((n,i)=>{
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${.85+i*.11}s" fill="freeze"/>
${pulse(n.x,n.y,13,"#ef4444",i*.46,2.4)}
<circle r="3.5" fill="#ef4444" fill-opacity="0">
<animateMotion path="M ${n.x} ${n.y} L 450 247" dur="${2.2+i*.18}s" begin="${i*.5}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.85;0" dur="${2.2+i*.18}s" begin="${i*.5}s" repeatCount="indefinite"/>
</circle>
<circle cx="${n.x}" cy="${n.y}" r="14" fill="${T.panel}" stroke="#ef4444" stroke-width="1.5"/>
<text x="${n.x}" y="${n.y+5}" fill="#ef4444" font-size="10" font-family="monospace" text-anchor="middle" font-weight="700">&#10005;</text>
<line x1="${n.x}" y1="${n.y}" x2="450" y2="247" stroke="#ef4444" stroke-width="0.7" stroke-opacity="0.2" stroke-dasharray="5 4"/>
</g>`;
  });

  s+=scanLine(a,4.5);
  s+=depthParticles(a,18,4);
  if(mobile) s+=isoShardCluster(96,470,a,0.55);
  else s+=holoBadge(20,20,"0-DAY","THREAT RESPONSE",a);
  return s+`</svg>`;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 4 — SERVER
═══════════════════════════════════════════════════════════ */
const sceneServer=(a,mobile=false)=>{
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a,`<linearGradient id="scanG" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${a}" stop-opacity="0"/><stop offset="50%" stop-color="${a}" stop-opacity="0.14"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></linearGradient>`)}
${bgGrid(a)}
${chromaGlow(385,300,315,235,a)}
${braces(a)}
${holoFloor(a)}`;

  s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.5s" fill="freeze"/>
<polygon points="142,70 596,70 658,32 196,32" fill="#0e1e34" stroke="${a}" stroke-width="0.9" stroke-opacity="0.5"/>
<polygon points="596,70 658,32 658,494 596,532" fill="#07121e" stroke="${a}" stroke-width="0.8" stroke-opacity="0.3"/>
<polygon points="142,70 596,70 596,532 142,532" fill="${T.unit}"/>
<polygon points="142,70 596,70 596,532 142,532" fill="none" stroke="${a}" stroke-width="0.85" stroke-opacity="0.28"/>
<line x1="142" y1="70" x2="596" y2="70" stroke="${a}" stroke-width="1.3" stroke-opacity="0.55"/>
<line x1="596" y1="70" x2="658" y2="32" stroke="${a}" stroke-width="0.85" stroke-opacity="0.3"/>
</g>`;

  s+=isoPlane(399,51,6,2,76,19,0,a,0.09);

  for(let i=0;i<13;i++){
    const uy=84+i*34, busy=i%3===1, idle=i===6;
    const ledC=idle?"#1b2d45":busy?"#f59e0b":a;
    const bW=[55,72,46,82,60,76,48,70,77,56,64,71,67][i]*2.1;
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${.24+i*.05}s" fill="freeze"/>
<rect x="150" y="${uy}" width="438" height="28" rx="2" fill="#0a1926"/>
<rect x="150" y="${uy}" width="438" height="1" fill="${a}" fill-opacity="0.12"/>
<circle cx="167" cy="${uy+14}" r="5" fill="${ledC}">
${!idle?`<animate attributeName="opacity" values="0.4;1;0.4" dur="${.9+i*.1}s" begin="${i*.12}s" repeatCount="indefinite"/>`:``}
</circle>
${Array.from({length:10},(_,b)=>{
  const bh=4+(b*2+i)%14;
  return `<rect x="${190+b*14}" y="${uy+28-7-bh}" width="10" height="${bh}" rx="1.5" fill="${a}" fill-opacity="0.65">
<animate attributeName="height" values="${bh};${bh+7};${bh}" dur="${.8+b*.11}s" begin="${i*.065+b*.09}s" repeatCount="indefinite"/>
<animate attributeName="y" values="${uy+28-7-bh};${uy+28-14-bh};${uy+28-7-bh}" dur="${.8+b*.11}s" begin="${i*.065+b*.09}s" repeatCount="indefinite"/>
</rect>`;}).join("")}
<rect x="336" y="${uy+10}" width="238" height="9" rx="2.5" fill="${T.deep}"/>
<rect x="336" y="${uy+10}" width="${bW}" height="9" rx="2.5" fill="${a}" fill-opacity="0.7">
<animate attributeName="width" values="${bW};${Math.min(bW+34,238)};${bW}" dur="${3.2+i*.34}s" repeatCount="indefinite"/>
</rect>
</g>`;
  }

  for(let i=0;i<13;i++) s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${.5+i*.042}s" fill="freeze"/>
<rect x="578" y="${84+i*34+5}" width="34" height="20" rx="2" fill="${T.deep}" stroke="${a}" stroke-width="0.5" stroke-opacity="0.32"/>
<circle cx="595" cy="${84+i*34+15}" r="4.5" fill="${a}" fill-opacity="0.55">
<animate attributeName="opacity" values="0.32;0.92;0.32" dur="1.5s" begin="${i*.14}s" repeatCount="indefinite"/>
</circle>
</g>`;

  [{y:142,mx:710,my:130},{y:192,mx:714,my:185},{y:256,mx:720,my:248},{y:316,mx:716,my:312},{y:374,mx:712,my:368}].forEach(({y,mx,my},i)=>{
    s+=cable(616,y,760,my,mx,y-10,a,0.8+i*.09);
  });

  s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.6s" begin="0.9s" fill="freeze"/>
${isoBox(760,290,46,322,32,T.chrome,a,a,0.8)}
${Array.from({length:8},(_,i)=>{
  const lp=iso(760,290-160+i*44,32.5);
  return `<circle cx="${fv(lp.px)}" cy="${fv(lp.py)}" r="4" fill="${a}" fill-opacity="0.68">
<animate attributeName="opacity" values="0.4;1;0.4" dur="${1+i*.12}s" begin="${i*.15}s" repeatCount="indefinite"/>
</circle>`;}).join("")}
</g>`;

  s+=depthParticles(a,18,7);
  if(mobile) {} else s+=holoBadge(714,394,"99.9%","UPTIME SLA",a);
  return s+`</svg>`;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 5 — DESKTOP
═══════════════════════════════════════════════════════════ */
const sceneDesktop=(a,mobile=false)=>{
  const monitors=[
    {cx:292,cy:210,w:390,h:248,d:24,primary:true},
    {cx:665,cy:170,w:265,h:176,d:17,primary:false},
    {cx:158,cy:382,w:206,h:148,d:13,primary:false},
  ];
  const lines=[
    {txt:"> System scan complete",   col:a},
    {txt:"> 0 threats detected",     col:"#22c55e"},
    {txt:"> Patch KB5034441 applied",col:"#4a7a9a"},
    {txt:"> All 48 endpoints OK",    col:"#4a7a9a"},
    {txt:"> Remote session active_", col:a},
  ];
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a,`<linearGradient id="scanG" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${a}" stop-opacity="0"/><stop offset="50%" stop-color="${a}" stop-opacity="0.14"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></linearGradient>`)}
${bgGrid(a)}
${chromaGlow(400,285,330,230,a)}
${braces(a)}
${holoFloor(a)}`;

  s+=isoPlane(400,500,10,3,56,26,0,a,0.08);

  monitors.forEach((m,mi)=>{
    const{cx,cy,w,h,d}=m, pad=14, chrH=h*.105;
    const scr=[iso(cx-w/2+pad,cy-h/2+pad,d+.4),iso(cx+w/2-pad,cy-h/2+pad,d+.4),
               iso(cx+w/2-pad,cy+h/2-12,d+.4),iso(cx-w/2+pad,cy+h/2-12,d+.4)];
    const chr=[iso(cx-w/2+pad,cy-h/2+pad,d+.4),iso(cx+w/2-pad,cy-h/2+pad,d+.4),
               iso(cx+w/2-pad,cy-h/2+pad+chrH,d+.4),iso(cx-w/2+pad,cy-h/2+pad+chrH,d+.4)];
    const st=iso(cx,cy+h/2+12,d/2),sb=iso(cx,cy+h/2+35,0);
    const sl2=iso(cx-w*.23,cy+h/2+37,0),sr2=iso(cx+w*.23,cy+h/2+37,0);
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.6s" begin="${mi*.15}s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -${4+mi*2};0 0" dur="${4.5+mi*.6}s" begin="${mi*.5}s" repeatCount="indefinite" calcMode="ease"/>
${isoBox(cx,cy,w,h,d,T.deep,m.primary?a:"#223850",a,m.primary?1:.72,m.primary?a:null)}
<polygon points="${fpt(scr)}" fill="#040b16" opacity="0.96"/>
<polygon points="${fpt(chr)}" fill="${T.chrome}" opacity="0.92"/>
${m.primary?["#ef4444","#f59e0b","#22c55e"].map((c,di)=>{
  const dp=iso(cx-w/2+22+di*16,cy-h/2+22,d+.5);
  return `<circle cx="${fv(dp.px)}" cy="${fv(dp.py)}" r="5" fill="${c}"/>`;
}).join(""):""}
${m.primary?lines.map((ln,li)=>{
  const lp=iso(cx-w/2+22,cy-h/2+52+li*30,d+.6);
  return `<text x="${fv(lp.px)}" y="${fv(lp.py)}" fill="${ln.col}" font-size="8" font-family="'Space Mono',monospace" font-weight="700" opacity="0">${ln.txt}<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${.48+li*.18}s" fill="freeze"/></text>`;
}).join(""):""}
${m.primary?`<rect x="${fv(iso(cx-w/2+22,cy-h/2+52+lines.length*30,d+.6).px)}" y="${fv(iso(cx-w/2+22,cy-h/2+52+lines.length*30,d+.6).py)}" width="5.5" height="9.5" fill="${a}">
<animate attributeName="opacity" values="1;0;1" dur="0.9s" repeatCount="indefinite"/>
</rect>`:""}
<line x1="${fv(st.px)}" y1="${fv(st.py)}" x2="${fv(sb.px)}" y2="${fv(sb.py)}" stroke="#172840" stroke-width="4" stroke-linecap="round"/>
<line x1="${fv(sl2.px)}" y1="${fv(sl2.py)}" x2="${fv(sr2.px)}" y2="${fv(sr2.py)}" stroke="#172840" stroke-width="6" stroke-linecap="round"/>
</g>`;
  });

  const mc=monitors[0];
  s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.8s" begin="1s" fill="freeze"/>
${orbitRing(mc.cx,mc.cy-20,202,62,a,9,0,0.22)}
${orbitDot(mc.cx,mc.cy-20,202,62,a,9,0,3.8)}
${orbitRing(mc.cx,mc.cy-20,234,74,a,14,2,0.11)}
</g>`;

  s+=depthParticles(a,18,11);
  if(mobile) s+=isoShardCluster(800,470,a,0.55);
  else s+=holoBadge(20,452,"&lt;2HR","AVG RESPONSE",a);
  return s+`</svg>`;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 6 — NETWORK
═══════════════════════════════════════════════════════════ */
const sceneNetwork=(a,mobile=false)=>{
  const np=[
    {x:450,y:290,r:27,main:true},
    {x:215,y:145,r:17},{x:685,y:128,r:17},
    {x:125,y:374,r:15},{x:765,y:355,r:15},
    {x:305,y:478,r:15},{x:620,y:484,r:15},
    {x:73,y:232,r:12},{x:827,y:226,r:12},
    {x:370,y:78,r:12},{x:532,y:88,r:12},
    {x:164,y:524,r:11},{x:732,y:522,r:11},
  ];
  const conns=[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,7],[1,9],[2,8],[2,10],[3,7],[5,11],[6,12],[4,8]];
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a,`<linearGradient id="scanG" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${a}" stop-opacity="0"/><stop offset="50%" stop-color="${a}" stop-opacity="0.14"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></linearGradient>`)}
${bgGrid(a)}
${chromaGlow(450,290,360,252,a)}
${braces(a)}
${holoFloor(a)}`;

  s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.5s" fill="freeze"/>
${isoBox(450,290,62,62,42,T.chrome,a,a,0.7)}
${isoRing(450,290,80,80,56,0.7,a,0.32)}
${isoRing(450,290,98,98,68,0.5,a,0.16)}
</g>`;

  conns.forEach(([ai,bi],k)=>{
    const na=np[ai],nb=np[bi];
    s+=`<line x1="${na.x}" y1="${na.y}" x2="${nb.x}" y2="${nb.y}" stroke="${a}" stroke-width="0.95" stroke-opacity="0">
<animate attributeName="stroke-opacity" from="0" to="0.24" dur="0.65s" begin="${.16+k*.058}s" fill="freeze"/>
</line>
<circle r="4" fill="${a}" fill-opacity="0">
<animateMotion path="M ${na.x} ${na.y} L ${nb.x} ${nb.y} L ${na.x} ${na.y}" dur="${2.3+k*.14}s" begin="${k*.19}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.95;0.95;0" dur="${2.3+k*.14}s" begin="${k*.19}s" repeatCount="indefinite"/>
</circle>
<circle r="8" fill="${a}" fill-opacity="0" filter="url(#gfs)">
<animateMotion path="M ${na.x} ${na.y} L ${nb.x} ${nb.y} L ${na.x} ${na.y}" dur="${2.3+k*.14}s" begin="${k*.19}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.26;0;0" dur="${2.3+k*.14}s" begin="${k*.19}s" repeatCount="indefinite"/>
</circle>`;
  });

  np.forEach((n,i)=>{
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${.12+i*.05}s" fill="freeze"/>
${pulse(n.x,n.y,n.r*2,a,i*.19,2.8)}
<circle cx="${n.x}" cy="${n.y}" r="${n.r+2}" fill="${a}" fill-opacity="0.06"/>
<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${T.panel}" stroke="${n.main?a:`${a}78`}" stroke-width="${n.main?2.6:1.3}"/>
<circle cx="${n.x}" cy="${n.y}" r="${n.r*.38}" fill="${a}" fill-opacity="${n.main?.94:.54}">
${n.main?`<animate attributeName="r" values="${n.r*.38};${n.r*.54};${n.r*.38}" dur="2s" repeatCount="indefinite"/>`:``}
</circle>
${n.main?`<text x="${n.x}" y="${n.y+4}" fill="#dde8f5" font-size="7.5" font-family="'Space Mono',monospace" font-weight="700" text-anchor="middle">CORE</text>`:``}
</g>`;
  });

  s+=orbitRing(450,290,82,34,a,6,0,0.32);
  s+=orbitDot(450,290,82,34,a,6,0,4.5);
  s+=orbitRing(450,290,114,46,a,10,1.5,0.16);
  s+=depthParticles(a,18,13);

  if(mobile) {} else s+=holoBadge(656,24,"100G","MAX THROUGHPUT",a);
  return s+`</svg>`;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 7 — SURVEILLANCE
═══════════════════════════════════════════════════════════ */
const sceneSurveillance=(a,mobile=false)=>{
  const boxes=[{x:180,y:302,w:90,h:120},{x:504,y:334,w:78,h:98},{x:678,y:268,w:66,h:86}];
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a,`<linearGradient id="scanG" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${a}" stop-opacity="0"/><stop offset="50%" stop-color="${a}" stop-opacity="0.14"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></linearGradient>`)}
${bgGrid(a)}
${chromaGlow(450,130,355,195,a)}
${braces(a)}
${holoFloor(a)}`;

  s+=isoPlane(450,540,12,4,56,24,0,a,0.08);
  [{x:120,h:280},{x:780,h:250}].forEach(({x,h},i)=>{
    s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="0.7" dur="0.6s" begin="${.4+i*.15}s" fill="freeze"/>
${isoBox(x,420-h/2,28,28,h,T.unit,a,a,0.8)}
</g>`;
  });

  s+=`<g>
<animateTransform attributeName="transform" type="rotate" values="-22 450 62;22 450 62;-22 450 62" dur="5.5s" repeatCount="indefinite" calcMode="ease"/>
<path d="M 464 96 L 102 540 L 828 540 Z" fill="${a}" fill-opacity="0.045" stroke="${a}" stroke-width="0.7" stroke-opacity="0.17"/>
<rect x="334" y="50" width="232" height="86" rx="14" fill="${T.panel}" stroke="${a}" stroke-width="1.7"/>
<circle cx="506" cy="93" r="32" fill="${T.deep}" stroke="${a}" stroke-width="1.5"/>
<circle cx="506" cy="93" r="22" fill="${a}" fill-opacity="0.12"/>
<circle cx="506" cy="93" r="13" fill="${a}" fill-opacity="0.5">
<animate attributeName="r" values="13;18;13" dur="2.2s" repeatCount="indefinite"/>
<animate attributeName="fill-opacity" values="0.45;0.85;0.45" dur="2.2s" repeatCount="indefinite"/>
</circle>
<circle cx="506" cy="93" r="5" fill="${a}" fill-opacity="0.97"/>
${[0,1,2].map(i=>`<rect x="${352+i*24}" y="66" width="16" height="9" rx="2.5" fill="${T.chrome}"/>`).join("")}
<circle cx="354" cy="108" r="5.5" fill="#ef4444" fill-opacity="0.55">
<animate attributeName="fill-opacity" values="0.38;0.95;0.38" dur="1.3s" repeatCount="indefinite"/>
</circle>
</g>`;

  boxes.forEach((b,i)=>{
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${.78+i*.2}s" fill="freeze"/>
<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="none" stroke="${a}" stroke-width="1" stroke-dasharray="5 3.5" stroke-opacity="0.38"/>
<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="${a}" fill-opacity="0.025"/>
<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="none" stroke="${a}" stroke-width="2" stroke-opacity="0.2">
<animate attributeName="stroke-opacity" values="0.14;0.9;0.14" dur="2.5s" begin="${i*.58}s" repeatCount="indefinite"/>
</rect>
${[[0,0],[1,0],[0,1],[1,1]].map(([fx,fy])=>
`<line x1="${b.x+fx*b.w}" y1="${b.y+fy*b.h}" x2="${b.x+fx*b.w+(fx?-13:13)}" y2="${b.y+fy*b.h}" stroke="${a}" stroke-width="2.6" stroke-opacity="0.8"/>
<line x1="${b.x+fx*b.w}" y1="${b.y+fy*b.h}" x2="${b.x+fx*b.w}" y2="${b.y+fy*b.h+(fy?-13:13)}" stroke="${a}" stroke-width="2.6" stroke-opacity="0.8"/>`).join("")}
<text x="${b.x+2}" y="${b.y-6}" fill="${a}" font-size="7.5" font-family="'Space Mono',monospace" font-weight="700" letter-spacing="0.8">DETECT</text>
<text x="${b.x+b.w}" y="${b.y-6}" fill="${a}" font-size="7" font-family="'Space Mono',monospace" font-weight="700" text-anchor="end" opacity="0">
${[94,87,91][i]}%<animate attributeName="opacity" from="0" to="0.68" dur="0.4s" begin="${1.2+i*.22}s" fill="freeze"/>
</text>
${pulse(b.x+b.w/2,b.y+b.h/2,Math.min(b.w,b.h)/2,a,i*.6,3)}
</g>`;
  });

  s+=`<g><animate attributeName="opacity" values="0.55;1;0.55" dur="1.4s" repeatCount="indefinite"/>
<rect x="736" y="18" width="122" height="28" rx="3.5" fill="${T.panel}" stroke="#ef4444" stroke-width="0.9"/>
<circle cx="752" cy="32" r="5.5" fill="#ef4444"/>
<text x="769" y="37" fill="#ef4444" font-size="9" font-family="'Space Mono',monospace" font-weight="700" letter-spacing="0.8">&#9679; REC</text>
</g>`;

  s+=depthParticles(a,18,5);
  if(mobile) {} else s+=holoBadge(20,448,"4K","AI RESOLUTION",a);
  return s+`</svg>`;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 8 — TELECOM
═══════════════════════════════════════════════════════════ */
const sceneTelecom=(a,mobile=false)=>{
  const devs=[{x:112,y:170,label:"VOIP"},{x:772,y:188,label:"PBX"},{x:80,y:422,label:"WAN"},{x:804,y:402,label:"SIP"}];
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a,`<linearGradient id="scanG" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${a}" stop-opacity="0"/><stop offset="50%" stop-color="${a}" stop-opacity="0.14"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></linearGradient>`)}
${bgGrid(a)}
${chromaGlow(450,205,316,236,a)}
${braces(a)}
${holoFloor(a)}`;

  s+=isoBox(450,340,40,40,298,"#0b1e32",a,a,.9);
  s+=isoRing(450,340,58,58,318,0.7,a,0.36);
  for(let i=1;i<=4;i++) s+=isoRing(450,340,40+i*40,40+i*40,298-i*72,0.55,a,0.2-i*.03);

  s+=`<circle cx="450" cy="14" r="11" fill="${a}">
<animate attributeName="r" values="11;15;11" dur="1.6s" repeatCount="indefinite"/>
</circle>
<circle cx="450" cy="14" r="18" fill="none" stroke="${a}" stroke-width="0.8" stroke-opacity="0.3">
<animate attributeName="r" values="11;28;11" dur="1.6s" repeatCount="indefinite"/>
<animate attributeName="opacity" values="0.5;0;0.5" dur="1.6s" repeatCount="indefinite"/>
</circle>
<line x1="450" y1="14" x2="450" y2="56" stroke="${a}" stroke-width="2.2" stroke-opacity="0.55"/>`;

  s+=isoBox(450,508,164,64,18,T.chrome,a,a,.68);
  s+=isoPlane(450,514,6,2,48,22,0,a,0.09);

  for(let r=1;r<=6;r++) s+=`<circle cx="450" cy="305" r="1" stroke="${a}" stroke-width="1.3" fill="none" opacity="0">
<animate attributeName="r" values="0;${r*86+50}" dur="3.2s" begin="${r*.55}s" repeatCount="indefinite" calcMode="ease"/>
<animate attributeName="opacity" values="0.6;0" dur="3.2s" begin="${r*.55}s" repeatCount="indefinite" calcMode="ease"/>
</circle>`;

  devs.forEach((dev,i)=>{
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${.64+i*.12}s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -5;0 0" dur="${3.5+i*.4}s" begin="${i*.8}s" repeatCount="indefinite" calcMode="ease"/>
${isoBox(dev.x,dev.y,60,40,20,T.panel,a,a,0.9)}
<text x="${dev.x}" y="${dev.y+6}" fill="${a}" font-size="8" font-family="'Space Mono',monospace" font-weight="700" text-anchor="middle" letter-spacing="0.8">${dev.label}</text>
<line x1="${dev.x}" y1="${dev.y}" x2="450" y2="300" stroke="${a}" stroke-width="0.55" stroke-opacity="0.18" stroke-dasharray="5 4"/>
<circle r="3.5" fill="${a}" fill-opacity="0">
<animateMotion path="M ${dev.x} ${dev.y} L 450 300" dur="2.1s" begin="${i*.5}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.92;0" dur="2.1s" begin="${i*.5}s" repeatCount="indefinite"/>
</circle>
</g>`;
  });

  s+=`<path d="M0 530 C46 512 56 548 102 530 C148 512 158 548 204 530 C250 512 260 548 306 530 C352 512 362 548 408 530 C454 512 464 548 510 530 C556 512 566 548 612 530 C658 512 668 548 714 530 C760 512 770 548 816 530 C848 518 900 530 900 530" stroke="${a}" stroke-width="1.9" fill="none" stroke-opacity="0.38" stroke-dasharray="7 3">
<animate attributeName="stroke-dashoffset" from="0" to="-118" dur="2.2s" repeatCount="indefinite"/>
</path>`;

  s+=depthParticles(a,18,6);
  if(mobile) {} else s+=holoBadge(20,20,"&lt;20ms","LATENCY",a);
  return s+`</svg>`;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 9 — AV
═══════════════════════════════════════════════════════════ */
const sceneAv=(a,mobile=false)=>{
  const avTL=iso(450-268+20,225-168+20,24.6),avTR=iso(450+268-20,225-168+20,24.6);
  const avBR=iso(450+268-20,225+168-14,24.6),avBL=iso(450-268+20,225+168-14,24.6);
  const cp=iso(450,225-80,25.3);
  const s1=iso(450,408,12),s2=iso(450,428,0),sl2=iso(382,430,0),sr2=iso(518,430,0);
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a,`<linearGradient id="scanG" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${a}" stop-opacity="0"/><stop offset="50%" stop-color="${a}" stop-opacity="0.14"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></linearGradient>`)}
${bgGrid(a)}
${chromaGlow(450,248,384,264,a)}
${braces(a)}
${holoFloor(a)}`;

  s+=`<ellipse cx="450" cy="400" rx="285" ry="42" fill="${a}" fill-opacity="0.05" filter="url(#gf)"/>`;
  s+=isoRing(450,225,562,358,26,0.5,a,0.09);
  s+=isoRing(450,225,594,380,28,0.4,a,0.055);
  s+=isoBox(450,225,536,336,25,T.panel,a,a,1,a);
  s+=`<polygon points="${fpt([avTL,avTR,avBR,avBL])}" fill="#070818"/>`;

  s+=`<text x="${fv(cp.px)}" y="${fv(cp.py)}" fill="${a}" font-size="33" font-family="'Sora',sans-serif" font-weight="800" text-anchor="middle" letter-spacing="5" opacity="0">AV / MEDIA
<animate attributeName="opacity" from="0" to="0.65" dur="0.5s" begin="0.38s" fill="freeze"/>
</text>`;

  for(let b=0;b<20;b++){
    const maxH=16+b*4.6, bx=450-278+22+b*28, by=225+134;
    const p1=iso(bx,by,24.8),p2=iso(bx,by-maxH,24.8);
    s+=`<line x1="${fv(p1.px)}" y1="${fv(p1.py)}" x2="${fv(p2.px)}" y2="${fv(p2.py)}" stroke="hsl(${216+b*8},80%,62%)" stroke-width="10" stroke-linecap="round" stroke-opacity="0.9">
<animate attributeName="y2" values="${fv(p2.py)};${fv(p2.py-17)};${fv(p2.py)}" dur="${.95+b*.072}s" begin="${b*.052}s" repeatCount="indefinite"/>
<animate attributeName="y1" values="${fv(p1.py)};${fv(p1.py-5)};${fv(p1.py)}" dur="${.95+b*.072}s" begin="${b*.052}s" repeatCount="indefinite"/>
</line>`;
  }

  [{cx:48,side:"left"},{cx:762,side:"right"}].forEach(({cx,side})=>{
    const sp=iso(cx,225,19.8);
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.4s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -4;0 0" dur="${3.8+(side==="right"?.5:0)}s" repeatCount="indefinite" calcMode="ease"/>
${isoBox(cx,225,90,258,24,T.panel,a,a,.86)}
${isoRing(cx,225,98,266,26,0.5,a,0.19)}
<circle cx="${fv(sp.px)}" cy="${fv(sp.py-13)}" r="33" fill="#090a1a" stroke="${a}" stroke-width="1.2"/>
<circle cx="${fv(sp.px)}" cy="${fv(sp.py-13)}" r="22" fill="${a}" fill-opacity="0.25">
<animate attributeName="r" values="22;31;22" dur="1.6s" begin="${side==="right"?"0.4s":"0s"}" repeatCount="indefinite"/>
<animate attributeName="fill-opacity" values="0.25;0.07;0.25" dur="1.6s" begin="${side==="right"?"0.4s":"0s"}" repeatCount="indefinite"/>
</circle>
<circle cx="${fv(sp.px)}" cy="${fv(sp.py-13)}" r="10" fill="${a}" fill-opacity="0.88"/>
<circle cx="${fv(sp.px)}" cy="${fv(sp.py+32)}" r="14.5" fill="#090a1a" stroke="${a}" stroke-width="0.9"/>
<circle cx="${fv(sp.px)}" cy="${fv(sp.py+32)}" r="6.5" fill="${a}" fill-opacity="0.68"/>
${pulse(+fv(sp.px),+fv(sp.py-13),21,a,side==="right"?.4:0,2.2)}
</g>`;
  });

  s+=`<line x1="${fv(s1.px)}" y1="${fv(s1.py)}" x2="${fv(s2.px)}" y2="${fv(s2.py)}" stroke="#162638" stroke-width="3.8" stroke-linecap="round"/>
<line x1="${fv(sl2.px)}" y1="${fv(sl2.py)}" x2="${fv(sr2.px)}" y2="${fv(sr2.py)}" stroke="#162638" stroke-width="6" stroke-linecap="round"/>`;

  s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.8s" begin="0.8s" fill="freeze"/>
${orbitRing(450,225,312,97,a,12,0,0.19)}
${orbitDot(450,225,312,97,a,12,0,4.5)}
${orbitRing(450,225,342,112,a,18,3,0.09)}
</g>`;

  s+=depthParticles(a,18,8);
  if(mobile) {} else s+=holoBadge(324,466,"8K","DISPLAY QUALITY",a);
  return s+`</svg>`;
};

/* ─────────────────────────────────────────────────────────────
   SCENE MAP
───────────────────────────────────────────────────────────── */
const BUILDERS={
  web:sceneWeb,ai:sceneAi,cyber:sceneCyber,server:sceneServer,
  desktop:sceneDesktop,network:sceneNetwork,surveillance:sceneSurveillance,
  telecom:sceneTelecom,av:sceneAv,
};

function SVGScene({sceneKey,accent,mobile=false}){
  const html=BUILDERS[sceneKey]?.(accent,mobile)??"";
  return <div style={{width:"100%",height:"100%",position:"absolute",inset:0}} dangerouslySetInnerHTML={{__html:html}}/>;
}

/* ─────────────────────────────────────────────────────────────
   SLIDES
───────────────────────────────────────────────────────────── */
const SLIDES=[
  {id:1,headline:"Custom Websites",    subheadline:"Full-Stack & UX Design",          intro:"High-performance responsive interfaces engineered for speed.\nOptimized to convert digital traffic into measurable revenue.",  cta:{primary:"Initiate Development",secondary:"Technology Stack"},  accent:"#f97316",tag:"WEB DEV",  scene:"web",         stat:{value:"99%",  label:"Lighthouse Score"}},
  {id:2,headline:"Search Intelligence",subheadline:"Machine Learning & QA",           intro:"Precision tuning for LLMs and enterprise search engines.\nEnsuring data accuracy and reliability in the AI era.",            cta:{primary:"Audit Data",         secondary:"Methodology"},        accent:"#3b82f6",tag:"AI / ML",  scene:"ai",          stat:{value:"10×",  label:"Search Accuracy"}},
  {id:3,headline:"Cybersecurity",      subheadline:"Security & Defense Architecture", intro:"Real-time threat detection and zero-trust implementation.\nHardening your perimeter with advanced penetration testing.",       cta:{primary:"Deploy Shield",       secondary:"Threat Map"},         accent:"#ef4444",tag:"SECURITY", scene:"cyber",       stat:{value:"0-day",label:"Threat Response"}},
  {id:4,headline:"Managed IT",         subheadline:"Systems Operations & Maintenance",intro:"Complete outsourced management of your server infrastructure.\nProactive monitoring so you can focus on scaling.",              cta:{primary:"Consultation",        secondary:"Service Packages"},   accent:"#10b981",tag:"IT OPS",   scene:"server",      stat:{value:"99.9%",label:"Uptime SLA"}},
  {id:5,headline:"Desktop Support",    subheadline:"Endpoint & Helpdesk Management",  intro:"Rapid-response resolution for hardware and software issues.\nRemote and on-site support across all enterprise endpoints.",      cta:{primary:"Request Support",     secondary:"Service Level"},      accent:"#8b5cf6",tag:"SUPPORT",  scene:"desktop",     stat:{value:"<2hr", label:"Avg Response"}},
  {id:6,headline:"Structured Cabling", subheadline:"Infrastructure & Network Layer",  intro:"High-density fiber and copper architectures for 99.9% uptime.\nThe physical backbone for enterprise-grade connectivity.",       cta:{primary:"Specifications",      secondary:"Network Topology"},   accent:"#06b6d4",tag:"CABLING",  scene:"network",     stat:{value:"100G", label:"Max Throughput"}},
  {id:7,headline:"IP Surveillance",    subheadline:"Vision & AI Monitoring",          intro:"AI-powered motion analytics with encrypted remote access.\nEnd-to-end monitoring for high-security environments.",              cta:{primary:"Secure Infrastructure",secondary:"Case Studies"},      accent:"#eab308",tag:"CCTV / AI",scene:"surveillance",stat:{value:"4K",   label:"AI Resolution"}},
  {id:8,headline:"Telecom & VoIP",     subheadline:"Unified Communications",          intro:"Low-latency voice and data synchronization for global teams.\nSeamlessly integrated multi-channel communication systems.",        cta:{primary:"Connect Systems",     secondary:"System Audit"},       accent:"#f43f5e",tag:"VOIP",     scene:"telecom",     stat:{value:"<20ms",label:"Latency"}},
  {id:9,headline:"Modern AV",          subheadline:"Multimedia & Presentation Tech",  intro:"Smart-room technology and interactive display integration.\nAutomated acoustic environments for modern boardrooms.",             cta:{primary:"Request Quote",       secondary:"Solution Gallery"},   accent:"#a855f7",tag:"AV / MEDIA",scene:"av",         stat:{value:"8K",   label:"Display Quality"}},
];

const SLIDE_INTERVAL=7000;

/* ─────────────────────────────────────────────────────────────
   HERO COMPONENT
───────────────────────────────────────────────────────────── */
export default function Hero(){
  const [current,      setCurrent]      = useState(0);
  const [isAutoPlaying,setIsAutoPlaying]= useState(true);
  const [transitioning,setTransitioning]= useState(false);
  const [progress,     setProgress]     = useState(0);
  const [touchStart,   setTouchStart]   = useState(null);
  const [mousePos,     setMousePos]     = useState({x:.5,y:.5});
  const [statTilt,     setStatTilt]     = useState({x:0,y:0});
  const timerRef=useRef(null),rafRef=useRef(null),startRef=useRef(null);
  const heroRef=useRef(null),statRef=useRef(null);

  const goTo=useCallback((idx)=>{
    if(transitioning||idx===current) return;
    setTransitioning(true);
    setTimeout(()=>{setCurrent(idx);setTransitioning(false);startRef.current=null;},520);
  },[current,transitioning]);

  const handleNext=useCallback(()=>goTo((current+1)%SLIDES.length),[current,goTo]);
  const handlePrev=useCallback(()=>goTo((current-1+SLIDES.length)%SLIDES.length),[current,goTo]);

  useEffect(()=>{
    if(!isAutoPlaying){setProgress(0);return;}
    startRef.current=performance.now();
    const tick=now=>{
      if(!startRef.current) startRef.current=now;
      const e=now-startRef.current;
      setProgress(Math.min((e/SLIDE_INTERVAL)*100,100));
      if(e<SLIDE_INTERVAL) rafRef.current=requestAnimationFrame(tick);
    };
    rafRef.current=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(rafRef.current);
  },[current,isAutoPlaying]);

  useEffect(()=>{
    if(!isAutoPlaying) return;
    timerRef.current=setInterval(handleNext,SLIDE_INTERVAL);
    return()=>clearInterval(timerRef.current);
  },[isAutoPlaying,handleNext]);

  const manualNav=i=>{setIsAutoPlaying(false);goTo(i);};
  const scrollTo=(e,id)=>{e.preventDefault();document.querySelector(id)?.scrollIntoView({behavior:"smooth"});};

  const onMouseMove=useCallback(e=>{
    if(!heroRef.current) return;
    const r=heroRef.current.getBoundingClientRect();
    setMousePos({x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height});
    if(statRef.current){
      const sr=statRef.current.getBoundingClientRect();
      const sx=((e.clientX-sr.left)/sr.width-.5)*14;
      const sy=((e.clientY-sr.top)/sr.height-.5)*10;
      setStatTilt({x:sx,y:sy});
    }
  },[]);

  const onTouchStart=e=>setTouchStart(e.touches[0].clientX);
  const onTouchEnd=e=>{
    if(touchStart===null) return;
    const d=touchStart-e.changedTouches[0].clientX;
    if(Math.abs(d)>50){d>0?handleNext():handlePrev();setIsAutoPlaying(false);}
    setTouchStart(null);
  };

  const sl=SLIDES[current];
  const px=(mousePos.x-.5)*20, py=(mousePos.y-.5)*12;

  return (
    <section id="home" ref={heroRef}
      className="relative w-full overflow-hidden text-white select-none"
      style={{height:"100svh",minHeight:480,background:T.bg}}
      onMouseMove={onMouseMove} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        /* ── Font system ── */
        .hD { font-family:'Sora',sans-serif!important; font-weight:800!important; letter-spacing:-0.02em; }
        .hB { font-family:'Inter',sans-serif!important; }
        .hM { font-family:'Space Mono',monospace!important; font-weight:700!important; }
        .hR * { font-family:'Inter',sans-serif; }

        /* ── Entrance animation ── */
        .hEnt { animation: hEnt .78s cubic-bezier(.16,1,.3,1) both; }
        @keyframes hEnt { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
        .d1{animation-delay:.04s;}.d2{animation-delay:.12s;}.d3{animation-delay:.22s;}.d4{animation-delay:.32s;}.d5{animation-delay:.42s;}

        /* ── Buttons ── */
        .bP{position:relative;overflow:hidden;cursor:pointer;
          transition:transform .22s cubic-bezier(.16,1,.3,1),box-shadow .22s;}
        .bP::before{content:'';position:absolute;inset:0;
          background:rgba(255,255,255,.16);transform:translateX(-106%);
          transition:transform .36s cubic-bezier(.16,1,.3,1);}
        .bP:hover::before{transform:translateX(0);}
        .bP:hover{transform:translateY(-2px);}
        .bP:active{transform:translateY(0);}

        .bG{border:1.5px solid rgba(255,255,255,.18);color:rgba(255,255,255,.7);
          transition:all .22s;background:rgba(255,255,255,.05);backdrop-filter:blur(12px);}
        .bG:hover{border-color:rgba(255,255,255,.45);color:#fff;
          background:rgba(255,255,255,.09);transform:translateY(-2px);}

        /* ── Sidebar nav item ── */
        .nI{transition:all .22s;border-left:2px solid transparent;cursor:pointer;}
        .nI:hover{border-left-color:rgba(255,255,255,.2);background:rgba(255,255,255,.03);}
        .nI.on{border-left-color:var(--ac);}

        /* ── Ping dot ── */
        .hPng{animation:hPng 1.8s cubic-bezier(0,0,.2,1) infinite;}
        @keyframes hPng{75%,100%{transform:scale(2.8);opacity:0;}}

        /* ── Holographic shimmer on stat card ── */
        .holoShimmer{
          background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,0.07) 50%,transparent 70%);
          background-size:200% 200%;
          animation:holoShim 3.2s linear infinite;
        }
        @keyframes holoShim{0%{background-position:200% 0;}100%{background-position:-200% 0;}}

        /* ── Stat card 3D float ── */
        .statFloat{animation:statFloat 5s ease-in-out infinite;}
        @keyframes statFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}

        /* ── Noise overlay ── */
        .nz{background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity:.028;pointer-events:none;}

        /* ── Glass surface ── */
        .sC{background:${T.glass};border:1.5px solid rgba(255,255,255,.08);
          backdrop-filter:blur(36px);-webkit-backdrop-filter:blur(36px);}

        /* ── Scrollbar hide ── */
        .ns{scrollbar-width:none;}.ns::-webkit-scrollbar{display:none;}

        /* ── Responsive breakpoints ── */
        @media(min-width:1024px){#home{min-height:660px!important;}}
        @media(max-width:1023px){#home{margin-top:66px!important;height:80svh!important;min-height:460px!important;max-height:710px!important;}}
        @media(max-width:768px){#home{height:78svh!important;min-height:440px!important;max-height:660px!important;}}
        @media(max-width:480px){#home{height:76svh!important;min-height:412px!important;max-height:600px!important;}}
        @media(max-width:380px){#home{height:73svh!important;min-height:390px!important;}}
        @media(max-width:1023px) and (orientation:landscape){#home{height:100svh!important;min-height:340px!important;max-height:520px!important;}}

        /* ── Reduced motion ── */
        @media(prefers-reduced-motion:reduce){
          .hEnt,.holoShimmer,.statFloat,.hPng{animation:none!important;}
          .bP,.bG{transition:none!important;}
        }
      `}</style>

      {/* Film grain */}
      <div className="nz absolute inset-0 z-[1] pointer-events-none"/>

      {/* ── Layer 1: deep parallax glow (slowest) ── */}
      <motion.div className="absolute inset-0 z-0 pointer-events-none"
        animate={{x:px*.18,y:py*.14}} transition={{type:"spring",stiffness:28,damping:20}}
        style={{background:`radial-gradient(ellipse 80% 80% at 50% 50%,${sl.accent}16,transparent 65%)`,transition:"background 1.1s ease"}}/>

      {/* ── Layer 2: mid parallax accent glow ── */}
      <motion.div className="absolute inset-0 z-0 pointer-events-none"
        animate={{x:px*.36,y:py*.28}} transition={{type:"spring",stiffness:46,damping:24}}
        style={{background:`radial-gradient(ellipse 66% 72% at ${52+px*.4}% ${40+py*.4}%,${sl.accent}22,transparent 58%)`,transition:"background .95s ease"}}/>

      {/* ── Layer 3: fast parallax tight bloom ── */}
      <motion.div className="absolute inset-0 z-0 pointer-events-none"
        animate={{x:px*.58,y:py*.44}} transition={{type:"spring",stiffness:68,damping:28}}
        style={{background:`radial-gradient(ellipse 32% 38% at ${48+px*.6}% ${44+py*.6}%,${sl.accent}2a,transparent 55%)`,transition:"background .75s ease"}}/>

      {/* Secondary corner bloom */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{background:`radial-gradient(ellipse 36% 42% at 12% 88%,${sl.accent}0e,transparent 64%)`,transition:"background .95s ease"}}/>

      {/* Fine grid */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{backgroundImage:`linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)`,backgroundSize:"72px 72px"}}/>

      {/* Horizontal light rules */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[.24,.55,.82].map((t,i)=>(
          <div key={i} style={{position:"absolute",top:`${t*100}%`,left:0,right:0,height:"1px",
            background:`linear-gradient(to right,transparent,${sl.accent}${i===1?"1c":"0a"} 24%,${sl.accent}${i===1?"1c":"0a"} 76%,transparent)`,
            transition:"background .95s"}}/>
        ))}
      </div>

      {/* ══════════ MOBILE LAYOUT ══════════ */}
      <div className="lg:hidden hR absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={`m${current}`} className="absolute inset-0"
            initial={{opacity:0,x:38}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-38}}
            transition={{duration:.44,ease:[.16,1,.3,1]}}>

            {/* 3D SVG scene (mobile passes mobile=true) */}
            <div className="absolute inset-0">
              <SVGScene sceneKey={sl.scene} accent={sl.accent} mobile/>
            </div>

            {/* Gradient overlays */}
            <div className="absolute inset-0" style={{background:"linear-gradient(to bottom,rgba(5,12,24,.32) 0%,rgba(5,12,24,.06) 14%,rgba(5,12,24,.62) 46%,rgba(5,12,24,.96) 72%,#050c18 100%)"}}/>
            <div className="absolute inset-0" style={{background:"linear-gradient(to right,rgba(5,12,24,.5) 0%,transparent 58%)"}}/>

            <div className="absolute inset-x-0 bottom-0 z-10" style={{padding:"0 18px clamp(20px,5vw,30px)"}}>

              {/* Tag pill */}
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full"
                style={{background:`${sl.accent}26`,border:`1.5px solid ${sl.accent}58`}}>
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                  <span className="hPng absolute inline-flex h-full w-full rounded-full" style={{background:sl.accent}}/>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{background:sl.accent}}/>
                </span>
                <span className="hM" style={{fontSize:"9.5px",letterSpacing:".3em",textTransform:"uppercase",color:sl.accent}}>{sl.tag}</span>
              </div>

              {/* Headline */}
              <h1 className="hD mb-2.5" style={{fontSize:"clamp(2.3rem,11.5vw,3.5rem)",lineHeight:.9,color:"#fff",textShadow:"0 2px 28px rgba(0,0,0,.5)"}}>
                {sl.headline}
              </h1>

              {/* Subheadline */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="flex-shrink-0 rounded-full" style={{height:3,width:28,background:sl.accent}}/>
                <p className="hB" style={{fontSize:10,fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",color:"rgba(255,255,255,.7)"}}>
                  {sl.subheadline}
                </p>
              </div>

              {/* Intro */}
              <p className="hB mb-3.5" style={{fontWeight:600,color:"rgba(255,255,255,.72)",fontSize:".84rem",lineHeight:1.6,maxWidth:"38ch",
                display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
                {sl.intro.replace(/\n/g," ")}
              </p>

              {/* Mini stat chip */}
              <div className="inline-flex items-center gap-2 mb-3.5 px-3 py-1.5"
                style={{background:"rgba(10,22,40,0.82)",border:`1px solid ${sl.accent}3a`,backdropFilter:"blur(12px)"}}>
                <span className="hD" style={{fontSize:"1.2rem",lineHeight:1,color:sl.accent}}>{sl.stat.value}</span>
                <span className="hM" style={{fontSize:"0.42rem",letterSpacing:"0.22em",color:"rgba(255,255,255,.3)",textTransform:"uppercase"}}>
                  {sl.stat.label}
                </span>
              </div>

              {/* CTAs */}
              <div className="flex gap-2.5 mb-4">
                <a href="#contact" onClick={e=>scrollTo(e,"#contact")}
                  className="bP hB flex-1 inline-flex items-center justify-center gap-1.5 rounded-sm"
                  style={{padding:"12px 14px",fontSize:"11px",fontWeight:800,letterSpacing:".06em",textTransform:"uppercase",background:sl.accent,color:"#fff",minHeight:46}}>
                  {sl.cta.primary}
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="#services" onClick={e=>scrollTo(e,"#services")}
                  className="bG hB inline-flex items-center justify-center rounded-sm"
                  style={{padding:"12px 14px",fontSize:"11px",fontWeight:800,letterSpacing:".06em",textTransform:"uppercase",whiteSpace:"nowrap",minHeight:46}}>
                  {sl.cta.secondary}
                </a>
              </div>

              {/* Dot navigation */}
              <div className="flex items-center gap-1.5">
                {SLIDES.map((_,i)=>(
                  <button key={i} onClick={()=>manualNav(i)} aria-label={`Slide ${i+1}`}
                    className="rounded-full flex-shrink-0"
                    style={{height:3,width:i===current?24:6,background:i===current?sl.accent:"rgba(255,255,255,.22)",transition:"all .32s"}}/>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ══════════ DESKTOP LAYOUT ══════════ */}
      <div className="hidden lg:flex hR absolute inset-0" style={{"--ac":sl.accent}}>

        {/* Sidebar */}
        <div className="relative flex flex-col z-20 flex-shrink-0"
          style={{width:278,paddingTop:90,paddingBottom:66,paddingLeft:46,paddingRight:24,
            borderRight:"1px solid rgba(255,255,255,.055)",
            background:`linear-gradient(to right,${T.bg}f8,rgba(5,12,24,.68))`,
            boxShadow:"inset -1px 0 0 rgba(255,255,255,.032)"}}>

          <div className="mb-10">
            <div className="hM mb-3" style={{fontSize:"8px",letterSpacing:".46em",textTransform:"uppercase",color:"rgba(255,255,255,.2)"}}>Services</div>
            <motion.div className="rounded-full" style={{height:2,width:32,background:sl.accent,transition:"background .55s"}} layoutId="sl"/>
          </div>

          <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto ns">
            {SLIDES.map((sv,i)=>(
              <button key={i} onClick={()=>manualNav(i)}
                className={`nI hB text-left pl-4 py-2.5 pr-2 ${i===current?"on":""}`}
                style={{"--ac":sv.accent,borderLeftColor:i===current?sv.accent:undefined}}>
                <div className="flex items-center justify-between">
                  <span style={{fontFamily:"'Inter',sans-serif",fontSize:10.5,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",
                    color:i===current?"#fff":"rgba(255,255,255,.28)",transition:"color .22s"}}>
                    {sv.tag}
                  </span>
                  {i===current&&<span className="hM" style={{fontSize:8.5,color:sv.accent}}>{String(i+1).padStart(2,"0")}</span>}
                </div>
                {i===current&&(
                  <div style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:800,marginTop:2,color:"rgba(255,255,255,.84)"}}>
                    {sv.headline}
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar controls */}
          <div className="flex items-center gap-2 mt-6 pt-5" style={{borderTop:"1px solid rgba(255,255,255,.058)"}}>
            {[{lbl:"prev",fn:handlePrev,d:"M7.5 9L4.5 6l3-3"},{lbl:"next",fn:handleNext,d:"M4.5 3L7.5 6l-3 3"}].map(btn=>(
              <button key={btn.lbl} onClick={btn.fn}
                className="w-8 h-8 flex items-center justify-center border transition-all"
                style={{borderColor:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.36)"}}
                onMouseEnter={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="rgba(255,255,255,.28)";}}
                onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,.36)";e.currentTarget.style.borderColor="rgba(255,255,255,.1)";}}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d={btn.d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            ))}
            <button onClick={()=>setIsAutoPlaying(p=>!p)}
              className="w-8 h-8 flex items-center justify-center border transition-all"
              style={{borderColor:isAutoPlaying?`${sl.accent}55`:"rgba(255,255,255,.1)",color:isAutoPlaying?sl.accent:"rgba(255,255,255,.28)"}}>
              {isAutoPlaying
                ?<svg width="9" height="9" fill="currentColor" viewBox="0 0 10 10"><rect x="1" y="1" width="3" height="8" rx=".5"/><rect x="6" y="1" width="3" height="8" rx=".5"/></svg>
                :<svg width="9" height="9" fill="currentColor" viewBox="0 0 10 10"><path d="M2 1.5l7 3.5-7 3.5V1.5z"/></svg>}
            </button>
            {/* Progress ring */}
            <div className="relative w-8 h-8 flex items-center justify-center ml-auto">
              <svg width="32" height="32" viewBox="0 0 32 32" style={{position:"absolute",transform:"rotate(-90deg)"}}>
                <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1.5"/>
                <circle cx="16" cy="16" r="13" fill="none" stroke={sl.accent} strokeWidth="1.8"
                  strokeDasharray={`${2*Math.PI*13}`}
                  strokeDashoffset={`${2*Math.PI*13*(1-progress/100)}`}
                  style={{transition:"stroke .55s,stroke-dashoffset .1s"}}/>
              </svg>
              <span className="hM" style={{fontSize:7.5,color:sl.accent,position:"relative",zIndex:1}}>{String(current+1).padStart(2,"0")}</span>
            </div>
          </div>
        </div>

        {/* Scene viewport */}
        <div className="relative flex-1 overflow-hidden z-10">
          <AnimatePresence mode="wait">
            <motion.div key={`sc${current}`} className="absolute z-10"
              style={{inset:0,top:"5%",bottom:"calc(52px + 9%)",left:"1.5%",right:"1.5%"}}
              initial={{opacity:0,scale:1.042}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.962}}
              transition={{duration:.54,ease:[.16,1,.3,1]}}>
              <motion.div style={{width:"100%",height:"100%"}}
                animate={{x:px*.46,y:py*.36}} transition={{type:"spring",stiffness:48,damping:22}}>
                <SVGScene sceneKey={sl.scene} accent={sl.accent}/>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Scene vignette overlays */}
          <div className="absolute inset-0 z-20 pointer-events-none"
            style={{background:"linear-gradient(to right,rgba(5,12,24,.48) 0%,transparent 34%,transparent 54%,rgba(5,12,24,.14) 100%)"}}/>
          <div className="absolute inset-0 z-20 pointer-events-none"
            style={{background:"linear-gradient(to bottom,rgba(5,12,24,.22) 0%,transparent 16%,transparent 42%,rgba(5,12,24,.97) 100%)"}}/>

          {/* System label top-right */}
          <div className="absolute top-6 right-8 z-30 hM" style={{fontSize:8,letterSpacing:".5em",textTransform:"uppercase",color:`${sl.accent}38`}}>
            {sl.scene}_SYS
          </div>

          {/* Slide counter top-left */}
          <div className="absolute top-6 left-7 z-30 flex items-center gap-2">
            <div style={{width:1,height:22,background:`${sl.accent}3e`}}/>
            <span className="hM" style={{fontSize:8,letterSpacing:".4em",color:`${sl.accent}50`}}>
              {String(current+1).padStart(2,"0")}&nbsp;/&nbsp;{String(SLIDES.length).padStart(2,"0")}
            </span>
          </div>

          {/* Content overlay */}
          <AnimatePresence mode="wait">
            <motion.div key={`ct${current}`}
              className="absolute bottom-0 left-0 right-0 z-30 flex items-end justify-between"
              style={{padding:"0 60px 148px 60px",gap:44}}
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
              transition={{duration:.42}}>

              {/* Left: text content */}
              <div style={{maxWidth:580}}>
                {/* Subheadline tag */}
                <div className="hEnt d1 flex items-center gap-3 mb-5">
                  <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                    <span className="hPng absolute inline-flex h-full w-full rounded-full" style={{background:sl.accent}}/>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{background:sl.accent}}/>
                  </span>
                  <span className="hM" style={{fontSize:9.5,letterSpacing:".46em",textTransform:"uppercase",color:sl.accent}}>
                    {sl.subheadline}
                  </span>
                </div>

                {/* Headline */}
                <h1 className="hD hEnt d2 mb-4" style={{fontSize:"clamp(3.3rem,5.4vw,6.6rem)",lineHeight:.86,color:"#fff"}}>
                  {sl.headline}
                </h1>

                {/* Tag rule */}
                <div className="hEnt d3 flex items-center gap-3 mb-4">
                  <div style={{width:46,height:2,borderRadius:2,background:`linear-gradient(to right,${sl.accent},transparent)`}}/>
                  <span className="hM" style={{fontSize:8,letterSpacing:".38em",textTransform:"uppercase",color:"rgba(255,255,255,.28)"}}>
                    {sl.tag}
                  </span>
                </div>

                {/* Intro */}
                <p className="hB hEnt d3 mb-7" style={{fontWeight:600,lineHeight:1.74,color:"rgba(255,255,255,.62)",fontSize:"clamp(.86rem,1vw,.99rem)",maxWidth:"50ch"}}>
                  {sl.intro.replace(/\\n/g," ")}
                </p>

                {/* CTA buttons */}
                <div className="hEnt d4 flex items-center gap-3">
                  <a href="#contact" onClick={e=>scrollTo(e,"#contact")}
                    className="bP hB inline-flex items-center gap-2.5"
                    style={{padding:"14px 28px",fontSize:"12px",fontWeight:800,letterSpacing:".17em",textTransform:"uppercase",
                      background:sl.accent,color:"#fff",boxShadow:`0 0 52px ${sl.accent}3a,0 4px 16px rgba(0,0,0,.24)`}}>
                    {sl.cta.primary}
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5h8M7.5 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                  <a href="#services" onClick={e=>scrollTo(e,"#services")}
                    className="bG hB inline-flex items-center gap-2.5"
                    style={{padding:"14px 28px",fontSize:"12px",fontWeight:700,letterSpacing:".17em",textTransform:"uppercase"}}>
                    {sl.cta.secondary}
                  </a>
                </div>
              </div>

              {/* Right: holographic stat card with cursor-tracked 3D tilt */}
              <div className="hEnt d5 flex-shrink-0 text-right statFloat" ref={statRef}
                style={{perspective:600,perspectiveOrigin:"center"}}>
                <motion.div
                  className="sC inline-block p-5 relative overflow-hidden"
                  animate={{
                    rotateX: -statTilt.y,
                    rotateY: statTilt.x,
                    transformPerspective: 600,
                  }}
                  transition={{type:"spring",stiffness:200,damping:28}}
                  style={{
                    boxShadow:`0 0 72px ${sl.accent}1c,inset 0 1px 0 rgba(255,255,255,.06)`,
                    border:`1.5px solid ${sl.accent}28`,
                    transformStyle:"preserve-3d",
                  }}>
                  {/* Corner accent top-right */}
                  <div style={{position:"absolute",top:0,right:0,width:38,height:38,
                    borderLeft:`1.5px solid ${sl.accent}44`,borderBottom:`1.5px solid ${sl.accent}44`,
                    background:`${sl.accent}09`,clipPath:"polygon(100% 0,100% 100%,0 0)"}}/>
                  {/* Corner accent bottom-left */}
                  <div style={{position:"absolute",bottom:0,left:0,width:26,height:26,
                    borderRight:`1px solid ${sl.accent}22`,borderTop:`1px solid ${sl.accent}22`,
                    clipPath:"polygon(0 100%,100% 100%,0 0)"}}/>
                  {/* Holographic shimmer */}
                  <div className="holoShimmer absolute inset-0 pointer-events-none"/>

                  {/* Stat value */}
                  <div className="hD" style={{fontSize:"clamp(2.3rem,3.7vw,4.2rem)",lineHeight:1,color:sl.accent,
                    textShadow:`0 0 28px ${sl.accent}66`,position:"relative",zIndex:1}}>
                    {sl.stat.value}
                  </div>
                  {/* Stat label */}
                  <div className="hM" style={{fontSize:8,letterSpacing:".3em",textTransform:"uppercase",marginTop:6,
                    color:"rgba(255,255,255,.3)",position:"relative",zIndex:1}}>
                    {sl.stat.label}
                  </div>
                  {/* Live indicator */}
                  <div className="mt-4 pt-3.5 flex items-center gap-2.5"
                    style={{borderTop:`1px solid ${sl.accent}1e`,position:"relative",zIndex:1}}>
                    <motion.div className="rounded-full flex-shrink-0"
                      style={{width:6,height:6,background:sl.accent,boxShadow:`0 0 8px ${sl.accent}`}}
                      animate={{scale:[1,1.6,1],opacity:[.6,1,.6]}} transition={{duration:2.3,repeat:Infinity}}/>
                    <span className="hM" style={{fontSize:8,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.24)"}}>
                      Enterprise Grade
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom progress bar ── */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 z-40">
        <div className="h-[1px] w-full" style={{background:"rgba(255,255,255,.048)"}}>
          <div className="h-full" style={{width:`${progress}%`,background:sl.accent,
            boxShadow:`0 0 18px ${sl.accent},0 0 36px ${sl.accent}44`,transition:"none"}}/>
        </div>
        <div className="flex items-center justify-between"
          style={{paddingLeft:"calc(278px + 48px)",paddingRight:24,height:52,
            background:"rgba(5,12,24,.97)",backdropFilter:"blur(30px)",
            borderTop:"1px solid rgba(255,255,255,.042)"}}>
          <div className="flex items-center gap-2.5">
            {SLIDES.map((_,i)=>(
              <button key={i} onClick={()=>manualNav(i)}>
                <div className="rounded-full" style={{width:i===current?26:5,height:5,
                  background:i===current?sl.accent:"rgba(255,255,255,.14)",
                  boxShadow:i===current?`0 0 12px ${sl.accent}88`:"none",
                  transition:"all .36s cubic-bezier(.16,1,.3,1)"}}/>
              </button>
            ))}
          </div>
          <span className="hM" style={{fontSize:8.5,letterSpacing:".44em",textTransform:"uppercase",color:"rgba(255,255,255,.16)"}}>
            {sl.tag} — {sl.headline}
          </span>
          <span className="hM" style={{fontSize:10.5,color:sl.accent}}>
            {String(current+1).padStart(2,"0")}
            <span style={{color:"rgba(255,255,255,.15)"}}> / {String(SLIDES.length).padStart(2,"0")}</span>
          </span>
        </div>
      </div>
    </section>
  );
}