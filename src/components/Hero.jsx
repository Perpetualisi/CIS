import React, { useState, useEffect } from "react";
import "./Hero.css";

const slides = [
  {
    headline: "Structured Cabling Solutions",
    intro: "End-to-end structured cabling and network solutions for offices, retail, and enterprises.",
    image: "/cabling.jpeg",
  },
  {
    headline: "IP Surveillance Security",
    intro: "Keep your business safe with CCTV, access control, and monitoring solutions.",
    image: "/IP1.jpeg",
  },
  {
    headline: "Telecom & Communication",
    intro: "Telecom and unified communication solutions to keep your teams connected.",
    image: "/telecom.jpeg",
  },
  {
    headline: "Modern AV Solutions",
    intro: "State-of-the-art audio/visual solutions for offices, retail, and conference rooms.",
    image: "/AV.jpeg",
  },
  {
    headline: "Custom Websites",
    intro: "We create modern, responsive websites that attract customers and boost online presence.",
    image: "/Website.webp",
  },
  {
    headline: "Cybersecurity Protection",
    intro: "Protect your business from cyber threats with proactive monitoring and solutions.",
    image: "/Cybersecurity.jpeg",
  },
  {
    headline: "Desktop Support",
    intro: "Fast, reliable support for software, hardware, and user issues—onsite or remote.",
    image: "/desktop.webp",
  },
  {
    headline: "Managed IT Support",
    intro: "Proactive IT support and managed services for smooth operations and network monitoring.",
    image: "/Managed-it.webp",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // fade out
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setFade(true); // fade in
      }, 1000); // match fade duration
    }, 7000); // 7 seconds per slide

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
          <p className="hero-text">{slides[current].intro}</p>
          <div className="cta-group">
            <a href="#services">
              <button className="cta-button primary">Explore Services</button>
            </a>
          </div>
        </div>
      </div>

      {/* Arrows (optional) */}
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
