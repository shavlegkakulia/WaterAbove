import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {colors, spacing, borderRadius} from '@/theme';
import {Logo, Button, Text, FormInput, FormCheckbox} from '@/components';
import {useAuth, useToast} from '@/store/hooks';
import {loginSchema, type LoginFormData} from '@/validation';

// Mock icons - replace with react-native-vector-icons
const EnvelopeIcon = () => (
  <View style={styles.iconPlaceholder}>
    <Text variant="body" color="white">✉️</Text>
  </View>
);

const LockIcon = () => (
  <View style={styles.iconPlaceholder}>
    <Text variant="body" color="white">🔒</Text>
  </View>
);

export const LoginScreen: React.FC = () => {
  const {login, isLoading} = useAuth();
  const {showSuccess, showError} = useToast();
  
  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange', // Validate on change
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data.email, data.password);
    
    if (result.success) {
      showSuccess('Welcome back!');
      // Navigation will be handled by auth state change
    } else {
      showError(result.error || 'Login failed. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    console.log('Navigate to forgot password');
  };

  const handleSignUp = () => {
    console.log('Navigate to sign up');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.background}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <View style={styles.card}>
                {/* Logo */}
                <Logo size={100} containerStyle={styles.logo} />

                {/* Title */}
                <Text
                  variant="heading2"
                  color="textPrimary"
                  style={styles.title}>
                  Welcome Back
                </Text>
                <Text
                  variant="body"
                  color="textSecondary"
                  style={styles.subtitle}>
                  Sign in to your account
                </Text>

                {/* Email Input */}
                <FormInput
                  control={control}
                  name="email"
                  placeholder="Enter your email"
                  label="Email"
                  leftIcon={<EnvelopeIcon />}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  containerStyle={styles.input}
                />

                {/* Password Input */}
                <FormInput
                  control={control}
                  name="password"
                  placeholder="Enter your password"
                  label="Password"
                  leftIcon={<LockIcon />}
                  secureTextEntry
                  containerStyle={styles.input}
                />

                {/* Forgot Password */}
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  style={styles.forgotPassword}>
                  <Text variant="body" color="info">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                {/* Login Button */}
                <Button
                  title="Sign In"
                  variant="primary"
                  size="large"
                  loading={isLoading}
                  disabled={isLoading || !isValid}
                  onPress={handleSubmit(onSubmit)}
                  containerStyle={styles.loginButton}
                />

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text variant="caption" color="textSecondary" style={styles.dividerText}>
                    OR
                  </Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Sign Up */}
                <TouchableOpacity
                  onPress={handleSignUp}
                  style={styles.signUpButton}>
                  <Text variant="body" color="textSecondary">
                    Don't have an account?{' '}
                    <Text variant="bodyBold" color="primary">
                      Sign Up
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  keyboardView: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.xl,
    alignItems: 'center',
  },
  logo: {
    marginBottom: spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  input: {
    width: '100%',
    marginBottom: spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  loginButton: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray700,
  },
  dividerText: {
    marginHorizontal: spacing.md,
  },
  signUpButton: {
    paddingVertical: spacing.sm,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

