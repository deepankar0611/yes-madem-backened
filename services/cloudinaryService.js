const cloudinary = require('cloudinary').v2;

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'NEXT_PUBLIC_CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set. Cloudinary uploads may fail.`);
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Log configuration (without exposing secrets)
console.log('☁️ Cloudinary Configuration:', {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing',
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing'
});

/**
 * Upload file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} mimetype - MIME type of the file
 * @param {string} folder - Folder name in Cloudinary (optional)
 * @returns {Promise<Object>} Upload result with URL and public_id
 */
const uploadToCloudinary = async (fileBuffer, mimetype, folder = 'profile-pictures') => {
  try {
    // Log upload attempt
    console.log('🔄 Cloudinary upload attempt:', {
      bufferSize: fileBuffer.length,
      mimetype: mimetype,
      folder: folder
    });
    
    // Convert buffer to base64 string
    const b64 = Buffer.from(fileBuffer).toString('base64');
    const dataURI = `data:${mimetype};base64,${b64}`;
    
    console.log('📤 Uploading to Cloudinary with data URI length:', dataURI.length);
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} public_id - Public ID of the file to delete
 * @returns {Promise<Object>} Deletion result
 */
const deleteFromCloudinary = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return {
      success: true,
      result: result
    };
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update existing image in Cloudinary
 * @param {string} public_id - Public ID of the existing image
 * @param {Buffer} newFileBuffer - New file buffer
 * @returns {Promise<Object>} Update result
 */
const updateInCloudinary = async (public_id, newFileBuffer) => {
  try {
    // First delete the old image
    await deleteFromCloudinary(public_id);
    
    // Then upload the new one
    const uploadResult = await uploadToCloudinary(newFileBuffer);
    
    return uploadResult;
  } catch (error) {
    console.error('Cloudinary update error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  updateInCloudinary
};
