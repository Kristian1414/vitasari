import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartIcon, CloseIcon, MenuIcon } from './Icons';
import logoVitasari from '../assets/logoVitasari.jpg';

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/menu', label: 'Menu' },
  { to: '/cabang', label: 'Cabang' },
  { to: '/tentang', label: 'Tentang' },
];

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tutup menu mobile setiap kali pindah halaman.
  useEffect(() => setIsMobileOpen(false), [location.pathname]);

  return (
    <header className={`navbar${isScrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Vitasari Bakery, ke beranda">
          <img className="navbar__logo" src={logoVitasari} alt="Logo Vitasari Bakery" />
          <span className="navbar__brand-text">
            <strong>Vitasari</strong>
            <small>Bakery &middot; Sejak 1991</small>
          </span>
        </Link>

        <nav className={`navbar__links${isMobileOpen ? ' is-open' : ''}`} aria-label="Navigasi utama">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <button
            type="button"
            className="cart-button"
            onClick={openCart}
            aria-label={`Buka keranjang, ${totalItems} item`}
          >
            <CartIcon width={24} height={24} />
            {totalItems > 0 && (
              // `key` memicu ulang animasi pop setiap jumlah item berubah
              <span key={totalItems} className="cart-button__badge">
                {totalItems}
              </span>
            )}
          </button>

          <button
            type="button"
            className="navbar__toggle"
            onClick={() => setIsMobileOpen((open) => !open)}
            aria-label={isMobileOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
