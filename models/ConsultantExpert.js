const mongoose = require('mongoose');

const consultantExpertSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  shortDesc: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  longDesc: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, 'Long description cannot exceed 1000 characters']
  },
  expertise: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one expertise area is required'
    }
  },
  image: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
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
consultantExpertSchema.index({ isActive: 1 });
consultantExpertSchema.index({ name: 1 });
consultantExpertSchema.index({ expertise: 1 });

// Pre-save middleware to update timestamp
consultantExpertSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get active consultant experts
consultantExpertSchema.statics.getActiveConsultantExperts = function() {
  return this.find({ isActive: true }).sort({ createdAt: -1 });
};

// Static method to get all consultant experts (for admin)
consultantExpertSchema.statics.getAllConsultantExperts = function() {
  return this.find().sort({ createdAt: -1 });
};

module.exports = mongoose.model('ConsultantExpert', consultantExpertSchema);
