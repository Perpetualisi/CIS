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
  glass: "rgba(10,22,40,0.82)",
};

/* ─────────────────────────────────────────────────────────────
   ISO MATH
───────────────────────────────────────────────────────────── */
const iso = (x,y,z)=>({ px:(x-y)*Math.cos(Math.PI/6), py:(x+y)*Math.sin(Math.PI/6)-z });
const fv  = v=>(+v).toFixed(2);
const fpt = ps=>ps.map(p=>`${fv(p.px)},${fv(p.py)}`).join(" ");

/* ─────────────────────────────────────────────────────────────
   SHARED PRIMITIVES  (all return HTML strings — never JSX)
   SVG is injected via dangerouslySetInnerHTML so Framer Motion
   never intercepts SVG elements and corrupts cx/cy/r attrs.
───────────────────────────────────────────────────────────── */

/* Full iso box with top/right/front faces + edge highlights */
const isoBox=(cx,cy,w,h,d,fill,stroke,a,op=1,glowA=null)=>{
  const tl=iso(cx-w/2,cy-h/2,d),tr=iso(cx+w/2,cy-h/2,d);
  const br=iso(cx+w/2,cy+h/2,d),bl=iso(cx-w/2,cy+h/2,d);
  const r0=iso(cx+w/2,cy-h/2,d),r1=iso(cx+w/2,cy-h/2,0);
  const r2=iso(cx+w/2,cy+h/2,0),r3=iso(cx+w/2,cy+h/2,d);
  const f0=iso(cx-w/2,cy+h/2,d),f1=iso(cx+w/2,cy+h/2,d);
  const f2=iso(cx+w/2,cy+h/2,0),f3=iso(cx-w/2,cy+h/2,0);
  return `<g opacity="${op}">
${glowA?`<polygon points="${fpt([tl,tr,br,bl])}" fill="${glowA}" opacity="0.12"/>`:``}
<polygon points="${fpt([tl,tr,br,bl])}" fill="${fill}" stroke="${stroke}" stroke-width="0.7" stroke-opacity="0.7"/>
<polygon points="${fpt([r0,r1,r2,r3])}" fill="${a}" fill-opacity="0.09" stroke="${stroke}" stroke-width="0.55" stroke-opacity="0.45"/>
<polygon points="${fpt([f0,f1,f2,f3])}" fill="${a}" fill-opacity="0.055" stroke="${stroke}" stroke-width="0.55" stroke-opacity="0.3"/>
<line x1="${fv(tl.px)}" y1="${fv(tl.py)}" x2="${fv(tr.px)}" y2="${fv(tr.py)}" stroke="${a}" stroke-width="1.1" stroke-opacity="0.45"/>
<line x1="${fv(tl.px)}" y1="${fv(tl.py)}" x2="${fv(bl.px)}" y2="${fv(bl.py)}" stroke="${a}" stroke-width="0.55" stroke-opacity="0.24"/>
</g>`;
};

/* Isometric wireframe ring (hollow box outline) */
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

/* Animated iso-plane grid overlay */
const isoPlane=(cx,cy,cols,rows,cellW,cellH,d,a,op=0.12)=>{
  let g=`<g opacity="${op}">`;
  for(let r=0;r<=rows;r++){
    const p1=iso(cx-cols*cellW/2, cy-rows*cellH/2+r*cellH, d);
    const p2=iso(cx+cols*cellW/2, cy-rows*cellH/2+r*cellH, d);
    g+=`<line x1="${fv(p1.px)}" y1="${fv(p1.py)}" x2="${fv(p2.px)}" y2="${fv(p2.py)}" stroke="${a}" stroke-width="0.5"/>`;
  }
  for(let c=0;c<=cols;c++){
    const p1=iso(cx-cols*cellW/2+c*cellW, cy-rows*cellH/2, d);
    const p2=iso(cx-cols*cellW/2+c*cellW, cy+rows*cellH/2, d);
    g+=`<line x1="${fv(p1.px)}" y1="${fv(p1.py)}" x2="${fv(p2.px)}" y2="${fv(p2.py)}" stroke="${a}" stroke-width="0.5"/>`;
  }
  return g+`</g>`;
};

/* Floating background grid */
const bgGrid=(a,op=0.055)=>`<g opacity="${op}">
${Array.from({length:6},(_,i)=>`<line x1="0" y1="${i*112}" x2="900" y2="${i*112}" stroke="${a}" stroke-width="0.4"/>`).join("")}
${Array.from({length:9},(_,i)=>`<line x1="${i*112}" y1="0" x2="${i*112}" y2="560" stroke="${a}" stroke-width="0.4"/>`).join("")}
</g>`;

/* Standard defs block */
const defs=(a,extras="")=>`<defs>
<radialGradient id="rg"><stop offset="0%" stop-color="${a}" stop-opacity="0.22"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></radialGradient>
<radialGradient id="rg2"><stop offset="0%" stop-color="${a}" stop-opacity="0.4"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></radialGradient>
<filter id="gf"><feGaussianBlur stdDeviation="22"/></filter>
<filter id="gfs"><feGaussianBlur stdDeviation="5"/></filter>
<filter id="gfm"><feGaussianBlur stdDeviation="10"/></filter>
${extras}
</defs>`;

/* Corner brace decorations */
const braces=(a)=>[[24,24,1,1],[876,24,-1,1],[24,536,1,-1],[876,536,-1,-1]].map(
  ([x,y,fx,fy])=>`<line x1="${x}" y1="${y}" x2="${x+fx*34}" y2="${y}" stroke="${a}" stroke-width="1.6" stroke-opacity="0.5"/>
<line x1="${x}" y1="${y}" x2="${x}" y2="${y+fy*34}" stroke="${a}" stroke-width="1.6" stroke-opacity="0.5"/>
<circle cx="${x}" cy="${y}" r="2.2" fill="${a}" fill-opacity="0.65"/>`).join("");

/* Floating stat badge */
const badge=(tx,ty,val,lbl,a)=>`<g transform="translate(${tx},${ty})">
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -9;0 0" dur="4s" repeatCount="indefinite" calcMode="ease"/>
<rect x="0" y="0" width="158" height="72" rx="10" fill="${T.panel}" stroke="${a}" stroke-width="1.3"/>
<rect x="0" y="0" width="158" height="72" rx="10" fill="${a}" fill-opacity="0.04"/>
<line x1="158" y1="0" x2="126" y2="0" stroke="${a}" stroke-width="2.2" stroke-opacity="0.55"/>
<line x1="158" y1="0" x2="158" y2="22" stroke="${a}" stroke-width="2.2" stroke-opacity="0.55"/>
<text x="79" y="41" fill="${a}" font-size="26" font-family="'Bebas Neue',sans-serif" text-anchor="middle">${val}</text>
<text x="79" y="59" fill="#44647e" font-size="7" font-family="monospace" text-anchor="middle" letter-spacing="1.8">${lbl}</text>
</g>`;

/* Orbiting ring (SVG ellipse that rotates in its own group) */
const orbitRing=(cx,cy,rx,ry,a,dur,delay=0,op=0.35)=>
`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${a}" stroke-width="0.8" stroke-opacity="${op}" stroke-dasharray="4 3">
<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
</ellipse>`;

/* Particle dot on a circular path */
const orbitDot=(cx,cy,rx,ry,a,dur,delay=0,r=3)=>
`<circle r="${r}" fill="${a}" fill-opacity="0">
<animateMotion path="M ${cx+rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx+rx-0.01} ${cy}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
<animate attributeName="fill-opacity" values="0;0.9;0.9;0" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
</circle>
<circle r="${r+4}" fill="${a}" fill-opacity="0" filter="url(#gfs)">
<animateMotion path="M ${cx+rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx+rx-0.01} ${cy}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
<animate attributeName="fill-opacity" values="0;0.25;0;0" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
</circle>`;

/* Animated cable/bezier line */
const cable=(x1,y1,x2,y2,mx,my,a,delay=0,dur=0.8)=>
`<path d="M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}" stroke="${a}" stroke-width="1.1" stroke-opacity="0" fill="none" stroke-linecap="round">
<animate attributeName="stroke-opacity" from="0" to="0.4" dur="${dur}s" begin="${delay}s" fill="freeze"/>
</path>`;

/* Horizontal scan sweep */
const scanLine=(a,dur=6)=>
`<rect x="0" y="0" width="900" height="1.5" fill="${a}" fill-opacity="0.12">
<animateTransform attributeName="transform" type="translate" values="0 -5;0 565;0 -5" dur="${dur}s" repeatCount="indefinite" calcMode="linear"/>
</rect>`;

/* Vertical scan sweep */
const scanVLine=(a,dur=7)=>
`<line x1="0" y1="0" x2="0" y2="560" stroke="${a}" stroke-width="1.5" stroke-opacity="0.09">
<animateTransform attributeName="transform" type="translate" values="-10 0;910 0;-10 0" dur="${dur}s" repeatCount="indefinite" calcMode="linear"/>
</line>`;

/* Pulsing ring */
const pulse=(cx,cy,r,a,delay=0,dur=2.5)=>
`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${a}" stroke-width="1" opacity="0">
<animate attributeName="opacity" values="0.5;0" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
<animate attributeName="r" values="${r};${r*2.2}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
</circle>`;

/* ═══════════════════════════════════════════════════════════
   SCENE 1 — WEB  (iso browser stack + holographic ground plane)
═══════════════════════════════════════════════════════════ */
const sceneWeb = a => {
  const wins=[
    {cx:295,cy:210,w:348,h:222,d:22,p:true, fl:0   },
    {cx:658,cy:165,w:238,h:158,d:15,p:false,fl:0.2 },
    {cx:174,cy:372,w:208,h:146,d:12,p:false,fl:0.44},
  ];
  let s=`<svg viewBox="0 0 900 560" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a)}
${bgGrid(a)}
<ellipse cx="430" cy="280" rx="345" ry="205" fill="url(#rg)" filter="url(#gf)"/>
${braces(a)}`;

  /* holographic ground plane */
  s+=isoPlane(430,490,10,4,60,30,0,a,0.1);

  /* floating platform stacks */
  for(let i=0;i<4;i++){
    s+=`<g opacity="0">${isoBox(148+i*162,488,138,26,8,T.chrome,a,a,0.5)}<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${i*0.06}s" fill="freeze"/></g>`;
    s+=`<g opacity="0">${isoBox(148+i*162,488,130,18,14,a,a,a,0.06)}<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${i*0.06+0.05}s" fill="freeze"/></g>`;
  }

  /* browser windows */
  wins.forEach((w,wi)=>{
    const {cx,cy,w:ww,h,d}=w;
    const chrH=h*0.115, pad=13;
    const tl=iso(cx-ww/2,cy-h/2,d),tr=iso(cx+ww/2,cy-h/2,d);
    const cB=iso(cx-ww/2,cy-h/2+chrH,d),cBr=iso(cx+ww/2,cy-h/2+chrH,d);
    const sc=[iso(cx-ww/2+pad,cy-h/2+chrH+3,d+.4),iso(cx+ww/2-pad,cy-h/2+chrH+3,d+.4),
              iso(cx+ww/2-pad,cy+h/2-pad,d+.4),iso(cx-ww/2+pad,cy+h/2-pad,d+.4)];
    const sh=iso(cx,cy+h/2+4,0);
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${w.fl*0.5}s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" values="0 0;0 -${6+wi*4};0 0" dur="${4.2+wi*.85}s" begin="${w.fl}s" repeatCount="indefinite" calcMode="ease"/>
<ellipse cx="${fv(sh.px)}" cy="${fv(sh.py)}" rx="${ww*.52}" ry="${ww*.1}" fill="${a}" fill-opacity="0.04" filter="url(#gf)"/>
${isoBox(cx,cy,ww,h,d,T.panel,a,a,w.p?1:.78,w.p?a:null)}
<polygon points="${fpt([tl,tr,cBr,cB])}" fill="${T.chrome}"/>
<line x1="${fv(cB.px)}" y1="${fv(cB.py)}" x2="${fv(cBr.px)}" y2="${fv(cBr.py)}" stroke="${a}" stroke-width="0.4" stroke-opacity="0.28"/>
${["#ef4444","#f59e0b","#22c55e"].map((c,di)=>{
  const dp=iso(cx-ww/2+12+di*15,cy-h/2+chrH*.5,d+.5);
  return `<circle cx="${fv(dp.px)}" cy="${fv(dp.py)}" r="${w.p?5:3.2}" fill="${c}" fill-opacity="0.92"/>`;
}).join("")}
${(()=>{
  if(!w.p) return "";
  const ab1=iso(cx-ww/2+56,cy-h/2+chrH*.42,d+.5),ab2=iso(cx+ww/2-14,cy-h/2+chrH*.42,d+.5);
  return `<line x1="${fv(ab1.px)}" y1="${fv(ab1.py)}" x2="${fv(ab2.px)}" y2="${fv(ab2.py)}" stroke="${a}" stroke-width="8" stroke-opacity="0.06" stroke-linecap="round"/>
<line x1="${fv(ab1.px)}" y1="${fv(ab1.py)}" x2="${fv(ab2.px)}" y2="${fv(ab2.py)}" stroke="${a}" stroke-width="0.7" stroke-opacity="0.22" stroke-linecap="round"/>`;
})()}
<polygon points="${fpt(sc)}" fill="${T.deep}" fill-opacity="0.94"/>
${[0.12,0.27,0.42,0.56,0.70,0.83].map((yr,li)=>{
  const lx=cx-ww*.38+pad,lw=w.p?ww*(.16+(li%4)*.1):ww*(.12+li*.055);
  const p1=iso(lx,cy-h/2+chrH+h*yr,d+.5),p2=iso(lx+lw,cy-h/2+chrH+h*yr,d+.5);
  const isH=li===0&&w.p,isB=li===5&&w.p;
  return `<line x1="${fv(p1.px)}" y1="${fv(p1.py)}" x2="${fv(p2.px)}" y2="${fv(p2.py)}" stroke="${isB?a:isH?"#d8e8f5":a}" stroke-width="${isH?7:isB?10:2.5}" stroke-opacity="${isH?.9:isB?.92:.2}" stroke-linecap="round"/>`;
}).join("")}
</g>`;
  });

  /* floating code tokens */
  ["</div>","const","async","=>","{}","fn()"].forEach((tok,i)=>{
    s+=`<text x="${78+i*142}" y="${512+(i%2)*22}" fill="${a}" font-size="12" font-family="monospace" opacity="0" letter-spacing="-0.5">${tok}
<animate attributeName="opacity" values="0.1;0.3;0.1" dur="${3+i*.4}s" begin="${i*.5}s" repeatCount="indefinite"/>
</text>`;
  });

  /* extra: 3d data-stream lines rising from platform */
  for(let i=0;i<8;i++){
    const bx=160+i*76,by=488;
    const p=iso(bx,by,0),q=iso(bx,by,30+i*8);
    s+=`<line x1="${fv(p.px)}" y1="${fv(p.py)}" x2="${fv(q.px)}" y2="${fv(q.py)}" stroke="${a}" stroke-width="1" stroke-opacity="0">
<animate attributeName="stroke-opacity" values="0;0.55;0" dur="${1.2+i*.15}s" begin="${i*.18}s" repeatCount="indefinite"/>
</line>`;
  }

  s+=scanVLine(a,7);
  s+=badge(606,44,"99%","LIGHTHOUSE SCORE",a);
  s+=`</svg>`;
  return s;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 2 — AI  (layered 3D neural slabs + orbiting particles)
═══════════════════════════════════════════════════════════ */
const sceneAi = a => {
  const layers=[3,5,6,5,3];
  const nodes=[];
  layers.forEach((cnt,li)=>{ const gY=480/(cnt+1); for(let ni=0;ni<cnt;ni++) nodes.push({li,ni,x:95+li*178,y:gY*(ni+1)+26}); });
  const edges=nodes.flatMap(n=>nodes.filter(b=>b.li===n.li+1).map(b=>({a:n,b})));

  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a)}
${bgGrid(a)}
<ellipse cx="450" cy="280" rx="375" ry="248" fill="url(#rg)" filter="url(#gf)"/>
${braces(a)}`;

  /* 3D layer slabs behind each column */
  layers.forEach((cnt,li)=>{
    const colX=95+li*178;
    const slabH=cnt*90+20;
    s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${li*0.1}s" fill="freeze"/>
${isoBox(colX,280,52,slabH,12,a,a,a,0.04)}
</g>`;
  });

  /* edges */
  edges.forEach(({a:na,b},k)=>{
    s+=`<line x1="${na.x}" y1="${na.y}" x2="${b.x}" y2="${b.y}" stroke="${a}" stroke-width="0.65" stroke-opacity="0">
<animate attributeName="stroke-opacity" from="0" to="0.15" dur="0.5s" begin="${.03+k*.004}s" fill="freeze"/>
</line>`;
  });

  /* forward pulses */
  edges.slice(0,24).forEach(({a:na,b},k)=>{
    s+=`<circle r="3.5" fill="${a}" fill-opacity="0">
<animateMotion path="M ${na.x} ${na.y} L ${b.x} ${b.y}" dur="1.3s" begin="${k*.12}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;1;1;0" dur="1.3s" begin="${k*.12}s" repeatCount="indefinite"/>
</circle>
<circle r="7" fill="${a}" fill-opacity="0" filter="url(#gfs)">
<animateMotion path="M ${na.x} ${na.y} L ${b.x} ${b.y}" dur="1.3s" begin="${k*.12}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.28;0;0" dur="1.3s" begin="${k*.12}s" repeatCount="indefinite"/>
</circle>`;
  });

  /* nodes with orbit rings */
  nodes.forEach((n,i)=>{
    const or=22+Math.sin(i)*4;
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${.1+i*.02}s" fill="freeze"/>
${pulse(n.x,n.y,20,a,i*.18,2.8)}
${pulse(n.x,n.y,30,a,i*.18+0.6,2.8)}
<circle cx="${n.x}" cy="${n.y}" r="20" fill="${T.panel}" stroke="${a}" stroke-width="1.4"/>
<circle cx="${n.x}" cy="${n.y}" r="13" fill="none" stroke="${a}" stroke-width="0.4" stroke-opacity="0.28"/>
<circle cx="${n.x}" cy="${n.y}" r="6.5" fill="${a}">
<animate attributeName="opacity" values="0.6;1;0.6" dur="${2+i*.09}s" begin="${i*.1}s" repeatCount="indefinite"/>
<animate attributeName="r" values="6.5;8;6.5" dur="${2+i*.09}s" begin="${i*.1}s" repeatCount="indefinite"/>
</circle>
<circle cx="${n.x}" cy="${n.y}" r="2.5" fill="${T.deep}"/>
</g>`;
  });

  /* floating data labels */
  ["INPUT","H1","H2","H3","OUTPUT"].forEach((l,i)=>{
    s+=`<text x="${95+i*178}" y="548" fill="#364d60" font-size="7.5" font-family="monospace" text-anchor="middle" opacity="0" letter-spacing="1.5">
${l}<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${1+i*.07}s" fill="freeze"/></text>`;
  });

  /* 3D floating accuracy rings above scene */
  s+=orbitRing(760,80,36,14,a,5,0,0.4);
  s+=orbitRing(760,80,50,20,a,8,1,0.2);
  s+=orbitDot(760,80,36,14,a,5,0,3);

  s+=`<path d="M0 506 C46 490 56 522 112 506 C168 490 178 522 224 506 C280 490 290 522 346 506 C402 490 412 522 468 506 C524 490 534 522 590 506 C646 490 656 522 712 506 C768 490 778 522 834 506 C868 498 900 506 900 506" stroke="${a}" stroke-width="1.4" fill="none" stroke-opacity="0.28" stroke-dasharray="8 4">
<animate attributeName="stroke-dashoffset" from="0" to="-200" dur="2.8s" repeatCount="indefinite"/>
</path>
${badge(702,26,"10×","SEARCH ACCURACY","#22c55e")}</svg>`;
  return s;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 3 — CYBER  (radar + 3D shield + threat arcs + cubes)
═══════════════════════════════════════════════════════════ */
const sceneCyber = a => {
  const threats=[{x:108,y:88},{x:782,y:130},{x:88,y:448},{x:798,y:415},{x:450,y:510}];
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a)}
${bgGrid(a)}
<ellipse cx="450" cy="270" rx="290" ry="218" fill="url(#rg)" filter="url(#gf)"/>
${braces(a)}`;

  /* radar rings */
  for(let r=1;r<=6;r++){
    s+=`<circle cx="450" cy="270" r="${r*66}" stroke="${a}" stroke-width="0.65" stroke-opacity="${.05+r*.022}" stroke-dasharray="6 5" fill="none" opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.7s" begin="${r*.07}s" fill="freeze"/>
</circle>`;
  }
  s+=`<line x1="450" y1="24" x2="450" y2="516" stroke="${a}" stroke-width="0.4" stroke-opacity="0.08"/>
<line x1="106" y1="270" x2="794" y2="270" stroke="${a}" stroke-width="0.4" stroke-opacity="0.08"/>`;

  /* radar sweep */
  s+=`<g>
<line x1="450" y1="270" x2="450" y2="8" stroke="${a}" stroke-width="1.6" stroke-opacity="0.65"/>
<path d="M450 270 L450 8 A262 262 0 0 1 512 16 Z" fill="${a}" fill-opacity="0.08"/>
<animateTransform attributeName="transform" type="rotate" from="0 450 270" to="360 450 270" dur="5s" repeatCount="indefinite"/>
</g>`;

  /* 3D holographic grid on ground */
  s+=isoPlane(450,500,8,3,56,28,0,a,0.08);

  /* floating iso cubes around perimeter */
  [{x:80,y:200},{x:820,y:200},{x:80,y:400},{x:820,y:400}].forEach((pos,i)=>{
    const size=24+i*4;
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="0.6" dur="0.5s" begin="${0.5+i*.1}s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -8;0 0" dur="${3+i*.5}s" begin="${i*.7}s" repeatCount="indefinite" calcMode="ease"/>
${isoBox(pos.x,pos.y,size,size,size*0.7,T.panel,a,a,0.8)}
${isoRing(pos.x,pos.y,size+6,size+6,(size+6)*0.7,0.6,a,0.35)}
</g>`;
  });

  /* shield */
  s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.7s" begin="0.28s" fill="freeze"/>
<path d="M460 68 L558 124 L558 254 Q558 388 460 438 Q362 388 362 254 L362 124 Z" fill="${a}" fill-opacity="0.05" transform="translate(8,12)" filter="url(#gfm)"/>
<path d="M450 62 L548 118 L548 248 Q548 382 450 430 Q352 382 352 248 L352 118 Z" fill="${T.panel}" stroke="${a}" stroke-width="2.4" stroke-opacity="0.92"/>
<path d="M450 84 L528 130 L528 246 Q528 356 450 398 Q372 356 372 246 L372 130 Z" fill="${a}" fill-opacity="0.065"/>
${isoPlane(450,350,4,3,28,20,0,a,0.06)}
<rect x="422" y="226" width="56" height="44" rx="6" fill="${a}" fill-opacity="0.9"/>
<path d="M432 226 Q432 196 450 196 Q468 196 468 226" stroke="${a}" stroke-width="7" fill="none" stroke-linecap="round"/>
<circle cx="450" cy="250" r="7" fill="${T.deep}"/>
<rect x="448" y="250" width="4" height="7" rx="1" fill="${T.deep}"/>
<path d="M450 62 L548 118 L548 248 Q548 382 450 430 Q352 382 352 248 L352 118 Z" fill="none" stroke="${a}" stroke-width="1.6" stroke-opacity="0.4">
<animate attributeName="stroke-opacity" values="0.26;0.92;0.26" dur="2.2s" repeatCount="indefinite"/>
</path>
</g>`;

  /* threat nodes with arcs */
  threats.forEach((n,i)=>{
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${.85+i*.11}s" fill="freeze"/>
${pulse(n.x,n.y,12,"#ef4444",i*.46,2.4)}
<circle r="3.2" fill="#ef4444" fill-opacity="0">
<animateMotion path="M ${n.x} ${n.y} L 450 248" dur="${2.2+i*.18}s" begin="${i*.5}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.8;0" dur="${2.2+i*.18}s" begin="${i*.5}s" repeatCount="indefinite"/>
</circle>
<circle cx="${n.x}" cy="${n.y}" r="13" fill="${T.panel}" stroke="#ef4444" stroke-width="1.4"/>
<text x="${n.x}" y="${n.y+4.5}" fill="#ef4444" font-size="9" font-family="monospace" text-anchor="middle">&#10005;</text>
<line x1="${n.x}" y1="${n.y}" x2="450" y2="248" stroke="#ef4444" stroke-width="0.65" stroke-opacity="0.18" stroke-dasharray="5 4"/>
</g>`;
  });

  s+=scanLine(a,4.5);
  s+=badge(22,22,"0-DAY","THREAT RESPONSE",a);
  s+=`</svg>`;
  return s;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 4 — SERVER  (deep 3D rack + data arcs + data cubes)
═══════════════════════════════════════════════════════════ */
const sceneServer = a => {
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a)}
${bgGrid(a)}
<ellipse cx="385" cy="300" rx="312" ry="232" fill="url(#rg)" filter="url(#gf)"/>
${braces(a)}`;

  /* rack enclosure – 3 faces */
  s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.5s" fill="freeze"/>
<polygon points="142,70 596,70 658,32 196,32" fill="#0e1e34" stroke="${a}" stroke-width="0.9" stroke-opacity="0.5"/>
<polygon points="596,70 658,32 658,494 596,532" fill="#07121e" stroke="${a}" stroke-width="0.8" stroke-opacity="0.3"/>
<polygon points="142,70 596,70 596,532 142,532" fill="${T.unit}"/>
<polygon points="142,70 596,70 596,532 142,532" fill="none" stroke="${a}" stroke-width="0.8" stroke-opacity="0.26"/>
<line x1="142" y1="70" x2="596" y2="70" stroke="${a}" stroke-width="1.2" stroke-opacity="0.5"/>
<line x1="596" y1="70" x2="658" y2="32" stroke="${a}" stroke-width="0.8" stroke-opacity="0.3"/>
</g>`;

  /* iso grid on top face */
  s+=`<g opacity="0.06">
${Array.from({length:5},(_,r)=>{
  const p1=iso(-230+142,cy=>142+r*24,0),p2=iso(230,r*24,0);
  return ``;
})}
</g>`;
  s+=isoPlane(399,51,6,2,76,19,0,a,0.08);

  /* server units */
  for(let i=0;i<13;i++){
    const uy=84+i*34, busy=i%3===1, idle=i===6;
    const ledC=idle?"#1b2d45":busy?"#f59e0b":a;
    const bW=[55,72,46,82,60,76,48,70,77,56,64,71,67][i]*2.1;
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${.24+i*.05}s" fill="freeze"/>
<rect x="150" y="${uy}" width="438" height="28" rx="2" fill="#0a1926"/>
<rect x="150" y="${uy}" width="438" height="1" fill="${a}" fill-opacity="0.1"/>
<circle cx="167" cy="${uy+14}" r="4.8" fill="${ledC}">
${!idle?`<animate attributeName="opacity" values="0.4;1;0.4" dur="${.9+i*.1}s" begin="${i*.12}s" repeatCount="indefinite"/>`:``}
</circle>
${Array.from({length:10},(_,b)=>{
  const bh=4+(b*2+i)%14;
  return `<rect x="${190+b*14}" y="${uy+28-7-bh}" width="10" height="${bh}" rx="1.5" fill="${a}" fill-opacity="0.62">
<animate attributeName="height" values="${bh};${bh+7};${bh}" dur="${.8+b*.11}s" begin="${i*.065+b*.09}s" repeatCount="indefinite"/>
<animate attributeName="y" values="${uy+28-7-bh};${uy+28-14-bh};${uy+28-7-bh}" dur="${.8+b*.11}s" begin="${i*.065+b*.09}s" repeatCount="indefinite"/>
</rect>`;}).join("")}
<rect x="336" y="${uy+10}" width="238" height="9" rx="2.5" fill="${T.deep}"/>
<rect x="336" y="${uy+10}" width="${bW}" height="9" rx="2.5" fill="${a}" fill-opacity="0.68">
<animate attributeName="width" values="${bW};${Math.min(bW+34,238)};${bW}" dur="${3.2+i*.34}s" repeatCount="indefinite"/>
</rect>
</g>`;
  }

  /* port panel */
  for(let i=0;i<13;i++) s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${.5+i*.042}s" fill="freeze"/>
<rect x="578" y="${84+i*34+5}" width="34" height="20" rx="2" fill="${T.deep}" stroke="${a}" stroke-width="0.45" stroke-opacity="0.3"/>
<circle cx="595" cy="${84+i*34+15}" r="4" fill="${a}" fill-opacity="0.52">
<animate attributeName="opacity" values="0.32;0.9;0.32" dur="1.5s" begin="${i*.14}s" repeatCount="indefinite"/>
</circle>
</g>`;

  /* cable arcs to right-side tower */
  [{y:142,mx:710,my:130},{y:192,mx:714,my:185},{y:256,mx:720,my:248},{y:316,mx:716,my:312},{y:374,mx:712,my:368}].forEach(({y,mx,my},i)=>{
    s+=cable(616,y,760,my,mx,y-10,a,0.8+i*.09);
  });

  /* right-side data tower */
  s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.6s" begin="0.9s" fill="freeze"/>
${isoBox(760,290,44,320,30,T.chrome,a,a,0.8)}
${Array.from({length:8},(_,i)=>{
  const lp=iso(760,290-160+i*44,30.5);
  return `<circle cx="${fv(lp.px)}" cy="${fv(lp.py)}" r="3.5" fill="${a}" fill-opacity="0.65">
<animate attributeName="opacity" values="0.4;1;0.4" dur="${1+i*.12}s" begin="${i*.15}s" repeatCount="indefinite"/>
</circle>`;}).join("")}
</g>`;

  s+=badge(716,396,"99.9%","UPTIME SLA",a);
  s+=`</svg>`;
  return s;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 5 — DESKTOP  (3 iso monitors + terminal + orbit rings)
═══════════════════════════════════════════════════════════ */
const sceneDesktop = a => {
  const monitors=[
    {cx:292,cy:210,w:390,h:248,d:24,primary:true },
    {cx:665,cy:170,w:265,h:176,d:17,primary:false},
    {cx:158,cy:382,w:206,h:148,d:13,primary:false},
  ];
  const lines=[
    {txt:"> System scan complete",   col:a         },
    {txt:"> 0 threats detected",     col:"#22c55e" },
    {txt:"> Patch KB5034441 applied",col:"#4a7a9a" },
    {txt:"> All 48 endpoints OK",    col:"#4a7a9a" },
    {txt:"> Remote session active_", col:a         },
  ];
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a)}
${bgGrid(a)}
<ellipse cx="400" cy="285" rx="328" ry="228" fill="url(#rg)" filter="url(#gf)"/>
${braces(a)}`;

  /* ground plane */
  s+=isoPlane(400,500,10,3,56,26,0,a,0.07);

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
  return `<circle cx="${fv(dp.px)}" cy="${fv(dp.py)}" r="4.5" fill="${c}"/>`;
}).join(""):""}
${m.primary?lines.map((ln,li)=>{
  const lp=iso(cx-w/2+22,cy-h/2+52+li*30,d+.6);
  return `<text x="${fv(lp.px)}" y="${fv(lp.py)}" fill="${ln.col}" font-size="7.8" font-family="monospace" opacity="0">${ln.txt}<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${.48+li*.18}s" fill="freeze"/></text>`;
}).join(""):""}
${m.primary?`<rect x="${fv(iso(cx-w/2+22,cy-h/2+52+lines.length*30,d+.6).px)}" y="${fv(iso(cx-w/2+22,cy-h/2+52+lines.length*30,d+.6).py)}" width="5" height="9" fill="${a}">
<animate attributeName="opacity" values="1;0;1" dur="0.9s" repeatCount="indefinite"/>
</rect>`:""}
<line x1="${fv(st.px)}" y1="${fv(st.py)}" x2="${fv(sb.px)}" y2="${fv(sb.py)}" stroke="#172840" stroke-width="3.5" stroke-linecap="round"/>
<line x1="${fv(sl2.px)}" y1="${fv(sl2.py)}" x2="${fv(sr2.px)}" y2="${fv(sr2.py)}" stroke="#172840" stroke-width="5.5" stroke-linecap="round"/>
</g>`;
  });

  /* orbit rings around primary monitor */
  const mc=monitors[0];
  s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.8s" begin="1s" fill="freeze"/>
${orbitRing(mc.cx,mc.cy-20,200,60,a,9,0,0.2)}
${orbitDot(mc.cx,mc.cy-20,200,60,a,9,0,3.5)}
${orbitRing(mc.cx,mc.cy-20,230,72,a,14,2,0.1)}
</g>`;

  s+=badge(22,454,"&lt;2HR","AVG RESPONSE",a);
  s+=`</svg>`;
  return s;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 6 — NETWORK  (3D topology + iso hub + data flood)
═══════════════════════════════════════════════════════════ */
const sceneNetwork = a => {
  const np=[
    {x:450,y:290,r:26,main:true },
    {x:215,y:145,r:16},{x:685,y:128,r:16},
    {x:125,y:374,r:14},{x:765,y:355,r:14},
    {x:305,y:478,r:14},{x:620,y:484,r:14},
    {x:73, y:232,r:11},{x:827,y:226,r:11},
    {x:370,y:78, r:11},{x:532,y:88, r:11},
    {x:164,y:524,r:10},{x:732,y:522,r:10},
  ];
  const conns=[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,7],[1,9],[2,8],[2,10],[3,7],[5,11],[6,12],[4,8]];
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a)}
${bgGrid(a)}
<ellipse cx="450" cy="290" rx="356" ry="248" fill="url(#rg)" filter="url(#gf)"/>
${braces(a)}`;

  /* 3D hub cylinder under core */
  s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.5s" fill="freeze"/>
${isoBox(450,290,60,60,40,T.chrome,a,a,0.7)}
${isoRing(450,290,76,76,52,0.7,a,0.3)}
${isoRing(450,290,92,92,64,0.5,a,0.15)}
</g>`;

  /* connections */
  conns.forEach(([ai,bi],k)=>{
    const na=np[ai],nb=np[bi];
    s+=`<line x1="${na.x}" y1="${na.y}" x2="${nb.x}" y2="${nb.y}" stroke="${a}" stroke-width="0.9" stroke-opacity="0">
<animate attributeName="stroke-opacity" from="0" to="0.22" dur="0.65s" begin="${.16+k*.058}s" fill="freeze"/>
</line>
<circle r="3.5" fill="${a}" fill-opacity="0">
<animateMotion path="M ${na.x} ${na.y} L ${nb.x} ${nb.y} L ${na.x} ${na.y}" dur="${2.3+k*.14}s" begin="${k*.19}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.92;0.92;0" dur="${2.3+k*.14}s" begin="${k*.19}s" repeatCount="indefinite"/>
</circle>
<circle r="7" fill="${a}" fill-opacity="0" filter="url(#gfs)">
<animateMotion path="M ${na.x} ${na.y} L ${nb.x} ${nb.y} L ${na.x} ${na.y}" dur="${2.3+k*.14}s" begin="${k*.19}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.25;0;0" dur="${2.3+k*.14}s" begin="${k*.19}s" repeatCount="indefinite"/>
</circle>`;
  });

  /* nodes */
  np.forEach((n,i)=>{
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${.12+i*.05}s" fill="freeze"/>
${pulse(n.x,n.y,n.r*2,a,i*.19,2.8)}
<circle cx="${n.x}" cy="${n.y}" r="${n.r+2}" fill="${a}" fill-opacity="0.055"/>
<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${T.panel}" stroke="${n.main?a:`${a}78`}" stroke-width="${n.main?2.4:1.2}"/>
<circle cx="${n.x}" cy="${n.y}" r="${n.r*.6}" fill="none" stroke="${a}" stroke-width="0.45" stroke-opacity="0.3"/>
<circle cx="${n.x}" cy="${n.y}" r="${n.r*.38}" fill="${a}" fill-opacity="${n.main?.92:.52}">
${n.main?`<animate attributeName="r" values="${n.r*.38};${n.r*.52};${n.r*.38}" dur="2s" repeatCount="indefinite"/>`:""}
</circle>
${n.main?`<text x="${n.x}" y="${n.y+4}" fill="#dde8f5" font-size="7" font-family="monospace" text-anchor="middle">CORE</text>`:""}
</g>`;
  });

  /* orbit rings around core */
  s+=orbitRing(450,290,80,32,a,6,0,0.3);
  s+=orbitDot(450,290,80,32,a,6,0,4);
  s+=orbitRing(450,290,110,44,a,10,1.5,0.15);

  s+=badge(658,26,"100G","MAX THROUGHPUT",a);
  s+=`</svg>`;
  return s;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 7 — SURVEILLANCE  (camera + 3D iso wall + AI grid)
═══════════════════════════════════════════════════════════ */
const sceneSurveillance = a => {
  const boxes=[{x:180,y:302,w:90,h:120},{x:504,y:334,w:78,h:98},{x:678,y:268,w:66,h:86}];
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a)}
${bgGrid(a)}
<ellipse cx="450" cy="130" rx="352" ry="190" fill="url(#rg)" filter="url(#gf)"/>
${braces(a)}`;

  /* 3D perspective walls */
  s+=`<g opacity="0.06">
<polygon points="0,560 900,560 900,200 0,200" fill="${a}"/>
</g>`;
  s+=isoPlane(450,540,12,4,56,24,0,a,0.07);

  /* iso pillars / architectural elements */
  [{x:120,h:280},{x:780,h:250}].forEach(({x,h},i)=>{
    s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="0.7" dur="0.6s" begin="${.4+i*.15}s" fill="freeze"/>
${isoBox(x,420-h/2,28,28,h,T.unit,a,a,0.8)}
</g>`;
  });

  /* wall mount */
  s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.18s" fill="freeze"/>
<rect x="398" y="14" width="104" height="14" rx="3.5" fill="${T.chrome}" stroke="${a}" stroke-width="0.9" stroke-opacity="0.5"/>
<rect x="432" y="28" width="36" height="40" rx="3" fill="#1d3248"/>
${isoBox(450,22,80,14,12,T.chrome,a,a,0.4)}
</g>`;

  /* camera assembly – sweeps */
  s+=`<g>
<animateTransform attributeName="transform" type="rotate" values="-22 450 62;22 450 62;-22 450 62" dur="5.5s" repeatCount="indefinite" calcMode="ease"/>
<path d="M 464 96 L 102 540 L 828 540 Z" fill="${a}" fill-opacity="0.04" stroke="${a}" stroke-width="0.65" stroke-opacity="0.15"/>
<rect x="334" y="50" width="232" height="86" rx="14" fill="${T.panel}" stroke="${a}" stroke-width="1.6"/>
<circle cx="506" cy="93" r="31" fill="${T.deep}" stroke="${a}" stroke-width="1.4"/>
<circle cx="506" cy="93" r="22" fill="${a}" fill-opacity="0.11"/>
<circle cx="506" cy="93" r="13" fill="${a}" fill-opacity="0.48">
<animate attributeName="r" values="13;17;13" dur="2.2s" repeatCount="indefinite"/>
<animate attributeName="fill-opacity" values="0.44;0.82;0.44" dur="2.2s" repeatCount="indefinite"/>
</circle>
<circle cx="506" cy="93" r="4.8" fill="${a}" fill-opacity="0.96"/>
${[0,1,2].map(i=>`<rect x="${352+i*24}" y="66" width="16" height="9" rx="2.5" fill="${T.chrome}"/>`).join("")}
<circle cx="354" cy="108" r="5.5" fill="#ef4444" fill-opacity="0.55">
<animate attributeName="fill-opacity" values="0.38;0.95;0.38" dur="1.3s" repeatCount="indefinite"/>
</circle>
</g>`;

  /* AI detection boxes */
  boxes.forEach((b,i)=>{
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${.78+i*.2}s" fill="freeze"/>
<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="none" stroke="${a}" stroke-width="1" stroke-dasharray="5 3.5" stroke-opacity="0.36"/>
<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="${a}" fill-opacity="0.025"/>
<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="none" stroke="${a}" stroke-width="1.9" stroke-opacity="0.2">
<animate attributeName="stroke-opacity" values="0.14;0.86;0.14" dur="2.5s" begin="${i*.58}s" repeatCount="indefinite"/>
</rect>
${[[0,0],[1,0],[0,1],[1,1]].map(([fx,fy])=>
`<line x1="${b.x+fx*b.w}" y1="${b.y+fy*b.h}" x2="${b.x+fx*b.w+(fx?-12:12)}" y2="${b.y+fy*b.h}" stroke="${a}" stroke-width="2.4" stroke-opacity="0.78"/>
<line x1="${b.x+fx*b.w}" y1="${b.y+fy*b.h}" x2="${b.x+fx*b.w}" y2="${b.y+fy*b.h+(fy?-12:12)}" stroke="${a}" stroke-width="2.4" stroke-opacity="0.78"/>`).join("")}
<text x="${b.x+2}" y="${b.y-5}" fill="${a}" font-size="7" font-family="monospace" letter-spacing="0.8">DETECT</text>
<text x="${b.x+b.w}" y="${b.y-5}" fill="${a}" font-size="6.5" font-family="monospace" text-anchor="end" opacity="0">
${[94,87,91][i]}%<animate attributeName="opacity" from="0" to="0.65" dur="0.4s" begin="${1.2+i*.22}s" fill="freeze"/>
</text>
${pulse(b.x+b.w/2,b.y+b.h/2,Math.min(b.w,b.h)/2,a,i*.6,3)}
</g>`;
  });

  /* REC badge */
  s+=`<g>
<animate attributeName="opacity" values="0.55;1;0.55" dur="1.4s" repeatCount="indefinite"/>
<rect x="736" y="18" width="120" height="28" rx="3.5" fill="${T.panel}" stroke="#ef4444" stroke-width="0.85"/>
<circle cx="751" cy="32" r="5.5" fill="#ef4444"/>
<text x="768" y="37" fill="#ef4444" font-size="8.5" font-family="monospace" letter-spacing="0.8">&#9679; REC</text>
</g>`;

  s+=badge(22,450,"4K","AI RESOLUTION",a);
  s+=`</svg>`;
  return s;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 8 — TELECOM  (3D tower + signal arcs + data cubes)
═══════════════════════════════════════════════════════════ */
const sceneTelecom = a => {
  const devs=[{x:112,y:170,label:"VOIP"},{x:772,y:188,label:"PBX"},{x:80,y:422,label:"WAN"},{x:804,y:402,label:"SIP"}];
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a)}
${bgGrid(a)}
<ellipse cx="450" cy="205" rx="312" ry="232" fill="url(#rg)" filter="url(#gf)"/>
${braces(a)}`;

  /* 3D tower body stacked iso rings */
  s+=isoBox(450,340,38,38,295,"#0b1e32",a,a,.9);
  s+=isoRing(450,340,56,56,315,0.7,a,0.35);
  for(let i=1;i<=4;i++) s+=isoRing(450,340,38+i*40,38+i*40,295-i*72,0.55,a,0.2-i*.03);

  /* tower antenna */
  s+=`<circle cx="450" cy="14" r="10" fill="${a}">
<animate attributeName="r" values="10;14;10" dur="1.6s" repeatCount="indefinite"/>
</circle>
<line x1="450" y1="14" x2="450" y2="56" stroke="${a}" stroke-width="2" stroke-opacity="0.5"/>`;

  /* 3D platform at bottom */
  s+=isoBox(450,508,162,62,16,T.chrome,a,a,.68);
  s+=isoPlane(450,514,6,2,48,22,0,a,0.08);

  /* signal rings */
  for(let r=1;r<=6;r++) s+=`<circle cx="450" cy="305" r="1" stroke="${a}" stroke-width="1.2" fill="none" opacity="0">
<animate attributeName="r" values="0;${r*86+50}" dur="3.2s" begin="${r*.55}s" repeatCount="indefinite" calcMode="ease"/>
<animate attributeName="opacity" values="0.55;0" dur="3.2s" begin="${r*.55}s" repeatCount="indefinite" calcMode="ease"/>
</circle>`;

  /* endpoint device cubes */
  devs.forEach((dev,i)=>{
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${.64+i*.12}s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -5;0 0" dur="${3.5+i*.4}s" begin="${i*.8}s" repeatCount="indefinite" calcMode="ease"/>
${isoBox(dev.x,dev.y,58,38,18,T.panel,a,a,0.9)}
<text x="${dev.x+(iso(dev.x,dev.y,18.5).px-iso(dev.x,dev.y,0).px)*.0}" y="${dev.y+6}" fill="${a}" font-size="7.5" font-family="monospace" text-anchor="middle" letter-spacing="0.8">${dev.label}</text>
<line x1="${dev.x}" y1="${dev.y}" x2="450" y2="300" stroke="${a}" stroke-width="0.5" stroke-opacity="0.16" stroke-dasharray="5 4"/>
<circle r="3.2" fill="${a}" fill-opacity="0">
<animateMotion path="M ${dev.x} ${dev.y} L 450 300" dur="2.1s" begin="${i*.5}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.88;0" dur="2.1s" begin="${i*.5}s" repeatCount="indefinite"/>
</circle>
<circle r="6" fill="${a}" fill-opacity="0" filter="url(#gfs)">
<animateMotion path="M ${dev.x} ${dev.y} L 450 300" dur="2.1s" begin="${i*.5}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.22;0" dur="2.1s" begin="${i*.5}s" repeatCount="indefinite"/>
</circle>
</g>`;
  });

  /* data wave */
  s+=`<path d="M0 530 C46 512 56 548 102 530 C148 512 158 548 204 530 C250 512 260 548 306 530 C352 512 362 548 408 530 C454 512 464 548 510 530 C556 512 566 548 612 530 C658 512 668 548 714 530 C760 512 770 548 816 530 C848 518 900 530 900 530" stroke="${a}" stroke-width="1.8" fill="none" stroke-opacity="0.36" stroke-dasharray="7 3">
<animate attributeName="stroke-dashoffset" from="0" to="-118" dur="2.2s" repeatCount="indefinite"/>
</path>`;

  s+=badge(22,22,"&lt;20ms","LATENCY",a);
  s+=`</svg>`;
  return s;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 9 — AV  (iso display + speakers + EQ + orbit halo)
═══════════════════════════════════════════════════════════ */
const sceneAv = a => {
  const avTL=iso(450-268+20,225-168+20,24.6),avTR=iso(450+268-20,225-168+20,24.6);
  const avBR=iso(450+268-20,225+168-14,24.6),avBL=iso(450-268+20,225+168-14,24.6);
  const cp=iso(450,225-80,25.3);
  const s1=iso(450,408,12),s2=iso(450,428,0),sl2=iso(382,430,0),sr2=iso(518,430,0);
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
${defs(a)}
${bgGrid(a)}
<ellipse cx="450" cy="248" rx="380" ry="260" fill="url(#rg)" filter="url(#gf)"/>
${braces(a)}`;

  /* shadow glow under display */
  s+=`<ellipse cx="450" cy="400" rx="280" ry="40" fill="${a}" fill-opacity="0.04" filter="url(#gf)"/>`;

  /* extra depth rings behind display */
  s+=isoRing(450,225,560,356,26,0.5,a,0.08);
  s+=isoRing(450,225,590,376,28,0.4,a,0.05);

  /* main display */
  s+=isoBox(450,225,536,336,25,T.panel,a,a,1,a);
  s+=`<polygon points="${fpt([avTL,avTR,avBR,avBL])}" fill="#070818"/>`;

  /* screen label */
  s+=`<text x="${fv(cp.px)}" y="${fv(cp.py)}" fill="${a}" font-size="34" font-family="'Bebas Neue',sans-serif" text-anchor="middle" letter-spacing="5" opacity="0">AV / MEDIA
<animate attributeName="opacity" from="0" to="0.62" dur="0.5s" begin="0.38s" fill="freeze"/>
</text>`;

  /* EQ bars */
  for(let b=0;b<20;b++){
    const maxH=16+b*4.6, bx=450-278+22+b*28, by=225+134;
    const p1=iso(bx,by,24.8),p2=iso(bx,by-maxH,24.8);
    s+=`<line x1="${fv(p1.px)}" y1="${fv(p1.py)}" x2="${fv(p2.px)}" y2="${fv(p2.py)}" stroke="hsl(${216+b*8},78%,62%)" stroke-width="10" stroke-linecap="round" stroke-opacity="0.9">
<animate attributeName="y2" values="${fv(p2.py)};${fv(p2.py-16)};${fv(p2.py)}" dur="${.95+b*.072}s" begin="${b*.052}s" repeatCount="indefinite"/>
<animate attributeName="y1" values="${fv(p1.py)};${fv(p1.py-5)};${fv(p1.py)}" dur="${.95+b*.072}s" begin="${b*.052}s" repeatCount="indefinite"/>
</line>`;
  }

  /* speakers */
  [{cx:48,side:"left"},{cx:762,side:"right"}].forEach(({cx,side})=>{
    const sp=iso(cx,225,19.8);
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.4s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -4;0 0" dur="${3.8+(side==="right"?.5:0)}s" repeatCount="indefinite" calcMode="ease"/>
${isoBox(cx,225,88,256,22,T.panel,a,a,.85)}
${isoRing(cx,225,96,264,24,0.5,a,0.18)}
<circle cx="${fv(sp.px)}" cy="${fv(sp.py-13)}" r="32" fill="#090a1a" stroke="${a}" stroke-width="1.1"/>
<circle cx="${fv(sp.px)}" cy="${fv(sp.py-13)}" r="22" fill="${a}" fill-opacity="0.24">
<animate attributeName="r" values="22;30;22" dur="1.6s" begin="${side==="right"?"0.4s":"0s"}" repeatCount="indefinite"/>
<animate attributeName="fill-opacity" values="0.24;0.07;0.24" dur="1.6s" begin="${side==="right"?"0.4s":"0s"}" repeatCount="indefinite"/>
</circle>
<circle cx="${fv(sp.px)}" cy="${fv(sp.py-13)}" r="9.5" fill="${a}" fill-opacity="0.86"/>
<circle cx="${fv(sp.px)}" cy="${fv(sp.py+32)}" r="14" fill="#090a1a" stroke="${a}" stroke-width="0.9"/>
<circle cx="${fv(sp.px)}" cy="${fv(sp.py+32)}" r="6" fill="${a}" fill-opacity="0.65"/>
${pulse(+fv(sp.px),+fv(sp.py-13),20,a,side==="right"?.4:0,2.2)}
</g>`;
  });

  /* display stand */
  s+=`<line x1="${fv(s1.px)}" y1="${fv(s1.py)}" x2="${fv(s2.px)}" y2="${fv(s2.py)}" stroke="#162638" stroke-width="3.5" stroke-linecap="round"/>
<line x1="${fv(sl2.px)}" y1="${fv(sl2.py)}" x2="${fv(sr2.px)}" y2="${fv(sr2.py)}" stroke="#162638" stroke-width="5.5" stroke-linecap="round"/>`;

  /* floating orbit rings around display */
  s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.8s" begin="0.8s" fill="freeze"/>
${orbitRing(450,225,310,95,a,12,0,0.18)}
${orbitDot(450,225,310,95,a,12,0,4)}
${orbitRing(450,225,340,110,a,18,3,0.08)}
</g>`;

  s+=badge(326,468,"8K","DISPLAY QUALITY",a);
  s+=`</svg>`;
  return s;
};

/* ─────────────────────────────────────────────────────────────
   SCENE MAP + WRAPPER
───────────────────────────────────────────────────────────── */
const BUILDERS = {
  web:sceneWeb, ai:sceneAi, cyber:sceneCyber, server:sceneServer,
  desktop:sceneDesktop, network:sceneNetwork, surveillance:sceneSurveillance,
  telecom:sceneTelecom, av:sceneAv,
};

function SVGScene({ sceneKey, accent }) {
  const html = BUILDERS[sceneKey]?.(accent) ?? "";
  return (
    <div
      style={{ width:"100%", height:"100%", position:"absolute", inset:0 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   SLIDE DATA (content unchanged)
───────────────────────────────────────────────────────────── */
const SLIDES = [
  { id:1, headline:"Custom Websites",     subheadline:"Full-Stack & UX Design",          intro:"High-performance responsive interfaces engineered for speed.\nOptimized to convert digital traffic into measurable revenue.",  cta:{primary:"Initiate Development",secondary:"Technology Stack"  }, accent:"#f97316", tag:"WEB DEV",   scene:"web",          stat:{value:"99%",   label:"Lighthouse Score"} },
  { id:2, headline:"Search Intelligence", subheadline:"Machine Learning & QA",            intro:"Precision tuning for LLMs and enterprise search engines.\nEnsuring data accuracy and reliability in the AI era.",             cta:{primary:"Audit Data",          secondary:"Methodology"       }, accent:"#3b82f6", tag:"AI / ML",   scene:"ai",           stat:{value:"10×",   label:"Search Accuracy" } },
  { id:3, headline:"Cybersecurity",        subheadline:"Security & Defense Architecture", intro:"Real-time threat detection and zero-trust implementation.\nHardening your perimeter with advanced penetration testing.",        cta:{primary:"Deploy Shield",        secondary:"Threat Map"        }, accent:"#ef4444", tag:"SECURITY",  scene:"cyber",        stat:{value:"0-day", label:"Threat Response" } },
  { id:4, headline:"Managed IT",           subheadline:"Systems Operations & Maintenance",intro:"Complete outsourced management of your server infrastructure.\nProactive monitoring so you can focus on scaling.",               cta:{primary:"Consultation",         secondary:"Service Packages"  }, accent:"#10b981", tag:"IT OPS",    scene:"server",       stat:{value:"99.9%", label:"Uptime SLA"      } },
  { id:5, headline:"Desktop Support",      subheadline:"Endpoint & Helpdesk Management",  intro:"Rapid-response resolution for hardware and software issues.\nRemote and on-site support across all enterprise endpoints.",       cta:{primary:"Request Support",      secondary:"Service Level"     }, accent:"#8b5cf6", tag:"SUPPORT",   scene:"desktop",      stat:{value:"<2hr",  label:"Avg Response"    } },
  { id:6, headline:"Structured Cabling",   subheadline:"Infrastructure & Network Layer",  intro:"High-density fiber and copper architectures for 99.9% uptime.\nThe physical backbone for enterprise-grade connectivity.",        cta:{primary:"Specifications",       secondary:"Network Topology"  }, accent:"#06b6d4", tag:"CABLING",   scene:"network",      stat:{value:"100G",  label:"Max Throughput"  } },
  { id:7, headline:"IP Surveillance",      subheadline:"Vision & AI Monitoring",          intro:"AI-powered motion analytics with encrypted remote access.\nEnd-to-end monitoring for high-security environments.",               cta:{primary:"Secure Infrastructure",secondary:"Case Studies"      }, accent:"#eab308", tag:"CCTV / AI", scene:"surveillance", stat:{value:"4K",    label:"AI Resolution"   } },
  { id:8, headline:"Telecom & VoIP",       subheadline:"Unified Communications",          intro:"Low-latency voice and data synchronization for global teams.\nSeamlessly integrated multi-channel communication systems.",         cta:{primary:"Connect Systems",      secondary:"System Audit"      }, accent:"#f43f5e", tag:"VOIP",      scene:"telecom",      stat:{value:"<20ms", label:"Latency"         } },
  { id:9, headline:"Modern AV",            subheadline:"Multimedia & Presentation Tech",  intro:"Smart-room technology and interactive display integration.\nAutomated acoustic environments for modern boardrooms.",              cta:{primary:"Request Quote",        secondary:"Solution Gallery"  }, accent:"#a855f7", tag:"AV / MEDIA",scene:"av",           stat:{value:"8K",    label:"Display Quality" } },
];

const SLIDE_INTERVAL = 7000;

/* ─────────────────────────────────────────────────────────────
   HERO — Framer Motion used ONLY on HTML div/span elements
───────────────────────────────────────────────────────────── */
export default function Hero() {
  const [current,       setCurrent]       = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [progress,      setProgress]      = useState(0);
  const [touchStart,    setTouchStart]    = useState(null);
  const [mousePos,      setMousePos]      = useState({x:.5,y:.5});
  const timerRef=useRef(null),rafRef=useRef(null),startRef=useRef(null),heroRef=useRef(null);

  const goTo=useCallback((idx)=>{
    if(transitioning||idx===current) return;
    setTransitioning(true);
    setTimeout(()=>{ setCurrent(idx); setTransitioning(false); startRef.current=null; },520);
  },[current,transitioning]);

  const handleNext=useCallback(()=>goTo((current+1)%SLIDES.length),[current,goTo]);
  const handlePrev=useCallback(()=>goTo((current-1+SLIDES.length)%SLIDES.length),[current,goTo]);

  useEffect(()=>{
    if(!isAutoPlaying){ setProgress(0); return; }
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

  const manualNav=i=>{ setIsAutoPlaying(false); goTo(i); };
  const scrollTo=(e,id)=>{ e.preventDefault(); document.querySelector(id)?.scrollIntoView({behavior:"smooth"}); };
  const onMouseMove=useCallback(e=>{
    if(!heroRef.current) return;
    const r=heroRef.current.getBoundingClientRect();
    setMousePos({x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height});
  },[]);
  const onTouchStart=e=>setTouchStart(e.touches[0].clientX);
  const onTouchEnd=e=>{
    if(touchStart===null) return;
    const d=touchStart-e.changedTouches[0].clientX;
    if(Math.abs(d)>50){ d>0?handleNext():handlePrev(); setIsAutoPlaying(false); }
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Space+Mono:wght@400;700&display=swap');
        .hD{font-family:'Bebas Neue',sans-serif!important;letter-spacing:.04em;}
        .hB{font-family:'Barlow',sans-serif!important;}
        .hM{font-family:'Space Mono',monospace!important;}
        .hR *{font-family:'Barlow',sans-serif;}
        .hEnt{animation:hEnt .82s cubic-bezier(.16,1,.3,1) both;}
        @keyframes hEnt{from{opacity:0;transform:translateY(26px);}to{opacity:1;transform:translateY(0);}}
        .d1{animation-delay:.04s;}.d2{animation-delay:.13s;}.d3{animation-delay:.22s;}.d4{animation-delay:.32s;}.d5{animation-delay:.42s;}
        .bP{position:relative;overflow:hidden;cursor:pointer;transition:transform .22s cubic-bezier(.16,1,.3,1),box-shadow .22s;}
        .bP::before{content:'';position:absolute;inset:0;background:rgba(255,255,255,.15);transform:translateX(-105%);transition:transform .38s cubic-bezier(.16,1,.3,1);}
        .bP:hover::before{transform:translateX(0);}.bP:hover{transform:translateY(-2px);}.bP:active{transform:translateY(0);}
        .bG{border:1px solid rgba(255,255,255,.17);color:rgba(255,255,255,.65);transition:all .22s;background:rgba(255,255,255,.04);backdrop-filter:blur(10px);}
        .bG:hover{border-color:rgba(255,255,255,.42);color:#fff;background:rgba(255,255,255,.08);transform:translateY(-2px);}
        .nI{transition:all .22s;border-left:2px solid transparent;cursor:pointer;}
        .nI:hover{border-left-color:rgba(255,255,255,.18);background:rgba(255,255,255,.025);}
        .nI.on{border-left-color:var(--ac);}
        .hPng{animation:hPng 1.8s cubic-bezier(0,0,.2,1) infinite;}
        @keyframes hPng{75%,100%{transform:scale(2.7);opacity:0;}}
        .nz{background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");opacity:.026;pointer-events:none;}
        .ns{scrollbar-width:none;}.ns::-webkit-scrollbar{display:none;}
        .sC{background:${T.glass};border:1px solid rgba(255,255,255,.07);backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);}
        @media(min-width:1024px){#home{min-height:640px!important;}}
        @media(max-width:1023px){#home{margin-top:66px!important;height:78svh!important;min-height:440px!important;max-height:680px!important;}}
        @media(max-width:480px){#home{height:74svh!important;min-height:400px!important;max-height:600px!important;}}
      `}</style>

      {/* Noise */}
      <div className="nz absolute inset-0 z-[1] pointer-events-none"/>

      {/* Parallax glow — motion.div on HTML div ✓ */}
      <motion.div className="absolute inset-0 z-0 pointer-events-none"
        animate={{x:px*.35,y:py*.28}} transition={{type:"spring",stiffness:52,damping:26}}
        style={{background:`radial-gradient(ellipse 70% 76% at ${50+px*.38}% ${42+py*.38}%,${sl.accent}28,transparent 60%)`,transition:"background .95s ease"}}/>
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{background:`radial-gradient(ellipse 38% 44% at 14% 86%,${sl.accent}10,transparent 66%)`,transition:"background .95s ease"}}/>
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{backgroundImage:`linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)`,backgroundSize:"80px 80px"}}/>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[.26,.56,.82].map((t,i)=>(
          <div key={i} style={{position:"absolute",top:`${t*100}%`,left:0,right:0,height:"1px",
            background:`linear-gradient(to right,transparent,${sl.accent}${i===1?"18":"0b"} 26%,${sl.accent}${i===1?"18":"0b"} 74%,transparent)`,
            transition:"background .95s"}}/>
        ))}
      </div>

      {/* ═══ MOBILE ═══ */}
      <div className="lg:hidden hR absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={`m${current}`} className="absolute inset-0"
            initial={{opacity:0,x:36}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-36}}
            transition={{duration:.46,ease:[.16,1,.3,1]}}>
            <div className="absolute inset-0"><SVGScene sceneKey={sl.scene} accent={sl.accent}/></div>
            <div className="absolute inset-0" style={{background:"linear-gradient(to bottom,rgba(5,12,24,.3) 0%,rgba(5,12,24,.05) 18%,rgba(5,12,24,.56) 50%,rgba(5,12,24,.94) 76%,#050c18 100%)"}}/>
            <div className="absolute inset-0" style={{background:"linear-gradient(to right,rgba(5,12,24,.42) 0%,transparent 56%)"}}/>
            <div className="absolute inset-x-0 bottom-0 z-10" style={{padding:"0 22px 28px"}}>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full" style={{background:`${sl.accent}1c`,border:`1px solid ${sl.accent}46`}}>
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                  <span className="hPng absolute inline-flex h-full w-full rounded-full" style={{background:sl.accent}}/>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{background:sl.accent}}/>
                </span>
                <span className="hM text-[9px] tracking-[.34em] uppercase" style={{color:sl.accent}}>{sl.tag}</span>
              </div>
              <h1 className="hD mb-2.5" style={{fontSize:"clamp(2rem,10vw,3rem)",lineHeight:.88,color:"#fff"}}>{sl.headline}</h1>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="flex-shrink-0 h-px w-6" style={{background:sl.accent}}/>
                <p className="hB text-[9px] font-light tracking-widest uppercase" style={{color:"rgba(255,255,255,.42)"}}>{sl.subheadline}</p>
              </div>
              <p className="hB leading-snug mb-4 font-light" style={{color:"rgba(255,255,255,.56)",fontSize:".76rem",maxWidth:"35ch",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{sl.intro.replace(/\n/g," ")}</p>
              <div className="flex gap-2.5 mb-4">
                <a href="#contact" onClick={e=>scrollTo(e,"#contact")} className="bP hB flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-[10px] font-semibold tracking-wider uppercase" style={{background:sl.accent,color:"#fff"}}>{sl.cta.primary}<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
                <a href="#services" onClick={e=>scrollTo(e,"#services")} className="bG hB inline-flex items-center justify-center py-2.5 px-3 text-[10px] font-light tracking-wider uppercase whitespace-nowrap">{sl.cta.secondary}</a>
              </div>
              <div className="flex items-center gap-1.5">{SLIDES.map((_,i)=>(<button key={i} onClick={()=>manualNav(i)} className="h-[3px] rounded-full flex-shrink-0" style={{width:i===current?22:5,background:i===current?sl.accent:"rgba(255,255,255,.2)",transition:"all .32s"}}/>))}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ═══ DESKTOP ═══ */}
      <div className="hidden lg:flex hR absolute inset-0" style={{"--ac":sl.accent}}>

        {/* Sidebar */}
        <div className="relative flex flex-col z-20 flex-shrink-0"
          style={{width:275,paddingTop:92,paddingBottom:68,paddingLeft:48,paddingRight:26,
            borderRight:"1px solid rgba(255,255,255,.058)",
            background:`linear-gradient(to right,${T.bg}f8,rgba(5,12,24,.7))`,
            boxShadow:"inset -1px 0 0 rgba(255,255,255,.035)"}}>
          <div className="mb-10">
            <div className="hM text-[8.5px] tracking-[.44em] uppercase mb-3" style={{color:"rgba(255,255,255,.22)"}}>Services</div>
            <motion.div className="h-[2px] w-8 rounded-full" style={{background:sl.accent,transition:"background .55s"}} layoutId="sl"/>
          </div>
          <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto ns">
            {SLIDES.map((s,i)=>(
              <button key={i} onClick={()=>manualNav(i)} className={`nI hB text-left pl-4 py-2.5 pr-2 ${i===current?"on":""}`} style={{"--ac":s.accent,borderLeftColor:i===current?s.accent:undefined}}>
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-light tracking-widest uppercase" style={{color:i===current?"#fff":"rgba(255,255,255,.3)",transition:"color .22s"}}>{s.tag}</span>
                  {i===current&&<span className="hM text-[8.5px]" style={{color:s.accent}}>{String(i+1).padStart(2,"0")}</span>}
                </div>
                {i===current&&<div className="hB text-[12px] font-medium mt-0.5" style={{color:"rgba(255,255,255,.76)"}}>{s.headline}</div>}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2 mt-6 pt-5" style={{borderTop:"1px solid rgba(255,255,255,.062)"}}>
            {[{lbl:"prev",onClick:handlePrev,d:"M7.5 9L4.5 6l3-3"},{lbl:"next",onClick:handleNext,d:"M4.5 3L7.5 6l-3 3"}].map(btn=>(
              <button key={btn.lbl} onClick={btn.onClick} className="w-8 h-8 flex items-center justify-center border transition-all"
                style={{borderColor:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.38)"}}
                onMouseEnter={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="rgba(255,255,255,.28)";}}
                onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,.38)";e.currentTarget.style.borderColor="rgba(255,255,255,.1)";}}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d={btn.d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            ))}
            <button onClick={()=>setIsAutoPlaying(p=>!p)} className="w-8 h-8 flex items-center justify-center border transition-all"
              style={{borderColor:isAutoPlaying?`${sl.accent}52`:"rgba(255,255,255,.1)",color:isAutoPlaying?sl.accent:"rgba(255,255,255,.3)"}}>
              {isAutoPlaying?<svg width="9" height="9" fill="currentColor" viewBox="0 0 10 10"><rect x="1" y="1" width="3" height="8" rx=".5"/><rect x="6" y="1" width="3" height="8" rx=".5"/></svg>:<svg width="9" height="9" fill="currentColor" viewBox="0 0 10 10"><path d="M2 1.5l7 3.5-7 3.5V1.5z"/></svg>}
            </button>
            <div className="relative w-8 h-8 flex items-center justify-center ml-auto">
              <svg width="32" height="32" viewBox="0 0 32 32" style={{position:"absolute",transform:"rotate(-90deg)"}}>
                <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1.5"/>
                <circle cx="16" cy="16" r="13" fill="none" stroke={sl.accent} strokeWidth="1.5"
                  strokeDasharray={`${2*Math.PI*13}`} strokeDashoffset={`${2*Math.PI*13*(1-progress/100)}`}
                  style={{transition:"stroke .55s,stroke-dashoffset .1s"}}/>
              </svg>
              <span className="hM text-[7.5px]" style={{color:sl.accent,position:"relative",zIndex:1}}>{String(current+1).padStart(2,"0")}</span>
            </div>
          </div>
        </div>

        {/* Scene */}
        <div className="relative flex-1 overflow-hidden z-10">
          <AnimatePresence mode="wait">
            <motion.div key={`sc${current}`} className="absolute z-10"
              style={{inset:0,top:"5%",bottom:"calc(52px + 9%)",left:"1.5%",right:"1.5%"}}
              initial={{opacity:0,scale:1.04}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.965}}
              transition={{duration:.56,ease:[.16,1,.3,1]}}>
              <motion.div style={{width:"100%",height:"100%"}}
                animate={{x:px*.44,y:py*.34}} transition={{type:"spring",stiffness:50,damping:24}}>
                <SVGScene sceneKey={sl.scene} accent={sl.accent}/>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 z-20 pointer-events-none" style={{background:"linear-gradient(to right,rgba(5,12,24,.44) 0%,transparent 36%,transparent 55%,rgba(5,12,24,.12) 100%)"}}/>
          <div className="absolute inset-0 z-20 pointer-events-none" style={{background:"linear-gradient(to bottom,rgba(5,12,24,.2) 0%,transparent 18%,transparent 44%,rgba(5,12,24,.96) 100%)"}}/>

          <AnimatePresence mode="wait">
            <motion.div key={`ct${current}`}
              className="absolute bottom-0 left-0 right-0 z-30 flex items-end justify-between"
              style={{padding:"0 62px 146px 62px",gap:44}}
              initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
              transition={{duration:.44}}>
              <div style={{maxWidth:580}}>
                <div className="hEnt d1 flex items-center gap-3 mb-5">
                  <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                    <span className="hPng absolute inline-flex h-full w-full rounded-full" style={{background:sl.accent}}/>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{background:sl.accent}}/>
                  </span>
                  <span className="hM text-[9.5px] tracking-[.46em] uppercase" style={{color:sl.accent}}>{sl.subheadline}</span>
                </div>
                <h1 className="hD hEnt d2 mb-4" style={{fontSize:"clamp(3.2rem,5.4vw,6.4rem)",lineHeight:.86,letterSpacing:".02em",color:"#fff"}}>{sl.headline}</h1>
                <div className="hEnt d3 flex items-center gap-3 mb-4">
                  <div style={{width:44,height:1,background:`linear-gradient(to right,${sl.accent},transparent)`}}/>
                  <span className="hM text-[8px] tracking-[.38em] uppercase" style={{color:"rgba(255,255,255,.26)"}}>{sl.tag}</span>
                </div>
                <p className="hB hEnt d3 font-light leading-relaxed mb-7" style={{fontSize:"clamp(.83rem,1vw,.97rem)",color:"rgba(255,255,255,.58)",maxWidth:"50ch"}}>{sl.intro.replace(/\\n/g," ")}</p>
                <div className="hEnt d4 flex items-center gap-3">
                  <a href="#contact" onClick={e=>scrollTo(e,"#contact")} className="bP hB inline-flex items-center gap-2.5 py-3.5 px-7 text-xs font-semibold tracking-[.17em] uppercase" style={{background:sl.accent,color:"#fff",boxShadow:`0 0 48px ${sl.accent}38`}}>{sl.cta.primary}<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5h8M7.5 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
                  <a href="#services" onClick={e=>scrollTo(e,"#services")} className="bG hB inline-flex items-center gap-2.5 py-3.5 px-7 text-xs font-light tracking-[.17em] uppercase">{sl.cta.secondary}</a>
                </div>
              </div>
              <div className="hEnt d5 flex-shrink-0 text-right">
                <div className="sC inline-block p-5 relative overflow-hidden"
                  style={{boxShadow:`0 0 68px ${sl.accent}18,inset 0 1px 0 rgba(255,255,255,.055)`,border:`1px solid ${sl.accent}24`}}>
                  <div style={{position:"absolute",top:0,right:0,width:36,height:36,borderLeft:`1px solid ${sl.accent}38`,borderBottom:`1px solid ${sl.accent}38`,background:`${sl.accent}07`,clipPath:"polygon(100% 0,100% 100%,0 0)"}}/>
                  <div style={{position:"absolute",bottom:0,left:0,width:24,height:24,borderRight:`1px solid ${sl.accent}1e`,borderTop:`1px solid ${sl.accent}1e`,clipPath:"polygon(0 100%,100% 100%,0 0)"}}/>
                  <div className="hD" style={{fontSize:"clamp(2.2rem,3.6vw,4rem)",lineHeight:1,color:sl.accent}}>{sl.stat.value}</div>
                  <div className="hM text-[8px] tracking-[.3em] uppercase mt-1.5" style={{color:"rgba(255,255,255,.28)"}}>{sl.stat.label}</div>
                  <div className="mt-4 pt-3.5 flex items-center gap-2.5" style={{borderTop:`1px solid ${sl.accent}1e`}}>
                    <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:sl.accent}} animate={{scale:[1,1.58,1],opacity:[.6,1,.6]}} transition={{duration:2.3,repeat:Infinity}}/>
                    <span className="hM text-[8px] tracking-widest uppercase" style={{color:"rgba(255,255,255,.22)"}}>Enterprise Grade</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-6 right-8 z-30 hM text-[8px] tracking-[.5em] uppercase" style={{color:`${sl.accent}38`}}>{sl.scene}_SYS</div>
          <div className="absolute top-6 left-7 z-30 flex items-center gap-2">
            <div style={{width:1,height:22,background:`${sl.accent}3e`}}/>
            <span className="hM text-[8px] tracking-[.4em]" style={{color:`${sl.accent}52`}}>{String(current+1).padStart(2,"0")}&nbsp;/&nbsp;{String(SLIDES.length).padStart(2,"0")}</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 z-40">
        <div className="h-[1px] w-full" style={{background:"rgba(255,255,255,.052)"}}>
          <div className="h-full" style={{width:`${progress}%`,background:sl.accent,boxShadow:`0 0 16px ${sl.accent}`,transition:"none"}}/>
        </div>
        <div className="flex items-center justify-between" style={{paddingLeft:"calc(275px + 50px)",paddingRight:26,height:52,background:"rgba(5,12,24,.97)",backdropFilter:"blur(28px)",borderTop:"1px solid rgba(255,255,255,.044)"}}>
          <div className="flex items-center gap-2.5">
            {SLIDES.map((_,i)=>(<button key={i} onClick={()=>manualNav(i)}><div className="rounded-full" style={{width:i===current?24:5,height:5,background:i===current?sl.accent:"rgba(255,255,255,.16)",boxShadow:i===current?`0 0 10px ${sl.accent}78`:"none",transition:"all .36s cubic-bezier(.16,1,.3,1)"}}/></button>))}
          </div>
          <span className="hM text-[8.5px] tracking-[.44em] uppercase" style={{color:"rgba(255,255,255,.18)"}}>{sl.tag} — {sl.headline}</span>
          <span className="hM text-[10.5px]" style={{color:sl.accent}}>{String(current+1).padStart(2,"0")}<span style={{color:"rgba(255,255,255,.16)"}}> / {String(SLIDES.length).padStart(2,"0")}</span></span>
        </div>
      </div>
    </section>
  );
}