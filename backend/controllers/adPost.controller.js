import AdModel from "../models/adModel.js";
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// Configure Cloudinary
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
    // Handle file uploads
    upload(req, res, async (err) => {
      if (err) {
        console.error("File upload error:", err);
        return res.status(400).json({ 
          success: false, 
          message: err instanceof multer.MulterError 
            ? `File upload error: ${err.message}` 
            : "File upload failed"
        });
      }

      // Check if files were uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: "At least one photo is required" 
        });
      }

      try {
        // Upload photos to Cloudinary
        const photoUrls = await uploadToCloudinary(req.files);
        
        // Parse request body
        const {
          userId,
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

        // Validate required fields
        if (!userId || !listingType || !headline || !description || 
            !location || !price || !propertyType) {
          return res.status(400).json({
            success: false,
            message: "Missing required fields"
          });
        }

        // Create new ad
        const newAd = new AdModel({
          userId,
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

        // Save to database
        const savedAd = await newAd.save();

        return res.status(201).json({
          success: true,
          message: "Ad created successfully",
          ad: savedAd
        });
      } catch (parseError) {
        console.error("Error processing ad:", parseError);
        return res.status(400).json({
          success: false,
          message: "Error processing ad data",
          error: parseError.message
        });
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


// Get all ads
const getAllAds = async (req, res) => {
  try {
    const {
      location,
      listingType,
      sortBy,
      rentMin = 0,
      rentMax = 5000,
      stayMin = 1,
      stayMax = 24,
      propertyTypes = [],
      amenities = [],
      tenantPreferred = [],
      householdPreferences = [],
      latitude,
      longitude
    } = req.query;

    // Build query
    const query = { userId: { $ne: null } };

    if (listingType) query.listingType = listingType;
    
    // Price range
    query.price = { $gte: Number(rentMin), $lte: Number(rentMax) };
    
    // Stay length range
    query['stayLength.min'] = { $gte: Number(stayMin) };
    query['stayLength.max'] = { $lte: Number(stayMax) };
    
    // Property types
    if (propertyTypes.length > 0) {
      query.propertyType = { $in: propertyTypes };
    }
    
    // Amenities
    if (amenities.length > 0) {
      query.amenities = { $all: amenities };
    }
    
    // Tenant preferences
    if (tenantPreferred.length > 0) {
      query.tenantPreferred = { $in: tenantPreferred };
    }
    
    // Household preferences
    if (householdPreferences.length > 0) {
      query.householdPreferences = { $in: householdPreferences };
    }
    
    // Location search
    if (location) {
      query.$or = [
        { location: { $regex: location, $options: 'i' } },
        { headline: { $regex: location, $options: 'i' } },
        { description: { $regex: location, $options: 'i' } }
      ];
    }

    // Build sort
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          sort.price = 1;
          break;
        case 'price-desc':
          sort.price = -1;
          break;
        case 'stay-asc':
          sort['stayLength.min'] = 1;
          break;
        case 'stay-desc':
          sort['stayLength.min'] = -1;
          break;
        default:
          sort.createdAt = -1;
      }
    } else {
      sort.createdAt = -1;
    }

    // Geo location search
    if (latitude && longitude) {
      // This is a simplified approach - for production you'd want to use MongoDB's geospatial queries
      query.coordinates = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 10000 // 10km radius
        }
      };
    }

    const ads = await AdModel.find(query)
      .populate('userId', 'name avatar')
      .sort(sort);

    res.status(200).json({
      success: true,
      count: ads.length,
      ads
    });
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
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
      const publicId = url.split('/').pop().split('.')[0];
      return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    });
    await Promise.all(deletePhotoPromises);
    
    await ad.deleteOne();
    
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

// Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const ad = await AdModel.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    const user = await UserModel.findById(req.user.id);
    if (user.wishlist.includes(req.params.id)) {
      return res.status(400).json({ message: 'Ad already in wishlist' });
    }

    user.wishlist.push(req.params.id);
    await user.save();

    res.status(200).json({ message: 'Added to wishlist' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.id);
    await user.save();

    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id)
      .populate({
        path: 'wishlist',
        populate: { path: 'userId', select: 'name avatar' }
      });
      
    res.status(200).json(user.wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  createAd,
  getAllAds,
  getUserAds,
  getAd,
  updateAd,
  deleteAd,
  addToWishlist,
  removeFromWishlist,
  getWishlist
};