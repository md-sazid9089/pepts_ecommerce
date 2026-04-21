import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaShareAlt,
  FaCheck,
  FaTruck,
  FaUndo,
  FaLock,
  FaBox,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa"

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "#ffffff",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },

  // Breadcrumb
  breadcrumb: {
    padding: "1rem 2rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "#6b7280",
    borderBottom: "1px solid #e5e7eb",
  },
  breadcrumbLink: {
    color: "#1e293b",
    textDecoration: "none",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
  breadcrumbLinkHover: {
    color: "#0f172a",
  },
  breadcrumbActive: {
    color: "#111827",
    fontWeight: 500,
  },

  // Main Container
  mainContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "2rem",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "3rem",
  },
  mainContainerMobile: {
    gridTemplateColumns: "1fr",
    gap: "1.5rem",
    padding: "1rem",
  },

  // Image Gallery Section
  gallerySection: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  // Main Image
  mainImageWrapper: {
    position: "relative",
    backgroundColor: "#f3f4f6",
    borderRadius: "0.75rem",
    overflow: "hidden",
    aspectRatio: "1",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  // Badge on Image
  imageBadge: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: 600,
  },

  // Carousel Controls
  carouselControl: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    border: "1px solid #e5e7eb",
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "0.375rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    color: "#111827",
  },
  carouselControlHover: {
    backgroundColor: "#ffffff",
    borderColor: "#1e293b",
    transform: "translateY(-50%)",
  },
  carouselControlPrev: {
    left: "1rem",
  },
  carouselControlNext: {
    right: "1rem",
  },

  // Thumbnail Gallery
  thumbnailGallery: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "0.75rem",
  },
  thumbnailGalleryMobile: {
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.5rem",
  },
  thumbnail: {
    aspectRatio: "1",
    borderRadius: "0.5rem",
    overflow: "hidden",
    border: "2px solid #e5e7eb",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailActive: {
    borderColor: "#1e293b",
    boxShadow: "0 0 0 1px #1e293b",
  },
  thumbnailHover: {
    borderColor: "#9ca3af",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  // Product Info Section
  infoSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  // Badge
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    width: "fit-content",
    padding: "0.375rem 0.75rem",
    backgroundColor: "#dbeafe",
    border: "1px solid #93c5fd",
    borderRadius: "0.375rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    color: "#1e40af",
    letterSpacing: "0.5px",
  },

  // Header
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  brand: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#111827",
    margin: 0,
    lineHeight: 1.2,
  },
  productCode: {
    fontSize: "0.875rem",
    color: "#6b7280",
    margin: 0,
  },

  // Rating
  ratingSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  ratingStars: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  starIcon: {
    color: "#fbbf24",
    fontSize: "1rem",
  },
  ratingValue: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#111827",
  },
  reviewCount: {
    fontSize: "0.875rem",
    color: "#6b7280",
  },

  // Price Section
  priceSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    paddingBottom: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
  },
  currentPrice: {
    fontSize: "1.875rem",
    fontWeight: 700,
    color: "#111827",
  },
  originalPrice: {
    fontSize: "1.25rem",
    color: "#9ca3af",
    textDecoration: "line-through",
  },
  discountBadge: {
    padding: "0.5rem 0.75rem",
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: 600,
  },

  // Description
  description: {
    fontSize: "0.95rem",
    color: "#374151",
    lineHeight: 1.6,
    margin: 0,
  },

  // Specifications
  specsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    paddingBottom: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
  },
  specsTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  },
  specsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  specsGridMobile: {
    gridTemplateColumns: "1fr",
  },
  specItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  specLabel: {
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  specValue: {
    fontSize: "0.95rem",
    fontWeight: 500,
    color: "#111827",
  },

  // Tiered Pricing
  tieredPricingSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1.5rem",
    backgroundColor: "#f9fafb",
    borderRadius: "0.75rem",
    borderBottom: "1px solid #e5e7eb",
    marginBottom: "1.5rem",
  },
  tieredPricingTitle: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  },
  tieredTable: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  tieredTableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "1rem",
    paddingBottom: "0.75rem",
    borderBottom: "1px solid #e5e7eb",
  },
  tieredTableHeaderCell: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  tieredTableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "1rem",
    padding: "0.75rem",
    backgroundColor: "#ffffff",
    borderRadius: "0.375rem",
  },
  tieredTableCell: {
    fontSize: "0.875rem",
    color: "#111827",
  },

  // Stock Info
  stockInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem",
    backgroundColor: "#f0fdf4",
    borderRadius: "0.5rem",
    border: "1px solid #dcfce7",
    marginBottom: "1.5rem",
  },
  stockIcon: {
    color: "#16a34a",
    fontSize: "1.25rem",
  },
  stockText: {
    fontSize: "0.875rem",
    color: "#166534",
    fontWeight: 500,
  },

  // Quantity Selector
  quantitySection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  quantityLabel: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#111827",
  },
  quantitySelector: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    width: "fit-content",
  },
  quantityInput: {
    width: "4rem",
    padding: "0.5rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.375rem",
    fontSize: "0.95rem",
    textAlign: "center",
    outline: "none",
    transition: "all 0.2s ease",
  },
  quantityInputFocus: {
    borderColor: "#1e293b",
    boxShadow: "0 0 0 3px rgba(30, 41, 59, 0.1)",
  },
  quantityButton: {
    width: "2.5rem",
    height: "2.5rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.375rem",
    background: "#f3f4f6",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    color: "#111827",
    fontSize: "0.875rem",
    fontWeight: 600,
    fontFamily: "inherit",
  },
  quantityButtonHover: {
    borderColor: "#1e293b",
    backgroundColor: "#1e293b",
    color: "#ffffff",
  },

  // Action Buttons
  actionButtons: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  actionButtonsMobile: {
    flexDirection: "column",
  },
  addToCartBtn: {
    flex: 1,
    padding: "0.875rem 1.5rem",
    backgroundColor: "#1e293b",
    color: "#ffffff",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontFamily: "inherit",
  },
  addToCartBtnHover: {
    backgroundColor: "#0f172a",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(30, 41, 59, 0.3)",
  },
  wishlistBtn: {
    padding: "0.875rem 1.5rem",
    backgroundColor: "#f3f4f6",
    color: "#111827",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontFamily: "inherit",
  },
  wishlistBtnHover: {
    backgroundColor: "#e5e7eb",
    borderColor: "#1e293b",
  },
  shareBtn: {
    padding: "0.875rem 1.5rem",
    backgroundColor: "#f3f4f6",
    color: "#111827",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontFamily: "inherit",
  },
  shareBtnHover: {
    backgroundColor: "#e5e7eb",
    borderColor: "#1e293b",
  },

  // Features
  featuresSection: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
  },
  featuresMobile: {
    gridTemplateColumns: "1fr",
  },
  featureCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1.5rem",
    backgroundColor: "#f9fafb",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    textAlign: "center",
  },
  featureIcon: {
    fontSize: "1.75rem",
    color: "#1e293b",
  },
  featureTitle: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  },
  featureDesc: {
    fontSize: "0.8rem",
    color: "#6b7280",
    margin: 0,
  },

  // Collapsible Section
  collapsibleHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem",
    backgroundColor: "#f9fafb",
    borderRadius: "0.5rem",
    cursor: "pointer",
    border: "1px solid #e5e7eb",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#111827",
  },
  collapsibleHeaderHover: {
    backgroundColor: "#f3f4f6",
  },
  collapsibleContent: {
    padding: "1rem",
    backgroundColor: "#ffffff",
    borderLeft: "1px solid #e5e7eb",
    borderRight: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
    borderBottomLeftRadius: "0.5rem",
    borderBottomRightRadius: "0.5rem",
  },
  collapsibleText: {
    fontSize: "0.875rem",
    color: "#374151",
    lineHeight: 1.6,
  },

  // MOQ Warning
  moqWarning: {
    padding: "1rem",
    backgroundColor: "#fef3c7",
    border: "1px solid #fcd34d",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    color: "#92400e",
    marginBottom: "1.5rem",
  },
}

// Mock product data
const mockProduct = {
  id: 1,
  code: "PFD-2024-001",
  brand: "PreciousPlay",
  name: "Premium Fashion Doll Collection - Assorted Series A",
  price: 850,
  originalPrice: 1200,
  discount: 29,
  rating: 4.8,
  reviews: 342,
  description: "Collectible fashion dolls with premium articulation and detailed accessories. Perfect for retailers stocking trendy dolls. Each doll features beautiful hand-painted features and comes with matching outfit and accessories.",
  images: [
    "https://placehold.co/600?text=Fashion+Doll+Series+A",
    "https://placehold.co/600?text=Fashion+Doll+Back",
    "https://placehold.co/600?text=Fashion+Doll+Accessories",
    "https://placehold.co/600?text=Fashion+Doll+Package",
  ],
  stock: 250,
  moq: 10,
  inStock: true,
  specs: {
    Height: "30cm",
    Material: "Premium Vinyl & Plastic",
    Articulation: "Full Body Poseable",
    Package: "50 units per case",
    "Recommended For": "Gift Shops, Toy Boutiques",
  },
  tieredPricing: [
    { min: 10, max: 50, price: 850 },
    { min: 51, max: 200, price: 720 },
    { min: 201, max: 500, price: 650 },
    { min: 501, max: null, price: 580 },
  ],
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(mockProduct.moq)
  const [expandedSection, setExpandedSection] = useState(null)
  const [hoveredBtn, setHoveredBtn] = useState(null)
  const isMobile = window.innerWidth < 768

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockProduct.images.length)
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockProduct.images.length) % mockProduct.images.length)
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || mockProduct.moq
    if (value >= mockProduct.moq) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    if (quantity >= mockProduct.moq) {
      alert(`Added ${quantity} units to cart`)
    }
  }

  const currentTierPrice = mockProduct.tieredPricing.find((tier) => {
    if (tier.max === null) {
      return quantity >= tier.min
    }
    return quantity >= tier.min && quantity <= tier.max
  })

  return (
    <div style={styles.pageContainer}>
      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <span
          style={styles.breadcrumbLink}
          onClick={() => navigate("/")}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.breadcrumbLinkHover)}
          onMouseLeave={(e) => (e.target.style.color = "#1e293b")}
        >
          Home
        </span>
        <span style={{ color: "#d1d5db" }}>›</span>
        <span
          style={styles.breadcrumbLink}
          onClick={() => navigate("/categories")}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.breadcrumbLinkHover)}
          onMouseLeave={(e) => (e.target.style.color = "#1e293b")}
        >
          Categories
        </span>
        <span style={{ color: "#d1d5db" }}>›</span>
        <span style={styles.breadcrumbActive}>{mockProduct.name}</span>
      </div>

      {/* Main Container */}
      <div style={{ ...styles.mainContainer, ...(isMobile ? styles.mainContainerMobile : {}) }}>
        {/* Image Gallery */}
        <div style={styles.gallerySection}>
          <div style={styles.mainImageWrapper}>
            <img src={mockProduct.images[currentImageIndex]} alt="Product" style={styles.mainImage} />
            {mockProduct.discount > 0 && (
              <div style={styles.imageBadge}>-{mockProduct.discount}%</div>
            )}

            {/* Previous Button */}
            <button
              style={{ ...styles.carouselControl, ...styles.carouselControlPrev }}
              onClick={handlePrevImage}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.carouselControlHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: "rgba(255, 255, 255, 0.9)", borderColor: "#e5e7eb" })}
            >
              <FaChevronLeft />
            </button>

            {/* Next Button */}
            <button
              style={{ ...styles.carouselControl, ...styles.carouselControlNext }}
              onClick={handleNextImage}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.carouselControlHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: "rgba(255, 255, 255, 0.9)", borderColor: "#e5e7eb" })}
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Thumbnails */}
          <div style={{ ...styles.thumbnailGallery, ...(isMobile ? styles.thumbnailGalleryMobile : {}) }}>
            {mockProduct.images.map((img, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.thumbnail,
                  ...(currentImageIndex === idx ? styles.thumbnailActive : {}),
                }}
                onClick={() => setCurrentImageIndex(idx)}
                onMouseEnter={(e) => {
                  if (currentImageIndex !== idx) {
                    Object.assign(e.currentTarget.style, styles.thumbnailHover)
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentImageIndex !== idx) {
                    Object.assign(e.currentTarget.style, { borderColor: "#e5e7eb" })
                  }
                }}
              >
                <img src={img} alt={`Thumbnail ${idx}`} style={styles.thumbnailImage} />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div style={styles.infoSection}>
          {/* Badge */}
          <div style={styles.badge}>
            <FaCheck style={{ fontSize: "0.625rem" }} />
            New Arrival
          </div>

          {/* Header */}
          <div style={styles.header}>
            <p style={styles.brand}>{mockProduct.brand}</p>
            <h1 style={styles.title}>{mockProduct.name}</h1>
            <p style={styles.productCode}>Product Code: {mockProduct.code}</p>
          </div>

          {/* Rating */}
          <div style={styles.ratingSection}>
            <div style={styles.ratingStars}>
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  style={{
                    ...styles.starIcon,
                    color: i < Math.floor(mockProduct.rating) ? "#fbbf24" : "#e5e7eb",
                  }}
                />
              ))}
            </div>
            <span style={styles.ratingValue}>{mockProduct.rating}</span>
            <span style={styles.reviewCount}>({mockProduct.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div style={styles.priceSection}>
            <span style={styles.currentPrice}>${mockProduct.price}</span>
            {mockProduct.originalPrice > mockProduct.price && (
              <span style={styles.originalPrice}>${mockProduct.originalPrice}</span>
            )}
            {mockProduct.discount > 0 && (
              <span style={styles.discountBadge}>Save {mockProduct.discount}%</span>
            )}
          </div>

          {/* Description */}
          <p style={styles.description}>{mockProduct.description}</p>

          {/* Specifications */}
          <div style={styles.specsSection}>
            <h3 style={styles.specsTitle}>Product Specifications</h3>
            <div style={{ ...styles.specsGrid, ...(isMobile ? styles.specsGridMobile : {}) }}>
              {Object.entries(mockProduct.specs).map(([key, value]) => (
                <div key={key} style={styles.specItem}>
                  <span style={styles.specLabel}>{key}</span>
                  <span style={styles.specValue}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MOQ Warning */}
          {quantity < mockProduct.moq && (
            <div style={styles.moqWarning}>
              Minimum order quantity is {mockProduct.moq} units
            </div>
          )}

          {/* Tiered Pricing */}
          <div style={styles.tieredPricingSection}>
            <h3 style={styles.tieredPricingTitle}>💰 Bulk Pricing</h3>
            <div style={styles.tieredTable}>
              <div style={styles.tieredTableHeader}>
                <div style={styles.tieredTableHeaderCell}>Quantity</div>
                <div style={styles.tieredTableHeaderCell}>Price</div>
                <div style={styles.tieredTableHeaderCell}>Savings</div>
              </div>
              {mockProduct.tieredPricing.map((tier, idx) => {
                const savings = ((mockProduct.price - tier.price) / mockProduct.price * 100).toFixed(0)
                return (
                  <div key={idx} style={styles.tieredTableRow}>
                    <div style={styles.tieredTableCell}>
                      {tier.min} - {tier.max ? tier.max : "∞"}
                    </div>
                    <div style={styles.tieredTableCell}>${tier.price}</div>
                    <div style={styles.tieredTableCell}>{savings}% off</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stock Info */}
          {mockProduct.inStock ? (
            <div style={styles.stockInfo}>
              <FaCheck style={styles.stockIcon} />
              <span style={styles.stockText}>In Stock - {mockProduct.stock} units available</span>
            </div>
          ) : (
            <div style={{ ...styles.stockInfo, backgroundColor: "#fee2e2", borderColor: "#fecaca" }}>
              <span style={{ ...styles.stockText, color: "#991b1b" }}>Out of Stock</span>
            </div>
          )}

          {/* Quantity Selector */}
          <div style={styles.quantitySection}>
            <label style={styles.quantityLabel}>Quantity (Minimum: {mockProduct.moq})</label>
            <div style={styles.quantitySelector}>
              <button
                style={styles.quantityButton}
                onClick={() => setQuantity(Math.max(mockProduct.moq, quantity - 1))}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.quantityButtonHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, { borderColor: "#e5e7eb", backgroundColor: "#f3f4f6", color: "#111827" })}
              >
                −
              </button>
              <input
                type="number"
                min={mockProduct.moq}
                value={quantity}
                onChange={handleQuantityChange}
                style={styles.quantityInput}
                onFocus={(e) => Object.assign(e.target.style, styles.quantityInputFocus)}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: "#e5e7eb", boxShadow: "none" })}
              />
              <button
                style={styles.quantityButton}
                onClick={() => setQuantity(quantity + 1)}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.quantityButtonHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, { borderColor: "#e5e7eb", backgroundColor: "#f3f4f6", color: "#111827" })}
              >
                +
              </button>
              <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Current: ${currentTierPrice?.price || mockProduct.price}/unit
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ ...styles.actionButtons, ...(isMobile ? styles.actionButtonsMobile : {}) }}>
            <button
              style={styles.addToCartBtn}
              onClick={handleAddToCart}
              onMouseEnter={(e) => {
                if (quantity >= mockProduct.moq) {
                  Object.assign(e.target.style, styles.addToCartBtnHover)
                }
              }}
              onMouseLeave={(e) => {
                Object.assign(e.target.style, {
                  backgroundColor: "#1e293b",
                  transform: "none",
                  boxShadow: "none",
                })
              }}
              disabled={quantity < mockProduct.moq}
            >
              <FaShoppingCart />
              Add to Cart
            </button>
            <button
              style={styles.wishlistBtn}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.wishlistBtnHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: "#f3f4f6", borderColor: "#e5e7eb" })}
            >
              <FaHeart />
              Wishlist
            </button>
            <button
              style={styles.shareBtn}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.shareBtnHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: "#f3f4f6", borderColor: "#e5e7eb" })}
            >
              <FaShareAlt />
              Share
            </button>
          </div>

          {/* Features */}
          <div style={{ ...styles.featuresSection, ...(isMobile ? styles.featuresMobile : {}) }}>
            <div style={styles.featureCard}>
              <FaTruck style={styles.featureIcon} />
              <h4 style={styles.featureTitle}>Fast Shipping</h4>
              <p style={styles.featureDesc}>Worldwide delivery available</p>
            </div>
            <div style={styles.featureCard}>
              <FaUndo style={styles.featureIcon} />
              <h4 style={styles.featureTitle}>Easy Returns</h4>
              <p style={styles.featureDesc}>30-day return policy</p>
            </div>
            <div style={styles.featureCard}>
              <FaLock style={styles.featureIcon} />
              <h4 style={styles.featureTitle}>Secure Payment</h4>
              <p style={styles.featureDesc}>100% secure transactions</p>
            </div>
          </div>

          {/* Collapsible Sections */}
          <div>
            <button
              style={{
                ...styles.collapsibleHeader,
                marginBottom: expandedSection === "details" ? 0 : "0.5rem",
              }}
              onClick={() => setExpandedSection(expandedSection === "details" ? null : "details")}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.collapsibleHeaderHover)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#f9fafb")}
            >
              <span>Detailed Information</span>
              {expandedSection === "details" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedSection === "details" && (
              <div style={styles.collapsibleContent}>
                <p style={styles.collapsibleText}>
                  This is a premium collectible fashion doll designed for wholesale retailers. Each unit comes individually packaged with protective foam and packaging. Ideal for gift shops, toy boutiques, and collectible stores. Bulk orders of 200+ units receive additional 5% discount.
                </p>
              </div>
            )}
          </div>

          <div>
            <button
              style={{
                ...styles.collapsibleHeader,
                marginBottom: expandedSection === "shipping" ? 0 : "0.5rem",
              }}
              onClick={() => setExpandedSection(expandedSection === "shipping" ? null : "shipping")}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.collapsibleHeaderHover)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#f9fafb")}
            >
              <span>
                <FaBox style={{ marginRight: "0.5rem" }} />
                Shipping & Delivery
              </span>
              {expandedSection === "shipping" ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedSection === "shipping" && (
              <div style={styles.collapsibleContent}>
                <p style={styles.collapsibleText}>
                  We ship worldwide with various carrier options. Standard shipping takes 7-14 business days. Express shipping is available for urgent orders. All packages are insured and tracked. Customs duties may apply for international orders.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
