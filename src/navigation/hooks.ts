import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import type { RootStackParamList } from './types';

export const useAppNavigation = <
  T extends keyof RootStackParamList = keyof RootStackParamList,
>() =>
  useNavigation<NativeStackNavigationProp<RootStackParamList, T>>();

export const useAppRoute = <
  T extends keyof RootStackParamList = keyof RootStackParamList,
>() => useRoute<RouteProp<RootStackParamList, T>>();


