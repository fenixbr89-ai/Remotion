import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, EmojiBadge, Title, WordByWord, prog, useSpring } from "../ui";

const BARS = 23;

// 32–37s · Microfone num círculo branco e onda de áudio pulsando.
export const Cena07Diferencial2: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpring(10, 13);
  const wave = prog(frame, 24, 20);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <EmojiBadge char="🎙️" size={260} style={{ scale: String(pop) }} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 800,
          left: 0,
          right: 0,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          opacity: wave,
        }}
      >
        {new Array(BARS).fill(0).map((_, i) => {
          const center = 1 - Math.abs(i - (BARS - 1) / 2) / ((BARS - 1) / 2);
          const pulse =
            0.5 +
            0.5 *
              Math.abs(
                Math.sin(frame / 4.2 + i * 0.9) * 0.6 +
                  Math.sin(frame / 7.3 + i * 1.7) * 0.4,
              );
          const h = interpolate(wave, [0, 1], [8, 20 + 160 * pulse * (0.35 + 0.65 * center)], CLAMP);
          return (
            <div
              key={i}
              style={{ width: 16, height: h, borderRadius: 8, background: C.ink }}
            />
          );
        })}
      </div>

      <div style={{ position: "absolute", top: 1100, left: 90, right: 90 }}>
        <Title>
          <WordByWord text="Narração e trilha já inclusas" delay={34} stagger={5} />
        </Title>
      </div>
    </AbsoluteFill>
  );
};
