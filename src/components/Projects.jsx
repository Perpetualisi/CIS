import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuExternalLink, LuBriefcase } from "react-icons/lu";

const PROJECT_DATA = {
  "structured-cabling": [
    { title: "MMC Marsh McLennan Agency", desc: "Network Migration & Decommission across multiple units, boosting scalability." },
    { title: "McDonald’s", desc: "Delivered enterprise network migration across corporate and franchise sites." },
    { title: "East End Lofts Apartments", desc: "Full MDF/IDF build with fiber, Cat6, and coax; installed switches, routers, and CradlePoint APs." },
    { title: "Sprouts Farmers Market", desc: "Integrated CCTV, AV, and network migration for enhanced in-store operations." },
    { title: "Wal-Mart", desc: "Upgraded store networks and refreshed POS infrastructure, improving uptime." },
    { title: "Porsche (Sugar Land, TX)", desc: "MDF/IDF build with Cat6 cabling and 5-floor camera/speaker installation." },
    { title: "Texas State Prisons", desc: "High-security infrastructure for inmate tablet access involving hundreds of APs." },
  ],
  "ip-surveillance": [
    { title: "Nova Source Power", desc: "Outdoor surveillance with cameras and horn speakers for site safety." },
    { title: "Sprouts Farmers Market", desc: "Comprehensive in-store surveillance and monitoring systems." },
    { title: "Porsche (Sugar Land, TX)", desc: "5-floor surveillance integration for newly constructed dealership." },
  ],
  telecom: [
    { title: "BP – Cisco Phone Migration", desc: "Migrated enterprise telephony to Cisco UC platform for global collaboration." },
    { title: "METRO Authority", desc: "Deployed 9,000+ smart beacons for real-time bus visibility and accessibility features." },
    { title: "Palacios Prescription Shoppe", desc: "Complete upgrade with Starlink Gen 3 and Grandstream PBX unified communications." },
    { title: "O’Reilly Auto Parts", desc: "VoIP implementation across multiple locations for cost efficiency." },
  ],
  "av-solutions": [
    { title: "BP Global", desc: "Enterprise-grade Telepresence solutions for seamless global collaboration." },
    { title: "Sprouts Farmers Market", desc: "Integrated AV solutions into retail environments for customer experience." },
    { title: "Porsche Dealership", desc: "Integrated overhead and floor speaker systems synced with CCTV." },
  ],
  "website-design": [
    { title: "Conotex Tech", desc: "Corporate site with responsive design and integrated client engagement features.", link: "https://www.conotextech.com/" },
    { title: "E-commerce Store", desc: "Secure checkout and scalable product management on Vercel.", link: "https://my-ecommerce-nine-iota.vercel.app/" },
    { title: "Iko Corporate", desc: "Modern platform focused on brand identity and seamless navigation.", link: "https://weareiko.com" }
  ],
  cybersecurity: [
    { title: "BP Infrastructure", desc: "Firewall policies, endpoint protection, and access controls for Oil & Gas assets." },
    { title: "Shell Energy", desc: "Security hardening, patch management, and threat monitoring across servers." },
    { title: "Morgan Stanley", desc: "Advanced network monitoring and compliance protocols for sensitive financial data." },
    { title: "Wells Fargo", desc: "System security refresh during enterprise upgrades and encryption verification." },
  ],
  "desktop-support": [
    { title: "Shell Global", desc: "Enterprise-level desktop support and network administration for 24/7 operations." },
    { title: "MD Anderson Cancer Center", desc: "Windows refresh and network migration alongside Epic deployment." },
    { title: "Memorial Hermann", desc: "Epic refresh initiative and M48 Cart maintenance for clinical efficiency." },
  ],
  "managed-it": [
    { title: "Morgan Stanley", desc: "Managed IT operations, helpdesk support, and end-user assistance for efficiency." },
    { title: "O’Reilly Auto Parts", desc: "Managed VoIP and IT helpdesk support for nationwide infrastructure." },
    { title: "East End Lofts", desc: "Full post-installation network operations management and troubleshooting." },
  ],
};

const TABS = {
  "structured-cabling": "Cabling",
  "ip-surveillance": "Security",
  telecom: "Telecom",
  "av-solutions": "A/V",
  "website-design": "Web Design",
  cybersecurity: "Cyber",
  "desktop-support": "IT Support",
  "managed-it": "Managed IT",
};

const Projects = () => {
  const [activeTab, setActiveTab] = useState("structured-cabling");

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50" id="projects">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Orange line removed */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-[#001f3f] mb-6">
            Our Projects
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            Strategic infrastructure and technology deployments across major industries worldwide.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {Object.entries(TABS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border-2 ${
                activeTab === key
                  ? "bg-[#001f3f] border-[#001f3f] text-white shadow-lg scale-105"
                  : "bg-white border-slate-200 text-slate-500 hover:border-[#001f3f] hover:text-[#001f3f]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Projects Grid with Animation */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[450px]"
        >
          <AnimatePresence mode="popLayout">
            {PROJECT_DATA[activeTab].map((project, index) => (
              <motion.div
                key={`${activeTab}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#001f3f] group-hover:text-white transition-colors duration-300">
                    <LuBriefcase className="text-xl" />
                  </div>
                  <h3 className="text-[#001f3f] font-black text-xl mb-3 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {project.desc}
                  </p>
                </div>

                {project.link && (
                  <div className="mt-8">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#001f3f] font-bold text-sm hover:translate-x-1 transition-transform"
                    >
                      View Live Project <LuExternalLink />
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;