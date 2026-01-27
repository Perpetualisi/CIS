import React, { useState, useEffect, useCallback } from "react";

const NAV_LINKS = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT-US", href: "#about" },
  { label: "SERVICES", href: "#services" },
  { label: "PROJECTS", href: "#projects" },
  { label: "CLIENTS", href: "#partners" },
  { label: "CONTACT", href: "#contact" },
];

// Refined Styles
const LINK_CLASSES = "text-[#001f3f] font-bold text-sm tracking-tight cursor-pointer transition-all duration-300 hover:text-blue-600";
const MOBILE_LINK_CLASSES = "text-2xl text-white font-black text-left cursor-pointer transition-colors duration-300 hover:text-blue-400";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for sticky effect
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[997] transition-opacity duration-500 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMobileMenu}
      />

      <nav
        className={`fixed top-0 w-full flex justify-center z-[999] transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-lg h-[70px]" : "bg-white h-[90px]"
        }`}
      >
        <div className="max-w-7xl w-full flex items-center justify-between px-6">
          {/* Logo */}
          <a href="#home" className="flex items-center transition-transform hover:scale-105">
            <img
              src="/logo.png"
              alt="Conotex Logo"
              className={`transition-all duration-300 ${scrolled ? "h-14" : "h-20"}`}
            />
          </a>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={LINK_CLASSES}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Hamburger Toggle */}
          <button
            className="md:hidden flex flex-col justify-between w-8 h-6 z-[1000]"
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
          >
            <span className={`h-1 w-full bg-[#001f3f] rounded-full transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2.5 bg-white" : ""}`} />
            <span className={`h-1 w-full bg-[#001f3f] rounded-full transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`h-1 w-full bg-[#001f3f] rounded-full transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2.5 bg-white" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Slide-out */}
      <aside
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[400px] bg-[#001f3f] z-[998] p-12 flex flex-col justify-center transition-transform duration-500 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={closeMobileMenu}
              className={MOBILE_LINK_CLASSES}
            >
              {link.label}
            </a>
          ))}
          <a 
            href="#contact" 
            onClick={closeMobileMenu}
            className="mt-4 bg-blue-600 text-white text-center py-4 rounded-xl font-bold text-lg"
          >
            GET A QUOTE
          </a>
        </nav>
      </aside>
    </>
  );
}