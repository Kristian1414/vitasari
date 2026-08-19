import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { CheckIcon } from './Icons';

/** Notifikasi kecil yang muncul saat produk masuk keranjang. */
export default function Toast() {
  const { toast, dismissToast, openCart } = useCart();

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(dismissToast, 2600);
    return () => window.clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;

  return (
    <div className="toast" key={toast.key} role="status" aria-live="polite">
      <span className="toast__icon" aria-hidden="true">
        <CheckIcon width={16} height={16} />
      </span>
      <span className="toast__message">{toast.message}</span>
      <button type="button" className="toast__action" onClick={openCart}>
        Lihat
      </button>
    </div>
  );
}
