/** Format angka menjadi rupiah, contoh: 9000 -> "Rp9.000" */
export const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);

/** Versi tanpa simbol mata uang, contoh: 9000 -> "9.000" */
export const formatNumber = (value) => new Intl.NumberFormat('id-ID').format(value || 0);
