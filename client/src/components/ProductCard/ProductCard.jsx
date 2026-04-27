import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/utils/pricing';
import { imagePresets } from '@/utils/imageUtils';
import { queryKeys } from '@/lib/queryKeys';
import productsApi from '@/services/api/products.api';
import { FiHeart, FiCheck, FiExternalLink, FiMessageSquare, FiEye } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

/* ─── CSS ─────────────────────────────────────────────────────────────────── */
const CSS = `
  .pc-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 16px rgba(0,0,0,0.07);
    border: 1px solid #EAEAEA;
    transition: box-shadow 0.28s ease, border-color 0.28s ease, transform 0.2s ease;
    display: grid;
    grid-template-columns: 300px 1fr;
    min-height: 360px;
    cursor: pointer;
    position: relative;
  }
  .pc-card:hover {
    box-shadow: 0 10px 36px rgba(83,54,56,0.13);
    border-color: #C9B8B9;
    transform: translateY(-2px);
  }

  /* ── Image Side ── */
  .pc-image-section {
    background: #F7F5F5;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    padding: 0;
  }
  .pc-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.45s ease;
    display: block;
  }
  .pc-card:hover .pc-image {
    transform: scale(1.06);
  }

  /* Wishlist button */
  .pc-wish-btn {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(255,255,255,0.92);
    border: 1px solid #E5E7EB;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
    z-index: 10;
    backdrop-filter: blur(4px);
  }
  .pc-wish-btn:hover {
    background: #fff;
    border-color: #EF4444;
    transform: scale(1.12);
  }
  .pc-wish-btn.wished {
    background: #FEF2F2;
    border-color: #EF4444;
  }

  /* Stock pill on image */
  .pc-stock-pill {
    position: absolute;
    bottom: 12px;
    left: 12px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.4px;
    backdrop-filter: blur(6px);
  }
  .pc-stock-pill.in-stock {
    background: rgba(220,252,231,0.92);
    color: #15803D;
    border: 1px solid #BBF7D0;
  }
  .pc-stock-pill.out-stock {
    background: rgba(254,226,226,0.92);
    color: #B91C1C;
    border: 1px solid #FECACA;
  }

  /* ── Content Side ── */
  .pc-content {
    display: flex;
    flex-direction: column;
    padding: 22px 28px;
    background: #fff;
    min-width: 0;
  }

  /* Supplier row */
  .pc-supplier-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .pc-supplier-name {
    font-size: 13px;
    font-weight: 600;
    color: #533638;
    display: flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Badge row */
  .pc-badge-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .pc-badge {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .pc-badge-blue  { background:#EBF5FF; color:#2563EB; border:1px solid #BFDBFE; }
  .pc-badge-gray  { background:#F3F4F6; color:#4B5563; border:1px solid #E5E7EB; }
  .pc-badge-green { background:#F0FDF4; color:#166534; border:1px solid #BBF7D0; }

  /* Title */
  .pc-title {
    font-size: 17px;
    font-weight: 700;
    color: #111;
    margin: 0 0 12px;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Price */
  .pc-price-row { margin-bottom: 14px; }
  .pc-price {
    font-size: 22px;
    font-weight: 800;
    color: #111;
    margin-right: 6px;
  }
  .pc-fob {
    font-size: 12px;
    color: #888;
    font-weight: 500;
  }
  .pc-moq {
    font-size: 14px;
    font-weight: 600;
    color: #444;
    margin-top: 2px;
  }

  /* Spec grid */
  .pc-specs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 16px;
    padding: 12px 0;
    border-top: 1px solid #F3F4F6;
    margin-bottom: 10px;
  }
  .pc-spec-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #666;
  }
  .pc-spec-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #D1D5DB;
    flex-shrink: 0;
  }
  .pc-spec-label { font-weight: 500; color: #999; }
  .pc-spec-val   { font-weight: 600; color: #444; }

  /* Rating */
  .pc-rating-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #888;
    margin-bottom: 14px;
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px dotted #EEE;
  }
  .pc-stars { display:flex; gap:2px; }

  /* Action buttons */
  .pc-actions {
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr;
    gap: 10px;
  }
  .pc-btn {
    height: 42px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    border: none;
    white-space: nowrap;
  }
  .pc-btn-inquiry {
    background: #533638;
    color: #fff;
  }
  .pc-btn-inquiry:hover { background: #3A2627; }

  .pc-btn-chat {
    background: #fff;
    color: #2563EB;
    border: 1.5px solid #2563EB;
  }
  .pc-btn-chat:hover { background: #EFF6FF; }

  .pc-btn-view {
    background: #F5EDEC;
    color: #533638;
    border: 1.5px solid #C9B8B9;
  }
  .pc-btn-view:hover { background: #EAD9D9; }

  /* ─── MOBILE ─────────────────────────────────────────── */
  @media (max-width: 700px) {
    .pc-card {
      grid-template-columns: 1fr;
      grid-template-rows: 220px auto;
      min-height: unset;
      border-radius: 14px;
    }
    .pc-image-section {
      height: 220px;
      width: 100%;
    }
    .pc-content {
      padding: 16px 18px;
    }
    .pc-title {
      font-size: 15px;
      margin-bottom: 10px;
    }
    .pc-price { font-size: 20px; }
    .pc-specs {
      grid-template-columns: 1fr 1fr;
      gap: 6px 12px;
    }
    .pc-actions {
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    /* On mobile, inquiry button spans full width */
    .pc-btn-inquiry { grid-column: 1 / -1; }
    .pc-btn { height: 40px; font-size: 12px; }
  }

  /* ─── SMALL MOBILE ───────────────────────────────────── */
  @media (max-width: 420px) {
    .pc-image-section { height: 190px; }
    .pc-specs { display: none; } /* hide specs on very small, save space */
    .pc-content { padding: 14px 14px; }
  }
`;

/* ─── Component ───────────────────────────────────────────────────────────── */
function ProductCard({ product, onQuickView }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addItem, items } = useCart();
  const [wished, setWished] = useState(false);
  const [imageError, setImageError] = useState(false);

  const FALLBACK_IMAGE = '/placeholder-product.jpg';
  const rawImageUrl = product.imageUrl?.trim() ? product.imageUrl : null;
  const displayImage = imageError
    ? FALLBACK_IMAGE
    : (imagePresets.thumbnail(rawImageUrl) || FALLBACK_IMAGE);

  // Prefetch detail on hover for instant navigation
  const handleMouseEnter = useCallback(() => {
    if (product.id) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.products.detail(product.id),
        queryFn: () => productsApi.getById(product.id),
        staleTime: 1000 * 60 * 5,
      });
    }
  }, [product.id, queryClient]);

  // Supplier / meta
  const supplier = {
    name: product.brand || 'Verified Manufacturer',
    rating: product.rating || 4.8,
    reviews: product.reviewCount || 128,
  };
  const moq = product.moq ? `${product.moq} Piece(s)` : '1 Piece';
  const inStock = product.stock > 0;

  // Specs
  let specifications = [];
  try {
    const specs = typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs;
    if (specs && typeof specs === 'object') {
      specifications = Object.entries(specs).slice(0, 4).map(([label, value]) => ({ label, value }));
    }
  } catch { /* ignore */ }

  if (specifications.length === 0) {
    specifications = [
      { label: 'Material', value: 'Premium Grade' },
      { label: 'Category', value: product.category || 'Wholesale' },
      { label: 'Stock', value: inStock ? 'Available' : 'Out of Stock' },
      { label: 'Source', value: product.brand || 'Direct Mfr' },
    ];
  }

  // Handlers
  const handleImageError = useCallback(() => setImageError(true), []);
  const handleWish = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setWished(w => !w); }, []);
  const handleInquiry = useCallback((e) => { e.preventDefault(); e.stopPropagation(); navigate(`/contact?product=${product.id}`); }, [navigate, product.id]);
  const handleChat = useCallback((e) => { e.preventDefault(); e.stopPropagation(); alert(`Chat about: ${product.title || product.name}`); }, [product.title, product.name]);
  const handleView = useCallback((e) => { e.preventDefault(); e.stopPropagation(); navigate(`/product/${product.id}`); }, [navigate, product.id]);

  // Price display
  const priceDisplay = product.bulkPrices?.length > 0
    ? `US$${formatPrice(Math.min(...product.bulkPrices.map(t => t.price))).replace('$', '')} – ${formatPrice(Math.max(...product.bulkPrices.map(t => t.price))).replace('$', '')}`
    : `US$${formatPrice(product.price).replace('$', '')}`;

  return (
    <>
      <style>{CSS}</style>
      <div
        className="pc-card"
        onMouseEnter={handleMouseEnter}
        onClick={handleView}
        role="article"
        aria-label={product.title}
      >
        {/* ── Image ── */}
        <div className="pc-image-section">
          <img
            src={displayImage}
            alt={product.title || 'Product'}
            className="pc-image"
            loading="lazy"
            onError={handleImageError}
          />
          <button
            className={`pc-wish-btn${wished ? ' wished' : ''}`}
            onClick={handleWish}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart size={16} fill={wished ? '#EF4444' : 'none'} color={wished ? '#EF4444' : '#666'} />
          </button>
          <span className={`pc-stock-pill ${inStock ? 'in-stock' : 'out-stock'}`}>
            {inStock ? '● In Stock' : '○ Out of Stock'}
          </span>
        </div>

        {/* ── Content ── */}
        <div className="pc-content">

          {/* Supplier */}
          <div className="pc-supplier-row">
            <span className="pc-supplier-name">
              <FiExternalLink size={13} color="#533638" />
              {supplier.name}
            </span>
          </div>

          {/* Badges */}
          <div className="pc-badge-row">
            <span className="pc-badge pc-badge-blue"><FiCheck size={9} /> Audited</span>
            <span className="pc-badge pc-badge-gray">CE</span>
            <span className="pc-badge pc-badge-gray">UKCA</span>
            <span className="pc-badge pc-badge-green">Certified</span>
          </div>

          {/* Title */}
          <h3 className="pc-title">{product.title || product.name}</h3>

          {/* Price */}
          <div className="pc-price-row">
            <div>
              <span className="pc-price">{priceDisplay}</span>
              <span className="pc-fob">(FOB Price)</span>
            </div>
            <div className="pc-moq">{moq} (MOQ)</div>
          </div>

          {/* Specs */}
          <div className="pc-specs">
            {specifications.map((spec, idx) => (
              <div key={idx} className="pc-spec-item">
                <div className="pc-spec-dot" />
                <span className="pc-spec-label">{spec.label}:</span>
                <span className="pc-spec-val">{String(spec.value)}</span>
              </div>
            ))}
          </div>

          {/* Rating */}
          <div className="pc-rating-row">
            <div className="pc-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={11} color={i < Math.floor(supplier.rating) ? '#F59E0B' : '#E5E7EB'} />
              ))}
            </div>
            <span>{supplier.rating} ({supplier.reviews} reviews)</span>
          </div>

          {/* Actions */}
          <div className="pc-actions">
            <button className="pc-btn pc-btn-inquiry" onClick={handleInquiry}>
              <FiExternalLink size={14} />
              Inquiry
            </button>
            <button className="pc-btn pc-btn-chat" onClick={handleChat}>
              <FiMessageSquare size={14} />
              Chat
            </button>
            <button className="pc-btn pc-btn-view" onClick={handleView}>
              <FiEye size={14} />
              View
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default memo(ProductCard);
