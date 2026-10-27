import { useEffect, useState } from 'react';
import { statusCabang } from '../utils/jamBuka';

/**
 * Lencana kecil "Buka · tutup 19.00" / "Tutup · buka 06.30" untuk satu cabang.
 *
 * Statusnya baru dihitung setelah halaman hidup di browser, bukan saat
 * prerender: HTML hasil build bisa berumur berhari-hari, jadi status yang
 * ditulis saat build pasti basi. Sebelum itu lencananya tidak dirender sama
 * sekali, dan statusnya diperbarui tiap menit selama halaman terbuka.
 */
export default function BranchStatus({ hours, className = '' }) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!now) return null;

  const status = statusCabang(hours, now);
  if (!status) return null;

  const tone = status.buka ? (status.segera ? 'soon' : 'open') : 'closed';

  return (
    <span className={`branch-status branch-status--${tone} ${className}`.trim()}>
      <span className="branch-status__dot" aria-hidden="true" />
      {status.segera ? status.label.replace('Buka', 'Segera tutup') : status.label}
    </span>
  );
}
