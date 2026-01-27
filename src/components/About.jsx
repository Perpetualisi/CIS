import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TAB_DATA = {
  about: {
    label: "About Us",
    content: (
      <div className="space-y-4">
        <p>
          <strong>Conotex Integrated Services (CIS)</strong>, a division of Conotex Systems & Energy Services LLC, is a trusted nationwide provider of low-voltage and managed IT solutions. Since 2011, we have partnered with leading brands to design, deploy, and manage critical infrastructure.
        </p>
        <p>
          Our services span structured cabling, IP surveillance, telecom, A/V systems, and custom digital solutions. With experienced engineers and project managers, we deliver scalable solutions that keep businesses future-ready.
        </p>
      </div>
    ),
  },
  mission: {
    label: "Mission",
    content: (
      <p>
        To empower businesses with innovative, reliable, and scalable IT solutions that simplify complexity and drive sustainable growth through proactive support and tailored strategies.
      </p>
    ),
  },
  vision: {
    label: "Vision",
    content: (
      <p>
        To be the leading nationwide IT provider, recognized for transformative technology solutions that create a connected, secure, and digitally empowered world.
      </p>
    ),
  },
  values: {
    label: "Values",
    content: (
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        {[
          { title: "Integrity", desc: "Honesty and accountability." },
          { title: "Innovation", desc: "Forward-thinking solutions." },
          { title: "Excellence", desc: "Highest performance standards." },
          { title: "Customer Focus", desc: "Tailored strategies." },
          { title: "Reliability", desc: "Dependable nationwide support." },
        ].map((val) => (
          <li key={val.title} className="flex flex-col">
            <span className="font-bold text-[#003366]">{val.title}</span>
            <span className="text-sm text-gray-600">{val.desc}</span>
          </li>
        ))}
      </ul>
    ),
  },
};

const About = () => {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <section id="about" className="py-20 px-4 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Visual Media Section */}
        <div className="relative w-full lg:w-1/2 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#003366] to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl bg-white">
            <video
              src="/about.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Text Content Section */}
        <div className="w-full lg:w-1/2 flex flex-col text-left">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6">
            Who We Are
          </h2>
          {/* The line previously here has been removed */}
          
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            At Conotex Integrated Services, we deliver reliable, scalable, and secure IT solutions nationwide.
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
            {Object.keys(TAB_DATA).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                aria-selected={activeTab === key}
                role="tab"
                className={`relative px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === key ? "text-[#003366]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {TAB_DATA[key].label}
                {activeTab === key && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003366]" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* Animated Content Area */}
          <div className="min-h-[200px] text-gray-700 leading-relaxed">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {TAB_DATA[activeTab].content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;