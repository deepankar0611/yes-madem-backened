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
  originalPrice: {
    type: Number
  },
  offerTags: [String], // e.g., ["50% OFF", "NEW LAUNCH"]
  duration: {
    type: String // e.g., "1 hr 15 mins"
  },
  includedItems: [String], // e.g., ["Free Silicone Facial Brush"]
  popularity: {
    type: String // e.g., "25K+ people booked this in last 30 days"
  },
  isNewLaunch: {
    type: Boolean,
    default: false
  },
  categoryTags: [String], // e.g., ["Top Selling", "Premium Facial", "Classic Facial"]
  isTrendingNearYou: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isLastMinuteAddon: {
    type: Boolean,
    default: false
  },
  isPeopleAlsoAvailed: {
    type: Boolean,
    default: false
  },
  isSpaRetreatForWomen: {
    type: Boolean,
    default: false
  },
  isWhatsNew: {
    type: Boolean,
    default: false
  },
  addOns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    }
  ], // references to other services as add-ons
  bundledOffers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    }
  ], // references to other services as bundles
  brand: {
    type: String // e.g., "ORGANICA DA ROMA"
  },
  professionalTypes: [String], // e.g., ["Standard", "Gold"]
  serviceCharge: {
    type: Number
  },
  productCost: {
    type: Number
  },
  disposableCost: {
    type: Number
  },
  relatedServices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    }
  ],
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