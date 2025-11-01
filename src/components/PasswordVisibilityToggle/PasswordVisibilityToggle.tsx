import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@/components/Icon';

export interface PasswordVisibilityToggleProps {
  visible: boolean;
  onToggle: () => void;
  iconSize?: number;
  iconColor?: string;
}

export const PasswordVisibilityToggle: React.FC<PasswordVisibilityToggleProps> = ({
  visible,
  onToggle,
  iconSize = 18,
  iconColor = '#ffffff',
}) => {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.container}>
      <Icon name={visible ? 'EyeOff' : 'Eye'} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
});

