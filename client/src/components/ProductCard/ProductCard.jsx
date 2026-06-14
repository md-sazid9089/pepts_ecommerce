import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { imagePresets } from '@/utils/imageUtils';
import { queryKeys } from '@/lib/queryKeys';
import productsApi from '@/services/api/products.api';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const CSS = `
  .pc-card {
    width: 100%;
    height: 100%;
    background: #F9F5F3;
    font-family: var(--font-sans);
    border-radius: 0px;
    border: 1px solid #EAEAEA;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.24s ease, border-color 0.24s ease, transform 0.2s ease;
  }
  .pc-card:hover {
    box-shadow: 0 10px 28px rgba(83,54,56,0.12);
    border-color: #D8C8C9;
    transform: translateY(-2px);
  }
  .pc-image-section {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #F7F5F5;
    overflow: hidden;
    position: relative;
  }
  .pc-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }
  .pc-card:hover .pc-image {
    transform: scale(1.04);
  }
  .pc-content {
    padding: 12px;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  .pc-brand {
    font-size: 11px;
    color: #867671;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin: 0 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pc-title {
    font-size: 14px;
    font-weight: 700;
    color: #2F2424;
    margin: 0 0 8px;
    line-height: 1.35;
    min-height: 38px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .pc-rating-row {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 9px;
    min-width: 0;
  }
  .pc-stars {
    display: flex;
    gap: 1px;
    color: #F59E0B;
    flex-shrink: 0;
  }
  .pc-rating-text {
    font-size: 11px;
    color: #867671;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pc-price-row {
    margin-top: auto;
    margin-bottom: 12px;
    min-width: 0;
  }
  .pc-price {
    display: block;
    font-family: var(--font-numeric);
    font-size: 18px;
    font-weight: 800;
    color: #2F2424;
    line-height: 1.15;
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
  }
  .pc-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .pc-add-btn {
    flex: 1;
    min-width: 0;
    height: 40px;
    border: none;
    border-radius: 8px;
    background: #4A3535;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: background 0.2s ease, opacity 0.2s ease;
  }
  .pc-add-btn:hover {
    background: #5A3D3D;
  }
  .pc-add-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
  .pc-wish-btn {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    border-radius: 8px;
    background: #fff;
    border: 1px solid #E8E3E0;
    color: #4A3535;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  }
  .pc-wish-btn:hover,
  .pc-wish-btn.wished {
    background: #FEF2F2;
    border-color: #EF4444;
    color: #EF4444;
  }
  @media (max-width: 520px) {
    .pc-content {
      padding: 10px;
    }
    .pc-title {
      font-size: 12px;
      min-height: 33px;
      margin-bottom: 7px;
    }
    .pc-brand,
    .pc-rating-text {
      font-size: 10px;
    }
    .pc-price {
      font-size: 16px;
    }
    .pc-actions {
      gap: 6px;
    }
    .pc-add-btn {
      height: 36px;
      font-size: 12px;
      gap: 4px;
    }
    .pc-wish-btn {
      width: 36px;
      height: 36px;
      flex-basis: 36px;
    }
  }
`;

function ProductCard({ product }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [imageError, setImageError] = useState(false);
  const [cartBtnText, setCartBtnText] = useState('Add');
  const [addingToCart, setAddingToCart] = useState(false);

  const FALLBACK_IMAGE = '/placeholder-product.jpg';
  const primaryImageUrl = product.images?.[0]?.url ?? product.imageUrl ?? null;
  const rawImageUrl = primaryImageUrl?.trim() ? primaryImageUrl : null;
  const displayImage = imageError
    ? FALLBACK_IMAGE
    : (imagePresets.thumbnail(rawImageUrl) || FALLBACK_IMAGE);

  const title = product.title || product.name || 'Product';
  const rating = Number(product.rating || 4.8);
  const reviewCount = product.reviewCount || product.reviewsCount || 0;
  const wished = isInWishlist(product.id);

  const formatPrice = (p) => parseFloat(p || 0).toFixed(2);
  const getPriceDisplay = () => {
    const hasMin = product.priceMin != null && product.priceMin !== '';
    const hasMax = product.priceMax != null && product.priceMax !== '';
    if (hasMin && hasMax) {
      const lo = parseFloat(product.priceMin);
      const hi = parseFloat(product.priceMax);
      if (lo !== hi) return `US$${formatPrice(lo)} - ${formatPrice(hi)}`;
      return `US$${formatPrice(lo)}`;
    }
    if (hasMax) return `US$${formatPrice(product.priceMax)}`;
    if (hasMin) return `US$${formatPrice(product.priceMin)}`;

    const bulkPriceValues = product.bulkPrices?.map(t => parseFloat(t.price)) || [];
    const minPrice = bulkPriceValues.length > 0
      ? Math.min(parseFloat(product.price || 0), ...bulkPriceValues)
      : parseFloat(product.price || 0);
    const maxPrice = bulkPriceValues.length > 0
      ? Math.max(...bulkPriceValues)
      : parseFloat(product.price || 0);
    if (minPrice === maxPrice) return `US$${formatPrice(minPrice)}`;
    return `US$${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  };

  const handleMouseEnter = useCallback(() => {
    if (product.id) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.products.detail(product.id),
        queryFn: async () => {
          const response = await productsApi.getById(product.id);
          if (!response.success) throw new Error(response.message);
          return response.data;
        },
        staleTime: 1000 * 60 * 2,
      });
    }
  }, [product.id, queryClient]);

  const handleNavigate = useCallback(() => {
    navigate(`/product/${product.id}`);
  }, [navigate, product.id]);

  const handleImageError = useCallback(() => setImageError(true), []);

  const handleWish = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wished) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [addToWishlist, removeFromWishlist, product, wished]);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAddingToCart(true);
      addToCart(product, product.moq || 1);
      setCartBtnText('Added');
      setTimeout(() => {
        setCartBtnText('Add');
        setAddingToCart(false);
      }, 1200);
    } catch (err) {
      alert(err.message);
      setAddingToCart(false);
    }
  }, [addToCart, product]);

  return (
    <>
      <style>{CSS}</style>
      <article
        className="pc-card"
        onMouseEnter={handleMouseEnter}
        onClick={handleNavigate}
        aria-label={title}
      >
        <div className="pc-image-section">
          <img
            src={displayImage}
            alt={title}
            className="pc-image"
            loading="lazy"
            decoding="async"
            onError={handleImageError}
          />
        </div>

        <div className="pc-content">
          <p className="pc-brand">{product.brand || 'Pepta'}</p>
          <h3 className="pc-title">{title}</h3>

          <div className="pc-rating-row">
            <div className="pc-stars" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={12} color={i < Math.floor(rating) ? '#F59E0B' : '#E5E7EB'} />
              ))}
            </div>
            <span className="pc-rating-text">({reviewCount} reviews)</span>
          </div>

          <div className="pc-price-row">
            <span className="pc-price">{getPriceDisplay()}</span>
          </div>

          <div className="pc-actions">
            <button
              type="button"
              className="pc-add-btn"
              onClick={handleAddToCart}
              disabled={addingToCart}
              aria-label={`Add ${title} to cart`}
            >
              <FiShoppingCart size={16} />
              <span>{cartBtnText}</span>
            </button>
            <button
              type="button"
              className={`pc-wish-btn${wished ? ' wished' : ''}`}
              onClick={handleWish}
              aria-label={wished ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`}
            >
              <FiHeart size={18} fill={wished ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </article>
    </>
  );
}

export default memo(ProductCard);
