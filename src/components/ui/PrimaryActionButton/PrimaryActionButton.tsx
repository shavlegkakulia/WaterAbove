import React from 'react';
import {
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  ActivityIndicator,
  ImageBackground,
  View,
} from 'react-native';
import { Text } from '@/components/ui/Typography';
import { Icon, IconName } from '@/components/ui/Icon';
import { colors, spacing } from '@/theme';
import { moderateScale } from '@/utils';
import primaryActionButtonImage from '@/assets/images/primaryActionButton.png';

export interface PrimaryActionButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Button text */
  title?: string;
  /** Icon name to display (left side) */
  icon?: IconName;
  /** Icon name to display (right side) */
  rightIcon?: IconName;
  /** Icon size */
  iconSize?: number;
  /** Icon color */
  iconColor?: string;
  /** Show loading spinner */
  loading?: boolean;
  /** Disable button */
  disabled?: boolean;
  /** Container style */
  radius?: number;
  containerStyle?: ViewStyle;
  /** Text style */
  textStyle?: TextStyle;
  /** Icon container style */
  iconStyle?: ViewStyle;
}

export const PrimaryActionButton: React.FC<PrimaryActionButtonProps> = ({
  title,
  icon,
  rightIcon,
  iconSize = 24,
  iconColor = colors.white,
  loading = false,
  disabled = false,
  radius = 16,
  containerStyle,
  textStyle,
  iconStyle,
  onPress,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const handlePress = (e: any) => {
    if (!isDisabled && onPress) {
      onPress(e);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[styles.button, isDisabled && styles.buttonDisabled, containerStyle]}
      {...rest}
    >
      <ImageBackground
        source={primaryActionButtonImage}
        style={styles.backgroundImage}
        resizeMode="stretch"
        borderRadius={radius}
      >
        {isDisabled && <View style={styles.disabledOverlay} />}
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <>
              {icon && (
                <View style={[styles.iconContainer, iconStyle]}>
                  <Icon
                    name={icon}
                    size={moderateScale(iconSize)}
                    color={iconColor}
                  />
                </View>
              )}
              {title && (
                <Text
                  variant="button16Semibold"
                  color="textWhiteWA"
                  style={[styles.text, textStyle]}
                >
                  {title}
                </Text>
              )}
              {rightIcon && (
                <View style={[styles.iconContainer, iconStyle]}>
                  <Icon
                    name={rightIcon}
                    size={moderateScale(iconSize)}
                    color={iconColor}
                  />
                </View>
              )}
              {!icon && !rightIcon && !title && rest.children}
            </>
          )}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = {
  button: {
    height: moderateScale(44),
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    zIndex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(spacing.sm),
    paddingHorizontal: moderateScale(spacing.md),
    zIndex: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
  },
} as const;

