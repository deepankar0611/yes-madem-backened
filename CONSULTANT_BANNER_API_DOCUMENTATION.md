# Consultant Banner API Documentation

## Overview
The Consultant Banner API provides functionality to manage and retrieve banners specifically designed for the consultant page. This API supports up to 4 consultant banners with positions 1-4.

## Base URL
```
http://localhost:3000/api/consultant-banners
```

## API Endpoints

### 1. Get All Active Consultant Banners
**GET** `/active`

Retrieves all active consultant banners ordered by position.

**Response:**
```json
{
  "success": true,
  "message": "Active consultant banners retrieved successfully",
  "data": [
    {
      "_id": "banner_id",
      "position": 1,
      "title": "Expert Consultation",
      "description": "Get professional beauty advice",
      "imageUrl": "https://example.com/image1.jpg",
      "linkUrl": "/consultation",
      "isActive": true,
      "order": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Get Consultant Banner by Position
**GET** `/position/:position`

Retrieves a specific consultant banner by its position (1-4).

**Parameters:**
- `position` (number): Banner position (1, 2, 3, or 4)

**Response:**
```json
{
  "success": true,
  "message": "Consultant banner retrieved successfully",
  "data": {
    "_id": "banner_id",
    "position": 2,
    "title": "Beauty Tips",
    "description": "Daily beauty tips and tricks",
    "imageUrl": "https://example.com/image2.jpg",
    "linkUrl": "/tips",
    "isActive": true,
    "order": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create Consultant Banner (Admin Only)
**POST** `/`

Creates a new consultant banner.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Body:**
```json
{
  "position": 1,
  "title": "Expert Consultation",
  "description": "Get professional beauty advice from our experts",
  "imageUrl": "https://example.com/image1.jpg",
  "linkUrl": "/consultation",
  "isActive": true,
  "order": 0
}
```

**Required Fields:**
- `position`: Must be 1, 2, 3, or 4
- `title`: Banner title (max 100 characters)
- `imageUrl`: URL of the banner image

**Optional Fields:**
- `description`: Banner description (max 500 characters)
- `linkUrl`: URL to redirect when banner is clicked
- `isActive`: Whether banner is active (default: true)
- `order`: Display order (default: 0)

**Response:**
```json
{
  "success": true,
  "message": "Consultant banner created successfully",
  "data": {
    "_id": "banner_id",
    "position": 1,
    "title": "Expert Consultation",
    "description": "Get professional beauty advice from our experts",
    "imageUrl": "https://example.com/image1.jpg",
    "linkUrl": "/consultation",
    "isActive": true,
    "order": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Consultant Banner (Admin Only)
**PUT** `/:id`

Updates an existing consultant banner.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Body:**
```json
{
  "title": "Updated Consultation Title",
  "description": "Updated description",
  "imageUrl": "https://example.com/new-image.jpg",
  "linkUrl": "/new-consultation",
  "isActive": false,
  "order": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Consultant banner updated successfully",
  "data": {
    "_id": "banner_id",
    "position": 1,
    "title": "Updated Consultation Title",
    "description": "Updated description",
    "imageUrl": "https://example.com/new-image.jpg",
    "linkUrl": "/new-consultation",
    "isActive": false,
    "order": 1,
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 5. Update Consultant Banner Position (Admin Only)
**PUT** `/:id/position`

Updates the position of a consultant banner.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Body:**
```json
{
  "position": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Consultant banner position updated successfully",
  "data": {
    "_id": "banner_id",
    "position": 3,
    "title": "Expert Consultation",
    "description": "Get professional beauty advice",
    "imageUrl": "https://example.com/image1.jpg",
    "linkUrl": "/consultation",
    "isActive": true,
    "order": 0,
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 6. Delete Consultant Banner (Admin Only)
**DELETE** `/:id`

Deletes a consultant banner.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Consultant banner deleted successfully"
}
```

### 7. Get All Consultant Banners (Admin Only)
**GET** `/`

Retrieves all consultant banners (admin only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Consultant banners retrieved successfully",
  "data": [
    {
      "_id": "banner_id_1",
      "position": 1,
      "title": "Expert Consultation",
      "isActive": true
    },
    {
      "_id": "banner_id_2",
      "position": 2,
      "title": "Beauty Tips",
      "isActive": true
    }
  ]
}
```

### 8. Get Consultant Banner by ID (Admin Only)
**GET** `/:id`

Retrieves a specific consultant banner by ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Consultant banner retrieved successfully",
  "data": {
    "_id": "banner_id",
    "position": 1,
    "title": "Expert Consultation",
    "description": "Get professional beauty advice",
    "imageUrl": "https://example.com/image1.jpg",
    "linkUrl": "/consultation",
    "isActive": true,
    "order": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Position must be between 1 and 4"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "No active consultant banner found at position 5"
}
```

### Unauthorized Error (401)
```json
{
  "success": false,
  "message": "Access denied. Invalid token."
}
```

### Forbidden Error (403)
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Failed to get consultant banners",
  "error": "Error details"
}
```

## Banner Position Rules

### Consultant Banners
- **Maximum positions**: 4
- **Valid positions**: 1, 2, 3, 4
- **Unique constraint**: Only one banner per position

## Usage Examples

### Frontend Integration
```javascript
// Get all consultant banners
const response = await fetch('/api/consultant-banners/active');
const data = await response.json();

if (data.success) {
  data.data.forEach(banner => {
    console.log(`Position ${banner.position}: ${banner.title}`);
  });
}

// Get specific consultant banner
const bannerResponse = await fetch('/api/consultant-banners/position/1');
const bannerData = await bannerResponse.json();

if (bannerData.success) {
  const banner = bannerData.data;
  // Display banner in UI
}
```

### Admin Panel Integration
```javascript
// Create new consultant banner
const createBanner = async (bannerData) => {
  const response = await fetch('/api/consultant-banners', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      position: 1,
      title: 'New Banner',
      imageUrl: 'https://example.com/image.jpg'
    })
  });
  
  return await response.json();
};
```

## Notes

1. **Separate System**: This API is completely separate from the existing banner system
2. **Position Validation**: Positions are automatically validated (1-4 only)
3. **Authentication**: Public endpoints don't require authentication, admin endpoints require JWT token
4. **Image URLs**: Ensure image URLs are accessible and properly formatted
5. **Performance**: Banners are indexed for optimal query performance
6. **Ordering**: Banners are sorted by order first, then by position
7. **No Rate Limiting**: Consultant banner endpoints are not rate-limited for better performance
