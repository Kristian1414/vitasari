import { categories } from '../data/products';

/** "Best Seller" -> "best-seller", dipakai sebagai kelas warna badge. */
export const toBadgeSlug = (badge) =>
  badge
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Nama kategori yang enak dibaca, mis. "roti-manis" -> "Roti Manis". */
export const categoryLabel = (categoryId) =>
  categories.find((category) => category.id === categoryId)?.label || '';
