const Cart = require('../models/Cart');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');

// Get current user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.serviceId');
    res.json({ success: true, cart: cart || { items: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get cart', error: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { serviceId, quantity } = req.body;
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ success: false, message: 'Invalid serviceId' });
    }
    const qty = quantity && quantity > 0 ? quantity : 1;
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [{ serviceId, quantity: qty }] });
    } else {
      const item = cart.items.find(i => i.serviceId.toString() === serviceId);
      if (item) {
        item.quantity += qty;
      } else {
        cart.items.push({ serviceId, quantity: qty });
      }
    }
    await cart.save();
    res.json({ success: true, message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add to cart', error: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { serviceId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ success: false, message: 'Invalid serviceId' });
    }
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.json({ success: true, message: 'Cart is empty' });
    cart.items = cart.items.filter(i => i.serviceId.toString() !== serviceId);
    await cart.save();
    res.json({ success: true, message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove from cart', error: error.message });
  }
};

// Increase quantity of an item
const increaseQuantity = async (req, res) => {
  try {
    const { serviceId, amount } = req.body;
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ success: false, message: 'Invalid serviceId' });
    }
    const inc = Number.isFinite(Number(amount)) && Number(amount) > 0 ? Number(amount) : 1;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    const item = cart.items.find(i => i.serviceId.toString() === serviceId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });
    item.quantity = Number(item.quantity) + inc;
    await cart.save();
    res.json({ success: true, message: 'Quantity increased', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to increase quantity', error: error.message });
  }
};

// Decrease quantity of an item
const decreaseQuantity = async (req, res) => {
  try {
    const { serviceId, amount } = req.body;
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ success: false, message: 'Invalid serviceId' });
    }
    const dec = amount && amount > 0 ? amount : 1;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    const itemIndex = cart.items.findIndex(i => i.serviceId.toString() === serviceId);
    if (itemIndex === -1) return res.status(404).json({ success: false, message: 'Item not found in cart' });
    cart.items[itemIndex].quantity -= dec;
    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1); // Remove item if quantity is 0 or less
    }
    await cart.save();
    res.json({ success: true, message: 'Quantity decreased', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to decrease quantity', error: error.message });
  }
};

// Clear all items from cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, message: 'Cart cleared', cart: cart || { items: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear cart', error: error.message });
  }
};

// Checkout (for now, just clear cart)
const checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, message: 'Checkout successful. Cart cleared.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Checkout failed', error: error.message });
  }
};

// Generate OTP for booking verification
const generateBookingOTP = () => {
  const otpLength = 6;
  const otpExpiryMinutes = 5;
  
  const otp = Math.floor(Math.random() * Math.pow(10, otpLength))
    .toString()
    .padStart(otpLength, '0');
  
  const expiresAt = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);
  
  return { code: otp, expiresAt };
};

// Verify OTP for booking
const verifyBookingOTP = (booking, otp) => {
  if (!booking.otp || !booking.otp.code || !booking.otp.expiresAt) {
    return false;
  }
  
  if (new Date() > booking.otp.expiresAt) {
    booking.otp = undefined;
    return false;
  }
  
  if (booking.otp.code !== otp) {
    return false;
  }
  
  booking.otp = undefined;
  booking.isVerified = true;
  booking.status = 'completed';
  
  return true;
};

const checkoutWithDetails = async (req, res) => {
  try {
    const { checkoutId, professionalType, date, time, address } = req.body;
    if (!checkoutId || !professionalType || !date || !time || !address) {
      return res.status(400).json({ success: false, message: 'checkoutId, professionalType, date, time, and address are required.' });
    }
    const cart = await Cart.findOne({ _id: checkoutId, userId: req.user._id }).populate('items.serviceId');
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }
    
    // Generate OTP for service verification
    const otpData = generateBookingOTP();
    
    // Save booking details in Booking collection
    const booking = new Booking({
      userId: req.user._id,
      cartId: cart._id,
      professionalType,
      date,
      time,
      address,
      items: cart.items.map(item => ({ serviceId: item.serviceId._id || item.serviceId, quantity: item.quantity })),
      otp: otpData
    });
    await booking.save();
    
    res.json({
      success: true,
      message: 'Checkout successful. Booking details saved.',
      data: {
        booking,
        otp: otpData.code, // Return OTP for testing
        otpExpiresAt: otpData.expiresAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Checkout with details failed', error: error.message });
  }
};

// Verify service completion with OTP (for partner app)
const verifyServiceOTP = async (req, res) => {
  try {
    const { bookingId, otp } = req.body;
    if (!bookingId || !otp) {
      return res.status(400).json({ success: false, message: 'bookingId and otp are required.' });
    }
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    
    if (booking.isVerified) {
      return res.status(400).json({ success: false, message: 'Service already verified.' });
    }
    
    const isOTPValid = verifyBookingOTP(booking, otp);
    if (!isOTPValid) {
      await booking.save(); // Save to clear expired OTP
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }
    
    await booking.save();
    
    res.json({
      success: true,
      message: 'Service verified successfully.',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to verify service', error: error.message });
  }
};

// Get booking details for the authenticated user (placeholder: latest cart)
const getBookingDetails = async (req, res) => {
  try {
    // Fetch all bookings for the user, most recent first
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'No booking found' });
    }
    res.json({
      success: true,
      message: 'Booking details fetched successfully.',
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch booking details', error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  checkout,
  checkoutWithDetails,
  getBookingDetails,
  verifyServiceOTP
}; 