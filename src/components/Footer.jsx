import React, { useEffect, useRef } from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { motion, useInView } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   CANVAS — floating grid topology background
───────────────────────────────────────────────────────────── */
function GridCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 1.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
    }));

    const pkts = Array.from({ length: 7 }, () => ({
      p: Math.random(), fi: 0, ti: 1, spd: 0.003 + Math.random() * 0.003,
    }));
    pkts.forEach((pk) => {
      pk.fi = Math.floor(Math.random() * nodes.length);
      pk.ti = Math.floor(Math.random() * nodes.length);
    });

    const draw = (ts) => {
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      const t = ts / 1000;
      ctx.clearRect(0, 0, W, H);

      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 10 || n.x > W - 10) n.vx *= -1;
        if (n.y < 10 || n.y > H - 10) n.vy *= -1;
      });

      // edges
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (j <= i) return;
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > 170) return;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(59,130,246,${(1 - d / 170) * 0.12})`;
          ctx.lineWidth = 0.7; ctx.stroke();
        });
      });

      // packets
      pkts.forEach((pk) => {
        pk.p += pk.spd;
        if (pk.p >= 1) { pk.p = 0; pk.fi = pk.ti; pk.ti = Math.floor(Math.random() * nodes.length); }
        const f = nodes[pk.fi], to = nodes[pk.ti];
        const px = f.x + (to.x - f.x) * pk.p, py = f.y + (to.y - f.y) * pk.p;
        ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59,130,246,0.65)";
        ctx.shadowColor = "#3b82f6"; ctx.shadowBlur = 8;
        ctx.fill(); ctx.shadowBlur = 0;
      });

      // nodes
      nodes.forEach((n) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.6 + n.phase);
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (0.85 + pulse * 0.3), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,130,246,${0.18 + pulse * 0.22})`; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.45, pointerEvents: "none" }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   SVG GLOBE — animated wireframe globe in brand section
───────────────────────────────────────────────────────────── */
function SVGGlobe() {
  return (
    <svg viewBox="0 0 120 120" width="100" height="100" fill="none" style={{ display: "block" }}>
      <motion.circle cx="60" cy="60" r="54" stroke="rgba(59,130,246,0.25)" strokeWidth="1"
        strokeDasharray="8 5"
        animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "60px 60px" }} />
      <motion.ellipse cx="60" cy="60" rx="54" ry="20" stroke="rgba(59,130,246,0.18)" strokeWidth="0.8"
        animate={{ rotate: -360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "60px 60px" }} />
      <motion.ellipse cx="60" cy="60" rx="20" ry="54" stroke="rgba(59,130,246,0.18)" strokeWidth="0.8"
        strokeDasharray="5 4"
        animate={{ rotate: 180 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "60px 60px" }} />
      <ellipse cx="60" cy="60" rx="54" ry="14" stroke="rgba(59,130,246,0.12)" strokeWidth="0.6" />
      <motion.circle cx="60" cy="60" r="8" fill="rgba(59,130,246,0.15)"
        animate={{ r: [7, 10, 7], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }} />
      <circle cx="60" cy="60" r="4" fill="#3b82f6" opacity="0.9" />
      <motion.circle r="3" fill="#818cf8" opacity="0.8"
        animate={{ cx: [60, 114, 60, 6, 60], cy: [6, 60, 114, 60, 6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED LINK
───────────────────────────────────────────────────────────── */
function FooterLink({ href, children, delay = 0 }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <a href={href} className="ft-link">
        <span className="ft-link-bar" />
        {children}
      </a>
    </motion.li>
  );
}

/* ─────────────────────────────────────────────────────────────
   CONTACT ROW
───────────────────────────────────────────────────────────── */
function ContactRow({ icon: Icon, href, children, delay }) {
  return (
    <motion.li
      className="ft-contact-row"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="ft-contact-icon"><Icon size={14} /></div>
      {href
        ? <a href={href} className="ft-contact-val ft-contact-link">{children}</a>
        : <span className="ft-contact-val">{children}</span>
      }
    </motion.li>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────── */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer ref={ref} style={{ background: "#0a0f1e", fontFamily: "'Barlow',sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .ft * { box-sizing: border-box; }
        .ft-display { font-family: 'Bebas Neue', sans-serif !important; letter-spacing: 0.04em; }
        .ft-mono    { font-family: 'Space Mono', monospace !important; }
        .ft-body    { font-family: 'Barlow', sans-serif !important; }

        /* ── nav link ── */
        .ft-link {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'Barlow', sans-serif;
          font-size: 0.85rem; font-weight: 400;
          color: rgba(255,255,255,0.38);
          text-decoration: none;
          transition: color 0.22s;
          padding: 2px 0;
        }
        .ft-link-bar {
          display: inline-block;
          width: 0; height: 1.5px;
          background: #3b82f6;
          border-radius: 2px;
          transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
          flex-shrink: 0;
        }
        .ft-link:hover { color: #fff; }
        .ft-link:hover .ft-link-bar { width: 14px; }
        .ft-link:focus-visible { outline: 2px solid #3b82f6; outline-offset: 3px; border-radius: 2px; }

        /* ── col heading ── */
        .ft-col-head {
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem; letter-spacing: 0.42em;
          text-transform: uppercase;
          color: #3b82f6;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .ft-col-head::after {
          content: '';
          flex: 1; height: 1px;
          background: rgba(255,255,255,0.06);
        }

        /* ── contact rows ── */
        .ft-contact-row {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          list-style: none;
        }
        .ft-contact-row:last-child { border-bottom: none; }
        .ft-contact-icon {
          width: 28px; height: 28px; border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.18);
          color: #3b82f6; flex-shrink: 0; margin-top: 1px;
          transition: background 0.2s, border-color 0.2s;
        }
        .ft-contact-row:hover .ft-contact-icon {
          background: rgba(59,130,246,0.2);
          border-color: rgba(59,130,246,0.38);
        }
        .ft-contact-val {
          font-family: 'Barlow', sans-serif;
          font-size: 0.82rem; color: rgba(255,255,255,0.45);
          font-weight: 400; word-break: break-word; line-height: 1.55;
        }
        .ft-contact-link {
          text-decoration: none;
          transition: color 0.2s;
        }
        .ft-contact-link:hover { color: #3b82f6; text-decoration: underline; text-underline-offset: 3px; }
        .ft-contact-link:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; border-radius: 2px; }

        /* ── social ── */
        .ft-social {
          width: 36px; height: 36px; border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
          position: relative; overflow: hidden;
        }
        .ft-social::before {
          content: ''; position: absolute; inset: 0;
          background: #3b82f6;
          transform: translateY(101%);
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .ft-social:hover::before { transform: translateY(0); }
        .ft-social:hover { color: #fff; border-color: #3b82f6; box-shadow: 0 6px 22px rgba(59,130,246,0.3); }
        .ft-social:focus-visible { outline: 2px solid #3b82f6; outline-offset: 3px; }
        .ft-social svg { position: relative; z-index: 1; }

        /* ── newsletter input ── */
        .ft-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: #fff;
          font-family: 'Barlow', sans-serif;
          font-size: 0.84rem;
          padding: 12px 14px;
          border-radius: 3px;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .ft-input::placeholder { color: rgba(255,255,255,0.22); }
        .ft-input:hover:not(:focus) { border-color: rgba(255,255,255,0.18); background: rgba(255,255,255,0.06); }
        .ft-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); background: rgba(255,255,255,0.06); }

        /* ── subscribe btn ── */
        .ft-sub-btn {
          position: relative; overflow: hidden; cursor: pointer;
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem; letter-spacing: 0.26em; text-transform: uppercase;
          padding: 13px 20px; width: 100%;
          background: #3b82f6; color: #fff; border: none; border-radius: 3px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.25s, box-shadow 0.25s, background 0.2s;
        }
        .ft-sub-btn::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0.12);
          transform: translateX(-101%);
          transition: transform 0.32s cubic-bezier(0.16,1,0.3,1);
        }
        .ft-sub-btn:hover::before { transform: translateX(0); }
        .ft-sub-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(59,130,246,0.35); background: #2563eb; }
        .ft-sub-btn:focus-visible { outline: 2px solid #93c5fd; outline-offset: 3px; }

        /* ── divider ── */
        .ft-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(59,130,246,0.2) 30%, rgba(59,130,246,0.2) 70%, transparent);
        }

        /* ── top accent ── */
        .ft-top-accent {
          height: 2px;
          background: linear-gradient(to right, #3b82f6, #818cf8, rgba(59,130,246,0.2), transparent);
        }

        /* ── bottom legal links ── */
        .ft-legal-link {
          font-family: 'Space Mono', monospace;
          font-size: 0.4rem; letter-spacing: 0.28em;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
          text-decoration: none;
          transition: color 0.2s;
        }
        .ft-legal-link:hover { color: rgba(59,130,246,0.8); }
        .ft-legal-link:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; border-radius: 2px; }

        /* ════════════════════════════════════
           RESPONSIVE
        ════════════════════════════════════ */
        @media (max-width: 1024px) {
          .ft-grid { grid-template-columns: 1fr 1fr !important; }
          .ft-brand-col { grid-column: 1 / -1 !important; }
        }
        @media (max-width: 600px) {
          .ft-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .ft-brand-col { grid-column: auto !important; }
          .ft-section-pad { padding: 52px 16px 40px !important; }
          .ft-bottom { padding: 20px 16px !important; flex-direction: column !important; gap: 8px !important; text-align: center !important; }
          .ft-logo-text { font-size: clamp(2rem, 10vw, 3rem) !important; }
        }
        @media (max-width: 380px) {
          .ft-section-pad { padding: 40px 14px 32px !important; }
          .ft-social { width: 32px !important; height: 32px !important; }
        }
      `}</style>

      {/* Top accent */}
      <div className="ft-top-accent" />

      <div className="ft" style={{ position: "relative" }}>
        {/* Canvas bg */}
        <GridCanvas />

        {/* Ambient glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 50% at 20% 60%, rgba(59,130,246,0.07), transparent 65%)",
        }} />

        {/* ── MAIN GRID ── */}
        <div
          className="ft-section-pad ft-grid"
          style={{
            position: "relative", zIndex: 1,
            maxWidth: 1200, margin: "0 auto",
            padding: "80px 20px 72px",
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1.2fr",
            gap: "48px 40px",
          }}
        >

          {/* ── BRAND ── */}
          <div className="ft-brand-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Logo + globe */}
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
                <SVGGlobe />
                <div>
                  <div className="ft-display ft-logo-text"
                    style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", lineHeight: 0.9, color: "#fff" }}>
                    CONOTEX
                    <span style={{
                      background: "linear-gradient(90deg,#3b82f6,#818cf8)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                      display: "block",
                    }}>TECH</span>
                  </div>
                </div>
              </div>

              <p className="ft-body" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.75, maxWidth: "32ch", marginBottom: 28 }}>
                Revolutionizing enterprise infrastructure through innovative technology solutions.
                Reliability, security, and efficiency delivered globally.
              </p>

              {/* Socials */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { Icon: FaFacebookF,  href: "#", label: "Facebook" },
                  { Icon: FaTwitter,    href: "#", label: "Twitter" },
                  { Icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
                  { Icon: FaInstagram,  href: "#", label: "Instagram" },
                ].map(({ Icon, href, label }, i) => (
                  <motion.a
                    key={i} href={href}
                    aria-label={label}
                    className="ft-social"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.3 + i * 0.07, type: "spring", stiffness: 280 }}
                  >
                    <Icon size={14} />
                  </motion.a>
                ))}
              </div>

              {/* Status strip */}
              <motion.div
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}
                style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24 }}
              >
                <motion.span
                  style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", flexShrink: 0 }}
                  animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
                />
                <span className="ft-mono" style={{ fontSize: "0.42rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
                  Systems Online — USA Operations
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* ── QUICK LINKS ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ft-col-head">Quick Links</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              <FooterLink href="#projects" delay={0.10}>Our Projects</FooterLink>
              <FooterLink href="#services" delay={0.15}>Core Services</FooterLink>
              <FooterLink href="#partners" delay={0.20}>Global Partners</FooterLink>
              <FooterLink href="#contact"  delay={0.25}>Contact Us</FooterLink>
            </ul>
          </motion.div>

          {/* ── GET IN TOUCH ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.22, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ft-col-head">Get In Touch</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <ContactRow icon={MdEmail}     href="mailto:uchenna.m@conotextech.com" delay={0.12}>
                uchenna.m@conotextech.com
              </ContactRow>
              <ContactRow icon={MdPhone}     href="tel:+18325351082"                 delay={0.19}>
                +1 (832) 535-1082
              </ContactRow>
              <ContactRow icon={MdLocationOn}                                         delay={0.26}>
                Richmond, TX 77469 USA
              </ContactRow>
            </ul>
          </motion.div>

          {/* ── NEWSLETTER ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ft-col-head">Newsletter</div>
            <p className="ft-body" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.65, marginBottom: 18 }}>
              Stay ahead of the curve. Enterprise insights delivered.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input type="email" placeholder="Your Email" className="ft-input" aria-label="Newsletter email" />
              <button className="ft-sub-btn">
                Subscribe
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Service index dots */}
            <div style={{ display: "flex", gap: 6, marginTop: 24, flexWrap: "wrap" }}>
              {["WEB", "AI", "CABLE", "SEC", "IT", "SUP"].map((tag, i) => (
                <motion.span
                  key={tag}
                  className="ft-mono"
                  style={{
                    fontSize: "0.38rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.18)",
                    padding: "3px 6px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.06 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div className="ft-divider" />
        </div>

        {/* ── BOTTOM BAR ── */}
        <motion.div
          className="ft-bottom"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          style={{
            position: "relative", zIndex: 1,
            maxWidth: 1200, margin: "0 auto",
            padding: "20px 20px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 16, flexWrap: "wrap",
          }}
        >
          <span className="ft-mono" style={{ fontSize: "0.42rem", letterSpacing: "0.32em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase" }}>
            © {currentYear} CONOTEX TECH. ALL RIGHTS RESERVED.
          </span>

          {/* Center line */}
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)", minWidth: 20 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {["Privacy Policy", "Terms of Service"].map((label, i) => (
              <React.Fragment key={label}>
                {i > 0 && <span style={{ width: 1, height: 10, background: "rgba(255,255,255,0.1)", display: "inline-block" }} />}
                <a href="#" className="ft-legal-link">{label}</a>
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;