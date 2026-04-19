'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { products, categories } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { FiX, FiShoppingCart, FiHeart, FiShare2, FiChevronLeft, FiChevronRight, FiStar, FiCheck, FiArrowRight } from 'react-icons/fi';
import styles from './QuickViewModal.module.css';

function StarRating({ rating }) {
  return (
    <div className={styles.stars}>
      {[1,2,3,4,5].map(i => (
        <FiStar key={i} size={14} fill={i <= Math.round(rating) ? 'currentColor' : 'none'}
          stroke={i <= Math.round(rating) ? 'currentColor' : '#ccc'} />
      ))}
    </div>
  );
}

export default function QuickViewModal({ product, onClose }) {
  const { addItem } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const images = product.images || [product.image];

  // Fallback image for broken product images
  const FALLBACK_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Crect fill='%23f5f5f5' width='600' height='600'/%3E%3Ctext x='50%25' y='50%25' font-size='18' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' fill='%23999'%3EImage not available%3C/text%3E%3C/svg%3E`;

  const handleImageError = (index) => {
    queueMicrotask(() => {
      setImageErrors(prev => ({ ...prev, [index]: true }));
    });
  };

  const getDisplayImage = (index) => {
    return imageErrors[index] ? FALLBACK_IMAGE : images[index];
  };

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const cat = categories.find(c => c.id === product.category);

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="qv-title">
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <FiX size={20} />
        </button>

        <div className={styles.inner}>
          {/* Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={getDisplayImage(activeImg)} 
                alt={product.name} 
                className={styles.mainImg}
                onError={() => handleImageError(activeImg)}
              />
              {images.length > 1 && (
                <>
                  <button className={`${styles.imgArrow} ${styles.imgArrowLeft}`}
                    onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}>
                    <FiChevronLeft size={18} />
                  </button>
                  <button className={`${styles.imgArrow} ${styles.imgArrowRight}`}
                    onClick={() => setActiveImg(i => (i + 1) % images.length)}>
                    <FiChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className={styles.thumbs}>
                {images.map((img, i) => (
                  <button key={i} className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImg(i)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={getDisplayImage(i)} 
                      alt="" 
                      onError={() => handleImageError(i)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className={styles.details}>
            {cat && (
              <Link href={`/products?category=${cat.id}`} className={styles.catTag}>
                {cat.icon} {cat.name}
              </Link>
            )}
            <h2 id="qv-title" className={styles.title}>{product.name}</h2>
            <p className={styles.brand}>by <strong>{product.brand}</strong></p>

            <div className={styles.ratingRow}>
              <StarRating rating={product.rating} />
              <span className={styles.ratingVal}>{product.rating}</span>
              <span className={styles.ratingCount}>({product.reviews.toLocaleString()} reviews)</span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.price}>{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className={styles.origPrice}>{formatPrice(product.originalPrice)}</span>
                  <span className="badge badge-discount">-{product.discount}%</span>
                </>
              )}
            </div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.stockRow}>
              <span className={styles.stockLabel}>Availability:</span>
              <span className={product.stock > 0 ? styles.inStock : styles.outStock}>
                {product.stock > 0 ? <><FiCheck /> In Stock ({product.stock} left)</> : <><FiX /> Out of Stock</>}
              </span>
            </div>

            {/* Quantity */}
            <div className={styles.qtyRow}>
              <span className={styles.qtyLabel}>Quantity:</span>
              <div className={styles.qtyControl}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className={styles.qtyBtn}>−</button>
                <span className={styles.qty}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className={styles.qtyBtn}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button onClick={handleAdd} className={`${styles.addBtn} ${added ? styles.addBtnAdded : ''}`}
                disabled={product.stock === 0}>
                <FiShoppingCart size={18} />
                {added ? <><FiCheck /> Added!</> : 'Add to Cart'}
              </button>
              <button className={styles.wishBtn} aria-label="Add to wishlist">
                <FiHeart size={18} />
              </button>
              <button className={styles.shareBtn} aria-label="Share">
                <FiShare2 size={18} />
              </button>
            </div>

            <Link href={`/product/${product.id}`} className={styles.fullDetail}>
              View Full Details <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
