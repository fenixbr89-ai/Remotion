import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, staticFile } from "remotion";

/** Rascunho: 3 opções de estilo para a abertura do EP. 02 (só para escolher; não entra no vídeo). */
loadFont({ family: "Anton", url: staticFile("fonts/anton-latin-400-normal.woff2"), weight: "400" });
for (const w of ["500", "700", "800", "900"]) loadFont({ family: "Inter", url: staticFile(`fonts/inter-latin-${w}-normal.woff2`), weight: w });
for (const w of ["600", "700"]) loadFont({ family: "Lora", url: staticFile(`fonts/lora-latin-${w}-italic.woff2`), weight: w, style: "italic" });

const NAVY = "#0B1F4D";
const GRAD = "linear-gradient(90deg, #1D4ED8 0%, #38BDF8 100%)";
const grad: React.CSSProperties = { backgroundImage: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", padding: "0.1em 0.04em 0.2em", margin: "-0.1em -0.04em -0.2em" };
const VERMELHO = "#E5383B";
const VERDE = "#16A34A";

/** A — Impacto: condensada gigante, poucas palavras. */
export const EstiloA: React.FC = () => (
  <AbsoluteFill style={{ background: "#FFFFFF", fontFamily: "Anton", color: NAVY, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
    <div style={{ fontSize: 110, lineHeight: 1, letterSpacing: 1 }}>MARMITA A</div>
    <div style={{ fontSize: 440, lineHeight: 1, ...grad }}>R$13</div>
    <div style={{ fontSize: 110, lineHeight: 1 }}>NO IFOOD?</div>
    <div style={{ marginTop: 70, padding: "22px 46px", borderRadius: 20, background: VERMELHO, color: "#fff", fontSize: 76, lineHeight: 1 }}>VOCÊ PAGA PRA TRABALHAR</div>
  </AbsoluteFill>
);

/** B — Premium: Inter + Lora itálica no destaque, card de app limpo. */
export const EstiloB: React.FC = () => (
  <AbsoluteFill style={{ background: "#FFFFFF", fontFamily: "Inter", color: NAVY, alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontSize: 48, fontWeight: 500, color: "#8A94A6" }}>Marmita a R$ 13 no iFood</div>
    <div style={{ fontSize: 104, fontWeight: 800, letterSpacing: -3, lineHeight: 1.1, textAlign: "center" }}>
      dá <span style={{ fontFamily: "Lora", fontStyle: "italic", fontWeight: 700, ...grad }}>lucro?</span>
    </div>
    <div style={{ marginTop: 110, width: 780, borderRadius: 44, background: "#fff", boxShadow: "0 30px 80px rgba(11,31,77,.12)", padding: "44px 48px", boxSizing: "border-box" }}>
      {[
        ["Vendeu no app", "R$ 13,00", NAVY],
        ["Custo da marmita", "− R$ 10,00", VERMELHO],
        ["Taxa do iFood (25%)", "− R$ 3,25", VERMELHO],
      ].map(([r, v, c]) => (
        <div key={r} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 92, borderBottom: "2px solid #EEF3FC", fontSize: 38 }}>
          <span style={{ fontWeight: 500 }}>{r}</span>
          <span style={{ fontWeight: 800, color: c }}>{v}</span>
        </div>
      ))}
      <div style={{ marginTop: 34, borderRadius: 30, background: "#FDECEC", height: 170, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 34, fontWeight: 700 }}>Sobra</span>
        <span style={{ fontSize: 96, fontWeight: 900, color: VERMELHO, letterSpacing: -3, lineHeight: 1.05 }}>− R$ 0,25</span>
      </div>
    </div>
  </AbsoluteFill>
);

/** C — Comparação: R$ 13 x R$ 20 lado a lado. */
export const EstiloC: React.FC = () => {
  const coluna = (titulo: string, preco: string, sobra: string, c: string, fundo: string) => (
    <div style={{ width: 400, borderRadius: 44, background: fundo, padding: "50px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span style={{ fontSize: 36, fontWeight: 700, color: "#8A94A6" }}>{titulo}</span>
      <span style={{ fontSize: 150, fontWeight: 900, letterSpacing: -6, lineHeight: 1.1, color: NAVY }}>{preco}</span>
      <span style={{ marginTop: 20, fontSize: 32, fontWeight: 700, color: NAVY }}>sobra</span>
      <span style={{ fontSize: 76, fontWeight: 900, color: c, letterSpacing: -2 }}>{sobra}</span>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", fontFamily: "Inter", color: NAVY, alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 92, fontWeight: 900, letterSpacing: -3, textAlign: "center", lineHeight: 1.05 }}>
        Mesma marmita.
        <br />
        <span style={grad}>Lucro diferente.</span>
      </div>
      <div style={{ marginTop: 110, display: "flex", gap: 40 }}>
        {coluna("Você cobra", "R$13", "−R$ 0,25", VERMELHO, "#FDECEC")}
        {coluna("Preço certo", "R$20", "R$ 5,00", VERDE, "#E8F7EE")}
      </div>
      <div style={{ marginTop: 70, fontSize: 40, fontWeight: 500, color: "#8A94A6" }}>no iFood, com taxa de 25%</div>
    </AbsoluteFill>
  );
};
