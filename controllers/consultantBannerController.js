const ConsultantBanner = require('../models/ConsultantBanner');

/**
 * Create a new consultant banner
 * POST /api/consultant-banners
 */
const createConsultantBanner = async (req, res) => {
  try {
    const { position, title, description, imageUrl, linkUrl, isActive, order } = req.body;

    // Validate required fields
    if (!position || !title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Position, title, and imageUrl are required'
      });
    }

    // Check if position is valid (1-4)
    if (position < 1 || position > 4) {
      return res.status(400).json({
        success: false,
        message: 'Position must be between 1 and 4'
      });
    }

    // Check if banner already exists at this position
    const existingBanner = await ConsultantBanner.findOne({ position });
    if (existingBanner) {
      return res.status(400).json({
        success: false,
        message: `Consultant banner already exists at position ${position}`
      });
    }

    // Create new consultant banner
    const banner = new ConsultantBanner({
      position,
      title,
      description,
      imageUrl,
      linkUrl,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    await banner.save();

    res.status(201).json({
      success: true,
      message: 'Consultant banner created successfully',
      data: banner
    });

  } catch (error) {
    console.error('Create consultant banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create consultant banner',
      error: error.message
    });
  }
};

/**
 * Get all consultant banners (admin)
 * GET /api/consultant-banners
 */
const getAllConsultantBanners = async (req, res) => {
  try {
    const banners = await ConsultantBanner.find().sort({ order: 1, position: 1 });
    
    res.json({
      success: true,
      message: 'Consultant banners retrieved successfully',
      data: banners
    });

  } catch (error) {
    console.error('Get all consultant banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get consultant banners',
      error: error.message
    });
  }
};

/**
 * Get active consultant banners (public)
 * GET /api/consultant-banners/active
 */
const getActiveConsultantBanners = async (req, res) => {
  try {
    const banners = await ConsultantBanner.getActiveConsultantBanners();
    
    res.json({
      success: true,
      message: 'Active consultant banners retrieved successfully',
      data: banners
    });

  } catch (error) {
    console.error('Get active consultant banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get consultant banners',
      error: error.message
    });
  }
};

/**
 * Get consultant banner by position (public)
 * GET /api/consultant-banners/position/:position
 */
const getConsultantBannerByPosition = async (req, res) => {
  try {
    const { position } = req.params;
    const positionNum = parseInt(position);

    // Validate position
    if (positionNum < 1 || positionNum > 4) {
      return res.status(400).json({
        success: false,
        message: 'Position must be between 1 and 4'
      });
    }

    const banner = await ConsultantBanner.getByPosition(positionNum);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: `No active consultant banner found at position ${position}`
      });
    }

    res.json({
      success: true,
      message: 'Consultant banner retrieved successfully',
      data: banner
    });

  } catch (error) {
    console.error('Get consultant banner by position error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get consultant banner',
      error: error.message
    });
  }
};

/**
 * Get consultant banner by ID
 * GET /api/consultant-banners/:id
 */
const getConsultantBannerById = async (req, res) => {
  try {
    const banner = await ConsultantBanner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Consultant banner not found'
      });
    }

    res.json({
      success: true,
      message: 'Consultant banner retrieved successfully',
      data: banner
    });

  } catch (error) {
    console.error('Get consultant banner by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get consultant banner',
      error: error.message
    });
  }
};

/**
 * Update consultant banner
 * PUT /api/consultant-banners/:id
 */
const updateConsultantBanner = async (req, res) => {
  try {
    const { title, description, imageUrl, linkUrl, isActive, order } = req.body;
    
    const banner = await ConsultantBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Consultant banner not found'
      });
    }

    // Update fields
    if (title !== undefined) banner.title = title;
    if (description !== undefined) banner.description = description;
    if (imageUrl !== undefined) banner.imageUrl = imageUrl;
    if (linkUrl !== undefined) banner.linkUrl = linkUrl;
    if (isActive !== undefined) banner.isActive = isActive;
    if (order !== undefined) banner.order = order;

    await banner.save();

    res.json({
      success: true,
      message: 'Consultant banner updated successfully',
      data: banner
    });

  } catch (error) {
    console.error('Update consultant banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update consultant banner',
      error: error.message
    });
  }
};

/**
 * Delete consultant banner
 * DELETE /api/consultant-banners/:id
 */
const deleteConsultantBanner = async (req, res) => {
  try {
    const banner = await ConsultantBanner.findByIdAndDelete(req.params.id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Consultant banner not found'
      });
    }

    res.json({
      success: true,
      message: 'Consultant banner deleted successfully'
    });

  } catch (error) {
    console.error('Delete consultant banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete consultant banner',
      error: error.message
    });
  }
};

/**
 * Update consultant banner position
 * PUT /api/consultant-banners/:id/position
 */
const updateConsultantBannerPosition = async (req, res) => {
  try {
    const { position } = req.body;
    
    if (!position || position < 1 || position > 4) {
      return res.status(400).json({
        success: false,
        message: 'Position must be between 1 and 4'
      });
    }

    const banner = await ConsultantBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Consultant banner not found'
      });
    }

    // Check if another banner exists at the new position
    const existingBanner = await ConsultantBanner.findOne({ position, _id: { $ne: req.params.id } });
    if (existingBanner) {
      return res.status(400).json({
        success: false,
        message: `Consultant banner already exists at position ${position}`
      });
    }

    banner.position = position;
    await banner.save();

    res.json({
      success: true,
      message: 'Consultant banner position updated successfully',
      data: banner
    });

  } catch (error) {
    console.error('Update consultant banner position error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update consultant banner position',
      error: error.message
    });
  }
};

module.exports = {
  createConsultantBanner,
  getAllConsultantBanners,
  getActiveConsultantBanners,
  getConsultantBannerByPosition,
  getConsultantBannerById,
  updateConsultantBanner,
  deleteConsultantBanner,
  updateConsultantBannerPosition
};
