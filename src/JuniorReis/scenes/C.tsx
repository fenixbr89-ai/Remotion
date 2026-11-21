import type { FC, ReactNode } from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ArrowRight, Calendar, Check, Flag, Repeat, Sprout, Target, TrendUp, UserCheck } from "../icons";
import {
  EI,
  EIO,
  INK,
  LIGHT_GLASS,
  LIME,
  M,
  NODES,
  OLIVE,
  OLIVE_FRAME,
  R,
  SANS,
  SHADOW_DARK,
  SHADOW_LIGHT,
  circ,
  lerp,
  lerpRect,
  tw,
} from "../lib";
import { Box, Kinetic } from "../ui";
import { Chip } from "./A";
import { PHONE_B } from "./B";

type P = { d: number };
const W = "#fff";

// ================= 9 — Personal presencial (celular vira o card com foto) =================
export const S09: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = tw(f, 0, M, 0, 1, EIO);
  const rect = lerpRect(R.phone, R.s9Card, p);
  const inset = lerp(PHONE_B, 20, p);
  const out = tw(f, d, d + 14, 0, 1, EI);
  const box = tw(f, 20, 38);
  const tg = tw(f, 28, 42, 0, 1, EIO);
  const chipOut = tw(f, d - 10, d, 0, 1, EI);
  const chip = (delay: number) => spring({ frame: f - delay, fps, config: { damping: 14, stiffness: 140 } });
  return (
    <AbsoluteFill>
      <Box rect={rect} shadow={SHADOW_DARK} shine={tw(f, 22, 48)} style={{ opacity: 1 - out, scale: String(1 - out * 0.12) }}
        layers={[{ style: { background: "#141414" }, o: 1 - tw(f, 0, 16) }, { style: OLIVE_FRAME, o: tw(f, 0, 16) }]}>
        <div style={{ position: "absolute", inset, borderRadius: rect.r - inset, overflow: "hidden", background: "#0c110c" }}>
          <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 1 - tw(f, 0, 14) }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 743, opacity: tw(f, 6, 22) }}>
            <Img src={staticFile("junior-foto.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 15%", scale: String(lerp(1.2, 1.03, tw(f, 6, 115))) }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(12,17,12,0) 62%, #0c110c 96%)" }} />
          </div>
          <div style={{ position: "absolute", left: 28, top: 714, width: 576, height: 210, borderRadius: 40, background: "#1a201a", opacity: box, translate: `0px ${(1 - box) * 60}px` }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 24, textAlign: "center", fontFamily: SANS, fontSize: 31, fontWeight: 500, letterSpacing: "0.26em", color: "#8A8A8A" }}>CONSULTORIA</div>
            <div style={{ position: "absolute", left: 26, top: 85, width: 524, height: 104, borderRadius: 52, background: "#0a0d0a" }}>
              <div style={{
                position: "absolute", top: 8, height: 88, borderRadius: 44, background: LIME, left: lerp(8, 262, tg), width: 254,
                scale: `${1 + Math.sin(Math.PI * tg) * 0.1} 1`,
                boxShadow: `0 0 ${36 * tw(f, 38, 44) * (1 - tw(f, 44, 64))}px rgba(212,255,79,0.8)`,
              }} />
              {[{ t: "Online", c: 134, a: 1 - tg }, { t: "Presencial", c: 389, a: tg }].map((o) => (
                <div key={o.t} style={{ position: "absolute", top: 8, height: 88, lineHeight: "88px", left: o.c - 130, width: 260, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 42, color: o.a > 0.5 ? "#0b0b0b" : "#f2f2f2" }}>
                  {o.t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Box>
      <Chip x={560} y={250} text="Execução correta" icon={<Check />} p={chip(70)} out={chipOut} />
      <Chip x={70} y={600} text="Acompanhamento" icon={<UserCheck />} p={chip(80)} out={chipOut} />
      <Kinetic start={22} end={d - 10} gap={8} lines={[
        { y: 1528, size: 100, color: W, segs: [{ t: "Personal" }, { t: "presencial", serif: true }] },
        { y: 1628, size: 46, weight: 600, color: "#CFCFCF", segs: [{ t: "orientação individualizada." }] },
      ]} />
    </AbsoluteFill>
  );
};

// ================= 10 — Compromisso com a evolução (claro) =================
const WEEKS = [120, 160, 150, 200, 235, 220, 290, 360];
export const S10: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardIn = spring({ frame: f - 4, fps, config: { damping: 16, stiffness: 120 } });
  const cOut = 1 - tw(f, d - 10, d, 0, 1, EI);
  const head = tw(f, 10, 22) * cOut;
  const line = tw(f, 24, 48, 0, 1, EIO);
  const pts = WEEKS.map((h, i) => [60 + i * 100 + 30, 640 - h - 34] as const);
  return (
    <AbsoluteFill>
      {f < d ? (
        <Box rect={R.s10Card} layers={[{ style: LIGHT_GLASS, o: 1 }]} shadow={SHADOW_LIGHT} shine={tw(f, 20, 46)}
          style={{ opacity: tw(f, 4, 14), scale: String(0.85 + 0.15 * cardIn), translate: `0px ${(1 - cardIn) * 90}px` }}>
          <div style={{ position: "absolute", left: 60, top: 56, fontFamily: SANS, fontSize: 30, fontWeight: 600, letterSpacing: `${lerp(0.5, 0.28, head)}em`, color: "#8A8A85", opacity: head }}>SUA EVOLUÇÃO</div>
          <div style={{ position: "absolute", left: 60, top: 100, fontFamily: SANS, fontSize: 58, fontWeight: 800, letterSpacing: "-0.045em", color: INK, opacity: head }}>Semana a semana</div>
          <div style={{ position: "absolute", right: 60, top: 52, height: 76, borderRadius: 38, padding: "0 26px 0 18px", background: LIME, display: "flex", alignItems: "center", gap: 10, fontFamily: SANS, fontSize: 40, fontWeight: 800, color: "#0b0b0b", opacity: tw(f, 18, 28) * cOut, scale: String(0.7 + 0.3 * tw(f, 18, 32)) }}>
            <div style={{ width: 36, height: 36 }}><TrendUp /></div>+{Math.round(tw(f, 20, 50, 0, 38))}%
          </div>
          {WEEKS.map((h, i) => {
            const g = spring({ frame: f - (8 + i * 3), fps, config: { damping: 14, stiffness: 120 } });
            const hh = 60 + (h - 60) * g;
            const hi = i >= 6;
            return (
              <div key={i}>
                <div style={{ position: "absolute", left: 60 + i * 100, top: 640 - hh, width: 60, height: hh, borderRadius: 30, background: hi ? LIME : "#D6D6CF", opacity: tw(f, 8 + i * 3, 16 + i * 3) * cOut, boxShadow: hi ? "0 0 24px rgba(190,240,60,0.35)" : "none" }} />
                <div style={{ position: "absolute", left: 60 + i * 100 - 10, width: 80, top: 664, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "#55554F", opacity: tw(f, 14 + i * 3, 24 + i * 3) * cOut }}>S{i + 1}</div>
              </div>
            );
          })}
          <svg width={880} height={800} style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - line) * 100}% 0 0)`, opacity: cOut }}>
            <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke={OLIVE} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
            {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill="#fff" stroke={OLIVE} strokeWidth={4} />)}
          </svg>
        </Box>
      ) : null}
      <Kinetic start={10} end={d - 10} lines={[
        { y: 1532, size: 84, color: INK, segs: [{ t: "Meu compromisso é com" }] },
        { y: 1625, size: 84, color: INK, serifColor: OLIVE, segs: [{ t: "a sua" }, { t: "evolução!", serif: true }] },
      ]} />
    </AbsoluteFill>
  );
};

// ================= 11 — Objetivo → Planejamento → Estratégia → Constância =================
const STEPS: { l: string; icon: ReactNode }[] = [
  { l: "Objetivo", icon: <Flag /> },
  { l: "Planejamento", icon: <Calendar /> },
  { l: "Estratégia", icon: <Target /> },
  { l: "Constância", icon: <Repeat /> },
];
type Pt = [number, number];
const SEG_DOTS: Pt[][] = [0, 1, 2].map((i) => {
  const [x1, y1] = NODES[i];
  const [x2, y2] = NODES[i + 1];
  const b = (t: number): Pt => {
    const u = 1 - t;
    const c1: Pt = [x1, y1 + 140];
    const c2: Pt = [x2, y2 - 140];
    return [u * u * u * x1 + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * x2, u * u * u * y1 + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * y2];
  };
  const out: Pt[] = [];
  let prev = b(0);
  let acc = 0;
  for (let k = 1; k <= 600; k++) {
    const q = b(k / 600);
    acc += Math.hypot(q[0] - prev[0], q[1] - prev[1]);
    prev = q;
    if (acc >= 28) {
      acc = 0;
      if (Math.hypot(q[0] - x1, q[1] - y1) > 70 && Math.hypot(q[0] - x2, q[1] - y2) > 70) out.push(q);
    }
  }
  return out;
});
const NODE_T = [0, 34, 60, 86];

export const S11: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = tw(f, d, d + 14, 0, 1, EI);
  const lOut = 1 - tw(f, d - 10, d, 0, 1, EI);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - tw(f, d - 6, d + 8) }}>
        {SEG_DOTS.map((dots, si) => {
          const sp = tw(f, NODE_T[si + 1] - 16, NODE_T[si + 1], 0, 1, EIO);
          return dots.map(([x, y], k) => {
            const s = Math.max(0, Math.min(1, sp * dots.length - k));
            return s > 0 ? <circle key={`${si}-${k}`} cx={x} cy={y} r={6 * s} fill={LIME} /> : null;
          });
        })}
      </svg>
      {STEPS.map((st, i) => {
        const [cx, cy] = NODES[i];
        const first = i === 0;
        const last = i === STEPS.length - 1;
        const pop = first ? 1 : spring({ frame: f - NODE_T[i], fps, config: { damping: 12, stiffness: 160 } });
        const mp = tw(f, 0, M, 0, 1, EIO);
        const rect = first ? lerpRect(R.s10Card, circ(cx, cy, 108), mp) : circ(cx, cy, 108);
        const left = cx < 540;
        const lab = tw(f, NODE_T[i] + (first ? 22 : 6), NODE_T[i] + (first ? 36 : 20)) * lOut;
        const hide = last && f >= d;
        return (
          <div key={i}>
            {!hide ? (
              <Box rect={rect} layers={first ? [{ style: LIGHT_GLASS, o: 1 - tw(f, 4, 18) }, { style: { background: LIME }, o: tw(f, 4, 18) }] : [{ style: { background: LIME }, o: 1 }]}
                style={{ scale: String(Math.max(0, pop) * (last ? 1 : 1 - out * 0.4)), opacity: (first ? 1 : tw(pop, 0, 0.3)) * (last ? 1 : 1 - out), boxShadow: `0 0 ${40 * tw(f, NODE_T[i] + 6, NODE_T[i] + 20)}px rgba(212,255,79,0.45)` }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#0b0b0b", opacity: first ? tw(f, 14, 24) : 1 }}>
                  <div style={{ width: 54, height: 54 }}>{st.icon}</div>
                </div>
              </Box>
            ) : null}
            <div style={{
              position: "absolute", top: cy - 66, fontFamily: SANS, textAlign: left ? "left" : "right",
              ...(left ? { left: cx + 76 } : { right: 1080 - cx + 76 }),
              padding: "14px 30px", borderRadius: 34, background: "rgba(22,24,18,0.92)", boxShadow: "inset 0 0 0 2px rgba(170,190,100,0.22), 0 16px 30px rgba(0,0,0,0.45)",
              opacity: lab, translate: `${(1 - lab) * (left ? -24 : 24)}px 0px`,
            }}>
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "0.2em", color: LIME }}>0{i + 1}</div>
              <div style={{ fontSize: 50, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: "62px" }}>{st.l}</div>
            </div>
          </div>
        );
      })}
      <Kinetic start={24} end={d - 10} lines={[
        { y: 1532, size: 84, color: W, segs: [{ t: "Seu objetivo vira" }, { t: "planejamento,", serif: true }] },
        { y: 1625, size: 84, color: W, segs: [{ t: "estratégia", serif: true }, { t: "e" }, { t: "constância.", serif: true }] },
      ]} />
    </AbsoluteFill>
  );
};

// ================= 12 — Começando agora ou evoluindo? (claro) =================
const CARDS12 = [
  { t: "Começando agora", s: "Do primeiro treino à rotina.", icon: <Sprout />, ck: 28 },
  { t: "Melhorando o desempenho", s: "Mais força, pace e resultado.", icon: <TrendUp />, ck: 58 },
];
export const S12: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = tw(f, 0, M, 0, 1, EIO);
  const cOut = 1 - tw(f, d - 10, d, 0, 1, EI);
  const out = tw(f, d, d + 14, 0, 1, EI);
  const pill = spring({ frame: f - 74, fps, config: { damping: 13, stiffness: 140 } });
  return (
    <AbsoluteFill>
      {CARDS12.map((c, i) => {
        const first = i === 0;
        const target = first ? R.s12Card1 : R.s12Card2;
        const inP = tw(f, 34, 54, 0, 1, EIO);
        const rect = first ? lerpRect(circ(NODES[3][0], NODES[3][1], 108), target, p) : { ...target, y: lerp(target.y + 260, target.y, inP) };
        const ck = spring({ frame: f - c.ck, fps, config: { damping: 11, stiffness: 200 } });
        const cin = (first ? tw(f, 18, 32) : tw(f, 40, 54)) * cOut;
        if (!first && f >= d) return null; // card 2 abre a cena do Instagram
        return (
          <Box key={i} rect={rect} shadow={SHADOW_LIGHT} shine={first ? tw(f, 24, 50) : tw(f, 50, 76)}
            layers={first ? [{ style: { background: LIME }, o: 1 - tw(f, 4, 18) }, { style: LIGHT_GLASS, o: tw(f, 4, 18) }] : [{ style: LIGHT_GLASS, o: 1 }]}
            style={{ opacity: (first ? 1 : inP) * (first ? 1 - out : 1), scale: String(first ? 1 - out * 0.08 : 1) }}>
            <div style={{ position: "absolute", left: 50, top: 60, width: 120, height: 120, borderRadius: 34, background: LIME, display: "flex", alignItems: "center", justifyContent: "center", color: "#0b0b0b", opacity: cin }}>
              <div style={{ width: 62, height: 62 }}>{c.icon}</div>
            </div>
            <div style={{ position: "absolute", left: 200, top: 64, fontFamily: SANS, fontSize: 44, fontWeight: 800, letterSpacing: "-0.04em", color: INK, opacity: cin, translate: `${(1 - cin) * -20}px 0px` }}>{c.t}</div>
            <div style={{ position: "absolute", left: 200, top: 124, fontFamily: SANS, fontSize: 30, color: "#77776F", opacity: cin, translate: `${(1 - cin) * -20}px 0px` }}>{c.s}</div>
            <div style={{ position: "absolute", right: 50, top: 89, width: 62, height: 62, borderRadius: 31, background: LIME, scale: String(Math.max(0, ck) * cOut), display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px rgba(160,210,40,0.5)" }}>
              <div style={{ width: 36, height: 36 }}><Check p={tw(f, c.ck + 2, c.ck + 12)} /></div>
            </div>
          </Box>
        );
      })}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 1010, display: "flex", justifyContent: "center",
        opacity: tw(pill, 0, 0.3) * (1 - out), scale: String(Math.max(0, pill)),
      }}>
        <div style={{ height: 96, borderRadius: 48, padding: "0 40px", background: "#111", display: "flex", alignItems: "center", gap: 16, fontFamily: SANS, fontSize: 38, fontWeight: 600, color: LIME, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
          Plano feito pra você
          <div style={{ width: 40, height: 40 }}><ArrowRight /></div>
        </div>
      </div>
      <Kinetic start={22} end={d - 10} lines={[
        { y: 1532, size: 84, color: INK, segs: [{ t: "Começando agora ou evoluindo?" }] },
        { y: 1625, size: 84, color: INK, serifColor: OLIVE, segs: [{ t: "Existe um" }, { t: "caminho", serif: true }, { t: "pra você!" }] },
      ]} />
    </AbsoluteFill>
  );
};
