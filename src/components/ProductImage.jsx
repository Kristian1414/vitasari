import { useEffect, useRef, useState } from 'react';
import { BreadIcon } from './Icons';

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
 * Menampilkan foto produk dengan efek muncul perlahan setelah gambar selesai dimuat.
 * Kalau file fotonya tidak ada, otomatis jatuh ke placeholder bergradasi.
 */
export default function ProductImage({ src, alt, className = '' }) {
  const imgRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Reset status kalau produknya berganti (mis. saat filter kategori).
  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  // Gambar dari cache bisa selesai dimuat sebelum handler onLoad terpasang,
  // jadi status `complete` dicek ulang setelah render.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
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
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
    />
  );
}
