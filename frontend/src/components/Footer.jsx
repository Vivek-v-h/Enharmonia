import React from "react";
import { Link } from "react-scroll";

const Footer = () => {
  return (
    <div>
      <footer className="mt-10 bg-gray-100 p-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="font-bold text-lg mb-2">ENHARMONIA PROPERTIES</div>
            <p className="text-sm text-gray-600 max-w-xs">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
              reprehenderit incidunt, eius?
            </p>
            <div className="flex gap-4 mt-4 text-gray-600">
              <a href="#">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#">
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Our Company</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Agents</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Media</a>
              </li>
              <li>
                <Link
                  to="contactus"
                  smooth={true}
                  duration={500}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold  mb-2">Subscribe</h3>
            <input
              type="email"
              placeholder="Enter Email"
              className="px-3 py-2 border rounded w-full"
            />
            <button className="bg-green-700 cursor-pointer text-white px-4 py-2 rounded mt-2 hover:bg-green-800">
              Subscribe
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-6">
          © 2025 All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Footer;
