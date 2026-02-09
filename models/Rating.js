import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  review: String,
  foodListing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodListing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Rating', ratingSchema);
