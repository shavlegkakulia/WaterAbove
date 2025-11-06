import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {AuthScreenWrapper} from '@/components';
import {colors} from '@/theme';

export const InitializingScreen: React.FC = () => {
  return (
    <AuthScreenWrapper>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InitializingScreen;

