import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { moderateScale } from '@/utils';

interface ProfileCompletedIconProps {
  size?: number;
}

export const ProfileCompletedIcon: React.FC<ProfileCompletedIconProps> = ({ size = 120 }) => {
  const scaledSize = moderateScale(size);
  const strokeWidth = 8;

  return (
    <Svg width={scaledSize} height={scaledSize} viewBox="0 0 120 120" fill="none">
      <Path
        d="M109.005 50C111.288 61.2065 109.661 72.8571 104.394 83.009C99.1274 93.1608 90.5395 101.2 80.0626 105.787C69.5857 110.373 57.8531 111.229 46.8215 108.212C35.7899 105.195 26.126 98.487 19.4414 89.2071C12.7568 79.9272 9.45562 68.6362 10.0883 57.2169C10.721 45.7977 15.2494 34.9405 22.9183 26.4559C30.5871 17.9713 40.9329 12.3722 52.2303 10.5923C63.5278 8.81239 75.0939 10.9593 85 16.675"
        stroke="white"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M45 55L60 70L110 20"
        stroke="#47ECC3"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};


