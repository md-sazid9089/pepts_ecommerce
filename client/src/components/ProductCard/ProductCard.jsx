'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice, calculateTieredPrice, calculateBulkDiscount } from '@/data/products';
import { FiShoppingCart, FiHeart, FiEye, FiCheckCircle, FiTrendingDown } from 'react-icons/fi';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, onQuickView }) {
  const { addItem, items } = useCart();
  const [wished, setWished] = useState(false);
  const [imageError, setImageError] = useState(false);
  const inCart = items.some(i => i.id === product.id);

  // Fallback image
  const FALLBACK_IMAGE = `https://placehold.co/400x400?text=Doll+Not+Available`;

  const handleImageError = () => {
    setImageError(true);
  };

  const displayImage = imageError ? FALLBACK_IMAGE : product.image;

  // B2B: Calculate tiered price range and bulk savings
  const minPrice = product.tieredPricing ? Math.min(...product.tieredPricing.map(t => t.price)) : product.price;
  const maxPrice = product.tieredPricing ? Math.max(...product.tieredPricing.map(t => t.price)) : product.price;
  const bulkSavingsPercent = product.tieredPricing 
    ? Math.round(((product.price - minPrice) / product.price) * 100)
    : 0;
  const nextTierQuantity = product.tieredPricing ? product.tieredPricing[0]?.min : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWished(w => !w);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView && onQuickView(product);
  };

  return (
    <div className={styles.card}>
      <Link href={`/product/${product.id}`} className={styles.linkWrapper}>
        {/* Image Section */}
        <div className={styles.imgWrap}>
          <Image 
            src={displayImage} 
            alt={product.name} 
            className={styles.img} 
            width={300}
            height={300}
            loading="lazy"
            onError={handleImageError}
          />

          {/* Badges */}
          <div className={styles.badges}>
            {product.discount > 0 && (
              <span className={styles.discountBadge}>-{product.discount}%</span>
            )}
            {product.isNew && <span className={styles.newBadge}>NEW</span>}
            {bulkSavingsPercent > 0 && (
              <span className={styles.bulkBadge} title={`Save up to ${bulkSavingsPercent}% on bulk orders`}>
                <FiTrendingDown size={12} /> BULK SAVE
              </span>
            )}
          </div>

          {/* Hover Actions */}
          <div className={styles.hoverActions}>
            <button onClick={handleWish} className={`${styles.actionBtn} ${wished ? styles.wished : ''}`} aria-label="Add to wishlist">
              <FiHeart size={16} fill={wished ? 'currentColor' : 'none'} />
            </button>
            <button onClick={handleQuickView} className={styles.actionBtn} aria-label="Quick view">
              <FiEye size={16} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className={styles.info}>
          <h3 className={styles.name} title={product.name}>{product.name}</h3>
          
          <div className={styles.priceContainer}>
            <div className={styles.price}>{formatPrice(minPrice)}</div>
            {product.discount > 0 && (
              <div className={styles.oldPrice}>{formatPrice(maxPrice)}</div>
            )}
          </div>

          {/* Bulk Pricing Indicator */}
          {product.tieredPricing && (
            <div className={styles.bulkInfo}>
              <p className={styles.bulkText}>
                Buy {nextTierQuantity}+ for {formatPrice(minPrice)}
              </p>
            </div>
          )}

          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className={styles.reviewsCount}>({product.reviews})</span>
          </div>

          <button 
            onClick={handleAddToCart}
            className={styles.cartIcon}
            aria-label="Add to Cart"
          >
            <FiShoppingCart size={18} />
          </button>
        </div>
      </Link>
    </div>
  );
}

