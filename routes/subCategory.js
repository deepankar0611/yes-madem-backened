const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');

// Add a new subcategory
router.post('/', subCategoryController.addSubCategory);
// Update a subcategory
router.put('/:id', subCategoryController.updateSubCategory);
// Delete a subcategory
router.delete('/:id', subCategoryController.deleteSubCategory);
// Get all subcategories
router.get('/', subCategoryController.getAllSubCategories);
// Get a single subcategory by ID
router.get('/:id', subCategoryController.getSubCategoryById);
// Get subcategories by main category
router.get('/main/:mainCategoryId', subCategoryController.getSubCategoriesByMainCategory);

module.exports = router; 