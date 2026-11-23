import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bg, Line, Push, reveal } from "../components";
import { C, clamp, EASE, fontFamily, OFFER } from "../theme";

// 6 — Black. Black Friday price.
export const Price: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [34, 74], [0, 1], { ...clamp, easing: EASE });
  const [int, dec] = (OFFER.price * p).toFixed(2).split(".");
  return (
    <AbsoluteFill>
      <Bg color={C.black} />
      <Push>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 80 }}>
          <Line start={2} size={140} accent>Black Friday.</Line>
          <Line start={18} size={50} weight={500} color="#86868B" style={{ marginTop: 90 }}>
            VPS a partir de
          </Line>
          <div
            style={{
              fontFamily,
              color: "#F5F5F7",
              marginTop: 20,
              display: "flex",
              alignItems: "baseline",
              fontVariantNumeric: "tabular-nums",
              ...reveal(frame, 30),
            }}
          >
            <span style={{ fontSize: 80, fontWeight: 600, marginRight: 18 }}>R$</span>
            <span style={{ fontSize: 240, fontWeight: 600, letterSpacing: "-0.06em", lineHeight: 1 }}>
              {int},{dec}
            </span>
          </div>
          <Line start={46} size={46} weight={500} color="#86868B" style={{ marginTop: 20 }}>
            por mês.
          </Line>
        </AbsoluteFill>
      </Push>
    </AbsoluteFill>
  );
};
