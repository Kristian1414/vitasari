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

## Prerender: HTML jadi untuk mesin pencari

`npm run build` berjalan tiga langkah (lihat `scripts/build.js`):

1. **Build klien** ke `dist/` — yang dijalankan browser.
2. **Build server** ke `dist-ssr/` — aplikasi yang sama, disiapkan untuk Node.
3. **Prerender** (`scripts/prerender.js`) — menjalankan aplikasi itu di Node,
   lalu menyimpan hasilnya sebagai HTML biasa: `dist/index.html`,
   `dist/menu/index.html`, `dist/cabang/index.html`, `dist/tentang/index.html`,
   satu halaman per cabang (`dist/cabang/buah-batu/index.html`, dst.), dan
   `dist/404.html`.

Sebelumnya server hanya mengirim `<div id="root"></div>` kosong, dan seluruh isi
halaman baru ada setelah JavaScript selesai berjalan. Google memang menjalankan
JavaScript, tapi di antrean kedua yang jauh lebih lambat; perayap lain sering
tidak sampai ke sana. Sekarang teks, nama produk, dan alamat cabang sudah ada di
HTML yang pertama dikirim.

Situsnya tetap satu aplikasi React: begitu JavaScript hidup, `src/main.jsx`
menghidupkan markup itu (hydrate) dan perpindahan antarhalaman tetap tanpa muat
ulang. Judul dan deskripsi tiap halaman ditulis dua kali dari sumber yang sama
(`src/data/site.js`): oleh `scripts/seo-head.js` saat build, dan oleh
`src/components/Seo.jsx` saat berpindah halaman.

Dua hal yang perlu diingat kalau mengubah kode:

- **Halaman baru wajib didaftarkan di `PAGE_META`** (`src/data/site.js`) selain
  ditambahkan ke `<Routes>` di `App.jsx`. Dari situlah prerender dan sitemap
  mengambil daftar halamannya.
- **Halaman tiap cabang dibuat otomatis** dari `src/data/branches.js`: cabang
  baru di sana langsung mendapat halaman `/cabang/<id>`, judul, data terstruktur,
  dan baris sitemap-nya sendiri. `id` cabang jadi alamat halamannya, jadi jangan
  diganti setelah halamannya terindeks Google.
- **Jangan membaca `window`, `document`, atau `localStorage` saat render.**
  Di langkah prerender tidak ada browser. Taruh di dalam `useEffect`, atau beri
  penjaga `typeof window === 'undefined'` seperti di `src/hooks/useLocalStorage.js`.

## Deploy ke Hostinger (vitasari.id)

```bash
npm run build -- --base=/
```

Lalu unggah **seluruh isi** folder `dist/` ke `public_html`, termasuk
subfolder `menu/`, `cabang/` (beserta folder tiap cabang di dalamnya),
`tentang/`, dan berkas `.htaccess` yang tersembunyi. Tanpa subfolder-subfolder
itu, halaman selain beranda membalas 404.

`.htaccess` juga mengalihkan `http://` dan `www.` ke `https://vitasari.id`, jadi
sertifikat SSL di Hostinger harus sudah aktif sebelum berkas ini diunggah.

Setelah diunggah, daftarkan `https://vitasari.id/sitemap.xml` di
[Google Search Console](https://search.google.com/search-console) supaya halaman
baru cepat dirayapi.

Jalankan perintah di atas lewat **PowerShell atau CMD**, jangan Git Bash: Git Bash
mengubah `--base=/` menjadi path Windows, dan hasil build-nya salah alamat.

## Deploy ke GitHub Pages

Setiap `git push` ke branch `main` otomatis mem-build dan menerbitkan website
lewat GitHub Actions (`.github/workflows/deploy.yml`). Tidak perlu perintah
tambahan.

Alamat website: **https://kristian1414.github.io/vitasari/**

Salinan ini sengaja ditutup dari mesin pencari lewat `robots.txt` (`Disallow: /`),
yang ditulis otomatis saat base bukan `/`. Isinya sama persis dengan vitasari.id,
dan dua alamat berisi hal yang sama akan saling memperebutkan peringkat yang sama
di Google. Yang boleh diindeks hanya domain resmi.

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
| Halaman | Beranda, Menu, Cabang, halaman tiap cabang, Tentang, dan halaman 404 |

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

### Foto versi web (WebP)

Foto produk asli berukuran besar (total ±15 MB). Untuk ditampilkan di website,
`npm run build` otomatis membuat versi WebP 360px dan 720px di
`public/images/products-web/` (total ±1,3 MB untuk versi 360px), dan browser
memilih ukuran yang pas. Foto asli tetap dipakai sebagai cadangan. Untuk membuatnya
tanpa build: `node scripts/buat-foto-web.mjs`.

Foto produk baru cukup ditaruh di `public/images/products/`; versi WebP-nya ikut
dibuat saat build berikutnya.

Tiga gambar latar halaman (`hero-bg.jpg`, `hero.jpg`, `about.jpg`) masih memakai foto
stok Unsplash. Detail sumber ada di `docs/SUMBER-FOTO.md`, checklist file di
`docs/DAFTAR-FOTO.md`.

## Catatan

- Nama, harga, dan foto produk berasal dari katalog WhatsApp Business resmi Vitasari per 20 Agustus 2026. Harga bisa berubah sewaktu-waktu, jadi cocokkan lagi secara berkala.
- Nomor WhatsApp diambil dari [linktr.ee/vitasaribakery](https://linktr.ee/vitasaribakery); alamat dan jam buka cabang dari sumber publik. Verifikasi ulang sebelum rilis.
