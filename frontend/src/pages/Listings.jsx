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
  const [activeTab, setActiveTab] = useState("rooms_wanted");
  const [locationQuery, setLocationQuery] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(window.innerWidth >= 1024);
  const [sortBy, setSortBy] = useState("");
  const [wishlist, setWishlist] = useState([]);

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
      const params = {
        location: locationQuery,
        ...filters,
        listingType: activeTab,
        sortBy
      };
      
      if (coords) {
        params.coords = coords;
      }
      
      const res = await axios.get("http://localhost:3000/api/ad/getall", { params });
      setListings(res.data.ads);
    } catch (err) {
      console.error("Error fetching listings", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/ad/getall");
      setListings(res.data.ads);
    } catch (err) {
      console.error("Error fetching all listings", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await axios.get("http://localhost:3000/api/ads/wishlist/mine", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlist(res.data.map(item => item._id));
      }
    } catch (err) {
      console.error("Error fetching wishlist", err);
    }
  };

  const handleCheckbox = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
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
          alert("Unable to retrieve your location");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const toggleWishlist = async (listingId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add to wishlist");
        return;
      }

      if (wishlist.includes(listingId)) {
        await axios.delete(`http://localhost:3000/api/ads/${listingId}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlist(wishlist.filter(id => id !== listingId));
      } else {
        await axios.post(`http://localhost:3000/api/ads/${listingId}/wishlist`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlist([...wishlist, listingId]);
      }
    } catch (err) {
      console.error("Error updating wishlist", err);
    }
  };

  useEffect(() => {
    fetchAllListings();
    fetchWishlist();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationQuery) {
        fetchListings();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [locationQuery]);

  useEffect(() => {
    fetchListings();
  }, [activeTab, sortBy, filters]);

  useEffect(() => {
    const handleResize = () => {
      setShowFilters(window.innerWidth >= 1024);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { label: "Rooms Wanted", value: "rooms_wanted" },
    { label: "Whole Building", value: "whole_building" },
    { label: "Rooms to Rent", value: "rooms_to_rent" },
    { label: "Serviced Accommodation", value: "serviced_accommodation" },
  ];

  const propertyTypes = ["rooms", "studio_flat", "house", "other"];
  const amenities = ["furnished", "unfurnished", "double_room", "single_room", "ensuite"];
  const tenantTypes = ["student", "professional", "family", "other"];
  const householdPrefs = ["vegetarian", "non_smoker", "no_alcohol", "no_pets", "no_parking", "disabled_friendly"];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-[#d9e9f2] to-[#f0f9fa] min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-900">
        Browse Listings
      </h1>

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
        <div className="flex items-center border border-gray-300 bg-white rounded-xl shadow-md px-4 py-2 w-full sm:w-[300px] md:w-[400px]">
          <FaSearch className="mr-2 text-gray-500" />
          <input
            type="text"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Search by location"
            className="w-full outline-none text-gray-800 placeholder-gray-500 bg-transparent"
          />
        </div>

        <button
          onClick={() => fetchListings()}
          className="bg-gray-900 text-white px-5 py-2 rounded-xl shadow hover:bg-gray-800 transition-all"
        >
          <FaSearch className="inline mr-2" />
          Search
        </button>

        <button
          onClick={handleGeolocationSearch}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 transition-all flex items-center"
        >
          <FaMapMarkerAlt className="mr-2" />
          Use My Location
        </button>
      </div>

      {/* Sort + Mobile Filter Toggle */}
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
          onClick={() => setShowFilters(!showFilters)}
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
              className="w-full lg:w-[18%] space-y-6 bg-white p-4 rounded-xl shadow"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Rent Range */}
              <div>
                <h2 className="font-semibold mb-2">Rent Range (£)</h2>
                <div className="flex space-x-4 mb-4">
                  <input
                    type="number"
                    value={filters.rentMin}
                    onChange={(e) =>
                      setFilters(f => ({
                        ...f,
                        rentMin: Math.min(+e.target.value, f.rentMax),
                      }))
                    }
                    className="w-full border rounded p-2"
                    placeholder="Min"
                    min="0"
                  />
                  <input
                    type="number"
                    value={filters.rentMax}
                    onChange={(e) =>
                      setFilters(f => ({
                        ...f,
                        rentMax: Math.max(+e.target.value, f.rentMin),
                      }))
                    }
                    className="w-full border rounded p-2"
                    placeholder="Max"
                    min="0"
                  />
                </div>
              </div>

              {/* Length of Stay */}
              <div>
                <h2 className="font-semibold mb-2">Length of Stay (months)</h2>
                <div className="flex space-x-4 mb-4">
                  <input
                    type="number"
                    value={filters.stayMin}
                    onChange={(e) =>
                      setFilters(f => ({
                        ...f,
                        stayMin: Math.min(+e.target.value, f.stayMax),
                      }))
                    }
                    className="w-full border rounded p-2"
                    placeholder="Min"
                    min="1"
                  />
                  <input
                    type="number"
                    value={filters.stayMax}
                    onChange={(e) =>
                      setFilters(f => ({
                        ...f,
                        stayMax: Math.max(+e.target.value, f.stayMin),
                      }))
                    }
                    className="w-full border rounded p-2"
                    placeholder="Max"
                    min="1"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <h2 className="font-semibold mb-2">Property Type</h2>
                {propertyTypes.map(type => (
                  <label key={type} className="block mb-2">
                    <input
                      type="checkbox"
                      checked={filters.propertyTypes.includes(type)}
                      onChange={() => handleCheckbox("propertyTypes", type)}
                      className="mr-2"
                    />
                    {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                ))}
              </div>

              {/* Amenities */}
              <div>
                <h2 className="font-semibold mb-2">Amenities</h2>
                {amenities.map(amenity => (
                  <label key={amenity} className="block mb-2">
                    <input
                      type="checkbox"
                      checked={filters.roomAmenities.includes(amenity)}
                      onChange={() => handleCheckbox("roomAmenities", amenity)}
                      className="mr-2"
                    />
                    {amenity.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                ))}
              </div>

              {/* Tenant Preferred */}
              <div>
                <h2 className="font-semibold mb-2">Tenant Preferred</h2>
                {tenantTypes.map(type => (
                  <label key={type} className="block mb-2">
                    <input
                      type="checkbox"
                      checked={filters.tenantTypes.includes(type)}
                      onChange={() => handleCheckbox("tenantTypes", type)}
                      className="mr-2"
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                ))}
              </div>

              {/* Household Preferences */}
              <div>
                <h2 className="font-semibold mb-2">Household Preferences</h2>
                {householdPrefs.map(pref => (
                  <label key={pref} className="block mb-2">
                    <input
                      type="checkbox"
                      checked={filters.householdPrefs.includes(pref)}
                      onChange={() => handleCheckbox("householdPrefs", pref)}
                      className="mr-2"
                    />
                    {pref.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Listings */}
        <div className="w-full lg:w-[82%] space-y-6">
          {loading ? (
            <div className="text-center text-gray-600 py-10">Loading listings...</div>
          ) : listings.length === 0 ? (
            <div className="text-center text-gray-600 py-10">No listings found.</div>
          ) : (
            listings.map((listing) => (
              <motion.div
                key={listing._id}
                className="border rounded-2xl p-4 shadow-2xl bg-white space-y-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full h-56 bg-gray-200 rounded-xl mb-2 flex items-center justify-center overflow-hidden">
                  <ImageSlider images={listing.photos || []} />
                </div>

                <h3 className="text-xl font-semibold text-gray-900">
                  {listing.headline}
                </h3>
                <p className="text-gray-700">{listing.description}</p>
                <p className="text-lg font-bold text-indigo-700">
                  £{listing.price}/month
                </p>

                <div className="flex space-x-4 text-gray-600">
                  {[
                    { icon: <FaSubway />, value: listing.distanceFrom?.tube, label: "tube" },
                    { icon: <FaBus />, value: listing.distanceFrom?.bus, label: "bus" },
                    { icon: <FaTrain />, value: listing.distanceFrom?.railway, label: "train" },
                    { icon: <FaCar />, value: listing.distanceFrom?.metro, label: "car" },
                  ].map(
                    (item, i) =>
                      item.value > 0 && (
                        <div
                          key={i}
                          className="relative group flex items-center space-x-1"
                        >
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
                  {listing.amenities?.map((amenity, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-800 shadow"
                    >
                      {amenity.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => toggleWishlist(listing._id)}
                  className={`mt-2 flex items-center gap-2 ${
                    wishlist.includes(listing._id) 
                      ? "text-red-500 hover:text-red-700" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FaHeart /> 
                  {wishlist.includes(listing._id) ? "In Wishlist" : "Add to Wishlist"}
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;