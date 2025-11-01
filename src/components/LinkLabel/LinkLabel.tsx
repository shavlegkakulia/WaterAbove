import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { Text } from '@/components/Typography';
import { ColorKey, TypographyKey } from '@/theme';
export interface LinkLabelProps extends TouchableOpacityProps {
  color?: ColorKey;
  children: React.ReactNode;
  underline?: boolean;
  textStyle?: TextStyle;
  textVariant?: TypographyKey;
}

export const LinkLabel: React.FC<LinkLabelProps> = ({
  color = 'textWhiteWA',
  children,
  style,
  underline,
  textStyle,
  textVariant = 'caption12Regular',
  ...rest
}) => {

  return (
    <TouchableOpacity style={[styles.container, style]} {...rest}>
      <Text
        variant={textVariant}
        color={color}
        style={[
          styles.text,
          underline && styles.underline,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
  },
  text: {
    textTransform: 'capitalize',
  },
  textPrimary: {
    color: '#FFF',
  },
  underline: {
    textDecorationLine: 'underline',
  },
});
