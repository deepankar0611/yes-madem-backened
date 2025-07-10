const SubCategory = require('../models/SubCategory');

// Add a new subcategory
const addSubCategory = async (req, res) => {
  try {
    const { name, imageUrl, mainCategoryId } = req.body;
    if (!name || !imageUrl || !mainCategoryId) {
      return res.status(400).json({ success: false, message: 'Name, imageUrl, and mainCategoryId are required' });
    }
    const subCategory = new SubCategory({ name, imageUrl, mainCategoryId });
    await subCategory.save();
    res.status(201).json({ success: true, message: 'Subcategory added', subCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add subcategory', error: error.message });
  }
};

// Update a subcategory
const updateSubCategory = async (req, res) => {
  try {
    const { name, imageUrl, mainCategoryId } = req.body;
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) return res.status(404).json({ success: false, message: 'Subcategory not found' });
    if (name) subCategory.name = name;
    if (imageUrl) subCategory.imageUrl = imageUrl;
    if (mainCategoryId) subCategory.mainCategoryId = mainCategoryId;
    await subCategory.save();
    res.json({ success: true, message: 'Subcategory updated', subCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update subcategory', error: error.message });
  }
};

// Delete a subcategory
const deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!subCategory) return res.status(404).json({ success: false, message: 'Subcategory not found' });
    res.json({ success: true, message: 'Subcategory deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete subcategory', error: error.message });
  }
};

// Get all subcategories
const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find();
    res.json({ success: true, subCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get subcategories', error: error.message });
  }
};

// Get a single subcategory by ID
const getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) return res.status(404).json({ success: false, message: 'Subcategory not found' });
    res.json({ success: true, subCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get subcategory', error: error.message });
  }
};

// Get subcategories by main category
const getSubCategoriesByMainCategory = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ mainCategoryId: req.params.mainCategoryId });
    res.json({ success: true, subCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get subcategories by main category', error: error.message });
  }
};

module.exports = {
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  getSubCategoriesByMainCategory
}; 