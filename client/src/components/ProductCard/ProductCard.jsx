import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { FiHeart } from 'react-icons/fi';

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(83, 54, 56, 0.1)',
    border: '1px solid #F5EDEC',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  linkWrapper: {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  imgWrap: {
    position: 'relative',
    width: '100%',
    paddingBottom: '100%',
    backgroundColor: '#F5EDEC',
    overflow: 'hidden',
  },
  img: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  badges: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    zIndex: 5,
  },
  discountBadge: {
    backgroundColor: '#E53E3E',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '700',
  },
  newBadge: {
    backgroundColor: '#F7B9C4',
    color: '#533638',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '700',
  },
  bulkBadge: {
    backgroundColor: '#F7B9C4',
    color: '#533638',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '700',
  },
  hoverActions: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 10,
  },
  actionBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'white',
    border: '1px solid #F5EDEC',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    color: '#533638',
  },
  wished: {
    backgroundColor: '#F7B9C4',
    color: '#533638',
    borderColor: '#F7B9C4',
  },
  info: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  name: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#533638',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  brand: {
    fontSize: '10px',
    color: '#A0AEC0',
    marginBottom: '2px',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  price: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#E53E3E',
  },
  oldPrice: {
    fontSize: '11px',
    color: '#A0AEC0',
    textDecoration: 'line-through',
  },
  moqInfo: {
    fontSize: '10px',
    color: '#533638',
    fontWeight: '600',
    backgroundColor: '#F5EDEC',
    padding: '4px 6px',
    borderRadius: '3px',
  },
  bulkPricing: {
    fontSize: '10px',
    color: '#667C7F',
    padding: '4px 6px',
    backgroundColor: '#F5EDEC',
    borderRadius: '3px',
  },
  stockInfo: {
    fontSize: '10px',
    color: '#22863A',
    fontWeight: '600',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: '10px',
    color: '#718096',
  },
  addBtn: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#533638',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: 'auto',
  },
};

export default function ProductCard({ product, onQuickView }) {
  const { addItem, items } = useCart();
  const [wished, setWished] = useState(false);
  const [imageError, setImageError] = useState(false);
  const inCart = items.some(i => i.id === product.id);

  // Fallback image
  const FALLBACK_IMAGE = `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name || 'Product')}`;

  const handleImageError = () => {
    setImageError(true);
  };

  const displayImage = imageError ? FALLBACK_IMAGE : (product.image || FALLBACK_IMAGE);

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
    <div style={styles.card}>
      <a href={`/product/${product.id}`} style={styles.linkWrapper}>
        {/* Image Section */}
        <div style={styles.imgWrap}>
          <img 
            src={displayImage} 
            alt={product.name} 
            style={styles.img} 
            loading="lazy"
            onError={handleImageError}
          />

          {/* Badges */}
          <div style={styles.badges}>
            {product.discount > 0 && (
              <span style={styles.discountBadge}>-{product.discount}%</span>
            )}
            {product.isNew && <span style={styles.newBadge}>NEW</span>}
            {product.tieredPricing && <span style={styles.bulkBadge}>Bulk Save</span>}
          </div>

          {/* Hover Actions */}
          <div style={styles.hoverActions}>
            <button 
              onClick={handleWish} 
              style={{...styles.actionBtn, ...(wished ? styles.wished : {})}} 
              aria-label="Add to wishlist"
            >
              <FiHeart size={14} fill={wished ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div style={styles.info}>
          <div style={styles.brand}>{product.brand}</div>
          <h3 style={styles.name} title={product.name}>{product.name}</h3>
          
          {/* Price */}
          <div style={styles.priceContainer}>
            <div style={styles.price}>{formatPrice(product.price)}</div>
            {product.discount > 0 && product.originalPrice && (
              <div style={styles.oldPrice}>{formatPrice(product.originalPrice)}</div>
            )}
          </div>

          {/* MOQ */}
          {product.moq && (
            <div style={styles.moqInfo}>Min Order: {product.moq} pcs
            </div>
          )}

          {/* Bulk Pricing */}
          {product.tieredPricing && product.tieredPricing[product.tieredPricing.length - 1] && (
            <div style={styles.bulkPricing}>
              From {formatPrice(product.tieredPricing[product.tieredPricing.length - 1].price)}/unit
            </div>
          )}

          {/* Stock Status */}
          <div style={styles.stockInfo}>
            {product.inStock ? '✓ In Stock' : 'Pre-order'}
          </div>

          {/* Rating */}
          {product.rating && (
            <div style={styles.rating}>
              <span>{'★'.repeat(Math.floor(product.rating))}</span>
              <span>({product.reviews || 0})</span>
            </div>
          )}
        </div>
      </a>

      {/* Add to Cart Button */}
      <button 
        onClick={handleAddToCart} 
        style={styles.addBtn}
      >
        {inCart ? '✓ In Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}





