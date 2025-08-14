const express = require('express');
const multer = require('multer');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage (for Cloudinary uploads)
const upload = multer({ 
  storage: multer.memoryStorage(), // Store in memory for Cloudinary upload
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Log file details for debugging
    console.log('File upload attempt:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Check if it's an image by MIME type
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      console.log('File accepted by MIME type:', file.originalname);
      cb(null, true);
      return;
    }
    
    // Fallback: Check file extension for common image formats
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (allowedExtensions.includes(fileExtension)) {
      console.log('File accepted by extension:', file.originalname, 'Extension:', fileExtension);
      cb(null, true);
      return;
    }
    
    // If MIME type is octet-stream but has image extension, accept it
    if (file.mimetype === 'application/octet-stream' && allowedExtensions.includes(fileExtension)) {
      console.log('File accepted (octet-stream with image extension):', file.originalname);
      cb(null, true);
      return;
    }
    
    console.log('File rejected:', file.originalname, 'MIME type:', file.mimetype, 'Extension:', fileExtension);
    cb(new Error(`Only image files are allowed! Received: ${file.mimetype || 'unknown'} with extension: ${fileExtension}`), false);
  }
});

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-login', authController.verifyLogin);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/upload-profile-picture', authenticate, upload.single('profilePicture'), (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
  } else if (err) {
    // Provide more helpful error messages
    let errorMessage = err.message;
    if (err.message.includes('Only image files are allowed')) {
      errorMessage = 'Please upload a valid image file (JPG, PNG, GIF, BMP, or WebP). The file must have a proper image extension.';
    }
    
    return res.status(400).json({
      success: false,
      message: errorMessage,
      details: {
        error: err.message,
        supportedFormats: ['JPG', 'JPEG', 'PNG', 'GIF', 'BMP', 'WebP'],
        maxSize: '5MB'
      }
    });
  }
  next();
}, authController.uploadProfilePicture);
router.delete('/profile-picture', authenticate, authController.deleteProfilePictureEndpoint);
router.post('/address', authenticate, authController.saveAddress);
router.get('/address', authenticate, authController.getAddresses);

module.exports = router; 