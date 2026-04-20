import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/constants/categories';
import styles from './CategorySection.module.css';

export default function CategorySection() {

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
              <div className={styles.imageWrap}>
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={120}
                  height={120}
                  className={styles.catImage}
                />
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
