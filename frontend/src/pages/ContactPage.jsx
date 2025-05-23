import React from 'react'
import Contact from '../components/Contact'
import Navbar from '../components/Navbar'

const ContactPage = () => {
  return (
    <div>
        <Navbar/>
        <div className='pt-0 mt-0'>
            <Contact/>
        </div>
        
    </div>
  )
}

export default ContactPage