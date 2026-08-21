/**
 * Menyiapkan foto untuk bingkai bulat di hero.
 *
 * Foto sumbernya (reference/hero-lingkaran-asli.webp) 1440x1800 piksel, potret,
 * sementara bingkainya bulat alias persegi. Jadi yang dikerjakan skrip ini adalah
 * mengambil potongan persegi selebar penuh dari bagian bawah foto: di situlah
 * cangkir susu dan roti coklat depan berada, dan dua-duanya jatuh utuh di dalam
 * lingkaran tanpa tersentuh tepinya.
 *
 * Potongan itu 1440 piksel, persis sama dengan sisi keluarannya, jadi fotonya
 * TIDAK dibesarkan sama sekali — piksel sumbernya dipakai satu banding satu. Ini
 * hasil paling tajam yang bisa didapat: memperbesar melewati 1440 tidak menambah
 * detail apa pun, cuma menebak piksel baru dan membuat filenya berat. Untuk
 * bingkai selebar 420 piksel di layar, 1440 sudah setara 3,4x DPI.
 *
 * Watermark "Vitasari" di sudut kiri atas foto asli tidak perlu diakali lagi:
 * potongannya mulai dari y=360, sementara watermarknya habis di sekitar y=215,
 * jadi ikut terbuang dengan sendirinya.
 *
 * Kalau suatu saat fotonya diganti, setel POTONG lalu periksa hasilnya sebagai
 * lingkaran — bukan sebagai persegi — karena keempat sudutnya pasti terbuang.
 *
 * Jalankan dengan:  node scripts/buat-hero-lingkaran.cjs
 */
const path = require('node:path');
const fs = require('node:fs');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const MASUKAN = path.join(ROOT, 'reference/hero-lingkaran-asli.webp');
const KELUARAN = path.join(ROOT, 'public/images/hero-lingkaran.jpeg');

/** Sisi keluaran. Sengaja disamakan dengan lebar potongan supaya tidak ada
   pembesaran, dan filenya tetap sekelas foto hero lain di situs. */
const SISI = 1440;

/** Potongan persegi selebar penuh, diambil dari dasar foto potretnya. */
const POTONG = { x: 0, y: 360, sisi: 1440 };

/** Batas bawah watermark "Vitasari" di foto asli, hasil pengukuran. Potongannya
   harus mulai di bawah garis ini supaya watermarknya tidak ikut terbawa. */
const WATERMARK_BATAS_BAWAH = 215;

async function main() {
  const { width, height } = await sharp(MASUKAN).metadata();

  if (POTONG.x + POTONG.sisi > width || POTONG.y + POTONG.sisi > height) {
    throw new Error(`Potongan keluar dari foto ${width}x${height}.`);
  }

  if (POTONG.y < WATERMARK_BATAS_BAWAH) {
    throw new Error(
      `Potongan mulai di y=${POTONG.y}, masih kena watermark yang habis di ` +
        `y=${WATERMARK_BATAS_BAWAH}. Turunkan POTONG.y.`,
    );
  }

  if (SISI > POTONG.sisi) {
    throw new Error(
      `Keluaran ${SISI} px lebih besar dari potongan ${POTONG.sisi} px. Itu cuma ` +
        'menebak piksel baru, bukan menambah detail. Kecilkan SISI.',
    );
  }

  await sharp(MASUKAN)
    .extract({ left: POTONG.x, top: POTONG.y, width: POTONG.sisi, height: POTONG.sisi })
    .resize(SISI, SISI, { kernel: 'lanczos3' })
    // Penajaman tipis untuk mengembalikan ketegasan tepi yang hilang saat
    // dikompresi ulang. Fotonya sendiri sengaja dipotret dengan latar lembut
    // (bokeh), jadi penajaman kuat malah merusak kesan itu dan memunculkan garis
    // putih (halo) di tepi roti.
    .sharpen({ sigma: 0.6, m1: 0.4, m2: 2 })
    // Kualitas dinaikkan sedikit karena sumbernya WebP yang sudah lossy —
    // kompresi kedua di atas kompresi pertama perlu ruang lebih.
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(KELUARAN);

  const { size } = fs.statSync(KELUARAN);
  console.log(
    `Potongan ${POTONG.sisi}x${POTONG.sisi} dari y=${POTONG.y} (watermark habis di ` +
      `y=${WATERMARK_BATAS_BAWAH}), tanpa pembesaran.`,
  );
  console.log(
    `Selesai: ${path.relative(ROOT, KELUARAN)} ${SISI}x${SISI}, ${Math.round(size / 1024)} KB`,
  );
}

main().catch((galat) => {
  console.error(`\n${galat.message}\n`);
  process.exit(1);
});
