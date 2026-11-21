import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { EIO, EO, START, pathAt, tw } from "./lib";

/**
 * Roteiro do cursor redondo.
 * s = cena (0..11), f = frame local da cena, tap = clique, down = segura e arrasta até o próximo ponto
 */
type KF = { s: number; f: number; x: number; y: number; tap?: boolean; down?: boolean };

// tempos de toque usados pelas cenas para reagir
export const T = {
  s1Notif: 50,
  s2Label: 56,
  s3A: 42,
  s3B: 62,
  s4Dot: 26,
  s4Flag: 66,
  s5Checks: [30, 38, 46],
  s6Drag: [24, 42, 60], // início de cada arraste (12 frames cada)
  s7Send: 36,
  s8Toggle: 44,
  s9Bars: [44, 56],
  s10Logo: 54,
  s11Follow: 66,
  s12Cta: 56,
};

const path4: KF[] = [0.2, 0.4, 0.6, 0.8].map((u, i) => {
  const [x, y] = pathAt(u);
  return { s: 3, f: 32 + i * 8, x, y };
});

const KFS: KF[] = [
  { s: 0, f: 30, x: 900, y: 1500 },
  { s: 0, f: T.s1Notif, x: 610, y: 1070, tap: true },
  { s: 1, f: T.s2Label, x: 560, y: 1080, tap: true },
  { s: 2, f: T.s3A, x: 600, y: 676, tap: true },
  { s: 2, f: T.s3B, x: 600, y: 868, tap: true },
  { s: 3, f: T.s4Dot, x: 170, y: 1220, tap: true },
  ...path4,
  { s: 3, f: T.s4Flag, x: 890, y: 950, tap: true },
  { s: 4, f: T.s5Checks[0], x: 903, y: 584, tap: true },
  { s: 4, f: T.s5Checks[1], x: 903, y: 750, tap: true },
  { s: 4, f: T.s5Checks[2], x: 903, y: 917, tap: true },
  { s: 5, f: T.s6Drag[0], x: 184, y: 676, down: true },
  { s: 5, f: T.s6Drag[0] + 12, x: 809, y: 676 },
  { s: 5, f: T.s6Drag[1], x: 184, y: 828, down: true },
  { s: 5, f: T.s6Drag[1] + 12, x: 705, y: 828 },
  { s: 5, f: T.s6Drag[2], x: 184, y: 980, down: true },
  { s: 5, f: T.s6Drag[2] + 12, x: 869, y: 980 },
  { s: 6, f: T.s7Send, x: 745, y: 1319, tap: true },
  { s: 7, f: T.s8Toggle, x: 668, y: 1085, tap: true },
  { s: 8, f: T.s9Bars[0], x: 474, y: 860, tap: true },
  { s: 8, f: T.s9Bars[1], x: 739, y: 820, tap: true },
  { s: 9, f: T.s10Logo, x: 560, y: 600, tap: true },
  { s: 10, f: T.s11Follow, x: 705, y: 978, tap: true },
  { s: 11, f: 22, x: 800, y: 884 },
  { s: 11, f: T.s12Cta, x: 800, y: 884, tap: true },
];
const ABS = KFS.map((k) => ({ ...k, F: START[k.s] + k.f }));

export const RoundCursor: FC = () => {
  const F = useCurrentFrame();
  const first = ABS[0];
  if (F < first.F - 16) return null;

  let i = 0;
  while (i + 1 < ABS.length && F >= ABS[i + 1].F) i++;
  const a = ABS[i];
  const b = ABS[i + 1];
  let x = a.x;
  let y = a.y;
  let press = 0;
  if (b && F >= a.F) {
    const gap = b.F - a.F;
    const dur = a.down ? gap : Math.min(gap, 16);
    const p = tw(F, b.F - dur, b.F, 0, 1, EIO);
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    x = a.x + (b.x - a.x) * p;
    y = a.y + (b.y - a.y) * p - (a.down ? 0 : Math.sin(Math.PI * p) * Math.min(60, dist * 0.12));
    if (a.down) press = tw(F, a.F - 2, a.F + 1) * (1 - tw(F, b.F, b.F + 4));
  }
  // cliques
  let ripples: { x: number; y: number; t: number }[] = [];
  ABS.forEach((k) => {
    if (k.tap) {
      press = Math.max(press, tw(F, k.F - 1, k.F + 2) * (1 - tw(F, k.F + 4, k.F + 10)));
      const t = F - k.F;
      if (t >= 0 && t < 22) ripples.push({ x: k.x, y: k.y, t });
    }
    if (k.down) {
      const t = F - k.F;
      if (t >= 0 && t < 22) ripples.push({ x: k.x, y: k.y, t });
    }
  });
  ripples = ripples.slice(-3);
  const appear = tw(F, first.F - 16, first.F, 0, 1, EO);
  if (F < first.F) {
    x = first.x;
    y = first.y + (1 - appear) * 120;
  }

  return (
    <>
      {ripples.map((r, idx) => {
        const p = tw(r.t, 0, 22, 0, 1, EO);
        const R = 20 + p * 75;
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: r.x - R,
              top: r.y - R,
              width: R * 2,
              height: R * 2,
              borderRadius: "50%",
              border: `${4 * (1 - p) + 1}px solid rgba(255,255,255,${0.9 * (1 - p)})`,
              boxShadow: `0 0 20px rgba(212,255,79,${0.6 * (1 - p)})`,
              background: `rgba(212,255,79,${0.18 * (1 - p)})`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: x - 30,
          top: y - 30,
          width: 60,
          height: 60,
          borderRadius: 30,
          background: "rgba(255,255,255,0.82)",
          border: "3px solid rgba(20,20,20,0.35)",
          boxShadow: "0 10px 24px rgba(0,0,0,0.35), inset 0 0 0 6px rgba(255,255,255,0.35)",
          backdropFilter: "blur(4px)",
          opacity: appear,
          scale: String((0.6 + 0.4 * appear) * (1 - press * 0.28)),
        }}
      />
    </>
  );
};
