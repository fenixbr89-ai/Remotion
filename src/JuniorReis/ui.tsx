import { createContext, useContext, type CSSProperties, type FC, type ReactNode } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
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

// ---------- Tipografia cinética ----------
export type TextStyle = "mask" | "beat";
export const TextStyleCtx = createContext<TextStyle>("mask");

export type Seg = { t: string; serif?: boolean; color?: string };
export type KLine = {
  y: number; // centro vertical da linha
  size: number;
  color: string;
  weight?: number;
  serifColor?: string;
  chars?: boolean; // anima letra a letra (estilo máscara)
  segs: Seg[];
};

type Unit = { key: string; text: string; style: CSSProperties; serif: boolean; size: number; kicker: boolean; line: number };

const buildUnits = (lines: KLine[], splitChars: boolean) => {
  const perLine: (Unit | " ")[][] = [];
  lines.forEach((line, li) => {
    const row: (Unit | " ")[] = [];
    const kicker = line.size < 50;
    line.segs.forEach((seg, si) => {
      const parts = seg.t.split(" ").filter((w) => w.length > 0);
      parts.forEach((w, wi) => {
        const serif = !!seg.serif;
        const style: CSSProperties = serif
          ? { fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: line.size * 1.1, letterSpacing: "-0.01em", color: seg.color ?? line.serifColor ?? LIME }
          : {
              fontFamily: SANS,
              fontWeight: line.weight ?? 800,
              fontSize: line.size,
              letterSpacing: line.weight && line.weight < 600 ? "-0.01em" : "-0.045em",
              color: seg.color ?? line.color,
            };
        const key = `${li}-${si}-${wi}`;
        if (splitChars && line.chars && !serif) {
          [...w].forEach((ch, ci) => row.push({ key: `${key}-${ci}`, text: ch, style, serif, size: line.size, kicker, line: li }));
        } else {
          row.push({ key, text: w, style, serif, size: line.size, kicker, line: li });
        }
        const last = si === line.segs.length - 1 && wi === parts.length - 1;
        if (!last && !(splitChars && line.chars && !serif)) row.push(" ");
        else if (!last) row.push(" ");
      });
    });
    perLine.push(row);
  });
  return perLine;
};

const LineBox: FC<{ line: KLine; children: ReactNode }> = ({ line, children }) => (
  <div
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
    {children}
  </div>
);

/** Palavra que sobe por trás de uma máscara (sans) ou entra com impacto (serifada) */
const MaskWord: FC<{ u: Unit; delay: number; ex: number; pop?: boolean }> = ({ u, delay, ex, pop }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = tw(f, ex, ex + 9, 0, 1, EI);
  if (u.serif || pop) {
    const p = spring({ frame: f - delay, fps, config: { damping: 9, stiffness: 190, mass: 0.6 } });
    const o = tw(f, delay, delay + 4);
    const g = tw(f, delay, delay + 20);
    const from = pop ? 1.15 : 1.9;
    return (
      <span
        style={{
          display: "inline-block",
          whiteSpace: "pre",
          opacity: o * (1 - e),
          scale: String((from + (1 - from) * p) * (1 - e * 0.25)),
          rotate: pop ? "0deg" : `${(1 - p) * -10}deg`,
          translate: `0px ${-e * 0.4 * u.size}px`,
          textShadow: u.serif ? `0 0 ${36 * (1 - g)}px rgba(212,255,79,${0.95 * (1 - g)})` : undefined,
          filter: `blur(${e * 8}px)`,
          ...u.style,
        }}
      >
        {u.text}
      </span>
    );
  }
  const p = spring({ frame: f - delay, fps, config: { damping: 12, stiffness: 210, mass: 0.6 } });
  const h = u.size * 1.4;
  const m = u.size * 0.08;
  return (
    <span style={{ display: "inline-block", whiteSpace: "pre", clipPath: `inset(-${m}px -${u.size * 0.3}px -${m}px -${u.size * 0.3}px)` }}>
      <span
        style={{
          display: "inline-block",
          whiteSpace: "pre",
          translate: `0px ${(1 - p) * h - e * h}px`,
          rotate: `${(1 - p) * 7}deg`,
          transformOrigin: "0% 100%",
          ...u.style,
        }}
      >
        {u.text}
      </span>
    </span>
  );
};

export const Kinetic: FC<{
  lines: KLine[];
  start: number;
  end: number;
  stagger?: number;
}> = ({ lines, start, end, stagger = 2.6 }) => {
  const mode = useContext(TextStyleCtx);
  const f = useCurrentFrame();
  const rows = buildUnits(lines, mode === "mask");

  if (mode === "mask") {
    let k = 0;
    return (
      <>
        {lines.map((line, li) => (
          <LineBox key={li} line={line}>
            {rows[li].map((u, i) => {
              if (u === " ") return <span key={`sp${i}`}>{" "}</span>;
              const step = line.chars ? 0.9 : stagger;
              const delay = start + k * step;
              const ex = end + Math.min(k, 10) * 0.5;
              k++;
              return <MaskWord key={u.key} u={u} delay={delay} ex={ex} />;
            })}
          </LineBox>
        ))}
      </>
    );
  }

  // ---- palavra por palavra ----
  const B = 5;
  const head = rows.flatMap((r) => r.filter((u): u is Unit => u !== " " && !u.kicker));
  const beatStart = start + (rows.some((r) => r.some((u) => u !== " " && u.kicker)) ? 6 : 0);
  const assemble = beatStart + head.length * B;
  const headLines = lines.filter((l) => l.size >= 50);
  const cy = headLines.reduce((a, l) => a + l.y, 0) / Math.max(1, headLines.length);
  const idx = Math.floor((f - beatStart) / B);
  const cur = f >= beatStart && f < assemble + 3 ? head[Math.min(idx, head.length - 1)] : null;

  let big: ReactNode = null;
  if (cur) {
    const t = f - (beatStart + Math.min(idx, head.length - 1) * B);
    const base = cur.size * (cur.serif ? 1.1 : 1) * 1.5;
    const estW = cur.text.length * base * (cur.serif ? 0.46 : 0.58);
    const size = estW > 980 ? base * (980 / estW) : base;
    const leaving = tw(f, assemble, assemble + 3);
    big = (
      <div style={{ position: "absolute", left: 0, right: 0, top: cy - size * 0.7, height: size * 1.4, lineHeight: `${size * 1.4}px`, textAlign: "center", whiteSpace: "nowrap" }}>
        <span
          style={{
            display: "inline-block",
            ...cur.style,
            fontSize: size,
            scale: String(lerp(1.45, 1, tw(t, 0, 4)) * (1 - leaving * 0.5)),
            opacity: tw(t, 0, 1.5) * (1 - leaving),
            textShadow: cur.serif ? `0 0 ${30 * (1 - tw(t, 0, 5))}px rgba(212,255,79,0.9)` : undefined,
          }}
        >
          {cur.text}
        </span>
      </div>
    );
  }

  let k = 0;
  let h = 0;
  return (
    <>
      {lines.map((line, li) => (
        <LineBox key={li} line={line}>
          {rows[li].map((u, i) => {
            if (u === " ") return <span key={`sp${i}`}>{" "}</span>;
            const ex = end + Math.min(k, 10) * 0.5;
            k++;
            if (u.kicker) return <MaskWord key={u.key} u={u} delay={start + i} ex={ex} />;
            const delay = assemble + h * 1.2;
            h++;
            return <MaskWord key={u.key} u={u} delay={delay} ex={ex} pop />;
          })}
        </LineBox>
      ))}
      {big}
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
