import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { spacing } from '@/theme';
import {
  Button,
  Text,
  FormInput,
  FormCard,
  LinkLabel,
  AuthScreenWrapper,
  Icon,
  PasswordVisibilityToggle,
  Input,
} from '@/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';
import { useToast } from '@/store/hooks';
import { passwordSetupSchema, type PasswordSetupFormData } from '@/validation';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/api';
import { moderateScale } from '@/utils';

const EnvelopeIcon = () => (
  <View style={styles.iconPlaceholder}>
    <Icon name="Mail" size={18} color="#ffffff" />
  </View>
);

const LockIcon = () => (
  <View style={styles.iconPlaceholder}>
    <Icon name="Lock" size={18} color="#ffffff" />
  </View>
);

export const SetNewPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'SetNewPassword'>>();
  const { showSuccess, showError } = useToast();
  const email = route.params?.email || '';
  const resetToken = route.params?.resetCode || ''; // Keep resetCode in route params for backward compatibility

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { control, handleSubmit, formState: { isValid } } = useForm<PasswordSetupFormData>({
    resolver: zodResolver(passwordSetupSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { token: string; password: string }) => 
      authService.resetPassword({ token: data.token, password: data.password }),
    onSuccess: () => {
      showSuccess('Password updated successfully!');
      navigation.navigate('PasswordUpdatedSuccess');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Failed to reset password. Please try again.');
    },
  });

  const onSubmit = async (form: PasswordSetupFormData) => {
    if (!resetToken) {
      showError('Reset token is missing. Please request a new password reset link.');
      navigation.navigate('ForgotPassword');
      return;
    }
    await resetPasswordMutation.mutateAsync({ token: resetToken, password: form.password });
  };

  const handleBack = () => {
    navigation.navigate('Login');
  };

  return (
    <AuthScreenWrapper>
      <FormCard>
        <Text variant="heading28Bold" color="textWhiteWA" style={styles.title}>
          Let's get you set up
        </Text>

        <Text variant="heading20Bold" color="textWhiteWA" style={styles.subtitle}>
          Please create a new password
        </Text>

        <View style={styles.input}>
          <Input
            label="Email"
            value={email}
            placeholder="example@example.com"
            state="disabled"
            leftIcon={<EnvelopeIcon />}
          />
        </View>

        <FormInput
          control={control}
          name="password"
          placeholder="Enter Your Password"
          label="Create a Password"
          leftIcon={<LockIcon />}
          secureTextEntry={!showPassword}
          rightIcon={
            <PasswordVisibilityToggle
              visible={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />
          }
          containerStyle={styles.input}
          helpText="Ensure it has 8+ characters, with a mix of upper/lowercase letters, a number, and a special character."
        />

        <FormInput
          control={control}
          name="confirmPassword"
          placeholder="Re-enter Your Password"
          label="Confirm Your Password"
          leftIcon={<LockIcon />}
          secureTextEntry={!showConfirmPassword}
          rightIcon={
            <PasswordVisibilityToggle
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
          containerStyle={styles.input}
        />

        <Button
          title="Save and Continue"
          variant="primary"
          size="small"
          loading={resetPasswordMutation.isPending}
          disabled={resetPasswordMutation.isPending || !isValid}
          onPress={handleSubmit(onSubmit)}
          containerStyle={styles.button}
        />

        <LinkLabel
          onPress={handleBack}
          textVariant="paragraph14Bold"
          style={styles.backLink}
          underline
        >
          Back to Login Screen
        </LinkLabel>
      </FormCard>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginTop: moderateScale(spacing.xxl),
    marginBottom: moderateScale(spacing.md),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: moderateScale(spacing.xl),
  },
  input: {
    width: '100%',
    marginBottom: moderateScale(spacing.xl),
  },
  button: {
    width: '100%',
    marginBottom: moderateScale(spacing.md),
  },
  backLink: {
    marginTop: moderateScale(spacing.md),
    marginBottom: moderateScale(spacing.bordered),
    alignSelf: 'center',
  },
  iconPlaceholder: {
    width: moderateScale(24),
    height: moderateScale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SetNewPasswordScreen;

