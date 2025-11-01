import { moderateScale } from '@/utils';
import {TextStyle, Platform} from 'react-native';
import { fontSize, lineHeight } from './spacing';

// Helvetica font family for cross-platform
const helveticaFontFamily = Platform.select({
  ios: 'Helvetica',
  android: 'sans-serif', // Helvetica is not available on Android, using sans-serif as fallback
  default: 'sans-serif',
});

/**
 * Typography system organized by font size + line height combinations
 * Font weights are specified in the variant name: Regular (400), Medium (500), Semibold (600), Bold (700)
 */
export const typography = {
  // 32px / 40 lineHeight
  heading32Bold: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.xxxxl), // 32px
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.heading1), // 40
    letterSpacing: -0.5,
  },

  // 28px / 34 lineHeight
  heading28Bold: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.xxxl), // 28px
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.heading2Large), // 34
    letterSpacing: 0,
  },

  // 24px / 32 lineHeight
  heading24Bold: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.xxl), // 24px
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.xxxxl), // 32
    letterSpacing: -0.25,
  },

  // 20px / 28 lineHeight
  heading20Semibold: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.xl), // 20px
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.xxxl), // 28
    letterSpacing: 0,
  },

  // 20px / 24.255 lineHeight
  heading20Bold: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.xl), // 20px
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.heading3Bold), // 24.255
    letterSpacing: 0,
  },

  // 18px / 26 lineHeight
  paragraph18Regular: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.lg), // 18px
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.paragraphLarge), // 26
    letterSpacing: 0,
  },
  paragraph18Bold: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.lg), // 18px
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.paragraphLarge), // 26
    letterSpacing: 0,
  },

  // 16px / 24 lineHeight
  body16Regular: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.md), // 16px
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.xxl), // 24
    letterSpacing: 0,
  },
  button16Semibold: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.md), // 16px
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.xxl), // 24
    letterSpacing: 0.5,
  },

  // 16px / 20 lineHeight
  body16Bold: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.md), // 16px
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.xl), // 20
    letterSpacing: 0,
  },

  // 16px / 18 lineHeight
  body16Semibold: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.md), // 16px
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.lg), // 18
    letterSpacing: 0,
  },

  // 14px / 20 lineHeight
  paragraph14Regular: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.sm), // 14px
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.xl), // 20
    letterSpacing: 0,
  },
  paragraph14Bold: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.sm), // 14px
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.xl), // 20
    letterSpacing: 0,
  },
  label14Medium: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.sm), // 14px
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.xl), // 20
    letterSpacing: 0,
  },
  button14Semibold: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.sm), // 14px
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.xl), // 20
    letterSpacing: 0.5,
  },

  // 12px / 16 lineHeight
  caption12Regular: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.xs), // 12px
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.md), // 16
    letterSpacing: 0.4,
  },
  caption12Bold: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.xs), // 12px
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.md), // 16
    letterSpacing: 0.4,
  },

  // Legacy aliases for backward compatibility
  heading1: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.xxxxl),
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.heading1),
    letterSpacing: -0.5,
  },
  heading2: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.xxl),
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.xxxxl), // 32
    letterSpacing: -0.25,
  },
  heading2Large: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.xxxl),
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.heading2Large),
    letterSpacing: 0,
  },
  heading3: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.xl),
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.xxxl), // 28
    letterSpacing: 0,
  },
  heading3Bold: {
    fontFamily: helveticaFontFamily,
    fontSize: moderateScale(fontSize.xl),
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: moderateScale(lineHeight.heading3Bold),
    letterSpacing: 0,
  },
} as const;

export type TypographyKey = keyof typeof typography;
