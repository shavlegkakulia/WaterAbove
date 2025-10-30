import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {colors, spacing, borderRadius} from '@/theme';
import {Logo, Button, Text, FormInput} from '@/components';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import type {RootStackParamList} from '@/navigation/types';
import {useEmailVerification, useToast} from '@/store/hooks';
import {useVerifyEmailCodeMutation} from '@/api/query';
import {useSetAtom} from 'jotai';
import {authTokenAtom, isAuthenticatedAtom, userAtom} from '@/store/atoms';
import {setAuthToken as setAxiosAuthToken} from '@/api';

// Validation: 6 digits (allow hyphen visual like 000-000)
const codeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{3}-?\d{3}$/i, 'Enter 6 digits (e.g. 000000 or 000-000)'),
});

type CodeForm = z.infer<typeof codeSchema>;

export const EmailCodeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EmailCode'>>();
  const {verifyEmail} = useEmailVerification();
  const {showSuccess, showError} = useToast();

  const email = route.params?.email || '';

  const {control, handleSubmit} = useForm<CodeForm>({
    resolver: zodResolver(codeSchema),
    defaultValues: {code: ''},
  });

  const verifyCodeMutation = useVerifyEmailCodeMutation();
  const setAuthToken = useSetAtom(authTokenAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setUser = useSetAtom(userAtom);

  const onSubmit = async (form: CodeForm) => {
    const cleanCode = form.code.replace('-', '');
    const response = await verifyCodeMutation.mutateAsync({email, code: cleanCode});
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
      navigation.navigate('EmailVerifiedSuccess', {email});
    } else {
      const error = response.error || 'Invalid or expired code. Please try again.';
      showError(error);
    }
  };

  const handleResend = async () => {
    await verifyEmail(email);
  };

  const handleBack = () => navigation.navigate('Login');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.card}>
              <Logo size={100} containerStyle={styles.logo} />

              <Text variant="heading2" color="textPrimary" style={styles.title}>
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
                containerStyle={styles.input}
              />

              <Button title="Verify Email" variant="primary" size="large" onPress={handleSubmit(onSubmit)} containerStyle={styles.verifyButton} />

              <TouchableOpacity onPress={handleResend} style={styles.linkButton}>
                <Text variant="body" color="info">Resend Code</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Text variant="body" color="textPrimary">Back to Login Screen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  background: { flex: 1 },
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
  logo: { marginBottom: spacing.xl },
  title: { textAlign: 'center', marginBottom: spacing.xl },
  input: { width: '100%', marginBottom: spacing.lg },
  verifyButton: { width: '100%', marginBottom: spacing.lg },
  linkButton: { paddingVertical: spacing.sm },
  backButton: { paddingVertical: spacing.md },
});

export default EmailCodeScreen;


