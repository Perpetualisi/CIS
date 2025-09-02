import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your backend integration here (e.g., Formspree or custom API)
    console.log(formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <h2>Let’s Build Smarter IT Together</h2>
        <p>Reach out to CIS for tailored tech solutions to elevate your business.</p>

        <div className="contact-content">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Select Subject</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="IT Services">IT Services</option>
              <option value="Support">Support</option>
              <option value="Partnership">Partnership</option>
            </select>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit">Send Message</button>
            {submitted && <span className="success-message">Message sent successfully!</span>}
          </form>

          <div className="contact-info">
            <h3>Contact Info</h3>
            <p><strong>Email:</strong> ucmgbame@gmail.com</p>
            <p><strong>Phone:</strong> +1 (832) 535-1082</p>
            <p><strong>Location:</strong> Richmond, TX 77469</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
