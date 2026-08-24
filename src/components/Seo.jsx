import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PAGE_META, SITE_IMAGE, SITE_NAME, SITE_URL } from '../data/site';

/**
 * Menyetel isi <head> mengikuti halaman yang sedang dibuka.
 *
 * Situs ini satu berkas index.html untuk semua rute, jadi tanpa komponen ini
 * halaman Menu, Cabang, dan Tentang semuanya memakai judul dan deskripsi milik
 * beranda. Di hasil pencarian keempatnya jadi nyaris tidak terbedakan, dan
 * Google cenderung hanya menampilkan salah satu.
 *
 * Nilai bawaan yang statis tetap ditulis di index.html supaya perayap yang
 * tidak menjalankan JavaScript tetap mendapat judul dan deskripsi yang benar
 * untuk beranda. Komponen ini menimpanya begitu rute berganti.
 */

/** Cari tag yang sudah ada di <head>, atau buatkan kalau belum ada. */
const upsertTag = (selector, buatTag) => {
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = buatTag();
    document.head.appendChild(tag);
  }

  return tag;
};

const setMetaName = (name, content) => {
  upsertTag(`meta[name="${name}"]`, () => {
    const tag = document.createElement('meta');
    tag.setAttribute('name', name);
    return tag;
  }).setAttribute('content', content);
};

// Open Graph memakai atribut `property`, bukan `name` — ditulis terpisah supaya
// tidak ada dua tag berbeda yang mengaku mewakili nilai yang sama.
const setMetaProperty = (property, content) => {
  upsertTag(`meta[property="${property}"]`, () => {
    const tag = document.createElement('meta');
    tag.setAttribute('property', property);
    return tag;
  }).setAttribute('content', content);
};

export default function Seo() {
  const { pathname } = useLocation();

  // useLayoutEffect, bukan useEffect: judul tab sebaiknya sudah berganti pada
  // frame yang sama dengan tampilnya halaman baru, bukan sekejap setelahnya.
  useLayoutEffect(() => {
    const meta = PAGE_META[pathname];

    // `pathname` sudah bersih dari base path Vite, jadi alamat kanoniknya tetap
    // menunjuk ke domain resmi walau situsnya sedang dilayani dari GitHub Pages.
    const url = pathname === '/' ? `${SITE_URL}/` : `${SITE_URL}${pathname}`;
    const image = `${SITE_URL}${SITE_IMAGE}`;

    // Canonical selalu menunjuk ke alamat halaman ini sendiri, termasuk di
    // halaman 404. Kalau dibiarkan mewarisi nilai bawaan index.html, halaman
    // 404 akan ber-`noindex` sekaligus mengaku kanoniknya beranda — dan Google
    // memperlakukan pasangan itu sebagai isyarat untuk menularkan `noindex`
    // tadi ke halaman tujuan canonical-nya. Beranda bisa ikut hilang dari
    // indeks hanya gara-gara ada yang salah ketik alamat.
    upsertTag('link[rel="canonical"]', () => {
      const tag = document.createElement('link');
      tag.setAttribute('rel', 'canonical');
      return tag;
    }).setAttribute('href', url);

    // Halaman yang tidak dikenal (404) sengaja tidak diberi judul karangan.
    // Yang penting justru `noindex`: tanpa itu, alamat salah ketik apa pun bisa
    // ikut terkumpul di indeks Google sebagai halaman kosong.
    if (!meta) {
      document.title = `Halaman Tidak Ditemukan — ${SITE_NAME}`;
      setMetaName('robots', 'noindex, follow');
      return;
    }

    setMetaName('robots', 'index, follow');

    document.title = meta.title;
    setMetaName('description', meta.description);

    setMetaProperty('og:type', 'website');
    setMetaProperty('og:site_name', SITE_NAME);
    setMetaProperty('og:locale', 'id_ID');
    setMetaProperty('og:title', meta.title);
    setMetaProperty('og:description', meta.description);
    setMetaProperty('og:url', url);
    setMetaProperty('og:image', image);

    setMetaName('twitter:card', 'summary_large_image');
    setMetaName('twitter:title', meta.title);
    setMetaName('twitter:description', meta.description);
    setMetaName('twitter:image', image);
  }, [pathname]);

  return null;
}
