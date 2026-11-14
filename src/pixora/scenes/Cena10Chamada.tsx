import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BlurIn, C, DrawPath, Emoji, FONT, IPhone, Title, WordByWord, prog, useSpring } from "../ui";

// 49–55s · iPhone vazio à esquerda, CTA e seta desenhada à mão.
export const Cena10Chamada: React.FC = () => {
  const frame = useCurrentFrame();
  const phone = useSpring(10, 20);
  const arrow = prog(frame, 52, 28);
  const head = prog(frame, 76, 10);
  const cursor = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;

  return (
    <AbsoluteFill style={{ background: C.white }}>
      <div style={{ position: "absolute", top: 260, left: 80, right: 80 }}>
        <Title>
          <WordByWord text="Bora fazer o seu vídeo?" delay={14} stagger={5} />
        </Title>
      </div>

      <div
        style={{
          position: "absolute",
          left: 100,
          top: 600,
          translate: `${(1 - phone) * -700}px 0px`,
        }}
      >
        <IPhone width={380} height={780} screen={C.gray}>
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
              opacity: cursor,
            }}
          />
        </IPhone>
      </div>

      {/* seta desenhada à mão apontando para o celular */}
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <DrawPath
          d="M800 760C820 860 760 960 640 990C590 1003 545 995 505 980"
          progress={arrow}
          length={420}
          color={C.ink}
          width={8}
        />
        <DrawPath
          d="M540 940L503 979L548 1012"
          progress={head}
          length={110}
          color={C.ink}
          width={8}
        />
      </svg>

      <div style={{ position: "absolute", left: 520, right: 40, top: 1080 }}>
        <BlurIn delay={88}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 46,
              fontWeight: 600,
              color: C.ink,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Tô te esperando<br />aqui <Emoji char="👀" size={50} />
          </div>
        </BlurIn>
      </div>
    </AbsoluteFill>
  );
};
