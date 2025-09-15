import React, { useState, useEffect } from "react";
import "./Hero.css";

const slides = [
  {
    headline: "Structured Cabling Solutions",
    intro: "End-to-end structured cabling and network solutions for offices, retail, and enterprises.",
    image: "/cabling.jpg",
  },
  {
    headline: "IP Surveillance Security",
    intro: "Keep your business safe with CCTV, access control, and monitoring solutions.",
    image: "/security1.jpg",
  },
  {
    headline: "Telecom & Communication",
    intro: "Telecom and unified communication solutions to keep your teams connected.",
    image: "/telecom.jpg",
  },
  {
    headline: "Modern AV Solutions",
    intro: "State-of-the-art audio/visual solutions for offices, retail, and conference rooms.",
    image: "/av.jpg",
  },
  {
    headline: "Custom Websites",
    intro: "We create modern, responsive websites that attract customers and boost online presence.",
    image: "/website.jpg",
  },
  {
    headline: "Cybersecurity Protection",
    intro: "Protect your business from cyber threats with proactive monitoring and solutions.",
    image: "/Cybersecurity.jpg",
  },
  {
    headline: "Desktop Support",
    intro: "Fast, reliable support for software, hardware, and user issues—onsite or remote.",
    image: "/desktop.jpg",
  },
  {
    headline: "Managed IT Support",
    intro: "Proactive IT support and managed services for smooth operations and network monitoring.",
    image: "/managed-it.jpg",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <section id="home" className="hero-container">
      <img src={slides[current].image} alt={slides[current].headline} className="hero-bg" />
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-heading">{slides[current].headline}</h1>
          <p className="hero-text">{slides[current].intro}</p>
          <div className="cta-group">
            <a href="#services">
              <button className="cta-button primary">Explore Services</button>
            </a>
            <a href="#contact">
              {/* <button className="cta-button secondary">Get in Touch</button> */}
            </a>
          </div>
        </div>
      </div>

      <button onClick={prevSlide} className="arrow-button prev">&#10094;</button>
      <button onClick={nextSlide} className="arrow-button next">&#10095;</button>

      <div className="indicators">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${current === index ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
