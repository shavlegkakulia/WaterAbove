import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {VerificationScreen} from '@/screens/Auth';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Verification"
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: 'transparent'},
        }}>
        <Stack.Screen name="Verification" component={VerificationScreen} />
        {/* Add more screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

