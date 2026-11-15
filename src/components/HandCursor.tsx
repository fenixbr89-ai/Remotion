import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "./anim";
import { HandIcon } from "./Icons";

/** Cursor de mão que viaja até (toX,toY) e clica em clickAt (scale 0.9) */
export const HandCursor: React.FC<{
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  start: number;
  clickAt: number;
}> = ({ fromX, fromY, toX, toY, start, clickAt }) => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.22, 1, 0.36, 1);
  const x = interpolate(frame, [start, clickAt - 4], [fromX, toX], { ...clamp, easing: ease });
  const y = interpolate(frame, [start, clickAt - 4], [fromY, toY], { ...clamp, easing: ease });
  const away = interpolate(frame, [clickAt + 8, clickAt + 22], [0, 1], { ...clamp, easing: ease });
  const scale = interpolate(frame, [clickAt - 2, clickAt, clickAt + 4], [1, 0.9, 1], clamp);
  const opacity = interpolate(frame, [start, start + 6], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 44 + away * 260,
        top: y - 6 + away * 220,
        scale: `${scale}`,
        opacity,
        filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.25))",
      }}
    >
      <HandIcon size={130} />
    </div>
  );
};
