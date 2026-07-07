import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  MdOutlineMarkEmailRead,
  MdEmail,
  MdSupportAgent,
  MdPhone,
  MdLocationOn
} from "react-icons/md";

/* ─────────────────────────────────────────────────────────────
   ISO MATH — shared 3-D primitive system
───────────────────────────────────────────────────────────── */
const iso  = (x,y,z)=>({ px:(x-y)*Math.cos(Math.PI/6), py:(x+y)*Math.sin(Math.PI/6)-z });
const fv   = v=>(+v).toFixed(2);
const fpt  = ps=>ps.map(p=>`${fv(p.px)},${fv(p.py)}`).join(" ");

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
<line x1="${fv(tl.px)}" y1="${fv(tl.py)}" x2="${fv(tr.px)}" y2="${fv(tr.py)}" stroke="${a}" stroke-width="1.1" stroke-opacity="0.55"/>
<line x1="${fv(tl.px)}" y1="${fv(tl.py)}" x2="${fv(bl.px)}" y2="${fv(bl.py)}" stroke="${a}" stroke-width="0.55" stroke-opacity="0.22"/>
</g>`;
};

const orbitRing=(cx,cy,rx,ry,a,dur,delay=0,op=0.35)=>
`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${a}" stroke-width="0.8" stroke-opacity="${op}" stroke-dasharray="4 3">
<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
</ellipse>`;

const orbitDot=(cx,cy,rx,ry,a,dur,delay=0,r=3)=>
`<circle r="${r}" fill="${a}" fill-opacity="0">
<animateMotion path="M ${cx+rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx+rx-0.01} ${cy}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
<animate attributeName="fill-opacity" values="0;0.9;0.9;0" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
</circle>`;

const pulse=(cx,cy,r,a,delay=0,dur=2.5)=>
`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${a}" stroke-width="0.9" opacity="0">
<animate attributeName="opacity" values="0.55;0" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
<animate attributeName="r" values="${r};${r*2.2}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
</circle>`;

const depthParticles=(a,count=14,seedOffset=0,W=400,H=260)=>{
  let g="";
  for(let i=0;i<count;i++){
    const seed=(i+seedOffset)*37.13;
    const x=((seed*53.7)%W).toFixed(1);
    const y=(30+((seed*91.3)%(H-50))).toFixed(1);
    const r=(1.1+((seed*17)%2.2)).toFixed(1);
    const dur=(3.2+((seed*7)%4)).toFixed(2);
    const del=(((seed*3)%4)).toFixed(2);
    g+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${a}" fill-opacity="0">
<animate attributeName="fill-opacity" values="0;0.45;0" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/>
<animateTransform attributeName="transform" type="translate" values="0 0;0 -18;0 0" dur="${(+dur*1.4).toFixed(2)}s" begin="${del}s" repeatCount="indefinite" calcMode="ease"/>
</circle>`;
  }
  return `<g>${g}</g>`;
};

/* ─────────────────────────────────────────────────────────────
   ISO NETWORK SVG — sidebar background scene
───────────────────────────────────────────────────────────── */
function IsoNetworkSVG({ accent="#3b82f6", W=340, H=460 }) {
  const A = accent;
  const panel = "#0a1628";
  const chrome = "#0f1f38";

  const np = [
    {x:170,y:130,r:22,main:true},
    {x:72, y:220,r:13},{x:268,y:220,r:13},
    {x:110,y:320,r:11},{x:230,y:320,r:11},
    {x:46, y:380,r:9 },{x:170,y:360,r:9 },{x:294,y:380,r:9 },
  ];
  const conns=[[0,1],[0,2],[1,3],[2,4],[3,5],[3,6],[4,6],[4,7],[1,2]];

  let s=`<svg viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;position:absolute;inset:0;pointer-events:none">
<defs>
  <filter id="cGf"><feGaussianBlur stdDeviation="18"/></filter>
  <filter id="cGfs"><feGaussianBlur stdDeviation="4"/></filter>
  <radialGradient id="cRg"><stop offset="0%" stop-color="${A}" stop-opacity="0.2"/><stop offset="100%" stop-color="${A}" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="${W/2}" cy="${H*.28}" rx="${W*.55}" ry="${H*.22}" fill="url(#cRg)" filter="url(#cGf)"/>
`;

  /* background grid */
  for(let r=0;r<H;r+=40) s+=`<line x1="0" y1="${r}" x2="${W}" y2="${r}" stroke="${A}" stroke-width="0.3" stroke-opacity="0.06"/>`;
  for(let c=0;c<W;c+=40) s+=`<line x1="${c}" y1="0" x2="${c}" y2="${H}" stroke="${A}" stroke-width="0.3" stroke-opacity="0.06"/>`;

  /* iso ground plane */
  const gCx=W/2,gCy=H*.88;
  for(let r2=0;r2<=3;r2++){
    const p1=iso(gCx-3*36,gCy-3*18+r2*18,0);
    const p2=iso(gCx+3*36,gCy-3*18+r2*18,0);
    s+=`<line x1="${(p1.px+W/2).toFixed(1)}" y1="${(p1.py+gCy).toFixed(1)}" x2="${(p2.px+W/2).toFixed(1)}" y2="${(p2.py+gCy).toFixed(1)}" stroke="${A}" stroke-width="0.4" stroke-opacity="0.08"/>`;
  }
  for(let c=0;c<=6;c++){
    const p1=iso(gCx-3*36+c*36,gCy-3*18,0);
    const p2=iso(gCx-3*36+c*36,gCy+3*18,0);
    s+=`<line x1="${(p1.px+W/2).toFixed(1)}" y1="${(p1.py+gCy).toFixed(1)}" x2="${(p2.px+W/2).toFixed(1)}" y2="${(p2.py+gCy).toFixed(1)}" stroke="${A}" stroke-width="0.4" stroke-opacity="0.08"/>`;
  }

  /* depth particles */
  s+=depthParticles(A,16,3,W,H);

  /* orbit rings around core */
  s+=orbitRing(np[0].x,np[0].y,34,13,A,6,0,0.38);
  s+=orbitRing(np[0].x,np[0].y,48,19,A,9,1.5,0.18);
  s+=orbitDot(np[0].x,np[0].y,34,13,A,6,0,3.5);

  /* connections with travelling particles */
  conns.forEach(([ai,bi],k)=>{
    const na=np[ai],nb=np[bi];
    s+=`<line x1="${na.x}" y1="${na.y}" x2="${nb.x}" y2="${nb.y}" stroke="${A}" stroke-width="0.8" stroke-opacity="0.18" stroke-dasharray="4 3"/>`;
    s+=`<circle r="2.8" fill="${A}" fill-opacity="0">
<animateMotion path="M ${na.x} ${na.y} L ${nb.x} ${nb.y} L ${na.x} ${na.y}" dur="${2.1+k*.16}s" begin="${k*.22}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.9;0.9;0" dur="${2.1+k*.16}s" begin="${k*.22}s" repeatCount="indefinite"/>
</circle>
<circle r="6" fill="${A}" fill-opacity="0" filter="url(#cGfs)">
<animateMotion path="M ${na.x} ${na.y} L ${nb.x} ${nb.y} L ${na.x} ${na.y}" dur="${2.1+k*.16}s" begin="${k*.22}s" repeatCount="indefinite" calcMode="linear"/>
<animate attributeName="fill-opacity" values="0;0.22;0;0" dur="${2.1+k*.16}s" begin="${k*.22}s" repeatCount="indefinite"/>
</circle>`;
  });

  /* nodes */
  np.forEach((n,i)=>{
    s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${0.1+i*.06}s" fill="freeze"/>
${pulse(n.x,n.y,n.r*2,A,i*.22,2.6)}
<circle cx="${n.x}" cy="${n.y}" r="${n.r+3}" fill="${A}" fill-opacity="0.05"/>
<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${panel}" stroke="${n.main?A:`${A}88`}" stroke-width="${n.main?2:1.2}"/>
<circle cx="${n.x}" cy="${n.y}" r="${n.r*.55}" fill="none" stroke="${A}" stroke-width="0.4" stroke-opacity="0.28"/>
<circle cx="${n.x}" cy="${n.y}" r="${n.r*.35}" fill="${A}" fill-opacity="${n.main?.9:.52}">
${n.main?`<animate attributeName="r" values="${n.r*.35};${n.r*.5};${n.r*.35}" dur="2.2s" repeatCount="indefinite"/>`:""}
</circle>
${n.main?`<text x="${n.x}" y="${n.y+4.5}" fill="#c8ddf0" font-size="6.5" font-family="'Space Mono',monospace" font-weight="700" text-anchor="middle">CORE</text>`:""}
</g>`;
  });

  /* iso floating boxes at corners */
  [{cx:42,cy:52,w:28,h:28,d:16},{cx:298,cy:72,w:22,h:22,d:14}].forEach(({cx,cy,w,h,d},i)=>{
    const adjCx=cx-W/2,adjCy=cy;
    const makeBox=(ccx,ccy,ww,hh,dd)=>{
      const tl=iso(ccx-ww/2,ccy-hh/2,dd),tr=iso(ccx+ww/2,ccy-hh/2,dd);
      const br=iso(ccx+ww/2,ccy+hh/2,dd),bl=iso(ccx-ww/2,ccy+hh/2,dd);
      const r0=iso(ccx+ww/2,ccy-hh/2,dd),r1=iso(ccx+ww/2,ccy-hh/2,0);
      const r2=iso(ccx+ww/2,ccy+hh/2,0),r3=iso(ccx+ww/2,ccy+hh/2,dd);
      const f0=iso(ccx-ww/2,ccy+hh/2,dd),f1=iso(ccx+ww/2,ccy+hh/2,dd);
      const f2=iso(ccx+ww/2,ccy+hh/2,0),f3=iso(ccx-ww/2,ccy+hh/2,0);
      const off=`translate(${cx},${cy})`;
      return `<g transform="${off}" opacity="0">
<animate attributeName="opacity" from="0" to="${0.6-i*.1}" dur="0.5s" begin="${0.4+i*.15}s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -7;0 0" dur="${3.5+i*.6}s" begin="${i*.8}s" repeatCount="indefinite" calcMode="ease"/>
<polygon points="${fpt([tl,tr,br,bl])}" fill="${chrome}" stroke="${A}" stroke-width="0.7" stroke-opacity="0.7"/>
<polygon points="${fpt([r0,r1,r2,r3])}" fill="${A}" fill-opacity="0.07" stroke="${A}" stroke-width="0.5" stroke-opacity="0.38"/>
<polygon points="${fpt([f0,f1,f2,f3])}" fill="${A}" fill-opacity="0.04" stroke="${A}" stroke-width="0.5" stroke-opacity="0.22"/>
<line x1="${fv(tl.px)}" y1="${fv(tl.py)}" x2="${fv(tr.px)}" y2="${fv(tr.py)}" stroke="${A}" stroke-width="1" stroke-opacity="0.5"/>
</g>`;
    };
    s+=makeBox(0,0,w,h,d);
  });

  /* scan line */
  s+=`<rect x="0" y="0" width="${W}" height="1.5" fill="${A}" fill-opacity="0.1">
<animateTransform attributeName="transform" type="translate" values="0 -5;0 ${H+5};0 -5" dur="5s" repeatCount="indefinite" calcMode="linear"/>
</rect>`;

  /* corner braces */
  [[10,10,1,1],[W-10,10,-1,1],[10,H-10,1,-1],[W-10,H-10,-1,-1]].forEach(([x,y,fx,fy])=>{
    s+=`<line x1="${x}" y1="${y}" x2="${x+fx*18}" y2="${y}" stroke="${A}" stroke-width="1.2" stroke-opacity="0.4"/>
<line x1="${x}" y1="${y}" x2="${x}" y2="${y+fy*18}" stroke="${A}" stroke-width="1.2" stroke-opacity="0.4"/>
<circle cx="${x}" cy="${y}" r="1.8" fill="${A}" fill-opacity="0.55"/>`;
  });

  s+=`</svg>`;
  return <div style={{position:"absolute",inset:0,pointerEvents:"none"}} dangerouslySetInnerHTML={{__html:s}}/>;
}

/* ─────────────────────────────────────────────────────────────
   ISO ACCENT DECORATION — floats in form card background
───────────────────────────────────────────────────────────── */
function IsoFormAccent({ accent="#3b82f6" }) {
  const A=accent;
  const W=180,H=140;
  let s=`<svg viewBox="0 0 ${W} ${H}" fill="none" style="position:absolute;top:0;right:0;width:${W}px;height:${H}px;pointer-events:none;opacity:0.55">
<defs><filter id="faGf"><feGaussianBlur stdDeviation="8"/></filter></defs>`;

  /* top-right iso shard cluster */
  const cx2=W*.68,cy2=H*.32,w2=34,h2=34,d2=22;
  const tl=iso(cx2-w2/2,cy2-h2/2,d2),tr=iso(cx2+w2/2,cy2-h2/2,d2);
  const br=iso(cx2+w2/2,cy2+h2/2,d2),bl=iso(cx2-w2/2,cy2+h2/2,d2);
  const r0=iso(cx2+w2/2,cy2-h2/2,d2),r1=iso(cx2+w2/2,cy2-h2/2,0);
  const r2=iso(cx2+w2/2,cy2+h2/2,0),r3=iso(cx2+w2/2,cy2+h2/2,d2);
  const f0=iso(cx2-w2/2,cy2+h2/2,d2),f1=iso(cx2+w2/2,cy2+h2/2,d2);
  const f2=iso(cx2+w2/2,cy2+h2/2,0),f3=iso(cx2-w2/2,cy2+h2/2,0);
  s+=`<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.6s" begin="0.3s" fill="freeze"/>
<animateTransform attributeName="transform" type="rotate" from="0 ${cx2} ${cy2}" to="360 ${cx2} ${cy2}" dur="18s" repeatCount="indefinite"/>
<polygon points="${fpt([tl,tr,br,bl])}" fill="${A}" fill-opacity="0.08" stroke="${A}" stroke-width="0.7" stroke-opacity="0.6"/>
<polygon points="${fpt([r0,r1,r2,r3])}" fill="${A}" fill-opacity="0.04" stroke="${A}" stroke-width="0.5" stroke-opacity="0.35"/>
<polygon points="${fpt([f0,f1,f2,f3])}" fill="${A}" fill-opacity="0.025" stroke="${A}" stroke-width="0.5" stroke-opacity="0.2"/>
<line x1="${fv(tl.px)}" y1="${fv(tl.py)}" x2="${fv(tr.px)}" y2="${fv(tr.py)}" stroke="${A}" stroke-width="1.1" stroke-opacity="0.5"/>
</g>`;

  /* orbit rings */
  s+=`<ellipse cx="${cx2}" cy="${cy2}" rx="26" ry="10" fill="none" stroke="${A}" stroke-width="0.6" stroke-opacity="0.28" stroke-dasharray="3 3">
<animateTransform attributeName="transform" type="rotate" from="0 ${cx2} ${cy2}" to="360 ${cx2} ${cy2}" dur="7s" repeatCount="indefinite"/>
</ellipse>`;

  /* corner accent marks */
  [[W-8,8,-1,1],[W-8,H-8,-1,-1]].forEach(([x,y,fx,fy])=>{
    s+=`<line x1="${x}" y1="${y}" x2="${x+fx*14}" y2="${y}" stroke="${A}" stroke-width="1" stroke-opacity="0.35"/>
<line x1="${x}" y1="${y}" x2="${x}" y2="${y+fy*14}" stroke="${A}" stroke-width="1" stroke-opacity="0.35"/>`;
  });

  s+=`</svg>`;
  return <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}} dangerouslySetInnerHTML={{__html:s}}/>;
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED FIELD
───────────────────────────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <motion.div className="ct-field"
      initial={{ opacity:0,y:14 }}
      whileInView={{ opacity:1,y:0 }}
      viewport={{ once:true }}
      transition={{ duration:0.5,ease:[0.16,1,0.3,1] }}>
      <label className="ct-label">{label}</label>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   INFO ROW
───────────────────────────────────────────────────────────── */
function InfoRow({ icon: Icon, label, value, href, delay }) {
  return (
    <motion.div className="ct-info-row"
      initial={{ opacity:0,x:-16 }}
      whileInView={{ opacity:1,x:0 }}
      viewport={{ once:true }}
      transition={{ delay,duration:0.55,ease:[0.16,1,0.3,1] }}>
      <div className="ct-info-icon"><Icon size={18}/></div>
      <div>
        <p className="ct-info-label">{label}</p>
        {href
          ? <a href={href} className="ct-info-value ct-info-link">{value}</a>
          : <p className="ct-info-value">{value}</p>}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAGNETIC TILT CARD
───────────────────────────────────────────────────────────── */
function MagCard({ children, style, className }) {
  const ref=useRef(null);
  const onMove=(e)=>{
    const el=ref.current; if(!el) return;
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-0.5;
    const y=(e.clientY-r.top)/r.height-0.5;
    el.style.transition="none";
    el.style.transform=`perspective(800px) rotateY(${x*5}deg) rotateX(${-y*5}deg) translateZ(6px)`;
  };
  const onLeave=()=>{
    const el=ref.current; if(!el) return;
    el.style.transition="transform 0.8s cubic-bezier(0.16,1,0.3,1)";
    el.style.transform="perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)";
  };
  return (
    <div ref={ref} className={className} style={{transformStyle:"preserve-3d",willChange:"transform",...style}}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const Contact = () => {
  const [loading,  setLoading ] = useState(false);
  const [status,   setStatus  ] = useState("");
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once:true, margin:"-60px" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setStatus("");
    const form = e.target;
    try {
      const res = await fetch(form.action, {
        method:"POST", body:new FormData(form), headers:{ Accept:"application/json" },
      });
      setStatus(res.ok ? "success" : "error");
      if(res.ok) form.reset();
    } catch { setStatus("error"); }
    setLoading(false);
  };

  return (
    <section id="contact" ref={sectionRef}
      style={{ background:"#ffffff", fontFamily:"'Inter',sans-serif", position:"relative", overflow:"hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&family=Space+Mono:wght@400;700&display=swap');

        .ct * { box-sizing:border-box; }
        .ct-display { font-family:'Sora',sans-serif!important; font-weight:800!important; letter-spacing:-0.02em; }
        .ct-mono    { font-family:'Space Mono',monospace!important; font-weight:700!important; }
        .ct-body    { font-family:'Inter',sans-serif!important; }

        /* dot grid */
        .ct-dotgrid {
          background-image:
            radial-gradient(circle,rgba(15,23,42,0.07) 1px,transparent 1px),
            linear-gradient(rgba(15,23,42,0.022) 1px,transparent 1px),
            linear-gradient(90deg,rgba(15,23,42,0.022) 1px,transparent 1px);
          background-size:28px 28px,80px 80px,80px 80px;
          position:absolute;inset:0;pointer-events:none;z-index:0;
        }

        /* labels */
        .ct-label {
          font-family:'Space Mono',monospace;
          font-size:clamp(0.48rem,1.1vw,0.56rem);
          font-weight:700;
          letter-spacing:0.34em;
          text-transform:uppercase;
          color:rgba(15,23,42,0.44);
          display:block;
          margin-bottom:7px;
        }

        /* inputs */
        .ct-input,.ct-select,.ct-textarea {
          width:100%;
          background:#f8fafc;
          border:1px solid rgba(15,23,42,0.11);
          color:#0f172a;
          font-family:'Inter',sans-serif;
          font-size:clamp(0.85rem,1.8vw,0.95rem);
          font-weight:600;
          padding:13px 16px;
          border-radius:4px;
          outline:none;
          transition:border-color 0.25s,box-shadow 0.25s,background 0.25s;
          appearance:none;
        }
        .ct-input:focus,.ct-select:focus,.ct-textarea:focus {
          border-color:#3b82f6;
          background:#fff;
          box-shadow:0 0 0 3px rgba(59,130,246,0.13);
        }
        .ct-input:hover:not(:focus),.ct-select:hover:not(:focus),.ct-textarea:hover:not(:focus) {
          border-color:rgba(15,23,42,0.24);
          background:#fff;
        }
        .ct-input::placeholder,.ct-textarea::placeholder {
          color:rgba(15,23,42,0.3);
          font-weight:400;
        }
        .ct-textarea { min-height:140px;resize:vertical;line-height:1.7; }
        .ct-select { cursor:pointer; }

        /* field wrapper */
        .ct-field { display:flex;flex-direction:column; }

        /* submit */
        .ct-submit {
          position:relative;overflow:hidden;
          font-family:'Inter',sans-serif;
          font-size:clamp(0.7rem,1.4vw,0.78rem);
          font-weight:800;
          letter-spacing:0.16em;
          text-transform:uppercase;
          padding:16px 36px;
          background:#0f172a;color:#fff;border:none;
          display:inline-flex;align-items:center;justify-content:center;gap:10px;
          cursor:pointer;
          transition:transform 0.28s cubic-bezier(0.16,1,0.3,1),box-shadow 0.28s,background 0.2s;
          border-radius:4px;
          width:100%;
          box-shadow:0 4px 16px rgba(15,23,42,0.18),0 1px 3px rgba(15,23,42,0.12);
        }
        .ct-submit::before {
          content:'';position:absolute;inset:0;
          background:rgba(255,255,255,0.1);
          transform:translateX(-102%);
          transition:transform 0.36s cubic-bezier(0.16,1,0.3,1);
        }
        .ct-submit:hover:not(:disabled)::before { transform:translateX(0); }
        .ct-submit:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:0 16px 44px rgba(15,23,42,0.26);
          background:#1e293b;
        }
        .ct-submit:focus-visible { outline:2px solid #3b82f6;outline-offset:3px; }
        .ct-submit:disabled { opacity:0.65;cursor:not-allowed; }

        /* sidebar (dark) */
        .ct-sidebar {
          background:#050c18;
          position:relative;overflow:hidden;
          border-radius:6px;
          border:1px solid rgba(255,255,255,0.07);
          box-shadow:0 12px 40px rgba(15,23,42,0.18),0 4px 12px rgba(15,23,42,0.12),
            inset 0 1px 0 rgba(255,255,255,0.055);
        }
        .ct-sidebar-inner { position:relative;z-index:1;padding:44px 38px; }

        /* info rows */
        .ct-info-row {
          display:flex;align-items:flex-start;gap:16px;
          padding:18px 0;
          border-bottom:1px solid rgba(255,255,255,0.055);
        }
        .ct-info-row:last-of-type { border-bottom:none; }
        .ct-info-icon {
          width:40px;height:40px;border-radius:4px;
          display:flex;align-items:center;justify-content:center;
          background:rgba(59,130,246,0.12);
          color:#60a5fa;flex-shrink:0;
          border:1px solid rgba(59,130,246,0.22);
          box-shadow:0 2px 8px rgba(59,130,246,0.1);
          transition:background 0.22s,border-color 0.22s,box-shadow 0.22s;
        }
        .ct-info-row:hover .ct-info-icon {
          background:rgba(59,130,246,0.22);
          border-color:rgba(59,130,246,0.44);
          box-shadow:0 0 18px rgba(59,130,246,0.22);
        }
        .ct-info-label {
          font-family:'Space Mono',monospace;font-weight:700;
          font-size:clamp(0.44rem,1vw,0.5rem);letter-spacing:0.34em;text-transform:uppercase;
          color:rgba(255,255,255,0.3);margin-bottom:4px;
        }
        .ct-info-value {
          font-family:'Inter',sans-serif;font-weight:700;
          font-size:clamp(0.84rem,1.8vw,0.95rem);
          color:rgba(255,255,255,0.86);word-break:break-word;
        }
        .ct-info-link { text-decoration:none;transition:color 0.22s; }
        .ct-info-link:hover { color:#60a5fa;text-decoration:underline;text-underline-offset:3px; }

        /* support card */
        .ct-support-card {
          margin-top:26px;
          padding:20px 22px;
          background:linear-gradient(135deg,#0e1e34 0%,#091422 100%);
          border:1px solid rgba(59,130,246,0.22);
          border-radius:5px;
          position:relative;overflow:hidden;
          box-shadow:0 4px 18px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.045);
        }
        .ct-support-card::before {
          content:'';position:absolute;top:0;left:0;right:0;height:2.5px;
          background:linear-gradient(to right,#3b82f6,#818cf8,transparent);
        }

        /* form card */
        .ct-form-card {
          background:#fff;
          border:1px solid rgba(15,23,42,0.08);
          border-radius:6px;
          box-shadow:0 24px 80px rgba(15,23,42,0.08),0 4px 16px rgba(15,23,42,0.05),
            inset 0 1px 0 rgba(255,255,255,0.9);
          overflow:hidden;position:relative;
        }
        .ct-form-inner { padding:44px 40px 40px;position:relative;z-index:1; }

        /* accent bar */
        .ct-accent-bar {
          height:3px;
          background:linear-gradient(to right,#3b82f6,rgba(59,130,246,0.3));
        }

        /* status */
        .ct-status-ok  { background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);color:#10b981;border-radius:4px;padding:13px 18px; }
        .ct-status-err { background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.25); color:#ef4444; border-radius:4px;padding:13px 18px; }

        /* headline */
        .ct-headline {
          font-family:'Sora',sans-serif;font-weight:800;
          font-size:clamp(2.6rem,6.5vw,6.2rem);
          line-height:0.9;letter-spacing:-0.025em;
          color:#0f172a;margin-bottom:16px;
        }

        /* ── Responsive ── */
        @media(max-width:960px) {
          .ct-grid { flex-direction:column!important; }
          .ct-sidebar { flex:none!important;width:100%!important; }
          .ct-sidebar-inner { padding:32px 28px!important; }
          .ct-form-inner { padding:28px 24px 28px!important; }
          .ct-section-pad { padding:72px 20px 80px!important; }
          .ct-form-grid { grid-template-columns:1fr!important; }
        }
        @media(max-width:640px) {
          .ct-sidebar-inner { padding:24px 18px!important; }
          .ct-form-inner { padding:20px 16px 24px!important; }
          .ct-section-pad { padding:52px 16px 60px!important; }
          .ct-submit { font-size:0.72rem!important;padding:14px 24px!important; }
          .ct-info-icon { width:34px!important;height:34px!important; }
          .ct-eyebrow-line { display:none!important; }
        }
        @media(max-width:420px) {
          .ct-form-inner { padding:16px 14px 20px!important; }
          .ct-sidebar-inner { padding:20px 14px!important; }
          .ct-section-pad { padding:44px 14px 52px!important; }
          .ct-input,.ct-select,.ct-textarea { padding:11px 12px!important; }
        }
      `}</style>

      <div className="ct" style={{ position:"relative" }}>
        <div className="ct-dotgrid"/>

        {/* ambient blobs */}
        <div style={{ position:"absolute",inset:0,pointerEvents:"none",zIndex:0,
          background:"radial-gradient(ellipse 55% 44% at 28% 52%,rgba(59,130,246,0.06),transparent 65%)"}}/>
        <div style={{ position:"absolute",inset:0,pointerEvents:"none",zIndex:0,
          background:"radial-gradient(ellipse 40% 35% at 80% 25%,rgba(129,140,248,0.04),transparent 60%)"}}/>

        <div className="ct-section-pad"
          style={{ position:"relative",zIndex:1,maxWidth:1200,margin:"0 auto",padding:"100px 20px 120px" }}>

          {/* EYEBROW */}
          <motion.div
            initial={{ opacity:0,y:14 }} animate={inView?{opacity:1,y:0}:{}}
            transition={{ duration:0.65,ease:[0.16,1,0.3,1] }}
            style={{ display:"flex",alignItems:"center",gap:14,marginBottom:36 }}>
            <motion.div initial={{ scaleX:0 }} animate={inView?{scaleX:1}:{}}
              transition={{ duration:0.55,delay:0.1 }}
              style={{ width:28,height:2.5,background:"linear-gradient(90deg,#3b82f6,#818cf8)",
                transformOrigin:"left",flexShrink:0,borderRadius:99,
                boxShadow:"0 0 10px rgba(59,130,246,0.4)"}}/>
            <span className="ct-mono" style={{ fontSize:"clamp(0.5rem,1.2vw,0.6rem)",letterSpacing:"0.38em",
              color:"#3b82f6",textTransform:"uppercase",whiteSpace:"nowrap" }}>
              Contact — Nationwide Coverage
            </span>
            <motion.div className="ct-eyebrow-line" initial={{ scaleX:0 }} animate={inView?{scaleX:1}:{}}
              transition={{ duration:0.8,delay:0.2 }}
              style={{ flex:1,height:1,background:"linear-gradient(to right,rgba(59,130,246,0.28),transparent)",transformOrigin:"left" }}/>
          </motion.div>

          {/* HEADLINE */}
          <motion.div initial={{ opacity:0,y:24 }} animate={inView?{opacity:1,y:0}:{}}
            transition={{ duration:0.75,delay:0.1,ease:[0.16,1,0.3,1] }}
            style={{ marginBottom:48 }}>
            <h2 className="ct-display ct-headline">
              Get In{" "}
              <span style={{ background:"linear-gradient(90deg,#3b82f6,#818cf8)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
                Touch
              </span>
            </h2>
            <p className="ct-body" style={{ fontSize:"clamp(0.88rem,2vw,1.02rem)",color:"#475569",
              maxWidth:"52ch",lineHeight:1.78,fontWeight:600 }}>
              Ready to modernize your infrastructure? Reach out for projects, technical support, or general inquiries.
            </p>
          </motion.div>

          {/* MAIN GRID */}
          <div className="ct-grid" style={{ display:"flex",gap:20,alignItems:"stretch" }}>

            {/* ── FORM CARD ── */}
            <motion.div style={{ flex:"1.5",minWidth:0 }}
              initial={{ opacity:0,y:28 }} animate={inView?{opacity:1,y:0}:{}}
              transition={{ duration:0.6,delay:0.2,ease:[0.16,1,0.3,1] }}>
              <MagCard className="ct-form-card" style={{ height:"100%" }}>
                <div className="ct-accent-bar"/>
                {/* ISO accent decoration top-right */}
                <IsoFormAccent accent="#3b82f6"/>
                <div className="ct-form-inner">
                  {/* form tag */}
                  <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:24 }}>
                    <motion.span style={{ width:5,height:5,borderRadius:"50%",background:"#3b82f6",flexShrink:0 }}
                      animate={{ scale:[1,1.5,1],opacity:[0.7,1,0.7] }} transition={{ duration:2,repeat:Infinity }}/>
                    <span className="ct-mono" style={{ fontSize:"clamp(0.48rem,1.1vw,0.56rem)",letterSpacing:"0.36em",
                      color:"#3b82f6",textTransform:"uppercase" }}>
                      SEND_MESSAGE
                    </span>
                    <div style={{ flex:1,height:1,background:"rgba(15,23,42,0.07)" }}/>
                  </div>

                  <form action="https://formspree.io/f/myzrrprd" method="POST" onSubmit={handleSubmit}
                    style={{ display:"flex",flexDirection:"column",gap:18 }}>
                    <div className="ct-form-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
                      <Field label="Full Name">
                        <input type="text" name="name" placeholder="John Doe" required className="ct-input"/>
                      </Field>
                      <Field label="Email Address">
                        <input type="email" name="_replyto" placeholder="john@company.com" required className="ct-input"/>
                      </Field>
                    </div>

                    <input type="hidden" name="_from" value="uchenna.m@conotextech.com"/>

                    <Field label="Inquiry Type">
                      <select name="subject" required className="ct-select">
                        <option value="">Select a service...</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Project Request">Project Request</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Cybersecurity Audit">Cybersecurity Audit</option>
                      </select>
                    </Field>

                    <Field label="Message">
                      <textarea name="message" placeholder="How can we help your business thrive?" required className="ct-textarea"/>
                    </Field>

                    <motion.button type="submit" disabled={loading} className="ct-submit" whileTap={{ scale:0.98 }}>
                      {loading ? (
                        <>
                          <motion.span
                            animate={{ rotate:360 }}
                            transition={{ duration:1,repeat:Infinity,ease:"linear" }}
                            style={{ display:"inline-block",width:13,height:13,
                              border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%" }}/>
                          Transmitting...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </>
                      )}
                    </motion.button>

                    <AnimatePresence>
                      {status && (
                        <motion.div key={status}
                          initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
                          className={status==="success"?"ct-status-ok":"ct-status-err"}
                          style={{ display:"flex",alignItems:"center",gap:10 }}>
                          <span className="ct-mono" style={{ fontSize:"clamp(0.48rem,1.1vw,0.54rem)",letterSpacing:"0.2em" }}>
                            {status==="success"
                              ? "✓  MESSAGE SENT SUCCESSFULLY"
                              : "✕  FAILED TO SEND — PLEASE RETRY"}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>
              </MagCard>
            </motion.div>

            {/* ── SIDEBAR ── */}
            <motion.div className="ct-sidebar" style={{ flex:1,minWidth:0 }}
              initial={{ opacity:0,y:28 }} animate={inView?{opacity:1,y:0}:{}}
              transition={{ duration:0.6,delay:0.32,ease:[0.16,1,0.3,1] }}>

              {/* 3-D ISO network scene */}
              <IsoNetworkSVG accent="#3b82f6"/>

              {/* ambient glow */}
              <div style={{ position:"absolute",inset:0,pointerEvents:"none",
                background:"radial-gradient(ellipse 70% 55% at 50% 35%,rgba(59,130,246,0.13),transparent 70%)"}}/>

              <div className="ct-sidebar-inner">
                {/* sidebar tag */}
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:28 }}>
                  <motion.span style={{ width:5,height:5,borderRadius:"50%",background:"#3b82f6",flexShrink:0 }}
                    animate={{ scale:[1,1.5,1],opacity:[0.7,1,0.7] }} transition={{ duration:2,repeat:Infinity,delay:0.5 }}/>
                  <span className="ct-mono" style={{ fontSize:"clamp(0.46rem,1vw,0.52rem)",letterSpacing:"0.36em",
                    color:"#3b82f6",textTransform:"uppercase" }}>
                    CORPORATE_OFFICE
                  </span>
                  <div style={{ flex:1,height:1,background:"rgba(255,255,255,0.07)" }}/>
                </div>

                {/* Info rows */}
                <div style={{ marginBottom:4 }}>
                  <InfoRow icon={MdEmail} label="Email Us" value="uchenna.m@conotextech.com"
                    href="mailto:uchenna.m@conotextech.com" delay={0.1}/>
                  <InfoRow icon={MdPhone} label="Call Us" value="+1 (832) 535-1082"
                    href="tel:+18325351082" delay={0.18}/>
                  <InfoRow icon={MdLocationOn} label="Our HQ" value="Richmond, TX 77469 USA" delay={0.26}/>
                </div>

                {/* Support card */}
                <motion.div className="ct-support-card"
                  initial={{ opacity:0,y:16 }} whileInView={{ opacity:1,y:0 }}
                  viewport={{ once:true }} transition={{ delay:0.4,duration:0.5 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                    <MdSupportAgent size={18} style={{ color:"#3b82f6",flexShrink:0 }}/>
                    <span className="ct-mono" style={{ fontSize:"clamp(0.46rem,1vw,0.54rem)",letterSpacing:"0.26em",
                      color:"#3b82f6",textTransform:"uppercase" }}>
                      24/7 Support
                    </span>
                  </div>
                  <p className="ct-body" style={{ fontSize:"clamp(0.78rem,1.6vw,0.86rem)",
                    color:"rgba(255,255,255,0.6)",lineHeight:1.68,margin:0,fontWeight:500 }}>
                    Clients with contracts can reach our team at{" "}
                    <a href="mailto:uchenna.m@conotextech.com"
                      style={{ color:"#60a5fa",textDecoration:"none",fontWeight:700 }}>
                      uchenna.m@conotextech.com
                    </a>
                  </p>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:14 }}>
                    <motion.span style={{ width:7,height:7,borderRadius:"50%",background:"#10b981",
                      flexShrink:0,display:"inline-block",boxShadow:"0 0 10px rgba(16,185,129,0.6)" }}
                      animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.6,repeat:Infinity }}/>
                    <span className="ct-mono" style={{ fontSize:"clamp(0.42rem,0.9vw,0.48rem)",
                      letterSpacing:"0.28em",color:"rgba(255,255,255,0.26)",textTransform:"uppercase" }}>
                      Systems Online
                    </span>
                  </div>
                </motion.div>

                {/* ISO stat chips */}
                <div style={{ display:"flex",gap:8,marginTop:20,flexWrap:"wrap" }}>
                  {[["99.9%","UPTIME"],["<20ms","LATENCY"],["24/7","SUPPORT"]].map(([val,lbl],i)=>(
                    <motion.div key={lbl}
                      initial={{ opacity:0,y:8 }} whileInView={{ opacity:1,y:0 }}
                      viewport={{ once:true }} transition={{ delay:0.5+i*0.08 }}
                      style={{ flex:"1 1 auto",minWidth:0,padding:"10px 10px",
                        background:"rgba(10,22,40,0.7)",
                        border:"1px solid rgba(59,130,246,0.18)",borderRadius:4,
                        backdropFilter:"blur(10px)",textAlign:"center",
                        boxShadow:"inset 0 1px 0 rgba(255,255,255,0.045)" }}>
                      <div className="ct-display" style={{ fontSize:"clamp(1rem,2vw,1.25rem)",
                        lineHeight:1,color:"#60a5fa",marginBottom:4,
                        textShadow:"0 0 18px rgba(59,130,246,0.45)" }}>
                        {val}
                      </div>
                      <div className="ct-mono" style={{ fontSize:"0.42rem",letterSpacing:"0.22em",
                        color:"rgba(255,255,255,0.28)",textTransform:"uppercase" }}>
                        {lbl}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom index */}
                <motion.div style={{ marginTop:22,paddingTop:18,
                  borderTop:"1px solid rgba(255,255,255,0.055)",
                  display:"flex",justifyContent:"space-between",alignItems:"center" }}
                  initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay:0.55 }}>
                  <span className="ct-mono" style={{ fontSize:"0.44rem",letterSpacing:"0.3em",
                    color:"rgba(255,255,255,0.2)",textTransform:"uppercase" }}>Conotex Tech</span>
                  <span className="ct-mono" style={{ fontSize:"0.44rem",letterSpacing:"0.3em",
                    color:"rgba(255,255,255,0.2)" }}>USA</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* BOTTOM STRIP */}
          <motion.div initial={{ opacity:0 }} animate={inView?{opacity:1}:{}} transition={{ delay:0.9 }}
            style={{ display:"flex",alignItems:"center",gap:16,marginTop:36,flexWrap:"wrap",rowGap:8 }}>
            <div style={{ width:20,height:3,background:"linear-gradient(90deg,#3b82f6,#818cf8)",
              borderRadius:2,boxShadow:"0 0 8px rgba(59,130,246,0.4)" }}/>
            <span className="ct-mono" style={{ fontSize:"clamp(0.44rem,1vw,0.5rem)",letterSpacing:"0.3em",
              color:"rgba(15,23,42,0.3)",textTransform:"uppercase" }}>
              CONTACT_SYS — Secure Channel Active
            </span>
            <div style={{ flex:1,height:1,background:"linear-gradient(to right,rgba(59,130,246,0.2),transparent)" }}/>
            <span className="ct-mono" style={{ fontSize:"clamp(0.44rem,1vw,0.5rem)",letterSpacing:"0.28em",
              color:"rgba(15,23,42,0.22)",textTransform:"uppercase",flexShrink:0 }}>
              06 / 06
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;