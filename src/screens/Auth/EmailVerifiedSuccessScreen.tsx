import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, spacing, borderRadius} from '@/theme';
import {Logo, Button, Text, Icon} from '@/components';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import type {RootStackParamList} from '@/navigation/types';

export const EmailVerifiedSuccessScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EmailVerifiedSuccess'>>();
  const email = route.params?.email;

  const handleContinue = () => {
    navigation.navigate('Login', {email});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Logo size={80} containerStyle={styles.logo} />
          <View style={styles.iconWrap}>
            <Icon name="Mail" size={56} color={colors.textPrimary} />
            <View style={styles.checkOverlay}>
              <Icon name="Check" size={22} color="#10b981" />
            </View>
          </View>
          <Text variant="heading2" color="textPrimary" style={styles.title}>
            Email Verification
            {'\n'}Successful!
          </Text>
          <Text variant="body" color="textSecondary" style={styles.subtitle}>
            Your email has been verified. Continue setting up your account.
          </Text>
          <Button title="Continue" variant="secondary" size="large" onPress={handleContinue} containerStyle={styles.button} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.xl,
    alignItems: 'center',
  },
  logo: {marginBottom: spacing.lg},
  iconWrap: {
    marginTop: spacing.sm,
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginBottom: spacing.lg,
  },
  checkOverlay: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16,185,129,0.15)',
  },
  title: {textAlign: 'center', marginBottom: spacing.md},
  subtitle: {textAlign: 'center', marginBottom: spacing.xl},
  button: {width: '100%'},
});

export default EmailVerifiedSuccessScreen;


