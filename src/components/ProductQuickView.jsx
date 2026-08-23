import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useScrollLock } from '../hooks/useScrollLock';
import { formatRupiah } from '../utils/format';
import { categoryLabel, productLayoutIds, toBadgeSlug } from '../utils/product';
import { CloseIcon } from './Icons';
import ProductImage from './ProductImage';
import QtyStepper from './QtyStepper';

/**
 * Pop up detail produk: kartu di grid "membesar" jadi kartu besar di tengah
 * layar supaya fotonya terlihat utuh, lengkap dengan tombol tambah ke keranjang.
 *
 * Perpindahannya bukan animasi biasa. Foto, nama, harga, dan tombolnya memakai
 * `layoutId` yang sama dengan yang ada di kartu grid (lihat productLayoutIds),
 * jadi Framer Motion menggeser dan membesarkan elemen aslinya ke posisi baru.
 * Kartu di grid otomatis disembunyikan selama pop up terbuka.
 */
export default function ProductQuickView({ product, onClose }) {
  const { addItem, increment, decrement, updateQty, getQty } = useCart();

  const isOpen = Boolean(product);
  const qty = product ? getQty(product.id) : 0;

  // Kunci scroll halaman selama pop up terbuka.
  useScrollLock(isOpen);

  // Tutup dengan tombol Escape.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const ids = product ? productLayoutIds(product.id) : null;

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
            <div className="quick-view__frame">
              <motion.button
                key={`quick-view-close-${product.id}`}
                type="button"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className="quick-view__close"
                onClick={onClose}
                aria-label="Tutup detail produk"
              >
                <CloseIcon width={16} height={16} />
              </motion.button>

              <motion.div
                layoutId={ids.card}
                className={`quick-view__card product-card--cat-${product.category}`}
                style={{ borderRadius: 24 }}
              >
                <motion.div layoutId={ids.media} className="quick-view__media">
                  <ProductImage src={product.image} alt={product.name} />
                  {product.badge && (
                    <span
                      className={`product-card__badge product-card__badge--${toBadgeSlug(product.badge)}`}
                    >
                      {product.badge}
                    </span>
                  )}
                </motion.div>

                <div className="quick-view__body">
                  <div className="quick-view__head">
                    <div className="quick-view__headings">
                      <motion.h3
                        layoutId={ids.name}
                        id="quick-view-title"
                        className="quick-view__name"
                      >
                        {product.name}
                      </motion.h3>
                      <motion.div layoutId={ids.price} className="quick-view__price">
                        <strong>{formatRupiah(product.price)}</strong>
                        <span>/ {product.unit}</span>
                      </motion.div>
                    </div>

                    <motion.div layoutId={ids.action} className="quick-view__action">
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
                    </motion.div>
                  </div>

                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="quick-view__content"
                  >
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
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
