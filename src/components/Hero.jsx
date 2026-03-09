import React, { useState, useEffect, useCallback, useRef } from "react";

const SLIDES = [
  {
    id: 1,
    headline: "Custom Websites",
    subheadline: "Full-Stack & UX Design",
    intro: "High-performance responsive interfaces engineered for speed.\nOptimized to convert digital traffic into measurable revenue.",
    cta: { primary: "Initiate Development", secondary: "Technology Stack" },
    accent: "#f97316",
    tag: "WEB DEV",
    scene: "web",
    stat: { value: "99%", label: "Lighthouse Score" },
  },
  {
    id: 2,
    headline: "Search Intelligence",
    subheadline: "Machine Learning & QA",
    intro: "Precision tuning for LLMs and enterprise search engines.\nEnsuring data accuracy and reliability in the AI era.",
    cta: { primary: "Audit Data", secondary: "Methodology" },
    accent: "#3b82f6",
    tag: "AI / ML",
    scene: "ai",
    stat: { value: "10×", label: "Search Accuracy" },
  },
  {
    id: 3,
    headline: "Cybersecurity",
    subheadline: "Security & Defense Architecture",
    intro: "Real-time threat detection and zero-trust implementation.\nHardening your perimeter with advanced penetration testing.",
    cta: { primary: "Deploy Shield", secondary: "Threat Map" },
    accent: "#ef4444",
    tag: "SECURITY",
    scene: "cyber",
    stat: { value: "0-day", label: "Threat Response" },
  },
  {
    id: 4,
    headline: "Managed IT",
    subheadline: "Systems Operations & Maintenance",
    intro: "Complete outsourced management of your server infrastructure.\nProactive monitoring so you can focus on scaling.",
    cta: { primary: "Consultation", secondary: "Service Packages" },
    accent: "#10b981",
    tag: "IT OPS",
    scene: "server",
    stat: { value: "99.9%", label: "Uptime SLA" },
  },
  {
    id: 5,
    headline: "Desktop Support",
    subheadline: "Endpoint & Helpdesk Management",
    intro: "Rapid-response resolution for hardware and software issues.\nRemote and on-site support across all enterprise endpoints.",
    cta: { primary: "Request Support", secondary: "Service Level" },
    accent: "#8b5cf6",
    tag: "SUPPORT",
    scene: "desktop",
    stat: { value: "<2hr", label: "Avg Response" },
  },
  {
    id: 6,
    headline: "Structured Cabling",
    subheadline: "Infrastructure & Network Layer",
    intro: "High-density fiber and copper architectures for 99.9% uptime.\nThe physical backbone for enterprise-grade connectivity.",
    cta: { primary: "Specifications", secondary: "Network Topology" },
    accent: "#06b6d4",
    tag: "CABLING",
    scene: "network",
    stat: { value: "100G", label: "Max Throughput" },
  },
  {
    id: 7,
    headline: "IP Surveillance",
    subheadline: "Vision & AI Monitoring",
    intro: "AI-powered motion analytics with encrypted remote access.\nEnd-to-end monitoring for high-security environments.",
    cta: { primary: "Secure Infrastructure", secondary: "Case Studies" },
    accent: "#eab308",
    tag: "CCTV / AI",
    scene: "surveillance",
    stat: { value: "4K", label: "AI Resolution" },
  },
  {
    id: 8,
    headline: "Telecom & VoIP",
    subheadline: "Unified Communications",
    intro: "Low-latency voice and data synchronization for global teams.\nSeamlessly integrated multi-channel communication systems.",
    cta: { primary: "Connect Systems", secondary: "System Audit" },
    accent: "#f43f5e",
    tag: "VOIP",
    scene: "telecom",
    stat: { value: "<20ms", label: "Latency" },
  },
  {
    id: 9,
    headline: "Modern AV",
    subheadline: "Multimedia & Presentation Tech",
    intro: "Smart-room technology and interactive display integration.\nAutomated acoustic environments for modern boardrooms.",
    cta: { primary: "Request Quote", secondary: "Solution Gallery" },
    accent: "#a855f7",
    tag: "AV / MEDIA",
    scene: "av",
    stat: { value: "8K", label: "Display Quality" },
  },
];

const SLIDE_INTERVAL = 7000;

function useAnimFrame(cb) {
  const rafRef = useRef(null);
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    const loop = (ts) => { cbRef.current(ts); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
}

function project(x, y, z, fov, cx, cy) {
  const scale = fov / (fov + z);
  return { x: cx + x * scale, y: cy + y * scale, scale };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ── Scene: Web ──────────────────────────────────────────────────────────────
function SceneWeb({ accent }) {
  const canvasRef = useRef(null);
  useAnimFrame((ts) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const t = ts / 1000;
    const windows = [
      { ox: -200, oy: -90, oz: 0, w: 280, h: 190, phase: 0 },
      { ox: 110, oy: -60, oz: -80, w: 230, h: 160, phase: 1.2 },
      { ox: -80, oy: 110, oz: -150, w: 200, h: 140, phase: 2.4 },
    ];
    windows.forEach(({ ox, oy, oz, w, h, phase }) => {
      const yOff = Math.sin(t * 0.6 + phase) * 14;
      const rot = Math.sin(t * 0.3 + phase) * 0.07;
      const p = project(ox, oy + yOff, oz + Math.sin(t * 0.4 + phase) * 25, 700, W / 2, H / 2);
      const sw = w * p.scale, sh = h * p.scale;
      const px = p.x - sw / 2, py = p.y - sh / 2;
      ctx.save();
      ctx.globalAlpha = 0.2 + p.scale * 0.75;
      ctx.translate(p.x, p.y); ctx.rotate(rot); ctx.translate(-p.x, -p.y);
      ctx.shadowColor = accent; ctx.shadowBlur = 40 * p.scale;
      const grad = ctx.createLinearGradient(px, py, px, py + sh);
      grad.addColorStop(0, "#0f172a"); grad.addColorStop(1, "#1e293b");
      ctx.fillStyle = grad;
      roundRect(ctx, px, py, sw, sh, 9 * p.scale); ctx.fill();
      ctx.fillStyle = "#0a1020";
      roundRect(ctx, px, py, sw, sh * 0.17, 9 * p.scale); ctx.fill();
      ["#ef4444", "#f59e0b", "#22c55e"].forEach((c, i) => {
        ctx.beginPath(); ctx.arc(px + (i * 15 + 12) * p.scale, py + sh * 0.085, 4.5 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = c; ctx.fill();
      });
      ctx.shadowBlur = 0;
      for (let i = 0; i < 5; i++) {
        const lw = (sw * 0.55 + (i % 2) * sw * 0.28);
        const ly = py + sh * (0.25 + i * 0.15);
        ctx.fillStyle = i === 0 ? accent + "bb" : i % 2 === 0 ? "#334155" : "#1e293b";
        roundRect(ctx, px + sw * 0.07, ly, lw, sh * 0.055, 3 * p.scale); ctx.fill();
      }
      ctx.strokeStyle = accent + "50"; ctx.lineWidth = 1.5 * p.scale;
      roundRect(ctx, px, py, sw, sh, 9 * p.scale); ctx.stroke();
      ctx.restore();
    });
    ctx.font = `12px 'Courier New', monospace`;
    ["<div>", "const", "fn()", "{}", "=>", "[]"].forEach((s, i) => {
      const x = W * 0.05 + i * W * 0.16 + Math.sin(t * 0.5 + i) * 22;
      const y = H * 0.88 + Math.sin(t * 0.4 + i * 1.3) * 12;
      ctx.globalAlpha = 0.2 + Math.sin(t + i) * 0.08;
      ctx.fillStyle = accent; ctx.fillText(s, x, y);
    });
    ctx.globalAlpha = 1;
  });
  return <canvas ref={canvasRef} width={900} height={600} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ── Scene: AI ───────────────────────────────────────────────────────────────
function SceneAI({ accent }) {
  const canvasRef = useRef(null);
  const nodesRef = useRef(null);
  useEffect(() => {
    const layers = [4, 6, 6, 4];
    const nodes = [];
    layers.forEach((count, li) => {
      for (let ni = 0; ni < count; ni++) {
        nodes.push({ li, ni, x: 130 + li * 190, y: 300 - (count - 1) * 52 + ni * 104, pulse: Math.random() * Math.PI * 2 });
      }
    });
    nodesRef.current = nodes;
  }, []);
  useAnimFrame((ts) => {
    const canvas = canvasRef.current; if (!canvas || !nodesRef.current) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const t = ts / 1000;
    const nodes = nodesRef.current;
    nodes.forEach((n) => {
      nodes.forEach((m) => {
        if (m.li !== n.li + 1) return;
        const strength = 0.25 + 0.35 * Math.sin(t * 1.5 + n.pulse + m.pulse);
        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = accent + Math.floor(strength * 70).toString(16).padStart(2, "0");
        ctx.lineWidth = strength * 2; ctx.stroke();
        const pct = (t * 0.5 + n.pulse * 0.3) % 1;
        ctx.beginPath();
        ctx.arc(n.x + (m.x - n.x) * pct, n.y + (m.y - n.y) * pct, 3, 0, Math.PI * 2);
        ctx.fillStyle = accent; ctx.globalAlpha = 0.7 * strength; ctx.fill(); ctx.globalAlpha = 1;
      });
    });
    nodes.forEach((n) => {
      const pulse = 0.5 + 0.5 * Math.sin(t * 2 + n.pulse);
      const r = 13 + pulse * 6;
      ctx.shadowColor = accent; ctx.shadowBlur = 25 * pulse;
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r);
      grad.addColorStop(0, accent); grad.addColorStop(1, accent + "00");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(n.x, n.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#fff"; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    });
    ctx.font = "bold 11px monospace"; ctx.fillStyle = accent + "55";
    ["INPUT", "HIDDEN", "HIDDEN", "OUTPUT"].forEach((l, i) => {
      ctx.textAlign = "center"; ctx.fillText(l, 130 + i * 190, H - 30);
    });
    ctx.textAlign = "left";
  });
  return <canvas ref={canvasRef} width={900} height={600} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ── Scene: Cyber ────────────────────────────────────────────────────────────
function SceneCyber({ accent }) {
  const canvasRef = useRef(null);
  useAnimFrame((ts) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const t = ts / 1000;
    const cx = W / 2, cy = H / 2;
    for (let r = 0; r < 5; r++) {
      const radius = 90 + r * 60;
      const segments = 14 + r * 4;
      for (let s = 0; s < segments; s++) {
        const a = (s / segments) * Math.PI * 2 + t * (r % 2 === 0 ? 0.3 : -0.2) * (r * 0.4 + 0.5);
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, 3 - r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.25 + 0.45 * Math.sin(t * 3 + s + r); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(cx, cy - 10);
    const sh = 105, sw = 80;
    ctx.shadowColor = accent; ctx.shadowBlur = 40 + 15 * Math.sin(t * 2);
    ctx.beginPath();
    ctx.moveTo(0, -sh); ctx.bezierCurveTo(sw, -sh, sw, sh * 0.3, 0, sh);
    ctx.bezierCurveTo(-sw, sh * 0.3, -sw, -sh, 0, -sh);
    const sg = ctx.createLinearGradient(0, -sh, 0, sh);
    sg.addColorStop(0, accent + "cc"); sg.addColorStop(0.5, accent + "44"); sg.addColorStop(1, accent + "11");
    ctx.fillStyle = sg; ctx.fill();
    ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff"; ctx.globalAlpha = 0.9; roundRect(ctx, -20, -6, 40, 32, 5); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -6, 15, Math.PI, Math.PI * 2);
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 6; ctx.globalAlpha = 0.8; ctx.stroke();
    ctx.restore(); ctx.globalAlpha = 1;
    const scanY = ((t * 65) % (H + 20)) - 10;
    const scanGrad = ctx.createLinearGradient(0, scanY - 25, 0, scanY + 2);
    scanGrad.addColorStop(0, accent + "00"); scanGrad.addColorStop(1, accent + "55");
    ctx.fillStyle = scanGrad; ctx.fillRect(0, scanY - 25, W, 27);
    [{ x: 0.12, y: 0.18 }, { x: 0.82, y: 0.68 }, { x: 0.65, y: 0.12 }, { x: 0.2, y: 0.75 }].forEach(({ x, y }, i) => {
      const pulse = Math.sin(t * 3 + i * 2);
      if (pulse > 0) {
        ctx.beginPath(); ctx.arc(W * x, H * y, 7 + pulse * 5, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444"; ctx.globalAlpha = pulse * 0.7; ctx.fill(); ctx.globalAlpha = 1;
      }
    });
  });
  return <canvas ref={canvasRef} width={900} height={600} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ── Scene: Server ───────────────────────────────────────────────────────────
function SceneServer({ accent }) {
  const canvasRef = useRef(null);
  useAnimFrame((ts) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const t = ts / 1000;
    const rackW = 320, rackH = 400, depth = 38;
    const rx = W / 2 - rackW / 2, ry = H / 2 - rackH / 2;
    ctx.fillStyle = "#080c14";
    ctx.beginPath(); ctx.moveTo(rx + depth, ry - depth); ctx.lineTo(rx + rackW + depth, ry - depth);
    ctx.lineTo(rx + rackW + depth, ry + rackH - depth); ctx.lineTo(rx + depth, ry + rackH - depth); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#1a2540";
    ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + depth, ry - depth);
    ctx.lineTo(rx + rackW + depth, ry - depth); ctx.lineTo(rx + rackW, ry); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#0d1525";
    ctx.beginPath(); ctx.moveTo(rx + rackW, ry); ctx.lineTo(rx + rackW + depth, ry - depth);
    ctx.lineTo(rx + rackW + depth, ry + rackH - depth); ctx.lineTo(rx + rackW, ry + rackH); ctx.closePath(); ctx.fill();
    const fg = ctx.createLinearGradient(rx, ry, rx + rackW, ry);
    fg.addColorStop(0, "#1e293b"); fg.addColorStop(1, "#0f172a");
    ctx.fillStyle = fg; ctx.fillRect(rx, ry, rackW, rackH);
    ctx.strokeStyle = "#2a3a55"; ctx.lineWidth = 1.5; ctx.strokeRect(rx, ry, rackW, rackH);
    const unitH = 28, units = 12;
    for (let i = 0; i < units; i++) {
      const uy = ry + 12 + i * (unitH + 4);
      const active = Math.sin(t * 1.5 + i * 0.7) > 0;
      const busy = Math.sin(t * 4 + i * 1.1) > 0.5;
      const ug = ctx.createLinearGradient(rx + 8, uy, rx + rackW - 8, uy);
      ug.addColorStop(0, "#0f172a"); ug.addColorStop(1, "#1a2540");
      ctx.fillStyle = ug; roundRect(ctx, rx + 8, uy, rackW - 16, unitH, 3); ctx.fill();
      ctx.beginPath(); ctx.arc(rx + 22, uy + unitH / 2, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = active ? (busy ? "#f59e0b" : accent) : "#1e2a3a";
      ctx.shadowColor = active ? (busy ? "#f59e0b" : accent) : "transparent";
      ctx.shadowBlur = active ? 8 : 0; ctx.fill(); ctx.shadowBlur = 0;
      for (let b = 0; b < 9; b++) {
        const bh = (5 + Math.sin(t * 5 + i * 0.6 + b * 0.9) * 8);
        ctx.fillStyle = accent + "55";
        ctx.fillRect(rx + 36 + b * 18, uy + unitH / 2 - bh / 2, 12, bh);
      }
      const load = 0.3 + 0.6 * Math.abs(Math.sin(t * 0.5 + i * 0.4));
      const barX = rx + 220, barMaxW = rackW - 16 - 212;
      ctx.fillStyle = "#0d1525"; ctx.fillRect(barX, uy + 9, barMaxW, 10);
      const barG = ctx.createLinearGradient(barX, 0, barX + barMaxW * load, 0);
      barG.addColorStop(0, accent + "88"); barG.addColorStop(1, accent);
      ctx.fillStyle = barG; ctx.fillRect(barX, uy + 9, barMaxW * load, 10);
    }
  });
  return <canvas ref={canvasRef} width={900} height={600} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ── Scene: Desktop ──────────────────────────────────────────────────────────
function SceneDesktop({ accent }) {
  const canvasRef = useRef(null);
  useAnimFrame((ts) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const t = ts / 1000;
    const cx = W / 2, cy = H / 2;
    const mw = 400, mh = 260, depth = 22;
    const mx = cx - mw / 2, my = cy - mh / 2 - 28;
    ctx.fillStyle = "#1a2540";
    ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + depth, my - depth);
    ctx.lineTo(mx + mw + depth, my - depth); ctx.lineTo(mx + mw, my); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#0d1525";
    ctx.beginPath(); ctx.moveTo(mx + mw, my); ctx.lineTo(mx + mw + depth, my - depth);
    ctx.lineTo(mx + mw + depth, my + mh - depth); ctx.lineTo(mx + mw, my + mh); ctx.closePath(); ctx.fill();
    ctx.shadowColor = accent; ctx.shadowBlur = 28;
    const sg = ctx.createLinearGradient(mx, my, mx, my + mh);
    sg.addColorStop(0, "#0a1628"); sg.addColorStop(1, "#020617");
    ctx.fillStyle = sg; ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = "#2a3a55"; ctx.lineWidth = 2; ctx.strokeRect(mx, my, mw, mh);
    ctx.shadowBlur = 0;
    ctx.save(); ctx.beginPath(); ctx.rect(mx, my, mw, mh); ctx.clip();
    ctx.fillStyle = "#0c1830"; ctx.fillRect(mx, my + mh - 30, mw, 30);
    [0, 1, 2].forEach((i) => {
      const ix = mx + 16 + i * 72, iy = my + 16;
      ctx.fillStyle = accent + "22"; roundRect(ctx, ix, iy, 44, 38, 5); ctx.fill();
      ctx.fillStyle = accent; ctx.font = "18px serif"; ctx.fillText("📁", ix + 9, iy + 26);
    });
    const winY = my + 68;
    ctx.fillStyle = "#1a2540"; roundRect(ctx, mx + 60, winY, mw - 100, mh - 118, 7); ctx.fill();
    ctx.fillStyle = "#0c1830"; roundRect(ctx, mx + 60, winY, mw - 100, 20, 5); ctx.fill();
    ["#ef4444", "#f59e0b", "#22c55e"].forEach((c, i) => {
      ctx.beginPath(); ctx.arc(mx + 74 + i * 14, winY + 10, 4, 0, Math.PI * 2);
      ctx.fillStyle = c; ctx.fill();
    });
    ctx.font = "10px monospace";
    ["> System scan complete", "> 0 threats detected", `> Uptime: ${Math.floor(t * 100) % 10000}s`, "> All systems nominal_"].forEach((line, i) => {
      ctx.fillStyle = i === 3 ? accent : "#94a3b8";
      ctx.globalAlpha = i === 3 ? 0.5 + 0.5 * Math.sin(t * 3) : 0.75;
      ctx.fillText(line, mx + 70, winY + 38 + i * 15);
    });
    ctx.globalAlpha = 1; ctx.restore();
    ctx.fillStyle = "#1e293b"; ctx.fillRect(cx - 12, my + mh, 24, 32);
    ctx.fillStyle = "#2a3a55"; roundRect(ctx, cx - 46, my + mh + 32, 92, 10, 5); ctx.fill();
  });
  return <canvas ref={canvasRef} width={900} height={600} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ── Scene: Network ──────────────────────────────────────────────────────────
function SceneNetwork({ accent }) {
  const canvasRef = useRef(null);
  const nodesRef = useRef(null);
  useEffect(() => {
    nodesRef.current = Array.from({ length: 18 }, () => ({
      x: 100 + Math.random() * 700, y: 60 + Math.random() * 480,
      r: 9 + Math.random() * 10, phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
    }));
  }, []);
  useAnimFrame((ts) => {
    const canvas = canvasRef.current; if (!canvas || !nodesRef.current) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const t = ts / 1000;
    const nodes = nodesRef.current;
    nodes.forEach((n) => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 80 || n.x > W - 80) n.vx *= -1;
      if (n.y < 50 || n.y > H - 50) n.vy *= -1;
    });
    nodes.forEach((n, i) => {
      nodes.forEach((m, j) => {
        if (j <= i) return;
        const dx = m.x - n.x, dy = m.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 220) return;
        const alpha = (1 - dist / 220) * 0.55;
        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = accent + Math.floor(alpha * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = 1 + alpha * 1.5; ctx.stroke();
        const pct = (t * 0.4 + (i + j) * 0.17) % 1;
        ctx.beginPath(); ctx.arc(n.x + dx * pct, n.y + dy * pct, 3, 0, Math.PI * 2);
        ctx.fillStyle = accent; ctx.globalAlpha = alpha * 1.5; ctx.fill(); ctx.globalAlpha = 1;
      });
    });
    nodes.forEach((n) => {
      const pulse = 0.6 + 0.4 * Math.sin(t * 2 + n.phase);
      ctx.shadowColor = accent; ctx.shadowBlur = 18 * pulse;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
      const ng = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * pulse);
      ng.addColorStop(0, accent); ng.addColorStop(1, accent + "00");
      ctx.fillStyle = ng; ctx.fill(); ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "#fff"; ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1;
    });
  });
  return <canvas ref={canvasRef} width={900} height={600} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ── Scene: Surveillance ─────────────────────────────────────────────────────
function SceneSurveillance({ accent }) {
  const canvasRef = useRef(null);
  useAnimFrame((ts) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const t = ts / 1000;
    const cx = W / 2, cy = H / 2;
    const angle = Math.sin(t * 0.6) * 0.65;
    ctx.beginPath(); ctx.moveTo(cx, cy - 20);
    ctx.arc(cx, cy - 20, 320, angle - 0.375 - Math.PI / 2, angle + 0.375 - Math.PI / 2);
    ctx.closePath();
    const cg = ctx.createRadialGradient(cx, cy - 20, 0, cx, cy - 20, 320);
    cg.addColorStop(0, accent + "33"); cg.addColorStop(1, accent + "04");
    ctx.fillStyle = cg; ctx.fill();
    ctx.save(); ctx.translate(cx, cy - 20); ctx.rotate(angle);
    ctx.fillStyle = "#2a3a55"; ctx.fillRect(-6, -56, 12, 56);
    ctx.fillStyle = "#1a2540"; ctx.fillRect(-8, -62, 16, 11);
    ctx.shadowColor = accent; ctx.shadowBlur = 22;
    ctx.fillStyle = "#1a2540"; roundRect(ctx, -56, -20, 112, 42, 11); ctx.fill();
    ctx.strokeStyle = "#3a4f6a"; ctx.lineWidth = 2; roundRect(ctx, -56, -20, 112, 42, 11); ctx.stroke();
    const lg = ctx.createRadialGradient(44, 0, 0, 44, 0, 20);
    lg.addColorStop(0, accent + "ff"); lg.addColorStop(0.4, accent + "88"); lg.addColorStop(1, "#0f172a");
    ctx.beginPath(); ctx.arc(44, 0, 18, 0, Math.PI * 2); ctx.fillStyle = lg; ctx.fill();
    ctx.beginPath(); ctx.arc(44, 0, 18, 0, Math.PI * 2); ctx.strokeStyle = "#3a4f6a"; ctx.lineWidth = 3; ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(-40, -8, 5, 0, Math.PI * 2);
    ctx.fillStyle = 0.5 + 0.5 * Math.sin(t * 3) > 0.5 ? "#ef4444" : "#7f1d1d"; ctx.fill();
    ctx.restore();
    ctx.strokeStyle = accent + "12"; ctx.lineWidth = 1;
    for (let gx = 0; gx < W; gx += 56) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
    for (let gy = 0; gy < H; gy += 56) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
    [[70, 70], [W - 70, 70], [70, H - 70], [W - 70, H - 70]].forEach(([bx, by]) => {
      const size = 20, flip = bx > W / 2 ? -1 : 1, fv = by > H / 2 ? -1 : 1;
      ctx.strokeStyle = accent + "88"; ctx.lineWidth = 2.5; ctx.beginPath();
      ctx.moveTo(bx + flip * size, by); ctx.lineTo(bx, by); ctx.lineTo(bx, by + fv * size); ctx.stroke();
    });
    ctx.font = "bold 11px monospace"; ctx.fillStyle = "#ef4444";
    ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 3); ctx.fillText("● REC", W - 100, 56); ctx.globalAlpha = 1;
    ctx.fillStyle = accent + "66"; ctx.fillText(`CAM_01  ${new Date().toLocaleTimeString()}`, 70, 56);
  });
  return <canvas ref={canvasRef} width={900} height={600} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ── Scene: Telecom ──────────────────────────────────────────────────────────
function SceneTelecom({ accent }) {
  const canvasRef = useRef(null);
  useAnimFrame((ts) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const t = ts / 1000;
    const cx = W / 2, cy = H / 2;
    for (let r = 0; r < 6; r++) {
      const radius = ((t * 85 + r * 90) % 400);
      const alpha = 1 - radius / 400;
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = accent; ctx.globalAlpha = alpha * 0.4; ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#3a4f6a"; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(cx, cy - 95); ctx.lineTo(cx, cy + 95); ctx.stroke();
    [[-48, -22], [48, -22], [-72, 22], [72, 22], [-96, 72], [96, 72]].forEach(([ox, oy]) => {
      ctx.beginPath(); ctx.moveTo(cx, cy + oy); ctx.lineTo(cx + ox, cy + oy + 36); ctx.stroke();
    });
    ctx.shadowColor = accent; ctx.shadowBlur = 22;
    ctx.beginPath(); ctx.arc(cx, cy - 100, 7, 0, Math.PI * 2); ctx.fillStyle = accent; ctx.fill();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    for (let x = 0; x < W; x++) {
      const y = H - 75 + Math.sin((x / W) * Math.PI * 10 + t * 4) * 28 * Math.sin((x / W) * Math.PI);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = accent; ctx.globalAlpha = 0.55; ctx.lineWidth = 2.5; ctx.stroke(); ctx.globalAlpha = 1;
  });
  return <canvas ref={canvasRef} width={900} height={600} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ── Scene: AV ───────────────────────────────────────────────────────────────
function SceneAV({ accent }) {
  const canvasRef = useRef(null);
  useAnimFrame((ts) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const t = ts / 1000;
    const grid = [[0, 0, 2, 2], [2, 0, 1, 1], [3, 0, 1, 1], [2, 1, 1, 1], [3, 1, 1, 1], [0, 2, 1, 1], [1, 2, 1, 1], [2, 2, 2, 1]];
    const cols = 4, rows = 3;
    const pw = (W - 100) / cols, ph = (H - 100) / rows;
    const ox = 50, oy = 50;
    grid.forEach(([c, r, cspan, rspan], pi) => {
      const x = ox + c * pw, y = oy + r * ph;
      const w = pw * cspan - 7, h = ph * rspan - 7;
      ctx.shadowColor = accent; ctx.shadowBlur = 8;
      ctx.fillStyle = "#0f172a"; roundRect(ctx, x, y, w, h, 5); ctx.fill(); ctx.shadowBlur = 0;
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
      if (pi === 0) {
        const mg = ctx.createLinearGradient(x, y, x + w, y + h);
        mg.addColorStop(0, accent + "33"); mg.addColorStop(0.5 + 0.5 * Math.sin(t * 0.5), "#1e3a5f"); mg.addColorStop(1, accent + "11");
        ctx.fillStyle = mg; ctx.fillRect(x, y, w, h);
        ctx.font = `bold ${Math.floor(h * 0.22)}px monospace`;
        ctx.fillStyle = accent; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("AV", x + w / 2, y + h / 2);
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      } else {
        const bars = Math.floor(w / 20);
        for (let b = 0; b < bars; b++) {
          const bh = (0.4 + 0.6 * Math.abs(Math.sin(t * 2 + b * 0.5 + pi))) * h;
          ctx.fillStyle = `hsl(${t * 20 + pi * 40 + b * 22}, 70%, 55%)`;
          ctx.globalAlpha = 0.65; ctx.fillRect(x + b * 20, y + h - bh, 15, bh);
        }
        ctx.globalAlpha = 1;
      }
      ctx.restore();
      ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 2; roundRect(ctx, x, y, w, h, 5); ctx.stroke();
    });
  });
  return <canvas ref={canvasRef} width={900} height={600} style={{ width: "100%", height: "100%", display: "block" }} />;
}

const SCENE_MAP = {
  web: SceneWeb, ai: SceneAI, cyber: SceneCyber, server: SceneServer,
  desktop: SceneDesktop, network: SceneNetwork, surveillance: SceneSurveillance,
  telecom: SceneTelecom, av: SceneAV,
};

// ── Main Hero ───────────────────────────────────────────────────────────────
const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);

  const goTo = useCallback((index) => {
    if (transitioning || index === current) return;
    setTransitioning(true);
    setPrev(current);
    setTimeout(() => {
      setCurrent(index);
      setPrev(null);
      setTransitioning(false);
      startTimeRef.current = null;
    }, 600);
  }, [current, transitioning]);

  const handleNext = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const handlePrev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    if (!isAutoPlaying) { setProgress(0); return; }
    startTimeRef.current = performance.now();
    const animate = (now) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      setProgress(Math.min((elapsed / SLIDE_INTERVAL) * 100, 100));
      if (elapsed < SLIDE_INTERVAL) progressRef.current = requestAnimationFrame(animate);
    };
    progressRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(progressRef.current);
  }, [current, isAutoPlaying]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    timerRef.current = setInterval(handleNext, SLIDE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [isAutoPlaying, handleNext]);

  const manualNav = (index) => { setIsAutoPlaying(false); goTo(index); };
  const scrollTo = (e, id) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? handleNext() : handlePrev(); setIsAutoPlaying(false); }
    setTouchStart(null);
  };

  const slide = SLIDES[current];
  const prevSlide = prev !== null ? SLIDES[prev] : null;
  const SceneComponent = SCENE_MAP[slide.scene];

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-[#03040a] text-white select-none"
      style={{ height: "100svh", minHeight: 600 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Space+Mono:wght@400;700&display=swap');

        .h-display  { font-family: 'Bebas Neue', sans-serif !important; letter-spacing: 0.03em; }
        .h-body     { font-family: 'Barlow', sans-serif !important; }
        .h-mono     { font-family: 'Space Mono', monospace !important; }
        .h-root *   { font-family: 'Barlow', sans-serif; }

        /* ── Slide-in content ── */
        .h-enter {
          animation: hEnter 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes hEnter {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .h-d1 { animation-delay: 0.05s; }
        .h-d2 { animation-delay: 0.13s; }
        .h-d3 { animation-delay: 0.21s; }
        .h-d4 { animation-delay: 0.29s; }
        .h-d5 { animation-delay: 0.37s; }
        .h-d6 { animation-delay: 0.45s; }

        /* ── Scene transitions ── */
        .h-scene-in  { animation: sceneIn  0.7s ease both; }
        .h-scene-out { animation: sceneOut 0.4s ease both; }
        @keyframes sceneIn  { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: scale(1); } }
        @keyframes sceneOut { from { opacity: 1; } to { opacity: 0; } }

        /* ── CTA buttons ── */
        .h-btn-primary {
          background: ${slide.accent};
          color: #fff;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .h-btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0);
          transition: background 0.2s;
        }
        .h-btn-primary:hover::after { background: rgba(255,255,255,0.12); }
        .h-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 36px ${slide.accent}50; }
        .h-btn-ghost {
          border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.75);
          transition: all 0.2s;
          background: rgba(255,255,255,0.03);
        }
        .h-btn-ghost:hover { border-color: ${slide.accent}80; color: #fff; background: rgba(255,255,255,0.07); transform: translateY(-2px); }

        /* ── Nav items ── */
        .h-nav-item {
          transition: all 0.25s;
          border-left: 2px solid transparent;
          cursor: pointer;
        }
        .h-nav-item:hover { border-left-color: rgba(255,255,255,0.2); }
        .h-nav-item.active { border-left-color: ${slide.accent}; }

        /* ── Ping dot ── */
        .h-ping { animation: hPing 1.6s cubic-bezier(0,0,0.2,1) infinite; }
        @keyframes hPing { 75%,100% { transform: scale(2.4); opacity: 0; } }

        /* ── Scrollbar hide ── */
        .h-noscroll { scrollbar-width: none; }
        .h-noscroll::-webkit-scrollbar { display: none; }

        /* ── Noise overlay ── */
        .h-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
        }

        /* ── Stat number ── */
        /* Mobile: compact height */
        @media (max-width: 1023px) {
          #home { height: 70svh !important; min-height: 480px !important; }
        }

        .h-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          color: ${slide.accent};
          line-height: 1;
        }
      `}</style>

      {/* ── Noise texture ── */}
      <div className="h-noise absolute inset-0 z-[1]" />

      {/* ── Global ambient glow ── */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 55% 60% at 72% 45%, ${slide.accent}18, transparent 65%)`,
          transition: "background 0.8s ease" }} />

      {/* ── Subtle grid ── */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      {/* ══ MOBILE (< lg) ══════════════════════════════════════════════════ */}
      {/* ══ MOBILE (< lg) ══════════════════════════════════════════════════ */}
      <div className="lg:hidden h-root absolute inset-0">

        {/* Full-bleed scene */}
        <div className="absolute inset-0 z-0">
          {transitioning && prevSlide && (
            <div key={`mob-prev-${prev}`} className="h-scene-out absolute inset-0 z-10">
              {React.createElement(SCENE_MAP[prevSlide.scene], { accent: prevSlide.accent })}
            </div>
          )}
          <div key={`mob-scene-${current}`} className="h-scene-in absolute inset-0">
            <SceneComponent accent={slide.accent} />
          </div>
          {/* Overlay: transparent top, dark bottom half */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(3,4,10,0.3) 0%, rgba(3,4,10,0.15) 30%, rgba(3,4,10,0.82) 62%, rgba(3,4,10,0.98) 82%, #03040a 100%)"
          }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to right, rgba(3,4,10,0.6) 0%, transparent 65%)"
          }} />
        </div>

        {/* Content: vertically centered in lower 60% of the card */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end"
          style={{ paddingTop: 90, paddingBottom: 20, paddingLeft: 22, paddingRight: 22 }}>

          {!transitioning && (
            <div key={`mob-content-${current}`}>

              {/* Tag pill */}
              <div className="h-enter h-d1 inline-flex items-center gap-2 mb-2.5 px-2.5 py-1 rounded-full"
                style={{ background: `${slide.accent}18`, border: `1px solid ${slide.accent}40` }}>
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                  <span className="h-ping absolute inline-flex h-full w-full rounded-full" style={{ background: slide.accent }} />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: slide.accent }} />
                </span>
                <span className="h-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: slide.accent }}>{slide.tag}</span>
              </div>

              {/* Headline — compact */}
              <h1 className="h-display h-enter h-d2 mb-1.5"
                style={{ fontSize: "clamp(2rem, 10vw, 3rem)", lineHeight: 0.9, color: "#fff", wordBreak: "break-word" }}>
                {slide.headline}
              </h1>

              {/* Subheadline */}
              <div className="h-enter h-d3 flex items-center gap-2.5 mb-2.5">
                <div className="h-px w-5 flex-shrink-0" style={{ background: slide.accent }} />
                <p className="h-body text-[9px] font-light tracking-widest uppercase text-white/40">{slide.subheadline}</p>
              </div>

              {/* Intro — 2 lines max */}
              <p className="h-body h-enter h-d4 text-white/55 leading-snug mb-4 font-light"
                style={{ fontSize: "0.75rem", maxWidth: "32ch", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {slide.intro.replace(/\n/g, " ")}
              </p>

              {/* CTAs */}
              <div className="h-enter h-d5 flex gap-2 mb-4">
                <a href="#contact" onClick={(e) => scrollTo(e, "#contact")}
                  className="h-btn-primary h-body flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-[10px] font-semibold tracking-wider uppercase">
                  {slide.cta.primary}
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="#services" onClick={(e) => scrollTo(e, "#services")}
                  className="h-btn-ghost h-body flex items-center justify-center py-2.5 px-3 text-[10px] font-light tracking-wider uppercase whitespace-nowrap">
                  {slide.cta.secondary}
                </a>
              </div>

              {/* Dots */}
              <div className="h-enter h-d6 flex items-center gap-1.5">
                {SLIDES.map((s, i) => (
                  <button key={i} onClick={() => manualNav(i)}
                    className="h-[3px] rounded-full flex-shrink-0"
                    style={{
                      width: i === current ? 20 : 4,
                      background: i === current ? slide.accent : "rgba(255,255,255,0.2)",
                      transition: "all 0.3s"
                    }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:flex h-root absolute inset-0">

        {/* ── LEFT NAV COLUMN ── */}
        <div className="relative flex flex-col z-20 flex-shrink-0"
          style={{
            width: 260,
            paddingTop: 100,
            paddingBottom: 72,
            paddingLeft: 48,
            paddingRight: 32,
            borderRight: "1px solid rgba(255,255,255,0.05)",
            background: "linear-gradient(to right, rgba(3,4,10,0.98), rgba(3,4,10,0.7))",
          }}>

          {/* Brand label */}
          <div className="mb-10">
            <div className="h-mono text-[9px] tracking-[0.4em] text-white/25 uppercase mb-1">Services</div>
            <div className="w-8 h-px" style={{ background: slide.accent, transition: "background 0.5s" }} />
          </div>

          {/* Service navigation list */}
          <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto h-noscroll">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                onClick={() => manualNav(i)}
                className={`h-nav-item h-body text-left pl-4 py-2.5 pr-2 ${i === current ? "active" : ""}`}
                style={{ borderLeftColor: i === current ? s.accent : undefined }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-light tracking-widest uppercase"
                    style={{ color: i === current ? "#fff" : "rgba(255,255,255,0.3)", transition: "color 0.2s" }}>
                    {s.tag}
                  </span>
                  {i === current && (
                    <span className="h-mono text-[9px]" style={{ color: s.accent }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>
                {i === current && (
                  <div className="text-[12px] font-medium mt-0.5 text-white/80"
                    style={{ fontFamily: "'Barlow', sans-serif" }}>
                    {s.headline}
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom nav controls */}
          <div className="flex items-center gap-2 mt-6 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button onClick={handlePrev}
              className="w-8 h-8 flex items-center justify-center rounded-sm border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={handleNext}
              className="w-8 h-8 flex items-center justify-center rounded-sm border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3L7.5 6l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => setIsAutoPlaying(p => !p)}
              className="w-8 h-8 flex items-center justify-center rounded-sm border transition-all"
              style={{
                borderColor: isAutoPlaying ? `${slide.accent}60` : "rgba(255,255,255,0.1)",
                color: isAutoPlaying ? slide.accent : "rgba(255,255,255,0.3)"
              }}>
              {isAutoPlaying
                ? <svg width="10" height="10" fill="currentColor" viewBox="0 0 10 10"><rect x="1" y="1" width="3" height="8" rx="0.5"/><rect x="6" y="1" width="3" height="8" rx="0.5"/></svg>
                : <svg width="10" height="10" fill="currentColor" viewBox="0 0 10 10"><path d="M2 1.5l7 3.5-7 3.5V1.5z"/></svg>
              }
            </button>
            {/* Progress ring */}
            <div className="relative w-8 h-8 flex items-center justify-center ml-auto">
              <svg width="28" height="28" viewBox="0 0 28 28" className="absolute -rotate-90">
                <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
                <circle cx="14" cy="14" r="11" fill="none" stroke={slide.accent} strokeWidth="1.5"
                  strokeDasharray={`${2 * Math.PI * 11}`}
                  strokeDashoffset={`${2 * Math.PI * 11 * (1 - progress / 100)}`}
                  style={{ transition: "stroke 0.5s" }}
                />
              </svg>
              <span className="h-mono text-[7px]" style={{ color: slide.accent }}>
                {String(current + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT SCENE + CONTENT ── */}
        <div className="relative flex-1 overflow-hidden z-10">

          {/* Scene canvas */}
          {transitioning && prevSlide && (
            <div className="h-scene-out absolute inset-0 z-10">
              {React.createElement(SCENE_MAP[prevSlide.scene], { accent: prevSlide.accent })}
            </div>
          )}
          <div key={`dt-scene-${current}`} className="h-scene-in absolute inset-0 z-10">
            <SceneComponent accent={slide.accent} />
          </div>

          {/* Scene overlays */}
          <div className="absolute inset-0 z-20 pointer-events-none" style={{
            background: "linear-gradient(to right, rgba(3,4,10,0.5) 0%, transparent 40%, transparent 60%, rgba(3,4,10,0.3) 100%)"
          }} />
          <div className="absolute inset-0 z-20 pointer-events-none" style={{
            background: "linear-gradient(to bottom, rgba(3,4,10,0.4) 0%, transparent 30%, transparent 55%, rgba(3,4,10,0.95) 100%)"
          }} />

          {/* ── MAIN CONTENT BLOCK (bottom of scene) ── */}
          {!transitioning && (
            <div key={`dt-content-${current}`}
              className="absolute bottom-0 left-0 right-0 z-30 flex items-end justify-between"
              style={{ padding: "0 56px 72px 56px", gap: 40 }}>

              {/* Left: headline + details */}
              <div style={{ maxWidth: 540 }}>

                {/* Eyebrow */}
                <div className="h-enter h-d1 flex items-center gap-3 mb-4">
                  <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                    <span className="h-ping absolute inline-flex h-full w-full rounded-full" style={{ background: slide.accent }} />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: slide.accent }} />
                  </span>
                  <span className="h-mono text-[10px] tracking-[0.4em] uppercase"
                    style={{ color: slide.accent }}>{slide.subheadline}</span>
                </div>

                {/* Headline */}
                <h1 className="h-display h-enter h-d2 mb-5"
                  style={{
                    fontSize: "clamp(3.5rem, 6vw, 7rem)",
                    lineHeight: 0.88,
                    letterSpacing: "0.02em",
                    color: "#fff",
                    wordBreak: "break-word",
                  }}>
                  {slide.headline}
                </h1>

                {/* Intro */}
                <p className="h-body h-enter h-d3 font-light leading-relaxed mb-6"
                  style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)", color: "rgba(255,255,255,0.55)", maxWidth: "48ch" }}>
                  {slide.intro.replace(/\\n/g, " ")}
                </p>

                {/* CTAs */}
                <div className="h-enter h-d4 flex items-center gap-3">
                  <a href="#contact" onClick={(e) => scrollTo(e, "#contact")}
                    className="h-btn-primary h-body inline-flex items-center gap-2.5 py-3 px-7 text-xs font-semibold tracking-[0.15em] uppercase">
                    {slide.cta.primary}
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5h8M7.5 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                  <a href="#services" onClick={(e) => scrollTo(e, "#services")}
                    className="h-btn-ghost h-body inline-flex items-center gap-2.5 py-3 px-7 text-xs font-light tracking-[0.15em] uppercase">
                    {slide.cta.secondary}
                  </a>
                </div>
              </div>

              {/* Right: stat card */}
              <div className="h-enter h-d5 flex-shrink-0 text-right">
                <div className="inline-block p-5 rounded-sm"
                  style={{
                    background: "rgba(3,4,10,0.7)",
                    border: `1px solid ${slide.accent}25`,
                    backdropFilter: "blur(20px)",
                    boxShadow: `0 0 60px ${slide.accent}10`,
                  }}>
                  <div className="h-stat-num" style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)" }}>
                    {slide.stat.value}
                  </div>
                  <div className="h-mono text-[9px] text-white/30 tracking-[0.25em] uppercase mt-1">
                    {slide.stat.label}
                  </div>
                  <div className="mt-3 pt-3 flex items-center gap-2"
                    style={{ borderTop: `1px solid ${slide.accent}20` }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: slide.accent }} />
                    <span className="h-mono text-[9px] text-white/25 tracking-widest uppercase">Enterprise Grade</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Scene label (top right) */}
          <div className="absolute top-6 right-6 z-30 h-mono text-[9px] tracking-[0.5em] uppercase"
            style={{ color: `${slide.accent}40` }}>
            {slide.scene}_SYS
          </div>
        </div>
      </div>

      {/* ══ BOTTOM PROGRESS BAR — desktop only ══ */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 z-40">
        <div className="h-[1px] w-full" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="h-full"
            style={{
              width: `${progress}%`,
              background: slide.accent,
              boxShadow: `0 0 10px ${slide.accent}`,
              transition: "none",
            }} />
        </div>

        <div className="flex items-center justify-between px-6 lg:pl-[calc(260px+48px)]"
          style={{
            height: 52,
            background: "rgba(3,4,10,0.95)",
            backdropFilter: "blur(24px)",
          }}>

          {/* Dots — desktop only (mobile has its own) */}
          <div className="hidden lg:flex items-center gap-2">
            {SLIDES.map((s, i) => (
              <button key={i} onClick={() => manualNav(i)} title={s.tag}>
                <div className="rounded-full transition-all duration-400"
                  style={{
                    width: i === current ? 24 : 5,
                    height: 5,
                    background: i === current ? slide.accent : "rgba(255,255,255,0.15)",
                  }} />
              </button>
            ))}
          </div>

          {/* Center label — desktop only */}
          <span className="hidden lg:block h-mono text-[9px] tracking-[0.4em] uppercase text-white/20">
            {slide.tag} — {slide.headline}
          </span>

          {/* Counter — desktop only */}
          <div className="hidden lg:flex items-center">
            <span className="h-mono text-[10px]" style={{ color: slide.accent }}>
              {String(current + 1).padStart(2, "0")}
              <span className="text-white/15"> / {String(SLIDES.length).padStart(2, "0")}</span>
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};


export default Hero;