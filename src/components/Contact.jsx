import React, { useState } from "react";
import {
  MdOutlineMarkEmailRead,
  MdEmail,
  MdSupportAgent,
  MdPerson,
  MdPhone,
  MdLocationOn,
} from "react-icons/md";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=uchenna.m@conotextech.com&su=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )}`;

    // open Gmail in new tab
    window.open(mailtoLink, "_blank");

    // show success message
    setStatus("✅ Message opened in your email app");

    // reset form
    setFormData({ name: "", email: "", subject: "", message: "" });

    // clear status after 4s
    setTimeout(() => setStatus(""), 4000);
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
          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="subject">Subject</label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Select Subject</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Project & Service Requests">
                Project & Service Requests
              </option>
              <option value="Technical Support">Technical Support</option>
              <option value="Direct Contact">Direct Contact</option>
            </select>

            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Type your message here..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" className="contact-btn">
              Send Message
            </button>

            {status && <p className="success-message">{status}</p>}
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
              <a href="mailto:support@conotextech.com">
                support@conotextech.com
              </a>
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
