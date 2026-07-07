import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   ISO MATH — shared 3-D primitive system
───────────────────────────────────────────────────────────── */
const iso = (x,y,z)=>({ px:(x-y)*Math.cos(Math.PI/6), py:(x+y)*Math.sin(Math.PI/6)-z });
const fv  = v=>(+v).toFixed(2);
const fpt = ps=>ps.map(p=>`${fv(p.px)},${fv(p.py)}`).join(" ");

/* iso box — shared across all scenes */
const isoBox=(cx,cy,w,h,d,fill,stroke,a,op=1)=>{
  const tl=iso(cx-w/2,cy-h/2,d),tr=iso(cx+w/2,cy-h/2,d);
  const br=iso(cx+w/2,cy+h/2,d),bl=iso(cx-w/2,cy+h/2,d);
  const r0=iso(cx+w/2,cy-h/2,d),r1=iso(cx+w/2,cy-h/2,0);
  const r2=iso(cx+w/2,cy+h/2,0),r3=iso(cx+w/2,cy+h/2,d);
  const f0=iso(cx-w/2,cy+h/2,d),f1=iso(cx+w/2,cy+h/2,d);
  const f2=iso(cx+w/2,cy+h/2,0),f3=iso(cx-w/2,cy+h/2,0);
  return `<g opacity="${op}">
<polygon points="${fpt([tl,tr,br,bl])}" fill="${fill}" stroke="${stroke}" stroke-width="0.7" stroke-opacity="0.8"/>
<polygon points="${fpt([r0,r1,r2,r3])}" fill="${a}" fill-opacity="0.07" stroke="${stroke}" stroke-width="0.5" stroke-opacity="0.4"/>
<polygon points="${fpt([f0,f1,f2,f3])}" fill="${a}" fill-opacity="0.04" stroke="${stroke}" stroke-width="0.5" stroke-opacity="0.25"/>
<line x1="${fv(tl.px)}" y1="${fv(tl.py)}" x2="${fv(tr.px)}" y2="${fv(tr.py)}" stroke="${a}" stroke-width="1" stroke-opacity="0.55"/>
<line x1="${fv(tl.px)}" y1="${fv(tl.py)}" x2="${fv(bl.px)}" y2="${fv(bl.py)}" stroke="${a}" stroke-width="0.5" stroke-opacity="0.22"/>
</g>`;
};

const isoPlane=(cx,cy,cols,rows,cw,ch,d,a,op=0.12)=>{
  let g=`<g opacity="${op}">`;
  for(let r=0;r<=rows;r++){
    const p1=iso(cx-cols*cw/2,cy-rows*ch/2+r*ch,d);
    const p2=iso(cx+cols*cw/2,cy-rows*ch/2+r*ch,d);
    g+=`<line x1="${fv(p1.px)}" y1="${fv(p1.py)}" x2="${fv(p2.px)}" y2="${fv(p2.py)}" stroke="${a}" stroke-width="0.5"/>`;
  }
  for(let c=0;c<=cols;c++){
    const p1=iso(cx-cols*cw/2+c*cw,cy-rows*ch/2,d);
    const p2=iso(cx-cols*cw/2+c*cw,cy+rows*ch/2,d);
    g+=`<line x1="${fv(p1.px)}" y1="${fv(p1.py)}" x2="${fv(p2.px)}" y2="${fv(p2.py)}" stroke="${a}" stroke-width="0.5"/>`;
  }
  return g+`</g>`;
};

const orbitRing=(cx,cy,rx,ry,a,dur,delay=0,op=0.35)=>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${a}" stroke-width="0.7" stroke-opacity="${op}" stroke-dasharray="4 3">
<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
</ellipse>`;

const pulse=(cx,cy,r,a,delay=0,dur=2.4)=>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${a}" stroke-width="0.8" opacity="0">
<animate attributeName="opacity" values="0.55;0" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
<animate attributeName="r" values="${r};${r*2.1}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
</circle>`;

const bgGrid=(a,op=0.055)=>`<g opacity="${op}">
${Array.from({length:6},(_,i)=>`<line x1="0" y1="${i*50}" x2="280" y2="${i*50}" stroke="${a}" stroke-width="0.35"/>`).join("")}
${Array.from({length:7},(_,i)=>`<line x1="${i*48}" y1="0" x2="${i*48}" y2="300" stroke="${a}" stroke-width="0.35"/>`).join("")}
</g>`;

const scanLine=(a,dur=5)=>
  `<rect x="0" y="0" width="280" height="1.5" fill="${a}" fill-opacity="0.12">
<animateTransform attributeName="transform" type="translate" values="0 -5;0 165;0 -5" dur="${dur}s" repeatCount="indefinite" calcMode="linear"/>
</rect>`;

const braces=(a,w=280,h=160)=>[
  [10,8,1,1],[w-10,8,-1,1],[10,h-8,1,-1],[w-10,h-8,-1,-1]
].map(([x,y,fx,fy])=>
  `<line x1="${x}" y1="${y}" x2="${x+fx*18}" y2="${y}" stroke="${a}" stroke-width="1.2" stroke-opacity="0.45"/>
<line x1="${x}" y1="${y}" x2="${x}" y2="${y+fy*18}" stroke="${a}" stroke-width="1.2" stroke-opacity="0.45"/>
<circle cx="${x}" cy="${y}" r="1.6" fill="${a}" fill-opacity="0.55"/>`).join("");

/* badge helper */
const badge=(tx,ty,val,lbl,a)=>
  `<g transform="translate(${tx},${ty})">
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -6;0 0" dur="3.8s" repeatCount="indefinite" calcMode="ease"/>
<rect x="0" y="0" width="78" height="34" rx="3" fill="#050c18" stroke="${a}" stroke-width="0.9"/>
<rect x="0" y="0" width="78" height="34" rx="3" fill="${a}" fill-opacity="0.04"/>
<line x1="78" y1="0" x2="62" y2="0" stroke="${a}" stroke-width="1.6" stroke-opacity="0.6"/>
<line x1="78" y1="0" x2="78" y2="10" stroke="${a}" stroke-width="1.6" stroke-opacity="0.6"/>
<text x="39" y="20" fill="${a}" font-size="12" font-family="'Sora',sans-serif" font-weight="800" text-anchor="middle">${val}</text>
<text x="39" y="30" fill="#64748b" font-size="5.5" font-family="'Space Mono',monospace" font-weight="700" text-anchor="middle" letter-spacing="1.2">${lbl}</text>
</g>`;

/* ── Scene builder functions — pure SVG strings ── */

const buildHealthcare = (a="#10b981") => {
  let s=`<svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;position:absolute;inset:0">
<defs>
  <filter id="hgf"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="hgfs"><feGaussianBlur stdDeviation="3"/></filter>
</defs>
${bgGrid(a)}
<ellipse cx="140" cy="80" rx="120" ry="80" fill="${a}" fill-opacity="0.06" filter="url(#hgf)"/>
${braces(a)}`;
  /* iso ground plane */
  s+=isoPlane(140,148,7,3,28,14,0,a,0.09);
  /* ECG waveform */
  s+=`<path d="M 0 80 L 35 80 L 48 80 L 58 44 L 68 108 L 78 58 L 88 80 L 140 80 L 153 80 L 163 44 L 173 108 L 183 58 L 193 80 L 280 80"
stroke="${a}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-opacity="0" filter="url(#hgfs)">
<animate attributeName="stroke-opacity" from="0" to="0.35" dur="0.4s" fill="freeze"/>
<animate attributeName="stroke-dasharray" from="0 2000" to="2000 0" dur="1.4s" begin="0.1s"/>
</path>
<path d="M 0 80 L 35 80 L 48 80 L 58 44 L 68 108 L 78 58 L 88 80 L 140 80 L 153 80 L 163 44 L 173 108 L 183 58 L 193 80 L 280 80"
stroke="${a}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0">
<animate attributeName="opacity" from="0" to="0.9" dur="0.4s" fill="freeze"/>
<animate attributeName="stroke-dasharray" from="0 2000" to="2000 0" dur="1.4s" begin="0.1s"/>
</path>`;
  /* floating monitor — iso box */
  s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.5s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -6;0 0" dur="4s" repeatCount="indefinite" calcMode="ease"/>
${isoBox(52,44,52,40,14,"#0a1628",a,a,1)}`;
  const sc=[iso(52-20,44-14,14.5),iso(52+20,44-14,14.5),iso(52+20,44+14,14.5),iso(52-20,44+14,14.5)];
  s+=`<polygon points="${fpt(sc)}" fill="#040b16"/>
<text x="${fv(iso(52,44-8,15).px)}" y="${fv(iso(52,44-8,15).py)}" fill="${a}" font-size="5" font-family="'Sora',sans-serif" font-weight="800" text-anchor="middle">VITALS</text>
${["98.6°F","72bpm","120/80"].map((v,i)=>{
  const p=iso(52,44-2+i*7,15);
  return `<text x="${fv(p.px)}" y="${fv(p.py)}" fill="#64748b" font-size="4" font-family="'Space Mono',monospace" font-weight="700" text-anchor="middle">${v}</text>`;
}).join("")}
</g>`;
  /* pulse rings */
  s+=pulse(140,80,22,a,0,2.6);
  s+=pulse(140,80,32,a,0.5,2.6);
  /* orbit */
  s+=orbitRing(218,42,28,11,a,6,0,0.45);
  /* wifi arcs */
  for(let r=1;r<=3;r++) s+=`<path d="M ${218-r*11} ${50-r*6} Q 218 ${44-r*8} ${218+r*11} ${50-r*6}"
stroke="${a}" stroke-width="0.8" fill="none" stroke-opacity="${0.6-r*0.12}">
<animate attributeName="stroke-opacity" values="${0.2}; ${0.7-r*0.1};${0.2}" dur="2s" begin="${r*0.3}s" repeatCount="indefinite"/>
</path>`;
  s+=`<circle cx="218" cy="56" r="3.5" fill="${a}" fill-opacity="0.8">
<animate attributeName="r" values="3.5;5;3.5" dur="1.8s" repeatCount="indefinite"/>
</circle>`;
  s+=scanLine(a,5);
  s+=badge(188,112,"99.9%","UPTIME",a);
  s+=`</svg>`; return s;
};

const buildFinance = (a="#f59e0b") => {
  let s=`<svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;position:absolute;inset:0">
<defs><filter id="fgf"><feGaussianBlur stdDeviation="7"/></filter><filter id="fgfs"><feGaussianBlur stdDeviation="2.5"/></filter></defs>
${bgGrid(a)}
<ellipse cx="150" cy="80" rx="130" ry="75" fill="${a}" fill-opacity="0.05" filter="url(#fgf)"/>
${braces(a)}`;
  s+=isoPlane(140,148,8,3,26,13,0,a,0.08);
  /* stock bars */
  [80,54,66,40,48,34,44,26].forEach((h,i)=>{
    s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.35s" begin="${0.1+i*0.07}s" fill="freeze"/>
${isoBox(32+i*28,128-h/2,16,h,6,a,a,a,0.14)}
</g>`;
  });
  /* chart line */
  s+=`<path d="M 32 118 L 60 96 L 88 106 L 116 70 L 144 80 L 172 50 L 200 62 L 228 38 L 256 46"
stroke="${a}" stroke-width="1.7" fill="none" stroke-linecap="round" opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.4s" fill="freeze"/>
<animate attributeName="stroke-dasharray" from="0 1200" to="1200 0" dur="1.3s" begin="0.2s"/>
</path>
<path d="M 32 118 L 60 96 L 88 106 L 116 70 L 144 80 L 172 50 L 200 62 L 228 38 L 256 46"
stroke="${a}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-opacity="0.12" filter="url(#fgfs)">
<animate attributeName="stroke-dasharray" from="0 1200" to="1200 0" dur="1.3s" begin="0.2s"/>
</path>`;
  /* floating shield */
  s+=`<g opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.4s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -6;0 0" dur="3.6s" repeatCount="indefinite" calcMode="ease"/>
${isoBox(224,44,40,44,16,"#0a1628",a,a,1)}`;
  const sp=iso(224,44,17);
  s+=`<path d="M ${fv(sp.px)} ${fv(sp.py-14)} L ${fv(sp.px+12)} ${fv(sp.py-8)} L ${fv(sp.px+12)} ${fv(sp.py+8)} Q ${fv(sp.px+12)} ${fv(sp.py+18)} ${fv(sp.px)} ${fv(sp.py+22)} Q ${fv(sp.px-12)} ${fv(sp.py+18)} ${fv(sp.px-12)} ${fv(sp.py+8)} L ${fv(sp.px-12)} ${fv(sp.py-8)} Z" fill="${a}" fill-opacity="0.85"/>
<rect x="${fv(sp.px-5)}" y="${fv(sp.py-4)}" width="10" height="8" rx="1.5" fill="#050c18"/>
<path d="M ${fv(sp.px-4)} ${fv(sp.py-4)} Q ${fv(sp.px-4)} ${fv(sp.py-10)} ${fv(sp.px)} ${fv(sp.py-10)} Q ${fv(sp.px+4)} ${fv(sp.py-10)} ${fv(sp.px+4)} ${fv(sp.py-4)}" stroke="#050c18" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</g>`;
  s+=orbitRing(224,44,28,11,a,7,0.5,0.4);
  s+=pulse(228,38,8,a,0,2.8);
  s+=scanLine(a,6);
  s+=badge(8,6,"SOC 2","COMPLIANT",a);
  s+=`</svg>`; return s;
};

const buildEnergy = (a="#f97316") => {
  let s=`<svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;position:absolute;inset:0">
<defs><filter id="egf"><feGaussianBlur stdDeviation="8"/></filter></defs>
${bgGrid(a)}
<ellipse cx="140" cy="80" rx="115" ry="72" fill="${a}" fill-opacity="0.06" filter="url(#egf)"/>
${braces(a)}`;
  s+=isoPlane(140,148,7,3,28,14,0,a,0.09);
  /* central control unit */
  s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.2s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -5;0 0" dur="4.2s" repeatCount="indefinite" calcMode="ease"/>
${isoBox(140,72,52,60,22,"#0a1628",a,a,1)}`;
  const cp=iso(140,72,23);
  s+=`<text x="${fv(cp.px)}" y="${fv(cp.py-8)}" fill="${a}" font-size="5.5" font-family="'Sora',sans-serif" font-weight="800" text-anchor="middle">CONTROL</text>
<text x="${fv(cp.px)}" y="${fv(cp.py-1)}" fill="${a}" font-size="5.5" font-family="'Sora',sans-serif" font-weight="800" text-anchor="middle">UNIT</text>
${[0,1,2].map(i=>{const lp=iso(140,68+i*8,23.5);return `<circle cx="${fv(lp.px)}" cy="${fv(lp.py+10)}" r="2.5" fill="${a}"><animate attributeName="opacity" values="0.3;1;0.3" dur="${0.9+i*0.22}s" begin="${i*0.25}s" repeatCount="indefinite"/></circle>`;}).join("")}
</g>`;
  /* pipes */
  [[30,60,110,60],[30,100,110,100],[170,60,250,60],[170,100,250,100]].forEach(([x1,y1,x2,y2],i)=>{
    s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${a}" stroke-width="4.5" stroke-linecap="round" stroke-opacity="0" opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${0.1+i*0.08}s" fill="freeze"/>
</line>
<circle r="3" fill="${a}" fill-opacity="0.85">
<animateMotion path="M ${x1} ${y1} L ${x2} ${y2}" dur="${1.6+i*0.22}s" begin="${i*0.4}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.9;0" dur="${1.6+i*0.22}s" begin="${i*0.4}s" repeatCount="indefinite"/>
</circle>`;
  });
  s+=orbitRing(140,72,38,15,a,8,0,0.35);
  s+=pulse(140,72,26,a,0,2.6);
  s+=badge(186,114,"24/7","MONITOR",a);
  s+=`</svg>`; return s;
};

const buildRetail = (a="#ec4899") => {
  let s=`<svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;position:absolute;inset:0">
<defs><filter id="rgf"><feGaussianBlur stdDeviation="7"/></filter></defs>
${bgGrid(a)}
<ellipse cx="140" cy="80" rx="120" ry="76" fill="${a}" fill-opacity="0.05" filter="url(#rgf)"/>
${braces(a)}`;
  s+=isoPlane(140,148,7,3,28,14,0,a,0.09);
  /* store — iso box stack */
  s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.55s" fill="freeze"/>
${isoBox(140,72,100,78,24,"#0a1628",a,a,1)}`;
  /* awning */
  const aw=[iso(90,34,25),iso(190,34,25),iso(190,34,0),iso(90,34,0)];
  s+=`<polygon points="${fpt(aw)}" fill="${a}" fill-opacity="0.75"/>`;
  /* windows as iso sub-boxes */
  [[110,60],[170,60],[110,90],[170,90]].forEach(([cx,cy],i)=>{
    s+=isoBox(cx,cy,28,20,24.5,"#0d1a2e",a,a,0.6);
  });
  s+=`</g>`;
  /* POS terminal */
  s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.35s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -5;0 0" dur="3.4s" repeatCount="indefinite" calcMode="ease"/>
${isoBox(226,54,24,32,12,"#0a1628",a,a,0.9)}
</g>`;
  /* RFID scan beam */
  s+=`<rect x="102" y="52" width="36" height="1.5" rx="0.75" fill="${a}" fill-opacity="0.7">
<animate attributeName="y" values="52;76;52" dur="2.2s" repeatCount="indefinite" calcMode="ease"/>
</rect>`;
  /* wifi arcs above store */
  for(let r=1;r<=3;r++) s+=`<path d="M ${140-r*14} ${24-r*8} Q 140 ${16-r*10} ${140+r*14} ${24-r*8}"
stroke="${a}" stroke-width="0.9" fill="none">
<animate attributeName="stroke-opacity" values="0.2;0.7;0.2" dur="1.9s" begin="${r*0.3}s" repeatCount="indefinite"/>
</path>`;
  s+=orbitRing(226,54,20,8,a,5,0,0.4);
  s+=pulse(226,54,14,a,0,2.5);
  s+=badge(6,6,"RFID","ENABLED",a);
  s+=`</svg>`; return s;
};

const buildGovernment = (a="#6366f1") => {
  let s=`<svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;position:absolute;inset:0">
<defs><filter id="ggf"><feGaussianBlur stdDeviation="8"/></filter></defs>
${bgGrid(a)}
<ellipse cx="140" cy="78" rx="118" ry="74" fill="${a}" fill-opacity="0.06" filter="url(#ggf)"/>
${braces(a)}`;
  s+=isoPlane(140,148,8,3,26,13,0,a,0.09);
  /* building main block */
  s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.5s" fill="freeze"/>
${isoBox(140,90,110,80,28,"#0a1628",a,a,1)}`;
  /* columns */
  [-36,-18,0,18,36].forEach((ox,i)=>{
    s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${0.1+i*0.06}s" fill="freeze"/>
${isoBox(140+ox,90,10,80,28.5,"#0d1a2e",a,a,0.55)}
</g>`;
  });
  s+=`</g>`;
  /* pediment */
  const pd=[iso(82,52,29),iso(140,22,29),iso(198,52,29)];
  s+=`<polygon points="${fpt(pd)}" fill="#0a1628" stroke="${a}" stroke-width="0.8" stroke-opacity="0.7" opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.3s" fill="freeze"/>
</polygon>`;
  /* flag */
  const fp=iso(140,36,30);
  s+=`<line x1="${fv(fp.px)}" y1="${fv(fp.py)}" x2="${fv(fp.px)}" y2="${fv(fp.py)-22}" stroke="${a}" stroke-width="1" opacity="0">
<animate attributeName="opacity" from="0" to="0.7" dur="0.4s" begin="0.5s" fill="freeze"/>
</line>
<rect x="${fv(fp.px)}" y="${fv(fp.py)-22}" width="16" height="10" rx="1" fill="${a}" fill-opacity="0.75" opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.55s" fill="freeze"/>
<animate attributeName="scaleX" values="1;0.7;1" dur="1.8s" repeatCount="indefinite"/>
</rect>`;
  /* windows */
  [[-30,70],[0,70],[30,70],[-30,94],[0,94],[30,94]].forEach(([ox,oy],i)=>{
    s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${0.4+i*0.06}s" fill="freeze"/>
${isoBox(140+ox,oy,18,16,28.6,"#0d1a2e",a,a,0.5)}
</g>`;
  });
  /* beacon network */
  [30,80,140,200,250].forEach((cx,i)=>{
    s+=`<circle cx="${cx}" cy="148" r="3" fill="${a}" opacity="0">
<animate attributeName="opacity" from="0" to="0.7" dur="0.3s" begin="${0.6+i*0.1}s" fill="freeze"/>
</circle>
${pulse(cx,148,5,a,i*0.35,2.2)}`;
  });
  /* bus line */
  s+=`<line x1="20" y1="148" x2="260" y2="148" stroke="${a}" stroke-width="0.7" stroke-opacity="0.3" stroke-dasharray="5 3">
<animate attributeName="stroke-dashoffset" from="0" to="-40" dur="2s" repeatCount="indefinite"/>
</line>`;
  s+=orbitRing(218,32,24,10,a,7,0,0.4);
  s+=badge(6,6,"9,000+","BEACONS",a);
  s+=`</svg>`; return s;
};

const buildUtilities = (a="#eab308") => {
  let s=`<svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;position:absolute;inset:0">
<defs><filter id="ugf"><feGaussianBlur stdDeviation="7"/></filter></defs>
${bgGrid(a)}
<ellipse cx="140" cy="80" rx="118" ry="74" fill="${a}" fill-opacity="0.06" filter="url(#ugf)"/>
${braces(a)}`;
  s+=isoPlane(140,148,7,3,28,14,0,a,0.09);
  /* towers */
  [[44,8,140],[236,8,140]].forEach(([x,yt,yb],ti)=>{
    s+=`<line x1="${x}" y1="${yt}" x2="${x}" y2="${yb}" stroke="${a}" stroke-width="2" opacity="0">
<animate attributeName="opacity" from="0" to="0.8" dur="0.4s" begin="${ti*0.1}s" fill="freeze"/>
</line>`;
    [[-16,28],[16,28],[-24,56],[24,56]].forEach(([ox,oy],i)=>{
      s+=`<line x1="${x}" y1="${oy}" x2="${x+ox}" y2="${oy+18}" stroke="#334155" stroke-width="1.6" stroke-linecap="round" opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${0.15+i*0.05+ti*0.08}s" fill="freeze"/>
</line>`;
    });
  });
  /* power lines */
  [50,88].forEach((y,li)=>{
    s+=`<path d="M 44 ${y} Q 140 ${y+16} 236 ${y}" stroke="${a}" stroke-width="0.8" stroke-opacity="0.55" fill="none" opacity="0">
<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${0.3+li*0.1}s" fill="freeze"/>
</path>
<circle r="2.5" fill="${a}" fill-opacity="0.85">
<animateMotion path="M 44 ${y} Q 140 ${y+16} 236 ${y}" dur="${2+li*0.8}s" begin="${li*0.8}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.9;0" dur="${2+li*0.8}s" begin="${li*0.8}s" repeatCount="indefinite"/>
</circle>`;
  });
  /* solar panel — iso box */
  s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.4s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -5;0 0" dur="3.8s" repeatCount="indefinite" calcMode="ease"/>
${isoBox(140,108,52,34,14,"#0a1628",a,a,0.9)}`;
  [[116,98],[132,98],[148,98],[116,110],[132,110],[148,110]].forEach(([cx,cy],i)=>{
    const p=iso(cx,cy,14.5);
    s+=`<rect x="${fv(p.px-6)}" y="${fv(p.py-4)}" width="11" height="8" rx="1" fill="#0d1a2e">
<animate attributeName="fill" values="#0d1a2e;${a}20;#0d1a2e" dur="2.2s" begin="${i*0.28}s" repeatCount="indefinite"/>
</rect>`;
  });
  s+=`</g>`;
  /* cctv camera */
  s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.5s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -4;0 0" dur="3.2s" repeatCount="indefinite" calcMode="ease"/>
${isoBox(224,48,30,18,10,"#0a1628",a,a,0.9)}
</g>`;
  s+=orbitRing(140,108,34,13,a,9,0,0.3);
  s+=pulse(140,108,20,a,0,2.8);
  s+=badge(6,6,"OUTDOOR","CCTV LIVE",a);
  s+=`</svg>`; return s;
};

const SCENE_BUILDERS = {
  healthcare: buildHealthcare,
  finance:    buildFinance,
  energy:     buildEnergy,
  retail:     buildRetail,
  government: buildGovernment,
  power:      buildUtilities,
};

function ScenePanel({ sceneKey, accent }) {
  const html = SCENE_BUILDERS[sceneKey]?.(accent) ?? "";
  return (
    <div style={{width:"100%",height:"100%",position:"absolute",inset:0}}
      dangerouslySetInnerHTML={{__html:html}}/>
  );
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const PARTNER_LOGOS = [
  "/Partners/logo1.png","/Partners/logo2.png","/Partners/logo3.png","/Partners/logo4.jpeg",
  "/Partners/logo5.png","/Partners/logo6.jpg","/Partners/logo7.jpg","/Partners/logo8.png",
  "/Partners/logo9.png","/Partners/logo10.png","/Partners/logo11.png","/Partners/logo12.webp",
  "/Partners/logo13.png","/Partners/logo14.jpg","/Partners/logo15.png","/Partners/logo16.webp",
  "/Partners/logo17.png","/Partners/logo18.jpg","/Partners/logo19.jpeg","/Partners/logo20.jpeg",
];

const CLIENT_DATA = {
  healthcare: [
    { title:"MD Anderson Cancer Center",  desc:"Network Migration & Windows Refresh for high-uptime clinical environments." },
    { title:"United Healthcare",          desc:"Enterprise Network Migration & Epic Systems deployment projects." },
    { title:"Memorial Hermann",           desc:"Epic Refresh Project & M48 Cart maintenance for critical care efficiency." },
  ],
  finance: [
    { title:"Wells Fargo",   desc:"Enterprise Systems Refresh & strict Security Compliance infrastructure." },
    { title:"Bank of America", desc:"Systems Refresh for modernized branch and corporate infrastructure." },
    { title:"Morgan Stanley",  desc:"Managed IT, Network Migrations & Cybersecurity for financial assets." },
  ],
  energy: [
    { title:"Shell", desc:"Desktop Support, Network Admin, and Security Hardening for global energy operations." },
    { title:"BP",    desc:"Cisco Phone Migration, AV Deployments, and Cybersecurity hardening." },
  ],
  retail: [
    { title:"Walmart",                desc:"Nationwide Network Migration & POS Infrastructure Refresh." },
    { title:"Target",                 desc:"POS Refresh utilizing ELO Tablets for enhanced customer checkout." },
    { title:"Porsche (Sugar Land)",   desc:"Full MDF/IDF Network & CCTV Installation for high-end dealership." },
    { title:"HEB",                    desc:"RFID Installation and inventory tracking technology deployment." },
    { title:"Sprouts Farmers Market", desc:"Comprehensive CCTV & AV Migration across retail locations." },
    { title:"McDonald's",             desc:"Enterprise Network Migration across corporate and franchise sites." },
  ],
  government: [
    { title:"Texas State Prisons", desc:"High-security Network Migration & Secure AP Deployment for inmate connectivity." },
    { title:"METRO Authority",     desc:"Smart Beacon Deployment across 9,000+ bus stops for real-time visibility." },
  ],
  power: [
    { title:"Nova Source Power", desc:"Outdoor CCTV & specialized security installations for utility sites." },
  ],
};

const TABS = [
  { key:"healthcare", label:"Healthcare",      accent:"#10b981" },
  { key:"finance",    label:"Financial",       accent:"#f59e0b" },
  { key:"energy",     label:"Oil & Gas",       accent:"#f97316" },
  { key:"retail",     label:"Retail",          accent:"#ec4899" },
  { key:"government", label:"Gov & Transport", accent:"#6366f1" },
  { key:"power",      label:"Utilities",       accent:"#eab308" },
];

/* ─────────────────────────────────────────────────────────────
   MAGNETIC TILT CARD
───────────────────────────────────────────────────────────── */
function MagTiltCard({ children, style, className, accent }) {
  const ref=useRef(null);
  const onMove=(e)=>{
    const el=ref.current; if(!el) return;
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-0.5;
    const y=(e.clientY-r.top)/r.height-0.5;
    el.style.transition="none";
    el.style.transform=`perspective(600px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateZ(8px)`;
    el.style.boxShadow=`${-x*18}px ${y*18}px 48px rgba(0,0,0,0.12), -3px 0 0 ${accent}`;
  };
  const onLeave=()=>{
    const el=ref.current; if(!el) return;
    el.style.transition="transform 0.7s cubic-bezier(0.16,1,0.3,1), box-shadow 0.7s";
    el.style.transform="perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    el.style.boxShadow="";
  };
  return (
    <div ref={ref} className={className} style={{transformStyle:"preserve-3d",willChange:"transform",...style}}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CLIENT CARD
───────────────────────────────────────────────────────────── */
function ClientCard({ client, index, accent }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-20px" });
  return (
    <motion.div ref={ref}
      initial={{opacity:0,y:28}}
      animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.58,delay:index*0.08,ease:[0.16,1,0.3,1]}}>
      <MagTiltCard accent={accent} className="pt-card" style={{"--accent":accent}}>
        {/* top accent line */}
        <div className="pt-card-line" style={{background:accent}}/>
        {/* corner accent tab */}
        <div style={{position:"absolute",top:0,right:0,width:28,height:28,
          background:accent,opacity:0.1,clipPath:"polygon(100% 0,100% 100%,0 0)",pointerEvents:"none"}}/>
        {/* top rim gloss */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:"45%",
          background:"linear-gradient(to bottom,rgba(255,255,255,0.55),transparent)",
          pointerEvents:"none"}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,position:"relative"}}>
          <span className="pt-mono pt-index" style={{color:accent}}>
            {String(index+1).padStart(2,"0")}
          </span>
          <motion.div style={{width:8,height:8,borderRadius:"50%",background:accent,opacity:0.38}}
            animate={{scale:[1,1.55,1],opacity:[0.38,0.75,0.38]}}
            transition={{duration:2.6,repeat:Infinity,delay:index*0.3}}/>
        </div>
        <h3 className="pt-title" style={{position:"relative"}}>{client.title}</h3>
        <p className="pt-desc" style={{position:"relative"}}>{client.desc}</p>
        <div className="pt-footer" style={{borderTop:`1px solid ${accent}18`}}>
          <span className="pt-verified">
            <motion.span style={{width:5,height:5,borderRadius:"50%",background:accent,
              display:"inline-block",marginRight:6,flexShrink:0}}
              animate={{opacity:[0.5,1,0.5]}} transition={{duration:2,repeat:Infinity}}/>
            Deployment_Verified
          </span>
        </div>
      </MagTiltCard>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────── */
const Partners = () => {
  const [activeTab,setActiveTab]=useState("healthcare");
  const tabsRef    =useRef(null);
  const sectionRef =useRef(null);
  const inView     =useInView(sectionRef,{once:true,margin:"-60px"});

  const current=TABS.find(t=>t.key===activeTab);
  const clients=CLIENT_DATA[activeTab];

  useEffect(()=>{
    if(!tabsRef.current) return;
    const el=tabsRef.current.querySelector(".pt-tab-active");
    if(el) el.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});
  },[activeTab]);

  return (
    <section id="partners" ref={sectionRef} style={{
      background:"#ffffff",
      fontFamily:"'Inter',sans-serif",
      position:"relative",overflow:"hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&family=Space+Mono:wght@400;700&display=swap');

        .pt * { box-sizing:border-box; }
        .pt-display { font-family:'Sora',sans-serif!important;    font-weight:800!important; letter-spacing:-0.02em; }
        .pt-mono    { font-family:'Space Mono',monospace!important; font-weight:700!important; }
        .pt-body    { font-family:'Inter',sans-serif!important; }

        .pt-dotgrid {
          background-image:
            radial-gradient(circle,rgba(15,23,42,0.07) 1px,transparent 1px),
            linear-gradient(rgba(15,23,42,0.022) 1px,transparent 1px),
            linear-gradient(90deg,rgba(15,23,42,0.022) 1px,transparent 1px);
          background-size:28px 28px,80px 80px,80px 80px;
        }

        /* tabs row */
        .pt-tabs-row {
          display:flex;flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;
          gap:8px;padding-bottom:4px;
          -webkit-overflow-scrolling:touch;scrollbar-width:none;scroll-snap-type:x mandatory;
        }
        .pt-tabs-row::-webkit-scrollbar{display:none;}

        .pt-tab {
          flex-shrink:0;scroll-snap-align:start;
          cursor:pointer;border:1px solid rgba(15,23,42,0.1);
          background:#fff;
          font-family:'Space Mono',monospace;font-weight:700;
          font-size:clamp(0.5rem,1.2vw,0.6rem);letter-spacing:0.18em;text-transform:uppercase;
          color:rgba(15,23,42,0.38);padding:10px 16px 10px 11px;
          display:flex;align-items:center;gap:7px;
          transition:all 0.25s cubic-bezier(0.16,1,0.3,1);
          white-space:nowrap;position:relative;overflow:hidden;
          border-radius:3px;
        }
        .pt-tab::before {
          content:'';position:absolute;inset:0;
          background:rgba(255,255,255,0.18);
          transform:translateX(-105%);
          transition:transform 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .pt-tab:hover::before { transform:translateX(0); }
        .pt-tab:hover { border-color:var(--tab-accent);color:#0f172a; }
        .pt-tab.pt-tab-active {
          background:#0f172a;border-color:#0f172a;color:#fff;
          box-shadow:0 6px 22px rgba(15,23,42,0.2),inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .pt-tab.pt-tab-active .pt-tab-dot { background:var(--tab-accent)!important; }

        /* layout */
        .pt-main { display:flex;flex-direction:column;gap:24px; }
        @media(min-width:900px){ .pt-main{flex-direction:row;gap:36px;align-items:flex-start;} }

        /* scene panel */
        .pt-scene-panel {
          width:100%;background:#050c18;
          border:1px solid rgba(255,255,255,0.07);
          position:relative;overflow:hidden;
          display:flex;flex-direction:column;
          padding:20px;border-radius:6px;
          box-shadow:0 12px 40px rgba(15,23,42,0.16),0 4px 12px rgba(15,23,42,0.1),
            inset 0 1px 0 rgba(255,255,255,0.055);
        }
        .pt-scene-canvas { position:relative;width:100%;aspect-ratio:280/160; }
        @media(min-width:900px){
          .pt-scene-panel{width:300px;flex-shrink:0;position:sticky;top:100px;}
        }
        @media(min-width:1100px){ .pt-scene-panel{width:340px;} }

        /* cards grid */
        .pt-grid { flex:1;display:grid;grid-template-columns:1fr;gap:10px; }
        @media(min-width:500px){ .pt-grid{grid-template-columns:repeat(2,1fr);} }
        @media(min-width:900px){ .pt-grid{grid-template-columns:1fr;} }
        @media(min-width:1060px){ .pt-grid{grid-template-columns:repeat(2,1fr);} }

        /* client card */
        .pt-card {
          background:#fff;
          border:1px solid rgba(15,23,42,0.08);
          padding:22px 20px 18px;
          position:relative;overflow:hidden;
          display:flex;flex-direction:column;gap:10px;
          cursor:default;border-radius:5px;
          box-shadow:0 2px 8px rgba(15,23,42,0.06),0 1px 2px rgba(15,23,42,0.04),
            inset 0 1px 0 rgba(255,255,255,0.9);
          transition:border-color 0.28s,box-shadow 0.28s,transform 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .pt-card:hover {
          border-color:var(--accent);
          box-shadow:0 8px 32px rgba(15,23,42,0.1),-3px 0 0 var(--accent),
            inset 0 1px 0 rgba(255,255,255,0.95);
        }
        .pt-card-line {
          position:absolute;top:0;left:0;right:0;height:2.5px;
          transform:scaleX(0);transform-origin:left;
          transition:transform 0.42s cubic-bezier(0.16,1,0.3,1);
        }
        .pt-card:hover .pt-card-line { transform:scaleX(1); }

        .pt-index {
          font-family:'Space Mono',monospace;font-weight:700;
          font-size:clamp(0.48rem,1.1vw,0.56rem);letter-spacing:0.3em;
          opacity:0.65;text-transform:uppercase;
        }
        .pt-title {
          font-family:'Sora',sans-serif;font-weight:800;
          font-size:clamp(0.95rem,2.2vw,1.18rem);
          letter-spacing:-0.015em;color:#0f172a;line-height:1.12;margin:0;
        }
        .pt-desc {
          font-family:'Inter',sans-serif;font-weight:600;
          font-size:clamp(0.78rem,1.6vw,0.88rem);
          color:#475569;line-height:1.72;margin:0;flex:1;
        }
        .pt-footer { padding-top:12px;margin-top:auto; }
        .pt-verified {
          font-family:'Space Mono',monospace;font-weight:700;
          font-size:clamp(0.44rem,1vw,0.5rem);letter-spacing:0.22em;
          text-transform:uppercase;color:rgba(15,23,42,0.28);
          display:flex;align-items:center;
        }

        /* marquee */
        .pt-marquee-track {
          display:flex;align-items:center;
          animation:pt-marquee 50s linear infinite;white-space:nowrap;
        }
        .pt-marquee-track:hover{animation-play-state:paused;}
        @keyframes pt-marquee{
          0%{transform:translateX(0);}
          100%{transform:translateX(-50%);}
        }

        /* headline */
        .pt-headline {
          font-family:'Sora',sans-serif;font-weight:800;
          font-size:clamp(2.2rem,7vw,5.8rem);
          line-height:0.92;letter-spacing:-0.03em;
          color:#0f172a;margin-bottom:14px;
        }

        /* index strip */
        .pt-index-strip{display:none;}
        @media(min-width:480px){.pt-index-strip{display:flex;}}

        /* mobile text sizes */
        @media(max-width:480px){
          .pt-tab{font-size:0.52rem;padding:9px 13px 9px 10px;}
          .pt-title{font-size:1rem;}
          .pt-desc{font-size:0.82rem;font-weight:600;}
          .pt-card{padding:18px 16px 14px;}
        }
      `}</style>

      <div className="pt" style={{position:"relative"}}>
        <div className="pt-dotgrid" style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0}}/>

        {/* ambient glow */}
        <div style={{
          position:"absolute",inset:0,pointerEvents:"none",zIndex:0,
          background:`radial-gradient(ellipse 52% 44% at 60% 50%,${current.accent}0d,transparent 65%)`,
          transition:"background 0.75s ease",
        }}/>

        <div style={{position:"relative",zIndex:1,maxWidth:1200,margin:"0 auto",padding:"80px 16px 100px"}}>

          {/* EYEBROW */}
          <motion.div
            initial={{opacity:0,y:14}} animate={inView?{opacity:1,y:0}:{}}
            transition={{duration:0.65,ease:[0.16,1,0.3,1]}}
            style={{display:"flex",alignItems:"center",gap:12,marginBottom:36}}
          >
            <motion.div initial={{scaleX:0}} animate={inView?{scaleX:1}:{}}
              transition={{duration:0.55,delay:0.1}}
              style={{width:28,height:2.5,background:`linear-gradient(90deg,#3b82f6,#818cf8)`,
                transformOrigin:"left",flexShrink:0,borderRadius:99,
                boxShadow:"0 0 10px rgba(59,130,246,0.4)"}}/>
            <span className="pt-mono" style={{fontSize:"clamp(0.52rem,1.2vw,0.6rem)",
              letterSpacing:"0.42em",color:"#3b82f6",textTransform:"uppercase",whiteSpace:"nowrap"}}>
              Client Portfolio
            </span>
            <motion.div initial={{scaleX:0}} animate={inView?{scaleX:1}:{}}
              transition={{duration:0.8,delay:0.2}}
              style={{flex:1,height:1,background:"linear-gradient(to right,rgba(59,130,246,0.28),transparent)",transformOrigin:"left"}}/>
          </motion.div>

          {/* HEADLINE */}
          <motion.div
            initial={{opacity:0,y:22}} animate={inView?{opacity:1,y:0}:{}}
            transition={{duration:0.7,delay:0.1,ease:[0.16,1,0.3,1]}}
            style={{marginBottom:36}}
          >
            <h2 className="pt-headline">
              Trusted by{" "}
              <span style={{background:"linear-gradient(90deg,#3b82f6,#818cf8)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
                Industry Leaders
              </span>
            </h2>
            <p className="pt-body" style={{fontSize:"clamp(0.88rem,2vw,1.02rem)",
              color:"#475569",fontWeight:600,maxWidth:"54ch",lineHeight:1.75}}>
              Strategic infrastructure partnerships across mission-critical sectors including energy, finance, and healthcare.
            </p>
          </motion.div>

          {/* TABS */}
          <motion.div
            initial={{opacity:0,y:14}} animate={inView?{opacity:1,y:0}:{}}
            transition={{duration:0.6,delay:0.2}}
            style={{marginBottom:32}}
          >
            <div className="pt-tabs-row" ref={tabsRef}>
              {TABS.map((t,i)=>(
                <motion.button key={t.key}
                  className={`pt-tab ${activeTab===t.key?"pt-tab-active":""}`}
                  style={{"--tab-accent":t.accent}}
                  onClick={()=>setActiveTab(t.key)}
                  initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                  transition={{delay:0.25+i*0.06}}>
                  <span className="pt-tab-dot" style={{
                    width:5,height:5,borderRadius:"50%",flexShrink:0,
                    background:activeTab===t.key?t.accent:"rgba(15,23,42,0.18)",
                    transition:"background 0.22s",boxShadow:activeTab===t.key?`0 0 8px ${t.accent}`:"none",
                  }}/>
                  {t.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* MAIN LAYOUT */}
          <div className="pt-main">

            {/* SCENE PANEL */}
            <AnimatePresence mode="wait">
              <motion.div key={`scene-${activeTab}`} className="pt-scene-panel"
                initial={{opacity:0,filter:"blur(8px)",scale:0.97}}
                animate={{opacity:1,filter:"blur(0px)",scale:1}}
                exit={{opacity:0,filter:"blur(8px)",scale:0.97}}
                transition={{duration:0.4,ease:[0.16,1,0.3,1]}}>
                {/* glow behind SVG */}
                <div style={{position:"absolute",inset:0,pointerEvents:"none",
                  background:`radial-gradient(ellipse 80% 65% at 50% 50%,${current.accent}1e,transparent 70%)`,
                  transition:"background 0.5s"}}/>
                {/* dark dot grid */}
                <div style={{position:"absolute",inset:0,pointerEvents:"none",
                  backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.045) 1px,transparent 1px)",
                  backgroundSize:"22px 22px"}}/>
                {/* corner braces */}
                {[[10,10,1,1],[1,1,-1,1],[10,-10,1,-1],[1,-1,-1,-1]].map((_,i)=>(
                  <div key={i} style={{position:"absolute",
                    ...(i===0?{top:10,left:10}:i===1?{top:10,right:10}:i===2?{bottom:10,left:10}:{bottom:10,right:10}),
                    width:18,height:18,pointerEvents:"none",
                    ...(i===0?{borderTop:`1.5px solid ${current.accent}`,borderLeft:`1.5px solid ${current.accent}`}:
                        i===1?{borderTop:`1.5px solid ${current.accent}`,borderRight:`1.5px solid ${current.accent}`}:
                        i===2?{borderBottom:`1.5px solid ${current.accent}`,borderLeft:`1.5px solid ${current.accent}`}:
                              {borderBottom:`1.5px solid ${current.accent}`,borderRight:`1.5px solid ${current.accent}`}),
                    opacity:0.55,
                  }}/>
                ))}
                {/* sector tag */}
                <div style={{position:"relative",zIndex:1,marginBottom:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <motion.span style={{width:5,height:5,borderRadius:"50%",background:current.accent,flexShrink:0}}
                      animate={{scale:[1,1.45,1],opacity:[0.7,1,0.7]}}
                      transition={{duration:2,repeat:Infinity}}/>
                    <span className="pt-mono" style={{fontSize:"0.48rem",letterSpacing:"0.36em",
                      color:current.accent,textTransform:"uppercase"}}>
                      {current.label}_SECTOR
                    </span>
                  </div>
                </div>
                {/* SVG scene */}
                <div className="pt-scene-canvas" style={{position:"relative",zIndex:1,flex:1}}>
                  <ScenePanel sceneKey={activeTab} accent={current.accent}/>
                </div>
                {/* client count */}
                <div style={{position:"relative",zIndex:1,marginTop:16,paddingTop:14,
                  borderTop:`1px solid ${current.accent}22`}}>
                  <div className="pt-mono" style={{fontSize:"0.44rem",letterSpacing:"0.3em",
                    color:"rgba(255,255,255,0.25)",textTransform:"uppercase",marginBottom:4}}>
                    Active Clients
                  </div>
                  <div className="pt-display" style={{fontSize:"2.2rem",lineHeight:1,color:current.accent,
                    textShadow:`0 0 24px ${current.accent}55`}}>
                    {String(clients.length).padStart(2,"0")}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* CARDS */}
            <div style={{flex:1,minWidth:0}}>
              <AnimatePresence mode="wait">
                <motion.div key={`grid-${activeTab}`} className="pt-grid"
                  initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  transition={{duration:0.2}}>
                  {clients.map((client,index)=>(
                    <ClientCard key={`${activeTab}-${index}`} client={client} index={index} accent={current.accent}/>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* INDEX STRIP */}
          <motion.div className="pt-index-strip"
            style={{alignItems:"center",gap:18,marginTop:40,flexWrap:"wrap"}}
            initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:0.85}}>
            {TABS.map((t,i)=>(
              <button key={t.key} onClick={()=>setActiveTab(t.key)}
                style={{background:"none",border:"none",cursor:"pointer",padding:0,
                  display:"flex",alignItems:"center",gap:5,
                  opacity:activeTab===t.key?1:0.3,transition:"opacity 0.22s"}}>
                <div style={{width:activeTab===t.key?18:5,height:3,background:t.accent,
                  borderRadius:2,transition:"width 0.32s cubic-bezier(0.16,1,0.3,1)",
                  boxShadow:activeTab===t.key?`0 0 8px ${t.accent}`:"none"}}/>
                <span className="pt-mono" style={{fontSize:"0.44rem",letterSpacing:"0.22em",
                  color:"#0f172a",textTransform:"uppercase"}}>
                  {String(i+1).padStart(2,"0")}
                </span>
              </button>
            ))}
            <span className="pt-mono" style={{marginLeft:"auto",fontSize:"0.44rem",letterSpacing:"0.26em",
              color:"rgba(15,23,42,0.22)",textTransform:"uppercase"}}>
              {String(TABS.findIndex(t=>t.key===activeTab)+1).padStart(2,"0")} / {String(TABS.length).padStart(2,"0")}
            </span>
          </motion.div>

          {/* LOGO MARQUEE */}
          <motion.div
            initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}}
            transition={{duration:0.7,delay:0.4}}
            style={{marginTop:80}}>
            {/* header */}
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:22}}>
              <motion.div initial={{scaleX:0}} animate={inView?{scaleX:1}:{}}
                transition={{duration:0.55,delay:0.5}}
                style={{width:26,height:2.5,background:"linear-gradient(90deg,#3b82f6,#818cf8)",
                  transformOrigin:"left",flexShrink:0,borderRadius:99}}/>
              <span className="pt-mono" style={{fontSize:"clamp(0.48rem,1.1vw,0.56rem)",
                letterSpacing:"0.36em",color:"#3b82f6",textTransform:"uppercase",whiteSpace:"nowrap"}}>
                Partner_Network_Status: Active
              </span>
              <div style={{flex:1,height:1,background:"linear-gradient(to right,rgba(15,23,42,0.09),transparent)"}}/>
            </div>
            {/* track */}
            <div style={{position:"relative",overflow:"hidden",background:"#fff",
              border:"1px solid rgba(15,23,42,0.08)",padding:"26px 0",borderRadius:5,
              boxShadow:"0 4px 24px rgba(15,23,42,0.06),inset 0 1px 0 rgba(255,255,255,0.9)"}}>
              <div style={{position:"absolute",left:0,top:0,bottom:0,width:90,
                background:"linear-gradient(to right,#fff,transparent)",zIndex:2,pointerEvents:"none"}}/>
              <div style={{position:"absolute",right:0,top:0,bottom:0,width:90,
                background:"linear-gradient(to left,#fff,transparent)",zIndex:2,pointerEvents:"none"}}/>
              <div className="pt-marquee-track">
                {[...PARTNER_LOGOS,...PARTNER_LOGOS].map((logo,idx)=>(
                  <div key={idx} style={{flexShrink:0,padding:"0 32px",display:"flex",alignItems:"center"}}>
                    <img src={logo} alt="Partner"
                      style={{height:40,width:"auto",objectFit:"contain",
                        filter:"grayscale(0.15) brightness(1.08) contrast(1.04)",
                        transition:"transform 0.3s,filter 0.3s",cursor:"default"}}
                      onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.13)";e.currentTarget.style.filter="grayscale(0) brightness(1.12)";}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.filter="grayscale(0.15) brightness(1.08) contrast(1.04)";}}/>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:10}}>
              <span className="pt-mono" style={{fontSize:"0.44rem",letterSpacing:"0.28em",
                color:"rgba(15,23,42,0.22)",textTransform:"uppercase"}}>
                20+ Verified_Partners
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Partners;