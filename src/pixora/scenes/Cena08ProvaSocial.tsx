import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, Camera, CLAMP, Finger, FONT, prog, Sfx, useSpring } from "../ui";

/** Frames locais: digita e envia, cliente digita e responde, envia de novo. */
export const C08 = { type1: 0, send1: 16, typing: 26, msg2: 50, type3: 56, send3: 72 };
const SEND = { x: 950, y: 1560 };

const Bubble: React.FC<{ readonly at: number; readonly mine: boolean; readonly children: React.ReactNode }> = ({
  at,
  mine,
  children,
}) => {
  const frame = useCurrentFrame();
  const s = useSpring(at, 14);
  const p = prog(frame, at, 8);
  if (frame < at) return null;
  return (
    <div
      style={{
        alignSelf: mine ? "flex-end" : "flex-start",
        maxWidth: 700,
        padding: "26px 38px",
        borderRadius: 44,
        borderBottomRightRadius: mine ? 12 : 44,
        borderBottomLeftRadius: mine ? 44 : 12,
        background: mine ? C.blue : C.bubble,
        color: mine ? C.white : C.ink,
        fontFamily: FONT,
        fontSize: 56,
        fontWeight: 500,
        letterSpacing: "-0.01em",
        opacity: p,
        scale: String(interpolate(s, [0, 1], [0.6, 1])),
        transformOrigin: mine ? "100% 100%" : "0% 100%",
        translate: `0px ${(1 - s) * (mine ? 260 : 40)}px`,
      }}
    >
      {children}
    </div>
  );
};

const typed = (frame: number, start: number, end: number, text: string) =>
  text.slice(0, Math.round(interpolate(frame, [start, end], [0, text.length], CLAMP)));

// 17,5–20,6s · "E a entrega? Mais rápida do que você imagina."
// A Pixora digita e envia; o cliente digita "Oxi, mas já???"; a Pixora responde.
export const Cena08ProvaSocial: React.FC = () => {
  const frame = useCurrentFrame();
  const typingOn = frame >= C08.typing && frame < C08.msg2;
  const typing = typingOn ? prog(frame, C08.typing, 6) : 0;
  const field =
    frame < C08.send1
      ? typed(frame, C08.type1, C08.send1 - 4, "Terminei seu vídeo")
      : frame >= C08.type3 && frame < C08.send3
        ? typed(frame, C08.type3, C08.send3 - 4, "E ficou insano")
        : "";

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <Sfx at={C08.msg2} name="pop" volume={0.5} />
      <Camera
        keys={[{ f: 0, z: 1.0 }, { f: C08.msg2, z: 1.06, y: 40 }, { f: 103, z: 1.1, y: 60 }]}
        punches={[{ f: C08.msg2, amt: 0.07 }, { f: C08.send3 + 2, amt: 0.04 }]}
      >
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
          <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 600, color: C.ink }}>Cliente</div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 500,
            left: 70,
            right: 70,
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          <Bubble at={C08.send1 + 1} mine>
            Terminei seu vídeo
          </Bubble>
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
                const b = Math.sin((frame - C08.typing) / 3 - i * 0.9);
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
          <Bubble at={C08.send3 + 1} mine>
            E ficou insano
          </Bubble>
        </div>

        {/* campo de mensagem com botão de enviar */}
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: SEND.y - 50,
            height: 100,
            borderRadius: 50,
            border: "2px solid #E5E5EA",
            background: C.white,
            display: "flex",
            alignItems: "center",
            paddingLeft: 40,
            fontFamily: FONT,
            fontSize: 44,
            color: field ? C.ink : "#C7C7CC",
          }}
        >
          {field || "iMessage"}
          {field ? <span style={{ width: 4, height: 50, background: C.blue, marginLeft: 4 }} /> : null}
          <div
            style={{
              position: "absolute",
              right: 12,
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: field ? C.blue : "#C7C7CC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="34" height="38" viewBox="0 0 34 38">
              <path d="M17 34V5M5 16L17 4L29 16" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <Finger
          path={[
            { f: 4, x: 820, y: 1780 },
            { f: C08.send1 - 2, x: SEND.x, y: SEND.y },
            { f: C08.send1 + 10, x: SEND.x - 30, y: SEND.y + 140 },
            { f: C08.send3 - 8, x: SEND.x - 30, y: SEND.y + 140 },
            { f: C08.send3 - 2, x: SEND.x, y: SEND.y },
            { f: 96, x: 900, y: 1800 },
          ]}
          taps={[C08.send1, C08.send3]}
        />
      </Camera>
    </AbsoluteFill>
  );
};
