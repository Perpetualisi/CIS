import React from "react";
import "./Services.css";

const services = [
  {
    id: "structured-cabling",
    title: "Structured Cabling",
    headline: "Reliable Structured Cabling & Network Infrastructure Nationwide",
    intro: "We design and implement cabling networks that keep your business connected, reliable, and scalable for growth.",
    keyServices: [
      "High-performance Cat5e / Cat6 / Fiber optic cabling",
      "Optimized data center and server room cabling",
      "Custom network design & implementation",
      "Organized cable management & labeling",
      "Fast troubleshooting & maintenance",
    ],
    industries: "Oil & Gas | Banks & Financial Institutions | Retail | Corporate Offices | Healthcare | Education",
    cta: "Get Your Free Structured Cabling Consultation →",
  },
  {
    id: "ip-surveillance",
    title: "IP Surveillance",
    headline: "Protect Your Business with Advanced IP Surveillance & Security",
    intro: "Our surveillance solutions help you monitor and protect your assets, employees, and customers 24/7.",
    keyServices: [
      "CCTV & video surveillance installation",
      "Smart access control systems",
      "Remote monitoring & instant alerts",
      "Security system upgrades & maintenance",
    ],
    industries: "Oil & Gas | Banks | Retail | Fast Food | Corporate Offices",
    cta: "Schedule a Security Assessment Today →",
  },
  {
    id: "telecom",
    title: "Telecom",
    headline: "Seamless Telecom & Unified Communication Solutions",
    intro: "We implement communication systems that streamline team collaboration, reduce downtime, and improve productivity.",
    keyServices: [
      "VoIP setup & integration",
      "Video conferencing systems",
      "PBX & unified communication solutions",
      "System maintenance & support",
    ],
    industries: "Oil & Gas | Banks | Retail | Fast Food | Corporate Offices",
    cta: "Request a Telecom & UC Consultation →",
  },
  {
    id: "av-solutions",
    title: "A/V Solutions",
    headline: "Modern A/V Solutions for Workspaces & Retail Environments",
    intro: "We deliver audio/visual technology that enhances communication, presentations, and customer experiences.",
    keyServices: [
      "Conference room AV systems",
      "Digital signage & interactive displays",
      "High-quality sound systems & intercoms",
      "Installation & ongoing maintenance",
    ],
    industries: "Corporate Offices | Retail | Fast Food | Education | Healthcare",
    cta: "Upgrade Your AV Systems Today →",
  },
  {
    id: "website-design",
    title: "Website Design",
    headline: "Build Your Digital Presence with Custom Websites & Solutions",
    intro: "We create websites that attract more customers, increase engagement, and grow your business online.",
    keyServices: [
      "Responsive website design",
      "E-commerce solutions",
      "Digital marketing integrations",
      "Website maintenance & updates",
    ],
    industries: "Retail | Fast Food | Corporate Offices | SMEs",
    cta: "Request Your Custom Website Quote →",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    headline: "Protect Your Business with Comprehensive Cybersecurity Solutions",
    intro: "We secure your business against cyber threats, ensuring compliance and uninterrupted operations.",
    keyServices: [
      "Threat detection & prevention",
      "Firewall & endpoint protection",
      "Vulnerability assessments & penetration testing",
      "Security compliance & audits",
      "24/7 monitoring & incident response",
    ],
    industries: "Oil & Gas | Banks | Retail | Fast Food | Corporate Offices | Healthcare | Education",
    cta: "Schedule a Cybersecurity Risk Assessment →",
  },
  {
    id: "desktop-support",
    title: "Desktop Support",
    headline: "Reliable Onsite & Remote Desktop Support for Your Workforce",
    intro: "We provide fast and dependable desktop support to keep your employees productive at all times.",
    keyServices: [
      "Onsite & remote troubleshooting",
      "Hardware & software installation",
      "User account & access management",
      "Printer, peripheral & device support",
      "Employee onboarding & IT training",
    ],
    industries: "Corporate Offices | Retail | Fast Food | Banks | Healthcare | Education",
    cta: "Request Reliable Desktop Support Today →",
  },
  {
    id: "managed-it",
    title: "Managed IT",
    headline: "Fast, Reliable Managed IT & Technical Support Nationwide",
    intro: "Our managed IT services ensure smooth operations with proactive support, monitoring, and rapid response troubleshooting.",
    keyServices: [
      "Endpoint & network support",
      "Remote monitoring & management",
      "Patch management & updates",
      "Business continuity & disaster recovery",
    ],
    industries: "Oil & Gas | Banks | Retail | Fast Food | Corporate Offices | Healthcare",
    cta: "Get Your Managed IT Quote Today →",
  },
];

const Services = () => {
  return (
    <section className="services-section" id="services">
      <h2 className="section-title">Our Services</h2>
      
      <ul className="services-nav">
        {services.map((service) => (
          <li key={service.id}>
            <a href={`#${service.id}`}>{service.title}</a>
          </li>
        ))}
      </ul>

      <div className="services-details">
        {services.map((service) => (
          <div key={service.id} id={service.id} className="service-block">
            <h3 className="service-headline">{service.headline}</h3>
            <p className="service-intro">{service.intro}</p>

            <h4>Key Services:</h4>
            <ul>
              {service.keyServices.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <p>
              <strong>Industries Served:</strong> {service.industries}
            </p>

            <a href="#contact" className="service-cta">
              {service.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
