const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  professionalType: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  address: { type: String, required: true },
  items: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  status: { type: String, default: 'pending' },
  otp: {
    code: String,
    expiresAt: Date
  },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema); 