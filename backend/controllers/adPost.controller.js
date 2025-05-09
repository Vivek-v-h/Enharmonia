import AdModel from "../models/adModel.js";
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';

// Configure Cloudinary (you'll need to set these in your environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
}).array('photos', 10); // Allow up to 10 files

// Helper function to upload images to Cloudinary
const uploadToCloudinary = async (files) => {
  const uploadPromises = files.map(file => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      ).end(file.buffer);
    });
  });
  
  return Promise.all(uploadPromises);
};

// Create a new ad
const createAd = async (req, res) => {
  try {
    // First handle the file uploads
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ 
          success: false, 
          message: err.message 
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'At least one photo is required' 
        });
      }

      // Upload photos to Cloudinary
      const photoUrls = await uploadToCloudinary(req.files);
      
      // Prepare the ad data
      const {
        listingType,
        headline,
        description,
        location,
        coordinates,
        price,
        distanceFrom,
        stayLength,
        propertyType,
        amenities,
        tenantPreferred,
        householdPreferences,
        tenantOther
      } = req.body;

      // Create new ad
      const newAd = new AdModel({
        userId: req.user.id,
        listingType,
        headline,
        description,
        location,
        coordinates: coordinates ? JSON.parse(coordinates) : null,
        price: parseFloat(price),
        distanceFrom: distanceFrom ? JSON.parse(distanceFrom) : {},
        stayLength: stayLength ? JSON.parse(stayLength) : {},
        propertyType,
        amenities: amenities ? JSON.parse(amenities) : [],
        tenantPreferred: tenantPreferred ? JSON.parse(tenantPreferred) : [],
        householdPreferences: householdPreferences ? JSON.parse(householdPreferences) : [],
        tenantOther: tenantOther || "",
        photos: photoUrls
      });

      // Save the ad to database
      const savedAd = await newAd.save();

      res.status(201).json({
        success: true,
        message: 'Ad created successfully',
        ad: savedAd
      });
    });
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get all ads
const getAllAds = async (req, res) => {
  try {
    const ads = await AdModel.find({ status: 'active' })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: ads.length,
      ads
    });
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Get ads by user
const getUserAds = async (req, res) => {
  try {
    const ads = await AdModel.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: ads.length,
      ads
    });
  } catch (error) {
    console.error('Error fetching user ads:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Get single ad
const getAd = async (req, res) => {
  try {
    const ad = await AdModel.findById(req.params.id)
      .populate('userId', 'name avatar');
    
    if (!ad) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ad not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      ad
    });
  } catch (error) {
    console.error('Error fetching ad:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Update ad
const updateAd = async (req, res) => {
  try {
    const ad = await AdModel.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ad not found' 
      });
    }
    
    // Check if the user owns the ad
    if (ad.userId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this ad' 
      });
    }
    
    // Update fields
    const updatableFields = [
      'headline', 'description', 'location', 'coordinates', 'price',
      'distanceFrom', 'stayLength', 'amenities', 'tenantPreferred',
      'householdPreferences', 'tenantOther'
    ];
    
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'coordinates' || field === 'distanceFrom' || field === 'stayLength') {
          ad[field] = JSON.parse(req.body[field]);
        } else if (field === 'amenities' || field === 'tenantPreferred' || field === 'householdPreferences') {
          ad[field] = req.body[field] ? JSON.parse(req.body[field]) : [];
        } else {
          ad[field] = req.body[field];
        }
      }
    });
    
    // Handle photo updates if any
    if (req.files && req.files.length > 0) {
      const photoUrls = await uploadToCloudinary(req.files);
      ad.photos = [...ad.photos, ...photoUrls];
    }
    
    const updatedAd = await ad.save();
    
    res.status(200).json({
      success: true,
      message: 'Ad updated successfully',
      ad: updatedAd
    });
  } catch (error) {
    console.error('Error updating ad:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Delete ad
const deleteAd = async (req, res) => {
  try {
    const ad = await AdModel.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ad not found' 
      });
    }
    
    // Check if the user owns the ad
    if (ad.userId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this ad' 
      });
    }

    // Delete photos from Cloudinary
    const deletePhotoPromises = ad.photos.map(url => {
      const publicId = url.split('/').pop().split('.')[0]; // assumes format ends with publicId.extension
      return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    });
    await Promise.all(deletePhotoPromises);
    
    await ad.remove();
    
    res.status(200).json({
      success: true,
      message: 'Ad deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting ad:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

export {
  createAd,
  getAllAds,
  getUserAds,
  getAd,
  updateAd,
  deleteAd
};
