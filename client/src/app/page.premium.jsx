import HeaderPremium from '@/components/Header/Header.premium';
import HeroSectionPremium from '@/components/HeroSection/HeroSection.premium';
import FlashSalePremium from '@/components/FlashSale/FlashSale.premium';
import CategoriesGridPremium from '@/components/CategoriesGrid/CategoriesGrid.premium';
import ProductCardPremium from '@/components/ProductCard/ProductCard.premium';
import FooterPremium from '@/components/Footer/Footer.premium';
import { products, categories } from '@/data/products';
import styles from './page.premium.module.css';

export const metadata = {
  title: 'Pepta Premium - Curated Collections',
  description: 'Discover premium doll collections with our soft, modern aesthetic marketplace.',
};

export default function PremiumLandingPage() {
  // Get featured products
  const featuredProducts = products.slice(0, 8);
  const justForYouProducts = products.slice(8, 16);
  const newArrivals = products.filter(p => p.isNew).slice(0, 8);

  return (
    <div className={styles.page}>
      {/* Header */}
      <HeaderPremium />

      {/* Hero Section */}
      <HeroSectionPremium />

      {/* Categories Grid */}
      <div className={styles.sectionPadding}>
        <CategoriesGridPremium categories={categories} />
      </div>

      {/* Flash Sale */}
      <div className={styles.sectionPadding}>
        <FlashSalePremium products={products} />
      </div>

      {/* Featured Collections Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Featured Collections</h2>
            <p className={styles.sectionSubtitle}>
              Handpicked pieces that define elegance
            </p>
          </div>
          <a href="/products" className={styles.seeAll}>
            See All →
          </a>
        </div>

        <div className={styles.productGrid}>
          {featuredProducts.map((product) => (
            <ProductCardPremium key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Just For You Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Just For You</h2>
            <p className={styles.sectionSubtitle}>
              Personalized recommendations based on your interests
            </p>
          </div>
          <a href="/products" className={styles.seeAll}>
            Browse More →
          </a>
        </div>

        <div className={styles.productGrid}>
          {justForYouProducts.map((product) => (
            <ProductCardPremium key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>New Arrivals</h2>
            <p className={styles.sectionSubtitle}>
              Fresh additions to our collection
            </p>
          </div>
          <a href="/products?filter=new" className={styles.seeAll}>
            Shop New →
          </a>
        </div>

        <div className={styles.productGrid}>
          {newArrivals.map((product) => (
            <ProductCardPremium key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className={styles.trustSection}>
        <div className={styles.container}>
          <div className={styles.trustGrid}>
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>🛡️</div>
              <h3>100% Authentic</h3>
              <p>All products are verified for authenticity and quality</p>
            </div>
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>📦</div>
              <h3>Free Shipping</h3>
              <p>On all orders over $50. Express options available</p>
            </div>
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>💬</div>
              <h3>24/7 Support</h3>
              <p>Dedicated customer service team ready to help</p>
            </div>
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>🔄</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy with no questions asked</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterPremium />
    </div>
  );
}
