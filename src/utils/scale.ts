import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const guidelineBaseWidth = 430;

export const scale = (size: number) => (width / guidelineBaseWidth) * size;

export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;


