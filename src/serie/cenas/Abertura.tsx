import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Batida } from "../ui/Batida";
import { Letras } from "../ui/Cinetico";
import { CopoAcai, Loja as Fachada, MaisUm, Pessoa, Raios } from "../ui/Ilustracoes";
import { cor, degrade, entra, flutua, fontFamily, suave } from "../tema";
import { destaca, type CenaProps } from "./props";
import { Topo } from "./Topo";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Círculos de contorno que pipocam em volta do texto (acento gráfico). */
const Circulos: React.FC<{ em: number }> = ({ em }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lista = [
    { x: 150, y: 640, r: 70 },
    { x: 860, y: 760, r: 46 },
    { x: 200, y: 1300, r: 40 },
    { x: 880, y: 1220, r: 80 },
  ];
  return (
    <>
      {lista.map((c, i) => {
        const e = entra(f, fps, em + i * 3, 10);
        return <div key={i} style={{ position: "absolute", left: c.x - c.r, top: c.y - c.r, width: c.r * 2, height: c.r * 2, borderRadius: "50%", border: `6px solid ${i % 2 ? cor.azulCeu : cor.azul}`, scale: `${e}`, translate: `0 ${flutua(f, i, 12)}px` }} />;
      })}
    </>
  );
};

export const Gancho: React.FC<CenaProps> = ({ n }) => {
  const f = useCurrentFrame();
  const nome = n.nome.toUpperCase();
  const tam = Math.min(160, Math.floor(1560 / nome.length));
  const fim = 18 + nome.length * 2;
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center" }}>
      <Circulos em={fim} />
      <Batida linhas={[{ texto: "Se eu abrisse", em: 2, tamanho: 76 }, { texto: n.artigo, em: 10, tamanho: 52, peso: 700, corTexto: cor.textoSuave }]} gap={6} />
      <Letras texto={nome} inicio={16} tamanho={tam} intervalo={2} />
      <div style={{ height: 18, width: 640, borderRadius: 99, background: degrade, marginTop: 8, scale: `${suave(f, fim - 4, fim + 8)} 1` }} />
    </AbsoluteFill>
  );
};

const CLIENTES = [
  { lado: -1, x: 110, roupa: cor.azul, pele: 0, t: 18 },
  { lado: -1, x: 210, roupa: cor.azulCeu, pele: 2, t: 24 },
  { lado: 1, x: 140, roupa: cor.azulProfundo, pele: 1, t: 30 },
];

export const Loja: React.FC<CenaProps> = ({ n, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const loja = entra(f, fps, 0, 11);
  const zoom = interpolate(f, [dur - 25, dur], [1, 1.35], clamp);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Topo texto="A primeira coisa que eu faria:" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 120, scale: `${zoom}` }}>
        <div style={{ position: "relative", scale: `${0.7 + loja * 0.3}`, opacity: loja }}>
          <Fachada nome={n.nome} luz={suave(f, 8, 18)} largura={720} />
          {CLIENTES.map((c, i) => {
            const anda = suave(f, c.t, c.t + 14);
            return (
              <div key={i} style={{ position: "absolute", bottom: 4, [c.lado < 0 ? "left" : "right"]: -c.x + (1 - anda) * -300, translate: `0 ${-Math.abs(Math.sin(f / 3)) * 8 * (1 - anda)}px` }}>
                <Pessoa roupa={c.roupa} pele={c.pele} altura={220} />
                <MaisUm escala={entra(f, fps, c.t + 14, 7)} style={{ top: -56, left: 8 }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1450 }}>
        <Batida linhas={[{ texto: "acertar o *preço.*", em: 44, tamanho: 96 }]} />
      </div>
    </AbsoluteFill>
  );
};

export const Chute: React.FC<CenaProps> = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <Batida
      gap={18}
      linhas={[
        { texto: "Preço não é", em: 0, tamanho: 64, corTexto: cor.textoSuave, peso: 700 },
        { texto: "CHUTE.", em: 8, tamanho: 170, efeito: "slam", corTexto: cor.preto, risca: 26 },
        { texto: "É CONTA.", em: 38, tamanho: 150, efeito: "slam", degrade: true },
      ]}
    />
  </AbsoluteFill>
);

export const Cardapio: React.FC<CenaProps> = ({ n, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const foco = suave(f, 26, 40);
  const zoom = interpolate(f, [dur - 18, dur], [1, 2.6], { ...clamp, easing: (t) => t * t * t });
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Topo texto={`${n.cardapio.length} tamanhos. Foco no ${destaca(n.cardapio[n.carroChefe].nome + ".")}`} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 200, scale: `${zoom}` }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 30 }}>
          {n.cardapio.map((c, i) => {
            const e = entra(f, fps, i * 4, 10);
            const chefe = i === n.carroChefe;
            return (
              <div key={c.nome} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", opacity: e * (chefe ? 1 : 1 - foco * 0.65), translate: `0 ${(1 - e) * 160}px`, scale: `${chefe ? 1 + foco * 0.28 : 1 - foco * 0.12}`, zIndex: chefe ? 2 : 1 }}>
                {chefe && <Raios tamanho={720} style={{ top: -210, opacity: foco }} />}
                <CopoAcai tamanho={190 + i * 50} />
                <div style={{ marginTop: 14, padding: "10px 24px", borderRadius: 999, background: chefe && foco > 0.5 ? degrade : cor.branco, border: `2px solid ${cor.azulBorda}`, color: chefe && foco > 0.5 ? cor.branco : cor.texto, fontSize: 40, fontWeight: 800 }}>{c.nome}</div>
                {chefe && (
                  <div style={{ position: "absolute", top: -64, padding: "10px 20px", borderRadius: 999, background: cor.preto, color: cor.branco, fontSize: 24, fontWeight: 800, letterSpacing: 1, scale: `${entra(f, fps, 34, 8)}` }}>MAIS VENDIDO</div>
                )}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
