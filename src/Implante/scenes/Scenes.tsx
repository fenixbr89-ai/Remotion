import React from "react";
import { AbsoluteFill } from "remotion";
import { C, fontFamily } from "../theme";
import { Card, Scene, StepChip, Title, Top } from "../Layout";
import { Sparkle, Tooth, ToothG } from "../Tooth";
import { CrossSection } from "../CrossSection";
import { Abutment, Screw, SvgLabel } from "../Parts";

const Small: React.FC<{ children: React.ReactNode; dark?: boolean; style?: React.CSSProperties }> = ({
  children,
  dark,
  style,
}) => (
  <div
    style={{
      fontFamily,
      fontWeight: 500,
      fontSize: 38,
      lineHeight: 1.3,
      textAlign: "center",
      color: dark ? "rgba(255,255,255,0.78)" : "rgba(11,18,32,0.7)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Row of tooth characters standing in a gum "floor". */
const SmileRow: React.FC<{ missing?: boolean; happy?: boolean }> = ({ missing, happy }) => {
  const moods = happy
    ? (["happy", "happy", "wink", "happy", "happy"] as const)
    : (["calm", "worried", null, "sad", "calm"] as const);
  const looks = happy ? [0, 0, 0, 0, 0] : [5, 7, 0, -7, -5];
  const sizes = [200, 245, 280, 245, 200];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, bottom: 0 }}>
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 0,
        }}
      >
        {moods.map((m, i) => {
          const y = Math.abs(i - 2) * 34 + 40;
          if (m === null) return <div key={i} style={{ width: sizes[i] - 30 }} />;
          return (
            <div key={i} style={{ translate: `0px ${y}px`, rotate: `${(i - 2) * 5}deg`, margin: "0 -8px" }}>
              <Tooth size={sizes[i]} crownOnly mood={m} look={looks[i]} shadow={false} />
            </div>
          );
        })}
      </div>
      {/* gum in front of the teeth necks */}
      <div
        style={{
          position: "absolute",
          left: -80,
          right: -80,
          top: 400,
          bottom: -200,
          borderRadius: "50% 50% 0 0 / 22% 22% 0 0",
          background: `linear-gradient(180deg, #ffb3c0 0%, ${C.gum} 12%, ${C.gumDeep} 60%, #a63a55 100%)`,
          boxShadow: "inset 0 18px 30px rgba(255,255,255,0.45), 0 -10px 40px rgba(120,20,40,0.18)",
        }}
      />
      {missing ? (
        <div
          style={{
            position: "absolute",
            left: 540 - 95,
            top: 412,
            width: 190,
            height: 60,
            borderRadius: "50%",
            background: "radial-gradient(ellipse at 50% 35%, #5c1626 0%, #8f2a40 70%, #b33f58 100%)",
          }}
        />
      ) : null}
    </div>
  );
};

export const S01Abertura: React.FC = () => (
  <Scene glowY={70}>
    <Top top={260}>
      <Title lines={["Perdeu um", "*dente*?"]} size={124} />
      <Small>Os vizinhos sentem falta dele…</Small>
    </Top>
    <SmileRow missing />
  </Scene>
);

export const S02Problema: React.FC = () => (
  <Scene dark glowY={70}>
    <Top>
      <Title dark lines={["Sem a raiz,", "o *osso* enfraquece"]} size={92} />
    </Top>
    <div style={{ position: "absolute", left: 0, top: 640 }}>
      <CrossSection boneLoss={1} tilt={7} neighborMood="worried" look={5}>
        <SvgLabel x={500} y={600} tx={560} ty={900} text="osso diminui" dark />
        <SvgLabel x={352} y={250} tx={400} ty={80} text="dentes se movem" dark />
      </CrossSection>
    </div>
  </Scene>
);

export const S03Virada: React.FC = () => (
  <Scene dark glowY={50}>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 60 }}>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: -120,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,197,94,0.55) 0%, rgba(34,197,94,0) 65%)",
          }}
        />
        <Tooth size={260} crownOnly mood="wow" shadow={false} />
        <svg width={260} height={60} viewBox="0 0 260 60" style={{ position: "absolute", top: -60, left: 0, overflow: "visible" }}>
          <Sparkle x={10} y={30} s={1.2} />
          <Sparkle x={250} y={10} s={0.9} color={C.greenSoft} />
        </svg>
      </div>
      <Title dark lines={["Existe um", "dente novo", "*de verdade*."]} size={124} />
    </AbsoluteFill>
  </Scene>
);

export const S04Anatomia: React.FC = () => (
  <Scene glowY={62}>
    <Top>
      <Title lines={["Conheça o", "*implante*"]} size={110} />
    </Top>
    <svg viewBox="0 0 1000 1300" width={1080} height={1404} style={{ position: "absolute", top: 560, left: 0, overflow: "visible" }}>
      <path d="M380 270 L380 1180" stroke={C.ink} strokeOpacity={0.15} strokeWidth={4} strokeDasharray="10 14" />
      <g transform="translate(240 10) scale(1.4)">
        <ToothG crownOnly mood="happy" />
      </g>
      <g transform="translate(380 330) scale(1.3)">
        <Abutment />
      </g>
      <g transform="translate(380 560) scale(1.15)">
        <Screw len={420} phase={0.3} />
      </g>
      <SvgLabel x={500} y={120} tx={620} ty={120} text="Coroa" />
      <SvgLabel x={450} y={390} tx={620} ty={390} text="Pilar" />
      <SvgLabel x={450} y={760} tx={600} ty={760} text="Pino de titânio" />
      <text x={600} y={850} fontFamily={fontFamily} fontWeight={500} fontSize={30} fill={C.ink} opacity={0.6}>
        funciona como a raiz
      </text>
    </svg>
  </Scene>
);

const XRay: React.FC = () => {
  const upper = new Array(8).fill(0).map((_, i) => i);
  return (
    <svg viewBox="0 0 900 560" width={900} height={560}>
      <defs>
        <radialGradient id="xr-bg" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0" stopColor="#1e3a5f" />
          <stop offset="1" stopColor="#050b16" />
        </radialGradient>
      </defs>
      <rect width={900} height={560} fill="url(#xr-bg)" />
      <ellipse cx={450} cy={300} rx={400} ry={200} fill="#9cc3e6" opacity={0.12} />
      {upper.map((i) => {
        const x = 90 + i * 92;
        const a = (i - 3.5) * 3.5;
        const y = 120 + Math.abs(i - 3.5) * 10;
        return (
          <g key={`u${i}`} transform={`translate(${x} ${y + 140}) rotate(${180 + a}) scale(0.4)`}>
            <ToothG xray rootLen={170} />
          </g>
        );
      })}
      {upper.map((i) => {
        if (i === 5) return null;
        const x = 90 + i * 92;
        const a = (i - 3.5) * -3.5;
        const y = 310 - Math.abs(i - 3.5) * 10;
        return (
          <g key={`l${i}`} transform={`translate(${x - 80} ${y}) rotate(${a}) scale(0.4)`}>
            <ToothG xray rootLen={170} />
          </g>
        );
      })}
      {/* planned implant */}
      <g transform="translate(510 330)">
        <circle r={110} fill={C.green} opacity={0.12} />
        <rect x={-22} y={0} width={44} height={140} rx={20} fill="none" stroke={C.green} strokeWidth={5} strokeDasharray="12 8" />
        <path d="M-70 70 L-40 70 M40 70 L70 70 M0 -60 L0 -20" stroke={C.green} strokeWidth={4} strokeLinecap="round" />
        <circle cx={0} cy={70} r={90} fill="none" stroke={C.green} strokeWidth={3} opacity={0.6} />
      </g>
      <rect x={600} y={460} width={250} height={60} rx={16} fill="#0b1220" opacity={0.8} />
      <text x={725} y={499} textAnchor="middle" fontFamily={fontFamily} fontWeight={600} fontSize={26} fill={C.green}>
        Ø 4,0 mm · 10 mm
      </text>
      <text x={40} y={60} fontFamily={fontFamily} fontWeight={700} fontSize={28} fill="#e0f2fe" opacity={0.8}>
        TOMOGRAFIA 3D
      </text>
    </svg>
  );
};

export const S05Planejamento: React.FC = () => (
  <Scene dark glowY={60}>
    <Top>
      <StepChip n={1} dark />
      <Title dark lines={["*Planejamento*", "com tomografia"]} size={96} />
    </Top>
    <div
      style={{
        position: "absolute",
        top: 800,
        left: 60,
        width: 960,
        height: 620,
        borderRadius: 48,
        background: "linear-gradient(160deg, #2a3442, #0f141b)",
        padding: 30,
        boxShadow: "0 50px 90px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.15)",
        rotate: "-3deg",
      }}
    >
      <div style={{ borderRadius: 26, overflow: "hidden" }}>
        <XRay />
      </div>
    </div>
    <div style={{ position: "absolute", left: 700, top: 1420 }}>
      <Tooth size={260} crownOnly mood="wow" look={-6} />
    </div>
    <Small dark style={{ position: "absolute", top: 1520, left: 90, width: 560, textAlign: "left" }}>
      O dentista mede o osso e escolhe o ponto exato.
    </Small>
  </Scene>
);

export const S06Preparo: React.FC = () => (
  <Scene glowY={65}>
    <Top>
      <StepChip n={2} />
      <Title lines={["Preparo *suave*", "do osso"]} size={96} />
    </Top>
    <div style={{ position: "absolute", left: 0, top: 760 }}>
      <CrossSection drill={0.75} gumOpen neighborMood="calm" look={6} />
    </div>
    <Card style={{ top: 640, right: 60, display: "flex", alignItems: "center", gap: 16, rotate: "3deg" }}>
      <div style={{ width: 54, height: 54, borderRadius: 999, background: C.greenSoft, display: "grid", placeItems: "center" }}>
        <svg viewBox="0 0 24 24" width={32} height={32}>
          <path d="M5 13l4 4L19 7" stroke={C.greenDeep} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ fontWeight: 700, fontSize: 34 }}>Com anestesia</div>
    </Card>
  </Scene>
);

export const S07Pino: React.FC = () => (
  <Scene dark glowY={66}>
    <Top>
      <StepChip n={3} dark />
      <Title dark lines={["Instalação do", "*pino de titânio*"]} size={92} />
    </Top>
    <div style={{ position: "absolute", left: 0, top: 740 }}>
      <CrossSection screw={{ insert: 0.8, phase: 0.4 }} gumOpen neighborMood="wow" look={6}>
        <g transform="translate(500 395)" fill="none" stroke={C.green} strokeWidth={10} strokeLinecap="round">
          <path d="M-120 -40 A130 60 0 0 1 120 -40" />
          <path d="M120 -40 L96 -66 M120 -40 L88 -30" />
        </g>
      </CrossSection>
    </div>
  </Scene>
);

export const S08Osseo: React.FC = () => (
  <Scene glowY={66}>
    <Top>
      <StepChip n={4} />
      <Title lines={["O osso *abraça*", "o implante"]} size={96} />
    </Top>
    <div style={{ position: "absolute", left: 0, top: 740 }}>
      <CrossSection screw={{ insert: 1, phase: 0.4 }} boneGrow={1} neighborMood="happy" look={5} />
    </div>
    <Card style={{ top: 660, left: 60, rotate: "-3deg", display: "flex", alignItems: "center", gap: 20 }}>
      <svg viewBox="0 0 48 48" width={64} height={64}>
        <rect x={4} y={8} width={40} height={36} rx={8} fill={C.green} />
        <rect x={4} y={8} width={40} height={12} rx={6} fill={C.greenDeep} />
        <rect x={12} y={3} width={5} height={10} rx={2.5} fill={C.ink} />
        <rect x={31} y={3} width={5} height={10} rx={2.5} fill={C.ink} />
        <path d="M15 31l6 6 12-12" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />
      </svg>
      <div>
        <div style={{ fontWeight: 800, fontSize: 40 }}>3 a 6 meses</div>
        <div style={{ fontWeight: 500, fontSize: 26, opacity: 0.6 }}>varia em cada caso</div>
      </div>
    </Card>
  </Scene>
);

export const S09Pilar: React.FC = () => (
  <Scene dark glowY={66}>
    <Top>
      <StepChip n={5} dark />
      <Title dark lines={["Encaixe do", "*pilar*"]} size={110} />
    </Top>
    <div style={{ position: "absolute", left: 0, top: 740 }}>
      <CrossSection screw={{ insert: 1, phase: 0.4 }} abutment={0.55} neighborMood="happy" look={5}>
        <path d="M500 150 L500 220 M470 195 L500 225 L530 195" stroke={C.green} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </CrossSection>
    </div>
  </Scene>
);

export const S10Coroa: React.FC = () => (
  <Scene glowY={60}>
    <Top>
      <StepChip n={6} />
      <Title lines={["A *coroa*", "feita sob medida"]} size={96} />
    </Top>
    <div style={{ position: "absolute", left: 0, top: 760 }}>
      <CrossSection screw={{ insert: 1, phase: 0.4 }} abutment={1} crown={{ drop: 0.6, mood: "happy" }} neighborMood="wow" look={6} />
    </div>
  </Scene>
);

export const S11Resultado: React.FC = () => (
  <Scene dark glowY={62}>
    <Top top={260}>
      <Title dark lines={["Sorriso *completo*", "de novo!"]} size={104} />
    </Top>
    <SmileRow happy />
    <svg width={1080} height={600} style={{ position: "absolute", top: 760, left: 0 }}>
      <Sparkle x={540} y={80} s={1.6} color={C.green} />
      <Sparkle x={420} y={150} s={0.8} />
      <Sparkle x={680} y={120} s={1} />
      <Sparkle x={160} y={230} s={0.7} color={C.greenSoft} />
      <Sparkle x={930} y={250} s={0.7} color={C.greenSoft} />
    </svg>
  </Scene>
);

const Benefit: React.FC<{ icon: React.ReactNode; title: string; sub: string; style: React.CSSProperties }> = ({
  icon,
  title,
  sub,
  style,
}) => (
  <Card style={{ width: 780, display: "flex", alignItems: "center", gap: 28, padding: "34px 40px", ...style }}>
    <div style={{ width: 110, height: 110, borderRadius: 32, background: C.greenSoft, display: "grid", placeItems: "center", flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontWeight: 800, fontSize: 46, lineHeight: 1.1 }}>{title}</div>
      <div style={{ fontWeight: 500, fontSize: 30, opacity: 0.6, marginTop: 6 }}>{sub}</div>
    </div>
  </Card>
);

export const S12Beneficios: React.FC = () => (
  <Scene glowY={60}>
    <Top>
      <Title lines={["Por que", "*implante*?"]} size={110} />
    </Top>
    <Benefit
      style={{ top: 720, left: 90, rotate: "-2deg" }}
      title="Mastiga com firmeza"
      sub="fixo no osso, não sai do lugar"
      icon={
        <svg viewBox="0 0 64 64" width={70} height={70}>
          <path d="M32 18 C20 10 8 18 10 34 C12 50 22 58 32 54 C42 58 52 50 54 34 C56 18 44 10 32 18 Z" fill="#ef4444" />
          <path d="M32 18 C32 12 35 7 40 5" stroke="#7c4a1e" strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M34 12 C40 6 48 8 50 12 C44 16 38 15 34 12 Z" fill={C.green} />
          <ellipse cx={22} cy={28} rx={5} ry={8} fill="#fff" opacity={0.5} />
        </svg>
      }
    />
    <Benefit
      style={{ top: 1010, left: 210, rotate: "2deg" }}
      title="Aparência natural"
      sub="cor e formato iguais aos seus"
      icon={
        <svg viewBox="-30 -30 60 60" width={70} height={70}>
          <Sparkle x={-4} y={2} s={1.2} color={C.greenDeep} />
          <Sparkle x={16} y={-16} s={0.5} color={C.green} />
        </svg>
      }
    />
    <Benefit
      style={{ top: 1300, left: 90, rotate: "-1.5deg" }}
      title="Dura muitos anos"
      sub="com higiene e revisões em dia"
      icon={
        <svg viewBox="0 0 64 64" width={70} height={70}>
          <path d="M32 6 L54 14 L54 32 C54 46 44 54 32 58 C20 54 10 46 10 32 L10 14 Z" fill={C.green} />
          <path d="M22 32l7 7 13-14" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      }
    />
    <div style={{ position: "absolute", left: 760, top: 1560 }}>
      <Tooth size={220} crownOnly mood="wink" />
    </div>
  </Scene>
);

export const S13CTA: React.FC = () => (
  <Scene dark glowY={45}>
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 330, gap: 50 }}>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: -140,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,197,94,0.5) 0%, rgba(34,197,94,0) 65%)",
          }}
        />
        <Tooth size={340} crownOnly mood="wink" shadow={false} />
      </div>
      <Title dark lines={["Agende sua", "*avaliação*"]} size={120} />
      <Small dark style={{ whiteSpace: "pre-line" }}>{"Um dente novo de verdade\ncomeça com uma conversa."}</Small>
      <div
        style={{
          marginTop: 30,
          padding: "36px 70px",
          borderRadius: 999,
          background: C.green,
          color: "#04130a",
          fontFamily,
          fontWeight: 800,
          fontSize: 48,
          boxShadow: "0 24px 60px rgba(34,197,94,0.45)",
        }}
      >
        Fale com a gente
      </div>
      <div style={{ fontFamily, fontWeight: 600, fontSize: 34, color: "rgba(255,255,255,0.7)", marginTop: 10 }}>
        (00) 00000-0000 · @suaclinica
      </div>
    </AbsoluteFill>
  </Scene>
);

export const SCENES = [
  { id: "Cena01-Abertura", C: S01Abertura },
  { id: "Cena02-Problema", C: S02Problema },
  { id: "Cena03-Virada", C: S03Virada },
  { id: "Cena04-Anatomia", C: S04Anatomia },
  { id: "Cena05-Planejamento", C: S05Planejamento },
  { id: "Cena06-Preparo", C: S06Preparo },
  { id: "Cena07-Pino", C: S07Pino },
  { id: "Cena08-Osseointegracao", C: S08Osseo },
  { id: "Cena09-Pilar", C: S09Pilar },
  { id: "Cena10-Coroa", C: S10Coroa },
  { id: "Cena11-Resultado", C: S11Resultado },
  { id: "Cena12-Beneficios", C: S12Beneficios },
  { id: "Cena13-CTA", C: S13CTA },
];
