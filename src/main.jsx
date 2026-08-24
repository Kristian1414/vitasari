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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
