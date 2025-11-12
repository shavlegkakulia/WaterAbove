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
import type { UserTopic } from '@/api/types';
import { useAppNavigation, useAppRoute } from '@/navigation';

const topicsPersonalizationSchema = z
  .object({
    topics: z
      .array(z.string())
      .max(5, 'You can select up to 5 topics')
      .optional(),
    isInterestedInBeingAMentor: z.boolean().optional(),
    isInterestedInBeingMentored: z.boolean().optional(),
    isInterestedInFindingAnAccountabilityPartner: z.boolean().optional(),
    shareTravelLocation: z.boolean().optional(),
    travelLocation: z.string().optional(),
  });

type TopicsPersonalizationFormData = z.infer<
  typeof topicsPersonalizationSchema
>;

const TOPIC_OPTIONS: Array<{ value: UserTopic; label: string; emoji: string }> =
  [
    { value: 'writing', label: 'Writing', emoji: '✍️' },
    { value: 'technology', label: 'Technology', emoji: '💻' },
    { value: 'skilled-trades', label: 'Skilled Trades', emoji: '🛠️' },
    { value: 'start-ups', label: 'Start-ups', emoji: '🚀' },
    { value: 'music', label: 'Music', emoji: '🎵' },
    { value: 'marketing', label: 'Marketing', emoji: '📣' },
    { value: 'podcasting', label: 'Podcasting', emoji: '🎙️' },
    { value: 'film', label: 'Film', emoji: '🎬' },
    { value: 'photography', label: 'Photography', emoji: '📸' },
    { value: 'health-and-wellness', label: 'Health & Wellness', emoji: '🧘' },
    { value: 'art-and-design', label: 'Art & Design', emoji: '🎨' },
    { value: 'hospitality', label: 'Hospitality', emoji: '🏨' },
    { value: 'travel', label: 'Travel', emoji: '✈️' },
    { value: 'finances', label: 'Finances', emoji: '💰' },
    { value: 'education', label: 'Education', emoji: '🎓' },
    { value: 'ecommerce', label: 'Ecommerce', emoji: '🛍️' },
    { value: 'coaching', label: 'Coaching', emoji: '🧑‍🏫' },
    { value: 'care-giving', label: 'Care Giving', emoji: '🤝' },
    { value: 'spirituality', label: 'Spirituality', emoji: '🕯️' },
    { value: 'biz-ops', label: 'Biz Ops', emoji: '📊' },
    { value: 'parenting', label: 'Parenting', emoji: '🧒' },
    { value: 'events', label: 'Events', emoji: '🎉' },
    { value: 'animals', label: 'Animals', emoji: '🐾' },
    { value: 'gaming', label: 'Gaming', emoji: '🎮' },
    { value: 'cooking', label: 'Cooking', emoji: '🍳' },
  ];

export const TopicsPersonalizationScreen: React.FC = () => {
  const navigation = useAppNavigation<'TopicsPersonalization'>();
  const route = useAppRoute<'TopicsPersonalization'>();
  const { showSuccess } = useToast();
  const updateUserMutation = useUpdateUserMutation();
  const { data: userData } = useUserQuery();

  const emailFromParams = route.params?.email;
  const initialPercentage = route.params?.profileCompletionPercentage ?? 70;
  const userProfileFromRoute = route.params?.userProfile;
  const [profileCompletionPercentage, setProfileCompletionPercentage] =
    useState(initialPercentage);

  const canGoBack = navigation.canGoBack();

  const userProfile = useMemo(() => {
    return (
      userProfileFromRoute ||
      userData?.data?.user?.profile || null
    );
  }, [userData, userProfileFromRoute]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<TopicsPersonalizationFormData>({
    resolver: zodResolver(topicsPersonalizationSchema),
    mode: 'onChange',
    defaultValues: {
      topics: [],
      isInterestedInBeingAMentor: false,
      isInterestedInBeingMentored: false,
      isInterestedInFindingAnAccountabilityPartner: false,
      shareTravelLocation: false,
      travelLocation: '',
    },
  });

  const selectedTopics = watch('topics') ?? [];
  const shareTravelLocation = watch('shareTravelLocation') ?? false;
  const isInterestedInBeingAMentor =
    watch('isInterestedInBeingAMentor') ?? false;
  const isInterestedInBeingMentored =
    watch('isInterestedInBeingMentored') ?? false;
  const isInterestedInFindingAnAccountabilityPartner =
    watch('isInterestedInFindingAnAccountabilityPartner') ?? false;

  useEffect(() => {
    if (userProfile) {
      if (Array.isArray(userProfile.topicsThatMatter)) {
        setValue('topics', userProfile.topicsThatMatter as UserTopic[], {
          shouldValidate: true,
        });
      }

      if (typeof userProfile.isInterestedInBeingAMentor === 'boolean') {
        setValue(
          'isInterestedInBeingAMentor',
          userProfile.isInterestedInBeingAMentor,
          {
            shouldValidate: true,
          },
        );
      }

      if (typeof userProfile.isInterestedInBeingMentored === 'boolean') {
        setValue(
          'isInterestedInBeingMentored',
          userProfile.isInterestedInBeingMentored,
          {
            shouldValidate: true,
          },
        );
      }

      if (
        typeof userProfile.isInterestedInFindingAnAccountabilityPartner ===
        'boolean'
      ) {
        setValue(
          'isInterestedInFindingAnAccountabilityPartner',
          userProfile.isInterestedInFindingAnAccountabilityPartner,
          { shouldValidate: true },
        );
      }

      if (typeof userProfile.shareTravelLocation === 'boolean') {
        setValue('shareTravelLocation', userProfile.shareTravelLocation, {
          shouldValidate: true,
        });
      }

      if (typeof userProfile.travelLocation === 'string') {
        setValue('travelLocation', userProfile.travelLocation, {
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

  const handleTopicSelect = (topic: UserTopic) => {
    const topics = selectedTopics ?? [];
    if (topics.includes(topic)) {
      const updatedTopics = topics.filter(item => item !== topic);
      setValue('topics', updatedTopics, { shouldValidate: true });
    } else {
      if (topics.length >= 5) {
        return;
      }
      setValue('topics', [...topics, topic], { shouldValidate: true });
    }
  };

  const handleToggle = (
    field: keyof TopicsPersonalizationFormData,
    value: boolean,
  ) => {
    setValue(field, value, { shouldValidate: true });
  };

  const handleShareTravelToggle = (value: boolean) => {
    setValue('shareTravelLocation', value, { shouldValidate: true });
    if (!value) {
      setValue('travelLocation', '', { shouldValidate: true });
    }
  };

  const onSubmit = async (formData: TopicsPersonalizationFormData) => {
    try {
      const trimmedTravelLocation = formData.travelLocation?.trim();

      const response = await updateUserMutation.mutateAsync({
        userData: {},
        profileData: {
          profileCompletionPercentage: 80,
          topicsThatMatter:
            formData.topics && formData.topics.length > 0
              ? (formData.topics as UserTopic[])
              : undefined,
          isInterestedInBeingAMentor: formData.isInterestedInBeingAMentor,
          isInterestedInBeingMentored: formData.isInterestedInBeingMentored,
          isInterestedInFindingAnAccountabilityPartner:
            formData.isInterestedInFindingAnAccountabilityPartner,
          shareTravelLocation: formData.shareTravelLocation,
          ...(formData.shareTravelLocation && trimmedTravelLocation
            ? { travelLocation: trimmedTravelLocation }
            : {}),

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

        navigation.navigate('CareerPersonalization', {
          email: resolvedEmail,
          profileCompletionPercentage:
            updatedPercentage ?? profileCompletionPercentage,
          userProfile: updatedProfile,
        });
      }
    } catch (error) {
      console.error('Failed to update profile topics:', error);
    }
  };

  const handleSkip = () => {
    const resolvedEmail =
      emailFromParams ?? userData?.data?.user?.email ?? undefined;

    navigation.navigate('ProfileCompleted', {
      email: resolvedEmail ?? undefined,
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
            <Text variant="body16Bold" style={[styles.sectionTitle, styles.topTitleMargin]}>
              What topics matter to you?
            </Text>
            <Text variant="caption12Bold" style={styles.sectionSubtitle}>
              Select all that apply
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {TOPIC_OPTIONS.map(option => {
                const isSelected = selectedTopics.includes(option.value);
                return (
                  <OptionPill
                    key={option.value}
                    label={option.label}
                    emoji={option.emoji}
                    labelVariant="label14Medium"
                    selected={isSelected}
                    onPress={() => handleTopicSelect(option.value)}
                  />
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text variant="body16Bold" style={styles.sectionTitle}>
              Accountability
            </Text>

            <View style={styles.toggleRow}>
              <Text variant="paragraph14Bold" style={styles.toggleLabel}>
                I am interested in being a Mentor
              </Text>
              <Switch
                value={isInterestedInBeingAMentor}
                onValueChange={value =>
                  handleToggle('isInterestedInBeingAMentor', value)
                }
                trackColor={{ false: '#6A6B6D', true: '#46C2A3' }}
                thumbColor={isInterestedInBeingAMentor ? '#ffffff' : '#f4f3f4'}
                style={styles.switch}
              />
            </View>

            <View style={styles.toggleRow}>
              <Text variant="paragraph14Bold" style={styles.toggleLabel}>
                I am interested in being Mentored
              </Text>
              <Switch
                value={isInterestedInBeingMentored}
                onValueChange={value =>
                  handleToggle('isInterestedInBeingMentored', value)
                }
                trackColor={{ false: '#6A6B6D', true: '#46C2A3' }}
                thumbColor={isInterestedInBeingMentored ? '#ffffff' : '#f4f3f4'}
                style={styles.switch}
              />
            </View>

            <View style={[styles.toggleRow, styles.toggleRowMargin]}>
              <Text variant="paragraph14Bold" style={styles.toggleLabel}>
                I am interested in finding an Accountability Partner
              </Text>
              <Switch
                value={isInterestedInFindingAnAccountabilityPartner}
                onValueChange={value =>
                  handleToggle(
                    'isInterestedInFindingAnAccountabilityPartner',
                    value,
                  )
                }
                trackColor={{ false: '#6A6B6D', true: '#46C2A3' }}
                thumbColor={
                  isInterestedInFindingAnAccountabilityPartner
                    ? '#ffffff'
                    : '#f4f3f4'
                }
                style={styles.switch}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="body16Bold" style={styles.sectionTitle}>
              Are you actively traveling?
            </Text>

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextGroup}>
                <Text variant="paragraph14Bold" style={styles.toggleLabel}>
                  Share to help find members as you travel
                </Text>
              </View>
              <Switch
                value={shareTravelLocation}
                onValueChange={handleShareTravelToggle}
                trackColor={{ false: '#6A6B6D', true: '#46C2A3' }}
                thumbColor={shareTravelLocation ? '#ffffff' : '#f4f3f4'}
                style={styles.switch}
              />
            </View>

            {shareTravelLocation && (
              <View style={styles.travelInputContainer}>
                <FormInput<TopicsPersonalizationFormData>
                  control={control}
                  name="travelLocation"
                  placeholder="Where are you headed next?"
                  autoCapitalize="words"
                  containerStyle={styles.travelInput}
                  label="Location"
                />
              </View>
            )}
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
    paddingBottom: moderateScale(30) - SVG_BORDER_HEIGHT,
  },
  title: {
    textAlign: 'center',
    marginBottom: moderateScale(22),
    color: colors.textWhiteWA,
    paddingHorizontal: moderateScale(spacing.xl),
    height: moderateScale(lineHeight.xxxxl),
  },
  section: {
    width: '100%',
    marginBottom: moderateScale(22),
  },
  topTitleMargin: {
   marginBottom: moderateScale(spacing.xs),
  },
  sectionTitle: {
    color: colors.white,
    paddingHorizontal: moderateScale(spacing.xl),
    marginBottom: moderateScale(18),
    textAlign: 'center',
  },
  sectionSubtitle: {
    color: colors.white,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: moderateScale(spacing.xl),
    marginBottom: moderateScale(15),
  },
  horizontalScroll: {
    paddingHorizontal: moderateScale(spacing.xl),
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#DBDBDB',
    marginBottom: moderateScale(spacing.md),
  },
  switch: {
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(spacing.xl),
    marginBottom: moderateScale(18),
  },
  toggleRowMargin: {
    marginBottom: 8,
  },
  toggleLabel: {
    color: colors.textWhiteWA,
    flex: 1,
    marginRight: moderateScale(spacing.sm),
  },
  toggleTextGroup: {
    flex: 1,
    marginRight: moderateScale(spacing.sm),
  },
  travelInputContainer: {
    paddingHorizontal: moderateScale(spacing.xl),
  },
  travelInput: {
    marginTop: moderateScale(28),
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: moderateScale(spacing.xl),
    marginTop: moderateScale(spacing.md),
  },
  button: {
    width: '100%',
  },
  skipButton: {
    marginHorizontal: moderateScale(spacing.xl),
    height: moderateScale(40),
    marginTop: moderateScale(spacing.sm),
    marginBottom: moderateScale(5),
  },
  footerText: {
    textAlign: 'center',
    color: '#C7DBD6',
    paddingHorizontal: moderateScale(spacing.md),
  },
});

export default TopicsPersonalizationScreen;
