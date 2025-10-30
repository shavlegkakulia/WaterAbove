import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {colors, spacing, borderRadius} from '@/theme';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@/navigation/types';
import {Logo, Button, Text, FormInput, Icon} from '@/components';
import {useEmailVerification, useToast} from '@/store/hooks';
import {emailSchema, type EmailFormData} from '@/validation';

const EnvelopeIcon = () => (
  <View style={styles.iconPlaceholder}>
    <Icon name="Mail" size={18} color="#ffffff" />
  </View>
);

export const VerificationScreen: React.FC = () => {
  const {isVerifying, verifyEmail} = useEmailVerification();
  const {showSuccess, showError} = useToast();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const {
    control,
    handleSubmit,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
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
      navigation.navigate('EmailCode', {email: data.email});
      showSuccess('Verification email sent!');
    } else {
      showError(result.error || 'Verification failed. Please try again.');
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  

  return (
    <SafeAreaView style={styles.safeArea}>
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
                size="large"
                loading={isVerifying}
                disabled={isVerifying}
                onPress={handleSubmit(onSubmit)}
                containerStyle={styles.verifyButton}
              />

              {/* Back to Login */}
              <TouchableOpacity
                onPress={handleBackToLogin}
                style={styles.backButton}>
                <Text variant="body" color="textPrimary">
                  Back to Login Screen
                </Text>
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
    marginBottom: spacing.xl,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  input: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  verifyButton: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  backButton: {
    paddingVertical: spacing.sm,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

