import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** Nama repositori GitHub, dipakai sebagai subfolder saat dilayani GitHub Pages. */
const REPO_NAME = 'vitasari';

/**
 * GitHub Pages tidak punya fallback SPA: membuka langsung /vitasari/menu akan
 * dilayani sebagai 404. Dengan menyalin index.html menjadi 404.html, halaman
 * tetap termuat dan React Router membaca alamatnya seperti biasa.
 *
 * `.nojekyll` mencegah GitHub memproses hasil build dengan Jekyll.
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

export default defineConfig({
  // GitHub Pages melayani website dari subfolder bernama repo, jadi seluruh
  // alamat aset perlu diawali itu. Base yang sama dipakai saat pengembangan
  // supaya perilakunya persis sama dengan hasil akhirnya:
  //   dev     -> http://localhost:5173/vitasari/
  //   preview -> http://localhost:4173/vitasari/
  base: `/${REPO_NAME}/`,
  plugins: [react(), githubPagesFallback()],
  server: {
    port: 5173,
    open: false,
  },
});
