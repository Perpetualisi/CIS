import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Project from './components/Projects';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useEffect, useLayoutEffect } from 'react';

const MainPage = ({ scrollTo }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    // Prevent default scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Check if we're on a service subpage
    const isServiceSubpage = location.pathname.startsWith('/services/');
    
    if (isServiceSubpage || scrollTo === 'services') {
      // Wait for next tick to ensure Services component is mounted
      requestAnimationFrame(() => {
        const el = document.getElementById('services');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    } else if (scrollTo) {
      requestAnimationFrame(() => {
        const el = document.getElementById(scrollTo);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [scrollTo, location.pathname]);

  return (
    <>
      <Hero />
      <About id="about" />
      <Services id="services" />
      <Project id="projects" />
      <Partners id="partners" />
      <Contact id="contact" />
      <Footer />
    </>
  );
};

const App = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/about-us" element={<MainPage scrollTo="about" />} />
      <Route path="/services" element={<MainPage scrollTo="services" />} />
      <Route path="/services/:id" element={<MainPage scrollTo="services" />} />
      <Route path="/projects" element={<MainPage scrollTo="projects" />} />
      <Route path="/clients" element={<MainPage scrollTo="partners" />} />
      <Route path="/contact" element={<MainPage scrollTo="contact" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </>
);

export default App;