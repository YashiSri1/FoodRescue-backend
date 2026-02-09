import mongoose from 'mongoose';

const ngoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizationName: {
    type: String,
    required: [true, 'Please provide organization name']
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['orphanage', 'homeless_shelter', 'medical_facility', 'school', 'charity', 'community_center', 'other'],
    required: true
  },
  description: String,
  website: String,
  logo: String,
  documents: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  verifiedBy: mongoose.Schema.Types.ObjectId,
  foodCollected: {
    type: Number,
    default: 0
  },
  volunteersCount: {
    type: Number,
    default: 0
  },
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
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

export default mongoose.model('NGO', ngoSchema);
