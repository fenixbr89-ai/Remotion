import React from "react";
import { Series, useVideoConfig } from "remotion";
import { SCENES } from "./scenes/Scenes";

export const ImplanteVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Series>
      {SCENES.map(({ id, C }) => (
        <Series.Sequence key={id} name={id} durationInFrames={3 * fps}>
          <C />
        </Series.Sequence>
      ))}
    </Series>
  );
};
