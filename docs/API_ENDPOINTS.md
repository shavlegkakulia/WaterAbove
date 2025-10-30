# API Endpoints Documentation

Live API endpoints and testing resources for WaterAbove project.

## 🌐 Base URLs

### Backend API
```
Base URL: https://b2aa9968f63a.ngrok.app
API Path: /api/v1
Full URL: https://b2aa9968f63a.ngrok.app/api/v1
```

### Admin Dashboard
```
URL: https://b31a0f653613.ngrok.app/
```

### WebApp
```
URL: https://0cdcbf22b0d6.ngrok.app/
Onboarding: https://0cdcbf22b0d6.ngrok.app/welcome
```

## 📚 API Documentation

### Swagger Documentation
Full interactive API documentation:
```
https://b2aa9968f63a.ngrok.app/api/v1/docs
```

**Note:** Swagger provides:
- Complete list of all endpoints
- Request/response schemas
- Try out functionality
- Authentication requirements

## 🧪 Test Endpoints

### Test User Creation
```
GET https://b2aa9968f63a.ngrok.app/api/v1/test/app
```
Quick test to create a new user and verify backend connectivity.

### Test Stripe Payments
```
GET https://b2aa9968f63a.ngrok.app/api/v1/test/payment
```
Test payment integration functionality.

### Test Spatial Rooms
```
GET https://b2aa9968f63a.ngrok.app/public/test-spatial-rooms.html
```
Preview of spatial rooms functionality (demo version).
You can create a quick test user to explore the feature.

## 🔐 Admin Credentials

**Admin Dashboard Access:**
```
URL: https://b31a0f653613.ngrok.app/
Username: admin
Password: watersabove2025
```

⚠️ **Security Note:** These are development credentials. Never use them in production!

## 📱 Using in Mobile App

The mobile app is already configured to use these endpoints.

### Current Configuration

```typescript
// Automatically configured via .env
import {env} from '@/config';

const apiUrl = env.API_BASE_URL; 
// → https://b2aa9968f63a.ngrok.app/api/v1
```

### Making API Calls

```typescript
import {apiClient} from '@/api';

// Example: Get user data
const response = await apiClient.get('/users/me');

// Example: Create user
const response = await apiClient.post('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});
```

All requests automatically include:
- Base URL
- Platform headers (iOS/Android)
- Screen dimensions
- Authentication token (when logged in)

## 🔄 API Status

**Status:** Work in Progress 🚧

- ✅ Basic endpoints available
- ✅ Swagger documentation
- ✅ Test endpoints functional
- 🚧 New endpoints being added
- 🚧 Some endpoints may change

**Important:** 
- Always check Swagger docs for latest endpoints
- API structure may evolve
- Watch for updates from Ahmed

## 📖 Available Endpoints (via Swagger)

Visit the Swagger documentation for the complete, up-to-date list:
```
https://b2aa9968f63a.ngrok.app/api/v1/docs
```

### Common Patterns

Based on REST conventions, typical endpoints include:

#### Authentication
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
POST /api/v1/auth/verify-email
```

#### Users
```
GET    /api/v1/users/me
PUT    /api/v1/users/me
DELETE /api/v1/users/me
GET    /api/v1/users/:id
```

#### Example Request

```typescript
import {authService} from '@/api';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});

// Access token
const token = response.data.token;
```

## 🧩 Integration Examples

### 1. Test Backend Connectivity

```typescript
import {apiClient} from '@/api';

const testConnection = async () => {
  try {
    const response = await apiClient.get('/test/app');
    console.log('✅ Backend connected:', response.data);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
};
```

### 2. Register User

```typescript
import {authService} from '@/api';

const register = async () => {
  try {
    const response = await authService.register({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123!',
    });
    console.log('✅ User registered:', response.data);
  } catch (error) {
    console.error('❌ Registration failed:', error);
  }
};
```

### 3. Authenticated Request

```typescript
import {apiClient, setAuthToken} from '@/api';

// After login, set token
setAuthToken('your_jwt_token_here');

// Make authenticated request
const getUserProfile = async () => {
  const response = await apiClient.get('/users/me');
  console.log('User profile:', response.data);
};
```

## 🔧 Troubleshooting

### Issue: Cannot connect to backend

**Solutions:**
1. Check ngrok tunnel is active
2. Verify URL in `.env` file
3. Test in browser: https://b2aa9968f63a.ngrok.app/api/v1/docs
4. Check internet connection

### Issue: 401 Unauthorized

**Solutions:**
1. Verify authentication token is set
2. Check token hasn't expired
3. Login again to get fresh token

### Issue: Endpoint not found (404)

**Solutions:**
1. Check Swagger docs for correct endpoint
2. Verify API version in URL (`/api/v1`)
3. Contact Ahmed if endpoint should exist

## 📞 Need Help?

**Contact:** Ahmed (Team Lead)

**Resources:**
- Swagger Docs: https://b2aa9968f63a.ngrok.app/api/v1/docs
- Admin Dashboard: https://b31a0f653613.ngrok.app/
- This documentation: `/docs/API_ENDPOINTS.md`

**Questions to Ask:**
- New endpoint specifications
- Authentication flow details
- Data models and schemas
- Rate limiting information
- Error handling best practices

## 🔄 Updates

**Last Updated:** October 30, 2025

**Changelog:**
- Initial setup with ngrok tunnels
- Swagger documentation available
- Test endpoints functional
- Admin dashboard accessible

**Note:** This documentation will be updated as the API evolves. Always check Swagger for the latest endpoints.

---

Happy coding! 🚀

