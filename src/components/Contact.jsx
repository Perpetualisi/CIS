import React, { useState } from "react";
import {
  MdOutlineMarkEmailRead,
  MdEmail,
  MdSupportAgent,
  MdPerson,
  MdPhone,
  MdLocationOn
} from "react-icons/md";
import "./Contact.css";

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
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <h2 className="section-title">
          <MdOutlineMarkEmailRead /> Contact Us
        </h2>

        <p className="section-subtitle">
          We’re here to help you with projects, support, or general inquiries.
          Fill out the form or use our contact info below.
        </p>

        <div className="contact-content">
          {/* Contact Form */}
          <form
            className="contact-form"
            action="https://formspree.io/f/myzrrprd"
            method="POST"
            onSubmit={handleSubmit}
          >
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              required
            />

            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="_replyto" // visitor email for reply
              placeholder="Enter your email"
              required
            />

            <input
              type="hidden"
              name="_from"
              value="no-reply@conotextech.com" // domain-based sender
            />

            <label htmlFor="subject">Subject</label>
            <select id="subject" name="subject" required>
              <option value="">Select Subject</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Project Request">Project Request</option>
              <option value="Technical Support">Technical Support</option>
            </select>

            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Type your message here..."
              required
            ></textarea>

            <button
              type="submit"
              className="contact-btn"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {status && (
              <p
                className={`status-message ${
                  status.includes("✅") ? "success" : "error"
                }`}
              >
                {status}
              </p>
            )}
          </form>

          {/* Contact Info */}
          <div className="contact-info">
            <h3>Contact Info</h3>

            <p>
              <MdEmail /> General Inquiries:{" "}
              <a href="mailto:info@conotextech.com">info@conotextech.com</a>
            </p>

            <p>
              <MdSupportAgent /> Project & Service Requests:{" "}
              <a href="mailto:projects@conotextech.com">
                projects@conotextech.com
              </a>
            </p>

            <p>
              <MdSupportAgent /> Technical Support:{" "}
              <a href="mailto:support@conotextech.com">support@conotextech.com</a>
            </p>

            <p>
              <MdPerson /> Direct Contact (Founder):{" "}
              <a href="mailto:uchenna.m@conotextech.com">
                uchenna.m@conotextech.com
              </a>
            </p>

            <h4>Call Us</h4>
            <p>
              <MdPhone /> +1 (832) 535-1082
            </p>

            <h4>Location</h4>
            <p>
              <MdLocationOn /> Richmond, TX 77469 USA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
