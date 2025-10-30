import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '@/theme';
import {Text} from '@/components/Typography';

export interface LogoProps {
  size?: number;
  containerStyle?: ViewStyle;
}

export const Logo: React.FC<LogoProps> = ({size = 80, containerStyle}) => {
  const logoSize = {width: size, height: size, borderRadius: size / 2};
  const innerSize = {
    width: size * 0.85,
    height: size * 0.85,
    borderRadius: (size * 0.85) / 2,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.outerRing, logoSize]}>
        <View style={[styles.innerCircle, innerSize]}>
          <Text
            variant="heading1"
            style={[
              styles.text,
              {
                fontSize: size * 0.35,
                lineHeight: size * 0.4,
              },
            ]}>
            WA
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    borderWidth: 4,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.primary,
    fontWeight: '700',
  },
});

