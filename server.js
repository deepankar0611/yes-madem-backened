const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config({ path: './config.env' });

// Import routes and config
const authRoutes = require('./routes/auth');
const { connectDB } = require('./config/database');
const User = require('./models/User');
const mainCategoryRoutes = require('./routes/mainCategory');
const subCategoryRoutes = require('./routes/subCategory');
const serviceRoutes = require('./routes/service');
const bannerRoutes = require('./routes/banner');
const consultantBannerRoutes = require('./routes/consultantBanner');
const consultantExpertRoutes = require('./routes/consultantExpert');

const app = express();

// Connect to database
connectDB();

// Seed default admin user if not present
(async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const adminData = {
        name: 'Default Admin',
        email: 'admin@yesmadam.com',
        phoneNumber: '9999999999',
        password: 'admin123', // Change after first login
        isVerified: true,
        role: 'admin',
      };
      await User.create(adminData);
      console.log('Default admin user created:', adminData.email, adminData.phoneNumber);
    } else {
      console.log('Admin user already exists.');
    }
  } catch (err) {
    console.error('Error seeding admin user:', err);
  }
})();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: '*',
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));



// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);
app.use('/api/main-categories', mainCategoryRoutes);
app.use('/api/sub-categories', subCategoryRoutes);
app.use('/api/services', serviceRoutes);

// Banner routes
app.use('/api/banners', bannerRoutes);

// Consultant banner routes
app.use('/api/consultant-banners', consultantBannerRoutes);

// Consultant expert routes
app.use('/api/consultant-experts', consultantExpertRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app; 