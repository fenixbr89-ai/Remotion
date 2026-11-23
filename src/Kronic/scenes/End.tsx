import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Bg, Cursor, reveal } from "../components";
import { C, clamp, EASE_IN_OUT, fontFamily, OFFER } from "../theme";

// 7 — White. Logo, site, button click.
export const End: React.FC = () => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [44, 76], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const press = interpolate(frame, [78, 82, 90], [1, 0.95, 1], clamp);
  const btnY = 1120;
  return (
    <AbsoluteFill>
      <Bg color={C.white} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 700 }}>
        <Img src={staticFile("logo-full.png")} style={{ width: 720, ...reveal(frame, 0, 30) }} />
        <div style={{ fontFamily, fontSize: 42, fontWeight: 500, color: C.sub, marginTop: 44, ...reveal(frame, 12) }}>
          {OFFER.site}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", top: btnY }}>
        <div style={{ ...reveal(frame, 24), scale: String(press) }}>
          <div
            style={{
              fontFamily,
              padding: "30px 72px",
              borderRadius: 999,
              background: C.purple,
              color: "#fff",
              fontSize: 44,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Contratar agora
          </div>
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: interpolate(move, [0, 1], [1100, 600]),
          top: interpolate(move, [0, 1], [1650, btnY + 60]),
          scale: String(press),
          opacity: interpolate(frame, [42, 48], [0, 1], clamp),
        }}
      >
        <Cursor size={84} />
      </div>
    </AbsoluteFill>
  );
};
