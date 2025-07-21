const Service = require('../models/Service');
const mongoose = require('mongoose');

// Get all services (public)
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get services', error: error.message });
  }
};

// Get a single service by ID (public)
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get service', error: error.message });
  }
};

// Add a new service (admin only)
const addService = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      imageUrl,
      subCategoryId,
      keyIngredients,
      benefits,
      procedure,
      precautionsAndAftercare,
      thingsToKnow,
      faqs,
      isDiscounted,
      discountPrice,
      isPackageOption,
      isWeekdayOffer,
      originalPrice,
      offerTags,
      duration,
      includedItems,
      popularity,
      isNewLaunch,
      categoryTags,
      addOns,
      bundledOffers,
      brand,
      professionalTypes,
      serviceCharge,
      productCost,
      disposableCost,
      relatedServices
    } = req.body;
    if (!name || price == null || !subCategoryId) {
      return res.status(400).json({ success: false, message: 'Name, price, and subCategoryId are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
      return res.status(400).json({ success: false, message: 'Invalid subCategoryId. Must be a valid MongoDB ObjectId.' });
    }
    const service = new Service({
      name,
      price,
      description,
      imageUrl,
      subCategoryId,
      keyIngredients,
      benefits,
      procedure,
      precautionsAndAftercare,
      thingsToKnow,
      faqs,
      isDiscounted,
      discountPrice,
      isPackageOption,
      isWeekdayOffer,
      originalPrice,
      offerTags,
      duration,
      includedItems,
      popularity,
      isNewLaunch,
      categoryTags,
      addOns,
      bundledOffers,
      brand,
      professionalTypes,
      serviceCharge,
      productCost,
      disposableCost,
      relatedServices
    });
    await service.save();
    res.status(201).json({ success: true, message: 'Service added', service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add service', error: error.message });
  }
};

// Update a service (admin only)
const updateService = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      imageUrl,
      subCategoryId,
      keyIngredients,
      benefits,
      procedure,
      precautionsAndAftercare,
      thingsToKnow,
      faqs,
      isDiscounted,
      discountPrice,
      isPackageOption,
      isWeekdayOffer
    } = req.body;
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    if (name) service.name = name;
    if (price != null) service.price = price;
    if (description) service.description = description;
    if (imageUrl) service.imageUrl = imageUrl;
    if (subCategoryId) {
      if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
        return res.status(400).json({ success: false, message: 'Invalid subCategoryId. Must be a valid MongoDB ObjectId.' });
      }
      service.subCategoryId = subCategoryId;
    }
    if (keyIngredients) service.keyIngredients = keyIngredients;
    if (benefits) service.benefits = benefits;
    if (procedure) service.procedure = procedure;
    if (precautionsAndAftercare) service.precautionsAndAftercare = precautionsAndAftercare;
    if (thingsToKnow) service.thingsToKnow = thingsToKnow;
    if (faqs) service.faqs = faqs;
    if (isDiscounted !== undefined) service.isDiscounted = isDiscounted;
    if (discountPrice !== undefined) service.discountPrice = discountPrice;
    if (isPackageOption !== undefined) service.isPackageOption = isPackageOption;
    if (isWeekdayOffer !== undefined) service.isWeekdayOffer = isWeekdayOffer;
    await service.save();
    res.json({ success: true, message: 'Service updated', service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update service', error: error.message });
  }
};

// Delete a service (admin only)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete service', error: error.message });
  }
};

// Get all services by multiple subCategoryIds
const getServicesBySubCategoryIds = async (req, res) => {
  try {
    // Accept subCategoryIds from query (?ids=1,2,3) or body (POST)
    let subCategoryIds = req.query.ids || req.body.subCategoryIds;
    if (typeof subCategoryIds === 'string') {
      subCategoryIds = subCategoryIds.split(',');
    }
    if (!Array.isArray(subCategoryIds) || subCategoryIds.length === 0) {
      return res.status(400).json({ success: false, message: 'subCategoryIds are required' });
    }
    const services = await Service.find({ subCategoryId: { $in: subCategoryIds } });
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get services by subcategories', error: error.message });
  }
};

// Mark a service as Trending Near You
const addTrendingNearYou = async (req, res) => {
  try {
    const { serviceId } = req.body;
    if (!serviceId) {
      return res.status(400).json({ success: false, message: 'serviceId is required' });
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    service.isTrendingNearYou = true;
    await service.save();
    res.json({ success: true, message: 'Service marked as Trending Near You', service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark as Trending Near You', error: error.message });
  }
};

// Remove a service from Trending Near You
const removeTrendingNearYou = async (req, res) => {
  try {
    const { serviceId } = req.body;
    if (!serviceId) {
      return res.status(400).json({ success: false, message: 'serviceId is required' });
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    service.isTrendingNearYou = false;
    await service.save();
    res.json({ success: true, message: 'Service removed from Trending Near You', service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove from Trending Near You', error: error.message });
  }
};

// Mark a service as Best Seller
const addBestSeller = async (req, res) => {
  try {
    const { serviceId } = req.body;
    if (!serviceId) {
      return res.status(400).json({ success: false, message: 'serviceId is required' });
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    service.isBestSeller = true;
    await service.save();
    res.json({ success: true, message: 'Service marked as Best Seller', service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark as Best Seller', error: error.message });
  }
};

// Remove a service from Best Seller
const removeBestSeller = async (req, res) => {
  try {
    const { serviceId } = req.body;
    if (!serviceId) {
      return res.status(400).json({ success: false, message: 'serviceId is required' });
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    service.isBestSeller = false;
    await service.save();
    res.json({ success: true, message: 'Service removed from Best Seller', service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove from Best Seller', error: error.message });
  }
};

// Mark a service as Last Minute Addon
const addLastMinuteAddon = async (req, res) => {
  try {
    const { serviceId } = req.body;
    if (!serviceId) {
      return res.status(400).json({ success: false, message: 'serviceId is required' });
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    service.isLastMinuteAddon = true;
    await service.save();
    res.json({ success: true, message: 'Service marked as Last Minute Addon', service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark as Last Minute Addon', error: error.message });
  }
};

// Remove a service from Last Minute Addon
const removeLastMinuteAddon = async (req, res) => {
  try {
    const { serviceId } = req.body;
    if (!serviceId) {
      return res.status(400).json({ success: false, message: 'serviceId is required' });
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    service.isLastMinuteAddon = false;
    await service.save();
    res.json({ success: true, message: 'Service removed from Last Minute Addon', service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove from Last Minute Addon', error: error.message });
  }
};

// Mark a service as People Also Availed
const addPeopleAlsoAvailed = async (req, res) => {
  try {
    const { serviceId } = req.body;
    if (!serviceId) {
      return res.status(400).json({ success: false, message: 'serviceId is required' });
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    service.isPeopleAlsoAvailed = true;
    await service.save();
    res.json({ success: true, message: 'Service marked as People Also Availed', service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark as People Also Availed', error: error.message });
  }
};

// Remove a service from People Also Availed
const removePeopleAlsoAvailed = async (req, res) => {
  try {
    const { serviceId } = req.body;
    if (!serviceId) {
      return res.status(400).json({ success: false, message: 'serviceId is required' });
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    service.isPeopleAlsoAvailed = false;
    await service.save();
    res.json({ success: true, message: 'Service removed from People Also Availed', service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove from People Also Availed', error: error.message });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
  getServicesBySubCategoryIds,
  addTrendingNearYou,
  removeTrendingNearYou,
  addBestSeller,
  removeBestSeller,
  addLastMinuteAddon,
  removeLastMinuteAddon,
  addPeopleAlsoAvailed,
  removePeopleAlsoAvailed
}; 