import React from "react";
import { useCurrentFrame } from "remotion";
import { easeInOut, easeOut, ip, pop, rand } from "../anim";
import { Icon3D } from "./Icons";

const W = 640;
const H = 560;

/** Grãos de arroz determinísticos */
const GRAINS = Array.from({ length: 46 }, (_, i) => ({
  x: 40 + rand(i + 1) * 170,
  y: 34 + rand(i + 50) * 90,
  r: rand(i + 99) > 0.5 ? 0 : 90,
}));
const FAROFA = Array.from({ length: 60 }, (_, i) => ({
  x: 20 + rand(i + 300) * 190,
  y: 40 + rand(i + 400) * 80,
  c: rand(i + 500) > 0.78 ? "#3F7A2B" : rand(i + 600) > 0.5 ? "#F0CF86" : "#8E4F22",
  r: 3 + rand(i + 700) * 4,
}));

const Rice: React.FC = () => (
  <svg width={250} height={170} viewBox="0 0 250 170">
    <defs>
      <radialGradient id="rice" cx="45%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#F1F3F7" />
        <stop offset="100%" stopColor="#D5DBE5" />
      </radialGradient>
    </defs>
    <path d="M10 160 C 10 70, 60 20, 125 20 C 190 20, 240 70, 240 160 Z" fill="url(#rice)" />
    {GRAINS.map((g, i) => (
      <ellipse
        key={i}
        cx={g.x}
        cy={g.y + 10}
        rx={g.r ? 3 : 7}
        ry={g.r ? 7 : 3}
        fill="#FFFFFF"
        stroke="rgba(138,148,166,.35)"
        strokeWidth={1.2}
      />
    ))}
  </svg>
);

const Tropeiro: React.FC = () => (
  <svg width={240} height={160} viewBox="0 0 240 160">
    <defs>
      <radialGradient id="trop" cx="45%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#D9A15E" />
        <stop offset="65%" stopColor="#B87634" />
        <stop offset="100%" stopColor="#8E5424" />
      </radialGradient>
    </defs>
    <path d="M6 150 C 10 70, 60 26, 120 26 C 180 26, 232 70, 236 150 Z" fill="url(#trop)" />
    {FAROFA.map((f, i) => (
      <circle key={i} cx={f.x + 10} cy={f.y + 20} r={f.r} fill={f.c} opacity={0.9} />
    ))}
  </svg>
);

/**
 * Marmita de alumínio desenhada em SVG (estilo 3D com degradês), com tampa
 * que sobe reta e revela arroz, feijão tropeiro, carne e salada. Vapor subindo.
 */
export const Marmita: React.FC<{
  x: number;
  y: number;
  enterAt: number;
  lidAt: number;
  foodAt: number;
}> = ({ x, y, enterAt, lidAt, foodAt }) => {
  const frame = useCurrentFrame();

  const sp = pop(frame, enterAt, 11);
  const appear = ip(frame, [enterAt, enterAt + 12], [0, 1], easeOut);
  const lidLift = ip(frame, [lidAt, lidAt + 16], [0, 1], easeOut);
  const lidFade = ip(frame, [lidAt + 14, lidAt + 30], [1, 0], easeInOut);
  const breathe = Math.sin(frame * 0.06) * 4;

  const food = [
    { at: foodAt, el: <Rice />, left: 52, top: 52 },
    { at: foodAt + 4, el: <Tropeiro />, left: 250, top: 62 },
    {
      at: foodAt + 8,
      el: (
        <div style={{ position: "relative", width: 200, height: 170 }}>
          <Icon3D src="3d/beans.png" size={86} style={{ position: "absolute", left: 6, top: 20 }} />
          <Icon3D src="3d/beans.png" size={70} style={{ position: "absolute", left: 104, top: 6 }} />
        </div>
      ),
      left: 262,
      top: 30,
    },
    {
      at: foodAt + 10,
      el: <Icon3D src="3d/cut_of_meat.png" size={196} />,
      left: 196,
      top: 30,
    },
    {
      at: foodAt + 14,
      el: (
        <div style={{ position: "relative", width: 210, height: 190 }}>
          <Icon3D src="3d/leafy_green.png" size={170} style={{ position: "absolute", left: 30, top: 0 }} />
          <Icon3D src="3d/tomato.png" size={96} style={{ position: "absolute", left: 0, top: 86 }} />
          <Icon3D src="3d/carrot.png" size={84} style={{ position: "absolute", left: 120, top: 96 }} />
        </div>
      ),
      left: 412,
      top: 20,
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: x - W / 2,
        top: y - H / 2 + breathe,
        width: W,
        height: H,
        opacity: appear,
        filter: appear >= 1 ? undefined : `blur(${(1 - appear) * 16}px)`,
        scale: String(0.6 + 0.4 * sp),
      }}
    >
      {/* sombra no chão */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 500,
          width: 500,
          height: 50,
          borderRadius: "50%",
          background: "rgba(11,31,77,.18)",
          filter: "blur(18px)",
        }}
      />

      {/* fundo da abertura (parede interna) */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="inner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9EA9B9" />
            <stop offset="100%" stopColor="#DCE2EA" />
          </linearGradient>
        </defs>
        <rect x={44} y={204} width={552} height={70} rx={34} fill="url(#inner)" />
      </svg>

      {/* vapor */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: -230, overflow: "visible" }}>
        {[0, 1, 2].map((i) => {
          const t0 = foodAt + 6 + i * 7;
          const cycle = ((frame - t0) % 60 + 60) % 60;
          const active = frame >= t0;
          const p = cycle / 60;
          const o = active ? Math.sin(p * Math.PI) * 0.75 : 0;
          const cx = 210 + i * 110;
          return (
            <path
              key={i}
              d={`M ${cx} 300 C ${cx - 30} 260, ${cx + 30} 230, ${cx} 190 C ${cx - 30} 150, ${cx + 30} 120, ${cx} 80`}
              fill="none"
              stroke="#C7D5EA"
              strokeWidth={14}
              strokeLinecap="round"
              opacity={o}
              style={{ translate: `0px ${-p * 70}px`, filter: "blur(5px)" }}
            />
          );
        })}
      </svg>

      {/* comida */}
      {food.map((f, i) => {
        const fs = pop(frame, f.at, 10);
        const fp = ip(frame, [f.at, f.at + 8], [0, 1], easeOut);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: f.left,
              top: f.top + 70,
              opacity: fp,
              scale: String(Math.max(0, fs)),
              transformOrigin: "50% 100%",
              translate: `0px ${(1 - fs) * 40}px`,
            }}
          >
            {f.el}
          </div>
        );
      })}

      {/* corpo + borda frontal */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B4BFCE" />
            <stop offset="18%" stopColor="#EEF2F7" />
            <stop offset="42%" stopColor="#CDD5E0" />
            <stop offset="62%" stopColor="#F6F8FB" />
            <stop offset="85%" stopColor="#D2D9E3" />
            <stop offset="100%" stopColor="#A9B4C4" />
          </linearGradient>
          <linearGradient id="bodyShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(11,31,77,.16)" />
          </linearGradient>
          <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#DDE3EB" />
            <stop offset="100%" stopColor="#B7C1CF" />
          </linearGradient>
        </defs>
        <path
          d="M 40 262 L 600 262 L 552 478 Q 546 500 522 500 L 118 500 Q 94 500 88 478 Z"
          fill="url(#body)"
        />
        <path
          d="M 40 262 L 600 262 L 552 478 Q 546 500 522 500 L 118 500 Q 94 500 88 478 Z"
          fill="url(#bodyShade)"
        />
        {Array.from({ length: 11 }, (_, i) => {
          const tx = 70 + i * 50;
          const bx = 110 + i * 42;
          return (
            <line
              key={i}
              x1={tx}
              y1={276}
              x2={bx}
              y2={490}
              stroke={i % 2 ? "rgba(255,255,255,.55)" : "rgba(11,31,77,.07)"}
              strokeWidth={6}
              strokeLinecap="round"
            />
          );
        })}
        <rect x={18} y={240} width={604} height={44} rx={22} fill="url(#rim)" />
        <rect x={40} y={248} width={560} height={8} rx={4} fill="rgba(255,255,255,.9)" />
      </svg>

      {/* tampa */}
      {lidFade > 0 ? (
        <svg
          width={W}
          height={H}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            translate: `0px ${-lidLift * 300}px`,
            opacity: lidFade,
            scale: String(1 - lidLift * 0.08),
            filter: lidLift > 0.02 ? `blur(${lidLift * 3}px)` : undefined,
          }}
        >
          <defs>
            <linearGradient id="lid" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#B9C3D1" />
            </linearGradient>
            <linearGradient id="lidTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#D3DAE4" />
            </linearGradient>
          </defs>
          <rect x={10} y={196} width={620} height={66} rx={30} fill="url(#lid)" />
          <rect x={44} y={134} width={552} height={92} rx={40} fill="url(#lidTop)" />
          <rect x={84} y={152} width={472} height={50} rx={24} fill="none" stroke="rgba(11,31,77,.08)" strokeWidth={5} />
          <rect x={70} y={144} width={300} height={10} rx={5} fill="rgba(255,255,255,.95)" />
        </svg>
      ) : null}
    </div>
  );
};
