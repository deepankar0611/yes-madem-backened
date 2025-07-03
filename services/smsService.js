const http = require('http');
const https = require('https');

class SMSService {
  constructor() {
    this.authKey = process.env.SMS_AUTH_KEY;
    this.hostname = process.env.SMS_HOSTNAME;
    this.path = process.env.SMS_PATH;
  }

  /**
   * Send OTP SMS to the given phone number
   * @param {string} phoneNumber - The phone number to send OTP to
   * @param {string} otp - The OTP code to send
   * @param {string} message - Custom message (optional)
   * @returns {Promise<Object>} - Response from SMS service
   */
  async sendOTP(phoneNumber, otp, message = null) {
    try {
      const defaultMessage = `Your OTP is: ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES} minutes.`;
      const finalMessage = message || defaultMessage;

      const postData = JSON.stringify({
        authKey: this.authKey,
        mobileNumbers: phoneNumber,
        message: finalMessage,
        sender: 'OTPSMS',
        route: '4' // Transactional route
      });

      console.log('📱 SMS Request Details:');
      console.log(`   Hostname: ${this.hostname}`);
      console.log(`   Path: ${this.path}`);
      console.log(`   Auth Key: ${this.authKey ? 'Set' : 'Not set'}`);
      console.log(`   Phone: ${phoneNumber}`);
      console.log(`   Message: ${finalMessage}`);
      console.log(`   Post Data: ${postData}`);

      const options = {
        method: 'POST',
        hostname: this.hostname,
        path: this.path,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'Cache-Control': 'no-cache'
        }
      };

      return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          let data = '';

          console.log(`📡 HTTP Response Status: ${res.statusCode}`);

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            console.log(`📡 Response Data: ${data}`);
            
            try {
              const response = JSON.parse(data);
              const result = {
                success: res.statusCode === 200,
                statusCode: res.statusCode,
                data: response
              };
              
              console.log(`✅ SMS Result: ${JSON.stringify(result, null, 2)}`);
              resolve(result);
            } catch (error) {
              const result = {
                success: false,
                statusCode: res.statusCode,
                data: data,
                error: 'Invalid JSON response'
              };
              
              console.log(`❌ SMS Error: ${JSON.stringify(result, null, 2)}`);
              resolve(result);
            }
          });
        });

        req.on('error', (error) => {
          console.log(`❌ Request Error: ${error.message}`);
          reject({
            success: false,
            error: error.message
          });
        });

        req.on('timeout', () => {
          console.log('❌ Request Timeout');
          req.destroy();
          reject({
            success: false,
            error: 'Request timeout'
          });
        });

        // Set timeout
        req.setTimeout(10000); // 10 seconds

        req.write(postData);
        req.end();
      });

    } catch (error) {
      console.log(`❌ SMS Service Error: ${error.message}`);
      throw new Error(`SMS sending failed: ${error.message}`);
    }
  }

  /**
   * Send custom SMS message
   * @param {string} phoneNumber - The phone number to send SMS to
   * @param {string} message - The message to send
   * @returns {Promise<Object>} - Response from SMS service
   */
  async sendCustomSMS(phoneNumber, message) {
    return this.sendOTP(phoneNumber, '', message);
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
   * Test SMS service connection
   * @returns {Promise<Object>} - Test result
   */
  async testConnection() {
    try {
      console.log('🧪 Testing SMS Service Connection...');
      
      const testData = JSON.stringify({
        authKey: this.authKey,
        mobileNumbers: '9876543210',
        message: 'Test message',
        sender: 'TEST',
        route: '4'
      });

      const options = {
        method: 'POST',
        hostname: this.hostname,
        path: this.path,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(testData)
        }
      };

      return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            resolve({
              success: true,
              statusCode: res.statusCode,
              data: data
            });
          });
        });

        req.on('error', (error) => {
          reject({
            success: false,
            error: error.message
          });
        });

        req.write(testData);
        req.end();
      });
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
module.exports = new SMSService(); 