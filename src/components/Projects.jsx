import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   SVG SCENES — enhanced with drop-shadow depth & richer detail
───────────────────────────────────────────────────────────── */

function SVGCabling({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none"
      style={{ width:"100%", height:"100%", filter:"drop-shadow(0 8px 24px rgba(6,182,212,0.2))" }}>
      <defs>
        <radialGradient id="cGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="cBar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#3b82f6"/>
        </linearGradient>
      </defs>
      <ellipse cx="140" cy="155" rx="110" ry="10" fill="url(#cGlow)" />
      {/* patch panel shadow */}
      <rect x="14" y="14" width="44" height="140" rx="3" fill="rgba(6,182,212,0.08)" transform="translate(3,5)" />
      <motion.rect x="8" y="10" width="44" height="140" rx="3" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.2"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.4 }} />
      <rect x="10" y="12" width="40" height="8" rx="2" fill="#1e293b" />
      <text x="30" y="19" fill="#06b6d4" fontSize="4" fontFamily="monospace" textAnchor="middle" fontWeight="700" letterSpacing="0.5">PATCH</text>
      {[0,1,2,3,4,5,6].map(i => (
        <motion.g key={i} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1+i*0.05 }}>
          <rect x="12" y={24+i*17} width="36" height="10" rx="1.5" fill="#1e293b" />
          <rect x="12" y={24+i*17} width="36" height="1" fill="#06b6d4" fillOpacity="0.1" />
          <motion.circle cx="18" cy={29+i*17} r="3"
            fill={active && i%3!==2 ? "#06b6d4" : "#1e3a4f"}
            animate={active && i%3!==2 ? { opacity:[0.35,1,0.35] } : {}}
            transition={{ duration:1.1+i*0.18, repeat:Infinity, delay:i*0.14 }} />
          {active && i%3!==2 && (
            <motion.circle cx="18" cy={29+i*17} r="5" fill="none" stroke="#06b6d4" strokeWidth="0.5"
              animate={{ r:[3,7,3], opacity:[0.7,0,0.7] }}
              transition={{ duration:2, repeat:Infinity, delay:i*0.28 }} />
          )}
          <text x="32" y={31+i*17} fill="#475569" fontSize="4" fontFamily="monospace" fontWeight="700">
            {`P${String(i+1).padStart(2,"0")}`}
          </text>
        </motion.g>
      ))}
      {/* cables */}
      {[24,41,58,75,92,109,126].map((y,i) => (
        <motion.path key={i}
          d={`M 52 ${y} C 84 ${y} 102 ${y+(i%2===0?14:-9)} 134 ${y+(i%2===0?7:1)}`}
          stroke={["#06b6d4","#3b82f6","#818cf8","#06b6d4","#22c55e","#3b82f6","#818cf8"][i]}
          strokeWidth="1.4" strokeOpacity="0.78" fill="none"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }}
          transition={{ delay:0.3+i*0.07, duration:0.7, ease:"easeOut" }} />
      ))}
      {/* data pulses */}
      {active && [0,2,5].map(i => (
        <motion.circle key={`dp${i}`} r="2.5" fill="#06b6d4" fillOpacity="0.9">
          <animateMotion
            path={`M 52 ${24+i*17} C 84 ${24+i*17} 102 ${38+i*17} 134 ${31+i*17}`}
            dur={`${1.3+i*0.2}s`} begin={`${i*0.35}s`} repeatCount="indefinite" />
        </motion.circle>
      ))}
      {/* switch */}
      <motion.g initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.42, duration:0.5 }}>
        <rect x="130" y="34" width="108" height="78" rx="3" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.2" />
        <rect x="130" y="34" width="108" height="12" rx="3" fill="#1e293b" />
        <text x="184" y="43" fill="#3b82f6" fontSize="5.5" fontFamily="monospace" textAnchor="middle" fontWeight="700" letterSpacing="1">NET SWITCH</text>
        {[0,1,2,3,4,5,6,7].map(i => (
          <motion.g key={i}>
            <circle cx={140+(i%4)*20} cy={i<4?58:74} r="5.5" fill="#06b6d4" fillOpacity="0.1" stroke="#06b6d4" strokeWidth="0.7" />
            <motion.circle cx={140+(i%4)*20} cy={i<4?58:74} r="3.5" fill="#06b6d4"
              animate={active ? { opacity:[0.3,1,0.3], fillOpacity:[0.3,0.9,0.3] } : { opacity:0.3 }}
              transition={{ duration:0.9, repeat:Infinity, delay:i*0.12 }} />
          </motion.g>
        ))}
        {/* throughput bar */}
        <rect x="138" y="86" width="92" height="7" rx="2" fill="#1e293b" />
        <motion.rect x="138" y="86" height="7" rx="2" fill="url(#cBar)"
          animate={{ width:[0,92,62,92] }} transition={{ duration:3.2, repeat:Infinity }} />
        <text x="184" y="101" fill="#475569" fontSize="4.5" fontFamily="monospace" textAnchor="middle" fontWeight="700" letterSpacing="0.5">THROUGHPUT</text>
      </motion.g>
      {/* scan line */}
      <motion.rect x="8" y="0" width="230" height="1.2" fill="#06b6d4" fillOpacity="0.14"
        animate={{ y:[10,148,10] }} transition={{ duration:4, repeat:Infinity, ease:"linear" }} />
      {/* floating metric */}
      <motion.g animate={active ? { y:[0,-5,0] } : {}} transition={{ duration:3.2, repeat:Infinity, ease:"easeInOut" }}>
        <rect x="190" y="8" width="74" height="32" rx="4" fill="rgba(8,14,28,0.96)" stroke="#06b6d4" strokeWidth="1" />
        <rect x="190" y="8" width="74" height="32" rx="4" fill="#06b6d4" fillOpacity="0.04" />
        <line x1="264" y1="8" x2="242" y2="8" stroke="#06b6d4" strokeWidth="1.8" strokeOpacity="0.55" />
        <line x1="264" y1="8" x2="264" y2="20" stroke="#06b6d4" strokeWidth="1.8" strokeOpacity="0.55" />
        <text x="227" y="24" fill="#06b6d4" fontSize="11" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">100G</text>
        <text x="227" y="33" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle" letterSpacing="1.2" fontWeight="700">THROUGHPUT</text>
      </motion.g>
    </svg>
  );
}

function SVGSurveillance({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none"
      style={{ width:"100%", height:"100%", filter:"drop-shadow(0 8px 24px rgba(234,179,8,0.2))" }}>
      <defs>
        <radialGradient id="sGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#eab308" stopOpacity="0.16"/><stop offset="100%" stopColor="#eab308" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="140" cy="155" rx="110" ry="10" fill="url(#sGlow)" />
      {/* grid overlay */}
      {[0,1,2,3].map(i => (
        <motion.line key={`h${i}`} x1="0" y1={40*i} x2="280" y2={40*i}
          stroke="#eab308" strokeWidth="0.4" strokeOpacity="0.14"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.07 }} />
      ))}
      {[0,1,2,3,4,5].map(i => (
        <motion.line key={`v${i}`} x1={56*i} y1="0" x2={56*i} y2="160"
          stroke="#eab308" strokeWidth="0.4" strokeOpacity="0.14"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.05 }} />
      ))}
      {/* mount bracket */}
      <motion.rect x="126" y="4" width="28" height="10" rx="2" fill="#1e293b" stroke="#eab308" strokeWidth="0.7"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }} />
      {/* camera body */}
      <motion.g initial={{ opacity:0, scale:0.82 }} animate={{ opacity:1, scale:1 }}
        transition={{ delay:0.2, type:"spring", stiffness:150 }} style={{ transformOrigin:"140px 58px" }}>
        {/* FOV sweep */}
        <motion.path d="M 118 58 L 18 148 L 68 162 L 118 58"
          fill="#eab308" fillOpacity="0.04" stroke="#eab308" strokeWidth="0.6" strokeOpacity="0.22"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }} />
        {active && (
          <motion.line x1="18" y1="148" x2="68" y2="162" stroke="#eab308" strokeWidth="1" strokeOpacity="0.45"
            style={{ transformOrigin:"118px 58px" }}
            animate={{ rotate:[-22,22,-22] }} transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }} />
        )}
        {/* housing shadow */}
        <rect x="102" y="42" width="80" height="32" rx="8" fill="rgba(234,179,8,0.07)" transform="translate(3,4)" />
        <rect x="100" y="42" width="80" height="32" rx="8" fill="#0f172a" stroke="#eab308" strokeWidth="1.3" />
        {/* lens rings */}
        <circle cx="118" cy="58" r="13" fill="#060b18" stroke="#eab308" strokeWidth="0.8" />
        <motion.circle cx="118" cy="58" r="9" fill="#eab308" fillOpacity="0.07"
          animate={active ? { r:[9,12,9] } : {}} transition={{ duration:2.2, repeat:Infinity }} />
        <motion.circle cx="118" cy="58" r="4.5" fill="#eab308"
          animate={active ? { opacity:[0.55,1,0.55] } : { opacity:0.55 }}
          transition={{ duration:1.4, repeat:Infinity }} />
        {/* grille slots */}
        {[0,1,2].map(i => (
          <rect key={i} x={152+i*20} y="50" width="14" height="8" rx="2" fill="#1e293b" stroke="#eab308" strokeWidth="0.5" strokeOpacity="0.4" />
        ))}
        <rect x="180" y="52" width="20" height="14" rx="2" fill="#1e293b" stroke="#eab308" strokeWidth="0.7" />
      </motion.g>
      {/* detection boxes */}
      {[{x:30,y:86,w:32,h:38,c:92},{x:202,y:72,w:26,h:32,c:87}].map((b,i) => (
        <motion.g key={i} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.62+i*0.18 }}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="none"
            stroke="#eab308" strokeWidth="0.8" strokeDasharray="3 2.5" strokeOpacity="0.45" />
          <motion.rect x={b.x} y={b.y} width={b.w} height={b.h} fill="none"
            stroke="#eab308" strokeWidth="1.5" strokeOpacity="0.18"
            animate={active ? { opacity:[0.18,0.75,0.18] } : { opacity:0.18 }}
            transition={{ duration:2.4, repeat:Infinity, delay:i*0.5 }} />
          {/* corner brackets */}
          {[[0,0],[1,0],[0,1],[1,1]].map(([fx,fy]) => (
            <g key={`${fx}${fy}`}>
              <line x1={b.x+fx*b.w} y1={b.y+fy*b.h} x2={b.x+fx*b.w+(fx?-8:8)} y2={b.y+fy*b.h}
                stroke="#eab308" strokeWidth="1.8" strokeOpacity="0.85" />
              <line x1={b.x+fx*b.w} y1={b.y+fy*b.h} x2={b.x+fx*b.w} y2={b.y+fy*b.h+(fy?-8:8)}
                stroke="#eab308" strokeWidth="1.8" strokeOpacity="0.85" />
            </g>
          ))}
          <text x={b.x+2} y={b.y-4} fill="#eab308" fontSize="4" fontFamily="monospace" fontWeight="700" letterSpacing="0.5">DETECT</text>
          <text x={b.x+b.w} y={b.y-4} fill="#eab308" fontSize="4" fontFamily="monospace" fontWeight="700" textAnchor="end" fillOpacity="0.65">{b.c}%</text>
        </motion.g>
      ))}
      {/* REC badge */}
      <motion.g animate={active ? { opacity:[0.55,1,0.55] } : {}} transition={{ duration:1.3, repeat:Infinity }}>
        <rect x="218" y="8" width="50" height="20" rx="3" fill="#0f172a" stroke="#ef4444" strokeWidth="0.9" />
        <circle cx="228" cy="18" r="3.5" fill="#ef4444" />
        <text x="244" y="22" fill="#ef4444" fontSize="6" fontFamily="monospace" fontWeight="700">REC</text>
      </motion.g>
      {/* floating metric */}
      <motion.g animate={active ? { y:[0,-5,0] } : {}} transition={{ duration:2.8, repeat:Infinity, ease:"easeInOut" }}>
        <rect x="8" y="8" width="66" height="32" rx="4" fill="rgba(8,14,28,0.96)" stroke="#eab308" strokeWidth="1" />
        <text x="41" y="24" fill="#eab308" fontSize="11" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">4K AI</text>
        <text x="41" y="33" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle" letterSpacing="1.2" fontWeight="700">RESOLUTION</text>
      </motion.g>
    </svg>
  );
}

function SVGTelecom({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none"
      style={{ width:"100%", height:"100%", filter:"drop-shadow(0 8px 24px rgba(244,63,94,0.2))" }}>
      <defs>
        <radialGradient id="tGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.16"/><stop offset="100%" stopColor="#f43f5e" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="140" cy="155" rx="110" ry="10" fill="url(#tGlow)" />
      {/* tower base platform */}
      <rect x="110" y="122" width="60" height="8" rx="3" fill="#1e293b" stroke="#f43f5e" strokeWidth="0.7" />
      <rect x="120" y="118" width="40" height="6" rx="2" fill="#1e293b" />
      {/* tower shaft */}
      <motion.line x1="140" y1="14" x2="140" y2="118" stroke="#f43f5e" strokeWidth="2.8"
        strokeLinecap="round" initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:0.5 }} />
      {/* lattice struts */}
      {[[-28,-14],[28,-14],[-44,14],[44,14],[-56,42],[56,42]].map(([ox,oy],i) => (
        <motion.line key={i} x1="140" y1={72+oy} x2={140+ox} y2={72+oy+28}
          stroke="#334155" strokeWidth="1.8" strokeLinecap="round"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.12+i*0.07 }} />
      ))}
      {/* horizontal cross-members */}
      {[-14,14,42].map((oy,i) => (
        <motion.line key={i} x1={140-28+oy*(-0.3)} y1={72+oy} x2={140+28-oy*(-0.3)} y2={72+oy}
          stroke="#1e293b" strokeWidth="1.2"
          initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.3+i*0.08 }}
          style={{ transformOrigin:"140px" }} />
      ))}
      {/* antenna tip */}
      <motion.circle cx="140" cy="14" r="6" fill="#f43f5e"
        animate={active ? { r:[6,9,6] } : {}} transition={{ duration:1.6, repeat:Infinity }} />
      {active && <motion.circle cx="140" cy="14" r="6" fill="none" stroke="#f43f5e" strokeWidth="0.8"
        animate={{ r:[6,18,6], opacity:[0.7,0,0.7] }}
        transition={{ duration:1.6, repeat:Infinity }} />}
      {/* signal rings */}
      {active && [1,2,3,4].map(r => (
        <motion.circle key={r} cx="140" cy="80" r={r*28}
          stroke="#f43f5e" strokeWidth="0.7" fill="none" strokeOpacity="0.22"
          animate={{ r:[r*28, r*28+10, r*28], opacity:[0.5,0.1,0.5] }}
          transition={{ duration:2.8, repeat:Infinity, delay:r*0.32 }} />
      ))}
      {/* wave line */}
      <motion.path
        d={`M 0 142 ${Array.from({length:29},(_,i)=>`L ${i*10} ${142+Math.sin(i*0.68)*13}`).join(" ")}`}
        stroke="#f43f5e" strokeWidth="1.6" fill="none" strokeOpacity="0.5"
        initial={{ pathLength:0 }} animate={{ pathLength:1 }}
        transition={{ duration:1.3, delay:0.65 }} />
      {/* floating metrics */}
      <motion.g animate={active ? { y:[0,-5,0] } : {}} transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}>
        <rect x="8" y="8" width="66" height="32" rx="4" fill="rgba(8,14,28,0.96)" stroke="#f43f5e" strokeWidth="1" />
        <text x="41" y="24" fill="#f43f5e" fontSize="10" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">&lt;20ms</text>
        <text x="41" y="33" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle" letterSpacing="1.2" fontWeight="700">LATENCY</text>
      </motion.g>
      <motion.g animate={active ? { y:[0,-4,0] } : {}} transition={{ duration:3.5, repeat:Infinity, ease:"easeInOut", delay:0.5 }}>
        <rect x="208" y="8" width="66" height="32" rx="4" fill="rgba(8,14,28,0.96)" stroke="#f43f5e" strokeWidth="1" />
        <text x="241" y="24" fill="#f43f5e" fontSize="10" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">9,000+</text>
        <text x="241" y="33" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle" letterSpacing="1.2" fontWeight="700">BEACONS</text>
      </motion.g>
    </svg>
  );
}

function SVGAudioVisual({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none"
      style={{ width:"100%", height:"100%", filter:"drop-shadow(0 8px 24px rgba(168,85,247,0.2))" }}>
      <defs>
        <radialGradient id="avGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.18"/><stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="avEQ" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#818cf8"/>
        </linearGradient>
      </defs>
      <ellipse cx="140" cy="155" rx="110" ry="10" fill="url(#avGlow)" />
      {/* screen shadow depth */}
      <rect x="44" y="24" width="160" height="102" rx="5" fill="rgba(168,85,247,0.08)" transform="translate(4,5)" />
      <motion.rect x="40" y="20" width="160" height="102" rx="5" fill="#0f172a" stroke="#a855f7" strokeWidth="1.4"
        initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
        transition={{ duration:0.5 }} style={{ transformOrigin:"120px 71px" }} />
      {/* content quads */}
      {[[42,22,76,48],[120,22,78,48],[42,72,76,46],[120,72,78,46]].map(([x,y,w,h],i) => (
        <motion.g key={i} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.18+i*0.1 }}>
          <rect x={x+1} y={y+1} width={w-2} height={h-2} rx="2" fill={i===0?"#1a0f38":"#0f172a"} />
          {i===0 && active && Array.from({length:7},(_,b) => {
            const bh = 8+b*4;
            return (
              <motion.rect key={b} x={x+6+b*9} y={y+h-12} width="6" rx="1" fill="url(#avEQ)"
                animate={{ height:[bh, bh*(0.5+Math.sin(b)*0.5+0.4), bh],
                           y:[y+h-12-bh, y+h-12-bh*(0.9+Math.sin(b)*0.4+0.1), y+h-12-bh] }}
                transition={{ duration:0.5+b*0.06, repeat:Infinity, delay:b*0.04 }} />
            );
          })}
          {i!==0 && (
            <motion.rect x={x+4} y={y+4} width={w-8} height={h-8} rx="2"
              fill={["#1a0f38","#0a1628","#140b28"][i-1]}
              animate={active ? { opacity:[0.55,1,0.55] } : {}}
              transition={{ duration:2.2+i*0.4, repeat:Infinity }} />
          )}
        </motion.g>
      ))}
      {/* waveform */}
      {active && (
        <motion.path
          d="M40 71 C60 51 70 91 90 71 C110 51 120 91 140 71 C160 51 170 91 190 71 C210 51 215 71 200 71"
          stroke="#a855f7" strokeWidth="1.1" strokeOpacity="0.4" fill="none"
          animate={{ strokeDashoffset:[0,-160] }} style={{ strokeDasharray:"160" }}
          transition={{ duration:2.8, repeat:Infinity, ease:"linear" }} />
      )}
      {/* speakers */}
      {[{x:8,cx:21,delay:0},{x:206,cx:219,delay:0.4}].map(({ x,cx,delay },si) => (
        <motion.g key={si} initial={{ opacity:0, x:si===0?-10:10 }} animate={{ opacity:1, x:0 }}
          transition={{ delay:0.48+si*0.06 }}>
          <rect x={x} y="38" width="28" height="84" rx="3" fill="#0f172a" stroke="#a855f7" strokeWidth="0.9" />
          <circle cx={cx} cy="70" r="9.5" fill="#1a0f38" stroke="#a855f7" strokeWidth="0.8" />
          <motion.circle cx={cx} cy="70" r="5" fill="#a855f7"
            animate={active ? { r:[5,7.5,5], opacity:[0.65,1,0.65] } : {}}
            transition={{ duration:1.5, repeat:Infinity, delay }} />
          {active && <motion.circle cx={cx} cy="70" r="5" fill="none" stroke="#a855f7" strokeWidth="0.7"
            animate={{ r:[5,14,5], opacity:[0.7,0,0.7] }}
            transition={{ duration:1.5, repeat:Infinity, delay }} />}
          {[0,1].map(j => <circle key={j} cx={cx} cy={92+j*12} r="5.5" fill="#1a0f38" stroke="#a855f7" strokeWidth="0.6" strokeOpacity="0.5" />)}
        </motion.g>
      ))}
      {/* floating metric */}
      <motion.g animate={active ? { y:[0,-5,0] } : {}} transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}>
        <rect x="104" y="132" width="72" height="28" rx="4" fill="rgba(8,14,28,0.96)" stroke="#a855f7" strokeWidth="1" />
        <text x="140" y="148" fill="#a855f7" fontSize="11" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">8K AV</text>
        <text x="140" y="155" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle" letterSpacing="1.2" fontWeight="700">DISPLAY</text>
      </motion.g>
    </svg>
  );
}

function SVGWebDesign({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none"
      style={{ width:"100%", height:"100%", filter:"drop-shadow(0 8px 24px rgba(59,130,246,0.2))" }}>
      <defs>
        <radialGradient id="wGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18"/><stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="140" cy="155" rx="110" ry="10" fill="url(#wGlow)" />
      {/* shadow depth */}
      <rect x="14" y="14" width="260" height="140" rx="6" fill="rgba(59,130,246,0.08)" transform="translate(4,5)" />
      <motion.rect x="10" y="10" width="260" height="140" rx="6" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.1"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.4 }} />
      {/* chrome bar */}
      <rect x="10" y="10" width="260" height="22" rx="6" fill="#1e293b" />
      <rect x="10" y="22" width="260" height="10" fill="#1e293b" />
      {[0,1,2].map(i => (
        <motion.circle key={i} cx={22+i*12} cy={21} r="4"
          fill={["#ef4444","#f59e0b","#22c55e"][i]}
          initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.14+i*0.07, type:"spring" }} />
      ))}
      <motion.rect x="82" y="14" width="116" height="12" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="0.7"
        initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.24 }} style={{ transformOrigin:"82px 20px" }} />
      <motion.text x="102" y="23" fill="#64748b" fontSize="5.5" fontFamily="monospace" fontWeight="700"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}>conotextech.com</motion.text>
      {/* nav */}
      <motion.rect x="16" y="38" width="248" height="12" rx="1.5" fill="#1e293b"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }} />
      {[0,1,2,3].map(i => (
        <motion.rect key={i} x={22+i*48} y="41" width="28" height="5" rx="1"
          fill={i===0?"#3b82f6":"#334155"}
          initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.38+i*0.06 }}
          style={{ transformOrigin:`${22+i*48}px 43px` }} />
      ))}
      {/* hero section */}
      <motion.rect x="16" y="56" width="144" height="60" rx="2" fill="#1e293b"
        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.44 }} />
      <motion.rect x="24" y="64" width="96" height="8" rx="2" fill="#3b82f6"
        initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.54 }} style={{ transformOrigin:"24px 68px" }} />
      {[0,1].map(i => (
        <motion.rect key={i} x="24" y={76+i*8} width={[74,56][i]} height="5" rx="1" fill="#334155"
          initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.6+i*0.05 }} style={{ transformOrigin:"24px" }} />
      ))}
      <motion.rect x="24" y="98" width="44" height="10" rx="2" fill="#3b82f6"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.72 }} />
      {/* image block */}
      <motion.rect x="166" y="56" width="94" height="60" rx="2" fill="#1e3a5f"
        initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5 }} />
      <motion.rect x="166" y="56" width="94" height="60" rx="2" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.4" />
      {[0,1,2].map(i => <line key={i} x1="166" y1={70+i*14} x2="260" y2={70+i*14} stroke="#3b82f6" strokeWidth="0.3" strokeOpacity="0.2" />)}
      {/* content rows */}
      {[0,1,2,3].map(i => (
        <motion.rect key={i} x="16" y={124+i*7} width={[84,128,64,106][i]} height="5" rx="1" fill="#1e293b"
          initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.65+i*0.05 }} style={{ transformOrigin:"16px" }} />
      ))}
      {/* scan line */}
      <motion.rect x="10" y="0" width="260" height="1.2" fill="#3b82f6" fillOpacity="0.14"
        animate={{ y:[10,148,10] }} transition={{ duration:4.5, repeat:Infinity, ease:"linear" }} />
      {/* metric */}
      <motion.g animate={active ? { y:[0,-5,0] } : {}} transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}>
        <rect x="186" y="120" width="72" height="32" rx="4" fill="rgba(8,14,28,0.96)" stroke="#3b82f6" strokeWidth="1" />
        <text x="222" y="136" fill="#3b82f6" fontSize="11" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">99%</text>
        <text x="222" y="145" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle" letterSpacing="1.2" fontWeight="700">LIGHTHOUSE</text>
      </motion.g>
      <motion.rect x="156" y="100" width="2" height="8" fill="#3b82f6"
        animate={{ opacity:[1,0,1] }} transition={{ duration:0.9, repeat:Infinity }} />
    </svg>
  );
}

function SVGCybersecurity({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none"
      style={{ width:"100%", height:"100%", filter:"drop-shadow(0 8px 24px rgba(239,68,68,0.2))" }}>
      <defs>
        <radialGradient id="cyGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.16"/><stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="140" cy="155" rx="110" ry="10" fill="url(#cyGlow)" />
      {/* radar rings */}
      {[1,2,3,4].map(r => (
        <motion.circle key={r} cx="140" cy="80" r={r*34}
          stroke="#ef4444" strokeWidth="0.55" strokeOpacity={0.1+r*0.04} strokeDasharray="4 3"
          initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
          transition={{ delay:r*0.09, duration:0.6 }} />
      ))}
      <line x1="140" y1="14" x2="140" y2="146" stroke="#ef4444" strokeWidth="0.3" strokeOpacity="0.1" />
      <line x1="36" y1="80" x2="244" y2="80" stroke="#ef4444" strokeWidth="0.3" strokeOpacity="0.1" />
      {/* sweep */}
      {active && (
        <motion.g style={{ transformOrigin:"140px 80px" }}
          animate={{ rotate:360 }} transition={{ duration:4, repeat:Infinity, ease:"linear" }}>
          <line x1="140" y1="80" x2="140" y2="14" stroke="#ef4444" strokeWidth="1.2" strokeOpacity="0.65" />
          <path d="M140 80 L140 14 A66 66 0 0 1 158 16 Z" fill="#ef4444" fillOpacity="0.08" />
        </motion.g>
      )}
      {/* shield shadow */}
      <path d="M148 28 L180 46 L180 90 Q180 130 148 148 Q116 130 116 90 L116 46 Z"
        fill="#ef4444" fillOpacity="0.05" transform="translate(5,6)" />
      {/* shield body */}
      <motion.path d="M140 22 L172 40 L172 84 Q172 124 140 142 Q108 124 108 84 L108 40 Z"
        fill="#0f172a" stroke="#ef4444" strokeWidth="2"
        initial={{ scale:0 }} animate={{ scale:1 }}
        transition={{ delay:0.26, type:"spring", stiffness:140 }} style={{ transformOrigin:"140px 82px" }} />
      <path d="M140 36 L162 50 L162 82 Q162 114 140 128 Q118 114 118 82 L118 50 Z"
        fill="#ef4444" fillOpacity="0.055" />
      {/* lock */}
      <motion.rect x="128" y="74" width="24" height="18" rx="3" fill="#ef4444"
        initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }} />
      <motion.path d="M132 74 Q132 63 140 63 Q148 63 148 74"
        stroke="#ef4444" strokeWidth="2.8" fill="none" strokeLinecap="round"
        initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ delay:0.62, duration:0.45 }} />
      <circle cx="140" cy="84" r="3.5" fill="#0f172a" />
      <rect x="138.5" y="84" width="3" height="5.5" rx="1" fill="#0f172a" />
      {/* shield pulse */}
      {active && (
        <motion.path d="M140 22 L172 40 L172 84 Q172 124 140 142 Q108 124 108 84 L108 40 Z"
          fill="none" stroke="#ef4444" strokeWidth="1.4" strokeOpacity="0.3"
          animate={{ strokeOpacity:[0.18,0.75,0.18] }} transition={{ duration:2.2, repeat:Infinity }} />
      )}
      {/* threat dots */}
      {[{cx:46,cy:42},{cx:234,cy:50},{cx:56,cy:132},{cx:226,cy:128}].map((n,i) => (
        <motion.g key={i} initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }}
          transition={{ delay:0.68+i*0.1 }}>
          {active && <motion.circle cx={n.cx} cy={n.cy} r="6" fill="none" stroke="#ef4444" strokeWidth="0.7"
            animate={{ r:[6,14,6], opacity:[0.8,0,0.8] }}
            transition={{ duration:2.2, repeat:Infinity, delay:i*0.45 }} />}
          <circle cx={n.cx} cy={n.cy} r="5.5" fill="#0f172a" stroke="#ef4444" strokeWidth="1" />
          {active && <motion.circle r="2" fill="#ef4444" fillOpacity="0">
            <animateMotion path={`M ${n.cx} ${n.cy} L 140 88`}
              dur={`${1.9+i*0.15}s`} begin={`${i*0.42}s`} repeatCount="indefinite" calcMode="linear" />
            <animate attributeName="fill-opacity" values="0;0.85;0" dur={`${1.9+i*0.15}s`} begin={`${i*0.42}s`} repeatCount="indefinite" />
          </motion.circle>}
          <text x={n.cx} y={n.cy+3.5} fill="#ef4444" fontSize="5.5" fontFamily="monospace" textAnchor="middle">×</text>
          <line x1={n.cx} y1={n.cy} x2="140" y2="84" stroke="#ef4444" strokeWidth="0.5"
            strokeOpacity="0.18" strokeDasharray="4 3" />
        </motion.g>
      ))}
      {/* metric */}
      <motion.g animate={active ? { y:[0,-5,0] } : {}} transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}>
        <rect x="8" y="8" width="72" height="32" rx="4" fill="rgba(8,14,28,0.96)" stroke="#ef4444" strokeWidth="1" />
        <text x="44" y="24" fill="#ef4444" fontSize="11" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">0-DAY</text>
        <text x="44" y="33" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle" letterSpacing="1.2" fontWeight="700">RESPONSE</text>
      </motion.g>
    </svg>
  );
}

function SVGDesktopSupport({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none"
      style={{ width:"100%", height:"100%", filter:"drop-shadow(0 8px 24px rgba(139,92,246,0.2))" }}>
      <defs>
        <radialGradient id="dGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.18"/><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="140" cy="155" rx="110" ry="10" fill="url(#dGlow)" />
      {/* monitor shadow */}
      <rect x="54" y="14" width="180" height="112" rx="5" fill="rgba(139,92,246,0.07)" transform="translate(4,5)" />
      <motion.rect x="50" y="10" width="180" height="112" rx="5" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.3"
        initial={{ opacity:0, y:-14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} />
      <motion.rect x="58" y="18" width="164" height="96" rx="3" fill="#060b18"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.22 }} />
      <motion.rect x="58" y="106" width="164" height="12" rx="0 0 3 3" fill="#1e293b"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.34 }} />
      {[0,1,2].map(i => (
        <motion.rect key={i} x={64+i*16} y="108" width="10" height="8" rx="1.5" fill="#334155"
          initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.44+i*0.07 }} />
      ))}
      {/* terminal */}
      <motion.g initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.38 }}>
        <rect x="64" y="24" width="152" height="74" rx="2.5" fill="#0d1117" />
        <rect x="64" y="24" width="152" height="13" rx="2.5 2.5 0 0" fill="#1e293b" />
        {[0,1,2].map(i => <circle key={i} cx={70+i*10} cy="30.5" r="3" fill={["#ef4444","#f59e0b","#22c55e"][i]} />)}
        {[
          {t:"> System scan complete",  c:"#8b5cf6", y:48},
          {t:"> 0 threats detected",    c:"#22c55e", y:59},
          {t:"> Patch KB5034441 OK",    c:"#94a3b8", y:70},
          {t:"> All 48 endpoints OK",   c:"#94a3b8", y:81},
          {t:"> Remote session active_",c:"#8b5cf6", y:92},
        ].map((l,i) => (
          <motion.text key={i} x="68" y={l.y} fill={l.c} fontSize="5.8" fontFamily="monospace" fontWeight="700"
            initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:0.56+i*0.14, duration:0.34 }}>{l.t}</motion.text>
        ))}
        <motion.rect x="68" y="96" width="4.5" height="7" fill="#8b5cf6"
          animate={{ opacity:[1,0,1] }} transition={{ duration:0.9, repeat:Infinity }} />
      </motion.g>
      {/* stand */}
      <rect x="130" y="122" width="20" height="16" rx="2" fill="#1e293b" />
      <rect x="112" y="136" width="56" height="7" rx="3.5" fill="#1e293b" />
      {/* orbit rings */}
      {active && [1,2].map(i => (
        <motion.ellipse key={i} cx="140" cy="62" rx={88+i*18} ry={26+i*7}
          fill="none" stroke="#8b5cf6" strokeWidth="0.5" strokeOpacity="0.18" strokeDasharray="3 3"
          animate={{ rotate:360 }} transition={{ duration:9+i*4, repeat:Infinity, ease:"linear" }}
          style={{ transformOrigin:"140px 62px" }} />
      ))}
      {/* metric */}
      <motion.g animate={active ? { y:[0,-5,0] } : {}} transition={{ duration:2.8, repeat:Infinity, ease:"easeInOut" }}>
        <rect x="194" y="8" width="72" height="32" rx="4" fill="rgba(8,14,28,0.96)" stroke="#8b5cf6" strokeWidth="1" />
        <text x="230" y="24" fill="#8b5cf6" fontSize="11" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">&lt;2HR</text>
        <text x="230" y="33" fill="#475569" fontSize="4" fontFamily="monospace" textAnchor="middle" letterSpacing="1.2" fontWeight="700">RESPONSE</text>
      </motion.g>
    </svg>
  );
}

function SVGManagedIT({ active }) {
  return (
    <svg viewBox="0 0 280 160" fill="none"
      style={{ width:"100%", height:"100%", filter:"drop-shadow(0 8px 24px rgba(16,185,129,0.2))" }}>
      <defs>
        <radialGradient id="mGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.16"/><stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="140" cy="155" rx="110" ry="10" fill="url(#mGlow)" />
      {[0,1,2].map(i => (
        <motion.g key={i} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.11, duration:0.5 }}>
          <rect x={16+i*60} y="28" width="50" height="106" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="1.1" />
          <rect x={20+i*60} y="33" width="42" height="8" rx="2" fill="#1e293b" />
          <text x={41+i*60} y="40" fill="#10b981" fontSize="4.5" fontFamily="monospace" fontWeight="700" textAnchor="middle" letterSpacing="0.4">
            {`RACK ${String(i+1).padStart(2,"0")}`}
          </text>
          {[0,1,2,3,4].map(j => (
            <motion.g key={j}>
              <rect x={20+i*60} y={46+j*14} width="42" height="9" rx="1.5" fill="#0d1929" />
              <circle cx={26+i*60} cy={50.5+j*14} r="3" fill={active?"#10b981":"#1e3a2e"} />
              {active && (
                <motion.circle cx={26+i*60} cy={50.5+j*14} r="5" fill="none" stroke="#10b981" strokeWidth="0.5"
                  animate={{ r:[3,7,3], opacity:[0.7,0,0.7] }}
                  transition={{ duration:1.8, repeat:Infinity, delay:i*0.22+j*0.17 }} />
              )}
              <rect x={32+i*60} y={48+j*14} width="26" height="5" rx="1.5" fill="#1e293b" />
              <motion.rect x={32+i*60} y={48+j*14} height="5" rx="1.5" fill="#10b981" fillOpacity="0.75"
                animate={{ width:[6,24,14,26,10][j%5] }}
                transition={{ duration:1.8+j*0.28, repeat:Infinity, repeatType:"reverse" }} />
            </motion.g>
          ))}
          <rect x={20+i*60} y="120" width="42" height="6" rx="2" fill="#1e293b" />
          <motion.rect x={20+i*60} y="120" height="6" rx="2" fill="#10b981"
            animate={{ width:[14,38,22][i] }}
            transition={{ duration:2+i*0.4, repeat:Infinity, repeatType:"reverse" }} />
        </motion.g>
      ))}
      {/* connector arc */}
      <motion.path d="M 41 82 Q 140 54 239 82"
        stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="5 4" fill="none"
        initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ delay:0.46, duration:0.9 }} />
      {active && [0,1,2].map(i => (
        <motion.circle key={i} r="2.5" fill="#10b981" fillOpacity="0">
          <animateMotion path="M 41 82 Q 140 54 239 82"
            dur={`${2.2+i*0.3}s`} begin={`${i*0.65}s`} repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0;0.9;0" dur={`${2.2+i*0.3}s`} begin={`${i*0.65}s`} repeatCount="indefinite" />
        </motion.circle>
      ))}
      {/* central monitor */}
      <motion.g initial={{ opacity:0, scale:0.82 }} animate={{ opacity:1, scale:1 }}
        transition={{ delay:0.55 }} style={{ transformOrigin:"140px 72px" }}>
        <rect x="112" y="40" width="56" height="52" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="1.3" />
        <rect x="112" y="40" width="56" height="11" rx="3" fill="#1e3a2e" />
        <text x="140" y="49" fill="#10b981" fontSize="4.5" fontFamily="monospace" fontWeight="700" textAnchor="middle" letterSpacing="0.5">MONITOR</text>
        {[0,1,2,3,4].map(i => (
          <motion.rect key={i} x={118+i*9} y={66} width="7" rx="1.5" fill="#10b981" fillOpacity="0.85"
            animate={{ height:[7,20,12,24,9][i], y:[66,53,60,48,63][i] }}
            transition={{ duration:1.4+i*0.28, repeat:Infinity, repeatType:"reverse" }} />
        ))}
        <rect x="112" y="84" width="56" height="8" rx="0 0 3 3" fill="#1e3a2e" />
      </motion.g>
      {/* metric */}
      <motion.g animate={active ? { y:[0,-5,0] } : {}} transition={{ duration:3.2, repeat:Infinity, ease:"easeInOut" }}>
        <rect x="192" y="132" width="80" height="20" rx="4" fill="rgba(8,14,28,0.96)" stroke="#10b981" strokeWidth="1" />
        <text x="232" y="145" fill="#10b981" fontSize="9" fontFamily="'Bebas Neue',sans-serif" textAnchor="middle">99.9% UPTIME</text>
      </motion.g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const PROJECT_DATA = {
  "structured-cabling": [
    { title:"MMC Marsh McLennan Agency", desc:"Network migration & decommission across multiple units, boosting scalability and future-proofing enterprise infrastructure." },
    { title:"McDonald's", desc:"Enterprise network migration across corporate and franchise sites, delivered on tight operational timelines." },
    { title:"East End Lofts Apartments", desc:"Full MDF/IDF build with fiber, Cat6, and coax. Installed switches, routers, and CradlePoint APs throughout." },
    { title:"Sprouts Farmers Market", desc:"Integrated CCTV, AV, and network migration for enhanced in-store operations and real-time visibility." },
    { title:"Wal-Mart", desc:"Upgraded store networks and refreshed POS infrastructure, improving uptime across multiple retail locations." },
    { title:"Porsche (Sugar Land, TX)", desc:"MDF/IDF build with Cat6 cabling and 5-floor camera and speaker installation for a newly built dealership." },
    { title:"Texas State Prisons", desc:"High-security infrastructure for inmate tablet access, involving deployment of hundreds of access points." },
  ],
  "ip-surveillance": [
    { title:"Nova Source Power", desc:"Outdoor surveillance with cameras and horn speakers, ensuring comprehensive site safety for power infrastructure." },
    { title:"Sprouts Farmers Market", desc:"Comprehensive in-store surveillance and monitoring systems integrated with existing retail technology." },
    { title:"Porsche (Sugar Land, TX)", desc:"5-floor surveillance integration for newly constructed dealership, featuring 4K AI-assisted detection." },
  ],
  "telecom": [
    { title:"BP – Cisco Phone Migration", desc:"Migrated enterprise telephony to Cisco UC platform for seamless global collaboration across business units." },
    { title:"METRO Authority", desc:"Deployed 9,000+ smart beacons for real-time bus visibility and accessibility features across the transit network." },
    { title:"Palacios Prescription Shoppe", desc:"Complete upgrade with Starlink Gen 3 and Grandstream PBX for unified communications at the pharmacy." },
    { title:"O'Reilly Auto Parts", desc:"VoIP implementation across multiple locations, delivering significant cost efficiency and improved call quality." },
  ],
  "av-solutions": [
    { title:"BP Global", desc:"Enterprise-grade Telepresence solutions enabling seamless global collaboration across international offices." },
    { title:"Sprouts Farmers Market", desc:"Integrated AV solutions into retail environments, enhancing customer experience and in-store communications." },
    { title:"Porsche Dealership", desc:"Integrated overhead and floor speaker systems synced with CCTV for a premium showroom experience." },
  ],
  "website-design": [
    { title:"weareiko", desc:"A modern corporate platform designed with a focus on brand identity, seamless navigation, and optimized conversion.", link:"https://weareiko.com" },
    { title:"Conotex Tech", desc:"Corporate site with responsive design and integrated client engagement features built for enterprise reach.", link:"https://www.conotextech.com/" },
    { title:"E-commerce Store", desc:"Secure checkout and scalable product management deployed on Vercel for high-performance retail.", link:"https://my-ecommerce-nine-iota.vercel.app/" },
  ],
  "cybersecurity": [
    { title:"BP Infrastructure", desc:"Firewall policies, endpoint protection, and access controls hardening Oil & Gas critical infrastructure." },
    { title:"Shell Energy", desc:"Security hardening, patch management, and 24/7 threat monitoring across distributed server environments." },
    { title:"Morgan Stanley", desc:"Advanced network monitoring and compliance protocols protecting sensitive financial data and systems." },
    { title:"Wells Fargo", desc:"System security refresh during enterprise upgrades alongside encryption verification and access audits." },
  ],
  "desktop-support": [
    { title:"Shell Global", desc:"Enterprise-level desktop support and network administration for 24/7 oil and gas operations worldwide." },
    { title:"MD Anderson Cancer Center", desc:"Windows refresh and network migration coordinated alongside Epic deployment for clinical continuity." },
    { title:"Memorial Hermann", desc:"Epic refresh initiative and M48 Cart maintenance for optimized clinical workflow and staff efficiency." },
  ],
  "managed-it": [
    { title:"Morgan Stanley", desc:"Managed IT operations, helpdesk support, and end-user assistance keeping financial operations running at peak." },
    { title:"O'Reilly Auto Parts", desc:"Managed VoIP and IT helpdesk support ensuring reliable infrastructure across nationwide retail locations." },
    { title:"East End Lofts", desc:"Full post-installation network operations management and proactive troubleshooting for residential complex." },
  ],
};

const TABS = [
  { key:"structured-cabling", label:"Cabling",       Scene:SVGCabling,       accent:"#06b6d4" },
  { key:"ip-surveillance",    label:"Surveillance",  Scene:SVGSurveillance,  accent:"#eab308" },
  { key:"telecom",            label:"Telecom",       Scene:SVGTelecom,       accent:"#f43f5e" },
  { key:"av-solutions",       label:"AV Solutions",  Scene:SVGAudioVisual,   accent:"#a855f7" },
  { key:"website-design",     label:"Websites",      Scene:SVGWebDesign,     accent:"#3b82f6" },
  { key:"cybersecurity",      label:"Cybersecurity", Scene:SVGCybersecurity, accent:"#ef4444" },
  { key:"desktop-support",    label:"Desktop",       Scene:SVGDesktopSupport,accent:"#8b5cf6" },
  { key:"managed-it",         label:"Managed IT",    Scene:SVGManagedIT,     accent:"#10b981" },
];

/* ─────────────────────────────────────────────────────────────
   PROJECT CARD — 3D tilt + depth layer
───────────────────────────────────────────────────────────── */
function ProjectCard({ project, index, accent }) {
  const ref    = useRef(null);
  const cardRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMove = useCallback((e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 7;
    setTilt({ rx: -y, ry: x });
  }, []);

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:28, filter:"blur(4px)" }}
      animate={inView ? { opacity:1, y:0, filter:"blur(0px)" } : {}}
      transition={{ duration:0.55, delay:index*0.07, ease:[0.16,1,0.3,1] }}
      style={{ perspective:700 }}>
      <motion.div
        ref={cardRef}
        className="pj-card"
        style={{ "--accent": accent,
          transform:`perspective(700px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)` }}
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ rx:0, ry:0 })}
        transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
      >
        {/* top accent line */}
        <div className="pj-card-line" style={{ background: accent }} />
        {/* depth layer behind card */}
        <div className="pj-card-depth" style={{ boxShadow:`3px 5px 0 ${accent}22` }} />

        <div className="pj-index" style={{ color: accent }}>
          {String(index+1).padStart(2,"0")}
        </div>

        <div style={{ flex:1 }}>
          <h3 className="pj-title">{project.title}</h3>
          <p className="pj-desc">{project.desc}</p>
        </div>

        <div className="pj-footer">
          {project.link ? (
            <a href={project.link} target="_blank" rel="noopener noreferrer"
              className="pj-link" style={{ color: accent }}>
              <span>View Live Project</span>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M3 9L9 3M9 3H4M9 3v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          ) : (
            <span className="pj-verified">
              <motion.span style={{ width:5, height:5, borderRadius:"50%", background:accent,
                display:"inline-block", marginRight:6, flexShrink:0,
                boxShadow:`0 0 8px ${accent}` }}
                animate={{ scale:[1,1.5,1], opacity:[0.6,1,0.6] }}
                transition={{ duration:2.4, repeat:Infinity }} />
              Deployment_Verified
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────── */
const Projects = () => {
  const [activeTab, setActiveTab] = useState("structured-cabling");
  const [sceneTilt, setSceneTilt] = useState({ rx:0, ry:0 });
  const tabsRef    = useRef(null);
  const sectionRef = useRef(null);
  const scenePanelRef = useRef(null);
  const inView     = useInView(sectionRef, { once:true, margin:"-60px" });

  const current  = TABS.find(t => t.key === activeTab);
  const projects = PROJECT_DATA[activeTab];

  useEffect(() => {
    if (!tabsRef.current) return;
    const el = tabsRef.current.querySelector(".pj-tab-active");
    if (el) el.scrollIntoView({ behavior:"smooth", block:"nearest", inline:"center" });
  }, [activeTab]);

  const handleSceneMove = useCallback((e) => {
    if (!scenePanelRef.current) return;
    const r = scenePanelRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 7;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 5;
    setSceneTilt({ rx: -y, ry: x });
  }, []);

  return (
    <section id="projects" ref={sectionRef}
      style={{ background:"#f1f3f5", fontFamily:"'Barlow',sans-serif", position:"relative", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Space+Mono:wght@400;700&display=swap');

        .pj * { box-sizing: border-box; }
        .pj-display { font-family:'Bebas Neue',sans-serif!important; letter-spacing:0.03em; }
        .pj-mono    { font-family:'Space Mono',monospace!important; }
        .pj-body    { font-family:'Barlow',sans-serif!important; }

        .pj-dotgrid {
          background-image: radial-gradient(circle, rgba(15,23,42,0.085) 1px, transparent 1px);
          background-size: 26px 26px;
        }

        /* ── Tab row ── */
        .pj-tabs-row {
          display:flex; flex-wrap:nowrap; overflow-x:auto; overflow-y:hidden;
          gap:7px; padding-bottom:4px;
          -webkit-overflow-scrolling:touch; scrollbar-width:none; scroll-snap-type:x mandatory;
        }
        .pj-tabs-row::-webkit-scrollbar { display:none; }

        /* ── Tab pill ── */
        .pj-tab {
          flex-shrink:0; scroll-snap-align:start; cursor:pointer;
          border:1.5px solid rgba(0,0,0,0.10); background:#fff;
          font-family:'Space Mono',monospace; font-weight:700;
          font-size:0.52rem; letter-spacing:0.2em; text-transform:uppercase;
          color:rgba(15,23,42,0.4); padding:10px 16px 10px 12px;
          display:flex; align-items:center; gap:7px;
          transition:all 0.26s cubic-bezier(0.16,1,0.3,1); white-space:nowrap;
          box-shadow:0 1px 3px rgba(15,23,42,0.06), 0 2px 6px rgba(15,23,42,0.04);
        }
        .pj-tab:hover { border-color:var(--tab-accent); color:#0f172a; transform:translateY(-2px);
          box-shadow:0 4px 16px rgba(0,0,0,0.10); }
        .pj-tab.pj-tab-active {
          background:#0f172a; border-color:#0f172a; color:#fff; transform:translateY(-2px);
          box-shadow:0 6px 24px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.12);
        }
        .pj-tab.pj-tab-active .pj-tab-dot { background:var(--tab-accent)!important;
          box-shadow:0 0 8px var(--tab-accent); }

        /* ── Main layout ── */
        .pj-main {
          display:flex; flex-direction:column; gap:26px;
        }
        @media(min-width:900px){ .pj-main { flex-direction:row; gap:36px; align-items:flex-start; } }

        /* ── Scene panel ── */
        .pj-scene-panel {
          width:100%; background:linear-gradient(135deg,#0a0f1e,#0c1222);
          border:1.5px solid rgba(255,255,255,0.06);
          position:relative; overflow:hidden;
          display:flex; flex-direction:column; min-height:220px; padding:20px;
          transform-style:preserve-3d;
          transition:transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s;
        }
        @media(min-width:900px){
          .pj-scene-panel { width:300px; flex-shrink:0; min-height:440px; position:sticky; top:90px; }
        }
        @media(min-width:1100px){ .pj-scene-panel { width:340px; } }

        /* ── Cards grid ── */
        .pj-grid { flex:1; display:grid; grid-template-columns:1fr; gap:12px; }
        @media(min-width:520px){ .pj-grid { grid-template-columns:repeat(2,1fr); } }
        @media(min-width:900px){ .pj-grid { grid-template-columns:1fr; } }
        @media(min-width:1060px){ .pj-grid { grid-template-columns:repeat(2,1fr); } }

        /* ── Project card ── */
        .pj-card {
          background:#fff; border:1.5px solid rgba(0,0,0,0.07);
          padding:22px 22px 18px;
          position:relative; overflow:hidden;
          display:flex; flex-direction:column; gap:12px; cursor:default;
          transform-style:preserve-3d;
          transition:border-color 0.28s, box-shadow 0.28s;
          box-shadow:0 2px 6px rgba(15,23,42,0.05), 0 6px 18px rgba(15,23,42,0.04);
        }
        .pj-card:hover {
          border-color:var(--accent);
          box-shadow:0 12px 40px rgba(0,0,0,0.11), 0 4px 10px rgba(0,0,0,0.07);
        }
        /* depth layer pseudo behind card */
        .pj-card-depth {
          position:absolute; inset:8px -7px -9px 7px; z-index:-1;
          background:#f1f3f5; border-radius:inherit;
          transition:transform 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .pj-card:hover .pj-card-depth { transform:translate(3px,4px); }
        /* top accent bar */
        .pj-card-line {
          position:absolute; top:0; left:0; right:0; height:3px;
          transform:scaleX(0); transform-origin:left;
          transition:transform 0.38s cubic-bezier(0.16,1,0.3,1);
        }
        .pj-card:hover .pj-card-line { transform:scaleX(1); }

        .pj-index {
          font-family:'Space Mono',monospace; font-weight:700;
          font-size:0.5rem; letter-spacing:0.3em; text-transform:uppercase; opacity:0.65;
        }
        .pj-title {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(1.15rem,2.8vw,1.38rem); letter-spacing:0.04em;
          color:#0f172a; line-height:1.08; margin:0;
        }
        .pj-desc {
          font-family:'Barlow',sans-serif;
          font-size:clamp(0.8rem,1.9vw,0.86rem); color:#334155;
          font-weight:600; line-height:1.72; margin:0;
        }
        .pj-footer {
          padding-top:12px; border-top:1px solid rgba(0,0,0,0.065); margin-top:auto;
        }
        .pj-link {
          font-family:'Space Mono',monospace; font-weight:700;
          font-size:0.5rem; letter-spacing:0.22em; text-transform:uppercase;
          display:inline-flex; align-items:center; gap:6px;
          text-decoration:none; transition:gap 0.22s;
        }
        .pj-link:hover { gap:11px; }
        .pj-verified {
          font-family:'Space Mono',monospace; font-weight:700;
          font-size:0.46rem; letter-spacing:0.22em; text-transform:uppercase;
          color:rgba(15,23,42,0.3); display:flex; align-items:center;
        }

        /* ── Scene panel tag & stat ── */
        .pj-scene-tag {
          font-family:'Space Mono',monospace; font-weight:700;
          font-size:0.44rem; letter-spacing:0.38em; text-transform:uppercase;
        }
        .pj-stat-value {
          font-family:'Bebas Neue',sans-serif;
          font-size:2.2rem; line-height:1;
        }
        .pj-stat-label {
          font-family:'Space Mono',monospace; font-weight:700;
          font-size:0.38rem; letter-spacing:0.24em; text-transform:uppercase;
          color:rgba(255,255,255,0.22); margin-top:2px;
        }
        .pj-dep-label {
          font-family:'Space Mono',monospace; font-weight:700;
          font-size:0.4rem; letter-spacing:0.28em; text-transform:uppercase;
          color:rgba(255,255,255,0.2); margin-bottom:5px;
        }

        /* ── Section labels ── */
        .pj-eyebrow-label {
          font-family:'Space Mono',monospace!important; font-weight:700;
          font-size:0.54rem; letter-spacing:0.42em; text-transform:uppercase;
          color:#3b82f6; white-space:nowrap;
        }
        .pj-section-intro {
          font-family:'Barlow',sans-serif!important;
          font-size:clamp(0.88rem,2.2vw,1rem); color:#475569;
          font-weight:600; max-width:54ch; line-height:1.72;
        }
        .pj-index-label {
          font-family:'Space Mono',monospace!important; font-weight:700;
          font-size:0.44rem; letter-spacing:0.24em; text-transform:uppercase; color:#0f172a;
        }

        @media(prefers-reduced-motion:reduce){
          .pj-tab, .pj-card, .pj-scene-panel { transition:none!important; transform:none!important; }
        }
      `}</style>

      <div className="pj" style={{ position:"relative" }}>
        <div className="pj-dotgrid" style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0 }} />

        {/* ambient glow */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
          background:`radial-gradient(ellipse 55% 42% at 62% 50%, ${current.accent}0d, transparent 68%)`,
          transition:"background 0.7s ease",
        }} />
        <div style={{
          position:"absolute", bottom:0, left:0, width:"38%", height:"45%",
          pointerEvents:"none", zIndex:0,
          background:`radial-gradient(ellipse 80% 80% at 0% 100%, ${current.accent}07, transparent)`,
          transition:"background 0.7s ease",
        }} />

        <div style={{ position:"relative", zIndex:1, maxWidth:1200, margin:"0 auto", padding:"80px 16px 100px" }}>

          {/* ── Eyebrow ── */}
          <motion.div
            initial={{ opacity:0, y:14 }} animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.65, ease:[0.16,1,0.3,1] }}
            style={{ display:"flex", alignItems:"center", gap:12, marginBottom:34 }}>
            <motion.div initial={{ scaleX:0 }} animate={inView ? { scaleX:1 } : {}}
              transition={{ duration:0.52, delay:0.1 }}
              style={{ width:24, height:3, background:"#3b82f6", transformOrigin:"left", flexShrink:0, borderRadius:2 }} />
            <span className="pj-eyebrow-label">Project Portfolio</span>
            <motion.div initial={{ scaleX:0 }} animate={inView ? { scaleX:1 } : {}}
              transition={{ duration:0.8, delay:0.18 }}
              style={{ flex:1, height:1, background:"linear-gradient(to right,rgba(59,130,246,0.3),transparent)", transformOrigin:"left" }} />
          </motion.div>

          {/* ── Headline ── */}
          <motion.div
            initial={{ opacity:0, y:22 }} animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.7, delay:0.1, ease:[0.16,1,0.3,1] }}
            style={{ marginBottom:34 }}>
            <h2 className="pj-display" style={{ fontSize:"clamp(2.6rem,8vw,6.4rem)", lineHeight:0.88, color:"#0f172a", marginBottom:12 }}>
              Our Project{" "}
              <span style={{ background:"linear-gradient(90deg,#3b82f6,#818cf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                Portfolio
              </span>
            </h2>
            <p className="pj-section-intro">
              Strategic infrastructure deployments and technology migrations for global industry leaders.
            </p>
          </motion.div>

          {/* ── Tabs ── */}
          <motion.div
            initial={{ opacity:0, y:14 }} animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.6, delay:0.18 }} style={{ marginBottom:30 }}>
            <div className="pj-tabs-row" ref={tabsRef}>
              {TABS.map((t,i) => (
                <motion.button key={t.key}
                  className={`pj-tab ${activeTab===t.key?"pj-tab-active":""}`}
                  style={{ "--tab-accent": t.accent }}
                  onClick={() => setActiveTab(t.key)}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.22+i*0.05 }}>
                  <span className="pj-tab-dot" style={{
                    width:6, height:6, borderRadius:"50%", flexShrink:0,
                    background:activeTab===t.key ? t.accent : "rgba(0,0,0,0.17)",
                    transition:"all 0.2s",
                  }} />
                  {t.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ── Main layout ── */}
          <div className="pj-main">

            {/* Scene panel */}
            <div style={{ perspective:1000 }}>
              <AnimatePresence mode="wait">
                <motion.div key={`sc-${activeTab}`}
                  ref={scenePanelRef}
                  className="pj-scene-panel"
                  onMouseMove={handleSceneMove}
                  onMouseLeave={() => setSceneTilt({ rx:0, ry:0 })}
                  initial={{ opacity:0, filter:"blur(6px)" }}
                  animate={{ opacity:1, filter:"blur(0px)",
                    rotateX: sceneTilt.rx, rotateY: sceneTilt.ry }}
                  exit={{ opacity:0, filter:"blur(6px)" }}
                  transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
                  style={{
                    boxShadow:`0 24px 64px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)`,
                  }}>
                  {/* glow */}
                  <div style={{ position:"absolute", inset:0, pointerEvents:"none",
                    background:`radial-gradient(ellipse 80% 65% at 50% 45%, ${current.accent}1c, transparent 72%)`,
                    transition:"background 0.55s" }} />
                  {/* dot grid texture */}
                  <div style={{ position:"absolute", inset:0, pointerEvents:"none",
                    backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px)",
                    backgroundSize:"20px 20px" }} />
                  {/* corner braces */}
                  {[[10,10,"tl"],[null,10,"tr"],[10,null,"bl"],[null,null,"br"]].map(([l,t,k]) => (
                    <div key={k} style={{ position:"absolute",
                      top:t??undefined, bottom:t===null?10:undefined,
                      left:l??undefined, right:l===null?10:undefined,
                      width:18, height:18, pointerEvents:"none" }}>
                      <svg width="18" height="18" fill="none">
                        {k==="tl" && <><line x1="0" y1="0" x2="12" y2="0" stroke={current.accent} strokeWidth="1.4" strokeOpacity="0.45"/><line x1="0" y1="0" x2="0" y2="12" stroke={current.accent} strokeWidth="1.4" strokeOpacity="0.45"/></>}
                        {k==="tr" && <><line x1="18" y1="0" x2="6" y2="0" stroke={current.accent} strokeWidth="1.4" strokeOpacity="0.45"/><line x1="18" y1="0" x2="18" y2="12" stroke={current.accent} strokeWidth="1.4" strokeOpacity="0.45"/></>}
                        {k==="bl" && <><line x1="0" y1="18" x2="12" y2="18" stroke={current.accent} strokeWidth="1.4" strokeOpacity="0.45"/><line x1="0" y1="18" x2="0" y2="6" stroke={current.accent} strokeWidth="1.4" strokeOpacity="0.45"/></>}
                        {k==="br" && <><line x1="18" y1="18" x2="6" y2="18" stroke={current.accent} strokeWidth="1.4" strokeOpacity="0.45"/><line x1="18" y1="18" x2="18" y2="6" stroke={current.accent} strokeWidth="1.4" strokeOpacity="0.45"/></>}
                      </svg>
                    </div>
                  ))}

                  {/* tag */}
                  <div style={{ position:"relative", zIndex:2, marginBottom:14, display:"flex", alignItems:"center", gap:7 }}>
                    <motion.span style={{ width:5, height:5, borderRadius:"50%", background:current.accent,
                      boxShadow:`0 0 10px ${current.accent}`, display:"block", flexShrink:0 }}
                      animate={{ scale:[1,1.6,1], opacity:[0.6,1,0.6] }}
                      transition={{ duration:2.2, repeat:Infinity }} />
                    <span className="pj-scene-tag" style={{ color:`${current.accent}72` }}>
                      {current.label}_SYS
                    </span>
                  </div>

                  {/* SVG — ambient float */}
                  <motion.div style={{ position:"relative", zIndex:1, flex:1,
                    display:"flex", alignItems:"center", justifyContent:"center" }}
                    animate={{ y:[0,-7,0], rotateZ:[0,0.6,0] }}
                    transition={{ duration:6.5, repeat:Infinity, ease:"easeInOut" }}>
                    <div style={{ width:"100%", maxWidth:280 }}>
                      <current.Scene active={true} />
                    </div>
                  </motion.div>

                  {/* scan sweep */}
                  <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
                    <motion.div style={{ position:"absolute", left:0, right:0, height:1,
                      background:`linear-gradient(to right,transparent,${current.accent}22,transparent)` }}
                      animate={{ y:[-8, 440, -8] }}
                      transition={{ duration:5, repeat:Infinity, ease:"linear" }} />
                  </div>

                  {/* glass stat footer */}
                  <div style={{ position:"relative", zIndex:2, marginTop:16,
                    paddingTop:14, borderTop:`1px solid ${current.accent}22`,
                    background:`rgba(8,14,28,0.5)`,
                    backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)",
                    margin:"16px -20px -20px", padding:"14px 20px 18px" }}>
                    <div className="pj-dep-label">Active Deployments</div>
                    <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
                      <div>
                        <motion.div className="pj-stat-value" style={{ color: current.accent,
                          textShadow:`0 0 20px ${current.accent}55` }}
                          animate={{ y:[0,-4,0] }} transition={{ duration:3.5, repeat:Infinity, ease:"easeInOut" }}>
                          {String(projects.length).padStart(2,"0")}
                        </motion.div>
                        <div className="pj-stat-label">Verified Projects</div>
                      </div>
                      {/* mini pulse indicator */}
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                        {Array.from({length:3},(_,i) => (
                          <motion.div key={i} style={{ height:3, borderRadius:2, background:current.accent, opacity:0.4 }}
                            animate={{ width:[8,32,14,28][i%4], opacity:[0.3,0.85,0.3] }}
                            transition={{ duration:1.6+i*0.4, repeat:Infinity, repeatType:"reverse", delay:i*0.3 }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Cards grid */}
            <div style={{ flex:1, minWidth:0 }}>
              <AnimatePresence mode="wait">
                <motion.div key={`grid-${activeTab}`} className="pj-grid"
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  transition={{ duration:0.22 }}>
                  {projects.map((project, index) => (
                    <ProjectCard key={`${activeTab}-${index}`}
                      project={project} index={index} accent={current.accent} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Index strip ── */}
          <motion.div
            style={{ display:"flex", alignItems:"center", gap:18, marginTop:38, flexWrap:"wrap" }}
            initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}}
            transition={{ delay:0.9 }}>
            {TABS.map((t,i) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 0",
                  display:"flex", alignItems:"center", gap:5,
                  opacity:activeTab===t.key ? 1 : 0.3, transition:"opacity 0.22s" }}>
                <div style={{ height:3, background:t.accent, borderRadius:2,
                  width:activeTab===t.key ? 20 : 4,
                  transition:"width 0.3s cubic-bezier(0.16,1,0.3,1)",
                  boxShadow:activeTab===t.key ? `0 0 8px ${t.accent}` : "none" }} />
                <span className="pj-index-label">{String(i+1).padStart(2,"0")}</span>
              </button>
            ))}
            <span className="pj-index-label" style={{ marginLeft:"auto", opacity:0.2, letterSpacing:"0.28em" }}>
              {String(TABS.findIndex(t => t.key === activeTab)+1).padStart(2,"0")}
              {" / "}
              {String(TABS.length).padStart(2,"0")}
            </span>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Projects;