import React from "react";
import {
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Shot, T, useEase, useSpring, Wallpaper } from "./kit";
import { C, CLAMP, FONT } from "./theme";

const VALORES = ["Dedicação.", "Responsabilidade.", "Compromisso."];

/** Minimalismo + tipografia: um valor por vez. */
export const Valores: React.FC<{ dur: number; cues: number[] }> = ({
  dur,
  cues,
}) => {
  return (
    <Shot dur={dur} bg={C.light}>
      <div style={{ position: "absolute", top: 720, width: "100%" }}>
        <T size={52} weight={600} color={C.grey} dur={8}>
          Sempre com
        </T>
      </div>
      {VALORES.map((v, i) => (
        <Sequence
          key={v}
          from={cues[i]}
          durationInFrames={(cues[i + 1] ?? dur) - cues[i]}
          layout="none"
        >
          <div style={{ position: "absolute", top: 860, width: "100%" }}>
            <T size={i === 1 ? 110 : 130} gradient={i === 2} dur={8}>
              {v}
            </T>
          </div>
        </Sequence>
      ))}
    </Shot>
  );
};

/** UI: cartão de contato sobe como uma "sheet" do iOS. */
export type ContactCues = {
  chame: number; // "Chame Juliano Pinturas pelo WhatsApp"
  phone: number; // o número sendo falado
  press: number; // toque no botão
  tag: number; // "Várias soluções, em um só lugar."
};

export const ContactSheet: React.FC<{ dur: number; cues: ContactCues }> = ({
  dur,
  cues,
}) => {
  const frame = useCurrentFrame();
  const sheet = useSpring(cues.chame - 6, 18, 140);
  const press = interpolate(
    frame,
    [cues.press, cues.press + 4, cues.press + 12],
    [1, 0.94, 1],
    CLAMP,
  );
  const tag = useEase(cues.tag - 4, 14);
  const phone = interpolate(
    frame,
    [cues.phone, cues.phone + 6, cues.phone + 60, cues.phone + 70],
    [0, 1, 1, 0],
    CLAMP,
  );
  return (
    <Shot dur={dur} bg="#0B0B0C" out={false}>
      <Wallpaper dark />
      <div
        style={{
          position: "absolute",
          top: 240,
          width: "100%",
          opacity: 1 - tag,
        }}
      >
        <T size={64} weight={600} color={C.white} delay={2}>
          Precisou de algum serviço?
        </T>
        <T size={96} color={C.white} delay={cues.chame}>
          Chame Juliano Pinturas.
        </T>
      </div>
      {/* frase final, aparece no lugar do título */}
      <div
        style={{ position: "absolute", top: 240, width: "100%", opacity: tag }}
      >
        <T size={96} color={C.white} delay={cues.tag}>
          Várias soluções,
        </T>
        <T size={96} gradient delay={cues.tag + 6}>
          em um só lugar.
        </T>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 1340,
          background: C.white,
          borderRadius: "70px 70px 0 0",
          translate: `0 ${(1 - sheet) * 1400}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 30,
          boxShadow: "0 -20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            width: 110,
            height: 12,
            borderRadius: 6,
            background: C.hair,
          }}
        />
        <Img
          src={staticFile("img/logo.png")}
          style={{
            width: 420,
            marginTop: 60,
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.15))",
          }}
        />
        <div style={{ height: 40 }} />
        <T size={72} delay={cues.chame + 10}>
          Juliano Pinturas
        </T>
        <div style={{ height: 14 }} />
        <T size={44} weight={500} color={C.grey} delay={cues.chame + 14}>
          Prestadora de serviços
        </T>
        <div style={{ height: 50 }} />
        <div
          style={{
            width: 900,
            borderRadius: 40,
            background: C.light,
            padding: "30px 44px",
            boxSizing: "border-box",
            opacity: useEase(cues.chame + 20, 12),
            // destaque enquanto o número é falado
            boxShadow: `0 0 0 ${6 * phone}px rgba(255,107,0,0.9)`,
            scale: String(1 + 0.03 * phone),
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: 34,
              color: C.grey,
            }}
          >
            celular
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 64,
              color: C.text,
              letterSpacing: "-0.02em",
            }}
          >
            (62) 99113-2531
          </div>
        </div>
        <div style={{ height: 34 }} />
        <div
          style={{
            width: 900,
            height: 150,
            borderRadius: 40,
            background: C.orange,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            scale: String(press * useSpring(cues.chame + 28, 14, 180)),
          }}
        >
          <Img src={staticFile("img/whatsapp.png")} style={{ width: 84 }} />
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 52,
              color: C.white,
              letterSpacing: "-0.02em",
            }}
          >
            Solicite seu orçamento
          </div>
        </div>
      </div>
    </Shot>
  );
};
