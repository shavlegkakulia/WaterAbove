import { Dimensions, Platform } from 'react-native';

type DimensionType = {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
};

const getWindow = (): DimensionType => Dimensions.get('window');
const getScreen = (): DimensionType => Dimensions.get('screen');

export const getWindowWidth = (): number => getWindow().width;
export const getWindowHeight = (): number => getWindow().height;
export const getScreenWidth = (): number => getScreen().width;
export const getScreenHeight = (): number => getScreen().height;

export const platformOS = Platform.OS;
export const platformVersion = Platform.Version;
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const selectPlatform = <T,>(
  options: Parameters<typeof Platform.select<T>>[0],
): T | undefined => Platform.select(options);

