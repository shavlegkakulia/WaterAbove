import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  ColorValue,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { colors } from '@/theme';

export interface SwitchProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void | Promise<void>;
  disabled?: boolean;
  thumbColor?: ColorValue;
  trackColor?: {
    false?: ColorValue;
    true?: ColorValue;
  };
  testID?: string;
  style?: ViewStyle;
}

const DEFAULT_TRACK_COLORS = {
  false: 'rgba(83, 87, 100, 0.65)',
  true: colors.success,
} as const;

export const Switch: React.FC<SwitchProps> = ({
  value = false,
  onValueChange,
  disabled = false,
  thumbColor = colors.white,
  trackColor = DEFAULT_TRACK_COLORS,
  testID,
  style,
}) => {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [animation, value]);

  const translateX = useMemo(
    () =>
      animation.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 22],
      }),
    [animation],
  );

  const backgroundColor = value
    ? trackColor.true ?? DEFAULT_TRACK_COLORS.true
    : trackColor.false ?? DEFAULT_TRACK_COLORS.false;

  const handlePress = () => {
    if (disabled) {
      return;
    }
    onValueChange?.(!value);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={[styles.switchContainer, style, { backgroundColor }]}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.thumb,
          disabled && styles.thumbDisabled,
          {
            backgroundColor: thumbColor,
            transform: [{ translateX }],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    position: 'relative',
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  thumbDisabled: {
    opacity: 0.6,
  },
});


