# Jotai State Management

ეს პროექტი იყენებს **Jotai** (v2.15.0) state management-ისთვის.

## 📦 რა არის Jotai?

Jotai არის პრიმიტიული და მოქნილი state management library React-ისთვის. ის იყენებს **atoms** (ატომებს) - მცირე, დამოუკიდებელ state units-ს.

### უპირატესობები:
- ✅ **მარტივი API** - მსგავსია React's useState-ს
- ✅ **TypeScript მხარდაჭერა** - სრული type safety
- ✅ **Atomic design** - ნებისმიერი კომპონენტი ხვდება მხოლოდ იმ state-ს რაც სჭირდება
- ✅ **No boilerplate** - არ სჭირდება actions, reducers, providers
- ✅ **DevTools** - jotai-devtools თვალთვალისთვის

## 📂 სტრუქტურა

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

## 🎯 როგორ გამოვიყენოთ

### 1. Atoms - State Definition

Atoms არის state-ის ცალკეული ნაწილები:

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

### 3. კომპონენტში გამოყენება

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

## 📋 არსებული Atoms და Hooks

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

## 📝 მაგალითები

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

ზოგიერთი atom ინახება AsyncStorage-ში:

```typescript
import {atomWithStorage} from 'jotai/utils';

// ავტომატურად sync-დება AsyncStorage-თან
export const authTokenAtom = atomWithStorage<string | null>(
  'auth_token', 
  null
);
```

## 🛠️ DevTools

jotai-devtools-ის გამოსაყენებლად:

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

## 📚 დამატებითი რესურსები

- [Jotai Documentation](https://jotai.org/)
- [Jotai Utils](https://jotai.org/docs/utilities/storage)
- [Jotai DevTools](https://github.com/jotaijs/jotai-devtools)

## ✨ Best Practices

1. **Keep atoms small** - ერთი atom = ერთი state piece
2. **Use derived atoms** - computed values-ისთვის
3. **Custom hooks** - business logic-ისთვის
4. **Type everything** - TypeScript ყოველთვის
5. **Persist sparingly** - მხოლოდ რაც ნამდვილად სჭირდება

---

Happy coding with Jotai! 🎉

