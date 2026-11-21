import type { FC } from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Check, Dumbbell, Heart } from "../icons";
import {
  DARK_GLASS,
  EI,
  EIO,
  INK,
  LIGHT_GLASS,
  LIME,
  M,
  OLIVE,
  R,
  SANS,
  SERVICE_C,
  SHADOW_DARK,
  SHADOW_LIGHT,
  lerp,
  lerpRect,
  tile,
  tw,
} from "../lib";
import { Box, Kinetic } from "../ui";

type P = { d: number };
const W = "#fff";

const Header: FC<{ text: string; o: number; dark?: boolean }> = ({ text, o, dark }) => (
  <div style={{ position: "absolute", left: 60, top: 54, fontFamily: SANS, fontSize: 30, fontWeight: 600, letterSpacing: `${lerp(0.5, 0.28, o)}em`, color: dark ? "#8f8f8f" : "#8A8A85", opacity: o }}>
    {text}
  </div>
);

const ServiceTitle: FC<{ d: number; dark: boolean; title: { t: string; serif?: boolean }[]; sub: string }> = ({ d, dark, title, sub }) => (
  <Kinetic start={22} end={d - 10} gap={8} lines={[
    { y: 1528, size: 100, color: dark ? W : INK, serifColor: dark ? LIME : OLIVE, segs: title },
    { y: 1628, size: 46, weight: 600, color: dark ? "#CFCFCF" : "#55554F", segs: [{ t: sub }] },
  ]} />
);

// ================= 5 — Musculação (claro) =================
const PLATES = [
  { dx: 230, w: 42, h: 236, c: "#121212", delay: 18 },
  { dx: 282, w: 34, h: 176, c: OLIVE, delay: 24 },
  { dx: 314, w: 16, h: 64, c: "#8b8b84", delay: 30 },
];

export const S05: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = tw(f, 0, M, 0, 1, EIO);
  const rect = lerpRect(tile(SERVICE_C[0][0], SERVICE_C[0][1]), R.bigCard, p);
  const cOut = 1 - tw(f, d - 10, d, 0, 1, EI);
  const head = tw(f, 18, 32) * cOut;
  const lift = f > 44 ? -46 * (1 - Math.cos((2 * Math.PI * (f - 44)) / 24)) / 2 * (1 - tw(f, 86, 92)) : 0;
  const reps = Math.round(tw(f, 44, 92, 0, 12, (t) => t));
  const chips = ["Massa muscular", "Força", "Definição"];
  return (
    <AbsoluteFill>
      {f < d ? (
        <Box rect={rect} shadow={SHADOW_LIGHT} shine={tw(f, 22, 48)} layers={[{ style: { background: LIME }, o: 1 - tw(f, 4, 18) }, { style: LIGHT_GLASS, o: tw(f, 4, 18) }]}>
          <Header text="MUSCULAÇÃO" o={head} />
          <div style={{ position: "absolute", right: 60, top: 46, textAlign: "right", fontFamily: SANS, opacity: head }}>
            <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "0.2em", color: "#8A8A85" }}>REPS</div>
            <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: "-0.04em", color: INK, lineHeight: "80px", fontVariantNumeric: "tabular-nums" }}>{reps}</div>
          </div>
          {/* sombra */}
          <div style={{ position: "absolute", left: 200, width: 480, top: 470, height: 30, borderRadius: "50%", background: "rgba(60,70,40,0.18)", filter: "blur(10px)", opacity: cOut * tw(f, 20, 34), scale: String(1 + lift / 300) }} />
          {/* barra */}
          <div style={{ position: "absolute", inset: 0, translate: `0px ${lift}px`, opacity: cOut }}>
            <div style={{ position: "absolute", left: 100, width: 680, top: 321, height: 18, borderRadius: 9, background: "#1b1b1b", scale: `${tw(f, 12, 26)} 1` }} />
            {PLATES.map((pl, i) =>
              [-1, 1].map((side) => {
                const sp = spring({ frame: f - pl.delay, fps, config: { damping: 14, stiffness: 120 } });
                const cx = 440 + side * pl.dx;
                return (
                  <div key={`${i}${side}`} style={{
                    position: "absolute", left: cx - pl.w / 2, top: 330 - pl.h / 2, width: pl.w, height: pl.h, borderRadius: pl.w / 2.6,
                    background: pl.c, boxShadow: "inset -6px 0 0 rgba(255,255,255,0.08)",
                    translate: `${side * (1 - sp) * 380}px 0px`, opacity: tw(f, pl.delay, pl.delay + 6),
                  }} />
                );
              }),
            )}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "18px 18px", padding: "0 80px" }}>
            {chips.map((c, i) => {
              const tc = [38, 64, 76][i];
              const cp = spring({ frame: f - tc, fps, config: { damping: 13, stiffness: 150 } });
              return (
                <div key={c} style={{
                  height: 84, borderRadius: 42, padding: "0 30px 0 14px", display: "flex", alignItems: "center", gap: 14, background: "#fff",
                  boxShadow: "0 12px 30px rgba(60,70,30,0.12)", fontFamily: SANS, fontSize: 33, fontWeight: 600, color: INK,
                  opacity: tw(cp, 0, 0.4) * cOut, scale: String(0.6 + 0.4 * cp),
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: 28, background: LIME, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 32, height: 32 }}><Check p={tw(f, tc + 4, tc + 14)} /></div>
                  </div>
                  {c}
                </div>
              );
            })}
          </div>
        </Box>
      ) : null}
      <ServiceTitle d={d} dark={false} title={[{ t: "Musculação", serif: true }]} sub="massa muscular, força e definição." />
    </AbsoluteFill>
  );
};

// ================= 6 — Corrida (escuro) =================
type Pt = [number, number];
const bz = (a: Pt, b: Pt, c: Pt, e: Pt, t: number): Pt => {
  const u = 1 - t;
  return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * e[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * e[1]];
};
const ROUTE: Pt[] = (() => {
  const segs: [Pt, Pt, Pt, Pt][] = [
    [[80, 400], [200, 430], [210, 250], [360, 260]],
    [[360, 260], [500, 270], [460, 110], [620, 120]],
    [[620, 120], [770, 130], [690, 370], [740, 410]],
  ];
  const pts: Pt[] = [];
  segs.forEach((s) => { for (let i = 0; i < 100; i++) pts.push(bz(s[0], s[1], s[2], s[3], i / 100)); });
  pts.push(segs[2][3]);
  return pts;
})();
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

const squeeze = (f: number) => 1 - Math.sin(Math.PI * tw(f, 0, M, 0, 1, EIO)) * 0.06;

export const S06: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cOut = 1 - tw(f, d - 10, d, 0, 1, EI);
  const head = tw(f, 16, 30) * cOut;
  const rp = tw(f, 22, 116, 0, 1, EIO);
  const n = Math.max(2, Math.round(rp * (ROUTE.length - 1)) + 1);
  const pts = ROUTE.slice(0, n);
  const [rx, ry] = pts[pts.length - 1];
  const line = pts.map((q) => q.join(",")).join(" ");
  const medal = spring({ frame: f - 68, fps, config: { damping: 11, stiffness: 130 } });
  const stat = tw(f, 26, 40) * cOut;
  const ring = ((f - 22) % 24) / 24;
  return (
    <AbsoluteFill>
      {f < d ? (
        <Box rect={R.bigCard} shadow={SHADOW_DARK} shine={tw(f, 20, 46)} style={{ scale: String(squeeze(f)) }}
          layers={[{ style: LIGHT_GLASS, o: 1 - tw(f, 0, 16) }, { style: DARK_GLASS, o: tw(f, 0, 16) }]}>
          <Header text="CORRIDA" o={head} dark />
          <div style={{
            position: "absolute", left: 40, top: 110, width: 800, height: 480, borderRadius: 36, overflow: "hidden", opacity: tw(f, 14, 26) * cOut,
            background: "#121611", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.05)",
            backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 60px), repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 60px)",
          }}>
            <svg width={800} height={480} style={{ position: "absolute", inset: 0 }}>
              <path d="M-20 180 L820 60 M120 -20 L300 500 M-20 330 L820 450 M560 -20 L520 500" stroke="rgba(255,255,255,0.07)" strokeWidth={22} fill="none" />
              <polyline points={line} fill="none" stroke={LIME} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" opacity={0.22} />
              <polyline points={line} fill="none" stroke={LIME} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={ROUTE[0][0]} cy={ROUTE[0][1]} r={14} fill="#fff" stroke={LIME} strokeWidth={6} />
              {rp > 0 ? (
                <>
                  <circle cx={rx} cy={ry} r={16 + ring * 30} fill="none" stroke={LIME} strokeWidth={3} opacity={(1 - ring) * 0.7} />
                  <circle cx={rx} cy={ry} r={15} fill={LIME} stroke="#0b0b0b" strokeWidth={4} />
                </>
              ) : null}
            </svg>
          </div>
          {[
            { l: "PACE", v: mmss(lerp(390, 310, rp)), u: "/km", x: 60 },
            { l: "DISTÂNCIA", v: lerp(0, 10, rp).toFixed(1).replace(".", ","), u: "km", x: 330 },
          ].map((s) => (
            <div key={s.l} style={{ position: "absolute", left: s.x, top: 640, fontFamily: SANS, opacity: stat, translate: `0px ${(1 - stat) * 20}px` }}>
              <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "0.2em", color: "#8f8f8f" }}>{s.l}</div>
              <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                {s.v}<span style={{ fontSize: 30, fontWeight: 500, color: "#8f8f8f", letterSpacing: 0 }}> {s.u}</span>
              </div>
            </div>
          ))}
          <div style={{ position: "absolute", left: 650, top: 610, width: 160, height: 200, opacity: tw(medal, 0, 0.3) * cOut, scale: String(Math.max(0, medal)), rotate: `${(1 - medal) * -40}deg` }}>
            <div style={{ position: "absolute", left: 38, top: 0, width: 34, height: 90, background: OLIVE, rotate: "-16deg", borderRadius: 6 }} />
            <div style={{ position: "absolute", left: 88, top: 0, width: 34, height: 90, background: "#7E9A2C", rotate: "16deg", borderRadius: 6 }} />
            <div style={{ position: "absolute", left: 10, top: 50, width: 140, height: 140, borderRadius: 70, background: LIME, boxShadow: "inset 0 0 0 8px rgba(0,0,0,0.12), 0 0 40px rgba(212,255,79,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 46, color: "#0b0b0b", letterSpacing: "-0.04em" }}>
              10K
            </div>
          </div>
        </Box>
      ) : null}
      <ServiceTitle d={d} dark title={[{ t: "Treino de" }, { t: "corrida", serif: true }]} sub="pace, resistência e performance." />
    </AbsoluteFill>
  );
};

// ================= 7 — Condicionamento (escuro) =================
const ecg = (t: number) => {
  const m = ((t % 220) + 220) % 220;
  if (m > 60 && m < 80) return -12 * Math.sin(((m - 60) / 20) * Math.PI);
  if (m >= 92 && m < 98) return -((m - 92) / 6) * 80;
  if (m >= 98 && m < 106) return -80 + ((m - 98) / 8) * 120;
  if (m >= 106 && m < 112) return 40 - ((m - 106) / 6) * 40;
  if (m > 135 && m < 165) return -18 * Math.sin(((m - 135) / 30) * Math.PI);
  return 0;
};
const BARS7 = [
  { l: "Força", v: 0.88 },
  { l: "Resistência", v: 0.76 },
  { l: "Capacidade física", v: 0.92 },
];

export const S07: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const cOut = 1 - tw(f, d - 10, d, 0, 1, EI);
  const head = tw(f, 16, 30) * cOut;
  const reveal = tw(f, 18, 46, 0, 1, EIO);
  const pts: string[] = [];
  for (let x = 0; x <= 800; x += 4) pts.push(`${x},${70 + ecg(x + f * 7)}`);
  const beat = 0.5 + 0.5 * Math.sin(f / 4.6);
  return (
    <AbsoluteFill>
      {f < d ? (
        <Box rect={R.bigCard} shadow={SHADOW_DARK} shine={tw(f, 20, 46)} style={{ scale: String(squeeze(f)) }} layers={[{ style: DARK_GLASS, o: 1 }]}>
          <Header text="CONDICIONAMENTO" o={head} dark />
          <div style={{ position: "absolute", left: 60, top: 112, width: 110, height: 110, borderRadius: 30, background: LIME, display: "flex", alignItems: "center", justifyContent: "center", color: "#0b0b0b", opacity: head, scale: String(1 + 0.05 * beat), boxShadow: `0 0 ${20 + 20 * beat}px rgba(212,255,79,0.35)` }}>
            <div style={{ width: 58, height: 58 }}><Heart /></div>
          </div>
          <div style={{ position: "absolute", left: 200, top: 112, fontFamily: SANS, opacity: head }}>
            <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "0.2em", color: "#8f8f8f" }}>FREQUÊNCIA</div>
            <div style={{ fontSize: 66, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: "76px", fontVariantNumeric: "tabular-nums" }}>
              {Math.round(tw(f, 20, 70, 96, 142))}<span style={{ fontSize: 30, fontWeight: 500, color: "#8f8f8f", letterSpacing: 0 }}> bpm</span>
            </div>
          </div>
          <svg width={800} height={140} style={{ position: "absolute", left: 40, top: 250, clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`, opacity: cOut }}>
            <polyline points={pts.join(" ")} fill="none" stroke={LIME} strokeWidth={14} opacity={0.18} strokeLinejoin="round" />
            <polyline points={pts.join(" ")} fill="none" stroke={LIME} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          {BARS7.map((b, i) => {
            const t7 = [52, 64, 92][i];
            const rowIn = tw(f, t7 - 6, t7 + 8) * cOut;
            const fill = tw(f, t7, t7 + 26, 0, 1, EIO) * (1 - tw(f, d - 14, d, 0, 1, EI));
            return (
              <div key={i} style={{ position: "absolute", left: 60, right: 60, top: 440 + i * 130, opacity: rowIn, translate: `${(1 - rowIn) * -30}px 0px` }}>
                <div style={{ position: "relative", fontFamily: SANS, fontWeight: 600, fontSize: 42, color: "#fff", lineHeight: "54px" }}>
                  {b.l}
                  <span style={{ position: "absolute", right: 0, top: 0, color: LIME, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{Math.round(b.v * 100 * fill)}%</span>
                </div>
                <div style={{ position: "relative", marginTop: 20, height: 24, borderRadius: 12, background: "#3B3B3B" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${b.v * 100 * fill}%`, borderRadius: 12, background: LIME, boxShadow: `0 0 ${20 * fill}px rgba(212,255,79,0.35)` }} />
                </div>
              </div>
            );
          })}
        </Box>
      ) : null}
      <ServiceTitle d={d} dark title={[{ t: "Condicionamento", serif: true }, { t: "físico" }]} sub="força, resistência e capacidade." />
    </AbsoluteFill>
  );
};

// ================= 8 — Consultoria online (claro, celular) =================
const EX = [
  { n: "Agachamento", s: "4 séries · 12 reps" },
  { n: "Supino reto", s: "4 séries · 10 reps" },
  { n: "Remada curvada", s: "3 séries · 12 reps" },
  { n: "Corrida leve", s: "5 km · ritmo confortável" },
];
export const PHONE_B = 16;

export const S08: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = tw(f, 0, M, 0, 1, EIO);
  const rect = lerpRect(R.bigCard, R.phone, p);
  const cOut = 1 - tw(f, d - 10, d, 0, 1, EI);
  const done = EX.filter((_, i) => f >= 34 + i * 9).length;
  const toast = spring({ frame: f - 80, fps, config: { damping: 15, stiffness: 120 } });
  return (
    <AbsoluteFill>
      {f < d ? (
        <Box rect={rect} shadow="0 50px 90px rgba(40,45,30,0.28)" layers={[{ style: DARK_GLASS, o: 1 - tw(f, 0, 14) }, { style: { background: "#141414" }, o: tw(f, 0, 14) }]}>
          <div style={{ position: "absolute", inset: PHONE_B, borderRadius: rect.r - PHONE_B, overflow: "hidden", background: "#fff", opacity: tw(f, 8, 20), fontFamily: SANS }}>
            <div style={{ position: "absolute", inset: 0, opacity: cOut }}>
              <div style={{ position: "absolute", left: 189, top: 16, width: 150, height: 42, borderRadius: 21, background: "#000" }} />
              <div style={{ position: "absolute", left: 34, top: 92, fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", color: INK, opacity: tw(f, 16, 28) }}>Treino de hoje</div>
              <div style={{ position: "absolute", left: 34, top: 144, fontSize: 24, color: "#8a8a85", opacity: tw(f, 18, 30) }}>Sexta · Semana 6</div>
              <div style={{ position: "absolute", right: 34, top: 96, width: 66, height: 66, borderRadius: 20, background: LIME, display: "flex", alignItems: "center", justifyContent: "center", opacity: tw(f, 16, 28) }}>
                <div style={{ width: 38, height: 38, color: "#0b0b0b" }}><Dumbbell /></div>
              </div>
              {EX.map((e, i) => {
                const rin = tw(f, 18 + i * 4, 30 + i * 4);
                const ck = spring({ frame: f - (34 + i * 9), fps, config: { damping: 11, stiffness: 200 } });
                return (
                  <div key={e.n} style={{ position: "absolute", left: 24, right: 24, top: 200 + i * 116, height: 100, borderRadius: 26, background: "#F2F3EC", opacity: rin, translate: `0px ${(1 - rin) * 30}px` }}>
                    <div style={{ position: "absolute", left: 26, top: 16, fontSize: 30, fontWeight: 600, color: INK }}>{e.n}</div>
                    <div style={{ position: "absolute", left: 26, top: 56, fontSize: 22, color: "#8a8a85" }}>{e.s}</div>
                    <div style={{ position: "absolute", right: 24, top: 25, width: 50, height: 50, borderRadius: 25, boxShadow: "inset 0 0 0 3px #cfd0c8" }} />
                    <div style={{ position: "absolute", right: 24, top: 25, width: 50, height: 50, borderRadius: 25, background: LIME, scale: String(Math.max(0, ck)), display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 30, height: 30 }}><Check p={tw(f, 36 + i * 9, 44 + i * 9)} /></div>
                    </div>
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: 34, right: 34, top: 690, opacity: tw(f, 30, 42) }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#8a8a85" }}>
                  <span>Progresso</span>
                  <span style={{ color: INK, fontWeight: 700 }}>{done}/4</span>
                </div>
                <div style={{ marginTop: 12, height: 14, borderRadius: 7, background: "#ECECE4" }}>
                  <div style={{ height: 14, borderRadius: 7, background: LIME, width: `${tw(f, 30, 70, 0, 1, EIO) * 100}%` }} />
                </div>
              </div>
              <div style={{ position: "absolute", left: 16, right: 16, top: 70, height: 120, borderRadius: 30, background: "#1d1f1a", boxShadow: "0 20px 40px rgba(0,0,0,0.3)", translate: `0px ${(1 - toast) * -220}px`, opacity: tw(toast, 0, 0.3) }}>
                <Img src={staticFile("avatar.jpg")} style={{ position: "absolute", left: 20, top: 22, width: 76, height: 76, borderRadius: 38, objectFit: "cover" }} />
                <div style={{ position: "absolute", left: 116, top: 24, fontSize: 28, fontWeight: 600, color: "#fff" }}>Júnior Reis</div>
                <div style={{ position: "absolute", left: 116, top: 64, fontSize: 22, color: "#b5b5b5" }}>Mandou bem! Bora pro próximo.</div>
              </div>
            </div>
          </div>
        </Box>
      ) : null}
      <ServiceTitle d={d} dark={false} title={[{ t: "Consultoria" }, { t: "online", serif: true }]} sub="treino e acompanhamento no app." />
    </AbsoluteFill>
  );
};
