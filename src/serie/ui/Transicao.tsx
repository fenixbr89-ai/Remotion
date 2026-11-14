import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { AbsoluteFill, Easing, interpolate } from "remotion";

type P = Record<string, never>;

/**
 * Transição da série, como um movimento de câmera contínuo: a cena sai aproximando e desfocando,
 * a próxima chega de baixo, já em foco. Sem rotação.
 */
const Componente: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress }) => {
  const p = Easing.bezier(0.65, 0, 0.35, 1)(presentationProgress);
  const saindo = presentationDirection === "exiting";
  const estilo: React.CSSProperties = saindo
    ? { opacity: interpolate(p, [0, 0.6], [1, 0], { extrapolateRight: "clamp" }), scale: `${1 + p * 0.12}`, filter: `blur(${p * 16}px)` }
    : { opacity: interpolate(p, [0.3, 1], [0, 1], { extrapolateLeft: "clamp" }), translate: `0 ${(1 - p) * 160}px`, scale: `${0.92 + p * 0.08}`, filter: `blur(${(1 - p) * 14}px)` };
  return <AbsoluteFill style={estilo}>{children}</AbsoluteFill>;
};

export const transicaoSerie = (): TransitionPresentation<P> => ({ component: Componente, props: {} });
