import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { spacing } from '@/theme';
import {
  Button,
  Text,
  FormInput,
  FormCard,
  AuthScreenWrapper,
  Input,
  PasswordVisibilityToggle,
} from '@/components';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';
import { useToast } from '@/store/hooks';
import { passwordSetupSchema, type PasswordSetupFormData } from '@/validation';
import { moderateScale } from '@/utils';

export const PasswordSetupScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'PasswordSetup'>>();
  const email = route.params?.email || '';
  const { showSuccess } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<PasswordSetupFormData>({
    resolver: zodResolver(passwordSetupSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordSetupFormData) => {
    // TODO: Implement password setup API call
    console.log('Password setup:', { email, password: data.password });
    showSuccess('Password created successfully!');
    // Navigate to next screen or login
    // navigation.navigate('Login', { email });
  };

  return (
    <AuthScreenWrapper>
      <FormCard>
        {/* Title */}
        <Text variant="heading28Bold" color="textWhiteWA" style={styles.title}>
          Let's get you set up
        </Text>
        <Text variant="heading20Bold" color="textWhiteWA" style={styles.subtitle}>
          Create a password to continue
        </Text>

        {/* Email Input (Disabled) */}
        <View style={styles.input}>
          <Input
            label="Email"
            value={email}
            placeholder="example@example.com"
            state="disabled"
          />
        </View>

        {/* Create Password Input */}
        <FormInput
          control={control}
          name="password"
          label="Create a Password"
          placeholder="Enter Your Password"
          secureTextEntry={!showPassword}
          rightIcon={
            <PasswordVisibilityToggle
              visible={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />
          }
          containerStyle={styles.input}
          
        />
        <Text variant="caption12Regular" color="textPrimary" style={styles.requirementText}>
          Ensure it has 8+ characters, with a mix of upper/lowercase letters, a number, and a special character.
        </Text>

        {/* Confirm Password Input */}
        <FormInput
          control={control}
          name="confirmPassword"
          label="Confirm Your Password"
          placeholder="Re-enter Your Password"
          secureTextEntry={!showConfirmPassword}
          rightIcon={
            <PasswordVisibilityToggle
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
          containerStyle={styles.input}
        />

        {/* Save and Continue Button */}
        <Button
          title="Save and Continue"
          variant="primary"
          size="small"
          disabled={!isValid}
          onPress={handleSubmit(onSubmit)}
          containerStyle={styles.button}
        />
      </FormCard>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginTop: moderateScale(spacing.xxxl),
    marginBottom: moderateScale(22),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: moderateScale(22),
    color: '#D6E7E3',
    // Uses heading3Bold variant from typography (20px, 700, 24.255 lineHeight)
  },
  input: {
    width: '100%',
    marginBottom: moderateScale(34),
  },
  requirementText: {
    marginTop: -moderateScale(30),
    marginBottom: moderateScale(spacing.md),
    marginLeft: moderateScale(spacing.md),
    color: '#F1F1F1',
    // Uses caption variant from typography (12px, 400, 16 lineHeight)
  },
  button: {
    width: '100%',
    marginBottom: moderateScale(spacing.xxxl),
  },
});

export default PasswordSetupScreen;

