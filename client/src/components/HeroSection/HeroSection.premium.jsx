import Link from 'next/link';
import { FiArrowRight, FiZap } from 'react-icons/fi';
import styles from './HeroSection.premium.module.css';

export default function HeroSectionPremium() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        {/* Left Content */}
        <div className={styles.content}>
          <div className={styles.badge}>
            <FiZap size={16} />
            <span>Heat Relief Deals</span>
          </div>

          <h1 className={styles.headline}>
            Premium Collections for Your Perfect Moments
          </h1>

          <p className={styles.description}>
            Discover our curated selection of premium dolls and collectibles. 
            From timeless classics to exclusive limited editions, each piece is 
            crafted with meticulous attention to detail.
          </p>

          <div className={styles.ctaGroup}>
            <Link href="/products" className={styles.buttonPrimary}>
              <span>Shop Now</span>
              <FiArrowRight size={18} />
            </Link>
            <Link href="/collections" className={styles.buttonSecondary}>
              Explore Collections
            </Link>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureNumber}>100+</span>
              <p>Premium Collections</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureNumber}>10K+</span>
              <p>Happy Customers</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureNumber}>24/7</span>
              <p>Support Available</p>
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className={styles.visual}>
          <div className={styles.visualContent}>
            <div className={styles.decorativeCircle1}></div>
            <div className={styles.decorativeCircle2}></div>
            <div className={styles.mainImage}>
              <p>Featured Collection Image</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
