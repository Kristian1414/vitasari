import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CloseIcon, SearchIcon } from '../components/Icons';
import { categories, products } from '../data/products';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useScrollLock } from '../hooks/useScrollLock';

const SORT_OPTIONS = [
  { id: 'default', label: 'Urutan default' },
  { id: 'price-asc', label: 'Harga termurah' },
  { id: 'price-desc', label: 'Harga tertinggi' },
  { id: 'name-asc', label: 'Nama A–Z' },
];

/**
 * Menyamakan ejaan yang sering berbeda supaya pencarian tetap ketemu:
 * "cokelat" = "coklat", "keju" = "cheese", huruf besar-kecil diabaikan.
 */
const SINONIM = [
  [/cokelat|chocolate|choco\b/g, 'coklat'],
  [/cheese/g, 'keju'],
  [/srikaya/g, 'sarikaya'],
  [/blueberry|blubery/g, 'bluberi'],
];

const normalisasi = (text) =>
  SINONIM.reduce(
    (hasil, [pola, ganti]) => hasil.replace(pola, ganti),
    (text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''),
  );

const categoryLabelById = Object.fromEntries(categories.map((c) => [c.id, c.label]));

/** Teks yang dicari untuk tiap produk: nama, satuan, dan nama kategorinya. */
const searchIndex = new Map(
  products.map((product) => [
    product.id,
    normalisasi(`${product.name} ${product.unit || ''} ${categoryLabelById[product.category] || ''}`),
  ]),
);

const countFor = (categoryId) =>
  categoryId === 'semua'
    ? products.length
    : products.filter((product) => product.category === categoryId).length;

/**
 * Isi panel filter. Dipakai dua kali dengan isi yang sama: sebagai kolom kiri
 * di layar lebar, dan sebagai panel yang naik dari bawah di layar HP.
 * `idPrefix` membedakan id kolom isian keduanya supaya label tetap terhubung.
 */
function FilterPanel({
  idPrefix,
  sortBy,
  onSort,
  activeCategory,
  onCategory,
  activeCount,
  onReset,
}) {
  return (
    <div className="filter-panel">
      <div className="filter-panel__head">
        <h2 className="filter-panel__title">Filter</h2>
        {activeCount > 0 && (
          <button type="button" className="filter-panel__reset" onClick={onReset}>
            Reset
          </button>
        )}
      </div>

      <fieldset className="filter-group">
        <legend className="filter-group__title">Urutkan</legend>
        <div className="filter-options">
          {SORT_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={`filter-option${sortBy === option.id ? ' is-active' : ''}`}
            >
              <input
                type="radio"
                name={`${idPrefix}-sort`}
                value={option.id}
                checked={sortBy === option.id}
                onChange={() => onSort(option.id)}
              />
              <span className="filter-option__dot" aria-hidden="true" />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend className="filter-group__title">Kategori</legend>
        <div className="filter-options">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={activeCategory === category.id}
              className={`filter-category${activeCategory === category.id ? ' is-active' : ''}`}
              onClick={() => onCategory(category.id)}
            >
              <span>{category.label}</span>
              <span className="filter-category__count">{countFor(category.id)}</span>
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Panel filter versi HP: kunci scroll halaman, tahan fokus di dalamnya,
  // dan tutup dengan Escape.
  useScrollLock(isSheetOpen);
  const sheetRef = useFocusTrap(isSheetOpen);
  useEffect(() => {
    if (!isSheetOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setIsSheetOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSheetOpen]);

  const requestedCategory = searchParams.get('kategori');
  const activeCategory = categories.some((category) => category.id === requestedCategory)
    ? requestedCategory
    : 'semua';

  const scrollToResults = () => {
    // Kalau pengguna sudah menggulir jauh ke bawah lalu mengubah filter, bawa
    // kembali ke awal daftar produk supaya hasil barunya langsung terlihat.
    const grid = resultsRef.current;
    if (grid && grid.getBoundingClientRect().top < 0) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCategoryChange = (categoryId) => {
    if (categoryId === 'semua') {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ kategori: categoryId }, { replace: true });
    }
    if (!isSheetOpen) scrollToResults();
  };

  const visibleProducts = useMemo(() => {
    const kata = normalisasi(keyword.trim()).split(/\s+/).filter(Boolean);

    const filtered = products.filter((product) => {
      const matchCategory = activeCategory === 'semua' || product.category === activeCategory;
      // Semua kata harus ada, urutannya bebas: "keju roti" menemukan "Roti Keju".
      const teks = searchIndex.get(product.id);
      const matchKeyword = kata.every((k) => teks.includes(k));
      return matchCategory && matchKeyword;
    });

    const sorted = [...filtered];

    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sortBy === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name, 'id'));

    return sorted;
  }, [activeCategory, keyword, sortBy]);

  // Jumlah filter yang sedang aktif (selain pencarian), untuk tombol Filter
  // di HP dan tombol Reset di panel.
  const activeCount = (activeCategory !== 'semua' ? 1 : 0) + (sortBy !== 'default' ? 1 : 0);

  const resetFilters = () => {
    setSortBy('default');
    setSearchParams({}, { replace: true });
  };

  const clearSearch = () => {
    setKeyword('');
    searchRef.current?.focus();
  };

  const panelProps = {
    sortBy,
    onSort: setSortBy,
    activeCategory,
    onCategory: handleCategoryChange,
    activeCount,
    onReset: resetFilters,
  };

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
        <div className="container catalog">
          {/* Kolom filter di kiri (layar lebar saja). */}
          <aside className="catalog__sidebar" aria-label="Filter produk">
            <FilterPanel idPrefix="sidebar" {...panelProps} />
          </aside>

          <div className="catalog__main">
            <div className="menu-toolbar">
              <div className="search-field">
                <SearchIcon width={16} height={16} />
                <input
                  ref={searchRef}
                  type="search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape' && keyword) {
                      event.preventDefault();
                      setKeyword('');
                    }
                  }}
                  placeholder="Cari roti, cake, atau jajanan..."
                  aria-label="Cari produk"
                  enterKeyHint="search"
                />
                {keyword && (
                  <button
                    type="button"
                    className="search-field__clear"
                    onClick={clearSearch}
                    aria-label="Hapus pencarian"
                  >
                    <CloseIcon width={14} height={14} />
                  </button>
                )}
              </div>

              {/* Tombol pembuka panel filter (layar HP saja). */}
              <button
                type="button"
                className="filter-toggle"
                onClick={() => setIsSheetOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={isSheetOpen}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </svg>
                Filter
                {activeCount > 0 && <span className="filter-toggle__count">{activeCount}</span>}
              </button>
            </div>

            {/* Chip kategori untuk ganti kategori cepat di HP; di layar lebar
                kategori sudah ada di kolom kiri. */}
            <div className="chip-row" role="group" aria-label="Kategori produk">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={activeCategory === category.id}
                  className={`chip chip--${category.id}${
                    activeCategory === category.id ? ' is-active' : ''
                  }`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.label}
                  <span className="chip__count">{countFor(category.id)}</span>
                </button>
              ))}
            </div>

            <p className="result-count" aria-live="polite" ref={resultsRef}>
              Menampilkan <strong>{visibleProducts.length}</strong> dari {products.length} produk
              {keyword.trim() && (
                <>
                  {' '}untuk &ldquo;<strong>{keyword.trim()}</strong>&rdquo;
                </>
              )}
            </p>

            {visibleProducts.length === 0 ? (
              <div className="empty-state">
                <h3>Produk tidak ditemukan</h3>
                <p>Coba kata kunci lain, atau pilih kategori yang berbeda.</p>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setKeyword('');
                    resetFilters();
                  }}
                >
                  Reset pencarian &amp; filter
                </button>
              </div>
            ) : (
              <div className="product-grid catalog__grid">
                {visibleProducts.map((product, index) => (
                  // Tanpa animasi muncul: daftarnya panjang, dan saat di-scroll
                  // cepat animasi itu justru membuat produk terasa telat tampil.
                  // Dua baris pertama (8 kartu) langsung terlihat saat halaman
                  // dibuka, jadi fotonya diunduh lebih dulu.
                  <ProductCard
                    key={product.id}
                    product={product}
                    reveal={false}
                    priority={index < 8}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Panel filter versi HP: naik dari bawah layar. */}
      <div
        className={`filter-sheet-overlay${isSheetOpen ? ' is-open' : ''}`}
        onClick={() => setIsSheetOpen(false)}
        aria-hidden="true"
      />
      <div
        ref={sheetRef}
        className={`filter-sheet${isSheetOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filter produk"
        aria-hidden={!isSheetOpen}
      >
        <span className="filter-sheet__grip" aria-hidden="true" />
        <button
          type="button"
          className="icon-button filter-sheet__close"
          onClick={() => setIsSheetOpen(false)}
          aria-label="Tutup filter"
        >
          <CloseIcon width={18} height={18} />
        </button>
        <div className="filter-sheet__body">
          <FilterPanel idPrefix="sheet" {...panelProps} />
        </div>
        <div className="filter-sheet__footer">
          <button type="button" className="btn btn--primary btn--block" onClick={() => setIsSheetOpen(false)}>
            Tampilkan {visibleProducts.length} produk
          </button>
        </div>
      </div>
    </>
  );
}
