'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiHeart, FiEye, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import styles from './ProductCard.premium.module.css';

export default function ProductCardPremium({ product, showQuickView = true }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isInWish, setIsInWish] = useState(isInWishlist(product.id));

  if (!product) return null;

  const discount = product.discount || 0;
  const salePrice = product.price * (1 - discount / 100);
  const isOnSale = discount > 0;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isInWish) {
      removeFromWishlist(product.id);
      setIsInWish(false);
    } else {
      addToWishlist(product);
      setIsInWish(true);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      ...product,
      quantity: 1,
    });
  };

  return (
    <Link href={`/product/${product.id}`}>
      <article className={styles.card}>
        {/* Image Container */}
        <div className={styles.imageContainer}>
          <div className={styles.imagePlaceholder}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className={styles.image}
              />
            ) : (
              <div className={styles.noImage}>No Image</div>
            )}
          </div>

          {/* Sale Badge */}
          {isOnSale && (
            <div className={styles.badge}>
              <span className={styles.badgeText}>-{discount}%</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button
              className={`${styles.actionBtn} ${isInWish ? styles.active : ''}`}
              onClick={handleWishlistToggle}
              aria-label="Add to Wishlist"
              title={isInWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <FiHeart size={18} />
            </button>
            <button
              className={styles.actionBtn}
              onClick={handleAddToCart}
              aria-label="Add to Cart"
              title="Add to Cart"
            >
              <FiShoppingCart size={18} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className={styles.info}>
          <h3 className={styles.name}>{product.name}</h3>

          {/* Rating (if available) */}
          {product.rating && (
            <div className={styles.rating}>
              <div className={styles.stars}>
                {'★'.repeat(Math.floor(product.rating))}
              </div>
              <span className={styles.ratingValue}>
                {product.rating} ({product.reviews || 0} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className={styles.priceSection}>
            <span className={styles.price}>
              ${salePrice.toFixed(2)}
            </span>
            {isOnSale && (
              <span className={styles.originalPrice}>
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.inStock !== undefined && (
            <div
              className={`${styles.stockStatus} ${
                product.inStock ? styles.inStock : styles.outOfStock
              }`}
            >
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
