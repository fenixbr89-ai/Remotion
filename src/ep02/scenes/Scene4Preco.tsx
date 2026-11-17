import React from "react";
import { useCurrentFrame } from "remotion";
import { enterStyle, ip } from "../anim";
import { C, CARD_W, CARD_X, FONT, NUMBERS, s, SCENES, T, TYPED } from "../constants";
import { Caption } from "../components/Caption";
import { Card } from "../components/Card";
import { Cursor } from "../components/Cursor";
import { Icon3D, LineIcon, Logo } from "../components/Icons";
import { SceneShell } from "../components/SceneShell";
import { SlotNumber, slotEnd } from "../components/SlotNumber";

const L = (sec: number) => s(sec) - SCENES.s4.from;

// geometria do card de chat (coordenadas do quadro 1080×1920)
const CARD_TOP = 250;
const CARD_H = 1010;
const PAD = 34;
const SEND = 100;
export const SEND_X = CARD_X + CARD_W - PAD - SEND / 2;
export const SEND_Y = CARD_TOP + CARD_H - PAD - SEND / 2;

export const S4 = {
  typeStart: L(T.s4TypeStart),
  typeEnd: L(T.s4TypeEnd),
  click: L(T.s4Click),
  answer: L(T.s4Answer),
  balcao: L(T.s4Answer) + 10,
  ifood: L(T.s4Answer) + 20,
};
export const S4_PUNCH = slotEnd(NUMBERS.ifood, S4.ifood);

const Dots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {[0, 1, 2].map((i) => {
        const ph = Math.sin((frame - i * 4) * 0.35);
        return (
          <div
            key={i}
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: C.blue,
              opacity: 0.35 + 0.65 * Math.max(0, ph),
              translate: `0px ${-Math.max(0, ph) * 10}px`,
            }}
          />
        );
      })}
    </div>
  );
};

export const Scene4Preco: React.FC = () => {
  const frame = useCurrentFrame();
  const sent = frame >= S4.click + 2;
  const typedCount = Math.floor(
    ip(frame, [S4.typeStart, S4.typeEnd], [0, TYPED.length]),
  );
  const typed = sent ? "" : TYPED.slice(0, typedCount);
  const caretOn = Math.floor(frame / 8) % 2 === 0 || (frame >= S4.typeStart && frame < S4.typeEnd);
  const thinking = sent && frame < S4.answer;
  const status = thinking ? "Calculando…" : "Online";
  const sendPress = ip(frame, [S4.click - 2, S4.click], [0, 1]) - ip(frame, [S4.click + 1, S4.click + 8], [0, 1]);

  return (
    <SceneShell bg={C.bgBlue} enter={false} punches={[S4_PUNCH]}>
      <div style={{ position: "absolute", inset: 0, fontFamily: FONT.sans }}>
        <Card start={L(T.s4Card)} top={CARD_TOP} height={CARD_H} padding={0}>
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* cabeçalho */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "34px 40px",
                borderBottom: "2px solid #EDF1F7",
              }}
            >
              <div
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: "50%",
                  background: C.gradientDiag,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 24px rgba(29,78,216,.28)",
                }}
              >
                <Logo size={54} white />
              </div>
              <div>
                <div style={{ fontSize: 42, fontWeight: 800, color: C.navy, letterSpacing: "-1px" }}>
                  Preço Certo
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: thinking ? C.sky : C.blue,
                      opacity: thinking ? 0.5 + 0.5 * Math.abs(Math.sin(frame * 0.2)) : 1,
                    }}
                  />
                  <span style={{ fontSize: 30, fontWeight: 500, color: thinking ? C.blue : C.gray }}>
                    {status}
                  </span>
                </div>
              </div>
            </div>

            {/* mensagens */}
            <div
              style={{
                flex: 1,
                padding: "36px 40px",
                display: "flex",
                flexDirection: "column",
                gap: 28,
              }}
            >
              {sent ? (
                <div
                  style={{
                    alignSelf: "flex-end",
                    maxWidth: 600,
                    padding: "26px 34px",
                    background: C.gradient,
                    color: "#fff",
                    fontSize: 36,
                    fontWeight: 600,
                    lineHeight: 1.3,
                    borderRadius: "36px 36px 10px 36px",
                    boxShadow: "0 14px 30px rgba(29,78,216,.25)",
                    transformOrigin: "100% 100%",
                    ...enterStyle(frame, S4.click + 2, { dy: 30, scaleFrom: 0.6, damping: 12 }),
                  }}
                >
                  {TYPED}
                </div>
              ) : null}

              {thinking && frame >= S4.click + 8 ? (
                <div
                  style={{
                    alignSelf: "flex-start",
                    padding: "28px 34px",
                    background: C.soft,
                    borderRadius: "36px 36px 36px 10px",
                    ...enterStyle(frame, S4.click + 8, { dy: 20, scaleFrom: 0.7 }),
                  }}
                >
                  <Dots />
                </div>
              ) : null}

              {frame >= S4.answer ? (
                <div
                  style={{
                    alignSelf: "flex-start",
                    width: 600,
                    padding: "30px 36px",
                    background: C.soft,
                    borderRadius: "36px 36px 36px 10px",
                    transformOrigin: "0% 100%",
                    ...enterStyle(frame, S4.answer, { dy: 30, scaleFrom: 0.7, damping: 12 }),
                  }}
                >
                  <div style={{ fontSize: 30, fontWeight: 500, color: C.gray }}>Preço certo pra sua marmita:</div>
                  {[
                    { label: "Balcão", value: NUMBERS.balcao, at: S4.balcao, icon: <Icon3D src="3d/fork_and_knife_with_plate.png" size={56} /> },
                    { label: "iFood", value: NUMBERS.ifood, at: S4.ifood, icon: <Icon3D src="3d/motor_scooter.png" size={56} /> },
                  ].map((r) => (
                    <div
                      key={r.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 18,
                        padding: "14px 22px",
                        background: "#fff",
                        borderRadius: 26,
                        ...enterStyle(frame, r.at - 4, { dy: 16 }),
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {r.icon}
                        <span style={{ fontSize: 40, fontWeight: 700, color: C.navy }}>{r.label}</span>
                      </div>
                      <SlotNumber value={r.value} start={r.at} fontSize={60} color={C.blue} />
                    </div>
                  ))}
                  <div style={{ fontSize: 26, fontWeight: 500, color: C.gray, marginTop: 16 }}>
                    No iFood já inclui a taxa do app.
                  </div>
                </div>
              ) : null}
            </div>

            {/* campo de texto */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: PAD }}>
              <div
                style={{
                  flex: 1,
                  height: SEND,
                  borderRadius: SEND / 2,
                  background: "#F2F5FA",
                  border: "2px solid #E3E9F2",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 32px",
                  fontSize: 33,
                  fontWeight: 500,
                  color: typed ? C.navy : C.gray,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                <span>{typed || (frame < S4.typeStart || sent ? "Escreva sua mensagem…" : "")}</span>
                {!sent && frame >= S4.typeStart - 6 ? (
                  <span
                    style={{
                      width: 3,
                      height: 42,
                      marginLeft: 3,
                      background: C.blue,
                      opacity: caretOn ? 1 : 0,
                    }}
                  />
                ) : null}
              </div>
              <div
                style={{
                  width: SEND,
                  height: SEND,
                  borderRadius: "50%",
                  background: C.gradientDiag,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 12px 26px rgba(29,78,216,.32)",
                  scale: String(1 - sendPress * 0.12),
                  flexShrink: 0,
                }}
              >
                <LineIcon name="send" size={46} color="#fff" />
              </div>
            </div>
          </div>
        </Card>

        <Cursor
          keys={[
            { f: L(T.s4CursorIn), x: 700, y: 1440 },
            { f: S4.click - 3, x: SEND_X, y: SEND_Y },
            { f: S4.click + 26, x: SEND_X - 90, y: SEND_Y + 130 },
          ]}
          clicks={[S4.click]}
          hideAt={S4.click + 22}
        />

        <Caption
          start={L(T.s4Caption)}
          line1="O sistema calcula"
          line2={[{ text: "o preço" }, { text: "certo.", accent: true }]}
        />
      </div>
    </SceneShell>
  );
};

// usado para posicionar sons
export const S4_TYPE_FRAMES = { start: S4.typeStart, end: S4.typeEnd };
