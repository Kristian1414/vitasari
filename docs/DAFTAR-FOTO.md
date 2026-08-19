# Daftar Foto

## Foto produk

Foto produk **sudah lengkap** (84 file), dipotong otomatis dari screenshot
katalog WhatsApp Business Vitasari di folder `menu/`, lalu dipertajam dengan
super-resolution EDSR.

Untuk membuat ulang setelah mengubah `scripts/katalog-vitasari.cjs`:

```bash
pip install numpy opencv-contrib-python
python scripts/pertajam_foto.py      # potong + pertajam -> 580x580
node scripts/buat-products-js.cjs    # tulis ulang src/data/products.js
```

Thumbnail sumbernya 145 px, diperbesar 4x jadi 580x580. Kalau Vitasari punya
file foto aslinya, timpa saja file di `public/images/products/` dengan nama
yang sama untuk hasil terbaik.

## Foto halaman

- [ ] `public/images/hero-bg.jpg` — latar hero beranda (1920x1080) — masih foto stok
- [ ] `public/images/hero.jpg` — foto bulat hero (1000x1000) — masih foto stok
- [ ] `public/images/about.jpg` — halaman Tentang (800x1000) — masih foto stok

## Daftar file produk

### Roti Manis (24)

- `cheese-roll.jpg` — Cheese Roll
- `sausage-brood.jpg` — Sausage Brood
- `roti-coklat.jpg` — Roti Coklat
- `roti-vanila.jpg` — Roti Vanila
- `roti-durian.jpg` — Roti Durian
- `roti-sarikaya.jpg` — Roti Sarikaya
- `roti-kismis.jpg` — Roti Kismis
- `roti-pisang-coklat.jpg` — Roti Pisang Coklat
- `roti-jagung.jpg` — Roti Jagung
- `roti-susu.jpg` — Roti Susu
- `roti-keju.jpg` — Roti Keju
- `roti-sosis.jpg` — Roti Sosis
- `roti-kopi-moka.jpg` — Roti Kopi Moka
- `egg-cheese.jpg` — Egg Cheese
- `nangka-coklat.jpg` — Nangka Coklat
- `nangka-keju.jpg` — Nangka Keju
- `roti-mentega-manis.jpg` — Roti Mentega Manis
- `roti-abon-ayam.jpg` — Roti Abon Ayam
- `pizza-sosis.jpg` — Pizza Sosis
- `pizza-ayam.jpg` — Pizza Ayam
- `roti-baso-ayam.jpg` — Roti Baso Ayam
- `roti-susana.jpg` — Roti Susana
- `roti-sobek-5-rasa.jpg` — Roti Sobek 5 Rasa
- `roti-buaya-3-rasa.jpg` — Roti Buaya 3 Rasa

### Roti Tawar & Sisir (5)

- `roti-tawar-kecil.jpg` — Roti Tawar Kecil
- `roti-tawar-gandum.jpg` — Roti Tawar Gandum
- `roti-sisir.jpg` — Roti Sisir
- `roti-tawar-besar.jpg` — Roti Tawar Besar
- `roti-tawar-coklat.jpg` — Roti Tawar Coklat

### Cake & Bolu (29)

- `lapis-malang-spesial.jpg` — Lapis Malang Spesial
- `brownies-choco-lava.jpg` — Brownies Leleh Choco Lava
- `bolu-pandan-keju.jpg` — Bolu Pandan Keju
- `bolu-taro-blubery.jpg` — Bolu Taro Blubery
- `bolu-pandan-sarikaya.jpg` — Bolu Pandan Sarikaya
- `cake-bread.jpg` — Cake Bread
- `fruit-bar.jpg` — Fruit Bar
- `cheese-cake-panjang.jpg` — Cheese Cake Panjang
- `bolu-jadoel.jpg` — Bolu Jadoel
- `klappertaart-premium.jpg` — Klappertaart Premium
- `bolu-gulung-coklat.jpg` — Bolu Gulung Besar Coklat
- `bolu-gulung-strawberry.jpg` — Bolu Gulung Besar Strawberry
- `brownies-panggang-almond.jpg` — Brownies Panggang Almond
- `tart-keju-15.jpg` — Tart Keju 15 cm
- `blackforest-15.jpg` — Blackforest 15 cm
- `blackforest-model-baru.jpg` — Black Forest Model Baru
- `blackforest-siram-coklat.jpg` — Blackforest Siram Coklat
- `cheesecake.jpg` — Cheesecake
- `rainbow-cake.jpg` — Rainbow Cake 15x15
- `tart-siram-coklat-20.jpg` — Tart Siram Coklat 20 cm
- `tart-lingkar-stroberi-20.jpg` — Tart Lingkar Stroberi 20 cm
- `tart-moca-20.jpg` — Tart Moca 20 cm
- `tart-mocca-messes-20.jpg` — Tart Mocca Messes 20 cm
- `blackforest-motif.jpg` — Blackforest Motif
- `dark-choco-20.jpg` — Dark Choco 20 cm
- `fruit-cake.jpg` — Fruit Cake
- `fruit-cake-model-baru.jpg` — Fruit Cake Model Baru
- `lapis-malang.jpg` — Lapis Malang Hias
- `cake-dekor-baby.jpg` — Cake Dekor Baby

### Jajanan Pasar (14)

- `soes-cream.jpg` — Soes Cream
- `soes-fla-ori.jpg` — Soes Fla Ori
- `banana-milk.jpg` — Banana Milk
- `moci-kacang-ijo.jpg` — Moci Kacang Ijo
- `bapau.jpg` — Bapau
- `sus-mini-isi-5.jpg` — Sus Mini Isi 5
- `bika-ambon-cup.jpg` — Bika Ambon Cup
- `moci-kacang-merah.jpg` — Moci Kacang Merah
- `soes-dus-fla.jpg` — Soes Dus Fla
- `puding-lumut.jpg` — Puding Lumut
- `bika-ambon-dus.jpg` — Bika Ambon Dus
- `puding-blackforest.jpg` — Puding Blackforest
- `jajanan-pasar-nampan.jpg` — Jajanan Pasar (Kue Nampan)
- `jajanan-pasar-nampan-100.jpg` — Jajanan Pasar (Kue Nampan)

### Pastry & Pie (10)

- `pia-satuan.jpg` — Pia Satuan
- `pia-lancar.jpg` — Pia Lancar
- `pia-sp-roll.jpg` — Pia SP Roll
- `pia-suroboyo.jpg` — Pia Suroboyo
- `pizzatos.jpg` — Pizzatos
- `bolen-pisang-coklat.jpg` — Bolen Pisang Coklat
- `bolen-pisang-keju.jpg` — Bolen Pisang Keju
- `molen-tape-box.jpg` — Molen Tape Box
- `abon-roll.jpg` — Abon Roll
- `banana-crispy.jpg` — Banana Crispy

### Pelengkap (2)

- `lilin.jpg` — Lilin Ulang Tahun
- `lilin-spiral.jpg` — Lilin Spiral
