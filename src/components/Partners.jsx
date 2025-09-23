import React from "react";
import "./Partners.css";

const partnerLogos = [
  "/Partners/logo1.png",
  "/Partners/logo2.png",
  "/Partners/logo3.png",
  "/Partners/logo4.jpeg",
  "/Partners/logo5.png",
  "/Partners/logo6.jpg",
  "/Partners/logo7.jpg",
  "/Partners/logo8.png",
  "/Partners/logo9.png",
  "/Partners/logo10.png",
  "/Partners/logo11.png",
  "/Partners/logo12.webp",
  "/Partners/logo13.png",
  "/Partners/logo14.jpg",
  "/Partners/logo15.png",
  "/Partners/logo16.webp",
  "/Partners/logo17.png",
  "/Partners/logo18.jpg",
  "/Partners/logo19.jpeg",
  "/Partners/logo20.jpeg",
];

const clientCategories = [
  {
    category: "Healthcare",
    clients: [
      "MD Anderson Cancer Center – Network Migration & Windows Refresh, Epic EHR Support",
      "United Healthcare – Enterprise Network Migration & Epic Projects",
      "Memorial Hermann – Epic Refresh Project & M48 Cart Maintenance",
    ],
  },
  {
    category: "Financial Institutions",
    clients: [
      "Wells Fargo – Enterprise Systems Refresh & Security Compliance",
      "Bank of America – Systems Refresh for Modernized Infrastructure",
      "Morgan Stanley – Managed IT, Network Migrations & Cybersecurity",
    ],
  },
  {
    category: "Oil & Gas",
    clients: [
      "Shell – Desktop Support, Network Admin, Security Hardening",
      "BP – Cisco Phone Migration, AV/Telepresence Deployments, Cybersecurity",
    ],
  },
  {
    category: "Retail & Commercial",
    clients: [
      "Walmart – Network Migration & POS Refresh",
      "Target – POS Refresh with ELO Tablets",
      "Kohl’s – Access Point Refresh",
      "HEB – RFID Installation",
      "McDonald’s – Network Migration",
      "Sprouts Farmers Market – CCTV, AV & Network Migration",
      "O’Reilly Auto Parts – VoIP Implementation",
      "Porche Car Dealership (Sugar Land, TX) – Network & CCTV Installation",
      "East End Lofts Apartments (Houston, TX) – End-to-End Network Migration",
    ],
  },
  {
    category: "Government & Transportation",
    clients: [
      "Texas State Prisons – Network Migration & Secure AP Deployment",
      "METRO (Metropolitan Transportation Authority) – Beacon Deployment across 9,000+ bus stops",
    ],
  },
  {
    category: "Power & Utilities",
    clients: ["Nova Source Power – CCTV & Outdoor Security Installations"],
  },
  {
    category: "Media & Entertainment",
    clients: ["Movie Center – Telecom VoIP Migration"],
  },
];

const Partners = () => {
  return (
    <section id="partners" className="partners-section">
      <h2 className="partners-heading">
        Our <span>Clients</span>
      </h2>

      <p className="partners-intro">
        At Conotex Tech, we deliver innovative technology solutions across industries.
        From healthcare to finance, retail, energy, and government, we ensure reliability, security, and efficiency in every project.
      </p>

      {/* Featured Clients */}
      <div className="clients-grid">
        {clientCategories.map((category, idx) => (
          <div key={idx} className="client-card">
            <h3 className="client-category">{category.category}</h3>
            <ul>
              {category.clients.map((client, index) => (
                <li key={index}>{client}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="clients-cta">
       Our success is measured by the trust of our clients and the results we deliver.
      </p>

      {/* Partner Logos */}
      <h3 className="partners-heading">Clients Logos</h3>
      <div className="partners-grid">
        {partnerLogos.map((logo, index) => (
          <div key={index} className="partner-logo">
            <img src={logo} alt={`Partner ${index + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Partners;
