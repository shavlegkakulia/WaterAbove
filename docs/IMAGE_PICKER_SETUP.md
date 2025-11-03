# Image Picker Setup Guide

## Required Packages

To enable image picking functionality, you need to install the following packages:

```bash
yarn add react-native-image-picker
```

For iOS, you also need to run:
```bash
cd ios && pod install && cd ..
```

## Permissions

### iOS (Info.plist)
The following permissions have been added:
- `NSCameraUsageDescription` - Camera access for taking photos
- `NSPhotoLibraryUsageDescription` - Photo library access for selecting photos
- `NSPhotoLibraryAddUsageDescription` - Permission to save photos

### Android (AndroidManifest.xml)
The following permissions have been added:
- `CAMERA` - Camera access
- `READ_EXTERNAL_STORAGE` - For Android 12 and below
- `READ_MEDIA_IMAGES` - For Android 13+

## Features

The image picker utility (`src/utils/imagePicker.ts`) provides:

1. **Photo Library** - Select from device photo library
2. **Take Photo** - Open camera to take a new photo
3. **Choose File** - Select image file (currently uses photo library)

### Configuration
- Square aspect ratio (1:1) for profile pictures
- Image resized to max 1200x1200 pixels
- Quality set to 0.8
- Allows editing/cropping before selection
- Display size: 120x120 pixels

### Error Handling
- Permission denied handling with Settings redirect
- Camera unavailable detection
- User-friendly error messages

## Usage

```typescript
import { pickImageFromLibrary, takePhoto, pickFile } from '@/utils/imagePicker';

// Pick from library
const image = await pickImageFromLibrary();
if (image?.uri) {
  setProfileImage(image.uri);
}

// Take photo
const photo = await takePhoto();
if (photo?.uri) {
  setProfileImage(photo.uri);
}
```

## Next Steps

After installing `react-native-image-picker`:
1. Run `yarn install`
2. For iOS: `cd ios && pod install && cd ..`
3. Rebuild the app

