import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  width?: number;
  height?: number;
};

export const MailCheckIcon: React.FC<Props> = ({
  width = 80,
  height = 80,
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 80 80"
      fill="none"
    >
      <Path
        d="M73.3337 43.3334V20C73.3337 18.2319 72.6313 16.5362 71.381 15.286C70.1308 14.0358 68.4351 13.3334 66.667 13.3334H13.3337C11.5655 13.3334 9.86986 14.0358 8.61961 15.286C7.36937 16.5362 6.66699 18.2319 6.66699 20V60C6.66699 63.6667 9.66699 66.6667 13.3337 66.6667H40.0003"
        stroke="#D6E7E3"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M73.3337 23.3334L43.4337 42.3334C42.4046 42.9781 41.2147 43.3201 40.0003 43.3201C38.7859 43.3201 37.5961 42.9781 36.567 42.3334L6.66699 23.3334"
        stroke="#D6E7E3"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M53.333 63.3333L59.9997 70L73.333 56.6666"
        stroke="#46C2A3"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
