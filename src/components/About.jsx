import React, { useState } from 'react';
import './About.css';

const About = () => {
  const [activeTab, setActiveTab] = useState('about');

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <>
            <p>
              Conotex Integrated Services (CIS), a division of Conotex Systems &amp; Energy Services LLC, is a trusted nationwide provider of low-voltage and managed IT solutions. Since 2011, we have partnered with leading brands across industries to design, deploy, and manage critical infrastructure with precision and reliability.
            </p>
            <p>
              Our comprehensive services include structured cabling, IP surveillance, telecom, audio/visual systems, custom website design &amp; digital solutions, lifecycle services, and technical support. With a team of experienced engineers and project managers, we deliver scalable solutions that keep businesses connected, secure, and future-ready.
            </p>
            <p>
              At CIS, we pride ourselves on being a single point of contact for complex technology needs, streamlining implementation, reducing downtime, and ensuring seamless performance. From initial design through ongoing support, we provide the expertise, responsiveness, and nationwide reach our clients count on. Reliable infrastructure, always.
            </p>
          </>
        );
      case 'mission':
        return (
          <p>
            Our mission is to empower businesses of all sizes with innovative, reliable, and scalable IT solutions that simplify complexity, enhance productivity, and drive sustainable growth. We are committed to providing cutting-edge technology, proactive support, and tailored strategies that enable organizations to stay competitive in an ever-evolving digital landscape. Through collaboration, expertise, and integrity, we help our clients achieve operational excellence and long-term success.
          </p>
        );
      case 'vision':
        return (
          <p>
            Our vision is to be the leading nationwide IT services provider, recognized for delivering transformative technology solutions that enable businesses to thrive. We strive to create a connected, secure, and digitally empowered world where every organization can leverage the power of technology to innovate, scale, and achieve its full potential. By continuously advancing our services, nurturing talent, and fostering partnerships, we aim to set the standard for excellence in IT consulting and infrastructure management.
          </p>
        );
      case 'values':
        return (
          <ul className="core-values-list">
            <li><strong>Integrity</strong> – We act with honesty, transparency, and accountability in every engagement.</li>
            <li><strong>Innovation</strong> – We embrace creative, forward-thinking solutions that keep our clients ahead.</li>
            <li><strong>Excellence</strong> – We commit to the highest standards in service delivery and technical performance.</li>
            <li><strong>Customer Focus</strong> – We listen, understand, and tailor solutions to meet each client’s unique needs.</li>
            <li><strong>Reliability</strong> – We deliver dependable support that our clients can trust nationwide.</li>
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <section className="about-section" id="about">
      <div className="about-wrapper">
        <div className="about-image">
          <video
            src="/about.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="about-video"
          />
        </div>

        <div className="about-content">
          <h2 className="section-title">Who We Are</h2>
          <p className="about-intro">
            At <strong>Conotex Integrated Services</strong>, we deliver reliable, scalable, and secure IT solutions nationwide.
          </p>

          <div className="tabs">
            <button onClick={() => setActiveTab('about')} className={activeTab === 'about' ? 'active' : ''}>About Us</button>
            <button onClick={() => setActiveTab('mission')} className={activeTab === 'mission' ? 'active' : ''}>Mission</button>
            <button onClick={() => setActiveTab('vision')} className={activeTab === 'vision' ? 'active' : ''}>Vision</button>
            <button onClick={() => setActiveTab('values')} className={activeTab === 'values' ? 'active' : ''}>Core Values</button>
          </div>

          <div className="tab-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
