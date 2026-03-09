import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "HOME",     path: "/" },
  { label: "ABOUT",    path: "/about-us",  scrollId: "about" },
  { label: "SERVICES", path: "/services",  scrollId: "services" },
  { label: "PROJECTS", path: "/projects",  scrollId: "projects" },
  { label: "CLIENTS",  path: "/clients",   scrollId: "partners" },
  { label: "CONTACT",  path: "/contact",   scrollId: "contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [activeIdx, setActiveIdx]           = useState(0);
  const navigate  = useNavigate();
  const location  = useLocation();

  /* ── scroll-to-section on route change ── */
  useEffect(() => {
    const current = NAV_LINKS.find(l => l.path === location.pathname);
    if (current?.scrollId) {
      document.getElementById(current.scrollId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setActiveIdx(NAV_LINKS.findIndex(l => l.path === location.pathname));
  }, [location]);

  /* ── scroll detection ── */
  const handleScroll = useCallback(() => setScrolled(window.scrollY > 10), []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* ── body lock when menu open ── */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
  }, [mobileMenuOpen]);

  const close = () => setMobileMenuOpen(false);
  const go    = (path) => { navigate(path); close(); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

        .nb-root { font-family: 'Barlow', sans-serif; }
        .nb-mono  { font-family: 'Space Mono', monospace; }
        .nb-display { font-family: 'Bebas Neue', sans-serif; }

        /* ── 3-D perspective link hover ── */
        .nb-link {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          overflow: hidden;
          cursor: pointer;
          perspective: 400px;
        }
        .nb-link-front,
        .nb-link-back {
          display: block;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity  0.35s cubic-bezier(0.16, 1, 0.3, 1);
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        .nb-link-back {
          position: absolute;
          top: 0; left: 0; right: 0;
          transform: rotateX(-90deg) translateY(100%);
          opacity: 0;
        }
        .nb-link:hover .nb-link-front {
          transform: rotateX(90deg) translateY(-100%);
          opacity: 0;
        }
        .nb-link:hover .nb-link-back {
          transform: rotateX(0deg) translateY(0%);
          opacity: 1;
        }

        /* ── active underline bar ── */
        .nb-link-active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0; right: 0;
          height: 1.5px;
          background: currentColor;
          transform-origin: left;
          animation: nbUnderline 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes nbUnderline {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        /* ── mobile menu slide-in ── */
        .nb-mobile-menu {
          transform: translateX(100%);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nb-mobile-menu.open {
          transform: translateX(0);
        }

        /* ── mobile link hover ── */
        .nb-mob-link {
          position: relative;
          transition: color 0.2s, padding-left 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nb-mob-link::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%) scaleY(0);
          width: 2px; height: 60%;
          background: var(--accent, #f97316);
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nb-mob-link:hover::before { transform: translateY(-50%) scaleY(1); }
        .nb-mob-link:hover { padding-left: 14px; color: #fff; }

        /* ── quote btn ── */
        .nb-quote-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
        }
        .nb-quote-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.12);
          transform: translateX(-101%);
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nb-quote-btn:hover::before { transform: translateX(0); }
        .nb-quote-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(59,130,246,0.4); }

        /* ── hamburger lines ── */
        .hb-line {
          display: block;
          width: 100%;
          height: 1.5px;
          border-radius: 2px;
          background: #e2e8f0;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1),
                      opacity   0.25s ease,
                      width     0.3s ease;
          transform-origin: center;
        }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        onClick={close}
        className={`fixed inset-0 z-[997] transition-all duration-500 ${
          mobileMenuOpen
            ? "opacity-100 visible backdrop-blur-sm"
            : "opacity-0 invisible"
        }`}
        style={{ background: "rgba(3,4,10,0.7)" }}
      />

      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <nav
        className="nb-root fixed top-0 w-full z-[999] flex justify-center transition-all duration-500"
        style={{
          height: scrolled ? 66 : 90,
          background: scrolled
            ? "rgba(3,4,10,0.92)"
            : "rgba(3,4,10,0.75)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid rgba(255,255,255,0.04)",
          boxShadow: scrolled
            ? "0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset"
            : "none",
        }}
      >
        {/* Inner container */}
        <div className="max-w-7xl w-full flex items-center justify-between px-6">

          {/* ── Logo ── */}
          <Link
            to="/"
            onClick={close}
            className="flex items-center gap-3 group"
            style={{ transition: "opacity 0.2s" }}
          >
            <img
              src="/logo.png"
              alt="Conotex Logo"
              style={{
                height: scrolled ? 44 : 60,
                transition: "height 0.4s cubic-bezier(0.16,1,0.3,1)",
                filter: "brightness(0) invert(1)",   /* force white on dark bg */
                opacity: 0.92,
              }}
            />
          </Link>

          {/* ── Desktop links ── */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link, i) => {
              const isActive = i === activeIdx;
              return (
                <li key={link.label}>
                  <button
                    onClick={() => go(link.path)}
                    className={`nb-link nb-mono text-[11px] tracking-[0.25em] ${
                      isActive ? "nb-link-active" : ""
                    }`}
                    style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.45)" }}
                  >
                    <span className="nb-link-front">{link.label}</span>
                    <span className="nb-link-back" style={{ color: "#3b82f6" }}>{link.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* ── Desktop CTA ── */}
          <div className="hidden md:flex items-center gap-4">
            {/* Subtle divider */}
            <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)" }} />
            <button
              onClick={() => go("/contact")}
              className="nb-quote-btn nb-mono text-[10px] tracking-[0.25em] text-white px-5 py-2.5"
              style={{
                background: "#3b82f6",
                border: "1px solid rgba(59,130,246,0.6)",
              }}
            >
              GET A QUOTE
            </button>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMobileMenuOpen(o => !o)}
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10 rounded z-[1000]"
            aria-label="Toggle menu"
          >
            <span className="hb-line" style={{
              transform: mobileMenuOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none",
              width: mobileMenuOpen ? "100%" : "100%",
            }} />
            <span className="hb-line" style={{
              opacity: mobileMenuOpen ? 0 : 1,
              width: "72%",
              alignSelf: "flex-end",
            }} />
            <span className="hb-line" style={{
              transform: mobileMenuOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none",
            }} />
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          MOBILE SLIDE-OUT MENU
      ══════════════════════════════════════════ */}
      <aside
        className={`nb-mobile-menu ${mobileMenuOpen ? "open" : ""} fixed top-0 right-0 h-full z-[998] flex flex-col`}
        style={{
          width: "min(85vw, 380px)",
          background: "rgba(5,7,18,0.97)",
          backdropFilter: "blur(40px)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "-20px 0 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Top accent line */}
        <div style={{ height: 2, background: "linear-gradient(to right, #3b82f6, #a855f7, transparent)" }} />

        {/* Menu body */}
        <div className="flex flex-col justify-center flex-1 px-10 py-12">

          {/* Label */}
          <div className="nb-mono text-[9px] tracking-[0.4em] text-white/20 uppercase mb-10">
            Navigation
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-1 mb-12">
            {NAV_LINKS.map((link, i) => {
              const isActive = i === activeIdx;
              return (
                <button
                  key={link.label}
                  onClick={() => go(link.path)}
                  className="nb-mob-link nb-display text-left py-3"
                  style={{
                    fontSize: "clamp(2rem, 7vw, 2.6rem)",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.28)",
                    letterSpacing: "0.04em",
                    "--accent": "#3b82f6",
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* CTA */}
          <button
            onClick={() => go("/contact")}
            className="nb-quote-btn nb-mono text-[11px] tracking-[0.25em] text-white py-4 px-6 text-center"
            style={{
              background: "#3b82f6",
              border: "1px solid rgba(59,130,246,0.5)",
              letterSpacing: "0.2em",
            }}
          >
            GET A QUOTE
          </button>

          {/* Bottom meta */}
          <div className="mt-10 pt-8 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="nb-mono text-[9px] text-white/15 tracking-widest uppercase">
              Conotex Tech
            </span>
            <span className="nb-mono text-[9px] text-white/15 tracking-widest">
              USA
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}