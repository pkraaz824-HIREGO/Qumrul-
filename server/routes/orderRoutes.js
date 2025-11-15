import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderInvoice
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';
import { orderValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// User routes
router.post('/', protect, orderValidation, validate, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.get('/:id/invoice', protect, getOrderInvoice);
router.put('/:id/cancel', protect, cancelOrder);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
