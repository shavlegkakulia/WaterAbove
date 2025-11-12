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
  Switch,
  OptionPill,
  SVG_BORDER_HEIGHT,
} from '@/components';
import { Icon } from '@/components/ui/Icon';
import { colors, lineHeight, spacing } from '@/theme';
import { moderateScale } from '@/utils';
import { useUpdateUserMutation, useUserQuery } from '@/api/query';
import { useToast } from '@/store/hooks';
import type {
  UserOpinionOnHavingChildren,
  UserRelationshipStatus,
} from '@/api/types';
import { useAppNavigation, useAppRoute } from '@/navigation';

const lifestylePersonalizationSchema = z.object({
  relationshipStatus: z
    .string()
    .nonempty('Please select your relationship status'),
  interestedIn: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  doesSmoke: z.boolean().optional(),
  doesDrink: z.boolean().optional(),
  opinionOnHavingChildren: z.string().optional(),
});

type LifestylePersonalizationFormData = z.infer<
  typeof lifestylePersonalizationSchema
>;

const RELATIONSHIP_STATUS_OPTIONS: Array<{
  value: UserRelationshipStatus;
  label: string;
}> = [
  { value: 'working-on-myself', label: 'Working on Myself' },
  { value: 'just-vibing', label: 'Just vibing' },
  { value: 'dating', label: 'Dating' },
  { value: 'in-a-relationship', label: 'In a Relationship' },
  { value: 'single', label: 'Single' },
  { value: 'single-and-seeking', label: 'Single and Seeking' },
  { value: 'happily-single', label: 'Happily Single' },
  { value: 'married', label: 'Married' },
];

const KIDS_OPTIONS: Array<{
  value: UserOpinionOnHavingChildren;
  label: string;
}> = [
  { value: 'have-kids', label: 'Have Kids' },
  { value: 'want-kids', label: 'Want Kids' },
  { value: 'do-not-want-kids', label: 'Do not want kids' },
  { value: 'unsure', label: 'Unsure' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const LifestylePersonalizationScreen: React.FC = () => {
  const navigation = useAppNavigation<'LifestylePersonalization'>();
  const route = useAppRoute<'LifestylePersonalization'>();
  const { showSuccess } = useToast();
  const updateUserMutation = useUpdateUserMutation();
  const { data: userData } = useUserQuery();

  const emailFromParams = route.params?.email;
  const initialPercentage = route.params?.profileCompletionPercentage ?? 90;
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
    formState: { errors, isSubmitting, isValid },
  } = useForm<LifestylePersonalizationFormData>({
    resolver: zodResolver(lifestylePersonalizationSchema),
    mode: 'onChange',
    defaultValues: {
      relationshipStatus: '',
      interestedIn: '',
      height: '',
      weight: '',
      doesSmoke: false,
      doesDrink: false,
      opinionOnHavingChildren: '',
    },
  });

  const selectedRelationship = watch('relationshipStatus');
  const selectedKids = watch('opinionOnHavingChildren');
  const doesSmoke = watch('doesSmoke') ?? false;
  const doesDrink = watch('doesDrink') ?? false;

  useEffect(() => {
    if (userProfile) {
      if (
        typeof userProfile.relationshipStatus === 'string' &&
        userProfile.relationshipStatus.length > 0
      ) {
        setValue(
          'relationshipStatus',
          userProfile.relationshipStatus as UserRelationshipStatus,
          {
            shouldValidate: true,
          },
        );
      }

      if (typeof userProfile.interestedIn === 'string') {
        setValue('interestedIn', userProfile.interestedIn, {
          shouldValidate: true,
        });
      }

      if (userProfile.height !== null && userProfile.height !== undefined) {
        setValue('height', String(userProfile.height), {
          shouldValidate: true,
        });
      }

      if (userProfile.weight !== null && userProfile.weight !== undefined) {
        setValue('weight', String(userProfile.weight), {
          shouldValidate: true,
        });
      }

      if (typeof userProfile.doesSmoke === 'boolean') {
        setValue('doesSmoke', userProfile.doesSmoke, { shouldValidate: true });
      }

      if (typeof userProfile.doesDrink === 'boolean') {
        setValue('doesDrink', userProfile.doesDrink, { shouldValidate: true });
      }

      if (typeof userProfile.opinionOnHavingChildren === 'string') {
        setValue(
          'opinionOnHavingChildren',
          userProfile.opinionOnHavingChildren as UserOpinionOnHavingChildren,
          {
            shouldValidate: true,
          },
        );
      }

      if (
        userProfile.profileCompletionPercentage !== null &&
        userProfile.profileCompletionPercentage !== undefined
      ) {
        setProfileCompletionPercentage(userProfile.profileCompletionPercentage);
      }
    }
  }, [setValue, userProfile]);

  const handleRelationshipSelect = (value: UserRelationshipStatus) => {
    setValue('relationshipStatus', value, { shouldValidate: true });
  };

  const handleKidsSelect = (value: UserOpinionOnHavingChildren) => {
    setValue('opinionOnHavingChildren', value, { shouldValidate: true });
  };

  const onSubmit = async (formData: LifestylePersonalizationFormData) => {
    try {
      const trimmedInterestedIn = formData.interestedIn?.trim() ?? '';
      const trimmedHeight = formData.height?.trim() ?? '';
      const trimmedWeight = formData.weight?.trim() ?? '';

      const heightValue =
        trimmedHeight.length > 0 ? Number(trimmedHeight) : undefined;
      const weightValue =
        trimmedWeight.length > 0 ? Number(trimmedWeight) : undefined;

      const response = await updateUserMutation.mutateAsync({
        userData: {},
        profileData: {
          profileCompletionPercentage: 100,
          relationshipStatus: formData.relationshipStatus,
          interestedIn:
            trimmedInterestedIn.length > 0 ? trimmedInterestedIn : undefined,
          height: Number.isNaN(heightValue) ? undefined : heightValue,
          weight: Number.isNaN(weightValue) ? undefined : weightValue,
          doesSmoke: formData.doesSmoke,
          doesDrink: formData.doesDrink,
          opinionOnHavingChildren:
            formData.opinionOnHavingChildren &&
            formData.opinionOnHavingChildren.length > 0
              ? (formData.opinionOnHavingChildren as UserOpinionOnHavingChildren)
              : undefined,
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

        navigation.navigate('ProfileCompleted', {
          email: resolvedEmail,
        });
      }
    } catch (error) {
      console.error('Failed to update lifestyle details:', error);
    }
  };

  const handleSkip = () => {
    const resolvedEmail = emailFromParams ?? userData?.data?.user?.email ?? '';

    navigation.navigate('ProfileCompleted', {
      email: resolvedEmail,
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
              Relationship Status
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {RELATIONSHIP_STATUS_OPTIONS.map(option => {
                const isSelected = selectedRelationship === option.value;
                return (
                  <OptionPill
                    key={option.value}
                    label={option.label}
                    selected={isSelected}
                    onPress={() => handleRelationshipSelect(option.value)}
                    labelVariant="label14Medium"
                    style={styles.optionPill}
                  />
                );
              })}
            </ScrollView>
            {errors.relationshipStatus && (
              <Text variant="caption12Regular" style={styles.errorText}>
                {errors.relationshipStatus.message}
              </Text>
            )}
          </View>

          <View style={styles.inputSection}>
            <FormInput<LifestylePersonalizationFormData>
              control={control}
              name="interestedIn"
              placeholder="e.g., men, women, etc."
              containerStyle={styles.inputContainer}
              autoCapitalize="words"
              label="Interested in"
            />
          </View>
          <View style={styles.inputSection}>
            <FormInput<LifestylePersonalizationFormData>
              control={control}
              name="height"
              placeholder="optional"
              keyboardType="numeric"
              containerStyle={styles.inputContainer}
              label="Height"
            />
          </View>
          <View style={styles.inputSection}>
            <FormInput<LifestylePersonalizationFormData>
              control={control}
              name="weight"
              placeholder="optional"
              keyboardType="numeric"
              containerStyle={styles.inputContainer}
              label="Weight"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleSection}>
            <View style={styles.toggleRow}>
              <Text variant="body16Regular" style={styles.toggleLabel}>
                Smoke?
              </Text>
              <Switch
                value={doesSmoke}
                onValueChange={value =>
                  setValue('doesSmoke', value, { shouldValidate: true })
                }
                trackColor={{ false: '#6A6B6D', true: '#46C2A3' }}
                thumbColor={doesSmoke ? '#ffffff' : '#f4f3f4'}
                style={styles.switch}
              />
              <Text variant="caption12Regular" style={styles.toggleHintInline}>
                Toggle on for ‘yes’
              </Text>
            </View>

            <View style={styles.toggleRow}>
              <Text variant="paragraph14Bold" style={styles.toggleLabel}>
                Drink?
              </Text>
              <Switch
                value={doesDrink}
                onValueChange={value =>
                  setValue('doesDrink', value, { shouldValidate: true })
                }
                trackColor={{ false: '#6A6B6D', true: '#46C2A3' }}
                thumbColor={doesDrink ? '#ffffff' : '#f4f3f4'}
                style={styles.switch}
              />
              <Text variant="caption12Regular" style={styles.toggleHintInline}>
                Toggle on for ‘yes’
              </Text>
            </View>
          </View>

          <Text
            variant="paragraph14Bold"
            style={[styles.sectionTitle, styles.sectionSubtitle]}
          >
            Kids?
          </Text>
          <View style={styles.section}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {KIDS_OPTIONS.map(option => {
                const isSelected = selectedKids === option.value;
                return (
                  <OptionPill
                    key={option.value}
                    label={option.label}
                    selected={isSelected}
                    onPress={() => handleKidsSelect(option.value)}
                    labelVariant="body16Regular"
                    style={styles.optionPill}
                  />
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Save and Continue"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              size="large"
              containerStyle={styles.button}
              disabled={
                !isValid || isSubmitting || updateUserMutation.isPending
              }
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
    justifyContent: 'flex-start',
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
    marginBottom: moderateScale(34) - SVG_BORDER_HEIGHT,
  },
  title: {
    textAlign: 'center',
    marginBottom: moderateScale(27),
    color: colors.textWhiteWA,
    paddingHorizontal: moderateScale(spacing.xl),
    height: moderateScale(lineHeight.xxxxl),
  },
  section: {
    width: '100%',
    marginBottom: moderateScale(30),
  },
  sectionTitle: {
    color: colors.white,
    paddingHorizontal: moderateScale(spacing.xl),
    marginBottom: moderateScale(22),
    textAlign: 'center',
  },
  sectionSubtitle: {
    textAlign: 'left',
    marginBottom: moderateScale(10),
  },
  horizontalScroll: {
    paddingHorizontal: moderateScale(spacing.xl),
  },
  optionPill: {
    marginRight: moderateScale(spacing.sm),
  },
  inputSection: {
    width: '100%',
    marginBottom: moderateScale(21),
    paddingHorizontal: moderateScale(spacing.xl),
  },
  switch: {
    marginRight: moderateScale(15),
    marginLeft: moderateScale(15),
  },
  inputContainer: {
    width: '100%',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#DBDBDB',
    marginHorizontal: moderateScale(spacing.xl),
    marginBottom: moderateScale(30),
  },
  toggleSection: {
    width: '100%',
    paddingHorizontal: moderateScale(spacing.xl),
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(19),
  },
  toggleLabel: {
    color: colors.textWhiteWA,
    marginRight: -moderateScale(20),
    width: moderateScale(80),
    textAlign: 'left',
  },
  toggleHintInline: {
    color: 'rgba(255, 255, 255, 0.50)',
    marginLeft: -moderateScale(10),
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: moderateScale(spacing.xl),
    marginTop: moderateScale(18),
  },
  button: {
    width: '100%',
  },
  skipButton: {
    marginHorizontal: moderateScale(spacing.xl),
    height: moderateScale(40),
    marginTop: moderateScale(6),
    marginBottom: moderateScale(5),
  },
  footerText: {
    textAlign: 'center',
    color: '#C7DBD6',
    paddingHorizontal: moderateScale(spacing.md),
  },
  errorText: {
    color: '#EF4444',
    marginTop: moderateScale(spacing.xs),
    paddingHorizontal: moderateScale(spacing.xl),
  },
});

export default LifestylePersonalizationScreen;
