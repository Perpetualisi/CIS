import React, { useState, useEffect, useCallback, useRef } from "react";

const SLIDES = [
  {
    id: 1,
    headline: "Structured Cabling Solutions",
    subheadline: "Reliable Networks That Keep You Connected 24/7.",
    intro: "End-to-end structured cabling and network solutions for offices, retail, and enterprises.",
    image: "/cabling.jpeg",
    imageAlt: "Professional structured cabling installation in modern office",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
  {
    id: 2,
    headline: "IP Surveillance Security",
    subheadline: "Protect Your Assets With Smart Monitoring Solutions.",
    intro: "Keep your business safe with CCTV, access control, and monitoring solutions.",
    image: "/IP1.jpeg",
    imageAlt: "IP security camera monitoring system",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
  {
    id: 3,
    headline: "Telecom & Communication",
    subheadline: "Seamless Communication For Teams Of Any Size.",
    intro: "Telecom and unified communication solutions to keep your teams connected.",
    image: "/telecom.jpeg",
    imageAlt: "Modern telecommunication equipment and systems",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
  {
    id: 4,
    headline: "Modern AV Solutions",
    subheadline: "Engaging Audio/Visual Solutions For Any Space.",
    intro: "State-of-the-art audio/visual solutions for offices, retail, and conference rooms.",
    image: "/AV.jpeg",
    imageAlt: "Audio visual equipment in conference room",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
  {
    id: 5,
    headline: "Custom Websites",
    subheadline: "Attract More Customers With Modern, Responsive Websites.",
    intro: "We create modern, responsive websites that attract customers and boost online presence.",
    image: "/Website.webp",
    imageAlt: "Modern responsive website design on multiple devices",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
  {
    id: 6,
    headline: "AI Search Quality & Validation",
    subheadline: "Optimize AI Models & Ensure Accurate Results.",
    intro: "We provide AI search optimization, healthcare AI validation, and enterprise knowledge system QA for maximum accuracy and compliance.",
    image: "/AI-SEARCH.jpg",
    imageAlt: "AI search and validation process illustration",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
  {
    id: 7,
    headline: "Cybersecurity Protection",
    subheadline: "Proactive Monitoring To Protect Your Business.",
    intro: "Protect your business from cyber threats with proactive monitoring and solutions.",
    image: "/Cybersecurity.jpeg",
    imageAlt: "Cybersecurity monitoring dashboard",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
  {
    id: 8,
    headline: "Desktop Support",
    subheadline: "Fast, Reliable Support Whenever You Need It.",
    intro: "Fast, reliable support for software, hardware, and user issues—onsite or remote.",
    image: "/desktop.webp",
    imageAlt: "IT technician providing desktop support",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
  {
    id: 9,
    headline: "Managed IT Support",
    subheadline: "Smooth Operations With Proactive IT Management.",
    intro: "Proactive IT support and managed services for smooth operations and network monitoring.",
    image: "/Managed-it.webp",
    imageAlt: "IT infrastructure management and monitoring",
    cta: { primary: "Get a Free Quote", secondary: "Explore Services" },
  },
];

const SLIDE_INTERVAL = 7000;
const FADE_DURATION = 700;

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
    }, FADE_DURATION);
  }, []);

  const handlePrev = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
      setIsAnimating(false);
    }, FADE_DURATION);
  }, []);

  useEffect(() => {
    if (isAutoPlaying) {
      timerRef.current = setInterval(handleNext, SLIDE_INTERVAL);
    }
    return () => clearInterval(timerRef.current);
  }, [isAutoPlaying, handleNext]);

  const manualNav = (direction) => {
    setIsAutoPlaying(false);
    if (direction === "next") handleNext();
    else handlePrev();
  };

  const currentSlide = SLIDES[current];

  return (
    <section
      id="home"
      className="relative w-full h-[75vh] md:h-screen min-h-[550px] overflow-hidden bg-slate-900"
    >
      {/* Background */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity ease-in-out"
          style={{
            opacity: index === current ? 1 : 0,
            transitionDuration: `${FADE_DURATION}ms`,
            zIndex: index === current ? 1 : 0,
          }}
        >
          <img
            src={slide.image}
            alt={slide.imageAlt}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50 md:bg-gradient-to-r md:from-black/90 md:via-black/20 md:to-black/80" />
        </div>
      ))}

      {/* Centered content */}
      <div className="relative z-20 flex items-center justify-center h-full">
        <div
          className={`max-w-4xl px-6 text-center transition-all duration-500 ease-out ${
            isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          <h1 className="font-black text-white text-3xl sm:text-5xl md:text-6xl lg:text-6xl mb-4 leading-snug break-words">
            {currentSlide.headline}
          </h1>
          <h2 className="text-yellow-400 font-bold text-base sm:text-xl md:text-2xl mb-6 break-words">
            {currentSlide.subheadline}
          </h2>
          <p className="text-gray-200 text-sm sm:text-base md:text-lg mb-10 max-w-3xl mx-auto leading-relaxed break-words">
            {currentSlide.intro}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="#contact"
              className="w-full sm:w-auto bg-orange-600 text-white font-bold py-4 px-10 rounded-full hover:bg-orange-700 transition-colors"
            >
              {currentSlide.cta.primary}
            </a>
            <a
              href="#services"
              className="w-full sm:w-auto bg-white/10 text-white border-2 border-white/40 font-bold py-4 px-10 rounded-full hover:bg-white/20 backdrop-blur-md transition-colors"
            >
              {currentSlide.cta.secondary}
            </a>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => manualNav("prev")}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => manualNav("next")}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center px-6">
        <div className="flex gap-3 bg-black/20 backdrop-blur-sm p-2 rounded-full">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrent(index);
                  setIsAnimating(false);
                }, FADE_DURATION);
              }}
              className={`h-2 transition-all duration-500 rounded-full ${
                current === index ? "bg-orange-500 w-12" : "bg-white/40 w-4 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Play/Pause */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-6 right-6 z-30 p-2.5 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-all border border-white/10"
      >
        {isAutoPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </section>
  );
};

export default Hero;
