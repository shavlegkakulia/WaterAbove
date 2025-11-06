import React from 'react';
import {StyleSheet, View} from 'react-native';
import {AuthScreenWrapper, Logo} from '@/components';

export const InitializingScreen: React.FC = () => {
  return (
    <AuthScreenWrapper withKeyboardAvoiding={false} withScrollView={false}>
      <View style={styles.container}>
        <Logo size={120} />
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

