import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/theme';
import { moderateScale } from '@/utils';

export interface BackButtonProps {
  onPress?: () => void;
  color?: string;
  containerStyle?: ViewStyle;
  size?: number;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  color = colors.success,
  containerStyle,
  size = 44,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.button, containerStyle]}
      activeOpacity={0.7}
    >
      <View style={[styles.circle, { width: moderateScale(size), height: moderateScale(size), borderRadius: moderateScale(size / 2) }]}>
        <Icon
          name="ChevronLeft"
          size={moderateScale(20)}
          color={color}
          strokeWidth={2}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: moderateScale(18),
  },
  circle: {
    borderWidth: 1,
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

