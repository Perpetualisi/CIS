import { useState, useRef, useEffect } from "react";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = `You are a professional AI assistant for Conotex Tech, an enterprise IT infrastructure company based in Richmond, TX. Be concise, helpful, and professional.

COMPANY OVERVIEW:
Conotex Tech delivers complete IT infrastructure solutions — from structured cabling to web development and AI integration — serving enterprise clients nationwide.

SERVICES:
1. CUSTOM WEBSITES & DIGITAL GROWTH - UX/UI Design, E-commerce, Digital Marketing, SEO, 99% Lighthouse score.
2. AI SEARCH QUALITY & VALIDATION - LLM tuning, Dataset Audits, Healthcare AI Compliance, 10x accuracy improvement.
3. STRUCTURED CABLING INFRASTRUCTURE - Cat6/Cat6A & Fiber Optic, Data Center Cabling, 99.9% uptime.
4. TELECOM & AV INTEGRATION - VoIP & PBX, Conference Room AV, Digital Signage, 8K display tech.
5. CYBERSECURITY - Zero-trust architecture, Pen Testing, Compliance Audits, 24/7 Incident Response.
6. MANAGED IT SUPPORT - 99.9% uptime SLA, Proactive Monitoring, Disaster Recovery.
7. DESKTOP SUPPORT - Under 2hr response time, MDM, IAM, Employee Training.

CONTACT INFO:
- Email: uchenna.m@conotextech.com
- Phone: +1 (832) 535-1082
- HQ: Richmond, TX 77469 USA

RESPONSE GUIDELINES:
- Answer questions about any of the above services confidently
- Keep responses short — 2 to 4 sentences max
- Be helpful and professional`;

const QUICK_PROMPTS = [
  { text: "💻 What services do you offer?", color: "#1a56db", bg: "#e6f1fb" },
  { text: "🔒 Tell me about cybersecurity", color: "#dc2626", bg: "#fef2f2" },
  { text: "⚡ How fast is your support response?", color: "#d97706", bg: "#fffbeb" },
  { text: "📞 Contact information", color: "#7c3aed", bg: "#f3f0ff" },
];

function fmtTime() {
  const n = new Date();
  return n.getHours().toString().padStart(2, "0") + ":" + n.getMinutes().toString().padStart(2, "0");
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
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
            <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
            <circle cx="9" cy="17" r="1" fill="white" stroke="none" />
            <circle cx="15" cy="17" r="1" fill="white" stroke="none" />
          </svg>
        </div>
      )}
      <div className="flex flex-col gap-0.5 max-w-[75%]">
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm"
          }`}
        >
          {msg.content}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-block"
            >
              📋
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

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
        </svg>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
}

function ServicesPanel({ onAsk }) {
  const services = [
    { name: "Custom Websites & Digital Growth", icon: "💻", bg: "#e6f1fb" },
    { name: "AI Search Quality & Validation", icon: "🤖", bg: "#f3f0ff" },
    { name: "Structured Cabling Infrastructure", icon: "🔌", bg: "#ecfeff" },
    { name: "Cybersecurity", icon: "🔒", bg: "#fef2f2" },
    { name: "Managed IT Support", icon: "⚡", bg: "#fffbeb" },
  ];

  return (
    <div className="h-full overflow-y-auto p-4">
      <p className="text-xs text-gray-500 mb-3">Click any service to learn more:</p>
      <div className="space-y-2">
        {services.map((s) => (
          <button
            key={s.name}
            onClick={() => onAsk(`Tell me about ${s.name}`)}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 hover:shadow-md transition-all w-full"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <span className="text-sm font-medium">{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ContactPanel() {
  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="space-y-4">
        <div className="p-3 rounded-xl border border-gray-200 bg-white dark:bg-gray-800">
          <p className="text-sm font-semibold mb-1">📧 Email</p>
          <a href="mailto:uchenna.m@conotextech.com" className="text-sm text-blue-600 hover:underline">
            uchenna.m@conotextech.com
          </a>
        </div>
        <div className="p-3 rounded-xl border border-gray-200 bg-white dark:bg-gray-800">
          <p className="text-sm font-semibold mb-1">📞 Phone</p>
          <a href="tel:+18325351082" className="text-sm text-blue-600 hover:underline">
            +1 (832) 535-1082
          </a>
        </div>
        <div className="p-3 rounded-xl border border-gray-200 bg-white dark:bg-gray-800">
          <p className="text-sm font-semibold mb-1">📍 Location</p>
          <p className="text-sm">Richmond, TX 77469 USA</p>
        </div>
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
      content: "Hi there! 👋 I'm the Conotex Tech assistant. How can I help you with our IT services today?",
      time: fmtTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unread, setUnread] = useState(0);
  const [showQuick, setShowQuick] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hi there! 👋 I'm the Conotex Tech assistant. How can I help you with our IT services today?",
        time: fmtTime(),
      },
    ]);
    setShowQuick(true);
    setError(null);
    setShowClearConfirm(false);
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    // Check API key
    if (!GROQ_API_KEY || GROQ_API_KEY === 'undefined') {
      setError("❌ API key not configured. Please add VITE_GROQ_API_KEY to .env file");
      return;
    }

    setShowQuick(false);
    const userMsg = { role: "user", content: trimmed, time: fmtTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map(({ role, content }) => ({ role, content })),
            { role: "user", content: trimmed }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices[0]?.message?.content || "Sorry, I couldn't process that.";
      
      setMessages(prev => [...prev, { role: "assistant", content: reply, time: fmtTime() }]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(`❌ ${err.message}`);
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

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[380px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col" style={{ height: "550px" }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Conotex Tech AI</p>
                <p className="text-[10px] text-blue-100">Enterprise IT Assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white hover:bg-white/20 rounded-lg p-1">
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {["chat", "services", "contact"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-medium ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                {tab === "chat" && "💬 Chat"}
                {tab === "services" && "🛠️ Services"}
                {tab === "contact" && "📞 Contact"}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "chat" && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.map((msg, i) => (
                    <Message key={i} msg={msg} onCopy={copyMessage} />
                  ))}
                  {loading && <TypingIndicator />}
                  {error && (
                    <div className="text-red-500 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded-lg mb-2">
                      {error}
                    </div>
                  )}
                  {showQuick && messages.length === 1 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {QUICK_PROMPTS.map((q) => (
                        <button
                          key={q.text}
                          onClick={() => sendMessage(q.text)}
                          className="text-xs px-3 py-1.5 rounded-full font-medium hover:scale-105 transition"
                          style={{ backgroundColor: q.bg, color: q.color }}
                        >
                          {q.text}
                        </button>
                      ))}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Clear Chat Button */}
                {messages.length > 1 && (
                  <div className="px-4 pb-2">
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="w-full text-xs text-red-600 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition"
                    >
                      🗑️ Clear Conversation
                    </button>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about our services..."
                      disabled={loading}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "services" && (
              <ServicesPanel onAsk={(text) => {
                setActiveTab("chat");
                setTimeout(() => sendMessage(text), 100);
              }} />
            )}

            {activeTab === "contact" && <ContactPanel />}
          </div>
        </div>
      )}

      {/* Clear Chat Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2">Clear Chat?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This will delete all messages and start a fresh conversation.
            </p>
            <div className="flex gap-3">
              <button onClick={clearChat} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                Clear
              </button>
              <button onClick={() => setShowClearConfirm(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg flex items-center justify-center group"
      >
        {open ? (
          "✕"
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </>
        )}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce {
          animation: bounce 0.5s infinite;
        }
      `}</style>
    </>
  );
}