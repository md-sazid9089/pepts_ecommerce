'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { products, getFeaturedProducts, categories } from '@/data/products';
import styles from './page.module.css';

const HeroSectionPremium = dynamic(() => import('@/components/HeroSection/HeroSection.premium'), { ssr: false });
const ProductCardPremium = dynamic(() => import('@/components/ProductCard/ProductCard.premium'), { ssr: false });
const FlashSalePremium = dynamic(() => import('@/components/FlashSale/FlashSale.premium'), { ssr: false });
const CategoriesGridPremium = dynamic(() => import('@/components/CategoriesGrid/CategoriesGrid.premium'), { ssr: false });

export default function HomePage() {
  const featuredProducts = getFeaturedProducts() || [];
  const justForYouProducts = products?.slice(0, 8) || [];
  const newArrivals = products?.filter(p => p.isNew).slice(0, 8) || [];

  return (
    <div className={styles.homePage}>
      
      {/* HERO SECTION - SOFT PREMIUM */}
      <HeroSectionPremium />

      {/* CATEGORIES GRID - SOFT PREMIUM */}
      <section className={styles.premiumSection}>
        <div className="container">
          <CategoriesGridPremium categories={categories} />
        </div>
      </section>

      {/* FLASH SALE - SOFT PREMIUM */}
      <section className={styles.premiumSection}>
        <div className="container">
          <FlashSalePremium products={products} />
        </div>
      </section>

      {/* Featured Collections */}
      <section className={styles.featuredSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Collections</h2>
            <p className={styles.sectionSubtitle}>Handpicked pieces that define elegance</p>
          </div>
          <div className={styles.productGrid}>
            {featuredProducts.map((product) => (
              <ProductCardPremium key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className={styles.trustSection}>
        <div className="container">
          <div className={styles.trustGrid}>
            {[
              {icon: '🛡️', title: '100% Authentic', desc: 'All products verified for authenticity'},
              {icon: '📦', title: 'Free Shipping', desc: 'On orders over $50'},
              {icon: '💬', title: '24/7 Support', desc: 'Dedicated customer service'},
              {icon: '🔄', title: 'Easy Returns', desc: '30-day return policy'},
            ].map((item, i) => (
              <div key={i} className={styles.trustCard}>
                <div className={styles.trustIcon}>{item.icon}</div>
                <h3 className={styles.trustTitle}>{item.title}</h3>
                <p className={styles.trustDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className={`${styles.featuredSection} ${styles.beigeBg}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>New Arrivals</h2>
            <p className={styles.sectionSubtitle}>Fresh additions to our collection</p>
          </div>
          <div className={styles.productGrid}>
            {newArrivals.map((product) => (
              <ProductCardPremium key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

