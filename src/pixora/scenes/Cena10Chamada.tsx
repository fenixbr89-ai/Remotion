import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, DrawPath, EASE_IN_OUT, Emoji, IPhone, Kinetic, prog, useSpring } from "../ui";

/** Frame (local) em que a câmera começa a entrar no celular. */
export const ZOOM_AT = 156;
const PHONE = { left: 90, top: 560, width: 400, height: 820 };
const SCREEN_CENTER = `${PHONE.left + PHONE.width / 2}px ${PHONE.top + PHONE.height / 2}px`;

// 49–55s · CTA com seta desenhada; no fim a câmera entra no celular, que escurece (→ logo).
export const Cena10Chamada: React.FC = () => {
  const frame = useCurrentFrame();
  const phone = useSpring(12, 20);
  const arrow = prog(frame, 54, 26);
  const head = prog(frame, 78, 10);
  const cursor = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;
  const zoom = interpolate(frame, [ZOOM_AT, 190], [1, 6.2], { ...CLAMP, easing: EASE_IN_OUT });
  const dark = interpolate(frame, [ZOOM_AT + 8, ZOOM_AT + 26], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <AbsoluteFill style={{ transformOrigin: SCREEN_CENTER, scale: String(zoom) }}>
        <div style={{ position: "absolute", top: 200, left: 60, right: 60 }}>
          <Kinetic
            delay={14}
            stagger={4}
            outAt={ZOOM_AT - 6}
            lines={[
              { text: "Bora fazer", size: 96, color: C.sub },
              { text: "o seu vídeo?", size: 112 },
            ]}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: PHONE.left,
            top: PHONE.top,
            translate: `${(1 - phone) * -700}px 0px`,
          }}
        >
          <IPhone width={PHONE.width} height={PHONE.height} screen={C.gray}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                translate: "-50% -50%",
                width: 6,
                height: 64,
                borderRadius: 3,
                background: C.blue,
                opacity: cursor * (1 - dark),
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: C.black, opacity: dark }} />
          </IPhone>
        </div>

        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0, opacity: 1 - prog(frame, ZOOM_AT - 6, 10) }}
        >
          <DrawPath
            d="M820 820C840 920 780 1020 660 1050C610 1063 565 1055 525 1040"
            progress={arrow}
            length={420}
            color={C.ink}
            width={8}
          />
          <DrawPath
            d="M560 1000L523 1039L568 1072"
            progress={head}
            length={110}
            color={C.ink}
            width={8}
          />
        </svg>

        <div style={{ position: "absolute", left: 540, right: 40, top: 1130 }}>
          <Kinetic
            delay={88}
            stagger={4}
            outAt={ZOOM_AT - 4}
            align="flex-start"
            lines={[
              { text: "Tô te esperando", size: 52 },
              { text: "aqui", size: 52 },
            ]}
            lineHeight={1.2}
            trailing={
              <span
                style={{
                  display: "inline-block",
                  marginLeft: 12,
                  opacity: prog(frame, 100, 10) * (1 - prog(frame, ZOOM_AT - 4, 8)),
                  scale: String(prog(frame, 100, 14)),
                }}
              >
                <Emoji char="👀" size={56} />
              </span>
            }
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
