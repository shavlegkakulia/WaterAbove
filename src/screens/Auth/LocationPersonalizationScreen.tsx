import React, { useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormCard, FormInput, Button, Text, AuthScreenWrapper, CircularProgressBar } from '@/components';
import { spacing } from '@/theme';
import { moderateScale } from '@/utils';
import type { RootStackParamList } from '@/navigation/types';
import MapSvg from '@/assets/svg/map.svg';
import { Icon } from '@/components/Icon';

// Validation schema
const locationSchema = z.object({
  location: z.string().min(1, 'Location is required'),
});

type LocationFormData = z.infer<typeof locationSchema>;

export const LocationPersonalizationScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'LocationPersonalization'>>();
  const email = (route.params as any)?.email || '';

  const [shareLocationOnProfile, setShareLocationOnProfile] = useState(false);
  const [memberMap, setMemberMap] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
    setError,
    clearErrors,
    watch,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    mode: 'onChange',
    defaultValues: {
      location: '',
    },
  });

  // Check if any toggle is on but location is empty
  const hasToggleOn = shareLocationOnProfile || memberMap || subscribe;
  const locationValue = watch('location') || '';

  // Validate location when toggles change
  React.useEffect(() => {
    if (hasToggleOn && !locationValue.trim()) {
      setError('location', {
        type: 'manual',
        message: 'Location is required when toggles are enabled',
      });
    } else {
      clearErrors('location');
    }
  }, [hasToggleOn, locationValue, setError, clearErrors]);

  const onSubmit = async (data: LocationFormData) => {
    // Validate location is filled
    if (!data.location.trim()) {
      setError('location', {
        type: 'manual',
        message: 'Location is required',
      });
      return;
    }

    // Save location and toggle states to user profile
    // TODO: Implement API call to save location data
    
    // Navigate to next screen (Personalization or Welcome)
    navigation.navigate('Personalization', { email });
  };

  const handleToggleChange = (toggleName: 'shareLocation' | 'memberMap' | 'subscribe') => {
    const currentValue = 
      toggleName === 'shareLocation' ? shareLocationOnProfile :
      toggleName === 'memberMap' ? memberMap :
      subscribe;

    // Update toggle state
    if (toggleName === 'shareLocation') {
      setShareLocationOnProfile(!currentValue);
    } else if (toggleName === 'memberMap') {
      setMemberMap(!currentValue);
    } else {
      setSubscribe(!currentValue);
    }

    // If enabling toggle without location, set error
    const newValue = !currentValue;
    if (newValue && !locationValue.trim()) {
      setError('location', {
        type: 'manual',
        message: 'Please enter location before enabling this option',
      });
    } else if (locationValue.trim()) {
      clearErrors('location');
    }
  };

  const handleSaveAndContinue = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <AuthScreenWrapper>
      <FormCard style={styles.card}>
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <CircularProgressBar
              progress={50}
              size={19}
              strokeWidth={moderateScale(4)}
              filledColor="#EDA618"
              unfilledColor="#F6CF8238"
              textColor="#EDA618"
            />
          </View>

          {/* Title */}
          <Text variant="heading28Bold" style={styles.title}>
            Bring Your Profile to Life!
          </Text>

          {/* Question */}
          <Text variant="body16Regular" style={styles.question}>
            Where are you from?
          </Text>

          {/* Location Input */}
          <View style={styles.inputContainer}>
            <Text variant="caption12Regular" color="textSecondary" style={styles.inputLabel}>
              Share your Continent, Country, Region, State, or City
            </Text>
            <FormInput
              control={control}
              name="location"
              placeholder="Enter Your Location"
              containerStyle={styles.input}
            />
          </View>

          {/* Toggle Options */}
          <View style={styles.togglesContainer}>
            {/* Share Location on Profile */}
            <View style={styles.toggleRow}>
              <Text variant="body16Regular" style={styles.toggleLabel}>
                Share Location on Profile
              </Text>
              <Switch
                value={shareLocationOnProfile}
                onValueChange={() => handleToggleChange('shareLocation')}
                trackColor={{ false: '#767577', true: '#46C2A3' }}
                thumbColor={shareLocationOnProfile ? '#fff' : '#f4f3f4'}
                ios_backgroundColor="#767577"
                style={styles.switch}
              />
            </View>

            {/* Member Map - Centered */}
            <View style={styles.memberMapRow}>
              <View style={styles.memberMapContainer}>
                <Icon name="Map" size={22} color="#46C2A3" />
                <View style={styles.memberMapTextContainer}>
                  <Text variant="body16Regular" style={styles.memberMapLabel}>
                    Member Map
                  </Text>
                  <Text variant="caption12Regular" style={styles.betaBadge}>
                    Beta
                  </Text>
                </View>
              </View>
            </View>

            {/* Subscribe */}
            <View style={styles.toggleRow}>
              <Text variant="body16Regular" style={styles.toggleLabel}>
                Subscribe
              </Text>
              <Switch
                value={subscribe}
                onValueChange={() => handleToggleChange('subscribe')}
                trackColor={{ false: '#767577', true: '#46C2A3' }}
                thumbColor={subscribe ? '#fff' : '#f4f3f4'}
                ios_backgroundColor="#767577"
                style={styles.switch}
              />
            </View>
          </View>

          {/* World Map */}
          <View style={styles.mapContainer}>
            <MapSvg width={moderateScale(194)} height={moderateScale(108)} />
          </View>

          {/* Save and Continue Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Save and Continue"
              onPress={handleSaveAndContinue}
              variant="primary"
              size="large"
              containerStyle={styles.button}
              disabled={!isValid || !!errors.location}
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(spacing.xxl),
    marginBottom: moderateScale(22),
  },
  title: {
    textAlign: 'center',
    marginBottom: moderateScale(spacing.md),
    color: '#D6E7E3',
    fontSize: moderateScale(20),
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: undefined,
  },
  question: {
    textAlign: 'center',
    marginBottom: moderateScale(22),
    color: '#D6E7E3',
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: undefined,
  },
  inputContainer: {
    marginBottom: moderateScale(25),
    width: '100%',
  },
  inputLabel: {
    marginBottom: moderateScale(spacing.xs),
  },
  input: {
    marginBottom: 0,
    width: '100%',
  },
  togglesContainer: {
    marginBottom: moderateScale(22),
    width: '100%',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  toggleLabel: {
    flex: 1,
    color: '#D6E7E3',
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: moderateScale(16.979),
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  memberMapRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: moderateScale(22),
  },
  memberMapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberMapTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: moderateScale(spacing.xs),
  },
  memberMapLabel: {
    color: '#46C2A3',
    fontSize: moderateScale(18.118),
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: moderateScale(21.973),
  },
  betaBadge: {
    marginLeft: moderateScale(4),
    color: '#46C2A3',
    fontSize: moderateScale(12.941),
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 0,
    marginTop: moderateScale(-2),
  },
  mapContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(22),
    paddingVertical: moderateScale(spacing.md),
  },
  buttonContainer: {
    width: '100%',
    marginBottom: moderateScale(22),
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

export default LocationPersonalizationScreen;

