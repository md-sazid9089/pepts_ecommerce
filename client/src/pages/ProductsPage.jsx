import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import productsApi from '@/services/api/products.api';
import ProductCard from '@/components/ProductCard/ProductCard';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import { queryKeys } from '@/lib/queryKeys';

// ─── Constants ──────────────────────────────────────────────────────────────
const LIMIT = 10;

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = {
  container: {
    backgroundColor: '#F5EDEC',
    minHeight: '100vh',
    paddingBottom: '40px',
  },
  pageHeader: {
    backgroundColor: 'white',
    borderBottom: '3px solid #F7B9C4',
    padding: '30px 20px',
    textAlign: 'center',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#533638',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#A0AEC0',
    margin: 0,
  },
  contentWrapper: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  topControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #F5EDEC',
  },
  filterSummary: {
    fontSize: '13px',
    color: '#667C7F',
    fontWeight: '500',
  },
  sortControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
  },
  sortSelect: {
    padding: '8px 12px',
    border: '1px solid #E2E8F0',
    borderRadius: '4px',
    fontSize: '12px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    width: '100%',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #F5EDEC',
  },
  emptyText: {
    fontSize: '16px',
    color: '#A0AEC0',
    margin: '0 0 20px 0',
  },
  // ── Pagination ──
  paginationWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px',
  },
  rangeText: {
    fontSize: '13px',
    color: '#667C7F',
    fontWeight: '500',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pageBtn: (active, disabled) => ({
    minWidth: '38px',
    height: '38px',
    padding: '0 10px',
    border: active ? 'none' : '1px solid #E2E8F0',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: active ? '700' : '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    backgroundColor: active ? '#533638' : disabled ? '#F9F9F9' : 'white',
    color: active ? 'white' : disabled ? '#CBD5E0' : '#533638',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
  }),
  ellipsis: {
    minWidth: '38px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#A0AEC0',
    userSelect: 'none',
  },
  loadingOverlay: {
    opacity: 0.5,
    pointerEvents: 'none',
    transition: 'opacity 0.2s ease',
  },
};

// ─── Pagination Logic ────────────────────────────────────────────────────────
/**
 * Builds the array of page numbers / ellipsis markers to display.
 * Always shows first + last; up to 5 consecutive numbers around current.
 */
function buildPageRange(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const delta = 2; // pages on each side of current
  const range = [];

  // Always include page 1
  range.push(1);

  const left  = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  if (left > 2)       range.push('...');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push('...');

  // Always include last page
  range.push(total);

  return range;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const [sortBy, setSortBy] = useState('popular');

  // Derive sort params for the API
  const sortMap = {
    'price-low':  { sortBy: 'price', sortOrder: 'asc' },
    'price-high': { sortBy: 'price', sortOrder: 'desc' },
    'newest':     { sortBy: 'createdAt', sortOrder: 'desc' },
    'popular':    {},
    'rating':     {},
  };
  const sortFilters = sortMap[sortBy] || {};

  // ── React Query ──────────────────────────────────────────────────────────
  const {
    data: queryData,
    isLoading,
    isFetching,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: queryKeys.products.list({ page, limit: LIMIT, search: searchQuery, ...sortFilters }),
    queryFn: () =>
      productsApi.getAll(page, LIMIT, { search: searchQuery, ...sortFilters }),
    placeholderData: keepPreviousData, // v5: keeps old page visible while next page loads
  });

  const products   = queryData?.data?.items       ?? [];
  const pagination = queryData?.data?.pagination   ?? {};
  const total      = pagination.total             ?? 0;
  const totalPages = pagination.totalPages        ?? 1;

  // Computed "Showing X-Y of Z"
  const rangeStart = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const rangeEnd   = Math.min(page * LIMIT, total);

  const error = isError ? (queryError?.message || 'Failed to load products') : null;

  // ── Navigation ───────────────────────────────────────────────────────────
  function goToPage(p) {
    const next = Math.max(1, Math.min(p, totalPages));
    const params = new URLSearchParams(searchParams);
    params.set('page', String(next));
    setSearchParams(params, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const pageRange = buildPageRange(page, totalPages);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p style={styles.subtitle}>
            {isLoading
              ? 'Loading products…'
              : total > 0
              ? `Showing ${rangeStart}–${rangeEnd} of ${total} products`
              : 'No products found'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={styles.contentWrapper}>
        <main style={styles.mainContent}>
          {/* Top Controls */}
          <div style={styles.topControls}>
            <div style={styles.filterSummary}>
              {!isLoading && total > 0 && (
                <>Showing <strong>{rangeStart}–{rangeEnd}</strong> of <strong>{total}</strong> products</>
              )}
              {isLoading && 'Loading…'}
            </div>
            <div style={styles.sortControl}>
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  goToPage(1); // reset to page 1 on sort change
                }}
                style={styles.sortSelect}
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: '16px', color: '#b91c1c', fontWeight: 600 }}>
              {error}
            </div>
          )}

          {/* Skeleton Loading */}
          {isLoading && (
            <div style={styles.grid}>
              {Array.from({ length: LIMIT }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Products Grid (dim while fetching next page) */}
          {!isLoading && products.length > 0 && (
            <div style={isFetching ? { ...styles.grid, ...styles.loadingOverlay } : styles.grid}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && products.length === 0 && !error && (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No products found in our catalog.</p>
            </div>
          )}

          {/* ── Pagination UI ── */}
          {!isLoading && totalPages > 1 && (
            <div style={styles.paginationWrapper}>
              <p style={styles.rangeText}>
                Showing {rangeStart}–{rangeEnd} of {total} products &nbsp;·&nbsp; Page {page} of {totalPages}
              </p>

              <nav aria-label="Product page navigation" style={styles.pagination}>
                {/* Prev */}
                <button
                  id="pagination-prev"
                  aria-label="Previous page"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                  style={styles.pageBtn(false, page <= 1)}
                >
                  ‹ Prev
                </button>

                {/* Page numbers + ellipsis */}
                {pageRange.map((item, idx) =>
                  item === '...' ? (
                    <span key={`ellipsis-${idx}`} style={styles.ellipsis}>…</span>
                  ) : (
                    <button
                      key={item}
                      id={`pagination-page-${item}`}
                      aria-label={`Go to page ${item}`}
                      aria-current={item === page ? 'page' : undefined}
                      onClick={() => goToPage(item)}
                      style={styles.pageBtn(item === page, false)}
                    >
                      {item}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  id="pagination-next"
                  aria-label="Next page"
                  disabled={page >= totalPages}
                  onClick={() => goToPage(page + 1)}
                  style={styles.pageBtn(false, page >= totalPages)}
                >
                  Next ›
                </button>
              </nav>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
