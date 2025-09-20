import React, { useState, useEffect } from "react";
import "./Hero.css";

const slides = [
  {
    headline: "Structured Cabling Solutions",
    subheadline: "Reliable networks that keep your business connected 24/7.",
    intro: "End-to-end structured cabling and network solutions for offices, retail, and enterprises.",
    image: "/cabling.jpeg",
  },
  {
    headline: "IP Surveillance Security",
    subheadline: "Protect your assets with smart monitoring solutions.",
    intro: "Keep your business safe with CCTV, access control, and monitoring solutions.",
    image: "/IP1.jpeg",
  },
  {
    headline: "Telecom & Communication",
    subheadline: "Seamless communication for teams of any size.",
    intro: "Telecom and unified communication solutions to keep your teams connected.",
    image: "/telecom.jpeg",
  },
  {
    headline: "Modern AV Solutions",
    subheadline: "Engaging audio/visual solutions for any space.",
    intro: "State-of-the-art audio/visual solutions for offices, retail, and conference rooms.",
    image: "/AV.jpeg",
  },
  {
    headline: "Custom Websites",
    subheadline: "Attract more customers with modern, responsive websites.",
    intro: "We create modern, responsive websites that attract customers and boost online presence.",
    image: "/Website.webp",
  },
  {
    headline: "Cybersecurity Protection",
    subheadline: "Proactive monitoring to protect your business.",
    intro: "Protect your business from cyber threats with proactive monitoring and solutions.",
    image: "/Cybersecurity.jpeg",
  },
  {
    headline: "Desktop Support",
    subheadline: "Fast, reliable support whenever you need it.",
    intro: "Fast, reliable support for software, hardware, and user issues—onsite or remote.",
    image: "/desktop.webp",
  },
  {
    headline: "Managed IT Support",
    subheadline: "Smooth operations with proactive IT management.",
    intro: "Proactive IT support and managed services for smooth operations and network monitoring.",
    image: "/Managed-it.webp",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 1000);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setFade(true);
    }, 1000);
  };

  const nextSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setFade(true);
    }, 1000);
  };

  return (
    <section id="home" className="hero-container">
      <img
        src={slides[current].image}
        alt={slides[current].headline}
        className={`hero-bg ${fade ? "show" : ""}`}
      />
      <div className="hero-overlay">
        <div className={`hero-content ${fade ? "show" : ""}`}>
          <h1 className="hero-heading">{slides[current].headline}</h1>
          <h2 className="hero-subheading">{slides[current].subheadline}</h2>
          <p className="hero-text">{slides[current].intro}</p>
          <div className="cta-group">
            <a href="#contact">
              <button className="cta-button primary">Get a Free Quote</button>
            </a>
            <a href="#services">
              <button className="cta-button secondary">Explore Services</button>
            </a>
          </div>
        </div>
      </div>

      {/* Optional arrows */}
      {/* <button onClick={prevSlide} className="arrow-button prev">&#10094;</button>
      <button onClick={nextSlide} className="arrow-button next">&#10095;</button> */}

      <div className="indicators">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${current === index ? "active" : ""}`}
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setCurrent(index);
                setFade(true);
              }, 1000);
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
