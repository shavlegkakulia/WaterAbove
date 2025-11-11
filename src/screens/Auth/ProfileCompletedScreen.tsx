import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { CommonActions } from '@react-navigation/native';

import { AuthScreenWrapper, ProfileCompletedIcon, Text } from '@/components';
import { colors, lineHeight, spacing } from '@/theme';
import { moderateScale } from '@/utils';
import { useAppNavigation, useAppRoute } from '@/navigation';
import { useUpdateUserMutation } from '@/api/query';

export const ProfileCompletedScreen: React.FC = () => {
  const navigation = useAppNavigation<'ProfileCompleted'>();
  const route = useAppRoute<'ProfileCompleted'>();
  const email = route.params?.email;
  const [isCtaPressed, setIsCtaPressed] = React.useState(false);
  const updateUserMutation = useUpdateUserMutation();
  const hasUpdatedRef = React.useRef(false);

  React.useEffect(() => {
    if (hasUpdatedRef.current) {
      return;
    }
    hasUpdatedRef.current = true;

    updateUserMutation.mutate(
      {
        userData: {},
        profileData: {
          profileCompletionPercentage: 100,
        },
      },
      {
        onError: error => {
          console.error(
            '[ProfileCompletedScreen] Failed to update profile completion:',
            error,
          );
        },
      },
    );
  }, [updateUserMutation]);

  const handleContinue = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login', params: { email } }],
      }),
    );
  };

  return (
    <AuthScreenWrapper>
      <View style={styles.content}>
        <BlurView
          blurType="dark"
          blurAmount={10}
          style={styles.iconContainer}
        >
          <View style={styles.iconInner}>
            <ProfileCompletedIcon size={120} />
          </View>
          <Text style={styles.title}>
            Profile Completed
          </Text>
        </BlurView>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleContinue}
          onPressIn={() => setIsCtaPressed(true)}
          onPressOut={() => setIsCtaPressed(false)}
          style={[
            styles.ctaWrapper,
            isCtaPressed && styles.ctaWrapperActive,
          ]}
        >
          <BlurView
            blurType="dark"
            blurAmount={18}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>
              Now let's take the clear pill
            </Text>
          </BlurView>
        </TouchableOpacity>
      </View>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: moderateScale(spacing.xxxl),
    paddingHorizontal: moderateScale(spacing.lg),
    rowGap: moderateScale(spacing.xl),
  },
  iconContainer: {
    width: moderateScale(280),
    height: moderateScale(280),
    borderRadius: moderateScale(140),
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  iconInner: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(28),
    padding: moderateScale(spacing.md),
  },
  title: {
    color: colors.white,
    fontSize: moderateScale(22),
    fontWeight: '700',
    lineHeight: moderateScale(lineHeight.xxxxl),
  },
  ctaWrapper: {
    marginTop: moderateScale(spacing.bordered),
    borderRadius: moderateScale(40),
    overflow: 'hidden',
  },
  ctaWrapperActive: {
    borderWidth: 1,
    borderColor: '#46C2A3',
  },
  ctaButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(12, 27, 51, 0.4)',
  },
  ctaText: {
    color: colors.white,
    fontSize: moderateScale(22),
    fontWeight: '400',
    lineHeight: moderateScale(lineHeight.heading3Bold),
    textAlign: 'center',
    paddingHorizontal: moderateScale(spacing.xl),
    paddingVertical: moderateScale(spacing.md),
  },
});

export default ProfileCompletedScreen;
