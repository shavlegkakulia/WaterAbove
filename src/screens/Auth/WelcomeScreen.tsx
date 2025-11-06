import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Button, FormCard, Text } from '@/components';
import { AuthScreenWrapper } from '@/components/AuthScreenWrapper';
import { spacing } from '@/theme';
import { moderateScale } from '@/utils';
import { colors } from '@/theme/colors';
import type { RootStackParamList } from '@/navigation/types';

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Welcome'>>();
  const avatarUrl = route.params?.avatarUrl;
  const avatarBase64 = route.params?.avatarBase64;

  const handleLetsDoThis = () => {
    // Navigate to Location Personalization screen
    // Get email from route params if available, or use empty string
    const email = route.params?.email || '';
    navigation.navigate('LocationPersonalization', { email });
  };
  return (
    <AuthScreenWrapper>
      <FormCard>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={
              avatarBase64
                ? { uri: avatarBase64 }
                : avatarUrl
                ? { uri: avatarUrl }
                : require('@/assets/images/avatar.png')
            }
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>

        {/* Welcome Message */}
        <Text
          variant="heading28Bold"
          color="textWhiteWA"
          style={styles.welcomeText}
        >
          Welcome to WatersAbove™ University!
        </Text>

        {/* Instructional Text */}
        <Text
          variant="body16Regular"
          color="textWhiteWA"
          style={styles.instructionText}
        >
          Let's continue personalizing your profile for a unique experience
          tailored exclusively for you.
        </Text>

        {/* Call to Action Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Let's Do This!"
            onPress={handleLetsDoThis}
            variant="primary"
            size="large"
          />
        </View>
      </FormCard>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(spacing.lg),
  },
  card: {
    backgroundColor: colors.gray800,
    borderRadius: moderateScale(24),
    paddingVertical: moderateScale(spacing.xl),
    paddingHorizontal: moderateScale(spacing.lg),
    width: '100%',
    maxWidth: moderateScale(400),
    alignItems: 'center',
  },
  profileImageContainer: {
    paddingTop: moderateScale(spacing.xxl),
    marginBottom: moderateScale(spacing.lg),
  },
  profileImage: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    overflow: 'hidden',
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: moderateScale(spacing.md),
  },
  instructionText: {
    textAlign: 'center',
    marginBottom: moderateScale(spacing.xl),
    paddingHorizontal: moderateScale(spacing.md),
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: moderateScale(spacing.md),
    paddingBottom: moderateScale(spacing.xxl),
  },
});
