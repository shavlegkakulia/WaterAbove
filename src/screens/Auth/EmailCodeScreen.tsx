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
} from '@/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';
import { useEmailVerification, useToast } from '@/store/hooks';
import { useVerifyEmailCodeMutation } from '@/api/query';
import { useSetAtom } from 'jotai';
import { authTokenAtom, isAuthenticatedAtom, userAtom } from '@/store/atoms';
import { setAuthToken as setAxiosAuthToken } from '@/api';
import { moderateScale } from '@/utils';

// Validation: exactly 6 digits, numbers only, no symbols
const codeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(6, 'Code must be exactly 6 digits')
    .max(6, 'Code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Code must contain only numbers (6 digits)'),
});

type CodeForm = z.infer<typeof codeSchema>;

export const EmailCodeScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EmailCode'>>();
  const { verifyEmail } = useEmailVerification();
  const { showSuccess, showError } = useToast();

  const email = route.params?.email || '';

  const { control, handleSubmit } = useForm<CodeForm>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: '' },
  });

  // Filter: only numbers, max 6 digits
  const filterCodeInput = (text: string): string => {
    const numericOnly = text.replace(/[^0-9]/g, '');
    return numericOnly.slice(0, 6);
  };

  const verifyCodeMutation = useVerifyEmailCodeMutation();
  const setAuthToken = useSetAtom(authTokenAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setUser = useSetAtom(userAtom);

  const onSubmit = async (form: CodeForm) => {
    const response = await verifyCodeMutation.mutateAsync({
      email,
      code: form.code,
    });
    if (response.success) {
      // If server returned tokens like status endpoint, persist and set headers
      const accessToken = (response as any).data?.accessToken;
      const user = (response as any).data?.user;
      if (accessToken) {
        setAuthToken(accessToken);
        setAxiosAuthToken(accessToken);
        setIsAuthenticated(true);
      }
      if (user) {
        setUser(user);
      }
      showSuccess('Verification complete.');
      navigation.navigate('EmailVerifiedSuccess', { email });
    } else {
      const error =
        response.error || 'Invalid or expired code. Please try again.';
      showError(error);
    }
  };

  const handleResend = async () => {
    await verifyEmail(email);
  };

  const handleBack = () => navigation.navigate('Login');

  return (
    <AuthScreenWrapper>
      <FormCard>
        <Logo size={moderateScale(100)} containerStyle={styles.logo} />

        <Text variant="heading28Bold" color="textWhiteWA" style={styles.title}>
          Enter the 6-digit code
          {'\n'}sent to your email to
          {'\n'}continue
        </Text>

        <FormInput
          control={control}
          name="code"
          placeholder="000-000"
          label="Enter Code"
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={6}
          containerStyle={styles.input}
          onChangeTextFilter={filterCodeInput}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Verify Email"
            variant="primary"
            size="small"
            onPress={handleSubmit(onSubmit)}
            containerStyle={styles.verifyButton}
          />

          <LinkLabel onPress={handleResend} textVariant="caption12Regular" style={styles.resendButton}>
            Resend Code
          </LinkLabel>
        </View>

        <LinkLabel
          onPress={handleBack}
          textVariant="paragraph14Bold"
          style={styles.backButton}
        >
          Back to Login Screen
        </LinkLabel>
      </FormCard>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: moderateScale(spacing.bordered),
    marginBottom: moderateScale(spacing.bordered),
  },
  title: { textAlign: 'center', marginBottom: moderateScale(spacing.bordered) },
  input: { width: '100%', marginBottom: moderateScale(spacing.bordered) },
  verifyButton: {
    width: '100%',
  },
  backButton: {
    marginBottom: moderateScale(spacing.bordered),
  },
  buttonContainer: {
    width: '100%',
    marginBottom: moderateScale(spacing.bordered),
  },
  resendButton: {
    marginTop: moderateScale(spacing.md),
    alignSelf: 'center',
  },
});

export default EmailCodeScreen;
