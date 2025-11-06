import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormCard, Button, Text, AuthScreenWrapper, CircularProgressBar } from '@/components';
import { spacing } from '@/theme';
import { moderateScale } from '@/utils';
import type { RootStackParamList } from '@/navigation/types';
import { Icon } from '@/components/Icon';
import { useUpdateUserMutation, useUserQuery } from '@/api/query';
import { useToast } from '@/store/hooks';
import type { UserPurpose, UserGender, UserZodiacSign } from '@/api/types';

// Validation schema
const profilePersonalizationSchema = z.object({
  zodiacSign: z.string().optional(),
  gender: z.string().optional(),
  purpose: z.array(z.string()).min(1, 'Please select at least one purpose').max(3, 'Please select up to 3 purposes'),
  showAge: z.boolean().optional(),
  showDob: z.boolean().optional(),
});

type ProfilePersonalizationFormData = z.infer<typeof profilePersonalizationSchema>;

// Zodiac Sign Options
const ZODIAC_SIGNS: Array<{ value: UserZodiacSign; label: string; symbol: string }> = [
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
  { value: 'other', label: 'Other' },
  { value: 'unspecified', label: 'Prefer not to say' },
];

// Purpose Options
const PURPOSE_OPTIONS: Array<{ value: UserPurpose; label: string; emoji: string }> = [
  { value: 'starting-a-business', label: 'Starting a Business', emoji: '🚀' },
  { value: 'networking', label: 'Networking', emoji: '💼' },
  { value: 'looking-for-work', label: 'Looking for work', emoji: '👤' },
  { value: 'hiring', label: 'Hiring', emoji: '📋' },
  { value: 'making-friends', label: 'Making Friends', emoji: '👥' },
  { value: 'dating', label: 'Dating', emoji: '💕' },
];

export const ProfilePersonalizationScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ProfilePersonalization'>>();
  const initialPercentage = route.params?.profileCompletionPercentage || 50;
  const userProfileFromRoute = route.params?.userProfile;
  const { showSuccess } = useToast();
  const updateUserMutation = useUpdateUserMutation();
  const { data: userData } = useUserQuery();
  
  // Check if navigation can go back
  const canGoBack = navigation.canGoBack();

  // Get user profile from route params or from API response
  const userProfile = userProfileFromRoute || (userData as any)?.data?.user?.profile || (userData as any)?.user?.profile;

  const [zodiacSign, setZodiacSign] = useState<UserZodiacSign | null>(null);
  const [gender, setGender] = useState<UserGender | null>(null);
  const [purpose, setPurpose] = useState<UserPurpose[]>([]);
  const [showAge, setShowAge] = useState(false);
  const [showDob, setShowDob] = useState(false);
  const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(initialPercentage);

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

  // Load user profile data on mount
  useEffect(() => {
    if (userProfile) {
      // Set zodiac sign
      if (userProfile.zodiacSign) {
        const sign = userProfile.zodiacSign as UserZodiacSign;
        setZodiacSign(sign);
        setValue('zodiacSign', sign, { shouldValidate: true });
      }

      // Set gender
      if (userProfile.gender) {
        const userGender = userProfile.gender.toLowerCase() as UserGender;
        setGender(userGender);
        setValue('gender', userGender, { shouldValidate: true });
      }

      // Set purpose (array)
      if (userProfile.purpose) {
        const purposeArray = Array.isArray(userProfile.purpose) 
          ? userProfile.purpose as UserPurpose[]
          : typeof userProfile.purpose === 'string'
          ? [userProfile.purpose as UserPurpose]
          : [];
        setPurpose(purposeArray);
        setValue('purpose', purposeArray, { shouldValidate: true });
      }

      // Set show age
      if (userProfile.showAge !== null && userProfile.showAge !== undefined) {
        setShowAge(userProfile.showAge);
      }

      // Set show DOB
      if (userProfile.showDob !== null && userProfile.showDob !== undefined) {
        setShowDob(userProfile.showDob);
      }

      // Set profile completion percentage
      if (userProfile.profileCompletionPercentage !== null && userProfile.profileCompletionPercentage !== undefined) {
        setProfileCompletionPercentage(userProfile.profileCompletionPercentage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const handleZodiacSignSelect = (sign: UserZodiacSign) => {
    setZodiacSign(sign === zodiacSign ? null : sign);
    setValue('zodiacSign', sign === zodiacSign ? undefined : sign, { shouldValidate: true });
  };

  const handleGenderSelect = (selectedGender: UserGender) => {
    setGender(selectedGender === gender ? null : selectedGender);
    setValue('gender', selectedGender === gender ? undefined : selectedGender, { shouldValidate: true });
  };

  const handlePurposeSelect = (selectedPurpose: UserPurpose) => {
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
          showAge: showAge,
          showDob: showDob,
          purpose: purpose.length > 0 ? purpose : undefined,
        },
      });

      if (response.success && response.data) {
        const updatedPercentage = response.data.user?.profile?.profileCompletionPercentage;
        if (updatedPercentage !== undefined && updatedPercentage !== null) {
          setProfileCompletionPercentage(updatedPercentage);
        }
        showSuccess('Profile updated successfully!');
        // Navigate to next screen
        // navigation.navigate('Welcome', { email });
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
        <Text variant="heading28Bold" style={styles.title}>
          Bring Your Profile to Life!
        </Text>

        {/* Birthday & Age Preferences */}
        <View style={styles.sectionContainer}>
          <Text variant="body16Bold" style={styles.sectionTitle}>
            Birthday & age preferences
          </Text>
          
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelContainer}>
              <Text variant="body16Regular" style={styles.toggleLabel}>
                Age: 32
              </Text>
              <Text variant="body16Regular" style={styles.toggleSubLabel}>
                Show my age on profile
              </Text>
            </View>
            <Switch
              value={showAge}
              onValueChange={setShowAge}
              trackColor={{ false: '#767577', true: '#46C2A3' }}
              thumbColor={showAge ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#767577"
              style={styles.switch}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelContainer}>
              <Text variant="body16Regular" style={styles.toggleLabel}>
                September 21
              </Text>
              <Text variant="body16Regular" style={styles.toggleSubLabel}>
                Show my age on profile
              </Text>
            </View>
            <Switch
              value={showDob}
              onValueChange={setShowDob}
              trackColor={{ false: '#767577', true: '#46C2A3' }}
              thumbColor={showDob ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#767577"
              style={styles.switch}
            />
          </View>
        </View>

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
            {ZODIAC_SIGNS.map((sign) => (
              <TouchableOpacity
                key={sign.value}
                style={[
                  styles.pillButton,
                  zodiacSign === sign.value && styles.pillButtonSelected,
                ]}
                onPress={() => handleZodiacSignSelect(sign.value)}
                activeOpacity={0.7}
              >
                <Text variant="body16Regular" style={styles.pillButtonSymbol}>
                  {sign.symbol}
                </Text>
                <Text
                  variant="body16Regular"
                  style={[
                    styles.pillButtonText,
                    zodiacSign === sign.value && styles.pillButtonTextSelected,
                  ]}
                >
                  {sign.label}
                </Text>
              </TouchableOpacity>
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
            {GENDER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.pillButton,
                  gender === option.value && styles.pillButtonSelected,
                ]}
                onPress={() => handleGenderSelect(option.value)}
                activeOpacity={0.7}
              >
                <Text
                  variant="body16Regular"
                  style={[
                    styles.pillButtonText,
                    gender === option.value && styles.pillButtonTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* What are you here for? */}
        <View style={styles.section}>
          <Text variant="body16Bold" style={styles.sectionTitle}>
            What are you here for?
          </Text>
          <Text variant="body16Regular" style={styles.helpText}>
            Select between one and three for the best experience
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {PURPOSE_OPTIONS.map((option) => {
              const isSelected = purpose.includes(option.value);
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.pillButton,
                    isSelected && styles.pillButtonSelected,
                  ]}
                  onPress={() => handlePurposeSelect(option.value)}
                  activeOpacity={0.7}
                >
                  <Text variant="body16Regular" style={styles.pillButtonEmoji}>
                    {option.emoji}
                  </Text>
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
    marginTop: moderateScale(spacing.xl),
    marginBottom: moderateScale(spacing.md),
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
    fontSize: moderateScale(20),
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: undefined,
    paddingHorizontal: moderateScale(spacing.xl),
  },
  sectionContainer: {
    width: '100%',
    paddingHorizontal: moderateScale(spacing.xl),
  },
  section: {
    marginBottom: moderateScale(spacing.xl),
    width: '100%',
  },
  sectionTitle: {
    color: '#D6E7E3',
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: undefined,
    marginBottom: moderateScale(spacing.md),
    paddingHorizontal: moderateScale(spacing.xl),
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: moderateScale(spacing.md),
  },
  toggleLabelContainer: {
    flex: 1,
    marginRight: moderateScale(spacing.sm),
  },
  toggleLabel: {
    color: '#D6E7E3',
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: undefined,
    marginBottom: moderateScale(2),
  },
  toggleSubLabel: {
    color: '#D6E7E3',
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: undefined,
    opacity: 0.7,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
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
    color: '#D6E7E3',
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: undefined,
  },
  pillButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pillButtonSymbol: {
    color: '#D6E7E3',
    fontSize: moderateScale(18),
    marginRight: moderateScale(spacing.xs),
  },
  pillButtonEmoji: {
    fontSize: moderateScale(16),
    marginRight: moderateScale(spacing.xs),
  },
  helpText: {
    color: '#D6E7E3',
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: undefined,
    opacity: 0.7,
    marginBottom: moderateScale(spacing.md),
    paddingHorizontal: moderateScale(spacing.xl),
  },
  errorText: {
    color: '#EF4444',
    fontSize: moderateScale(12),
    marginTop: moderateScale(spacing.xs),
  },
  buttonContainer: {
    width: '100%',
    marginBottom: moderateScale(spacing.md),
    paddingHorizontal: moderateScale(spacing.xl),
  },
  button: {
    width: '100%',
  },
  footerText: {
    textAlign: 'center',
    paddingHorizontal: moderateScale(spacing.md),
    marginBottom: moderateScale(spacing.xxl),
    color: '#F1F1F1',
    fontSize: moderateScale(12),
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: undefined,
  },
});

export default ProfilePersonalizationScreen;

