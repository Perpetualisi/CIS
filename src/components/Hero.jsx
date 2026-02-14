import React, { useState, useEffect, useCallback, useRef } from "react";

const SLIDES = [
  {
    id: 1,
    headline: "Custom Websites",
    subheadline: "Full-Stack And User Experience Design",
    intro: "High-performance responsive interfaces engineered for speed.\nOptimized to convert digital traffic into measurable revenue.",
    image: "/Website.webp",
    cta: { primary: "Initiate Development", secondary: "Technology Stack" },
  },
  {
    id: 2,
    headline: "Search Intelligence",
    subheadline: "Machine Learning and Quality Assurance",
    intro: "Precision tuning for LLMs and enterprise search engines.\nEnsuring data accuracy and reliability in the AI era.",
    image: "/AI-SEARCH.jpg",
    cta: { primary: "Audit Data", secondary: "Methodology" },
  },
  {
    id: 3,
    headline: "Cybersecurity Protection",
    subheadline: "Security And Defense Architecture",
    intro: "Real-time threat detection and zero-trust implementation.\nHardening your perimeter with advanced penetration testing.",
    image: "/Cybersecurity.jpeg",
    cta: { primary: "Deploy Shield", secondary: "Threat Map" },
  },
  {
    id: 4,
    headline: "Managed IT Support",
    subheadline: "Systems Operations And Maintenance",
    intro: "Complete outsourced management of your server infrastructure.\nProactive monitoring so you can focus on scaling your business.",
    image: "/Managed-it.webp",
    cta: { primary: "Consultation", secondary: "Service Packages" },
  },
  {
    id: 5,
    headline: "Desktop Support",
    subheadline: "Endpoint And Helpdesk Management",
    intro: "Rapid-response resolution for hardware and software issues.\nRemote and on-site support across all enterprise endpoints.",
    image: "/desktop.webp",
    cta: { primary: "Request Support", secondary: "Service Level Agreement" },
  },
  {
    id: 6,
    headline: "Structured Cabling",
    subheadline: "Infrastructure And Network Layer Architecture",
    intro: "High-density fiber and copper architectures for 99.9% uptime.\nThe physical backbone designed for enterprise-grade connectivity.",
    image: "/cabling.jpeg",
    cta: { primary: "System Specifications", secondary: "View Network Topology" },
  },
  {
    id: 7,
    headline: "IP Surveillance Security",
    subheadline: "Vision And Artificial Intelligence Monitoring",
    intro: "AI-powered motion analytics with encrypted remote access.\nEnd-to-end monitoring protocols for high-security environments.",
    image: "/IP1.jpeg",
    cta: { primary: "Secure Infrastructure", secondary: "Case Studies" },
  },
  {
    id: 8,
    headline: "Telecom & Communication",
    subheadline: "Unified Communications And Voice Over IP",
    intro: "Low-latency voice and data synchronization for global teams.\nSeamlessly integrated multi-channel communication systems.",
    image: "/telecom.jpeg",
    cta: { primary: "Connect Systems", secondary: "System Audit" },
  },
  {
    id: 9,
    headline: "Modern AV Solutions",
    subheadline: "Multimedia And Presentation Technology",
    intro: "Smart-room technology and interactive display integration.\nAutomated acoustic environments for modern boardrooms.",
    image: "/AV.jpeg",
    cta: { primary: "Request Quotation", secondary: "Solution Gallery" },
  },
];

const SLIDE_INTERVAL = 8000;
const FADE_DURATION = 800;

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  const handleNext = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
      setIsAnimating(false);
    }, FADE_DURATION / 2);
  }, []);

  const handlePrev = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
      setIsAnimating(false);
    }, FADE_DURATION / 2);
  }, []);

  useEffect(() => {
    if (isAutoPlaying) {
      timerRef.current = setInterval(handleNext, SLIDE_INTERVAL);
    }
    return () => clearInterval(timerRef.current);
  }, [isAutoPlaying, handleNext]);

  const manualNav = (index) => {
    setIsAutoPlaying(false);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setIsAnimating(false);
    }, FADE_DURATION / 2);
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setIsAutoPlaying(false);
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const currentSlide = SLIDES[current];

  return (
    <section id="home" className="relative w-full h-[85vh] min-h-[550px] lg:h-screen overflow-hidden bg-[#020617] text-white">
      
      {/* Optimization: Preload Images */}
      <div className="hidden">
        {SLIDES.map(s => <img key={s.id} src={s.image} alt="" />)}
      </div>

      {/* Background Layer */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity ease-in-out"
          style={{
            opacity: index === current ? 1 : 0,
            transitionDuration: `${FADE_DURATION}ms`,
          }}
        >
          <img 
            src={slide.image} 
            alt="" 
            className="w-full h-full object-cover grayscale-[20%] opacity-60 transition-all duration-1000 scale-105" 
            style={{ transform: index === current ? 'scale(1)' : 'scale(1.05)' }} // Subtle zoom-in effect
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-transparent to-[#020617] opacity-95" />
        </div>
      ))}

      {/* Centered Content */}
      <div className="relative z-20 container mx-auto h-full flex items-center justify-center">
        <div className={`w-full text-center transition-all duration-700 ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
          
          {/* System Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-orange-500/30 bg-orange-500/5 rounded-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
            </span>
            <span className="text-[8px] md:text-[9px] font-mono tracking-[0.3em] text-orange-500 uppercase">Core_Module_0{current + 1}</span>
          </div>

          {/* HEADLINE */}
          <div className="w-full px-2 sm:px-4 overflow-hidden flex justify-center">
            <h1 
              className="font-black uppercase mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 leading-none inline-block max-w-full drop-shadow-2xl"
              style={{ 
                fontSize: "clamp(1.1rem, 5.5vw, 5rem)",
                whiteSpace: "nowrap",
                letterSpacing: "-0.04em"
              }}
            >
              {currentSlide.headline}
            </h1>
          </div>

          {/* Sub-headline */}
          <div className="inline-block mb-8 px-4 py-1.5 border-x border-slate-800 max-w-[95vw]">
            <h2 className="text-orange-500 font-mono text-[7px] sm:text-[9px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.3em] whitespace-nowrap overflow-hidden text-ellipsis">
              {currentSlide.subheadline}
            </h2>
          </div>

          {/* Intro Text */}
          <p className="text-slate-100 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-light px-8 whitespace-pre-line drop-shadow-md">
            {currentSlide.intro}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-10 sm:px-0">
            <a 
              href="#contact" 
              onClick={(e) => scrollToSection(e, "#contact")}
              className="w-full sm:w-auto bg-orange-600 text-white font-bold py-3.5 px-10 rounded-sm hover:bg-orange-500 hover:shadow-orange-500/20 hover:shadow-2xl transition-all duration-300 uppercase tracking-widest text-[10px] active:scale-95 text-center"
            >
              {currentSlide.cta.primary}
            </a>
            <a 
              href="#services" 
              onClick={(e) => scrollToSection(e, "#services")}
              className="w-full sm:w-auto bg-slate-900/40 text-white border border-slate-700 font-bold py-3.5 px-10 rounded-sm hover:bg-slate-800 hover:border-slate-500 transition-all duration-300 uppercase tracking-widest text-[10px] active:scale-95 backdrop-blur-md text-center"
            >
              {currentSlide.cta.secondary}
            </a>
          </div>
        </div>
      </div>

      {/* Footer Interface */}
      <div className="absolute bottom-0 left-0 w-full z-30 px-6 py-5 flex flex-row items-center justify-between border-t border-white/5 bg-[#020617]/95 backdrop-blur-md">
        <div className="flex gap-2">
          {SLIDES.map((_, index) => (
            <button key={index} onClick={() => manualNav(index)} className="group py-2">
              <div className={`h-[1.5px] transition-all duration-500 ${current === index ? "w-6 md:w-10 bg-orange-600" : "w-2 md:w-4 bg-slate-800 group-hover:bg-slate-600"}`} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 border border-slate-800 rounded-sm p-0.5">
            <button onClick={handlePrev} className="p-1.5 text-slate-500 hover:text-white transition-colors">
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button onClick={() => setIsAutoPlaying(!isAutoPlaying)} className="w-7 h-7 flex items-center justify-center rounded-sm bg-slate-800 text-orange-500">
                {isAutoPlaying ? <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg> : <svg className="w-3 h-3 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
            </button>
            <button onClick={handleNext} className="p-1.5 text-slate-500 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="hidden sm:flex flex-col text-right font-mono leading-none">
            <span className="text-[10px] text-orange-500 font-bold tracking-widest">0{current + 1} / 0{SLIDES.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;