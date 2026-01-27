import React from "react";

const partnerLogos = [
  "/Partners/logo1.png", "/Partners/logo2.png", "/Partners/logo3.png", "/Partners/logo4.jpeg",
  "/Partners/logo5.png", "/Partners/logo6.jpg", "/Partners/logo7.jpg", "/Partners/logo8.png",
  "/Partners/logo9.png", "/Partners/logo10.png", "/Partners/logo11.png", "/Partners/logo12.webp",
  "/Partners/logo13.png", "/Partners/logo14.jpg", "/Partners/logo15.png", "/Partners/logo16.webp",
  "/Partners/logo17.png", "/Partners/logo18.jpg", "/Partners/logo19.jpeg", "/Partners/logo20.jpeg",
];

const clientCategories = [
  {
    category: "Healthcare",
    clients: [
      "MD Anderson Cancer Center – Network Migration & Windows Refresh",
      "United Healthcare – Enterprise Network Migration & Epic Projects",
      "Memorial Hermann – Epic Refresh Project & M48 Cart Maintenance",
    ],
  },
  {
    category: "Financial Institutions",
    clients: [
      "Wells Fargo – Enterprise Systems Refresh & Security Compliance",
      "Bank of America – Systems Refresh for Modernized Infrastructure",
      "Morgan Stanley – Managed IT, Network Migrations & Cybersecurity",
    ],
  },
  {
    category: "Oil & Gas",
    clients: [
      "Shell – Desktop Support, Network Admin, Security Hardening",
      "BP – Cisco Phone Migration, AV Deployments, Cybersecurity",
    ],
  },
  {
    category: "Retail & Commercial",
    clients: [
      "Walmart – Network Migration & POS Refresh",
      "Target – POS Refresh with ELO Tablets",
      "McDonald’s – Network Migration",
      "Porche Car Dealership – Network & CCTV Installation",
      "HEB – RFID Installation",
      "Sprouts Farmers Market – CCTV & AV Migration",
    ],
  },
  {
    category: "Government & Transportation",
    clients: [
      "Texas State Prisons – Network Migration & Secure AP Deployment",
      "METRO – Beacon Deployment across 9,000+ bus stops",
    ],
  },
  {
    category: "Power & Utilities",
    clients: ["Nova Source Power – CCTV & Outdoor Security Installations"],
  },
];

const Partners = () => {
  return (
    <section className="py-24 px-4 bg-slate-50 overflow-hidden" id="partners">
      <div className="max-w-7xl mx-auto">
        {/* Heading Area */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#001f3f] mb-6">
            Trusted by Industry Leaders
          </h2>
          <p className="max-w-3xl mx-auto text-slate-600 text-lg md:text-xl font-medium">
            From healthcare to government, we deliver mission-critical IT solutions 
            ensuring reliability, security, and enterprise efficiency.
          </p>
        </div>

        {/* Client Categories Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {clientCategories.map((category, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-[#001f3f] rounded-full group-hover:bg-blue-600 transition-colors"></div>
                <h3 className="text-xl font-black text-[#001f3f]">{category.category}</h3>
              </div>
              <ul className="space-y-4">
                {category.clients.map((client, index) => (
                  <li key={index} className="flex gap-3 text-slate-600 font-semibold text-sm leading-relaxed">
                    <span className="text-blue-600 font-bold">•</span>
                    {client}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Logo Section */}
        <div className="pt-10 border-t border-slate-200">
          <h3 className="text-center text-sm font-black text-slate-400 uppercase tracking-[0.4em] mb-12">
            Enterprise Client Network
          </h3>
          
          {/* Logo Marquee Container */}
          <div className="relative flex overflow-x-hidden group">
            <div className="animate-marquee flex items-center whitespace-nowrap gap-12 py-4">
              {/* Double mapping for seamless loop */}
              {[...partnerLogos, ...partnerLogos].map((logo, index) => (
                <img
                  key={index}
                  src={logo}
                  alt="Partner Logo"
                  className="h-12 md:h-16 w-auto object-contain opacity-100 transition-transform duration-300 hover:scale-110 mx-4"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Global Style for Marquee Animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
};

export default Partners;