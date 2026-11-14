import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, EASE_IN_OUT, FONT, IPhone, Kinetic, prog, useSpring } from "../ui";

/** Frames (locais) dos eventos de som. */
export const C01 = { tap: 26, freeze: 66 };

/** O "vídeo ruim": arte cafona, poucos quadros por segundo, travando. */
const VideoRuim: React.FC = () => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - C01.tap);
  // ~5 fps e trava de vez no buffering
  const choppy = Math.min(Math.floor(local / 6) * 6, C01.freeze - C01.tap);
  const blink = Math.floor(choppy / 6) % 2 === 0;
  const wobble = Math.sin(choppy / 3) * 4;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, #F7E37A 0%, #F2B33D 100%)",
        filter: "blur(1.4px) saturate(1.5) contrast(1.15)",
        overflow: "hidden",
      }}
    >
      {/* "foto do produto" estourada */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 250,
          width: 300,
          height: 300,
          borderRadius: 24,
          background: "radial-gradient(circle at 35% 30%, #fff 0%, #c9c9c9 45%, #8a8a8a 100%)",
          rotate: `${wobble}deg`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 90,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 58,
          color: blink ? "#E10600" : "#0033CC",
          textShadow: "3px 3px 0 #fff, -3px -3px 0 #fff, 6px 6px 0 #000",
          rotate: "-4deg",
        }}
      >
        PROMOÇÃO!!!
      </div>
      {/* selo estourado */}
      <div
        style={{
          position: "absolute",
          right: 26,
          top: 470,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "#E10600",
          color: "#FFF200",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 40,
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          rotate: `${12 + wobble * 2}deg`,
          border: "5px dashed #FFF200",
        }}
      >
        50%
        <br />
        OFF
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 190,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 40,
          color: "#000",
          background: "#00E000",
          padding: "8px 0",
        }}
      >
        CHAMA NO ZAP!!!
      </div>
    </div>
  );
};

// 0–4s · O play inicia um vídeo ruim que trava. No fim a câmera entra pela tela (→ cena 2).
export const Cena01Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = useSpring(2, 20);
  const tap = prog(frame, C01.tap, 10);
  const playing = frame >= C01.tap + 4;
  const progress = interpolate(frame, [C01.tap, C01.freeze], [0.05, 0.32], CLAMP);
  const frozen = frame >= C01.freeze;
  const zoom = interpolate(frame, [92, 120], [1, 3.4], { ...CLAMP, easing: EASE_IN_OUT });
  const screenToGray = interpolate(frame, [104, 119], [0, 1], CLAMP);
  const jolt = interpolate(frame, [70, 73, 76, 79], [0, -10, 6, 0], CLAMP);

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
            delay={48}
            stagger={4}
            outAt={88}
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
            {playing ? (
              <VideoRuim />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(160deg, #D1D1D6 0%, #E5E5EA 55%, #F2F2F7 100%)",
                }}
              />
            )}

            {/* botão de play: toque e some */}
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
                scale: String(interpolate(tap, [0, 0.3, 1], [1, 0.86, 1.3])),
                opacity: 1 - tap,
              }}
            >
              <svg width="56" height="64" viewBox="0 0 56 64">
                <path d="M6 4L52 32L6 60Z" fill={C.ink} />
              </svg>
            </div>
            {/* onda do toque */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "46%",
                translate: "-50% -50%",
                width: 150,
                height: 150,
                borderRadius: "50%",
                border: "4px solid rgba(255,255,255,0.9)",
                scale: String(1 + tap * 1.2),
                opacity: frame >= C01.tap ? 1 - tap : 0,
              }}
            />

            {/* buffering quando trava */}
            {frozen ? (
              <svg
                width="90"
                height="90"
                viewBox="0 0 90 90"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "46%",
                  translate: "-50% -50%",
                  rotate: `${(frame - C01.freeze) * 14}deg`,
                }}
              >
                <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="9" />
                <path d="M45 9A36 36 0 0 1 81 45" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
              </svg>
            ) : null}

            {/* barra de progresso */}
            <div
              style={{
                position: "absolute",
                left: 36,
                right: 36,
                bottom: 70,
                height: 8,
                borderRadius: 4,
                background: "rgba(0,0,0,0.18)",
              }}
            >
              <div
                style={{
                  width: `${progress * 100}%`,
                  height: "100%",
                  borderRadius: 4,
                  background: C.ink,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: `${progress * 100}%`,
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
