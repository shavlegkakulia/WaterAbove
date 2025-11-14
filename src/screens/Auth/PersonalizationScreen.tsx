import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, LayoutChangeEvent } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { spacing } from '@/theme';
import {
  Button,
  Text,
  FormInput,
  FormCard,
  AuthScreenWrapper,
  Input,
  Checkbox,
  Icon,
  DatePicker,
  TermsModal,
  ImagePickerModal,
  SVG_BORDER_HEIGHT,
} from '@/components';
import type { RootStackParamList } from '@/navigation/types';
import { useToast } from '@/store/hooks';
import {
  personalizationSchema,
  type PersonalizationFormData,
} from '@/validation';
import { moderateScale, isIOS } from '@/utils';
import {
  useCheckUsernameAvailabilityMutation,
  useAcceptTermsMutation,
  useUploadImageMutation,
  useUpdateUserMutation,
} from '@/api/query';
import type {
  AcceptTermsResponse,
  UploadImageResponse,
  UpdateUserResponse,
  CheckUsernameAvailabilityResponse,
} from '@/api/types';
import { pickImageFromLibrary, takePhoto, pickFile, type ImagePickerResult } from '@/utils/imagePicker';
import { validateImage } from '@/utils/imageValidation';
import { useNavigation } from '@react-navigation/native';

export const PersonalizationScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Personalization'>>();
  const navigation = useNavigation();
  const email = route.params?.email || '';
  const { showSuccess, showError } = useToast();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [profileImageBase64, setProfileImageBase64] = useState<string | null>(null);
  const [profileImagePosition, setProfileImagePosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<PersonalizationFormData>({
    resolver: zodResolver(personalizationSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      fullName: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      acceptTerms: false,
    },
  });

  const username = watch('username');
  const usernameCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // TanStack mutations
  const checkUsernameMutation = useCheckUsernameAvailabilityMutation();
  const acceptTermsMutation = useAcceptTermsMutation();
  const uploadImageMutation = useUploadImageMutation();
  const updateUserMutation = useUpdateUserMutation();
  
  // Store mutate function in ref to avoid closure issues
  const mutateRef = useRef(checkUsernameMutation.mutate);
  useEffect(() => {
    mutateRef.current = checkUsernameMutation.mutate;
  }, [checkUsernameMutation.mutate]);

  // Debounced username availability check
  useEffect(() => {
    // Clear previous timeout
    if (usernameCheckTimeoutRef.current) {
      clearTimeout(usernameCheckTimeoutRef.current);
    }

    // Don't check if username is empty or too short (less than 3 chars based on schema)
    if (!username || username.trim().length < 3) {
      // Clear any existing errors if username is too short
      clearErrors('username');
      return;
    }

    // Set timeout for 1 minute delay (60000ms = 1 minute as requested)
    usernameCheckTimeoutRef.current = setTimeout(() => {
      mutateRef.current(
        { username: username.trim() },
        {
          onSuccess: (response: CheckUsernameAvailabilityResponse) => {
            console.log('Username check response:', response);
            
            // Response is wrapped in ApiSuccessResponse structure
            // Access data through response.data
            const isAvailable = response.success && response.data?.available === true;
            
            console.log('isAvailable:', isAvailable);
            
            if (!isAvailable) {
              console.log('Setting username error - not available');
              setError('username', {
                type: 'manual',
                message: 'This username is already taken.',
              });
            } else {
              console.log('Clearing username error - available');
              // Clear error if username becomes available
              clearErrors('username');
              // Also trigger validation to ensure form state is updated
              setValue('username', username.trim(), { shouldValidate: true });
            }
          },
          onError: (error: any) => {
            // Handle error - if it's a 400/409, username might be taken
            if (error.response?.status === 400 || error.response?.status === 409) {
              setError('username', {
                type: 'manual',
                message: 'This username is already taken.',
              });
            }
            // For other errors, don't set error (might be network issue)
          },
        }
      );
    }, 1000); // 1 minute delay

    // Cleanup timeout on unmount or when username changes
    return () => {
      if (usernameCheckTimeoutRef.current) {
        clearTimeout(usernameCheckTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]); // Only depend on username to avoid infinite loops

  const handleDateSelect = (dateString: string) => {
    if (!dateString) {
      // Clear date
      setSelectedDate(null);
      setValue('dateOfBirth', '', { shouldValidate: true });
      setShowDatePicker(false);
      return;
    }
    const date = new Date(dateString);
    setSelectedDate(date);
    setValue('dateOfBirth', dateString, { shouldValidate: true });
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  const formatDateForDisplay = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleCheckboxPress = () => {
    if (!isAgreed) {
      // If not agreed, open the terms modal
      setShowTermsModal(true);
    } else {
      // If already agreed, uncheck
      setIsAgreed(false);
      setValue('acceptTerms', false, { shouldValidate: true });
    }
  };

  const handleTermsAgree = () => {
    setIsAgreed(true);
    setValue('acceptTerms', true, { shouldValidate: true });
    setShowTermsModal(false);
  };

  const handleTermsModalClose = () => {
    // When closing modal without agreeing, don't change isAgreed
    setShowTermsModal(false);
  };

  /**
   * Validate and set profile image
   */
  const handleImageSelection = (result: ImagePickerResult | null) => {
    if (!result?.uri) {
      return;
    }

    // Validate image according to backend requirements
    const validation = validateImage(result.fileSize, result.type);
    if (!validation.valid) {
      showError(validation.error || 'Image validation failed');
      return;
    }

    setProfileImageUri(result.uri);
    // Store base64 for displaying on WelcomeScreen
    if (result.base64) {
      // Add data URI prefix based on image type
      const mimeType = result.type || 'image/jpeg';
      const base64DataUri = `data:${mimeType};base64,${result.base64}`;
      setProfileImageBase64(base64DataUri);
    }
  };

  const handlePhotoLibrary = async () => {
    try {
      console.log('handlePhotoLibrary called');
      const result = await pickImageFromLibrary();
      console.log('pickImageFromLibrary result:', result);
      handleImageSelection(result);
    } catch (error: any) {
      console.error('handlePhotoLibrary error:', error);
      showError(error?.message || 'Failed to pick image from library');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await takePhoto();
      handleImageSelection(result);
    } catch (error: any) {
      showError(error?.message || 'Failed to take photo');
    }
  };

  const handleChooseFile = async () => {
    try {
      const result = await pickFile();
      handleImageSelection(result);
    } catch (error: any) {
      showError(error?.message || 'Failed to pick file');
    }
  };

  /**
   * Convert image URI to FormData for upload (binary format)
   * React Native FormData automatically handles binary upload
   */
  const createImageFormData = (uri: string): FormData => {
    const formData = new FormData();
    const filename = uri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const fileExtension = match ? match[1].toLowerCase() : 'jpg';
    
    // Map file extensions to MIME types
    // Only supported types: PNG, JPEG, WEBP (as per backend requirements)
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    };
    
    const type = mimeTypes[fileExtension] || 'image/jpeg';

    // React Native FormData format for binary file upload
    // Field name must be 'image' to match web API format
    // @ts-ignore - React Native FormData supports object with uri, type, name
    formData.append('image', {
      uri: isIOS ? uri.replace('file://', '') : uri, // iOS needs file:// removed
      type,
      name: filename,
    } as FormDataPart);

    console.log('FormData created:', {
      filename,
      type,
      uri: uri.substring(0, 50) + '...',
    });

    return formData;
  };

  /**
   * Format date to DD-MM-YYYY
   */
  const formatDateForAPI = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const onSubmit = async (data: PersonalizationFormData) => {
    // Check if profile image is uploaded
    if (!profileImageUri) {
      showError('Please upload a profile photo');
      return;
    }

    // Check if date is selected
    if (!selectedDate) {
      showError('Please select your date of birth');
      return;
    }

    try {
      // Step 1: Accept Terms
      const acceptTermsResponse = await new Promise<AcceptTermsResponse>((resolve, reject) => {
        acceptTermsMutation.mutate(
          {
            termsVersion: '1.0.0',
            privacyPolicyVersion: '1.0.0',
          },
          {
            onSuccess: (response: AcceptTermsResponse) => resolve(response),
            onError: (error: any) => reject(error),
          },
        );
      });

      if (!acceptTermsResponse.success) {
        throw new Error('Failed to accept terms and conditions');
      }

      // Step 2: Upload Image
      const imageFormData = createImageFormData(profileImageUri);
      const uploadResponse = await new Promise<UploadImageResponse>((resolve, reject) => {
        uploadImageMutation.mutate(imageFormData, {
          onSuccess: (response: UploadImageResponse) => resolve(response),
          onError: (error: any) => reject(error),
        });
      });

      if (!uploadResponse.success) {
        throw new Error('Failed to upload image');
      }

      const avatarUrl = uploadResponse.data.url;

      // Step 3: Update User
      const updateResponse = await new Promise<UpdateUserResponse>((resolve, reject) => {
        updateUserMutation.mutate(
          {
            userData: {
              username: data.username,
              firstName: data.firstName,
              lastName: '',
              fullName: data.firstName,
            },
            profileData: {
              dateOfBirth: formatDateForAPI(selectedDate),
              avatarUrl: avatarUrl,
              profileCompletionPercentage: 50,
            },
          },
          {
            onSuccess: (response: UpdateUserResponse) => resolve(response),
            onError: (error: any) => reject(error),
          },
        );
      });

      if (!updateResponse.success) {
        throw new Error('Failed to update user profile');
      }

      showSuccess('Account personalized successfully!');
      // Navigate to Welcome screen with uploaded avatar URL and base64 image
      navigation.navigate('Welcome', { 
        avatarUrl,
        avatarBase64: profileImageBase64 || undefined,
      });
    } catch (error: any) {
      // Error handling is done in axios interceptor
      // Just re-throw to let the interceptor handle it
      throw error;
    }
  };

  // Calculate if form is valid including isAgreed
  const isFormValid = isValid && isAgreed;

  return (
    <AuthScreenWrapper>
      <FormCard>
        {/* Title */}
        <Text variant="heading28Bold" color="textWhiteWA" style={styles.title}>
          Let's quickly finish personalizing your account
        </Text>

        {/* Profile Picture Placeholder */}
        <TouchableOpacity 
          style={styles.profileContainer}
          onPress={() => setShowImagePicker(true)}
          onLayout={(event: LayoutChangeEvent) => {
            // Measure position relative to screen
            event.target.measure((_fx, _fy, fwidth, fheight, px, py) => {
              setProfileImagePosition({ x: px, y: py, width: fwidth, height: fheight });
            });
          }}
        >
          <Image
            source={
              profileImageUri
                ? { uri: profileImageUri }
                : require('@/assets/images/avatar.png')
            }
            style={styles.avatar}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Email Display */}
        <Text variant="body16Regular" color="textPrimary" style={styles.email}>
          {email}
        </Text>

        {/* Username Input */}
        <View style={styles.input}>
          <FormInput
            control={control}
            autoCorrect={false}
            name="username"
            label="Select User Name"
            placeholder="Enter your username"
            containerStyle={styles.input}
            helpText="Create a unique username for your profileNo symbols, limit numbers, and first character must be a letter."
          />
        </View>

        {/* Display Name Input */}
        <View style={styles.input}>
          <FormInput
            control={control}
            name="firstName"
            label="Select Display Name"
            placeholder="Enter your display name"
            containerStyle={styles.input}
            helpText="Use your real name to help build genuine connections"
          />
        </View>

        {/* Date of Birth Input */}
        <View style={styles.input}>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
            style={styles.datePickerTouchable}
          >
            <View pointerEvents="none">
              <Input
                label="Date of Birth"
                placeholder="Select a Date"
                value={selectedDate ? formatDateForDisplay(selectedDate) : ''}
                state={
                  errors.dateOfBirth
                    ? 'error'
                    : selectedDate
                    ? 'success'
                    : 'default'
                }
                rightIcon={
                  <View style={styles.calendarIconContainer}>
                    <Icon name="Calendar" size={20} color="#ffffff" />
                  </View>
                }
                helpText={
                  errors.dateOfBirth?.message || (selectedDate ? undefined : '')
                }
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Custom DatePicker */}
        <DatePicker
          showDatePicker={showDatePicker}
          onSelectDate={handleDateSelect}
          onCancel={handleDateCancel}
          maxYear={new Date().getFullYear()}
          maxMonth={new Date().getMonth() + 1}
          maxDay={new Date().getDate()}
        />

        {/* Terms Checkbox */}
        <Checkbox
          checked={isAgreed}
          onPress={handleCheckboxPress}
          label="I Agree to the Terms & Conditions"
          size={24}
          containerStyle={styles.checkbox}
        />

        {/* Save and Continue Button */}
        <Button
          title="Save and Continue"
          variant="primary"
          size="small"
          disabled={!isFormValid}
          onPress={handleSubmit(onSubmit)}
          containerStyle={styles.button}
        />

        {/* Terms Modal */}
        <TermsModal
          visible={showTermsModal}
          onClose={handleTermsModalClose}
          onAgree={handleTermsAgree}
        />

        {/* Image Picker Modal */}
        <ImagePickerModal
          visible={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onSelectPhotoLibrary={handlePhotoLibrary}
          onSelectTakePhoto={handleTakePhoto}
          onSelectChooseFile={handleChooseFile}
          anchorPosition={profileImagePosition || undefined}
        />
      </FormCard>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginTop: moderateScale(spacing.xxxl) - SVG_BORDER_HEIGHT,
    marginBottom: moderateScale(spacing.lg),
  },
  profileContainer: {
    alignSelf: 'center',
    marginBottom: moderateScale(spacing.md),
    position: 'relative',
  },
  avatar: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    overflow: 'hidden',
  },
  email: {
    textAlign: 'center',
    marginBottom: moderateScale(spacing.lg),
  },
  input: {
    width: '100%',
    marginBottom: moderateScale(spacing.sm),
  },
  datePickerTouchable: {
    width: '100%',
  },
  calendarIcon: {
    padding: moderateScale(4),
  },
  calendarIconContainer: {
    padding: moderateScale(4),
  },
  checkbox: {
    marginBottom: moderateScale(spacing.lg),
  },
  helpText: {
    marginTop: moderateScale(spacing.xs),
    marginLeft: moderateScale(spacing.md),
  },
  button: {
    width: '100%',
    marginBottom: moderateScale(spacing.xxxl) - SVG_BORDER_HEIGHT,
  },
});

export default PersonalizationScreen;
