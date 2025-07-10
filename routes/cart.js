const express = require('express');
const { authenticate } = require('../middleware/auth');
const cartController = require('../controllers/cartController');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.post('/remove', cartController.removeFromCart);
router.post('/increase', cartController.increaseQuantity);
router.post('/clear', cartController.clearCart);
router.post('/checkout', cartController.checkout);

module.exports = router; 