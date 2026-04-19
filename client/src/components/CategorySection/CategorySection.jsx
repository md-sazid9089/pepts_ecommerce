import Link from 'next/link';
import { categories } from '@/data/constants/categories';
import {
  FiSmartphone, FiShoppingBag, FiHome, FiBox,
} from 'react-icons/fi';
import {
  FaPalette, FaFootballBall,
} from 'react-icons/fa';
import styles from './CategorySection.module.css';

// Map icon names to actual icon components
const iconMap = {
  FiSmartphone,
  FiShoppingBag,
  FiHome,
  FiBox,
  FaPalette,
  FaFootballBall,
};

export default function CategorySection() {
  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent size={40} /> : <span>{iconName}</span>;
  };

  return (
    <section className={`section-gap ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <Link href="/products" className="section-see-all">View All →</Link>
        </div>
        <div className={styles.grid}>
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className={styles.catCard}
              style={{ '--cat-color': cat.color, '--cat-bg': cat.bg, animationDelay: `${i * 0.06}s` }}
            >
              <div className={styles.iconWrap}>
                <span className={styles.icon}>{getIcon(cat.icon)}</span>
                <div className={styles.iconGlow} />
              </div>
              <span className={styles.catName}>{cat.name}</span>
              <span className={styles.catArrow}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
