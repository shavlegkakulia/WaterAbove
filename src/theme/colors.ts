export const colors = {
  // Primary Colors
  primary: '#D4AF37', // Golden yellow
  primaryLight: '#E6C969',
  primaryDark: '#B8941F',

  // Secondary Colors
  secondary: '#1E3A5F', // Dark blue
  secondaryLight: '#2B4F7D',
  secondaryDark: '#142940',

  // Accent Colors
  accent: '#8A2BE2', // Purple
  accentLight: '#A855F7',
  accentDark: '#6B21A8',

  // Status Colors
  success: '#4ECDC4', // Teal/Turquoise
  successLight: '#7EDDD6',
  successDark: '#3BA69F',

  error: '#FF6B6B', // Coral red
  errorLight: '#FF8E8E',
  errorDark: '#E85555',

  warning: '#FFB84D',
  warningLight: '#FFC977',
  warningDark: '#E5A443',

  info: '#4A90E2', // Light blue
  infoLight: '#6FA9E8',
  infoDark: '#3A7AC8',

  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',

  // Gray Scale
  gray50: '#F9FAFB',
  gray100: '#F0F0F0',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6C6C6C',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#2C2C34',
  gray900: '#1F2937',

  // Background Colors
  backgroundLight: '#F9FAFB',
  backgroundDark: '#0F172A',
  backgroundCard: '#1E293B',
  backgroundInput: '#363A4F',

  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textDisabled: '#6B7280',
  textDark: '#000000',

  // Border Colors
  border: '#E5E7EB',
  borderFocus: '#4A90E2',
  borderError: '#FF6B6B',
  borderSuccess: '#4ECDC4',
  borderDisabled: '#9CA3AF',

  // Transparent
  transparent: 'transparent',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
} as const;

export type ColorKey = keyof typeof colors;

