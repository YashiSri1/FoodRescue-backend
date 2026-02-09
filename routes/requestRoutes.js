import express from 'express';
import {
  createRequest,
  getRequest,
  getMyRequests,
  getRequestsForMyListings,
  acceptRequest,
  rejectRequest,
  completeRequest,
  cancelRequest
} from '../controllers/requestController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createRequest);
router.get('/my-requests', auth, getMyRequests);
router.get('/my-listings-requests', auth, getRequestsForMyListings);
router.get('/:id', auth, getRequest);
router.put('/:id/accept', auth, acceptRequest);
router.put('/:id/reject', auth, rejectRequest);
router.put('/:id/complete', auth, completeRequest);
router.put('/:id/cancel', auth, cancelRequest);

export default router;
