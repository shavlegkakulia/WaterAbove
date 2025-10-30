import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import {colors, spacing, borderRadius} from '@/theme';
import {Text} from '@/components/Typography';

export type InputState = 'default' | 'focused' | 'success' | 'error' | 'disabled';

export interface InputProps extends Omit<TextInputProps, 'editable'> {
  label?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  state?: InputState;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  helpText,
  leftIcon,
  rightIcon,
  state = 'default',
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getBorderColor = () => {
    if (state === 'disabled') return colors.borderDisabled;
    if (state === 'error') return colors.borderError;
    if (state === 'success') return colors.borderSuccess;
    if (state === 'focused' || isFocused) return colors.borderFocus;
    return colors.white;
  };

  const getTextColor = () => {
    if (state === 'disabled') return colors.textDisabled;
    return colors.textPrimary;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="label" color="textPrimary" style={styles.label}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {borderColor: getBorderColor()},
          state === 'disabled' && styles.disabled,
        ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            {color: getTextColor()},
            style,
          ]}
          placeholderTextColor={colors.textSecondary}
          editable={state !== 'disabled'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {helpText && (
        <Text
          variant="caption"
          color={state === 'error' ? 'error' : 'textSecondary'}
          style={styles.helpText}>
          {helpText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    paddingHorizontal: spacing.md,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: spacing.md,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  helpText: {
    marginTop: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});

