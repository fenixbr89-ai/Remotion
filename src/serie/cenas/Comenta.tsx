import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Cinetico } from "../ui/Cinetico";
import { Icone } from "../ui/Icones";
import { cor, degrade, entra, flutua, fontFamily, sombra } from "../tema";
import type { CenaProps } from "./props";

/** Gancho final de engajamento: pede o próximo negócio nos comentários. */
export const Comenta: React.FC<CenaProps> = ({ n }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const balao = entra(f, fps, 6, 8);
  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: "180px 80px 300px" }}>
      <div style={{ scale: `${balao}`, translate: `0 ${flutua(f, 0, 10)}px` }}>
        <div style={{ width: 200, height: 200, borderRadius: 60, background: cor.branco, boxShadow: sombra, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icone nome="comentario" tamanho={140} />
        </div>
      </div>
      <Cinetico texto="Comente qual o *próximo* *negócio* que você quer ver aqui" inicio={16} intervalo={3} tamanho={78} alinhar="center" style={{ marginTop: 56 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 56, alignSelf: "stretch" }}>
        {n.proximos.map((p, i) => {
          const t = 60 + i * 22;
          const e = entra(f, fps, t, 12);
          const letras = Math.max(0, Math.min(p.length, Math.floor((f - t - 6) / 1.5)));
          return (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 28px", borderRadius: 32, background: cor.branco, border: `2px solid ${cor.azulBorda}`, boxShadow: sombra, opacity: e, translate: `0 ${(1 - e) * 60}px` }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, backgroundImage: degrade, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: 160 + i * 30, height: 14, borderRadius: 7, background: cor.azulFundo, marginBottom: 12 }} />
                <span style={{ color: cor.preto, fontSize: 42, fontWeight: 700 }}>
                  {p.slice(0, letras)}
                  {letras < p.length && f > t + 6 ? <span style={{ color: cor.azul }}>|</span> : null}
                </span>
              </div>
              <svg width={40} height={40} viewBox="0 0 24 24" fill={cor.vermelho} style={{ scale: `${entra(f, fps, t + 30, 8)}` }}>
                <path d="M12 21s-7.5-4.6-10-9.3C.4 8.5 2.3 4.5 6 4.5c2.2 0 3.6 1.3 6 3.6 2.4-2.3 3.8-3.6 6-3.6 3.7 0 5.6 4 4 7.2C19.5 16.4 12 21 12 21z" />
              </svg>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 40, translate: `0 ${Math.abs(Math.sin(f / 7)) * 18}px`, opacity: entra(f, fps, 120) }}>
        <Icone nome="seta" tamanho={90} />
      </div>
    </AbsoluteFill>
  );
};
