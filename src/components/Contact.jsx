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
   SVG BACKGROUND ANIMATION — network transmission topology
───────────────────────────────────────────────────────────── */
function SVGNetworkBg() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const nodes = Array.from({ length: 22 }, (_, i) => ({
      x: 80 + Math.random() * (canvas.width - 160),
      y: 40 + Math.random() * (canvas.height - 80),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 2 + Math.random() * 2.5,
      phase: Math.random() * Math.PI * 2,
    }));

    const packets = Array.from({ length: 6 }, () => ({
      progress: Math.random(),
      fromIdx: Math.floor(Math.random() * nodes.length),
      toIdx: Math.floor(Math.random() * nodes.length),
      speed: 0.003 + Math.random() * 0.004,
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (ts) => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      tRef.current = ts / 1000;
      const t = tRef.current;

      ctx.clearRect(0, 0, W, H);

      // Move nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 20 || n.x > W - 20) n.vx *= -1;
        if (n.y < 20 || n.y > H - 20) n.vy *= -1;
      });

      // Draw edges
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (j <= i) return;
          const dx = b.x - a.x, dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 160) return;
          const alpha = (1 - dist / 160) * 0.18;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        });
      });

      // Draw packets
      packets.forEach((p) => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          p.fromIdx = p.toIdx;
          p.toIdx = Math.floor(Math.random() * nodes.length);
        }
        const from = nodes[p.fromIdx], to = nodes[p.toIdx];
        const px = from.x + (to.x - from.x) * p.progress;
        const py = from.y + (to.y - from.y) * p.progress;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59,130,246,0.7)";
        ctx.shadowColor = "#3b82f6";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw nodes
      nodes.forEach((n) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.8 + n.phase);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (0.85 + pulse * 0.3), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,130,246,${0.25 + pulse * 0.35})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.55, pointerEvents: "none" }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   SVG SIGNAL ICON — animated for sidebar
───────────────────────────────────────────────────────────── */
function SVGSignalIcon({ accent = "#3b82f6" }) {
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
      {[1, 2, 3].map((r) => (
        <motion.circle
          key={r}
          cx="40" cy="40"
          r={r * 14}
          stroke={accent}
          strokeWidth="0.8"
          strokeOpacity={0.2}
          strokeDasharray="3 4"
          animate={{ rotate: r % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 12 + r * 4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "40px 40px" }}
        />
      ))}
      <motion.circle cx="40" cy="40" r="6" fill={accent}
        animate={{ r: [5, 7, 5], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }} />
      {[12, 20, 28].map((r, i) => (
        <motion.path
          key={r}
          d={`M ${40 - r * 0.707} ${40 - r * 0.707} A ${r} ${r} 0 0 1 ${40 + r * 0.707} ${40 - r * 0.707}`}
          stroke={accent}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 + i * 0.1 }}
          transition={{ delay: i * 0.18, duration: 0.7, repeat: Infinity, repeatDelay: 1.5 }}
        />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED FIELD WRAPPER
───────────────────────────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <motion.div
      className="ct-field"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <label className="ct-label">{label}</label>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CONTACT INFO ROW
───────────────────────────────────────────────────────────── */
function InfoRow({ icon: Icon, label, value, href, delay }) {
  return (
    <motion.div
      className="ct-info-row"
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="ct-info-icon">
        <Icon size={18} />
      </div>
      <div>
        <p className="ct-info-label">{label}</p>
        {href
          ? <a href={href} className="ct-info-value ct-info-link">{value}</a>
          : <p className="ct-info-value">{value}</p>
        }
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    const form = e.target;
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setLoading(false);
  };

  return (
    <section id="contact" ref={sectionRef} style={{ background: "#f1f3f5", fontFamily: "'Barlow',sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .ct * { box-sizing: border-box; }
        .ct-display { font-family: 'Bebas Neue', sans-serif !important; letter-spacing: 0.03em; }
        .ct-mono    { font-family: 'Space Mono', monospace !important; }
        .ct-body    { font-family: 'Barlow', sans-serif !important; }

        /* ── Dot grid ── */
        .ct-dotgrid {
          background-image: radial-gradient(circle, rgba(0,0,0,0.065) 1px, transparent 1px);
          background-size: 28px 28px;
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
        }

        /* ── Labels ── */
        .ct-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(15,23,42,0.45);
          display: block;
          margin-bottom: 7px;
        }

        /* ── Inputs ── */
        .ct-input, .ct-select, .ct-textarea {
          width: 100%;
          background: #f8fafc;
          border: 1px solid rgba(0,0,0,0.1);
          color: #0f172a;
          font-family: 'Barlow', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          padding: 13px 16px;
          border-radius: 3px;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          appearance: none;
        }
        .ct-input:focus, .ct-select:focus, .ct-textarea:focus {
          border-color: #3b82f6;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }
        .ct-input:hover:not(:focus), .ct-select:hover:not(:focus), .ct-textarea:hover:not(:focus) {
          border-color: rgba(0,0,0,0.22);
          background: #fff;
        }
        .ct-input::placeholder, .ct-textarea::placeholder {
          color: rgba(15,23,42,0.28);
        }
        .ct-textarea { min-height: 140px; resize: vertical; line-height: 1.65; }
        .ct-select { cursor: pointer; color: #0f172a; }
        .ct-select option { background: #fff; color: #0f172a; }

        /* ── Field wrapper ── */
        .ct-field { display: flex; flex-direction: column; }

        /* ── Submit button ── */
        .ct-submit {
          position: relative; overflow: hidden;
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.24em; text-transform: uppercase;
          padding: 16px 36px;
          background: #0f172a; color: #fff; border: none;
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          cursor: pointer;
          transition: transform 0.28s cubic-bezier(0.16,1,0.3,1), box-shadow 0.28s, background 0.2s;
          border-radius: 3px;
          width: 100%;
        }
        .ct-submit::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0.08);
          transform: translateX(-101%);
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .ct-submit:hover:not(:disabled)::before { transform: translateX(0); }
        .ct-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(15,23,42,0.25);
          background: #1e293b;
        }
        .ct-submit:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 3px;
        }
        .ct-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        /* ── Sidebar ── */
        .ct-sidebar {
          background: #0a0f1e;
          position: relative;
          overflow: hidden;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .ct-sidebar-inner { position: relative; z-index: 1; padding: 44px 40px; }

        /* ── Info rows ── */
        .ct-info-row {
          display: flex; align-items: flex-start; gap: 16px;
          padding: 18px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ct-info-row:last-of-type { border-bottom: none; }
        .ct-info-icon {
          width: 38px; height: 38px; border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(59,130,246,0.12);
          color: #3b82f6;
          flex-shrink: 0;
          border: 1px solid rgba(59,130,246,0.2);
          transition: background 0.2s, border-color 0.2s;
        }
        .ct-info-row:hover .ct-info-icon {
          background: rgba(59,130,246,0.2);
          border-color: rgba(59,130,246,0.4);
        }
        .ct-info-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.46rem; letter-spacing: 0.35em; text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 4px;
        }
        .ct-info-value {
          font-family: 'Barlow', sans-serif;
          font-size: 0.9rem; font-weight: 500;
          color: rgba(255,255,255,0.85);
          word-break: break-word;
        }
        .ct-info-link {
          text-decoration: none;
          transition: color 0.2s;
        }
        .ct-info-link:hover { color: #3b82f6; text-decoration: underline; text-underline-offset: 3px; }
        .ct-info-link:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; border-radius: 2px; }

        /* ── Support card ── */
        .ct-support-card {
          margin-top: 28px;
          padding: 20px 22px;
          background: linear-gradient(135deg, #1e3a5f 0%, #1a2540 100%);
          border: 1px solid rgba(59,130,246,0.25);
          border-radius: 3px;
          position: relative;
          overflow: hidden;
        }
        .ct-support-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, #3b82f6, #818cf8, transparent);
        }

        /* ── Form card ── */
        .ct-form-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 4px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04);
          overflow: hidden;
        }
        .ct-form-inner { padding: 44px 40px 40px; }

        /* ── Top accent bar ── */
        .ct-accent-bar {
          height: 3px;
          background: linear-gradient(to right, #3b82f6, rgba(59,130,246,0.3));
        }

        /* ── Status ── */
        .ct-status-ok  { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); color: #10b981; border-radius: 3px; padding: 13px 18px; }
        .ct-status-err { background: rgba(239,68,68,0.08);  border: 1px solid rgba(239,68,68,0.25);  color: #ef4444;  border-radius: 3px; padding: 13px 18px; }

        /* ════════════════════════════════════════
           RESPONSIVE
        ════════════════════════════════════════ */
        @media (max-width: 900px) {
          .ct-grid { flex-direction: column !important; }
          .ct-sidebar { flex: none !important; width: 100% !important; }
          .ct-sidebar-inner { padding: 32px 28px !important; }
          .ct-form-inner { padding: 28px 24px 28px !important; }
          .ct-section-pad { padding: 72px 20px 80px !important; }
          .ct-form-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .ct-sidebar-inner { padding: 24px 18px !important; }
          .ct-form-inner { padding: 20px 16px 24px !important; }
          .ct-section-pad { padding: 52px 16px 60px !important; }
          .ct-headline { font-size: clamp(2.8rem, 12vw, 5rem) !important; }
          .ct-submit { font-size: 0.52rem !important; padding: 14px 24px !important; }
          .ct-info-icon { width: 32px !important; height: 32px !important; }
          .ct-info-value { font-size: 0.82rem !important; }
          .ct-eyebrow-line { display: none !important; }
        }
        @media (max-width: 380px) {
          .ct-form-inner { padding: 16px 14px 20px !important; }
          .ct-sidebar-inner { padding: 20px 14px !important; }
          .ct-section-pad { padding: 44px 14px 52px !important; }
          .ct-input, .ct-select, .ct-textarea { padding: 11px 12px !important; font-size: 0.82rem !important; }
        }
      `}</style>

      <div className="ct" style={{ position: "relative" }}>

        {/* Dot grid */}
        <div className="ct-dotgrid" />

        {/* Ambient glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 55% 40% at 30% 55%, rgba(59,130,246,0.06), transparent 65%)",
        }} />

        <div
          className="ct-section-pad"
          style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "100px 20px 120px" }}
        >

          {/* ── Eyebrow ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}
          >
            <motion.div
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.55, delay: 0.1 }}
              style={{ width: 28, height: 2, background: "#3b82f6", transformOrigin: "left", flexShrink: 0 }}
            />
            <span className="ct-mono" style={{ fontSize: "0.52rem", letterSpacing: "0.38em", color: "#3b82f6", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              Contact — Nationwide Coverage
            </span>
            <motion.div
              className="ct-eyebrow-line"
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(59,130,246,0.3), transparent)", transformOrigin: "left" }}
            />
          </motion.div>

          {/* ── Headline ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: 48 }}
          >
            <h2
              className="ct-display ct-headline"
              style={{ fontSize: "clamp(2.8rem, 6vw, 6.5rem)", lineHeight: 0.88, color: "#0f172a", marginBottom: 16 }}
            >
              Get In
              <span style={{
                background: "linear-gradient(90deg,#3b82f6,#818cf8)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                marginLeft: "0.18em",
              }}>
                Touch
              </span>
            </h2>
            <p className="ct-body" style={{ fontSize: "clamp(0.85rem, 2.5vw, 1rem)", color: "#475569", maxWidth: "52ch", lineHeight: 1.75, fontWeight: 400 }}>
              Ready to modernize your infrastructure? Reach out for projects, technical support, or general inquiries.
            </p>
          </motion.div>

          {/* ── Main grid ── */}
          <div className="ct-grid" style={{ display: "flex", gap: 20, alignItems: "stretch" }}>

            {/* ══ FORM CARD ══ */}
            <motion.div
              className="ct-form-card"
              style={{ flex: "1.5", minWidth: 0 }}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="ct-accent-bar" />
              <div className="ct-form-inner">

                {/* Form tag */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />
                  <span className="ct-mono" style={{ fontSize: "0.5rem", letterSpacing: "0.38em", color: "#3b82f6", textTransform: "uppercase" }}>
                    SEND_MESSAGE
                  </span>
                  <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.07)" }} />
                </div>

                <form
                  action="https://formspree.io/f/myzrrprd"
                  method="POST"
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 18 }}
                >
                  <div className="ct-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Field label="Full Name">
                      <input type="text" name="name" placeholder="John Doe" required className="ct-input" />
                    </Field>
                    <Field label="Email Address">
                      <input type="email" name="_replyto" placeholder="john@company.com" required className="ct-input" />
                    </Field>
                  </div>

                  {/* ── Updated: routes form replies to uchenna ── */}
                  <input type="hidden" name="_from" value="uchenna.m@conotextech.com" />

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
                    <textarea name="message" placeholder="How can we help your business thrive?" required className="ct-textarea" />
                  </Field>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="ct-submit"
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          style={{ display: "inline-block", width: 13, height: 13, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }}
                        />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {status && (
                      <motion.div
                        key={status}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={status === "success" ? "ct-status-ok" : "ct-status-err"}
                        style={{ display: "flex", alignItems: "center", gap: 10 }}
                      >
                        <span className="ct-mono" style={{ fontSize: "0.52rem", letterSpacing: "0.2em" }}>
                          {status === "success"
                            ? "✓  MESSAGE SENT SUCCESSFULLY"
                            : "✕  FAILED TO SEND — PLEASE RETRY"}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>

            {/* ══ SIDEBAR ══ */}
            <motion.div
              className="ct-sidebar"
              style={{ flex: 1, minWidth: 0 }}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <SVGNetworkBg />

              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(59,130,246,0.12), transparent 70%)",
              }} />

              <div className="ct-sidebar-inner">

                {/* Sidebar tag */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />
                  <span className="ct-mono" style={{ fontSize: "0.5rem", letterSpacing: "0.38em", color: "#3b82f6", textTransform: "uppercase" }}>
                    CORPORATE_OFFICE
                  </span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                </div>

                {/* SVG Signal icon */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                  <SVGSignalIcon accent="#3b82f6" />
                </div>

                {/* Info rows — updated email */}
                <div style={{ marginBottom: 4 }}>
                  <InfoRow
                    icon={MdEmail}
                    label="Email Us"
                    value="uchenna.m@conotextech.com"
                    href="mailto:uchenna.m@conotextech.com"
                    delay={0.1}
                  />
                  <InfoRow
                    icon={MdPhone}
                    label="Call Us"
                    value="+1 (832) 535-1082"
                    href="tel:+18325351082"
                    delay={0.18}
                  />
                  <InfoRow
                    icon={MdLocationOn}
                    label="Our HQ"
                    value="Richmond, TX 77469 USA"
                    delay={0.26}
                  />
                </div>

                {/* Support card — updated email */}
                <motion.div
                  className="ct-support-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <MdSupportAgent size={18} style={{ color: "#3b82f6", flexShrink: 0 }} />
                    <span className="ct-mono" style={{ fontSize: "0.52rem", letterSpacing: "0.28em", color: "#3b82f6", textTransform: "uppercase" }}>
                      24/7 Support
                    </span>
                  </div>
                  <p className="ct-body" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.65, margin: 0 }}>
                    Clients with contracts can reach our team at{" "}
                    <a href="mailto:uchenna.m@conotextech.com" style={{ color: "#3b82f6", textDecoration: "none" }}>
                      uchenna.m@conotextech.com
                    </a>
                  </p>

                  {/* Blinking status dot */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
                    <motion.span
                      style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", flexShrink: 0, display: "inline-block" }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                    <span className="ct-mono" style={{ fontSize: "0.44rem", letterSpacing: "0.28em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>
                      Systems Online
                    </span>
                  </div>
                </motion.div>

                {/* Bottom index */}
                <motion.div
                  style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.55 }}
                >
                  <span className="ct-mono" style={{ fontSize: "0.44rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase" }}>Conotex Tech</span>
                  <span className="ct-mono" style={{ fontSize: "0.44rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.18)" }}>USA</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* ── Bottom index strip ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.9 }}
            style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 36, flexWrap: "wrap", rowGap: 8 }}
          >
            <div style={{ width: 18, height: 3, background: "#3b82f6", borderRadius: 2 }} />
            <span className="ct-mono" style={{ fontSize: "0.46rem", letterSpacing: "0.3em", color: "rgba(15,23,42,0.3)", textTransform: "uppercase" }}>
              CONTACT_SYS — Secure Channel Active
            </span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(59,130,246,0.2), transparent)" }} />
            <span className="ct-mono" style={{ fontSize: "0.46rem", letterSpacing: "0.28em", color: "rgba(15,23,42,0.22)", textTransform: "uppercase", flexShrink: 0 }}>
              06 / 06
            </span>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;