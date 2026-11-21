import type { FC } from "react";
import { useCurrentFrame } from "remotion";
import { EIO, EO, START, tw } from "./lib";

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

const KFS: KF[] = [
  { s: 10, f: 46, x: 960, y: 1360 },
  { s: 10, f: T.s11Follow, x: 705, y: 978, tap: true },
];
const ABS = KFS.map((k) => ({ ...k, F: START[k.s] + k.f }));

export const RoundCursor: FC = () => {
  const F = useCurrentFrame();
  const first = ABS[0];
  const last = ABS[ABS.length - 1];
  if (F < first.F - 16 || F > last.F + 30) return null;
  const vanish = 1 - tw(F, last.F + 14, last.F + 26);

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
          opacity: appear * vanish,
          scale: String((0.6 + 0.4 * appear) * (1 - press * 0.28)),
        }}
      />
    </>
  );
};
