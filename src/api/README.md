# API Layer

Professional axios configuration inspired by benable architecture.

## 📂 Structure

```
src/api/
├── client.ts              # Axios instance with interceptors
├── endpoints.ts           # Centralized API endpoints
├── services/
│   ├── auth.service.ts   # Authentication APIs
│   ├── user.service.ts   # User APIs
│   └── ...               # Other services
├── types/
│   └── index.ts          # API request/response types
├── README.md
└── index.ts              # Exports
```

## 🔧 Configuration

### Axios Client (`client.ts`)

Pre-configured axios instance with:
- **Base URL** - Automatically selects dev/prod URL
- **Timeout** - 15 seconds
- **Platform params** - iOS/Android detection
- **Request interceptor** - Adds metadata (device info, screen size)
- **Response interceptor** - Global error handling & 401 token refresh
- **Auth token** - Bearer token management

### Environment Variables

```javascript
const ENV = {
  API_BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api'  // Development
    : 'https://api.waterabove.com', // Production
};
```

To use react-native-config:
1. Create `.env` file
2. Add `API_BASE_URL=your_url`
3. Uncomment Config import in `client.ts`

## 🎯 Usage

### Using Services Directly

```typescript
import {authService, userService} from '@/api';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});

// Get user profile
const user = await userService.getMe();
```

### Using with Jotai Hooks (Recommended)

```typescript
import {useAuth} from '@/store/hooks';

const LoginScreen = () => {
  const {login, isLoading} = useAuth();
  
  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      // Navigate to home
    }
  };
};
```

### Using with React Query

```typescript
import {useQuery, useMutation} from '@tanstack/react-query';
import {userService} from '@/api';

// Fetch data
const {data, isLoading} = useQuery({
  queryKey: ['user', 'me'],
  queryFn: () => userService.getMe(),
});

// Mutate data
const {mutate} = useMutation({
  mutationFn: (data) => userService.updateProfile(data),
  onSuccess: () => {
    // Refetch or update cache
  },
});
```

## 📋 Available Services

### Auth Service (`auth.service.ts`)

```typescript
authService.login(data: LoginRequest): Promise<LoginResponse>
authService.register(data: RegisterRequest): Promise<RegisterResponse>
authService.logout(): Promise<void>
authService.refreshToken(token: string): Promise<LoginResponse>
authService.verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse>
authService.forgotPassword(data: ForgotPasswordRequest): Promise<void>
authService.resetPassword(data: ResetPasswordRequest): Promise<void>
authService.changePassword(data): Promise<void>
```

### User Service (`user.service.ts`)

```typescript
userService.getMe(): Promise<User>
userService.getProfile(userId: string): Promise<User>
userService.updateProfile(data: UpdateProfileRequest): Promise<User>
userService.uploadAvatar(file: FormData): Promise<{avatarUrl: string}>
userService.deleteAccount(): Promise<void>
```

## 🔐 Authentication

### Setting Auth Token

```typescript
import {setAuthToken} from '@/api';

// Set token (adds to all requests)
setAuthToken('your-jwt-token');

// Clear token
setAuthToken(null);
```

### Auto Token Refresh

The response interceptor automatically handles 401 errors:

```typescript
// In client.ts
if (error.response?.status === 401 && !originalRequest._retry) {
  originalRequest._retry = true;
  // Refresh token logic here
  const newToken = await refreshAuthToken();
  setAuthToken(newToken);
  return apiClient(originalRequest);
}
```

## 📝 Adding New Services

### 1. Define Types

```typescript
// src/api/types/index.ts
export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}
```

### 2. Add Endpoints

```typescript
// src/api/endpoints.ts
export const API_ENDPOINTS = {
  // ...
  POSTS: {
    LIST: '/posts',
    DETAIL: (id: string) => `/posts/${id}`,
    CREATE: '/posts',
    UPDATE: (id: string) => `/posts/${id}`,
    DELETE: (id: string) => `/posts/${id}`,
  },
};
```

### 3. Create Service

```typescript
// src/api/services/post.service.ts
import {apiClient} from '../client';
import {API_ENDPOINTS} from '../endpoints';
import type {Post, CreatePostRequest} from '../types';

export const postService = {
  list: async (): Promise<Post[]> => {
    const response = await apiClient.get(API_ENDPOINTS.POSTS.LIST);
    return response.data;
  },

  create: async (data: CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post(API_ENDPOINTS.POSTS.CREATE, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.POSTS.DELETE(id));
  },
};
```

### 4. Export

```typescript
// src/api/index.ts
export * from './services/post.service';
```

## 🔄 Request/Response Flow

```
Component
  ↓
Jotai Hook (useAuth, useUser)
  ↓
API Service (authService.login)
  ↓
Axios Client (apiClient.post)
  ↓
Request Interceptor (add metadata, headers)
  ↓
API Server
  ↓
Response Interceptor (error handling)
  ↓
Service (return data)
  ↓
Hook (update atoms)
  ↓
Component (re-render)
```

## 🛡️ Error Handling

### Global Error Handling

```typescript
// In client.ts - Response interceptor
if (!error.response) {
  error.message = 'Network error. Please check your internet connection.';
}
```

### Service-Level Error Handling

```typescript
try {
  const response = await authService.login(data);
  return {success: true};
} catch (error: any) {
  const errorMessage = error.response?.data?.message || 'Login failed';
  return {success: false, error: errorMessage};
}
```

### Component-Level Error Handling

```typescript
const {login} = useAuth();
const {showError} = useToast();

const handleLogin = async () => {
  const result = await login(email, password);
  if (!result.success) {
    showError(result.error);
  }
};
```

## 📊 Request Metadata

All non-GET requests automatically include:

```typescript
{
  _metadata: {
    platform: 'ios' | 'android',
    platformVersion: string,
    screenWidth: number,
    screenHeight: number,
    source: 'mobile_app',
  }
}
```

Headers include:
- `X-Request-Time` - ISO timestamp
- `Authorization` - Bearer token (if logged in)
- `Content-Type` - application/json (default)

## 🎨 Best Practices

1. **Use services, not direct axios calls**
   ```typescript
   // ✅ Good
   await authService.login(data);
   
   // ❌ Bad
   await apiClient.post('/auth/login', data);
   ```

2. **Use Jotai hooks in components**
   ```typescript
   // ✅ Good
   const {login} = useAuth();
   await login(email, password);
   
   // ❌ Bad (in component)
   await authService.login({email, password});
   ```

3. **Centralize endpoints**
   ```typescript
   // ✅ Good
   apiClient.get(API_ENDPOINTS.USER.ME);
   
   // ❌ Bad
   apiClient.get('/user/me');
   ```

4. **Type everything**
   ```typescript
   // ✅ Good
   login(data: LoginRequest): Promise<LoginResponse>
   
   // ❌ Bad
   login(data: any): Promise<any>
   ```

5. **Handle errors gracefully**
   ```typescript
   // ✅ Good
   try {
     const response = await service.call();
     return {success: true, data: response};
   } catch (error) {
     return {success: false, error: 'User-friendly message'};
   }
   ```

## 🔗 Related Documentation

- [Jotai Store](/src/store/README.md) - State management with API integration
- [Validation](/src/validation/README.md) - Form validation before API calls

---

Happy coding! 🚀

