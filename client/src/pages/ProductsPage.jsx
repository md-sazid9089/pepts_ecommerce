import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import productsApi from '@/services/api/products.api';
import categoriesApi from '@/services/api/categories.api';
import ProductCard from '@/components/ProductCard/ProductCard';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import { queryKeys } from '@/lib/queryKeys';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

// ─── Constants ──────────────────────────────────────────────────────────────
const ROWS_PER_PAGE = 10;

function getProductsPerPage() {
  if (typeof window === 'undefined') return ROWS_PER_PAGE * 4;
  if (window.innerWidth >= 1024) return ROWS_PER_PAGE * 4;
  if (window.innerWidth >= 768) return ROWS_PER_PAGE * 3;
  return ROWS_PER_PAGE * 2;
}

const PRODUCTS_GRID_CSS = `
  .products-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    width: 100%;
    padding-left: 16px;
    padding-right: 16px;
    box-sizing: border-box;
  }
  @media (min-width: 768px) {
    .products-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      padding-left: 24px;
      padding-right: 24px;
    }
  }
  @media (min-width: 1024px) {
    .products-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }
  }
`;

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = {
  container: {
    backgroundColor: '#F5EDEC',
    minHeight: '100vh',
    paddingBottom: '40px',
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
  // ── Category filter bar ──
  categoryBar: {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #F5EDEC',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  categoryLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#533638',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginRight: '4px',
    flexShrink: 0,
  },
  categoryBtn: (active) => ({
    padding: '7px 16px',
    borderRadius: '20px',
    border: active ? 'none' : '1px solid #E2E8F0',
    fontSize: '13px',
    fontWeight: active ? '700' : '500',
    cursor: 'pointer',
    backgroundColor: active ? '#533638' : 'white',
    color: active ? 'white' : '#533638',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  }),
  // ── Controls bar ──
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
    margin: '20px 0',
    padding: '15px',
    backgroundColor: '#F8FAFC',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
  },
  rangeText: {
    fontSize: '13px',
    color: '#667C7F',
    fontWeight: '500',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '4px',
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

// ─── Pagination helper ────────────────────────────────────────────────────────
function buildPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const delta = 2;
  const range = [1];
  const left  = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);
  if (left > 2) range.push('...');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push('...');
  range.push(total);
  return range;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productsPerPage, setProductsPerPage] = useState(getProductsPerPage);
  const searchQuery  = searchParams.get('search')   || '';
  const activeCategory = searchParams.get('category') || '';          // category name
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const sortBy = searchParams.get('sort') || 'popular';

  useEffect(() => {
    const handleResize = () => setProductsPerPage(getProductsPerPage());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Helper: update a single URL param, reset page to 1 unless explicitly kept ──
  function setParam(key, value, keepPage = false) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (!keepPage) params.set('page', '1');
    setSearchParams(params, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToPage(p) {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(Math.max(1, Math.min(p, totalPages))));
    setSearchParams(params, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Sort param mapping → API fields
  const sortMap = {
    'price-low':  { sortBy: 'price',     sortOrder: 'asc'  },
    'price-high': { sortBy: 'price',     sortOrder: 'desc' },
    'newest':     { sortBy: 'createdAt', sortOrder: 'desc' },
    'popular':    {},
    'rating':     {},
  };
  const sortFilters = sortMap[sortBy] || {};

  // ── Fetch categories ─────────────────────────────────────────────────────
  const { data: categoriesData } = useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn:  () => categoriesApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 min — categories rarely change
  });
  const categories = categoriesData?.data ?? [];

  // ── Fetch products ───────────────────────────────────────────────────────
  const {
    data: queryData,
    isLoading,
    isFetching,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: queryKeys.products.list({
      page,
      limit: productsPerPage,
      search: searchQuery,
      category: activeCategory,
      ...sortFilters,
    }),
    queryFn: () =>
      productsApi.getAll(page, productsPerPage, {
        search:   searchQuery,
        category: activeCategory || undefined,
        ...sortFilters,
      }),
    placeholderData: keepPreviousData,
  });

  const products   = queryData?.data?.items      ?? [];
  const pagination = queryData?.data?.pagination ?? {};
  const total      = pagination.total            ?? 0;
  const totalPages = pagination.totalPages       ?? 1;

  const rangeStart = total === 0 ? 0 : (page - 1) * productsPerPage + 1;
  const rangeEnd   = Math.min(page * productsPerPage, total);
  const error = isError ? (queryError?.message || 'Failed to load products') : null;

  const pageRange = buildPageRange(page, totalPages);

  // ─── Render ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading products…" />;
  }

  return (
    <div style={styles.container}>
      <style>{PRODUCTS_GRID_CSS}</style>
      {/* Content */}
      <div style={styles.contentWrapper}>
        <main style={styles.mainContent}>

          {/* ── Category Filter Bar ── */}
          <div style={styles.categoryBar} role="group" aria-label="Filter by category">
            <span style={styles.categoryLabel}>Category:</span>

            {/* All */}
            <button
              id="category-filter-all"
              style={styles.categoryBtn(!activeCategory)}
              onClick={() => setParam('category', '')}
              aria-pressed={!activeCategory}
            >
              All
            </button>

            {/* Dynamic category buttons from API */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`category-filter-${cat.id}`}
                style={styles.categoryBtn(activeCategory === cat.name)}
                onClick={() => setParam('category', cat.name)}
                aria-pressed={activeCategory === cat.name}
                title={`${cat.productCount ?? 0} products`}
              >
                {cat.name}
                {cat.productCount > 0 && (
                  <span style={{
                    marginLeft: '6px',
                    fontSize: '11px',
                    opacity: 0.75,
                    fontWeight: '500',
                  }}>
                    ({cat.productCount})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Top Controls: summary + sort ── */}
          <div style={styles.topControls}>
            <div style={styles.filterSummary}>
              {!isLoading && total > 0 && (
                <>
                  Showing <strong>{rangeStart}–{rangeEnd}</strong> of <strong>{total}</strong> products
                  {activeCategory && <> in <strong>{activeCategory}</strong></>}
                </>
              )}
              {isLoading && 'Loading…'}
            </div>
            <div style={styles.sortControl}>
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setParam('sort', e.target.value)}
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

          {/* Skeleton — only shown while paginating (isFetching but data already exists) */}
          {isFetching && !isLoading && (
            <div
              className="products-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 px-4 md:px-6"
              style={styles.grid}
            >
              {Array.from({ length: productsPerPage }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Products Grid (dimmed while fetching next page) */}
          {!isLoading && products.length > 0 && (
            <div
              className="products-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 px-4 md:px-6"
              style={isFetching ? { ...styles.grid, ...styles.loadingOverlay } : styles.grid}
            >
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && products.length === 0 && !error && (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>
                {activeCategory
                  ? `No products found in "${activeCategory}".`
                  : 'No products found in our catalog.'}
              </p>
              {activeCategory && (
                <button
                  onClick={() => setParam('category', '')}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#533638',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px',
                  }}
                >
                  View all products
                </button>
              )}
            </div>
          )}

          {/* ── Pagination UI ── */}
          {!isLoading && totalPages > 1 && (
            <div style={styles.paginationWrapper}>
              <p style={styles.rangeText}>
                Showing {rangeStart}–{rangeEnd} of {total} products &nbsp;·&nbsp; Page {page} of {totalPages}
              </p>

              <nav aria-label="Product page navigation" style={styles.pagination}>
                <button
                  id="pagination-prev"
                  aria-label="Previous page"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                  style={styles.pageBtn(false, page <= 1)}
                >
                  ‹ Prev
                </button>

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
