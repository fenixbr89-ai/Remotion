import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";
import {
  Boina,
  Camera,
  Carimbo,
  Chapeu,
  corpo,
  Datilografado,
  H,
  manchete,
  MapaPapel,
  MarcaTexto,
  PapelAnim,
  prog,
  Sobe,
  useMola,
  VERMELHO,
  W,
} from "./base";

// Grade pop de boinas — o "produto". Uma célula falta: o padrão quebrado.
export const GradePop: React.FC<{ escurece?: number; quebrada?: boolean }> = ({ escurece = 0, quebrada = true }) => {
  const frame = useCurrentFrame();
  const cols = 4;
  const cel = W / cols;
  const linhas = 8;
  const fundos = [VERMELHO, cores.papel, "#1B1917", "#F0B429"];
  return (
    <AbsoluteFill>
      {Array.from({ length: cols * linhas }).map((_, i) => {
        const c = i % cols;
        const l = Math.floor(i / cols);
        const atraso = (c + l) * 2.2;
        const p = prog(frame, atraso, atraso + 10);
        const falta = quebrada && c === 2 && l === 3;
        const bg = fundos[(c + l * 3) % fundos.length];
        const icone = bg === "#1B1917" ? cores.papel : cores.tinta;
        const estrela = bg === VERMELHO ? cores.papel : VERMELHO;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c * cel,
              top: l * cel - 120,
              width: cel,
              height: cel,
              background: falta ? "transparent" : bg,
              opacity: p,
              transform: `scale(${0.85 + p * 0.15})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: falta ? `3px dashed ${cores.papel}` : "none",
            }}
          >
            {falta ? null : <Boina tam={cel * 0.7} cor={icone} estrela={estrela} />}
          </div>
        );
      })}
      <AbsoluteFill style={{ background: `rgba(10,10,10,${escurece})` }} />
    </AbsoluteFill>
  );
};

// CENA 1 — gancho
export const C1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const esc = interpolate(frame, [50, 70], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Camera dur={240} ate={1.08}>
        <GradePop escurece={esc} />
      </Camera>
      <PapelAnim semente="c1" x={50} y={1000} w={980} h={640} rot={-2} atraso={55}>
        <div style={{ padding: "70px 70px", ...manchete(76, cores.tinta) }}>
          O rosto de um revolucionário comunista virou um dos produtos{" "}
          <MarcaTexto atraso={95}>mais vendidos</MarcaTexto> do capitalismo.
        </div>
      </PapelAnim>
      <Carimbo texto={"COMO?"} atraso={150} x={700} y={880} rot={10} tam={80} />
    </AbsoluteFill>
  );
};

// CENA 2 — título
export const C2Titulo: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", padding: "0 80px" }}>
    <PapelAnim semente="c2" x={90} y={1180} w={760} h={190} rot={3} atraso={20} de="esq">
      <Datilografado texto="Ernesto Guevara de la Serna" atraso={34} velocidade={1.2} style={{ padding: "64px 50px", fontSize: 46 }} />
    </PapelAnim>
    <Chapeu atraso={0}>QUEM FOI</Chapeu>
    <Sobe atraso={4} style={{ ...manchete(200), marginTop: 20 }}>
      Che
    </Sobe>
    <Sobe atraso={9} style={manchete(200)}>
      Guevara?
    </Sobe>
    <Carimbo texto={"1928 — 1967"} atraso={60} x={420} y={1440} rot={-8} tam={62} />
  </AbsoluteFill>
);

// CENA 3 — nascimento
export const C3Nascimento: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: "absolute", left: 80, top: 230 }}>
      <Chapeu atraso={0}>14 · JUNHO · 1928</Chapeu>
      <Sobe atraso={4} style={{ ...manchete(110), marginTop: 18 }}>
        Rosario,
      </Sobe>
      <Sobe atraso={9} style={manchete(110)}>
        Argentina
      </Sobe>
    </div>
    <PapelAnim semente="c3m" x={60} y={560} w={960} h={1000} rot={2} atraso={6}>
      <MapaPapel
        id="c3"
        w={960}
        h={1000}
        centro={[-62, -28]}
        escala={1250}
        desenho={[10, 40]}
        destaques={[{ nome: "Argentina", atraso: 40, hachura: true }]}
        pinos={[{ lon: -60.65, lat: -32.95, rotulo: "Rosario", atraso: 56, grande: true }]}
      />
    </PapelAnim>
    <PapelAnim semente="c3d" x={110} y={1380} w={880} h={340} rot={-3} atraso={80} cor="#F3EEDF">
      <Datilografado
        texto={"Família de classe média.\nAsmático desde os 2 anos.\nVai estudar medicina em Buenos Aires."}
        atraso={92}
        velocidade={1.5}
        style={{ padding: "56px 56px", fontSize: 40, lineHeight: 1.5 }}
      />
    </PapelAnim>
  </AbsoluteFill>
);

// CENA 4 — viagem de moto
const ROTA_MOTO: [number, number][] = [
  [-58.38, -34.6],
  [-57.8, -38.3],
  [-71.3, -41.1],
  [-72.6, -38.7],
  [-71.6, -33.05],
  [-68.9, -22.3],
  [-71.97, -13.53],
  [-77.04, -12.05],
  [-73.25, -3.75],
  [-69.94, -4.2],
  [-74.07, 4.71],
  [-66.9, 10.5],
];

export const C4Moto: React.FC = () => (
  <AbsoluteFill>
    <Camera dur={330} ate={1.06} origem="50% 40%">
      <div style={{ position: "absolute", left: 80, top: 230 }}>
        <Chapeu atraso={0}>1952 · “LA PODEROSA”</Chapeu>
        <Sobe atraso={4} style={{ ...manchete(104), marginTop: 18 }}>
          A viagem de moto
        </Sobe>
      </div>
      <PapelAnim semente="c4m" x={40} y={440} w={1000} h={1150} rot={-1.5} atraso={0}>
        <MapaPapel
          id="c4"
          w={1000}
          h={1150}
          centro={[-66, -15]}
          escala={1150}
          rotas={[{ pontos: ROTA_MOTO, inicio: 30, fim: 200 }]}
          pinos={[
            { lon: -58.38, lat: -34.6, rotulo: "Buenos Aires", atraso: 26 },
            { lon: -71.6, lat: -33.05, rotulo: "Chile", atraso: 80, lado: "esq" },
            { lon: -71.97, lat: -13.53, rotulo: "Cuzco", atraso: 130 },
            { lon: -74.07, lat: 4.71, rotulo: "Bogotá", atraso: 182, lado: "esq" },
            { lon: -66.9, lat: 10.5, rotulo: "Caracas", atraso: 200 },
          ]}
        />
      </PapelAnim>
      <PapelAnim semente="c4d" x={70} y={1430} w={940} h={330} rot={2} atraso={215} cor="#F3EEDF">
        <div style={{ padding: "50px 56px", ...corpo(42, cores.tinta), fontWeight: 600 }}>
          Mineiros explorados, indígenas na miséria, leprosos isolados. O estudante de medicina começava a{" "}
          <MarcaTexto atraso={255}>virar revolucionário.</MarcaTexto>
        </div>
      </PapelAnim>
    </Camera>
  </AbsoluteFill>
);

// CENA 5 — Guatemala
export const C5Guatemala: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: "absolute", left: 80, top: 230 }}>
      <Chapeu atraso={0}>GUATEMALA · 1954</Chapeu>
      <Sobe atraso={4} style={{ ...manchete(100), marginTop: 18 }}>
        Um governo derrubado
      </Sobe>
    </div>
    <PapelAnim semente="c5m" x={50} y={560} w={980} h={820} rot={1.5} atraso={4}>
      <MapaPapel
        id="c5"
        w={980}
        h={820}
        centro={[-88, 16]}
        escala={2900}
        desenho={[8, 34]}
        destaques={[{ nome: "Guatemala", atraso: 36 }]}
        pinos={[{ lon: -90.5, lat: 14.6, rotulo: "Cidade da Guatemala", atraso: 48 }]}
      />
    </PapelAnim>
    <Carimbo texto={"GOLPE"} atraso={64} x={640} y={640} rot={-14} tam={96} />
    <PapelAnim semente="c5d" x={80} y={1290} w={920} h={420} rot={-2} atraso={80} cor="#F3EEDF">
      <div style={{ padding: "52px 56px", ...corpo(40, cores.tinta) }}>
        O presidente eleito Jacobo Árbenz cai num golpe apoiado pela CIA. Ernesto estava lá e tirou uma conclusão:{" "}
        <b>
          <MarcaTexto atraso={150}>só as armas mudariam a América Latina.</MarcaTexto>
        </b>
      </div>
    </PapelAnim>
  </AbsoluteFill>
);

// CENA 6 — encontro com Fidel
const Ficha: React.FC<{ nome: string; info: string }> = ({ nome, info }) => (
  <div style={{ padding: "40px 46px" }}>
    <div style={{ fontFamily: fontes.mono, fontSize: 24, letterSpacing: 5, color: VERMELHO }}>FICHA</div>
    <div style={{ ...manchete(64, cores.tinta), marginTop: 10 }}>{nome}</div>
    <div style={{ fontFamily: fontes.maquina, fontSize: 34, color: cores.tinta, marginTop: 14, lineHeight: 1.4 }}>{info}</div>
  </div>
);

export const C6Fidel: React.FC = () => {
  const frame = useCurrentFrame();
  const fio = prog(frame, 40, 64);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 80, top: 230 }}>
        <Chapeu atraso={0}>CIDADE DO MÉXICO · 1955</Chapeu>
        <Sobe atraso={4} style={{ ...manchete(104), marginTop: 18 }}>
          O encontro
        </Sobe>
      </div>
      <PapelAnim semente="c6a" x={70} y={520} w={600} h={330} rot={-4} atraso={8} de="esq">
        <Ficha nome="Fidel Castro" info={"cubano, 28 anos\nexilado, planeja\nderrubar Batista"} />
      </PapelAnim>
      <PapelAnim semente="c6b" x={410} y={920} w={600} h={330} rot={3} atraso={22} de="dir">
        <Ficha nome="Ernesto Guevara" info={"argentino, 27 anos\nmédico"} />
      </PapelAnim>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <line x1={520} y1={820} x2={520 + (700 - 520) * fio} y2={820 + (960 - 820) * fio} stroke={VERMELHO} strokeWidth={6} />
        {fio > 0 ? <circle cx={520} cy={820} r={12} fill={VERMELHO} /> : null}
        {fio >= 1 ? <circle cx={700} cy={960} r={12} fill={VERMELHO} /> : null}
      </svg>
      <PapelAnim semente="c6c" x={70} y={1330} w={940} h={380} rot={-1.5} atraso={90} cor="#F3EEDF">
        <div style={{ padding: "52px 56px", ...corpo(42, cores.tinta) }}>
          Os cubanos o apelidam de <b><MarcaTexto atraso={130}>“Che”</MarcaTexto></b> — o jeito argentino de dizer “ei, cara”.
          O apelido vira nome.
        </div>
      </PapelAnim>
    </AbsoluteFill>
  );
};

// CENA 7 — Granma
const ROTA_GRANMA: [number, number][] = [
  [-97.4, 20.95],
  [-93, 21.6],
  [-87.6, 21.9],
  [-85, 20.4],
  [-80.5, 19.9],
  [-77.68, 19.88],
];

export const C7Granma: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [170, 215], [82, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const caiu = frame >= 170;
  const numP = useMola(140);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 80, top: 230 }}>
        <Chapeu atraso={0}>NOVEMBRO · 1956</Chapeu>
        <Sobe atraso={4} style={{ ...manchete(104), marginTop: 18 }}>
          O iate Granma
        </Sobe>
      </div>
      <PapelAnim semente="c7m" x={40} y={500} w={1000} h={760} rot={-1.5} atraso={4}>
        <MapaPapel
          id="c7"
          w={1000}
          h={760}
          centro={[-87, 21]}
          escala={2150}
          destaques={[{ nome: "Cuba", atraso: 20 }]}
          rotas={[{ pontos: ROTA_GRANMA, inicio: 30, fim: 130 }]}
          pinos={[
            { lon: -97.4, lat: 20.95, rotulo: "Tuxpan", atraso: 26 },
            { lon: -77.68, lat: 19.88, rotulo: "Desembarque", atraso: 130, lado: "esq" },
          ]}
        />
      </PapelAnim>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1330, opacity: numP, transform: `translateY(${(1 - numP) * 40}px)` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 30 }}>
          <div style={{ fontFamily: fontes.anton, fontSize: 280, lineHeight: 1, color: caiu ? VERMELHO : cores.branco, flexShrink: 0 }}>
            {caiu ? `~${n}` : 82}
          </div>
          <div style={{ ...corpo(46), fontWeight: 600, flex: 1 }}>
            {frame < 215 ? "homens a bordo de um iate feito para 12 pessoas." : "sobreviveram à emboscada na chegada."}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
