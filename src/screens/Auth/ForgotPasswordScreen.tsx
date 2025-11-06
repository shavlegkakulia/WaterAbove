import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { spacing } from '@/theme';
import {
  Logo,
  Button,
  Text,
  FormInput,
  FormCard,
  LinkLabel,
  AuthScreenWrapper,
  Icon,
  Divider,
} from '@/components';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useToast } from '@/store/hooks';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/api';
import { moderateScale } from '@/utils';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

const EnvelopeIcon = () => (
  <View style={styles.iconPlaceholder}>
    <Icon name="Mail" size={18} color="#ffffff" />
  </View>
);

export const ForgotPasswordScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { showSuccess, showError } = useToast();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const sendEmailMutation = useMutation({
    mutationFn: (data: { email: string }) =>
      authService.sendForgotPasswordEmail(data),
    onSuccess: (response, variables) => {
      if (response.success) {
        showSuccess('Password reset email sent!');
        navigation.navigate('CheckInbox', { email: variables.email });
      } else {
        showError(
          response.message || 'Failed to send reset email. Please try again.',
        );
      }
    },
    onError: (error: any) => {
      showError(
        error?.response?.data?.message ||
          'Failed to send reset email. Please try again.',
      );
    },
  });

  const onSubmit = async (form: ForgotPasswordForm) => {
    await sendEmailMutation.mutateAsync({ email: form.email });
  };

  const handleCreateAccount = () => {
    navigation.navigate('Verification');
  };

  return (
    <AuthScreenWrapper>
      <FormCard>
        <Logo size={moderateScale(100)} containerStyle={styles.logo} />

        <Text variant="heading28Bold" color="textWhiteWA" style={styles.title}>
          Enter your email to get{'\n'}a password reset link
        </Text>

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

        <Button
          title="Login"
          variant="primary"
          size="small"
          loading={sendEmailMutation.isPending}
          disabled={sendEmailMutation.isPending || !isValid}
          onPress={handleSubmit(onSubmit)}
          containerStyle={styles.button}
        />

        <View>
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
        <View style={styles.emptySpace} />
      </FormCard>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: moderateScale(spacing.bordered),
    marginBottom: moderateScale(spacing.xxl),
  },
  title: {
    textAlign: 'center',
    marginBottom: moderateScale(spacing.xl),
  },
  input: {
    width: '100%',
    marginBottom: moderateScale(spacing.xxl),
  },
  button: {
    width: '100%',
  },
  backLink: {
    marginTop: moderateScale(spacing.md),
    alignSelf: 'center',
  },
  iconPlaceholder: {
    width: moderateScale(24),
    height: moderateScale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: moderateScale(25),
  },
  emptySpace: {
    marginBottom: moderateScale(56),
  },
});

export default ForgotPasswordScreen;
