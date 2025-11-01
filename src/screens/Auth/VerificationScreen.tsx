import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { spacing } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import {
  Logo,
  Button,
  Text,
  FormInput,
  Icon,
  FormCard,
  LinkLabel,
  AuthScreenWrapper,
} from '@/components';
import { useEmailVerification, useToast } from '@/store/hooks';
import { emailSchema, type EmailFormData } from '@/validation';
import { moderateScale } from '@/utils';

const EnvelopeIcon = () => (
  <View style={styles.iconPlaceholder}>
    <Icon name="Mail" size={18} color="#ffffff" />
  </View>
);

export const VerificationScreen: React.FC = () => {
  const { isVerifying, verifyEmail } = useEmailVerification();
  const { showSuccess, showError } = useToast();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { control, handleSubmit } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const { isValid } = useFormState({
    control,
  });

  const onSubmit = async (data: EmailFormData) => {
    const result = await verifyEmail(data.email);

    if (result.success) {
      if ((result as any).alreadyVerified) {
        navigation.navigate('Login', {
          email: (result as any).user?.email || data.email,
          alreadyVerified: true,
        });
        return;
      }
      // Navigate to code entry screen
      navigation.navigate('EmailCode', { email: data.email });
      showSuccess('Verification email sent!');
    } else {
      showError(result.error || 'Verification failed. Please try again.');
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  const isButtonDisabled = isVerifying || !isValid;

  return (
    <AuthScreenWrapper>
      <FormCard>
        {/* Logo */}
        <Logo size={moderateScale(100)} containerStyle={styles.logo} />

        {/* Title */}
        <Text variant="heading28Bold" color="textWhiteWA" style={styles.title}>
          Register and verify your account to access the platform
        </Text>

        {/* Email Input */}
        <FormInput
          control={control}
          name="email"
          placeholder="Enter Your Email Address"
          leftIcon={<EnvelopeIcon />}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.input}
        />

        {/* Verify Button */}
        <Button
          title="Verify Email"
          variant="primary"
          size="small"
          loading={isVerifying}
          disabled={isButtonDisabled}
          onPress={handleSubmit(onSubmit)}
          containerStyle={styles.verifyButton}
        />

        {/* Back to Login */}
        <LinkLabel onPress={handleBackToLogin} textVariant="paragraph14Bold" underline style={styles.backToLoginLink}>Back to Login Screen</LinkLabel>
      </FormCard>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: moderateScale(spacing.bordered),
    marginBottom: moderateScale(spacing.bordered),
  },
  title: {
    textAlign: 'center',
    marginBottom: moderateScale(spacing.bordered),
  },
  input: {
    width: '100%',
    marginBottom: moderateScale(spacing.bordered),
  },
  verifyButton: {
    width: '100%',
    marginBottom: moderateScale(spacing.bordered),
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToLoginLink: {
    marginBottom: moderateScale(spacing.bordered),
  },
});
