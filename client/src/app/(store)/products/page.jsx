'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '@/data/products';
import Filters from '@/components/Filters/Filters';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import { FiGrid, FiList, FiChevronDown } from 'react-icons/fi';
import styles from './page.module.css';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'new', label: 'New Arrivals' },
  { value: 'discount', label: 'Biggest Discount' },
];

const PAGE_SIZE = 12;

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [filters, setFilters] = useState({
    category: initialCategory,
    minPrice: '',
    maxPrice: '',
    brands: [],
    minRating: '',
    search: initialSearch,
  });
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);
  const [view, setView] = useState('grid');

  const handleFilterChange = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', brands: [], minRating: '', search: '' });
    setPage(1);
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category) result = result.filter(p => p.category === filters.category);

    // Price
    if (filters.minPrice) result = result.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter(p => p.price <= Number(filters.maxPrice));

    // Brands
    if (filters.brands?.length) result = result.filter(p => filters.brands.includes(p.brand));

    // Rating
    if (filters.minRating) result = result.filter(p => p.rating >= Number(filters.minRating));

    // Sort
    switch (sort) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'new': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case 'discount': result.sort((a, b) => b.discount - a.discount); break;
      default: result.sort((a, b) => b.reviews - a.reviews); break;
    }

    return result;
  }, [filters, sort]);

  const totalPages = Math.ceil(filteredAndSorted.length / PAGE_SIZE);
  const paginated = filteredAndSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const categoryLabel = filters.category
    ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
    : 'All Products';

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <a href="/">Home</a>
          <span>›</span>
          <span>{categoryLabel}</span>
          {filters.search && <><span>›</span><span>"{filters.search}"</span></>}
        </nav>

        <h1 className={styles.pageTitle}>
          {filters.search ? `Search: "${filters.search}"` : categoryLabel}
          <span className={styles.resultCount}>{filteredAndSorted.length} results</span>
        </h1>

        <div className={styles.layout}>
          {/* Filters sidebar */}
          <Filters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            productCount={filteredAndSorted.length}
          />

          {/* Main content */}
          <div className={styles.mainContent}>
            {/* Sort bar */}
            <div className={styles.sortBar}>
              <div className={styles.sortLeft}>
                <span className={styles.showingText}>
                  Showing {Math.min((page - 1) * PAGE_SIZE + 1, filteredAndSorted.length)}–
                  {Math.min(page * PAGE_SIZE, filteredAndSorted.length)} of {filteredAndSorted.length}
                </span>
              </div>
              <div className={styles.sortRight}>
                <div className={styles.sortSelect}>
                  <FiChevronDown size={14} className={styles.sortIcon} />
                  <select
                    value={sort}
                    onChange={e => { setSort(e.target.value); setPage(1); }}
                    className={styles.sortDropdown}
                    id="sort-products"
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.viewToggle}>
                  <button
                    className={`${styles.viewBtn} ${view === 'grid' ? styles.viewBtnActive : ''}`}
                    onClick={() => setView('grid')}
                    aria-label="Grid view"
                  >
                    <FiGrid size={16} />
                  </button>
                  <button
                    className={`${styles.viewBtn} ${view === 'list' ? styles.viewBtnActive : ''}`}
                    onClick={() => setView('list')}
                    aria-label="List view"
                  >
                    <FiList size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filters */}
            {(filters.category || filters.search || filters.minRating || filters.brands?.length > 0) && (
              <div className={styles.activeFilters}>
                <span className={styles.activeFiltersLabel}>Active:</span>
                {filters.category && (
                  <span className={styles.filterTag}>
                    {filters.category}
                    <button onClick={() => handleFilterChange('category', '')}>×</button>
                  </span>
                )}
                {filters.search && (
                  <span className={styles.filterTag}>
                    "{filters.search}"
                    <button onClick={() => handleFilterChange('search', '')}>×</button>
                  </span>
                )}
                {filters.minRating && (
                  <span className={styles.filterTag}>
                    ≥{filters.minRating}★
                    <button onClick={() => handleFilterChange('minRating', '')}>×</button>
                  </span>
                )}
                {filters.brands?.map(b => (
                  <span key={b} className={styles.filterTag}>
                    {b}
                    <button onClick={() => handleFilterChange('brands', filters.brands.filter(x => x !== b))}>×</button>
                  </span>
                ))}
                <button className={styles.clearAll} onClick={handleReset}>Clear All</button>
              </div>
            )}

            {/* Product grid */}
            <ProductGrid products={paginated} columns={view === 'list' ? 3 : 6} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={`${styles.pageBtn} ${styles.pageBtnNav}`}
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '...' ? (
                      <span key={`dots-${i}`} className={styles.pageDots}>…</span>
                    ) : (
                      <button
                        key={p}
                        className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                        onClick={() => { setPage(p); window.scrollTo(0, 0); }}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  className={`${styles.pageBtn} ${styles.pageBtnNav}`}
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
