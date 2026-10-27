import { lazy, Suspense } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BranchLinkGrid from '../components/BranchLinkGrid';
import BranchStatus from '../components/BranchStatus';
import {
  ArrowRightIcon,
  ClockIcon,
  MapPinIcon,
  WhatsAppIcon,
} from '../components/Icons';
import { areaCabang, getBranchById, ruteCabang } from '../data/branches';
import NotFound from './NotFound';

// Sama seperti di halaman Cabang: Leaflet dimuat terpisah supaya halaman lain
// tidak ikut menanggung ukurannya.
const BranchMap = lazy(() => import('../components/BranchMap'));

/**
 * Halaman milik satu cabang, misalnya /cabang/buah-batu.
 *
 * Isinya sengaja lengkap berdiri sendiri -- alamat, jam buka, nomor WhatsApp,
 * peta -- supaya orang yang mendarat di sini dari pencarian "toko roti buah
 * batu" tidak perlu membuka halaman lain untuk tahu ke mana harus pergi.
 */
export default function BranchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const branch = getBranchById(id);

  if (!branch) return <NotFound />;

  const area = areaCabang(branch);

  return (
    <>
      <section className="page-header page-header--cabang">
        <div className="container">
          <span className="eyebrow">Vitasari Bakery {branch.name}</span>
          <h1>Toko Roti Vitasari di {area}, Bandung</h1>
          <p>
            Vitasari Bakery {branch.name} berada di {branch.address}, {branch.city}. Roti manis,
            roti tawar, cake, bolu, dan jajanan pasar tersedia setiap hari, pukul {branch.hours}.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container stores">
          <div className="stores__list">
            <div className="branch-card">
              <h2 className="branch-card__title">Alamat &amp; Jam Buka</h2>
              <BranchStatus hours={branch.hours} className="branch-status--block" />

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
                <span>Setiap hari, {branch.hours}</span>
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

            <div className="branch-card">
              <h2 className="branch-card__title">Pesan dari Cabang {area}</h2>
              <p className="branch-card__text">
                Pilih roti dan kue di halaman menu, lalu kirim daftar pesananmu ke WhatsApp
                cabang {area}. Bisa diambil di toko atau diantar dengan ojek online.
              </p>
              <div className="store-item__actions">
                <Link to="/menu" className="btn btn--primary btn--sm">
                  Lihat Menu &amp; Harga
                  <ArrowRightIcon width={15} height={15} />
                </Link>
              </div>
            </div>
          </div>

          <div className="stores__map">
            <Suspense
              fallback={
                <div className="branch-map branch-map--loading">
                  Memuat peta...
                </div>
              }
            >
              <BranchMap
                selectedId={branch.id}
                onSelect={(selectedId) => {
                  const tujuan = getBranchById(selectedId);
                  if (tujuan && tujuan.id !== branch.id) navigate(ruteCabang(tujuan));
                }}
              />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <div className="section__head section__head--center">
            <div>
              <span className="eyebrow">Cabang lain</span>
              <h2 className="section__title">Toko Roti Vitasari Lainnya di Bandung</h2>
            </div>
          </div>

          <BranchLinkGrid excludeId={branch.id} />
        </div>
      </section>
    </>
  );
}
