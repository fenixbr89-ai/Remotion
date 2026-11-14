import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  BgDots,
  C,
  Camera,
  CLAMP,
  DrawPath,
  EASE,
  EASE_IN_OUT,
  EmojiBadge,
  Finger,
  FONT,
  Kinetic,
  prog,
  Sfx,
  Sparkles,
  useSpring,
} from "../ui";

/**
 * Frames locais: toque em "Pagar com Pix" logo após "E o melhor" (20,8s);
 * o valor chega em R$ 50 no "cinquenta reais" (~23s); "Seguro" ~24,6s; "sem complicação" ~25,4s.
 */
export const C09 = { pay: 14, receipt: 30, amount: 78, items: [124, 148] };
const SHRINK = 112;
const BTN = { x: 540, y: 1000 };

const ITEMS: [string, string][] = [
  ["🔒", "Pagamento seguro"],
  ["⚡", "Sem complicação"],
];

const Row: React.FC<{
  readonly at: number;
  readonly emoji: string;
  readonly label: string;
}> = ({ at, emoji, label }) => {
  const s = useSpring(at, 12);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
      <EmojiBadge
        char={emoji}
        size={130}
        style={{ scale: String(s), rotate: `${(1 - s) * -30}deg` }}
      />
      <Kinetic
        delay={at + 3}
        stagger={3}
        align="flex-start"
        lines={[{ text: label, size: 62 }]}
      />
    </div>
  );
};

const Linha: React.FC<{
  readonly k: string;
  readonly v: string;
  readonly at: number;
}> = ({ k, v, at }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 10);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontFamily: FONT,
        fontSize: 34,
        opacity: p,
        translate: `0px ${(1 - p) * 16}px`,
      }}
    >
      <span style={{ color: C.sub, fontWeight: 500 }}>{k}</span>
      <span style={{ color: C.ink, fontWeight: 600 }}>{v}</span>
    </div>
  );
};

// 20,6–26,5s · "E o melhor: tudo isso por apenas cinquenta reais. Seguro e sem complicação."
export const Cena09Beneficios: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useSpring(0, 18);
  const loading = frame >= C09.pay && frame < C09.receipt;
  const swap = prog(frame, C09.receipt, 10);
  const check = prog(frame, C09.receipt + 6, 12);
  const value = Math.round(
    interpolate(frame, [C09.receipt + 14, C09.amount], [0, 50], {
      ...CLAMP,
      easing: EASE,
    }),
  );
  const land = prog(frame, C09.amount, 10);
  const shrink = prog(frame, SHRINK, 18, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{ background: C.gray }}>
      <BgDots />
      <Sfx at={C09.amount} name="ding" volume={0.65} />
      <Camera
        keys={[
          { f: 0, z: 1.0 },
          { f: C09.pay, z: 1.06, y: -60 },
          { f: C09.receipt + 4, z: 1.0, y: 0 },
          { f: C09.amount, z: 1.14, y: 120 },
          { f: SHRINK, z: 1.0, y: 0 },
          { f: 187, z: 1.05 },
        ]}
        punches={[{ f: C09.amount, amt: 0.08 }]}
      >
        <div
          style={{
            position: "absolute",
            left: 140,
            width: 800,
            height: 760,
            top: interpolate(shrink, [0, 1], [380, 170]),
            transformOrigin: "50% 0%",
            scale: String(
              interpolate(shrink, [0, 1], [1, 0.62]) * (0.9 + 0.1 * card),
            ),
            transform: `perspective(1600px) rotateY(${Math.sin(swap * Math.PI) * 25}deg)`,
            opacity: card,
            translate: `0px ${(1 - card) * 300}px`,
            borderRadius: 44,
            background: C.white,
            boxShadow: "0 40px 100px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          {/* tela de pagamento */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: 56,
              display: "flex",
              flexDirection: "column",
              gap: 22,
              opacity: 1 - swap,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 32,
                color: C.sub,
                fontWeight: 500,
              }}
            >
              Seu pedido
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 58,
                fontWeight: 700,
                color: C.ink,
                letterSpacing: "-0.03em",
              }}
            >
              Vídeo comercial
            </div>
            <div style={{ fontFamily: FONT, fontSize: 36, color: C.sub }}>
              Motion graphics · 9:16 · com narração
            </div>
            <div
              style={{
                height: 120,
                borderRadius: 24,
                background: C.black,
                marginTop: 10,
              }}
            />
          </div>

          {/* comprovante */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: "56px 56px 50px",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              opacity: swap,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <svg width="64" height="64" viewBox="0 0 240 240">
                <circle
                  cx="120"
                  cy="120"
                  r={110 * prog(frame, C09.receipt, 10)}
                  fill={C.green}
                />
                <DrawPath
                  d="M70 124L105 158L172 88"
                  progress={check}
                  length={160}
                  color={C.white}
                  width={22}
                />
              </svg>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 40,
                  fontWeight: 600,
                  color: C.ink,
                }}
              >
                Comprovante de Pix
              </div>
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 32,
                color: C.sub,
                fontWeight: 500,
                marginTop: 6,
              }}
            >
              Valor
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 140,
                fontWeight: 700,
                letterSpacing: "-0.045em",
                color: C.ink,
                lineHeight: 1,
                marginTop: -14,
                scale: String(1 + Math.sin(land * Math.PI) * 0.08),
                transformOrigin: "0% 50%",
              }}
            >
              R$ {value},00
            </div>
            <div
              style={{
                alignSelf: "flex-start",
                padding: "10px 24px",
                borderRadius: 30,
                background: "rgba(52,199,89,0.14)",
                color: "#1E8E3E",
                fontFamily: FONT,
                fontSize: 30,
                fontWeight: 600,
                opacity: land,
                scale: String(0.7 + 0.3 * land),
                transformOrigin: "0% 50%",
              }}
            >
              Valor promocional
            </div>
            <div style={{ borderTop: "3px dashed #E5E5EA", margin: "6px 0" }} />
            <Linha k="Para" v="Pixora" at={C09.amount + 6} />
            <Linha k="Serviço" v="Vídeo comercial" at={C09.amount + 10} />
            <Linha k="Data" v="Hoje" at={C09.amount + 14} />
          </div>
        </div>

        {/* botão "Pagar com Pix" */}
        <div
          style={{
            position: "absolute",
            left: BTN.x - 300,
            top: BTN.y - 56,
            width: 600,
            height: 112,
            borderRadius: 56,
            background: C.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            fontFamily: FONT,
            fontSize: 44,
            fontWeight: 600,
            color: C.white,
            opacity: card * (1 - prog(frame, C09.receipt - 2, 6)),
            scale: String(
              1 - Math.sin(prog(frame, C09.pay - 2, 8) * Math.PI) * 0.06,
            ),
          }}
        >
          {loading ? (
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              style={{ rotate: `${frame * 18}deg` }}
            >
              <circle
                cx="25"
                cy="25"
                r="19"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="6"
              />
              <path
                d="M25 6A19 19 0 0 1 44 25"
                fill="none"
                stroke="#fff"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            "Pagar com Pix · R$ 50"
          )}
        </div>

        <Sparkles at={C09.amount} x={390} y={720} count={14} />
        <Sparkles
          at={C09.amount + 3}
          x={760}
          y={680}
          color={C.ink}
          count={10}
        />

        <div
          style={{
            position: "absolute",
            top: 860,
            left: 130,
            right: 80,
            display: "flex",
            flexDirection: "column",
            gap: 50,
          }}
        >
          {ITEMS.map(([emoji, label], i) => (
            <Row key={label} at={C09.items[i]} emoji={emoji} label={label} />
          ))}
        </div>

        <Finger
          path={[
            { f: 2, x: 900, y: 1650 },
            { f: C09.pay - 2, x: BTN.x + 40, y: BTN.y },
            { f: C09.pay + 8, x: BTN.x + 60, y: BTN.y + 30 },
            { f: 34, x: 960, y: 1700 },
          ]}
          taps={[C09.pay]}
        />
      </Camera>
    </AbsoluteFill>
  );
};
