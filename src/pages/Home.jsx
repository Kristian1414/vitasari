import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import VitasariWordmark from "../components/VitasariWordmark";
import Reveal, { staggerDelay } from "../components/Reveal";
import {
  ArrowRightIcon,
  BreadIcon,
  ClockIcon,
  MapPinIcon,
  SparkleIcon,
} from "../components/Icons";
import { categories, products } from "../data/products";
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

const REASONS = [
  {
    icon: <BreadIcon width={24} height={24} />,
    tone: "amber",
    title: "Resep Warisan Keluarga",
    text: "Adonan dan isian dibuat dengan resep yang sama sejak 1991, tanpa jalan pintas dan tanpa pengawet.",
  },
  {
    icon: <ClockIcon width={24} height={24} />,
    tone: "terracotta",
    title: "Dipanggang Setiap Pagi",
    text: "Produksi dimulai dini hari supaya roti yang kamu ambil di toko masih hangat dan wangi.",
  },
  {
    icon: <SparkleIcon width={24} height={24} />,
    tone: "pandan",
    title: "Bahan Pilihan",
    text: "Butter, keju, dan coklat berkualitas dengan takaran yang tidak dikurangi, rasa selalu konsisten.",
  },
];

export default function Home() {
  const highlights = HIGHLIGHT_IDS.map((id) =>
    products.find((product) => product.id === id),
  ).filter(Boolean);

  const showcaseCategories = categories.filter(
    (category) => category.id !== "semua",
  );

  return (
    <>
      {/* Hero */}
      <section className="hero">
        {/* Foto latar penuh. Ganti file-nya di public/images/hero-bg.jpg untuk memakai foto Vitasari. */}
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
            <h1>
              Roti Hangat &amp; Kue Legendaris <em>Khas Bandung</em>
            </h1>
            <p>
              Vitasari Bakery memanggang roti, cake, dan jajanan pasar setiap
              pagi dengan resep keluarga yang tidak pernah berubah. Pilih
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
              <ProductImage src="/images/hero.jpg" alt="Roti Vitasari Bakery" />
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
                Menu yang paling sering habis sebelum sore. Tambahkan ke
                keranjang, isinya tetap tersimpan walau halaman di-refresh.
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

      {/* Kategori */}
      <section className="section section--muted">
        <div className="container">
          <Reveal className="section__head section__head--center">
            <div>
              <span className="eyebrow">Kategori</span>
              <h2 className="section__title">Semua yang Kami Panggang</h2>
              <p className="section__subtitle">
                Dari roti manis harian sampai cake untuk perayaan keluarga.
              </p>
            </div>
          </Reveal>

          <div className="category-grid">
            {showcaseCategories.map((category, index) => {
              const count = products.filter(
                (product) => product.category === category.id,
              ).length;

              return (
                <Reveal
                  key={category.id}
                  as={Link}
                  to={`/menu?kategori=${category.id}`}
                  className={`category-card category-card--${category.id}`}
                  variant="zoom"
                  delay={staggerDelay(index, 80)}
                >
                  <span className="category-card__icon">
                    <BreadIcon width={24} height={24} />
                  </span>
                  <h3>{category.label}</h3>
                  <span>{count} varian</span>
                  <ArrowRightIcon
                    width={16}
                    height={16}
                    className="category-card__arrow"
                  />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kenapa Vitasari */}
      <section className="section">
        <div className="container">
          <Reveal className="section__head section__head--center">
            <div>
              <span className="eyebrow">Kenapa Vitasari</span>
              <h2 className="section__title">Tiga Dekade Menjaga Rasa</h2>
            </div>
          </Reveal>

          <div className="reason-grid">
            {REASONS.map((reason, index) => (
              <Reveal
                key={reason.title}
                as="article"
                className={`reason-card reason-card--${reason.tone}`}
                delay={staggerDelay(index, 110)}
              >
                <span className="reason-card__icon">{reason.icon}</span>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </Reveal>
            ))}
          </div>
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
