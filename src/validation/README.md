# Form Validation with Zod + React Hook Form

This project uses **Zod** for validation schemas and **React Hook Form** for forms management.

## 📦 Packages

```json
{
  "zod": "^4.1.12",
  "react-hook-form": "^7.65.0",
  "@hookform/resolvers": "^5.2.2"
}
```

## ✨ Advantages

### Zod:
- ✅ **TypeScript-first** - schemas generate types
- ✅ **Runtime validation** - type-safe at runtime
- ✅ **Composable** - schemas can be composed
- ✅ **Rich validation** - many built-in validators

### React Hook Form:
- ✅ **Performance** - minimal re-renders
- ✅ **Simple API** - easy to use
- ✅ **No dependencies** - lightweight
- ✅ **TypeScript support** - full type safety

## 📂 Structure

```
src/validation/
├── schemas/
│   ├── authSchemas.ts    # Auth-related schemas
│   └── index.ts
├── README.md
└── index.ts
```

## 🎯 Schema Definition (Zod)

### Simple Schema

```typescript
import {z} from 'zod';

// Define schema
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

// Infer TypeScript type from schema
export type EmailFormData = z.infer<typeof emailSchema>;
```

### Complex Schema with Validation

```typescript
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms',
    }),
  })
  // Cross-field validation
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // Error path
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
```

## 🎨 Form Components

### FormInput - Controlled Input

```typescript
import {FormInput} from '@/components';

<FormInput
  control={control}
  name="email"
  placeholder="Enter your email"
  label="Email"
  keyboardType="email-address"
  autoCapitalize="none"
/>
```

### FormCheckbox - Controlled Checkbox

```typescript
import {FormCheckbox} from '@/components';

<FormCheckbox
  control={control}
  name="acceptTerms"
  label="I agree to terms & conditions"
/>
```

## 📝 Usage in Screens

### Simple Form (Email Verification)

```typescript
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {emailSchema, type EmailFormData} from '@/validation';
import {FormInput, Button} from '@/components';

const VerificationScreen = () => {
  const {control, handleSubmit, formState: {errors}} = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: EmailFormData) => {
    console.log('Valid data:', data);
    // API call here
  };

  return (
    <View>
      <FormInput
        control={control}
        name="email"
        placeholder="Enter your email"
      />
      
      <Button
        title="Submit"
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};
```

### Complex Form (Login)

```typescript
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {loginSchema, type LoginFormData} from '@/validation';

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: {errors, isValid, isDirty},
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange', // Validate on every change
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    // All validation passed!
    await login(data.email, data.password);
  };

  return (
    <View>
      <FormInput
        control={control}
        name="email"
        label="Email"
        placeholder="Enter your email"
      />
      
      <FormInput
        control={control}
        name="password"
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
      />
      
      <Button
        title="Sign In"
        disabled={!isValid} // Disable if invalid
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};
```

## 🔧 Validation Modes

React Hook Form supports different validation modes:

```typescript
useForm({
  mode: 'onSubmit',   // Validate on submit (default)
  mode: 'onChange',   // Validate on every change
  mode: 'onBlur',     // Validate on blur
  mode: 'onTouched',  // Validate after first blur
  mode: 'all',        // Validate on change and blur
});
```

## 📋 Available Schemas

### Authentication Schemas

#### `emailSchema`
- email: required, valid email format

#### `loginSchema`
- email: required, valid email format
- password: required, min 6 characters

#### `registerSchema`
- email: required, valid email format
- password: required, min 6 chars, with uppercase, lowercase, number
- confirmPassword: required, must match password
- acceptTerms: must be true

#### `profileSchema`
- name: optional, min 2 characters
- phone: optional, valid phone number format
- bio: optional, max 500 characters

#### `changePasswordSchema`
- currentPassword: required
- newPassword: required, min 6 chars, strong format
- confirmNewPassword: required, must match newPassword
- Cross-validation: new password must differ from current

#### `forgotPasswordSchema`
- email: required, valid email format

#### `resetPasswordSchema`
- code: required, exactly 6 digits
- newPassword: required, min 6 characters
- confirmPassword: required, must match newPassword

## 🎨 Custom Validation

### Add custom validator

```typescript
const customSchema = z.object({
  username: z
    .string()
    .min(3)
    .refine(
      async (username) => {
        // Check if username is available (API call)
        const isAvailable = await checkUsername(username);
        return isAvailable;
      },
      {
        message: 'Username is already taken',
      }
    ),
});
```

### Transform data

```typescript
const transformSchema = z.object({
  email: z.string().email().transform((val) => val.toLowerCase()),
  age: z.string().transform((val) => parseInt(val, 10)),
});
```

## 🐛 Error Handling

### Display field errors

```typescript
const {control, formState: {errors}} = useForm();

// errors object structure:
// errors.email?.message -> "Please enter a valid email"
// errors.password?.message -> "Password is required"
```

### FormInput automatically shows errors

```typescript
<FormInput
  control={control}
  name="email"
  // Error is automatically displayed from formState
/>
```

### Manual error display

```typescript
{errors.email && (
  <Text color="error">{errors.email.message}</Text>
)}
```

## 📚 Best Practices

1. **Define schemas in separate files** - Keep validation logic separate
2. **Export types from schemas** - Use `z.infer<>` for type inference
3. **Use mode wisely** - `onChange` for better UX, `onSubmit` for performance
4. **Provide clear error messages** - User-friendly validation messages
5. **Compose schemas** - Reuse common validation patterns
6. **Test validation** - Write tests for complex validation logic

## 🔗 Resources

- [Zod Documentation](https://zod.dev/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod + React Hook Form Guide](https://react-hook-form.com/get-started#SchemaValidation)

---

Happy validating! 🎉

