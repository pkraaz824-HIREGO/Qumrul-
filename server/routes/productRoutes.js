import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';
import { productValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, admin, productValidation, validate, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
