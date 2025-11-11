import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { colors } from '@/theme';

export interface DividerProps {
  style?: ViewStyle;
  color?: string;
  opacity?: number;
  height?: number;
  marginBottom?: number;
}

export const Divider: React.FC<DividerProps> = ({
  style,
  color = colors.white,
  opacity = 0.3,
  height = 1,
}) => {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color,
          opacity,
          height,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});

