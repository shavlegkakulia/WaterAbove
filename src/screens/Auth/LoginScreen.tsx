import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { spacing } from '@/theme';
import {
  Logo,
  Button,
  Text,
  FormInput,
  Checkbox,
  FormCard,
  LinkLabel,
  AuthScreenWrapper,
  Divider,
  PasswordVisibilityToggle,
  SVG_BORDER_HEIGHT,
} from '@/components';
import { EnvelopeIcon, LockIcon } from '@/components/icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useAuth, useToast } from '@/store/hooks';
import { loginSchema, type LoginFormData } from '@/validation';
import { moderateScale } from '@/utils';

export const LoginScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Login'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const prefillEmail = route.params?.email || '';
  const fromAlreadyVerified = route.params?.alreadyVerified === true;
  const { login, isLoading } = useAuth();
  const { showSuccess, showError } = useToast();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange', // Validate on change
    defaultValues: {
      email: prefillEmail,
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    ['ერრორ1', 'ერრორ2', 'ერრორ3', 'ერრორ4', 'ერრორ5'].forEach(async (email) => {
      showError(`Email ${email} is not valid`);
    });
    return;
    const result = await login(data.email, data.password);

    if (result?.success === true) {
      showSuccess('Welcome back!');
      // Navigation will be handled by auth state change
      navigation.navigate('LocationPersonalization', { email: data.email }); // TODO: Change to needed screen
    } else {
      showError(result.error || 'Login failed. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleCreateAccount = () => {
    navigation.navigate('Verification');
  };

  return (
    <AuthScreenWrapper>
      <FormCard>
        {/* Logo */}
        <Logo size={moderateScale(100)} containerStyle={styles.logo} />

        {/* Title */}
        <Text variant="heading28Bold" color="textWhiteWA" style={styles.title}>
          {fromAlreadyVerified
            ? 'Email already verified'
            : 'Login -or- Create an Account to get Started!'}
        </Text>

        {/* Email Input */}
        <FormInput
          control={control}
          name="email"
          placeholder="Enter your email"
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
          leftIcon={<LockIcon />}
          secureTextEntry={!showPassword}
          rightIcon={
            <PasswordVisibilityToggle
              visible={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />
          }
          containerStyle={styles.input}
        />

        {/* Remember Me and Forgot Password */}
        <View style={styles.checkboxRow}>
          <Checkbox
            checked={rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
            label="Remember Me"
            containerStyle={styles.checkboxContainer}
            labelStyle={styles.checkboxLabel}
          />
          <LinkLabel
            onPress={handleForgotPassword}
            textVariant="caption12Regular"
            underline
          >
            Forgot password?
          </LinkLabel>
        </View>

        {/* Login Button */}
        <Button
          title="Login"
          variant="primary"
          size="small"
          loading={isLoading}
          disabled={isLoading || !isValid}
          onPress={handleSubmit(onSubmit)}
          containerStyle={styles.loginButton}
        />

        {/* Divider and Create Account Section */}
        {!fromAlreadyVerified && (
          <View style={styles.dividerContainer}>
            <Divider />
            <View style={styles.createAccountContainer}>
              <Text variant="body16Bold" color="textWhiteWA">
                New here?{' '}
              </Text>
              <LinkLabel
                onPress={handleCreateAccount}
                textVariant="body16Bold"
                underline
              >
                Create an account
              </LinkLabel>
            </View>
          </View>
        )}
        <View style={styles.emptySpace} />
      </FormCard>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: moderateScale(56) - SVG_BORDER_HEIGHT,
    marginBottom: moderateScale(36),
  },
  title: {
    textAlign: 'center',
    marginBottom: moderateScale(36),
  },
  input: {
    width: '100%',
    marginBottom: moderateScale(25),
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(spacing.xl),
    flex: 1,
  },
  checkboxContainer: {
    alignItems: 'center',
  },
  checkboxLabel: {
    marginTop: 0,
  },
  loginButton: {
    width: '100%',
  },
  createAccountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: moderateScale(25),
  },
  dividerContainer: {},
  emptySpace: {
    marginBottom: moderateScale(56) - SVG_BORDER_HEIGHT,
  },
});
