# WaterAbove 💧

React Native application with TypeScript, Jotai state management, and pixel-perfect UI components.

## 🚀 Features

- ✅ **React Native 0.82** - Latest version
- ✅ **TypeScript** - Full type safety
- ✅ **Jotai** - Modern state management
- ✅ **React Navigation** - native stack navigation
- ✅ **Path Aliases** - clean imports (`@/components`, `@/theme`, etc.)
- ✅ **Custom Components** - reusable, pixel-perfect UI components
- ✅ **Theme System** - colors, typography, spacing
- ✅ **Figma Design System** - Pixel-perfect implementation
- ✅ **Form Validation** - Zod + React Hook Form - type-safe validation
- ✅ **Data Fetching** - TanStack Query - modern server state management
- ✅ **Debugging Tools** - Reactotron + Query Devtools - network/state monitoring

## 📦 Tech Stack

### Core
- **React Native** 0.82.1
- **React** 19.1.1
- **TypeScript** 5.9.3

### Navigation & Routing
- **React Navigation** 7.x (Native Stack)

### State Management
- **Jotai** 2.15.0 - Atomic state management
- **TanStack Query** 5.90.5 - Server state & data fetching

### Forms & Validation
- **React Hook Form** 7.65.0 - Form management
- **Zod** 4.1.12 - Schema validation
- **@hookform/resolvers** 5.2.2 - Zod integration

### API & Networking
- **Axios** 1.13.1 - HTTP client
- **React Native Config** 1.5.9 - Environment variables

### UI & Styling
- **Lucide React Native** 0.548.0 - 1400+ beautiful icons
- **React Native Vector Icons** 10.3.0
- **React Native SVG** 15.14.0
- **React Native Reanimated** 4.1.3
- **React Native Gesture Handler** 2.29.0

### Development Tools
- **Reactotron** - Network & state monitoring
- **TanStack Query Devtools** - React Query debugging
- **Custom Logger** - Structured logging utility

## 🏗️ Project Structure

```
WaterAbove/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Typography/     # Text components (Heading, Paragraph, etc.)
│   │   ├── Input/          # Input component with states
│   │   ├── Button/         # Button with variants
│   │   ├── Checkbox/       # Checkbox component
│   │   └── Logo/           # Logo component
│   ├── screens/            # Screen components
│   │   └── Auth/           # Authentication screens
│   ├── navigation/         # Navigation setup
│   ├── store/              # Jotai state management
│   │   ├── atoms/          # Atom definitions
│   │   └── hooks/          # Custom hooks
│   ├── theme/              # Theme configuration
│   │   ├── colors.ts       # Color palette
│   │   ├── typography.ts   # Text styles
│   │   └── spacing.ts      # Spacing & shadows
│   └── api/                # API calls
├── android/                # Android native code
├── ios/                    # iOS native code
└── App.tsx                 # Root component
```

## 🎨 Components

### Typography
```typescript
import {Heading1, Heading2, ParagraphLarge, Body} from '@/components';

<Heading1 color="primary">Welcome!</Heading1>
<Body color="textSecondary">Description text</Body>
```

### Input
```typescript
import {Input} from '@/components';

<Input
  label="Email"
  placeholder="Enter your email"
  state="default" // default | focused | success | error | disabled
  helpText="We'll never share your email"
  leftIcon={<Icon name="mail" />}
/>
```

### Button
```typescript
import {Button} from '@/components';

<Button
  title="Sign In"
  variant="primary" // primary | secondary | outline | ghost
  size="large"      // small | medium | large
  loading={isLoading}
  onPress={handlePress}
/>
```

### Checkbox
```typescript
import {Checkbox} from '@/components';

<Checkbox
  checked={agreed}
  onPress={() => setAgreed(!agreed)}
  label="I agree to terms & conditions"
/>
```

### Icons (Lucide)
```typescript
import {Icon, Home, User, Settings} from '@/components';

// Using the Icon wrapper (recommended)
<Icon name="Home" size={24} color="#000" />

// Or import directly from lucide-react-native
<Home size={24} color="#3498db" />
<User size={32} color="#666" strokeWidth={2.5} />
<Settings size={20} color="red" />
```

**1400+ icons available!** Browse at: [lucide.dev/icons](https://lucide.dev/icons)

For detailed examples and usage, see: [`ICONS_GUIDE.md`](ICONS_GUIDE.md)

## 🎯 State Management (Jotai)

### Using Atoms
```typescript
import {useAuth, useToast, useTheme} from '@/store/hooks';

// Authentication
const {user, isAuthenticated, login, logout} = useAuth();

// Toast notifications
const {showSuccess, showError} = useToast();

// Theme
const {themeMode, toggleTheme, isDark} = useTheme();
```

### Example Usage
```typescript
const LoginScreen = () => {
  const {login, isLoading} = useAuth();
  const {showSuccess, showError} = useToast();

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    
    if (result.success) {
      showSuccess('Welcome back!');
    } else {
      showError('Invalid credentials');
    }
  };
};
```

For detailed information, see: [`src/store/README.md`](src/store/README.md)

## ✅ Form Validation (Zod + React Hook Form)

### Validation Schemas
```typescript
import {emailSchema, loginSchema, registerSchema} from '@/validation';
import type {EmailFormData, LoginFormData} from '@/validation';
```

### Using Forms
```typescript
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {FormInput, Button} from '@/components';

const MyScreen = () => {
  const {control, handleSubmit} = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {email: ''},
  });

  const onSubmit = (data: EmailFormData) => {
    // Validated data!
    console.log(data.email);
  };

  return (
    <>
      <FormInput
        control={control}
        name="email"
        placeholder="Enter email"
      />
      <Button onPress={handleSubmit(onSubmit)} title="Submit" />
    </>
  );
};
```

For detailed information, see: [`src/validation/README.md`](src/validation/README.md)

## 🌍 Environment Configuration

### Setup Environment Variables

```bash
# 1. Copy example file
cp .env.example .env

# 2. Edit with your values
nano .env
```

### Available Variables

```env
# API Configuration
API_BASE_URL=http://localhost:3000/api
API_STAGING_USERNAME=
API_STAGING_PASSWORD=

# App Configuration
APP_ENV=development
APP_VERSION=1.0.0
APP_NAME=WaterAbove

# Feature Flags
ENABLE_ANALYTICS=false
ENABLE_CRASH_REPORTING=false
ENABLE_DEV_TOOLS=true
```

### Usage in Code

```typescript
import {env, isDevelopment, isProduction} from '@/config';

// Access variables
const apiUrl = env.API_BASE_URL;

// Environment checks
if (isDevelopment) {
  console.log('Dev mode');
}
```

### Switch Environments

```bash
# Development (default)
yarn android

# Staging
ENVFILE=.env.staging yarn android

# Production
ENVFILE=.env.production yarn android
```

For detailed information, see: [`src/config/README.md`](src/config/README.md)

## 🔄 Data Fetching with TanStack Query

The app uses **TanStack Query** (React Query) for all API requests - the industry best practice for data fetching.

### Why TanStack Query?

- ✅ Automatic caching and synchronization
- ✅ Background refetching
- ✅ Retry on failure
- ✅ Loading and error states
- ✅ Optimistic updates

### Using Mutations (POST, PUT, DELETE)

```typescript
import {useLoginMutation} from '@/api/query';

const LoginScreen = () => {
  const loginMutation = useLoginMutation();

  const handleLogin = () => {
    loginMutation.mutate(
      { email: 'user@example.com', password: 'password' },
      {
        onSuccess: (data) => console.log('Logged in:', data.user),
        onError: (error) => console.error('Login failed:', error),
      }
    );
  };

  return (
    <Button
      title="Login"
      onPress={handleLogin}
      loading={loginMutation.isPending}
    />
  );
};
```

### Using Queries (GET)

```typescript
import {useUserQuery} from '@/api/query';

const ProfileScreen = () => {
  const { data: user, isLoading, error } = useUserQuery();

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return <Profile user={user} />;
};
```

### Available Hooks

**Auth Mutations:**
- `useLoginMutation()` - Login user
- `useRegisterMutation()` - Register new user
- `useLogoutMutation()` - Logout user
- `useVerifyEmailMutation()` - Verify email
- `useForgotPasswordMutation()` - Request password reset
- `useResetPasswordMutation()` - Reset password

**User Queries:**
- `useUserQuery()` - Get current user
- `useUserProfileQuery(userId)` - Get user profile

For detailed information, see: [`src/api/query/README.md`](src/api/query/README.md)

## 🔍 Debugging & Monitoring

Professional debugging tools for network, state, and performance monitoring.

### Reactotron (Desktop App)

Real-time monitoring of your app:
- 🌐 Network requests/responses
- 📊 State changes (Jotai atoms)
- 🔄 React Query cache
- ⚡ Performance tracking
- 🐛 Error tracking

**Setup:**
1. Download [Reactotron](https://github.com/infinitered/reactotron/releases)
2. Run your app
3. Watch everything in real-time!

### Custom Logger

```typescript
import {logger} from '@/utils/logger';

// Structured logging
logger.log('User logged in', { userId: 1 });
logger.warn('Slow network', { latency: 5000 });
logger.error('Payment failed', error);

// Performance timing
const timer = logger.timer('Data Processing');
// ... work ...
timer.end(); // Logs duration

// Navigation tracking
logger.navigation('ProfileScreen', { userId: 1 });
```

### Automatic Monitoring ✅

All of these are automatically logged to Reactotron:
- ✅ API requests and responses
- ✅ React Query mutations/queries
- ✅ State changes
- ✅ Performance metrics

For detailed information, see: [`docs/DEBUGGING_GUIDE.md`](docs/DEBUGGING_GUIDE.md)

## 🎨 Theme

```typescript
import {colors, typography, spacing} from '@/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundDark,
    padding: spacing.lg,
  },
  title: {
    ...typography.heading1,
    color: colors.primary,
  },
});
```

### Colors
- Primary: Golden yellow (`#D4AF37`)
- Secondary: Dark blue (`#1E3A5F`)
- Accent: Purple (`#8A2BE2`)
- Success: Teal (`#4ECDC4`)
- Error: Coral red (`#FF6B6B`)

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20
- Yarn
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

```bash
# Clone repository
git clone https://github.com/shavlegkakulia/WaterAbove.git
cd WaterAbove

# Install dependencies
yarn install

# Setup environment variables
cp .env.example .env
# .env is already configured with backend URL

# iOS - Install pods
cd ios && pod install && cd ..

# Run Metro bundler
yarn start

# Run on Android
yarn android

# Run on iOS
yarn ios
```

### Backend & API

The app is connected to a live backend:
- **API Base URL:** `https://b2aa9968f63a.ngrok.app/api/v1`
- **Swagger Docs:** [https://b2aa9968f63a.ngrok.app/api/v1/docs](https://b2aa9968f63a.ngrok.app/api/v1/docs)
- **Admin Dashboard:** [https://b31a0f653613.ngrok.app/](https://b31a0f653613.ngrok.app/)

For more details, see: [`docs/API_ENDPOINTS.md`](docs/API_ENDPOINTS.md)

## 🔧 Useful Commands

```bash
# Development
yarn start              # Start Metro bundler
yarn android           # Run on Android
yarn ios              # Run on iOS

# Testing
yarn test             # Run tests
yarn lint             # Run ESLint

# Cleaning
yarn start --reset-cache   # Reset Metro cache
cd android && ./gradlew clean  # Clean Android build
cd ios && rm -rf build         # Clean iOS build
```

## 📱 Alias Commands (Zsh)

If you installed `.zshrc` aliases:

```bash
# Navigation
waterabove            # cd to project directory

# React Native
rna                   # yarn android
rni                   # yarn ios
rns                   # yarn start
rnr                   # yarn start --reset-cache

# Git
gs                    # git status
gaa                   # git add .
gc "message"          # git commit -m "message"
gp                    # git push
```

## 📚 Path Aliases

The project uses path aliases for clean imports:

```typescript
import {Button} from '@/components';
import {colors} from '@/theme';
import {useAuth} from '@/store/hooks';
import {VerificationScreen} from '@/screens/Auth';
import {apiClient} from '@/api';
```

## 🐛 Troubleshooting

### Metro bundler issues
```bash
yarn start --reset-cache
watchman watch-del-all
rm -rf $TMPDIR/react-*
```

### Android build issues
```bash
cd android
./gradlew clean
cd ..
rm -rf ~/.gradle/caches
```

### iOS build issues
```bash
cd ios
rm -rf build
pod deintegrate
pod install
cd ..
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Shavleg Kakulia**
- GitHub: [@shavlegkakulia](https://github.com/shavlegkakulia)

---

Made with ❤️ and React Native
