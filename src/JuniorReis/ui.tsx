import type { CSSProperties, FC, ReactNode } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EI, LIME, SANS, SERIF, tw, type Rect } from "./lib";

// ---------- Caixa que pode "morphar" entre retângulos ----------
export const Box: FC<{
  rect: Rect;
  layers?: { style: CSSProperties; o: number }[];
  shadow?: string;
  style?: CSSProperties;
  children?: ReactNode;
}> = ({ rect, layers = [], shadow, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: rect.x,
      top: rect.y,
      width: rect.w,
      height: rect.h,
      borderRadius: rect.r,
      boxShadow: shadow,
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: rect.r,
        overflow: "hidden",
      }}
    >
      {layers.map((l, i) =>
        l.o > 0.001 ? (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: rect.r,
              opacity: l.o,
              ...l.style,
            }}
          />
        ) : null,
      )}
      {children}
    </div>
  </div>
);

// ---------- Tipografia cinética ----------
export type Seg = { t: string; serif?: boolean; color?: string };
export type KLine = {
  y: number; // centro vertical da linha
  size: number;
  color: string;
  weight?: number;
  serifColor?: string;
  chars?: boolean; // anima letra a letra
  segs: Seg[];
};

export const Kinetic: FC<{
  lines: KLine[];
  start: number;
  end: number;
  stagger?: number;
}> = ({ lines, start, end, stagger = 2.6 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  let k = 0;

  const unit = (
    key: string,
    text: string,
    size: number,
    style: CSSProperties,
    serif: boolean,
    step: number,
  ) => {
    const delay = start + k * step;
    const ex = end + Math.min(k, 10) * 0.5;
    k++;
    const p = spring({
      frame: f - delay,
      fps,
      config: serif
        ? { damping: 13, stiffness: 120, mass: 0.7 }
        : { damping: 15, stiffness: 170, mass: 0.6 },
    });
    const o = tw(f, delay, delay + 9);
    const e = tw(f, ex, ex + 10, 0, 1, EI);
    return (
      <span
        key={key}
        style={{
          display: "inline-block",
          whiteSpace: "pre",
          opacity: o * (1 - e),
          translate: `0px ${(1 - p) * 0.6 * size - e * 0.45 * size}px`,
          rotate: serif ? `${(1 - p) * -16}deg` : `${(1 - p) * 4}deg`,
          scale: String(0.82 + 0.18 * Math.min(p, 1.2)),
          filter: `blur(${(1 - o) * 10 + e * 10}px)`,
          transformOrigin: "50% 100%",
          ...style,
        }}
      >
        {text}
      </span>
    );
  };

  return (
    <>
      {lines.map((line, li) => {
        const words: ReactNode[] = [];
        line.segs.forEach((seg, si) => {
          const parts = seg.t.split(" ").filter((w) => w.length > 0);
          parts.forEach((w, wi) => {
            const isSerif = !!seg.serif;
            const style: CSSProperties = isSerif
              ? {
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: line.size * 1.1,
                  letterSpacing: "-0.01em",
                  color: seg.color ?? line.serifColor ?? LIME,
                }
              : {
                  fontFamily: SANS,
                  fontWeight: line.weight ?? 800,
                  fontSize: line.size,
                  letterSpacing: line.weight && line.weight < 600 ? "-0.01em" : "-0.045em",
                  color: seg.color ?? line.color,
                };
            const key = `${li}-${si}-${wi}`;
            if (isSerif || line.chars) {
              // letra a letra
              words.push(
                <span key={key} style={{ display: "inline-block", whiteSpace: "pre" }}>
                  {[...w].map((ch, ci) =>
                    unit(`${key}-${ci}`, ch, line.size, style, isSerif, 1.15),
                  )}
                </span>,
              );
            } else {
              words.push(unit(key, w, line.size, style, false, stagger));
            }
            const last = si === line.segs.length - 1 && wi === parts.length - 1;
            if (!last) words.push(<span key={`${key}-sp`}>{" "}</span>);
          });
        });
        return (
          <div
            key={li}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: line.y - line.size * 0.7,
              height: line.size * 1.4,
              lineHeight: `${line.size * 1.4}px`,
              fontSize: line.size,
              fontFamily: SANS,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {words}
          </div>
        );
      })}
    </>
  );
};

// ---------- Conteúdo de notificação (dentro da caixa 880x165) ----------
export const NotifContent: FC<{
  icon: ReactNode;
  title: string;
  sub: string;
  o: number;
  iconO?: number;
  iconBg?: string;
  slide?: number; // 0..1
}> = ({ icon, title, sub, o, iconO = o, iconBg = LIME, slide = 1 }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: 38,
        top: 31,
        width: 104,
        height: 104,
        borderRadius: 26,
        background: iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: iconO,
        color: "#0b0b0b",
      }}
    >
      <div style={{ width: 54, height: 54 }}>{icon}</div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 173,
        top: 30,
        opacity: o,
        translate: `${(1 - slide) * -30}px 0px`,
        fontFamily: SANS,
      }}
    >
      <div style={{ fontSize: 45, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: "56px" }}>
        {title}
      </div>
      <div style={{ fontSize: 33, fontWeight: 400, color: "#A6A6A6", lineHeight: "50px", marginTop: 2 }}>
        {sub}
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        right: 38,
        top: 36,
        fontFamily: SANS,
        fontSize: 30,
        color: "#8E8E8E",
        opacity: o,
      }}
    >
      agora
    </div>
  </>
);

// ---------- Cursor ----------
export const Cursor: FC<{ x: number; y: number; press: number; o?: number }> = ({
  x,
  y,
  press,
  o = 1,
}) => (
  <svg
    viewBox="0 0 40 52"
    style={{
      position: "absolute",
      left: x - 6,
      top: y - 4,
      width: 72,
      height: 94,
      opacity: o,
      scale: String(1 - press * 0.14),
      transformOrigin: "6px 4px",
      filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.45))",
      overflow: "visible",
    }}
  >
    <path
      d="M3 2 L3 40 L12.5 31 L19 46 L25.5 43 L19 28.5 L32 28.5 Z"
      fill="#fff"
      stroke="#000"
      strokeWidth={3}
      strokeLinejoin="round"
    />
  </svg>
);

// Ripple de clique (dentro de um botão com overflow hidden)
export const Ripple: FC<{ x: number; y: number; p: number; color: string }> = ({ x, y, p, color }) =>
  p > 0 && p < 1 ? (
    <div
      style={{
        position: "absolute",
        left: x - 400 * p,
        top: y - 400 * p,
        width: 800 * p,
        height: 800 * p,
        borderRadius: "50%",
        background: color,
        opacity: 0.45 * (1 - p),
      }}
    />
  ) : null;
