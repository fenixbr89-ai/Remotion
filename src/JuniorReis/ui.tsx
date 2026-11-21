import type { CSSProperties, FC, ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { EI, LIME, SANS, SERIF, lerp, tw, type Rect } from "./lib";

// ---------- Caixa que pode "morphar" entre retângulos ----------
export const Box: FC<{
  rect: Rect;
  layers?: { style: CSSProperties; o: number }[];
  shadow?: string;
  style?: CSSProperties;
  shine?: number; // 0..1 brilho varrendo
  children?: ReactNode;
}> = ({ rect, layers = [], shadow, style, shine = 0, children }) => (
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
      {shine > 0 && shine < 1 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(110deg, rgba(255,255,255,0) ${lerp(-40, 120, shine) - 18}%, rgba(255,255,255,0.28) ${lerp(-40, 120, shine)}%, rgba(255,255,255,0) ${lerp(-40, 120, shine) + 18}%)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      ) : null}
    </div>
  </div>
);

// ---------- Tipografia: linha suave ----------
export type Seg = { t: string; serif?: boolean; color?: string };
export type KLine = {
  y: number; // centro vertical da linha
  size: number;
  color: string;
  weight?: number;
  serifColor?: string;
  segs: Seg[];
};

/** Cada linha inteira sobe poucos pixels e aparece com fade. Sem quique, sem giro. */
export const Kinetic: FC<{
  lines: KLine[];
  start: number;
  end: number;
  gap?: number;
}> = ({ lines, start, end, gap = 7 }) => {
  const f = useCurrentFrame();
  return (
    <>
      {lines.map((line, li) => {
        const d0 = start + li * gap;
        const p = tw(f, d0, d0 + 20);
        const e = tw(f, end + li * 3, end + li * 3 + 12, 0, 1, EI);
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
              textAlign: "center",
              whiteSpace: "nowrap",
              opacity: p * (1 - e),
              translate: `0px ${(1 - p) * 34 - e * 20}px`,
            }}
          >
            {line.segs.map((seg, si) => (
              <span
                key={si}
                style={
                  seg.serif
                    ? { fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: line.size * 1.1, letterSpacing: "-0.01em", color: seg.color ?? line.serifColor ?? LIME }
                    : {
                        fontFamily: SANS,
                        fontWeight: line.weight ?? 800,
                        fontSize: line.size,
                        letterSpacing: line.weight && line.weight < 600 ? "-0.01em" : "-0.045em",
                        color: seg.color ?? line.color,
                      }
                }
              >
                {si > 0 ? " " : ""}
                {seg.t}
              </span>
            ))}
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
