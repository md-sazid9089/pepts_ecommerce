import Link from 'next/link';
import { FiGift } from 'react-icons/fi';
import styles from './deals.module.css';

export const metadata = {
  title: 'Deals & Offers | Daraz Clone',
  description: 'Check out our amazing deals, discounts, and special offers.',
};

export default function DealsPage() {
  const deals = [
    {
      id: 1,
      title: 'Flash Sale - 70% Off Electronics',
      description: 'Limited time offer on selected electronics',
      discount: '70%',
      validUntil: 'Today at 11:59 PM',
    },
    {
      id: 2,
      title: 'Fashion Week Special - Buy 2 Get 1 Free',
      description: 'Exclusive offer on fashion and apparel',
      discount: 'BOGO',
      validUntil: 'This Weekend',
    },
    {
      id: 3,
      title: 'Free Shipping on Orders Above $500',
      description: 'No minimum purchase required, use code: FREESHIP',
      discount: 'FREE',
      validUntil: 'Until Stocks Last',
    },
    {
      id: 4,
      title: 'Member Exclusive - 25% Off Everything',
      description: 'Sign up for free membership to unlock exclusive deals',
      discount: '25%',
      validUntil: 'Ongoing',
    },
  ];

  return (
    <div className={styles.dealsPage}>
      <div className={styles.heroSection}>
        <div className={styles.container}>
          <h1 className={styles.title}><FiGift className={styles.titleIcon} /> Deals & Offers</h1>
          <p className={styles.subtitle}>
            Discover amazing discounts and limited-time offers
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <section className={styles.dealsGrid}>
          {deals.map((deal) => (
            <div key={deal.id} className={styles.dealCard}>
              <div className={styles.dealBadge}>
                <span className={styles.badgeText}>{deal.discount}</span>
              </div>
              
              <h3 className={styles.dealTitle}>{deal.title}</h3>
              <p className={styles.dealDescription}>{deal.description}</p>
              
              <div className={styles.dealFooter}>
                <span className={styles.validUntil}>Valid: {deal.validUntil}</span>
                <Link href="/products" className={styles.shopBtn}>
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </section>

        <section className={styles.ctaSection}>
          <h2>Don&apos;t Miss Out!</h2>
          <p>Browse all our products to find more amazing deals</p>
          <Link href="/products" className={styles.primaryBtn}>
            Browse All Products
          </Link>
        </section>
      </div>
    </div>
  );
}
