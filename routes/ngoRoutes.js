import express from 'express';
import {
  registerNGO,
  getNGOs,
  getNGOById,
  updateNGO,
  verifyNGO,
  getMyNGO
} from '../controllers/ngoController.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, registerNGO);
router.get('/', getNGOs);
router.get('/ngo/my-ngo', auth, getMyNGO);
router.get('/:id', getNGOById);
router.put('/:id', auth, updateNGO);
router.put('/:id/verify', auth, authorize('admin'), verifyNGO);

export default router;
