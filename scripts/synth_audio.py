"""Synthesize the original soundtrack (120 BPM electronic) and SFX for the Juliano Pinturas spot.
All audio is generated here, so there are no licensing concerns.
Run: python3 scripts/synth_audio.py  (writes into public/audio/)
"""
import wave
import numpy as np

SR = 44100
BPM = 120
BEAT = 60 / BPM
BAR = BEAT * 4
DUR = 30.0
rng = np.random.default_rng(7)
OUT = "public/audio/"


def write(name, x, peak=0.9):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    m = np.abs(x).max() or 1
    x = x / m * peak
    pcm = (x * 32767).astype(np.int16)
    with wave.open(OUT + name, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def t_(d):
    return np.arange(int(d * SR)) / SR


def onepole_lp(x, fc):
    """One-pole low-pass; fc may be scalar or per-sample array."""
    fc = np.broadcast_to(np.asarray(fc, float), x.shape)
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)):
        s += a[i] * (x[i] - s); y[i] = s
    return y


def fft_band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))


def saw(freq, t, nh=10):
    return sum(np.sin(2 * np.pi * freq * k * t) / k for k in range(1, nh + 1))


def mtof(m):
    return 440 * 2 ** ((m - 69) / 12)


# ---------- instruments ----------
def kick():
    t = t_(0.4)
    f = 45 + 95 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) + 0.3 * np.exp(-t * 300) * rng.standard_normal(len(t)) * 0.3


def clap():
    t = t_(0.25)
    n = fft_band(rng.standard_normal(len(t)), 900, 5000)
    env = np.zeros_like(t)
    for d in (0, 0.01, 0.02):
        env += (t >= d) * np.exp(-np.clip(t - d, 0, None) * 60)
    env += np.exp(-t * 14) * 0.4
    return n * env


def hat(open_=False):
    t = t_(0.18 if open_ else 0.05)
    n = fft_band(rng.standard_normal(len(t)), 7000, 16000)
    return n * np.exp(-t * (18 if open_ else 90))


def pluck(freq):
    t = t_(0.3)
    return (np.sin(2 * np.pi * freq * t) + 0.4 * saw(freq, t, 5)) * np.exp(-t * 14)


KICK, CLAP, HAT, OHAT = kick(), clap(), hat(), hat(True)

# A minor: Am F C G
CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
ROOTS = [33, 29, 36, 31]

N = int(DUR * SR)
L = np.zeros(N); R = np.zeros(N)


def add(buf, x, at, g=1.0):
    i = int(at * SR)
    j = min(N, i + len(x))
    if i < N:
        buf[i:j] += x[: j - i] * g


def both(x, at, g=1.0, pan=0.0):
    add(L, x, at, g * (1 - pan) if pan > 0 else g)
    add(R, x, at, g * (1 + pan) if pan < 0 else g)


nbars = int(DUR / BAR)
FULL = lambda b: (2 <= b <= 9) or (11 <= b <= 13)
BREAK = lambda b: b == 10

# sidechain envelope
t_all = np.arange(N) / SR
since_beat = np.mod(t_all, BEAT)
pump = 1 - 0.65 * np.exp(-since_beat / 0.11)

pad = np.zeros(N); bass = np.zeros(N); arp = np.zeros(N)
for b in range(nbars):
    t0 = b * BAR
    ch = CHORDS[b % 4]; root = ROOTS[b % 4]
    last = b == nbars - 1
    # pad (additive detuned saws)
    tt = t_(BAR)
    p = sum(saw(mtof(n) * d, tt, 7) for n in ch for d in (0.996, 1.004))
    bright = 0.35 if b < 2 else (0.6 if BREAK(b) else 1.0)
    p = fft_band(p, 80, 900 + 2200 * bright)
    if last:
        p *= np.exp(-tt * 0.9)
    pad[int(t0 * SR): int(t0 * SR) + len(p)] += p[: N - int(t0 * SR)]
    for beat in range(4):
        tb = t0 + beat * BEAT
        if last and beat >= 1:
            continue
        if not BREAK(b):
            both(KICK, tb, 1.0)
        if FULL(b) and beat in (1, 3):
            both(CLAP, tb, 0.35)
        if not BREAK(b):
            both(OHAT, tb + BEAT / 2, 0.18, 0.2)
        for s in range(4):
            if FULL(b):
                both(HAT, tb + s * BEAT / 4, 0.12 if s % 2 else 0.07, -0.3)
            # bass 8ths
            if s % 2 == 0 and not BREAK(b):
                f = mtof(root + (12 if s == 2 else 0))
                bt = t_(BEAT / 2 * 0.9)
                bx = fft_band(saw(f, bt, 6), 30, 700) * np.exp(-bt * 3)
                add(bass, bx, tb + s * BEAT / 4)
            # arp 16ths
            if FULL(b) and b >= 3:
                n = ch[(beat * 4 + s) % 3] + 12 * (1 + (s % 2))
                add(arp, pluck(mtof(n)), tb + s * BEAT / 4, 0.6)

# riser in breakdown bar (20-22s)
rt0 = 10 * BAR
rt = t_(BAR)
noise = rng.standard_normal(len(rt))
riser = onepole_lp(noise, 300 + 9000 * (rt / BAR) ** 2) * (rt / BAR) ** 1.5
riser += 0.3 * np.sin(2 * np.pi * np.cumsum(200 + 800 * (rt / BAR) ** 2) / SR) * (rt / BAR)
both(riser, rt0, 0.5)
# snare roll before drop
for k in range(16):
    both(CLAP, rt0 + BAR / 2 + k * BEAT / 8, 0.15 + 0.35 * k / 16)

# final impact at 28s (bar 14 beat 0)
fin_t = 14 * BAR
ft = t_(2.0)
boom = np.sin(2 * np.pi * np.cumsum(40 + 60 * np.exp(-ft * 10)) / SR) * np.exp(-ft * 2.2)
both(boom, fin_t, 1.4)

L += pad * pump * 0.11 + bass * pump * 0.32 + arp * 0.035
R += pad * pump * 0.11 + bass * pump * 0.32 + arp * 0.035
# gentle fade in/out
fade = np.ones(N)
fade[: int(0.05 * SR)] = np.linspace(0, 1, int(0.05 * SR))
fo = int(1.2 * SR); fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
mix = np.stack([L * fade, R * fade], 1)
mix = np.tanh(mix / np.abs(mix).max() * 1.6) / np.tanh(1.6)
write("trilha.wav", mix, 0.85)

# ---------- SFX ----------
def whoosh(d=0.45, lo=400, hi=5000):
    t = t_(d); x = rng.standard_normal(len(t))
    env = np.sin(np.pi * (t / d)) ** 2
    fc = lo + (hi - lo) * np.sin(np.pi * t / d)
    y = onepole_lp(x, fc) - onepole_lp(x, fc * 0.25)
    return y * env

write("whoosh.wav", whoosh())
t = t_(0.06)
write("click.wav", np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 120) + 0.4 * rng.standard_normal(len(t)) * np.exp(-t * 400))
print("ok")
