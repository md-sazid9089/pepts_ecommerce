import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { FiHeart, FiCheck, FiExternalLink } from 'react-icons/fi';
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

export default function ProductCard({ product, onQuickView }) {
  const { addItem, items } = useCart();
  const [wished, setWished] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [imageHovering, setImageHovering] = useState(false);
  const [supplierHover, setSupplierHover] = useState(false);

  const FALLBACK_IMAGE = `https://via.placeholder.com/260x260?text=${encodeURIComponent(product.name || 'Product')}`;
  const displayImage = imageError ? FALLBACK_IMAGE : (product.image || FALLBACK_IMAGE);

  // B2B Wholesale Data
  const supplier = product.supplier || {
    name: 'Supplier Co.',
    verified: true,
    certifications: ['Audited', 'CE', 'UKCA'],
    rating: 4.8,
    reviews: 128,
  };

  const priceRange = product.priceRange || {
    min: product.price,
    max: product.price ? product.price * 1.2 : 0,
    unit: 'FOB Price',
  };

  const moq = product.moq || '1 Piece';

  const specifications = product.specifications || [
    { label: 'Material', value: 'Polyester' },
    { label: 'Color', value: 'Multi Color' },
    { label: 'Size', value: 'Customizable' },
    { label: 'Manufacturer', value: 'Yes' },
  ];

  // Wholesale metadata
  const isBestSeller = product.isHot || false;
  const isBulkSave = product.tieredPricing || false;
  const isNew = product.isNew || false;
  const inStock = product.inStock !== false;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWished(w => !w);
  };

  const handleSendInquiry = (e) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Send inquiry for: ${product.name}`);
  };

  const handleChatNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Chat now about: ${product.name}`);
  };

  const handleView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/product/${product.id}`;
  };

  return (
    <div 
      style={{...styles.card, ...(isHovering ? styles.cardHover : {})}}
      onMouseEnter={() => setIsHovering(true)}
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
            alt={product.name} 
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
          {product.name}
        </h3>

        {/* 4. Price & MOQ Area */}
        <div style={styles.priceArea}>
          <div>
            <span style={styles.priceLabel}>
              US${formatPrice(priceRange.min).replace('$', '')} - {formatPrice(priceRange.max).replace('$', '')}
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





