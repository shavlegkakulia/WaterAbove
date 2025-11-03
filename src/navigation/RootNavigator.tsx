import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  VerificationScreen,
  LoginScreen,
  EmailCodeScreen,
  EmailVerifiedSuccessScreen,
  PasswordSetupScreen,
  PersonalizationScreen,
  WelcomeScreen,
} from '@/screens/Auth';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: 'transparent'},
        }}>
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="EmailCode" component={EmailCodeScreen} />
        <Stack.Screen name="EmailVerifiedSuccess" component={EmailVerifiedSuccessScreen} />
        <Stack.Screen name="PasswordSetup" component={PasswordSetupScreen} />
        <Stack.Screen name="Personalization" component={PersonalizationScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

