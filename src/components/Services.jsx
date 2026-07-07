import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useParams } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────
   SVG SCENES — Premium 3D Isometric Illustrations
───────────────────────────────────────────────────────────── */

function SVGWebsite({ active }) {
  return (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", filter: "drop-shadow(0 8px 24px rgba(59,130,246,0.18))" }}>
      <defs>
        <radialGradient id="wG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="200" rx="140" ry="14" fill="url(#wG)" />
      <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        {/* main frame shadow */}
        <rect x="26" y="27" width="280" height="180" rx="8" fill="rgba(59,130,246,0.08)" transform="translate(4,6)" />
        <rect x="22" y="22" width="280" height="180" rx="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.4" />
        {/* chrome bar */}
        <rect x="22" y="22" width="280" height="30" rx="8" fill="#1e293b" />
        <rect x="22" y="37" width="280" height="15" fill="#1e293b" />
        {/* traffic lights */}
        {["#ef4444","#f59e0b","#22c55e"].map((c,i) => (
          <motion.circle key={i} cx={36+i*14} cy={37} r="4.5"
            fill={c} initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.18+i*0.08, type:"spring", stiffness:300 }} />
        ))}
        {/* address bar */}
        <rect x="88" y="30" width="148" height="14" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
        <motion.text x="110" y="41" fill="#64748b" fontSize="6" fontFamily="monospace"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          conotextech.com
        </motion.text>
      </motion.g>
      {/* nav bar */}
      <motion.rect x="30" y="60" width="264" height="14" rx="2" fill="#1e293b"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} />
      {[0,1,2,3].map(i => (
        <motion.rect key={i} x={40+i*54} y={63} width="32" height="6" rx="1"
          fill={i===0?"#3b82f6":"#334155"}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.45+i*0.07 }} style={{ transformOrigin:`${40+i*54}px 66px` }} />
      ))}
      {/* hero block */}
      <motion.rect x="30" y="82" width="156" height="54" rx="2" fill="#1e293b"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} />
      {/* heading line */}
      <motion.rect x="38" y="90" width="108" height="8" rx="2" fill="#3b82f6"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }} style={{ transformOrigin:"38px 94px" }} />
      {[0,1].map(i => (
        <motion.rect key={i} x="38" y={102+i*8} width={[86,64][i]} height="4" rx="1" fill="#334155"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.68+i*0.06 }} style={{ transformOrigin:`38px ${104+i*8}px` }} />
      ))}
      <motion.rect x="38" y="118" width="52" height="11" rx="2" fill="#3b82f6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.78 }} />
      {/* image placeholder */}
      <motion.rect x="192" y="82" width="102" height="54" rx="2" fill="#1e3a5f"
        initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }} />
      <motion.rect x="192" y="82" width="102" height="54" rx="2" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.5" />
      {/* grid lines in image placeholder */}
      {[0,1,2].map(i => (
        <line key={i} x1="192" y1={92+i*12} x2="294" y2={92+i*12} stroke="#3b82f6" strokeWidth="0.3" strokeOpacity="0.2" />
      ))}
      {/* content rows */}
      {[0,1,2,3,4].map((i) => (
        <motion.rect key={i} x="30" y={144+i*8} width={64+(i%3)*28} height="4" rx="1" fill="#1e293b"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.72+i*0.05 }} style={{ transformOrigin:"30px" }} />
      ))}
      {/* scan line */}
      <motion.rect x="22" y="0" width="280" height="1.5" fill="#3b82f6" fillOpacity="0.15"
        animate={{ y: [22, 202, 22] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
      {/* floating stat */}
      <motion.g animate={active ? { y: [0,-6,0] } : {}} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="198" y="148" width="84" height="42" rx="5" fill="rgba(10,15,30,0.96)" stroke="#3b82f6" strokeWidth="1" />
        <rect x="198" y="148" width="84" height="42" rx="5" fill="#3b82f6" fillOpacity="0.05" />
        <line x1="282" y1="148" x2="258" y2="148" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.6" />
        <text x="240" y="168" fill="#3b82f6" fontSize="14" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">99%</text>
        <text x="240" y="181" fill="#64748b" fontSize="5" fontFamily="monospace" textAnchor="middle" letterSpacing="1.6">LIGHTHOUSE</text>
      </motion.g>
      <motion.rect x="148" y="122" width="2" height="8" fill="#3b82f6"
        animate={{ opacity: [1,0,1] }} transition={{ duration: 0.9, repeat: Infinity }} />
    </svg>
  );
}

function SVGAi({ active }) {
  const nodes = [
    {cx:50,cy:100,l:0},{cx:50,cy:130,l:0},{cx:50,cy:160,l:0},
    {cx:120,cy:85,l:1},{cx:120,cy:112,l:1},{cx:120,cy:140,l:1},{cx:120,cy:167,l:1},
    {cx:190,cy:85,l:2},{cx:190,cy:112,l:2},{cx:190,cy:140,l:2},{cx:190,cy:167,l:2},
    {cx:260,cy:100,l:3},{cx:260,cy:130,l:3},{cx:260,cy:160,l:3},
  ];
  const edges = nodes.flatMap(a => nodes.filter(b => b.l === a.l+1).map(b => ({ x1:a.cx,y1:a.cy,x2:b.cx,y2:b.cy })));
  return (
    <svg viewBox="0 0 320 220" fill="none" style={{ width:"100%", height:"100%",
      filter:"drop-shadow(0 8px 24px rgba(59,130,246,0.16))" }}>
      <defs>
        <radialGradient id="aG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="195" rx="130" ry="12" fill="url(#aG)" />
      {/* slab columns */}
      {[50,120,190,260].map((x,i) => (
        <motion.rect key={i} x={x-18} y={70} width="36" height="116" rx="3"
          fill="#3b82f6" fillOpacity="0.04" stroke="#3b82f6" strokeWidth="0.4" strokeOpacity="0.2"
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ delay: i*0.08, duration: 0.5 }} style={{ transformOrigin:`${x}px 128px` }} />
      ))}
      {edges.map(({ x1,y1,x2,y2 },k) => (
        <motion.line key={k} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#3b82f6" strokeWidth="0.55" strokeOpacity="0.2"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }}
          transition={{ delay:0.1+k*0.013, duration:0.6 }} />
      ))}
      {active && edges.slice(0,10).map(({ x1,y1,x2,y2 },k) => (
        <motion.circle key={`p${k}`} r="2.5" fill="#3b82f6"
          animate={{ cx:[x1,x2], cy:[y1,y2], opacity:[0,1,0] }}
          transition={{ duration:1.1, repeat:Infinity, delay:k*0.2, ease:"linear" }} />
      ))}
      {nodes.map((n,i) => (
        <motion.g key={i}>
          {active && <motion.circle cx={n.cx} cy={n.cy} r="6" fill="none" stroke="#3b82f6" strokeWidth="0.8"
            animate={{ r:[6,16,6], opacity:[0.6,0,0.6] }}
            transition={{ duration:2.4, repeat:Infinity, delay:i*0.18 }} />}
          <motion.circle cx={n.cx} cy={n.cy} r="9" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.1"
            initial={{ scale:0 }} animate={{ scale:1 }}
            transition={{ delay:0.18+i*0.04, type:"spring", stiffness:240 }} />
          <motion.circle cx={n.cx} cy={n.cy} r="3.5" fill="#3b82f6"
            animate={active ? { r:[3.5,5.5,3.5], opacity:[0.8,1,0.8] } : {}}
            transition={{ duration:2, repeat:Infinity, delay:i*0.14 }} />
        </motion.g>
      ))}
      {[{x:50,l:"INPUT"},{x:120,l:"HIDDEN"},{x:190,l:"HIDDEN"},{x:260,l:"OUTPUT"}].map(({ x,l }) => (
        <motion.text key={l} x={x} y="198" fill="#475569" fontSize="6" fontFamily="monospace"
          textAnchor="middle" fontWeight="700" letterSpacing="0.5"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.85 }}>{l}</motion.text>
      ))}
      <motion.g animate={active ? { y:[0,-5,0] } : {}} transition={{ duration:3.5, repeat:Infinity }}>
        <rect x="222" y="14" width="80" height="44" rx="5" fill="rgba(10,15,30,0.96)" stroke="#22c55e" strokeWidth="1" />
        <text x="262" y="34" fill="#22c55e" fontSize="13" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">10×</text>
        <text x="262" y="48" fill="#64748b" fontSize="5" fontFamily="monospace" textAnchor="middle" letterSpacing="1.4">ACCURACY</text>
      </motion.g>
    </svg>
  );
}

function SVGCabling({ active }) {
  return (
    <svg viewBox="0 0 320 220" fill="none" style={{ width:"100%", height:"100%",
      filter:"drop-shadow(0 8px 24px rgba(6,182,212,0.18))" }}>
      <defs>
        <radialGradient id="cG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="cL" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4"/>
          <stop offset="100%" stopColor="#3b82f6"/>
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="200" rx="130" ry="12" fill="url(#cG)" />
      {/* patch panel */}
      <motion.g initial={{ opacity:0, x:-18 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5 }}>
        <rect x="16" y="24" width="82" height="168" rx="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.3" />
        <rect x="20" y="28" width="74" height="8" rx="2" fill="#1e293b" />
        <text x="57" y="35" fill="#06b6d4" fontSize="5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">PATCH PANEL</text>
        {[0,1,2,3,4,5,6,7].map(i => (
          <motion.g key={i} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.22+i*0.055 }}>
            <rect x="22" y={42+i*17} width="74" height="12" rx="2" fill="#1e293b" />
            <rect x="22" y={42+i*17} width="74" height="1" fill="#06b6d4" fillOpacity="0.12" />
            {/* port LED */}
            <circle cx="30" cy={48+i*17} r="3"
              fill={active && i%3!==2 ? "#06b6d4" : "#1e3a4f"} />
            {active && i%3!==2 && (
              <motion.circle cx="30" cy={48+i*17} r="5" fill="none" stroke="#06b6d4" strokeWidth="0.6"
                animate={{ r:[3,8,3], opacity:[0.7,0,0.7] }}
                transition={{ duration:2, repeat:Infinity, delay:i*0.28 }} />
            )}
            {/* port label */}
            <text x="44" y={50+i*17} fill="#475569" fontSize="4.5" fontFamily="monospace" fontWeight="700">
              {`PORT ${String(i+1).padStart(2,"0")}`}
            </text>
          </motion.g>
        ))}
      </motion.g>
      {/* cables */}
      {[42,60,78,96,114,132,150,168].map((y,i) => (
        <motion.path key={i}
          d={`M 98 ${y} C 140 ${y} 156 ${y+(i%2===0?18:-8)} 200 ${y+(i%2===0?9:2)}`}
          stroke={["#06b6d4","#3b82f6","#818cf8","#06b6d4","#3b82f6","#818cf8","#22c55e","#06b6d4"][i]}
          strokeWidth={1.6} strokeOpacity={0.75} fill="none"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }}
          transition={{ delay:0.4+i*0.07, duration:0.8, ease:"easeOut" }} />
      ))}
      {/* switch */}
      <motion.g initial={{ opacity:0, x:18 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.48, duration:0.5 }}>
        <rect x="196" y="62" width="106" height="88" rx="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.3" />
        <rect x="196" y="62" width="106" height="14" rx="4" fill="#1e293b" />
        <text x="249" y="73" fill="#06b6d4" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="700" letterSpacing="1">NETWORK SWITCH</text>
        {[0,1,2,3,4,5,6,7].map(i => (
          <motion.circle key={i} cx={207+(i%4)*22} cy={i<4?90:108} r="5"
            fill="#06b6d4" fillOpacity="0.18" stroke="#06b6d4" strokeWidth="0.8"
            animate={active ? { opacity:[0.35,1,0.35], fillOpacity:[0.18,0.55,0.18] } : { opacity:0.4 }}
            transition={{ duration:0.9, repeat:Infinity, delay:i*0.14 }} />
        ))}
        {/* throughput bar */}
        <rect x="205" y="122" width="88" height="8" rx="2" fill="#1e293b" />
        <motion.rect x="205" y="122" width="0" height="8" rx="2" fill="url(#cL)"
          animate={{ width:[0,88,60,88] }} transition={{ duration:3, repeat:Infinity }} />
        <text x="249" y="141" fill="#475569" fontSize="5" fontFamily="monospace" textAnchor="middle" letterSpacing="0.8">THROUGHPUT</text>
      </motion.g>
      {/* animated data pulses on cables */}
      {active && [0,2,5].map(i => (
        <motion.circle key={`dp${i}`} r="2.5" fill="#06b6d4" fillOpacity="0.9">
          <animateMotion path={`M 98 ${42+i*18} C 140 ${42+i*18} 156 ${60+i*18} 200 ${51+i*18}`}
            dur={`${1.2+i*0.2}s`} begin={`${i*0.4}s`} repeatCount="indefinite" />
        </motion.circle>
      ))}
      <motion.g animate={active ? { y:[0,-5,0] } : {}} transition={{ duration:3.2, repeat:Infinity }}>
        <rect x="204" y="20" width="88" height="38" rx="5" fill="rgba(10,15,30,0.96)" stroke="#06b6d4" strokeWidth="1" />
        <text x="248" y="38" fill="#06b6d4" fontSize="14" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">100G</text>
        <text x="248" y="50" fill="#64748b" fontSize="5" fontFamily="monospace" textAnchor="middle" letterSpacing="1.4">THROUGHPUT</text>
      </motion.g>
    </svg>
  );
}

function SVGCyber({ active }) {
  return (
    <svg viewBox="0 0 320 220" fill="none" style={{ width:"100%", height:"100%",
      filter:"drop-shadow(0 8px 24px rgba(239,68,68,0.18))" }}>
      <defs>
        <radialGradient id="cyG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.16"/>
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="200" rx="120" ry="12" fill="url(#cyG)" />
      {/* radar rings */}
      {[1,2,3,4].map(r => (
        <motion.circle key={r} cx="160" cy="110" r={r*38}
          stroke="#ef4444" strokeWidth="0.6" strokeOpacity={0.12+r*0.04} strokeDasharray="4 4"
          initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
          transition={{ delay:r*0.09, duration:0.6 }} />
      ))}
      {/* radar cross */}
      <line x1="160" y1="22" x2="160" y2="198" stroke="#ef4444" strokeWidth="0.35" strokeOpacity="0.1" />
      <line x1="66" y1="110" x2="254" y2="110" stroke="#ef4444" strokeWidth="0.35" strokeOpacity="0.1" />
      {/* sweep */}
      {active && (
        <motion.g style={{ transformOrigin:"160px 110px" }}
          animate={{ rotate:360 }} transition={{ duration:4, repeat:Infinity, ease:"linear" }}>
          <line x1="160" y1="110" x2="160" y2="22" stroke="#ef4444" strokeWidth="1.2" strokeOpacity="0.7" />
          <path d="M160 110 L160 22 A88 88 0 0 1 180 25 Z" fill="#ef4444" fillOpacity="0.08" />
        </motion.g>
      )}
      {/* shield shadow */}
      <path d="M168 42 L210 68 L210 128 Q210 172 168 196 Q126 172 126 128 L126 68 Z"
        fill="#ef4444" fillOpacity="0.05" transform="translate(6,8)" />
      {/* shield body */}
      <motion.path d="M160 36 L204 62 L204 124 Q204 168 160 190 Q116 168 116 124 L116 62 Z"
        fill="#0f172a" stroke="#ef4444" strokeWidth="2.2"
        initial={{ scale:0 }} animate={{ scale:1 }}
        transition={{ delay:0.28, type:"spring", stiffness:140 }}
        style={{ transformOrigin:"160px 113px" }} />
      <path d="M160 52 L194 74 L194 122 Q194 158 160 176 Q126 158 126 122 L126 74 Z"
        fill="#ef4444" fillOpacity="0.06" />
      {/* lock */}
      <motion.rect x="145" y="100" width="30" height="24" rx="4" fill="#ef4444"
        initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.52 }} />
      <motion.path d="M151 100 Q151 86 160 86 Q169 86 169 100"
        stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round"
        initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ delay:0.62, duration:0.5 }} />
      <circle cx="160" cy="113" r="4" fill="#0f172a" />
      <rect x="158" y="113" width="4" height="6" rx="1" fill="#0f172a" />
      {/* shield pulse */}
      {active && (
        <motion.path d="M160 36 L204 62 L204 124 Q204 168 160 190 Q116 168 116 124 L116 62 Z"
          fill="none" stroke="#ef4444" strokeWidth="1.4" strokeOpacity="0.35"
          animate={{ strokeOpacity:[0.2,0.8,0.2] }} transition={{ duration:2.2, repeat:Infinity }} />
      )}
      {/* threat nodes */}
      {[{cx:62,cy:58},{cx:255,cy:72},{cx:74,cy:168},{cx:250,cy:162}].map((n,i) => (
        <motion.g key={i} initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }}
          transition={{ delay:0.7+i*0.1 }}>
          {active && <motion.circle cx={n.cx} cy={n.cy} r="8" fill="none" stroke="#ef4444" strokeWidth="0.8"
            animate={{ r:[8,18,8], opacity:[0.8,0,0.8] }}
            transition={{ duration:2.2, repeat:Infinity, delay:i*0.52 }} />}
          <circle cx={n.cx} cy={n.cy} r="7" fill="#0f172a" stroke="#ef4444" strokeWidth="1.2" />
          {active && <motion.circle r="2.5" fill="#ef4444" fillOpacity="0">
            <animateMotion path={`M ${n.cx} ${n.cy} L 160 116`}
              dur={`${2.0+i*0.16}s`} begin={`${i*0.45}s`} repeatCount="indefinite" calcMode="linear" />
            <animate attributeName="fill-opacity" values="0;0.85;0" dur={`${2.0+i*0.16}s`}
              begin={`${i*0.45}s`} repeatCount="indefinite" />
          </motion.circle>}
          <text x={n.cx} y={n.cy+4} fill="#ef4444" fontSize="7" fontFamily="monospace" textAnchor="middle">×</text>
          <line x1={n.cx} y1={n.cy} x2="160" y2="112" stroke="#ef4444" strokeWidth="0.5"
            strokeOpacity="0.18" strokeDasharray="4 3" />
        </motion.g>
      ))}
      <motion.g animate={active ? { y:[0,-5,0] } : {}} transition={{ duration:3, repeat:Infinity }}>
        <rect x="218" y="14" width="84" height="40" rx="5" fill="rgba(10,15,30,0.96)" stroke="#ef4444" strokeWidth="1" />
        <text x="260" y="32" fill="#ef4444" fontSize="12" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">0-DAY</text>
        <text x="260" y="45" fill="#64748b" fontSize="5" fontFamily="monospace" textAnchor="middle" letterSpacing="1.4">RESPONSE</text>
      </motion.g>
      {/* scan line */}
      <motion.rect x="22" y="0" width="276" height="1.5" fill="#ef4444" fillOpacity="0.12"
        animate={{ y:[22,198,22] }} transition={{ duration:4.5, repeat:Infinity, ease:"linear" }} />
    </svg>
  );
}

function SVGManagedIT({ active }) {
  return (
    <svg viewBox="0 0 320 220" fill="none" style={{ width:"100%", height:"100%",
      filter:"drop-shadow(0 8px 24px rgba(16,185,129,0.16))" }}>
      <defs>
        <radialGradient id="mG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="200" rx="130" ry="12" fill="url(#mG)" />
      {/* 3 server racks */}
      {[0,1,2].map(i => (
        <motion.g key={i} initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:i*0.12, duration:0.5 }}>
          <rect x={26+i*72} y="42" width="60" height="130" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1.2" />
          {/* top label */}
          <rect x={30+i*72} y="48" width="52" height="8" rx="2" fill="#1e293b" />
          <text x={56+i*72} y="55" fill="#10b981" fontSize="4.5" fontFamily="monospace" textAnchor="middle" fontWeight="700" letterSpacing="0.5">
            RACK {String(i+1).padStart(2,"0")}
          </text>
          {/* unit LEDs */}
          {[0,1,2,3,4,5].map(j => (
            <motion.g key={j}>
              <rect x={30+i*72} y={60+j*16} width="52" height="10" rx="1.5" fill="#0d1929" />
              <circle cx={36+i*72} cy={65+j*16} r="3"
                fill={active ? "#10b981" : "#1e3a2e"} />
              {active && (
                <motion.circle cx={36+i*72} cy={65+j*16} r="4.5"
                  fill="none" stroke="#10b981" strokeWidth="0.5"
                  animate={{ r:[3,7,3], opacity:[0.7,0,0.7] }}
                  transition={{ duration:1.8, repeat:Infinity, delay:i*0.25+j*0.18 }} />
              )}
              {/* utilization bar */}
              <rect x={42+i*72} y={62+j*16} width="36" height="6" rx="1.5" fill="#1e293b" />
              <motion.rect x={42+i*72} y={62+j*16} height="6" rx="1.5" fill="#10b981" fillOpacity="0.7"
                animate={{ width:[8,34,18,36,12][j%5] }}
                transition={{ duration:2+j*0.3, repeat:Infinity, repeatType:"reverse" }} />
            </motion.g>
          ))}
          {/* shadow base */}
          <rect x={28+i*72} y="172" width="56" height="6" rx="3" fill="#1e293b" />
          <motion.rect x={28+i*72} y="172" height="6" rx="3" fill="#10b981"
            animate={{ width:[20,50,30][i] }}
            transition={{ duration:2.2+i*0.4, repeat:Infinity, repeatType:"reverse" }} />
        </motion.g>
      ))}
      {/* connection arc */}
      <motion.path d="M 56 106 Q 160 68 264 106"
        stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="5 4"
        fill="none" initial={{ pathLength:0 }} animate={{ pathLength:1 }}
        transition={{ delay:0.52, duration:1 }} />
      {/* central monitor panel */}
      <motion.g initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }}
        transition={{ delay:0.6, duration:0.5 }} style={{ transformOrigin:"160px 86px" }}>
        <rect x="128" y="50" width="64" height="56" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1.4" />
        <rect x="128" y="50" width="64" height="10" rx="4" fill="#1e3a2e" />
        <text x="160" y="58" fill="#10b981" fontSize="4.5" fontFamily="monospace" textAnchor="middle" fontWeight="700" letterSpacing="0.5">MONITOR</text>
        {/* EQ bars */}
        {[0,1,2,3,4].map(i => (
          <motion.rect key={i} x={135+i*10} y={78} width="7" rx="1" fill="#10b981" fillOpacity="0.85"
            animate={{ height:[8,20,12,24,10][i], y:[78,66,72,62,74][i] }}
            transition={{ duration:1.4+i*0.28, repeat:Infinity, repeatType:"reverse" }} />
        ))}
        <rect x="128" y="100" width="64" height="6" rx="0 0 4 4" fill="#1e3a2e" />
      </motion.g>
      {/* data pulses on arc */}
      {active && [0,1,2].map(i => (
        <motion.circle key={i} r="2.5" fill="#10b981" fillOpacity="0">
          <animateMotion path="M 56 106 Q 160 68 264 106"
            dur={`${2.2+i*0.3}s`} begin={`${i*0.7}s`} repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0;0.9;0" dur={`${2.2+i*0.3}s`}
            begin={`${i*0.7}s`} repeatCount="indefinite" />
        </motion.circle>
      ))}
      <motion.g animate={active ? { y:[0,-5,0] } : {}} transition={{ duration:3, repeat:Infinity }}>
        <rect x="214" y="160" width="88" height="40" rx="5" fill="rgba(10,15,30,0.96)" stroke="#10b981" strokeWidth="1" />
        <text x="258" y="178" fill="#10b981" fontSize="12" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">99.9%</text>
        <text x="258" y="192" fill="#64748b" fontSize="5" fontFamily="monospace" textAnchor="middle" letterSpacing="1.4">UPTIME SLA</text>
      </motion.g>
    </svg>
  );
}

function SVGDesktop({ active }) {
  return (
    <svg viewBox="0 0 320 220" fill="none" style={{ width:"100%", height:"100%",
      filter:"drop-shadow(0 8px 24px rgba(139,92,246,0.18))" }}>
      <defs>
        <radialGradient id="dG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="200" rx="120" ry="12" fill="url(#dG)" />
      {/* shadow depth */}
      <rect x="70" y="40" width="200" height="134" rx="6" fill="rgba(139,92,246,0.08)" transform="translate(5,7)" />
      <motion.rect x="66" y="34" width="200" height="130" rx="6" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.5"
        initial={{ opacity:0, y:-18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55 }} />
      <motion.rect x="72" y="40" width="188" height="112" rx="4" fill="#060b18"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }} />
      {/* chrome bar */}
      <motion.rect x="72" y="134" width="188" height="18" rx="0 0 4 4" fill="#1e293b"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.38 }} />
      {[0,1,2].map(i => (
        <motion.rect key={i} x={80+i*20} y="138" width="12" height="10" rx="2" fill="#334155"
          initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.48+i*0.08 }} />
      ))}
      {/* terminal */}
      <motion.g initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.44 }}>
        <rect x="76" y="44" width="180" height="82" rx="3" fill="#0d1117" />
        <rect x="76" y="44" width="180" height="14" rx="3 3 0 0" fill="#1e293b" />
        {[0,1,2].map(i => (
          <circle key={i} cx={84+i*10} cy="51" r="3.5" fill={["#ef4444","#f59e0b","#22c55e"][i]} />
        ))}
        {[
          {text:"> System scan complete",  col:"#8b5cf6", y:70},
          {text:"> 0 threats detected",    col:"#22c55e", y:81},
          {text:"> Patch KB5034441 applied",col:"#94a3b8", y:92},
          {text:"> All 48 endpoints OK",   col:"#94a3b8", y:103},
          {text:"> Remote session active_",col:"#8b5cf6", y:114},
        ].map((ln,i) => (
          <motion.text key={i} x="82" y={ln.y} fill={ln.col} fontSize="6.2" fontFamily="monospace" fontWeight="700"
            initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:0.68+i*0.16, duration:0.36 }}>{ln.text}</motion.text>
        ))}
        <motion.rect x="82" y="119" width="5" height="8" fill="#8b5cf6"
          animate={{ opacity:[1,0,1] }} transition={{ duration:0.9, repeat:Infinity }} />
      </motion.g>
      {/* stand */}
      <rect x="148" y="164" width="28" height="20" rx="3" fill="#1e293b" />
      <rect x="128" y="182" width="68" height="8" rx="4" fill="#1e293b" />
      {/* orbit rings */}
      {active && [1,2].map(i => (
        <motion.ellipse key={i} cx="166" cy="99" rx={96+i*20} ry={30+i*8}
          fill="none" stroke="#8b5cf6" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="3 3"
          animate={{ rotate:360 }} transition={{ duration:10+i*4, repeat:Infinity, ease:"linear" }}
          style={{ transformOrigin:"166px 99px" }} />
      ))}
      <motion.g animate={active ? { y:[0,-5,0] } : {}} transition={{ duration:2.8, repeat:Infinity }}>
        <rect x="222" y="168" width="76" height="40" rx="5" fill="rgba(10,15,30,0.96)" stroke="#8b5cf6" strokeWidth="1" />
        <text x="260" y="186" fill="#8b5cf6" fontSize="12" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">&lt;2HR</text>
        <text x="260" y="200" fill="#64748b" fontSize="5" fontFamily="monospace" textAnchor="middle" letterSpacing="1.4">RESPONSE</text>
      </motion.g>
    </svg>
  );
}

function SVGAv({ active }) {
  return (
    <svg viewBox="0 0 320 220" fill="none" style={{ width:"100%", height:"100%",
      filter:"drop-shadow(0 8px 24px rgba(168,85,247,0.18))" }}>
      <defs>
        <radialGradient id="avG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="avEQ" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#a855f7"/>
          <stop offset="100%" stopColor="#818cf8"/>
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="200" rx="130" ry="12" fill="url(#avG)" />
      {/* monitor shadow */}
      <rect x="48" y="38" width="240" height="142" rx="9" fill="rgba(168,85,247,0.08)" transform="translate(5,7)" />
      <motion.rect x="44" y="32" width="240" height="142" rx="9" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5"
        initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.55 }} />
      <motion.rect x="54" y="42" width="220" height="120" rx="5" fill="#0a0f1a"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.28 }} />
      {/* screen bezel line */}
      <rect x="54" y="42" width="220" height="1" fill="#a855f7" fillOpacity="0.3" />
      {/* EQ bars */}
      {active && Array.from({ length:20 }, (_,i) => {
        const baseH = 10+Math.sin(i*0.72)*22;
        return (
          <motion.rect key={i} x={58+i*10} y={148-baseH} width="7" rx="2"
            fill="url(#avEQ)" fillOpacity="0.85"
            animate={{ height:[baseH, baseH*(0.5+Math.sin(i)*0.5+0.4), baseH],
                       y:[148-baseH, 148-baseH*(0.9+Math.sin(i)*0.4+0.1), 148-baseH] }}
            transition={{ duration:0.5+i*0.04, repeat:Infinity, delay:i*0.03 }} />
        );
      })}
      {/* waveform line */}
      {active && (
        <motion.path
          d="M54 95 C74 75 84 115 104 95 C124 75 134 115 154 95 C174 75 184 115 204 95 C224 75 234 115 254 95 C264 85 270 95 274 95"
          stroke="#a855f7" strokeWidth="1.2" strokeOpacity="0.5" fill="none"
          animate={{ strokeDashoffset:[0,-200] }}
          style={{ strokeDasharray:"200" }}
          transition={{ duration:2.5, repeat:Infinity, ease:"linear" }} />
      )}
      {/* speakers */}
      {[{x:20,side:"L"},{x:282,side:"R"}].map(({ x,side }) => (
        <motion.g key={side}
          animate={active ? { y:[0,-4,0] } : {}}
          transition={{ duration:3.6+(side==="R"?.5:0), repeat:Infinity, delay:side==="R"?.4:0 }}>
          <rect x={x-12} y="72" width="26" height="72" rx="4" fill="#1e293b" stroke="#a855f7" strokeWidth="0.8" />
          <circle cx={x+1} cy={92} r="9" fill="#0a0f1a" stroke="#a855f7" strokeWidth="0.7" />
          <circle cx={x+1} cy={92} r="5" fill="#a855f7" fillOpacity={active?0.7:0.3} />
          {active && <motion.circle cx={x+1} cy={92} r="5"
            fill="none" stroke="#a855f7" strokeWidth="0.8"
            animate={{ r:[5,13,5], opacity:[0.7,0,0.7] }}
            transition={{ duration:1.6, repeat:Infinity, delay:side==="R"?.4:0 }} />}
          {[0,1].map(j => (
            <circle key={j} cx={x+1} cy={116+j*12} r="4.5" fill="#0a0f1a" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.5" />
          ))}
        </motion.g>
      ))}
      {/* stand */}
      <rect x="148" y="174" width="30" height="16" rx="3" fill="#1e293b" />
      <rect x="128" y="188" width="70" height="8" rx="4" fill="#1e293b" />
      <motion.g animate={active ? { y:[0,-4,0] } : {}} transition={{ duration:2.6, repeat:Infinity }}>
        <rect x="120" y="170" width="88" height="40" rx="5" fill="rgba(10,15,30,0.96)" stroke="#a855f7" strokeWidth="1" />
        <text x="164" y="188" fill="#a855f7" fontSize="14" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">8K</text>
        <text x="164" y="202" fill="#64748b" fontSize="5" fontFamily="monospace" textAnchor="middle" letterSpacing="1.4">DISPLAY</text>
      </motion.g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const INDUSTRIES_SERVED = "Oil & Gas | Corporate | Financial | Healthcare | Utilities | Retail | Food Service";

const SERVICES_DATA = [
  { id:"website-design",   title:"Custom Websites",    headline:"Custom Websites & Digital Growth",          intro:"Engineered for speed, SEO, and user experience. We build responsive digital interfaces that convert traffic into measurable revenue.",               keyServices:["UX/UI Design Architecture","E-commerce Development","Digital Marketing Integration","Continuous Maintenance"],              Scene:SVGWebsite,  accent:"#3b82f6", tag:"WEB DEV",   stat:"99%",    industries:INDUSTRIES_SERVED },
  { id:"ai-qa",            title:"AI Search Quality",  headline:"AI Search Quality & Validation",            intro:"Validation and tuning for Large Language Models and enterprise search engines. Ensuring data accuracy and reliability in the AI era.",             keyServices:["Search Quality Evaluation","Human-in-the-Loop Validation","Healthcare AI Compliance","Dataset Accuracy Audits"],          Scene:SVGAi,       accent:"#3b82f6", tag:"AI / ML",  stat:"10×",    industries:"Healthcare | Technology | Finance | Retail | Legal" },
  { id:"structured-cabling",title:"Structured Cabling",headline:"High-Density Cabling Infrastructure",       intro:"Enterprise-grade fiber optic and copper cabling solutions engineered for maximum reliability, scalability, and 99.9% uptime.",                       keyServices:["Cat6/Cat6A & Fiber Optic","Data Center Rack Management","Network Infrastructure Design","Cable Certification & Testing"],  Scene:SVGCabling,  accent:"#06b6d4", tag:"CABLING",  stat:"100G",   industries:INDUSTRIES_SERVED },
  { id:"telecom-av",       title:"Telecom & AV",       headline:"Unified Communications & AV Integration",   intro:"Low-latency voice, video, and data synchronization. Smart-room technology and interactive display systems for modern boardrooms.",                 keyServices:["VoIP & PBX Systems","Conference Room AV","Digital Signage Solutions","Wireless Presentation Systems"],                      Scene:SVGAv,       accent:"#a855f7", tag:"AV/TELECOM",stat:"8K",    industries:INDUSTRIES_SERVED },
  { id:"cybersecurity",    title:"Cybersecurity",      headline:"Threat Protection & Zero-Trust Defense",    intro:"Hardening your perimeter with zero-trust architecture, real-time threat detection, and comprehensive penetration testing.",                         keyServices:["Endpoint & Perimeter Defense","Penetration Testing","Compliance & Risk Audits","24/7 Incident Response"],                    Scene:SVGCyber,    accent:"#ef4444", tag:"SECURITY", stat:"0-DAY",  industries:INDUSTRIES_SERVED },
  { id:"managed-it",       title:"Managed IT Support", headline:"Proactive Managed IT Operations",           intro:"Complete outsourced management of your server infrastructure. Proactive monitoring so you can focus on scaling your core business.",               keyServices:["Proactive Remote Monitoring","Patch & Asset Management","Disaster Recovery Planning","Business Continuity Strategy"],      Scene:SVGManagedIT,accent:"#10b981", tag:"IT OPS",   stat:"99.9%",  industries:INDUSTRIES_SERVED },
  { id:"desktop-support",  title:"Desktop Support",    headline:"Onsite & Remote Endpoint Support",          intro:"Rapid-response resolution across all enterprise endpoints. Dependable support keeping your workforce productive and connected.",                    keyServices:["Hardware & Software Lifecycle","Identity & Access Management","Employee Technical Training","Mobile Device Management"],   Scene:SVGDesktop,  accent:"#8b5cf6", tag:"SUPPORT",  stat:"<2HR",   industries:INDUSTRIES_SERVED },
];

/* ─────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────────── */
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
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const Services = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab]   = useState(id || SERVICES_DATA[0].id);
  const [tilt, setTilt]             = useState({ x: 0, y: 0 });
  const sectionRef  = useRef(null);
  const tabsRef     = useRef(null);
  const panelRef    = useRef(null);
  const inView      = useInView(sectionRef, { once: true, margin: "-60px" });
  const isMobile    = useWindowWidth() < 860;

  useEffect(() => {
    if (id && SERVICES_DATA.some(s => s.id === id)) setActiveTab(id);
  }, [id]);

  useEffect(() => {
    if (!tabsRef.current) return;
    const el = tabsRef.current.querySelector(".sv-tab-active");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeTab]);

  /* cursor-tracking 3D tilt on the main panel (desktop only) */
  const handlePanelMove = useCallback((e) => {
    if (isMobile || !panelRef.current) return;
    const r = panelRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 6;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 4;
    setTilt({ x, y });
  }, [isMobile]);

  const handlePanelLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

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
    <section id="services" ref={sectionRef}
      style={{ background:"#f1f3f5", fontFamily:"'Barlow',sans-serif", position:"relative", overflow:"hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Space+Mono:wght@400;700&display=swap');
        .sv * { box-sizing: border-box; }

        /* ── Type utilities ── */
        .sv-display { font-family:'Bebas Neue',sans-serif!important; letter-spacing:0.03em; }
        .sv-mono    { font-family:'Space Mono',monospace!important; }
        .sv-body    { font-family:'Barlow',sans-serif!important; }

        /* ── Dot grid ── */
        .sv-dotgrid {
          background-image: radial-gradient(circle, rgba(15,23,42,0.09) 1px, transparent 1px);
          background-size: 26px 26px;
        }

        /* ── Tab row ── */
        .sv-tabs-row {
          display:flex; flex-direction:row; flex-wrap:nowrap;
          overflow-x:auto; overflow-y:hidden;
          gap:6px; padding-bottom:4px;
          -webkit-overflow-scrolling:touch;
          scrollbar-width:none; scroll-snap-type:x mandatory;
        }
        .sv-tabs-row::-webkit-scrollbar { display:none; }

        /* ── Tab pill ── */
        .sv-tab {
          flex-shrink:0; scroll-snap-align:start;
          position:relative; cursor:pointer;
          border:1.5px solid rgba(0,0,0,0.10);
          background:#fff;
          font-family:'Space Mono',monospace;
          font-size:0.52rem; letter-spacing:0.22em; text-transform:uppercase;
          font-weight:700;
          color:rgba(15,23,42,0.42);
          padding:10px 16px 10px 13px;
          display:flex; align-items:center; gap:8px;
          transition:all 0.26s cubic-bezier(0.16,1,0.3,1);
          white-space:nowrap; overflow:hidden;
          /* depth shadow */
          box-shadow: 0 1px 2px rgba(15,23,42,0.06), 0 2px 6px rgba(15,23,42,0.04);
        }
        .sv-tab::after {
          content:''; position:absolute; inset:0;
          background:rgba(0,0,0,0.03); transform:scaleY(0);
          transform-origin:bottom; transition:transform 0.22s;
        }
        .sv-tab:hover { border-color:var(--tab-accent); color:#0f172a; transform:translateY(-2px);
          box-shadow:0 4px 16px rgba(0,0,0,0.10); }
        .sv-tab.sv-tab-active {
          background:#0f172a; border-color:#0f172a; color:#fff;
          box-shadow:0 6px 24px rgba(0,0,0,0.20), 0 2px 6px rgba(0,0,0,0.12);
          transform:translateY(-2px);
        }
        .sv-tab.sv-tab-active .sv-dot { background:var(--tab-accent)!important; }

        /* ── 3D panel wrapper ── */
        .sv-panel-3d-wrap { perspective:1400px; perspective-origin:50% 40%; }
        .sv-panel-3d {
          transform-style:preserve-3d;
          transition:transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s;
        }

        /* ── Inner content panel ── */
        .sv-panel { display:flex; flex-direction:column; }
        @media(min-width:860px){ .sv-panel { flex-direction:row; align-items:stretch; } }

        /* ── Scene col ── */
        .sv-scene-col {
          position:relative; overflow:hidden;
          background:linear-gradient(135deg,#0a0f1e 0%,#0c1222 100%);
          display:flex; align-items:center; justify-content:center;
          width:100%; min-height:240px; padding:24px;
        }
        @media(min-width:860px){
          .sv-scene-col { width:40%; flex-shrink:0; min-height:400px;
            border-right:1px solid rgba(255,255,255,0.06); }
        }

        /* ── Info col ── */
        .sv-info-col { flex:1; padding:22px 18px 26px; }
        @media(min-width:540px){ .sv-info-col { padding:28px 26px 30px; } }
        @media(min-width:860px){ .sv-info-col { padding:40px 42px 36px; } }

        /* ── Headline inside info col ── */
        .sv-svc-headline {
          font-family:'Bebas Neue',sans-serif!important;
          font-size:clamp(1.65rem,4.5vw,2.95rem);
          line-height:0.9; color:#0f172a; margin-bottom:14px; letter-spacing:0.02em;
        }

        /* ── Intro para ── */
        .sv-intro {
          font-family:'Barlow',sans-serif!important;
          font-size:clamp(0.84rem,2vw,0.95rem);
          line-height:1.78; color:#334155; font-weight:600; margin-bottom:22px;
        }

        /* ── Features grid ── */
        .sv-features-grid {
          display:grid; grid-template-columns:1fr; gap:8px; margin-bottom:24px;
        }
        @media(min-width:520px){ .sv-features-grid { grid-template-columns:repeat(2,1fr); } }

        /* ── Feature card — 3D tilt on hover ── */
        .sv-feature {
          display:flex; align-items:center; gap:12px;
          padding:13px 14px;
          border-left:2.5px solid rgba(0,0,0,0.07);
          background:#fafafa;
          border-radius:0 4px 4px 0;
          box-shadow:0 1px 3px rgba(15,23,42,0.05), 0 3px 8px rgba(15,23,42,0.03);
          transition:all 0.28s cubic-bezier(0.16,1,0.3,1);
          cursor:default;
          /* depth base */
          transform:perspective(600px) rotateY(0deg) translateZ(0);
        }
        @media(hover:hover) and (pointer:fine){
          .sv-feature:hover {
            border-left-color:var(--accent);
            background:#fff;
            transform:perspective(600px) rotateY(-3deg) translateX(6px) translateZ(8px);
            box-shadow:-4px 4px 20px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
          }
        }

        /* ── Feature label ── */
        .sv-feature-label {
          font-family:'Barlow',sans-serif!important;
          font-size:clamp(0.78rem,1.8vw,0.85rem);
          color:#0f172a; font-weight:700; line-height:1.4;
        }

        /* ── Footer row ── */
        .sv-footer-row {
          display:flex; flex-direction:column; gap:18px;
        }
        @media(min-width:580px){
          .sv-footer-row { flex-direction:row; align-items:flex-end; justify-content:space-between; }
        }

        /* ── Industry badges ── */
        .sv-industries { display:flex; flex-wrap:wrap; gap:5px; }
        .sv-ind {
          font-family:'Space Mono',monospace; font-weight:700;
          font-size:0.44rem; letter-spacing:0.16em; text-transform:uppercase;
          padding:5px 9px;
          border:1.5px solid rgba(0,0,0,0.09);
          background:#fff; color:rgba(15,23,42,0.46);
          transition:all 0.2s; white-space:nowrap;
          box-shadow:0 1px 4px rgba(0,0,0,0.04);
        }
        .sv-ind:hover { border-color:var(--accent); color:#0f172a;
          box-shadow:0 2px 8px rgba(0,0,0,0.08); transform:translateY(-1px); }

        /* ── CTA ── */
        .sv-cta {
          position:relative; overflow:hidden; cursor:pointer;
          font-family:'Space Mono',monospace; font-weight:700;
          font-size:0.56rem; letter-spacing:0.22em; text-transform:uppercase;
          padding:14px 28px;
          background:#0f172a; color:#fff; border:none;
          display:inline-flex; align-items:center; gap:10px;
          transition:transform 0.28s cubic-bezier(0.16,1,0.3,1), box-shadow 0.28s;
          width:100%; justify-content:center;
          box-shadow:0 4px 16px rgba(0,0,0,0.16), 0 1px 4px rgba(0,0,0,0.1);
          /* 3D base */
          transform:perspective(500px) translateZ(0);
        }
        @media(min-width:580px){ .sv-cta { width:auto; justify-content:flex-start; flex-shrink:0; } }
        .sv-cta::before {
          content:''; position:absolute; inset:0;
          background:rgba(255,255,255,0.12);
          transform:translateX(-102%);
          transition:transform 0.36s cubic-bezier(0.16,1,0.3,1);
        }
        @media(hover:hover) and (pointer:fine){
          .sv-cta:hover::before { transform:translateX(0); }
          .sv-cta:hover {
            transform:perspective(500px) translateY(-3px) translateZ(8px);
            box-shadow:0 14px 36px rgba(0,0,0,0.24), 0 4px 10px rgba(0,0,0,0.14);
          }
        }

        /* ── Stat badge (floating glass) ── */
        .sv-stat-badge {
          position:absolute; bottom:12px; right:12px; z-index:3;
          padding:8px 13px;
          background:rgba(8,14,28,0.92);
          border:1px solid var(--badge-accent);
          backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
          box-shadow:0 8px 32px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .sv-stat-badge::before {
          content:''; position:absolute; top:0; right:0;
          width:28px; height:28px;
          border-left:1px solid var(--badge-accent);
          border-bottom:1px solid var(--badge-accent);
          clip-path:polygon(100% 0,100% 100%,0 0);
          background:var(--badge-accent-dim);
        }

        /* ── Divider ── */
        .sv-divider { height:1px; background:rgba(0,0,0,0.06); margin-bottom:18px; }

        /* ── Index strip ── */
        .sv-index { display:none; }
        @media(min-width:480px){ .sv-index { display:flex; } }

        /* ── Section eyebrow line ── */
        .sv-eyebrow-label {
          font-family:'Space Mono',monospace!important;
          font-size:0.54rem; letter-spacing:0.4em; text-transform:uppercase;
          font-weight:700; color:#3b82f6; white-space:nowrap;
        }

        /* ── Sector label ── */
        .sv-sector-label {
          font-family:'Space Mono',monospace!important;
          font-size:0.46rem; letter-spacing:0.3em; text-transform:uppercase;
          font-weight:700; color:var(--accent); margin-bottom:8px;
        }

        /* ── Tag chip ── */
        .sv-tag-chip {
          display:flex; align-items:center; gap:8px; margin-bottom:14px;
        }
        .sv-tag-text {
          font-family:'Space Mono',monospace!important;
          font-size:0.5rem; letter-spacing:0.36em; text-transform:uppercase;
          font-weight:700; color:var(--accent);
        }

        /* reduce motion */
        @media(prefers-reduced-motion:reduce){
          .sv-tab, .sv-feature, .sv-cta { transition:none!important; transform:none!important; }
          .sv-panel-3d { transition:none!important; }
        }
      `}</style>

      <div className="sv">
        {/* dot grid */}
        <div className="sv-dotgrid" style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0 }} />

        {/* ambient accent glow */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
          background:`radial-gradient(ellipse 60% 44% at 72% 52%, ${current.accent}0e, transparent 68%)`,
          transition:"background 0.7s ease",
        }} />
        {/* secondary soft bloom bottom-left */}
        <div style={{
          position:"absolute", bottom:0, left:0, width:"40%", height:"50%",
          pointerEvents:"none", zIndex:0,
          background:`radial-gradient(ellipse 80% 80% at 0% 100%, ${current.accent}07, transparent)`,
          transition:"background 0.7s ease",
        }} />

        <div style={{ position:"relative", zIndex:1, maxWidth:1200, margin:"0 auto", padding:"72px 16px 96px" }}>

          {/* ── Eyebrow ── */}
          <motion.div
            initial={{ opacity:0, y:14 }} animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.65, ease:[0.16,1,0.3,1] }}
            style={{ display:"flex", alignItems:"center", gap:12, marginBottom:34 }}
          >
            <motion.div initial={{ scaleX:0 }} animate={inView ? { scaleX:1 } : {}}
              transition={{ duration:0.5, delay:0.1 }}
              style={{ width:24, height:3, background:"#3b82f6", transformOrigin:"left", flexShrink:0, borderRadius:2 }} />
            <span className="sv-eyebrow-label">Enterprise Solutions</span>
            <motion.div initial={{ scaleX:0 }} animate={inView ? { scaleX:1 } : {}}
              transition={{ duration:0.8, delay:0.18 }}
              style={{ flex:1, height:1, background:"linear-gradient(to right,rgba(59,130,246,0.3),transparent)", transformOrigin:"left" }} />
          </motion.div>

          {/* ── Headline ── */}
          <motion.div
            initial={{ opacity:0, y:24 }} animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.75, delay:0.1, ease:[0.16,1,0.3,1] }}
            style={{ marginBottom:34 }}
          >
            <h2 className="sv-display" style={{
              fontSize:"clamp(2.6rem,8vw,6.4rem)", lineHeight:0.88,
              color:"#0f172a", marginBottom:14, letterSpacing:"0.01em",
            }}>
              Enterprise{" "}
              <span style={{
                background:"linear-gradient(90deg,#3b82f6,#818cf8)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              }}>
                Infrastructure
              </span>
            </h2>
            <p className="sv-body" style={{
              fontSize:"clamp(0.88rem,2.2vw,1.02rem)", color:"#475569",
              fontWeight:600, maxWidth:"52ch", lineHeight:1.72,
            }}>
              Complete IT infrastructure solutions from structured cabling to cloud integration,
              serving enterprise clients nationwide.
            </p>
          </motion.div>

          {/* ── Tabs ── */}
          <motion.div
            initial={{ opacity:0, y:16 }} animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.6, delay:0.18 }}
            style={{ marginBottom:24 }}
          >
            <div className="sv-tabs-row" ref={tabsRef}>
              {SERVICES_DATA.map((svc, i) => (
                <motion.button key={svc.id}
                  className={`sv-tab ${activeTab === svc.id ? "sv-tab-active" : ""}`}
                  style={{ "--tab-accent": svc.accent }}
                  onClick={() => handleTabClick(svc.id)}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.22+i*0.06 }}
                >
                  <span className="sv-dot" style={{
                    width:6, height:6, borderRadius:"50%", flexShrink:0,
                    background: activeTab===svc.id ? svc.accent : "rgba(0,0,0,0.18)",
                    transition:"background 0.2s",
                    boxShadow: activeTab===svc.id ? `0 0 8px ${svc.accent}` : "none",
                  }} />
                  {svc.title}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ── 3D Content Panel ── */}
          <div className="sv-panel-3d-wrap">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                ref={panelRef}
                className="sv-panel-3d"
                onMouseMove={handlePanelMove}
                onMouseLeave={handlePanelLeave}
                initial={{ opacity:0, y:22, filter:"blur(6px)" }}
                animate={{
                  opacity:1, y:0, filter:"blur(0px)",
                  rotateX: tilt.y,
                  rotateY: tilt.x,
                  transformPerspective: 1400,
                }}
                exit={{ opacity:0, y:-16, filter:"blur(6px)" }}
                transition={{ duration:0.42, ease:[0.16,1,0.3,1] }}
                style={{
                  background:"#fff",
                  border:"1.5px solid rgba(0,0,0,0.07)",
                  borderRadius:6,
                  overflow:"hidden",
                  boxShadow:`0 24px 80px rgba(0,0,0,0.09), 0 6px 18px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)`,
                  "--accent": current.accent,
                }}
              >
                {/* accent top bar */}
                <div style={{
                  height:4,
                  background:`linear-gradient(to right, ${current.accent}, ${current.accent}55, transparent)`,
                }} />

                <div className="sv-panel">

                  {/* ── Scene column ── */}
                  <div className="sv-scene-col">
                    {/* radial glow */}
                    <div style={{
                      position:"absolute", inset:0, pointerEvents:"none",
                      background:`radial-gradient(ellipse 75% 65% at 50% 50%, ${current.accent}1e, transparent 70%)`,
                      transition:"background 0.55s",
                    }} />
                    {/* dot grid texture */}
                    <div style={{
                      position:"absolute", inset:0, pointerEvents:"none",
                      backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.045) 1px,transparent 1px)",
                      backgroundSize:"20px 20px",
                    }} />
                    {/* corner brace top-right */}
                    <div style={{ position:"absolute", top:10, right:10, pointerEvents:"none" }}>
                      <svg width="22" height="22" fill="none">
                        <line x1="22" y1="0" x2="22" y2="12" stroke={current.accent} strokeWidth="1.4" strokeOpacity="0.4" />
                        <line x1="10" y1="0" x2="22" y2="0" stroke={current.accent} strokeWidth="1.4" strokeOpacity="0.4" />
                      </svg>
                    </div>
                    {/* corner brace bottom-left */}
                    <div style={{ position:"absolute", bottom:10, left:10, pointerEvents:"none" }}>
                      <svg width="22" height="22" fill="none">
                        <line x1="0" y1="22" x2="0" y2="10" stroke={current.accent} strokeWidth="1.4" strokeOpacity="0.4" />
                        <line x1="0" y1="22" x2="12" y2="22" stroke={current.accent} strokeWidth="1.4" strokeOpacity="0.4" />
                      </svg>
                    </div>

                    {/* scene SVG — adds its own ambient float via internal motion */}
                    <motion.div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:290 }}
                      animate={{ y:[0,-6,0], rotateZ:[0,0.5,0] }}
                      transition={{ duration:7, repeat:Infinity, ease:"easeInOut" }}>
                      <current.Scene active={activeTab === current.id} />
                    </motion.div>

                    {/* system tag top-left */}
                    <div style={{ position:"absolute", top:12, left:14, zIndex:2 }}>
                      <span className="sv-mono" style={{
                        fontSize:"0.44rem", letterSpacing:"0.36em",
                        color:`${current.accent}65`, textTransform:"uppercase", fontWeight:700,
                      }}>
                        {current.tag}_SYS
                      </span>
                    </div>

                    {/* floating glass stat badge */}
                    <motion.div
                      className="sv-stat-badge"
                      style={{ "--badge-accent": current.accent, "--badge-accent-dim": `${current.accent}12` }}
                      animate={{ y:[0,-7,0] }}
                      transition={{ duration:3.8, repeat:Infinity, ease:"easeInOut" }}
                    >
                      <div className="sv-display" style={{
                        fontSize:"1.55rem", lineHeight:1, color:current.accent,
                        textShadow:`0 0 20px ${current.accent}55`,
                      }}>
                        {current.stat}
                      </div>
                      <div className="sv-mono" style={{
                        fontSize:"0.36rem", letterSpacing:"0.22em",
                        color:"rgba(255,255,255,0.24)", textTransform:"uppercase", fontWeight:700,
                        marginTop:2,
                      }}>
                        enterprise
                      </div>
                    </motion.div>

                    {/* scan sweep */}
                    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
                      <motion.div
                        style={{ position:"absolute", left:0, right:0, height:1,
                          background:`linear-gradient(to right, transparent, ${current.accent}26, transparent)` }}
                        animate={{ y:[-10, 420, -10] }}
                        transition={{ duration:5, repeat:Infinity, ease:"linear" }}
                      />
                    </div>
                  </div>

                  {/* ── Info column ── */}
                  <div className="sv-info-col">

                    {/* tag row */}
                    <div className="sv-tag-chip" style={{ "--accent": current.accent }}>
                      <motion.span style={{
                        width:6, height:6, borderRadius:"50%", background:current.accent, flexShrink:0,
                        boxShadow:`0 0 10px ${current.accent}`,
                        display:"block",
                      }} animate={{ scale:[1,1.5,1], opacity:[0.7,1,0.7] }}
                        transition={{ duration:2.4, repeat:Infinity }} />
                      <span className="sv-tag-text" style={{ "--accent": current.accent }}>
                        {current.tag}
                      </span>
                      <div style={{ flex:1, height:1, background:"rgba(0,0,0,0.07)" }} />
                    </div>

                    {/* headline */}
                    <h3 className="sv-svc-headline">{current.headline}</h3>

                    {/* intro */}
                    <p className="sv-intro">{current.intro}</p>

                    {/* features */}
                    <div className="sv-features-grid" style={{ "--accent": current.accent }}>
                      {current.keyServices.map((item, idx) => (
                        <motion.div key={item} className="sv-feature"
                          style={{ "--accent": current.accent }}
                          initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }}
                          transition={{ delay:idx*0.08, duration:0.38, ease:[0.16,1,0.3,1] }}
                        >
                          <div style={{
                            width:26, height:26, borderRadius:"50%", flexShrink:0,
                            background:`${current.accent}14`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                          }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke={current.accent} strokeWidth="1.8"
                                strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span className="sv-feature-label">{item}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="sv-divider" />

                    {/* footer */}
                    <div className="sv-footer-row">
                      <div style={{ flex:1, minWidth:0 }}>
                        <div className="sv-sector-label" style={{ "--accent": current.accent }}>
                          Sector_Focus
                        </div>
                        <div className="sv-industries" style={{ "--accent": current.accent }}>
                          {industries.map((ind, i) => (
                            <motion.span key={ind} className="sv-ind"
                              style={{ "--accent": current.accent }}
                              initial={{ opacity:0, scale:0.88 }} animate={{ opacity:1, scale:1 }}
                              transition={{ delay:i*0.055 }}>
                              {ind}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                      <button className="sv-cta" onClick={handleConsult}>
                        Consult an Expert
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.8"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Index strip ── */}
          <motion.div className="sv-index"
            style={{ alignItems:"center", gap:22, marginTop:26, flexWrap:"wrap" }}
            initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}}
            transition={{ delay:0.9 }}
          >
            {SERVICES_DATA.map((svc, i) => (
              <button key={svc.id} onClick={() => handleTabClick(svc.id)}
                style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 0",
                  display:"flex", alignItems:"center", gap:6,
                  opacity:activeTab===svc.id ? 1 : 0.32,
                  transition:"opacity 0.22s" }}>
                <div style={{
                  width: activeTab===svc.id ? 20 : 4, height:3,
                  background:svc.accent, borderRadius:2,
                  transition:"width 0.3s cubic-bezier(0.16,1,0.3,1)",
                  boxShadow: activeTab===svc.id ? `0 0 8px ${svc.accent}` : "none",
                }} />
                <span className="sv-mono" style={{
                  fontSize:"0.46rem", letterSpacing:"0.24em",
                  color:"#0f172a", textTransform:"uppercase", fontWeight:700,
                }}>
                  {String(i+1).padStart(2,"0")}
                </span>
              </button>
            ))}
            <span className="sv-mono" style={{
              marginLeft:"auto", fontSize:"0.44rem", letterSpacing:"0.28em",
              color:"rgba(15,23,42,0.22)", textTransform:"uppercase", fontWeight:700,
            }}>
              {String(SERVICES_DATA.findIndex(s => s.id === activeTab)+1).padStart(2,"0")}
              {" / "}
              {String(SERVICES_DATA.length).padStart(2,"0")}
            </span>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Services;