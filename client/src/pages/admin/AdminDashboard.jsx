import { useState, useEffect, useCallback, useMemo, memo } from "react"
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { productsApi, ordersApi, inquiriesApi, categoriesApi, reviewsApi } from "@/services/api"
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaBell,
  FaSignOutAlt,
  FaChartLine,
  FaBox,
  FaList,
  FaMoneyBillWave,
  FaInbox,
  FaUsers,
  FaStar,
  FaCog,
  FaPlus,
  FaEdit,
  FaEye,
  FaChevronDown,
  FaShoppingCart,
  FaDollarSign,
  FaCheck,
  FaHourglass,
  FaTruck,
  FaExclamationCircle,
} from "react-icons/fa"

const colors = {
  sidebar: "#533638",
  sidebarActive: "#F7B9C4",
  background: "#F5EDEC",
  white: "#ffffff",
  text: "#333333",
  border: "#e5e7eb",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "250px 1fr",
    gridTemplateRows: "60px 1fr",
    minHeight: "100vh",
    backgroundColor: colors.background,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },
  containerMobile: {
    gridTemplateColumns: "1fr",
  },

  // Sidebar
  sidebar: {
    gridRow: "1 / -1",
    backgroundColor: colors.sidebar,
    color: colors.white,
    padding: "1.5rem 1rem",
    overflow: "auto",
    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  sidebarMobile: {
    position: "fixed",
    left: 0,
    top: 60,
    width: "250px",
    height: "calc(100vh - 60px)",
    zIndex: 30,
    display: "none",
  },
  sidebarMobileOpen: {
    display: "flex",
  },

  logo: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: colors.sidebarActive,
    marginBottom: "0.5rem",
    cursor: "pointer",
  },

  navSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  navSectionTitle: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    padding: "0.75rem 0",
    margin: "0.75rem 0 0 0",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },

  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.875rem 1rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    color: "rgba(255, 255, 255, 0.8)",
    textDecoration: "none",
    fontSize: "0.95rem",
    fontWeight: 500,
  },
  navItemHover: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: colors.white,
  },
  navItemActive: {
    backgroundColor: colors.sidebarActive,
    color: colors.sidebar,
    fontWeight: 600,
  },

  navItemIcon: {
    fontSize: "1.125rem",
    width: "1.5rem",
    textAlign: "center",
  },

  // Navbar
  navbar: {
    gridColumn: "2",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    padding: "0 2rem",
    borderBottom: `1px solid ${colors.border}`,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    gap: "1rem",
  },
  navbarMobile: {
    gridColumn: "1",
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },

  searchBar: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    flex: 1,
    maxWidth: "400px",
    padding: "0.625rem 1rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "0.5rem",
    border: `1px solid ${colors.border}`,
  },

  searchInput: {
    flex: 1,
    border: "none",
    background: "none",
    outline: "none",
    fontSize: "0.95rem",
    color: colors.text,
    fontFamily: "inherit",
  },

  navbarRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },

  navbarBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.25rem",
    color: colors.text,
    transition: "color 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem",
  },
  navbarBtnHover: {
    color: colors.sidebar,
  },

  profileMenu: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  profileMenuHover: {
    backgroundColor: "#f3f4f6",
  },

  profileAvatar: {
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    backgroundColor: colors.sidebar,
    color: colors.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: "0.875rem",
  },

  hamburgerBtn: {
    display: "none",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.5rem",
    color: colors.text,
  },
  hamburgerBtnShow: {
    display: "flex",
  },

  // Main Content
  main: {
    gridColumn: "2",
    gridRow: "2",
    overflow: "auto",
    padding: "2rem",
  },
  mainMobile: {
    gridColumn: "1",
    padding: "1rem",
  },

  // Dashboard Content
  pageHeader: {
    marginBottom: "2rem",
  },

  pageTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    color: colors.text,
    margin: "0 0 0.5rem 0",
  },

  pageSubtitle: {
    fontSize: "0.95rem",
    color: "#6b7280",
  },

  // Stats Grid
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },

  statCard: {
    backgroundColor: colors.white,
    padding: "1.5rem",
    borderRadius: "0.75rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    border: `1px solid ${colors.border}`,
    display: "flex",
    gap: "1rem",
    transition: "all 0.3s ease",
  },
  statCardHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
  },

  statIcon: {
    width: "3.5rem",
    height: "3.5rem",
    borderRadius: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    color: colors.white,
    flexShrink: 0,
  },

  statContent: {
    flex: 1,
  },

  statLabel: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
    margin: "0 0 0.5rem 0",
  },

  statValue: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: colors.text,
    margin: "0 0 0.5rem 0",
  },

  statChange: {
    fontSize: "0.8rem",
    color: colors.success,
  },

  // Tables Section
  tablesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "2rem",
  },

  card: {
    backgroundColor: colors.white,
    padding: "1.5rem",
    borderRadius: "0.75rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    border: `1px solid ${colors.border}`,
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },

  cardTitle: {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: colors.text,
    margin: 0,
  },

  cardViewAll: {
    fontSize: "0.875rem",
    color: colors.sidebar,
    textDecoration: "none",
    cursor: "pointer",
    fontWeight: 500,
    transition: "color 0.2s ease",
  },
  cardViewAllHover: {
    color: colors.sidebarActive,
  },

  // Table
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  tableHead: {
    borderBottom: `2px solid ${colors.border}`,
  },

  tableHeader: {
    padding: "0.75rem 0",
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#6b7280",
    textAlign: "left",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },

  tableRow: {
    borderBottom: `1px solid ${colors.border}`,
    transition: "background-color 0.2s ease",
  },
  tableRowHover: {
    backgroundColor: "#f9fafb",
  },

  tableCell: {
    padding: "1rem 0",
    fontSize: "0.95rem",
    color: colors.text,
  },

  // Status Badge
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.375rem 0.75rem",
    borderRadius: "2rem",
    fontSize: "0.8rem",
    fontWeight: 600,
  },

  badgePending: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    color: "#d97706",
  },

  badgeProcessing: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    color: "#2563eb",
  },

  badgeShipped: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    color: "#059669",
  },

  badgeCompleted: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    color: "#15803d",
  },

  // Action Buttons
  actionBtn: {
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: 600,
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },

  actionBtnEdit: {
    backgroundColor: colors.info,
    color: colors.white,
  },
  actionBtnEditHover: {
    opacity: 0.9,
  },

  actionBtnDelete: {
    backgroundColor: colors.danger,
    color: colors.white,
  },
  actionBtnDeleteHover: {
    opacity: 0.9,
  },

  // Inquiry Alert
  inquiryAlert: {
    backgroundColor: "#fef3c7",
    border: `1px solid #fcd34d`,
    padding: "1rem",
    borderRadius: "0.5rem",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },

  inquiryAlertIcon: {
    fontSize: "1.25rem",
    color: "#d97706",
    flexShrink: 0,
  },

  inquiryAlertContent: {
    flex: 1,
  },

  inquiryAlertText: {
    fontSize: "0.95rem",
    color: "#92400e",
    margin: 0,
    fontWeight: 500,
  },

  formGroup: {
    display: "grid",
    gap: "0.75rem",
    marginBottom: "1rem",
  },

  formLabel: {
    fontSize: "0.9rem",
    color: "#374151",
    fontWeight: 600,
  },

  formInput: {
    width: "100%",
    padding: "0.85rem 1rem",
    borderRadius: "0.65rem",
    border: "1px solid #E5E7EB",
    fontSize: "0.95rem",
    color: "#111827",
    outline: "none",
  },

  formTextarea: {
    width: "100%",
    minHeight: "120px",
    padding: "0.85rem 1rem",
    borderRadius: "0.65rem",
    border: "1px solid #E5E7EB",
    fontSize: "0.95rem",
    color: "#111827",
    resize: "vertical",
  },

  submitBtn: {
    padding: "0.95rem 1.25rem",
    borderRadius: "0.75rem",
    border: "none",
    backgroundColor: "#533638",
    color: "white",
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "pointer",
  },

  notificationSuccess: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
    border: "1px solid #10b981",
    padding: "0.95rem 1rem",
    borderRadius: "0.75rem",
    marginBottom: "1rem",
  },

  notificationError: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #f87171",
    padding: "0.95rem 1rem",
    borderRadius: "0.75rem",
    marginBottom: "1rem",
  },

  productTable: {
    width: "100%",
    borderCollapse: "collapse",
  },

  productTableHeader: {
    padding: "0.85rem 0",
    textAlign: "left",
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },

  productTableRow: {
    borderBottom: "1px solid #E5E7EB",
  },

  productTableCell: {
    padding: "0.95rem 0",
    color: "#374151",
    fontSize: "0.95rem",
  },

  // Overlay for mobile sidebar
  sidebarOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 20,
    display: "none",
  },
  sidebarOverlayShow: {
    display: "block",
  },
}


const getStatusBadge = (status) => {
  const statusMap = {
    Pending: styles.badgePending,
    Processing: styles.badgeProcessing,
    Shipped: styles.badgeShipped,
    Completed: styles.badgeCompleted,
  }
  return statusMap[status] || styles.badgePending
}

const PRODUCTS_PER_PAGE = 10

export default function AdminDashboard() {
  const navigate = useNavigate()
  // ── Admin login guard ──────────────────────────────────────────────────────
  const [adminUser, setAdminUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pepta_admin_session')) } catch { return null }
  })
  // ───────────────────────────────────────────────────────────────────────────
  const [activePage, setActivePage] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hoveredStat, setHoveredStat] = useState(null)
  const [hoveredTableRow, setHoveredTableRow] = useState(null)
  const [products, setProducts] = useState([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [productPage, setProductPage] = useState(1)
  const [deletingId, setDeletingId] = useState(null)
  const adminQueryClient = useQueryClient()

  const [stats, setStats] = useState([
    { label: "Total Orders", value: "0", change: "...", icon: FaShoppingCart, bgColor: colors.info },
    { label: "Total Revenue", value: "$0", change: "...", icon: FaDollarSign, bgColor: colors.success },
    { label: "Total Products", value: "0", change: "...", icon: FaBox, bgColor: colors.warning },
    { label: "Total Inquiries", value: "0", change: "...", icon: FaInbox, bgColor: colors.sidebar },
  ])
  const [orders, setOrders] = useState([])
  const [inquiries, setInquiries] = useState([])

  // Fetch real dashboard data
  useEffect(() => {
    if (!adminUser) return // don't fetch if not logged in
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Orders & Revenue
        const ordersRes = await ordersApi.getAll(1, 100)
        if (ordersRes.success) {
          const items = ordersRes.data?.items || []
          setOrders(items.slice(0, 5)) // Show latest 5
          const totalRev = items.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
          const totalCount = ordersRes.data?.pagination?.total || items.length
          
          setStats(prev => prev.map(s => {
            if (s.label === "Total Orders") return { ...s, value: totalCount.toString() }
            if (s.label === "Total Revenue") return { ...s, value: `$${totalRev.toLocaleString()}` }
            return s
          }))
        }

        // 2. Fetch Inquiries
        const inquiriesRes = await inquiriesApi.getAll(1, 100)
        if (inquiriesRes.success) {
          const items = inquiriesRes.data?.items || []
          setInquiries(items.slice(0, 5))
          const totalCount = inquiriesRes.data?.pagination?.total || items.length
          setStats(prev => prev.map(s => {
            if (s.label === "Total Inquiries") return { ...s, value: totalCount.toString() }
            return s
          }))
        }

        // 3. Fetch Products
        const productsRes = await productsApi.getAll(1, 1)
        if (productsRes.success) {
          const totalCount = productsRes.data?.pagination?.total || 0
          setStats(prev => prev.map(s => {
            if (s.label === "Total Products") return { ...s, value: totalCount.toString() }
            return s
          }))
        }
      } catch (e) {
        console.error("Dashboard fetch error:", e)
      }
    }

    if (activePage === "dashboard") {
      fetchDashboardData()
    }
  }, [activePage, adminUser])
  const defaultPricingRow = () => ({ min: "", max: "", price: "", unit: "per unit" })
  const [productForm, setProductForm] = useState({
    title: "",
    brand: "",
    description: "",
    price: "",
    stock: "",
    categoryName: "General",
    moq: "",
    casePackSize: "",
    // Specification fields
    specHeight: "",
    specMaterial: "",
    specClothing: "",
    specPackage: "",
    specTier: "",
  })
  const [pricingRows, setPricingRows] = useState([defaultPricingRow()])

  const handlePricingRowChange = (index, field, value) => {
    setPricingRows((prev) => prev.map((row, i) => i === index ? { ...row, [field]: value } : row))
  }
  const addPricingRow = () => setPricingRows((prev) => [...prev, defaultPricingRow()])
  const removePricingRow = (index) => setPricingRows((prev) => prev.filter((_, i) => i !== index))
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState([])
  const [uploadingImage, setUploadingImage] = useState(null) // productId being uploaded
  const [uploadImageFile, setUploadImageFile] = useState({}) // { [productId]: File }
  const [formMessage, setFormMessage] = useState("")
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Responsive — recalculate on window resize instead of every render
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize, { passive: true })
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleFormChange = useCallback((field) => (event) => {
    setProductForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }, [])

  const handleImageFileChange = useCallback((e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    if (files.length > 10) {
      alert("Maximum 10 images allowed")
      return
    }
    setImageFiles(files)
    setImagePreviewUrls(files.map(f => URL.createObjectURL(f)))
  }, [])

  const handleUploadImageForProduct = useCallback(async (productId) => {
    const files = uploadImageFile[productId]
    if (!files || files.length === 0) {
      alert("Please select files first")
      return
    }
    
    const token = localStorage.getItem("authToken")
    if (!token) {
      alert("Authentication token missing. Please log in again.")
      return
    }

    setUploadingImage(productId)
    try {
      const res = await productsApi.uploadImage(productId, files, token)
      
      if (res.success && res.data) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, imageUrl: res.data.imageUrl } : p
          )
        )
        setUploadImageFile((prev) => ({ ...prev, [productId]: null }))
        // Invalidate React Query cache so storefront reflects new image
        adminQueryClient.invalidateQueries({ queryKey: queryKeys.products.all })
        adminQueryClient.invalidateQueries({ queryKey: queryKeys.products.detail(productId) })
        alert("Image uploaded successfully!")
      } else {
        console.error("[Admin] Upload failed:", res.message)
        alert(`Upload failed: ${res.message || "Unknown error"}`)
      }
    } catch (e) {
      console.error("[Admin] Upload exception:", e)
      alert(`System error: ${e.message}`)
    } finally {
      setUploadingImage(null)
    }
  }, [uploadImageFile, adminQueryClient])

  const handleCreateProduct = useCallback(async (event) => {
    event.preventDefault()
    setFormError("")
    setFormMessage("")
    setIsSubmitting(true)

    const tieredPricing = pricingRows
      .filter((row) => row.min !== "" && row.price !== "")
      .map((row) => ({
        min: Number(row.min),
        max: row.max !== "" ? Number(row.max) : null,
        price: Number(row.price),
        unit: row.unit || "per unit",
      }))

    try {
      const specs = {
        height:   productForm.specHeight.trim()   || undefined,
        material: productForm.specMaterial.trim() || undefined,
        clothing: productForm.specClothing.trim() || undefined,
        package:  productForm.specPackage.trim()  || undefined,
        tier:     productForm.specTier.trim()     || undefined,
      }
      Object.keys(specs).forEach((k) => specs[k] === undefined && delete specs[k])

      const response = await productsApi.create({
        title:        productForm.title,
        brand:        productForm.brand,
        description:  productForm.description,
        price:        Number(productForm.price),
        stock:        Number(productForm.stock),
        categoryName: productForm.categoryName,
        moq:          Number(productForm.moq),
        casePackSize: Number(productForm.casePackSize),
        tieredPricing,
        specs:        Object.keys(specs).length > 0 ? specs : undefined,
      })

      if (!response.success) {
        if (response.message?.includes("timed out") || response.code === 408) {
          setFormMessage("⚠️ Request timed out (slow database connection). The product was likely saved — please refresh to confirm, then upload the image separately if needed.")
          setIsSubmitting(false)
          return
        }
        setFormError(response.message || response.error?.message || "Unable to create product")
        setIsSubmitting(false)
        return
      }

      const newProductId = response.data?.id

      if (imageFiles.length > 0 && newProductId) {
        const token = localStorage.getItem("authToken")
        if (!token) {
          setFormMessage("Product created ✅, but image upload skipped (no auth token found — please log out and log in again).")
        } else {
          const imgRes = await productsApi.uploadImage(newProductId, imageFiles, token)
          if (!imgRes.success) {
            setFormError(`❌ Image upload failed: ${imgRes.message || "Unknown error"}`)
            setFormMessage("Product was created, but image was NOT saved. See error above.")
          } else {
            setFormMessage("✅ Product created and images uploaded successfully!")
          }
        }
      } else {
        setFormMessage("Product created successfully.")
      }

      setProductForm({
        title: "", brand: "", description: "", price: "", stock: "", categoryName: "General",
        moq: "", casePackSize: "", specHeight: "", specMaterial: "", specClothing: "", specPackage: "", specTier: "",
      })
      setPricingRows([defaultPricingRow()])
      setImageFiles([])
      setImagePreviewUrls([])

      const refreshed = await productsApi.getAll(1, 100)
      if (refreshed.success) setProducts(refreshed.data?.items || [])
      adminQueryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    } catch (error) {
      setFormError(error.message || "Unable to create product")
    } finally {
      setIsSubmitting(false)
    }
  }, [productForm, pricingRows, imageFiles, adminQueryClient])

  // ───────────────────────────────────────────────────────────────────────────
  // ───────────────────────────────────────────────────────────────────────────

  const navigationItems = useMemo(() => [
    { id: "dashboard", label: "Dashboard", icon: FaChartLine },
    { id: "products", label: "Products", icon: FaBox },
    { id: "categories", label: "Categories", icon: FaList },
    { id: "bulk-pricing", label: "Bulk Pricing", icon: FaMoneyBillWave },
    { id: "orders", label: "Orders", icon: FaShoppingCart },
    { id: "inquiries", label: "Inquiries", icon: FaInbox },
    { id: "users", label: "Users", icon: FaUsers },
    { id: "reviews", label: "Reviews", icon: FaStar },
    { id: "settings", label: "Settings", icon: FaCog },
  ], [])

  const fetchProducts = useCallback(async (page = 1) => {
    setLoadingProducts(true)
    setFormError("")
    try {
      const response = await productsApi.getAll(page, PRODUCTS_PER_PAGE)
      if (response.success) {
        setProducts(response.data?.items || [])
        setTotalProducts(response.data?.pagination?.total || 0)
        setProductPage(page)
      } else {
        setFormError(response.message || "Failed to load products")
      }
    } catch (error) {
      setFormError(error.message || "Failed to load products")
    } finally {
      setLoadingProducts(false)
    }
  }, [])

  const handleDeleteProduct = useCallback(async (product) => {
    if (!window.confirm(`Delete "${product.title}"?\nThis cannot be undone.`)) return
    setDeletingId(product.id)
    try {
      const res = await productsApi.delete(product.id)
      if (res.success) {
        // Refresh current page
        fetchProducts(productPage)
        adminQueryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      } else {
        alert(`Delete failed: ${res.message || 'Unknown error'}`)
      }
    } catch (err) {
      alert(`Delete error: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }, [productPage, fetchProducts, adminQueryClient])

  useEffect(() => {
    if (activePage === "products") {
      fetchProducts()
    }
  }, [activePage, fetchProducts])

  // ── Admin login gate — redirect to /admin/login if not authenticated ───
  if (!adminUser) {
    navigate('/admin/login', { replace: true })
    return null
  }
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ ...styles.container, ...(isMobile ? styles.containerMobile : {}) }}>
      {/* Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          style={styles.sidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav style={{ ...styles.sidebar, ...(isMobile ? { ...styles.sidebarMobile, ...(sidebarOpen ? styles.sidebarMobileOpen : {}) } : {}) }}>
        <div style={styles.logo}>⚙️ Admin</div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                style={{
                  ...styles.navItem,
                  ...(activePage === item.id ? styles.navItemActive : {}),
                }}
                onClick={() => {
                  setActivePage(item.id)
                  if (isMobile) setSidebarOpen(false)
                }}
                onMouseEnter={(e) => {
                  if (activePage !== item.id) {
                    Object.assign(e.target.style, styles.navItemHover)
                  }
                }}
                onMouseLeave={(e) => {
                  if (activePage !== item.id) {
                    Object.assign(e.target.style, { backgroundColor: "transparent", color: "rgba(255, 255, 255, 0.8)" })
                  }
                }}
              >
                <span style={styles.navItemIcon}>
                  <Icon />
                </span>
                {item.label}
              </button>
            )
          })}
        </div>

        <button style={{ ...styles.navItem, marginTop: "auto" }} onClick={() => {
          localStorage.removeItem('pepta_admin_session')
          localStorage.removeItem('authToken')
          setAdminUser(null)
          navigate('/admin/login', { replace: true })
        }}>
          <FaSignOutAlt style={styles.navItemIcon} />
          Logout
        </button>
      </nav>

      {/* Navbar */}
      <header style={{ ...styles.navbar, ...(isMobile ? styles.navbarMobile : {}) }}>
        {isMobile && (
          <button
            style={{ ...styles.hamburgerBtn, ...styles.hamburgerBtnShow }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}

        <div style={styles.searchBar}>
          <FaSearch style={{ color: "#9ca3af" }} />
          <input
            type="text"
            placeholder="Search..."
            style={styles.searchInput}
          />
        </div>

        <div style={styles.navbarRight}>
          <button style={styles.navbarBtn} onMouseEnter={(e) => (e.target.style.color = colors.sidebar)} onMouseLeave={(e) => (e.target.style.color = colors.text)}>
            <FaBell />
            <span style={{ fontSize: "0.7rem", backgroundColor: colors.danger, color: colors.white, borderRadius: "50%", width: "1.25rem", height: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              3
            </span>
          </button>

          <div style={styles.profileMenu} onMouseEnter={(e) => Object.assign(e.target.style, styles.profileMenuHover)} onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}>
            <div style={styles.profileAvatar}>AD</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: colors.text }}>Admin User</div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>administrator</div>
            </div>
            <FaChevronDown style={{ fontSize: "0.75rem", color: "#9ca3af" }} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ ...styles.main, ...(isMobile ? styles.mainMobile : {}) }}>
        {activePage === "dashboard" && (
          <>
            {/* Inquiry Alert */}
            {inquiries.filter(iq => iq.status?.toLowerCase() === "new").length > 0 && (
              <div style={styles.inquiryAlert}>
                <FaExclamationCircle style={styles.inquiryAlertIcon} />
                <div style={styles.inquiryAlertContent}>
                  <p style={styles.inquiryAlertText}>
                    {inquiries.filter(iq => iq.status?.toLowerCase() === "new").length} new wholesale inquiries awaiting response!
                  </p>
                </div>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "#d97706", fontWeight: 600 }} onClick={() => setActivePage("inquiries")}>
                  View →
                </button>
              </div>
            )}

            {/* Page Header */}
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Dashboard</h1>
              <p style={styles.pageSubtitle}>Welcome back! Here&apos;s your business overview.</p>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div
                    key={idx}
                    style={{
                      ...styles.statCard,
                      ...(hoveredStat === idx ? styles.statCardHover : {}),
                    }}
                    onMouseEnter={() => setHoveredStat(idx)}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <div style={{ ...styles.statIcon, backgroundColor: stat.bgColor }}>
                      <Icon />
                    </div>
                    <div style={styles.statContent}>
                      <p style={styles.statLabel}>{stat.label}</p>
                      <p style={styles.statValue}>{stat.value}</p>
                      <p style={styles.statChange}>📈 {stat.change}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Tables Grid */}
            <div style={styles.tablesGrid}>
              {/* Recent Orders */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>Recent Orders</h2>
                  <span
                    style={styles.cardViewAll}
                    onClick={() => setActivePage("orders")}
                    onMouseEnter={(e) => Object.assign(e.target.style, styles.cardViewAllHover)}
                    onMouseLeave={(e) => (e.target.style.color = colors.sidebar)}
                  >
                    View All →
                  </span>
                </div>

                <table style={styles.table}>
                  <thead style={styles.tableHead}>
                    <tr>
                      <th style={styles.tableHeader}>Order ID</th>
                      <th style={styles.tableHeader}>Customer</th>
                      <th style={styles.tableHeader}>Total</th>
                      <th style={styles.tableHeader}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => (
                      <tr
                        key={idx}
                        style={{
                          ...styles.tableRow,
                          ...(hoveredTableRow === `order-${idx}` ? styles.tableRowHover : {}),
                        }}
                        onMouseEnter={() => setHoveredTableRow(`order-${idx}`)}
                        onMouseLeave={() => setHoveredTableRow(null)}
                      >
                        <td style={styles.tableCell}>
                          <strong>{order.id}</strong>
                        </td>
                        <td style={styles.tableCell}>{order.customer || order.user?.firstName || "Guest"}</td>
                        <td style={styles.tableCell}>${(order.total || order.totalAmount || 0).toLocaleString()}</td>
                        <td style={styles.tableCell}>
                          <span style={{ ...styles.badge, ...getStatusBadge(order.status) }}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pending Inquiries */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>Pending Inquiries</h2>
                  <span
                    style={styles.cardViewAll}
                    onClick={() => setActivePage("inquiries")}
                    onMouseEnter={(e) => Object.assign(e.target.style, styles.cardViewAllHover)}
                    onMouseLeave={(e) => (e.target.style.color = colors.sidebar)}
                  >
                    View All →
                  </span>
                </div>

                <table style={styles.table}>
                  <thead style={styles.tableHead}>
                    <tr>
                      <th style={styles.tableHeader}>Company</th>
                      <th style={styles.tableHeader}>Product</th>
                      <th style={styles.tableHeader}>Qty</th>
                      <th style={styles.tableHeader}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inquiry, idx) => (
                      <tr
                        key={idx}
                        style={{
                          ...styles.tableRow,
                          ...(hoveredTableRow === `inquiry-${idx}` ? styles.tableRowHover : {}),
                        }}
                        onMouseEnter={() => setHoveredTableRow(`inquiry-${idx}`)}
                        onMouseLeave={() => setHoveredTableRow(null)}
                      >
                        <td style={styles.tableCell}>
                          <strong>{inquiry.companyName || inquiry.name}</strong>
                        </td>
                        <td style={styles.tableCell}>{inquiry.productName || inquiry.product}</td>
                        <td style={styles.tableCell}>{inquiry.requestedQuantity || inquiry.qty}</td>
                        <td style={styles.tableCell}>
                          <span style={{ ...styles.badge, ...(inquiry.status === "New" ? styles.badgePending : styles.badgeProcessing) }}>
                            {inquiry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activePage === "products" ? (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Products</h2>
              <span style={{ color: "#6b7280" }}>Create new products and manage backend inventory.</span>
            </div>

            {formMessage && <div style={styles.notificationSuccess}>{formMessage}</div>}
            {formError && <div style={styles.notificationError}>{formError}</div>}

            <form onSubmit={handleCreateProduct} style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="title">Product Title</label>
                <input
                  id="title"
                  type="text"
                  value={productForm.title}
                  onChange={handleFormChange("title")}
                  style={styles.formInput}
                  placeholder="Enter product title"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="brand">Brand</label>
                <input
                  id="brand"
                  type="text"
                  value={productForm.brand}
                  onChange={handleFormChange("brand")}
                  style={styles.formInput}
                  placeholder="Supplier or brand name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={productForm.description}
                  onChange={handleFormChange("description")}
                  style={styles.formTextarea}
                  placeholder="Enter a short product description"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="price">Price (USD)</label>
                  <input
                    id="price"
                    type="number"
                    value={productForm.price}
                    onChange={handleFormChange("price")}
                    style={styles.formInput}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="stock">Stock</label>
                  <input
                    id="stock"
                    type="number"
                    value={productForm.stock}
                    onChange={handleFormChange("stock")}
                    style={styles.formInput}
                    placeholder="0"
                    min="0"
                    step="1"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="moq">MOQ</label>
                  <input
                    id="moq"
                    type="number"
                    value={productForm.moq}
                    onChange={handleFormChange("moq")}
                    style={styles.formInput}
                    placeholder="Minimum order quantity"
                    min="1"
                    step="1"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="casePackSize">Case Pack Size</label>
                  <input
                    id="casePackSize"
                    type="number"
                    value={productForm.casePackSize}
                    onChange={handleFormChange("casePackSize")}
                    style={styles.formInput}
                    placeholder="Units per case"
                    min="1"
                    step="1"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="categoryName">Category</label>
                  <input
                    id="categoryName"
                    type="text"
                    value={productForm.categoryName}
                    onChange={handleFormChange("categoryName")}
                    style={styles.formInput}
                    placeholder="General"
                  />
                </div>
              </div>

              {/* ── Bulk Pricing Tiers ── */}
              <div style={styles.formGroup}>
                <label style={{ ...styles.formLabel, fontSize: "1rem", color: "#533638", borderBottom: "2px solid #F7B9C4", paddingBottom: "0.4rem", marginBottom: "0.75rem", display: "block" }}>
                  💰 Bulk Pricing Tiers
                </label>

                {/* Header row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 40px", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  {["Min Qty", "Max Qty", "Price (USD)", "Unit Label", ""].map((h) => (
                    <span key={h} style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.3px" }}>{h}</span>
                  ))}
                </div>

                {/* Tier rows */}
                {pricingRows.map((row, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 40px", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                    <input
                      type="number" min="1" step="1"
                      value={row.min}
                      onChange={(e) => handlePricingRowChange(idx, "min", e.target.value)}
                      style={{ ...styles.formInput, padding: "0.6rem 0.75rem" }}
                      placeholder="e.g. 10"
                    />
                    <input
                      type="number" min="1" step="1"
                      value={row.max}
                      onChange={(e) => handlePricingRowChange(idx, "max", e.target.value)}
                      style={{ ...styles.formInput, padding: "0.6rem 0.75rem" }}
                      placeholder="blank = unlimited"
                    />
                    <input
                      type="number" min="0" step="0.01"
                      value={row.price}
                      onChange={(e) => handlePricingRowChange(idx, "price", e.target.value)}
                      style={{ ...styles.formInput, padding: "0.6rem 0.75rem" }}
                      placeholder="e.g. 850"
                    />
                    <input
                      type="text"
                      value={row.unit}
                      onChange={(e) => handlePricingRowChange(idx, "unit", e.target.value)}
                      style={{ ...styles.formInput, padding: "0.6rem 0.75rem" }}
                      placeholder="per unit"
                    />
                    <button
                      type="button"
                      onClick={() => removePricingRow(idx)}
                      disabled={pricingRows.length === 1}
                      style={{
                        background: pricingRows.length === 1 ? "#f3f4f6" : "#fee2e2",
                        color: pricingRows.length === 1 ? "#9ca3af" : "#991b1b",
                        border: "none", borderRadius: "0.375rem",
                        width: "32px", height: "32px",
                        cursor: pricingRows.length === 1 ? "not-allowed" : "pointer",
                        fontWeight: 700, fontSize: "1rem",
                      }}
                    >✕</button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addPricingRow}
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    border: "1.5px dashed #533638",
                    background: "#FFF5F5",
                    color: "#533638",
                    fontWeight: 600, fontSize: "0.875rem",
                    cursor: "pointer",
                  }}
                >
                  + Add Tier
                </button>

                <p style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "0.5rem" }}>
                  Leave Max Qty blank for the last tier (unlimited). Example: 10–49 units → $900, 50+ units → $850.
                </p>
              </div>

              {/* Specifications */}
              <div style={styles.formGroup}>
                <label style={{ ...styles.formLabel, fontSize: "1rem", color: "#533638", borderBottom: "2px solid #F7B9C4", paddingBottom: "0.4rem", marginBottom: "0.75rem", display: "block" }}>
                  📋 Specifications
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel} htmlFor="specHeight">Height</label>
                    <input
                      id="specHeight"
                      type="text"
                      value={productForm.specHeight}
                      onChange={handleFormChange("specHeight")}
                      style={styles.formInput}
                      placeholder="e.g. 30cm"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel} htmlFor="specMaterial">Material</label>
                    <input
                      id="specMaterial"
                      type="text"
                      value={productForm.specMaterial}
                      onChange={handleFormChange("specMaterial")}
                      style={styles.formInput}
                      placeholder="e.g. Premium Vinyl & Plastic"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel} htmlFor="specClothing">Clothing</label>
                    <input
                      id="specClothing"
                      type="text"
                      value={productForm.specClothing}
                      onChange={handleFormChange("specClothing")}
                      style={styles.formInput}
                      placeholder="e.g. Hand-sewn Couture Outfits"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel} htmlFor="specPackage">Package</label>
                    <input
                      id="specPackage"
                      type="text"
                      value={productForm.specPackage}
                      onChange={handleFormChange("specPackage")}
                      style={styles.formInput}
                      placeholder="e.g. 50 units per case"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel} htmlFor="specTier">Tier</label>
                    <input
                      id="specTier"
                      type="text"
                      value={productForm.specTier}
                      onChange={handleFormChange("specTier")}
                      style={styles.formInput}
                      placeholder="e.g. Premium / Collectible"
                    />
                  </div>

                </div>
              </div>


              {/* Image Upload */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="productImage">Product Images (Cloudinary)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <label
                    htmlFor="productImage"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.65rem 1.25rem", borderRadius: "0.65rem",
                      border: "2px dashed #533638", cursor: "pointer",
                      color: "#533638", fontWeight: 600, fontSize: "0.9rem",
                      backgroundColor: "#FFF5F5", transition: "all 0.2s",
                      width: "fit-content"
                    }}
                  >
                    📷 {imageFiles.length > 0 ? `${imageFiles.length} Images Selected` : "Choose Images"}
                    <input
                      id="productImage"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      multiple
                      style={{ display: "none" }}
                      onChange={handleImageFileChange}
                    />
                  </label>
                  {imagePreviewUrls.length > 0 && (
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      {imagePreviewUrls.map((url, idx) => (
                        <div key={idx} style={{ position: "relative" }}>
                          <img
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            style={{ width: 64, height: 64, objectFit: "cover", borderRadius: "0.5rem", border: "1px solid #E5E7EB" }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFiles(prev => prev.filter((_, i) => i !== idx));
                              setImagePreviewUrls(prev => prev.filter((_, i) => i !== idx));
                            }}
                            style={{
                              position: "absolute", top: -5, right: -5,
                              background: "#fee2e2", border: "none", color: "#991b1b",
                              borderRadius: "50%", width: 20, height: 20,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", fontSize: "0.7rem", fontWeight: "bold"
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.25rem" }}>
                  JPG, PNG, WebP or GIF · Max 10MB per image · Up to 10 images · Will be uploaded to Cloudinary automatically
                </p>
              </div>

              <button type="submit" style={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "Creating product..." : "Create Wholesale Product"}
              </button>
            </form>

            <div style={{ marginBottom: "1.5rem" }}>
              {/* Catalog header with pagination info */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", margin: 0 }}>
                  Current Catalog
                  <span style={{ marginLeft: "0.625rem", fontSize: "0.8rem", fontWeight: 500, color: "#6b7280" }}>
                    ({totalProducts} products)
                  </span>
                </h3>
                {totalProducts > PRODUCTS_PER_PAGE && (
                  <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>
                    Page {productPage} / {Math.ceil(totalProducts / PRODUCTS_PER_PAGE)}
                  </span>
                )}
              </div>

              {loadingProducts ? (
                <div style={{ color: "#374151", padding: "2rem", textAlign: "center" }}>Loading products...</div>
              ) : (
                <>
                  <table style={styles.productTable}>
                    <thead>
                      <tr>
                        <th style={styles.productTableHeader}>Image</th>
                        <th style={styles.productTableHeader}>Title</th>
                        <th style={styles.productTableHeader}>Category</th>
                        <th style={styles.productTableHeader}>Price</th>
                        <th style={styles.productTableHeader}>Stock</th>
                        <th style={styles.productTableHeader}>Upload Image</th>
                        <th style={styles.productTableHeader}>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length > 0 ? (
                        products
                          .map((product) => (
                            <tr key={product.id} style={styles.productTableRow}>
                              <td style={styles.productTableCell}>
                                {product.imageUrl ? (
                                  <img
                                    src={product.imageUrl}
                                    alt={product.title}
                                    style={{ width: 48, height: 48, objectFit: "cover", borderRadius: "0.375rem", border: "1px solid #E5E7EB" }}
                                  />
                                ) : (
                                  <div style={{ width: 48, height: 48, borderRadius: "0.375rem", backgroundColor: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>🖼️</div>
                                )}
                              </td>
                              <td style={{ ...styles.productTableCell, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {product.title || product.name}
                              </td>
                              <td style={styles.productTableCell}>{product.category || "General"}</td>
                              <td style={styles.productTableCell}>${(product.price || 0).toFixed(2)}</td>
                              <td style={styles.productTableCell}>{product.stock ?? 0}</td>
                              {/* Upload image */}
                              <td style={styles.productTableCell}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                  <label
                                    htmlFor={`img-${product.id}`}
                                    style={{
                                      padding: "0.35rem 0.65rem", borderRadius: "0.375rem",
                                      backgroundColor: "#EFF6FF", color: "#1D4ED8",
                                      border: "1px solid #BFDBFE", cursor: "pointer",
                                      fontSize: "0.78rem", fontWeight: 600, whiteSpace: "nowrap",
                                    }}
                                  >
                                    {uploadImageFile[product.id] ? `${uploadImageFile[product.id].length} Files` : "📷 Choose"}
                                    <input
                                      id={`img-${product.id}`}
                                      type="file"
                                      accept="image/jpeg,image/png,image/webp"
                                      multiple
                                      style={{ display: "none" }}
                                      onChange={(e) => {
                                        const files = Array.from(e.target.files)
                                        if (files.length > 0) setUploadImageFile((prev) => ({ ...prev, [product.id]: files }))
                                      }}
                                    />
                                  </label>
                                  {uploadImageFile[product.id] && (
                                    <button
                                      onClick={() => handleUploadImageForProduct(product.id)}
                                      disabled={uploadingImage === product.id}
                                      style={{
                                        padding: "0.35rem 0.65rem", borderRadius: "0.375rem",
                                        backgroundColor: "#533638", color: "#fff",
                                        border: "none", cursor: "pointer",
                                        fontSize: "0.78rem", fontWeight: 600,
                                      }}
                                    >
                                      {uploadingImage === product.id ? "Uploading..." : "Upload"}
                                    </button>
                                  )}
                                </div>
                              </td>
                              {/* Delete */}
                              <td style={styles.productTableCell}>
                                <button
                                  onClick={() => handleDeleteProduct(product)}
                                  disabled={deletingId === product.id}
                                  title="Delete product"
                                  style={{
                                    padding: "0.4rem 0.75rem", borderRadius: "0.375rem",
                                    backgroundColor: deletingId === product.id ? "#fca5a5" : "#fee2e2",
                                    color: "#991b1b", border: "1px solid #fca5a5",
                                    cursor: deletingId === product.id ? "not-allowed" : "pointer",
                                    fontSize: "0.8rem", fontWeight: 700,
                                    transition: "all 0.2s",
                                  }}
                                  onMouseEnter={e => { if (deletingId !== product.id) e.currentTarget.style.backgroundColor = "#ef4444"; e.currentTarget.style.color = "#fff" }}
                                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#fee2e2"; e.currentTarget.style.color = "#991b1b" }}
                                >
                                  {deletingId === product.id ? "Deleting…" : "🗑 Delete"}
                                </button>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td style={styles.productTableCell} colSpan={7}>
                            No products found in the backend catalog.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Pagination controls */}
                  {totalProducts > PRODUCTS_PER_PAGE && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "1.25rem" }}>
                      <button
                        onClick={() => fetchProducts(1)}
                        disabled={productPage === 1}
                        style={{ padding: "0.4rem 0.7rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb", background: productPage === 1 ? "#f9fafb" : "#fff", cursor: productPage === 1 ? "not-allowed" : "pointer", color: productPage === 1 ? "#9ca3af" : "#374151", fontSize: "0.85rem" }}
                      >«</button>
                      <button
                        onClick={() => fetchProducts(productPage - 1)}
                        disabled={productPage === 1}
                        style={{ padding: "0.4rem 0.8rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb", background: productPage === 1 ? "#f9fafb" : "#fff", cursor: productPage === 1 ? "not-allowed" : "pointer", color: productPage === 1 ? "#9ca3af" : "#374151", fontSize: "0.85rem" }}
                      >‹ Prev</button>

                      {Array.from({ length: Math.ceil(totalProducts / PRODUCTS_PER_PAGE) }, (_, i) => i + 1).map(pg => (
                        <button
                          key={pg}
                          onClick={() => fetchProducts(pg)}
                          style={{
                            padding: "0.4rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.85rem", fontWeight: pg === productPage ? 700 : 400,
                            border: pg === productPage ? "2px solid #533638" : "1px solid #e5e7eb",
                            background: pg === productPage ? "#533638" : "#fff",
                            color: pg === productPage ? "#fff" : "#374151",
                            cursor: "pointer",
                          }}
                        >{pg}</button>
                      ))}

                      <button
                        onClick={() => fetchProducts(productPage + 1)}
                        disabled={productPage === Math.ceil(totalProducts / PRODUCTS_PER_PAGE)}
                        style={{ padding: "0.4rem 0.8rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb", background: productPage === Math.ceil(totalProducts / PRODUCTS_PER_PAGE) ? "#f9fafb" : "#fff", cursor: productPage === Math.ceil(totalProducts / PRODUCTS_PER_PAGE) ? "not-allowed" : "pointer", color: productPage === Math.ceil(totalProducts / PRODUCTS_PER_PAGE) ? "#9ca3af" : "#374151", fontSize: "0.85rem" }}
                      >Next ›</button>
                      <button
                        onClick={() => fetchProducts(Math.ceil(totalProducts / PRODUCTS_PER_PAGE))}
                        disabled={productPage === Math.ceil(totalProducts / PRODUCTS_PER_PAGE)}
                        style={{ padding: "0.4rem 0.7rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb", background: productPage === Math.ceil(totalProducts / PRODUCTS_PER_PAGE) ? "#f9fafb" : "#fff", cursor: productPage === Math.ceil(totalProducts / PRODUCTS_PER_PAGE) ? "not-allowed" : "pointer", color: productPage === Math.ceil(totalProducts / PRODUCTS_PER_PAGE) ? "#9ca3af" : "#374151", fontSize: "0.85rem" }}
                      >»</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          activePage !== "dashboard" && (
            <AdminSection activePage={activePage} />
          )
        )}
      </main>
    </div>
  )
}

// ── Section router — replaces all "coming soon" stubs ──────────────────────
function AdminSection({ activePage }) {
  if (activePage === "orders")     return <OrdersSection />
  if (activePage === "inquiries")  return <InquiriesSection />
  if (activePage === "categories") return <CategoriesSection />
  if (activePage === "reviews")    return <ReviewsSection />
  if (activePage === "settings")   return <SettingsSection />
  if (activePage === "users")      return <UsersSection />
  if (activePage === "bulk-pricing") return <BulkPricingSection />
  return (
    <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e7eb' }}>
      <h2 style={{ color: '#533638', marginBottom: '0.5rem' }}>{activePage}</h2>
      <p style={{ color: '#6b7280' }}>This section is under construction.</p>
    </div>
  )
}

const tbl = {
  card: { background:'#fff', borderRadius:'0.75rem', padding:'1.5rem', border:'1px solid #e5e7eb', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  title: { fontSize:'1.25rem', fontWeight:700, color:'#111827', margin:'0 0 1.25rem 0' },
  table: { width:'100%', borderCollapse:'collapse' },
  th: { padding:'0.75rem 0.5rem', textAlign:'left', fontSize:'0.78rem', fontWeight:700, color:'#6b7280', textTransform:'uppercase', borderBottom:'2px solid #e5e7eb' },
  td: { padding:'0.85rem 0.5rem', fontSize:'0.9rem', color:'#374151', borderBottom:'1px solid #f3f4f6' },
  badge: (color) => ({ display:'inline-block', padding:'0.2rem 0.65rem', borderRadius:'2rem', fontSize:'0.75rem', fontWeight:700, background: color + '22', color }),
  empty: { textAlign:'center', padding:'2rem', color:'#9ca3af' },
  loading: { padding:'2rem', textAlign:'center', color:'#9ca3af' },
  btn: { padding:'0.4rem 0.9rem', borderRadius:'0.375rem', border:'none', cursor:'pointer', fontSize:'0.8rem', fontWeight:600 },
}

const OrdersSection = memo(function OrdersSection() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const statusColors = { pending:'#f59e0b', processing:'#3b82f6', shipped:'#8b5cf6', completed:'#10b981', cancelled:'#ef4444' }
  useEffect(() => {
    ordersApi.getAll(1, 50).then(r => { if (r.success) setOrders(r.data?.items || r.data || []); setLoading(false) })
  }, [])
  return (
    <div style={tbl.card}>
      <h2 style={tbl.title}>📦 Orders</h2>
      {loading ? <p style={tbl.loading}>Loading...</p> : orders.length === 0 ? <p style={tbl.empty}>No orders yet.</p> : (
        <table style={tbl.table}>
          <thead><tr>{['Order ID','Customer','Total','Status','Date'].map(h => <th key={h} style={tbl.th}>{h}</th>)}</tr></thead>
          <tbody>{orders.map((o,i) => (
            <tr key={o.id||i}>
              <td style={tbl.td}><strong>#{o.id?.slice(-8)||o.id}</strong></td>
              <td style={tbl.td}>{o.user?.firstName||o.user?.email||o.contactName||'—'}</td>
              <td style={tbl.td}>${(o.total||o.totalAmount||0).toFixed(2)}</td>
              <td style={tbl.td}><span style={tbl.badge(statusColors[o.status]||'#6b7280')}>{o.status||'pending'}</span></td>
              <td style={tbl.td}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
            </tr>
          ))}</tbody>
        </table>
      )}
    </div>
  )
})

const InquiriesSection = memo(function InquiriesSection() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const statusColors = { new:'#f59e0b', replied:'#10b981', closed:'#6b7280' }
  useEffect(() => {
    inquiriesApi.getAll(1, 50).then(r => { if (r.success) setInquiries(r.data?.items || r.data || []); setLoading(false) })
  }, [])
  const markReplied = async (id) => {
    const r = await inquiriesApi.markReplied(id)
    if (r.success) setInquiries(prev => prev.map(i => i.id===id ? {...i,status:'replied'} : i))
  }
  return (
    <div style={tbl.card}>
      <h2 style={tbl.title}>📬 Wholesale Inquiries</h2>
      {loading ? <p style={tbl.loading}>Loading...</p> : inquiries.length === 0 ? <p style={tbl.empty}>No inquiries yet.</p> : (
        <table style={tbl.table}>
          <thead><tr>{['Company','Email','Product','Qty','Status','Action'].map(h=><th key={h} style={tbl.th}>{h}</th>)}</tr></thead>
          <tbody>{inquiries.map((inq,i) => (
            <tr key={inq.id||i}>
              <td style={tbl.td}><strong>{inq.companyName||inq.name||'—'}</strong></td>
              <td style={tbl.td}>{inq.contactEmail||inq.email||'—'}</td>
              <td style={tbl.td}>{inq.productName||inq.product||'—'}</td>
              <td style={tbl.td}>{inq.requestedQuantity||inq.qty||'—'}</td>
              <td style={tbl.td}><span style={tbl.badge(statusColors[inq.status]||'#6b7280')}>{inq.status||'new'}</span></td>
              <td style={tbl.td}>{inq.status!=='replied'&&<button style={{...tbl.btn,background:'#d1fae5',color:'#065f46'}} onClick={()=>markReplied(inq.id)}>✓ Mark Replied</button>}</td>
            </tr>
          ))}</tbody>
        </table>
      )}
    </div>
  )
})

const CategoriesSection = memo(function CategoriesSection() {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCat, setNewCat] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    categoriesApi.getAll().then(r => { if (r.success) setCats(r.data?.items || r.data || []); setLoading(false) })
  }, [])
  const addCat = async () => {
    if (!newCat.trim()) return
    setSaving(true)
    const r = await categoriesApi.create({ name: newCat.trim() })
    if (r.success) { setCats(p => [...p, r.data]); setNewCat('') }
    setSaving(false)
  }
  return (
    <div style={tbl.card}>
      <h2 style={tbl.title}>🗂️ Categories</h2>
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem' }}>
        <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="New category name" style={{ flex:1, padding:'0.7rem 1rem', borderRadius:'0.5rem', border:'1px solid #d1d5db', fontSize:'0.9rem', outline:'none' }} />
        <button onClick={addCat} disabled={saving} style={{ ...tbl.btn, background:'#533638', color:'#fff', padding:'0.7rem 1.25rem', borderRadius:'0.5rem' }}>+ Add</button>
      </div>
      {loading ? <p style={tbl.loading}>Loading...</p> : cats.length === 0 ? <p style={tbl.empty}>No categories yet.</p> : (
        <table style={tbl.table}>
          <thead><tr>{['Name','Slug','Products'].map(h=><th key={h} style={tbl.th}>{h}</th>)}</tr></thead>
          <tbody>{cats.map((c,i) => (
            <tr key={c.id||i}>
              <td style={tbl.td}><strong>{c.name}</strong></td>
              <td style={tbl.td}>{c.slug||c.name?.toLowerCase().replace(/\s+/g,'-')}</td>
              <td style={tbl.td}>{c._count?.products ?? c.productCount ?? '—'}</td>
            </tr>
          ))}</tbody>
        </table>
      )}
    </div>
  )
})

const ReviewsSection = memo(function ReviewsSection() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    // Reviews API requires productId — fetch products first then get reviews for each
    productsApi.getAll(1, 100).then(async (pr) => {
      if (!pr.success) { setLoading(false); return }
      const products = pr.data?.items || []
      const all = []
      await Promise.allSettled(
        products.slice(0, 10).map(async (p) => {
          const r = await reviewsApi.getByProduct(p.id, 1, 20)
          if (r.success) r.data?.items?.forEach(rev => all.push({ ...rev, product: p }))
        })
      )
      setReviews(all)
      setLoading(false)
    })
  }, [])
  const stars = (n) => '★'.repeat(n||0) + '☆'.repeat(5-(n||0))
  return (
    <div style={tbl.card}>
      <h2 style={tbl.title}>⭐ Reviews</h2>
      {loading ? <p style={tbl.loading}>Loading...</p> : reviews.length === 0 ? <p style={tbl.empty}>No reviews yet.</p> : (
        <table style={tbl.table}>
          <thead><tr>{['Product','User','Rating','Comment','Date'].map(h=><th key={h} style={tbl.th}>{h}</th>)}</tr></thead>
          <tbody>{reviews.map((r,i)=>(
            <tr key={r.id||i}>
              <td style={tbl.td}>{r.product?.title||'—'}</td>
              <td style={tbl.td}>{r.reviewerEmail||r.user?.email||'—'}</td>
              <td style={{...tbl.td,color:'#f59e0b'}}>{stars(r.rating)}</td>
              <td style={{...tbl.td,maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.comment||r.content||'—'}</td>
              <td style={tbl.td}>{r.createdAt?new Date(r.createdAt).toLocaleDateString():'—'}</td>
            </tr>
          ))}</tbody>
        </table>
      )}
    </div>
  )
})

const UsersSection = memo(function UsersSection() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    import('@/services/apiClient').then(({default:ac}) =>
      ac.get('/api/protected/users',{page:1,pageSize:50})
        .then(r=>{ if(r.success) setUsers(r.data?.items||r.data||[]); setLoading(false) })
        .catch(()=>setLoading(false))
    )
  }, [])
  return (
    <div style={tbl.card}>
      <h2 style={tbl.title}>👥 Users</h2>
      {loading ? <p style={tbl.loading}>Loading...</p> : users.length === 0 ? <p style={tbl.empty}>No users found (may require elevated admin privileges).</p> : (
        <table style={tbl.table}>
          <thead><tr>{['Name','Email','Role','Joined'].map(h=><th key={h} style={tbl.th}>{h}</th>)}</tr></thead>
          <tbody>{users.map((u,i)=>(
            <tr key={u.id||i}>
              <td style={tbl.td}>{u.firstName||''} {u.lastName||''}</td>
              <td style={tbl.td}>{u.email}</td>
              <td style={tbl.td}><span style={tbl.badge(u.role==='admin'?'#f59e0b':'#6b7280')}>{u.role||'user'}</span></td>
              <td style={tbl.td}>{u.createdAt?new Date(u.createdAt).toLocaleDateString():'—'}</td>
            </tr>
          ))}</tbody>
        </table>
      )}
    </div>
  )
})

function BulkPricingSection() {
  return (
    <div style={tbl.card}>
      <h2 style={tbl.title}>💰 Bulk Pricing</h2>
      <p style={{color:'#6b7280',marginBottom:'1rem'}}>Bulk pricing is managed per product. Go to <strong>Products</strong> to set tiered pricing when creating or editing a product.</p>
      <div style={{background:'#fef3c7',border:'1px solid #fcd34d',borderRadius:'0.5rem',padding:'1rem',color:'#92400e',fontSize:'0.9rem'}}>
        💡 Tip: When creating a product, use the <strong>Bulk Pricing Tiers</strong> section to set min quantity, max quantity, and price per unit for each tier.
      </div>
    </div>
  )
}

function SettingsSection() {
  return (
    <div style={tbl.card}>
      <h2 style={tbl.title}>⚙️ Settings</h2>
      <div style={{display:'grid',gap:'1.25rem'}}>
        {[['Store Name','Pepta Wholesale'],['Contact Email','support@pepta.shopping'],['Currency','USD ($)'],['Minimum Order Value','$500']].map(([label,val])=>(
          <div key={label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem',background:'#f9fafb',borderRadius:'0.5rem'}}>
            <span style={{fontWeight:600,color:'#374151'}}>{label}</span>
            <span style={{color:'#6b7280'}}>{val}</span>
          </div>
        ))}
        <p style={{fontSize:'0.8rem',color:'#9ca3af',marginTop:'0.5rem'}}>Settings management coming in next update.</p>
      </div>
    </div>
  )
}
