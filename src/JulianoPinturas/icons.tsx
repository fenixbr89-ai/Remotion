import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, EASE_OUT } from "./theme";

/** Draw-on progress for line icons. */
const useDraw = (delay = 0, dur = 14) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + dur], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
};

type IconProps = {
  size?: number;
  color?: string;
  accent?: string;
  delay?: number;
  style?: React.CSSProperties;
};

const Svg: React.FC<{
  size: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ size, children, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 300 300"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ overflow: "visible", ...style }}
  >
    {children}
  </svg>
);

const Line: React.FC<{
  d: string;
  p: number;
  color: string;
  w?: number;
}> = ({ d, p, color, w = 14 }) => (
  <path
    d={d}
    stroke={color}
    strokeWidth={w}
    pathLength={1}
    strokeDasharray="1 1"
    strokeDashoffset={1 - p}
  />
);

export const BuildingIcon: React.FC<IconProps> = ({
  size = 300,
  color = C.black,
  accent = C.orange,
  delay = 0,
  style,
}) => {
  const p = useDraw(delay);
  const frame = useCurrentFrame();
  const windows: [number, number][] = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 3; c++) windows.push([95 + c * 42, 70 + r * 45]);
  return (
    <Svg size={size} style={style}>
      <Line d="M70 270 V40 H230 V270" p={p} color={color} />
      <Line d="M30 270 H270" p={p} color={color} />
      {windows.map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={26}
          height={26}
          rx={4}
          fill={accent}
          opacity={interpolate(frame, [delay + 8 + i * 1.5, delay + 11 + i * 1.5], [0, 1], CLAMP)}
        />
      ))}
      <rect x={128} y={235} width={44} height={35} fill={color} opacity={p} />
    </Svg>
  );
};

export const BoltIcon: React.FC<IconProps> = ({
  size = 300,
  accent = C.orange,
  style,
}) => (
  <Svg size={size} style={style}>
    <path
      d="M175 10 L60 170 H140 L115 290 L240 115 H158 Z"
      fill={accent}
      stroke={accent}
      strokeWidth={10}
    />
  </Svg>
);

export const WrenchIcon: React.FC<IconProps> = ({
  size = 300,
  color = C.white,
  style,
}) => (
  <Svg size={size} style={style}>
    <path
      d="M205 30 a60 60 0 0 0 -62 78 L40 211 a28 28 0 0 0 40 40 L183 148 a60 60 0 0 0 78 -62 l-38 38 l-34 -9 l-9 -34 Z"
      fill={color}
    />
  </Svg>
);

export const PipesIcon: React.FC<IconProps> = ({
  size = 300,
  color = C.black,
  accent = C.orange,
  delay = 0,
  style,
}) => {
  const p = useDraw(delay, 18);
  return (
    <Svg size={size} style={style}>
      <Line d="M20 80 H150 Q190 80 190 120 V280" p={p} color={color} w={34} />
      <Line d="M280 200 H190" p={useDraw(delay + 8, 10)} color={color} w={34} />
      <rect x={160} y={160} width={60} height={34} rx={6} fill={accent} opacity={useDraw(delay + 14, 4)} />
      <rect x={120} y={63} width={34} height={34} rx={6} fill={accent} opacity={useDraw(delay + 6, 4)} />
    </Svg>
  );
};

export const TankIcon: React.FC<
  IconProps & { level: number }
> = ({ size = 300, color = C.white, accent = C.orange, level, style }) => (
  <Svg size={size} style={style}>
    <defs>
      <clipPath id="tank-clip">
        <path d="M60 90 H240 L225 260 Q150 280 75 260 Z" />
      </clipPath>
    </defs>
    <g clipPath="url(#tank-clip)">
      <rect
        x={40}
        y={260 - 170 * level}
        width={220}
        height={200}
        fill="#4FB3FF"
        opacity={0.9}
      />
    </g>
    <path d="M60 90 H240 L225 260 Q150 280 75 260 Z" stroke={color} strokeWidth={14} />
    <path d="M45 90 Q150 40 255 90 Z" fill={accent} stroke={accent} strokeWidth={10} />
    <rect x={130} y={42} width={40} height={18} rx={6} fill={accent} />
  </Svg>
);

export const RoofIcon: React.FC<IconProps> = ({
  size = 300,
  color = C.white,
  accent = C.orange,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const rows = 4;
  return (
    <Svg size={size} style={style}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: r + 2 }).map((__, c) => {
          const w = 230 / (rows + 1);
          const x = 150 - ((r + 2) * w) / 2 + c * w;
          const y = 50 + r * 42;
          const t = delay + r * 4 + c * 1.5;
          const o = interpolate(frame, [t, t + 6], [0, 1], { ...CLAMP, easing: EASE_OUT });
          return (
            <rect
              key={`${r}-${c}`}
              x={x + 3}
              y={y - 40 * (1 - o)}
              width={w - 6}
              height={36}
              rx={10}
              fill={(r + c) % 3 === 0 ? C.orangeDeep : accent}
              opacity={o}
            />
          );
        }),
      )}
      <Line d="M40 250 V225 H260 V250" p={useDraw(delay, 10)} color={color} />
    </Svg>
  );
};

export const GutterIcon: React.FC<IconProps> = ({
  size = 300,
  color = C.black,
  accent = C.orange,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = useDraw(delay, 12);
  return (
    <Svg size={size} style={style}>
      <path d="M10 40 L150 10 L290 40" stroke={accent} strokeWidth={26} opacity={p} />
      <Line d="M20 75 Q20 105 50 105 H240 Q262 105 262 125 V290" p={p} color={color} w={26} />
      {[0, 1, 2, 3].map((i) => {
        const f = (frame - delay - 10 + i * 9) % 36;
        return f > 0 ? (
          <ellipse
            key={i}
            cx={262}
            cy={290 + f * 4}
            rx={9}
            ry={14}
            fill="#4FB3FF"
            opacity={interpolate(f, [0, 30, 36], [1, 1, 0], CLAMP)}
          />
        ) : null;
      })}
    </Svg>
  );
};

export const MagnifierIcon: React.FC<IconProps> = ({
  size = 300,
  color = C.white,
  style,
}) => (
  <Svg size={size} style={style}>
    <circle cx={120} cy={120} r={80} stroke={color} strokeWidth={22} />
    <path d="M180 180 L270 270" stroke={color} strokeWidth={34} />
  </Svg>
);

export const TvIcon: React.FC<IconProps & { on: number }> = ({
  size = 300,
  color = C.white,
  accent = C.orange,
  on,
  style,
}) => (
  <Svg size={size} style={style}>
    <rect x={20} y={50} width={260} height={160} rx={14} fill={C.ink} stroke={color} strokeWidth={12} />
    <rect x={34} y={64} width={232} height={132} rx={6} fill={accent} opacity={on} />
    <path d="M135 105 L175 130 L135 155 Z" fill={C.white} opacity={on} />
    <path d="M110 240 H190" stroke={color} strokeWidth={12} />
    <path d="M150 210 V240" stroke={color} strokeWidth={12} />
  </Svg>
);

export const GrassIcon: React.FC<IconProps & { cut: number }> = ({
  size = 300,
  color = "#3DBE5A",
  cut,
  style,
}) => (
  <Svg size={size} style={style}>
    {Array.from({ length: 9 }).map((_, i) => {
      const x = 40 + i * 28;
      const h = (140 + ((i * 37) % 60)) * (1 - 0.75 * cut);
      return (
        <path
          key={i}
          d={`M${x} 270 Q${x + (i % 2 ? 14 : -14)} ${270 - h / 2} ${x + (i % 2 ? 6 : -6)} ${270 - h}`}
          stroke={color}
          strokeWidth={14}
        />
      );
    })}
    <path d="M20 272 H280" stroke={C.white} strokeWidth={12} />
  </Svg>
);

export const LotIcon: React.FC<IconProps> = ({
  size = 300,
  color = C.black,
  accent = C.orange,
  delay = 0,
  style,
}) => {
  const p = useDraw(delay, 16);
  const ck = useDraw(delay + 14, 8);
  return (
    <Svg size={size} style={style}>
      <Line d="M40 100 L150 50 L260 100 L150 150 Z" p={p} color={color} />
      <Line d="M40 100 V190 L150 240 L260 190 V100" p={p} color={color} />
      {[60, 95, 130, 170, 205, 240].map((x, i) => (
        <Line key={i} d={`M${x} ${x < 150 ? 120 + (x - 40) * 0.45 : 120 + (260 - x) * 0.45} v-30`} p={p} color={color} w={10} />
      ))}
      <circle cx={225} cy={225} r={50} fill={accent} opacity={ck} />
      <Line d="M202 225 L218 241 L248 210" p={ck} color={C.white} w={12} />
    </Svg>
  );
};

export const PlantIcon: React.FC<IconProps & { grow: number }> = ({
  size = 300,
  accent = C.orange,
  grow,
  style,
}) => (
  <Svg size={size} style={style}>
    <path d="M95 210 H205 L190 285 H110 Z" fill={accent} />
    <g style={{ transformOrigin: "150px 210px", scale: String(grow) }}>
      <path d="M150 210 V90" stroke="#2FA84F" strokeWidth={12} />
      <path d="M150 150 Q90 150 80 95 Q140 95 150 150 Z" fill="#3DBE5A" />
      <path d="M150 125 Q210 125 222 70 Q160 70 150 125 Z" fill="#3DBE5A" />
      <path d="M150 95 Q120 60 150 25 Q180 60 150 95 Z" fill="#55D46F" />
    </g>
  </Svg>
);

export const PlugIcon: React.FC<IconProps> = ({
  size = 300,
  color = C.white,
  accent = C.orange,
  style,
}) => (
  <Svg size={size} style={style}>
    <rect x={95} y={90} width={110} height={110} rx={22} fill={accent} />
    <path d="M125 90 V40 M175 90 V40" stroke={color} strokeWidth={16} />
    <path d="M150 200 V280" stroke={color} strokeWidth={16} />
  </Svg>
);

export const SprayIcon: React.FC<IconProps> = ({
  size = 300,
  color = C.white,
  accent = C.orange,
  style,
}) => (
  <Svg size={size} style={style}>
    <path d="M150 20 h50 l-10 80 h-30 Z" fill={accent} />
    <rect x={90} y={100} width={150} height={48} rx={14} fill={accent} />
    <path d="M90 124 H40" stroke={color} strokeWidth={16} />
    <path d="M190 148 L210 260 H170 L160 148" fill={accent} />
    <path d="M150 150 Q140 190 160 200" stroke={color} strokeWidth={10} />
  </Svg>
);

export const CheckIcon: React.FC<IconProps> = ({
  size = 140,
  color = C.white,
  accent = C.orange,
  delay = 0,
  style,
}) => {
  const p = useDraw(delay, 10);
  return (
    <Svg size={size} style={style}>
      <circle cx={150} cy={150} r={140} fill={accent} style={{ transformOrigin: "150px 150px", scale: String(0.6 + 0.4 * p) }} />
      <Line d="M90 155 L135 200 L215 105" p={useDraw(delay + 4, 8)} color={color} w={28} />
    </Svg>
  );
};

export const SidewalkIcon: React.FC<IconProps> = ({
  size = 300,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <Svg size={size} style={style}>
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 4 }).map((__, c) => {
          const t = delay + (r + c) * 2;
          const o = interpolate(frame, [t, t + 6], [0, 1], { ...CLAMP, easing: EASE_OUT });
          return (
            <rect
              key={`${r}${c}`}
              x={20 + c * 66 + (r % 2) * 20}
              y={30 + r * 66 - 30 * (1 - o)}
              width={58}
              height={58}
              rx={8}
              fill={(r + c) % 2 ? "#BDBDBD" : "#9E9E9E"}
              opacity={o}
            />
          );
        }),
      )}
    </Svg>
  );
};
