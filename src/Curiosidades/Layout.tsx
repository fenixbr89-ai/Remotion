import React, { createContext, useContext } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeBack, prog, useDur } from "./anim";
import { Bg, C, fontFamily } from "./theme";

const BgCtx = createContext<Bg>("white");
export const useBg = () => useContext(BgCtx);

const BG: Record<Bg, string> = {
  white: "radial-gradient(ellipse 90% 55% at 50% 60%, #ffffff 0%, #fffdf8 50%, #fff3ea 100%)",
  yellow: "radial-gradient(ellipse 90% 55% at 50% 60%, #fffdf2 0%, #fff4cf 55%, #ffeaa8 100%)",
  pink: "radial-gradient(ellipse 90% 55% at 50% 60%, #fff6f9 0%, #ffe1eb 55%, #ffcadb 100%)",
};

/** marker colour behind keywords depends on the background */
const MARK: Record<Bg, string> = { white: "#ffc2d6", yellow: "#ffb8cf", pink: "#ffe27a" };

export const SeriesTag: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 70,
      left: 70,
      display: "flex",
      alignItems: "center",
      gap: 14,
      fontFamily,
      fontWeight: 700,
      fontSize: 28,
      letterSpacing: 1.5,
      color: C.ink,
      opacity: 0.85,
    }}
  >
    <div style={{ width: 48, height: 48, borderRadius: 16, background: C.accent, display: "grid", placeItems: "center" }}>
      <svg viewBox="0 0 200 200" width={30} height={30}>
        <path
          d="M30 40 C30 10 70 5 100 22 C130 5 170 10 170 40 C175 90 165 130 160 150 C155 190 150 245 130 250 C115 252 112 185 100 170 C88 185 85 252 70 250 C50 245 45 190 40 150 C35 130 25 90 30 40 Z"
          transform="translate(0 -20) scale(1 0.85)"
          fill="#fff"
        />
      </svg>
    </div>
    CURIOSIDADES DE ODONTO
  </div>
);

const usePop = (delay: number) => {
  const f = useCurrentFrame();
  const p = prog(f, delay, 20, easeBack);
  const o = prog(f, delay, 10);
  return { opacity: o, scale: interpolate(p, [0, 1], [0.6, 1]) };
};

export const Chip: React.FC<{ n: number; delay?: number }> = ({ n, delay = 4 }) => (
  <div
    style={{
      ...usePop(delay),
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 30px 12px 14px",
      borderRadius: 999,
      background: "#fff",
      boxShadow: "0 10px 30px rgba(170,70,110,0.14)",
      fontFamily,
      fontWeight: 700,
      fontSize: 30,
      color: C.ink,
    }}
  >
    <span
      style={{
        width: 48,
        height: 48,
        borderRadius: 999,
        background: C.accent,
        color: "#fff",
        display: "grid",
        placeItems: "center",
        fontSize: 26,
      }}
    >
      {n}
    </span>
    CURIOSIDADE #{n}
  </div>
);

export const StepChip: React.FC<{ n: number; total?: number; delay?: number }> = ({ n, total = 6, delay = 4 }) => (
  <div
    style={{
      ...usePop(delay),
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 30px 12px 14px",
      borderRadius: 999,
      background: C.ink,
      fontFamily,
      fontWeight: 700,
      fontSize: 30,
      color: "#fff",
    }}
  >
    <span
      style={{
        width: 48,
        height: 48,
        borderRadius: 999,
        background: C.accent,
        display: "grid",
        placeItems: "center",
        fontSize: 26,
      }}
    >
      {n}
    </span>
    PASSO {n} DE {total}
  </div>
);

type Tok = { w: string; hl: boolean; tail?: string; hlNext?: boolean };
const tokenize = (line: string): Tok[] => {
  const out: Tok[] = [];
  line.split(/(\*[^*]+\*)/).forEach((part) => {
    const hl = part.startsWith("*");
    (hl ? part.slice(1, -1) : part)
      .split(" ")
      .filter(Boolean)
      .forEach((w) => {
        if (/^[.,!?:;]+$/.test(w) && out.length) out[out.length - 1].tail = w;
        else out.push({ w, hl });
      });
  });
  out.forEach((t, i) => (t.hlNext = t.hl && !!out[i + 1]?.hl));
  return out;
};

export const WORD_GAP = 4;
export const wordCount = (lines: string[]) => lines.reduce((n, l) => n + tokenize(l).length, 0);

/** Kinetic title: one word at a time, marker sweeps under *keywords*. */
export const Title: React.FC<{ lines: string[]; size?: number; delay?: number }> = ({ lines, size = 96, delay = 10 }) => {
  const bg = useBg();
  const f = useCurrentFrame();
  let k = 0;
  return (
    <div
      style={{
        fontFamily,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.1,
        letterSpacing: -2,
        textAlign: "center",
        color: C.ink,
      }}
    >
      {lines.map((line, i) => (
        <div key={i}>
          {tokenize(line).map((t, j) => {
            const d = delay + k++ * WORD_GAP;
            const p = prog(f, d, 16);
            const m = prog(f, d + 8, 16);
            return (
              <React.Fragment key={j}>
                {j > 0 ? " " : null}
                <span
                  style={{
                    display: "inline-block",
                    position: "relative",
                    opacity: p,
                    translate: `0px ${(1 - p) * 44}px`,
                    scale: interpolate(p, [0, 1], [0.9, 1]),
                    filter: `blur(${(1 - p) * 12}px)`,
                  }}
                >
                  {t.hl ? (
                    <span
                      style={{
                        position: "absolute",
                        left: -10,
                        right: t.hlNext ? -size * 0.3 : -10,
                        bottom: size * 0.05,
                        height: size * 0.45,
                        background: MARK[bg],
                        borderRadius: 14,
                        scale: `${m} 1`,
                        transformOrigin: "0% 50%",
                      }}
                    />
                  ) : null}
                  <span style={{ position: "relative" }}>{t.w}</span>
                  {t.tail}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Small: React.FC<{ children: string; style?: React.CSSProperties; delay?: number }> = ({
  children,
  style,
  delay = 40,
}) => {
  const f = useCurrentFrame();
  const box = prog(f, delay, 18);
  let k = 0;
  return (
    <div
      style={{
        fontFamily,
        fontWeight: 500,
        fontSize: 38,
        lineHeight: 1.35,
        textAlign: "center",
        color: C.ink,
        background: "rgba(255,255,255,0.92)",
        borderRadius: 34,
        padding: "22px 40px",
        boxShadow: "0 16px 40px rgba(170,70,110,0.14)",
        opacity: box,
        scale: interpolate(box, [0, 1], [0.92, 1]),
        translate: `0px ${(1 - box) * 24}px`,
        ...style,
      }}
    >
      {children.split("\n").map((line, i) => (
        <div key={i}>
          {line
            .split(" ")
            .filter(Boolean)
            .map((w, j) => {
              const p = prog(f, delay + 6 + k++ * 2.2, 12);
              return (
                <React.Fragment key={j}>
                  {j > 0 ? " " : null}
                  <span style={{ display: "inline-block", opacity: p, translate: `0px ${(1 - p) * 14}px`, filter: `blur(${(1 - p) * 6}px)` }}>
                    {w}
                  </span>
                </React.Fragment>
              );
            })}
        </div>
      ))}
    </div>
  );
};

/** Gentle camera "breath": zooms in and back so it is 1 at both ends (keeps connected cuts seamless). */
const Drift: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const dur = useDur();
  const s = 1 + 0.035 * Math.sin((Math.PI * Math.min(f, dur)) / dur);
  return <AbsoluteFill style={{ scale: s }}>{children}</AbsoluteFill>;
};

export const Scene: React.FC<{ bg: Bg; children: React.ReactNode }> = ({ bg, children }) => (
  <BgCtx.Provider value={bg}>
    <AbsoluteFill style={{ overflow: "hidden", background: BG[bg] }}>
      <Drift>{children}</Drift>
      <SeriesTag />
    </AbsoluteFill>
  </BgCtx.Provider>
);

export const Top: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 180 }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 60,
      right: 60,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 30,
    }}
  >
    {children}
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      boxSizing: "border-box",
      position: "absolute",
      background: "#fff",
      borderRadius: 36,
      boxShadow: "0 30px 60px rgba(170,70,110,0.16), 0 6px 14px rgba(170,70,110,0.1)",
      padding: "26px 34px",
      fontFamily,
      color: C.ink,
      ...style,
    }}
  >
    {children}
  </div>
);
