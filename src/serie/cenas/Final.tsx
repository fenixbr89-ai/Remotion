import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brl, pct } from "../calc";
import { Batida } from "../ui/Batida";
import { Celular, Cursor } from "../ui/Ilustracoes";
import { Logo } from "../ui/Logo";
import { Odometro } from "../ui/Odometro";
import { G, naPosicao } from "../geo";
import { cor, degrade, entra, estica, fontFamily, sombra, suave } from "../tema";
import { marca, type CenaProps } from "./props";
import { Topo } from "./Topo";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** O app em ação: campos se preenchem, cursor clica em Calcular, loading → ✓ → preço. */
export const Produto: React.FC<CenaProps> = ({ n, k, ponte, marcas }) => {
  const c = marca(marcas, "clique", 54);
  const b = marca(marcas, "botao", 100);
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const campos = [
    { r: "Custo do copo", v: brl(k.custoTotal), t: Math.max(2, c - 42) },
    { r: "Taxa do app", v: pct(n.taxa), t: Math.max(8, c - 34) },
    { r: "Lucro desejado", v: pct(n.lucro), t: Math.max(14, c - 26) },
  ];
  const cx = interpolate(f, [c - 18, c - 2], [900, 560], clamp);
  const cy = interpolate(f, [c - 18, c - 2], [1750, 1255], clamp);
  const clique = f >= c && f < c + 6;
  const carregando = f >= c + 4 && f < c + 20;
  const pronto = f >= c + 20;
  const res = entra(f, fps, c + 22, 9);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Topo texto="Eu faço essa conta no *Preço Certo.*" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 440 }}>
        <div>
          <Celular largura={500}>
            <div style={{ height: "100%", padding: "86px 30px 0", background: cor.gelo }}>
              <div style={{ scale: "0.6", transformOrigin: "left center", marginBottom: 6, opacity: f >= ponte.entra ? 1 : 0 }}>
                <Logo />
              </div>
              {campos.map((c) => {
                const letras = Math.max(0, Math.min(c.v.length, Math.floor((f - c.t) / 1)));
                return (
                  <div key={c.r} style={{ marginTop: 12, borderRadius: 20, padding: "14px 20px", background: cor.branco, border: `2px solid ${f >= c.t && letras < c.v.length ? cor.azul : cor.azulBorda}` }}>
                    <div style={{ color: cor.textoSuave, fontSize: 22, fontWeight: 700 }}>{c.r}</div>
                    <div style={{ color: cor.preto, fontSize: 34, fontWeight: 800, height: 42 }}>{c.v.slice(0, letras)}</div>
                  </div>
                );
              })}
              <div style={{ marginTop: 20, height: 84, borderRadius: 999, background: pronto ? cor.verde : degrade, display: "flex", alignItems: "center", justifyContent: "center", color: cor.branco, fontSize: 32, fontWeight: 800, scale: `${clique ? 0.94 : 1}` }}>
                {carregando ? (
                  <div style={{ width: 44, height: 44, borderRadius: 22, border: "6px solid rgba(255,255,255,0.35)", borderTopColor: cor.branco, rotate: `${(f - c - 4) * 30}deg` }} />
                ) : pronto ? (
                  <svg width={46} height={46} viewBox="0 0 24 24" fill="none" stroke={cor.branco} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" style={{ scale: `${entra(f, fps, c + 20, 7)}` }}>
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  "Calcular preço"
                )}
              </div>
              <div style={{ marginTop: 20, borderRadius: 26, padding: "18px 22px", background: cor.branco, boxShadow: sombra, opacity: res, scale: `${interpolate(res, [0, 1], [0.6, 1])}` }}>
                <div style={{ color: cor.textoSuave, fontSize: 22, fontWeight: 800, letterSpacing: 3 }}>VENDER A</div>
                <Odometro valor={k.preco * suave(f, c + 22, c + 46)} final={k.preco} tamanho={72} cor={cor.preto} />
              </div>
            </div>
          </Celular>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: cx, top: cy, opacity: suave(f, c - 22, c - 16) * (1 - suave(f, c + 26, c + 32)), scale: `${clique ? 0.85 : 1}` }}>
        <Cursor tamanho={80} />
      </div>
      {f < ponte.sai && (
        <div style={{ ...naPosicao(G.produtoBotao), display: "flex", alignItems: "center", justifyContent: "center", background: degrade, color: cor.branco, fontSize: 46, fontWeight: 800, boxShadow: "0 20px 50px rgba(29,78,216,0.4)", scale: estica(f, fps, b) }}>
          Teste grátis
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1580, textAlign: "center", color: cor.azulProfundo, fontSize: 34, fontWeight: 700, opacity: entra(f, fps, b + 8) * (1 - suave(f, ponte.sai - 6, ponte.sai)) }}>siteprecocerto.vercel.app</div>
    </AbsoluteFill>
  );
};

const POS = [
  { left: 60, top: 1000 },
  { right: 60, top: 1110 },
  { left: 90, top: 1250 },
  { right: 80, top: 1370 },
];

export const Comenta: React.FC<CenaProps> = ({ n, ponte }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chips = [...n.proximos, "Outro?"].slice(0, 4);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      {f >= ponte.entra && <div style={{ ...naPosicao(G.comentaFaixa), background: cor.azulFundo }} />}
      <div style={{ position: "absolute", left: 0, right: 0, top: 420 }}>
        <Batida
          gap={8}
          linhas={[
            { texto: "COMENTE", em: 0, tamanho: 200, efeito: "slam", degrade: true },
            { texto: "qual o *próximo negócio*", em: 12, tamanho: 64 },
            { texto: "que você quer ver aqui.", em: 22, tamanho: 64 },
          ]}
        />
      </div>
      {chips.map((p, i) => {
        const t = 40 + i * 8;
        const e = entra(f, fps, t, 9);
        const letras = Math.max(0, Math.min(p.length, f - t - 2));
        return (
          <div key={p} style={{ position: "absolute", ...POS[i], scale: estica(f, fps, t), opacity: Math.min(1, e * 2), display: "flex", alignItems: "center", gap: 14, padding: "16px 26px 16px 16px", borderRadius: 999, background: cor.branco, border: `2px solid ${cor.azulBorda}`, boxShadow: sombra }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: i % 2 ? cor.azulCeu : degrade }} />
            <span style={{ color: cor.preto, fontSize: 40, fontWeight: 800 }}>{p.slice(0, letras)}</span>
            <svg width={30} height={30} viewBox="0 0 24 24" fill={cor.vermelho} style={{ scale: `${entra(f, fps, t + 14, 7)}`, visibility: i === 0 && f >= ponte.sai ? "hidden" : "visible" }}>
              <path d="M12 21s-7.5-4.6-10-9.3C.4 8.5 2.3 4.5 6 4.5c2.2 0 3.6 1.3 6 3.6 2.4-2.3 3.8-3.6 6-3.6 3.7 0 5.6 4 4 7.2C19.5 16.4 12 21 12 21z" />
            </svg>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};


export const Outro: React.FC<CenaProps> = ({ marcas, ponte }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = entra(f, fps, 0, 12);
  const c1 = marca(marcas, "curtir", 35);
  const c2 = marca(marcas, "seguir", 59);
  const ida1 = suave(f, c1 - 13, c1 - 1);
  const ida2 = suave(f, c2 - 13, c2 - 1);
  const coracao = G.outroCoracao;
  const seguirX = coracao.x + coracao.w + 26;
  const cx = interpolate(ida1, [0, 1], [900, coracao.x + coracao.w / 2]) + ida2 * (seguirX + 150 - (coracao.x + coracao.w / 2));
  const cy = interpolate(ida1, [0, 1], [1600, coracao.y + coracao.h / 2]);
  const clique1 = f >= c1 && f < c1 + 6;
  const clique2 = f >= c2 && f < c2 + 6;
  const curtiu = f >= c1 + 3;
  const seguiu = f >= c2 + 3;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div style={{ position: "absolute", top: 700, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: logo, scale: `${0.8 + logo * 0.2}` }}>
        <div style={{ scale: "1.5" }}>
          <Logo />
        </div>
      </div>
      <div style={{ position: "absolute", top: 900, left: 100, right: 100 }}>
        <Batida linhas={[{ texto: "Aproveita pra *curtir* e *seguir*", em: 4, tamanho: 62 }]} />
      </div>
      {f >= ponte.entra && (
        <div style={{ ...naPosicao(coracao), background: curtiu ? cor.vermelhoFundo : cor.azulFundo, display: "flex", alignItems: "center", justifyContent: "center", scale: `${clique1 ? 0.9 : 1}` }}>
          <svg width={56} height={56} viewBox="0 0 24 24" fill={curtiu ? cor.vermelho : "none"} stroke={curtiu ? cor.vermelho : cor.azul} strokeWidth={2.4}>
            <path d="M12 21s-7.5-4.6-10-9.3C.4 8.5 2.3 4.5 6 4.5c2.2 0 3.6 1.3 6 3.6 2.4-2.3 3.8-3.6 6-3.6 3.7 0 5.6 4 4 7.2C19.5 16.4 12 21 12 21z" />
          </svg>
        </div>
      )}
      <div style={{ position: "absolute", left: seguirX, top: coracao.y, height: coracao.h, width: 320, borderRadius: 999, boxSizing: "border-box", background: seguiu ? cor.preto : degrade, color: cor.branco, fontSize: 44, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, scale: clique2 ? "0.92" : estica(f, fps, 8) }}>
        {seguiu ? "Seguindo" : "+ Seguir"}
        {seguiu && (
          <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={cor.branco} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </div>
      <div style={{ position: "absolute", left: cx, top: cy, opacity: suave(f, c1 - 16, c1 - 10), scale: `${clique1 || clique2 ? 0.85 : 1}` }}>
        <Cursor tamanho={80} />
      </div>
    </AbsoluteFill>
  );
};
