import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, AppState, AppStateStatus } from 'react-native';
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

  // Countdown timer state (60 seconds = 1 minute)
  const [countdown, setCountdown] = useState(60);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const countdownStartTimeRef = useRef<number | null>(null);
  const remainingTimeRef = useRef<number>(60);

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

  // Start countdown timer function (reusable)
  const startCountdown = React.useCallback((initialSeconds: number = 60) => {
    // Clear any existing interval
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    
    // Reset countdown
    remainingTimeRef.current = initialSeconds;
    setCountdown(initialSeconds);
    countdownStartTimeRef.current = Date.now();
    
    // Start new interval
    countdownRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - (countdownStartTimeRef.current || Date.now())) / 1000);
      const newCountdown = Math.max(0, initialSeconds - elapsed);
      
      setCountdown(newCountdown);
      remainingTimeRef.current = newCountdown;
      
      if (newCountdown <= 0) {
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
        countdownStartTimeRef.current = null;
      }
    }, 1000);
  }, []);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground - recalculate countdown
        if (countdownStartTimeRef.current !== null && remainingTimeRef.current > 0) {
          const elapsed = Math.floor((Date.now() - countdownStartTimeRef.current) / 1000);
          const remaining = Math.max(0, remainingTimeRef.current - elapsed);
          
          if (remaining > 0) {
            // Resume countdown from remaining time
            startCountdown(remaining);
          } else {
            // Countdown expired while in background
            setCountdown(0);
            remainingTimeRef.current = 0;
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            countdownStartTimeRef.current = null;
          }
        }
      } else if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App has gone to the background - save current state
        // The interval will continue running, but we track elapsed time
        if (countdownRef.current && countdownStartTimeRef.current !== null) {
          // Time is already being tracked in countdownStartTimeRef
          // Just pause the visual update (interval continues)
        }
      }
      
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [startCountdown]);

  // Start countdown timer when component mounts
  useEffect(() => {
    startCountdown(60);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [startCountdown]);

  // Format countdown as MM:SS
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
    if (countdown > 0) return; // Prevent resend if countdown is active
    
    const result = await verifyEmail(email);
    if (result.success) {
      showSuccess('Verification code sent!');
      // Restart countdown timer
      startCountdown();
    } else {
      showError(result.error || 'Failed to resend code. Please try again.');
    }
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

          <LinkLabel
            onPress={handleResend}
            textVariant="caption12Regular"
            style={[
              styles.resendButton,
              countdown > 0 && styles.resendButtonDisabled,
            ]}
            disabled={countdown > 0}
            color={countdown > 0 ? 'textSecondary' : 'textWhiteWA'}
          >
            {countdown > 0 ? `Resend in ${formatCountdown(countdown)}` : 'Resend Code'}
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
  resendButtonDisabled: {
    opacity: 0.6,
  },
});

export default EmailCodeScreen;
