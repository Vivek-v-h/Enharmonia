
import "./App.css";

import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Services from "./components/Services";

function App() {
  
  return (
    <>
      <div className="font-sans text-gray-800">
        {/* Header */}

        <Navbar/>

        {/* Hero Section */}
        <Hero/>

        {/* Countries Section */}
        <section className="p-6 md:px-12 text-center">
          <h2 className="text-xl font-semibold mb-4">
            We are available in many well-known countries
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["america", "spain", "london", "france"].map((place) => (
              <div key={place} className="rounded-lg overflow-hidden shadow">
                <img
                  src={`https://source.unsplash.com/200x200/?${place}`}
                  alt={place}
                  className="w-full h-32 object-cover"
                />
                <div className="py-2 font-medium uppercase">{place}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <Services/>

        {/* Call to Action */}
        <section className="p-6 md:px-12 flex flex-col md:flex-row items-center bg-blue-50 mt-10 rounded-xl">
          <div className="flex-1 space-y-3">
            <h2 className="text-2xl font-semibold">
              Find your best Real Estate
            </h2>
            <p>
              We provide a complete service for the sale, purchase or rental of
              real estate.
            </p>
            <button className="bg-green-700 text-white px-6 py-2 rounded-lg mt-2 hover:bg-green-800">
              Contact Us
            </button>
          </div>
          <img
            src="https://i.ibb.co/wYsn7LF/building-realestate.jpg"
            alt="Building"
            className="w-full md:w-1/3 rounded-lg mt-6 md:mt-0"
          />
        </section>

        {/* Footer */}
        <footer className="mt-10 bg-gray-100 p-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <div className="font-bold text-lg mb-2">
                ENHARMONIA PROPERTIES
              </div>
              <p className="text-sm text-gray-600 max-w-xs">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Sapiente reprehenderit incidunt, eius?
              </p>
              <div className="flex gap-4 mt-4 text-gray-600">
                <a href="#">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#">
                  <i className="fab fa-twitter"></i>
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
                  <a href="#">Contact Us</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Subscribe</h3>
              <input
                type="email"
                placeholder="Enter Email"
                className="px-3 py-2 border rounded w-full"
              />
              <button className="bg-green-700 text-white px-4 py-2 rounded mt-2 hover:bg-green-800">
                Subscribe
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-6">
            © 2025 All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
