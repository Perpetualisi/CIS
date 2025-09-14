import React, { useState } from "react";
import "./Projects.css";

const projectData = {
  "structured-cabling": [
    {
      title: "MMC Marsh McLennan Agency – Network Migration & Decommission",
      desc: "Migrated and decommissioned legacy networks across multiple units, boosting scalability.",
    },
    {
      title: "McDonald’s – Enterprise Network Migration",
      desc: "Delivered network migration across corporate and franchise sites.",
    },
    {
      title: "East End Lofts Apartments (Houston, TX) – Full Network Migration & Infrastructure Build",
      desc: "Built MDF and IDF with fiber, Cat6, and coax cabling; installed switches, routers, gateways, OpenGear, and CradlePoint APs to deliver a complete end-to-end network solution.",
    },
    {
      title: "Sprouts Farmers Market – Network Migration, CCTV & AV Installations",
      desc: "Integrated CCTV, AV, and network migration for enhanced in-store operations.",
    },
    {
      title: "Wal-Mart – Network Migration & POS Refresh",
      desc: "Upgraded store networks and refreshed POS infrastructure, improving uptime and speed.",
    },
    {
      title: "Porsche Car Dealership (Sugar Land, TX) – Network Migration & CCTV Installation",
      desc: "Built MDF and IDF with Cat5/Cat6 cabling; installed cameras and speakers across 5 floors for the newly constructed building.",
    },
    {
      title: "Texas State Prisons – Network Migration & AP Deployment",
      desc: "Built MDF and IDF in multiple units, installed racks, switches, routers, and PDUs, ran Cat6 and fiber cabling, and deployed hundreds of APs to provide inmates with secure tablet access while maintaining full security compliance.",
    },
  ],
  "ip-surveillance": [
    {
      title: "Nova Source Power – CCTV & Outdoor Security Installations",
      desc: "Installed surveillance systems with cameras and horn speakers to enhance site safety.",
    },
    {
      title: "Sprouts Farmers Market – CCTV Installations",
      desc: "Installed in-store surveillance and monitoring systems.",
    },
    {
      title: "Porsche Car Dealership (Sugar Land, TX) – CCTV Installations",
      desc: "Installed surveillance cameras and speakers across 5 floors of the new dealership.",
    },
  ],
  telecom: [
    {
      title: "BP – Cisco Phone Migration",
      desc: "Migrated enterprise telephony to Cisco UC platform for improved collaboration.",
    },
    {
      title: "Movie Center – Telecom VoIP Migration",
      desc: "Migrated legacy phone systems to VoIP, improving communication reliability and reducing costs.",
    },
    {
      title: "O’Reilly Auto Parts – VoIP Implementation",
      desc: "Migrated telecom to VoIP for improved reliability and cost efficiency.",
    },
  ],
  "av-solutions": [
    {
      title: "BP – AV (Telepresence) Installations",
      desc: "Delivered enterprise-grade Telepresence solutions for seamless global collaboration.",
    },
    {
      title: "Sprouts Farmers Market – AV Installations",
      desc: "Integrated AV solutions into retail environments for enhanced operations.",
    },
    {
      title: "Porsche Car Dealership (Sugar Land, TX) – Speaker Installations",
      desc: "Installed overhead and floor speaker systems integrated with CCTV.",
    },
  ],
  "website-design": [
    {
      title: "weareiko.com",
      desc: "A modern corporate platform designed with a focus on brand identity, seamless navigation, and optimized performance for business growth.",
      link: "https://weareiko.com",
    },
    {
      title: "My E-commerce Store",
      desc: "An online store offering a smooth shopping experience, secure checkout, and efficient product management tailored for scalability.",
      link: "https://my-ecommerce-nine-iota.vercel.app/",
    },
    {
      title: "ConotexTech.com",
      desc: "The official corporate site developed with a user-first interface, responsive design, and integrated features to boost client engagement.",
      link: "https://conotextech.com",
    },
  ],
  cybersecurity: [
    {
      title: "BP – Network Security & Endpoint Protection",
      desc: "Implemented enterprise-wide firewall policies, endpoint protection, and access controls to secure critical Oil & Gas infrastructure.",
    },
    {
      title: "Shell – Security Hardening & Patch Management",
      desc: "Performed system hardening, applied security patches across desktops and servers, and monitored network security alerts to reduce vulnerabilities.",
    },
    {
      title: "MMC Marsh McLennan Agency – Data & Network Security Compliance",
      desc: "Ensured secure handling of corporate data during network migration and decommission projects; implemented VPN, secure access, and intrusion detection monitoring.",
    },
    {
      title: "East End Lofts Apartments (Houston, TX) – Network Security Implementation",
      desc: "Configured firewalls, VLAN segmentation, and secure network access controls for residential and commercial tenants.",
    },
    {
      title: "Wells Fargo – Systems Security & Compliance Refresh",
      desc: "Executed security refresh projects during enterprise system upgrades, including access control, encryption, and compliance verification.",
    },
    {
      title: "Morgan Stanley – Cybersecurity Projects",
      desc: "Implemented security measures including endpoint protection, access controls, network monitoring, and compliance protocols to protect sensitive financial data.",
    },
  ],
  "desktop-support": [
    {
      title: "Shell – Desktop Support & Network Administration",
      desc: "Provided enterprise-level desktop support and network administration for global operations, ensuring minimal downtime and rapid issue resolution.",
    },
    {
      title: "BP – Desktop Support & AV (Telepresence) Administration",
      desc: "Delivered ongoing IT support, troubleshooting, and AV/Telepresence system administration for seamless collaboration and operational efficiency.",
    },
    {
      title: "MD Anderson Cancer Center – Windows Refresh",
      desc: "Executed desktop refresh and support alongside network migration and Epic deployment.",
    },
    {
      title: "United Healthcare – Windows Refresh",
      desc: "Supported Epic projects with desktop refresh across enterprise environments.",
    },
    {
      title: "Memorial Hermann Health System – Epic Refresh Project & M48 Cart Maintenance",
      desc: "Implemented Epic refresh initiative and completed M48 Cart maintenance to support clinical staff efficiency.",
    },
  ],
  "managed-it": [
    {
      title: "Morgan Stanley – Managed IT & Technical Support",
      desc: "Provided enterprise-wide network and desktop support, ongoing IT operations management, and end-user technical assistance to ensure operational efficiency and minimal downtime.",
    },
    {
      title: "MMC Marsh McLennan Agency – Managed Network Support",
      desc: "Oversaw daily IT operations, including network monitoring, user support, patch management, and legacy system decommissioning for corporate offices.",
    },
    {
      title: "O’Reilly Auto Parts – Managed VoIP & IT Helpdesk Support",
      desc: "Implemented VoIP systems and provided helpdesk support to troubleshoot and maintain telecommunication infrastructure across multiple locations.",
    },
    {
      title: "East End Lofts Apartments (Houston, TX) – Network & End-User Support",
      desc: "Managed all network operations post-installation, including switch/router configuration, end-user network access support, and ongoing troubleshooting.",
    },
    {
      title: "Data Center Relocation – Corporate Client",
      desc: "Managed end-to-end relocation with zero data loss and minimal downtime.",
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
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-btn"
              >
                Click Here
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
