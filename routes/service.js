const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Get all services
router.get('/', serviceController.getAllServices);
// Get all services by multiple subCategoryIds (GET: ?ids=1,2,3 or POST: { subCategoryIds: [id1, id2] })
router.get('/by-subcategories', serviceController.getServicesBySubCategoryIds);
router.post('/by-subcategories', serviceController.getServicesBySubCategoryIds);
// Get a single service by ID
router.get('/:id', serviceController.getServiceById);
// Add a new service
router.post('/', serviceController.addService);
// Update a service
router.put('/:id', serviceController.updateService);
// Delete a service
router.delete('/:id', serviceController.deleteService);
router.post('/trending-near-you', serviceController.addTrendingNearYou);
router.post('/remove-trending-near-you', serviceController.removeTrendingNearYou);
router.post('/best-seller', serviceController.addBestSeller);
router.post('/remove-best-seller', serviceController.removeBestSeller);
// Get all services by subCategoryId
router.get('/subcategory/:subCategoryId', async (req, res) => {
  try {
    const services = await require('../models/Service').find({ subCategoryId: req.params.subCategoryId });
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get services by subcategory', error: error.message });
  }
});

module.exports = router; 