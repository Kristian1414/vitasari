import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useQuickView } from '../context/QuickViewContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { formatRupiah } from '../utils/format';
import { cardLayoutTransition } from '../utils/motion';
import { productLayoutIds, toBadgeSlug } from '../utils/product';
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
  const ids = productLayoutIds(product.id);

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
    // `layoutId` menyambungkan kartu ini dengan kartu besar di pop up detail:
    // saat diklik, kartunya bergerak dan membesar ke tengah layar.
    <motion.article
      // Tanpa ref, tidak ada pengamat scroll yang dipasang sama sekali.
      ref={reveal ? revealRef : undefined}
      layoutId={ids.card}
      transition={cardLayoutTransition}
      className={classes}
      // Lengkung sudut ditulis di style, bukan hanya di CSS, supaya Framer
      // Motion bisa mengoreksinya selama kartu membesar — kalau tidak, sudutnya
      // ikut melar mengikuti skala. Nilainya sama dengan --radius / --radius-lg.
      style={{
        borderRadius: 16,
        ...(reveal ? { animationDelay: `${staggerDelay(index)}ms` } : null),
      }}
      // Efek terangkat saat disorot diurus Framer Motion, bukan CSS, supaya
      // tidak berebut properti `transform` dengan animasi pindah ke pop up.
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

      <motion.div
        layoutId={ids.media}
        transition={cardLayoutTransition}
        className="product-card__media"
      >
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
      </motion.div>

      <div className="product-card__body">
        <motion.h3
          layoutId={ids.name}
          transition={cardLayoutTransition}
          className="product-card__name"
        >
          {product.name}
        </motion.h3>
        {product.description && <p className="product-card__desc">{product.description}</p>}

        <div className="product-card__footer">
          <motion.div
            layoutId={ids.price}
            transition={cardLayoutTransition}
            className="product-card__price"
          >
            <strong>{formatRupiah(product.price)}</strong>
            <span>/ {product.unit}</span>
          </motion.div>

          <motion.div
            layoutId={ids.action}
            transition={cardLayoutTransition}
            className="product-card__action"
          >
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
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}
