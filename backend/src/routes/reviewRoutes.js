import express from 'express';
import { getReviewsBySpot, addReview } from '../controllers/reviewController.js';

const router = express.Router({ mergeParams: true });

router.get('/', getReviewsBySpot);
router.post('/', addReview);

export default router;
