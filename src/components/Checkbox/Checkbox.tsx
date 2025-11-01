import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors, spacing, borderRadius, TypographyKey} from '@/theme';
import {Text} from '@/components/Typography';
import { moderateScale } from '@/utils';

export interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
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
  containerStyle,
  checkboxStyle,
  labelStyle,
  variant = 'caption12Regular', // default variant  
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}>
      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
          disabled && styles.disabled,
          checkboxStyle,
        ]}>
        {checked && <View style={styles.checkmark} />}
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
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.transparent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(spacing.sm),
  },
  checkboxChecked: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  checkmark: {
    width: 10,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.accent,
    transform: [{rotate: '-45deg'}],
    marginTop: -1,
  },
  label: {
    flex: 1,
    marginTop: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});

