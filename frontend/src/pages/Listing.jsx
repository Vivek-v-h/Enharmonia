import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaTrain,
  FaBus,
  FaCar,
  FaSubway,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaEnvelope,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaCalendarAlt,
  FaWifi,
  FaTv,
  FaUtensils,
  FaParking,
  FaSnowflake,
  FaUserGraduate,
  FaUserTie,
  FaUsers,
  FaLeaf,
  FaSmokingBan,
  FaPaw,
  FaWheelchair,
  FaHome,
  FaDoorOpen,
  FaChair
} from "react-icons/fa";
import { GiFamilyHouse } from "react-icons/gi";
import { MdNoDrinks } from "react-icons/md";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";

const Listing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState("/default-avatar.png");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const API_BASE = "http://localhost:3000";

  // Custom image slider functions
  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev === listing.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? listing.photos.length - 1 : prev - 1
    );
  };

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

  const fetchListing = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/ad/${id}`);
      setListing(res.data.ad);
      setWishlisted(res.data.ad.wishlistedBy?.includes(user?._id));
      setWishlistCount(res.data.ad.wishlistCount || 0);
    } catch (err) {
      console.error("Error fetching listing", err);
      setError("Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add to wishlist");
        navigate('/login');
        return;
      }

      if (wishlisted) {
        await axios.delete(`http://localhost:3000/api/ads/${id}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlisted(false);
        setWishlistCount(prev => prev - 1);
      } else {
        await axios.post(`http://localhost:3000/api/ads/${id}/wishlist`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlisted(true);
        setWishlistCount(prev => prev + 1);
      }
    } catch (err) {
      console.error("Error updating wishlist", err);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#d9e9f2] to-[#f0f9fa]">
        <div className="text-xl text-gray-700">Loading listing...</div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#d9e9f2] to-[#f0f9fa]">
        <div className="text-xl text-gray-700">{error || "Listing not found"}</div>
      </div>
    );
  }

  // Icons mapping for amenities and preferences
  const amenityIcons = {
    wifi: <FaWifi className="text-blue-500" />,
    tv: <FaTv className="text-blue-500" />,
    kitchen: <FaUtensils className="text-blue-500" />,
    parking: <FaParking className="text-blue-500" />,
    air_conditioning: <FaSnowflake className="text-blue-500" />,
    furnished: <FaChair className="text-blue-500" />,
    ensuite: <FaDoorOpen className="text-blue-500" />,
    double_room: <FaBed className="text-blue-500" />
  };

  const tenantIcons = {
    student: <FaUserGraduate className="text-green-500" />,
    professional: <FaUserTie className="text-green-500" />,
    family: <GiFamilyHouse className="text-green-500" />,
    couple: <FaUsers className="text-green-500" />
  };

  const householdIcons = {
    vegetarian: <FaLeaf className="text-purple-500" />,
    no_alcohol: <MdNoDrinks className="text-purple-500" />,
    no_parking: <FaParking className="text-purple-500" />,
    non_smoker: <FaSmokingBan className="text-purple-500" />,
    no_pets: <FaPaw className="text-purple-500" />,
    disabled_friendly: <FaWheelchair className="text-purple-500" />
  };

  return (
    <div className="bg-gradient-to-br from-[#d9e9f2] to-[#f0f9fa] min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-gray-700 hover:text-gray-900 transition"
          whileHover={{ x: -5 }}
          transition={{ duration: 0.2 }}
        >
          <FaArrowLeft />
          Back to Listings
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Custom Image Slider */}
          <div className="relative h-96 w-full bg-gray-200 overflow-hidden">
            {listing.photos && listing.photos.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={listing.photos[currentImageIndex]}
                    alt={`Property ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
                
                {/* Navigation arrows */}
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                >
                  &lt;
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                >
                  &gt;
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {listing.photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No images available
              </div>
            )}
          </div>

          {/* Main Content with Gradient Background */}
          <div className="bg-gradient-to-br from-[#f8fafc] to-[#f0f7ff] p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column */}
              <div className="md:w-2/3">
                <div className="flex justify-between items-start">
                  <motion.h1 
                    className="text-3xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {listing.headline}
                  </motion.h1>
                </div>

                <motion.div
                  className="flex items-center gap-2 text-gray-600 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <FaMapMarkerAlt />
                  <span>{listing.location}</span>
                </motion.div>

                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">Description</h2>
                  <p className="text-gray-700">{listing.description}</p>
                </motion.div>

                {/* Property Details */}
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="bg-white bg-opacity-70 p-4 rounded-lg text-center shadow-sm">
                    <FaBed className="mx-auto text-2xl text-indigo-600 mb-2" />
                    <p className="font-medium">Property Type</p>
                    <p className="text-gray-600 capitalize">
                      {listing.propertyType?.split('_').join(' ') || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="bg-white bg-opacity-70 p-4 rounded-lg text-center shadow-sm">
                    <FaCalendarAlt className="mx-auto text-2xl text-indigo-600 mb-2" />
                    <p className="font-medium">Stay Length</p>
                    <p className="text-gray-600">
                      {listing.stayLength?.min || 1}-{listing.stayLength?.max || 12} months
                    </p>
                  </div>
                  
                  <div className="bg-white bg-opacity-70 p-4 rounded-lg text-center shadow-sm">
                    <FaRulerCombined className="mx-auto text-2xl text-indigo-600 mb-2" />
                    <p className="font-medium">Distance</p>
                    <p className="text-gray-600">
                      {listing.distanceFrom?.tube || listing.distanceFrom?.bus || listing.distanceFrom?.railway || listing.distanceFrom?.metro || 'N/A'} mi
                    </p>
                  </div>
                  
                  <div className="bg-white bg-opacity-70 p-4 rounded-lg text-center shadow-sm">
                    <div className="text-2xl text-indigo-600 mb-2 font-bold">
                      £{listing.price}
                    </div>
                    <p className="font-medium">Monthly Rent</p>
                  </div>
                </motion.div>

                {/* Transportation */}
                {listing.distanceFrom && (
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Transportation</h2>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { icon: <FaSubway className="text-blue-500" />, value: listing.distanceFrom?.tube, label: "Tube" },
                        { icon: <FaBus className="text-blue-500" />, value: listing.distanceFrom?.bus, label: "Bus" },
                        { icon: <FaTrain className="text-blue-500" />, value: listing.distanceFrom?.railway, label: "Railway" },
                        { icon: <FaCar className="text-blue-500" />, value: listing.distanceFrom?.metro, label: "Metro" },
                      ].map(
                        (item, i) =>
                          item.value > 0 && (
                            <motion.div
                              key={i}
                              className="flex items-center gap-2 bg-white bg-opacity-70 px-4 py-2 rounded-full shadow-sm"
                              whileHover={{ scale: 1.05 }}
                            >
                              {item.icon}
                              <span>{item.label}: {item.value}mi</span>
                            </motion.div>
                          )
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Amenities */}
                {listing.amenities && listing.amenities.length > 0 && (
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Amenities</h2>
                    <div className="flex flex-wrap gap-4">
                      {listing.amenities.map((amenity, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-2 bg-white bg-opacity-70 px-4 py-2 rounded-full shadow-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          {amenityIcons[amenity] || <FaHome className="text-blue-500" />}
                          <span className="text-indigo-800">
                            {amenity.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Tenant Preferences */}
                {listing.tenantPreferred && listing.tenantPreferred.length > 0 && (
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Tenant Preferences</h2>
                    <div className="flex flex-wrap gap-4">
                      {listing.tenantPreferred.map((pref, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-2 bg-white bg-opacity-70 px-4 py-2 rounded-full shadow-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          {tenantIcons[pref] || <FaUsers className="text-green-500" />}
                          <span className="text-green-800">
                            {pref.charAt(0).toUpperCase() + pref.slice(1)}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Household Preferences */}
                {listing.householdPreferences && listing.householdPreferences.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Household Preferences</h2>
                    <div className="flex flex-wrap gap-4">
                      {listing.householdPreferences.map((pref, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-2 bg-white bg-opacity-70 px-4 py-2 rounded-full shadow-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          {householdIcons[pref] || <FaHome className="text-purple-500" />}
                          <span className="text-purple-800">
                            {pref.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right Column - Contact & Owner Info */}
              <div className="md:w-1/3">
                <motion.div
                  className="bg-white rounded-xl p-6 shadow-md sticky top-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Contact Owner</h3>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden">
                      {listing.userId?.avatar ? (
                        <img 
                          src={avatarUrl} 
                          alt={listing.userId?.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <span className="text-2xl">{listing.userId?.name?.charAt(0) || 'U'}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{listing.userId?.name || 'Unknown'}</h4>
                      <p className="text-gray-600 text-sm">Property Owner</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <motion.button 
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaEnvelope />
                      Send Message
                    </motion.button>

                    <motion.button
                      onClick={toggleWishlist}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition ${
                        wishlisted 
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                          : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-600 hover:from-red-200 hover:to-pink-200'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <AnimatePresence mode="wait">
                        {wishlisted ? (
                          <motion.span
                            key="wishlisted"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-2"
                          >
                            <FaHeart className="fill-current" />
                            <span>Wishlisted</span>
                          </motion.span>
                        ) : (
                          <motion.span
                            key="not-wishlisted"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-2"
                          >
                            <FaHeart />
                            <span>Add to Wishlist </span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold mb-2 text-gray-900">Listing Type</h4>
                    <p className="text-gray-700 capitalize">
                      {listing.listingType?.split('_').join(' ') || 'N/A'}
                    </p>
                    
                    <h4 className="font-semibold mt-4 mb-2 text-gray-900">Verification Status</h4>
                    <p className="text-gray-700 capitalize">{listing.status}</p>
                    
                    <h4 className="font-semibold mt-4 mb-2 text-gray-900">Posted</h4>
                    <p className="text-gray-700">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Listing;