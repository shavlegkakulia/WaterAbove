# Video Player Setup Guide

## Required Package

The project uses `react-native-video` for playing video content.

```bash
yarn add react-native-video
```

## iOS Setup

After installing the package, you need to install iOS pods:

```bash
cd ios && pod install && cd ..
```

## Android Setup

Android permissions are already configured in `AndroidManifest.xml`. No additional setup required.

## Usage

The video player is integrated in `LessonDetailVideoScreen.tsx` and automatically handles:

1. **Local videos** - Videos from `@/assets/video.mp4`
2. **Remote videos** - Videos from URL (if needed in the future)

### Video Source

Videos are loaded from the lesson data:
- Local video path: `'@/assets/video.mp4'` 
- The app automatically uses `require('@/assets/video.mp4')` for local assets

### Features

- ✅ Auto-play on load
- ✅ Video controls (play, pause, seek, volume)
- ✅ Loading indicator
- ✅ Error handling
- ✅ Responsive video container

## Next Steps

1. Run `yarn install` (if not already done)
2. For iOS: `cd ios && pod install && cd ..`
3. Rebuild the app:
   - iOS: `yarn ios`
   - Android: `yarn android`

## Video File Location

Make sure your video file is located at:
- `src/assets/video.mp4`

The video will be bundled with the app for offline playback.

