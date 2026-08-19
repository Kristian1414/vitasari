import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import { CartIcon } from './components/Icons';
import { CartProvider, useCart } from './context/CartContext';
import { formatRupiah } from './utils/format';
import About from './pages/About';
import Branches from './pages/Branches';
import Home from './pages/Home';
import Menu from './pages/Menu';

/** Selalu mulai dari atas halaman setiap kali route berganti. */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function NotFound() {
  return (
    <section className="page-header">
      <div className="container">
        <span className="eyebrow">404</span>
        <h1>Halaman Tidak Ditemukan</h1>
        <p>Sepertinya halaman yang kamu cari sudah habis seperti roti sore hari.</p>
        <Link to="/" className="btn btn--primary">
          Kembali ke Beranda
        </Link>
      </div>
    </section>
  );
}

/** Bar checkout yang menempel di bawah layar HP saat keranjang terisi. */
function MobileCartBar() {
  const { totalItems, totalPrice, openCart, isCartOpen } = useCart();

  if (totalItems === 0 || isCartOpen) return null;

  return (
    <button type="button" className="mobile-cart-bar" onClick={openCart}>
      <span className="mobile-cart-bar__left">
        <CartIcon width={18} height={18} />
        {totalItems} item
      </span>
      <span className="mobile-cart-bar__right">
        {formatRupiah(totalPrice)}
        <strong>Lihat Keranjang</strong>
      </span>
    </button>
  );
}

export default function App() {
  const { pathname } = useLocation();

  return (
    <CartProvider>
      <ScrollToTop />
      <Navbar />

      {/* `key` membuat konten dirender ulang tiap pindah halaman, jadi animasi masuknya terulang. */}
      <main id="konten" key={pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cabang" element={<Branches />} />
          <Route path="/tentang" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
      <MobileCartBar />
      <Toast />
    </CartProvider>
  );
}
