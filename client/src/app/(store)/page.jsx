import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { products, getFeaturedProducts } from '@/data/products';
import { FiShield, FiBox, FiHeadphones, FiRotateCw } from 'react-icons/fi';
import styles from './page.module.css';

// Client Component Islands - only for interactive elements
const Carousel = dynamic(() => import('@/components/Carousel/Carousel'));
const FlashSale = dynamic(() => import('@/components/FlashSale/FlashSale'));
const ProductCardClient = dynamic(() => import('@/components/ProductCard/ProductCard'));
const CategorySection = dynamic(() => import('@/components/CategorySection/CategorySection'));

export const metadata = {
  title: 'Pepta - Premium B2B Technology & Gadget Marketplace',
  description: 'Discover wholesale electronics and gadgets with tiered pricing, bulk discounts, and direct factory access. Perfect for boutiques and showrooms.',
  openGraph: {
    title: 'Pepta - Premium B2B Technology & Gadget Marketplace',
    description: 'Wholesale gadgets with tiered pricing and bulk discounts',
    url: 'https://pepta.com',
    type: 'website',
  },
};

export default function HomePage() {
  const featuredProducts = getFeaturedProducts() || [];
  const flashProducts = products?.slice(0, 8) || [];
  const justForYouProducts = products?.slice(8, 20) || [];
  const newArrivals = products?.filter(p => p.isNew).slice(0, 8) || [];

  return (
    <div className={styles.homePage}>
      {/* SEO: Main Heading */}
      <h1 style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        Pepta - Premium B2B Technology & Gadget Marketplace
      </h1>

      {/* 1. HERO CAROUSEL */}
      <Carousel />

      {/* 2. VALUE BANNERS (DARAZ STYLE) */}
      <section className={styles.bannerStrip}>
        <div className="container">
          <div className={styles.bannerGrid}>
            {[
              { Icon: FiShield, title: '100% Authentic', desc: 'Verified Manufacturers' },
              { Icon: FiHeadphones, title: '24/7 Support', desc: 'Wholesale Assistance' },
              { Icon: FiRotateCw, title: 'Easy Returns', desc: 'No-questions asked' },
            ].map((item, i) => (
              <div key={i} className={styles.bannerItem}>
                <div className={styles.bannerIcon}><item.Icon size={24} /></div>
                <div>
                  <div className={styles.bannerTitle}>{item.title}</div>
                  <div className={styles.bannerDesc}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FLASH SALE */}
      <section className={`${styles.flashSection} section-gap`}>
        <div className="container">
          <div className={styles.flashHeader}>
            <div className={styles.flashLeft}>
              <h2 className={styles.flashTitle}>Flash Sale</h2>
              <FlashSale />
            </div>
            <Link href="/products" className="section-see-all">SHOP ALL →</Link>
          </div>
          <div className={styles.horizontalScroll}>
            {flashProducts.map(product => (
              <div key={product.id} className={styles.flashCard}>
                <ProductCardClient product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CATEGORIES */}
      <CategorySection />

      {/* 5. FEATURED COLLECTIONS */}
      <section className="section-gap">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Collections</h2>
            <Link href="/products" className="section-see-all">See All →</Link>
          </div>
          <div className={styles.productGrid}>
            {featuredProducts.map((product) => (
              <ProductCardClient key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. PROMO BANNER (HARDCODED DARAZ STYLE) */}
      <section className={styles.promoBanner}>
        <div className="container">
          <div className={`${styles.promoInner} glass`} style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)' }}>
            <div className={styles.promoText}>
              <span className={styles.promoTag}>Wholesale Exclusive</span>
              <h2 className={styles.promoTitle}>Bulk Order Specialist</h2>
              <p className={styles.promoDesc}>Get personalized quotes for orders over 500 units. Direct factory communication enabled.</p>
              <div className={styles.ctaBtns}>
                <Link href="/contact" className="btn btn-primary">Inquire Now</Link>
                <Link href="/products" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>Browse Catalog</Link>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image src="/bulkorder.png" alt="Bulk Warehouse" className={styles.promoImg} width={800} height={400} />
          </div>
        </div>
      </section>

      {/* 7. NEW ARRIVALS */}
      <section className={`${styles.greySection} section-gap`}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <Link href="/products?filter=new" className="section-see-all">Shop New →</Link>
          </div>
          <div className={styles.productGrid}>
            {newArrivals.map((product) => (
              <ProductCardClient key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. JUST FOR YOU */}
      <section className="section-gap">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Just For You</h2>
          </div>
          <div className={styles.productGrid}>
            {justForYouProducts.map(product => (
              <ProductCardClient key={product.id} product={product} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/products" className="btn-outline btn-lg">Load More</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

