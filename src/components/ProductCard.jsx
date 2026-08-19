import { useCart } from '../context/CartContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { formatRupiah } from '../utils/format';
import { staggerDelay } from './Reveal';
import { CheckIcon } from './Icons';
import ProductImage from './ProductImage';
import QtyStepper from './QtyStepper';

/** "Best Seller" -> "best-seller", dipakai sebagai kelas warna badge. */
const toBadgeSlug = (badge) =>
  badge
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export default function ProductCard({ product, index = 0 }) {
  const { addItem, increment, decrement, updateQty, getQty } = useCart();
  const [revealRef, isVisible] = useScrollReveal();
  const qty = getQty(product.id);
  const inCart = qty > 0;

  const classes = [
    'product-card',
    `product-card--cat-${product.category}`,
    'reveal',
    'reveal--up',
    isVisible ? 'is-visible' : '',
    inCart ? 'product-card--active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article
      ref={revealRef}
      className={classes}
      style={{ animationDelay: `${staggerDelay(index)}ms` }}
    >
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
        <p className="product-card__desc">{product.description}</p>

        <div className="product-card__footer">
          <div className="product-card__price">
            <strong>{formatRupiah(product.price)}</strong>
            <span>/ {product.unit}</span>
          </div>

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
    </article>
  );
}
