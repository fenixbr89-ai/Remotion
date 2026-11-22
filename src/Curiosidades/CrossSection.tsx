import React, { useId } from "react";
import { random } from "remotion";
import { blinking, bob } from "./anim";
import { C, cleanId } from "./theme";
import { ToothG, Mood, Sparkle } from "./Tooth";
import { Abutment, Screw } from "./Parts";

export type CrossProps = {
  boneLoss?: number; // 0..1
  tilt?: number; // degrees neighbors lean into the gap
  neighborMood?: Mood;
  look?: number;
  drill?: number | null; // depth 0..1
  gumOpen?: boolean;
  screw?: { insert: number; phase: number } | null;
  boneGrow?: number; // 0..1
  abutment?: number | null; // 0 = far above, 1 = seated
  crown?: { drop: number; mood: Mood } | null;
  middleTooth?: Mood | null; // natural tooth in the middle (no gap)
  middleLift?: number; // 0..1 the middle tooth leaves
  drillOpacity?: number;
  screwOpacity?: number;
  drillSpin?: number;
  /** frame for blinking / idle bounce */
  t?: number;
  children?: React.ReactNode; // overlays in the 1000x1100 space
};

const GAP = 500;
const BONE_TOP = 445;

export const CrossSection: React.FC<CrossProps & { width?: number }> = ({
  boneLoss = 0,
  tilt = 0,
  neighborMood = "happy",
  look = 0,
  drill = null,
  gumOpen = false,
  screw = null,
  boneGrow = 0,
  abutment = null,
  crown = null,
  middleTooth = null,
  middleLift = 0,
  drillOpacity = 1,
  screwOpacity = 1,
  drillSpin = 0,
  t = 0,
  children,
  width = 1080,
}) => {
  const id = cleanId(useId());
  const dip = boneLoss * 120;
  const dots = new Array(70).fill(0).map((_, i) => ({
    x: random(`x${i}`) * 1000,
    y: 520 + random(`y${i}`) * 560,
    r: 6 + random(`r${i}`) * 16,
  }));
  const screwTop = BONE_TOP - (1 - (screw?.insert ?? 1)) * 330;
  return (
    <svg viewBox="0 0 1000 1100" width={width} height={(width * 1100) / 1000} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}-bone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4dc" />
          <stop offset="0.25" stopColor={C.bone} />
          <stop offset="1" stopColor="#e7cf9f" />
        </linearGradient>
        <linearGradient id={`${id}-gum`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb3c0" />
          <stop offset="0.35" stopColor={C.gum} />
          <stop offset="1" stopColor={C.gumDeep} />
        </linearGradient>
        <linearGradient id={`${id}-cav`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b88a4f" />
          <stop offset="0.5" stopColor="#d9b67c" />
          <stop offset="1" stopColor="#a87a40" />
        </linearGradient>
        <radialGradient id={`${id}-grow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={C.accent} stopOpacity={0.55} />
          <stop offset="1" stopColor={C.accent} stopOpacity={0} />
        </radialGradient>
        <filter id={`${id}-sh`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx={0} dy={14} stdDeviation={14} floodColor="#3b1d10" floodOpacity={0.28} />
        </filter>
        <filter id={`${id}-bl`}>
          <feGaussianBlur stdDeviation={6} />
        </filter>
        <clipPath id={`${id}-boneclip`}>
          <path d={`M0 ${BONE_TOP} L330 ${BONE_TOP} Q${GAP} ${BONE_TOP + dip * 2} 670 ${BONE_TOP} L1000 ${BONE_TOP} L1000 1300 L0 1300 Z`} />
        </clipPath>
      </defs>

      {/* bone block */}
      <g filter={`url(#${id}-sh)`}>
        <path
          d={`M0 ${BONE_TOP} L330 ${BONE_TOP} Q${GAP} ${BONE_TOP + dip * 2} 670 ${BONE_TOP} L1000 ${BONE_TOP} L1000 1300 L0 1300 Z`}
          fill={`url(#${id}-bone)`}
        />
      </g>
      <g clipPath={`url(#${id}-boneclip)`}>
        {dots.map((d, i) => (
          <ellipse key={i} cx={d.x} cy={d.y} rx={d.r} ry={d.r * 0.75} fill={C.boneDeep} opacity={0.35} />
        ))}
        <path
          d={`M0 ${BONE_TOP + 10} L330 ${BONE_TOP + 10} Q${GAP} ${BONE_TOP + 10 + dip * 2} 670 ${BONE_TOP + 10} L1000 ${BONE_TOP + 10}`}
          stroke="#fffaf0"
          strokeWidth={22}
          fill="none"
          opacity={0.8}
        />
      </g>

      {/* drilled bed */}
      {drill !== null || screw ? (
        <rect
          x={GAP - 50}
          y={BONE_TOP - 20}
          width={100}
          height={20 + (drill ?? 1) * 380}
          rx={46}
          fill={`url(#${id}-cav)`}
        />
      ) : null}

      {/* neighbor teeth */}
      <g transform={`rotate(${tilt} 220 820)`}>
        <g transform={`translate(80 ${186 + bob(t, 1, 2.5)}) scale(1.4)`}>
          <ToothG mood={neighborMood} rootLen={300} look={look} blink={blinking(t, 1)} />
        </g>
      </g>
      <g transform={`rotate(${-tilt} 780 820)`}>
        <g transform={`translate(640 ${186 + bob(t, 4, 2.5)}) scale(1.4)`}>
          <ToothG mood={neighborMood} rootLen={300} look={-look} blink={blinking(t, 4)} />
        </g>
      </g>

      {middleTooth ? (
        <g transform={`translate(360 ${186 - middleLift * 340 + bob(t, 2, 2.5)}) scale(1.4)`} opacity={1 - middleLift}>
          <ToothG mood={middleTooth} rootLen={300} blink={blinking(t, 2)} />
        </g>
      ) : null}

      {/* gum */}
      <path
        d={`M0 400 Q110 362 220 372 Q360 380 ${GAP} ${372 + dip * 0.8} Q640 380 780 372 Q890 362 1000 400 L1000 488 Q${GAP} ${500 + dip * 1.7} 0 488 Z`}
        fill={`url(#${id}-gum)`}
        opacity={0.95}
      />
      <path d={`M40 392 Q120 370 200 376`} stroke="#ffd1da" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.8} />
      <path d={`M800 376 Q880 370 960 392`} stroke="#ffd1da" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.8} />
      {gumOpen ? <ellipse cx={GAP} cy={392} rx={62} ry={15} fill="#9b2f47" /> : null}

      {/* bone growth halo */}
      {boneGrow > 0 ? (
        <g opacity={boneGrow}>
          <ellipse cx={GAP} cy={BONE_TOP + 200} rx={130} ry={250} fill={`url(#${id}-grow)`} />
        </g>
      ) : null}

      {/* implant screw */}
      {screw ? (
        <g transform={`translate(${GAP} ${screwTop})`} opacity={screwOpacity}>
          <Screw len={390} phase={screw.phase} />
        </g>
      ) : null}

      {boneGrow > 0 ? (
        <g>
          {new Array(16).fill(0).map((_, i) => {
            const side = i % 2 === 0 ? -1 : 1;
            const y = BONE_TOP + 40 + (i / 16) * 330;
            const show = boneGrow * 16 > i ? 1 : 0;
            return (
              <g key={i} opacity={show}>
                <circle cx={GAP + side * (66 + random(`g${i}`) * 14)} cy={y} r={13} fill="#fff4dc" stroke={C.boneDeep} strokeWidth={3} />
              </g>
            );
          })}
          <Sparkle x={GAP - 120} y={BONE_TOP + 90} s={1.1} color={C.accent} opacity={boneGrow} />
          <Sparkle x={GAP + 125} y={BONE_TOP + 250} s={0.9} color={C.accent} opacity={boneGrow} />
          <Sparkle x={GAP - 105} y={BONE_TOP + 330} s={0.7} color={C.accent} opacity={boneGrow} />
        </g>
      ) : null}

      {/* abutment */}
      {abutment !== null ? (
        <g transform={`translate(${GAP} ${358 - (1 - abutment) * 260})`}>
          <Abutment />
        </g>
      ) : null}

      {/* crown */}
      {crown ? (
        <g transform={`translate(360 ${186 - (1 - crown.drop) * 300}) scale(1.4)`}>
          <ToothG crownOnly mood={crown.mood} blink={crown.drop >= 1 && blinking(t, 2)} />
        </g>
      ) : null}

      {crown && crown.drop >= 1 ? (
        <path
          d={`M360 404 Q${GAP} 440 640 404 L640 470 Q${GAP} 480 360 470 Z`}
          fill={`url(#${id}-gum)`}
        />
      ) : null}

      {/* drill */}
      {drill !== null ? (
        <g transform={`translate(${GAP} ${BONE_TOP - 40 + drill * 380})`} opacity={drillOpacity}>
          <rect x={-16} y={-420} width={32} height={420} rx={14} fill="#cbd5e1" />
          {new Array(10).fill(0).map((_, i) => (
            <path key={i} d={`M-16 ${-30 - i * 36 + (drillSpin % 1) * 36} L16 ${-12 - i * 36 + (drillSpin % 1) * 36}`} stroke="#64748b" strokeWidth={6} strokeLinecap="round" />
          ))}
          <path d="M-16 -10 L16 -10 L0 26 Z" fill="#94a3b8" />
          <rect x={-58} y={-640} width={116} height={240} rx={40} fill="#f8fafc" />
          <rect x={-58} y={-640} width={116} height={240} rx={40} fill="none" stroke="#cbd5e1" strokeWidth={4} />
          <rect x={-58} y={-560} width={116} height={40} fill={C.accent} />
          <rect x={-36} y={-630} width={14} height={200} rx={7} fill="#fff" opacity={0.9} />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              transform={`translate(${-60 + i * 55} ${-60 - i * 30}) scale(0.6)`}
              d="M0 -20 Q14 0 0 12 Q-14 0 0 -20 Z"
              fill="#7cc4ff"
              opacity={0.9}
            />
          ))}
        </g>
      ) : null}
      {children}
    </svg>
  );
};
