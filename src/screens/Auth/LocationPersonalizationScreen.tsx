import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormCard, FormInput, Button, Text, AuthScreenWrapper, CircularProgressBar, Switch } from '@/components';
import { colors, fontSize, lineHeight, spacing } from '@/theme';
import { moderateScale } from '@/utils';
import MapSvg from '@/assets/svg/map.svg';
import { Icon } from '@/components/ui/Icon';
import { useLocationAutocomplete } from '@/hooks/useLocationAutocomplete';
import { useLocationMemberCountsMutation, useUpdateUserLocationMutation, useUpdateUserMutation } from '@/api/query';
import type {
  LocationAutocompleteSuggestion,
  LocationMemberCount,
  LocationMemberCountsResponse,
  LocationMatch,
} from '@/api/types';
import { useToast } from '@/store/hooks';
import { useAppNavigation, useAppRoute } from '@/navigation';

// Validation schema
const locationSchema = z.object({
  location: z.string().trim().min(1, 'Location is required'),
});

type LocationFormData = z.infer<typeof locationSchema>;

export const LocationPersonalizationScreen: React.FC = () => {
  const navigation = useAppNavigation<'LocationPersonalization'>();
  const route = useAppRoute<'LocationPersonalization'>();
  const email = route.params?.email || '';

  const userLocation = route.params?.userLocation;
  const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(
    route.params?.profileCompletionPercentage || 50
  );

  const [shareLocationOnProfile, setShareLocationOnProfile] = useState(userLocation?.showOnProfile || false);
  const [memberMap, setMemberMap] = useState(false);
  const [subscribe, setSubscribe] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationAutocompleteSuggestion | null>(null);
  const [memberCounts, setMemberCounts] = useState<
    Array<LocationMemberCount & { key: 'continent' | 'country' | 'region' | 'city' }>
  >([]);
  const [subscribeSwitches, setSubscribeSwitches] = useState<Record<string, boolean>>({});
  const [maxLabelWidth, setMaxLabelWidth] = useState(0);
  const labelWidthsRef = useRef<Record<string, number>>({});
  const inputContainerRef = useRef<View>(null);
  const previousLocationValueRef = useRef<string>('');
  const { showSuccess } = useToast();
  // Member counts mutation
  const memberCountsMutation = useLocationMemberCountsMutation();
  // Update user location mutation
  const updateLocationMutation = useUpdateUserLocationMutation();
  // Update user mutation
  const updateUserMutation = useUpdateUserMutation();

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
    setError,
    clearErrors,
    watch,
    setValue,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    mode: 'onChange',
    defaultValues: {
      location: userLocation?.formattedAddress || '',
    },
    criteriaMode: 'all',
  });

  // Check if any toggle is on but location is empty
  const hasToggleOn =
    shareLocationOnProfile || memberMap || (subscribe && selectedLocation !== null);
  const locationValue = watch('location') || '';

  // Location autocomplete hook using TanStack Query
  const { suggestions, isLoading: isAutocompleteLoading, search: searchLocation } = useLocationAutocomplete({
    debounceMs: 1000,
    limit: 8,
    enabled: showSuggestions && !selectedLocation,
  });

  // Load userLocation data on mount
  React.useEffect(() => {
    if (userLocation) {
      // Set location value
      setValue('location', userLocation.formattedAddress || '', { shouldValidate: true });
      previousLocationValueRef.current = userLocation.formattedAddress || '';
      setSubscribe(userLocation.subscribeToMemberMap ?? true);
      
      // Build suggestion from existing user location
      if (userLocation.formattedAddress) {
        const locationMatch: LocationMatch = {
          continent: userLocation.continentId
            ? {
                id: userLocation.continentId,
                name: '',
              }
            : undefined,
          country: userLocation.countryId
            ? {
                id: userLocation.countryId,
                name: '',
              }
            : undefined,
          region: userLocation.regionId
            ? {
                id: userLocation.regionId,
                name: '',
              }
            : undefined,
          city: userLocation.cityId
            ? {
                id: userLocation.cityId,
                name: '',
              }
            : undefined,
        };

        const savedSuggestion: LocationAutocompleteSuggestion = {
          description: userLocation.formattedAddress,
          placeId:
            userLocation.cityId ||
            userLocation.regionId ||
            userLocation.countryId ||
            userLocation.continentId ||
            'existing-location',
          formattedAddress: userLocation.formattedAddress || undefined,
          locationMatch,
        };

        setSelectedLocation(savedSuggestion);

        memberCountsMutation
          .mutateAsync({
            cityId: userLocation.cityId || undefined,
            countryId: userLocation.countryId || undefined,
            regionId: userLocation.regionId || undefined,
            continentId: userLocation.continentId || undefined,
          })
          .then(response => {
            if (response.success && response.data) {
              const initialSwitchValues: Partial<
                Record<'continent' | 'country' | 'region' | 'city', boolean>
              > = {
                continent: userLocation.subscribeToContinentGroup ?? true,
                country: userLocation.subscribeToCountryGroup ?? true,
                region: userLocation.subscribeToRegionGroup ?? true,
                city: userLocation.subscribeToCityGroup ?? true,
              };
              const { counts, switches } = convertMemberCountsToArray(
                response.data,
                locationMatch,
                initialSwitchValues,
              );
              setMemberCounts(counts);
              setSubscribeSwitches(switches);
            }
          })
          .catch(error => {
            console.error('Failed to fetch member counts:', error);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Watch location input changes and trigger autocomplete
  React.useEffect(() => {
    // Skip if locationValue hasn't actually changed
    if (locationValue === previousLocationValueRef.current) {
      return;
    }
    
    previousLocationValueRef.current = locationValue;

    if (locationValue && !selectedLocation) {
      // Trigger search for autocomplete
      searchLocation(locationValue);
      setShowSuggestions(true);
    } else if (!locationValue.trim()) {
      setShowSuggestions(false);
      // Clear member counts and switches when input is cleared
      setMemberCounts([]);
      setSubscribeSwitches({});
      // Only clear selectedLocation if it was previously set
      if (selectedLocation) {
        setSelectedLocation(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationValue]);

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

    // Validate that location is selected
    if (!selectedLocation) {
      setError('location', {
        type: 'manual',
        message: 'Please select a location from the suggestions',
      });
      return;
    }

    try {
      // Prepare request data
      const match = selectedLocation.locationMatch;
      const requestData = {
        continentId: match?.continent?.id ?? undefined,
        countryId: match?.country?.id ?? undefined,
        regionId: match?.region?.id ?? undefined,
        cityId: match?.city?.id ?? undefined,
        showOnProfile: shareLocationOnProfile,
        subscribeToMemberMap: subscribe,
        subscribeToContinentGroup: subscribeSwitches.continent || false,
        subscribeToCountryGroup: subscribeSwitches.country || false,
        subscribeToRegionGroup: subscribeSwitches.region || false,
        subscribeToCityGroup: subscribeSwitches.city || false,
        formattedAddress:
          selectedLocation.formattedAddress ??
          selectedLocation.description ??
          data.location.trim(),
      };

      const locationResponse = await updateLocationMutation.mutateAsync(requestData);

      if (locationResponse.success && locationResponse.data) {
        // Update user profile completion percentage
        try {
          const userUpdateResponse = await updateUserMutation.mutateAsync({
            userData: {},
            profileData: {
              profileCompletionPercentage: 60,
            },
          });

          if (userUpdateResponse.success && userUpdateResponse.data) {
            // Update profile completion percentage from response
            const updatedPercentage = userUpdateResponse.data.user?.profile?.profileCompletionPercentage;
            if (updatedPercentage !== undefined && updatedPercentage !== null) {
              setProfileCompletionPercentage(updatedPercentage);
            }
            showSuccess('Location updated successfully!');
            // Navigate to next screen (ProfilePersonalization)
            // Get user profile from response
            const userProfile = userUpdateResponse.data.user?.profile;
            navigation.navigate('ProfilePersonalization', { 
              email, 
              profileCompletionPercentage: updatedPercentage || 50,
              userProfile,
            });
          }
        } catch (userUpdateError) {
          console.error('Failed to update user profile:', userUpdateError);
          // Still show success for location update even if profile update fails
          showSuccess('Location updated successfully!');
        }
      }
    } catch (error) {
      console.error('Failed to update user location:', error);
      setError('location', {
        type: 'manual',
        message: 'Failed to save location. Please try again.',
      });
    }
  };

  const handleToggleChange = (
    toggleName: 'shareLocation' | 'memberMap' | 'subscribe',
  ) => {
    const currentValue =
      toggleName === 'shareLocation'
        ? shareLocationOnProfile
        : toggleName === 'memberMap'
        ? memberMap
        : subscribe;
    const newValue = !currentValue;

    // Update toggle state
    if (toggleName === 'shareLocation') {
      setShareLocationOnProfile(newValue);
    } else if (toggleName === 'memberMap') {
      setMemberMap(newValue);
    } else {
      setSubscribe(newValue);
      setSubscribeSwitches(prev => {
        if (memberCounts.length === 0) {
          return newValue ? prev : {};
        }

        const updated: Record<string, boolean> = {};
        memberCounts.forEach(({ key }) => {
          if (key) {
            updated[key] = newValue;
          }
        });

        return updated;
      });
    }

    // If enabling toggle without location, set error
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

  const convertMemberCountsToArray = (
    data: LocationMemberCountsResponse | null | undefined,
    match?: LocationMatch,
    initialSwitchValues?: Partial<
      Record<'continent' | 'country' | 'region' | 'city', boolean>
    >,
  ): {
    counts: Array<
      LocationMemberCount & { key: 'continent' | 'country' | 'region' | 'city' }
    >;
    switches: Record<string, boolean>;
  } => {
    const counts: Array<
      LocationMemberCount & { key: 'continent' | 'country' | 'region' | 'city' }
    > = [];
    const switches: Record<string, boolean> = {};

    const order: Array<'continent' | 'country' | 'region' | 'city'> = [
      'continent',
      'country',
      'region',
      'city',
    ];

    order.forEach(key => {
      const matchEntity = match?.[key];
      const countEntity = data?.[key];

      if (!matchEntity && !countEntity) {
        return;
      }

      counts.push({
        key,
        id: matchEntity?.id ?? countEntity?.id ?? `${key}-unknown`,
        name:
          matchEntity?.name ??
          countEntity?.name ??
          matchEntity?.code ??
          countEntity?.code ??
          key,
        code: matchEntity?.code ?? countEntity?.code ?? null,
        memberCount: countEntity?.memberCount ?? 0,
      });

      switches[key] = initialSwitchValues?.[key] ?? true;
    });

    return { counts, switches };
  };

  const handleSelectLocation = async (
    suggestion: LocationAutocompleteSuggestion,
  ) => {
    setSelectedLocation(suggestion);
    const formatted =
      suggestion.formattedAddress ?? suggestion.description ?? '';
    // Update previousLocationValueRef to prevent useEffect from triggering
    previousLocationValueRef.current = formatted;
    setValue('location', formatted, { shouldValidate: true });
    setShowSuggestions(false);
    clearErrors('location');

    // Fetch member counts for selected location
    try {
      const response = await memberCountsMutation.mutateAsync({
        cityId: suggestion.locationMatch?.city?.id ?? undefined,
        countryId: suggestion.locationMatch?.country?.id ?? undefined,
        regionId: suggestion.locationMatch?.region?.id ?? undefined,
        continentId: suggestion.locationMatch?.continent?.id ?? undefined,
      });

      const { counts, switches } = convertMemberCountsToArray(
        response.success ? response.data : null,
        suggestion.locationMatch,
      );

      // Reset label widths when member counts change
      labelWidthsRef.current = {};
      setMaxLabelWidth(0);
      setMemberCounts(counts);
      setSubscribeSwitches(switches);
    } catch (error) {
      console.error('Failed to fetch member counts:', error);
      const { counts, switches } = convertMemberCountsToArray(
        null,
        suggestion.locationMatch,
      );
      labelWidthsRef.current = {};
      setMaxLabelWidth(0);
      setMemberCounts(counts);
      setSubscribeSwitches(switches);
    }
  };

  const handleInputFocus = () => {
    if (locationValue && !selectedLocation) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow selection
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const renderSuggestionItem = (item: LocationAutocompleteSuggestion) => (
    <TouchableOpacity
      key={item.placeId}
      style={styles.suggestionItem}
      onPress={() => handleSelectLocation(item)}
      activeOpacity={0.7}
    >
      <Text variant="body16Regular" style={styles.suggestionText}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <AuthScreenWrapper>
      <FormCard style={styles.card}>
          {/* Progress Indicator */}
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

          {/* Title */}
          <Text variant="heading20Bold" style={styles.title}>
            Bring Your Profile to Life!
          </Text>

          {/* Question */}
          <Text variant="body16Bold" style={styles.question}>
            Where are you from?
          </Text>

          {/* Location Input */}
          <View style={styles.inputContainer} ref={inputContainerRef}>
            <Text style={styles.inputLabel}>
              Share your Continent, Country, Region, State, or City
            </Text>
            <View style={styles.inputWrapper}>
              <FormInput
                control={control}
                name="location"
                placeholder="Enter Your Location"
                containerStyle={styles.input}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              {isAutocompleteLoading && (
                <View style={styles.loadingIndicator}>
                  <ActivityIndicator size="small" color="#46C2A3" />
                </View>
              )}
            </View>
            {showSuggestions && suggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <ScrollView
                  style={styles.suggestionsList}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                >
                  {suggestions.map(renderSuggestionItem)}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Toggle Options */}
          <View style={styles.togglesContainer}>
            {/* Share Location on Profile */}
            <View style={styles.toggleRow}>
              <Text variant="paragraph14Bold" style={styles.toggleLabel}>
                Share Location on Profile
              </Text>
              <Switch
                value={shareLocationOnProfile}
                onValueChange={() => handleToggleChange('shareLocation')}
                trackColor={{ false: '#767577', true: '#46C2A3' }}
                thumbColor={shareLocationOnProfile ? '#fff' : '#f4f3f4'}
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
            {memberCounts.length > 0 && (
            <View style={styles.toggleRow}>
              <Text variant="paragraph14Bold" style={styles.toggleLabel}>
                Subscribe
              </Text>
              <Switch
                value={subscribe}
                onValueChange={() => handleToggleChange('subscribe')}
                trackColor={{ false: '#767577', true: '#46C2A3' }}
                thumbColor={subscribe ? '#fff' : '#f4f3f4'}
                style={styles.switch}
              />
            </View>
            )}

            {/* Dynamic Subscribe Switches */}
            {memberCounts.length > 0 && (
              <View style={styles.subscribeSwitchesContainer}>
                {memberCounts.map((count) => {
                  const key = (count as any).key as 'continent' | 'country' | 'region' | 'city';
                  const label = 
                    key === 'continent' ? 'Continent' :
                    key === 'country' ? 'Country' :
                    key === 'region' ? 'State/Region' :
                    'City';
                  
                  const displayName =
                    (count.name && count.name.length > 0 ? count.name : undefined) ??
                    label;
                  const memberCount = count.memberCount;
                  const isEnabled = subscribeSwitches[key] || false;

                  return (
                    <View key={key} style={styles.subscribeSwitchRow}>
                      <Text
                        variant="paragraph14Bold"
                        style={[styles.subscribeSwitchLabel, maxLabelWidth > 0 && { width: maxLabelWidth }]}
                        onLayout={(event) => {
                          const { width } = event.nativeEvent.layout;
                          if (width !== labelWidthsRef.current[key]) {
                            labelWidthsRef.current[key] = width;
                            const maxWidth = Math.max(...Object.values(labelWidthsRef.current));
                            if (maxWidth !== maxLabelWidth) {
                              setMaxLabelWidth(maxWidth);
                            }
                          }
                        }}
                      >
                        {label}:
                      </Text>
                      <Switch
                        value={isEnabled}
                        onValueChange={() => {
                          setSubscribeSwitches(prev => ({
                            ...prev,
                            [key]: !prev[key],
                          }));
                        }}
                        trackColor={{ false: '#767577', true: '#46C2A3' }}
                        thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
                        style={styles.locDetailsSwitch}
                      />
                      <Text variant="caption12Regular" style={styles.subscribeSwitchName} numberOfLines={1} ellipsizeMode="tail">
                        {displayName} ({memberCount.toLocaleString()} Members)
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
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
              disabled={!isValid || !!errors.location || !locationValue.trim() || !selectedLocation}
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
    marginTop: moderateScale(spacing.xl),
    marginBottom: moderateScale(22),
  },
  title: {
    textAlign: 'center',
    marginBottom: moderateScale(22),
    color: '#D6E7E3',
    height: moderateScale(lineHeight.xxxxl),
  },
  question: {
    textAlign: 'center',
    marginBottom: moderateScale(22),
    color: '#D6E7E3',
  },
  inputContainer: {
    marginBottom: moderateScale(22),
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  inputLabel: {
    color: colors.textWhiteWA,
    fontSize: moderateScale(fontSize.xs),
    fontWeight: '700',
    marginBottom: moderateScale(spacing.xs),
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    marginBottom: 0,
    width: '100%',
  },
  loadingIndicator: {
    position: 'absolute',
    right: moderateScale(12),
    top: '50%',
    transform: [{ translateY: moderateScale(-10) }],
    zIndex: 2,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: moderateScale(4),
    backgroundColor: '#171B22',
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#0369F1',
    maxHeight: moderateScale(200),
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionsList: {
    maxHeight: moderateScale(200),
  },
  suggestionItem: {
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  suggestionText: {
    color: '#F1F1F1',
    fontSize: moderateScale(14),
  },
  togglesContainer: {
    marginBottom: moderateScale(22),
    width: '100%',
  },
  subscribeSwitchesContainer: {
    marginTop: moderateScale(22),
    width: '100%',
    gap: moderateScale(spacing.sm),
  },
  subscribeSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  subscribeSwitchLabel: {
    color: '#D6E7E3',
    textAlign: 'right',
    flexShrink: 0,
  },
  subscribeSwitchName: {
    color: 'rgba(255, 255, 255, 0.50)',
    flexShrink: 1,
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
  },
  switch: {
  },
  locDetailsSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    marginLeft: moderateScale(22),
    marginRight: moderateScale(12),
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
    color: '#C7DBD6',
  },
});

export default LocationPersonalizationScreen;

