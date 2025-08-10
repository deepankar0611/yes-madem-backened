# Consultant Banner API Testing Guide

## Quick Test Commands

### 1. Test Public Endpoints (No Authentication Required)

#### Get All Active Consultant Banners
```bash
curl -X GET "http://localhost:3000/api/consultant-banners/active"
```

#### Get Consultant Banner by Position
```bash
curl -X GET "http://localhost:3000/api/consultant-banners/position/1"
curl -X GET "http://localhost:3000/api/consultant-banners/position/2"
curl -X GET "http://localhost:3000/api/consultant-banners/position/3"
curl -X GET "http://localhost:3000/api/consultant-banners/position/4"
```

### 2. Test Admin Endpoints (Authentication Required)

#### Create Consultant Banner
```bash
curl -X POST "http://localhost:3000/api/consultant-banners" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "position": 1,
    "title": "Expert Consultation",
    "description": "Get professional beauty advice from our experts",
    "imageUrl": "https://example.com/consultant1.jpg",
    "linkUrl": "/consultation",
    "isActive": true,
    "order": 0
  }'
```

#### Create Multiple Consultant Banners
```bash
# Banner 1
curl -X POST "http://localhost:3000/api/consultant-banners" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "position": 1,
    "title": "Expert Consultation",
    "description": "Get professional beauty advice",
    "imageUrl": "https://example.com/consultant1.jpg",
    "linkUrl": "/consultation"
  }'

# Banner 2
curl -X POST "http://localhost:3000/api/consultant-banners" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "position": 2,
    "title": "Beauty Tips & Tricks",
    "description": "Daily beauty tips and tricks",
    "imageUrl": "https://example.com/consultant2.jpg",
    "linkUrl": "/tips"
  }'

# Banner 3
curl -X POST "http://localhost:3000/api/consultant-banners" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "position": 3,
    "title": "Product Recommendations",
    "description": "Expert product recommendations",
    "imageUrl": "https://example.com/consultant3.jpg",
    "linkUrl": "/products"
  }'

# Banner 4
curl -X POST "http://localhost:3000/api/consultant-banners" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "position": 4,
    "title": "Book Appointment",
    "description": "Schedule your beauty consultation",
    "imageUrl": "https://example.com/consultant4.jpg",
    "linkUrl": "/book"
  }'
```

#### Get All Consultant Banners (Admin)
```bash
curl -X GET "http://localhost:3000/api/consultant-banners" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update Consultant Banner
```bash
curl -X PUT "http://localhost:3000/api/consultant-banners/BANNER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Updated Consultation Title",
    "description": "Updated description for better engagement"
  }'
```

#### Update Banner Position
```bash
curl -X PUT "http://localhost:3000/api/consultant-banners/BANNER_ID/position" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "position": 2
  }'
```

#### Delete Consultant Banner
```bash
curl -X DELETE "http://localhost:3000/api/consultant-banners/BANNER_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Postman Collection

### Environment Variables
Set these in your Postman environment:
- `base_url`: `http://localhost:3000`
- `jwt_token`: Your admin JWT token

### Test Collection

#### 1. Get Consultant Banners (Public)
- **Method**: GET
- **URL**: `{{base_url}}/api/consultant-banners/active`
- **Auth**: None

#### 2. Get Consultant Banner by Position (Public)
- **Method**: GET
- **URL**: `{{base_url}}/api/consultant-banners/position/1`
- **Auth**: None

#### 3. Create Consultant Banner (Admin)
- **Method**: POST
- **URL**: `{{base_url}}/api/consultant-banners`
- **Auth**: Bearer Token
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{jwt_token}}`
- **Body**:
```json
{
  "position": 1,
  "title": "Expert Consultation",
  "description": "Get professional beauty advice",
  "imageUrl": "https://example.com/consultant1.jpg",
  "linkUrl": "/consultation"
}
```

#### 4. Update Consultant Banner (Admin)
- **Method**: PUT
- **URL**: `{{base_url}}/api/consultant-banners/{{banner_id}}`
- **Auth**: Bearer Token
- **Body**:
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### 5. Delete Consultant Banner (Admin)
- **Method**: DELETE
- **URL**: `{{base_url}}/api/consultant-banners/{{banner_id}}`
- **Auth**: Bearer Token

## Test Scenarios

### 1. Basic Functionality Tests
- [ ] Create consultant banner at position 1
- [ ] Create consultant banner at position 2
- [ ] Create consultant banner at position 3
- [ ] Create consultant banner at position 4
- [ ] Verify all 4 banners are retrieved
- [ ] Verify banners are ordered by position

### 2. Validation Tests
- [ ] Try to create banner at position 5 (should fail)
- [ ] Try to create banner at position 0 (should fail)
- [ ] Try to create banner without required fields (should fail)
- [ ] Try to create banner with invalid position (should fail)

### 3. Position Management Tests
- [ ] Update banner position from 1 to 3
- [ ] Verify position change is successful
- [ ] Try to move banner to occupied position (should fail)
- [ ] Verify position uniqueness constraint

### 4. Public Access Tests
- [ ] Access consultant banners without authentication
- [ ] Access specific consultant banner by position
- [ ] Verify only active banners are returned

### 5. Admin Access Tests
- [ ] Create banner with valid admin token
- [ ] Create banner with invalid token (should fail)
- [ ] Create banner without token (should fail)
- [ ] Update banner with admin privileges
- [ ] Delete banner with admin privileges

## Expected Results

### Successful Responses
- All endpoints return `success: true`
- Data is properly structured
- Banners are ordered correctly
- Position validation works as expected

### Error Responses
- Invalid positions return 400 with clear message
- Missing authentication returns 401
- Missing admin privileges returns 403
- Duplicate positions return 400

## Performance Notes
- Banner queries are indexed for optimal performance
- Separate indexes for `position`, `isActive`, and `order` fields
- No rate limiting on consultant banner endpoints
- Optimized for consultant page performance

## Key Differences from Main Banner API
1. **Separate Model**: Uses `ConsultantBanner` model instead of `Banner`
2. **Different Endpoints**: All endpoints start with `/api/consultant-banners`
3. **Position Limit**: Only supports positions 1-4 (not 1-5)
4. **No Rate Limiting**: Better performance for consultant page
5. **Independent System**: Completely separate from existing banner functionality
