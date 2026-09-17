import express from 'express';
import {
  getAllSpots,
  getFeaturedSpots,
  getSpotById,
  createSpot,
  deleteSpot,
} from '../controllers/spotController.js';
import reviewRoutes from './reviewRoutes.js';

const router = express.Router();

router.use('/:id/reviews', reviewRoutes);
router.get('/featured', getFeaturedSpots);
router.get('/', getAllSpots);
router.get('/:id', getSpotById);
router.post('/', createSpot);
router.delete('/:id', deleteSpot);

export default router;
