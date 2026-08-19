import { useCallback, useEffect, useState } from 'react';

/**
 * State React yang otomatis tersimpan di localStorage, sehingga isinya tetap ada
 * setelah halaman di-refresh atau browser ditutup.
 *
 * Juga ikut memperbarui state ketika tab lain mengubah key yang sama.
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

  const [storedValue, setStoredValue] = useState(readValue);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Gagal menyimpan localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

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
