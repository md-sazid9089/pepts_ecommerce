import { FiArrowRight, FiZap } from 'react-icons/fi';
import ProductCardPremium from '@/components/ProductCard/ProductCard.premium';
import styles from './FlashSale.premium.module.css';

export default function FlashSalePremium({ products = [] }) {
  if (!products || products.length === 0) return null;

  const flashProducts = products.filter(p => p.isFlashSale).slice(0, 12);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <div className={styles.titleBadge}>
              <FiZap size={20} />
              <span>Flash Sale</span>
            </div>
            <h2 className={styles.title}>Limited Time Offers</h2>
            <p className={styles.subtitle}>
              Grab these exclusive deals before they&apos;re gone!
            </p>
          </div>

          {/* Timer / CTA */}
          <div className={styles.headerRight}>
            <a href="/flash-sale" className={styles.viewAll}>
              <span>View All Deals</span>
              <FiArrowRight size={18} />
            </a>
          </div>
        </div>

        {/* Scrollable Cards */}
        <div className={styles.scrollContainer}>
          <div className={styles.cardsWrapper}>
            {flashProducts.map((product) => (
              <div key={product.id} className={styles.cardWrapper}>
                <ProductCardPremium product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
