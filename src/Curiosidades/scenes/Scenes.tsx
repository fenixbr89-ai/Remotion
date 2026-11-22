import React from "react";
import { AbsoluteFill } from "remotion";
import { C, fontFamily } from "../theme";
import { Card, Chip, Scene, Small, Title, Top } from "../Layout";
import { Sparkle, Tooth } from "../Tooth";
import { CrossSection } from "../CrossSection";
import { ForceArrow, Osteoclast, Pulses, SvgLabel } from "../Parts";
import { Jaws, Ridge, Sinus } from "../Jaws";
import {
  SAnatomia,
  SBranemark,
  SComoFaz,
  SCoroa,
  SEnxerto,
  SEstimuloVolta,
  SOsseo,
  SPilar,
  SPino,
  SPlanejamento,
  SPreparo,
} from "./Implante";

/** Row of tooth characters standing in a gum "floor". */
const SmileRow: React.FC<{ missing?: boolean; happy?: boolean; top?: number }> = ({ missing, happy, top = 900 }) => {
  const moods = happy
    ? (["happy", "happy", "wink", "happy", "happy"] as const)
    : (["calm", "wow", null, "worried", "calm"] as const);
  const looks = happy ? [0, 0, 0, 0, 0] : [5, 7, 0, -7, -5];
  const sizes = [200, 245, 280, 245, 200];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, bottom: 0 }}>
      <div style={{ position: "absolute", top: 100, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
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
            background: "radial-gradient(ellipse at 50% 35%, #8a2e46 0%, #b2475f 70%, #cf6079 100%)",
          }}
        />
      ) : null}
    </div>
  );
};

export const S01Gancho: React.FC = () => (
  <Scene bg="white">
    <Top top={250}>
      <Title lines={["Quando um dente", "cai, o que acontece", "com o *osso*?"]} size={86} />
    </Top>
    <SmileRow missing top={960} />
  </Scene>
);

export const S02Estimulo: React.FC = () => (
  <Scene bg="yellow">
    <Top>
      <Chip n={1} />
      <Title lines={["O osso vive", "de *estímulo*"]} size={100} />
      <Small>Cada mordida "avisa" o osso{"\n"}que ele ainda é necessário.</Small>
    </Top>
    <div style={{ position: "absolute", left: 0, top: 800 }}>
      <CrossSection middleTooth="happy" neighborMood="happy">
        <Pulses x={220} y={680} rx={90} ry={150} />
        <Pulses x={500} y={680} rx={90} ry={150} />
        <Pulses x={780} y={680} rx={90} ry={150} />
        <ForceArrow x={220} y={185} />
        <ForceArrow x={500} y={185} />
        <ForceArrow x={780} y={185} />
      </CrossSection>
    </div>
  </Scene>
);

export const S03Reabsorcao: React.FC = () => (
  <Scene bg="pink">
    <Top>
      <Chip n={2} />
      <Title lines={["Sem dente, o osso", "é *reabsorvido*"]} size={92} />
      <Small>Células chamadas osteoclastos{"\n"}desmontam o osso sem uso.</Small>
    </Top>
    <div style={{ position: "absolute", left: 0, top: 820 }}>
      <CrossSection boneLoss={0.45} neighborMood="worried" look={6}>
        <Osteoclast x={420} y={640} s={1.4} />
        <Osteoclast x={590} y={770} s={1.3} flip />
        <Osteoclast x={450} y={900} s={1.1} />
        <SvgLabel x={600} y={720} tx={640} ty={930} text="osteoclastos" />
      </CrossSection>
    </div>
  </Scene>
);

export const S04Numero: React.FC = () => (
  <Scene bg="white">
    <Top>
      <Chip n={3} />
      <Title lines={["Até *metade*", "da largura do osso"]} size={96} />
      <Small>pode sumir no primeiro ano,{"\n"}a maior parte nos 3 primeiros meses.</Small>
    </Top>
    <Card style={{ top: 1000, left: 70, width: 440, padding: "30px 20px", display: "flex", flexDirection: "column", alignItems: "center", rotate: "-2deg" }}>
      <Ridge />
      <div style={{ fontWeight: 700, fontSize: 36, marginTop: 10 }}>logo após a perda</div>
    </Card>
    <Card style={{ top: 1060, right: 70, width: 440, padding: "30px 20px", display: "flex", flexDirection: "column", alignItems: "center", rotate: "2deg" }}>
      <Ridge after />
      <div style={{ fontWeight: 700, fontSize: 36, marginTop: 10 }}>1 ano depois</div>
    </Card>
    <Small style={{ position: "absolute", bottom: 90, left: 0, right: 0, margin: "0 auto", width: "fit-content", fontSize: 26, padding: "12px 28px" }}>Fonte: Schropp et al., 2003</Small>
  </Scene>
);

export const S05Vizinhos: React.FC = () => (
  <Scene bg="yellow">
    <Top>
      <Chip n={4} />
      <Title lines={["Os vizinhos", "*tombam*"]} size={104} />
      <Small>Os dentes do lado se inclinam{"\n"}para ocupar o espaço vazio.</Small>
    </Top>
    <div style={{ position: "absolute", left: 0, top: 820 }}>
      <CrossSection boneLoss={0.7} tilt={9} neighborMood="worried" look={6}>
        <g fill="none" stroke={C.accent} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round">
          <path d="M250 120 Q330 90 390 140" />
          <path d="M392 100 L392 142 L352 150" />
          <path d="M750 120 Q670 90 610 140" />
          <path d="M608 100 L608 142 L648 150" />
        </g>
      </CrossSection>
    </div>
  </Scene>
);

export const S06Extrusao: React.FC = () => (
  <Scene bg="pink">
    <Top>
      <Chip n={5} />
      <Title lines={["O dente de cima", "*desce*"]} size={100} />
      <Small>Sem um par pra morder,{"\n"}ele vai "saindo" do osso: é a extrusão.</Small>
    </Top>
    <div style={{ position: "absolute", left: 0, top: 520 }}>
      <Jaws extrude={90}>
        <g fill="none" stroke={C.accent} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round">
          <path d="M650 560 L650 720" />
          <path d="M622 692 L650 724 L678 692" />
        </g>
      </Jaws>
    </div>
  </Scene>
);

export const S07Seio: React.FC = () => (
  <Scene bg="white">
    <Top>
      <Chip n={6} />
      <Title lines={["Em cima, o seio", "maxilar *desce*"]} size={96} />
      <Small>O espaço de ar cresce para baixo{"\n"}e sobra pouco osso.</Small>
    </Top>
    <div style={{ position: "absolute", left: 0, top: 820 }}>
      <Sinus>
        <SvgLabel x={640} y={140} tx={560} ty={-30} text="seio maxilar" />
        <SvgLabel x={500} y={540} tx={500} ty={800} text="pouco osso" center />
      </Sinus>
    </div>
  </Scene>
);

const Effect: React.FC<{ title: string; icon: React.ReactNode; style: React.CSSProperties }> = ({ title, icon, style }) => (
  <Card style={{ width: 450, height: 330, display: "flex", flexDirection: "column", justifyContent: "center", gap: 22, padding: "30px 36px", ...style }}>
    <div style={{ width: 100, height: 100, borderRadius: 30, background: C.accentSoft, display: "grid", placeItems: "center" }}>{icon}</div>
    <div style={{ fontWeight: 700, fontSize: 40, lineHeight: 1.15 }}>{title}</div>
  </Card>
);

export const S08Domino: React.FC = () => (
  <Scene bg="yellow">
    <Top>
      <Title lines={["*Efeito* dominó"]} size={104} />
      <Small>Um dente a menos mexe com a boca toda.</Small>
    </Top>
    <Effect
      style={{ top: 640, left: 60, rotate: "-2deg" }}
      title="A mordida desalinha"
      icon={
        <svg viewBox="0 0 64 64" width={64} height={64}>
          <path d="M8 22 L56 22 M8 42 L30 42 L36 36 L56 36" stroke={C.accentDeep} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      }
    />
    <Effect
      style={{ top: 680, right: 60, rotate: "2deg" }}
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
      style={{ top: 1060, left: 60, rotate: "1.5deg" }}
      title="Mastiga de um lado só"
      icon={
        <svg viewBox="0 0 64 64" width={64} height={64}>
          <path d="M10 32 L46 32 M34 18 L48 32 L34 46" stroke={C.accentDeep} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x={50} y={14} width={6} height={36} rx={3} fill={C.accentDeep} />
        </svg>
      }
    />
    <Effect
      style={{ top: 1100, right: 60, rotate: "-1.5deg" }}
      title="Pode precisar de enxerto depois"
      icon={
        <svg viewBox="0 0 64 64" width={64} height={64}>
          <path d="M14 50 L16 26 Q18 14 32 14 Q46 14 48 26 L50 50 Z" fill={C.bone} stroke={C.accentDeep} strokeWidth={4} />
          <path d="M32 26 L32 42 M24 34 L40 34" stroke={C.accentDeep} strokeWidth={5} strokeLinecap="round" />
        </svg>
      }
    />
    <div style={{ position: "absolute", left: 420, top: 1500 }}>
      <Tooth size={240} crownOnly mood="worried" />
    </div>
  </Scene>
);

export const S10Recado: React.FC = () => (
  <Scene bg="pink">
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 60 }}>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: -120,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 65%)",
          }}
        />
        <Tooth size={260} crownOnly mood="calm" shadow={false} />
        <svg width={260} height={60} viewBox="0 0 260 60" style={{ position: "absolute", top: -60, left: 0, overflow: "visible" }}>
          <Sparkle x={10} y={30} s={1.2} color="#ffffff" />
          <Sparkle x={250} y={10} s={0.9} color={C.yellow} />
        </svg>
      </div>
      <Title lines={["Perdeu um dente?", "Quanto *antes*", "cuidar, melhor", "pro osso."]} size={106} />
    </AbsoluteFill>
  </Scene>
);

export const S11Final: React.FC = () => (
  <Scene bg="yellow">
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 330, gap: 50 }}>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: -140,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 65%)",
          }}
        />
        <Tooth size={340} crownOnly mood="wink" shadow={false} />
      </div>
      <Title lines={["Curtiu a", "*curiosidade*?"]} size={116} />
      <Small>Salva e manda pra quem{"\n"}precisa saber disso.</Small>
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
        }}
      >
        Segue pra mais!
      </div>
      <div style={{ fontFamily, fontWeight: 700, fontSize: 38, color: C.ink, marginTop: 6 }}>@yasminsr09</div>
    </AbsoluteFill>
  </Scene>
);

/** sec = how long each scene stays on screen (narration pace) */
export const SCENES: { id: string; C: React.FC; sec: number }[] = [
  { id: "Cena01-Gancho", C: S01Gancho, sec: 3.5 },
  { id: "Cena02-Estimulo", C: S02Estimulo, sec: 5 },
  { id: "Cena03-Reabsorcao", C: S03Reabsorcao, sec: 5 },
  { id: "Cena04-Numero", C: S04Numero, sec: 5 },
  { id: "Cena05-Vizinhos", C: S05Vizinhos, sec: 3.5 },
  { id: "Cena06-Extrusao", C: S06Extrusao, sec: 4.5 },
  { id: "Cena07-SeioMaxilar", C: S07Seio, sec: 4.5 },
  { id: "Cena08-Domino", C: S08Domino, sec: 5.5 },
  { id: "Cena09-ComoFaz", C: SComoFaz, sec: 2.5 },
  { id: "Cena10-Anatomia", C: SAnatomia, sec: 5 },
  { id: "Cena11-Planejamento", C: SPlanejamento, sec: 4.5 },
  { id: "Cena12-Enxerto", C: SEnxerto, sec: 4 },
  { id: "Cena13-Preparo", C: SPreparo, sec: 4 },
  { id: "Cena14-Pino", C: SPino, sec: 3.5 },
  { id: "Cena15-Osseointegracao", C: SOsseo, sec: 5 },
  { id: "Cena16-Branemark", C: SBranemark, sec: 6 },
  { id: "Cena17-Pilar", C: SPilar, sec: 3 },
  { id: "Cena18-Coroa", C: SCoroa, sec: 3.5 },
  { id: "Cena19-EstimuloVolta", C: SEstimuloVolta, sec: 4.5 },
  { id: "Cena20-Recado", C: S10Recado, sec: 3.5 },
  { id: "Cena21-Final", C: S11Final, sec: 3.5 },
];
