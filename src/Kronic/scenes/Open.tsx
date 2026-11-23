import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bg, Line, Push } from "../components";
import { C, clamp, EASE } from "../theme";

// 1 — Black. "Site lento custa clientes."
export const Open: React.FC = () => {
  const frame = useCurrentFrame();
  // Thin loading line that crawls and stalls
  const load = interpolate(frame, [20, 55, 105], [0, 0.62, 0.66], { ...clamp, easing: EASE });
  const lineIn = interpolate(frame, [14, 30], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Bg color={C.black} />
      <Push>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 6 }}>
          <Line start={4} size={128} color="#F5F5F7">Site lento</Line>
          <Line start={30} size={128} color="#6E6E73">custa clientes.</Line>
          <div style={{ marginTop: 110, width: 520, height: 6, borderRadius: 3, background: "#1C1C1E", opacity: lineIn, overflow: "hidden" }}>
            <div style={{ width: `${load * 100}%`, height: "100%", borderRadius: 3, background: "#F5F5F7" }} />
          </div>
        </AbsoluteFill>
      </Push>
    </AbsoluteFill>
  );
};
