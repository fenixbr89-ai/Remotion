import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bg, Line, Push, reveal } from "../components";
import { C, clamp, EASE, fontFamily, OFFER } from "../theme";

// 2 — White. "Cada milissegundo importa." + big latency number
export const Millis: React.FC = () => {
  const frame = useCurrentFrame();
  const ms = Math.round(interpolate(frame, [36, 84], [0, OFFER.latencyFar], { ...clamp, easing: EASE }));
  return (
    <AbsoluteFill>
      <Bg color={C.white} />
      <Push>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 470 }}>
          <Line start={2} size={104}>Cada milissegundo</Line>
          <Line start={12} size={104} accent>importa.</Line>
        </AbsoluteFill>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 1000 }}>
          <div
            style={{
              fontFamily,
              fontSize: 300,
              fontWeight: 600,
              letterSpacing: "-0.06em",
              color: C.hair,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
              ...reveal(frame, 30),
            }}
          >
            {ms}
            <span style={{ fontSize: 110, marginLeft: 12 }}>ms</span>
          </div>
          <div style={{ fontFamily, fontSize: 38, color: C.sub, marginTop: 30, ...reveal(frame, 44) }}>
            de latência com servidor no exterior.
          </div>
        </AbsoluteFill>
      </Push>
    </AbsoluteFill>
  );
};
