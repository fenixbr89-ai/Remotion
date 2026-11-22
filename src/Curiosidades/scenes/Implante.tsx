import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, fontFamily } from "../theme";
import { Card, Chip, Scene, Small, StepChip, Title, Top } from "../Layout";
import { Sparkle, Tooth, ToothG } from "../Tooth";
import { CrossSection } from "../CrossSection";
import { Abutment, ForceArrow, Screw, SvgLabel } from "../Parts";
import { Ridge } from "../Jaws";
import { blinking, bob, easeBack, easeInOut, prog } from "../anim";
import { AnimPulses, DrawArrow, Pop, usePress } from "./Helpers";

const SECTION_TOP = 820;

export const SComoFaz: React.FC = () => {
  const f = useCurrentFrame();
  const drop = prog(f, 14, 40, easeInOut);
  return (
    <Scene bg="pink">
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 70 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Pop delay={4}>
            <div style={{ translate: `0px ${bob(f, 0, 6)}px` }}>
              <Tooth size={200} crownOnly mood={f > 40 ? "wow" : "happy"} look={6} blink={blinking(f, 1)} />
            </div>
          </Pop>
          <svg
            viewBox="-70 -20 140 460"
            width={110}
            height={360}
            style={{ overflow: "visible", translate: `0px ${(1 - drop) * -700}px`, opacity: prog(f, 14, 8) }}
          >
            <Screw len={400} phase={drop * 4} />
          </svg>
          <Pop delay={9}>
            <div style={{ translate: `0px ${bob(f, 3, 6)}px` }}>
              <Tooth size={200} crownOnly mood="happy" look={-6} blink={blinking(f, 4)} />
            </div>
          </Pop>
        </div>
        <Title lines={["E como é feito", "um *implante*?"]} size={110} delay={20} />
        <Small delay={50}>Bora ver o passo a passo.</Small>
      </AbsoluteFill>
    </Scene>
  );
};

export const SAnatomia: React.FC = () => {
  const f = useCurrentFrame();
  const slide = (d: number) => {
    const p = prog(f, d, 28);
    return { transform: `translate(${(1 - p) * 500} 0)`, opacity: p };
  };
  return (
    <Scene bg="white">
      <Top>
        <Title lines={["As 3 partes", "do *implante*"]} size={104} delay={8} />
      </Top>
      <svg viewBox="0 0 1000 1300" width={1080} height={1404} style={{ position: "absolute", top: 560, left: 0, overflow: "visible" }}>
        <g transform="translate(-120 0)">
          <path
            d="M380 270 L380 1180"
            stroke={C.ink}
            strokeOpacity={0.15}
            strokeWidth={4}
            strokeDasharray="10 14"
            opacity={prog(f, 10, 20)}
          />
          <g {...slide(14)}>
            <g transform={`translate(240 ${10 + bob(f, 0, 6)}) scale(1.4)`}>
              <ToothG crownOnly mood="happy" blink={blinking(f, 2)} />
            </g>
          </g>
          <g {...slide(24)}>
            <g transform="translate(380 330) scale(1.3)">
              <Abutment />
            </g>
          </g>
          <g {...slide(34)}>
            <g transform="translate(380 560) scale(1.15)">
              <Screw len={420} phase={f / 40} />
            </g>
          </g>
          <g opacity={prog(f, 44, 16)}>
            <SvgLabel x={500} y={120} tx={620} ty={120} text="Coroa" sub={'o "dente" que aparece'} />
          </g>
          <g opacity={prog(f, 58, 16)}>
            <SvgLabel x={450} y={390} tx={620} ty={390} text="Pilar" sub="liga a coroa ao pino" />
          </g>
          <g opacity={prog(f, 72, 16)}>
            <SvgLabel x={450} y={760} tx={560} ty={760} text="Pino de titânio" sub="fica no osso, como a raiz" />
          </g>
        </g>
      </svg>
    </Scene>
  );
};

const XRay: React.FC = () => {
  const f = useCurrentFrame();
  const idx = new Array(8).fill(0).map((_, i) => i);
  const pulse = 1 + 0.08 * Math.sin(f / 6);
  const mark = prog(f, 36, 20);
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
      <g opacity={prog(f, 16, 24)}>
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
      </g>
      {/* scan line */}
      <rect x={0} y={interpolate(f, [10, 40], [0, 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} width={900} height={6} fill="#ffd6e4" opacity={f < 42 && f > 10 ? 0.8 : 0} />
      <g transform="translate(510 330)" opacity={mark}>
        <circle r={110 * pulse} fill={C.accent} opacity={0.15} />
        <rect x={-22} y={0} width={44} height={140} rx={20} fill="none" stroke={C.accent} strokeWidth={5} strokeDasharray="12 8" strokeDashoffset={-f} />
        <g transform={`translate(0 70) rotate(${f * 1.5})`}>
          <path d="M-70 0 L-40 0 M40 0 L70 0 M0 -70 L0 -40 M0 40 L0 70" stroke={C.accent} strokeWidth={4} strokeLinecap="round" />
        </g>
        <circle cx={0} cy={70} r={90 * pulse} fill="none" stroke={C.accent} strokeWidth={3} opacity={0.6} />
      </g>
      <g opacity={prog(f, 56, 16)}>
        <rect x={600} y={460} width={250} height={60} rx={16} fill="#140f24" opacity={0.85} />
        <text x={725} y={499} textAnchor="middle" fontFamily={fontFamily} fontWeight={600} fontSize={26} fill={C.yellow}>
          Ø 4,0 mm · 10 mm
        </text>
      </g>
      <text x={40} y={60} fontFamily={fontFamily} fontWeight={700} fontSize={28} fill="#fde7f0" opacity={0.85}>
        TOMOGRAFIA 3D
      </text>
    </svg>
  );
};

export const SPlanejamento: React.FC = () => {
  const f = useCurrentFrame();
  const up = prog(f, 4, 30);
  return (
    <Scene bg="yellow">
      <Top>
        <StepChip n={1} />
        <Title lines={["Exame e", "*planejamento*"]} size={100} />
        <Small delay={26}>{"A tomografia mostra a altura e a largura\ndo osso e onde o pino vai ficar."}</Small>
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
          rotate: `${-3 - (1 - up) * 6}deg`,
          translate: `0px ${(1 - up) * 400}px`,
          opacity: up,
        }}
      >
        <div style={{ borderRadius: 26, overflow: "hidden" }}>
          <XRay />
        </div>
      </div>
      <div style={{ position: "absolute", left: 720, top: 1500, translate: `0px ${(1 - prog(f, 40, 26, easeBack)) * 420 + bob(f, 0, 5)}px` }}>
        <Tooth size={250} crownOnly mood="wow" look={-6} blink={blinking(f, 2)} />
      </div>
    </Scene>
  );
};

export const SEnxerto: React.FC = () => {
  const f = useCurrentFrame();
  const inL = prog(f, 8, 28);
  const inR = prog(f, 16, 28);
  return (
    <Scene bg="white">
      <Top>
        <Title lines={["E se o osso", "já *sumiu*?"]} size={104} delay={8} />
        <Small delay={26}>{"Dá pra fazer um enxerto ósseo\nantes ou junto com o implante."}</Small>
      </Top>
      <Card
        style={{
          top: 960,
          left: 70,
          width: 440,
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rotate: "-2deg",
          opacity: inL,
          translate: `${(1 - inL) * -500}px 0px`,
        }}
      >
        <Ridge after />
        <div style={{ fontWeight: 700, fontSize: 36, marginTop: 10 }}>osso fino</div>
      </Card>
      <Card
        style={{
          top: 1020,
          right: 70,
          width: 440,
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rotate: "2deg",
          opacity: inR,
          translate: `${(1 - inR) * 500}px 0px`,
        }}
      >
        <Ridge p={1 - prog(f, 48, 80, easeInOut)} ghost={false} />
        <div style={{ fontWeight: 700, fontSize: 36, marginTop: 10 }}>com enxerto</div>
      </Card>
      <svg width={140} height={80} style={{ position: "absolute", left: 470, top: 1240, overflow: "visible" }}>
        <DrawArrow d="M10 40 L110 40" head="M80 12 L114 40 L80 68" p={prog(f, 36, 20)} width={14} />
      </svg>
    </Scene>
  );
};

export const SPreparo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Scene bg="pink">
      <Top>
        <StepChip n={2} />
        <Title lines={["Anestesia e", "preparo do *osso*"]} size={96} />
        <Small delay={30}>{"Com brocas em baixa rotação e muita água,\no dentista abre o espaço do pino."}</Small>
      </Top>
      <div style={{ position: "absolute", left: 0, top: SECTION_TOP }}>
        <CrossSection
          drill={0.05 + prog(f, 24, 100, easeInOut) * 0.7}
          drillSpin={f / 2.5}
          drillOpacity={prog(f, 10, 16)}
          gumOpen={f > 20}
          neighborMood="calm"
          look={6}
          t={f}
        />
      </div>
    </Scene>
  );
};

export const SPino: React.FC = () => {
  const f = useCurrentFrame();
  const out = prog(f, 0, 28, easeInOut);
  const insert = prog(f, 32, 100, easeInOut);
  const spin = prog(f, 48, 14) * (1 - prog(f, 125, 12));
  return (
    <Scene bg="yellow">
      <Top>
        <StepChip n={3} />
        <Title lines={["Instalação do", "*pino de titânio*"]} size={96} />
        <Small delay={34}>{"Ele é rosqueado no osso\ne precisa ficar bem firme."}</Small>
      </Top>
      <div style={{ position: "absolute", left: 0, top: SECTION_TOP }}>
        <CrossSection
          drill={out < 1 ? 0.75 - out * 0.9 : null}
          drillSpin={f / 2.5}
          drillOpacity={1 - out}
          screw={{ insert, phase: insert * 6 }}
          screwOpacity={prog(f, 26, 12)}
          gumOpen
          neighborMood="wow"
          look={6}
          t={f}
        >
          <g transform="translate(500 395)" opacity={spin}>
            <g transform={`rotate(${Math.sin(f / 6) * 8})`} fill="none" stroke={C.accent} strokeWidth={10} strokeLinecap="round">
              <path d="M-120 -40 A130 60 0 0 1 120 -40" />
              <path d="M120 -40 L96 -66 M120 -40 L88 -30" />
            </g>
          </g>
        </CrossSection>
      </div>
    </Scene>
  );
};

export const SOsseo: React.FC = () => {
  const f = useCurrentFrame();
  const grow = prog(f, 26, 110, easeInOut);
  const card = prog(f, 30, 26, easeBack);
  return (
    <Scene bg="white">
      <Top>
        <StepChip n={4} />
        <Title lines={["O osso *abraça*", "o pino"]} size={100} />
        <Small delay={28}>{"É a osseointegração: o osso cresce\ne se une ao titânio."}</Small>
      </Top>
      <div style={{ position: "absolute", left: 0, top: SECTION_TOP }}>
        <CrossSection screw={{ insert: 1, phase: 6 }} boneGrow={grow} neighborMood={grow > 0.5 ? "happy" : "wow"} look={5} t={f} />
      </div>
      <Card
        style={{
          top: 830,
          left: 60,
          rotate: `${-3 - (1 - card) * 10}deg`,
          scale: interpolate(card, [0, 1], [0.6, 1]),
          opacity: prog(f, 30, 10),
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <svg viewBox="0 0 48 48" width={64} height={64}>
          <rect x={4} y={8} width={40} height={36} rx={8} fill={C.accent} />
          <rect x={4} y={8} width={40} height={12} rx={6} fill={C.accentDeep} />
          <rect x={12} y={3} width={5} height={10} rx={2.5} fill={C.ink} />
          <rect x={31} y={3} width={5} height={10} rx={2.5} fill={C.ink} />
          <path d="M15 31l6 6 12-12" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - grow} />
        </svg>
        <div>
          <div style={{ fontWeight: 800, fontSize: 40 }}>3 a 6 meses</div>
          <div style={{ fontWeight: 500, fontSize: 26, opacity: 0.6 }}>varia em cada caso</div>
          <div style={{ marginTop: 10, width: 240, height: 10, borderRadius: 9, background: C.accentSoft, overflow: "hidden" }}>
            <div style={{ width: `${grow * 100}%`, height: "100%", background: C.accent, borderRadius: 9 }} />
          </div>
        </div>
      </Card>
    </Scene>
  );
};

export const SBranemark: React.FC = () => {
  const f = useCurrentFrame();
  const card = prog(f, 40, 30);
  const y1 = Math.round(1940 + 12 * prog(f, 56, 40));
  const y2 = Math.round(1950 + 15 * prog(f, 70, 40));
  const tw = (k: number) => 0.5 + 0.5 * Math.sin((f + k * 17) / 7);
  return (
    <Scene bg="yellow">
      <Top>
        <Chip n={7} />
        <Title lines={["Descoberta", "por *acaso*"]} size={104} />
        <Small delay={26}>
          {"Nos anos 1950, o sueco Per-Ingvar Brånemark\nviu que peças de titânio colocadas no osso\nnão saíam mais: o osso tinha se unido a elas."}
        </Small>
      </Top>
      <Card style={{ top: 1060, left: 140, width: 800, padding: "40px 44px", rotate: "-2deg", opacity: card, translate: `0px ${(1 - card) * 120}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <svg viewBox="-80 -40 160 300" width={190} height={355} style={{ overflow: "visible", flexShrink: 0 }}>
            <rect x={-80} y={20} width={160} height={240} rx={40} fill={C.bone} stroke={C.boneDeep} strokeWidth={5} />
            <g transform="scale(0.5)">
              <Screw len={420} phase={0.2} />
            </g>
            <Sparkle x={-60} y={10} s={0.6 + 0.4 * tw(0)} color={C.accent} opacity={tw(0)} />
            <Sparkle x={66} y={60} s={0.4 + 0.3 * tw(1)} color={C.accent} opacity={tw(1)} />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 56, color: C.accentDeep, fontVariantNumeric: "tabular-nums" }}>{y1}</div>
              <div style={{ fontWeight: 600, fontSize: 32 }}>titânio "grudado" no osso</div>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 56, color: C.accentDeep, fontVariantNumeric: "tabular-nums" }}>{y2}</div>
              <div style={{ fontWeight: 600, fontSize: 32 }}>primeiro paciente com implantes</div>
            </div>
          </div>
        </div>
      </Card>
      <div style={{ position: "absolute", left: 410, top: 1560, translate: `0px ${(1 - prog(f, 90, 26, easeBack)) * 420 + bob(f, 0, 5)}px` }}>
        <Tooth size={260} crownOnly mood="wow" blink={blinking(f, 1)} />
      </div>
    </Scene>
  );
};

export const SPilar: React.FC = () => {
  const f = useCurrentFrame();
  const a = prog(f, 20, 60, easeInOut);
  return (
    <Scene bg="pink">
      <Top>
        <StepChip n={5} />
        <Title lines={["Encaixe do", "*pilar*"]} size={110} />
        <Small delay={22}>A peça que vai segurar a coroa.</Small>
      </Top>
      <div style={{ position: "absolute", left: 0, top: SECTION_TOP }}>
        <CrossSection screw={{ insert: 1, phase: 6 }} abutment={a} neighborMood={a >= 1 ? "happy" : "wow"} look={5} t={f}>
          <g opacity={prog(f, 10, 10) * (1 - prog(f, 76, 10))} transform={`translate(0 ${bob(f, 0, 10, 6) + a * 120})`}>
            <path d="M500 150 L500 220 M470 195 L500 225 L530 195" stroke={C.accent} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </CrossSection>
      </div>
    </Scene>
  );
};

export const SCoroa: React.FC = () => {
  const f = useCurrentFrame();
  const drop = prog(f, 20, 70, easeInOut);
  const landed = drop >= 1;
  const burst = prog(f, 90, 30);
  return (
    <Scene bg="white">
      <Top>
        <StepChip n={6} />
        <Title lines={["A *coroa*", "feita sob medida"]} size={100} />
        <Small delay={28}>{"Com a cor e o formato pensados\npra combinar com os outros dentes."}</Small>
      </Top>
      <div style={{ position: "absolute", left: 0, top: SECTION_TOP }}>
        <CrossSection
          screw={{ insert: 1, phase: 6 }}
          abutment={1}
          crown={{ drop, mood: landed ? "happy" : "wow" }}
          neighborMood={landed ? "happy" : "wow"}
          look={6}
          t={f}
        >
          {landed
            ? [0, 1, 2, 3, 4].map((k) => {
                const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
                return (
                  <Sparkle
                    key={k}
                    x={500 + Math.cos(a) * (120 + burst * 90)}
                    y={300 + Math.sin(a) * (90 + burst * 70)}
                    s={0.9 * (1 - burst * 0.6)}
                    color={k % 2 ? C.yellow : C.accent}
                    opacity={1 - burst}
                  />
                );
              })
            : null}
        </CrossSection>
      </div>
    </Scene>
  );
};

export const SEstimuloVolta: React.FC = () => {
  const f = useCurrentFrame();
  const { off, on } = usePress(40, 36);
  return (
    <Scene bg="yellow">
      <Top>
        <Title lines={["O osso volta", "a ter *estímulo*"]} size={100} delay={8} />
        <Small delay={32}>{"O pino faz o papel da raiz: a mordida\nchega no osso de novo e ajuda a preservá-lo."}</Small>
      </Top>
      <div style={{ position: "absolute", left: 0, top: SECTION_TOP }}>
        <CrossSection screw={{ insert: 1, phase: 6 }} abutment={1} crown={{ drop: 1, mood: "happy" }} neighborMood="happy" look={6} t={f}>
          <AnimPulses x={500} y={660} rx={85} ry={160} start={40} period={36} />
          <g opacity={on} transform={`translate(0 ${off})`}>
            <ForceArrow x={500} y={185} />
          </g>
        </CrossSection>
      </div>
    </Scene>
  );
};
