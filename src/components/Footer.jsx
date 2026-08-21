import { useState } from 'react';
import { Link } from 'react-router-dom';
import { branches } from '../data/branches';
import { InstagramIcon, WhatsAppIcon } from './Icons';
import WhatsAppBranchModal from './WhatsAppBranchModal';
import logoVitasari from '../assets/logoVitasari.jpg';

const INSTAGRAM_URL = 'https://www.instagram.com/vitasaribakery';

export default function Footer() {
  const [isWaPickerOpen, setIsWaPickerOpen] = useState(false);

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img className="footer__logo" src={logoVitasari} alt="Logo Vitasari Bakery" />
          <h3>Vitasari Bakery</h3>
          <p>
            Toko roti dan kue keluarga di Bandung yang terpercaya sejak 1991. Dipanggang setiap
            pagi, tanpa pengawet, dengan resep yang tidak berubah.
          </p>
          <div className="footer__socials">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram Vitasari Bakery">
              <InstagramIcon />
            </a>
            <button
              type="button"
              onClick={() => setIsWaPickerOpen(true)}
              aria-label="Hubungi Vitasari Bakery lewat WhatsApp"
            >
              <WhatsAppIcon />
            </button>
          </div>
        </div>

        <div className="footer__col">
          <h4>Navigasi</h4>
          <ul>
            <li><Link to="/">Beranda</Link></li>
            <li><Link to="/menu">Menu Lengkap</Link></li>
            <li><Link to="/cabang">Cabang Kami</Link></li>
            <li><Link to="/tentang">Tentang Vitasari</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Cabang</h4>
          <ul>
            {branches.slice(0, 4).map((branch) => (
              <li key={branch.id}>
                <a href={`https://wa.me/${branch.waNumber}`} target="_blank" rel="noopener noreferrer">
                  {branch.name}
                </a>
              </li>
            ))}
            <li><Link to="/cabang">Lihat semua cabang</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Jam Operasional</h4>
          <ul className="footer__hours">
            <li>Senin - Minggu</li>
            <li>06.00 - 20.00 WIB</li>
            <li className="footer__muted">Jam buka tiap cabang sedikit berbeda, cek halaman Cabang.</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>&copy; {new Date().getFullYear()} Vitasari Bakery Bandung. Semua hak cipta dilindungi.</p>
          <p>Terpercaya sejak 1991</p>
        </div>
      </div>

      <WhatsAppBranchModal isOpen={isWaPickerOpen} onClose={() => setIsWaPickerOpen(false)} />
    </footer>
  );
}
