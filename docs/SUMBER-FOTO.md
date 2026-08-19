# Sumber Foto

## Foto produk — katalog resmi Vitasari

Seluruh 84 foto di `public/images/products/` dipotong dari **katalog WhatsApp
Business resmi Vitasari** (screenshot di folder `menu/`, diambil 20 Agustus 2026).
Nama dan harga produk juga berasal dari sana.

Pemotongan dan penajaman dilakukan otomatis:

```bash
pip install numpy opencv-contrib-python
python scripts/pertajam_foto.py      # potong + pertajam -> 580x580
node scripts/buat-products-js.cjs    # tulis ulang src/data/products.js
```

Tabel produk (nama, harga, kategori, letak thumbnail di screenshot) ada di
`scripts/katalog-vitasari.cjs`.

**Alur penajaman:** thumbnail di layar katalog hanya 145x145 piksel. Foto dipotong
langsung dari screenshot asli (bukan dari hasil olahan, supaya tidak ada kompresi
ganda), diperbesar 4x memakai model super-resolution **EDSR** dari OpenCV, lalu
diberi unsharp mask ringan. Hasilnya 580x580.

Metode lain sempat diuji dan ditinggalkan: lanczos biasa menyisakan tepi kabur dan
efek halo, FSRCNN serta ESPCN hanya sedikit lebih baik, sedangkan meredam derau
sebelum EDSR membuat permukaan roti terlihat seperti lilin.

Model `EDSR_x4.pb` (38 MB) diunduh otomatis ke `scripts/models/` saat pertama kali
skrip dijalankan, dan sengaja tidak ikut masuk repositori.

Kalau Vitasari punya file foto aslinya, timpa saja file di
`public/images/products/` dengan nama yang sama untuk hasil terbaik.

## Foto latar halaman — masih foto stok

| File | Sumber |
| --- | --- |
| `hero-bg.jpg` | [Unsplash photo-1568254183919-78a4f43a2877](https://unsplash.com/photos/1568254183919-78a4f43a2877) |
| `hero.jpg` | [Unsplash photo-1509440159596-0249088772ff](https://unsplash.com/photos/1509440159596-0249088772ff) |
| `about.jpg` | [Unsplash photo-1587241321921-91a834d6d191](https://unsplash.com/photos/1587241321921-91a834d6d191) |

Lisensi: [Unsplash License](https://unsplash.com/license) — bebas dipakai termasuk
untuk keperluan komersial, tanpa kewajiban atribusi.

Unduh ulang: `bash scripts/fetch-stock-photos.sh`

## Logo Halal

`public/images/halal-indonesia.svg` — label "Halal Indonesia" resmi yang dipakai sejak 2022.

- Sumber: [Wikimedia Commons — Halal Indonesia.svg](https://commons.wikimedia.org/wiki/File:Halal_Indonesia.svg)
- Pemilik logo: Badan Penyelenggara Jaminan Produk Halal (BPJPH), Kementerian Agama RI
- Status berkas: domain publik

Nomor sertifikat halal Vitasari diisi pada konstanta `HALAL` di `src/pages/Home.jsx`.
Kalau dibiarkan kosong, baris nomor sertifikat tidak ditampilkan di website.
