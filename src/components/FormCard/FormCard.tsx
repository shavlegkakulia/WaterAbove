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
}

export const FormCard: React.FC<FormCardProps> = ({ children, style }) => {
  return (
    <BlurView
      blurType="dark"
      blurAmount={8}
      style={[styles.card, style]}
    >
      <Pressable onPress={() => Keyboard.dismiss()}>
        <View style={styles.cardContent}>{children}</View>
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
    paddingHorizontal: moderateScale(spacing.xl),
  },
});
