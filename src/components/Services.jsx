import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { 
  FiGlobe, FiLayout, FiLock, FiSmartphone, 
  FiSettings, FiCpu, FiCheckCircle 
} from "react-icons/fi";

// Consistent Industry list for professional display
const INDUSTRIES_SERVED = "Oil & Gas | Corporate | Financial | Healthcare | Utilities | Retail | Food Service";

const SERVICES_DATA = [
  {
    id: "website-design",
    title: "Custom Websites",
    headline: "Custom Websites & Digital Growth",
    intro: "Engineered for speed, SEO, and user experience. We build responsive digital interfaces that convert traffic into revenue.",
    keyServices: ["UX/UI Design Architecture", "E-commerce Development", "Digital Marketing Integration", "Continuous Maintenance"],
    icon: <FiLayout />,
    industries: INDUSTRIES_SERVED
  },
  {
    id: "ai-qa",
    title: "AI Search Quality",
    headline: "AI Search Quality & Validation",
    intro: "Validation and tuning for Large Language Models and enterprise search engines. Ensuring data accuracy in the AI era.",
    keyServices: ["Search Quality Evaluation", "Human-in-the-Loop Validation", "Healthcare AI Compliance", "Dataset Accuracy Audits"],
    icon: <FiCpu />,
    industries: "Healthcare | Technology | Finance | Retail | Legal"
  },
  {
    id: "structured-cabling",
    title: "Telecom & AV",
    headline: "Low Voltage, Telecom & AV Infrastructure",
    intro: "High-density fiber, copper architectures, and smart-room technology designed for 99.9% uptime.",
    keyServices: ["Cat6 & Fiber Optic Cabling", "Data Center / Server Room Build", "IP Surveillance & Security", "Conference Room AV Systems"],
    icon: <FiGlobe />,
    industries: INDUSTRIES_SERVED
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    headline: "Threat Protection & Compliance",
    intro: "Hardening your perimeter with zero-trust architecture, real-time detection, and comprehensive security audits.",
    keyServices: ["Endpoint & Perimeter Defense", "Penetration Testing", "Compliance & Risk Audits", "24/7 Incident Response"],
    icon: <FiLock />,
    industries: INDUSTRIES_SERVED
  },
  {
    id: "managed-it",
    title: "Managed IT Support",
    headline: "Managed IT Support Operations",
    intro: "Proactive systems management. We monitor your infrastructure while you focus on scaling your core business.",
    keyServices: ["Proactive Remote Monitoring", "Patch & Asset Management", "Disaster Recovery Planning", "Business Continuity Strategy"],
    icon: <FiSettings />,
    industries: INDUSTRIES_SERVED
  },
  {
    id: "desktop-support",
    title: "Desktop Support",
    headline: "Onsite & Remote Support",
    intro: "Rapid-response resolution across all endpoints. Dependable support to keep your workforce productive.",
    keyServices: ["Hardware & Software Lifecycle", "Identity & Access Management", "Employee Technical Training", "Mobile Device Management"],
    icon: <FiSmartphone />,
    industries: INDUSTRIES_SERVED
  }
];

const Services = () => {
  const { id } = useParams();
  const defaultTab = SERVICES_DATA[0].id;
  const [activeTab, setActiveTab] = useState(id || defaultTab);

  useEffect(() => {
    if (id && SERVICES_DATA.some(s => s.id === id)) {
      setActiveTab(id);
    }
  }, [id]);

  const handleTabClick = (serviceId) => {
    setActiveTab(serviceId);
    window.history.pushState(null, '', `/services/${serviceId}`);
    
    // Smoothly focus on content area when switching
    const servicesEl = document.getElementById('services');
    if (servicesEl) {
      servicesEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleConsultClick = (e) => {
    e.preventDefault();
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentService = SERVICES_DATA.find(s => s.id === activeTab) || SERVICES_DATA[0];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 scroll-mt-20" id="services">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header - Underline Removed */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-[#001f3f] mb-6 uppercase tracking-tighter">
            Enterprise Solutions
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            Nationwide IT infrastructure and managed support tailored for high-demand business environments.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {SERVICES_DATA.map((service) => (
            <button
              key={service.id}
              onClick={() => handleTabClick(service.id)}
              className={`flex items-center px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-widest transition-all duration-300 border-2 ${
                activeTab === service.id
                  ? "bg-[#001f3f] border-[#001f3f] text-white shadow-xl"
                  : "bg-white border-slate-200 text-slate-500 hover:border-orange-600 hover:text-[#001f3f]"
              }`}
            >
              <span className="text-base mr-3" aria-hidden="true">{service.icon}</span>
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
              className="bg-white rounded-sm p-8 md:p-14 shadow-2xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-10">
                <div className="text-6xl md:text-7xl text-orange-600 bg-slate-50 p-8 rounded-sm shrink-0">
                  {currentService.icon}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-black text-[#001f3f] mb-4 uppercase tracking-tight">
                    {currentService.headline}
                  </h3>
                  <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
                    {currentService.intro}
                  </p>
                </div>
              </div>

              {/* Service Features */}
              <div className="grid sm:grid-cols-2 gap-4 mb-12">
                {currentService.keyServices.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center text-slate-700 font-bold bg-slate-50 p-5 rounded-sm border-l-4 border-orange-600 hover:bg-slate-100 transition-colors"
                  >
                    <FiCheckCircle className="w-5 h-5 text-orange-600 mr-4 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-md">
                  <span className="text-[10px] text-orange-600 font-black uppercase tracking-[0.3em] block mb-3 font-mono">
                    Sector_Focus
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentService.industries.split('|').map((ind, i) => (
                      <span 
                        key={i} 
                        className="text-[9px] bg-white text-[#001f3f] px-3 py-1.5 rounded-sm font-bold uppercase border border-slate-200"
                      >
                        {ind.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={handleConsultClick}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-black py-5 px-12 rounded-sm transition-all shadow-lg hover:shadow-orange-600/20 active:scale-95 text-xs uppercase tracking-widest w-full md:w-auto"
                >
                  Consult an Expert →
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Services;