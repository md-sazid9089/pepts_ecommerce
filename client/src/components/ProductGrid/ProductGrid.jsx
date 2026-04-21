import { useState } from 'react';
import ProductCard from '@/components/ProductCard/ProductCard';
import QuickViewModal from '@/components/QuickViewModal/QuickViewModal';
import { FiPackage } from 'react-icons/fi';


export default function ProductGrid({ products, columns = 4 }) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><FiPackage size={48} /></div>
        <p className="empty-state-title">No products found</p>
        <p className="empty-state-desc">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.grid} data-columns={columns}>
        {products.map((product, i) => (
          <div
            key={product.id}
            className={styles.item}
            style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
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

