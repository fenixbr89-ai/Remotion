import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  Glass,
  Product,
  Sfx,
  Shot,
  T,
  useEase,
  useSpring,
  Wallpaper,
} from "./kit";
import { C, CLAMP, EASE, FONT, ORANGE_GRADIENT } from "./theme";

const WORDS = ["pintura?", "reformas?", "manutenção?"];
const LINE = 170;

/** Kinetic typography: "Precisando de" + roleta vertical de palavras. */
const Hook = () => {
  const s1 = useSpring(15, 16, 220);
  const s2 = useSpring(30, 16, 220);
  const line = useEase(42, 18);
  const idx = s1 + s2;
  return (
    <Shot dur={75} bg={C.black}>
      <div style={{ position: "absolute", top: 700, width: "100%" }}>
        <T size={64} weight={600} color={C.grey}>
          Precisando de
        </T>
        <div style={{ height: LINE, overflow: "hidden", marginTop: 16 }}>
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
          style={{ width: 116, height: 116, borderRadius: 28, flexShrink: 0 }}
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
const LockScreen = () => {
  const frame = useCurrentFrame();
  const island = interpolate(frame, [6, 14, 26, 34], [0, 1, 1, 0], {
    ...CLAMP,
    easing: EASE,
  });
  const zoom = interpolate(frame, [64, 90], [1, 2.6], {
    ...CLAMP,
    easing: (t) => t * t * t,
  });
  const blur = interpolate(frame, [74, 90], [0, 20], CLAMP);
  return (
    <Shot dur={90} bg="#F2EEEA" out={false}>
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
          delay={14}
          y={680}
          title="Juliano Pinturas"
          body="Pintura, reformas e manutenção. Peça seu orçamento."
        />
        <Notification
          delay={34}
          y={950}
          title="Juliano Pinturas"
          body="Hidráulica e elétrica também. Tudo em um só lugar."
        />
      </AbsoluteFill>
    </Shot>
  );
};

/** Product showcase da logo original (sem alterações). */
const LogoShowcase = () => (
  <Shot dur={90} bg={C.black}>
    <div style={{ position: "absolute", top: 250, width: "100%" }}>
      <T size={50} weight={600} color={C.grey} delay={4}>
        Prestadora de serviços
      </T>
      <div style={{ height: 14 }} />
      <T size={104} color={C.white} delay={8}>
        O Juliano Pinturas.
      </T>
    </div>
    <Product src="img/logo.png" width={640} y={1060} dark />
  </Shot>
);

export const Abertura: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    <Sequence name="Hook (tipografia)" durationInFrames={75}>
      <Hook />
    </Sequence>
    <Sequence
      name="Tela de bloqueio + notificações"
      from={75}
      durationInFrames={90}
    >
      <LockScreen />
    </Sequence>
    <Sequence name="Logo (product showcase)" from={165} durationInFrames={90}>
      <LogoShowcase />
    </Sequence>

    <Sfx at={15} src="click.wav" volume={0.25} />
    <Sfx at={30} src="click.wav" volume={0.25} />
    <Sfx at={89} src="ding.wav" volume={0.35} />
    <Sfx at={109} src="ding.wav" volume={0.25} />
    <Sfx at={140} src="whoosh.wav" volume={0.3} />
  </AbsoluteFill>
);
