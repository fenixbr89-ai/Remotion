import React from "react";

const P: React.FC<{ size: number; color: string; sw?: number; children: React.ReactNode; vb?: string }> = ({
  size,
  color,
  sw = 2.2,
  children,
  vb = "0 0 24 24",
}) => (
  <svg width={size} height={size} viewBox={vb} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

type I = { size?: number; color?: string };

export const Monitor: React.FC<I> = ({ size = 62, color = "#fff" }) => (
  <P size={size} color={color}><rect x="2" y="4" width="20" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></P>
);
export const Calendar: React.FC<I> = ({ size = 62, color = "#fff" }) => (
  <P size={size} color={color}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></P>
);
export const Clock: React.FC<I> = ({ size = 62, color = "#fff" }) => (
  <P size={size} color={color}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2.5M9 2h6" /></P>
);
export const Headphones: React.FC<I> = ({ size = 66, color = "#fff" }) => (
  <P size={size} color={color}><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z" /></P>
);
export const Mic: React.FC<I> = ({ size = 66, color = "#fff" }) => (
  <P size={size} color={color}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" /></P>
);
export const Pen: React.FC<I> = ({ size = 66, color = "#fff" }) => (
  <P size={size} color={color}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></P>
);
export const Shadow: React.FC<I> = ({ size = 140, color = "#fff" }) => (
  <P size={size} color={color} sw={3.4} vb="0 0 64 64"><path d="M14 56V46c-5-4-8-10-8-17C6 17 15 8 27 8s20 8 20 18l5 9h-5v8a5 5 0 0 1-5 5h-6v8" /><path d="M52 20c3 3 3 9 0 12" /><path d="M57 15c6 6 6 16 0 22" /></P>
);
export const Music: React.FC<I> = ({ size = 130, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 48V14l30-6v34" /><circle cx="17" cy="48" r="7" fill={color} /><circle cx="47" cy="42" r="7" fill={color} />
  </svg>
);
export const Sunrise: React.FC<I> = ({ size = 32, color = "#fff" }) => (
  <P size={size} color={color} sw={2.6}><path d="M17 18a5 5 0 0 0-10 0M12 3v6M4.2 10.2l1.4 1.4M1 18h2M21 18h2M18.4 11.6l1.4-1.4" /></P>
);
export const Sun: React.FC<I> = ({ size = 32, color = "#fff" }) => (
  <P size={size} color={color} sw={2.6}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2" /></P>
);
export const Moon: React.FC<I> = ({ size = 30, color = "#fff" }) => (
  <P size={size} color={color} sw={2.6}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></P>
);
export const Arrow: React.FC<I> = ({ size = 80, color = "#fff" }) => (
  <P size={size} color={color} sw={3}><path d="M5 12h14M13 6l6 6-6 6" /></P>
);
export const Insta: React.FC<I> = ({ size = 46, color = "#0580F8" }) => (
  <P size={size} color={color}><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" /></P>
);
export const Cursor: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 8px 14px rgba(4,32,76,.35))" }}>
    <path d="M5 3l14 8-6 1.5L10 19z" fill="#fff" stroke="#04204C" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);
