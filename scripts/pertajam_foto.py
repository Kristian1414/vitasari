"""
Potong thumbnail produk dari screenshot katalog WhatsApp, lalu pertajam dengan
super-resolution EDSR (x4) dari OpenCV.

Sumbernya hanya 145x145 piksel, jadi hasil akhirnya tidak akan setajam foto
asli. Namun EDSR memberi tepi yang jauh lebih bersih dibanding pembesaran biasa
(lanczos), tanpa membuat permukaan roti terlihat seperti lilin sebagaimana yang
terjadi kalau peredaman derau dipakai lebih dulu.

Alur: potong dari screenshot asli -> EDSR x4 -> unsharp mask ringan -> JPEG.

Menjalankan:
    pip install numpy opencv-contrib-python
    python scripts/pertajam_foto.py

Model EDSR_x4.pb diunduh otomatis ke scripts/models/ pada penggunaan pertama.
"""
import json
import subprocess
import sys
import urllib.request
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
MENU_DIR = ROOT / "menu"
OUT_DIR = ROOT / "public" / "images" / "products"
MODEL_DIR = Path(__file__).resolve().parent / "models"
MODEL_PATH = MODEL_DIR / "EDSR_x4.pb"
MODEL_URL = "https://github.com/Saafke/EDSR_Tensorflow/raw/master/models/EDSR_x4.pb"

# Kolom thumbnail pada screenshot (lebar layar 720 px)
X0, X1 = 30, 175
OUT_SIZE = 580          # 4x dari 145 px, keluaran penuh EDSR
JPEG_QUALITY = 88


def unduh_model() -> None:
    if MODEL_PATH.exists():
        return
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Mengunduh model EDSR_x4 (~38 MB) ke {MODEL_PATH} ...")
    urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)


def baca_katalog() -> list:
    """Ambil tabel produk dari katalog-vitasari.cjs lewat Node."""
    skrip = (
        "const {S, items} = require(String.raw`"
        + str(Path(__file__).resolve().parent / "katalog-vitasari.cjs")
        + "`); console.log(JSON.stringify({S, items}));"
    )
    hasil = subprocess.run(
        ["node", "-e", skrip], capture_output=True, text=True, check=True
    )
    return json.loads(hasil.stdout)


def deteksi_baris(img: np.ndarray) -> list:
    """Cari batas atas-bawah tiap thumbnail lewat keragaman warna per baris."""
    kolom = img[:, X0:X1:3]
    abu = kolom.mean(axis=2)
    rentang = abu.max(axis=1) - abu.min(axis=1)
    terang = abu.max(axis=1)
    ada_isi = (rentang > 22) | (terang > 70)

    baris, mulai = [], None
    for y in range(170, len(ada_isi)):
        if ada_isi[y] and mulai is None:
            mulai = y
        elif not ada_isi[y] and mulai is not None:
            if y - mulai >= 120:
                baris.append((mulai, y - 1))
            mulai = None
    if mulai is not None and len(ada_isi) - mulai >= 100:
        baris.append((mulai, len(ada_isi) - 1))
    return baris


def unsharp(img: np.ndarray, sigma: float = 1.1, kekuatan: float = 0.55) -> np.ndarray:
    """Unsharp mask ringan untuk mengembalikan ketegasan setelah EDSR."""
    kabur = cv2.GaussianBlur(img, (0, 0), sigma)
    tajam = cv2.addWeighted(img, 1 + kekuatan, kabur, -kekuatan, 0)
    return np.clip(tajam, 0, 255).astype(np.uint8)


def main() -> None:
    unduh_model()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    katalog = baca_katalog()
    lembar, produk = katalog["S"], katalog["items"]

    sr = cv2.dnn_superres.DnnSuperResImpl.create()
    sr.readModel(str(MODEL_PATH))
    sr.setModel("edsr", 4)

    # Muat tiap screenshot sekali saja, sekalian deteksi barisnya
    cache = {}
    for kunci, berkas in lembar.items():
        img = cv2.imread(str(MENU_DIR / berkas))
        if img is None:
            sys.exit(f"Screenshot tidak terbaca: {berkas}")
        cache[kunci] = (img, deteksi_baris(img))

    berhasil, gagal = 0, []
    total = len(produk)

    for n, (slug, nama, _harga, _unit, _kategori, sheet, idx) in enumerate(produk, 1):
        img, baris = cache[sheet]

        if idx < len(baris):
            atas, bawah = baris[idx]
        elif sheet == "a" and idx == 7:
            # Baris terakhir screenshot pertama terpotong tepi layar
            atas, bawah = 1481, img.shape[0] - 1
        else:
            gagal.append(f"{slug} (lembar {sheet} baris {idx})")
            continue

        sisi = min(145, bawah - atas + 1)
        kiri = X0 + (145 - sisi) // 2
        potong = img[atas:atas + sisi, kiri:kiri + sisi]

        besar = sr.upsample(potong)
        besar = unsharp(besar)
        if besar.shape[0] != OUT_SIZE:
            besar = cv2.resize(besar, (OUT_SIZE, OUT_SIZE), interpolation=cv2.INTER_AREA)

        cv2.imwrite(
            str(OUT_DIR / f"{slug}.jpg"),
            besar,
            [cv2.IMWRITE_JPEG_QUALITY, JPEG_QUALITY, cv2.IMWRITE_JPEG_PROGRESSIVE, 1],
        )
        berhasil += 1
        print(f"  [{n:>2}/{total}] {slug}", flush=True)

    print(f"\n{berhasil} foto dipertajam ke {OUT_DIR} ({OUT_SIZE}x{OUT_SIZE})")
    if gagal:
        print("GAGAL:\n  " + "\n  ".join(gagal))


if __name__ == "__main__":
    main()
