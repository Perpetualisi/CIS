import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "HOME", path: "/" },
  { label: "ABOUT-US", path: "/about-us", scrollId: "about" },
  { label: "SERVICES", path: "/services", scrollId: "services" },
  { label: "PROJECTS", path: "/projects", scrollId: "projects" },
  { label: "CLIENTS", path: "/clients", scrollId: "partners" },
  { label: "CONTACT", path: "/contact", scrollId: "contact" },
];

// Refined Styles
const LINK_CLASSES = "text-[#001f3f] font-bold text-sm tracking-tight cursor-pointer transition-all duration-300 hover:text-blue-600";
const MOBILE_LINK_CLASSES = "text-2xl text-white font-black text-left cursor-pointer transition-colors duration-300 hover:text-blue-400";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to section when URL changes
  useEffect(() => {
    const current = NAV_LINKS.find(link => link.path === location.pathname);
    if (current && current.scrollId) {
      const el = document.getElementById(current.scrollId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

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

  const handleClick = (path) => {
    navigate(path);
    closeMobileMenu();
  };

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
          <Link to="/" className="flex items-center transition-transform hover:scale-105" onClick={() => closeMobileMenu()}>
            <img
              src="/logo.png"
              alt="Conotex Logo"
              className={`transition-all duration-300 ${scrolled ? "h-14" : "h-20"}`}
            />
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => handleClick(link.path)}
                  className={LINK_CLASSES}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Hamburger Toggle */}
          <button
            className={`md:hidden flex flex-col justify-between w-10 h-10 p-2 z-[1000] rounded-lg transition-colors duration-300 ${
              mobileMenuOpen ? "bg-white" : "bg-transparent"
            }`}
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
          >
            <div className="flex flex-col justify-between w-full h-full">
              <span className={`h-1 w-full rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-[11px] bg-[#001f3f]" : "bg-[#001f3f]"
              }`} />
              <span className={`h-1 w-full rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : "bg-[#001f3f]"
              }`} />
              <span className={`h-1 w-full rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-[11px] bg-[#001f3f]" : "bg-[#001f3f]"
              }`} />
            </div>
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
            <button
              key={link.label}
              onClick={() => handleClick(link.path)}
              className={MOBILE_LINK_CLASSES}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleClick("/contact")}
            className="mt-4 bg-blue-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            GET A QUOTE
          </button>
        </nav>
      </aside>
    </>
  );
}
