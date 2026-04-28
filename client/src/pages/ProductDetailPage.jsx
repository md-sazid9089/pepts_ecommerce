import { useState, useEffect, useMemo, useCallback } from "react"

const RESPONSIVE_CSS = `
  .pdp-breadcrumb { padding: 0.85rem 1.25rem; display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; font-size: 0.85rem; color: #475569; background: #fff; border-bottom: 1px solid #e2e8f0; }
  .pdp-header { max-width: 1400px; margin: 0 auto; padding: 1.5rem 1.25rem 0; }
  .pdp-header h1 { margin: 0; font-size: clamp(1.35rem, 4vw, 2rem); font-weight: 700; line-height: 1.1; }
  .pdp-header p { margin: 0.75rem 0 0; max-width: 760px; color: #64748b; font-size: 0.95rem; line-height: 1.75; }
  .pdp-layout { max-width: 1800px; margin: 1.5rem auto 3rem; padding: 0 1.25rem; display: grid; grid-template-columns: 1.55fr 0.7fr; gap: 2rem; align-items: start; }
  .pdp-gallery { display: flex; flex-direction: column; gap: 1rem; }
  .pdp-image-card { position: relative; background: #fff; border-radius: 1rem; overflow: hidden; min-height: 420px; box-shadow: 0 20px 50px rgba(15,23,42,0.08); }
  .pdp-thumb-row { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 0.75rem; }
  .pdp-panel { background: #fff; border-radius: 1rem; padding: 1.75rem; box-shadow: 0 20px 50px rgba(15,23,42,0.08); display: flex; flex-direction: column; gap: 1.25rem; }
  .pdp-sidebar { display: flex; flex-direction: column; gap: 1rem; }
  .pdp-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }
  .pdp-sticky { display: none; }
  .pdp-tabs { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.6rem; }
  @media (max-width: 1024px) {
    .pdp-layout { grid-template-columns: 1fr; gap: 1.25rem; }
    .pdp-sidebar { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; }
    .pdp-image-card { min-height: 380px; }
  }
  @media (max-width: 640px) {
    .pdp-breadcrumb { padding: 0.65rem 1rem; font-size: 0.8rem; }
    .pdp-header { padding: 1rem 1rem 0; }
    .pdp-layout { padding: 0 0.75rem; margin-top: 1rem; margin-bottom: 5rem; gap: 1rem; }
    .pdp-image-card { min-height: 280px; border-radius: 0.75rem; }
    .pdp-thumb-row { grid-template-columns: repeat(4, minmax(0,1fr)); gap: 0.5rem; }
    .pdp-panel { padding: 1.25rem; gap: 1rem; border-radius: 0.75rem; }
    .pdp-actions { grid-template-columns: 1fr 1fr; gap: 0.6rem; }
    .pdp-sidebar { grid-template-columns: 1fr; }
    .pdp-tabs { grid-template-columns: repeat(3, minmax(0,1fr)); gap: 0.4rem; }
    .pdp-sticky { display: grid; position: fixed; bottom: 0; left: 0; right: 0; grid-template-columns: 1fr 1fr; gap: 0.6rem; padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom)); background: rgba(255,255,255,0.98); border-top: 1px solid #e2e8f0; z-index: 90; backdrop-filter: blur(8px); }
  }
`
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { imagePresets } from '@/utils/imageUtils'
import ProductDetailSkeleton from '@/components/skeletons/ProductDetailSkeleton'
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaTruck,
  FaComment,
  FaCheck,
} from "react-icons/fa"
import { productsApi } from "@/services/api"
import { useCart } from "@/context/CartContext"

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("overview")

  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [inquiryData, setInquiryData] = useState({ companyName: "", email: "", phone: "", message: "" })
  const [inquiryStatus, setInquiryStatus] = useState({ loading: false, success: false, error: "" })
  const [imageLoaded, setImageLoaded] = useState(false)



  const { data: product, isLoading: loading, isError, error } = useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      const response = await productsApi.getById(id)
      if (!response.success) throw new Error(response.message || "Failed to fetch product")
      return response.data
    },
    enabled: !!id,
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    staleTime: 1000 * 60 * 2, // Consider fresh for 2 minutes
    retry: 2,
    // Always show skeleton on initial mount and when data is missing
  })

  // scroll to top on id change
  useEffect(() => { window.scrollTo(0, 0) }, [id])
  // sync quantity to moq when product loads
  useEffect(() => { if (product?.moq) setQuantity(product.moq) }, [product?.moq])

  const images = useMemo(() => {
    if (product?.images?.length) return product.images.map(img => typeof img === 'object' ? img.url : img).filter(Boolean)
    if (product?.imageUrl) return [product.imageUrl]
    return []
  }, [product])

  const productCode = useMemo(() => product?.id || "N/A", [product])

  const currentTier = useMemo(() => {
    const pricing = product?.bulkPrices
    if (!pricing || pricing.length === 0) return null
    return pricing.find((tier) => {
      if (tier.maxQuantity === null || tier.maxQuantity === undefined) return quantity >= tier.minQuantity
      return quantity >= tier.minQuantity && quantity <= tier.maxQuantity
    }) || pricing[0]
  }, [product?.bulkPrices, quantity])

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



  const handleNextImage = useCallback(() => {
    if (!images.length) return
    setImageLoaded(false)
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }, [images])

  const handlePrevImage = useCallback(() => {
    if (!images.length) return
    setImageLoaded(false)
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images])

  const handleQuantityChange = useCallback((event) => {
    const value = Number(event.target.value)
    if (!Number.isNaN(value) && value >= (product?.moq || 1)) {
      setQuantity(value)
    }
  }, [product])

  const { addItem, openCart } = useCart()

  const handleSendInquiry = useCallback(() => {
    // Audit Requirement: Confirm redirect to login if not authenticated
    const token = localStorage.getItem("authToken")
    if (!token) {
      if (window.confirm("You must be logged in to send a wholesale inquiry. Go to login page?")) {
        navigate("/login")
      }
      return
    }
    setShowInquiryModal(true)
  }, [navigate])

  const handleInquirySubmit = async (e) => {
    e.preventDefault()
    setInquiryStatus({ loading: true, success: false, error: "" })
    
    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000"
      const token = localStorage.getItem("authToken")
      
      const res = await fetch(`${apiBase}/api/inquiries`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.title,
          companyName: inquiryData.companyName,
          contactEmail: inquiryData.email,
          contactPhone: inquiryData.phone,
          requestedQuantity: quantity,
          message: inquiryData.message
        })
      })
      
      const data = await res.json()
      if (data.success) {
        setInquiryStatus({ loading: false, success: true, error: "" })
        setTimeout(() => {
          setShowInquiryModal(false)
          setInquiryStatus({ loading: false, success: false, error: "" })
        }, 2000)
      } else {
        setInquiryStatus({ loading: false, success: false, error: data.message || "Failed to submit inquiry" })
      }
    } catch (err) {
      setInquiryStatus({ loading: false, success: false, error: "Connection error" })
    }
  }

  const handleChatNow = useCallback(() => {
    window.alert("Chat request initiated. This would open buyer support.")
  }, [])

  const handleAddToCart = useCallback(() => {
    if (!isOrderValid || !product) return

    addItem(
      {
        id: product.id,
        name: product.title,
        brand: product.brand || product.category,
        code: product.code || product.id,
        price: currentTier?.price ?? product.price,
        originalPrice: product.originalPrice ?? product.price,
        moq: product.moq,
        tieredPricing: product.bulkPrices,
        images,
        unit: product.unit || "Piece",
      },
      quantity,
    )

    openCart()
    navigate("/cart")
  }, [addItem, currentTier?.price, images, isOrderValid, navigate, openCart, product, quantity])

  const handleBuyNow = useCallback(() => {
    if (isOrderValid) {
      window.alert(`Proceeding to purchase ${quantity} units now.`)
    }
  }, [isOrderValid, quantity])

  // Reset image index when product changes
  useEffect(() => { 
    setCurrentImageIndex(0) 
    setImageLoaded(false)
  }, [id])

  if (loading || !product) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.header}>
          <div style={{ padding: '2rem' }}>
            <ProductDetailSkeleton />
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500 mb-6">{error?.message}</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-[#533638] text-white rounded-lg"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.pageContainer}>
      <style>{RESPONSIVE_CSS}</style>
      <div className="pdp-breadcrumb">
        <span style={styles.breadcrumbLink} onClick={() => navigate("/")}>Home</span>
        <span>›</span>
        <span style={styles.breadcrumbLink} onClick={() => navigate("/categories")}>Categories</span>
        <span>›</span>
        <span style={styles.breadcrumbActive}>{product.category || "Product"}</span>
      </div>

      <div className="pdp-header">
        <h1>{product.title}</h1>
        <p>A premium wholesale product detail page focused on fast supplier decision-making, MOQ clarity, transparent pricing, and logistics readiness.</p>
      </div>

      <div className="pdp-layout">
        <div className="pdp-gallery">
          <div className="pdp-image-card">
            {(() => {

              const raw = images[currentImageIndex] || product?.imageUrl || product?.image || '';
              const src = (raw && typeof raw === 'string' && raw.trim() !== '') ? imagePresets.detail(raw) : '';
              
              if (!src) {
                 return <div className="bg-gray-200 w-full h-full rounded-xl animate-pulse" />;
              }
              
              return (
                <img 
                  loading="lazy" 
                  decoding="async" 
                  src={src} 
                  alt={product?.title || "Product"} 
                  onLoad={() => setImageLoaded(true)}
                  style={styles.image}
                  className={`transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              );
            })()}
            {product.discount > 0 && <div style={styles.imageBadge}>-{product.discount}%</div>}
            <button style={{ ...styles.carouselControl, ...styles.prevControl }} onClick={handlePrevImage}>
              <FaChevronLeft />
            </button>
            <button style={{ ...styles.carouselControl, ...styles.nextControl }} onClick={handleNextImage}>
              <FaChevronRight />
            </button>
          </div>

          <div className="pdp-thumb-row">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                style={{
                  ...styles.thumbItem,
                  ...(currentImageIndex === index ? styles.thumbItemActive : {}),
                }}
                onClick={() => {
                  setImageLoaded(false)
                  setCurrentImageIndex(index)
                }}
              >
                {(() => {
                  const raw = (image && image.trim() !== '') ? image : '/placeholder-product.jpg';
                  const thumbSrc = imagePresets.admin(raw);
                  return <img loading="lazy" decoding="async" src={thumbSrc} alt={`${product.name} ${index + 1}`} style={styles.thumbImg} />;
                })()}
              </button>
            ))}
          </div>
        </div>

        <div className="pdp-panel">
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
            <span style={styles.priceValue}>${(currentTier?.price || product.price || 0).toFixed(2)}</span>
            <span style={styles.priceRange}>{product.priceRange || "Pricing may vary by order volume."}</span>
          </div>

          {/* Tiered Pricing Table */}
          {product?.bulkPrices && product.bulkPrices.length > 0 && (
            <div style={{ marginTop: "1rem", border: "1px solid #e2e8f0", borderRadius: "0.75rem", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", color: "#475569" }}>Quantity</th>
                    <th style={{ padding: "0.75rem", textAlign: "right", color: "#475569" }}>Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  {product.bulkPrices.map((tier, idx) => {
                    const isActive = currentTier && tier.minQuantity === currentTier.minQuantity
                    return (
                      <tr key={idx} style={{ 
                        borderBottom: idx === product.bulkPrices.length - 1 ? "none" : "1px solid #e2e8f0",
                        backgroundColor: isActive ? "#f0f9ff" : "transparent",
                        fontWeight: isActive ? 700 : 400,
                        color: isActive ? "#0284c7" : "inherit"
                      }}>
                        <td style={{ padding: "0.75rem" }}>
                          {tier.maxQuantity ? `${tier.minQuantity} - ${tier.maxQuantity}` : `${tier.minQuantity}+`} units
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "right" }}>
                          ${(tier.price || 0).toFixed(2)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Quantity Selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={styles.priceLabel}>Quantity</label>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "0.5rem", overflow: "hidden" }}>
                <button 
                  onClick={() => setQuantity(q => Math.max(product.moq || 1, q - 1))}
                  style={{ padding: "0.5rem 1rem", border: "none", background: "#f8fafc", cursor: "pointer", fontSize: "1.2rem" }}
                >-</button>
                <input 
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  style={{ width: "60px", textAlign: "center", border: "none", outline: "none", fontSize: "1rem", fontWeight: 700 }}
                  min={product.moq || 1}
                />
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  style={{ padding: "0.5rem 1rem", border: "none", background: "#f8fafc", cursor: "pointer", fontSize: "1.2rem" }}
                >+</button>
              </div>
              <span style={{ fontSize: "0.9rem", color: "#64748b" }}>
                {product.unit || "units"} available
              </span>
            </div>
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

          <div className="pdp-actions">
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

          <div className="pdp-actions">
            <button type="button" style={styles.primaryButton} onClick={handleSendInquiry}>
              <FaTruck /> Send Inquiry
            </button>
            <button type="button" style={styles.secondaryButton} onClick={handleChatNow}>
              <FaComment /> Chat Now
            </button>
          </div>

          <div className="pdp-tabs">
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

        <aside className="pdp-sidebar">
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
              <span style={styles.detailValue}>${(currentTier?.price || product.price || 0).toFixed(2)}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Qty</span>
              <span style={styles.detailValue}>{quantity}</span>
            </div>
          </div>
        </aside>
      </div>

      <div className="pdp-sticky">
        <button
          type="button"
          style={{ ...styles.stickyButton, ...styles.stickyPrimary, opacity: isOrderValid ? 1 : 0.55, cursor: isOrderValid ? "pointer" : "not-allowed" }}
          onClick={handleAddToCart}
          disabled={!isOrderValid}
        >
          Add to Cart
        </button>
        <button
          type="button"
          style={{ ...styles.stickyButton, ...styles.stickySecondary, opacity: isOrderValid ? 1 : 0.55, cursor: isOrderValid ? "pointer" : "not-allowed" }}
          onClick={handleBuyNow}
          disabled={!isOrderValid}
        >
          Buy Now
        </button>
      </div>
      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "1rem", padding: "2rem", width: "100%", maxWidth: "500px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <h2 style={{ margin: "0 0 1rem", fontSize: "1.5rem", fontWeight: 700 }}>Wholesale Inquiry</h2>
            <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>Request bulk pricing for <strong>{quantity} units</strong> of {product.title}.</p>
            
            {inquiryStatus.success ? (
              <div style={{ backgroundColor: "#ecfdf5", color: "#065f46", padding: "1rem", borderRadius: "0.5rem", textAlign: "center", fontWeight: 600 }}>
                ✅ Inquiry sent successfully!
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.25rem" }}>Company Name</label>
                  <input required style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }} 
                    value={inquiryData.companyName} onChange={e => setInquiryData({...inquiryData, companyName: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.25rem" }}>Contact Email</label>
                  <input required type="email" style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }} 
                    value={inquiryData.email} onChange={e => setInquiryData({...inquiryData, email: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.25rem" }}>Contact Phone</label>
                  <input style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }} 
                    value={inquiryData.phone} onChange={e => setInquiryData({...inquiryData, phone: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.25rem" }}>Message (Optional)</label>
                  <textarea style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", minHeight: "100px" }} 
                    value={inquiryData.message} onChange={e => setInquiryData({...inquiryData, message: e.target.value})} />
                </div>
                
                {inquiryStatus.error && <p style={{ color: "#dc2626", fontSize: "0.85rem", margin: 0 }}>{inquiryStatus.error}</p>}
                
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                  <button type="button" onClick={() => setShowInquiryModal(false)} 
                    style={{ flex: 1, padding: "0.85rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", cursor: "pointer", fontWeight: 700 }}>Cancel</button>
                  <button type="submit" disabled={inquiryStatus.loading}
                    style={{ flex: 1, padding: "0.85rem", borderRadius: "0.75rem", border: "none", backgroundColor: "#0f172a", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                    {inquiryStatus.loading ? "Sending..." : "Submit Inquiry"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
