import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brl, pct } from "../calc";
import { Batida } from "../ui/Batida";
import { Celular, Cursor } from "../ui/Ilustracoes";
import { Logo } from "../ui/Logo";
import { Odometro } from "../ui/Odometro";
import { cor, degrade, entra, flutua, fontFamily, sombra, suave } from "../tema";
import type { CenaProps } from "./props";
import { Topo } from "./Topo";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** O app em ação: campos se preenchem, cursor clica em Calcular, loading → ✓ → preço. */
export const Produto: React.FC<CenaProps> = ({ n, k }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cel = entra(f, fps, 0, 11);
  const campos = [
    { r: "Custo do copo", v: brl(k.custoTotal), t: 12 },
    { r: "Taxa do app", v: pct(n.taxa), t: 20 },
    { r: "Lucro desejado", v: pct(n.lucro), t: 28 },
  ];
  const cx = interpolate(f, [36, 52], [900, 560], clamp);
  const cy = interpolate(f, [36, 52], [1750, 1255], clamp);
  const clique = f >= 54 && f < 60;
  const carregando = f >= 58 && f < 74;
  const pronto = f >= 74;
  const res = entra(f, fps, 76, 9);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Topo texto="Eu faço essa conta no *Preço Certo.*" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 440 }}>
        <div style={{ scale: `${0.8 + cel * 0.2}`, opacity: cel, translate: `0 ${(1 - cel) * 220}px` }}>
          <Celular largura={500}>
            <div style={{ height: "100%", padding: "86px 30px 0", background: cor.gelo }}>
              <div style={{ scale: "0.6", transformOrigin: "left center", marginBottom: 6 }}>
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
                  <div style={{ width: 44, height: 44, borderRadius: 22, border: "6px solid rgba(255,255,255,0.35)", borderTopColor: cor.branco, rotate: `${(f - 58) * 30}deg` }} />
                ) : pronto ? (
                  <svg width={46} height={46} viewBox="0 0 24 24" fill="none" stroke={cor.branco} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" style={{ scale: `${entra(f, fps, 74, 7)}` }}>
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  "Calcular preço"
                )}
              </div>
              <div style={{ marginTop: 20, borderRadius: 26, padding: "18px 22px", background: cor.branco, boxShadow: sombra, opacity: res, scale: `${interpolate(res, [0, 1], [0.6, 1])}` }}>
                <div style={{ color: cor.textoSuave, fontSize: 22, fontWeight: 800, letterSpacing: 3 }}>VENDER A</div>
                <Odometro valor={k.preco * suave(f, 76, 100)} final={k.preco} tamanho={72} cor={cor.preto} />
              </div>
            </div>
          </Celular>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: cx, top: cy, opacity: suave(f, 32, 38) * (1 - suave(f, 80, 86)), scale: `${clique ? 0.85 : 1}` }}>
        <Cursor tamanho={80} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1460, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ padding: "24px 70px", borderRadius: 999, background: degrade, color: cor.branco, fontSize: 46, fontWeight: 800, boxShadow: "0 20px 50px rgba(29,78,216,0.4)", scale: `${entra(f, fps, 100, 9) * (f > 110 ? 1 + Math.sin((f - 110) / 5) * 0.03 : 1)}` }}>
          Teste grátis
        </div>
        <div style={{ color: cor.azulProfundo, fontSize: 34, fontWeight: 700, opacity: entra(f, fps, 108) }}>siteprecocerto.vercel.app</div>
      </div>
    </AbsoluteFill>
  );
};

const POS = [
  { left: 60, top: 1000 },
  { right: 60, top: 1110 },
  { left: 90, top: 1250 },
  { right: 80, top: 1370 },
];

export const Comenta: React.FC<CenaProps> = ({ n }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chips = [...n.proximos, "Outro?"].slice(0, 4);
  return (
    <AbsoluteFill style={{ fontFamily }}>
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
          <div key={p} style={{ position: "absolute", ...POS[i], scale: `${e}`, opacity: Math.min(1, e * 2), translate: `0 ${flutua(f, i * 1.3, 10)}px`, display: "flex", alignItems: "center", gap: 14, padding: "16px 26px 16px 16px", borderRadius: 999, background: cor.branco, border: `2px solid ${cor.azulBorda}`, boxShadow: sombra }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: i % 2 ? cor.azulCeu : degrade }} />
            <span style={{ color: cor.preto, fontSize: 40, fontWeight: 800 }}>{p.slice(0, letras)}</span>
            <svg width={30} height={30} viewBox="0 0 24 24" fill={cor.vermelho} style={{ scale: `${entra(f, fps, t + 14, 7)}` }}>
              <path d="M12 21s-7.5-4.6-10-9.3C.4 8.5 2.3 4.5 6 4.5c2.2 0 3.6 1.3 6 3.6 2.4-2.3 3.8-3.6 6-3.6 3.7 0 5.6 4 4 7.2C19.5 16.4 12 21 12 21z" />
            </svg>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const MOEDAS = [
  { x: 110, y: 330, s: 70 },
  { x: 900, y: 420, s: 56 },
  { x: 160, y: 1420, s: 60 },
  { x: 880, y: 1500, s: 74 },
  { x: 520, y: 1700, s: 44 },
];

export const Outro: React.FC<CenaProps> = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = entra(f, fps, 0, 10);
  const ida1 = suave(f, 22, 34);
  const ida2 = suave(f, 46, 58);
  const cx = interpolate(ida1, [0, 1], [900, 380]) + ida2 * 270;
  const cy = interpolate(ida1, [0, 1], [1600, 1180]);
  const clique1 = f >= 35 && f < 41;
  const clique2 = f >= 59 && f < 65;
  const curtiu = f >= 38;
  const seguiu = f >= 62;
  return (
    <AbsoluteFill style={{ fontFamily, background: degrade }}>
      {MOEDAS.map((m, i) => (
        <div key={i} style={{ position: "absolute", left: m.x, top: m.y, width: m.s, height: m.s, borderRadius: m.s / 2, background: "rgba(255,255,255,0.9)", color: cor.azul, fontSize: m.s * 0.34, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", translate: `0 ${flutua(f, i, 16)}px`, scale: `${entra(f, fps, 2 + i * 2, 10)}` }}>
          R$
        </div>
      ))}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ scale: `${interpolate(logo, [0, 1], [0.5, 1.5])}`, opacity: logo }}>
          <Logo claro />
        </div>
        <Batida linhas={[{ texto: "Aproveita pra curtir e seguir", em: 6, tamanho: 62, corTexto: cor.branco }]} style={{ marginTop: 90, width: 820 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 70, scale: `${entra(f, fps, 14, 10)}` }}>
          <div style={{ width: 110, height: 110, borderRadius: 55, background: curtiu ? cor.branco : "transparent", border: `5px solid ${cor.branco}`, display: "flex", alignItems: "center", justifyContent: "center", scale: `${clique1 ? 0.88 : curtiu ? 1 + Math.max(0, 1 - (f - 38) / 8) * 0.18 : 1}` }}>
            <svg width={56} height={56} viewBox="0 0 24 24" fill={curtiu ? cor.vermelho : "none"} stroke={curtiu ? cor.vermelho : cor.branco} strokeWidth={2.4}>
              <path d="M12 21s-7.5-4.6-10-9.3C.4 8.5 2.3 4.5 6 4.5c2.2 0 3.6 1.3 6 3.6 2.4-2.3 3.8-3.6 6-3.6 3.7 0 5.6 4 4 7.2C19.5 16.4 12 21 12 21z" />
            </svg>
          </div>
          <div style={{ padding: "30px 54px", borderRadius: 999, background: seguiu ? cor.preto : cor.branco, color: seguiu ? cor.branco : cor.azulProfundo, fontSize: 44, fontWeight: 800, scale: `${clique2 ? 0.9 : 1}`, display: "flex", alignItems: "center", gap: 14 }}>
            {seguiu ? "Seguindo" : "+ Seguir"}
            {seguiu && (
              <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={cor.branco} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: cx, top: cy, opacity: suave(f, 18, 24), scale: `${clique1 || clique2 ? 0.85 : 1}` }}>
        <Cursor tamanho={80} />
      </div>
    </AbsoluteFill>
  );
};
