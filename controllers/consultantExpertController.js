const ConsultantExpert = require('../models/ConsultantExpert');

// Create a new consultant expert
const createConsultantExpert = async (req, res) => {
  try {
    const { name, shortDesc, longDesc, expertise, image } = req.body;

    // Validate required fields
    if (!name || !shortDesc || !longDesc || !expertise || !image) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, shortDesc, longDesc, expertise, image'
      });
    }

    // Validate expertise array
    if (!Array.isArray(expertise) || expertise.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Expertise must be a non-empty array'
      });
    }

    const consultantExpert = new ConsultantExpert({
      name,
      shortDesc,
      longDesc,
      expertise,
      image
    });

    await consultantExpert.save();

    res.status(201).json({
      success: true,
      message: 'Consultant expert created successfully',
      data: consultantExpert
    });
  } catch (error) {
    console.error('Error creating consultant expert:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating consultant expert',
      error: error.message
    });
  }
};

// Get all consultant experts (for admin)
const getAllConsultantExperts = async (req, res) => {
  try {
    const consultantExperts = await ConsultantExpert.getAllConsultantExperts();
    
    res.status(200).json({
      success: true,
      message: 'Consultant experts retrieved successfully',
      count: consultantExperts.length,
      data: consultantExperts
    });
  } catch (error) {
    console.error('Error getting all consultant experts:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving consultant experts',
      error: error.message
    });
  }
};

// Get active consultant experts (for user app)
const getActiveConsultantExperts = async (req, res) => {
  try {
    const consultantExperts = await ConsultantExpert.getActiveConsultantExperts();
    
    res.status(200).json({
      success: true,
      message: 'Active consultant experts retrieved successfully',
      count: consultantExperts.length,
      data: consultantExperts
    });
  } catch (error) {
    console.error('Error getting active consultant experts:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving active consultant experts',
      error: error.message
    });
  }
};

// Get consultant expert by ID
const getConsultantExpertById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const consultantExpert = await ConsultantExpert.findById(id);
    
    if (!consultantExpert) {
      return res.status(404).json({
        success: false,
        message: 'Consultant expert not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Consultant expert retrieved successfully',
      data: consultantExpert
    });
  } catch (error) {
    console.error('Error getting consultant expert by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving consultant expert',
      error: error.message
    });
  }
};

// Update consultant expert
const updateConsultantExpert = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, shortDesc, longDesc, expertise, image, isActive } = req.body;

    const consultantExpert = await ConsultantExpert.findById(id);
    
    if (!consultantExpert) {
      return res.status(404).json({
        success: false,
        message: 'Consultant expert not found'
      });
    }

    // Update fields if provided
    if (name !== undefined) consultantExpert.name = name;
    if (shortDesc !== undefined) consultantExpert.shortDesc = shortDesc;
    if (longDesc !== undefined) consultantExpert.longDesc = longDesc;
    if (expertise !== undefined) {
      if (!Array.isArray(expertise) || expertise.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Expertise must be a non-empty array'
        });
      }
      consultantExpert.expertise = expertise;
    }
    if (image !== undefined) consultantExpert.image = image;
    if (isActive !== undefined) consultantExpert.isActive = isActive;

    await consultantExpert.save();

    res.status(200).json({
      success: true,
      message: 'Consultant expert updated successfully',
      data: consultantExpert
    });
  } catch (error) {
    console.error('Error updating consultant expert:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating consultant expert',
      error: error.message
    });
  }
};

// Delete consultant expert
const deleteConsultantExpert = async (req, res) => {
  try {
    const { id } = req.params;
    
    const consultantExpert = await ConsultantExpert.findByIdAndDelete(id);
    
    if (!consultantExpert) {
      return res.status(404).json({
        success: false,
        message: 'Consultant expert not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Consultant expert deleted successfully',
      data: consultantExpert
    });
  } catch (error) {
    console.error('Error deleting consultant expert:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting consultant expert',
      error: error.message
    });
  }
};

module.exports = {
  createConsultantExpert,
  getAllConsultantExperts,
  getActiveConsultantExperts,
  getConsultantExpertById,
  updateConsultantExpert,
  deleteConsultantExpert
};
