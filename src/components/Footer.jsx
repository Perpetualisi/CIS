import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#001122] text-slate-300 pt-20 pb-10 px-6 font-sans border-t border-white/5">
      <div className="max-w-7xl mx-auto grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-white text-2xl font-black tracking-tight uppercase">
              CONOTEX <span className="text-orange-500">TECH</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Revolutionizing enterprise infrastructure through innovative technology solutions. 
            Reliability, security, and efficiency delivered globally.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300">
              <FaFacebookF size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300">
              <FaTwitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300">
              <FaLinkedinIn size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300">
              <FaInstagram size={18} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
            Quick Links
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-orange-500 rounded-full"></span>
          </h3>
          <ul className="space-y-4">
            <li><a href="#projects" className="text-slate-400 hover:text-orange-500 transition-all block">Our Projects</a></li>
            <li><a href="#services" className="text-slate-400 hover:text-orange-500 transition-all block">Core Services</a></li>
            <li><a href="#partners" className="text-slate-400 hover:text-orange-500 transition-all block">Global Partners</a></li>
            <li><a href="#contact" className="text-slate-400 hover:text-orange-500 transition-all block">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact Details */}
        <div>
          <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
            Get In Touch
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-orange-500 rounded-full"></span>
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm">
              <MdEmail className="text-orange-500 mt-1" size={20} />
              <a href="mailto:info@conotextech.com" className="hover:text-white transition-colors">info@conotextech.com</a>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <MdPhone className="text-orange-500 mt-1" size={20} />
              <a href="tel:+18325351082" className="hover:text-white transition-colors">+1 (832) 535-1082</a>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <MdLocationOn className="text-orange-500 mt-1" size={20} />
              <span>Richmond, TX 77469 USA</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
            Newsletter
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-orange-500 rounded-full"></span>
          </h3>
          <div className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Your Email" 
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-orange-500"
            />
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-all active:scale-95">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-[10px] font-medium text-slate-500 tracking-widest uppercase">
        <p>&copy; {currentYear} CONOTEX TECH. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
};

export default Footer;

