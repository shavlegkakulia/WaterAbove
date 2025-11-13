import React from 'react';
import { Keyboard, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { borderRadius, spacing } from '@/theme';
import { getWindowWidth, moderateScale } from '@/utils';
import {
  BottomReflectiveBorderSvg,
  TopReflectiveBorderSvg,
} from '@/components/effects';
import {
  LiquidGlassView,
  isLiquidGlassSupported,
} from '@callstack/liquid-glass';
import LinearGradient from 'react-native-linear-gradient';

export interface FormCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  hasHorizontalPadding?: boolean;
}

const BORDER_RADIUS = moderateScale(borderRadius.xxl);
export const SVG_BORDER_HEIGHT = BORDER_RADIUS;
const BORDER_COLOR = '#7d828a';
const BORDER_WIDTH = getWindowWidth() - 34;

export const FormCard: React.FC<FormCardProps> = ({
  children,
  style,
  hasHorizontalPadding = true,
}) => {
  const cardContentStyle = {
    ...styles.cardContent,
    paddingHorizontal: hasHorizontalPadding ? moderateScale(spacing.xl) : 0,
  };

  if (isLiquidGlassSupported) {
    return (
      <LiquidGlassView
        style={[styles.card]}
        interactive
        effect="clear"
        colorScheme="dark"
      >
        <LinearGradient
          colors={[
            'rgba(0, 0,0, 0.8)',
            'rgba(8, 20,40, 0.9)',
            'rgba(8, 20, 40, 0.8)',
            'rgba(8, 20, 40, 0.8)',
            'rgba(8, 20, 40, 0.8)',
            'rgba(8, 20, 40, 0.4)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <TopReflectiveBorderSvg
            width={BORDER_WIDTH}
            height={SVG_BORDER_HEIGHT}
            radius={BORDER_RADIUS}
            color={BORDER_COLOR}
          />
          <View style={cardContentStyle}>{children}</View>
          <BottomReflectiveBorderSvg
            width={BORDER_WIDTH}
            height={SVG_BORDER_HEIGHT}
            radius={BORDER_RADIUS}
            color={BORDER_COLOR}
          />
        </LinearGradient>
      </LiquidGlassView>
    );
  }

  return (
    <BlurView blurType="light" blurAmount={8} style={[styles.cardBlur, style]}>
      <LinearGradient
        colors={[
          'rgba(0, 0,0, 0.9)',
          'rgba(8, 20,40, 0.9)',
          'rgba(8, 20, 40, 0.8)',
          'rgba(8, 20, 40, 0.8)',
          'rgba(8, 20, 40, 0.7)',
          'rgba(8, 20, 40, 0.4)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <TopReflectiveBorderSvg
          width={BORDER_WIDTH}
          height={SVG_BORDER_HEIGHT}
          radius={BORDER_RADIUS}
          color={BORDER_COLOR}
        />
        <Pressable onPress={() => Keyboard.dismiss()}>
          <View style={cardContentStyle}>{children}</View>
        </Pressable>
        <BottomReflectiveBorderSvg
          width={BORDER_WIDTH}
          height={SVG_BORDER_HEIGHT}
          radius={BORDER_RADIUS}
          color={BORDER_COLOR}
        />
      </LinearGradient>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: moderateScale(borderRadius.xxl),
    overflow: 'hidden',
  },
  cardBlur: {
    width: '100%',
    borderRadius: moderateScale(borderRadius.xxl),
    overflow: 'hidden',
    // backgroundColor: 'rgba(8, 20, 34, 0)',
  },
  cardContent: {
    alignItems: 'center',
  },
});
