import { useState, useEffect } from "react"
import { productsApi } from "@/services/api"
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

// Mock data
const mockStats = [
  { label: "Total Orders", value: "1,234", change: "+12.5%", icon: FaShoppingCart, bgColor: colors.info },
  { label: "Total Revenue", value: "$45,231", change: "+8.2%", icon: FaDollarSign, bgColor: colors.success },
  { label: "Total Products", value: "156", change: "+5 new", icon: FaBox, bgColor: colors.warning },
  { label: "Total Users", value: "892", change: "+23 this month", icon: FaUsers, bgColor: colors.sidebar },
]

const mockOrders = [
  { id: "#ORD-001", customer: "John Doe", total: "$2,500", status: "Pending", date: "2024-04-20" },
  { id: "#ORD-002", customer: "Jane Smith", total: "$5,200", status: "Processing", date: "2024-04-19" },
  { id: "#ORD-003", customer: "Bob Johnson", total: "$1,800", status: "Shipped", date: "2024-04-18" },
  { id: "#ORD-004", customer: "Alice Brown", total: "$3,400", status: "Completed", date: "2024-04-17" },
]

const mockInquiries = [
  { id: 1, name: "Wholesale Buyer Co.", email: "buyer@example.com", product: "Fashion Dolls", qty: 500, status: "New" },
  { id: 2, name: "Retail Store Ltd.", email: "store@example.com", product: "RC Cars", qty: 200, status: "Replied" },
  { id: 3, name: "Gift Shop Inc.", email: "gifts@example.com", product: "Barbie Dolls", qty: 100, status: "New" },
]

const getStatusBadge = (status) => {
  const statusMap = {
    Pending: styles.badgePending,
    Processing: styles.badgeProcessing,
    Shipped: styles.badgeShipped,
    Completed: styles.badgeCompleted,
  }
  return statusMap[status] || styles.badgePending
}

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hoveredStat, setHoveredStat] = useState(null)
  const [hoveredTableRow, setHoveredTableRow] = useState(null)
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [productForm, setProductForm] = useState({
    title: "",
    brand: "",
    description: "",
    price: "",
    stock: "",
    categoryName: "General",
    moq: "",
    casePackSize: "",
    tieredPricingJson: "",
    specsText: "",
  })
  const [formMessage, setFormMessage] = useState("")
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isMobile = window.innerWidth < 768

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: FaChartLine },
    { id: "products", label: "Products", icon: FaBox },
    { id: "categories", label: "Categories", icon: FaList },
    { id: "bulk-pricing", label: "Bulk Pricing", icon: FaMoneyBillWave },
    { id: "orders", label: "Orders", icon: FaShoppingCart },
    { id: "inquiries", label: "Inquiries", icon: FaInbox },
    { id: "users", label: "Users", icon: FaUsers },
    { id: "reviews", label: "Reviews", icon: FaStar },
    { id: "settings", label: "Settings", icon: FaCog },
  ]

  useEffect(() => {
    if (activePage !== "products") return

    const fetchProducts = async () => {
      setLoadingProducts(true)
      setFormError("")
      try {
        const response = await productsApi.getAll(1, 100)
        if (response.success) {
          setProducts(response.data?.items || [])
        } else {
          setFormError(response.message || "Failed to load products")
        }
      } catch (error) {
        setFormError(error.message || "Failed to load products")
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [activePage])

  const handleFormChange = (field) => (event) => {
    setProductForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const handleCreateProduct = async (event) => {
    event.preventDefault()
    setFormError("")
    setFormMessage("")
    setIsSubmitting(true)

    let tieredPricing = []
    try {
      tieredPricing = productForm.tieredPricingJson ? JSON.parse(productForm.tieredPricingJson) : []
      if (!Array.isArray(tieredPricing)) {
        throw new Error("Bulk pricing must be a JSON array.")
      }
    } catch (error) {
      setFormError("Bulk pricing must be valid JSON.")
      setIsSubmitting(false)
      return
    }

    const specs = productForm.specsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .reduce((acc, line) => {
        const [key, ...rest] = line.split(":")
        if (!key || rest.length === 0) return acc
        acc[key.trim()] = rest.join(":").trim()
        return acc
      }, {})

    try {
      const response = await productsApi.create({
        title: productForm.title,
        brand: productForm.brand,
        description: productForm.description,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        categoryName: productForm.categoryName,
        moq: Number(productForm.moq),
        casePackSize: Number(productForm.casePackSize),
        tieredPricing,
        specs,
      })

      if (!response.success) {
        setFormError(response.message || "Unable to create product")
        return
      }

      setFormMessage("Product created successfully.")
      setProductForm({
        title: "",
        brand: "",
        description: "",
        price: "",
        stock: "",
        categoryName: "General",
        moq: "",
        casePackSize: "",
        tieredPricingJson: "",
        specsText: "",
      })
      const refreshed = await productsApi.getAll(1, 100)
      if (refreshed.success) {
        setProducts(refreshed.data?.items || [])
      }
    } catch (error) {
      setFormError(error.message || "Unable to create product")
    } finally {
      setIsSubmitting(false)
    }
  }

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

        <button style={{ ...styles.navItem, marginTop: "auto" }}>
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
            <div style={styles.inquiryAlert}>
              <FaExclamationCircle style={styles.inquiryAlertIcon} />
              <div style={styles.inquiryAlertContent}>
                <p style={styles.inquiryAlertText}>3 new wholesale inquiries awaiting response!</p>
              </div>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#d97706", fontWeight: 600 }} onClick={() => setActivePage("inquiries")}>
                View →
              </button>
            </div>

            {/* Page Header */}
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Dashboard</h1>
              <p style={styles.pageSubtitle}>Welcome back! Here&apos;s your business overview.</p>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              {mockStats.map((stat, idx) => {
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
                    {mockOrders.map((order, idx) => (
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
                        <td style={styles.tableCell}>{order.customer}</td>
                        <td style={styles.tableCell}>{order.total}</td>
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
                    {mockInquiries.map((inquiry, idx) => (
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
                          <strong>{inquiry.name}</strong>
                        </td>
                        <td style={styles.tableCell}>{inquiry.product}</td>
                        <td style={styles.tableCell}>{inquiry.qty}</td>
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

              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="tieredPricingJson">Bulk Pricing Tiers (JSON)</label>
                <textarea
                  id="tieredPricingJson"
                  value={productForm.tieredPricingJson}
                  onChange={handleFormChange("tieredPricingJson")}
                  style={styles.formTextarea}
                  placeholder='[{"min":10,"max":50,"price":850,"unit":"per unit"}, ...]'
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="specsText">Product Specs</label>
                <textarea
                  id="specsText"
                  value={productForm.specsText}
                  onChange={handleFormChange("specsText")}
                  style={styles.formTextarea}
                  placeholder="Height: 30cm\nMaterial: Premium Vinyl\nPackage: 50 units per case"
                />
              </div>

              <button type="submit" style={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "Creating product..." : "Create Wholesale Product"}
              </button>
            </form>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", color: "#111827" }}>
                Current Catalog
              </h3>
              {loadingProducts ? (
                <div style={{ color: "#374151" }}>Loading products...</div>
              ) : (
                <table style={styles.productTable}>
                  <thead>
                    <tr>
                      <th style={styles.productTableHeader}>Title</th>
                      <th style={styles.productTableHeader}>Brand</th>
                      <th style={styles.productTableHeader}>Category</th>
                      <th style={styles.productTableHeader}>Price</th>
                      <th style={styles.productTableHeader}>Stock</th>
                      <th style={styles.productTableHeader}>MOQ</th>
                      <th style={styles.productTableHeader}>Case Pack</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.id} style={styles.productTableRow}>
                          <td style={styles.productTableCell}>{product.title || product.name}</td>
                          <td style={styles.productTableCell}>{product.brand || "—"}</td>
                          <td style={styles.productTableCell}>{product.category || product.categoryName || "General"}</td>
                          <td style={styles.productTableCell}>${(product.price || 0).toFixed(2)}</td>
                          <td style={styles.productTableCell}>{product.stock ?? 0}</td>
                          <td style={styles.productTableCell}>{product.moq ?? "—"}</td>
                          <td style={styles.productTableCell}>{product.casePackSize ?? "—"}</td>
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
              )}
            </div>
          </div>
        ) : (
          activePage !== "dashboard" && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>{navigationItems.find((i) => i.id === activePage)?.label}</h2>
              <p style={{ color: "#6b7280", marginTop: "1rem" }}>Page content coming soon...</p>
            </div>
          )
        )}
      </main>
    </div>
  )
}
