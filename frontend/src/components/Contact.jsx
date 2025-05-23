import React from "react";
import {
  Phone,
  Mail,
  Instagram,
  WhatsApp,
  Facebook,
} from "@mui/icons-material";

const Contact = () => {
  return (
    <div>
      <section
        id="contactus"
        className="p-6 md:px-12 flex flex-col md:flex-row bg-blue-50  rounded-xl"
      >
        {/* Left Side */}
        <div className="flex-1 space-y-4 pr-4 flex flex-col justify-start">
          <h2 className="text-2xl font-semibold">Find your best Real Estate</h2>
          <p>
            We provide a complete service for the sale, purchase or rental of
            real estate.
          </p>

          {/* Horizontal Buttons */}
          <div className="flex flex-wrap gap-4 mt-4">
            <a
              href="tel:+1234567890"
              className="flex items-center bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 space-x-2"
            >
              <Phone fontSize="small" />
              <span>Call Us</span>
            </a>
            <a
              href="mailto:info@example.com"
              className="flex items-center bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 space-x-2"
            >
              <Mail fontSize="small" />
              <span>Email Us</span>
            </a>
            <a
              href="https://instagram.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 space-x-2"
            >
              <Instagram fontSize="small" />
              <span>Instagram</span>
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 space-x-2"
            >
              <WhatsApp fontSize="small" />
              <span>WhatsApp</span>
            </a>
            <a
              href="https://facebook.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 space-x-2"
            >
              <Facebook fontSize="small" />
              <span>Facebook</span>
            </a>
          </div>

          {/* Contact Form */}
          <div className="mt-6 flex-grow">
            <h3 className="text-lg font-semibold mb-2">Send Us a Message</h3>
            <form action="#" method="POST" className="h-full">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Your Message"
                    rows="4"
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-green-700 text-white px-6 py-2 rounded-lg mt-4 hover:bg-green-800 cursor-pointer"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="hidden md:block w-full md:w-1/3">
          <img
            src="/assets/Mask Group.png" // or use the uploaded image path if dynamic
            alt="Building"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default Contact;
