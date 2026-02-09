import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  foodListing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodListing',
    required: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestType: {
    type: String,
    enum: ['personal', 'organization'],
    default: 'organization'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  quantityRequested: {
    type: Number,
    required: true
  },
  pickupDate: {
    type: Date,
    required: true
  },
  pickupTime: String,
  notes: String,
  responseMessage: String,
  completedAt: Date,
  cancelledAt: Date,
  cancelReason: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Request', requestSchema);
