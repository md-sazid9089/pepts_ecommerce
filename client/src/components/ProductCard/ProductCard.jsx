import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { FiHeart } from 'react-icons/fi';

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(83, 54, 56, 0.08)',
    border: '1px solid #F5EDEC',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  cardHover: {
    boxShadow: '0 8px 24px rgba(83, 54, 56, 0.15)',
    transform: 'translateY(-4px)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    paddingBottom: '100%',
    backgroundColor: '#F5EDEC',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  imageHover: {
    transform: 'scale(1.05)',
  },
  productTag: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#533638',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    zIndex: 5,
    textTransform: 'uppercase',
  },
  wishlistBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#533638',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
    transition: 'all 0.3s ease',
    zIndex: 6,
  },
  wishlistBtnWished: {
    backgroundColor: '#F7B9C4',
    color: '#533638',
  },
  content: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  },
  title: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#533638',
    margin: 0,
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    minHeight: '28px',
  },
  priceSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  price: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#E53E3E',
  },
  oldPrice: {
    fontSize: '12px',
    color: '#A0AEC0',
    textDecoration: 'line-through',
  },
  buttonsContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
    width: '100%',
  },
  btn: {
    flex: 1,
    padding: '12px 12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minHeight: '42px',
    letterSpacing: '0.5px',
  },
  viewBtn: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    border: 'none',
  },
  viewBtnHover: {
    backgroundColor: '#333333',
  },
  addBtn: {
    backgroundColor: '#F5EDEC',
    color: '#533638',
    border: 'none',
  },
  addBtnHover: {
    backgroundColor: '#E8D9D3',
  },
};

export default function ProductCard({ product, onQuickView }) {
  const { addItem, items } = useCart();
  const [wished, setWished] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [imageHovering, setImageHovering] = useState(false);

  const inCart = items.some(i => i.id === product.id);
  const FALLBACK_IMAGE = `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name || 'Product')}`;
  const displayImage = imageError ? FALLBACK_IMAGE : (product.image || FALLBACK_IMAGE);

  const handleImageError = () => {
    setImageError(true);
  };

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

  const handleViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/product/${product.id}`;
  };

  return (
    <div 
      style={{...styles.card, ...(isHovering ? styles.cardHover : {})}}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image Section */}
      <div 
        style={styles.imageContainer}
        onMouseEnter={() => setImageHovering(true)}
        onMouseLeave={() => setImageHovering(false)}
      >
        <img 
          src={displayImage} 
          alt={product.name} 
          style={{...styles.image, ...(imageHovering ? styles.imageHover : {})}}
          loading="lazy"
          onError={handleImageError}
        />

        {/* "Product" Tag Badge - Top Left */}
        <div style={styles.productTag}>Product</div>

        {/* Wishlist Button - Top Right */}
        <button
          onClick={handleWish}
          style={{...styles.wishlistBtn, ...(wished ? styles.wishlistBtnWished : {})}}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiHeart size={18} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content Section */}
      <div style={styles.content}>
        {/* Title */}
        <h3 style={styles.title} title={product.name}>
          {product.name}
        </h3>

        {/* Price */}
        <div style={styles.priceSection}>
          <div style={styles.price}>{formatPrice(product.price)}</div>
          {product.discount > 0 && product.originalPrice && (
            <div style={styles.oldPrice}>{formatPrice(product.originalPrice)}</div>
          )}
        </div>

        {/* Buttons Section */}
        <div style={styles.buttonsContainer}>
          <button 
            onClick={handleViewClick}
            style={styles.viewBtn}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.viewBtnHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, {backgroundColor: '#1a1a1a'})}
            aria-label="View product details"
          >
            VIEW
          </button>
          <button 
            onClick={handleAddToCart}
            style={styles.addBtn}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.addBtnHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, {backgroundColor: '#F5EDEC'})}
            aria-label={inCart ? "Already in cart" : "Add to cart"}
          >
            {inCart ? 'IN CART' : 'ADD TO CART'}
          </button>
        </div>
      </div>
    </div>
  );
}





