import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   SHARED PALETTE — lifted from near-black to rich deep navy
═══════════════════════════════════════════════════════════════ */
const BG_BASE   = "#07101f";   // main background  (was #03040a)
const BG_PANEL  = "#0d1b2e";   // panels, windows  (was #0f172a)
const BG_CHROME = "#132236";   // chrome bars      (was #1e293b)
const BG_UNIT   = "#0f1e33";   // server rows      (was #111827)
const BG_DEEP   = "#091525";   // deepest fills    (was #060b18)

/* ═══════════════════════════════════════════════════════════════
   SVG SCENE ANIMATIONS
═══════════════════════════════════════════════════════════════ */

function SVGWeb({ accent, active }) {
  return (
    <svg viewBox="0 0 900 600" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      {[
        { x: 60,  y: 60,  w: 380, h: 260, delay: 0,   floatAmp: 12, primary: true  },
        { x: 500, y: 100, w: 320, h: 220, delay: 1.2, floatAmp: 8,  primary: false },
        { x: 180, y: 340, w: 280, h: 190, delay: 2.1, floatAmp: 10, primary: false },
      ].map((win, wi) => (
        <motion.g key={wi}
          animate={active ? { y: [0, -win.floatAmp, 0] } : {}}
          transition={{ duration: 4 + wi * 0.7, repeat: Infinity, ease: "easeInOut", delay: win.delay }}>
          <motion.rect x={win.x} y={win.y} width={win.w} height={win.h} rx="8"
            fill={BG_PANEL} stroke={accent} strokeWidth={win.primary ? 1.8 : 1}
            strokeOpacity={win.primary ? 0.75 : 0.35}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: win.delay * 0.4, duration: 0.6, type: "spring" }}
            style={{ transformOrigin: `${win.x + win.w / 2}px ${win.y + win.h / 2}px` }} />
          <rect x={win.x} y={win.y} width={win.w} height={win.h * 0.15} rx="8" fill={BG_CHROME} />
          <rect x={win.x} y={win.y + win.h * 0.12} width={win.w} height={win.h * 0.03} fill={BG_CHROME} />
          {["#ef4444","#f59e0b","#22c55e"].map((col, dot) => (
            <motion.circle key={dot}
              cx={win.x + 16 + dot * 14} cy={win.y + win.h * 0.075}
              r={win.primary ? 5 : 3.5} fill={col}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: win.delay * 0.4 + 0.2 + dot * 0.07, type: "spring", stiffness: 300 }}
              style={{ transformOrigin: `${win.x + 16 + dot * 14}px ${win.y + win.h * 0.075}px` }} />
          ))}
          <motion.rect x={win.x + win.w * 0.28} y={win.y + win.h * 0.04}
            width={win.w * 0.44} height={win.h * 0.08} rx="4"
            fill={BG_DEEP} stroke="#2a3f5a" strokeWidth="0.8"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: win.delay * 0.4 + 0.3 }}
            style={{ transformOrigin: `${win.x + win.w * 0.28}px` }} />
          <motion.text x={win.x + win.w * 0.5} y={win.y + win.h * 0.1}
            fill="#5a7a99" fontSize={win.primary ? 7 : 5.5} fontFamily="monospace" textAnchor="middle"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: win.delay * 0.4 + 0.55 }}>
            conotex.com
          </motion.text>
          <motion.rect x={win.x + win.w * 0.04} y={win.y + win.h * 0.19}
            width={win.w * 0.92} height={win.h * 0.1} rx="2" fill={BG_CHROME}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: win.delay * 0.4 + 0.35 }} />
          {[0,1,2,3].map(nav => (
            <motion.rect key={nav}
              x={win.x + win.w * (0.06 + nav * 0.18)} y={win.y + win.h * 0.22}
              width={win.w * 0.1} height={win.h * 0.04} rx="1"
              fill={nav === 0 ? accent : "#2a3f5a"}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: win.delay * 0.4 + 0.45 + nav * 0.05 }}
              style={{ transformOrigin: `${win.x + win.w * (0.06 + nav * 0.18)}px` }} />
          ))}
          <motion.rect x={win.x + win.w * 0.04} y={win.y + win.h * 0.33}
            width={win.w * 0.55} height={win.h * 0.36} rx="2" fill={BG_CHROME}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: win.delay * 0.4 + 0.5 }} />
          <motion.rect x={win.x + win.w * 0.07} y={win.y + win.h * 0.38}
            width={win.w * 0.38} height={win.h * 0.06} rx="1" fill={accent} fillOpacity="0.9"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: win.delay * 0.4 + 0.6 }} style={{ transformOrigin: `${win.x + win.w * 0.07}px` }} />
          {[0,1].map(line => (
            <motion.rect key={line}
              x={win.x + win.w * 0.07} y={win.y + win.h * (0.47 + line * 0.07)}
              width={win.w * (0.28 - line * 0.05)} height={win.h * 0.04} rx="1" fill="#2a3f5a"
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: win.delay * 0.4 + 0.65 + line * 0.05 }}
              style={{ transformOrigin: `${win.x + win.w * 0.07}px` }} />
          ))}
          <motion.rect x={win.x + win.w * 0.07} y={win.y + win.h * 0.58}
            width={win.w * 0.18} height={win.h * 0.07} rx="2" fill={accent}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: win.delay * 0.4 + 0.72 }} />
          <motion.rect x={win.x + win.w * 0.62} y={win.y + win.h * 0.33}
            width={win.w * 0.34} height={win.h * 0.36} rx="2"
            fill={accent} fillOpacity="0.1" stroke={accent} strokeWidth="0.7" strokeOpacity="0.4"
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: win.delay * 0.4 + 0.55 }} />
          {[0,1,2].map(cl => (
            <motion.rect key={cl}
              x={win.x + win.w * 0.04} y={win.y + win.h * (0.73 + cl * 0.07)}
              width={win.w * (0.35 + cl * 0.12)} height={win.h * 0.04} rx="1" fill={BG_CHROME}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: win.delay * 0.4 + 0.75 + cl * 0.05 }}
              style={{ transformOrigin: `${win.x + win.w * 0.04}px` }} />
          ))}
        </motion.g>
      ))}
      {["<div>","const","fn()","{}","=>","async"].map((token, i) => (
        <motion.text key={i} x={80 + i * 140} y={520 + (i % 2) * 30}
          fill={accent} fontSize="13" fontFamily="monospace"
          animate={{ y: [520+(i%2)*30, 510+(i%2)*30, 520+(i%2)*30], opacity: [0.18, 0.38, 0.18] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.5 }}>
          {token}
        </motion.text>
      ))}
      <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="700" y="380" width="140" height="64" rx="8" fill={BG_PANEL} stroke={accent} strokeWidth="1.4" />
        <text x="770" y="408" fill={accent} fontSize="24" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">99%</text>
        <text x="770" y="430" fill="#5a7a99" fontSize="8" fontFamily="monospace" textAnchor="middle">LIGHTHOUSE SCORE</text>
      </motion.g>
      <motion.rect x="440" y="200" width="4" height="16" fill={accent}
        animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
    </svg>
  );
}

function SVGAi({ accent, active }) {
  const layers = [[3, 110], [5, 85], [5, 85], [3, 110]];
  const nodes = [];
  layers.forEach(([count, startY], li) => {
    for (let ni = 0; ni < count; ni++) {
      nodes.push({ li, ni, x: 140 + li * 210, y: startY + ni * (count === 3 ? 130 : 90) + 50 });
    }
  });
  const edges = [];
  nodes.forEach(a => nodes.forEach(b => {
    if (b.li === a.li + 1) edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, key: `${a.li}-${a.ni}-${b.li}-${b.ni}` });
  }));

  return (
    <svg viewBox="0 0 900 600" fill="none" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      {[0,1,2,3,4].map(i => (
        <line key={`h${i}`} x1="0" y1={i*150} x2="900" y2={i*150} stroke={accent} strokeWidth="0.3" strokeOpacity="0.09" />
      ))}
      {edges.map(({ x1, y1, x2, y2, key }, k) => (
        <motion.line key={key} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={accent} strokeWidth="0.9" strokeOpacity="0.28"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.1 + k * 0.012, duration: 0.7 }} />
      ))}
      {active && edges.slice(0, 12).map(({ x1, y1, x2, y2, key }, k) => (
        <motion.g key={`p${key}`}
          animate={{ x: [x1, x2], y: [y1, y2], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: k * 0.18, ease: "linear" }}>
          <circle r="3" fill={accent} />
        </motion.g>
      ))}
      {nodes.map((n, i) => (
        <motion.g key={i}>
          <motion.g style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2 + i * 0.035, type: "spring", stiffness: 240 }}>
            <circle cx={n.x} cy={n.y} r="18" fill={BG_PANEL} stroke={accent} strokeWidth="1.4" />
          </motion.g>
          <motion.g animate={active ? { opacity: [0.8, 1, 0.8] } : {}}
            transition={{ duration: 2 + i * 0.1, repeat: Infinity, delay: i * 0.12 }}>
            <circle cx={n.x} cy={n.y} r="6" fill={accent} />
          </motion.g>
          <motion.g style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            animate={active ? { scale: [1, 1.55, 1], opacity: [0.4, 0, 0.4] } : { opacity: 0 }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.15 }}>
            <circle cx={n.x} cy={n.y} r="18" fill="none" stroke={accent} strokeWidth="0.8" />
          </motion.g>
        </motion.g>
      ))}
      {["INPUT","HIDDEN1","HIDDEN2","OUTPUT"].map((l, i) => (
        <motion.text key={l} x={140 + i * 210} y="570" fill="#5a7a99" fontSize="9"
          fontFamily="monospace" textAnchor="middle"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + i * 0.08 }}>
          {l}
        </motion.text>
      ))}
      <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="700" y="30" width="148" height="64" rx="8" fill={BG_PANEL} stroke="#22c55e" strokeWidth="1.4" />
        <text x="774" y="60" fill="#22c55e" fontSize="26" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">10×</text>
        <text x="774" y="82" fill="#5a7a99" fontSize="8" fontFamily="monospace" textAnchor="middle">SEARCH ACCURACY</text>
      </motion.g>
      <motion.path
        d="M 0 520 C 60 500 80 540 140 520 C 200 500 220 540 280 520 C 340 500 360 540 420 520 C 480 500 500 540 560 520 C 620 500 640 540 700 520 C 760 500 780 540 840 520 C 870 512 880 520 900 515"
        stroke={accent} strokeWidth="1.5" fill="none" strokeOpacity="0.38"
        animate={{ strokeDashoffset: [0, -200] }}
        style={{ strokeDasharray: "8 4" }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
    </svg>
  );
}

function SVGCyber({ accent, active }) {
  return (
    <svg viewBox="0 0 900 600" fill="none" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      {[1,2,3,4,5].map(r => (
        <motion.g key={r} style={{ transformOrigin: "450px 300px" }}
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: r * 0.08, duration: 0.7 }}>
          <circle cx="450" cy="300" r={r * 80}
            stroke={accent} strokeWidth="0.7" strokeOpacity={0.1 + r * 0.03} strokeDasharray="6 4" fill="none" />
        </motion.g>
      ))}
      {active && (
        <motion.g style={{ transformOrigin: "450px 300px" }} animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}>
          <line x1="450" y1="300" x2="450" y2="30" stroke={accent} strokeWidth="1.5" strokeOpacity="0.55" />
          <path d="M 450 300 L 450 30 A 270 270 0 0 1 490 32 Z" fill={accent} fillOpacity="0.08" />
        </motion.g>
      )}
      <motion.path
        d="M450 70 L540 120 L540 240 Q540 360 450 410 Q360 360 360 240 L360 120 Z"
        fill={BG_PANEL} stroke={accent} strokeWidth="2.5"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
        style={{ transformOrigin: "450px 240px" }} />
      <motion.path
        d="M450 90 L525 134 L525 238 Q525 344 450 388 Q375 344 375 238 L375 134 Z"
        fill={accent} fillOpacity="0.07"
        animate={{ fillOpacity: [0.04, 0.12, 0.04] }}
        transition={{ duration: 2.5, repeat: Infinity }} />
      <motion.rect x="422" y="230" width="56" height="44" rx="6" fill={accent}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} />
      <motion.path d="M434 230 Q434 200 450 200 Q466 200 466 230"
        stroke={accent} strokeWidth="7" fill="none" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }} />
      <motion.circle cx="450" cy="254" r="7" fill={BG_DEEP}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.95 }}
        style={{ transformOrigin: "450px 254px" }} />
      {[{ x: 120, y: 100 },{ x: 760, y: 150 },{ x: 100, y: 460 },{ x: 780, y: 420 },{ x: 440, y: 510 }].map((n, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.1 }}>
          <circle cx={n.x} cy={n.y} r="12" fill={BG_PANEL} stroke="#ef4444" strokeWidth="1.4" />
          {active && (
            <motion.circle cx={n.x} cy={n.y} r="12" fill="none" stroke="#ef4444" strokeWidth="1"
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              animate={{ scale: [1, 2.33, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.45 }} />
          )}
          <text x={n.x} y={n.y + 5} fill="#ef4444" fontSize="10" fontFamily="monospace" textAnchor="middle">×</text>
          <motion.line x1={n.x} y1={n.y} x2="450" y2="240"
            stroke="#ef4444" strokeWidth="0.7" strokeOpacity="0.22" strokeDasharray="5 4"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 1 + i * 0.1, duration: 0.9 }} />
        </motion.g>
      ))}
      <motion.rect x="0" y="0" width="900" height="2" fill={accent} fillOpacity="0.14"
        animate={{ y: [0, 600, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
      <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 3.2, repeat: Infinity }}>
        <rect x="30" y="30" width="140" height="64" rx="8" fill={BG_PANEL} stroke={accent} strokeWidth="1.4" />
        <text x="100" y="60" fill={accent} fontSize="22" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">0-DAY</text>
        <text x="100" y="80" fill="#5a7a99" fontSize="8" fontFamily="monospace" textAnchor="middle">THREAT RESPONSE</text>
      </motion.g>
    </svg>
  );
}

function SVGServer({ accent, active }) {
  return (
    <svg viewBox="0 0 900 600" fill="none" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      <motion.polygon points="160,80 160,480 220,520 220,120"
        fill="#0b182b" stroke={accent} strokeWidth="0.9" strokeOpacity="0.38"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
      <motion.polygon points="160,80 600,80 660,120 220,120"
        fill="#16294a" stroke={accent} strokeWidth="0.9" strokeOpacity="0.45"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
      <motion.polygon points="220,120 660,120 660,520 220,520"
        fill={BG_UNIT}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
      <polygon points="220,120 660,120 660,520 220,520" fill="none" stroke={accent} strokeWidth="0.9" strokeOpacity="0.28" />
      {Array.from({ length: 11 }, (_, i) => {
        const uy = 136 + i * 34;
        const busy = i % 3 === 1;
        const idle = i === 7;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}>
            <rect x="228" y={uy} width="424" height="26" rx="2" fill="#111e30" />
            <circle cx="244" cy={uy + 13} r="4.5"
              fill={idle ? "#1e3050" : busy ? "#f59e0b" : accent}
              style={{ animation: active && !idle ? `ledPulse ${0.8 + i * 0.1}s ease-in-out ${i * 0.12}s infinite` : "none" }} />
            {Array.from({ length: 8 }, (_, b) => (
              <rect key={b} x={256 + b * 16} y={uy + 7} width="10" rx="1"
                fill={accent} fillOpacity="0.55" height={active ? 8 + b * 1.5 : 4}
                style={active ? { animation: `eqBar ${(1.2 + b * 0.15).toFixed(2)}s ease-in-out ${(i * 0.08 + b * 0.1).toFixed(2)}s infinite` } : {}} />
            ))}
            <rect x="404" y={uy + 8} width="220" height="10" rx="2" fill={BG_DEEP} />
            <motion.rect x="404" y={uy + 8} width="220" height="10" rx="2" fill={accent} fillOpacity="0.7"
              style={{ transformOrigin: "404px center" }}
              animate={{ scaleX: [0.27, (140 + i * 14) / 220, 0.36, 0.86, 0.27] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, repeatType: "mirror" }} />
          </motion.g>
        );
      })}
      {Array.from({ length: 11 }, (_, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.04 }}>
          <rect x="656" y={136 + i * 34 + 3} width="32" height="20" rx="1" fill={BG_DEEP} />
          <circle cx="672" cy={136 + i * 34 + 13} r="3.5" fill={accent} fillOpacity="0.55"
            style={{ animation: active ? `ledPulse 1.5s ease-in-out ${i * 0.15}s infinite` : "none" }} />
        </motion.g>
      ))}
      {[150,200,260,320,370].map((y, i) => (
        <motion.path key={i} d={`M 688 ${y} C 730 ${y} 740 ${y+20} 780 ${y+10}`}
          stroke={accent} strokeWidth="1" strokeOpacity="0.45" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }} />
      ))}
      <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 3.8, repeat: Infinity }}>
        <rect x="720" y="400" width="148" height="64" rx="8" fill={BG_PANEL} stroke={accent} strokeWidth="1.4" />
        <text x="794" y="430" fill={accent} fontSize="22" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">99.9%</text>
        <text x="794" y="450" fill="#5a7a99" fontSize="8" fontFamily="monospace" textAnchor="middle">UPTIME SLA</text>
      </motion.g>
    </svg>
  );
}

function SVGDesktop({ accent, active }) {
  return (
    <svg viewBox="0 0 900 600" fill="none" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      {[
        { x: 80,  y: 60,  w: 420, h: 280, depth: 20, scale: 1    },
        { x: 540, y: 100, w: 310, h: 206, depth: 14, scale: 0.74 },
        { x: 240, y: 370, w: 260, h: 173, depth: 12, scale: 0.62 },
      ].map((mon, mi) => (
        <motion.g key={mi}
          initial={{ opacity: 0, y: mi * -10 - 15 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: mi * 0.15, duration: 0.6, type: "spring" }}>
          <polygon
            points={`${mon.x},${mon.y} ${mon.x+mon.depth},${mon.y-mon.depth} ${mon.x+mon.w+mon.depth},${mon.y-mon.depth} ${mon.x+mon.w},${mon.y}`}
            fill="#16294a" />
          <polygon
            points={`${mon.x+mon.w},${mon.y} ${mon.x+mon.w+mon.depth},${mon.y-mon.depth} ${mon.x+mon.w+mon.depth},${mon.y+mon.h-mon.depth} ${mon.x+mon.w},${mon.y+mon.h}`}
            fill="#0c1e33" />
          <rect x={mon.x} y={mon.y} width={mon.w} height={mon.h} rx="4" fill={BG_DEEP}
            stroke={mi === 0 ? accent : "#2a3f5a"} strokeWidth={mi === 0 ? 1.8 : 0.9}
            strokeOpacity={mi === 0 ? 0.8 : 0.35} />
          <rect x={mon.x} y={mon.y + mon.h - mon.h * 0.12} width={mon.w} height={mon.h * 0.12} fill={BG_UNIT} />
          {mi === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <rect x={mon.x + 18} y={mon.y + 18} width={mon.w - 36} height={mon.h - 54} rx="4" fill="#0a1525" />
              <rect x={mon.x + 18} y={mon.y + 18} width={mon.w - 36} height={22} rx="4" fill={BG_CHROME} />
              {["#ef4444","#f59e0b","#22c55e"].map((col, dot) => (
                <circle key={dot} cx={mon.x + 32 + dot * 14} cy={mon.y + 29} r="4" fill={col} />
              ))}
              {[
                { text: "> System scan complete",     color: accent,    y: 60  },
                { text: "> 0 threats detected",       color: "#22c55e", y: 78  },
                { text: "> Patch KB5034441 applied",  color: "#7a9abc", y: 96  },
                { text: "> All 48 endpoints OK",      color: "#7a9abc", y: 114 },
                { text: "> Remote session active_",   color: accent,    y: 132 },
              ].map((line, li) => (
                <motion.text key={li} x={mon.x + 26} y={mon.y + line.y}
                  fill={line.color} fontSize="8" fontFamily="monospace"
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + li * 0.16 }}>
                  {line.text}
                </motion.text>
              ))}
              <motion.rect x={mon.x + 26} y={mon.y + 138} width="6" height="10" fill={accent}
                animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            </motion.g>
          )}
          <rect x={mon.x + mon.w/2 - 12} y={mon.y + mon.h} width="24" height={28 * mon.scale} rx="2" fill="#1a2e4a" />
          <rect x={mon.x + mon.w/2 - 44} y={mon.y + mon.h + 28 * mon.scale} width="88" height={10 * mon.scale} rx="5" fill="#1a2e4a" />
        </motion.g>
      ))}
      <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        <rect x="30" y="460" width="148" height="64" rx="8" fill={BG_PANEL} stroke={accent} strokeWidth="1.4" />
        <text x="104" y="490" fill={accent} fontSize="22" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">&lt;2HR</text>
        <text x="104" y="510" fill="#5a7a99" fontSize="8" fontFamily="monospace" textAnchor="middle">AVG RESPONSE</text>
      </motion.g>
    </svg>
  );
}

function SVGNetwork({ accent, active }) {
  const nodePositions = [
    { x: 450, y: 300, r: 22, main: true },
    { x: 200, y: 160, r: 14 }, { x: 680, y: 140, r: 14 },
    { x: 130, y: 380, r: 12 }, { x: 760, y: 360, r: 12 },
    { x: 300, y: 480, r: 12 }, { x: 620, y: 490, r: 12 },
    { x: 80,  y: 240, r: 9  }, { x: 820, y: 240, r: 9  },
    { x: 380, y: 100, r: 9  }, { x: 530, y: 110, r: 9  },
    { x: 170, y: 530, r: 8  }, { x: 730, y: 530, r: 8  },
  ];
  const connections = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,7],[1,9],[2,8],[2,10],[3,7],[5,11],[6,12],[4,8]];
  return (
    <svg viewBox="0 0 900 600" fill="none" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      {connections.map(([a, b], k) => {
        const na = nodePositions[a], nb = nodePositions[b];
        return (
          <motion.g key={k}>
            <motion.line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={accent} strokeWidth="0.9" strokeOpacity="0.28"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.2 + k * 0.07, duration: 0.7 }} />
            {active && (
              <motion.g
                animate={{ x: [na.x, nb.x, na.x], y: [na.y, nb.y, na.y], opacity: [0, 0.9, 0.9, 0] }}
                transition={{ duration: 2 + k * 0.15, repeat: Infinity, delay: k * 0.22, ease: "linear" }}>
                <circle r="3.5" fill={accent} />
              </motion.g>
            )}
          </motion.g>
        );
      })}
      {nodePositions.map((n, i) => (
        <motion.g key={i}>
          <motion.g style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            animate={active ? { scale: [1, 1.55, 1], opacity: [0.15, 0, 0.15] } : { opacity: 0.06 }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}>
            <circle cx={n.x} cy={n.y} r={n.r * 1.8} fill={accent} fillOpacity="0.06" />
          </motion.g>
          <motion.g style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 200 }}>
            <circle cx={n.x} cy={n.y} r={n.r}
              fill={BG_PANEL} stroke={n.main ? accent : `${accent}99`}
              strokeWidth={n.main ? "2" : "1"} />
          </motion.g>
          <motion.g style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            animate={active && n.main ? { scale: [1, 1.33, 1] } : {}}>
            <circle cx={n.x} cy={n.y} r={n.r * 0.45} fill={accent} fillOpacity={n.main ? "0.9" : "0.55"} />
          </motion.g>
          {n.main && <text x={n.x} y={n.y + 4} fill="#fff" fontSize="8" fontFamily="monospace" textAnchor="middle">CORE</text>}
        </motion.g>
      ))}
      <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 3.6, repeat: Infinity }}>
        <rect x="660" y="30" width="200" height="64" rx="8" fill={BG_PANEL} stroke={accent} strokeWidth="1.4" />
        <text x="760" y="60" fill={accent} fontSize="26" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">100G</text>
        <text x="760" y="80" fill="#5a7a99" fontSize="8" fontFamily="monospace" textAnchor="middle">MAX THROUGHPUT</text>
      </motion.g>
    </svg>
  );
}

function SVGSurveillance({ accent, active }) {
  return (
    <svg viewBox="0 0 900 600" fill="none" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      {[0,1,2,3,4,5].map(i => <line key={`h${i}`} x1="0" y1={i*100} x2="900" y2={i*100} stroke={accent} strokeWidth="0.4" strokeOpacity="0.09" />)}
      {[0,1,2,3,4,5,6,7].map(i => <line key={`v${i}`} x1={i*112.5} y1="0" x2={i*112.5} y2="600" stroke={accent} strokeWidth="0.4" strokeOpacity="0.09" />)}
      <motion.g initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, type: "spring" }}>
        <rect x="400" y="20" width="100" height="14" rx="3" fill={BG_CHROME} stroke={accent} strokeWidth="0.9" strokeOpacity="0.45" />
        <rect x="440" y="34" width="20" height="36" rx="2" fill="#2a3f5a" />
      </motion.g>
      <motion.g
        animate={active ? { rotate: [-18, 18, -18] } : {}}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "450px 70px" }}>
        <motion.rect x="340" y="60" width="220" height="80" rx="12"
          fill={BG_PANEL} stroke={accent} strokeWidth="1.6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
        <circle cx="500" cy="100" r="28" fill={BG_DEEP} stroke={accent} strokeWidth="1.3" />
        <circle cx="500" cy="100" r="18" fill={accent} fillOpacity="0.14" />
        <motion.circle cx="500" cy="100" r="10" fill={accent} fillOpacity="0.45"
          style={{ transformOrigin: "500px 100px" }}
          animate={active ? { scale: [1, 1.3, 1], opacity: [0.4, 0.75, 0.4] } : {}}
          transition={{ duration: 2, repeat: Infinity }} />
        {[0,1,2].map(i => <rect key={i} x={356 + i * 22} y="75" width="14" height="8" rx="2" fill={BG_CHROME} />)}
        <circle cx="358" cy="112" r="5" fill="#ef4444"
          style={{ animation: active ? "ledPulse 1.2s ease-in-out infinite" : "none", opacity: 0.5 }} />
      </motion.g>
      <motion.g
        animate={active ? { rotate: [-18, 18, -18] } : {}}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "450px 70px" }}>
        <motion.path d="M 490 128 L 160 540 L 820 540 Z"
          fill={accent} fillOpacity="0.05" stroke={accent} strokeWidth="0.7" strokeOpacity="0.18"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
      </motion.g>
      {[{ x: 200, y: 320, w: 80, h: 110 },{ x: 520, y: 350, w: 70, h: 90 },{ x: 690, y: 280, w: 60, h: 80 }].map((box, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.2 }}>
          <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="none" stroke={accent} strokeWidth="1.1" strokeDasharray="5 3" />
          <motion.rect x={box.x} y={box.y} width={box.w} height={box.h}
            fill="none" stroke={accent} strokeWidth="1.6"
            animate={active ? { opacity: [0.2, 0.85, 0.2] } : { opacity: 0.25 }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.6 }} />
          <text x={box.x + 2} y={box.y - 4} fill={accent} fontSize="7" fontFamily="monospace">DETECT</text>
        </motion.g>
      ))}
      {[[30,30],[870,30],[30,570],[870,570]].map(([bx,by], i) => {
        const fx = bx < 450 ? 1 : -1, fy = by < 300 ? 1 : -1;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}>
            <line x1={bx} y1={by} x2={bx+fx*28} y2={by} stroke={accent} strokeWidth="2" strokeOpacity="0.75" />
            <line x1={bx} y1={by} x2={bx} y2={by+fy*28} stroke={accent} strokeWidth="2" strokeOpacity="0.75" />
          </motion.g>
        );
      })}
      <motion.g animate={active ? { opacity: [0.6, 1, 0.6] } : {}} transition={{ duration: 1.3, repeat: Infinity }}>
        <rect x="740" y="24" width="110" height="28" rx="3" fill={BG_PANEL} stroke="#ef4444" strokeWidth="0.9" />
        <circle cx="754" cy="38" r="5" fill="#ef4444" />
        <text x="770" y="43" fill="#ef4444" fontSize="8" fontFamily="monospace">● REC</text>
      </motion.g>
      <motion.g animate={{ y: [0, -7, 0] }} transition={{ duration: 3.3, repeat: Infinity }}>
        <rect x="30" y="460" width="148" height="64" rx="8" fill={BG_PANEL} stroke={accent} strokeWidth="1.4" />
        <text x="104" y="490" fill={accent} fontSize="26" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">4K</text>
        <text x="104" y="510" fill="#5a7a99" fontSize="8" fontFamily="monospace" textAnchor="middle">AI RESOLUTION</text>
      </motion.g>
    </svg>
  );
}

function SVGTelecom({ accent, active }) {
  return (
    <svg viewBox="0 0 900 600" fill="none" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      <motion.line x1="450" y1="20" x2="450" y2="520"
        stroke={accent} strokeWidth="3" strokeOpacity="0.75"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
      {[[-60,-28],[60,-28],[-90,40],[90,40],[-120,110],[120,110],[-140,200],[140,200]].map(([ox,oy], i) => (
        <motion.line key={i} x1="450" y1={200+oy} x2={450+ox} y2={200+oy+48}
          stroke="#2a3f5a" strokeWidth="3" strokeLinecap="round"
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.1 + i * 0.07 }} style={{ transformOrigin: "450px" }} />
      ))}
      <motion.circle cx="450" cy="20" r="9" fill={accent}
        style={{ transformOrigin: "450px 20px" }}
        animate={active ? { scale: [1, 1.33, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }} />
      {active && [1,2,3,4,5].map(r => (
        <motion.circle key={r} cx="450" cy="300" r="1" stroke={accent} strokeWidth="1" fill="none"
          style={{ transformOrigin: "450px 300px" }}
          animate={{ scale: [0, r * 100 + 80], opacity: [0.6, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: r * 0.55, ease: "easeOut" }} />
      ))}
      <motion.ellipse cx="450" cy="520" rx="80" ry="16" fill={BG_CHROME}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} />
      <motion.path
        d="M 0 560 C 45 540 55 580 100 560 C 145 540 155 580 200 560 C 245 540 255 580 300 560 C 345 540 355 580 400 560 C 445 540 455 580 500 560 C 545 540 555 580 600 560 C 645 540 655 580 700 560 C 745 540 755 580 800 560 C 845 540 855 580 900 560"
        stroke={accent} strokeWidth="1.8" fill="none" strokeOpacity="0.45"
        animate={{ strokeDashoffset: [0, -120] }}
        style={{ strokeDasharray: "6 3" }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
      {[{ x: 120, y: 180, label: "VOIP" },{ x: 760, y: 200, label: "PBX" },{ x: 80, y: 420, label: "WAN" },{ x: 800, y: 400, label: "SIP" }].map((dev, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 + i * 0.12, type: "spring" }}
          style={{ transformOrigin: `${dev.x}px ${dev.y}px` }}>
          <rect x={dev.x - 28} y={dev.y - 16} width="56" height="32" rx="4"
            fill={BG_PANEL} stroke={accent} strokeWidth="0.9" strokeOpacity="0.55" />
          <text x={dev.x} y={dev.y + 5} fill={accent} fontSize="7" fontFamily="monospace" textAnchor="middle">{dev.label}</text>
          <motion.line x1={dev.x} y1={dev.y} x2="450" y2="300"
            stroke={accent} strokeWidth="0.55" strokeOpacity="0.22" strokeDasharray="5 4"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.9 + i * 0.1, duration: 0.7 }} />
          {active && (
            <motion.circle r="3" cx={dev.x} cy={dev.y} fill={accent}
              animate={{ x: [0, 450-dev.x], y: [0, 300-dev.y], opacity: [0, 0.8, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: "linear" }} />
          )}
        </motion.g>
      ))}
      <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 3.4, repeat: Infinity }}>
        <rect x="30" y="30" width="148" height="64" rx="8" fill={BG_PANEL} stroke={accent} strokeWidth="1.4" />
        <text x="104" y="60" fill={accent} fontSize="22" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">&lt;20ms</text>
        <text x="104" y="80" fill="#5a7a99" fontSize="8" fontFamily="monospace" textAnchor="middle">LATENCY</text>
      </motion.g>
    </svg>
  );
}

function SVGAV({ accent, active }) {
  return (
    <svg viewBox="0 0 900 600" fill="none" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      <motion.rect x="160" y="40" width="580" height="360" rx="8"
        fill={BG_PANEL} stroke={accent} strokeWidth="1.6"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }} style={{ transformOrigin: "450px 220px" }} />
      {[[168,48,278,172],[450,48,282,172],[168,224,182,168],[354,224,182,168],[540,224,192,168]].map(([x,y,w,h], pi) => (
        <motion.g key={pi} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + pi * 0.1 }}>
          <rect x={x+2} y={y+2} width={w-4} height={h-4} rx="3" fill={pi === 0 ? "#1a1040" : "#0e1e35"} />
          {pi === 0 ? (
            <>
              {Array.from({ length: 14 }, (_, b) => {
                const maxH = 20 + b * 6;
                return (
                  <rect key={b} x={x+10+b*18} y={y+h-14-maxH} width="12" rx="2"
                    fill={accent} fillOpacity="0.88" height={maxH}
                    style={active ? { animation: `eqPulse ${(1.4+b*0.1).toFixed(2)}s ease-in-out ${(b*0.08).toFixed(2)}s infinite alternate` } : { height: 8 }} />
                );
              })}
              <text x={x+w/2} y={y+40} fill={accent} fontSize="22" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">AV / MEDIA</text>
            </>
          ) : (
            Array.from({ length: Math.floor(w / 24) }, (_, b) => {
              const maxH = 16 + b * 4;
              const color = `hsl(${(pi * 55 + b * 25) % 360}, 65%, 55%)`;
              return (
                <rect key={b} x={x+4+b*22} y={y+h-14-maxH} width="16" rx="2"
                  fill={color} fillOpacity="0.75" height={maxH}
                  style={active ? { animation: `eqPulse ${(1.6+b*0.12).toFixed(2)}s ease-in-out ${(pi*0.3+b*0.07).toFixed(2)}s infinite alternate` } : { height: 6 }} />
              );
            })
          )}
        </motion.g>
      ))}
      {[{ x: 60, side: "left" }, { x: 754, side: "right" }].map(({ x, side }) => (
        <motion.g key={side} initial={{ opacity: 0, x: side === "left" ? -14 : 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <rect x={x} y="100" width="86" height="260" rx="6" fill={BG_PANEL} stroke={accent} strokeWidth="1.1" strokeOpacity="0.65" />
          <circle cx={x+43} cy="186" r="28" fill="#1a1040" stroke={accent} strokeWidth="0.9" />
          <motion.circle cx={x+43} cy="186" r="16" fill={accent} fillOpacity="0.28"
            style={{ transformOrigin: `${x+43}px 186px` }}
            animate={active ? { scale: [1, 1.38, 1] } : {}}
            transition={{ duration: 1.6, repeat: Infinity, delay: side === "right" ? 0.4 : 0 }} />
          <circle cx={x+43} cy="186" r="7" fill={accent} fillOpacity="0.85" />
          <circle cx={x+43} cy="282" r="16" fill="#1a1040" stroke={accent} strokeWidth="0.7" />
          <circle cx={x+43} cy="282" r="6" fill={accent} fillOpacity="0.55" />
          {active && [1,2,3].map(r => {
            const ox = side === "left" ? 60 : 840;
            const cx2 = side === "left" ? 60 - r * 14 : 840 + r * 14;
            return (
              <motion.path key={r}
                d={`M ${ox} 186 Q ${cx2} 170 ${cx2} 186 Q ${cx2} 202 ${ox} 186`}
                stroke={accent} strokeWidth="1" fill="none" strokeOpacity={0.55 - r * 0.1}
                animate={{ opacity: [0.2, 0.65, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: r * 0.3 + (side === "right" ? 0.2 : 0) }} />
            );
          })}
        </motion.g>
      ))}
      <motion.rect x="428" y="400" width="44" height="40" rx="2" fill={BG_CHROME}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} />
      <motion.rect x="358" y="438" width="184" height="14" rx="7" fill={BG_CHROME}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.75 }} style={{ transformOrigin: "450px" }} />
      <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 3.8, repeat: Infinity }}>
        <rect x="340" y="470" width="220" height="64" rx="8" fill={BG_PANEL} stroke={accent} strokeWidth="1.4" />
        <text x="450" y="500" fill={accent} fontSize="26" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">8K</text>
        <text x="450" y="520" fill="#5a7a99" fontSize="8" fontFamily="monospace" textAnchor="middle">DISPLAY QUALITY</text>
      </motion.g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE DATA
═══════════════════════════════════════════════════════════════ */
const SLIDES = [
  { id: 1, headline: "Custom Websites",    subheadline: "Full-Stack & UX Design",           intro: "High-performance responsive interfaces engineered for speed.\nOptimized to convert digital traffic into measurable revenue.",  cta: { primary: "Initiate Development", secondary: "Technology Stack"   }, accent: "#f97316", tag: "WEB DEV",   scene: "web",          stat: { value: "99%",   label: "Lighthouse Score"  } },
  { id: 2, headline: "Search Intelligence",subheadline: "Machine Learning & QA",             intro: "Precision tuning for LLMs and enterprise search engines.\nEnsuring data accuracy and reliability in the AI era.",             cta: { primary: "Audit Data",           secondary: "Methodology"        }, accent: "#3b82f6", tag: "AI / ML",   scene: "ai",           stat: { value: "10×",   label: "Search Accuracy"   } },
  { id: 3, headline: "Cybersecurity",      subheadline: "Security & Defense Architecture",   intro: "Real-time threat detection and zero-trust implementation.\nHardening your perimeter with advanced penetration testing.",        cta: { primary: "Deploy Shield",        secondary: "Threat Map"         }, accent: "#ef4444", tag: "SECURITY",  scene: "cyber",        stat: { value: "0-day", label: "Threat Response"   } },
  { id: 4, headline: "Managed IT",         subheadline: "Systems Operations & Maintenance",  intro: "Complete outsourced management of your server infrastructure.\nProactive monitoring so you can focus on scaling.",               cta: { primary: "Consultation",         secondary: "Service Packages"   }, accent: "#10b981", tag: "IT OPS",    scene: "server",       stat: { value: "99.9%", label: "Uptime SLA"        } },
  { id: 5, headline: "Desktop Support",    subheadline: "Endpoint & Helpdesk Management",    intro: "Rapid-response resolution for hardware and software issues.\nRemote and on-site support across all enterprise endpoints.",       cta: { primary: "Request Support",      secondary: "Service Level"      }, accent: "#8b5cf6", tag: "SUPPORT",   scene: "desktop",      stat: { value: "<2hr",  label: "Avg Response"      } },
  { id: 6, headline: "Structured Cabling", subheadline: "Infrastructure & Network Layer",    intro: "High-density fiber and copper architectures for 99.9% uptime.\nThe physical backbone for enterprise-grade connectivity.",        cta: { primary: "Specifications",       secondary: "Network Topology"   }, accent: "#06b6d4", tag: "CABLING",   scene: "network",      stat: { value: "100G",  label: "Max Throughput"    } },
  { id: 7, headline: "IP Surveillance",    subheadline: "Vision & AI Monitoring",            intro: "AI-powered motion analytics with encrypted remote access.\nEnd-to-end monitoring for high-security environments.",               cta: { primary: "Secure Infrastructure",secondary: "Case Studies"       }, accent: "#eab308", tag: "CCTV / AI", scene: "surveillance", stat: { value: "4K",    label: "AI Resolution"     } },
  { id: 8, headline: "Telecom & VoIP",     subheadline: "Unified Communications",            intro: "Low-latency voice and data synchronization for global teams.\nSeamlessly integrated multi-channel communication systems.",         cta: { primary: "Connect Systems",      secondary: "System Audit"       }, accent: "#f43f5e", tag: "VOIP",      scene: "telecom",      stat: { value: "<20ms", label: "Latency"           } },
  { id: 9, headline: "Modern AV",          subheadline: "Multimedia & Presentation Tech",    intro: "Smart-room technology and interactive display integration.\nAutomated acoustic environments for modern boardrooms.",              cta: { primary: "Request Quote",        secondary: "Solution Gallery"   }, accent: "#a855f7", tag: "AV / MEDIA",scene: "av",           stat: { value: "8K",    label: "Display Quality"   } },
];

const SLIDE_INTERVAL = 7000;
const SCENE_MAP = {
  web: SVGWeb, ai: SVGAi, cyber: SVGCyber, server: SVGServer,
  desktop: SVGDesktop, network: SVGNetwork, surveillance: SVGSurveillance,
  telecom: SVGTelecom, av: SVGAV,
};

/* ═══════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════ */
const Hero = () => {
  const [current, setCurrent]             = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress]           = useState(0);
  const [touchStart, setTouchStart]       = useState(null);
  const timerRef = useRef(null);
  const rafRef   = useRef(null);
  const startRef = useRef(null);

  const goTo = useCallback((index) => {
    if (transitioning || index === current) return;
    setTransitioning(true);
    setTimeout(() => { setCurrent(index); setTransitioning(false); startRef.current = null; }, 500);
  }, [current, transitioning]);

  const handleNext = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const handlePrev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    if (!isAutoPlaying) { setProgress(0); return; }
    startRef.current = performance.now();
    const tick = (now) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      setProgress(Math.min((elapsed / SLIDE_INTERVAL) * 100, 100));
      if (elapsed < SLIDE_INTERVAL) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [current, isAutoPlaying]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    timerRef.current = setInterval(handleNext, SLIDE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [isAutoPlaying, handleNext]);

  const manualNav = (i) => { setIsAutoPlaying(false); goTo(i); };
  const scrollTo  = (e, id) => { e.preventDefault(); document.querySelector(id)?.scrollIntoView({ behavior: "smooth" }); };
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd   = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? handleNext() : handlePrev(); setIsAutoPlaying(false); }
    setTouchStart(null);
  };

  const slide          = SLIDES[current];
  const SceneComponent = SCENE_MAP[slide.scene];

  return (
    <section id="home"
      className="relative w-full overflow-hidden text-white select-none"
      style={{ height: "100svh", minHeight: 480, background: BG_BASE }}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Space+Mono:wght@400;700&display=swap');

        .h-display { font-family: 'Bebas Neue', sans-serif !important; letter-spacing: 0.03em; }
        .h-body    { font-family: 'Barlow', sans-serif !important; }
        .h-mono    { font-family: 'Space Mono', monospace !important; }
        .h-root *  { font-family: 'Barlow', sans-serif; }

        .h-enter  { animation: hEnter 0.65s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes hEnter { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .h-d1 { animation-delay:.04s; } .h-d2 { animation-delay:.12s; }
        .h-d3 { animation-delay:.20s; } .h-d4 { animation-delay:.28s; }
        .h-d5 { animation-delay:.36s; }

        .h-btn-primary {
          position:relative; overflow:hidden; cursor:pointer;
          transition: transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s;
        }
        .h-btn-primary::before {
          content:''; position:absolute; inset:0;
          background:rgba(255,255,255,0.16); transform:translateX(-102%);
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .h-btn-primary:hover::before { transform:translateX(0); }
        .h-btn-primary:hover { transform:translateY(-2px); }

        .h-btn-ghost {
          border:1px solid rgba(255,255,255,0.2); color:rgba(255,255,255,0.75);
          transition:all 0.22s; background:rgba(255,255,255,0.05); backdrop-filter:blur(8px);
        }
        .h-btn-ghost:hover { border-color:rgba(255,255,255,0.45); color:#fff; background:rgba(255,255,255,0.1); transform:translateY(-2px); }

        .h-nav-item { transition:all 0.22s; border-left:2px solid transparent; cursor:pointer; }
        .h-nav-item:hover  { border-left-color:rgba(255,255,255,0.2); background:rgba(255,255,255,0.03); }
        .h-nav-item.active { border-left-color:var(--slide-accent); }

        .h-ping { animation: hPing 1.6s cubic-bezier(0,0,0.2,1) infinite; }
        @keyframes hPing   { 75%,100% { transform:scale(2.4); opacity:0; } }
        @keyframes ledPulse { 0%,100% { opacity:0.45; } 50% { opacity:1; } }
        @keyframes eqPulse  { 0% { transform:scaleY(0.3); } 100% { transform:scaleY(1); } }
        @keyframes eqBar    { 0%,100% { transform:scaleY(0.35); } 50% { transform:scaleY(1); } }

        .h-noise {
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity:0.028; pointer-events:none;
        }
        .h-noscroll { scrollbar-width:none; }
        .h-noscroll::-webkit-scrollbar { display:none; }

        @media (min-width:1024px) { #home { min-height:640px !important; } }
        @media (max-width:1023px) { #home { margin-top:66px !important; height:78svh !important; min-height:440px !important; max-height:680px !important; } }
        @media (max-width:480px)  { #home { height:74svh !important; min-height:400px !important; max-height:600px !important; } }
      `}</style>

      {/* Noise */}
      <div className="h-noise absolute inset-0 z-[1]" />

      {/* Ambient glow — brighter */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 62% 68% at 68% 42%, ${slide.accent}22, transparent 65%)`,
        transition: "background 0.9s ease",
      }} />

      {/* Grid — slightly more visible */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px),
                          linear-gradient(90deg,rgba(255,255,255,0.032) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      {/* ── MOBILE (< lg) ── */}
      <div className="lg:hidden h-root absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={`mob-${current}`} className="absolute inset-0"
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}>
            <div className="absolute inset-0"><SceneComponent accent={slide.accent} active={true} /></div>
            {/* Softer overlays — less darkening than before */}
            <div className="absolute inset-0" style={{
              background: "linear-gradient(to bottom, rgba(7,16,31,0.38) 0%, rgba(7,16,31,0.1) 22%, rgba(7,16,31,0.64) 55%, rgba(7,16,31,0.92) 78%, #07101f 100%)"
            }} />
            <div className="absolute inset-0" style={{
              background: "linear-gradient(to right, rgba(7,16,31,0.44) 0%, transparent 60%)"
            }} />
            <div className="absolute inset-x-0 bottom-0 z-10" style={{ padding: "0 20px 24px" }}>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full"
                style={{ background: `${slide.accent}20`, border: `1px solid ${slide.accent}50` }}>
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                  <span className="h-ping absolute inline-flex h-full w-full rounded-full" style={{ background: slide.accent }} />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: slide.accent }} />
                </span>
                <span className="h-mono text-[9px] tracking-[0.32em] uppercase" style={{ color: slide.accent }}>{slide.tag}</span>
              </div>
              <h1 className="h-display mb-2" style={{ fontSize: "clamp(1.9rem,9.5vw,2.8rem)", lineHeight: 0.9, color: "#fff" }}>
                {slide.headline}
              </h1>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="flex-shrink-0 h-px w-5" style={{ background: slide.accent }} />
                <p className="h-body text-[9px] font-light tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>{slide.subheadline}</p>
              </div>
              <p className="h-body leading-snug mb-4 font-light"
                style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.74rem", maxWidth: "34ch",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {slide.intro.replace(/\n/g, " ")}
              </p>
              <div className="flex gap-2 mb-4">
                <a href="#contact" onClick={e => scrollTo(e, "#contact")}
                  className="h-btn-primary h-body flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-[10px] font-semibold tracking-wider uppercase"
                  style={{ background: slide.accent, color: "#fff" }}>
                  {slide.cta.primary}
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="#services" onClick={e => scrollTo(e, "#services")}
                  className="h-btn-ghost h-body inline-flex items-center justify-center py-2.5 px-3 text-[10px] font-light tracking-wider uppercase whitespace-nowrap">
                  {slide.cta.secondary}
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                {SLIDES.map((s, i) => (
                  <button key={i} onClick={() => manualNav(i)}
                    className="h-[3px] rounded-full flex-shrink-0"
                    style={{ width: i === current ? 20 : 4, background: i === current ? slide.accent : "rgba(255,255,255,0.22)", transition: "all 0.3s" }} />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── DESKTOP (≥ lg) ── */}
      <div className="hidden lg:flex h-root absolute inset-0" style={{ "--slide-accent": slide.accent }}>

        {/* LEFT NAV */}
        <div className="relative flex flex-col z-20 flex-shrink-0"
          style={{
            width: 264, paddingTop: 96, paddingBottom: 72, paddingLeft: 48, paddingRight: 28,
            borderRight: "1px solid rgba(255,255,255,0.07)",
            background: `linear-gradient(to right, ${BG_BASE}fa, rgba(7,16,31,0.72))`,
          }}>
          <div className="mb-10">
            <div className="h-mono text-[9px] tracking-[0.4em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.28)" }}>Services</div>
            <motion.div className="h-[2px] w-8" style={{ background: slide.accent, transition: "background 0.6s" }} layoutId="nav-bar" />
          </div>

          <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto h-noscroll">
            {SLIDES.map((s, i) => (
              <button key={i} onClick={() => manualNav(i)}
                className={`h-nav-item h-body text-left pl-4 py-2.5 pr-2 ${i === current ? "active" : ""}`}
                style={{ "--slide-accent": s.accent, borderLeftColor: i === current ? s.accent : undefined }}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-light tracking-widest uppercase"
                    style={{ color: i === current ? "#fff" : "rgba(255,255,255,0.35)", transition: "color 0.22s" }}>
                    {s.tag}
                  </span>
                  {i === current && (
                    <span className="h-mono text-[9px]" style={{ color: s.accent }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>
                {i === current && (
                  <div className="h-body text-[12px] font-medium mt-0.5" style={{ color: "rgba(255,255,255,0.8)" }}>{s.headline}</div>
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {[
              { label: "prev", onClick: handlePrev, path: "M7.5 9L4.5 6l3-3" },
              { label: "next", onClick: handleNext, path: "M4.5 3L7.5 6l-3 3" },
            ].map(btn => (
              <button key={btn.label} onClick={btn.onClick}
                className="w-8 h-8 flex items-center justify-center border transition-all"
                style={{ borderColor: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.45)" }}
                onMouseEnter={e => { e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="rgba(255,255,255,0.32)"; }}
                onMouseLeave={e => { e.currentTarget.style.color="rgba(255,255,255,0.45)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.14)"; }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d={btn.path} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
            <button onClick={() => setIsAutoPlaying(p => !p)}
              className="w-8 h-8 flex items-center justify-center border transition-all"
              style={{ borderColor: isAutoPlaying ? `${slide.accent}60` : "rgba(255,255,255,0.14)", color: isAutoPlaying ? slide.accent : "rgba(255,255,255,0.35)" }}>
              {isAutoPlaying
                ? <svg width="10" height="10" fill="currentColor" viewBox="0 0 10 10"><rect x="1" y="1" width="3" height="8" rx="0.5"/><rect x="6" y="1" width="3" height="8" rx="0.5"/></svg>
                : <svg width="10" height="10" fill="currentColor" viewBox="0 0 10 10"><path d="M2 1.5l7 3.5-7 3.5V1.5z"/></svg>}
            </button>
            <div className="relative w-8 h-8 flex items-center justify-center ml-auto">
              <svg width="30" height="30" viewBox="0 0 30 30" className="absolute -rotate-90">
                <circle cx="15" cy="15" r="12" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
                <circle cx="15" cy="15" r="12" fill="none" stroke={slide.accent} strokeWidth="1.5"
                  strokeDasharray={`${2 * Math.PI * 12}`}
                  strokeDashoffset={`${2 * Math.PI * 12 * (1 - progress / 100)}`}
                  style={{ transition: "stroke 0.6s, stroke-dashoffset 0.1s" }} />
              </svg>
              <span className="h-mono text-[7px]" style={{ color: slide.accent }}>
                {String(current + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* SCENE + CONTENT */}
        <div className="relative flex-1 overflow-hidden z-10">
          <AnimatePresence mode="wait">
            <motion.div key={`dt-scene-${current}`} className="absolute z-10"
              style={{ inset: 0, top: "8%", bottom: "calc(52px + 12%)", left: "4%", right: "4%" }}
              initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <SceneComponent accent={slide.accent} active={!transitioning} />
            </motion.div>
          </AnimatePresence>

          {/* Softer overlays — scene shows through more */}
          <div className="absolute inset-0 z-20 pointer-events-none" style={{
            background: "linear-gradient(to right, rgba(7,16,31,0.44) 0%, transparent 40%, transparent 60%, rgba(7,16,31,0.14) 100%)"
          }} />
          <div className="absolute inset-0 z-20 pointer-events-none" style={{
            background: "linear-gradient(to bottom, rgba(7,16,31,0.24) 0%, transparent 22%, transparent 48%, rgba(7,16,31,0.93) 100%)"
          }} />

          <AnimatePresence mode="wait">
            <motion.div key={`dt-content-${current}`}
              className="absolute bottom-0 left-0 right-0 z-30 flex items-end justify-between"
              style={{ padding: "0 56px 136px 56px", gap: 40 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}>

              <div style={{ maxWidth: 560 }}>
                <div className="h-enter h-d1 flex items-center gap-3 mb-4">
                  <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                    <span className="h-ping absolute inline-flex h-full w-full rounded-full" style={{ background: slide.accent }} />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: slide.accent }} />
                  </span>
                  <span className="h-mono text-[10px] tracking-[0.42em] uppercase" style={{ color: slide.accent }}>
                    {slide.subheadline}
                  </span>
                </div>
                <h1 className="h-display h-enter h-d2 mb-4"
                  style={{ fontSize: "clamp(3rem,5.2vw,6rem)", lineHeight: 0.88, letterSpacing: "0.02em", color: "#fff" }}>
                  {slide.headline}
                </h1>
                <p className="h-body h-enter h-d3 font-light leading-relaxed mb-5"
                  style={{ fontSize: "clamp(0.82rem,1vw,0.95rem)", color: "rgba(255,255,255,0.62)", maxWidth: "48ch" }}>
                  {slide.intro.replace(/\\n/g, " ")}
                </p>
                <div className="h-enter h-d4 flex items-center gap-3">
                  <a href="#contact" onClick={e => scrollTo(e, "#contact")}
                    className="h-btn-primary h-body inline-flex items-center gap-2.5 py-3 px-7 text-xs font-semibold tracking-[0.16em] uppercase"
                    style={{ background: slide.accent, color: "#fff", boxShadow: `0 0 40px ${slide.accent}35` }}>
                    {slide.cta.primary}
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5h8M7.5 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                  <a href="#services" onClick={e => scrollTo(e, "#services")}
                    className="h-btn-ghost h-body inline-flex items-center gap-2.5 py-3 px-7 text-xs font-light tracking-[0.16em] uppercase">
                    {slide.cta.secondary}
                  </a>
                </div>
              </div>

              {/* Stat card */}
              <div className="h-enter h-d5 flex-shrink-0 text-right">
                <div className="inline-block p-4" style={{
                  background: "rgba(7,16,31,0.65)",
                  border: `1px solid ${slide.accent}35`,
                  backdropFilter: "blur(24px)",
                  boxShadow: `0 0 60px ${slide.accent}16`,
                }}>
                  <div className="h-display" style={{ fontSize: "clamp(2rem,3.5vw,3.6rem)", lineHeight: 1, color: slide.accent }}>
                    {slide.stat.value}
                  </div>
                  <div className="h-mono text-[9px] tracking-[0.28em] uppercase mt-1" style={{ color: "rgba(255,255,255,0.36)" }}>
                    {slide.stat.label}
                  </div>
                  <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: `1px solid ${slide.accent}28` }}>
                    <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: slide.accent }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }} />
                    <span className="h-mono text-[9px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.26)" }}>Enterprise Grade</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-6 right-7 z-30 h-mono text-[9px] tracking-[0.5em] uppercase"
            style={{ color: `${slide.accent}45` }}>
            {slide.scene}_SYS
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 z-40">
        <div className="h-[1px] w-full" style={{ background: "rgba(255,255,255,0.07)" }}>
          <div className="h-full" style={{
            width: `${progress}%`, background: slide.accent,
            boxShadow: `0 0 12px ${slide.accent}`, transition: "none",
          }} />
        </div>
        <div className="flex items-center justify-between"
          style={{
            paddingLeft: "calc(264px + 48px)", paddingRight: 24, height: 52,
            background: `rgba(7,16,31,0.95)`, backdropFilter: "blur(24px)",
          }}>
          <div className="flex items-center gap-2">
            {SLIDES.map((s, i) => (
              <button key={i} onClick={() => manualNav(i)} title={s.tag}>
                <div className="rounded-full" style={{
                  width: i === current ? 24 : 5, height: 5,
                  background: i === current ? slide.accent : "rgba(255,255,255,0.18)",
                  transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                }} />
              </button>
            ))}
          </div>
          <span className="h-mono text-[9px] tracking-[0.42em] uppercase" style={{ color: "rgba(255,255,255,0.22)" }}>
            {slide.tag} — {slide.headline}
          </span>
          <span className="h-mono text-[10px]" style={{ color: slide.accent }}>
            {String(current + 1).padStart(2, "0")}
            <span style={{ color: "rgba(255,255,255,0.18)" }}> / {String(SLIDES.length).padStart(2, "0")}</span>
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;