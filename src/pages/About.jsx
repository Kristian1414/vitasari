import { Link } from 'react-router-dom';
import ProductImage from '../components/ProductImage';
import Reveal, { staggerDelay } from '../components/Reveal';
import { ArrowRightIcon, InstagramIcon } from '../components/Icons';

const TIMELINE = [
  {
    year: '1991',
    title: 'Dapur Pertama di Jl. H. Kurdi',
    text: 'Vitasari mulai dari satu oven kecil dan resep roti manis keluarga yang dijual ke tetangga sekitar.',
  },
  {
    year: '2000-an',
    title: 'Dikenal Se-Bandung',
    text: 'Bolu jadul, roti sisir, dan jajanan pasar Vitasari jadi langganan acara keluarga dan kantor.',
  },
  {
    year: 'Sekarang',
    title: 'Tujuh Cabang, Satu Resep',
    text: 'Meski cabang bertambah, adonan tetap dibuat dengan takaran dan cara yang sama seperti hari pertama.',
  },
];

export default function About() {
  return (
    <>
      <section className="page-header page-header--tentang">
        <div className="container">
          <span className="eyebrow">Tentang Kami</span>
          <h1>Terpercaya Sejak 1991</h1>
          <p>
            Tiga dekade memanggang roti untuk keluarga Bandung, dengan resep yang tidak pernah kami
            ubah.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container about-split">
          <Reveal className="about-split__media" variant="left">
            <ProductImage src="/images/about.jpg" alt="Dapur Vitasari Bakery" />
          </Reveal>

          <Reveal className="about-split__content" variant="right" delay={120}>
            <span className="eyebrow">Cerita kami</span>
            <h2 className="section__title">Roti yang Tumbuh Bersama Pelanggannya</h2>
            <p>
              Vitasari Bakery lahir tahun 1991 dari dapur rumah di kawasan Kurdi, Bandung. Yang
              awalnya hanya melayani tetangga, perlahan jadi langganan lintas generasi: anak-anak
              yang dulu dibelikan roti coklat keju kini datang membawa anaknya sendiri.
            </p>
            <p>
              Kami masih memanggang dini hari, masih memakai butter dan keju yang sama, dan masih
              menolak memakai pengawet. Yang berubah hanya jumlah cabang, supaya roti hangat kami
              lebih mudah dijangkau dari mana pun di Bandung.
            </p>

            <div className="about-split__actions">
              <Link to="/menu" className="btn btn--primary">
                Lihat Menu
                <ArrowRightIcon width={16} height={16} />
              </Link>
              <a
                href="https://www.instagram.com/vitasaribakery"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost"
              >
                <InstagramIcon width={16} height={16} />
                @vitasaribakery
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <div className="section__head section__head--center">
            <div>
              <span className="eyebrow">Perjalanan</span>
              <h2 className="section__title">Dari Satu Oven ke Tujuh Cabang</h2>
            </div>
          </div>

          <ol className="timeline">
            {TIMELINE.map((item, index) => (
              <Reveal
                key={item.year}
                as="li"
                className="timeline__item"
                delay={staggerDelay(index, 130)}
              >
                <span className="timeline__year">{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
