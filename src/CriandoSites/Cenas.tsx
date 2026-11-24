import React from "react";
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C, Frase, sans, useEntrada } from "./theme";
import { FichaGoogle, Midia, Roleta } from "./Pecas";
import { Nav, SECAO, SiteMock, WhatsApp } from "./SiteMock";
import type { CriandoSitesProps } from "./schema";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const Branco: React.FC<{ children: React.ReactNode; cor?: string }> = ({
  children,
  cor = C.branco,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: cor,
      alignItems: "center",
      justifyContent: "center",
      gap: 56,
      padding: "0 90px",
    }}
  >
    {children}
  </AbsoluteFill>
);

/* 1 — Abertura: "Dia N / Criando Sites / para empresas aleatórias..." */
export const Abertura: React.FC<{ p: CriandoSitesProps }> = ({ p }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.preto }}>
      {p.videoAbertura ? (
        <OffthreadVideo
          src={staticFile(p.videoAbertura)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }}
        />
      ) : (
        // Monitor no escuro com o site rolando (substitua por vídeo seu com `videoAbertura`)
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: 900,
              height: 560,
              marginTop: 260,
              borderRadius: 18,
              border: "14px solid #1b1b1b",
              overflow: "hidden",
              boxShadow: "0 0 220px rgba(255,255,255,0.12)",
              opacity: 0.55,
              rotate: "-4deg",
              scale: interpolate(frame, [0, 75], [1, 1.08]),
            }}
          >
            <div
              style={{
                scale: 0.6,
                transformOrigin: "0 0",
                translate: `0px ${interpolate(frame, [0, 75], [0, -500])}px`,
              }}
            >
              <SiteMock nome={p.nomeEmpresa} cidade={p.cidade} />
            </div>
          </div>
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(ellipse at 50% 62%, transparent 20%, rgba(0,0,0,0.9) 65%)",
            }}
          />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 210 }}>
        <Frase texto={`Dia ${p.dia}`} tamanho={50} cor={C.branco} />
        <Frase texto="Criando *Sites*" tamanho={120} cor={C.branco} delay={4} />
        <div
          style={{
            marginTop: 18,
            color: "#e6e6e6",
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 40,
            opacity: interpolate(frame, [14, 24], [0, 1], clamp),
          }}
        >
          para empresas aleatórias...
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 2 — Roleta */
export const Sorteio: React.FC<{ p: CriandoSitesProps; duracao: number }> = ({
  p,
  duracao,
}) => {
  const frame = useCurrentFrame();
  return (
    <Branco>
      <Frase texto="pra começar" tamanho={92} />
      <Roleta opcoes={p.opcoesRoleta} alvo={p.categoria} duracao={duracao - 25} />
      <div
        style={{
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 50,
          letterSpacing: "-0.03em",
          opacity: interpolate(frame, [duracao - 25, duracao - 15], [1, 0], clamp),
        }}
      >
        sorteando...
      </div>
    </Branco>
  );
};

/* Cena genérica: frase + mídia */
export const FraseMidia: React.FC<{
  texto: string;
  midia?: string;
  emoji: string;
  tamanho?: number;
  cor?: string;
  corTexto?: string;
}> = ({ texto, midia, emoji, tamanho = 92, cor, corTexto }) => (
  <Branco cor={cor}>
    <Frase texto={texto} tamanho={tamanho} cor={corTexto} />
    <Midia src={midia} emoji={emoji} />
  </Branco>
);

/* Achei a empresa: foto da fachada + emoji */
export const Achei: React.FC<{ p: CriandoSitesProps }> = ({ p }) => {
  const frame = useCurrentFrame();
  return (
    <Branco>
      <Frase texto={"e consegui achar\nessa *daqui*"} tamanho={92} />
      <Midia src={p.midias.fachada} emoji="💈" largura={760} altura={600} />
      <div
        style={{
          fontSize: 110,
          scale: interpolate(frame, [18, 30], [0, 1], {
            ...clamp,
            easing: Easing.spring({ damping: 12 }),
          }),
        }}
      >
        😎
      </div>
    </Branco>
  );
};

/* Ficha do Google: "4,7 no Google." -> "e nenhum site." */
export const Google: React.FC<{ p: CriandoSitesProps }> = ({ p }) => (
  <Branco>
    <Frase texto={`${p.nota} no Google.`} tamanho={96} />
    <FichaGoogle
      nome={p.nomeEmpresa}
      nota={p.nota}
      avaliacoes={p.avaliacoes}
      categoria={p.categoria}
      foto={p.midias.fichaGoogle}
    />
    <Sequence from={45} layout="none">
      <Frase texto="e nenhum *site*." tamanho={96} />
    </Sequence>
  </Branco>
);

/* "desenvolvendo..." com código sendo digitado */
const CODIGO = [
  "export const Hero = () => (",
  "  <Secao fundo=\"#0C0C0C\">",
  "    <Titulo>Corte na régua</Titulo>",
  "    <Preco valor={35} />",
  "    <Botao href={whatsapp}>",
  "      Agendar horário",
  "    </Botao>",
  "  </Secao>",
  ");",
];
export const Desenvolvendo: React.FC = () => {
  const frame = useCurrentFrame();
  const texto = CODIGO.join("\n");
  const chars = Math.floor(interpolate(frame, [8, 70], [0, texto.length], clamp));
  const anim = useEntrada(4);
  return (
    <Branco cor={C.preto}>
      <Frase texto="*desenvolvendo...*" tamanho={110} cor={C.branco} />
      <div
        style={{
          width: 860,
          height: 620,
          borderRadius: 32,
          background: "linear-gradient(180deg,#1a1a1a,#111)",
          border: "1px solid #2c2c2c",
          padding: "34px 44px",
          boxSizing: "border-box",
          ...anim,
        }}
      >
        <div style={{ display: "flex", gap: 12, marginBottom: 34, alignItems: "center" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ color: "#777", fontFamily: "monospace", fontSize: 22, marginLeft: 16 }}>
            Hero.tsx
          </span>
        </div>
        <pre
          style={{
            margin: 0,
            fontFamily: "'DejaVu Sans Mono', monospace",
            fontSize: 28,
            lineHeight: 1.6,
            color: "#d4d4d4",
            whiteSpace: "pre",
          }}
        >
          {texto.slice(0, chars)}
          <span style={{ background: "#C9A45C", opacity: frame % 16 < 8 ? 1 : 0 }}>
            {" "}
          </span>
        </pre>
      </div>
    </Branco>
  );
};

/* Vitrine do site: navegador + rolagem + legenda por seção */
export const Vitrine: React.FC<{ p: CriandoSitesProps; porSecao: number }> = ({
  p,
  porSecao,
}) => {
  const frame = useCurrentFrame();
  const legendas = [
    "a primeira *impressão*",
    "o que ela *oferece*",
    "planos e *WhatsApp*",
    "e como *chegar*",
  ];
  const ESCALA = 0.62; // 1440 -> ~893 px
  const keys = legendas.flatMap((_, i) => [i * porSecao, i * porSecao + 22]);
  const valores = legendas.flatMap((_, i) => [
    Math.max(0, i - 1) * SECAO,
    i * SECAO,
  ]);
  const scroll = interpolate(frame, keys, valores, {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const idx = Math.min(legendas.length - 1, Math.floor(frame / porSecao));
  const print = p.midias.printsSite?.[idx];
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.cinza,
        alignItems: "center",
        justifyContent: "center",
        gap: 70,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundColor: C.preto,
          opacity: interpolate(frame, [0, 24], [0.85, 0], clamp),
        }}
      />
      <div
        style={{
          width: 1440 * ESCALA,
          borderRadius: 26,
          overflow: "hidden",
          background: "#0c0c0c",
          boxShadow: "0 40px 100px rgba(0,0,0,0.35)",
          scale: interpolate(frame, [0, 30], [0.92, 1], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          zIndex: 1,
        }}
      >
        <div
          style={{
            height: 44,
            background: "#1d1d1d",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 18px",
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
          ))}
          <div
            style={{
              marginLeft: 20,
              flex: 1,
              height: 26,
              borderRadius: 13,
              background: "#2a2a2a",
              color: "#999",
              fontFamily: sans,
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              paddingLeft: 16,
            }}
          >
            {p.dominio}
          </div>
        </div>
        <div
          style={{
            height: SECAO * ESCALA,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {print ? (
            <img
              src={staticFile(print)}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            />
          ) : (
            <div style={{ scale: ESCALA, transformOrigin: "0 0", width: 1440 }}>
              <div style={{ translate: `0px ${-scroll}px` }}>
                <SiteMock nome={p.nomeEmpresa} cidade={p.cidade} />
              </div>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
                <Nav nome={p.nomeEmpresa} />
              </div>
              <div style={{ position: "absolute", top: SECAO - 110, right: 34 }}>
                <WhatsApp />
              </div>
            </div>
          )}
        </div>
      </div>
      {legendas.map((l, i) => (
        <Sequence
          key={l}
          from={i * porSecao}
          durationInFrames={porSecao}
          layout="none"
        >
          <div style={{ position: "absolute", top: 1380, width: "100%" }}>
            <Frase texto={l} tamanho={78} cor={C.texto} />
          </div>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/* CTA final em 3 batidas */
export const Chamada: React.FC<{ p: CriandoSitesProps }> = ({ p }) => {
  const frame = useCurrentFrame();
  const batida = 50;
  return (
    <AbsoluteFill style={{ backgroundColor: C.branco }}>
      <Sequence durationInFrames={batida} layout="none">
        <Branco>
          <Frase texto={"Se você não\ntem um *site*,"} tamanho={100} />
        </Branco>
      </Sequence>
      <Sequence from={batida} durationInFrames={batida} layout="none">
        <Branco>
          <Frase texto="comenta" tamanho={100} />
          <div
            style={{
              background: "#6E93C9",
              color: C.branco,
              fontFamily: sans,
              fontWeight: 800,
              fontSize: 150,
              letterSpacing: "-0.05em",
              padding: "10px 60px 24px",
              borderRadius: 30,
              scale: interpolate(frame - batida, [0, 12], [0.6, 1], {
                ...clamp,
                easing: Easing.spring({ damping: 10 }),
              }),
            }}
          >
            {p.palavraChave}
          </div>
        </Branco>
      </Sequence>
      <Sequence from={batida * 2} layout="none">
        <Branco>
          <Frase texto={"que eu vou criar\no *site* da\nsua empresa."} tamanho={96} />
          <Midia src={p.midias.final} emoji="✍️" largura={760} altura={560} />
        </Branco>
      </Sequence>
    </AbsoluteFill>
  );
};

