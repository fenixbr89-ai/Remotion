import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { G, LOJA_TOPO, naPosicao } from "../geo";
import { Batida } from "../ui/Batida";
import { Letras } from "../ui/Cinetico";
import { CopoAcai, Loja as Fachada, MaisUm, Pessoa, Raios } from "../ui/Ilustracoes";
import { cor, degrade, entra, estica, flutua, fontFamily, suave } from "../tema";
import { destaca, type CenaProps } from "./props";
import { Topo } from "./Topo";

export const Gancho: React.FC<CenaProps> = ({ n, ponte }) => {
  const f = useCurrentFrame();
  const nome = n.nome.toUpperCase();
  const tam = Math.min(160, Math.floor(1560 / nome.length));
  const fim = 18 + nome.length * 2;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 620, left: 0, right: 0 }}>
        <Batida linhas={[{ texto: "Se eu abrisse", em: 2, tamanho: 76 }]} />
      </div>
      <div style={{ position: "absolute", top: 718, left: 0, right: 0 }}>
        <Batida linhas={[{ texto: n.artigo, em: 10, tamanho: 52, peso: 700, corTexto: cor.textoSuave }]} />
      </div>
      <div style={{ position: "absolute", top: 800, left: 0, right: 0 }}>
        <Letras texto={nome} inicio={16} tamanho={tam} intervalo={2} />
      </div>
      {f < ponte.sai && <div style={{ ...naPosicao(G.ganchoBarra), background: degrade, scale: `${suave(f, fim - 4, fim + 8)} 1` }} />}
    </AbsoluteFill>
  );
};

const CLIENTES = [
  { lado: -1, x: 110, roupa: cor.azul, pele: 0, t: 14 },
  { lado: -1, x: 210, roupa: cor.azulCeu, pele: 2, t: 20 },
  { lado: 1, x: 140, roupa: cor.azulProfundo, pele: 1, t: 26 },
];

export const Loja: React.FC<CenaProps> = ({ n, ponte }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Topo texto="A primeira coisa que eu faria:" em={ponte.entra - 6} />
      <div style={{ position: "absolute", left: 180, top: LOJA_TOPO }}>
        <Fachada nome={n.nome} luz={suave(f, ponte.entra, ponte.entra + 10)} largura={720} />
        <div style={{ position: "absolute", left: 360 - 110, top: -170, scale: estica(f, fps, 50), translate: `0 ${flutua(f, 0, 8)}px`, width: 220, padding: "16px 0", borderRadius: 26, background: cor.branco, border: `4px solid ${cor.azul}`, textAlign: "center", color: cor.preto, fontSize: 54, fontWeight: 800 }}>
          R$ ?
        </div>
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
      <div style={{ position: "absolute", left: 0, right: 0, top: 1420 }}>
        <Batida linhas={[{ texto: "acertar o *preço.*", em: 40, tamanho: 96 }]} />
      </div>
    </AbsoluteFill>
  );
};

export const Chute: React.FC<CenaProps> = ({ ponte }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 690, left: 0, right: 0 }}>
        <Batida linhas={[{ texto: "Preço não é", em: 0, tamanho: 64, corTexto: cor.textoSuave, peso: 700 }]} />
      </div>
      <div style={{ position: "absolute", top: 800, left: 0, right: 0 }}>
        <Batida linhas={[{ texto: "CHUTE.", em: 2, tamanho: 170, efeito: "slam", corTexto: cor.preto }]} />
      </div>
      {f >= ponte.entra && <div style={{ ...naPosicao(G.chuteRisco), background: cor.vermelho }} />}
      <div style={{ position: "absolute", top: 1010, left: 0, right: 0 }}>
        <Batida linhas={[{ texto: "É CONTA.", em: 30, tamanho: 150, efeito: "slam", degrade: true }]} />
      </div>
      {f < ponte.sai && <div style={{ ...naPosicao(G.contaBarra), background: degrade, scale: `${suave(f, 44, 54)} 1`, transformOrigin: "left center" }} />}
    </AbsoluteFill>
  );
};

const COLUNAS = [250, 540, 830];
const BASE = 1150;

export const Cardapio: React.FC<CenaProps> = ({ n, ponte }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const foco = suave(f, 22, 36);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Topo texto={`${n.cardapio.length} tamanhos. Foco no ${destaca(n.cardapio[n.carroChefe].nome + ".")}`} />
      <Raios tamanho={760} style={{ left: 540 - 380, top: 1010 - 380, opacity: foco }} />
      {n.cardapio.map((c, i) => {
        const chefe = i === n.carroChefe;
        const tam = 190 + i * 50;
        const cx = COLUNAS[i] ?? 540;
        const e = chefe ? 1 : entra(f, fps, 2 + i * 4, 9);
        const saindo = chefe ? 0 : suave(f, ponte.sai - 6, ponte.sai + 2);
        return (
          <div key={c.nome}>
            {!(chefe && f >= ponte.sai) && (
              <div style={{ position: "absolute", left: cx - tam / 2, top: BASE - tam * 1.15, opacity: (chefe ? 1 : 1 - foco * 0.55) * (1 - saindo), scale: chefe ? "1" : estica(f, fps, 2 + i * 4), transformOrigin: "center bottom", translate: `${saindo * (i < n.carroChefe ? -400 : 400)}px 0` }}>
                <CopoAcai tamanho={tam} />
              </div>
            )}
            {chefe ? (
              f >= ponte.entra && (
                <div style={{ ...naPosicao(G.cardapioPilula), background: degrade, display: "flex", alignItems: "center", justifyContent: "center", color: cor.branco, fontSize: 38, fontWeight: 800, opacity: 1 - suave(f, ponte.sai - 6, ponte.sai) }}>{c.nome}</div>
              )
            ) : (
              <div style={{ position: "absolute", left: cx - 90, top: G.cardapioPilula.y, width: 180, height: 66, borderRadius: 33, background: cor.branco, border: `2px solid ${cor.azulBorda}`, display: "flex", alignItems: "center", justifyContent: "center", color: cor.texto, fontSize: 36, fontWeight: 800, opacity: e * (1 - foco * 0.55) * (1 - saindo), scale: `${e}` }}>
                {c.nome}
              </div>
            )}
            {chefe && (
              <div style={{ position: "absolute", left: 540 - 110, top: BASE - tam * 1.15 - 70, width: 220, textAlign: "center", padding: "10px 0", borderRadius: 999, background: cor.preto, color: cor.branco, fontSize: 24, fontWeight: 800, letterSpacing: 1, scale: estica(f, fps, 30), opacity: 1 - suave(f, ponte.sai - 8, ponte.sai - 2) }}>
                MAIS VENDIDO
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
