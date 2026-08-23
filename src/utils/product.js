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

/**
 * Penanda animasi bersama (layoutId) antara kartu di grid dan kartu besar di
 * pop up detail. Framer Motion memakai penanda ini untuk mengenali bahwa kedua
 * elemen itu "benda yang sama", lalu menggerakkan posisi dan ukurannya dari
 * kartu kecil ke kartu besar — bukan memunculkan pop up baru begitu saja.
 */
export const productLayoutIds = (productId) => ({
  card: `product-card-${productId}`,
  media: `product-media-${productId}`,
  name: `product-name-${productId}`,
  price: `product-price-${productId}`,
  action: `product-action-${productId}`,
});
