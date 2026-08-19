import { useEffect, useMemo, useState } from 'react';
import { branches } from '../data/branches';
import { useCart } from '../context/CartContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatRupiah } from '../utils/format';
import { buildOrderMessage, buildWhatsAppUrl } from '../utils/whatsapp';
import { CheckIcon, ClockIcon, CloseIcon, MapPinIcon, WhatsAppIcon } from './Icons';

const ORDER_TYPES = ['Ambil di toko (pick up)', 'Diantar (ojek online / kurir)'];

const DEFAULT_PROFILE = {
  branchId: '',
  customerName: '',
  orderType: ORDER_TYPES[0],
};

export default function CheckoutModal({ isOpen, onClose }) {
  const { items, totalItems, totalPrice, clearCart, closeCart } = useCart();

  // Preferensi pemesan diingat supaya tidak perlu diketik ulang tiap order.
  const [profile, setProfile] = useLocalStorage('vitasari:checkout-profile', DEFAULT_PROFILE);

  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [isSent, setIsSent] = useState(false);

  const selectedBranch = useMemo(
    () => branches.find((branch) => branch.id === profile.branchId) || null,
    [profile.branchId],
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    setIsSent(false);
    setError('');

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const updateProfile = (patch) => setProfile((current) => ({ ...current, ...patch }));

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedBranch) {
      setError('Pilih dulu cabang Vitasari yang mau kamu kirimi pesanan.');
      return;
    }

    if (items.length === 0) {
      setError('Keranjang masih kosong.');
      return;
    }

    const message = buildOrderMessage({
      items,
      branch: selectedBranch,
      customerName: profile.customerName,
      orderType: profile.orderType,
      note,
    });

    window.open(buildWhatsAppUrl(selectedBranch.waNumber, message), '_blank', 'noopener,noreferrer');
    setError('');
    setIsSent(true);
  };

  const handleFinish = (shouldClear) => {
    if (shouldClear) clearCart();
    setNote('');
    onClose();
    closeCart();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <div className="modal">
        <header className="modal__header">
          <div>
            <h2 id="checkout-title">{isSent ? 'Pesanan Dikirim' : 'Pilih Cabang Tujuan'}</h2>
            <p>
              {isSent
                ? 'Tinggal tekan kirim di WhatsApp yang sudah terbuka.'
                : `${totalItems} item · ${formatRupiah(totalPrice)}`}
            </p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Tutup">
            <CloseIcon />
          </button>
        </header>

        {isSent ? (
          <div className="modal__sent">
            <span className="modal__sent-icon" aria-hidden="true">
              <CheckIcon width={30} height={30} />
            </span>
            <p className="modal__sent-title">
              WhatsApp {selectedBranch?.name} terbuka di tab baru
            </p>
            <p className="modal__sent-text">
              Daftar pesanan sudah otomatis terisi di kolom chat. Tekan tombol kirim di WhatsApp
              untuk menyelesaikan pemesanan, lalu tunggu konfirmasi dari kasir cabang.
            </p>
            <div className="modal__sent-actions">
              <button type="button" className="btn btn--ghost" onClick={() => handleFinish(false)}>
                Simpan keranjang
              </button>
              <button type="button" className="btn btn--primary" onClick={() => handleFinish(true)}>
                Selesai &amp; kosongkan
              </button>
            </div>
          </div>
        ) : (
          <form className="modal__body" onSubmit={handleSubmit}>
            <fieldset className="branch-picker">
              <legend className="field-label">Cabang Vitasari</legend>

              <div className="branch-picker__grid">
                {branches.map((branch) => (
                  <label
                    key={branch.id}
                    className={`branch-option${profile.branchId === branch.id ? ' is-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="branch"
                      value={branch.id}
                      checked={profile.branchId === branch.id}
                      onChange={() => {
                        updateProfile({ branchId: branch.id });
                        setError('');
                      }}
                    />
                    <span className="branch-option__name">{branch.name}</span>
                    <span className="branch-option__meta">
                      <MapPinIcon width={14} height={14} />
                      {branch.address}
                    </span>
                    <span className="branch-option__meta">
                      <ClockIcon width={14} height={14} />
                      {branch.hours}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="field-row">
              <label className="field">
                <span className="field-label">Nama pemesan</span>
                <input
                  type="text"
                  value={profile.customerName}
                  onChange={(event) => updateProfile({ customerName: event.target.value })}
                  placeholder="Contoh: Ibu Rina"
                />
              </label>

              <label className="field">
                <span className="field-label">Metode pengambilan</span>
                <select
                  value={profile.orderType}
                  onChange={(event) => updateProfile({ orderType: event.target.value })}
                >
                  {ORDER_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field">
              <span className="field-label">Catatan (opsional)</span>
              <textarea
                rows={2}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Contoh: diambil jam 4 sore, tolong dipisah 2 kantong"
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn btn--whatsapp btn--block">
              <WhatsAppIcon />
              Kirim Pesanan ke WhatsApp
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
