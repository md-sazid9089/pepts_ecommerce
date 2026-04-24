import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaTruck,
  FaComment,
  FaCheck,
} from "react-icons/fa"
import { getProductById } from "@/data/queries/productQueries"

const styles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  breadcrumb: {
    padding: "1rem 2rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
    color: "#475569",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
  },
  breadcrumbLink: {
    color: "#0f172a",
    cursor: "pointer",
  },
  breadcrumbActive: {
    color: "#475569",
  },
  header: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "1.75rem 2rem 0",
  },
  headerTitle: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 700,
    lineHeight: 1.05,
  },
  headerText: {
    margin: "1rem 0 0",
    maxWidth: "760px",
    color: "#64748b",
    fontSize: "1rem",
    lineHeight: 1.75,
  },
  layout: {
    maxWidth: "1800px",
    margin: "0 auto 3rem",
    padding: "0 2rem",
    display: "grid",
    gridTemplateColumns: "1.55fr 0.7fr",
    gap: "2rem",
  },
  layoutMobile: {
    gridTemplateColumns: "1fr",
    padding: "0 1rem",
    gap: "1.5rem",
  },
  galleryCard: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  imageCard: {
    position: "relative",
    backgroundColor: "#ffffff",
    borderRadius: "1rem",
    overflow: "hidden",
    minHeight: "420px",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imageBadge: {
    position: "absolute",
    top: "1rem",
    left: "1rem",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "0.65rem 1rem",
    fontSize: "0.8rem",
    fontWeight: 700,
  },
  carouselControl: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "2.75rem",
    height: "2.75rem",
    borderRadius: "0.75rem",
    border: "1px solid rgba(15, 23, 42, 0.12)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    color: "#0f172a",
    boxShadow: "0 15px 30px rgba(15, 23, 42, 0.12)",
  },
  prevControl: {
    left: "1rem",
  },
  nextControl: {
    right: "1rem",
  },
  thumbRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "0.75rem",
  },
  thumbItem: {
    borderRadius: "0.85rem",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    minHeight: "100px",
    cursor: "pointer",
  },
  thumbItemActive: {
    borderColor: "#0f172a",
    boxShadow: "0 0 0 1px rgba(15, 23, 42, 0.08)",
  },
  thumbImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  productPanel: {
    backgroundColor: "#ffffff",
    borderRadius: "1rem",
    padding: "2rem",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  supplierStrip: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    alignItems: "center",
    justifyContent: "space-between",
  },
  supplierLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: "#ecfdf5",
    color: "#166534",
    padding: "0.5rem 0.85rem",
    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "0.85rem",
  },
  titleRow: {
    display: "grid",
    gap: "0.75rem",
  },
  title: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  subtitle: {
    margin: 0,
    color: "#475569",
    fontSize: "1rem",
    lineHeight: 1.8,
  },
  priceGroup: {
    display: "grid",
    gap: "0.75rem",
  },
  priceLabel: {
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    fontSize: "0.8rem",
    color: "#475569",
    fontWeight: 700,
  },
  priceValue: {
    fontSize: "2.5rem",
    fontWeight: 800,
    color: "#0f172a",
  },
  priceRange: {
    color: "#64748b",
    fontSize: "0.95rem",
  },
  moqBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.7rem 1rem",
    borderRadius: "999px",
    backgroundColor: "#ffedd5",
    color: "#c2410c",
    fontWeight: 700,
    width: "fit-content",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "0.75rem",
  },
  statCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "1rem",
    padding: "1rem",
    border: "1px solid #e2e8f0",
  },
  statLabel: {
    margin: 0,
    fontSize: "0.8rem",
    color: "#475569",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  statValue: {
    margin: "0.75rem 0 0",
    color: "#0f172a",
    fontSize: "1.1rem",
    fontWeight: 700,
  },
  richerActions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  richerActionsMobile: {
    gridTemplateColumns: "1fr",
  },
  primaryButton: {
    border: "none",
    borderRadius: "1rem",
    padding: "1rem 1.25rem",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  secondaryButton: {
    border: "1px solid #e2e8f0",
    borderRadius: "1rem",
    padding: "1rem 1.25rem",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  infoTabs: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "0.75rem",
  },
  tabButton: {
    border: "1px solid transparent",
    borderRadius: "0.85rem",
    padding: "0.85rem 0.9rem",
    backgroundColor: "#f8fafc",
    color: "#475569",
    fontSize: "0.9rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  tabButtonActive: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    borderColor: "#0f172a",
  },
  tabPanel: {
    marginTop: "1.5rem",
    padding: "1.75rem",
    backgroundColor: "#ffffff",
    borderRadius: "1rem",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)",
  },
  panelTitle: {
    margin: 0,
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  panelText: {
    marginTop: "1rem",
    color: "#475569",
    lineHeight: 1.8,
    fontSize: "0.95rem",
  },
  bulletList: {
    marginTop: "1rem",
    display: "grid",
    gap: "0.75rem",
  },
  bulletItem: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "flex-start",
  },
  bulletDot: {
    width: "0.65rem",
    height: "0.65rem",
    borderRadius: "999px",
    backgroundColor: "#0f172a",
    marginTop: "0.45rem",
    flexShrink: 0,
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  sidebarCard: {
    backgroundColor: "#ffffff",
    borderRadius: "1rem",
    padding: "1.75rem",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  sidebarTitle: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 700,
  },
  sidebarText: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "0.95rem",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    padding: "1rem 0",
    borderBottom: "1px solid #e2e8f0",
  },
  detailLabel: {
    color: "#475569",
    fontSize: "0.9rem",
    fontWeight: 700,
  },
  detailValue: {
    color: "#0f172a",
    fontSize: "0.95rem",
    fontWeight: 700,
    textAlign: "right",
  },
  stickyBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "0.85rem 1rem",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderTop: "1px solid #e2e8f0",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
    alignItems: "center",
    zIndex: 90,
  },
  stickyButton: {
    width: "100%",
    border: "none",
    borderRadius: "1rem",
    padding: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "0.95rem",
  },
  stickyPrimary: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
  },
  stickySecondary: {
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    border: "1px solid #e2e8f0",
  },
}

const tabItems = [
  { id: "overview", label: "Overview" },
  { id: "description", label: "Description" },
  { id: "specifications", label: "Specifications" },
  { id: "packaging", label: "Packaging" },
  { id: "certifications", label: "Certifications" },
  { id: "faq", label: "FAQ" },
]

const overviewPoints = [
  "Transparent bulk pricing with clear MOQ and price breaks.",
  "Verified supplier for B2B buyers with customs-ready packaging.",
  "Flexible OEM / ODM support and custom labeling available.",
  "Fast quote turnaround and dedicated wholesale service.",
]

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("overview")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    setLoading(true)
    const data = getProductById(id)
    if (data) {
      setProduct(data)
      setQuantity(data.moq || 1)
      setCurrentImageIndex(0)
    }
    setLoading(false)
    window.scrollTo(0, 0)
  }, [id])

  const images = useMemo(() => {
    if (product?.images?.length) return product.images
    if (product?.image) return [product.image]
    return []
  }, [product])

  const productCode = useMemo(() => product?.id || "N/A", [product])

  const currentTier = useMemo(() => {
    const pricing = product?.tieredPricing
    if (!pricing || pricing.length === 0) return null
    return pricing.find((tier) => {
      if (tier.max === null) return quantity >= tier.min
      return quantity >= tier.min && quantity <= tier.max
    }) || pricing[0]
  }, [product?.tieredPricing, quantity])

  const faqItems = useMemo(() => [
    {
      question: "What is the minimum order quantity?",
      answer: `MOQ is ${product?.moq ?? 1} pieces. Larger quantities unlock better pricing tiers.`,
    },
    {
      question: "How long does production take?",
      answer: "Typical lead time is 15-25 days after order confirmation and sample approval.",
    },
    {
      question: "Can I request a sample?",
      answer: "Yes. Contact the supplier to arrange a paid sample and shipping details.",
    },
  ], [product?.moq])

  const isOrderValid = useMemo(
    () => Boolean(product && product.inStock && quantity >= (product.moq || 1)),
    [product, quantity],
  )

  const layoutStyle = useMemo(
    () => ({ ...styles.layout, ...(isMobile ? styles.layoutMobile : {}) }),
    [isMobile],
  )

  const actionGroupStyle = useMemo(
    () => ({ ...styles.richerActions, ...(isMobile ? styles.richerActionsMobile : {}) }),
    [isMobile],
  )

  const handleNextImage = useCallback(() => {
    if (!images.length) return
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }, [images])

  const handlePrevImage = useCallback(() => {
    if (!images.length) return
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images])

  const handleQuantityChange = useCallback((event) => {
    const value = Number(event.target.value)
    if (!Number.isNaN(value) && value >= (product?.moq || 1)) {
      setQuantity(value)
    }
  }, [product])

  const handleSendInquiry = useCallback(() => {
    window.alert("Inquiry request initiated. This would start the wholesale inquiry flow.")
  }, [])

  const handleChatNow = useCallback(() => {
    window.alert("Chat request initiated. This would open buyer support.")
  }, [])

  const handleAddToCart = useCallback(() => {
    if (isOrderValid) {
      window.alert(`Added ${quantity} units to the cart.`)
    }
  }, [isOrderValid, quantity])

  const handleBuyNow = useCallback(() => {
    if (isOrderValid) {
      window.alert(`Proceeding to purchase ${quantity} units now.`)
    }
  }, [isOrderValid, quantity])

  if (loading) {
    return (
      <div style={{ ...styles.pageContainer, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Loading product details…</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ ...styles.pageContainer, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "1rem", padding: "2rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", color: "#0f172a" }}>Product not found</h1>
        <p style={{ margin: 0, color: "#64748b" }}>The requested product does not exist or has been removed.</p>
        <button
          onClick={() => navigate("/products")}
          style={{ ...styles.primaryButton, width: "auto", padding: "0.9rem 1.5rem" }}
        >
          Back to products
        </button>
      </div>
    )
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.breadcrumb}>
        <span style={styles.breadcrumbLink} onClick={() => navigate("/")}>Home</span>
        <span>›</span>
        <span style={styles.breadcrumbLink} onClick={() => navigate("/categories")}>Categories</span>
        <span>›</span>
        <span style={styles.breadcrumbActive}>{product.category || "Product"}</span>
      </div>

      <div style={styles.header}>
        <h1 style={styles.headerTitle}>{product.name}</h1>
        <p style={styles.headerText}>A premium wholesale product detail page focused on fast supplier decision-making, MOQ clarity, transparent pricing, and logistics readiness.</p>
      </div>

      <div style={layoutStyle}>
        <div style={styles.galleryCard}>
          <div style={styles.imageCard}>
            <img loading="lazy" decoding="async" src={images[currentImageIndex] || product.image || ""} alt={product.name} style={styles.image} />
            {product.discount > 0 && <div style={styles.imageBadge}>-{product.discount}%</div>}
            <button style={{ ...styles.carouselControl, ...styles.prevControl }} onClick={handlePrevImage}>
              <FaChevronLeft />
            </button>
            <button style={{ ...styles.carouselControl, ...styles.nextControl }} onClick={handleNextImage}>
              <FaChevronRight />
            </button>
          </div>

          <div style={styles.thumbRow}>
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                style={{
                  ...styles.thumbItem,
                  ...(currentImageIndex === index ? styles.thumbItemActive : {}),
                }}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img loading="lazy" decoding="async" src={image} alt={`${product.name} ${index + 1}`} style={styles.thumbImg} />
              </button>
            ))}
          </div>
        </div>

        <div style={styles.productPanel}>
          <div style={styles.supplierStrip}>
            <span style={styles.supplierLabel}>
              <FaCheck /> Verified Supplier
            </span>
            <span style={styles.moqBadge}>MOQ {product.moq} pcs</span>
          </div>

          <div style={styles.titleRow}>
            <div>
              <p style={styles.subtitle}>{product.brand}</p>
              <p style={{ margin: 0, color: "#475569", fontSize: "0.95rem" }}>Product code: {productCode}</p>
            </div>
          </div>

          <div style={styles.priceGroup}>
            <span style={styles.priceLabel}>FOB price</span>
            <span style={styles.priceValue}>${product.price.toFixed(2)}</span>
            <span style={styles.priceRange}>{product.priceRange || "Pricing may vary by order volume."}</span>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Availability</p>
              <p style={styles.statValue}>{product.inStock ? `${product.stock} in stock` : "Out of stock"}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Production</p>
              <p style={styles.statValue}>{product.casePackSize || "Customizable"}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Lead Time</p>
              <p style={styles.statValue}>15-25 days</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Location</p>
              <p style={styles.statValue}>Yiwu, Zhejiang</p>
            </div>
          </div>

          <div style={actionGroupStyle}>
            <button
              type="button"
              style={{
                ...styles.primaryButton,
                opacity: isOrderValid ? 1 : 0.55,
                cursor: isOrderValid ? "pointer" : "not-allowed",
              }}
              onClick={handleAddToCart}
              disabled={!isOrderValid}
            >
              Add to Cart
            </button>
            <button
              type="button"
              style={{
                ...styles.secondaryButton,
                opacity: isOrderValid ? 1 : 0.55,
                cursor: isOrderValid ? "pointer" : "not-allowed",
              }}
              onClick={handleBuyNow}
              disabled={!isOrderValid}
            >
              Buy Now
            </button>
          </div>

          <div style={actionGroupStyle}>
            <button type="button" style={styles.primaryButton} onClick={handleSendInquiry}>
              <FaTruck /> Send Inquiry
            </button>
            <button type="button" style={styles.secondaryButton} onClick={handleChatNow}>
              <FaComment /> Chat Now
            </button>
          </div>

          <div style={styles.infoTabs}>
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                style={{
                  ...styles.tabButton,
                  ...(activeTab === tab.id ? styles.tabButtonActive : {}),
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={styles.tabPanel}>
            {activeTab === "overview" && (
              <>
                <h2 style={styles.panelTitle}>Overview</h2>
                <p style={styles.panelText}>{product.description}</p>
                <div style={styles.bulletList}>
                  {overviewPoints.map((point) => (
                    <div key={point} style={styles.bulletItem}>
                      <span style={styles.bulletDot} />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {activeTab === "description" && (
              <>
                <h2 style={styles.panelTitle}>Description</h2>
                <p style={styles.panelText}>{product.description}</p>
              </>
            )}
            {activeTab === "specifications" && (
              <>
                <h2 style={styles.panelTitle}>Specifications</h2>
                <div style={styles.bulletList}>
                  {Object.entries(product.specs || {}).map(([key, value]) => (
                    <div key={key} style={styles.bulletItem}>
                      <span style={styles.bulletDot} />
                      <span><strong>{key}:</strong> {value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {activeTab === "packaging" && (
              <>
                <h2 style={styles.panelTitle}>Packaging</h2>
                <p style={styles.panelText}>Bulk packaging is available with export-ready cartons and protective inserts. Custom branding and labels can be arranged for large orders.</p>
              </>
            )}
            {activeTab === "certifications" && (
              <>
                <h2 style={styles.panelTitle}>Certifications</h2>
                <div style={styles.bulletList}>
                  <div style={styles.bulletItem}>
                    <span style={styles.bulletDot} /> <span>Audited supplier</span>
                  </div>
                  <div style={styles.bulletItem}>
                    <span style={styles.bulletDot} /> <span>CE / UKCA compliant</span>
                  </div>
                  <div style={styles.bulletItem}>
                    <span style={styles.bulletDot} /> <span>ISO quality management</span>
                  </div>
                </div>
              </>
            )}
            {activeTab === "faq" && (
              <>
                <h2 style={styles.panelTitle}>FAQ</h2>
                <div style={styles.bulletList}>
                  {faqItems.map((item) => (
                    <div key={item.question} style={styles.bulletItem}>
                      <span style={styles.bulletDot} />
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{item.question}</p>
                        <p style={{ margin: "0.5rem 0 0", color: "#475569" }}>{item.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <aside style={styles.sidebar}>
          <div style={styles.sidebarCard}>
            <h2 style={styles.sidebarTitle}>Quick Facts</h2>
            <p style={styles.sidebarText}>Buyer-focused order details for fast planning and supplier due diligence.</p>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>MOQ</span>
              <span style={styles.detailValue}>{product.moq} pcs</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Lead time</span>
              <span style={styles.detailValue}>15-25 days</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Case pack</span>
              <span style={styles.detailValue}>{product.casePackSize || "Customizable"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Supplier</span>
              <span style={styles.detailValue}>{product.brand}</span>
            </div>
          </div>

          <div style={styles.sidebarCard}>
            <h2 style={styles.sidebarTitle}>Why Buy Wholesale?</h2>
            <div style={styles.bulletList}>
              <div style={styles.bulletItem}>
                <span style={styles.bulletDot} />
                <span>Lower unit cost for larger orders.</span>
              </div>
              <div style={styles.bulletItem}>
                <span style={styles.bulletDot} />
                <span>Custom packaging solutions on demand.</span>
              </div>
              <div style={styles.bulletItem}>
                <span style={styles.bulletDot} />
                <span>Supplier support for logistic planning.</span>
              </div>
            </div>
          </div>

          <div style={styles.sidebarCard}>
            <h2 style={styles.sidebarTitle}>Order Summary</h2>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Unit price</span>
              <span style={styles.detailValue}>${currentTier?.price?.toFixed(2) ?? product.price.toFixed(2)}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Qty</span>
              <span style={styles.detailValue}>{quantity}</span>
            </div>
          </div>
        </aside>
      </div>

      {isMobile && (
        <div style={styles.stickyBar}>
          <button
            type="button"
            style={{
              ...styles.stickyButton,
              ...styles.stickyPrimary,
              opacity: isOrderValid ? 1 : 0.55,
              cursor: isOrderValid ? "pointer" : "not-allowed",
            }}
            onClick={handleAddToCart}
            disabled={!isOrderValid}
          >
            Add to Cart
          </button>
          <button
            type="button"
            style={{
              ...styles.stickyButton,
              ...styles.stickySecondary,
              opacity: isOrderValid ? 1 : 0.55,
              cursor: isOrderValid ? "pointer" : "not-allowed",
            }}
            onClick={handleBuyNow}
            disabled={!isOrderValid}
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  )
}
