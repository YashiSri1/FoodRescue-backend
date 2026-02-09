import FoodListing from '../models/FoodListing.js';
import User from '../models/User.js';

export const createFoodListing = async (req, res) => {
  try {
    const {
      foodName,
      description,
      quantity,
      unit,
      category,
      expiryDate,
      pickupTime,
      pickupLocation,
      location,
      allergens,
      dietary,
      pickupInstructions
    } = req.body;

    const foodListing = new FoodListing({
      donor: req.userId,
      foodName,
      description,
      quantity,
      unit,
      category,
      expiryDate,
      pickupTime,
      pickupLocation,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      },
      allergens,
      dietary,
      pickupInstructions
    });

    await foodListing.save();

    res.status(201).json({
      message: 'Food listing created successfully',
      foodListing
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFoodListings = async (req, res) => {
  try {
    const { status = 'available', latitude, longitude, maxDistance = 10 } = req.query;

    let query = { status };

    if (latitude && longitude) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: maxDistance * 1000
        }
      };
    }

    const listings = await FoodListing.find(query)
      .populate('donor', 'name email phone profileImage averageRating')
      .sort('-createdAt');

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFoodListingById = async (req, res) => {
  try {
    const foodListing = await FoodListing.findById(req.params.id)
      .populate('donor', 'name email phone profileImage bio address averageRating');

    if (!foodListing) {
      return res.status(404).json({ error: 'Food listing not found' });
    }

    res.status(200).json(foodListing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFoodListing = async (req, res) => {
  try {
    let foodListing = await FoodListing.findById(req.params.id);

    if (!foodListing) {
      return res.status(404).json({ error: 'Food listing not found' });
    }

    if (foodListing.donor.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }

    const { status, location, ...updateData } = req.body;

    if (location) {
      updateData.location = {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      };
    }

    foodListing = await FoodListing.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      message: 'Food listing updated successfully',
      foodListing
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFoodListing = async (req, res) => {
  try {
    const foodListing = await FoodListing.findById(req.params.id);

    if (!foodListing) {
      return res.status(404).json({ error: 'Food listing not found' });
    }

    if (foodListing.donor.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    await FoodListing.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Food listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyListings = async (req, res) => {
  try {
    const listings = await FoodListing.find({ donor: req.userId }).sort('-createdAt');

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
