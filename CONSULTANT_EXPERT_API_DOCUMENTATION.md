# Consultant Expert API Documentation

This document describes the API endpoints for managing consultant experts in the system.

## Base URL
```
http://localhost:3000/api/consultant-experts
```

## Endpoints

### 1. Create Consultant Expert
**POST** `/api/consultant-experts`

Creates a new consultant expert.

**Request Body:**
```json
{
  "name": "Dr. John Doe",
  "shortDesc": "Experienced dermatologist with 10+ years of practice",
  "longDesc": "Dr. John Doe is a board-certified dermatologist specializing in cosmetic dermatology, skin cancer screening, and general dermatology. He has over 10 years of experience treating patients of all ages.",
  "expertise": ["Dermatology", "Cosmetic Procedures", "Skin Cancer"],
  "image": "https://example.com/images/dr-john-doe.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Consultant expert created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Dr. John Doe",
    "shortDesc": "Experienced dermatologist with 10+ years of practice",
    "longDesc": "Dr. John Doe is a board-certified dermatologist...",
    "expertise": ["Dermatology", "Cosmetic Procedures", "Skin Cancer"],
    "image": "https://example.com/images/dr-john-doe.jpg",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Get All Consultant Experts (Admin)
**GET** `/api/consultant-experts/all`

Retrieves all consultant experts (including inactive ones) for admin purposes.

**Response (200):**
```json
{
  "success": true,
  "message": "Consultant experts retrieved successfully",
  "count": 2,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Dr. John Doe",
      "shortDesc": "Experienced dermatologist with 10+ years of practice",
      "longDesc": "Dr. John Doe is a board-certified dermatologist...",
      "expertise": ["Dermatology", "Cosmetic Procedures", "Skin Cancer"],
      "image": "https://example.com/images/dr-john-doe.jpg",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Active Consultant Experts (User App)
**GET** `/api/consultant-experts/active`

Retrieves only active consultant experts for user applications.

**Response (200):**
```json
{
  "success": true,
  "message": "Active consultant experts retrieved successfully",
  "count": 1,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Dr. John Doe",
      "shortDesc": "Experienced dermatologist with 10+ years of practice",
      "longDesc": "Dr. John Doe is a board-certified dermatologist...",
      "expertise": ["Dermatology", "Cosmetic Procedures", "Skin Cancer"],
      "image": "https://example.com/images/dr-john-doe.jpg",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 4. Get Consultant Expert by ID
**GET** `/api/consultant-experts/:id`

Retrieves a specific consultant expert by their ID.

**Response (200):**
```json
{
  "success": true,
  "message": "Consultant expert retrieved successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Dr. John Doe",
    "shortDesc": "Experienced dermatologist with 10+ years of practice",
    "longDesc": "Dr. John Doe is a board-certified dermatologist...",
    "expertise": ["Dermatology", "Cosmetic Procedures", "Skin Cancer"],
    "image": "https://example.com/images/dr-john-doe.jpg",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 5. Update Consultant Expert
**PUT** `/api/consultant-experts/:id`

Updates an existing consultant expert. All fields are optional.

**Request Body:**
```json
{
  "name": "Dr. John Smith",
  "expertise": ["Dermatology", "Cosmetic Procedures", "Skin Cancer", "Acne Treatment"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Consultant expert updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Dr. John Smith",
    "shortDesc": "Experienced dermatologist with 10+ years of practice",
    "longDesc": "Dr. John Doe is a board-certified dermatologist...",
    "expertise": ["Dermatology", "Cosmetic Procedures", "Skin Cancer", "Acne Treatment"],
    "image": "https://example.com/images/dr-john-doe.jpg",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 6. Delete Consultant Expert
**DELETE** `/api/consultant-experts/:id`

Deletes a consultant expert permanently.

**Response (200):**
```json
{
  "success": true,
  "message": "Consultant expert deleted successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Dr. John Doe",
    "shortDesc": "Experienced dermatologist with 10+ years of practice",
    "longDesc": "Dr. John Doe is a board-certified dermatologist...",
    "expertise": ["Dermatology", "Cosmetic Procedures", "Skin Cancer"],
    "image": "https://example.com/images/dr-john-doe.jpg",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Data Model

### ConsultantExpert Schema
```javascript
{
  name: String (required, max 100 chars),
  shortDesc: String (required, max 200 chars),
  longDesc: String (required, max 1000 chars),
  expertise: [String] (required, non-empty array),
  image: String (required),
  isActive: Boolean (default: true),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "All fields are required: name, shortDesc, longDesc, expertise, image"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Consultant expert not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Error creating consultant expert",
  "error": "Detailed error message"
}
```

## Notes

- **No Authentication Required**: All endpoints are public and don't require authentication
- **Image URLs**: The image field expects a URL string to the consultant's image
- **Expertise Array**: Must contain at least one expertise area
- **Active vs All**: Use `/active` for user apps, `/all` for admin panels
- **Timestamps**: Automatically managed by the system
