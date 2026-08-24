import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import ProductQuickView from '../components/ProductQuickView';

const QuickViewContext = createContext(null);

/**
 * Menyimpan produk mana yang sedang dibuka detailnya, sekaligus merender pop
 * up-nya satu kali di luar grid. Kartu produk cukup memanggil `openQuickView`.
 *
 * Pop up sengaja dirender di sini, bukan di dalam kartu, supaya posisinya tidak
 * terjepit oleh `overflow: hidden` milik kartu dan animasi pindahannya bisa
 * bergerak bebas dari grid ke tengah layar.
 */
export function QuickViewProvider({ children }) {
  const [activeProduct, setActiveProduct] = useState(null);

  const openQuickView = useCallback((product) => setActiveProduct(product), []);
  const closeQuickView = useCallback(() => setActiveProduct(null), []);

  // `activeProduct` WAJIB ikut di sini, jangan dikeluarkan demi menghemat
  // render. Justru render ulang itulah yang menjalankan animasi kartu membesar.
  //
  // Karena nilai context ini berubah setiap pop up dibuka/ditutup, SEMUA kartu
  // produk ikut dirender ulang. Saat itulah Framer Motion mengukur ulang posisi
  // tiap kartu dan menyadari kartu ini sekarang "pindah" ke tengah layar, lalu
  // menganimasikannya. Pernah dicoba mengeluarkan `activeProduct` dari sini
  // (produk aktif dikirim lewat prop saja) supaya kartu tidak ikut dirender:
  // hasilnya kartu di grid tidak lagi ikut serta, tidak ada yang perlu
  // dianimasikan, dan pop up-nya melompat ke posisi akhir dalam satu frame —
  // terlihat seperti kartu yang tiba-tiba jatuh dari atas, bukan membesar.
  const value = useMemo(
    () => ({ activeProduct, openQuickView, closeQuickView }),
    [activeProduct, openQuickView, closeQuickView],
  );

  return (
    <QuickViewContext.Provider value={value}>
      {children}
      <ProductQuickView product={activeProduct} onClose={closeQuickView} />
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);

  if (!context) {
    throw new Error('useQuickView harus dipakai di dalam <QuickViewProvider>');
  }

  return context;
}
