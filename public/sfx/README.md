# Sound effects

Generated with [earshot](https://github.com/Leonxlnx/earshot) (MIT; sounds are yours to use).

```bash
pip install "earshot @ git+https://github.com/Leonxlnx/earshot"
cd public/sfx
earshot make "a soft bright pop as a logo appears" -o logo-pop.wav
earshot make "a smooth short whoosh, upward swoosh for motion graphics" -o whoosh-up.wav
earshot make "a soft subtle ui tick for a word popping in" -o word-tick.wav
earshot make "a gentle soft chime notification" -o hint-chime.wav
earshot make "a soft airy reverse whoosh fade out" -o outro-whoosh.wav
```

Each run renders a new take. Use `--seed N` to make it reproducible, `--n 3` for variations,
and `earshot sounds` to browse the catalogue. Timing lives in `src/HelloWorld/SoundEffects.tsx`.
