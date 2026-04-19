import Carousel from '@/components/Carousel/Carousel';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import FlashSale from '@/components/FlashSale/FlashSale';
import Link from 'next/link';
import { products, getFeaturedProducts, getHotProducts, categories } from '@/data/products';
import { 
  FiChevronRight, FiUser, FiPackage, FiZap, FiTarget, FiBox, FiMenu, FiArrowRight, FiTag 
} from 'react-icons/fi';
import styles from './page.module.css';

export const metadata = {
  title: 'Precious Play - #1 Doll Marketplace',
  description: 'Premium doll marketplace. Exclusive collections, high-quality detailed craftsmanship, and best prices.',
};

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const hotProducts = getHotProducts();
  const newArrivals = products.filter(p => p.isNew);

  return (
    <div className={styles.homePage}>
      
      {/* TIER 1 HERO: THREE-PANE LAYOUT */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContainer}>
            
            {/* Left: Category Sidebar */}
            <aside className={styles.categorySidebar}>
              <div className={styles.sidebarTitle}>
                <FiMenu size={16} /> Categories
              </div>
              <nav className={styles.sidebarNav}>
                {categories.map(cat => (
                  <Link key={cat.id} href={`/products?category=${cat.id}`} className={styles.sidebarItem}>
                    {cat.name} <FiChevronRight size={14} />
                  </Link>
                ))}
                <Link href="/categories" className={styles.sidebarItem} style={{fontWeight: 700}}>
                  All Categories <FiChevronRight size={14} />
                </Link>
              </nav>
            </aside>

            {/* Center: Main Carousel */}
            <div className={styles.mainCarousel}>
              <Carousel />
            </div>

          </div>
        </div>
      </section>

      {/* SELECTION BAR: ICON SHORTCUTS */}
      <section className={styles.selectionBar}>
        <div className="container">
          <div className={styles.selectionGrid}>
            {[
              { label: 'New Arrivals', icon: <FiZap />, color: '#FFF7E6', link: '/products?sort=new' },
              { label: 'Top Rated', icon: <FiTarget />, color: '#E6F7FF', link: '/products?sort=rating' },
              { label: 'Bulk Only', icon: <FiBox />, color: '#F6FFED', link: '/deals' },
              { label: 'Supplier Hub', icon: <FiUser />, color: '#FFF1F0', link: '/verified-suppliers' },
            ].map(item => (
              <Link key={item.label} href={item.link} className={styles.selectionItem}>
                <div className={styles.selectionIcon} style={{background: item.color}}>{item.icon}</div>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals - Retail Styled */}
      <section className={`section-gap ${styles.flashSection}`}>
        <div className="container">
          <div className={styles.flashHeader}>
            <div className={styles.flashLeft}>
              <FiZap size={20} className={styles.flashIcon} />
              <h2 className={styles.flashTitle}>Flash Sale</h2>
              <FlashSale />
            </div>
            <Link href="/products" className="section-see-all">SHOP MORE <FiArrowRight size={14} /></Link>
          </div>
          <div className={styles.horizontalScroll}>
            {hotProducts.slice(0, 8).map(p => (
              <div key={p.id} className={styles.flashCard}>
                <Link href={`/product/${p.id}`} className={styles.flashCardInner}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} className={styles.flashImg} />
                  <div className={styles.flashInfo}>
                    <p className={styles.flashName}>{p.name}</p>
                    <div className={styles.flashPriceRow}>
                      <span className={styles.flashPrice}>${p.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid: Just For You (Clean Marketplace) */}
      <section className={`section-gap ${styles.greySection}`}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Just For You</h2>
            <Link href="/products" className="section-see-all">See All →</Link>
          </div>
          <ProductGrid products={featuredProducts.slice(0, 12)} columns={6} />
        </div>
      </section>

      {/* Bulk Sourcing CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Start Sourcing from Verified Factories</h2>
            <p className={styles.ctaDesc}>Get multi-tier wholesale discounts, protected shipping, and verified factory direct pricing for your doll business.</p>
            <div className={styles.ctaBtns}>
              <Link href="/products" className="btn btn-primary btn-lg">Browse All Wholesale</Link>
              <Link href="/register" className="btn btn-outline btn-lg">Register for Bulk Price</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

