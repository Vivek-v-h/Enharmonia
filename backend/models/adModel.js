import mongoose from "mongoose";
import user from "./userModel.js"

const adSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  listingType: {
    type: String,
    required: true,
    enum: ['rooms_wanted', 'whole_building', 'rooms_to_rent', 'serviced_accommodation']
  },
  headline: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  location: {
    type: String,
    required: true
  },
  coordinates: {
    type: {
      lat: Number,
      lng: Number
    },
    default: null
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  distanceFrom: {
    tube: { type: Number, default: 0 },
    bus: { type: Number, default: 0 },
    railway: { type: Number, default: 0 },
    metro: { type: Number, default: 0 }
  },
  stayLength: {
    min: { type: Number, default: 1 },
    max: { type: Number, default: 12 }
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['rooms', 'studio_flat', 'house', 'other']
  },
  amenities: {
    type: [String],
    default: [],
    enum: ['furnished', 'unfurnished', 'double_room', 'single_room', 'ensuite']
  },
  tenantPreferred: {
    type: [String],
    default: [],
    enum: ['student', 'professional', 'family', 'other']
  },
  tenantOther: {
    type: String,
    default: ""
  },
  householdPreferences: {
    type: [String],
    default: [],
    enum: ['vegetarian', 'non_smoker', 'no_alcohol', 'no_pets', 'no_parking', 'disabled_friendly']
  },
  photos: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one photo is required'
    }
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'rejected', 'sold'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
adSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const AdModel = mongoose.models.Ad || mongoose.model('Ad', adSchema);

export default AdModel;