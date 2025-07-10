const Service = require('../models/Service');

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
      isWeekdayOffer
    } = req.body;
    if (!name || price == null || !subCategoryId) {
      return res.status(400).json({ success: false, message: 'Name, price, and subCategoryId are required' });
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
      isWeekdayOffer
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
    if (subCategoryId) service.subCategoryId = subCategoryId;
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

module.exports = {
  getAllServices,
  getServiceById,
  addService,
  updateService,
  deleteService
}; 