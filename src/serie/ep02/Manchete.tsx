import { AbsoluteFill } from "remotion";
import "./Estilos";

/** Estilo "Manchete": telas-chave para aprovação (estáticas). Mesmas cores da marca. */
const NAVY = "#0B1F4D";
const CINZA = "#8A94A6";
const GRAD = "linear-gradient(90deg, #1D4ED8 0%, #38BDF8 100%)";
const VERMELHO = "#E5383B";
const VERDE = "#16A34A";
const grad: React.CSSProperties = { backgroundImage: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", padding: "0.1em 0.04em 0.2em", margin: "-0.1em -0.04em -0.2em" };

const Tela: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "#FFFFFF", fontFamily: "Inter", color: NAVY, alignItems: "center", justifyContent: "center", textAlign: "center" }}>{children}</AbsoluteFill>
);
const T: React.FC<{ s: number; c?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ s, c = NAVY, children, style }) => (
  <div style={{ fontFamily: "Anton", fontSize: s, lineHeight: 1.02, color: c, textTransform: "uppercase", ...style }}>{children}</div>
);
/** caixa de destaque: texto branco em caixa azul, reta */
const Caixa: React.FC<{ s: number; fundo?: string; children: React.ReactNode }> = ({ s, fundo = GRAD, children }) => (
  <div style={{ display: "inline-block", fontFamily: "Anton", fontSize: s, lineHeight: 1.1, color: "#fff", background: fundo, padding: "6px 30px 10px", borderRadius: 18, textTransform: "uppercase" }}>{children}</div>
);
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ width: 820, borderRadius: 44, background: "#fff", boxShadow: "0 30px 80px rgba(11,31,77,.12)", padding: "40px 48px", boxSizing: "border-box", ...style }}>{children}</div>
);
const Linha: React.FC<{ r: string; v: string; c?: string }> = ({ r, v, c = NAVY }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 84, borderBottom: "2px solid #EEF3FC", fontSize: 40 }}>
    <span style={{ fontWeight: 600 }}>{r}</span>
    <span style={{ fontWeight: 800, color: c }}>{v}</span>
  </div>
);

export const M1Gancho: React.FC = () => (
  <Tela>
    <T s={120}>Marmita a</T>
    <T s={460} style={grad}>R$13</T>
    <T s={120}>no iFood?</T>
    <div style={{ marginTop: 60 }}>
      <Caixa s={84} fundo={VERMELHO}>Você paga pra trabalhar</Caixa>
    </div>
  </Tela>
);

export const M2Custo: React.FC = () => (
  <Tela>
    <T s={110}>Quanto custa</T>
    <div style={{ marginTop: 28 }}>
      <Caixa s={110}>1 marmita?</Caixa>
    </div>
    <Card style={{ marginTop: 70 }}>
      <Linha r="Arroz" v="R$ 0,80" />
      <Linha r="Feijão tropeiro" v="R$ 2,40" />
      <Linha r="Carne" v="R$ 4,50" />
      <Linha r="Salada" v="R$ 0,60" />
      <Linha r="Embalagem" v="R$ 1,20" />
      <Linha r="Gás e energia" v="R$ 0,50" />
      <div style={{ marginTop: 30, display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <span style={{ fontSize: 40, fontWeight: 700, color: CINZA }}>Custo</span>
        <T s={150} style={grad}>R$10</T>
      </div>
    </Card>
  </Tela>
);

export const M3Prejuizo: React.FC = () => (
  <Tela>
    <T s={110}>Cobrando</T>
    <div style={{ marginTop: 28 }}>
      <Caixa s={110}>R$ 13 no iFood</Caixa>
    </div>
    <Card style={{ marginTop: 70 }}>
      <Linha r="Vendeu" v="R$ 13,00" />
      <Linha r="Custo" v="− R$ 10,00" c={VERMELHO} />
      <Linha r="Taxa iFood (25%)" v="− R$ 3,25" c={VERMELHO} />
      <div style={{ marginTop: 30, fontSize: 40, fontWeight: 700, color: CINZA }}>sobra</div>
      <T s={200} c={VERMELHO}>−R$0,25</T>
    </Card>
    <div style={{ marginTop: 50 }}>
      <T s={90}>Prejuízo em toda venda</T>
    </div>
  </Tela>
);

export const M4PrecoCerto: React.FC = () => (
  <Tela>
    <T s={110}>O preço</T>
    <div style={{ marginTop: 28 }}>
      <Caixa s={130}>certo</Caixa>
    </div>
    <div style={{ marginTop: 60, display: "flex", gap: 40 }}>
      {[
        ["Balcão", "R$16"],
        ["iFood", "R$20"],
      ].map(([r, v]) => (
        <div key={r} style={{ width: 390, borderRadius: 44, background: "#fff", boxShadow: "0 30px 80px rgba(11,31,77,.12)", padding: "40px 0" }}>
          <div style={{ fontSize: 44, fontWeight: 700, color: CINZA }}>{r}</div>
          <T s={190} style={grad}>{v}</T>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 60, padding: "26px 50px", borderRadius: 999, background: "#E8F7EE", fontSize: 52, fontWeight: 800, color: VERDE }}>Sobra R$ 5,00 por marmita</div>
  </Tela>
);

export const M5Cta: React.FC = () => (
  <Tela>
    <T s={110}>Faz a conta do</T>
    <div style={{ marginTop: 28 }}>
      <Caixa s={110}>seu delivery</Caixa>
    </div>
    <div style={{ marginTop: 80, fontSize: 64, fontWeight: 800 }}>@precocerto.site</div>
    <div style={{ marginTop: 50, padding: "30px 110px", borderRadius: 999, background: GRAD, color: "#fff", fontSize: 56, fontWeight: 800 }}>Seguir</div>
    <div style={{ marginTop: 50, fontSize: 44, fontWeight: 600, color: CINZA }}>EP. 03 vem aí: comenta o próximo negócio</div>
  </Tela>
);
