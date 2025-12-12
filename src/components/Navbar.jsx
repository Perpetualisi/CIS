import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";

const services = [
  "Structured Cabling",
  "IP Surveillance",
  "Telecom & UC",
  "A/V Solutions",
  "Website Design",
  "Managed IT",
  "Cybersecurity",
  "Desktop Support",
];

const serviceIdMap = {
  "Structured Cabling": "structured-cabling",
  "IP Surveillance": "ip-surveillance",
  "Telecom & UC": "telecom",
  "A/V Solutions": "av-solutions",
  "Website Design": "website-design",
  "Managed IT": "managed-it",
  "Cybersecurity": "cybersecurity",
  "Desktop Support": "desktop-support",
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const servicesRef = useRef(null);

  // Change navbar background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close desktop dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleServiceClick = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
      setServicesOpen(false);
      setMobileServicesOpen(false);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-content">
        {/* Logo */}
        <a href="#home" className="logo" aria-label="Homepage">
          <img
            src="/logo.png"
            alt="Conotex Integrated Services"
            className="logo-img"
            loading="eager"
          />
        </a>

        {/* Desktop Links */}
        <ul className="nav-links">
          <li><a href="#home">HOME</a></li>
          <li><a href="#about">ABOUT-US</a></li>

          <li ref={servicesRef} className="nav-services">
            <button
              aria-haspopup="true"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen(!servicesOpen)}
            >
              SERVICES
            </button>

            {servicesOpen && (
              <ul className="services-dropdown open">
                {services.map((service) => (
                  <li key={service}>
                    <button
                      onClick={() => handleServiceClick(serviceIdMap[service])}
                      className="dropdown-link"
                    >
                      {service}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li><a href="#projects">PROJECTS</a></li>
          <li><a href="#partners">CLIENTS</a></li>
          <li><a href="#contact">CONTACT</a></li>
        </ul>

        {/* Hamburger Menu */}
        <button
          className={`hamburger ${mobileMenuOpen ? "open" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      <ul className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <li><a href="#home" onClick={() => setMobileMenuOpen(false)}>HOME</a></li>
        <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>ABOUT-US</a></li>

        <li>
          <button
            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            aria-haspopup="true"
            aria-expanded={mobileServicesOpen}
          >
            SERVICES
          </button>

          {mobileServicesOpen && (
            <ul className="services-dropdown open">
              {services.map((service) => (
                <li key={service}>
                  <button
                    onClick={() => handleServiceClick(serviceIdMap[service])}
                    className="dropdown-link"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>

        <li><a href="#projects" onClick={() => setMobileMenuOpen(false)}>PROJECTS</a></li>
        <li><a href="#partners" onClick={() => setMobileMenuOpen(false)}>CLIENTS</a></li>
        <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>CONTACT</a></li>
      </ul>
    </nav>
  );
}
