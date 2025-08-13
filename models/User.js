const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allow multiple null values
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
  },
  password: {
    type: String,
    select: false, // Don't include password in queries by default
    minlength: [6, 'Password must be at least 6 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  addresses: [
    {
      label: { type: String },
      addressLine: { type: String, required: true },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password (only if password exists)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update timestamp
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate OTP (using static OTP for testing)
userSchema.methods.generateOTP = function() {
  const otpExpiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;
  
  // Use static OTP instead of random generation
  const staticOTP = process.env.STATIC_OTP || '123456'; // Default static OTP: 123456
  
  // Set expiry time
  const expiresAt = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);
  
  this.otp = {
    code: staticOTP,
    expiresAt: expiresAt
  };
  
  return staticOTP;
};

// Instance method to verify OTP
userSchema.methods.verifyOTP = function(otp) {
  if (!this.otp || !this.otp.code || !this.otp.expiresAt) {
    return false;
  }
  
  // Check if OTP is expired
  if (new Date() > this.otp.expiresAt) {
    this.otp = undefined;
    return false;
  }
  
  // Check if OTP matches
  if (this.otp.code !== otp) {
    return false;
  }
  
  // Clear OTP after successful verification
  this.otp = undefined;
  this.isVerified = true;
  
  return true;
};

// Instance method to handle failed login attempts
userSchema.methods.handleFailedLogin = function() {
  this.loginAttempts += 1;
  
  // Lock account after 5 failed attempts for 30 minutes
  if (this.loginAttempts >= 5 && !this.isLocked) {
    this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  }
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  this.lastLogin = new Date();
};

// Static method to find user by phone number
userSchema.statics.findByPhone = function(phoneNumber) {
  return this.findOne({ phoneNumber });
};

// Static method to find user by email or phone (for backward compatibility)
userSchema.statics.findByEmailOrPhone = function(emailOrPhone) {
  return this.findOne({
    $or: [
      { email: emailOrPhone },
      { phoneNumber: emailOrPhone }
    ]
  });
};

module.exports = mongoose.model('User', userSchema); 