# Vitasari Bakery — Website

Website toko roti **Vitasari Bakery** Bandung (terpercaya sejak 1991), dibuat dengan **React + Vite (JavaScript)** dan CSS murni. Responsive, punya fitur keranjang yang tersimpan di `localStorage`, dan pemesanan yang dikirim otomatis ke WhatsApp cabang pilihan pelanggan.

## Menjalankan

```bash
npm install      # sekali saja
npm run dev      # buka http://localhost:5173/vitasari/
npm run build    # build produksi ke folder dist/
npm run preview  # cek hasil build di http://localhost:4173/vitasari/
```

Alamatnya memakai akhiran `/vitasari/` karena website ini dilayani dari subfolder
di GitHub Pages. Base path yang sama dipakai saat pengembangan supaya perilakunya
persis sama dengan hasil akhirnya.

## Deploy ke GitHub Pages

Setiap `git push` ke branch `main` otomatis mem-build dan menerbitkan website
lewat GitHub Actions (`.github/workflows/deploy.yml`). Tidak perlu perintah
tambahan.

Alamat website: **https://kristian1414.github.io/vitasari/**

Pengaturan yang perlu dilakukan sekali di GitHub:
Settings -> Pages -> Source, pilih **GitHub Actions**.

Kalau nama repositori diganti, ubah juga `REPO_NAME` di `vite.config.js`.

## Fitur

| Fitur | Keterangan |
| --- | --- |
| Katalog produk | 84 produk, 6 kategori, ada pencarian + filter kategori + urutkan harga |
| Add to cart | Tambah/kurangi jumlah dari kartu produk maupun dari drawer keranjang |
| Keranjang persisten | Isi keranjang disimpan di `localStorage` (key `vitasari:cart`), tidak hilang saat refresh atau browser ditutup, dan tersinkron antar tab |
| Order via WhatsApp | Klik **Order Now** → pilih cabang → daftar pesanan otomatis terisi di chat WhatsApp cabang tersebut |
| Responsive | Desktop, tablet, dan HP (ada bar keranjang menempel di bawah layar HP) |
| Halaman | Beranda, Menu, Cabang, Tentang, dan halaman 404 |

## Alur pemesanan

1. Pelanggan menambahkan produk ke keranjang.
2. Klik **Order Now via WhatsApp** di drawer keranjang.
3. Muncul pilihan **7 cabang** Vitasari (lengkap dengan alamat dan jam buka), plus kolom nama pemesan, metode pengambilan, dan catatan.
4. Tab WhatsApp cabang terbuka dengan pesan yang sudah terisi otomatis, misalnya:

```
Halo *Vitasari Bakery Cabang Buah Batu*, saya ingin memesan:

*DAFTAR PESANAN*
1. *2x* Roti Coklat Keju — Rp 18.000  (@Rp 9.000)
2. *1x* Bolu Jadul Panggang — Rp 73.000

*TOTAL 3 ITEM: Rp 91.000*

*DATA PEMESAN*
Nama: Chris
Metode: Ambil di toko (pick up)
Catatan: diambil jam 4 sore

Mohon dikonfirmasi ketersediaan dan totalnya ya. Terima kasih!
_Dikirim otomatis dari website Vitasari Bakery_
```

Satu produk satu baris, jumlahnya dicetak tebal di depan, dan harga satuan hanya
muncul kalau jumlahnya lebih dari satu — supaya admin cepat membacanya.

Pelanggan tinggal menekan tombol kirim di WhatsApp.

## Struktur folder

```
src/
├── components/     Navbar, Footer, CartDrawer, CheckoutModal, ProductCard, Toast, Icons
├── context/        CartContext.jsx — seluruh state keranjang
├── data/           products.js & branches.js — SEMUA data ada di sini
├── hooks/          useLocalStorage.js
├── pages/          Home, Menu, Branches, About
├── styles/         global.css — satu file untuk seluruh tampilan
└── utils/          format.js (rupiah), whatsapp.js (penyusun pesan)
```

## Cara mengubah data

- **Produk & harga** → `src/data/products.js`
- **Cabang & nomor WhatsApp** → `src/data/branches.js` (nomor pakai format `62…` tanpa `+` atau spasi)
- **Warna, font, jarak** → variabel CSS di bagian `:root` pada `src/styles/global.css`

## Foto dan data produk

Nama, harga, dan foto seluruh **84 produk** berasal dari **katalog WhatsApp Business
resmi Vitasari** (screenshot di folder `menu/`, diambil 20 Agustus 2026).

Foto dipotong dari screenshot tersebut lalu dipertajam dengan super-resolution EDSR:

```bash
pip install numpy opencv-contrib-python
python scripts/pertajam_foto.py      # potong + pertajam -> 580x580
node scripts/buat-products-js.cjs    # tulis ulang src/data/products.js
```

Tabel produknya ada di `scripts/katalog-vitasari.cjs` — berisi nama, harga, kategori,
dan letak thumbnail tiap produk pada screenshot. Ubah di sana lalu jalankan ulang
skrip di atas.

> Thumbnail sumbernya hanya 145 px, diperbesar 4x jadi **580x580** memakai model EDSR.
> Hasilnya jauh lebih bersih dibanding pembesaran biasa, tapi tetap bukan setajam foto
> asli. Kalau Vitasari punya file foto aslinya, timpa saja file di
> `public/images/products/` dengan nama yang sama — tidak perlu mengubah kode.

Tiga gambar latar halaman (`hero-bg.jpg`, `hero.jpg`, `about.jpg`) masih memakai foto
stok Unsplash. Detail sumber ada di `docs/SUMBER-FOTO.md`, checklist file di
`docs/DAFTAR-FOTO.md`.

## Catatan

- Nama, harga, dan foto produk berasal dari katalog WhatsApp Business resmi Vitasari per 20 Agustus 2026. Harga bisa berubah sewaktu-waktu, jadi cocokkan lagi secara berkala.
- Nomor WhatsApp diambil dari [linktr.ee/vitasaribakery](https://linktr.ee/vitasaribakery); alamat dan jam buka cabang dari sumber publik. Verifikasi ulang sebelum rilis.
