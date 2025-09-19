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
import Partners from './components/Partners'


const App = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <About/>
      <Services/>
      <Project/>
      <Partners/>
      <Contact/>
      <Footer/>
    </div>
  )
}

export default App
