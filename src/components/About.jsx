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
      { title: "Integrity",      desc: "Honesty and accountability in every project.",  icon: "01" },
      { title: "Innovation",     desc: "Forward-thinking technology solutions.",         icon: "02" },
      { title: "Excellence",     desc: "Highest performance and safety standards.",      icon: "03" },
      { title: "Customer Focus", desc: "Tailored strategies for business growth.",       icon: "04" },
      { title: "Reliability",    desc: "Dependable nationwide technical support.",       icon: "05" },
    ],
  },
];

const STATS = [
  { value: 13,    suffix: "+",  label: "Years\nOperating"    },
  { value: 500,   suffix: "+",  label: "Projects\nDelivered" },
  { value: 50,    suffix: "+",  label: "Enterprise\nClients" },
  { value: 99.9,  suffix: "%",  label: "Uptime\nSLA"         },
];

const BADGES = ["ISO Certified", "SOC 2 Type II", "BICSI Member", "Nationwide"];

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
function Counter({ value, suffix }) {
  const [display, setDisplay] = useState(0);
  const ref  = useRef(null);
  const seen = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!seen) return;
    const dur = 1600;
    const t0  = performance.now();
    const tick = (now) => {
      const p  = Math.min((now - t0) / dur, 1);
      const e  = 1 - Math.pow(1 - p, 4);
      const v  = value < 10 ? Math.round(e * value * 10) / 10 : Math.floor(e * value);
      setDisplay(v);
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [seen, value]);

  return (
    <span ref={ref}>
      {value < 10 ? display.toFixed(1) : display}{suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────
   MAGNETIC TILT CARD
───────────────────────────────────────────── */
function MagCard({ children, className, style, strength = 10 }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r  = el.getBoundingClientRect();
    const x  = (e.clientX - r.left)  / r.width  - 0.5;
    const y  = (e.clientY - r.top)   / r.height - 0.5;
    el.style.transition = "none";
    el.style.transform  = `perspective(600px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) translateZ(8px)`;
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transition = "transform 0.7s cubic-bezier(0.16,1,0.3,1)";
    el.style.transform  = "perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
  };
  return (
    <div ref={ref} className={className}
      style={{ transformStyle: "preserve-3d", willChange: "transform", ...style }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   STAGGERED WORD REVEAL
───────────────────────────────────────────── */
function WordReveal({ text, delay = 0, className, style, gradient }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words  = text.split(" ");
  return (
    <span ref={ref} className={className} style={{ display: "inline", ...style }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", marginRight: "0.22em" }}>
          <motion.span
            style={{
              display: "inline-block",
              ...(gradient ? {
                background: "linear-gradient(90deg,#3b82f6,#818cf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              } : {}),
            }}
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : {}}
            transition={{ duration: 0.75, delay: delay + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────
   CURSOR GLOW (follows mouse inside section)
───────────────────────────────────────────── */
function CursorGlow() {
  const x  = useMotionValue(-200);
  const y  = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 120, damping: 22 });
  const sy = useSpring(y, { stiffness: 120, damping: 22 });

  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed", top: 0, left: 0, zIndex: 0,
        pointerEvents: "none",
        width: 480, height: 480, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 65%)",
        filter: "blur(30px)",
        translateX: sx, translateY: sy,
        marginLeft: -240, marginTop: -240,
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const About = () => {
  const [activeTab, setActiveTab] = useState("about");
  const sectionRef = useRef(null);
  const inView     = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef, offset: ["start end", "end start"],
  });

  const videoY    = useTransform(scrollYProgress, [0, 1], ["-8%",  "8%"]);
  const lineH     = useTransform(scrollYProgress, [0, 0.6], ["0%", "100%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const tab = TABS.find(t => t.key === activeTab);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  /* ── line-by-line counter for decorative left bar ── */
  const lineRef    = useRef(null);
  const lineInView = useInView(lineRef, { once: true });

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#f1f3f5",
        paddingTop: 120,
        paddingBottom: 140,
        fontFamily: "'Barlow', sans-serif",
      }}
    >
      {/* ── Google fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Space+Mono:wght@400;700&display=swap');

        /* ── Reset helpers ── */
        .ab * { box-sizing: border-box; }

        /* ── Typography ── */
        .ab-display { font-family:'Bebas Neue',sans-serif !important; letter-spacing:0.03em; }
        .ab-mono    { font-family:'Space Mono',monospace !important; }
        .ab-body    { font-family:'Barlow',sans-serif !important; }

        /* ── Subtle dot grid ── */
        .ab-dotgrid {
          background-image: radial-gradient(circle, rgba(0,0,0,0.09) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        /* ── Stat card ── */
        .ab-stat {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 2px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .ab-stat:hover {
          border-color: rgba(59,130,246,0.4);
          box-shadow: 0 8px 28px rgba(59,130,246,0.13);
        }

        /* ── Video frame ── */
        .ab-vid-wrap {
          perspective: 1000px;
        }
        .ab-vid-inner {
          position: relative; overflow: hidden;
          border: 1px solid rgba(0,0,0,0.09);
          background: #e2e5e9;
          border-radius: 3px;
          transform: perspective(1000px) rotateY(-5deg) rotateX(2.5deg);
          transition: transform 0.95s cubic-bezier(0.16,1,0.3,1),
                      box-shadow 0.95s cubic-bezier(0.16,1,0.3,1);
          box-shadow:
            18px 18px 60px rgba(0,0,0,0.13),
            0 0 0 1px rgba(255,255,255,0.85),
            inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .ab-vid-wrap:hover .ab-vid-inner {
          transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
          box-shadow:
            0 28px 80px rgba(59,130,246,0.14),
            0 0 0 1.5px rgba(59,130,246,0.25),
            inset 0 1px 0 rgba(255,255,255,0.95);
        }
        /* Corner mark */
        .ab-vid-inner::after {
          content: ''; position: absolute; top: 0; left: 0;
          width: 44px; height: 44px; z-index: 12; pointer-events: none;
          background:
            linear-gradient(to right, #3b82f6 2px, transparent 2px),
            linear-gradient(to bottom, #3b82f6 2px, transparent 2px);
        }

        /* ── Scan line ── */
        @keyframes ab-scan {
          0%   { top: -12%; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: 108%; opacity: 0; }
        }
        .ab-scanline {
          position: absolute; inset-x: 0; z-index: 15;
          height: 72px; pointer-events: none;
          background: linear-gradient(to bottom,
            transparent 0%,
            rgba(59,130,246,0.06) 50%,
            transparent 100%);
          animation: ab-scan 6s ease-in-out infinite;
          animation-delay: 0.8s;
        }

        /* ── Tabs ── */
        .ab-tabs {
          display: flex;
          border-bottom: 1px solid rgba(0,0,0,0.09);
          gap: 0;
        }
        .ab-tab {
          flex: 1; position: relative;
          cursor: pointer; border: none; background: none; outline: none;
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
          padding: 12px 6px;
          color: rgba(15,23,42,0.32);
          transition: color 0.25s;
          white-space: nowrap;
        }
        .ab-tab:hover { color: rgba(15,23,42,0.65); }
        .ab-tab.active { color: #0f172a; }
        .ab-tab::after {
          content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg,#3b82f6,#818cf8);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        .ab-tab.active::after { transform: scaleX(1); }

        /* ── Value card ── */
        .ab-value-card {
          padding: 14px 16px;
          border-left: 2px solid rgba(59,130,246,0.18);
          background: rgba(255,255,255,0.65);
          border-radius: 0 3px 3px 0;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          cursor: default;
          backdrop-filter: blur(8px);
        }
        .ab-value-card:hover {
          border-left-color: #3b82f6;
          background: #fff;
          transform: translateX(7px);
          box-shadow: -4px 0 24px rgba(59,130,246,0.1), 2px 0 12px rgba(0,0,0,0.04);
        }

        /* ── Primary CTA ── */
        .ab-btn-primary {
          position: relative; overflow: hidden; cursor: pointer;
          background: #0f172a; color: #fff; border: none;
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
          padding: 14px 28px;
          display: inline-flex; align-items: center; gap: 10px;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1),
                      box-shadow 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .ab-btn-primary::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0.11);
          transform: translateX(-102%);
          transition: transform 0.38s cubic-bezier(0.16,1,0.3,1);
        }
        .ab-btn-primary:hover::before { transform: translateX(0); }
        .ab-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(15,23,42,0.22);
        }

        /* ── Ghost CTA ── */
        .ab-btn-ghost {
          position: relative; overflow: hidden; cursor: pointer;
          background: transparent; color: rgba(15,23,42,0.55);
          border: 1px solid rgba(15,23,42,0.15);
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
          padding: 14px 28px;
          display: inline-flex; align-items: center; gap: 10px;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .ab-btn-ghost:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59,130,246,0.12);
        }

        /* ── Live ping ── */
        @keyframes abPing { 75%,100%{ transform:scale(2.4);opacity:0; } }
        .ab-ping { animation: abPing 1.6s cubic-bezier(0,0,0.2,1) infinite; }

        /* ── Horizontal marquee strip ── */
        @keyframes ab-marquee { 0%{ transform:translateX(0); } 100%{ transform:translateX(-50%); } }
        .ab-marquee-track {
          display: flex; width: max-content;
          animation: ab-marquee 18s linear infinite;
        }
        .ab-marquee-track:hover { animation-play-state: paused; }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .ab-headline-wrap { font-size: clamp(2.6rem,13vw,3.8rem) !important; }
          .ab-stats-row { grid-template-columns: repeat(2,1fr) !important; }
          .ab-cta-row { flex-direction: column !important; }
          .ab-cta-row button { width: 100% !important; justify-content: center !important; }
        }

        /* ── Divider ── */
        .ab-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(0,0,0,0.1), transparent);
        }
      `}</style>

      {/* ── Cursor glow ── */}
      <CursorGlow />

      {/* ── Dot grid ── */}
      <div className="ab-dotgrid" style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
      }} />

      {/* ── Soft ambient blobs ── */}
      <motion.div style={{ opacity: bgOpacity, position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", width: 700, height: 700,
          left: "-12%", top: "-10%",
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 62%)",
          filter: "blur(70px)",
        }} />
        <div style={{
          position: "absolute", width: 540, height: 540,
          right: "-6%", bottom: "5%",
          background: "radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 62%)",
          filter: "blur(70px)",
        }} />
        <div style={{
          position: "absolute", width: 340, height: 340,
          left: "40%", top: "30%",
          background: "radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 62%)",
          filter: "blur(50px)",
        }} />
      </motion.div>

      {/* ── Animated vertical timeline line (left edge) ── */}
      <div ref={lineRef} style={{
        position: "absolute", left: 0, top: "10%",
        width: 3, height: "80%",
        background: "rgba(0,0,0,0.05)",
        zIndex: 1, overflow: "hidden",
        display: "none",
      }}>
        <motion.div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          background: "linear-gradient(to bottom, #3b82f6, #818cf8)",
          height: lineH,
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1152, margin: "0 auto", padding: "0 20px" }}>

        {/* ══ EYEBROW ══ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 56 }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16,1,0.3,1] }}
            style={{ width: 32, height: 2, background: "#3b82f6", transformOrigin: "left" }}
          />
          <span className="ab-mono" style={{ fontSize: "0.58rem", letterSpacing: "0.45em", color: "#3b82f6", textTransform: "uppercase" }}>
            Company Profile — Est. 2011
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(59,130,246,0.3), transparent)", transformOrigin: "left" }}
          />
        </motion.div>

        {/* ══ MAIN GRID ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "56px 72px", alignItems: "flex-start" }}>

            {/* ─── LEFT COLUMN ─── */}
            <motion.div
              style={{ flex: "0 0 auto", width: "min(100%, 420px)" }}
              initial={{ opacity: 0, x: -48 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* 3-D Video panel */}
              <div className="ab-vid-wrap" style={{ position: "relative", marginBottom: 20 }}>
                <div className="ab-vid-inner" style={{ aspectRatio: "16/10" }}>
                  <motion.div style={{ y: videoY, height: "114%", marginTop: "-7%" }}>
                    <video
                      src="/about.mp4"
                      autoPlay loop muted playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </motion.div>

                  {/* Scan line */}
                  <div className="ab-scanline" />

                  {/* Gloss */}
                  <div style={{
                    position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none",
                    background: "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, transparent 45%)",
                  }} />

                  {/* Live badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    style={{
                      position: "absolute", bottom: 14, left: 14, zIndex: 20,
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "6px 12px",
                      background: "rgba(255,255,255,0.92)",
                      border: "1px solid rgba(0,0,0,0.07)",
                      backdropFilter: "blur(16px)",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                    }}
                  >
                    <span style={{ position: "relative", display: "flex", width: 7, height: 7, flexShrink: 0 }}>
                      <span className="ab-ping" style={{
                        position: "absolute", inset: 0, borderRadius: "50%", background: "#3b82f6",
                      }} />
                      <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", display: "block" }} />
                    </span>
                    <span className="ab-mono" style={{ fontSize: "0.52rem", letterSpacing: "0.3em", color: "rgba(15,23,42,0.5)", textTransform: "uppercase" }}>
                      Est. 2011 — Live Ops
                    </span>
                  </motion.div>

                  {/* Corner label */}
                  <div style={{
                    position: "absolute", top: 14, right: 14, zIndex: 20,
                  }}>
                    <span className="ab-mono" style={{ fontSize: "0.5rem", letterSpacing: "0.45em", color: "rgba(15,23,42,0.18)", textTransform: "uppercase" }}>
                      CIS_CORP
                    </span>
                  </div>
                </div>

                {/* Shadow plane */}
                <div style={{
                  position: "absolute", bottom: -18, left: "10%", right: "10%",
                  height: 22, borderRadius: "50%",
                  background: "rgba(59,130,246,0.1)", filter: "blur(22px)",
                  pointerEvents: "none",
                }} />
              </div>

              {/* ── Stats grid ── */}
              <div className="ab-stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                {STATS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20, scale: 0.93 }}
                    animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ duration: 0.65, delay: 0.35 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <MagCard
                      className="ab-stat"
                      style={{ padding: "14px 8px", textAlign: "center", cursor: "default" }}
                      strength={8}
                    >
                      {/* Top gloss */}
                      <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: "38%",
                        background: "linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)",
                        pointerEvents: "none",
                      }} />
                      <div className="ab-display" style={{ fontSize: "1.75rem", lineHeight: 1, color: "#0f172a", marginBottom: 5 }}>
                        <Counter value={s.value} suffix={s.suffix} />
                      </div>
                      <div className="ab-mono" style={{
                        fontSize: "0.46rem", letterSpacing: "0.2em", color: "rgba(15,23,42,0.38)",
                        textTransform: "uppercase", whiteSpace: "pre-line", lineHeight: 1.5,
                      }}>
                        {s.label}
                      </div>
                    </MagCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ─── RIGHT COLUMN ─── */}
            <motion.div
              style={{ flex: 1, minWidth: 280 }}
              initial={{ opacity: 0, x: 48 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >

              {/* ── Headline ── */}
              <div
                className="ab-headline-wrap ab-display"
                style={{ fontSize: "clamp(3rem,5.5vw,5.8rem)", lineHeight: 0.9, color: "#0f172a", marginBottom: 24, overflow: "hidden" }}
              >
                <div style={{ overflow: "hidden" }}>
                  <WordReveal text="Integrated" delay={0.3} className="ab-display" style={{ fontSize: "inherit", lineHeight: "inherit", display: "block" }} />
                </div>
                <div style={{ overflow: "hidden" }}>
                  <WordReveal text="Technology" delay={0.42} gradient className="ab-display" style={{ fontSize: "inherit", lineHeight: "inherit", display: "block" }} />
                </div>
                <div style={{ overflow: "hidden" }}>
                  <WordReveal text="Solutions" delay={0.54} className="ab-display" style={{ fontSize: "inherit", lineHeight: "inherit", display: "block" }} />
                </div>
              </div>

              {/* ── Sub copy ── */}
              <motion.p
                className="ab-body"
                style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "#334155", fontWeight: 400, maxWidth: "46ch", marginBottom: 28 }}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.58 }}
              >
                Nationwide enterprise IT infrastructure — designed, deployed, and managed by engineers who've been doing it since 2011.
              </motion.p>

              {/* ── Divider ── */}
              <motion.div
                className="ab-divider"
                style={{ marginBottom: 28, transformOrigin: "left" }}
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.62, ease: [0.16,1,0.3,1] }}
              />

              {/* ── Tabs ── */}
              <motion.div
                className="ab-tabs"
                style={{ marginBottom: 28 }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.65 }}
              >
                {TABS.map(t => (
                  <button
                    key={t.key}
                    className={`ab-tab ${activeTab === t.key ? "active" : ""}`}
                    onClick={() => setActiveTab(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </motion.div>

              {/* ── Tab body ── */}
              <div style={{ minHeight: 210 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 14, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {tab.body && (
                      <p className="ab-body" style={{
                        fontSize: "0.9rem", lineHeight: 1.82, color: "#374151",
                        fontWeight: 400, maxWidth: "50ch", marginBottom: 24,
                      }}>
                        {tab.body}
                      </p>
                    )}

                    {tab.values && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 8, marginBottom: 24 }}>
                        {tab.values.map((v, i) => (
                          <motion.div
                            key={v.title}
                            className="ab-value-card"
                            initial={{ opacity: 0, x: -14 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                              <span className="ab-mono" style={{ fontSize: "0.5rem", color: "#3b82f6", letterSpacing: "0.1em" }}>{v.icon}</span>
                              <span className="ab-mono" style={{ fontSize: "0.56rem", letterSpacing: "0.28em", color: "#0f172a", textTransform: "uppercase", fontWeight: 700 }}>
                                {v.title}
                              </span>
                            </div>
                            <div className="ab-body" style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.55, fontWeight: 400 }}>
                              {v.desc}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* ── CTAs ── */}
                    <motion.div
                      className="ab-cta-row"
                      style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.28, duration: 0.45 }}
                    >
                      <button className="ab-btn-primary" onClick={() => scrollTo("contact")}>
                        Work With Us
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="ab-btn-ghost" onClick={() => scrollTo("services")}>
                        Our Services
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── Badge strip ── */}
              <motion.div
                style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(0,0,0,0.07)" }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 1, duration: 0.6 }}
              >
                {BADGES.map((badge, i) => (
                  <motion.div
                    key={badge}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 1 + i * 0.08, duration: 0.4 }}
                  >
                    <motion.div
                      style={{ width: 5, height: 5, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }}
                      animate={{ scale: [1, 1.35, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.4 }}
                    />
                    <span className="ab-mono" style={{ fontSize: "0.52rem", letterSpacing: "0.25em", color: "rgba(15,23,42,0.38)", textTransform: "uppercase" }}>
                      {badge}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ══ MARQUEE STRIP ══ */}
        <motion.div
          style={{
            marginTop: 80,
            overflow: "hidden",
            borderTop: "1px solid rgba(0,0,0,0.07)",
            borderBottom: "1px solid rgba(0,0,0,0.07)",
            padding: "14px 0",
          }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.1, duration: 0.7 }}
        >
          <div className="ab-marquee-track">
            {[...Array(2)].map((_, rep) => (
              <React.Fragment key={rep}>
                {["Structured Cabling", "IP Surveillance", "Managed IT", "Cybersecurity", "VoIP & Telecom", "Audio Visual", "Desktop Support", "Web Development", "AI / ML Solutions"].map((item, i) => (
                  <span key={`${rep}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: 24, paddingRight: 48 }}>
                    <span className="ab-mono" style={{ fontSize: "0.58rem", letterSpacing: "0.35em", color: "rgba(15,23,42,0.3)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      {item}
                    </span>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#3b82f6", opacity: 0.5, flexShrink: 0 }} />
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