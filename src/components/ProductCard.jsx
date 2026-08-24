import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useQuickView } from '../context/QuickViewContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { formatRupiah } from '../utils/format';
import { toBadgeSlug } from '../utils/product';
import { staggerDelay } from './Reveal';
import { CheckIcon } from './Icons';
import ProductImage from './ProductImage';
import QtyStepper from './QtyStepper';

/**
 * `reveal` mengatur animasi muncul saat di-scroll. Dimatikan di halaman Menu
 * yang berisi puluhan produk: saat di-scroll cepat, animasi berurutannya
 * membuat kartu terasa telat muncul.
 */
export default function ProductCard({ product, index = 0, reveal = true }) {
  const { addItem, increment, decrement, updateQty, getQty } = useCart();
  const { openQuickView } = useQuickView();
  const [revealRef, isVisible] = useScrollReveal();
  const qty = getQty(product.id);
  const inCart = qty > 0;

  const classes = [
    'product-card',
    `product-card--cat-${product.category}`,
    reveal ? 'reveal' : '',
    reveal ? 'reveal--up' : '',
    reveal && isVisible ? 'is-visible' : '',
    inCart ? 'product-card--active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.article
      // Tanpa ref, tidak ada pengamat scroll yang dipasang sama sekali.
      ref={reveal ? revealRef : undefined}
      className={classes}
      style={reveal ? { animationDelay: `${staggerDelay(index)}ms` } : undefined}
      // Efek terangkat saat disorot diurus Framer Motion, bukan CSS, karena
      // kelas .reveal--up memakai animasi CSS pada properti transform yang sama.
      whileHover={{ y: -4 }}
    >
      {/* Tombol tembus pandang selebar kartu: membuat seluruh kartu bisa diklik
          dan bisa dibuka lewat keyboard, tanpa menyarangkan tombol di dalam
          tombol (tombol Tambah tetap berada di atasnya). */}
      <button
        type="button"
        className="product-card__open"
        aria-label={`Lihat detail ${product.name}`}
        onClick={() => openQuickView(product)}
      />

      <div className="product-card__media">
        <ProductImage src={product.image} alt={product.name} />
        {product.badge && (
          <span
            className={`product-card__badge product-card__badge--${toBadgeSlug(product.badge)}`}
          >
            {product.badge}
          </span>
        )}
        {inCart && (
          <span className="product-card__check" aria-hidden="true">
            <CheckIcon width={14} height={14} />
          </span>
        )}
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        {product.description && <p className="product-card__desc">{product.description}</p>}

        <div className="product-card__footer">
          <div className="product-card__price">
            <strong>{formatRupiah(product.price)}</strong>
            <span>/ {product.unit}</span>
          </div>

          <div className="product-card__action">
            {inCart ? (
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
                className="btn btn--primary btn--sm"
                onClick={() => addItem(product)}
              >
                Tambah
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
