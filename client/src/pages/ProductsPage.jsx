import { useState, useMemo, useEffect } from 'react';
import { products as fallbackProducts } from '@/data/products';
import productsApi from '@/services/api/products.api';
import ProductCard from '@/components/ProductCard/ProductCard';
import { FiSliders, FiX, FiSearch, FiChevronDown } from 'react-icons/fi';

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
  searchBar: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
    maxWidth: '500px',
    margin: '20px auto 0',
  },
  searchInput: {
    flex: 1,
    padding: '10px 14px',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  searchBtn: {
    padding: '10px 20px',
    backgroundColor: '#533638',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  contentWrapper: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  filterCard: {
    backgroundColor: '#F5EDEC',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #F5EDEC',
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  filterTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#533638',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  closeBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#533638',
  },
  filterSection: {
    marginBottom: '16px',
  },
  filterSectionTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#533638',
    margin: '0 0 10px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  filterOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0',
    fontSize: '13px',
    color: '#667C7F',
    cursor: 'pointer',
  },
  filterCheckbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: '#F7B9C4',
  },
  priceInputs: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  priceInput: {
    padding: '8px',
    border: '1px solid #E2E8F0',
    borderRadius: '4px',
    fontSize: '12px',
  },
  clearBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#F5EDEC',
    color: '#533638',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
    transition: 'all 0.3s ease',
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
    fontSize: '12px',
    color: '#667C7F',
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
  mobileFilterBtn: {
    display: 'flex',
    width: '100%',
    padding: '12px',
    backgroundColor: '#533638',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    gap: '8px',
    alignItems: 'center',
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
  loadMoreBtn: {
    display: 'block',
    margin: '30px auto 0',
    padding: '12px 40px',
    backgroundColor: '#533638',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
  sidebarOverlay: {
    display: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  sidebarMobile: {
    display: 'none',
    position: 'fixed',
    left: 0,
    top: 0,
    width: '280px',
    height: '100vh',
    backgroundColor: 'white',
    zIndex: 999,
    overflowY: 'auto',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
  },
};

export default function ProductsPage() {
  const [sortBy, setSortBy] = useState('popular');
  const [displayCount, setDisplayCount] = useState(20);
  const [productsList, setProductsList] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const response = await productsApi.getAll(1, 100);

      if (response.success) {
        setProductsList(response.data?.items || fallbackProducts);
        setError(null);
      } else {
        setError(response.message || 'Failed to load products');
        setProductsList(fallbackProducts);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Filter and sort products (Simplified to only Sorting)
  const displayedProducts = useMemo(() => {
    let results = [...productsList];

    // Sort products
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
        break;
      case 'rating':
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
      default:
        results.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
    }
    return results;
  }, [sortBy]);

  const visibleProducts = displayedProducts.slice(0, displayCount);

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.pageHeader} data-page-header>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>All Products</h1>
          <p style={styles.subtitle}>
            Showing {visibleProducts.length} of {displayedProducts.length} items
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={styles.contentWrapper}>
        <main style={styles.mainContent}>
          {/* Top Controls (Sorting only) */}
          <div style={styles.topControls}>
            <div style={styles.filterSummary}>
              {displayedProducts.length} products available in catalog
            </div>
            <div style={styles.sortControl}>
              <span>Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
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

          {loading && (
            <div style={{ padding: '16px', color: '#374151', fontWeight: 600 }}>
              Loading products from the backend...
            </div>
          )}
          {error && (
            <div style={{ padding: '16px', color: '#b91c1c', fontWeight: 600 }}>
              {error}
            </div>
          )}

          {/* Products Grid */}
          {visibleProducts.length > 0 ? (
            <>
              <div style={styles.grid}>
                {visibleProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More */}
              {displayCount < displayedProducts.length && (
                <button 
                  onClick={() => setDisplayCount(prev => prev + 20)}
                  style={styles.loadMoreBtn}
                >
                  Load More Products
                </button>
              )}
            </>
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No products found in our catalog.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
