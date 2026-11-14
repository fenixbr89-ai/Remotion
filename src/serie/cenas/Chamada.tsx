import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Logo } from "../ui/Logo";
import { cor, entra, fontFamily } from "../tema";
import type { CenaProps } from "./props";

const BENEFICIOS = ["Custo exato, item por item", "Escolha quanto quer ganhar", "Preço certo pra iFood, 99 e delivery próprio"];

export const Chamada: React.FC<CenaProps> = ({ n }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = entra(f, fps, 0, 10);
  const botao = entra(f, fps, 70, 10);
  const pulso = f > 90 ? 1 + Math.sin((f - 90) / 6) * 0.025 : 1;
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
      <div style={{ scale: interpolate(logo, [0, 1], [0.5, 1]) * 1.4, opacity: logo }}>
        <Logo />
      </div>
      <div style={{ color: cor.branco, fontSize: 68, fontWeight: 800, textAlign: "center", letterSpacing: -2, lineHeight: 1.12, marginTop: 80, opacity: entra(f, fps, 12) }}>
        Eu faço essa conta em segundos no <span style={{ color: cor.azulClaro }}>Preço Certo</span>.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 60, alignSelf: "stretch" }}>
        {BENEFICIOS.map((b, i) => {
          const e = entra(f, fps, 28 + i * 9);
          return (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 22, opacity: e, translate: `${(1 - e) * 60}px 0` }}>
              <div style={{ width: 54, height: 54, borderRadius: 27, background: "rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={cor.azulClaro} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
              <span style={{ color: cor.branco, fontSize: 42, fontWeight: 600 }}>{b}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 70, padding: "36px 90px", borderRadius: 999, background: cor.azul, color: cor.branco, fontSize: 56, fontWeight: 800, boxShadow: "0 20px 60px rgba(59,130,246,0.5)", opacity: botao, scale: interpolate(botao, [0, 1], [0.7, 1]) * pulso }}>
        Teste grátis
      </div>
      <div style={{ marginTop: 30, color: cor.azulClaro, fontSize: 40, fontWeight: 700, opacity: entra(f, fps, 85) }}>siteprecocerto.vercel.app</div>
      <div style={{ marginTop: 50, color: cor.cinza, fontSize: 38, fontWeight: 600, textAlign: "center", opacity: entra(f, fps, 110) }}>
        Comenta qual negócio vem no <span style={{ color: n.corDestaqueClara }}>EP. {String(n.episodio + 1).padStart(2, "0")}</span>
      </div>
    </AbsoluteFill>
  );
};
