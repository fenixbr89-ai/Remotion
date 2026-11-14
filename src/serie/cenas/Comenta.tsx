import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Celular } from "../ui/Ilustracoes";
import { Legenda } from "../ui/Legenda";
import { cor, degrade, entra, flutua, fontFamily, sombra } from "../tema";
import type { CenaProps } from "./props";

const POS = [
  { left: 30, top: 640 },
  { right: 30, top: 820 },
  { left: 50, top: 1180 },
  { right: 40, top: 1330 },
];

/** Gancho de engajamento: comentários chegando com o próximo negócio. */
export const Comenta: React.FC<CenaProps> = ({ n }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cel = entra(f, fps, 8, 13);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Legenda frases={[{ em: 4, l1: "*Comente* qual o próximo negócio", l2: "que você quer ver aqui." }]} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 500 }}>
        <div style={{ scale: `${0.8 + cel * 0.2}`, opacity: cel, translate: `0 ${(1 - cel) * 200}px` }}>
          <Celular largura={500}>
            <div style={{ height: 380, background: degrade, display: "flex", alignItems: "center", justifyContent: "center", color: cor.branco, fontSize: 40, fontWeight: 800 }}>
              <div style={{ padding: "14px 26px", borderRadius: 18, background: cor.branco, color: cor.azulProfundo }}>COMENTE AQUI</div>
            </div>
            <div style={{ padding: "22px 26px" }}>
              <div style={{ color: cor.texto, fontSize: 28, fontWeight: 800, textAlign: "center", marginBottom: 14 }}>Comentários</div>
              {n.proximos.map((p, i) => {
                const t = 40 + i * 24;
                const e = entra(f, fps, t, 12);
                const letras = Math.max(0, Math.min(p.length, Math.floor((f - t - 6) / 1.5)));
                return (
                  <div key={p} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", opacity: e, translate: `0 ${(1 - e) * 40}px` }}>
                    <div style={{ width: 52, height: 52, borderRadius: 26, background: i % 2 ? cor.azulCeu : degrade, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ width: 110 + i * 24, height: 10, borderRadius: 5, background: cor.azulFundo, marginBottom: 8 }} />
                      <span style={{ color: cor.preto, fontSize: 32, fontWeight: 800 }}>
                        {p.slice(0, letras)}
                        {letras < p.length && f > t + 6 ? <span style={{ color: cor.azul }}>|</span> : null}
                      </span>
                    </div>
                    <svg width={30} height={30} viewBox="0 0 24 24" fill={cor.vermelho} style={{ scale: `${entra(f, fps, t + 26, 8)}` }}>
                      <path d="M12 21s-7.5-4.6-10-9.3C.4 8.5 2.3 4.5 6 4.5c2.2 0 3.6 1.3 6 3.6 2.4-2.3 3.8-3.6 6-3.6 3.7 0 5.6 4 4 7.2C19.5 16.4 12 21 12 21z" />
                    </svg>
                  </div>
                );
              })}
            </div>
          </Celular>
        </div>
      </AbsoluteFill>
      {[...n.proximos, "Outro?"].slice(0, 4).map((p, i) => {
        const e = entra(f, fps, 60 + i * 14, 9);
        return (
          <div key={p} style={{ position: "absolute", ...POS[i], scale: `${e}`, opacity: e, translate: `0 ${flutua(f, i * 1.3, 10)}px`, display: "flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 999, background: cor.branco, border: `2px solid ${cor.azulBorda}`, boxShadow: sombra, color: cor.azulProfundo, fontSize: 30, fontWeight: 800 }}>
            <div style={{ width: 30, height: 30, borderRadius: 15, background: degrade }} />
            {p}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
