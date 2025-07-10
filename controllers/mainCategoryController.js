const MainCategory = require('../models/MainCategory');

// Add a new main category
const addMainCategory = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    if (!name || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Name and imageUrl are required' });
    }
    const mainCategory = new MainCategory({ name, imageUrl });
    await mainCategory.save();
    res.status(201).json({ success: true, message: 'Main category added', mainCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add main category', error: error.message });
  }
};

// Update a main category
const updateMainCategory = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    const mainCategory = await MainCategory.findById(req.params.id);
    if (!mainCategory) return res.status(404).json({ success: false, message: 'Main category not found' });
    if (name) mainCategory.name = name;
    if (imageUrl) mainCategory.imageUrl = imageUrl;
    await mainCategory.save();
    res.json({ success: true, message: 'Main category updated', mainCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update main category', error: error.message });
  }
};

// Delete a main category
const deleteMainCategory = async (req, res) => {
  try {
    const mainCategory = await MainCategory.findByIdAndDelete(req.params.id);
    if (!mainCategory) return res.status(404).json({ success: false, message: 'Main category not found' });
    res.json({ success: true, message: 'Main category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete main category', error: error.message });
  }
};

// Get all main categories
const getAllMainCategories = async (req, res) => {
  try {
    const mainCategories = await MainCategory.find();
    res.json({ success: true, mainCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get main categories', error: error.message });
  }
};

// Get a single main category by ID
const getMainCategoryById = async (req, res) => {
  try {
    const mainCategory = await MainCategory.findById(req.params.id);
    if (!mainCategory) return res.status(404).json({ success: false, message: 'Main category not found' });
    res.json({ success: true, mainCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get main category', error: error.message });
  }
};

module.exports = {
  addMainCategory,
  updateMainCategory,
  deleteMainCategory,
  getAllMainCategories,
  getMainCategoryById
}; 