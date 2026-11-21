import { Audio, Sequence, staticFile } from "remotion";

// Sound effects generated with earshot (https://github.com/Leonxlnx/earshot).
// To regenerate: see public/sfx/README.md.
// Each start frame is aligned to the HelloWorld animation timing.

const TITLE_START = 35; // <Title from={35}>
const WORD_STAGGER = 5; // Title.tsx: each word starts index * 5 frames later

export const SoundEffects: React.FC<{ readonly titleText: string }> = ({
  titleText,
}) => {
  const words = titleText.split(" ");

  return (
    <>
      {/* Logo scales in at frame 0 */}
      <Sequence name="SFX: logo pop" layout="none">
        <Audio src={staticFile("sfx/logo-pop.wav")} volume={0.9} />
      </Sequence>

      {/* Logo rises at frames 25-55; the whoosh peaks ~0.85s in, so start at 15 */}
      <Sequence name="SFX: whoosh up" from={15} layout="none">
        <Audio src={staticFile("sfx/whoosh-up.wav")} volume={0.6} />
      </Sequence>

      {/* One tick per title word */}
      {words.map((word, i) => (
        <Sequence
          key={`${word}-${i}`}
          name={`SFX: word tick ${i + 1}`}
          from={TITLE_START + i * WORD_STAGGER}
          layout="none"
        >
          <Audio src={staticFile("sfx/word-tick.wav")} volume={0.7} />
        </Sequence>
      ))}

      {/* Editing hint fades in at frame 75 */}
      <Sequence name="SFX: hint chime" from={75} layout="none">
        <Audio src={staticFile("sfx/hint-chime.wav")} volume={0.4} />
      </Sequence>

      {/* Content fades out at frames 125-135; reverse whoosh peaks ~1.42s in */}
      <Sequence name="SFX: outro" from={88} layout="none">
        <Audio src={staticFile("sfx/outro-whoosh.wav")} volume={0.5} />
      </Sequence>
    </>
  );
};
