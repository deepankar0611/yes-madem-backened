const express = require('express');
const router = express.Router();
const consultantBannerController = require('../controllers/consultantBannerController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/active', consultantBannerController.getActiveConsultantBanners);
router.get('/position/:position', consultantBannerController.getConsultantBannerByPosition);

// Admin routes (authentication and admin authorization required)
router.post('/', authenticate, requireAdmin, consultantBannerController.createConsultantBanner);
router.get('/', authenticate, requireAdmin, consultantBannerController.getAllConsultantBanners);
router.get('/:id', authenticate, requireAdmin, consultantBannerController.getConsultantBannerById);
router.put('/:id', authenticate, requireAdmin, consultantBannerController.updateConsultantBanner);
router.delete('/:id', authenticate, requireAdmin, consultantBannerController.deleteConsultantBanner);
router.put('/:id/position', authenticate, requireAdmin, consultantBannerController.updateConsultantBannerPosition);

module.exports = router;
