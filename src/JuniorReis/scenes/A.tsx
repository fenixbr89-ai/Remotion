import type { FC, ReactNode } from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Bolt, Dumbbell, Flag, Flame, Heart, PhoneIcon, Stopwatch, UserCheck } from "../icons";
import {
  DARK_GLASS,
  EI,
  EIO,
  LIME,
  LIME_DEEP,
  M,
  OLIVE_FRAME,
  R,
  SANS,
  SERVICE_C,
  SHADOW_DARK,
  lerp,
  lerpRect,
  tile,
  tw,
} from "../lib";
import { Box, Kinetic, NotifContent } from "../ui";

type P = { d: number };
const W = "#fff";

// ================= 1 — Anéis + "Treino concluído" =================
const RINGS = [
  { r: 269, w: 52, color: LIME, span: 315 },
  { r: 199, w: 60, color: "#ffffff", span: 261 },
  { r: 131, w: 62, color: LIME_DEEP, span: 199 },
];

export const S01: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const pillIn = tw(f, 26, 44);
  const contentO = tw(f, 32, 44) * (1 - tw(f, d - 10, d, 0, 1, EI));
  const ringsOut = tw(f, d - 6, d + 16, 0, 1, EI);
  const pct = tw(f, 10, 44, 0, 100, EIO);
  const done = tw(f, 44, 50) * (1 - tw(f, 50, 66));
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - ringsOut, scale: String(1 - ringsOut * 0.25 + done * 0.03), transformOrigin: "540px 600px" }}>
        {/* trilhos apagados ("sem resultado") */}
        {RINGS.map((ring, i) => (
          <circle key={`t${i}`} cx={540} cy={600} r={ring.r} fill="none" stroke={ring.color} strokeWidth={ring.w} opacity={0.16 * tw(f, i * 3, 10 + i * 3)} style={{ scale: String(lerp(0.85, 1, tw(f, i * 3, 14 + i * 3))), transformOrigin: "540px 600px" }} />
        ))}
        {/* anéis enchendo (a virada) */}
        {RINGS.map((ring, i) => {
          const p = tw(f, 10 + i * 3, 44 + i * 2, 0, 1, EIO);
          const C = 2 * Math.PI * ring.r;
          const len = (ring.span / 360) * C * p * (1 - tw(f, d - 8 + i * 2, d + 10 + i * 2, 0, 1, EI));
          const rot = -90 + ringsOut * 120;
          return (
            <g key={i} transform={`rotate(${rot} 540 600)`}>
              {i > 0 && len > 0.5 ? <circle cx={540} cy={600} r={ring.r} fill="none" stroke="#0b0b0b" strokeWidth={ring.w + 12} strokeLinecap="round" strokeDasharray={`${len} ${C}`} /> : null}
              {len > 0.5 ? <circle cx={540} cy={600} r={ring.r} fill="none" stroke={ring.color} strokeWidth={ring.w} strokeLinecap="round" strokeDasharray={`${len} ${C}`} style={{ filter: `drop-shadow(0 0 ${18 * done}px ${ring.color})` }} /> : null}
            </g>
          );
        })}
        <text x={540} y={600} textAnchor="middle" dominantBaseline="central" fill="#fff" style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, letterSpacing: "-0.04em" }}
          opacity={tw(f, 6, 14) * (1 - tw(f, d - 10, d))}>
          {Math.round(pct)}%
        </text>
      </svg>
      {f < d ? (
        <Box rect={R.s1Pill} layers={[{ style: DARK_GLASS, o: 1 }]} shadow={SHADOW_DARK} shine={tw(f, 38, 62)}
          style={{ opacity: pillIn, translate: `0px ${(1 - pillIn) * 160}px`, scale: String(0.88 + 0.12 * pillIn), filter: `blur(${(1 - pillIn) * 14}px)` }}>
          <NotifContent icon={<Dumbbell />} title="Treino concluído" sub="Mais um passo até o seu objetivo." o={contentO} iconO={contentO} slide={tw(f, 32, 48)} />
        </Box>
      ) : null}
      <Kinetic start={4} end={d - 10} lines={[
        { y: 1532, size: 84, color: W, segs: [{ t: "Seu objetivo merece" }] },
        { y: 1625, size: 84, color: W, segs: [{ t: "um treinamento com" }, { t: "estratégia!", serif: true }] },
      ]} />
    </AbsoluteFill>
  );
};

// ================= 2 — Pílula vira o card com a foto + selos =================
export const PhotoInner: FC<{ inset: number; radius: number; o: number; scale?: number }> = ({ inset, radius, o, scale = 1 }) =>
  o > 0.001 ? (
    <div style={{ position: "absolute", inset, borderRadius: radius, overflow: "hidden", opacity: o, background: "#0d0f0d" }}>
      <Img src={staticFile("junior-foto.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%", scale: String(scale) }} />
    </div>
  ) : null;

export const Chip: FC<{ x: number; y: number; text: string; p: number; out: number; icon?: ReactNode; light?: boolean }> = ({ x, y, text, p, out, icon, light }) => (
  <div style={{
    position: "absolute", left: x, top: y, height: 84, borderRadius: 42, padding: "0 30px 0 14px", display: "flex", alignItems: "center", gap: 16,
    ...(light ? { background: "rgba(255,255,255,0.92)", boxShadow: "0 18px 40px rgba(60,70,30,0.18)" } : { ...DARK_GLASS, boxShadow: `${DARK_GLASS.boxShadow}, 0 18px 40px rgba(0,0,0,0.5)` }),
    opacity: tw(p, 0, 0.4) * (1 - out), scale: String((0.6 + 0.4 * p) * (1 - out * 0.2)), translate: `0px ${(1 - p) * 30}px`,
    fontFamily: SANS, fontSize: 33, fontWeight: 600, color: light ? "#111" : "#fff", whiteSpace: "nowrap",
  }}>
    <div style={{ width: 56, height: 56, borderRadius: 28, background: LIME, display: "flex", alignItems: "center", justifyContent: "center", color: "#0b0b0b" }}>
      <div style={{ width: 32, height: 32 }}>{icon}</div>
    </div>
    {text}
  </div>
);

export const S02: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = tw(f, 0, M, 0, 1, EIO);
  const rect = lerpRect(R.s1Pill, R.s2Card, p);
  const out = tw(f, d - 12, d, 0, 1, EI);
  const chip = (delay: number) => spring({ frame: f - delay, fps, config: { damping: 14, stiffness: 140 } });
  return (
    <AbsoluteFill>
      {f < d ? (
        <Box rect={rect} shadow={SHADOW_DARK} shine={tw(f, 24, 50)} layers={[{ style: DARK_GLASS, o: 1 - tw(f, 2, 16) }, { style: OLIVE_FRAME, o: tw(f, 2, 16) }]}>
          <PhotoInner inset={20} radius={rect.r - 18} o={tw(f, 10, 26)} scale={lerp(1.25, 1.04, tw(f, 10, 140))} />
        </Box>
      ) : null}
      <Chip x={70} y={340} text="Educação Física" icon={<UserCheck />} p={chip(44)} out={out} />
      <Chip x={630} y={700} text="Treinador" icon={<Dumbbell />} p={chip(90)} out={out} />
      <Chip x={90} y={1030} text="Corredor de rua" icon={<Stopwatch />} p={chip(112)} out={out} />
      <Kinetic start={18} end={d - 10} lines={[
        { y: 1532, size: 84, color: W, segs: [{ t: "Olá! Sou" }, { t: "Júnior Reis,", serif: true }] },
        { y: 1625, size: 84, color: W, segs: [{ t: "profissional de Educação Física." }] },
      ]} />
    </AbsoluteFill>
  );
};

// ================= 3 — Card vira a pilha de 4 notificações =================
const N3 = [
  { icon: <Flame />, title: "Condicionamento", sub: "Mais fôlego no dia a dia." },
  { icon: <Heart />, title: "Saúde", sub: "Qualidade de vida em primeiro lugar." },
  { icon: <Bolt />, title: "Performance", sub: "Treino a treino, mais longe." },
  { icon: <Flag />, title: "Objetivos", sub: "Cada meta importa." },
];
export const notifRect = (i: number) => ({ ...R.s3Notif0, y: R.s3Notif0.y + i * 187 });

export const S03: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const p = tw(f, 0, M, 0, 1, EIO);
  const contentOut = 1 - tw(f, d - 10, d, 0, 1, EI);
  const bodyOut = tw(f, d, d + 14, 0, 1, EI);
  return (
    <AbsoluteFill>
      {N3.map((n, i) => {
        const target = notifRect(i);
        const first = i === 0;
        const A = [24, 60, 80, 110][i];
        const inP = first ? p : tw(f, A - 22, A);
        const rect = first ? lerpRect(R.s2Card, target, p) : { ...target, y: lerp(notifRect(i - 1).y, target.y, inP) };
        const cIn = first ? tw(f, 18, 32) : tw(f, A - 12, A + 2);
        return (
          <Box key={i} rect={rect} shadow={SHADOW_DARK} shine={tw(f, A - 4, A + 20)}
            style={{ opacity: (first ? 1 : tw(f, A - 22, A - 12)) * (1 - bodyOut), scale: String(1 - bodyOut * 0.06), zIndex: 10 - i }}
            layers={first ? [{ style: OLIVE_FRAME, o: 1 - tw(f, 4, 18) }, { style: DARK_GLASS, o: tw(f, 4, 18) }] : [{ style: DARK_GLASS, o: 1 }]}>
            {first ? <PhotoInner inset={lerp(20, 8, p)} radius={Math.max(rect.r - 18, 0)} o={1 - tw(f, 0, 12)} /> : null}
            <NotifContent icon={n.icon} title={n.title} sub={n.sub} o={cIn * contentOut} iconO={f < d ? (first ? tw(f, 14, 26) : tw(f, A - 16, A - 4)) : 0} slide={first ? tw(f, 18, 34) : tw(f, A - 12, A + 4)} />
          </Box>
        );
      })}
      <Kinetic start={20} end={d - 10} lines={[
        { y: 1532, size: 84, color: W, segs: [{ t: "Te ajudo a conquistar" }, { t: "saúde,", serif: true }] },
        { y: 1625, size: 84, color: W, segs: [{ t: "performance", serif: true }, { t: "e seus" }, { t: "objetivos.", serif: true }] },
      ]} />
    </AbsoluteFill>
  );
};

// ================= 4 — Ícones das notificações formam a grade de serviços =================
export const SERVICES: { label: string; icon: (c?: string) => ReactNode }[] = [
  { label: "Musculação", icon: (c) => <Dumbbell color={c} /> },
  { label: "Corrida", icon: (c) => <Stopwatch color={c} /> },
  { label: "Condicionamento", icon: (c) => <Flame color={c} /> },
  { label: "Online", icon: (c) => <PhoneIcon color={c} /> },
  { label: "Presencial", icon: (c) => <UserCheck color={c} /> },
];

export const S04: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = tw(f, d, d + 14, 0, 1, EI);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 268, textAlign: "center", fontFamily: SANS, fontSize: 31, fontWeight: 500, letterSpacing: `${lerp(0.5, 0.3, tw(f, 8, 26))}em`, color: "#9a9a9a", opacity: tw(f, 8, 20) * (1 - out) }}>
        MEUS SERVIÇOS
      </div>
      {SERVICES.map((s, i) => {
        const [cx, cy] = SERVICE_C[i];
        const fromNotif = i < 4;
        const delay = i * 3;
        const p = fromNotif ? tw(f, delay, M + delay, 0, 1, EIO) : spring({ frame: f - 14, fps, config: { damping: 13, stiffness: 140 } });
        const src = fromNotif ? { x: 138, y: notifRect(i).y + 31, w: 104, h: 104, r: 26 } : tile(cx, cy, 10, 5);
        const rect = fromNotif ? lerpRect(src, tile(cx, cy), p) : tile(cx, cy);
        const arc = fromNotif ? Math.sin(Math.PI * p) * -70 : 0;
        const isFirst = i === 0;
        const hide = isFirst && f >= d; // Musculação abre a próxima cena
        const lab = tw(f, 16 + i * 3, 28 + i * 3) * (1 - out);
        return (
          <div key={i}>
            {!hide ? (
              <div style={{
                position: "absolute", left: rect.x, top: rect.y + arc, width: rect.w, height: rect.h, borderRadius: rect.r, background: LIME,
                display: "flex", alignItems: "center", justifyContent: "center", color: "#0b0b0b",
                boxShadow: `0 0 ${40 * tw(f, 20, 40)}px rgba(212,255,79,0.35)`,
                opacity: (fromNotif ? 1 : tw(p, 0, 0.3)) * (isFirst ? 1 : 1 - out),
                scale: String((fromNotif ? 1 : Math.max(0, p)) * (isFirst ? 1 : 1 - out * 0.3)),
                rotate: `${fromNotif ? Math.sin(Math.PI * p) * (i % 2 ? 12 : -12) : 0}deg`,
              }}>
                <div style={{ width: "50%", height: "50%" }}>{s.icon()}</div>
              </div>
            ) : null}
            <div style={{ position: "absolute", left: cx - 200, width: 400, top: cy + 112, textAlign: "center", fontFamily: SANS, fontSize: 36, fontWeight: 600, color: "#fff", opacity: lab, translate: `0px ${(1 - lab) * 16}px` }}>
              {s.label}
            </div>
          </div>
        );
      })}
      <Kinetic start={4} end={d - 8} lines={[
        { y: 1532, size: 84, color: W, segs: [{ t: "Conheça meus" }] },
        { y: 1625, size: 84, color: W, segs: [{ t: "serviços", serif: true }] },
      ]} />
    </AbsoluteFill>
  );
};
