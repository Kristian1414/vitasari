/**
 * Menyulitkan penyimpanan foto lewat jalur termudah: klik kanan lalu "Save
 * image as", seret foto ke desktop, dan tahan-tekan di layar sentuh.
 *
 * PENTING, supaya tidak salah harap: ini penghalang, bukan pengaman. Foto yang
 * tampil di layar sudah pasti terunduh utuh ke perangkat pengunjung — memang
 * begitu cara browser menggambarnya. Siapa pun yang membuka DevTools, mematikan
 * JavaScript, mengetik view-source:, membuka folder cache browser, atau
 * menjalankan satu perintah curl tetap mendapatkan filenya. Tidak ada kode di
 * sisi browser yang bisa mencegah itu, dan usaha ke arah sana (memblokir F12,
 * jebakan debugger, deteksi DevTools) selalu bisa dilewati sambil merugikan
 * pengunjung yang tidak berniat apa-apa.
 *
 * Yang benar-benar melindungi foto Anda adalah dua hal di luar berkas ini:
 * tanda air logo Vitasari yang sudah tercetak di fotonya, dan penolakan
 * hotlink di public/.htaccess yang mencegah situs lain ikut menampilkannya.
 *
 * Pemasangannya di document, bukan di tiap komponen, supaya foto yang
 * ditambahkan nanti otomatis ikut terlindungi tanpa perlu diingat-ingat.
 */
export function protectImages() {
  if (typeof document === 'undefined') return;

  // Hanya menu klik kanan DI ATAS gambar yang ditahan. Klik kanan di bagian
  // halaman lain sengaja dibiarkan normal: memblokirnya menyeluruh membuat
  // pengunjung tidak bisa menyalin teks atau membuka tautan di tab baru, dan
  // itu merugikan orang yang memang cuma mau memesan roti.
  document.addEventListener('contextmenu', (event) => {
    if (event.target instanceof HTMLImageElement) event.preventDefault();
  });

  // Menyeret gambar ke desktop atau ke tab lain juga menyimpannya.
  document.addEventListener('dragstart', (event) => {
    if (event.target instanceof HTMLImageElement) event.preventDefault();
  });
}
