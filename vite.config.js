import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { PAGE_META, SITE_URL } from './src/data/site.js';
import { urlKanonik } from './scripts/seo-head.js';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** Nama repositori GitHub, dipakai sebagai subfolder saat dilayani GitHub Pages. */
const REPO_NAME = 'vitasari';

/**
 * Menulis sitemap.xml dan robots.txt ke hasil build.
 *
 * Dibuat saat build, bukan ditaruh sebagai berkas tetap di public/, supaya
 * daftar alamatnya selalu sama dengan PAGE_META. Halaman baru cukup didaftarkan
 * sekali di src/data/site.js dan otomatis ikut masuk sitemap.
 */
const sitemapDanRobots = () => {
  let base = '/';
  let untukServer = false;

  return {
    name: 'sitemap-robots',
    apply: 'build',
    configResolved(config) {
      base = config.base;
      untukServer = Boolean(config.build.ssr);
    },
    closeBundle() {
      // Build dijalankan dua kali (klien lalu server, lihat scripts/build.js),
      // sedangkan sitemap dan robots cukup ditulis sekali dari build klien.
      if (untukServer) return;

      const distDir = path.join(rootDir, 'dist');
      const hariIni = new Date().toISOString().slice(0, 10);

      const alamat = Object.keys(PAGE_META)
        .map((rute) => {
          // Beranda paling utama, lalu halaman utama, lalu halaman tiap cabang.
          const kedalaman = rute.split('/').filter(Boolean).length;
          const prioritas = ['1.0', '0.8', '0.7'][Math.min(kedalaman, 2)];
          return [
            '  <url>',
            `    <loc>${urlKanonik(rute)}</loc>`,
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

      // Base selain "/" berarti hasil build ini untuk GitHub Pages, yang isinya
      // salinan persis situs di vitasari.id. Dua alamat dengan isi sama saling
      // memperebutkan peringkat yang sama, jadi salinan cadangan ini ditutup
      // dari mesin pencari. Yang boleh muncul di Google hanya domain resmi.
      const untukCadangan = base !== '/';

      fs.writeFileSync(
        path.join(distDir, 'robots.txt'),
        untukCadangan
          ? [
              '# Salinan cadangan di GitHub Pages, sengaja ditutup dari mesin',
              '# pencari. Versi resmi yang diindeks: ' + SITE_URL,
              'User-agent: *',
              'Disallow: /',
              '',
            ].join('\n')
          : ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n'),
      );
    },
  };
};

/**
 * Membuat `npm run preview` melayani berkas hasil prerender, bukan selalu
 * mengembalikan index.html beranda untuk setiap alamat.
 *
 * Server preview bawaan Vite menganggap semua situs aplikasi satu halaman, jadi
 * tanpa ini membuka /menu di preview menampilkan <head> milik beranda -- bukan
 * yang benar-benar akan dikirim hosting nanti, sehingga hasil prerender jadi
 * mustahil diperiksa sendiri sebelum diunggah.
 *
 * Aturannya sengaja dibuat sama persis dengan public/.htaccess di Hostinger:
 * berkas nyata dulu, lalu <alamat>/index.html, sisanya jatuh ke 404.
 */
const previewSepertiHosting = () => ({
  name: 'preview-seperti-hosting',
  apply: 'serve',
  configurePreviewServer(server) {
    const distDir = path.join(rootDir, 'dist');
    const base = server.config.base.replace(/\/$/, '');

    server.middlewares.use((req, res, next) => {
      const alamat = req.url.split('?')[0].replace(/\/$/, '');
      const rute = alamat.startsWith(base) ? alamat.slice(base.length) : alamat;

      if (rute) {
        const halaman = path.join(distDir, rute, 'index.html');
        const berkas = path.join(distDir, rute);

        if (halaman.startsWith(distDir) && fs.existsSync(halaman)) {
          req.url = `${base}${rute}/index.html`;
        } else if (!fs.existsSync(berkas)) {
          // Alamat tak dikenal: 404.html, seperti `ErrorDocument 404` di hosting.
          req.url = `${base}/404.html`;
        }
      }

      next();
    });
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
  plugins: [react(), sitemapDanRobots(), previewSepertiHosting()],
  server: {
    port: 5173,
    open: false,
  },
});
