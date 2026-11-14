import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, CLAMP, EASE_IN_OUT, FONT, Kinetic, prog } from "../ui";

const CARD_W = 284;
const CARD_H = 430;
const GAP = 24;
const ROW_LEFT = (1080 - (CARD_W * 3 + GAP * 2)) / 2;
const ROW_TOP = 640;

/** Posição da tela do mockup na cena 6 — o card "Impacto" vira essa tela. */
export const SCREEN = { left: 194, top: 604, width: 692, height: 400, radius: 32 };

/** Frames (locais) em que cada card fica selecionado. */
export const SELECT_AT = [80, 134, 188];
const MORPH = 214;

const CardBody: React.FC<{ readonly kind: 0 | 1 | 2 }> = ({ kind }) => {
  const frame = useCurrentFrame();
  if (kind === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
        <div style={{ width: 70, height: 70, borderRadius: 20, background: C.gray }} />
        <div style={{ height: 14, width: "80%", borderRadius: 7, background: "#E5E5EA" }} />
        <div style={{ height: 14, width: "55%", borderRadius: 7, background: "#E5E5EA" }} />
      </div>
    );
  }
  if (kind === 1) {
    return (
      <svg width="100%" height="130" viewBox="0 0 220 130">
        {[0, 1, 2, 3].map((i) => {
          const x = ((frame * 3 + i * 60) % 260) - 40;
          return (
            <rect
              key={i}
              x={x}
              y={20 + i * 26}
              width={70 + (i % 2) * 40}
              height={12}
              rx={6}
              fill={i % 2 ? "#C7C7CC" : C.ink}
            />
          );
        })}
      </svg>
    );
  }
  return (
    <div
      style={{
        width: "100%",
        height: 130,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 64,
        color: C.white,
        letterSpacing: "-0.03em",
      }}
    >
      BOOM
    </div>
  );
};

// 18–26s · Três cards deslizam lateralmente; bolinha verde percorre cada um.
// No fim, o card "Impacto" cresce e vira a tela do mockup da cena 6.
export const Cena05Estilos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const labels = ["Clean", "Dinâmico", "Impacto"];

  const selected =
    frame >= SELECT_AT[2] ? 2 : frame >= SELECT_AT[1] ? 1 : frame >= SELECT_AT[0] ? 0 : -1;
  const s1 = spring({ frame: frame - SELECT_AT[1], fps, config: { damping: 20 } });
  const s2 = spring({ frame: frame - SELECT_AT[2], fps, config: { damping: 20 } });
  const dotIndex = s1 + s2;
  const dotIn = spring({ frame: frame - SELECT_AT[0], fps, config: { damping: 14 } });
  const m = prog(frame, MORPH, 30, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <div style={{ position: "absolute", top: 360, left: 60, right: 60 }}>
        <Kinetic
          delay={4}
          stagger={4}
          outAt={MORPH - 8}
          lines={[{ text: "Escolha o estilo", size: 92 }]}
        />
      </div>

      {labels.map((label, i) => {
        const enter = spring({
          frame: frame - (2 + i * 6),
          fps,
          config: { damping: 22, stiffness: 110 },
        });
        const velocity = Math.abs(
          spring({ frame: frame - (1 + i * 6), fps, config: { damping: 22, stiffness: 110 } }) -
            enter,
        );
        const isSel = selected === i;
        const selScale = isSel ? 1.05 : selected === -1 ? 1 : 0.97;
        const dark = i === 2;
        const baseLeft = ROW_LEFT + i * (CARD_W + GAP);
        const morphing = dark ? m : 0;
        const fadeOthers = dark ? 1 : 1 - m;
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              top: interpolate(morphing, [0, 1], [ROW_TOP, SCREEN.top]),
              left: interpolate(morphing, [0, 1], [baseLeft, SCREEN.left]),
              width: interpolate(morphing, [0, 1], [CARD_W, SCREEN.width]),
              height: interpolate(morphing, [0, 1], [CARD_H, SCREEN.height]),
              translate: `${(1 - enter) * 420}px ${dark ? 0 : m * 70}px`,
              scale: String(interpolate(morphing, [0, 1], [selScale, 1])),
              filter: `blur(${Math.min(14, velocity * 120) + (1 - fadeOthers) * 14}px)`,
              borderRadius: interpolate(morphing, [0, 1], [40, SCREEN.radius]),
              background: dark ? C.black : i === 1 ? C.gray : C.white,
              border: dark ? "none" : "2px solid #E5E5EA",
              boxShadow: dark
                ? `0 30px 80px rgba(255,59,48,${0.35 * (1 - m)}), 0 0 0 1px rgba(255,59,48,${0.25 * (1 - m)})`
                : "0 24px 60px rgba(0,0,0,0.08)",
              padding: 30,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
              opacity: (selected === -1 || isSel ? 1 : 0.55) * fadeOthers,
            }}
          >
            {dark ? (
              <div
                style={{
                  position: "absolute",
                  left: -60,
                  bottom: -120,
                  width: 420,
                  height: 320,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(closest-side, rgba(255,59,48,0.75), rgba(255,59,48,0))",
                  filter: "blur(20px)",
                  opacity: (0.7 + 0.3 * Math.sin(frame / 8)) * (1 - m),
                }}
              />
            ) : null}
            <div style={{ position: "relative", marginTop: 34, opacity: 1 - morphing }}>
              <CardBody kind={i as 0 | 1 | 2} />
            </div>
            <div
              style={{
                position: "relative",
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 44,
                letterSpacing: "-0.02em",
                color: dark ? C.white : C.ink,
                opacity: 1 - morphing,
              }}
            >
              {label}
            </div>
          </div>
        );
      })}

      {/* bolinha verde de seleção */}
      <div
        style={{
          position: "absolute",
          top: ROW_TOP - 22,
          left: ROW_LEFT + CARD_W - 30 + dotIndex * (CARD_W + GAP),
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: C.green,
          border: "5px solid white",
          boxShadow: "0 8px 20px rgba(52,199,89,0.45)",
          scale: String(interpolate(dotIn, [0, 1], [0, 1], CLAMP) * (1 - m)),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="24" height="20" viewBox="0 0 24 20">
          <path
            d="M3 10L9 16L21 4"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div style={{ position: "absolute", top: 1140, left: 60, right: 60 }}>
        <Kinetic
          delay={194}
          stagger={3}
          outAt={MORPH + 4}
          lines={[{ text: "Do jeito da sua marca.", size: 50, color: C.sub, weight: 500 }]}
        />
      </div>
    </AbsoluteFill>
  );
};
