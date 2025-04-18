import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginSuccess } from "../redux/authSlice";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    setMessage("");
    setError("");
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy auth check
    const isAuthenticated = true;

    if (isAuthenticated) {
      dispatch(loginSuccess({ email: formData.email, name: "John Doe" }));
      navigate("/");
    } else {
      setError("Invalid credentials");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Signup successful! Check your email.");
        setFormData({ name: "", email: "", password: "" });
      } else {
        setError(data.message || data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#d9e9f2] to-[#f0f9fa] sm:bg-cover sm:bg-center sm:bg-no-repeat sm:bg-[url('/assets/Login_BG.jpg')] "

    >
      <div className="p-8 rounded-xl shadow-md w-full max-w-md relative overflow-hidden bg-white opacity-95">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Welcome Back</h2>
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block mb-1 text-gray-600">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-600">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="text-right text-sm text-[#29659e] hover:underline cursor-pointer">
                  Forgot Password?
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#29659e] hover:text-[#2A2ADB] text-white py-2 rounded-lg hover:bg-[#4994DB] transition cursor-pointer"
                >
                  Login
                </button>
              </form>
              <p className="text-center text-sm text-gray-500 mt-6">
                Don’t have an account?{" "}
                <span
                  onClick={toggleForm}
                  className="text-[#29659e] hover:underline cursor-pointer"
                >
                  Sign up
                </span>
              </p>
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create Your Account</h2>
              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label className="block mb-1 text-gray-600">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-600">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-600">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#29659e] hover:text-[#2A2ADB] text-white py-2 rounded-lg hover:bg-[#4994DB] transition cursor-pointer"
                >
                  Sign Up
                </button>
              </form>
              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{" "}
                <span
                  onClick={toggleForm}
                  className="text-[#29659e] hover:underline cursor-pointer"
                >
                  Login
                </span>
              </p>
              {message && <p className="text-green-600 text-center mt-4">{message}</p>}
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default LoginSignup;
