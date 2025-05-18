// All imports remain the same
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaSearch,
  FaHeart,
  FaTrain,
  FaBus,
  FaCar,
  FaSubway,
  FaMapMarkerAlt,
  FaFilter,
} from "react-icons/fa";
import ImageSlider from "../components/ImageSlider";

const Listings = () => {
  const [activeTab, setActiveTab] = useState("tenant");
  const [locationQuery, setLocationQuery] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(() => window.innerWidth >= 1024);
  const [sortBy, setSortBy] = useState("");

  const [filters, setFilters] = useState({
    rentMin: 0,
    rentMax: 5000,
    stayMin: 1,
    stayMax: 24,
    propertyTypes: [],
    roomAmenities: [],
    tenantTypes: [],
    householdPrefs: [],
  });

  const fetchListings = async (coords = null) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/listings/search", {
        location: locationQuery,
        coords,
        filters,
        tab: activeTab,
        sortBy,
      });
      setListings(res.data);
    } catch (err) {
      console.error("Error fetching listings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckbox = (category, value) => {
    setFilters((prev) => {
      const current = new Set(prev[category]);
      current.has(value) ? current.delete(value) : current.add(value);
      return { ...prev, [category]: [...current] };
    });
  };

  const handleGeolocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          fetchListings(coords);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    fetchListings();
  }, [activeTab, sortBy]);

  useEffect(() => {
    const handleResize = () => {
      setShowFilters(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { label: "Tenant", value: "tenant" },
    { label: "Full House", value: "fullhouse" },
    { label: "Serviced Accommodation", value: "serviced" },
    { label: "Rooms to Rent", value: "rooms" },
  ];

  return (
    <motion.div
      className="p-6 space-y-6 bg-gradient-to-br from-[#d9e9f2] to-[#f0f9fa] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-center text-gray-900">Browse Listings</h1>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 sm:justify-center flex-nowrap">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`whitespace-nowrap px-4 py-2 rounded-full shadow transition-all ${
              activeTab === tab.value
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar + Sort + Location */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
        <motion.div
          className="flex items-center border border-gray-300 bg-white rounded-xl shadow-md px-4 py-2 w-full sm:w-[300px] md:w-[400px]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <FaSearch className="mr-2 text-gray-500" />
          <input
            type="text"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Search by location"
            className="w-full outline-none text-gray-800 placeholder-gray-500 bg-transparent"
          />
        </motion.div>

        <motion.button
          onClick={() => fetchListings()}
          className="bg-gray-900 text-white px-5 py-2 rounded-xl shadow hover:bg-gray-800 transition-all"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <FaSearch className="inline mr-2" />
          Search
        </motion.button>

        <motion.button
          onClick={handleGeolocationSearch}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 transition-all flex items-center"
          whileHover={{ scale: 1.03 }}
        >
          <FaMapMarkerAlt className="mr-2" />
          Use My Location
        </motion.button>
      </div>

      {/* Sort + Mobile Filter Toggle in one row on small screens */}
      <div className="flex flex-wrap justify-center items-center gap-4 lg:hidden mt-2">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 bg-white px-4 py-2 rounded-xl shadow text-gray-800"
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="stay-asc">Stay: Low to High</option>
          <option value="stay-desc">Stay: High to Low</option>
        </select>

        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-full shadow hover:bg-gray-400 transition"
        >
          <FaFilter />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters + Listings Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              key="filters"
              className="w-full lg:w-[18%] space-y-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filter sections unchanged */}
              <div>
                <h2 className="font-semibold mb-2">Rent Range</h2>
                <input type="number" value={filters.rentMin} onChange={(e) => setFilters(f => ({ ...f, rentMin: +e.target.value }))} placeholder="Min" className="w-full mb-2 border rounded p-2" />
                <input type="number" value={filters.rentMax} onChange={(e) => setFilters(f => ({ ...f, rentMax: +e.target.value }))} placeholder="Max" className="w-full border rounded p-2" />
                <input type="range" min="0" max="5000" step="100" value={filters.rentMax} onChange={(e) => setFilters(f => ({ ...f, rentMax: +e.target.value }))} className="w-full mt-2" />
              </div>

              <div>
                <h2 className="font-semibold mb-2">Length of Stay</h2>
                <input type="number" value={filters.stayMin} onChange={(e) => setFilters(f => ({ ...f, stayMin: +e.target.value }))} placeholder="Min (months)" className="w-full mb-2 border rounded p-2" />
                <input type="number" value={filters.stayMax} onChange={(e) => setFilters(f => ({ ...f, stayMax: +e.target.value }))} placeholder="Max (months)" className="w-full border rounded p-2" />
                <input type="range" min="1" max="24" step="1" value={filters.stayMax} onChange={(e) => setFilters(f => ({ ...f, stayMax: +e.target.value }))} className="w-full mt-2" />
              </div>

              <div>
                <h2 className="font-semibold mb-2">Property Type</h2>
                {["Room", "Studio/Flat", "House"].map(type => (
                  <label key={type} className="block">
                    <input type="checkbox" onChange={() => handleCheckbox("propertyTypes", type)} className="mr-2" />
                    {type}
                  </label>
                ))}
              </div>

              <div>
                <h2 className="font-semibold mb-2">Room Amenities</h2>
                {["Furnished", "Unfurnished", "DoubleRoom", "SingleRoom", "Ensuite"].map(a => (
                  <label key={a} className="block">
                    <input type="checkbox" onChange={() => handleCheckbox("roomAmenities", a)} className="mr-2" />
                    {a}
                  </label>
                ))}
              </div>

              <div>
                <h2 className="font-semibold mb-2">Tenant Preferred</h2>
                {["Students", "Professionals", "Family", "Other"].map(t => (
                  <label key={t} className="block">
                    <input type="checkbox" onChange={() => handleCheckbox("tenantTypes", t)} className="mr-2" />
                    {t}
                  </label>
                ))}
              </div>

              <div>
                <h2 className="font-semibold mb-2">Household Preferences</h2>
                {["Vegetarian", "Smoking", "Alcohol", "Pets", "Parking", "Disabled friendly"].map(p => (
                  <label key={p} className="block">
                    <input type="checkbox" onChange={() => handleCheckbox("householdPrefs", p)} className="mr-2" />
                    {p}
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Listings */}
        <div className="w-full lg:w-[82%] space-y-6">
          {loading ? (
            <div className="text-center text-gray-600">Loading listings...</div>
          ) : listings.length === 0 ? (
            <div className="text-center text-gray-600">No listings found.</div>
          ) : (
            listings.map((listing, index) => (
              <motion.div
                key={listing.id || index}
                className="border rounded-2xl p-4 shadow-2xl bg-white space-y-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full h-56 bg-gray-200 rounded-xl mb-2 flex items-center justify-center overflow-hidden">
                  <ImageSlider images={listing.images} />
                </div>

                <h3 className="text-xl font-semibold text-gray-900">{listing.title}</h3>
                <p className="text-gray-700">{listing.description}</p>

                <div className="flex space-x-4 text-gray-600">
                  {[{ icon: <FaSubway />, value: listing.distances?.tube, label: "tube" },
                    { icon: <FaBus />, value: listing.distances?.bus, label: "bus" },
                    { icon: <FaTrain />, value: listing.distances?.train, label: "train" },
                    { icon: <FaCar />, value: listing.distances?.car, label: "car" }].map((item, i) =>
                    item.value && (
                      <div key={i} className="relative group flex items-center space-x-1">
                        {item.icon}
                        <span>{item.value}mi</span>
                        <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs p-1 rounded shadow">
                          Distance from {item.label} is {item.value} miles
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {listing.preferences?.map((pref, i) => (
                    <div key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-800 shadow">
                      {pref}
                    </div>
                  ))}
                </div>

                <button className="mt-2 flex items-center gap-2 text-red-500 hover:text-red-700">
                  <FaHeart /> Add to Wishlist
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Listings;
