import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { branches } from './src/data/branches.js';
import { PAGE_META, SITE_IMAGE, SITE_NAME, SITE_SAMEAS, SITE_URL } from './src/data/site.js';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** Nama repositori GitHub, dipakai sebagai subfolder saat dilayani GitHub Pages. */
const REPO_NAME = 'vitasari';

/**
 * GitHub Pages tidak punya fallback SPA: membuka langsung /vitasari/menu akan
 * dilayani sebagai 404. Dengan menyalin index.html menjadi 404.html, halaman
 * tetap termuat dan React Router membaca alamatnya seperti biasa.
 *
 * `.nojekyll` mencegah GitHub memproses hasil build dengan Jekyll.
 *
 * Catatan: di Hostinger fallback ini diurus public/.htaccess, bukan 404.html.
 */
const githubPagesFallback = () => ({
  name: 'github-pages-spa-fallback',
  apply: 'build',
  closeBundle() {
    const distDir = path.join(rootDir, 'dist');
    fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));
    fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
  },
});

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

/**
 * Data terstruktur JSON-LD: cara memberi tahu Google bahwa ini badan usaha
 * nyata dengan tujuh gerai, lengkap dengan alamat, telepon, koordinat, dan jam
 * buka masing-masing. Inilah yang dipakai Google untuk menampilkan kartu
 * bisnis, jam buka, dan titik peta langsung di halaman hasil pencarian.
 *
 * Dibangun dari src/data/branches.js supaya tidak pernah beda dengan yang
 * tampil di halaman Cabang. Kalau ditulis manual di index.html, tujuh alamat
 * harus diperbarui di dua tempat setiap kali ada cabang pindah.
 */
const buatJsonLd = () => {
  const idOrganisasi = `${SITE_URL}/#organization`;

  const gerai = branches.map((cabang) => {
    const jam = parseHours(cabang.hours);

    return {
      '@type': 'Bakery',
      '@id': `${SITE_URL}/cabang#${cabang.id}`,
      name: `${SITE_NAME} ${cabang.name}`,
      parentOrganization: { '@id': idOrganisasi },
      url: `${SITE_URL}/cabang`,
      image: `${SITE_URL}/logo-vitasari.jpg`,
      // wa.me memakai format internasional tanpa tanda plus, sedangkan
      // schema.org memakai tanda plus, jadi ditambahkan di sini.
      telephone: `+${cabang.waNumber}`,
      priceRange: 'Rp',
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
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': idOrganisasi,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/logo-vitasari.jpg`,
        foundingDate: '1991',
        areaServed: 'Bandung',
        sameAs: SITE_SAMEAS,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: 'id-ID',
        publisher: { '@id': idOrganisasi },
      },
      ...gerai,
    ],
  };
};

/**
 * Mengisi <head> dengan tag yang tidak bisa ditulis komponen React lebih awal:
 * alamat kanonik, tag Open Graph, dan JSON-LD. Semuanya harus sudah ada di HTML
 * mentah sebelum JavaScript jalan, supaya terbaca perayap dan pratinjau tautan
 * WhatsApp/Facebook yang memang tidak menjalankan JavaScript sama sekali.
 *
 * components/Seo.jsx menimpanya per halaman setelah aplikasi hidup; yang di
 * sini adalah nilai untuk beranda.
 */
const seoHead = () => ({
  name: 'seo-head',
  transformIndexHtml: {
    order: 'pre',
    handler(html) {
      const beranda = PAGE_META['/'];
      const url = `${SITE_URL}/`;
      const gambar = `${SITE_URL}${SITE_IMAGE}`;
      const meta = (attrs) => ({ tag: 'meta', attrs, injectTo: 'head' });

      return {
        html: html
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${beranda.title}</title>`)
          .replace(
            /<meta name="description"[\s\S]*?\/>/,
            `<meta name="description" content="${beranda.description}" />`,
          ),
        tags: [
          { tag: 'link', attrs: { rel: 'canonical', href: url }, injectTo: 'head' },
          meta({ property: 'og:type', content: 'website' }),
          meta({ property: 'og:site_name', content: SITE_NAME }),
          meta({ property: 'og:locale', content: 'id_ID' }),
          meta({ property: 'og:title', content: beranda.title }),
          meta({ property: 'og:description', content: beranda.description }),
          meta({ property: 'og:url', content: url }),
          meta({ property: 'og:image', content: gambar }),
          meta({ name: 'twitter:card', content: 'summary_large_image' }),
          meta({ name: 'twitter:title', content: beranda.title }),
          meta({ name: 'twitter:description', content: beranda.description }),
          meta({ name: 'twitter:image', content: gambar }),
          {
            tag: 'script',
            attrs: { type: 'application/ld+json' },
            children: JSON.stringify(buatJsonLd()),
            injectTo: 'head',
          },
        ],
      };
    },
  },
});

/**
 * Menulis sitemap.xml dan robots.txt ke hasil build.
 *
 * Dibuat saat build, bukan ditaruh sebagai berkas tetap di public/, supaya
 * daftar alamatnya selalu sama dengan PAGE_META. Halaman baru cukup didaftarkan
 * sekali di src/data/site.js dan otomatis ikut masuk sitemap.
 */
const sitemapDanRobots = () => ({
  name: 'sitemap-robots',
  apply: 'build',
  closeBundle() {
    const distDir = path.join(rootDir, 'dist');
    const hariIni = new Date().toISOString().slice(0, 10);

    const alamat = Object.keys(PAGE_META)
      .map((rute) => {
        const loc = rute === '/' ? `${SITE_URL}/` : `${SITE_URL}${rute}`;
        const prioritas = rute === '/' ? '1.0' : '0.8';
        return [
          '  <url>',
          `    <loc>${loc}</loc>`,
          `    <lastmod>${hariIni}</lastmod>`,
          '    <changefreq>weekly</changefreq>',
          `    <priority>${prioritas}</priority>`,
          '  </url>',
        ].join('\n');
      })
      .join('\n');

    fs.writeFileSync(
      path.join(distDir, 'sitemap.xml'),
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        alamat,
        '</urlset>',
        '',
      ].join('\n'),
    );

    fs.writeFileSync(
      path.join(distDir, 'robots.txt'),
      ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n'),
    );
  },
});

export default defineConfig({
  // GitHub Pages melayani website dari subfolder bernama repo, jadi seluruh
  // alamat aset perlu diawali itu. Base yang sama dipakai saat pengembangan
  // supaya perilakunya persis sama dengan hasil akhirnya:
  //   dev     -> http://localhost:5173/vitasari/
  //   preview -> http://localhost:4173/vitasari/
  //
  // Untuk Hostinger (domain sendiri, situs di akar) base ditimpa saat build:
  //   npm run build -- --base=/
  base: `/${REPO_NAME}/`,
  plugins: [react(), seoHead(), githubPagesFallback(), sitemapDanRobots()],
  server: {
    port: 5173,
    open: false,
  },
});
