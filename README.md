# Login System with OTP Authentication

A complete Node.js backend system for user authentication with OTP verification using SMS service.

## Features

- ✅ User registration with email and phone number
- ✅ OTP verification via SMS
- ✅ JWT-based authentication
- ✅ Account lockout protection
- ✅ Rate limiting for security
- ✅ Modular SMS service (easily changeable)
- ✅ MongoDB integration
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Comprehensive error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- SMS service credentials

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd login-otp-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp config.env.example config.env
   ```
   
   Edit `config.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/login_otp_system
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   SMS_AUTH_KEY=9f786dbbd85bc48d1790ba4116f28bbc
   SMS_HOSTNAME=msg.icloudsms.com
   SMS_PATH=/rest/services/sendSMS/sendGroupSms
   OTP_EXPIRY_MINUTES=5
   OTP_LENGTH=6
   ```

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "9876543210",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. OTP sent to your phone number.",
  "data": {
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "email": "john@example.com",
    "phoneNumber": "9876543210"
  }
}
```

#### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "emailOrPhone": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "9876543210",
      "isVerified": false
    }
  }
}
```

#### 3. Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "emailOrPhone": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to your phone number."
}
```

#### 4. Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "emailOrPhone": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "9876543210",
      "isVerified": true
    }
  }
}
```

### Protected Endpoints

#### 5. Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "9876543210",
      "isVerified": true,
      "createdAt": "2023-07-20T10:30:00.000Z",
      "updatedAt": "2023-07-20T10:30:00.000Z"
    }
  }
}
```

#### 6. Update User Profile
```http
PUT /api/auth/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3",
      "name": "John Smith",
      "email": "johnsmith@example.com",
      "phoneNumber": "9876543210",
      "isVerified": true
    }
  }
}
```

## SMS Service Configuration

The SMS service is modular and can be easily changed. The current implementation uses the provided SMS service configuration:

- **Auth Key**: `9f786dbbd85bc48d1790ba4116f28bbc`
- **Hostname**: `msg.icloudsms.com`
- **Path**: `/rest/services/sendSMS/sendGroupSms`

### Changing SMS Service Provider

To change the SMS service provider, modify the `services/smsService.js` file:

1. Update the constructor with new credentials
2. Modify the `sendOTP` method to match the new API format
3. Update the request payload structure
4. Adjust response handling

Example for a different SMS provider:
```javascript
// In services/smsService.js
constructor() {
  this.apiKey = process.env.NEW_SMS_API_KEY;
  this.endpoint = process.env.NEW_SMS_ENDPOINT;
}

async sendOTP(phoneNumber, otp, message = null) {
  // Implement new SMS service logic here
  const payload = {
    api_key: this.apiKey,
    to: phoneNumber,
    message: message || `Your OTP is: ${otp}`,
    from: 'YourApp'
  };
  
  // Make request to new SMS service
  // Handle response accordingly
}
```

## Security Features

- **Password Hashing**: Uses bcrypt with salt rounds of 12
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Prevents brute force attacks
- **Account Lockout**: Locks account after 5 failed login attempts
- **Input Validation**: Validates all user inputs
- **CORS Protection**: Configurable CORS settings
- **Helmet**: Security headers middleware

## Error Handling

The system includes comprehensive error handling:

- **Validation Errors**: Proper validation messages
- **Authentication Errors**: Clear authentication failure messages
- **SMS Service Errors**: Graceful handling of SMS failures
- **Database Errors**: Proper database error handling
- **Rate Limiting**: Clear rate limiting messages

## Rate Limiting

- **Global**: 100 requests per 15 minutes per IP
- **Authentication**: 5 attempts per 15 minutes per IP
- **OTP Requests**: 3 requests per hour per IP

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/login_otp_system |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h |
| `SMS_AUTH_KEY` | SMS service auth key | - |
| `SMS_HOSTNAME` | SMS service hostname | - |
| `SMS_PATH` | SMS service API path | - |
| `OTP_EXPIRY_MINUTES` | OTP expiration time | 5 |
| `OTP_LENGTH` | OTP code length | 6 |

## Testing

You can test the API using tools like Postman, curl, or any HTTP client.

### Example curl commands:

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phoneNumber":"9876543210","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"test@example.com","password":"password123"}'

# Send OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"test@example.com"}'

# Verify OTP
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"test@example.com","otp":"123456"}'
```

## Project Structure

```
login-otp-system/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── authController.js    # Authentication controller
├── middleware/
│   └── auth.js             # Authentication middleware
├── models/
│   └── User.js             # User model
├── routes/
│   └── auth.js             # Authentication routes
├── services/
│   └── smsService.js       # SMS service (modular)
├── utils/
│   └── jwtUtils.js         # JWT utilities
├── config.env              # Environment variables
├── package.json            # Dependencies
├── server.js               # Main server file
└── README.md               # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 