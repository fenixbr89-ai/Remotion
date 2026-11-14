import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COR, SANS, clamp, suave } from "./tema";
import { Icone, type NomeIcone } from "./Icones";
import { Destaque, TextoCena } from "./Texto";

type Servico = { nome: string; icone: NomeIcone };

const FILEIRAS: Servico[][] = [
  [
    { nome: "Pintura", icone: "rolo" },
    { nome: "Pintura automotiva", icone: "pistola" },
    { nome: "Acabamentos", icone: "pincel" },
    { nome: "Telhados", icone: "telhado" },
  ],
  [
    { nome: "Calhas", icone: "calha" },
    { nome: "Reformas", icone: "reforma" },
    { nome: "Pós-obra", icone: "posObra" },
  ],
  [
    { nome: "Elétrica", icone: "eletrica" },
    { nome: "Hidráulica", icone: "hidraulica" },
    { nome: "Caixa d’água", icone: "caixa" },
    { nome: "Manutenção", icone: "manutencao" },
  ],
];

const Pilula: React.FC<{ readonly s: Servico }> = ({ s }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 20,
      height: 120,
      padding: "0 44px 0 28px",
      borderRadius: 999,
      background: "#fff",
      border: `1px solid ${COR.linha}`,
      boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
      fontFamily: SANS,
      fontSize: 38,
      fontWeight: 400,
      color: COR.texto,
      whiteSpace: "nowrap",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: 76,
        height: 76,
        borderRadius: 38,
        background: COR.cinzaClaro,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: COR.laranja,
      }}
    >
      <Icone nome={s.icone} tamanho={46} />
    </div>
    {s.nome}
  </div>
);

/** Cena 05 — fileiras de serviços que convergem para um único contato. */
export const Cena05Versatilidade: React.FC = () => {
  const frame = useCurrentFrame();
  const foco = interpolate(frame, [130, 165], [0, 1], {
    ...clamp,
    easing: suave,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundo }}>
      <div
        style={{
          position: "absolute",
          left: 900,
          right: 0,
          top: 0,
          bottom: 0,
          overflow: "hidden",
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 14%, #000 88%, transparent 100%)",
          opacity: 1 - foco * 0.65,
          filter: `blur(${foco * 3}px)`,
        }}
      >
        {FILEIRAS.map((fileira, i) => {
          const sentido = i % 2 === 0 ? -1 : 1;
          const desloc = sentido * frame * 2.6 + (sentido > 0 ? -1400 : 0);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 250 + i * 200,
                left: 0,
                display: "flex",
                gap: 28,
                translate: `${desloc}px 0px`,
                opacity: interpolate(
                  frame,
                  [10 + i * 10, 35 + i * 10],
                  [0, 1],
                  clamp,
                ),
              }}
            >
              {[...fileira, ...fileira, ...fileira, ...fileira].map((s, j) => (
                <Pilula key={j} s={s} />
              ))}
            </div>
          );
        })}
      </div>
      {/* um só contato */}
      <div
        style={{
          position: "absolute",
          left: 1380 - 150,
          top: 540 - 150,
          width: 300,
          height: 300,
        }}
      >
        {[0, 1].map((k) => {
          const ciclo = ((((frame - 165 + k * 30) % 60) + 60) % 60) / 60;
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `3px solid ${COR.laranja}`,
                scale: 1 + ciclo * 0.6,
                opacity: frame > 165 ? (1 - ciclo) * 0.6 : 0,
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: COR.laranja,
            boxShadow: "0 40px 80px rgba(242,106,27,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            scale: interpolate(frame, [130, 165], [0, 1], {
              ...clamp,
              easing: suave,
              output: "perceptual-scale",
            }),
          }}
        >
          <Icone nome="telefone" tamanho={130} espessura={4} />
        </div>
      </div>
      <TextoCena
        rotulo="Versatilidade"
        inicio={20}
        linhas={[
          <>
            Um só <Destaque>contato</Destaque>.
          </>,
          "Muitas soluções.",
        ]}
        locucao="Do pequeno reparo à reforma, conte com uma equipe preparada para cuidar do que você precisa."
      />
    </AbsoluteFill>
  );
};
