import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useScrollLock } from '../hooks/useScrollLock';
import { formatRupiah } from '../utils/format';
import { backdropMotion, popupMotion } from '../utils/motion';
import { categoryLabel, toBadgeSlug } from '../utils/product';
import { CloseIcon } from './Icons';
import ProductImage from './ProductImage';
import QtyStepper from './QtyStepper';

/**
 * Pop up detail produk: menampilkan foto besar yang utuh, keterangan, dan
 * tombol tambah ke keranjang, tanpa berpindah halaman.
 *
 * Munculnya seperti pop up pada umumnya — latar meredup, kartunya memudar masuk
 * di tengah layar sambil sedikit membesar dari 96% ke ukuran penuh. Seluruh isi
 * pop up bergerak sebagai satu kesatuan.
 */
export default function ProductQuickView({ product, onClose }) {
  const { addItem, increment, decrement, updateQty, getQty, isCartOpen } = useCart();

  const isOpen = Boolean(product);
  const qty = product ? getQty(product.id) : 0;

  // Kunci scroll halaman selama pop up terbuka.
  useScrollLock(isOpen);
  const frameRef = useFocusTrap(isOpen);

  // Keranjang bisa dibuka selagi pop up ini masih terbuka -- lewat tombol
  // "Lihat" di notifikasi setelah produk ditambahkan, misalnya. Kalau dibiarkan,
  // pop up-nya tetap menempel di atas drawer keranjang dan menutupi isinya. Jadi
  // begitu keranjang terbuka, pop up menutup sendiri.
  useEffect(() => {
    if (isOpen && isCartOpen) onClose();
  }, [isOpen, isCartOpen, onClose]);

  // Tutup dengan tombol Escape.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="quick-view-backdrop"
            className="quick-view__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropMotion}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen ? (
          <div
            className="quick-view"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-view-title"
            // Klik di area kosong sekitar kartu ikut menutup pop up.
            onClick={(event) => {
              if (event.target === event.currentTarget) onClose();
            }}
          >
            {/* Yang dianimasikan bingkainya, bukan kartunya, supaya tombol tutup
                yang menempel di pojok ikut bergerak bersama — bukan diam di
                tempat sementara kartunya membesar. */}
            <motion.div
              ref={frameRef}
              className="quick-view__frame"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 4 }}
              transition={popupMotion}
            >
              <button
                type="button"
                className="quick-view__close"
                onClick={onClose}
                aria-label="Tutup detail produk"
              >
                <CloseIcon width={16} height={16} />
              </button>

              <div className={`quick-view__card product-card--cat-${product.category}`}>
                <div className="quick-view__media">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    eager
                    sizes="(max-width: 640px) 92vw, 520px"
                  />
                  {product.badge && (
                    <span
                      className={`product-card__badge product-card__badge--${toBadgeSlug(product.badge)}`}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="quick-view__body">
                  <div className="quick-view__head">
                    <div className="quick-view__headings">
                      <h3 id="quick-view-title" className="quick-view__name">
                        {product.name}
                      </h3>
                      <div className="quick-view__price">
                        <strong>{formatRupiah(product.price)}</strong>
                        <span>/ {product.unit}</span>
                      </div>
                    </div>

                    <div className="quick-view__action">
                      {qty > 0 ? (
                        <QtyStepper
                          qty={qty}
                          name={product.name}
                          onDecrement={() => decrement(product.id)}
                          onIncrement={() => increment(product.id)}
                          onSet={(value) => updateQty(product.id, value)}
                        />
                      ) : (
                        <button
                          type="button"
                          className="btn btn--primary"
                          onClick={() => addItem(product)}
                        >
                          Tambah ke Keranjang
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="quick-view__content">
                    <div className="quick-view__chips">
                      <span className="quick-view__chip">{categoryLabel(product.category)}</span>
                      <span className="quick-view__chip">Satuan {product.unit}</span>
                    </div>

                    {product.description && (
                      <p className="quick-view__desc">{product.description}</p>
                    )}

                    {qty > 0 && (
                      <p className="quick-view__note">Sudah ada {qty} di keranjang kamu.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
