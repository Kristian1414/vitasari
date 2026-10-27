import { useEffect, useRef, useState } from 'react';
import { BreadIcon } from './Icons';
import { assetUrl } from '../utils/assetUrl';

/** Palet gradasi untuk placeholder, dipilih berdasarkan nama produk. */
const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #2b231e 0%, #3a2e26 100%)',
  'linear-gradient(135deg, #261f1a 0%, #362a22 100%)',
  'linear-gradient(135deg, #2a221c 0%, #3b3027 100%)',
];

const pickGradient = (seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 9973;
  }
  return PLACEHOLDER_GRADIENTS[hash % PLACEHOLDER_GRADIENTS.length];
};

/**
 * Versi WebP ringan dari foto produk, dibuat oleh scripts/buat-foto-web.mjs:
 *   /images/products/roti-coklat.jpeg -> /images/products-web/roti-coklat-360.webp, -720.webp
 * Foto di luar folder produk (foto toko, dsb.) tidak punya versi ini.
 */
const webpSrcSet = (src) => {
  const match = /^\/images\/products\/(.+)\.(jpe?g|png)$/i.exec(src || '');
  if (!match) return null;
  const base = assetUrl(`/images/products-web/${match[1]}`);
  return `${base}-360.webp 360w, ${base}-720.webp 720w`;
};

/**
 * Daftar foto yang sudah pernah selesai dimuat selama halaman ini dibuka.
 *
 * Gunanya: foto yang sama bisa muncul di dua tempat sekaligus — di kartu grid
 * dan di pop up detailnya. Tanpa catatan ini, foto di pop up selalu dianggap
 * baru, jadi ia mulai dari transparan lalu memudar masuk tepat saat pop up-nya
 * muncul.
 */
const loadedSources = new Set();

/**
 * Menampilkan foto produk dengan efek muncul halus setelah gambar selesai dimuat.
 * Kalau file fotonya tidak ada, otomatis jatuh ke placeholder bergradasi.
 *
 * - `sizes`    : lebar tampil foto, supaya browser memilih versi WebP yang pas.
 *                Bawaannya untuk kartu produk di grid.
 * - `priority` : foto yang langsung terlihat di layar pertama. Diunduh segera
 *                dengan prioritas tinggi, bukan menunggu giliran seperti foto
 *                di bawah layar.
 * - `eager`    : diunduh segera tanpa prioritas khusus (pop up detail).
 */
export default function ProductImage({
  src,
  alt,
  className = '',
  eager = false,
  priority = false,
  sizes = '(max-width: 640px) 46vw, 260px',
}) {
  const imgRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(() => loadedSources.has(src));

  // Reset status kalau produknya berganti (mis. saat filter kategori).
  useEffect(() => {
    setFailed(false);
    setLoaded(loadedSources.has(src));
  }, [src]);

  // Foto di HTML hasil prerender bisa sudah selesai dimuat sebelum React
  // memasang onLoad, jadi statusnya dicek ulang setelah render.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
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

  const img = (
    <img
      ref={imgRef}
      className={`product-image ${loaded ? 'is-loaded' : ''} ${className}`.trim()}
      src={assetUrl(src)}
      alt={alt}
      loading={eager || priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : undefined}
      decoding="async"
      onLoad={() => {
        loadedSources.add(src);
        setLoaded(true);
      }}
      onError={() => setFailed(true)}
    />
  );

  const srcSet = webpSrcSet(src);
  if (!srcSet) return img;

  // <picture>: browser yang mendukung WebP mengambil versi ringan dengan
  // ukuran yang pas; yang tidak, tetap memakai foto JPG aslinya.
  return (
    <picture className="product-image__picture">
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      {img}
    </picture>
  );
}
