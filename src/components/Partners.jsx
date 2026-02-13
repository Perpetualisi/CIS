import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuBuilding2 } from "react-icons/lu";

const PARTNER_LOGOS = [
  "/Partners/logo1.png", "/Partners/logo2.png", "/Partners/logo3.png", "/Partners/logo4.jpeg",
  "/Partners/logo5.png", "/Partners/logo6.jpg", "/Partners/logo7.jpg", "/Partners/logo8.png",
  "/Partners/logo9.png", "/Partners/logo10.png", "/Partners/logo11.png", "/Partners/logo12.webp",
  "/Partners/logo13.png", "/Partners/logo14.jpg", "/Partners/logo15.png", "/Partners/logo16.webp",
  "/Partners/logo17.png", "/Partners/logo18.jpg", "/Partners/logo19.jpeg", "/Partners/logo20.jpeg",
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
    { title: "McDonald’s", desc: "Enterprise Network Migration across corporate and franchise sites." },
  ],
  government: [
    { title: "Texas State Prisons", desc: "High-security Network Migration & Secure AP Deployment for inmate connectivity." },
    { title: "METRO Authority", desc: "Smart Beacon Deployment across 9,000+ bus stops for real-time visibility." },
  ],
  power: [
    { title: "Nova Source Power", desc: "Outdoor CCTV & specialized security installations for utility sites." },
  ],
};

const CATEGORY_TABS = {
  healthcare: "Healthcare",
  finance: "Financial",
  energy: "Oil & Gas",
  retail: "Retail",
  government: "Gov & Transport",
  power: "Utilities",
};

const Partners = () => {
  const [activeTab, setActiveTab] = useState("healthcare");

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50" id="partners">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Underline Removed */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-[#001f3f] mb-6 uppercase tracking-tighter">
            Trusted by Industry Leaders
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            Strategic infrastructure partnerships across mission-critical sectors including energy, finance, and healthcare.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {Object.entries(CATEGORY_TABS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all duration-300 border-2 ${
                activeTab === key
                  ? "bg-[#001f3f] border-[#001f3f] text-white shadow-lg"
                  : "bg-white border-slate-200 text-slate-400 hover:border-[#001f3f] hover:text-[#001f3f]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Clients Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]"
        >
          <AnimatePresence mode="popLayout">
            {CLIENT_DATA[activeTab].map((client, index) => (
              <motion.div
                key={`${activeTab}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative bg-white border border-slate-100 p-8 rounded-sm shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden"
              >
                {/* Accent line removed for ultra-clean look */}
                <div>
                  <div className="w-12 h-12 bg-slate-50 rounded-sm flex items-center justify-center mb-8 group-hover:bg-[#001f3f] group-hover:text-white transition-all duration-300">
                    <LuBuilding2 className="text-xl" />
                  </div>
                  <h3 className="text-[#001f3f] font-black text-lg mb-4 leading-tight uppercase tracking-tight">
                    {client.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-light">
                    {client.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Logo Marquee Section - Logos Bright & Clear */}
        <div className="mt-24 pt-12 border-t border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] font-mono">
              Partner_Network_Status: Active
            </span>
            <div className="h-px flex-grow bg-slate-200 mx-8 hidden md:block" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Authorized Service Provider
            </span>
          </div>
          
          <div className="relative flex overflow-x-hidden group bg-white py-12 rounded-sm border border-slate-100 shadow-sm">
            <div className="animate-marquee flex items-center whitespace-nowrap gap-16 py-4">
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, index) => (
                <img
                  key={index}
                  src={logo}
                  alt="Partner Brand"
                  className="h-10 md:h-14 w-auto object-contain brightness-110 contrast-110 transition-transform duration-300 hover:scale-110 mx-6 drop-shadow-sm"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 45s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
};

export default Partners;