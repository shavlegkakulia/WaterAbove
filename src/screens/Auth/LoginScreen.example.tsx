/**
 * Example: Login Screen with TanStack Query
 * 
 * This is an example showing how to use React Query mutations
 * Copy patterns from here to your actual LoginScreen
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useLoginMutation} from '@/api/query';
import {Button, FormInput, Text} from '@/components';
import {colors, spacing} from '@/theme';
import {loginSchema, type LoginFormData} from '@/validation';

export const LoginScreenExample: React.FC = () => {
  const {control, handleSubmit} = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // TanStack Query mutation
  const loginMutation = useLoginMutation();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (response) => {
          console.log('✅ Login successful:', response.user);
          // Navigate to home screen
        },
        onError: (error: any) => {
          console.error('❌ Login failed:', error);
          const message = error.response?.data?.message || 'Login failed';
          alert(message);
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text variant="heading1" style={styles.title}>
        Login
      </Text>

      <FormInput
        control={control}
        name="email"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <FormInput
        control={control}
        name="password"
        placeholder="Password"
        secureTextEntry
      />

      <Button
        title="Login"
        onPress={handleSubmit(onSubmit)}
        loading={loginMutation.isPending}
        disabled={loginMutation.isPending}
      />

      {/* Show error */}
      {loginMutation.isError && (
        <Text variant="caption" color="error" style={styles.error}>
          {loginMutation.error?.message || 'Login failed'}
        </Text>
      )}

      {/* Show success */}
      {loginMutation.isSuccess && (
        <Text variant="caption" color="success" style={styles.success}>
          Login successful! ✅
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.backgroundDark,
  },
  title: {
    marginBottom: spacing.xl,
  },
  error: {
    marginTop: spacing.md,
  },
  success: {
    marginTop: spacing.md,
  },
});

