import React, { useState } from "react";
import {
  MdOutlineMarkEmailRead,
  MdEmail,
  MdSupportAgent,
  MdPhone,
  MdLocationOn
} from "react-icons/md";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const form = e.target;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        setStatus("✅ Message sent successfully!");
        form.reset();
      } else {
        setStatus("❌ Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <section className="py-24 px-6 bg-slate-50 relative z-10" id="contact">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#001f3f] mb-4 flex items-center justify-center gap-3">
            <MdOutlineMarkEmailRead className="text-orange-500" /> Get In Touch
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Ready to modernize your infrastructure? Reach out for projects, technical support, or general inquiries.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Form Wrapper */}
          <div className="flex-[1.5] w-full">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/60 h-full">
              <form
                className="flex flex-col gap-6"
                action="https://formspree.io/f/myzrrprd"
                method="POST"
                onSubmit={handleSubmit}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[#001f3f] font-bold text-sm uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      required
                      className="p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#001f3f] transition-all bg-slate-50 text-gray-800"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[#001f3f] font-bold text-sm uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      name="_replyto"
                      placeholder="john@company.com"
                      required
                      className="p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#001f3f] transition-all bg-slate-50 text-gray-800"
                    />
                  </div>
                </div>

                <input type="hidden" name="_from" value="no-reply@conotextech.com" />

                <div className="flex flex-col gap-2">
                  <label className="text-[#001f3f] font-bold text-sm uppercase tracking-wider">Inquiry Type</label>
                  <select
                    name="subject"
                    required
                    className="p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#001f3f] transition-all bg-slate-50 appearance-none cursor-pointer text-gray-800"
                  >
                    <option value="">Select a service...</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Project Request">Project Request</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Cybersecurity Audit">Cybersecurity Audit</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[#001f3f] font-bold text-sm uppercase tracking-wider">Message</label>
                  <textarea
                    name="message"
                    placeholder="How can we help your business thrive?"
                    required
                    className="p-4 rounded-xl border border-slate-200 min-h-[160px] focus:outline-none focus:ring-2 focus:ring-[#001f3f] transition-all bg-slate-50 text-gray-800"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#001f3f] text-white font-bold py-4 rounded-xl hover:bg-[#002d5c] transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-blue-900/20"
                >
                  {loading ? "Transmitting..." : "Send Message"}
                </button>

                {status && (
                  <div className={`p-4 rounded-xl text-center font-bold ${status.includes("✅") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                    {status}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="flex-1 flex flex-col gap-6 w-full">
            <div className="bg-[#001f3f] p-8 md:p-10 rounded-3xl text-white shadow-xl h-full">
              <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-4 tracking-tight">Corporate Office</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-lg text-orange-400 shrink-0">
                    <MdEmail size={24} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1 font-bold">Email Us</p>
                    <a href="mailto:info@conotextech.com" className="hover:text-orange-400 transition-colors font-medium break-all">info@conotextech.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-lg text-orange-400 shrink-0">
                    <MdPhone size={24} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1 font-bold">Call Us</p>
                    <p className="font-medium">+1 (832) 535-1082</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-lg text-orange-400 shrink-0">
                    <MdLocationOn size={24} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1 font-bold">Our HQ</p>
                    <p className="font-medium">Richmond, TX 77469 USA</p>
                  </div>
                </div>
              </div>

              {/* Quick Support Card Inside Sidebar for better flow */}
              <div className="mt-10 bg-orange-500 p-6 rounded-2xl text-white">
                <h4 className="font-black text-lg mb-2 flex items-center gap-2">
                  <MdSupportAgent size={22} /> 24/7 Support
                </h4>
                <p className="text-white/90 text-xs leading-relaxed font-medium">
                  Clients with contracts can reach our team at <span className="underline">support@conotextech.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;