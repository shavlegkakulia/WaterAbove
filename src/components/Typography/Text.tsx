import React from 'react';
import {Text as RNText, TextProps as RNTextProps} from 'react-native';
import {colors, typography, type TypographyKey} from '@/theme';

export interface TextProps extends RNTextProps {
  variant?: TypographyKey;
  color?: keyof typeof colors;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body16Regular',
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

// Pre-styled variants for convenience - using new naming convention
export const Heading32Bold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="heading32Bold" {...props} />
);

export const Heading28Bold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="heading28Bold" {...props} />
);

export const Heading24Bold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="heading24Bold" {...props} />
);

export const Heading20Semibold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="heading20Semibold" {...props} />
);

export const Heading20Bold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="heading20Bold" {...props} />
);

export const Paragraph18Regular: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="paragraph18Regular" {...props} />
);

export const Paragraph18Bold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="paragraph18Bold" {...props} />
);

export const Body16Regular: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body16Regular" {...props} />
);

export const Body16Bold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body16Bold" {...props} />
);

export const Body16Semibold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body16Semibold" {...props} />
);

export const Paragraph14Regular: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="paragraph14Regular" {...props} />
);

export const Paragraph14Bold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="paragraph14Bold" {...props} />
);

export const Label14Medium: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="label14Medium" {...props} />
);

export const Button16Semibold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="button16Semibold" {...props} />
);

export const Button14Semibold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="button14Semibold" {...props} />
);

export const Caption12Regular: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption12Regular" {...props} />
);

export const Caption12Bold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption12Bold" {...props} />
);

// Legacy helper components for backward compatibility
export const Heading1: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="heading1" {...props} />
);

export const Heading2: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="heading2" {...props} />
);

export const Heading3: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="heading3" {...props} />
);

export const Body: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body16Regular" {...props} />
);

export const BodyBold: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body16Bold" {...props} />
);

export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption12Regular" {...props} />
);

export const Label: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="label14Medium" {...props} />
);

