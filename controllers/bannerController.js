const Banner = require('../models/Banner');

/**
 * Create a new banner
 * POST /api/banners
 */
const createBanner = async (req, res) => {
  try {
    const { position, title, description, imageUrl, linkUrl, isActive, order } = req.body;

    // Validate required fields
    if (!position || !title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Position, title, and imageUrl are required'
      });
    }

    // Check if position is valid (1-5)
    if (position < 1 || position > 5) {
      return res.status(400).json({
        success: false,
        message: 'Position must be between 1 and 5'
      });
    }

    // Check if banner already exists at this position
    const existingBanner = await Banner.findOne({ position });
    if (existingBanner) {
      return res.status(400).json({
        success: false,
        message: `Banner already exists at position ${position}`
      });
    }

    // Create new banner
    const banner = new Banner({
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
      message: 'Banner created successfully',
      data: banner
    });

  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create banner',
      error: error.message
    });
  }
};

/**
 * Get all banners (admin)
 * GET /api/banners
 */
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, position: 1 });
    
    res.json({
      success: true,
      message: 'Banners retrieved successfully',
      data: banners
    });

  } catch (error) {
    console.error('Get all banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get banners',
      error: error.message
    });
  }
};

/**
 * Get active banners (public)
 * GET /api/banners/active
 */
const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.getActiveBanners();
    
    res.json({
      success: true,
      message: 'Active banners retrieved successfully',
      data: banners
    });

  } catch (error) {
    console.error('Get active banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get active banners',
      error: error.message
    });
  }
};

/**
 * Get banner by position (public)
 * GET /api/banners/position/:position
 */
const getBannerByPosition = async (req, res) => {
  try {
    const { position } = req.params;
    const positionNum = parseInt(position);

    // Validate position
    if (positionNum < 1 || positionNum > 5) {
      return res.status(400).json({
        success: false,
        message: 'Position must be between 1 and 5'
      });
    }

    const banner = await Banner.getByPosition(positionNum);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: `No active banner found at position ${position}`
      });
    }

    res.json({
      success: true,
      message: 'Banner retrieved successfully',
      data: banner
    });

  } catch (error) {
    console.error('Get banner by position error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get banner',
      error: error.message
    });
  }
};

/**
 * Get banner by ID
 * GET /api/banners/:id
 */
const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.json({
      success: true,
      message: 'Banner retrieved successfully',
      data: banner
    });

  } catch (error) {
    console.error('Get banner by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get banner',
      error: error.message
    });
  }
};

/**
 * Update banner
 * PUT /api/banners/:id
 */
const updateBanner = async (req, res) => {
  try {
    const { title, description, imageUrl, linkUrl, isActive, order } = req.body;
    
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
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
      message: 'Banner updated successfully',
      data: banner
    });

  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update banner',
      error: error.message
    });
  }
};

/**
 * Delete banner
 * DELETE /api/banners/:id
 */
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.json({
      success: true,
      message: 'Banner deleted successfully'
    });

  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete banner',
      error: error.message
    });
  }
};

/**
 * Update banner position
 * PUT /api/banners/:id/position
 */
const updateBannerPosition = async (req, res) => {
  try {
    const { position } = req.body;
    
    if (!position || position < 1 || position > 5) {
      return res.status(400).json({
        success: false,
        message: 'Position must be between 1 and 5'
      });
    }

    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    // Check if another banner exists at the new position
    const existingBanner = await Banner.findOne({ position, _id: { $ne: req.params.id } });
    if (existingBanner) {
      return res.status(400).json({
        success: false,
        message: `Banner already exists at position ${position}`
      });
    }

    banner.position = position;
    await banner.save();

    res.json({
      success: true,
      message: 'Banner position updated successfully',
      data: banner
    });

  } catch (error) {
    console.error('Update banner position error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update banner position',
      error: error.message
    });
  }
};

module.exports = {
  createBanner,
  getAllBanners,
  getActiveBanners,
  getBannerByPosition,
  getBannerById,
  updateBanner,
  deleteBanner,
  updateBannerPosition
}; 