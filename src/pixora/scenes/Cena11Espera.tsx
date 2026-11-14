import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, Drift, Emoji, Kinetic, prog } from "../ui";
import { DUR } from "../timeline";

// 53,5–56s · Só a frase, saindo da tela escura do celular.
export const Cena11Espera: React.FC = () => {
  const frame = useCurrentFrame();
  const eyes = prog(frame, 22, 12);
  const out = prog(frame, 60, 10);

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <Drift dur={DUR.c11} amount={0.04}>
        <div style={{ position: "absolute", top: 820, left: 60, right: 60 }}>
          <Kinetic
            delay={4}
            stagger={4}
            outAt={60}
            lines={[
              { text: "Tô te esperando", size: 96, color: C.white },
              { text: "aqui", size: 96, color: C.white },
            ]}
            trailing={
              <span
                style={{
                  display: "inline-block",
                  marginLeft: 24,
                  opacity: eyes * (1 - out),
                  scale: String(eyes),
                  translate: `0px ${out * -40}px`,
                }}
              >
                <Emoji char="👀" size={96} />
              </span>
            }
          />
        </div>
      </Drift>
    </AbsoluteFill>
  );
};
