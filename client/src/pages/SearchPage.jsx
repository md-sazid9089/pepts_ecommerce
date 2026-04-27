import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import productsApi from '@/services/api/products.api'
import ProductCard from '@/components/ProductCard/ProductCard'
import { queryKeys } from '@/lib/queryKeys'
import { FiSearch, FiArrowLeft, FiFilter } from 'react-icons/fi'

const styles = {
  container: {
    backgroundColor: '#F5EDEC',
    minHeight: '100vh',
    paddingBottom: '60px',
  },
  header: {
    backgroundColor: 'white',
    borderBottom: '3px solid #F7B9C4',
    padding: '40px 20px',
    textAlign: 'center',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#867671',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '20px',
    transition: 'color 0.3s ease',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#533638',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#A0AEC0',
    margin: 0,
  },
  content: {
    maxWidth: '1200px',
    margin: '40px auto 0',
    padding: '0 20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '100px 20px',
  },
  loader: {
    width: '40px',
    height: '40px',
    border: '4px solid #F7B9C4',
    borderTopColor: '#533638',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #F7B9C4',
  },
  errorText: {
    color: '#E53E3E',
    fontWeight: 600,
    fontSize: '18px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  emptyIcon: {
    fontSize: '64px',
    color: '#F7B9C4',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#533638',
    marginBottom: '12px',
  },
  emptySubtitle: {
    color: '#867671',
    marginBottom: '30px',
  },
  browseBtn: {
    display: 'inline-block',
    padding: '12px 30px',
    backgroundColor: '#533638',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    transition: 'transform 0.2s ease',
  }
}

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data: products = [], isLoading: loading, isError, error: queryError } = useQuery({
    queryKey: queryKeys.products.list({ search: query }),
    queryFn: () => productsApi.getAll(1, 50, { search: query }),
    select: (response) => response?.data?.items || [],
    enabled: !!query.trim(),  // don't fetch if query is empty
    staleTime: 0,             // search results always refetch — never serve stale
  })

  const error = isError ? (queryError?.message || 'Failed to fetch search results') : null

  return (
    <div style={styles.container}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/products" style={styles.backLink}>
            <FiArrowLeft /> Back to Catalog
          </Link>
          <h1 style={styles.title}>
            {query ? `Results for "${query}"` : 'Search Products'}
          </h1>
          <p style={styles.subtitle}>
            {loading ? 'Searching...' : `Found ${products.length} products matches your search`}
          </p>
        </div>
      </header>

      <main style={styles.content}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loader} />
            <p style={{ marginTop: '20px', color: '#533638', fontWeight: 600 }}>Searching our wholesale catalog...</p>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{ ...styles.browseBtn, marginTop: '20px', border: 'none', cursor: 'pointer' }}
            >
              Try Again
            </button>
          </div>
        ) : products.length > 0 ? (
          <div style={styles.grid}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}><FiSearch /></div>
            <h2 style={styles.emptyTitle}>No matches found</h2>
            <p style={styles.emptySubtitle}>
              We couldn't find any products matching "{query}". <br />
              Try using different keywords or check for spelling errors.
            </p>
            <Link to="/products" style={styles.browseBtn}>
              Browse All Products
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
