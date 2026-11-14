import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, EASE_IN_OUT, FONT, IPhone, Kinetic, useSpring } from "../ui";

// 0–4s · iPhone sobe com vídeo travado; no fim a câmera entra pela tela (→ cena 2).
export const Cena01Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = useSpring(2, 20);
  const zoom = interpolate(frame, [88, 120], [1, 3.4], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const screenToGray = interpolate(frame, [98, 114], [0, 1], CLAMP);
  const stutter = frame % 40 < 4 ? 0.6 : 1; // buffering "travado"
  // "parado?" dá um tranco e trava
  const jolt = interpolate(frame, [40, 43, 46, 49], [0, -10, 6, 0], CLAMP);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <AbsoluteFill
        style={{
          transformOrigin: "540px 1000px",
          scale: String(zoom),
          filter: `blur(${interpolate(frame, [110, 120], [0, 6], CLAMP)}px)`,
        }}
      >
        <div style={{ position: "absolute", top: 170, left: 60, right: 60 }}>
          <Kinetic
            delay={14}
            stagger={4}
            outAt={84}
            lines={[
              { text: "Seu vídeo", size: 96, color: C.sub },
              { text: "tá parado?", size: 112 },
            ]}
            style={{ translate: `${jolt}px 0px` }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 305,
            top: 520,
            translate: `0px ${(1 - rise) * 1500}px`,
          }}
        >
          <IPhone width={470} height={960} screen="#E5E5EA">
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(160deg, #D1D1D6 0%, #E5E5EA 55%, #F2F2F7 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "46%",
                translate: "-50% -50%",
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.85)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="56" height="64" viewBox="0 0 56 64">
                <path d="M6 4L52 32L6 60Z" fill={C.ink} />
              </svg>
            </div>
            <div
              style={{
                position: "absolute",
                left: 36,
                right: 36,
                bottom: 70,
                height: 8,
                borderRadius: 4,
                background: "rgba(0,0,0,0.12)",
              }}
            >
              <div
                style={{
                  width: "32%",
                  height: "100%",
                  borderRadius: 4,
                  background: C.ink,
                  opacity: stutter,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "32%",
                  top: "50%",
                  translate: "-50% -50%",
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: C.white,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: 36,
                bottom: 92,
                fontFamily: FONT,
                fontSize: 24,
                fontWeight: 500,
                color: "#3A3A3C",
              }}
            >
              0:04 / 0:12
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: C.gray,
                opacity: screenToGray,
              }}
            />
          </IPhone>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
