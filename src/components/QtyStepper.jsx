import { useEffect, useState } from 'react';
import { MinusIcon, PlusIcon } from './Icons';

const MAX_QTY = 999;

/**
 * Pengatur jumlah dengan tombol tambah/kurang, dan angkanya bisa langsung
 * diketik. Berguna untuk pesanan banyak: tinggal ketik 20, tidak perlu menekan
 * tombol tambah dua puluh kali.
 *
 * Angka ditampung dulu sebagai teks (`draft`) selama diketik, supaya kolomnya
 * boleh sementara kosong. Nilainya baru dibulatkan dan dikirim saat selesai.
 */
export default function QtyStepper({
  qty,
  name,
  size = 'md',
  onDecrement,
  onIncrement,
  onSet,
}) {
  const [draft, setDraft] = useState(String(qty));

  // Samakan lagi kalau jumlahnya berubah dari luar (tombol +/- atau hapus item).
  useEffect(() => setDraft(String(qty)), [qty]);

  const iconSize = size === 'sm' ? 14 : 16;

  const commit = () => {
    const parsed = Number.parseInt(draft, 10);
    const next =
      Number.isNaN(parsed) || parsed < 1 ? 1 : Math.min(parsed, MAX_QTY);

    setDraft(String(next));
    if (next !== qty) onSet(next);
  };

  return (
    <div
      className={`qty-stepper${size === 'sm' ? ' qty-stepper--sm' : ''}`}
      role="group"
      aria-label={`Jumlah ${name}`}
    >
      <button
        type="button"
        onClick={onDecrement}
        aria-label={`Kurangi ${name}`}
      >
        <MinusIcon width={iconSize} height={iconSize} />
      </button>

      <input
        className="qty-stepper__value"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={draft}
        aria-label={`Jumlah ${name}, bisa diketik langsung`}
        onChange={(event) =>
          setDraft(event.target.value.replace(/\D/g, '').slice(0, 3))
        }
        onFocus={(event) => event.target.select()}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            event.currentTarget.blur();
          }
        }}
      />

      <button type="button" onClick={onIncrement} aria-label={`Tambah ${name}`}>
        <PlusIcon width={iconSize} height={iconSize} />
      </button>
    </div>
  );
}
