import { getWindowWidth } from './device';

const guidelineBaseWidth = 430;
const windowWidth = getWindowWidth();

export const scale = (size: number) => (windowWidth / guidelineBaseWidth) * size;

export const moderateScale = (size: number, factor = 1) =>
  size + (scale(size) - size) * factor;


