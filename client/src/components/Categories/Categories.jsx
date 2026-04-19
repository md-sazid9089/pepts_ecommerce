'use client';

import Link from 'next/link';
import { categories, products, brands, formatPrice } from '@/data/products';
import { FiArrowRight, FiSmartphone, FiShoppingBag, FiHome, FiBox, FiStar } from 'react-icons/fi';
import { FaPalette, FaFootballBall } from 'react-icons/fa';
import styles from './Categories.module.css';

// Map icon names to actual icon components
const iconMap = {
  FiSmartphone,
  FiShoppingBag,
  FiHome,
  FiBox,
  FaPalette,
  FaFootballBall,
};

export function CategoriesView() {
  const getCategoryProductCount = (categoryId) => {
    return products.filter(p => p.category === categoryId).length;
  };

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent size={32} /> : <span>{iconName}</span>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Wholesale Sourcing Hub</h1>
        <p className={styles.subtitle}>Direct factory sourcing for boutiques and retailers</p>
      </div>

      {/* Featured Categories Grid */}
      <div className={styles.featuredGrid}>
        {categories.map(category => (
          <Link
            key={category.id}
            href={`/search?category=${category.id}`}
            className={styles.categoryCard}
            style={{
              '--bg-color': category.bg,
              '--text-color': category.color,
            }}
          >
            <div className={styles.cardIcon}>{getIcon(category.icon)}</div>
            <div className={styles.cardContent}>
              <h3 className={styles.categoryName}>{category.name}</h3>
              <p className={styles.productCount}>
                {getCategoryProductCount(category.id)} manufacturers
              </p>
            </div>
            <div className={styles.arrow}>
              <FiArrowRight size={20} />
            </div>
          </Link>
        ))}
      </div>

      {/* Category Sections with Popular Items */}
      {categories.map(category => {
        const categoryProducts = products
          .filter(p => p.category === category.id)
          .slice(0, 8);

        return (
          <section key={category.id} className={styles.categorySection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderMain}>
                <div className={styles.sectionHeaderIcon}>
                  {getIcon(category.icon)}
                </div>
                <div>
                  <h2 className={styles.sectionTitle}>{category.name}</h2>
                  <p className={styles.sectionSubtitle}>
                    {categoryProducts.length} Premium sourcing options
                  </p>
                </div>
              </div>
              <Link
                href={`/search?category=${category.id}`}
                className={styles.seeAllLink}
              >
                View Catalog →
              </Link>
            </div>

            <div className={styles.productsGrid}>
              {categoryProducts.map(product => {
                // Calculate tiered price range
                const prices = product.tieredPricing ? product.tieredPricing.map(t => t.price) : [product.price];
                const minP = Math.min(...prices);
                const maxP = Math.max(...prices);

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className={styles.productTile}
                  >
                    <div className={styles.tileImage}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.image} alt={product.name} />
                      {product.moq && (
                        <div className={styles.tileBadge}>
                          MOQ: {product.moq}
                        </div>
                      )}
                    </div>
                    <div className={styles.tileContent}>
                      <p className={styles.tileName}>{product.name}</p>
                      <p className={styles.tilePrice}>
                        {product.tieredPricing 
                          ? `${formatPrice(minP)} - ${formatPrice(maxP)}`
                          : formatPrice(product.price)
                        }
                      </p>
                      <div className={styles.tileRating}>
                        <FiStar fill="currentColor" color="#FFC107" /> {product.rating} | {product.reviews} reviews
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Featured Brands */}
      <section className={styles.brandsSection}>
        <h2 className={styles.brandsTitle}>Trusted Manufacturers</h2>
        <div className={styles.brandsList}>
          {brands.map(brand => (
            <Link
              key={brand}
              href={`/search?brand=${brand}`}
              className={styles.brandBadge}
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
