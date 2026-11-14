"""Remove flat/gradient backgrounds from 3D icon images (region grow from borders)."""
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

def cutout(src, dst, step=7.0, maxdist=70.0):
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.float32)
    h, w, _ = a.shape
    bg = np.zeros((h, w), bool)
    border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    ref = np.median(border, axis=0)
    q = deque()
    for x in range(w):
        q.append((0, x)); q.append((h - 1, x))
    for y in range(h):
        q.append((y, 0)); q.append((y, w - 1))
    for y, x in q:
        bg[y, x] = True
    while q:
        y, x = q.popleft()
        c = a[y, x]
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not bg[ny, nx]:
                n = a[ny, nx]
                if np.abs(n - c).max() < step and np.abs(n - ref).max() < maxdist:
                    bg[ny, nx] = True
                    q.append((ny, nx))
    alpha = Image.fromarray(((~bg) * 255).astype(np.uint8))
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    out = im.convert("RGBA")
    out.putalpha(alpha)
    out = out.crop(out.getbbox())
    out.save(dst)

if __name__ == "__main__":
    cutout(sys.argv[1], sys.argv[2], float(sys.argv[3]) if len(sys.argv) > 3 else 7.0,
           float(sys.argv[4]) if len(sys.argv) > 4 else 70.0)
