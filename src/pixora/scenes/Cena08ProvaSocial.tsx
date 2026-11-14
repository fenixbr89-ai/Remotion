import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, Drift, FONT, prog, useSpring } from "../ui";
import { DUR } from "../timeline";

/** Frames (locais) dos eventos desta cena. */
export const C08 = { msg1: 16, typing: 40, msg2: 82, msg3: 128 };

const Bubble: React.FC<{
  readonly at: number;
  readonly mine: boolean;
  readonly children: React.ReactNode;
}> = ({ at, mine, children }) => {
  const frame = useCurrentFrame();
  const s = useSpring(at, 16);
  const p = prog(frame, at, 10);
  if (frame < at) return null;
  return (
    <div
      style={{
        alignSelf: mine ? "flex-end" : "flex-start",
        maxWidth: 680,
        padding: "26px 38px",
        borderRadius: 44,
        borderBottomRightRadius: mine ? 12 : 44,
        borderBottomLeftRadius: mine ? 44 : 12,
        background: mine ? C.blue : C.bubble,
        color: mine ? C.white : C.ink,
        fontFamily: FONT,
        fontSize: 54,
        fontWeight: 500,
        letterSpacing: "-0.01em",
        opacity: p,
        scale: String(interpolate(s, [0, 1], [0.7, 1])),
        transformOrigin: mine ? "100% 100%" : "0% 100%",
        filter: `blur(${(1 - p) * 10}px)`,
        translate: `0px ${(1 - s) * 30}px`,
      }}
    >
      {children}
    </div>
  );
};

// 37–43s · Conversa no iMessage do lado da Pixora (azul).
export const Cena08ProvaSocial: React.FC = () => {
  const frame = useCurrentFrame();
  const header = prog(frame, 0, 14);
  const typingOn = frame >= C08.typing && frame < C08.msg2;
  const typing = typingOn ? prog(frame, C08.typing, 8) : 0;

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Drift dur={DUR.c08} amount={0.025} origin="50% 60%">
        {/* cabeçalho do contato */}
        <div
          style={{
            position: "absolute",
            top: 190,
            left: 0,
            right: 0,
            paddingBottom: 26,
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            opacity: header,
          }}
        >
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              background: "linear-gradient(180deg, #A5A9B4 0%, #848995 100%)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <svg width="80" height="86" viewBox="0 0 80 86">
              <circle cx="40" cy="30" r="20" fill="#fff" />
              <path d="M4 86C6 62 22 54 40 54S74 62 76 86Z" fill="#fff" />
            </svg>
          </div>
          <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 600, color: C.ink }}>
            Cliente
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 520,
            left: 70,
            right: 70,
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          <Bubble at={C08.msg1} mine>
            Terminei seu vídeo
          </Bubble>
          <div
            style={{
              alignSelf: "flex-end",
              fontFamily: FONT,
              fontSize: 26,
              color: C.sub,
              marginTop: -12,
              opacity: prog(frame, C08.msg1 + 12, 10),
            }}
          >
            Lido
          </div>

          {typingOn ? (
            <div
              style={{
                alignSelf: "flex-start",
                padding: "30px 36px",
                borderRadius: 44,
                borderBottomLeftRadius: 12,
                background: C.bubble,
                display: "flex",
                gap: 14,
                opacity: typing,
                scale: String(0.8 + 0.2 * typing),
                transformOrigin: "0% 100%",
              }}
            >
              {[0, 1, 2].map((i) => {
                const b = Math.sin((frame - C08.typing) / 4 - i * 0.9);
                return (
                  <div
                    key={i}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "#8E8E93",
                      opacity: interpolate(b, [-1, 1], [0.35, 1], CLAMP),
                      translate: `0px ${Math.max(0, b) * -8}px`,
                    }}
                  />
                );
              })}
            </div>
          ) : null}

          <Bubble at={C08.msg2} mine={false}>
            Oxi, mas já???
          </Bubble>
          <Bubble at={C08.msg3} mine>
            E ficou insano
          </Bubble>
        </div>
      </Drift>
    </AbsoluteFill>
  );
};
