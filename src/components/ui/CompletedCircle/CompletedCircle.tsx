import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { moderateScale } from '@/utils';

export interface CompletedCircleProps {
  /** Width of the circle */
  width?: number;
  /** Height of the circle */
  height?: number;
  /** Border color of the circle */
  borderColor?: string;
  /** Border width of the circle */
  borderWidth?: number;
  /** Icon stroke width */
  strokeWidth?: number;
  /** Icon stroke color */
  strokeColor?: string;
  /** Icon size (defaults to width/2.5) */
  iconSize?: number;
  /** Custom style for the container */
  containerStyle?: ViewStyle;
}

export const CompletedCircle: React.FC<CompletedCircleProps> = ({
  width = 50,
  height = 50,
  borderColor = '#46C2A3',
  borderWidth = 2,
  strokeWidth = 3,
  strokeColor = '#46C2A3',
  iconSize,
  containerStyle,
}) => {
  const defaultIconSize = iconSize ?? width / 2.5;
  const borderRadius = Math.min(width, height) / 2;

  return (
    <View
      style={[
        styles.container,
        {
          width: moderateScale(width),
          height: moderateScale(height),
          borderRadius: moderateScale(borderRadius),
          borderWidth: moderateScale(borderWidth),
          borderColor,
          backgroundColor: 'transparent',
        },
        containerStyle,
      ]}
    >
      <Icon
        name="Check"
        size={moderateScale(defaultIconSize)}
        color={strokeColor}
        strokeWidth={strokeWidth}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CompletedCircle;

