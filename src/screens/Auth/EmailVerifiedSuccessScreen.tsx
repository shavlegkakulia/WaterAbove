import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '@/theme';
import {
  Button,
  Text,
  FormCard,
  AuthScreenWrapper,
  MailCheckIcon,
} from '@/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';
import { moderateScale } from '@/utils';

export const EmailVerifiedSuccessScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route =
    useRoute<RouteProp<RootStackParamList, 'EmailVerifiedSuccess'>>();
  const email = route.params?.email;

  const handleContinue = () => {
    navigation.navigate('PasswordSetup', { email: email || '' });
  };

  return (
    <AuthScreenWrapper
      withKeyboardAvoiding={false}
      withScrollView={false}
      contentContainerStyle={styles.container}
    >
      <FormCard>
        <View style={styles.iconWrap}>
          <MailCheckIcon width={moderateScale(80)} height={moderateScale(80)} />
        </View>
        <Text variant="heading28Bold" color="textWhiteWA" style={styles.title}>
          Email Verification Successful!
        </Text>
        <Text variant="paragraph14Bold" color="textWhiteWA" style={styles.subtitle}>
          Your email has been verified. Continue setting up your account.
        </Text>
        <Button
          title="Continue"
          variant="primary"
          size="small"
          onPress={handleContinue}
          containerStyle={styles.button}
        />
      </FormCard>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(spacing.md),
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:moderateScale(spacing.bordered),
    marginTop: moderateScale(spacing.bordered),
  },
  title: { textAlign: 'center', marginBottom: moderateScale(spacing.bordered) },
  subtitle: {
    textAlign: 'center',
    marginBottom: moderateScale(spacing.bordered),
    color: '#D6E7E3',
    // Uses paragraphSmallBold variant from typography (14px, 700, 20 lineHeight)
  },
  button: { width: '100%', marginBottom: moderateScale(spacing.bordered) },
});
