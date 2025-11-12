import React from 'react';
import { StyleSheet } from 'react-native';
import { spacing } from '@/theme';
import {
  Logo,
  Text,
  FormCard,
  LinkLabel,
  AuthScreenWrapper,
  SVG_BORDER_HEIGHT,
} from '@/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';
import { moderateScale } from '@/utils';

export const CheckInboxScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CheckInbox'>>();
  const email = route.params?.email || '';

  const handleBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <AuthScreenWrapper>
      <FormCard>
        <Logo size={moderateScale(100)} containerStyle={styles.logo} />

        <Text variant="heading28Bold" color="textWhiteWA" style={styles.title}>
          Check Your Inbox
        </Text>

        <Text variant="heading20Bold" color="textWhiteWA" style={styles.text}>
          If there is an account linked with
        </Text>
        <Text variant="heading20Bold" color="textWhiteWA" style={styles.email}>
          {email}
        </Text>
        <Text variant="heading20Bold" color="textWhiteWA" style={styles.text}>
          you'll find an email with a link to reset 
          {' '}your password from your browser.
        </Text>

        <Text variant="heading20Bold" color="textWhiteWA" style={styles.securityText}>
          For security, the link will {'\n'} expire after 30 minutes.
        </Text>

        <LinkLabel
          onPress={handleBack}
          textVariant="paragraph14Bold"
          style={styles.backLink}
          underline
        >
          Back to Login Screen
        </LinkLabel>
      </FormCard>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: moderateScale(spacing.bordered) - SVG_BORDER_HEIGHT,
    marginBottom: moderateScale(spacing.xxl),
  },
  title: {
    textAlign: 'center',
    marginBottom: moderateScale(spacing.xl),
  },
  text: {
    textAlign: 'center',
    fontWeight: '400',
  },
  backLink: {
    marginTop: moderateScale(spacing.xl),
    alignSelf: 'center',
    marginBottom: moderateScale(spacing.bordered) - SVG_BORDER_HEIGHT,
  },
  email: {
    textAlign: 'center',
  },
  securityText: {
    textAlign: 'center',
    marginTop: moderateScale(spacing.xl),
    fontWeight: '400',
  },
});

export default CheckInboxScreen;

