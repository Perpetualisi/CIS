import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";

const TABS = [
  {
    key: "about", label: "About",
    body: "Conotex Integrated Services (CIS), a division of Conotex Systems & Energy Services LLC, is a trusted nationwide provider of low-voltage and managed IT solutions. Since 2011, we have partnered with leading brands to design, deploy, and manage critical infrastructure across Structured Cabling, IP Surveillance, Telecommunications, Audio Visual Systems, and custom digital solutions.",
  },
  {
    key: "mission", label: "Mission",
    body: "To empower businesses with innovative, reliable, and scalable Information Technology solutions that simplify complexity and drive sustainable growth through proactive support and tailored strategies.",
  },
  {
    key: "vision", label: "Vision",
    body: "To be the leading nationwide IT provider, recognized for transformative technology solutions that create a connected, secure, and digitally empowered world — one enterprise at a time.",
  },
  {
    key: "values", label: "Values", body: null,
    values: [
      { title: "Integrity",      desc: "Honesty and accountability in every project." },
      { title: "Innovation",     desc: "Forward-thinking technology solutions." },
      { title: "Excellence",     desc: "Highest performance and safety standards." },
      { title: "Customer Focus", desc: "Tailored strategies for business growth." },
      { title: "Reliability",    desc: "Dependable nationwide technical support." },
    ],
  },
];

const STATS = [
  { value: "13+",   label: "Years Operating"    },
  { value: "500+",  label: "Projects Delivered" },
  { value: "50+",   label: "Enterprise Clients" },
  { value: "99.9%", label: "Uptime SLA"         },
];

function TiltCard({ children, className, style }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transition = "none";
    el.style.transform  = `perspective(600px) rotateY(${x*10}deg) rotateX(${-y*10}deg) scale3d(1.03,1.03,1.03)`;
    el.style.boxShadow  = `${-x*18}px ${-y*18}px 50px rgba(59,130,246,0.18), 0 0 0 1px rgba(59,130,246,0.22)`;
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.6s";
    el.style.transform  = "perspective(600px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
    el.style.boxShadow  = "";
  };
  return (
    <div ref={ref} className={className} style={{ transformStyle:"preserve-3d", willChange:"transform", ...style }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

function StatCard({ value, label, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:20, rotateX:-15 }}
      animate={inView ? { opacity:1, y:0, rotateX:0 } : {}}
      transition={{ duration:0.7, delay, ease:[0.16,1,0.3,1] }}
      style={{ perspective:600 }}>
      <TiltCard className="ab-stat flex flex-col items-center justify-center p-5 text-center cursor-default relative overflow-hidden">
        <div className="ab-stat-gloss" />
        <span className="ab-display leading-none text-white mb-1" style={{ fontSize:"2.4rem" }}>{value}</span>
        <span className="ab-mono text-white/25 uppercase" style={{ fontSize:"0.6rem", letterSpacing:"0.28em" }}>{label}</span>
      </TiltCard>
    </motion.div>
  );
}

function Orb({ size, x, y, color, delay }) {
  return (
    <motion.div className="absolute rounded-full pointer-events-none"
      style={{ width:size, height:size, left:x, top:y,
        background:`radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter:"blur(50px)", opacity:0.12 }}
      animate={{ y:[0,-24,0], opacity:[0.08,0.18,0.08] }}
      transition={{ duration:9+delay, repeat:Infinity, ease:"easeInOut", delay }} />
  );
}

const About = () => {
  const [activeTab, setActiveTab] = useState("about");
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once:true, margin:"-60px" });
  const { scrollYProgress } = useScroll({ target:sectionRef, offset:["start end","end start"] });
  const videoY = useTransform(scrollYProgress, [0,1], ["-5%","5%"]);
  const tab = TABS.find(t => t.key === activeTab);

  return (
    <section id="about" ref={sectionRef} className="ab-root relative overflow-hidden"
      style={{ background:"#03040a", paddingTop:100, paddingBottom:100 }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        .ab-root * { font-family:'Barlow',sans-serif; box-sizing:border-box; }
        .ab-display { font-family:'Bebas Neue',sans-serif !important; letter-spacing:0.03em; }
        .ab-mono    { font-family:'Space Mono',monospace !important; }

        .ab-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px);
          background-size:72px 72px;
        }
        .ab-noise {
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity:0.02; pointer-events:none;
        }

        /* stat */
        .ab-stat {
          background:linear-gradient(135deg,rgba(255,255,255,0.045) 0%,rgba(255,255,255,0.01) 100%);
          border:1px solid rgba(255,255,255,0.07);
          transition:border-color 0.3s;
        }
        .ab-stat:hover { border-color:rgba(59,130,246,0.4); }
        .ab-stat-gloss {
          position:absolute; top:0; left:0; right:0; height:45%;
          background:linear-gradient(to bottom,rgba(255,255,255,0.06),transparent);
          pointer-events:none;
        }

        /* 3D video */
        .ab-vid-outer { perspective:900px; }
        .ab-vid-inner {
          position:relative; overflow:hidden;
          border:1px solid rgba(255,255,255,0.07);
          background:#050610;
          transform:perspective(900px) rotateY(-4deg) rotateX(2.5deg);
          transition:transform 0.9s cubic-bezier(0.16,1,0.3,1), box-shadow 0.9s;
          box-shadow:24px 24px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07);
        }
        .ab-vid-outer:hover .ab-vid-inner {
          transform:perspective(900px) rotateY(0deg) rotateX(0deg);
          box-shadow:0 32px 90px rgba(59,130,246,0.22), 0 0 0 1px rgba(59,130,246,0.28), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .ab-vid-inner::before {
          content:''; position:absolute; inset:0; z-index:10; pointer-events:none;
          background:
            linear-gradient(to right,rgba(59,130,246,0.28) 0%,transparent 35%),
            linear-gradient(to bottom,rgba(59,130,246,0.14) 0%,transparent 28%);
          transition:opacity 0.4s;
        }
        .ab-vid-outer:hover .ab-vid-inner::before { opacity:0.45; }
        .ab-vid-inner::after {
          content:''; position:absolute; top:0; left:0; width:56px; height:56px; z-index:11; pointer-events:none;
          background:linear-gradient(to right,#3b82f6 1.5px,transparent 1.5px),
                     linear-gradient(to bottom,#3b82f6 1.5px,transparent 1.5px);
        }

        /* tabs — NO overflow, evenly spread */
        .ab-tabs {
          display:flex;
          overflow:hidden;
          border-bottom:1px solid rgba(255,255,255,0.06);
        }
        .ab-tab {
          flex:1; position:relative; cursor:pointer;
          border:none; background:none; outline:none;
          transition:color 0.2s; white-space:nowrap;
        }
        .ab-tab::after {
          content:''; position:absolute; bottom:0; left:0; right:0; height:1.5px;
          background:linear-gradient(to right,#3b82f6,#818cf8);
          transform:scaleX(0); transform-origin:left;
          transition:transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .ab-tab.active { color:#fff !important; }
        .ab-tab.active::after { transform:scaleX(1); }

        /* value cards */
        .ab-value {
          padding:10px 14px;
          border-left:2px solid rgba(59,130,246,0.2);
          background:rgba(255,255,255,0.02);
          transition:all 0.25s;
        }
        .ab-value:hover {
          border-left-color:#3b82f6;
          background:rgba(59,130,246,0.07);
          transform:perspective(400px) translateZ(8px) translateX(4px);
          box-shadow:-4px 0 24px rgba(59,130,246,0.15);
        }

        /* cta */
        .ab-cta { position:relative; overflow:hidden; transition:all 0.25s cubic-bezier(0.16,1,0.3,1); }
        .ab-cta::before {
          content:''; position:absolute; inset:0;
          background:rgba(255,255,255,0.13);
          transform:translateX(-101%);
          transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .ab-cta:hover::before { transform:translateX(0); }
        .ab-cta:hover { transform:translateY(-2px); box-shadow:0 12px 36px rgba(59,130,246,0.42); }

        @keyframes abPing { 75%,100%{transform:scale(2.2);opacity:0;} }
        .ab-ping { animation:abPing 1.6s cubic-bezier(0,0,0.2,1) infinite; }

        .ab-divider { height:1px; background:linear-gradient(to right,transparent,rgba(255,255,255,0.07),transparent); }
      `}</style>

      <div className="ab-grid absolute inset-0 pointer-events-none" />
      <div className="ab-noise absolute inset-0" />
      <Orb size={520} x="-8%"  y="5%"  color="#3b82f6" delay={0} />
      <Orb size={380} x="68%"  y="45%" color="#818cf8" delay={3} />
      <Orb size={280} x="28%"  y="72%" color="#06b6d4" delay={5} />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">

        {/* eyebrow */}
        <motion.div initial={{opacity:0,y:12}} animate={inView?{opacity:1,y:0}:{}}
          transition={{duration:0.6}} className="flex items-center gap-3 mb-12">
          <div style={{width:28,height:1,background:"#3b82f6"}} />
          <span className="ab-mono uppercase text-blue-500" style={{fontSize:"0.6rem",letterSpacing:"0.45em"}}>
            Company Profile — Est. 2011
          </span>
          <div style={{flex:1,height:1,background:"linear-gradient(to right,rgba(59,130,246,0.35),transparent)"}} />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

          {/* ══ LEFT ══ */}
          <motion.div className="w-full lg:w-[44%] flex-shrink-0"
            initial={{opacity:0,x:-40}} animate={inView?{opacity:1,x:0}:{}}
            transition={{duration:0.9,delay:0.1,ease:[0.16,1,0.3,1]}}>

            {/* 3D video */}
            <div className="ab-vid-outer mb-6" style={{position:"relative"}}>
              <div className="ab-vid-inner" style={{aspectRatio:"16/10"}}>
                <motion.div style={{y:videoY,height:"112%",marginTop:"-6%"}}>
                  <video src="/about.mp4" autoPlay loop muted playsInline
                    style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
                </motion.div>

                {/* Scan line */}
                <motion.div className="absolute inset-x-0 z-20 pointer-events-none"
                  style={{height:70,background:"linear-gradient(to bottom,transparent,rgba(59,130,246,0.07),transparent)"}}
                  animate={{top:["-10%","110%"]}}
                  transition={{duration:5,repeat:Infinity,ease:"linear",repeatDelay:2.5}} />

                {/* Badge */}
                <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2.5 px-3 py-1.5"
                  style={{background:"rgba(3,4,10,0.88)",border:"1px solid rgba(255,255,255,0.09)",backdropFilter:"blur(16px)"}}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="ab-ping absolute inline-flex h-full w-full rounded-full" style={{background:"#3b82f6"}} />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{background:"#3b82f6"}} />
                  </span>
                  <span className="ab-mono text-white/50 uppercase" style={{fontSize:"0.56rem",letterSpacing:"0.3em"}}>
                    Est. 2011 — Live Operations
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-30 ab-mono text-white/18 uppercase"
                  style={{fontSize:"0.56rem",letterSpacing:"0.45em"}}>CIS_CORP</div>
              </div>

              {/* Drop shadow plane */}
              <div style={{position:"absolute",bottom:-14,left:"8%",right:"8%",height:18,
                background:"rgba(59,130,246,0.18)",filter:"blur(18px)",borderRadius:"50%",pointerEvents:"none"}} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {STATS.map((s,i) => <StatCard key={s.label} {...s} delay={0.15+i*0.08} />)}
            </div>
          </motion.div>

          {/* ══ RIGHT ══ */}
          <motion.div className="w-full lg:flex-1 min-w-0"
            initial={{opacity:0,x:40}} animate={inView?{opacity:1,x:0}:{}}
            transition={{duration:0.9,delay:0.2,ease:[0.16,1,0.3,1]}}>

            <h2 className="ab-display text-white mb-4"
              style={{fontSize:"clamp(3rem,5.5vw,5.6rem)",lineHeight:0.88}}>
              Integrated<br />
              <span style={{background:"linear-gradient(90deg,#3b82f6,#818cf8)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
                Technology
              </span><br />
              Solutions
            </h2>

            <p className="text-white/38 font-light leading-relaxed mb-7"
              style={{fontSize:"0.87rem",maxWidth:"42ch"}}>
              Nationwide enterprise IT infrastructure — designed, deployed, and managed by engineers who've been doing it since 2011.
            </p>

            <div className="ab-divider mb-7" />

            {/* Tabs — flex with overflow:hidden, no scrollbar */}
            <div className="ab-tabs mb-7">
              {TABS.map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`ab-tab ab-mono py-3 px-2 ${activeTab===t.key?"active":""}`}
                  style={{fontSize:"0.6rem",letterSpacing:"0.25em",
                    color:activeTab===t.key?"#fff":"rgba(255,255,255,0.28)"}}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{minHeight:200}}>
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
                  exit={{opacity:0,y:-10}}
                  transition={{duration:0.35,ease:[0.16,1,0.3,1]}}>

                  {tab.body && (
                    <p className="text-white/48 font-light leading-relaxed"
                      style={{fontSize:"0.875rem",maxWidth:"50ch"}}>{tab.body}</p>
                  )}

                  {tab.values && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tab.values.map((v,i) => (
                        <motion.div key={v.title} className="ab-value"
                          initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                          transition={{delay:i*0.07,duration:0.4}}>
                          <div className="ab-mono text-white/72 uppercase mb-1"
                            style={{fontSize:"0.6rem",letterSpacing:"0.3em"}}>{v.title}</div>
                          <div className="text-white/32 font-light"
                            style={{fontSize:"0.76rem"}}>{v.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <motion.div className="flex items-center gap-5 mt-8"
                    initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.28}}>
                    <a href="#contact" className="ab-cta ab-mono inline-flex items-center gap-2.5 px-6 py-3 text-white"
                      style={{fontSize:"0.6rem",letterSpacing:"0.22em",
                        background:"#3b82f6",border:"1px solid rgba(59,130,246,0.5)"}}>
                      WORK WITH US
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                    <a href="#services" className="ab-mono text-white/28 hover:text-white/60 transition-colors"
                      style={{fontSize:"0.6rem",letterSpacing:"0.22em"}}>
                      OUR SERVICES →
                    </a>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;