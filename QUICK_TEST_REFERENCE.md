# 🚀 Quick Test Reference Card - Phone Only

## 📍 Base URL
```
http://localhost:3000
```

## 🔑 Environment Variables (Postman)
- `baseUrl`: `http://localhost:3000`
- `authToken`: (set after verify-login/verify-otp)

---

## 📋 API Endpoints Quick Reference

### 1. **Health Check**
```
GET {{baseUrl}}/health
```
**Response:** Server status

---

### 2. **Register User (Phone Only)**
```
POST {{baseUrl}}/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "phoneNumber": "9876543210"
}
```

---

### 3. **Login User (Phone Only)**
```
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "phoneNumber": "9876543210"
}
```
**⚠️ OTP will be sent to phone**

---

### 4. **Verify Login OTP**
```
POST {{baseUrl}}/api/auth/verify-login
Content-Type: application/json

{
  "phoneNumber": "9876543210",
  "otp": "123456"
}
```
**⚠️ Copy token to `authToken` variable**

---

### 5. **Send OTP (For Account Verification)**
```
POST {{baseUrl}}/api/auth/send-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210"
}
```

---

### 6. **Verify OTP (For Account Verification)**
```
POST {{baseUrl}}/api/auth/verify-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210",
  "otp": "123456"
}
```
**⚠️ Update `authToken` variable**

---

### 7. **Get Profile** (Protected)
```
GET {{baseUrl}}/api/auth/profile
Authorization: Bearer {{authToken}}
```

---

### 8. **Update Profile** (Protected)
```
PUT {{baseUrl}}/api/auth/profile
Content-Type: application/json
Authorization: Bearer {{authToken}}

{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

---

## 🚨 Error Test Cases

### **Invalid Phone Number**
```
POST {{baseUrl}}/api/auth/register
{
  "name": "Test",
  "phoneNumber": "12345"
}
```

### **Non-existent Phone Number**
```
POST {{baseUrl}}/api/auth/login
{
  "phoneNumber": "9999999999"
}
```

### **Wrong Login OTP**
```
POST {{baseUrl}}/api/auth/verify-login
{
  "phoneNumber": "9876543210",
  "otp": "999999"
}
```

### **No Token (Protected Route)**
```
GET {{baseUrl}}/api/auth/profile
```

---

## 🔄 Testing Sequence

1. **Health Check** → Verify server
2. **Register** → Create user with phone only
3. **Login** → Request login OTP
4. **Verify Login OTP** → Complete login, set `authToken`
5. **Send OTP** → Request account verification
6. **Verify OTP** → Complete verification, update `authToken`
7. **Get Profile** → Test protected route
8. **Update Profile** → Test modifications
9. **Error Tests** → Verify error handling

---

## 📱 OTP Testing

### **Development:**
- Check server console for OTP
- OTP is logged when SMS is sent

### **Production:**
- Use real phone number
- Check SMS on phone
- OTP expires in 5 minutes

---

## ⚡ Quick Commands

### **Start Server:**
```bash
npm run dev
```

### **Test with curl:**
```bash
# Health check
curl http://localhost:3000/health

# Register (phone only)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phoneNumber":"9876543210"}'

# Login (phone only)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9876543210"}'

# Verify login OTP
curl -X POST http://localhost:3000/api/auth/verify-login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9876543210","otp":"123456"}'
```

---

## 🎯 Expected Status Codes

- **200**: Success
- **201**: Created (Registration)
- **400**: Bad Request (Validation errors)
- **401**: Unauthorized (Invalid credentials/token)
- **403**: Forbidden (Account not verified)
- **404**: Not Found (User not found)
- **423**: Locked (Account locked)
- **429**: Too Many Requests (Rate limited)
- **500**: Internal Server Error

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Server not starting | Check MongoDB, dependencies |
| Database error | Verify MONGODB_URI in config.env |
| SMS not working | Check SMS credentials, use console OTP |
| Token issues | Copy full token, check format |
| Rate limited | Wait for time window to reset |

---

## 🔑 Key Changes from Previous Version

### **Registration:**
- ✅ **Before:** Required name, email, phone, password
- ✅ **Now:** Required name, phone only (email & password optional)

### **Login:**
- ✅ **Before:** Email/phone + password
- ✅ **Now:** Phone number only → OTP verification

### **New Endpoint:**
- ✅ **verify-login:** Complete login after OTP verification

### **Authentication Flow:**
- ✅ **Before:** Register → Login (with password) → Send OTP → Verify OTP
- ✅ **Now:** Register → Login (phone only) → Verify Login OTP → Send OTP → Verify OTP

---

## 📞 Support Files

- **Postman Collection:** `postman-collection.json`
- **Detailed Guide:** `POSTMAN_TESTING_GUIDE.md`
- **API Documentation:** `README.md`
- **Environment Config:** `config.env` 