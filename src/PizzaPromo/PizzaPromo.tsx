import { Video } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, staticFile, Track } from "remotion";
import { EndCard } from "./EndCard";
import {
  LightLeakOverlay,
  OpeningTitle,
  ProgressBar,
  Vignette,
} from "./Overlays";
import { ReelsCaptions } from "./ReelsCaptions";
import { Sticker } from "./Sticker";

// Tempos em frames (30 fps). Dentro de cada cena, trimBefore, os "from" dos
// selos e os tempos das legendas usam o relógio do vídeo original.

export const PizzaPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries name="Cenas">
        <TransitionSeries.Sequence
          name="Abertura"
          trimBefore={0}
          durationInFrames={27}
        >
          <Video
            name="Vídeo abertura"
            src={staticFile("pizza-raw.mp4")}
            objectFit="cover"
            style={{
              width: "100%",
              height: "100%",
              filter: "contrast(1.07) saturate(1.2) brightness(1.03)",
              scale: 1.05,
            }}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 8 })}
        />
        <TransitionSeries.Sequence
          name="Chegada"
          trimBefore={72}
          durationInFrames={67}
        >
          <Video
            name="Vídeo chegada"
            src={staticFile("pizza-raw.mp4")}
            objectFit="cover"
            style={{
              width: "100%",
              height: "100%",
              filter: "contrast(1.07) saturate(1.2) brightness(1.03)",
              scale: 1.12,
            }}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 8 })}
        />
        <TransitionSeries.Sequence
          name="Fala 1 - Duas caixas"
          trimBefore={145}
          durationInFrames={187}
        >
          <Video
            name="Vídeo fala 1"
            src={staticFile("pizza-raw.mp4")}
            objectFit="cover"
            style={{
              width: "100%",
              height: "100%",
              filter: "contrast(1.07) saturate(1.2) brightness(1.03)",
              scale: 1,
            }}
          />
          <Track name="Selos fala 1">
            <Sticker
              name="Selo sábado"
              from={185}
              durationInFrames={80}
              emoji="📅"
              style={{ top: 250 }}
            >
              Neste sábado
            </Sticker>
            <Sticker
              name="Selo duas caixas"
              from={269}
              durationInFrames={63}
              emoji="🎁"
              style={{ top: 250 }}
            >
              2 caixas premiadas
            </Sticker>
          </Track>
          <ReelsCaptions
            name="Legendas fala 1"
            highlightColor="#FFD23F"
            textColor="#FFFFFF"
            style={{ top: 1180, left: 60, width: 960 }}
            captions={[
            {text: " E", startMs: 4980, endMs: 5580, timestampMs: 5280, confidence: null},
            {text: " neste", startMs: 5580, endMs: 6180, timestampMs: 5880, confidence: null},
            {text: " sábado", startMs: 6180, endMs: 6640, timestampMs: 6410, confidence: null},
            {text: " nós", startMs: 6640, endMs: 6840, timestampMs: 6740, confidence: null},
            {text: " não", startMs: 6840, endMs: 7060, timestampMs: 6950, confidence: null},
            {text: " teremos", startMs: 7060, endMs: 7360, timestampMs: 7210, confidence: null},
            {text: " apenas", startMs: 7360, endMs: 7680, timestampMs: 7520, confidence: null},
            {text: " uma,", startMs: 7680, endMs: 8140, timestampMs: 7910, confidence: null},
            {text: " mas", startMs: 8440, endMs: 8640, timestampMs: 8540, confidence: null},
            {text: " sim", startMs: 8640, endMs: 8960, timestampMs: 8800, confidence: null},
            {text: " duas", startMs: 8960, endMs: 9700, timestampMs: 9330, confidence: null},
            {text: " caixas", startMs: 9700, endMs: 10240, timestampMs: 9970, confidence: null},
            {text: " premiadas.", startMs: 10240, endMs: 10940, timestampMs: 10590, confidence: null},
            ]}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={16}>
          <LightLeakOverlay name="Flash 1" length={16} originX={15} color="#FFD9A0" />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence
          name="Fala 2 - Vencedor"
          trimBefore={334}
          durationInFrames={152}
        >
          <Video
            name="Vídeo fala 2"
            src={staticFile("pizza-raw.mp4")}
            objectFit="cover"
            style={{
              width: "100%",
              height: "100%",
              filter: "contrast(1.07) saturate(1.2) brightness(1.03)",
              scale: 1.08,
            }}
          />
          <Track name="Selos fala 2">
            <Sticker
              name="Selo vencedor"
              from={343}
              durationInFrames={100}
              emoji="🏆"
              style={{ top: 250 }}
            >
              O vencedor ganha
            </Sticker>
            <Sticker
              name="Selo calabresa"
              from={446}
              durationInFrames={40}
              emoji="🍕"
              style={{ top: 250 }}
            >
              Pizza de calabresa
            </Sticker>
          </Track>
          <ReelsCaptions
            name="Legendas fala 2"
            highlightColor="#FFD23F"
            textColor="#FFFFFF"
            style={{ top: 1180, left: 60, width: 960 }}
            captions={[
            {text: " O", startMs: 11240, endMs: 11440, timestampMs: 11340, confidence: null},
            {text: " vencedor", startMs: 11440, endMs: 12100, timestampMs: 11770, confidence: null},
            {text: " pode", startMs: 12100, endMs: 12500, timestampMs: 12300, confidence: null},
            {text: " vir", startMs: 12500, endMs: 12920, timestampMs: 12710, confidence: null},
            {text: " aqui", startMs: 12920, endMs: 13220, timestampMs: 13070, confidence: null},
            {text: " no", startMs: 13220, endMs: 13360, timestampMs: 13290, confidence: null},
            {text: " local", startMs: 13360, endMs: 13600, timestampMs: 13480, confidence: null},
            {text: " consumir", startMs: 13600, endMs: 14380, timestampMs: 13990, confidence: null},
            {text: " uma", startMs: 14380, endMs: 14880, timestampMs: 14630, confidence: null},
            {text: " pizza", startMs: 14880, endMs: 15240, timestampMs: 15060, confidence: null},
            {text: " de", startMs: 15240, endMs: 15440, timestampMs: 15340, confidence: null},
            {text: " calabresa.", startMs: 15440, endMs: 16080, timestampMs: 15760, confidence: null},
            ]}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={16}>
          <LightLeakOverlay name="Flash 2" length={16} originX={85} color="#FFE3B0" />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence
          name="Fala 3 - Todos concorrem"
          trimBefore={490}
          durationInFrames={124}
        >
          <Video
            name="Vídeo fala 3"
            src={staticFile("pizza-raw.mp4")}
            objectFit="cover"
            style={{
              width: "100%",
              height: "100%",
              filter: "contrast(1.07) saturate(1.2) brightness(1.03)",
              scale: 1.18,
            }}
          />
          <Track name="Selos fala 3">
            <Sticker
              name="Selo concorrer"
              from={552}
              durationInFrames={62}
              emoji="📲"
              style={{ top: 250 }}
            >
              Pediu, concorreu!
            </Sticker>
          </Track>
          <ReelsCaptions
            name="Legendas fala 3"
            highlightColor="#FFD23F"
            textColor="#FFFFFF"
            style={{ top: 1180, left: 60, width: 960 }}
            captions={[
            {text: " Todos", startMs: 16420, endMs: 16760, timestampMs: 16590, confidence: null},
            {text: " que", startMs: 16760, endMs: 16960, timestampMs: 16860, confidence: null},
            {text: " fizeram", startMs: 16960, endMs: 17320, timestampMs: 17140, confidence: null},
            {text: " o", startMs: 17320, endMs: 17440, timestampMs: 17380, confidence: null},
            {text: " seu", startMs: 17440, endMs: 17560, timestampMs: 17500, confidence: null},
            {text: " pedido,", startMs: 17560, endMs: 18020, timestampMs: 17790, confidence: null},
            {text: " vai", startMs: 18080, endMs: 18400, timestampMs: 18240, confidence: null},
            {text: " concorrer", startMs: 18400, endMs: 18880, timestampMs: 18640, confidence: null},
            {text: " a", startMs: 18880, endMs: 19040, timestampMs: 18960, confidence: null},
            {text: " essa", startMs: 19040, endMs: 19180, timestampMs: 19110, confidence: null},
            {text: " caixa", startMs: 19180, endMs: 19500, timestampMs: 19340, confidence: null},
            {text: " maravilhosa.", startMs: 19500, endMs: 20360, timestampMs: 19930, confidence: null},
            ]}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={16}>
          <LightLeakOverlay name="Flash 3" length={16} originX={30} color="#FFCF9A" />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence
          name="Fala 4 - Pergunta"
          trimBefore={616}
          durationInFrames={84}
        >
          <Video
            name="Vídeo fala 4"
            src={staticFile("pizza-raw.mp4")}
            objectFit="cover"
            style={{
              width: "100%",
              height: "100%",
              filter: "contrast(1.07) saturate(1.2) brightness(1.03)",
              scale: 1.04,
            }}
          />
          <Track name="Selos fala 4">
            <Sticker
              name="Selo peça já"
              from={632}
              durationInFrames={68}
              emoji="👇"
              style={{ top: 250 }}
            >
              Peça já
            </Sticker>
          </Track>
          <ReelsCaptions
            name="Legendas fala 4"
            highlightColor="#FFD23F"
            textColor="#FFFFFF"
            style={{ top: 1180, left: 60, width: 960 }}
            captions={[
            {text: " Você", startMs: 20600, endMs: 20800, timestampMs: 20700, confidence: null},
            {text: " já", startMs: 20800, endMs: 20980, timestampMs: 20890, confidence: null},
            {text: " fez", startMs: 20980, endMs: 21140, timestampMs: 21060, confidence: null},
            {text: " seu", startMs: 21140, endMs: 21240, timestampMs: 21190, confidence: null},
            {text: " pedido", startMs: 21240, endMs: 21520, timestampMs: 21380, confidence: null},
            {text: " hoje?", startMs: 21520, endMs: 21800, timestampMs: 21660, confidence: null},
            ]}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence name="Cartão final" durationInFrames={75}>
          <EndCard
            name="Cartão final"
            headline="Já fez seu pedido hoje?"
            cta="Peça agora!"
            tagline="Sabor irresistível"
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Vignette />
      <Track name="Títulos">
        <OpeningTitle
          name="Título de abertura"
          from={0}
          durationInFrames={86}
          kicker="ESTE SÁBADO"
          title="Caixa premiada"
          subtitle="🎁 em dobro!"
          style={{ top: 620 }}
        />
      </Track>
      <ProgressBar />
    </AbsoluteFill>
  );
};
