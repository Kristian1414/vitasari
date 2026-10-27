/**
 * Membuat versi foto produk yang ringan untuk ditampilkan di web.
 *
 *   node scripts/buat-foto-web.mjs          # hanya yang belum ada / sudah usang
 *   node scripts/buat-foto-web.mjs --ulang  # buat ulang semuanya
 *
 * Sumber : public/images/products/<nama>.jpg|jpeg|png
 * Hasil  : public/images/products-web/<nama>-360.webp
 *          public/images/products-web/<nama>-720.webp
 *
 * Foto aslinya berukuran 1080-1800px dan 100 KB-1 MB, padahal di kartu produk
 * tampil selebar ~250px. Versi WebP 360px dan 720px biasanya 85-90% lebih
 * kecil; browser memilih sendiri yang pas lewat `srcset` (lihat
 * src/components/ProductImage.jsx). Foto asli tidak diubah dan tetap dipakai
 * sebagai cadangan untuk browser yang tidak mendukung WebP.
 *
 * Dijalankan otomatis oleh `npm run build` (scripts/build.js), jadi foto
 * produk baru cukup ditaruh di public/images/products/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export const LEBAR = [360, 720];

const akar = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sumberDir = path.join(akar, 'public/images/products');
const tujuanDir = path.join(akar, 'public/images/products-web');

export async function buatFotoWeb({ ulang = false, diam = false } = {}) {
  fs.mkdirSync(tujuanDir, { recursive: true });
  const berkas = fs.readdirSync(sumberDir).filter((f) => /\.(jpe?g|png)$/i.test(f));
  let dibuat = 0;
  let sebelum = 0;
  let sesudah = 0;

  for (const nama of berkas) {
    const sumber = path.join(sumberDir, nama);
    const stem = nama.replace(/\.[^.]+$/, '');
    const waktuSumber = fs.statSync(sumber).mtimeMs;

    for (const lebar of LEBAR) {
      const hasil = path.join(tujuanDir, `${stem}-${lebar}.webp`);
      // Lewati kalau sudah ada dan lebih baru dari fotonya.
      if (!ulang && fs.existsSync(hasil) && fs.statSync(hasil).mtimeMs >= waktuSumber) continue;

      await sharp(sumber)
        .rotate()
        .resize(lebar, lebar, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 78, effort: 5 })
        .toFile(hasil);

      dibuat += 1;
      if (lebar === LEBAR[0]) sebelum += fs.statSync(sumber).size;
      if (lebar === LEBAR[0]) sesudah += fs.statSync(hasil).size;
    }
  }

  if (!diam) {
    if (dibuat === 0) {
      console.log('Foto web: semua sudah terbaru.');
    } else {
      const mb = (n) => (n / 1048576).toFixed(1);
      console.log(
        `Foto web: ${dibuat} berkas dibuat` +
          (sebelum ? ` (versi ${LEBAR[0]}px: ${mb(sebelum)} MB -> ${mb(sesudah)} MB)` : ''),
      );
    }
  }
}

// Dijalankan langsung dari terminal.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buatFotoWeb({ ulang: process.argv.includes('--ulang') });
}
