import React, { useState, useEffect } from 'react';
import './Hero.css';

const slides = [
  {
    headline: "Reliable Structured Cabling & Networks",
    intro: "End-to-end structured cabling and network solutions for offices, retail, and more.",
    image: "/cabling.jpg",
  },
  {
    headline: "Advanced IP Surveillance & Security",
    intro: "Keep your business safe with CCTV, access control, and monitoring solutions.",
    image: "/security1.jpg",
  },
  {
    headline: "Seamless Telecom & Communication",
    intro: "Telecom and unified communication solutions to keep your teams connected.",
    image: "/telecom.jpg",
  },
  {
    headline: "Modern A/V Solutions",
    intro: "State-of-the-art audio/visual solutions for offices, retail, and conference rooms.",
    image: "/av.jpg",
  },
  {
    headline: "Custom Websites & Digital Solutions",
    intro: "We create modern, responsive websites that attract customers and boost online presence.",
    image: "/website.jpg",
  },
  {
    headline: "Comprehensive Cybersecurity",
    intro: "Protect your business from cyber threats with proactive monitoring and solutions.",
    image: "/Cybersecurity.jpg",
  },
  {
    headline: "Onsite & Remote Desktop Support",
    intro: "Fast, reliable support for software, hardware, and user issues—onsite or remote.",
    image: "/desktop.jpg",
  },
  {
    headline: "Managed IT & Technical Support",
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

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <section id="home" className="hero-container">
      <img src={slides[current].image} alt="Hero Slide" className="hero-3d" />

      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="blinking-heading">{slides[current].headline}</h1>
          <p>{slides[current].intro}</p>
          <a href="#services">
            <button className="cta-button">Explore Our Services</button>
          </a>
        </div>
      </div>

      {/* Edge Arrows */}
      <button onClick={prevSlide} className="arrow-button prev">&lt;</button>
      <button onClick={nextSlide} className="arrow-button next">&gt;</button>
    </section>
  );
};

export default Hero;
