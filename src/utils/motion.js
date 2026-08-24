/**
 * Satu kurva gerak untuk perpindahan kartu produk <-> pop up detail.
 *
 * Tanpa ini Framer Motion memakai bawaannya sendiri untuk animasi layout:
 * 0,45 detik dengan kurva cubic-bezier(0.4, 0, 0.1, 1). Kurva itu berangkat
 * pelan lalu menahan di tengah, jadi pembesaran kartunya terasa "berat" di awal
 * dan seperti tersendat sebelum berhenti.
 *
 * Gantinya kurva yang dipakai lembar geser iOS: berangkat langsung begitu
 * diklik, lalu melambat panjang sampai benar-benar berhenti (kemiringannya nol
 * di ujung, jadi tidak ada patahan di akhir gerakan). Durasinya sedikit lebih
 * panjang supaya perlambatannya terasa, bukan cuma lewat.
 */
export const cardMotion = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

/**
 * Pegas bawaan Framer Motion untuk properti transform (mis. `y`), disalin apa
 * adanya dari framer-motion/dist. Lihat catatan `default` di bawah — inilah
 * yang harus dikembalikan secara manual.
 */
const springDefault = { type: 'spring', stiffness: 500, damping: 25, restSpeed: 10 };

/**
 * Dipasang di SETIAP elemen yang ikut berpindah (kartu, foto, nama, harga,
 * tombol) — di grid maupun di pop up.
 *
 * Semua elemen memakai kurva dan durasi yang sama persis, jadi mereka bergerak
 * serempak sebagai satu benda. Kalau tiap elemen punya waktunya sendiri, mata
 * menangkapnya sebagai beberapa gerakan yang saling menyusul.
 *
 * `default` WAJIB ada dan tidak boleh dihapus. Saat mencari transisi untuk
 * sebuah nilai, Framer Motion mengambil `transition[nama]`, lalu
 * `transition.default`, lalu — kalau keduanya kosong — seluruh objek ini apa
 * adanya. Objek yang isinya cuma { layout } tetap dianggap "sudah diatur", jadi
 * pegas bawaannya tidak lagi dipasang, dan nilai itu jatuh ke tween 0,3 detik.
 * Akibatnya kartu yang terangkat saat disorot (`whileHover` y: -4) turun-naik
 * melayang selama 0,3 detik, bukan langsung mengikuti kursor seperti semestinya
 * — paling kelihatan tepat setelah pop up ditutup dan kartunya mendarat.
 */
export const cardLayoutTransition = {
  layout: cardMotion,
  default: springDefault,
};
