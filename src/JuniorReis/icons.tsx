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
