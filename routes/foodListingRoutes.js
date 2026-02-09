import express from 'express';
import {
  createFoodListing,
  getFoodListings,
  getFoodListingById,
  updateFoodListing,
  deleteFoodListing,
  getMyListings
} from '../controllers/foodListingController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createFoodListing);
router.get('/', getFoodListings);
router.get('/my-listings', auth, getMyListings);
router.get('/:id', getFoodListingById);
router.put('/:id', auth, updateFoodListing);
router.delete('/:id', auth, deleteFoodListing);

export default router;
