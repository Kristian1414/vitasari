import { useEffect, useRef, useState } from 'react';

/** Cek preferensi sistem "kurangi animasi". */
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Menandai elemen sebagai "terlihat" begitu masuk area pandang, supaya bisa
 * dianimasikan sekali saat pertama muncul.
 *
 * Mengembalikan [ref, isVisible]. Pasang ref ke elemen yang mau dianimasikan.
 */
export function useScrollReveal({ threshold = 0.12, rootMargin = '0px 0px -70px 0px' } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    // Kalau browser tidak mendukung IntersectionObserver, atau user minta
    // animasi dikurangi, langsung tampilkan tanpa animasi.
    if (!node || typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isVisible];
}
