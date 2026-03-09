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

  useEffect(() => {
    const current = NAV_LINKS.find(l => l.path === location.pathname);
    if (current?.scrollId) {
      document.getElementById(current.scrollId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setActiveIdx(NAV_LINKS.findIndex(l => l.path === location.pathname));
  }, [location]);

  const handleScroll = useCallback(() => setScrolled(window.scrollY > 10), []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
  }, [mobileMenuOpen]);

  const close = () => setMobileMenuOpen(false);
  const go    = (path) => { navigate(path); close(); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

        .nb-root    { font-family: 'Barlow', sans-serif; }
        .nb-mono    { font-family: 'Space Mono', monospace; }
        .nb-display { font-family: 'Bebas Neue', sans-serif; }

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

        .nb-mobile-menu {
          transform: translateX(100%);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nb-mobile-menu.open {
          transform: translateX(0);
        }

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
          background: var(--accent, #3b82f6);
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nb-mob-link:hover::before { transform: translateY(-50%) scaleY(1); }
        .nb-mob-link:hover { padding-left: 14px; color: #111; }

        .nb-quote-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
        }
        .nb-quote-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.15);
          transform: translateX(-101%);
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nb-quote-btn:hover::before { transform: translateX(0); }
        .nb-quote-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(59,130,246,0.35); }

        .hb-line {
          display: block;
          width: 100%;
          height: 1.5px;
          border-radius: 2px;
          background: #1a1a2e;
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
          mobileMenuOpen ? "opacity-100 visible backdrop-blur-sm" : "opacity-0 invisible"
        }`}
        style={{ background: "rgba(0,0,0,0.4)" }}
      />

      <nav
        className="fixed top-0 w-full z-[999] flex justify-center transition-all duration-500"
        style={{
          height: scrolled ? 56 : 66,
          background: scrolled ? "#f8f9fa" : "#f1f3f5",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: scrolled
            ? "1px solid rgba(0,0,0,0.08)"
            : "1px solid rgba(0,0,0,0.05)",
          boxShadow: scrolled
            ? "0 4px 24px rgba(0,0,0,0.08)"
            : "0 1px 0 rgba(0,0,0,0.04)",
        }}
      >
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
                height: scrolled ? 24 : 28,
                transition: "height 0.4s cubic-bezier(0.16,1,0.3,1)",
                /* removed invert — logo shows naturally on light bg */
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
                    style={{ color: isActive ? "#0f172a" : "rgba(15,23,42,0.45)" }}
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
            <div style={{ width: 1, height: 24, background: "rgba(0,0,0,0.1)" }} />
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
          background: "#f8f9fa",
          backdropFilter: "blur(40px)",
          borderLeft: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "-20px 0 80px rgba(0,0,0,0.15)",
        }}
      >
        {/* Top accent line */}
        <div style={{ height: 2, background: "linear-gradient(to right, #3b82f6, #a855f7, transparent)" }} />

        {/* Menu body */}
        <div className="flex flex-col justify-center flex-1 px-10 py-12">

          {/* Label */}
          <div className="nb-mono text-[9px] tracking-[0.4em] uppercase mb-10"
            style={{ color: "rgba(15,23,42,0.3)" }}>
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
                    color: isActive ? "#0f172a" : "rgba(15,23,42,0.25)",
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
            style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
            <span className="nb-mono text-[9px] tracking-widest uppercase"
              style={{ color: "rgba(15,23,42,0.2)" }}>
              Conotex Tech
            </span>
            <span className="nb-mono text-[9px] tracking-widest"
              style={{ color: "rgba(15,23,42,0.2)" }}>
              USA
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}