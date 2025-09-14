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
              <strong>Conotex Integrated Services (CIS)</strong>, a division of Conotex Systems &amp; Energy Services LLC, is a trusted nationwide provider of low-voltage and managed IT solutions. Since 2011, we have partnered with leading brands across industries to design, deploy, and manage critical infrastructure with precision and reliability.
            </p>
            <p>
              Our services include structured cabling, IP surveillance, telecom, A/V systems, custom website design, digital solutions, lifecycle services, and technical support. With a team of experienced engineers and project managers, we deliver scalable solutions that keep businesses connected, secure, and future-ready.
            </p>
            <p>
              At CIS, we pride ourselves on being a single point of contact for complex technology needs, streamlining implementation, reducing downtime, and ensuring seamless performance. From initial design through ongoing support, we provide expertise, responsiveness, and nationwide reach our clients count on.
            </p>
          </>
        );
      case 'mission':
        return (
          <p>
            Our mission is to empower businesses of all sizes with innovative, reliable, and scalable IT solutions that simplify complexity, enhance productivity, and drive sustainable growth. We are committed to proactive support, cutting-edge technology, and tailored strategies that enable organizations to thrive in an ever-evolving digital world.
          </p>
        );
      case 'vision':
        return (
          <p>
            Our vision is to be the leading nationwide IT services provider, recognized for delivering transformative technology solutions that enable businesses to thrive. We strive to create a connected, secure, and digitally empowered world where every organization can achieve its full potential.
          </p>
        );
      case 'values':
        return (
          <ul className="core-values-list">
            <li><strong>Integrity</strong> – Acting with honesty, transparency, and accountability.</li>
            <li><strong>Innovation</strong> – Embracing forward-thinking solutions to stay ahead.</li>
            <li><strong>Excellence</strong> – Delivering the highest standards in performance.</li>
            <li><strong>Customer Focus</strong> – Listening, understanding, and tailoring solutions.</li>
            <li><strong>Reliability</strong> – Providing dependable nationwide support.</li>
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <section className="about-section" id="about">
      <div className="about-wrapper">
        {/* Video Section */}
        <div className="about-image">
          <div className="video-overlay"></div>
          <video
            src="/about.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="about-video"
          />
        </div>

        {/* Content Section */}
        <div className="about-content">
          <h2 className="section-title">Who We Are</h2>
          <p className="about-intro">
            At <strong>Conotex Integrated Services</strong>, we deliver reliable, scalable, and secure IT solutions nationwide.
          </p>

          {/* Tabs */}
          <div className="tabs">
            <button
              onClick={() => setActiveTab('about')}
              className={activeTab === 'about' ? 'active' : ''}
            >
              About Us
            </button>
            <button
              onClick={() => setActiveTab('mission')}
              className={activeTab === 'mission' ? 'active' : ''}
            >
              Mission
            </button>
            <button
              onClick={() => setActiveTab('vision')}
              className={activeTab === 'vision' ? 'active' : ''}
            >
              Vision
            </button>
            <button
              onClick={() => setActiveTab('values')}
              className={activeTab === 'values' ? 'active' : ''}
            >
              Core Values
            </button>
          </div>

          {/* Dynamic Content */}
          <div className="tab-content fade-in">
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
