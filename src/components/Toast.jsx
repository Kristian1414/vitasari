import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { CheckIcon } from './Icons';

/**
 * Notifikasi kecil di bawah layar: muncul saat produk masuk keranjang (dengan
 * tombol "Lihat"), atau saat produk dihapus (dengan tombol "Batalkan").
 *
 * Notifikasi yang punya tombol Batalkan tampil lebih lama, supaya pengguna
 * sempat membaca dan menekannya.
 */
export default function Toast() {
  const { toast, dismissToast, openCart } = useCart();

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(dismissToast, toast.action ? 5000 : 2600);
    return () => window.clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;

  const action = toast.action ?? { label: 'Lihat', run: openCart };

  const handleAction = () => {
    action.run();
    dismissToast();
  };

  return (
    <div className="toast" key={toast.key} role="status" aria-live="polite">
      <span className="toast__icon" aria-hidden="true">
        <CheckIcon width={16} height={16} />
      </span>
      <span className="toast__message">{toast.message}</span>
      <button type="button" className="toast__action" onClick={handleAction}>
        {action.label}
      </button>
    </div>
  );
}
