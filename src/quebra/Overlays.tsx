import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { FONT_MONO, FPS, H, W } from "./theme";

/**
 * Elementos auxiliares em linha fina e rótulos mono maiúsculos.
 * Tempos (`at`) em segundos relativos ao início da cena.
 */
type Tone = "base" | "theme" | "accent";
type Base = { at?: number; tone?: Tone };

export type Overlay = Base &
  (
    | { type: "label"; text: string; x: number; y: number; align?: "left" | "center" | "right"; size?: number }
    | { type: "line"; from: [number, number]; to: [number, number]; dashed?: boolean }
    | { type: "arrow"; from: [number, number]; to: [number, number]; bend?: number }
    | { type: "arc"; x: number; y: number; r: number; start: number; end: number; arrow?: boolean }
    | { type: "ring"; x: number; y: number; r: number; dashed?: boolean }
    | { type: "bracket"; x: number; y1: number; y2: number; side?: "left" | "right" }
    | { type: "gauge"; x: number; y: number; r: number; value: number; label?: string }
  );

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.bezier(0.45, 0, 0.2, 1);

const arrowHead = (x: number, y: number, ang: number, s = 16) => {
  const a1 = ang + Math.PI * 0.82;
  const a2 = ang - Math.PI * 0.82;
  return `M ${x + Math.cos(a1) * s} ${y + Math.sin(a1) * s} L ${x} ${y} L ${x + Math.cos(a2) * s} ${y + Math.sin(a2) * s}`;
};

const polar = (x: number, y: number, r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [x + r * Math.cos(a), y + r * Math.sin(a)] as const;
};

const arcPath = (x: number, y: number, r: number, s: number, e: number) => {
  const [x1, y1] = polar(x, y, r, s);
  const [x2, y2] = polar(x, y, r, e);
  const large = Math.abs(e - s) > 180 ? 1 : 0;
  const sweep = e > s ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`;
};

const One: React.FC<{
  o: Overlay;
  local: number; // frames desde o início da cena
  out: number; // 0..1 saída da cena
  colors: Record<Tone, string>;
}> = ({ o, local, out, colors }) => {
  const start = (o.at ?? 0.45) * FPS;
  const p = interpolate(local, [start, start + 0.5 * FPS], [0, 1], { ...CLAMP, easing: EASE });
  if (p <= 0) return null;
  const color = colors[o.tone ?? "base"];
  const opacity = (o.type === "label" ? p : Math.min(1, p * 2)) * (1 - out) * 0.9;
  const stroke = {
    stroke: color,
    strokeWidth: 2.5,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    pathLength: 1,
    strokeDasharray: "1 1",
    strokeDashoffset: 1 - p,
    opacity,
  };

  switch (o.type) {
    case "label": {
      const anchor = o.align === "left" ? "start" : o.align === "right" ? "end" : "middle";
      return (
        <text
          x={o.x}
          y={o.y + (1 - p) * 14}
          textAnchor={anchor}
          fill={color}
          opacity={opacity}
          style={{
            fontFamily: FONT_MONO,
            fontWeight: 500,
            fontSize: o.size ?? 28,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            filter: `blur(${(1 - p) * 6}px)`,
          }}
        >
          {o.text.toUpperCase()}
        </text>
      );
    }
    case "line":
      return (
        <path
          d={`M ${o.from[0]} ${o.from[1]} L ${o.to[0]} ${o.to[1]}`}
          {...stroke}
          strokeDasharray={o.dashed ? "0.02 0.02" : stroke.strokeDasharray}
          strokeDashoffset={o.dashed ? 0 : stroke.strokeDashoffset}
          opacity={o.dashed ? opacity * p : opacity}
        />
      );
    case "arrow": {
      const [x1, y1] = o.from;
      const [x2, y2] = o.to;
      const mx = (x1 + x2) / 2 - (y2 - y1) * (o.bend ?? 0);
      const my = (y1 + y2) / 2 + (x2 - x1) * (o.bend ?? 0);
      const ang = Math.atan2(y2 - my, x2 - mx);
      return (
        <g>
          <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} {...stroke} />
          <path
            d={arrowHead(x2, y2, ang)}
            {...stroke}
            pathLength={undefined}
            strokeDasharray={undefined}
            strokeDashoffset={undefined}
            opacity={opacity * interpolate(p, [0.85, 1], [0, 1], CLAMP)}
          />
        </g>
      );
    }
    case "arc": {
      const e = o.start + (o.end - o.start) * p;
      const [hx, hy] = polar(o.x, o.y, o.r, e);
      const tang = ((e - 90) * Math.PI) / 180 + (o.end > o.start ? Math.PI / 2 : -Math.PI / 2);
      return (
        <g opacity={opacity}>
          <path d={arcPath(o.x, o.y, o.r, o.start, e)} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          {o.arrow ? <path d={arrowHead(hx, hy, tang)} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" /> : null}
        </g>
      );
    }
    case "ring":
      return (
        <circle
          cx={o.x}
          cy={o.y}
          r={o.r}
          {...stroke}
          strokeDasharray={o.dashed ? "0.01 0.012" : stroke.strokeDasharray}
          strokeDashoffset={o.dashed ? 0 : stroke.strokeDashoffset}
          opacity={o.dashed ? opacity * p : opacity}
        />
      );
    case "bracket": {
      const dir = o.side === "left" ? -1 : 1;
      const d = `M ${o.x - dir * 18} ${o.y1} L ${o.x} ${o.y1} L ${o.x} ${o.y2} L ${o.x - dir * 18} ${o.y2}`;
      return <path d={d} {...stroke} />;
    }
    case "gauge": {
      // velocímetro: arco de -120° a 120°, ponteiro gira até `value` (0..1)
      const s = -120;
      const e = 120;
      const v = s + (e - s) * o.value * p;
      const [nx, ny] = polar(o.x, o.y, o.r * 0.82, v);
      const ticks = Array.from({ length: 11 }, (_, k) => {
        const a = s + ((e - s) * k) / 10;
        const [ax, ay] = polar(o.x, o.y, o.r, a);
        const [bx, by] = polar(o.x, o.y, o.r - (k % 5 === 0 ? 26 : 14), a);
        return <path key={k} d={`M ${ax} ${ay} L ${bx} ${by}`} stroke={color} strokeWidth={2.5} />;
      });
      return (
        <g opacity={opacity}>
          <path d={arcPath(o.x, o.y, o.r, s, e)} stroke={color} strokeWidth={2.5} fill="none" />
          {ticks}
          <path d={`M ${o.x} ${o.y} L ${nx} ${ny}`} stroke={colors.accent} strokeWidth={3.5} strokeLinecap="round" />
          <circle cx={o.x} cy={o.y} r={7} fill={color} />
          {o.label ? (
            <text x={o.x} y={o.y + o.r * 0.55} textAnchor="middle" fill={color} style={{ fontFamily: FONT_MONO, fontSize: 26, letterSpacing: "0.16em" }}>
              {o.label.toUpperCase()}
            </text>
          ) : null}
        </g>
      );
    }
  }
};

export const Overlays: React.FC<{
  items: Overlay[];
  from: number;
  to: number;
  colors: Record<Tone, string>;
}> = ({ items, from, to, colors }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const out = interpolate(frame, [to - 0.25 * FPS, to], [0, 1], CLAMP);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      {items.map((o, i) => (
        <One key={i} o={o} local={frame - from} out={out} colors={colors} />
      ))}
    </svg>
  );
};
