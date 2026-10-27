/**
 * Identitas situs untuk mesin pencari.
 *
 * Satu berkas ini dipakai tiga tempat sekaligus: tag <head> tiap halaman
 * (components/Seo.jsx), data terstruktur JSON-LD (scripts/seo-head.js), dan
 * sitemap.xml (vite.config.js). Kalau alamat atau deskripsi diubah,
 * cukup di sini — ketiganya ikut, dan tidak mungkin lagi saling berbeda isi.
 */

/**
 * Alamat kanonik situs, tanpa garis miring di akhir.
 *
 * Dipakai apa adanya untuk <link rel="canonical"> dan og:url. Nilainya sengaja
 * TIDAK mengikuti base path Vite: walau situs yang sama juga dilayani dari
 * GitHub Pages, yang boleh diakui Google sebagai versi resmi hanya domain ini.
 */
import { areaCabang, branches, ruteCabang } from './branches.js';

export const SITE_URL = 'https://vitasari.id';

export const SITE_NAME = 'Vitasari Bakery';

/** Gambar yang muncul saat tautan dibagikan di WhatsApp, Facebook, dsb. */
export const SITE_IMAGE = '/images/hero-bg.jpeg';

/**
 * Ukuran asli gambar di atas, dalam piksel. Ditulis ke og:image:width/height
 * supaya WhatsApp dan Facebook bisa langsung menampilkan pratinjau besar tanpa
 * mengunduh gambarnya dulu untuk diukur. Ubah juga kalau gambarnya diganti.
 */
export const SITE_IMAGE_SIZE = { width: 1280, height: 1280 };

/**
 * Profil resmi di tempat lain. Dipakai pada properti `sameAs` JSON-LD, yang
 * memberi tahu Google bahwa situs ini, akun Instagram itu, dan halaman Facebook
 * itu adalah satu badan usaha yang sama — bukan tiga pihak berbeda.
 */
export const SITE_SAMEAS = [
  'https://www.instagram.com/vitasaribakery/',
  'https://www.facebook.com/Vitasaribakerybandung/',
];

/**
 * Judul dan deskripsi per halaman.
 *
 * Sebelumnya keempat halaman berbagi satu judul yang sama, sehingga di mata
 * Google mereka nyaris tidak terbedakan. Kata kunci ditaruh apa adanya sesuai
 * cara orang mengetik di kolom pencarian ("toko roti bandung", "menu dan
 * harga", "alamat cabang"), bukan ditumpuk-tumpuk.
 *
 * Panjang judul dijaga di bawah 60 karakter dan deskripsi di bawah 160 karakter
 * supaya tidak dipotong Google di halaman hasil pencarian.
 */
const HALAMAN_UTAMA = {
  '/': {
    label: 'Beranda',
    title: 'Toko Roti & Kue di Bandung Sejak 1991 — Vitasari Bakery',
    description:
      'Vitasari Bakery, toko roti dan kue di Bandung sejak 1991 dengan 7 cabang. Roti manis, bolu, cake, dan jajanan pasar dipanggang tiap pagi. Pesan via WhatsApp.',
  },
  '/menu': {
    label: 'Menu',
    title: 'Menu & Harga Roti dan Kue — Vitasari Bakery Bandung',
    description:
      'Daftar lengkap roti, cake, dan jajanan pasar Vitasari Bakery beserta harganya. Pilih favoritmu, lalu pesan langsung lewat WhatsApp cabang Bandung terdekat.',
  },
  '/cabang': {
    label: 'Cabang',
    title: '7 Cabang Vitasari Bakery di Bandung — Alamat & Jam Buka',
    description:
      'Alamat lengkap, jam buka, dan nomor WhatsApp tujuh cabang Vitasari Bakery: Kurdi, Buah Batu, Holis, Pajajaran, Sabang, Surapati, dan Setiabudi.',
  },
  '/tentang': {
    label: 'Tentang',
    title: 'Tentang Vitasari Bakery — Toko Roti Bandung Sejak 1991',
    description:
      'Kisah Vitasari Bakery, dari satu oven kecil di Jl. H. Kurdi pada 1991 hingga tujuh cabang yang melayani keluarga Bandung sampai hari ini.',
  },
};

/**
 * Satu halaman untuk tiap cabang, dibangkitkan dari src/data/branches.js.
 *
 * Orang jarang berhenti di "toko roti di bandung" -- yang lebih sering diketik
 * justru nama kawasannya: "toko roti buah batu", "toko roti setiabudi". Untuk
 * pencarian seperti itu Google mencari halaman yang memang membicarakan kawasan
 * tersebut, dan satu halaman Cabang yang memuat ketujuhnya sekaligus tidak bisa
 * jadi jawaban terbaik untuk tujuh pencarian berbeda.
 */
const HALAMAN_CABANG = Object.fromEntries(
  branches.map((cabang) => [
    ruteCabang(cabang),
    {
      label: areaCabang(cabang),
      title: `Toko Roti di ${areaCabang(cabang)} Bandung — Vitasari Bakery`,
      description: `Vitasari Bakery ${areaCabang(cabang)}: ${cabang.address}, Bandung. Buka setiap hari ${cabang.hours}. Pesan lewat WhatsApp.`,
    },
  ]),
);

/**
 * Seluruh halaman yang boleh diindeks, dengan alamatnya sebagai kunci. Dari
 * sinilah prerender, sitemap, dan Seo.jsx mengambil daftar halamannya.
 */
export const PAGE_META = { ...HALAMAN_UTAMA, ...HALAMAN_CABANG };
