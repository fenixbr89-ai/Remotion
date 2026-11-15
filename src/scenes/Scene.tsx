import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { exitAndDrift } from "../components/anim";
import { BlurBlobs } from "../components/BlurBlobs";
import { KineticText } from "../components/KineticText";
import { LogoReveal } from "../components/LogoReveal";
import { Pill } from "../components/Pill";
import { RingPair } from "../components/Ring";
import { UICard } from "../components/UICard";
import { bg } from "../theme";
import type { SceneSpec, Visual } from "../types";
import {
  BrushReveal,
  BuildingFloors,
  CalendarFlip,
  ChartDown,
  CheckCards,
  CtaLogo,
  HouseFill,
  PillsCascade,
  RollerTrail,
  Sparkles,
  WhatsappPill,
} from "./Visuals";

type Placement = "above" | "below" | "alone" | "overlay" | "wrap";

const placement = (v?: Visual): Placement | null => {
  if (!v) return null;
  switch (v.type) {
    case "icon-fill":
    case "building-floors":
    case "calendar-flip":
    case "cta-logo":
      return "above";
    case "chart-down":
    case "pills":
    case "roller-trail":
    case "check-cards":
    case "whatsapp":
      return "below";
    case "logo":
    case "app-card":
      return "alone";
    case "sparkles":
      return "overlay";
    case "brush-reveal":
      return "wrap";
  }
};

const renderVisual = (v: Visual): React.ReactNode => {
  switch (v.type) {
    case "chart-down":
      return <ChartDown />;
    case "logo":
      return <LogoReveal />;
    case "icon-fill":
      return <HouseFill />;
    case "building-floors":
      return <BuildingFloors floors={v.floors} />;
    case "pills":
      return <PillsCascade items={v.items} />;
    case "roller-trail":
      return <RollerTrail />;
    case "check-cards":
      return <CheckCards items={v.items} />;
    case "sparkles":
      return <Sparkles />;
    case "app-card":
      return <UICard title={v.title} button={v.button} done={v.done} />;
    case "calendar-flip":
      return <CalendarFlip day={v.day} />;
    case "cta-logo":
      return <CtaLogo />;
    case "whatsapp":
      return <WhatsappPill phone={v.phone} />;
    case "brush-reveal":
      return null;
  }
};

/** Uma cena: fundo + bolhas + anéis + visual + texto cinético, com saída padrão */
export const Scene: React.FC<{ scene: SceneSpec; index: number }> = ({ scene, index }) => {
  const frame = useCurrentFrame();
  const place = placement(scene.visual);
  const dark = scene.theme === "dark";
  const hasText = Boolean(scene.words?.length || scene.pill);
  const textDelay = place === "above" ? 8 : 0;

  let text: React.ReactNode = null;
  if (scene.words?.length) {
    text = (
      <KineticText words={scene.words} theme={scene.theme} size={scene.size ?? 150} delay={textDelay} />
    );
  } else if (scene.pill) {
    text = <Pill label={scene.pill} delay={textDelay} fontSize={84} />;
  }
  if (place === "wrap" && text) text = <BrushReveal>{text}</BrushReveal>;

  const visual = scene.visual ? renderVisual(scene.visual) : null;

  return (
    <AbsoluteFill style={{ background: bg(scene.theme) }}>
      <BlurBlobs offset={index * 37} />
      <AbsoluteFill style={exitAndDrift(frame, scene.duration)}>
        {hasText && place !== "alone" ? <RingPair dark={dark} opacity={dark ? 0.45 : 0.35} /> : null}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 80,
            padding: "100px 80px",
          }}
        >
          {place === "above" || place === "alone" ? visual : null}
          {text}
          {place === "below" ? visual : null}
        </AbsoluteFill>
        {place === "overlay" ? visual : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
