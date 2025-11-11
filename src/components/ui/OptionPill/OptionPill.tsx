import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

import { Text, type TextProps } from '@/components/ui/Typography';
import { colors, spacing } from '@/theme';
import { moderateScale } from '@/utils';

export interface OptionPillProps {
  label: string;
  onPress: () => void;
  emoji?: string;
  selected?: boolean;
  disabled?: boolean;
  labelVariant?: TextProps['variant'];
  emojiVariant?: TextProps['variant'];
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  emojiStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export const OptionPill: React.FC<OptionPillProps> = ({
  label,
  onPress,
  emoji,
  selected = false,
  disabled = false,
  labelVariant = 'body16Regular',
  emojiVariant = 'body16Regular',
  style,
  labelStyle,
  emojiStyle,
  testID,
}) => {
  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    selected && styles.containerSelected,
    disabled && styles.containerDisabled,
    style,
  ];

  const textStyle: StyleProp<TextStyle> = [
    styles.label,
    selected && styles.labelSelected,
    disabled && styles.labelDisabled,
    labelStyle,
  ];

  const emojiTextStyle: StyleProp<TextStyle> = [
    styles.emoji,
    emojiStyle,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={containerStyle}
      testID={testID}
    >
      {emoji ? (
        <Text variant={emojiVariant} style={emojiTextStyle}>
          {emoji}
        </Text>
      ) : null}
      <Text variant={labelVariant} style={textStyle}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(spacing.sm),
    paddingHorizontal: moderateScale(spacing.md),
    borderRadius: moderateScale(30),
    borderWidth: 1,
    borderColor: '#5883EA',
    backgroundColor: 'transparent',
    marginRight: moderateScale(spacing.sm),
    minHeight: moderateScale(40),
  },
  containerSelected: {
    borderColor: '#47ECC3',
    backgroundColor: '#C7DBD6',
  },
  containerDisabled: {
    opacity: 0.5,
  },
  label: {
    color: colors.textWhiteWA,
  },
  labelSelected: {
    color: colors.black,
  },
  labelDisabled: {
    color: '#9FA9C5',
  },
  emoji: {
    marginRight: moderateScale(spacing.xs),
  },
});


