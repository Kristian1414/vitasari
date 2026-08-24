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

  // Isinya hanya kedua fungsi ini, dan keduanya tidak pernah berganti — jadi
  // nilai context-nya tidak pernah berubah dan kartu produk tidak ikut dirender
  // ulang setiap pop up dibuka atau ditutup. Di halaman Menu yang berisi 84
  // kartu, itu 84 render yang dihemat pada saat paling sibuk.
  //
  // Dulu `activeProduct` sempat harus ikut dititipkan di sini: animasi lama
  // membesarkan kartu grid jadi pop up, dan animasi layout Framer Motion baru
  // berjalan kalau kartunya ikut dirender ulang. Animasi itu sudah diganti pop
  // up biasa yang tidak menyentuh kartu grid sama sekali, jadi keterikatan itu
  // hilang. Produk yang aktif cukup dikirim lewat prop ke pop up-nya.
  const value = useMemo(
    () => ({ openQuickView, closeQuickView }),
    [openQuickView, closeQuickView],
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
