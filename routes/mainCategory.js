const express = require('express');
const router = express.Router();
const mainCategoryController = require('../controllers/mainCategoryController');

// Add a new main category
router.post('/', mainCategoryController.addMainCategory);
// Update a main category
router.put('/:id', mainCategoryController.updateMainCategory);
// Delete a main category
router.delete('/:id', mainCategoryController.deleteMainCategory);
// Get all main categories
router.get('/', mainCategoryController.getAllMainCategories);
// Get a single main category by ID
router.get('/:id', mainCategoryController.getMainCategoryById);

module.exports = router; 