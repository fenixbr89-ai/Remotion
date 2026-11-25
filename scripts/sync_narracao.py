"""Gera src/ryvo/sync.ts a partir da narração (public/audio/narracao-v2.wav).

- Os trechos de fala (fonte) vêm da detecção de pausas do ffmpeg (silencedetect -40dB).
- As pausas longas são cortadas (cada frase é posicionada logo depois da anterior),
  sem mudar a velocidade do áudio nem do vídeo.
- O início de cada palavra é estimado pelas sílabas dentro de cada trecho.
Rodar: python3 scripts/sync_narracao.py
"""
import json
import re

def syl(w):
    w = w.lower().replace("design", "dizain").replace("whatsapp", "uatsap").replace("ryvo", "rivo")
    w = re.sub(r"[^a-záéíóúâêôãõçà]", "", w)
    return max(1, len(re.findall(r"[aeiouáéíóúâêôãõà]+", w)))

# cada frase: lista de trechos de fala (início, fim, palavras) no áudio original
CL = [
    [(0.30, 1.66, "Uma marca não precisa"), (1.77, 2.73, "apenas aparecer.")],
    [(3.14, 4.60, "Ela precisa ser lembrada.")],
    [(5.10, 6.70, "Sua marca merece mais.")],
    [(7.33, 8.25, "Motion design.")],
    [(8.56, 10.58, "Transformamos ideias em movimento,")],
    [(10.89, 12.88, "criando vídeos, animações")],
    [(13.01, 14.69, "e experiências visuais"), (14.86, 15.71, "que capturam"), (15.96, 17.38, "a atenção.")],
    [(17.79, 19.69, "Design gráfico. Criamos identidades"),
     (19.80, 22.82, "visuais e conteúdos digitais que fortalecem a presença"),
     (22.98, 24.65, "e a personalidade das marcas.")],
    [(25.13, 25.81, "Impressos.")],
    [(26.31, 28.95, "E levamos sua comunicação além das telas,"),
     (29.10, 32.55, "com materiais gráficos e publicitários que dão vida à sua marca.")],
    [(33.19, 33.57, "RYVO.")],
    [(33.85, 35.74, "Criatividade que vai além do visual.")],
    [(35.99, 37.83, "Sua próxima ideia começa aqui.")],
    [(38.39, 39.05, "Vamos conversar?")],
    [(39.38, 41.10, "Solicite seu orçamento pelo WhatsApp.")],
]
# pausa mantida depois de cada frase (s): curta dentro da cena, um pouco maior na troca de cena
GAP = [0.4, 0.2, 0.25, 0.12, 0.12, 0.05, 0.25, 0.25, 0.15, 0.45, 0.15, 0.15, 0.2, 0.15]
START, HOLD = 0.8, 0.9
PAD0, PAD1 = 0.03, 0.05

cur = START
clips, W = [], []
for ci, subs in enumerate(CL):
    a = subs[0][0] - PAD0
    b = subs[-1][1] + PAD1
    clips.append([round(a, 3), round(b, 3), round(cur, 3)])
    for s, e, txt in subs:
        ws = txt.split()
        wt = [syl(w) + (0.4 if w[-1] in ",.?" else 0) for w in ws]
        tot, c = sum(wt), s
        for w, x in zip(ws, wt):
            W.append(dict(w=w, v=round(cur + (c - a), 3), clip=ci))
            c += (e - s) * x / tot
    cur += (b - a) + (GAP[ci] if ci < len(GAP) else 0)
END = round(cur + HOLD, 2)
words = [x["w"] for x in W]

def idx(seq):
    seq = seq.split()
    for i in range(len(words)):
        if words[i:i + len(seq)] == seq:
            return i
    raise ValueError(seq)

def vt(seq):
    return W[idx(seq)]["v"]

def vend(seq):
    i = idx(seq) + len(seq.split()) - 1
    j = i + 1
    if j < len(W) and W[j]["clip"] == W[i]["clip"]:
        return W[j]["v"]
    a, b, at = clips[W[i]["clip"]]
    return at + (b - a)

LEAD = 0.15
cuts = [
    ("s01", 0),
    ("s02", vt("apenas aparecer.") - 0.08),  # usa a pausa natural depois de "precisa"
    ("s03", vt("Ela precisa ser") - LEAD),
    ("s04", vt("Sua marca merece") - LEAD),
    ("s05", vt("Motion design.") - LEAD),
    ("s06", vt("criando vídeos,") - LEAD),
    ("s07", vt("e experiências visuais") - LEAD),
    ("s08", vt("Design gráfico.") - LEAD),
    ("s09", vt("e conteúdos digitais") + 0.2),  # deixa "visuais" terminar no plano anterior
    ("s10", vt("e a personalidade") - LEAD),
    ("s11", vt("Impressos.") - LEAD),
    ("s12", vt("com materiais gráficos") - LEAD),
    ("s13", vt("que dão vida") - LEAD),
    ("s14", vt("RYVO.") - 0.35),
    ("s15", vt("Sua próxima ideia") - LEAD),
]
fr = lambda x: int(round(x * 30))
st = {k: fr(v) for k, v in cuts}
ids = [k for k, _ in cuts]
frames = {}
for i, k in enumerate(ids):
    nxt = st[ids[i + 1]] if i + 1 < len(ids) else fr(END)
    frames[k] = nxt - st[k]

# textos exatamente como na v3 aprovada pelo cliente
TEXTS = {
    "s01": ["Uma *marca* não precisa"],
    "s02": ["apenas *aparecer.*"],
    "s03": ["Ela precisa ser *lembrada.*"],
    "s05": ["Transformamos *ideias* em *movimento,*"],
    "s06": ["criando *vídeos,* *animações*"],
    "s07": ["e experiências visuais que capturam a *atenção.*"],
    "s08": ["Criamos *identidades* *visuais*"],
    "s09": ["e *conteúdos* *digitais* que fortalecem a *presença*"],
    "s10": ["e a *personalidade* das marcas."],
    "s11": ["E levamos sua comunicação *além* *das* *telas,*"],
    "s12": ["com *materiais* *gráficos* e *publicitários*"],
    "s13": ["que dão *vida* à sua marca."],
    "s14": ["Criatividade que vai *além* *do* *visual.*"],
}
sync = {}
for sid, lst in TEXTS.items():
    base = st[sid] / 30
    for txt in lst:
        clean = txt.replace("*", "").split()
        i = idx(" ".join(clean))
        sync[txt] = [round(max(0, W[i + k]["v"] - base - 0.05), 2) for k in range(len(clean))]

b4, b15 = st["s04"] / 30, st["s15"] / 30
head = {"light": round(vt("Sua marca merece") - b4, 2), "bold": round(vt("merece mais.") - b4, 2)}
final = {
    "light": round(vt("Sua próxima ideia") - b15, 2),
    "bold": round(vt("começa aqui.") - b15, 2),
    "button": round(vt("Vamos conversar?") - b15, 2),
    "click": round(vend("Vamos conversar?") - b15, 2),
    "pill": round(vt("Solicite seu orçamento") - b15, 2),
    "contacts": round(vend("Solicite seu orçamento pelo WhatsApp.") - b15, 2),
}

out = [
    "// Gerado por scripts/sync_narracao.py a partir de public/audio/narracao-v2.wav",
    "// (pausas longas cortadas; velocidade do áudio e do vídeo inalteradas).",
    "// SYNC: início de cada palavra (s, relativo ao início do plano).",
    "export const SYNC: Record<string, number[]> = {",
]
out += [f"  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v)}," for k, v in sync.items()]
out += [
    "};",
    "",
    "/** Trechos do áudio: [início na fonte, fim na fonte, posição no vídeo] (s). */",
    "export const CLIPS: [number, number, number][] = " + json.dumps(clips) + ";",
    "",
    "export const AUDIO_FILE = \"audio/narracao-v2.wav\";",
    "",
    "export const SHOT_FRAMES: Record<string, number> = " + json.dumps(frames) + ";",
    "",
    "/** Tempos (s, relativos ao plano) do título \"Sua marca merece mais.\" e do encerramento. */",
    "export const HEAD = " + json.dumps(head) + ";",
    "export const FINAL = " + json.dumps(final) + ";",
    "",
]
open("src/ryvo/sync.ts", "w").write("\n".join(out))
print("total", END, "s")
print({k: round(v / 30, 2) for k, v in frames.items()})
print(head, final)
