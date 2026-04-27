import { useState } from 'react';
import ProductCard from '@/components/ProductCard/ProductCard';
import QuickViewModal from '@/components/QuickViewModal/QuickViewModal';
import { FiPackage } from 'react-icons/fi';

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    width: '100%',
  },
  gridMultiColumn: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  },
  item: {
    animation: 'fadeIn 0.5s ease-in-out forwards',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#666666',
  },
  emptyIcon: {
    fontSize: '48px',
    color: '#D1D5DB',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: '8px',
  },
  emptyDesc: {
    fontSize: '14px',
    color: '#666666',
  },
};

// Add keyframe animation
const animationStyle = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default function ProductGrid({ products, columns = 1, layout = 'horizontal' }) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  if (!products || products.length === 0) {
    return (
      <div style={styles.emptyState}>
        <style>{animationStyle}</style>
        <div style={styles.emptyIcon}><FiPackage size={48} /></div>
        <p style={styles.emptyTitle}>No products found</p>
        <p style={styles.emptyDesc}>Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  // For B2B horizontal layout, always use single column
  // For other layouts, use the specified columns
  const gridStyle = layout === 'horizontal' ? styles.grid : { ...styles.grid, ...styles.gridMultiColumn };

  return (
    <>
      <style>{animationStyle}</style>
      <div style={gridStyle}>
        {products.map((product, i) => (
          <div
            key={product.id}
            style={{
              ...styles.item,
              animationDelay: `${Math.min(i * 0.05, 0.4)}s`,
            }}
          >
            <ProductCard
              product={product}
              onQuickView={setQuickViewProduct}
            />
          </div>
        ))}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}

