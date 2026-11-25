"""Gera src/ryvo/sync.ts a partir das 20 falas (public/audio/falas/01.wav … 20.wav).

- Cada fala é um arquivo: o plano começa no início real da fala (sem estimativa).
- Tempo de cada palavra: reconhecimento de voz (Vosk, modelo pt) salvo em
  scripts/falas_palavras.json, alinhado com o texto certo; palavras que o reconhecedor
  não pegou são interpoladas entre as vizinhas.
- Silêncio do começo/fim de cada arquivo é cortado; as pausas entre falas são definidas aqui.
- Velocidade do áudio e do vídeo NUNCA é alterada.
Rodar: python3 scripts/sync_falas.py
"""
import difflib
import json
import re
import subprocess

FPS = 30
DIR = "public/audio/falas"
TEXT = {
    "01a": "Uma marca", "01b": "não precisa apenas aparecer.",
    "02": "Ela precisa ser lembrada.", "03": "Sua marca merece mais.",
    "04": "Motion design.", "05": "Transformamos ideias em movimento,",
    "06": "criando vídeos e animações", "07": "e experiências visuais que capturam a atenção.",
    "08": "Design gráfico.", "09": "Criamos identidades visuais", "10": "e conteúdos digitais",
    "11": "que fortalecem a presença e a personalidade das marcas.",
    "12": "Impressos.", "13": "E levamos sua comunicação além das telas,",
    "14": "com materiais gráficos e publicitários", "15": "que dão vida à sua marca.",
    "16": "RYVO.", "17": "Criatividade que vai além do visual.",
    "18": "Sua próxima ideia começa aqui.", "19": "Vamos conversar?",
    "20": "Solicite seu orçamento pelo WhatsApp.",
}
# a fala 01 é dividida na pausa natural depois de "marca" (0,60s no arquivo)
SPLIT01 = 0.60
# 04, 08 e 12 (títulos "Motion design.", "Design gráfico.", "Impressos.") ficaram de fora a
# pedido do Kayke para o vídeo caber em ~40s — as etiquetas das seções continuam na tela.
ORDER = ["01a", "01b", "02", "03", "05", "06", "07", "09", "10", "11",
         "13", "14", "15", "16", "17", "18", "19", "20"]
# pausa depois de cada fala (s): mínima dentro da frase, um pouco maior na troca de cena
GAP = {"01a": 0.2, "01b": 0.25, "02": 0.15, "03": 0.3, "05": 0.05, "06": 0.05,
       "07": 0.3, "09": 0.05, "10": 0.05, "11": 0.3, "13": 0.05,
       "14": 0.05, "15": 0.35, "16": 0.2, "17": 0.2, "18": 0.15, "19": 0.15}
START, HOLD = 0.6, 0.8


def speech_bounds(path):
    """início e fim da fala no arquivo (corta silêncio das pontas, -40 dB)."""
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-ac", "1", "-ar", "16000",
                          "-f", "f32le", "-"], capture_output=True).stdout
    import numpy as np
    x = np.frombuffer(raw, np.float32)
    hop = 160
    env = np.array([np.sqrt((x[i:i + hop] ** 2).mean() + 1e-12) for i in range(0, len(x) - hop, hop)])
    db = 20 * np.log10(env)
    act = np.where(db > db.max() - 40)[0]
    return max(0, act[0] * 0.01 - 0.02), min(len(x) / 16000, act[-1] * 0.01 + 0.06)


def norm(w):
    w = w.lower()
    w = re.sub(r"[^a-záéíóúâêôãõçà]", "", w)
    return {"ryvo": "rivo", "design": "dizain", "designer": "dizain"}.get(w, w)


REC = json.load(open("scripts/falas_palavras.json"))


def word_times(key, a, b):
    """tempos (s, relativos ao início cortado do trecho) de cada palavra do texto."""
    words = TEXT[key].split()
    f = key[:2] + ".wav"
    rec = [(norm(w), s, e) for w, s, e in REC.get(f, [])]
    if key == "01a":
        rec = [r for r in rec if r[1] < SPLIT01]
    if key == "01b":
        rec = [r for r in rec if r[1] >= SPLIT01 - 0.05]
    t = [None] * len(words)
    used = 0
    for i, w in enumerate(words):
        nw = norm(w)
        for j in range(used, len(rec)):
            if difflib.SequenceMatcher(None, nw, rec[j][0]).ratio() >= 0.6:
                t[i] = rec[j][1]
                used = j + 1
                break
    # interpola as que faltaram
    t[0] = a if t[0] is None else max(a, t[0])
    for i in range(1, len(t)):
        if t[i] is None:
            k = next((j for j in range(i + 1, len(t)) if t[j] is not None), None)
            nxt = t[k] if k is not None else b - 0.25
            t[i] = t[i - 1] + (nxt - t[i - 1]) / ((k if k is not None else len(t)) - i + 1)
    return [round(x - a, 3) for x in t]


# monta a linha do tempo
cur = START
clips, W = [], []
for key in ORDER:
    f = f"{DIR}/{key[:2]}.wav"
    a, b = speech_bounds(f)
    if key == "01a":
        b = SPLIT01
    if key == "01b":
        a = SPLIT01
    ts = word_times(key, a, b)
    clips.append([f"audio/falas/{key[:2]}.wav", round(a, 3), round(b, 3), round(cur, 3)])
    for w, t in zip(TEXT[key].split(), ts):
        W.append(dict(w=w, v=round(cur + t, 3), key=key))
    end = cur + (b - a)
    W[-1]["end"] = round(end, 3)
    cur = end + GAP.get(key, 0)
END = round(cur + HOLD, 2)


def first(key):
    return next(x["v"] for x in W if x["key"] == key)


def word(key, w):
    return next(x["v"] for x in W if x["key"] == key and x["w"].startswith(w))


def end_of(key):
    return [x for x in W if x["key"] == key][-1]["end"]


LEAD = 0.15
cuts = [
    ("s01", 0), ("s02", first("01b") - 0.12), ("s03", first("02") - LEAD), ("s04", first("03") - LEAD),
    ("s05", first("05") - LEAD), ("s06", first("06") - LEAD), ("s07", first("07") - LEAD),
    ("s08", first("09") - LEAD), ("s09", first("10") - LEAD), ("s10", first("11") - LEAD),
    ("s11", first("13") - LEAD), ("s12", first("14") - LEAD), ("s13", first("15") - LEAD),
    ("s14", first("16") - 0.4), ("s15", first("18") - LEAD),
]
fr = lambda x: int(round(x * FPS))
st = {k: fr(v) for k, v in cuts}
ids = [k for k, _ in cuts]
frames = {}
for i, k in enumerate(ids):
    nxt = st[ids[i + 1]] if i + 1 < len(ids) else fr(END)
    frames[k] = nxt - st[k]

# legendas (exatamente o que é falado) → falas
CAPS = {
    # "Uma *marca*" (s01) entra junto com a voz pelo próprio plano (start 0.4s), para dar tempo de ler
    "não precisa apenas *aparecer.*": ("s02", "01b"),
    "Ela precisa ser *lembrada.*": ("s03", "02"),
    "Transformamos *ideias* em *movimento,*": ("s05", "05"),
    "criando *vídeos* e *animações*": ("s06", "06"),
    "e experiências visuais que capturam a *atenção.*": ("s07", "07"),
    "Criamos *identidades* *visuais*": ("s08", "09"),
    "e *conteúdos* *digitais*": ("s09", "10"),
    "que fortalecem a *presença* e a *personalidade* das marcas.": ("s10", "11"),
    "E levamos sua comunicação *além* *das* *telas,*": ("s11", "13"),
    "com *materiais* *gráficos* e *publicitários*": ("s12", "14"),
    "que dão *vida* à sua marca.": ("s13", "15"),
    "Criatividade que vai *além* *do* *visual.*": ("s14", "17"),
}
sync = {}
for txt, (sid, key) in CAPS.items():
    base = st[sid] / FPS
    sync[txt] = [round(max(0, x["v"] - base - 0.05), 2) for x in W if x["key"] == key]

b4, b15 = st["s04"] / FPS, st["s15"] / FPS
head = {"light": round(first("03") - b4, 2), "bold": round(word("03", "merece") - b4, 2)}
final = {
    "light": round(first("18") - b15, 2), "bold": round(word("18", "começa") - b15, 2),
    "button": round(first("19") - b15, 2), "click": round(end_of("19") - b15, 2),
    "pill": round(first("20") - b15, 2), "contacts": round(end_of("20") - b15, 2),
}

out = [
    "// Gerado por scripts/sync_falas.py a partir das 20 falas (public/audio/falas/).",
    "// Tempo das palavras: reconhecimento de voz alinhado ao texto. Velocidade inalterada.",
    "// SYNC: início de cada palavra (s, relativo ao início do plano).",
    "export const SYNC: Record<string, number[]> = {",
]
out += [f"  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v)}," for k, v in sync.items()]
out += [
    "};", "",
    "/** Trechos de áudio: [arquivo, início no arquivo, fim no arquivo, posição no vídeo] (s). */",
    "export const CLIPS: [string, number, number, number][] = " + json.dumps(clips) + ";", "",
    "export const SHOT_FRAMES: Record<string, number> = " + json.dumps(frames) + ";", "",
    "/** Tempos (s, relativos ao plano) do título \"Sua marca merece mais.\" e do encerramento. */",
    "export const HEAD = " + json.dumps(head) + ";",
    "export const FINAL = " + json.dumps(final) + ";", "",
]
open("src/ryvo/sync.ts", "w").write("\n".join(out))
print("total", END, "s")
print({k: round(v / FPS, 2) for k, v in frames.items()})
print(head, final)
for txt, v in sync.items():
    print(f"{CAPS[txt][0]} {v} {txt}")
