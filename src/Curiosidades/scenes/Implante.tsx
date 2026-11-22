import React from "react";
import { AbsoluteFill } from "remotion";
import { C, fontFamily } from "../theme";
import { Card, Chip, Scene, Small, StepChip, Title, Top } from "../Layout";
import { Sparkle, Tooth, ToothG } from "../Tooth";
import { CrossSection } from "../CrossSection";
import { Abutment, ForceArrow, Pulses, Screw, SvgLabel } from "../Parts";
import { Ridge } from "../Jaws";

export const SComoFaz: React.FC = () => (
  <Scene bg="pink">
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 70 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <Tooth size={200} crownOnly mood="wow" look={6} />
        <svg viewBox="-70 -20 140 460" width={110} height={360} style={{ overflow: "visible" }}>
          <Screw len={400} phase={0.3} />
        </svg>
        <Tooth size={200} crownOnly mood="happy" look={-6} />
      </div>
      <Title lines={["E como é feito", "um *implante*?"]} size={110} />
      <Small>Bora ver o passo a passo.</Small>
    </AbsoluteFill>
  </Scene>
);

export const SAnatomia: React.FC = () => (
  <Scene bg="white">
    <Top>
      <Title lines={["As 3 partes", "do *implante*"]} size={104} />
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
      <text x={620} y={200} fontFamily={fontFamily} fontWeight={500} fontSize={30} fill={C.ink} opacity={0.65}>
        o "dente" que aparece
      </text>
      <SvgLabel x={450} y={390} tx={620} ty={390} text="Pilar" />
      <text x={620} y={470} fontFamily={fontFamily} fontWeight={500} fontSize={30} fill={C.ink} opacity={0.65}>
        liga a coroa ao pino
      </text>
      <SvgLabel x={450} y={760} tx={600} ty={760} text="Pino de titânio" />
      <text x={600} y={840} fontFamily={fontFamily} fontWeight={500} fontSize={30} fill={C.ink} opacity={0.65}>
        fica no osso, como a raiz
      </text>
    </svg>
  </Scene>
);

const XRay: React.FC = () => {
  const idx = new Array(8).fill(0).map((_, i) => i);
  return (
    <svg viewBox="0 0 900 560" width={900} height={560}>
      <defs>
        <radialGradient id="xr-bg" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0" stopColor="#3a2f5c" />
          <stop offset="1" stopColor="#140f24" />
        </radialGradient>
      </defs>
      <rect width={900} height={560} fill="url(#xr-bg)" />
      <ellipse cx={450} cy={300} rx={400} ry={200} fill="#f0d8ff" opacity={0.1} />
      {idx.map((i) => {
        const x = 90 + i * 92;
        const a = (i - 3.5) * 3.5;
        const y = 120 + Math.abs(i - 3.5) * 10;
        return (
          <g key={`u${i}`} transform={`translate(${x} ${y + 140}) rotate(${180 + a}) scale(0.4)`}>
            <ToothG xray rootLen={170} />
          </g>
        );
      })}
      {idx.map((i) => {
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
      <g transform="translate(510 330)">
        <circle r={110} fill={C.accent} opacity={0.15} />
        <rect x={-22} y={0} width={44} height={140} rx={20} fill="none" stroke={C.accent} strokeWidth={5} strokeDasharray="12 8" />
        <path d="M-70 70 L-40 70 M40 70 L70 70 M0 -60 L0 -20" stroke={C.accent} strokeWidth={4} strokeLinecap="round" />
        <circle cx={0} cy={70} r={90} fill="none" stroke={C.accent} strokeWidth={3} opacity={0.6} />
      </g>
      <rect x={600} y={460} width={250} height={60} rx={16} fill="#140f24" opacity={0.85} />
      <text x={725} y={499} textAnchor="middle" fontFamily={fontFamily} fontWeight={600} fontSize={26} fill={C.yellow}>
        Ø 4,0 mm · 10 mm
      </text>
      <text x={40} y={60} fontFamily={fontFamily} fontWeight={700} fontSize={28} fill="#fde7f0" opacity={0.85}>
        TOMOGRAFIA 3D
      </text>
    </svg>
  );
};

export const SPlanejamento: React.FC = () => (
  <Scene bg="yellow">
    <Top>
      <StepChip n={1} />
      <Title lines={["Exame e", "*planejamento*"]} size={100} />
      <Small>A tomografia mostra a altura e a largura{"\n"}do osso e onde o pino vai ficar.</Small>
    </Top>
    <div
      style={{
        position: "absolute",
        top: 880,
        left: 60,
        width: 960,
        height: 620,
        borderRadius: 48,
        background: "linear-gradient(160deg, #ffffff, #f6e9ef)",
        padding: 30,
        boxShadow: "0 40px 80px rgba(170,70,110,0.22)",
        rotate: "-3deg",
      }}
    >
      <div style={{ borderRadius: 26, overflow: "hidden" }}>
        <XRay />
      </div>
    </div>
    <div style={{ position: "absolute", left: 720, top: 1500 }}>
      <Tooth size={250} crownOnly mood="wow" look={-6} />
    </div>
  </Scene>
);

export const SEnxerto: React.FC = () => (
  <Scene bg="white">
    <Top>
      <Title lines={["E se o osso", "já *sumiu*?"]} size={104} />
      <Small>Dá pra fazer um enxerto ósseo{"\n"}antes ou junto com o implante.</Small>
    </Top>
    <Card style={{ top: 960, left: 70, width: 440, padding: "30px 20px", display: "flex", flexDirection: "column", alignItems: "center", rotate: "-2deg" }}>
      <Ridge after />
      <div style={{ fontWeight: 700, fontSize: 36, marginTop: 10 }}>osso fino</div>
    </Card>
    <Card style={{ top: 1020, right: 70, width: 440, padding: "30px 20px", display: "flex", flexDirection: "column", alignItems: "center", rotate: "2deg" }}>
      <Ridge />
      <div style={{ fontWeight: 700, fontSize: 36, marginTop: 10 }}>com enxerto</div>
    </Card>
    <svg width={140} height={80} style={{ position: "absolute", left: 470, top: 1240, overflow: "visible" }}>
      <path d="M10 40 L110 40 M80 12 L114 40 L80 68" stroke={C.accent} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Scene>
);

export const SPreparo: React.FC = () => (
  <Scene bg="pink">
    <Top>
      <StepChip n={2} />
      <Title lines={["Anestesia e", "preparo do *osso*"]} size={96} />
      <Small>Com brocas em baixa rotação e muita água,{"\n"}o dentista abre o espaço do pino.</Small>
    </Top>
    <div style={{ position: "absolute", left: 0, top: 860 }}>
      <CrossSection drill={0.75} gumOpen neighborMood="calm" look={6} />
    </div>
  </Scene>
);

export const SPino: React.FC = () => (
  <Scene bg="yellow">
    <Top>
      <StepChip n={3} />
      <Title lines={["Instalação do", "*pino de titânio*"]} size={96} />
      <Small>Ele é rosqueado no osso{"\n"}e precisa ficar bem firme.</Small>
    </Top>
    <div style={{ position: "absolute", left: 0, top: 820 }}>
      <CrossSection screw={{ insert: 0.8, phase: 0.4 }} gumOpen neighborMood="wow" look={6}>
        <g transform="translate(500 395)" fill="none" stroke={C.accent} strokeWidth={10} strokeLinecap="round">
          <path d="M-120 -40 A130 60 0 0 1 120 -40" />
          <path d="M120 -40 L96 -66 M120 -40 L88 -30" />
        </g>
      </CrossSection>
    </div>
  </Scene>
);

export const SOsseo: React.FC = () => (
  <Scene bg="white">
    <Top>
      <StepChip n={4} />
      <Title lines={["O osso *abraça*", "o pino"]} size={100} />
      <Small>É a osseointegração: o osso cresce{"\n"}e se une ao titânio.</Small>
    </Top>
    <div style={{ position: "absolute", left: 0, top: 830 }}>
      <CrossSection screw={{ insert: 1, phase: 0.4 }} boneGrow={1} neighborMood="happy" look={5} />
    </div>
    <Card style={{ top: 830, left: 60, rotate: "-3deg", display: "flex", alignItems: "center", gap: 20 }}>
      <svg viewBox="0 0 48 48" width={64} height={64}>
        <rect x={4} y={8} width={40} height={36} rx={8} fill={C.accent} />
        <rect x={4} y={8} width={40} height={12} rx={6} fill={C.accentDeep} />
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

export const SBranemark: React.FC = () => (
  <Scene bg="yellow">
    <Top>
      <Chip n={7} />
      <Title lines={["Descoberta", "por *acaso*"]} size={104} />
      <Small>
        Nos anos 1950, o sueco Per-Ingvar Brånemark{"\n"}viu que peças de titânio colocadas no osso{"\n"}não saíam mais: o osso tinha se unido a elas.
      </Small>
    </Top>
    <Card style={{ top: 1060, left: 140, width: 800, padding: "40px 44px", rotate: "-2deg" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <svg viewBox="-80 -40 160 300" width={190} height={355} style={{ overflow: "visible", flexShrink: 0 }}>
          <rect x={-80} y={20} width={160} height={240} rx={40} fill={C.bone} stroke={C.boneDeep} strokeWidth={5} />
          <g transform="scale(0.5)">
            <Screw len={420} phase={0.2} />
          </g>
          <Sparkle x={-60} y={10} s={0.9} color={C.accent} />
          <Sparkle x={66} y={60} s={0.6} color={C.accent} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 56, color: C.accentDeep }}>1952</div>
            <div style={{ fontWeight: 600, fontSize: 32 }}>titânio "grudado" no osso</div>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 56, color: C.accentDeep }}>1965</div>
            <div style={{ fontWeight: 600, fontSize: 32 }}>primeiro paciente com implantes</div>
          </div>
        </div>
      </div>
    </Card>
    <div style={{ position: "absolute", left: 410, top: 1560 }}>
      <Tooth size={260} crownOnly mood="wow" />
    </div>
  </Scene>
);

export const SPilar: React.FC = () => (
  <Scene bg="pink">
    <Top>
      <StepChip n={5} />
      <Title lines={["Encaixe do", "*pilar*"]} size={110} />
      <Small>A peça que vai segurar a coroa.</Small>
    </Top>
    <div style={{ position: "absolute", left: 0, top: 820 }}>
      <CrossSection screw={{ insert: 1, phase: 0.4 }} abutment={0.55} neighborMood="happy" look={5}>
        <path d="M500 150 L500 220 M470 195 L500 225 L530 195" stroke={C.accent} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </CrossSection>
    </div>
  </Scene>
);

export const SCoroa: React.FC = () => (
  <Scene bg="white">
    <Top>
      <StepChip n={6} />
      <Title lines={["A *coroa*", "feita sob medida"]} size={100} />
      <Small>Com a cor e o formato pensados{"\n"}pra combinar com os outros dentes.</Small>
    </Top>
    <div style={{ position: "absolute", left: 0, top: 840 }}>
      <CrossSection screw={{ insert: 1, phase: 0.4 }} abutment={1} crown={{ drop: 0.6, mood: "happy" }} neighborMood="wow" look={6} />
    </div>
  </Scene>
);

export const SEstimuloVolta: React.FC = () => (
  <Scene bg="yellow">
    <Top>
      <Title lines={["O osso volta", "a ter *estímulo*"]} size={100} />
      <Small>O pino faz o papel da raiz: a mordida{"\n"}chega no osso de novo e ajuda a preservá-lo.</Small>
    </Top>
    <div style={{ position: "absolute", left: 0, top: 820 }}>
      <CrossSection screw={{ insert: 1, phase: 0.4 }} abutment={1} crown={{ drop: 1, mood: "happy" }} neighborMood="happy" look={6}>
        <Pulses x={500} y={660} rx={85} ry={160} />
        <ForceArrow x={500} y={185} />
      </CrossSection>
    </div>
  </Scene>
);
