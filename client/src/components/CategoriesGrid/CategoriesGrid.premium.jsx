import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import styles from './CategoriesGrid.premium.module.css';

export default function CategoriesGridPremium({ categories = [] }) {
  if (!categories || categories.length === 0) return null;

  const displayCategories = categories.slice(0, 6);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Shop by Category</h2>
            <p className={styles.subtitle}>
              Explore our curated collections
            </p>
          </div>
          <Link href="/categories" className={styles.viewAll}>
            <span>All Categories</span>
            <FiArrowRight size={18} />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className={styles.grid}>
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className={styles.categoryCard}
            >
              <div className={styles.cardContent}>
                <div className={styles.imageContainer}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={80}
                    height={80}
                    className={styles.catImage}
                  />
                </div>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.itemCount}>
                  {category.count || 0} items
                </p>
              </div>
              <div className={styles.hover}>
                <FiArrowRight size={20} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
