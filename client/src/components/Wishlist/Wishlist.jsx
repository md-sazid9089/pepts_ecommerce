'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { FiTrash2, FiShoppingCart, FiArrowLeft, FiHeart, FiStar } from 'react-icons/fi';
import styles from './Wishlist.module.css';

export function WishlistView() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    addItem(product);
  };

  const handleRemove = (id, e) => {
    e.preventDefault();
    removeItem(id);
  };

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}><FiHeart size={48} /></div>
        <h2 className={styles.emptyTitle}>Your wishlist is empty</h2>
        <p className={styles.emptyText}>Start adding your favorite items to save them for later</p>
        <Link href="/products" className={styles.emptyBtn}>
          <FiArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Wishlist</h1>
        <p className={styles.count}>{items.length} item{items.length !== 1 ? 's' : ''}</p>
        {items.length > 0 && (
          <button className={styles.clearBtn} onClick={clearWishlist}>
            Clear All
          </button>
        )}
      </div>

      <div className={styles.grid}>
        {items.map(product => (
          <div key={product.id} className={styles.wishCard}>
            <div className={styles.cardImage}>
              <Image src={product.image} alt={product.name} width={250} height={250} loading="lazy" />
              <div className={styles.overlay}>
                <button
                  className={styles.addBtn}
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  <FiShoppingCart size={20} /> Add to Cart
                </button>
              </div>
            </div>

            <div className={styles.cardContent}>
              <Link href={`/product/${product.id}`} className={styles.productName}>
                {product.name}
              </Link>

              <p className={styles.brand}>{product.brand}</p>

              <div className={styles.priceRow}>
                <span className={styles.price}>${product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className={styles.originalPrice}>
                      ${product.originalPrice.toLocaleString()}
                    </span>
                    <span className={styles.discount}>-{product.discount}%</span>
                  </>
                )}
              </div>

              <div className={styles.rating}>
                <FiStar fill="currentColor" color="#FFC107" /> {product.rating} ({product.reviews} reviews)
              </div>

              <button
                className={styles.removeBtn}
                onClick={(e) => handleRemove(product.id, e)}
              >
                <FiTrash2 size={16} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
