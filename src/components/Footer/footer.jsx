import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h2>CONOTEX <span className="highlight">INTEGRATED SERVICES</span></h2>
          <p>Delivering trusted solutions in ICT, Security & Infrastructure.</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Services</h3>
          <ul>
            <li><a href="#structured-cabling">Structured Cabling</a></li>
            <li><a href="#ip-surveillance">IP Surveillance</a></li>
            <li><a href="#telecom">Telecom</a></li>
            <li><a href="#av-solutions">A/V Solutions</a></li>
            <li><a href="#website-design">Website Design</a></li>
            <li><a href="#managed-it">Managed IT</a></li>
          </ul>
        </div>

<div className="footer-contact">
  <h3>Contact</h3>
  <p>Email: ucmgbame@gmail.com</p>
  <p>Phone: +1 (832) 535-1082</p>
  <p>Location: Richmond, TX 77469</p>
</div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Conotex Integrated Services. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
