import { useEffect } from 'react';
import { branches } from '../data/branches';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { ClockIcon, CloseIcon, MapPinIcon, WhatsAppIcon } from './Icons';

/** Sapaan awal yang sudah terisi di kolom chat supaya pelanggan tinggal tekan kirim. */
const buildGreeting = (branch) =>
  `Halo *Vitasari Bakery ${branch.name}*, saya mau bertanya soal produk dan ketersediaannya. Terima kasih!`;

/**
 * Pop up pemilih cabang untuk tombol WhatsApp di footer.
 * Dulu tombol itu mengarah ke Linktree; sekarang nomor cabang langsung ditampilkan
 * di sini supaya pelanggan tidak perlu keluar situs dulu.
 */
export default function WhatsAppBranchModal({ isOpen, onClose }) {
  // Kunci scroll halaman selama pop up terbuka, dan tutup dengan tombol Escape.
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wa-branch-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <header className="modal__header">
          <div>
            <h2 id="wa-branch-title">Hubungi Lewat WhatsApp</h2>
            <p>Pilih cabang Vitasari yang paling dekat dengan kamu.</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Tutup">
            <CloseIcon />
          </button>
        </header>

        <div className="modal__body">
          <div className="wa-branch-list">
            {branches.map((branch) => (
              <a
                key={branch.id}
                className="wa-branch-option"
                href={buildWhatsAppUrl(branch.waNumber, buildGreeting(branch))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
              >
                <span className="wa-branch-option__icon" aria-hidden="true">
                  <WhatsAppIcon width={20} height={20} />
                </span>
                <span className="wa-branch-option__text">
                  <span className="wa-branch-option__name">{branch.name}</span>
                  <span className="wa-branch-option__meta">
                    <MapPinIcon width={14} height={14} />
                    {branch.address}
                  </span>
                  <span className="wa-branch-option__meta">
                    <ClockIcon width={14} height={14} />
                    {branch.hours}
                  </span>
                </span>
                <span className="wa-branch-option__number">{branch.waDisplay}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
