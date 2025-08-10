const express = require('express');
const router = express.Router();
const consultantExpertController = require('../controllers/consultantExpertController');

// All consultant expert routes are public (no authentication required)

// Create a new consultant expert
router.post('/', consultantExpertController.createConsultantExpert);

// Get all consultant experts (for admin)
router.get('/all', consultantExpertController.getAllConsultantExperts);

// Get active consultant experts (for user app)
router.get('/active', consultantExpertController.getActiveConsultantExperts);

// Get consultant expert by ID
router.get('/:id', consultantExpertController.getConsultantExpertById);

// Update consultant expert
router.put('/:id', consultantExpertController.updateConsultantExpert);

// Delete consultant expert
router.delete('/:id', consultantExpertController.deleteConsultantExpert);

module.exports = router;
