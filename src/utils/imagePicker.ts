import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  ImageLibraryOptions,
  CameraOptions,
} from 'react-native-image-picker';
import {Alert, Linking} from 'react-native';

export interface ImagePickerResult {
  uri: string;
  type?: string;
  fileName?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  base64?: string;
}

export interface ImagePickerError {
  code: string;
  message: string;
}

/**
 * Process image picker response
 */
const processImageResponse = (
  response: ImagePickerResponse
): ImagePickerResult | null => {
  if (response.didCancel) {
    return null;
  }

  if (response.errorCode) {
    throw new Error(response.errorMessage || 'Failed to pick image');
  }

  const asset = response.assets?.[0];
  if (!asset?.uri) {
    throw new Error('No image selected');
  }

  return {
    uri: asset.uri,
    type: asset.type,
    fileName: asset.fileName,
    fileSize: asset.fileSize,
    width: asset.width,
    height: asset.height,
    base64: asset.base64,
  };
};

/**
 * Image Picker Configuration
 * Configured for profile pictures: square, 120x120 display size
 */
const imageLibraryOptions: ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.8,
  maxWidth: 1200,
  maxHeight: 1200,
  selectionLimit: 1,
  includeBase64: true, // Include base64 for displaying on WelcomeScreen
  presentationStyle: 'fullScreen',
};

const cameraOptions: CameraOptions = {
  mediaType: 'photo',
  quality: 0.8,
  maxWidth: 1200,
  maxHeight: 1200,
  saveToPhotos: false,
  includeBase64: true, // Include base64 for displaying on WelcomeScreen
};

/**
 * Handle image picker errors with user-friendly messages
 */
const handleImagePickerError = (errorCode?: string, errorMessage?: string) => {
  const errorMessages: Record<string, string> = {
    camera_unavailable: 'Camera is not available on this device',
    permission: 'Permission denied. Please enable camera/photos permission in Settings.',
    others: errorMessage || 'Failed to pick image',
  };

  const message = errorCode && errorMessages[errorCode] 
    ? errorMessages[errorCode]
    : errorMessages.others;

  if (errorCode === 'permission') {
    Alert.alert(
      'Permission Required',
      message,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Open Settings', onPress: () => Linking.openSettings()},
      ]
    );
  } else {
    Alert.alert('Error', message);
  }
};

/**
 * Pick image from photo library
 */
export const pickImageFromLibrary = async (): Promise<ImagePickerResult | null> => {
  console.log('pickImageFromLibrary: Starting image library launch');
  console.log('pickImageFromLibrary: Options:', imageLibraryOptions);
  
  return new Promise((resolve, reject) => {
    try {
      launchImageLibrary(imageLibraryOptions, (response: ImagePickerResponse) => {
        console.log('pickImageFromLibrary: Response received:', {
          didCancel: response.didCancel,
          errorCode: response.errorCode,
          errorMessage: response.errorMessage,
          assetsCount: response.assets?.length || 0,
        });

        if (response.didCancel) {
          console.log('pickImageFromLibrary: User cancelled');
          resolve(null);
          return;
        }

        if (response.errorCode) {
          console.error('pickImageFromLibrary: Error:', response.errorCode, response.errorMessage);
          handleImagePickerError(response.errorCode, response.errorMessage);
          reject(new Error(response.errorMessage || 'Failed to pick image'));
          return;
        }

        try {
          const result = processImageResponse(response);
          console.log('pickImageFromLibrary: Success, result:', result);
          resolve(result);
        } catch (error) {
          console.error('pickImageFromLibrary: Process error:', error);
          reject(error);
        }
      });
    } catch (error) {
      console.error('pickImageFromLibrary: Launch error:', error);
      reject(error);
    }
  });
};

/**
 * Take photo with camera
 */
export const takePhoto = async (): Promise<ImagePickerResult | null> => {
  return new Promise((resolve, reject) => {
    launchCamera(cameraOptions, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        resolve(null);
        return;
      }

      if (response.errorCode) {
        handleImagePickerError(response.errorCode, response.errorMessage);
        reject(new Error(response.errorMessage || 'Failed to take photo'));
        return;
      }

      try {
        const result = processImageResponse(response);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  });
};

/**
 * Pick file (for Choose File option)
 * Uses image picker - same as photo library but can be extended for document picker
 */
export const pickFile = async (): Promise<ImagePickerResult | null> => {
  // For now, use image picker. Can be extended to use react-native-document-picker
  // if file picking (non-image files) is needed
  return pickImageFromLibrary();
};

