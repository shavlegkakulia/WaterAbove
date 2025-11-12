import React from 'react';
import { StyleSheet } from 'react-native';
import { spacing } from '@/theme';
import {
  Logo,
  Button,
  Text,
  FormCard,
  AuthScreenWrapper,
  SVG_BORDER_HEIGHT,
} from '@/components';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { moderateScale } from '@/utils';

export const PasswordUpdatedSuccessScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleGoToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <AuthScreenWrapper>
      <FormCard>
        <Logo size={moderateScale(100)} containerStyle={styles.logo} />

        <Text variant="heading28Bold" color="textWhiteWA" style={styles.title}>
          Your password has been successfully updated.
        </Text>

        <Button
          title="Go to Login"
          variant="primary"
          size="small"
          onPress={handleGoToLogin}
          containerStyle={styles.button}
        />
      </FormCard>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: moderateScale(110) - SVG_BORDER_HEIGHT,
    marginBottom: moderateScale(spacing.bordered),
  },
  title: {
    textAlign: 'center',
    marginBottom: moderateScale(spacing.bordered),
  },
  button: {
    width: '100%',
    marginTop: moderateScale(spacing.xl),
    marginBottom: moderateScale(110) - SVG_BORDER_HEIGHT,
  },
});

export default PasswordUpdatedSuccessScreen;

