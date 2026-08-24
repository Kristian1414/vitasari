/**
 * Identitas situs untuk mesin pencari.
 *
 * Satu berkas ini dipakai tiga tempat sekaligus: tag <head> tiap halaman
 * (components/Seo.jsx), data terstruktur JSON-LD, dan sitemap.xml (keduanya
 * dibuat saat build di vite.config.js). Kalau alamat atau deskripsi diubah,
 * cukup di sini — ketiganya ikut, dan tidak mungkin lagi saling berbeda isi.
 */

/**
 * Alamat kanonik situs, tanpa garis miring di akhir.
 *
 * Dipakai apa adanya untuk <link rel="canonical"> dan og:url. Nilainya sengaja
 * TIDAK mengikuti base path Vite: walau situs yang sama juga dilayani dari
 * GitHub Pages, yang boleh diakui Google sebagai versi resmi hanya domain ini.
 */
export const SITE_URL = 'https://vitasari.id';

export const SITE_NAME = 'Vitasari Bakery';

/** Gambar yang muncul saat tautan dibagikan di WhatsApp, Facebook, dsb. */
export const SITE_IMAGE = '/images/hero-bg.jpeg';

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
export const PAGE_META = {
  '/': {
    title: 'Vitasari Bakery — Toko Roti & Kue Bandung Sejak 1991',
    description:
      'Toko roti dan kue legendaris di Bandung sejak 1991. Roti manis, bolu, cake, dan jajanan pasar dipanggang setiap pagi. Pesan lewat WhatsApp cabang terdekat.',
  },
  '/menu': {
    title: 'Menu & Harga Roti dan Kue — Vitasari Bakery Bandung',
    description:
      'Daftar lengkap roti, cake, dan jajanan pasar Vitasari Bakery beserta harganya. Pilih favoritmu, lalu pesan langsung lewat WhatsApp cabang Bandung terdekat.',
  },
  '/cabang': {
    title: '7 Cabang Vitasari Bakery di Bandung — Alamat & Jam Buka',
    description:
      'Alamat lengkap, jam buka, dan nomor WhatsApp tujuh cabang Vitasari Bakery: Kurdi, Buah Batu, Holis, Pajajaran, Sabang, Surapati, dan Setiabudi.',
  },
  '/tentang': {
    title: 'Tentang Vitasari Bakery — Toko Roti Bandung Sejak 1991',
    description:
      'Kisah Vitasari Bakery, dari satu oven kecil di Jl. H. Kurdi pada 1991 hingga tujuh cabang yang melayani keluarga Bandung sampai hari ini.',
  },
};
