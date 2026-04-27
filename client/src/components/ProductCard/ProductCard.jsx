import { useState, useCallback, memo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/utils/pricing';
import { imagePresets } from '@/utils/imageUtils';
import { queryKeys } from '@/lib/queryKeys';
import productsApi from '@/services/api/products.api';
import { FiHeart, FiCheck, FiExternalLink, FiMessageSquare } from 'react-icons/fi';
import { FaStar, FaCheck } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

const styles = {
  // B2B Horizontal Card Layout (Redesigned for Large Image)
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
    border: '1px solid #EAEAEA',
    transition: 'all 0.3s ease',
    display: 'grid',
    gridTemplateColumns: '340px 1fr', // Large image focus
    minHeight: '400px',
    gap: '0px',
    padding: '0px',
    position: 'relative',
    cursor: 'pointer',
  },
  cardHover: {
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    border: '1px solid #CCC',
  },

  // LEFT SIDE - Large Product Image
  imageSection: {
    padding: '20px',
    backgroundColor: '#FAFAFA',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Cover more area as requested
    transition: 'transform 0.5s ease',
  },
  imageHover: {
    transform: 'scale(1.05)',
  },

  // Removed badges as requested
  
  // Wishlist (Subtle)
  wishlistBtn: {
    position: 'absolute',
    top: '28px',
    right: '28px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    border: '1px solid #EEE',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    zIndex: 10,
    transition: 'all 0.2s ease',
  },

  // RIGHT SIDE - Information Section
  contentSection: {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 32px',
    backgroundColor: 'white',
  },

  // Supplier Header (Top Right)
  supplierHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  supplierIcon: {
    color: '#6366F1', // Lavender color from sample
    fontSize: '18px',
  },
  supplierNameTop: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  badgeRow: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: '6px',
  },
  badgeChip: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  auditedChip: {
    backgroundColor: '#EBF5FF',
    color: '#2563EB',
    border: '1px solid #BFDBFE',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  certChip: {
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
    border: '1px solid #E5E7EB',
  },
  certifiedChip: {
    backgroundColor: '#F0FDF4',
    color: '#166534',
    border: '1px solid #BBF7D0',
  },

  // Product Title (Keyword Rich)
  productTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111',
    margin: '12px 0',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },

  // Price Area
  priceArea: {
    marginBottom: '16px',
  },
  priceLabel: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#111',
    marginRight: '8px',
  },
  fobPrice: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  moqArea: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginTop: '4px',
  },

  // Specifications (2 Column Dots)
  specGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px 20px',
    margin: '20px 0',
    padding: '16px 0',
    borderTop: '1px solid #F3F4F6',
  },
  specItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#666',
  },
  specDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: '#CCC',
  },
  specLabel: {
    fontWeight: '500',
    color: '#888',
  },
  specValue: {
    fontWeight: '600',
    color: '#444',
  },

  // Trust Footer (New)
  trustFooter: {
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: '1px dotted #EEE',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '20px',
  },
  secondarySupplierLink: {
    fontSize: '14px',
    color: '#111',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    textDecoration: 'none',
  },
  ratingLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#888',
  },
  stars: {
    display: 'flex',
    gap: '2px',
    color: '#F59E0B',
  },

  // Action Buttons
  actionsSection: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.9fr 0.9fr',
    gap: '12px',
  },
  btn: {
    height: '46px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
  },
  inquiryBtn: {
    backgroundColor: '#533638', // Reverted to brown as requested
    color: 'white',
    border: 'none',
  },
  chatBtn: {
    backgroundColor: 'white',
    color: '#2563EB', 
    border: '1px solid #2563EB',
  },
  viewBtn: {
    backgroundColor: '#F5EDEC',
    color: '#533638',
    border: '1px solid #533638',
  },
};

function ProductCard({ product, onQuickView }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addItem, items } = useCart();
  const [wished, setWished] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [imageHovering, setImageHovering] = useState(false);

  const FALLBACK_IMAGE = '/placeholder-product.jpg';

  // Optimized 400x400 image for the card thumbnail
  const rawImageUrl = (product.imageUrl && product.imageUrl.trim() !== '') ? product.imageUrl : null;
  const displayImage = imageError
    ? FALLBACK_IMAGE
    : (imagePresets.thumbnail(rawImageUrl) || FALLBACK_IMAGE);

  // Prefetch product detail on hover so clicking is instant
  const handleMouseEnterCard = useCallback(() => {
    setIsHovering(true);
    if (product.id) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.products.detail(product.id),
        queryFn: () => productsApi.getById(product.id),
        staleTime: 1000 * 60,
      });
    }
  }, [product.id, queryClient]);

  // Remove debug log in production — no longer needed

  // B2B Wholesale Data (Use real data from product object where available)
  const supplier = {
    name: product.brand || 'Verified Manufacturer',
    verified: true,
    certifications: ['Audited', 'CE', 'Certified'],
    rating: product.rating || 4.8,
    reviews: product.reviewCount || 128,
  };

  const moq = product.moq ? `${product.moq} Piece(s)` : '1 Piece';

  // Parse specifications if they are a JSON string
  let specifications = [];
  try {
    const specs = typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs;
    if (specs && typeof specs === 'object') {
      specifications = Object.entries(specs).slice(0, 4).map(([label, value]) => ({ label, value }));
    }
  } catch (e) {
    console.error("Failed to parse product specs", e);
  }

  // Fallback specs if none available
  if (specifications.length === 0) {
    specifications = [
      { label: 'Material', value: 'Premium Grade' },
      { label: 'Category', value: product.category || 'Wholesale' },
      { label: 'Stock', value: product.stock > 0 ? 'Available' : 'Out of Stock' },
      { label: 'Manufacturer', value: 'Yes' },
    ];
  }

  const handleImageError = useCallback(() => { setImageError(true); }, []);
  const handleWish = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setWished(w => !w); }, []);
  const handleSendInquiry = useCallback((e) => { e.preventDefault(); e.stopPropagation(); navigate(`/contact?product=${product.id}`); }, [navigate, product.id]);
  const handleChatNow = useCallback((e) => { e.preventDefault(); e.stopPropagation(); alert(`Chat now about: ${product.title || product.name}`); }, [product.title, product.name]);
  const handleView = useCallback((e) => { e.preventDefault(); e.stopPropagation(); navigate(`/product/${product.id}`); }, [navigate, product.id]);

  return (
    <div
      style={{...styles.card, ...(isHovering ? styles.cardHover : {})}}
      onMouseEnter={handleMouseEnterCard}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleView}
    >
      {/* LEFT SIDE - Large Product Image */}
      <div 
        style={styles.imageSection}
        onMouseEnter={() => setImageHovering(true)}
        onMouseLeave={() => setImageHovering(false)}
      >
        <div style={styles.imageContainer}>
          <img 
            src={displayImage} 
            alt={product.title || 'Product Image'} 
            style={{...styles.image, ...(imageHovering ? styles.imageHover : {})}}
            loading="lazy"
            onError={handleImageError}
          />
        </div>

        {/* Wishlist Button - Top Right (Subtle) */}
        <button
          onClick={handleWish}
          style={styles.wishlistBtn}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.borderColor = wished ? '#EF4444' : '#CCC';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.9)';
            e.target.style.borderColor = '#EEE';
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiHeart size={16} fill={wished ? '#EF4444' : 'none'} color={wished ? '#EF4444' : '#666'} />
        </button>
      </div>

      {/* RIGHT SIDE - Information Section */}
      <div style={styles.contentSection}>
        
        {/* 1. Supplier Header */}
        <div style={styles.supplierHeader}>
          <h4 style={styles.supplierNameTop}>
            <FiExternalLink style={styles.supplierIcon} />
            {supplier.name}
            <FiExternalLink size={12} color="#AAA" />
          </h4>
        </div>

        {/* 2. Badges Row */}
        <div style={styles.badgeRow}>
          {supplier.verified && (
            <div style={{...styles.badgeChip, ...styles.auditedChip}}>
              <FiCheck size={10} />
              Audited
            </div>
          )}
          <div style={{...styles.badgeChip, ...styles.certChip}}>CE</div>
          <div style={{...styles.badgeChip, ...styles.certChip}}>UKCA</div>
          <div style={{...styles.badgeChip, ...styles.certifiedChip}}>Certified</div>
        </div>

        {/* 3. Product Title */}
        <h3 style={styles.productTitle}>
          {product.title}
        </h3>

        {/* 4. Price & MOQ Area */}
        <div style={styles.priceArea}>
          <div>
            <span style={styles.priceLabel}>
              {product.bulkPrices && product.bulkPrices.length > 0 ? (
                `US$${formatPrice(Math.min(...product.bulkPrices.map(t => t.price))).replace('$', '')} - ${formatPrice(Math.max(...product.bulkPrices.map(t => t.price))).replace('$', '')}`
              ) : (
                `US$${formatPrice(product.price).replace('$', '')}`
              )}
            </span>
            <span style={styles.fobPrice}>(FOB Price)</span>
          </div>
          <div style={styles.moqArea}>
            {moq} (MOQ)
          </div>
        </div>

        {/* 5. Specifications Grid */}
        <div style={styles.specGrid}>
          {specifications.map((spec, idx) => (
            <div key={idx} style={styles.specItem}>
              <div style={styles.specDot} />
              <span style={styles.specLabel}>{spec.label}:</span>
              <span style={styles.specValue}>{spec.value}</span>
            </div>
          ))}
        </div>

        {/* 6. Trust Footer (Secondary supplier info + Rating) */}
        <div style={styles.trustFooter}>
          <a 
            href="#" 
            style={styles.secondarySupplierLink}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            Yiwu Superstar Creation Company
            <FiExternalLink size={12} color="#AAA" />
          </a>
          <div style={styles.ratingLine}>
            <div style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  size={12} 
                  style={{ color: i < Math.floor(supplier.rating) ? '#F59E0B' : '#E5E7EB' }}
                />
              ))}
            </div>
            <span>{supplier.rating} ({supplier.reviews} reviews)</span>
          </div>
        </div>

        {/* 7. Action Buttons */}
        <div style={styles.actionsSection}>
          <button 
            onClick={handleSendInquiry}
            style={{...styles.btn, ...styles.inquiryBtn}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#3A2627'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#533638'}
          >
            <FiExternalLink size={16} />
            Inquiry
          </button>
          <button 
            onClick={handleChatNow}
            style={{...styles.btn, ...styles.chatBtn}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#EFF6FF'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
          >
            <FiCheck size={16} />
            Chat
          </button>
          <button 
            onClick={handleView}
            style={{...styles.btn, ...styles.viewBtn}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#EAEAEA'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#F5EDEC'}
          >
            <FiExternalLink size={16} />
            View
          </button>
        </div>
      </div>
    </div>
  );
}

// Memoized export — prevents re-renders when parent state changes
// but this card's product prop hasn't changed (e.g. sort dropdown changes)
export default memo(ProductCard);

