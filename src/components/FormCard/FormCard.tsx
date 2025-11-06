import React from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { borderRadius, spacing } from '@/theme';
import { moderateScale } from '@/utils';

export interface FormCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  hasHorizontalPadding?: boolean;
}

export const FormCard: React.FC<FormCardProps> = ({ children, style, hasHorizontalPadding = true }) => {
  const cardContentStyle = {
    ...styles.cardContent,
    paddingHorizontal: hasHorizontalPadding ? moderateScale(spacing.xl) : 0,
  };

  return (
    <BlurView
      blurType="dark"
      blurAmount={8}
      style={[styles.card, style]}
    >
      <Pressable onPress={() => Keyboard.dismiss()}>
        <View style={cardContentStyle}>
          {children}
        </View>
      </Pressable>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: borderRadius.xxl,
  },
  cardContent: {
    alignItems: 'center',
  },
});
