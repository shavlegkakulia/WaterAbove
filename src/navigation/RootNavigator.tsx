import React from 'react';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  InitializingScreen,
  VerificationScreen,
  LoginScreen,
  EmailCodeScreen,
  EmailVerifiedSuccessScreen,
  PasswordSetupScreen,
  PersonalizationScreen,
  LocationPersonalizationScreen,
  ProfilePersonalizationScreen,
  WelcomeScreen,
  ForgotPasswordScreen,
  CheckInboxScreen,
  SetNewPasswordScreen,
  PasswordUpdatedSuccessScreen,
} from '@/screens/Auth';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Export navigation ref for use in App.tsx
export const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Initializing"
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: 'transparent'},
        }}>
        <Stack.Screen name="Initializing" component={InitializingScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="EmailCode" component={EmailCodeScreen} />
        <Stack.Screen name="EmailVerifiedSuccess" component={EmailVerifiedSuccessScreen} />
        <Stack.Screen name="PasswordSetup" component={PasswordSetupScreen} />
        <Stack.Screen name="Personalization" component={PersonalizationScreen} />
        <Stack.Screen name="LocationPersonalization" component={LocationPersonalizationScreen} />
        <Stack.Screen name="ProfilePersonalization" component={ProfilePersonalizationScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="CheckInbox" component={CheckInboxScreen} />
        <Stack.Screen name="SetNewPassword" component={SetNewPasswordScreen} />
        <Stack.Screen name="PasswordUpdatedSuccess" component={PasswordUpdatedSuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

