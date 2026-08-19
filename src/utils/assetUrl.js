/**
 * Menambahkan awalan base path di depan aset yang berasal dari folder `public`.
 *
 * Diperlukan karena di GitHub Pages website dilayani dari subfolder
 * (https://<user>.github.io/vitasari/), sedangkan path aset di data ditulis
 * mulai dari akar seperti `/images/products/roti-srikaya.jpg`.
 *
 * Saat `npm run dev`, BASE_URL bernilai "/" sehingga hasilnya tidak berubah.
 */
export const assetUrl = (path) => {
  if (!path) return path;

  // Biarkan URL lengkap dan data URI apa adanya.
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;

  return import.meta.env.BASE_URL.replace(/\/$/, '') + path;
};
