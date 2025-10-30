# 🌍 Environment Configuration Guide

## Overview

This project uses **JavaScript-based runtime environment configuration**. This approach:
- ✅ **No native rebuild needed** - switch environments instantly!
- ✅ **Hot reload support** - changes apply immediately
- ✅ **Simple to use** - just change one constant
- ✅ **No external dependencies** - pure JavaScript/TypeScript

---

## 📋 Available Environments

### 1. **Staging** (Default) 🎯
- API: `https://b2aa9968f63a.ngrok.app/api/v1`
- Dev Tools: Enabled
- Analytics: Disabled
- Crash Reporting: Disabled

### 2. **Production**
- API: `https://api.waterabove.com/api/v1`
- Dev Tools: Disabled
- Analytics: Enabled
- Crash Reporting: Enabled

---

## 🚀 How to Switch Environments

### Method 1: Change Default Environment

Edit `src/config/environments.ts`:

```typescript
// Change this line to switch environments
const CURRENT_ENV: EnvironmentType = 'staging'; // or 'production'
```

### Method 2: Runtime Switching (for testing)

```typescript
import {getEnvironment} from '@config';

// Get specific environment
const prodEnv = getEnvironment('production');
console.log(prodEnv.API_BASE_URL);
```

---

## 💡 Usage in Your Code

```typescript
import {env, isStaging, isProduction} from '@config';

// Use current environment
console.log(env.API_BASE_URL);
console.log(env.APP_NAME);

// Conditional logic
if (isStaging) {
  console.log('Running in staging');
}

if (env.ENABLE_DEV_TOOLS) {
  // Enable debug features
}
```

---

## 🔧 Adding a New Environment

1. Add new environment config in `src/config/environments.ts`:

```typescript
const DEVELOPMENT: EnvironmentConfig = {
  API_BASE_URL: 'http://localhost:3000/api/v1',
  APP_ENV: 'development',
  APP_NAME: 'WaterAbove (Dev)',
  ENABLE_ANALYTICS: false,
  ENABLE_CRASH_REPORTING: false,
  ENABLE_DEV_TOOLS: true,
};
```

2. Add to ENVIRONMENTS object:

```typescript
export const ENVIRONMENTS = {
  development: DEVELOPMENT,
  staging: STAGING,
  production: PRODUCTION,
} as const;
```

3. Update the type:

```typescript
export type EnvironmentType = 'development' | 'staging' | 'production';
```

---

## ✅ Benefits of This Approach

| Feature | react-native-config | Runtime Config |
|---------|-------------------|---------------|
| **Rebuild needed** | ❌ Yes | ✅ **No** |
| **Hot reload** | ❌ No | ✅ **Yes** |
| **Native dependencies** | ❌ Yes | ✅ **No** |
| **Easy to switch** | ❌ Complex | ✅ **Simple** |
| **Testing** | ❌ Hard | ✅ **Easy** |
| **Build time** | ❌ Slow | ✅ **Fast** |

---

## 🎯 Quick Commands

```bash
# Run app (uses current CURRENT_ENV in environments.ts)
yarn ios
yarn android

# No need for separate staging/prod scripts!
# Just change CURRENT_ENV in environments.ts
```

---

## 📝 Notes

- **Default environment**: Staging
- **No .env files needed** for runtime switching
- **Instant changes** with hot reload
- **Type-safe** with TypeScript
- **Easy to test** different environments

---

## 🔍 Troubleshooting

### Q: Changes not reflecting?
**A:** Make sure Metro bundler is running and hot reload is enabled.

### Q: Want to keep both staging and production builds?
**A:** Create different build schemes in Xcode/Gradle that set CURRENT_ENV differently.

### Q: Need environment-specific native configs?
**A:** Use Xcode schemes (iOS) and build variants (Android) for native-level configs.

---

## 🚀 Migration from react-native-config

**Old approach:**
```bash
ENVFILE=.env.staging yarn ios  # Required rebuild
```

**New approach:**
```typescript
// Change this in environments.ts:
const CURRENT_ENV = 'staging';  // Instant switch!

// Then just run:
yarn ios  // No rebuild needed!
```

**Benefits:**
- ⚡ **10x faster** - no rebuild needed
- 🔄 **Hot reload works** - instant feedback
- 🎯 **Simpler** - no env file juggling
- ✅ **More reliable** - no permission issues

---

🎉 **Enjoy faster development with runtime environment switching!**

