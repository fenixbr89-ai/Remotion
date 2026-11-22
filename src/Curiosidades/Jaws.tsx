import React, { useId } from "react";
import { random } from "remotion";
import { C, cleanId } from "./theme";
import { ToothG } from "./Tooth";

const BoneDots: React.FC<{ y0: number; y1: number; seed: string; n?: number }> = ({ y0, y1, seed, n = 40 }) => (
  <g>
    {new Array(n).fill(0).map((_, i) => {
      const r = 6 + random(`${seed}r${i}`) * 14;
      return (
        <ellipse
          key={i}
          cx={random(`${seed}x${i}`) * 1000}
          cy={y0 + random(`${seed}y${i}`) * (y1 - y0)}
          rx={r}
          ry={r * 0.75}
          fill={C.boneDeep}
          opacity={0.35}
        />
      );
    })}
  </g>
);

const Grads: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={`${id}-bone`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff6e2" />
      <stop offset="1" stopColor="#f3dcaa" />
    </linearGradient>
    <linearGradient id={`${id}-gum`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffb7c3" />
      <stop offset="0.4" stopColor={C.gum} />
      <stop offset="1" stopColor={C.gumDeep} />
    </linearGradient>
    <linearGradient id={`${id}-gumU`} x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stopColor="#ffb7c3" />
      <stop offset="0.4" stopColor={C.gum} />
      <stop offset="1" stopColor={C.gumDeep} />
    </linearGradient>
    <linearGradient id={`${id}-sin`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#f6f9ff" />
      <stop offset="1" stopColor={C.sinus} />
    </linearGradient>
  </defs>
);

/** Upper + lower jaw: the upper tooth over the gap "descends" (extrusion). */
export const Jaws: React.FC<{ extrude?: number; children?: React.ReactNode }> = ({ extrude = 80, children }) => {
  const id = cleanId(useId());
  const s = 1.3;
  const R = 180;
  const upTy = 640 - (155 + R - 5) * s;
  const lowTy = 690 - 5 * s;
  return (
    <svg viewBox="0 0 1000 1300" width={1080} height={1404} style={{ overflow: "visible" }}>
      <Grads id={id} />
      {/* upper bone + teeth + gum */}
      <rect x={0} y={150} width={1000} height={330} rx={40} fill={`url(#${id}-bone)`} />
      <BoneDots y0={190} y1={420} seed="up" n={25} />
      {[220, 500, 780].map((cx) => (
        <g key={cx} transform={`translate(${cx - 100 * s} ${upTy + (cx === 500 ? extrude : 0)}) scale(${s})`}>
          <ToothG flip rootLen={R} mood={cx === 500 ? "wow" : "calm"} look={cx === 500 ? 0 : cx < 500 ? 5 : -5} />
        </g>
      ))}
      <path d="M0 400 L1000 400 L1000 470 Q890 490 780 478 Q640 466 500 478 Q360 466 220 478 Q110 490 0 470 Z" fill={`url(#${id}-gumU)`} opacity={0.95} />
      <path d="M380 640 L620 640" stroke={C.accentDeep} strokeWidth={5} strokeDasharray="14 12" strokeLinecap="round" />

      {/* lower bone + teeth + gum */}
      <path d="M0 900 L330 900 Q500 1000 670 900 L1000 900 L1000 1500 L0 1500 Z" fill={`url(#${id}-bone)`} />
      <BoneDots y0={960} y1={1400} seed="low" />
      {[220, 780].map((cx) => (
        <g key={cx} transform={`translate(${cx - 100 * s} ${lowTy}) scale(${s})`}>
          <ToothG rootLen={R} mood="worried" look={cx < 500 ? 6 : -6} />
        </g>
      ))}
      <path
        d="M0 862 Q110 838 220 846 Q360 854 500 890 Q640 854 780 846 Q890 838 1000 862 L1000 950 Q500 1000 0 950 Z"
        fill={`url(#${id}-gum)`}
        opacity={0.95}
      />
      {children}
    </svg>
  );
};

/** Upper jaw with the maxillary sinus dropping into the gap (pneumatisation). */
export const Sinus: React.FC<{ drop?: number; children?: React.ReactNode }> = ({ drop = 1, children }) => {
  const id = cleanId(useId());
  const s = 1.3;
  const R = 180;
  const ty = 900 - (155 + R - 5) * s;
  const floor = 300 + drop * 170;
  return (
    <svg viewBox="0 0 1000 1100" width={1080} height={1188} style={{ overflow: "visible" }}>
      <Grads id={id} />
      <rect x={0} y={-100} width={1000} height={760} fill={`url(#${id}-bone)`} />
      <BoneDots y0={-60} y1={640} seed="sin" n={55} />
      {/* sinus cavity */}
      <path
        d={`M70 40 Q500 -40 930 40 Q960 160 920 250 Q820 300 690 290 Q500 ${floor * 2 - 290} 310 290 Q180 300 80 250 Q40 160 70 40 Z`}
        fill={`url(#${id}-sin)`}
        stroke={C.sinusDeep}
        strokeWidth={6}
      />
      <path d="M310 292 Q500 300 690 292" stroke={C.accentDeep} strokeWidth={5} strokeDasharray="14 12" fill="none" strokeLinecap="round" />
      {[220, 780].map((cx) => (
        <g key={cx} transform={`translate(${cx - 100 * s} ${ty}) scale(${s})`}>
          <ToothG flip rootLen={R} mood="worried" look={cx < 500 ? 6 : -6} />
        </g>
      ))}
      <path
        d="M0 600 L1000 600 L1000 700 Q890 718 780 706 Q640 694 500 712 Q360 694 220 706 Q110 718 0 700 Z"
        fill={`url(#${id}-gumU)`}
        opacity={0.95}
      />
      {children}
    </svg>
  );
};

/** Small bone-ridge cross-section (no tooth): before vs after resorption. */
export const Ridge: React.FC<{ after?: boolean }> = ({ after }) => {
  const id = cleanId(useId());
  const wide = "M40 440 L40 170 Q40 70 200 70 Q360 70 360 170 L360 440 Z";
  const thin = "M120 440 L126 260 Q134 190 200 190 Q266 190 274 260 L280 440 Z";
  return (
    <svg viewBox="0 0 400 460" width={400} height={460}>
      <Grads id={id} />
      <clipPath id={`${id}-rc`}>
        <path d={after ? thin : wide} />
      </clipPath>
      <path d={after ? thin : wide} fill={`url(#${id}-bone)`} stroke={C.boneDeep} strokeWidth={5} />
      <g opacity={0.9} clipPath={`url(#${id}-rc)`}>
        <BoneDots y0={200} y1={430} seed={after ? "ra" : "rb"} n={after ? 120 : 120} />
      </g>
      <path
        d={after ? "M104 440 L108 250 Q118 166 200 166 Q282 166 292 250 L296 440" : "M20 440 L20 165 Q20 46 200 46 Q380 46 380 165 L380 440"}
        stroke={`url(#${id}-gum)`}
        strokeWidth={30}
        fill="none"
        strokeLinecap="round"
      />
      {after ? <path d={wide} fill="none" stroke={C.accentDeep} strokeWidth={5} strokeDasharray="14 12" /> : null}
    </svg>
  );
};
