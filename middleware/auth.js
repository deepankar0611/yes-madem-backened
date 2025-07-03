const { verifyToken, extractTokenFromHeader } = require('../utils/jwtUtils');
const User = require('../models/User');

/**
 * Middleware to authenticate user via JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    // Find user and check if still exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
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

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error.',
      error: error.message
    });
  }
};

/**
 * Middleware to check if user is verified
 */
const requireVerification = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Account not verified. Please verify your account first.'
    });
  }
  next();
};

/**
 * Middleware to rate limit OTP requests
 */
const rateLimitOTP = (req, res, next) => {
  // This is a simple in-memory rate limiting
  // In production, use Redis or a proper rate limiting library
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!req.app.locals.otpAttempts) {
    req.app.locals.otpAttempts = {};
  }
  
  if (!req.app.locals.otpAttempts[clientIP]) {
    req.app.locals.otpAttempts[clientIP] = { count: 0, lastAttempt: 0 };
  }
  
  const attempts = req.app.locals.otpAttempts[clientIP];
  
  // Reset counter if more than 1 hour has passed
  if (now - attempts.lastAttempt > 60 * 60 * 1000) {
    attempts.count = 0;
  }
  
  // Allow max 5 OTP requests per hour
  if (attempts.count >= 5) {
    return res.status(429).json({
      success: false,
      message: 'Too many OTP requests. Please try again later.'
    });
  }
  
  attempts.count++;
  attempts.lastAttempt = now;
  
  next();
};

module.exports = {
  authenticate,
  requireVerification,
  rateLimitOTP
}; 