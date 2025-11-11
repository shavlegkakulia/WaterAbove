import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import { Text } from '@/components';
import { colors } from '@/theme';

interface SkipButtonProps {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  variant?: 'default' | 'secondary';
}

export const SkipButton: React.FC<SkipButtonProps> = ({
  label = 'Skip for now',
  onPress,
  disabled = false,
  style,
  variant = 'default',
}) => {
  const textVariant =
    variant === 'secondary' ? 'body16Regular' : 'button14Semibold';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.container, variant === 'secondary' && styles.secondary, style]}
    >
      <Text variant={textVariant} style={styles.text} color="textWhiteWA">
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  secondary: {
    marginBottom: 12,
  },
  text: {
    color: colors.textWhiteWA,
  },
});


