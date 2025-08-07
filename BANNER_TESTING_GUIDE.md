# 🎯 Banner Testing Guide

## 📋 Prerequisites

1. **Start the server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:3000`

2. **Login as admin to get token:**
   - Use the existing admin user: `admin@yesmadam.com` / `admin123`
   - Or register a new user and update their role to 'admin' in the database

## 🔧 Setup Postman Environment Variables

1. **Create Environment Variables:**
   - `baseUrl`: `http://localhost:3000`
   - `authToken`: (set after admin login)

2. **Select the Environment:**
   - Choose your created environment from the dropdown

## 📝 Step-by-Step Testing Guide

### **Step 1: Login as Admin**
**Request:** `POST {{baseUrl}}/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "phoneNumber": "9999999999"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent to your phone number for login.",
  "data": {
    "phoneNumber": "9999999999",
    "name": "Default Admin",
    "otp": "123456",
    "otpExpiresAt": "2023-07-20T10:35:00.000Z"
  }
}
```

**Next:** Use the OTP to verify login and get the token.

---

### **Step 2: Verify Login OTP**
**Request:** `POST {{baseUrl}}/api/auth/verify-login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "phoneNumber": "9999999999",
  "otp": "123456"
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
      "name": "Default Admin",
      "email": "admin@yesmadam.com",
      "phoneNumber": "9999999999",
      "isVerified": true,
      "role": "admin"
    }
  }
}
```

**Important:** Copy the `token` value and set it as the `authToken` environment variable in Postman.

---

### **Step 3: Create Banner 1**
**Request:** `POST {{baseUrl}}/api/banners`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{authToken}}
```

**Body (raw JSON):**
```json
{
  "position": 1,
  "title": "Welcome to Yes Madem",
  "description": "Your beauty journey starts here",
  "imageUrl": "https://example.com/hero-banner.jpg",
  "linkUrl": "https://example.com/welcome",
  "isActive": true,
  "order": 1
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Banner created successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "position": 1,
    "title": "Welcome to Yes Madem",
    "description": "Your beauty journey starts here",
    "imageUrl": "https://example.com/hero-banner.jpg",
    "linkUrl": "https://example.com/welcome",
    "isActive": true,
    "order": 1,
    "createdAt": "2023-07-20T10:30:00.000Z",
    "updatedAt": "2023-07-20T10:30:00.000Z"
  }
}
```

---

### **Step 4: Create Banner 2**
**Request:** `POST {{baseUrl}}/api/banners`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{authToken}}
```

**Body (raw JSON):**
```json
{
  "position": 2,
  "title": "Summer Sale",
  "description": "Get 50% off on all facials",
  "imageUrl": "https://example.com/summer-sale.jpg",
  "linkUrl": "https://example.com/summer-sale",
  "isActive": true,
  "order": 2
}
```

---

### **Step 5: Create Banner 3**
**Request:** `POST {{baseUrl}}/api/banners`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{authToken}}
```

**Body (raw JSON):**
```json
{
  "position": 3,
  "title": "Premium Facials",
  "description": "Experience luxury with our premium facial treatments",
  "imageUrl": "https://example.com/premium-facials.jpg",
  "linkUrl": "https://example.com/premium-facials",
  "isActive": true,
  "order": 3
}
```

---

### **Step 6: Create Banner 4**
**Request:** `POST {{baseUrl}}/api/banners`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{authToken}}
```

**Body (raw JSON):**
```json
{
  "position": 4,
  "title": "New Launch",
  "description": "Introducing our latest beauty treatments",
  "imageUrl": "https://example.com/new-launch.jpg",
  "linkUrl": "https://example.com/new-launch",
  "isActive": true,
  "order": 4
}
```

---

### **Step 7: Create Banner 5**
**Request:** `POST {{baseUrl}}/api/banners`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{authToken}}
```

**Body (raw JSON):**
```json
{
  "position": 5,
  "title": "Special Offer",
  "description": "Limited time offer - Book now!",
  "imageUrl": "https://example.com/special-offer.jpg",
  "linkUrl": "https://example.com/special-offer",
  "isActive": true,
  "order": 5
}
```

---

### **Step 8: Test Public Endpoints**

#### **Get Active Banners**
**Request:** `GET {{baseUrl}}/api/banners/active`

**Expected Response:**
```json
{
  "success": true,
  "message": "Active banners retrieved successfully",
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "position": 1,
      "title": "Welcome to Yes Madem",
      "description": "Your beauty journey starts here",
      "imageUrl": "https://example.com/hero-banner.jpg",
      "linkUrl": "https://example.com/welcome",
      "isActive": true,
      "order": 1,
      "createdAt": "2023-07-20T10:30:00.000Z",
      "updatedAt": "2023-07-20T10:30:00.000Z"
    },
    // ... more banners
  ]
}
```

#### **Get Banner by Position**
**Request:** `GET {{baseUrl}}/api/banners/position/1`

**Expected Response:**
```json
{
  "success": true,
  "message": "Banner retrieved successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "position": 1,
    "title": "Welcome to Yes Madem",
    "description": "Your beauty journey starts here",
    "imageUrl": "https://example.com/hero-banner.jpg",
    "linkUrl": "https://example.com/welcome",
    "isActive": true,
    "order": 1,
    "createdAt": "2023-07-20T10:30:00.000Z",
    "updatedAt": "2023-07-20T10:30:00.000Z"
  }
}
```

---

### **Step 9: Test Admin Endpoints**

#### **Get All Banners**
**Request:** `GET {{baseUrl}}/api/banners`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Banners retrieved successfully",
  "data": [
    // All banners (active and inactive)
  ]
}
```

#### **Update Banner**
**Request:** `PUT {{baseUrl}}/api/banners/<banner_id>`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{authToken}}
```

**Body (raw JSON):**
```json
{
  "title": "Updated Welcome Banner",
  "description": "Updated description for the welcome banner",
  "imageUrl": "https://example.com/updated-hero-banner.jpg",
  "linkUrl": "https://example.com/updated-welcome",
  "isActive": true,
  "order": 1
}
```

#### **Update Banner Position**
**Request:** `PUT {{baseUrl}}/api/banners/<banner_id>/position`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{authToken}}
```

**Body (raw JSON):**
```json
{
  "position": 2
}
```

#### **Delete Banner**
**Request:** `DELETE {{baseUrl}}/api/banners/<banner_id>`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Banner deleted successfully"
}
```

---

## 🚨 Error Testing Scenarios

### **Test 1: Create Banner with Invalid Position**
**Request:** `POST {{baseUrl}}/api/banners`

**Body:**
```json
{
  "position": 6,
  "title": "Invalid Banner",
  "imageUrl": "https://example.com/invalid.jpg"
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Position must be between 1 and 5"
}
```

### **Test 2: Create Banner at Existing Position**
**Request:** `POST {{baseUrl}}/api/banners`

**Body:**
```json
{
  "position": 1,
  "title": "Duplicate Banner",
  "imageUrl": "https://example.com/duplicate.jpg"
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Banner already exists at position 1"
}
```

### **Test 3: Access Admin Endpoint Without Token**
**Request:** `POST {{baseUrl}}/api/banners`

**Headers:** (none)

**Expected Response:**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### **Test 4: Access Admin Endpoint with Non-Admin Token**
**Request:** `POST {{baseUrl}}/api/banners`

**Headers:**
```
Authorization: Bearer <user-token>
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Admin access required."
}
```

---

## 🔄 Testing Flow Summary

1. **Login as Admin** → Get admin token
2. **Create Banner 1** → Position 1 (Hero banner)
3. **Create Banner 2** → Position 2 (Promotional)
4. **Create Banner 3** → Position 3 (Service highlight)
5. **Create Banner 4** → Position 4 (New launch)
6. **Create Banner 5** → Position 5 (Special offer)
7. **Test Public Endpoints** → Get active banners, get by position
8. **Test Admin Endpoints** → Get all banners, update, delete
9. **Error Tests** → Verify error handling

---

## 📱 Banner Usage in Application

### **Frontend Integration**

1. **Get Active Banners:**
   ```javascript
   fetch('/api/banners/active')
     .then(response => response.json())
     .then(data => {
       // Display banners in carousel/slider
       data.data.forEach(banner => {
         // Render banner with imageUrl, title, description, linkUrl
       });
     });
   ```

2. **Get Banner by Position:**
   ```javascript
   fetch('/api/banners/position/1')
     .then(response => response.json())
     .then(data => {
       // Display specific banner at position 1
       const banner = data.data;
       // Render banner
     });
   ```

### **Banner Display Examples**

- **Position 1**: Main hero banner (full width)
- **Position 2**: Promotional banner (half width)
- **Position 3**: Service highlight banner (quarter width)
- **Position 4**: New launch banner (quarter width)
- **Position 5**: Special offer banner (half width)

---

## 🎯 Success Criteria

✅ All 5 banner positions can be created  
✅ Public endpoints work without authentication  
✅ Admin endpoints require authentication and admin role  
✅ Banner positions are unique (1-5)  
✅ Active banners are filtered correctly  
✅ Banner updates work properly  
✅ Banner deletion works  
✅ Error handling works correctly  
✅ Position validation works  
✅ Admin access control works  

---

## 📞 Support

If you encounter any issues:
1. Check the server console for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running
4. Check the BANNER_API_DOCUMENTATION.md for additional details
5. Verify admin token is valid and has admin role 