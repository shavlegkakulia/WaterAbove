# Configuration & Environment Variables

Centralized configuration management using `react-native-config`.

## 📂 Structure

```
src/config/
├── env.ts       # Environment variables
├── README.md
└── index.ts     # Exports
```

## 🌍 Environment Files

### Files:
```
.env                 # Development (default) - NOT in git
.env.staging         # Staging environment - NOT in git
.env.production      # Production environment - NOT in git
.env.example         # Template (IN git)
```

### Setup:

1. **Copy the example file:**
```bash
cp .env.example .env
```

2. **Fill in your values:**
```env
API_BASE_URL=http://localhost:3000/api
API_STAGING_USERNAME=your_username
API_STAGING_PASSWORD=your_password
```

3. **Never commit `.env` files to git!**

## 🔧 Usage

### Import environment config:

```typescript
import {env, isDevelopment, isProduction} from '@/config';

// Access variables
console.log(env.API_BASE_URL);
console.log(env.APP_ENV);

// Check environment
if (isDevelopment) {
  console.log('Running in development mode');
}

if (isProduction) {
  // Disable dev tools
}
```

### Available Variables:

```typescript
interface Environment {
  // API
  API_BASE_URL: string;
  API_STAGING_USERNAME?: string;
  API_STAGING_PASSWORD?: string;

  // App
  APP_ENV: 'development' | 'staging' | 'production';
  APP_VERSION: string;
  APP_NAME: string;

  // Feature Flags
  ENABLE_ANALYTICS: boolean;
  ENABLE_CRASH_REPORTING: boolean;
  ENABLE_DEV_TOOLS: boolean;
}
```

## 🚀 Switching Environments

### Development (default)
```bash
# Uses .env file
yarn android
yarn ios
```

### Staging
```bash
# iOS
ENVFILE=.env.staging yarn ios

# Android
ENVFILE=.env.staging yarn android
```

### Production
```bash
# iOS
ENVFILE=.env.production yarn ios

# Android
ENVFILE=.env.production yarn android
```

## 📱 Platform-Specific Configuration

### iOS - Using Schemes

1. **Duplicate scheme in Xcode:**
   - Product → Scheme → Manage Schemes
   - Duplicate "WaterAbove" → Name it "WaterAbove Staging"

2. **Set environment file:**
   - Edit Scheme → Build → Pre-actions
   - Add script:
   ```bash
   echo ".env.staging" > /tmp/envfile
   ```

3. **Select scheme and run:**
   - Choose "WaterAbove Staging" scheme
   - Run

### Android - Using Build Types

1. **Edit `android/app/build.gradle`:**
```gradle
android {
    ...
    buildTypes {
        debug {
            ...
        }
        staging {
            ...
        }
        release {
            ...
        }
    }
}
```

2. **Create `.env` files:**
   - `.env` for debug
   - `.env.staging` for staging
   - `.env.production` for release

3. **Build:**
```bash
./gradlew assembleStaging
```

## 🔐 Security Best Practices

### ✅ DO:
- ✅ Use `.env` files for configuration
- ✅ Keep `.env` files out of git
- ✅ Use different values for each environment
- ✅ Provide `.env.example` as template
- ✅ Document all required variables

### ❌ DON'T:
- ❌ Commit `.env` files to git
- ❌ Put sensitive data in code
- ❌ Share production credentials
- ❌ Use production URLs in development

## 📝 Adding New Variables

### 1. Add to `.env` files:
```env
# .env
NEW_API_ENDPOINT=http://localhost:4000

# .env.staging
NEW_API_ENDPOINT=https://api-staging.example.com

# .env.production
NEW_API_ENDPOINT=https://api.example.com
```

### 2. Update TypeScript interface:
```typescript
// src/config/env.ts
export interface Environment {
  // ... existing
  NEW_API_ENDPOINT: string;
}
```

### 3. Add to env object:
```typescript
export const env: Environment = {
  // ... existing
  NEW_API_ENDPOINT: Config.NEW_API_ENDPOINT || 'default_value',
};
```

### 4. Use in code:
```typescript
import {env} from '@/config';

const endpoint = env.NEW_API_ENDPOINT;
```

## 🎯 Environment-Specific Code

### Feature Flags:
```typescript
import {env} from '@/config';

if (env.ENABLE_ANALYTICS) {
  // Initialize analytics
  Analytics.init();
}

if (env.ENABLE_DEV_TOOLS) {
  // Show dev menu
}
```

### Conditional APIs:
```typescript
import {env, isDevelopment, isProduction} from '@/config';

if (isDevelopment) {
  // Use mock data
  return mockData;
} else {
  // Use real API
  return await apiClient.get(env.API_BASE_URL);
}
```

### Debug Logging:
```typescript
import {isDevelopment} from '@/config';

if (isDevelopment) {
  console.log('Debug info:', data);
}
```

## 🐛 Troubleshooting

### Environment not loading?

1. **Check file exists:**
```bash
ls -la .env
```

2. **Restart Metro bundler:**
```bash
yarn start --reset-cache
```

3. **Rebuild native app:**
```bash
# iOS
cd ios && pod install && cd ..
yarn ios

# Android
cd android && ./gradlew clean && cd ..
yarn android
```

### Variables undefined?

1. **Check Config import:**
```typescript
import Config from 'react-native-config';
console.log(Config); // Should show your variables
```

2. **Verify .env format:**
```env
# ✅ Correct
API_BASE_URL=https://api.example.com

# ❌ Wrong (no spaces, no quotes for simple values)
API_BASE_URL = "https://api.example.com"
```

## 📚 Related Documentation

- [react-native-config](https://github.com/luggit/react-native-config)
- [API Layer](/src/api/README.md)
- [Main README](/README.md)

---

Keep your secrets safe! 🔐

