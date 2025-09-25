import React from "react";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo & About */}
        <div className="footer-logo">
          <h2>
            CONOTEX <span className="highlight">INTEGRATED SERVICES</span>
          </h2>
          <p>Delivering trusted solutions in ICT, Security & Infrastructure.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-links">
          <h3>Services</h3>
          <ul>
            <li><a href="#structured-cabling">Structured Cabling</a></li>
            <li><a href="#ip-surveillance">IP Surveillance</a></li>
            <li><a href="#telecom">Telecom</a></li>
            <li><a href="#av-solutions">A/V Solutions</a></li>
            <li><a href="#website-design">Website Design</a></li>
            <li><a href="#managed-it">Managed IT</a></li>
            <li><a href="#cybersecurity">Cybersecurity</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>Email: <a href="mailto:info@conotextech.com">uchenna.m@conotextech.com</a></p>
          <p>Phone: +1 (832) 535-1082</p>
          <p>Location: Richmond, TX 77469, USA</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Conotex Integrated Services. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
