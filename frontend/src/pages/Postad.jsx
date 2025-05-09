import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UploadCloud, ChevronUp, ChevronDown } from "lucide-react";
import axios from "axios";
import {
  FaBus,
  FaSubway,
  FaTrain,
  FaMapMarkerAlt,
  FaHome,
  FaBuilding,
  FaBed,
  FaCouch,
  FaUserGraduate,
  FaBriefcase,
  FaUsers,
  FaLeaf,
  FaSmoking,
  FaBan,
  FaPaw,
  FaParking,
  FaWheelchair,
  FaChair,
  FaUser,
  FaBath,
} from "react-icons/fa";
import Alert from "../components/PostingSuccess";
const API_BASE = "http://localhost:3000";

const PostAd = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    listingType: "",
    headline: "",
    description: "",
    location: "",
    coordinates: null,
    price: "",
    distanceFrom: {
      tube: "",
      bus: "",
      railway: "",
      metro: ""
    },
    stayLength: {
      min: "",
      max: ""
    },
    propertyType: "",
    amenities: [],
    tenantPreferred: [],
    householdPreferences: [],
    tenantOther: "",
    photos: []
  });

  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [locationError, setLocationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login-signup");
          return;
        }

        const response = await axios.get(`${API_BASE}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsAuthenticated(true);
        setUserId(response.data._id);
        setLoadingAuth(false);
      } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem("token");
        navigate("/login-signup");
      }
    };

    checkAuth();
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle nested input changes (like distanceFrom)
  const handleNestedInputChange = (parent, key, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value
      }
    }));
  };

  // Handle increment/decrement for float values
  const handleFloatChange = (field, value, delta = 0.1) => {
    const currentValue = parseFloat(value) || 0;
    const newValue = Math.max(0, currentValue + delta).toFixed(1);
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  // Handle distance increment/decrement
  const handleDistanceChange = (transportType, delta = 0.1) => {
    const currentValue = parseFloat(formData.distanceFrom[transportType]) || 0;
    const newValue = Math.max(0, currentValue + delta).toFixed(1);
    handleNestedInputChange("distanceFrom", transportType, newValue);
  };

  // Handle checkbox changes
  const handleCheckboxChange = (field, value, isChecked) => {
    setFormData(prev => {
      const currentValues = [...prev[field]];
      if (isChecked) {
        return {
          ...prev,
          [field]: [...currentValues, value]
        };
      } else {
        return {
          ...prev,
          [field]: currentValues.filter(item => item !== value)
        };
      }
    });
  };

  // Handle photo uploads
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const previews = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
    
    setPhotoPreviews(prev => [...prev, ...previews]);
  };

  // Remove a photo
  const removePhoto = (index) => {
    const newPreviews = [...photoPreviews];
    newPreviews.splice(index, 1);
    setPhotoPreviews(newPreviews);
    
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    setFormData(prev => ({ ...prev, photos: newPhotos }));
  };

  // Get current location
  const fetchCurrentLocation = () => {
    setLocationError("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setFormData(prev => ({
            ...prev,
            coordinates: coords,
            location: "Current Location"
          }));
        },
        (error) => {
          setLocationError("Unable to retrieve your location. Please enter manually.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };
    
  
  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate mandatory fields
    if (formData.photos.length === 0) {
      alert("Please upload at least one photo");
      return;
    }
    
    if (!formData.listingType || !formData.headline || !formData.description || 
        !formData.location || !formData.price || !formData.propertyType) {
      alert("Please fill all mandatory fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      
      // Prepare the form data for submission
      const formDataToSend = new FormData();
      
      // Append all form data
      formDataToSend.append('userId', userId);
      formDataToSend.append('listingType', formData.listingType);
      formDataToSend.append('headline', formData.headline);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', formData.location);
      if (formData.coordinates) {
        formDataToSend.append('coordinates', JSON.stringify(formData.coordinates));
      }
      formDataToSend.append('price', formData.price);
      formDataToSend.append('distanceFrom', JSON.stringify(formData.distanceFrom));
      formDataToSend.append('stayLength', JSON.stringify(formData.stayLength));
      formDataToSend.append('propertyType', formData.propertyType);
      formDataToSend.append('amenities', JSON.stringify(formData.amenities));
      formDataToSend.append('tenantPreferred', JSON.stringify(formData.tenantPreferred));
      formDataToSend.append('householdPreferences', JSON.stringify(formData.householdPreferences));
      formDataToSend.append('tenantOther', formData.tenantOther);
      
      // Append photos
      formData.photos.forEach(photo => {
        formDataToSend.append('photos', photo);
      });
      
      // Log the form data before sending
      console.log("Submitting form data:", {
        userId,
        ...formData,
        photos: formData.photos.map(file => file.name)
      });
      
      // Uncomment this for actual API call
      // const response = await axios.post(`${API_BASE}/api/ads`, formDataToSend, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
      
      // console.log("Ad created successfully:", response.data);
      
      setSubmitSuccess(true);
      
      // Show success popup
      setShowAlert(true)
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit ad. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: i * 0.1, 
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      },
    }),
  };

  const scaleUp = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto p-6 mt-8 bg-white rounded-3xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.h1
        className="text-3xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Post an Ad
      </motion.h1>

      <AnimatePresence>
        {submitSuccess && (
          <motion.div 
            className="mb-6 p-4 bg-green-100 text-green-800 rounded-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Your ad has been submitted successfully! Redirecting to home page...
          </motion.div>
        )}
      </AnimatePresence>

      <form className="space-y-6" onSubmit={handleFormSubmit}>
        {/* Property Category */}
        <motion.div
          variants={fadeIn}
          custom={0}
          initial="hidden"
          animate="visible"
        >
          <p className="font-medium mb-2">Listing Type <span className="text-red-500">*</span></p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Rooms Wanted", value: "rooms_wanted", icon: <FaUser /> },
              { label: "Whole Building", value: "whole_building", icon: <FaBuilding /> },
              { label: "Rooms to Rent", value: "rooms_to_rent", icon: <FaBed /> },
              { label: "Serviced Accommodation", value: "serviced_accommodation", icon: <FaHome /> },
            ].map(({ label, value, icon }, i) => (
              <motion.label 
                key={i} 
                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="radio"
                  name="listingType"
                  value={value}
                  checked={formData.listingType === value}
                  onChange={() => setFormData(prev => ({ ...prev, listingType: value }))}
                  required
                  className="accent-blue-600"
                />
                <span className="flex items-center gap-2">
                  {icon} {label}
                </span>
              </motion.label>
            ))}
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          variants={fadeIn}
          custom={1}
          initial="hidden"
          animate="visible"
        >
          <label className="block font-medium mb-1">Headline <span className="text-red-500">*</span></label>
          <motion.div whileHover={{ scale: 1.01 }}>
            <input
              required
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="E.g., Cozy room in central London"
            />
          </motion.div>
        </motion.div>

        {/* Photos */}
        <motion.div
          variants={fadeIn}
          custom={2}
          initial="hidden"
          animate="visible"
        >
          <h3 className="text-lg font-semibold mb-2 text-[#29659e]">
            Upload Photos <span className="text-red-500">*</span>
          </h3>
          <motion.label 
            className="flex items-center gap-2 cursor-pointer text-[#29659e] hover:underline p-2 rounded-lg border border-dashed border-gray-300 justify-center"
            whileHover={{ scale: 1.01, backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
            whileTap={{ scale: 0.99 }}
          >
            <UploadCloud size={20} />
            <span>Select photos</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
              required={photoPreviews.length === 0}
            />
          </motion.label>

          {photoPreviews.length === 0 && (
            <motion.p 
              className="text-red-500 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              At least one photo is required
            </motion.p>
          )}

          <motion.div 
            className="flex flex-wrap gap-4 mt-4"
            variants={scaleUp}
          >
            {photoPreviews.map((src, idx) => (
              <motion.div
                key={idx}
                className="relative group"
                whileHover={{ scale: 1.03 }}
                layout
              >
                <motion.img
                  src={src}
                  alt={`Preview ${idx}`}
                  className="h-24 w-24 object-cover rounded-xl shadow"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
                />
                <motion.button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => removePhoto(idx)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.div
          variants={fadeIn}
          custom={3}
          initial="hidden"
          animate="visible"
        >
          <label className="block font-medium mb-1">Description <span className="text-red-500">*</span></label>
          <motion.div whileHover={{ scale: 1.01 }}>
            <textarea
              required
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your property in detail..."
            />
          </motion.div>
        </motion.div>

        {/* Location */}
        <motion.div
          variants={fadeIn}
          custom={4}
          initial="hidden"
          animate="visible"
        >
          <label className="block font-medium mb-1 flex items-center gap-2">
            <FaMapMarkerAlt /> Location <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={fetchCurrentLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaMapMarkerAlt /> Use My Location
            </motion.button>
            <motion.div whileHover={{ scale: 1.01 }} className="flex-1">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Search location"
                required
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </motion.div>
          </div>
          {locationError && (
            <motion.p 
              className="text-red-500 text-sm mt-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {locationError}
            </motion.p>
          )}
          {formData.coordinates && (
            <motion.p 
              className="text-sm text-gray-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Coordinates: {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
            </motion.p>
          )}
        </motion.div>

        {/* Price */}
        <motion.div
          variants={fadeIn}
          custom={5}
          initial="hidden"
          animate="visible"
        >
          <label className="block font-medium mb-1">Price (in £) <span className="text-red-500">*</span></label>
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.01 }}>
            <div className="relative flex-1">
              <input
                required
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                placeholder="0.0"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
            </div>
            
          </motion.div>
        </motion.div>

        {/* Distance From */}
        <motion.div
          variants={fadeIn}
          custom={6}
          initial="hidden"
          animate="visible"
        >
          <p className="font-medium mb-1">Distance from (miles)</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <FaSubway />, label: "Tube", key: "tube" },
              { icon: <FaBus />, label: "Bus", key: "bus" },
              { icon: <FaTrain />, label: "Railway", key: "railway" },
              { icon: <FaMapMarkerAlt />, label: "Metro", key: "metro" },
            ].map(({ icon, label, key }, i) => (
              <motion.div 
                key={i} 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.01 }}
              >
                <span className="text-gray-600">{icon}</span>
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder={`${label} Station`}
                    value={formData.distanceFrom[key]}
                    onChange={(e) => handleNestedInputChange("distanceFrom", key, e.target.value)}
                    step="0.1"
                    min="0"
                    className="w-full border p-2 rounded-xl pl-8"
                  />
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">mi</span>
                </div>
                
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Length of Stay */}
        <motion.div
          variants={fadeIn}
          custom={7}
          initial="hidden"
          animate="visible"
        >
          <p className="font-medium mb-1">Length of Stay (months)</p>
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.01 }} className="flex-1">
              <input
                type="number"
                min={1}
                placeholder="Min"
                value={formData.stayLength.min}
                onChange={(e) => handleNestedInputChange("stayLength", "min", e.target.value)}
                className="w-full border p-2 rounded-xl"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.01 }} className="flex-1">
              <input
                type="number"
                min={1}
                placeholder="Max"
                value={formData.stayLength.max}
                onChange={(e) => handleNestedInputChange("stayLength", "max", e.target.value)}
                className="w-full border p-2 rounded-xl"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Property Type */}
        <motion.div
          variants={fadeIn}
          custom={8}
          initial="hidden"
          animate="visible"
        >
          <p className="font-medium mb-1">
            Property Type <span className="text-red-500">*</span>
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Rooms", value: "rooms", icon: <FaBed /> },
              { label: "Studio/Flat", value: "studio_flat", icon: <FaCouch /> },
              { label: "House", value: "house", icon: <FaHome />},
            {label:"Other",value:"other"}
            ].map(({ label, value, icon }, i) => (
              <motion.label 
                key={i} 
                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="radio"
                  name="propertyType"
                  value={value}
                  checked={formData.propertyType === value}
                  onChange={() => setFormData(prev => ({ ...prev, propertyType: value }))}
                  required
                  className="accent-blue-600"
                />
                <span className="flex items-center gap-2">
                  {icon} {label}
                </span>
              </motion.label>
            ))}
          </div>
        </motion.div>

        {/* Room Amenities */}
        <motion.div
          variants={fadeIn}
          custom={9}
          initial="hidden"
          animate="visible"
        >
          <p className="font-medium mb-1">Room Amenities</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Furnished", value: "furnished", icon: <FaChair /> },
              { label: "Unfurnished", value: "unfurnished", icon: <FaChair /> },
              { label: "Double Room", value: "double_room", icon: <FaBed /> },
              { label: "Single Room", value: "single_room", icon: <FaBed /> },
              { label: "Ensuite", value: "ensuite", icon: <FaBath /> },
            ].map(({ label, value, icon }, i) => (
              <motion.label 
                key={i} 
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                whileHover={{ scale: 1.01 }}
              >
                <input 
                  type="checkbox" 
                  checked={formData.amenities.includes(value)}
                  onChange={(e) => handleCheckboxChange("amenities", value, e.target.checked)}
                  className="accent-blue-600" 
                />
                <span className="flex items-center gap-2">
                  {icon} {label}
                </span>
              </motion.label>
            ))}
          </div>
        </motion.div>

        {/* Tenant Preferred */}
        <motion.div
          variants={fadeIn}
          custom={10}
          initial="hidden"
          animate="visible"
        >
          <p className="font-medium mb-1">Tenant Preferred</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Student", value: "student", icon: <FaUserGraduate /> },
              { label: "Professional", value: "professional", icon: <FaBriefcase /> },
              { label: "Family", value: "family", icon: <FaUsers /> },
            ].map(({ label, value, icon }, i) => (
              <motion.label 
                key={i} 
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                whileHover={{ scale: 1.01 }}
              >
                <input 
                  type="checkbox" 
                  checked={formData.tenantPreferred.includes(value)}
                  onChange={(e) => handleCheckboxChange("tenantPreferred", value, e.target.checked)}
                  className="accent-blue-600" 
                />
                <span className="flex items-center gap-2">
                  {icon} {label}
                </span>
              </motion.label>
            ))}
            <motion.label 
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              whileHover={{ scale: 1.01 }}
            >
              <input
                type="checkbox"
                checked={formData.tenantOther !== ""}
                onChange={(e) => {
                  if (!e.target.checked) {
                    setFormData(prev => ({ ...prev, tenantOther: "" }));
                  }
                }}
                className="accent-blue-600"
              />
              <span className="flex items-center gap-2">
                <FaUser /> Other
              </span>
            </motion.label>
          </div>
          {formData.tenantOther !== "" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <input
                type="text"
                name="tenantOther"
                value={formData.tenantOther}
                onChange={handleInputChange}
                placeholder="Specify other..."
                className="mt-2 w-full border p-2 rounded-xl"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Household Preferences */}
        <motion.div
          variants={fadeIn}
          custom={11}
          initial="hidden"
          animate="visible"
        >
          <p className="font-medium mb-1">Household Preferences</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Vegetarian", value: "vegetarian", icon: <FaLeaf /> },
              { label: "Non-smoker", value: "non_smoker", icon: <FaSmoking /> },
              { label: "No Alcohol", value: "no_alcohol", icon: <FaBan /> },
              { label: "No Pets", value: "no_pets", icon: <FaPaw /> },
              { label: "No Parking", value: "no_parking", icon: <FaParking /> },
              { label: "Disabled Friendly", value: "disabled_friendly", icon: <FaWheelchair /> },
            ].map(({ label, value, icon }, i) => (
              <motion.label 
                key={i} 
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                whileHover={{ scale: 1.01 }}
              >
                <input 
                  type="checkbox" 
                  checked={formData.householdPreferences.includes(value)}
                  onChange={(e) => handleCheckboxChange("householdPreferences", value, e.target.checked)}
                  className="accent-blue-600" 
                />
                <span className="flex items-center gap-2">
                  {icon} {label}
                </span>
              </motion.label>
            ))}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          variants={fadeIn}
          custom={12}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white rounded-xl transition duration-300 font-semibold flex items-center justify-center`}
            whileHover={!isSubmitting ? { scale: 1.01 } : {}}
            whileTap={!isSubmitting ? { scale: 0.99 } : {}}
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
              />
            ) : null}
            {isSubmitting ? 'Submitting...' : 'Submit Ad'}
          </motion.button>
          <Alert show={showAlert} onClose={() => setShowAlert(false)} />
        </motion.div>
      </form>
    </motion.div>
  );
};

export default PostAd;