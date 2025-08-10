const mongoose = require('mongoose');

const consultantBannerSchema = new mongoose.Schema({
  position: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 4,
    enum: [1, 2, 3, 4]
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    required: true
  },
  linkUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
consultantBannerSchema.index({ position: 1 });
consultantBannerSchema.index({ isActive: 1 });
consultantBannerSchema.index({ order: 1 });

// Pre-save middleware to update timestamp
consultantBannerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get active consultant banners ordered by position
consultantBannerSchema.statics.getActiveConsultantBanners = function() {
  return this.find({ isActive: true }).sort({ order: 1, position: 1 });
};

// Static method to get consultant banner by position
consultantBannerSchema.statics.getByPosition = function(position) {
  return this.findOne({ position, isActive: true });
};

module.exports = mongoose.model('ConsultantBanner', consultantBannerSchema);
