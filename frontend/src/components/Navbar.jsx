import React from "react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <header className="mx-4 mt-4 p-4 md:px-12 rounded-2xl shadow-lg bg-white flex items-center justify-between z-50 relative">
        {/* Mobile Menu Icon */}
        <div className="md:hidden z-50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 focus:outline-none"
          >
            <Menu size={28} />
          </button>
        </div>

        {/* Logo */}
        <div className="flex-1 text-center md:text-left font-bold text-lg">
          <img
            src="./assets/enharmonia_page_header.png"
            alt="logo of enharmonia properties"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 flex-1 justify-center tracking-widest">
          <a href="#" className="hover:text-blue-600">
            Home
          </a>
          <a href="#" className="hover:text-blue-600">
            Post An Ad
          </a>
          <a href="#" className="hover:text-blue-600">
            Find Properties
          </a>
          <a href="#" className="hover:text-blue-600">
            Contact Us
          </a>
        </nav>

        {/* Login Button */}
        <NavLink to="/login-signup">
          <div className="ml-auto">
            <button className="border rounded-xl border-green-700  px-7 py-1 hover:bg-green-100 cursor-pointer text-green-700">
              Login
            </button>
          </div>
        </NavLink>

        {/* Mobile Menu - Animated */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />

              {/* Slide-in Menu */}
              <motion.nav
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-0 left-0 w-3/4 sm:w-1/2 h-full bg-white shadow-lg z-50 flex flex-col p-6 text-lg"
              >
                {/* Close Button Inside Menu */}
                <div className="self-end mb-6">
                  <button onClick={() => setIsOpen(false)}>
                    <X size={26} className="text-gray-800" />
                  </button>
                </div>

                {/* Navigation Links */}
                <a
                  href="#"
                  className="hover:text-blue-600 mb-4"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </a>
                <a
                  href="#"
                  className="hover:text-blue-600 mb-4"
                  onClick={() => setIsOpen(false)}
                >
                  Post An Ad
                </a>
                <a
                  href="#"
                  className="hover:text-blue-600 mb-4"
                  onClick={() => setIsOpen(false)}
                >
                  Find Properties
                </a>
                <a
                  href="#"
                  className="hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Contact Us
                </a>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
};

export default Navbar;
