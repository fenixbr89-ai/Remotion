import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { degrade } from "../tema";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const forte = Easing.bezier(0.83, 0, 0.17, 1);

/** Empurrão rápido de câmera (whip): a cena atual sai e a próxima entra pelo lado oposto. */
type PWhip = { dir: "esquerda" | "cima" };
const Whip: React.FC<TransitionPresentationComponentProps<PWhip>> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const p = forte(presentationProgress);
  const d = passedProps.dir === "esquerda" ? { x: -1080, y: 0 } : { x: 0, y: -1920 };
  const k = presentationDirection === "exiting" ? p : p - 1;
  return <AbsoluteFill style={{ translate: `${d.x * k}px ${d.y * k}px` }}>{children}</AbsoluteFill>;
};
export const whip = (dir: PWhip["dir"] = "esquerda"): TransitionPresentation<PWhip> => ({ component: Whip, props: { dir } });

/** Inundação azul: um círculo em degradê cobre a tela e depois abre um buraco revelando a próxima cena. */
type PFlood = Record<string, never>;
const Flood: React.FC<TransitionPresentationComponentProps<PFlood>> = ({ children, presentationDirection, presentationProgress }) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    const r = interpolate(p, [0, 0.5], [0, 1250], { ...clamp, easing: Easing.bezier(0.5, 0, 0.75, 0) });
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ scale: `${1 + p * 0.1}` }}>{children}</AbsoluteFill>
        <div style={{ position: "absolute", left: 540 - r, top: 960 - r, width: r * 2, height: r * 2, borderRadius: "50%", background: degrade }} />
      </AbsoluteFill>
    );
  }
  if (p < 0.5) return null;
  const r = interpolate(p, [0.5, 1], [0, 1250], { ...clamp, easing: Easing.bezier(0.25, 1, 0.5, 1) });
  const mascara = `radial-gradient(circle at 540px 960px, transparent ${r}px, black ${r + 1}px)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ scale: `${1.08 - (p - 0.5) * 0.16}` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: degrade, maskImage: mascara, WebkitMaskImage: mascara }} />
    </AbsoluteFill>
  );
};
export const flood = (): TransitionPresentation<PFlood> => ({ component: Flood, props: {} });
