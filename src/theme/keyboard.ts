import { Platform } from 'react-native';

export const KEYBOARD_AVOIDING_VIEW_BEHAVIOR =
  Platform.OS === 'ios' ? 'padding' : 'height';
