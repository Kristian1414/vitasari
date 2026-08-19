import { formatRupiah } from './format.js';

/**
 * Menyusun teks pesanan yang akan otomatis terisi di kolom chat WhatsApp cabang.
 *
 * Format dirancang supaya admin cepat membacanya:
 * - satu baris untuk satu produk, tidak terpecah dua baris
 * - jumlah ditaruh paling depan dan dicetak tebal, karena itu info yang paling dicari
 * - harga satuan hanya ditampilkan kalau jumlahnya lebih dari satu, supaya tidak ada
 *   angka kembar seperti "1 x Rp 9.000 = Rp 9.000"
 * - label tanpa spasi perata, karena font WhatsApp proporsional dan tidak pernah rata
 *
 * WhatsApp memakai *teks* untuk tebal.
 */
export const buildOrderMessage = ({ items, branch, customerName, orderType, note }) => {
  const lines = [];

  lines.push(`Halo *Vitasari Bakery ${branch.name}*, saya ingin memesan:`);
  lines.push('');
  lines.push('*DAFTAR PESANAN*');

  items.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    const unitPrice = item.qty > 1 ? `  (@${formatRupiah(item.price)})` : '';

    lines.push(
      `${index + 1}. *${item.qty}x* ${item.name} — ${formatRupiah(subtotal)}${unitPrice}`,
    );
  });

  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  lines.push('');
  lines.push(`*TOTAL ${totalQty} ITEM: ${formatRupiah(totalPrice)}*`);
  lines.push('');
  lines.push('*DATA PEMESAN*');
  lines.push(`Nama: ${customerName || '-'}`);
  lines.push(`Metode: ${orderType}`);

  if (note && note.trim()) {
    lines.push(`Catatan: ${note.trim()}`);
  }

  lines.push('');
  lines.push('Mohon dikonfirmasi ketersediaan dan totalnya ya. Terima kasih!');
  lines.push('_Dikirim otomatis dari website Vitasari Bakery_');

  return lines.join('\n');
};

/** Membentuk deeplink WhatsApp lengkap dengan pesan yang sudah ter-encode. */
export const buildWhatsAppUrl = (waNumber, message) =>
  `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
