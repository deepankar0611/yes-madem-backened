const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  position: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 10,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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
bannerSchema.index({ position: 1 });
bannerSchema.index({ isActive: 1 });
bannerSchema.index({ order: 1 });

// Pre-save middleware to update timestamp
bannerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get active banners ordered by position
bannerSchema.statics.getActiveBanners = function() {
  return this.find({ isActive: true }).sort({ order: 1, position: 1 });
};

// Static method to get banner by position
bannerSchema.statics.getByPosition = function(position) {
  return this.findOne({ position, isActive: true });
};

module.exports = mongoose.model('Banner', bannerSchema); 