import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Bg, Camera, Cursor, Words } from "../components";
import { C, clamp, EASE_IN_OUT, EASE_OUT, fontFamily, GRADIENT, OFFER } from "../theme";

// 8 — Logo + site + button click
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = interpolate(frame, [0, 26], [0, 1], { ...clamp, easing: EASE_OUT });
  const btn = interpolate(frame, [50, 70], [0, 1], { ...clamp, easing: EASE_OUT });
  const move = interpolate(frame, [62, 92], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const press = interpolate(frame, [96, 100, 108], [1, 0.92, 1], clamp);
  const ripple = interpolate(frame, [98, 124], [0, 1], { ...clamp, easing: EASE_OUT });

  const btnY = 1180;
  return (
    <AbsoluteFill>
      <Bg variant="light" />
      <Camera rx={[0, 0]} ry={[0, 0]} scale={[1.06, 1]}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 640 }}>
          <Img
            src={staticFile("logo-full.png")}
            style={{
              width: 800,
              opacity: logo,
              filter: `blur(${(1 - logo) * 18}px)`,
              scale: String(0.9 + 0.1 * logo),
            }}
          />
          <Words text={OFFER.site} start={26} size={50} weight={600} color={C.inkSoft} stagger={0} style={{ marginTop: 40, letterSpacing: "-0.02em" }} />
        </AbsoluteFill>

        {/* Button + ripple */}
        <AbsoluteFill style={{ alignItems: "center", top: btnY }}>
          <div style={{ position: "relative", opacity: btn, translate: `0px ${(1 - btn) * 60}px`, scale: String(press) }}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 700,
                height: 700,
                marginLeft: -350,
                marginTop: -350,
                borderRadius: 350,
                border: `4px solid ${C.purple}`,
                opacity: (1 - ripple) * (ripple > 0 ? 0.8 : 0),
                scale: String(0.2 + ripple),
              }}
            />
            <div
              style={{
                fontFamily,
                padding: "40px 90px",
                borderRadius: 80,
                background: GRADIENT,
                color: "#fff",
                fontSize: 52,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                boxShadow: "0 30px 70px rgba(90,59,232,0.45), inset 0 2px 0 rgba(255,255,255,0.4)",
              }}
            >
              Contrate sua VPS
            </div>
          </div>
        </AbsoluteFill>

        {/* Cursor */}
        <div
          style={{
            position: "absolute",
            left: interpolate(move, [0, 1], [1100, 600]),
            top: interpolate(move, [0, 1], [1700, btnY + 70]),
            scale: String(press),
            opacity: interpolate(frame, [60, 66], [0, 1], clamp),
          }}
        >
          <Cursor size={100} />
        </div>
      </Camera>
    </AbsoluteFill>
  );
};
