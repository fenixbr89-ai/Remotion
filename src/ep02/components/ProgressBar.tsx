import React from "react";
import { useCurrentFrame } from "remotion";
import { easeInOut, enterStyle, ip } from "../anim";
import { C } from "../constants";
import { Check } from "./CheckRow";

/** Barra de progresso de 0 a 100% com contador ("Calculando" -> "Calculado"). */
export const ProgressBar: React.FC<{ start: number; end: number }> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const p = ip(frame, [start, end], [0, 1], easeInOut);
  const done = frame >= end;
  const dots = ".".repeat(1 + (Math.floor(frame / 6) % 3));
  return (
    <div style={{ ...enterStyle(frame, start - 8, { dy: 20 }) }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 32,
          fontWeight: 600,
          color: done ? C.blue : C.gray,
          marginBottom: 16,
          height: 46,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {done ? <Check start={end} size={40} /> : null}
          <span>{done ? "Calculado" : `Calculando${dots}`}</span>
        </div>
        <span style={{ fontVariantNumeric: "tabular-nums", color: C.navy, fontWeight: 700 }}>
          {Math.round(p * 100)}%
        </span>
      </div>
      <div style={{ height: 22, borderRadius: 11, background: C.soft, overflow: "hidden" }}>
        <div
          style={{
            width: `${p * 100}%`,
            height: "100%",
            borderRadius: 11,
            background: C.gradient,
            boxShadow: "0 0 18px rgba(56,189,248,.6)",
          }}
        />
      </div>
    </div>
  );
};
