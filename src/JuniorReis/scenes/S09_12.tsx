import type { FC } from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WhatsApp } from "../icons";
import {
  DARK_GLASS,
  EI,
  EIO,
  INK,
  LIGHT_GLASS,
  LIME,
  M,
  MUTED_DARK,
  MUTED_LIGHT,
  OLIVE,
  R,
  SANS,
  SHADOW_DARK,
  SHADOW_LIGHT,
  lerp,
  lerpRect,
  tw,
} from "../lib";
import { Box, Cursor, Kinetic, NotifContent, Ripple } from "../ui";

type P = { d: number };

// ================= CENA 9 — Gráfico semanal (abre pelo "Presencial" verde) =================
const COLS = [
  { l: "S", h: 130, hi: false },
  { l: "T", h: 200, hi: false },
  { l: "Q", h: 270, hi: true },
  { l: "Q", h: 230, hi: false },
  { l: "S", h: 340, hi: true },
  { l: "S", h: 170, hi: false },
];

export const S09: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardIn = spring({ frame: f - 8, fps, config: { damping: 16, stiffness: 110 } });
  const contentOut = 1 - tw(f, d - 10, d, 0, 1, EI);
  const title = tw(f, 18, 34) * contentOut;

  return (
    <AbsoluteFill>
      {f < d ? (
        <Box
          rect={R.s9Card}
          layers={[{ style: LIGHT_GLASS, o: 1 }]}
          shadow={SHADOW_LIGHT}
          style={{ opacity: tw(f, 8, 18), scale: String(0.85 + 0.15 * cardIn), translate: `0px ${(1 - cardIn) * 90}px` }}
        >
          <div style={{ position: "absolute", left: 66, top: 60, fontFamily: SANS, fontWeight: 500, fontSize: 31, letterSpacing: `${lerp(0.5, 0.26, title)}em`, color: MUTED_LIGHT, opacity: title }}>
            PLANO INDIVIDUAL
          </div>
          <div style={{ position: "absolute", left: 66, top: 108, fontFamily: SANS, fontWeight: 800, fontSize: 62, letterSpacing: "-0.045em", color: INK, opacity: title, translate: `0px ${(1 - title) * 30}px` }}>
            Sua evolução
          </div>
          {COLS.map((c, i) => {
            const g = spring({ frame: f - (24 + i * 4), fps, config: { damping: 13, stiffness: 120 } });
            const collapse = tw(f, d - 16 + i * 1.5, d - 2 + i * 1.5, 0, 1, EI);
            const h = Math.max(0, 84 + (c.h - 84) * g * (1 - collapse));
            const cx = 108 + i * 132.8;
            return (
              <div key={i}>
                <div style={{
                  position: "absolute", left: cx - 42, top: 597 - h, width: 84, height: h, borderRadius: 42,
                  background: c.hi ? LIME : "#D6D6CF", opacity: tw(f, 22 + i * 4, 30 + i * 4) * contentOut,
                  boxShadow: c.hi ? `0 0 ${24 * g}px rgba(190,240,60,0.35)` : "none",
                }} />
                <div style={{
                  position: "absolute", left: cx - 30, width: 60, top: 622, textAlign: "center", fontFamily: SANS,
                  fontWeight: 700, fontSize: 35, color: INK, opacity: tw(f, 30 + i * 4, 40 + i * 4) * contentOut,
                }}>
                  {c.l}
                </div>
              </div>
            );
          })}
        </Box>
      ) : null}

      <Kinetic
        start={20}
        end={d - 10}
        lines={[
          { y: 1532, size: 42, weight: 500, color: MUTED_LIGHT, serifColor: OLIVE, segs: [{ t: "com planejamento" }, { t: "individualizado", serif: true }] },
          { y: 1625, size: 88, color: INK, serifColor: OLIVE, segs: [{ t: "para sua" }, { t: "evolução.", serif: true }] },
        ]}
      />
    </AbsoluteFill>
  );
};

// ================= CENA 10 — Card encolhe e abre o logo =================
export const Logo: FC<{ o?: number }> = ({ o = 1 }) => (
  <Img src={staticFile("logo.png")} style={{ width: "100%", height: "100%", objectFit: "contain", opacity: o }} />
);

export const S10: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const p = tw(f, 0, 18, 0, 1, EIO);
  const dot = lerpRect(R.s9Card, R.s10Dot, p);
  const reveal = tw(f, 12, 42, 0, 1, EIO);

  return (
    <AbsoluteFill>
      <Box
        rect={dot}
        layers={[
          { style: LIGHT_GLASS, o: 1 - tw(f, 6, 16) },
          { style: { background: OLIVE }, o: tw(f, 6, 16) },
        ]}
        shadow={SHADOW_LIGHT}
        style={{ opacity: 1 - tw(f, 14, 24), scale: String(1 + tw(f, 14, 24) * 0.6) }}
      />
      {f < d ? (
        <div style={{
          position: "absolute", left: R.s10Logo.x, top: R.s10Logo.y, width: R.s10Logo.w, height: R.s10Logo.h,
          clipPath: `circle(${reveal * 620}px at 445px 230px)`,
          scale: String(lerp(1.12, 1, reveal)), filter: `blur(${(1 - reveal) * 8}px)`,
        }}>
          <Logo />
        </div>
      ) : null}

      <Kinetic
        start={22}
        end={d - 10}
        stagger={2}
        lines={[
          { y: 1440, size: 40, weight: 500, color: MUTED_LIGHT, segs: [{ t: "Júnior Reis. Treinamento com estratégia." }] },
          { y: 1532, size: 88, color: INK, segs: [{ t: "Coloque seu corpo" }] },
          { y: 1622, size: 88, color: INK, serifColor: OLIVE, segs: [{ t: "em movimento!", serif: true }] },
        ]}
      />
    </AbsoluteFill>
  );
};

// ================= CENA 11 — Logo vira o avatar do Instagram =================
const AV = { cx: 267, cy: 597 };

export const S11: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = tw(f, 0, M, 0, 1, EIO);
  const av = lerpRect(R.s10Logo, R.s11Avatar, p);
  const cardIn = spring({ frame: f - 10, fps, config: { damping: 17, stiffness: 110 } });
  const contentOut = 1 - tw(f, d - 10, d, 0, 1, EI);
  const ring = tw(f, 18, 40, 0, 1, EIO);
  const btnIn = spring({ frame: f - 34, fps, config: { damping: 13, stiffness: 140 } });

  // cursor
  const cIn = tw(f, 44, 64, 0, 1, EIO);
  const cx = lerp(980, 705, cIn);
  const cy = lerp(1380, 935, cIn) + Math.sin(Math.PI * cIn) * 40;
  const press = tw(f, 66, 70) * (1 - tw(f, 72, 80));
  const rip = tw(f, 68, 90);

  const txt = (t: string, top: number, size: number, color: string, weight: number, delay: number) => {
    const o = tw(f, delay, delay + 14) * contentOut;
    return (
      <div style={{
        position: "absolute", left: 317, top, fontFamily: SANS, fontSize: size, fontWeight: weight, color, opacity: o,
        letterSpacing: weight >= 700 ? "-0.03em" : "0em", translate: `${(1 - o) * 24}px 0px`, lineHeight: 1.2,
      }}>
        {t}
      </div>
    );
  };

  return (
    <AbsoluteFill>
      {f < d ? (
        <Box
          rect={R.s11Card}
          layers={[{ style: DARK_GLASS, o: 1 }]}
          shadow={SHADOW_DARK}
          style={{ opacity: tw(f, 10, 22), scale: String(0.9 + 0.1 * cardIn) }}
        >
          {txt("Júnior Reis", 82, 54, "#fff", 800, 24)}
          {txt("Personal Trainer", 152, 38, "#9C9C9C", 400, 28)}
          {txt("@juniorreispersonal", 208, 35, LIME, 600, 32)}
          {[
            "Musculação, corrida e crossfit",
            "Consultoria online e presencial",
          ].map((t, i) => {
            const o = tw(f, 34 + i * 5, 50 + i * 5) * contentOut;
            return (
              <div key={t} style={{ position: "absolute", left: 63, top: 324 + i * 62, fontFamily: SANS, fontSize: 39, color: "#E6E6E6", opacity: o, translate: `0px ${(1 - o) * 20}px` }}>
                {t}
              </div>
            );
          })}
        </Box>
      ) : null}

      {/* Botão Seguir */}
      {f < d ? (
        <Box
          rect={R.s11Btn}
          layers={[{ style: { background: LIME }, o: 1 }]}
          style={{ scale: String(Math.max(0, btnIn) * (1 - press * 0.05)) }}
        >
          <Ripple x={705 - R.s11Btn.x} y={935 - R.s11Btn.y} p={rip} color="#fff" />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 600, fontSize: 47, color: "#0b0b0b", opacity: contentOut }}>
            Seguir
          </div>
        </Box>
      ) : null}

      {/* Avatar (nasce do logo) */}
      {f < d ? (
        <>
          <div style={{
            position: "absolute", left: av.x, top: av.y, width: av.w, height: av.h,
            borderRadius: `${p * 50}%`, overflow: "hidden", opacity: f > d - 10 ? contentOut : 1,
          }}>
            <div style={{ position: "absolute", inset: 0, opacity: 1 - tw(f, 8, 20) }}><Logo /></div>
            <Img src={staticFile("avatar.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: tw(f, 10, 22) }} />
          </div>
          <svg width={240} height={240} style={{ position: "absolute", left: AV.cx - 120, top: AV.cy - 120, opacity: contentOut, rotate: "-90deg" }}>
            <defs>
              <linearGradient id="avring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={LIME} />
                <stop offset="100%" stopColor="#6E8A22" />
              </linearGradient>
            </defs>
            <circle cx={120} cy={120} r={102} fill="none" stroke="url(#avring)" strokeWidth={8}
              strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 102 * ring} 1000`} />
          </svg>
        </>
      ) : null}

      {f < d && f >= 44 ? <Cursor x={cx} y={cy} press={press} o={tw(f, 44, 50)} /> : null}

      <Kinetic
        start={24}
        end={d - 10}
        lines={[
          { y: 1532, size: 40, weight: 500, color: MUTED_DARK, segs: [{ t: "Acompanhe no Instagram" }] },
          { y: 1625, size: 88, color: "#fff", chars: true, segs: [{ t: "@juniorreispersonal" }] },
        ]}
      />
    </AbsoluteFill>
  );
};

// ================= CENA 12 — Card vira a notificação do WhatsApp; botão vira CTA =================
export const S12: FC<P> = ({ d }) => {
  const f = useCurrentFrame();
  const p = tw(f, 0, M, 0, 1, EIO);
  const notif = lerpRect(R.s11Card, R.s12Notif, p);
  const btn = lerpRect(R.s11Btn, R.s12Btn, p);
  const cx = lerp(705, 610, p);
  const cy = lerp(935, 905, p);
  const press = tw(f, 56, 60) * (1 - tw(f, 62, 70));
  const rip = tw(f, 58, 82);
  const pulse = tw(f, 58, 90);
  const bio = tw(f, 30, 46);
  void d;

  return (
    <AbsoluteFill>
      <Box rect={notif} layers={[{ style: DARK_GLASS, o: 1 }]} shadow={SHADOW_DARK}>
        <NotifContent icon={<WhatsApp />} title="WhatsApp" sub="(62) 98118-8910"
          o={tw(f, 16, 30)} iconO={tw(f, 14, 26)} slide={tw(f, 16, 32)} />
      </Box>

      {/* anel de pulso no CTA após o clique */}
      {pulse > 0 && pulse < 1 ? (
        <div style={{
          position: "absolute", left: R.s12Btn.x, top: R.s12Btn.y, width: R.s12Btn.w, height: R.s12Btn.h, borderRadius: 54,
          boxShadow: `0 0 0 ${pulse * 30}px rgba(212,255,79,${0.35 * (1 - pulse)})`,
        }} />
      ) : null}

      <Box rect={btn} layers={[{ style: { background: LIME }, o: 1 }]} style={{ scale: String(1 - press * 0.05), boxShadow: `0 0 ${40 * tw(f, 20, 40)}px rgba(212,255,79,0.25)` }}>
        <Ripple x={610 - R.s12Btn.x} y={905 - R.s12Btn.y} p={rip} color="#fff" />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 600, fontSize: 47, color: "#0b0b0b", opacity: 1 - tw(f, 0, 8) }}>
          Seguir
        </div>
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS,
          fontWeight: 600, fontSize: 45, letterSpacing: "-0.01em", color: "#0b0b0b", whiteSpace: "nowrap",
          opacity: tw(f, 12, 24), translate: `0px ${(1 - tw(f, 12, 26)) * 30}px`,
        }}>
          Chamar no WhatsApp
        </div>
      </Box>

      <div style={{ position: "absolute", left: 0, right: 0, top: 986, textAlign: "center", fontFamily: SANS, fontSize: 39, color: "#A9A9A9", opacity: bio, translate: `0px ${(1 - bio) * 20}px` }}>
        ou clique no link da bio
      </div>

      <Cursor x={cx} y={cy} press={press} />

      <Kinetic
        start={22}
        end={10000}
        lines={[
          { y: 1532, size: 40, weight: 500, color: MUTED_DARK, segs: [{ t: "Entre em contato e" }] },
          { y: 1625, size: 88, color: "#fff", segs: [{ t: "comece sua" }, { t: "evolução!", serif: true }] },
        ]}
      />
    </AbsoluteFill>
  );
};
