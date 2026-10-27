import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CART_STORAGE_KEY = 'vitasari:cart';
const EMPTY_CART = [];

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage(CART_STORAGE_KEY, EMPTY_CART);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  /**
   * `action` opsional: { label, run }. Tanpa action, tombolnya "Lihat" yang
   * membuka keranjang. Dipakai juga untuk tombol "Batalkan" setelah menghapus.
   */
  const showToast = useCallback((message, action = null) => {
    // key unik supaya toast yang sama bisa muncul lagi dan animasinya ter-reset
    setToast({ message, action, key: Date.now() });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const addItem = useCallback(
    (product, qty = 1) => {
      setItems((current) => {
        const existing = current.find((item) => item.id === product.id);

        if (existing) {
          return current.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + qty } : item,
          );
        }

        return [
          ...current,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            unit: product.unit,
            image: product.image,
            qty,
          },
        ];
      });

      showToast(`${product.name} masuk keranjang`);
    },
    [setItems, showToast],
  );

  // Menghapus selalu bisa dibatalkan lewat notifikasi, supaya salah sentuh
  // di tombol tempat sampah tidak membuat pesanan hilang.
  const removeItem = useCallback(
    (id) => {
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return;
      const removed = items[index];

      setItems((current) => current.filter((item) => item.id !== id));
      showToast(`${removed.name} dihapus`, {
        label: 'Batalkan',
        run: () =>
          setItems((current) => {
            if (current.some((item) => item.id === id)) return current;
            const next = [...current];
            next.splice(Math.min(index, next.length), 0, removed);
            return next;
          }),
      });
    },
    [items, setItems, showToast],
  );

  const updateQty = useCallback(
    (id, qty) => {
      setItems((current) =>
        qty <= 0
          ? current.filter((item) => item.id !== id)
          : current.map((item) => (item.id === id ? { ...item, qty } : item)),
      );
    },
    [setItems],
  );

  const increment = useCallback(
    (id) =>
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)),
      ),
    [setItems],
  );

  const decrement = useCallback(
    (id) =>
      setItems((current) =>
        current
          .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
          .filter((item) => item.qty > 0),
      ),
    [setItems],
  );

  // `silent` dipakai setelah pesanan terkirim: keranjang memang sengaja
  // dikosongkan, jadi tidak perlu tawaran membatalkan.
  const clearCart = useCallback(
    ({ silent = false } = {}) => {
      const previous = items;
      setItems([]);
      if (!silent && previous.length > 0) {
        showToast('Keranjang dikosongkan', {
          label: 'Batalkan',
          run: () => setItems(previous),
        });
      }
    },
    [items, setItems, showToast],
  );

  const getQty = useCallback(
    (id) => items.find((item) => item.id === id)?.qty ?? 0,
    [items],
  );

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalPrice,
      isCartOpen,
      toast,
      addItem,
      removeItem,
      updateQty,
      increment,
      decrement,
      clearCart,
      getQty,
      openCart,
      closeCart,
      dismissToast,
    }),
    [
      items,
      totalItems,
      totalPrice,
      isCartOpen,
      toast,
      addItem,
      removeItem,
      updateQty,
      increment,
      decrement,
      clearCart,
      getQty,
      openCart,
      closeCart,
      dismissToast,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart harus dipakai di dalam <CartProvider>');
  }

  return context;
}
