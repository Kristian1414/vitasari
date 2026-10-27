/**
 * Build produksi: empat langkah yang harus berurutan.
 *
 *   0. Foto web     -> public/images/products-web/ (WebP ringan, lihat
 *                      scripts/buat-foto-web.mjs; hanya yang belum ada)
 *   1. Build klien  -> dist/       (yang dijalankan browser)
 *   2. Build server -> dist-ssr/   (aplikasi yang sama, untuk dijalankan Node)
 *   3. Prerender    -> dist/*.html (HTML jadi tiap halaman, memakai nomor 2)
 *
 * Dipakai lewat `npm run build`. Argumen tambahan diteruskan ke kedua build
 * Vite, sehingga cara lama tetap berlaku:
 *
 *   npm run build -- --base=/     # untuk Hostinger (situs di akar domain)
 */

import { build } from 'vite';
import { buatFotoWeb } from './buat-foto-web.mjs';

/** Ambil --base dari argumen baris perintah, kalau ada. */
const argBase = process.argv.slice(2).find((arg) => arg.startsWith('--base='));
const base = argBase ? argBase.slice('--base='.length) : undefined;

// Base yang sama wajib dipakai kedua build. Kalau berbeda, alamat gambar di
// HTML hasil prerender tidak akan cocok dengan tempat berkasnya benar-benar
// berada, dan seluruh foto produk gagal dimuat.
const opsi = base ? { base } : {};

// Harus sebelum build klien, karena Vite menyalin isi public/ ke dist/.
await buatFotoWeb();

await build(opsi);

await build({
  ...opsi,
  build: {
    ssr: 'src/entry-server.jsx',
    outDir: 'dist-ssr',
  },
});

await import('./prerender.js');
