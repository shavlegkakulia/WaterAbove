# 🔍 Debugging Guide

Complete guide for monitoring network requests, state changes, and debugging the WaterAbove app.

## 🛠️ Development Tools

### 1. **Reactotron** 🚀
Desktop app for monitoring your React Native app in real-time.

**Features:**
- 🌐 Network request monitoring
- 📊 State inspection
- 📝 Custom logging
- ⚡ Performance tracking
- 🐛 Error tracking

### 2. **TanStack Query Devtools**
In-app panel for monitoring React Query cache and requests.

**Features:**
- 📦 View all queries and mutations
- 🔄 See cache state
- ⏱️ Request timing
- 🔍 Query invalidation tracking

### 3. **Jotai Devtools**
Already integrated for Jotai state management.

**Features:**
- 👀 Atom value inspection
- 🔄 State change tracking
- ⏮️ Time-travel debugging

---

## 📦 Installation & Setup

### Step 1: Download Reactotron

Download the desktop app:
- **macOS**: https://github.com/infinitered/reactotron/releases
- **Windows**: https://github.com/infinitered/reactotron/releases
- **Linux**: https://github.com/infinitered/reactotron/releases

### Step 2: Already Configured! ✅

The app is already configured with:
- ✅ Reactotron setup
- ✅ TanStack Query Devtools
- ✅ Custom logger
- ✅ Network monitoring
- ✅ State tracking

---

## 🚀 Using Reactotron

### Launch Reactotron

1. Open the Reactotron desktop app
2. Start your React Native app:
```bash
yarn start --reset-cache
yarn android  # or yarn ios
```

3. Reactotron will automatically connect!

### What You'll See

#### Timeline View
- All app events in chronological order
- Network requests and responses
- State changes
- Custom logs

#### State Snapshots
- Current app state
- Jotai atoms
- React Query cache

#### Network Tab
- All API requests
- Request/response bodies
- Headers
- Timing information

---

## 🌐 Network Monitoring

### Automatic Logging

All API requests are automatically logged:

```typescript
// This is automatically logged:
const response = await apiClient.get('/users/me');

// You'll see in Reactotron:
// ✅ API Response
// GET /users/me - 200
// { data: { id: 1, name: "John" } }
```

### Manual Network Logging

```typescript
import {logger} from '@/utils/logger';

logger.network('POST', '/users', { name: 'John' });
```

### View in Reactotron

1. Open **Timeline** tab
2. Look for:
   - 🌐 Network Request
   - ✅ API Response (success)
   - ❌ API Error (failure)

---

## 📊 State Monitoring

### Jotai Atoms

State changes are automatically tracked:

```typescript
import {useAtom} from 'jotai';
import {userAtom} from '@/store/atoms';

const [user, setUser] = useAtom(userAtom);

// This will be logged automatically
setUser({ id: 1, name: 'John' });
```

### Custom State Logging

```typescript
import {logger} from '@/utils/logger';

const oldValue = { count: 0 };
const newValue = { count: 1 };

logger.state('counter', oldValue, newValue);
// Reactotron: 🔄 State Change
// counter: {"count":0} → {"count":1}
```

---

## 🔄 TanStack Query Monitoring

### Automatic Query/Mutation Logging

All queries and mutations are automatically logged:

```typescript
// This is logged automatically:
const loginMutation = useLoginMutation();
loginMutation.mutate({ email, password });

// Reactotron shows:
// ✨ Mutation Success
// Mutation #1
// { variables: { email, password }, data: { token, user } }
```

### View Query Cache

In Reactotron, you'll see:
- 🔄 Query Success
- ❌ Query Error
- ✨ Mutation Success
- 💥 Mutation Error

### React Query Devtools Panel

The app includes an in-app devtools panel:

```typescript
// Tap the floating button to open
// (Development only, automatically hidden in production)
```

**Features:**
- View all active queries
- See query status (loading, success, error)
- Inspect cached data
- Manually trigger refetch
- See query invalidation

---

## 📝 Custom Logging

### Using the Logger

```typescript
import {logger} from '@/utils/logger';

// General log
logger.log('User logged in', { userId: 1 });

// Info
logger.info('Fetching data', { endpoint: '/users' });

// Warning
logger.warn('Slow network detected', { latency: 5000 });

// Error
logger.error('Login failed', error, { tag: 'Auth' });

// Debug
logger.debug('Component rendered', { props });
```

### Navigation Logging

```typescript
import {logger} from '@/utils/logger';

logger.navigation('ProfileScreen', { userId: 1 });
// Reactotron: 🧭 Navigation → ProfileScreen
```

### Performance Logging

```typescript
import {logger} from '@/utils/logger';

// Manual timing
const timer = logger.timer('Data Processing');
// ... do work ...
timer.end(); // Logs: ⏱️ Performance: Data Processing: 150ms

// Or direct
logger.performance('API Call', 250); // 250ms
```

---

## 🐛 Error Tracking

### Automatic Error Logging

All API errors are automatically logged:

```typescript
// API errors are logged automatically
try {
  await apiClient.get('/users/me');
} catch (error) {
  // Already logged in Reactotron!
  // ❌ API Error
  // GET /users/me - 401
}
```

### Custom Error Logging

```typescript
import {logger} from '@/utils/logger';

try {
  // ... some code
} catch (error) {
  logger.error('Failed to process data', error, {
    tag: 'DataProcessor',
    important: true,
  });
}
```

### View in Reactotron

Errors appear with:
- 🔴 Red color
- Important flag
- Full stack trace
- Error message and details

---

## 🎯 Best Practices

### 1. Use Descriptive Tags

```typescript
// ✅ Good
logger.log('User logged in', userData, { tag: 'Authentication' });

// ❌ Bad
logger.log('stuff happened', data);
```

### 2. Log Important Events

```typescript
// Authentication events
logger.info('Login attempt', { email }, { tag: 'Auth' });
logger.info('Login success', { userId }, { tag: 'Auth' });

// Navigation
logger.navigation('HomeScreen');

// Errors
logger.error('Payment failed', error, { tag: 'Payment', important: true });
```

### 3. Use Performance Timers

```typescript
const timer = logger.timer('Image Processing');

// ... process image ...

const duration = timer.end();
if (duration > 1000) {
  logger.warn('Image processing took too long', { duration });
}
```

### 4. Structure Your Logs

```typescript
// Group related logs with tags
logger.log('Starting checkout', null, { tag: 'Checkout' });
logger.log('Validating cart', cart, { tag: 'Checkout' });
logger.log('Processing payment', payment, { tag: 'Checkout' });
logger.log('Checkout complete', order, { tag: 'Checkout' });
```

---

## 🔧 Configuration

### Reactotron Settings

Edit `src/config/reactotron.ts`:

```typescript
const reactotron = Reactotron.configure({
  name: 'WaterAbove',
  host: 'localhost', // Change to your machine's IP for physical devices
})
```

### For Physical Devices

If testing on a real device:

1. Find your computer's IP address:
```bash
# macOS
ipconfig getifaddr en0

# Windows
ipconfig

# Linux
hostname -I
```

2. Update Reactotron config:
```typescript
host: '192.168.1.100', // Your computer's IP
```

3. Ensure device and computer are on same network

---

## 🎨 Viewing Different Data Types

### Network Requests

**Timeline → Look for:**
- 🌐 Network Request
- ✅ API Response
- ❌ API Error

**Data shown:**
- URL
- Method (GET, POST, etc.)
- Status code
- Request/response body
- Headers

### State Changes

**Timeline → Look for:**
- 🔄 State Change
- Shows old value → new value

### React Query

**Timeline → Look for:**
- 🔄 Query Success
- ❌ Query Error
- ✨ Mutation Success
- 💥 Mutation Error

**Data shown:**
- Query key
- Variables
- Response data
- Error details

---

## 🚫 Disabling Logs in Production

All development tools are automatically disabled in production:

```typescript
if (__DEV__) {
  // Only runs in development
  console.tron.log('Debug info');
}
```

The following are **automatically disabled** in production:
- ✅ Reactotron
- ✅ React Query Devtools
- ✅ All logger calls
- ✅ Performance tracking

---

## 📱 Example: Debugging a Login Flow

### 1. Start Reactotron
Open the desktop app

### 2. Trigger Login
```typescript
const loginMutation = useLoginMutation();
loginMutation.mutate({ email: 'user@example.com', password: 'pass' });
```

### 3. Watch Reactotron Timeline

You'll see (in order):

1. **🌐 Network Request**
   ```
   POST /auth/login
   { email: 'user@example.com', password: '***' }
   ```

2. **✅ API Response**
   ```
   200 OK
   { token: 'jwt...', user: { id: 1, name: 'John' } }
   ```

3. **✨ Mutation Success**
   ```
   Login mutation completed
   { data: { token, user } }
   ```

4. **🔄 State Change**
   ```
   userAtom: null → { id: 1, name: 'John' }
   authTokenAtom: null → 'jwt...'
   ```

5. **🧭 Navigation**
   ```
   → HomeScreen
   ```

---

## 🔍 Troubleshooting

### Reactotron Not Connecting

**Solution 1: Check Connection**
- Ensure Reactotron desktop app is running
- Check that app and computer are on same network (physical devices)

**Solution 2: Restart**
```bash
yarn start --reset-cache
```

**Solution 3: Update Host**
For physical devices, use your computer's IP:
```typescript
host: '192.168.1.100', // Your IP
```

### Not Seeing Logs

**Check:**
1. Are you in development mode? (`__DEV__ === true`)
2. Is Reactotron desktop app open?
3. Is the connection established? (green indicator in Reactotron)

### React Query Devtools Not Showing

The devtools panel is hidden by default. Look for a floating button to open it, or press the devtools hotkey.

---

## 📚 Additional Resources

- **Reactotron Docs**: https://github.com/infinitered/reactotron
- **React Query Devtools**: https://tanstack.com/query/latest/docs/react/devtools
- **Jotai Devtools**: https://jotai.org/docs/tools/devtools

---

## ✅ Quick Reference

### Most Common Commands

```typescript
import {logger} from '@/utils/logger';

// Basic logging
logger.log('Message', data);
logger.info('Info', data);
logger.warn('Warning', data);
logger.error('Error', error);

// Specialized logging
logger.network('POST', '/users', data);
logger.state('atomName', oldValue, newValue);
logger.navigation('ScreenName', params);
logger.performance('Operation', durationMs);

// Timing
const timer = logger.timer('Label');
// ... work ...
timer.end();
```

---

Happy debugging! 🐛🔍



