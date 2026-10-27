import { useEffect, useState } from 'react';
import { useScrollLock } from '../hooks/useScrollLock';
import VitasariWordmark from './VitasariWordmark';

/** Paling cepat sekian lama layar loading tampil, supaya animasi dan bilah
 *  progresnya sempat terlihat bergerak. */
const MIN_MS = 2000;
/** Paling lama sekian; lewat dari ini halaman dibuka apa pun keadaannya. */
const MAX_MS = 6000;
/** Lama memudar keluar, harus sama dengan transisi .preloader di CSS. */
const LEAVE_MS = 700;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Layar loading saat website pertama dibuka atau di-refresh.
 *
 * Bukan sekadar hiasan: layar ini menunggu foto-foto yang langsung terlihat di
 * layar pertama (dan font) selesai dimuat. Begitu layar ini memudar, foto
 * produk sudah tampil semua, tidak lagi muncul satu per satu.
 *
 * Ikut ter-render di HTML hasil prerender, jadi tampil seketika sebelum
 * JavaScript selesai dimuat. Kelas `is-loading` di <html> (dipasang di
 * index.html) menahan animasi masuk hero sampai layar ini mulai memudar; kalau
 * JavaScript gagal, index.html dan CSS menghapus semuanya sendiri setelah
 * beberapa detik.
 *
 * Hanya tampil sekali per muat halaman: berpindah halaman di dalam situs tidak
 * memunculkannya lagi, karena komponen ini dipasang sekali di App.
 */
export default function Preloader() {
  const [phase, setPhase] = useState('loading'); // loading -> leaving -> done
  const [progress, setProgress] = useState(0);
  // Bilah progres baru ditampilkan setelah JavaScript hidup, supaya tidak
  // diam di 0% selama skrip dimuat lalu melompat; begitu tampil, ia langsung
  // berjalan mulus dari 0%.
  const [counting, setCounting] = useState(false);

  useScrollLock(phase === 'loading');

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const minMs = reduced ? 300 : MIN_MS;
    const start = performance.now();
    setCounting(true);
    let stopped = false;
    let frame = 0;
    let doneTimer = 0;

    // Foto yang terlihat di layar pertama: yang menentukan kesan "lemot".
    const critical = [...document.querySelectorAll('main img')].filter((img) => {
      const r = img.getBoundingClientRect();
      return r.width > 0 && r.top < window.innerHeight && r.bottom > 0;
    });

    // Font dihitung sebagai satu tugas, tiap foto satu tugas.
    const total = critical.length + 1;
    let finished = 0;
    let forced = false; // batas waktu MAX_MS terlewati
    const tick = () => {
      finished += 1;
    };

    critical.forEach((img) => {
      if (img.complete) {
        tick();
      } else {
        const once = () => {
          img.removeEventListener('load', once);
          img.removeEventListener('error', once);
          tick();
        };
        img.addEventListener('load', once);
        img.addEventListener('error', once);
      }
    });
    (document.fonts?.ready ?? Promise.resolve()).then(tick, tick);
    const maxTimer = window.setTimeout(() => {
      forced = true;
    }, MAX_MS);

    const leave = () => {
      stopped = true;
      setProgress(1);
      setPhase('leaving');
      // Animasi masuk hero dimulai bersamaan dengan layar loading memudar.
      document.documentElement.classList.remove('is-loading');
      doneTimer = window.setTimeout(() => setPhase('done'), reduced ? 200 : LEAVE_MS);
    };

    /*
     * Bilah progres bergerak maju terus dengan mulus, bukan melompat tiap kali
     * satu foto selesai. Ia berjalan stabil sampai ±92% selama waktu minimal,
     * merayap pelan kalau fotonya belum selesai juga, dan baru menyentuh 100%
     * setelah semua foto layar pertama benar-benar siap.
     */
    let shown = 0;
    let elapsed = 0;
    let last = start;
    const loop = (now) => {
      if (stopped) return;
      // Waktu dihitung per frame dan dibatasi 32ms per frame: kalau browser
      // sempat sibuk sesaat (mis. menyiapkan puluhan kartu produk), bilahnya
      // hanya tertahan sebentar, tidak melompat mengejar waktu yang hilang.
      elapsed += Math.min(now - last, 32);
      last = now;
      const t = Math.min(1, elapsed / minMs);
      const timeTarget = 0.92 * (1 - (1 - t) ** 2); // sedikit melambat di ujung
      const ready = finished >= total || forced;

      let target;
      if (ready && elapsed >= minMs) {
        target = 1;
      } else if (elapsed >= minMs) {
        // Masih menunggu foto: maju sangat pelan menuju 98%.
        target = 0.92 + 0.06 * (1 - Math.exp(-(elapsed - minMs) / 2500));
      } else {
        target = timeTarget;
      }

      shown += (target - shown) * (reduced ? 1 : 0.2);
      setProgress(shown);

      if (target === 1 && shown > 0.995) {
        leave();
        return;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(doneTimer);
      window.clearTimeout(maxTimer);
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      className={`preloader${phase === 'leaving' ? ' preloader--leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Memuat Vitasari Bakery"
    >
      <div className="preloader__inner">
        <div className="preloader__mark" aria-hidden="true">
          <VitasariWordmark className="preloader__wordmark" />
          {/* Lapisan emas yang menyapu huruf, dibatasi bentuk tulisannya. */}
          <VitasariWordmark className="preloader__wordmark preloader__shine" />
        </div>
        <p className="preloader__tagline">Bakery &middot; Sejak 1991</p>
        {counting && (
          <div className="preloader__progress" aria-hidden="true">
            <div className="preloader__bar">
              <span style={{ transform: `scaleX(${progress})` }} />
            </div>
            <span className="preloader__percent">{Math.round(progress * 100)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
