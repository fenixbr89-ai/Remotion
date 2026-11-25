import React, { useId } from "react";
import { Easing, Img, interpolate, spring, useCurrentFrame } from "remotion";
import { F, FPS, fontFamily } from "./theme";

export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);

/** Keyframed value: keys = [[sec, value], ...], eased between keys. */
const mono = (keys: [number, number][]) => {
  const xs: number[] = [];
  const vs: number[] = [];
  keys.forEach(([t, v]) => {
    const fr = t * FPS;
    if (xs.length && fr <= xs[xs.length - 1]) {
      vs[vs.length - 1] = v;
    } else {
      xs.push(fr);
      vs.push(v);
    }
  });
  if (xs.length === 1) {
    xs.push(xs[0] + 1);
    vs.push(vs[0]);
  }
  return { xs, vs };
};

export const kf = (frame: number, keys: [number, number][]) => {
  const { xs, vs } = mono(keys);
  return interpolate(frame, xs, vs, { ...cl, easing: ease });
};

/** Quick camera "punch" bump that decays (for zooming on spoken words). */
export const punch = (frame: number, sec: number, amp = 0.08) => {
  const k = frame - F(sec);
  if (k < 0) return 0;
  return amp * (1 - Math.exp(-k / 2.2)) * Math.exp(-k / 10);
};

export const shakeXY = (frame: number, sec: number, amp = 16, dur = 9) => {
  const t = frame - F(sec);
  if (t < 0 || t > dur) return { x: 0, y: 0 };
  const k = 1 - t / dur;
  return { x: Math.sin(t * 2.9) * amp * k, y: Math.cos(t * 3.7) * amp * 0.7 * k };
};

/** Directional (motion) blur through an SVG filter. */
export const MBlur: React.FC<{ x?: number; y?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  x = 0,
  y = 0,
  style,
  children,
}) => {
  const id = "mb" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const on = Math.abs(x) + Math.abs(y) > 0.3;
  return (
    <div style={{ ...style, filter: on ? `url(#${id})` : style?.filter }}>
      {on && (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id={id} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={`${Math.abs(x).toFixed(2)} ${Math.abs(y).toFixed(2)}`} />
          </filter>
        </svg>
      )}
      {children}
    </div>
  );
};

type Dir = "up" | "down" | "left" | "right" | "zoom";

/** Word/element that slams in with motion blur and a stretch, like the references. */
export const Slam: React.FC<{
  at: number;
  dir?: Dir;
  dist?: number;
  style?: React.CSSProperties;
  inline?: boolean;
  children: React.ReactNode;
}> = ({ at, dir = "up", dist = 320, style, inline, children }) => {
  const f = useCurrentFrame();
  const k = f - F(at);
  if (k < 0) return <span style={{ display: inline ? "inline-block" : "block", visibility: "hidden", ...style }}>{children}</span>;
  const p = spring({ frame: k, fps: FPS, config: { damping: 13, stiffness: 230, mass: 0.6 } });
  const fast = interpolate(k, [0, 6], [1, 0], cl);
  const blur = fast * 42;
  const stretch = 1 + fast * 0.55;
  let t = "";
  let bx = 0;
  let by = 0;
  if (dir === "up") {
    t = `translateY(${(1 - p) * dist}px) scaleY(${stretch})`;
    by = blur;
  } else if (dir === "down") {
    t = `translateY(${-(1 - p) * dist}px) scaleY(${stretch})`;
    by = blur;
  } else if (dir === "left") {
    t = `translateX(${-(1 - p) * dist * 2}px) scaleX(${stretch})`;
    bx = blur;
  } else if (dir === "right") {
    t = `translateX(${(1 - p) * dist * 2}px) scaleX(${stretch})`;
    bx = blur;
  } else {
    t = `scale(${interpolate(p, [0, 1], [2.4, 1])})`;
    bx = by = blur * 0.4;
  }
  return (
    <MBlur
      x={bx}
      y={by}
      style={{ display: inline ? "inline-block" : "block", transform: t, opacity: interpolate(k, [0, 2], [0, 1], cl), ...style }}
    >
      {children}
    </MBlur>
  );
};

/** Typewriter: characters appear one by one across `dur` seconds. */
export const Type: React.FC<{ text: string; at: number; dur?: number; style?: React.CSSProperties; cursor?: boolean }> = ({
  text,
  at,
  dur,
  style,
  cursor,
}) => {
  const f = useCurrentFrame();
  const chars = [...text];
  const total = dur ?? Math.max(0.25, chars.length * 0.035);
  const step = F(total) / chars.length;
  const done = f - F(at) >= F(total);
  const blink = cursor && f >= F(at) && (!done || Math.floor(f / 8) % 2 === 0) && f < F(at + total + 0.6);
  return (
    <span style={{ display: "inline-block", whiteSpace: "pre", ...style }}>
      {chars.map((c, i) => {
        const k = f - F(at) - i * step;
        const o = interpolate(k, [0, 2], [0, 1], cl);
        const y = interpolate(k, [0, 5], [0.45, 0], { ...cl, easing: Easing.out(Easing.cubic) });
        const b = interpolate(k, [0, 4], [8, 0], cl);
        return (
          <span key={i} style={{ display: "inline-block", opacity: o, transform: `translateY(${y}em)`, filter: b > 0.3 ? `blur(${b}px)` : undefined }}>
            {c}
          </span>
        );
      })}
      {blink ? <span style={{ display: "inline-block", width: "0.08em", height: "0.9em", background: "currentColor", marginLeft: "0.05em", verticalAlign: "-0.1em" }} /> : null}
    </span>
  );
};

/* ───── horizontal tracking sentence (camera follows the spoken word) ───── */
let ctx: CanvasRenderingContext2D | null = null;
const measure = (text: string, size: number, weight: number) => {
  if (typeof document === "undefined") return text.length * size * 0.55;
  if (!ctx) ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return text.length * size * 0.55;
  ctx.font = `${weight} ${size}px ${fontFamily}`;
  return ctx.measureText(text).width - text.length * size * 0.02;
};

export type TrackItem = { t?: string; img?: string; imgW?: number; at: number; w?: number; color?: string; size?: number };

export const Track: React.FC<{ items: TrackItem[]; size: number; gap?: number; y: number; color: string; fadePrevAt?: number }> = ({
  items,
  size,
  gap = 0.28,
  y,
  color,
  fadePrevAt,
}) => {
  const f = useCurrentFrame();
  const g = size * gap;
  const widths = items.map((it) => (it.img ? it.imgW ?? size * 3 : measure(it.t ?? "", it.size ?? size, it.w ?? 700)));
  const starts: number[] = [];
  let acc = 0;
  widths.forEach((w) => {
    starts.push(acc);
    acc += w + g;
  });
  const centers = widths.map((w, i) => starts[i] + w / 2);
  // camera x: arrive on each word centre right as it is spoken
  const keys: [number, number][] = [];
  items.forEach((it, i) => {
    keys.push([it.at - 0.12, centers[i]]);
    keys.push([it.at + 0.05, centers[i]]);
  });
  const camX = (fr: number) => kf(fr, keys);
  const x = camX(f);
  const v = Math.abs(camX(f) - camX(f - 1));
  return (
    <MBlur x={Math.min(40, v * 0.35)} style={{ position: "absolute", left: 540 - x, top: y, whiteSpace: "nowrap", height: size * 1.3 }}>
      {items.map((it, i) => {
        const k = f - F(it.at);
        const fade = fadePrevAt !== undefined && i < items.length - 1 ? interpolate(f, [F(fadePrevAt), F(fadePrevAt) + 6], [1, 0], cl) : 1;
        const o = interpolate(k, [-2, 2], [0, 1], cl) * fade;
        const s = interpolate(spring({ frame: k, fps: FPS, config: { damping: 12, stiffness: 200 } }), [0, 1], [0.6, 1]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: starts[i],
              top: it.img ? size * 0.2 : 0,
              fontSize: it.size ?? size,
              fontWeight: it.w ?? 700,
              color: it.color ?? color,
              lineHeight: 1.1,
              opacity: o,
              transform: `scale(${k < 0 ? 0.6 : s})`,
              transformOrigin: "50% 60%",
              letterSpacing: "-0.02em",
            }}
          >
            {it.img ? <Img src={it.img} style={{ width: widths[i], display: "block" }} /> : it.t}
          </div>
        );
      })}
    </MBlur>
  );
};
