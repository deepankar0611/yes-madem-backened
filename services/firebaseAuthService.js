const admin = require('firebase-admin');
const path = require('path');

class FirebaseAuthService {
  constructor() {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      const serviceAccountPath = path.join(__dirname, '..', 'glamedge-a79d7-firebase-adminsdk-fbsvc-33f2574b7f.json');
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
        projectId: 'glamedge-a79d7'
      });
    }
    
    this.auth = admin.auth();
  }

  /**
   * Verify Firebase ID token
   * @param {string} idToken - Firebase ID token
   * @returns {Promise<Object>} - Decoded token payload
   */
  async verifyIdToken(idToken) {
    try {
      const decodedToken = await this.auth.verifyIdToken(idToken);
      return {
        success: true,
        data: decodedToken
      };
    } catch (error) {
      console.error('Firebase token verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user by Firebase UID
   * @param {string} uid - Firebase user UID
   * @returns {Promise<Object>} - Firebase user record
   */
  async getUserByUid(uid) {
    try {
      const userRecord = await this.auth.getUser(uid);
      return {
        success: true,
        data: userRecord
      };
    } catch (error) {
      console.error('Firebase get user error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create custom token for testing (if needed)
   * @param {string} uid - Firebase user UID
   * @param {Object} additionalClaims - Additional claims
   * @returns {Promise<Object>} - Custom token
   */
  async createCustomToken(uid, additionalClaims = {}) {
    try {
      const customToken = await this.auth.createCustomToken(uid, additionalClaims);
      return {
        success: true,
        data: { customToken }
      };
    } catch (error) {
      console.error('Firebase custom token creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validate phone number format
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} - Whether the phone number is valid
   */
  validatePhoneNumber(phoneNumber) {
    // Basic validation for Indian phone numbers
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  }

  /**
   * Test Firebase service connection
   * @returns {Promise<Object>} - Test result
   */
  async testConnection() {
    try {
      console.log('🧪 Testing Firebase Service Connection...');
      
      // Try to list users (limited to 1 to test connection)
      const listUsersResult = await this.auth.listUsers(1);
      
      return {
        success: true,
        message: 'Firebase connection successful',
        data: {
          totalUsers: listUsersResult.users.length,
          projectId: this.auth.app.options.projectId
        }
      };
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
module.exports = new FirebaseAuthService();
