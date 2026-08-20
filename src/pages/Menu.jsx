import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { SearchIcon } from '../components/Icons';
import { categories, products } from '../data/products';

const SORT_OPTIONS = [
  { id: 'default', label: 'Urutan Default' },
  { id: 'price-asc', label: 'Harga Termurah' },
  { id: 'price-desc', label: 'Harga Tertinggi' },
  { id: 'name-asc', label: 'Nama A - Z' },
];

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const requestedCategory = searchParams.get('kategori');
  const activeCategory = categories.some((category) => category.id === requestedCategory)
    ? requestedCategory
    : 'semua';

  const handleCategoryChange = (categoryId) => {
    if (categoryId === 'semua') {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ kategori: categoryId }, { replace: true });
    }
  };

  const visibleProducts = useMemo(() => {
    const query = keyword.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchCategory = activeCategory === 'semua' || product.category === activeCategory;
      const matchKeyword =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.unit || '').toLowerCase().includes(query);

      return matchCategory && matchKeyword;
    });

    const sorted = [...filtered];

    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sortBy === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name, 'id'));

    return sorted;
  }, [activeCategory, keyword, sortBy]);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <span className="eyebrow">Menu Vitasari</span>
          <h1>Pilih Roti &amp; Kue Favoritmu</h1>
          <p>
            Semua produk dipanggang setiap pagi di dapur kami. Tambahkan ke keranjang, lalu kirim
            daftar pesanan ke WhatsApp cabang pilihanmu.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="menu-toolbar">
            <div className="search-field">
              <SearchIcon width={18} height={18} />
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Cari roti, cake, atau jajanan..."
                aria-label="Cari produk"
              />
            </div>

            {/* Di layar HP kedua kontrol ini berdampingan; filter kategori memakai
                dropdown agar tidak memakan banyak baris seperti deretan chip. */}
            <div className="menu-toolbar__controls">
              <label className="sort-field">
                <span className="sr-only">Urutkan produk</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="filter-field">
                <span className="sr-only">Filter kategori</span>
                <select
                  value={activeCategory}
                  onChange={(event) => handleCategoryChange(event.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="chip-row" role="tablist" aria-label="Kategori produk">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === category.id}
                className={`chip chip--${category.id}${
                  activeCategory === category.id ? ' is-active' : ''
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <p className="result-count">
            Menampilkan <strong>{visibleProducts.length}</strong> dari {products.length} produk
          </p>

          {visibleProducts.length === 0 ? (
            <div className="empty-state">
              <h3>Produk tidak ditemukan</h3>
              <p>Coba kata kunci lain atau pilih kategori yang berbeda.</p>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setKeyword('');
                  handleCategoryChange('semua');
                }}
              >
                Reset pencarian
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                // Tanpa animasi muncul: daftarnya panjang, dan saat di-scroll
                // cepat animasi itu justru membuat produk terasa telat tampil.
                <ProductCard key={product.id} product={product} reveal={false} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
