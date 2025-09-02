import React, { useState } from "react";
import "./Projects.css";

const projectData = {
  "structured-cabling": [
    {
      title: "Corporate Structured Cabling",
      desc: "Designed and implemented Cat6 and fiber optic cabling for a corporate office, ensuring high-speed connectivity and reliable network performance.",
    },
    {
      title: "Data Center Cabling",
      desc: "Structured cabling for a data center with proper labeling, cable management, and redundancy for seamless operations.",
    },
  ],
  "ip-surveillance": [
    {
      title: "CCTV Installation for Retail Chain",
      desc: "Deployed IP cameras and access control systems to enhance security and monitoring across multiple retail locations.",
    },
    {
      title: "Banking Security Systems",
      desc: "Implemented advanced surveillance and remote monitoring for a banking institution to reduce security risks.",
    },
  ],
  telecom: [
    {
      title: "VoIP & Video Conferencing Setup",
      desc: "Installed unified communication systems including VoIP phones and video conferencing for corporate offices.",
    },
    {
      title: "PBX System Deployment",
      desc: "Configured PBX and call routing systems for seamless internal and external communication for a fast food chain.",
    },
  ],
  "av-solutions": [
    {
      title: "Conference Room AV",
      desc: "Installed digital signage, sound systems, and intercoms in corporate meeting rooms for enhanced presentations.",
    },
    {
      title: "Retail A/V Installations",
      desc: "Integrated AV solutions in retail stores and fast food facilities to improve customer experience and communication.",
    },
  ],
  "website-design": [
    {
      title: "E-commerce Website",
      desc: "Developed a responsive online store with integrated payment solutions and SEO optimization for a retail brand.",
    },
    {
      title: "Corporate Website",
      desc: "Created a modern, user-friendly website for a corporate office, including CMS and lead generation forms.",
    },
  ],
  cybersecurity: [
    {
      title: "Vulnerability Assessment",
      desc: "Performed comprehensive security audits, threat detection, and penetration testing for an oil & gas company.",
    },
    {
      title: "Firewall & Endpoint Protection",
      desc: "Deployed advanced firewalls and endpoint protection for a healthcare provider to safeguard critical data.",
    },
  ],
  "desktop-support": [
    {
      title: "Onsite & Remote IT Support",
      desc: "Delivered responsive desktop support, hardware installation, and user account management for a corporate office.",
    },
    {
      title: "Helpdesk Services",
      desc: "Provided 24/7 ticketing system support and remote troubleshooting across multiple client locations.",
    },
  ],
  "managed-it": [
    {
      title: "Managed IT Services",
      desc: "Implemented remote monitoring, patch management, and disaster recovery solutions for a nationwide retail chain.",
    },
    {
      title: "Network & Endpoint Management",
      desc: "Delivered proactive IT support and technical management for banks and corporate offices.",
    },
  ],
};

const tabs = {
  "structured-cabling": "Structured Cabling",
  "ip-surveillance": "IP Surveillance",
  telecom: "Telecom & UC",
  "av-solutions": "A/V Solutions",
  "website-design": "Website Design",
  cybersecurity: "Cybersecurity",
  "desktop-support": "Desktop Support",
  "managed-it": "Managed IT",
};

const Projects = () => {
  const [activeTab, setActiveTab] = useState("structured-cabling");

  return (
    <section className="projects-section" id="projects">
      <h2 className="section-title">Our Projects</h2>
      <p className="section-subtitle">
        Explore the real-world impact we've made across industries.
      </p>

      {/* Tabs */}
      <div className="project-tabs">
        {Object.keys(tabs).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={activeTab === key ? "active" : ""}
          >
            {tabs[key]}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="project-grid">
        {projectData[activeTab].map((item, index) => (
          <div key={index} className="project-card">
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
