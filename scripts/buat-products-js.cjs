const fs = require('node:fs');
const { items } = require('./katalog-vitasari.cjs');

const BADGES = {
  'egg-cheese': 'Best Seller',
  'roti-coklat': 'Best Seller',
  'roti-sisir': 'Best Seller',
  'puding-lumut': 'Best Seller',
  'bolu-jadoel': 'Legendaris',
  'roti-buaya-3-rasa': 'Untuk Perayaan',
  'blackforest-motif': 'Untuk Perayaan',
  'cake-dekor-baby': 'Untuk Perayaan',
  'bolen-pisang-coklat': 'Oleh-oleh',
  'pia-suroboyo': 'Oleh-oleh',
};

const URUTAN = ['roti-manis', 'roti-tawar', 'cake', 'jajanan-pasar', 'pastry', 'pelengkap'];
const JUDUL = {
  'roti-manis': 'Roti Manis',
  'roti-tawar': 'Roti Tawar & Sisir',
  cake: 'Cake & Bolu',
  'jajanan-pasar': 'Jajanan Pasar',
  pastry: 'Pastry & Pie',
  pelengkap: 'Pelengkap',
};

let out = `/**
 * Katalog produk Vitasari Bakery.
 *
 * Nama, harga, dan foto diambil dari katalog WhatsApp Business resmi Vitasari
 * (screenshot di folder \`menu/\`, diambil 20 Agustus 2026). Foto dipotong dari
 * screenshot tersebut, sehingga resolusinya terbatas 290x290 piksel.
 *
 * Cara menambah/mengubah produk cukup di file ini saja.
 * - \`image\` : path foto di folder \`public/images/products/\`. Kalau file-nya
 *              belum ada, kartu produk otomatis memakai placeholder bergradasi.
 * - \`unit\`  : satuan atau keterangan pemesanan, apa adanya dari katalog.
 * - \`badge\` : opsional, label di pojok kartu.
 * - \`price\` : angka rupiah polos, tanpa titik/koma.
 */

export const categories = [
  { id: 'semua', label: 'Semua Produk' },
${URUTAN.map((id) => `  { id: '${id}', label: '${JUDUL[id]}' },`).join('\n')}
];

export const products = [
`;

for (const kategori of URUTAN) {
  const grup = items
    .filter((it) => it[4] === kategori)
    .sort((a, b) => a[2] - b[2]);

  out += `  // ${JUDUL[kategori]}\n`;

  for (const [slug, nama, harga, unit] of grup) {
    const badge = BADGES[slug];
    out += `  {\n`;
    out += `    id: '${slug}',\n`;
    out += `    name: '${nama.replace(/'/g, "\\'")}',\n`;
    out += `    category: '${kategori}',\n`;
    out += `    price: ${harga},\n`;
    out += `    unit: '${unit.replace(/'/g, "\\'")}',\n`;
    if (badge) out += `    badge: '${badge}',\n`;
    out += `    image: '/images/products/${slug}.jpg',\n`;
    out += `  },\n`;
  }

  out += '\n';
}

out = out.replace(/\n$/, '');
out += `];

export const getProductById = (id) => products.find((product) => product.id === id);
`;

fs.writeFileSync(require('node:path').join(__dirname, '..', 'src', 'data', 'products.js'), out);

const perKategori = URUTAN.map((k) => `${JUDUL[k]}: ${items.filter((i) => i[4] === k).length}`);
console.log(`${items.length} produk ditulis`);
console.log('  ' + perKategori.join('\n  '));
