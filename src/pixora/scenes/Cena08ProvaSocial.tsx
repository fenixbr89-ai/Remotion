import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, Emoji, FONT, PixoraP, prog, useSpring } from "../ui";

/** Frames (locais) dos eventos de som desta cena. */
export const C08 = { notif: 12, msg1: 44, msg2: 92, typing: 124 };

const Bubble: React.FC<{
  readonly at: number;
  readonly mine: boolean;
  readonly children: React.ReactNode;
}> = ({ at, mine, children }) => {
  const frame = useCurrentFrame();
  const s = useSpring(at, 16);
  const p = prog(frame, at, 10);
  return (
    <div
      style={{
        alignSelf: mine ? "flex-end" : "flex-start",
        maxWidth: 620,
        padding: "26px 38px",
        borderRadius: 44,
        borderBottomRightRadius: mine ? 12 : 44,
        borderBottomLeftRadius: mine ? 44 : 12,
        background: mine ? C.blue : C.bubble,
        color: mine ? C.white : C.ink,
        fontFamily: FONT,
        fontSize: 50,
        fontWeight: 500,
        letterSpacing: "-0.01em",
        opacity: p,
        scale: String(interpolate(s, [0, 1], [0.7, 1])),
        transformOrigin: mine ? "100% 100%" : "0% 100%",
        filter: `blur(${(1 - p) * 10}px)`,
      }}
    >
      {children}
    </div>
  );
};

// 37–43s · Notificação + conversa no iMessage com "digitando…".
export const Cena08ProvaSocial: React.FC = () => {
  const frame = useCurrentFrame();
  const notif = useSpring(C08.notif, 20);
  const notifOut = prog(frame, 70, 14);
  const typing = prog(frame, C08.typing, 8);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      {/* card de notificação iOS */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 70,
          right: 70,
          padding: 30,
          borderRadius: 40,
          background: "rgba(242,242,247,0.96)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
          display: "flex",
          gap: 24,
          alignItems: "center",
          translate: `0px ${(1 - notif) * -500 - notifOut * 60}px`,
          opacity: 1 - notifOut,
          filter: `blur(${notifOut * 16}px)`,
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            background: C.black,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <PixoraP size={60} id="c08" />
        </div>
        <div style={{ fontFamily: FONT, flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 32 }}>
            <span style={{ fontWeight: 600, color: C.ink }}>Pixora</span>
            <span style={{ color: C.sub }}>agora</span>
          </div>
          <div style={{ fontSize: 34, color: "#3A3A3C", marginTop: 6 }}>
            Seu vídeo ficou pronto <Emoji char="🎬" size={34} />
          </div>
        </div>
      </div>

      {/* conversa */}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 70,
          right: 70,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        <Bubble at={C08.msg1} mine>
          Ficou absurdo <Emoji char="🔥" size={50} />
        </Bubble>
        <div
          style={{
            alignSelf: "flex-end",
            fontFamily: FONT,
            fontSize: 26,
            color: C.sub,
            marginTop: -12,
            opacity: prog(frame, C08.msg1 + 14, 10),
          }}
        >
          Lido
        </div>
        <Bubble at={C08.msg2} mine={false}>
          E ainda tem mais…
        </Bubble>
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
      </div>
    </AbsoluteFill>
  );
};
