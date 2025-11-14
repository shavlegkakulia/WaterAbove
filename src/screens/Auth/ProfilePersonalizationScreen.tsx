import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FormCard,
  Button,
  Text,
  AuthScreenWrapper,
  CircularProgressBar,
  Switch,
  OptionPill,
  SVG_BORDER_HEIGHT,
} from '@/components';
import { colors, lineHeight, spacing } from '@/theme';
import { moderateScale } from '@/utils';
import { Icon } from '@/components/ui/Icon';
import { useUpdateUserMutation, useUserQuery } from '@/api/query';
import { useToast } from '@/store/hooks';
import type { UserPurpose, UserGender, UserZodiacSign } from '@/api/types';
import { useAppNavigation, useAppRoute } from '@/navigation';
import {
  calculateAge,
  isUnderMinimumAge,
  parseDateOfBirth,
} from '@/utils/profile';

// Validation schema
const profilePersonalizationSchema = z.object({
  zodiacSign: z.string().optional(),
  gender: z.string().optional(),
  purpose: z
    .array(z.string())
    .min(1, 'Please select at least one purpose')
    .max(3, 'Please select up to 3 purposes'),
  showAge: z.boolean().optional(),
  showDob: z.boolean().optional(),
});

type ProfilePersonalizationFormData = z.infer<typeof profilePersonalizationSchema>;

// Zodiac Sign Options
const ZODIAC_SIGNS: Array<{
  value: UserZodiacSign;
  label: string;
  symbol: string;
}> = [
  { value: 'aries', label: 'Aries', symbol: '♈' },
  { value: 'taurus', label: 'Taurus', symbol: '♉' },
  { value: 'gemini', label: 'Gemini', symbol: '♊' },
  { value: 'cancer', label: 'Cancer', symbol: '♋' },
  { value: 'leo', label: 'Leo', symbol: '♌' },
  { value: 'virgo', label: 'Virgo', symbol: '♍' },
  { value: 'libra', label: 'Libra', symbol: '♎' },
  { value: 'scorpio', label: 'Scorpio', symbol: '♏' },
  { value: 'ophiuchus', label: 'Ophiuchus', symbol: '⛎' },
  { value: 'sagittarius', label: 'Sagittarius', symbol: '♐' },
  { value: 'capricorn', label: 'Capricorn', symbol: '♑' },
  { value: 'aquarius', label: 'Aquarius', symbol: '♒' },
  { value: 'pisces', label: 'Pisces', symbol: '♓' },
];

// Gender Options
const GENDER_OPTIONS: Array<{ value: UserGender; label: string }> = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  // { value: 'other', label: 'Other' },
  { value: 'unspecified', label: 'Prefer not to say' },
];

// Purpose Options
const PURPOSE_OPTIONS: Array<{
  value: UserPurpose;
  label: string;
  emoji: string;
}> = [
  { value: 'starting-a-business', label: 'Starting a Business', emoji: '🚀' },
  { value: 'networking', label: 'Networking', emoji: '💼' },
  { value: 'looking-for-work', label: 'Looking for work', emoji: '👤' },
  { value: 'hiring', label: 'Hiring', emoji: '📋' },
  { value: 'making-friends', label: 'Making Friends', emoji: '👥' },
  { value: 'dating', label: 'Dating', emoji: '💕' },
];

const formatDateForDisplay = (date: Date): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}`;
};

export const ProfilePersonalizationScreen: React.FC = () => {
  const navigation = useAppNavigation<'ProfilePersonalization'>();
  const route = useAppRoute<'ProfilePersonalization'>();
  const emailParam = route.params?.email;
  const initialPercentage = route.params?.profileCompletionPercentage || 50;
  const userProfileFromRoute = route.params?.userProfile;
  const { showSuccess } = useToast();
  const updateUserMutation = useUpdateUserMutation();
  const { data: userData } = useUserQuery();

  // Check if navigation can go back
  const canGoBack = navigation.canGoBack();

  // Get user profile from route params or from API response
  const userProfile =
    userProfileFromRoute || userData?.data?.user?.profile || null;

  const [zodiacSign, setZodiacSign] = useState<UserZodiacSign | null>(null);
  const [gender, setGender] = useState<UserGender | null>(null);
  const [purpose, setPurpose] = useState<UserPurpose[]>([]);
  const [showAge, setShowAge] = useState(false);
  const [showDob, setShowDob] = useState(false);
  const [profileCompletionPercentage, setProfileCompletionPercentage] =
    useState(initialPercentage);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [formattedDateOfBirth, setFormattedDateOfBirth] = useState<string>('');

  const {
    handleSubmit,
    formState: { isValid, errors },
    setValue,
  } = useForm<ProfilePersonalizationFormData>({
    resolver: zodResolver(profilePersonalizationSchema),
    mode: 'onChange',
    defaultValues: {
      zodiacSign: undefined,
      gender: undefined,
      purpose: [],
      showAge: false,
      showDob: false,
    },
  });

  const isUnderage = useMemo(() => {
    if (calculatedAge === null) {
      return false;
    }
    return isUnderMinimumAge(calculatedAge);
  }, [calculatedAge]);

  // Load user profile data on mount
  useEffect(() => {
    if (userProfile) {
      let nextAge: number | null = null;

      if (userProfile.dateOfBirth) {
        const parsedDob = parseDateOfBirth(userProfile.dateOfBirth);
        if (parsedDob) {
          nextAge = calculateAge(parsedDob);
          setFormattedDateOfBirth(formatDateForDisplay(parsedDob));
        }
      }

      setCalculatedAge(nextAge);

      const underage = isUnderMinimumAge(nextAge);

      // Set zodiac sign
      if (userProfile.zodiacSign) {
        const sign = userProfile.zodiacSign as UserZodiacSign;
        setZodiacSign(sign);
        setValue('zodiacSign', sign, { shouldValidate: true });
      }

      // Set gender
      if (userProfile.gender) {
        const userGender = userProfile.gender.toLowerCase() as UserGender;
        if (userGender && userGender !== 'unspecified') {
          setGender(userGender);
          setValue('gender', userGender, { shouldValidate: true });
        } else {
          setGender(null);
          setValue('gender', undefined, { shouldValidate: true });
        }
      }

      // Set purpose (array)
      if (userProfile.purpose) {
        const purposeArray = Array.isArray(userProfile.purpose)
          ? (userProfile.purpose as UserPurpose[])
          : typeof userProfile.purpose === 'string'
          ? [userProfile.purpose as UserPurpose]
          : [];
        const sanitizedPurpose = underage
          ? purposeArray.filter(purposeValue => purposeValue !== 'dating')
          : purposeArray;
        setPurpose(sanitizedPurpose);
        setValue('purpose', sanitizedPurpose, { shouldValidate: true });
      }

      // Set show age
      if (userProfile.showAge !== null && userProfile.showAge !== undefined) {
        setShowAge(!underage && userProfile.showAge);
      } else {
        setShowAge(false);
      }

      // Set show DOB
      if (userProfile.showDob !== null && userProfile.showDob !== undefined) {
        setShowDob(userProfile.showDob);
      }

      // Set profile completion percentage
      if (
        userProfile.profileCompletionPercentage !== null &&
        userProfile.profileCompletionPercentage !== undefined
      ) {
        setProfileCompletionPercentage(
          userProfile.profileCompletionPercentage,
        );
      }
    }
  }, [userProfile, setValue]);

  useEffect(() => {
    if (isUnderage && purpose.includes('dating')) {
      const filteredPurpose = purpose.filter(item => item !== 'dating');
      setPurpose(filteredPurpose);
      setValue('purpose', filteredPurpose, { shouldValidate: true });
      setShowAge(false);
    }
  }, [isUnderage, purpose, setValue]);

  const availablePurposeOptions = useMemo(() => {
    if (!isUnderage) {
      return PURPOSE_OPTIONS;
    }
    return PURPOSE_OPTIONS.filter(option => option.value !== 'dating');
  }, [isUnderage]);

  const ageLabel = useMemo(() => {
    if (calculatedAge === null) {
      return '--';
    }
    return calculatedAge.toString();
  }, [calculatedAge]);

  const birthdayLabel = useMemo(() => {
    if (!formattedDateOfBirth) {
      return 'Birthday not set';
    }
    return formattedDateOfBirth;
  }, [formattedDateOfBirth]);

  const handleZodiacSignSelect = (sign: UserZodiacSign) => {
    setZodiacSign(sign === zodiacSign ? null : sign);
    setValue('zodiacSign', sign === zodiacSign ? undefined : sign, { shouldValidate: true });
  };

  const handleGenderSelect = (selectedGender: UserGender) => {
    setGender(selectedGender === gender ? null : selectedGender);
    setValue('gender', selectedGender === gender ? undefined : selectedGender, { shouldValidate: true });
  };

  const handlePurposeSelect = (selectedPurpose: UserPurpose) => {
    if (isUnderage && selectedPurpose === 'dating') {
      return;
    }

    if (purpose.includes(selectedPurpose)) {
      const newPurpose = purpose.filter(p => p !== selectedPurpose);
      setPurpose(newPurpose);
      setValue('purpose', newPurpose, { shouldValidate: true });
    } else {
      if (purpose.length < 3) {
        const newPurpose = [...purpose, selectedPurpose];
        setPurpose(newPurpose);
        setValue('purpose', newPurpose, { shouldValidate: true });
      }
    }
  };

  const onSubmit = async (_data: ProfilePersonalizationFormData) => {
    try {
      const response = await updateUserMutation.mutateAsync({
        userData: {},
        profileData: {
          profileCompletionPercentage: 70,
          zodiacSign: zodiacSign || undefined,
          gender: gender || undefined,
          showAge: isUnderage ? false : showAge,
          showDob: showDob,
          purpose: purpose.length > 0 ? purpose : undefined,
        },
      });

      if (response.success && response.data) {
        const updatedPercentage = response.data.user?.profile?.profileCompletionPercentage;
        const updatedProfile = response.data.user?.profile;
        if (updatedPercentage !== undefined && updatedPercentage !== null) {
          setProfileCompletionPercentage(updatedPercentage);
        }
        showSuccess('Profile updated successfully!');
        const resolvedEmail =
          emailParam || userData?.data?.user?.email || null;

        navigation.navigate('TopicsPersonalization', {
          email: resolvedEmail ?? '',
          profileCompletionPercentage:
            updatedPercentage ?? profileCompletionPercentage,
          userProfile: updatedProfile,
        });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <AuthScreenWrapper>
      <FormCard style={styles.card} hasHorizontalPadding={false}>
        {/* Header with Back Button and Progress Indicator */}
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

        {/* Title */}
        <Text variant="heading20Bold" style={styles.title}>
          Bring Your Profile to Life!
        </Text>

        {/* Birthday & Age Preferences */}
        {!isUnderage ? (
          <View style={styles.sectionContainer}>
            <Text variant="body16Bold" style={styles.sectionTitle}>
              Birthday & age preferences
            </Text>

            <View style={styles.toggleRow}>
              <Switch
                value={showAge}
                onValueChange={setShowAge}
                trackColor={{ false: '#535764', true: '#46C2A3' }}
                thumbColor={showAge ? '#FFFFFF' : '#E9EAED'}
                style={styles.switch}
              />
              <Text style={styles.toggleValue} variant="paragraph14Bold">{`Age: ${ageLabel}`}</Text>
              <Text style={styles.toggleSubLabel} variant="caption12Regular" numberOfLines={1}>
                Show my age on profile
              </Text>
            </View>

            <View style={styles.toggleRow}>
              <Switch
                value={showDob}
                onValueChange={setShowDob}
                trackColor={{ false: '#535764', true: '#46C2A3' }}
                thumbColor={showDob ? '#FFFFFF' : '#E9EAED'}
                style={styles.switch}
              />
              <Text style={styles.toggleValue} variant="paragraph14Bold">{birthdayLabel}</Text>
              <Text style={styles.toggleSubLabel} variant="caption12Regular" numberOfLines={1}>
                Show my birthday on profile
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.sectionContainer}>
            <Text variant="body16Bold" style={styles.sectionTitle}>
              Birthday preferences
            </Text>
            <View style={styles.toggleRow}>
              <Switch
                value={showDob}
                onValueChange={setShowDob}
                trackColor={{ false: '#535764', true: '#46C2A3' }}
                thumbColor={showDob ? '#FFFFFF' : '#E9EAED'}
                style={styles.switch}
              />
              <Text style={styles.toggleValue} variant="paragraph14Bold">{birthdayLabel}</Text>
              <Text style={styles.toggleSubLabel} variant="caption12Regular" numberOfLines={1}>
                Show my birthday on profile
              </Text>
            </View>
          </View>
        )}

        {/* Show Your Zodiac Sign? */}
        <View style={styles.section}>
          <Text variant="body16Bold" style={styles.sectionTitle}>
            Show Your Zodiac Sign?
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {ZODIAC_SIGNS.map(sign => (
              <OptionPill
                key={sign.value}
                label={sign.label}
                emoji={sign.symbol}
                selected={zodiacSign === sign.value}
                onPress={() => handleZodiacSignSelect(sign.value)}
                labelVariant="paragraph14Regular"
                emojiVariant="paragraph14Regular"
                emojiStyle={styles.pillButtonSymbol}
                style={styles.optionPill}
              />
            ))}
          </ScrollView>
        </View>

        {/* How do you identify? */}
        <View style={styles.section}>
          <Text variant="body16Bold" style={styles.sectionTitle}>
            How do you identify?
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {GENDER_OPTIONS.map(option => (
              <OptionPill
                key={option.value}
                label={option.label}
                selected={gender === option.value}
                onPress={() => handleGenderSelect(option.value)}
                labelVariant="body16Regular"
                style={styles.optionPill}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionDivider} />

        {/* What are you here for? */}
        <View style={styles.section}>
          <Text variant="body16Bold" style={styles.sectionTitle}>
            What are you here for?
          </Text>
          <Text variant="caption12Regular" style={styles.helpText}>
            Select between one and three for the best experience
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {availablePurposeOptions.map(option => {
              const isSelected = purpose.includes(option.value);
              const isDisabled = isUnderage && option.value === 'dating';
              return (
                <OptionPill
                  key={option.value}
                  label={option.label}
                  emoji={option.emoji}
                  selected={isSelected}
                  disabled={isDisabled}
                  onPress={() => handlePurposeSelect(option.value)}
                  labelVariant="body16Regular"
                  emojiVariant="body16Regular"
                  emojiStyle={styles.pillButtonEmoji}
                  style={styles.optionPill}
                />
              );
            })}
          </ScrollView>
          {errors.purpose && (
            <Text variant="caption12Regular" style={styles.errorText}>
              {errors.purpose.message}
            </Text>
          )}
        </View>

        {/* Save and Continue Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Save and Continue"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            size="large"
            containerStyle={styles.button}
            disabled={!isValid || purpose.length === 0}
          />
        </View>

        {/* Footer Text */}
        <Text variant="caption12Regular" style={styles.footerText}>
          Complete your Profile to receive a Verified Badge to unlock access for posting in our University Portal
        </Text>
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
    lineHeight: undefined,
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
  title: {
    textAlign: 'center',
    marginBottom: moderateScale(spacing.xl),
    color: '#D6E7E3',
    height: moderateScale(lineHeight.xxxxl),
    paddingHorizontal: moderateScale(spacing.xl),
  },
  sectionContainer: {
    width: '100%',
    paddingHorizontal: moderateScale(spacing.xl),
  },
  section: {
    width: '100%',
  },
  sectionTitle: {
    color: colors.white,
    lineHeight: moderateScale(lineHeight.lg),
   // marginTop: moderateScale(spacing.md),
    marginBottom: moderateScale(22),
    paddingHorizontal: moderateScale(spacing.xl),
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: moderateScale(22),
    paddingLeft: moderateScale(spacing.md),
    columnGap: moderateScale(spacing.sm),
  },
  toggleValue: {
    color: '#F1F1F1',
    marginRight: moderateScale(spacing.xs),
  },
  toggleSubLabel: {
    flexShrink: 1,
    textAlign: 'right',
    color: 'rgba(209,215,233,0.72)',
  },
  switch: {
  },
  horizontalScroll: {
    paddingHorizontal: moderateScale(spacing.xl),
    marginBottom: moderateScale(22),
  },
  optionPill: {
    marginRight: moderateScale(spacing.md),
  },
  pillButtonSymbol: {
    color: '#D6E7E3',
    fontSize: moderateScale(18),
    marginRight: moderateScale(spacing.xs),
  },
  pillButtonEmoji: {
    fontSize: moderateScale(16),
  },
  helpText: {
    color: colors.white,
    marginBottom: moderateScale(19),
    marginTop: -moderateScale(16),
    paddingHorizontal: moderateScale(spacing.xl),
    textAlign: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: moderateScale(12),
    marginTop: moderateScale(spacing.xs),
  },
  buttonContainer: {
    width: '100%',
    marginTop: moderateScale(spacing.sm),
    marginBottom: moderateScale(22),
    paddingHorizontal: moderateScale(spacing.xl),
  },
  button: {
    width: '100%',
  },
  footerText: {
    textAlign: 'center',
    paddingHorizontal: moderateScale(spacing.md),
    marginBottom: moderateScale(spacing.xxl) - SVG_BORDER_HEIGHT,
    color: '#C7DBD6',
  },
  sectionDivider: {
    width: '88%',
    alignSelf: 'center',
    height: StyleSheet.hairlineWidth,
    marginBottom: moderateScale(22),
    backgroundColor: '#DBDBDB',
  },
});

export default ProfilePersonalizationScreen;

