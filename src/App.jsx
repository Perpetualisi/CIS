import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Project from './components/Projects';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import { useEffect, useLayoutEffect, useRef } from 'react';

const MainPage = ({ scrollTo }) => {
  const location = useLocation();
  const scrollLocked = useRef(false);

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const isServiceSubpage = location.pathname.startsWith('/services/');

    if (isServiceSubpage || scrollTo === 'services') {
      requestAnimationFrame(() => {
        const el = document.getElementById('services');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else if (scrollTo) {
      requestAnimationFrame(() => {
        const el = document.getElementById(scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      scrollLocked.current = true;

      window.scrollTo(0, 0);

      const t1 = setTimeout(() => window.scrollTo(0, 0), 0);
      const t2 = setTimeout(() => window.scrollTo(0, 0), 50);
      const t3 = setTimeout(() => window.scrollTo(0, 0), 100);
      const t4 = setTimeout(() => {
        window.scrollTo(0, 0);
        scrollLocked.current = false;
      }, 200);

      const handleScroll = () => {
        if (scrollLocked.current) {
          window.scrollTo(0, 0);
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        window.removeEventListener('scroll', handleScroll);
      };
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
    <ChatBot />
  </>
);

export default App;