import {TextStyle} from 'react-native';

export const typography = {
  // Headings
  heading1: {
    fontSize: 32,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heading2: {
    fontSize: 24,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 32,
    letterSpacing: -0.25,
  },
  heading3: {
    fontSize: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 28,
    letterSpacing: 0,
  },

  // Paragraphs
  paragraphLargeBold: {
    fontSize: 18,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 26,
    letterSpacing: 0,
  },
  paragraphLargeDefault: {
    fontSize: 18,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 26,
    letterSpacing: 0,
  },
  paragraphSmallBold: {
    fontSize: 14,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 20,
    letterSpacing: 0,
  },
  paragraphSmallDefault: {
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 20,
    letterSpacing: 0,
  },

  // Body
  body: {
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24,
    letterSpacing: 0,
  },

  // Caption
  caption: {
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  captionBold: {
    fontSize: 12,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 16,
    letterSpacing: 0.4,
  },

  // Button
  button: {
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 20,
    letterSpacing: 0.5,
  },

  // Label
  label: {
    fontSize: 14,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 20,
    letterSpacing: 0,
  },
} as const;

export type TypographyKey = keyof typeof typography;

