import { useCallback, useEffect, useState } from 'react';

/**
 * State React yang otomatis tersimpan di localStorage, sehingga isinya tetap ada
 * setelah halaman di-refresh atau browser ditutup.
 *
 * Juga ikut memperbarui state ketika tab lain mengubah key yang sama.
 *
 * Isi localStorage sengaja TIDAK dibaca saat render pertama, melainkan sesaat
 * sesudahnya. Alasannya hidrasi: HTML halaman ditulis saat build (lihat
 * scripts/prerender.js), saat mana keranjang pasti kosong. Kalau render pertama
 * di browser sudah menampilkan isi keranjang tersimpan, markup-nya berbeda
 * dengan yang dikirim server, dan React membuang seluruh hasil prerender lalu
 * menggambar ulang dari nol -- persis yang ingin dihindari. Harganya: bagi
 * pelanggan yang keranjangnya masih terisi, jumlah item muncul satu kedipan
 * setelah halaman tampil.
 */
export function useLocalStorage(key, initialValue) {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch (error) {
      console.warn(`Gagal membaca localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(initialValue);

  // Menandai bahwa isi tersimpan sudah selesai dibaca. Tanpa penanda ini, efek
  // penyimpanan di bawah akan sempat berjalan lebih dulu membawa nilai awal yang
  // masih kosong, dan justru menghapus keranjang pelanggan sebelum terbaca.
  const [sudahDibaca, setSudahDibaca] = useState(false);

  useEffect(() => {
    setStoredValue(readValue());
    setSudahDibaca(true);
  }, [readValue]);

  useEffect(() => {
    if (!sudahDibaca) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Gagal menyimpan localStorage key "${key}":`, error);
    }
  }, [key, storedValue, sudahDibaca]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== key) return;

      try {
        setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
      } catch {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key, initialValue]);

  return [storedValue, setStoredValue];
}
