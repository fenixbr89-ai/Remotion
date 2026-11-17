import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COR, FONTE_TEXTO, FONTE_TITULO, PRODUTOS, VALIDADE } from "./config";
import { Folhas, Fundo, LogoCard, Palavras, Preco, Selo, Tag, useOut, usePop } from "./ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.65, 0, 0.35, 1);

// Linha centralizada em uma altura fixa
const Linha: React.FC<{ y: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  y,
  children,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: y,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

// Selo que entra grande no centro e depois sobe pequeno para o topo
const SeloQueSobe: React.FC<{ entra: number; sobe: number; yCentro?: number; saida?: number }> = ({
  entra,
  sobe,
  yCentro = 560,
  saida,
}) => {
  const frame = useCurrentFrame();
  const p = usePop(entra, 10);
  const o = useOut(saida ?? 99999);
  const t = interpolate(frame, [sobe, sobe + 14], [0, 1], { ...clamp, easing: suave });
  return (
    <Linha y={interpolate(t, [0, 1], [yCentro, 70])}>
      <div style={{ scale: String(p * o * interpolate(t, [0, 1], [1, 0.42])), transformOrigin: "top center" }}>
        <Selo width={760} />
      </div>
    </Linha>
  );
};

// ================= 1. ABERTURA (verde) =================
export const Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const sai = 150;
  return (
    <AbsoluteFill>
      <Fundo tipo="verde" />
      <Folhas delay={4} />
      <SeloQueSobe entra={14} sobe={50} yCentro={620} />
      <Linha y={650}>
        <Palavras texto="é dia de aproveitar" delay={66} size={66} saida={sai} />
      </Linha>
      <Linha y={780}>
        <Tag bg={COR.laranja} cor={COR.verdeEscuro} delay={92} size={150} saida={sai}>
          OFERTAS
        </Tag>
      </Linha>
      <Linha y={980}>
        <Tag bg={COR.verdeEscuro} delay={110} size={130} rot={4} saida={sai + 3}>
          ESPECIAIS!
        </Tag>
      </Linha>
      {frame > sai ? (
        <Linha y={910}>
          <LogoCard delay={sai + 6} width={600} />
        </Linha>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 2. VOCÊ ENCONTRA (creme) =================
const ItemLista: React.FC<{ y: number; delay: number; texto: string; bg: string; img: string; lado: number }> = ({
  y,
  delay,
  texto,
  bg,
  img,
  lado,
}) => {
  const p = usePop(delay + 6, 12);
  return (
    <Linha y={y} style={{ gap: 30 }}>
      <Tag bg={bg} delay={delay} size={100} rot={-4 + lado * 2}>
        {texto}
      </Tag>
      <Img
        src={staticFile(img)}
        style={{
          width: 230,
          scale: String(p),
          rotate: `${(1 - p) * 40}deg`,
          filter: "drop-shadow(0 12px 14px rgba(0,0,0,0.3))",
        }}
      />
    </Linha>
  );
};

export const VoceEncontra: React.FC = () => {
  return (
    <AbsoluteFill>
      <Fundo tipo="creme" />
      <Folhas delay={0} claro />
      <Linha y={380}>
        <Palavras texto="Na nossa" delay={4} cor={COR.verdeEscuro} size={70} saida={58} />
      </Linha>
      <SeloQueSobe entra={12} sobe={58} yCentro={530} />
      <Linha y={510}>
        <Palavras texto="você encontra" delay={70} cor={COR.verdeEscuro} size={70} />
      </Linha>
      <ItemLista y={660} delay={86} texto="PERNIL" bg={COR.laranja} img="pernil-com-osso.png" lado={0} />
      <ItemLista y={940} delay={100} texto="COSTELINHA" bg={COR.verde} img="costelinha.png" lado={1} />
      <ItemLista y={1220} delay={114} texto="LOMBO" bg={COR.verde} img="lombo.png" lado={0} />
      <Linha y={1500}>
        <Tag bg={COR.verdeEscuro} delay={132} size={80} rot={-5}>
          fresquinhos!
        </Tag>
      </Linha>
    </AbsoluteFill>
  );
};

// ================= 3. SABOR, QUALIDADE E ECONOMIA (verde) =================
export const ParaLevarMais: React.FC = () => {
  const frame = useCurrentFrame();
  const espiada = interpolate(frame, [0, 20], [400, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return (
    <AbsoluteFill>
      <Fundo tipo="verde" />
      <Img
        src={staticFile("costelinha.png")}
        style={{
          position: "absolute",
          width: 520,
          left: -120,
          bottom: -60,
          rotate: "18deg",
          translate: `${-espiada}px ${espiada}px`,
          filter: "drop-shadow(0 16px 20px rgba(0,0,0,0.35))",
        }}
      />
      <Linha y={370}>
        <Palavras texto="para levar mais" delay={4} size={70} />
      </Linha>
      <Linha y={500}>
        <Tag bg={COR.laranja} cor={COR.verdeEscuro} delay={18} size={140}>
          SABOR,
        </Tag>
      </Linha>
      <Linha y={700}>
        <Tag bg={COR.branco} cor={COR.verdeEscuro} delay={30} size={130} rot={2}>
          QUALIDADE
        </Tag>
      </Linha>
      <Linha y={880}>
        <Palavras texto="e" delay={40} size={70} />
      </Linha>
      <Linha y={990}>
        <Tag bg={COR.verdeEscuro} delay={46} size={140} rot={3}>
          ECONOMIA
        </Tag>
      </Linha>
      <Linha y={1200}>
        <Tag bg={COR.laranja} cor={COR.verdeEscuro} delay={62} size={70} rot={-4}>
          para a sua mesa!
        </Tag>
      </Linha>
    </AbsoluteFill>
  );
};

// ================= 4. CONFIRA OS PREÇOS (laranja) =================
const Etiqueta: React.FC<{ delay: number; saida?: number }> = ({ delay, saida }) => {
  const frame = useCurrentFrame();
  const p = usePop(delay, 9);
  const o = useOut(saida ?? 99999);
  const balanco = Math.sin((frame - delay) / 6) * 8 * Math.max(0, 1 - (frame - delay) / 60);
  return (
    <svg
      viewBox="0 0 200 300"
      style={{
        width: 260,
        scale: String(p * o),
        rotate: `${balanco}deg`,
        transformOrigin: "50% 5%",
        filter: "drop-shadow(0 14px 16px rgba(0,0,0,0.3))",
      }}
    >
      <path d="M100 0 L100 40" stroke={COR.verdeEscuro} strokeWidth="6" />
      <path d="M40 80 L100 40 L160 80 L160 280 Q160 295 145 295 L55 295 Q40 295 40 280 Z" fill={COR.verdeEscuro} />
      <path d="M52 88 L100 56 L148 88 L148 274 Q148 283 139 283 L61 283 Q52 283 52 274 Z" fill="none" stroke="#2f8f40" strokeWidth="4" strokeDasharray="10 8" />
      <circle cx="100" cy="85" r="12" fill={COR.laranja} />
      <text x="100" y="230" textAnchor="middle" fontSize="130" fontWeight="800" fill={COR.verde} fontFamily={FONTE_TITULO}>
        $
      </text>
    </svg>
  );
};

export const ConfiraPrecos: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fundo tipo="laranja" />
      {/* parte 1 */}
      <Linha y={330}>
        <Palavras texto="Confira" delay={4} cor={COR.verdeEscuro} size={70} saida={66} />
      </Linha>
      <Linha y={450}>
        <Tag bg={COR.verde} delay={14} size={130} saida={66}>
          OS PREÇOS
        </Tag>
      </Linha>
      <Linha y={630}>
        <Tag bg={COR.verdeEscuro} delay={26} size={120} rot={3} saida={68}>
          DO DIA!
        </Tag>
      </Linha>
      {/* etiqueta $ fica nas partes 1 e 2 */}
      <Linha y={interpolate(frame, [64, 80], [880, 720], { ...clamp, easing: suave })}>
        <Etiqueta delay={32} saida={116} />
      </Linha>
      {/* parte 2 */}
      <Linha y={380}>
        <Palavras texto="aproveite as" delay={72} cor={COR.verdeEscuro} size={70} saida={116} />
      </Linha>
      <Linha y={500}>
        <Tag bg={COR.verde} delay={82} size={140} saida={116}>
          OFERTAS!
        </Tag>
      </Linha>
      {/* parte 3 */}
      <Linha y={500}>
        <Palavras texto="e venha para o" delay={124} cor={COR.verdeEscuro} size={70} />
      </Linha>
      {frame > 120 ? (
        <Linha y={660}>
          <LogoCard delay={138} width={600} />
        </Linha>
      ) : null}
      <Linha y={1220}>
        <Tag bg={COR.verdeEscuro} delay={150} size={48} rot={-3} style={{ fontFamily: FONTE_TEXTO, fontWeight: 700 }}>
          {VALIDADE}
        </Tag>
      </Linha>
    </AbsoluteFill>
  );
};

// ================= 5. PRODUTOS um a um (verde) =================
export const POR_PRODUTO = 46;

export const Produtos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entradaCard = spring({ frame, fps, config: { damping: 13 } });
  const idx = Math.min(PRODUTOS.length - 1, Math.floor(frame / POR_PRODUTO));
  const local = frame - idx * POR_PRODUTO;
  const prod = PRODUTOS[idx];

  // troca de produto: entra girando/escalando, sai com blur
  const entra = spring({ frame: local - 2, fps, config: { damping: 12 } });
  const ultimo = idx === PRODUTOS.length - 1;
  const sai = ultimo ? 0 : interpolate(local, [POR_PRODUTO - 7, POR_PRODUTO], [0, 1], clamp);
  const precoP = spring({ frame: local - 12, fps, config: { damping: 9 } });
  const nomeP = spring({ frame: local - 6, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill>
      <Fundo tipo="verde" />
      <Folhas delay={0} />
      <Linha y={60}>
        <div style={{ scale: String(entradaCard) }}>
          <Selo width={330} />
        </div>
      </Linha>
      {/* cartão do produto */}
      <Linha y={410}>
        <div
          style={{
            width: 860,
            height: 960,
            background: COR.laranja,
            borderRadius: 60,
            padding: 22,
            scale: String(entradaCard),
            rotate: `${(1 - entradaCard) * 12 - 2}deg`,
            boxShadow: "0 18px 0 rgba(0,0,0,0.12), 0 30px 60px rgba(0,0,0,0.35)",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 44,
              background: `radial-gradient(circle at 50% 40%, #ffffff 0%, ${COR.creme} 70%, #e5e1d8 100%)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* sombra elíptica verde */}
            <div
              style={{
                position: "absolute",
                left: 170,
                right: 170,
                top: 640,
                height: 90,
                borderRadius: "50%",
                background: COR.verdeEscuro,
                scale: `${entra * (1 - sai)}`,
              }}
            />
            <Img
              src={staticFile(prod.imagem)}
              style={{
                position: "absolute",
                left: "50%",
                top: 400,
                width: 620,
                maxHeight: 560,
                objectFit: "contain",
                translate: "-50% -50%",
                scale: String(entra * (1 + sai * 0.4)),
                rotate: `${(1 - entra) * -25}deg`,
                opacity: 1 - sai,
                filter: `blur(${sai * 18}px) drop-shadow(0 16px 18px rgba(0,0,0,0.3))`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 720,
                textAlign: "center",
                fontFamily: FONTE_TITULO,
                fontWeight: 800,
                fontSize: 110,
                color: COR.verdeEscuro,
                rotate: "-3deg",
                scale: String(nomeP * (1 - sai)),
                WebkitTextStroke: "3px white",
              }}
            >
              {prod.nome}
            </div>
          </div>
          {/* preço */}
          <div style={{ position: "absolute", right: -30, top: -40, scale: String(precoP * (1 - sai)), rotate: "4deg" }}>
            <Preco preco={prod.preco} unidade={prod.unidade} size={170} />
          </div>
        </div>
      </Linha>
      <Linha y={1440}>
        <div
          style={{
            fontFamily: FONTE_TEXTO,
            fontWeight: 700,
            fontSize: 46,
            color: COR.verdeEscuro,
            background: COR.laranja,
            padding: "10px 34px",
            borderRadius: 40,
            rotate: "-3deg",
            scale: String(entradaCard),
          }}
        >
          {VALIDADE}
        </div>
      </Linha>
    </AbsoluteFill>
  );
};

// ================= 6. E TEM MAIS! =================
export const TemMais: React.FC = () => {
  return (
    <AbsoluteFill>
      <Fundo tipo="verde" />
      <Linha y={830}>
        <Tag bg={COR.laranja} cor={COR.verdeEscuro} delay={2} size={150} rot={-5} saida={40}>
          E TEM MAIS!
        </Tag>
      </Linha>
    </AbsoluteFill>
  );
};

// ================= 7. GRADE + SACOLA + FINAL =================
const MiniCard: React.FC<{ i: number; delay: number }> = ({ i, delay }) => {
  const p = usePop(delay, 11);
  const prod = PRODUTOS[i];
  return (
    <div
      style={{
        width: 400,
        height: 300,
        background: COR.creme,
        borderRadius: 30,
        border: `8px solid ${COR.laranja}`,
        position: "relative",
        scale: String(p),
        rotate: `${(i % 2 === 0 ? -2 : 2) + (1 - p) * 15}deg`,
        boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
      }}
    >
      <Img
        src={staticFile(prod.imagem)}
        style={{ position: "absolute", left: 10, top: 40, width: 200, height: 200, objectFit: "contain" }}
      />
      <div
        style={{
          position: "absolute",
          right: 16,
          top: 20,
          width: 175,
          textAlign: "center",
          fontFamily: FONTE_TITULO,
          fontWeight: 800,
          fontSize: 40,
          lineHeight: 1,
          color: COR.verdeEscuro,
        }}
      >
        {prod.nome}
      </div>
      <div style={{ position: "absolute", right: 12, bottom: 18 }}>
        <Preco preco={prod.preco} unidade={prod.unidade} size={70} style={{ border: "3px solid white" }} />
      </div>
    </div>
  );
};

const Sacola: React.FC = () => (
  <svg viewBox="0 0 400 460" style={{ width: "100%", overflow: "visible" }}>
    <path d="M120 120 Q120 20 200 20 Q280 20 280 120" stroke={COR.verdeEscuro} strokeWidth="18" fill="none" />
    <path d="M40 110 L360 110 L385 440 Q386 455 370 455 L30 455 Q14 455 15 440 Z" fill="#ffffff" />
    <path d="M40 110 L360 110 L362 140 L38 140 Z" fill={COR.laranja} />
    <circle cx="120" cy="125" r="8" fill={COR.verdeEscuro} />
    <circle cx="280" cy="125" r="8" fill={COR.verdeEscuro} />
  </svg>
);

export const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // tempos (relativos à cena)
  const T_ECONOMIZAR = 64;
  const T_SACOLA = 130;
  const T_GUARDA = 160;
  const T_LOGO = 215;

  const sacolaP = spring({ frame: frame - T_SACOLA, fps, config: { damping: 13 } });
  const guarda = interpolate(frame, [T_GUARDA, T_GUARDA + 22], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.3, 1) });
  const sacolaSai = interpolate(frame, [T_LOGO - 14, T_LOGO], [0, 1], { ...clamp, easing: Easing.bezier(0.5, 0, 0.75, 0) });

  return (
    <AbsoluteFill>
      <Fundo tipo="verde" />
      {frame >= T_LOGO - 4 ? <Folhas delay={T_LOGO - 4} /> : null}

      {/* textos de cima */}
      <Linha y={170}>
        <Palavras texto="são ofertas" delay={2} size={66} saida={T_ECONOMIZAR - 6} />
      </Linha>
      <Linha y={270}>
        <Tag bg={COR.laranja} cor={COR.verdeEscuro} delay={10} size={120} saida={T_ECONOMIZAR - 6}>
          IMPERDÍVEIS
        </Tag>
      </Linha>
      <Linha y={170}>
        <Palavras texto="pra você" delay={T_ECONOMIZAR} size={66} saida={T_SACOLA - 8} />
      </Linha>
      <Linha y={270}>
        <Tag bg={COR.branco} cor={COR.verdeEscuro} delay={T_ECONOMIZAR + 8} size={120} saida={T_SACOLA - 8}>
          ECONOMIZAR
        </Tag>
      </Linha>
      <Linha y={170}>
        <Palavras texto="e encher a" delay={T_SACOLA} size={66} saida={T_LOGO - 14} />
      </Linha>
      <Linha y={270}>
        <Tag bg={COR.laranja} cor={COR.verdeEscuro} delay={T_SACOLA + 8} size={130} saida={T_LOGO - 14}>
          SACOLA!
        </Tag>
      </Linha>

      {/* grade de produtos -> entra na sacola */}
      <Linha y={500}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "400px 400px",
            gap: 30,
            scale: String(interpolate(guarda, [0, 1], [1, 0.15])),
            translate: `0px ${interpolate(guarda, [0, 1], [0, 620])}px`,
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
          rotate: `${Math.sin(frame / 7) * 2 * (1 - guarda * 0.5)}deg`,
        }}
      >
        <Sacola />
        <div style={{ position: "absolute", left: 95, top: 220, width: 310 }}>
          <LogoCard delay={T_SACOLA} width={310} />
        </div>
      </div>

      {/* encerramento */}
      {frame >= T_LOGO ? (
        <>
          <Linha y={500}>
            <LogoCard delay={T_LOGO} width={680} />
          </Linha>
          <Linha y={1080}>
            <Tag bg={COR.verdeEscuro} delay={T_LOGO + 18} size={90} rot={-4}>
              Mais sabor e economia
            </Tag>
          </Linha>
          <Linha y={1250}>
            <Tag bg={COR.laranja} cor={COR.verdeEscuro} delay={T_LOGO + 32} size={80} rot={3}>
              pertinho de você!
            </Tag>
          </Linha>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
