const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Get all services
router.get('/', serviceController.getAllServices);
// Get a single service by ID
router.get('/:id', serviceController.getServiceById);
// Add a new service
router.post('/', serviceController.addService);
// Update a service
router.put('/:id', serviceController.updateService);
// Delete a service
router.delete('/:id', serviceController.deleteService);
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