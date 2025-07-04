const User = require('../models/User');
const smsService = require('../services/smsService');
const { generateToken } = require('../utils/jwtUtils');
const LoginLog = require('../models/LoginLog');

/**
 * Register a new user with phone number only
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, phoneNumber, email, password } = req.body;

    // Validate phone number
    if (!smsService.validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number.'
      });
    }

    // Check if user already exists with this phone number
    const existingUser = await User.findByPhone(phoneNumber);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this phone number.'
      });
    }

    // Check if email is provided and if it's already taken
    if (email) {
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken by another user.'
        });
      }
    }

    // Create new user
    const userData = {
      name,
      phoneNumber
    };

    // Add email and password if provided
    if (email) userData.email = email;
    if (password) userData.password = password;

    const user = new User(userData);

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP via SMS
    try {
      const smsResponse = await smsService.sendOTP(phoneNumber, otp);
      
      if (!smsResponse.success) {
        console.error('SMS sending failed:', smsResponse);
        // Still save user but inform about SMS failure
        return res.status(201).json({
          success: true,
          message: 'User registered successfully. OTP could not be sent. Please contact support.',
          data: {
            userId: user._id,
            phoneNumber: user.phoneNumber,
            name: user.name,
            otp: otp, // Return OTP for testing
            otpExpiresAt: user.otp.expiresAt
          }
        });
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully. OTP sent to your phone number.',
        data: {
          userId: user._id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          otp: otp, // Return OTP for testing
          otpExpiresAt: user.otp.expiresAt
        }
      });

    } catch (smsError) {
      console.error('SMS service error:', smsError);
      res.status(201).json({
        success: true,
        message: 'User registered successfully. OTP could not be sent. Please contact support.',
        data: {
          userId: user._id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          otp: otp, // Return OTP for testing
          otpExpiresAt: user.otp.expiresAt
        }
      });
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed.',
      error: error.message
    });
  }
};

/**
 * Login user with phone number and OTP
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Validate phone number
    if (!smsService.validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number.'
      });
    }

    // Find user by phone number
    const user = await User.findByPhone(phoneNumber);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this phone number. Please register first.'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is locked due to multiple failed login attempts. Please try again later.'
      });
    }

    // Generate OTP for login
    const otp = user.generateOTP();
    await user.save();

    // Send OTP via SMS
    try {
      const smsResponse = await smsService.sendOTP(phoneNumber, otp);
      
      if (!smsResponse.success) {
        console.error('SMS sending failed:', smsResponse);
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP. Please try again.',
          data: {
            otp: otp, // Return OTP for testing
            otpExpiresAt: user.otp.expiresAt
          }
        });
      }

      // Save login log after successful OTP send (login attempt)
      const loginLog = new LoginLog({
        userId: user._id,
        ip: req.ip
      });
      await loginLog.save();

      res.json({
        success: true,
        message: 'OTP sent to your phone number for login.',
        data: {
          phoneNumber: user.phoneNumber,
          name: user.name,
          otp: otp, // Return OTP for testing
          otpExpiresAt: user.otp.expiresAt
        }
      });

    } catch (smsError) {
      console.error('SMS service error:', smsError);
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.',
        data: {
          otp: otp, // Return OTP for testing
          otpExpiresAt: user.otp.expiresAt
        }
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed.',
      error: error.message
    });
  }
};

/**
 * Verify OTP and complete login
 * POST /api/auth/verify-login
 */
const verifyLogin = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Find user by phone number
    const user = await User.findByPhone(phoneNumber);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is locked due to multiple failed login attempts. Please try again later.'
      });
    }

    // Verify OTP
    const isOTPValid = user.verifyOTP(otp);
    if (!isOTPValid) {
      user.handleFailedLogin();
      await user.save();
      
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP.'
      });
    }

    // Reset login attempts on successful verification
    user.resetLoginAttempts();
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isVerified: user.isVerified
        }
      }
    });

  } catch (error) {
    console.error('Verify login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login verification failed.',
      error: error.message
    });
  }
};

/**
 * Send OTP for verification
 * POST /api/auth/send-otp
 */
const sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Validate phone number
    if (!smsService.validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number.'
      });
    }

    // Find user
    const user = await User.findByPhone(phoneNumber);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this phone number.'
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User is already verified.'
      });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP via SMS
    try {
      const smsResponse = await smsService.sendOTP(phoneNumber, otp);
      
      if (!smsResponse.success) {
        console.error('SMS sending failed:', smsResponse);
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP. Please try again.',
          data: {
            otp: otp, // Return OTP for testing
            otpExpiresAt: user.otp.expiresAt
          }
        });
      }

      res.json({
        success: true,
        message: 'OTP sent successfully to your phone number.',
        data: {
          otp: otp, // Return OTP for testing
          otpExpiresAt: user.otp.expiresAt
        }
      });

    } catch (smsError) {
      console.error('SMS service error:', smsError);
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.',
        data: {
          otp: otp, // Return OTP for testing
          otpExpiresAt: user.otp.expiresAt
        }
      });
    }

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP.',
      error: error.message
    });
  }
};

/**
 * Verify OTP
 * POST /api/auth/verify-otp
 */
const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Find user
    const user = await User.findByPhone(phoneNumber);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User is already verified.'
      });
    }

    // Verify OTP
    const isOTPValid = user.verifyOTP(otp);
    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP.'
      });
    }

    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'OTP verified successfully.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isVerified: user.isVerified
        }
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed.',
      error: error.message
    });
  }
};

/**
 * Get current user profile
 * GET /api/auth/profile
 */
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile.',
      error: error.message
    });
  }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = req.user;

    // Update fields
    if (name) user.name = name;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken by another user.'
        });
      }
      user.email = email;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          isVerified: user.isVerified
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  verifyLogin,
  sendOTP,
  verifyOTP,
  getProfile,
  updateProfile
}; 