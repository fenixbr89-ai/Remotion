import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Cinetico } from "../ui/Cinetico";
import { IconeChip, type NomeIcone } from "../ui/Icones";
import { Logo } from "../ui/Logo";
import { cor, degrade, entra, fontFamily } from "../tema";
import type { CenaProps } from "./props";

const BENEFICIOS: { t: string; icone: NomeIcone }[] = [
  { t: "Custo exato, item por item", icone: "calculadora" },
  { t: "Escolha quanto quer ganhar", icone: "grafico" },
  { t: "Preço certo pra iFood, 99 e delivery próprio", icone: "app" },
];

export const Chamada: React.FC<CenaProps> = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = entra(f, fps, 6, 10);
  const botao = entra(f, fps, 80, 10);
  const pulso = f > 100 ? 1 + Math.sin((f - 100) / 6) * 0.025 : 1;
  const brilho = ((f - 100) % 60) / 60;
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: "180px 80px 300px" }}>
      <div style={{ scale: `${interpolate(logo, [0, 1], [0.5, 1.35])}`, opacity: logo }}>
        <Logo />
      </div>
      <Cinetico texto="Eu faço essa conta em segundos no *Preço* *Certo.*" inicio={18} intervalo={3} tamanho={66} alinhar="center" style={{ marginTop: 70 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 56, alignSelf: "stretch" }}>
        {BENEFICIOS.map((b, i) => {
          const e = entra(f, fps, 40 + i * 9);
          return (
            <div key={b.t} style={{ display: "flex", alignItems: "center", gap: 22, opacity: e, translate: `${(1 - e) * 80}px 0` }}>
              <IconeChip nome={b.icone} tamanho={72} style={{ scale: `${e}` }} />
              <span style={{ color: cor.texto, fontSize: 40, fontWeight: 700 }}>{b.t}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 64, position: "relative", overflow: "hidden", padding: "36px 100px", borderRadius: 999, backgroundImage: degrade, color: cor.branco, fontSize: 56, fontWeight: 800, boxShadow: "0 24px 60px rgba(29,78,216,0.4)", opacity: botao, scale: `${interpolate(botao, [0, 1], [0.6, 1]) * pulso}` }}>
        Teste grátis
        {f > 100 && <div style={{ position: "absolute", top: 0, bottom: 0, width: 120, left: `${-20 + brilho * 140}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)" }} />}
      </div>
      <div style={{ marginTop: 28, color: cor.azulProfundo, fontSize: 40, fontWeight: 700, opacity: entra(f, fps, 95) }}>siteprecocerto.vercel.app</div>
    </AbsoluteFill>
  );
};
