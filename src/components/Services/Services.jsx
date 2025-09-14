import React from "react";
import "./Services.css";

const services = [
  {
    id: "structured-cabling",
    title: "Structured Cabling",
    headline: "Reliable Structured Cabling & Network Infrastructure Nationwide",
    intro: "CIS provides end-to-end structured cabling and network infrastructure solutions for businesses across oil & gas, banking, fast food, retail, corporate offices, and more. From design and installation to maintenance, we ensure your network runs flawlessly—supporting both day-to-day operations and long-term growth.",
    keyServices: [
      "Cat5e / Cat6 / Fiber optic cabling",
      "Data center and server room cabling",
      "Network design & implementation",
      "Cable management & labeling",
      "Troubleshooting & maintenance",
    ],
    industries: "Oil & Gas | Banks & Financial Institutions | Fast Food Facilities | Retail Stores | Corporate Offices | Healthcare | Education",
    cta: "Get Your Free Structured Cabling Consultation →",
  },
  {
    id: "ip-surveillance",
    title: "IP Surveillance",
    headline: "Protect Your Business with Advanced IP Surveillance & Security",
    intro: "Keep your assets and personnel safe with CIS’s IP surveillance and security systems. Our solutions include CCTV, access control, and monitoring services tailored for oil & gas sites, banking institutions, retail stores, and fast food chains.",
    keyServices: [
      "CCTV & video surveillance installation",
      "Access control systems",
      "Remote monitoring & alerts",
      "Security system maintenance & upgrades",
    ],
    industries: "Oil & Gas | Banks & Financial Institutions | Fast Food Facilities | Retail Stores | Corporate Offices",
    cta: "Schedule a Security Assessment Today →",
  },
  {
    id: "telecom",
    title: "Telecom",
    headline: "Seamless Telecom & Unified Communication Solutions",
    intro: "CIS designs and deploys telecom and unified communication systems that keep your teams connected. We implement voice, video, and collaboration tools that enhance efficiency and reduce downtime.",
    keyServices: [
      "VoIP setup & integration",
      "Video conferencing systems",
      "PBX & unified communication solutions",
      "System maintenance & support",
    ],
    industries: "Oil & Gas | Banks & Financial Institutions | Fast Food Facilities | Retail Stores | Corporate Offices",
    cta: "Request a Telecom & UC Consultation →",
  },
  {
    id: "av-solutions",
    title: "A/V Solutions",
    headline: "Modern A/V Solutions for Workspaces & Retail Environments",
    intro: "CIS provides state-of-the-art audio/visual solutions for conference rooms, training centers, corporate offices, retail stores, and fast food locations. We integrate technology that enhances communication, presentations, and customer experiences.",
    keyServices: [
      "Conference room AV systems",
      "Digital signage & displays",
      "Sound systems & intercoms",
      "Installation & maintenance",
    ],
    industries: "Corporate Offices | Retail Stores | Fast Food Facilities | Education | Healthcare",
    cta: "Upgrade Your AV Systems Today →",
  },
  {
    id: "website-design",
    title: "Website Design",
    headline: "Build Your Digital Presence with Custom Websites & Solutions",
    intro: "CIS designs modern, responsive websites and digital solutions that help businesses stand out online. We create websites that attract customers, streamline operations, and generate leads.",
    keyServices: [
      "Responsive website design",
      "E-commerce development",
      "Digital marketing integration",
      "Website maintenance & updates",
    ],
    industries: "Retail Stores | Fast Food Facilities | Corporate Offices | Small & Medium Enterprises",
    cta: "Request Your Custom Website Quote →",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    headline: "Protect Your Business with Comprehensive Cybersecurity Solutions",
    intro: "CIS safeguards your business from evolving cyber threats with advanced cybersecurity solutions. We deliver proactive protection, compliance support, and continuous monitoring.",
    keyServices: [
      "Threat detection & prevention",
      "Firewall & endpoint protection",
      "Vulnerability assessments & penetration testing",
      "Security compliance & audits",
      "24/7 security monitoring & incident response",
    ],
    industries: "Oil & Gas | Banks & Financial Institutions | Fast Food Facilities | Retail Stores | Corporate Offices | Healthcare | Education",
    cta: "Schedule a Cybersecurity Risk Assessment →",
  },
  {
    id: "desktop-support",
    title: "Desktop Support",
    headline: "Reliable Onsite & Remote Desktop Support for Your Workforce",
    intro: "CIS provides fast, dependable desktop support services to ensure your employees stay productive, delivering both onsite and remote support for software, hardware, and user needs.",
    keyServices: [
      "Onsite & remote desktop troubleshooting",
      "Hardware & software installation",
      "User account & access management",
      "Printer, peripheral & device support",
      "Employee onboarding & IT training",
    ],
    industries: "Corporate Offices | Retail Stores | Fast Food Facilities | Banks & Financial Institutions | Healthcare | Education",
    cta: "Request Reliable Desktop Support Today →",
  },
  {
    id: "managed-it",
    title: "Managed IT",
    headline: "Fast, Reliable Managed IT & Technical Support Nationwide",
    intro: "CIS delivers proactive IT support and managed services to ensure your business runs smoothly. Our team provides rapid response troubleshooting, maintenance, and network monitoring.",
    keyServices: [
      "Endpoint & network support",
      "Remote monitoring & management",
      "Patch management & updates",
      "Business continuity & disaster recovery",
    ],
    industries: "Oil & Gas | Banks & Financial Institutions | Fast Food Facilities | Retail Stores | Corporate Offices | Healthcare",
    cta: "Get Your Managed IT Quote Today →",
  },
];

const Services = () => {
  return (
    <section className="services-section" id="services">
      <h2 className="section-title">Our Services</h2>

      {/* Tabs / Navigation */}
      <ul className="services-nav">
        {services.map((service) => (
          <li key={service.id}>
            <a href={`#${service.id}`}>{service.title}</a>
          </li>
        ))}
      </ul>

      {/* Service Details */}
      <div className="services-details">
        {services.map((service) => (
          <div key={service.id} id={service.id} className="service-block">
            <h3>{service.headline}</h3>
            <p>{service.intro}</p>

            <h4>Key Services:</h4>
            <ul>
              {service.keyServices.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <p><strong>Industries Served:</strong> {service.industries}</p>

            <button className="service-cta">{service.cta}</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;











