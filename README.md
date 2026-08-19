# Vitasari Bakery — Website

Website toko roti **Vitasari Bakery** Bandung (terpercaya sejak 1991), dibuat dengan **React + Vite (JavaScript)** dan CSS murni. Responsive, punya fitur keranjang yang tersimpan di `localStorage`, dan pemesanan yang dikirim otomatis ke WhatsApp cabang pilihan pelanggan.

## Menjalankan

```bash
npm install      # sekali saja
npm run dev      # buka http://localhost:5173
npm run build    # build produksi ke folder dist/
npm run preview  # cek hasil build
```

## Fitur

| Fitur | Keterangan |
| --- | --- |
| Katalog produk | 30 produk, 5 kategori, ada pencarian + filter kategori + urutkan harga |
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

## Foto produk

> ⚠️ **Foto yang terpasang sekarang adalah foto STOK sementara dari [Unsplash](https://unsplash.com/license), bukan produk asli Vitasari.** Sifatnya hanya pengisi supaya tampilan tidak kosong, dan beberapa hanya mirip secara umum (jajanan pasar khas Indonesia tidak tersedia di stok foto). Wajib diganti foto asli sebelum website dipakai pelanggan.

File pendukung:

- `docs/DAFTAR-FOTO.md` — checklist 32 file yang dibutuhkan, dikelompokkan per kategori
- `docs/SUMBER-FOTO.md` — daftar sumber tiap foto stok
- `scripts/fetch-stock-photos.sh` — unduh ulang semua foto stok (`bash scripts/fetch-stock-photos.sh`)

Untuk memasang foto asli, cukup **timpa file yang sudah ada** dengan nama yang sama — tidak perlu mengubah kode. Kalau sebuah file dihapus, kartu produk otomatis kembali memakai placeholder bergradasi.

Nama file mengikuti kolom `image` pada `src/data/products.js`, contoh:

```
public/images/products/roti-coklat-keju.jpg
public/images/hero.jpg      → foto besar di beranda
public/images/about.jpg     → foto di halaman Tentang
```

Ukuran yang disarankan: produk 800×600 px, hero 1000×1000 px (ditampilkan bulat), about 800×1000 px.

## Catatan

- Data produk, deskripsi, dan harga saat ini adalah **contoh** yang disusun dari informasi publik Vitasari Bakery. Silakan sesuaikan dengan daftar harga resmi sebelum website dipakai pelanggan.
- Nomor WhatsApp diambil dari [linktr.ee/vitasaribakery](https://linktr.ee/vitasaribakery); alamat dan jam buka cabang dari sumber publik. Verifikasi ulang sebelum rilis.
