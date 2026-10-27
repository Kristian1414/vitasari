import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

/**
 * Tombol bulat "kembali ke atas" yang muncul setelah halaman digulir lebih dari
 * satu setengah layar -- paling terasa gunanya di halaman Menu yang berisi
 * puluhan produk. Di HP posisinya naik sedikit kalau bar keranjang sedang
 * tampil, supaya tidak saling menutupi.
 */
export default function BackToTop() {
  const { totalItems, isCartOpen } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight * 1.5);
    };
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const classes = [
    'back-to-top',
    visible && !isCartOpen ? 'is-visible' : '',
    totalItems > 0 ? 'back-to-top--raised' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Kembali ke atas halaman"
      tabIndex={visible ? 0 : -1}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
