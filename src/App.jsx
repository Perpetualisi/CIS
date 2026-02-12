import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Project from './components/Projects';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useEffect } from 'react';

const MainPage = ({ scrollTo }) => {
  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [scrollTo]);

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
      <Route path="/projects" element={<MainPage scrollTo="projects" />} />
      <Route path="/clients" element={<MainPage scrollTo="partners" />} />
      <Route path="/contact" element={<MainPage scrollTo="contact" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </>
);

export default App;
