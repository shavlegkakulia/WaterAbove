import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { Text } from '@/components/ui/Typography';
import { ColorKey, TypographyKey } from '@/theme';
export interface LinkLabelProps extends TouchableOpacityProps {
  color?: ColorKey;
  children: React.ReactNode;
  underline?: boolean;
  textStyle?: TextStyle;
  textVariant?: TypographyKey;
  disabled?: boolean;
}

export const LinkLabel: React.FC<LinkLabelProps> = ({
  color = 'textWhiteWA',
  children,
  style,
  underline,
  textStyle,
  textVariant = 'caption12Regular',
  disabled = false,
  onPress,
  ...rest
}) => {
  const handlePress = (e: any) => {
    if (!disabled && onPress) {
      onPress(e);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style, disabled && styles.disabled]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
      {...rest}
    >
      <Text
        variant={textVariant}
        color={color}
        style={[
          styles.text,
          underline && styles.underline,
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
  },
  text: {
    textTransform: 'capitalize',
  },
  textPrimary: {
    color: '#FFF',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  disabled: {
    opacity: 0.9,
  },
  disabledText: {
    opacity: 0.9,
  },
});
