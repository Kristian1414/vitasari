/**
 * Waktu dan kurva gerak untuk pop up detail produk.
 *
 * Pop up ini sebelumnya memakai animasi layout bersama (layoutId): kartu di
 * grid benar-benar bergerak dan membesar ke tengah layar. Konsep itu ditinggal
 * karena geraknya panjang dan berat — setiap kali dibuka, seluruh kartu di
 * halaman harus dirender dan diukur ulang lebih dulu, dan yang dianimasikan
 * adalah dua kartu berisi foto beresolusi tinggi sekaligus.
 *
 * Sekarang munculnya seperti pop up pada umumnya: memudar masuk di tengah layar
 * sambil sedikit membesar. Tidak ada yang perlu diukur, dan yang bergerak cuma
 * satu elemen.
 *
 * Kurvanya sama dengan animasi "muncul saat di-scroll" di global.css, supaya
 * seluruh situs memakai satu bahasa gerak.
 */
const EASE = [0.22, 0.61, 0.36, 1];

/**
 * Bingkai pop up. Durasinya pendek dengan sengaja: pop up yang muncul setelah
 * diklik harus terasa langsung menyahut, bukan diantar pelan-pelan.
 */
export const popupMotion = {
  duration: 0.2,
  ease: EASE,
};

/**
 * Latar gelap. Sedikit lebih cepat daripada bingkainya supaya layar sudah
 * meredup lebih dulu, jadi pop up-nya muncul di atas latar yang sudah tenang.
 */
export const backdropMotion = {
  duration: 0.16,
  ease: EASE,
};
