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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONSTANTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const NAVBAR_H  = 66;   // px — must match Navbar.jsx height
const SCROLL_MS = 80;   // retry interval
const MAX_TRIES = 10;   // max retries (~800 ms window)

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   scrollToSection — smooth scroll with fixed-navbar offset + retry
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function scrollToSection(id, attempt = 0) {
  if (!id) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_H;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  } else if (attempt < MAX_TRIES) {
    setTimeout(() => scrollToSection(id, attempt + 1), SCROLL_MS);
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ROUTE → SECTION MAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const ROUTES = [
  { path: '/',              section: null        },
  { path: '/about-us',      section: 'about'    },
  { path: '/services',      section: 'services' },
  { path: '/services/:id',  section: 'services' },
  { path: '/projects',      section: 'projects' },
  { path: '/clients',       section: 'partners' },
  { path: '/contact',       section: 'contact'  },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MainPage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const MainPage = ({ section }) => {
  const location = useLocation();

  /* Disable browser's native scroll restoration */
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  /* Scroll whenever section or pathname changes */
  useEffect(() => {
    const target =
      section ??
      (location.pathname.startsWith('/services/') ? 'services' : null);

    const timer = setTimeout(() => scrollToSection(target), 50);
    return () => clearTimeout(timer);
  }, [section, location.pathname]);

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Project />
      <Partners />
      <Contact />
      <Footer />
    </>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   App
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const App = () => (
  <>
    <Navbar />
    <Routes>
      {ROUTES.map(({ path, section }) => (
        <Route key={path} path={path} element={<MainPage section={section} />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

export default App;