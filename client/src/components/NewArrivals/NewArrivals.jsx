import { useState } from "react"
import { FiStar, FiShoppingCart, FiHeart } from "react-icons/fi"
import { products } from "../../data/mock/products"

const colors = {
  darkBrown: "#4A3535",
  logoBrown: "#5A3D3D",
  logoOrange: "#5A3D3D",
  lightBg: "#F9F5F3",
  white: "#FFFFFF",
  mutedBrown: "#867671",
  lightGray: "#E8E3E0",
}

const styles = {
  container: {
    backgroundColor: colors.white,
    padding: "4rem 2rem",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  headerSection: {
    textAlign: "center",
    marginBottom: "3rem",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: colors.darkBrown,
    margin: 0,
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1rem",
    color: colors.mutedBrown,
    margin: 0,
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "2rem",
  },
  productCard: {
    backgroundColor: colors.lightBg,
    borderRadius: "0.5rem",
    overflow: "hidden",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  productCardHover: {
    boxShadow: "0 8px 24px rgba(74, 53, 53, 0.15)",
    transform: "translateY(-4px)",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "250px",
    backgroundColor: "#f5f5f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  newBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: colors.logoOrange,
    color: colors.white,
    padding: "0.375rem 0.75rem",
    borderRadius: "0.25rem",
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    zIndex: 10,
  },
  discountBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    backgroundColor: colors.darkBrown,
    color: colors.white,
    padding: "0.375rem 0.75rem",
    borderRadius: "0.25rem",
    fontSize: "0.75rem",
    fontWeight: 700,
    zIndex: 10,
  },
  productInfo: {
    padding: "1.25rem",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  brand: {
    fontSize: "0.75rem",
    color: colors.mutedBrown,
    textTransform: "uppercase",
    fontWeight: 600,
    letterSpacing: "0.5px",
    marginBottom: "0.375rem",
  },
  productName: {
    fontSize: "1rem",
    fontWeight: 600,
    color: colors.darkBrown,
    margin: 0,
    marginBottom: "0.75rem",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  ratingSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.75rem",
  },
  stars: {
    display: "flex",
    gap: "0.25rem",
    color: colors.logoOrange,
  },
  ratingText: {
    fontSize: "0.875rem",
    color: colors.mutedBrown,
  },
  priceSection: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.75rem",
    marginBottom: "1rem",
    marginTop: "auto",
  },
  price: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: colors.logoOrange,
  },
  originalPrice: {
    fontSize: "1rem",
    color: colors.mutedBrown,
    textDecoration: "line-through",
  },
  actionButtons: {
    display: "flex",
    gap: "0.75rem",
  },
  addToCartBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem",
    backgroundColor: colors.darkBrown,
    color: colors.white,
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  addToCartBtnHover: {
    backgroundColor: colors.logoBrown,
  },
  wishlistBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "48px",
    height: "48px",
    padding: 0,
    backgroundColor: colors.white,
    color: colors.darkBrown,
    border: `2px solid ${colors.lightGray}`,
    borderRadius: "0.375rem",
    fontSize: "1.2rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  wishlistBtnHover: {
    borderColor: colors.logoOrange,
    color: colors.logoOrange,
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem 2rem",
    color: colors.mutedBrown,
  },
}

export default function NewArrivals() {
  const [hoveredCard, setHoveredCard] = useState(null)
  const [hoveredButtons, setHoveredButtons] = useState({})

  const newProducts = products.filter((product) => product.isNew).slice(0, 4)

  const handleAddToCart = (productId) => {
    // Add to cart logic
  }

  const handleWishlist = (productId) => {
    // Add to wishlist logic
  }

  const renderStars = (rating) => {
    return (
      <div style={styles.stars}>
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            size={16}
            fill={i < Math.floor(rating) ? colors.logoOrange : "transparent"}
            color={colors.logoOrange}
          />
        ))}
      </div>
    )
  }

  if (newProducts.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.headerSection}>
          <h2 style={styles.title}>New Arrivals</h2>
          <p style={styles.subtitle}>Discover our latest products</p>
        </div>
        <div style={styles.emptyState}>
          <p>No new products at the moment. Check back soon!</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.headerSection}>
        <h2 style={styles.title}>New Arrivals</h2>
        <p style={styles.subtitle}>Discover our latest premium products</p>
      </div>

      {/* Products Grid */}
      <div style={styles.productsGrid}>
        {newProducts.map((product) => (
          <div
            key={product.id}
            style={{
              ...styles.productCard,
              ...(hoveredCard === product.id ? styles.productCardHover : {}),
            }}
            onMouseEnter={() => setHoveredCard(product.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Image Container */}
            <div style={styles.imageContainer}>
              <img
                src={product.image}
                alt={product.name}
                style={styles.productImage}
              />
              {product.isNew && <div style={styles.newBadge}>New</div>}
              {product.discount > 0 && (
                <div style={styles.discountBadge}>-{product.discount}%</div>
              )}
            </div>

            {/* Product Info */}
            <div style={styles.productInfo}>
              <p style={styles.brand}>{product.brand}</p>
              <h3 style={styles.productName}>{product.name}</h3>

              {/* Rating */}
              <div style={styles.ratingSection}>
                {renderStars(product.rating)}
                <span style={styles.ratingText}>
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div style={styles.priceSection}>
                <span style={styles.price}>₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span style={styles.originalPrice}>
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div style={styles.actionButtons}>
                <button
                  style={{
                    ...styles.addToCartBtn,
                    ...(hoveredButtons[`cart-${product.id}`]
                      ? styles.addToCartBtnHover
                      : {}),
                  }}
                  onMouseEnter={() =>
                    setHoveredButtons({
                      ...hoveredButtons,
                      [`cart-${product.id}`]: true,
                    })
                  }
                  onMouseLeave={() =>
                    setHoveredButtons({
                      ...hoveredButtons,
                      [`cart-${product.id}`]: false,
                    })
                  }
                  onClick={() => handleAddToCart(product.id)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <FiShoppingCart size={18} />
                  <span>Add</span>
                </button>
                <button
                  style={{
                    ...styles.wishlistBtn,
                    ...(hoveredButtons[`wish-${product.id}`]
                      ? styles.wishlistBtnHover
                      : {}),
                  }}
                  onMouseEnter={() =>
                    setHoveredButtons({
                      ...hoveredButtons,
                      [`wish-${product.id}`]: true,
                    })
                  }
                  onMouseLeave={() =>
                    setHoveredButtons({
                      ...hoveredButtons,
                      [`wish-${product.id}`]: false,
                    })
                  }
                  onClick={() => handleWishlist(product.id)}
                  aria-label={`Add ${product.name} to wishlist`}
                >
                  <FiHeart size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
