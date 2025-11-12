import { isIOS } from '@/utils';

export const KEYBOARD_AVOIDING_VIEW_BEHAVIOR =
  isIOS ? 'padding' : 'height';
