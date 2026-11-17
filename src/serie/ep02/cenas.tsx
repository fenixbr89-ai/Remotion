import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brl } from "../calc";
import { naPosicao } from "../geo";
import { Batida } from "../ui/Batida";
import { Cinetico } from "../ui/Cinetico";
import { Icone, IconeChip, type NomeIcone } from "../ui/Icones";
import { Celular, Cursor } from "../ui/Ilustracoes";
import { IconeEtiqueta } from "../ui/Logo";
import { Odometro } from "../ui/Odometro";
import { cor, degrade, entra, estica, fontFamily, sombra, suave, textoDegrade } from "../tema";
import { G2 } from "./geo";
import { Marmita } from "./Marmita";
import { MARMITARIA, type contaMarmita } from "./numeros";

export type Cena02Props = { k: ReturnType<typeof contaMarmita>; dur: number; ponte: { entra: number; sai: number } };

const SOMBRA_CARD = "0 30px 80px rgba(11,31,77,.12)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Legenda de 2 linhas no topo: linha 1 pequena e cinza, linha 2 grande com destaque. */
const Legenda: React.FC<{ l1: string; l2: string; em?: number; tom?: "azul" | "vermelho" }> = ({ l1, l2, em = 2, tom }) => (
  <div style={{ position: "absolute", top: 230, left: 100, right: 100, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
    <Cinetico texto={l1} inicio={em} intervalo={3} tamanho={46} peso={600} corTexto={cor.textoSuave} alinhar="center" />
    <Cinetico texto={l2} inicio={em + l1.split(" ").length * 3 + 2} intervalo={3} tamanho={88} alinhar="center" tom={tom} />
  </div>
);

/** "Soco" de escala quando um número importante assenta. */
const soco = (f: number, t: number) => 1 + Math.sin(Math.min(1, Math.max(0, (f - t) / 10)) * Math.PI) * 0.06;

/* ------------------------------------------------------------------ 1. Gancho */
const BADGES: { icone?: NomeIcone; texto?: string; x: number; y: number }[] = [
  { icone: "talheres", x: 70, y: 640 },
  { icone: "chama", x: 70, y: 860 },
  { icone: "folha", x: 70, y: 1080 },
  { icone: "chapeu", x: 880, y: 640 },
  { icone: "dinheiro", x: 880, y: 860 },
  { icone: "etiqueta", x: 880, y: 1080 },
  { icone: "sacola", x: 300, y: 1330 },
  { icone: "moto", x: 480, y: 1330 },
  { texto: "R$", x: 660, y: 1330 },
];

export const Gancho: React.FC<Cena02Props> = ({ ponte }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tampa = suave(f, 26, 44);
  const comida: [number, number, number] = [0, 1, 2].map((i) => {
    const e = entra(f, fps, 40 + i * 6, 9);
    return Math.max(0, e);
  }) as [number, number, number];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Legenda l1="E se eu abrisse uma" l2="*marmitaria?*" />
      {f < ponte.sai && (
        <div style={{ ...naPosicao(G2.marmita), scale: estica(f, fps, 2), transformOrigin: "center bottom" }}>
          <Marmita largura={G2.marmita.w} tampa={tampa} comida={comida} vapor={suave(f, 64, 130)} />
        </div>
      )}
      {BADGES.map((b, i) => {
        const t = 14 + i * 4;
        return (
          <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: 130, height: 130, borderRadius: 38, background: cor.branco, boxShadow: SOMBRA_CARD, display: "flex", alignItems: "center", justifyContent: "center", scale: estica(f, fps, t), opacity: Math.min(1, entra(f, fps, t, 12) * 2) }}>
            {b.icone ? <Icone nome={b.icone} tamanho={84} /> : <span style={{ ...textoDegrade, fontSize: 52, fontWeight: 800 }}>{b.texto}</span>}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 2. Custo */
export const Custo: React.FC<Cena02Props> = ({ k, ponte }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const linha0 = 20;
  const passo = 22;
  const tTotal = 195; // ~11 s
  const soma = MARMITARIA.itens.reduce((s, it, i) => s + it.custo * suave(f, linha0 + i * passo + 6, linha0 + i * passo + 16), 0);
  const card = G2.custoCard;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Legenda l1="Quanto custa produzir" l2="cada *uma?*" />
      <div style={{ ...naPosicao(card), background: cor.branco, boxShadow: SOMBRA_CARD, scale: `${soco(f, tTotal)}` }}>
        <div style={{ position: "absolute", left: 160, right: 40, top: 40, height: 50, display: "flex", alignItems: "center", color: cor.texto, fontSize: 32, fontWeight: 800, letterSpacing: 2 }}>CUSTO DA MARMITA</div>
        {MARMITARIA.itens.map((it, i) => {
          const t = linha0 + i * passo;
          const e = entra(f, fps, t, 13);
          const check = entra(f, fps, t + 6, 8);
          return (
            <div key={it.nome} style={{ position: "absolute", left: 40, right: 40, top: 130 + i * 100, height: 84, display: "flex", alignItems: "center", gap: 20, opacity: f >= t ? Math.min(1, e * 2) : 0, translate: `0 ${(1 - e) * 30}px`, filter: `blur(${Math.max(0, 1 - e) * 8}px)` }}>
              <div style={{ width: 50, height: 50, borderRadius: 25, background: degrade, display: "flex", alignItems: "center", justifyContent: "center", scale: `${check}` }}>
                <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={cor.branco} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <IconeChip nome={it.icone} tamanho={72} />
              <span style={{ flex: 1, color: cor.texto, fontSize: 40, fontWeight: 700 }}>{it.nome}</span>
              <span style={{ color: cor.preto, fontSize: 42, fontWeight: 800 }}>{brl(it.custo)}</span>
            </div>
          );
        })}
      </div>
      {f >= ponte.entra && (
        <div style={naPosicao(G2.custoMini)}>
          <Marmita largura={G2.custoMini.w} />
        </div>
      )}
      {f < ponte.sai && (
        <div style={{ ...naPosicao(G2.custoTotal), background: degrade, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", scale: estica(f, fps, 150) }}>
          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 30, fontWeight: 700, lineHeight: 1 }}>Custo total</span>
          <Odometro valor={f >= tTotal ? k.custo : soma} final={k.custo} tamanho={80} cor={cor.branco} />
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 3. Erro */
export const Erro: React.FC<Cena02Props> = ({ k, ponte }) => {
  const f = useCurrentFrame();
  const tRisco = 48; // ~15,6 s
  const tPois = 78; // ~16,6 s
  const cinza = suave(f, tRisco + 4, tRisco + 12);
  const risco = G2.erroRisco;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Legenda l1="Muita gente cobra isso" l2="e nem *sabe.*" em={4} />
      {f >= ponte.entra && (
        <div style={{ ...naPosicao(G2.erroCusto), background: degrade, display: "flex", alignItems: "center", justifyContent: "center", color: cor.branco, fontSize: 38, fontWeight: 800 }}>
          Custo: {brl(k.custo)}
        </div>
      )}
      <div style={{ position: "absolute", top: 740, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Batida linhas={[{ texto: `R$ ${MARMITARIA.precoErrado}`, em: 6, tamanho: 300, efeito: "slam", corTexto: cinza > 0.5 ? "#C3CAD6" : cor.preto }]} />
      </div>
      {f >= tRisco && f < ponte.sai && <div style={{ ...naPosicao(risco), background: degrade, scale: `${suave(f, tRisco, tRisco + 8)} 1`, transformOrigin: "left center" }} />}
      <div style={{ position: "absolute", top: 1170, left: 0, right: 0 }}>
        <Batida linhas={[{ texto: "Pois é.", em: tPois, tamanho: 130, efeito: "slam", degrade: true }]} />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 4. Preço (chat) */
const MSG = "Custo R$ 10, quero 25% de lucro";

export const Preco: React.FC<Cena02Props> = ({ k, ponte }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = 27; // 20,9 s
  const t1 = 78; // 22,6 s
  const tClique = 93; // ~23,1 s
  const letras = Math.max(0, Math.min(MSG.length, Math.floor(((f - t0) / (t1 - t0)) * MSG.length)));
  const enviado = f >= tClique + 3;
  const tResp = 138;
  const cel = G2.celular;
  // cursor: entra pela direita, vai até o botão de enviar, clica
  const env = G2.chatEnviar;
  const cx = interpolate(f, [tClique - 16, tClique - 2], [980, env.x + env.w / 2], clamp);
  const cy = interpolate(f, [tClique - 16, tClique - 2], [1760, env.y + env.h / 2], clamp);
  const clique = f >= tClique && f < tClique + 6;
  const onda = suave(f, tClique, tClique + 16);
  const bolha = (top: number, lado: "dir" | "esq", t: number, children: React.ReactNode, azul = false) => {
    const e = entra(f, fps, t, 12);
    return f >= t ? (
      <div style={{ position: "absolute", top, [lado === "dir" ? "right" : "left"]: 28, maxWidth: 400, padding: "18px 24px", borderRadius: 28, background: azul ? degrade : cor.gelo, color: azul ? cor.branco : cor.texto, fontSize: 28, fontWeight: 700, opacity: Math.min(1, e * 2), translate: `0 ${(1 - e) * 30}px`, filter: `blur(${Math.max(0, 1 - e) * 8}px)` }}>
        {children}
      </div>
    ) : null;
  };
  const pontos = [0, 1, 2].map((i) => (Math.floor((f - 100) / 6) % 3 === i ? 1 : 0.3));
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Legenda l1="O sistema calcula" l2="o preço *certo.*" />
      <div style={{ position: "absolute", left: cel.x, top: cel.y }}>
        <Celular largura={cel.w}>
          {/* cabeçalho do chat */}
          <div style={{ position: "absolute", top: 70, left: 0, right: 0, height: 96, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, borderBottom: `2px solid ${cor.gelo}` }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: degrade, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconeEtiqueta tamanho={30} />
            </div>
            <span style={{ color: cor.texto, fontSize: 32, fontWeight: 800 }}>Preço Certo</span>
          </div>
          {bolha(200, "esq", 4, "Me passa o custo e o lucro que você quer.")}
          {enviado && bolha(330, "dir", tClique + 3, MSG, true)}
          {f >= 100 && f < tResp && (
            <div style={{ position: "absolute", top: 440, left: 28, display: "flex", alignItems: "center", gap: 10, color: cor.textoSuave, fontSize: 26, fontWeight: 700 }}>
              Calculando
              {pontos.map((o, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: cor.azul, opacity: o }} />
              ))}
            </div>
          )}
          {f >= tResp && (
            <div style={{ position: "absolute", top: 440, left: 28, right: 28, borderRadius: 28, padding: 24, background: cor.gelo, opacity: Math.min(1, entra(f, fps, tResp, 12) * 2) }}>
              <div style={{ color: cor.texto, fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 14 }}>Preço certo da marmita:</div>
              {[
                { r: "Balcão", v: k.precoBalcao, t: tResp + 4, icone: "talheres" as NomeIcone },
                { r: "iFood", v: k.precoIfood, t: tResp + 14, icone: "moto" as NomeIcone },
              ].map((l, i) => (
                <div key={l.r} style={{ height: 96, borderRadius: 26, background: cor.branco, marginTop: i ? 14 : 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, scale: estica(f, fps, l.t), visibility: l.r === "iFood" && f >= ponte.sai ? "hidden" : "visible" }}>
                  <Icone nome={l.icone} tamanho={52} />
                  <span style={{ color: cor.texto, fontSize: 30, fontWeight: 700, marginRight: 10 }}>{l.r}</span>
                  <Odometro valor={l.v * suave(f, l.t, l.t + 22)} final={l.v} tamanho={44} cor={cor.preto} />
                </div>
              ))}
            </div>
          )}
          {/* campo de digitação + enviar */}
          <div style={{ position: "absolute", left: G2.chatEntrada.x - cel.x - 14, top: G2.chatEntrada.y - cel.y - 14, width: G2.chatEntrada.w, height: G2.chatEntrada.h, borderRadius: 44, background: cor.gelo, border: `2px solid ${f >= t0 && !enviado ? cor.azul : cor.azulBorda}`, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 24px", color: cor.texto, fontSize: 24, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", visibility: f >= ponte.entra ? "visible" : "hidden" }}>
            {enviado ? <span style={{ color: cor.textoSuave }}>Mensagem</span> : MSG.slice(0, letras)}
            {!enviado && f >= t0 && Math.floor(f / 8) % 2 === 0 && <span style={{ color: cor.azul }}>|</span>}
          </div>
          <div style={{ position: "absolute", left: env.x - cel.x - 14, top: env.y - cel.y - 14, width: env.w, height: env.h, borderRadius: 44, background: degrade, display: "flex", alignItems: "center", justifyContent: "center", scale: `${clique ? 0.88 : 1}` }}>
            <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={cor.branco} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
            </svg>
          </div>
        </Celular>
      </div>
      {f >= tClique && onda < 1 && (
        <div style={{ position: "absolute", left: env.x + env.w / 2 - 70, top: env.y + env.h / 2 - 70, width: 140, height: 140, borderRadius: 70, border: `6px solid ${cor.azul}`, scale: `${0.4 + onda}`, opacity: 1 - onda }} />
      )}
      {f >= tClique - 18 && f < tClique + 30 && (
        <div style={{ position: "absolute", left: cx, top: cy, scale: `${clique ? 0.85 : 1}`, opacity: 1 - suave(f, tClique + 20, tClique + 30) }}>
          <Cursor tamanho={80} />
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 5. Sobra */
export const Sobra: React.FC<Cena02Props> = ({ k, ponte }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tProg = 62;
  const tSobra = 112;
  const prog = suave(f, tProg, tSobra - 4);
  const card = G2.sobraCard;
  const linhas = [
    { r: "Vendeu no app", v: k.precoIfood, sinal: "", t: 0, c: cor.preto },
    { r: "Custo do produto", v: k.custo, sinal: "− ", t: 22, c: cor.vermelho },
    { r: `Taxa da plataforma (${Math.round(MARMITARIA.taxaIfood * 100)}%)`, v: k.taxaValor, sinal: "− ", t: 40, c: cor.vermelho },
  ];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Legenda l1="Quanto sobra" l2="de cada *venda.*" />
      <div style={{ ...naPosicao(card), background: cor.branco, boxShadow: SOMBRA_CARD }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 36, height: 50, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, color: cor.texto, fontSize: 32, fontWeight: 800, letterSpacing: 2 }}>
          <Icone nome="moto" tamanho={46} />
          CADA MARMITA NO IFOOD
        </div>
      </div>
      {linhas.map((l, i) => {
        const e = entra(f, fps, l.t, 13);
        const vis = i === 0 ? f >= ponte.entra : f >= l.t;
        return (
          <div key={l.r} style={{ ...naPosicao({ ...G2.sobraVendeu, y: G2.sobraVendeu.y + i * 112 }), background: cor.gelo, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", boxSizing: "border-box", opacity: vis ? (i === 0 ? 1 : Math.min(1, e * 2)) : 0, translate: i === 0 ? undefined : `0 ${(1 - e) * 30}px` }}>
            <span style={{ color: cor.texto, fontSize: 34, fontWeight: 700 }}>{l.r}</span>
            <span style={{ color: l.c, fontSize: 38, fontWeight: 800 }}>
              {l.sinal}
              {brl(l.v)}
            </span>
          </div>
        );
      })}
      {/* barra de progresso */}
      <div style={{ position: "absolute", left: 160, width: 760, top: 1000, opacity: f >= tProg - 4 ? 1 : 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: cor.textoSuave, fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
          <span>{prog >= 1 ? "Calculado" : "Calculando"}</span>
          <span style={{ color: cor.texto }}>{Math.round(prog * 100)}%</span>
        </div>
        <div style={{ height: 22, borderRadius: 11, background: cor.azulFundo, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${prog * 100}%`, background: degrade, borderRadius: 11 }} />
        </div>
      </div>
      {f < ponte.sai && (
        <div style={{ ...naPosicao(G2.sobraSobrou), background: cor.verdeFundo, border: `3px solid ${cor.verde}66`, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: f >= tSobra ? 1 : 0, scale: f >= tSobra ? `${interpolate(entra(f, fps, tSobra, 9), [0, 1], [1.4, 1]) * soco(f, tSobra + 28)}` : "1" }}>
          <span style={{ color: cor.texto, fontSize: 34, fontWeight: 700, lineHeight: 1 }}>Sobrou</span>
          <Odometro valor={k.sobra * suave(f, tSobra, tSobra + 28)} final={k.sobra} tamanho={100} cor={cor.verde} />
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 6. CTA */
export const Cta: React.FC<Cena02Props> = ({ ponte }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tClique = 62;
  const b = G2.ctaBotao;
  const cx = interpolate(f, [tClique - 18, tClique - 2], [900, b.x + b.w / 2], clamp);
  const cy = interpolate(f, [tClique - 18, tClique - 2], [1700, b.y + b.h / 2], clamp);
  const clique = f >= tClique && f < tClique + 6;
  const seguiu = f >= tClique + 3;
  const logo = G2.ctaLogo;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Legenda l1="Segue pra ver" l2="o *EP. 03.*" />
      {f >= ponte.entra && (
        <div style={{ ...naPosicao(logo), background: cor.branco, border: `10px solid ${cor.azulCeu}`, boxSizing: "border-box", boxShadow: SOMBRA_CARD, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 150, height: 150, borderRadius: 44, background: degrade, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconeEtiqueta tamanho={92} />
          </div>
        </div>
      )}
      <div style={{ position: "absolute", top: 880, left: 0, right: 0 }}>
        <Batida linhas={[{ texto: "Preço Certo", em: 10, tamanho: 72 }]} />
      </div>
      <div style={{ position: "absolute", top: 980, left: 0, right: 0 }}>
        <Batida linhas={[{ texto: "@precocerto.site", em: 18, tamanho: 44, peso: 600, corTexto: cor.textoSuave }]} />
      </div>
      <div style={{ ...naPosicao(b), boxSizing: "border-box", background: seguiu ? cor.preto : degrade, color: cor.branco, fontSize: 48, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, scale: clique ? "0.92" : estica(f, fps, 26), boxShadow: sombra }}>
        {seguiu ? "Seguindo" : "Seguir"}
        {seguiu && (
          <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={cor.branco} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" style={{ scale: `${entra(f, fps, tClique + 3, 8)}` }}>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </div>
      {f >= tClique - 20 && (
        <div style={{ position: "absolute", left: cx, top: cy, scale: `${clique ? 0.85 : 1}`, opacity: suave(f, tClique - 20, tClique - 14) }}>
          <Cursor tamanho={80} />
        </div>
      )}
    </AbsoluteFill>
  );
};
