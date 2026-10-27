"""
Membuat versi PNG tanpa latar dari setiap foto produk.

    python scripts/buat-png-produk.py            # hanya foto yang belum punya PNG
    python scripts/buat-png-produk.py --ulang    # buat ulang semuanya
    python scripts/buat-png-produk.py --rapikan  # rapikan ulang PNG yang sudah ada,
                                                 # tanpa menjalankan model lagi

Sumber : public/images/products/*.jpg|jpeg
Hasil  : public/images/products-png/<nama>.png

Latar dihapus dengan model BiRefNet lewat rembg (berjalan di komputer sendiri,
tanpa layanan luar). Serpihan kecil yang terpisah dari produk utama (potongan
benda di tepi foto, logo yang melayang) dibuang, lalu hasilnya dipotong rapat
ke tepi produk, diberi sedikit ruang, dan diperkecil ke sisi terpanjang 900 px. Setelah ini jalankan
`node scripts/kompres-png-produk.mjs` untuk mengecilkan ukuran berkasnya.

Foto aslinya tidak diubah sama sekali.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

AKAR = Path(__file__).resolve().parent.parent
SUMBER = AKAR / "public/images/products"
TUJUAN = AKAR / "public/images/products-png"
SISI_MAKS = 900
RUANG = 0.04  # ruang kosong di sekeliling produk, relatif terhadap sisi terpanjang


SERPIHAN = 0.3  # kelompok terpisah yang luasnya < 30% kelompok terbesar dibuang


def buang_serpihan(gambar: Image.Image) -> Image.Image:
    """Hapus bagian-bagian kecil yang tidak menyatu dengan produk utama."""
    alfa = np.array(gambar.getchannel("A"))
    # Bagian-bagian yang berdekatan digabung dulu jadi satu kelompok (dilasi
    # selebar ~3% sisi gambar), supaya beberapa potong roti yang berjajar
    # dihitung satu produk -- sedangkan potongan benda di pojok foto, yang
    # letaknya jauh, tetap jadi kelompok kecil tersendiri.
    jarak = max(6, int(max(alfa.shape) * 0.03))
    padat = ndimage.binary_dilation(alfa > 96, iterations=jarak)
    label, jumlah = ndimage.label(padat)
    if jumlah <= 1:
        return gambar
    luas = ndimage.sum(padat, label, index=range(1, jumlah + 1))
    simpan = {i + 1 for i, l in enumerate(luas) if l >= luas.max() * SERPIHAN}
    topeng = np.isin(label, list(simpan))
    alfa = np.where(topeng, alfa, 0).astype(np.uint8)
    hasil = gambar.copy()
    hasil.putalpha(Image.fromarray(alfa))
    return hasil


def potong_rapat(gambar: Image.Image) -> Image.Image:
    alfa = gambar.getchannel("A")
    # Abaikan piksel yang nyaris transparan supaya bayangan tipis sisa model
    # tidak ikut melebarkan kotak potongnya.
    kotak = alfa.point(lambda v: 255 if v > 24 else 0).getbbox()
    if not kotak:
        return gambar
    gambar = gambar.crop(kotak)
    w, h = gambar.size
    pad = int(max(w, h) * RUANG)
    kanvas = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    kanvas.paste(gambar, (pad, pad))
    kanvas.thumbnail((SISI_MAKS, SISI_MAKS), Image.LANCZOS)
    return kanvas


def rapikan_semua() -> None:
    for berkas in sorted(TUJUAN.glob("*.png")):
        gambar = Image.open(berkas).convert("RGBA")
        potong_rapat(buang_serpihan(gambar)).save(berkas)
        print(f"dirapikan: {berkas.name}", flush=True)


def main() -> None:
    if "--rapikan" in sys.argv:
        rapikan_semua()
        return

    # Diimpor di sini supaya --rapikan tetap jalan tanpa rembg terpasang.
    from rembg import new_session, remove

    ulang = "--ulang" in sys.argv
    TUJUAN.mkdir(parents=True, exist_ok=True)
    berkas = sorted(p for p in SUMBER.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"})
    sesi = new_session("birefnet-general")

    for i, sumber in enumerate(berkas, 1):
        hasil = TUJUAN / (sumber.stem + ".png")
        if hasil.exists() and not ulang:
            continue
        potongan = remove(Image.open(sumber).convert("RGB"), session=sesi)
        potong_rapat(buang_serpihan(potongan)).save(hasil)
        print(f"[{i}/{len(berkas)}] {hasil.name}", flush=True)


if __name__ == "__main__":
    main()
