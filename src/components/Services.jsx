import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useParams } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────
   SVG SCENES (unchanged)
───────────────────────────────────────────────────────────── */

function SVGWebsite({ active }) {
  return (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <motion.rect x="20" y="20" width="280" height="180" rx="6" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} />
      <motion.rect x="20" y="20" width="280" height="28" rx="6" fill="#1e293b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
      {[0,1,2].map((i) => (<motion.circle key={i} cx={36 + i * 14} cy={34} r="4" fill={["#ef4444","#f59e0b","#22c55e"][i]} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 300 }} />))}
      <motion.rect x="90" y="27" width="140" height="14" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="0.8" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.5 }} style={{ transformOrigin: "90px 34px" }} />
      <motion.text x="112" y="38" fill="#64748b" fontSize="6" fontFamily="monospace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>conotex.com</motion.text>
      <motion.rect x="30" y="56" width="260" height="14" rx="2" fill="#1e293b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
      {[0,1,2,3].map((i) => (<motion.rect key={i} x={40 + i * 54} y="60" width="32" height="6" rx="1" fill={i === 0 ? "#3b82f6" : "#334155"} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5 + i * 0.07 }} style={{ transformOrigin: `${40 + i * 54}px 63px` }} />))}
      <motion.rect x="30" y="78" width="150" height="48" rx="2" fill="#1e293b" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} />
      <motion.rect x="38" y="86" width="100" height="8" rx="1" fill="#3b82f6" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.65, duration: 0.5 }} style={{ transformOrigin: "38px 90px" }} />
      <motion.rect x="38" y="98" width="80" height="5" rx="1" fill="#334155" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7 }} style={{ transformOrigin: "38px 100px" }} />
      <motion.rect x="38" y="107" width="60" height="5" rx="1" fill="#334155" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.73 }} style={{ transformOrigin: "38px 109px" }} />
      <motion.rect x="38" y="116" width="44" height="10" rx="2" fill="#3b82f6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
      <motion.rect x="186" y="78" width="104" height="48" rx="2" fill="#1e3a5f" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} />
      {[0,1,2,3,4].map((i) => (<motion.rect key={i} x="30" y={136 + i * 10} width={60 + (i % 3) * 30} height="5" rx="1" fill="#1e293b" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.75 + i * 0.05 }} style={{ transformOrigin: "30px" }} />))}
      <motion.g animate={active ? { y: [0, -5, 0] } : {}} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="196" y="140" width="80" height="38" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
        <text x="236" y="156" fill="#3b82f6" fontSize="12" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">99%</text>
        <text x="236" y="170" fill="#64748b" fontSize="5" fontFamily="monospace" textAnchor="middle">LIGHTHOUSE</text>
      </motion.g>
      <motion.rect x="148" y="117" width="2" height="8" fill="#3b82f6" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
    </svg>
  );
}

function SVGAi({ active }) {
  const nodes = [
    { cx: 50, cy: 110, layer: 0 }, { cx: 50, cy: 140, layer: 0 }, { cx: 50, cy: 170, layer: 0 },
    { cx: 120, cy: 90, layer: 1 }, { cx: 120, cy: 115, layer: 1 }, { cx: 120, cy: 140, layer: 1 }, { cx: 120, cy: 165, layer: 1 },
    { cx: 190, cy: 90, layer: 2 }, { cx: 190, cy: 115, layer: 2 }, { cx: 190, cy: 140, layer: 2 }, { cx: 190, cy: 165, layer: 2 },
    { cx: 260, cy: 110, layer: 3 }, { cx: 260, cy: 140, layer: 3 }, { cx: 260, cy: 170, layer: 3 },
  ];
  const edges = [];
  nodes.forEach((a) => nodes.forEach((b) => { if (b.layer === a.layer + 1) edges.push({ x1: a.cx, y1: a.cy, x2: b.cx, y2: b.cy }); }));
  return (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {edges.map(({ x1, y1, x2, y2 }, k) => (<motion.line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3b82f6" strokeWidth="0.6" strokeOpacity="0.25" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 + k * 0.015, duration: 0.6 }} />))}
      {active && edges.slice(0, 8).map(({ x1, y1, x2, y2 }, k) => (<motion.circle key={`t${k}`} r="2" fill="#3b82f6" animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: k * 0.22, ease: "linear" }} />))}
      {nodes.map((n, i) => (<motion.g key={i}><motion.circle cx={n.cx} cy={n.cy} r="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.04, type: "spring", stiffness: 250 }} /><motion.circle cx={n.cx} cy={n.cy} r="3" fill="#3b82f6" animate={active ? { r: [3, 5, 3], opacity: [0.8, 1, 0.8] } : {}} transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }} /></motion.g>))}
      {[{ x: 50, l: "INPUT" }, { x: 120, l: "HIDDEN" }, { x: 190, l: "HIDDEN" }, { x: 260, l: "OUTPUT" }].map(({ x, l }) => (<motion.text key={l} x={x} y="195" fill="#475569" fontSize="6" fontFamily="monospace" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>{l}</motion.text>))}
      <motion.g animate={active ? { y: [0, -4, 0] } : {}} transition={{ duration: 3.5, repeat: Infinity }}>
        <rect x="230" y="20" width="74" height="44" rx="4" fill="#0f172a" stroke="#22c55e" strokeWidth="1" />
        <text x="267" y="40" fill="#22c55e" fontSize="11" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">10×</text>
        <text x="267" y="56" fill="#64748b" fontSize="5" fontFamily="monospace" textAnchor="middle">ACCURACY</text>
      </motion.g>
    </svg>
  );
}

function SVGCabling({ active }) {
  return (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <motion.rect x="20" y="30" width="80" height="160" rx="3" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} />
      {[0,1,2,3,4,5,6,7].map((i) => (<motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.06 }}><rect x="26" y={38 + i * 18} width="68" height="12" rx="2" fill="#1e293b" /><circle cx="34" cy={44 + i * 18} r="3" fill={active && i % 3 !== 2 ? "#06b6d4" : "#1e3a4f"} />{active && (<motion.circle cx="34" cy={44 + i * 18} r="5" fill="none" stroke="#06b6d4" strokeWidth="0.5" animate={{ r: [3, 7, 3], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />)}</motion.g>))}
      {[40, 60, 80, 100, 120, 140, 160].map((y, i) => (<motion.path key={i} d={`M 100 ${y} C 140 ${y} 160 ${y + (i % 2 === 0 ? 20 : -10)} 200 ${y + (i % 2 === 0 ? 10 : 0)}`} stroke={["#06b6d4","#3b82f6","#818cf8","#06b6d4","#3b82f6","#818cf8","#22c55e"][i]} strokeWidth={1.5} strokeOpacity={0.7} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 + i * 0.08, duration: 0.7, ease: "easeOut" }} />))}
      <motion.rect x="200" y="70" width="100" height="80" rx="3" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }} />
      <motion.text x="250" y="100" fill="#3b82f6" fontSize="8" fontFamily="monospace" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>SWITCH</motion.text>
      {[0,1,2,3,4,5,6,7].map((i) => (<motion.circle key={i} cx={210 + (i % 4) * 20} cy={i < 4 ? 112 : 130} r="4" fill="#06b6d4" animate={active ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.4 }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />))}
      <motion.g animate={active ? { y: [0, -5, 0] } : {}} transition={{ duration: 3, repeat: Infinity }}>
        <rect x="210" y="20" width="80" height="36" rx="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
        <text x="250" y="36" fill="#06b6d4" fontSize="12" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">100G</text>
        <text x="250" y="48" fill="#64748b" fontSize="5" fontFamily="monospace" textAnchor="middle">THROUGHPUT</text>
      </motion.g>
    </svg>
  );
}

function SVGCyber({ active }) {
  return (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {[1,2,3,4].map((r) => (<motion.circle key={r} cx="160" cy="110" r={r * 42} stroke="#ef4444" strokeWidth="0.6" strokeOpacity={0.15 + r * 0.04} strokeDasharray="4 4" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: r * 0.1, duration: 0.6 }} />))}
      {active && (<motion.line x1="160" y1="110" x2="160" y2="20" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.5" style={{ transformOrigin: "160px 110px" }} animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />)}
      <motion.path d="M160 35 L195 55 L195 95 Q195 130 160 148 Q125 130 125 95 L125 55 Z" fill="#0f172a" stroke="#ef4444" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 150 }} style={{ transformOrigin: "160px 92px" }} />
      <motion.rect x="148" y="88" width="24" height="20" rx="3" fill="#ef4444" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} />
      <motion.path d="M154 88 Q154 78 160 78 Q166 78 166 88" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.65, duration: 0.5 }} />
      <motion.circle cx="160" cy="100" r="3" fill="#0f172a" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
      {[{ cx: 60, cy: 60 }, { cx: 255, cy: 75 }, { cx: 75, cy: 168 }, { cx: 248, cy: 162 }].map((n, i) => (<motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 + i * 0.1 }}><circle cx={n.cx} cy={n.cy} r="6" fill="#0f172a" stroke="#ef4444" strokeWidth="1" />{active && (<motion.circle cx={n.cx} cy={n.cy} r="8" fill="none" stroke="#ef4444" strokeWidth="0.8" animate={{ r: [6, 14, 6], opacity: [0.8, 0, 0.8] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }} />)}<text x={n.cx} y={n.cy + 4} fill="#ef4444" fontSize="5" fontFamily="monospace" textAnchor="middle">×</text></motion.g>))}
      {[{ fx: 60, fy: 60 }, { fx: 255, fy: 75 }].map((l, i) => (<motion.line key={i} x1={l.fx} y1={l.fy} x2="160" y2="92" stroke="#ef4444" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="3 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9 + i * 0.1, duration: 0.8 }} />))}
      <motion.g animate={active ? { y: [0, -4, 0] } : {}} transition={{ duration: 3, repeat: Infinity }}>
        <rect x="222" y="20" width="78" height="36" rx="4" fill="#0f172a" stroke="#ef4444" strokeWidth="1" />
        <text x="261" y="36" fill="#ef4444" fontSize="10" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">0-DAY</text>
        <text x="261" y="48" fill="#64748b" fontSize="5" fontFamily="monospace" textAnchor="middle">RESPONSE</text>
      </motion.g>
    </svg>
  );
}

function SVGManagedIT({ active }) {
  return (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {[0,1,2].map((i) => (<motion.g key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12, duration: 0.5 }}><rect x={30 + i * 70} y="50" width="54" height="120" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="1.2" /><rect x={36 + i * 70} y="58" width="42" height="8" rx="2" fill="#1e293b" />{[0,1,2,3,4].map((j) => (<motion.circle key={j} cx={42 + i * 70} cy={75 + j * 16} r="3" fill="#10b981" animate={active ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.4 }} transition={{ duration: 0.9 + j * 0.1, repeat: Infinity, delay: i * 0.3 + j * 0.2 }} />))}<rect x={36 + i * 70} y="152" width="42" height="6" rx="2" fill="#1e293b" /><motion.rect x={36 + i * 70} y="152" rx="2" height="6" fill="#10b981" animate={{ width: [15, 35, 20, 42, 18][i] }} transition={{ duration: 2 + i * 0.5, repeat: Infinity, repeatType: "reverse" }} /></motion.g>))}
      <motion.path d="M 57 110 L 160 80 L 264 110" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 1 }} />
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5 }} style={{ transformOrigin: "160px 90px" }}>
        <rect x="128" y="58" width="64" height="48" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
        {[0,1,2,3,4].map((i) => (<motion.rect key={i} x={133 + i * 11} y={90} width="8" rx="1" fill="#10b981" animate={{ height: [8, 18, 12, 22, 10][i], y: [90, 80, 86, 76, 88][i] }} transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, repeatType: "reverse" }} />))}
        <rect x="128" y="106" width="64" height="10" rx="0 0 3 3" fill="#1e293b" />
        <text x="160" y="114" fill="#10b981" fontSize="5" fontFamily="monospace" textAnchor="middle">MONITOR</text>
      </motion.g>
      <motion.g animate={active ? { y: [0, -5, 0] } : {}} transition={{ duration: 3.2, repeat: Infinity }}>
        <rect x="224" y="168" width="80" height="36" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
        <text x="264" y="184" fill="#10b981" fontSize="11" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">99.9%</text>
        <text x="264" y="196" fill="#64748b" fontSize="5" fontFamily="monospace" textAnchor="middle">UPTIME SLA</text>
      </motion.g>
    </svg>
  );
}

function SVGDesktop({ active }) {
  return (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <motion.rect x="60" y="30" width="200" height="130" rx="5" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.5" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} />
      <motion.rect x="68" y="38" width="184" height="114" rx="3" fill="#060b18" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
      <motion.rect x="68" y="134" width="184" height="18" rx="0 0 3 3" fill="#1e293b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
      {[0,1,2].map((i) => (<motion.rect key={i} x={74 + i * 18} y="138" width="10" height="10" rx="2" fill="#334155" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.08 }} />))}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <rect x="74" y="44" width="170" height="80" rx="3" fill="#0d1117" />
        <rect x="74" y="44" width="170" height="14" rx="3 3 0 0" fill="#1e293b" />
        {[0,1,2].map((i) => (<circle key={i} cx={82 + i * 10} cy="51" r="3" fill={["#ef4444","#f59e0b","#22c55e"][i]} />))}
        {[{ text: "> System scan complete", color: "#8b5cf6", y: 68 }, { text: "> 0 threats detected", color: "#22c55e", y: 78 }, { text: "> Patch applied: KB5034441", color: "#94a3b8", y: 88 }, { text: "> All 48 endpoints OK", color: "#94a3b8", y: 98 }].map((line, i) => (<motion.text key={i} x="80" y={line.y} fill={line.color} fontSize="6" fontFamily="monospace" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.18, duration: 0.4 }}>{line.text}</motion.text>))}
        <motion.rect x="80" y="103" width="5" height="7" fill="#8b5cf6" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
      </motion.g>
      <motion.rect x="148" y="160" width="24" height="20" rx="2" fill="#1e293b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
      <motion.rect x="130" y="178" width="60" height="8" rx="4" fill="#1e293b" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9 }} style={{ transformOrigin: "160px 182px" }} />
      <motion.g animate={active ? { y: [0, -5, 0] } : {}} transition={{ duration: 2.8, repeat: Infinity }}>
        <rect x="228" y="168" width="72" height="36" rx="4" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1" />
        <text x="264" y="184" fill="#8b5cf6" fontSize="10" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">&lt;2HR</text>
        <text x="264" y="196" fill="#64748b" fontSize="5" fontFamily="monospace" textAnchor="middle">RESPONSE</text>
      </motion.g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const INDUSTRIES_SERVED = "Oil & Gas | Corporate | Financial | Healthcare | Utilities | Retail | Food Service";

const SERVICES_DATA = [
  { id: "website-design", title: "Custom Websites", headline: "Custom Websites & Digital Growth", intro: "Engineered for speed, SEO, and user experience. We build responsive digital interfaces that convert traffic into revenue.", keyServices: ["UX/UI Design Architecture", "E-commerce Development", "Digital Marketing Integration", "Continuous Maintenance"], Scene: SVGWebsite, accent: "#3b82f6", tag: "WEB DEV", stat: "99%", industries: INDUSTRIES_SERVED },
  { id: "ai-qa", title: "AI Search Quality", headline: "AI Search Quality & Validation", intro: "Validation and tuning for Large Language Models and enterprise search engines. Ensuring data accuracy in the AI era.", keyServices: ["Search Quality Evaluation", "Human-in-the-Loop Validation", "Healthcare AI Compliance", "Dataset Accuracy Audits"], Scene: SVGAi, accent: "#3b82f6", tag: "AI / ML", stat: "10×", industries: "Healthcare | Technology | Finance | Retail | Legal" },
  { id: "structured-cabling", title: "Telecom & AV", headline: "Low Voltage, Telecom & AV Infrastructure", intro: "High-density fiber, copper architectures, and smart-room technology designed for 99.9% uptime.", keyServices: ["Cat6 & Fiber Optic Cabling", "Data Center / Server Room Build", "IP Surveillance & Security", "Conference Room AV Systems"], Scene: SVGCabling, accent: "#06b6d4", tag: "CABLING", stat: "100G", industries: INDUSTRIES_SERVED },
  { id: "cybersecurity", title: "Cybersecurity", headline: "Threat Protection & Compliance", intro: "Hardening your perimeter with zero-trust architecture, real-time detection, and comprehensive security audits.", keyServices: ["Endpoint & Perimeter Defense", "Penetration Testing", "Compliance & Risk Audits", "24/7 Incident Response"], Scene: SVGCyber, accent: "#ef4444", tag: "SECURITY", stat: "0-DAY", industries: INDUSTRIES_SERVED },
  { id: "managed-it", title: "Managed IT Support", headline: "Managed IT Support Operations", intro: "Proactive systems management. We monitor your infrastructure while you focus on scaling your core business.", keyServices: ["Proactive Remote Monitoring", "Patch & Asset Management", "Disaster Recovery Planning", "Business Continuity Strategy"], Scene: SVGManagedIT, accent: "#10b981", tag: "IT OPS", stat: "99.9%", industries: INDUSTRIES_SERVED },
  { id: "desktop-support", title: "Desktop Support", headline: "Onsite & Remote Support", intro: "Rapid-response resolution across all endpoints. Dependable support to keep your workforce productive.", keyServices: ["Hardware & Software Lifecycle", "Identity & Access Management", "Employee Technical Training", "Mobile Device Management"], Scene: SVGDesktop, accent: "#8b5cf6", tag: "SUPPORT", stat: "<2HR", industries: INDUSTRIES_SERVED },
];

/* ─────────────────────────────────────────────────────────────
   HOOK: window width
───────────────────────────────────────────── */
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

/* ─────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
const Services = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(id || SERVICES_DATA[0].id);
  const sectionRef = useRef(null);
  const tabsRef   = useRef(null);
  const inView    = useInView(sectionRef, { once: true, margin: "-60px" });
  const isMobile  = useWindowWidth() < 860;

  useEffect(() => {
    if (id && SERVICES_DATA.some(s => s.id === id)) setActiveTab(id);
  }, [id]);

  // auto-scroll active tab into view on mobile
  useEffect(() => {
    if (!tabsRef.current) return;
    const activeEl = tabsRef.current.querySelector(".sv-tab-active");
    if (activeEl) activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeTab]);

  const handleTabClick = (sid) => {
    setActiveTab(sid);
    window.history.pushState(null, "", `/services/${sid}`);
  };

  const handleConsult = (e) => {
    e.preventDefault();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const current    = SERVICES_DATA.find(s => s.id === activeTab) || SERVICES_DATA[0];
  const industries = current.industries.split("|").map(s => s.trim());

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{ background: "#f1f3f5", fontFamily: "'Barlow',sans-serif", position: "relative", overflow: "hidden" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .sv * { box-sizing: border-box; }
        .sv-display { font-family: 'Bebas Neue', sans-serif !important; letter-spacing: 0.03em; }
        .sv-mono    { font-family: 'Space Mono', monospace !important; }
        .sv-body    { font-family: 'Barlow', sans-serif !important; }

        /* dot grid */
        .sv-dotgrid {
          background-image: radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* ── Tabs scroll row ── */
        .sv-tabs-row {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          overflow-x: auto;
          overflow-y: hidden;
          gap: 8px;
          padding-bottom: 6px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          scroll-snap-type: x mandatory;
        }
        .sv-tabs-row::-webkit-scrollbar { display: none; }

        /* ── Tab pill ── */
        .sv-tab {
          flex-shrink: 0;
          scroll-snap-align: start;
          position: relative; cursor: pointer;
          border: 1px solid rgba(0,0,0,0.1);
          background: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 0.54rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(15,23,42,0.45);
          padding: 9px 14px 9px 11px;
          display: flex; align-items: center; gap: 7px;
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
          overflow: hidden; white-space: nowrap;
        }
        .sv-tab:hover { border-color: var(--tab-accent); color: #0f172a; }
        .sv-tab.sv-tab-active {
          background: #0f172a; border-color: #0f172a; color: #fff;
          box-shadow: 0 6px 20px rgba(0,0,0,0.16);
        }
        .sv-tab.sv-tab-active .sv-dot { background: var(--tab-accent) !important; }

        /* ── Content panel wrapper ── */
        .sv-panel {
          display: flex;
          flex-direction: column;  /* mobile: stacked */
        }
        @media (min-width: 860px) {
          .sv-panel { flex-direction: row; align-items: stretch; }
        }

        /* ── Scene column ── */
        .sv-scene-col {
          position: relative; overflow: hidden;
          background: #0a0f1e;
          display: flex; align-items: center; justify-content: center;
          /* mobile: full width, fixed height */
          width: 100%;
          min-height: 230px;
          padding: 20px;
        }
        @media (min-width: 860px) {
          .sv-scene-col {
            width: 38%;
            flex-shrink: 0;
            min-height: 360px;
            border-right: 1px solid rgba(255,255,255,0.06);
          }
        }

        /* ── Info column ── */
        .sv-info-col {
          flex: 1;
          /* mobile padding */
          padding: 24px 18px 28px;
        }
        @media (min-width: 540px) {
          .sv-info-col { padding: 28px 28px 32px; }
        }
        @media (min-width: 860px) {
          .sv-info-col { padding: 40px 40px 36px; }
        }

        /* ── Features grid ── */
        .sv-features-grid {
          display: grid;
          grid-template-columns: 1fr;   /* 1-col on mobile */
          gap: 8px;
          margin-bottom: 24px;
        }
        @media (min-width: 540px) {
          .sv-features-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── Feature card ── */
        .sv-feature {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px;
          border-left: 2px solid rgba(0,0,0,0.07);
          background: #fafafa;
          border-radius: 0 3px 3px 0;
          transition: all 0.28s cubic-bezier(0.16,1,0.3,1);
          cursor: default;
        }
        .sv-feature:hover {
          border-left-color: var(--accent);
          background: #fff;
          transform: translateX(5px);
          box-shadow: -3px 0 16px rgba(0,0,0,0.05);
        }

        /* ── Footer row ── */
        .sv-footer-row {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        @media (min-width: 600px) {
          .sv-footer-row {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        /* ── Industry badges ── */
        .sv-industries { display: flex; flex-wrap: wrap; gap: 5px; }
        .sv-ind {
          font-family: 'Space Mono', monospace;
          font-size: 0.44rem; letter-spacing: 0.16em; text-transform: uppercase;
          padding: 4px 8px;
          border: 1px solid rgba(0,0,0,0.09);
          background: #fff; color: rgba(15,23,42,0.42);
          transition: all 0.2s; white-space: nowrap;
        }
        .sv-ind:hover { border-color: var(--accent); color: #0f172a; }

        /* ── CTA ── */
        .sv-cta {
          position: relative; overflow: hidden; cursor: pointer;
          font-family: 'Space Mono', monospace;
          font-size: 0.54rem; letter-spacing: 0.2em; text-transform: uppercase;
          padding: 13px 26px;
          background: #0f172a; color: #fff; border: none;
          display: inline-flex; align-items: center; gap: 9px;
          transition: transform 0.28s cubic-bezier(0.16,1,0.3,1), box-shadow 0.28s;
          white-space: nowrap;
          /* full width on mobile */
          width: 100%; justify-content: center;
        }
        @media (min-width: 600px) {
          .sv-cta { width: auto; justify-content: flex-start; flex-shrink: 0; }
        }
        .sv-cta::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0.1);
          transform: translateX(-102%);
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .sv-cta:hover::before { transform: translateX(0); }
        .sv-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(15,23,42,0.2); }

        /* ── Index strip ── */
        .sv-index {
          display: none;
        }
        @media (min-width: 480px) {
          .sv-index { display: flex; }
        }

        /* ── Divider ── */
        .sv-divider { height: 1px; background: rgba(0,0,0,0.06); margin-bottom: 20px; }
      `}</style>

      <div className="sv">
        {/* Dot grid */}
        <div className="sv-dotgrid" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} />

        {/* Ambient glow transitions with service */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: `radial-gradient(ellipse 55% 40% at 70% 50%, ${current.accent}0d, transparent 65%)`,
          transition: "background 0.6s ease",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "72px 16px 96px" }}>

          {/* ── Eyebrow ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16,1,0.3,1] }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}
          >
            <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.55, delay: 0.1 }}
              style={{ width: 24, height: 2, background: "#3b82f6", transformOrigin: "left", flexShrink: 0 }} />
            <span className="sv-mono" style={{ fontSize: "0.52rem", letterSpacing: "0.38em", color: "#3b82f6", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              Enterprise Solutions
            </span>
            <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
              style={{ flex: 1, height: 1, background: "linear-gradient(to right,rgba(59,130,246,0.3),transparent)", transformOrigin: "left" }} />
          </motion.div>

          {/* ── Headline ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16,1,0.3,1] }}
            style={{ marginBottom: 36 }}
          >
            <h2 className="sv-display" style={{ fontSize: "clamp(2.4rem,7vw,6rem)", lineHeight: 0.9, color: "#0f172a", marginBottom: 12 }}>
              Enterprise{" "}
              <span style={{ background: "linear-gradient(90deg,#3b82f6,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Solutions
              </span>
            </h2>
            <p className="sv-body" style={{ fontSize: "clamp(0.84rem,2.2vw,1rem)", color: "#475569", fontWeight: 400, maxWidth: "52ch", lineHeight: 1.7 }}>
              Nationwide IT infrastructure and managed support tailored for high-demand business environments.
            </p>
          </motion.div>

          {/* ── Tabs ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ marginBottom: 28 }}
          >
            <div className="sv-tabs-row" ref={tabsRef}>
              {SERVICES_DATA.map((svc, i) => (
                <motion.button
                  key={svc.id}
                  className={`sv-tab ${activeTab === svc.id ? "sv-tab-active" : ""}`}
                  style={{ "--tab-accent": svc.accent }}
                  onClick={() => handleTabClick(svc.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06 }}
                >
                  <span className="sv-dot" style={{
                    width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                    background: activeTab === svc.id ? svc.accent : "rgba(0,0,0,0.18)",
                    transition: "background 0.2s",
                  }} />
                  {svc.title}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ── Content panel ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(5px)" }}
              transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
              style={{
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.07)",
                boxShadow: "0 20px 70px rgba(0,0,0,0.07), 0 3px 12px rgba(0,0,0,0.04)",
                borderRadius: 4,
                overflow: "hidden",
                "--accent": current.accent,
              }}
            >
              {/* Top accent bar */}
              <div style={{ height: 3, background: `linear-gradient(to right, ${current.accent}, ${current.accent}44)` }} />

              <div className="sv-panel">

                {/* ── Scene ── */}
                <div className="sv-scene-col">
                  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${current.accent}1a, transparent 70%)`, transition: "background 0.5s" }} />
                  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "22px 22px" }} />

                  <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 300 }}>
                    <current.Scene active={activeTab === current.id} />
                  </div>

                  {/* Tag label */}
                  <div style={{ position: "absolute", top: 10, left: 12, zIndex: 2 }}>
                    <span className="sv-mono" style={{ fontSize: "0.44rem", letterSpacing: "0.35em", color: `${current.accent}70`, textTransform: "uppercase" }}>
                      {current.tag}_SYS
                    </span>
                  </div>

                  {/* Stat badge */}
                  <div style={{ position: "absolute", bottom: 10, right: 12, zIndex: 2, padding: "6px 11px", background: "rgba(10,15,30,0.88)", border: `1px solid ${current.accent}44`, backdropFilter: "blur(8px)" }}>
                    <div className="sv-display" style={{ fontSize: "1.3rem", lineHeight: 1, color: current.accent }}>{current.stat}</div>
                    <div className="sv-mono" style={{ fontSize: "0.36rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" }}>enterprise</div>
                  </div>
                </div>

                {/* ── Info ── */}
                <div className="sv-info-col">

                  {/* Tag row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: current.accent, flexShrink: 0 }} />
                    <span className="sv-mono" style={{ fontSize: "0.48rem", letterSpacing: "0.34em", color: current.accent, textTransform: "uppercase" }}>
                      {current.tag}
                    </span>
                    <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.07)" }} />
                  </div>

                  {/* Headline */}
                  <h3 className="sv-display" style={{ fontSize: "clamp(1.6rem,4vw,2.8rem)", lineHeight: 0.92, color: "#0f172a", marginBottom: 13 }}>
                    {current.headline}
                  </h3>

                  {/* Intro */}
                  <p className="sv-body" style={{ fontSize: "clamp(0.82rem,2vw,0.92rem)", lineHeight: 1.76, color: "#475569", fontWeight: 400, marginBottom: 20 }}>
                    {current.intro}
                  </p>

                  {/* Features */}
                  <div className="sv-features-grid">
                    {current.keyServices.map((item, idx) => (
                      <motion.div
                        key={item}
                        className="sv-feature"
                        style={{ "--accent": current.accent }}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08, duration: 0.4, ease: [0.16,1,0.3,1] }}
                      >
                        <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke={current.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="sv-body" style={{ fontSize: "clamp(0.76rem,1.8vw,0.82rem)", color: "#1e293b", fontWeight: 600, lineHeight: 1.4 }}>
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="sv-divider" />

                  {/* Footer */}
                  <div className="sv-footer-row">

                    {/* Industries */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="sv-mono" style={{ fontSize: "0.44rem", letterSpacing: "0.3em", color: current.accent, textTransform: "uppercase", marginBottom: 8 }}>
                        Sector_Focus
                      </div>
                      <div className="sv-industries" style={{ "--accent": current.accent }}>
                        {industries.map((ind, i) => (
                          <motion.span key={ind} className="sv-ind" style={{ "--accent": current.accent }}
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.06 }}>
                            {ind}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <button className="sv-cta" onClick={handleConsult}>
                      Consult an Expert
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Index strip (hidden on tiny screens) ── */}
          <motion.div
            className="sv-index"
            style={{ alignItems: "center", gap: 20, marginTop: 28, flexWrap: "wrap" }}
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.85 }}
          >
            {SERVICES_DATA.map((svc, i) => (
              <button key={svc.id} onClick={() => handleTabClick(svc.id)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 5, opacity: activeTab === svc.id ? 1 : 0.35, transition: "opacity 0.2s" }}>
                <div style={{ width: activeTab === svc.id ? 16 : 4, height: 3, background: svc.accent, borderRadius: 2, transition: "width 0.3s cubic-bezier(0.16,1,0.3,1)" }} />
                <span className="sv-mono" style={{ fontSize: "0.44rem", letterSpacing: "0.22em", color: "#0f172a", textTransform: "uppercase" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
            <span className="sv-mono" style={{ marginLeft: "auto", fontSize: "0.44rem", letterSpacing: "0.26em", color: "rgba(15,23,42,0.22)", textTransform: "uppercase" }}>
              {String(SERVICES_DATA.findIndex(s => s.id === activeTab) + 1).padStart(2,"0")} / {String(SERVICES_DATA.length).padStart(2,"0")}
            </span>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Services;