#!/bin/bash

# Profile Picture Upload Test Script
# Make sure to replace YOUR_JWT_TOKEN with your actual token

BASE_URL="http://localhost:3000"
JWT_TOKEN="YOUR_JWT_TOKEN_HERE"
IMAGE_PATH="./test-image.jpg"  # Change this to your image path

echo "🧪 Testing Profile Picture Upload API"
echo "====================================="
echo ""

# Check if JWT token is set
if [ "$JWT_TOKEN" = "YOUR_JWT_TOKEN_HERE" ]; then
    echo "❌ Please set your JWT token in this script first!"
    echo "   Edit the JWT_TOKEN variable with your actual token"
    echo ""
    echo "   You can get a token by:"
    echo "   1. Registering a user: POST $BASE_URL/api/auth/register"
    echo "   2. Logging in: POST $BASE_URL/api/auth/login"
    echo "   3. Verifying OTP: POST $BASE_URL/api/auth/verify-login"
    echo ""
    exit 1
fi

# Check if image file exists
if [ ! -f "$IMAGE_PATH" ]; then
    echo "❌ Image file not found: $IMAGE_PATH"
    echo "   Please change IMAGE_PATH to point to a valid image file"
    echo ""
    exit 1
fi

echo "✅ JWT Token: ${JWT_TOKEN:0:20}..."
echo "✅ Image file: $IMAGE_PATH"
echo ""

# Test 1: Get current profile
echo "📋 Test 1: Getting current profile..."
PROFILE_RESPONSE=$(curl -s -H "Authorization: Bearer $JWT_TOKEN" "$BASE_URL/api/auth/profile")
echo "Response: $PROFILE_RESPONSE"
echo ""

# Test 2: Upload profile picture
echo "📤 Test 2: Uploading profile picture..."
UPLOAD_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -F "profilePicture=@$IMAGE_PATH" \
    "$BASE_URL/api/auth/upload-profile-picture")

echo "Response: $UPLOAD_RESPONSE"
echo ""

# Test 3: Get updated profile
echo "📋 Test 3: Getting updated profile..."
UPDATED_PROFILE_RESPONSE=$(curl -s -H "Authorization: Bearer $JWT_TOKEN" "$BASE_URL/api/auth/profile")
echo "Response: $UPDATED_PROFILE_RESPONSE"
echo ""

echo "✅ Test completed!"
echo ""
echo "💡 Tips:"
echo "   - Make sure your image is less than 5MB"
echo "   - Supported formats: JPG, PNG, GIF, BMP, WebP"
echo "   - Check the server logs for detailed debugging info"
echo "   - Use the HTML test page (test-upload.html) for easier testing"
