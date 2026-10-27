import { useLayoutEffect } from 'react';

/*
 * Kuncinya dihitung, bukan disimpan per-overlay.
 *
 * Overlay di situs ini bisa bertumpuk: pop up produk masih terbuka saat
 * keranjang dibuka dari notifikasi, dan modal pilih cabang menimpa keranjang.
 * Kalau tiap overlay menyimpan sendiri nilai `overflow-y` sebelumnya, yang
 * kedua akan menyimpan "hidden" milik yang pertama sebagai nilai asli — lalu
 * saat semuanya ditutup, nilai "hidden" itulah yang dikembalikan dan halaman
 * terkunci selamanya.
 *
 * Jadi gaya aslinya hanya dicatat sekali, waktu overlay pertama membuka, dan
 * baru dikembalikan setelah overlay terakhir menutup.
 */
let lockCount = 0;
let restoreOverflowY = '';
let restorePaddingRight = '';

function lockPage() {
  const root = document.documentElement;

  if (lockCount === 0) {
    restoreOverflowY = root.style.overflowY;
    restorePaddingRight = root.style.paddingRight;

    // Lebar scrollbar diukur di sini saja. Overlay kedua tidak boleh ikut
    // mengukur: scrollbar-nya sudah hilang, jadi hasilnya pasti 0 dan padding
    // pengganti yang sudah terpasang malah akan tertimpa.
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    root.style.overflowY = 'hidden';
    if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;
  }

  lockCount += 1;
}

function unlockPage() {
  if (lockCount === 0) return;

  lockCount -= 1;
  if (lockCount > 0) return;

  const root = document.documentElement;
  root.style.overflowY = restoreOverflowY;
  root.style.paddingRight = restorePaddingRight;
}

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

    lockPage();
    return unlockPage;
  }, [isLocked]);
}
