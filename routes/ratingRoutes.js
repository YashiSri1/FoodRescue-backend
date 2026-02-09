import express from 'express';
import { createRating, getUserRatings } from '../controllers/ratingController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createRating);
router.get('/:userId', getUserRatings);

export default router;
