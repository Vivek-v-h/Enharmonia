import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link } from "react-scroll";
import { Button } from "@mui/material";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarDropdown, setAvatarDropdown] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("/default-avatar.png");

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const API_BASE = "http://localhost:3000";

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const avatar = res.data?.avatar;

        const fullAvatarUrl = avatar
          ? avatar.startsWith("http")
            ? avatar
            : `${API_BASE}${avatar.startsWith("/") ? "" : "/"}${avatar}`
          : "/default-avatar.png";

        setAvatarUrl(fullAvatarUrl);
      } catch (error) {
        console.error("Error fetching avatar:", error);
        setAvatarUrl("/default-avatar.png");
      }
    };

    if (isAuthenticated) {
      fetchAvatar();
    } else {
      setAvatarUrl("/default-avatar.png");
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    setAvatarDropdown(false);
    window.location.href = "/";
  };

  const handleImageError = (e) => {
    e.target.src = "/default-avatar.png";
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
        <NavLink to="/" className="hover:text-blue-600">
          Home
        </NavLink>
        <NavLink to="#" className="hover:text-blue-600">
          Post An Ad
        </NavLink>
        <NavLink to="#" className="hover:text-blue-600">
          Find Properties
        </NavLink>
        <Link
          to="contactus"
          smooth={true}
          duration={500}
          className="hover:text-blue-600 cursor-pointer"
        >
          Contact Us
        </Link>
      </nav>

      {/* Right Section */}
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
              className="flex items-center space-x-2 focus:outline-none cursor-pointer"
            >
              <img
                src={avatarUrl}
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover border border-gray-300"
                onError={handleImageError}
              />
              <span className="text-sm text-gray-800">
                {user?.name || "User"}
              </span>
            </button>

            {/* Dropdown */}
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
    </header>
  );
};

export default Navbar;
