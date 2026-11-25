import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Background, BrandBar, SceneWrap } from "./components";
import { LOGO_FONT, ThemeName, sceneFrames } from "./theme";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { Scene1Reveal } from "./scenes/Scene1Reveal";
import { Scene2Motion } from "./scenes/Scene2Motion";
import { Scene3Grafico } from "./scenes/Scene3Grafico";
import { Scene4Impressao } from "./scenes/Scene4Impressao";
import { Scene5Final } from "./scenes/Scene5Final";

const SCENE_COMPONENTS: Record<string, React.FC> = {
  reveal: Scene1Reveal,
  motion: Scene2Motion,
  grafico: Scene3Grafico,
  impressao: Scene4Impressao,
  final: Scene5Final,
};

export const RyvoComercial: React.FC<{ tema: ThemeName }> = ({ tema }) => (
  <ThemeProvider name={tema}>
    <Inner />
  </ThemeProvider>
);

const Inner: React.FC = () => {
  const T = useTheme();
  const frame = useCurrentFrame();
  const scenes = sceneFrames();
  const last = scenes[scenes.length - 1];
  // Brand bar is hidden on the final scene (the logo is already centre stage).
  const barOpacity = interpolate(frame, [10, 24, last.from, last.from + 10], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background />
      {/* faint centred watermark */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: LOGO_FONT,
            fontStretch: "125%",
            fontWeight: 900,
            fontSize: 300,
            letterSpacing: "0.08em",
            color: T.watermark,
            opacity: 0.05 * barOpacity,
            transform: "rotate(-90deg)",
            whiteSpace: "nowrap",
          }}
        >
          RYVO
        </div>
      </AbsoluteFill>
      {scenes.map((s, i) => {
        const Comp = SCENE_COMPONENTS[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
            <SceneWrap durationInFrames={s.dur} fadeIn={i > 0} fadeOut={i < scenes.length - 1}>
              <Comp />
            </SceneWrap>
          </Sequence>
        );
      })}
      <BrandBar opacity={barOpacity} />
    </AbsoluteFill>
  );
};
