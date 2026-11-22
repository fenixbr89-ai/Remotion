import React from "react";
import { Series, useVideoConfig } from "remotion";
import { SCENES } from "./scenes/Scenes";

export const CuriosidadesVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Series>
      {SCENES.map(({ id, C, sec }) => (
        <Series.Sequence key={id} name={id} durationInFrames={Math.round(sec * fps)}>
          <C />
        </Series.Sequence>
      ))}
    </Series>
  );
};
