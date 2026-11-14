import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, EASE_IN_OUT, IPhone, Kinetic, PixoraP, prog, useSpring } from "../ui";

/** Frame (local) em que a câmera começa a entrar no celular. */
export const ZOOM_AT = 112;
const PHONE = { left: 230, top: 325, width: 620, height: 1270 };

/** O "vídeo bom": escuro, fluido, com tipografia cinética. */
const VideoBom: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0A0A0A", overflow: "hidden" }}>
      {/* luzes suaves em movimento */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          left: -200 + Math.sin(t * 0.9) * 120,
          top: 120 + Math.cos(t * 0.7) * 100,
          background: "radial-gradient(closest-side, rgba(10,132,255,0.55), rgba(10,132,255,0))",
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 640,
          height: 640,
          borderRadius: "50%",
          right: -240 + Math.cos(t * 0.8) * 120,
          bottom: 60 + Math.sin(t * 1.1) * 100,
          background: "radial-gradient(closest-side, rgba(255,255,255,0.28), rgba(255,255,255,0))",
          filter: "blur(30px)",
        }}
      />
      {/* forma girando */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 330,
          width: 260,
          height: 260,
          translate: "-50% -50%",
          borderRadius: 70,
          border: "3px solid rgba(255,255,255,0.35)",
          rotate: `${frame * 1.6}deg`,
          scale: String(prog(frame, 6, 24)),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 330,
          translate: "-50% -50%",
          opacity: prog(frame, 10, 16),
        }}
      >
        <PixoraP size={120} id="c10" />
      </div>

      <div style={{ position: "absolute", top: 600, left: 30, right: 30 }}>
        <Kinetic
          delay={22}
          stagger={4}
          outAt={ZOOM_AT - 10}
          lines={[
            { text: "Vem fazer", size: 82, color: "#AEAEB2" },
            { text: "o seu vídeo", size: 92, color: C.white },
          ]}
        />
      </div>

      {/* reprodução fluida */}
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          bottom: 70,
          height: 8,
          borderRadius: 4,
          background: "rgba(255,255,255,0.18)",
          opacity: 1 - prog(frame, ZOOM_AT - 10, 10),
        }}
      >
        <div
          style={{
            width: `${interpolate(frame, [0, ZOOM_AT], [8, 70], CLAMP)}%`,
            height: "100%",
            borderRadius: 4,
            background: C.white,
          }}
        />
      </div>
    </div>
  );
};

// 49–53,5s · Celular centralizado rodando um vídeo bom; a câmera entra na tela escura (→ frase).
export const Cena10Chamada: React.FC = () => {
  const frame = useCurrentFrame();
  const phone = useSpring(4, 22);
  const zoom = interpolate(frame, [ZOOM_AT, 145], [1, 3.6], { ...CLAMP, easing: EASE_IN_OUT });

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <AbsoluteFill
        style={{
          transformOrigin: `${PHONE.left + PHONE.width / 2}px ${PHONE.top + PHONE.height / 2}px`,
          scale: String(zoom),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: PHONE.left,
            top: PHONE.top,
            scale: String(0.94 + 0.06 * phone),
          }}
        >
          <IPhone width={PHONE.width} height={PHONE.height} screen="#0A0A0A">
            <VideoBom />
          </IPhone>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
