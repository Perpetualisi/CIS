import React, { useState, useRef, useEffect } from "react";
import {
  motion, AnimatePresence, useInView,
  useScroll, useTransform, useSpring, useMotionValue
} from "framer-motion";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const TABS = [
  {
    key:"about", label:"About",
    body:"Conotex Integrated Services (CIS), a division of Conotex Systems & Energy Services LLC, is a trusted nationwide provider of low-voltage and managed IT solutions. Since 2011, we have partnered with leading brands to design, deploy, and manage critical infrastructure across Structured Cabling, IP Surveillance, Telecommunications, Audio Visual Systems, and custom digital solutions.",
  },
  {
    key:"mission", label:"Mission",
    body:"To empower businesses with innovative, reliable, and scalable Information Technology solutions that simplify complexity and drive sustainable growth through proactive support and tailored strategies.",
  },
  {
    key:"vision", label:"Vision",
    body:"To be the leading nationwide IT provider, recognized for transformative technology solutions that create a connected, secure, and digitally empowered world — one enterprise at a time.",
  },
  {
    key:"values", label:"Values", body:null,
    values:[
      { title:"Integrity",      desc:"Honesty and accountability in every project.",  icon:"01" },
      { title:"Innovation",     desc:"Forward-thinking technology solutions.",         icon:"02" },
      { title:"Excellence",     desc:"Highest performance and safety standards.",      icon:"03" },
      { title:"Customer Focus", desc:"Tailored strategies for business growth.",       icon:"04" },
      { title:"Reliability",    desc:"Dependable nationwide technical support.",       icon:"05" },
    ],
  },
];

const STATS = [
  { value:13,    suffix:"+", label:"Years\nOperating"    },
  { value:500,   suffix:"+", label:"Projects\nDelivered" },
  { value:50,    suffix:"+", label:"Enterprise\nClients" },
  { value:99.9,  suffix:"%", label:"Uptime\nSLA"         },
];

const BADGES = ["ISO Certified","SOC 2 Type II","BICSI Member","Nationwide"];

const SERVICES_MARQUEE = [
  "Structured Cabling","IP Surveillance","Managed IT","Cybersecurity",
  "VoIP & Telecom","Audio Visual","Desktop Support","Web Development","AI / ML Solutions"
];

/* ── Light palette ─────────────────────────── */
const C = {
  bg:          "#ffffff",
  bgSoft:      "#f8fafc",
  bgCard:      "#ffffff",
  bgChrome:    "#f1f5f9",
  text:        "#0f172a",
  textSub:     "#334155",
  textMuted:   "#64748b",
  textGhost:   "rgba(15,23,42,0.32)",
  accent:      "#3b82f6",
  accentBright:"#2563eb",
  accentDim:   "rgba(59,130,246,0.10)",
  accentGlow:  "rgba(59,130,246,0.18)",
  border:      "rgba(15,23,42,0.08)",
  borderAccent:"rgba(59,130,246,0.28)",
};

/* ─────────────────────────────────────────────
   ISO MATH
───────────────────────────────────────────── */
const iso = (x,y,z)=>({ px:(x-y)*Math.cos(Math.PI/6), py:(x+y)*Math.sin(Math.PI/6)-z });
const fv  = v=>(+v).toFixed(2);
const fpt = ps=>ps.map(p=>`${fv(p.px)},${fv(p.py)}`).join(" ");

function IsoAccentSVG({ accent=C.accent, size=90 }) {
  const cx=0,cy=0,w=28,h=28,d=18;
  const tl=iso(cx-w/2,cy-h/2,d),tr=iso(cx+w/2,cy-h/2,d);
  const br=iso(cx+w/2,cy+h/2,d),bl=iso(cx-w/2,cy+h/2,d);
  const r0=iso(cx+w/2,cy-h/2,d),r1=iso(cx+w/2,cy-h/2,0);
  const r2=iso(cx+w/2,cy+h/2,0),r3=iso(cx+w/2,cy+h/2,d);
  const f0=iso(cx-w/2,cy+h/2,d),f1=iso(cx+w/2,cy+h/2,d);
  const f2=iso(cx+w/2,cy+h/2,0),f3=iso(cx-w/2,cy+h/2,0);
  const o=size/2;
  const s=pt=>`${(pt.px+o).toFixed(2)},${(pt.py+o).toFixed(2)}`;
  const sp=ps=>ps.map(p=>`${(p.px+o).toFixed(2)},${(p.py+o).toFixed(2)}`).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <defs><filter id="ig2"><feGaussianBlur stdDeviation="3"/></filter></defs>
      <polygon points={sp([tl,tr,br,bl])} fill={accent} fillOpacity="0.10"
        stroke={accent} strokeWidth="0.8" strokeOpacity="0.55"/>
      <polygon points={sp([r0,r1,r2,r3])} fill={accent} fillOpacity="0.05"
        stroke={accent} strokeWidth="0.5" strokeOpacity="0.3"/>
      <polygon points={sp([f0,f1,f2,f3])} fill={accent} fillOpacity="0.03"
        stroke={accent} strokeWidth="0.5" strokeOpacity="0.22"/>
      <line x1={s(tl).split(",")[0]} y1={s(tl).split(",")[1]}
            x2={s(tr).split(",")[0]} y2={s(tr).split(",")[1]}
            stroke={accent} strokeWidth="1.2" strokeOpacity="0.6"/>
      <polygon points={sp([tl,tr,br,bl])} fill={accent} fillOpacity="0.06" filter="url(#ig2)"/>
    </svg>
  );
}

function IsoRingAccent({ accent=C.accent, size=110 }) {
  const h=size/2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <ellipse cx={h} cy={h} rx={size*.38} ry={size*.15}
        stroke={accent} strokeWidth="0.9" strokeOpacity="0.3" strokeDasharray="4 3">
        <animateTransform attributeName="transform" type="rotate"
          from={`0 ${h} ${h}`} to={`360 ${h} ${h}`} dur="9s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx={h} cy={h} rx={size*.25} ry={size*.1}
        stroke={accent} strokeWidth="0.5" strokeOpacity="0.16" strokeDasharray="3 4">
        <animateTransform attributeName="transform" type="rotate"
          from={`360 ${h} ${h}`} to={`0 ${h} ${h}`} dur="13s" repeatCount="indefinite"/>
      </ellipse>
      <circle cx={h} cy={h} r="4.5" fill={accent} fillOpacity="0.55">
        <animate attributeName="r" values="4.5;6.5;4.5" dur="2.2s" repeatCount="indefinite"/>
        <animate attributeName="fillOpacity" values="0.55;0.9;0.55" dur="2.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx={h} cy={h} r="11" fill="none" stroke={accent} strokeWidth="0.4" strokeOpacity="0.18"/>
    </svg>
  );
}

function DepthParticles({ accent=C.accent, count=18, w=400, h=300 }) {
  const dots = Array.from({length:count},(_,i)=>{
    const seed=(i+1)*41.7;
    return {
      cx: ((seed*67.3)%w).toFixed(1),
      cy: (40+((seed*83.1)%(h-60))).toFixed(1),
      r:  (1.2+((seed*13)%2.2)).toFixed(1),
      dur:(3.5+((seed*7)%4)).toFixed(2),
      del:(((seed*3)%4)).toFixed(2),
    };
  });
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none"
      style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0}}>
      {dots.map((d,i)=>(
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={accent}>
          <animate attributeName="fillOpacity" values="0;0.28;0"
            dur={`${d.dur}s`} begin={`${d.del}s`} repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate"
            values="0 0;0 -18;0 0" dur={`${(+d.dur*1.4).toFixed(2)}s`}
            begin={`${d.del}s`} repeatCount="indefinite" calcMode="ease"/>
        </circle>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
function Counter({ value, suffix }) {
  const [display, setDisplay] = useState(0);
  const ref  = useRef(null);
  const seen = useInView(ref, { once:true, margin:"-60px" });
  useEffect(() => {
    if (!seen) return;
    const dur=1800, t0=performance.now();
    const tick=(now)=>{
      const p=Math.min((now-t0)/dur,1);
      const e=1-Math.pow(1-p,4);
      const v=value<10?Math.round(e*value*10)/10:Math.floor(e*value);
      setDisplay(v);
      if(p<1) requestAnimationFrame(tick); else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [seen,value]);
  return <span ref={ref}>{value<10?display.toFixed(1):display}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   MAGNETIC TILT CARD
───────────────────────────────────────────── */
function MagCard({ children, className, style, strength=10, glowColor=C.accentGlow }) {
  const ref=useRef(null);
  const onMove=(e)=>{
    const el=ref.current; if(!el) return;
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-0.5;
    const y=(e.clientY-r.top)/r.height-0.5;
    el.style.transition="none";
    el.style.transform=`perspective(700px) rotateY(${x*strength}deg) rotateX(${-y*strength}deg) translateZ(10px)`;
    el.style.boxShadow=`${-x*16}px ${y*16}px 40px ${glowColor}, 0 6px 22px rgba(15,23,42,0.12)`;
  };
  const onLeave=()=>{
    const el=ref.current; if(!el) return;
    el.style.transition="transform 0.72s cubic-bezier(0.16,1,0.3,1), box-shadow 0.72s";
    el.style.transform="perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    el.style.boxShadow="";
  };
  return (
    <div ref={ref} className={className}
      style={{transformStyle:"preserve-3d",willChange:"transform",...style}}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   WORD REVEAL
───────────────────────────────────────────── */
function WordReveal({ text, delay=0, className, style, gradient }) {
  const ref=useRef(null);
  const inView=useInView(ref,{once:true,margin:"-60px"});
  return (
    <span ref={ref} className={className} style={{display:"inline",...style}}>
      {text.split(" ").map((word,i)=>(
        <span key={i} style={{display:"inline-block",overflow:"hidden",marginRight:"0.22em"}}>
          <motion.span
            style={{
              display:"inline-block",
              ...(gradient?{
                background:`linear-gradient(90deg,${C.accent},#818cf8)`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
              }:{}),
            }}
            initial={{y:"110%",opacity:0}}
            animate={inView?{y:"0%",opacity:1}:{}}
            transition={{duration:0.78,delay:delay+i*0.08,ease:[0.16,1,0.3,1]}}
          >{word}</motion.span>
        </span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────
   CURSOR GLOW
───────────────────────────────────────────── */
function CursorGlow() {
  const x=useMotionValue(-300), y=useMotionValue(-300);
  const sx=useSpring(x,{stiffness:120,damping:22});
  const sy=useSpring(y,{stiffness:120,damping:22});
  useEffect(()=>{
    const move=(e)=>{x.set(e.clientX);y.set(e.clientY);};
    window.addEventListener("mousemove",move);
    return ()=>window.removeEventListener("mousemove",move);
  },[]);
  return (
    <motion.div style={{
      position:"fixed",top:0,left:0,zIndex:0,pointerEvents:"none",
      width:520,height:520,borderRadius:"50%",
      background:"radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 65%)",
      filter:"blur(32px)",
      translateX:sx,translateY:sy,marginLeft:-260,marginTop:-260,
    }}/>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const About = () => {
  const [activeTab, setActiveTab] = useState("about");
  const sectionRef=useRef(null);
  const inView=useInView(sectionRef,{once:true,margin:"-80px"});

  const {scrollYProgress}=useScroll({target:sectionRef,offset:["start end","end start"]});
  const videoY    =useTransform(scrollYProgress,[0,1],["-8%","8%"]);
  const bgOpacity =useTransform(scrollYProgress,[0,0.15,0.85,1],[0,1,1,0]);
  const lineH     =useTransform(scrollYProgress,[0,0.6],["0%","100%"]);

  const tab=TABS.find(t=>t.key===activeTab);
  const scrollTo=(id)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  return (
    <section id="about" ref={sectionRef} style={{
      position:"relative",overflow:"hidden",
      background:C.bg,
      paddingTop:120,paddingBottom:148,
      fontFamily:"'Inter',sans-serif",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&family=Space+Mono:wght@400;700&display=swap');
        .ab *{box-sizing:border-box;}
        .ab-display{font-family:'Sora',sans-serif!important;font-weight:800!important;letter-spacing:-0.02em;}
        .ab-mono{font-family:'Space Mono',monospace!important;font-weight:700!important;}
        .ab-body{font-family:'Inter',sans-serif!important;}

        /* dot grid — light */
        .ab-dotgrid{
          background-image:
            radial-gradient(circle,rgba(15,23,42,0.07) 1px,transparent 1px),
            linear-gradient(rgba(15,23,42,0.025) 1px,transparent 1px),
            linear-gradient(90deg,rgba(15,23,42,0.025) 1px,transparent 1px);
          background-size:32px 32px,80px 80px,80px 80px;
        }

        /* stat card — white with crisp shadow */
        .ab-stat{
          position:relative;overflow:hidden;
          background:#fff;
          border:1px solid ${C.border};
          border-radius:6px;
          box-shadow:
            0 1px 3px rgba(15,23,42,0.07),
            0 4px 14px rgba(15,23,42,0.06),
            inset 0 1px 0 rgba(255,255,255,0.9),
            0 0 0 1px rgba(255,255,255,0.8);
          transition:border-color 0.32s,box-shadow 0.32s,transform 0.38s cubic-bezier(0.16,1,0.3,1);
        }
        .ab-stat::before{
          content:'';position:absolute;top:0;left:0;right:0;height:50%;
          background:linear-gradient(to bottom,rgba(255,255,255,0.9),transparent);
          pointer-events:none;
        }
        .ab-stat::after{
          content:'';position:absolute;top:0;right:0;width:22px;height:22px;
          background:${C.accent};opacity:0.1;
          clip-path:polygon(100% 0,100% 100%,0 0);pointer-events:none;
        }
        .ab-stat:hover{
          border-color:${C.borderAccent};
          box-shadow:0 0 0 1px rgba(59,130,246,0.12),0 10px 32px rgba(59,130,246,0.15),0 2px 8px rgba(15,23,42,0.08);
        }

        /* video frame */
        .ab-vid-wrap{perspective:1100px;}
        .ab-vid-inner{
          position:relative;overflow:hidden;
          border:1px solid ${C.border};
          background:#e8edf2;
          border-radius:6px;
          transform:perspective(1100px) rotateY(-6deg) rotateX(2.8deg);
          transition:transform 1s cubic-bezier(0.16,1,0.3,1),box-shadow 1s;
          box-shadow:
            22px 22px 60px rgba(15,23,42,0.14),
            0 0 0 1px rgba(255,255,255,0.9),
            inset 0 1px 0 rgba(255,255,255,0.95);
        }
        .ab-vid-wrap:hover .ab-vid-inner{
          transform:perspective(1100px) rotateY(0deg) rotateX(0deg);
          box-shadow:
            0 28px 80px rgba(59,130,246,0.14),
            0 0 0 1.5px rgba(59,130,246,0.28),
            inset 0 1px 0 rgba(255,255,255,0.95);
        }
        .ab-vid-inner::before{
          content:'';position:absolute;top:0;left:0;
          width:46px;height:46px;z-index:12;pointer-events:none;
          background:
            linear-gradient(to right,${C.accent} 2px,transparent 2px),
            linear-gradient(to bottom,${C.accent} 2px,transparent 2px);
        }
        .ab-vid-inner::after{
          content:'';position:absolute;top:0;right:0;
          width:46px;height:46px;z-index:12;pointer-events:none;
          background:
            linear-gradient(to left,${C.accent} 2px,transparent 2px),
            linear-gradient(to bottom,${C.accent} 2px,transparent 2px);
        }

        /* scan line */
        @keyframes ab-scan{
          0%{top:-12%;opacity:0;}8%{opacity:1;}92%{opacity:1;}100%{top:108%;opacity:0;}
        }
        .ab-scanline{
          position:absolute;inset-x:0;z-index:15;height:80px;pointer-events:none;
          background:linear-gradient(to bottom,transparent 0%,rgba(59,130,246,0.07) 50%,transparent 100%);
          animation:ab-scan 5.5s ease-in-out infinite;animation-delay:0.5s;
        }

        /* tabs */
        .ab-tabs{display:flex;border-bottom:1px solid ${C.border};gap:0;}
        .ab-tab{
          flex:1;position:relative;cursor:pointer;border:none;background:none;outline:none;
          font-family:'Space Mono',monospace;font-size:0.58rem;letter-spacing:0.22em;
          text-transform:uppercase;font-weight:700;padding:13px 6px;
          color:${C.textGhost};transition:color 0.25s;white-space:nowrap;
        }
        .ab-tab:hover{color:${C.textMuted};}
        .ab-tab.active{color:${C.text};}
        .ab-tab::after{
          content:'';position:absolute;bottom:-1px;left:0;right:0;height:2.5px;
          background:linear-gradient(90deg,${C.accent},#818cf8);
          transform:scaleX(0);transform-origin:left;
          transition:transform 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        .ab-tab.active::after{transform:scaleX(1);}

        /* value card — white glass */
        .ab-value-card{
          padding:14px 16px;
          border-left:2px solid rgba(59,130,246,0.2);
          background:rgba(255,255,255,0.8);
          border-radius:0 6px 6px 0;
          backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
          border-top:1px solid rgba(255,255,255,0.9);
          border-right:1px solid ${C.border};
          border-bottom:1px solid ${C.border};
          box-shadow:0 2px 10px rgba(15,23,42,0.06),inset 0 1px 0 rgba(255,255,255,0.9);
          transition:all 0.32s cubic-bezier(0.16,1,0.3,1);cursor:default;
        }
        .ab-value-card:hover{
          border-left-color:${C.accent};
          background:#fff;
          transform:translateX(7px);
          box-shadow:-4px 0 24px rgba(59,130,246,0.12),2px 0 10px rgba(15,23,42,0.06);
        }

        /* primary CTA */
        .ab-btn-primary{
          position:relative;overflow:hidden;cursor:pointer;
          background:${C.text};color:#fff;border:none;
          font-family:'Inter',sans-serif;font-size:0.73rem;font-weight:800;
          letter-spacing:0.14em;text-transform:uppercase;
          padding:15px 30px;display:inline-flex;align-items:center;gap:10px;border-radius:4px;
          box-shadow:0 4px 16px rgba(15,23,42,0.22),0 1px 3px rgba(15,23,42,0.16);
          transition:transform 0.3s cubic-bezier(0.16,1,0.3,1),box-shadow 0.3s;
        }
        .ab-btn-primary::before{
          content:'';position:absolute;inset:0;background:rgba(255,255,255,0.12);
          transform:translateX(-105%);transition:transform 0.38s cubic-bezier(0.16,1,0.3,1);
        }
        .ab-btn-primary:hover::before{transform:translateX(0);}
        .ab-btn-primary:hover{transform:translateY(-3px);box-shadow:0 12px 36px rgba(15,23,42,0.26);}

        /* ghost CTA */
        .ab-btn-ghost{
          position:relative;overflow:hidden;cursor:pointer;
          background:transparent;color:${C.textMuted};
          border:1px solid ${C.border};
          font-family:'Inter',sans-serif;font-size:0.73rem;font-weight:800;
          letter-spacing:0.14em;text-transform:uppercase;
          padding:15px 30px;display:inline-flex;align-items:center;gap:10px;border-radius:4px;
          transition:all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .ab-btn-ghost:hover{
          border-color:${C.borderAccent};color:${C.accent};
          background:${C.accentDim};transform:translateY(-3px);
          box-shadow:0 8px 24px rgba(59,130,246,0.12);
        }

        /* ping */
        @keyframes abPing{75%,100%{transform:scale(2.5);opacity:0;}}
        .ab-ping{animation:abPing 1.6s cubic-bezier(0,0,0.2,1) infinite;}

        /* marquee */
        @keyframes ab-marquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
        .ab-marquee-track{display:flex;width:max-content;animation:ab-marquee 20s linear infinite;}
        .ab-marquee-track:hover{animation-play-state:paused;}

        /* depth entrance */
        @keyframes ab-depthIn{
          from{opacity:0;transform:perspective(900px) rotateX(8deg) translateY(28px) translateZ(-16px);}
          to  {opacity:1;transform:perspective(900px) rotateX(0deg) translateY(0)    translateZ(0);}
        }
        .ab-depth-enter{animation:ab-depthIn 0.78s cubic-bezier(0.16,1,0.3,1) both;}

        .ab-divider{height:1px;background:linear-gradient(to right,transparent,${C.border},transparent);}

        /* cert strip */
        .ab-cert-strip{
          background:#fff;border:1px solid ${C.border};border-radius:6px;
          box-shadow:0 2px 10px rgba(15,23,42,0.06),inset 0 1px 0 rgba(255,255,255,0.9);
        }

        @media(max-width:640px){
          .ab-headline-wrap{font-size:clamp(2.4rem,12vw,3.4rem)!important;}
          .ab-stats-row{grid-template-columns:repeat(2,1fr)!important;}
          .ab-cta-row{flex-direction:column!important;}
          .ab-cta-row button{width:100%!important;justify-content:center!important;}
        }
      `}</style>

      <CursorGlow/>

      {/* dot grid */}
      <div className="ab-dotgrid" style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0}}/>

      {/* depth particles */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
        <DepthParticles accent={C.accent} count={20} w={1200} h={600}/>
      </div>

      {/* ISO shard accents */}
      <div style={{position:"absolute",top:44,right:64,opacity:0.45,zIndex:0,pointerEvents:"none"}}>
        <IsoAccentSVG accent={C.accent} size={100}/>
      </div>
      <div style={{position:"absolute",bottom:64,left:44,opacity:0.3,zIndex:0,pointerEvents:"none"}}>
        <IsoAccentSVG accent="#818cf8" size={76}/>
      </div>
      <div style={{position:"absolute",top:"35%",right:"4%",opacity:0.22,zIndex:0,pointerEvents:"none"}}>
        <IsoRingAccent accent={C.accent} size={120}/>
      </div>
      <div style={{position:"absolute",top:"12%",left:"5%",opacity:0.15,zIndex:0,pointerEvents:"none"}}>
        <IsoRingAccent accent="#818cf8" size={88}/>
      </div>

      {/* ambient blobs — light, very subtle */}
      <motion.div style={{opacity:bgOpacity,position:"absolute",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",width:700,height:700,left:"-12%",top:"-10%",
          background:"radial-gradient(circle,rgba(59,130,246,0.07) 0%,transparent 60%)",filter:"blur(80px)"}}/>
        <div style={{position:"absolute",width:560,height:560,right:"-6%",bottom:"5%",
          background:"radial-gradient(circle,rgba(129,140,248,0.06) 0%,transparent 60%)",filter:"blur(80px)"}}/>
        <div style={{position:"absolute",width:360,height:360,left:"38%",top:"28%",
          background:"radial-gradient(circle,rgba(6,182,212,0.04) 0%,transparent 60%)",filter:"blur(60px)"}}/>
      </motion.div>

      {/* left timeline */}
      <div style={{position:"absolute",left:0,top:"8%",width:3,height:"84%",
        background:"rgba(15,23,42,0.04)",zIndex:1,overflow:"hidden"}}>
        <motion.div style={{
          position:"absolute",top:0,left:0,right:0,
          background:`linear-gradient(to bottom,${C.accent},#818cf8)`,
          height:lineH,
        }}/>
      </div>

      <div style={{position:"relative",zIndex:2,maxWidth:1200,margin:"0 auto",padding:"0 24px"}}>

        {/* EYEBROW */}
        <motion.div
          initial={{opacity:0,y:14}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:0.7,ease:[0.16,1,0.3,1]}}
          style={{display:"flex",alignItems:"center",gap:14,marginBottom:60}}
        >
          <motion.div
            initial={{scaleX:0}} animate={inView?{scaleX:1}:{}}
            transition={{duration:0.6,delay:0.1,ease:[0.16,1,0.3,1]}}
            style={{width:32,height:2.5,background:`linear-gradient(90deg,${C.accent},#818cf8)`,
              transformOrigin:"left",borderRadius:99,boxShadow:`0 0 10px ${C.accentGlow}`}}
          />
          <span className="ab-mono" style={{fontSize:"0.6rem",letterSpacing:"0.42em",
            color:C.accent,textTransform:"uppercase"}}>
            Company Profile — Est. 2011
          </span>
          <motion.div
            initial={{scaleX:0}} animate={inView?{scaleX:1}:{}}
            transition={{duration:0.9,delay:0.2}}
            style={{flex:1,height:1,
              background:`linear-gradient(to right,rgba(59,130,246,0.25),transparent)`,
              transformOrigin:"left"}}
          />
        </motion.div>

        {/* MAIN GRID */}
        <div style={{display:"flex",flexWrap:"wrap",gap:"56px 76px",alignItems:"flex-start"}}>

          {/* LEFT COLUMN */}
          <motion.div
            style={{flex:"0 0 auto",width:"min(100%,440px)"}}
            initial={{opacity:0,x:-52}} animate={inView?{opacity:1,x:0}:{}}
            transition={{duration:1.1,delay:0.1,ease:[0.16,1,0.3,1]}}
          >
            {/* Video 3-D frame */}
            <div className="ab-vid-wrap" style={{position:"relative",marginBottom:20}}>
              <div style={{
                position:"absolute",inset:-16,zIndex:0,pointerEvents:"none",
                background:`radial-gradient(ellipse 70% 55% at 50% 50%,rgba(59,130,246,0.09),transparent)`,
                filter:"blur(22px)",
              }}/>
              <div className="ab-vid-inner" style={{aspectRatio:"16/10",position:"relative",zIndex:1}}>
                <motion.div style={{y:videoY,height:"114%",marginTop:"-7%"}}>
                  <video src="/about.mp4" autoPlay loop muted playsInline
                    style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                </motion.div>
                <div className="ab-scanline"/>
                {/* gloss */}
                <div style={{position:"absolute",inset:0,zIndex:6,pointerEvents:"none",
                  background:"linear-gradient(145deg,rgba(255,255,255,0.12) 0%,transparent 42%)"}}/>
                {/* live badge */}
                <motion.div
                  initial={{opacity:0,y:8}} animate={inView?{opacity:1,y:0}:{}}
                  transition={{delay:0.9,duration:0.5}}
                  style={{position:"absolute",bottom:14,left:14,zIndex:20,
                    display:"flex",alignItems:"center",gap:8,padding:"7px 13px",
                    background:"rgba(255,255,255,0.92)",border:"1px solid rgba(15,23,42,0.08)",
                    backdropFilter:"blur(16px)",
                    boxShadow:"0 4px 16px rgba(15,23,42,0.1)"}}
                >
                  <span style={{position:"relative",display:"flex",width:8,height:8,flexShrink:0}}>
                    <span className="ab-ping" style={{position:"absolute",inset:0,
                      borderRadius:"50%",background:C.accent}}/>
                    <span style={{position:"relative",width:8,height:8,borderRadius:"50%",
                      background:C.accent,display:"block"}}/>
                  </span>
                  <span className="ab-mono" style={{fontSize:"0.52rem",letterSpacing:"0.28em",
                    color:"rgba(15,23,42,0.5)",textTransform:"uppercase"}}>
                    Est. 2011 — Live Ops
                  </span>
                </motion.div>
                {/* corner label */}
                <div style={{position:"absolute",top:14,right:14,zIndex:20}}>
                  <span className="ab-mono" style={{fontSize:"0.5rem",letterSpacing:"0.42em",
                    color:"rgba(15,23,42,0.2)",textTransform:"uppercase"}}>CIS_CORP</span>
                </div>
              </div>
              <div style={{position:"absolute",bottom:-20,left:"8%",right:"8%",
                height:24,borderRadius:"50%",
                background:"rgba(59,130,246,0.1)",filter:"blur(22px)",
                pointerEvents:"none",zIndex:0}}/>
            </div>

            {/* Stats grid */}
            <div className="ab-stats-row" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {STATS.map((s,i)=>(
                <motion.div key={s.label}
                  initial={{opacity:0,y:22,scale:0.9}}
                  animate={inView?{opacity:1,y:0,scale:1}:{}}
                  transition={{duration:0.68,delay:0.38+i*0.1,ease:[0.16,1,0.3,1]}}
                >
                  <MagCard className="ab-stat"
                    style={{padding:"16px 8px",textAlign:"center",cursor:"default"}}
                    strength={9} glowColor="rgba(59,130,246,0.16)">
                    <div className="ab-display" style={{
                      fontSize:"1.85rem",lineHeight:1,color:C.text,marginBottom:6,
                    }}>
                      <Counter value={s.value} suffix={s.suffix}/>
                    </div>
                    <div className="ab-mono" style={{fontSize:"0.46rem",letterSpacing:"0.2em",
                      color:C.textMuted,textTransform:"uppercase",whiteSpace:"pre-line",lineHeight:1.5}}>
                      {s.label}
                    </div>
                  </MagCard>
                </motion.div>
              ))}
            </div>

            {/* Cert strip */}
            <motion.div
              initial={{opacity:0,y:12}} animate={inView?{opacity:1,y:0}:{}}
              transition={{delay:0.9,duration:0.55}}
              className="ab-cert-strip"
              style={{marginTop:18,padding:"14px 16px",
                display:"flex",alignItems:"center",justifyContent:"space-between"}}
            >
              {BADGES.map((b)=>(
                <div key={b} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                  <IsoAccentSVG accent={C.accent} size={28}/>
                  <span className="ab-mono" style={{fontSize:"0.42rem",letterSpacing:"0.16em",
                    color:C.textMuted,textTransform:"uppercase",textAlign:"center"}}>{b}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div
            style={{flex:1,minWidth:280}}
            initial={{opacity:0,x:52}} animate={inView?{opacity:1,x:0}:{}}
            transition={{duration:1.1,delay:0.2,ease:[0.16,1,0.3,1]}}
          >
            {/* Headline */}
            <div className="ab-headline-wrap ab-display"
              style={{fontSize:"clamp(3rem,5.5vw,6rem)",lineHeight:0.9,
                color:C.text,marginBottom:26,overflow:"hidden"}}>
              <div style={{overflow:"hidden"}}>
                <WordReveal text="Integrated" delay={0.3} className="ab-display"
                  style={{fontSize:"inherit",lineHeight:"inherit",display:"block"}}/>
              </div>
              <div style={{overflow:"hidden"}}>
                <WordReveal text="Technology" delay={0.42} gradient className="ab-display"
                  style={{fontSize:"inherit",lineHeight:"inherit",display:"block"}}/>
              </div>
              <div style={{overflow:"hidden"}}>
                <WordReveal text="Solutions" delay={0.54} className="ab-display"
                  style={{fontSize:"inherit",lineHeight:"inherit",display:"block"}}/>
              </div>
            </div>

            {/* Sub copy */}
            <motion.p className="ab-body"
              style={{fontSize:"1rem",lineHeight:1.78,color:C.textSub,
                fontWeight:600,maxWidth:"46ch",marginBottom:30}}
              initial={{opacity:0,y:12}} animate={inView?{opacity:1,y:0}:{}}
              transition={{duration:0.7,delay:0.58}}
            >
              Nationwide enterprise IT infrastructure — designed, deployed, and managed
              by engineers who've been doing it since 2011.
            </motion.p>

            {/* Divider */}
            <motion.div className="ab-divider"
              style={{marginBottom:28,transformOrigin:"left"}}
              initial={{scaleX:0}} animate={inView?{scaleX:1}:{}}
              transition={{duration:0.9,delay:0.62,ease:[0.16,1,0.3,1]}}/>

            {/* Tabs */}
            <motion.div className="ab-tabs" style={{marginBottom:28}}
              initial={{opacity:0}} animate={inView?{opacity:1}:{}}
              transition={{duration:0.6,delay:0.65}}>
              {TABS.map(t=>(
                <button key={t.key}
                  className={`ab-tab ${activeTab===t.key?"active":""}`}
                  onClick={()=>setActiveTab(t.key)}>{t.label}</button>
              ))}
            </motion.div>

            {/* Tab body */}
            <div style={{minHeight:210}}>
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{opacity:0,y:16,filter:"blur(6px)"}}
                  animate={{opacity:1,y:0,filter:"blur(0px)"}}
                  exit={{opacity:0,y:-10,filter:"blur(6px)"}}
                  transition={{duration:0.38,ease:[0.16,1,0.3,1]}}>

                  {tab.body && (
                    <p className="ab-body" style={{fontSize:"0.95rem",lineHeight:1.85,
                      color:C.textSub,fontWeight:500,maxWidth:"50ch",marginBottom:26}}>
                      {tab.body}
                    </p>
                  )}

                  {tab.values && (
                    <div style={{display:"grid",
                      gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",
                      gap:8,marginBottom:26}}>
                      {tab.values.map((v,i)=>(
                        <motion.div key={v.title} className="ab-value-card"
                          initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}}
                          transition={{delay:i*0.08,duration:0.45,ease:[0.16,1,0.3,1]}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                            <span className="ab-mono" style={{fontSize:"0.52rem",
                              color:C.accent,letterSpacing:"0.1em"}}>{v.icon}</span>
                            <span className="ab-mono" style={{fontSize:"0.56rem",letterSpacing:"0.26em",
                              color:C.text,textTransform:"uppercase"}}>{v.title}</span>
                          </div>
                          <div className="ab-body" style={{fontSize:"0.8rem",color:C.textMuted,
                            lineHeight:1.6,fontWeight:600}}>{v.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <motion.div className="ab-cta-row"
                    style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}
                    initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                    transition={{delay:0.28,duration:0.45}}>
                    <button className="ab-btn-primary" onClick={()=>scrollTo("contact")}>
                      Work With Us
                      <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor"
                          strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="ab-btn-ghost" onClick={()=>scrollTo("services")}>
                      Our Services
                      <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor"
                          strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Badge strip */}
            <motion.div
              style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap",
                marginTop:32,paddingTop:24,borderTop:`1px solid ${C.border}`}}
              initial={{opacity:0}} animate={inView?{opacity:1}:{}}
              transition={{delay:1,duration:0.6}}>
              {BADGES.map((badge,i)=>(
                <motion.div key={badge}
                  style={{display:"flex",alignItems:"center",gap:8}}
                  initial={{opacity:0,x:-8}} animate={inView?{opacity:1,x:0}:{}}
                  transition={{delay:1+i*0.08,duration:0.4}}>
                  <span style={{position:"relative",display:"flex",
                    width:8,height:8,flexShrink:0,alignItems:"center",justifyContent:"center"}}>
                    <span className="ab-ping" style={{position:"absolute",inset:0,
                      borderRadius:"50%",background:C.accent,opacity:0.45}}/>
                    <span style={{position:"relative",width:8,height:8,borderRadius:"50%",
                      background:C.accent,display:"block"}}/>
                  </span>
                  <span className="ab-mono" style={{fontSize:"0.54rem",letterSpacing:"0.24em",
                    color:C.textMuted,textTransform:"uppercase"}}>
                    {badge}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* MARQUEE STRIP */}
        <motion.div
          style={{marginTop:80,overflow:"hidden",
            borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,
            padding:"16px 0",background:C.bgSoft}}
          initial={{opacity:0}} animate={inView?{opacity:1}:{}}
          transition={{delay:1.1,duration:0.7}}>
          <div className="ab-marquee-track">
            {[...Array(2)].map((_,rep)=>(
              <React.Fragment key={rep}>
                {SERVICES_MARQUEE.map((item,i)=>(
                  <span key={`${rep}-${i}`}
                    style={{display:"inline-flex",alignItems:"center",gap:24,paddingRight:52}}>
                    <span className="ab-mono" style={{fontSize:"0.6rem",letterSpacing:"0.34em",
                      color:C.textMuted,textTransform:"uppercase",whiteSpace:"nowrap"}}>
                      {item}
                    </span>
                    <span style={{width:4,height:4,borderRadius:"50%",background:C.accent,
                      opacity:0.5,flexShrink:0}}/>
                  </span>
                ))}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;