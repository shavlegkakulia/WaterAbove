# Jotai State Management

This project uses **Jotai** (v2.15.0) for state management.

## 📦 What is Jotai?

Jotai is a primitive and flexible state management library for React. It uses **atoms** - small, independent state units.

### Advantages:
- ✅ **Simple API** - similar to React's useState
- ✅ **TypeScript support** - full type safety
- ✅ **Atomic design** - components only access the state they need
- ✅ **No boilerplate** - no need for actions, reducers, providers
- ✅ **DevTools** - jotai-devtools for monitoring

## 📂 Structure

```
src/store/
├── atoms/              # Atom definitions
│   ├── authAtoms.ts    # Authentication state
│   ├── uiAtoms.ts      # UI state (theme, modals, toasts)
│   └── index.ts
├── hooks/              # Custom hooks
│   ├── useAuth.ts      # Auth logic
│   ├── useUI.ts        # UI logic
│   └── index.ts
└── README.md
```

## 🎯 How to Use

### 1. Atoms - State Definition

Atoms are individual pieces of state:

```typescript
import {atom} from 'jotai';

// Simple atom
export const userAtom = atom<User | null>(null);

// Derived atom (read-only)
export const isLoggedInAtom = atom(
  (get) => get(userAtom) !== null
);

// Write-only atom (action)
export const logoutAtom = atom(
  null,
  (get, set) => {
    set(userAtom, null);
    set(authTokenAtom, null);
  }
);
```

### 2. Custom Hooks - Business Logic

```typescript
import {useAtom, useAtomValue, useSetAtom} from 'jotai';

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const logout = useSetAtom(logoutAtom);

  return {user, isLoggedIn, logout};
};
```

### 3. Usage in Components

```typescript
import {useAuth} from '@/store/hooks';

const ProfileScreen = () => {
  const {user, isLoggedIn, logout} = useAuth();

  if (!isLoggedIn) {
    return <LoginPrompt />;
  }

  return (
    <View>
      <Text>Welcome {user?.name}!</Text>
      <Button onPress={logout} title="Logout" />
    </View>
  );
};
```

## 📋 Available Atoms and Hooks

### 🔐 Authentication (`authAtoms.ts` & `useAuth.ts`)

**Atoms:**
- `userAtom` - Current user data
- `isAuthenticatedAtom` - Auth status
- `authTokenAtom` - Persisted token (AsyncStorage)
- `isLoggedInAtom` - Derived: user exists
- `verificationEmailAtom` - Email verification state
- `isVerifyingEmailAtom` - Loading state
- `verificationErrorAtom` - Error message

**Hooks:**
```typescript
// Auth hook
const {user, isAuthenticated, login, logout, register} = useAuth();

// Email verification hook
const {email, isVerifying, error, verifyEmail, resetVerification} = useEmailVerification();
```

### 🎨 UI State (`uiAtoms.ts` & `useUI.ts`)

**Atoms:**
- `themeModeAtom` - 'light' | 'dark'
- `globalLoadingAtom` - Global loading state
- `isModalOpenAtom` - Modal visibility
- `toastsAtom` - Toast notifications array

**Hooks:**
```typescript
// Theme
const {themeMode, toggleTheme, isDark} = useTheme();

// Toast notifications
const {showSuccess, showError, showWarning, showInfo} = useToast();

// Modal
const {isOpen, openModal, closeModal} = useModal();
```

## 📝 Examples

### Email Verification (VerificationScreen)

```typescript
import {useEmailVerification, useToast} from '@/store/hooks';

const VerificationScreen = () => {
  const {isVerifying, error, verifyEmail} = useEmailVerification();
  const {showSuccess, showError} = useToast();
  
  const handleVerify = async () => {
    const result = await verifyEmail(email);
    
    if (result.success) {
      showSuccess('Verification email sent!');
    } else {
      showError(result.error || 'Verification failed');
    }
  };

  return (
    <Button 
      onPress={handleVerify} 
      loading={isVerifying}
      disabled={isVerifying}
    />
  );
};
```

### Toast Notifications

```typescript
import {useToast} from '@/store/hooks';

const MyComponent = () => {
  const {showSuccess, showError} = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      showSuccess('Data saved successfully!');
    } catch (error) {
      showError('Failed to save data');
    }
  };
};
```

### Theme Toggle

```typescript
import {useTheme} from '@/store/hooks';

const SettingsScreen = () => {
  const {themeMode, toggleTheme, isDark} = useTheme();

  return (
    <Switch 
      value={isDark} 
      onValueChange={toggleTheme}
    />
  );
};
```

## 🔄 Persisted State (AsyncStorage)

Some atoms are stored in AsyncStorage:

```typescript
import {atomWithStorage} from 'jotai/utils';

// Automatically syncs with AsyncStorage
export const authTokenAtom = atomWithStorage<string | null>(
  'auth_token', 
  null
);
```

## 🛠️ DevTools

To use jotai-devtools:

```typescript
import {DevTools} from 'jotai-devtools';

function App() {
  return (
    <>
      {__DEV__ && <DevTools />}
      <YourApp />
    </>
  );
}
```

## 📚 Additional Resources

- [Jotai Documentation](https://jotai.org/)
- [Jotai Utils](https://jotai.org/docs/utilities/storage)
- [Jotai DevTools](https://github.com/jotaijs/jotai-devtools)

## ✨ Best Practices

1. **Keep atoms small** - one atom = one state piece
2. **Use derived atoms** - for computed values
3. **Custom hooks** - for business logic
4. **Type everything** - TypeScript always
5. **Persist sparingly** - only what's really needed

---

Happy coding with Jotai! 🎉

