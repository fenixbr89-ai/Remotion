import React from "react";
import { useCurrentFrame } from "remotion";
import { enterStyle, pop } from "../anim";
import { C } from "../constants";
import { LineIcon } from "./Icons";

/** Check azul em degradê que "pula" (spring). */
export const Check: React.FC<{ start: number; size?: number }> = ({ start, size = 46 }) => {
  const frame = useCurrentFrame();
  const sp = pop(frame, start, 7);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: C.gradientDiag,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scale: String(Math.max(0, sp)),
        boxShadow: "0 8px 18px rgba(29,78,216,.30)",
        flexShrink: 0,
      }}
    >
      <LineIcon name="check" size={size * 0.62} color="#FFFFFF" />
    </div>
  );
};

/** Linha de lista: check + mini ícone + rótulo + valor. */
export const CheckRow: React.FC<{
  start: number;
  icon?: React.ReactNode;
  label: string;
  sub?: string;
  value: React.ReactNode;
  height?: number;
  showCheck?: boolean;
}> = ({ start, icon, label, sub, value, height = 94, showCheck = true }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        height,
        display: "flex",
        alignItems: "center",
        gap: 22,
        ...enterStyle(frame, start, { dy: 26, scaleFrom: 0.96 }),
      }}
    >
      {showCheck ? <Check start={start + 4} /> : null}
      {icon ? (
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 22,
            background: C.soft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      ) : null}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 40, fontWeight: 600, color: C.navy, letterSpacing: "-0.5px" }}>
          {label}
        </div>
        {sub ? (
          <div style={{ fontSize: 28, fontWeight: 500, color: C.gray, marginTop: 2 }}>{sub}</div>
        ) : null}
      </div>
      <div
        style={{
          fontSize: 40,
          fontWeight: 700,
          color: C.navy,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
};
