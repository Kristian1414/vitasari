/**
 * Mengecilkan ukuran berkas PNG produk tanpa latar.
 *
 *   node scripts/kompres-png-produk.mjs
 *
 * Dijalankan sesudah `python scripts/buat-png-produk.py`. PNG hasil potongan
 * bisa mencapai 700 KB per foto; di sini warnanya diringkas ke palet 256 warna
 * (libimagequant lewat sharp) dan sisi terpanjangnya dibatasi 720 px -- cukup
 * tajam untuk kartu produk dan pop up detail di layar retina. Hasilnya biasanya
 * 70-85% lebih kecil dan nyaris tak bisa dibedakan di atas latar gelap.
 *
 * Berkas yang sudah dikompres diberi catatan di .kompres.json supaya tidak
 * dikompres dua kali (kompresi berulang menurunkan mutu).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const akar = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const folder = path.join(akar, 'public/images/products-png');
const catatanPath = path.join(folder, '.kompres.json');
const SISI_MAKS = 720;

const catatan = fs.existsSync(catatanPath) ? JSON.parse(fs.readFileSync(catatanPath, 'utf8')) : {};
let sebelum = 0;
let sesudah = 0;

for (const nama of fs.readdirSync(folder).filter((f) => f.endsWith('.png')).sort()) {
  const berkas = path.join(folder, nama);
  const stat = fs.statSync(berkas);
  if (catatan[nama] === stat.size) continue;

  const hasil = await sharp(berkas)
    .resize(SISI_MAKS, SISI_MAKS, { fit: 'inside', withoutEnlargement: true })
    .png({ palette: true, quality: 88, effort: 10, compressionLevel: 9 })
    .toBuffer();

  // Simpan hanya kalau memang lebih kecil.
  const pakai = hasil.length < stat.size ? hasil : fs.readFileSync(berkas);
  fs.writeFileSync(berkas, pakai);
  catatan[nama] = pakai.length;
  sebelum += stat.size;
  sesudah += pakai.length;
  console.log(`${nama.padEnd(34)} ${(stat.size / 1024).toFixed(0).padStart(5)} KB -> ${(pakai.length / 1024).toFixed(0).padStart(4)} KB`);
}

fs.writeFileSync(catatanPath, JSON.stringify(catatan, null, 2));
if (sebelum) {
  console.log(`\nTotal ${(sebelum / 1048576).toFixed(1)} MB -> ${(sesudah / 1048576).toFixed(1)} MB`);
} else {
  console.log('Semua PNG sudah dikompres.');
}
