import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import BackToTop from './components/BackToTop';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import Seo from './components/Seo';
import Toast from './components/Toast';
import { CartIcon } from './components/Icons';
import { CartProvider, useCart } from './context/CartContext';
import { QuickViewProvider } from './context/QuickViewContext';
import { formatRupiah } from './utils/format';
import About from './pages/About';
import BranchDetail from './pages/BranchDetail';
import Branches from './pages/Branches';
import Home from './pages/Home';
import Menu from './pages/Menu';
import NotFound from './pages/NotFound';

/** Selalu mulai dari atas halaman setiap kali route berganti. */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
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
    // `reducedMotion="user"` mengikuti setelan "kurangi animasi" di perangkat
    // pengguna, sejalan dengan aturan prefers-reduced-motion di stylesheet.
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <QuickViewProvider>
          <Seo />
          <ScrollToTop />
          <Preloader />
          {/* Tautan tersembunyi yang muncul saat ditekan Tab pertama kali:
              pengguna keyboard dan pembaca layar bisa langsung melompati
              navigasi ke isi halaman. */}
          <a href="#konten" className="skip-link">
            Lewati ke konten utama
          </a>
          <Navbar />

          {/* `key` membuat konten dirender ulang tiap pindah halaman, jadi animasi masuknya terulang. */}
          <main id="konten" key={pathname} className="page-enter" tabIndex={-1}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cabang" element={<Branches />} />
              <Route path="/cabang/:id" element={<BranchDetail />} />
              <Route path="/tentang" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
          <CartDrawer />
          <MobileCartBar />
          <BackToTop />
          <Toast />
        </QuickViewProvider>
      </CartProvider>
    </MotionConfig>
  );
}
