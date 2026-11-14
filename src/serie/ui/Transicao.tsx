import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { AbsoluteFill, Easing, interpolate } from "remotion";

type P = Record<string, never>;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Transição limpa do miolo da tela (topo e legenda ficam fixos):
 * a ilustração atual sobe e some rápido; a próxima chega de baixo logo depois.
 * Sem desfoque e sem sobreposição borrada.
 */
const Componente: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress }) => {
  const p = Easing.bezier(0.33, 1, 0.68, 1)(presentationProgress);
  const estilo: React.CSSProperties =
    presentationDirection === "exiting"
      ? { opacity: interpolate(presentationProgress, [0, 0.5], [1, 0], clamp), translate: `0 ${-p * 90}px`, scale: `${1 - p * 0.05}` }
      : { opacity: interpolate(presentationProgress, [0.4, 1], [0, 1], clamp), translate: `0 ${(1 - p) * 120}px`, scale: `${0.96 + p * 0.04}` };
  return <AbsoluteFill style={estilo}>{children}</AbsoluteFill>;
};

export const transicaoSerie = (): TransitionPresentation<P> => ({ component: Componente, props: {} });
