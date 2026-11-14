import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Cinetico } from "../ui/Cinetico";
import { Cursor } from "../ui/Ilustracoes";
import { Logo } from "../ui/Logo";
import { cor, degrade, entra, flutua, fontFamily, suave } from "../tema";
import type { CenaProps } from "./props";

const MOEDAS = [
  { x: 110, y: 330, s: 70 },
  { x: 900, y: 420, s: 56 },
  { x: 160, y: 1420, s: 60 },
  { x: 880, y: 1500, s: 74 },
  { x: 520, y: 1700, s: 44 },
];

/** Assinatura da marca: curtir e seguir, com o cursor clicando. */
export const Outro: React.FC<CenaProps> = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = entra(f, fps, 4, 10);
  // trajeto do cursor: entra → coração (clica) → seguir (clica)
  const ida1 = suave(f, 45, 65);
  const ida2 = suave(f, 80, 100);
  const cx = interpolate(ida1, [0, 1], [900, 380]) + ida2 * (650 - 380);
  const cy = interpolate(ida1, [0, 1], [1600, 1180]);
  const clique1 = f >= 66 && f < 74;
  const clique2 = f >= 101 && f < 109;
  const curtiu = f >= 70;
  const seguiu = f >= 105;
  return (
    <AbsoluteFill style={{ fontFamily, background: degrade }}>
      {MOEDAS.map((m, i) => (
        <div key={i} style={{ position: "absolute", left: m.x, top: m.y, width: m.s, height: m.s, borderRadius: m.s / 2, background: "rgba(255,255,255,0.9)", color: cor.azul, fontSize: m.s * 0.34, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", translate: `0 ${flutua(f, i, 16)}px`, scale: `${entra(f, fps, 6 + i * 4, 10)}`, boxShadow: "0 10px 30px rgba(17,19,24,0.15)" }}>
          R$
        </div>
      ))}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ scale: `${interpolate(logo, [0, 1], [0.5, 1.5])}`, opacity: logo }}>
          <Logo claro />
        </div>
        <Cinetico texto="Aproveita pra curtir e seguir" inicio={16} intervalo={3} tamanho={64} alinhar="center" corTexto={cor.branco} style={{ marginTop: 90, width: 800 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 70, opacity: entra(f, fps, 30), scale: `${entra(f, fps, 30, 11)}` }}>
          <div style={{ width: 110, height: 110, borderRadius: 55, background: curtiu ? cor.branco : "transparent", border: `5px solid ${cor.branco}`, display: "flex", alignItems: "center", justifyContent: "center", scale: `${clique1 ? 0.88 : curtiu ? 1 + Math.max(0, 1 - (f - 70) / 10) * 0.15 : 1}` }}>
            <svg width={56} height={56} viewBox="0 0 24 24" fill={curtiu ? cor.vermelho : "none"} stroke={curtiu ? cor.vermelho : cor.branco} strokeWidth={2.4}>
              <path d="M12 21s-7.5-4.6-10-9.3C.4 8.5 2.3 4.5 6 4.5c2.2 0 3.6 1.3 6 3.6 2.4-2.3 3.8-3.6 6-3.6 3.7 0 5.6 4 4 7.2C19.5 16.4 12 21 12 21z" />
            </svg>
          </div>
          <div style={{ padding: "30px 54px", borderRadius: 999, background: seguiu ? cor.preto : cor.branco, color: seguiu ? cor.branco : cor.azulProfundo, fontSize: 44, fontWeight: 800, scale: `${clique2 ? 0.9 : 1}`, display: "flex", alignItems: "center", gap: 14 }}>
            {seguiu ? "Seguindo" : "+ Seguir"}
            {seguiu && (
              <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={cor.branco} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            )}
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: cx, top: cy, opacity: suave(f, 40, 50), scale: `${clique1 || clique2 ? 0.85 : 1}` }}>
        <Cursor tamanho={80} />
      </div>
    </AbsoluteFill>
  );
};
