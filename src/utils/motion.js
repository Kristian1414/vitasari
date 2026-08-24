/**
 * Satu kurva gerak untuk perpindahan kartu produk <-> pop up detail.
 *
 * Yang menentukan rasa "lemot" bukan panjang durasinya, melainkan berapa lama
 * ekor perlambatannya. Dua kurva yang pernah dipakai di sini:
 *
 *   bawaan Framer Motion  0,45s  cubic-bezier(0.4, 0, 0.1, 1)
 *     -> 95% gerakan selesai di 313ms, sisa 137ms untuk 5% terakhir
 *   kurva lembar geser iOS 0,50s cubic-bezier(0.32, 0.72, 0, 1)
 *     -> 95% gerakan selesai di 242ms, sisa 258ms untuk 5% terakhir
 *
 * Yang kedua menghabiskan LEBIH DARI SEPARUH durasinya untuk merayapi 5%
 * terakhir. Di layar, kartunya terlihat sampai lalu menggantung bergerak
 * sepersekian piksel per frame — persis seperti animasi yang nge-lag.
 *
 * Kurva di bawah berangkat cepat begitu diklik lalu berhenti tanpa ekor
 * panjang: 95% selesai di 237ms, sisa 123ms. Nilainya sengaja sama dengan
 * kurva animasi "muncul saat di-scroll" di global.css, supaya seluruh situs
 * memakai satu bahasa gerak.
 */
export const cardMotion = {
  duration: 0.36,
  ease: [0.22, 0.61, 0.36, 1],
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
