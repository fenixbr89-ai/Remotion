import React from "react";
import { useCurrentFrame } from "remotion";
import { easeOut, ip } from "../anim";

/**
 * Número estilo slot machine: cada dígito numa coluna que gira até o valor
 * final, com stagger entre colunas. Caracteres não numéricos ficam fixos.
 */
export const SlotNumber: React.FC<{
  value: string;
  start: number;
  fontSize: number;
  color?: string;
  weight?: number;
  duration?: number; // frames de giro da 1ª coluna
  stagger?: number;
  spins?: number;
  style?: React.CSSProperties;
}> = ({
  value,
  start,
  fontSize,
  color = "#0B1F4D",
  weight = 800,
  duration = 22,
  stagger = 3,
  spins = 2,
  style,
}) => {
  const frame = useCurrentFrame();
  const h = fontSize * 1.15;
  let digitIndex = 0;
  const appear = ip(frame, [start - 2, start + 6], [0, 1], easeOut);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "flex-start",
        height: h,
        overflow: "hidden",
        fontSize,
        fontWeight: weight,
        color,
        lineHeight: `${h}px`,
        letterSpacing: "-1px",
        fontVariantNumeric: "tabular-nums",
        opacity: appear,
        WebkitMaskImage:
          "linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
        maskImage:
          "linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
        ...style,
      }}
    >
      {value.split("").map((ch, i) => {
        if (!/[0-9]/.test(ch)) {
          return (
            <span key={i} style={{ whiteSpace: "pre" }}>
              {ch}
            </span>
          );
        }
        const d = Number(ch);
        const idx = digitIndex++;
        const s0 = start + idx * stagger;
        const total = spins * 10 + d;
        const p = ip(frame, [s0, s0 + duration + idx * 2], [0, 1], easeOut);
        const y = -p * total * h;
        const moving = p > 0 && p < 1;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: "0.62em",
              textAlign: "center",
              height: h,
              overflow: "visible",
            }}
          >
            <span
              style={{
                display: "flex",
                flexDirection: "column",
                translate: `0px ${y}px`,
                filter: moving ? `blur(${(1 - p) * 3}px)` : undefined,
              }}
            >
              {Array.from({ length: total + 1 }, (_, k) => (
                <span key={k} style={{ height: h, display: "block" }}>
                  {k % 10}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** frame em que o slot termina de girar */
export const slotEnd = (value: string, start: number, duration = 22, stagger = 3) => {
  const n = value.replace(/[^0-9]/g, "").length;
  return start + (n - 1) * stagger + duration + (n - 1) * 2;
};
