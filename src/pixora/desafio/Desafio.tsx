import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { easeOut, enterStyle, ip, rand } from "../anim";
import { Caption } from "../components/Caption";
import { Card, CardTitle } from "../components/Card";
import { Check, CheckRow } from "../components/CheckRow";
import { Cursor } from "../components/Cursor";
import { Icon3D, LineIcon, Logo } from "../components/Icons";
import { ProgressBar } from "../components/ProgressBar";
import { SceneShell } from "../components/SceneShell";
import { SlotNumber, slotEnd } from "../components/SlotNumber";
import { C, CARD_X, FONT } from "../constants";
import { brl, conta, DADOS } from "./numeros";

/**
 * "Desafio: marmita a R$ 18,90 no iFood" — estilo Pixora nas cores do Preço Certo.
 * 42 s, 1080×1920, 30 fps. Frames das cenas em CENAS (absolutos).
 */
export const CENAS = {
  gancho: [0, 120],
  quiz: [120, 270],
  custo: [270, 510],
  resposta: [510, 720],
  chat: [720, 960],
  mes: [960, 1110],
  cta: [1110, 1260],
} as const;
export const DURACAO_DESAFIO = 1260;

const k = conta();
const VERMELHO = "#E5383B";
const VERDE = "#16A34A";
const MENOS = "−";

const Valor: React.FC<{ v: string; c?: string }> = ({ v, c = C.navy }) => <span style={{ color: c, fontWeight: 800 }}>{v}</span>;

/* 1 · Gancho: chega um pedido de marmita a R$ 18,90 */
const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const fimPreco = slotEnd(brl(DADOS.precoApp), 10);
  return (
    <SceneShell enter={false} punches={[fimPreco]}>
      <Card start={-6} top={560} padding={48}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: C.gradientDiag, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LineIcon name="bike" size={38} color="#FFFFFF" />
          </div>
          <div style={{ flex: 1, fontSize: 40, fontWeight: 800, color: C.navy }}>Novo pedido!</div>
          <div style={{ fontSize: 30, fontWeight: 500, color: C.gray }}>agora</div>
        </div>
        <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ width: 200, height: 200, borderRadius: 40, background: C.soft, display: "flex", alignItems: "center", justifyContent: "center", ...enterStyle(f, -6, { scaleFrom: 0.5, damping: 10 }) }}>
            <Icon3D src="3d/fork_and_knife_with_plate.png" size={150} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: C.navy, lineHeight: 1.15 }}>1× Marmita de bife acebolado</div>
            <SlotNumber value={brl(DADOS.precoApp)} start={10} fontSize={96} style={{ marginTop: 8 }} />
          </div>
        </div>
      </Card>
      <Caption line1="Marmita a R$ 18,90 no iFood." line2={[{ text: "Quanto" }, { text: "sobra?", accent: true }]} start={14} />
    </SceneShell>
  );
};

/* 2 · Quiz: A, B ou C */
const OPCOES = [
  { l: "A", v: "R$ 8,00" },
  { l: "B", v: "R$ 4,50" },
  { l: "C", v: brl(k.sobraApp) },
];
const Quiz: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = 50;
  const t1 = 140;
  const resto = Math.max(0, Math.ceil(3 - ip(f, [t0, t1], [0, 3])));
  return (
    <SceneShell>
      <div style={{ position: "absolute", top: 360, left: 0, right: 0, display: "flex", justifyContent: "center", ...enterStyle(f, 2) }}>
        <div style={{ padding: "14px 34px", borderRadius: 999, background: C.white, boxShadow: C.shadowSm, fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, letterSpacing: 4, color: C.gray }}>PAUSA E CHUTA</div>
      </div>
      {OPCOES.map((o, i) => (
        <div key={o.l} style={{ position: "absolute", left: CARD_X, width: 840, top: 480 + i * 200, height: 170, borderRadius: 44, background: C.white, boxShadow: C.shadow, display: "flex", alignItems: "center", gap: 36, padding: "0 50px", boxSizing: "border-box", fontFamily: FONT.sans, ...enterStyle(f, 8 + i * 7, { dy: 50, scaleFrom: 0.9 }) }}>
          <div style={{ width: 96, height: 96, borderRadius: 48, background: C.gradientDiag, color: "#fff", fontSize: 52, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{o.l}</div>
          <div style={{ flex: 1, textAlign: "center", fontSize: 80, fontWeight: 800, color: C.navy, letterSpacing: -2, marginRight: 96 }}>{o.v}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: CARD_X + 120, width: 600, top: 1120, fontFamily: FONT.sans, ...enterStyle(f, t0 - 6, { dy: 20 }) }}>
        <div style={{ textAlign: "center", fontSize: 34, fontWeight: 700, color: C.navy, marginBottom: 14 }}>Comenta sua resposta · {resto > 0 ? resto : "já!"}</div>
        <div style={{ height: 18, borderRadius: 9, background: C.soft, overflow: "hidden" }}>
          <div style={{ width: `${(1 - ip(f, [t0, t1], [0, 1])) * 100}%`, height: "100%", background: C.gradient, borderRadius: 9 }} />
        </div>
      </div>
      <Caption line1="Pausa o vídeo e chuta:" line2={[{ text: "A, B ou" }, { text: "C?", accent: true }]} start={6} />
    </SceneShell>
  );
};

/* 3 · Custo de verdade */
const Custo: React.FC = () => {
  const passo = 16;
  const t0 = 20;
  const tTotal = t0 + DADOS.itens.length * passo + 12;
  const valorTotal = brl(k.custo);
  return (
    <SceneShell punches={[slotEnd(valorTotal, tTotal)]}>
      <Card start={0} top={300} padding={46}>
        <CardTitle icon={<LineIcon name="soup" size={40} />}>CUSTO DE 1 MARMITA</CardTitle>
        <div style={{ marginTop: 18 }}>
          {DADOS.itens.map((it, i) => (
            <CheckRow
              key={it.nome}
              start={t0 + i * passo}
              height={88}
              icon={it.img ? <Icon3D src={it.img} size={52} /> : <LineIcon name={it.icone ?? "package"} size={42} />}
              label={it.nome}
              value={brl(it.custo)}
            />
          ))}
        </div>
        <div style={{ height: 2, background: C.soft, margin: "18px 0" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 40, fontWeight: 700, color: C.gray }}>Custo total</span>
          <SlotNumber value={valorTotal} start={tTotal} fontSize={92} />
        </div>
      </Card>
      <Caption line1="Primeiro, o custo" line2={[{ text: "de" }, { text: "verdade.", accent: true }]} start={8} />
    </SceneShell>
  );
};

/* 4 · Resposta: sobram 30 centavos */
const Resposta: React.FC = () => {
  const f = useCurrentFrame();
  const tSobra = 104;
  const sobra = brl(k.sobraApp);
  const linhas = [
    { r: "Vendeu no app", v: brl(DADOS.precoApp), c: C.navy, t: 14 },
    { r: "Custo da marmita", v: `${MENOS} ${brl(k.custo)}`, c: VERMELHO, t: 26 },
    { r: `Taxa do app (${Math.round(DADOS.taxaIfood * 100)}%)`, v: `${MENOS} ${brl(k.taxaApp)}`, c: VERMELHO, t: 38 },
  ];
  return (
    <SceneShell punches={[slotEnd(sobra, tSobra)]}>
      <Card start={0} top={300} padding={46}>
        <CardTitle icon={<LineIcon name="bike" size={40} />}>CADA MARMITA NO IFOOD</CardTitle>
        <div style={{ marginTop: 18 }}>
          {linhas.map((l) => (
            <CheckRow key={l.r} start={l.t} showCheck={false} height={86} label={l.r} value={<Valor v={l.v} c={l.c} />} />
          ))}
        </div>
        <div style={{ marginTop: 22 }}>
          <ProgressBar start={56} end={98} />
        </div>
        <div style={{ marginTop: 30, height: 190, borderRadius: 32, background: "#FDECEC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ...enterStyle(f, tSobra - 4, { dy: 30, scaleFrom: 0.9 }) }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: C.navy }}>Sobra</span>
          <SlotNumber value={sobra} start={tSobra} fontSize={104} color={VERMELHO} />
        </div>
      </Card>
      <div style={{ position: "absolute", top: 1220, left: 0, right: 0, display: "flex", justifyContent: "center", ...enterStyle(f, 140, { dy: 20, scaleFrom: 0.8, damping: 10 }) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 34px", borderRadius: 999, background: C.white, boxShadow: C.shadowSm, fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: C.navy }}>
          <Check start={142} size={46} /> Resposta: C
        </div>
      </div>
      {f < tSobra ? (
        <Caption line1="Agora a conta" line2={[{ text: "no" }, { text: "app.", accent: true }]} start={6} />
      ) : (
        <Caption line1="Sobra quase nada:" line2={[{ text: "só" }, { text: "30 centavos.", accent: true }]} start={tSobra + 2} />
      )}
    </SceneShell>
  );
};

/* 5 · Chat do Preço Certo */
const MSG = "Custo R$ 13,50, quero 20% de lucro";
const Chat: React.FC = () => {
  const f = useCurrentFrame();
  const tTipo = [26, 76];
  const tClique = 98;
  const tResp = 142;
  const letras = Math.max(0, Math.min(MSG.length, Math.floor(ip(f, tTipo, [0, MSG.length]))));
  const enviado = f >= tClique + 3;
  const top = 250;
  const altura = 1000;
  const envio = { x: CARD_X + 840 - 46 - 44, y: top + altura - 46 - 44 };
  const bolha = (t: number, azul: boolean, children: React.ReactNode, alinhar: "flex-start" | "flex-end") => (
    <div style={{ display: "flex", justifyContent: alinhar, marginTop: 20, ...enterStyle(f, t, { dy: 24, scaleFrom: 0.92 }) }}>
      <div style={{ maxWidth: 600, padding: "20px 28px", borderRadius: 30, background: azul ? C.gradient : C.soft, color: azul ? "#fff" : C.navy, fontSize: 32, fontWeight: 600, lineHeight: 1.3 }}>{children}</div>
    </div>
  );
  return (
    <SceneShell punches={[slotEnd(brl(k.precoIfood), tResp + 18)]}>
      <Card start={0} top={top} height={altura} padding={46}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, paddingBottom: 24, borderBottom: `2px solid ${C.soft}` }}>
          <Logo size={52} />
          <span style={{ fontSize: 38, fontWeight: 800, color: C.navy }}>Preço Certo</span>
        </div>
        {bolha(8, false, "Me fala o custo e o lucro que você quer.", "flex-start")}
        {enviado && bolha(tClique + 3, true, MSG, "flex-end")}
        {f >= tClique + 8 && f < tResp && (
          <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 10, fontSize: 30, fontWeight: 600, color: C.gray }}>
            Calculando
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: C.blue, opacity: Math.floor(f / 5) % 3 === i ? 1 : 0.3 }} />
            ))}
          </div>
        )}
        {f >= tResp && (
          <div style={{ marginTop: 22, borderRadius: 30, background: C.soft, padding: "24px 28px", ...enterStyle(f, tResp, { dy: 24, scaleFrom: 0.92 }) }}>
            <div style={{ fontSize: 30, fontWeight: 600, color: C.gray, textAlign: "center", marginBottom: 10 }}>Preço certo da marmita</div>
            {[
              { r: "Balcão", v: brl(k.precoBalcao), t: tResp + 8, img: "3d/fork_and_knife_with_plate.png" },
              { r: "iFood", v: brl(k.precoIfood), t: tResp + 18, img: "3d/motor_scooter.png" },
            ].map((l) => (
              <div key={l.r} style={{ height: 104, marginTop: 10, borderRadius: 26, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <Icon3D src={l.img} size={56} />
                <span style={{ fontSize: 36, fontWeight: 700, color: C.navy, width: 130 }}>{l.r}</span>
                <SlotNumber value={l.v} start={l.t} fontSize={56} />
              </div>
            ))}
          </div>
        )}
        <div style={{ position: "absolute", left: 46, right: 46 + 88 + 16, bottom: 46, height: 88, borderRadius: 44, background: C.soft, border: `2px solid ${f >= tTipo[0] && !enviado ? C.sky : "transparent"}`, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 28px", fontSize: 28, fontWeight: 500, color: C.navy, whiteSpace: "nowrap", overflow: "hidden" }}>
          {enviado || f < tTipo[0] ? <span style={{ color: C.gray }}>Mensagem</span> : MSG.slice(0, letras)}
          {!enviado && f >= tTipo[0] && Math.floor(f / 8) % 2 === 0 ? <span style={{ color: C.blue }}>|</span> : null}
        </div>
        <div style={{ position: "absolute", right: 46, bottom: 46, width: 88, height: 88, borderRadius: 44, background: C.gradientDiag, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <LineIcon name="send" size={40} color="#FFFFFF" />
        </div>
      </Card>
      <Cursor keys={[{ f: tClique - 20, x: 920, y: 1700 }, { f: tClique - 3, x: envio.x, y: envio.y }]} clicks={[tClique]} hideAt={tClique + 22} />
      <Caption line1="No Preço Certo," line2={[{ text: "a conta sai" }, { text: "pronta.", accent: true }]} start={6} />
    </SceneShell>
  );
};

/* 6 · Fim do mês */
const Mes: React.FC = () => {
  const f = useCurrentFrame();
  const coluna = (titulo: string, valor: string, cor: string, fundo: string, t: number) => (
    <div style={{ width: 400, borderRadius: 44, background: fundo, boxShadow: C.shadow, padding: "40px 0", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT.sans, ...enterStyle(f, t, { dy: 50, scaleFrom: 0.9 }) }}>
      <span style={{ fontSize: 34, fontWeight: 600, color: C.gray }}>Cobrando</span>
      <span style={{ fontSize: 56, fontWeight: 800, color: C.navy, letterSpacing: -1 }}>{titulo}</span>
      <span style={{ marginTop: 26, fontSize: 30, fontWeight: 600, color: C.gray }}>sobra no mês</span>
      <SlotNumber value={valor} start={t + 14} fontSize={70} color={cor} />
    </div>
  );
  const certo = `R$ ${new Intl.NumberFormat("pt-BR").format(Math.floor(k.mesCerto))}`;
  return (
    <SceneShell punches={[slotEnd(certo, 34)]}>
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", justifyContent: "center", ...enterStyle(f, 2) }}>
        <div style={{ padding: "14px 34px", borderRadius: 999, background: C.white, boxShadow: C.shadowSm, fontFamily: FONT.sans, fontSize: 32, fontWeight: 700, color: C.navy }}>
          {DADOS.porDia} marmitas por dia · {DADOS.dias} dias
        </div>
      </div>
      <div style={{ position: "absolute", top: 580, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40 }}>
        {coluna(brl(DADOS.precoApp), `R$ ${Math.round(k.mesErrado)}`, VERMELHO, "#FFFFFF", 8)}
        {coluna(brl(k.precoIfood), certo, VERDE, "#FFFFFF", 20)}
      </div>
      <Caption line1="Mesma marmita," line2={[{ text: "outro" }, { text: "negócio.", accent: true }]} start={6} />
    </SceneShell>
  );
};

/* 7 · CTA: seguir */
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const tClique = 66;
  const seguiu = f >= tClique + 2;
  const botao = { x: 540, y: 1040 };
  return (
    <SceneShell exit={false}>
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT.sans }}>
        <div style={{ width: 260, height: 260, borderRadius: 130, background: C.white, border: `10px solid ${C.ring}`, boxSizing: "border-box", boxShadow: C.shadow, display: "flex", alignItems: "center", justifyContent: "center", ...enterStyle(f, 0, { scaleFrom: 0.6, damping: 10 }) }}>
          <Logo size={140} />
        </div>
        <div style={{ marginTop: 40, fontSize: 72, fontWeight: 800, color: C.navy, letterSpacing: -2, ...enterStyle(f, 10) }}>Preço Certo</div>
        <div style={{ marginTop: 6, fontSize: 40, fontWeight: 500, color: C.gray, ...enterStyle(f, 16) }}>@precocerto.site</div>
      </div>
      <div style={{ position: "absolute", left: botao.x - 220, top: botao.y - 60, width: 440, height: 120, borderRadius: 60, background: seguiu ? C.navy : C.gradient, color: "#fff", fontFamily: FONT.sans, fontSize: 48, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, boxShadow: C.shadowSm, scale: String(f >= tClique - 2 && f < tClique + 4 ? 0.93 : 1), ...enterStyle(f, 24, { dy: 30, scaleFrom: 0.8 }) }}>
        {seguiu ? "Seguindo" : "Seguir"}
        {seguiu ? <LineIcon name="check" size={44} color="#FFFFFF" /> : null}
      </div>
      {/* estouro de partículas azuis ao seguir (sobe e some, sem girar) */}
      {Array.from({ length: 14 }).map((_, i) => {
        const p = ip(f, [tClique + 2, tClique + 26], [0, 1], easeOut);
        if (f < tClique + 2 || p >= 1) return null;
        const ang = (i / 14) * Math.PI * 2;
        const dist = 120 + rand(i) * 140;
        return <div key={i} style={{ position: "absolute", left: botao.x + Math.cos(ang) * dist * p - 9, top: botao.y + Math.sin(ang) * dist * 0.7 * p - 9, width: 18, height: 18, borderRadius: 9, background: i % 2 ? C.sky : C.blue, opacity: 1 - p, scale: String(1 - p * 0.5) }} />;
      })}
      <Cursor keys={[{ f: tClique - 22, x: 900, y: 1700 }, { f: tClique - 3, x: botao.x + 40, y: botao.y + 10 }]} clicks={[tClique]} hideAt={tClique + 18} />
      <Caption line1="Faz a conta do seu prato:" line2={[{ text: "segue o" }, { text: "Preço Certo.", accent: true }]} start={30} />
    </SceneShell>
  );
};

/* Som: trilha + efeitos sintetizados (scripts/synth-audio.py) */
const SFX: [number, string, number?][] = [
  [10, "pop"],
  [34, "tick", 0.5],
  [128, "pop"],
  [135, "pop"],
  [142, "pop"],
  ...[0, 1, 2].map((i) => [170 + i * 30, "tick", 0.35] as [number, string, number]),
  [270, "whoosh", 0.5],
  ...DADOS.itens.map((_, i) => [270 + 24 + i * 16, "pop", 0.4] as [number, string, number]),
  [270 + 128, "tick", 0.5],
  [270 + 150, "chime"],
  [510, "whoosh", 0.5],
  [510 + 56, "rise", 0.4],
  [510 + 104, "tick", 0.5],
  [510 + 126, "thud"],
  [510 + 142, "chime"],
  [720, "whoosh", 0.5],
  ...Array.from({ length: 17 }).map((_, i) => [720 + 26 + i * 3, "key", 0.3] as [number, string, number]),
  [720 + 98, "click"],
  [720 + 101, "pop"],
  [720 + 160, "tick", 0.5],
  [720 + 182, "chime"],
  [960, "whoosh", 0.5],
  [960 + 22, "tick", 0.5],
  [960 + 50, "chime"],
  [1110, "whoosh", 0.5],
  [1110 + 66, "click"],
  [1110 + 68, "sparkle"],
];

export const Desafio: React.FC = () => {
  const lista: [keyof typeof CENAS, React.FC][] = [
    ["gancho", Gancho],
    ["quiz", Quiz],
    ["custo", Custo],
    ["resposta", Resposta],
    ["chat", Chat],
    ["mes", Mes],
    ["cta", Cta],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT.sans }}>
      {lista.map(([nome, Cena]) => (
        <Sequence key={nome} name={nome} from={CENAS[nome][0]} durationInFrames={CENAS[nome][1] - CENAS[nome][0]}>
          <Cena />
        </Sequence>
      ))}
      <Audio src={staticFile("audio/ep02/music.wav")} loop volume={(fr) => interpolate(fr, [0, 12, DURACAO_DESAFIO - 30, DURACAO_DESAFIO], [0, 0.32, 0.32, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      {SFX.map(([t, som, vol], i) => (
        <Sequence key={i} from={t} durationInFrames={45} layout="none">
          <Audio src={staticFile(`audio/ep02/${som}.wav`)} volume={vol ?? 0.55} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

