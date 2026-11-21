import type { FC } from "react";

const Svg: FC<{ children: React.ReactNode; sw?: number; color?: string }> = ({ children, sw = 2.4, color = "currentColor" }) => (
  <svg
    viewBox="0 0 24 24"
    width="100%"
    height="100%"
    fill="none"
    stroke={color}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const Dumbbell: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color} sw={2.6}>
    <path d="M7 7.5v9 M17 7.5v9 M3.5 10v4 M20.5 10v4 M7 12h10" />
  </Svg>
);
export const Flag: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color}>
    <path d="M6.5 21V4 M6.5 4.5h10.5l-3.2 4 3.2 4H6.5" />
  </Svg>
);
export const ArrowUp: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color}>
    <path d="M12 20V5 M5.5 11.5 12 5l6.5 6.5" />
  </Svg>
);
export const Stopwatch: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color} sw={2.6}>
    <circle cx={12} cy={14} r={6} />
    <path d="M12 14v-3 M10 3.5h4 M12 3.5V8" />
  </Svg>
);
export const RingIcon: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color} sw={2.8}>
    <circle cx={12} cy={13} r={4.2} />
  </Svg>
);
export const Check: FC<{ p?: number }> = ({ p = 1 }) => (
  <Svg color="#0b0b0b" sw={3}>
    <path d="M6.5 12.5l3.8 3.8 7.2-8" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
  </Svg>
);
export const Chevron: FC = () => (
  <Svg color="#111" sw={2.4}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
);
export const Person: FC = () => (
  <Svg color="#5B6B2E" sw={2}>
    <circle cx={12} cy={8.5} r={3.8} />
    <path d="M5 20c1-3.8 3.8-5.6 7-5.6s6 1.8 7 5.6" />
  </Svg>
);
export const WhatsApp: FC = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
    <path
      d="M3.6 20.4l1.3-4A8.6 8.6 0 1 1 8 19.2z"
      stroke="#0b0b0b"
      strokeWidth={2.4}
      strokeLinejoin="round"
    />
    <path
      d="M9.1 7.6c.3-.1.6 0 .7.3l.8 1.8c.1.3 0 .6-.2.8l-.6.6c.6 1.3 1.6 2.3 2.9 2.9l.6-.6c.2-.2.5-.3.8-.2l1.8.8c.3.1.4.4.3.7-.3 1.2-1.3 1.9-2.4 1.7-3-.5-5.4-2.9-5.9-5.9-.2-1.1.5-2.1 1.7-2.4z"
      fill="#0b0b0b"
    />
  </svg>
);

export const Heart: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></Svg>
);
export const Bolt: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color}><path d="M13 3 5 13.5h6L10 21l8-10.5h-6z" /></Svg>
);
export const Flame: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color}><path d="M12 21c-3.5 0-6-2.4-6-5.6 0-3.6 3-5.4 3.6-8.9 2 1.2 3 3 3 4.6 1-.6 1.6-1.8 1.7-3 2 1.6 3.7 4 3.7 7.3 0 3.2-2.5 5.6-6 5.6z" /></Svg>
);
export const PhoneIcon: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color}><rect x={7} y={3} width={10} height={18} rx={2.5} /><path d="M11 17.5h2" /></Svg>
);
export const UserCheck: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color}><circle cx={10} cy={8} r={3.5} /><path d="M3.5 20c.8-3.6 3.4-5.4 6.5-5.4 1.4 0 2.7.4 3.7 1.1 M15.5 18l2 2 4-4.5" /></Svg>
);
export const Target: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color}><circle cx={12} cy={12} r={8} /><circle cx={12} cy={12} r={4.2} /><circle cx={12} cy={12} r={0.8} /></Svg>
);
export const Calendar: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color}><rect x={4} y={5} width={16} height={15} rx={2.5} /><path d="M4 10h16 M8.5 3v4 M15.5 3v4" /></Svg>
);
export const Repeat: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color}><path d="M17 2.5l3 3-3 3 M4 11.5v-1a5 5 0 0 1 5-5h11 M7 21.5l-3-3 3-3 M20 12.5v1a5 5 0 0 1-5 5H4" /></Svg>
);
export const Sprout: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color}><path d="M12 21v-9 M12 12c0-4-3-6-7-6 0 4 3 6 7 6z M12 10c0-3.5 2.6-5.5 6.5-5.5 0 3.6-2.6 5.5-6.5 5.5z" /></Svg>
);
export const TrendUp: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color}><path d="M3 17l6-6 4 4 8-8 M15 7h6v6" /></Svg>
);
export const Message: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color}><path d="M4 5h16v11H9l-5 4z" /></Svg>
);
export const ArrowRight: FC<{ color?: string }> = ({ color }) => (
  <Svg color={color}><path d="M4 12h15 M13 5.5 19.5 12 13 18.5" /></Svg>
);
