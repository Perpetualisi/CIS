import { useState, useRef, useEffect } from "react";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = `You are a professional AI assistant for Conotex Tech, an enterprise IT infrastructure and technology company. Be concise, helpful, and professional.

COMPANY OVERVIEW:
Conotex Tech delivers complete IT infrastructure solutions — from structured cabling to web development and AI integration — serving enterprise clients nationwide.

SERVICES:

1. CUSTOM WEBSITES & DIGITAL GROWTH
   - UX/UI Design Architecture
   - E-commerce Development
   - Digital Marketing Integration
   - Continuous Maintenance & Support
   - Optimized for speed, SEO, and user experience
   - 99% Lighthouse performance score
   Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service

2. AI SEARCH QUALITY & VALIDATION
   - Search Quality Evaluation
   - Human-in-the-Loop Validation
   - Healthcare AI Compliance
   - Dataset Accuracy Audits
   - Validation and tuning for LLMs and enterprise search engines
   - 10× accuracy improvement
   Industries: Healthcare, Technology, Finance, Retail, Legal

3. STRUCTURED CABLING INFRASTRUCTURE
   - Cat6/Cat6A & Fiber Optic Installation
   - Data Center Cabling & Rack Management
   - Network Infrastructure Design
   - Cable Certification & Testing
   - Enterprise-grade, 99.9% uptime, up to 100G throughput
   Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service

4. TELECOM & AV INTEGRATION
   - VoIP & PBX Systems
   - Conference Room AV
   - Digital Signage Solutions
   - Wireless Presentation Systems
   - Smart-room and 8K display technology for modern boardrooms
   Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service

5. CYBERSECURITY
   - Endpoint & Perimeter Defense
   - Penetration Testing
   - Compliance & Risk Audits
   - 24/7 Incident Response
   - Zero-trust architecture, real-time detection, 0-day response
   Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service

6. MANAGED IT SUPPORT
   - Proactive Remote Monitoring
   - Patch & Asset Management
   - Disaster Recovery Planning
   - Business Continuity Strategy
   - 99.9% uptime SLA guarantee
   Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service

7. DESKTOP SUPPORT
   - Hardware & Software Lifecycle Management
   - Identity & Access Management
   - Employee Technical Training
   - Mobile Device Management
   - Onsite & remote support with under 2hr response time
   Industries: Oil & Gas, Corporate, Financial, Healthcare, Utilities, Retail, Food Service

RESPONSE GUIDELINES:
- Answer questions about any of the above services confidently
- For pricing or specific project quotes, direct clients to use the contact form or click "Consult an Expert"
- Keep responses short and to the point — 2 to 4 sentences max unless more detail is needed
- If asked something outside these services, politely say you will connect them with the team
- Always offer to help with follow-up questions`;

const BOT_AVATAR = (
  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
      <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>
      <circle cx="9" cy="17" r="1" fill="white" stroke="none"/>
      <circle cx="15" cy="17" r="1" fill="white" stroke="none"/>
    </svg>
  </div>
);

const QUICK_PROMPTS = [
  "What services do you offer?",
  "Do you handle structured cabling?",
  "Tell me about cybersecurity",
  "How fast is your support response?",
];

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

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-end gap-2 mb-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && BOT_AVATAR}
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! 👋 I'm the Conotex Tech assistant. I can help with questions about our structured cabling, cybersecurity, managed IT, web development, AV integration, and more. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unread, setUnread] = useState(0);
  const [showQuick, setShowQuick] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!open && messages.length > 1) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "assistant") setUnread((u) => u + 1);
    }
  }, [messages]);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    setShowQuick(false);
    const userMsg = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
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
            ...updatedMessages.map(({ role, content }) => ({ role, content })),
          ],
          max_tokens: 500,
          temperature: 0.65,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API error: ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
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
        <div
          className="fixed bottom-24 right-5 sm:right-8 z-50 w-[350px] sm:w-[390px] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          style={{ height: "540px" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>
                <circle cx="9" cy="17" r="1" fill="white" stroke="none"/>
                <circle cx="15" cy="17" r="1" fill="white" stroke="none"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm leading-none">Conotex Tech AI</p>
              <p className="text-xs text-blue-200 mt-0.5">Enterprise IT Solutions Assistant</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth">
            {messages.map((msg, i) => (
              <Message key={i} msg={msg} />
            ))}

            {/* Quick prompts — shown only before first user message */}
            {showQuick && messages.length === 1 && (
              <div className="flex flex-col gap-2 mt-2 mb-3">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-xs px-3 py-2 rounded-xl border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {loading && <TypingIndicator />}

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg mt-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
                </svg>
                {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
            <div className="flex items-end gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about our services..."
                rows={1}
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 resize-none outline-none max-h-28 leading-5 py-0.5"
                style={{ scrollbarWidth: "none" }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Send message"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-1.5">Powered by Groq · LLaMA 3.3</p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 sm:right-8 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-lg transition-all duration-200 flex items-center justify-center"
        aria-label="Open chat"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}