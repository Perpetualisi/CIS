// src/components/Partners.jsx
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
];

const Partners = () => {
  return (
    <section id="partners" className="partners-section">
      <h2 className="partners-heading">Our Partners</h2>
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
