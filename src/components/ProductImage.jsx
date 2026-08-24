import { useEffect, useRef, useState } from 'react';
import { BreadIcon } from './Icons';
import { assetUrl } from '../utils/assetUrl';

/** Palet gradasi krem hangat untuk placeholder, dipilih berdasarkan nama produk. */
const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #fdf6ea 0%, #f0dcbe 100%)',
  'linear-gradient(135deg, #fbf3e6 0%, #ecd6b6 100%)',
  'linear-gradient(135deg, #fdf4e3 0%, #f2ddc2 100%)',
  'linear-gradient(135deg, #faf1e4 0%, #e9d3b0 100%)',
  'linear-gradient(135deg, #fef7ec 0%, #f3e0c4 100%)',
];

const pickGradient = (seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 9973;
  }
  return PLACEHOLDER_GRADIENTS[hash % PLACEHOLDER_GRADIENTS.length];
};

/**
 * Daftar foto yang sudah pernah selesai dimuat selama halaman ini dibuka.
 *
 * Gunanya: foto yang sama bisa muncul di dua tempat sekaligus — di kartu grid
 * dan di pop up detailnya. Tanpa catatan ini, foto di pop up selalu dianggap
 * baru, jadi ia mulai dari transparan lalu memudar masuk 0,55 detik tepat saat
 * kartunya sedang membesar. Dua foto besar yang saling memudar di frame yang
 * sama itu berat dan membuat animasinya terlihat ngelag.
 */
const loadedSources = new Set();

/**
 * Menampilkan foto produk dengan efek muncul perlahan setelah gambar selesai dimuat.
 * Kalau file fotonya tidak ada, otomatis jatuh ke placeholder bergradasi.
 *
 * `eager` untuk foto yang harus langsung ada begitu dirender (pop up detail),
 * bukan yang menunggu digulir seperti foto di grid.
 */
export default function ProductImage({ src, alt, className = '', eager = false }) {
  const imgRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(() => loadedSources.has(src));

  // Reset status kalau produknya berganti (mis. saat filter kategori).
  useEffect(() => {
    setFailed(false);
    setLoaded(loadedSources.has(src));
  }, [src]);

  // Gambar dari cache bisa selesai dimuat sebelum handler onLoad terpasang,
  // jadi status `complete` dicek ulang setelah render.
  useEffect(() => {
    if (imgRef.current?.complete) {
      loadedSources.add(src);
      setLoaded(true);
    }
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`product-image product-image--placeholder ${className}`}
        style={{ backgroundImage: pickGradient(alt || 'vitasari') }}
        role="img"
        aria-label={alt}
      >
        <BreadIcon width={38} height={38} />
        <span>{alt}</span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      className={`product-image ${loaded ? 'is-loaded' : ''} ${className}`.trim()}
      src={assetUrl(src)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      // Foto katalognya beresolusi tinggi. Tanpa ini browser boleh membongkar
      // gambarnya di jalur utama, dan jedanya jatuh pas animasi mulai jalan.
      decoding="async"
      onLoad={() => {
        loadedSources.add(src);
        setLoaded(true);
      }}
      onError={() => setFailed(true)}
    />
  );
}
