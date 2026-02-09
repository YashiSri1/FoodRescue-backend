import Request from '../models/Request.js';
import FoodListing from '../models/FoodListing.js';

export const createRequest = async (req, res) => {
  try {
    const { foodListingId, requestType, quantityRequested, pickupDate, pickupTime, notes } = req.body;

    const foodListing = await FoodListing.findById(foodListingId);
    if (!foodListing) {
      return res.status(404).json({ error: 'Food listing not found' });
    }

    if (foodListing.status !== 'available') {
      return res.status(400).json({ error: 'This food listing is no longer available' });
    }

    const request = new Request({
      foodListing: foodListingId,
      requestedBy: req.userId,
      requestType,
      quantityRequested,
      pickupDate,
      pickupTime,
      notes
    });

    await request.save();

    // Mark listing as having requests
    foodListing.hasRequests = true;
    await foodListing.save();

    res.status(201).json({
      message: 'Request created successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('foodListing')
      .populate('requestedBy', 'name email phone profileImage');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requestedBy: req.userId })
      .populate('foodListing')
      .sort('-createdAt');

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRequestsForMyListings = async (req, res) => {
  try {
    const listings = await FoodListing.find({ donor: req.userId });
    const listingIds = listings.map(l => l._id);

    const requests = await Request.find({ foodListing: { $in: listingIds } })
      .populate('foodListing')
      .populate('requestedBy', 'name email phone profileImage')
      .sort('-createdAt');

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const foodListing = await FoodListing.findById(request.foodListing);
    if (foodListing.donor.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to accept this request' });
    }

    request.status = 'accepted';
    await request.save();

    res.status(200).json({
      message: 'Request accepted successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { responseMessage } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const foodListing = await FoodListing.findById(request.foodListing);
    if (foodListing.donor.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to reject this request' });
    }

    request.status = 'rejected';
    request.responseMessage = responseMessage;
    await request.save();

    res.status(200).json({
      message: 'Request rejected',
      request
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const completeRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const foodListing = await FoodListing.findById(request.foodListing);
    if (foodListing.donor.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to complete this request' });
    }

    request.status = 'completed';
    request.completedAt = new Date();
    await request.save();

    // Update food listing status if all quantities are claimed
    foodListing.status = 'claimed';
    await foodListing.save();

    res.status(200).json({
      message: 'Request completed successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelRequest = async (req, res) => {
  try {
    const { cancelReason } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.requestedBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to cancel this request' });
    }

    request.status = 'cancelled';
    request.cancelledAt = new Date();
    request.cancelReason = cancelReason;
    await request.save();

    res.status(200).json({
      message: 'Request cancelled successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
