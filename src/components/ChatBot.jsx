import { useState, useRef, useEffect, useCallback } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = `You are Alex, a knowledgeable and friendly IT consultant at Conotex Tech — an enterprise IT infrastructure company based in Richmond, TX. You speak naturally and conversationally, like a real human expert would, not like a scripted bot.

PERSONALITY:
- Warm, professional, and genuinely helpful — like a trusted colleague
- Use natural language: contractions, occasional "Great question!", "Happy to help with that", "Absolutely"
- Vary sentence structure; don't always start with the same phrase
- Be direct and confident without being robotic or overly formal
- Show empathy: "I know IT decisions can be complex, so let me break that down for you"
- Acknowledge uncertainty naturally: "That's a good one — let me give you the best picture I can"
- Offer concrete next steps, not just information

COMPANY OVERVIEW:
Conotex Tech delivers complete IT infrastructure solutions — from structured cabling to web development and AI integration — serving enterprise clients nationwide out of our HQ in Richmond, TX (Houston metro).

SERVICES (know these deeply):
1. CUSTOM WEBSITES & DIGITAL GROWTH
   - UX/UI Design Architecture, E-commerce Development, Digital Marketing Integration
   - Continuous Maintenance & Support, optimized for speed, SEO, and user experience
   - 99% Lighthouse performance score
   - Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service

2. AI SEARCH QUALITY & VALIDATION
   - Search Quality Evaluation, Human-in-the-Loop Validation
   - Healthcare AI Compliance, Dataset Accuracy Audits
   - Validation and tuning for LLMs and enterprise search engines
   - 10x accuracy improvement
   - Industries: Healthcare, Technology, Finance, Retail, Legal

3. STRUCTURED CABLING INFRASTRUCTURE
   - Cat6/Cat6A & Fiber Optic Installation, Data Center Cabling & Rack Management
   - Network Infrastructure Design, Cable Certification & Testing
   - Enterprise-grade, 99.9% uptime, up to 100G throughput
   - Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service

4. TELECOM & AV INTEGRATION
   - VoIP & PBX Systems, Conference Room AV, Digital Signage Solutions
   - Wireless Presentation Systems, smart-room and 8K display technology
   - Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service

5. CYBERSECURITY
   - Endpoint & Perimeter Defense, Penetration Testing
   - Compliance & Risk Audits, 24/7 Incident Response
   - Zero-trust architecture, real-time detection, 0-day response
   - Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service

6. MANAGED IT SUPPORT
   - Proactive Remote Monitoring, Patch & Asset Management
   - Disaster Recovery Planning, Business Continuity Strategy
   - 99.9% uptime SLA guarantee
   - Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service

7. DESKTOP SUPPORT
   - Hardware & Software Lifecycle Management, Identity & Access Management
   - Employee Technical Training, Mobile Device Management
   - Onsite & remote support with under 2hr response time
   - Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service

CONTACT:
- Email: uchenna.m@conotextech.com
- Phone: +1 (832) 535-1082
- HQ: Richmond, TX 77469 USA
- 24/7 Support for contract clients: uchenna.m@conotextech.com

RESPONSE GUIDELINES:
- Keep replies concise: 2-4 sentences for simple questions, more detail only when genuinely needed
- For pricing or quotes: "For an accurate quote tailored to your setup, I'd recommend reaching out directly — you can email uchenna.m@conotextech.com or call +1 (832) 535-1082"
- If asked something outside these services, say: "That's a bit outside my wheelhouse, but I can connect you with someone on the team who can help"
- Always end with a natural follow-up offer, not a generic "Is there anything else?"
- Never say "As an AI" or "I am a language model"
- Sound like a real person who genuinely cares about solving the client's problem`;

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const SERVICES = [
  { name: "Custom Websites & Digital Growth", tag: "UX/UI · E-commerce · 99% Lighthouse", color: "#1a56db", bg: "#dbeafe", emoji: "🌐" },
  { name: "AI Search Quality & Validation",   tag: "LLM Tuning · 10x Accuracy · Audits",  color: "#7c3aed", bg: "#ede9fe", emoji: "🤖" },
  { name: "Structured Cabling Infrastructure",tag: "Cat6A · Fiber · 100G Throughput",      color: "#0e7490", bg: "#cffafe", emoji: "🔌" },
  { name: "Telecom & AV Integration",         tag: "VoIP · PBX · 8K Conference AV",        color: "#059669", bg: "#d1fae5", emoji: "📡" },
  { name: "Cybersecurity",                    tag: "Zero-Trust · Pen Test · 24/7 IR",      color: "#dc2626", bg: "#fee2e2", emoji: "🔒" },
  { name: "Managed IT Support",               tag: "99.9% SLA · DR · Business Continuity", color: "#d97706", bg: "#fef3c7", emoji: "⚙️" },
  { name: "Desktop Support",                  tag: "<2hr Response · MDM · IAM",            color: "#6366f1", bg: "#e0e7ff", emoji: "🖥️" },
];

const QUICK_PROMPTS = [
  { text: "What services do you offer?",          color: "#1a56db", bg: "#dbeafe" },
  { text: "How does your cybersecurity work?",    color: "#dc2626", bg: "#fee2e2" },
  { text: "What's your support response time?",   color: "#d97706", bg: "#fef3c7" },
  { text: "Tell me about managed IT support",     color: "#059669", bg: "#d1fae5" },
  { text: "Do you serve the oil & gas industry?", color: "#0e7490", bg: "#cffafe" },
  { text: "How do I get a quote?",                color: "#7c3aed", bg: "#ede9fe" },
];

const FOLLOW_UP_MAP = {
  cybersecurity: ["What's included in pen testing?", "Do you offer compliance audits?", "How fast is incident response?"],
  cabling:       ["What fiber speeds do you support?", "Do you certify the cabling?", "Can you handle data centers?"],
  managed:       ["What does proactive monitoring cover?", "Do you offer disaster recovery?", "What's your SLA uptime?"],
  websites:      ["Do you handle SEO?", "Can you build e-commerce stores?", "What's your average turnaround?"],
  ai:            ["What's human-in-the-loop validation?", "Do you work with healthcare AI?", "How do you improve LLM accuracy?"],
  desktop:       ["Do you offer onsite support?", "What's your response time?", "Do you handle MDM?"],
  default:       ["Tell me about cybersecurity", "What industries do you serve?", "How do I get started?"],
};

function getFollowUps(content) {
  const s = content.toLowerCase();
  if (s.includes("cyber") || s.includes("security") || s.includes("pentest")) return FOLLOW_UP_MAP.cybersecurity;
  if (s.includes("cabling") || s.includes("fiber") || s.includes("cat6"))     return FOLLOW_UP_MAP.cabling;
  if (s.includes("managed") || s.includes("monitoring") || s.includes("sla")) return FOLLOW_UP_MAP.managed;
  if (s.includes("website") || s.includes("web") || s.includes("seo"))        return FOLLOW_UP_MAP.websites;
  if (s.includes(" ai ") || s.includes("llm") || s.includes("search quality"))return FOLLOW_UP_MAP.ai;
  if (s.includes("desktop") || s.includes("mdm") || s.includes("iam"))        return FOLLOW_UP_MAP.desktop;
  return FOLLOW_UP_MAP.default;
}

function fmtTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function BotAvatar({ size = 28 }) {
  return (
    <div
      style={{ width: size, height: size, minWidth: size, flexShrink: 0 }}
      className="rounded-full bg-blue-600 flex items-center justify-center"
    >
      <svg width={size * 0.48} height={size * 0.48} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
        <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
        <circle cx="9" cy="17" r="1" fill="white" stroke="none" />
        <circle cx="15" cy="17" r="1" fill="white" stroke="none" />
      </svg>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <BotAvatar />
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
      </div>
    </div>
  );
}

function RatingWidget() {
  const [rated, setRated] = useState(null);
  return (
    <div className="flex items-center gap-2 ml-10 mb-3 -mt-1">
      <span className="text-[10px] text-gray-400">Helpful?</span>
      {[{ e: "👍", v: "up" }, { e: "👎", v: "down" }].map(({ e, v }) => (
        <button key={v} onClick={() => !rated && setRated(v)}
          className={`text-sm transition-transform hover:scale-110 ${rated === v ? "opacity-100" : "opacity-40 hover:opacity-70"}`}>
          {e}
        </button>
      ))}
      {rated && <span className="text-[10px] text-green-500">Thanks!</span>}
    </div>
  );
}

// ─── VOICE INPUT ─────────────────────────────────────────────────────────────
function VoiceInput({ onTranscript, disabled }) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  const supported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  if (!supported) return null;

  const toggle = () => {
    if (listening) { recRef.current?.stop(); setListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US"; rec.continuous = false; rec.interimResults = false;
    rec.onstart  = () => setListening(true);
    rec.onend    = () => setListening(false);
    rec.onerror  = () => setListening(false);
    rec.onresult = (e) => onTranscript(e.results[0][0].transcript);
    rec.start(); recRef.current = rec;
  };

  return (
    <button type="button" onClick={toggle} disabled={disabled}
      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
        listening ? "bg-red-500 animate-pulse" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
      } disabled:opacity-40`}
      style={{ touchAction: "manipulation" }}
      aria-label={listening ? "Stop recording" : "Voice input"}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={listening ? "white" : "currentColor"} strokeWidth="2">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8"  y1="23" x2="16" y2="23" />
      </svg>
    </button>
  );
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
function exportChat(messages) {
  const lines = messages.map((m) => `[${m.time || ""}] ${m.role === "user" ? "You" : "Alex"}: ${m.content}`);
  const blob = new Blob([lines.join("\n\n")], { type: "text/plain" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = `conotex-chat-${new Date().toISOString().slice(0, 10)}.txt`; a.click();
  URL.revokeObjectURL(url);
}

// ─── MESSAGE SEARCH ───────────────────────────────────────────────────────────
function MessageSearch({ messages, onJump, onClose }) {
  const [q, setQ] = useState("");
  const results = q.trim()
    ? messages.map((m, i) => ({ ...m, i })).filter((m) => m.content.toLowerCase().includes(q.toLowerCase()))
    : [];

  return (
    <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-50">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 dark:border-gray-700">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search conversation…"
          className="flex-1 text-sm bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400" />
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      {results.length > 0 ? (
        <div className="max-h-44 overflow-y-auto">
          {results.map((r) => (
            <button key={r.i} onClick={() => { onJump(r.i); onClose(); }}
              className="w-full text-left px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
              <span className={`text-[10px] font-semibold ${r.role === "user" ? "text-blue-600" : "text-green-600"}`}>
                {r.role === "user" ? "You" : "Alex"}
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 truncate">{r.content}</p>
            </button>
          ))}
        </div>
      ) : q.trim() ? (
        <p className="text-xs text-gray-400 text-center py-3">No results for "{q}"</p>
      ) : null}
    </div>
  );
}

// ─── MESSAGE ─────────────────────────────────────────────────────────────────
function Message({ msg, onCopy, onFollowUp, isLast, highlight }) {
  const isUser = msg.role === "user";
  const [copied, setCopied]        = useState(false);
  const [showFollowUps, setShowFU] = useState(false);

  useEffect(() => {
    if (!isUser && msg.final && isLast) {
      const t = setTimeout(() => setShowFU(true), 700);
      return () => clearTimeout(t);
    }
  }, [isUser, msg.final, isLast]);

  const handleCopy = () => { onCopy(msg.content); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const followUps  = !isUser && msg.final && isLast ? getFollowUps(msg.content) : [];

  return (
    <div className={`flex flex-col mb-3 ${isUser ? "items-end" : "items-start"}`}>
      <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
        {!isUser && <BotAvatar />}
        <div className="flex flex-col gap-0.5 max-w-[78%]">
          <div className={`relative group px-4 py-2.5 rounded-2xl text-sm leading-relaxed transition-all ${
            highlight ? "ring-2 ring-yellow-400" : ""
          } ${isUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm"
          }`}>
            {msg.content}
            {msg.streaming && <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse align-middle" />}
            {!isUser && !msg.streaming && (
              <button onClick={handleCopy}
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1 shadow-sm">
                {copied
                  ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                }
              </button>
            )}
          </div>
          {msg.time && (
            <span className={`text-[10px] text-gray-400 px-1 ${isUser ? "text-right" : "text-left"}`}>
              {msg.time}
            </span>
          )}
        </div>
      </div>
      {showFollowUps && followUps.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 ml-10">
          {followUps.map((f) => (
            <button key={f} onClick={() => { setShowFU(false); onFollowUp(f); }}
              className="text-[11px] px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 transition-colors"
              style={{ touchAction: "manipulation" }}>
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SERVICES PANEL ──────────────────────────────────────────────────────────
function ServicesPanel({ onAsk }) {
  return (
    <div className="h-full overflow-y-auto p-4">
      <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">What we do</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Tap any service to ask our assistant about it</p>
      <div className="flex flex-col gap-2">
        {SERVICES.map((s) => (
          <button key={s.name} onClick={() => onAsk(`Tell me more about your ${s.name} service`)}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all text-left w-full group"
            style={{ touchAction: "manipulation" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl transition-transform group-hover:scale-105" style={{ background: s.bg }}>
              {s.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight truncate">{s.name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{s.tag}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" className="flex-shrink-0">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── CONTACT PANEL ───────────────────────────────────────────────────────────
function ContactPanel() {
  const [copiedField, setCopiedField] = useState(null);
  const copy = (val, field) => {
    navigator.clipboard.writeText(val).catch(() => {});
    setCopiedField(field); setTimeout(() => setCopiedField(null), 2000);
  };

  const items = [
    {
      label: "Email Us", value: "uchenna.m@conotextech.com", href: "mailto:uchenna.m@conotextech.com",
      badge: "Replies within 24h", badgeBg: "#dbeafe", badgeColor: "#1d4ed8", iconBg: "#dbeafe",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
    },
    {
      label: "Call Us", value: "+1 (832) 535-1082", href: "tel:+18325351082",
      badge: "Mon–Fri, 8am–6pm CT", badgeBg: "#d1fae5", badgeColor: "#065f46", iconBg: "#d1fae5",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.09.5.17 1.01.29 1.52a2 2 0 0 1-.45 2.11L8.09 9c1.91 3.28 4.65 6.02 7.93 7.93l1.36-1.36a2 2 0 0 1 2.11-.45c.51.12 1.02.2 1.52.29A2 2 0 0 1 22 18l-.08-.08z" /></svg>,
    },
    {
      label: "Our HQ", value: "Richmond, TX 77469 USA", href: "https://maps.google.com/?q=Richmond,TX+77469",
      badge: "Houston metro area", badgeBg: "#fef3c7", badgeColor: "#92400e", iconBg: "#fef3c7",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 flex flex-col gap-3">
      <div>
        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Get in Touch</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Tap the icon to copy, or the link to open</p>
      </div>
      {items.map((c) => (
        <div key={c.label} className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-sm transition-shadow">
          <button onClick={() => copy(c.value, c.label)} style={{ background: c.iconBg, touchAction: "manipulation" }}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform" title="Copy">
            {copiedField === c.label
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              : c.icon}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-gray-400 mb-0.5">{c.label}</p>
            <a href={c.href} target={c.label === "Our HQ" ? "_blank" : undefined} rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline break-all">
              {c.value}
            </a>
            <span className="block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium w-fit" style={{ background: c.badgeBg, color: c.badgeColor }}>
              {c.badge}
            </span>
          </div>
        </div>
      ))}
      <div className="flex items-start gap-3 p-3 rounded-xl border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-0.5">24/7 Emergency Support</p>
          <p className="text-[11px] text-blue-500 dark:text-blue-300 mb-1">For contract clients only</p>
          <a href="mailto:uchenna.m@conotextech.com" className="text-sm font-semibold text-blue-700 dark:text-blue-300 hover:underline break-all">
            uchenna.m@conotextech.com
          </a>
          <span className="block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium w-fit bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
            Round-the-clock response
          </span>
        </div>
      </div>
      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Business Hours</p>
        <div className="space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
          <p>Monday – Friday: 8:00 AM – 6:00 PM CT</p>
          <p>Saturday: 10:00 AM – 2:00 PM CT</p>
          <p>Sunday: Emergency support only</p>
        </div>
      </div>
      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">Serving enterprise clients nationwide · Richmond, TX</p>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ChatBot() {
  const [open, setOpen]               = useState(false);
  const [activeTab, setActiveTab]     = useState("chat");
  const [messages, setMessages]       = useState([{
    role: "assistant",
    content: "Hey there! 👋 I'm Alex from Conotex Tech. Whether you need help with IT infrastructure, cybersecurity, cabling, or web development — I'm here to help. What can I do for you today?",
    time: fmtTime(), final: true,
  }]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [unread, setUnread]           = useState(0);
  const [showQuick, setShowQuick]     = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showClear, setShowClear]     = useState(false);
  const [charCount, setCharCount]     = useState(0);
  const [isOnline, setIsOnline]       = useState(navigator.onLine);
  const [toast, setToast]             = useState(null);
  const [showSearch, setShowSearch]   = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const bottomRef   = useRef(null);
  const inputRef    = useRef(null);
  const textareaRef = useRef(null);
  const msgRefs     = useRef({});
  const prevLenRef  = useRef(1);
  const initH       = useRef(typeof window !== "undefined" ? window.innerHeight : 800);

  // ── Real viewport height for iPhone ──────────────────────────────────────
  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty("--real-vh", `${window.innerHeight * 0.01}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", () => { setTimeout(setVH, 100); });
    return () => window.removeEventListener("resize", setVH);
  }, []);

  // ── Virtual keyboard detection (iOS shrinks window height) ───────────────
  useEffect(() => {
    const handler = () => {
      const diff = initH.current - window.innerHeight;
      setKeyboardOpen(diff > 150);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // ── Online/offline ───────────────────────────────────────────────────────
  useEffect(() => {
    const on  = () => { setIsOnline(true);  triggerToast("Back online ✓", "green"); };
    const off = () => { setIsOnline(false); triggerToast("You're offline", "red"); };
    window.addEventListener("online", on); window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  // ── Focus input when chat opens ──────────────────────────────────────────
  useEffect(() => {
    if (open && !isMinimized) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 250); }
  }, [open, isMinimized]);

  // ── Scroll to bottom on new messages ─────────────────────────────────────
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // ── Unread badge ─────────────────────────────────────────────────────────
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!open && messages.length > prevLenRef.current && last?.role === "assistant" && last?.final) {
      setUnread((u) => u + 1);
    }
    prevLenRef.current = messages.length;
  }, [messages, open]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const triggerToast = (msg, color = "gray") => {
    setToast({ msg, color }); setTimeout(() => setToast(null), 2500);
  };

  const autoResize = () => {
    const ta = textareaRef.current;
    if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 80) + "px"; }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: "Chat cleared! I'm Alex — what can I help you with today?", time: fmtTime(), final: true }]);
    setShowQuick(true); setError(null); setShowClear(false);
  };

  const copyMessage = useCallback((content) => {
    navigator.clipboard.writeText(content).catch(() => {});
    triggerToast("Copied ✓", "green");
  }, []);

  const jumpToMessage = (idx) => {
    setHighlightIdx(idx);
    setTimeout(() => msgRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
    setTimeout(() => setHighlightIdx(null), 2000);
  };

  // ── Send ─────────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (textArg) => {
    const trimmed = (textArg ?? input).trim();
    if (!trimmed || loading) return;
    if (!isOnline) { setError("You're offline. Please check your connection."); return; }
    if (!GROQ_API_KEY || GROQ_API_KEY === "undefined") { setError("VITE_GROQ_API_KEY not configured."); return; }

    setShowQuick(false);
    const userMsg = { role: "user", content: trimmed, time: fmtTime() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput(""); setCharCount(0);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true); setError(null);

    setMessages((prev) => [...prev, { role: "assistant", content: "", time: fmtTime(), streaming: true, final: false }]);

    try {
      const ctrl = new AbortController();
      const tid  = setTimeout(() => ctrl.abort(), 30000);

      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history.map(({ role, content }) => ({ role, content }))],
          max_tokens: 600, temperature: 0.72, stream: true,
        }),
        signal: ctrl.signal,
      });
      clearTimeout(tid);

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        if (res.status === 401) throw new Error("Invalid Groq API key.");
        if (res.status === 429) throw new Error("Rate limit hit — try again in a moment.");
        throw new Error(d?.error?.message || `API error ${res.status}`);
      }

      const reader = res.body.getReader();
      const dec    = new TextDecoder();
      let full     = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of dec.decode(value).split("\n")) {
          const t = line.trim();
          if (!t || t === "data: [DONE]") continue;
          if (t.startsWith("data: ")) {
            try {
              const delta = JSON.parse(t.slice(6)).choices?.[0]?.delta?.content || "";
              full += delta;
              setMessages((prev) => { const n = [...prev]; n[n.length - 1] = { ...n[n.length - 1], content: full }; return n; });
            } catch { /* skip */ }
          }
        }
      }
      setMessages((prev) => { const n = [...prev]; n[n.length - 1] = { ...n[n.length - 1], streaming: false, final: true }; return n; });
    } catch (err) {
      setMessages((prev) => prev.filter((m) => !m.streaming));
      if (err.name === "AbortError") setError("Request timed out. Please try again.");
      else if (err.message.toLowerCase().includes("fetch")) setError("Network error — check your connection.");
      else setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, isOnline]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const tabs = [
    { id: "chat",     label: "Chat",     icon: "💬" },
    { id: "services", label: "Services", icon: "🛠️" },
    { id: "contact",  label: "Contact",  icon: "📞" },
  ];
  const lastBotIdx = messages.reduce((acc, m, i) => m.role === "assistant" ? i : acc, -1);

  // ── Chat window height — shrinks when iOS keyboard is open ───────────────
  const chatH = isMinimized
    ? "auto"
    : keyboardOpen
      ? "calc(var(--real-vh, 1vh) * 56)"   // keyboard visible: much shorter
      : window.innerWidth < 768
        ? "calc(var(--real-vh, 1vh) * 88)"  // full mobile
        : "min(680px, 85vh)";               // desktop

  return (
    <>
      {/* ── CHAT WINDOW ── */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)} />

          <div
            className="fixed z-50 flex flex-col bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 bottom-0 left-0 right-0 md:bottom-6 md:left-auto md:right-6 md:w-[440px] rounded-t-2xl md:rounded-2xl overflow-hidden"
            style={{ height: chatH }}
          >
            {/* ── HEADER ── */}
            <div className="bg-blue-600 flex-shrink-0 relative">
              <div className="px-3 py-2.5 flex items-center gap-2">
                <div className="relative flex-shrink-0">
                  <BotAvatar size={34} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-white font-semibold text-sm leading-none">Alex · Conotex Tech</span>
                    <span className="px-1.5 py-0.5 bg-green-500 text-white text-[8px] rounded-full font-bold tracking-wide">LIVE</span>
                    {!isOnline && <span className="px-1.5 py-0.5 bg-red-500 text-white text-[8px] rounded-full font-bold">OFFLINE</span>}
                  </div>
                  <p className="text-[10px] text-blue-200 mt-0.5 truncate">Enterprise IT Assistant · Replies instantly</p>
                </div>
                {/* Header buttons — all same size, no wrapping */}
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {[
                    { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>, title: "Search", onClick: () => setShowSearch((s) => !s) },
                    { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>, title: "Export", onClick: () => exportChat(messages) },
                    { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">{isMinimized ? <path d="M5 15l7-7 7 7" /> : <path d="M19 9l-7 7-7-7" />}</svg>, title: isMinimized ? "Expand" : "Minimize", onClick: () => setIsMinimized((m) => !m) },
                    { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" /></svg>, title: "Clear chat", onClick: () => setShowClear(true) },
                    { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>, title: "Close", onClick: () => setOpen(false) },
                  ].map(({ icon, title, onClick }) => (
                    <button key={title} onClick={onClick} title={title}
                      style={{ touchAction: "manipulation" }}
                      className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              {/* Search bar drops down inside header's relative container */}
              {showSearch && !isMinimized && (
                <MessageSearch messages={messages} onJump={jumpToMessage} onClose={() => setShowSearch(false)} />
              )}
            </div>

            {!isMinimized && (
              <>
                {/* ── TABS ── */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                  {tabs.map((t) => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                      style={{ touchAction: "manipulation" }}
                      className={`flex-1 py-2.5 text-xs font-semibold transition-all border-b-2 ${
                        activeTab === t.id
                          ? "border-blue-600 text-blue-600 bg-white dark:bg-gray-900"
                          : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      }`}>
                      <span className="hidden sm:inline">{t.label}</span>
                      <span className="sm:hidden">{t.icon}</span>
                    </button>
                  ))}
                </div>

                {/* ── CHAT TAB ── */}
                {activeTab === "chat" && (
                  <div className="flex flex-col flex-1 min-h-0">
                    {/* Messages scroll area */}
                    <div className="flex-1 overflow-y-auto px-4 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
                      {messages.map((msg, i) => (
                        <div key={i} ref={(el) => (msgRefs.current[i] = el)}>
                          <Message msg={msg} onCopy={copyMessage} onFollowUp={sendMessage}
                            isLast={i === messages.length - 1} highlight={highlightIdx === i} />
                          {msg.role === "assistant" && msg.final && i > 0 && i === lastBotIdx && (
                            <RatingWidget key={`r-${i}`} />
                          )}
                        </div>
                      ))}

                      {showQuick && messages.length === 1 && (
                        <div className="mt-2 mb-4">
                          <p className="text-[11px] text-gray-400 mb-2 ml-1">Common questions:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {QUICK_PROMPTS.map((q) => (
                              <button key={q.text} onClick={() => sendMessage(q.text)}
                                style={{ background: q.bg, color: q.color, border: `1px solid ${q.color}30`, touchAction: "manipulation" }}
                                className="text-xs px-3 py-1.5 rounded-full font-medium hover:scale-[1.02] transition-all">
                                {q.text}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {loading && !messages[messages.length - 1]?.streaming && <TypingIndicator />}

                      {error && (
                        <div className="flex items-start gap-2 text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-950/30 px-3 py-2.5 rounded-xl mb-3 border border-red-200 dark:border-red-900">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                            <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
                          </svg>
                          <span>{error}</span>
                        </div>
                      )}
                      <div ref={bottomRef} />
                    </div>

                    {/* ── INPUT AREA ──────────────────────────────────────────────────────
                        KEY FIX: Send button is INSIDE the textarea row.
                        Voice input is on a SEPARATE row below so it can NEVER
                        overlap or interfere with the send button on any screen size.
                    ─────────────────────────────────────────────────────────────────── */}
                    <div
                      className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-3 pt-2.5"
                      style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom, 10px))" }}
                    >
                      {/* Row 1: text input + send — the ONLY tappable targets in this row */}
                      <div className="flex items-end gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 focus-within:border-blue-400 transition-colors">
                        <textarea
                          ref={(el) => { inputRef.current = el; textareaRef.current = el; }}
                          value={input}
                          onChange={(e) => { setInput(e.target.value); setCharCount(e.target.value.length); autoResize(); }}
                          onKeyDown={handleKeyDown}
                          placeholder="Ask me anything…"
                          rows={1}
                          disabled={loading}
                          maxLength={500}
                          className="flex-1 bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 resize-none outline-none leading-5 py-0.5"
                          style={{ scrollbarWidth: "none", fontSize: "16px", maxHeight: "80px" }}
                        />
                        {/* Send button — large tap target, touchAction manipulation prevents ghost clicks */}
                        <button
                          type="button"
                          onClick={() => sendMessage()}
                          disabled={!input.trim() || loading}
                          style={{ touchAction: "manipulation", minWidth: "36px", minHeight: "36px" }}
                          className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
                          aria-label="Send message"
                        >
                          {loading
                            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                          }
                        </button>
                      </div>

                      {/* Row 2: voice button + meta — completely separate from send row */}
                      <div className="flex items-center justify-between mt-2 px-0.5">
                        <div className="flex items-center gap-2">
                          <VoiceInput
                            onTranscript={(t) => { setInput(t); setCharCount(t.length); autoResize(); }}
                            disabled={loading}
                          />
                          <span className="text-[10px] text-gray-400">Powered by Groq · LLaMA 3.3</span>
                        </div>
                        <span className={`text-[10px] ${charCount > 450 ? "text-amber-500 font-semibold" : "text-gray-400"}`}>
                          {charCount}/500
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "services" && (
                  <div className="flex-1 overflow-hidden">
                    <ServicesPanel onAsk={(t) => { setActiveTab("chat"); setTimeout(() => sendMessage(t), 100); }} />
                  </div>
                )}
                {activeTab === "contact" && (
                  <div className="flex-1 overflow-hidden"><ContactPanel /></div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* ── CLEAR CONFIRM MODAL ── */}
      {showClear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-6"
          onClick={() => setShowClear(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-xs w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-center text-gray-900 dark:text-white mb-1">Clear conversation?</h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-5">All messages will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={clearChat} style={{ touchAction: "manipulation" }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors">
                Yes, clear it
              </button>
              <button onClick={() => setShowClear(false)} style={{ touchAction: "manipulation" }}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold py-3 rounded-xl transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={`fixed bottom-28 right-4 z-[9998] px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-lg pointer-events-none ${
          toast.color === "green" ? "bg-green-600" : toast.color === "red" ? "bg-red-600" : "bg-gray-800"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* ── TOGGLE ── */}
      <div className="fixed z-50" style={{ bottom: "24px", right: "20px" }}>
        <button
          onClick={() => { setOpen((o) => !o); if (!open) setUnread(0); }}
          style={{ touchAction: "manipulation" }}
          className="relative w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-lg transition-all duration-200 flex items-center justify-center"
          aria-label="Toggle chat"
        >
          {!open && <span className="absolute inset-0 rounded-full bg-blue-400 opacity-25 animate-ping" style={{ animationDuration: "2.5s" }} />}
          {open
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          }
          {!open && unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </div>
    </>
  );
}