import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   SVG SCENES — one per sector
───────────────────────────────────────────────────────────── */

function SVGHealthcare({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* ECG grid */}
      {[0,1,2,3].map(i => (
        <motion.line key={`h${i}`} x1="0" y1={40*i+10} x2="280" y2={40*i+10}
          stroke="#10b981" strokeWidth="0.3" strokeOpacity="0.15"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.07 }} />
      ))}
      {/* ECG line */}
      <motion.path
        d="M 0 80 L 40 80 L 55 80 L 65 40 L 75 110 L 85 60 L 95 80 L 140 80 L 155 80 L 165 40 L 175 110 L 185 60 L 195 80 L 280 80"
        stroke="#10b981" strokeWidth="1.8" fill="none" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }} />
      {/* Pulse dot */}
      {active && (
        <motion.circle r="4" fill="#10b981"
          animate={{ cx: [0,40,55,65,75,85,95,140,155,165,175,185,195,280], cy: [80,80,80,40,110,60,80,80,80,40,110,60,80,80] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} />
      )}
      {/* Cross */}
      <motion.g initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ delay:0.5, type:"spring", stiffness:160 }} style={{ transformOrigin:"220px 50px" }}>
        <rect x="208" y="34" width="24" height="32" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
        <rect x="214" y="38" width="12" height="4" rx="1" fill="#10b981" />
        <rect x="214" y="44" width="12" height="4" rx="1" fill="#10b981" />
        <rect x="214" y="50" width="12" height="4" rx="1" fill="#10b981" />
        <rect x="214" y="56" width="8" height="4" rx="1" fill="#10b981" opacity="0.5" />
      </motion.g>
      {/* Monitor */}
      <motion.rect x="20" y="20" width="60" height="44" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="1"
        initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }} />
      <motion.text x="50" y="36" fill="#10b981" fontSize="7" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}>VITALS</motion.text>
      {["98.6°F","72bpm","120/80"].map((v,i) => (
        <motion.text key={i} x="50" y={44+i*8} fill="#64748b" fontSize="5" fontFamily="monospace" textAnchor="middle"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7+i*0.1 }}>{v}</motion.text>
      ))}
      {/* Metric badge */}
      <motion.g animate={active ? { y:[0,-4,0] } : {}} transition={{ duration:3, repeat:Infinity }}>
        <rect x="8" y="110" width="68" height="28" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="0.8" />
        <text x="42" y="122" fill="#10b981" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">99.9%</text>
        <text x="42" y="132" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle">UPTIME SLA</text>
      </motion.g>
      {/* Wifi / network */}
      {active && [1,2,3].map(r => (
        <motion.path key={r}
          d={`M ${220-r*14} ${100-r*8} Q 220 ${88-r*10} ${220+r*14} ${100-r*8}`}
          stroke="#10b981" strokeWidth="1" fill="none" strokeOpacity={0.6-r*0.1}
          animate={{ opacity:[0.3,0.8,0.3] }} transition={{ duration:2, repeat:Infinity, delay:r*0.3 }} />
      ))}
      <motion.circle cx="220" cy="106" r="3" fill="#10b981"
        animate={active ? { r:[3,4.5,3] } : {}} transition={{ duration:1.5, repeat:Infinity }} />
    </svg>
  );
}

function SVGFinance({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* Chart grid */}
      {[0,1,2,3].map(i => (
        <motion.line key={i} x1="30" y1={20+i*32} x2="270" y2={20+i*32}
          stroke="#f59e0b" strokeWidth="0.4" strokeOpacity="0.15"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.06 }} />
      ))}
      {/* Stock line */}
      <motion.path
        d="M 30 110 L 68 88 L 96 100 L 124 62 L 152 74 L 180 44 L 208 56 L 236 32 L 264 42"
        stroke="#f59e0b" strokeWidth="1.8" fill="none" strokeLinecap="round"
        initial={{ pathLength:0 }} animate={{ pathLength:1 }}
        transition={{ duration:1.2, delay:0.3, ease:"easeOut" }} />
      {/* Area fill */}
      <motion.path
        d="M 30 110 L 68 88 L 96 100 L 124 62 L 152 74 L 180 44 L 208 56 L 236 32 L 264 42 L 264 128 L 30 128 Z"
        fill="#f59e0b" fillOpacity="0.05"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }} />
      {/* Bars */}
      {[90,60,75,45,55,38,50,30].map((h,i) => (
        <motion.rect key={i} x={36+i*30} y={128-h} width="16" height={h} rx="1"
          fill="#f59e0b" fillOpacity="0.12"
          initial={{ scaleY:0 }} animate={{ scaleY:1 }}
          transition={{ delay:0.2+i*0.06, duration:0.5 }} style={{ transformOrigin:`${44+i*30}px 128px` }} />
      ))}
      {/* Pulse dot on line */}
      {active && (
        <motion.circle r="4" fill="#f59e0b"
          animate={{ cx:[30,68,96,124,152,180,208,236,264], cy:[110,88,100,62,74,44,56,32,42] }}
          transition={{ duration:3, repeat:Infinity, ease:"linear" }} />
      )}
      {/* Shield lock */}
      <motion.path d="M 240 100 L 258 108 L 258 124 Q 258 138 240 144 Q 222 138 222 124 L 222 108 Z"
        fill="#0f172a" stroke="#f59e0b" strokeWidth="1"
        initial={{ scale:0 }} animate={{ scale:1 }}
        transition={{ delay:0.5, type:"spring", stiffness:160 }} style={{ transformOrigin:"240px 122px" }} />
      <motion.rect x="233" y="118" width="14" height="12" rx="2" fill="#f59e0b"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.75 }} />
      <motion.path d="M235 118 Q235 112 240 112 Q245 112 245 118" stroke="#f59e0b" strokeWidth="2"
        fill="none" strokeLinecap="round"
        initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ delay:0.85, duration:0.4 }} />
      {/* Metric */}
      <motion.g animate={active ? { y:[0,-4,0] } : {}} transition={{ duration:3.2, repeat:Infinity }}>
        <rect x="8" y="8" width="68" height="28" rx="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="0.8" />
        <text x="42" y="20" fill="#f59e0b" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">SOC 2</text>
        <text x="42" y="30" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle">COMPLIANT</text>
      </motion.g>
    </svg>
  );
}

function SVGEnergy({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* Pipes */}
      {[[20,60,120,60],[20,100,120,100],[160,60,260,60],[160,100,260,100]].map(([x1,y1,x2,y2],i) => (
        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#f97316" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.25"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ delay:i*0.1, duration:0.6 }} />
      ))}
      {/* Flow dots */}
      {active && [[20,60,120,60],[20,100,120,100],[160,60,260,60],[160,100,260,100]].map(([x1,y1,x2,y2],i) => (
        <motion.circle key={`f${i}`} r="3" fill="#f97316"
          animate={{ cx:[x1,x2], cy:[y1,y2] }}
          transition={{ duration:1.8, repeat:Infinity, ease:"linear", delay:i*0.4 }} />
      ))}
      {/* Central unit */}
      <motion.rect x="110" y="44" width="60" height="72" rx="4" fill="#0f172a" stroke="#f97316" strokeWidth="1.2"
        initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }}
        transition={{ delay:0.3, type:"spring" }} style={{ transformOrigin:"140px 80px" }} />
      <motion.text x="140" y="74" fill="#f97316" fontSize="7" fontFamily="monospace" textAnchor="middle"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}>CONTROL</motion.text>
      <motion.text x="140" y="84" fill="#f97316" fontSize="7" fontFamily="monospace" textAnchor="middle"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.55 }}>UNIT</motion.text>
      {/* Status lights */}
      {[0,1,2].map(i => (
        <motion.circle key={i} cx="140" cy={96+i*8} r="3" fill="#f97316"
          animate={active ? { opacity:[0.3,1,0.3] } : { opacity:0.3 }}
          transition={{ duration:0.9+i*0.2, repeat:Infinity, delay:i*0.25 }} />
      ))}
      {/* Meter left */}
      <motion.g initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.4 }}>
        <rect x="14" y="26" width="36" height="22" rx="2" fill="#0f172a" stroke="#f97316" strokeWidth="0.8" />
        <text x="32" y="36" fill="#f97316" fontSize="6" fontFamily="monospace" textAnchor="middle">GAS</text>
        <motion.text x="32" y="44" fill="#64748b" fontSize="5" fontFamily="monospace" textAnchor="middle"
          animate={active ? { opacity:[0.5,1,0.5] } : {}} transition={{ duration:2, repeat:Infinity }}>↑ LIVE</motion.text>
      </motion.g>
      {/* Metric */}
      <motion.g animate={active ? { y:[0,-4,0] } : {}} transition={{ duration:3, repeat:Infinity }}>
        <rect x="194" y="118" width="68" height="28" rx="3" fill="#0f172a" stroke="#f97316" strokeWidth="0.8" />
        <text x="228" y="130" fill="#f97316" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">24 / 7</text>
        <text x="228" y="140" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle">MONITORING</text>
      </motion.g>
    </svg>
  );
}

function SVGRetail({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* Store front */}
      <motion.rect x="60" y="30" width="160" height="100" rx="2" fill="#0f172a" stroke="#ec4899" strokeWidth="1"
        initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} />
      {/* Awning */}
      <motion.rect x="50" y="28" width="180" height="16" rx="1" fill="#ec4899" fillOpacity="0.8"
        initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.2, duration:0.5 }} style={{ transformOrigin:"140px 36px" }} />
      {/* Window grid */}
      {[[68,52,52,38],[130,52,52,38],[68,100,52,24],[130,100,52,24]].map(([x,y,w,h],i) => (
        <motion.rect key={i} x={x} y={y} width={w} height={h} rx="1" fill="#1e293b"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3+i*0.08 }} />
      ))}
      {/* RFID scan beam */}
      {active && (
        <motion.rect x="68" y="52" width="52" height="2" rx="1" fill="#ec4899" fillOpacity="0.7"
          animate={{ y:[52,88,52] }} transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }} />
      )}
      {/* POS terminal */}
      <motion.g initial={{ opacity:0, x:14 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5 }}>
        <rect x="196" y="56" width="18" height="26" rx="2" fill="#0f172a" stroke="#ec4899" strokeWidth="0.8" />
        <rect x="198" y="58" width="14" height="10" rx="1" fill="#1e293b" />
        {active && <motion.rect x="198" y="58" width="14" height="10" rx="1" fill="#ec4899" fillOpacity="0.2"
          animate={{ opacity:[0.2,0.6,0.2] }} transition={{ duration:1.5, repeat:Infinity }} />}
        <rect x="200" y="72" width="10" height="6" rx="1" fill="#1e293b" />
      </motion.g>
      {/* WiFi APs */}
      {active && [90,180].map((cx,i) => (
        [1,2].map(r => (
          <motion.path key={`${i}${r}`}
            d={`M ${cx-r*10} ${26-r*7} Q ${cx} ${18-r*9} ${cx+r*10} ${26-r*7}`}
            stroke="#ec4899" strokeWidth="0.8" fill="none"
            animate={{ opacity:[0.2,0.7,0.2] }} transition={{ duration:1.8, repeat:Infinity, delay:r*0.3+i*0.5 }} />
        ))
      ))}
      {/* Metric */}
      <motion.g animate={active ? { y:[0,-4,0] } : {}} transition={{ duration:3.1, repeat:Infinity }}>
        <rect x="8" y="8" width="60" height="28" rx="3" fill="#0f172a" stroke="#ec4899" strokeWidth="0.8" />
        <text x="38" y="20" fill="#ec4899" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">RFID</text>
        <text x="38" y="30" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle">ENABLED</text>
      </motion.g>
      {/* POS badge */}
      <motion.g animate={active ? { y:[0,-3,0] } : {}} transition={{ duration:2.8, repeat:Infinity, delay:0.4 }}>
        <rect x="200" y="120" width="60" height="28" rx="3" fill="#0f172a" stroke="#ec4899" strokeWidth="0.8" />
        <text x="230" y="132" fill="#ec4899" fontSize="8" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">POS 2.0</text>
        <text x="230" y="142" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle">DEPLOYED</text>
      </motion.g>
    </svg>
  );
}

function SVGGovernment({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* Building */}
      <motion.rect x="80" y="50" width="120" height="100" rx="1" fill="#0f172a" stroke="#6366f1" strokeWidth="1"
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} />
      {/* Columns */}
      {[0,1,2,3,4].map(i => (
        <motion.rect key={i} x={86+i*22} y="50" width="8" height="100" rx="1" fill="#1e293b"
          initial={{ scaleY:0 }} animate={{ scaleY:1 }}
          transition={{ delay:0.2+i*0.06, duration:0.5 }} style={{ transformOrigin:`${90+i*22}px 150px` }} />
      ))}
      {/* Roof / pediment */}
      <motion.path d="M 70 50 L 140 18 L 210 50 Z" fill="#0f172a" stroke="#6366f1" strokeWidth="1"
        initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }} />
      {/* Flag */}
      <motion.line x1="140" y1="18" x2="140" y2="4" stroke="#6366f1" strokeWidth="1.2"
        initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ delay:0.5 }} />
      <motion.rect x="140" y="4" width="18" height="10" rx="1" fill="#6366f1" fillOpacity="0.7"
        animate={active ? { scaleX:[1,0.7,1] } : {}} transition={{ duration:1.5, repeat:Infinity }} style={{ transformOrigin:"140px 9px" }} />
      {/* Windows */}
      {[0,1,2].map(col => [0,1].map(row => (
        <motion.rect key={`${col}${row}`} x={92+col*36} y={70+row*30} width="16" height="20" rx="1" fill="#1e3a8a" fillOpacity="0.6"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4+col*0.07+row*0.1 }}
          style={{ border:"0.5px solid #6366f1" }} />
      )))}
      {/* Beacon dots */}
      {active && [40,100,160,220,260].map((cx,i) => (
        <motion.g key={i}>
          <circle cx={cx} cy="148" r="3" fill="#6366f1" />
          <motion.circle cx={cx} cy="148" r="4" fill="none" stroke="#6366f1" strokeWidth="0.8"
            animate={{ r:[3,9,3], opacity:[0.8,0,0.8] }} transition={{ duration:2, repeat:Infinity, delay:i*0.35 }} />
        </motion.g>
      ))}
      {/* Bus line */}
      <motion.line x1="20" y1="148" x2="260" y2="148" stroke="#6366f1" strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="4 3"
        initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ delay:0.6, duration:0.8 }} />
      {/* Metric */}
      <motion.g animate={active ? { y:[0,-4,0] } : {}} transition={{ duration:3, repeat:Infinity }}>
        <rect x="8" y="8" width="66" height="28" rx="3" fill="#0f172a" stroke="#6366f1" strokeWidth="0.8" />
        <text x="41" y="20" fill="#6366f1" fontSize="8" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">9,000+</text>
        <text x="41" y="30" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle">BEACONS</text>
      </motion.g>
    </svg>
  );
}

function SVGUtilities({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* Power tower left */}
      <motion.g initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }}>
        <line x1="40" y1="10" x2="40" y2="140" stroke="#eab308" strokeWidth="2" />
        {[[-18,30],[18,30],[-28,60],[28,60]].map(([ox,oy],i) => (
          <motion.line key={i} x1="40" y1={oy} x2={40+ox} y2={oy+22}
            stroke="#334155" strokeWidth="1.8" strokeLinecap="round"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15+i*0.06 }} />
        ))}
      </motion.g>
      {/* Power tower right */}
      <motion.g initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15 }}>
        <line x1="240" y1="10" x2="240" y2="140" stroke="#eab308" strokeWidth="2" />
        {[[-18,30],[18,30],[-28,60],[28,60]].map(([ox,oy],i) => (
          <motion.line key={i} x1="240" y1={oy} x2={240+ox} y2={oy+22}
            stroke="#334155" strokeWidth="1.8" strokeLinecap="round"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2+i*0.06 }} />
        ))}
      </motion.g>
      {/* Power lines */}
      {[52,92].map((y,i) => (
        <motion.path key={i} d={`M 40 ${y} Q 140 ${y+18} 240 ${y}`}
          stroke="#eab308" strokeWidth="0.8" strokeOpacity="0.6" fill="none"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ delay:0.3+i*0.1, duration:0.7 }} />
      ))}
      {/* Flow animation */}
      {active && [52,92].map((y,li) => (
        <motion.circle key={`f${li}`} r="2.5" fill="#eab308"
          animate={{ offsetDistance:["0%","100%"] }}
          style={{ offsetPath:`path("M 40 ${y} Q 140 ${y+18} 240 ${y}")` }}
          transition={{ duration:2, repeat:Infinity, ease:"linear", delay:li*0.8 }} />
      ))}
      {/* Solar panel */}
      <motion.g initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
        <rect x="110" y="90" width="60" height="40" rx="2" fill="#0f172a" stroke="#eab308" strokeWidth="1" />
        {[0,1,2].map(col => [0,1].map(row => (
          <motion.rect key={`${col}${row}`} x={113+col*18} y={93+row*16} width="15" height="14" rx="1"
            fill="#1e293b"
            animate={active ? { fill:["#1e293b","#eab30820","#1e293b"] } : {}}
            transition={{ duration:2, repeat:Infinity, delay:col*0.3+row*0.4 }} />
        )))}
      </motion.g>
      {/* Camera (CCTV) */}
      <motion.g initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.55 }}>
        <rect x="118" y="58" width="32" height="20" rx="4" fill="#0f172a" stroke="#eab308" strokeWidth="0.8" />
        <rect x="150" y="63" width="12" height="10" rx="2" fill="#1e293b" stroke="#eab308" strokeWidth="0.6" />
        <motion.circle cx="128" cy="68" r="5" fill="#060b18" stroke="#eab308" strokeWidth="0.7"
          animate={active ? { r:[5,6,5] } : {}} transition={{ duration:2, repeat:Infinity }} />
        <circle cx="128" cy="68" r="2.5" fill="#eab308" fillOpacity="0.5" />
      </motion.g>
      {/* Metric */}
      <motion.g animate={active ? { y:[0,-4,0] } : {}} transition={{ duration:3, repeat:Infinity }}>
        <rect x="8" y="8" width="68" height="28" rx="3" fill="#0f172a" stroke="#eab308" strokeWidth="0.8" />
        <text x="42" y="20" fill="#eab308" fontSize="8" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">OUTDOOR</text>
        <text x="42" y="30" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle">CCTV ACTIVE</text>
      </motion.g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const PARTNER_LOGOS = [
  "/Partners/logo1.png","/Partners/logo2.png","/Partners/logo3.png","/Partners/logo4.jpeg",
  "/Partners/logo5.png","/Partners/logo6.jpg","/Partners/logo7.jpg","/Partners/logo8.png",
  "/Partners/logo9.png","/Partners/logo10.png","/Partners/logo11.png","/Partners/logo12.webp",
  "/Partners/logo13.png","/Partners/logo14.jpg","/Partners/logo15.png","/Partners/logo16.webp",
  "/Partners/logo17.png","/Partners/logo18.jpg","/Partners/logo19.jpeg","/Partners/logo20.jpeg",
];

const CLIENT_DATA = {
  healthcare: [
    { title: "MD Anderson Cancer Center", desc: "Network Migration & Windows Refresh for high-uptime clinical environments." },
    { title: "United Healthcare", desc: "Enterprise Network Migration & Epic Systems deployment projects." },
    { title: "Memorial Hermann", desc: "Epic Refresh Project & M48 Cart maintenance for critical care efficiency." },
  ],
  finance: [
    { title: "Wells Fargo", desc: "Enterprise Systems Refresh & strict Security Compliance infrastructure." },
    { title: "Bank of America", desc: "Systems Refresh for modernized branch and corporate infrastructure." },
    { title: "Morgan Stanley", desc: "Managed IT, Network Migrations & Cybersecurity for financial assets." },
  ],
  energy: [
    { title: "Shell", desc: "Desktop Support, Network Admin, and Security Hardening for global energy operations." },
    { title: "BP", desc: "Cisco Phone Migration, AV Deployments, and Cybersecurity hardening." },
  ],
  retail: [
    { title: "Walmart", desc: "Nationwide Network Migration & POS Infrastructure Refresh." },
    { title: "Target", desc: "POS Refresh utilizing ELO Tablets for enhanced customer checkout." },
    { title: "Porsche (Sugar Land)", desc: "Full MDF/IDF Network & CCTV Installation for high-end dealership." },
    { title: "HEB", desc: "RFID Installation and inventory tracking technology deployment." },
    { title: "Sprouts Farmers Market", desc: "Comprehensive CCTV & AV Migration across retail locations." },
    { title: "McDonald's", desc: "Enterprise Network Migration across corporate and franchise sites." },
  ],
  government: [
    { title: "Texas State Prisons", desc: "High-security Network Migration & Secure AP Deployment for inmate connectivity." },
    { title: "METRO Authority", desc: "Smart Beacon Deployment across 9,000+ bus stops for real-time visibility." },
  ],
  power: [
    { title: "Nova Source Power", desc: "Outdoor CCTV & specialized security installations for utility sites." },
  ],
};

const TABS = [
  { key: "healthcare", label: "Healthcare",      Scene: SVGHealthcare,  accent: "#10b981" },
  { key: "finance",    label: "Financial",       Scene: SVGFinance,     accent: "#f59e0b" },
  { key: "energy",     label: "Oil & Gas",       Scene: SVGEnergy,      accent: "#f97316" },
  { key: "retail",     label: "Retail",          Scene: SVGRetail,      accent: "#ec4899" },
  { key: "government", label: "Gov & Transport", Scene: SVGGovernment,  accent: "#6366f1" },
  { key: "power",      label: "Utilities",       Scene: SVGUtilities,   accent: "#eab308" },
];

/* ─────────────────────────────────────────────────────────────
   CLIENT CARD
───────────────────────────────────────────────────────────── */
function ClientCard({ client, index, accent }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16,1,0.3,1] }}
      className="pt-card"
      style={{ "--accent": accent }}
    >
      <div className="pt-card-line" style={{ background: accent }} />

      {/* Index + dot */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 14 }}>
        <span className="pt-mono pt-index" style={{ color: accent }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <motion.div style={{ width: 8, height: 8, borderRadius: "50%", background: accent, opacity: 0.35 }}
          animate={{ scale:[1,1.5,1], opacity:[0.35,0.7,0.35] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }} />
      </div>

      <h3 className="pt-title">{client.title}</h3>
      <p className="pt-desc">{client.desc}</p>

      <div className="pt-footer">
        <span className="pt-verified">
          <motion.span style={{ width: 5, height: 5, borderRadius: "50%", background: accent, display:"inline-block", marginRight: 6, flexShrink: 0 }}
            animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:2, repeat:Infinity }} />
          Deployment_Verified
        </span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────── */
const Partners = () => {
  const [activeTab, setActiveTab]   = useState("healthcare");
  const tabsRef    = useRef(null);
  const sectionRef = useRef(null);
  const inView     = useInView(sectionRef, { once: true, margin: "-60px" });

  const current  = TABS.find(t => t.key === activeTab);
  const clients  = CLIENT_DATA[activeTab];

  useEffect(() => {
    if (!tabsRef.current) return;
    const el = tabsRef.current.querySelector(".pt-tab-active");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeTab]);

  return (
    <section id="partners" ref={sectionRef}
      style={{ background: "#f1f3f5", fontFamily: "'Barlow',sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .pt * { box-sizing: border-box; }
        .pt-display { font-family: 'Bebas Neue', sans-serif !important; letter-spacing: 0.03em; }
        .pt-mono    { font-family: 'Space Mono', monospace !important; }
        .pt-body    { font-family: 'Barlow', sans-serif !important; }

        .pt-dotgrid {
          background-image: radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* ── Tabs ── */
        .pt-tabs-row {
          display: flex; flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden;
          gap: 8px; padding-bottom: 4px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; scroll-snap-type: x mandatory;
        }
        .pt-tabs-row::-webkit-scrollbar { display: none; }

        .pt-tab {
          flex-shrink: 0; scroll-snap-align: start;
          cursor: pointer; border: 1px solid rgba(0,0,0,0.09);
          background: #fff; font-family: 'Space Mono', monospace;
          font-size: 0.52rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(15,23,42,0.4); padding: 9px 14px 9px 10px;
          display: flex; align-items: center; gap: 7px;
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
          white-space: nowrap; position: relative; overflow: hidden;
        }
        .pt-tab:hover { border-color: var(--tab-accent); color: #0f172a; }
        .pt-tab.pt-tab-active {
          background: #0f172a; border-color: #0f172a; color: #fff;
          box-shadow: 0 6px 20px rgba(0,0,0,0.16);
        }
        .pt-tab.pt-tab-active .pt-tab-dot { background: var(--tab-accent) !important; }

        /* ── Layout ── */
        .pt-main {
          display: flex; flex-direction: column; gap: 28px;
        }
        @media (min-width: 900px) {
          .pt-main { flex-direction: row; gap: 36px; align-items: flex-start; }
        }

        /* ── Scene panel ── */
        .pt-scene-panel {
          width: 100%; background: #0a0f1e;
          border: 1px solid rgba(255,255,255,0.06);
          position: relative; overflow: hidden;
          display: flex; flex-direction: column;
          min-height: 200px; padding: 20px;
        }
        @media (min-width: 900px) {
          .pt-scene-panel {
            width: 300px; flex-shrink: 0;
            min-height: 400px;
            position: sticky; top: 100px;
          }
        }
        @media (min-width: 1100px) {
          .pt-scene-panel { width: 340px; }
        }

        /* ── Cards grid ── */
        .pt-grid {
          flex: 1; display: grid;
          grid-template-columns: 1fr; gap: 12px;
        }
        @media (min-width: 540px) {
          .pt-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 900px) {
          .pt-grid { grid-template-columns: 1fr; }
        }
        @media (min-width: 1060px) {
          .pt-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── Client card ── */
        .pt-card {
          background: #fff; border: 1px solid rgba(0,0,0,0.07);
          padding: 22px 22px 18px;
          position: relative; overflow: hidden;
          display: flex; flex-direction: column; gap: 10px;
          cursor: default;
          transition: border-color 0.28s, box-shadow 0.28s, transform 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .pt-card:hover {
          border-color: var(--accent);
          box-shadow: 0 8px 32px rgba(0,0,0,0.08), -3px 0 0 var(--accent);
          transform: translateY(-3px);
        }
        .pt-card-line {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .pt-card:hover .pt-card-line { transform: scaleX(1); }

        .pt-index {
          font-size: 0.5rem; letter-spacing: 0.3em; opacity: 0.6; text-transform: uppercase;
        }
        .pt-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.05rem, 2.4vw, 1.25rem);
          letter-spacing: 0.04em; color: #0f172a; line-height: 1.1; margin: 0;
        }
        .pt-desc {
          font-family: 'Barlow', sans-serif;
          font-size: clamp(0.78rem, 1.8vw, 0.84rem);
          color: #475569; font-weight: 400; line-height: 1.7; margin: 0; flex: 1;
        }
        .pt-footer {
          padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.06); margin-top: auto;
        }
        .pt-verified {
          font-family: 'Space Mono', monospace;
          font-size: 0.46rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(15,23,42,0.28); display: flex; align-items: center;
        }

        /* ── Marquee ── */
        .pt-marquee-track {
          display: flex; align-items: center; gap: 0;
          animation: pt-marquee 50s linear infinite;
          white-space: nowrap;
        }
        .pt-marquee-track:hover { animation-play-state: paused; }
        @keyframes pt-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ── Index strip ── */
        .pt-index-strip { display: none; }
        @media (min-width: 480px) { .pt-index-strip { display: flex; } }
      `}</style>

      <div className="pt" style={{ position: "relative" }}>
        <div className="pt-dotgrid" style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0 }} />

        {/* Ambient glow */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
          background:`radial-gradient(ellipse 50% 40% at 60% 50%, ${current.accent}0c, transparent 65%)`,
          transition:"background 0.7s ease",
        }} />

        <div style={{ position:"relative", zIndex:1, maxWidth:1200, margin:"0 auto", padding:"80px 16px 100px" }}>

          {/* ── Eyebrow ── */}
          <motion.div
            initial={{ opacity:0, y:14 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.65, ease:[0.16,1,0.3,1] }}
            style={{ display:"flex", alignItems:"center", gap:12, marginBottom:36 }}
          >
            <motion.div initial={{ scaleX:0 }} animate={inView ? { scaleX:1 } : {}} transition={{ duration:0.55, delay:0.1 }}
              style={{ width:24, height:2, background:"#3b82f6", transformOrigin:"left", flexShrink:0 }} />
            <span className="pt-mono" style={{ fontSize:"0.52rem", letterSpacing:"0.42em", color:"#3b82f6", textTransform:"uppercase", whiteSpace:"nowrap" }}>
              Client Portfolio
            </span>
            <motion.div initial={{ scaleX:0 }} animate={inView ? { scaleX:1 } : {}} transition={{ duration:0.8, delay:0.2 }}
              style={{ flex:1, height:1, background:"linear-gradient(to right, rgba(59,130,246,0.3), transparent)", transformOrigin:"left" }} />
          </motion.div>

          {/* ── Headline ── */}
          <motion.div
            initial={{ opacity:0, y:22 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.7, delay:0.1, ease:[0.16,1,0.3,1] }}
            style={{ marginBottom:36 }}
          >
            <h2 className="pt-display" style={{ fontSize:"clamp(2.4rem,7vw,6rem)", lineHeight:0.9, color:"#0f172a", marginBottom:12 }}>
              Trusted by{" "}
              <span style={{ background:"linear-gradient(90deg,#3b82f6,#818cf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                Industry Leaders
              </span>
            </h2>
            <p className="pt-body" style={{ fontSize:"clamp(0.84rem,2.2vw,1rem)", color:"#475569", fontWeight:400, maxWidth:"54ch", lineHeight:1.7 }}>
              Strategic infrastructure partnerships across mission-critical sectors including energy, finance, and healthcare.
            </p>
          </motion.div>

          {/* ── Tabs ── */}
          <motion.div
            initial={{ opacity:0, y:14 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.6, delay:0.2 }}
            style={{ marginBottom:32 }}
          >
            <div className="pt-tabs-row" ref={tabsRef}>
              {TABS.map((t, i) => (
                <motion.button
                  key={t.key}
                  className={`pt-tab ${activeTab === t.key ? "pt-tab-active" : ""}`}
                  style={{ "--tab-accent": t.accent }}
                  onClick={() => setActiveTab(t.key)}
                  initial={{ opacity:0, y:8 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.25+i*0.06 }}
                >
                  <span className="pt-tab-dot" style={{
                    width:5, height:5, borderRadius:"50%", flexShrink:0,
                    background: activeTab === t.key ? t.accent : "rgba(0,0,0,0.17)",
                    transition:"background 0.2s",
                  }} />
                  {t.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ── Main layout ── */}
          <div className="pt-main">

            {/* ── Scene panel ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`scene-${activeTab}`}
                className="pt-scene-panel"
                initial={{ opacity:0, filter:"blur(6px)" }}
                animate={{ opacity:1, filter:"blur(0px)" }}
                exit={{ opacity:0, filter:"blur(6px)" }}
                transition={{ duration:0.38 }}
              >
                {/* Glow */}
                <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:`radial-gradient(ellipse 80% 65% at 50% 50%, ${current.accent}1a, transparent 70%)`, transition:"background 0.5s" }} />
                {/* Dark dot grid */}
                <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize:"22px 22px" }} />

                {/* Tag */}
                <div style={{ position:"relative", zIndex:1, marginBottom:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background:current.accent, flexShrink:0 }} />
                    <span className="pt-mono" style={{ fontSize:"0.46rem", letterSpacing:"0.38em", color:current.accent, textTransform:"uppercase" }}>
                      {current.label}_SECTOR
                    </span>
                  </div>
                </div>

                {/* SVG */}
                <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ width:"100%", maxWidth:280 }}>
                    <current.Scene active={true} />
                  </div>
                </div>

                {/* Client count */}
                <div style={{ position:"relative", zIndex:1, marginTop:16, paddingTop:14, borderTop:`1px solid ${current.accent}22` }}>
                  <div className="pt-mono" style={{ fontSize:"0.42rem", letterSpacing:"0.3em", color:"rgba(255,255,255,0.22)", textTransform:"uppercase", marginBottom:4 }}>
                    Active Clients
                  </div>
                  <div className="pt-display" style={{ fontSize:"2rem", lineHeight:1, color:current.accent }}>
                    {String(clients.length).padStart(2, "0")}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ── Cards ── */}
            <div style={{ flex:1, minWidth:0 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`grid-${activeTab}`}
                  className="pt-grid"
                  initial={{ opacity:0 }}
                  animate={{ opacity:1 }}
                  exit={{ opacity:0 }}
                  transition={{ duration:0.22 }}
                >
                  {clients.map((client, index) => (
                    <ClientCard key={`${activeTab}-${index}`} client={client} index={index} accent={current.accent} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Index strip ── */}
          <motion.div
            className="pt-index-strip"
            style={{ alignItems:"center", gap:18, marginTop:40, flexWrap:"wrap" }}
            initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}}
            transition={{ delay:0.85 }}
          >
            {TABS.map((t, i) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", alignItems:"center", gap:5, opacity:activeTab===t.key?1:0.3, transition:"opacity 0.2s" }}>
                <div style={{ width:activeTab===t.key?16:4, height:3, background:t.accent, borderRadius:2, transition:"width 0.3s cubic-bezier(0.16,1,0.3,1)" }} />
                <span className="pt-mono" style={{ fontSize:"0.42rem", letterSpacing:"0.22em", color:"#0f172a", textTransform:"uppercase" }}>
                  {String(i+1).padStart(2,"0")}
                </span>
              </button>
            ))}
            <span className="pt-mono" style={{ marginLeft:"auto", fontSize:"0.42rem", letterSpacing:"0.26em", color:"rgba(15,23,42,0.2)", textTransform:"uppercase" }}>
              {String(TABS.findIndex(t=>t.key===activeTab)+1).padStart(2,"0")} / {String(TABS.length).padStart(2,"0")}
            </span>
          </motion.div>

          {/* ── Logo Marquee ── */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.7, delay:0.4 }}
            style={{ marginTop:80 }}
          >
            {/* Header row */}
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
              <motion.div initial={{ scaleX:0 }} animate={inView ? { scaleX:1 } : {}} transition={{ duration:0.55, delay:0.5 }}
                style={{ width:24, height:2, background:"#3b82f6", transformOrigin:"left", flexShrink:0 }} />
              <span className="pt-mono" style={{ fontSize:"0.48rem", letterSpacing:"0.38em", color:"#3b82f6", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                Partner_Network_Status: Active
              </span>
              <div style={{ flex:1, height:1, background:"linear-gradient(to right, rgba(0,0,0,0.08), transparent)" }} />
              <span className="pt-mono" style={{ fontSize:"0.46rem", letterSpacing:"0.28em", color:"rgba(15,23,42,0.28)", textTransform:"uppercase", whiteSpace:"nowrap", display:"none" }}
                ref={el => el && (el.style.display = window.innerWidth >= 640 ? "block" : "none")}>
                Authorized Service Provider
              </span>
            </div>

            {/* Marquee */}
            <div style={{ position:"relative", overflow:"hidden", background:"#fff", border:"1px solid rgba(0,0,0,0.07)", padding:"28px 0", boxShadow:"0 4px 24px rgba(0,0,0,0.04)" }}>
              {/* Edge fades */}
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:80, background:"linear-gradient(to right, #fff, transparent)", zIndex:2, pointerEvents:"none" }} />
              <div style={{ position:"absolute", right:0, top:0, bottom:0, width:80, background:"linear-gradient(to left, #fff, transparent)", zIndex:2, pointerEvents:"none" }} />

              <div className="pt-marquee-track">
                {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, index) => (
                  <div key={index} style={{ flexShrink:0, padding:"0 32px", display:"flex", alignItems:"center" }}>
                    <img
                      src={logo}
                      alt="Partner"
                      style={{
                        height: 40, width:"auto", objectFit:"contain",
                        filter:"grayscale(0.2) brightness(1.1) contrast(1.05)",
                        transition:"transform 0.3s, filter 0.3s",
                        cursor:"default",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform="scale(1.12)"; e.currentTarget.style.filter="grayscale(0) brightness(1.15)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.filter="grayscale(0.2) brightness(1.1) contrast(1.05)"; }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer tag */}
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:12 }}>
              <span className="pt-mono" style={{ fontSize:"0.42rem", letterSpacing:"0.28em", color:"rgba(15,23,42,0.22)", textTransform:"uppercase" }}>
                20+ Verified_Partners
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Partners;