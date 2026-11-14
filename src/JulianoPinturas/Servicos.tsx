import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  Chip,
  Glass,
  Product,
  Sfx,
  Shot,
  T,
  useSpring,
  Wallpaper,
} from "./kit";
import { C, CLAMP, EASE, FONT, ORANGE_GRADIENT } from "./theme";

type Servico = {
  nome: string;
  eyebrow: string;
  titulo: string;
  sub: string;
  chips: string[];
  img: string;
  width: number;
  dark: boolean;
};

// Os 5 serviços principais
const SERVICOS: Servico[] = [
  {
    nome: "Pintura",
    eyebrow: "Pintura",
    titulo: "Cor nova.\nCasa nova.",
    sub: "Pintura residencial e comercial.",
    chips: ["Residencial", "Comercial"],
    img: "img/house.png",
    width: 700,
    dark: false,
  },
  {
    nome: "Automotiva",
    eyebrow: "Pintura automotiva",
    titulo: "Acabamento\nde especialista.",
    sub: "Seu carro como novo.",
    chips: ["Pintura", "Retoques"],
    img: "img/car.png",
    width: 580,
    dark: false,
  },
  {
    nome: "Reformas",
    eyebrow: "Pequenas reformas",
    titulo: "Do reparo\nao acabamento.",
    sub: "Rápido, limpo e bem feito.",
    chips: ["Alvenaria", "Reparos"],
    img: "img/bricks.png",
    width: 660,
    dark: false,
  },
  {
    nome: "Hidráulica",
    eyebrow: "Hidráulica",
    titulo: "Sem vazamento.\nSem goteira.",
    sub: "Instalações e caixas d'água.",
    chips: ["Vazamentos", "Caixas d'água"],
    img: "img/shower.png",
    width: 600,
    dark: false,
  },
  {
    nome: "Elétrica",
    eyebrow: "Elétrica",
    titulo: "Tudo ligado.\nDo jeito certo.",
    sub: "Instalações e reparos elétricos.",
    chips: ["Instalações", "Reparos"],
    img: "img/bulb.png",
    width: 560,
    dark: false,
  },
];

// Cartões de serviço: 3 em cima, 2 centralizados embaixo
const CARD_W = 290;
const CARD_H = 340;
const CARD_GAP = 40;
const cardPos = (i: number) => {
  const row = i < 3 ? 0 : 1;
  const inRow = row === 0 ? 3 : 2;
  const col = row === 0 ? i : i - 3;
  const left = (1080 - (inRow * CARD_W + (inRow - 1) * CARD_GAP)) / 2;
  return {
    x: left + col * (CARD_W + CARD_GAP),
    y: 680 + row * (CARD_H + CARD_GAP),
  };
};

/** Os serviços em cartões; o primeiro é tocado e se expande para a vitrine. */
const ServiceCards = () => {
  const frame = useCurrentFrame();
  const press = interpolate(frame, [48, 52, 58], [1, 0.92, 1], CLAMP);
  const open = interpolate(frame, [56, 78], [0, 1], { ...CLAMP, easing: EASE });
  const first = cardPos(0);
  return (
    <Shot dur={90} bg={C.light} out={false}>
      <div style={{ position: "absolute", top: 320, width: "100%" }}>
        <T size={88} delay={2}>
          Um só profissional.
        </T>
        <T size={88} delay={6} gradient>
          Vários serviços.
        </T>
      </div>
      {SERVICOS.map((sv, i) => (
        <Card
          key={sv.nome}
          i={i}
          label={sv.nome}
          img={sv.img}
          press={press}
          open={open}
        />
      ))}
      {/* o cartão tocado se expande até ocupar a tela */}
      {open > 0 ? (
        <div
          style={{
            position: "absolute",
            left: first.x * (1 - open),
            top: first.y * (1 - open),
            width: CARD_W + (1080 - CARD_W) * open,
            height: CARD_H + (1920 - CARD_H) * open,
            borderRadius: 44 * (1 - open),
            background: C.white,
          }}
        />
      ) : null}
    </Shot>
  );
};

const Card: React.FC<{
  i: number;
  label: string;
  img: string;
  press: number;
  open: number;
}> = ({ i, label, img, press, open }) => {
  const s = useSpring(6 + i * 3, 13, 180);
  const { x, y } = cardPos(i);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: CARD_W,
        height: CARD_H,
        borderRadius: 44,
        background: C.white,
        boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        scale: String(s * (i === 0 ? press : 1)),
        opacity: Math.min(1, s * 2) * (i === 0 ? 1 : 1 - open),
      }}
    >
      <Img
        src={staticFile(img)}
        style={{ width: 200, height: 200, objectFit: "contain" }}
      />
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 38,
          color: C.text,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/** Animação própria de cada serviço (o objeto "faz" o serviço). */
const Visual: React.FC<{ s: Servico }> = ({ s }) => {
  const frame = useCurrentFrame();
  if (s.nome === "Pintura") {
    // o rolo atravessa a tela e deixa uma faixa laranja atrás da casa
    const rx = interpolate(frame, [2, 22], [-420, 1180], {
      ...CLAMP,
      easing: EASE,
    });
    return (
      <>
        <div
          style={{
            position: "absolute",
            left: -60,
            top: 1010,
            width: Math.max(0, rx + 60),
            height: 230,
            background: ORANGE_GRADIENT,
            borderRadius: "0 120px 120px 0",
            rotate: "-5deg",
            transformOrigin: "left center",
          }}
        />
        <Product src={s.img} width={s.width} y={1060} delay={12} fade={false} />
        <Img
          src={staticFile("img/roller.png")}
          style={{
            position: "absolute",
            left: rx - 200,
            top: 880,
            width: 380,
            rotate: "-18deg",
            opacity: interpolate(frame, [18, 24], [1, 0], CLAMP),
          }}
        />
      </>
    );
  }
  if (s.nome === "Automotiva") {
    // o carro entra deslizando, freia com balanço e um reflexo passa pela lataria
    const cx = interpolate(frame, [2, 16], [-700, 0], {
      ...CLAMP,
      easing: EASE,
    });
    const tilt = interpolate(frame, [12, 17, 24], [0, -4, 0], CLAMP);
    const shine = interpolate(frame, [22, 40], [-60, 160], CLAMP);
    const blur = interpolate(frame, [2, 14], [18, 0], CLAMP);
    const float = Math.sin(frame / 16) * 10;
    const car = staticFile("img/car.png");
    return (
      <div
        style={{
          position: "absolute",
          left: 540 - s.width / 2 + cx,
          top: 1100 - s.width / 2 + float,
          width: s.width,
          rotate: `${tilt}deg`,
          transformOrigin: "50% 90%",
          filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
        }}
      >
        <Img src={car} style={{ width: "100%", display: "block" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(110deg, rgba(255,255,255,0) ${shine - 18}%, rgba(255,255,255,0.75) ${shine}%, rgba(255,255,255,0) ${shine + 18}%)`,
            maskImage: `url(${car})`,
            WebkitMaskImage: `url(${car})`,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            mixBlendMode: "screen",
          }}
        />
      </div>
    );
  }
  if (s.nome === "Reformas") {
    // os tijolos sobem de baixo para cima, como uma parede sendo erguida
    const top = interpolate(frame, [4, 26], [1340, 820], {
      ...CLAMP,
      easing: EASE,
    });
    return (
      <AbsoluteFill style={{ clipPath: `inset(${top}px 0 0 0)` }}>
        <Product src={s.img} width={s.width} y={1100} delay={0} />
      </AbsoluteFill>
    );
  }
  if (s.nome === "Hidráulica") {
    // gotas caindo do chuveiro sem parar
    return (
      <>
        <Product src={s.img} width={s.width} y={1000} delay={2} />
        {Array.from({ length: 9 }).map((_, k) => {
          const t = ((frame - 8 + k * 7) % 28) / 28;
          if (frame < 8 + (k % 3) * 3) return null;
          const x = 600 + ((k * 53) % 150) - 30 + t * 40;
          return (
            <svg
              key={k}
              width={34}
              height={50}
              viewBox="0 0 40 60"
              style={{
                position: "absolute",
                left: x,
                top: 1180 + t * 300,
                opacity: 1 - t,
              }}
            >
              <path
                d="M20 2 C28 18 38 30 38 40 a18 18 0 0 1 -36 0 C2 30 12 18 20 2 Z"
                fill="#3FB6E8"
              />
            </svg>
          );
        })}
      </>
    );
  }
  // Elétrica: a lâmpada pisca e acende
  const flick = [0.25, 0.25, 1, 0.3, 0.3, 1, 1, 0.5, 1];
  const k = Math.floor((frame - 6) / 2);
  const on = frame < 6 ? 0.25 : k < flick.length ? flick[k] : 1;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        filter: `brightness(${0.75 + 0.35 * on}) drop-shadow(0 0 ${60 * on}px rgba(255,200,0,${0.9 * on}))`,
      }}
    >
      <Product src={s.img} width={s.width} y={1100} delay={0} />
    </div>
  );
};

/** Product showcase de um serviço. */
const Showcase: React.FC<{ s: Servico; out: boolean }> = ({ s, out }) => {
  const fg = s.dark ? C.white : C.text;
  return (
    <Shot dur={72} bg={s.dark ? C.black : C.white} out={out}>
      <div style={{ position: "absolute", top: 250, width: "100%" }}>
        <T size={42} weight={600} color={C.orange} dur={10}>
          {s.eyebrow}
        </T>
        <div style={{ height: 18 }} />
        <T size={104} color={fg} delay={3}>
          {s.titulo}
        </T>
        <div style={{ height: 22 }} />
        <T size={44} weight={500} color={C.grey} delay={7}>
          {s.sub}
        </T>
      </div>
      <Visual s={s} />
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
        {s.chips.map((c, i) => (
          <Chip key={c} dark={s.dark} delay={16 + i * 3}>
            {c}
          </Chip>
        ))}
      </div>
    </Shot>
  );
};

const SHOW = 60; // 2s por serviço
const SWIPE = 12; // duração do deslize entre serviços

/** Deslize lateral (estilo iOS) entre os serviços. */
const Carrossel = () => {
  const frame = useCurrentFrame();
  let pos = 0;
  let speed = 0;
  for (let k = 1; k < SERVICOS.length; k++) {
    const a = k * SHOW - SWIPE / 2;
    pos += interpolate(frame, [a, a + SWIPE], [0, 1], {
      ...CLAMP,
      easing: Easing.bezier(0.65, 0, 0.35, 1),
    });
    speed += interpolate(
      frame,
      [a, a + SWIPE / 2, a + SWIPE],
      [0, 1, 0],
      CLAMP,
    );
  }
  return (
    <AbsoluteFill style={{ background: C.white, overflow: "hidden" }}>
      {SERVICOS.map((s, i) => {
        const start = i === 0 ? 0 : i * SHOW - SWIPE / 2;
        return (
          <Sequence
            key={s.nome}
            name={s.nome}
            from={start}
            durationInFrames={SHOW + SWIPE}
            layout="none"
          >
            <AbsoluteFill
              style={{
                translate: `${(i - pos) * 1080}px 0`,
                filter: speed > 0.05 ? `blur(${speed * 10}px)` : undefined,
              }}
            >
              <Showcase s={s} out={i === SERVICOS.length - 1} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const Glyph: React.FC<{ kind: "roof" | "spark" | "tv" | "leaf" }> = ({
  kind,
}) => {
  const st = {
    fill: "none",
    stroke: C.white,
    strokeWidth: 9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;
  return (
    <svg width={70} height={70} viewBox="0 0 100 100">
      {kind === "roof" ? (
        <path d="M12 52 L50 18 L88 52 M24 44 V84 H76 V44" {...st} />
      ) : null}
      {kind === "spark" ? (
        <path
          d="M50 12 C54 36 64 46 88 50 C64 54 54 64 50 88 C46 64 36 54 12 50 C36 46 46 36 50 12 Z"
          {...st}
        />
      ) : null}
      {kind === "tv" ? (
        <>
          <rect x={10} y={20} width={80} height={52} rx={8} {...st} />
          <path d="M34 86 H66" {...st} />
        </>
      ) : null}
      {kind === "leaf" ? (
        <path
          d="M20 80 C20 40 45 18 84 16 C82 56 60 80 20 80 Z M20 80 L56 44"
          {...st}
        />
      ) : null}
    </svg>
  );
};

const WIDGETS: { label: string; kind: "roof" | "spark" | "tv" | "leaf" }[] = [
  { label: "Telhados\ne calhas", kind: "roof" },
  { label: "Limpeza\npós-obra", kind: "spark" },
  { label: "Instalação\nde TVs", kind: "tv" },
  { label: "Capina e\njardinagem", kind: "leaf" },
];

const Widget: React.FC<{
  i: number;
  label: string;
  kind: "roof" | "spark" | "tv" | "leaf";
}> = ({ i, label, kind }) => {
  const s = useSpring(10 + i * 4, 13, 170);
  return (
    <div style={{ scale: String(s), opacity: Math.min(1, s * 2) }}>
      <Glass
        radius={64}
        style={{
          width: 420,
          height: 420,
          padding: 44,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: C.orange,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Glyph kind={kind} />
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 52,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: C.text,
            whiteSpace: "pre-line",
          }}
        >
          {label}
        </div>
      </Glass>
    </div>
  );
};

/** UI: widgets com os demais serviços. */
const Widgets = () => (
  <Shot dur={90} bg="#F2EEEA">
    <Wallpaper />
    <div style={{ position: "absolute", top: 300, width: "100%" }}>
      <T size={110}>E muito mais.</T>
    </div>
    <div
      style={{
        position: "absolute",
        top: 620,
        left: 100,
        display: "grid",
        gridTemplateColumns: "420px 420px",
        gap: 40,
      }}
    >
      {WIDGETS.map((w, i) => (
        <Widget key={w.label} i={i} label={w.label} kind={w.kind} />
      ))}
    </div>
  </Shot>
);

export const Servicos: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.light }}>
    <Sequence name="Cartões de serviços" durationInFrames={90}>
      <ServiceCards />
    </Sequence>
    <Sequence name="Serviços (carrossel)" from={90} durationInFrames={300}>
      <Carrossel />
    </Sequence>
    <Sequence name="E muito mais (widgets)" from={390} durationInFrames={90}>
      <Widgets />
    </Sequence>

    {[0, 1, 2, 3, 4, 5].map((i) => (
      <Sfx key={i} at={6 + i * 3} src="pop.wav" volume={0.18} />
    ))}
    <Sfx at={48} src="click.wav" volume={0.5} />
    <Sfx at={56} src="whoosh.wav" volume={0.3} />
    {SERVICOS.slice(1).map((s, i) => (
      <Sfx
        key={s.nome}
        at={90 + (i + 1) * 60 - 6}
        src="whip.wav"
        volume={0.22}
      />
    ))}
    {WIDGETS.map((w, i) => (
      <Sfx key={w.label} at={400 + i * 4} src="pop.wav" volume={0.2} />
    ))}
  </AbsoluteFill>
);
