import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { z } from "zod";
import { Apresentacao, Hook, LockScreen } from "./Abertura";
import { ContactSheet, Valores } from "./Encerramento";
import { Sfx } from "./kit";
import { Carrossel, ServiceCards, Widgets } from "./Servicos";
import { C } from "./theme";
import TL from "./timeline.json";

export const comercialSchema = z.object({
  /** Arquivo de narração em public/. Vazio = sem narração. */
  narracao: z.string(),
  volumeTrilha: z.number().min(0).max(1),
});

export type ComercialProps = z.infer<typeof comercialSchema>;

/*
 * Linha do tempo (30 fps) guiada pela narração: cada cena começa quando a
 * frase correspondente começa. Os números vêm de timeline.json, gerado por
 * scripts/narration.py.
 */
const len = (a: number, b: number) => b - a;
const HOOK_END = TL.conheca.start - 5; // a roleta ocupa só a primeira frase
const LOCK_END = HOOK_END + 36; // notificações rápidas em "Então conheça"
const CARDS = TL.profissional.start - 2;
const CAROUSEL = TL.pintura.start - 2;
const MAIS = TL.mais.start - 2;
const VALORES = TL.valores.start - 2;
const CONTATO = TL.precisou.start - 2;
export const TOTAL = TL._total;

const hookLen = TL.hook.end - TL.hook.start;
const svc = [
  TL.pintura,
  TL.automotiva,
  TL.reformas,
  TL.hidraulica,
  TL.eletrica,
].map((g) => g.start - CAROUSEL);

export const Comercial: React.FC<ComercialProps> = ({
  narracao,
  volumeTrilha,
}) => {
  // com narração, a trilha abaixa para a voz ficar em primeiro plano
  const musica = narracao ? volumeTrilha * 0.32 : volumeTrilha;
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <Sequence name="Precisando de… (roleta)" durationInFrames={HOOK_END}>
        <Hook
          dur={HOOK_END}
          cues={[
            0, // "Precisando de pintura?" já aparece no primeiro frame
            TL.hook.start + Math.round(hookLen * 0.6),
            TL.hook.start + Math.round(hookLen * 0.78),
          ]}
        />
      </Sequence>
      <Sequence
        name="Notificações (acelerado)"
        from={HOOK_END}
        durationInFrames={len(HOOK_END, LOCK_END)}
      >
        <LockScreen dur={len(HOOK_END, LOCK_END)} />
      </Sequence>
      <Sequence
        name="Então conheça (logo)"
        from={LOCK_END}
        durationInFrames={len(LOCK_END, CARDS)}
      >
        <Apresentacao dur={len(LOCK_END, CARDS)} />
      </Sequence>
      <Sequence
        name="Um só profissional (cartões)"
        from={CARDS}
        durationInFrames={len(CARDS, CAROUSEL)}
      >
        <ServiceCards dur={len(CARDS, CAROUSEL)} />
      </Sequence>
      <Sequence
        name="Serviços (deslize)"
        from={CAROUSEL}
        durationInFrames={len(CAROUSEL, MAIS)}
      >
        <Carrossel starts={svc} dur={len(CAROUSEL, MAIS)} />
      </Sequence>
      <Sequence
        name="E muito mais"
        from={MAIS}
        durationInFrames={len(MAIS, VALORES)}
      >
        <Widgets
          dur={len(MAIS, VALORES)}
          cues={TL.mais.parts.slice(1).map((p) => p - MAIS - 3)}
        />
      </Sequence>
      <Sequence
        name="Valores"
        from={VALORES}
        durationInFrames={len(VALORES, CONTATO)}
      >
        <Valores
          dur={len(VALORES, CONTATO)}
          cues={[0.2, 0.47, 0.76].map((k) =>
            Math.round(2 + (TL.valores.end - TL.valores.start) * k),
          )}
        />
      </Sequence>
      <Sequence
        name="Contato + frase final"
        from={CONTATO}
        durationInFrames={len(CONTATO, TOTAL)}
      >
        <ContactSheet
          dur={len(CONTATO, TOTAL)}
          cues={{
            chame: TL.chame.start - CONTATO,
            phone: TL.chame.parts[1] - CONTATO,
            press: TL.chame.end - CONTATO,
            tag: TL.final.parts[1] - CONTATO,
          }}
        />
      </Sequence>

      {/* efeitos sonoros discretos, só nas transições */}
      <Sfx at={HOOK_END} src="whoosh.wav" volume={0.18} />
      <Sfx at={HOOK_END + 6} src="ding.wav" volume={0.2} />
      <Sfx at={LOCK_END} src="whoosh.wav" volume={0.18} />
      <Sfx at={CARDS} src="whoosh.wav" volume={0.15} />
      {svc.slice(1).map((s) => (
        <Sfx key={s} at={CAROUSEL + s - 6} src="whip.wav" volume={0.15} />
      ))}
      <Sfx at={MAIS} src="whoosh.wav" volume={0.15} />
      {TL.mais.parts.slice(1).map((p) => (
        <Sfx key={p} at={p - 3} src="pop.wav" volume={0.12} />
      ))}
      <Sfx at={VALORES} src="whoosh.wav" volume={0.15} />
      <Sfx at={TL.chame.start - 6} src="whoosh.wav" volume={0.18} />
      <Sfx at={TL.chame.end} src="click.wav" volume={0.3} />

      <Audio src={staticFile("audio/trilha.mp3")} volume={musica} />
      {narracao ? <Audio src={staticFile(narracao)} volume={1} /> : null}
    </AbsoluteFill>
  );
};
