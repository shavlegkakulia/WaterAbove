import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  AuthScreenWrapper,
  FormCard,
  Button,
  Text,
  CircularProgressBar,
  FormInput,
  SVG_BORDER_HEIGHT,
} from '@/components';
import { Icon } from '@/components/ui/Icon';
import { colors, lineHeight, spacing } from '@/theme';
import { moderateScale } from '@/utils';
import { useUpdateUserMutation, useUserQuery } from '@/api/query';
import { useToast } from '@/store/hooks';
import type { UserEmploymentStatus, UserLevelOfEducation } from '@/api/types';
import { useAppNavigation, useAppRoute } from '@/navigation';
import { getAgeFromProfile, isUnderMinimumAge } from '@/utils/profile';

const careerPersonalizationSchema = z.object({
  employmentStatus: z.array(z.string()).optional(),
  educationLevel: z.string().optional(),
  educationField: z.string().optional(),
  educationSchool: z.string().optional(),
});

type CareerPersonalizationFormData = z.infer<
  typeof careerPersonalizationSchema
>;

const EMPLOYMENT_STATUS_OPTIONS: Array<{
  value: UserEmploymentStatus;
  label: string;
}> = [
  // { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  { value: 'entrepreneur', label: 'Entrepreneur' },
  { value: 'self-employed', label: 'Self-Employed' },
  { value: 'homemaker', label: 'Homemaker' },
  { value: 'student', label: 'Student' },
  { value: 'retired', label: 'Retired' },
  { value: 'employee', label: 'Employee' },
  { value: 'looking-for-work', label: 'Looking for work' },
  { value: 'hiring', label: 'Hiring' },
  { value: 'side-hustler', label: 'Side Hustler' },
  { value: 'unemployed', label: 'Unemployed' },
];

const EDUCATION_LEVEL_OPTIONS: Array<{
  value: UserLevelOfEducation;
  label: string;
}> = [
  // { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  { value: 'no-formal-education', label: 'No Formal Education' },
  { value: 'some-high-school', label: 'Some High School' },
  { value: 'high-school-diploma-ged', label: 'High School Diploma / GED' },
  { value: 'associates-degree', label: "Associate's Degree" },
  { value: 'bachelors-degree', label: "Bachelor's Degree" },
  { value: 'masters-degree', label: "Master's Degree" },
  { value: 'doctorate-degree', label: 'Doctorate Degree' },
  { value: 'professional-degree', label: 'Professional Degree' },
  { value: 'trade-technical', label: 'Trade / Technical' },
];

export const CareerPersonalizationScreen: React.FC = () => {
  const navigation = useAppNavigation<'CareerPersonalization'>();
  const route = useAppRoute<'CareerPersonalization'>();
  const { showSuccess } = useToast();
  const updateUserMutation = useUpdateUserMutation();
  const { data: userData } = useUserQuery();

  const emailFromParams = route.params?.email;
  const initialPercentage = route.params?.profileCompletionPercentage ?? 80;
  const userProfileFromRoute = route.params?.userProfile;
  const [profileCompletionPercentage, setProfileCompletionPercentage] =
    useState(initialPercentage);

  const canGoBack = navigation.canGoBack();

  const userProfile = useMemo(() => {
    return userProfileFromRoute || userData?.data?.user?.profile || null;
  }, [userData, userProfileFromRoute]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<CareerPersonalizationFormData>({
    resolver: zodResolver(careerPersonalizationSchema),
    mode: 'onChange',
    defaultValues: {
      employmentStatus: [],
      educationLevel: '',
      educationField: '',
      educationSchool: '',
    },
  });

  const selectedEmploymentStatus = watch('employmentStatus') ?? [];
  const selectedEducationLevel = watch('educationLevel');

  useEffect(() => {
    if (userProfile) {
      if (
        Array.isArray(userProfile.employmentStatus) &&
        userProfile.employmentStatus.length > 0
      ) {
        setValue(
          'employmentStatus',
          userProfile.employmentStatus as UserEmploymentStatus[],
          {
            shouldValidate: true,
          },
        );
      }

      if (
        typeof userProfile.educationLevel === 'string' &&
        userProfile.educationLevel.length > 0
      ) {
        setValue(
          'educationLevel',
          userProfile.educationLevel as UserLevelOfEducation,
          {
            shouldValidate: true,
          },
        );
      }

      if (typeof userProfile.educationField === 'string') {
        setValue('educationField', userProfile.educationField, {
          shouldValidate: true,
        });
      }

      if (typeof userProfile.educationSchool === 'string') {
        setValue('educationSchool', userProfile.educationSchool, {
          shouldValidate: true,
        });
      }

      if (
        userProfile.profileCompletionPercentage !== null &&
        userProfile.profileCompletionPercentage !== undefined
      ) {
        setProfileCompletionPercentage(userProfile.profileCompletionPercentage);
      }
    }
  }, [setValue, userProfile]);

  const handleEmploymentStatusToggle = (value: UserEmploymentStatus) => {
    const current = selectedEmploymentStatus ?? [];
    if (current.includes(value)) {
      const updated = current.filter(item => item !== value);
      setValue('employmentStatus', updated, { shouldValidate: true });
    } else {
      if (current.length >= 3) {
        return;
      }
      setValue('employmentStatus', [...current, value], {
        shouldValidate: true,
      });
    }
  };

  const handleEducationLevelSelect = (value: UserLevelOfEducation) => {
    setValue('educationLevel', value, { shouldValidate: true });
  };

  const onSubmit = async (formData: CareerPersonalizationFormData) => {
    try {
      const trimmedField = formData.educationField?.trim() ?? '';
      const trimmedSchool = formData.educationSchool?.trim() ?? '';

      const response = await updateUserMutation.mutateAsync({
        userData: {},
        profileData: {
          profileCompletionPercentage: 90,
          employmentStatus:
            formData.employmentStatus && formData.employmentStatus.length > 0
              ? (formData.employmentStatus as UserEmploymentStatus[])
              : undefined,
          educationLevel:
            formData.educationLevel && formData.educationLevel.length > 0
              ? formData.educationLevel
              : undefined,
          educationField: trimmedField.length > 0 ? trimmedField : undefined,
          educationSchool: trimmedSchool.length > 0 ? trimmedSchool : undefined,
        },
      });

      if (response.success && response.data) {
        const updatedProfile = response.data.user?.profile;
        const updatedPercentage = updatedProfile?.profileCompletionPercentage;

        if (typeof updatedPercentage === 'number') {
          setProfileCompletionPercentage(updatedPercentage);
        }

        showSuccess('Profile updated successfully!');
        const resolvedEmail =
          emailFromParams ?? userData?.data?.user?.email ?? '';

        const targetProfile =
          updatedProfile ??
          userProfile ??
          userData?.data?.user?.profile ??
          null;
        const age = getAgeFromProfile(targetProfile);
        const shouldSkipLifestyle = isUnderMinimumAge(age);

        if (shouldSkipLifestyle) {
          navigation.navigate('ProfileCompleted', {
            email: resolvedEmail,
          });
        } else {
          navigation.navigate('LifestylePersonalization', {
            email: resolvedEmail,
            profileCompletionPercentage:
              updatedPercentage ?? profileCompletionPercentage,
            userProfile: updatedProfile ?? userProfile ?? undefined,
          });
        }
      }
    } catch (error) {
      console.error('Failed to update career details:', error);
    }
  };

  const handleSkip = () => {
    const resolvedEmail = emailFromParams ?? userData?.data?.user?.email ?? '';

    const age = getAgeFromProfile(
      userProfile ?? userData?.data?.user?.profile ?? null,
    );

    if (isUnderMinimumAge(age)) {
      navigation.navigate('ProfileCompleted', {
        email: resolvedEmail,
      });
      return;
    }

    navigation.navigate('LifestylePersonalization', {
      email: resolvedEmail,
      profileCompletionPercentage,
      userProfile: userProfile ?? undefined,
    });
  };

  return (
    <AuthScreenWrapper>
      <FormCard style={styles.card} hasHorizontalPadding={false}>
        <View style={styles.headerContainer}>
          {canGoBack ? (
            <View style={styles.backButtonContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Icon name="ArrowLeft" size={20} color="#D6E7E3" />
                <Text variant="body16Regular" style={styles.backButtonText}>
                  Back
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.backButtonContainer} />
          )}

          <View style={styles.progressContainer}>
            <CircularProgressBar
              progress={profileCompletionPercentage}
              size={19}
              strokeWidth={moderateScale(4)}
              filledColor="#EDA618"
              unfilledColor="#F6CF8238"
              textColor="#EDA618"
            />
          </View>

          <View style={styles.spacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text variant="heading20Bold" style={styles.title}>
            Bring Your Profile to Life!
          </Text>

          <View style={styles.section}>
            <Text variant="body16Bold" style={styles.sectionTitle}>
              Employment Status
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {EMPLOYMENT_STATUS_OPTIONS.map(option => {
                const isSelected = selectedEmploymentStatus.includes(
                  option.value,
                );
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.pillButton,
                      isSelected && styles.pillButtonSelected,
                    ]}
                    onPress={() => handleEmploymentStatusToggle(option.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      variant="label14Medium"
                      style={[
                        styles.pillButtonText,
                        isSelected && styles.pillButtonTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text variant="body16Bold" style={styles.sectionTitle}>
              Level of Education
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {EDUCATION_LEVEL_OPTIONS.map(option => {
                const isSelected = selectedEducationLevel === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.pillButton,
                      isSelected && styles.pillButtonSelected,
                    ]}
                    onPress={() => handleEducationLevelSelect(option.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      variant="body16Regular"
                      style={[
                        styles.pillButtonText,
                        isSelected && styles.pillButtonTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.divider} />

          <View style={styles.inputSection}>
            <FormInput<CareerPersonalizationFormData>
              control={control}
              name="educationField"
              placeholder="What did you study?"
              label="Subject of Study"
              containerStyle={styles.inputContainer}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputSection}>
            <FormInput<CareerPersonalizationFormData>
              control={control}
              name="educationSchool"
              placeholder="Where did you study?"
              containerStyle={styles.inputContainer}
              autoCapitalize="words"
              label="School"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Save and Continue"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              size="large"
              containerStyle={styles.button}
              disabled={isSubmitting || updateUserMutation.isPending}
            />
          </View>

          <Button
            title="Skip for now"
            onPress={handleSkip}
            variant="ghost"
            size="small"
            containerStyle={styles.skipButton}
            disabled={isSubmitting || updateUserMutation.isPending}
          />

          <Text variant="caption12Regular" style={styles.footerText}>
            Complete your Profile to receive a Verified Badge to unlock access
            for posting in our University Portal
          </Text>
        </ScrollView>
      </FormCard>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: moderateScale(spacing.xl) - SVG_BORDER_HEIGHT,
    marginBottom: moderateScale(22),
    paddingHorizontal: moderateScale(spacing.xl),
  },
  backButtonContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#D6E7E3',
    marginLeft: moderateScale(spacing.xs),
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '400',
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    flex: 1,
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    paddingBottom: moderateScale(37) - SVG_BORDER_HEIGHT,
  },
  title: {
    textAlign: 'center',
    marginBottom: moderateScale(35),
    color: colors.textWhiteWA,
    paddingHorizontal: moderateScale(spacing.xl),
    height: moderateScale(lineHeight.xxxxl),
  },
  section: {
    width: '100%',
    marginBottom: moderateScale(35),
  },
  sectionTitle: {
    color: colors.white,
    paddingHorizontal: moderateScale(spacing.xl),
    marginBottom: moderateScale(14),
    textAlign: 'center',
  },
  horizontalScroll: {
    paddingHorizontal: moderateScale(spacing.xl),
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(spacing.sm),
    paddingHorizontal: moderateScale(spacing.md),
    borderRadius: moderateScale(30),
    borderWidth: 1,
    borderColor: '#5883EA',
    backgroundColor: 'transparent',
    marginRight: moderateScale(spacing.sm),
    minHeight: moderateScale(40),
  },
  pillButtonSelected: {
    borderColor: '#47ECC3',
    backgroundColor: '#C7DBD6',
  },
  pillButtonText: {
    color: colors.textWhiteWA,
  },
  pillButtonTextSelected: {
    color: colors.black,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#DBDBDB',
    marginHorizontal: moderateScale(spacing.xl),
    marginTop: moderateScale(7),
    marginBottom: moderateScale(23),
  },
  inputSection: {
    width: '100%',
    marginBottom: moderateScale(23),
    paddingHorizontal: moderateScale(spacing.xl),
  },
  inputContainer: {
    width: '100%',
  },
  errorText: {
    color: '#EF4444',
    marginTop: moderateScale(spacing.xs),
    paddingHorizontal: moderateScale(spacing.xl),
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: moderateScale(spacing.xl),
    marginTop: moderateScale(31),
  },
  button: {
    width: '100%',
  },
  skipButton: {
    marginHorizontal: moderateScale(spacing.xl),
    height: moderateScale(40),
    marginTop: moderateScale(13),
    marginBottom: moderateScale(14),
  },
  footerText: {
    textAlign: 'center',
    color: '#C7DBD6',
    paddingHorizontal: moderateScale(spacing.md),
  },
});

export default CareerPersonalizationScreen;
