import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  C,
  CLAMP,
  DrawPath,
  Drift,
  EASE,
  EASE_IN_OUT,
  EmojiBadge,
  FONT,
  Kinetic,
  prog,
  useSpring,
} from "../ui";
import { DUR } from "../timeline";

/** Frames (locais) dos eventos de som desta cena. */
export const C09 = { amount: 46, items: [112, 136, 160] };
const SHRINK = 96;

const ITEMS: [string, string][] = [
  ["💸", "Preço acessível"],
  ["🔒", "Segurança"],
  ["⚡", "Entrega rápida"],
];

const Row: React.FC<{ readonly at: number; readonly emoji: string; readonly label: string }> = ({
  at,
  emoji,
  label,
}) => {
  const s = useSpring(at, 14);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
      <EmojiBadge char={emoji} size={130} style={{ scale: String(s) }} />
      <Kinetic delay={at + 4} stagger={3} align="flex-start" lines={[{ text: label, size: 60 }]} />
    </div>
  );
};

const Linha: React.FC<{ readonly k: string; readonly v: string; readonly at: number }> = ({
  k,
  v,
  at,
}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 12);
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

// 43–49s · Comprovante do Pix com o valor promocional; depois sobe e dá lugar aos benefícios.
export const Cena09Beneficios: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useSpring(6, 20);
  const check = prog(frame, 14, 14);
  const value = Math.round(
    interpolate(frame, [20, C09.amount], [0, 50], { ...CLAMP, easing: EASE }),
  );
  const land = prog(frame, C09.amount, 10);
  const shrink = prog(frame, SHRINK, 26, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{ background: C.gray }}>
      <Drift dur={DUR.c09} amount={0.025}>
        <div
          style={{
            position: "absolute",
            left: 140,
            width: 800,
            top: interpolate(shrink, [0, 1], [400, 170]),
            transformOrigin: "50% 0%",
            scale: String(interpolate(shrink, [0, 1], [1, 0.66]) * (0.92 + 0.08 * card)),
            opacity: card,
            translate: `0px ${(1 - card) * 120}px`,
            padding: "56px 56px 50px",
            borderRadius: 44,
            background: C.white,
            boxShadow: "0 40px 100px rgba(0,0,0,0.10)",
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <svg width="64" height="64" viewBox="0 0 240 240">
              <circle cx="120" cy="120" r={110 * prog(frame, 8, 12)} fill={C.green} />
              <DrawPath
                d="M70 124L105 158L172 88"
                progress={check}
                length={160}
                color={C.white}
                width={22}
              />
            </svg>
            <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 600, color: C.ink }}>
              Comprovante de Pix
            </div>
          </div>

          <div
            style={{ fontFamily: FONT, fontSize: 32, color: C.sub, fontWeight: 500, marginTop: 10 }}
          >
            Valor
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 132,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: C.ink,
              lineHeight: 1,
              marginTop: -14,
              scale: String(1 + Math.sin(land * Math.PI) * 0.05),
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
              scale: String(0.8 + 0.2 * land),
              transformOrigin: "0% 50%",
            }}
          >
            Valor promocional
          </div>

          <div style={{ borderTop: "3px dashed #E5E5EA", margin: "10px 0" }} />

          <Linha k="Para" v="Pixora" at={58} />
          <Linha k="Serviço" v="Vídeo comercial" at={64} />
          <Linha k="Data" v="Hoje" at={70} />
        </div>

        <div
          style={{
            position: "absolute",
            top: 860,
            left: 130,
            right: 80,
            display: "flex",
            flexDirection: "column",
            gap: 44,
          }}
        >
          {ITEMS.map(([emoji, label], i) => (
            <Row key={label} at={C09.items[i]} emoji={emoji} label={label} />
          ))}
        </div>
      </Drift>
    </AbsoluteFill>
  );
};
