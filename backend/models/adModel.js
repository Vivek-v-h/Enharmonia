import mongoose from "mongoose";
import user from "./userModel.js";

const adSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  listingType: {
    type: String,
    required: true,
    enum: ['rooms_wanted', 'whole_building', 'rooms_to_rent', 'serviced_accommodation'],
    index: true
  },
  headline: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
    index: true
  },
  location: {
    type: String,
    required: true,
    index: true
  },
  coordinates: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
      required: function () {
        return this.coordinates?.coordinates != null;
      }
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      validate: {
        validator: function (v) {
          return !v || (Array.isArray(v) && v.length === 2);
        },
        message: 'Coordinates must be an array of [longitude, latitude] or null'
      },
      default: null
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  distanceFrom: {
    tube: { type: Number, default: 0 },
    bus: { type: Number, default: 0 },
    railway: { type: Number, default: 0 },
    metro: { type: Number, default: 0 }
  },
  stayLength: {
    min: {
      type: Number,
      default: 1,
      min: 1,
      index: true
    },
    max: {
      type: Number,
      default: 12,
      min: 1,
      index: true
    }
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['rooms', 'studio_flat', 'house', 'other'],
    index: true
  },
  amenities: {
    type: [String],
    default: [],
    enum: ['furnished', 'unfurnished', 'double_room', 'single_room', 'ensuite'],
    index: true
  },
  tenantPreferred: {
    type: [String],
    default: [],
    enum: ['student', 'professional', 'family', 'other'],
    index: true
  },
  tenantOther: {
    type: String,
    default: ""
  },
  householdPreferences: {
    type: [String],
    default: [],
    enum: ['vegetarian', 'non_smoker', 'no_alcohol', 'no_pets', 'no_parking', 'disabled_friendly'],
    index: true
  },
  photos: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: 'At least one photo is required'
    }
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'rejected', 'sold'],
    default: 'pending',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  wishlistedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update the updatedAt field before saving
adSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  // Ensure coordinates are properly formatted or null
  if (this.coordinates?.coordinates === null) {
    this.coordinates = undefined;
  }

  // Ensure stayLength min/max are valid numbers
  if (this.stayLength?.min === null || isNaN(this.stayLength?.min)) {
    this.stayLength = this.stayLength || {};
    this.stayLength.min = 1;
  }
  if (this.stayLength?.max === null || isNaN(this.stayLength?.max)) {
    this.stayLength = this.stayLength || {};
    this.stayLength.max = 12;
  }

  next();
});

// Create indexes
adSchema.index({
  headline: 'text',
  description: 'text',
  location: 'text'
});

// Only create geospatial index if coordinates exist
adSchema.index({ 'coordinates': '2dsphere' }, {
  sparse: true,
  partialFilterExpression: {
    'coordinates.coordinates': { $exists: true, $ne: null }
  }
});

// Virtual for wishlist count
adSchema.virtual('wishlistCount').get(function () {
  return this.wishlistedBy?.length || 0;
});

const AdModel = mongoose.models.Ad || mongoose.model('Ad', adSchema);

// Migration script for existing documents
const migrateExistingAds = async () => {
  try {
    const ads = await AdModel.find({
      $or: [
        { 'coordinates.coordinates': null },
        { 'stayLength.min': null },
        { 'stayLength.max': null }
      ]
    });

    for (const ad of ads) {
      if (ad.coordinates?.coordinates === null) {
        ad.coordinates = undefined;
      }
      if (ad.stayLength?.min === null) {
        ad.stayLength.min = 1;
      }
      if (ad.stayLength?.max === null) {
        ad.stayLength.max = 12;
      }
      await ad.save();
    }

    console.log(`Migrated ${ads.length} ads`);
  } catch (err) {
    console.error('Migration error:', err);
  }
};

// Run migration once when model is loaded
migrateExistingAds();

export default AdModel;
