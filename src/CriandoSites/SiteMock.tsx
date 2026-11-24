import React from "react";
import { sans, serif } from "./theme";

/**
 * Site fictício da empresa sorteada (1440 px de largura, 4 seções de 900 px).
 * Troque por prints reais do site passando `prints` para a cena Vitrine.
 */
export const SECAO = 900;
const ouro = "#C9A45C";
const fundo = "#0C0C0C";

const Titulo: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 96,
}) => (
  <div
    style={{
      fontFamily: serif,
      fontStyle: "italic",
      fontSize: size,
      lineHeight: 0.95,
      color: "#fff",
      letterSpacing: "-0.02em",
    }}
  >
    {children}
  </div>
);

export const Nav: React.FC<{ nome: string }> = ({ nome }) => (
  <div
    style={{
      height: 84,
      padding: "0 64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "rgba(12,12,12,0.92)",
      borderBottom: "1px solid #222",
      fontFamily: sans,
      color: "#fff",
    }}
  >
    <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.08em" }}>
      {nome.toUpperCase()} <span style={{ color: ouro }}>✦</span>
    </div>
    <div style={{ display: "flex", gap: 36, fontSize: 18, color: "#bbb" }}>
      {["Início", "Serviços", "Planos", "Equipe", "Horários", "Contato"].map(
        (l) => (
          <span key={l}>{l}</span>
        ),
      )}
      <span
        style={{
          background: ouro,
          color: "#111",
          fontWeight: 700,
          padding: "10px 22px",
          borderRadius: 999,
          marginTop: -10,
        }}
      >
        Agendar
      </span>
    </div>
  </div>
);

export const WhatsApp: React.FC = () => (
  <div
    style={{
      width: 76,
      height: 76,
      borderRadius: 38,
      background: "#25D366",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 10px 30px rgba(37,211,102,0.45)",
    }}
  >
    <svg width="40" height="40" viewBox="0 0 24 24" fill="#fff">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2s-1 .2-3.4-.7a11.6 11.6 0 0 1-4.5-4 5.2 5.2 0 0 1-1.1-2.8 3 3 0 0 1 1-2.2.9.9 0 0 1 .7-.3h.5c.2 0 .4 0 .6.5l.9 2.1a.6.6 0 0 1 0 .5l-.3.5-.4.5c-.2.1-.3.3-.1.6a8 8 0 0 0 1.5 1.8 7.3 7.3 0 0 0 2.1 1.3c.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3a2.3 2.3 0 0 1-.3 1Z" />
    </svg>
  </div>
);

const Secao: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      height: SECAO,
      padding: "130px 110px 60px",
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden",
      fontFamily: sans,
      color: "#fff",
      ...style,
    }}
  >
    {children}
  </div>
);

export const SiteMock: React.FC<{ nome: string; cidade: string }> = ({
  nome,
  cidade,
}) => (
  <div style={{ width: 1440, background: fundo }}>
    {/* 1. Hero */}
    <Secao
      style={{
        background:
          "radial-gradient(circle at 78% 40%, #3b2c17 0%, #141009 45%, #0c0c0c 75%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 140,
          top: 200,
          width: 380,
          height: 520,
          borderRadius: 220,
          background:
            "repeating-linear-gradient(135deg,#b3202a 0 34px,#f4f4f4 34px 68px,#1e3a8a 68px 102px,#f4f4f4 102px 136px)",
          opacity: 0.85,
          boxShadow: "0 0 140px rgba(201,164,92,0.25)",
        }}
      />
      <div style={{ color: ouro, fontSize: 22, letterSpacing: "0.2em", fontWeight: 700 }}>
        BARBEARIA · {cidade.toUpperCase()}
      </div>
      <div style={{ marginTop: 24 }}>
        <Titulo size={150}>
          Corte na régua
          <br />
          por <span style={{ color: ouro }}>R$ 35</span>
        </Titulo>
      </div>
      <div style={{ fontSize: 26, color: "#aaa", marginTop: 30, maxWidth: 620 }}>
        Agende pelo celular em 30 segundos. Sem fila, sem espera.
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 44 }}>
        <span
          style={{
            background: ouro,
            color: "#111",
            fontWeight: 800,
            fontSize: 22,
            padding: "20px 36px",
            borderRadius: 999,
          }}
        >
          Agendar horário
        </span>
        <span
          style={{
            border: "1px solid #555",
            fontSize: 22,
            padding: "20px 36px",
            borderRadius: 999,
          }}
        >
          Ver serviços
        </span>
      </div>
    </Secao>

    {/* 2. Serviços */}
    <Secao>
      <Titulo>O que a gente faz</Titulo>
      <div style={{ marginTop: 50 }}>
        {[
          ["Corte masculino", "Tesoura ou máquina, do seu jeito", "R$ 35"],
          ["Barba completa", "Toalha quente e navalha", "R$ 30"],
          ["Corte + barba", "O combo mais pedido da casa", "R$ 55"],
          ["Pigmentação", "Disfarça falhas na barba e no cabelo", "R$ 40"],
          ["Sobrancelha", "Acabamento na navalha", "R$ 15"],
        ].map(([t, d, p], i) => (
          <div
            key={t}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 40,
              padding: "26px 0",
              borderBottom: "1px solid #262626",
            }}
          >
            <div style={{ color: ouro, fontSize: 34, width: 40, fontFamily: serif }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 30, fontWeight: 700 }}>{t}</div>
              <div style={{ fontSize: 20, color: "#888", marginTop: 4 }}>{d}</div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 700 }}>{p}</div>
          </div>
        ))}
      </div>
    </Secao>

    {/* 3. Planos */}
    <Secao style={{ textAlign: "center" }}>
      <Titulo>Clube {nome}</Titulo>
      <div style={{ fontSize: 24, color: "#999", marginTop: 16 }}>
        Assine e corte sempre que precisar.
      </div>
      <div
        style={{
          display: "flex",
          gap: 30,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 60,
        }}
      >
        {[
          ["Mensal", "89", "2 cortes por mês", false],
          ["Ilimitado", "129", "Cortes ilimitados", true],
          ["Corte + barba", "159", "Ilimitado + 4 barbas", false],
        ].map(([t, p, d, destaque]) => (
          <div
            key={t as string}
            style={{
              width: destaque ? 360 : 320,
              padding: destaque ? "52px 30px" : "40px 30px",
              borderRadius: 28,
              background: destaque
                ? `linear-gradient(160deg, ${ouro}, #8a6a2e)`
                : "#161616",
              color: destaque ? "#111" : "#fff",
              border: destaque ? "none" : "1px solid #2a2a2a",
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 700 }}>{t}</div>
            <div style={{ fontSize: 22, marginTop: 20, opacity: 0.7 }}>R$</div>
            <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 110, lineHeight: 1 }}>
              {p}
            </div>
            <div style={{ fontSize: 20, opacity: 0.75, marginTop: 6 }}>/mês</div>
            <div style={{ fontSize: 22, marginTop: 24 }}>{d}</div>
            <div
              style={{
                marginTop: 30,
                padding: "16px 0",
                borderRadius: 999,
                fontWeight: 800,
                fontSize: 20,
                background: destaque ? "#111" : "#fff",
                color: destaque ? "#fff" : "#111",
              }}
            >
              Quero esse plano
            </div>
          </div>
        ))}
      </div>
    </Secao>

    {/* 4. Localização */}
    <Secao style={{ display: "flex", gap: 70 }}>
      <div style={{ width: 460 }}>
        <Titulo>Onde estamos</Titulo>
        <div style={{ marginTop: 44, fontSize: 24 }}>
          {[
            ["Seg a Sex", "9h às 20h"],
            ["Sábado", "8h às 18h"],
            ["Domingo", "Fechado"],
          ].map(([d, h]) => (
            <div
              key={d}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "18px 0",
                borderBottom: "1px solid #262626",
              }}
            >
              <span style={{ color: "#999" }}>{d}</span>
              <span>{h}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, fontSize: 22, color: "#999", lineHeight: 1.5 }}>
          Rua das Palmeiras, 120 — Centro
          <br />
          {cidade}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          height: 640,
          borderRadius: 28,
          background: "#ececec",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {[120, 300, 470].map((y) => (
          <div key={y} style={{ position: "absolute", left: 0, right: 0, top: y, height: 26, background: "#fff" }} />
        ))}
        {[160, 420, 640].map((x) => (
          <div key={x} style={{ position: "absolute", top: 0, bottom: 0, left: x, width: 26, background: "#fff" }} />
        ))}
        <div
          style={{
            position: "absolute",
            left: 400,
            top: 250,
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#222",
            fontWeight: 700,
            fontSize: 22,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50% 50% 50% 0",
              rotate: "-45deg",
              background: "#d93025",
              border: "6px solid #fff",
              boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
            }}
          />
          {nome.toUpperCase()}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            translate: "-50% 0",
            background: "#111",
            color: "#fff",
            padding: "14px 26px",
            borderRadius: 999,
            fontSize: 20,
          }}
        >
          Toque para abrir no mapa
        </div>
      </div>
    </Secao>
  </div>
);
