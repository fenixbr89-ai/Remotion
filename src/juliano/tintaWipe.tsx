import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { CLAMP } from "../pixora/ui";
import { J } from "./tema";

type Props = { from: "left" | "right" };

/** Faixa de tinta laranja com borda arredondada e textura de cerdas. */
const Faixa: React.FC<{
  readonly cover: number;
  readonly fromLeft: boolean;
}> = ({ cover, fromLeft }) => {
  const pos = `${-230 + cover * 200}%`;
  return (
    <div
      style={{
        position: "absolute",
        top: "-25%",
        bottom: "-25%",
        width: "200%",
        left: fromLeft ? pos : undefined,
        right: fromLeft ? undefined : pos,
        rotate: "-12deg",
        borderRadius: fromLeft ? "0 700px 700px 0" : "700px 0 0 700px",
        background: `repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 3px, transparent 3px, transparent 22px), linear-gradient(90deg, ${J.laranja}, #F4813A 60%, ${J.laranja})`,
      }}
    />
  );
};

const TintaWipe: React.FC<TransitionPresentationComponentProps<Props>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps: { from },
}) => {
  const fromLeft = from === "left";
  if (presentationDirection === "exiting") {
    // a tinta entra e cobre a cena que sai
    const cover = interpolate(p, [0, 0.5], [0, 1], CLAMP);
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {children}
        <Faixa cover={cover} fromLeft={fromLeft} />
      </AbsoluteFill>
    );
  }
  // a tinta continua e sai pelo outro lado, revelando a cena nova
  const leave = interpolate(p, [0.5, 1], [1, 2.25], CLAMP);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: p >= 0.5 ? 1 : 0 }}>
      {children}
      <Faixa cover={leave} fromLeft={fromLeft} />
    </AbsoluteFill>
  );
};

export const tinta = (
  from: Props["from"] = "left",
): TransitionPresentation<Props> => ({
  component: TintaWipe,
  props: { from },
});
