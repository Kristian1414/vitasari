import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page-header">
      <div className="container">
        <span className="eyebrow">404</span>
        <h1>Halaman Tidak Ditemukan</h1>
        <p>Sepertinya halaman yang kamu cari sudah habis seperti roti sore hari.</p>
        <Link to="/" className="btn btn--primary">
          Kembali ke Beranda
        </Link>
      </div>
    </section>
  );
}
