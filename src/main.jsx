import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { protectImages } from './utils/protectImages';
import './styles/global.css';

// `basename` mengikuti base path Vite: "/" saat dikembangkan lokal, dan
// "/vitasari" saat dilayani dari subfolder GitHub Pages.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

// Menahan klik kanan dan seret pada gambar. Baca catatan di berkasnya soal
// sejauh mana ini melindungi -- dan sejauh mana tidak.
protectImages();

const wadah = document.getElementById('root');

const aplikasi = (
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Hasil build sudah berisi HTML jadi dari scripts/prerender.js, jadi React
// cukup "menghidupkan" markup yang sudah ada (hydrate) alih-alih menggambar
// ulang semuanya dari nol. Halaman jadi tampil lebih dulu, dan tidak berkedip.
//
// Saat `npm run dev` tidak ada prerender -- yang ada di dalam #root hanya
// komentar penanda -- jadi di situ aplikasi digambar dari nol seperti biasa.
if (wadah.firstElementChild) {
  ReactDOM.hydrateRoot(wadah, aplikasi);
} else {
  ReactDOM.createRoot(wadah).render(aplikasi);
}
