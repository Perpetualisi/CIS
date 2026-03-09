import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   SVG SCENES — one per category
───────────────────────────────────────────────────────────── */

function SVGCabling({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* Rack left */}
      <motion.rect x="8" y="10" width="44" height="140" rx="2" fill="#0f172a" stroke="#06b6d4" strokeWidth="1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} />
      {[0,1,2,3,4,5,6].map(i => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.05 }}>
          <rect x="12" y={16 + i * 18} width="36" height="10" rx="1" fill="#1e293b" />
          <motion.circle cx="17" cy={21 + i * 18} r="2.5" fill="#06b6d4"
            animate={active ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.3 }}
            transition={{ duration: 1 + i * 0.2, repeat: Infinity, delay: i * 0.15 }} />
        </motion.g>
      ))}
      {/* Cables */}
      {[20,36,52,68,84,100,116].map((y, i) => (
        <motion.path key={i}
          d={`M 52 ${y} C 80 ${y} 100 ${y + (i%2===0?12:-8)} 130 ${y + (i%2===0?6:0)}`}
          stroke={["#06b6d4","#3b82f6","#818cf8","#06b6d4","#22c55e","#3b82f6","#818cf8"][i]}
          strokeWidth="1.2" strokeOpacity="0.75"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.3 + i * 0.07, duration: 0.6 }} />
      ))}
      {/* Switch */}
      <motion.rect x="130" y="44" width="100" height="72" rx="2" fill="#0f172a" stroke="#3b82f6" strokeWidth="1"
        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} />
      <text x="180" y="72" fill="#3b82f6" fontSize="7" fontFamily="monospace" textAnchor="middle">SWITCH</text>
      {[0,1,2,3,4,5,6,7].map(i => (
        <motion.circle key={i} cx={138 + (i%4)*18} cy={i<4?84:98} r="3.5" fill="#06b6d4"
          animate={active ? { opacity:[0.3,1,0.3] } : { opacity: 0.3 }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i*0.12 }} />
      ))}
      {/* Metric */}
      <motion.g animate={active ? { y:[0,-4,0] } : {}} transition={{ duration: 3, repeat: Infinity }}>
        <rect x="188" y="8" width="60" height="28" rx="3" fill="#0f172a" stroke="#06b6d4" strokeWidth="0.8" />
        <text x="218" y="20" fill="#06b6d4" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">100G</text>
        <text x="218" y="30" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle">THROUGHPUT</text>
      </motion.g>
    </svg>
  );
}

function SVGSurveillance({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* Grid overlay */}
      {[0,1,2,3].map(i => (
        <motion.line key={`h${i}`} x1="0" y1={40*i} x2="280" y2={40*i}
          stroke="#eab308" strokeWidth="0.3" strokeOpacity="0.15"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i*0.08 }} />
      ))}
      {[0,1,2,3,4,5].map(i => (
        <motion.line key={`v${i}`} x1={56*i} y1="0" x2={56*i} y2="160"
          stroke="#eab308" strokeWidth="0.3" strokeOpacity="0.15"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i*0.05 }} />
      ))}
      {/* Camera body */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 150 }} style={{ transformOrigin: "140px 60px" }}>
        <rect x="100" y="44" width="80" height="32" rx="8" fill="#0f172a" stroke="#eab308" strokeWidth="1.2" />
        <rect x="180" y="52" width="24" height="16" rx="2" fill="#1e293b" stroke="#eab308" strokeWidth="0.8" />
        {/* Lens */}
        <motion.circle cx="118" cy="60" r="10" fill="#060b18" stroke="#eab308" strokeWidth="1"
          animate={active ? { r:[10,11,10] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <circle cx="118" cy="60" r="5" fill="#eab308" fillOpacity="0.15" />
        <motion.circle cx="118" cy="60" r="3" fill="#eab308"
          animate={active ? { opacity:[0.6,1,0.6] } : { opacity: 0.6 }}
          transition={{ duration: 1.5, repeat: Infinity }} />
      </motion.g>
      {/* FOV sweep */}
      <motion.path d="M 118 60 L 20 130 L 60 160 L 118 60" fill="#eab308" fillOpacity="0.04"
        stroke="#eab308" strokeWidth="0.5" strokeOpacity="0.2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
      {/* Scan line */}
      {active && (
        <motion.line x1="20" y1="130" x2="60" y2="160" stroke="#eab308" strokeWidth="0.8" strokeOpacity="0.5"
          style={{ transformOrigin: "118px 60px" }}
          animate={{ rotate: [-20, 20, -20] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
      )}
      {/* Detection boxes */}
      {[{ x:30, y:90, w:28, h:34 }, { x:200, y:75, w:22, h:28 }].map((b,i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i*0.2 }}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="none" stroke="#eab308" strokeWidth="0.8"
            strokeDasharray="3 2" />
          <motion.rect x={b.x} y={b.y} width={b.w} height={b.h} fill="none" stroke="#eab308" strokeWidth="1"
            animate={active ? { opacity:[0.2,0.8,0.2] } : { opacity: 0.2 }}
            transition={{ duration: 2, repeat: Infinity, delay: i*0.5 }} />
        </motion.g>
      ))}
      {/* REC badge */}
      <motion.g animate={active ? { opacity:[0.6,1,0.6] } : {}} transition={{ duration: 1.2, repeat: Infinity }}>
        <rect x="220" y="8" width="48" height="18" rx="2" fill="#0f172a" stroke="#ef4444" strokeWidth="0.8" />
        <circle cx="229" cy="17" r="3" fill="#ef4444" />
        <text x="244" y="21" fill="#ef4444" fontSize="6" fontFamily="monospace">REC</text>
      </motion.g>
      {/* Resolution */}
      <motion.g animate={active ? { y:[0,-3,0] } : {}} transition={{ duration: 2.8, repeat: Infinity }}>
        <rect x="8" y="8" width="52" height="28" rx="3" fill="#0f172a" stroke="#eab308" strokeWidth="0.8" />
        <text x="34" y="20" fill="#eab308" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">4K AI</text>
        <text x="34" y="30" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle">RESOLUTION</text>
      </motion.g>
    </svg>
  );
}

function SVGTelecom({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* Tower */}
      <motion.line x1="140" y1="10" x2="140" y2="120" stroke="#f43f5e" strokeWidth="2.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
      {[[-28,-14],[28,-14],[-44,14],[44,14],[-60,44],[60,44]].map(([ox,oy],i) => (
        <motion.line key={i} x1="140" y1={70+oy} x2={140+ox} y2={70+oy+26}
          stroke="#334155" strokeWidth="2" strokeLinecap="round"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1+i*0.07 }} />
      ))}
      {/* Antenna top */}
      <motion.circle cx="140" cy="10" r="5" fill="#f43f5e"
        animate={active ? { r:[5,7,5] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
      {/* Signal rings */}
      {active && [1,2,3,4].map(r => (
        <motion.circle key={r} cx="140" cy="80" r={r*32}
          stroke="#f43f5e" strokeWidth="0.6" fill="none"
          strokeOpacity={0.18}
          animate={{ r:[r*32, r*32+8, r*32], opacity:[0.4,0.1,0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: r*0.3 }} />
      ))}
      {/* Wave */}
      <motion.path
        d={`M 0 140 ${Array.from({length:28},(_,i)=>`L ${i*10} ${140+Math.sin(i*0.7)*14}`).join(' ')}`}
        stroke="#f43f5e" strokeWidth="1.5" fill="none" strokeOpacity="0.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.6 }} />
      {/* Metric */}
      <motion.g animate={active ? { y:[0,-4,0] } : {}} transition={{ duration: 3, repeat: Infinity }}>
        <rect x="8" y="8" width="56" height="28" rx="3" fill="#0f172a" stroke="#f43f5e" strokeWidth="0.8" />
        <text x="36" y="20" fill="#f43f5e" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">&lt;20ms</text>
        <text x="36" y="30" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle">LATENCY</text>
      </motion.g>
      {/* 9000 beacons */}
      <motion.g animate={active ? { y:[0,-3,0] } : {}} transition={{ duration: 3.4, repeat: Infinity }}>
        <rect x="210" y="8" width="62" height="28" rx="3" fill="#0f172a" stroke="#f43f5e" strokeWidth="0.8" />
        <text x="241" y="20" fill="#f43f5e" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">9,000+</text>
        <text x="241" y="30" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle">BEACONS</text>
      </motion.g>
    </svg>
  );
}

function SVGAudioVisual({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* Screen */}
      <motion.rect x="40" y="20" width="160" height="100" rx="4" fill="#0f172a" stroke="#a855f7" strokeWidth="1.2"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }} style={{ transformOrigin: "120px 70px" }} />
      {/* Content grid */}
      {[[42,22,78,48],[122,22,78,48],[42,72,78,46],[122,72,78,46]].map(([x,y,w,h],i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2+i*0.1 }}>
          <rect x={x+1} y={y+1} width={w-2} height={h-2} rx="2" fill={i===0?"#1e1040":"#0f172a"} />
          {i === 0 && (
            <>
              {[0,1,2,3,4].map(b => (
                <motion.rect key={b} x={x+6+b*13} y={y+h-12} width="10" rx="1" fill="#a855f7"
                  animate={{ height:[8,24,14,28,10][b], y:[y+h-20,y+h-36,y+h-26,y+h-40,y+h-22][b] }}
                  transition={{ duration:1.2+b*0.2, repeat:Infinity, repeatType:"reverse" }} />
              ))}
            </>
          )}
          {i !== 0 && (
            <motion.rect x={x+4} y={y+4} width={w-8} height={h-8} rx="2"
              fill={["#1e1040","#0a1628","#140b28"][i-1]}
              animate={active ? { opacity:[0.6,1,0.6] } : {}}
              transition={{ duration: 2+i*0.4, repeat: Infinity }} />
          )}
        </motion.g>
      ))}
      {/* Speaker left */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
        <rect x="8" y="40" width="26" height="80" rx="3" fill="#0f172a" stroke="#a855f7" strokeWidth="0.8" />
        <circle cx="21" cy="70" r="8" fill="#1e1040" stroke="#a855f7" strokeWidth="0.7" />
        <motion.circle cx="21" cy="70" r="4" fill="#a855f7"
          animate={active ? { r:[4,6,4], opacity:[0.7,1,0.7] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }} />
        <circle cx="21" cy="95" r="5" fill="#1e1040" stroke="#a855f7" strokeWidth="0.6" />
      </motion.g>
      {/* Speaker right */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }}>
        <rect x="206" y="40" width="26" height="80" rx="3" fill="#0f172a" stroke="#a855f7" strokeWidth="0.8" />
        <circle cx="219" cy="70" r="8" fill="#1e1040" stroke="#a855f7" strokeWidth="0.7" />
        <motion.circle cx="219" cy="70" r="4" fill="#a855f7"
          animate={active ? { r:[4,6,4], opacity:[0.7,1,0.7] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} />
        <circle cx="219" cy="95" r="5" fill="#1e1040" stroke="#a855f7" strokeWidth="0.6" />
      </motion.g>
      {/* Sound waves */}
      {active && [1,2].map(r => (
        <motion.g key={r}>
          <motion.path d={`M 21 70 Q ${21-r*12} 60 ${21-r*12} 70 Q ${21-r*12} 80 21 70`}
            stroke="#a855f7" strokeWidth="0.6" fill="none" strokeOpacity="0.5"
            animate={{ opacity:[0.3,0.7,0.3] }} transition={{ duration:1.2, repeat:Infinity, delay:r*0.3 }} />
          <motion.path d={`M 219 70 Q ${219+r*12} 60 ${219+r*12} 70 Q ${219+r*12} 80 219 70`}
            stroke="#a855f7" strokeWidth="0.6" fill="none" strokeOpacity="0.5"
            animate={{ opacity:[0.3,0.7,0.3] }} transition={{ duration:1.2, repeat:Infinity, delay:r*0.3+0.2 }} />
        </motion.g>
      ))}
      {/* Metric */}
      <motion.g animate={active ? { y:[0,-4,0] } : {}} transition={{ duration: 3, repeat: Infinity }}>
        <rect x="104" y="128" width="52" height="24" rx="3" fill="#0f172a" stroke="#a855f7" strokeWidth="0.8" />
        <text x="130" y="139" fill="#a855f7" fontSize="8" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">8K AV</text>
        <text x="130" y="147" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle">DISPLAY</text>
      </motion.g>
    </svg>
  );
}

function SVGWebDesign({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none" style={{ width: "100%", height: "100%" }}>
      <motion.rect x="10" y="10" width="260" height="140" rx="5" fill="#0f172a" stroke="#3b82f6" strokeWidth="1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} />
      {/* Browser bar */}
      <rect x="10" y="10" width="260" height="22" rx="5" fill="#1e293b" />
      {[0,1,2].map(i => (
        <motion.circle key={i} cx={22+i*12} cy={21} r="3.5"
          fill={["#ef4444","#f59e0b","#22c55e"][i]}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15+i*0.07, type:"spring" }} />
      ))}
      <motion.rect x="80" y="14" width="120" height="12" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="0.7"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.25 }} style={{ transformOrigin:"80px 20px" }} />
      <motion.text x="100" y="23" fill="#64748b" fontSize="5" fontFamily="monospace"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>conotex.com</motion.text>
      {/* Nav */}
      <motion.rect x="18" y="38" width="244" height="12" rx="1" fill="#1e293b"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
      {[0,1,2,3].map(i => (
        <motion.rect key={i} x={24+i*48} y="41" width="28" height="5" rx="1"
          fill={i===0?"#3b82f6":"#334155"}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4+i*0.06 }} style={{ transformOrigin:`${24+i*48}px 43px` }} />
      ))}
      {/* Hero */}
      <motion.rect x="18" y="56" width="140" height="56" rx="2" fill="#1e293b"
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} />
      <motion.rect x="26" y="64" width="90" height="7" rx="1" fill="#3b82f6"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.55 }} style={{ transformOrigin:"26px 67px" }} />
      {[0,1].map(i => (
        <motion.rect key={i} x="26" y={75+i*8} width={[70,52][i]} height="5" rx="1" fill="#334155"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6+i*0.05 }} style={{ transformOrigin:"26px" }} />
      ))}
      <motion.rect x="26" y="96" width="40" height="9" rx="2" fill="#3b82f6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} />
      <motion.rect x="164" y="56" width="94" height="56" rx="2" fill="#1e3a5f"
        initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} />
      {/* Code */}
      {[0,1,2,3].map(i => (
        <motion.rect key={i} x="18" y={118+i*8} width={[80,120,60,100][i]} height="5" rx="1" fill="#1e293b"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.65+i*0.05 }} style={{ transformOrigin:"18px" }} />
      ))}
      {/* Metric */}
      <motion.g animate={active ? { y:[0,-4,0] } : {}} transition={{ duration: 3, repeat: Infinity }}>
        <rect x="192" y="120" width="60" height="26" rx="3" fill="#0f172a" stroke="#3b82f6" strokeWidth="0.8" />
        <text x="222" y="132" fill="#3b82f6" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">99%</text>
        <text x="222" y="141" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle">LIGHTHOUSE</text>
      </motion.g>
      <motion.rect x="158" y="94" width="2" height="7" fill="#3b82f6"
        animate={{ opacity:[1,0,1] }} transition={{ duration: 1, repeat: Infinity }} />
    </svg>
  );
}

function SVGCybersecurity({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* Radar */}
      {[1,2,3].map(r => (
        <motion.circle key={r} cx="140" cy="80" r={r*38}
          stroke="#ef4444" strokeWidth="0.5" strokeOpacity={0.12+r*0.04} strokeDasharray="4 3"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: r*0.1, duration: 0.5 }} />
      ))}
      {active && (
        <motion.line x1="140" y1="80" x2="140" y2="10"
          stroke="#ef4444" strokeWidth="0.8" strokeOpacity="0.5"
          style={{ transformOrigin:"140px 80px" }}
          animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease:"linear" }} />
      )}
      {/* Shield */}
      <motion.path d="M140 22 L168 38 L168 70 Q168 104 140 118 Q112 104 112 70 L112 38 Z"
        fill="#0f172a" stroke="#ef4444" strokeWidth="1.8"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.25, type:"spring", stiffness: 150 }} style={{ transformOrigin:"140px 70px" }} />
      <motion.rect x="130" y="66" width="20" height="16" rx="2" fill="#ef4444"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
      <motion.path d="M133 66 Q133 58 140 58 Q147 58 147 66" stroke="#ef4444" strokeWidth="2.5"
        fill="none" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.4 }} />
      <motion.circle cx="140" cy="76" r="2.5" fill="#0f172a"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }} />
      {/* Threat dots */}
      {[{cx:48,cy:44},{cx:232,cy:52},{cx:58,cy:132},{cx:226,cy:128}].map((n,i) => (
        <motion.g key={i} initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.65+i*0.1 }}>
          <circle cx={n.cx} cy={n.cy} r="5" fill="#0f172a" stroke="#ef4444" strokeWidth="0.8" />
          {active && <motion.circle cx={n.cx} cy={n.cy} r="6" fill="none" stroke="#ef4444" strokeWidth="0.6"
            animate={{ r:[5,12,5], opacity:[0.8,0,0.8] }} transition={{ duration:2, repeat:Infinity, delay:i*0.4 }} />}
          <text x={n.cx} y={n.cy+3} fill="#ef4444" fontSize="4" fontFamily="monospace" textAnchor="middle">×</text>
        </motion.g>
      ))}
      {/* Metric */}
      <motion.g animate={active ? { y:[0,-4,0] } : {}} transition={{ duration: 3, repeat: Infinity }}>
        <rect x="8" y="8" width="60" height="28" rx="3" fill="#0f172a" stroke="#ef4444" strokeWidth="0.8" />
        <text x="38" y="20" fill="#ef4444" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">0-DAY</text>
        <text x="38" y="30" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle">RESPONSE</text>
      </motion.g>
    </svg>
  );
}

function SVGDesktopSupport({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none" style={{ width: "100%", height: "100%" }}>
      <motion.rect x="50" y="10" width="180" height="110" rx="4" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.2"
        initial={{ opacity:0, y:-14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} />
      <motion.rect x="58" y="18" width="164" height="94" rx="2" fill="#060b18"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }} />
      <motion.rect x="58" y="104" width="164" height="14" fill="#1e293b"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }} />
      {[0,1,2].map(i => (
        <motion.rect key={i} x={64+i*16} y="108" width="10" height="8" rx="1" fill="#334155"
          initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.4+i*0.07 }} />
      ))}
      {/* Terminal */}
      <motion.g initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}>
        <rect x="64" y="24" width="152" height="72" rx="2" fill="#0d1117" />
        <rect x="64" y="24" width="152" height="12" rx="2 2 0 0" fill="#1e293b" />
        {[0,1,2].map(i => <circle key={i} cx={70+i*9} cy="30" r="2.5" fill={["#ef4444","#f59e0b","#22c55e"][i]} />)}
        {[
          { t:"> System scan complete", c:"#8b5cf6", y:47 },
          { t:"> 0 threats detected",   c:"#22c55e", y:57 },
          { t:"> Patch KB5034441 OK",   c:"#94a3b8", y:67 },
          { t:"> All 48 endpoints OK",  c:"#94a3b8", y:77 },
        ].map((l,i) => (
          <motion.text key={i} x="68" y={l.y} fill={l.c} fontSize="5.5" fontFamily="monospace"
            initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:0.55+i*0.15 }}>{l.t}</motion.text>
        ))}
        <motion.rect x="68" y="82" width="4" height="6" fill="#8b5cf6"
          animate={{ opacity:[1,0,1] }} transition={{ duration:1, repeat:Infinity }} />
      </motion.g>
      {/* Stand */}
      <motion.rect x="132" y="120" width="16" height="18" rx="1" fill="#1e293b"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }} />
      <motion.rect x="116" y="136" width="48" height="7" rx="3" fill="#1e293b"
        initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.7 }} style={{ transformOrigin:"140px 139px" }} />
      {/* Metric */}
      <motion.g animate={active ? { y:[0,-4,0] } : {}} transition={{ duration:2.8, repeat:Infinity }}>
        <rect x="198" y="8" width="60" height="28" rx="3" fill="#0f172a" stroke="#8b5cf6" strokeWidth="0.8" />
        <text x="228" y="20" fill="#8b5cf6" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">&lt;2HR</text>
        <text x="228" y="30" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle">RESPONSE</text>
      </motion.g>
    </svg>
  );
}

function SVGManagedIT({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none" style={{ width: "100%", height: "100%" }}>
      {[0,1,2].map(i => (
        <motion.g key={i} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1, duration:0.5 }}>
          <rect x={16+i*60} y="30" width="44" height="100" rx="2" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
          <rect x={20+i*60} y="36" width="36" height="7" rx="1" fill="#1e293b" />
          {[0,1,2,3].map(j => (
            <motion.circle key={j} cx={24+i*60} cy={50+j*14} r="2.5" fill="#10b981"
              animate={active ? { opacity:[0.3,1,0.3] } : { opacity:0.3 }}
              transition={{ duration:0.9+j*0.1, repeat:Infinity, delay:i*0.3+j*0.18 }} />
          ))}
          <rect x={20+i*60} y="118" width="36" height="5" rx="1" fill="#1e293b" />
          <motion.rect x={20+i*60} y="118" height="5" rx="1" fill="#10b981"
            animate={{ width:[10,28,16,36,12][i] }}
            transition={{ duration:1.8+i*0.4, repeat:Infinity, repeatType:"reverse" }} />
        </motion.g>
      ))}
      {/* Dashed connector */}
      <motion.path d="M 38 80 L 140 56 L 242 80" stroke="#10b981" strokeWidth="0.7" strokeOpacity="0.4" strokeDasharray="4 3"
        initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ delay:0.4, duration:0.8 }} />
      {/* Central monitor */}
      <motion.g initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.5 }} style={{ transformOrigin:"140px 72px" }}>
        <rect x="112" y="42" width="56" height="44" rx="2" fill="#0f172a" stroke="#10b981" strokeWidth="1.2" />
        {[0,1,2,3].map(i => (
          <motion.rect key={i} x={116+i*12} y={72} width="8" rx="1" fill="#10b981"
            animate={{ height:[6,16,10,20][i], y:[72,62,66,56][i] }}
            transition={{ duration:1.4+i*0.3, repeat:Infinity, repeatType:"reverse" }} />
        ))}
        <rect x="112" y="86" width="56" height="8" fill="#1e293b" />
        <text x="140" y="93" fill="#10b981" fontSize="4.5" fontFamily="monospace" textAnchor="middle">MONITOR</text>
      </motion.g>
      {/* Metric */}
      <motion.g animate={active ? { y:[0,-4,0] } : {}} transition={{ duration:3.2, repeat:Infinity }}>
        <rect x="194" y="130" width="68" height="24" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="0.8" />
        <text x="228" y="141" fill="#10b981" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">99.9%</text>
        <text x="228" y="149" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle">UPTIME SLA</text>
      </motion.g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const PROJECT_DATA = {
  "structured-cabling": [
    { title: "MMC Marsh McLennan Agency", desc: "Network Migration & Decommission across multiple units, boosting scalability." },
    { title: "McDonald's", desc: "Delivered enterprise network migration across corporate and franchise sites." },
    { title: "East End Lofts Apartments", desc: "Full MDF/IDF build with fiber, Cat6, and coax; installed switches, routers, and CradlePoint APs." },
    { title: "Sprouts Farmers Market", desc: "Integrated CCTV, AV, and network migration for enhanced in-store operations." },
    { title: "Wal-Mart", desc: "Upgraded store networks and refreshed POS infrastructure, improving uptime." },
    { title: "Porsche (Sugar Land, TX)", desc: "MDF/IDF build with Cat6 cabling and 5-floor camera/speaker installation." },
    { title: "Texas State Prisons", desc: "High-security infrastructure for inmate tablet access involving hundreds of APs." },
  ],
  "ip-surveillance": [
    { title: "Nova Source Power", desc: "Outdoor surveillance with cameras and horn speakers for site safety." },
    { title: "Sprouts Farmers Market", desc: "Comprehensive in-store surveillance and monitoring systems." },
    { title: "Porsche (Sugar Land, TX)", desc: "5-floor surveillance integration for newly constructed dealership." },
  ],
  telecom: [
    { title: "BP – Cisco Phone Migration", desc: "Migrated enterprise telephony to Cisco UC platform for global collaboration." },
    { title: "METRO Authority", desc: "Deployed 9,000+ smart beacons for real-time bus visibility and accessibility features." },
    { title: "Palacios Prescription Shoppe", desc: "Complete upgrade with Starlink Gen 3 and Grandstream PBX unified communications." },
    { title: "O'Reilly Auto Parts", desc: "VoIP implementation across multiple locations for cost efficiency." },
  ],
  "av-solutions": [
    { title: "BP Global", desc: "Enterprise-grade Telepresence solutions for seamless global collaboration." },
    { title: "Sprouts Farmers Market", desc: "Integrated AV solutions into retail environments for customer experience." },
    { title: "Porsche Dealership", desc: "Integrated overhead and floor speaker systems synced with CCTV." },
  ],
  "website-design": [
    { title: "weareiko", desc: "A modern corporate platform designed with a focus on brand identity, seamless navigation, and optimized performance for business growth.", link: "https://weareiko.com" },
    { title: "Conotex Tech", desc: "Corporate site with responsive design and integrated client engagement features.", link: "https://www.conotextech.com/" },
    { title: "E-commerce Store", desc: "Secure checkout and scalable product management on Vercel.", link: "https://my-ecommerce-nine-iota.vercel.app/" },
  ],
  cybersecurity: [
    { title: "BP Infrastructure", desc: "Firewall policies, endpoint protection, and access controls for Oil & Gas assets." },
    { title: "Shell Energy", desc: "Security hardening, patch management, and threat monitoring across servers." },
    { title: "Morgan Stanley", desc: "Advanced network monitoring and compliance protocols for sensitive financial data." },
    { title: "Wells Fargo", desc: "System security refresh during enterprise upgrades and encryption verification." },
  ],
  "desktop-support": [
    { title: "Shell Global", desc: "Enterprise-level desktop support and network administration for 24/7 operations." },
    { title: "MD Anderson Cancer Center", desc: "Windows refresh and network migration alongside Epic deployment." },
    { title: "Memorial Hermann", desc: "Epic refresh initiative and M48 Cart maintenance for clinical efficiency." },
  ],
  "managed-it": [
    { title: "Morgan Stanley", desc: "Managed IT operations, helpdesk support, and end-user assistance for efficiency." },
    { title: "O'Reilly Auto Parts", desc: "Managed VoIP and IT helpdesk support for nationwide infrastructure." },
    { title: "East End Lofts", desc: "Full post-installation network operations management and troubleshooting." },
  ],
};

const TABS = [
  { key: "structured-cabling", label: "Cabling",       Scene: SVGCabling,       accent: "#06b6d4" },
  { key: "ip-surveillance",    label: "Surveillance",  Scene: SVGSurveillance,  accent: "#eab308" },
  { key: "telecom",            label: "Telecom",       Scene: SVGTelecom,       accent: "#f43f5e" },
  { key: "av-solutions",       label: "AV Solutions",  Scene: SVGAudioVisual,   accent: "#a855f7" },
  { key: "website-design",     label: "Websites",      Scene: SVGWebDesign,     accent: "#3b82f6" },
  { key: "cybersecurity",      label: "Cybersecurity", Scene: SVGCybersecurity, accent: "#ef4444" },
  { key: "desktop-support",    label: "Desktop",       Scene: SVGDesktopSupport,accent: "#8b5cf6" },
  { key: "managed-it",         label: "Managed IT",    Scene: SVGManagedIT,     accent: "#10b981" },
];

/* ─────────────────────────────────────────────────────────────
   PROJECT CARD
───────────────────────────────────────────────────────────── */
function ProjectCard({ project, index, accent }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16,1,0.3,1] }}
      className="pj-card"
      style={{ "--accent": accent }}
    >
      {/* Top accent line — animates in on hover via CSS */}
      <div className="pj-card-line" style={{ background: accent }} />

      {/* Index */}
      <div className="pj-index" style={{ color: accent }}>
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h3 className="pj-title">{project.title}</h3>
        <p className="pj-desc">{project.desc}</p>
      </div>

      {/* Footer */}
      <div className="pj-footer">
        {project.link ? (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="pj-link" style={{ color: accent }}>
            <span>View Live Project</span>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M3 9L9 3M9 3H4M9 3v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        ) : (
          <span className="pj-verified">
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent, display: "inline-block", marginRight: 6, flexShrink: 0 }} />
            Deployment_Verified
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────── */
const Projects = () => {
  const [activeTab, setActiveTab] = useState("structured-cabling");
  const tabsRef   = useRef(null);
  const sectionRef = useRef(null);
  const inView    = useInView(sectionRef, { once: true, margin: "-60px" });

  const current = TABS.find(t => t.key === activeTab);
  const projects = PROJECT_DATA[activeTab];

  // auto-scroll active tab into view
  useEffect(() => {
    if (!tabsRef.current) return;
    const el = tabsRef.current.querySelector(".pj-tab-active");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeTab]);

  return (
    <section id="projects" ref={sectionRef} style={{ background: "#f1f3f5", fontFamily: "'Barlow',sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .pj * { box-sizing: border-box; }
        .pj-display { font-family: 'Bebas Neue', sans-serif !important; letter-spacing: 0.03em; }
        .pj-mono    { font-family: 'Space Mono', monospace !important; }
        .pj-body    { font-family: 'Barlow', sans-serif !important; }

        /* dot grid */
        .pj-dotgrid {
          background-image: radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* ── Tab scroll row ── */
        .pj-tabs-row {
          display: flex; flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden;
          gap: 8px; padding-bottom: 4px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; scroll-snap-type: x mandatory;
        }
        .pj-tabs-row::-webkit-scrollbar { display: none; }

        /* ── Tab pill ── */
        .pj-tab {
          flex-shrink: 0; scroll-snap-align: start;
          cursor: pointer; border: 1px solid rgba(0,0,0,0.09);
          background: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 0.52rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(15,23,42,0.4); padding: 9px 14px 9px 10px;
          display: flex; align-items: center; gap: 7px;
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
          white-space: nowrap; position: relative; overflow: hidden;
        }
        .pj-tab:hover { border-color: var(--tab-accent); color: #0f172a; }
        .pj-tab.pj-tab-active {
          background: #0f172a; border-color: #0f172a; color: #fff;
          box-shadow: 0 6px 20px rgba(0,0,0,0.16);
        }
        .pj-tab.pj-tab-active .pj-tab-dot { background: var(--tab-accent) !important; }

        /* ── Main layout ── */
        .pj-main {
          display: flex; flex-direction: column; gap: 28px;
        }
        @media (min-width: 900px) {
          .pj-main { flex-direction: row; gap: 36px; align-items: flex-start; }
        }

        /* ── Scene panel ── */
        .pj-scene-panel {
          width: 100%; background: #0a0f1e;
          border: 1px solid rgba(255,255,255,0.06);
          position: relative; overflow: hidden;
          display: flex; flex-direction: column;
          min-height: 200px;
          padding: 20px;
        }
        @media (min-width: 900px) {
          .pj-scene-panel {
            width: 300px; flex-shrink: 0;
            min-height: 420px;
            position: sticky; top: 100px;
          }
        }
        @media (min-width: 1100px) {
          .pj-scene-panel { width: 340px; }
        }

        /* ── Cards grid ── */
        .pj-grid {
          flex: 1; display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 540px) {
          .pj-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 900px) {
          .pj-grid { grid-template-columns: 1fr; }
        }
        @media (min-width: 1060px) {
          .pj-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── Project card ── */
        .pj-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          padding: 22px 22px 18px;
          position: relative; overflow: hidden;
          display: flex; flex-direction: column; gap: 12px;
          cursor: default;
          transition: border-color 0.28s, box-shadow 0.28s, transform 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .pj-card:hover {
          border-color: var(--accent);
          box-shadow: 0 8px 32px rgba(0,0,0,0.08), -3px 0 0 var(--accent);
          transform: translateY(-3px);
        }
        .pj-card-line {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .pj-card:hover .pj-card-line { transform: scaleX(1); }

        .pj-index {
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem; letter-spacing: 0.3em; opacity: 0.6;
          text-transform: uppercase;
        }
        .pj-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.1rem, 2.5vw, 1.3rem);
          letter-spacing: 0.04em; color: #0f172a; line-height: 1.1;
          margin: 0;
        }
        .pj-desc {
          font-family: 'Barlow', sans-serif;
          font-size: clamp(0.78rem, 1.8vw, 0.84rem);
          color: #475569; font-weight: 400; line-height: 1.7; margin: 0;
        }
        .pj-footer {
          padding-top: 12px;
          border-top: 1px solid rgba(0,0,0,0.06);
          margin-top: auto;
        }
        .pj-link {
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem; letter-spacing: 0.22em; text-transform: uppercase;
          display: inline-flex; align-items: center; gap: 6px;
          text-decoration: none; transition: gap 0.2s;
        }
        .pj-link:hover { gap: 10px; }
        .pj-verified {
          font-family: 'Space Mono', monospace;
          font-size: 0.46rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(15,23,42,0.28);
          display: flex; align-items: center;
        }

        /* ── Divider ── */
        .pj-divider { height: 1px; background: linear-gradient(to right, transparent, rgba(0,0,0,0.09), transparent); }
      `}</style>

      <div className="pj" style={{ position: "relative" }}>
        <div className="pj-dotgrid" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} />

        {/* Ambient glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: `radial-gradient(ellipse 50% 40% at 60% 50%, ${current.accent}0c, transparent 65%)`,
          transition: "background 0.7s ease",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "80px 16px 100px" }}>

          {/* ── Eyebrow ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16,1,0.3,1] }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}
          >
            <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.55, delay: 0.1 }}
              style={{ width: 24, height: 2, background: "#3b82f6", transformOrigin: "left", flexShrink: 0 }} />
            <span className="pj-mono" style={{ fontSize: "0.52rem", letterSpacing: "0.42em", color: "#3b82f6", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              Project Portfolio
            </span>
            <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(59,130,246,0.3), transparent)", transformOrigin: "left" }} />
          </motion.div>

          {/* ── Headline ── */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16,1,0.3,1] }}
            style={{ marginBottom: 36 }}
          >
            <h2 className="pj-display" style={{ fontSize: "clamp(2.4rem,7vw,6rem)", lineHeight: 0.9, color: "#0f172a", marginBottom: 12 }}>
              Our Project{" "}
              <span style={{ background: "linear-gradient(90deg,#3b82f6,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Portfolio
              </span>
            </h2>
            <p className="pj-body" style={{ fontSize: "clamp(0.84rem,2.2vw,1rem)", color: "#475569", fontWeight: 400, maxWidth: "54ch", lineHeight: 1.7 }}>
              Strategic infrastructure deployments and technology migrations for global industry leaders.
            </p>
          </motion.div>

          {/* ── Tabs ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ marginBottom: 32 }}
          >
            <div className="pj-tabs-row" ref={tabsRef}>
              {TABS.map((t, i) => (
                <motion.button
                  key={t.key}
                  className={`pj-tab ${activeTab === t.key ? "pj-tab-active" : ""}`}
                  style={{ "--tab-accent": t.accent }}
                  onClick={() => setActiveTab(t.key)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                >
                  <span className="pj-tab-dot" style={{
                    width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                    background: activeTab === t.key ? t.accent : "rgba(0,0,0,0.17)",
                    transition: "background 0.2s",
                  }} />
                  {t.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ── Main layout ── */}
          <div className="pj-main">

            {/* ── Scene panel ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`scene-${activeTab}`}
                className="pj-scene-panel"
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.4 }}
              >
                {/* Glow */}
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 80% 65% at 50% 50%, ${current.accent}18, transparent 70%)`, transition: "background 0.5s" }} />
                {/* Dark dot grid */}
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "22px 22px" }} />

                {/* Tag */}
                <div style={{ position: "relative", zIndex: 1, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: current.accent, flexShrink: 0 }} />
                    <span className="pj-mono" style={{ fontSize: "0.46rem", letterSpacing: "0.38em", color: current.accent, textTransform: "uppercase" }}>
                      {current.label}_SYS
                    </span>
                  </div>
                </div>

                {/* SVG */}
                <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "100%", maxWidth: 280 }}>
                    <current.Scene active={true} />
                  </div>
                </div>

                {/* Project count */}
                <div style={{ position: "relative", zIndex: 1, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${current.accent}22` }}>
                  <div className="pj-mono" style={{ fontSize: "0.42rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", marginBottom: 4 }}>
                    Active Deployments
                  </div>
                  <div className="pj-display" style={{ fontSize: "2rem", lineHeight: 1, color: current.accent }}>
                    {String(projects.length).padStart(2, "0")}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ── Cards grid ── */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`grid-${activeTab}`}
                  className="pj-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {projects.map((project, index) => (
                    <ProjectCard
                      key={`${activeTab}-${index}`}
                      project={project}
                      index={index}
                      accent={current.accent}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Bottom index strip ── */}
          <motion.div
            style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 40, flexWrap: "wrap" }}
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.9 }}
          >
            {TABS.map((t, i) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 5, opacity: activeTab === t.key ? 1 : 0.3, transition: "opacity 0.2s" }}>
                <div style={{ width: activeTab === t.key ? 16 : 4, height: 3, background: t.accent, borderRadius: 2, transition: "width 0.3s cubic-bezier(0.16,1,0.3,1)" }} />
                <span className="pj-mono" style={{ fontSize: "0.42rem", letterSpacing: "0.22em", color: "#0f172a", textTransform: "uppercase" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
            <span className="pj-mono" style={{ marginLeft: "auto", fontSize: "0.42rem", letterSpacing: "0.26em", color: "rgba(15,23,42,0.2)", textTransform: "uppercase" }}>
              {String(TABS.findIndex(t => t.key === activeTab) + 1).padStart(2,"0")} / {String(TABS.length).padStart(2,"0")}
            </span>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Projects;