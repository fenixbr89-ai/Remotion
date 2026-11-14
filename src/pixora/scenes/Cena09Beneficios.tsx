import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, DrawPath, Drift, EASE_IN, EmojiBadge, Kinetic, prog, useSpring } from "../ui";
import { DUR } from "../timeline";

/** Frames (locais) dos eventos de som desta cena. */
export const C09 = { check: 16, items: [84, 112, 140] };

const ITEMS: [string, string][] = [
  ["💸", "Preço acessível"],
  ["🔒", "Segurança"],
  ["⚡", "Entrega rápida"],
];

const Row: React.FC<{ readonly at: number; readonly emoji: string; readonly label: string }> = ({
  at,
  emoji,
  label,
}) => {
  const s = useSpring(at, 14);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
      <EmojiBadge char={emoji} size={150} style={{ scale: String(s) }} />
      <Kinetic
        delay={at + 4}
        stagger={3}
        align="flex-start"
        lines={[{ text: label, size: 66 }]}
      />
    </div>
  );
};

// 43–49s · "Pix enviado" com check desenhado; o check sobe e dá lugar aos benefícios.
export const Cena09Beneficios: React.FC = () => {
  const frame = useCurrentFrame();
  const circle = useSpring(C09.check - 8, 16);
  const check = prog(frame, C09.check, 14);
  const pixOut = prog(frame, 66, 14, EASE_IN);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Drift dur={DUR.c09} amount={0.03}>
        <div
          style={{
            position: "absolute",
            top: 520,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
            opacity: 1 - pixOut,
            filter: `blur(${pixOut * 16}px)`,
            translate: `0px ${pixOut * -160}px`,
            scale: String(1 - pixOut * 0.1),
          }}
        >
          <svg width="240" height="240" viewBox="0 0 240 240">
            <circle cx="120" cy="120" r={110 * circle} fill={C.green} />
            <DrawPath
              d="M70 124L105 158L172 88"
              progress={check}
              length={160}
              color={C.white}
              width={18}
            />
          </svg>
          <Kinetic delay={C09.check + 4} stagger={4} lines={[{ text: "Pix enviado", size: 84 }]} />
          <Kinetic
            delay={C09.check + 12}
            stagger={3}
            lines={[{ text: "para Pixora · agora", size: 40, color: C.sub, weight: 500 }]}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: 500,
            left: 120,
            right: 80,
            display: "flex",
            flexDirection: "column",
            gap: 60,
          }}
        >
          {ITEMS.map(([emoji, label], i) => (
            <Row key={label} at={C09.items[i]} emoji={emoji} label={label} />
          ))}
        </div>

      </Drift>
    </AbsoluteFill>
  );
};
