import { useEffect } from 'react';

/**
 * Kunci scroll halaman selama sebuah overlay (pop up / drawer) terbuka.
 *
 * `overflow: hidden` pada <body> saja tidak cukup di situs ini. Browser hanya
 * meneruskan overflow <body> ke viewport kalau overflow <html> masih `visible`,
 * sedangkan <html> di sini sudah memakai `overflow-x: clip`. Akibatnya kunci di
 * <body> hanya berlaku untuk kotak body sendiri dan halaman tetap bisa digulir.
 * Karena itu kuncinya dipasang langsung di <html>.
 *
 * Menghilangkan scrollbar juga melebarkan viewport, jadi lebarnya diganti
 * padding supaya konten di belakang pop up tidak melompat ke samping.
 */
export function useScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return undefined;

    const root = document.documentElement;
    const previousOverflowY = root.style.overflowY;
    const previousPaddingRight = root.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    root.style.overflowY = 'hidden';
    if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      root.style.overflowY = previousOverflowY;
      root.style.paddingRight = previousPaddingRight;
    };
  }, [isLocked]);
}
