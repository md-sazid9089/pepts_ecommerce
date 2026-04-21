import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaTrash,
  FaChevronRight,
  FaMinus,
  FaPlus,
  FaBox,
  FaTruck,
  FaTag,
  FaArrowLeft,
  FaCheck,
  FaLock,
} from "react-icons/fa"

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "#f9fafb",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },

  // Header
  header: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    padding: "1.5rem 2rem",
  },
  headerContent: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "1rem",
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
  pageTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },

  // Main Container
  mainContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "2rem",
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "2rem",
  },
  mainContainerMobile: {
    gridTemplateColumns: "1fr",
    gap: "1.5rem",
    padding: "1rem",
  },

  // Cart Items Section
  cartItemsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  // Cart Item
  cartItem: {
    display: "grid",
    gridTemplateColumns: "100px 1fr",
    gap: "1rem",
    padding: "1.5rem",
    backgroundColor: "#ffffff",
    borderRadius: "0.75rem",
    border: "1px solid #e5e7eb",
    transition: "all 0.2s ease",
  },
  cartItemHover: {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    borderColor: "#d1d5db",
  },

  cartItemImage: {
    width: "100px",
    height: "100px",
    borderRadius: "0.5rem",
    objectFit: "cover",
    backgroundColor: "#f3f4f6",
  },

  cartItemDetails: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "1rem",
    alignItems: "flex-start",
  },

  cartItemInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  cartItemBrand: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
    margin: 0,
  },

  cartItemName: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#111827",
    margin: 0,
    lineHeight: 1.4,
  },

  cartItemCode: {
    fontSize: "0.8rem",
    color: "#9ca3af",
    margin: 0,
  },

  cartItemMeta: {
    display: "flex",
    gap: "1.5rem",
    fontSize: "0.875rem",
    color: "#6b7280",
  },

  cartItemPriceSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "1rem",
  },

  cartItemPrice: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#111827",
  },

  cartItemOriginalPrice: {
    fontSize: "0.875rem",
    color: "#9ca3af",
    textDecoration: "line-through",
  },

  cartItemActions: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    alignItems: "flex-end",
  },

  quantityControl: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.375rem",
    padding: "0.25rem",
    backgroundColor: "#f9fafb",
  },

  quantityBtn: {
    width: "1.75rem",
    height: "1.75rem",
    border: "none",
    background: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#111827",
    fontSize: "0.75rem",
    fontWeight: 600,
    transition: "all 0.2s ease",
  },
  quantityBtnHover: {
    color: "#1e293b",
    backgroundColor: "#e5e7eb",
  },

  quantityDisplay: {
    width: "2rem",
    textAlign: "center",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#111827",
  },

  removeBtn: {
    background: "none",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: 500,
    transition: "color 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: 0,
  },
  removeBtnHover: {
    color: "#dc2626",
  },

  // Empty State
  emptyState: {
    padding: "3rem 1.5rem",
    backgroundColor: "#ffffff",
    borderRadius: "0.75rem",
    textAlign: "center",
    border: "1px solid #e5e7eb",
  },
  emptyStateIcon: {
    fontSize: "3rem",
    color: "#d1d5db",
    marginBottom: "1rem",
  },
  emptyStateTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#111827",
    margin: "0 0 0.5rem 0",
  },
  emptyStateText: {
    fontSize: "0.95rem",
    color: "#6b7280",
    margin: "0 0 1.5rem 0",
  },
  emptyStateBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#1e293b",
    color: "#ffffff",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  emptyStateBtnHover: {
    backgroundColor: "#0f172a",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(30, 41, 59, 0.3)",
  },

  // Sidebar
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  // Summary Card
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: "0.75rem",
    padding: "1.5rem",
    border: "1px solid #e5e7eb",
  },

  summaryTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 1.5rem 0",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 0",
    fontSize: "0.875rem",
    color: "#6b7280",
    borderBottom: "1px solid #e5e7eb",
  },

  summaryRowLast: {
    borderBottom: "none",
  },

  summaryRowLabel: {
    color: "#6b7280",
  },

  summaryRowValue: {
    color: "#111827",
    fontWeight: 500,
  },

  summaryTotal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 0",
    marginTop: "1rem",
    paddingTop: "1rem",
    borderTop: "2px solid #e5e7eb",
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "#111827",
  },

  summaryTotalLabel: {
    color: "#111827",
  },

  summaryTotalValue: {
    color: "#1e293b",
  },

  // Promo Code
  promoSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  promoLabel: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#111827",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    margin: 0,
  },

  promoInputWrapper: {
    display: "flex",
    gap: "0.5rem",
  },

  promoInput: {
    flex: 1,
    padding: "0.625rem 0.75rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  promoInputFocus: {
    borderColor: "#1e293b",
    boxShadow: "0 0 0 3px rgba(30, 41, 59, 0.1)",
  },

  promoBtn: {
    padding: "0.625rem 1rem",
    backgroundColor: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "0.375rem",
    color: "#111827",
    fontWeight: 600,
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  promoBtnHover: {
    backgroundColor: "#e5e7eb",
    borderColor: "#d1d5db",
  },

  // Action Buttons
  actionButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  checkoutBtn: {
    width: "100%",
    padding: "0.875rem",
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
  checkoutBtnHover: {
    backgroundColor: "#0f172a",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(30, 41, 59, 0.3)",
  },

  continuShoppingBtn: {
    width: "100%",
    padding: "0.875rem",
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
    justifyContent: "center",
    gap: "0.5rem",
    fontFamily: "inherit",
  },
  continuShoppingBtnHover: {
    backgroundColor: "#e5e7eb",
    borderColor: "#d1d5db",
  },

  // Trust Badges
  trustBadges: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  badge: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem",
    backgroundColor: "#f0fdf4",
    border: "1px solid #dcfce7",
    borderRadius: "0.375rem",
    fontSize: "0.8rem",
    color: "#166534",
  },

  badgeIcon: {
    fontSize: "1rem",
    color: "#16a34a",
    flexShrink: 0,
  },

  // Recommendations
  recommendationsSection: {
    marginTop: "3rem",
    paddingTop: "2rem",
    borderTop: "2px solid #e5e7eb",
  },

  recommendationsTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 1.5rem 0",
  },

  recommendationsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1.5rem",
  },

  recommendationCard: {
    backgroundColor: "#ffffff",
    borderRadius: "0.75rem",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    transition: "all 0.2s ease",
  },

  recommendationCardHover: {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    transform: "translateY(-2px)",
  },

  recommendationImage: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    backgroundColor: "#f3f4f6",
  },

  recommendationInfo: {
    padding: "1rem",
  },

  recommendationName: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#111827",
    margin: "0 0 0.5rem 0",
    lineHeight: 1.4,
  },

  recommendationPrice: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#1e293b",
  },

  recommendationBtn: {
    width: "100%",
    padding: "0.5rem",
    marginTop: "0.75rem",
    backgroundColor: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "0.375rem",
    color: "#111827",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  recommendationBtnHover: {
    backgroundColor: "#e5e7eb",
    borderColor: "#d1d5db",
  },
}

// Mock cart data
const initialCartItems = [
  {
    id: 1,
    name: "Premium Fashion Doll Collection - Assorted Series A",
    brand: "PreciousPlay",
    code: "PFD-2024-001",
    price: 850,
    originalPrice: 1200,
    quantity: 10,
    image: "https://placehold.co/100?text=Doll+1",
  },
  {
    id: 2,
    name: "Vintage Romance Doll Series - Limited Edition",
    brand: "DollMasters",
    code: "VRD-2024-002",
    price: 1250,
    originalPrice: 1800,
    quantity: 5,
    image: "https://placehold.co/100?text=Doll+2",
  },
]

// Mock recommendations
const recommendedProducts = [
  {
    id: 3,
    name: "Contemporary Style Doll",
    price: 720,
    image: "https://placehold.co/200?text=Doll+3",
  },
  {
    id: 4,
    name: "Modern Collection Doll",
    price: 650,
    image: "https://placehold.co/200?text=Doll+4",
  },
  {
    id: 5,
    name: "Premium Vintage Doll",
    price: 950,
    image: "https://placehold.co/200?text=Doll+5",
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [promoCode, setPromoCode] = useState("")
  const [hoveredItem, setHoveredItem] = useState(null)
  const navigate = useNavigate()
  const isMobile = window.innerWidth < 768

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 50
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const handlePromoApply = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
      alert("Promo code applied! 10% discount")
      setPromoCode("")
    } else {
      alert("Invalid promo code")
    }
  }

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.breadcrumb}>
            <span
              style={styles.breadcrumbLink}
              onClick={() => navigate("/")}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.breadcrumbLinkHover)}
              onMouseLeave={(e) => (e.target.style.color = "#1e293b")}
            >
              Home
            </span>
            <FaChevronRight style={{ fontSize: "0.625rem", color: "#d1d5db" }} />
            <span style={styles.breadcrumbActive}>Shopping Cart</span>
          </div>
          <h1 style={styles.pageTitle}>Shopping Cart</h1>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ ...styles.mainContainer, ...(isMobile ? styles.mainContainerMobile : {}) }}>
        {/* Cart Items */}
        <div style={styles.cartItemsSection}>
          {cartItems.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateIcon}>
                <FaBox />
              </div>
              <h2 style={styles.emptyStateTitle}>Your cart is empty</h2>
              <p style={styles.emptyStateText}>Add items to your cart to get started</p>
              <button
                style={styles.emptyStateBtn}
                onClick={() => navigate("/products")}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.emptyStateBtnHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: "#1e293b", transform: "none", boxShadow: "none" })}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  ...styles.cartItem,
                  ...(hoveredItem === item.id ? styles.cartItemHover : {}),
                }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <img src={item.image} alt={item.name} style={styles.cartItemImage} />

                <div style={styles.cartItemDetails}>
                  <div style={styles.cartItemInfo}>
                    <p style={styles.cartItemBrand}>{item.brand}</p>
                    <h3 style={styles.cartItemName}>{item.name}</h3>
                    <p style={styles.cartItemCode}>SKU: {item.code}</p>
                    <div style={styles.cartItemMeta}>
                      <span>${item.price} per unit</span>
                      <span>Stock: Limited</span>
                    </div>
                  </div>

                  <div style={styles.cartItemPriceSection}>
                    <div style={styles.cartItemPrice}>${(item.price * item.quantity).toLocaleString()}</div>
                    {item.originalPrice > item.price && (
                      <div style={styles.cartItemOriginalPrice}>${(item.originalPrice * item.quantity).toLocaleString()}</div>
                    )}

                    <div style={styles.cartItemActions}>
                      <div style={styles.quantityControl}>
                        <button
                          style={styles.quantityBtn}
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          onMouseEnter={(e) => Object.assign(e.target.style, styles.quantityBtnHover)}
                          onMouseLeave={(e) => Object.assign(e.target.style, { color: "#111827", backgroundColor: "transparent" })}
                        >
                          <FaMinus />
                        </button>
                        <span style={styles.quantityDisplay}>{item.quantity}</span>
                        <button
                          style={styles.quantityBtn}
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          onMouseEnter={(e) => Object.assign(e.target.style, styles.quantityBtnHover)}
                          onMouseLeave={(e) => Object.assign(e.target.style, { color: "#111827", backgroundColor: "transparent" })}
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <button
                        style={styles.removeBtn}
                        onClick={() => handleRemoveItem(item.id)}
                        onMouseEnter={(e) => Object.assign(e.target.style, styles.removeBtnHover)}
                        onMouseLeave={(e) => (e.target.style.color = "#ef4444")}
                      >
                        <FaTrash style={{ fontSize: "0.75rem" }} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        {cartItems.length > 0 && (
          <div style={styles.sidebar}>
            {/* Order Summary */}
            <div style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>Order Summary</h3>

              <div style={styles.summaryRow}>
                <span style={styles.summaryRowLabel}>Subtotal</span>
                <span style={styles.summaryRowValue}>${subtotal.toLocaleString()}</span>
              </div>

              <div style={styles.summaryRow}>
                <span style={styles.summaryRowLabel}>Shipping</span>
                <span style={styles.summaryRowValue}>
                  {shipping === 0 ? "FREE" : "$" + shipping}
                </span>
              </div>

              <div style={styles.summaryRow}>
                <span style={styles.summaryRowLabel}>Tax (10%)</span>
                <span style={styles.summaryRowValue}>${tax.toFixed(2)}</span>
              </div>

              <div style={styles.summaryTotal}>
                <span style={styles.summaryTotalLabel}>Total</span>
                <span style={styles.summaryTotalValue}>${total.toLocaleString()}</span>
              </div>

              {subtotal <= 500 && (
                <p style={{ fontSize: "0.8rem", color: "#10b981", marginTop: "1rem", margin: "1rem 0 0 0" }}>
                  ✓ Free shipping over $500
                </p>
              )}
            </div>

            {/* Promo Code */}
            <div style={styles.summaryCard}>
              <label style={styles.promoLabel}>
                <FaTag />
                Promo Code
              </label>
              <div style={styles.promoInputWrapper}>
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={styles.promoInput}
                  onFocus={(e) => Object.assign(e.target.style, styles.promoInputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, { borderColor: "#e5e7eb", boxShadow: "none" })}
                  onKeyPress={(e) => e.key === "Enter" && handlePromoApply()}
                />
                <button
                  style={styles.promoBtn}
                  onClick={handlePromoApply}
                  onMouseEnter={(e) => Object.assign(e.target.style, styles.promoBtnHover)}
                  onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: "#f3f4f6", borderColor: "#e5e7eb" })}
                >
                  Apply
                </button>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0.5rem 0 0 0" }}>
                Try: SAVE10
              </p>
            </div>

            {/* Action Buttons */}
            <div style={styles.actionButtons}>
              <button
                style={styles.checkoutBtn}
                onClick={() => navigate("/checkout")}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.checkoutBtnHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: "#1e293b", transform: "none", boxShadow: "none" })}
              >
                <FaLock style={{ fontSize: "0.875rem" }} />
                Proceed to Checkout
              </button>

              <button
                style={styles.continuShoppingBtn}
                onClick={() => navigate("/products")}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.continuShoppingBtnHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: "#f3f4f6", borderColor: "#e5e7eb" })}
              >
                <FaArrowLeft style={{ fontSize: "0.875rem" }} />
                Continue Shopping
              </button>
            </div>

            {/* Trust Badges */}
            <div style={styles.trustBadges}>
              <div style={styles.badge}>
                <FaCheck style={styles.badgeIcon} />
                <span>Secure checkout</span>
              </div>
              <div style={styles.badge}>
                <FaTruck style={styles.badgeIcon} />
                <span>Free shipping over $500</span>
              </div>
              <div style={styles.badge}>
                <FaLock style={styles.badgeIcon} />
                <span>Money-back guarantee</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {cartItems.length > 0 && (
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem", ...(!isMobile && { padding: "0 2rem" }) }}>
          <div style={styles.recommendationsSection}>
            <h2 style={styles.recommendationsTitle}>Frequently Bought Together</h2>
            <div style={styles.recommendationsGrid}>
              {recommendedProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    ...styles.recommendationCard,
                  }}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.recommendationCardHover)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, { boxShadow: "none", transform: "none" })}
                >
                  <img src={product.image} alt={product.name} style={styles.recommendationImage} />
                  <div style={styles.recommendationInfo}>
                    <h4 style={styles.recommendationName}>{product.name}</h4>
                    <div style={styles.recommendationPrice}>${product.price}</div>
                    <button
                      style={styles.recommendationBtn}
                      onMouseEnter={(e) => Object.assign(e.target.style, styles.recommendationBtnHover)}
                      onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: "#f3f4f6", borderColor: "#e5e7eb" })}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
