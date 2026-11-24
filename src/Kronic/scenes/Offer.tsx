import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Bg, Glass, ServerIcon, Words, Cam, Foreground } from "../components";
import { C, clamp, EASE_OUT, fontFamily, GRADIENT, OFFER } from "../theme";

// 7 — Black Friday price
export const Offer: React.FC = () => {
  const frame = useCurrentFrame();
  const chip = interpolate(frame, [8, 28], [0, 1], { ...clamp, easing: Easing.spring({ damping: 14 }) });
  const priceP = interpolate(frame, [84, 118], [0, 1], { ...clamp, easing: EASE_OUT });
  const price = OFFER.price * priceP;
  const [int, dec] = price.toFixed(2).split(".");
  const priceIn = interpolate(frame, [80, 100], [0, 1], { ...clamp, easing: EASE_OUT });
  const pulse = 1 + Math.max(0, Math.sin((frame - 118) / 8)) * 0.02 * (frame > 118 ? 1 : 0);

  const floaters = [
    { x: 60, y: 1250, s: 150, d: 0, blur: 2 },
    { x: 820, y: 1180, s: 190, d: 30, blur: 0 },
    { x: 700, y: 1560, s: 120, d: 60, blur: 6 },
    { x: 140, y: 560, s: 100, d: 90, blur: 10 },
  ];

  return (
    <AbsoluteFill>
      <Bg variant="dark" />
      <AbsoluteFill style={{ background: "radial-gradient(700px 600px at 50% 48%, rgba(132,104,249,0.45), transparent 70%)" }} />
      <Cam keys={[{ f: 0, x: 540, y: 520, z: 1.45, rx: -10, ry: 12 }, { f: 60, x: 540, y: 700, z: 1.12, rx: 0, ry: 0 }, { f: 80, x: 540, y: 800, z: 1.05 }, { f: 100, x: 540, y: 960, z: 1.22, rz: -2 }, { f: 140, x: 540, y: 990, z: 1.15, rz: 0 }, { f: 183, x: 540, y: 1150, z: 1.02 }]}>
        {floaters.map((f, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: f.x,
              top: f.y + Math.sin((frame + f.d) / 20) * 20,
              filter: `blur(${f.blur}px)`,
              opacity: interpolate(frame, [10 + i * 6, 30 + i * 6], [0, 0.85], clamp),
              rotate: `${Math.sin((frame + f.d) / 30) * 6}deg`,
            }}
          >
            <ServerIcon size={f.s} glow />
          </div>
        ))}

        <AbsoluteFill style={{ alignItems: "center", paddingTop: 420 }}>
          <div style={{ scale: String(chip), opacity: Math.min(1, chip * 1.5) }}>
            <div
              style={{
                fontFamily,
                padding: "18px 44px",
                borderRadius: 60,
                background: GRADIENT,
                color: "#fff",
                fontSize: 38,
                fontWeight: 800,
                letterSpacing: "0.18em",
                boxShadow: "0 20px 60px rgba(132,104,249,0.6)",
              }}
            >
              BLACK FRIDAY
            </div>
          </div>
          <Words text="VPS a partir de" start={54} size={80} weight={500} color="rgba(255,255,255,0.75)" style={{ marginTop: 70 }} />

          <div
            style={{
              fontFamily,
              marginTop: 30,
              display: "flex",
              alignItems: "flex-start",
              color: "#fff",
              opacity: priceIn,
              filter: `blur(${(1 - priceIn) * 20}px)`,
              scale: String((0.85 + 0.15 * priceIn) * pulse),
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <span style={{ fontSize: 90, fontWeight: 700, marginTop: 60, marginRight: 16 }}>R$</span>
            <span
              style={{
                fontSize: 330,
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 1,
                paddingRight: "0.06em",
                backgroundImage: "linear-gradient(180deg, #FFFFFF 30%, #C8BBFF 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {int}
            </span>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 50, marginLeft: 10 }}>
              <span style={{ fontSize: 110, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1 }}>,{dec}</span>
              <span style={{ fontSize: 46, fontWeight: 500, color: C.lavender, marginTop: 10 }}>/mês</span>
            </div>
          </div>
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", top: 1460 }}>
          <div style={{ opacity: interpolate(frame, [140, 160], [0, 1], clamp), translate: `0px ${interpolate(frame, [140, 160], [30, 0], { ...clamp, easing: EASE_OUT })}px` }}>
            <Glass dark style={{ padding: "24px 44px", borderRadius: 60, color: "#fff", fontSize: 34, fontWeight: 600 }}>
              Oferta por tempo limitado
            </Glass>
          </div>
        </AbsoluteFill>
      </Cam>
      <Foreground dark from={[-400, 1500]} to={[1500, 1100]} start={78} end={102} size={600} blur={30} />
    </AbsoluteFill>
  );
};
