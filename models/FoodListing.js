import mongoose from 'mongoose';

const foodListingSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodName: {
    type: String,
    required: [true, 'Please provide food name'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity']
  },
  unit: {
    type: String,
    enum: ['kg', 'lbs', 'pieces', 'liters', 'portions'],
    default: 'pieces'
  },
  category: {
    type: String,
    enum: ['fruits', 'vegetables', 'grains', 'dairy', 'meat', 'cooked', 'packaged', 'other'],
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  pickupTime: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  pickupLocation: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  images: [String],
  status: {
    type: String,
    enum: ['available', 'claimed', 'expired', 'cancelled'],
    default: 'available'
  },
  allergens: [String],
  dietary: [String],
  pickupInstructions: String,
  hasRequests: {
    type: Boolean,
    default: false
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

// Create geospatial index for location-based queries
foodListingSchema.index({ location: '2dsphere' });
foodListingSchema.index({ status: 1, expiryDate: 1 });

export default mongoose.model('FoodListing', foodListingSchema);
