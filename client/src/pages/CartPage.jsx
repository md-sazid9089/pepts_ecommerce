import { useState, useEffect, useMemo, useCallback } from "react"
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

  requestQuoteBtn: {
    width: "100%",
    padding: "0.875rem",
    backgroundColor: "#f59e0b",
    color: "#111827",
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
  requestQuoteBtnHover: {
    backgroundColor: "#d97706",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(217, 119, 6, 0.2)",
  },

  addMoreBtn: {
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
  addMoreBtnHover: {
    backgroundColor: "#e5e7eb",
    borderColor: "#d1d5db",
  },

  orderNoteSection: {
    marginTop: "1.5rem",
    padding: "1rem",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "0.75rem",
  },
  orderNoteLabel: {
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "0.75rem",
    display: "block",
  },
  orderNoteTextarea: {
    width: "100%",
    minHeight: "100px",
    borderRadius: "0.65rem",
    border: "1px solid #e5e7eb",
    padding: "0.85rem 1rem",
    fontSize: "0.95rem",
    color: "#111827",
    fontFamily: "inherit",
    resize: "vertical",
  },
  quoteSuccess: {
    backgroundColor: "#ecfdf5",
    color: "#166534",
    border: "1px solid #d1fae5",
    padding: "1rem",
    borderRadius: "0.75rem",
    marginTop: "1rem",
  },
  mobileStickyBar: {
    display: "none",
  },
  mobileStickyBarShow: {
    display: "flex",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    padding: "1rem 1rem 1.25rem",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e5e7eb",
    justifyContent: "space-between",
    gap: "0.75rem",
    boxShadow: "0 -10px 30px rgba(15, 23, 42, 0.08)",
  },
  mobileStickyButton: {
    flex: 1,
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
    name: "Custom Plush Doll Toy - Soft Stuffed Animal",
    brand: "PEPTA Wholesale",
    code: "PLSH-001",
    price: 4.8,
    originalPrice: 5.4,
    quantity: 500,
    unit: "Piece",
    moq: 100,
    images: ["https://placehold.co/100?text=Doll+1"],
    tieredPricing: [
      { min: 100, max: 299, price: 4.8 },
      { min: 300, max: 599, price: 4.5 },
      { min: 600, max: null, price: 4.2 },
    ],
  },
  {
    id: 2,
    name: "Dinosaur Plush Toy - Wholesale Bulk Set",
    brand: "PEPTA Wholesale",
    code: "DIN-003",
    price: 3.5,
    originalPrice: 4.2,
    quantity: 300,
    unit: "Piece",
    moq: 50,
    images: ["https://placehold.co/100?text=Dino+Toy"],
    tieredPricing: [
      { min: 50, max: 199, price: 3.5 },
      { min: 200, max: 499, price: 3.2 },
      { min: 500, max: null, price: 2.9 },
    ],
  },
]

const calculateTieredPrice = (item) => {
  if (!item.tieredPricing) return item.price
  const tier = item.tieredPricing.find((tier) => item.quantity >= tier.min && (tier.max === null || item.quantity <= tier.max))
  return tier ? tier.price : item.price
}

const formatCurrency = (value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const estimateShipping = (subtotal, itemCount) => {
  if (subtotal >= 3000) return 0
  if (subtotal >= 1500) return 80
  return 120
}

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
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoMessage, setPromoMessage] = useState("")
  const [hoveredItem, setHoveredItem] = useState(null)
  const [orderNote, setOrderNote] = useState("")
  const [quoteMessage, setQuoteMessage] = useState("")
  const [requestingQuote, setRequestingQuote] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const getItemUnitPrice = useCallback((item) => calculateTieredPrice(item), [])
  const getItemTotal = useCallback((item) => getItemUnitPrice(item) * item.quantity, [getItemUnitPrice])

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + getItemTotal(item), 0),
    [cartItems, getItemTotal]
  )

  const shipping = useMemo(() => estimateShipping(subtotal, cartItems.length), [subtotal, cartItems.length])
  const tax = useMemo(() => subtotal * 0.08, [subtotal])
  const promoDiscountAmount = useMemo(() => subtotal * promoDiscount, [subtotal, promoDiscount])
  const total = useMemo(() => subtotal + shipping + tax - promoDiscountAmount, [subtotal, shipping, tax, promoDiscountAmount])
  const totalSavings = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.originalPrice - getItemUnitPrice(item)) * item.quantity, 0),
    [cartItems, getItemUnitPrice]
  )
  const hasMoQViolations = useMemo(
    () => cartItems.some((item) => item.moq && item.quantity < item.moq),
    [cartItems]
  )

  const handleUpdateQuantity = useCallback(
    (id, quantity) => {
      if (quantity <= 0) return
      setCartItems((current) => current.map((item) => (item.id === id ? { ...item, quantity } : item)))
    },
    []
  )

  const handleRequestQuote = useCallback(() => {
    setRequestingQuote(true)
    setQuoteMessage("Quote request submitted successfully. Our wholesale team will contact you within 24 hours.")
  }, [])

  const handleRemoveItem = useCallback((id) => {
    setCartItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const handlePromoApply = useCallback(() => {
    const code = promoCode.trim().toUpperCase()
    if (code === "SAVE10") {
      setPromoDiscount(0.1)
      setPromoMessage("10% wholesale discount applied.")
      setPromoCode("")
    } else if (!code) {
      setPromoMessage("Enter a valid promo code.")
    } else {
      setPromoMessage("Promo code invalid.")
      setPromoDiscount(0)
    }
  }, [promoCode])

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
            <span style={styles.breadcrumbActive}>Wholesale Cart</span>
          </div>
          <h1 style={styles.pageTitle}>Wholesale Order Summary</h1>
          <p style={{ marginTop: "0.75rem", color: "#475569", maxWidth: "760px", fontSize: "0.95rem" }}>
            Manage your MOQ-driven cart, verify bulk discounts, and request a custom quote before finalizing your order.
            Adjust quantities to meet supplier minimums and keep the purchasing flow flexible.
          </p>
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
              <p style={styles.emptyStateText}>Add wholesale products to your cart to begin building an order.</p>
              <button
                style={styles.emptyStateBtn}
                onClick={() => navigate("/products")}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.emptyStateBtnHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: "#1e293b", transform: "none", boxShadow: "none" })}
              >
                Add More Items
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const unitPrice = getItemUnitPrice(item)
              const itemTotal = getItemTotal(item)
              const tierSavings = (item.originalPrice - unitPrice) * item.quantity

              return (
                <div
                  key={item.id}
                  style={{
                    ...styles.cartItem,
                    ...(hoveredItem === item.id ? styles.cartItemHover : {}),
                  }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <img src={item.images[0]} alt={item.name} style={styles.cartItemImage} />

                  <div style={styles.cartItemDetails}>
                    <div style={styles.cartItemInfo}>
                      <p style={styles.cartItemBrand}>{item.brand}</p>
                      <h3 style={styles.cartItemName}>{item.name}</h3>
                      <p style={styles.cartItemCode}>SKU: {item.code}</p>
                      <div style={styles.cartItemMeta}>
                        <span>{item.unit} / {formatCurrency(unitPrice)}</span>
                        <span>MOQ: {item.moq}</span>
                      </div>
                      {item.quantity < item.moq && (
                        <p style={{ color: "#b45309", fontSize: "0.875rem", margin: "0.5rem 0 0 0" }}>
                          ⚠ MOQ not met. Add {item.moq - item.quantity} more units.
                        </p>
                      )}
                    </div>

                    <div style={styles.cartItemPriceSection}>
                      <div style={styles.cartItemPrice}>{formatCurrency(itemTotal)}</div>
                      {tierSavings > 0 && (
                        <div style={styles.cartItemOriginalPrice}>Save {formatCurrency(tierSavings)}</div>
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
              )
            })
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
                <span style={styles.summaryRowValue}>{formatCurrency(subtotal)}</span>
              </div>

              <div style={styles.summaryRow}>
                <span style={styles.summaryRowLabel}>Estimated Shipping</span>
                <span style={styles.summaryRowValue}>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
              </div>

              <div style={styles.summaryRow}>
                <span style={styles.summaryRowLabel}>Business Tax (8%)</span>
                <span style={styles.summaryRowValue}>{formatCurrency(tax)}</span>
              </div>

              {totalSavings > 0 && (
                <div style={styles.summaryRow}>
                  <span style={styles.summaryRowLabel}>Bulk Discount Savings</span>
                  <span style={styles.summaryRowValue}>-{formatCurrency(totalSavings)}</span>
                </div>
              )}

              {promoDiscountAmount > 0 && (
                <div style={styles.summaryRow}>
                  <span style={styles.summaryRowLabel}>Promotional Discount</span>
                  <span style={styles.summaryRowValue}>-{formatCurrency(promoDiscountAmount)}</span>
                </div>
              )}

              <div style={styles.summaryTotal}>
                <span style={styles.summaryTotalLabel}>Order Total</span>
                <span style={styles.summaryTotalValue}>{formatCurrency(total)}</span>
              </div>

              <p style={{ fontSize: "0.875rem", color: "#475569", marginTop: "1rem" }}>
                Free shipping for orders over $3,000. Estimated shipping based on order volume.
              </p>

              {hasMoQViolations && (
                <p style={{ fontSize: "0.9rem", color: "#b45309", marginTop: "1rem", fontWeight: 600 }}>
                  Some items are below the MOQ. Increase quantities or request a quote.
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
              <p style={{ fontSize: "0.85rem", color: promoDiscount > 0 ? "#166534" : "#6b7280", margin: "0.75rem 0 0 0" }}>
                {promoMessage || "Try: SAVE10"}
              </p>
            </div>

            <div style={styles.orderNoteSection}>
              <label style={styles.orderNoteLabel} htmlFor="orderNote">
                Add Order Note (Optional)
              </label>
              <textarea
                id="orderNote"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                style={styles.orderNoteTextarea}
                placeholder="Add special packaging requests, delivery timelines, or sample requirements."
              />
            </div>

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
                style={styles.requestQuoteBtn}
                onClick={handleRequestQuote}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.requestQuoteBtnHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: "#f59e0b", transform: "none", boxShadow: "none" })}
              >
                <FaTruck style={{ fontSize: "0.875rem" }} />
                Request a Quote
              </button>

              <button
                style={styles.addMoreBtn}
                onClick={() => navigate("/products")}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.addMoreBtnHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, { backgroundColor: "#f3f4f6", borderColor: "#e5e7eb" })}
              >
                <FaPlus style={{ fontSize: "0.875rem" }} />
                Add More Items
              </button>
            </div>

            {requestingQuote && quoteMessage && (
              <div style={styles.quoteSuccess}>
                {quoteMessage}
              </div>
            )}

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

      {isMobile && cartItems.length > 0 && (
        <div style={{ ...styles.mobileStickyBar, ...(isMobile ? styles.mobileStickyBarShow : {}) }}>
          <button
            style={{ ...styles.checkoutBtn, ...styles.mobileStickyButton }}
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
          <button
            style={{ ...styles.requestQuoteBtn, ...styles.mobileStickyButton }}
            onClick={handleRequestQuote}
          >
            Request a Quote
          </button>
        </div>
      )}

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
