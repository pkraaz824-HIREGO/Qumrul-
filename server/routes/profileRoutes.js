import express from 'express';
import {
  getProfile,
  updateBasicProfile,
  requestEmailOTP,
  verifyEmailOTP,
  requestPhoneOTP,
  verifyPhoneOTP,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/', getProfile);
router.put('/basic', updateBasicProfile);

// Email update with OTP
router.post('/email/request-otp', requestEmailOTP);
router.post('/email/verify-otp', verifyEmailOTP);

// Phone update with OTP
router.post('/phone/request-otp', requestPhoneOTP);
router.post('/phone/verify-otp', verifyPhoneOTP);

// Address management routes
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);
router.patch('/addresses/:addressId/default', setDefaultAddress);

export default router;
