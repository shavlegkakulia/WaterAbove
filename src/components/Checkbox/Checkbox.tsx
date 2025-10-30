import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors, spacing, borderRadius} from '@/theme';
import {Text} from '@/components/Typography';

export interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  checkboxStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  label,
  disabled = false,
  containerStyle,
  checkboxStyle,
  labelStyle,
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
          variant="paragraphSmallDefault"
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
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.transparent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  checkmark: {
    width: 14,
    height: 10,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: colors.accent,
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

