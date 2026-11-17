import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { easeInOut, easeOut, enterStyle, ip } from "../anim";
import { C, FONT, NUMBERS, s, SCENES, T } from "../constants";
import { Caption } from "../components/Caption";
import { SceneShell } from "../components/SceneShell";

const L = (sec: number) => s(sec) - SCENES.s3.from;

export const Scene3Erro: React.FC = () => {
  const frame = useCurrentFrame();
  const strikeAt = L(T.s3Strike);
  const strike = ip(frame, [strikeAt, strikeAt + 12], [0, 1], easeInOut);
  const color = interpolateColors(frame, [strikeAt + 4, strikeAt + 16], [C.navy, C.strike]);
  const poisAt = L(T.s3Pois);
  const glow = ip(frame, [strikeAt, strikeAt + 12], [0, 1], easeOut);

  return (
    <SceneShell punches={[L(T.s3Number) + 4, poisAt]} exit={false}>
      <div style={{ position: "absolute", inset: 0, fontFamily: FONT.sans }}>
        <div
          style={{
            position: "absolute",
            top: 470,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            ...enterStyle(frame, L(T.s3Number), { dy: 40, scaleFrom: 0.7, blur: 22 }),
          }}
        >
          <div style={{ position: "relative", padding: "0 30px" }}>
            <div
              style={{
                fontSize: 330,
                fontWeight: 800,
                letterSpacing: "-14px",
                color,
                lineHeight: 1,
              }}
            >
              {NUMBERS.errado}
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                marginTop: -8,
                height: 26,
                width: `${strike * 100}%`,
                opacity: strike > 0 ? 1 : 0,
                borderRadius: 13,
                background: C.gradient,
                boxShadow: `0 0 ${30 * glow}px rgba(56,189,248,.55)`,
              }}
            />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 930,
            left: 0,
            right: 0,
            textAlign: "center",
            ...enterStyle(frame, poisAt, { dy: 40, scaleFrom: 0.8, damping: 10 }),
          }}
        >
          <span style={{ fontSize: 150, fontWeight: 800, color: C.navy, letterSpacing: "-5px" }}>
            Pois{" "}
          </span>
          <span
            style={{
              fontSize: 160,
              fontFamily: FONT.serif,
              fontStyle: "italic",
              fontWeight: 700,
              backgroundImage: C.gradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              paddingRight: 12,
            }}
          >
            é.
          </span>
        </div>

        <Caption
          start={L(T.s3Caption)}
          line1="Muita gente cobra isso"
          line2={[{ text: "e nem" }, { text: "sabe.", accent: true }]}
        />
      </div>
    </SceneShell>
  );
};
