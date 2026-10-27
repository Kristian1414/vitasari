"""
Membuat tepi "sapuan kuas kering" untuk bagian bawah hero.

    python scripts/buat-tepi-sobek.py

Hasil: src/assets/tepi-hero.png -- gambar hitam dengan transparansi, dipakai
sebagai mask di global.css (.hero::after), jadi warnanya diatur dari CSS.

Cara kerjanya: garis tepi dasarnya bergelombang pelan, lalu di sekitar garis
itu ditambahkan noise berlapis (gumpalan besar sampai butiran halus) sehingga
tepinya kasar dan berdebu seperti sapuan kuas kering, ditambah cipratan
gumpalan kecil di atasnya. Ganti SEED untuk mendapat bentuk lain.
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

SEED = 11
W, H = 2400, 260  # lebar besar supaya tetap halus di layar lebar
TUJUAN = Path(__file__).resolve().parent.parent / "src/assets/tepi-hero.png"

rng = np.random.default_rng(SEED)


def noise_2d(skala_x, skala_y):
    """Value noise halus: grid acak kecil yang diperbesar dengan interpolasi."""
    gx, gy = max(2, int(W / skala_x)), max(2, int(H / skala_y))
    grid = rng.random((gy + 3, gx + 3))
    besar = ndimage.zoom(grid, ((H + 3 * skala_y) / grid.shape[0], (W + 3 * skala_x) / grid.shape[1]), order=3)
    return besar[:H, :W] * 2 - 1


def noise_1d(skala, amplitudo):
    titik = rng.random(int(W / skala) + 4)
    return ndimage.zoom(titik, (W + 4 * skala) / len(titik), order=3)[:W] * 2 * amplitudo - amplitudo


# Garis tepi dasar: lekuk besar + lekuk sedang.
y = np.arange(H)[:, None].astype(float)
tepi = H * 0.58 + noise_1d(520, 34) + noise_1d(140, 14) + noise_1d(40, 5)

# Jarak tiap piksel dari garis tepi (positif = di bawah garis = terisi).
jarak = y - tepi[None, :]

# Tepi kasar berdebu: noise berlapis dari gumpalan besar sampai butiran halus,
# sedikit direntangkan ke samping seperti bekas sapuan kuas.
kasar = (
    noise_2d(150, 60) * 24
    + noise_2d(48, 22) * 13
    + noise_2d(16, 8) * 7
    + noise_2d(5, 3) * 4
    + rng.normal(0, 3.2, (H, W))  # butiran seperti tepung
)
nilai = jarak + kasar
alfa = np.clip((nilai + 2) / 4, 0, 1)

# Cipratan: gumpalan kecil tak beraturan di atas tepi, makin jauh makin jarang.
gumpal = noise_2d(7, 6) + rng.normal(0, 0.18, (H, W))
peluang = np.exp(-np.clip(-jarak, 0, None) / 16)
ciprat = (gumpal > 1.0 - 0.3 * peluang) & (jarak < 0) & (peluang > 0.04)
alfa = np.maximum(alfa, ciprat.astype(float))

# Bersihkan baris paling bawah supaya pasti penuh.
alfa[-6:, :] = 1

rgba = np.zeros((H, W, 4), dtype=np.uint8)
rgba[..., 3] = (alfa * 255).astype(np.uint8)
Image.fromarray(rgba, "RGBA").save(TUJUAN, optimize=True)
print(TUJUAN.name, TUJUAN.stat().st_size // 1024, "KB")
