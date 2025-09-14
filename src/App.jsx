import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services/Services'
import Project from './components/Projects'
import './App.css'
import './index.css'
import Contact from './components/Contact'
import Footer from './components/Footer/footer'


const App = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <About/>
      <Services/>
      <Project/>
      <Contact/>
      <Footer/>
    </div>
  )
}

export default App
