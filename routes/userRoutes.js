import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getNearbyUsers,
  uploadProfileImage
} from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);
router.post('/profile-image', auth, upload.single('image'), uploadProfileImage);
router.get('/nearby', getNearbyUsers);

export default router;
