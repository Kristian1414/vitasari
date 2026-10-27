/**
 * Isi <head> dan data terstruktur JSON-LD untuk setiap halaman.
 *
 * Dipakai scripts/prerender.js saat build untuk menuliskan <head> yang berbeda
 * ke tiap berkas HTML hasil prerender. Sebelumnya isi berkas ini ada di
 * vite.config.js dan hanya bisa melayani satu halaman, karena seluruh situs
 * memang cuma punya satu index.html.
 *
 * components/Seo.jsx tetap menyetel tag yang sama saat pengguna berpindah
 * halaman tanpa memuat ulang. Keduanya membaca PAGE_META yang sama, jadi tidak
 * mungkin berbeda isi.
 */

import { branches, ruteCabang } from '../src/data/branches.js';
import { categories, products } from '../src/data/products.js';
import {
  PAGE_META,
  SITE_IMAGE,
  SITE_IMAGE_SIZE,
  SITE_NAME,
  SITE_SAMEAS,
  SITE_URL,
} from '../src/data/site.js';

/** Alamat kanonik sebuah rute. Beranda memakai garis miring di akhir, sisanya tidak. */
export const urlKanonik = (rute) => (rute === '/' ? `${SITE_URL}/` : `${SITE_URL}${rute}`);

/**
 * Meloloskan karakter yang punya arti khusus di HTML.
 *
 * Judul halaman mengandung "&" (Toko Roti & Kue), yang kalau ditulis apa adanya
 * membuat HTML tidak valid dan bisa salah baca oleh sebagian perayap.
 */
const esc = (teks) =>
  String(teks)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** "06.30 - 19.00 WIB" menjadi { opens: "06:30", closes: "19:00" } sesuai schema.org. */
const parseHours = (teks) => {
  const cocok = teks.match(/(\d{1,2})[.:](\d{2})\s*-\s*(\d{1,2})[.:](\d{2})/);
  if (!cocok) return null;

  const pad = (angka) => angka.padStart(2, '0');
  return { opens: `${pad(cocok[1])}:${cocok[2]}`, closes: `${pad(cocok[3])}:${cocok[4]}` };
};

const SEMUA_HARI = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const ID_ORGANISASI = `${SITE_URL}/#organization`;

/** Badan usaha Vitasari sebagai satu kesatuan, beserta akun resminya di tempat lain. */
const organisasi = {
  '@type': 'Organization',
  '@id': ID_ORGANISASI,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo-vitasari.jpg`,
  image: `${SITE_URL}${SITE_IMAGE}`,
  description: PAGE_META['/'].description,
  foundingDate: '1991',
  areaServed: { '@type': 'City', name: 'Bandung' },
  sameAs: SITE_SAMEAS,
};

const situs = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  inLanguage: 'id-ID',
  publisher: { '@id': ID_ORGANISASI },
};

/**
 * Satu gerai sebagai badan usaha lokal, lengkap dengan alamat, telepon,
 * koordinat, dan jam buka. Inilah yang dipakai Google untuk menampilkan kartu
 * bisnis, jam buka, dan titik peta di halaman hasil pencarian.
 *
 * Dibangun dari src/data/branches.js supaya tidak pernah beda dengan yang
 * tampil di halaman Cabang. `url` menunjuk ke halaman milik cabang itu sendiri,
 * jadi Google tahu halaman mana yang harus ditampilkan untuk gerai yang mana.
 */
const gerai = (cabang) => {
  const jam = parseHours(cabang.hours);
  const url = urlKanonik(ruteCabang(cabang));

  return {
    '@type': 'Bakery',
    '@id': `${url}#toko`,
    name: `${SITE_NAME} ${cabang.name}`,
    parentOrganization: { '@id': ID_ORGANISASI },
    url,
    image: `${SITE_URL}${SITE_IMAGE}`,
    logo: `${SITE_URL}/logo-vitasari.jpg`,
    // wa.me memakai format internasional tanpa tanda plus, sedangkan
    // schema.org memakai tanda plus, jadi ditambahkan di sini.
    telephone: `+${cabang.waNumber}`,
    priceRange: 'Rp',
    servesCuisine: ['Roti', 'Kue', 'Jajanan pasar'],
    hasMenu: urlKanonik('/menu'),
    hasMap: cabang.mapsUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: cabang.address,
      addressLocality: cabang.city,
      addressRegion: 'Jawa Barat',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: cabang.coords[0],
      longitude: cabang.coords[1],
    },
    ...(jam
      ? {
          openingHoursSpecification: [
            { '@type': 'OpeningHoursSpecification', dayOfWeek: SEMUA_HARI, ...jam },
          ],
        }
      : null),
  };
};

/**
 * Daftar menu beserta harganya, dikelompokkan per kategori.
 *
 * Tanpa ini Google hanya melihat halaman Menu sebagai deretan teks. Dengan ini
 * ia tahu mana nama produk dan mana harganya, sehingga pencarian seperti
 * "harga bolu vitasari" punya jawaban yang bisa dibaca mesin.
 */
const daftarMenu = () => ({
  '@type': 'Menu',
  '@id': `${urlKanonik('/menu')}#menu`,
  name: `Menu ${SITE_NAME}`,
  url: urlKanonik('/menu'),
  inLanguage: 'id-ID',
  hasMenuSection: categories
    .filter((kategori) => kategori.id !== 'semua')
    .map((kategori) => ({
      '@type': 'MenuSection',
      name: kategori.label,
      hasMenuItem: products
        .filter((produk) => produk.category === kategori.id)
        .map((produk) => ({
          '@type': 'MenuItem',
          name: produk.name,
          ...(produk.image ? { image: `${SITE_URL}${produk.image}` } : null),
          offers: { '@type': 'Offer', price: produk.price, priceCurrency: 'IDR' },
        })),
    })),
});

/**
 * Jejak halaman: Beranda > Cabang > Buah Batu. Google menampilkannya di hasil
 * pencarian menggantikan alamat mentah, dan memakainya untuk memahami halaman
 * mana yang jadi induk halaman mana.
 */
const jejak = (rute) => {
  const bagian = rute.split('/').filter(Boolean);
  const ruteInduk = ['/', ...bagian.map((_, i) => `/${bagian.slice(0, i + 1).join('/')}`)];

  return {
    '@type': 'BreadcrumbList',
    itemListElement: ruteInduk.map((induk, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: PAGE_META[induk].label,
      item: urlKanonik(induk),
    })),
  };
};

/**
 * Data terstruktur untuk sebuah rute.
 *
 * Identitas situs ikut di semua halaman. Rincian ketujuh gerai ditempelkan di
 * beranda dan halaman Cabang, halaman tiap cabang hanya membawa gerainya
 * sendiri, dan daftar harga hanya ada di halaman Menu -- masing-masing di
 * halaman yang memang membicarakannya.
 */
const buatJsonLd = (rute) => {
  const cabang = branches.find((item) => ruteCabang(item) === rute);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organisasi,
      situs,
      ...(rute === '/' || rute === '/cabang' ? branches.map(gerai) : []),
      ...(cabang ? [gerai(cabang)] : []),
      ...(rute === '/menu' ? [daftarMenu()] : []),
      ...(rute === '/' ? [] : [jejak(rute)]),
    ],
  };
};

/**
 * Seluruh isi <head> khusus halaman, sebagai potongan HTML siap tempel.
 *
 * Rute yang tidak terdaftar di PAGE_META (halaman 404) sengaja diberi `noindex`:
 * tanpa itu, alamat salah ketik apa pun bisa ikut terkumpul di indeks Google
 * sebagai halaman kosong.
 */
export const buatHead = (rute) => {
  const meta = PAGE_META[rute];
  const url = urlKanonik(rute);
  const gambar = `${SITE_URL}${SITE_IMAGE}`;

  if (!meta) {
    return [
      `<title>Halaman Tidak Ditemukan &mdash; ${esc(SITE_NAME)}</title>`,
      '<meta name="robots" content="noindex, follow" />',
    ].join('\n    ');
  }

  return [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    // max-image-preview:large mengizinkan Google menampilkan foto besar di hasil
    // pencarian dan Discover, bukan kotak kecil di samping teks.
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />',
    `<link rel="canonical" href="${esc(url)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    '<meta property="og:locale" content="id_ID" />',
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(gambar)}" />`,
    `<meta property="og:image:width" content="${SITE_IMAGE_SIZE.width}" />`,
    `<meta property="og:image:height" content="${SITE_IMAGE_SIZE.height}" />`,
    `<meta property="og:image:alt" content="${esc(SITE_NAME)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${esc(gambar)}" />`,
    // </ di dalam JSON dipecah supaya tidak dikira penutup <script> oleh browser.
    `<script type="application/ld+json">${JSON.stringify(buatJsonLd(rute)).replace(
      /</g,
      '\u003c',
    )}</script>`,
  ].join('\n    ');
};
