import { lazy, Suspense, useState } from 'react';
import {
  ArrowRightIcon,
  ClockIcon,
  MapPinIcon,
  WhatsAppIcon,
} from '../components/Icons';
import { branches } from '../data/branches';

// Leaflet cukup besar dan hanya dipakai di halaman ini, jadi dimuat terpisah
// supaya halaman lain tidak ikut menanggung ukurannya.
const BranchMap = lazy(() => import('../components/BranchMap'));

/** Ikon panah kecil yang berputar saat panel dibuka. */
function ChevronIcon(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function Branches() {
  const [selectedId, setSelectedId] = useState(null);

  // Klik cabang yang sama dua kali akan menutup panelnya dan mengembalikan
  // peta ke tampilan seluruh cabang.
  //
  // Halaman sengaja tidak digeser otomatis ke peta: di layar sempit hal itu
  // membuat posisi baca user melompat setiap kali membuka sebuah cabang.
  const handleSelect = (id) => setSelectedId((current) => (current === id ? null : id));

  return (
    <>
      <section className="page-header page-header--cabang">
        <div className="container">
          <span className="eyebrow">Cabang Kami</span>
          <h1>Temukan Lokasi Toko Kami</h1>
          <p>
            Klik salah satu cabang di daftar, peta di sebelahnya akan langsung
            memperbesar ke lokasi tersebut. Setiap cabang punya nomor WhatsApp
            sendiri untuk pemesanan.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container stores">
          <div className="stores__list">
            {branches.map((branch) => {
              const isOpen = selectedId === branch.id;
              const panelId = `panel-${branch.id}`;

              return (
                <div
                  key={branch.id}
                  className={`store-item${isOpen ? ' is-open' : ''}`}
                >
                  <h2 className="store-item__heading">
                    <button
                      type="button"
                      className="store-item__trigger"
                      onClick={() => handleSelect(branch.id)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                    >
                      <span>Vitasari {branch.name}</span>
                      <ChevronIcon className="store-item__chevron" />
                    </button>
                  </h2>

                  {/* Tiga lapis: pembungkus grid untuk animasi tinggi, lapis
                      pemotong luapan, lalu isi panel yang diberi jarak. */}
                  <div className="store-item__panel" id={panelId} role="region">
                    <div className="store-item__panel-clip">
                      <div className="store-item__panel-content">
                        <p className="store-item__row">
                          <MapPinIcon width={16} height={16} />
                          <span>
                            {branch.address}
                            <br />
                            {branch.city}
                          </span>
                        </p>

                        <p className="store-item__row">
                          <ClockIcon width={16} height={16} />
                          <span>{branch.hours}</span>
                        </p>

                        <p className="store-item__row">
                          <WhatsAppIcon width={16} height={16} />
                          <span>{branch.waDisplay}</span>
                        </p>

                        <div className="store-item__actions">
                          <a
                            href={`https://wa.me/${branch.waNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn--whatsapp btn--sm"
                          >
                            <WhatsAppIcon width={16} height={16} />
                            Chat WhatsApp
                          </a>
                          <a
                            href={branch.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn--ghost btn--sm"
                          >
                            Buka di Google Maps
                            <ArrowRightIcon width={15} height={15} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="stores__map">
            <Suspense
              fallback={
                <div className="branch-map branch-map--loading">
                  Memuat peta...
                </div>
              }
            >
              <BranchMap selectedId={selectedId} onSelect={handleSelect} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
