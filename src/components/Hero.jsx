import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────── */
const T = {
  bg:     "#050c18",
  panel:  "#0a1628",
  chrome: "#0f1f38",
  deep:   "#040a14",
  unit:   "#091422",
  glass:  "rgba(10,22,40,0.82)",
};

/* ─────────────────────────────────────────────────────────────
   ISO PROJECTION — pure math, returns {px, py}
───────────────────────────────────────────────────────────── */
const iso  = (x, y, z) => ({ px:(x-y)*Math.cos(Math.PI/6), py:(x+y)*Math.sin(Math.PI/6)-z });
const fv   = (v) => (+v).toFixed(2);
const fpt  = (ps) => ps.map(p=>`${fv(p.px)},${fv(p.py)}`).join(" ");

/* ─────────────────────────────────────────────────────────────
   SVG PRIMITIVES (return strings — never JSX)
   This is the key fix: dangerouslySetInnerHTML means Framer
   Motion's patched React.createElement never touches these
   elements, so cx/cy/r attrs are never corrupted.
───────────────────────────────────────────────────────────── */

const isoBox = (cx,cy,w,h,d,fill,stroke,a,op=1) => {
  const tl=iso(cx-w/2,cy-h/2,d), tr=iso(cx+w/2,cy-h/2,d);
  const br=iso(cx+w/2,cy+h/2,d), bl=iso(cx-w/2,cy+h/2,d);
  const sl0=iso(cx+w/2,cy-h/2,d), sl1=iso(cx+w/2,cy-h/2,0);
  const sl2=iso(cx+w/2,cy+h/2,0), sl3=iso(cx+w/2,cy+h/2,d);
  const fl0=iso(cx-w/2,cy+h/2,d), fl1=iso(cx+w/2,cy+h/2,d);
  const fl2=iso(cx+w/2,cy+h/2,0), fl3=iso(cx-w/2,cy+h/2,0);
  return `<g opacity="${op}">
    <polygon points="${fpt([tl,tr,br,bl])}" fill="${fill}" stroke="${stroke}" stroke-width="0.7" stroke-opacity="0.65"/>
    <polygon points="${fpt([sl0,sl1,sl2,sl3])}" fill="${a}" fill-opacity="0.09" stroke="${stroke}" stroke-width="0.5" stroke-opacity="0.4"/>
    <polygon points="${fpt([fl0,fl1,fl2,fl3])}" fill="${a}" fill-opacity="0.05" stroke="${stroke}" stroke-width="0.5" stroke-opacity="0.28"/>
    <line x1="${fv(tl.px)}" y1="${fv(tl.py)}" x2="${fv(tr.px)}" y2="${fv(tr.py)}" stroke="${a}" stroke-width="1" stroke-opacity="0.42"/>
    <line x1="${fv(tl.px)}" y1="${fv(tl.py)}" x2="${fv(bl.px)}" y2="${fv(bl.py)}" stroke="${a}" stroke-width="0.5" stroke-opacity="0.22"/>
  </g>`;
};

const haloGrid = (a,op=0.06) => `
  <g opacity="${op}">
    ${[0,1,2,3,4,5].map(i=>`<line x1="0" y1="${i*112}" x2="900" y2="${i*112}" stroke="${a}" stroke-width="0.35"/>`).join("")}
    ${[0,1,2,3,4,5,6,7,8].map(i=>`<line x1="${i*112}" y1="0" x2="${i*112}" y2="560" stroke="${a}" stroke-width="0.35"/>`).join("")}
  </g>`;

const glow = (cx,cy,rx,ry,a,op=0.18) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${a}" fill-opacity="${op}" filter="url(#gf)"/>`;

const badge = (tx,ty,val,lbl,a) => `
  <g>
    <animateTransform attributeName="transform" type="translate" values="${tx} ${ty};${tx} ${ty-9};${tx} ${ty}" dur="4s" repeatCount="indefinite" calcMode="ease"/>
    <rect x="0" y="0" width="156" height="70" rx="10" fill="${T.panel}" stroke="${a}" stroke-width="1.3"/>
    <rect x="0" y="0" width="156" height="70" rx="10" fill="${a}" fill-opacity="0.04"/>
    <line x1="156" y1="0" x2="124" y2="0" stroke="${a}" stroke-width="2.2" stroke-opacity="0.55"/>
    <line x1="156" y1="0" x2="156" y2="22" stroke="${a}" stroke-width="2.2" stroke-opacity="0.55"/>
    <text x="78" y="40" fill="${a}" font-size="25" font-family="'Bebas Neue',sans-serif" text-anchor="middle">${val}</text>
    <text x="78" y="58" fill="#44647e" font-size="7" font-family="monospace" text-anchor="middle" letter-spacing="1.8">${lbl}</text>
  </g>`;

const cornerBraces = (a) =>
  [[24,24,1,1],[876,24,-1,1],[24,536,1,-1],[876,536,-1,-1]].map(([x,y,fx,fy])=>
    `<line x1="${x}" y1="${y}" x2="${x+fx*32}" y2="${y}" stroke="${a}" stroke-width="1.6" stroke-opacity="0.5"/>
     <line x1="${x}" y1="${y}" x2="${x}" y2="${y+fy*32}" stroke="${a}" stroke-width="1.6" stroke-opacity="0.5"/>
     <circle cx="${x}" cy="${y}" r="2" fill="${a}" fill-opacity="0.6"/>`
  ).join("");

/* ═══════════════════════════════════════════════════════════
   SCENE 1 — WEB  (browser windows, code, performance badge)
═══════════════════════════════════════════════════════════ */
const sceneWeb = (a) => {
  const wins = [
    {cx:295,cy:215,w:350,h:225,d:20,p:true,  delay:0   },
    {cx:660,cy:170,w:240,h:160,d:14,p:false, delay:0.2 },
    {cx:175,cy:375,w:210,h:148,d:12,p:false, delay:0.42},
  ];
  let s = `<svg viewBox="0 0 900 560" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;position:absolute;inset:0">
<defs>
  <radialGradient id="wg"><stop offset="0%" stop-color="${a}" stop-opacity="0.2"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></radialGradient>
  <filter id="gf"><feGaussianBlur stdDeviation="22"/></filter>
</defs>
${haloGrid(a)}
<ellipse cx="430" cy="280" rx="340" ry="200" fill="url(#wg)" filter="url(#gf)"/>
${cornerBraces(a)}`;

  // platform bases
  for(let i=0;i<4;i++) s+=`<g opacity="0">${isoBox(150+i*160,490,140,26,6,T.chrome,a,a,0.45)}<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${i*0.06}s" fill="freeze"/></g>`;

  wins.forEach((w,wi)=>{
    const {cx,cy,ww=w.w,h,d}=w; const ww2=w.w;
    const chrH = h*0.115;
    const tl=iso(cx-ww2/2,cy-h/2,d), tr=iso(cx+ww2/2,cy-h/2,d);
    const ctB=iso(cx-ww2/2,cy-h/2+chrH,d), ctBr=iso(cx+ww2/2,cy-h/2+chrH,d);
    const pad=12;
    const sc=[iso(cx-ww2/2+pad,cy-h/2+chrH+3,d+.4),iso(cx+ww2/2-pad,cy-h/2+chrH+3,d+.4),
              iso(cx+ww2/2-pad,cy+h/2-pad,d+.4),iso(cx-ww2/2+pad,cy+h/2-pad,d+.4)];
    const sh=iso(cx,cy+h/2+4,0);
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="${w.delay*0.5}s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" values="0 0;0 -${6+wi*3};0 0" dur="${4+wi*.8}s" begin="${w.delay}s" repeatCount="indefinite" calcMode="ease"/>
<ellipse cx="${fv(sh.px)}" cy="${fv(sh.py)}" rx="${ww2*.5}" ry="${ww2*.1}" fill="${a}" fill-opacity="0.045" filter="url(#gf)"/>
${isoBox(cx,cy,ww2,h,d,T.panel,a,a,w.p?1:.78)}
<polygon points="${fpt([tl,tr,ctBr,ctB])}" fill="${T.chrome}"/>
<line x1="${fv(ctB.px)}" y1="${fv(ctB.py)}" x2="${fv(ctBr.px)}" y2="${fv(ctBr.py)}" stroke="${a}" stroke-width="0.4" stroke-opacity="0.28"/>
${["#ef4444","#f59e0b","#22c55e"].map((c,di)=>{const dp=iso(cx-ww2/2+12+di*15,cy-h/2+chrH*.5,d+.5);return `<circle cx="${fv(dp.px)}" cy="${fv(dp.py)}" r="${w.p?5:3.2}" fill="${c}" fill-opacity="0.9"/>`;}).join("")}
${(()=>{const ab1=iso(cx-ww2/2+56,cy-h/2+chrH*.42,d+.5),ab2=iso(cx+ww2/2-14,cy-h/2+chrH*.42,d+.5);return w.p?`<line x1="${fv(ab1.px)}" y1="${fv(ab1.py)}" x2="${fv(ab2.px)}" y2="${fv(ab2.py)}" stroke="${a}" stroke-width="8" stroke-opacity="0.055" stroke-linecap="round"/><line x1="${fv(ab1.px)}" y1="${fv(ab1.py)}" x2="${fv(ab2.px)}" y2="${fv(ab2.py)}" stroke="${a}" stroke-width="0.7" stroke-opacity="0.2" stroke-linecap="round"/>`:"";})()}
<polygon points="${fpt(sc)}" fill="${T.deep}" fill-opacity="0.94"/>
${[0.13,0.28,0.43,0.57,0.70,0.83].map((yr,li)=>{
  const lx=cx-ww2*.37+pad; const lw=w.p?ww2*(.17+(li%4)*.09):ww2*(.13+li*.05);
  const p1=iso(lx,cy-h/2+chrH+h*yr,d+.5),p2=iso(lx+lw,cy-h/2+chrH+h*yr,d+.5);
  const isH=li===0&&w.p,isB=li===5&&w.p;
  return `<line x1="${fv(p1.px)}" y1="${fv(p1.py)}" x2="${fv(p2.px)}" y2="${fv(p2.py)}" stroke="${isB?a:isH?"#dde8f5":a}" stroke-width="${isH?6:isB?9:2.5}" stroke-opacity="${isH?.88:isB?.9:.2}" stroke-linecap="round"/>`;
}).join("")}
</g>`;
  });

  // floating tokens
  ["</div>","const","async","=>","{}","fn()"].forEach((tok,i)=>{
    const tx=80+i*140, ty=510+(i%2)*22;
    s+=`<text x="${tx}" y="${ty}" fill="${a}" font-size="12" font-family="monospace" opacity="0" letter-spacing="-0.5">
${tok}<animate attributeName="opacity" values="0.12;0.32;0.12" dur="${3+i*.4}s" begin="${i*.5}s" repeatCount="indefinite"/>
</text>`;
  });

  // scan line
  s+=`<line x1="0" y1="0" x2="0" y2="560" stroke="${a}" stroke-width="1.5" stroke-opacity="0.1">
<animateTransform attributeName="transform" type="translate" values="-10 0;910 0;-10 0" dur="7s" repeatCount="indefinite" calcMode="linear"/>
</line>`;

  s+=`<g transform="translate(608,46)">${badge(0,0,"99%","LIGHTHOUSE SCORE",a)}</g></svg>`;
  return s;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 2 — AI  (neural network with pulse dots)
═══════════════════════════════════════════════════════════ */
const sceneAi = (a) => {
  const layers=[3,5,6,5,3];
  const nodes=[];
  layers.forEach((cnt,li)=>{
    const gY=480/(cnt+1);
    for(let ni=0;ni<cnt;ni++) nodes.push({li,ni,x:95+li*178,y:gY*(ni+1)+26});
  });
  const edges=nodes.flatMap(n=>nodes.filter(b=>b.li===n.li+1).map(b=>({a:n,b})));

  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
<defs>
  <radialGradient id="aig"><stop offset="0%" stop-color="${a}" stop-opacity="0.15"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></radialGradient>
  <filter id="gf"><feGaussianBlur stdDeviation="24"/></filter>
  <filter id="gfs"><feGaussianBlur stdDeviation="5"/></filter>
</defs>
${haloGrid(a)}
<ellipse cx="450" cy="280" rx="370" ry="245" fill="url(#aig)" filter="url(#gf)"/>
${cornerBraces(a)}`;

  // edges
  edges.forEach(({a:na,b},k)=>{
    s+=`<line x1="${na.x}" y1="${na.y}" x2="${b.x}" y2="${b.y}" stroke="${a}" stroke-width="0.65" stroke-opacity="0">
<animate attributeName="stroke-opacity" from="0" to="0.16" dur="0.55s" begin="${.03+k*.004}s" fill="freeze"/>
</line>`;
  });

  // pulse dots — plain SVG circles with animateMotion (no motion.g)
  edges.slice(0,22).forEach(({a:na,b},k)=>{
    s+=`<circle r="3.5" fill="${a}" fill-opacity="0">
<animateMotion path="M ${na.x} ${na.y} L ${b.x} ${b.y}" dur="1.35s" begin="${k*.13}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;1;1;0" dur="1.35s" begin="${k*.13}s" repeatCount="indefinite"/>
</circle>
<circle r="7" fill="${a}" fill-opacity="0" filter="url(#gfs)">
<animateMotion path="M ${na.x} ${na.y} L ${b.x} ${b.y}" dur="1.35s" begin="${k*.13}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.3;0;0" dur="1.35s" begin="${k*.13}s" repeatCount="indefinite"/>
</circle>`;
  });

  // nodes
  nodes.forEach((n,i)=>{
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${.1+i*.02}s" fill="freeze"/>
<circle cx="${n.x}" cy="${n.y}" r="24" fill="none" stroke="${a}" stroke-width="0.7" opacity="0">
<animate attributeName="opacity" values="0.28;0;0.28" dur="3s" begin="${i*.12}s" repeatCount="indefinite"/>
<animate attributeName="r" values="24;46;24" dur="3s" begin="${i*.12}s" repeatCount="indefinite"/>
</circle>
<circle cx="${n.x}" cy="${n.y}" r="19" fill="${T.panel}" stroke="${a}" stroke-width="1.4"/>
<circle cx="${n.x}" cy="${n.y}" r="12" fill="none" stroke="${a}" stroke-width="0.4" stroke-opacity="0.3"/>
<circle cx="${n.x}" cy="${n.y}" r="6" fill="${a}">
<animate attributeName="opacity" values="0.6;1;0.6" dur="${2+i*.09}s" begin="${i*.1}s" repeatCount="indefinite"/>
</circle>
<circle cx="${n.x}" cy="${n.y}" r="2.2" fill="${T.deep}"/>
</g>`;
  });

  ["INPUT","H1","H2","H3","OUTPUT"].forEach((l,i)=>{
    s+=`<text x="${95+i*178}" y="546" fill="#364d60" font-size="7.5" font-family="monospace" text-anchor="middle" opacity="0" letter-spacing="1.5">
${l}<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${1+i*.07}s" fill="freeze"/>
</text>`;
  });

  s+=`<path d="M0 506 C46 490 56 522 112 506 C168 490 178 522 224 506 C280 490 290 522 346 506 C402 490 412 522 468 506 C524 490 534 522 590 506 C646 490 656 522 712 506 C768 490 778 522 834 506 C868 498 900 506 900 506" stroke="${a}" stroke-width="1.4" fill="none" stroke-opacity="0.28" stroke-dasharray="8 4">
<animate attributeName="stroke-dashoffset" from="0" to="-200" dur="2.8s" repeatCount="indefinite"/>
</path>
<g transform="translate(704,28)">${badge(0,0,"10×","SEARCH ACCURACY","#22c55e")}</g></svg>`;
  return s;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 3 — CYBER  (shield, radar, threat nodes)
═══════════════════════════════════════════════════════════ */
const sceneCyber = (a) => {
  const threats=[{x:108,y:88},{x:782,y:130},{x:88,y:448},{x:798,y:415},{x:450,y:510}];
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
<defs>
  <radialGradient id="cyg"><stop offset="0%" stop-color="${a}" stop-opacity="0.22"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></radialGradient>
  <filter id="gf"><feGaussianBlur stdDeviation="22"/></filter>
  <filter id="gfs"><feGaussianBlur stdDeviation="6"/></filter>
</defs>
${haloGrid(a)}
<ellipse cx="450" cy="270" rx="285" ry="215" fill="url(#cyg)" filter="url(#gf)"/>
${cornerBraces(a)}`;

  // radar rings
  for(let r=1;r<=5;r++) s+=`<circle cx="450" cy="270" r="${r*70}" stroke="${a}" stroke-width="0.6" stroke-opacity="${.055+r*.024}" stroke-dasharray="6 5" fill="none" opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.7s" begin="${r*.07}s" fill="freeze"/>
</circle>`;

  // crosshairs
  s+=`<line x1="450" y1="28" x2="450" y2="512" stroke="${a}" stroke-width="0.4" stroke-opacity="0.09"/>
<line x1="108" y1="270" x2="792" y2="270" stroke="${a}" stroke-width="0.4" stroke-opacity="0.09"/>`;

  // sweep arm
  s+=`<g>
<line x1="450" y1="270" x2="450" y2="12" stroke="${a}" stroke-width="1.5" stroke-opacity="0.6"/>
<path d="M450 270 L450 12 A258 258 0 0 1 508 18 Z" fill="${a}" fill-opacity="0.08"/>
<animateTransform attributeName="transform" type="rotate" from="0 450 270" to="360 450 270" dur="5s" repeatCount="indefinite"/>
</g>`;

  // shield body
  s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.7s" begin="0.28s" fill="freeze"/>
<path d="M460 68 L556 124 L556 252 Q556 386 460 436 Q364 386 364 252 L364 124 Z" fill="${a}" fill-opacity="0.05" transform="translate(8,12)" filter="url(#gfs)"/>
<path d="M450 62 L546 118 L546 246 Q546 380 450 428 Q354 380 354 246 L354 118 Z" fill="${T.panel}" stroke="${a}" stroke-width="2.4" stroke-opacity="0.9"/>
<path d="M450 84 L528 132 L528 244 Q528 354 450 396 Q372 354 372 244 L372 132 Z" fill="${a}" fill-opacity="0.065"/>
<rect x="422" y="226" width="56" height="44" rx="6" fill="${a}" fill-opacity="0.9"/>
<path d="M432 226 Q432 196 450 196 Q468 196 468 226" stroke="${a}" stroke-width="7" fill="none" stroke-linecap="round"/>
<circle cx="450" cy="250" r="7" fill="${T.deep}"/>
<rect x="448" y="250" width="4" height="7" rx="1" fill="${T.deep}"/>
<path d="M450 62 L546 118 L546 246 Q546 380 450 428 Q354 380 354 246 L354 118 Z" fill="none" stroke="${a}" stroke-width="1.6" stroke-opacity="0.42">
<animate attributeName="stroke-opacity" values="0.28;0.9;0.28" dur="2.2s" repeatCount="indefinite"/>
</path>
</g>`;

  // threat nodes
  threats.forEach((n,i)=>{
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${.85+i*.11}s" fill="freeze"/>
<circle cx="${n.x}" cy="${n.y}" r="11" fill="none" stroke="#ef4444" stroke-width="0.9" opacity="0">
<animate attributeName="opacity" values="0.7;0;0.7" dur="2.4s" begin="${i*.46}s" repeatCount="indefinite"/>
<animate attributeName="r" values="11;28;11" dur="2.4s" begin="${i*.46}s" repeatCount="indefinite"/>
</circle>
<circle r="3" fill="#ef4444" fill-opacity="0">
<animateMotion path="M ${n.x} ${n.y} L 450 246" dur="${2.2+i*.18}s" begin="${i*.5}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.8;0" dur="${2.2+i*.18}s" begin="${i*.5}s" repeatCount="indefinite"/>
</circle>
<circle cx="${n.x}" cy="${n.y}" r="13" fill="${T.panel}" stroke="#ef4444" stroke-width="1.4"/>
<text x="${n.x}" y="${n.y+4.5}" fill="#ef4444" font-size="9" font-family="monospace" text-anchor="middle">&#10005;</text>
<line x1="${n.x}" y1="${n.y}" x2="450" y2="246" stroke="#ef4444" stroke-width="0.65" stroke-opacity="0.18" stroke-dasharray="5 4"/>
</g>`;
  });

  // scan bar
  s+=`<rect x="0" y="0" width="900" height="2.5" fill="${a}" fill-opacity="0.12">
<animateTransform attributeName="transform" type="translate" values="0 0;0 560;0 0" dur="4.5s" repeatCount="indefinite" calcMode="linear"/>
</rect>
<g transform="translate(22,22)">${badge(0,0,"0-DAY","THREAT RESPONSE",a)}</g></svg>`;
  return s;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 4 — SERVER  (rack enclosure, units, cables)
═══════════════════════════════════════════════════════════ */
const sceneServer = (a) => {
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
<defs>
  <radialGradient id="srg"><stop offset="0%" stop-color="${a}" stop-opacity="0.18"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></radialGradient>
  <filter id="gf"><feGaussianBlur stdDeviation="20"/></filter>
</defs>
${haloGrid(a)}
<ellipse cx="385" cy="300" rx="308" ry="228" fill="url(#srg)" filter="url(#gf)"/>
${cornerBraces(a)}
<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.5s" fill="freeze"/>
<polygon points="145,72 595,72 655,34 200,34" fill="#0e1e34" stroke="${a}" stroke-width="0.8" stroke-opacity="0.48"/>
<polygon points="595,72 655,34 655,492 595,530" fill="#07121f" stroke="${a}" stroke-width="0.8" stroke-opacity="0.3"/>
<polygon points="145,72 595,72 595,530 145,530" fill="${T.unit}"/>
<polygon points="145,72 595,72 595,530 145,530" fill="none" stroke="${a}" stroke-width="0.8" stroke-opacity="0.25"/>
<line x1="145" y1="72" x2="595" y2="72" stroke="${a}" stroke-width="1.1" stroke-opacity="0.48"/>
<line x1="595" y1="72" x2="655" y2="34" stroke="${a}" stroke-width="0.8" stroke-opacity="0.28"/>
</g>`;

  for(let i=0;i<13;i++){
    const uy=86+i*34, busy=i%3===1, idle=i===6;
    const ledC=idle?"#1b2d45":busy?"#f59e0b":a;
    const bW=[55,72,46,82,60,76,48,70,77,56,64,71,67][i]*2.1;
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${.26+i*.05}s" fill="freeze"/>
<rect x="153" y="${uy}" width="434" height="28" rx="2" fill="#0a1926"/>
<rect x="153" y="${uy}" width="434" height="1" fill="${a}" fill-opacity="0.1"/>
<circle cx="170" cy="${uy+14}" r="4.5" fill="${ledC}">
${!idle?`<animate attributeName="opacity" values="0.4;1;0.4" dur="${.9+i*.1}s" begin="${i*.12}s" repeatCount="indefinite"/>`:""}
</circle>
${Array.from({length:10},(_,b)=>{const bh=4+(b*2+i)%14;return `<rect x="${192+b*14}" y="${uy+28-7-bh}" width="10" height="${bh}" rx="1.5" fill="${a}" fill-opacity="0.62">
<animate attributeName="height" values="${bh};${bh+6};${bh}" dur="${.8+b*.11}s" begin="${i*.065+b*.09}s" repeatCount="indefinite"/>
<animate attributeName="y" values="${uy+28-7-bh};${uy+28-13-bh};${uy+28-7-bh}" dur="${.8+b*.11}s" begin="${i*.065+b*.09}s" repeatCount="indefinite"/>
</rect>`;}).join("")}
<rect x="338" y="${uy+10}" width="235" height="9" rx="2.5" fill="${T.deep}"/>
<rect x="338" y="${uy+10}" width="${bW}" height="9" rx="2.5" fill="${a}" fill-opacity="0.68">
<animate attributeName="width" values="${bW};${Math.min(bW+32,235)};${bW}" dur="${3.2+i*.34}s" repeatCount="indefinite"/>
</rect>
</g>`;
  }

  for(let i=0;i<13;i++) s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${.52+i*.04}s" fill="freeze"/>
<rect x="579" y="${86+i*34+5}" width="34" height="20" rx="2" fill="${T.deep}" stroke="${a}" stroke-width="0.4" stroke-opacity="0.28"/>
<circle cx="596" cy="${86+i*34+15}" r="4" fill="${a}" fill-opacity="0.52">
<animate attributeName="opacity" values="0.32;0.88;0.32" dur="1.5s" begin="${i*.14}s" repeatCount="indefinite"/>
</circle>
</g>`;

  [145,196,255,315,375].forEach((y,i)=>s+=`<path d="M 618 ${y} C 668 ${y} 676 ${y+22} 710 ${y+12}" stroke="${a}" stroke-width="1" stroke-opacity="0" fill="none">
<animate attributeName="stroke-opacity" from="0" to="0.38" dur="0.6s" begin="${.82+i*.09}s" fill="freeze"/>
</path>`);

  s+=`<g transform="translate(718,396)">${badge(0,0,"99.9%","UPTIME SLA",a)}</g></svg>`;
  return s;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 5 — DESKTOP  (monitors, terminal, endpoints)
═══════════════════════════════════════════════════════════ */
const sceneDesktop = (a) => {
  const monitors=[
    {cx:292,cy:210,w:390,h:248,d:24,primary:true },
    {cx:665,cy:170,w:265,h:176,d:17,primary:false},
    {cx:158,cy:382,w:206,h:148,d:13,primary:false},
  ];
  const lines=[
    {txt:"> System scan complete",   col:a          },
    {txt:"> 0 threats detected",     col:"#22c55e"  },
    {txt:"> Patch KB5034441 applied",col:"#4a7a9a"  },
    {txt:"> All 48 endpoints OK",    col:"#4a7a9a"  },
    {txt:"> Remote session active_", col:a          },
  ];
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
<defs>
  <radialGradient id="dg"><stop offset="0%" stop-color="${a}" stop-opacity="0.15"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></radialGradient>
  <filter id="gf"><feGaussianBlur stdDeviation="22"/></filter>
</defs>
${haloGrid(a)}
<ellipse cx="400" cy="285" rx="325" ry="225" fill="url(#dg)" filter="url(#gf)"/>
${cornerBraces(a)}`;

  monitors.forEach((m,mi)=>{
    const{cx,cy,w,h,d}=m; const pad=14,chrH=h*.105;
    const scr=[iso(cx-w/2+pad,cy-h/2+pad,d+.4),iso(cx+w/2-pad,cy-h/2+pad,d+.4),
               iso(cx+w/2-pad,cy+h/2-12,d+.4),iso(cx-w/2+pad,cy+h/2-12,d+.4)];
    const chr=[iso(cx-w/2+pad,cy-h/2+pad,d+.4),iso(cx+w/2-pad,cy-h/2+pad,d+.4),
               iso(cx+w/2-pad,cy-h/2+pad+chrH,d+.4),iso(cx-w/2+pad,cy-h/2+pad+chrH,d+.4)];
    const st=iso(cx,cy+h/2+12,d/2),sb=iso(cx,cy+h/2+34,0);
    const sl=iso(cx-w*.23,cy+h/2+36,0),sr=iso(cx+w*.23,cy+h/2+36,0);
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.6s" begin="${mi*.14}s" fill="freeze"/>
${isoBox(cx,cy,w,h,d,T.deep,m.primary?a:"#223850",a,m.primary?1:.72)}
<polygon points="${fpt(scr)}" fill="#040b16" opacity="0.96"/>
<polygon points="${fpt(chr)}" fill="${T.chrome}" opacity="0.92"/>
${m.primary?["#ef4444","#f59e0b","#22c55e"].map((c,di)=>{const dp=iso(cx-w/2+22+di*16,cy-h/2+22,d+.5);return `<circle cx="${fv(dp.px)}" cy="${fv(dp.py)}" r="4.5" fill="${c}"/>`;}).join(""):""}
${m.primary?lines.map((ln,li)=>{const lp=iso(cx-w/2+22,cy-h/2+52+li*30,d+.6);return `<text x="${fv(lp.px)}" y="${fv(lp.py)}" fill="${ln.col}" font-size="7.8" font-family="monospace" opacity="0">${ln.txt}<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${.48+li*.18}s" fill="freeze"/></text>`;}).join(""):""}
<line x1="${fv(st.px)}" y1="${fv(st.py)}" x2="${fv(sb.px)}" y2="${fv(sb.py)}" stroke="#172840" stroke-width="3.5" stroke-linecap="round"/>
<line x1="${fv(sl.px)}" y1="${fv(sl.py)}" x2="${fv(sr.px)}" y2="${fv(sr.py)}" stroke="#172840" stroke-width="5.5" stroke-linecap="round"/>
</g>`;
  });

  s+=`<g transform="translate(24,456)">${badge(0,0,"&lt;2HR","AVG RESPONSE",a)}</g></svg>`;
  return s;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 6 — NETWORK  (topology nodes with data pulses)
═══════════════════════════════════════════════════════════ */
const sceneNetwork = (a) => {
  const np=[
    {x:450,y:290,r:24,main:true },
    {x:215,y:145,r:15},{x:685,y:128,r:15},
    {x:125,y:374,r:13},{x:765,y:355,r:13},
    {x:305,y:478,r:13},{x:620,y:484,r:13},
    {x:73, y:232,r:10},{x:827,y:226,r:10},
    {x:370,y:78, r:10},{x:532,y:88, r:10},
    {x:164,y:524,r:9 },{x:732,y:522,r:9 },
  ];
  const conns=[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,7],[1,9],[2,8],[2,10],[3,7],[5,11],[6,12],[4,8]];
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
<defs>
  <radialGradient id="ng"><stop offset="0%" stop-color="${a}" stop-opacity="0.18"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></radialGradient>
  <filter id="gf"><feGaussianBlur stdDeviation="24"/></filter>
  <filter id="gfs"><feGaussianBlur stdDeviation="5"/></filter>
</defs>
${haloGrid(a)}
<ellipse cx="450" cy="290" rx="350" ry="244" fill="url(#ng)" filter="url(#gf)"/>
${cornerBraces(a)}`;

  conns.forEach(([ai,bi],k)=>{
    const na=np[ai],nb=np[bi];
    s+=`<line x1="${na.x}" y1="${na.y}" x2="${nb.x}" y2="${nb.y}" stroke="${a}" stroke-width="0.85" stroke-opacity="0">
<animate attributeName="stroke-opacity" from="0" to="0.22" dur="0.65s" begin="${.16+k*.058}s" fill="freeze"/>
</line>
<circle r="3.5" fill="${a}" fill-opacity="0">
<animateMotion path="M ${na.x} ${na.y} L ${nb.x} ${nb.y} L ${na.x} ${na.y}" dur="${2.3+k*.14}s" begin="${k*.19}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.9;0.9;0" dur="${2.3+k*.14}s" begin="${k*.19}s" repeatCount="indefinite"/>
</circle>
<circle r="7" fill="${a}" fill-opacity="0" filter="url(#gfs)">
<animateMotion path="M ${na.x} ${na.y} L ${nb.x} ${nb.y} L ${na.x} ${na.y}" dur="${2.3+k*.14}s" begin="${k*.19}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.25;0;0" dur="${2.3+k*.14}s" begin="${k*.19}s" repeatCount="indefinite"/>
</circle>`;
  });

  np.forEach((n,i)=>{
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${.12+i*.05}s" fill="freeze"/>
<circle cx="${n.x}" cy="${n.y}" r="${n.r*2}" fill="${a}" fill-opacity="0">
<animate attributeName="fill-opacity" values="0.04;0;0.04" dur="2.8s" begin="${i*.19}s" repeatCount="indefinite"/>
<animate attributeName="r" values="${n.r*2};${n.r*3.2};${n.r*2}" dur="2.8s" begin="${i*.19}s" repeatCount="indefinite"/>
</circle>
<circle cx="${n.x}" cy="${n.y}" r="${n.r+2}" fill="${a}" fill-opacity="0.055"/>
<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${T.panel}" stroke="${n.main?a:`${a}78`}" stroke-width="${n.main?2.2:1.2}"/>
<circle cx="${n.x}" cy="${n.y}" r="${n.r*.6}" fill="none" stroke="${a}" stroke-width="0.4" stroke-opacity="0.28"/>
<circle cx="${n.x}" cy="${n.y}" r="${n.r*.36}" fill="${a}" fill-opacity="${n.main?.9:.5}"/>
${n.main?`<text x="${n.x}" y="${n.y+4}" fill="#dde8f5" font-size="7" font-family="monospace" text-anchor="middle">CORE</text>`:""}
</g>`;
  });

  s+=`<g transform="translate(660,26)">${badge(0,0,"100G","MAX THROUGHPUT",a)}</g></svg>`;
  return s;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 7 — SURVEILLANCE  (camera, sweep, detection boxes)
═══════════════════════════════════════════════════════════ */
const sceneSurveillance = (a) => {
  const boxes=[{x:182,y:305,w:88,h:118},{x:506,y:336,w:76,h:96},{x:680,y:270,w:64,h:84}];
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
<defs>
  <radialGradient id="sg"><stop offset="0%" stop-color="${a}" stop-opacity="0.2"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></radialGradient>
  <filter id="gf"><feGaussianBlur stdDeviation="20"/></filter>
</defs>
${haloGrid(a)}
<ellipse cx="450" cy="125" rx="348" ry="185" fill="url(#sg)" filter="url(#gf)"/>
${cornerBraces(a)}
<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.18s" fill="freeze"/>
<rect x="400" y="15" width="100" height="13" rx="3" fill="${T.chrome}" stroke="${a}" stroke-width="0.8" stroke-opacity="0.48"/>
<rect x="434" y="28" width="32" height="38" rx="2.5" fill="#1d3248"/>
</g>
<g>
<animateTransform attributeName="transform" type="rotate" values="-22 450 62;22 450 62;-22 450 62" dur="5.5s" repeatCount="indefinite" calcMode="ease"/>
<path d="M 462 94 L 105 536 L 825 536 Z" fill="${a}" fill-opacity="0.042" stroke="${a}" stroke-width="0.65" stroke-opacity="0.16"/>
<rect x="336" y="52" width="228" height="84" rx="14" fill="${T.panel}" stroke="${a}" stroke-width="1.55"/>
<circle cx="504" cy="94" r="30" fill="${T.deep}" stroke="${a}" stroke-width="1.3"/>
<circle cx="504" cy="94" r="21" fill="${a}" fill-opacity="0.11"/>
<circle cx="504" cy="94" r="12" fill="${a}" fill-opacity="0.48">
<animate attributeName="r" values="12;16;12" dur="2.2s" repeatCount="indefinite"/>
<animate attributeName="fill-opacity" values="0.44;0.78;0.44" dur="2.2s" repeatCount="indefinite"/>
</circle>
<circle cx="504" cy="94" r="4.5" fill="${a}" fill-opacity="0.95"/>
${[0,1,2].map(i=>`<rect x="${352+i*24}" y="68" width="15" height="9" rx="2.5" fill="${T.chrome}"/>`).join("")}
<circle cx="356" cy="107" r="5" fill="#ef4444" fill-opacity="0.55">
<animate attributeName="fill-opacity" values="0.38;0.92;0.38" dur="1.3s" repeatCount="indefinite"/>
</circle>
</g>`;

  boxes.forEach((b,i)=>{
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${.78+i*.2}s" fill="freeze"/>
<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="none" stroke="${a}" stroke-width="1" stroke-dasharray="5 3.5" stroke-opacity="0.36"/>
<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="none" stroke="${a}" stroke-width="1.8" stroke-opacity="0.2">
<animate attributeName="stroke-opacity" values="0.15;0.82;0.15" dur="2.5s" begin="${i*.58}s" repeatCount="indefinite"/>
</rect>
${[[0,0],[1,0],[0,1],[1,1]].map(([fx,fy])=>`<line x1="${b.x+fx*b.w}" y1="${b.y+fy*b.h}" x2="${b.x+fx*b.w+(fx?-10:10)}" y2="${b.y+fy*b.h}" stroke="${a}" stroke-width="2.2" stroke-opacity="0.72"/>
<line x1="${b.x+fx*b.w}" y1="${b.y+fy*b.h}" x2="${b.x+fx*b.w}" y2="${b.y+fy*b.h+(fy?-10:10)}" stroke="${a}" stroke-width="2.2" stroke-opacity="0.72"/>`).join("")}
<text x="${b.x+2}" y="${b.y-5}" fill="${a}" font-size="7" font-family="monospace" letter-spacing="0.8">DETECT</text>
<text x="${b.x+b.w}" y="${b.y-5}" fill="${a}" font-size="6.5" font-family="monospace" text-anchor="end" opacity="0">
${[94,87,91][i]}%<animate attributeName="opacity" from="0" to="0.65" dur="0.4s" begin="${1.2+i*.22}s" fill="freeze"/>
</text>
</g>`;
  });

  s+=`<g>
<animate attributeName="opacity" values="0.55;1;0.55" dur="1.4s" repeatCount="indefinite"/>
<rect x="738" y="19" width="118" height="28" rx="3.5" fill="${T.panel}" stroke="#ef4444" stroke-width="0.85"/>
<circle cx="753" cy="33" r="5.5" fill="#ef4444"/>
<text x="770" y="38" fill="#ef4444" font-size="8.5" font-family="monospace" letter-spacing="0.8">&#9679; REC</text>
</g>
<g transform="translate(22,454)">${badge(0,0,"4K","AI RESOLUTION",a)}</g></svg>`;
  return s;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 8 — TELECOM  (tower, signal rings, VOIP endpoints)
═══════════════════════════════════════════════════════════ */
const sceneTelecom = (a) => {
  const devs=[{x:114,y:172,label:"VOIP"},{x:770,y:190,label:"PBX"},{x:82,y:420,label:"WAN"},{x:802,y:400,label:"SIP"}];
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
<defs>
  <radialGradient id="tg"><stop offset="0%" stop-color="${a}" stop-opacity="0.2"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></radialGradient>
  <filter id="gf"><feGaussianBlur stdDeviation="22"/></filter>
  <filter id="gfs"><feGaussianBlur stdDeviation="5"/></filter>
</defs>
${haloGrid(a)}
<ellipse cx="450" cy="202" rx="308" ry="228" fill="url(#tg)" filter="url(#gf)"/>
${cornerBraces(a)}
${isoBox(450,340,34,34,288,"#0b1e32",a,a,.88)}
${[1,2,3,4].map(i=>isoBox(450,340,34+i*38,34+i*38,288-i*70,"none",a,a,.22-i*.04)).join("")}
<circle cx="450" cy="15" r="9" fill="${a}">
<animate attributeName="r" values="9;13;9" dur="1.6s" repeatCount="indefinite"/>
</circle>
<line x1="450" y1="15" x2="450" y2="54" stroke="${a}" stroke-width="2" stroke-opacity="0.48"/>
${[1,2,3,4,5].map(r=>`<circle cx="450" cy="300" r="1" stroke="${a}" stroke-width="1.1" fill="none" opacity="0">
<animate attributeName="r" values="0;${r*84+52}" dur="3s" begin="${r*.55}s" repeatCount="indefinite" calcMode="ease"/>
<animate attributeName="opacity" values="0.52;0" dur="3s" begin="${r*.55}s" repeatCount="indefinite" calcMode="ease"/>
</circle>`).join("")}
${isoBox(450,505,152,58,14,T.chrome,a,a,.64)}`;

  devs.forEach((dev,i)=>{
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${.66+i*.12}s" fill="freeze"/>
<rect x="${dev.x-34}" y="${dev.y-18}" width="68" height="36" rx="5.5" fill="${T.panel}" stroke="${a}" stroke-width="0.85" stroke-opacity="0.58"/>
<text x="${dev.x}" y="${dev.y+6}" fill="${a}" font-size="7.5" font-family="monospace" text-anchor="middle" letter-spacing="0.8">${dev.label}</text>
<line x1="${dev.x}" y1="${dev.y}" x2="450" y2="300" stroke="${a}" stroke-width="0.5" stroke-opacity="0.16" stroke-dasharray="5 4"/>
<circle r="3" fill="${a}" fill-opacity="0">
<animateMotion path="M ${dev.x} ${dev.y} L 450 300" dur="2.1s" begin="${i*.5}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.85;0" dur="2.1s" begin="${i*.5}s" repeatCount="indefinite"/>
</circle>
<circle r="6" fill="${a}" fill-opacity="0" filter="url(#gfs)">
<animateMotion path="M ${dev.x} ${dev.y} L 450 300" dur="2.1s" begin="${i*.5}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.22;0" dur="2.1s" begin="${i*.5}s" repeatCount="indefinite"/>
</circle>
</g>`;
  });

  s+=`<path d="M0 530 C46 512 56 548 102 530 C148 512 158 548 204 530 C250 512 260 548 306 530 C352 512 362 548 408 530 C454 512 464 548 510 530 C556 512 566 548 612 530 C658 512 668 548 714 530 C760 512 770 548 816 530 C848 518 900 530 900 530" stroke="${a}" stroke-width="1.7" fill="none" stroke-opacity="0.36" stroke-dasharray="7 3">
<animate attributeName="stroke-dashoffset" from="0" to="-118" dur="2.2s" repeatCount="indefinite"/>
</path>
<g transform="translate(22,24)">${badge(0,0,"&lt;20ms","LATENCY",a)}</g></svg>`;
  return s;
};

/* ═══════════════════════════════════════════════════════════
   SCENE 9 — AV  (display unit, speakers, EQ bars)
═══════════════════════════════════════════════════════════ */
const sceneAv = (a) => {
  const avTL=iso(450-265+20,225-165+20,24.5),avTR=iso(450+265-20,225-165+20,24.5);
  const avBR=iso(450+265-20,225+165-14,24.5),avBL=iso(450-265+20,225+165-14,24.5);
  const cp=iso(450,225-78,25.2);
  const s1=iso(450,406,12),s2=iso(450,426,0),sl=iso(384,428,0),sr=iso(516,428,0);
  let s=`<svg viewBox="0 0 900 560" fill="none" style="width:100%;height:100%;position:absolute;inset:0">
<defs>
  <radialGradient id="ag"><stop offset="0%" stop-color="${a}" stop-opacity="0.2"/><stop offset="100%" stop-color="${a}" stop-opacity="0"/></radialGradient>
  <filter id="gf"><feGaussianBlur stdDeviation="22"/></filter>
</defs>
${haloGrid(a)}
<ellipse cx="450" cy="246" rx="375" ry="256" fill="url(#ag)" filter="url(#gf)"/>
${cornerBraces(a)}
${isoBox(450,225,532,332,24,T.panel,a,a,1)}
<polygon points="${fpt([avTL,avTR,avBR,avBL])}" fill="#070818"/>
<text x="${fv(cp.px)}" y="${fv(cp.py)}" fill="${a}" font-size="33" font-family="'Bebas Neue',sans-serif" text-anchor="middle" letter-spacing="5" opacity="0">AV / MEDIA
<animate attributeName="opacity" from="0" to="0.6" dur="0.5s" begin="0.38s" fill="freeze"/>
</text>`;

  // EQ bars
  for(let b=0;b<18;b++){
    const maxH=18+b*4.8,bx=450-270+22+b*29,by=225+130;
    const p1=iso(bx,by,24.6),p2=iso(bx,by-maxH,24.6);
    s+=`<line x1="${fv(p1.px)}" y1="${fv(p1.py)}" x2="${fv(p2.px)}" y2="${fv(p2.py)}" stroke="hsl(${218+b*8},78%,62%)" stroke-width="11" stroke-linecap="round" stroke-opacity="0.88">
<animate attributeName="y2" values="${fv(p2.py)};${fv(p2.py-13)};${fv(p2.py)}" dur="${.95+b*.075}s" begin="${b*.055}s" repeatCount="indefinite"/>
<animate attributeName="y1" values="${fv(p1.py)};${fv(p1.py-4)};${fv(p1.py)}" dur="${.95+b*.075}s" begin="${b*.055}s" repeatCount="indefinite"/>
</line>`;
  }

  // speakers
  [{cx:50,side:"left"},{cx:760,side:"right"}].forEach(({cx,side})=>{
    const sp=iso(cx,225,19.5);
    s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.4s" fill="freeze"/>
${isoBox(cx,225,84,250,20,T.panel,a,a,.82)}
<circle cx="${fv(sp.px)}" cy="${fv(sp.py-12)}" r="30" fill="#090a1a" stroke="${a}" stroke-width="1"/>
<circle cx="${fv(sp.px)}" cy="${fv(sp.py-12)}" r="20" fill="${a}" fill-opacity="0.26">
<animate attributeName="r" values="20;28;20" dur="1.6s" begin="${side==="right"?"0.4s":"0s"}" repeatCount="indefinite"/>
<animate attributeName="fill-opacity" values="0.24;0.08;0.24" dur="1.6s" begin="${side==="right"?"0.4s":"0s"}" repeatCount="indefinite"/>
</circle>
<circle cx="${fv(sp.px)}" cy="${fv(sp.py-12)}" r="9" fill="${a}" fill-opacity="0.84"/>
<circle cx="${fv(sp.px)}" cy="${fv(sp.py+30)}" r="13" fill="#090a1a" stroke="${a}" stroke-width="0.8"/>
<circle cx="${fv(sp.px)}" cy="${fv(sp.py+30)}" r="5.5" fill="${a}" fill-opacity="0.62"/>
</g>`;
  });

  s+=`<line x1="${fv(s1.px)}" y1="${fv(s1.py)}" x2="${fv(s2.px)}" y2="${fv(s2.py)}" stroke="#162638" stroke-width="3.5" stroke-linecap="round"/>
<line x1="${fv(sl.px)}" y1="${fv(sl.py)}" x2="${fv(sr.px)}" y2="${fv(sr.py)}" stroke="#162638" stroke-width="5.5" stroke-linecap="round"/>
<g transform="translate(328,466)">${badge(0,0,"8K","DISPLAY QUALITY",a)}</g></svg>`;
  return s;
};

/* ─────────────────────────────────────────────────────────────
   SCENE MAP
───────────────────────────────────────────────────────────── */
const BUILDERS = {
  web: sceneWeb, ai: sceneAi, cyber: sceneCyber, server: sceneServer,
  desktop: sceneDesktop, network: sceneNetwork, surveillance: sceneSurveillance,
  telecom: sceneTelecom, av: sceneAv,
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
   SLIDE DATA  (content unchanged from original)
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
   HERO COMPONENT
   Framer Motion is used ONLY on HTML div/span elements.
   All SVG is injected via dangerouslySetInnerHTML.
───────────────────────────────────────────────────────────── */
export default function Hero() {
  const [current,       setCurrent]       = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [progress,      setProgress]      = useState(0);
  const [touchStart,    setTouchStart]    = useState(null);
  const [mousePos,      setMousePos]      = useState({x:.5,y:.5});
  const timerRef=useRef(null), rafRef=useRef(null), startRef=useRef(null), heroRef=useRef(null);

  const goTo = useCallback((idx) => {
    if (transitioning || idx===current) return;
    setTransitioning(true);
    setTimeout(()=>{ setCurrent(idx); setTransitioning(false); startRef.current=null; }, 520);
  },[current,transitioning]);

  const handleNext = useCallback(()=>goTo((current+1)%SLIDES.length),[current,goTo]);
  const handlePrev = useCallback(()=>goTo((current-1+SLIDES.length)%SLIDES.length),[current,goTo]);

  useEffect(()=>{
    if(!isAutoPlaying){ setProgress(0); return; }
    startRef.current=performance.now();
    const tick=(now)=>{
      if(!startRef.current) startRef.current=now;
      const e=now-startRef.current;
      setProgress(Math.min((e/SLIDE_INTERVAL)*100,100));
      if(e<SLIDE_INTERVAL) rafRef.current=requestAnimationFrame(tick);
    };
    rafRef.current=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(rafRef.current);
  },[current,isAutoPlaying]);

  useEffect(()=>{
    if(!isAutoPlaying) return;
    timerRef.current=setInterval(handleNext,SLIDE_INTERVAL);
    return ()=>clearInterval(timerRef.current);
  },[isAutoPlaying,handleNext]);

  const manualNav=(i)=>{ setIsAutoPlaying(false); goTo(i); };
  const scrollTo=(e,id)=>{ e.preventDefault(); document.querySelector(id)?.scrollIntoView({behavior:"smooth"}); };
  const onMouseMove=useCallback((e)=>{
    if(!heroRef.current) return;
    const r=heroRef.current.getBoundingClientRect();
    setMousePos({x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height});
  },[]);
  const onTouchStart=(e)=>setTouchStart(e.touches[0].clientX);
  const onTouchEnd=(e)=>{
    if(touchStart===null) return;
    const d=touchStart-e.changedTouches[0].clientX;
    if(Math.abs(d)>50){ d>0?handleNext():handlePrev(); setIsAutoPlaying(false); }
    setTouchStart(null);
  };

  const sl=SLIDES[current];
  const px=(mousePos.x-.5)*18, py=(mousePos.y-.5)*10;

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

      {/* Noise overlay */}
      <div className="nz absolute inset-0 z-[1] pointer-events-none"/>

      {/* Parallax ambient glow — motion.div on a DIV ✓ */}
      <motion.div className="absolute inset-0 z-0 pointer-events-none"
        animate={{x:px*.35,y:py*.28}} transition={{type:"spring",stiffness:52,damping:26}}
        style={{background:`radial-gradient(ellipse 68% 74% at ${50+px*.38}% ${42+py*.38}%,${sl.accent}26,transparent 60%)`,transition:"background .95s ease"}}/>

      {/* Secondary corner glow */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{background:`radial-gradient(ellipse 36% 42% at 14% 86%,${sl.accent}10,transparent 66%)`,transition:"background .95s ease"}}/>

      {/* Subtle grid */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{backgroundImage:`linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)`,backgroundSize:"80px 80px"}}/>

      {/* Horizontal accent lines */}
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
            <div className="absolute inset-0">
              <SVGScene sceneKey={sl.scene} accent={sl.accent}/>
            </div>
            <div className="absolute inset-0"
              style={{background:"linear-gradient(to bottom,rgba(5,12,24,.3) 0%,rgba(5,12,24,.05) 18%,rgba(5,12,24,.56) 50%,rgba(5,12,24,.94) 76%,#050c18 100%)"}}/>
            <div className="absolute inset-0"
              style={{background:"linear-gradient(to right,rgba(5,12,24,.42) 0%,transparent 56%)"}}/>
            <div className="absolute inset-x-0 bottom-0 z-10" style={{padding:"0 22px 28px"}}>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full"
                style={{background:`${sl.accent}1c`,border:`1px solid ${sl.accent}46`}}>
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                  <span className="hPng absolute inline-flex h-full w-full rounded-full" style={{background:sl.accent}}/>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{background:sl.accent}}/>
                </span>
                <span className="hM text-[9px] tracking-[.34em] uppercase" style={{color:sl.accent}}>{sl.tag}</span>
              </div>
              <h1 className="hD mb-2.5"
                style={{fontSize:"clamp(2rem,10vw,3rem)",lineHeight:.88,color:"#fff"}}>{sl.headline}</h1>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="flex-shrink-0 h-px w-6" style={{background:sl.accent}}/>
                <p className="hB text-[9px] font-light tracking-widest uppercase"
                  style={{color:"rgba(255,255,255,.42)"}}>{sl.subheadline}</p>
              </div>
              <p className="hB leading-snug mb-4 font-light"
                style={{color:"rgba(255,255,255,.56)",fontSize:".76rem",maxWidth:"35ch",
                  display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
                {sl.intro.replace(/\n/g," ")}
              </p>
              <div className="flex gap-2.5 mb-4">
                <a href="#contact" onClick={e=>scrollTo(e,"#contact")}
                  className="bP hB flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-[10px] font-semibold tracking-wider uppercase"
                  style={{background:sl.accent,color:"#fff"}}>
                  {sl.cta.primary}
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="#services" onClick={e=>scrollTo(e,"#services")}
                  className="bG hB inline-flex items-center justify-center py-2.5 px-3 text-[10px] font-light tracking-wider uppercase whitespace-nowrap">
                  {sl.cta.secondary}
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                {SLIDES.map((_,i)=>(
                  <button key={i} onClick={()=>manualNav(i)}
                    className="h-[3px] rounded-full flex-shrink-0"
                    style={{width:i===current?22:5,background:i===current?sl.accent:"rgba(255,255,255,.2)",transition:"all .32s"}}/>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ═══ DESKTOP ═══ */}
      <div className="hidden lg:flex hR absolute inset-0" style={{"--ac":sl.accent}}>

        {/* ── Sidebar ── */}
        <div className="relative flex flex-col z-20 flex-shrink-0"
          style={{width:275,paddingTop:92,paddingBottom:68,paddingLeft:48,paddingRight:26,
            borderRight:"1px solid rgba(255,255,255,.058)",
            background:`linear-gradient(to right,${T.bg}f8,rgba(5,12,24,.7))`,
            boxShadow:"inset -1px 0 0 rgba(255,255,255,.035)"}}>

          <div className="mb-10">
            <div className="hM text-[8.5px] tracking-[.44em] uppercase mb-3"
              style={{color:"rgba(255,255,255,.22)"}}>Services</div>
            {/* motion.div on a DIV ✓ */}
            <motion.div className="h-[2px] w-8 rounded-full"
              style={{background:sl.accent,transition:"background .55s"}} layoutId="sl"/>
          </div>

          <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto ns">
            {SLIDES.map((s,i)=>(
              <button key={i} onClick={()=>manualNav(i)}
                className={`nI hB text-left pl-4 py-2.5 pr-2 ${i===current?"on":""}`}
                style={{"--ac":s.accent,borderLeftColor:i===current?s.accent:undefined}}>
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-light tracking-widest uppercase"
                    style={{color:i===current?"#fff":"rgba(255,255,255,.3)",transition:"color .22s"}}>
                    {s.tag}
                  </span>
                  {i===current&&(
                    <span className="hM text-[8.5px]" style={{color:s.accent}}>
                      {String(i+1).padStart(2,"0")}
                    </span>
                  )}
                </div>
                {i===current&&(
                  <div className="hB text-[12px] font-medium mt-0.5"
                    style={{color:"rgba(255,255,255,.76)"}}>{s.headline}</div>
                )}
              </button>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2 mt-6 pt-5"
            style={{borderTop:"1px solid rgba(255,255,255,.062)"}}>
            {[{lbl:"prev",onClick:handlePrev,d:"M7.5 9L4.5 6l3-3"},{lbl:"next",onClick:handleNext,d:"M4.5 3L7.5 6l-3 3"}].map(btn=>(
              <button key={btn.lbl} onClick={btn.onClick}
                className="w-8 h-8 flex items-center justify-center border transition-all"
                style={{borderColor:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.38)"}}
                onMouseEnter={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="rgba(255,255,255,.28)";}}
                onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,.38)";e.currentTarget.style.borderColor="rgba(255,255,255,.1)";}}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d={btn.d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
            <button onClick={()=>setIsAutoPlaying(p=>!p)}
              className="w-8 h-8 flex items-center justify-center border transition-all"
              style={{borderColor:isAutoPlaying?`${sl.accent}52`:"rgba(255,255,255,.1)",
                color:isAutoPlaying?sl.accent:"rgba(255,255,255,.3)"}}>
              {isAutoPlaying
                ?<svg width="9" height="9" fill="currentColor" viewBox="0 0 10 10"><rect x="1" y="1" width="3" height="8" rx=".5"/><rect x="6" y="1" width="3" height="8" rx=".5"/></svg>
                :<svg width="9" height="9" fill="currentColor" viewBox="0 0 10 10"><path d="M2 1.5l7 3.5-7 3.5V1.5z"/></svg>}
            </button>
            {/* Progress ring — plain SVG in a div, not a motion element */}
            <div className="relative w-8 h-8 flex items-center justify-center ml-auto">
              <svg width="32" height="32" viewBox="0 0 32 32"
                style={{position:"absolute",transform:"rotate(-90deg)"}}>
                <circle cx="16" cy="16" r="13" fill="none"
                  stroke="rgba(255,255,255,.07)" strokeWidth="1.5"/>
                <circle cx="16" cy="16" r="13" fill="none"
                  stroke={sl.accent} strokeWidth="1.5"
                  strokeDasharray={`${2*Math.PI*13}`}
                  strokeDashoffset={`${2*Math.PI*13*(1-progress/100)}`}
                  style={{transition:"stroke .55s,stroke-dashoffset .1s"}}/>
              </svg>
              <span className="hM text-[7.5px]"
                style={{color:sl.accent,position:"relative",zIndex:1}}>
                {String(current+1).padStart(2,"0")}
              </span>
            </div>
          </div>
        </div>

        {/* ── Scene + Content ── */}
        <div className="relative flex-1 overflow-hidden z-10">

          {/* Scene — motion.div on a DIV ✓ */}
          <AnimatePresence mode="wait">
            <motion.div key={`sc${current}`}
              className="absolute z-10"
              style={{inset:0,top:"5%",bottom:"calc(52px + 9%)",left:"1.5%",right:"1.5%"}}
              initial={{opacity:0,scale:1.04}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.965}}
              transition={{duration:.56,ease:[.16,1,.3,1]}}>
              {/* motion.div on a DIV ✓ */}
              <motion.div style={{width:"100%",height:"100%"}}
                animate={{x:px*.44,y:py*.34}}
                transition={{type:"spring",stiffness:50,damping:24}}>
                <SVGScene sceneKey={sl.scene} accent={sl.accent}/>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Gradient overlays */}
          <div className="absolute inset-0 z-20 pointer-events-none"
            style={{background:"linear-gradient(to right,rgba(5,12,24,.44) 0%,transparent 36%,transparent 55%,rgba(5,12,24,.12) 100%)"}}/>
          <div className="absolute inset-0 z-20 pointer-events-none"
            style={{background:"linear-gradient(to bottom,rgba(5,12,24,.2) 0%,transparent 18%,transparent 44%,rgba(5,12,24,.96) 100%)"}}/>

          {/* Content — AnimatePresence on divs ✓ */}
          <AnimatePresence mode="wait">
            <motion.div key={`ct${current}`}
              className="absolute bottom-0 left-0 right-0 z-30 flex items-end justify-between"
              style={{padding:"0 62px 146px 62px",gap:44}}
              initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
              transition={{duration:.44}}>

              <div style={{maxWidth:580}}>
                {/* Tag pill */}
                <div className="hEnt d1 flex items-center gap-3 mb-5">
                  <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                    <span className="hPng absolute inline-flex h-full w-full rounded-full"
                      style={{background:sl.accent}}/>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full"
                      style={{background:sl.accent}}/>
                  </span>
                  <span className="hM text-[9.5px] tracking-[.46em] uppercase"
                    style={{color:sl.accent}}>{sl.subheadline}</span>
                </div>

                {/* Headline */}
                <h1 className="hD hEnt d2 mb-4"
                  style={{fontSize:"clamp(3.2rem,5.4vw,6.4rem)",lineHeight:.86,
                    letterSpacing:".02em",color:"#fff"}}>
                  {sl.headline}
                </h1>

                {/* Divider */}
                <div className="hEnt d3 flex items-center gap-3 mb-4">
                  <div style={{width:44,height:1,
                    background:`linear-gradient(to right,${sl.accent},transparent)`}}/>
                  <span className="hM text-[8px] tracking-[.38em] uppercase"
                    style={{color:"rgba(255,255,255,.26)"}}>{sl.tag}</span>
                </div>

                {/* Body */}
                <p className="hB hEnt d3 font-light leading-relaxed mb-7"
                  style={{fontSize:"clamp(.83rem,1vw,.97rem)",
                    color:"rgba(255,255,255,.58)",maxWidth:"50ch"}}>
                  {sl.intro.replace(/\\n/g," ")}
                </p>

                {/* CTAs */}
                <div className="hEnt d4 flex items-center gap-3">
                  <a href="#contact" onClick={e=>scrollTo(e,"#contact")}
                    className="bP hB inline-flex items-center gap-2.5 py-3.5 px-7 text-xs font-semibold tracking-[.17em] uppercase"
                    style={{background:sl.accent,color:"#fff",boxShadow:`0 0 48px ${sl.accent}38`}}>
                    {sl.cta.primary}
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M2.5 6.5h8M7.5 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <a href="#services" onClick={e=>scrollTo(e,"#services")}
                    className="bG hB inline-flex items-center gap-2.5 py-3.5 px-7 text-xs font-light tracking-[.17em] uppercase">
                    {sl.cta.secondary}
                  </a>
                </div>
              </div>

              {/* Stat card — motion.div on a DIV ✓ */}
              <div className="hEnt d5 flex-shrink-0 text-right">
                <div className="sC inline-block p-5 relative overflow-hidden"
                  style={{boxShadow:`0 0 68px ${sl.accent}18,inset 0 1px 0 rgba(255,255,255,.055)`,
                    border:`1px solid ${sl.accent}24`}}>
                  {/* Corner accents */}
                  <div style={{position:"absolute",top:0,right:0,width:36,height:36,
                    borderLeft:`1px solid ${sl.accent}38`,borderBottom:`1px solid ${sl.accent}38`,
                    background:`${sl.accent}07`,clipPath:"polygon(100% 0,100% 100%,0 0)"}}/>
                  <div style={{position:"absolute",bottom:0,left:0,width:24,height:24,
                    borderRight:`1px solid ${sl.accent}1e`,borderTop:`1px solid ${sl.accent}1e`,
                    clipPath:"polygon(0 100%,100% 100%,0 0)"}}/>
                  {/* Value */}
                  <div className="hD" style={{fontSize:"clamp(2.2rem,3.6vw,4rem)",lineHeight:1,color:sl.accent}}>
                    {sl.stat.value}
                  </div>
                  <div className="hM text-[8px] tracking-[.3em] uppercase mt-1.5"
                    style={{color:"rgba(255,255,255,.28)"}}>
                    {sl.stat.label}
                  </div>
                  {/* Footer — motion.div on a DIV ✓ */}
                  <div className="mt-4 pt-3.5 flex items-center gap-2.5"
                    style={{borderTop:`1px solid ${sl.accent}1e`}}>
                    <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{background:sl.accent}}
                      animate={{scale:[1,1.58,1],opacity:[.6,1,.6]}}
                      transition={{duration:2.3,repeat:Infinity}}/>
                    <span className="hM text-[8px] tracking-widest uppercase"
                      style={{color:"rgba(255,255,255,.22)"}}>Enterprise Grade</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Corner labels */}
          <div className="absolute top-6 right-8 z-30 hM text-[8px] tracking-[.5em] uppercase"
            style={{color:`${sl.accent}38`}}>{sl.scene}_SYS</div>
          <div className="absolute top-6 left-7 z-30 flex items-center gap-2">
            <div style={{width:1,height:22,background:`${sl.accent}3e`}}/>
            <span className="hM text-[8px] tracking-[.4em]"
              style={{color:`${sl.accent}52`}}>
              {String(current+1).padStart(2,"0")}&nbsp;/&nbsp;{String(SLIDES.length).padStart(2,"0")}
            </span>
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM BAR ═══ */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 z-40">
        {/* Progress line */}
        <div className="h-[1px] w-full"
          style={{background:"rgba(255,255,255,.052)"}}>
          <div className="h-full"
            style={{width:`${progress}%`,background:sl.accent,
              boxShadow:`0 0 16px ${sl.accent}`,transition:"none"}}/>
        </div>
        {/* Bar */}
        <div className="flex items-center justify-between"
          style={{paddingLeft:"calc(275px + 50px)",paddingRight:26,height:52,
            background:"rgba(5,12,24,.97)",backdropFilter:"blur(28px)",
            borderTop:"1px solid rgba(255,255,255,.044)"}}>
          <div className="flex items-center gap-2.5">
            {SLIDES.map((_,i)=>(
              <button key={i} onClick={()=>manualNav(i)}>
                <div className="rounded-full"
                  style={{width:i===current?24:5,height:5,
                    background:i===current?sl.accent:"rgba(255,255,255,.16)",
                    boxShadow:i===current?`0 0 10px ${sl.accent}78`:"none",
                    transition:"all .36s cubic-bezier(.16,1,.3,1)"}}/>
              </button>
            ))}
          </div>
          <span className="hM text-[8.5px] tracking-[.44em] uppercase"
            style={{color:"rgba(255,255,255,.18)"}}>
            {sl.tag} — {sl.headline}
          </span>
          <span className="hM text-[10.5px]" style={{color:sl.accent}}>
            {String(current+1).padStart(2,"0")}
            <span style={{color:"rgba(255,255,255,.16)"}}>
              {" "}/ {String(SLIDES.length).padStart(2,"0")}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}