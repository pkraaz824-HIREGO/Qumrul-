import express from 'express';
import {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners
} from '../controllers/bannerController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getBanners);
router.get('/:id', getBannerById);

// Admin routes
router.post('/', protect, admin, createBanner);
router.put('/reorder', protect, admin, reorderBanners);
router.put('/:id', protect, admin, updateBanner);
router.delete('/:id', protect, admin, deleteBanner);

export default router;
