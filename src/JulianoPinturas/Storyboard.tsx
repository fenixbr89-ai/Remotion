import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { z } from "zod";
import { AppIcon, Chip, Glass, Product, T, Wallpaper } from "./kit";
import { C, FONT, ORANGE_GRADIENT } from "./theme";

/*
 * Storyboard estático das animações propostas (não entra no vídeo).
 * Cada quadro é uma tela 1080x1920 reduzida; renderize com `remotion still` no frame 60.
 */

const Hand: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => (
  <svg
    width={170 * scale}
    height={190 * scale}
    viewBox="0 0 170 190"
    style={{
      position: "absolute",
      left: x,
      top: y,
      rotate: "-18deg",
      filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.25))",
    }}
  >
    <path
      d="M58 100 V22 a16 16 0 0 1 32 0 V82 l6 -4 a15 15 0 0 1 22 6 l2 4 a15 15 0 0 1 22 8 l1 4 a14 14 0 0 1 20 10 V140 c0 28 -22 44 -50 44 h-14 c-20 0 -34 -10 -46 -26 L22 122 a15 15 0 0 1 24 -18 Z"
      fill={C.white}
      stroke={C.text}
      strokeWidth={8}
      strokeLinejoin="round"
    />
  </svg>
);

const Arrow: React.FC<{
  x: number;
  y: number;
  dir?: "left" | "up";
  color?: string;
}> = ({ x, y, dir = "left", color = C.orange }) => (
  <svg
    width={200}
    height={200}
    viewBox="0 0 200 200"
    style={{
      position: "absolute",
      left: x,
      top: y,
      rotate: dir === "up" ? "90deg" : "0deg",
    }}
  >
    <path
      d="M180 100 H30 M80 50 L30 100 L80 150"
      fill="none"
      stroke={color}
      strokeWidth={16}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------- final: WhatsApp ---------- */

const ContactSheetMock: React.FC<{ pressed?: boolean }> = ({ pressed }) => (
  <AbsoluteFill style={{ background: "#0B0B0C" }}>
    <Wallpaper dark />
    <div style={{ position: "absolute", top: 240, width: "100%" }}>
      <T size={56} weight={600} color={C.grey}>
        Precisou de algum serviço?
      </T>
      <T size={96} color={C.white}>
        Chame Juliano Pinturas.
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 30,
      }}
    >
      <div
        style={{ width: 110, height: 12, borderRadius: 6, background: C.hair }}
      />
      <Img
        src={staticFile("img/logo.png")}
        style={{ width: 420, marginTop: 60 }}
      />
      <div style={{ height: 40 }} />
      <T size={72}>Juliano Pinturas</T>
      <div style={{ height: 50 }} />
      <div
        style={{
          width: 900,
          borderRadius: 40,
          background: C.light,
          padding: "30px 44px",
          boxSizing: "border-box",
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
          scale: pressed ? "0.95" : "1",
          filter: pressed ? "brightness(0.9)" : undefined,
        }}
      >
        <Img src={staticFile("img/whatsapp.png")} style={{ width: 84 }} />
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 52,
            color: C.white,
          }}
        >
          Solicite seu orçamento
        </div>
      </div>
    </div>
    {pressed ? <Hand x={560} y={1640} scale={1.4} /> : null}
  </AbsoluteFill>
);

const Bubble: React.FC<{
  me?: boolean;
  children: React.ReactNode;
  meta?: string;
}> = ({ me, children, meta }) => (
  <div
    style={{
      alignSelf: me ? "flex-end" : "flex-start",
      maxWidth: 760,
      background: me ? "#D9FDD3" : C.white,
      borderRadius: 34,
      padding: "24px 32px 16px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
      fontFamily: FONT,
    }}
  >
    <div
      style={{ fontSize: 50, fontWeight: 500, color: "#111", lineHeight: 1.25 }}
    >
      {children}
    </div>
    {meta ? (
      <div
        style={{
          fontSize: 30,
          color: "#667781",
          textAlign: "right",
          marginTop: 6,
        }}
      >
        {meta}
      </div>
    ) : null}
  </div>
);

const ChatMock: React.FC<{ stage: 1 | 2 }> = ({ stage }) => (
  <AbsoluteFill style={{ background: "#EFE7DD", fontFamily: FONT }}>
    {/* cabeçalho */}
    <div
      style={{
        height: 250,
        background: "#F6F6F6",
        display: "flex",
        alignItems: "flex-end",
        padding: "0 40px 30px",
        boxSizing: "border-box",
        gap: 28,
        borderBottom: "1.5px solid #DDD",
      }}
    >
      <svg width={40} height={70} viewBox="0 0 40 70">
        <path
          d="M34 6 L8 35 L34 64"
          fill="none"
          stroke="#0A84FF"
          strokeWidth={8}
          strokeLinecap="round"
        />
      </svg>
      <Img
        src={staticFile("img/logo.png")}
        style={{ width: 110, height: 110, borderRadius: 26 }}
      />
      <div>
        <div style={{ fontSize: 50, fontWeight: 700, color: C.text }}>
          Juliano Pinturas
        </div>
        <div style={{ fontSize: 36, color: stage === 2 ? "#25D366" : C.grey }}>
          {stage === 2 ? "digitando…" : "online"}
        </div>
      </div>
    </div>
    <div
      style={{
        padding: "60px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {stage === 2 ? (
        <Bubble me meta="9:41 ✓✓">
          Olá, gostaria de um orçamento!
        </Bubble>
      ) : null}
      {stage === 2 ? (
        <div
          style={{
            alignSelf: "flex-start",
            background: C.white,
            borderRadius: 34,
            padding: "30px 40px",
            display: "flex",
            gap: 14,
          }}
        >
          {[0.9, 0.6, 0.3].map((o) => (
            <div
              key={o}
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                background: `rgba(0,0,0,${o * 0.5})`,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
    {/* barra de digitação */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 210,
        background: "#F6F6F6",
        display: "flex",
        alignItems: "flex-start",
        padding: "30px 30px",
        boxSizing: "border-box",
        gap: 22,
      }}
    >
      <div
        style={{
          flex: 1,
          height: 100,
          borderRadius: 50,
          background: C.white,
          border: "1.5px solid #DDD",
          display: "flex",
          alignItems: "center",
          padding: "0 36px",
          fontSize: 44,
          color: stage === 1 ? "#111" : "#AAA",
        }}
      >
        {stage === 1 ? "Olá, gostaria de um orçame|" : "Mensagem"}
      </div>
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={50} height={50} viewBox="0 0 50 50">
          <path d="M6 25 L44 8 L34 44 L24 28 Z" fill={C.white} />
        </svg>
      </div>
    </div>
  </AbsoluteFill>
);

const EndCardMock = () => (
  <AbsoluteFill
    style={{
      background: C.white,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Img
      src={staticFile("img/logo.png")}
      style={{
        width: 560,
        filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.15))",
      }}
    />
    <div style={{ height: 60 }} />
    <T size={84}>Juliano Pinturas</T>
    <div style={{ height: 60 }} />
    <T size={72} color={C.text}>
      Várias soluções,
    </T>
    <T size={72} gradient>
      em um só lugar.
    </T>
  </AbsoluteFill>
);

/* ---------- swipe entre serviços ---------- */

const ShowcaseMock: React.FC<{
  eyebrow: string;
  title: string;
  sub: string;
  img: string;
  width: number;
  chips: string[];
}> = ({ eyebrow, title, sub, img, width, chips }) => (
  <AbsoluteFill style={{ background: C.white }}>
    <div style={{ position: "absolute", top: 250, width: "100%" }}>
      <T size={42} weight={600} color={C.orange}>
        {eyebrow}
      </T>
      <div style={{ height: 18 }} />
      <T size={104}>{title}</T>
      <div style={{ height: 22 }} />
      <T size={44} weight={500} color={C.grey}>
        {sub}
      </T>
    </div>
    <Product src={img} width={width} y={1100} />
    <div
      style={{
        position: "absolute",
        top: 1600,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: 20,
      }}
    >
      {chips.map((c) => (
        <Chip key={c}>{c}</Chip>
      ))}
    </div>
  </AbsoluteFill>
);

const PINTURA = {
  eyebrow: "Pintura",
  title: "Cor nova.\nCasa nova.",
  sub: "Pintura residencial e comercial.",
  img: "img/house.png",
  width: 700,
  chips: ["Residencial", "Comercial"],
};
const AUTO = {
  eyebrow: "Pintura automotiva",
  title: "Acabamento\nde especialista.",
  sub: "Seu carro como novo.",
  img: "img/car.png",
  width: 580,
  chips: ["Pintura", "Retoques"],
};

const SwipeMid = () => (
  <AbsoluteFill style={{ background: C.white, overflow: "hidden" }}>
    <AbsoluteFill
      style={{ translate: "-560px 0", filter: "blur(6px)", opacity: 0.8 }}
    >
      <ShowcaseMock {...PINTURA} />
    </AbsoluteFill>
    <AbsoluteFill style={{ translate: "520px 0", filter: "blur(4px)" }}>
      <ShowcaseMock {...AUTO} />
    </AbsoluteFill>
    <Arrow x={440} y={1700} />
  </AbsoluteFill>
);

/* ---------- animação de cada serviço ---------- */

const PinturaRoller = () => (
  <AbsoluteFill style={{ background: C.white }}>
    <div style={{ position: "absolute", top: 250, width: "100%" }}>
      <T size={42} weight={600} color={C.orange}>
        Pintura
      </T>
      <T size={104}>{"Cor nova.\nCasa nova."}</T>
    </div>
    {/* faixa de tinta deixada pelo rolo */}
    <div
      style={{
        position: "absolute",
        left: -40,
        top: 980,
        width: 760,
        height: 300,
        background: ORANGE_GRADIENT,
        borderRadius: "0 40px 40px 0",
        rotate: "-6deg",
      }}
    />
    <Img
      src={staticFile("img/house.png")}
      style={{
        position: "absolute",
        left: 160,
        top: 860,
        width: 560,
        opacity: 0.85,
      }}
    />
    <Img
      src={staticFile("img/roller.png")}
      style={{
        position: "absolute",
        left: 640,
        top: 820,
        width: 420,
        rotate: "-20deg",
      }}
    />
  </AbsoluteFill>
);

const TijolosSubindo = () => (
  <AbsoluteFill style={{ background: C.white }}>
    <div style={{ position: "absolute", top: 250, width: "100%" }}>
      <T size={42} weight={600} color={C.orange}>
        Pequenas reformas
      </T>
      <T size={104}>{"Do reparo\nao acabamento."}</T>
    </div>
    <div
      style={{
        position: "absolute",
        left: 210,
        top: 900,
        width: 660,
        clipPath: "inset(38% 0 0 0)",
      }}
    >
      <Img src={staticFile("img/bricks.png")} style={{ width: "100%" }} />
    </div>
    <Arrow x={440} y={1420} dir="up" color={C.hair} />
  </AbsoluteFill>
);

const Drop: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({
  x,
  y,
  s = 1,
  o = 1,
}) => (
  <svg
    width={40 * s}
    height={60 * s}
    viewBox="0 0 40 60"
    style={{ position: "absolute", left: x, top: y, opacity: o }}
  >
    <path
      d="M20 2 C28 18 38 30 38 40 a18 18 0 0 1 -36 0 C2 30 12 18 20 2 Z"
      fill="#3FB6E8"
    />
  </svg>
);

const ChuveiroGotas = () => (
  <AbsoluteFill style={{ background: C.white }}>
    <div style={{ position: "absolute", top: 250, width: "100%" }}>
      <T size={42} weight={600} color={C.orange}>
        Hidráulica
      </T>
      <T size={104}>{"Sem vazamento.\nSem goteira."}</T>
    </div>
    <Img
      src={staticFile("img/shower.png")}
      style={{ position: "absolute", left: 200, top: 760, width: 560 }}
    />
    {[
      [560, 1240, 1, 1],
      [640, 1330, 0.9, 0.85],
      [500, 1380, 1.1, 0.7],
      [600, 1480, 0.8, 0.55],
      [690, 1560, 1, 0.4],
      [530, 1620, 0.9, 0.3],
    ].map(([x, y, s, o], i) => (
      <Drop key={i} x={x} y={y} s={s} o={o} />
    ))}
  </AbsoluteFill>
);

const LampadaAcesa = () => (
  <AbsoluteFill style={{ background: "#FFFBEF" }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse at 50% 58%, rgba(255,214,0,0.55) 0%, rgba(255,214,0,0) 45%)",
      }}
    />
    <div style={{ position: "absolute", top: 250, width: "100%" }}>
      <T size={42} weight={600} color={C.orange}>
        Elétrica
      </T>
      <T size={104}>{"Tudo ligado.\nDo jeito certo."}</T>
    </div>
    <Img
      src={staticFile("img/bulb.png")}
      style={{
        position: "absolute",
        left: 250,
        top: 820,
        width: 580,
        filter: "brightness(1.12) drop-shadow(0 0 60px rgba(255,200,0,0.9))",
      }}
    />
  </AbsoluteFill>
);

/* ---------- notificação + apps ---------- */

const NotifCard: React.FC<{ expanded?: boolean }> = ({ expanded }) => (
  <Glass radius={52} style={{ padding: "34px 38px" }}>
    <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
      <Img
        src={staticFile("img/logo.png")}
        style={{ width: 116, height: 116 }}
      />
      <div style={{ fontFamily: FONT, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 700, fontSize: 40, color: C.text }}>
            Juliano Pinturas
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
          Pintura, reformas e manutenção. Peça seu orçamento.
        </div>
      </div>
    </div>
    {expanded ? (
      <div
        style={{
          display: "flex",
          gap: 18,
          marginTop: 34,
          justifyContent: "center",
        }}
      >
        {["Casa", "Carro", "Reforma"].map((l, i) => (
          <div
            key={l}
            style={{
              width: 250,
              height: 250,
              borderRadius: 36,
              background: C.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img
              src={staticFile(
                ["img/house.png", "img/car.png", "img/bricks.png"][i],
              )}
              style={{ width: "80%" }}
            />
          </div>
        ))}
      </div>
    ) : null}
  </Glass>
);

const NotifPress = () => (
  <AbsoluteFill>
    <Wallpaper />
    <div style={{ position: "absolute", top: 230, width: "100%" }}>
      <T size={44} weight={600} color="rgba(29,29,31,0.7)">
        Hoje
      </T>
      <T size={260} weight={600} color="rgba(29,29,31,0.85)">
        9:41
      </T>
    </div>
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 680,
        scale: "0.97",
      }}
    >
      <NotifCard />
    </div>
    <Hand x={640} y={760} scale={1.4} />
  </AbsoluteFill>
);

const NotifExpanded = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ filter: "blur(30px)" }}>
      <Wallpaper />
    </AbsoluteFill>
    <AbsoluteFill style={{ background: "rgba(255,255,255,0.25)" }} />
    <div style={{ position: "absolute", left: 50, right: 50, top: 520 }}>
      <NotifCard expanded />
    </div>
    <div style={{ position: "absolute", left: 50, right: 50, top: 1220 }}>
      <Glass
        radius={40}
        style={{ fontFamily: FONT, fontSize: 46, fontWeight: 500 }}
      >
        {["Pedir orçamento", "Responder", "Abrir no WhatsApp"].map((a, i) => (
          <div
            key={a}
            style={{
              padding: "34px 44px",
              borderTop: i ? `1.5px solid ${C.hair}` : "none",
              color: i === 0 ? C.orange : C.text,
              fontWeight: i === 0 ? 700 : 500,
            }}
          >
            {a}
          </div>
        ))}
      </Glass>
    </div>
  </AbsoluteFill>
);

const AppsJiggle = () => {
  const items = [
    ["Pintura", "img/house.png"],
    ["Automotiva", "img/car.png"],
    ["Reformas", "img/bricks.png"],
    ["Hidráulica", "img/shower.png"],
    ["Elétrica", "img/bulb.png"],
  ];
  return (
    <AbsoluteFill>
      <Wallpaper />
      <div style={{ position: "absolute", top: 300, width: "100%" }}>
        <T size={84}>Um app para cada</T>
        <T size={84} gradient>
          necessidade.
        </T>
      </div>
      {items.map(([l, src], i) => (
        <div
          key={l}
          style={{
            position: "absolute",
            left: 105 + (i % 3) * 320,
            top: 640 + Math.floor(i / 3) * 370,
            width: 230,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            rotate: `${[-3, 2.5, -2, 3, -2.5][i]}deg`,
            scale: i === 0 ? "0.9" : "1",
          }}
        >
          <AppIcon size={230} bg={C.white}>
            <Img src={staticFile(src)} style={{ width: "78%" }} />
          </AppIcon>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 36,
              color: C.text,
            }}
          >
            {l}
          </div>
        </div>
      ))}
      <Hand x={200} y={760} scale={1.3} />
    </AbsoluteFill>
  );
};

/* ---------- registro ---------- */

const FRAMES: Record<string, React.FC> = {
  "final-1": () => <ContactSheetMock pressed />,
  "final-2": () => <ChatMock stage={1} />,
  "final-3": () => <ChatMock stage={2} />,
  "final-4": EndCardMock,
  "swipe-1": () => <ShowcaseMock {...PINTURA} />,
  "swipe-2": SwipeMid,
  "swipe-3": () => <ShowcaseMock {...AUTO} />,
  "svc-1": PinturaRoller,
  "svc-2": TijolosSubindo,
  "svc-3": ChuveiroGotas,
  "svc-4": LampadaAcesa,
  "ui-1": NotifPress,
  "ui-2": NotifExpanded,
  "ui-3": AppsJiggle,
};

export const storyboardSchema = z.object({ quadro: z.string() });

export const StoryboardFrame: React.FC<z.infer<typeof storyboardSchema>> = ({
  quadro,
}) => {
  const F = FRAMES[quadro] ?? EndCardMock;
  return (
    <AbsoluteFill style={{ background: C.white, overflow: "hidden" }}>
      <F />
    </AbsoluteFill>
  );
};
