"""Gera a trilha e os efeitos sonoros do EP. 02 (100% sintetizados, sem samples de terceiros).

Uso:  python3 scripts/synth-audio.py   -> grava em public/audio/ep02/*.wav
Determinístico: o ruído usa seed fixa.
"""
import os
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "ep02")
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(2)


def write(name, x, gain=0.9):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    peak = np.max(np.abs(x)) or 1.0
    x = x / peak * gain
    data = (x * 32767).astype(np.int16)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def t_(sec):
    return np.arange(int(SR * sec)) / SR


def env(n, a, d):
    t = np.arange(n) / SR
    e = np.minimum(t / max(a, 1e-4), 1.0) * np.exp(-np.maximum(t - a, 0) / d)
    return e


def lowpass(x, cutoff):
    # filtro 1 polo simples
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ---------------- trilha lo-fi / corporate leve (38 s, 96 BPM) ----------------
DUR = 38.0
BPM = 96
beat = 60 / BPM
N = int(SR * DUR)
mix = np.zeros((N, 2))

chords = [  # Fmaj9, Em7, Dm9, Cmaj7 (voicings em MIDI)
    [53, 57, 60, 64, 67],
    [52, 55, 59, 62, 66],
    [50, 53, 57, 60, 64],
    [48, 52, 55, 59, 62],
]
bass = [41, 40, 38, 36]


def epiano(freq, dur):
    t = t_(dur)
    x = (
        np.sin(2 * np.pi * freq * t)
        + 0.35 * np.sin(2 * np.pi * 2 * freq * t) * np.exp(-t * 3)
        + 0.12 * np.sin(2 * np.pi * 3 * freq * t) * np.exp(-t * 6)
    )
    trem = 1 + 0.08 * np.sin(2 * np.pi * 4.5 * t)
    return x * trem * env(len(t), 0.01, 1.4)


bar = 4 * beat
nbars = int(DUR / bar) + 1
for b in range(nbars):
    start = b * bar
    ch = chords[b % 4]
    for hit, length in [(0, 2.2 * beat), (2.5 * beat, 1.4 * beat)]:
        s0 = int(SR * (start + hit))
        for k, m in enumerate(ch):
            note = epiano(midi(m), length + 0.6) * 0.09
            pan = 0.35 + 0.3 * (k / (len(ch) - 1))
            e = min(N, s0 + len(note))
            if s0 >= N:
                continue
            mix[s0:e, 0] += note[: e - s0] * (1 - pan)
            mix[s0:e, 1] += note[: e - s0] * pan
    # baixo
    for hit in [0, 1.5 * beat, 2 * beat]:
        s0 = int(SR * (start + hit))
        if s0 >= N:
            continue
        t = t_(beat * 1.2)
        note = np.sin(2 * np.pi * midi(bass[b % 4]) * t) * env(len(t), 0.005, 0.35) * 0.22
        e = min(N, s0 + len(note))
        mix[s0:e] += note[: e - s0, None]

# bateria macia
nbeats = int(DUR / beat) + 1
for i in range(nbeats):
    s0 = int(SR * i * beat)
    if s0 >= N:
        break
    if i % 2 == 0:  # kick
        t = t_(0.35)
        f = 110 * np.exp(-t * 18) + 45
        k = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, 0.12) * 0.42
        e = min(N, s0 + len(k))
        mix[s0:e] += k[: e - s0, None]
    else:  # snare/clap suave
        t = t_(0.25)
        sn = lowpass(rng.standard_normal(len(t)), 3500) * env(len(t), 0.002, 0.07) * 0.22
        e = min(N, s0 + len(sn))
        mix[s0:e] += sn[: e - s0, None]
    for half in (0, 0.5):  # chimbal
        h0 = int(SR * (i + half) * beat)
        t = t_(0.06)
        hh = np.diff(rng.standard_normal(len(t) + 1)) * env(len(t), 0.001, 0.015) * 0.05
        e = min(N, h0 + len(hh))
        if h0 < N:
            mix[h0:e] += hh[: e - h0, None]

# chiado de vinil bem baixo
mix += lowpass(rng.standard_normal(N), 2500)[:, None] * 0.004
# fade in/out
fade = np.ones(N)
fi, fo = int(SR * 0.8), int(SR * 2.0)
fade[:fi] = np.linspace(0, 1, fi)
fade[-fo:] = np.linspace(1, 0, fo)
mix *= fade[:, None]
write("music.wav", mix, 0.8)

# ---------------- efeitos ----------------
# pop (check / entrada de item)
t = t_(0.14)
f = 520 + 900 * (1 - np.exp(-t * 40))
write("pop.wav", np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, 0.04), 0.7)

# clique do cursor
t = t_(0.06)
c = np.sin(2 * np.pi * 1800 * t) * env(len(t), 0.0005, 0.008) + 0.4 * rng.standard_normal(len(t)) * env(len(t), 0.0005, 0.004)
write("click.wav", c, 0.8)

# tecla (digitação)
t = t_(0.04)
k = lowpass(rng.standard_normal(len(t)), 5000) * env(len(t), 0.0005, 0.006) + 0.5 * np.sin(2 * np.pi * 2600 * t) * env(len(t), 0.0005, 0.004)
write("key.wav", k, 0.5)

# tique de número rolando (sequência que desacelera, ~0,9 s)
seq = np.zeros(int(SR * 0.95))
times = np.cumsum(np.linspace(0.035, 0.11, 12))
for tt in times:
    s0 = int(SR * tt)
    tk = t_(0.02)
    blip = np.sin(2 * np.pi * 3200 * tk) * env(len(tk), 0.0005, 0.004)
    e = min(len(seq), s0 + len(blip))
    seq[s0:e] += blip[: e - s0]
write("tick.wav", seq, 0.45)

# swoosh (transições / wipe)
t = t_(0.55)
noise = rng.standard_normal(len(t))
sweep = np.zeros_like(noise)
acc = 0.0
for i, v in enumerate(noise):
    cut = 300 + 5000 * np.sin(np.pi * i / len(t)) ** 2
    a = np.exp(-2 * np.pi * cut / SR)
    acc = (1 - a) * v + a * acc
    sweep[i] = acc
sweep *= np.sin(np.pi * np.arange(len(t)) / len(t)) ** 1.5
write("whoosh.wav", sweep, 0.55)

# chime (resultado)
t = t_(1.1)
ch = sum(np.sin(2 * np.pi * midi(m) * t) * np.exp(-t * (3 + i)) for i, m in enumerate([84, 88, 91]))
write("chime.wav", ch * env(len(t), 0.003, 0.5), 0.55)

# punch / thud (impacto do zoom)
t = t_(0.3)
f = 160 * np.exp(-t * 25) + 50
th = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, 0.09)
write("thud.wav", th, 0.8)

# sparkle (estouro de partículas)
t = t_(0.8)
sp = np.zeros_like(t)
for i, m in enumerate([96, 100, 103, 108, 103, 108]):
    s0 = int(SR * i * 0.05)
    tt = t[: len(t) - s0]
    sp[s0:] += np.sin(2 * np.pi * midi(m) * tt) * np.exp(-tt * 9)
write("sparkle.wav", sp, 0.45)

# subida (barra de progresso, 1,5 s)
t = t_(1.5)
f = 300 + 500 * (t / t[-1]) ** 1.3
rise = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.3 + 0.7 * t / t[-1]) * env(len(t), 0.05, 5)
rise[-int(SR * 0.05):] *= np.linspace(1, 0, int(SR * 0.05))
write("rise.wav", rise, 0.3)

print("ok ->", os.path.abspath(OUT))
