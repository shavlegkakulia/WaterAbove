import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors, spacing, TypographyKey} from '@/theme';
import {Text} from '@/components/Typography';
import { moderateScale } from '@/utils';

export type CheckboxSize = 14 | 16 | 18 | 20 | 22 | 24;

export interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  size?: CheckboxSize;
  containerStyle?: ViewStyle;
  checkboxStyle?: ViewStyle;
  labelStyle?: TextStyle;
  variant?: TypographyKey;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  label,
  disabled = false,
  size = 14,
  containerStyle,
  checkboxStyle,
  labelStyle,
  variant = 'caption12Regular', // default variant  
}) => {
  const checkboxSize = moderateScale(size);
  const checkmarkSize = moderateScale(size * 0.5); // Checkmark is roughly half the size
  
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}>
      <View
        style={[
          styles.checkbox,
          {
            width: checkboxSize,
            height: checkboxSize,
            borderRadius: moderateScale(4),
            borderWidth: 1,
            borderColor: checked ? '#46C2A3' : '#0369F1',
            backgroundColor: 'transparent',
          },
          disabled && styles.disabled,
          checkboxStyle,
        ]}>
        {checked && <View style={[styles.checkmark, {
          width: checkmarkSize,
          height: checkmarkSize * 0.6,
        }]} />}
      </View>
      {label && (
        <Text
          variant={variant}
          color="textPrimary"
          style={[styles.label, disabled && {color: colors.textDisabled}, labelStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  checkbox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(spacing.sm),
  },
  checkmark: {
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#46C2A3',
    transform: [{rotate: '-45deg'}],
    marginTop: -2,
  },
  label: {
    flex: 1,
    marginTop: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});

