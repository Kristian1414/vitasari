/**
 * Status buka-tutup cabang, dihitung dari teks jam di src/data/branches.js
 * (mis. "06.30 - 19.00 WIB") dan jam sekarang di zona WIB.
 *
 * Jam selalu dihitung dalam WIB, bukan jam perangkat pengunjung, supaya
 * statusnya tetap benar walau orang membukanya dari luar Jawa atau luar negeri.
 */

const toMinutes = (text) => {
  const [h, m] = text.split('.').map(Number);
  return h * 60 + (m || 0);
};

/** "06.30 - 19.00 WIB" -> { buka: 390, tutup: 1140, bukaTeks: "06.30", tutupTeks: "19.00" } */
export function parseJam(hours) {
  const match = /(\d{1,2}\.\d{2})\s*-\s*(\d{1,2}\.\d{2})/.exec(hours || '');
  if (!match) return null;
  return {
    buka: toMinutes(match[1]),
    tutup: toMinutes(match[2]),
    bukaTeks: match[1],
    tutupTeks: match[2],
  };
}

/** Menit sejak tengah malam, menurut jam WIB (UTC+7). */
export function menitWIB(date = new Date()) {
  const utc = date.getUTCHours() * 60 + date.getUTCMinutes();
  return (utc + 7 * 60) % (24 * 60);
}

/**
 * { buka: boolean, label: string, segera: boolean } atau null kalau jamnya
 * tidak terbaca. `segera` = tutup kurang dari 60 menit lagi.
 */
export function statusCabang(hours, date = new Date()) {
  const jam = parseJam(hours);
  if (!jam) return null;

  const now = menitWIB(date);
  const buka = now >= jam.buka && now < jam.tutup;

  if (buka) {
    const sisa = jam.tutup - now;
    return { buka: true, segera: sisa <= 60, label: `Buka · tutup ${jam.tutupTeks}` };
  }

  const besok = now >= jam.tutup;
  return {
    buka: false,
    segera: false,
    label: besok ? `Tutup · buka besok ${jam.bukaTeks}` : `Tutup · buka ${jam.bukaTeks}`,
  };
}
