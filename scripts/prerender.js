/**
 * Menuliskan HTML jadi untuk tiap halaman ke folder dist.
 *
 * Situs ini aplikasi React satu halaman: yang dikirim server semula hanya
 * <div id="root"></div> kosong, dan seluruh isinya -- judul, nama produk,
 * alamat cabang -- baru ada setelah JavaScript selesai berjalan di browser.
 * Google memang bisa menjalankan JavaScript, tapi itu antrean kedua yang jauh
 * lebih lambat, dan perayap lain (Bing, pratinjau tautan) sering tidak sampai
 * ke sana sama sekali.
 *
 * Script ini menjalankan aplikasi yang sama di Node saat build, lalu menyimpan
 * hasilnya sebagai berkas HTML biasa: dist/index.html, dist/menu/index.html,
 * dan seterusnya. Isinya tetap satu aplikasi React yang sama -- begitu
 * JavaScript hidup, main.jsx "menghidupkan" markup itu (hydrate) dan perpindahan
 * antarhalaman kembali berlangsung tanpa memuat ulang seperti sebelumnya.
 *
 * Dijalankan scripts/build.js sesudah build klien dan build server selesai.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PAGE_META } from '../src/data/site.js';
import { buatHead } from './seo-head.js';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(rootDir, 'dist');

/**
 * `String.replace` memperlakukan "$&" dan "$1" di teks pengganti sebagai
 * rujukan ke hasil pencocokan. HTML hasil render bisa memuat pola itu (mis. di
 * dalam teks harga), jadi penggantinya diberikan sebagai fungsi -- bentuk yang
 * dijamin dipakai apa adanya.
 */
const gantiPenanda = (html, penanda, isi) => {
  if (!html.includes(penanda)) {
    throw new Error(`Penanda ${penanda} tidak ditemukan di index.html`);
  }

  return html.replace(penanda, () => isi);
};

const { render } = await import(pathToFileURL(path.join(rootDir, 'dist-ssr', 'entry-server.js')));

// index.html hasil build dipakai sebagai cetakan untuk semua halaman, termasuk
// untuk menimpa dirinya sendiri sebagai beranda. Karena itu dibaca lebih dulu,
// sebelum satu pun berkas ditulis.
const cetakan = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

const tulisHalaman = (rute, tujuan) => {
  const html = gantiPenanda(
    gantiPenanda(cetakan, '<!--head-->', buatHead(rute)),
    '<!--app-html-->',
    render(rute),
  );

  const berkas = path.join(distDir, tujuan);
  fs.mkdirSync(path.dirname(berkas), { recursive: true });
  fs.writeFileSync(berkas, html);

  const ukuran = (Buffer.byteLength(html) / 1024).toFixed(1);
  console.log(`  ${tujuan.padEnd(24)} ${ukuran.padStart(6)} kB   (${rute})`);
};

console.log('\nPrerender halaman:');

for (const rute of Object.keys(PAGE_META)) {
  // "/menu" ditulis sebagai "menu/index.html" supaya server melayaninya di
  // alamat /menu tanpa perlu akhiran ".html" yang terlihat di bilah alamat.
  tulisHalaman(rute, rute === '/' ? 'index.html' : path.join(rute.slice(1), 'index.html'));
}

// Halaman untuk alamat yang tidak dikenal. Di GitHub Pages berkas inilah yang
// dilayani saat alamatnya tidak cocok dengan berkas mana pun; di Hostinger
// urusan itu ditangani public/.htaccess. Rutenya sengaja alamat yang pasti tidak
// terdaftar, supaya yang dirender komponen NotFound.
tulisHalaman('/404', '404.html');

// Mencegah GitHub memproses hasil build dengan Jekyll.
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
