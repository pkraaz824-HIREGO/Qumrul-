import User from '../models/User.js';
import crypto from 'crypto';
import { sendOTPEmail } from '../services/emailService.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    res.json({ user, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Update basic profile (name only, no OTP needed)
export const updateBasicProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    
    await user.save();
    
    const updatedUser = await User.findById(user._id).select('-password');
    res.json({ message: 'Profile updated successfully', user: updatedUser, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Request OTP for email update
export const requestEmailOTP = async (req, res) => {
  try {
    const { newEmail } = req.body;
    
    if (!newEmail) {
      return res.status(400).json({ message: 'Email is required', success: false });
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use', success: false });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    // Generate OTP
    const otp = user.createOTP();
    user.pendingEmailUpdate = newEmail;
    await user.save({ validateBeforeSave: false });
    
    // Send OTP to new email
    try {
      await sendOTPEmail(newEmail, otp, 'Email Update');
      res.json({ message: 'OTP sent to your new email', success: true });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.json({ message: 'OTP generated (Email service not configured). OTP for testing: ' + otp, success: true, otp });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Verify OTP and update email
export const verifyEmailOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    
    if (!otp) {
      return res.status(400).json({ message: 'OTP is required', success: false });
    }
    
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    
    const user = await User.findOne({
      _id: req.user._id,
      otpToken: hashedOTP,
      otpExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP', success: false });
    }
    
    // Update email
    user.email = user.pendingEmailUpdate;
    user.otpToken = undefined;
    user.otpExpires = undefined;
    user.pendingEmailUpdate = undefined;
    
    await user.save();
    
    const updatedUser = await User.findById(user._id).select('-password');
    res.json({ message: 'Email updated successfully', user: updatedUser, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Request OTP for phone update
export const requestPhoneOTP = async (req, res) => {
  try {
    const { newPhone } = req.body;
    
    if (!newPhone) {
      return res.status(400).json({ message: 'Phone number is required', success: false });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    // Generate OTP
    const otp = user.createOTP();
    user.pendingPhoneUpdate = newPhone;
    await user.save({ validateBeforeSave: false });
    
    // Send OTP to current email (since SMS service requires additional setup)
    try {
      await sendOTPEmail(user.email, otp, 'Phone Update');
      res.json({ message: 'OTP sent to your registered email', success: true });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.json({ message: 'OTP generated (Email service not configured). OTP for testing: ' + otp, success: true, otp });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Verify OTP and update phone
export const verifyPhoneOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    
    if (!otp) {
      return res.status(400).json({ message: 'OTP is required', success: false });
    }
    
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    
    const user = await User.findOne({
      _id: req.user._id,
      otpToken: hashedOTP,
      otpExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP', success: false });
    }
    
    // Update phone
    user.phone = user.pendingPhoneUpdate;
    user.otpToken = undefined;
    user.otpExpires = undefined;
    user.pendingPhoneUpdate = undefined;
    
    await user.save();
    
    const updatedUser = await User.findById(user._id).select('-password');
    res.json({ message: 'Phone number updated successfully', user: updatedUser, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get all addresses
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    res.json({ addresses: user.addresses, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Add new address
export const addAddress = async (req, res) => {
  try {
    const { label, street, city, state, zipCode, country, isDefault } = req.body;
    
    if (!street || !city || !state || !zipCode) {
      return res.status(400).json({ message: 'All address fields are required', success: false });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    // If this is the first address or set as default, make it default
    const shouldBeDefault = isDefault || user.addresses.length === 0;
    
    // If setting as default, unset other defaults
    if (shouldBeDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push({
      label: label || 'Home',
      street,
      city,
      state,
      zipCode,
      country: country || 'India',
      isDefault: shouldBeDefault
    });
    
    await user.save();
    
    res.json({ 
      message: 'Address added successfully', 
      addresses: user.addresses, 
      success: true 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { label, street, city, state, zipCode, country, isDefault } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    const address = user.addresses.id(addressId);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found', success: false });
    }
    
    // If setting as default, unset other defaults
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    if (label !== undefined) address.label = label;
    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (zipCode !== undefined) address.zipCode = zipCode;
    if (country !== undefined) address.country = country;
    if (isDefault !== undefined) address.isDefault = isDefault;
    
    await user.save();
    
    res.json({ 
      message: 'Address updated successfully', 
      addresses: user.addresses, 
      success: true 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    const address = user.addresses.id(addressId);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found', success: false });
    }
    
    const wasDefault = address.isDefault;
    address.remove();
    
    // If deleted address was default and there are other addresses, make the first one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    
    await user.save();
    
    res.json({ 
      message: 'Address deleted successfully', 
      addresses: user.addresses, 
      success: true 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    const address = user.addresses.id(addressId);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found', success: false });
    }
    
    // Unset all defaults
    user.addresses.forEach(addr => addr.isDefault = false);
    // Set new default
    address.isDefault = true;
    
    await user.save();
    
    res.json({ 
      message: 'Default address updated', 
      addresses: user.addresses, 
      success: true 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', success: false });
  }
};
