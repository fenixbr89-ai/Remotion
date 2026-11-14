"""Gera trilha ambiente e efeitos sonoros discretos (sem dependências externas além do numpy)."""
import numpy as np, wave, os
SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    st = np.stack([x, x], axis=1) if x.ndim == 1 else x
    data = (st * 32767).astype(np.int16)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())

def lowpass(x, a):
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += a[i] * (v - acc) if hasattr(a, "__len__") else a * (v - acc); y[i] = acc
    return y

# Trilha: acordes suaves (pad) 46s, progressão C - Am - F - G, com leve arpejo
dur = 46.0
t = np.arange(int(SR * dur)) / SR
def note(f): return 440 * 2 ** ((f - 69) / 12)
chords = [[48, 55, 60, 64, 67], [45, 52, 57, 60, 64], [41, 48, 53, 57, 60], [43, 50, 55, 59, 62]]
seg = 5.75
L = np.zeros_like(t); R = np.zeros_like(t)
for i in range(int(dur / seg) + 1):
    c = chords[i % 4]; s = i * seg
    env = np.clip((t - s) / 1.8, 0, 1) * np.clip((s + seg + 1.8 - t) / 1.8, 0, 1)
    for k, m in enumerate(c):
        f = note(m)
        tone = np.sin(2*np.pi*f*t) + 0.25*np.sin(2*np.pi*2*f*t + 0.3) + 0.08*np.sin(2*np.pi*3*f*t)
        det = np.sin(2*np.pi*f*1.003*t)
        L += env * (tone + 0.5*det) * (0.6 if k % 2 else 0.4)
        R += env * (tone + 0.5*det) * (0.4 if k % 2 else 0.6)
    # arpejo delicado (pluck)
    for j in range(8):
        on = s + j * seg / 8; m = c[(j * 2) % len(c)] + 12
        idx = t >= on
        tt = t[idx] - on
        L[idx] += 0.35*np.sin(2*np.pi*note(m)*tt) * np.exp(-tt*3.5)
        R[idx] += 0.35*np.sin(2*np.pi*note(m)*tt) * np.exp(-tt*3.5)
master = np.clip(t / 2, 0, 1) * np.clip((dur - t) / 3, 0, 1)
save("trilha.wav", np.stack([L*master, R*master], axis=1))

# Whoosh: ruído filtrado com varredura
n = int(SR * 0.9); tt = np.arange(n) / SR
noise = rng.standard_normal(n)
cut = 0.02 + 0.25 * np.sin(np.pi * tt / tt[-1]) ** 2
w = lowpass(noise, cut) - lowpass(noise, cut * 0.15)
save("whoosh.wav", w * np.sin(np.pi * tt / tt[-1]) ** 2)

# Pincelada (escova suave)
n = int(SR * 1.4); tt = np.arange(n) / SR
b = lowpass(rng.standard_normal(n), 0.12) - lowpass(rng.standard_normal(n), 0.01)
save("pincelada.wav", b * np.sin(np.pi * tt / tt[-1]) * (0.7 + 0.3*np.sin(2*np.pi*3*tt)))

# Tick / pop discreto
n = int(SR * 0.25); tt = np.arange(n) / SR
save("pop.wav", np.sin(2*np.pi*(900 - 500*tt/tt[-1])*tt) * np.exp(-tt*28))

# Chime para a logo
n = int(SR * 3.5); tt = np.arange(n) / SR
ch = sum(a*np.sin(2*np.pi*f*tt)*np.exp(-tt*d) for f, a, d in [(1046.5,1,1.6),(1568,0.6,2.2),(2093,0.35,3),(2637,0.2,3.5)])
save("chime.wav", ch * np.clip(tt/0.005, 0, 1))
print("ok")
