import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { 
  FiGlobe, FiLayout, FiLock, FiSmartphone, 
  FiSettings, FiCpu, FiCheckCircle 
} from "react-icons/fi";

const INDUSTRIES_SERVED = "Oil & Gas | Corporate | Financial | Healthcare | Utilities | Retail | Fast Food";

const SERVICES_DATA = [
  {
    id: "website-design",
    title: "Website Design & Digital Growth",
    headline: "Custom Websites & Digital Growth",
    intro: "Responsive designs that attract customers and grow your brand online with modern UX/UI.",
    keyServices: ["UX/UI Design", "E-commerce Development", "Digital Marketing Integration", "Website Maintenance"],
    icon: <FiLayout />,
    industries: INDUSTRIES_SERVED
  },
  {
    id: "ai-qa",
    title: "AI Search Quality & Validation",
    headline: "AI Search Quality & Validation",
    intro: "Optimize AI models, healthcare AI, and enterprise knowledge systems for accuracy and compliance.",
    keyServices: ["AI Search Quality", "Human-in-the-Loop Eval", "Healthcare AI Validation", "Knowledge Search QA"],
    icon: <FiCpu />,
    industries: "Healthcare | Enterprise | Technology | Finance | Retail"
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
    id: "managed-it",
    title: "Managed IT",
    headline: "Proactive Technical Support",
    intro: "Endpoint and network management with rapid response troubleshooting nationwide.",
    keyServices: ["Remote Monitoring", "Patch Management", "Disaster Recovery", "Business Continuity"],
    icon: <FiSettings />,
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
    id: "structured-cabling",
    title: "Structured Cabling / A/V / Surveillance",
    headline: "Reliable Network & AV Infrastructure",
    intro: "We design and implement cabling networks and A/V solutions that keep your business connected and secure.",
    keyServices: ["Cat5e / Cat6 / Fiber Optic", "Data Center & Server Room Build", "Cable Management & Labeling", "CCTV & IP Surveillance", "Conference Room AV"],
    icon: <FiGlobe />,
    industries: INDUSTRIES_SERVED
  }
];

const Services = () => {
  const { id } = useParams();
  const defaultTab = SERVICES_DATA[0].id;
  const [activeTab, setActiveTab] = useState(id || defaultTab);

  // Synchronize state when URL parameter changes
  useEffect(() => {
    if (id && SERVICES_DATA.some(s => s.id === id)) {
      setActiveTab(id);
    }
  }, [id]);

  const handleTabClick = (serviceId) => {
    setActiveTab(serviceId);
    
    // Update URL without triggering navigation
    window.history.pushState(null, '', `/services/${serviceId}`);

    // Keep focus on services section
    const servicesEl = document.getElementById('services');
    if (servicesEl) {
      servicesEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-[#001f3f] mb-4">
            Our Services
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            Strategic IT infrastructure and support tailored for enterprise-level demands.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {SERVICES_DATA.map((service) => (
            <button
              key={service.id}
              onClick={() => handleTabClick(service.id)}
              aria-pressed={activeTab === service.id}
              aria-label={`View ${service.title} service`}
              className={`flex items-center px-5 py-2.5 rounded-full font-bold text-xs md:text-sm transition-all duration-300 border-2 ${
                activeTab === service.id
                  ? "bg-[#001f3f] border-[#001f3f] text-white shadow-xl scale-105"
                  : "bg-white border-slate-200 text-slate-500 hover:border-[#001f3f] hover:text-[#001f3f]"
              }`}
            >
              <span className="text-lg mr-2" aria-hidden="true">
                {service.icon}
              </span>
              {service.title}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
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

              {/* Service Features */}
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

              {/* Footer */}
              <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-md">
                  <span className="text-[11px] text-[#001f3f] font-black uppercase tracking-[0.3em] block mb-3">
                    Industries Served
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentService.industries.split('|').map((ind, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] bg-slate-100 text-[#001f3f] px-3 py-1.5 rounded-lg font-bold uppercase border border-slate-200"
                      >
                        {ind.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={handleConsultClick}
                  className="bg-[#001f3f] hover:bg-[#003366] text-white font-black py-5 px-12 rounded-2xl transition-all shadow-lg hover:shadow-[#001f3f]/30 active:scale-95 text-center w-full md:w-auto"
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