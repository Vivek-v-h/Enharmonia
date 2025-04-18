import React, { useState } from "react";
import { Menu, X, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, redirect, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarDropdown, setAvatarDropdown] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setAvatarDropdown(false);
    window.location.href = "/"; 
  };
  

  return (
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
      <div className="flex-1 text-center md:text-left font-bold text-lg cursor-pointer">
        <a href="/">
        <img
          src="./assets/enharmonia_page_header.png"
          alt="logo of enharmonia properties"
        />
        </a>
        
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6 flex-1 justify-center tracking-widest">
        <NavLink to="/" className="hover:text-blue-600">Home</NavLink>
        <NavLink to="#" className="hover:text-blue-600">Post An Ad</NavLink>
        <NavLink to="#" className="hover:text-blue-600">Find Properties</NavLink>
        <NavLink to="#" className="hover:text-blue-600">Contact Us</NavLink>
      </nav>

      {/* Right Section - Login or Avatar */}
      <div className="ml-auto relative">
        {!isAuthenticated ? (
          <NavLink to="/login-signup">
            <button className="border rounded-xl border-[#29659e] px-7 py-1 hover:bg-[#c7c5d4] text-[#29659e] cursor-pointer">
              Login
            </button>
          </NavLink>
        ) : (
          <div className="relative">
            <button
              onClick={() => setAvatarDropdown(!avatarDropdown)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <UserCircle size={32} className="text-gray-700" />
              <span className="text-sm text-gray-800">{user?.name || "User"}</span>
            </button>

            {/* Avatar Dropdown */}
            <AnimatePresence>
              {avatarDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg py-2 z-50"
                >
                  <NavLink
                    to="/profile"
                    onClick={() => setAvatarDropdown(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 w-3/4 sm:w-1/2 h-full bg-white shadow-lg z-50 flex flex-col p-6 text-lg"
            >
              <div className="self-end mb-6">
                <button onClick={() => setIsOpen(false)}>
                  <X size={26} className="text-gray-800" />
                </button>
              </div>

              <NavLink
                to="/"
                className="hover:text-blue-600 mb-4"
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="#"
                className="hover:text-blue-600 mb-4"
                onClick={() => setIsOpen(false)}
              >
                Post An Ad
              </NavLink>
              <NavLink
                to="#"
                className="hover:text-blue-600 mb-4"
                onClick={() => setIsOpen(false)}
              >
                Find Properties
              </NavLink>
              <NavLink
                to="#"
                className="hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </NavLink>
              {!isAuthenticated ? (
                <NavLink
                  to="/login-signup"
                  onClick={() => setIsOpen(false)}
                  className="mt-6 text-[#29659e] border border-[#29659e] rounded-xl px-4 py-2 text-center hover:bg-[#c7c5d4]] cursor-pointer"
                >
                  Login
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="mt-6 text-gray-700 block"
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="mt-2 text-red-500 text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
