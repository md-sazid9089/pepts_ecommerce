'use client';

import { useState, use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductById, getRelatedProducts, categories, formatPrice } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import {
  FiShoppingCart, FiHeart, FiShare2, FiStar,
  FiMinus, FiPlus, FiCheck, FiTruck, FiShield, FiRefreshCw,
  FiTrendingUp, FiThumbsUp, FiThumbsDown
} from 'react-icons/fi';
import styles from './page.module.css';

function StarRating({ rating, size = 16, interactive = false, onRate }) {
  const [hover, setHover] = useState(0);
  return (
    <div className={styles.starRow}>
      {[1,2,3,4,5].map(i => (
        <FiStar
          key={i}
          size={size}
          fill={i <= (interactive ? hover || rating : Math.round(rating)) ? 'currentColor' : 'none'}
          stroke={i <= (interactive ? hover || rating : Math.round(rating)) ? 'currentColor' : '#ddd'}
          style={{ cursor: interactive ? 'pointer' : 'default', color: '#FFD700' }}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate?.(i)}
        />
      ))}
    </div>
  );
}

const SAMPLE_REVIEWS = [
  { id: 1, name: 'Rahim K.', avatar: '🧑', rating: 5, date: '2 days ago', comment: 'Excellent product! Exactly as described. Fast delivery and great packaging.', helpful: 24 },
  { id: 2, name: 'Sunita M.', avatar: '👩', rating: 4, date: '1 week ago', comment: 'Very good quality. Slight delay in delivery but the product is worth it.', helpful: 18 },
  { id: 3, name: 'Karim A.', avatar: '🧔', rating: 5, date: '2 weeks ago', comment: 'Perfect! Matches the description beautifully. Would definitely buy again!', helpful: 31 },
  { id: 4, name: 'Fariha B.', avatar: '👱‍♀️', rating: 3, date: '3 weeks ago', comment: 'Product is okay but I expected a bit better quality for this price range.', helpful: 7 },
];

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const product = getProductById(id);

  if (!product) notFound();

  const { addItem, items } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const images = product.images || [product.image];
  const cat = categories.find(c => c.id === product.category);
  const related = getRelatedProducts(product, 4);
  const inCart = items.some(i => i.id === product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  // Rating distribution for display
  const ratingDist = [
    { stars: 5, pct: 68 },
    { stars: 4, pct: 20 },
    { stars: 3, pct: 7 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 2 },
  ];

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span>&rsaquo;</span>
          {cat && <><Link href={`/products?category=${cat.id}`}>{cat.name}</Link><span>&rsaquo;</span></>}
          <span>{product.name.substring(0, 30)}&hellip;</span>
        </nav>

        {/* Product main area */}
        <div className={styles.productMain}>
          {/* Left: Image gallery */}
          <div className={styles.gallery}>
            {/* Thumbnails */}
            <div className={styles.thumbCol}>
              {images.map((img, i) => (
                <button key={i} className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ''}`}
                  onClick={() => setActiveImg(i)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" />
                </button>
              ))}
            </div>

            {/* Main image with zoom */}
            <div
              className={`${styles.mainImgWrap} ${zoom ? styles.zoomed : ''}`}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={handleMouseMove}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[activeImg]}
                alt={product.name}
                className={styles.mainImg}
                style={zoom ? {
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: 'scale(2.2)',
                } : {}}
              />
              {zoom && <div className={styles.zoomHint}>Zoom active</div>}
              {product.discount > 0 && (
                <div className={styles.imgBadge}>
                  <span className="badge badge-discount">-{product.discount}% OFF</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Product info */}
          <div className={styles.info}>
            {/* Category + badges */}
            <div className={styles.topMeta}>
              {cat && (
                <Link href={`/products?category=${cat.id}`} className={styles.catTag}>
                  {cat.icon} {cat.name}
                </Link>
              )}
              {product.isNew && <span className="badge badge-new">NEW</span>}
              {product.isHot && <span className="badge badge-hot"><FiTrendingUp style={{marginRight: '4px'}} /> HOT</span>}
            </div>

            <h1 className={styles.productTitle}>{product.name}</h1>
            <p className={styles.brandLine}>
              Brand: <Link href={`/products?brand=${product.brand}`} className={styles.brandLink}>{product.brand}</Link>
              <span className={styles.skuLine}>SKU: PPW-{product.id.toString().padStart(6, '0')}</span>
            </p>

            {/* Rating */}
            <div className={styles.ratingBar}>
              <StarRating rating={product.rating} size={18} />
              <span className={styles.ratingNum}>{product.rating}</span>
              <a href="#reviews" className={styles.reviewCount}>{product.reviews.toLocaleString()} Reviews</a>
              <span className={styles.ratingDivider}>|</span>
              <span className={styles.soldCount}>🛍️ 2.4K Sold</span>
            </div>

            {/* B2B Price Range */}
            <div className={styles.priceBox}>
              <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px'}}>Wholesale Price</div>
              <span className={styles.price}>
                {product.tieredPricing ? `${formatPrice(Math.min(...product.tieredPricing.map(t => t.price)))} - ${formatPrice(Math.max(...product.tieredPricing.map(t => t.price)))}` : formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <div className={styles.priceOld}>
                  <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
                  <span className={styles.savingsText}>Save {formatPrice(product.originalPrice - product.price)} ({product.discount}%)</span>
                </div>
              )}
            </div>

            {/* B2B Tiered Pricing Table */}
            {product.tieredPricing && (
              <div className={styles.tieredPricingSection}>
                <div className={styles.tieredPricingHeader}>
                  <span>Bulk Order Tiers</span>
                  <span>Price per Unit</span>
                </div>
                <div className={styles.tieredTable}>
                  {product.tieredPricing.map((tier, idx) => {
                    const isActive = qty >= tier.min && (!tier.max || qty <= tier.max);
                    return (
                      <div key={idx} className={`${styles.tieredRow} ${isActive ? styles.activeTier : ''}`}>
                        <span className={styles.tierRange}>
                          {tier.max ? `${tier.min} - ${tier.max} units` : `${tier.min}+ units`}
                        </span>
                        <span className={styles.tierPrice}>{formatPrice(tier.price)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Delivery info */}
            <div className={styles.deliveryInfo}>
              <div className={styles.deliveryItem}>
                <FiTruck size={16} className={styles.deliveryIcon} />
                <span><strong>Wholesale Logistics</strong> fulfillment by Precious Play. Estimated 3-5 business days.</span>
              </div>
              <div className={styles.deliveryItem}>
                <FiShield size={16} className={styles.deliveryIcon} />
                <span><strong>Trade Assurance</strong> - Professional protection for your bulk orders.</span>
              </div>
            </div>

            {/* Stock & MOQ */}
            <div className={styles.stockRow}>
              <span className={styles.stockLabel}>MOQ:</span>
              <span className={styles.inStock} style={{color: 'var(--brand-primary)'}}>
                {product.moq} Units
              </span>
              <span className={styles.stockLabel} style={{marginLeft: '20px'}}>Ready to Ship:</span>
              <span className={styles.inStock}>
                <FiCheck size={14} /> {product.stock.toLocaleString()}+ units
              </span>
            </div>

            {/* Quantity */}
            <div className={styles.qtySection}>
              <span className={styles.qtyLabel}>Order Quantity:</span>
              <div className={styles.qtyControl}>
                <button className={styles.qtyBtn} onClick={() => setQty(q => Math.max(product.moq || 1, q - 1))} aria-label="Decrease">
                  <FiMinus size={14} />
                </button>
                <input 
                  type="number" 
                  value={qty} 
                  onChange={(e) => setQty(Math.max(product.moq || 1, parseInt(e.target.value) || 1))}
                  className={styles.qty}
                  style={{width: '60px', border: 'none', textAlign: 'center', background: 'transparent'}}
                />
                <button className={styles.qtyBtn} onClick={() => setQty(q => Math.min(product.stock, q + 1))} aria-label="Increase">
                  <FiPlus size={14} />
                </button>
              </div>
              <span className={styles.maxQty}>Case Pack: {product.casePackSize || 'Contact for info'}</span>
            </div>

            {/* Action buttons */}
            <div className={styles.actionBtns}>
              <button
                onClick={handleAddToCart}
                className={`${styles.addCartBtn} ${added ? styles.addCartBtnAdded : ''}`}
                disabled={product.stock === 0 || qty < product.moq}
                id="product-add-to-cart"
              >
                {added ? <FiCheck size={20} /> : <FiShoppingCart size={20} />}
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <Link href="/checkout" className={styles.buyNowBtn}>
                Buy Now
              </Link>
              <button
                className={`${styles.wishlistBtn} ${wished ? styles.wishlistBtnActive : ''}`}
                onClick={() => setWished(w => !w)}
                aria-label="Wishlist"
              >
                <FiHeart size={20} fill={wished ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        {/* Product detail tabs */}
        <div className={styles.tabsSection}>
          <div className={styles.tabNav}>
            {['description', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'description' && 'Description'}
                {tab === 'specifications' && 'Specifications'}
                {tab === 'reviews' && `Reviews (${product.reviews.toLocaleString()})`}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            {/* Description */}
            {activeTab === 'description' && (
              <div className={styles.descTab}>
                <p>{product.description}</p>
                <h3>Key Features</h3>
                <ul className={styles.featureList}>
                  {Object.entries(product.specs || {}).map(([k, v]) => (
                    <li key={k}><strong>{k}:</strong> {v}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {activeTab === 'specifications' && (
              <div className={styles.specsTab}>
                <table className={styles.specsTable}>
                  <tbody>
                    {Object.entries(product.specs || {}).map(([k, v]) => (
                      <tr key={k}>
                        <td>{k}</td>
                        <td>{v}</td>
                      </tr>
                    ))}
                    <tr><td>Brand</td><td>{product.brand}</td></tr>
                    <tr><td>Category</td><td>{cat?.name}</td></tr>
                    <tr><td>Availability</td><td>{product.stock} units in stock</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div id="reviews" className={styles.reviewsTab}>
                <div className={styles.reviewSummary}>
                  <div className={styles.reviewScore}>
                    <span className={styles.reviewBigNum}>{product.rating}</span>
                    <StarRating rating={product.rating} size={22} />
                    <span className={styles.reviewTotal}>{product.reviews.toLocaleString()} ratings</span>
                  </div>
                  <div className={styles.reviewBars}>
                    {ratingDist.map(row => (
                      <div key={row.stars} className={styles.reviewBarRow}>
                        <span className={styles.reviewBarLabel}>{row.stars}★</span>
                        <div className={styles.reviewBarTrack}>
                          <div className={styles.reviewBarFill} style={{ width: `${row.pct}%` }} />
                        </div>
                        <span className={styles.reviewBarPct}>{row.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.reviewList}>
                  {SAMPLE_REVIEWS.map(r => (
                    <div key={r.id} className={styles.reviewCard}>
                      <div className={styles.reviewTop}>
                        <span className={styles.reviewAvatar}>{r.avatar}</span>
                        <div>
                          <p className={styles.reviewName}>{r.name}</p>
                          <StarRating rating={r.rating} size={13} />
                        </div>
                        <span className={styles.reviewDate}>{r.date}</span>
                      </div>
                      <p className={styles.reviewComment}>{r.comment}</p>
                      <div className={styles.reviewHelpful}>
                        <span>Was this helpful?</span>
                        <button><FiThumbsUp style={{marginRight: '4px'}} /> {r.helpful}</button>
                        <button><FiThumbsDown style={{marginRight: '4px'}} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className={styles.relatedSection}>
            <div className="section-header">
              <h2 className="section-title">You May Also Like</h2>
              <Link href={`/products?category=${product.category}`} className="section-see-all">See All →</Link>
            </div>
            <ProductGrid products={related} columns={4} />
          </section>
        )}
      </div>
    </div>
  );
}
