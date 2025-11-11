import React from 'react';
import {
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';
import {colors, spacing, shadows, borderRadius} from '@/theme';
import {Text} from '@/components/ui/Typography';
import { moderateScale } from '@/utils';
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
      paddingVertical: moderateScale(spacing.sm),
      paddingHorizontal: moderateScale(spacing.lg),
      borderRadius: moderateScale(borderRadius.xxl),
      minHeight: moderateScale(spacing.xxl),
    };

    // Variant colors
    if (isDisabled) {
      baseStyle.backgroundColor = '#000';
      baseStyle.opacity = 0.5;
    } else if (variant === 'primary') {
      baseStyle.backgroundColor = '#D6E7E3';
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
    if (isDisabled) return '#F1F1F1';
    if (variant === 'primary') return '#171B22';
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
              variant={size === 'small' ? 'button14Semibold' : 'button16Semibold'}
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

