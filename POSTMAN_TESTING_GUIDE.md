# 🧪 Postman Testing Guide for Phone-Only Login OTP System

## 📋 Prerequisites

1. **Start the server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:3000`

2. **Import the Postman Collection:**
   - Open Postman
   - Click "Import" 
   - Select the `postman-collection.json` file
   - Or manually create requests using the details below

## 🔧 Setup Postman Environment Variables

1. **Create Environment Variables:**
   - Click the "Environment" dropdown in Postman
   - Click "Add" to create a new environment
   - Add these variables:
     - `baseUrl`: `http://localhost:3000`
     - `authToken`: (leave empty for now)

2. **Select the Environment:**
   - Choose your created environment from the dropdown

## 📝 Step-by-Step Testing Guide

### **Step 1: Health Check**
**Request:** `GET {{baseUrl}}/health`

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2023-07-20T10:30:00.000Z",
  "environment": "development"
}
```

---

### **Step 2: Register a New User (Phone Only)**
**Request:** `POST {{baseUrl}}/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "John Doe",
  "phoneNumber": "9876543210"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully. OTP sent to your phone number.",
  "data": {
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "phoneNumber": "9876543210",
    "name": "John Doe",
    "otp": "123456",
    "otpExpiresAt": "2023-07-20T10:35:00.000Z"
  }
}
```

**Notes:**
- Only name and phone number are required
- Email and password are optional
- **OTP is returned in the response for testing purposes**
- Copy the `otp` value for the next step
- Check your phone for the OTP (if SMS service is working)
- If SMS fails, you'll get a message about contacting support
- The user is created but not verified yet

---

### **Step 3: Login User (Phone Only)**
**Request:** `POST {{baseUrl}}/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "phoneNumber": "9876543210"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent to your phone number for login.",
  "data": {
    "phoneNumber": "9876543210",
    "name": "John Doe",
    "otp": "789012",
    "otpExpiresAt": "2023-07-20T10:40:00.000Z"
  }
}
```

**Notes:**
- Only phone number is required for login
- OTP will be sent to the phone number
- **OTP is returned in the response for testing purposes**
- Copy the `otp` value for the next step
- Check your phone for the OTP

---

### **Step 4: Verify Login OTP**
**Request:** `POST {{baseUrl}}/api/auth/verify-login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "phoneNumber": "9876543210",
  "otp": "789012"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": null,
      "phoneNumber": "9876543210",
      "isVerified": false
    }
  }
}
```

**Important:** Copy the `token` value and set it as the `authToken` environment variable in Postman.

---

### **Step 5: Send OTP (For Account Verification)**
**Request:** `POST {{baseUrl}}/api/auth/send-otp`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "phoneNumber": "9876543210"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to your phone number.",
  "data": {
    "otp": "345678",
    "otpExpiresAt": "2023-07-20T10:45:00.000Z"
  }
}
```

**Notes:**
- This is for account verification (different from login OTP)
- **OTP is returned in the response for testing purposes**
- Copy the `otp` value for the next step
- Check your phone for the new OTP
- You can also check the server console for the OTP (for testing purposes)

---

### **Step 6: Verify OTP (For Account Verification)**
**Request:** `POST {{baseUrl}}/api/auth/verify-otp`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "phoneNumber": "9876543210",
  "otp": "345678"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": null,
      "phoneNumber": "9876543210",
      "isVerified": true
    }
  }
}
```

**Important:** Update the `authToken` environment variable with the new token.

---

### **Step 7: Get User Profile (Protected Route)**
**Request:** `GET {{baseUrl}}/api/auth/profile`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": null,
      "phoneNumber": "9876543210",
      "isVerified": true,
      "createdAt": "2023-07-20T10:30:00.000Z",
      "updatedAt": "2023-07-20T10:30:00.000Z"
    }
  }
}
```

---

### **Step 8: Update User Profile (Protected Route)**
**Request:** `PUT {{baseUrl}}/api/auth/profile`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{authToken}}
```

**Body (raw JSON):**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Smith",
      "email": "johnsmith@example.com",
      "phoneNumber": "9876543210",
      "isVerified": true
    }
  }
}
```

---

## 🚨 Error Testing Scenarios

### **Test 1: Register with Invalid Phone Number**
**Request:** `POST {{baseUrl}}/api/auth/register`

**Body:**
```json
{
  "name": "Test User",
  "phoneNumber": "12345"
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Please enter a valid 10-digit phone number."
}
```

### **Test 2: Login with Non-existent Phone Number**
**Request:** `POST {{baseUrl}}/api/auth/login`

**Body:**
```json
{
  "phoneNumber": "9999999999"
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "User not found with this phone number. Please register first."
}
```

### **Test 3: Verify Wrong Login OTP**
**Request:** `POST {{baseUrl}}/api/auth/verify-login`

**Body:**
```json
{
  "phoneNumber": "9876543210",
  "otp": "999999"
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid or expired OTP."
}
```

### **Test 4: Access Protected Route Without Token**
**Request:** `GET {{baseUrl}}/api/auth/profile`

**Headers:** (none)

**Expected Response:**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

---

## 🔄 Testing Flow Summary

1. **Health Check** → Verify server is running
2. **Register User** → Create account with phone only, get OTP from response
3. **Login User** → Request login OTP, get OTP from response
4. **Verify Login OTP** → Complete login, get token, set `authToken`
5. **Send OTP** → Request account verification, get OTP from response
6. **Verify OTP** → Complete verification, get new token, update `authToken`
7. **Get Profile** → Test protected route
8. **Update Profile** → Test profile modifications
9. **Error Tests** → Verify error handling

---

## 📱 OTP Testing Notes

### **For Development Testing:**
- **OTP is now returned in API responses** for easy testing
- Copy the `otp` value from the response and use it in the next request
- Check the server console for additional OTP logs
- OTP expires in 5 minutes (configurable)

### **For Production Testing:**
- Use a real phone number
- Check your phone for the SMS
- OTP expires in 5 minutes (configurable)

---

## 🔑 Key Differences from Previous Version

### **Registration:**
- ✅ **Before:** Required name, email, phone, password
- ✅ **Now:** Required name, phone only (email & password optional)

### **Login:**
- ✅ **Before:** Email/phone + password
- ✅ **Now:** Phone number only → OTP verification

### **New Endpoint:**
- ✅ **verify-login:** Complete login after OTP verification

### **OTP in Response:**
- ✅ **Now:** OTP is returned in API responses for testing
- ✅ **Before:** OTP was only sent via SMS

### **Authentication Flow:**
- ✅ **Before:** Register → Login (with password) → Send OTP → Verify OTP
- ✅ **Now:** Register → Login (phone only) → Verify Login OTP → Send OTP → Verify OTP

---

## 🛠️ Troubleshooting

### **Common Issues:**

1. **Server not starting:**
   - Check if MongoDB is running
   - Verify all dependencies are installed
   - Check the console for error messages

2. **Database connection failed:**
   - Ensure MongoDB is running on `mongodb://localhost:27017`
   - Check `config.env` file for correct `MONGODB_URI`

3. **SMS not working:**
   - Verify SMS credentials in `config.env`
   - Check server logs for SMS service errors
   - **OTP is now returned in API responses for testing**

4. **Token issues:**
   - Make sure to copy the full token from login/verify responses
   - Check if token is properly set in environment variables
   - Verify token format: `Bearer <token>`

5. **Rate limiting:**
   - If you get rate limit errors, wait for the time window to reset
   - Authentication: 5 attempts per 15 minutes
   - OTP requests: 3 attempts per hour

---

## 🎯 Success Criteria

✅ All requests return expected responses  
✅ Error scenarios work correctly  
✅ Protected routes require authentication  
✅ Phone-only login works  
✅ OTP verification works for both login and account verification  
✅ **OTP is returned in API responses for testing**  
✅ Profile updates are successful  
✅ Rate limiting is enforced  

---

## 📞 Support

If you encounter any issues:
1. Check the server console for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running
4. Check the README.md for additional documentation
5. **Use the OTP returned in API responses for testing** 