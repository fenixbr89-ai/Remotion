import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BgDots,
  C,
  Camera,
  CLAMP,
  EASE_IN_OUT,
  Finger,
  FONT,
  Kinetic,
  prog,
  Sfx,
} from "../ui";

const CARD_W = 284;
const CARD_H = 430;
const GAP = 24;
const ROW_LEFT = (1080 - (CARD_W * 3 + GAP * 2)) / 2;
const ROW_TOP = 640;
const cx = (i: number) => ROW_LEFT + i * (CARD_W + GAP) + CARD_W / 2;

/** Posição da tela do mockup na cena seguinte — o card "Impacto" vira essa tela. */
export const SCREEN = {
  left: 194,
  top: 604,
  width: 692,
  height: 400,
  radius: 32,
};

/** Toques nos cards, na palavra certa: "clean" (8,6s), "mais" (9,1s), "impactante" (9,4s). */
export const SELECT_AT = [30, 44, 55];
const MORPH = 104;
const BRAND = ["#111111", "#0A84FF", "#FF3B30", "#34C759", "#FFCC00"];

const CardBody: React.FC<{
  readonly kind: 0 | 1 | 2;
  readonly active: number;
}> = ({ kind, active }) => {
  const frame = useCurrentFrame();
  if (kind === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "100%",
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 20,
            background: C.gray,
            scale: String(1 + active * 0.15 * Math.sin(frame / 5)),
          }}
        />
        <div
          style={{
            height: 14,
            width: `${55 + active * 25}%`,
            borderRadius: 7,
            background: "#E5E5EA",
          }}
        />
        <div
          style={{
            height: 14,
            width: "55%",
            borderRadius: 7,
            background: "#E5E5EA",
          }}
        />
      </div>
    );
  }
  if (kind === 1) {
    return (
      <svg width="100%" height="130" viewBox="0 0 220 130">
        {[0, 1, 2, 3].map((i) => {
          const x = ((frame * (3 + active * 6) + i * 60) % 260) - 40;
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
        scale: String(1 + active * 0.12 * Math.abs(Math.sin(frame / 3))),
      }}
    >
      BOOM
    </div>
  );
};

// 7,6–12s · "Do estilo clean ao mais impactante, do jeito da sua marca."
// O dedo toca cada card na palavra certa; no fim o "Impacto" vira a tela do mockup.
export const Cena05Estilos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const labels = ["Clean", "Dinâmico", "Impacto"];

  const selected =
    frame >= SELECT_AT[2]
      ? 2
      : frame >= SELECT_AT[1]
        ? 1
        : frame >= SELECT_AT[0]
          ? 0
          : -1;
  const s1 = spring({
    frame: frame - SELECT_AT[1],
    fps,
    config: { damping: 20 },
  });
  const s2 = spring({
    frame: frame - SELECT_AT[2],
    fps,
    config: { damping: 20 },
  });
  const dotIndex = s1 + s2;
  const dotIn = spring({
    frame: frame - SELECT_AT[0],
    fps,
    config: { damping: 14 },
  });
  const m = prog(frame, MORPH, 22, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <BgDots />
      <Sfx at={SELECT_AT[2] + 1} name="impact" volume={0.35} />
      <Camera
        keys={[
          { f: 0, z: 1.0 },
          { f: SELECT_AT[0], z: 1.05, x: 60 },
          { f: SELECT_AT[1], z: 1.08, x: 0 },
          { f: SELECT_AT[2], z: 1.08, x: -60 },
          { f: 80, z: 1.02, x: 0 },
          { f: MORPH, z: 1, x: 0 },
        ]}
        punches={[{ f: SELECT_AT[2], amt: 0.07 }]}
        handheld={1 - m}
      >
        <div style={{ position: "absolute", top: 360, left: 60, right: 60 }}>
          <Kinetic
            delay={0}
            stagger={3}
            outAt={MORPH - 10}
            lines={[{ text: "Escolha o estilo", size: 92 }]}
          />
        </div>

        {labels.map((label, i) => {
          const enter = spring({
            frame: frame - (2 + i * 5),
            fps,
            config: { damping: 22, stiffness: 120 },
          });
          const velocity = Math.abs(
            spring({
              frame: frame - (1 + i * 5),
              fps,
              config: { damping: 22, stiffness: 120 },
            }) - enter,
          );
          const isSel = selected === i;
          const pop = spring({
            frame: frame - SELECT_AT[i],
            fps,
            config: { damping: 11 },
          });
          const selScale = selected === -1 ? 1 : isSel ? 1 + 0.06 * pop : 0.96;
          const dark = i === 2;
          const morphing = dark ? m : 0;
          const fadeOthers = dark ? 1 : 1 - m;
          return (
            <div
              key={label}
              style={{
                position: "absolute",
                top: interpolate(morphing, [0, 1], [ROW_TOP, SCREEN.top]),
                left: interpolate(
                  morphing,
                  [0, 1],
                  [ROW_LEFT + i * (CARD_W + GAP), SCREEN.left],
                ),
                width: interpolate(morphing, [0, 1], [CARD_W, SCREEN.width]),
                height: interpolate(morphing, [0, 1], [CARD_H, SCREEN.height]),
                translate: `${(1 - enter) * 1100}px ${dark ? 0 : m * 70}px`,
                scale: String(interpolate(morphing, [0, 1], [selScale, 1])),
                rotate: `${(1 - enter) * 10}deg`,
                filter: `blur(${Math.min(18, velocity * 260) + (1 - fadeOthers) * 14}px)`,
                borderRadius: interpolate(
                  morphing,
                  [0, 1],
                  [40, SCREEN.radius],
                ),
                background: dark ? C.black : i === 1 ? C.gray : C.white,
                border: dark
                  ? "none"
                  : `2px solid ${isSel ? C.ink : "#E5E5EA"}`,
                boxShadow: dark
                  ? `0 30px 80px rgba(255,59,48,${(0.25 + 0.3 * (isSel ? 1 : 0)) * (1 - m)})`
                  : "0 24px 60px rgba(0,0,0,0.08)",
                padding: 30,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden",
                opacity: (selected === -1 || isSel ? 1 : 0.6) * fadeOthers,
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
                      "radial-gradient(closest-side, rgba(255,59,48,0.8), rgba(255,59,48,0))",
                    filter: "blur(20px)",
                    opacity: (0.6 + 0.4 * Math.sin(frame / 4)) * (1 - m),
                  }}
                />
              ) : null}
              <div
                style={{
                  position: "relative",
                  marginTop: 34,
                  opacity: 1 - morphing,
                }}
              >
                <CardBody kind={i as 0 | 1 | 2} active={isSel ? 1 : 0} />
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

        {/* "do jeito da sua marca": paleta da marca */}
        <div style={{ position: "absolute", top: 1130, left: 60, right: 60 }}>
          <Kinetic
            delay={80}
            stagger={3}
            outAt={MORPH - 4}
            lines={[
              {
                text: "do jeito da sua marca",
                size: 56,
                color: C.sub,
                weight: 500,
              },
            ]}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: 1240,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 22,
          }}
        >
          {BRAND.map((c, i) => {
            const s = spring({
              frame: frame - (88 + i * 3),
              fps,
              config: { damping: 11 },
            });
            return (
              <div
                key={c}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: c,
                  boxShadow: "0 10px 24px rgba(0,0,0,0.15)",
                  scale: String(s * (1 - prog(frame, MORPH - 4, 8))),
                }}
              />
            );
          })}
        </div>

        <Finger
          path={[
            { f: 18, x: 540, y: 1650 },
            { f: SELECT_AT[0] - 2, x: cx(0), y: 860 },
            { f: SELECT_AT[1] - 2, x: cx(1), y: 860 },
            { f: SELECT_AT[2] - 2, x: cx(2), y: 860 },
            { f: SELECT_AT[2] + 6, x: cx(2) + 10, y: 880 },
            { f: 72, x: 900, y: 1600 },
          ]}
          taps={SELECT_AT}
        />
      </Camera>
    </AbsoluteFill>
  );
};
