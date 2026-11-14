"""Edita a narração: corta as pausas longas, acelera de leve e gera a linha do tempo do vídeo.

Entrada: narracao-original/narracao_voz_feminina.wav
Saída:   public/audio/narracao.wav e src/JulianoPinturas/timeline.json (frames a 30 fps)
Run: python3 scripts/narration.py
"""
import json
import subprocess

SRC = "narracao-original/narracao_voz_feminina.wav"
TEMPO = 1.1  # fala 10% mais rápida, sem mudar o tom
FPS = 30
LEAD = 0.35  # segundos antes da primeira palavra
TAIL = 1.6  # segundos depois da última palavra

# Trechos de fala (segundos no arquivo original), detectados por silêncio.
# Cada grupo = uma frase do roteiro; trechos de uma lista ficam mais juntos.
GROUPS = [
    ("hook", [(0.256, 3.393)]),  # Precisando de pintura, reforma ou manutenção?
    ("conheca", [(3.763, 5.964)]),  # Então conheça Juliano Pinturas.
    ("profissional", [(6.323, 8.919)]),  # Um só profissional, vários serviços.
    ("pintura", [(9.412, 11.406)]),
    ("automotiva", [(11.888, 15.066)]),
    ("reformas", [(15.585, 16.601)]),
    ("hidraulica", [(17.149, 19.729)]),
    ("eletrica", [(20.417, 21.164), (21.551, 23.318)]),
    ("mais", [(23.807, 25.015), (25.436, 26.537), (26.833, 27.976), (28.418, 29.670), (30.086, 31.396)]),
    ("valores", [(31.905, 35.606)]),
    ("precisou", [(36.089, 37.281)]),
    ("chame", [(37.605, 40.967), (41.385, 41.870), (42.057, 43.192), (43.509, 44.223), (44.458, 44.941)]),
    ("final", [(45.495, 46.587), (47.013, 49.110)]),
]
GAP_GROUP = 0.22
GAP_INNER = 0.1

pieces = []  # (src_start, src_end, out_start)
out = LEAD
timeline = {}
for gi, (name, segs) in enumerate(GROUPS):
    if gi:
        out += GAP_GROUP
    g_start = out
    parts = []
    for si, (a, b) in enumerate(segs):
        if si:
            out += GAP_INNER
        pieces.append((a, b, out))
        parts.append(round(out / TEMPO * FPS))
        out += b - a
    timeline[name] = {
        "start": round(g_start / TEMPO * FPS),
        "end": round(out / TEMPO * FPS),
        "parts": parts,
    }
total_s = (out + TAIL) / TEMPO
timeline["_total"] = int(total_s * FPS) + 1

# Monta o áudio: cada trecho com atraso absoluto, mixados e então acelerados
filters, labels = [], []
for i, (a, b, o) in enumerate(pieces):
    ms = int(o * 1000)
    filters.append(f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st={b - a - 0.02}:d=0.02,adelay={ms}|{ms}[p{i}]")
    labels.append(f"[p{i}]")
filters.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0,apad=whole_dur={out + TAIL},atempo={TEMPO},loudnorm=I=-16:TP=-1.5[out]")
subprocess.run(
    ["ffmpeg", "-loglevel", "error", "-y", "-i", SRC, "-filter_complex", ";".join(filters), "-map", "[out]", "-ar", "48000", "-ac", "2", "public/audio/narracao.wav"],
    check=True,
)
json.dump(timeline, open("src/JulianoPinturas/timeline.json", "w"), indent=1)
print(json.dumps(timeline))
print("total", round(total_s, 2), "s")
