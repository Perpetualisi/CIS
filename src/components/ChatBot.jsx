import { useState, useRef, useEffect } from "react";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = `You are a professional AI assistant for Conotex Tech, an enterprise IT infrastructure company based in Richmond, TX. Be concise, helpful, and professional.

COMPANY OVERVIEW:
Conotex Tech delivers complete IT infrastructure solutions — from structured cabling to web development and AI integration — serving enterprise clients nationwide.

SERVICES:
1. CUSTOM WEBSITES & DIGITAL GROWTH - UX/UI Design, E-commerce, Digital Marketing, SEO, 99% Lighthouse score. Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service.
2. AI SEARCH QUALITY & VALIDATION - LLM tuning, Dataset Audits, Healthcare AI Compliance, 10x accuracy improvement. Industries: Healthcare, Technology, Finance, Retail, Legal.
3. STRUCTURED CABLING INFRASTRUCTURE - Cat6/Cat6A & Fiber Optic, Data Center Cabling, 99.9% uptime, up to 100G throughput. Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service.
4. TELECOM & AV INTEGRATION - VoIP & PBX, Conference Room AV, Digital Signage, 8K display tech. Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service.
5. CYBERSECURITY - Zero-trust architecture, Pen Testing, Compliance Audits, 24/7 Incident Response, 0-day response. Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service.
6. MANAGED IT SUPPORT - 99.9% uptime SLA, Proactive Monitoring, Disaster Recovery, Business Continuity. Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service.
7. DESKTOP SUPPORT - Under 2hr response time, MDM, IAM, Employee Training. Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service.

CONTACT INFO:
- Email: uchenna.m@conotextech.com
- Phone: +1 (832) 535-1082
- HQ: Richmond, TX 77469 USA
- 24/7 Support: Contract clients can reach the team at uchenna.m@conotextech.com

RESPONSE GUIDELINES:
- Answer questions about any of the above services confidently
- For pricing or specific project quotes, direct clients to use the contact form or click "Consult an Expert"
- Keep responses short and to the point — 2 to 4 sentences max unless more detail is needed
- If asked something outside these services, politely say you will connect them with the team
- Always offer to help with follow-up questions`;

const QUICK_PROMPTS = [
  { text: "💻 What services do you offer?", color: "#1a56db", bg: "#e6f1fb" },
  { text: "🔒 Tell me about cybersecurity", color: "#dc2626", bg: "#fef2f2" },
  { text: "⚡ How fast is your support response?", color: "#d97706", bg: "#fffbeb" },
  { text: "🏭 What industries do you serve?", color: "#059669", bg: "#f0fdf4" },
  { text: "📞 Contact information", color: "#7c3aed", bg: "#f3f0ff" },
  { text: "📅 Book a consultation", color: "#0891b2", bg: "#ecfeff" },
];

const BOT_AVATAR = (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
      <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
      <circle cx="9" cy="17" r="1" fill="white" stroke="none" />
      <circle cx="15" cy="17" r="1" fill="white" stroke="none" />
    </svg>
  </div>
);

function fmtTime() {
  const n = new Date();
  return n.getHours().toString().padStart(2, "0") + ":" + n.getMinutes().toString().padStart(2, "0");
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      {BOT_AVATAR}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Message({ msg, onCopy }) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-end gap-2 mb-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && BOT_AVATAR}
      <div className="flex flex-col gap-0.5 max-w-[75%]">
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed relative group ${
            isUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm"
          }`}
        >
          {msg.content}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-700 rounded-full p-1 shadow-md hover:scale-110"
              aria-label="Copy message"
            >
              {copied ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
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
  );
}

function ServicesPanel({ onAsk }) {
  const services = [
    { name: "Custom Websites & Digital Growth", tag: "UX/UI · E-commerce · SEO", color: "#1a56db", bg: "#e6f1fb", icon: "💻" },
    { name: "AI Search Quality & Validation", tag: "LLM Tuning · Accuracy Audits", color: "#7c3aed", bg: "#f3f0ff", icon: "🤖" },
    { name: "Structured Cabling Infrastructure", tag: "Cat6A · Fiber · Data Center", color: "#0891b2", bg: "#ecfeff", icon: "🔌" },
    { name: "Telecom & AV Integration", tag: "VoIP · Conference AV · Signage", color: "#059669", bg: "#f0fdf4", icon: "📞" },
    { name: "Cybersecurity", tag: "Zero-trust · Pen Testing · 24/7 IR", color: "#dc2626", bg: "#fef2f2", icon: "🔒" },
    { name: "Managed IT Support", tag: "99.9% SLA · Disaster Recovery", color: "#d97706", bg: "#fffbeb", icon: "⚡" },
    { name: "Desktop Support", tag: "<2hr Response · MDM · IAM", color: "#6366f1", bg: "#eef2ff", icon: "🖥️" },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 flex flex-col gap-2">
      <div className="mb-2">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Our Core Services
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Click any service to learn more from our AI assistant
        </p>
      </div>
      {services.map((s) => (
        <button
          key={s.name}
          onClick={() => onAsk(`Tell me more about your ${s.name} service`)}
          className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-all text-left w-full group"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xl transition-transform group-hover:scale-105"
            style={{ background: s.bg }}
          >
            {s.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">
              {s.name}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">{s.tag}</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function ContactPanel() {
  const contacts = [
    {
      label: "Email Us",
      value: "uchenna.m@conotextech.com",
      href: "mailto:uchenna.m@conotextech.com",
      badge: "Usually replies within 24h",
      badgeBg: "#e6f1fb",
      badgeColor: "#1447c0",
      icon: "✉️",
    },
    {
      label: "Call Us",
      value: "+1 (832) 535-1082",
      href: "tel:+18325351082",
      badge: "Mon–Fri, 8am–6pm CT",
      badgeBg: "#f0fdf4",
      badgeColor: "#15803d",
      icon: "📞",
    },
    {
      label: "Our Headquarters",
      value: "Richmond, TX 77469 USA",
      href: "https://maps.google.com/?q=Richmond,TX77469",
      badge: "Houston metro area",
      badgeBg: "#fff7ed",
      badgeColor: "#c2410c",
      icon: "📍",
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 flex flex-col gap-4">
      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Get in Touch
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Reach out to our team for inquiries, quotes, or support
        </p>
      </div>

      {contacts.map((c) => (
        <div
          key={c.label}
          className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xl"
            style={{ background: c.badgeBg }}
          >
            {c.icon}
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-medium text-gray-400 mb-1">{c.label}</p>
            {c.href ? (
              <a
                href={c.href}
                className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                target={c.label === "Our Headquarters" ? "_blank" : undefined}
                rel={c.label === "Our Headquarters" ? "noopener noreferrer" : undefined}
              >
                {c.value}
              </a>
            ) : (
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{c.value}</p>
            )}
            <span
              className="inline-block text-[10px] px-2 py-0.5 rounded-full mt-2 font-medium"
              style={{ background: c.badgeBg, color: c.badgeColor }}
            >
              {c.badge}
            </span>
          </div>
        </div>
      ))}

      <div className="mt-2">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
          24/7 Emergency Support
        </p>
        <div className="flex items-start gap-3 p-3 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 text-white text-xl">
            🚨
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 mb-1">
              Contract Clients Only
            </p>
            <a
              href="mailto:uchenna.m@conotextech.com"
              className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300"
            >
              uchenna.m@conotextech.com
            </a>
            <span className="block text-[10px] px-2 py-0.5 rounded-full mt-2 font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 w-fit">
              ⏰ 24/7 Round-the-clock support
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <p className="text-xs text-gray-600 dark:text-gray-300 text-center">
          📍 Serving enterprise clients nationwide from Richmond, TX
        </p>
      </div>
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi there! 👋 I'm the Conotex Tech assistant. I can help with questions about structured cabling, cybersecurity, managed IT, web development, AV integration, and more. How can I help you today?",
      time: fmtTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unread, setUnread] = useState(0);
  const [showQuick, setShowQuick] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    if (open && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [open]);

  useEffect(() => {
    if (open && !isMinimized) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, isMinimized]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!open && messages.length > messageCount) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "assistant") setUnread((u) => u + 1);
      setMessageCount(messages.length);
    }
  }, [messages, open, messageCount]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 90) + "px";
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi there! 👋 I'm the Conotex Tech assistant. How can I help you with our IT infrastructure and technology services today?",
        time: fmtTime(),
      },
    ]);
    setShowQuick(true);
    setError(null);
    setMessageCount(0);
    setShowClearConfirm(false);
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    if (!GROQ_API_KEY || GROQ_API_KEY === 'undefined') {
      setError("API key not configured. Please add VITE_GROQ_API_KEY to your environment variables.");
      return;
    }

    setShowQuick(false);
    const userMsg = { role: "user", content: trimmed, time: fmtTime() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...updatedMessages.map(({ role, content }) => ({ role, content })),
          ],
          max_tokens: 500,
          temperature: 0.65,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 401) {
          throw new Error("Invalid API key. Please check your Groq API key.");
        } else if (res.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in a moment.");
        } else {
          throw new Error(errData?.error?.message || `API error: ${res.status}`);
        }
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply, time: fmtTime() }]);
    } catch (err) {
      console.error("Chat error:", err);
      if (err.name === 'AbortError') {
        setError("Request timeout. Please try again.");
      } else if (err.message.includes("Failed to fetch")) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const tabs = [
    { id: "chat", label: "💬 Chat", icon: "💬" },
    { id: "services", label: "🛠️ Services", icon: "🛠️" },
    { id: "contact", label: "📞 Contact", icon: "📞" }
  ];

  return (
    <>
      {open && (
        <>
          {/* Mobile Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 sm:hidden"
            onClick={() => setOpen(false)}
          />
          
          <div
            className="fixed bottom-0 left-0 right-0 sm:bottom-24 sm:left-auto sm:right-5 z-50 w-full sm:w-[400px] flex flex-col bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
            style={{ 
              height: isMinimized ? "auto" : "85vh",
              maxHeight: "85vh",
            }}
          >
            {/* Header - Fixed at top */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl flex-shrink-0 sticky top-0 z-10">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
                        <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
                        <circle cx="9" cy="17" r="1" fill="white" stroke="none" />
                        <circle cx="15" cy="17" r="1" fill="white" stroke="none" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white text-sm">Conotex Tech AI</p>
                        <span className="px-1.5 py-0.5 bg-green-500 text-white text-[9px] rounded-full font-medium">Live</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <p className="text-[10px] text-blue-100">Enterprise IT Assistant</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setIsMinimized(!isMinimized)}
                      title={isMinimized ? "Expand" : "Minimize"}
                      className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        {isMinimized ? (
                          <path d="M4 4v16h16" />
                        ) : (
                          <path d="M20 12H4M12 4v16" />
                        )}
                      </svg>
                    </button>
                    <button
                      onClick={() => setOpen(false)}
                      className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Tabs - Sticky */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0 sticky top-[73px] z-10">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-2.5 text-xs font-medium transition-all ${
                        activeTab === tab.id
                          ? "text-blue-600 bg-white dark:bg-gray-900 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.icon}</span>
                    </button>
                  ))}
                </div>

                {/* Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {activeTab === "chat" && (
                    <div className="flex flex-col h-full">
                      <div className="flex-1 px-4 py-4">
                        {messages.map((msg, i) => (
                          <Message key={i} msg={msg} onCopy={copyMessage} />
                        ))}
                        {showQuick && messages.length === 1 && (
                          <div className="flex flex-wrap gap-2 mt-3 mb-2">
                            {QUICK_PROMPTS.map((q) => (
                              <button
                                key={q.text}
                                onClick={() => sendMessage(q.text)}
                                className="text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:scale-105 hover:shadow-md"
                                style={{ 
                                  backgroundColor: q.bg, 
                                  color: q.color,
                                  border: `1px solid ${q.color}20`
                                }}
                              >
                                {q.text}
                              </button>
                            ))}
                          </div>
                        )}
                        {loading && <TypingIndicator />}
                        {error && (
                          <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg mt-1 mb-2">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 8v4m0 4h.01" />
                            </svg>
                            {error}
                          </div>
                        )}
                        <div ref={bottomRef} />
                      </div>

                      {/* Clear Chat Button */}
                      {messages.length > 1 && (
                        <div className="px-4 pb-2">
                          <button
                            onClick={() => setShowClearConfirm(true)}
                            className="w-full text-xs text-red-600 dark:text-red-400 hover:text-red-700 py-2 px-3 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center justify-center gap-2"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                            </svg>
                            Clear Conversation
                          </button>
                        </div>
                      )}

                      {/* Input Area - Fixed at bottom */}
                      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
                        <div className="flex items-end gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                          <textarea
                            ref={(el) => {
                              inputRef.current = el;
                              textareaRef.current = el;
                            }}
                            value={input}
                            onChange={(e) => {
                              setInput(e.target.value);
                              autoResize();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about our services..."
                            rows={1}
                            disabled={loading}
                            maxLength={500}
                            className="flex-1 bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 resize-none outline-none max-h-[90px] leading-5 py-0.5 text-base"
                            style={{ scrollbarWidth: "none", fontSize: "16px" }}
                          />
                          <button
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || loading}
                            className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
                            aria-label="Send message"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-[10px] text-gray-400">Powered by Groq · LLaMA 3.3</p>
                          <p className="text-[10px] text-gray-400">{input.length}/500</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "services" && (
                    <ServicesPanel
                      onAsk={(text) => {
                        setActiveTab("chat");
                        setTimeout(() => sendMessage(text), 100);
                      }}
                    />
                  )}

                  {activeTab === "contact" && <ContactPanel />}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Clear Chat?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This will delete all messages and start a fresh conversation.
            </p>
            <div className="flex gap-3">
              <button
                onClick={clearChat}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button - MOVED HIGHER ON MOBILE */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`
          fixed z-50 
          rounded-full 
          bg-gradient-to-r from-blue-600 to-blue-700 
          hover:from-blue-700 hover:to-blue-800 
          active:scale-95 
          text-white shadow-lg 
          transition-all duration-200 
          flex items-center justify-center 
          group
          w-12 h-12 sm:w-14 sm:h-14
          bottom-20 sm:bottom-5
          right-5 sm:right-8
        `}
        aria-label="Toggle chat"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-40 group-hover:opacity-60"></div>
          </>
        )}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold animate-bounce">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce {
          animation: bounce 0.5s infinite;
        }
        @keyframes ping {
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </>
  );
}