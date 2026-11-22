import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, fontFamily } from "../theme";
import { Card, Chip, Scene, Small, Title, Top } from "../Layout";
import { Sparkle, Tooth } from "../Tooth";
import { CrossSection } from "../CrossSection";
import { ForceArrow, Osteoclast, SvgLabel } from "../Parts";
import { Jaws, Ridge, Sinus } from "../Jaws";
import { blinking, bob, easeBack, easeInOut, prog } from "../anim";
import { AnimPulses, DrawArrow, Pop, Rise, usePress } from "./Helpers";

export const SECTION_TOP = 820;

/** Row of tooth characters standing in a gum "floor". */
const SmileRow: React.FC<{ fall?: boolean; top?: number }> = ({ fall, top = 900 }) => {
  const f = useCurrentFrame();
  const fallen = prog(f, 48, 34, easeInOut);
  const scared = f > 58;
  const moods = scared
    ? (["calm", "wow", null, "worried", "calm"] as const)
    : (["happy", "happy", null, "happy", "happy"] as const);
  const looks = scared ? [5, 7, 0, -7, -5] : [0, 0, 0, 0, 0];
  const sizes = [200, 245, 280, 245, 200];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, bottom: 0 }}>
      <div style={{ position: "absolute", top: 100, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
        {moods.map((m, i) => {
          const y = Math.abs(i - 2) * 34 + 40;
          const p = prog(f, 4 + i * 4, 24, easeBack);
          if (m === null) {
            if (!fall) return <div key={i} style={{ width: sizes[i] - 30 }} />;
            return (
              <div
                key={i}
                style={{
                  width: sizes[i] - 30,
                  display: "flex",
                  justifyContent: "center",
                  translate: `0px ${y - fallen * 520 + (1 - p) * 320}px`,
                  rotate: `${fallen * 28}deg`,
                  opacity: (1 - fallen) * prog(f, 4 + i * 4, 10),
                  margin: "0 -8px",
                }}
              >
                <Tooth size={sizes[i]} crownOnly mood={f > 40 ? "wow" : "happy"} shadow={false} />
              </div>
            );
          }
          return (
            <div
              key={i}
              style={{
                translate: `0px ${y + (1 - p) * 320 + bob(f, i, 4)}px`,
                rotate: `${(i - 2) * 5}deg`,
                margin: "0 -8px",
                opacity: prog(f, 4 + i * 4, 10),
              }}
            >
              <Tooth size={sizes[i]} crownOnly mood={m} look={looks[i]} shadow={false} blink={blinking(f, i)} />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: -80,
          right: -80,
          top: 400,
          bottom: -200,
          borderRadius: "50% 50% 0 0 / 22% 22% 0 0",
          background: `linear-gradient(180deg, #ffbcc8 0%, ${C.gum} 12%, ${C.gumDeep} 70%, #c95670 100%)`,
          boxShadow: "inset 0 18px 30px rgba(255,255,255,0.5), 0 -10px 40px rgba(200,80,110,0.15)",
          translate: `0px ${(1 - prog(f, 0, 26)) * 500}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540 - 95,
          top: 412,
          width: 190,
          height: 60,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at 50% 35%, #8a2e46 0%, #b2475f 70%, #cf6079 100%)",
          opacity: fall ? prog(f, 56, 16) : 1,
          scale: fall ? `${prog(f, 56, 20)}` : "1",
        }}
      />
    </div>
  );
};

export const S01Gancho: React.FC = () => (
  <Scene bg="white">
    <Top top={250}>
      <Title lines={["Quando um dente", "cai, o que acontece", "com o *osso*?"]} size={86} delay={14} />
    </Top>
    <SmileRow fall top={960} />
  </Scene>
);

export const S02Estimulo: React.FC = () => {
  const f = useCurrentFrame();
  const { off, on } = usePress(46, 36);
  return (
    <Scene bg="yellow">
      <Top>
        <Chip n={1} />
        <Title lines={["O osso vive", "de *estímulo*"]} size={100} />
        <Small delay={32}>{"Cada mordida \"avisa\" o osso\nque ele ainda é necessário."}</Small>
      </Top>
      <Rise delay={4} style={{ position: "absolute", left: 0, top: SECTION_TOP }}>
        <CrossSection middleTooth="happy" neighborMood="happy" t={f}>
          <AnimPulses x={220} y={680} rx={90} ry={150} start={46} period={36} />
          <AnimPulses x={500} y={680} rx={90} ry={150} start={46} period={36} />
          <AnimPulses x={780} y={680} rx={90} ry={150} start={46} period={36} />
          <g opacity={on} transform={`translate(0 ${off})`}>
            <ForceArrow x={220} y={185} />
            <ForceArrow x={500} y={185} />
            <ForceArrow x={780} y={185} />
          </g>
        </CrossSection>
      </Rise>
    </Scene>
  );
};

export const S03Reabsorcao: React.FC = () => {
  const f = useCurrentFrame();
  const cell = (d: number) => prog(f, d, 22, easeBack);
  return (
    <Scene bg="pink">
      <Top>
        <Chip n={2} />
        <Title lines={["Sem dente, o osso", "é *reabsorvido*"]} size={92} />
        <Small delay={40}>{"Células chamadas osteoclastos\ndesmontam o osso sem uso."}</Small>
      </Top>
      <div style={{ position: "absolute", left: 0, top: SECTION_TOP }}>
        <CrossSection
          middleTooth="sad"
          middleLift={prog(f, 6, 34, easeInOut)}
          boneLoss={prog(f, 50, 100) * 0.45}
          neighborMood={f > 30 ? "worried" : "happy"}
          look={f > 30 ? 6 : 0}
          t={f}
        >
          {[
            { x: 420, y: 640, s: 1.4, d: 52, flip: false },
            { x: 590, y: 770, s: 1.3, d: 64, flip: true },
            { x: 450, y: 900, s: 1.1, d: 76, flip: false },
          ].map((o, i) => (
            <g key={i} transform={`translate(${o.x} ${o.y + bob(f, i, 6, 10)}) rotate(${Math.sin((f + i * 9) / 7) * 6}) scale(${cell(o.d)})`}>
              <Osteoclast x={0} y={0} s={o.s} flip={o.flip} />
            </g>
          ))}
          <g opacity={prog(f, 100, 16)}>
            <SvgLabel x={600} y={720} tx={640} ty={930} text="osteoclastos" />
          </g>
        </CrossSection>
      </div>
    </Scene>
  );
};

export const S04Numero: React.FC = () => {
  const f = useCurrentFrame();
  const shrink = prog(f, 44, 90, easeInOut);
  const inL = prog(f, 10, 28);
  const inR = prog(f, 18, 28);
  return (
    <Scene bg="white">
      <Top>
        <Chip n={3} />
        <Title lines={["Até *metade*", "da largura do osso"]} size={96} />
        <Small delay={38}>{"pode sumir no primeiro ano,\na maior parte nos 3 primeiros meses."}</Small>
      </Top>
      <Card
        style={{
          top: 1000,
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
        <Ridge />
        <div style={{ fontWeight: 700, fontSize: 36, marginTop: 10 }}>logo após a perda</div>
      </Card>
      <Card
        style={{
          top: 1060,
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
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            padding: "8px 18px",
            borderRadius: 99,
            background: C.accent,
            color: "#fff",
            fontWeight: 800,
            fontSize: 30,
            fontVariantNumeric: "tabular-nums",
            opacity: prog(f, 44, 10),
          }}
        >
          −{Math.round(shrink * 50)}%
        </div>
        <Ridge p={shrink} />
        <div style={{ fontWeight: 700, fontSize: 36, marginTop: 10 }}>1 ano depois</div>
      </Card>
      <Small delay={70} style={{ position: "absolute", bottom: 90, left: 0, right: 0, margin: "0 auto", width: "fit-content", fontSize: 26, padding: "12px 28px" }}>
        Fonte: Schropp et al., 2003
      </Small>
    </Scene>
  );
};

export const S05Vizinhos: React.FC = () => {
  const f = useCurrentFrame();
  const a = prog(f, 50, 26);
  return (
    <Scene bg="yellow">
      <Top>
        <Chip n={4} />
        <Title lines={["Os vizinhos", "*tombam*"]} size={104} />
        <Small delay={30}>{"Os dentes do lado se inclinam\npara ocupar o espaço vazio."}</Small>
      </Top>
      <Rise delay={4} style={{ position: "absolute", left: 0, top: SECTION_TOP }}>
        <CrossSection boneLoss={0.7} tilt={prog(f, 24, 100, easeInOut) * 9} neighborMood="worried" look={6} t={f}>
          <DrawArrow d="M250 120 Q330 90 390 140" head="M392 100 L392 142 L352 150" p={a} />
          <DrawArrow d="M750 120 Q670 90 610 140" head="M608 100 L608 142 L648 150" p={a} />
        </CrossSection>
      </Rise>
    </Scene>
  );
};

export const S06Extrusao: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Scene bg="pink">
      <Top>
        <Chip n={5} />
        <Title lines={["O dente de cima", "*desce*"]} size={100} />
        <Small delay={34}>{"Sem um par pra morder,\nele vai \"saindo\" do osso: é a extrusão."}</Small>
      </Top>
      <Rise delay={4} style={{ position: "absolute", left: 0, top: 520 }}>
        <Jaws extrude={prog(f, 30, 100, easeInOut) * 90} t={f}>
          <DrawArrow d="M650 560 L650 720" head="M622 692 L650 724 L678 692" p={prog(f, 56, 24)} />
        </Jaws>
      </Rise>
    </Scene>
  );
};

export const S07Seio: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Scene bg="white">
      <Top>
        <Chip n={6} />
        <Title lines={["Em cima, o seio", "maxilar *desce*"]} size={96} />
        <Small delay={38}>{"O espaço de ar cresce para baixo\ne sobra pouco osso."}</Small>
      </Top>
      <Rise delay={4} style={{ position: "absolute", left: 0, top: SECTION_TOP }}>
        <Sinus drop={prog(f, 30, 100, easeInOut)} t={f}>
          <g opacity={prog(f, 60, 16)}>
            <SvgLabel x={640} y={140} tx={560} ty={-30} text="seio maxilar" />
          </g>
          <g opacity={prog(f, 110, 16)}>
            <SvgLabel x={500} y={540} tx={500} ty={800} text="pouco osso" center />
          </g>
        </Sinus>
      </Rise>
    </Scene>
  );
};

const Effect: React.FC<{ title: string; icon: React.ReactNode; style: React.CSSProperties; rot: number; delay: number }> = ({
  title,
  icon,
  style,
  rot,
  delay,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, delay, 26, easeBack);
  return (
    <Card
      style={{
        width: 450,
        height: 330,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 22,
        padding: "30px 36px",
        opacity: prog(f, delay, 10),
        rotate: `${rot - (1 - p) * 30 + Math.sin((f - delay) / 22) * 0.8 * p}deg`,
        translate: `0px ${(1 - p) * -140}px`,
        transformOrigin: "50% 100%",
        ...style,
      }}
    >
      <div style={{ width: 100, height: 100, borderRadius: 30, background: C.accentSoft, display: "grid", placeItems: "center" }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 40, lineHeight: 1.15 }}>{title}</div>
    </Card>
  );
};

export const S08Domino: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Scene bg="yellow">
      <Top>
        <Title lines={["*Efeito* dominó"]} size={104} delay={8} />
        <Small delay={18}>Um dente a menos mexe com a boca toda.</Small>
      </Top>
      <Effect
        delay={36}
        rot={-2}
        style={{ top: 640, left: 60 }}
        title="A mordida desalinha"
        icon={
          <svg viewBox="0 0 64 64" width={64} height={64}>
            <path d="M8 22 L56 22 M8 42 L30 42 L36 36 L56 36" stroke={C.accentDeep} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />
      <Effect
        delay={46}
        rot={2}
        style={{ top: 680, right: 60 }}
        title="Comida fica presa"
        icon={
          <svg viewBox="0 0 64 64" width={64} height={64}>
            <path d="M14 38 C10 24 22 14 32 20 C42 14 54 24 50 38 C46 52 18 52 14 38 Z" fill={C.yellow} stroke={C.accentDeep} strokeWidth={4} />
            <circle cx={26} cy={34} r={4} fill={C.accentDeep} />
            <circle cx={38} cy={30} r={3} fill={C.accentDeep} />
          </svg>
        }
      />
      <Effect
        delay={56}
        rot={1.5}
        style={{ top: 1060, left: 60 }}
        title="Mastiga de um lado só"
        icon={
          <svg viewBox="0 0 64 64" width={64} height={64}>
            <path d="M10 32 L46 32 M34 18 L48 32 L34 46" stroke={C.accentDeep} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x={50} y={14} width={6} height={36} rx={3} fill={C.accentDeep} />
          </svg>
        }
      />
      <Effect
        delay={66}
        rot={-1.5}
        style={{ top: 1100, right: 60 }}
        title="Pode precisar de enxerto depois"
        icon={
          <svg viewBox="0 0 64 64" width={64} height={64}>
            <path d="M14 50 L16 26 Q18 14 32 14 Q46 14 48 26 L50 50 Z" fill={C.bone} stroke={C.accentDeep} strokeWidth={4} />
            <path d="M32 26 L32 42 M24 34 L40 34" stroke={C.accentDeep} strokeWidth={5} strokeLinecap="round" />
          </svg>
        }
      />
      <Pop delay={84} style={{ position: "absolute", left: 420, top: 1500 }}>
        <div style={{ translate: `0px ${bob(f, 0, 6)}px` }}>
          <Tooth size={240} crownOnly mood="worried" blink={blinking(f, 3)} />
        </div>
      </Pop>
    </Scene>
  );
};

export const S10Recado: React.FC = () => {
  const f = useCurrentFrame();
  const tw = (k: number) => 0.5 + 0.5 * Math.sin((f + k * 20) / 8);
  return (
    <Scene bg="pink">
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 60 }}>
        <Pop delay={4}>
          <div style={{ position: "relative", translate: `0px ${bob(f, 0, 8)}px` }}>
            <div
              style={{
                position: "absolute",
                inset: -120,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 65%)",
              }}
            />
            <Tooth size={260} crownOnly mood="calm" shadow={false} blink={blinking(f, 2)} />
            <svg width={260} height={60} viewBox="0 0 260 60" style={{ position: "absolute", top: -60, left: 0, overflow: "visible" }}>
              <Sparkle x={10} y={30} s={0.8 + 0.4 * tw(0)} color="#ffffff" opacity={tw(0)} />
              <Sparkle x={250} y={10} s={0.6 + 0.3 * tw(1)} color={C.yellow} opacity={tw(1)} />
            </svg>
          </div>
        </Pop>
        <Title lines={["Perdeu um dente?", "Quanto *antes*", "cuidar, melhor", "pro osso."]} size={106} delay={14} />
      </AbsoluteFill>
    </Scene>
  );
};

export const S11Final: React.FC = () => {
  const f = useCurrentFrame();
  const handle = "@yasminsr09";
  const typed = Math.max(0, Math.min(handle.length, Math.floor((f - 78) / 2)));
  const btn = prog(f, 64, 22, easeBack);
  return (
    <Scene bg="yellow">
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330, gap: 50 }}>
        <div style={{ position: "relative", translate: `0px ${(1 - prog(f, 4, 30, easeBack)) * -500 + bob(f, 0, 8)}px`, opacity: prog(f, 4, 12) }}>
          <div
            style={{
              position: "absolute",
              inset: -140,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 65%)",
            }}
          />
          <Tooth size={340} crownOnly mood={(f % 70) < 24 && f > 30 ? "wink" : "happy"} shadow={false} />
        </div>
        <Title lines={["Curtiu a", "*curiosidade*?"]} size={116} delay={18} />
        <Small delay={36}>{"Salva e manda pra quem\nprecisa saber disso."}</Small>
        <div
          style={{
            marginTop: 30,
            padding: "34px 70px",
            borderRadius: 999,
            background: C.accent,
            color: "#fff",
            fontFamily,
            fontWeight: 800,
            fontSize: 46,
            boxShadow: "0 24px 60px rgba(236,111,155,0.4)",
            opacity: prog(f, 64, 10),
            scale: interpolate(btn, [0, 1], [0.5, 1]) * (1 + 0.025 * Math.sin(Math.max(0, f - 90) / 8)),
          }}
        >
          Segue pra mais!
        </div>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 38, color: C.ink, marginTop: 6, minHeight: 50 }}>
          {handle.slice(0, typed)}
          <span style={{ opacity: typed < handle.length || Math.floor(f / 12) % 2 === 0 ? 1 : 0, color: C.accent }}>|</span>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
