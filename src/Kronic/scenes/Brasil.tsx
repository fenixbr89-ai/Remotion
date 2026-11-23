import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bg, Line, Push, reveal } from "../components";
import { ACCENT, C, clamp, EASE, fontFamily, OFFER } from "../theme";

// 4 — White. "Agora no Brasil." latency drops to near value.
export const Brasil: React.FC = () => {
  const frame = useCurrentFrame();
  const ms = Math.round(
    interpolate(frame, [34, 80], [OFFER.latencyFar, OFFER.latencyNear], { ...clamp, easing: EASE }),
  );
  return (
    <AbsoluteFill>
      <Bg color={C.white} />
      <Push>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 450 }}>
          <Line start={2} size={130}>Hospedada</Line>
          <Line start={10} size={130} accent>no Brasil.</Line>
          <Line start={22} size={44} weight={500} color={C.sub} style={{ marginTop: 40 }}>
            Mais perto dos seus clientes.
          </Line>
        </AbsoluteFill>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 1080 }}>
          <div
            style={{
              fontFamily,
              fontSize: 300,
              fontWeight: 600,
              letterSpacing: "-0.06em",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              backgroundImage: ACCENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              ...reveal(frame, 30),
            }}
          >
            {ms}
            <span style={{ fontSize: 110, marginLeft: 12 }}>ms</span>
          </div>
          <div style={{ fontFamily, fontSize: 38, color: C.sub, marginTop: 30, ...reveal(frame, 44) }}>
            de latência. Resposta instantânea.
          </div>
        </AbsoluteFill>
      </Push>
    </AbsoluteFill>
  );
};
