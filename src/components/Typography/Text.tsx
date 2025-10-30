import React from 'react';
import {Text as RNText, TextProps as RNTextProps} from 'react-native';
import {colors, typography, type TypographyKey} from '@/theme';

export interface TextProps extends RNTextProps {
  variant?: TypographyKey;
  color?: keyof typeof colors;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'textPrimary',
  style,
  children,
  ...rest
}) => {
  return (
    <RNText
      style={[
        typography[variant],
        {color: colors[color]},
        style,
      ]}
      {...rest}>
      {children}
    </RNText>
  );
};

// Pre-styled variants for convenience
export const Heading1: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="heading1" {...props} />
);

export const Heading2: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="heading2" {...props} />
);

export const Heading3: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="heading3" {...props} />
);

export const ParagraphLargeBold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="paragraphLargeBold" {...props} />
);

export const ParagraphLarge: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="paragraphLargeDefault" {...props} />
);

export const ParagraphSmallBold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="paragraphSmallBold" {...props} />
);

export const ParagraphSmall: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="paragraphSmallDefault" {...props} />
);

export const Body: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body" {...props} />
);

export const BodyBold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="bodyBold" {...props} />
);

export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption" {...props} />
);

export const CaptionBold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="captionBold" {...props} />
);

export const Label: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="label" {...props} />
);

