import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Bg, Camera, Words } from "../components";
import { C, clamp, EASE_IN_OUT, EASE_OUT } from "../theme";

// Full logo is 1827x625; icon occupies x 0..538 (29.4%), text starts at ~31.7%.
const LOGO_W = 880;
const LOGO_H = (LOGO_W * 625) / 1827;
const ICON_W = (LOGO_W * 538) / 1827;
const ICON_CENTER = (LOGO_W * 269) / 1827;
const SHIFT = LOGO_W / 2 - ICON_CENTER; // move icon to screen center

// 4 — "Conheça a Kronic Host"
export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [20, 48], [0, 1], { ...clamp, easing: Easing.spring({ damping: 12 }) });
  const slide = interpolate(frame, [42, 70], [1, 0], { ...clamp, easing: EASE_IN_OUT });
  const text = interpolate(frame, [46, 76], [0, 1], { ...clamp, easing: EASE_OUT });
  const rays = interpolate(frame, [22, 58], [0, 1], { ...clamp, easing: EASE_OUT });
  const raysFade = interpolate(frame, [50, 70], [1, 0], clamp);

  return (
    <AbsoluteFill>
      <Bg variant="light" />
      <Camera rx={[0, 0]} ry={[0, 0]} scale={[1.08, 1]}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 560 }}>
          <Words text="Conheça a" start={10} size={80} weight={500} color={C.inkSoft} />
        </AbsoluteFill>

        {/* Rays */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: raysFade }}>
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (i / 14) * Math.PI * 2;
            const r0 = 190;
            const r1 = 190 + 360 * rays;
            return (
              <line
                key={i}
                x1={540 + Math.cos(a) * r0}
                y1={960 + Math.sin(a) * r0}
                x2={540 + Math.cos(a) * r1}
                y2={960 + Math.sin(a) * r1}
                stroke={C.purple}
                strokeOpacity={0.35}
                strokeWidth={3}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Glow */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(420px 420px at 50% 50%, rgba(132,104,249,${0.35 * pop}), transparent 70%)`,
          }}
        />

        {/* Logo */}
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: LOGO_W, height: LOGO_H, translate: `${SHIFT * slide}px 0px` }}>
            <Img
              src={staticFile("logo-icon.png")}
              style={{
                position: "absolute",
                left: 0,
                top: (LOGO_H - (ICON_W * 540) / 538) / 2,
                width: ICON_W,
                scale: String(pop * (1 + 0.35 * slide)),
                opacity: Math.min(1, pop * 2),
                filter: `drop-shadow(0 20px 40px rgba(132,104,249,${0.5 * slide}))`,
              }}
            />
            <Img
              src={staticFile("logo-full.png")}
              style={{
                position: "absolute",
                inset: 0,
                width: LOGO_W,
                clipPath: `inset(0 ${(1 - text) * 68}% 0 31.5%)`,
                opacity: text,
                filter: `blur(${(1 - text) * 14}px)`,
              }}
            />
          </div>
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: "center", paddingTop: 1180 }}>
          <Words text="VPS de alta performance" start={80} size={58} weight={600} color={C.ink} stagger={2} />
          <Words text="hospedada no Brasil" start={118} size={58} weight={600} color={C.ink} accent={["Brasil"]} stagger={2} />
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};
