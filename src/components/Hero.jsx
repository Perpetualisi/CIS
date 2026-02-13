import React, { useState, useEffect, useCallback, useRef } from "react";

const SLIDES = [
  {
    id: 1,
    headline: "Structured Cabling Solutions",
    subheadline: "Infrastructure And Network Layer Architecture",
    intro: "Deploying high-density fiber and copper architectures designed for 99.9% uptime. The physical backbone of your enterprise.",
    image: "/cabling.jpeg",
    cta: { primary: "System Specifications", secondary: "View Network Topology" },
  },
  {
    id: 2,
    headline: "IP Surveillance Security",
    subheadline: "Vision And Artificial Intelligence Monitoring",
    intro: "End-to-end monitoring featuring motion-sensing analytics and encrypted remote access protocols for high-security environments.",
    image: "/IP1.jpeg",
    cta: { primary: "Secure Infrastructure", secondary: "Case Studies" },
  },
  {
    id: 3,
    headline: "Telecom & Communication",
    subheadline: "Unified Communications And Voice Over IP",
    intro: "Seamless multi-channel communication systems. Low-latency voice and data synchronization for global enterprise teams.",
    image: "/telecom.jpeg",
    cta: { primary: "Connect Systems", secondary: "System Audit" },
  },
  {
    id: 4,
    headline: "Modern AV Solutions",
    subheadline: "Multimedia And Presentation Technology",
    intro: "Integrated smart-room technology. From interactive displays to automated acoustic environments for modern boardrooms.",
    image: "/AV.jpeg",
    cta: { primary: "Request Quotation", secondary: "Solution Gallery" },
  },
  {
    id: 5,
    headline: "Custom Websites",
    subheadline: "Full-Stack And User Experience Design",
    intro: "Engineered for speed and search engine optimization. We build responsive digital interfaces that convert traffic into revenue.",
    image: "/Website.webp",
    cta: { primary: "Initiate Development", secondary: "Technology Stack" },
  },
  {
    id: 6,
    headline: "AI Search Quality & Validation",
    subheadline: "Machine Learning and Quality Assurance",
    intro: "Validation and tuning for Large Language Models and enterprise search engines. Ensuring data accuracy in the AI era.",
    image: "/AI-SEARCH.jpg",
    cta: { primary: "Audit Data", secondary: "Methodology" },
  },
  {
    id: 7,
    headline: "Cybersecurity Protection",
    subheadline: "Security And Defense Architecture",
    intro: "Hardening your perimeter. Real-time threat detection, penetration testing, and zero-trust implementation for business safety.",
    image: "/Cybersecurity.jpeg",
    cta: { primary: "Deploy Shield", secondary: "Threat Map" },
  },
  {
    id: 8,
    headline: "Desktop Support",
    subheadline: "Endpoint And Helpdesk Management",
    intro: "Rapid-response resolution. Remote and on-site support for hardware, software, and local networks across all endpoints.",
    image: "/desktop.webp",
    cta: { primary: "Request Support", secondary: "Service Level Agreement" },
  },
  {
    id: 9,
    headline: "Managed IT Support",
    subheadline: "Systems Operations And Maintenance",
    intro: "Complete outsourced IT management. We monitor your servers while you focus on scaling your core business operations.",
    image: "/Managed-it.webp",
    cta: { primary: "Consultation", secondary: "Service Packages" },
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

  // FIXED: Smooth scroll function that prevents "jumping" back
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setIsAutoPlaying(false); // Pause autoplay when user interacts
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const currentSlide = SLIDES[current];

  return (
    <section id="home" className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#020617] text-white">
      
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
          <img src={slide.image} alt="" className="w-full h-full object-cover grayscale opacity-20" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]" />
        </div>
      ))}

      {/* Centered Content */}
      <div className="relative z-20 container mx-auto px-4 h-full flex items-center justify-center">
        <div className={`w-full max-w-[98vw] text-center transition-all duration-700 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
          
          {/* System Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-orange-500/30 bg-orange-500/5 rounded-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
            </span>
            <span className="text-[9px] font-mono tracking-[0.3em] text-orange-500 uppercase">Core_Module_0{current + 1}</span>
          </div>

          {/* HEADLINE: Fluid Typography with smaller base for long words */}
          <h1 className="whitespace-nowrap font-black uppercase tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 
            text-[4.8vw] sm:text-[4.2vw] lg:text-[4vw] xl:text-[64px]">
            {currentSlide.headline}
          </h1>

          {/* Sub-headline: Technical subtitle */}
          <div className="inline-block mb-10 px-4 py-1.5 border-x border-slate-800">
            <h2 className="text-orange-500 font-mono text-[8px] sm:text-[10px] md:text-xs uppercase tracking-[0.4em] whitespace-nowrap">
              {currentSlide.subheadline}
            </h2>
          </div>

          {/* Description */}
          <p className="text-slate-400 text-[11px] sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-light opacity-70">
            {currentSlide.intro}
          </p>

          {/* CTA Buttons - Using scrollToSection */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a 
              href="#contact" 
              onClick={(e) => scrollToSection(e, "#contact")}
              className="w-full sm:w-auto bg-orange-600 text-white font-bold py-3.5 px-10 rounded-sm hover:bg-orange-500 transition-all uppercase tracking-widest text-[10px] active:scale-95 shadow-lg shadow-orange-900/20"
            >
              {currentSlide.cta.primary}
            </a>
            <a 
              href="#services" 
              onClick={(e) => scrollToSection(e, "#services")}
              className="w-full sm:w-auto bg-slate-900/40 text-white border border-slate-700 font-bold py-3.5 px-10 rounded-sm hover:bg-slate-800 transition-all uppercase tracking-widest text-[10px] active:scale-95 backdrop-blur-md"
            >
              {currentSlide.cta.secondary}
            </a>
          </div>
        </div>
      </div>

      {/* Footer Interface */}
      <div className="absolute bottom-0 left-0 w-full z-30 px-6 py-6 flex flex-col md:flex-row items-center justify-between border-t border-white/5 bg-[#020617]/95 backdrop-blur-md">
        <div className="flex gap-3 mb-6 md:mb-0">
          {SLIDES.map((_, index) => (
            <button key={index} onClick={() => manualNav(index)} className="group py-2">
              <div className={`h-[1px] transition-all duration-500 ${current === index ? "w-10 bg-orange-600" : "w-4 bg-slate-800 group-hover:bg-slate-600"}`} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 border border-slate-800 rounded-sm p-0.5">
            <button onClick={handlePrev} className="p-2 text-slate-500 hover:text-white transition-colors">
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button onClick={() => setIsAutoPlaying(!isAutoPlaying)} className="w-8 h-8 flex items-center justify-center rounded-sm bg-slate-800 text-orange-500 hover:bg-slate-700">
                {isAutoPlaying ? <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg> : <svg className="w-3 h-3 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
            </button>
            <button onClick={handleNext} className="p-2 text-slate-500 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="hidden lg:flex flex-col text-right font-mono">
            <span className="text-[8px] text-slate-600 uppercase tracking-tighter italic">Process_ID</span>
            <span className="text-xs text-orange-500 font-bold tracking-widest">0{current + 1} / 0{SLIDES.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;