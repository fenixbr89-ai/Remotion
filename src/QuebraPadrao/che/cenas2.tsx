import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { cores, fontes } from "../tema";
import { QuadradoQuebrado } from "../Logo";
import {
  Camera,
  Carimbo,
  Chapeu,
  corpo,
  Datilografado,
  manchete,
  MapaPapel,
  MarcaTexto,
  PapelAnim,
  prog,
  Sobe,
  useMola,
  VERMELHO,
} from "./base";
import { GradePop } from "./cenas1";

// CENA 8 — vitória
export const C8Vitoria: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: "absolute", left: 80, top: 230 }}>
      <Chapeu atraso={0}>DEZEMBRO · 1958</Chapeu>
      <Sobe atraso={4} style={{ ...manchete(100), marginTop: 18 }}>
        Batalha de Santa Clara
      </Sobe>
    </div>
    <PapelAnim semente="c8m" x={40} y={620} w={1000} h={560} rot={2} atraso={4}>
      <MapaPapel
        id="c8"
        w={1000}
        h={560}
        centro={[-79.6, 21.7]}
        escala={4700}
        desenho={[6, 30]}
        destaques={[{ nome: "Cuba", atraso: 30, hachura: true }]}
        pinos={[
          { lon: -82.38, lat: 23.13, rotulo: "Havana", atraso: 40 },
          { lon: -79.96, lat: 22.4, rotulo: "Santa Clara", atraso: 50, grande: true },
        ]}
      />
    </PapelAnim>
    <Carimbo texto={"BATISTA\nFOGE"} atraso={90} x={600} y={960} rot={-10} tam={78} />
    <div style={{ position: "absolute", left: 80, top: 1330 }}>
      <Chapeu atraso={100} cor={cores.cinza}>1º DE JANEIRO DE 1959</Chapeu>
      <Sobe atraso={108} style={{ ...manchete(84), marginTop: 18, width: 900 }}>
        A revolução vence.
      </Sobe>
      <Sobe atraso={120} style={{ ...manchete(84), width: 900 }}>
        Che vira <MarcaTexto atraso={150}>herói.</MarcaTexto>
      </Sobe>
    </div>
  </AbsoluteFill>
);

// CENA 9 — o lado que a camiseta não mostra
export const C9LadoEscuro: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 4, 12], [0, 0.9, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: VERMELHO, opacity: flash }} />
      <div style={{ position: "absolute", left: 80, top: 230, width: 920 }}>
        <Chapeu atraso={4}>QUEBRA DE PADRÃO</Chapeu>
        <Sobe atraso={8} style={{ ...manchete(98), marginTop: 18 }}>
          O que a camiseta
        </Sobe>
        <Sobe atraso={13} style={manchete(98, VERMELHO)}>
          não mostra
        </Sobe>
      </div>
      <PapelAnim semente="c9d" x={60} y={620} w={960} h={600} rot={-2} atraso={30} cor="#DCD3BC">
        <div style={{ padding: "50px 56px 0" }}>
          <div style={{ fontFamily: fontes.mono, fontSize: 24, letterSpacing: 5, color: VERMELHO }}>
            FORTALEZA DE LA CABAÑA · HAVANA · 1959
          </div>
        </div>
        <Datilografado
          texto={
            "Che comanda a prisão e os tribunais revolucionários.\n\nJulgamentos sumários. Sem defesa real.\nCondenados levados ao paredão."
          }
          atraso={46}
          velocidade={1.8}
          style={{ padding: "26px 56px", fontSize: 40, lineHeight: 1.45 }}
        />
      </PapelAnim>
      <Carimbo texto={"FUZILAMENTOS"} atraso={140} x={300} y={1150} rot={-7} tam={70} />
      <div style={{ position: "absolute", left: 80, top: 1310, width: 920 }}>
        <Sobe atraso={160} style={{ ...corpo(44), fontWeight: 600 }}>
          Dezenas de execuções sob seu comando.
        </Sobe>
        <Sobe atraso={170} style={{ ...corpo(36, cores.cinza) }}>
          O número exato ainda é disputado por historiadores.
        </Sobe>
      </div>
      <PapelAnim semente="c9q" x={110} y={1540} w={860} h={230} rot={2} atraso={220} cor="#F3EEDF">
        <div style={{ padding: "40px 50px" }}>
          <div style={{ ...manchete(52, cores.tinta) }}>“O ódio como fator de luta.”</div>
          <div style={{ fontFamily: fontes.mono, fontSize: 24, letterSpacing: 4, color: VERMELHO, marginTop: 14 }}>
            CHE GUEVARA · MENSAGEM À TRICONTINENTAL, 1967
          </div>
        </div>
      </PapelAnim>
    </AbsoluteFill>
  );
};

// CENA 10 — banqueiro e ministro
export const C10Ministro: React.FC = () => {
  const frame = useCurrentFrame();
  const sublinha = prog(frame, 70, 90);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 80, top: 230 }}>
        <Chapeu atraso={0}>1959 — 1965</Chapeu>
        <Sobe atraso={4} style={{ ...manchete(100), marginTop: 18 }}>
          O guerrilheiro
        </Sobe>
        <Sobe atraso={9} style={manchete(100)}>
          vira burocrata
        </Sobe>
      </div>
      <PapelAnim semente="c10n" x={60} y={640} w={960} h={460} rot={-3} atraso={14} cor="#D9DCC4">
        <div style={{ position: "absolute", inset: 26, border: `3px solid #4B5A3A`, padding: "36px 46px" }}>
          <div style={{ fontFamily: fontes.mono, fontSize: 30, letterSpacing: 6, color: "#4B5A3A" }}>BANCO NACIONAL DE CUBA</div>
          <div style={{ fontFamily: fontes.anton, fontSize: 150, color: "#4B5A3A", marginTop: 6, lineHeight: 1 }}>10 PESOS</div>
          <div style={{ position: "absolute", right: 60, bottom: 46, textAlign: "center" }}>
            <div style={{ fontFamily: fontes.maquina, fontSize: 96, color: cores.tinta, transform: "rotate(-6deg)", opacity: prog(frame, 50, 64) }}>
              Che
            </div>
            <div style={{ height: 4, width: 200 * sublinha, background: cores.tinta, marginTop: 4 }} />
          </div>
        </div>
      </PapelAnim>
      <div style={{ position: "absolute", left: 80, top: 1200, width: 920 }}>
        <Sobe atraso={60} style={{ ...corpo(46), fontWeight: 600 }}>
          Presidente do Banco Nacional, depois ministro da Indústria.
        </Sobe>
        <Sobe atraso={80} style={{ ...corpo(46), marginTop: 26 }}>
          Assinava as cédulas apenas como <MarcaTexto atraso={100}>“Che”.</MarcaTexto>
        </Sobe>
        <Sobe atraso={130} style={{ ...corpo(40, cores.cinza), marginTop: 26 }}>
          O plano de industrializar Cuba às pressas fracassou.
        </Sobe>
      </div>
    </AbsoluteFill>
  );
};

// CENA 11 — Congo e Bolívia
export const C11Exportar: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: "absolute", left: 80, top: 230 }}>
      <Chapeu atraso={0}>1965 — 1966</Chapeu>
      <Sobe atraso={4} style={{ ...manchete(100), marginTop: 18 }}>
        Exportar a revolução
      </Sobe>
    </div>
    <PapelAnim semente="c11m" x={30} y={500} w={1020} h={820} rot={-1} atraso={4}>
      <MapaPapel
        id="c11"
        w={1020}
        h={820}
        centro={[-25, -2]}
        escala={470}
        desenho={[6, 30]}
        destaques={[
          { nome: "Cuba", atraso: 24 },
          { nome: "Dem. Rep. Congo", atraso: 90 },
          { nome: "Bolivia", atraso: 190 },
        ]}
        rotas={[
          { pontos: [[-82.38, 23.13], [28.9, -4.3]], inicio: 36, fim: 90 },
          { pontos: [[-82.38, 23.13], [-63.9, -19.8]], inicio: 150, fim: 190 },
        ]}
        pinos={[
          { lon: 28.9, lat: -4.3, rotulo: "Congo · 1965", atraso: 92, lado: "esq" },
          { lon: -63.9, lat: -19.8, rotulo: "Bolívia · 1966", atraso: 192 },
        ]}
      />
    </PapelAnim>
    <Carimbo texto={"FRACASSO"} atraso={110} x={560} y={1180} rot={-9} tam={70} />
    <div style={{ position: "absolute", left: 80, top: 1380, width: 920 }}>
      <Sobe atraso={110} style={{ ...corpo(44), fontWeight: 600 }}>
        No Congo, a guerrilha desmorona em 7 meses.
      </Sobe>
      <Sobe atraso={200} style={{ ...corpo(44), marginTop: 22 }}>
        Na Bolívia, sem apoio dos camponeses, o grupo é <MarcaTexto atraso={225}>cercado.</MarcaTexto>
      </Sobe>
    </div>
  </AbsoluteFill>
);

// CENA 12 — morte
export const C12Morte: React.FC = () => (
  <AbsoluteFill>
    <Camera dur={270} ate={1.08} origem="45% 45%">
      <div style={{ position: "absolute", left: 80, top: 230 }}>
        <Chapeu atraso={0}>8 · OUTUBRO · 1967</Chapeu>
        <Sobe atraso={4} style={{ ...manchete(110), marginTop: 18 }}>
          Capturado.
        </Sobe>
      </div>
      <PapelAnim semente="c12m" x={50} y={500} w={980} h={820} rot={1.5} atraso={4}>
        <MapaPapel
          id="c12"
          w={980}
          h={820}
          centro={[-64.5, -17.5]}
          escala={3000}
          desenho={[6, 30]}
          destaques={[{ nome: "Bolivia", atraso: 26, hachura: true }]}
          pinos={[{ lon: -64.2, lat: -18.79, rotulo: "La Higuera", atraso: 44, grande: true }]}
        />
      </PapelAnim>
      <div style={{ position: "absolute", left: 80, top: 1390, width: 920 }}>
        <Chapeu atraso={70} cor={cores.cinza}>NO DIA SEGUINTE</Chapeu>
        <Sobe atraso={78} style={{ ...corpo(46), fontWeight: 600, marginTop: 16 }}>
          Executado pelo exército boliviano, com um agente da CIA presente.
        </Sobe>
        <Sobe atraso={130} style={{ ...manchete(88), marginTop: 24 }}>
          Tinha <MarcaTexto atraso={150}>39 anos.</MarcaTexto>
        </Sobe>
      </div>
    </Camera>
  </AbsoluteFill>
);

// CENA 13 — o mito
export const C13Mito: React.FC = () => {
  const frame = useCurrentFrame();
  const esc = interpolate(frame, [0, 20, 150, 170], [0.2, 0.5, 0.5, 0.85], { extrapolateRight: "clamp" });
  const fase2 = frame >= 160;
  return (
    <AbsoluteFill>
      <Camera dur={270} ate={1.1}>
        <GradePop escurece={esc} quebrada={false} />
      </Camera>
      {!fase2 ? (
        <>
          <div style={{ position: "absolute", left: 80, top: 330 }}>
            <Sobe atraso={6} style={manchete(120)}>
              Morreu o homem.
            </Sobe>
            <Sobe atraso={30} style={manchete(120, VERMELHO)}>
              Nasceu a estampa.
            </Sobe>
          </div>
          <PapelAnim semente="c13d" x={80} y={1200} w={920} h={360} rot={-2} atraso={60} cor="#F3EEDF">
            <Datilografado
              texto={"Foto de Alberto Korda, 1960.\nUma das imagens mais reproduzidas\nda história — em camisetas,\ncanecas e bonés."}
              atraso={72}
              velocidade={2}
              style={{ padding: "50px 56px", fontSize: 38, lineHeight: 1.45 }}
            />
          </PapelAnim>
        </>
      ) : (
        <AbsoluteFill style={{ justifyContent: "center", padding: "0 80px" }}>
          <Sobe atraso={164} style={manchete(150)}>
            Herói
          </Sobe>
          <Sobe atraso={170} style={manchete(150, VERMELHO)}>
            ou carrasco?
          </Sobe>
          <Sobe atraso={196} style={{ ...corpo(50), marginTop: 50 }}>
            Depende de <MarcaTexto atraso={215}>quem conta a história.</MarcaTexto>
          </Sobe>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// CENA 14 — assinatura
export const C14Final: React.FC = () => {
  const logo = useMola(6);
  const t = useMola(24);
  const c = useMola(44);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "#0A0A0A" }}>
      <div style={{ opacity: logo, transform: `scale(${0.6 + logo * 0.4}) rotate(${(1 - logo) * -20}deg)` }}>
        <QuadradoQuebrado tamanho={240} espessura={5} />
      </div>
      <div
        style={{
          marginTop: 70,
          fontFamily: fontes.inter,
          fontWeight: 800,
          fontSize: 74,
          letterSpacing: 14,
          color: cores.branco,
          opacity: t,
          transform: `translateY(${(1 - t) * 30}px)`,
        }}
      >
        QUEBRA PADRÃO
      </div>
      <div style={{ marginTop: 40, ...corpo(40, cores.cinza), opacity: c }}>
        Siga pra ver <span style={{ color: VERMELHO }}>o outro lado</span> da história.
      </div>
    </AbsoluteFill>
  );
};
