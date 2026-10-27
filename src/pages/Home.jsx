import { Link } from "react-router-dom";
import BranchLinkGrid from "../components/BranchLinkGrid";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import VitasariWordmark from "../components/VitasariWordmark";
import Reveal from "../components/Reveal";
import { ArrowRightIcon, MapPinIcon } from "../components/Icons";
import { products } from "../data/products";
import { assetUrl } from "../utils/assetUrl";

/**
 * Keterangan sertifikat halal.
 * Isi `certificateNumber` dengan nomor sertifikat halal resmi Vitasari
 * (bisa dicek di https://bpjph.halal.go.id). Kalau dibiarkan kosong,
 * baris nomor sertifikat tidak ditampilkan di website.
 */
const HALAL = {
  certificateNumber: "",
};

const HIGHLIGHT_IDS = [
  "egg-cheese",
  "roti-coklat",
  "roti-sisir",
  "roti-abon-ayam",
  "puding-lumut",
  "bolu-jadoel",
  "bolen-pisang-coklat",
  "blackforest-15",
];

export default function Home() {
  const highlights = HIGHLIGHT_IDS.map((id) =>
    products.find((product) => product.id === id),
  ).filter(Boolean);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        {/* Foto latar penuh: suasana di dalam toko. Ganti file-nya di
            public/images/hero-bg.jpeg untuk memakai foto lain. */}
        <div className="hero__bg" aria-hidden="true">
          <img
            src={assetUrl("/images/hero-bg.jpeg")}
            alt=""
            fetchpriority="high"
          />
        </div>

        <div className="container hero__inner">
          <div className="hero__content">
            <VitasariWordmark className="hero__brand" />
            <span className="eyebrow">Terpercaya sejak 1991</span>
            {/* "Toko roti" dan "Bandung" sengaja ada di judul utama: inilah
                teks yang paling diperhatikan mesin pencari di halaman ini,
                dan dua kata itu persis yang diketik orang saat mencari. */}
            <h1>
              Toko Roti &amp; Kue Legendaris <em>di Bandung</em>
            </h1>
            <p>
              Vitasari Bakery adalah toko roti di Bandung yang memanggang roti
              hangat, cake, dan jajanan pasar setiap pagi dengan resep keluarga yang tidak pernah berubah. Pilih
              favoritmu, lalu kirim pesanan langsung ke WhatsApp cabang
              terdekat.
            </p>

            <div className="hero__actions">
              <Link to="/menu" className="btn btn--primary btn--lg">
                Pesan Sekarang
                <ArrowRightIcon width={16} height={16} />
              </Link>
              <Link to="/cabang" className="btn btn--ghost btn--lg">
                Lihat Cabang
              </Link>
            </div>

            <div className="hero__meta">
              <MapPinIcon width={16} height={16} />
              <span>7 cabang di Kota Bandung &middot; buka setiap hari</span>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__image-frame">
              {/* Potongan persegi dari foto potret aslinya, dipilih supaya cangkir dan roti
                  depan jatuh utuh di dalam bingkai bulat. Filenya dibuat ulang lewat
                  `node scripts/buat-hero-lingkaran.cjs`, jangan diedit langsung. */}
              <ProductImage
                src="/images/hero-lingkaran.jpeg"
                alt="Roti coklat Vitasari Bakery di atas talenan kayu, ditemani secangkir susu dan serutan coklat"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Favorit pelanggan */}
      <section className="section">
        <div className="container">
          <Reveal className="section__head">
            <div>
              <span className="eyebrow">Paling dicari</span>
              <h2 className="section__title">Favorit Pelanggan</h2>
              <p className="section__subtitle">
                Menu yang paling sering habis sebelum sore.
              </p>
            </div>
            <Link to="/menu" className="btn btn--ghost">
              Semua Menu
              <ArrowRightIcon width={16} height={16} />
            </Link>
          </Reveal>

          <div className="product-grid">
            {highlights.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Lokasi toko */}
      <section className="section section--muted">
        <div className="container">
          <Reveal className="section__head section__head--center">
            <div>
              <span className="eyebrow">Lokasi toko</span>
              <h2 className="section__title">
                Toko Roti Vitasari di 7 Lokasi Bandung
              </h2>
              <p className="section__subtitle">
                Dari Setiabudi di utara sampai Buah Batu di selatan. Pilih
                cabang terdekat untuk melihat alamat, jam buka, dan nomor
                WhatsApp-nya.
              </p>
            </div>
          </Reveal>

          <BranchLinkGrid />
        </div>
      </section>

      {/* Sertifikat halal */}
      <section className="section section--muted halal">
        <div className="container halal__inner">
          <Reveal className="halal__logo" variant="zoom">
            <img
              src={assetUrl("/images/halal-indonesia.svg")}
              alt="Logo Halal Indonesia dari Badan Penyelenggara Jaminan Produk Halal"
              width="120"
              height="215"
            />
          </Reveal>

          <Reveal className="halal__content" variant="right" delay={120}>
            <span className="eyebrow">Jaminan produk</span>
            <h2 className="section__title">Bersertifikat Halal</h2>
            <p>
              Seluruh roti, cake, dan jajanan pasar Vitasari Bakery diproduksi
              dengan bahan baku dan proses yang telah tersertifikasi halal. Dari
              pemilihan bahan sampai dapur produksi, semuanya kami jaga supaya
              keluarga Anda bisa menikmatinya dengan tenang.
            </p>

            {HALAL.certificateNumber && (
              <p className="halal__cert">
                Nomor sertifikat halal:{" "}
                <strong>{HALAL.certificateNumber}</strong>
              </p>
            )}

            <a
              className="btn btn--ghost"
              href="https://bpjph.halal.go.id/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cek di situs BPJPH
              <ArrowRightIcon width={16} height={16} />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
