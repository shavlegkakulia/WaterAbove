import React from 'react';
import { Keyboard, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { borderRadius, spacing } from '@/theme';
import { getWindowWidth, isIOS, moderateScale } from '@/utils';
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
  const supportsBlurView = isIOS;
  const cardContentStyle = {
    ...styles.cardContent,
    paddingHorizontal: hasHorizontalPadding ? moderateScale(spacing.xl) : 0,
  };

  const renderCardBody = () => (
    <>
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
    </>
  );

  const renderGradient = () => (
    <LinearGradient
      colors={[
        'rgba(0, 0, 0, 0.9)',
        'rgba(8, 20, 40, 0.9)',
        'rgba(8, 20, 40, 0.8)',
        'rgba(8, 20, 40, 0.8)',
        'rgba(8, 20, 40, 0.7)',
        'rgba(8, 20, 40, 0.4)',
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {renderCardBody()}
    </LinearGradient>
  );

  if (isLiquidGlassSupported) {
    return (
      <LiquidGlassView
        style={[styles.card, style]}
        interactive
        effect="clear"
        colorScheme="dark"
      >
        {renderGradient()}
      </LiquidGlassView>
    );
  }

  if (supportsBlurView) {
    return (
      <BlurView
        blurType="light"
        blurAmount={8}
        style={[styles.cardBlur, style]}
      >
        {renderGradient()}
      </BlurView>
    );
  }

  // Android fallback: BlurView causes runtime issues on some devices.
  return <View style={[styles.cardFallback, style]}>{renderGradient()}</View>;
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
  },
  cardFallback: {
    width: '100%',
    borderRadius: moderateScale(borderRadius.xxl),
    overflow: 'hidden',
  },
  cardContent: {
    alignItems: 'center',
  },
});
