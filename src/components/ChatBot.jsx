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
  { text: "What services do you offer?",           color: "#1a56db", bg: "#dbeafe" },
  { text: "How does your cybersecurity work?",     color: "#dc2626", bg: "#fee2e2" },
  { text: "What's your support response time?",    color: "#d97706", bg: "#fef3c7" },
  { text: "Tell me about managed IT support",      color: "#059669", bg: "#d1fae5" },
  { text: "Do you serve the oil & gas industry?",  color: "#0e7490", bg: "#cffafe" },
  { text: "How do I get a quote?",                 color: "#7c3aed", bg: "#ede9fe" },
];

const SUGGESTED_FOLLOW_UPS = {
  cybersecurity: ["What's included in pen testing?", "Do you offer compliance audits?", "How fast is incident response?"],
  cabling:       ["What fiber speeds do you support?", "Do you certify the cabling?", "Can you handle data centers?"],
  managed:       ["What does proactive monitoring cover?", "Do you offer disaster recovery?", "What's your SLA uptime?"],
  websites:      ["Do you handle SEO?", "Can you build e-commerce stores?", "What's your average turnaround?"],
  ai:            ["What's human-in-the-loop validation?", "Do you work with healthcare AI?", "How do you improve LLM accuracy?"],
  desktop:       ["Do you offer onsite support?", "What's your response time?", "Do you handle MDM?"],
  default:       ["Tell me about cybersecurity", "What industries do you serve?", "How do I get started?"],
};

function getFollowUps(content) {
  const lower = content.toLowerCase();
  if (lower.includes("cyber") || lower.includes("security") || lower.includes("pentest")) return SUGGESTED_FOLLOW_UPS.cybersecurity;
  if (lower.includes("cabling") || lower.includes("fiber") || lower.includes("cat6"))     return SUGGESTED_FOLLOW_UPS.cabling;
  if (lower.includes("managed") || lower.includes("monitoring") || lower.includes("sla")) return SUGGESTED_FOLLOW_UPS.managed;
  if (lower.includes("website") || lower.includes("web") || lower.includes("seo"))        return SUGGESTED_FOLLOW_UPS.websites;
  if (lower.includes("ai") || lower.includes("llm") || lower.includes("search quality")) return SUGGESTED_FOLLOW_UPS.ai;
  if (lower.includes("desktop") || lower.includes("mdm") || lower.includes("iam"))       return SUGGESTED_FOLLOW_UPS.desktop;
  return SUGGESTED_FOLLOW_UPS.default;
}

function fmtTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── BOT AVATAR ──────────────────────────────────────────────────────────────
function BotAvatar({ size = 28 }) {
  return (
    <div
      style={{ width: size, height: size, flexShrink: 0 }}
      className="rounded-full bg-blue-600 flex items-center justify-center"
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
        <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
        <circle cx="9" cy="17" r="1" fill="white" stroke="none" />
        <circle cx="15" cy="17" r="1" fill="white" stroke="none" />
      </svg>
    </div>
  );
}

// ─── TYPING INDICATOR ────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <BotAvatar />
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── RATING WIDGET ────────────────────────────────────────────────────────────
function RatingWidget() {
  const [rated, setRated] = useState(null);
  return (
    <div className="flex items-center gap-2 ml-10 mb-3 -mt-1">
      <span className="text-[10px] text-gray-400">Was this helpful?</span>
      {[{ emoji: "👍", val: "up" }, { emoji: "👎", val: "down" }].map(({ emoji, val }) => (
        <button
          key={val}
          onClick={() => setRated(val)}
          disabled={!!rated}
          className={`text-sm transition-transform hover:scale-110 disabled:cursor-default ${
            rated === val ? "opacity-100" : "opacity-40 hover:opacity-70"
          }`}
        >
          {emoji}
        </button>
      ))}
      {rated && <span className="text-[10px] text-green-500 ml-1">Thanks!</span>}
    </div>
  );
}

// ─── PREMIUM FEATURE: VOICE INPUT ─────────────────────────────────────────
function VoiceInput({ onTranscript }) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false);
    }
  }, []);
  
  const startListening = () => {
    if (!supported) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    
    recognition.start();
  };
  
  if (!supported) return null;
  
  return (
    <button
      onClick={startListening}
      className={`w-8 h-8 rounded-lg transition-all flex items-center justify-center flex-shrink-0 ${
        isListening 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
          : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
      }`}
      aria-label="Voice input"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    </button>
  );
}

// ─── PREMIUM FEATURE: MESSAGE SEARCH ──────────────────────────────────────
function MessageSearch({ messages, onJumpToMessage }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    const searchResults = [];
    messages.forEach((msg, idx) => {
      if (msg.content.toLowerCase().includes(searchQuery.toLowerCase())) {
        searchResults.push({ idx, content: msg.content.substring(0, 100), role: msg.role });
      }
    });
    setResults(searchResults);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
        title="Search messages"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-3">
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search conversation..."
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              autoFocus
            />
            {results.length > 0 && (
              <div className="mt-3 max-h-64 overflow-y-auto">
                {results.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onJumpToMessage(result.idx);
                      setIsOpen(false);
                      setQuery('');
                      setResults([]);
                    }}
                    className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold ${result.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                        {result.role === 'user' ? 'You' : 'Alex'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{result.content}...</p>
                  </button>
                ))}
              </div>
            )}
            {query && results.length === 0 && (
              <p className="text-xs text-gray-500 mt-3 text-center">No messages found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PREMIUM FEATURE: EXPORT CHAT ────────────────────────────────────────
function ExportChat({ messages }) {
  const exportChat = () => {
    const exportData = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      time: msg.time,
      timestamp: new Date().toISOString()
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conotex-chat-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <button
      onClick={exportChat}
      className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
      title="Export chat"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </button>
  );
}

// ─── PREMIUM FEATURE: QUICK RESPONSES ────────────────────────────────────
function QuickResponses({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const quickResponses = [
    "Tell me about your pricing",
    "Schedule a consultation",
    "What industries do you serve?",
    "Send me a brochure",
    "Compare your services",
    "Emergency support options"
  ];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
        title="Quick responses"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">Quick Questions</p>
            {quickResponses.map((response, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelect(response);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {response}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PREMIUM FEATURE: TYPING SOUNDS ──────────────────────────────────────
const useTypingSound = () => {
  const [enabled, setEnabled] = useState(false);
  const audioContext = useRef(null);
  
  const playTypingSound = useCallback(() => {
    if (!enabled) return;
    
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.05;
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.current.currentTime + 0.1);
    oscillator.stop(audioContext.current.currentTime + 0.1);
  }, [enabled]);
  
  const toggleSound = () => setEnabled(!enabled);
  
  return { enabled, toggleSound, playTypingSound };
};

// ─── MESSAGE ─────────────────────────────────────────────────────────────────
function Message({ msg, onCopy, onFollowUp, isLast }) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [translated, setTranslated] = useState(null);
  const [showTranslate, setShowTranslate] = useState(false);

  useEffect(() => {
    if (!isUser && msg.final && isLast) {
      const t = setTimeout(() => setShowFollowUps(true), 700);
      return () => clearTimeout(t);
    }
  }, [isUser, msg.final, isLast]);

  const handleCopy = () => {
    onCopy(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const translateMessage = async () => {
    if (translated) {
      setTranslated(null);
      setShowTranslate(false);
      return;
    }
    
    setShowTranslate(true);
    setTimeout(() => {
      setTranslated(msg.content + " [Translated to Spanish - demo]");
    }, 500);
  };

  const followUps = !isUser && msg.final && isLast ? getFollowUps(msg.content) : [];

  return (
    <div className={`flex flex-col mb-3 ${isUser ? "items-end" : "items-start"}`}>
      <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
        {!isUser && <BotAvatar />}
        <div className="flex flex-col gap-0.5 max-w-[78%]">
          <div
            className={`relative group px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              isUser
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm"
            }`}
          >
            {translated && showTranslate ? translated : msg.content}
            {msg.streaming && (
              <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse align-middle" />
            )}
            {!isUser && !msg.streaming && (
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={handleCopy}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1 shadow-sm hover:scale-110 transition-transform"
                  aria-label="Copy message"
                >
                  {copied ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={translateMessage}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1 shadow-sm hover:scale-110 transition-transform"
                  aria-label="Translate"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                    <path d="M5 8h14M9 3v5M15 3v5M5 13h14M12 8v12M8 16l4 4 4-4" />
                  </svg>
                </button>
              </div>
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
            <button
              key={f}
              onClick={() => { setShowFollowUps(false); onFollowUp(f); }}
              className="text-[11px] px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
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
          <button
            key={s.name}
            onClick={() => onAsk(`Tell me more about your ${s.name} service`)}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all text-left w-full group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl transition-transform group-hover:scale-105"
              style={{ background: s.bg }}
            >
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
  const [copied, setCopied] = useState(null);
  
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };
  
  const items = [
    {
      label: "Email Us",
      value: "uchenna.m@conotextech.com",
      href: "mailto:uchenna.m@conotextech.com",
      badge: "Replies within 24h",
      badgeBg: "#dbeafe", badgeColor: "#1d4ed8",
      iconBg: "#dbeafe",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      label: "Call Us",
      value: "+1 (832) 535-1082",
      href: "tel:+18325351082",
      badge: "Mon–Fri, 8am–6pm CT",
      badgeBg: "#d1fae5", badgeColor: "#065f46",
      iconBg: "#d1fae5",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9c1.91 3.28 4.65 6.02 7.93 7.93l1.36-1.36a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 24 18l-.08-.08z" />
        </svg>
      ),
    },
    {
      label: "Our Headquarters",
      value: "Richmond, TX 77469 USA",
      href: "https://maps.google.com/?q=Richmond,TX+77469",
      badge: "Houston metro area",
      badgeBg: "#fef3c7", badgeColor: "#92400e",
      iconBg: "#fef3c7",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 flex flex-col gap-3">
      <div>
        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Get in Touch</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Reach our team for inquiries, quotes, or support</p>
      </div>
      {items.map((c) => (
        <div key={c.label} className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-sm transition-shadow">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer hover:scale-105 transition-transform" 
               style={{ background: c.iconBg }}
               onClick={() => copyToClipboard(c.value, c.label)}>
            {c.icon}
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-gray-400 mb-0.5">{c.label}</p>
            <a
              href={c.href}
              target={c.label === "Our Headquarters" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {c.value}
            </a>
            <span className="block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium w-fit" style={{ background: c.badgeBg, color: c.badgeColor }}>
              {c.badge}
            </span>
            {copied === c.label && (
              <span className="text-[10px] text-green-600 mt-1 block">Copied!</span>
            )}
          </div>
        </div>
      ))}

      <div className="flex items-start gap-3 p-3 rounded-xl border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 mt-1">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-0.5">24/7 Emergency Support</p>
          <p className="text-[11px] text-blue-500 dark:text-blue-300 mb-1">For contract clients only</p>
          <a href="mailto:uchenna.m@conotextech.com" className="text-sm font-semibold text-blue-700 dark:text-blue-300 hover:underline">
            uchenna.m@conotextech.com
          </a>
          <span className="block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium w-fit bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
            Round-the-clock response
          </span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Business Hours</p>
        </div>
        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <p>Monday - Friday: 8:00 AM - 6:00 PM CT</p>
          <p>Saturday: 10:00 AM - 2:00 PM CT</p>
          <p>Sunday: Closed (Emergency only)</p>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Serving enterprise clients nationwide from Richmond, TX
        </p>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey there! 👋 I'm Alex from Conotex Tech. Whether you need help with IT infrastructure, cybersecurity, cabling, or web development — I'm here to help. What can I do for you today?",
      time: fmtTime(),
      final: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unread, setUnread] = useState(0);
  const [showQuick, setShowQuick] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [messageTarget, setMessageTarget] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  
  const { enabled: soundEnabled, toggleSound, playTypingSound } = useTypingSound();

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);
  const messageRefs = useRef({});

  // Fix for iPhone viewport height
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fix body scroll lock - prevent body scroll when modal is open
  useEffect(() => {
    if (showClearConfirm) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else if (open && !isMinimized) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      if (!showClearConfirm && !open) {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";
      }
    };
  }, [open, isMinimized, showClearConfirm]);

  useEffect(() => {
    if (open && !isMinimized && !showClearConfirm) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, isMinimized, showClearConfirm]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messageTarget !== null && messageRefs.current[messageTarget]) {
      messageRefs.current[messageTarget].scrollIntoView({ behavior: 'smooth', block: 'center' });
      setMessageTarget(null);
    }
  }, [messageTarget]);

  const prevLenRef = useRef(messages.length);
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!open && messages.length > prevLenRef.current && last?.role === "assistant" && last?.final) {
      setUnread((u) => u + 1);
      if (Notification.permission === 'granted') {
        new Notification('New message from Alex', {
          body: last.content.substring(0, 100),
          icon: 'https://via.placeholder.com/64'
        });
      }
    }
    prevLenRef.current = messages.length;
  }, [messages, open]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (ta) { 
      ta.style.height = "auto"; 
      ta.style.height = Math.min(ta.scrollHeight, 90) + "px"; 
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Chat cleared! I'm Alex — feel free to ask me anything about Conotex Tech's services. What's on your mind?",
      time: fmtTime(),
      final: true,
    }]);
    setShowQuick(true);
    setError(null);
    setShowClearConfirm(false);
  };

  const copyMessage = useCallback((content) => {
    navigator.clipboard.writeText(content).catch(() => {});
    setNotificationMsg('Copied to clipboard!');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  }, []);

  const sendMessage = useCallback(async (textArg) => {
    const trimmed = (textArg ?? input).trim();
    if (!trimmed || loading) return;

    if (!isOnline) {
      setError("You're offline. Please check your internet connection.");
      return;
    }

    if (!GROQ_API_KEY || GROQ_API_KEY === "undefined") {
      setError("API key not configured. Add VITE_GROQ_API_KEY to your .env file.");
      return;
    }

    setShowQuick(false);
    const userMsg = { role: "user", content: trimmed, time: fmtTime() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setCharCount(0);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);
    setError(null);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", time: fmtTime(), streaming: true, final: false },
    ]);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...history.map(({ role, content }) => ({ role, content })),
          ],
          max_tokens: 600,
          temperature: 0.72,
          stream: true,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 401) throw new Error("Invalid Groq API key — please check your configuration.");
        if (res.status === 429) throw new Error("Rate limit hit. Give it a moment and try again.");
        throw new Error(errData?.error?.message || `API error ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          const t = line.trim();
          if (!t || t === "data: [DONE]") continue;
          if (t.startsWith("data: ")) {
            try {
              const json = JSON.parse(t.slice(6));
              const delta = json.choices?.[0]?.delta?.content || "";
              if (delta && soundEnabled) playTypingSound();
              full += delta;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { ...next[next.length - 1], content: full };
                return next;
              });
            } catch { }
          }
        }
      }

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], streaming: false, final: true };
        return next;
      });
    } catch (err) {
      setMessages((prev) => prev.filter((m) => !m.streaming));
      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError("Network error — check your internet connection.");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, isOnline, soundEnabled, playTypingSound]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { 
      e.preventDefault(); 
      sendMessage(); 
    }
  };

  const tabs = [
    { id: "chat", label: "Chat", short: "💬" },
    { id: "services", label: "Services", short: "🛠️" },
    { id: "contact", label: "Contact", short: "📞" },
  ];

  const lastBotIdx = messages.map((m, i) => m.role === "assistant" ? i : -1).filter(i => i >= 0).at(-1);

  return (
    <>
      {open && (
        <>
          {/* Mobile backdrop - only shows on mobile */}
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)} />

          <div
            className={`
              fixed z-50 flex flex-col bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700
              ${isMinimized 
                ? "w-auto rounded-2xl bottom-6 right-6" 
                : `
                  bottom-0 left-0 right-0 
                  md:bottom-6 md:left-auto md:right-6 
                  w-full md:w-[450px] 
                  rounded-t-2xl md:rounded-2xl
                `
              }
            `}
            style={{
              height: isMinimized 
                ? "auto" 
                : window.innerWidth < 768 
                  ? "calc(var(--vh, 1vh) * 85)" 
                  : "min(700px, 80vh)",
              maxHeight: isMinimized ? "auto" : (window.innerWidth < 768 ? "calc(var(--vh, 1vh) * 85)" : "80vh"),
            }}
          >
            {/* Header - Fixed with proper padding */}
            <div className="bg-blue-600 flex-shrink-0 rounded-t-2xl">
              <div className="px-4 py-3 flex items-center gap-2">
                <div className="relative flex-shrink-0">
                  <BotAvatar size={36} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-white font-semibold text-sm">Alex · Conotex Tech</span>
                    <span className="px-1.5 py-0.5 bg-green-500 text-white text-[8px] rounded-full font-bold tracking-wide whitespace-nowrap">LIVE</span>
                    {!isOnline && (
                      <span className="px-1.5 py-0.5 bg-red-500 text-white text-[8px] rounded-full font-bold tracking-wide whitespace-nowrap">OFFLINE</span>
                    )}
                  </div>
                  <p className="text-[10px] text-blue-200 mt-0.5 truncate">Enterprise IT Assistant · Replies instantly</p>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button
                    onClick={toggleSound}
                    className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                    title={soundEnabled ? "Mute typing sounds" : "Enable typing sounds"}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      {soundEnabled ? (
                        <>
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </>
                      ) : (
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      )}
                    </svg>
                  </button>
                  {!isMinimized && window.innerWidth >= 768 && (
                    <>
                      <MessageSearch messages={messages} onJumpToMessage={(idx) => setMessageTarget(idx)} />
                      <ExportChat messages={messages} />
                      <QuickResponses onSelect={(text) => sendMessage(text)} />
                    </>
                  )}
                  <button
                    onClick={() => setIsMinimized((m) => !m)}
                    title={isMinimized ? "Expand" : "Minimize"}
                    className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      {isMinimized ? <path d="M5 15l7-7 7 7" /> : <path d="M19 9l-7 7-7-7" />}
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    title="Clear chat"
                    className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-2.5 text-xs font-semibold transition-all border-b-2 ${
                        activeTab === tab.id
                          ? "border-blue-600 text-blue-600 bg-white dark:bg-gray-900"
                          : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      }`}
                    >
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden text-base">{tab.short}</span>
                    </button>
                  ))}
                </div>

                {/* Chat Tab */}
                {activeTab === "chat" && (
                  <div className="flex flex-col flex-1 min-h-0">
                    <div className="flex-1 overflow-y-auto px-4 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
                      {messages.map((msg, i) => (
                        <div key={i} ref={el => messageRefs.current[i] = el}>
                          <Message
                            msg={msg}
                            onCopy={copyMessage}
                            onFollowUp={(text) => sendMessage(text)}
                            isLast={i === messages.length - 1}
                          />
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
                              <button
                                key={q.text}
                                onClick={() => sendMessage(q.text)}
                                className="text-xs px-3 py-1.5 rounded-full font-medium hover:shadow-sm hover:scale-[1.02] transition-all"
                                style={{ background: q.bg, color: q.color, border: `1px solid ${q.color}30` }}
                              >
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

                    {/* Input Area */}
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
                      <div className="flex items-end gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 focus-within:border-blue-400 transition-colors">
                        <textarea
                          ref={(el) => { inputRef.current = el; textareaRef.current = el; }}
                          value={input}
                          onChange={(e) => { setInput(e.target.value); setCharCount(e.target.value.length); autoResize(); }}
                          onKeyDown={handleKeyDown}
                          placeholder="Ask me anything about our services..."
                          rows={1}
                          disabled={loading || showClearConfirm}
                          maxLength={500}
                          className="flex-1 bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 resize-none outline-none max-h-[90px] leading-5 py-0.5 text-sm"
                          style={{ scrollbarWidth: "none", fontSize: "16px" }}
                        />
                        <VoiceInput onTranscript={(text) => setInput(text)} />
                        <button
                          onClick={() => sendMessage()}
                          disabled={!input.trim() || loading || showClearConfirm}
                          className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
                          aria-label="Send"
                        >
                          {loading ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="animate-spin">
                              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-1.5 px-0.5">
                        <p className="text-[10px] text-gray-400">Powered by Groq · LLaMA 3.3</p>
                        <p className={`text-[10px] ${charCount > 450 ? "text-amber-500" : "text-gray-400"}`}>
                          {charCount}/500
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Services Tab */}
                {activeTab === "services" && (
                  <div className="flex-1 overflow-hidden">
                    <ServicesPanel
                      onAsk={(text) => { setActiveTab("chat"); setTimeout(() => sendMessage(text), 100); }}
                    />
                  </div>
                )}

                {/* Contact Tab */}
                {activeTab === "contact" && (
                  <div className="flex-1 overflow-hidden">
                    <ContactPanel />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* Clear Confirm Modal - HIGHEST Z-INDEX to appear above everything */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" onClick={() => setShowClearConfirm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-xs w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6M9 6V4h6v2" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-center text-gray-900 dark:text-white mb-1">Clear conversation?</h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-5">This will remove all messages and start fresh.</p>
            <div className="flex gap-3">
              <button
                onClick={clearChat}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                Yes, clear it
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed bottom-32 right-6 z-50 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs shadow-lg">
          {notificationMsg}
        </div>
      )}

      {/* Toggle Button */}
      <div className="fixed z-50 bottom-6 right-6">
        <button
          onClick={() => { setOpen((o) => !o); if (!open) setUnread(0); }}
          className="relative w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-lg transition-all duration-200 flex items-center justify-center"
          aria-label="Toggle chat"
        >
          {!open && (
            <span
              className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping"
              style={{ animationDuration: "2.5s" }}
            />
          )}
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
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