/**
 * Daftar cabang Vitasari Bakery beserta nomor WhatsApp masing-masing.
 * Sumber nomor: https://linktr.ee/vitasaribakery
 *
 * `waNumber` harus format internasional tanpa tanda "+" atau spasi (contoh: 6281223433963),
 * karena dipakai langsung pada URL https://wa.me/<nomor>.
 *
 * `coords` [lintang, bujur] dipakai untuk menaruh penanda di peta halaman Cabang.
 * Koordinat saat ini hasil pencarian otomatis dan akurasinya SETINGKAT NAMA JALAN,
 * belum tepat di titik tokonya. Untuk memperbaiki: buka Google Maps, klik kanan tepat
 * di lokasi toko, pilih koordinat yang muncul, lalu tempel angkanya di sini.
 */
export const branches = [
  {
    id: 'kurdi',
    name: 'Cabang Kurdi',
    waNumber: '6281223433963',
    waDisplay: '+62 812-2343-3963',
    address: 'Komplek Kurdi, Jl. H. Kurdi 1 No. 49, Karasak, Kec. Astanaanyar',
    city: 'Kota Bandung',
    hours: '06.30 - 19.00 WIB',
    coords: [-6.9442563, 107.605647], // titik toko dari OpenStreetMap (Vitasari Bakery, Jl. Karasak 47-49)
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vitasari+Bakery+Jl+H+Kurdi+Bandung',
  },
  {
    id: 'buah-batu',
    name: 'Cabang Buah Batu',
    waNumber: '6282211669845',
    waDisplay: '+62 822-1166-9845',
    address: 'Jl. Buah Batu No. 186, Cijagra, Kec. Lengkong',
    city: 'Kota Bandung',
    hours: '07.00 - 19.00 WIB',
    coords: [-6.93852, 107.62419], // perkiraan: ruas Jl. Buah Batu di Cijagra
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vitasari+Bakery+Buah+Batu+Bandung',
  },
  {
    id: 'holis',
    name: 'Cabang Holis',
    waNumber: '6281297787440',
    waDisplay: '+62 812-9778-7440',
    address: 'Jl. Holis No. 327D, Babakan, Kec. Babakan Ciparay',
    city: 'Kota Bandung',
    hours: '07.00 - 19.00 WIB',
    coords: [-6.934576, 107.571395], // perkiraan: ruas Jl. Holis
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vitasari+Bakery+Holis+Bandung',
  },
  {
    id: 'pajajaran',
    name: 'Cabang Pajajaran',
    waNumber: '6281312340384',
    waDisplay: '+62 813-1234-0384',
    address: 'Jl. Pajajaran No. 84B, Pamoyanan, Kec. Cicendo',
    city: 'Kota Bandung',
    hours: '07.00 - 19.00 WIB',
    coords: [-6.90678, 107.59448], // perkiraan: ruas Jl. Pajajaran di Pamoyanan
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vitasari+Bakery+Pajajaran+Bandung',
  },
  {
    id: 'sabang',
    name: 'Cabang Sabang',
    waNumber: '628112266692',
    waDisplay: '+62 811-2266-692',
    address: 'Jl. Sabang No. 26, Cihapit, Kec. Bandung Wetan',
    city: 'Kota Bandung',
    hours: '06.00 - 18.00 WIB',
    coords: [-6.908156, 107.622591], // titik toko dari OpenStreetMap (Vitasari, shop=bakery)
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vitasari+Bakery+Sabang+Bandung',
  },
  {
    id: 'surapati',
    name: 'Cabang Surapati',
    waNumber: '6281285154748',
    waDisplay: '+62 812-8515-4748',
    address: 'Jl. Surapati No. 55A, Sadang Serang, Kec. Coblong',
    city: 'Kota Bandung',
    hours: '06.30 - 19.00 WIB',
    coords: [-6.89924, 107.61958], // perkiraan: ruas Jl. Surapati di Sadang Serang
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vitasari+Bakery+Surapati+Bandung',
  },
  {
    id: 'setiabudi',
    name: 'Cabang Setiabudi',
    waNumber: '6282219911458',
    waDisplay: '+62 822-1991-1458',
    address: 'Jl. Dr. Setiabudi No. 205, Gegerkalong, Kec. Sukasari',
    city: 'Kota Bandung',
    hours: '06.30 - 20.00 WIB',
    coords: [-6.864956, 107.594085], // perkiraan: ruas Jl. Dr. Setiabudi di Gegerkalong
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vitasari+Bakery+Setiabudi+Bandung',
  },
];

export const getBranchById = (id) => branches.find((branch) => branch.id === id);

/** Titik tengah peta saat belum ada cabang yang dipilih (pusat Kota Bandung). */
export const BANDUNG_CENTER = [-6.9105, 107.6086];
