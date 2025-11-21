import React from 'react';
import { StyleSheet } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { moderateScale } from '@/utils';
import { UniversityActivityPanel } from '@/components';

export const DrawerContent: React.FC<DrawerContentComponentProps> = props => {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
      style={styles.drawer}
    >
      <UniversityActivityPanel navigation={props.navigation} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: '#1F252F',
    borderRadius: moderateScale(36),
  },
});
