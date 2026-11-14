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
  AppIcon,
  Chip,
  Glass,
  Product,
  Sfx,
  Shot,
  T,
  useSpring,
  Wallpaper,
} from "./kit";
import { C, CLAMP, EASE, FONT } from "./theme";

type Servico = {
  nome: string;
  eyebrow: string;
  titulo: string;
  sub: string;
  chips: string[];
  img: string;
  width: number;
  dark: boolean;
  icon: string;
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
    icon: "linear-gradient(160deg, #FFB067, #FF6B00)",
  },
  {
    nome: "Automotiva",
    eyebrow: "Pintura automotiva",
    titulo: "Acabamento\nde especialista.",
    sub: "Seu carro como novo.",
    chips: ["Pintura", "Retoques"],
    img: "img/car.png",
    width: 580,
    dark: true,
    icon: "linear-gradient(160deg, #3A3A3C, #000000)",
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
    icon: "linear-gradient(160deg, #FFFFFF, #E8E8ED)",
  },
  {
    nome: "Hidráulica",
    eyebrow: "Hidráulica",
    titulo: "Sem vazamento.\nSem goteira.",
    sub: "Instalações e caixas d'água.",
    chips: ["Vazamentos", "Caixas d'água"],
    img: "img/shower.png",
    width: 600,
    dark: true,
    icon: "linear-gradient(160deg, #6CC7FF, #0A84FF)",
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
    icon: "linear-gradient(160deg, #FFE27A, #FFB800)",
  },
];

const ICON = 230;
const GAP_X = 90;
const GRID_LEFT = (1080 - (3 * ICON + 2 * GAP_X)) / 2;
const GRID_TOP = 640;
const ROW = ICON + 140;

/** UI: tela inicial com os serviços como apps; o primeiro é tocado e abre. */
const HomeScreen = () => {
  const frame = useCurrentFrame();
  const press = interpolate(frame, [48, 52, 58], [1, 0.88, 1], CLAMP);
  const open = interpolate(frame, [56, 78], [0, 1], { ...CLAMP, easing: EASE });
  const items = [
    ...SERVICOS.map((s) => ({ label: s.nome, bg: s.icon, img: s.img })),
    { label: "Mais", bg: "", img: "" },
  ];
  return (
    <Shot dur={90} bg="#F2EEEA" out={false}>
      <Wallpaper />
      <div style={{ position: "absolute", top: 300, width: "100%" }}>
        <T size={84} delay={2}>
          Um app para cada
        </T>
        <T size={84} delay={6} gradient>
          necessidade.
        </T>
      </div>
      {items.map((it, i) => (
        <Tile key={it.label} i={i} it={it} press={press} open={open} />
      ))}
      {/* abertura do app: o ícone se expande até ocupar a tela */}
      {open > 0 ? (
        <div
          style={{
            position: "absolute",
            left: GRID_LEFT * (1 - open),
            top: GRID_TOP * (1 - open),
            width: ICON + (1080 - ICON) * open,
            height: ICON + (1920 - ICON) * open,
            borderRadius: 52 * (1 - open) + 4,
            background: C.light,
          }}
        />
      ) : null}
    </Shot>
  );
};

const Tile: React.FC<{
  i: number;
  it: { label: string; bg: string; img: string };
  press: number;
  open: number;
}> = ({ i, it, press, open }) => {
  const s = useSpring(6 + i * 3, 13, 180);
  const col = i % 3;
  const row = Math.floor(i / 3);
  return (
    <div
      style={{
        position: "absolute",
        left: GRID_LEFT + col * (ICON + GAP_X),
        top: GRID_TOP + row * ROW,
        width: ICON,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        scale: String(s * (i === 0 ? press : 1)),
        opacity: Math.min(1, s * 2) * (i === 0 ? 1 : 1 - open),
      }}
    >
      {it.img ? (
        <AppIcon size={ICON} bg={it.bg}>
          <Img src={staticFile(it.img)} style={{ width: "78%" }} />
        </AppIcon>
      ) : (
        <Glass
          radius={ICON * 0.225}
          style={{
            width: ICON,
            height: ICON,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            padding: 44,
            boxSizing: "border-box",
            gap: 22,
          }}
        >
          {[0, 1, 2, 3].map((k) => (
            <div
              key={k}
              style={{
                borderRadius: 18,
                background: k === 0 ? C.orange : "rgba(0,0,0,0.12)",
              }}
            />
          ))}
        </Glass>
      )}
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 36,
          color: C.text,
        }}
      >
        {it.label}
      </div>
    </div>
  );
};

/** Product showcase de um serviço. */
const Showcase: React.FC<{ s: Servico }> = ({ s }) => {
  const frame = useCurrentFrame();
  const bg = s.dark ? C.black : C.light;
  const fg = s.dark ? C.white : C.text;
  return (
    <Shot dur={60} bg={bg}>
      {/* círculo minimalista atrás do produto */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        <circle
          cx={540}
          cy={1080}
          r={400}
          fill="none"
          stroke={s.dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.08)"}
          strokeWidth={3}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={
            1 - interpolate(frame, [2, 30], [0, 1], { ...CLAMP, easing: EASE })
          }
          style={{ rotate: "-90deg", transformOrigin: "540px 1080px" }}
        />
      </svg>
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
      <Product src={s.img} width={s.width} y={1100} delay={4} dark={s.dark} />
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
    <Sequence name="Tela inicial (apps)" durationInFrames={90}>
      <HomeScreen />
    </Sequence>
    {SERVICOS.map((s, i) => (
      <Sequence
        key={s.nome}
        name={s.nome}
        from={90 + i * 60}
        durationInFrames={60}
      >
        <Showcase s={s} />
      </Sequence>
    ))}
    <Sequence name="E muito mais (widgets)" from={390} durationInFrames={90}>
      <Widgets />
    </Sequence>

    {[0, 1, 2, 3, 4, 5].map((i) => (
      <Sfx key={i} at={6 + i * 3} src="pop.wav" volume={0.18} />
    ))}
    <Sfx at={48} src="click.wav" volume={0.5} />
    <Sfx at={56} src="whoosh.wav" volume={0.3} />
    {SERVICOS.map((s, i) => (
      <Sfx key={s.nome} at={90 + i * 60} src="whoosh.wav" volume={0.18} />
    ))}
    {WIDGETS.map((w, i) => (
      <Sfx key={w.label} at={400 + i * 4} src="pop.wav" volume={0.2} />
    ))}
  </AbsoluteFill>
);
