/**
 * FeaturedProducts — self-contained section component.
 * Fetches products from the "Most Demanding" category and renders them.
 * Returns null on error or empty data so it never breaks the homepage.
 */

import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import productsApi from '@/services/api/products.api'
import ProductCard from '@/components/ProductCard/ProductCard'
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton'

/* ─── Inline styles — no new classes ───────────────────────────────────────── */
const CSS = `
  .fp-section {
    background: #fff;
    padding: 4rem 2rem;
  }
  .fp-inner {
    max-width: 1400px;
    margin: 0 auto;
  }
  .fp-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
  .fp-header-left { display: flex; flex-direction: column; gap: 6px; }
  .fp-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1A202C;
    margin: 0;
    line-height: 1.2;
  }
  .fp-subtitle {
    font-size: 0.9rem;
    color: #667C7F;
    margin: 0;
  }
  .fp-view-all {
    background: none;
    border: 1.5px solid #533638;
    color: #533638;
    padding: 9px 20px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }
  .fp-view-all:hover {
    background: #533638;
    color: white;
  }
  .fp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }
  .fp-skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }

  @media (max-width: 600px) {
    .fp-section { padding: 2rem 1rem; }
    .fp-title   { font-size: 1.4rem; }
    .fp-header  { align-items: flex-start; }
    .fp-grid,
    .fp-skeleton-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
  }
`

export default function FeaturedProducts() {
  const navigate = useNavigate()

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn:  () => productsApi.getFeatured(),
    staleTime: 2 * 60 * 1000,  // 2 minutes
    retry: 1,
  })

  const products = response?.data ?? []

  // Render nothing on error or if no products
  if (!isLoading && (isError || !response?.success || products.length === 0)) {
    return null
  }

  return (
    <>
      <style>{CSS}</style>
      <section id="featured-products" className="fp-section">
        <div className="fp-inner">

          {/* ── Header ── */}
          <div className="fp-header">
            <div className="fp-header-left">
              <h2 className="fp-title">Featured Products</h2>
              <p className="fp-subtitle">Our most popular picks loved by wholesale buyers</p>
            </div>
            <button
              className="fp-view-all"
              onClick={() => navigate('/products?category=Most+Demanding')}
              aria-label="View all Most Demanding products"
            >
              View All →
            </button>
          </div>

          {/* ── Loading skeleton (8 cards) ── */}
          {isLoading && (
            <div className="fp-skeleton-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* ── Product grid ── */}
          {!isLoading && products.length > 0 && (
            <div className="fp-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  )
}
