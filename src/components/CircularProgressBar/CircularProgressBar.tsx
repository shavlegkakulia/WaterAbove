import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Text } from '@/components/Typography';
import { moderateScale } from '@/utils';

export interface CircularProgressBarProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  filledColor?: string;
  unfilledColor?: string;
  textColor?: string;
  showText?: boolean;
  textStyle?: ViewStyle;
  containerStyle?: ViewStyle;
}

export const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  progress,
  size = 40,
  strokeWidth = 4,
  filledColor = '#46C2A3',
  unfilledColor = '#767577',
  textColor = '#46C2A3',
  showText = true,
  textStyle,
  containerStyle,
}) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  // Calculate SVG dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Start from bottom (6 o'clock) and go clockwise
  // SVG Circle default starts at 3 o'clock (0 degrees) and draws counter-clockwise
  // To start at 6 o'clock (bottom), we rotate -90 degrees
  // strokeDashoffset: circumference = nothing visible (0%), 0 = full circle visible (100%)
  // For clockwise from bottom, we calculate: offset = circumference * (1 - progress/100)
  const strokeDashoffset = circumference * (1 - clampedProgress / 100);
  
  // Center of the circle
  const center = size / 2;

  return (
    <View style={[styles.container, containerStyle]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle (unfilled) */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={unfilledColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle (filled) */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={filledColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(90 ${center} ${center})`}
        />
      </Svg>
      {showText && (
        <Text
          variant="body16Regular"
          color="textPrimary"
          style={[
            styles.text,
            { 
              color: textColor,
            },
            textStyle,
          ]}
        >
          {Math.round(clampedProgress)}% Complete
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  text: {
    marginLeft: 6,

    fontSize: moderateScale(10.159),
    fontWeight: '400',
    lineHeight: moderateScale(12.32),
  },
});

export default CircularProgressBar;

