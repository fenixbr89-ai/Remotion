import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "./anim";
import { COLORS, FONT_BODY, FONT_TITLE } from "../theme";
import { HandCursor } from "./HandCursor";

const W = 860;

/** Card estilo app: sobe, cursor clica, botão pulsa e vira "Enviado ✓" */
export const UICard: React.FC<{
  title: string;
  button: string;
  done: string;
  clickAt?: number;
}> = ({ title, button, done, clickAt = 46 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const up = spring({ frame, fps, config: { damping: 15 } });
  const clicked = frame >= clickAt;
  const press = interpolate(frame, [clickAt - 2, clickAt, clickAt + 5], [1, 0.94, 1], clamp);
  const pulse = interpolate(frame, [clickAt, clickAt + 22], [0, 1], clamp);

  const field = (label: string, value: string, d: number) => {
    const o = interpolate(frame, [d, d + 8], [0, 1], clamp);
    return (
      <div style={{ opacity: o, translate: `0px ${(1 - o) * 20}px` }}>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 30, color: COLORS.gray }}>
          {label}
        </div>
        <div
          style={{
            marginTop: 10,
            border: "3px solid #E6E6E6",
            borderRadius: 22,
            padding: "20px 26px",
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 38,
            color: COLORS.black,
          }}
        >
          {value}
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative", width: W }}>
      <div
        style={{
          translate: `0px ${(1 - up) * 1100}px`,
          width: W,
          background: "#fff",
          borderRadius: 56,
          padding: 56,
          boxSizing: "border-box",
          boxShadow: "0 40px 100px rgba(20,20,20,0.18)",
          display: "flex",
          flexDirection: "column",
          gap: 34,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: COLORS.orange }} />
          <div
            style={{
              fontFamily: FONT_TITLE,
              fontWeight: 700,
              fontSize: 70,
              color: COLORS.black,
              textTransform: "uppercase",
            }}
          >
            {title}
          </div>
        </div>
        {field("Serviço", "Pintura residencial", 12)}
        {field("Bairro", "Seu endereço", 18)}
        <div style={{ position: "relative", marginTop: 10 }}>
          {clicked ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 999,
                border: `6px solid ${COLORS.orange}`,
                scale: `${1 + 0.18 * pulse}`,
                opacity: 1 - pulse,
              }}
            />
          ) : null}
          <div
            style={{
              scale: `${press * (clicked ? 1 + 0.04 * Math.sin(pulse * Math.PI) : 1)}`,
              background: COLORS.orange,
              color: "#fff",
              borderRadius: 999,
              padding: "30px 0",
              textAlign: "center",
              fontFamily: FONT_TITLE,
              fontWeight: 700,
              fontSize: 58,
              textTransform: "uppercase",
            }}
          >
            {clicked ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 18 }}>
                {done}
                <svg width={56} height={56} viewBox="0 0 100 100">
                  <path
                    d="M18 54 L42 76 L84 28"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={14}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={100}
                    strokeDasharray={100}
                    strokeDashoffset={100 * (1 - Math.min(1, pulse * 2))}
                  />
                </svg>
              </span>
            ) : (
              button
            )}
          </div>
        </div>
      </div>
      <HandCursor fromX={W + 120} fromY={1100} toX={W * 0.62} toY={640} start={18} clickAt={clickAt} />
    </div>
  );
};
