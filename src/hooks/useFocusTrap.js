import { useEffect, useRef } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Pop up bisa bertumpuk (modal checkout di atas drawer keranjang). Hanya yang
 * paling atas -- yang terakhir dibuka -- boleh menahan fokus.
 */
const stack = [];

/**
 * Menjaga fokus keyboard tetap di dalam pop up selama pop up itu terbuka.
 *
 * Tanpa ini, pengguna keyboard dan pembaca layar menekan Tab lalu "tersesat"
 * ke tombol-tombol di halaman belakang yang tertutup lapisan gelap. Hook ini:
 *
 * 1. memindahkan fokus ke dalam pop up begitu terbuka (ke elemen ber-atribut
 *    `data-autofocus` kalau ada, atau elemen pertama yang bisa difokus);
 * 2. memutar Tab / Shift+Tab di dalam pop up saja;
 * 3. mengembalikan fokus ke tombol yang membukanya begitu pop up ditutup,
 *    supaya pengguna tidak kehilangan posisinya di halaman.
 *
 *   const ref = useFocusTrap(isOpen);
 *   <div ref={ref} role="dialog">...</div>
 */
export function useFocusTrap(isActive) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive) return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    const previouslyFocused = document.activeElement;
    const token = {};
    stack.push(token);

    const focusables = () =>
      [...container.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );

    // Pop up yang beranimasi (mis. drawer yang bergeser masuk) masih dianggap
    // tersembunyi oleh browser di frame-frame awalnya, dan perintah fokus ke
    // elemen tersembunyi diabaikan diam-diam. Jadi dicoba beberapa kali dalam
    // setengah detik pertama sampai fokusnya benar-benar masuk.
    const timers = [0, 60, 180, 400].map((delay) =>
      window.setTimeout(() => {
        if (container.contains(document.activeElement)) return;
        const target = container.querySelector('[data-autofocus]') || focusables()[0] || container;
        target.focus({ preventScroll: true });
      }, delay),
    );

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab' || stack[stack.length - 1] !== token) return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!container.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      document.removeEventListener('keydown', handleKeyDown);
      stack.splice(stack.indexOf(token), 1);
      // Kembalikan fokus ke pemicunya, kalau elemen itu masih ada di halaman.
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [isActive]);

  return containerRef;
}
