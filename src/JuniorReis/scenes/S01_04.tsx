import type { FC } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { ArrowUp, Dumbbell, Flag } from "../icons";
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
  SHADOW_DARK,
  lerp,
  lerpRect,
  tw,
} from "../lib";
import { Box, Kinetic, NotifContent } from "../ui";
import { T } from "../cursor";
import { bump, PATH_DOTS } from "../lib";

type P = { d: number };

// ================= CENA 1 — Anéis + "Treino concluído" =================
const RINGS = [
  { r: 269, w: 52, color: LIME, span: 315 },
  { r: 199, w: 60, color: "#ffffff", span: 261 },
  { r: 131, w: 62, color: LIME_DEEP, span: 199 },
];

export const S01: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const pillIn = tw(f, 18, 42);
  const contentO = tw(f, 28, 40) * (1 - tw(f, d - 10, d, 0, 1, EI));
  const ringsOut = tw(f, d - 6, d + 16, 0, 1, EI);

  return (
    <AbsoluteFill>
      <svg
        width={1080}
        height={1920}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - ringsOut,
          scale: String(lerp(0.86, 1, tw(f, 0, 34)) - ringsOut * 0.25),
          rotate: `${Math.sin(f / 18) * 2}deg`,
          transformOrigin: "540px 600px",
        }}
      >
        {RINGS.map((ring, i) => {
          const p = tw(f, 2 + i * 6, 44 + i * 6, 0, 1, EIO);
          const C = 2 * Math.PI * ring.r;
          const len = (ring.span / 360) * C * p * (1 - tw(f, d - 8 + i * 2, d + 10 + i * 2, 0, 1, EI));
          const rot = -90 - (1 - p) * 70 + ringsOut * 120;
          return (
            <g key={i} transform={`rotate(${rot} 540 600)`}>
              {i > 0 && len > 0.5 ? (
                <circle cx={540} cy={600} r={ring.r} fill="none" stroke="#0b0b0b" strokeWidth={ring.w + 12}
                  strokeLinecap="round" strokeDasharray={`${len} ${C}`} />
              ) : null}
              {len > 0.5 ? (
                <circle cx={540} cy={600} r={ring.r} fill="none" stroke={ring.color} strokeWidth={ring.w}
                  strokeLinecap="round" strokeDasharray={`${len} ${C}`} />
              ) : null}
            </g>
          );
        })}
      </svg>

      {f < d ? (
        <Box
          rect={R.s1Pill}
          layers={[{ style: DARK_GLASS, o: 1 }]}
          shadow={SHADOW_DARK}
          style={{
            opacity: pillIn,
            translate: `0px ${(1 - pillIn) * 160}px`,
            scale: String(0.88 + 0.12 * pillIn),
            filter: `blur(${(1 - pillIn) * 14}px)`,
          }}
          shine={tw(f, 30, 56)}
        >
          <NotifContent icon={<Dumbbell />} title="Treino concluído" sub="Mais um passo até o seu objetivo."
            o={contentO} iconO={contentO} slide={tw(f, 28, 44)} />
        </Box>
      ) : null}

      <Kinetic
        start={32}
        end={d - 10}
        lines={[
          { y: 1532, size: 84, color: "#fff", segs: [{ t: "Seu objetivo merece" }] },
          { y: 1625, size: 84, color: "#fff", segs: [{ t: "treino com" }, { t: "estratégia!", serif: true }] },
        ]}
      />
    </AbsoluteFill>
  );
};

// ================= CENA 2 — Pílula vira o card com a foto =================
export const PhotoInner: FC<{ inset: number; radius: number; o: number; scale?: number }> = ({ inset, radius, o, scale = 1 }) =>
  o > 0.001 ? (
    <div style={{ position: "absolute", inset, borderRadius: radius, overflow: "hidden", opacity: o, background: "#0d0f0d" }}>
      <Img src={staticFile("junior-foto.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%", scale: String(scale) }} />
    </div>
  ) : null;

export const S02: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const p = tw(f, 0, M, 0, 1, EIO);
  const rect = lerpRect(R.s1Pill, R.s2Card, p);
  const label = tw(f, 26, 44) * (1 - tw(f, d - 12, d, 0, 1, EI));

  return (
    <AbsoluteFill>
      {f < d ? (
        <Box
          rect={rect}
          shadow={SHADOW_DARK}
          shine={tw(f, 24, 50)}
          layers={[
            { style: DARK_GLASS, o: 1 - tw(f, 2, 16) },
            { style: OLIVE_FRAME, o: tw(f, 2, 16) },
          ]}
        >
          <PhotoInner inset={20} radius={rect.r - 18} o={tw(f, 10, 26)} scale={lerp(1.25, 1, tw(f, 10, 40))} />
          <div
            style={{
              position: "absolute",
              left: 50,
              right: 50,
              top: 764,
              height: 100,
              borderRadius: 50,
              background: "rgba(34,42,34,0.82)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 41,
              color: "#fff",
              opacity: label,
              translate: `0px ${(1 - label) * 40}px`,
              boxShadow: `0 0 ${40 * bump(f, T.s2Label)}px rgba(212,255,79,0.6)`,
            }}
          >
            Personal Trainer
          </div>
        </Box>
      ) : null}

      <Kinetic
        start={18}
        end={d - 10}
        lines={[
          { y: 1532, size: 84, color: "#fff", segs: [{ t: "Eu sou" }, { t: "Júnior Reis,", serif: true }] },
          { y: 1625, size: 84, color: "#fff", segs: [{ t: "Personal Trainer." }] },
        ]}
      />
    </AbsoluteFill>
  );
};

// ================= CENA 3 — Card vira a pilha de notificações =================
export const S03: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const p = tw(f, 0, M, 0, 1, EIO);
  const rectA = lerpRect(R.s2Card, R.s3NotifA, p);
  const exitBody = tw(f, d, d + 14, 0, 1, EI);
  const contentOut = 1 - tw(f, d - 10, d, 0, 1, EI);
  const aContent = tw(f, 16, 30) * contentOut;

  const bIn = tw(f, 12, 36);
  const rectB = { ...R.s3NotifB, y: lerp(R.s3NotifA.y, R.s3NotifB.y, bIn) };
  const ghostIn = tw(f, 20, 40);
  const ghost = { ...R.s3Ghost, y: lerp(R.s3NotifA.y + 20, R.s3Ghost.y, ghostIn) };

  return (
    <AbsoluteFill>
      {/* notificação fantasma ao fundo */}
      <Box
        rect={ghost}
        layers={[{ style: DARK_GLASS, o: 1 }]}
        style={{ opacity: ghostIn * 0.6 * (1 - exitBody), scale: String(1 - exitBody * 0.08) }}
      >
        <div style={{ position: "absolute", left: 38, top: 30, width: 104, height: 104, borderRadius: 26, background: "#7E9A2C" }} />
        <div style={{ position: "absolute", right: 38, top: 36, fontFamily: SANS, fontSize: 30, color: "#8E8E8E" }}>agora</div>
      </Box>

      {/* Notificação B — "Superar limites" (vira a pílula da cena 4) */}
      {f < d ? (
        <Box
          rect={rectB}
          layers={[{ style: DARK_GLASS, o: 1 }]}
          shadow={SHADOW_DARK}
          shine={tw(f, 34, 58)}
          style={{
            opacity: bIn,
          }}
        >
          <NotifContent icon={<ArrowUp />} title="Superar limites" sub="Vá além, treino a treino."
            o={tw(f, 24, 38) * contentOut} slide={tw(f, 24, 40)} />
        </Box>
      ) : null}

      {/* Notificação A — "Seus objetivos" (nasce do card da foto) */}
      <Box
        rect={rectA}
        shadow={SHADOW_DARK}
        style={{ opacity: 1 - exitBody, scale: String((1 - exitBody * 0.06)) }}
        shine={tw(f, 22, 46)}
        layers={[
          { style: OLIVE_FRAME, o: 1 - tw(f, 4, 18) },
          { style: DARK_GLASS, o: tw(f, 4, 18) },
        ]}
      >
        <PhotoInner inset={lerp(20, 8, p)} radius={Math.max(rectA.r - 18, 0)} o={1 - tw(f, 0, 12)} />
        <NotifContent icon={<Flag />} title="Seus objetivos" sub="Cada meta importa."
          o={aContent} iconO={f < d ? tw(f, 14, 26) : 0} slide={tw(f, 16, 32)} />
      </Box>

      <Kinetic
        start={18}
        end={d - 10}
        lines={[
          { y: 1532, size: 84, color: "#fff", segs: [{ t: "Superar" }, { t: "limites", serif: true }, { t: "e" }] },
          { y: 1625, size: 84, color: "#fff", segs: [{ t: "alcançar seus" }, { t: "objetivos.", serif: true }] },
        ]}
      />
    </AbsoluteFill>
  );
};

// ================= CENA 4 — Notificação vira a pergunta; bandeira vira o destino =================
export const S04: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const p = tw(f, 0, M, 0, 1, EIO);
  const pill = lerpRect(R.s3NotifB, R.s4Pill, p);
  const flagP = tw(f, 0, M + 4, 0, 1, EIO);
  const flag = lerpRect(R.s3FlagIcon, R.s4Flag, flagP);
  const arc = Math.sin(Math.PI * flagP) * -90;
  const out = tw(f, d, d + 14, 0, 1, EI);
  const dotIn = tw(f, 22, 36);
  const pathP = tw(f, 28, 62, 0, 1, EIO);
  const glow = tw(f, 18, 40);

  return (
    <AbsoluteFill>
      <Box
        rect={pill}
        layers={[{ style: DARK_GLASS, o: 1 }]}
        shadow={SHADOW_DARK}
        shine={tw(f, 22, 48)}
        style={{ opacity: 1 - out, scale: String(1 - out * 0.1) }}
      />
      <Kinetic
        start={12}
        end={d - 12}
        lines={[
          { y: 510, size: 100, color: "#fff", segs: [{ t: "E como a gente" }] },
          { y: 615, size: 100, color: "#fff", segs: [{ t: "chega" }, { t: "lá?", serif: true }] },
        ]}
      />

      {/* caminho pontilhado */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - tw(f, d - 4, d + 10) }}>
        {PATH_DOTS.map(([x, y], i) => {
          const k = pathP * PATH_DOTS.length - i;
          const s = Math.max(0, Math.min(1, k));
          return s > 0 ? <circle key={i} cx={x} cy={y} r={5.5 * s} fill={LIME} /> : null;
        })}
      </svg>
      {/* ponto de partida (abre a próxima cena) */}
      <div
        style={{
          position: "absolute",
          left: 170 - 52,
          top: 1220 - 52,
          width: 104,
          height: 104,
          borderRadius: 52,
          border: "4px solid rgba(110,135,40,0.55)",
          boxSizing: "border-box",
          scale: String(dotIn * (1 + tw(f, d - 4, d + 10) * 2)),
          opacity: 1 - tw(f, d + 2, d + 12),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 170 - 25,
          top: 1220 - 25,
          width: 50,
          height: 50,
          borderRadius: 25,
          background: LIME,
          scale: String(dotIn),
          boxShadow: `0 0 ${30 * dotIn}px rgba(212,255,79,0.5)`,
        }}
      />

      {/* bandeira (vem da notificação da cena 3) */}
      {f < d ? (
        <div
          style={{
            position: "absolute",
            left: flag.x,
            top: flag.y + arc,
            width: flag.w,
            height: flag.h,
            borderRadius: flag.r,
            background: LIME,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 ${(50 + 30 * bump(f, T.s4Flag) + 12 * Math.sin(f / 5)) * glow}px rgba(212,255,79,${0.55 * glow})`,
            rotate: `${Math.sin(Math.PI * flagP) * 14}deg`,
          }}
        >
          <div style={{ width: 54, height: 54, color: "#0b0b0b" }}>
            <Flag />
          </div>
        </div>
      ) : null}

      <Kinetic
        start={34}
        end={d - 10}
        lines={[
          { y: 1482, size: 84, color: "#fff", segs: [{ t: "Com um treino feito" }] },
          { y: 1578, size: 84, color: "#fff", segs: [{ t: "sob medida", serif: true }, { t: "pra você." }] },
        ]}
      />
    </AbsoluteFill>
  );
};
