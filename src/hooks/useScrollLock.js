import { useLayoutEffect } from 'react';

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
 *
 * Dipakai useLayoutEffect, bukan useEffect: menukar scrollbar dengan padding
 * memaksa seluruh halaman dihitung ulang. Kalau itu terjadi setelah frame
 * pertama tergambar, perhitungan ulangnya jatuh di tengah animasi pop up dan
 * animasinya tersendat. Dengan useLayoutEffect semuanya beres sebelum Framer
 * Motion mengukur posisi kartu dan sebelum layar digambar.
 */
export function useScrollLock(isLocked) {
  useLayoutEffect(() => {
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
