import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

/**
 * Merender aplikasi menjadi teks HTML di Node, tanpa browser.
 *
 * Dipanggil scripts/prerender.js sekali untuk tiap halaman saat build, supaya
 * berkas HTML yang dikirim ke pengunjung sudah berisi teks aslinya -- judul,
 * nama produk, alamat cabang -- alih-alih <div id="root"> kosong yang baru
 * terisi setelah JavaScript selesai berjalan.
 *
 * Ini yang membuat isi situs terbaca perayap yang tidak menjalankan JavaScript,
 * dan mempercepat perayapan Google yang menjalankan JavaScript pada giliran
 * kedua yang lebih lambat.
 *
 * Berkas ini tidak pernah ikut ke browser: main.jsx yang mengambil alih di sana.
 */

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

export function render(rute) {
  // StaticRouter membaca alamat lengkap termasuk base path, lalu memotongnya
  // sendiri memakai `basename` -- persis seperti BrowserRouter di main.jsx.
  return renderToString(
    <React.StrictMode>
      <StaticRouter basename={basename} location={`${basename}${rute}`}>
        <App />
      </StaticRouter>
    </React.StrictMode>,
  );
}
