import React, { useState, useEffect, useCallback, useRef } from "react";

const SLIDES = [
  {
    id: 1,
    headline: "Structured Cabling Solutions",
    subheadline: "Reliable networks that keep you connected 24/7.",
    intro: "End-to-end structured cabling and network solutions for offices, retail, and enterprises.",
    image: "/cabling.jpeg",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
  {
    id: 2,
    headline: "IP Surveillance Security",
    subheadline: "Protect your assets with smart monitoring solutions.",
    intro: "Keep your business safe with CCTV, access control, and monitoring solutions.",
    image: "/IP1.jpeg",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
  {
    id: 3,
    headline: "Telecom & Communication",
    subheadline: "Seamless communication for teams of any size.",
    intro: "Telecom and unified communication solutions to keep your teams connected.",
    image: "/telecom.jpeg",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
  {
    id: 4,
    headline: "Modern AV Solutions",
    subheadline: "Engaging audio/visual solutions for any space.",
    intro: "State-of-the-art audio/visual solutions for offices, retail, and conference rooms.",
    image: "/AV.jpeg",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
  {
    id: 5,
    headline: "Custom Websites",
    subheadline: "Attract more customers with modern, responsive websites.",
    intro: "We create modern, responsive websites that attract customers and boost online presence.",
    image: "/Website.webp",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
  {
    id: 6,
    headline: "Cybersecurity Protection",
    subheadline: "Proactive monitoring to protect your business.",
    intro: "Protect your business from cyber threats with proactive monitoring and solutions.",
    image: "/Cybersecurity.jpeg",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
  {
    id: 7,
    headline: "Desktop Support",
    subheadline: "Fast, reliable support whenever you need it.",
    intro: "Fast, reliable support for software, hardware, and user issues—onsite or remote.",
    image: "/desktop.webp",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
  {
    id: 8,
    headline: "Managed IT Support",
    subheadline: "Smooth operations with proactive IT management.",
    intro: "Proactive IT support and managed services for smooth operations and network monitoring.",
    image: "/Managed-it.webp",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
];

const SLIDE_INTERVAL = 7000;
const FADE_DURATION = 1000;

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const goToSlide = useCallback((index) => {
    if (index === current) return;
    setFade(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setCurrent(index);
      setFade(true);
    }, 400); 
  }, [current]);

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % SLIDES.length);
  }, [current, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((current - 1 + SLIDES.length) % SLIDES.length);
  }, [current, goToSlide]);

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, SLIDE_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const currentSlide = SLIDES[current];

  return (
    <section
      id="home"
      // CHANGE: Set a shorter fixed height on mobile (70vh) and full height on desktop
      className="relative w-full h-[70vh] md:h-screen min-h-[500px] overflow-hidden bg-slate-900"
      aria-label="Hero carousel"
    >
      {/* Background Images */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
          style={{ transitionDuration: `${FADE_DURATION}ms` }}
        >
          <img
            src={slide.image}
            alt=""
            // CHANGE: Added object-center to ensure main subjects aren't cut off on mobile
            className={`w-full h-full object-cover object-center transition-transform duration-[10000ms] ease-linear ${
              index === current ? "scale-105 md:scale-110" : "scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-black/50 md:bg-gradient-to-r md:from-black/80 md:via-black/40 md:to-black/80" />
        </div>
      ))}

      {/* Content Container */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div
          className={`max-w-5xl px-6 text-center transition-all duration-700 ${
            fade ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          {/* CHANGE: Reduced heading size on mobile for better fit */}
          <h1 className="font-black text-white text-2xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 md:mb-6 leading-[1.2]">
            {currentSlide.headline}
          </h1>
          <h2 className="text-yellow-400 font-bold text-sm sm:text-xl md:text-2xl mb-3 md:mb-6">
            {currentSlide.subheadline}
          </h2>
          {/* CHANGE: Added hidden sm:block to keep mobile clean, or just reduced text size */}
          <p className="text-gray-200 text-xs sm:text-base md:text-lg mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            {currentSlide.intro}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4">
            <a href="#contact" className="w-full sm:w-auto bg-orange-600 text-white font-bold py-3 md:py-4 px-8 md:px-10 rounded-full transition-all hover:bg-orange-700 text-sm md:text-base text-center">
              {currentSlide.cta.primary}
            </a>
            <a href="#services" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-2 border-white/50 font-bold py-3 md:py-4 px-8 md:px-10 rounded-full transition-all text-sm md:text-base text-center">
              {currentSlide.cta.secondary}
            </a>
          </div>
        </div>
      </div>

      {/* Side Navigation Arrows - Hidden on Mobile */}
      <div className="hidden md:block">
        <button
          onClick={prevSlide}
          className="absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 p-3 lg:p-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all group"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 p-3 lg:p-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all group"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Bottom Indicators - Adjusted for mobile visibility */}
      <div className="absolute bottom-4 md:bottom-8 left-0 right-0 z-30 flex justify-center px-6">
        <div className="flex gap-2 bg-black/20 backdrop-blur-sm p-1.5 rounded-full">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1 transition-all duration-500 rounded-full ${
                current === index ? "bg-orange-500 w-6 md:w-12" : "bg-white/40 w-3 md:w-6"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;