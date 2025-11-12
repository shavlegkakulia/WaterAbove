import React from 'react';
import { Keyboard, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { borderRadius, spacing } from '@/theme';
import { getWindowWidth, moderateScale } from '@/utils';
import { BottomReflectiveBorderSvg, TopReflectiveBorderSvg } from '@/components/effects';

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

  return (
    <BlurView blurType="dark" blurAmount={8} style={[styles.card, style]}>
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
    </BlurView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: moderateScale(borderRadius.xxl),
    overflow: 'hidden',
  },
  cardContent: {
    alignItems: 'center',
  },
});
