import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { moderateScale } from '@/utils';

export const LockIcon: React.FC = () => (
  <View style={styles.iconContainer}>
    <Icon name="Lock" size={moderateScale(18)} color="#ffffff" />
  </View>
);

const ICON_WRAPPER_SIZE = moderateScale(24);

const styles = StyleSheet.create({
  iconContainer: {
    width: ICON_WRAPPER_SIZE,
    height: ICON_WRAPPER_SIZE,
    borderRadius: ICON_WRAPPER_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

