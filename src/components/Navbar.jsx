import { useEffect, useRef, useState } from 'react';
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
  const headerRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    let scrolled = window.scrollY > 80;
    setIsScrolled(scrolled);

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      // Ambang untuk menciut (80px) dan untuk kembali melebar (40px) sengaja
      // dibedakan. Kalau ambangnya cuma satu, scroll yang berhenti persis di
      // titik itu -- atau efek pantul di HP -- bikin navbar berkedip bolak-balik
      // dan animasinya kelihatan patah.
      const next = scrolled ? y > 40 : y > 80;
      if (next !== scrolled) {
        scrolled = next;
        setIsScrolled(next);
      }
    };

    // Event scroll bisa terpicu jauh lebih sering daripada layar menggambar.
    // Ditahan sampai frame berikutnya supaya React paling banyak render sekali
    // per frame.
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Tutup menu mobile setiap kali pindah halaman.
  useEffect(() => setIsMobileOpen(false), [location.pathname]);

  // Menu mobile juga tertutup dengan Escape, atau dengan mengetuk di mana saja
  // di luar navbar -- cara menutup yang dicoba orang secara refleks.
  useEffect(() => {
    if (!isMobileOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMobileOpen(false);
    };
    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setIsMobileOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isMobileOpen]);

  return (
    <header ref={headerRef} className={`navbar${isScrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Vitasari Bakery, ke beranda">
          <img className="navbar__logo" src={logoVitasari} alt="Logo Vitasari Bakery" />
          <span className="navbar__brand-text">
            <strong>Vitasari</strong>
            <small>Bakery &middot; Sejak 1991</small>
          </span>
        </Link>

        <nav
          id="navigasi-utama"
          className={`navbar__links${isMobileOpen ? ' is-open' : ''}`}
          aria-label="Navigasi utama"
        >
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
            aria-controls="navigasi-utama"
          >
            {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
