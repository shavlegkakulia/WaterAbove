import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Text } from '@/components/ui/Typography';
import { moderateScale } from '@/utils';

export interface CircularProgressBarProps {
  progress: number; // 0-100
  /** Size of the circular progress bar (used for both width and height if width/height not provided) */
  size?: number;
  /** Width of the progress bar (overrides size if provided) */
  width?: number;
  /** Height of the progress bar (overrides size if provided) */
  height?: number;
  /** Width of the stroke */
  strokeWidth?: number;
  /** Color of the filled/progress stroke */
  filledColor?: string;
  /** Gradient colors for the filled/progress stroke. If provided, overrides filledColor */
  gradientColors?: Array<{ color: string; offset: string }>;
  /** Gradient angle in degrees (default: 0 for horizontal) */
  gradientAngle?: number;
  /** Color of the unfilled/background stroke */
  unfilledColor?: string;
  /** Color of the text */
  textColor?: string;
  /** Whether to show text (deprecated, use textPosition instead) */
  showText?: boolean;
  /** Position of the text: 'inside' (centered), 'outside' (next to), or 'none' */
  textPosition?: 'inside' | 'outside' | 'none';
  /** Custom text to display inside (defaults to progress percentage) */
  insideText?: string | React.ReactNode;
  /** Style for the text */
  textStyle?: TextStyle;
  /** Style for the container */
  containerStyle?: ViewStyle;
}

export const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  progress,
  size = 40,
  width,
  height,
  strokeWidth = 4,
  filledColor = '#46C2A3',
  gradientColors,
  gradientAngle = 0,
  unfilledColor = '#767577',
  textColor = '#46C2A3',
  showText,
  textPosition,
  insideText,
  textStyle,
  containerStyle,
}) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  // Determine actual width and height
  const actualWidth = width ?? size;
  const actualHeight = height ?? size;
  
  // Use the smaller dimension for the circle to ensure it fits
  const circleSize = Math.min(actualWidth, actualHeight);
  
  // Calculate SVG dimensions
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Start from bottom (6 o'clock) and go clockwise
  // SVG Circle default starts at 3 o'clock (0 degrees) and draws counter-clockwise
  // To start at 6 o'clock (bottom), we rotate -90 degrees
  // strokeDashoffset: circumference = nothing visible (0%), 0 = full circle visible (100%)
  // For clockwise from bottom, we calculate: offset = circumference * (1 - progress/100)
  const strokeDashoffset = circumference * (1 - clampedProgress / 100);
  
  // Center of the circle
  const center = circleSize / 2;
  
  // Determine text position (backward compatibility with showText)
  const finalTextPosition = textPosition ?? (showText === false ? 'none' : 'outside');
  
  // Default inside text
  const defaultInsideText = `${Math.round(clampedProgress)}%`;
  const displayInsideText = insideText !== undefined ? insideText : defaultInsideText;

  // Calculate gradient coordinates based on angle
  const angleRad = (gradientAngle * Math.PI) / 180;
  const x1 = 0.5 - 0.5 * Math.cos(angleRad);
  const y1 = 0.5 - 0.5 * Math.sin(angleRad);
  const x2 = 0.5 + 0.5 * Math.cos(angleRad);
  const y2 = 0.5 + 0.5 * Math.sin(angleRad);

  // Generate unique gradient ID for this component instance
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
  const useGradient = gradientColors && gradientColors.length > 0;

  return (
    <View style={[styles.container, { width: actualWidth, height: actualHeight }, containerStyle]}>
      <View style={styles.svgContainer}>
        <Svg width={circleSize} height={circleSize} style={styles.svg}>
          <Defs>
            {useGradient && (
              <LinearGradient id={gradientId} x1={x1} y1={y1} x2={x2} y2={y2}>
                {gradientColors.map((stop, index) => (
                  <Stop
                    key={index}
                    offset={stop.offset}
                    stopColor={stop.color}
                  />
                ))}
              </LinearGradient>
            )}
          </Defs>
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
            stroke={useGradient ? `url(#${gradientId})` : filledColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(90 ${center} ${center})`}
          />
        </Svg>
        {/* Inside text (centered) */}
        {finalTextPosition === 'inside' && (
          <View style={styles.insideTextContainer}>
            {typeof displayInsideText === 'string' ? (
              <Text
                variant="body16Regular"
                style={[
                  styles.insideText,
                  { color: textColor },
                  textStyle,
                ]}
              >
                {displayInsideText}
              </Text>
            ) : (
              displayInsideText
            )}
          </View>
        )}
      </View>
      {/* Outside text (next to the circle) */}
      {finalTextPosition === 'outside' && (
        <Text
          variant="body16Regular"
          color="textPrimary"
          style={[
            styles.text,
            { color: textColor },
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
    justifyContent: 'center',
  },
  svgContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  insideTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  insideText: {
    fontSize: moderateScale(10.159),
    fontWeight: '400',
    lineHeight: moderateScale(12.32),
  },
  text: {
    marginLeft: 6,
    fontSize: moderateScale(10.159),
    fontWeight: '400',
    lineHeight: moderateScale(12.32),
  },
});

export default CircularProgressBar;

