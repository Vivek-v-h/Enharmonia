import React from 'react'
import Cities from "../components/Cities";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Services from "../components/Services";
const Landing = () => {
  return (
    <div>
      <div className="font-sans text-gray-800">
        {/* Header */}

        <Navbar />

        {/* Hero Section */}
        <Hero />
{/* Services Section */}  
        {/* Cities Section */}
        <Cities />

        {/* Services Section */}
        <Services />

        {/* Call to Action */}
        <Contact/>

        {/* Footer */}
        <Footer/>
      </div>
    </div>
  )
}

export default Landing