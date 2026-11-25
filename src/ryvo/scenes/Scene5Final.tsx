import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { useTheme } from "../ThemeContext";
import { Bubble, Headline, LogoMark, Reveal, useProgress } from "../components";
import { FONT } from "../theme";

const WhatsIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.3z" />
  </svg>
);

export const Scene5Final: React.FC = () => {
  const frame = useCurrentFrame();
  const T = useTheme();
  const glass = T.glass;
  const t = frame / 30;
  const ring = useProgress(0, 1.5);
  const logo = useProgress(0.2, 1.0);
  const btn = useProgress(1.3, 0.8);
  const pulse = 1 + Math.max(0, Math.sin((frame - 60) / 9)) * 0.025 * (frame > 60 ? 1 : 0);
  const shine = interpolate(frame % 75, [0, 40], [-40, 140], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: -80,
          top: 1120,
          width: 1240,
          height: 1100,
          opacity: ring * 0.95,
          transform: `scale(${0.85 + ring * 0.15}) rotate(${interpolate(frame, [0, 190], [-12, 4])}deg)`,
          filter: `blur(${(1 - ring) * 18}px)`,
        }}
      >
        <Img src={staticFile(T.ring)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <Bubble size={80} x={900} y={300} phase={1} blur={2} />
      <Bubble size={50} x={90} y={820} phase={2} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ opacity: logo, filter: `blur(${(1 - logo) * 16}px)`, transform: `scale(${0.9 + logo * 0.1})`, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 34 }}>
            <LogoMark
              height={230}
              style={{
                transform: `translateX(${(1 - logo) * -60}px) rotate(${(1 - logo) * -8}deg)`,
                filter: `drop-shadow(0 0 ${30 + Math.sin(t * 2) * 10}px rgba(117,71,232,0.55))`,
              }}
            />
          </div>
          <div style={{ fontSize: 28, letterSpacing: "0.42em", color: T.accentText, fontWeight: 500, marginTop: 10, paddingLeft: "0.42em" }}>
            ESTÚDIO CRIATIVO
          </div>
        </div>
        <div style={{ height: 60 }} />
        <Headline light={"Sua próxima ideia"} bold={"começa aqui."} delay={0.5} lightSize={104} boldSize={132} align="center" />
        <div style={{ height: 70 }} />

        <div
          style={{
            opacity: btn,
            transform: `translateY(${(1 - btn) * 30}px) scale(${pulse})`,
            filter: `blur(${(1 - btn) * 12}px)`,
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "30px 56px 30px 34px",
            borderRadius: 80,
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(90deg, #7547E8 0%, #8C5FF0 55%, #087BFF 100%)",
            boxShadow: "0 30px 60px rgba(117,71,232,0.55), inset 0 2px 0 rgba(255,255,255,0.45)",
          }}
        >
          <div style={{ width: 76, height: 76, borderRadius: 38, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <WhatsIcon size={46} />
          </div>
          <span style={{ fontSize: 46, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Vamos conversar?</span>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${shine}%`,
              width: 120,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
              transform: "skewX(-20deg)",
            }}
          />
        </div>
        <div style={{ height: 34 }} />
        <Reveal delay={1.7}>
          <div style={{ ...glass(0.15, 40), padding: "18px 36px", fontSize: 32, color: T.text, fontWeight: 500, textAlign: "center" }}>
            Solicite seu orçamento pelo <b style={{ fontWeight: 800 }}>WhatsApp</b>
          </div>
        </Reveal>
        <div style={{ height: 18 }} />
        <Reveal delay={1.9}>
          <div style={{ fontSize: 36, fontWeight: 800, color: T.text, letterSpacing: "0.02em", transform: `translateY(${Math.sin(t) * 0}px)` }}>
            (62) 99523-7527
          </div>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};
