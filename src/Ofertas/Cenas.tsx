import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CHAMADA, COR, FONTE_TITULO, PRODUTOS, VALIDADE, WHATSAPP } from "./config";
import { clamp, Fundo, Logo, Preco, Selo, Tag, Texto, usePop } from "./ui";

// Linha centralizada numa altura fixa
const Linha: React.FC<{ y: number; children: React.ReactNode }> = ({ y, children }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center" }}>
    {children}
  </div>
);

// ================= 1. ABERTURA (2,5s) =================
export const DUR_ABERTURA = 75;

export const Abertura: React.FC = () => {
  const sai = DUR_ABERTURA - 10;
  return (
    <AbsoluteFill>
      <Fundo />
      <Linha y={150}>
        <Logo width={480} delay={0} saida={sai} />
      </Linha>
      <Linha y={560}>
        <Selo width={860} delay={6} saida={sai} />
      </Linha>
      <Linha y={1420}>
        <Tag bg={COR.vermelho} delay={20} size={120} saida={sai}>
          {CHAMADA}
        </Tag>
      </Linha>
      <Linha y={1610}>
        <Texto delay={28} size={50} saida={sai}>
          Carnes de qualidade e procedência
        </Texto>
      </Linha>
    </AbsoluteFill>
  );
};

// ================= 2. PRODUTOS =================
export const POR_PRODUTO = 50;
export const DUR_PRODUTOS = PRODUTOS.length * POR_PRODUTO;

export const Produtos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame, fps, config: { damping: 14 } });
  const idx = Math.min(PRODUTOS.length - 1, Math.floor(frame / POR_PRODUTO));
  const local = frame - idx * POR_PRODUTO;
  const prod = PRODUTOS[idx];
  const ultimo = idx === PRODUTOS.length - 1;

  // produto entra pela direita e sai pela esquerda
  const entra = interpolate(local, [0, 12], [1, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const sai = ultimo
    ? 0
    : interpolate(local, [POR_PRODUTO - 8, POR_PRODUTO], [0, 1], { ...clamp, easing: Easing.bezier(0.7, 0, 0.84, 0) });
  const nome = spring({ frame: local - 6, fps, config: { damping: 14 } });
  const preco = spring({ frame: local - 10, fps, config: { damping: 10 } });

  return (
    <AbsoluteFill>
      <Fundo />
      <Linha y={50}>
        <Selo width={340} delay={0} />
      </Linha>

      {/* cartão branco */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 430,
          width: 900,
          height: 960,
          borderRadius: 56,
          background: "linear-gradient(180deg, #ffffff 0%, #eef4fb 100%)",
          boxShadow: "0 30px 70px rgba(0,0,0,0.35)",
          scale: String(card),
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 22, background: COR.vermelho }} />
        <Img
          src={staticFile(prod.imagem)}
          style={{
            position: "absolute",
            left: "50%",
            top: 400,
            width: 700,
            height: 560,
            objectFit: "contain",
            translate: `calc(-50% + ${entra * 900 - sai * 900}px) -50%`,
            filter: "drop-shadow(0 20px 22px rgba(0,0,0,0.3))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            top: 720,
            textAlign: "center",
            fontFamily: FONTE_TITULO,
            fontWeight: 800,
            fontSize: 92,
            lineHeight: 1,
            color: COR.marinho,
            opacity: nome * (1 - sai),
            translate: `0px ${(1 - nome) * 30}px`,
          }}
        >
          {prod.nome}
        </div>
      </div>

      {/* preço sobre a borda de baixo do cartão */}
      <Linha y={1290}>
        <div style={{ scale: String(preco * (1 - sai) * card) }}>
          <Preco preco={prod.preco} unidade={prod.unidade} size={190} />
        </div>
      </Linha>

      <Linha y={1640}>
        <Logo width={250} delay={4} />
      </Linha>
    </AbsoluteFill>
  );
};

// ================= 3. GRADE "IMPERDÍVEIS" =================
export const DUR_GRADE = 95;

const MiniCard: React.FC<{ i: number; delay: number }> = ({ i, delay }) => {
  const p = usePop(delay, 12);
  const prod = PRODUTOS[i];
  return (
    <div
      style={{
        width: 440,
        height: 330,
        background: "#ffffff",
        borderRadius: 30,
        position: "relative",
        scale: String(p),
        boxShadow: "0 14px 30px rgba(0,0,0,0.3)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 10, background: COR.vermelho }} />
      <Img
        src={staticFile(prod.imagem)}
        style={{ position: "absolute", left: 14, top: 50, width: 230, height: 230, objectFit: "contain" }}
      />
      <div
        style={{
          position: "absolute",
          right: 16,
          top: 34,
          width: 190,
          textAlign: "center",
          fontFamily: FONTE_TITULO,
          fontWeight: 800,
          fontSize: 38,
          lineHeight: 1,
          color: COR.marinho,
        }}
      >
        {prod.nome}
      </div>
      <div style={{ position: "absolute", right: 14, bottom: 22 }}>
        <Preco preco={prod.preco} unidade={prod.unidade} size={74} />
      </div>
    </div>
  );
};

export const Grade: React.FC = () => {
  return (
    <AbsoluteFill>
      <Fundo />
      <Linha y={150}>
        <Texto delay={2} size={64}>
          São ofertas
        </Texto>
      </Linha>
      <Linha y={250}>
        <Tag bg={COR.vermelho} delay={8} size={130}>
          IMPERDÍVEIS!
        </Tag>
      </Linha>
      <Linha y={500}>
        <div style={{ display: "grid", gridTemplateColumns: "440px 440px", gap: 30 }}>
          {PRODUTOS.map((_, i) => (
            <MiniCard key={i} i={i} delay={14 + i * 5} />
          ))}
        </div>
      </Linha>
      <Linha y={1640}>
        <Logo width={250} delay={0} />
      </Linha>
    </AbsoluteFill>
  );
};

// ================= 4. FINAL =================
export const DUR_FINAL = 110;

export const Final: React.FC = () => {
  return (
    <AbsoluteFill>
      <Fundo />
      <Linha y={260}>
        <Logo width={760} delay={2} />
      </Linha>
      <Linha y={830}>
        <Texto delay={14} size={52}>
          Setor Universitário
        </Texto>
      </Linha>
      <Linha y={960}>
        <Texto delay={20} size={48}>
          Ofertas válidas para
        </Texto>
      </Linha>
      <Linha y={1040}>
        <Tag bg={COR.branco} cor={COR.marinho} delay={24} size={90}>
          {VALIDADE}
        </Tag>
      </Linha>
      <Linha y={1170}>
        <Texto delay={28} size={40}>
          ou enquanto durar o estoque
        </Texto>
      </Linha>
      <Linha y={1330}>
        <Texto delay={36} size={50}>
          Peça pelo WhatsApp
        </Texto>
      </Linha>
      <Linha y={1420}>
        <Tag bg={COR.vermelho} delay={42} size={110}>
          {WHATSAPP}
        </Tag>
      </Linha>
    </AbsoluteFill>
  );
};
