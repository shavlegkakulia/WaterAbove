import React from 'react';
import {
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';
import {colors, spacing, borderRadius, shadows} from '@/theme';
import {Text} from '@/components/Typography';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonShape = 'pill' | 'circular';

export interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  leftIcon,
  rightIcon,
  variant = 'primary',
  size = 'medium',
  shape = 'pill',
  loading = false,
  disabled = false,
  containerStyle,
  textStyle,
  onPress,
  style,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: shape === 'circular' ? borderRadius.full : borderRadius.xl,
    };

    // Size
    if (shape === 'circular') {
      const circularSizes = {
        small: {width: 40, height: 40},
        medium: {width: 56, height: 56},
        large: {width: 64, height: 64},
      };
      Object.assign(baseStyle, circularSizes[size]);
    } else {
      const pillSizes = {
        small: {paddingHorizontal: spacing.md, minHeight: 40},
        medium: {paddingHorizontal: spacing.lg, minHeight: 56},
        large: {paddingHorizontal: spacing.xl, minHeight: 64},
      };
      Object.assign(baseStyle, pillSizes[size]);
    }

    // Variant colors
    if (isDisabled) {
      baseStyle.backgroundColor = colors.gray700;
    } else if (variant === 'primary') {
      baseStyle.backgroundColor = colors.white;
    } else if (variant === 'secondary') {
      baseStyle.backgroundColor = colors.primary;
    } else if (variant === 'outline') {
      baseStyle.backgroundColor = colors.transparent;
      baseStyle.borderWidth = 2;
      baseStyle.borderColor = colors.white;
    } else if (variant === 'ghost') {
      baseStyle.backgroundColor = colors.transparent;
    }

    return baseStyle;
  };

  const getTextColor = () => {
    if (isDisabled) return colors.textDisabled;
    if (variant === 'primary') return colors.textDark;
    if (variant === 'secondary') return colors.white;
    return colors.white;
  };

  const handlePress = (e: any) => {
    if (!isDisabled && onPress) {
      onPress(e);
    }
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        !isDisabled && shadows.sm,
        containerStyle,
        style,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          {title && shape !== 'circular' && (
            <Text
              variant={size === 'small' ? 'buttonSmall' : 'button'}
              style={[
                {color: getTextColor()},
                leftIcon ? {marginLeft: spacing.sm} : undefined,
                rightIcon ? {marginRight: spacing.sm} : undefined,
                textStyle,
              ]}>
              {title}
            </Text>
          )}
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

