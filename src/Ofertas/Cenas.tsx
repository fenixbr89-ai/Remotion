import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, FONTE_TEXTO, FONTE_TITULO, PRODUTOS, SELO_CARNE, SELO_TERCA, VALIDADE, WHATSAPP } from "./config";
import { clamp, Estouro, Fundo, Logo, Palavras, Preco, Selo, Tag, useOut, usePop } from "./ui";

const suave = Easing.bezier(0.65, 0, 0.35, 1);

// Linha centralizada numa altura fixa
const Linha: React.FC<{ y: number; children: React.ReactNode; gap?: number }> = ({ y, children, gap }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: y,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap,
    }}
  >
    {children}
  </div>
);

// Selo que entra grande no centro e depois sobe pequeno para o topo
const SeloQueSobe: React.FC<{ entra: number; sobe: number; yCentro: number; src: string; width: number; saida?: number }> = ({
  entra,
  sobe,
  yCentro,
  src,
  width,
  saida,
}) => {
  const frame = useCurrentFrame();
  const p = usePop(entra, 10);
  const o = useOut(saida ?? 99999);
  const t = interpolate(frame, [sobe, sobe + 14], [0, 1], { ...clamp, easing: suave });
  return (
    <Linha y={interpolate(t, [0, 1], [yCentro, 60])}>
      <div style={{ scale: String(p * o * interpolate(t, [0, 1], [1, 0.44])), transformOrigin: "top center" }}>
        <Selo width={width} src={src} />
      </div>
    </Linha>
  );
};

// ================= 1. ABERTURA (azul) =================
// Narração: "Chegou a Terça-feira Suína do Mariana Supermercado! É dia de aproveitar ofertas especiais!"
export const DUR_ABERTURA = 213;

export const Abertura: React.FC = () => {
  const troca = 126; // 4,2s: começa "é dia de aproveitar"
  return (
    <AbsoluteFill>
      <Fundo tipo="azul" />
      <SeloQueSobe entra={2} sobe={troca} yCentro={150} src={SELO_CARNE} width={560} />
      <Linha y={830}>
        <div style={{ scale: String(usePop(20, 11) * useOut(troca - 6)) }}>
          <Selo width={760} src={SELO_TERCA} />
        </div>
      </Linha>
      <Linha y={1260}>
        <Logo width={540} delay={70} saida={troca - 6} />
      </Linha>
      <Linha y={540}>
        <Palavras texto="é dia de aproveitar" delay={troca + 4} size={70} />
      </Linha>
      <Linha y={660}>
        <Tag bg={COR.vermelho} delay={160} size={170}>
          OFERTAS
        </Tag>
      </Linha>
      <Linha y={890}>
        <Tag bg={COR.branco} cor={COR.marinho} delay={175} size={140}>
          ESPECIAIS!
        </Tag>
      </Linha>
    </AbsoluteFill>
  );
};

// ================= 2. VOCÊ ENCONTRA (branco) =================
export const DUR_ENCONTRA = 141;

const ItemLista: React.FC<{ y: number; delay: number; texto: string; bg: string; img: string }> = ({
  y,
  delay,
  texto,
  bg,
  img,
}) => {
  const p = usePop(delay + 5, 12);
  return (
    <Linha y={y} gap={36}>
      <Tag bg={bg} delay={delay} size={100}>
        {texto}
      </Tag>
      <Img
        src={staticFile(img)}
        style={{ width: 250, height: 200, objectFit: "contain", scale: String(p), filter: "drop-shadow(0 12px 14px rgba(0,0,0,0.3))" }}
      />
    </Linha>
  );
};

export const VoceEncontra: React.FC = () => (
  <AbsoluteFill>
    <Fundo tipo="branco" />
    <Linha y={70}>
      <div style={{ scale: String(usePop(0, 12)) }}>
        <Selo width={460} src={SELO_TERCA} />
      </div>
    </Linha>
    <Linha y={430}>
      <Palavras texto="Aqui você encontra" delay={2} cor={COR.marinho} size={74} />
    </Linha>
    <ItemLista y={600} delay={24} texto="PERNIL" bg={COR.vermelho} img="pernil-com-osso.png" />
    <ItemLista y={860} delay={45} texto="COSTELINHA" bg={COR.azul} img="costelinha.png" />
    <ItemLista y={1120} delay={72} texto="LOMBO" bg={COR.azul} img="lombo.png" />
    <Linha y={1400}>
      <Tag bg={COR.marinho} delay={92} size={90}>
        fresquinhos!
      </Tag>
    </Linha>
  </AbsoluteFill>
);

// ================= 3. CONFIRA OS PREÇOS (vermelho) =================
export const DUR_CONFIRA = 48;

const Etiqueta: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const p = usePop(delay, 9);
  const flutua = Math.sin((frame - delay) / 8) * 12;
  return (
    <svg
      viewBox="0 0 200 300"
      style={{ width: 240, scale: String(p), translate: `0px ${flutua}px`, filter: "drop-shadow(0 14px 16px rgba(0,0,0,0.3))" }}
    >
      <path d="M100 0 L100 40" stroke={COR.branco} strokeWidth="6" />
      <path d="M40 80 L100 40 L160 80 L160 280 Q160 295 145 295 L55 295 Q40 295 40 280 Z" fill={COR.branco} />
      <circle cx="100" cy="85" r="12" fill={COR.vermelho} />
      <text x="100" y="230" textAnchor="middle" fontSize="130" fontWeight="800" fill={COR.vermelho} fontFamily={FONTE_TITULO}>
        $
      </text>
    </svg>
  );
};

export const ConfiraPrecos: React.FC = () => (
  <AbsoluteFill>
    <Fundo tipo="vermelho" />
    <Linha y={420}>
      <Palavras texto="Confira" delay={0} size={74} />
    </Linha>
    <Linha y={540}>
      <Tag bg={COR.branco} cor={COR.vermelho} delay={8} size={150}>
        OS PREÇOS
      </Tag>
    </Linha>
    <Linha y={760}>
      <Tag bg={COR.marinho} delay={20} size={140}>
        DO DIA!
      </Tag>
    </Linha>
    <Linha y={1020}>
      <Etiqueta delay={24} />
    </Linha>
  </AbsoluteFill>
);

// ================= 4. PRODUTOS um a um (azul) =================
// Frames de cada produto, medidos na narração (13,4s / 16,9s / 20,3s / 24,1s / 27,8s / 31,3s / fim 35,2s)
const TEMPOS = [105, 102, 114, 111, 105, 117];
const durProduto = (i: number) => TEMPOS[i] ?? 90;
const inicioProduto = (i: number) => Array.from({ length: i }, (_, k) => durProduto(k)).reduce((a, b) => a + b, 0);
export const DUR_PRODUTOS = inicioProduto(PRODUTOS.length);

export const Produtos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame, fps, config: { damping: 14 } });
  let idx = 0;
  while (idx < PRODUTOS.length - 1 && frame >= inicioProduto(idx + 1)) idx++;
  const local = frame - inicioProduto(idx);
  const POR_PRODUTO = durProduto(idx);
  const prod = PRODUTOS[idx];
  const ultimo = idx === PRODUTOS.length - 1;

  const entra = spring({ frame: local - 2, fps, config: { damping: 12 } });
  const sai = ultimo ? 0 : interpolate(local, [POR_PRODUTO - 9, POR_PRODUTO], [0, 1], clamp);
  const nome = spring({ frame: local - 8, fps, config: { damping: 14 } });
  const preco = spring({ frame: local - 24, fps, config: { damping: 8 } }); // quando o preço é falado
  // pulso no preço no meio do tempo
  const pulso = interpolate(local, [60, 66, 74], [1, 1.12, 1], clamp);
  // movimento contínuo do produto
  const flutua = Math.sin(local / 12) * 10;
  const zoom = interpolate(local, [0, POR_PRODUTO], [1, 1.07]);

  return (
    <AbsoluteFill>
      <Fundo tipo="azul" />
      <Linha y={40}>
        <div style={{ scale: String(card) }}>
          <Selo width={520} src={SELO_TERCA} />
        </div>
      </Linha>

      {/* cartão com moldura vermelha */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 410,
          width: 880,
          height: 960,
          borderRadius: 60,
          background: COR.vermelho,
          padding: 20,
          scale: String(card),
          boxShadow: "0 18px 0 rgba(0,0,0,0.15), 0 30px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 44,
            background: "radial-gradient(circle at 50% 40%, #ffffff 0%, #f1f6fc 65%, #dbe7f5 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* sombra azul sob o produto */}
          <div
            style={{
              position: "absolute",
              left: 170,
              right: 170,
              top: 620,
              height: 70,
              borderRadius: "50%",
              background: COR.azulEscuro,
              opacity: 0.85,
              filter: "blur(4px)",
              scale: `${entra * (1 - sai)}`,
            }}
          />
          <Img
            src={staticFile(prod.imagem)}
            style={{
              position: "absolute",
              left: "50%",
              top: 390,
              width: 680,
              height: 520,
              objectFit: "contain",
              translate: `-50% calc(-50% + ${flutua}px)`,
              scale: String(entra * zoom * (1 + sai * 0.5)),
              rotate: `${(1 - entra) * -20}deg`,
              opacity: 1 - sai,
              filter: `blur(${sai * 16}px) drop-shadow(0 18px 20px rgba(0,0,0,0.3))`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              top: 720,
              textAlign: "center",
              fontFamily: FONTE_TITULO,
              fontWeight: 800,
              fontSize: 100,
              lineHeight: 1,
              color: COR.marinho,
              opacity: 1 - sai,
              scale: String(nome),
            }}
          >
            {prod.nome}
          </div>
        </div>

        {/* preço com estouro amarelo */}
        <div
          style={{
            position: "absolute",
            right: -50,
            top: -80,
            width: 420,
            height: 420,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            scale: String(preco * pulso * (1 - sai)),
          }}
        >
          <div style={{ position: "absolute" }}>
            <Estouro size={420} />
          </div>
          <Preco preco={prod.preco} unidade={prod.unidade} size={150} style={{ position: "relative" }} />
        </div>
      </div>

      <Linha y={1440}>
        <div
          style={{
            fontFamily: FONTE_TEXTO,
            fontWeight: 700,
            fontSize: 42,
            color: COR.marinho,
            background: COR.branco,
            padding: "12px 36px",
            borderRadius: 40,
            scale: String(card),
            boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
          }}
        >
          Ofertas válidas para {VALIDADE}
        </div>
      </Linha>
      <Linha y={1590}>
        <Logo width={300} delay={6} />
      </Linha>
    </AbsoluteFill>
  );
};

// ================= 5. E TEM MAIS! (vermelho) =================
export const DUR_TEM_MAIS = 24;

export const TemMais: React.FC = () => (
  <AbsoluteFill>
    <Fundo tipo="vermelho" />
    <Linha y={840}>
      <Tag bg={COR.branco} cor={COR.vermelho} delay={0} size={170}>
        E TEM MAIS!
      </Tag>
    </Linha>
  </AbsoluteFill>
);

// ================= 6. GRADE + SACOLA + FINAL (azul) =================
export const DUR_FINAL = 550;

const MiniCard: React.FC<{ i: number; delay: number }> = ({ i, delay }) => {
  const p = usePop(delay, 11);
  const prod = PRODUTOS[i];
  return (
    <div
      style={{
        width: 420,
        height: 310,
        background: "#ffffff",
        borderRadius: 30,
        border: `8px solid ${COR.vermelho}`,
        position: "relative",
        scale: String(p),
        boxShadow: "0 12px 26px rgba(0,0,0,0.3)",
      }}
    >
      <Img
        src={staticFile(prod.imagem)}
        style={{ position: "absolute", left: 10, top: 40, width: 220, height: 220, objectFit: "contain" }}
      />
      <div
        style={{
          position: "absolute",
          right: 12,
          top: 24,
          width: 180,
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
      <div style={{ position: "absolute", right: 10, bottom: 16 }}>
        <Preco preco={prod.preco} unidade={prod.unidade} size={70} />
      </div>
    </div>
  );
};

const Sacola: React.FC = () => (
  <svg viewBox="0 0 400 460" style={{ width: "100%", overflow: "visible" }}>
    <path d="M120 120 Q120 20 200 20 Q280 20 280 120" stroke={COR.marinho} strokeWidth="18" fill="none" />
    <path d="M40 110 L360 110 L385 440 Q386 455 370 455 L30 455 Q14 455 15 440 Z" fill={COR.azul} stroke="#ffffff" strokeWidth="8" />
    <path d="M40 110 L360 110 L362 140 L38 140 Z" fill={COR.vermelho} />
    <circle cx="120" cy="125" r="8" fill={COR.marinho} />
    <circle cx="280" cy="125" r="8" fill={COR.marinho} />
  </svg>
);

export const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // tempos medidos na narração (cena começa em 36,0s)
  const T_ECONOMIZAR = 62; // "pra você economizar" 38,3s
  const T_SACOLA = 86; // "encher a sacola" 39,0s
  const T_GUARDA = 100;
  const T_LOGO = 138; // "Mariana Supermercado" 40,6s
  const T_SABOR = 182; // 42,1s
  const T_PERTINHO = 222; // 43,5s
  const T_WHATS = 268; // 45,0s
  const T_VALIDADE = 430; // 50,4s

  const sacolaP = spring({ frame: frame - T_SACOLA, fps, config: { damping: 13 } });
  const guarda = interpolate(frame, [T_GUARDA, T_GUARDA + 22], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.3, 1) });
  const sacolaSai = interpolate(frame, [T_LOGO - 14, T_LOGO], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.75, 0) });
  const balanco = Math.sin(frame / 7) * 6 * (1 - guarda * 0.6);

  return (
    <AbsoluteFill>
      <Fundo tipo="azul" />

      <Linha y={160}>
        <Palavras texto="são ofertas" delay={2} size={70} saida={T_ECONOMIZAR - 6} />
      </Linha>
      <Linha y={260}>
        <Tag bg={COR.vermelho} delay={10} size={130} saida={T_ECONOMIZAR - 6}>
          IMPERDÍVEIS
        </Tag>
      </Linha>
      <Linha y={160}>
        <Palavras texto="pra você" delay={T_ECONOMIZAR} size={70} saida={T_SACOLA - 8} />
      </Linha>
      <Linha y={260}>
        <Tag bg={COR.branco} cor={COR.marinho} delay={T_ECONOMIZAR + 8} size={130} saida={T_SACOLA - 8}>
          ECONOMIZAR
        </Tag>
      </Linha>
      <Linha y={160}>
        <Palavras texto="e encher a" delay={T_SACOLA} size={70} saida={T_LOGO - 14} />
      </Linha>
      <Linha y={260}>
        <Tag bg={COR.vermelho} delay={T_SACOLA + 8} size={140} saida={T_LOGO - 14}>
          SACOLA!
        </Tag>
      </Linha>

      {/* grade de produtos -> entra na sacola */}
      <Linha y={500}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "420px 420px",
            gap: 30,
            alignSelf: "flex-start",
            scale: String(interpolate(guarda, [0, 1], [1, 0.15])),
            translate: `0px ${interpolate(guarda, [0, 1], [0, 640])}px`,
            opacity: interpolate(guarda, [0.7, 1], [1, 0], clamp),
            transformOrigin: "top center",
          }}
        >
          {PRODUTOS.map((_, i) => (
            <MiniCard key={i} i={i} delay={14 + i * 5} />
          ))}
        </div>
      </Linha>

      {/* sacola */}
      <div
        style={{
          position: "absolute",
          left: 290,
          width: 500,
          top: interpolate(sacolaP, [0, 1], [1950, 1080]) + interpolate(sacolaSai, [0, 1], [0, 1000]),
          translate: `0px ${balanco}px`,
        }}
      >
        <Sacola />
        <div style={{ position: "absolute", left: 105, top: 230, width: 290 }}>
          <Logo width={290} delay={T_SACOLA} />
        </div>
      </div>

      {/* encerramento */}
      {frame >= T_LOGO ? (
        <>
          <Linha y={330}>
            <Logo width={760} delay={T_LOGO} />
          </Linha>
          <Linha y={900}>
            <Tag bg={COR.marinho} delay={T_SABOR} size={90}>
              Mais sabor e economia
            </Tag>
          </Linha>
          <Linha y={1040}>
            <Tag bg={COR.vermelho} delay={T_PERTINHO} size={90}>
              pertinho de você!
            </Tag>
          </Linha>
          <Linha y={1230}>
            <Palavras texto="Peça pelo WhatsApp" delay={T_WHATS} size={52} />
          </Linha>
          <Linha y={1310}>
            <Tag bg={COR.branco} cor={COR.marinho} delay={T_WHATS + 12} size={100}>
              {WHATSAPP}
            </Tag>
          </Linha>
          <Linha y={1510}>
            <Palavras texto="Ofertas válidas só para hoje" delay={T_VALIDADE} size={48} />
          </Linha>
          <Linha y={1590}>
            <Tag bg={COR.vermelho} delay={T_VALIDADE + 20} size={90}>
              {VALIDADE}
            </Tag>
          </Linha>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
