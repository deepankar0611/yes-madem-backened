const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

// All banner routes are now public (no authentication required)

// Get active banners
router.get('/active', bannerController.getActiveBanners);

// Get banner by position
router.get('/position/:position', bannerController.getBannerByPosition);

// Get banner by ID
router.get('/:id', bannerController.getBannerById);

// Get all banners
router.get('/', bannerController.getAllBanners);

// Create a new banner
router.post('/', bannerController.createBanner);

// Update banner
router.put('/:id', bannerController.updateBanner);

// Update banner position
router.put('/:id/position', bannerController.updateBannerPosition);

// Delete banner
router.delete('/:id', bannerController.deleteBanner);

module.exports = router; 