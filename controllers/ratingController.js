import Rating from '../models/Rating.js';
import User from '../models/User.js';

export const createRating = async (req, res) => {
  try {
    const { ratedUserId, rating, review, foodListingId } = req.body;

    // Check if rating already exists
    let existingRating = await Rating.findOne({
      ratedBy: req.userId,
      ratedUser: ratedUserId
    });

    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this user' });
    }

    const newRating = new Rating({
      ratedBy: req.userId,
      ratedUser: ratedUserId,
      rating,
      review,
      foodListing: foodListingId
    });

    await newRating.save();

    // Update user's average rating
    const allRatings = await Rating.find({ ratedUser: ratedUserId });
    const averageRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    await User.findByIdAndUpdate(ratedUserId, {
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalRatings: allRatings.length
    });

    res.status(201).json({
      message: 'Rating created successfully',
      rating: newRating
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ ratedUser: req.params.userId })
      .populate('ratedBy', 'name profileImage')
      .sort('-createdAt');

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
