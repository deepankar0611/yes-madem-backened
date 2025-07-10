const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String // URL or path
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true
  },
  keyIngredients: [
    {
      name: String,
      description: String,
      imageUrl: String
    }
  ],
  benefits: [String],
  procedure: [
    {
      title: String,
      description: String,
      imageUrl: String
    }
  ],
  precautionsAndAftercare: [String],
  thingsToKnow: [String],
  faqs: [
    {
      question: String,
      answer: String
    }
  ],
  isDiscounted: {
    type: Boolean,
    default: false
  },
  discountPrice: {
    type: Number
  },
  isPackageOption: {
    type: Boolean,
    default: false
  },
  isWeekdayOffer: {
    type: Boolean,
    default: false
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

serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Service', serviceSchema); 