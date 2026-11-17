import React from "react";
import { useCurrentFrame } from "remotion";
import { easeInOut, easeOut, ip, pop, rand } from "../anim";
import { Icon3D } from "./Icons";

const W = 620;
const H = 460;
const RIM = 28;

const GRAINS = Array.from({ length: 120 }, (_, i) => ({
  x: rand(i + 1),
  y: rand(i + 77),
  v: rand(i + 155) > 0.5,
}));
const FAROFA = Array.from({ length: 70 }, (_, i) => ({
  x: rand(i + 300),
  y: rand(i + 400),
  c: rand(i + 500) > 0.8 ? "#3F7A2B" : rand(i + 600) > 0.45 ? "#F0CF86" : "#8E4F22",
  r: 4 + rand(i + 700) * 5,
}));

/** Compartimento (vista de cima) com fundo e borda interna */
const Slot: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  children?: React.ReactNode;
}> = ({ x, y, w, h, fill, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 34,
      background: fill,
      boxShadow: "inset 0 6px 14px rgba(11,31,77,.18), inset 0 -3px 6px rgba(255,255,255,.6)",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

/**
 * Marmita de alumínio vista de cima, reta e centralizada, com 3 divisórias:
 * arroz + carne (grande), feijão tropeiro e salada. A tampa desliza para cima.
 */
export const MarmitaTop: React.FC<{
  x: number;
  y: number;
  enterAt: number;
  lidAt: number;
  foodAt: number;
}> = ({ x, y, enterAt, lidAt, foodAt }) => {
  const frame = useCurrentFrame();
  const sp = pop(frame, enterAt, 11);
  const appear = ip(frame, [enterAt, enterAt + 12], [0, 1], easeOut);
  const lid = ip(frame, [lidAt, lidAt + 16], [0, 1], easeOut);
  const lidFade = ip(frame, [lidAt + 12, lidAt + 26], [1, 0], easeInOut);
  const breathe = Math.sin(frame * 0.06) * 4;

  const item = (at: number) => {
    const s = pop(frame, at, 9);
    return {
      opacity: ip(frame, [at, at + 6], [0, 1]),
      scale: String(Math.max(0, s)),
    };
  };

  const innerW = W - RIM * 2;
  const innerH = H - RIM * 2;
  const leftW = innerW * 0.56;
  const gap = 18;
  const rightW = innerW - leftW - gap;
  const halfH = (innerH - gap) / 2;

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
      {/* bandeja */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 64,
          background: "linear-gradient(160deg, #FFFFFF 0%, #E3E9F1 45%, #C9D2DE 100%)",
          boxShadow:
            "0 40px 90px rgba(11,31,77,.20), inset 0 2px 0 #FFFFFF, inset 0 -6px 14px rgba(11,31,77,.10)",
        }}
      />
      {/* divisórias (fundo) */}
      <div
        style={{
          position: "absolute",
          left: RIM - 8,
          top: RIM - 8,
          width: innerW + 16,
          height: innerH + 16,
          borderRadius: 44,
          background: "linear-gradient(180deg, #D6DDE7, #EEF2F7)",
        }}
      />

      {/* arroz + carne */}
      <Slot x={RIM} y={RIM} w={leftW} h={innerH} fill="radial-gradient(circle at 40% 35%, #FFFFFF, #EEF1F6 70%, #DCE2EA)">
        <svg width={leftW} height={innerH} style={{ position: "absolute", inset: 0 }}>
          {GRAINS.map((g, i) => (
            <ellipse
              key={i}
              cx={14 + g.x * (leftW - 28)}
              cy={14 + g.y * (innerH - 28)}
              rx={g.v ? 3.5 : 8}
              ry={g.v ? 8 : 3.5}
              fill="#FFFFFF"
              stroke="rgba(138,148,166,.38)"
              strokeWidth={1.3}
            />
          ))}
        </svg>
      </Slot>
      {/* tropeiro */}
      <Slot x={RIM + leftW + gap} y={RIM} w={rightW} h={halfH} fill="radial-gradient(circle at 40% 35%, #DDA663, #B87634 70%, #8E5424)">
        <svg width={rightW} height={halfH} style={{ position: "absolute", inset: 0 }}>
          {FAROFA.map((f, i) => (
            <circle key={i} cx={10 + f.x * (rightW - 20)} cy={10 + f.y * (halfH - 20)} r={f.r} fill={f.c} />
          ))}
        </svg>
      </Slot>
      {/* salada */}
      <Slot
        x={RIM + leftW + gap}
        y={RIM + halfH + gap}
        w={rightW}
        h={halfH}
        fill="radial-gradient(circle at 40% 35%, #A7DB7A, #6FB04A 70%, #4E8F33)"
      />

      {/* comida 3D por cima */}
      <div style={{ position: "absolute", left: RIM + leftW / 2 - 110, top: RIM + innerH / 2 - 100, ...item(foodAt) }}>
        <Icon3D src="3d/cut_of_meat.png" size={220} />
      </div>
      <div style={{ position: "absolute", left: RIM + leftW + gap + 20, top: RIM + 18, ...item(foodAt + 5) }}>
        <Icon3D src="3d/beans.png" size={84} />
      </div>
      <div style={{ position: "absolute", left: RIM + leftW + gap + 108, top: RIM + 70, ...item(foodAt + 7) }}>
        <Icon3D src="3d/beans.png" size={68} />
      </div>
      <div style={{ position: "absolute", left: RIM + leftW + gap - 6, top: RIM + halfH + gap - 10, ...item(foodAt + 10) }}>
        <Icon3D src="3d/leafy_green.png" size={128} />
      </div>
      <div style={{ position: "absolute", left: RIM + leftW + gap + 96, top: RIM + halfH + gap - 14, ...item(foodAt + 11) }}>
        <Icon3D src="3d/leafy_green.png" size={104} />
      </div>
      <div style={{ position: "absolute", left: RIM + leftW + gap + 36, top: RIM + halfH + gap + 76, ...item(foodAt + 13) }}>
        <Icon3D src="3d/tomato.png" size={78} />
      </div>
      <div style={{ position: "absolute", left: RIM + leftW + gap + 128, top: RIM + halfH + gap + 84, ...item(foodAt + 15) }}>
        <Icon3D src="3d/carrot.png" size={70} />
      </div>

      {/* vapor */}
      <svg width={W} height={300} style={{ position: "absolute", left: 0, top: -250, overflow: "visible" }}>
        {[0, 1, 2].map((i) => {
          const t0 = foodAt + 6 + i * 7;
          const p = ((((frame - t0) % 60) + 60) % 60) / 60;
          const o = frame >= t0 ? Math.sin(p * Math.PI) * 0.8 : 0;
          const cx = 220 + i * 120;
          return (
            <path
              key={i}
              d={`M ${cx} 280 C ${cx - 30} 240, ${cx + 30} 210, ${cx} 170 C ${cx - 30} 130, ${cx + 30} 100, ${cx} 60`}
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

      {/* tampa */}
      {lidFade > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: 68,
            background: "linear-gradient(160deg, #FFFFFF 0%, #E8EDF4 50%, #CED6E1 100%)",
            boxShadow: "0 30px 70px rgba(11,31,77,.18), inset 0 2px 0 #FFFFFF",
            translate: `0px ${-lid * 360}px`,
            opacity: lidFade,
            scale: String(1 - lid * 0.06),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: W - 120,
              height: H - 120,
              borderRadius: 44,
              border: "6px solid rgba(11,31,77,.06)",
              boxShadow: "inset 0 2px 0 rgba(255,255,255,.9)",
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
