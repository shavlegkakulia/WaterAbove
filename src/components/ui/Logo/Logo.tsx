import React from 'react';
import {ViewStyle} from 'react-native';
import AppLogo from '@/assets/svg/applogo.svg';

export interface LogoProps {
  size?: number;
  containerStyle?: ViewStyle;
}

export const Logo: React.FC<LogoProps> = ({size = 80, containerStyle}) => {
  return <AppLogo width={size} height={size} style={containerStyle} />;
};

