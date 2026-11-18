// Ponto de entrada do script que o site (Advogado/index.html) carrega.
// Procura elementos <div data-escritorio-player data-base-url="video/img/">
// e monta o Remotion Player com a composição do escritório dentro deles.
// Gerado com: npm run build:site
import { Player, PlayerRef } from "@remotion/player";
import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  Escritorio,
  ESCRITORIO_DURACAO,
  ESCRITORIO_FPS,
  ESCRITORIO_H,
  ESCRITORIO_W,
} from "../Escritorio/Escritorio";

const VideoEscritorio: React.FC<{ baseUrl: string; host: HTMLElement }> = ({
  baseUrl,
  host,
}) => {
  const ref = useRef<PlayerRef>(null);

  // Toca só quando o vídeo está visível na tela; pausa quando sai.
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        const p = ref.current;
        if (!p) return;
        if (e.isIntersecting) p.play();
        else p.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [host]);

  return (
    <Player
      ref={ref}
      component={Escritorio}
      inputProps={{ baseUrl }}
      durationInFrames={ESCRITORIO_DURACAO}
      fps={ESCRITORIO_FPS}
      compositionWidth={ESCRITORIO_W}
      compositionHeight={ESCRITORIO_H}
      loop
      controls
      clickToPlay
      showVolumeControls={false}
      style={{
        width: "100%",
        aspectRatio: `${ESCRITORIO_W} / ${ESCRITORIO_H}`,
      }}
    />
  );
};

document
  .querySelectorAll<HTMLElement>("[data-escritorio-player]")
  .forEach((el) => {
    createRoot(el).render(
      <VideoEscritorio
        baseUrl={el.dataset.baseUrl ?? "video/img/"}
        host={el}
      />,
    );
  });
