import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Project from './components/Projects';
import Partners from './components/Partners';
import Contact from './components/Contact';
import './App.css';
import './index.css';
import Services from './components/Services';
import Footer from './components/Footer';

const App = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Services/>
      <Project />
      <Partners />
      <Contact />
      <Footer/>
    </div>
  );
}

export default App;
