import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '@/theme';
import {Text} from '@/components/ui/Typography';
import { moderateScale } from '@/utils';

export type InputState = 'default' | 'focused' | 'success' | 'error' | 'disabled';

export interface InputProps extends Omit<TextInputProps, 'editable'> {
  label?: string;
  helpText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  state?: InputState;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  helpText,
  errorMessage,
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
  const inputRef = useRef<TextInput>(null);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleContainerPress = () => {
    if (state !== 'disabled') {
      inputRef.current?.focus();
    }
  };

  const getBorderColor = () => {
    if (state === 'disabled') return '#171B22';
    if (state === 'error') return colors.borderError;
    if (state === 'success') return '#46C2A3'; // Valid and not empty value color
    if (state === 'focused' || isFocused) return colors.borderFocus;
    return '#0369F1';
  };

  const getBackgroundColor = () => {
    if (state === 'disabled') return '#171B22';
    return colors.backgroundInput;
  };

  const getTextColor = () => {
    if (state === 'disabled') return '#F1F1F1';
    return '#F1F1F1';
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="caption12Regular" color="textPrimary" style={styles.label}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={handleContainerPress}
        activeOpacity={1}
        disabled={state === 'disabled'}>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: getBorderColor(),
              backgroundColor: getBackgroundColor(),
            },
          ]}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              {color: getTextColor()},
              style,
            ]}
            placeholderTextColor="#F1F1F1"
            editable={state !== 'disabled'}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      </TouchableOpacity>
      {helpText && (
        <Text
          variant="caption12Regular"
          color='textWhiteWA'
          style={styles.helpText}>
          {helpText}
        </Text>
      )}
      {errorMessage && (
        <Text
          variant="caption12Regular"
          color='textWhiteWA'
          style={styles.helpText}>
          {errorMessage}
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
    marginBottom: moderateScale(spacing.xs),
    fontWeight: 700,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(borderRadius.md),
    borderWidth: 1.2,
    paddingHorizontal: moderateScale(spacing.md),
    paddingVertical: moderateScale(8),
    minHeight: moderateScale(48),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(fontSize.sm),
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: moderateScale(10),
  },
  rightIcon: {
    marginLeft: moderateScale(10),
  },
  helpText: {
    marginTop: moderateScale(spacing.xs),
    marginHorizontal: moderateScale(spacing.md),
  },
  disabled: {
    opacity: 0.5,
  },
});

