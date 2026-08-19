import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../utils/format';
import CheckoutModal from './CheckoutModal';
import { CloseIcon, TrashIcon, WhatsAppIcon } from './Icons';
import ProductImage from './ProductImage';
import QtyStepper from './QtyStepper';

export default function CartDrawer() {
  const {
    items,
    totalItems,
    totalPrice,
    isCartOpen,
    closeCart,
    increment,
    decrement,
    updateQty,
    removeItem,
    clearCart,
  } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Kunci scroll halaman selama drawer/modal terbuka, dan tutup dengan tombol Escape.
  useEffect(() => {
    if (!isCartOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isCheckoutOpen) closeCart();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, isCheckoutOpen, closeCart]);

  return (
    <>
      <div
        className={`drawer-overlay${isCartOpen ? ' is-open' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        className={`cart-drawer${isCartOpen ? ' is-open' : ''}`}
        aria-hidden={!isCartOpen}
        aria-label="Keranjang belanja"
      >
        <header className="cart-drawer__header">
          <div>
            <h2>Keranjang Kamu</h2>
            <p>
              {totalItems > 0
                ? `${totalItems} item siap dipesan`
                : 'Belum ada pesanan'}
            </p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={closeCart}
            aria-label="Tutup keranjang"
          >
            <CloseIcon />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <p className="cart-drawer__empty-title">Keranjang masih kosong</p>
            <p className="cart-drawer__empty-text">
              Yuk pilih roti dan kue favoritmu dulu. Isi keranjang akan tetap
              tersimpan walaupun halaman ini di-refresh.
            </p>
            <Link to="/menu" className="btn btn--primary" onClick={closeCart}>
              Lihat Menu
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart-drawer__list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item__media">
                    <ProductImage src={item.image} alt={item.name} />
                  </div>

                  <div className="cart-item__info">
                    <h3>{item.name}</h3>
                    <p className="cart-item__price">
                      {formatRupiah(item.price)} <span>/ {item.unit}</span>
                    </p>

                    <div className="cart-item__controls">
                      <QtyStepper
                        qty={item.qty}
                        name={item.name}
                        size="sm"
                        onDecrement={() => decrement(item.id)}
                        onIncrement={() => increment(item.id)}
                        onSet={(value) => updateQty(item.id, value)}
                      />

                      <button
                        type="button"
                        className="cart-item__remove"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Hapus ${item.name} dari keranjang`}
                      >
                        <TrashIcon width={16} height={16} />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item__subtotal">
                    {formatRupiah(item.price * item.qty)}
                  </div>
                </li>
              ))}
            </ul>

            <footer className="cart-drawer__footer">
              <button type="button" className="link-button" onClick={clearCart}>
                Kosongkan keranjang
              </button>

              <div className="cart-drawer__total">
                <span>Total</span>
                <strong>{formatRupiah(totalPrice)}</strong>
              </div>

              <button
                type="button"
                className="btn btn--whatsapp btn--block"
                onClick={() => setIsCheckoutOpen(true)}
              >
                <WhatsAppIcon />
                Order Now via WhatsApp
              </button>

              <p className="cart-drawer__note">
                Kamu akan memilih cabang dulu, lalu pesanan otomatis terkirim ke
                WhatsApp cabang tersebut.
              </p>
            </footer>
          </>
        )}
      </aside>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
