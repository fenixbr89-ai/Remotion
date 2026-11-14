import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { cor, degrade } from "../tema";

type P = Record<string, never>;

/**
 * Transição da série: a cena sai subindo com desfoque, faixas em degradê azul varrem a tela
 * de baixo pra cima e a cena nova entra subindo. Tudo reto, sem rotação.
 */
const Componente: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress }) => {
  const p = Easing.bezier(0.65, 0, 0.35, 1)(presentationProgress);
  const saindo = presentationDirection === "exiting";
  const estilo: React.CSSProperties = saindo
    ? { opacity: interpolate(p, [0, 0.5], [1, 0], { extrapolateRight: "clamp" }), translate: `0 ${-p * 220}px`, scale: `${1 - p * 0.06}`, filter: `blur(${p * 12}px)` }
    : { opacity: interpolate(p, [0.45, 1], [0, 1], { extrapolateLeft: "clamp" }), translate: `0 ${(1 - p) * 220}px`, scale: `${0.94 + p * 0.06}`, filter: `blur(${(1 - p) * 12}px)` };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={estilo}>{children}</AbsoluteFill>
      {!saindo &&
        [0, 1, 2].map((i) => {
          const local = interpolate(presentationProgress, [i * 0.08, 0.76 + i * 0.08], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.65, 0, 0.35, 1) });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 520,
                top: interpolate(local, [0, 1], [1920, -620]),
                backgroundImage: i === 1 ? degrade : `linear-gradient(180deg, ${cor.azulCeu}, ${cor.azulClaro})`,
                opacity: i === 1 ? 1 : 0.7,
                borderRadius: 80,
                marginLeft: -60 + i * 40,
                marginRight: -60 + i * 40,
              }}
            />
          );
        })}
    </AbsoluteFill>
  );
};

export const transicaoSerie = (): TransitionPresentation<P> => ({ component: Componente, props: {} });
