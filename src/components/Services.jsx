import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiGlobe, 
  FiShield, 
  FiPhone, 
  FiVideo, 
  FiLayout, 
  FiLock, 
  FiSmartphone, 
  FiSettings, 
  FiCpu,
  FiCheckCircle 
} from "react-icons/fi";

// Global industry list to ensure consistency across all service tabs
const INDUSTRIES_SERVED = "Oil & Gas | Corporate | Financial | Healthcare | Utilities | Retail | Fast Food";

const SERVICES_DATA = [
  {
    id: "structured-cabling",
    title: "Structured Cabling",
    headline: "Reliable Network Infrastructure Nationwide",
    intro: "We design and implement cabling networks that keep your business connected, reliable, and scalable for growth.",
    keyServices: ["Cat5e / Cat6 / Fiber Optic", "Data Center & Server Room Build", "Custom Network Design", "Cable Management & Labeling", "Troubleshooting & Maintenance"],
    icon: <FiGlobe />,
    industries: INDUSTRIES_SERVED
  },
  {
    id: "ip-surveillance",
    title: "IP Surveillance",
    headline: "Advanced Security & Monitoring",
    intro: "Protect your assets, employees, and customers 24/7 with smart surveillance and instant alerts.",
    keyServices: ["CCTV Installation", "Smart Access Control", "Remote Monitoring", "System Upgrades", "Ongoing Maintenance"],
    icon: <FiShield />,
    industries: INDUSTRIES_SERVED
  },
  {
    id: "telecom",
    title: "Telecom & UC",
    headline: "Unified Communication Solutions",
    intro: "Streamline team collaboration and reduce downtime with modern VoIP and video conferencing.",
    keyServices: ["VoIP Setup & Integration", "Video Conferencing Systems", "PBX Solutions", "System Support"],
    icon: <FiPhone />,
    industries: INDUSTRIES_SERVED
  },
  {
    id: "av-solutions",
    title: "A/V Solutions",
    headline: "Modern A/V for Workspaces",
    intro: "Enhance presentations and customer experiences with high-end audio/visual technology.",
    keyServices: ["Conference Room AV", "Digital Signage", "Interactive Displays", "Intercom Systems"],
    icon: <FiVideo />,
    industries: INDUSTRIES_SERVED
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    headline: "Threat Protection & Compliance",
    intro: "Securing your business against cyber threats, ensuring compliance and zero downtime.",
    keyServices: ["Threat Detection", "Firewall & Endpoint Protection", "Penetration Testing", "Security Audits", "24/7 Incident Response"],
    icon: <FiLock />,
    industries: INDUSTRIES_SERVED
  },
  {
    id: "website-design",
    title: "Website Design",
    headline: "Custom Websites & Digital Growth",
    intro: "Responsive designs that attract customers and grow your brand online with modern UX/UI.",
    keyServices: ["UX/UI Design", "E-commerce Development", "Digital Marketing Integration", "Website Maintenance"],
    icon: <FiLayout />,
    industries: INDUSTRIES_SERVED
  },
  {
    id: "desktop-support",
    title: "Desktop Support",
    headline: "Onsite & Remote Support",
    intro: "Fast, dependable technical support to keep your workforce productive at all times.",
    keyServices: ["Hardware/Software Install", "Access Management", "Device Support", "IT Training"],
    icon: <FiSmartphone />,
    industries: INDUSTRIES_SERVED
  },
  {
    id: "managed-it",
    title: "Managed IT",
    headline: "Proactive Technical Support",
    intro: "Endpoint and network management with rapid response troubleshooting nationwide.",
    keyServices: ["Remote Monitoring", "Patch Management", "Disaster Recovery", "Business Continuity"],
    icon: <FiSettings />,
    industries: INDUSTRIES_SERVED
  },
  {
    id: "ai-qa",
    title: "AI & QA",
    headline: "AI Search Quality & Validation",
    intro: "Optimize AI models, healthcare AI, and enterprise knowledge systems for accuracy and compliance.",
    keyServices: ["AI Search Quality", "Human-in-the-Loop Eval", "Healthcare AI Validation", "Knowledge Search QA"],
    icon: <FiCpu />,
    industries: "Healthcare | Enterprise | Technology | Finance | Retail"
  }
];

const Services = () => {
  const [activeTab, setActiveTab] = useState(SERVICES_DATA[0].id);
  const currentService = SERVICES_DATA.find(s => s.id === activeTab);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50" id="services">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-[#001f3f] mb-4">
            Our Services
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            Strategic IT infrastructure and support tailored for enterprise-level demands.
          </p>
        </div>

        {/* Tabbed Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {SERVICES_DATA.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveTab(service.id)}
              className={`flex items-center px-5 py-2.5 rounded-full font-bold text-xs md:text-sm transition-all duration-300 border-2 ${
                activeTab === service.id
                  ? "bg-[#001f3f] border-[#001f3f] text-white shadow-xl scale-105"
                  : "bg-white border-slate-200 text-slate-500 hover:border-[#001f3f] hover:text-[#001f3f]"
              }`}
            >
              <span className="text-lg mr-2">{service.icon}</span>
              {service.title}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-10">
                <div className="text-6xl md:text-7xl text-[#001f3f] bg-slate-50 p-8 rounded-3xl shrink-0">
                  {currentService.icon}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-black text-[#001f3f] mb-4">
                    {currentService.headline}
                  </h3>
                  <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
                    {currentService.intro}
                  </p>
                </div>
              </div>

              {/* Service Features Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-12">
                {currentService.keyServices.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center text-slate-700 font-bold bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors"
                  >
                    <FiCheckCircle className="w-6 h-6 text-[#001f3f] mr-4 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-md">
                  <span className="text-[11px] text-[#001f3f] font-black uppercase tracking-[0.3em] block mb-3">
                    Industries Served
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentService.industries.split('|').map((ind, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-[#001f3f] px-3 py-1.5 rounded-lg font-bold uppercase border border-slate-200">
                        {ind.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                
                <a 
                  href="#contact" 
                  className="bg-[#001f3f] hover:bg-[#003366] text-white font-black py-5 px-12 rounded-2xl transition-all shadow-lg hover:shadow-[#001f3f]/30 active:scale-95 text-center w-full md:w-auto"
                >
                  Consult an Expert →
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default Services;