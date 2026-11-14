import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, DrawPath, FONT, Title, WordByWord, prog } from "../ui";

// 9–12s · Corte seco para preto, "certo" desfocado e linha branca curva.
export const Cena03Virada: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 4], [0.85, 0], CLAMP);
  const ghost = prog(frame, 2, 18);
  const line = prog(frame, 30, 26);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          top: 400,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 300,
          letterSpacing: "-0.05em",
          color: "#3A3A3C",
          opacity: ghost * 0.9,
          filter: `blur(${10 - ghost * 4}px)`,
          scale: String(1.1 - ghost * 0.06),
        }}
      >
        certo
      </div>

      <div style={{ position: "absolute", top: 820, left: 80, right: 80 }}>
        <Title color={C.white} size={92}>
          <WordByWord text="Movimento é o que prende." delay={10} stagger={5} />
        </Title>
      </div>

      <svg
        width="1080"
        height="300"
        viewBox="0 0 1080 300"
        style={{ position: "absolute", top: 1010, left: 0 }}
      >
        <DrawPath
          d="M170 120C330 40 470 210 620 130S860 40 930 110"
          progress={line}
          length={900}
          color={C.white}
          width={9}
        />
      </svg>

      <AbsoluteFill style={{ background: C.white, opacity: flash }} />
    </AbsoluteFill>
  );
};
