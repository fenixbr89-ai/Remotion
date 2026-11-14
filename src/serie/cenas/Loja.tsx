import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Loja as Fachada, MaisUm, Pessoa } from "../ui/Ilustracoes";
import { cor, entra, flutua, fontFamily, suave } from "../tema";
import type { CenaProps } from "./props";

const CLIENTES = [
  { lado: -1, x: 120, roupa: cor.azul, pele: 0, t: 70 },
  { lado: -1, x: 230, roupa: cor.azulCeu, pele: 2, t: 82 },
  { lado: 1, x: 150, roupa: cor.azulProfundo, pele: 1, t: 94 },
];

export const Loja: React.FC<CenaProps> = ({ n, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const loja = entra(f, fps, 8, 13);
  const luz = suave(f, 40, 70);
  const etq = entra(f, fps, 150, 9);
  // a câmera vai entrando na loja no fim da cena
  const zoom = interpolate(f, [dur - 60, dur], [1, 1.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 180, scale: `${zoom}` }}>
        <div style={{ position: "relative", scale: `${0.85 + loja * 0.15}`, opacity: loja, translate: `0 ${(1 - loja) * 80}px` }}>
          <Fachada nome={n.nome} luz={luz} largura={720} />
          <div style={{ position: "absolute", left: "50%", top: -150, marginLeft: -110, scale: `${etq}`, opacity: etq, translate: `0 ${flutua(f, 0, 10)}px` }}>
            <div style={{ width: 220, padding: "18px 0", borderRadius: 28, background: cor.branco, border: `4px solid ${cor.azul}`, textAlign: "center", color: cor.preto, fontSize: 56, fontWeight: 800, boxShadow: "0 20px 40px rgba(29,78,216,0.2)" }}>
              R$ ?
            </div>
          </div>
          {CLIENTES.map((c, i) => {
            const anda = suave(f, c.t, c.t + 30);
            const passo = Math.abs(Math.sin(f / 4)) * 8 * (1 - anda);
            return (
              <div key={i} style={{ position: "absolute", bottom: 4, [c.lado < 0 ? "left" : "right"]: -c.x + (1 - anda) * -320, translate: `0 ${-passo}px` }}>
                <Pessoa roupa={c.roupa} pele={c.pele} altura={230} />
                <MaisUm escala={entra(f, fps, c.t + 32, 8)} style={{ top: -60, left: 10 }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
