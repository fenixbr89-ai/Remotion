import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Glass, Shot, T, useEase, useSpring, Wallpaper } from "./kit";
import { C, CLAMP, EASE, FONT, ORANGE_GRADIENT } from "./theme";

const WORDS = ["pintura?", "reformas?", "manutenção?"];
const LINE = 170;

/** Kinetic typography: "Precisando de" + roleta vertical de palavras. */
export const Hook: React.FC<{
  dur: number;
  cues: [number, number, number];
}> = ({ dur, cues }) => {
  // a roleta acompanha a fala: pintura → reforma → manutenção
  const glow = useEase(0, 14);
  const words = useEase(cues[0], 10);
  const s1 = useSpring(cues[1], 16, 220);
  const s2 = useSpring(cues[2], 16, 220);
  const line = useEase(cues[2] + 8, 14);
  const idx = s1 + s2;
  return (
    <Shot dur={dur} bg={C.black}>
      <div
        style={{
          position: "absolute",
          left: 540 - 600,
          top: 860 - 600,
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,107,0,0.16) 0%, rgba(255,107,0,0) 60%)",
          opacity: glow,
          scale: String(0.8 + 0.2 * glow),
        }}
      />
      <div style={{ position: "absolute", top: 700, width: "100%" }}>
        <T size={64} weight={600} color={C.grey} delay={2} dur={12}>
          Precisando de
        </T>
        <div
          style={{
            height: LINE,
            overflow: "hidden",
            marginTop: 16,
            opacity: words,
            filter: words < 0.99 ? `blur(${(1 - words) * 14}px)` : undefined,
          }}
        >
          <div style={{ translate: `0 ${-idx * LINE}px` }}>
            {WORDS.map((w, i) => {
              const dist = Math.abs(idx - i);
              const last = i === WORDS.length - 1;
              return (
                <div
                  key={w}
                  style={{
                    height: LINE,
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 150,
                    letterSpacing: "-0.045em",
                    textAlign: "center",
                    lineHeight: `${LINE}px`,
                    opacity: Math.max(0, 1 - dist * 1.2),
                    filter: `blur(${Math.min(12, dist * 14)}px)`,
                    ...(last
                      ? {
                          backgroundImage: ORANGE_GRADIENT,
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }
                      : { color: C.white }),
                  }}
                >
                  {w}
                </div>
              );
            })}
          </div>
        </div>
        {/* traço minimalista */}
        <div
          style={{
            margin: "30px auto 0",
            width: 520 * line,
            height: 6,
            borderRadius: 3,
            background: C.orange,
          }}
        />
      </div>
    </Shot>
  );
};

const Notification: React.FC<{
  delay: number;
  title: string;
  body: string;
  y: number;
}> = ({ delay, title, body, y }) => {
  const s = useSpring(delay, 15, 160);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: y,
        translate: `0 ${(1 - s) * -260}px`,
        scale: String(0.7 + 0.3 * Math.min(s, 1.05)),
        opacity: Math.min(1, s * 1.5),
      }}
    >
      <Glass
        radius={52}
        style={{
          padding: "34px 38px",
          display: "flex",
          gap: 30,
          alignItems: "center",
        }}
      >
        <Img
          src={staticFile("img/logo.png")}
          style={{ width: 116, height: 116, flexShrink: 0 }}
        />
        <div style={{ fontFamily: FONT, flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700, fontSize: 40, color: C.text }}>
              {title}
            </div>
            <div style={{ fontWeight: 500, fontSize: 32, color: C.grey }}>
              agora
            </div>
          </div>
          <div
            style={{
              fontWeight: 500,
              fontSize: 38,
              color: C.text,
              lineHeight: 1.25,
              marginTop: 6,
            }}
          >
            {body}
          </div>
        </div>
      </Glass>
    </div>
  );
};

/** UI: tela de bloqueio, Dynamic Island se expande e as notificações chegam. */
export const LockScreen: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  // tempos originais pensados para 90 frames, comprimidos para caber em `dur`
  const k = dur / 90;
  const island = interpolate(
    frame,
    [6 * k, 14 * k, 26 * k, 34 * k],
    [0, 1, 1, 0],
    {
      ...CLAMP,
      easing: EASE,
    },
  );
  const zoom = interpolate(frame, [64 * k, 90 * k], [1, 2.6], {
    ...CLAMP,
    easing: (t) => t * t * t,
  });
  const blur = interpolate(frame, [74 * k, 90 * k], [0, 20], CLAMP);
  return (
    <Shot dur={dur} bg="#F2EEEA" out={false}>
      <AbsoluteFill
        style={{
          scale: String(zoom),
          transformOrigin: "540px 760px",
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      >
        <Wallpaper />
        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: 42,
            left: 540 - (125 + 230 * island),
            width: 250 + 460 * island,
            height: 74 + 30 * island,
            borderRadius: 60,
            background: C.black,
            display: "flex",
            alignItems: "center",
            padding: "0 22px",
            boxSizing: "border-box",
            gap: 18,
          }}
        >
          <Img
            src={staticFile("img/whatsapp.png")}
            style={{ width: 66 * island, opacity: island }}
          />
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 32,
              color: C.white,
              opacity: island,
              whiteSpace: "nowrap",
            }}
          >
            Nova mensagem
          </div>
        </div>
        <div style={{ position: "absolute", top: 230, width: "100%" }}>
          <T size={44} weight={600} color="rgba(29,29,31,0.7)" dur={10}>
            Hoje
          </T>
          <T
            size={260}
            weight={600}
            color="rgba(29,29,31,0.85)"
            dur={10}
            style={{ letterSpacing: "-0.03em" }}
          >
            9:41
          </T>
        </div>
        <Notification
          delay={Math.round(10 * k)}
          y={680}
          title="Juliano Pinturas"
          body="Pintura, reformas e manutenção. Peça seu orçamento."
        />
        <Notification
          delay={Math.round(26 * k)}
          y={950}
          title="Juliano Pinturas"
          body="Hidráulica e elétrica também. Tudo em um só lugar."
        />
      </AbsoluteFill>
    </Shot>
  );
};

/** "Então conheça" com a logo. */
export const Apresentacao: React.FC<{ dur: number }> = ({ dur }) => {
  const logo = useSpring(0, 15, 140);
  return (
    <Shot dur={dur} bg={C.black}>
      <div style={{ position: "absolute", top: 300, width: "100%" }}>
        <T size={64} weight={600} color={C.grey} dur={8}>
          Então conheça
        </T>
      </div>
      <Img
        src={staticFile("img/logo.png")}
        style={{
          position: "absolute",
          left: 540 - 320,
          top: 900 - 320,
          width: 640,
          scale: String(0.85 + 0.15 * Math.min(logo, 1.04)),
          opacity: Math.min(1, logo * 1.6),
          filter: "drop-shadow(0 40px 60px rgba(255,107,0,0.25))",
        }}
      />
      <div style={{ position: "absolute", top: 1330, width: "100%" }}>
        <T size={84} color={C.white} delay={6}>
          Juliano Pinturas
        </T>
        <div style={{ height: 18 }} />
        <T size={44} weight={500} color={C.grey} delay={10}>
          Prestadora de serviços
        </T>
      </div>
    </Shot>
  );
};
