import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Mask,
  Rect,
  G,
  Filter,
  FeGaussianBlur,
} from 'react-native-svg';

type SvgProps = {
  width: number;
  height?: number;
  radius?: number;
  color?: string;
};

export function TopReflectiveBorderSvg({
  width,
  height = 20,
  radius = 36,
  color = '#7d828a',
}: SvgProps) {
  const r = radius;
  const glowStripH = Math.max(34, Math.floor(r * 1.4));
  const cornerTail = Math.min(Math.floor(r * 0.95), 32);
  const svgHeight = Math.max(height, r + cornerTail);

  const d = `
      M 0,${r + cornerTail}
      V ${r}
      A ${r} ${r} 0 0 1 ${r},0
      H ${width - r}
      A ${r} ${r} 0 0 1 ${width},${r}
      V ${r + cornerTail}
    `;

  return (
    <Svg width={width} height={svgHeight}>
      <Defs>
        <LinearGradient id="fadeX" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#fff" stopOpacity="0" />
          <Stop offset="0.12" stopColor="#fff" stopOpacity="0.7" />
          <Stop offset="0.24" stopColor="#fff" stopOpacity="1" />
          <Stop offset="0.76" stopColor="#fff" stopOpacity="1" />
          <Stop offset="0.88" stopColor="#fff" stopOpacity="0.7" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </LinearGradient>
        <Mask id="topStrip" maskUnits="userSpaceOnUse">
          <G>
            <Rect
              x="0"
              y="0"
              width={width}
              height={glowStripH}
              fill="url(#fadeX)"
            />
          </G>
        </Mask>
        <LinearGradient
          id="glow"
          x1="0"
          y1="0"
          x2={width}
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor={color} stopOpacity="0.15" />
          <Stop
            offset={Math.min(0.18, r / width)}
            stopColor={color}
            stopOpacity="1"
          />
          <Stop offset="0.5" stopColor={color} stopOpacity="0.25" />
          <Stop
            offset={Math.max(0.82, (width - r) / width)}
            stopColor={color}
            stopOpacity="1"
          />
          <Stop offset="1" stopColor={color} stopOpacity="0.15" />
        </LinearGradient>
        <LinearGradient id="rimLight" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#ffffff" stopOpacity="0.25" />
          <Stop offset="0.5" stopColor="#ffffff" stopOpacity="0.7" />
          <Stop offset="1" stopColor="#ffffff" stopOpacity="0.25" />
        </LinearGradient>
        <Filter
          id="outerGlow"
          x="-40%"
          y="-200%"
          width="180%"
          height="400%"
          filterUnits="objectBoundingBox"
        >
          <FeGaussianBlur stdDeviation={8} />
        </Filter>
      </Defs>

      <G mask="url(#topStrip)">
        <Path
          d={d}
          stroke="url(#glow)"
          strokeWidth={6}
          strokeOpacity={0.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#outerGlow)"
        />
        <Path
          d={d}
          stroke="url(#glow)"
          strokeWidth={3.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Path
          d={d}
          stroke="url(#rimLight)"
          strokeWidth={2}
          strokeOpacity={0.85}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Path
          d={d}
          stroke={color}
          strokeWidth={3}
          strokeOpacity={0.92}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>
    </Svg>
  );
}
