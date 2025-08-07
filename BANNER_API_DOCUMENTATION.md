# 🎯 Banner API Documentation

## Overview

The Banner API allows administrators to manage banner images for the Yes Madem application. Banners can be positioned from 1 to 5 and are displayed to users in the application.

## 🔑 Authentication

- **Public Routes**: No authentication required (get active banners, get banner by position/ID)
- **Admin Routes**: Requires JWT token with admin role

## 📋 API Endpoints

### 1. **Create Banner** (Admin Only)
```http
POST /api/banners
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "position": 1,
  "title": "Summer Sale",
  "description": "Get 50% off on all facials",
  "imageUrl": "https://example.com/banner1.jpg",
  "linkUrl": "https://example.com/summer-sale",
  "isActive": true,
  "order": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Banner created successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "position": 1,
    "title": "Summer Sale",
    "description": "Get 50% off on all facials",
    "imageUrl": "https://example.com/banner1.jpg",
    "linkUrl": "https://example.com/summer-sale",
    "isActive": true,
    "order": 1,
    "createdAt": "2023-07-20T10:30:00.000Z",
    "updatedAt": "2023-07-20T10:30:00.000Z"
  }
}
```

---

### 2. **Get All Banners** (Admin Only)
```http
GET /api/banners
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Banners retrieved successfully",
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "position": 1,
      "title": "Summer Sale",
      "description": "Get 50% off on all facials",
      "imageUrl": "https://example.com/banner1.jpg",
      "linkUrl": "https://example.com/summer-sale",
      "isActive": true,
      "order": 1,
      "createdAt": "2023-07-20T10:30:00.000Z",
      "updatedAt": "2023-07-20T10:30:00.000Z"
    }
  ]
}
```

---

### 3. **Get Active Banners** (Public)
```http
GET /api/banners/active
```

**Response:**
```json
{
  "success": true,
  "message": "Active banners retrieved successfully",
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "position": 1,
      "title": "Summer Sale",
      "description": "Get 50% off on all facials",
      "imageUrl": "https://example.com/banner1.jpg",
      "linkUrl": "https://example.com/summer-sale",
      "isActive": true,
      "order": 1,
      "createdAt": "2023-07-20T10:30:00.000Z",
      "updatedAt": "2023-07-20T10:30:00.000Z"
    }
  ]
}
```

---

### 4. **Get Banner by Position** (Public)
```http
GET /api/banners/position/1
```

**Response:**
```json
{
  "success": true,
  "message": "Banner retrieved successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "position": 1,
    "title": "Summer Sale",
    "description": "Get 50% off on all facials",
    "imageUrl": "https://example.com/banner1.jpg",
    "linkUrl": "https://example.com/summer-sale",
    "isActive": true,
    "order": 1,
    "createdAt": "2023-07-20T10:30:00.000Z",
    "updatedAt": "2023-07-20T10:30:00.000Z"
  }
}
```

---

### 5. **Get Banner by ID** (Public)
```http
GET /api/banners/60f7b3b3b3b3b3b3b3b3b3b3
```

**Response:**
```json
{
  "success": true,
  "message": "Banner retrieved successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "position": 1,
    "title": "Summer Sale",
    "description": "Get 50% off on all facials",
    "imageUrl": "https://example.com/banner1.jpg",
    "linkUrl": "https://example.com/summer-sale",
    "isActive": true,
    "order": 1,
    "createdAt": "2023-07-20T10:30:00.000Z",
    "updatedAt": "2023-07-20T10:30:00.000Z"
  }
}
```

---

### 6. **Update Banner** (Admin Only)
```http
PUT /api/banners/60f7b3b3b3b3b3b3b3b3b3b3
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "Updated Summer Sale",
  "description": "Get 60% off on all facials",
  "imageUrl": "https://example.com/banner1-updated.jpg",
  "linkUrl": "https://example.com/updated-summer-sale",
  "isActive": true,
  "order": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Banner updated successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "position": 1,
    "title": "Updated Summer Sale",
    "description": "Get 60% off on all facials",
    "imageUrl": "https://example.com/banner1-updated.jpg",
    "linkUrl": "https://example.com/updated-summer-sale",
    "isActive": true,
    "order": 2,
    "createdAt": "2023-07-20T10:30:00.000Z",
    "updatedAt": "2023-07-20T10:35:00.000Z"
  }
}
```

---

### 7. **Update Banner Position** (Admin Only)
```http
PUT /api/banners/60f7b3b3b3b3b3b3b3b3b3b3/position
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "position": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Banner position updated successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "position": 2,
    "title": "Updated Summer Sale",
    "description": "Get 60% off on all facials",
    "imageUrl": "https://example.com/banner1-updated.jpg",
    "linkUrl": "https://example.com/updated-summer-sale",
    "isActive": true,
    "order": 2,
    "createdAt": "2023-07-20T10:30:00.000Z",
    "updatedAt": "2023-07-20T10:40:00.000Z"
  }
}
```

---

### 8. **Delete Banner** (Admin Only)
```http
DELETE /api/banners/60f7b3b3b3b3b3b3b3b3b3b3
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Banner deleted successfully"
}
```

---

## 📊 Data Model

### Banner Schema
```javascript
{
  position: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 5,
    enum: [1, 2, 3, 4, 5]
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    required: true
  },
  linkUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

---

## 🚨 Error Responses

### Validation Errors
```json
{
  "success": false,
  "message": "Position, title, and imageUrl are required"
}
```

### Position Already Exists
```json
{
  "success": false,
  "message": "Banner already exists at position 1"
}
```

### Invalid Position
```json
{
  "success": false,
  "message": "Position must be between 1 and 5"
}
```

### Banner Not Found
```json
{
  "success": false,
  "message": "Banner not found"
}
```

### Admin Access Required
```json
{
  "success": false,
  "message": "Admin access required."
}
```

---

## 🎯 Usage Examples

### Creating Banners for All Positions

1. **Banner 1** (Main Hero Banner):
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

2. **Banner 2** (Promotional Banner):
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

3. **Banner 3** (Service Highlight):
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

4. **Banner 4** (New Launch):
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

5. **Banner 5** (Special Offer):
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

## 🔧 Testing with Postman

1. **Import the updated Postman collection**
2. **Set up environment variables**:
   - `baseUrl`: `http://localhost:3000`
   - `authToken`: (set after admin login)

3. **Test sequence**:
   - Login as admin to get token
   - Create banners for positions 1-5
   - Test public endpoints (get active banners, get by position)
   - Test admin endpoints (update, delete, position change)

---

## 📝 Notes

- **Position uniqueness**: Only one banner can exist at each position (1-5)
- **Active banners**: Only active banners are returned in public endpoints
- **Ordering**: Banners are ordered by `order` field, then by `position`
- **Image URLs**: Should be valid URLs pointing to banner images
- **Admin access**: All modification operations require admin role
- **Validation**: All inputs are validated before processing 